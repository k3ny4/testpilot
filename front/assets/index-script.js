document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');
  const infoMessage = document.getElementById('info-message');

  try {
    const res = await fetch('http://localhost:3001/api/tests');
    if (!res.ok) throw new Error('Failed to fetch tests');
    const tests = await res.json();

    if (!tests.length) {
      infoMessage.style.display = 'block';
      content.innerHTML = '';
      return;
    }

    infoMessage.style.display = 'none';
    content.innerHTML = '';

    tests.forEach(test => {
      const testDiv = document.createElement('div');
      testDiv.className = 'test-item';
      testDiv.tabIndex = 0;
      testDiv.innerHTML = `
        <h3>${test.name}</h3>
        <p>${test.description || ''}</p>
        <p><strong>Questions:</strong> ${test.questions.length}</p>
      `;

      testDiv.addEventListener('click', () => {
        window.location.href = `/pages/editpage.html?id=${test.id}`;
      });

      testDiv.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = `/pages/editpage.html?id=${test.id}`;
        }
      });

      content.appendChild(testDiv);
    });
  } catch (err) {
    console.error('Fetch error:', err);
    infoMessage.textContent = 'Error loading tests.';
    infoMessage.style.display = 'block';
  }
});