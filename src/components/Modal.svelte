<script>
  import { uiStore } from '../stores/ui.svelte.js';
  import { jobStore } from '../stores/jobs.svelte.js';
  import { COLUMNS, PLATFORMS, PRIORITY_CONFIG } from '../lib/constants.js';

  let editing = $derived(uiStore.editingJob);
  let isNew = $derived(!editing?.id);

  // Form state
  let company      = $state('');
  let position     = $state('');
  let link         = $state('');
  let platform     = $state('LinkedIn');
  let status       = $state('Wishlist');
  let dateApplied  = $state(new Date().toISOString().slice(0, 10));
  let priority     = $state('medium');
  let notes        = $state('');
  let coverLetter  = $state('');
  let resume       = $state(null);
  let tags         = $state([]);
  let tagInput     = $state('');
  let errors       = $state({});

  // Sync form from editingJob when modal opens
  $effect(() => {
    const j = uiStore.editingJob;
    if (!j) return;
    company     = j.company     ?? '';
    position    = j.position    ?? '';
    link        = j.link        ?? '';
    platform    = j.platform    ?? 'LinkedIn';
    status      = j.status      ?? j._defaultStatus ?? 'Wishlist';
    dateApplied = j.dateApplied ?? new Date().toISOString().slice(0, 10);
    priority    = j.priority    ?? 'medium';
    notes       = j.notes       ?? '';
    coverLetter = j.coverLetter ?? '';
    resume      = j.resume      ?? null;
    tags        = j.tags ? [...j.tags] : [];
    tagInput    = '';
    errors      = {};
  });

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) tags = [...tags, t];
    tagInput = '';
  }

  function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
  }

  function onTagKeydown(e) {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
  }

  function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert('File too large (max 1 MB). Try a compressed PDF.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      resume = { name: file.name, type: file.type, data: reader.result };
    };
    reader.readAsDataURL(file);
  }

  function downloadResume() {
    if (!resume?.data) return;
    const a = document.createElement('a');
    a.href = resume.data;
    a.download = resume.name;
    a.click();
  }

  function validate() {
    const e = {};
    if (!company.trim()) e.company = 'Required';
    if (!position.trim()) e.position = 'Required';
    errors = e;
    return Object.keys(e).length === 0;
  }

  function save() {
    if (!validate()) return;
    const data = {
      company: company.trim(),
      position: position.trim(),
      link: link.trim(),
      platform,
      status,
      dateApplied,
      priority,
      notes,
      coverLetter,
      resume,
      tags,
    };
    if (isNew) {
      jobStore.add(data);
    } else {
      jobStore.update(editing.id, data);
    }
    uiStore.closeModal();
  }

  function onOverlayClick(e) {
    if (e.target === e.currentTarget) uiStore.closeModal();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') uiStore.closeModal();
  }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="overlay" onclick={onOverlayClick} onkeydown={onKeydown} role="dialog" aria-modal="true" tabindex="-1" aria-label="{isNew ? 'Add' : 'Edit'} Job">
  <div class="modal">
    <!-- Header -->
    <div class="modal-hdr">
      <h2>{isNew ? 'Add New Job' : 'Edit Job'}</h2>
      <button class="close-btn" onclick={() => uiStore.closeModal()} aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="modal-body">
      <!-- Row: Company + Position -->
      <div class="form-row">
        <div class="field" class:has-err={errors.company}>
          <label for="f-company">Company <span class="req">*</span></label>
          <input id="f-company" type="text" bind:value={company} placeholder="e.g. Shopify Agency" />
          {#if errors.company}<span class="err">{errors.company}</span>{/if}
        </div>
        <div class="field" class:has-err={errors.position}>
          <label for="f-position">Position <span class="req">*</span></label>
          <input id="f-position" type="text" bind:value={position} placeholder="e.g. Shopify Developer" />
          {#if errors.position}<span class="err">{errors.position}</span>{/if}
        </div>
      </div>

      <!-- Row: Link + Platform -->
      <div class="form-row">
        <div class="field">
          <label for="f-link">Job Link</label>
          <input id="f-link" type="url" bind:value={link} placeholder="https://..." />
        </div>
        <div class="field">
          <label for="f-platform">Platform</label>
          <select id="f-platform" bind:value={platform}>
            {#each PLATFORMS as p}<option value={p}>{p}</option>{/each}
          </select>
        </div>
      </div>

      <!-- Row: Status + Date + Priority -->
      <div class="form-row">
        <div class="field">
          <label for="f-status">Status</label>
          <select id="f-status" bind:value={status}>
            {#each COLUMNS as col}<option value={col}>{col}</option>{/each}
          </select>
        </div>
        <div class="field">
          <label for="f-date">Date Applied</label>
          <input id="f-date" type="date" bind:value={dateApplied} />
        </div>
        <div class="field">
          <label for="f-priority">Priority</label>
          <select id="f-priority" bind:value={priority}>
            {#each Object.entries(PRIORITY_CONFIG) as [key, cfg]}
              <option value={key}>{cfg.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Tags -->
      <div class="field">
        <label for="f-tag-input">Tags</label>
        <div class="tags-wrap">
          {#each tags as tag}
            <span class="tag">
              {tag}
              <button onclick={() => removeTag(tag)} aria-label="Remove {tag}">×</button>
            </span>
          {/each}
          <input
            type="text"
            class="tag-input"
            id="f-tag-input"
            bind:value={tagInput}
            onkeydown={onTagKeydown}
            placeholder="Type tag + Enter…"
          />
        </div>
      </div>

      <!-- Notes -->
      <div class="field">
        <label for="f-notes">Notes</label>
        <textarea id="f-notes" bind:value={notes} placeholder="Salary range, team size, impressions…" rows="3"></textarea>
      </div>

      <!-- Cover letter -->
      <div class="field">
        <label for="f-cl">Cover Letter</label>
        <textarea id="f-cl" bind:value={coverLetter} placeholder="Your cover letter text…" rows="4"></textarea>
      </div>

      <!-- Resume -->
      <div class="field">
        <label for="f-resume">Resume (max 1 MB)</label>
        <div class="resume-row">
          <label class="btn btn-ghost file-btn" for="f-resume">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload
            <input id="f-resume" type="file" accept=".pdf,.doc,.docx" style="display:none" onchange={handleResumeUpload} />
          </label>
          {#if resume}
            <span class="resume-name">📎 {resume.name}</span>
            <button class="btn btn-ghost" onclick={downloadResume}>Download</button>
            <button class="btn btn-ghost" onclick={() => resume = null}>Remove</button>
          {:else}
            <span class="no-file">No file attached</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="modal-footer">
      {#if !isNew}
        <button class="btn btn-danger" onclick={() => { jobStore.remove(editing.id); uiStore.closeModal(); }}>
          Delete
        </button>
      {/if}
      <div class="footer-right">
        <button class="btn btn-ghost" onclick={() => uiStore.closeModal()}>Cancel</button>
        <button class="btn btn-primary" onclick={save}>{isNew ? 'Add Job' : 'Save Changes'}</button>
      </div>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(3px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--sh-lg);
    width: 100%;
    max-width: 680px;
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.18s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(12px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .modal-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 14px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .modal-hdr h2 { font-size: 16px; font-weight: 700; color: var(--text); }

  .close-btn {
    width: 28px; height: 28px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s, color 0.12s;
  }
  .close-btn:hover { background: var(--surface-2); color: var(--text); }

  .modal-body {
    overflow-y: auto;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
  }

  .form-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .form-row .field { flex: 1; min-width: 160px; }

  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-2);
  }
  .req { color: var(--danger); }

  .has-err input { border-color: var(--danger); }

  .err { font-size: 11px; color: var(--danger); }

  .tags-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 6px 8px;
    background: var(--surface);
    min-height: 38px;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .tags-wrap:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }

  .tag-input {
    border: none !important;
    padding: 2px 4px !important;
    width: auto !important;
    min-width: 100px;
    flex: 1;
    background: transparent !important;
    box-shadow: none !important;
    outline: none;
    font-size: 13px;
  }

  .resume-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .file-btn {
    cursor: pointer;
    font-size: 12.5px;
  }

  .resume-name {
    font-size: 12.5px;
    color: var(--text-2);
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .no-file { font-size: 12px; color: var(--text-muted); }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }

  .footer-right {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }
</style>
