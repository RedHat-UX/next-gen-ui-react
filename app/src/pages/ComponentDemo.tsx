import {
  type ItemClickPayload,
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
} from "@local-lib/components/ComponentHandlerRegistry";
import DataViewWrapper from "@local-lib/components/DataViewWrapper";
import DynamicComponents from "@local-lib/components/DynamicComponents";
import EmptyStateWrapper from "@local-lib/components/EmptyStateWrapper";
import ErrorPlaceholder from "@local-lib/components/ErrorPlaceholder";
import ImageComponent from "@local-lib/components/ImageComponent";
import OneCardWrapper from "@local-lib/components/OneCardWrapper";
import SetOfCardsWrapper from "@local-lib/components/SetOfCardsWrapper";
import VideoPlayerWrapper from "@local-lib/components/VideoPlayerWrapper";
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
  ChartLineIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PausedIcon,
} from "@patternfly/react-icons";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent, KeyboardEvent } from "react";
import { useLocation, useParams } from "react-router-dom";

import { getComponentById } from "../config/componentRegistry";

// Helper function to create a URL-friendly slug from a title
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Lazy load ChartComponent for code-splitting
const ChartComponent = lazy(
  () => import("@local-lib/components/ChartComponent")
);

// Map component IDs to their actual React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  chart: ChartComponent,
  dataview: DataViewWrapper,
  dynamic: DynamicComponents,
  emptystate: EmptyStateWrapper,
  error: ErrorPlaceholder,
  image: ImageComponent,
  onecard: OneCardWrapper,
  setofcards: SetOfCardsWrapper,
  table: DataViewWrapper, // Backwards compatibility: table uses DataViewWrapper
  video: VideoPlayerWrapper,
};

// Component that registers formatters for the Column Formatters example
function FormatterSetup() {
  const registry = useComponentHandlerRegistry();

  useMemo(() => {
    // Register server-status formatter
    registry.registerFormatter({ id: "server-status" }, (value) => {
      const status = String(value);
      const isRunning = status === "Running";
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isRunning ? (
            <Icon status="success">
              <CheckCircleIcon />
            </Icon>
          ) : status === "Stopped" ? (
            <PausedIcon />
          ) : (
            <Icon status="warning">
              <ExclamationTriangleIcon />
            </Icon>
          )}
          {status}
        </span>
      );
    });

    // Register server-health formatter
    registry.registerFormatter({ id: "server-health" }, (value) => {
      const health = String(value).toLowerCase();
      let icon;
      let status: "success" | "warning" | "danger" | undefined;
      if (health === "healthy") {
        icon = <CheckCircleIcon />;
        status = "success";
      } else if (health === "warning") {
        icon = <ExclamationTriangleIcon />;
        status = "warning";
      } else {
        icon = <ExclamationCircleIcon />;
        status = "danger";
      }
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {status ? <Icon status={status}>{icon}</Icon> : icon}
          <span style={{ textTransform: "capitalize" }}>{health}</span>
        </span>
      );
    });

    // Register server-cpu formatter
    registry.registerFormatter({ id: "server-cpu" }, (value) => {
      const cpuStr = String(value);
      const cpuNum = parseInt(cpuStr.replace("%", ""), 10);
      let status: "success" | "warning" | "danger" = "success";
      if (cpuNum > 80) {
        status = "danger";
      } else if (cpuNum > 60) {
        status = "warning";
      }
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon status={status}>
            <ChartLineIcon />
          </Icon>
          {cpuStr}
        </span>
      );
    });
  }, [registry]);

  return null;
}

