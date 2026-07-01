function scrollDown() {
    window.scrollBy({
        top: window.innerHeight * 1.25,
        behavior: 'smooth',
    });
}

lucide.createIcons();

// Choose the navbar logo based on screen size: a wider logo for big screens
// and a compact one for mobile. Update the two paths below to your files.
const DESKTOP_LOGO = 'assets/desktop.png';
const MOBILE_LOGO = 'assets/mobile.png';
const MOBILE_LOGO_MAX_WIDTH = 767;

function updateLogo() {
    const logo = document.getElementById('siteLogo');
    if (!logo) return;
    const src = window.innerWidth <= MOBILE_LOGO_MAX_WIDTH ? MOBILE_LOGO : DESKTOP_LOGO;
    if (!logo.src.endsWith(src)) logo.src = src;
}

updateLogo();
window.addEventListener('resize', updateLogo);

// Scroll reveal effect
function revealSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Function to set the theme
function setTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    updateIcon(isDark);
    localStorage.setItem('darkMode', isDark);
}

// Function to update the icon
function updateIcon(isDark) {
    themeToggle.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
}

// Function to get system preference
function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Function to set initial theme
function setInitialTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
        setTheme(JSON.parse(savedTheme));
    } else {
        setTheme(getSystemPreference());
    }
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    const isDark = !html.classList.contains('dark');
    setTheme(isDark);
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
        setTheme(e.matches);
    }
});

// Set initial theme
setInitialTheme();

function rickRoll() {
    window.open("", "_blank");
}

document.addEventListener('DOMContentLoaded', function () {
    const rdkElements = document.querySelectorAll('.rdk-hover');
    rdkElements.forEach(element => {
        element.addEventListener('click', function () {
            if (this.textContent === 'RDK-B') {
                window.open('https://wiki.rdkcentral.com/display/RDK/RDK-Broadband', '_blank');
            } else if (this.textContent === 'RDK') {
                window.open('https://en.wikipedia.org/wiki/Reference_Design_Kit', '_blank');
            }
        });
    });
});

// Team data — placeholder portraits (randomuser.me) until real photos are added
const teamMembers = [
    {
        name: 'Ashutosh Sharma',
        role: 'Founder & Director',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        linkedin: '#',
        instagram: '#',
        email: 'admin@thefilmkaarproduction.com',
    },
    {
        name: 'Priya Mehta',
        role: 'Creative Lead',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        linkedin: '#',
        instagram: '#',
        email: 'admin@thefilmkaarproduction.com',
    },
    {
        name: 'Rohan Verma',
        role: 'Cinematographer',
        image: 'https://randomuser.me/api/portraits/men/54.jpg',
        linkedin: '#',
        instagram: '#',
        email: 'admin@thefilmkaarproduction.com',
    },
    {
        name: 'Neha Tiwari',
        role: 'Producer',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        linkedin: '#',
        instagram: '#',
        email: 'admin@thefilmkaarproduction.com',
    },
];

// Render team member cards into the Team slider
function renderTeam(members) {
    const track = document.querySelector('#team .team-track');
    if (!track) return;

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.innerHTML = `
            <div class="team-avatar">
                <img src="${member.image}" alt="${member.name}" loading="lazy">
            </div>
            <h3 class="team-name">${member.name}</h3>
            <p class="team-role">${member.role}</p>
            <div class="team-socials">
                <a href="${member.linkedin}" target="_blank" aria-label="${member.name} on LinkedIn">
                    <i data-lucide="linkedin"></i>
                </a>
                <a href="${member.instagram}" target="_blank" aria-label="${member.name} on Instagram">
                    <i data-lucide="instagram"></i>
                </a>
                <a href="mailto:${member.email}" aria-label="Email ${member.name}">
                    <i data-lucide="mail"></i>
                </a>
            </div>
        `;
        track.appendChild(card);
    });

    lucide.createIcons();  // Re-render icons after cards are added
    setupTeamSlider();
}

