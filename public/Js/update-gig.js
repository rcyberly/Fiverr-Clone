document.addEventListener('DOMContentLoaded', async () => {
    const updateGigForm = document.getElementById('updateGigForm');
    const gigTitleInput = document.getElementById('gigTitle');
    const gigDescriptionInput = document.getElementById('gigDescription');
    const gigPriceInput = document.getElementById('gigPrice');
    const gigSkillsInput = document.getElementById('gigSkills');
    const messageDiv = document.getElementById('message');

    const urlParams = new URLSearchParams(window.location.search);
    const gigId = urlParams.get('id');

    // Redirect to login if not authenticated
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.replace('/pages/login.html');
        return;
    }

    if (!gigId) {
        messageDiv.classList.remove('d-none');
        messageDiv.classList.add('alert-danger');
        messageDiv.textContent = 'No gig ID provided. Cannot update gig.';
        updateGigForm.style.display = 'none';
        return;
    }

    // Function to fetch gig data and populate the form
    const fetchGigData = async () => {
        try {
            const response = await fetch(`/api/gigs/${gigId}`);
            if (!response.ok) {
                const error = await response.json();
                messageDiv.classList.remove('d-none');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = error.msg || 'Failed to fetch gig data.';
                return;
            }
            const gig = await response.json();
            gigTitleInput.value = gig.title;
            gigDescriptionInput.value = gig.description;
            gigPriceInput.value = gig.price;
            gigSkillsInput.value = gig.skills.join(', ');
        } catch (err) {
            console.error(err);
            messageDiv.classList.remove('d-none');
            messageDiv.classList.add('alert-danger');
            messageDiv.textContent = 'An error occurred while fetching gig data.';
        }
    };

    // Handle form submission
    updateGigForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = gigTitleInput.value;
        const description = gigDescriptionInput.value;
        const price = gigPriceInput.value;
        const skills = gigSkillsInput.value.split(',').map(s => s.trim());

        try {
            const response = await fetch(`/api/gigs/${gigId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, price, skills })
            });

            if (response.ok) {
                messageDiv.classList.remove('alert-danger');
                messageDiv.classList.add('alert-success');
                messageDiv.textContent = 'Gig updated successfully!';
                setTimeout(() => {
                    window.location.replace(`/pages/gig-details.html?id=${gigId}`);
                }, 1500);
            } else {
                const error = await response.json();
                messageDiv.classList.remove('alert-success');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = error.msg || 'Failed to update gig.';
            }
        } catch (err) {
            console.error(err);
            messageDiv.classList.remove('alert-success');
            messageDiv.classList.add('alert-danger');
            messageDiv.textContent = 'An error occurred while updating the gig.';
        }
    });

    fetchGigData();
});
