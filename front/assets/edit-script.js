document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const testId = urlParams.get('id');
  if (!testId) {
    alert('No test id specified');
    return;
  }

  const formName = document.getElementById('form-name');
  const formDescription = document.getElementById('form-description');
  const questionsContainer = document.getElementById('form-questions');
  const addQuestionBtn = document.getElementById('add-question');
  const saveButton = document.getElementById('save-button');

  function createAnswerInput(value = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'answer-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'answer';
    input.placeholder = 'Answer option';
    input.value = value;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.textContent = '✖';
    delBtn.title = 'Delete answer';
    delBtn.className = 'delete-answer';

    delBtn.addEventListener('click', () => {
      wrapper.remove();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(delBtn);

    return wrapper;
  }

  function createQuestionBlock(questionData = { question: '', answers: [] }) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    const questionHeader = document.createElement('div');
    questionHeader.className = 'question-header';

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.className = 'question-name';
    questionInput.placeholder = 'Untitled question';
    questionInput.value = questionData.question;

    const delQuestionBtn = document.createElement('button');
    delQuestionBtn.type = 'button';
    delQuestionBtn.textContent = 'Delete question';
    delQuestionBtn.className = 'delete-question';

    delQuestionBtn.addEventListener('click', () => {
      questionDiv.remove();
    });

    questionHeader.appendChild(questionInput);
    questionHeader.appendChild(delQuestionBtn);

    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers';

    questionData.answers.forEach(ans => {
      answersDiv.appendChild(createAnswerInput(ans));
    });

    if (questionData.answers.length === 0) {
      answersDiv.appendChild(createAnswerInput());
      answersDiv.appendChild(createAnswerInput());
    }

    const addAnswerBtn = document.createElement('button');
    addAnswerBtn.type = 'button';
    addAnswerBtn.textContent = '+ Add answer';
    addAnswerBtn.className = 'add-answer';

    addAnswerBtn.addEventListener('click', () => {
      answersDiv.appendChild(createAnswerInput());
    });

    questionDiv.appendChild(questionHeader);
    questionDiv.appendChild(answersDiv);
    questionDiv.appendChild(addAnswerBtn);

    return questionDiv;
  }

  async function loadTest() {
    try {
      const res = await fetch(`http://localhost:3001/api/tests/${testId}`);
      if (!res.ok) throw new Error('Test not found');
      const test = await res.json();

      formName.value = test.name || '';
      formDescription.value = test.description || '';
      questionsContainer.innerHTML = '';

      test.questions.forEach(q => {
        questionsContainer.appendChild(createQuestionBlock(q));
      });
    } catch (err) {
      alert('Error loading test: ' + err.message);
      console.error(err);
    }
  }

  function collectFormData() {
    const name = formName.value.trim() || 'Untitled test';
    const description = formDescription.value.trim();

    const questions = [];
    const questionElems = questionsContainer.querySelectorAll('.question');

    questionElems.forEach(qElem => {
      const qText = qElem.querySelector('.question-name')?.value.trim();
      if (!qText) return;

      const answers = [];
      qElem.querySelectorAll('.answer').forEach(a => {
        const val = a.value.trim();
        if (val) answers.push(val);
      });

      if (answers.length > 0) {
        questions.push({ question: qText, answers });
      }
    });

    return { name, description, questions };
  }

  saveButton.addEventListener('click', async () => {
    const data = collectFormData();
    if (data.questions.length === 0) {
      alert('Add at least one question with answers');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/tests/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save test');
      alert('Test saved successfully!');
      window.location.href = '/pages/index-en.html';
    } catch (err) {
      alert('Error saving test: ' + err.message);
      console.error(err);
    }
  });

  addQuestionBtn.addEventListener('click', () => {
    questionsContainer.appendChild(createQuestionBlock());
  });

  loadTest();
});