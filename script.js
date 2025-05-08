fetch('./starter/projectsData.json')
    .then(response => response.json())
    .then(data => {
        const projectList = document.getElementById('projectList');
        const spotlightTitles = document.getElementById('spotlightTitles');
        const spotlightContainer = document.getElementById('projectSpotlight');
        let currentIndex = 0;

        function renderProjects() {
            // Clear the existing project cards
            projectList.innerHTML = '';
            data.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('projectCard');
                card.id = project.project_id;  // Make sure the id matches the project id
                card.style.background = `url('${project.card_image || '../images/default_image.webp'}') center/cover no-repeat`;  // Fallback to default image
                card.innerHTML = `
                    <h3>${project.project_name}</h3>
                    <p>${project.short_description || 'No short description available'}</p>
                `;
                
                // Add click event for each project card
                card.addEventListener('click', () => {
                    currentIndex = data.findIndex(p => p.project_id === project.project_id);
                    updateSpotlight(data[currentIndex]);
                });

                projectList.appendChild(card);
            });
        }

        function updateSpotlight(project) {
            spotlightTitles.innerHTML = `
                <h3>${project.project_name}</h3>
                <p>${project.long_description || 'No description available'}</p>
                <a href="${project.url || '#'}" target="_blank">View Project</a>
            `;
            spotlightContainer.style.background = `url('${project.spotlight_image || '../images/default_spotlight.webp'}') center/cover no-repeat`;
        }

        // Initialize with the first project in the array
        renderProjects();
        updateSpotlight(data[0]);

        // Handle arrow navigation for scrolling through projects
        const leftArrow = document.querySelector('.arrow-left');
        const rightArrow = document.querySelector('.arrow-right');

        leftArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + data.length) % data.length;
            updateSpotlight(data[currentIndex]);
        });

        rightArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % data.length;
            updateSpotlight(data[currentIndex]);
        });
    })
    .catch(error => console.error('Error loading project data:', error));

// Form validation and character count
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidCharsRegex = /[^a-zA-Z0-9@._\- ]/;
const emailInput = document.getElementById('contactEmail');
const messageInput = document.getElementById('contactMessage');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const charactersLeft = document.getElementById('charactersLeft');
const form = document.getElementById('formSection');
const MAX_MESSAGE_LENGTH = 300;

messageInput.addEventListener('input', () => {
    const currentLength = messageInput.value.length;
    charactersLeft.textContent = `Characters: ${currentLength}/${MAX_MESSAGE_LENGTH}`;
    if (currentLength > MAX_MESSAGE_LENGTH) {
        charactersLeft.classList.add('error');
    } else {
        charactersLeft.classList.remove('error');
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    emailError.textContent = '';
    messageError.textContent = '';

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (email === '') {
        emailError.textContent = 'Email is required.';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    } else if (invalidCharsRegex.test(email)) {
        emailError.textContent = 'Email contains invalid characters.';
        isValid = false;
    }

    if (message === '') {
        messageError.textContent = 'Message is required.';
        isValid = false;
    } else if (invalidCharsRegex.test(message)) {
        messageError.textContent = 'Message contains invalid characters.';
        isValid = false;
    } else if (message.length > MAX_MESSAGE_LENGTH) {
        messageError.textContent = `Message exceeds ${MAX_MESSAGE_LENGTH} characters.`;
        isValid = false;
    }

    if (isValid) {
        alert('Message sent successfully!');
        form.reset();
        charactersLeft.textContent = `Characters: 0/${MAX_MESSAGE_LENGTH}`;
    }
});

