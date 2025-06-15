# 🤖 AUTOMATED UPDATE INSTRUCTIONS FOR AI ASSISTANTS

## CRITICAL: Read This Before Making Any Changes

This portfolio uses an **automatic cache management system** that requires version updates to ensure users see changes immediately. 

### 🚨 MANDATORY STEP BEFORE ANY DEPLOYMENT

**ALWAYS run this command before committing/pushing ANY changes:**

```bash
node update-version.js
```

This command:
- ✅ Automatically bumps the version number
- ✅ Updates the build timestamp  
- ✅ Updates the service worker cache version
- ✅ Triggers automatic cache clearing for all users

### 🔄 Complete Update Workflow

1. **Make your changes** (edit files, add features, fix bugs, etc.)

2. **BEFORE committing, run the version update:**
   ```bash
   node update-version.js
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Version X.X.X - [describe changes]"
   git push
   ```

4. **Result:** Users automatically get notified of updates and see the latest version

### 🎯 For AI Assistants (Claude, ChatGPT, etc.)

When working on this project:

1. **After completing any file modifications**, always include this step:
   ```
   <execute_command>
   <command>node update-version.js</command>
   <requires_approval>false</requires_approval>
   </execute_command>
   ```

2. **Remind the user** to commit and push the changes

3. **Explain** that this ensures users will see the updates immediately

### 📝 Self-Prompting Template for AI

Copy this template for future AI interactions:

```
IMPORTANT: This project uses automatic cache management. 
After making any changes, you MUST run 'node update-version.js' 
before the user commits to GitHub. This ensures users see 
updates immediately without manual cache clearing.
```

### 🔧 Version Types

- `node update-version.js` - Patch version (bug fixes)
- `node update-version.js minor` - Minor version (new features)  
- `node update-version.js major` - Major version (breaking changes)
- `node update-version.js 2.1.0` - Specific version

### ⚠️ What Happens If You Forget

If you push changes without updating the version:
- Users may not see the updates (cached old version)
- Manual cache clearing required on user end
- Defeats the purpose of the automatic system

### ✅ Quick Checklist

- [ ] Made your changes
- [ ] Ran `node update-version.js`
- [ ] Committed with descriptive message
- [ ] Pushed to GitHub
- [ ] Users will automatically see updates!

---

**Remember: The version update is NOT optional - it's required for the cache management system to work properly.**
