const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'local-db', 'tests.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../front')));

function readTests() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch {
    return [];
  }
}

function writeTests(tests) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(tests, null, 2));
  } catch (err) {
    console.error('Failed to write tests:', err.message);
  }
}

app.get('/api/tests', (req, res) => {
  const tests = readTests();
  res.json(tests);
});

app.get('/api/tests/:id', (req, res) => {
  const tests = readTests();
  const testId = Number(req.params.id);
  const test = tests.find(t => t.id === testId);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  res.json(test);
});

app.post('/api/tests', (req, res) => {
  const { name, description, questions } = req.body;
  if (!name || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Invalid test data' });
  }
  const tests = readTests();
  const newTest = {
    id: Date.now(),
    name,
    description: description || '',
    questions,
  };
  tests.push(newTest);
  writeTests(tests);
  res.status(201).json({ message: 'Test created', test: newTest });
});

app.put('/api/tests/:id', (req, res) => {
  const testId = Number(req.params.id);
  const { name, description, questions } = req.body;

  const tests = readTests();
  const index = tests.findIndex(test => test.id === testId);
  if (index === -1) {
    return res.status(404).json({ error: 'Test not found' });
  }

  tests[index] = {
    ...tests[index],
    name: name || tests[index].name,
    description: description || tests[index].description,
    questions: Array.isArray(questions) ? questions : tests[index].questions,
  };

  writeTests(tests);
  res.json({ message: 'Test updated', test: tests[index] });
});

app.get('/', (req, res) => {
  res.redirect('/pages/index-en.html');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});