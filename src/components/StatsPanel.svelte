<script>
  import { jobStore } from '../stores/jobs.svelte.js';
  import { COLUMNS } from '../lib/constants.js';

  let total = $derived(jobStore.jobs.length);
  let offered = $derived(jobStore.jobs.filter(j => j.status === 'Offer').length);
  let rejected = $derived(jobStore.jobs.filter(j => j.status === 'Rejected').length);
  let active = $derived(jobStore.jobs.filter(j => j.status !== 'Rejected' && j.status !== 'Wishlist').length);
  let responseRate = $derived(
    total > 0 ? Math.round((jobStore.jobs.filter(j => j.status !== 'Wishlist' && j.status !== 'Applied').length / Math.max(jobStore.jobs.filter(j => j.status !== 'Wishlist').length, 1)) * 100) : 0
  );

  let byStatus = $derived(
    COLUMNS.map(col => ({
      col,
      count: jobStore.jobs.filter(j => j.status === col).length,
    })).filter(x => x.count > 0)
  );

  let highPriority = $derived(jobStore.jobs.filter(j => j.priority === 'high' && j.status !== 'Rejected').length);
</script>

<div class="stats">
  <div class="stat-cards">
    <div class="stat-card">
      <div class="stat-val">{total}</div>
      <div class="stat-label">Total Applications</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">{active}</div>
      <div class="stat-label">Active</div>
    </div>
    <div class="stat-card accent-green">
      <div class="stat-val">{offered}</div>
      <div class="stat-label">Offers</div>
    </div>
    <div class="stat-card accent-red">
      <div class="stat-val">{rejected}</div>
      <div class="stat-label">Rejected</div>
    </div>
    <div class="stat-card accent-orange">
      <div class="stat-val">{highPriority}</div>
      <div class="stat-label">High Priority</div>
    </div>
    <div class="stat-card accent-purple">
      <div class="stat-val">{responseRate}%</div>
      <div class="stat-label">Response Rate</div>
    </div>
  </div>

  {#if byStatus.length > 0}
    <div class="stat-bar-wrap">
      {#each byStatus as { col, count }}
        <div class="bar-item" title="{col}: {count}">
          <div class="bar-fill" style="width: {Math.round((count / total) * 100)}%"></div>
          <span class="bar-label">{col} <strong>{count}</strong></span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .stats {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 14px 20px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .stat-cards {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .stat-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 18px;
    text-align: center;
    min-width: 88px;
  }
  .stat-card.accent-green .stat-val { color: #16a34a; }
  .stat-card.accent-red   .stat-val { color: #dc2626; }
  .stat-card.accent-orange .stat-val { color: #d97706; }
  .stat-card.accent-purple .stat-val { color: var(--accent); }

  .stat-val {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    color: var(--text);
  }
  .stat-label { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .stat-bar-wrap {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
  }

  .bar-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-2);
  }

  .bar-fill {
    height: 6px;
    background: var(--accent);
    border-radius: 3px;
    opacity: 0.7;
    min-width: 4px;
    transition: width 0.4s ease;
  }

  .bar-label { white-space: nowrap; }
  .bar-label strong { color: var(--text); }
</style>
