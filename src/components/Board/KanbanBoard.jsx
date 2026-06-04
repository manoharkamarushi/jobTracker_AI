import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { KANBAN_COLUMNS } from '../../db/indexedDB';
import KanbanColumn from './KanbanColumn';
import JobCard from './JobCard';

export default function KanbanBoard({ jobs, onEdit, onDelete, onUpdateJob }) {
  const [activeJob, setActiveJob] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragStart({ active }) {
    setActiveJob(jobs.find((j) => j.id === active.id) ?? null);
  }

  function handleDragEnd({ active, over }) {
    setActiveJob(null);
    if (!over || !activeJob) return;

    // over.id is either a column key or another card's id
    let targetColumn = over.id;
    if (!KANBAN_COLUMNS[targetColumn]) {
      // dropped onto a card — find that card's column
      const overJob = jobs.find((j) => j.id === over.id);
      if (overJob) targetColumn = overJob.status;
    }

    if (targetColumn && targetColumn !== activeJob.status) {
      onUpdateJob({ ...activeJob, status: targetColumn });
    }
  }

  function handleDragCancel() {
    setActiveJob(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-200px)] items-start">
        {Object.entries(KANBAN_COLUMNS).map(([key, title]) => (
          <KanbanColumn
            key={key}
            columnKey={key}
            title={title}
            jobs={jobs.filter((j) => j.status === key)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeJob ? (
          <JobCard job={activeJob} columnKey={activeJob.status} overlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
