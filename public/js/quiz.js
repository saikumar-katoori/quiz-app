// public/js/quiz.js

const topicTitle = document.getElementById('topic-title');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');

const userId = sessionStorage.getItem('userId');
const topic = sessionStorage.getItem('topic');

topicTitle.innerText = `Topic: ${topic}`;

let questions = [];
let currentIndex = 0;
let score = 0;

// Fetch 10 random questions from API
async function loadQuestions() {
  const res = await fetch(`/api/questions/${topic}`);
  const data = await res.json();
  questions = data.questions;
  showQuestion();
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    finishQuiz();
    return;
  }

  const q = questions[currentIndex];
  questionText.innerText = q.questionText;
  optionsDiv.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.onclick = () => answer(index);
    optionsDiv.appendChild(btn);
  });
}

function answer(selectedIndex) {
  const q = questions[currentIndex];
  if (selectedIndex === q.correctIndex) score++;
  currentIndex++;
  showQuestion();
}



// quiz.js
async function saveResult() {
  await fetch('/api/saveResult', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      topic: selectedTopic,
      score,
      total: questions.length
    })
  });
}

async function finishQuiz() {
  // Save result to DB
  await fetch('/api/saveResult', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, topic, score, total: questions.length })
  });

  // Redirect to results page with query param (optional)
  window.location.href = `result.html?userId=${userId}`;
}



// nextBtn.addEventListener('click', () => {
//   currentIndex++;
//   showQuestion();
// });

loadQuestions();
