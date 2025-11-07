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

    if (!found && searchInput !== "") {
      alert("No matching recipes found.");
    }
  });

  

  document.addEventListener("DOMContentLoaded", () => {
  const overlay  = document.getElementById("recipeModal");      
  const closeBtn = overlay?.querySelector(".modal-close");      //✕ button
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
  if (next === null) return;         

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
  const mealPlanCard = document.querySelector(".mealplan-card");
  if (mealPlanCard) {
    mealPlanCard.addEventListener("click", editMealHandler);
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
    return NAME_MAP[s] || null;
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
    if (!day) return;

    // Guard against race conditions and duplicates
    if (!getRemainingDays(mealPlanCard).includes(day)) {
      alert(`${day} is already in your plan.`);
      return;
    }

    const newRow = createMealRow(day, "TBD");
    insertRowInWeekOrder(mealPlanCard, newRow);
  });
});


//Meal Planner: edit annd persist
(function () {
  const editor = document.getElementById('mealEditor');
  if (!editor) return;

  const form = document.getElementById('mealForm');
  const inputName = document.getElementById('mealName');
  const inputNotes = document.getElementById('mealNotes');
  const inputDay = document.getElementById('mealDay');
  const inputSlot = document.getElementById('mealSlot');
  const btnClear = document.getElementById('clearMeal');
  const btnCancel = document.getElementById('cancelMeal');
  const btnAutoFill = document.getElementById('plannerAutoFillBtn');
  const btnClearPlan = document.getElementById('plannerClearPlanBtn');

  const STORAGE_KEY = 'kk_meal_plan_v1';
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const SLOTS = ['breakfast','lunch','dinner'];
  const DEFAULT_PLAN = {
    Mon: { breakfast: { name: 'Oatmeal', notes: '' }, lunch: { name: 'Salad', notes: '' }, dinner: { name: 'Chicken', notes: '' } },
    Tue: { breakfast: { name: 'Eggs', notes: '' }, lunch: { name: 'Sandwich', notes: '' }, dinner: { name: 'Pasta', notes: '' } },
    Wed: { breakfast: { name: 'Yogurt', notes: '' }, lunch: { name: 'Soup', notes: '' }, dinner: { name: 'Stir-fry', notes: '' } },
    Thu: { breakfast: { name: 'Toast', notes: '' }, lunch: { name: 'Burrito', notes: '' }, dinner: { name: 'Curry', notes: '' } },
    Fri: { breakfast: { name: 'Bagel', notes: '' }, lunch: { name: 'Sushi', notes: '' }, dinner: { name: 'Pizza', notes: '' } },
    Sat: { breakfast: { name: 'Pancakes', notes: '' }, lunch: { name: 'Burger', notes: '' }, dinner: { name: 'Tacos', notes: '' } },
    Sun: { breakfast: { name: 'Smoothie', notes: '' }, lunch: { name: 'Quinoa Bowl', notes: '' }, dinner: { name: 'Roast', notes: '' } }
  };

  const cloneDefault = () => JSON.parse(JSON.stringify(DEFAULT_PLAN));
  const AUTO_LIBRARY = {
    breakfast: ['Oatmeal', 'Avocado Toast', 'Yogurt Parfait', 'Breakfast Burrito', 'Smoothie Bowl', 'Veggie Omelet', 'Protein Pancakes'],
    lunch: ['Mediterranean Salad', 'Veggie Wrap', 'Chicken Caesar', 'Sushi Bento', 'Tomato Soup & Grilled Cheese', 'Quinoa Bowl', 'Chipotle Burrito Bowl'],
    dinner: ['Lemon Herb Chicken', 'Veggie Stir-fry', 'Shrimp Tacos', 'Margherita Pizza', 'Garlic Butter Salmon', 'Chickpea Curry', 'BBQ Turkey Meatballs']
  };

  function loadPlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : cloneDefault();
    } catch (err) {
      console.warn('Unable to load meal plan from storage:', err);
      return cloneDefault();
    }
  }

  function savePlan(nextPlan) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlan));
    } catch (err) {
      console.warn('Unable to save meal plan:', err);
    }
  }

  let plan = loadPlan();

  function paintFromPlan() {
    document.querySelectorAll('.meal-cell').forEach(btn => {
      const day = btn.dataset.day;
      const slot = btn.dataset.slot;
      const entry = plan?.[day]?.[slot] || null;
      const pill = btn.querySelector('.meal-pill');

      if (!pill) return;

      if (entry && entry.name) {
        pill.textContent = entry.name;
        pill.title = entry.notes ? `${entry.name} — ${entry.notes}` : entry.name;
        pill.classList.remove('pill-empty');
      } else {
        pill.textContent = '— empty —';
        pill.title = 'Tap to add';
        pill.classList.add('pill-empty');
      }
    });
  }

  function render(forceReload = true) {
    if (forceReload) {
      plan = loadPlan();
    }
    paintFromPlan();
  }

  window.render = window.render || (() => render(true));

  function openEditor(day, slot) {
    const current = plan?.[day]?.[slot] || { name: '', notes: '' };
    inputDay.value = day;
    inputSlot.value = slot;
    inputName.value = current.name || '';
    inputNotes.value = current.notes || '';
    if (editor.showModal) {
      editor.showModal();
    } else {
      editor.show();
    }
    inputName.focus();
  }

  document.querySelectorAll('.meal-cell').forEach(btn => {
    btn.addEventListener('click', () => openEditor(btn.dataset.day, btn.dataset.slot));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEditor(btn.dataset.day, btn.dataset.slot);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const day = inputDay.value;
    const slot = inputSlot.value;
    plan[day] = plan[day] || {};
    plan[day][slot] = {
      name: inputName.value.trim(),
      notes: inputNotes.value.trim()
    };
    savePlan(plan);
    render(false);
    editor.close();
  });

  btnClear.addEventListener('click', () => {
    const day = inputDay.value;
    const slot = inputSlot.value;
    if (!plan[day]) plan[day] = {};
    plan[day][slot] = null;
    savePlan(plan);
    render(false);
    editor.close();
  });

  btnCancel.addEventListener('click', () => editor.close());

  function autoFillWeek() {
    if (!btnAutoFill) return;
    if (!confirm('Auto-fill will overwrite the current week. Continue?')) return;
    const basePlan = {};
    DAYS.forEach((day, dayIdx) => {
      basePlan[day] = basePlan[day] || {};
      SLOTS.forEach((slot, slotIdx) => {
        const options = AUTO_LIBRARY[slot] || [];
        const pick = options.length ? options[(dayIdx + slotIdx) % options.length] : 'TBD';
        basePlan[day][slot] = {
          name: pick,
          notes: ''
        };
      });
    });
    plan = basePlan;
    savePlan(plan);
    render(false);
    alert('Weekly meals auto-filled!');
  }

  btnAutoFill?.addEventListener('click', autoFillWeek);

  function clearEntirePlan() {
    if (!btnClearPlan) return;
    if (!confirm('Clear all meals for the week? This cannot be undone.')) return;
    plan = {};
    DAYS.forEach(day => {
      plan[day] = {};
      SLOTS.forEach(slot => {
        plan[day][slot] = null;
      });
    });
    savePlan(plan);
    render(false);
    alert('Meal plan cleared for the week.');
  }

  btnClearPlan?.addEventListener('click', clearEntirePlan);

  render(false);
})();

