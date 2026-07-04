function scrollDown() {
    window.scrollBy({
        top: window.innerHeight * 1.25,
        behavior: 'smooth',
    });
}

function revealPage() {
    document.body.style.visibility = "visible";

    requestAnimationFrame(() => {
        document.body.style.opacity = "1";
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

document.documentElement.classList.add('dark');

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



function preloadRemainingSlides(heroSlides, index) {

    if (index >= heroSlides.length)
        return;

    const img = new Image();

    img.decoding = "async";

    img.onload = () => {

        heroSlides[index].loaded = true;
        heroSlides[index].aspect =
            img.naturalWidth / img.naturalHeight;

        appendHeroSlide(heroSlides[index]);

        preloadRemainingSlides(heroSlides, index + 1);
    };

    img.onerror = () => {
        console.warn("Skipping poster:", heroSlides[index].src);

        preloadRemainingSlides(heroSlides, index + 1);
    };

    img.src = heroSlides[index].src;
}

function appendHeroSlide(slideData) {

    const slider = document.getElementById("hero-slider");

    const slide = document.createElement("div");

    slide.className = "hero-slide";

    slide.dataset.title = slideData.title;
    slide.dataset.url = slideData.url || '';

    slide.style.setProperty(
        "--bg",
        `url('${slideData.src}')`
    );

    slide.innerHTML =
        '<div class="hero-slide-blur"></div><div class="hero-slide-img"></div>';

    slider.appendChild(slide);
}


function buildHeroSlider(projects) {
    const slider = document.getElementById('hero-slider');
    if (!slider) return;

    const seen = new Set();
    const heroProjects = [];

    projects.forEach(project => {
        const title = (project.title || '').trim();

        if (project.poster && !seen.has(title)) {
            seen.add(title);

            heroProjects.push({
                src: POSTER_API_BASE + encodeURIComponent(project.poster),
                title,
                url: project.url,
                loaded: false,
                aspect: null
            });
        }
    });

    const heroSlides = heroProjects.slice(0, 6);

    if (!heroSlides.length) return;

    // Only load the first image initially
    const first = new Image();

    first.onload = () => {
        first.decoding = "async";

        heroSlides[0].loaded = true;
        heroSlides[0].aspect =
            first.naturalWidth / first.naturalHeight;

        startHeroSlider(slider, heroSlides);

        // Reveal the website only after the first hero is ready
        revealPage();

        // Load remaining posters in the background
        preloadRemainingSlides(heroSlides, 1);
    };

    first.onerror = () => {
        console.error("Failed loading first hero poster.");
    };

    first.src = heroSlides[0].src;
}

function setHeroTitle(title) {
    const el = document.querySelector('.hero-content h2 span');
    if (el) el.textContent = title;
}

function setPlayButtonUrl(url) {
    const btn = document.getElementById('hero-play-btn');
    if (btn && url) btn.href = url;
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


// Fetch projects once and populate both the hero slider and the projects grid

function startHeroSlider(slider, heroSlides) {

    slider.innerHTML = "";

    appendHeroSlide(heroSlides[0]);

    const firstSlide = slider.firstElementChild;

    firstSlide.classList.add("active");
    firstSlide.style.zIndex = "2";

    setHeroTitle(heroSlides[0].title);
    setPlayButtonUrl(heroSlides[0].url);

    sizeHeroToPoster(heroSlides);

    if (!slider.dataset.resizeAttached) {

        window.addEventListener("resize", () =>
            sizeHeroToPoster(heroSlides)
        );

        slider.dataset.resizeAttached = "true";
    }

    const FADE = 2000;
    const INTERVAL = 7000;

    let current = 0;

    setInterval(() => {

        const slides =
            slider.querySelectorAll(".hero-slide");

        // Only rotate through posters that are loaded
        if (slides.length < 2)
            return;

        const next = (current + 1) % slides.length;

        const prev = slides[current];
        const nextSlide = slides[next];

        nextSlide.classList.remove("active");

        void nextSlide.offsetWidth;

        nextSlide.style.zIndex = "2";
        prev.style.zIndex = "1";

        nextSlide.classList.add("active");

        setHeroTitle(
            nextSlide.dataset.title
        );
        setPlayButtonUrl(nextSlide.dataset.url);

        setTimeout(() => {
            prev.classList.remove("active");
        }, FADE);

        current = next;

    }, INTERVAL);
}

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

// Testimonials data
const testimonials = [
    {
        name: 'Angad Singh Pal',
        position: 'Writer',
        text: '"It has been a wonderful experience working with Filmkaar Production. I have had the opportunity to work on three projects with the team, and each experience has been smooth, professional, and well-coordinated. The entire team is supportive, respectful, and creates a comfortable working environment. The direction and coordination are always clear, making the work enjoyable and efficient. I truly appreciate the professionalism and dedication everyone brings to each project. I would be happy to work with Filmkaar Production again in the future and wish the entire team continued success. Thank you for giving me the opportunity to be a part of your projects."',
    },
    {
        name: 'Rajwardhan Singh Chouhan',
        position: 'Actor',
        text: '"Hi Team Filmkaar Production 😊 Thank you so much for reaching out. It truly means a lot to be considered a part of the Filmkaar family ❤️\n\nMy experience working with Filmkaar Production has been genuinely wonderful. The work environment was positive, comfortable, and highly professional. The entire team was supportive, well coordinated and passionate about their work which made the whole process smooth and enjoyable.\n\nThe direction and coordination were clear and organized and I really appreciated the professionalism and respect shown towards artists. It never felt like just work — it felt like a collaborative creative journey.\n\nI would absolutely love to work with Filmkaar Production again in the future and would happily recommend it to other artists as well.\n\nThank you once again for the opportunity and for making the experience so memorable. Looking forward to many more projects together."',
    },
    {
        name: 'Koyal Thiroda',
        position: 'Actress',
        text: '"It was a wonderful experience working with Filmkaar Production. The team was very friendly and professional. Really enjoyed the shoot. Thank you for the amazing experience. Looking forward to working together again 🤝"',
    },
    // {
    //     name: 'Karan Joshi',
    //     position: 'Screenwriter, Pune',
    //     text: '"The direction in Dejal is something else. The restraint, the silences — it\'s filmmaking that trusts its audience. More people need to see this."',
    // },
    // {
    //     name: 'Priya Nair',
    //     position: 'Theatre Actor, Bangalore',
    //     text: '"Kaaya gave me goosebumps. The atmosphere they built with such minimal resources is a testament to how strong the vision behind Filmkaar really is."',
    // },
    // {
    //     name: 'Dev Anand Tiwari',
    //     position: 'YouTube Viewer, Lucknow',
    //     text: '"I stumbled onto Filmkaar by accident and ended up watching everything in one sitting. The AI Purush series had me in tears from laughing — subscribe immediately."',
    // },
];

function renderTestimonials() {
    const track = document.querySelector('#testimonials .testimonial-track');
    if (!track) return;

    testimonials.forEach(t => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-quote">"</div>
            <div class="testimonial-text-wrapper">
                <p class="testimonial-text">${t.text}</p>
            </div>
            <button class="testimonial-show-more">Show more</button>
            <div class="testimonial-author">
                <p class="testimonial-author-name">${t.name}</p>
                <p class="testimonial-author-position">${t.position}</p>
            </div>
        `;

        const wrapper = card.querySelector('.testimonial-text-wrapper');
        const btn = card.querySelector('.testimonial-show-more');

        btn.addEventListener('click', () => {
            const expanded = wrapper.classList.toggle('expanded');
            btn.textContent = expanded ? 'Show less' : 'Show more';
        });

        track.appendChild(card);
    });

    // Single deferred pass after the slider layout settles
    setTimeout(() => {
        track.querySelectorAll('.testimonial-card').forEach(card => {
            const wrapper = card.querySelector('.testimonial-text-wrapper');
            const btn = card.querySelector('.testimonial-show-more');
            if (wrapper.scrollHeight <= wrapper.clientHeight) {
                btn.classList.add('testimonial-show-more-hidden');
                wrapper.classList.add('no-overflow');
            }
        });
    }, 100);

    setupTestimonialSlider();
}

function setupTestimonialSlider() {
    const track = document.querySelector('#testimonials .testimonial-track');
    const prev = document.querySelector('#testimonials .testimonial-nav-prev');
    const next = document.querySelector('#testimonials .testimonial-nav-next');
    if (!track || !prev || !next) return;

    function scrollAmount() {
        const card = track.querySelector('.testimonial-card');
        return card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    }

    prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

    function updateArrows() {
        const overflowing = track.scrollWidth > track.clientWidth + 1;
        prev.classList.toggle('testimonial-nav-hidden', !overflowing);
        next.classList.toggle('testimonial-nav-hidden', !overflowing);
    }
    updateArrows();
    window.addEventListener('resize', updateArrows);

    const AUTOPLAY_INTERVAL = 4000;
    let autoplayTimer = null;

    function advance() {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        if (atEnd) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        }
    }

    function startAutoplay() {
        if (autoplayTimer) return;
        if (track.scrollWidth <= track.clientWidth + 1) return;
        autoplayTimer = setInterval(advance, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    track.addEventListener('touchend', startAutoplay);
    [prev, next].forEach(btn => {
        btn.addEventListener('mouseenter', stopAutoplay);
        btn.addEventListener('mouseleave', startAutoplay);
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) startAutoplay();
}

renderTestimonials();
lucide.createIcons();