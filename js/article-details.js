/**
 * Article Details Page JavaScript
 * Handles dynamic content loading and URL parameters
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get article ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('article') || '1';
    
    // Load article data
    loadArticleDetails(articleId);
    
    // Initialize current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize navigation
    initializeArticleNavigation();
    
    // Initialize save buttons
    initializeSaveButtons();
    
    // Initialize table of contents highlighting
    initializeTocHighlighting();
});

/**
 * Load article details based on ID
 */
async function loadArticleDetails(articleId) {
    try {
        let articleData;
        
        // Try to load from JSON file
        if (window.location.protocol !== 'file:') {
            const response = await fetch('data/articles.json');
            if (response.ok) {
                const data = await response.json();
                articleData = data.articles.find(a => a.id == articleId);
            }
        }
        
        // If not found or file:// protocol, use fallback
        if (!articleData) {
            articleData = getFallbackArticle(articleId);
        }
        
        // Update page content
        updateArticlePage(articleData);
        
    } catch (error) {
        console.error('Error loading article details:', error);
        // Use fallback article 1
        updateArticlePage(getFallbackArticle('1'));
    }
}

/**
 * Update page with article data
 */
function updateArticlePage(article) {
    if (!article) return;
    
    // Update basic info
    document.getElementById('article-title').textContent = article.title || 'Article Details';
    document.getElementById('article-subtitle').textContent = article.subtitle || '';
    document.getElementById('article-category').textContent = article.category || 'General';
    document.getElementById('article-date').textContent = article.date || 'N/A';
    document.getElementById('article-readtime').textContent = article.readtime || '5 min read';
    
    // Update tags
    const tagsContainer = document.getElementById('article-tags');
    if (tagsContainer && article.tags) {
        tagsContainer.innerHTML = article.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    }
    
    // Update document title
    document.title = `${article.title} — Pedro Pestana`;
}

/**
 * Get fallback article data
 */
function getFallbackArticle(articleId) {
    const fallbackArticles = {
        '1': {
            id: 1,
            title: "Designing Scalable Geospatial Data Pipelines",
            subtitle: "An architectural overview of building robust ETL pipelines for spatial data",
            category: "Spatial Data Engineering",
            date: "March 2024",
            readtime: "12 min read",
            tags: ["PostGIS", "Python", "Data Pipelines", "Cloud Architecture", "Spatial Analysis", "ETL"]
        },
        '2': {
            id: 2,
            title: "Automating QGIS Workflows with Python",
            subtitle: "A practical guide to scripting repetitive GIS tasks in QGIS using PyQGIS",
            category: "GIS Automation",
            date: "January 2024",
            readtime: "8 min read",
            tags: ["QGIS", "Python", "Automation", "PyQGIS"]
        },
        '3': {
            id: 3,
            title: "Urban Growth Analysis with Google Earth Engine",
            subtitle: "Leveraging Landsat and Sentinel imagery to analyze urban expansion patterns over time",
            category: "Remote Sensing",
            date: "November 2023",
            readtime: "10 min read",
            tags: ["Google Earth Engine", "JavaScript", "Remote Sensing", "Urban Analysis"]
        },
        '4': {
            id: 4,
            title: "Advanced Spatial Queries in PostGIS",
            subtitle: "Exploring advanced PostGIS functionality for complex spatial analysis",
            category: "Spatial Databases",
            date: "September 2023",
            readtime: "15 min read",
            tags: ["PostGIS", "PostgreSQL", "Spatial SQL", "Performance"]
        },
        '5': {
            id: 5,
            title: "Building Interactive Geospatial Dashboards",
            subtitle: "Architectural patterns for creating performant web mapping applications",
            category: "Web Mapping",
            date: "July 2023",
            readtime: "9 min read",
            tags: ["JavaScript", "Leaflet", "Web GIS", "Data Visualization"]
        }
    };
    
    return fallbackArticles[articleId] || fallbackArticles['1'];
}

/**
 * Initialize navigation for article details page
 */
function initializeArticleNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', 
                navMenu.classList.contains('active').toString());
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * Initialize save buttons functionality
 */
function initializeSaveButtons() {
    const savePdfBtn = document.getElementById('save-pdf');
    const saveReadingListBtn = document.getElementById('save-reading-list');
    
    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', function() {
            alert('In a production environment, this would generate and download a PDF version of the article.');
            // In production: window.print() or generate PDF via API
        });
    }
    
    if (saveReadingListBtn) {
        saveReadingListBtn.addEventListener('click', function() {
            alert('Article added to your reading list!');
            // In production: save to localStorage or send to backend
        });
    }
}

/**
 * Initialize table of contents highlighting
 */
function initializeTocHighlighting() {
    const sections = document.querySelectorAll('.article-section');
    const tocLinks = document.querySelectorAll('.article-toc a');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    // Highlight current section in TOC
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.style.color = 'var(--color-primary)';
                        link.style.fontWeight = '600';
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Smooth scrolling for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}