import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
} from "@local-lib/components/ComponentHandlerRegistry";
import DataViewWrapper from "@local-lib/components/DataViewWrapper";
import type { DataViewWrapperProps } from "@local-lib/components/DataViewWrapper";
import OneCardWrapper from "@local-lib/components/OneCardWrapper";
import type { OneCardProps } from "@local-lib/components/OneCardWrapper";
import SetOfCardsWrapper from "@local-lib/components/SetOfCardsWrapper";
import type { SetOfCardsWrapperProps } from "@local-lib/components/SetOfCardsWrapper";
import {
  Alert,
  AlertVariant,
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  Divider,
  ExpandableSection,
  Icon,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PausedIcon,
} from "@patternfly/react-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  registryDemoById,
  registryDemoByName,
  registryDemoByDataPath,
  registryDemoMultiMatch,
  registryDemoItemClick,
  registryDemoPatternMatching,
  registryDemoCssClasses,
  registryDemoBuiltInFormatters,
  registryDemoOneCard,
  registryDemoSetOfCards,
} from "../demo/registryDemoData";

/** Demo example data is one of the three wrapper configs (used for the preview switch). */
type RegistryExampleData =
  | DataViewWrapperProps
  | (OneCardProps & { component: "one-card" })
  | (SetOfCardsWrapperProps & { component: "set-of-cards" });

// Helper function to create a URL-friendly slug from a title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// RegExp ref for pattern-demo formatter (must unregister same reference)
const patternDemoRegexRef = { current: null as RegExp | null };

