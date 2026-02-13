import {
  Button,
  Content,
  ContentVariants,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Page,
  PageSection,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  CodeIcon,
  GithubIcon,
  MoonIcon,
  SunIcon,
} from "@patternfly/react-icons";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { getComponentByPath } from "./config/componentRegistry";
import Sidebar from "./layout/Sidebar";
import ComponentDemo from "./pages/ComponentDemo";
import HandBuildComponentsDemo from "./pages/HandBuildComponentsDemo";
import Home from "./pages/Home";
import PerformanceDemo from "./pages/PerformanceDemo";
import PodsResourceDemo from "./pages/PodsResourceDemo";
import RegistryDemo from "./pages/RegistryDemo";

function AppContent() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("pf-v6-theme-dark");
    } else {
      document.documentElement.classList.remove("pf-v6-theme-dark");
    }
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getPageTitle = () => {
    if (location.pathname === "/performance") return "HandlerRegistry demo";
    if (location.pathname === "/pods-resource") return "Pods Resource Usage";
    const component = getComponentByPath(location.pathname);
    return component?.name || "Home";
  };

  const getSourceCodeUrl = () => {
    const component = getComponentByPath(location.pathname);
    return component?.sourceUrl;
  };

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton isHamburgerButton aria-label="Global navigation" />
        </MastheadToggle>
        <MastheadBrand>
          <div style={{ paddingLeft: 8, paddingTop: 3 }}>
            <Content component={ContentVariants.h1}>
              Next Gen UI - Component Demo
            </Content>
          </div>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isStatic>
          <ToolbarContent>
            <ToolbarGroup
              variant="action-group-plain"
              align={{ default: "alignEnd" }}
              gap={{ default: "gapNone", md: "gapMd" }}
            >
              <ToolbarItem>
                <Button
                  variant="plain"
                  onClick={toggleDarkMode}
                  aria-label={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDarkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  variant="plain"
                  component="a"
                  href="https://github.com/RedHat-UX/next-gen-ui-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                >
                  <GithubIcon />
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );

  const mainContainerId = "main-content";

  return (
    <Page
      masthead={masthead}
      sidebar={<Sidebar />}
      mainContainerId={mainContainerId}
      isManagedSidebar
      defaultManagedSidebarIsOpen
      additionalGroupedContent={
        <PageSection isWidthLimited aria-labelledby="main-title">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              minHeight: "48px",
            }}
          >
            <Content
              component={ContentVariants.h1}
              id="main-title"
              style={{ margin: 0 }}
            >
              {getPageTitle()}
            </Content>
            {getSourceCodeUrl() && (
              <Button
                component="a"
                href={getSourceCodeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                variant="link"
                icon={<CodeIcon />}
              >
                View Source
              </Button>
            )}
          </div>
        </PageSection>
      }
    >
      <PageSection aria-label="Main">
        <div id={mainContainerId} tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/demo/hand-build-components"
              element={<HandBuildComponentsDemo />}
            />
            <Route path="/performance" element={<PerformanceDemo />} />
            <Route path="/component/registry" element={<RegistryDemo />} />
            <Route path="/pods-resource" element={<PodsResourceDemo />} />
            <Route path="/component/:componentId" element={<ComponentDemo />} />
          </Routes>
        </div>
      </PageSection>
    </Page>
  );
}

export default function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  );
}
