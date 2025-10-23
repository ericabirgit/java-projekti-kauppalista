const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
const error = document.getElementById('error-message');
const counter = document.getElementById('counter');

const STORAGE_KEY = 'kauppalista-v1';
let items = loadItems();
renderItems();

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();

  if (text.length < 3) {
    showError('Tuotteen nimi on liian lyhyt.');
    return;
  }

  const item = { id: Date.now().toString(), text, done: false };
  items.push(item);
  saveItems();
  appendItem(item);
  updateCounter();
  input.value = '';
  input.classList.remove('invalid');
  error.textContent = '';
});

function showError(msg) {
  error.textContent = msg;
  input.classList.add('invalid');
}

function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderItems() {
  list.innerHTML = '';
  items.forEach(appendItem);
  updateCounter();
}

function appendItem(item) {
  const li = document.createElement('li');
  li.dataset.id = item.id;
  if (item.done) li.classList.add('completed');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = item.done;
  checkbox.addEventListener('change', () => toggleDone(item.id, checkbox.checked));

  const span = document.createElement('span');
  span.className = 'text';
  span.textContent = item.text;

  const del = document.createElement('button');
  del.className = 'delete';
  del.type = 'button';
  del.textContent = 'Poista';
  del.addEventListener('click', () => removeItem(item.id));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);
}

function toggleDone(id, done) {
  const item = items.find(x => x.id === id);
  if (!item) return;
  item.done = done;
  saveItems();
  const li = list.querySelector(`li[data-id="${id}"]`);
  if (li) li.classList.toggle('completed', done);
  updateCounter();
}

function removeItem(id) {
  items = items.filter(x => x.id !== id);
  saveItems();
  const li = list.querySelector(`li[data-id="${id}"]`);
  if (li) li.remove();
  updateCounter();
}

function updateCounter() {
  const count = items.filter(x => !x.done).length;
  counter.textContent = `Ostamatta: ${count}`;
}
