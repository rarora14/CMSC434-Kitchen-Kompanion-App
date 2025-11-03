
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

