const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

let tasks = [];
let nextId = 1;

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Task text is required' });
  }
  const task = { id: nextId++, text: text.trim(), completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Update a task (toggle completed)
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (typeof req.body.completed === 'boolean') {
    task.completed = req.body.completed;
  }
  if (typeof req.body.text === 'string') {
    task.text = req.body.text.trim();
  }
  res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`To-Do List backend listening at http://localhost:${port}`);
});