// Wire up the prev/next arrows for the team slider. The track itself is a
// native horizontal scroll container, so touch/swipe works out of the box;
// the arrows just scroll it by roughly one card at a time.
function setupTeamSlider() {
    const track = document.querySelector('#team .team-track');
    const prev = document.querySelector('#team .team-nav-prev');
    const next = document.querySelector('#team .team-nav-next');
    if (!track || !prev || !next) return;

    function scrollAmount() {
        const card = track.querySelector('.team-card');
        // One card plus the flex gap, falling back to ~80% of the viewport
        return card ? card.getBoundingClientRect().width + 32 : track.clientWidth * 0.8;
    }

    prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

    // Hide the arrows when everything already fits (no overflow to scroll)
    function updateArrows() {
        const overflowing = track.scrollWidth > track.clientWidth + 1;
        prev.classList.toggle('team-nav-hidden', !overflowing);
        next.classList.toggle('team-nav-hidden', !overflowing);
    }
    updateArrows();
    window.addEventListener('resize', updateArrows);

    // Auto-advance one card at a time, looping back to the start at the end.
    const AUTOPLAY_INTERVAL = 3000;   // pause between slides
    let autoplayTimer = null;

    function advance() {
        // If we're at (or very near) the end, jump back to the beginning
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        if (atEnd) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        }
    }

    function startAutoplay() {
        if (autoplayTimer) return;
        // Only autoplay when there's something to scroll
        if (track.scrollWidth <= track.clientWidth + 1) return;
        autoplayTimer = setInterval(advance, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Pause while the user is interacting, resume when they leave
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    track.addEventListener('touchend', startAutoplay);
    [prev, next].forEach(btn => {
        btn.addEventListener('mouseenter', stopAutoplay);
        btn.addEventListener('mouseleave', startAutoplay);
    });

    // Respect users who prefer reduced motion — leave it manual for them
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) startAutoplay();
}

renderTeam(teamMembers);

// Project data


// Number of projects shown before the "Show More" button is required
const PROJECTS_INITIAL_COUNT = 6;

// Function to render project tiles into the Projects section
function renderProjectTiles(projects) {
    const projectsContainer = document.querySelector('#projects .grid');
    if (!projectsContainer) return;

    projects.forEach((project, index) => {
        const tile = document.createElement('div');
        tile.className = 'project-tile';
        // Hide any project beyond the initial count until "Show More" is clicked
        if (index >= PROJECTS_INITIAL_COUNT) {
            tile.classList.add('project-tile-hidden');
        }
        tile.innerHTML = `
            <div class="project-thumbnail mb-4">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
                <div class="redirect-icon">
                    <i data-lucide="external-link"></i>
                </div>
            </div>
            <h3 class="text-xl font-bold mb-2">${project.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${project.description}</p>
            <a href="${project.url}" target="_blank" class="read-more">
                <i data-lucide="youtube"></i>
                Watch now
            </a>
        `;
        const thumbnail = tile.querySelector('.project-thumbnail');
        thumbnail.addEventListener('click', () => window.open(project.url, '_blank'));
        projectsContainer.appendChild(tile);
    });

    setupProjectsToggle(projects.length);

    lucide.createIcons();  // Re-render icons after elements are added
}

