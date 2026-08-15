# Design System & Color Palette

## 🎨 Overview

**Theme**: Dark-first with matte, gradient-based pastel colors
**Primary Mode**: Dark mode (90% of UI)
**Secondary Mode**: Light mode toggle available
**Philosophy**: Minimal, sophisticated, accessible

---

## 🌙 Dark Mode Palette

### Primary Colors (Brand)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Soft Purple** | `#A78BFA` | `167, 139, 250` | Buttons, links, accent |
| **Soft Blue** | `#7DD3FC` | `125, 211, 252` | Secondary accent, hover states |
| **Soft Pink** | `#F472B6` | `244, 114, 182` | Highlights, badges |
| **Soft Mint** | `#6EE7B7` | `110, 231, 183` | Success states, verified |
| **Soft Peach** | `#FCA5A5` | `252, 165, 165` | Warnings, errors (softer) |

### Background Colors (Matte)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Base (Darkest)** | `#0F0F0F` | `15, 15, 15` | Page background |
| **Surface 1** | `#1A1A1A` | `26, 26, 26` | Cards, modals, containers |
| **Surface 2** | `#262626` | `38, 38, 38` | Hover states, active states |
| **Border** | `#333333` | `51, 51, 51` | Dividers, subtle borders |
| **Subtle** | `#404040` | `64, 64, 64` | Disabled states, secondary text |

### Text Colors (Matte)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary Text** | `#F5F5F5` | `245, 245, 245` | Main body text, headings |
| **Secondary Text** | `#D1D5DB` | `209, 213, 219` | Meta text, timestamps |
| **Tertiary Text** | `#9CA3AF` | `156, 163, 175` | Placeholder, disabled |
| **Inverted** | `#0F0F0F` | `15, 15, 15` | Text on light backgrounds |

---

## ☀️ Light Mode Palette

### Primary Colors (Brand)
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Soft Purple** | `#7C3AED` | `124, 58, 237` | Buttons, links, accent |
| **Soft Blue** | `#0EA5E9` | `14, 165, 233` | Secondary accent, hover |
| **Soft Pink** | `#EC4899` | `236, 72, 153` | Highlights, badges |
| **Soft Mint** | `#10B981` | `16, 185, 129` | Success states |
| **Soft Peach** | `#F97316` | `249, 115, 22` | Warnings, errors |

### Background Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Base (Lightest)** | `#FAFAFA` | `250, 250, 250` | Page background |
| **Surface 1** | `#FFFFFF` | `255, 255, 255` | Cards, modals |
| **Surface 2** | `#F3F4F6` | `243, 244, 246` | Hover states |
| **Border** | `#E5E7EB` | `229, 231, 235` | Dividers, borders |
| **Subtle** | `#D1D5DB` | `209, 213, 219` | Disabled states |

### Text Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary Text** | `#111827` | `17, 24, 39` | Main body text |
| **Secondary Text** | `#4B5563` | `75, 85, 99` | Meta text |
| **Tertiary Text** | `#9CA3AF` | `156, 163, 175` | Placeholder |
| **Inverted** | `#FFFFFF` | `255, 255, 255` | Text on dark backgrounds |

---

## 🎨 Gradient Presets

Use these gradients for sections, backgrounds, and visual interest.

### 1. **Purple → Blue** (Primary CTA, Hero Section)
```css
background: linear-gradient(135deg, #A78BFA 0%, #7DD3FC 100%);
/* Dark mode: vibrant, eye-catching */
```

### 2. **Blue → Mint** (Success, Positive Actions)
```css
background: linear-gradient(135deg, #7DD3FC 0%, #6EE7B7 100%);
/* Dark mode: calm, encouraging */
```

### 3. **Pink → Purple** (Featured Sections)
```css
background: linear-gradient(135deg, #F472B6 0%, #A78BFA 100%);
/* Dark mode: elegant, premium feel */
```

