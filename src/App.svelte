<script>
  import './app.css';
  import { uiStore } from './stores/ui.svelte.js';
  import Header from './components/Header.svelte';
  import Board from './components/Board.svelte';
  import StatsPanel from './components/StatsPanel.svelte';
  import Modal from './components/Modal.svelte';

  $effect(() => {
    document.documentElement.setAttribute('data-theme', uiStore.darkMode ? 'dark' : 'light');
  });

  let showBanner = $state(localStorage.getItem('localdata-notice-dismissed') !== '1');

  function dismissBanner() {
    localStorage.setItem('localdata-notice-dismissed', '1');
    showBanner = false;
  }
</script>

{#if showBanner}
  <div class="local-banner">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>Your data is stored locally in this browser only. Use <strong>Export</strong> to back it up — clearing browser data will erase everything.</span>
    <button onclick={dismissBanner} aria-label="Dismiss">✕</button>
  </div>
{/if}

<Header />
{#if uiStore.showStats}
  <StatsPanel />
{/if}
<Board />
{#if uiStore.modalOpen}
  <Modal />
{/if}

<style>
  .local-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: #fefce8;
    border-bottom: 1px solid #fde047;
    color: #713f12;
    font-size: 13px;
    line-height: 1.4;
  }
  :global(html[data-theme="dark"]) .local-banner {
    background: #1c1708;
    border-bottom-color: #854d0e;
    color: #fde68a;
  }
  .local-banner span { flex: 1; }
  .local-banner button {
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    font-size: 14px;
    padding: 2px 4px;
    flex-shrink: 0;
  }
  .local-banner button:hover { opacity: 1; }
</style>
