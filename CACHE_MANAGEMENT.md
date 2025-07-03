# Automatic Cache Management System

This portfolio website now includes an automatic cache management system that ensures users always see the latest version of your site without needing to manually clear their browser cache.

## How It Works

### 1. Version Tracking
- The `manifest.json` file contains a `version` and `build_timestamp`
- Every time you deploy updates, these values change
- The service worker automatically detects these changes

### 2. Automatic Cache Clearing
- When users visit your site, the service worker checks for version updates
- If a new version is detected, all old caches are automatically cleared
- Users get a friendly notification about the update

### 3. User Experience
- Users see a sleek notification when updates are available
- They can choose to update immediately or continue browsing
- The notification auto-dismisses after 10 seconds
- Updates happen seamlessly in the background

## Deployment Workflow

### Option 1: Automatic Version Bumping (Recommended)

Before pushing to GitHub, run the version update script:

```bash
# Patch version bump (1.0.0 → 1.0.1)
node update-version.js

# Minor version bump (1.0.0 → 1.1.0)
node update-version.js minor

# Major version bump (1.0.0 → 2.0.0)
node update-version.js major

# Set specific version
node update-version.js 2.1.0
```

Then commit and push:
```bash
git add .
git commit -m "Version 1.0.1"
git push
```

### Option 2: Manual Version Update

1. Edit `manifest.json`:
   ```json
   {
     "version": "1.0.1",
     "build_timestamp": "2025-06-15T05:00:00.000Z"
   }
   ```

2. Update the service worker cache version in `sw.js`:
   ```javascript
   const CACHE_VERSION = 'v1.0.1';
   ```

3. Commit and push to GitHub

## Features

### Smart Update Detection
- Checks for updates every 30 seconds when the page is visible
- Checks when users return to the tab (visibility change)
- Compares both version number and build timestamp

### User-Friendly Notifications
- Styled to match your portfolio's Necron theme
- Non-intrusive slide-in animation
- Clear "Update Now" and "Later" options
- Auto-dismisses if ignored

### Efficient Caching
- Only clears caches when actual updates are detected
- Preserves version information across cache clears
- Maintains offline functionality

### Background Updates
- Service worker updates happen automatically
- No interruption to user browsing
- Seamless transition to new versions

## Technical Details

### Files Modified
- `manifest.json` - Added version tracking
- `sw.js` - Enhanced with automatic cache management
- `js/sw-register.js` - Added update detection and notifications
- `update-version.js` - Automated version bumping script

### Cache Strategy
- **Version Cache**: Persistent cache for version information
- **Content Cache**: Automatically cleared when updates are detected
- **Background Sync**: Checks for updates during idle time

### Browser Compatibility
- Works in all modern browsers that support Service Workers
- Graceful fallback for browsers without Service Worker support
- Progressive enhancement approach

## Troubleshooting

### Users Not Seeing Updates
1. Verify the version was updated in `manifest.json`
2. Check that the service worker cache version matches
3. Ensure the build timestamp is current
4. Test in an incognito window

### Service Worker Issues
1. Check browser console for errors
2. Verify service worker registration in DevTools
3. Manually unregister and re-register if needed

### Testing Updates Locally
1. Run `node update-version.js` to bump version
2. Serve the site locally
3. Open in browser and check for update notification
4. Verify cache clearing in DevTools

## Benefits

✅ **Zero User Friction** - No manual cache clearing required
✅ **Instant Updates** - Users see changes immediately after deployment
✅ **Professional UX** - Smooth, branded update notifications
✅ **Automated Workflow** - Simple script handles version management
✅ **Reliable Caching** - Smart cache invalidation prevents stale content
✅ **Offline Support** - Maintains PWA functionality

## Future Enhancements

- Add update changelog display
- Implement selective cache clearing for specific file types
- Add analytics for update adoption rates
- Create GitHub Actions integration for automatic version bumping

---

*This system ensures your portfolio always shows the latest version to visitors while maintaining excellent performance through intelligent caching.*
