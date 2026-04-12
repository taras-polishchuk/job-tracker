const KEY = 'cv_tracker_v1';

export function loadJobs() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultJobs();
  } catch {
    return defaultJobs();
  }
}

export function saveJobs(jobs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(jobs));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

function defaultJobs() {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: 'sample-1',
      company: 'Shopify Agency XYZ',
      position: 'Shopify Developer',
      link: 'https://linkedin.com/jobs',
      platform: 'LinkedIn',
      status: 'Applied',
      dateApplied: today,
      priority: 'high',
      tags: ['Shopify', 'Liquid', 'Remote'],
      notes: 'Looks like a great team. 4-day work week.',
      coverLetter: '',
      resume: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      company: 'E-commerce Solutions',
      position: 'Frontend Developer',
      link: 'https://djinni.co/jobs',
      platform: 'Djinni',
      status: 'Screening',
      dateApplied: today,
      priority: 'medium',
      tags: ['React', 'TypeScript'],
      notes: 'HR reached out. Waiting for tech interview.',
      coverLetter: '',
      resume: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      company: 'Startup Labs',
      position: 'Svelte Developer',
      link: 'https://dou.ua/jobs',
      platform: 'DOU',
      status: 'Wishlist',
      dateApplied: '',
      priority: 'low',
      tags: ['Svelte', 'Remote'],
      notes: 'Check back in a month.',
      coverLetter: '',
      resume: null,
      createdAt: new Date().toISOString(),
    },
  ];
}
