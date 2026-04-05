const GITHUB_USERNAME = 'aishatadewoyin';

const SELECTED_GITHUB_REPOS = [
    'portfolio', 
    'Albert-einstein-biography',
    'banking-system',
    'azkasplace',
    'chroniclesofapolymath',
];

// Optional deployed website URLs keyed by repository name (lowercase).
// Example: 'portfolio': 'https://your-live-site.com'
const DEPLOYED_SITE_URLS = {
};

// YouTube Configuration (manual URLs only)
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@CuriousBytesByAisha';
const YOUTUBE_VIDEOS = [
    {
        url: 'https://youtu.be/gdBl3vwuHrU?si=mruMlYAKey9YnFpP',
        title: 'How To Ship Your Product From China to Nigeria/Ghana',
        publishedAt: '2026-03-01',
    },
    {
        url: 'https://youtu.be/suKQIgPEN1M?si=bvJwrYxrIFlQPckX',
        title: 'How To Sign Up for Alipay Account as a Nigeria (Part 1)',
        publishedAt: '2026-02-20',
    },
    {
        url: 'https://youtu.be/9rbFdb269Go?si=LILR2dIEjXNdKF5M',
        title: 'How To Copy Your Alipay Account Number',
        publishedAt: '2026-02-10',
    },
];

// ============================================
// DOM ELEMENTS
// ============================================

const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const animatedElements = document.querySelectorAll('[data-animate]');

// ============================================
// MOBILE NAVIGATIONS
// ============================================

function initMobileNav() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// NAVIGATION BACKGROUND ON SCROLL
// ============================================

function initNavScroll() {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add small delay for stagger effect
                const delay = Array.from(animatedElements).indexOf(entry.target) * 50;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// LANGUAGES PROGRESS ANIMATION
// ============================================

function initLanguageProgress() {
    const languageCards = document.querySelectorAll('.language-card');
    if (languageCards.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    languageCards.forEach((card) => {
        const percentEl = card.querySelector('.language-percent');
        const barEl = card.querySelector('.language-bar');
        const fillEl = card.querySelector('.language-fill');

        if (!percentEl || !barEl || !fillEl) return;

        const target = Number.parseInt(barEl.getAttribute('aria-valuenow') || '0', 10);

        if (reduceMotion) {
            fillEl.style.width = `${target}%`;
            percentEl.textContent = `${target}%`;
            return;
        }

        // Start from 0 so the count and bar can animate in quickly.
        fillEl.style.width = '0%';
        percentEl.textContent = '0%';
    });

    if (reduceMotion) return;

    let hasAnimated = false;
    const section = document.getElementById('languages');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || hasAnimated) return;

            hasAnimated = true;

            languageCards.forEach((card, index) => {
                const percentEl = card.querySelector('.language-percent');
                const barEl = card.querySelector('.language-bar');
                const fillEl = card.querySelector('.language-fill');
                if (!percentEl || !barEl || !fillEl) return;

                const target = Number.parseInt(barEl.getAttribute('aria-valuenow') || '0', 10);
                const duration = 550;
                const startTime = performance.now() + index * 55;

                fillEl.style.width = `${target}%`;

                function updateCounter(now) {
                    if (now < startTime) {
                        window.requestAnimationFrame(updateCounter);
                        return;
                    }

                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const value = Math.round(progress * target);
                    percentEl.textContent = `${value}%`;

                    if (progress < 1) {
                        window.requestAnimationFrame(updateCounter);
                    }
                }

                window.requestAnimationFrame(updateCounter);
            });

            observer.unobserve(section);
        });
    }, { threshold: 0.25 });

    observer.observe(section);
}

// ============================================
// GITHUB API - FETCH PINNED REPOSITORIES
// ============================================

async function fetchGitHubRepos() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsError = document.getElementById('projects-error');
    
    // Don't try to fetch if username is not set
    if (GITHUB_USERNAME === 'USERNAME') {
        showGitHubFallback();
        return;
    }

    try {
        // Fetch user's repositories
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        if (repos.length === 0) {
            showGitHubFallback();
            return;
        }
        
        const selectedRepos = getSelectedRepos(repos);
        
        if (selectedRepos.length === 0) {
            showGitHubFallback();
            return;
        }
        
        renderProjects(selectedRepos);
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        showGitHubError();
    }
}

