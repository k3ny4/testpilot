async function fetchTests() {
  try {
    const res = await fetch('/api/tests');
    if (!res.ok) throw new Error('Failed to load tests');
    const tests = await res.json();
    return tests;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function renderTests(tests) {
  const content = document.getElementById('content');
  const infoMessage = document.getElementById('info-message');
  if (!tests.length) {
    infoMessage.style.display = 'block';
    return;
  }
  infoMessage.style.display = 'none';
  content.innerHTML = ''; // Очищаємо старий вміст

  tests.forEach(test => {
    const testDiv = document.createElement('div');
    testDiv.className = 'test-item';
    testDiv.style = `
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(60,72,88,0.08);
      padding: 20px;
      margin-bottom: 15px;
      width: 100%;
      max-width: 600px;
    `;
    testDiv.innerHTML = `
      <h3>${test.name}</h3>
      <p>${test.description || ''}</p>
      <p><strong>Questions:</strong> ${test.questions.length}</p>
    `;
    content.appendChild(testDiv);
  });
}

async function init() {
  const tests = await fetchTests();
  renderTests(tests);
}

document.addEventListener('DOMContentLoaded', init);
