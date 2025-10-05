document.addEventListener('DOMContentLoaded', async () => {
    const gigDetailsContainer = document.getElementById('gig-details-container');
    const updateBtn = document.getElementById('update-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const messageDiv = document.getElementById('message');
    const urlParams = new URLSearchParams(window.location.search);
    const gigId = urlParams.get('id');

    if (!gigId) {
        gigDetailsContainer.innerHTML = '<div class="alert alert-danger text-center">Gig ID not provided.</div>';
        return;
    }

    // Function to fetch and render gig details
    const fetchAndRenderGig = async () => {
        try {
            const response = await fetch(`/api/gigs/${gigId}`);
            if (!response.ok) {
                const error = await response.json();
                gigDetailsContainer.innerHTML = `<div class="alert alert-danger text-center">${error.msg || 'Gig not found.'}</div>`;
                return;
            }
            const gig = await response.json();
            renderGigDetails(gig);
            checkUserOwnership(gig.freelancer);
        } catch (err) {
            console.error(err);
            gigDetailsContainer.innerHTML = '<div class="alert alert-danger text-center">An error occurred while fetching gig details.</div>';
        }
    };

    // Function to render the details
    const renderGigDetails = (gig) => {
        gigDetailsContainer.innerHTML = `
            <img src="https://placehold.co/800x400/1DBF73/ffffff?text=${encodeURIComponent(gig.title)}" class="card-img-top" alt="Gig Image">
            <div class="card-body">
                <h1 class="card-title fw-bold">${gig.title}</h1>
                <p class="text-muted">By: ${gig.freelancer.username}</p>
                <p class="card-text">${gig.description}</p>
                <p class="fw-bold fs-4 text-fiverr-green">Starting at $${gig.price}</p>
                <div class="mt-3">
                    <span class="badge bg-secondary me-1">Skills:</span>
                    ${gig.skills.map(skill => `<span class="badge bg-primary me-1">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    };

    // Function to check if the current user is the owner
    const checkUserOwnership = (freelancerId) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                if (decoded.user.id === freelancerId) {
                    updateBtn.style.display = 'inline-block';
                    deleteBtn.style.display = 'inline-block';
                }
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    };

    // Handle update button click
    updateBtn.addEventListener('click', () => {
        window.location.href = `/pages/update-gig.html?id=${gigId}`;
    });

    // Handle delete button click
    deleteBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`/api/gigs/${gigId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                messageDiv.classList.remove('alert-danger');
                messageDiv.classList.add('alert-success');
                messageDiv.textContent = 'Gig deleted successfully!';
                setTimeout(() => {
                    window.location.replace('/pages/my-gigs.html');
                }, 1500);
            } else {
                const error = await response.json();
                messageDiv.classList.remove('alert-success');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = error.msg || 'Failed to delete gig.';
            }
        } catch (err) {
            console.error(err);
            messageDiv.classList.remove('alert-success');
            messageDiv.classList.add('alert-danger');
            messageDiv.textContent = 'An error occurred while deleting the gig.';
        }
    });

    fetchAndRenderGig();
});

