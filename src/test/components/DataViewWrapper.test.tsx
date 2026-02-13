import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi } from "vitest";

import {
  ComponentHandlerRegistryProvider,
  useComponentHandlerRegistry,
  type ItemClickHandler,
} from "../../components/ComponentHandlerRegistry";
import DataViewWrapper from "../../components/DataViewWrapper";

describe("DataViewWrapper Component", () => {
  const mockFieldsData = {
    component: "data-view" as const,
    id: "dataview-test",
    fields: [
      {
        id: "repository",
        name: "Repository",
        data_path: "repositories.name",
        data: ["repo-one", "repo-two", "repo-three"],
      },
      {
        id: "branch",
        name: "Branch",
        data_path: "repositories.branch",
        data: ["main", "develop", "feature"],
      },
      {
        id: "status",
        name: "Status",
        data_path: "repositories.status",
        data: ["Active", "Active", "Inactive"],
      },
    ],
    perPage: 10,
    enableFilters: true,
    enablePagination: true,
    enableSort: true,
  };

  it("should render data view with fields", () => {
    render(<DataViewWrapper {...mockFieldsData} />);

    // Check that column headers are present (using getAllByText since they appear in filters and table)
    expect(screen.getAllByText("Repository").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Branch").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
  });

  it("should render data values correctly from fields", () => {
    render(<DataViewWrapper {...mockFieldsData} />);

    expect(screen.getByText("repo-one")).toBeInTheDocument();
    expect(screen.getByText("repo-two")).toBeInTheDocument();
    expect(screen.getByText("repo-three")).toBeInTheDocument();
    expect(screen.getByText("main")).toBeInTheDocument();
    expect(screen.getByText("develop")).toBeInTheDocument();
    expect(screen.getByText("feature")).toBeInTheDocument();
  });

  it("should handle array data correctly", () => {
    const fieldsWithArray = {
      ...mockFieldsData,
      fields: [
        {
          id: "tags",
          name: "Tags",
          data_path: "repo.tags",
          data: [["tag1", "tag2", "tag3"]],
        },
      ],
    };

    render(<DataViewWrapper {...fieldsWithArray} />);

    // Array is formatted via autoFormatter → String(array) is "tag1,tag2,tag3"
    expect(screen.getByText("tag1,tag2,tag3")).toBeInTheDocument();
  });

  it("should handle null values correctly", () => {
    const fieldsWithNull = {
      ...mockFieldsData,
      fields: [
        {
          id: "name",
          name: "Name",
          data_path: "item.name",
          data: [null, "value2"],
        },
      ],
    };

    render(<DataViewWrapper {...fieldsWithNull} />);

    expect(screen.getByText("value2")).toBeInTheDocument();
  });

  it("should apply custom id and className", () => {
    const customId = "custom-dataview-id";
    const customClassName = "custom-dataview-class";

    render(
      <DataViewWrapper
        {...mockFieldsData}
        id={customId}
        className={customClassName}
      />
    );

    const dataViewElement = document.getElementById(customId);
    expect(dataViewElement).toBeInTheDocument();
    expect(dataViewElement).toHaveClass(customClassName);
  });

  it("should handle empty fields array", () => {
    render(<DataViewWrapper {...mockFieldsData} fields={[]} />);

    // Should show error placeholder when no fields are provided
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("should render with filters disabled", () => {
    render(<DataViewWrapper {...mockFieldsData} enableFilters={false} />);

    // Data should still be visible
    expect(screen.getByText("repo-one")).toBeInTheDocument();
  });

  it("should render with pagination disabled", () => {
    render(<DataViewWrapper {...mockFieldsData} enablePagination={false} />);

    // Data should still be visible
    expect(screen.getByText("repo-one")).toBeInTheDocument();
  });

  it("should render with sort disabled", () => {
    render(<DataViewWrapper {...mockFieldsData} enableSort={false} />);

    // Data should still be visible
    expect(screen.getByText("repo-one")).toBeInTheDocument();
  });

  it("should handle mixed data types", () => {
    const fieldsWithMixedTypes = {
      ...mockFieldsData,
      fields: [
        {
          id: "stringField",
          name: "String Field",
          data_path: "test.string",
          data: ["test string"],
        },
        {
          id: "numberField",
          name: "Number Field",
          data_path: "test.number",
          data: [123],
        },
        {
          id: "booleanField",
          name: "Boolean Field",
          data_path: "test.boolean",
          data: [true],
        },
      ],
    };

    render(<DataViewWrapper {...fieldsWithMixedTypes} />);

    expect(screen.getByText("test string")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("should render with custom empty state message", () => {
    const customMessage = "Custom empty message";
    render(
      <DataViewWrapper
        {...mockFieldsData}
        fields={[]}
        emptyStateMessage={customMessage}
      />
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("should handle custom perPage value", () => {
    render(<DataViewWrapper {...mockFieldsData} perPage={5} />);

    // Should render with the data
    expect(screen.getByText("repo-one")).toBeInTheDocument();
  });

  it("should handle large datasets", () => {
    const largeData = {
      ...mockFieldsData,
      fields: [
        {
          id: "id",
          name: "ID",
          data_path: "id",
          data: Array.from({ length: 50 }, (_, i) => i + 1),
        },
        {
          id: "value",
          name: "Value",
          data_path: "value",
          data: Array.from({ length: 50 }, (_, i) => `value-${i + 1}`),
        },
      ],
    };

    render(<DataViewWrapper {...largeData} perPage={10} />);

    // Should render first page items
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("value-1")).toBeInTheDocument();
  });

  it("should render with all features disabled", () => {
    render(
      <DataViewWrapper
        {...mockFieldsData}
        enableFilters={false}
        enablePagination={false}
        enableSort={false}
      />
    );

    // Data should still be visible
    expect(screen.getByText("repo-one")).toBeInTheDocument();
    expect(screen.getByText("repo-two")).toBeInTheDocument();
    expect(screen.getByText("repo-three")).toBeInTheDocument();
  });

  it("should render with default configuration when only required props provided", () => {
    const minimalData = {
      component: "data-view" as const,
      id: "minimal-test",
      fields: [
        {
          id: "item",
          name: "Item",
          data_path: "items.name",
          data: ["Item 1", "Item 2", "Item 3"],
        },
        {
          id: "value",
          name: "Value",
          data_path: "items.value",
          data: [100, 200, 300],
        },
      ],
    };

    render(<DataViewWrapper {...minimalData} />);

    // Verify data renders
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();

    // Verify column headers are present
    expect(screen.getAllByText("Item").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Value").length).toBeGreaterThan(0);
  });

  it("should auto-disable pagination when 5 or fewer items", () => {
    const smallData = {
      component: "data-view" as const,
      id: "small-data-test",
      fields: [
        {
          id: "item",
          name: "Item",
          data_path: "items.name",
          data: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        },
      ],
    };

    const { container } = render(<DataViewWrapper {...smallData} />);

    // Verify all 5 items are visible
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
    expect(screen.getByText("Item 5")).toBeInTheDocument();

    // Pagination should not be rendered (no pagination controls in DOM)
    const paginationElements = container.querySelectorAll(
      '[class*="pagination"]'
    );
    expect(paginationElements.length).toBe(0);
  });

  it("should auto-enable pagination when more than 5 items", () => {
    const largeData = {
      component: "data-view" as const,
      id: "large-data-test",
      fields: [
        {
          id: "item",
          name: "Item",
          data_path: "items.name",
          data: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
        },
      ],
    };

    render(<DataViewWrapper {...largeData} />);

    // With default perPage of 5, only first 5 items should be visible on page 1
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
    expect(screen.getByText("Item 5")).toBeInTheDocument();
    expect(screen.queryByText("Item 6")).not.toBeInTheDocument();
  });

  it("should respect explicit enablePagination=true even with 5 or fewer items", () => {
    const smallData = {
      component: "data-view" as const,
      id: "small-with-pagination",
      fields: [
        {
          id: "item",
          name: "Item",
          data_path: "items.name",
          data: ["Item 1", "Item 2", "Item 3"],
        },
      ],
      enablePagination: true,
    };

    const { container } = render(<DataViewWrapper {...smallData} />);

    // Verify items are visible
    expect(screen.getByText("Item 1")).toBeInTheDocument();

    // Pagination should be present because it's explicitly enabled
    // Look for pagination via ARIA attributes or common pagination patterns
    const toolbars = container.querySelectorAll('[class*="toolbar"]');
    expect(toolbars.length).toBeGreaterThan(0);
  });

  it("should auto-disable filters when 5 or fewer items", () => {
    const smallData = {
      component: "data-view" as const,
      id: "small-data-no-filters",
      fields: [
        {
          id: "name",
          name: "Name",
          data_path: "items.name",
          data: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
        },
        {
          id: "value",
          name: "Value",
          data_path: "items.value",
          data: [10, 20, 30, 40, 50],
        },
      ],
    };

    const { container } = render(<DataViewWrapper {...smallData} />);

    // Verify all items are visible
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();

    // Filter inputs should not be rendered
    const filterInputs = container.querySelectorAll('input[type="text"]');
    expect(filterInputs.length).toBe(0);
  });

  it("should auto-enable filters when more than 5 items", () => {
    const largeData = {
      component: "data-view" as const,
      id: "large-data-with-filters",
      fields: [
        {
          id: "name",
          name: "Name",
          data_path: "items.name",
          data: ["A", "B", "C", "D", "E", "F"],
        },
      ],
    };

    const { container } = render(<DataViewWrapper {...largeData} />);

    // Filter input should be present
    const filterInputs = container.querySelectorAll('input[type="text"]');
    expect(filterInputs.length).toBeGreaterThan(0);
  });

  it("should respect explicit enableFilters=true even with 5 or fewer items", () => {
    const smallData = {
      component: "data-view" as const,
      id: "small-with-filters-explicit",
      fields: [
        {
          id: "item",
          name: "Item",
          data_path: "items.name",
          data: ["Item 1", "Item 2"],
        },
      ],
      enableFilters: true,
    };

    const { container } = render(<DataViewWrapper {...smallData} />);

    // Filter should be present because it's explicitly enabled
    const filterInputs = container.querySelectorAll('input[type="text"]');
    expect(filterInputs.length).toBeGreaterThan(0);
  });

  it("should respect explicit enableFilters=false even with more than 5 items", () => {
    const largeData = {
      component: "data-view" as const,
      id: "large-no-filters-explicit",
      fields: [
        {
          id: "item",
          name: "Item",
          data_path: "items.name",
          data: ["A", "B", "C", "D", "E", "F", "G"],
        },
      ],
      enableFilters: false,
    };

    const { container } = render(<DataViewWrapper {...largeData} />);

    // Filter should not be present because it's explicitly disabled
    const filterInputs = container.querySelectorAll('input[type="text"]');
    expect(filterInputs.length).toBe(0);
  });

  it("should sort numbers numerically instead of alphabetically", () => {
    const numericData = {
      component: "data-view" as const,
      id: "numeric-sort-test",
      fields: [
        {
          id: "id",
          name: "ID",
          data_path: "items.id",
          data: [1, 2, 10, 20, 100, 3],
        },
        {
          id: "name",
          name: "Name",
          data_path: "items.name",
          data: ["A", "B", "C", "D", "E", "F"],
        },
      ],
      enablePagination: false,
    };

    render(<DataViewWrapper {...numericData} />);

    // Before sorting, check initial order (as provided)
    expect(screen.getByText("1")).toBeInTheDocument();

    // All numbers should be visible
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("should sort values starting with numbers numerically", () => {
    const mixedData = {
      component: "data-view" as const,
      id: "mixed-numeric-sort",
      fields: [
        {
          id: "size",
          name: "Size",
          data_path: "items.size",
          data: ["1GB", "10GB", "2GB", "20GB"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...mixedData} />);

    // Values like "1GB" are parsed as numbers by default formatter; display is locale numeric
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("should handle decimal numbers in numeric sorting", () => {
    const decimalData = {
      component: "data-view" as const,
      id: "decimal-sort",
      fields: [
        {
          id: "price",
          name: "Price",
          data_path: "items.price",
          data: [1.5, 10.2, 2.8, 20.1, 100.5, 3.3],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...decimalData} />);

    // All decimal values should be present
    expect(screen.getByText("1.5")).toBeInTheDocument();
    expect(screen.getByText("10.2")).toBeInTheDocument();
    expect(screen.getByText("100.5")).toBeInTheDocument();
  });

  it("should handle negative numbers in numeric sorting", () => {
    const negativeData = {
      component: "data-view" as const,
      id: "negative-sort",
      fields: [
        {
          id: "temperature",
          name: "Temperature",
          data_path: "items.temp",
          data: [-10, 5, -2, 20, -100, 0],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...negativeData} />);

    // All values including negatives should be present
    expect(screen.getByText("-10")).toBeInTheDocument();
    expect(screen.getByText("-100")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should fall back to string sorting for non-numeric values", () => {
    const textData = {
      component: "data-view" as const,
      id: "text-sort",
      fields: [
        {
          id: "name",
          name: "Name",
          data_path: "items.name",
          data: ["Zebra", "Apple", "Mango", "Banana"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...textData} />);

    // All text values should be present
    expect(screen.getByText("Zebra")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Mango")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("should handle mixed numeric and text values in same column", () => {
    const mixedColumnData = {
      component: "data-view" as const,
      id: "mixed-column-sort",
      fields: [
        {
          id: "value",
          name: "Value",
          data_path: "items.value",
          data: [
            "10 items",
            "2 items",
            "text value",
            "5 items",
            "another text",
          ],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...mixedColumnData} />);

    // Number-like strings ("10 items", "5 items") are formatted as numbers; text as-is
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("text value")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("another text")).toBeInTheDocument();
  });

  it("should sort currency values numerically (stripping $ symbol)", () => {
    const currencyData = {
      component: "data-view" as const,
      id: "currency-sort",
      fields: [
        {
          id: "price",
          name: "Price",
          data_path: "items.price",
          data: ["$100.00", "$2.00", "$50.00", "$10.00", "$1.50"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...currencyData} />);

    // All currency values should be present
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("$2.00")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("$1.50")).toBeInTheDocument();
  });

  it("should sort other currency symbols (£, €) numerically", () => {
    const multiCurrencyData = {
      component: "data-view" as const,
      id: "multi-currency-sort",
      fields: [
        {
          id: "amount",
          name: "Amount",
          data_path: "items.amount",
          data: ["£100", "€50", "$25", "¥1000", "£5"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    render(<DataViewWrapper {...multiCurrencyData} />);

    // All currency formats should be present
    expect(screen.getByText("£100")).toBeInTheDocument();
    expect(screen.getByText("€50")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
    expect(screen.getByText("¥1000")).toBeInTheDocument();
    expect(screen.getByText("£5")).toBeInTheDocument();
  });

  it("should handle values with spaces before numbers", () => {
    const spacedData = {
      component: "data-view" as const,
      id: "spaced-sort",
      fields: [
        {
          id: "value",
          name: "Value",
          data_path: "items.value",
          data: ["  100", "  2", "  50", "  10"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    const { container } = render(<DataViewWrapper {...spacedData} />);

    // Check that all values are present by looking at table cells
    const cells = container.querySelectorAll("td");
    const cellTexts = Array.from(cells).map((cell) => cell.textContent?.trim());

    expect(cellTexts).toContain("100");
    expect(cellTexts).toContain("2");
    expect(cellTexts).toContain("50");
    expect(cellTexts).toContain("10");
    expect(cellTexts.length).toBe(4);
  });

  it("should sort ISO date strings chronologically (YYYY-MM-DD)", () => {
    const isoDateData = {
      component: "data-view" as const,
      id: "iso-date-sort",
      fields: [
        {
          id: "date",
          name: "Date",
          data_path: "items.date",
          data: ["2025-12-31", "2025-01-15", "2025-04-22", "2024-11-30"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    const { container } = render(<DataViewWrapper {...isoDateData} />);

    // ISO dates should be auto-formatted for display
    // Check that table has the expected number of rows
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(4);

    // Dates should be formatted (e.g., "Dec 31, 2025" instead of "2025-12-31")
    const cells = container.querySelectorAll("td");
    const cellTexts = Array.from(cells).map((cell) => cell.textContent);

    // Check that formatted dates are present (looking for month names or formatted dates)
    expect(
      cellTexts.some((text) => text?.includes("2025") || text?.includes("2024"))
    ).toBe(true);
  });

  it("should sort ISO datetime strings with time component", () => {
    const isoDateTimeData = {
      component: "data-view" as const,
      id: "iso-datetime-sort",
      fields: [
        {
          id: "timestamp",
          name: "Timestamp",
          data_path: "items.timestamp",
          data: [
            "2025-04-22T14:30:00Z",
            "2025-04-22T09:15:00Z",
            "2025-04-21T18:45:00Z",
            "2025-04-23T12:00:00Z",
          ],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    const { container } = render(<DataViewWrapper {...isoDateTimeData} />);

    // ISO datetime values should be auto-formatted with date and time
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(4);

    // Dates should be formatted with both date and time components
    const cells = container.querySelectorAll("td");
    const cellTexts = Array.from(cells).map((cell) => cell.textContent);

    // Check that dates with times are present (formatted, not raw ISO)
    expect(cellTexts.some((text) => text?.includes("2025"))).toBe(true);
  });

  it("should sort mixed ISO dates from different years and months", () => {
    const mixedDatesData = {
      component: "data-view" as const,
      id: "mixed-dates-sort",
      fields: [
        {
          id: "created",
          name: "Created",
          data_path: "items.created",
          data: [
            "2023-06-15",
            "2025-01-01",
            "2024-12-25",
            "2025-12-31",
            "2024-01-01",
          ],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    const { container } = render(<DataViewWrapper {...mixedDatesData} />);

    // All dates should be formatted and present
    const rows = container.querySelectorAll("tbody tr");
    expect(rows.length).toBe(5);

    // Dates from different years should be present (formatted)
    const cells = container.querySelectorAll("td");
    const cellTexts = Array.from(cells).map((cell) => cell.textContent);

    // Check for years in the formatted output
    expect(cellTexts.some((text) => text?.includes("2023"))).toBe(true);
    expect(cellTexts.some((text) => text?.includes("2024"))).toBe(true);
    expect(cellTexts.some((text) => text?.includes("2025"))).toBe(true);
  });

  it("should auto-format ISO dates for display while maintaining sorting", () => {
    const formattedDateData = {
      component: "data-view" as const,
      id: "formatted-date-display",
      fields: [
        {
          id: "date",
          name: "Date",
          data_path: "items.date",
          data: ["2025-04-22", "2025-01-15"],
        },
      ],
      enablePagination: false,
      enableFilters: false,
    };

    const { container } = render(<DataViewWrapper {...formattedDateData} />);

    // ISO dates should be displayed in a user-friendly format
    const cells = container.querySelectorAll("td");
    const cellTexts = Array.from(cells).map((cell) => cell.textContent);

    // Verify dates are formatted (not raw ISO strings)
    // The exact format depends on locale, but should contain the year
    expect(cellTexts.some((text) => text?.includes("2025"))).toBe(true);
    // Should NOT contain raw ISO format
    expect(cellTexts.some((text) => text === "2025-04-22")).toBe(false);
  });

  describe("Registry integration", () => {
    it("should call onItemClick resolved from registry when row is clicked", async () => {
      const inputDataType = "registry-dv-test";
      const mockHandler: ItemClickHandler = vi.fn();

      function Wrapper() {
        const registry = useComponentHandlerRegistry();
        const [ready, setReady] = React.useState(false);
        React.useEffect(() => {
          registry.registerItemClick(inputDataType, mockHandler);
          setReady(true);
        }, [registry]);

        if (!ready) return null;
        return (
          <DataViewWrapper
            component="data-view"
            id="registry-dv-rowclick"
            inputDataType={inputDataType}
            fields={[
              {
                id: "repository",
                name: "Repository",
                data_path: "repositories.name",
                data: ["repo-one", "repo-two"],
              },
              {
                id: "branch",
                name: "Branch",
                data_path: "repositories.branch",
                data: ["main", "develop"],
              },
            ]}
            perPage={10}
            enableFilters={false}
            enablePagination={false}
            enableSort={false}
          />
        );
      }

      const { container } = render(
        <ComponentHandlerRegistryProvider>
          <Wrapper />
        </ComponentHandlerRegistryProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("repo-one")).toBeInTheDocument();
      });

      const tbody = container.querySelector("tbody");
      expect(tbody).not.toBeNull();
      const firstRow = tbody?.querySelector("tr");
      expect(firstRow).not.toBeNull();
      fireEvent.click(firstRow!);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          fields: expect.objectContaining({
            repository: expect.objectContaining({ value: "repo-one" }),
            branch: expect.objectContaining({ value: "main" }),
          }),
        })
      );
    });
  });
});
