# LinguaVerse Theming System

## Overview
LinguaVerse supports a dynamic, plugin-based theming system. Themes are standard NPM packages that export a color palette. The system automatically detects installed theme packages and makes them available in the UI.

## Using Themes
1.  Navigate to `/themes` in the application.
2.  Hover over a theme card to preview it.
3.  Click a theme to apply it. The selection is saved to your browser's Local Storage.

## Creating a New Theme

### 1. Create a Package
Create a new directory (e.g., `linguasetu-theme-mytheme`) with a `package.json` and `index.js`.

**package.json**
```json
{
  "name": "linguasetu-theme-mytheme",
  "version": "1.0.0",
  "main": "index.js"
}
```

### 2. Define the Palette
**index.js**
The package must export `name`, `type` (light/dark), and a `colors` object.

```javascript
export const name = "My Custom Theme";
export const type = "light"; // 'light' or 'dark'
export const colors = {
    primary: "#ff0000",   // Main brand color
    secondary: "#00ff00", // Accent color
    background: "#ffffff", // App background
    text: "#000000"       // Main text color
};
```

### 3. Install
Install the package into the client application.

```bash
cd client
npm install ../path/to/linguasetu-theme-mytheme
```

The system will automatically detect the package during component build (Vite) and register it. No other configuration is needed!
