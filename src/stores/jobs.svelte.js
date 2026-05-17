import { loadJobs, saveJobs, KEY } from '../lib/storage.js';
import { saveResume, loadAllResumes, deleteResume } from '../lib/idb.js';
import { generateId } from '../lib/utils.js';

const DEFAULTS = {
  company: '',
  position: '',
  link: '',
  platform: 'LinkedIn',
  status: 'Wishlist',
  dateApplied: new Date().toISOString().slice(0, 10),
  priority: 'medium',
  tags: [],
  notes: '',
  coverLetter: '',
  resume: null,
};

class JobStore {
  jobs = $state(loadJobs());

  // Called once on app mount — merges resume blobs from IndexedDB into in-memory jobs
  async loadResumes() {
    try {
      const resumeMap = await loadAllResumes();
      if (Object.keys(resumeMap).length === 0) return;
      this.jobs = this.jobs.map(j => (resumeMap[j.id] ? { ...j, resume: resumeMap[j.id] } : j));
    } catch (e) {
      console.warn('Failed to load resumes from IndexedDB:', e);
    }
  }

  add(data) {
    const job = {
      ...DEFAULTS,
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    this.jobs = [...this.jobs, job];
    saveJobs(this.jobs);
    if (job.resume?.data) {
      saveResume(job.id, job.resume).catch(e => console.warn('Resume save failed:', e));
    }
    return job;
  }

  update(id, updates) {
    this.jobs = this.jobs.map(j => (j.id === id ? { ...j, ...updates } : j));
    saveJobs(this.jobs);
    if ('resume' in updates) {
      if (updates.resume?.data) {
        saveResume(id, updates.resume).catch(e => console.warn('Resume save failed:', e));
      } else {
        deleteResume(id).catch(e => console.warn('Resume delete failed:', e));
      }
    }
  }

  remove(id) {
    this.jobs = this.jobs.filter(j => j.id !== id);
    saveJobs(this.jobs);
    deleteResume(id).catch(e => console.warn('Resume delete failed:', e));
  }

  moveToStatus(id, status) {
    this.update(id, { status });
  }

  exportJSON() {
    return JSON.stringify(this.jobs, null, 2);
  }

  async importJSON(str) {
    try {
      const data = JSON.parse(str);
      if (!Array.isArray(data)) throw new Error('Expected an array');

      // Save resume blobs to IndexedDB first
      await Promise.all(
        data
          .filter(job => job.resume?.data)
          .map(job => saveResume(job.id, job.resume))
      );

      // Strip resume.data before writing to localStorage to stay within the quota
      const stripped = data.map(j =>
        j.resume?.data ? { ...j, resume: { name: j.resume.name, type: j.resume.type } } : j
      );
      localStorage.setItem(KEY, JSON.stringify(stripped));

      // Keep full data (with resume blobs) in memory for immediate use
      this.jobs = data;
      return { ok: true, count: data.length };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}

export const jobStore = new JobStore();
