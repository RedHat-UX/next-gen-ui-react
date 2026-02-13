import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

import { debugLog } from "../utils/debug";
import {
  formatterContextMatchersEqual,
  inputDataTypeMatches,
  matchesContextValue,
} from "../utils/registryMatchers";

export interface ItemDataFieldValue {
  id: string;
  name: string;
  data_path?: string;
  value: string | number | boolean | null;
}

export interface ItemClickPayload {
  componentId?: string;
  inputDataType?: string;
  index?: number;
  fields: Record<string, ItemDataFieldValue>;
}

export type ItemClickHandler = (
  event: React.MouseEvent | React.KeyboardEvent,
  payload: ItemClickPayload
) => void;
export type CellFormatter = (
  value: string | number | boolean | null | (string | number)[]
) => React.ReactNode | string | number;

export interface FormatterContext {
  fieldId?: string;
  fieldName?: string;
  dataPath?: string;
  inputDataType?: string;
  componentId?: string;
}

/** id, name, and/or dataPath (string or RegExp). All provided criteria must match. */
export interface FormatterContextMatcher {
  id?: string | RegExp;
  name?: string | RegExp;
  dataPath?: string | RegExp;
}

export interface HandlerResolver {
  getFormatter?: (
    id: string,
    context?: FormatterContext
  ) => CellFormatter | undefined;
  getItemClick?: (inputDataType: string) => ItemClickHandler | undefined;
}