// Component that registers formatters and handlers
function RegistrySetup() {
  const registry = useComponentHandlerRegistry();
  // After effect cleanup (e.g. React 18 Strict Mode), bump so useMemo re-runs and re-registers
  const [registerTick, setRegisterTick] = useState(0);

  // Register formatters in useMemo so they're available before child components resolve them.
  // Deps include registerTick so that after cleanup (Strict Mode or unmount) we can re-register.
  useMemo(() => {
    // Example 1 (inputDataType "products"): Register by ID — format Product and Status columns
    registry.registerFormatterById(
      "product-name",
      (value) => (
        <strong style={{ color: "#0066cc", fontSize: "1.1em" }}>
          {String(value)}
        </strong>
      ),
      "products"
    );
    registry.registerFormatterById(
      "product-status",
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        const isStopped = status === "Stopped";
        const bg = isRunning ? "#d4edda" : isStopped ? "#e2e3e5" : "#fff3cd";
        const color = isRunning ? "#155724" : isStopped ? "#383d41" : "#856404";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.85em",
              fontWeight: 600,
              backgroundColor: bg,
              color,
            }}
          >
            {status}
          </span>
        );
      },
      "products"
    );

    // Example 2 (inputDataType "servers"): Register by Name — format Status and Price columns
    registry.registerFormatterByName(
      "Status",
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        const isStopped = status === "Stopped";
        let icon;
        let borderColor: string;
        if (isRunning) {
          icon = <CheckCircleIcon />;
          borderColor = "#2d5016";
        } else if (isStopped) {
          icon = <PausedIcon />;
          borderColor = "#6a6e73";
        } else {
          icon = <ExclamationTriangleIcon />;
          borderColor = "#f0ab00";
        }
        return (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              paddingLeft: "8px",
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            {isRunning ? (
              <Icon status="success">{icon}</Icon>
            ) : isStopped ? (
              icon
            ) : (
              <Icon status="warning">{icon}</Icon>
            )}
            <span>{status}</span>
          </span>
        );
      },
      "servers"
    );
    registry.registerFormatterByName(
      "Price",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value));
        return (
          <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num)}
          </span>
        );
      },
      "servers"
    );

    // Example 8 (OneCardWrapper, inputDataType "servers"): Register by ID for Status and Health
    registry.registerFormatterById(
      "server-status",
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        const isStopped = status === "Stopped";
        let icon;
        let borderColor: string;
        if (isRunning) {
          icon = <CheckCircleIcon />;
          borderColor = "#2d5016";
        } else if (isStopped) {
          icon = <PausedIcon />;
          borderColor = "#6a6e73";
        } else {
          icon = <ExclamationTriangleIcon />;
          borderColor = "#f0ab00";
        }
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              paddingLeft: "8px",
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            {isRunning ? (
              <Icon status="success">{icon}</Icon>
            ) : isStopped ? (
              icon
            ) : (
              <Icon status="warning">{icon}</Icon>
            )}
            <span>{status}</span>
          </span>
        );
      },
      "servers"
    );
    registry.registerFormatterById(
      "server-health",
      (value) => {
        const health = String(value).toLowerCase();
        const isHealthy = health === "healthy";
        const bg = isHealthy ? "#d4edda" : "#f8d7da";
        const color = isHealthy ? "#155724" : "#721c24";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.85em",
              fontWeight: 600,
              backgroundColor: bg,
              color,
            }}
          >
            {String(value)}
          </span>
        );
      },
      "servers"
    );

    // Example 10 (SetOfCardsWrapper, inputDataType "servers"): Healthy (boolean) and CPU % with distinct styling
    registry.registerFormatterById(
      "server-healthy",
      (value) => {
        const isHealthy = value === true;
        const bg = isHealthy ? "#d4edda" : "#f8d7da";
        const color = isHealthy ? "#155724" : "#721c24";
        const text = isHealthy ? "Yes" : "No";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "12px",
              fontSize: "0.85em",
              fontWeight: 700,
              backgroundColor: bg,
              color,
              border: `1px solid ${color}`,
            }}
          >
            {text}
          </span>
        );
      },
      "servers"
    );
    registry.registerFormatterById(
      "server-cpu_pct",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value));
        const isLow = num < 50;
        const isHigh = num >= 80;
        const bg = isLow ? "#d4edda" : isHigh ? "#f8d7da" : "#fff3cd";
        const color = isLow ? "#155724" : isHigh ? "#721c24" : "#856404";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 10px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontWeight: 700,
              backgroundColor: bg,
              color,
            }}
          >
            {num.toFixed(1)}%
          </span>
        );
      },
      "servers"
    );

    // Example 3 (inputDataType "inventory"): Register by DataPath — format Price and Category columns (paths that exist in table)
    registry.registerFormatterByDataPath(
      "products.price",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value));
        return (
          <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(num)}
          </span>
        );
      },
      "inventory"
    );
    registry.registerFormatterByDataPath(
      "products.category",
      (value) => (
        <span
          style={{
            fontStyle: "italic",
            color: "#795600",
            backgroundColor: "#fff3cd",
            padding: "2px 8px",
            borderRadius: "4px",
            border: "1px solid #f0ab00",
          }}
        >
          {String(value)}
        </span>
      ),
      "inventory"
    );

    // Example 4 (inputDataType "context-matcher"): registerFormatter with multiple criteria — dataPath /products/ + name "Status" so only Status column is formatted
    registry.registerFormatter(
      { dataPath: /products/, name: "Status" },
      (value) => {
        const status = String(value);
        const isRunning = status === "Running";
        let borderColor = "#6a6e73";
        if (isRunning) borderColor = "#2d5016";
        else if (status === "Maintenance") borderColor = "#f0ab00";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "4px",
              fontWeight: 600,
              borderLeft: `4px solid ${borderColor}`,
              paddingLeft: "8px",
            }}
          >
            {status}
          </span>
        );
      },
      "context-matcher"
    );

    // Example 6 (inputDataType "pattern-demo"): Register by ID with RegExp — match multiple field ids
    patternDemoRegexRef.current = /^product-(name|status)$/;
    registry.registerFormatterById(
      patternDemoRegexRef.current,
      (value) => (
        <span
          style={{
            borderLeft: "3px solid #0066cc",
            paddingLeft: "8px",
            fontWeight: 500,
          }}
        >
          {String(value)}
        </span>
      ),
      "pattern-demo"
    );

    // Example 5: Item click handler
    registry.registerItemClick("catalog", (event, payload) => {
      console.log("Item click handler – full payload:", payload);
      const product = payload.fields["product-name"]?.value ?? "—";
      const status = payload.fields["product-status"]?.value ?? "—";
      const price = payload.fields["product-price"]?.value ?? "—";
      const category = payload.fields["product-category"]?.value ?? "—";
      alert(
        `Item clicked!\n\nProduct: ${product}\nStatus: ${status}\nPrice: ${price}\nCategory: ${category}`
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- registerTick forces re-register after cleanup (Strict Mode)
  }, [registry, registerTick]);

  // Cleanup on unmount (and in React 18 Strict Mode). Schedule re-register so useMemo runs again.
  useEffect(() => {
    return () => {
      registry.unregisterFormatterById("product-name", "products");
      registry.unregisterFormatterById("product-status", "products");
      registry.unregisterFormatterByName("Status", "servers");
      registry.unregisterFormatterByName("Price", "servers");
      registry.unregisterFormatterById("server-status", "servers");
      registry.unregisterFormatterById("server-health", "servers");
      registry.unregisterFormatterById("server-healthy", "servers");
      registry.unregisterFormatterById("server-cpu_pct", "servers");
      registry.unregisterFormatterByDataPath("products.price", "inventory");
      registry.unregisterFormatterByDataPath("products.category", "inventory");
      registry.unregisterFormatter(
        { dataPath: /products/, name: "Status" },
        "context-matcher"
      );
      if (patternDemoRegexRef.current) {
        registry.unregisterFormatterById(
          patternDemoRegexRef.current,
          "pattern-demo"
        );
        patternDemoRegexRef.current = null;
      }
      registry.unregisterItemClick("catalog");
      // Re-run registration after cleanup (React 18 Strict Mode unmounts then remounts)
      setTimeout(() => setRegisterTick((t) => t + 1), 0);
    };
  }, [registry]);

  return null;
}

