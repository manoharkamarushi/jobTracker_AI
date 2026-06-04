import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import JobCard from './JobCard';

export default function KanbanColumn({ columnKey, title, jobs, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: columnKey });

  return (
    <div
      className={`flex flex-col w-64 flex-shrink-0 rounded-xl p-3 transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-100'
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</h2>
        <span className="text-xs bg-gray-200 text-gray-500 rounded-full px-2 py-0.5 font-medium">
          {jobs.length}
        </span>
      </div>

      {/* Drop zone */}
      <div ref={setNodeRef} className="flex flex-col gap-2 flex-1 min-h-[80px]">
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-6 select-none">No jobs here yet</p>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                columnKey={columnKey}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
