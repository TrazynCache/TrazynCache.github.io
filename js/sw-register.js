// Register Service Worker with automatic update checking
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
        
        // Check for updates every 30 seconds when page is visible
        setInterval(() => {
          if (!document.hidden) {
            registration.update();
          }
        }, 30000);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification();
            }
          });
        });
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });

  // Listen for messages from service worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'CACHE_UPDATED') {
      showUpdateNotification(event.data.message);
    }
  });
}

// Show update notification to user
function showUpdateNotification(message = 'A new version is available!') {
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'update-notification';
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #00ff9d, #00cc7a);
      color: #000;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 255, 157, 0.3);
      z-index: 10000;
      font-family: 'Orbitron', monospace;
      font-weight: 600;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="margin-bottom: 10px;">${message}</div>
      <button onclick="refreshPage()" style="
        background: #000;
        color: #00ff9d;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Orbitron', monospace;
        font-weight: 600;
        margin-right: 10px;
      ">Update Now</button>
      <button onclick="dismissNotification()" style="
        background: transparent;
        color: #000;
        border: 1px solid #000;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Orbitron', monospace;
        font-weight: 600;
      ">Later</button>
    </div>
  `;
  
  // Add animation styles
  if (!document.getElementById('update-notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'update-notification-styles';
    styles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styles);
  }
  
  // Remove existing notification if any
  const existing = document.getElementById('update-notification');
  if (existing) {
    existing.remove();
  }
  
  document.body.appendChild(notification);
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (document.getElementById('update-notification')) {
      dismissNotification();
    }
  }, 10000);
}

// Refresh page to apply updates
function refreshPage() {
  window.location.reload(true);
}

// Dismiss notification
function dismissNotification() {
  const notification = document.getElementById('update-notification');
  if (notification) {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }
}

// Check for updates when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Check for updates when user returns to tab
    navigator.serviceWorker.controller.postMessage({ action: 'checkForUpdates' });
  }
});
