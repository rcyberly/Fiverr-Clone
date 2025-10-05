document.addEventListener('DOMContentLoaded', async () => {
    // Get a reference to the container where gigs will be displayed
    const myGigsContainer = document.getElementById('my-gigs-container');
    const messageDiv = document.getElementById('message');

    // Get the authentication token from local storage
    const token = localStorage.getItem('token');

    // If no token exists, the user is not logged in. Redirect them.
    if (!token) {
        window.location.href = '/pages/login.html';
        return;
    }

    // Function to display a message to the user
    const showMessage = (msg, isError = false) => {
        messageDiv.textContent = msg;
        messageDiv.className = isError ? 'mt-4 alert alert-danger' : 'mt-4 alert alert-info';
    };

    // Function to fetch the user's gigs from the API
    const fetchMyGigs = async () => {
        try {
            const response = await fetch('/api/gigs/my-gigs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // If the response is not OK, something is wrong with the token or server
            if (!response.ok) {
                // If token is invalid (401), remove it and redirect to login
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/pages/login.html';
                }
                throw new Error('Failed to fetch your gigs.');
            }

            const gigs = await response.json();
            displayGigs(gigs);

        } catch (error) {
            console.error('Error fetching gigs:', error);
            showMessage('An error occurred while fetching your gigs.', true);
        }
    };

    // Function to dynamically create and display gig cards
    const displayGigs = (gigs) => {
        myGigsContainer.innerHTML = ''; // Clear previous content
        if (gigs.length === 0) {
            showMessage('You have not posted any gigs yet.', false);
            return;
        }

        gigs.forEach(gig => {
            const gigCardHtml = `
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card card-fiverr h-100">
                        <img src="https://placehold.co/600x400/1DBF73/ffffff?text=${encodeURIComponent(gig.title)}" class="card-img-top" alt="Gig Image">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${gig.title}</h5>
                            <p class="card-text text-muted">${gig.description}</p>
                        </div>
                        <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-fiverr-green">Starting at $${gig.price}</span>
                            <div>
                                <a href="update-gigs.html?id=${gig._id}" class="btn btn-sm btn-fiverr me-2">Update</a>
                                <button class="btn btn-sm btn-outline-danger delete-gig-btn" data-gig-id="${gig._id}">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            myGigsContainer.innerHTML += gigCardHtml;
        });

        // Add event listeners to all newly created delete buttons
        document.querySelectorAll('.delete-gig-btn').forEach(button => {
            button.addEventListener('click', handleDeleteGig);
        });
    };

    // Function to handle the deletion of a gig
    const handleDeleteGig = async (event) => {
        const gigId = event.target.dataset.gigId;
        const confirmDelete = confirm('Are you sure you want to delete this gig?');
        
        if (confirmDelete) {
            try {
                const response = await fetch(`/api/gigs/${gigId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert('Gig deleted successfully!');
                    fetchMyGigs(); // Refresh the list of gigs
                } else {
                    const error = await response.json();
                    alert(error.msg || 'Failed to delete gig.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred while deleting the gig.');
            }
        }
    };

    // Initial call to fetch and display gigs
    fetchMyGigs();
});
