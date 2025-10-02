

function openTab(tabId) {
  // Remove active from all tabs and buttons
  document.querySelectorAll('.tab-content').forEach((el, idx) => {
    el.classList.remove('active');
    if (document.getElementById('tabBtn' + (idx + 1))) {
      document.getElementById('tabBtn' + (idx + 1)).classList.remove('active');
    }
  });
  // Add active to selected tab and button
  const tabIdx = parseInt(tabId.replace('tab', ''));
  document.getElementById(tabId).classList.add('active');
  if (document.getElementById('tabBtn' + tabIdx)) {
    document.getElementById('tabBtn' + tabIdx).classList.add('active');
  }
}

function closeProfileAlert() {
  document.getElementById('profileModal').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  openTab('tab1');
  // Profile image click
  const profileImg = document.getElementById('profileImg');
  if (profileImg) {
    profileImg.onclick = function() {
      document.getElementById('profileModal').classList.remove('hidden');
    };
  }
});

function showChoice() {
  const color = document.querySelector('input[name="color"]:checked');
  const fruit = document.getElementById('fruitSelect');
  let result = 'You chose: ';
  result += color ? color.value : 'No color';
  result += ' and ' + (fruit ? fruit.value : 'No fruit');
  document.getElementById('choiceResult').textContent = result;
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const list = document.getElementById('todoList');
  const value = input.value.trim();
  if (!value) return;
  const li = document.createElement('li');
  li.textContent = value;
  li.onclick = function() {
    li.classList.toggle('done');
    if (li.classList.contains('done')) {
      setTimeout(() => { if (li.parentNode) li.parentNode.removeChild(li); }, 500);
    }
  };
  list.appendChild(li);
  input.value = '';
}
