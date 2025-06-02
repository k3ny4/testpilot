import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_FILE = path.resolve('./tests.json');

app.use(express.json());
app.use(express.static('front')); // Подаємо статичні файли (html, css, js)

async function readTests() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return []; // Якщо файла нема, повертаємо пустий масив
    throw err;
  }
}

async function writeTests(tests) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tests, null, 2));
}

// Отримати всі тести
app.get('/api/tests', async (req, res) => {
  const tests = await readTests();
  res.json(tests);
});

// Створити новий тест
app.post('/api/tests', async (req, res) => {
  const newTest = req.body;
  if (!newTest.name || !newTest.questions) {
    return res.status(400).json({ error: 'Invalid test data' });
  }
  const tests = await readTests();

  // Додаємо унікальний id (простіший варіант)
  newTest.id = Date.now().toString();
  tests.push(newTest);
  await writeTests(tests);
  res.status(201).json(newTest);
});

// Оновити тест за id
app.put('/api/tests/:id', async (req, res) => {
  const testId = req.params.id;
  const updatedTest = req.body;
  const tests = await readTests();
  const index = tests.findIndex(t => t.id === testId);
  if (index === -1) {
    return res.status(404).json({ error: 'Test not found' });
  }
  tests[index] = { ...tests[index], ...updatedTest };
  await writeTests(tests);
  res.json(tests[index]);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
