# Contributing to Next Gen UI React

Thanks for helping out. This guide covers how to add new components and contribute to the project.

## Getting Started

### Prerequisites

- Node 20 or higher
- npm 8 or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/next-gen-ui-react.git
   cd next-gen-ui-react
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/RedHat-UX/next-gen-ui-react.git
   ```
4. Install dependencies:
   ```bash
   npm install
   cd app && npm install && cd ..
   ```

### Running the Demo App

The demo app shows all components in action:

```bash
npm run dev
```

Open http://localhost:5173 to see the demo.

## Adding a New Component

Adding a component involves 3 main steps: create the component, add demo data, and register it in the demo app.

### Step 1: Create the Component File

Create your component in `src/components/YourComponent.tsx`:

```typescript
import { Card, CardBody } from "@patternfly/react-core";
import React from "react";

interface YourComponentProps {
  id?: string;
  className?: string;
  // Your props here
}

const YourComponent: React.FC<YourComponentProps> = ({
  id,
  className,
}) => {
  return (
    <Card id={id} className={className}>
      <CardBody>
        {/* Your component logic */}
      </CardBody>
    </Card>
  );
};

export default YourComponent;
```

**Tips:**

- Use PatternFly React components as building blocks
- Keep the component focused on one thing
- Make it work with the dynamic component system (accept props as config)

### Step 2: Add Tests

Create a test file at `src/test/components/YourComponent.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import YourComponent from "../../components/YourComponent";

describe("YourComponent", () => {
  it("renders with basic props", () => {
    render(<YourComponent />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("handles all variants", () => {
    // Test different configurations
  });
});
```

Run tests:

```bash
npm run test
```

### Step 3: Add Demo Data

Add example configurations in `app/src/demo/demoData.ts`:

```typescript
export const yourComponentBasic = {
  component: "your-component" as const,
  id: "your-component-basic",
  title: "Basic Example",
  // Your props
};

export const yourComponentAdvanced = {
  component: "your-component" as const,
  id: "your-component-advanced",
  title: "Advanced Example",
  // More complex props
};
```

**Tips:**

- Create 3-5 examples showing different use cases
- Use realistic data (not "test1", "test2")
- Show edge cases (empty state, many items, etc)

### Step 4: Register the Component

#### Update componentRegistry.ts

Edit `app/src/config/componentRegistry.ts`:

```typescript
// Add imports at the top (alphabetically)
import {
  yourComponentBasic,
  yourComponentAdvanced,
  // other imports
} from "../demo/demoData";

// Add to componentRegistry array (alphabetically by id)
export const componentRegistry: ComponentConfig[] = [
  // other components...
  {
    id: "yourcomponent",
    name: "YourComponent",
    path: "/component/yourcomponent",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/YourComponent.tsx",
    componentImportPath: "@local-lib/components/YourComponent",
    examples: [
      { title: "Basic Example", data: yourComponentBasic },
      { title: "Advanced Example", data: yourComponentAdvanced },
    ],
  },
];
```

#### Update ComponentDemo.tsx

Edit `app/src/pages/ComponentDemo.tsx`:

```typescript
// Add import (alphabetically)
import YourComponent from "@local-lib/components/YourComponent";

// Add to componentMap (alphabetically)
const componentMap: Record<string, React.ComponentType<any>> = {
  // other components...
  yourcomponent: YourComponent,
};
```

#### Update componentsMap.ts

Edit `src/constants/componentsMap.ts`:

```typescript
import YourComponent from "../components/YourComponent";

export const componentsMap = {
  // other components...
  "your-component": YourComponent,
};
```

### Step 5: Test in the Demo App

Run the demo app:

```bash
npm run dev
```

Visit http://localhost:5173/component/yourcomponent

Check that:

- Component appears in the sidebar
- All examples render correctly
- JSON configuration shows properly
- GitHub source link works

## Code Quality

Before submitting, make sure your code passes all checks:

```bash
npm run type-check      # TypeScript checks
npm run lint            # ESLint
npm run format:check    # Prettier
npm run test            # Unit tests
npm run build           # Builds successfully
```

Fix any issues:

```bash
npm run format          # Auto-fix formatting
```

The pre-commit hook will run these automatically when you commit.

## Submitting a Pull Request

1. Create a feature branch:

   ```bash
   git checkout -b feat/add-your-component
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: add your component"
   ```

3. Push to your fork:

   ```bash
   git push origin feat/add-your-component
   ```

4. Open a pull request on GitHub

### Commit Message Format

Use conventional commits:

- `feat: add new component` - new feature
- `fix: resolve rendering issue` - bug fix
- `docs: update contributing guide` - documentation
- `chore: update dependencies` - maintenance
- `test: add tests for component` - tests only

Keep messages short and descriptive.

### PR Description

Include:

- What component you added
- What problem it solves
- Screenshots if applicable
- Any breaking changes

## Architecture Overview

Understanding how the pieces fit together helps when contributing.

### Component Structure

```
src/components/          # React components
src/constants/           # Component mappings
src/test/components/     # Unit tests
app/src/demo/            # Demo data and examples
app/src/config/          # Registry configuration
app/src/pages/           # Demo app pages
```

### Dynamic Component System

The repo uses a dynamic rendering approach:

1. Components are defined in `src/components/`
2. They're mapped by id in `src/constants/componentsMap.ts`
3. Demo app uses this map to render components from JSON configs
4. Allows agents/APIs to request components by name without importing

### Demo App Flow

```
User visits /component/dataview
  -> ComponentDemo.tsx loads componentRegistry
  -> Finds "dataview" entry with examples
  -> Renders DataViewWrapper with each example data
  -> Shows JSON config for each example
```

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Ask questions in pull request comments

## Releasing

For maintainers: see [RELEASING.md](./RELEASING.md) for the release process.

## Code of Conduct

Be respectful and constructive in all interactions.
