import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import Badge from '../UI/Badge';

function parseCtc(str) {
  if (!str) return -Infinity;
  const n = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? -Infinity : n;
}

const COLS = [
  { key: 'companyName',  label: 'Company' },
  { key: 'jobTitle',     label: 'Job Title' },
  { key: 'referredBy',   label: 'Referred By' },
  { key: 'expectedCTC',  label: 'Expected CTC' },
  { key: 'offeredCTC',   label: 'Offered CTC' },
  { key: 'tags',         label: 'Tags' },
  { key: 'notes',        label: 'Notes' },
  { key: 'dateAdded',    label: 'Date Added' },
];

export default function OffersTable({ jobs }) {
  const offerJobs = useMemo(
    () => jobs.filter((j) => j.status === 'offer'),
    [jobs]
  );

  const [sortKey, setSortKey] = useState('offeredCTC');
  const [sortDir, setSortDir] = useState('desc');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const maxOfferedCtc = useMemo(
    () => Math.max(...offerJobs.map((j) => parseCtc(j.offeredCTC))),
    [offerJobs]
  );

  const sorted = useMemo(() => {
    return [...offerJobs].sort((a, b) => {
      let av = a[sortKey] ?? '';
      let bv = b[sortKey] ?? '';
      if (sortKey === 'offeredCTC' || sortKey === 'expectedCTC') {
        av = parseCtc(String(av));
        bv = parseCtc(String(bv));
      } else if (sortKey === 'dateAdded') {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      } else {
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [offerJobs, sortKey, sortDir]);

  if (offerJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="text-5xl mb-4">💼</span>
        <p className="text-lg font-medium">No offers yet</p>
        <p className="text-sm mt-1">Move a job to the "Offer / Rejected" column to see it here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {COLS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 whitespace-nowrap select-none"
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((job) => {
            const isBest =
              parseCtc(job.offeredCTC) === maxOfferedCtc &&
              maxOfferedCtc !== -Infinity;
            return (
              <tr
                key={job.id}
                className={`border-b border-gray-100 last:border-0 transition-colors ${
                  isBest ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {isBest && <span className="mr-1" title="Best offer">🏆</span>}
                  {job.companyName}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{job.jobTitle}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {job.isReferral ? job.referredBy || '—' : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{job.expectedCTC || '—'}</td>
                <td className={`px-4 py-3 font-semibold whitespace-nowrap ${isBest ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {job.offeredCTC || '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {job.tags?.length > 0
                      ? job.tags.map((t) => <Badge key={t}>{t}</Badge>)
                      : <span className="text-gray-400">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate" title={job.notes}>
                  {job.notes || '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                  {job.dateAdded ? format(new Date(job.dateAdded), 'dd MMM yyyy') : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
