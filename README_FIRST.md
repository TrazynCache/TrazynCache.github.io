# ⚠️ IMPORTANT: READ BEFORE MAKING ANY CHANGES

## 🚨 This Project Uses Automatic Cache Management

**CRITICAL STEP:** Before pushing ANY changes to GitHub, you MUST run:

```bash
node update-version.js
```

This ensures users see your updates immediately without manual cache clearing.

## Quick Workflow:
1. Make your changes
2. Run `node update-version.js`
3. Commit and push to GitHub
4. Users automatically get the latest version!

## For AI Assistants:
- Always run the version update script after making changes
- See `UPDATE_INSTRUCTIONS.md` for detailed AI workflow
- This is NOT optional - it's required for proper functionality

## Documentation:
- `CACHE_MANAGEMENT.md` - Complete system overview
- `UPDATE_INSTRUCTIONS.md` - Detailed workflow for AI assistants
- `update-version.js` - Automated version bumping script

---
**🎯 Remember: No version update = Users won't see your changes!**
