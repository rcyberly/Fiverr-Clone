document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('loading');
    const profileContentElement = document.getElementById('freelancerProfileContent');
    const notFoundElement = document.getElementById('notFound');

    const freelancerName = document.getElementById('freelancerName');
    const freelancerUsername = document.getElementById('freelancerUsername');
    const freelancerBio = document.getElementById('freelancerBio');
    const freelancerEmail = document.getElementById('freelancerEmail');
    const freelancerGigsList = document.getElementById('freelancerGigsList');
    const freelancerGigsSection = document.getElementById('freelancerGigsSection');

    const urlParams = new URLSearchParams(window.location.search);
    const freelancerId = urlParams.get('id');

    if (!freelancerId) {
        loadingElement.style.display = 'none';
        notFoundElement.classList.remove('d-none');
        return;
    }

    try {
        const [profileResponse, gigsResponse] = await Promise.all([
            fetch(`/api/users/${freelancerId}`),
            fetch('/api/gigs')
        ]);

        if (!profileResponse.ok) {
            throw new Error('Freelancer not found');
        }

        const profileData = await profileResponse.json();
        const allGigs = await gigsResponse.json();
        const freelancerGigs = allGigs.filter(gig => gig.user === freelancerId);

        // Populate profile information
        freelancerName.textContent = profileData.name;
        freelancerUsername.textContent = `@${profileData.username}`;
        freelancerBio.textContent = profileData.bio || 'This freelancer has not added a bio yet.';
        freelancerEmail.textContent = `Email: ${profileData.email}`;

        // Populate gigs
        if (freelancerGigs.length > 0) {
            freelancerGigs.forEach(gig => {
                const gigCard = document.createElement('div');
                gigCard.classList.add('col');
                gigCard.innerHTML = `
                    <div class="card card-fiverr h-100">
                        <div class="card-body">
                            <h5 class="card-title">${gig.title}</h5>
                            <p class="card-text">${gig.description}</p>
                            <p class="card-text fw-bold">$${gig.price}</p>
                            <a href="/pages/gig-details.html?id=${gig._id}" class="btn btn-fiverr">View Details</a>
                        </div>
                    </div>
                `;
                freelancerGigsList.appendChild(gigCard);
            });
        } else {
            freelancerGigsSection.innerHTML = '<p class="text-muted">This freelancer has not posted any gigs yet.</p>';
        }

        loadingElement.style.display = 'none';
        profileContentElement.style.display = 'block';

    } catch (error) {
        console.error('Error loading freelancer profile:', error);
        loadingElement.style.display = 'none';
        notFoundElement.classList.remove('d-none');
    }
});
