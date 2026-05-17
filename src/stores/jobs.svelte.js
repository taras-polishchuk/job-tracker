import { loadJobs, saveJobs } from '../lib/storage.js';
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

  add(data) {
    const job = {
      ...DEFAULTS,
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    this.jobs = [...this.jobs, job];
    saveJobs(this.jobs);
    return job;
  }

  update(id, updates) {
    this.jobs = this.jobs.map(j => (j.id === id ? { ...j, ...updates } : j));
    saveJobs(this.jobs);
  }

  remove(id) {
    this.jobs = this.jobs.filter(j => j.id !== id);
    saveJobs(this.jobs);
  }

  moveToStatus(id, status) {
    this.update(id, { status });
  }

  exportJSON() {
    return JSON.stringify(this.jobs, null, 2);
  }

  importJSON(str) {
    try {
      const data = JSON.parse(str);
      if (!Array.isArray(data)) throw new Error('Expected an array');
      this.jobs = data;
      saveJobs(data);
      return { ok: true, count: data.length };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}

export const jobStore = new JobStore();
