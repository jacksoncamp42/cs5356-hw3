document.addEventListener('DOMContentLoaded', function() {
    fetchSpaceFact();
    
    const factButton = document.getElementById('get-new-fact');
    if (factButton) {
        factButton.addEventListener('click', fetchSpaceFact);
    }
    
    addInteractiveEffects();
    
    createStarryBackground();
});

const SPACE_APIS = [
    {
        name: 'NASA Astronomy Picture of the Day',
        url: 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
        process: (data) => {
            return {
                title: data.title,
                content: data.explanation,
                media: data.url,
                mediaType: data.media_type,
                source: 'NASA APOD'
            };
        }
    },
    {
        name: 'ISS Current Location',
        url: 'https://api.wheretheiss.at/v1/satellites/25544',
        process: (data) => {
            return {
                title: 'International Space Station',
                content: `The ISS is currently flying at an altitude of ${Math.round(data.altitude)} km above Earth at a velocity of ${Math.round(data.velocity)} km/h. It's currently over ${data.latitude.toFixed(2)}° latitude, ${data.longitude.toFixed(2)}° longitude.`,
                source: 'Where The ISS At API'
            };
        }
    },
    {
        name: 'Random Space Facts',
        url: 'https://api.le-systeme-solaire.net/rest/bodies/earth',
        process: (data) => {
            const facts = [
                `Earth's mean radius is ${data.meanRadius} km.`,
                `Earth takes ${data.sideralRotation} hours to complete one rotation.`,
                `Earth's gravity is ${data.gravity} m/s², which is what keeps us grounded.`,
                `Earth's average temperature is ${data.avgTemp} Kelvin.`,
                `Earth has ${data.moons ? data.moons.length : 1} natural satellite: the Moon.`,
                `It takes Earth ${data.sideralOrbit} days to orbit around the Sun.`,
                `Earth's escape velocity is ${data.escape} km/s - the speed needed to escape Earth's gravitational pull.`
            ];
            
            return {
                title: 'Earth Facts',
                content: facts[Math.floor(Math.random() * facts.length)],
                source: 'Solar System OpenData'
            };
        }
    },
    {
        name: 'Random Space Quotes',
        url: 'local-quotes',
        process: () => {
            const quotes = [
                {
                    quote: "The Earth is the cradle of humanity, but mankind cannot stay in the cradle forever.",
                    author: "Konstantin Tsiolkovsky"
                },
                {
                    quote: "I know the sky is not the limit because there are footprints on the Moon — and I made some of them!",
                    author: "Buzz Aldrin"
                },
                {
                    quote: "The universe is a pretty big place. If it's just us, seems like an awful waste of space.",
                    author: "Carl Sagan"
                },
                {
                    quote: "We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.",
                    author: "Stephen Hawking"
                },
                {
                    quote: "I looked and looked but I didn't see God.",
                    author: "Yuri Gagarin"
                },
                {
                    quote: "Space is for everybody. It's not just for a few people in science or math, or for a select group of astronauts. That's our new frontier out there, and it's everybody's business to know about space.",
                    author: "Christa McAuliffe"
                }
            ];
            
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            
            return {
                title: 'Space Quote',
                content: `"${randomQuote.quote}" — ${randomQuote.author}`,
                source: 'Famous Space Quotes Collection'
            };
        }
    }
];

async function fetchSpaceFact() {
    const spaceContainer = document.getElementById('space-container');
    if (!spaceContainer) return;
    
    spaceContainer.innerHTML = '<div class="loading-animation"></div>';
    
    const selectedApi = SPACE_APIS[Math.floor(Math.random() * SPACE_APIS.length)];
    
    try {
        let data;
        
        if (selectedApi.url === 'local-quotes') {
            data = selectedApi.process();
        } else {
            const response = await fetch(selectedApi.url);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            
            const jsonData = await response.json();
            data = selectedApi.process(jsonData);
        }
        
        let htmlContent = `
            <h3>${data.title}</h3>
            <p class="space-content">${data.content}</p>
            <p class="space-source">Source: ${data.source}</p>
        `;
        
        if (data.media && data.mediaType === 'image') {
            htmlContent = `
                <div class="space-media-container">
                    <img src="${data.media}" alt="${data.title}" class="space-media">
                </div>
                ${htmlContent}
            `;
        } else if (data.media && data.mediaType === 'video') {
            htmlContent += `<p><a href="${data.media}" target="_blank">View media content</a></p>`;
        }
        
        spaceContainer.innerHTML = htmlContent;
        
        spaceContainer.classList.add('fade-in');
        setTimeout(() => {
            spaceContainer.classList.remove('fade-in');
        }, 1000);
        
    } catch (error) {
        console.error('Error fetching space data:', error);
        spaceContainer.innerHTML = `
            <h3>Houston, we have a problem</h3>
            <p>Sorry, there was an error fetching space data: ${error.message}</p>
            <p>Please try again later.</p>
        `;
    }
}

function createStarryBackground() {
    const spaceContainer = document.getElementById('space-container');
    if (!spaceContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('twinkle');
        
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        
        const size = Math.random() * 3 + 1;
        
        const delay = Math.random() * 4;
        
        star.style.top = `${top}%`;
        star.style.left = `${left}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        
        spaceContainer.appendChild(star);
    }
}

function addInteractiveEffects() {
    const blurBox = document.querySelector('.blur-box');
    const backdropDemo = document.querySelector('.backdrop-demo');
    
    if (blurBox && backdropDemo) {
        backdropDemo.addEventListener('mousemove', function(e) {
            const rect = backdropDemo.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceFromCenter = Math.sqrt(
                Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
            
            const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
            const blurValue = 5 + (15 * (1 - distanceFromCenter / maxDistance));
            
            blurBox.style.backdropFilter = `blur(${blurValue}px)`;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            blurBox.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        backdropDemo.addEventListener('mouseleave', function() {
            blurBox.style.backdropFilter = 'blur(10px)';
            blurBox.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
    
    const interestCards = document.querySelectorAll('.interest-card');
    interestCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}