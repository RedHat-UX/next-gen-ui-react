// Central registry for all component demos
// Adding a new component is as simple as adding an entry here!

import {
  chartDemoBar,
  chartDemoBarLargeNumbers,
  chartDemoBarLongLabelsVertical,
  chartDemoBarLongTitlesHorizontal,
  chartDemoBarMoviesHorizontal,
  chartDemoBarResponsive,
  chartDemoBarScaled,
  chartDemoBarStacked,
  chartDemoDonut,
  chartDemoDonutCostBreakdown,
  chartDemoLine,
  chartDemoLineLargeNumbers,
  chartDemoLinePerformance,
  chartDemoPie,
  chartDemoPieServerDistribution,
  chartMovieROISimple,
  dataViewDateSort,
  dataViewMinimal,
  dataViewMinimalSmall,
  dataViewNumericSort,
  dataViewRepositories,
  dataViewServers,
  dataViewSimple,
  dataViewUsers,
  dynamicDemo,
  dynamicDemoImage,
  dynamicDemoTable,
  emptyStateCustomIcon,
  emptyStateError,
  emptyStateInfo,
  emptyStateSuccess,
  emptyStateWarning,
  imageDemo,
  imageDemoLarge,
  imageLogoGrid,
  oneCardDemo,
  oneCardDemoAPIEndpoint,
  oneCardDemoNoImage,
  oneCardDemoSmallImage,
  setOfCardsDemo,
  setOfCardsDemoTwoCards,
  setOfCardsDemoWithImages,
  videoDemo,
  videoDemoAuto,
  videoDemo4x3,
} from "../demo/demoData";

export interface ComponentExample {
  title: string;
  data: unknown;
}

export interface ComponentConfig {
  id: string;
  name: string;
  path: string;
  sourceUrl: string;
  componentImportPath: string;
  examples: ComponentExample[];
}

