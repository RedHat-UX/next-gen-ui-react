import DynamicComponent from "./components/DynamicComponents";
export default DynamicComponent;

// Export types for the default component
export type {
  DynamicComponentProps,
  ComponentConfig,
} from "./components/DynamicComponents";

// Re-export registry items for consumers
export {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
  type AutoFormatterIdOption,
  type AutoFormatterProviderOptions,
  type ComponentHandlerRegistry,
  type HandlerResolver,
  type FormatterContext,
  type FormatterContextMatcher,
  type CellFormatter,
  type ItemClickHandler,
  type ItemClickPayload,
  type ItemDataFieldValue,
} from "./components/ComponentHandlerRegistry";

// Re-export built-in formatters
export {
  autoFormatters,
  builtInFormatters,
  BUILT_IN_FORMATTER_IDS,
  createCurrencyFormatter,
  datetimeFormatter,
  getAutoFormatter,
  ISO_DATE_PATTERN,
  ISO_DATE_PATTERN_SORT,
  isISODate,
  type AutoFormatterId,
  type AutoFormatterOptions,
  type BuiltInFormatterId,
} from "./utils/builtInFormatters";

// API for registering custom components (HBC)
export { register } from "./utils/customComponentRegistry";

// Export HBCConfig type for TypeScript consumers
export type { HBCConfig } from "./types/HBCConfig";
