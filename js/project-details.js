/**
 * Project Details Page JavaScript
 * Handles dynamic content loading and URL parameters
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get project ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || '1';
    
    // Load project data
    loadProjectDetails(projectId);
    
    // Initialize current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize navigation
    initializeProjectNavigation();
});

/**
 * Load project details based on ID
 */
async function loadProjectDetails(projectId) {
    try {
        let projectData;
        
        // Try to load from JSON file
        if (window.location.protocol !== 'file:') {
            const response = await fetch('data/projects.json');
            if (response.ok) {
                const data = await response.json();
                projectData = data.projects.find(p => p.id == projectId);
            }
        }
        
        // If not found or file:// protocol, use fallback
        if (!projectData) {
            projectData = getFallbackProject(projectId);
        }
        
        // Update page content
        updateProjectPage(projectData);
        
    } catch (error) {
        console.error('Error loading project details:', error);
        // Use fallback project 1
        updateProjectPage(getFallbackProject('1'));
    }
}

/**
 * Update page with project data
 */
function updateProjectPage(project) {
    if (!project) return;
    
    // Update basic info
    document.getElementById('project-title').textContent = project.title || 'Project Details';
    document.getElementById('project-description').textContent = project.description || '';
    document.getElementById('project-category').textContent = project.category || 'General';
    document.getElementById('project-year').textContent = project.year || 'N/A';
    
    // Update links
    const liveLink = document.getElementById('project-live-link');
    const githubLink = document.getElementById('project-github-link');
    
    if (liveLink && project.link && project.link !== '#') {
        liveLink.href = project.link;
    } else {
        liveLink.style.display = 'none';
    }
    
    if (githubLink && project.github && project.github !== '#') {
        githubLink.href = project.github;
    } else {
        githubLink.style.display = 'none';
    }
    
    // Update document title
    document.title = `${project.title} — Pedro Pestana`;
}

/**
 * Get fallback project data
 */
function getFallbackProject(projectId) {
    const fallbackProjects = {
        '1': {
            id: 1,
            title: "Urban Growth Analysis Platform",
            description: "A cloud-based platform for analyzing urban expansion patterns using satellite imagery and machine learning.",
            category: "spatial-analysis",
            year: "2023",
            link: "#",
            github: "#"
        },
        '2': {
            id: 2,
            title: "Geospatial ETL Pipeline Framework",
            description: "A modular framework for building scalable spatial data pipelines with automatic quality assurance.",
            category: "data-pipeline",
            year: "2023",
            link: "#",
            github: "#"
        },
        '3': {
            id: 3,
            title: "Agricultural Monitoring System",
            description: "Real-time crop health monitoring using satellite data and custom vegetation indices.",
            category: "web-mapping",
            year: "2022",
            link: "#",
            github: "#"
        },
        '4': {
            id: 4,
            title: "QGIS Automation Toolkit",
            description: "A collection of Python scripts and plugins for automating repetitive QGIS workflows.",
            category: "automation",
            year: "2022",
            link: "#",
            github: "#"
        },
        '5': {
            id: 5,
            title: "Disaster Response Mapping System",
            description: "Real-time mapping platform for emergency response teams during natural disasters.",
            category: "web-mapping",
            year: "2021",
            link: "#",
            github: "#"
        },
        '6': {
            id: 6,
            title: "Spatial Data Quality Dashboard",
            description: "Interactive dashboard for monitoring and improving spatial data quality across an organization.",
            category: "saas",
            year: "2021",
            link: "#",
            github: "#"
        }
    };
    
    return fallbackProjects[projectId] || fallbackProjects['1'];
}

/**
 * Initialize navigation for project details page
 */
function initializeProjectNavigation() {
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