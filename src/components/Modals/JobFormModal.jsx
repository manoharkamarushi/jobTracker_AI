import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { KANBAN_COLUMNS } from '../../db/indexedDB';
import Toggle from '../UI/Toggle';

const EMPTY = {
  companyName: '',
  jobTitle: '',
  applicationUrl: '',
  resumeUsed: '',
  status: 'saved',
  isReferral: false,
  referredBy: '',
  tags: [],
  expectedCTC: '',
  offeredCTC: '',
  notes: '',
};

export default function JobFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(EMPTY);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(initialData ? { ...EMPTY, ...initialData } : EMPTY);
      setTagInput('');
    }
  }, [isOpen, initialData]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function commitTag() {
    const tag = tagInput.trim().replace(/,+$/, '');
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitTag();
    } else if (e.key === 'Backspace' && tagInput === '') {
      setForm((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
    }
  }

  function removeTag(tag) {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (tagInput.trim()) commitTag();
    // use functional update to get latest tags after commitTag
    setForm((latest) => {
      onSubmit(latest);
      return latest;
    });
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                {initialData ? 'Edit Job' : 'Add Job'}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Company Name" required>
                <input
                  required
                  value={form.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Google"
                />
              </Field>

              <Field label="Job Title" required>
                <input
                  required
                  value={form.jobTitle}
                  onChange={(e) => set('jobTitle', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Software Engineer II"
                />
              </Field>

              <Field label="Application URL">
                <input
                  type="url"
                  value={form.applicationUrl}
                  onChange={(e) => set('applicationUrl', e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
              </Field>

              <Field label="Resume Used">
                <input
                  value={form.resumeUsed}
                  onChange={(e) => set('resumeUsed', e.target.value)}
                  className={inputCls}
                  placeholder="e.g. SWE_v3"
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  className={inputCls + ' bg-white'}
                >
                  {Object.entries(KANBAN_COLUMNS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </Field>

              <div className="flex items-center justify-between py-1">
                <label className="text-sm font-medium text-gray-700">Is Referral?</label>
                <Toggle value={form.isReferral} onChange={(v) => set('isReferral', v)} />
              </div>

              {form.isReferral && (
                <Field label="Referred By">
                  <input
                    value={form.referredBy}
                    onChange={(e) => set('referredBy', e.target.value)}
                    className={inputCls}
                    placeholder="Name of referrer"
                  />
                </Field>
              )}

              <Field label="Tags">
                <div className="flex flex-wrap gap-1.5 border border-gray-300 rounded-lg px-3 py-2 min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 cursor-text">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs rounded-full px-2 py-0.5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900 leading-none font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={commitTag}
                    className="flex-1 min-w-[80px] outline-none text-sm bg-transparent"
                    placeholder={form.tags.length === 0 ? 'Type and press Enter or comma…' : ''}
                  />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Expected CTC">
                  <input
                    value={form.expectedCTC}
                    onChange={(e) => set('expectedCTC', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 18 LPA"
                  />
                </Field>
                <Field label="Offered CTC">
                  <input
                    value={form.offeredCTC}
                    onChange={(e) => set('offeredCTC', e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 20 LPA"
                  />
                </Field>
              </div>

              <Field label="Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
              </Field>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  {initialData ? 'Save Changes' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
