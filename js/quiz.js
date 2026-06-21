let chosenChapter = Number(new URLSearchParams(location.search).get('chapter')) || 1;
let questionIndex = 0;
let selected = null;
let checked = false;
let answers = [];

const picker = document.getElementById('quizPicker');
const card = document.getElementById('quizCard');

function resetQuiz() {
  questionIndex = 0;
  selected = null;
  checked = false;
  answers = [];
}

function renderPicker() {
  picker.innerHTML = '<h3 style="margin:8px">Choose chapter</h3>' + CHAPTERS.map(chapter => `
    <button class="${chosenChapter === chapter.id ? 'active' : ''}" data-id="${chapter.id}">
      Ch. ${chapter.id} — ${esc(chapter.title)}
    </button>`).join('');

  picker.querySelectorAll('button[data-id]').forEach(button => {
    button.onclick = () => {
      chosenChapter = Number(button.dataset.id);
      history.replaceState(null, '', `?chapter=${chosenChapter}`);
      resetQuiz();
      renderPicker();
      renderQuiz();
    };
  });
}

function renderQuizComplete(chapter, score) {
  const best = getState().quizScores[chapter.id] || 0;
  card.innerHTML = `
    <span class="eyebrow">QUIZ COMPLETE</span>
    <h1>${score === 5 ? 'Perfect score! 🎉' : 'Quiz complete! 🎉'}</h1>
    <h2>Your score: ${score} / 5</h2>
    <p>${score === 5 ? 'Amazing work. You earned the Quick Learner badge requirement.' : 'Review the lesson and try again whenever you are ready.'}</p>
    <p class="muted">Best saved score: ${best} / 5</p>
    <div class="lesson-actions">
      <button class="btn btn-primary" id="again">Try Again</button>
      <a class="btn btn-secondary" href="learn.html?chapter=${chapter.id}">Continue Learning</a>
    </div>`;

  document.getElementById('again').onclick = () => {
    resetQuiz();
    renderQuiz();
  };
}

function finishQuiz(chapter, questions) {
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  const state = getState();
  state.quizScores[chapter.id] = Math.max(state.quizScores[chapter.id] || 0, score);
  saveState(state);
  renderQuizComplete(chapter, score);
}

function renderQuiz() {
  const chapter = CHAPTERS[chosenChapter - 1];
  const questions = quizForChapter(chapter);
  const question = questions[questionIndex];

  card.innerHTML = `
    <span class="question-count">Question ${questionIndex + 1} of ${questions.length}</span>
    <h1>Chapter ${chapter.id}: ${esc(chapter.title)}</h1>
    <h2>${esc(question.q)}</h2>
    <div class="quiz-options">
      ${question.options.map((option, index) => `
        <button class="quiz-option ${selected === index ? 'selected' : ''} ${checked && index === question.answer ? 'correct' : ''} ${checked && selected === index && index !== question.answer ? 'wrong' : ''}" data-option="${index}">
          ${String.fromCharCode(65 + index)}. ${esc(option)}
        </button>`).join('')}
    </div>
    <div class="lesson-actions">
      <button class="btn btn-primary" id="quizAction">${checked ? (questionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question →') : 'Check Answer'}</button>
      <a class="btn btn-secondary" href="learn.html?chapter=${chapter.id}">Back to chapter</a>
    </div>`;

  card.querySelectorAll('.quiz-option').forEach(button => {
    button.onclick = () => {
      if (checked) return;
      selected = Number(button.dataset.option);
      renderQuiz();
    };
  });

  document.getElementById('quizAction').onclick = () => {
    if (!checked) {
      if (selected === null) {
        toast('Choose an answer first.');
        return;
      }
      answers[questionIndex] = selected;
      checked = true;
      renderQuiz();
      return;
    }

    if (questionIndex < questions.length - 1) {
      questionIndex += 1;
      selected = null;
      checked = false;
      renderQuiz();
    } else {
      finishQuiz(chapter, questions);
    }
  };
}

renderPicker();
renderQuiz();