### 4. **Peach → Pink** (Warning/Alert Sections)
```css
background: linear-gradient(135deg, #FCA5A5 0%, #F472B6 100%);
/* Dark mode: attention-grabbing but soft */
```

### 5. **Mint → Blue** (Informational Sections)
```css
background: linear-gradient(135deg, #6EE7B7 0%, #7DD3FC 100%);
/* Dark mode: trustworthy, informative */
```

---

## 🎯 Component-Specific Colors

### Buttons

**Primary Button** (CTA, most important)
```css
/* Dark mode */
background: linear-gradient(135deg, #A78BFA 0%, #7DD3FC 100%);
color: #0F0F0F;
border-radius: 8px;
padding: 12px 24px;
font-weight: 600;

/* Hover */
background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);

/* Active */
background: linear-gradient(135deg, #7C3AED 0%, #0EA5E9 100%);
```

**Secondary Button** (Less prominent)
```css
/* Dark mode */
background: #262626;
color: #A78BFA;
border: 1px solid #333333;

/* Hover */
background: #333333;
color: #7DD3FC;
```

**Danger Button** (Delete, destructive)
```css
/* Dark mode */
background: linear-gradient(135deg, #FCA5A5 0%, #F472B6 100%);
color: #0F0F0F;

/* Hover */
background: linear-gradient(135deg, #F87171 0%, #EC4899 100%);
```

### Input Fields

```css
/* Dark mode */
background: #1A1A1A;
border: 1px solid #333333;
color: #F5F5F5;
border-radius: 8px;
padding: 10px 12px;

/* Focus */
border: 1px solid #A78BFA;
box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);

/* Placeholder */
color: #9CA3AF;
```

### Cards

```css
/* Dark mode */
background: #1A1A1A;
border: 1px solid #262626;
border-radius: 12px;
padding: 20px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

/* Hover */
border: 1px solid #333333;
box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
```

### Badges / Tags

**Success Badge**
```css
background: rgba(110, 231, 183, 0.1);
color: #6EE7B7;
border: 1px solid rgba(110, 231, 183, 0.2);
padding: 4px 12px;
border-radius: 20px;
font-size: 12px;
font-weight: 500;
```

**Warning Badge**
```css
background: rgba(252, 165, 165, 0.1);
color: #FCA5A5;
border: 1px solid rgba(252, 165, 165, 0.2);
```

**Neutral Badge** (Skills)
```css
background: rgba(167, 139, 250, 0.1);
color: #A78BFA;
border: 1px solid rgba(167, 139, 250, 0.2);
```

---

## 📐 Tailwind Configuration

