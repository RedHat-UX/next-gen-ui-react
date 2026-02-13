import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
} from "@local-lib/components/ComponentHandlerRegistry";
import DataViewWrapper from "@local-lib/components/DataViewWrapper";
import { builtInFormatters } from "@local-lib/utils/builtInFormatters";
import {
  CodeBlock,
  CodeBlockCode,
  Content,
  ContentVariants,
  ExpandableSection,
  Icon,
  PageSection,
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PausedIcon,
} from "@patternfly/react-icons";
import React, { useMemo, useRef, useState } from "react";

const ROW_COUNT = 2000;

const STATUSES = ["Running", "Stopped", "Maintenance"] as const;

const SAMPLE_URLS = [
  "https://example.com/docs",
  "http://github.com/repo",
  "https://patternfly.org",
  "https://www.redhat.com",
  "https://developer.mozilla.org",
];

function buildPerformanceData() {
  const ids = Array.from({ length: ROW_COUNT }, (_, i) => i + 1);
  const dates: string[] = [];
  const counts: number[] = [];
  const amounts: number[] = [];
  const labels: string[] = [];
  const empties: (string | null)[] = [];
  const statuses: string[] = [];
  const enabled: boolean[] = [];
  const quantities: number[] = [];
  const prices: number[] = [];
  const rates: number[] = [];
  const links: string[] = [];

  const startDate = new Date("2024-01-01").getTime();
  const endDate = new Date("2025-02-01").getTime();
  const span = endDate - startDate;

  for (let i = 0; i < ROW_COUNT; i++) {
    const t = startDate + (span * i) / ROW_COUNT;
    dates.push(new Date(t).toISOString().slice(0, 19));
    counts.push(Math.floor(Math.random() * 10000));
    amounts.push(Math.round(Math.random() * 1000 * 100) / 100);
    labels.push(`Item ${i + 1}`);
    empties.push(i % 5 === 0 ? null : i % 7 === 0 ? "" : "—");
    statuses.push(STATUSES[i % STATUSES.length]);
    enabled.push(i % 3 !== 0);
    quantities.push(Math.floor(Math.random() * 90000) + 1000);
    prices.push(Math.round(Math.random() * 200 * 100) / 100);
    rates.push(Math.round(Math.random() * 100) / 100);
    links.push(SAMPLE_URLS[i % SAMPLE_URLS.length]);
  }

  return {
    id: "performance-demo-table",
    component: "data-view" as const,
    inputDataType: "performance-demo",
    title: "Large table (performance)",
    perPage: 50,
    enableFilters: true,
    enablePagination: true,
    enableSort: true,
    fields: [
      {
        id: "perf-id",
        name: "Id",
        data_path: "row.id",
        data: ids,
      },
      {
        id: "perf-date",
        name: "Date",
        data_path: "row.date",
        data: dates,
      },
      {
        id: "perf-count",
        name: "Count",
        data_path: "row.count",
        data: counts,
      },
      {
        id: "perf-amount",
        name: "Amount",
        data_path: "row.amount",
        data: amounts,
      },
      {
        id: "perf-label",
        name: "Label",
        data_path: "row.label",
        data: labels,
      },
      {
        id: "perf-link",
        name: "Link",
        data_path: "row.link",
        data: links,
      },
      {
        id: "perf-empty",
        name: "Empty",
        data_path: "row.empty",
        data: empties,
      },
      {
        id: "perf-status",
        name: "Status",
        data_path: "row.status",
        data: statuses,
      },
      {
        id: "perf-enabled",
        name: "Enabled",
        data_path: "row.enabled",
        data: enabled,
      },
      {
        id: "perf-quantity",
        name: "Quantity",
        data_path: "row.quantity",
        data: quantities,
      },
      {
        id: "perf-price",
        name: "Price",
        data_path: "row.price",
        data: prices,
      },
      {
        id: "perf-rate",
        name: "Rate",
        data_path: "row.rate",
        data: rates,
      },
    ],
  };
}

function PerformanceSetup() {
  const registry = useComponentHandlerRegistry();
  const registeredRef = useRef(false);

  useMemo(() => {
    if (registeredRef.current) return;
    registeredRef.current = true;

    registry.registerFormatterById("perf-id", (value) => (
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.9em",
          padding: "2px 8px",
          borderRadius: "6px",
          backgroundColor: "#f0f0f0",
          color: "#363636",
        }}
      >
        #{value}
      </span>
    ));

    registry.registerFormatterById("perf-amount", (value) => {
      const num = typeof value === "number" ? value : parseFloat(String(value));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
      return (
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 600,
            color: "#0066cc",
          }}
        >
          ${formatted}
        </span>
      );
    });

    registry.registerFormatterById("perf-count", (value) => (
      <span
        style={{
          fontFamily: "monospace",
          textAlign: "right",
          display: "inline-block",
          width: "100%",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {new Intl.NumberFormat("en-US").format(Number(value))}
      </span>
    ));

    registry.registerFormatterById(
      "perf-price",
      builtInFormatters["currency-usd"]
    );
    registry.registerFormatterById("perf-rate", builtInFormatters.percent);

    registry.registerFormatterById("perf-status", (value) => {
      const s = String(value);
      const isRunning = s === "Running";
      const isStopped = s === "Stopped";
      const icon = isRunning ? (
        <Icon status="success">
          <CheckCircleIcon />
        </Icon>
      ) : isStopped ? (
        <PausedIcon />
      ) : (
        <Icon status="warning">
          <ExclamationTriangleIcon />
        </Icon>
      );
      const color = isRunning ? "#2d5016" : isStopped ? "#6a6e73" : "#795600";
      const bg = isRunning ? "#d4edda" : isStopped ? "#e2e3e5" : "#fff3cd";
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "0.85em",
            fontWeight: 600,
            backgroundColor: bg,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {icon}
          {s}
        </span>
      );
    });

    registry.registerItemClick("performance-demo", (_event, payload) => {
      console.log("Item clicked:", payload);
    });
  }, [registry]);

  return null;
}

