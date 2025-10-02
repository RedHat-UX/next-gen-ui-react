import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DynamicComponent from "../../components/DynamicComponents";

describe("DynamicComponent", () => {
  it("should render table component with fields", () => {
    const tableConfig = {
      component: "table",
      title: "Test Table",
      id: "test-table-id",
      fields: [
        {
          name: "Name",
          data_path: "user.name",
          data: ["John Doe", "Jane Smith"],
        },
        {
          name: "Age",
          data_path: "user.age",
          data: [28, 34],
        },
      ],
    };

    render(<DynamicComponent config={tableConfig} />);

    // Check that the title appears in the table caption
    const tableCaption = screen.getByRole("grid").querySelector("caption");
    expect(tableCaption).toHaveTextContent("Test Table");

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

    render(<DynamicComponent config={unknownConfig} />);
    // Should render FragmentWrapper (empty fragment)
    expect(screen.queryByText("Unknown")).not.toBeInTheDocument();
  });
});