Add this to `tailwind.config.ts` for easy access to design tokens:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Dark Mode Primaries
        'dark': {
          'purple': '#A78BFA',
          'blue': '#7DD3FC',
          'pink': '#F472B6',
          'mint': '#6EE7B7',
          'peach': '#FCA5A5',
        },
        // Dark Mode Backgrounds
        'surface': {
          'base': '#0F0F0F',
          'primary': '#1A1A1A',
          'secondary': '#262626',
          'tertiary': '#333333',
          'subtle': '#404040',
        },
        // Dark Mode Text
        'text': {
          'primary': '#F5F5F5',
          'secondary': '#D1D5DB',
          'tertiary': '#9CA3AF',
        },
      },
      backgroundColor: {
        // Quick access
        'matte': '#0F0F0F',
        'card': '#1A1A1A',
        'hover': '#262626',
      },
      backgroundImage: {
        // Gradient Presets
        'gradient-primary': 'linear-gradient(135deg, #A78BFA 0%, #7DD3FC 100%)',
        'gradient-success': 'linear-gradient(135deg, #7DD3FC 0%, #6EE7B7 100%)',
        'gradient-featured': 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)',
        'gradient-warning': 'linear-gradient(135deg, #FCA5A5 0%, #F472B6 100%)',
        'gradient-info': 'linear-gradient(135deg, #6EE7B7 0%, #7DD3FC 100%)',
      },
      borderColor: {
        'matte': '#333333',
      },
      boxShadow: {
        'matte': '0 4px 6px rgba(0, 0, 0, 0.2)',
        'matte-lg': '0 8px 12px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'default': '8px',
        'lg': '12px',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 🎨 Usage Examples

### Hero Section
```jsx
<section className="bg-gradient-primary text-surface-base p-20 rounded-lg">
  <h1 className="text-4xl font-bold text-white">Welcome</h1>
  <p className="text-text-secondary mt-2">Search resumes with AI</p>
</section>
```

### Button Primary
```jsx
<button className="bg-gradient-primary text-surface-base px-6 py-3 rounded-default font-semibold hover:shadow-matte-lg transition-all">
  Upload Resume
</button>
```

### Card Component
```jsx
<div className="bg-card border border-matte rounded-lg p-6 shadow-matte hover:shadow-matte-lg transition-shadow">
  <h3 className="text-text-primary font-semibold">Resume Title</h3>
  <p className="text-text-secondary mt-2">Meta information</p>
</div>
```

### Badge
```jsx
<span className="bg-dark-mint/10 text-dark-mint border border-dark-mint/20 px-3 py-1 rounded-full text-sm font-medium">
  React
</span>
```

### Input Field
```jsx
<input 
  type="text" 
  className="w-full bg-card border border-matte rounded-default px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-dark-purple focus:ring-2 focus:ring-dark-purple/20 transition-all"
  placeholder="Search for skills..."
/>
```

---

## 🌓 Dark/Light Mode Toggle

### React Hook Pattern
```typescript
'use client';

import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initial = stored || 'dark';
    setTheme(initial);
    
    if (initial === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return { theme, toggle };
}
```

### Theme Toggle Button
```jsx
'use client';

import { useTheme } from '@/lib/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-default bg-card border border-matte hover:bg-hover transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

---

## ✅ Accessibility Checklist

- [ ] All text meets WCAG AA contrast ratios (4.5:1 minimum)
- [ ] Dark mode: Light text on dark backgrounds
- [ ] Light mode: Dark text on light backgrounds
- [ ] Interactive elements have visible focus states (2px border/ring)
- [ ] Color not the only indicator (use icons, text, patterns)
- [ ] All gradients have sufficient contrast for text overlays
- [ ] Disabled states are clearly distinguishable

---

## 🎯 Component Color Guidelines

| Component | Primary Color | Secondary Color | Hover Color |
|-----------|---------------|-----------------|-------------|
| CTA Button | Purple (`#A78BFA`) | N/A | Darker Purple |
| Secondary Button | Border | Text: Purple | Hover BG |
| Input Focus | Border: Purple | Ring: Purple/10 | N/A |
| Success | Mint (`#6EE7B7`) | Mint/10 BG | Darker Mint |
| Warning | Peach (`#FCA5A5`) | Peach/10 BG | Darker Peach |
| Card Hover | Border: `#333333` | Shadow Increase | N/A |
| Badge (Skill) | Purple (`#A78BFA`) | Purple/10 BG | N/A |

---

## 📝 Implementation Notes

1. **Always use CSS custom properties** when possible for consistency
2. **Leverage Tailwind's opacity modifiers** (`/10`, `/20`, etc.) for transparency
3. **Test both dark and light modes** when building components
4. **Use `dark:` prefix** in Tailwind classes for light mode exceptions
5. **Maintain contrast ratios** even in hover/active states
6. **Use rounded-default (8px)** for standard elements, `rounded-lg` for larger sections
7. **Shadow matte** (`box-shadow-matte`) for consistent depth across dark mode

---

## 🚀 Next Steps

As you build components, reference this design system for:
- Color values for gradients and accents
- Shadow and border styling
- Typography scale (create a separate section when needed)
- Spacing and sizing scales
- Animation/transition timing (add when needed)

**Update this file as the design system evolves!**

---

**Last Updated**: August 15, 2026
**Project**: Resume Retrieval System
**Theme**: Dark-first with pastel gradients
