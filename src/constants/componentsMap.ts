import ChartComponent from "../components/ChartComponent";
import DataViewWrapper from "../components/DataViewWrapper";
import EmptyStateWrapper from "../components/EmptyStateWrapper";
import ImageComponent from "../components/ImageComponent";
import OneCardWrapper from "../components/OneCardWrapper";
import SetOfCardsWrapper from "../components/SetOfCardsWrapper";
import VideoPlayerWrapper from "../components/VideoPlayerWrapper";

export const componentsMap = {
  "one-card": OneCardWrapper,
  image: ImageComponent,
  "video-player": VideoPlayerWrapper,
  "set-of-cards": SetOfCardsWrapper,
  "empty-state": EmptyStateWrapper,
  "data-view": DataViewWrapper,
  table: DataViewWrapper, // Backwards compatibility: table uses DataViewWrapper
  "chart-bar": ChartComponent,
  "chart-line": ChartComponent,
  "chart-pie": ChartComponent,
  "chart-donut": ChartComponent,
  "chart-mirrored-bar": ChartComponent,
};
