# Interactive CV - Ignacio Kruchowski

An interactive and modern CV developed with Astro, React and Tailwind CSS that presents my professional experience in a dynamic and attractive way.

## 🚀 Features

- **Interactive Design**: Fluid animations with Framer Motion and GSAP
- **Dark/Light Mode**: Customizable theme with smooth transitions
- **Custom Cursor**: Animated cursor that follows the user
- **PDF Export**: Functionality to download the CV as PDF
- **Responsive Design**: Optimized for all devices
- **Print Optimized**: Specific styles for printing
- **Performance**: Built with Astro for maximum speed

## 🛠️ Tech Stack

### Frontend

- **Astro** - Modern framework for static sites
- **React 19** - UI library for interactive components
- **TypeScript** - Static typing for greater robustness
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animations and gestures
- **GSAP** - Advanced animations

### UI/UX

- **React Icons** - Icon library
- **Class Variance Authority** - Variant components
- **Clsx & Tailwind Merge** - CSS utilities

### Export

- **html2canvas** - DOM screenshot capture
- **jsPDF** - PDF generation
- **html2pdf.js** - HTML to PDF conversion

## 📁 Project Structure

```
src/
├── components/
│   ├── cv/              # CV components
│   └── ui/              # Generic UI components
├── data/
│   └── cv-content.json  # CV data
├── layouts/
│   └── Layout.astro     # Main layout
├── pages/
│   └── index.astro      # Main page
├── lib/
│   └── utils.ts         # Utilities
└── styles/
    └── global.css       # Global styles
```

## 🚀 Installation and Development

### Prerequisites

- Node.js 18+
- npm, yarn or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cv-project

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev

# Open http://localhost:4321
```

### Build

```bash
# Build for production
npm run build
# or
bun run build
```

### Preview

```bash
# Preview production
npm run preview
# or
bun run preview
```

## 📝 Configuration

### CV Data

The resume data is located in `src/data/cv-content.json`. This file contains:

- Personal profile
- Work experience
- Education
- Skills
- Projects
- Contact

### Customization

- **Colors**: Modify in `tailwind.config.ts`
- **Fonts**: Configure in `src/layouts/Layout.astro`
- **Animations**: Adjust in specific components

## 🎨 UI Features

### Main Components

- **CVContainer**: Main CV container
- **CustomCursor**: Animated custom cursor
- **Button**: Reusable button component

### Themes

- **Light**: Default light theme
- **Dark**: Automatic dark theme
- **Transitions**: Smooth transitions between themes

### Animations

- **Framer Motion**: Component animations
- **GSAP**: Complex animations and scroll
- **CSS Transitions**: Smooth state transitions

## 🖨️ Printing and Export

### Printing

- Optimized for paper printing
- Hides unnecessary elements
- Flat layout for printing

### PDF Export

- Integrated download button
- Full CV screenshot capture
- Automatic PDF generation

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build and deploy
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages

```bash
# Build
npm run build

# Configure GitHub Pages for the dist/ folder
```

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📧 Contact

- **Email**: ignakruchowski@gmail.com
- **LinkedIn**: linkedin.com/in/ignacio-kruchowski
- **GitHub**: github.com/krushodev

---

⭐ If you like this project, give it a star on GitHub!