const examples = [
  {
    title: "Example 1: Register by ID",
    data: registryDemoById,
    description:
      'Formatters are registered by field id. Product and Status columns are formatted; the table is scoped to inputDataType "products" so only those formatters apply.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Register by field id.</strong>{" "}
          <code>registerFormatterById</code> is a convenience for{" "}
          <code>registerFormatter({`{ id }`}, formatter, …)</code>.
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterById("product-name", (value) => (
  <strong>{String(value)}</strong>
), "products");

registry.registerFormatterById("product-status", (value) => (
  <span>{/* status with icon */}</span>
), "products");`}</CodeBlockCode>
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Example 2: Register by Name",
    data: registryDemoByName,
    description:
      'Formatters are registered by field name. Status and Price columns are formatted; the table is scoped to inputDataType "servers" so only those formatters apply.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Register by field name.</strong>{" "}
          <code>registerFormatterByName</code> is a convenience for{" "}
          <code>registerFormatter({`{ name }`}, formatter, …)</code>.
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterByName("Status", (value) => (
  <span>{/* status with icon */}</span>
), "servers");

registry.registerFormatterByName("Price", (value) => (
  <span>{/* currency formatted */}</span>
), "servers");`}</CodeBlockCode>
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Example 3: Register by DataPath",
    data: registryDemoByDataPath,
    description:
      'Formatters are registered by data path (e.g. products.price, products.category). Price and Category columns are formatted; the table is scoped to inputDataType "inventory".',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Register by data path.</strong>{" "}
          <code>registerFormatterByDataPath</code> is a convenience for{" "}
          <code>registerFormatter({`{ dataPath }`}, formatter, …)</code>.
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterByDataPath("products.price", (value) => (
  <span>{/* currency formatted */}</span>
), "inventory");

registry.registerFormatterByDataPath("products.category", (value) => (
  <span>{/* amber badge */}</span>
), "inventory");`}</CodeBlockCode>
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Example 4: registerFormatter (multiple criteria)",
    data: registryDemoMultiMatch,
    description:
      'One formatter matches on both dataPath and name, so only the Status column is formatted. Using dataPath alone would match Product and Status; adding name "Status" narrows the match.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Multiple criteria (dataPath + name).</strong> Use{" "}
          <code>registerFormatter</code> when you need more than one matcher.
          Here, <code>/products/</code> and name <code>"Status"</code> must both
          match, so only the Status column gets the formatter.
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`// dataPath /products/ AND name "Status" → only Status column
registry.registerFormatter(
  { dataPath: /products/, name: "Status" },
  (value) => (
    <span style={{ borderLeft: "4px solid ...", paddingLeft: "8px" }}>
      ${"{" + "String(value)}"}
    </span>
  ),
  "context-matcher"
);`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          Use <code>registerFormatter</code> when a single pattern matches too
          many columns and you want to narrow by combining <code>id</code>,{" "}
          <code>name</code>, or <code>dataPath</code>.
        </Content>
      </>
    ),
  },
  {
    title: "Example 5: Auto formatters",
    data: registryDemoBuiltInFormatters,
    description:
      "When no formatter is registered for a field, the resolver detects the value type and applies an auto formatter (empty, datetime, boolean, number, url).",
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>How to use it:</strong> Wrap your table in{" "}
          <code>ComponentHandlerRegistryProvider</code>. When no formatter is
          found for a field, the resolver uses <code>autoFormatter</code> and
          detects type from each value.
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`import { ComponentHandlerRegistryProvider, DataViewWrapper } from '@rhngui/patternfly-react-renderer';

function MyTable() {
  return (
    <DataViewWrapper
      id="my-table"
      inputDataType="built-in-formatters"
      fields={[
        { id: "col-date", name: "Date", data_path: "row.date", data: ["2025-01-15", "2024-12-31T14:30:00", "2025-06-01"] },
        { id: "col-timestamp", name: "Timestamp", data_path: "row.timestamp", data: [1735689600, 1704067200000, 1743465600] },
        { id: "col-active", name: "Active", data_path: "row.active", data: [true, false, true] },
        { id: "col-count", name: "Count", data_path: "row.count", data: [1234.5, 42_000, 1_000_000] },
        { id: "col-amount", name: "Amount", data_path: "row.amount", data: [99.99, 1250, 0.5] },
        { id: "col-link", name: "Link", data_path: "row.link", data: ["https://example.com/docs", "http://github.com", "https://patternfly.org"] },
        { id: "col-label", name: "Label", data_path: "row.label", data: ["Alpha", "Beta", "Gamma"] },
        { id: "col-notes", name: "Notes", data_path: "row.notes", data: ["Has value", null, ""] },
      ]}
    />
  );
}

function App() {
  return (
    <ComponentHandlerRegistryProvider>
      <MyTable />
    </ComponentHandlerRegistryProvider>
  );
}`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "12px" }}>
          <strong>How it works:</strong> For each cell, the resolver tries the
          registry (data_path, id, name). If none match, it uses{" "}
          <code>autoFormatter</code>, which detects type and applies an auto
          formatter:
        </Content>
        <Content component={ContentVariants.ul} style={{ marginTop: "8px" }}>
          <li>
            null / undefined / empty string → <code>empty</code> (—)
          </li>
          <li>
            ISO date string or Unix timestamp (10/13-digit) →{" "}
            <code>datetime</code>
          </li>
          <li>
            true/false or &quot;true&quot;/&quot;false&quot; →{" "}
            <code>boolean</code> (Yes/No)
          </li>
          <li>
            Other number → <code>number</code> (locale)
          </li>
          <li>
            http/https URL → <code>url</code> (clickable link, opens in new tab)
          </li>
          <li>Other → string as-is</li>
        </Content>
        <Content component={ContentVariants.p} style={{ marginTop: "12px" }}>
          Register custom formatters (e.g.{" "}
          <code>
            registerFormatterById("price", builtInFormatters["currency-usd"])
          </code>
          ) with the registry when you need them for specific fields.
        </Content>
        <Content
          component={ContentVariants.h4}
          style={{ marginTop: "20px", marginBottom: "8px" }}
        >
          Auto formatter options
        </Content>
        <Content component={ContentVariants.p} style={{ marginBottom: "8px" }}>
          You can opt out of specific types or override them by passing{" "}
          <code>autoFormatterOptions</code> to{" "}
          <code>ComponentHandlerRegistryProvider</code>.{" "}
          <strong>exclude</strong> — ids to skip (excluded values render as{" "}
          <code>String(value)</code>). <strong>overrides</strong> — custom
          formatter per type. Valid ids: <code>datetime</code>,{" "}
          <code>boolean</code>, <code>number</code>, <code>url</code>,{" "}
          <code>empty</code>.
        </Content>
        <CodeBlock style={{ marginTop: "8px" }}>
          <CodeBlockCode>{`<ComponentHandlerRegistryProvider
  autoFormatterOptions={{
    exclude: ["boolean"],
    overrides: {
      boolean: (v) => (v ? "Y" : "N"),
    },
  }}
>
  <MyTable />
</ComponentHandlerRegistryProvider>`}</CodeBlockCode>
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Example 6: Item Click Handler",
    data: registryDemoItemClick,
    description:
      'Table has inputDataType="catalog". Same table structure; click any row to see the registered item click handler.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered handler:</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`// payload: { componentId, inputDataType, index, fields } — fields keyed by field.id
registry.registerItemClick("catalog", (event, payload) => {
  console.log("Item click handler – full payload:", payload);
  const product = payload.fields["product-name"]?.value ?? "—";
  const status = payload.fields["product-status"]?.value ?? "—";
  const price = payload.fields["product-price"]?.value ?? "—";
  const category = payload.fields["product-category"]?.value ?? "—";
  alert(\`Item clicked! Product: \${product}, Status: \${status}, Price: \${price}, Category: \${category}\`);
});`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Usage:</strong> The DataViewWrapper with{" "}
          <code>inputDataType: "catalog"</code> is used to resolve the
          registered handler. Click any row to see it in action!
        </Content>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          The first argument can be a string (exact <code>inputDataType</code>)
          or a RegExp to match multiple types (e.g.{" "}
          <code>registerItemClick(/catalog|inventory/, handler)</code>).
        </Content>
      </>
    ),
  },
  {
    title: "Example 7: Pattern matching (RegExp)",
    data: registryDemoPatternMatching,
    description:
      'Matcher values (e.g. in registerFormatterById) can be a RegExp. Any field whose id matches the pattern uses that formatter. This example uses inputDataType="pattern-demo" and a single RegExp to format both Product and Status columns.',
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatter (RegExp by id):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`// Match field ids "product-name" and "product-status" with one pattern
registry.registerFormatterById(
  /^product-(name|status)$/,
  (value) => (
    <span style={{ borderLeft: "3px solid #0066cc", paddingLeft: "8px" }}>
      ${"{" + "String(value)}"}
    </span>
  ),
  "pattern-demo"
);`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          You can use RegExp in <code>id</code>, <code>name</code>, or{" "}
          <code>dataPath</code> matchers. To unregister, pass the same matchers
          (and <code>inputDataType</code> if used) to{" "}
          <code>unregisterFormatter</code>.
        </Content>
      </>
    ),
  },
  {
    title: "Example 8: CSS Classes",
    data: registryDemoCssClasses,
    description:
      "DataViewWrapper automatically adds CSS classes to the table wrapper and to each cell so you can target them in your styles. The wrapper gets a data-type class; each cell gets a field-id class.",
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Auto-generated classes:</strong>
        </Content>
        <Content component={ContentVariants.ul} style={{ marginTop: "8px" }}>
          <li>
            <strong>Wrapper:</strong> <code>data-view-{`{inputDataType}`}</code>{" "}
            — from <code>inputDataType</code>. This example uses{" "}
            <code>inputDataType="table-styling"</code>, so the root div has
            class <code>data-view-table-styling</code>.
          </li>
          <li>
            <strong>Table container:</strong>{" "}
            <code>dataview-table-container</code> — wraps the table for
            horizontal scroll.
          </li>
          <li>
            <strong>Cells:</strong>{" "}
            <code>field-id-{`{fieldId || fieldName}`}</code> — each{" "}
            <code>&lt;td&gt;</code> gets a class from the column&apos;s{" "}
            <code>field.id</code> or field name (sanitized). e.g.{" "}
            <code>field-id-product-name</code>,{" "}
            <code>field-id-product-status</code>.
          </li>
        </Content>
        <Content component={ContentVariants.p} style={{ marginTop: "12px" }}>
          Use these classes in your CSS or CSS-in-JS to style specific data
          types or columns without adding custom props:
        </Content>
        <CodeBlock style={{ marginTop: "8px" }}>
          <CodeBlockCode>{`/* Target this table's wrapper (inputDataType="table-styling") */
.data-view-table-styling {
  border: 1px solid var(--pf-v6-global--BorderColor--100);
}

/* Target a specific column (e.g. Status) */
.field-id-product-status {
  font-weight: 600;
}

/* Combine wrapper + column */
.data-view-table-styling .field-id-product-price {
  text-align: right;
}`}</CodeBlockCode>
        </CodeBlock>
      </>
    ),
  },
  {
    title: "Example 9: OneCardWrapper",
    data: registryDemoOneCard,
    description:
      "Demonstrates that the ComponentHandlerRegistry works with other components too, not just DataViewWrapper. OneCardWrapper can use the same formatters registered in the registry.",
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Registered formatters (shared with DataViewWrapper):</strong>
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`registry.registerFormatterById("server-status", ..., "servers")
registry.registerFormatterById("server-health", ..., "servers")`}</CodeBlockCode>
        </CodeBlock>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Usage:</strong> OneCardWrapper uses the same registry and
          formatter resolution strategies as DataViewWrapper. Formatters are
          automatically resolved by field id, name, or data_path.
        </Content>
        <CodeBlock style={{ marginTop: "8px" }}>
          <CodeBlockCode>{`<OneCardWrapper
  id="registry-demo-onecard"
  title="Server Details"
  inputDataType="servers"
  fields={[
    {
      id: "server-status",
      name: "Status",
      data_path: "servers.status",
      data: ["Running"]
    }
  ]}
/>`}</CodeBlockCode>
        </CodeBlock>
        <Alert
          variant={AlertVariant.info}
          isInline
          title="Cross-Component Formatters"
          style={{ marginTop: "12px" }}
        >
          <Content component={ContentVariants.p}>
            The same formatters registered for DataViewWrapper can be reused in
            OneCardWrapper and other components. This enables consistent
            formatting across your entire application.
          </Content>
        </Alert>
      </>
    ),
  },
  {
    title: "Example 10: SetOfCardsWrapper",
    data: registryDemoSetOfCards,
    description:
      "Set-of-cards forwards input_data_type to each card so registry formatters apply. Status (icon + border), Healthy (Yes/No badge), and CPU % (color-coded) use custom formatters; Last seen uses auto date formatting.",
    strategyDetails: (
      <>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          <strong>Formatters applied:</strong> Status and Health (shared with
          Example 9), plus <code>server-healthy</code> (boolean → Yes/No badge)
          and <code>server-cpu_pct</code> (color by value). SetOfCardsWrapper
          forwards <code>inputDataType</code> / <code>input_data_type</code> to
          each OneCardWrapper. Wrap with{" "}
          <code>ComponentHandlerRegistryProvider</code> and pass{" "}
          <code>input_data_type</code> in config. Each card receives
          inputDataType so formatters match.
        </Content>
        <CodeBlock style={{ marginTop: "8px" }}>
          <CodeBlockCode>{`<SetOfCardsWrapper
  id="registry-demo-setofcards"
  title="Servers (formatted fields)"
  inputDataType="servers"
  fields={[
    { id: "server-status", name: "Status", data_path: "servers.status", data: [...] },
    { id: "server-healthy", name: "Healthy", data_path: "servers.healthy", data: [true, false, true] },
    { id: "server-cpu_pct", name: "CPU %", data_path: "servers.cpu_pct", data: [12.5, 0, 88.2] },
    ...
  ]}
/>`}</CodeBlockCode>
        </CodeBlock>
        <Alert
          variant={AlertVariant.info}
          isInline
          title="One-card and set-of-cards"
          style={{ marginTop: "12px" }}
        >
          <Content component={ContentVariants.p}>
            Formatters apply to data-view, one-card, and set-of-cards. Use the
            same provider and <code>input_data_type</code> (or{" "}
            <code>inputDataType</code>) so values are formatted consistently
            across tables, single cards, and card grids.
          </Content>
        </Alert>
      </>
    ),
  },
];

