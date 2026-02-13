import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DynamicComponent from "../../components/DynamicComponents";
import { register } from "../../utils/customComponentRegistry";

describe("DynamicComponent", () => {
  it("should render table component with fields (backwards compatibility)", () => {
    const tableConfig = {
      component: "table",
      title: "Test Table", // Title is ignored in DataViewWrapper (backwards compatibility)
      id: "test-table-id",
      fields: [
        {
          id: "name",
          name: "Name",
          data_path: "user.name",
          data: ["John Doe", "Jane Smith"],
        },
        {
          id: "age",
          name: "Age",
          data_path: "user.age",
          data: [28, 34],
        },
      ],
    };

    render(<DynamicComponent config={tableConfig} />);

    // DataViewWrapper renders the data (backwards compatibility: table -> DataViewWrapper)
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("34")).toBeInTheDocument();
  });

  it("should render one-card component", () => {
    const oneCardConfig = {
      component: "one-card",
      title: "Test Card",
      fields: [
        {
          name: "Field 1",
          data_path: "test.field1",
          data: ["Value 1"],
        },
      ],
    };

    render(<DynamicComponent config={oneCardConfig} />);

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Value 1")).toBeInTheDocument();
  });

  it("should handle empty config", () => {
    const { container } = render(<DynamicComponent config={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it("should handle null config", () => {
    const { container } = render(<DynamicComponent config={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should handle unknown component", () => {
    const unknownConfig = {
      component: "unknown-component",
      title: "Unknown",
    };

    const { container } = render(<DynamicComponent config={unknownConfig} />);
    // Should return null for unknown components
    expect(container.firstChild).toBeNull();
  });

  describe("Hand Build Components (HBC)", () => {
    it("should render registered HBC component with data and id", () => {
      const TestComponent = ({
        data,
        id,
      }: {
        data: { title: string };
        id: string;
      }) => (
        <div data-testid="hbc-component" data-id={id}>
          <h1>{data.title}</h1>
        </div>
      );

      register("test:component", TestComponent);

      const config = {
        component: "test:component",
        id: "test-123",
        data: {
          title: "Test Title",
        },
      };

      render(<DynamicComponent config={config} />);

      const component = screen.getByTestId("hbc-component");
      expect(component).toBeInTheDocument();
      expect(component).toHaveAttribute("data-id", "test-123");
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should pass input_data_type to HBC component when provided", () => {
      const TestComponent = ({
        data,
        id,
        inputDataType,
      }: {
        data: { title: string };
        id: string;
        inputDataType?: string | null;
      }) => (
        <div
          data-testid="hbc-component"
          data-id={id}
          data-type={inputDataType || "default"}
          className={inputDataType ? `type-${inputDataType}` : ""}
        >
          <h1>{data.title}</h1>
          {inputDataType && <span>Type: {inputDataType}</span>}
        </div>
      );

      register("test:component-with-type", TestComponent);

      const config = {
        component: "test:component-with-type",
        id: "test-456",
        input_data_type: "movie",
        data: {
          title: "Avatar",
        },
      };

      render(<DynamicComponent config={config} />);

      const component = screen.getByTestId("hbc-component");
      expect(component).toBeInTheDocument();
      expect(component).toHaveAttribute("data-type", "movie");
      expect(component).toHaveClass("type-movie");
      expect(screen.getByText("Type: movie")).toBeInTheDocument();
    });

    it("should handle HBC component without input_data_type", () => {
      const TestComponent = ({
        data,
        id,
        inputDataType,
      }: {
        data: { title: string };
        id: string;
        inputDataType?: string | null;
      }) => (
        <div
          data-testid="hbc-component"
          data-id={id}
          data-type={inputDataType || "default"}
        >
          <h1>{data.title}</h1>
        </div>
      );

      register("test:component-no-type", TestComponent);

      const config = {
        component: "test:component-no-type",
        id: "test-789",
        data: {
          title: "No Type Component",
        },
      };

      render(<DynamicComponent config={config} />);

      const component = screen.getByTestId("hbc-component");
      expect(component).toBeInTheDocument();
      expect(component).toHaveAttribute("data-type", "default");
      expect(screen.getByText("No Type Component")).toBeInTheDocument();
    });

    it("should handle HBC component with null input_data_type", () => {
      const TestComponent = ({
        data,
        id,
        inputDataType,
      }: {
        data: { title: string };
        id: string;
        inputDataType?: string | null;
      }) => (
        <div
          data-testid="hbc-component"
          data-id={id}
          data-has-type={inputDataType !== null && inputDataType !== undefined}
        >
          <h1>{data.title}</h1>
        </div>
      );

      register("test:component-null-type", TestComponent);

      const config = {
        component: "test:component-null-type",
        id: "test-null",
        input_data_type: null,
        data: {
          title: "Null Type Component",
        },
      };

      render(<DynamicComponent config={config} />);

      const component = screen.getByTestId("hbc-component");
      expect(component).toBeInTheDocument();
      expect(component).toHaveAttribute("data-has-type", "false");
      expect(screen.getByText("Null Type Component")).toBeInTheDocument();
    });
  });
});
