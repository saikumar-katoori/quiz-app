// public/js/main.js
const loginBtn = document.getElementById('loginBtn');
const authSection = document.getElementById('auth-section');
const topicSection = document.getElementById('topic-section');

let userId = null;

// Check if already logged in
window.onload = () => {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
        userId = storedUserId;
        authSection.style.display = 'none';
        topicSection.style.display = 'block';
    } else {
        authSection.style.display = 'block';
        topicSection.style.display = 'none';
    }
}; // no need 

// Login / Register
loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) return alert('Enter username and password');

    const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: username, password })
});
console.log(res);

const data = await res.json();
if (!data.success) return alert(data.message || 'Login failed');

userId = data.userId;
sessionStorage.setItem('userId', userId); // keep it in session

    authSection.style.display = 'none';
    topicSection.style.display = 'block';
});

// Topic buttons
document.querySelectorAll('.topic').forEach(btn => {
    btn.addEventListener('click', () => {
        const topic = btn.dataset.topic;
        sessionStorage.setItem('topic', topic);
        window.location.href = 'quiz.html';
    });
});