export const componentRegistry: ComponentConfig[] = [
  {
    id: "dataview",
    name: "DataViewWrapper",
    path: "/component/dataview",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/DataViewWrapper.tsx",
    componentImportPath: "@local-lib/components/DataViewWrapper",
    examples: [
      { title: "Repositories Table", data: dataViewRepositories },
      { title: "Users Management", data: dataViewUsers },
      { title: "Server List", data: dataViewServers },
      { title: "Simple Product List", data: dataViewSimple },
      {
        title: "Minimal (12 items, filters & pagination enabled)",
        data: dataViewMinimal,
      },
      {
        title: "Minimal (5 items, filters & pagination auto-disabled)",
        data: dataViewMinimalSmall,
      },
      { title: "Numeric Sorting Demo", data: dataViewNumericSort },
      { title: "ISO Date/Time Sorting Demo", data: dataViewDateSort },
    ],
  },
  {
    id: "dynamic",
    name: "DynamicComponents",
    path: "/component/dynamic",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/DynamicComponents.tsx",
    componentImportPath: "@local-lib/components/DynamicComponents",
    examples: [
      { title: "One Card Component", data: dynamicDemo },
      { title: "Image Component", data: dynamicDemoImage },
      {
        title: "Data View Component (Table - Backwards Compatible)",
        data: dynamicDemoTable,
      },
      { title: "Bar Chart", data: chartDemoBar },
      { title: "Line Chart", data: chartDemoLine },
      { title: "Pie Chart", data: chartDemoPie },
      { title: "Set of Cards", data: setOfCardsDemo },
    ],
  },
  {
    id: "error",
    name: "ErrorPlaceholder",
    path: "/component/error",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ErrorPlaceholder.tsx",
    componentImportPath: "@local-lib/components/ErrorPlaceholder",
    examples: [
      {
        title: "No content example",
        data: { hasError: false, noContentMessage: "No demo content" },
      },
      {
        title: "Error example",
        data: { hasError: true, errorMessage: "Demo error" },
      },
    ],
  },
  {
    id: "emptystate",
    name: "EmptyStateWrapper",
    path: "/component/emptystate",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/EmptyStateWrapper.tsx",
    componentImportPath: "@local-lib/components/EmptyStateWrapper",
    examples: [
      { title: "Info State", data: emptyStateInfo },
      { title: "Success State", data: emptyStateSuccess },
      { title: "Warning State", data: emptyStateWarning },
      { title: "Error State", data: emptyStateError },
      { title: "Custom Icon", data: emptyStateCustomIcon },
    ],
  },
  {
    id: "image",
    name: "ImageComponent",
    path: "/component/image",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ImageComponent.tsx",
    componentImportPath: "@local-lib/components/ImageComponent",
    examples: [
      { title: "Standard Image", data: imageDemo },
      { title: "Large Image", data: imageDemoLarge },
      { title: "Red Hat Logo", data: imageLogoGrid },
    ],
  },
  {
    id: "onecard",
    name: "OneCardWrapper",
    path: "/component/onecard",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/OneCardWrapper.tsx",
    componentImportPath: "@local-lib/components/OneCardWrapper",
    examples: [
      { title: "With Medium Image", data: oneCardDemo },
      { title: "Without Image", data: oneCardDemoNoImage },
      { title: "With Small Image", data: oneCardDemoSmallImage },
      { title: "API Endpoint Status", data: oneCardDemoAPIEndpoint },
    ],
  },
  {
    id: "setofcards",
    name: "SetOfCardsWrapper",
    path: "/component/setofcards",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/SetOfCardsWrapper.tsx",
    componentImportPath: "@local-lib/components/SetOfCardsWrapper",
    examples: [
      { title: "Three Cards", data: setOfCardsDemo },
      { title: "Two Cards", data: setOfCardsDemoTwoCards },
      { title: "Team Members (Four Cards)", data: setOfCardsDemoWithImages },
    ],
  },
  {
    id: "video",
    name: "VideoPlayerWrapper",
    path: "/component/video",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/VideoPlayerWrapper.tsx",
    componentImportPath: "@local-lib/components/VideoPlayerWrapper",
    examples: [
      { title: "YouTube with Poster Image (16:9)", data: videoDemo },
      { title: "Direct Video with Auto Aspect Ratio", data: videoDemoAuto },
      { title: "Classic 4:3 Format", data: videoDemo4x3 },
    ],
  },
  {
    id: "chart",
    name: "ChartComponent",
    path: "/component/chart",
    sourceUrl:
      "https://github.com/RedHat-UX/next-gen-ui-react/blob/main/src/components/ChartComponent.tsx",
    componentImportPath: "@local-lib/components/ChartComponent",
    examples: [
      { title: "Bar Chart - Quarterly Revenue", data: chartDemoBar },
      { title: "Bar Chart - Large Numbers", data: chartDemoBarLargeNumbers },
      {
        title: "Bar Chart - Long Labels",
        data: chartDemoBarLongLabelsVertical,
      },
      {
        title: "Bar Chart - Responsive (No Fixed Width)",
        data: chartDemoBarResponsive,
      },
      {
        title: "Bar Chart - Movie Box Office (Horizontal)",
        data: chartDemoBarMoviesHorizontal,
      },
      {
        title: "Bar Chart - Long Movie Titles (Horizontal)",
        data: chartDemoBarLongTitlesHorizontal,
      },
      { title: "Bar Chart - Scaled (70%)", data: chartDemoBarScaled },
      { title: "Bar Chart - Stacked Sales", data: chartDemoBarStacked },
      { title: "Line Chart - Website Traffic", data: chartDemoLine },
      { title: "Line Chart - Large Numbers", data: chartDemoLineLargeNumbers },
      { title: "Line Chart - Performance", data: chartDemoLinePerformance },
      { title: "Pie Chart - Browser Market Share", data: chartDemoPie },
      {
        title: "Pie Chart - Server Distribution",
        data: chartDemoPieServerDistribution,
      },
      { title: "Donut Chart - Storage Usage", data: chartDemoDonut },
      {
        title: "Donut Chart - Cost Breakdown",
        data: chartDemoDonutCostBreakdown,
      },
      {
        title: "Mirrored Bar Chart - Movie ROI vs Budget",
        data: chartMovieROISimple,
      },
    ],
  },
];

// Helper functions
export const getComponentByPath = (path: string) =>
  componentRegistry.find((c) => c.path === path);

export const getComponentById = (id: string) =>
  componentRegistry.find((c) => c.id === id);
