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
</script>

<Header />
{#if uiStore.showStats}
  <StatsPanel />
{/if}
<Board />
{#if uiStore.modalOpen}
  <Modal />
{/if}