function getConfigSummary(fullConfig: ReturnType<typeof buildPerformanceData>) {
  const sampleSize = 2;
  return {
    component: fullConfig.component,
    id: fullConfig.id,
    inputDataType: fullConfig.inputDataType,
    perPage: fullConfig.perPage,
    enableFilters: fullConfig.enableFilters,
    enablePagination: fullConfig.enablePagination,
    enableSort: fullConfig.enableSort,
    fields: fullConfig.fields.map((f) => ({
      id: f.id,
      name: f.name,
      data_path: f.data_path,
      data:
        f.data.length > sampleSize
          ? [
              ...f.data.slice(0, sampleSize),
              `... (${f.data.length - sampleSize} more)`,
            ]
          : f.data,
    })),
  };
}

export default function PerformanceDemo() {
  const tableConfig = useMemo(() => buildPerformanceData(), []);
  const configSummary = useMemo(
    () => getConfigSummary(tableConfig),
    [tableConfig]
  );
  const [configExpanded, setConfigExpanded] = useState(false);
  const [formattersExpanded, setFormattersExpanded] = useState(false);

  return (
    <>
      <PageSection>
        <Content component={ContentVariants.p}>
          Large data-view table with {ROW_COUNT} rows and 12 columns to test
          performance. When a row is clicked, the handler received payload is
          output to the browser console. Formatter per column (left to right):
        </Content>
        <Content component={ContentVariants.ul} style={{ marginTop: "8px" }}>
          <li>
            <strong>Id</strong> — custom
          </li>
          <li>
            <strong>Date</strong> — auto (datetime)
          </li>
          <li>
            <strong>Count</strong> — custom
          </li>
          <li>
            <strong>Amount</strong> — custom
          </li>
          <li>
            <strong>Label</strong> — auto (string)
          </li>
          <li>
            <strong>Link</strong> — auto (url, clickable)
          </li>
          <li>
            <strong>Empty</strong> — auto (empty)
          </li>
          <li>
            <strong>Status</strong> — custom
          </li>
          <li>
            <strong>Enabled</strong> — auto (boolean)
          </li>
          <li>
            <strong>Quantity</strong> — auto (number)
          </li>
          <li>
            <strong>Price</strong> — built-in (currency-usd)
          </li>
          <li>
            <strong>Rate</strong> — built-in (percent)
          </li>
        </Content>
        <Content component={ContentVariants.p} style={{ marginTop: "8px" }}>
          Formatter resolution runs per cell.
        </Content>
      </PageSection>
      <PageSection>
        <ComponentHandlerRegistryProvider>
          <PerformanceSetup />
          <DataViewWrapper
            component="data-view"
            id={tableConfig.id}
            fields={tableConfig.fields}
            inputDataType={tableConfig.inputDataType}
            perPage={tableConfig.perPage}
            enableFilters={tableConfig.enableFilters}
            enablePagination={tableConfig.enablePagination}
            enableSort={tableConfig.enableSort}
          />
          <div style={{ marginTop: "1rem" }}>
            <ExpandableSection
              toggleText="Configuration"
              isExpanded={configExpanded}
              onToggle={() => setConfigExpanded(!configExpanded)}
            >
              <CodeBlock>
                <CodeBlockCode>
                  {JSON.stringify(configSummary, null, 2)}
                </CodeBlockCode>
              </CodeBlock>
            </ExpandableSection>
            <ExpandableSection
              toggleText="Registered formatters"
              isExpanded={formattersExpanded}
              onToggle={() => setFormattersExpanded(!formattersExpanded)}
            >
              <CodeBlock>
                <CodeBlockCode>{`// Custom formatters (by field id)
registry.registerFormatterById("perf-id", (value) => <span>#\${value}</span>);
registry.registerFormatterById("perf-amount", (value) => ...);  // $ + locale number
registry.registerFormatterById("perf-count", (value) => ...);    // tabular number
registry.registerFormatterById("perf-price", builtInFormatters["currency-usd"]);
registry.registerFormatterById("perf-rate", builtInFormatters.percent);
registry.registerFormatterById("perf-status", (value) => ...);  // badge + icon

// No formatter registered → auto by type: Date (datetime), Enabled (boolean),
// Quantity (number), Label (string), Link (url), Empty (empty)`}</CodeBlockCode>
              </CodeBlock>
            </ExpandableSection>
          </div>
        </ComponentHandlerRegistryProvider>
      </PageSection>
    </>
  );
}
