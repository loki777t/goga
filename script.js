document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');

  let tasks = [];

  // Fetch tasks from backend
  async function fetchTasks() {
    try {
      const res = await fetch('http://localhost:3000/tasks');
      tasks = await res.json();
      renderTasks();
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }

  // Render tasks to the list
  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = task.completed ? 'completed' : '';

      const span = document.createElement('span');
      span.textContent = task.text;
      span.className = 'task-text';
      span.addEventListener('click', () => {
        toggleTaskCompletion(task.id, !task.completed);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✕';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
      });

      li.appendChild(span);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Add new task
  async function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    try {
      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const newTask = await res.json();
      tasks.push(newTask);
      renderTasks();
      taskInput.value = '';
      taskInput.focus();
    } catch (error) {
      console.error(error);
    }
  }

  // Toggle task completion
  async function toggleTaskCompletion(id, completed) {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      const index = tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        tasks[index] = updatedTask;
        renderTasks();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Delete task
  async function deleteTask(id) {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    } catch (error) {
      console.error(error);
    }
  }

  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  fetchTasks();
});