function getSelectedRepos(repos) {
    // If no explicit selection is provided, default to top-starred projects.
    if (!Array.isArray(SELECTED_GITHUB_REPOS) || SELECTED_GITHUB_REPOS.length === 0) {
        return repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 4);
    }

    const repoByName = new Map(
        repos.map((repo) => [repo.name.toLowerCase(), repo])
    );

    const curatedRepos = SELECTED_GITHUB_REPOS
        .map((repoName) => repoByName.get(repoName.toLowerCase()))
        .filter(Boolean)
        .slice(0, 4);

    const missingRepos = SELECTED_GITHUB_REPOS.filter(
        (repoName) => !repoByName.has(repoName.toLowerCase())
    );

    if (missingRepos.length > 0) {
        console.warn('Selected GitHub repos not found:', missingRepos.join(', '));
    }

    return curatedRepos;
}

function renderProjects(repos) {
    const projectsGrid = document.getElementById('projects-grid');
    
    // Language color mapping
    const languageColors = {
        'Python': '#3572A5',
        'JavaScript': '#F1E05A',
        'TypeScript': '#3178C6',
        'HTML': '#E34C26',
        'CSS': '#563D7C',
        'Java': '#B07219',
        'Go': '#00ADD8',
        'Rust': '#DEA584',
        'C++': '#F34B7D',
        'C': '#555555',
        'Ruby': '#701516',
        'PHP': '#4F5D95',
        'Swift': '#FFAC45',
        'Kotlin': '#A97BFF'
    };
    
    const projectsHTML = repos.map((repo, index) => {
        const isLarge = index === 0;
        const languageColor = languageColors[repo.language] || '#D4A056';
        const websiteUrl = DEPLOYED_SITE_URLS[repo.name.toLowerCase()] || repo.homepage || '#';
        const hasWebsite = websiteUrl !== '#';
        
        return `
            <article class="project-card ${isLarge ? 'project-card-large' : ''}" data-animate="${isLarge ? 'fade-right' : 'fade-left'}">
                <div class="project-header">
                    <h3 class="project-name">${escapeHtml(repo.name)}</h3>
                    <p class="project-description">${escapeHtml(repo.description || 'No description available.')}</p>
                    <div class="project-meta">
                        ${repo.language ? `
                            <span class="project-language">
                                <span class="language-dot" style="background-color: ${languageColor}"></span>
                                ${escapeHtml(repo.language)}
                            </span>
                        ` : ''}
                        <span class="project-stars">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            ${repo.stargazers_count}
                        </span>
                    </div>
                </div>
                <div class="project-links">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                        View on GitHub →
                    </a>
                    <a href="${websiteUrl}" ${hasWebsite ? 'target="_blank" rel="noopener noreferrer"' : ''} class="project-link${hasWebsite ? '' : ' project-link-disabled'}" ${hasWebsite ? '' : 'aria-disabled="true"'}>
                        Visit Website →
                    </a>
                </div>
            </article>
        `;
    }).join('');
    
    projectsGrid.innerHTML = projectsHTML;
    
    // Re-initialize animations for new elements
    const newAnimatedElements = projectsGrid.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    newAnimatedElements.forEach(el => observer.observe(el));
}

function showGitHubFallback() {
    const projectsGrid = document.getElementById('projects-grid');
    
    projectsGrid.innerHTML = `
        <article class="project-card project-card-large" data-animate="fade-right">
            <div class="project-header">
                <h3 class="project-name">Maison of Aisha</h3>
                <p class="project-description">A fashion e-commerce platform built with modern web technologies. Features include product catalog, shopping cart, payment integration, and admin dashboard.</p>
                <div class="project-meta">
                    <span class="project-language">
                        <span class="language-dot" style="background-color: #3572A5"></span>
                        Python
                    </span>
                    <span class="project-stars">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        12
                    </span>
                </div>
            </div>
            <div class="project-links">
                <a href="#" class="project-link">View on GitHub →</a>
                <a href="#" class="project-link">Visit Website →</a>
            </div>
        </article>
        <article class="project-card" data-animate="fade-left">
            <div class="project-header">
                <h3 class="project-name">Chronicles of a Polymath</h3>
                <p class="project-description">Personal blog platform with markdown support, responsive design, and optimized performance.</p>
                <div class="project-meta">
                    <span class="project-language">
                        <span class="language-dot" style="background-color: #3178C6"></span>
                        TypeScript
                    </span>
                    <span class="project-stars">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        8
                    </span>
                </div>
            </div>
            <div class="project-links">
                <a href="#" class="project-link">View on GitHub →</a>
                <a href="#" class="project-link">Visit Website →</a>
            </div>
        </article>
    `;
}

function showGitHubError() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsError = document.getElementById('projects-error');
    
    projectsGrid.style.display = 'none';
    projectsError.style.display = 'block';
}

// ============================================
// YOUTUBE - RENDER MANUAL VIDEOS
// ============================================

