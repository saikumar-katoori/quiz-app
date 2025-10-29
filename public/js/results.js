// result.js
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

fetch(`/api/attempts/${userId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('score').textContent = `Your Score: ${data.latestScore}`;
    const attemptsList = document.getElementById('attempts');
    data.attempts.forEach(a => {
      const li = document.createElement('li');
      li.textContent = `Attempt ${a.attemptNo}: ${a.score} points`;
      attemptsList.appendChild(li);
    });
  })
  .catch(err => console.error('Error fetching results:', err));
