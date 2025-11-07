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
  updateBudget(); 
}

function updateBudget() {
  const budget = parseFloat(document.getElementById("budgetInput").value);
  const items = document.querySelectorAll("#shoppingList li span");
  let total = 0;

  items.forEach(item => {
    const text = item.textContent.trim();
    const match = text.match(/\$([\d.]+)/); // extract price from text
    if (match) {
      total += parseFloat(match[1]);
    }
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

document.querySelector(".search-btn").addEventListener("click", function () {
    const searchInput = document.querySelector(".mini-search").value.toLowerCase().trim();
    const recipes = document.querySelectorAll(".recipe-item");
    let found = false;

    recipes.forEach((recipe) => {
      const recipeName = recipe.querySelector(".recipe-name").textContent.toLowerCase();

      // show card if name includes search input, otherwise hide
      if (recipeName.includes(searchInput) || searchInput === "") {
        recipe.style.display = "flex";
        found = true;
      } else {
        recipe.style.display = "none";
      }
    });

    // Optional: alert if nothing matched
    if (!found && searchInput !== "") {
      alert("No matching recipes found.");
    }
  });

  

  document.addEventListener("DOMContentLoaded", () => {
  const overlay  = document.getElementById("recipeModal");      // <div id="recipeModal" class="overlay hidden">
  const closeBtn = overlay?.querySelector(".modal-close");       // the ✕ button
  const titleEl  = document.getElementById("modalTitle");       
  const bodyEl   = document.getElementById("modalContent");      

  function openRecipeModalFrom(btn) {
    const card   = btn.closest(".recipe-item");
    const name   = card?.querySelector(".recipe-name")?.textContent?.trim() || "Recipe Details";
    const status = card?.querySelector(".recipe-status")?.textContent?.trim() || "";

    titleEl.textContent = name;
    bodyEl.textContent  = status ? `Status: ${status}` : "This is a placeholder modal for your recipe.";

    overlay.classList.remove("hidden");
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    closeBtn?.focus();
  }

  function closeRecipeModal() {
    overlay.classList.remove("show");
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
  }

  
  document.querySelectorAll("#tab4 .view-btn").forEach(btn => {
    btn.addEventListener("click", () => openRecipeModalFrom(btn));
  });

 
  closeBtn?.addEventListener("click", closeRecipeModal);


  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeRecipeModal();
  });

  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay?.classList.contains("show")) {
      closeRecipeModal();
    }
  });
});



function editMealHandler(e) {
  const btn = e.target.closest(".mealplan-btn");
  if (!btn) return;

  const row = btn.closest(".mealplan-row");
  const nameEl = row?.querySelector(".mealplan-meal");
  if (!row || !nameEl) return;

  const current = nameEl.textContent.trim();
  const isAdd = btn.classList.contains("add");

  const next = prompt(
    isAdd ? "Add a recipe for this day:" : "Edit meal name:",
    isAdd ? "" : current
  );
  if (next === null) return;          // user hit Cancel

  const cleaned = next.trim();
  if (!cleaned) return;               // ignore empty submit

  nameEl.textContent = cleaned;

  // If it was an "Add" button, switch it to "Edit"
  if (isAdd) {
    btn.classList.remove("add");
    btn.textContent = "Edit ✏️";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Event delegation: one listener for all current/future rows
  const mealPlanCard = document.querySelector(".mealplan-card");
  if (mealPlanCard) {
    mealPlanCard.addEventListener("click", editMealHandler);
    // Debug log to confirm binding
    console.log("[MealPlan] handler attached:", true);
  }
});
  

document.addEventListener("DOMContentLoaded", () => {
  const mealPlanCard = document.querySelector(".mealplan-card");
  if (!mealPlanCard) return;

  mealPlanCard.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-day-btn");
    if (!removeBtn) return;

    const row = removeBtn.closest(".mealplan-row");
    const day = row.querySelector(".mealplan-day")?.textContent || "this day";

    const confirmDelete = confirm(`Remove ${day} from your weekly meal plan?`);
    if (confirmDelete) {
      row.remove();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const mealPlanCard = document.querySelector(".mealplan-card");
  if (!mealPlanCard) return;

  const ALL_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const DAY_INDEX = Object.fromEntries(ALL_DAYS.map((d,i)=>[d,i]));
  const NAME_MAP = {
    monday:"Mon", mon:"Mon",
    tuesday:"Tue", tue:"Tue", tues:"Tue",
    wednesday:"Wed", wed:"Wed",
    thursday:"Thu", thu:"Thu", thurs:"Thu",
    friday:"Fri", fri:"Fri",
    saturday:"Sat", sat:"Sat",
    sunday:"Sun", sun:"Sun"
  };

  function getUsedDays(card) {
    return Array.from(card.querySelectorAll(".mealplan-day"))
      .map(el => el.textContent.trim());
  }

  function getRemainingDays(card) {
    const used = new Set(getUsedDays(card));
    return ALL_DAYS.filter(d => !used.has(d));
  }

  function normalizeDayInput(input) {
    if (!input) return null;
    const s = input.trim().toLowerCase();
    return NAME_MAP[s] || null; // only accept valid names
  }

  function createMealRow(day, mealText = "TBD") {
    const row = document.createElement("div");
    row.className = "mealplan-row";
    row.innerHTML = `
      <span class="mealplan-day">${day}</span>
      <span class="mealplan-meal">${mealText}</span>
      <div class="mealplan-actions">
        <button class="mealplan-btn add" type="button">Add Recipe ➕</button>
        <button class="remove-day-btn" type="button">🗑️</button>
      </div>
    `;
    return row;
  }

  function insertRowInWeekOrder(card, row) {
    const newDay = row.querySelector(".mealplan-day").textContent.trim();
    const newIdx = DAY_INDEX[newDay];

    const rows = card.querySelectorAll(".mealplan-row");
    let inserted = false;
    for (const r of rows) {
      const d = r.querySelector(".mealplan-day")?.textContent?.trim();
      if (d == null) continue;
      if (DAY_INDEX[d] > newIdx) {
        r.before(row);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      // place before footer if present, else append
      const footer = card.querySelector(".mealplan-footer");
      (footer ? footer : card).before ? footer.before(row) : card.appendChild(row);
      if (!footer) card.appendChild(row);
    }
  }

  // Add Day button logic
  mealPlanCard.addEventListener("click", (e) => {
    const addDayBtn = e.target.closest(".add-day-btn");
    if (!addDayBtn) return;

    const remaining = getRemainingDays(mealPlanCard);
    if (remaining.length === 0) {
      alert("All days are already present.");
      return;
    }

    const answer = prompt(
      `Add which day? (Available: ${remaining.join(", ")})`,
      remaining[0]
    );
    const day = normalizeDayInput(answer);
    if (!day) return; // invalid or canceled

    // Guard against race conditions / duplicates
    if (!getRemainingDays(mealPlanCard).includes(day)) {
      alert(`${day} is already in your plan.`);
      return;
    }

    const newRow = createMealRow(day, "TBD");
    insertRowInWeekOrder(mealPlanCard, newRow);
  });
});




window.openAddShoppingItem = function () {
  const name = prompt("Item name:");
  if (!name) return;

  const priceRaw = prompt("Price ($):");
  const price = parseFloat(priceRaw);
  if (isNaN(price)) return;

  const li = document.createElement("li");
  li.innerHTML = `<span>${name} - $${price.toFixed(2)}</span> <button class="delete-btn" onclick="removeItem(this)">🗑️</button>`;
  document.getElementById("shoppingList").appendChild(li);
  updateBudget();
};