// function renderYouTubeVideos() {
//     const youtubeError = document.getElementById('youtube-error');

//     if (!Array.isArray(YOUTUBE_VIDEOS) || YOUTUBE_VIDEOS.length === 0) {
//         showYouTubeFallback();
//         return;
//     }

//     renderVideos(YOUTUBE_VIDEOS.slice(0, 3));

//     if (youtubeError) {
//         youtubeError.style.display = 'none';
//     }
// }

// function renderVideos(videos) {
//     const videosContainer = document.getElementById('youtube-videos');
    
//     const videosHTML = videos.map((video) => {
//         const title = video.title || 'Watch this video';
//         const videoId = extractYouTubeVideoId(video.url || '');
//         const thumbnail = video.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '');
//         const rawDate = video.publishedAt ? new Date(video.publishedAt) : null;
//         const formattedDate = rawDate && !Number.isNaN(rawDate.getTime())
//             ? rawDate.toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             })
//             : '';

//         if (!video.url || !videoId) return '';
        
//         return `
//             <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="video-card" data-animate="fade-left">
//                 <div class="video-thumbnail">
//                     ${thumbnail
//                         ? `<img src="${thumbnail}" alt="${escapeHtml(title)}" loading="lazy">`
//                         : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3D1526,#2B0F1C);"></div>`}
//                 </div>
//                 <div class="video-info">
//                     <h3 class="video-title">${escapeHtml(title)}</h3>
//                     <span class="video-date">${formattedDate}</span>
//                 </div>
//             </a>
//         `;
//     }).filter(Boolean).join('');

//     if (!videosHTML) {
//         showYouTubeFallback();
//         return;
//     }
    
//     videosContainer.innerHTML = videosHTML;
    
//     // Re-initializes animations for new elements
//     const newAnimatedElements = videosContainer.querySelectorAll('[data-animate]');
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('animated');
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.1 });
    
//     newAnimatedElements.forEach(el => observer.observe(el));
// }

// function showYouTubeFallback() {
//     const videosContainer = document.getElementById('youtube-videos');
    
//     videosContainer.innerHTML = `
//         <a href="${YOUTUBE_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="video-card" data-animate="fade-left">
//             <div class="video-thumbnail">
//                 <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3D1526,#2B0F1C);">
//                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A056" stroke-width="1.5">
//                         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
//                         <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#D4A056"></polygon>
//                     </svg>
//                 </div>
//             </div>
//             <div class="video-info">
//                 <h3 class="video-title">Getting Started with E-commerce Importation</h3>
//                 <span class="video-date">March 10, 2024</span>
//             </div>
//         </a>
//         <a href="${YOUTUBE_CHANNEL_URL}" target="_blank" rel="noopener noreferrer" class="video-card" data-animate="fade-left">
//             <div class="video-thumbnail">
//                 <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3D1526,#2B0F1C);">
//                     <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A056" stroke-width="1.5">
//                         <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
//                         <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#D4A056"></polygon>
//                     </svg>
//                 </div>
//             </div>
//             <div class="video-info">
//                 <h3 class="video-title">Building a Fashion Brand Online</h3>
//                 <span class="video-date">February 25, 2024</span>
//             </div>
//         </a>
//     `;
    
//     // Re-initialize animations
//     const newAnimatedElements = videosContainer.querySelectorAll('[data-animate]');
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add('animated');
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.1 });
    
//     newAnimatedElements.forEach(el => observer.observe(el));
// }

//     function extractYouTubeVideoId(url) {
//         if (typeof url !== 'string' || !url) return null;

//         const patterns = [
//             /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
//             /(?:youtu\.be\/)([\w-]{11})/,
//             /(?:youtube\.com\/shorts\/)([\w-]{11})/,
//             /(?:youtube\.com\/embed\/)([\w-]{11})/
//         ];

//         for (const pattern of patterns) {
//             const match = url.match(pattern);
//             if (match && match[1]) {
//                 return match[1];
//             }
//         }

//         return null;
//     }

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initializes navigation
    initMobileNav();
    initNavScroll();
    initSmoothScroll();
    
    // Initializse scroll animations
    initScrollAnimations();
    initLanguageProgress();
    
    // Fetch API data
    fetchGitHubRepos();
    renderYouTubeVideos();
    
    // Log helpful message for setup
    console.log('%c👋 Hello! Aisha here.', 'color: #D4A056; font-size: 16px; font-weight: bold;');
    console.log('%cTo update GitHub and YouTube content, edit the configuration in main.js', 'color: #C9B8A6;');
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any ongoing animations or heavy operations
    } else {
        // Resume when visible
    }
});