/**
 * Project Data for Necron Portfolio
 * 
 * This file contains centralized project information used across the website.
 * Edit this file to modify existing projects or add new ones.
 * 
 * NOTE: Only the first 3 projects (top to bottom) will display as "Recent Acquisitions" 
 * on the homepage. Additional projects will only appear on the projects page.
 * 
 * Structure for each project:
 * {
 *   id: "unique-id",                 // Unique identifier for the project
 *   title: "Project Title",          // Display title
 *   category: "category-name",       // For filtering (application, tracking, etc.)
 *   featured: true|false,            // Whether to show on homepage
 *   shortDescription: "Brief text",  // Short description for featured section
 *   fullDescription: "Longer text",  // Full description for project page
 *   imageSrc: "url/to/image.png",    // Main image URL
 *   imageAlt: "Description",         // Image alt text for accessibility
 *   techTags: ["Tag1", "Tag2"],      // Technologies used
 *   links: [                         // Array of related links
 *     {
 *       text: "Link Text",
 *       icon: "font-awesome-class",
 *       url: "https://example.com",
 *       external: true|false
 *     }
 *   ]
 * }
 */

const projectData = [
    {
        id: "mdword",
        title: "MDWord",
        category: "application",
        featured: true,
        shortDescription: "MDWord is a web-based application that converts between Markdown and Word documents",
        fullDescription: "MDWord is a web application that provides seamless conversion between Markdown files and Word documents. It offers a simple solution for maintaining document formatting across different platforms and systems.",
        imageSrc: "https://github.com/TrazynCache/Markdown-Word-Converter/raw/main/images/MDWord_TrazynCache_screenshot_cropped.PNG",
        imageAlt: "MDWord Screenshot",
        techTags: ["React", "Tailwind CSS", ".MD", "Word"],
        links: [
            {
                text: "GitHub",
                icon: "fab fa-github",
                url: "https://mdword.trazyncache.com/",
                external: true
            }
        ]
    },
    {
        id: "autoclacker",
        title: "AutoClacker",
        category: "application",
        featured: true,
        shortDescription: "An automation tool for precise control of input devices, designed for Windows 11 gaming applications.",
        fullDescription: "AutoClacker is an automation tool that provides precise control over mouse and keyboard inputs. Designed specifically for Windows 11 gaming, it offers customizable macros and input sequences for enhanced gaming experiences.",
        imageSrc: "https://raw.githubusercontent.com/TrazynCache/AutoClacker/refs/heads/master/Images/AutoClacker_Not_Running.png",
        imageAlt: "AutoClacker Screenshot",
        techTags: ["C#", ".Net 8", "json"],
        links: [
            {
                text: "GitHub",
                icon: "fab fa-github",
                url: "https://github.com/TrazynCache/AutoClacker",
                external: true
            }
        ]
    },
    {
        id: "expense-tracker",
        title: "Expense Tracker",
        category: "tracking",
        featured: true,
        shortDescription: "A financial tracking application that monitors and visualizes spending patterns.",
        fullDescription: "The Expense Tracker is a comprehensive financial tool that records and categorizes expenditures. It provides detailed visualizations of spending patterns, helping users maintain better control over their finances.",
        imageSrc: "https://github.com/TrazynCache/Expense-Tracker-Updated/blob/master/image/Expense%20tracker%20front.png?raw=true",
        imageAlt: "Expense Tracker Interface",
        techTags: ["Python", "HTML", "CSS", "Javascript"],
        links: [
            {
                text: "GitHub",
                icon: "fab fa-github",
                url: "https://github.com/TrazynCache/Expense-Tracker-Updated",
                external: true
            }
        ]
    },
    {
        id: "time-tracker",
        title: "Simple Time Tracker",
        category: "tracking",
        featured: false,
        shortDescription: "A time tracking application that logs and analyzes task durations.",
        fullDescription: "The Simple Time Tracker is an efficient tool for monitoring time spent on various tasks. It provides detailed logging and analysis of time allocation, helping users optimize their productivity.",
        imageSrc: "https://github.com/TrazynCache/Simple-Time-Tracker-for-Tasks/blob/master/images/Simple_Time_Tracker_front.png?raw=true",
        imageAlt: "Simple Time Tracker Interface",
        techTags: ["Python", "HTML", "CSS", "Javascript"],
        links: [
            {
                text: "GitHub",
                icon: "fab fa-github",
                url: "https://github.com/TrazynCache/Simple-Time-Tracker-for-Tasks",
                external: true
            }
        ]
    }
    // Add new projects here following the same structure
];

// About section data - modify this to update the about text on the homepage
const aboutData = {
    title: "About Archives of TrazynCache",
    description: "I am a developer focused on creating practical technological solutions. My work combines human creativity with artificial intelligence to build tools that solve real problems and improve workflows. Each project represents a commitment to functional design and user-centered development, crafted through collaborative AI-assisted programming. This collection showcases working applications that demonstrate the potential of thoughtful software development."
};

// Helper functions for project data
const projectHelpers = {
    // Get all projects
    getAllProjects: () => projectData,
    
    // Get featured projects for homepage (first 3 projects from the top of the array)
    // To add new projects to homepage: add them at the top of projectData array with featured: true
    getFeaturedProjects: () => projectData.slice(0, 3),
    
    // Get projects by category
    getProjectsByCategory: (category) => {
        if (category === 'all') return projectData;
        return projectData.filter(project => project.category === category);
    },
    
    // Get project by ID
    getProjectById: (id) => projectData.find(project => project.id === id),
    
    // Get all available categories
    getAllCategories: () => {
        const categories = new Set(projectData.map(project => project.category));
        return ['all', ...Array.from(categories)];
    },
    
    // Get user-friendly category name
    getCategoryName: (categoryCode) => {
        const categoryNames = {
            'all': 'Complete Collection',
            'application': 'Tool',
            'tracking': 'Tracking Systems',
            'web': 'Web Artifacts',
            'game': 'Interactive Constructs',
            'ai': 'Synthetic Intelligence'
        };
        
        return categoryNames[categoryCode] || categoryCode;
    }
};
