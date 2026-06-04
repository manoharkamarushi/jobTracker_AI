import { useState, useEffect, useCallback } from 'react';
import {
  getAllJobs,
  addJob as dbAddJob,
  updateJob as dbUpdateJob,
  deleteJob as dbDeleteJob,
} from '../db/indexedDB';

// Module-level flag prevents React 18 StrictMode double-effect race where
// both concurrent init() calls read an empty DB and both seed, creating duplicates.
let seedLock = false;

const SEED = [
  {
    companyName: 'Google',
    jobTitle: 'Software Engineer II',
    applicationUrl: 'https://linkedin.com/jobs/view/123',
    resumeUsed: 'SWE_v3',
    status: 'interview',
    isReferral: true,
    referredBy: 'Rahul M.',
    tags: ['tier-1', 'urgent'],
    expectedCTC: '30 LPA',
    offeredCTC: '',
    notes: 'L4 role, DS&A focused interviews',
    dateAdded: new Date().toISOString(),
  },
  {
    companyName: 'Zepto',
    jobTitle: 'Product Engineer',
    applicationUrl: 'https://naukri.com/job/456',
    resumeUsed: 'product_resume',
    status: 'applied',
    isReferral: false,
    referredBy: '',
    tags: ['startup', 'equity'],
    expectedCTC: '22 LPA',
    offeredCTC: '',
    notes: '',
    dateAdded: new Date().toISOString(),
  },
  {
    companyName: 'Razorpay',
    jobTitle: 'Frontend Engineer',
    applicationUrl: 'https://linkedin.com/jobs/view/789',
    resumeUsed: 'SWE_v3',
    status: 'offer',
    isReferral: true,
    referredBy: 'Sneha K.',
    tags: ['fintech', 'tier-1'],
    expectedCTC: '25 LPA',
    offeredCTC: '27 LPA',
    notes: 'Negotiated up from 25',
    dateAdded: new Date().toISOString(),
  },
];

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      let data = await getAllJobs();
      if (data.length === 0 && !seedLock) {
        seedLock = true;
        await Promise.all(SEED.map((j) => dbAddJob(j)));
        data = await getAllJobs();
      }
      setJobs(data);
      setLoading(false);
    }
    init();
  }, []);

  const addJob = useCallback(async (job) => {
    const id = await dbAddJob(job);
    setJobs((prev) => [...prev, { ...job, id, dateAdded: job.dateAdded ?? new Date().toISOString() }]);
    return id;
  }, []);

  const updateJob = useCallback(async (job) => {
    await dbUpdateJob(job);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
  }, []);

  const deleteJob = useCallback(async (id) => {
    await dbDeleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  return { jobs, loading, addJob, updateJob, deleteJob };
}
