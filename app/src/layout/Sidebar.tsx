import {
  Divider,
  PageSidebar,
  PageSidebarBody,
  Nav,
  NavList,
  NavItem,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";

import { componentRegistry } from "../config/componentRegistry";

export default function Sidebar() {
  // Separate DynamicComponents from other components
  const dynamicComponent = componentRegistry.find((c) => c.id === "dynamic");
  const regularComponents = componentRegistry.filter((c) => c.id !== "dynamic");

  const nav = (
    <Nav aria-label="Main navigation">
      <NavList>
        <NavItem itemId={0}>
          <Link to="/">Home</Link>
        </NavItem>
        {dynamicComponent && (
          <NavItem itemId="dynamic">
            <Link to={dynamicComponent.path}>{dynamicComponent.name}</Link>
          </NavItem>
        )}
        <Divider />
        {regularComponents.map((component, index) => (
          <NavItem key={component.id} itemId={`regular-${index}`}>
            <Link to={component.path}>{component.name}</Link>
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );

  return (
    <PageSidebar>
      <PageSidebarBody>{nav}</PageSidebarBody>
    </PageSidebar>
  );
}