// Wire up the "Show More / Show Less" button when there are extra projects
function setupProjectsToggle(totalCount) {
    const toggleContainer = document.querySelector('.projects-toggle-container');
    const toggleBtn = document.querySelector('#projects-toggle');
    if (!toggleContainer || !toggleBtn) return;

    if (totalCount <= PROJECTS_INITIAL_COUNT) {
        toggleContainer.classList.add('hidden');
        return;
    }

    let expanded = false;
    toggleContainer.classList.remove('hidden');
    toggleBtn.textContent = 'Show More';

    toggleBtn.addEventListener('click', () => {
        expanded = !expanded;
        document.querySelectorAll('#projects .project-tile-hidden').forEach(tile => {
            tile.classList.toggle('project-tile-revealed', expanded);
        });
        toggleBtn.textContent = expanded ? 'Show Less' : 'Show More';
        if (!expanded) {
            document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Build the hero background poster slider from project images
const POSTER_API_BASE = 'https://filmkaar.fastapicloud.dev/poster/';
// const POSTER_API_BASE = 'http://localhost:8000/poster/';

function buildHeroSlider(projects) {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    // Each project with its own poster gets a slide with a matching title.
    const seen = new Set();
    const heroProjects = [];
    projects.forEach(project => {
        const title = (project.title || '').trim();
        if (project.poster && !seen.has(title)) {
            seen.add(title);
            heroProjects.push({ src: POSTER_API_BASE + encodeURIComponent(project.poster), title });
        }
    });
    const heroSlides = heroProjects.slice(0, 6);
    if (heroSlides.length === 0) return;  // keep the static fallback slide

    // Preload, then swap in the real slides for a clean first crossfade.
    // Capture each poster's aspect ratio so the hero can be sized to fit
    // the whole image on mobile (no crop, no letterbox bars).
    let loaded = 0;
    heroSlides.forEach(slide => {
        const img = new Image();
        img.onload = () => {
            if (img.naturalWidth && img.naturalHeight) {
                slide.aspect = img.naturalWidth / img.naturalHeight;
            }
            done();
        };
        img.onerror = done;
        img.src = slide.src;
        function done() {
            loaded += 1;
            if (loaded === heroSlides.length) startHeroSlider(slider, heroSlides);
        }
    });
}

function setHeroTitle(title) {
    const el = document.querySelector('.hero-content h2 span');
    if (el) el.textContent = title;
}

// On mobile, size the poster area (the slider) to show the whole poster
// uncropped; the text and the sections below then flow right under it. Uses
// the tallest poster (smallest width/height ratio) so no slide ever gets
// cropped and the height stays stable as slides rotate. Cleared on desktop,
// where the full-bleed cover layout applies (CSS handles it).
function sizeHeroToPoster(heroSlides) {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;
    if (window.innerWidth > 767) {
        slider.style.height = '';
        slider.style.minHeight = '';
        return;
    }
    const aspects = heroSlides.map(s => s.aspect).filter(Boolean);
    if (aspects.length === 0) return;
    const minAspect = Math.min(...aspects);
    slider.style.height = (window.innerWidth / minAspect) + 'px';
    slider.style.minHeight = '0';
}

function startHeroSlider(slider, heroSlides) {
    slider.innerHTML = '';  // remove the static fallback slide
    heroSlides.forEach(({ src }, i) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
        // Shared by the blurred backdrop and the sharp poster layers (see CSS)
        slide.style.setProperty('--bg', `url('${src}')`);
        slide.style.zIndex = i === 0 ? '2' : '1';
        slide.innerHTML = '<div class="hero-slide-blur"></div><div class="hero-slide-img"></div>';
        slider.appendChild(slide);
    });

    // Set the first slide's title immediately
    setHeroTitle(heroSlides[0].title);

    // Fit the hero to the poster on mobile, and keep it fitted on rotate/resize
    sizeHeroToPoster(heroSlides);
    window.addEventListener('resize', () => sizeHeroToPoster(heroSlides));

    if (heroSlides.length < 2) return;  // nothing to rotate

    const slides = slider.querySelectorAll('.hero-slide');
    const FADE = 2000;        // must match the .hero-slide opacity transition
    const INTERVAL = 7000;    // time each poster holds before the next fades in
    let current = 0;

    setInterval(() => {
        const next = (current + 1) % slides.length;
        const prev = slides[current];
        const nextSlide = slides[next];

        // Bring the incoming slide on top and restart its Ken Burns from the start
        nextSlide.classList.remove('active');
        void nextSlide.offsetWidth;  // force reflow so the animation replays
        nextSlide.style.zIndex = '2';
        prev.style.zIndex = '1';
        nextSlide.classList.add('active');

        // Update hero title to match the incoming slide
        setHeroTitle(heroSlides[next].title);

        // Keep the outgoing slide zooming until the crossfade fully completes,
        // so it never snaps back to its original size while still visible.
        setTimeout(() => prev.classList.remove('active'), FADE);

        current = next;
    }, INTERVAL);
}

// Fetch projects once and populate both the hero slider and the projects grid
function loadProjects() {
    $.ajax({
        url: "https://filmkaar.fastapicloud.dev/projects",
        type: "post",
        success: function(response) {
            console.log(response);
            const projects = response['projects'] || [];
            buildHeroSlider(projects);
            renderProjectTiles(projects);
        },
        error: function(response) {
            // Hero keeps its static fallback poster; only the grid is essential
            alert("Unable to load projects, please try again later");
            console.log(response);
        }
    });
}

loadProjects();
