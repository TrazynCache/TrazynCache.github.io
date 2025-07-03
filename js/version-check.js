// Simple version check on page load
(function() {
  const STORAGE_KEY = 'site-version';
  const VERSION_CHECK_KEY = 'last-version-check';
  const CHECK_INTERVAL = 3600000; // Check once per hour
  
  // Only check for updates once per hour to save bandwidth
  async function checkForUpdates() {
    try {
      const lastCheck = localStorage.getItem(VERSION_CHECK_KEY);
      const now = Date.now();
      
      // Skip if checked recently
      if (lastCheck && (now - parseInt(lastCheck)) < CHECK_INTERVAL) {
        return;
      }
      
      // Fetch manifest to check version
      const response = await fetch('/manifest.json?t=' + now, {
        cache: 'no-cache'
      });
      
      if (!response.ok) return;
      
      const manifest = await response.json();
      const currentVersion = manifest.version;
      const storedVersion = localStorage.getItem(STORAGE_KEY);
      
      // Update last check time
      localStorage.setItem(VERSION_CHECK_KEY, now.toString());
      
      if (!storedVersion) {
        // First visit - store version
        localStorage.setItem(STORAGE_KEY, currentVersion);
      } else if (storedVersion !== currentVersion) {
        // New version available
        console.log('New version available:', currentVersion);
        localStorage.setItem(STORAGE_KEY, currentVersion);
        
        // Show unobtrusive notification
        showUpdateNotification();
      }
    } catch (error) {
      // Silently fail - don't disrupt user experience
      console.log('Version check failed:', error);
    }
  }
  
  // Show a simple, unobtrusive update notification
  function showUpdateNotification() {
    // Don't show if one already exists
    if (document.getElementById('version-update-notice')) return;
    
    const notice = document.createElement('div');
    notice.id = 'version-update-notice';
    notice.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 255, 157, 0.1);
        border: 1px solid #00ff9d;
        color: #00ff9d;
        padding: 12px 16px;
        border-radius: 4px;
        font-family: 'Orbitron', monospace;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
      ">
        <span>New version available</span>
        <button onclick="location.reload(true)" style="
          background: #00ff9d;
          color: #000;
          border: none;
          padding: 4px 12px;
          border-radius: 2px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
        ">Refresh</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: transparent;
          color: #00ff9d;
          border: none;
          padding: 4px;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        ">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notice);
    
    // Auto-hide after 30 seconds
    setTimeout(() => {
      const element = document.getElementById('version-update-notice');
      if (element) element.remove();
    }, 30000);
  }
  
  // Check on page load (after a short delay to not block initial render)
  if (document.readyState === 'complete') {
    setTimeout(checkForUpdates, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(checkForUpdates, 1000);
    });
  }
  
  // Also check when returning to the page after being away
  let wasHidden = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasHidden = true;
    } else if (wasHidden) {
      wasHidden = false;
      // Check for updates when returning to tab
      checkForUpdates();
    }
  });
})();