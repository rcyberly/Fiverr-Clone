document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevents the form from submitting normally

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isFreelancer = document.getElementById('isFreelancer').checked;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, isFreelancer }),
        });

        const data = await response.json();

        if (response.ok) { // The 'ok' property is true if the status is in the 200-299 range
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';
            console.log(data); // Log the full response for debugging
        } else {
            messageDiv.textContent = data.msg || 'Registration failed.';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        messageDiv.textContent = 'Something went wrong. Please try again later.';
        messageDiv.style.color = 'red';
    }
});