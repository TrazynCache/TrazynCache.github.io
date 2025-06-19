#!/usr/bin/env node

/**
 * Automatic Version Updater for IronAdamant Portfolio
 * 
 * This script automatically updates the version and build timestamp
 * in manifest.json to trigger cache clearing for users.
 * 
 * Usage:
 * - node update-version.js          (patch version bump)
 * - node update-version.js minor    (minor version bump)
 * - node update-version.js major    (major version bump)
 * - node update-version.js 2.1.0    (set specific version)
 */

const fs = require('fs');
const path = require('path');

// Read current manifest
const manifestPath = path.join(__dirname, 'manifest.json');
let manifest;

try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (error) {
  console.error('Error reading manifest.json:', error.message);
  process.exit(1);
}

// Get current version or default
const currentVersion = manifest.version || '1.0.0';
const versionParts = currentVersion.split('.').map(Number);

// Determine new version based on argument
const arg = process.argv[2] || 'patch';
let newVersion;

if (arg.match(/^\d+\.\d+\.\d+$/)) {
  // Specific version provided
  newVersion = arg;
} else {
  // Version bump type
  switch (arg.toLowerCase()) {
    case 'major':
      newVersion = `${versionParts[0] + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${versionParts[0]}.${versionParts[1] + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;
      break;
  }
}

// Update manifest
manifest.version = newVersion;
manifest.build_timestamp = new Date().toISOString();

// Write updated manifest
try {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Version updated: ${currentVersion} → ${newVersion}`);
  console.log(`📅 Build timestamp: ${manifest.build_timestamp}`);
  console.log(`🚀 Ready to deploy! Users will automatically get the new version.`);
} catch (error) {
  console.error('Error writing manifest.json:', error.message);
  process.exit(1);
}

// Also update the service worker cache version to match
const swPath = path.join(__dirname, 'sw.js');
try {
  let swContent = fs.readFileSync(swPath, 'utf8');
  const versionRegex = /const CACHE_VERSION = '[^']+';/;
  const newCacheVersion = `const CACHE_VERSION = 'v${newVersion}';`;
  
  if (versionRegex.test(swContent)) {
    swContent = swContent.replace(versionRegex, newCacheVersion);
    fs.writeFileSync(swPath, swContent);
    console.log(`🔧 Service worker cache version updated to v${newVersion}`);
  }
} catch (error) {
  console.warn('Warning: Could not update service worker version:', error.message);
}

console.log('\n📋 Next steps:');
console.log('1. Commit your changes: git add . && git commit -m "Version ' + newVersion + '"');
console.log('2. Push to GitHub: git push');
console.log('3. Users will automatically see the update notification!');
