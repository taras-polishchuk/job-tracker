class UIStore {
  searchQuery = $state('');
  filterStatus = $state('');
  filterTags = $state([]);
  filterPriority = $state('');
  showStats = $state(false);
  modalOpen = $state(false);
  editingJob = $state(null);
  draggingId = $state(null);
  darkMode = $state(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  get hasActiveFilters() {
    return (
      this.searchQuery !== '' ||
      this.filterStatus !== '' ||
      this.filterTags.length > 0 ||
      this.filterPriority !== ''
    );
  }

  openAdd(defaultStatus = 'Wishlist') {
    this.editingJob = { _isNew: true, status: defaultStatus };
    this.modalOpen = true;
  }

  openEdit(job) {
    this.editingJob = { ...job, tags: [...(job.tags ?? [])] };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.editingJob = null;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterTags = [];
    this.filterPriority = '';
  }
}

export const uiStore = new UIStore();
