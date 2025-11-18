# Assets Directory

This directory contains all static assets for the Frov Mobile app.

## Required Files

Generate these files before building the app:

### App Icon
- **File**: `icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: App icon on home screen

### Splash Screen
- **File**: `splash.png`
- **Size**: 1284x2778 pixels (or higher)
- **Format**: PNG
- **Usage**: Loading screen when app starts

### Adaptive Icon (Android)
- **File**: `adaptive-icon.png`
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: Android adaptive icon

### Favicon (Web)
- **File**: `favicon.png`
- **Size**: 48x48 pixels
- **Format**: PNG or ICO
- **Usage**: Browser tab icon

## Quick Asset Generation

### Using Figma or Design Tool
1. Create a 1024x1024 canvas
2. Design your app icon (keep important content in center 768x768)
3. Export as PNG
4. Save as `icon.png` and `adaptive-icon.png`

### Using Online Generator
- [App Icon Generator](https://appicon.co/)
- [Figma Community](https://www.figma.com/community/search?model_type=hub_files&q=app%20icon)

### Placeholder (For Testing)
Create a simple colored square with text:
```bash
# macOS/Linux with ImageMagick
convert -size 1024x1024 xc:#7c3aed -pointsize 120 -fill white -gravity center -annotate +0+0 "FROV" icon.png
```

## Current Assets

This directory should contain:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `favicon.png` (48x48)

## Design Guidelines

### App Icon
- Keep it simple and recognizable
- Use bold colors and clear shapes
- Ensure it looks good at small sizes
- Follow platform guidelines:
  - iOS: Rounded by system
  - Android: Can have transparency

### Splash Screen
- Match your app's brand colors
- Center your logo/icon
- Keep background simple
- No text (except brand name)

### Color Scheme (Current)
- Primary: `#7c3aed` (Purple)
- Background: `#1a1a2e` (Dark Navy)
- Accent: `#0f0f23` (Deep Blue)

## File Organization

```
assets/
├── icon.png              # Main app icon
├── adaptive-icon.png     # Android adaptive icon
├── splash.png            # Splash screen
├── favicon.png           # Web favicon
└── README.md            # This file
```

## Notes

- All assets will be optimized automatically by Expo
- Icons will be generated for all required sizes
- You can override generated assets in `app.json`
- Assets are cached, clear cache if changes don't appear: `expo start -c`
