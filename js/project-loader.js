/**
 * Project Loader for IronAdamant Portfolio
 * 
 * This file contains the functionality to load and display projects from project-data.js
 * on both the index.html (featured projects) and projects.html (all projects) pages.
 */

// Renders the about section on the index page
function renderAboutSection() {
    const aboutTitle = document.querySelector('.section-title');
    const aboutText = document.querySelector('.section-text');
    
    if (aboutTitle && aboutData) {
        aboutTitle.innerHTML = aboutData.title.replace('About ', 'About <span class="highlight">') + '</span>';
    }
    
    if (aboutText && aboutData) {
        aboutText.textContent = aboutData.description;
    }
}

// Renders featured projects on the index page
function renderFeaturedProjects() {
    const container = document.querySelector('.featured-projects .project-grid');
    if (!container) return;
    
    const featuredProjects = projectHelpers.getFeaturedProjects();
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Add featured projects
    featuredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.imageSrc}" alt="${project.imageAlt}" loading="eager">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="project-tags">
                    ${project.techTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.links.map(link => `
                        <a href="${link.url}" ${link.external ? 'target="_blank" rel="noopener"' : ''}>
                            <i class="${link.icon}"></i> ${link.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(projectCard);
    });
}

// Renders all projects on the projects page
function renderProjectsList() {
    const container = document.querySelector('.project-list');
    if (!container) return;
    
    const allProjects = projectHelpers.getAllProjects();
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Add all projects
    allProjects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.setAttribute('data-category', project.category);
        
        projectItem.innerHTML = `
            <div class="project-image">
                <img src="${project.imageSrc}" alt="${project.imageAlt}" loading="eager">
            </div>
            <div class="project-content">
                <h2>${project.title}</h2>
                <p>${project.fullDescription}</p>
                <div class="project-meta">
                    <div class="project-category">
                        <span class="meta-label">Category:</span>
                        <span class="meta-value">${projectHelpers.getCategoryName(project.category)}</span>
                    </div>
                    <div class="project-technologies">
                        <span class="meta-label">Technologies:</span>
                        <div class="tech-tags">
                            ${project.techTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="project-links">
                    ${project.links.map(link => `
                        <a href="${link.url}" class="btn btn-link" ${link.external ? 'target="_blank" rel="noopener"' : ''}>
                            <i class="${link.icon}"></i> ${link.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.appendChild(projectItem);
    });
}

// Initialize project filtering functionality
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length === 0) return;
    
    // Update filter buttons to match available categories
    const categoryContainer = document.querySelector('.category-filter');
    if (categoryContainer) {
        // Get all unique categories
        const categories = projectHelpers.getAllCategories();
        
        // Clear existing buttons
        categoryContainer.innerHTML = '';
        
        // Add buttons for each category
        categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = 'filter-btn' + (category === 'all' ? ' active' : '');
            button.setAttribute('data-category', category);
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', category === 'all' ? 'true' : 'false');
            button.setAttribute('aria-controls', 'project-list');
            button.setAttribute('id', `tab-${category}`);
            button.textContent = projectHelpers.getCategoryName(category);
            
            categoryContainer.appendChild(button);
        });
    }
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update ARIA attributes
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            const filterValue = this.getAttribute('data-category');
            const projectItems = document.querySelectorAll('.project-item');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize projects when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the index or projects page
    const isIndexPage = document.querySelector('.featured-projects .project-grid');
    const isProjectsPage = document.querySelector('.project-list');
    
    if (isIndexPage) {
        renderAboutSection();
        renderFeaturedProjects();
    }
    
    if (isProjectsPage) {
        renderProjectsList();
        initializeProjectFilters();
    }
});
