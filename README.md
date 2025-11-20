# Token Usage BMAD Setup

This package installs BMAD workflows and Claude commands for your token usage project.

## Usage

### Option 1: From NPM (after publishing)
```bash
npx @ownuun/token-usage-setup
```

### Option 2: From GitHub (recommended)
```bash
# First, push this to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/token-usage.git
git push -u origin main

# Then on any other computer:
npx github:YOUR_USERNAME/token-usage
```

### Option 3: Local testing
```bash
# In this directory
npm link

# In any other directory
npx token-usage-setup
```

## What gets installed?

- `.bmad/` - BMAD workflow configurations (4.2MB)
- `.claude/` - Claude Code slash commands (316KB)

## After Installation

You can use workflows like:
- `/bmad:bmm:workflows:prd`
- `/bmad:bmm:workflows:architecture`
- `/bmad:core:workflows:brainstorming`
- And many more!
