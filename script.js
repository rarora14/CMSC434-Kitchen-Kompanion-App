// Simple tab navigation and page routing for Kitchen Kompanion
function openTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  // Show the selected tab
  document.getElementById(tabId).classList.remove('hidden');
}

// Default to home tab
document.addEventListener('DOMContentLoaded', () => {
  openTab('tab1');
});
