<script>
  import { jobStore } from '../stores/jobs.svelte.js';
  import { uiStore } from '../stores/ui.svelte.js';
  import Card from './Card.svelte';

  let { status, jobs, color, totalInCol } = $props();

  let isDragOver = $state(false);

  function onDragOver(e) {
    e.preventDefault();
    isDragOver = true;
  }

  function onDragLeave(e) {
    // Only clear if leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      isDragOver = false;
    }
  }

  function onDrop(e) {
    e.preventDefault();
    isDragOver = false;
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      jobStore.moveToStatus(id, status);
    }
    uiStore.draggingId = null;
  }
</script>

<div
  class="column"
  class:drag-over={isDragOver}
  role="list"
  aria-label="{status} column"
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
>
  <div class="col-header" style="--col-color: {color}">
    <div class="col-title">
      <span class="col-dot"></span>
      <span class="col-name">{status}</span>
    </div>
    <div class="col-meta">
      <span class="col-count" title="{totalInCol} total in this stage">
        {jobs.length}{jobs.length !== totalInCol ? `/${totalInCol}` : ''}
      </span>
      <button class="add-btn" onclick={() => uiStore.openAdd(status)} title="Add job to {status}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="cards-list">
    {#each jobs as job (job.id)}
      <Card {job} />
    {/each}

    {#if jobs.length === 0}
      <div class="col-empty">
        {#if uiStore.hasActiveFilters}
          <span>No matches</span>
        {:else}
          <span>Drop cards here</span>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .column {
    width: var(--col-w, 272px);
    min-width: var(--col-w, 272px);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.15s, border-color 0.15s, background 0.15s;
    max-height: fit-content;
  }

  .column.drag-over {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(99,102,241,0.15);
    background: rgba(99,102,241,0.04);
  }

  .col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px 8px;
    border-bottom: 2px solid var(--col-color, var(--border));
    flex-shrink: 0;
  }

  .col-title {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }

  .col-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--col-color, var(--border));
    flex-shrink: 0;
  }

  .col-name {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .col-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .col-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 1px 7px;
    line-height: 1.6;
  }

  .add-btn {
    width: 22px;
    height: 22px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s, color 0.12s;
  }
  .add-btn:hover { background: var(--surface); color: var(--accent); border-color: var(--accent); }

  .cards-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .col-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 12px;
    color: var(--text-muted);
    font-size: 12px;
    border: 1.5px dashed var(--border);
    border-radius: var(--radius-sm);
    margin: 4px 0;
  }
</style>
