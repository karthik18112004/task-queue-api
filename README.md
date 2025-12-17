# Task Queue API

This project is a simple REST API that simulates a task queue using in-memory data structures.  
It demonstrates FIFO queue behavior, task lifecycle management, and safe handling of concurrent requests.

The goal of this project is to understand how basic queueing systems work before moving on to production-grade tools like RabbitMQ or Kafka.

---

## Tech Stack

- Node.js
- Express.js
- In-memory data structures
- Custom mutex for concurrency control

---

## How to Run the Project

1. Clone the repository
```bash
git clone https://github.com/karthik18112004/task-queue-api.git
cd task-queue-api


Install dependencies

npm install


Start the server

node app.js


The server will run on:

http://localhost:5000

API Endpoints
POST /tasks

Enqueues a new task.

Request Body

{
  "payload": {
    "job": "example"
  }
}


Response

{
  "id": "task-id"
}

POST /tasks/dequeue

Dequeues the next task in FIFO order and marks it as processing.

GET /tasks/:id

Returns details and current status of a task.

PUT /tasks/:id/complete

Marks a task as completed.
This only works if the task is currently in the processing state.

GET /queue/view

Returns all pending tasks in the order they will be processed.

GET /queue/stats

Returns the number of tasks in each state (pending, processing, completed).

Concurrency Handling

Even though Node.js runs on a single thread, multiple HTTP requests can be processed at the same time.
To prevent race conditions, a custom mutex is used to ensure that only one request can modify the queue or task data at any given moment.

This guarantees:

No duplicate dequeues

No lost tasks

Correct FIFO ordering

Testing the API
Manual Testing

The API can be tested using Postman or cURL by calling each endpoint and verifying task states and FIFO behavior.

Concurrency Testing

A separate script is included to simulate multiple clients accessing the API at the same time.

node test_concurrent.js


This script sends concurrent enqueue and dequeue requests to validate that the queue remains consistent under load.

Limitations

This queue is entirely in memory, so all data is lost if the server restarts.
It also runs in a single process and cannot scale across multiple instances.
For production use cases, an external message broker would be required.

Notes

This project is intended for learning and demonstration purposes and focuses on correctness and clarity rather than production deployment.


---
