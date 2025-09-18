# Next Gen UI Agent - Dynamic UI

[![Module Status](https://img.shields.io/badge/status-Tech%20Preview-orange)](https://github.com/RedHat-UX/next-gen-ui-agent)
[![Module Category](https://img.shields.io/badge/category-UI%20Renderer-blue)](https://github.com/RedHat-UX/next-gen-ui-agent)

A collection of reusable React/PatternFly components for dynamic UI rendering in the Next Gen UI Agent project. This package provides wrappers for markdown, tables, accordions, messages, and more.

## 📋 Table of Contents

- [Installation](#-installation)
- [Available Components](#-available-components)
- [Usage Examples](#-usage-examples)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors and Acknowledgement](#-authors-and-acknowledgments)
- [Project Status](#-project-status)

## 🚀 Installation

```bash
npm install <package-name>
```

Available Components:
- DynamicComponents
- OneCardWrapper
- TableWrapper
**Requirements:**
- React 18+
- TypeScript

## 🧩 Available Components

## Usage Example
```js
| Component | Description |
|-----------|-------------|
| `AccordionWrapper` | Collapsible content sections |
| `CodeBlockWrapper` | Syntax-highlighted code blocks |
| `CustomLink` | Enhanced link component |
| `DynamicComponents` | Dynamic component renderer |
| `ListWrapper` | Structured list display |
| `MarkdownWrapper` | Markdown content renderer |
| `Message` | Alert and notification messages |
| `QuickResponse` | Quick action responses |
| `TableWrapper` | Data table component |

## 💡 Usage Examples

### Accordion Component

```jsx
import { AccordionWrapper } from '<package-name>';

function App() {
  return (
    <AccordionWrapper title="Click me">
      <p>This is hidden content!</p>
    </AccordionWrapper>
  );
}
```

### OneCard Component

```jsx
import { OneCardWrapper } from '<package-name>';

const mockData = {
  title: "Movie Details",
  image: "https://image.tmdb.org/t/p/w440_and_h660_face/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
  fields: [
    {
      name: "Title",
      data_path: "movie.title",
      data: ["Toy Story"]
    },
    {
      name: "Year",
      data_path: "movie.year",
      data: [1995]
    },
    {
      name: "Genres",
      data_path: "movie.genres",
      data: ["Animation", "Adventure"]
    }
  ],
  imageSize: "md",
  id: "movie-card",
};

function App() {
  return <OneCardWrapper {...mockData} />;
}
```

## 📁 Project Structure

```
libs_js/next_gen_ui_react/
├── public/                    # Public static assets
├── src/
│   ├── components/           # Core reusable components
│   ├── constants/            # Component mapping logic
│   ├── test/
│   │   └── components/       # Unit tests
│   │   └── setup.ts         # Test configuration
│   ├── index.tsx            # Entry point
│   └── index.html           # HTML template
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # Lock file
└── README.md               # This file
```

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build  # Generates the package in /dist

# Link for local development
npm link dynamicui
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the package for production |
| `npm test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once (CI mode) |

## 🧪 Testing

### Running Tests

1. **Install Dependencies**
   ```bash
   npm install
   ```
   Installs all project dependencies, including the internal test setup package.

2. **Run All Tests (Watch Mode)**
   ```bash
   npm test
   ```
   Starts Jest in watch mode, re-running relevant tests as you save changes.

3. **Run Tests Once (CI Mode)**
   ```bash
   npm run test:ci
   ```
   Executes the entire test suite a single time without watching.

4. **Run a Specific Test File**
   ```bash
   npm test -- src/test/components/ComponentName.test.tsx
   ```
   Or using the run keyword:
   ```bash
   npm run test -- src/test/components/ComponentName.test.tsx
   ```

### Test Configuration

- **Global config**: Handled by `setupTests.ts` via internal npm package
- **Test files**: Follow pattern `*.test.tsx` or `*.test.js`
- **Location**: Placed in `tests/` folders

## 🤝 Contributing

This module is part of the [Next Gen UI Agent project](https://github.com/RedHat-UX/next-gen-ui-agent). 

For contribution guidelines, please follow [CONTRIBUTING.md](https://github.com/RedHat-UX/next-gen-ui-agent/blob/main/CONTRIBUTING.md).

## 📄 License

This project is licensed under the terms specified in the main Next Gen UI Agent repository.

## 👥 Authors and Acknowledgments

Show your appreciation to those who have contributed to the project.

## 📊 Project Status

**Status**: Tech Preview  
**Category**: UI Renderer

This module is currently in tech preview. Development is active and contributions are welcome.