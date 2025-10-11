// Import minimal PatternFly CSS (no-reset version is smaller)
import "@patternfly/react-core/dist/styles/base-no-reset.css";
import "../global.css";

import { cloneElement, isValidElement, useState } from "react";

import { componentsMap } from "../constants/componentsMap";


interface IProps {
  config: any;
  customProps?: Record<
    string,
    Record<string, any | ((...args: any[]) => void)>
  >;
}

const DynamicComponent = ({ config, customProps = {} }: IProps) => {
  const [customData, setCustomData] = useState(null);

  if (!config || Object.keys(config).length === 0) {
    console.error("Config is empty");
    return null;
  }

  const componentKey = config?.key || config?.component;

  const parseProps = (props?: Record<string, any>) => {
    const newProps = { ...props };

    if (componentKey && customProps[componentKey]) {
      Object.entries(customProps[componentKey]).forEach(([key, value]) => {
        if (typeof value === "function") {
          newProps[key] = (...args: any[]) =>
            value(...args, {
              componentKey,
              // config,
              customData,
            });
        } else if (isValidElement(value)) {
          newProps[key] = cloneElement(value, {
            onClick: (event: any) =>
              value.props.onClick?.(event, {
                componentKey,
                // config,
                customData,
              }),
          });
        } else if (Array.isArray(value) && value.every(isValidElement)) {
          newProps[key] = value.map((element) =>
            cloneElement(element, {
              onClick: (event: any) =>
                element.props.onClick?.(event, {
                  componentKey,
                  // config,
                  customData,
                }),
            })
          );
        } else {
          newProps[key] = value;
        }
      });
    }

    newProps.customProps = customProps;
    newProps.setCustomData = setCustomData;

    if (Array.isArray(newProps.actions)) {
      newProps.actions = newProps.actions.map((action) => ({
        ...action,
        onClick:
          typeof action.onClick === "string"
            ? new Function("event", action.onClick)
            : action.onClick,
      }));
    }

    if (typeof newProps.onRowSelect === "string") {
      newProps.onRowSelect = new Function("data", newProps.onRowSelect);
    }

    return newProps;
  };

  // Check if component exists in componentsMap
  const Component = componentsMap[config?.component];
  
  if (!Component) {
    // Return null for unknown components instead of throwing an error
    console.warn(`Component "${config?.component}" is not available in the React package. Available components: ${Object.keys(componentsMap).join(', ')}`);
    return null;
  }
  
  const newProps = parseProps(config?.props || config);

  return (
    <Component {...newProps}>
      {Array.isArray(config?.children)
        ? config?.children.map((child, index) => (
            <DynamicComponent
              config={child}
              key={(child.key || child.component || index) + index}
              customProps={customProps}
            />
          ))
        : config?.children}
    </Component>
  );
};

export default DynamicComponent;