export default function ComponentDemo() {
  const { componentId } = useParams<{ componentId: string }>();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const exampleRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const config = componentId ? getComponentById(componentId) : null;
  const Component = componentId ? componentMap[componentId] : null;

  // Scroll to example when hash is present in URL
  useEffect(() => {
    if (location.hash && config) {
      const hash = location.hash.substring(1); // Remove the #
      const element = exampleRefs.current[hash];
      if (element) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash, config]);

  if (!componentId) {
    return <div>Component not found</div>;
  }

  if (!config) {
    return (
      <div>
        <Content component={ContentVariants.h3}>Component not found</Content>
        <p>The component "{componentId}" does not exist in the registry.</p>
      </div>
    );
  }

  if (!Component) {
    return (
      <div>
        <Content component={ContentVariants.h3}>Component not mapped</Content>
        <p>
          The component "{componentId}" exists in the registry but is not mapped
          in ComponentDemo.tsx.
        </p>
      </div>
    );
  }

  return (
    <>
      <ComponentHandlerRegistryProvider>
        <FormatterSetup />
        <div>
          {componentId === "dynamic" && (
            <Alert
              variant={AlertVariant.info}
              isInline
              title="Dynamic Component Renderer"
              style={{ marginBottom: 24 }}
            >
              <p>
                The <strong>DynamicComponents</strong> component is a special
                renderer that accepts a configuration object and dynamically
                renders the appropriate component based on the{" "}
                <code>component</code> field in the config. This allows you to
                render any of the available components (charts, data views,
                cards, images, etc.) using a single component with different
                configuration objects.
              </p>
              <p style={{ marginTop: 8, marginBottom: 0 }}>
                This is useful when you have component configurations coming
                from an API or configuration file, and you want to render them
                dynamically without having to conditionally render different
                components in your code.
              </p>
            </Alert>
          )}
          {config.examples.map((example, index) => {
            const exampleSlug = createSlug(example.title);
            const exampleId = `${componentId}-${exampleSlug}`;
            return (
              <div
                key={index}
                id={exampleId}
                ref={(el) => {
                  exampleRefs.current[exampleId] = el;
                }}
              >
                {index > 0 && (
                  <Divider style={{ marginTop: 32, marginBottom: 32 }} />
                )}

                <Content component={ContentVariants.h3}>
                  <a
                    href={`#${exampleId}`}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    {example.title}
                  </a>
                </Content>

                {example.description && (
                  <Content
                    component={ContentVariants.p}
                    style={{ marginTop: 8, marginBottom: 16 }}
                  >
                    {example.description}
                  </Content>
                )}

                {/* Render the component with its data */}
                <Suspense fallback={<div>Loading component...</div>}>
                  <div
                    style={
                      componentId === "chart"
                        ? { maxWidth: "900px", overflow: "visible" }
                        : undefined
                    }
                  >
                    {componentId === "dynamic" ? (
                      <Component
                        config={example.data as Record<string, unknown>}
                      />
                    ) : componentId === "dataview" &&
                      (example.data as Record<string, unknown>).id ===
                        "dataview-item-click" ? (
                      <Component
                        {...(example.data as Record<string, unknown>)}
                        onItemClick={(
                          event: MouseEvent | KeyboardEvent,
                          payload: ItemClickPayload
                        ) => {
                          const itemInfo = Object.entries(payload.fields)
                            .map(([key, field]) => `${key}: ${field.value}`)
                            .join(", ");
                          alert(
                            `Item clicked!\n\nItem data:\n${itemInfo}\n\nCheck the browser console for more details.`
                          );
                          console.log("Item clicked:", {
                            event,
                            payload,
                            timestamp: new Date().toISOString(),
                          });
                        }}
                      />
                    ) : (
                      <Component
                        {...(example.data as Record<string, unknown>)}
                      />
                    )}
                  </div>
                </Suspense>

                {(example.setupDescription || example.setupCode) && (
                  <ExpandableSection
                    toggleText="How this was set up"
                    isExpanded={expandedSections[`${index}-setup`] ?? false}
                    onToggle={() =>
                      setExpandedSections((prev) => ({
                        ...prev,
                        [`${index}-setup`]: !prev[`${index}-setup`],
                      }))
                    }
                    style={{ marginTop: 16 }}
                  >
                    {example.setupDescription && (
                      <Content
                        component={ContentVariants.p}
                        style={{ marginBottom: example.setupCode ? 12 : 0 }}
                      >
                        {example.setupDescription}
                      </Content>
                    )}
                    {example.setupCode && (
                      <CodeBlock>
                        <CodeBlockCode>{example.setupCode}</CodeBlockCode>
                      </CodeBlock>
                    )}
                  </ExpandableSection>
                )}

                <ExpandableSection
                  toggleText="Configuration"
                  isExpanded={expandedSections[index] || false}
                  onToggle={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  style={{ marginTop: 16 }}
                >
                  <CodeBlock>
                    <CodeBlockCode>
                      {JSON.stringify(example.data, null, 2)}
                    </CodeBlockCode>
                  </CodeBlock>
                </ExpandableSection>
              </div>
            );
          })}
        </div>
      </ComponentHandlerRegistryProvider>
    </>
  );
}
