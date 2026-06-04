import { useState, useMemo, useEffect, useCallback } from 'react';
import Toggle from '../UI/Toggle';

export default function FilterBar({ jobs, onFilterChange }) {
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [referralOnly, setReferralOnly] = useState(false);
  const [hasOffer, setHasOffer] = useState(false);

  const allTags = useMemo(() => {
    const seen = new Set();
    jobs.forEach((j) => j.tags?.forEach((t) => seen.add(t)));
    return [...seen].sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = jobs;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.companyName.toLowerCase().includes(q) ||
          j.jobTitle.toLowerCase().includes(q)
      );
    }
    if (activeTags.length > 0) {
      result = result.filter((j) => activeTags.every((t) => j.tags?.includes(t)));
    }
    if (referralOnly) result = result.filter((j) => j.isReferral);
    if (hasOffer) result = result.filter((j) => !!j.offeredCTC);
    return result;
  }, [jobs, search, activeTags, referralOnly, hasOffer]);

  useEffect(() => {
    onFilterChange(filtered);
  }, [filtered, onFilterChange]);

  function toggleTag(tag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function clearAll() {
    setSearch('');
    setActiveTags([]);
    setReferralOnly(false);
    setHasOffer(false);
  }

  const hasActiveFilters = search || activeTags.length > 0 || referralOnly || hasOffer;

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or title…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Referrals only */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">🤝 Referrals only</span>
          <Toggle value={referralOnly} onChange={setReferralOnly} />
        </div>

        {/* Has offer */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">💰 Has offer</span>
          <Toggle value={hasOffer} onChange={setHasOffer} />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                activeTags.includes(tag)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              🏷 {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
