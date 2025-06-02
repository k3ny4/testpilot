document.addEventListener('DOMContentLoaded', () => {
  const addQuestionBtn = document.getElementById('add-question');
  const questionsContainer = document.getElementById('form-questions');
  const publishBtn = document.getElementById('publish-button');

  function createAnswerInput() {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'answer';
    input.placeholder = 'Answer option';
    return input;
  }

  function createQuestion(index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.dataset.index = index;

    const questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.className = 'question-name';
    questionInput.placeholder = 'Untitled question';

    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers';
    answersDiv.appendChild(createAnswerInput());
    answersDiv.appendChild(createAnswerInput());

    const addAnswerBtn = document.createElement('button');
    addAnswerBtn.type = 'button';
    addAnswerBtn.className = 'add-answer';
    addAnswerBtn.textContent = '+ Add answer';
    addAnswerBtn.addEventListener('click', () => {
      answersDiv.appendChild(createAnswerInput());
    });

    questionDiv.appendChild(questionInput);
    questionDiv.appendChild(answersDiv);
    questionDiv.appendChild(addAnswerBtn);

    return questionDiv;
  }

  addQuestionBtn.addEventListener('click', () => {
    const newIndex = questionsContainer.querySelectorAll('.question').length;
    const newQuestion = createQuestion(newIndex);
    questionsContainer.insertBefore(newQuestion, addQuestionBtn);
  });

  publishBtn.addEventListener('click', async () => {
    const formName = document.getElementById('form-name').value.trim() || 'Untitled form';
    const formDescription = document.getElementById('form-description').value.trim();

    const questionsElems = questionsContainer.querySelectorAll('.question');
    const questions = [];

    for (const qElem of questionsElems) {
      const qText = qElem.querySelector('.question-name').value.trim();
      if (!qText) continue;

      const answerInputs = qElem.querySelectorAll('.answer');
      const answers = [];
      for (const aInput of answerInputs) {
        const aText = aInput.value.trim();
        if (aText) answers.push(aText);
      }

      if (answers.length === 0) continue;

      questions.push({
        question: qText,
        answers,
      });
    }

    if (questions.length === 0) {
      alert('Please add at least one question with answers.');
      return;
    }

    const test = {
      name: formName,
      description: formDescription,
      questions,
    };

    try {
      const res = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
      });
      if (!res.ok) throw new Error('Failed to save test');
      alert('Test published successfully!');
      window.location.href = '/diploma/front/pages/index-en.html'; // Повертаємось на головну
    } catch (err) {
      alert('Error saving test: ' + err.message);
    }
  });
});
