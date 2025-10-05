document.addEventListener('DOMContentLoaded', async () => {
    const gigsContainer = document.getElementById('gigs-container');
    const searchButton = document.getElementById('searchButton');
    const keywordsInput = document.getElementById('keywordsInput');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    const messageDiv = document.getElementById('message');

    // Function to fetch and display gigs
    const fetchAndDisplayGigs = async (keywords, minPrice, maxPrice) => {
        try {
            gigsContainer.innerHTML = '';
            if (messageDiv) {
                messageDiv.classList.add('d-none');
            }
            
            let url = '/api/gigs';
            const params = new URLSearchParams();
            if (keywords) params.append('keywords', keywords);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const gigs = await response.json();

            if (gigs.length === 0) {
                if (messageDiv) {
                    messageDiv.classList.remove('d-none');
                    messageDiv.classList.add('alert-info');
                    messageDiv.textContent = 'No gigs found matching your criteria.';
                }
            } else {
                renderGigs(gigs);
            }
        } catch (err) {
            console.error(err);
            if (messageDiv) {
                messageDiv.classList.remove('d-none');
                messageDiv.classList.add('alert-danger');
                messageDiv.textContent = 'An error occurred while fetching gigs.';
            }
        }
    };

    // Function to render gigs on the page
    const renderGigs = (gigs) => {
        gigsContainer.innerHTML = '';
        gigs.forEach(gig => {
            const gigCard = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card card-fiverr h-100 shadow-sm">
                        <img src="https://placehold.co/600x400/1DBF73/ffffff?text=${encodeURIComponent(gig.title)}" class="card-img-top" alt="Gig Image">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${gig.title}</h5>
                            <p class="card-text text-muted">${gig.description}</p>
                            <span class="badge bg-secondary mb-2">${gig.skills.join(', ')}</span>
                        </div>
                        <div class="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-fiverr-green">Starting at $${gig.price}</span>
                            <a href="/pages/gig-details.html?id=${gig._id}" class="btn btn-sm btn-outline-secondary">Details</a>
                        </div>
                    </div>
                </div>
            `;
            gigsContainer.innerHTML += gigCard;
        });
    };

    // Event listener for search button
    searchButton.addEventListener('click', () => {
        const keywords = keywordsInput.value;
        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;
        fetchAndDisplayGigs(keywords, minPrice, maxPrice);
    });

    // Initial fetch of all gigs on page load
    fetchAndDisplayGigs();
});
