<script>
  import { uiStore } from '../stores/ui.svelte.js';
  import { jobStore } from '../stores/jobs.svelte.js';
  import { highlightText, formatDate } from '../lib/utils.js';
  import { PRIORITY_CONFIG } from '../lib/constants.js';

  let { job } = $props();

  let isDragging = $state(false);

  function onDragStart(e) {
    e.dataTransfer.setData('text/plain', job.id);
    e.dataTransfer.effectAllowed = 'move';
    uiStore.draggingId = job.id;
    // Small delay so the drag ghost shows the card properly
    setTimeout(() => { isDragging = true; }, 0);
  }

  function onDragEnd() {
    isDragging = false;
    uiStore.draggingId = null;
  }

  function handleDelete(e) {
    e.stopPropagation();
    if (confirm(`Delete "${job.company} — ${job.position}"?`)) {
      jobStore.remove(job.id);
    }
  }

  let q = $derived(uiStore.searchQuery);
  let pCfg = $derived(PRIORITY_CONFIG[job.priority] ?? PRIORITY_CONFIG.medium);
</script>

<div
  class="card"
  class:is-dragging={isDragging}
  class:is-being-dragged={uiStore.draggingId === job.id && !isDragging}
  draggable="true"
  ondragstart={onDragStart}
  ondragend={onDragEnd}
  role="button"
  tabindex="0"
  onclick={() => uiStore.openEdit(job)}
  onkeydown={(e) => e.key === 'Enter' && uiStore.openEdit(job)}
>
  <!-- Priority bar -->
  <div class="priority-bar" style="background: {pCfg.color}"></div>

  <div class="card-body">
    <!-- Header row -->
    <div class="card-head">
      <div class="company">
        {@html highlightText(job.company || 'Company', q)}
      </div>
      <button class="delete-btn" onclick={handleDelete} title="Delete" tabindex="-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Position -->
    <div class="position">
      {@html highlightText(job.position || 'Position', q)}
    </div>

    <!-- Meta row -->
    <div class="meta">
      {#if job.platform}
        <span class="platform">{job.platform}</span>
      {/if}
      {#if job.dateApplied}
        <span class="date">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formatDate(job.dateApplied)}
        </span>
      {/if}
    </div>

    <!-- Link -->
    {#if job.link}
      <a
        class="job-link"
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        onclick={(e) => e.stopPropagation()}
        title={job.link}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        {@html highlightText(job.link, q)}
      </a>
    {/if}

    <!-- Tags -->
    {#if job.tags?.length}
      <div class="tags">
        {#each job.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}

    <!-- Notes snippet -->
    {#if job.notes}
      <div class="notes-preview">{job.notes}</div>
    {/if}
  </div>
</div>

<style>
  .card {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--sh);
    cursor: grab;
    transition: box-shadow 0.15s, transform 0.15s, opacity 0.15s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    box-shadow: var(--sh-md);
    transform: translateY(-1px);
  }

  .card:active { cursor: grabbing; }

  .card.is-dragging {
    opacity: 0.35;
    transform: scale(0.97);
  }

  .priority-bar {
    height: 3px;
    width: 100%;
    flex-shrink: 0;
    opacity: 0.8;
  }

  .card-body {
    padding: 10px 11px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 6px;
  }

  .company {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
    flex: 1;
    min-width: 0;
  }

  .position {
    font-size: 12.5px;
    color: var(--text-2);
    line-height: 1.35;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 1px;
  }

  .platform {
    font-size: 11px;
    font-weight: 500;
    color: var(--accent);
    background: rgba(99,102,241,0.08);
    border-radius: 4px;
    padding: 1px 6px;
    line-height: 1.6;
  }

  .date {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: var(--text-muted);
  }

  .job-link {
    font-size: 11px;
    color: var(--text-muted);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    border-radius: 3px;
    transition: color 0.1s;
  }
  .job-link:hover { color: var(--accent); }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }

  .tags .tag {
    padding: 1px 7px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 500;
    background: var(--surface-2);
    color: var(--text-2);
    border: 1px solid var(--border);
    line-height: 1.6;
  }

  .notes-preview {
    font-size: 11px;
    color: var(--text-muted);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.45;
    margin-top: 2px;
  }

  .delete-btn {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.12s, color 0.12s, background 0.12s;
  }
  .card:hover .delete-btn { opacity: 1; }
  .delete-btn:hover { color: var(--danger); background: rgba(239,68,68,0.08); }
</style>
