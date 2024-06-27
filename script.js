const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const columnList = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  localStorage.setItem("backlogItems", JSON.stringify(backlogListArray));
  localStorage.setItem("progressItems", JSON.stringify(progressListArray));
  localStorage.setItem("completeItems", JSON.stringify(completeListArray));
  localStorage.setItem("onHoldItems", JSON.stringify(onHoldListArray));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, columnNum, textContent, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = textContent;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${columnNum})`);
  listEl.setAttribute("onclick", `activateDbClick(event)`);
  listEl.draggable = true;

  // Append
  columnEl.appendChild(listEl);
}

// Double click on li
function activateDbClick(e) {
  e.target.setAttribute("contenteditable", "true");
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((textContent, index) => {
    createItemEl(backlogList, 0, textContent, index);
  });
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((textContent, index) => {
    createItemEl(progressList, 1, textContent, index);
  });
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((textContent, index) => {
    createItemEl(completeList, 2, textContent, index);
  });
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((textContent, index) => {
    createItemEl(onHoldList, 3, textContent, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, columnNum) {
  const selectedArray = listArrays[columnNum];
  const selectedColumnEls = columnList[columnNum].children;

  selectedArray[id] = selectedColumnEls[id].textContent;
  if (!selectedArray[id]) {
    selectedArray.splice(id, 1);
  }
  updateDOM();
}

// Allow arrays to reflect drag and drop items (Updating arrays)
function rebuildArrays() {
  // Method 1
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);

  // Method 2
  progressListArray = [];
  for (li of progressList.children) {
    progressListArray.push(li.textContent);
  }

  completeListArray = [];
  for (li of completeList.children) {
    completeListArray.push(li.textContent);
  }

  onHoldListArray = [];
  for (li of onHoldList.children) {
    onHoldListArray.push(li.textContent);
  }
  // Updating dom
  updateDOM();
}

// When Item Start Dragging
function drag(e) {
  draggedItem = e.target;
}

// When item enters in Column
function dragEnter(columnNum) {
  currentColumn = columnNum;
  columnList[columnNum].classList.add("over");
}
// When item leaves out Column
function dragLeave(columnNum) {
  // columnList[columnNum].classList.remove("over");
}

// Columns Allow for item to drop
function allowDrop(e, columnNum) {
  e.preventDefault();
}

// Dropping item in Column
function drop(e) {
  e.preventDefault();
  // Remove background color from columns
  columnList.forEach((column) => {
    column.classList.remove("over");
  });

  // Adding element to column
  const parent = columnList[currentColumn];
  parent.append(draggedItem);
  rebuildArrays();
}

// Show input & Hide input

function addToColumn(columnNum) {
  const text = addItems[columnNum].textContent;
  if (!text) return;
  listArrays[columnNum].push(text);
  updateDOM();
  addItems[columnNum].textContent = "";
}

function showInputBox(columnNum) {
  addBtns[columnNum].style.visibility = "hidden";
  saveItemBtns[columnNum].style.display = "flex";
  addItemContainers[columnNum].style.display = "flex";
}
function hideInputBox(columnNum) {
  addBtns[columnNum].style.visibility = "visible";
  saveItemBtns[columnNum].style.display = "none";
  addItemContainers[columnNum].style.display = "none";
  addToColumn(columnNum);
}

// On Load
updateDOM();