// ===== Plan Week (Manual Wizard) =====
(function () {
  const wizard = document.getElementById('planWeekWizard');
  const btnOpen = document.getElementById('plannerPlanWeekBtn');
  if (!wizard || !btnOpen) return;

  const form = document.getElementById('planWeekForm');
  const stepEls = wizard.querySelectorAll('.wizard-step');
  const dots = wizard.querySelectorAll('.wizard-steps .dot');
  const btnCancel = document.getElementById('pwCancel');
  const btnBack = document.getElementById('pwBack');
  const btnNext = document.getElementById('pwNext');
  const btnApply = document.getElementById('pwApply');

  const pickList = document.getElementById('pickList');
  const reviewTable = document.getElementById('reviewTable');
  const applySummary = document.getElementById('applySummary');
  const applySuccess = document.getElementById('applySuccess');

  const STORAGE_KEY = 'kk_meal_plan_v1';

  function loadPlan() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.warn('Unable to load plan in wizard:', err);
      return {};
    }
  }

  function savePlan(nextPlan) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlan));
    } catch (err) {
      console.warn('Unable to save plan in wizard:', err);
    }
  }

  function rerenderPlanner() {
    if (typeof window.render === 'function') {
      window.render();
      return;
    }
    const plan = loadPlan();
    document.querySelectorAll('.meal-cell').forEach(btn => {
      const day = btn.dataset.day;
      const slot = btn.dataset.slot;
      const entry = plan?.[day]?.[slot];
      const pill = btn.querySelector('.meal-pill');
      if (!pill) return;
      if (entry?.name) {
        pill.textContent = entry.name;
        pill.classList.remove('pill-empty');
      } else {
        pill.textContent = '— empty —';
        pill.classList.add('pill-empty');
      }
    });
  }

  const SUGGESTIONS = [
    'Oatmeal', 'Yogurt Parfait', 'Eggs & Toast', 'Smoothie', 'Bagel',
    'Salad', 'Soup', 'Sandwich', 'Quinoa Bowl', 'Burrito', 'Sushi',
    'Chicken', 'Pasta', 'Stir-fry', 'Curry', 'Tacos', 'Roast', 'Pizza'
  ];

  let step = 1;
  let picks = [];

  function showStep(nextStep) {
    step = nextStep;
    stepEls.forEach(section => {
      section.hidden = Number(section.dataset.step) !== nextStep;
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx < nextStep);
    });
    btnBack.disabled = nextStep === 1;
    btnNext.hidden = nextStep >= 4;
    btnApply.hidden = nextStep !== 4;
    applySuccess.hidden = true;
  }

  function buildStep2FromScope() {
    const days = Array.from(form.querySelectorAll('input[name="day"]:checked')).map(input => input.value);
    const slots = Array.from(form.querySelectorAll('input[name="slot"]:checked')).map(input => input.value);
    pickList.innerHTML = '';
    if (days.length === 0 || slots.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'inventory-empty';
      msg.textContent = 'Choose at least one day and meal slot.';
      pickList.appendChild(msg);
      return;
    }
    const frag = document.createDocumentFragment();
    days.forEach(day => {
      slots.forEach(slot => {
        const row = document.createElement('div');
        row.className = 'pick-row';
        row.dataset.day = day;
        row.dataset.slot = slot;

        const daypill = document.createElement('div');
        daypill.className = 'daypill';
        const slotLabel = slot.charAt(0).toUpperCase() + slot.slice(1);
        daypill.textContent = `${day} ${slotLabel}`;

        const select = document.createElement('select');
        select.appendChild(new Option('Choose suggestion…', ''));
        SUGGESTIONS.forEach(name => select.appendChild(new Option(name, name)));

        const custom = document.createElement('input');
        custom.type = 'text';
        custom.placeholder = 'Custom meal name';

        row.append(daypill, select, custom);
        frag.appendChild(row);
      });
    });
    pickList.appendChild(frag);
  }

  function collectPicksFromStep2() {
    picks = [];
    pickList.querySelectorAll('.pick-row').forEach(row => {
      const day = row.dataset.day;
      const slot = row.dataset.slot;
      const select = row.querySelector('select');
      const custom = row.querySelector('input[type="text"]');
      const name = custom.value.trim() || select.value.trim();
      if (!name) return;
      picks.push({
        day,
        slot,
        name
      });
    });
  }

  function buildReview() {
    reviewTable.innerHTML = '';
    if (!picks.length) {
      const msg = document.createElement('div');
      msg.className = 'inventory-empty';
      msg.textContent = 'No meals selected yet. Go back and add at least one.';
      reviewTable.appendChild(msg);
      return;
    }
    const frag = document.createDocumentFragment();
    picks.forEach((pick, index) => {
      const row = document.createElement('div');
      row.className = 'review-row';
      row.dataset.index = String(index);

      const day = document.createElement('div');
      day.textContent = pick.day;

      const slot = document.createElement('div');
      slot.textContent = pick.slot;

      const nameInput = document.createElement('input');
      nameInput.className = 'mini-edit';
      nameInput.type = 'text';
      nameInput.value = pick.name;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-ghost';
      removeBtn.textContent = 'Remove';

      removeBtn.addEventListener('click', () => {
        picks.splice(index, 1);
        buildReview();
      });
      nameInput.addEventListener('input', () => {
        pick.name = nameInput.value.trim();
      });

      row.append(day, slot, nameInput, removeBtn);
      frag.appendChild(row);
    });
    reviewTable.appendChild(frag);
  }

  function buildApplySummary() {
    applySummary.innerHTML = '';
    if (!picks.length) {
      const msg = document.createElement('div');
      msg.className = 'inventory-empty';
      msg.textContent = 'Nothing to apply.';
      applySummary.appendChild(msg);
      return;
    }
    const list = document.createElement('ul');
    list.style.margin = '0';
    list.style.paddingLeft = '18px';
    picks.forEach(pick => {
      const item = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = pick.name;
      item.append(`${pick.day} ${pick.slot}: `, strong);
      list.appendChild(item);
    });
    applySummary.appendChild(list);
  }

  function applyChanges() {
    if (!picks.length) {
      applySuccess.hidden = false;
      applySuccess.textContent = '⚠️ Nothing to apply. Please add meals first.';
      return;
    }
    const plan = loadPlan();
    picks.forEach(pick => {
      plan[pick.day] = plan[pick.day] || {};
      plan[pick.day][pick.slot] = { name: pick.name, notes: '' };
    });
    savePlan(plan);
    applySuccess.hidden = false;
    applySuccess.textContent = '✅ Week plan applied to Meal Planner.';
    rerenderPlanner();
    wizard.close();
  }

  function resetWizard() {
    form.reset();
    picks = [];
    pickList.innerHTML = '';
    reviewTable.innerHTML = '';
    applySummary.innerHTML = '';
    applySuccess.hidden = true;
    showStep(1);
  }

  btnOpen.addEventListener('click', () => {
    resetWizard();
    if (wizard.showModal) {
      wizard.showModal();
    } else {
      wizard.show();
    }
  });

  btnCancel.addEventListener('click', () => wizard.close());
  wizard.addEventListener('cancel', (e) => {
    e.preventDefault();
    wizard.close();
  });
  wizard.addEventListener('close', resetWizard);

  btnBack.addEventListener('click', () => {
    if (step > 1) {
      showStep(step - 1);
    }
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
  btnNext.addEventListener('click', () => {
    if (step === 1) {
      buildStep2FromScope();
      showStep(2);
    } else if (step === 2) {
      collectPicksFromStep2();
      buildReview();
      showStep(3);
    } else if (step === 3) {
      buildApplySummary();
      showStep(4);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    applyChanges();
  });
})();
