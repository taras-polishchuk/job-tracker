export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function highlightText(text, query) {
  if (!query?.trim() || !text) return escapeHtml(text ?? '');
  const safe = escapeHtml(String(text));
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${escaped})`, 'gi');
  return safe.replace(re, '<mark class="hl">$1</mark>');
}

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function filterJobs(jobs, { searchQuery, filterStatus, filterTags, filterPriority }) {
  const q = (searchQuery ?? '').toLowerCase().trim();
  return jobs.filter(job => {
    if (q) {
      const hit =
        (job.company ?? '').toLowerCase().includes(q) ||
        (job.position ?? '').toLowerCase().includes(q) ||
        (job.link ?? '').toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (filterStatus && job.status !== filterStatus) return false;
    if (filterPriority && job.priority !== filterPriority) return false;
    if (filterTags?.length) {
      if (!filterTags.every(t => job.tags?.includes(t))) return false;
    }
    return true;
  });
}

export function getUniqueTags(jobs) {
  const set = new Set();
  jobs.forEach(j => j.tags?.forEach(t => set.add(t)));
  return [...set].sort();
}
