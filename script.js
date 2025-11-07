// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab_role
function openTab(tabId) {
  //Remove active from all tabs and buttons
  document.querySelectorAll('.tab-content').forEach((el, idx) => {
    el.classList.remove('active');
    if (document.getElementById('tabBtn' + (idx + 1))) {
      document.getElementById('tabBtn' + (idx + 1)).classList.remove('active');
    }
  });
  //Add active to selected tab and button
  const tabIdx = parseInt(tabId.replace('tab', ''));
  document.getElementById(tabId).classList.add('active');
  if (document.getElementById('tabBtn' + tabIdx)) {
    document.getElementById('tabBtn' + tabIdx).classList.add('active');
  }
  // Recalculate budget if Shopping List tab is opened
  if (tabId === 'tab3') {
    updateBudget();
  }
}

//https://www.w3schools.com/howto/howto_css_modals.asp
//Close profile modal
function closeProfileAlert() {
  document.getElementById('profileModal').classList.add('hidden');
}

//Listens to clicks on profile pic to open modal
document.addEventListener('DOMContentLoaded', () => {
  openTab('tab1');
  const profileImg = document.getElementById('profileImg');
  if (profileImg) {
    profileImg.onclick = function() {
      document.getElementById('profileModal').classList.remove('hidden');
    };
  }
});

//show selected choices
function showChoice() {
  const color = document.querySelector('input[name="color"]:checked');
  const team = document.getElementById('teamSelect');
  let result = 'You chose: ';
  result += color ? color.value : 'No color';
  result += ' and ' + (team ? team.value : 'No team');
  document.getElementById('choiceResult').textContent = result;
}

//https://www.w3schools.com/howto/howto_js_todolist.asp
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}




const itemPrices = {
  "Tomatoes": 3,
  "Chicken Breast": 8,
  "Bread": 4,
  "Eggs": 5,
  "Milk": 5
};

function removeItem(button) {
  const item = button.parentElement;
  item.remove();
  updateBudget(); // Recalculate after deletion
}

function updateBudget() {
  const budget = parseFloat(document.getElementById("budgetInput").value);
  const items = document.querySelectorAll("#shoppingList li span");
  let total = 0;
  items.forEach(item => {
    const name = item.textContent.trim();
    total += itemPrices[name] || 0;
  });

  const status = document.getElementById("budgetStatus");
  if (total > budget) {
    status.innerHTML = `⚠️ Over budget by $${(total - budget).toFixed(2)}. Total: $${total.toFixed(2)}.`;
    status.style.color = "red";
  } else {
    status.innerHTML = `✅ Within budget. Total: $${total.toFixed(2)}.`;
    status.style.color = "green";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Open Inventory tab by default
  openTab('tab1');

  // Profile modal logic
  const profileImg = document.getElementById('profileImg');
  if (profileImg) {
    profileImg.onclick = function() {
      document.getElementById('profileModal').classList.remove('hidden');
    };
  }

  // Budget input listener
  const budgetInput = document.getElementById("budgetInput");
  if (budgetInput) {
    budgetInput.addEventListener("input", updateBudget);
    updateBudget(); // Initial budget check
  }
});

// Inventory
function parseQtyText(text) {
  const m = (text || '').trim().match(/^([\d.]+)\s*(.*)$/);
  if (!m) return { qty: 0, unit: '' };
  return { qty: parseFloat(m[1]) || 0, unit: (m[2] || '').trim() };
}

function updateBadge(li) {
  const badge = li.querySelector('.qty-badge');
  const qty = parseFloat(li.dataset.qty) || 0;
  const unit = li.dataset.unit || '';
  badge.textContent = qty + (unit ? (' ' + unit) : '');
}

function renderCategoryTag(li) {
  const cat = (li.dataset.category || '').trim();
  const sub =
    li.querySelector('.inventory-sub') ||
    (function () {
      const s = document.createElement('div');
      s.className = 'inventory-sub';
      li.querySelector('.inventory-meta').appendChild(s);
      return s;
    })();
  const existing = sub.querySelector('.category-tag');
  if (existing) existing.remove();
  if (cat) {
    const tag = document.createElement('span');
    tag.className = 'category-tag';
    tag.textContent = cat;
    tag.tabIndex = 0;
    tag.setAttribute('role', 'button');
    sub.insertBefore(tag, sub.firstChild);
  }
}

function normalizeAll() {
  document.querySelectorAll('.inventory-item').forEach(li => {
    const badge = li.querySelector('.qty-badge');
    if (badge) {
      const p = parseQtyText(badge.textContent);
      if (!li.dataset.qty) li.dataset.qty = p.qty || 0;
      if (!li.dataset.unit) li.dataset.unit = p.unit || '';
      updateBadge(li);
    } else {
      const controls = li.querySelector('.inventory-controls');
      if (controls) {
        const b = document.createElement('div');
        b.className = 'qty-badge';
        b.textContent =
          (li.dataset.qty || '0') +
          (li.dataset.unit ? ' ' + li.dataset.unit : '');
        controls.insertBefore(b, controls.children[1] || null);
      }
    }
    renderCategoryTag(li);
  });
}
function updateInventoryIfEmpty() {
  const list = document.getElementById('inventoryList');
  const empty = document.getElementById('inventoryEmpty');
  empty.style.display = list.children.length === 0 ? '' : 'none';
}
window.incrementQty = window.incrementQty || function (btn) {
  const li = btn.closest('.inventory-item');
  if (!li) return;
  li.dataset.qty = (parseFloat(li.dataset.qty || 0) + 1).toString();
  updateBadge(li);
};
window.decrementQty = window.decrementQty || function (btn) {
  const li = btn.closest('.inventory-item');
  if (!li) return;
  let qty = parseFloat(li.dataset.qty || 0) - 1;
  if (qty < 0) qty = 0;
  li.dataset.qty = qty.toString();
  updateBadge(li);
};

