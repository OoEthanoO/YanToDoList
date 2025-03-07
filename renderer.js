const { ipcRenderer } = require("electron");

const newTodoInput = document.getElementById("new-todo");
const dueDateInput = document.getElementById("due-date");
const isForSchoolCheckbox = document.getElementById("is-for-school");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");

let todos = [];
let draggedItem = null;

async function loadTodos() {
  todos = await ipcRenderer.invoke("get-todos");
  renderTodos();
}

async function saveTodos() {
  await ipcRenderer.invoke("save-todos", todos);
}

function addTodo() {
  const text = newTodoInput.value.trim();
  if (text) {
    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      doneForToday: false,
      dueDate: dueDateInput.value || null,
      isForSchool: isForSchoolCheckbox.checked,
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    newTodoInput.value = "";
    dueDateInput.value = "";
    isForSchoolCheckbox.checked = false;
  }
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function toggleDoneForToday(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, doneForToday: !todo.doneForToday };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function formatDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  const dueDate = new Date(year, month - 1, day);

  const today = new Date();
  const todayNoTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffTime = dueDate - todayNoTime;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === -1) {
    return "yesterday";
  } else if (diffDays === 0) {
    return "today";
  } else if (diffDays === 1) {
    return "tomorrow";
  } else if (diffDays > 1 && diffDays <= 7) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[dueDate.getDay()];
  } else {
    return dueDate.toLocaleDateString();
  }
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    li.draggable = true;
    li.setAttribute("data-id", todo.id);

    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    li.addEventListener("dragenter", dragEnter);
    li.addEventListener("dragleave", dragLeave);
    li.addEventListener("dragend", dragEnd);

    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = "⋮⋮";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.title = "Mark as completed";
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const doneForTodayCheckbox = document.createElement("input");
    doneForTodayCheckbox.type = "checkbox";
    doneForTodayCheckbox.checked = todo.doneForToday || false;
    doneForTodayCheckbox.className = "done-today-checkbox";
    doneForTodayCheckbox.title = "Done for today";
    doneForTodayCheckbox.addEventListener("change", () =>
      toggleDoneForToday(todo.id)
    );

    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.isForSchool) {
      span.classList.add("school-task");
    }

    const dateSpan = document.createElement("span");
    dateSpan.className = "due-date";
    if (todo.dueDate) {
      const formattedDate = formatDate(todo.dueDate);
      // Change the text based on whether it's a relative date or numeric date
      if (
        ["yesterday", "today", "tomorrow"].includes(formattedDate) ||
        [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].includes(formattedDate)
      ) {
        dateSpan.textContent = `Due ${formattedDate}`;
      } else {
        dateSpan.textContent = `Due on ${formattedDate}`;
      }
    } else {
      dateSpan.textContent = "";
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    li.appendChild(dragHandle);
    li.appendChild(checkbox);
    li.appendChild(doneForTodayCheckbox);
    li.appendChild(span);
    li.appendChild(dateSpan);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

function dragStart(e) {
  draggedItem = e.target;
  setTimeout(() => {
    e.target.classList.add("dragging");
  }, 0);
}

function dragEnter(e) {
  e.preventDefault();
  e.target.closest("li")?.classList.add("drag-over");
}

function dragLeave(e) {
  e.target.closest("li")?.classList.remove("drag-over");
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();

  const dropTarget = e.target.closest("li");
  if (dropTarget && draggedItem !== dropTarget) {
    const draggedId = Number(draggedItem.getAttribute("data-id"));
    const dropId = Number(dropTarget.getAttribute("data-id"));

    const draggedIndex = todos.findIndex((todo) => todo.id === draggedId);
    const dropIndex = todos.findIndex((todo) => todo.id === dropId);

    const [movedItem] = todos.splice(draggedIndex, 1);
    todos.splice(dropIndex, 0, movedItem);

    saveTodos();
    renderTodos();
  }

  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });
  document.querySelectorAll(".dragging").forEach((el) => {
    el.classList.remove("dragging");
  });
}

function dragEnd(e) {
  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });
  document.querySelectorAll(".dragging").forEach((el) => {
    el.classList.remove("dragging");
  });
}

function showRandomTodo() {
  if (todos.length === 0) {
    alert("No todos available! Add some tasks first.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * todos.length);
  const randomTodo = todos[randomIndex];

  let message = `Random Todo: ${randomTodo.text}`;

  if (randomTodo.dueDate) {
    message += `\nDue: ${formatDate(randomTodo.dueDate)}`;
  }

  if (randomTodo.completed) {
    message += "\nStatus: Completed";
  } else if (randomTodo.doneForToday) {
    message += "\nStatus: Done for today";
  } else {
    message += "\nStatus: Not completed";
  }

  alert(message);
}

addButton.addEventListener("click", addTodo);
newTodoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTodo();
});

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();

  const randomTodoButton = document.getElementById("random-todo-button");
  if (randomTodoButton) {
    randomTodoButton.addEventListener("click", showRandomTodo);
  }
});
