const axios = require("axios");

const BASE = "http://localhost:5000";

async function enqueue(i) {
  const res = await axios.post(`${BASE}/tasks`, {
    payload: { value: i }
  });
  console.log("ENQ", res.data.id);
}

async function dequeue() {
  try {
    const res = await axios.post(`${BASE}/tasks/dequeue`);
    console.log("DEQ", res.data.id);
  } catch {
    console.log("EMPTY");
  }
}

(async () => {
  await Promise.all(
    Array.from({ length: 10 }, (_, i) => enqueue(i))
  );

  await Promise.all(
    Array.from({ length: 10 }, () => dequeue())
  );
})();
