document.addEventListener('DOMContentLoaded', () => {
  const addQuestionBtn = document.getElementById('add-question');
  const questionsContainer = document.getElementById('form-questions');
  const publishBtn = document.getElementById('publish-button');

  function createAnswerInput(){
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'answer';
    input.placeholder = 'Answer option';
    return input;
  }

  function createQuestion(index){
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

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
    const newQuestion = createQuestion();
    questionsContainer.appendChild(newQuestion);
  });

  publishBtn.addEventListener('click', async () => {
    const formName = document.getElementById('form-name').value.trim() || 'Untitled test';
    const formDescription = document.getElementById('form-description').value.trim();

    const questions = [];
    const questionElems = document.querySelectorAll('.question');

    for (const qElem of questionElems) {
      const qText = qElem.querySelector('.question-name')?.value.trim();
      if (!qText) continue;

      const answers = [];
      const answerInputs = qElem.querySelectorAll('.answer');
      answerInputs.forEach(input => {
        const value = input.value.trim();
        if (value) answers.push(value);
      });

      if (answers.length > 0) {
        questions.push({ question: qText, answers });
      }
    }

    if (questions.length === 0){
      alert('Please add at least one valid question with answers.');
      return;
    }

    const testData = { name: formName, description: formDescription, questions };

    try {
      const res = await fetch('http://localhost:3001/api/tests',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (!res.ok) throw new Error('Server error');
      alert('Test created successfully!');
      window.location.href = '/pages/index-en.html';
    } 
    catch (err) {
      alert('Error creating test: ' + err.message);
      console.error(err);
    }
  });
});
