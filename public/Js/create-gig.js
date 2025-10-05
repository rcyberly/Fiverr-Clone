document.addEventListener('DOMContentLoaded', async () => {
    const createGigForm = document.getElementById('createGigForm');
    const messageDiv = document.getElementById('message');
    const token = localStorage.getItem('token');

    // Redirect to login if not authenticated
    if (!token) {
        window.location.replace('/pages/login.html');
        return;
    }

    createGigForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const skills = document.getElementById('skills').value.split(',').map(s => s.trim());

        const newGig = {
            title,
            description,
            price: Number(price),
            skills
        };

        try {
            const response = await fetch('/api/gigs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newGig)
            });

            if (response.ok) {
                messageDiv.classList.remove('text-danger');
                messageDiv.classList.add('text-success');
                messageDiv.textContent = 'Gig posted successfully!';
                createGigForm.reset();
                setTimeout(() => {
                    window.location.replace('/pages/my-gigs.html');
                }, 1500); // Redirect to my-gigs page after 1.5 seconds
            } else {
                const error = await response.json();
                messageDiv.classList.remove('text-success');
                messageDiv.classList.add('text-danger');
                messageDiv.textContent = error.msg || 'Failed to post gig.';
            }
        } catch (err) {
            console.error(err);
            messageDiv.classList.remove('text-success');
            messageDiv.classList.add('text-danger');
            messageDiv.textContent = 'An error occurred while posting the gig.';
        }
    });
});