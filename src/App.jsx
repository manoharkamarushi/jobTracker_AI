import { useState, useCallback } from 'react';
import { useJobs } from './hooks/useJobs';
import KanbanBoard from './components/Board/KanbanBoard';
import FilterBar from './components/Filters/FilterBar';
import OffersTable from './components/Offers/OffersTable';
import JobFormModal from './components/Modals/JobFormModal';

const VIEWS = { kanban: 'kanban', offers: 'offers' };

export default function App() {
  const { jobs, loading, addJob, updateJob, deleteJob } = useJobs();

  const [view, setView] = useState(VIEWS.kanban);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Stable reference so FilterBar's useEffect doesn't loop
  const handleFilterChange = useCallback((result) => {
    setFilteredJobs(result);
  }, []);

  function openAddModal() {
    setEditingJob(null);
    setModalOpen(true);
  }

  function openEditModal(job) {
    setEditingJob(job);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingJob(null);
  }

  async function handleSubmit(formData) {
    if (editingJob) {
      await updateJob({ ...formData, id: editingJob.id, dateAdded: editingJob.dateAdded });
    } else {
      await addJob(formData);
    }
    closeModal();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center gap-4">
          {/* Brand */}
          <span className="text-lg font-bold text-gray-800 mr-4 whitespace-nowrap">
            💼 JobTracker
          </span>

          {/* View tabs */}
          <nav className="flex gap-1">
            <TabBtn
              active={view === VIEWS.kanban}
              onClick={() => setView(VIEWS.kanban)}
            >
              Kanban Board
            </TabBtn>
            <TabBtn
              active={view === VIEWS.offers}
              onClick={() => setView(VIEWS.offers)}
            >
              Offers
            </TabBtn>
          </nav>

          <div className="flex-1" />

          {/* Global add button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Add Job
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-6 py-5 flex flex-col gap-4">
        {view === VIEWS.kanban ? (
          <>
            <FilterBar jobs={jobs} onFilterChange={handleFilterChange} />
            <KanbanBoard
              jobs={filteredJobs}
              onEdit={openEditModal}
              onDelete={deleteJob}
              onUpdateJob={updateJob}
            />
          </>
        ) : (
          <OffersTable jobs={jobs} />
        )}
      </main>

      {/* Add / Edit modal */}
      <JobFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingJob}
      />
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
