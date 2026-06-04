import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import Badge from '../UI/Badge';
import Tooltip from '../UI/Tooltip';

export default function JobCard({ job, onEdit, onDelete, columnKey, overlay = false }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  if (overlay) {
    return (
      <div className="bg-white rounded-lg p-3 shadow-xl border-2 border-blue-400 w-64 rotate-2 cursor-grabbing">
        <p className="font-semibold text-sm text-gray-800">{job.companyName}</p>
        <p className="text-xs text-gray-500">{job.jobTitle}</p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 group hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing select-none"
      {...attributes}
      {...listeners}
    >
      {/* Header: company + action buttons */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-gray-800 leading-tight truncate">{job.companyName}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{job.jobTitle}</p>
        </div>
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {!confirmDelete ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(job); }}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xs"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 text-xs"
                title="Delete"
              >
                🗑️
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-red-500 font-medium">Sure?</span>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                className="px-1.5 py-0.5 bg-red-500 text-white rounded"
              >
                Yes
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Referral badge */}
      {job.isReferral && (
        <div className="mt-1.5">
          <Tooltip content={`Referred by ${job.referredBy || 'someone'}`}>
            <span className="inline-block text-xs bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 cursor-default">
              🤝 Referral
            </span>
          </Tooltip>
        </div>
      )}

      {/* Application URL */}
      {job.applicationUrl && (
        <a
          href={job.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="block mt-1.5 text-xs text-blue-500 hover:underline truncate"
          title={job.applicationUrl}
        >
          📎 {job.applicationUrl}
        </a>
      )}

      {/* Resume */}
      {job.resumeUsed && (
        <p className="mt-1 text-xs text-gray-500">📄 {job.resumeUsed}</p>
      )}

      {/* CTC — offered (green) in offer column only, otherwise expected */}
      {columnKey === 'offer' && job.offeredCTC ? (
        <p className="mt-1 text-xs font-semibold text-emerald-600">💰 Offered: {job.offeredCTC}</p>
      ) : job.expectedCTC ? (
        <p className="mt-1 text-xs text-gray-500">💰 Expected: {job.expectedCTC}</p>
      ) : null}

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {job.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      {/* Date */}
      {job.dateAdded && (
        <p className="mt-2 text-xs text-gray-400">
          📅 {format(new Date(job.dateAdded), 'dd MMM yyyy')}
        </p>
      )}
    </div>
  );
}
