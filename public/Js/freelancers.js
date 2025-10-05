document.addEventListener('DOMContentLoaded', async () => {
    const freelancersList = document.getElementById('freelancersList');

    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error('Failed to fetch freelancers');
        }

        const freelancers = await response.json();

        if (freelancers.length === 0) {
            freelancersList.innerHTML = '<p class="text-center">No freelancers found yet.</p>';
            return;
        }

        freelancers.forEach(freelancer => {
            const freelancerCard = document.createElement('div');
            freelancerCard.classList.add('col');
            freelancerCard.innerHTML = `
                <a href="/pages/freelancer-profile.html?id=${freelancer._id}" class="card-link">
                    <div class="card card-fiverr h-100">
                        <div class="card-body text-center">
                            <img src="https://placehold.co/100x100/22c55e/ffffff?text=F" class="rounded-circle mb-3" alt="Profile Picture">
                            <h5 class="card-title">${freelancer.name}</h5>
                            <p class="card-text">@${freelancer.username}</p>
                        </div>
                    </div>
                </a>
            `;
            freelancersList.appendChild(freelancerCard);
        });

    } catch (error) {
        console.error('Error loading freelancers:', error);
        freelancersList.innerHTML = `<p class="text-danger text-center">Failed to load freelancers. Please try again later.</p>`;
    }
});
    