window.removeInventoryItem = window.removeInventoryItem || function (btn) {
  const li = btn.closest('.inventory-item');
  if (!li) return;
  li.remove();
  updateInventoryIfEmpty();
};

window.openAddInventory = window.openAddInventory || function () {
  const name = prompt('Item name:');
  if (!name) return;

  const qtyRaw = prompt(
    'Quantity (number, optional unit like "kg" after a space), e.g. "2 kg" or "3":',
    '1'
  );

  let qty = 1, unit = '';
  if (qtyRaw) {
    const m = qtyRaw.trim().match(/^([\d.]+)\s*(.*)$/);
    if (m) {
      qty = parseFloat(m[1]) || 1;
      unit = (m[2] || '').trim();
    }
  }

  let cat = prompt('Category (dairy / gluten / other / none):', 'none');
  if (!cat) cat = 'none';
  cat = cat.trim().toLowerCase();
  if (cat === 'other') {
    const custom = prompt('Enter custom category:', '');
    if (custom) cat = custom.trim();
    else cat = 'other';
  }
  if (cat === 'none') cat = '';

  const list = document.getElementById('inventoryList');
  const id = Date.now();
  const li = document.createElement('li');
  li.className = 'inventory-item';
  if (unit) li.dataset.unit = unit;
  if (cat) li.dataset.category = cat;
  li.dataset.qty = qty;
  li.dataset.id = id;

  li.innerHTML =
    '<div class="inventory-meta"><div class="inventory-name"></div><div class="inventory-sub"></div></div>' +
    '<div class="inventory-right"><div class="inventory-controls">' +
    '<button class="btn" type="button" onclick="decrementQty(this)">−</button>' +
    '<div class="qty-badge" aria-live="polite"></div>' +
    '<button class="btn" type="button" onclick="incrementQty(this)">+</button>' +
    '<button class="btn" type="button" onclick="removeInventoryItem(this)">🗑️</button>' +
    '</div></div>';

  li.querySelector('.inventory-name').textContent = name;
  list.appendChild(li);
  updateBadge(li);
  renderCategoryTag(li);
  updateInventoryIfEmpty();
};

window.removeItem = window.removeItem || function (btn) {
  const li = btn.closest('li');
  if (li) li.remove();
};

// Basic search (by name or category text)
function filterInventory() {
  const q = (document.getElementById('inventorySearch').value || '')
    .toLowerCase()
    .trim();
  document.querySelectorAll('#inventoryList .inventory-item').forEach(li => {
    const name = (li.querySelector('.inventory-name') || {}).textContent || '';
    const cat = (li.dataset.category || '').toLowerCase();
    const matches =
      q === '' || name.toLowerCase().includes(q) || cat.includes(q);
    li.style.display = matches ? '' : 'none';
  });
}
function createInventoryElement({ id, name, qty = 0, unit = '', category = '' }) {
  const li = document.createElement('li');
  li.className = 'inventory-item';
  li.dataset.id = id || Date.now();
  if (qty !== undefined) li.dataset.qty = qty;
  if (unit) li.dataset.unit = unit;
  if (category) li.dataset.category = category;

  li.innerHTML =
    '<div class="inventory-meta"><div class="inventory-name"></div><div class="inventory-sub"></div></div>' +
    '<div class="inventory-right"><div class="inventory-controls">' +
    '<button class="btn" type="button" onclick="decrementQty(this)">−</button>' +
    '<div class="qty-badge" aria-live="polite"></div>' +
    '<button class="btn" type="button" onclick="incrementQty(this)">+</button>' +
    '<button class="btn" type="button" onclick="removeInventoryItem(this)">🗑️</button>' +
    '</div></div>';

  li.querySelector('.inventory-name').textContent = name;
  return li;
}

function createDefaultInventory() {
  const list = document.getElementById('inventoryList');
  if (!list) return;
  if (list.children.length > 0) return;

  const defaults = [
    { id: 1, name: 'Flour', qty: 2, unit: 'kg', category: 'gluten' },
    { id: 2, name: 'Chicken', qty: 4, unit: 'lbs', category: 'meat' },
    { id: 3, name: 'Eggs', qty: 12, category: 'dairy' }
  ];

  defaults.forEach(item => {
    const li = createInventoryElement(item);
    list.appendChild(li);
  });
}
document.addEventListener('DOMContentLoaded', function () {
  createDefaultInventory();
  normalizeAll();
  updateInventoryIfEmpty();
  const s = document.getElementById('inventorySearch');
  if (s) s.addEventListener('input', filterInventory);
});

document.getElementById('plannerEditBtn')?.addEventListener('click', () => {
  alert('Edit Plan – coming soon');
});
document.getElementById('plannerGenerateBtn')?.addEventListener('click', () => {
  alert('Generate Shopping List – coming soon');
});



