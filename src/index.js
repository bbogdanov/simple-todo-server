import express, { json, urlencoded } from 'express';
import { randomBytes } from "crypto";
const app = express()
const port = process.env.PORT || 3000;

const tasks = [
  {
    id: randomBytes(16).toString("hex"),
    title: 'Example',
    description: 'This one is a simple description of a todo task',
    isInProgress: false,
    completed: false,
  }
];

const isValidTask = (task) => {
  return task.title && task.title.toString().trim() !== '' && task.description && task.description.toString().trim() !== '';
};

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (_, res) => {
  res.send('Welcome to TUES simple TODO server');
});

app.get('/tasks', (_, res) => {
  res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
  res.send(tasks.find(x => x.id === req.params.id));
});

app.put('/tasks/:id', (req, res) => {
  if (!isValidTask(req.body)) {
    res.status(422);
    res.send({
      message: 'Title and description are required'
    });
    return;
  }

  const id = req.params.id;
  const task = tasks.find(x => x.id === id);

  if (!task) {
    res.status(404);
    res.send({
      message: 'Task not found'
    });
    return;
  }

  task.title = req.body.title;
  task.description = req.body.description;
  task.isInProgress = req.body.isInProgress;
  task.completed = req.body.completed;
  res.send(task);
});


app.post('/tasks', (req, res) => {
  if (!isValidTask(req.body)) {
    res.status(422);
    res.send({
      message: 'Title and description are required'
    });
    return;
  }

  const newTask = req.body;
  newTask.id = randomBytes(16).toString("hex");
  tasks.push(newTask);
  res.send(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const task = tasks.find((x)=> x.id === req.params.id);

  if (!task) {
    res.status(404);
    res.send({
      message: 'Task not found'
    });
    return;
  }

  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  res.send(task);
});

app.listen(port, () => {
  console.log(`The server runs on port ${port}`)
});