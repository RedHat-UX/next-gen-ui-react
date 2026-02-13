import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
} from "@local-lib/components/ComponentHandlerRegistry";
import DynamicComponent from "@local-lib/components/DynamicComponents";
import {
  CodeBlock,
  CodeBlockCode,
  ExpandableSection,
  PageSection,
} from "@patternfly/react-core";
import React, { useEffect, useMemo, useState } from "react";

import { podsResourceTableConfig } from "../demo/podsResourceDemoData";

function getConfigSummary(fullConfig: typeof podsResourceTableConfig) {
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

const CPU_BAR_MAX = 100; // millicores, for bar scale
const MEMORY_BAR_MAX = 1024; // Mi, for bar scale

const barCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0,
};

const barTrackStyle: React.CSSProperties = {
  flex: "1 1 80px",
  minWidth: 60,
  height: 8,
  borderRadius: 4,
  backgroundColor: "var(--pf-v6-global--BackgroundColor--200, #f0f0f0)",
  overflow: "hidden",
};

// Font colors similar to OpenShift Lightspeed table
const colorPrimary = "#151515";
const colorSecondary = "#6a6e73";

function PodsResourceRegistrySetup() {
  const registry = useComponentHandlerRegistry();

  useMemo(() => {
    registry.registerFormatterById(
      "pod",
      (value) => (
        <span style={{ color: colorPrimary }}>{String(value ?? "")}</span>
      ),
      "pods-resource"
    );

    registry.registerFormatterById(
      "namespace",
      (value) => (
        <span style={{ color: colorSecondary }}>{String(value ?? "")}</span>
      ),
      "pods-resource"
    );

    registry.registerFormatterById(
      "cpu",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value)) || 0;
        const pct = Math.min(100, (num / CPU_BAR_MAX) * 100);
        return (
          <span style={barCellStyle}>
            <span style={barTrackStyle}>
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: `${pct}%`,
                  backgroundColor: "#0066cc",
                  borderRadius: 4,
                }}
              />
            </span>
            <span
              style={{
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
                color: colorSecondary,
              }}
            >
              {num}m
            </span>
          </span>
        );
      },
      "pods-resource"
    );

    registry.registerFormatterById(
      "memory",
      (value) => {
        const num =
          typeof value === "number" ? value : parseFloat(String(value)) || 0;
        const pct = Math.min(100, (num / MEMORY_BAR_MAX) * 100);
        return (
          <span style={barCellStyle}>
            <span style={barTrackStyle}>
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: `${pct}%`,
                  backgroundColor: "#ec7a08",
                  borderRadius: 4,
                }}
              />
            </span>
            <span
              style={{
                flexShrink: 0,
                fontVariantNumeric: "tabular-nums",
                color: colorSecondary,
              }}
            >
              {num} Mi
            </span>
          </span>
        );
      },
      "pods-resource"
    );
  }, [registry]);

  useEffect(() => {
    return () => {
      registry.unregisterFormatterById("pod", "pods-resource");
      registry.unregisterFormatterById("namespace", "pods-resource");
      registry.unregisterFormatterById("cpu", "pods-resource");
      registry.unregisterFormatterById("memory", "pods-resource");
    };
  }, [registry]);

  return null;
}

export default function PodsResourceDemo() {
  const configSummary = useMemo(
    () => getConfigSummary(podsResourceTableConfig),
    []
  );
  const [configExpanded, setConfigExpanded] = useState(false);
  const [formattersExpanded, setFormattersExpanded] = useState(false);

  return (
    <PageSection isFilled>
      <ComponentHandlerRegistryProvider>
        <PodsResourceRegistrySetup />
        <DynamicComponent config={podsResourceTableConfig} />
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
              <CodeBlockCode>{`// Formatters by field id (inputDataType: "pods-resource")
registry.registerFormatterById("pod", (value) => (
  <span style={{ color: colorPrimary }}>{String(value ?? "")}</span>
), "pods-resource");

registry.registerFormatterById("namespace", (value) => (
  <span style={{ color: colorSecondary }}>{String(value ?? "")}</span>
), "pods-resource");

// CPU: blue horizontal bar (scale 0–100m) + value text e.g. "44m"
registry.registerFormatterById("cpu", (value) => (/* bar + num + "m" */), "pods-resource");

// Memory: orange horizontal bar (scale 0–1024 Mi) + value text e.g. "853 Mi"
registry.registerFormatterById("memory", (value) => (/* bar + num + " Mi" */), "pods-resource");`}</CodeBlockCode>
            </CodeBlock>
          </ExpandableSection>
        </div>
      </ComponentHandlerRegistryProvider>
    </PageSection>
  );
}
