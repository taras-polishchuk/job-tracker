<script>
  import { uiStore } from '../stores/ui.svelte.js';
  import { jobStore } from '../stores/jobs.svelte.js';
  import { getUniqueTags } from '../lib/utils.js';
  import { COLUMNS, PLATFORMS, PRIORITY_CONFIG } from '../lib/constants.js';

  let importInput = $state(null);

  function exportData() {
    const json = jobStore.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function triggerImport() {
    importInput?.click();
  }

  function onImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = jobStore.importJSON(reader.result);
      if (result.ok) {
        alert(`✓ Imported ${result.count} jobs`);
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  let allTags = $derived(getUniqueTags(jobStore.jobs));
  let tagFilterOpen = $state(false);

  function toggleTagFilter(tag) {
    const idx = uiStore.filterTags.indexOf(tag);
    if (idx >= 0) {
      uiStore.filterTags = uiStore.filterTags.filter(t => t !== tag);
    } else {
      uiStore.filterTags = [...uiStore.filterTags, tag];
    }
  }
</script>

<header class="hdr">
  <!-- Row 1: logo + action buttons -->
  <div class="hdr-top">
    <div class="logo">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <span class="logo-text">JobTracker</span>
    </div>

    <div class="hdr-actions">
      <button class="btn-icon btn-stats" onclick={() => uiStore.showStats = !uiStore.showStats} title="Stats">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </button>

      <button class="btn-icon btn-theme" onclick={() => uiStore.darkMode = !uiStore.darkMode} title="Toggle theme">
        {#if uiStore.darkMode}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        {:else}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>

      <button class="btn-icon btn-export" onclick={exportData} title="Export JSON">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </button>

      <button class="btn-icon btn-import" onclick={triggerImport} title="Import JSON">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </button>
      <input bind:this={importInput} type="file" accept=".json" style="display:none" onchange={onImport} />

      <button class="btn btn-primary" onclick={() => uiStore.openAdd()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span class="btn-add-text">Add Job</span>
      </button>
    </div>
  </div>

  <!-- Row 2: search + filters -->
  <div class="hdr-bottom">
    <div class="search-wrap">
      <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        type="search"
        placeholder="Search company, position, link…"
        bind:value={uiStore.searchQuery}
      />
      {#if uiStore.searchQuery}
        <button class="search-clear" onclick={() => uiStore.searchQuery = ''} aria-label="Clear search">✕</button>
      {/if}
    </div>

    <select bind:value={uiStore.filterStatus} class="filter-select">
      <option value="">All statuses</option>
      {#each COLUMNS as col}
        <option value={col}>{col}</option>
      {/each}
    </select>

    <select bind:value={uiStore.filterPriority} class="filter-select">
      <option value="">All priorities</option>
      {#each Object.entries(PRIORITY_CONFIG) as [key, cfg]}
        <option value={key}>{cfg.label}</option>
      {/each}
    </select>

    <div class="tag-filter-wrap">
      <button class="btn btn-ghost tag-filter-btn" onclick={() => tagFilterOpen = !tagFilterOpen}>
        Tags {uiStore.filterTags.length > 0 ? `(${uiStore.filterTags.length})` : ''}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {#if tagFilterOpen}
        <div class="tag-dropdown">
          {#if allTags.length === 0}
            <span class="no-tags">No tags yet</span>
          {:else}
            {#each allTags as tag}
              <button
                class="tag-opt"
                class:active={uiStore.filterTags.includes(tag)}
                onclick={() => toggleTagFilter(tag)}
              >{tag}</button>
            {/each}
          {/if}
        </div>
      {/if}
    </div>

    {#if uiStore.hasActiveFilters}
      <button class="btn btn-ghost" onclick={() => uiStore.clearFilters()} title="Clear all filters">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        Clear
      </button>
    {/if}
  </div>
</header>

<!-- Close tag dropdown on outside click -->
{#if tagFilterOpen}
  <button class="overlay-dismiss" onclick={() => tagFilterOpen = false} aria-label="Close"></button>
{/if}

<style>
  .hdr {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--sh);
  }

  .hdr-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .hdr-bottom {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .hdr-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 640px) {
    .hdr { padding: 8px 10px; gap: 6px; }
    .logo-text   { display: none; }
    .btn-stats   { display: none; }
    .btn-export  { display: none; }
    .btn-import  { display: none; }
    .btn-add-text { display: none; }
    .filter-select { flex: 1; min-width: 0; font-size: 12px; padding: 6px 6px; }
    .search-wrap { flex: 1 1 100%; }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 15px;
    color: var(--accent);
  }

  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 10px;
    color: var(--text-muted);
    pointer-events: none;
  }
  .search-wrap input {
    padding-left: 32px;
    padding-right: 28px;
  }
  .search-clear {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1;
    padding: 2px;
  }
  .search-clear:hover { color: var(--text); }

  .filter-select {
    width: auto;
    padding: 7px 10px;
    font-size: 12.5px;
  }

  .tag-filter-wrap { position: relative; }
  .tag-filter-btn  { font-size: 12.5px; padding: 7px 10px; }
  .tag-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--sh-md);
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    min-width: 160px;
    max-width: 260px;
    z-index: 200;
  }
  .tag-opt {
    padding: 3px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
  }
  .tag-opt:hover { background: var(--surface); border-color: var(--accent); }
  .tag-opt.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .no-tags { font-size: 12px; color: var(--text-muted); padding: 4px; }

  .overlay-dismiss {
    position: fixed;
    inset: 0;
    z-index: 150;
    background: transparent;
    border: none;
    cursor: default;
  }
</style>