export default function RegistryDemo() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string | number, boolean>
  >({});
  const exampleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to example when hash is present in URL
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1);
      const element = exampleRefs.current[hash];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [apiExpanded, setApiExpanded] = useState(false);

  return (
    <ComponentHandlerRegistryProvider>
      <style>
        {`
          /* Reduce empty space in collapsed ExpandableSection */
          .config-section-collapsed .pf-v6-c-expandable-section__content {
            padding-block-end: 0 !important;
            min-height: 0 !important;
            max-height: 0 !important;
            overflow: hidden !important;
          }
          .config-section-collapsed .pf-v6-c-expandable-section {
            padding-block-end: 0 !important;
          }
          /* Improve readability */
          .registry-demo-section {
            background-color: #fafafa;
            padding: 20px;
            border-radius: 8px;
            margin: 16px 0;
            border-left: 4px solid #0066cc;
          }
          .registry-demo-api-section {
            background-color: #ffffff;
            padding: 24px;
            border-radius: 8px;
            margin: 16px 0;
            border: 1px solid #d2d2d2;
          }
          .registry-demo-method {
            background-color: #f8f9fa;
            padding: 16px;
            border-radius: 6px;
            margin: 12px 0;
            border-left: 3px solid #0066cc;
          }
          .registry-demo-note {
            background-color: #fff3cd;
            border-left: 4px solid #f0ab00;
            padding: 12px 16px;
            margin: 12px 0;
            border-radius: 4px;
          }
          /* Example 7: demonstrate auto-generated data-view CSS classes */
          #registry-demo-css-classes.data-view-table-styling {
            border: 2px solid #0066cc;
            border-radius: 8px;
            padding: 12px;
          }
          .data-view-table-styling .field-id-product-status {
            font-weight: 600;
          }
          .data-view-table-styling .field-id-product-price {
            text-align: right;
          }
        `}
      </style>
      <RegistrySetup />
      <div className="registry-demo-section">
        <Content
          component={ContentVariants.h1}
          style={{ marginBottom: "16px" }}
        >
          ComponentHandlerRegistry
        </Content>
        <Content
          component={ContentVariants.p}
          style={{ fontSize: "1.1em", lineHeight: "1.6" }}
        >
          The ComponentHandlerRegistry provides a centralized way to register
          and resolve formatters and item click handlers for supported
          components like DataViewWrapper and OneCardWrapper. This enables
          data-aware formatter selection and reusable handler logic across your
          entire application.
        </Content>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      <Content component={ContentVariants.h2} style={{ marginBottom: "16px" }}>
        Quick Start
      </Content>
      <div className="registry-demo-section">
        <Content component={ContentVariants.h3} style={{ marginTop: "0" }}>
          1. Wrap your app with the Provider
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`import { ComponentHandlerRegistryProvider } from '@rhngui/patternfly-react-renderer';

function App() {
  return (
    <ComponentHandlerRegistryProvider>
      {/* Your app content */}
    </ComponentHandlerRegistryProvider>
  );
}`}</CodeBlockCode>
        </CodeBlock>

        <Content component={ContentVariants.h3} style={{ marginTop: "24px" }}>
          2. Register formatters and handlers
        </Content>
        <CodeBlock>
          <CodeBlockCode>{`import { useComponentHandlerRegistry } from '@rhngui/patternfly-react-renderer';

function MyComponent() {
  const registry = useComponentHandlerRegistry();

  useEffect(() => {
    // When no formatter is resolved, type is detected and an auto formatter (empty, datetime, boolean, number, url) is applied.
    // Register formatter by field id
    registry.registerFormatterById('subscriptions-endDate', (value) => {
      return formatDate(value);
    });

    // Register formatter by field name
    registry.registerFormatterByName('End Date', (value) => {
      return formatDate(value);
    });

    // Register formatter by data path
    registry.registerFormatterByDataPath(
      '$..subscriptions[*].endDate',
      (value) => {
        return formatDate(value);
      }
    );

    // Register with inputDataType for data-type specific matching
    registry.registerFormatterById(
      'subscriptions-endDate',
      (value) => formatDate(value),
      'table.dataset'  // Only matches when input_data_type is "table.dataset"
    );

    // Register with regex pattern
    const endDatePattern = /.*-endDate$/;
    registry.registerFormatterById(endDatePattern, (value) => {
      return formatDate(value);
    });

    // Register an item click handler (payload has .fields, .componentId, .inputDataType, .index)
    registry.registerItemClick('catalog', (event, payload) => {
      console.log('Item clicked:', payload);
    });

    // Cleanup on unmount: pass same matchers (and inputDataType if used) as at registration
    return () => {
      registry.unregisterFormatterById('subscriptions-endDate');
      registry.unregisterFormatterById(
        'subscriptions-endDate',
        'table.dataset'
      );
      registry.unregisterFormatterByName('End Date');
      registry.unregisterFormatterByDataPath('$..subscriptions[*].endDate');
      registry.unregisterFormatterById(endDatePattern);
      registry.unregisterItemClick('catalog');
    };
  }, [registry]);

  return <DataViewWrapper
    id="my-table"
    inputDataType="table.dataset"
    fields={[
      {
        id: "subscriptions-endDate",
        name: "End Date",
        data_path: "$..subscriptions[*].endDate",
        data: ["2024-12-24"]
        // Formatter automatically resolved by id/name/data_path
      }
    ]}
  />;
}`}</CodeBlockCode>
        </CodeBlock>
      </div>

      <Divider style={{ margin: "32px 0" }} />

      <Content component={ContentVariants.h2} style={{ marginBottom: "16px" }}>
        Examples
      </Content>

      {examples.map((example, index) => {
        const slug = createSlug(example.title);
        const isExpanded = expandedSections[index] ?? false;

        return (
          <div
            key={index}
            ref={(el) => {
              exampleRefs.current[slug] = el;
            }}
            id={slug}
            style={{ marginBottom: index < examples.length - 1 ? "32px" : 0 }}
          >
            <ExpandableSection
              isExpanded={isExpanded}
              onToggle={() => toggleSection(index)}
              toggleContent={
                <Content component={ContentVariants.h3}>
                  {example.title}
                </Content>
              }
            >
              <Content
                component={ContentVariants.p}
                style={{ marginTop: "16px" }}
              >
                {example.description}
              </Content>

              {example.strategyDetails && (
                <div style={{ marginTop: "16px" }}>
                  {example.strategyDetails}
                </div>
              )}

              <div
                style={{
                  marginTop: "16px",
                  border: "1px solid #d2d2d2",
                  padding: "16px",
                  borderRadius: "4px",
                  backgroundColor: "#fafafa",
                }}
              >
                {(() => {
                  const data = example.data as RegistryExampleData;
                  if (data.component === "one-card") {
                    return <OneCardWrapper {...(data as OneCardProps)} />;
                  }
                  if (data.component === "set-of-cards") {
                    return (
                      <SetOfCardsWrapper
                        {...(data as SetOfCardsWrapperProps)}
                      />
                    );
                  }
                  return (
                    <DataViewWrapper {...(data as DataViewWrapperProps)} />
                  );
                })()}
              </div>

              <div
                style={{ marginTop: 16 }}
                className={
                  expandedSections[`${index}-config`]
                    ? "config-section-expanded"
                    : "config-section-collapsed"
                }
              >
                <ExpandableSection
                  toggleText="Configuration"
                  isExpanded={expandedSections[`${index}-config`] || false}
                  onToggle={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [`${index}-config`]: !prev[`${index}-config`],
                    }))
                  }
                >
                  <CodeBlock>
                    <CodeBlockCode>
                      {JSON.stringify(example.data, null, 2)}
                    </CodeBlockCode>
                  </CodeBlock>
                </ExpandableSection>
              </div>
            </ExpandableSection>
          </div>
        );
      })}

      <Divider style={{ margin: "32px 0" }} />

      <ExpandableSection
        isExpanded={apiExpanded}
        onToggle={() => setApiExpanded(!apiExpanded)}
        toggleContent={
          <Content component={ContentVariants.h2}>API Reference</Content>
        }
      >
        <div className="registry-demo-api-section">
          <Content component={ContentVariants.h3} style={{ marginTop: "0" }}>
            Provider and Hook
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              ComponentHandlerRegistryProvider
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`import { ComponentHandlerRegistryProvider } from '@rhngui/patternfly-react-renderer';

<ComponentHandlerRegistryProvider>
  {/* Your app */}
</ComponentHandlerRegistryProvider>

// Optional: exclude/override auto formatters
<ComponentHandlerRegistryProvider
  autoFormatterOptions={{
    exclude: ["boolean"],
    overrides: { boolean: (v) => (v ? "Y" : "N") },
  }}
>
  <MyTable />
</ComponentHandlerRegistryProvider>`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Wraps your app to provide the registry context. Optional{" "}
              <code>autoFormatterOptions</code>: <code>exclude</code> (ids to
              skip: datetime, boolean, number, url, empty),{" "}
              <code>overrides</code> (custom formatter per id). When no
              formatter is found for a field, the resolver uses the auto
              formatter fallback (or this config).
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              useComponentHandlerRegistry
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`import { useComponentHandlerRegistry } from '@rhngui/patternfly-react-renderer';

const registry = useComponentHandlerRegistry();`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Hook to access the registry instance. Returns a no-op registry if
              used outside of the provider.
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Formatter Registration Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              registerFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.registerFormatter(
  matchers: FormatterContextMatcher,
  formatter: CellFormatter,
  inputDataType?: string | RegExp
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px" }}
            >
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>matchers</code> - Object with one or more of{" "}
                <code>id</code>, <code>name</code>, <code>dataPath</code>{" "}
                (string or RegExp). All provided criteria must match.
              </li>
              <li>
                <code>formatter</code> - Function that takes a value and returns
                a ReactNode
              </li>
              <li>
                <code>inputDataType</code> - Optional (string or RegExp).
                Formatter only matches when input_data_type matches.
              </li>
            </ul>
            <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
              <strong>Convenience:</strong>{" "}
              <code>registerFormatterById(id, formatter, inputDataType?)</code>,{" "}
              <code>
                registerFormatterByName(name, formatter, inputDataType?)
              </code>
              ,{" "}
              <code>
                registerFormatterByDataPath(dataPath, formatter, inputDataType?)
              </code>{" "}
              wrap single-matcher registration. Use{" "}
              <code>unregisterFormatterById</code> / <code>ByName</code> /{" "}
              <code>ByDataPath</code> for cleanup.
            </Content>
            <CodeBlock style={{ marginTop: "12px" }}>
              <CodeBlockCode>{`// Convenience: match by field id
registry.registerFormatterById("product-name", (value) => (
  <strong>{String(value)}</strong>
), "products");

// Convenience: match by field name
registry.registerFormatterByName("Status", (value) => (
  <span>{/* formatted */}</span>
), "servers");

// Convenience: match by data path
registry.registerFormatterByDataPath("products.price", (value) => (
  <span>{/* currency */}</span>
), "inventory");

// Multiple criteria: use registerFormatter(matchers, formatter, inputDataType)
registry.registerFormatter(
  { dataPath: /products/, name: "Status" },
  (value) => <span>{String(value)}</span>,
  "context-matcher"
);

// RegExp in convenience method
registry.registerFormatterById(/.*-endDate$/, (value) => formatDate(value));`}</CodeBlockCode>
            </CodeBlock>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              unregisterFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.unregisterFormatter(
  matchers: FormatterContextMatcher,
  inputDataType?: string | RegExp
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Removes a formatter that was registered with{" "}
              <code>registerFormatter</code>. Pass the same matchers (and{" "}
              <code>inputDataType</code> if used) as at registration.
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Item Click Handler Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              registerItemClick
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.registerItemClick(
  inputDataType: string | RegExp,
  handler: ItemClickHandler
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>inputDataType</code> - String for exact match (e.g.{" "}
                <code>"catalog"</code>) or RegExp to match multiple types.
              </li>
              <li>
                <code>handler</code> - Function called when a row is clicked (or
                activated via keyboard). It receives:
                <ul>
                  <li>
                    <code>event</code> - The React mouse or keyboard event.
                  </li>
                  <li>
                    <code>payload</code> - <code>ItemClickPayload</code>:{" "}
                    <code>componentId</code>, <code>inputDataType</code>,{" "}
                    <code>index</code> (0-based in entire dataset), and{" "}
                    <code>fields</code> (object keyed by <code>field.id</code>,
                    each value <code>ItemDataFieldValue</code> with{" "}
                    <code>id</code>, <code>name</code>, <code>data_path?</code>,{" "}
                    <code>value</code>). Use{" "}
                    <code>payload.fields["my-field-id"]?.value</code> for a
                    column’s value.
                  </li>
                </ul>
              </li>
            </ul>
            <CodeBlock style={{ marginTop: "12px" }}>
              <CodeBlockCode>{`// payload: { componentId, inputDataType, index, fields } — use payload.fields[fieldId].value
// By inputDataType (exact)
registry.registerItemClick("catalog", (event, payload) => {
  const name = payload.fields["product-name"]?.value;
  const status = payload.fields["product-status"]?.value;
  console.log("Item clicked:", name, status);
});

// By RegExp (match multiple types)
registry.registerItemClick(/catalog|inventory/, (event, payload) => {
  console.log("Item clicked:", payload);
});`}</CodeBlockCode>
            </CodeBlock>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              unregisterItemClick
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.unregisterItemClick(
  inputDataType: string | RegExp
): void`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Removes a previously registered item click handler. Pass the same{" "}
              <code>inputDataType</code> (string or RegExp) as at registration.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              getItemClick
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.getItemClick(
  inputDataType: string | null | undefined
): ItemClickHandler | undefined`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Retrieves an item click handler by inputDataType. Lookup order:
              <ol>
                <li>
                  Exact string match for <code>inputDataType</code>
                </li>
                <li>
                  First RegExp pattern that matches <code>inputDataType</code>
                </li>
              </ol>
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Formatter Retrieval Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              getFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.getFormatter(
  id: string | null | undefined,
  context?: FormatterContext
): CellFormatter | undefined`}</CodeBlockCode>
            </CodeBlock>
            <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
              <strong>Parameters:</strong>
            </Content>
            <ul>
              <li>
                <code>id</code> - The identifier to look up (field id, name, or
                data_path)
              </li>
              <li>
                <code>context</code> - Optional context object with:
                <ul>
                  <li>
                    <code>fieldId</code> - The field id
                  </li>
                  <li>
                    <code>fieldName</code> - The field name
                  </li>
                  <li>
                    <code>dataPath</code> - The field data_path
                  </li>
                  <li>
                    <code>inputDataType</code> - The input data type
                  </li>
                  <li>
                    <code>componentId</code> - The component ID
                  </li>
                </ul>
              </li>
            </ul>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Lookup order: <code>data_path</code> → <code>id</code> →{" "}
              <code>name</code>. Each is matched against registered formatters
              (matchers + optional <code>inputDataType</code>). Returns first
              match or <code>undefined</code> (resolver then uses auto formatter
              fallback).
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Utility Methods
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              isActive
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`registry.isActive(): boolean`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Returns <code>true</code> if the registry is active (has a
              provider), <code>false</code> if it's a no-op (used outside
              provider).
            </Content>
          </div>

          <Content component={ContentVariants.h3} style={{ marginTop: "32px" }}>
            Types
          </Content>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              CellFormatter
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`type CellFormatter = (
  value: string | number | boolean | null | (string | number)[]
) => React.ReactNode | string | number;`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Function type for formatting cell values. Receives the cell value
              and returns a ReactNode, string, or number.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              ItemClickHandler
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`interface ItemDataFieldValue {
  id: string;
  name: string;
  data_path?: string;
  value: string | number | boolean | null;
}

interface ItemClickPayload {
  componentId?: string;   // DataViewWrapper id
  inputDataType?: string; // DataViewWrapper inputDataType
  index?: number;         // 0-based index in entire dataset (ignoring search/sort/pagination)
  fields: Record<string, ItemDataFieldValue>;
}

type ItemClickHandler = (
  event: React.MouseEvent | React.KeyboardEvent,
  payload: ItemClickPayload
) => void;`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Function type for handling item click events. First argument: the
              React event. Second argument: <code>payload</code> (
              <code>ItemClickPayload</code>) with <code>componentId</code>,{" "}
              <code>inputDataType</code>, <code>index</code> once, and{" "}
              <code>fields</code> (keyed by <code>field.id</code>, values{" "}
              <code>ItemDataFieldValue</code>). Use{" "}
              <code>payload.fields[fieldId].value</code> for the cell value.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              FormatterContext
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`interface FormatterContext {
  fieldId?: string;
  fieldName?: string;
  dataPath?: string;
  inputDataType?: string;
  componentId?: string;
}`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Context object passed to <code>getFormatter</code> to enable
              data-aware formatter selection.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              FormatterContextMatcher
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`interface FormatterContextMatcher {
  id?: string | RegExp;
  name?: string | RegExp;
  dataPath?: string | RegExp;
}`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              id, name, and/or dataPath (string or RegExp). All provided
              criteria must match.
            </Content>
          </div>

          <div className="registry-demo-method">
            <Content component={ContentVariants.h4} style={{ marginTop: "0" }}>
              AutoFormatterProviderOptions
            </Content>
            <CodeBlock>
              <CodeBlockCode>{`type AutoFormatterIdOption = "datetime" | "boolean" | "number" | "url" | "empty";

interface AutoFormatterProviderOptions {
  exclude?: AutoFormatterIdOption[];
  overrides?: Partial<Record<AutoFormatterIdOption, CellFormatter>>;
}`}</CodeBlockCode>
            </CodeBlock>
            <Content
              component={ContentVariants.p}
              style={{ marginTop: "12px", marginBottom: "0" }}
            >
              Optional provider prop. <code>exclude</code> disables built-in
              auto formatters; <code>overrides</code> replaces them.
            </Content>
          </div>
        </div>
      </ExpandableSection>
    </ComponentHandlerRegistryProvider>
  );
}
