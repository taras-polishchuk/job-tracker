<script>
  import { jobStore } from '../stores/jobs.svelte.js';
  import { uiStore } from '../stores/ui.svelte.js';
  import { COLUMNS, COLUMN_COLORS } from '../lib/constants.js';
  import { filterJobs } from '../lib/utils.js';
  import Column from './Column.svelte';

  let filteredJobs = $derived(
    filterJobs(jobStore.jobs, {
      searchQuery:    uiStore.searchQuery,
      filterStatus:   uiStore.filterStatus,
      filterTags:     uiStore.filterTags,
      filterPriority: uiStore.filterPriority,
    })
  );

  let visibleColumns = $derived(
    uiStore.filterStatus
      ? COLUMNS.filter(c => c === uiStore.filterStatus)
      : COLUMNS
  );
</script>

<div class="board">
  {#each visibleColumns as status}
    {@const colJobs = filteredJobs.filter(j => j.status === status)}
    <Column
      {status}
      jobs={colJobs}
      color={COLUMN_COLORS[status]}
      totalInCol={jobStore.jobs.filter(j => j.status === status).length}
    />
  {/each}

  {#if filteredJobs.length === 0 && uiStore.hasActiveFilters}
    <div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <p>No results found</p>
      <span>Try adjusting your search or filters</span>
      <button class="btn btn-ghost" onclick={() => uiStore.clearFilters()}>Clear filters</button>
    </div>
  {/if}
</div>

<style>
  .board {
    display: flex;
    gap: 12px;
    padding: 16px 20px 24px;
    overflow-x: auto;
    flex: 1;
    align-items: flex-start;
    min-height: 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-muted);
    padding: 60px 40px;
    text-align: center;
    width: 100%;
  }
  .empty-state p { font-size: 16px; font-weight: 600; color: var(--text-2); }
  .empty-state span { font-size: 13px; margin-bottom: 8px; }
</style>
