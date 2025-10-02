# Next Gen UI Patternfly React Renderer

This module is part of the [Next Gen UI Agent project](https://github.com/RedHat-UX/next-gen-ui-agent)

[![Module Category](https://img.shields.io/badge/Module_Category-UI_Renderer-green)](https://github.com/RedHat-UX/next-gen-ui-agent)
[![Module Status](https://img.shields.io/badge/Module_Status-Tech_Preview-orange)](https://github.com/RedHat-UX/next-gen-ui-agent)

This npm package provides a collection of reusable Patternfly React components to support dynamic UI rendering for Next Gen UI Agent.

## Provides:

* Patternfly React Components
  - OneCardWrapper
  - TableWrapper
  - VideoPlayerWrapper
* Dynamic Component Renderer
  - DynamicComponents
* Supported Components
  - `one-card`, `table`, `video-player`
  - `video-player` supports YouTube video URLs and direct video file URLs

## Installation

**Pre-requisites:**
- React 18+
- TypeScript

```bash
npm install @rhngui/patternfly-react-renderer
```

## Usage Examples

### OneCard Component

```jsx
import { OneCardWrapper } from '@rhngui/patternfly-react-renderer';

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

### VideoPlayer Component

```jsx
import { VideoPlayerWrapper } from '@rhngui/patternfly-react-renderer';

const videoData = {
  component: "video-player",
  video: "https://www.youtube.com/embed/v-PjgYDrg70",
  video_img: "https://img.youtube.com/vi/v-PjgYDrg70/maxresdefault.jpg",
  title: "Toy Story Trailer"
};

function App() {
  return <VideoPlayerWrapper {...videoData} />;
}
```

**Supported Video Formats:**
- YouTube URLs (e.g., `https://www.youtube.com/embed/VIDEO_ID`)
- Direct video file URLs (e.g., `https://example.com/video.mp4`)
- Automatic thumbnail generation for YouTube videos
- Poster image fallback support

## Links
* [Documentation](https://redhat-ux.github.io/next-gen-ui-agent/guide/renderer/patternfly_npm/)
* [Source Code](https://github.com/RedHat-UX/next-gen-ui-agent/tree/main/libs_js/next_gen_ui_react)
* [Contributing](https://redhat-ux.github.io/next-gen-ui-agent/development/contributing/)