export interface ComponentHandlerRegistry {
  onItemClickHandlers: Map<string, ItemClickHandler>;
  formatters: Map<string, CellFormatter>;
  registerItemClick: (
    inputDataType: string | RegExp,
    handler: ItemClickHandler
  ) => void;
  unregisterItemClick: (inputDataType: string | RegExp) => void;
  getItemClick: (
    inputDataType: string | null | undefined
  ) => ItemClickHandler | undefined;
  /** Register formatter; matchers (id/name/dataPath) and optional inputDataType. */
  registerFormatter: (
    matchers: FormatterContextMatcher,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  unregisterFormatter: (
    matchers: FormatterContextMatcher,
    inputDataType?: string | RegExp
  ) => void;
  registerFormatterById: (
    id: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  registerFormatterByName: (
    name: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  registerFormatterByDataPath: (
    dataPath: string | RegExp,
    formatter: CellFormatter,
    inputDataType?: string | RegExp
  ) => void;
  unregisterFormatterById: (
    id: string | RegExp,
    inputDataType?: string | RegExp
  ) => void;
  unregisterFormatterByName: (
    name: string | RegExp,
    inputDataType?: string | RegExp
  ) => void;
  unregisterFormatterByDataPath: (
    dataPath: string | RegExp,
    inputDataType?: string | RegExp
  ) => void;
  isActive: () => boolean;
  getFormatter: (
    id: string | null | undefined,
    context?: FormatterContext
  ) => CellFormatter | undefined;
  getAutoFormatterOptions?: () =>
    | {
        exclude?: AutoFormatterIdOption[];
        overrides?: Partial<Record<AutoFormatterIdOption, CellFormatter>>;
      }
    | undefined;
}

export type AutoFormatterIdOption =
  | "datetime"
  | "boolean"
  | "number"
  | "url"
  | "empty";

/** Provider autoFormatterOptions prop. */
export interface AutoFormatterProviderOptions {
  exclude?: AutoFormatterIdOption[];
  overrides?: Partial<Record<AutoFormatterIdOption, CellFormatter>>;
}

const ComponentHandlerRegistryContext =
  createContext<ComponentHandlerRegistry | null>(null);

function logRegistryOperation(
  level: "success" | "warning" | "error",
  message: string
): void {
  const prefix = {
    success: "[Registry] ✅",
    warning: "[Registry] ⚠️",
    error: "[Registry] ❌",
  }[level];
  debugLog(`${prefix} ${message}`);
}

interface ItemClickEntry {
  pattern: RegExp;
  handler: ItemClickHandler;
}

interface FormatterContextEntry {
  matchers: FormatterContextMatcher;
  formatter: CellFormatter;
  inputDataType?: string | RegExp;
}

const NOOP_REGISTRY: ComponentHandlerRegistry = {
  onItemClickHandlers: new Map(),
  formatters: new Map(),
  registerItemClick: () => {},
  unregisterItemClick: () => {},
  getItemClick: () => undefined,
  registerFormatter: () => {},
  unregisterFormatter: () => {},
  registerFormatterById: () => {},
  registerFormatterByName: () => {},
  registerFormatterByDataPath: () => {},
  unregisterFormatterById: () => {},
  unregisterFormatterByName: () => {},
  unregisterFormatterByDataPath: () => {},
  getFormatter: () => undefined,
  isActive: () => false,
  getAutoFormatterOptions: undefined,
};

export function ComponentHandlerRegistryProvider({
  children,
  autoFormatterOptions,
}: {
  children: ReactNode;
  /** Optional. Exclude/override auto formatters. */
  autoFormatterOptions?: AutoFormatterProviderOptions;
}) {
  const onItemClickHandlers = React.useRef<Map<string, ItemClickHandler>>(
    new Map()
  );
  const onItemClickPatterns = React.useRef<ItemClickEntry[]>([]);
  const formatterContextEntries = React.useRef<FormatterContextEntry[]>([]);
  const formatters = React.useRef<Map<string, CellFormatter>>(new Map());
  const autoFormatterOptionsRef = React.useRef<
    AutoFormatterProviderOptions | undefined
  >(autoFormatterOptions);

  useEffect(() => {
    autoFormatterOptionsRef.current = autoFormatterOptions;
  }, [autoFormatterOptions]);

  const syncFormattersMap = useCallback(() => {
    formatters.current.clear();
    formatterContextEntries.current.forEach((entry, i) => {
      formatters.current.set(String(i), entry.formatter);
    });
  }, []);

  const registerItemClick = useCallback(
    (inputDataType: string | RegExp, handler: ItemClickHandler) => {
      if (inputDataType instanceof RegExp) {
        onItemClickPatterns.current.push({ pattern: inputDataType, handler });
      } else {
        onItemClickHandlers.current.set(inputDataType, handler);
      }
    },
    []
  );

  const unregisterItemClick = useCallback((inputDataType: string | RegExp) => {
    if (inputDataType instanceof RegExp) {
      onItemClickPatterns.current = onItemClickPatterns.current.filter(
        (entry) =>
          entry.pattern.source !== inputDataType.source ||
          entry.pattern.flags !== inputDataType.flags
      );
    } else {
      onItemClickHandlers.current.delete(inputDataType);
    }
  }, []);

  const getItemClick = useCallback(
    (
      inputDataType: string | null | undefined
    ): ItemClickHandler | undefined => {
      if (!inputDataType) return undefined;

      const exactHandler = onItemClickHandlers.current.get(inputDataType);
      if (exactHandler) {
        logRegistryOperation(
          "success",
          `Found onItemClick handler for inputDataType: ${inputDataType}`
        );
        return exactHandler;
      }

      const patternEntry = onItemClickPatterns.current.find((entry) =>
        entry.pattern.test(inputDataType)
      );
      if (patternEntry) {
        logRegistryOperation(
          "success",
          `Found onItemClick handler by pattern for: ${inputDataType}`
        );
        return patternEntry.handler;
      }

      logRegistryOperation(
        "error",
        `No onItemClick handler found for inputDataType: ${inputDataType}`
      );
      return undefined;
    },
    []
  );

  const getAutoFormatterOptions = useCallback(() => {
    return autoFormatterOptionsRef.current;
  }, []);

  const registerFormatter = useCallback(
    (
      matchers: FormatterContextMatcher,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      const hasAtLeastOne =
        matchers.id !== undefined ||
        matchers.name !== undefined ||
        matchers.dataPath !== undefined;
      if (!hasAtLeastOne) return;
      formatterContextEntries.current.push({
        matchers,
        formatter,
        inputDataType,
      });
      syncFormattersMap();
    },
    [syncFormattersMap]
  );

  const unregisterFormatter = useCallback(
    (matchers: FormatterContextMatcher, inputDataType?: string | RegExp) => {
      formatterContextEntries.current = formatterContextEntries.current.filter(
        (entry) => {
          if (!formatterContextMatchersEqual(entry.matchers, matchers))
            return true;
          if (inputDataType !== undefined)
            return !inputDataTypeMatches(entry.inputDataType, inputDataType);
          return false;
        }
      );
      syncFormattersMap();
    },
    [syncFormattersMap]
  );

  const registerFormatterById = useCallback(
    (
      id: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      registerFormatter({ id }, formatter, inputDataType);
    },
    [registerFormatter]
  );

  const registerFormatterByName = useCallback(
    (
      name: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      registerFormatter({ name }, formatter, inputDataType);
    },
    [registerFormatter]
  );

  const registerFormatterByDataPath = useCallback(
    (
      dataPath: string | RegExp,
      formatter: CellFormatter,
      inputDataType?: string | RegExp
    ) => {
      registerFormatter({ dataPath }, formatter, inputDataType);
    },
    [registerFormatter]
  );

  const unregisterFormatterById = useCallback(
    (id: string | RegExp, inputDataType?: string | RegExp) => {
      unregisterFormatter({ id }, inputDataType);
    },
    [unregisterFormatter]
  );

  const unregisterFormatterByName = useCallback(
    (name: string | RegExp, inputDataType?: string | RegExp) => {
      unregisterFormatter({ name }, inputDataType);
    },
    [unregisterFormatter]
  );

  const unregisterFormatterByDataPath = useCallback(
    (dataPath: string | RegExp, inputDataType?: string | RegExp) => {
      unregisterFormatter({ dataPath }, inputDataType);
    },
    [unregisterFormatter]
  );

  const getFormatter = useCallback(
    (
      id: string | null | undefined,
      context?: FormatterContext
    ): CellFormatter | undefined => {
      if (!id) return undefined;

      const entries = formatterContextEntries.current;
      const withScope: typeof entries = [];
      const withoutScope: typeof entries = [];
      for (const entry of entries) {
        const scopeMatches =
          entry.inputDataType === undefined ||
          (typeof entry.inputDataType === "string"
            ? context?.inputDataType === entry.inputDataType
            : context?.inputDataType != null &&
              entry.inputDataType.test(context.inputDataType));
        if (!scopeMatches) continue;
        if (entry.inputDataType !== undefined) withScope.push(entry);
        else withoutScope.push(entry);
      }
      const orderToTry = context?.inputDataType
        ? [...withScope, ...withoutScope]
        : [...withoutScope, ...withScope];

      for (const entry of orderToTry) {
        const { matchers } = entry;
        let allMatch = true;
        if (matchers.id !== undefined) {
          const valueFromContext = context?.fieldId ?? id;
          if (!matchesContextValue(valueFromContext, matchers.id))
            allMatch = false;
        }
        if (allMatch && matchers.name !== undefined) {
          const value = context?.fieldName ?? id;
          if (!matchesContextValue(value, matchers.name)) allMatch = false;
        }
        if (allMatch && matchers.dataPath !== undefined) {
          const value = context?.dataPath ?? id;
          if (!matchesContextValue(value, matchers.dataPath)) allMatch = false;
        }
        if (allMatch) {
          logRegistryOperation(
            "success",
            `Found formatter by context matcher for: ${id}`
          );
          return entry.formatter;
        }
      }

      logRegistryOperation(
        "error",
        `No formatter found for: ${id}${context?.inputDataType ? ` (with context: ${context.inputDataType})` : ""}`
      );
      return undefined;
    },
    []
  );

  const value: ComponentHandlerRegistry = React.useMemo(
    () => ({
      onItemClickHandlers: onItemClickHandlers.current,
      formatters: formatters.current,
      registerItemClick,
      unregisterItemClick,
      getItemClick,
      registerFormatter,
      unregisterFormatter,
      registerFormatterById,
      registerFormatterByName,
      registerFormatterByDataPath,
      unregisterFormatterById,
      unregisterFormatterByName,
      unregisterFormatterByDataPath,
      getFormatter,
      isActive: () => true,
      getAutoFormatterOptions,
    }),
    [
      registerItemClick,
      unregisterItemClick,
      getItemClick,
      getAutoFormatterOptions,
      registerFormatter,
      unregisterFormatter,
      registerFormatterById,
      registerFormatterByName,
      registerFormatterByDataPath,
      unregisterFormatterById,
      unregisterFormatterByName,
      unregisterFormatterByDataPath,
      getFormatter,
    ]
  );

  return (
    <ComponentHandlerRegistryContext.Provider value={value}>
      {children}
    </ComponentHandlerRegistryContext.Provider>
  );
}

export function useComponentHandlerRegistry(): ComponentHandlerRegistry {
  const context = useContext(ComponentHandlerRegistryContext);
  return context ?? NOOP_REGISTRY;
}
