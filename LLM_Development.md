# IronAdamant Portfolio - Development Log

## Project Overview
Personal portfolio website showcasing development projects, built with vanilla JavaScript, HTML, and CSS.

## Recent Updates

### 2025-01-05 - Social Media Updates & Branding Changes

Added X (Twitter) social media link and updated branding across the portfolio:

**Changes Made:**
1. **Added X (Twitter) Link:**
   - URL: https://x.com/Iron_Adamant
   - Added to contact.html social links section
   - Added to all footer sections (index.html, contact.html, projects.html)
   - Included tooltip note: "This X account (created April 2023) is not related to other IronAdamant accounts"
   - Used Font Awesome icon: `fa-x-twitter`

2. **Updated Display Name Branding:**
   - Changed displayed name from "IronAdamant" to "Iron_Adamant" throughout the site
   - Updated in:
     - Page titles (all pages)
     - Hero title on homepage
     - Contact page header ("Iron_Adamant's Transmission Coordinates")
     - Meta descriptions
     - Copyright notices in footers
   - Note: GitHub and other platform URLs remain unchanged (still using IronAdamant)

**Impact:**
- Enhanced social media presence with X (Twitter) integration
- Consistent branding with underscore format matching X handle
- Clear distinction noted about X account independence
- All social links now include: GitHub, X (Twitter), LinkedIn, Buy Me A Coffee

### 2025-01-05 - Windows Sound Tracker Addition

Added Windows Sound Tracker project to the portfolio:

**Changes Made:**
1. Updated `/js/project-data.js` with new project entry
   - Added as first item in projectData array (to appear in "Recent Acquisitions" on homepage)
   - Category: "tracking"
   - Featured: true
   - Included comprehensive descriptions and technical details
   - Added GitHub repository link
   - Used provided image URL from GitHub repository

**Project Details:**
- **Title:** Windows Sound Tracker
- **Category:** Tracking Systems
- **Tech Stack:** C++, Win32 API, WASAPI, CMake
- **Description:** Real-time system sound monitoring application for Windows 11
- **GitHub:** https://github.com/IronAdamant/windows_sound_tracker
- **Image:** https://raw.githubusercontent.com/IronAdamant/windows_sound_tracker/refs/heads/master/images/windows_sound_tracker_ui.png

**Impact:**
- Windows Sound Tracker now appears as the first item in "Recent Acquisitions" on the homepage
- Also visible in the full projects list under "Tracking Systems" category
- Pushes previous projects down (MDWord, AutoClacker, Expense Tracker remain visible on homepage)

## Portfolio Structure

### Key Files:
- `/js/project-data.js` - Centralized project data
- `/index.html` - Homepage
- `/projects.html` - Full projects page
- `/css/` - Styling files
- `/js/` - JavaScript functionality

### Project Display Logic:
- Homepage shows first 3 projects from projectData array
- Projects page shows all projects with filtering capabilities
- Project data is centralized in project-data.js for easy maintenance