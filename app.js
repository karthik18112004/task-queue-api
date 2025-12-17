const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Mutex = require("./mutex");

const app = express();
app.use(express.json());

const mutex = new Mutex();
const pendingQueue = [];
const tasks = {};

const nowISO = () => new Date().toISOString();

app.post("/tasks", async (req, res) => {
  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: "payload required" });
  }

  await mutex.lock();
  try {
    const id = uuidv4();
    const task = {
      id,
      payload,
      status: "pending",
      created_at: nowISO()
    };
    tasks[id] = task;
    pendingQueue.push(id);
    res.status(201).json({ id });
  } finally {
    mutex.unlock();
  }
});

app.post("/tasks/dequeue", async (req, res) => {
  await mutex.lock();
  try {
    if (pendingQueue.length === 0) {
      return res.status(404).json({ error: "queue empty" });
    }
    const id = pendingQueue.shift();
    tasks[id].status = "processing";
    res.json(tasks[id]);
  } finally {
    mutex.unlock();
  }
});

app.get("/tasks/:id", async (req, res) => {
  await mutex.lock();
  try {
    const task = tasks[req.params.id];
    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }
    res.json(task);
  } finally {
    mutex.unlock();
  }
});

app.put("/tasks/:id/complete", async (req, res) => {
  await mutex.lock();
  try {
    const task = tasks[req.params.id];
    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }
    if (task.status !== "processing") {
      return res.status(409).json({ error: "invalid state" });
    }
    task.status = "completed";
    res.json(task);
  } finally {
    mutex.unlock();
  }
});

app.get("/queue/view", async (req, res) => {
  await mutex.lock();
  try {
    res.json(pendingQueue.map(id => tasks[id]));
  } finally {
    mutex.unlock();
  }
});

app.get("/queue/stats", async (req, res) => {
  await mutex.lock();
  try {
    const stats = { pending: 0, processing: 0, completed: 0 };
    Object.values(tasks).forEach(t => stats[t.status]++);
    res.json(stats);
  } finally {
    mutex.unlock();
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
