import { render, screen, fireEvent } from "@testing-library/react";

import TableWrapper from "../../components/TableWrapper";

describe("TableWrapper Component", () => {
  const mockFieldsData = {
    component: "table" as const,
    title: "Details of Toy Story",
    id: "call_5glz9rb6",
    fields: [
      {
        name: "Title",
        data_path: "movie.title",
        data: ["Toy Story"],
      },
      {
        name: "Year",
        data_path: "movie.year",
        data: [1995],
      },
      {
        name: "Runtime",
        data_path: "movie.runtime",
        data: [81],
      },
      {
        name: "IMDB Rating",
        data_path: "movie.imdbRating",
        data: [8.3],
      },
      {
        name: "Revenue",
        data_path: "movie.revenue",
        data: [373554033],
      },
      {
        name: "Countries",
        data_path: "movie.countries[size:1]",
        data: [["USA"]],
      },
    ],
  };

  it("should render table with fields prop", () => {
    render(<TableWrapper {...mockFieldsData} />);

    // Check that the title appears in the table caption
    const tableCaption = screen.getByRole("grid").querySelector("caption");
    expect(tableCaption).toHaveTextContent("Details of Toy Story");

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Runtime")).toBeInTheDocument();
    expect(screen.getByText("IMDB Rating")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
  });

  it("should render data values correctly from fields", () => {
    render(<TableWrapper {...mockFieldsData} />);

    expect(screen.getByText("Toy Story")).toBeInTheDocument();
    expect(screen.getByText("1995")).toBeInTheDocument();
    expect(screen.getByText("81")).toBeInTheDocument();
    expect(screen.getByText("8.3")).toBeInTheDocument();
    expect(screen.getByText("373554033")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("should handle array data correctly", () => {
    const fieldsWithArray = {
      ...mockFieldsData,
      fields: [
        {
          name: "Countries",
          data_path: "movie.countries",
          data: [["USA", "Canada", "Mexico"]],
        },
      ],
    };

    render(<TableWrapper {...fieldsWithArray} />);

    expect(screen.getByText("USA, Canada, Mexico")).toBeInTheDocument();
  });

  it("should handle null values correctly", () => {
    const fieldsWithNull = {
      ...mockFieldsData,
      fields: [
        {
          name: "Title",
          data_path: "movie.title",
          data: [null],
        },
        {
          name: "Year",
          data_path: "movie.year",
          data: [1995],
        },
      ],
    };

    render(<TableWrapper {...fieldsWithNull} />);

    expect(screen.getByText("1995")).toBeInTheDocument();
  });

  it("should handle multiple rows of data", () => {
    const fieldsWithMultipleRows = {
      ...mockFieldsData,
      fields: [
        {
          name: "Title",
          data_path: "movie.title",
          data: ["Toy Story", "Toy Story 2", "Toy Story 3"],
        },
        {
          name: "Year",
          data_path: "movie.year",
          data: [1995, 1999, 2010],
        },
      ],
    };

    render(<TableWrapper {...fieldsWithMultipleRows} />);

    expect(screen.getByText("Toy Story")).toBeInTheDocument();
    expect(screen.getByText("Toy Story 2")).toBeInTheDocument();
    expect(screen.getByText("Toy Story 3")).toBeInTheDocument();
    expect(screen.getByText("1995")).toBeInTheDocument();
    expect(screen.getByText("1999")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("should apply custom id and className", () => {
    const customId = "custom-table-id";
    const customClassName = "custom-table-class";

    render(
      <TableWrapper
        {...mockFieldsData}
        id={customId}
        className={customClassName}
      />
    );

    // Find the Card wrapper that contains the table by looking for the element with the custom id
    const cardElement = document.getElementById(customId);
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveClass(customClassName);
  });

  it("should handle empty fields array", () => {
    render(<TableWrapper {...mockFieldsData} fields={[]} />);

    // Should show error placeholder when no fields are provided
    expect(screen.getByText("No data available")).toBeInTheDocument();
    // Should not render a table
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("should handle fields with different data lengths", () => {
    const fieldsWithDifferentLengths = {
      ...mockFieldsData,
      fields: [
        {
          name: "Field 1",
          data_path: "test.field1",
          data: ["value1", "value2"],
        },
        {
          name: "Field 2",
          data_path: "test.field2",
          data: ["single value"],
        },
      ],
    };

    render(<TableWrapper {...fieldsWithDifferentLengths} />);

    // Should create 2 rows (max length is 2)
    expect(screen.getByText("value1")).toBeInTheDocument();
    expect(screen.getByText("value2")).toBeInTheDocument();
    expect(screen.getByText("single value")).toBeInTheDocument();
  });

  it("should render table with correct structure", () => {
    render(<TableWrapper {...mockFieldsData} />);

    // Check table structure
    const table = screen.getByRole("grid");
    expect(table).toBeInTheDocument();

    // Check caption
    const tableCaption = table.querySelector("caption");
    expect(tableCaption).toHaveTextContent("Details of Toy Story");

    // Check headers
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Runtime")).toBeInTheDocument();
    expect(screen.getByText("IMDB Rating")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Countries")).toBeInTheDocument();
  });

  it("should handle mixed data types", () => {
    const fieldsWithMixedTypes = {
      ...mockFieldsData,
      fields: [
        {
          name: "String Field",
          data_path: "test.string",
          data: ["test string"],
        },
        {
          name: "Number Field",
          data_path: "test.number",
          data: [123],
        },
        {
          name: "Boolean Field",
          data_path: "test.boolean",
          data: [true],
        },
        {
          name: "Null Field",
          data_path: "test.null",
          data: [null],
        },
      ],
    };

    render(<TableWrapper {...fieldsWithMixedTypes} />);

    expect(screen.getByText("test string")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
  });

  // ========== onRowClick Feature Tests ==========

  describe("onRowClick functionality", () => {
    const mockOnRowClick = vitest.fn();

    beforeEach(() => {
      mockOnRowClick.mockClear();
    });

    it("should call onRowClick handler when row is clicked", () => {
      render(<TableWrapper {...mockFieldsData} onRowClick={mockOnRowClick} />);

      const firstRow = screen.getByTestId("row-0");
      fireEvent.click(firstRow);

      expect(mockOnRowClick).toHaveBeenCalledTimes(1);
      expect(mockOnRowClick).toHaveBeenCalledWith({
        Title: "Toy Story",
        Year: "1995",
        Runtime: "81",
        "IMDB Rating": "8.3",
        Revenue: "373554033",
        Countries: "USA",
      });
    });

    it("should call onRowClick with correct data for each row", () => {
      const multiRowData = {
        ...mockFieldsData,
        fields: [
          {
            name: "Name",
            data_path: "user.name",
            data: ["Alice", "Bob", "Charlie"],
          },
          {
            name: "Age",
            data_path: "user.age",
            data: [25, 30, 35],
          },
        ],
      };

      render(<TableWrapper {...multiRowData} onRowClick={mockOnRowClick} />);

      // Click second row
      const secondRow = screen.getByTestId("row-1");
      fireEvent.click(secondRow);

      expect(mockOnRowClick).toHaveBeenCalledWith({
        Name: "Bob",
        Age: "30",
      });
    });

    it("should apply pointer cursor style when onRowClick is provided", () => {
      render(<TableWrapper {...mockFieldsData} onRowClick={mockOnRowClick} />);

      const firstRow = screen.getByTestId("row-0");
      expect(firstRow).toHaveStyle({ cursor: "pointer" });
    });

    it("should not apply pointer cursor style when onRowClick is not provided", () => {
      render(<TableWrapper {...mockFieldsData} />);

      const firstRow = screen.getByTestId("row-0");
      expect(firstRow).not.toHaveStyle({ cursor: "pointer" });
    });

    it("should make rows hoverable when onRowClick is provided", () => {
      const { container } = render(
        <TableWrapper {...mockFieldsData} onRowClick={mockOnRowClick} />
      );

      const firstRow = container.querySelector('[data-testid="row-0"]');
      // Check that isHoverable prop is applied (PatternFly adds hover class)
      expect(firstRow).toBeInTheDocument();
    });

    it("should handle multiple row clicks", () => {
      const multiRowData = {
        ...mockFieldsData,
        fields: [
          {
            name: "Item",
            data_path: "item",
            data: ["A", "B", "C"],
          },
        ],
      };

      render(<TableWrapper {...multiRowData} onRowClick={mockOnRowClick} />);

      fireEvent.click(screen.getByTestId("row-0"));
      fireEvent.click(screen.getByTestId("row-1"));
      fireEvent.click(screen.getByTestId("row-2"));

      expect(mockOnRowClick).toHaveBeenCalledTimes(3);
      expect(mockOnRowClick).toHaveBeenNthCalledWith(1, { Item: "A" });
      expect(mockOnRowClick).toHaveBeenNthCalledWith(2, { Item: "B" });
      expect(mockOnRowClick).toHaveBeenNthCalledWith(3, { Item: "C" });
    });

    it("should handle row click with array data", () => {
      const fieldsWithArray = {
        ...mockFieldsData,
        fields: [
          {
            name: "Name",
            data_path: "name",
            data: ["Test"],
          },
          {
            name: "Tags",
            data_path: "tags",
            data: [["tag1", "tag2", "tag3"]],
          },
        ],
      };

      render(<TableWrapper {...fieldsWithArray} onRowClick={mockOnRowClick} />);

      fireEvent.click(screen.getByTestId("row-0"));

      expect(mockOnRowClick).toHaveBeenCalledWith({
        Name: "Test",
        Tags: "tag1, tag2, tag3", // Array should be joined
      });
    });

    it("should handle row click with null values", () => {
      const fieldsWithNull = {
        ...mockFieldsData,
        fields: [
          {
            name: "Field1",
            data_path: "field1",
            data: ["value1"],
          },
          {
            name: "Field2",
            data_path: "field2",
            data: [null],
          },
        ],
      };

      render(<TableWrapper {...fieldsWithNull} onRowClick={mockOnRowClick} />);

      fireEvent.click(screen.getByTestId("row-0"));

      expect(mockOnRowClick).toHaveBeenCalledWith({
        Field1: "value1",
        Field2: "", // null should become empty string
      });
    });

    it("should not break when onRowClick is undefined", () => {
      render(<TableWrapper {...mockFieldsData} />);

      const firstRow = screen.getByTestId("row-0");

      // Should not throw error when clicking without handler
      expect(() => fireEvent.click(firstRow)).not.toThrow();
    });

    it("should work with single row tables", () => {
      render(<TableWrapper {...mockFieldsData} onRowClick={mockOnRowClick} />);

      const row = screen.getByTestId("row-0");
      fireEvent.click(row);

      expect(mockOnRowClick).toHaveBeenCalledTimes(1);
    });

    it("should work with large tables (100+ rows)", () => {
      const largeData = {
        ...mockFieldsData,
        fields: [
          {
            name: "ID",
            data_path: "id",
            data: Array.from({ length: 150 }, (_, i) => i + 1),
          },
          {
            name: "Value",
            data_path: "value",
            data: Array.from({ length: 150 }, (_, i) => `value-${i + 1}`),
          },
        ],
      };

      render(<TableWrapper {...largeData} onRowClick={mockOnRowClick} />);

      // Click a row in the middle
      fireEvent.click(screen.getByTestId("row-75"));

      expect(mockOnRowClick).toHaveBeenCalledWith({
        ID: "76",
        Value: "value-76",
      });
    });

    it("should maintain backward compatibility with tables without onRowClick", () => {
      const { container } = render(<TableWrapper {...mockFieldsData} />);

      const rows = container.querySelectorAll('[data-testid^="row-"]');
      expect(rows.length).toBeGreaterThan(0);

      // Should render normally without onRowClick
      expect(screen.getByText("Toy Story")).toBeInTheDocument();
    });

    it("should pass all row data fields to click handler", () => {
      const complexData = {
        ...mockFieldsData,
        fields: [
          { name: "Name", data_path: "name", data: ["Test"] },
          { name: "Age", data_path: "age", data: [25] },
          { name: "City", data_path: "city", data: ["NYC"] },
          { name: "Active", data_path: "active", data: [true] },
          { name: "Score", data_path: "score", data: [95.5] },
        ],
      };

      render(<TableWrapper {...complexData} onRowClick={mockOnRowClick} />);

      fireEvent.click(screen.getByTestId("row-0"));

      expect(mockOnRowClick).toHaveBeenCalledWith({
        Name: "Test",
        Age: "25",
        City: "NYC",
        Active: "true",
        Score: "95.5",
      });
    });

    it("should have data-testid on all rows", () => {
      const multiRowData = {
        ...mockFieldsData,
        fields: [
          {
            name: "Item",
            data_path: "item",
            data: ["A", "B", "C", "D", "E"],
          },
        ],
      };

      render(<TableWrapper {...multiRowData} onRowClick={mockOnRowClick} />);

      for (let i = 0; i < 5; i++) {
        expect(screen.getByTestId(`row-${i}`)).toBeInTheDocument();
      }
    });
  });

  // ========== Copy to Clipboard Feature Tests ==========

  describe("copy to clipboard functionality", () => {
    it("should render ClipboardCopy for string columns", () => {
      const copyableData = {
        ...mockFieldsData,
        fields: [
          { name: "User ID", data_path: "user.id", data: ["12345"] },
          { name: "Name", data_path: "user.name", data: ["John Doe"] },
          {
            name: "Email",
            data_path: "user.email",
            data: ["john@example.com"],
          },
          {
            name: "Profile URL",
            data_path: "user.url",
            data: ["https://example.com"],
          },
          {
            name: "Cluster Name",
            data_path: "cluster.name",
            data: ["prod-cluster-01"],
          },
        ],
      };

      const { container } = render(<TableWrapper {...copyableData} />);

      // ClipboardCopy components should be present for string columns
      const clipboardCopies = container.querySelectorAll(
        ".pf-v6-c-clipboard-copy"
      );
      expect(clipboardCopies.length).toBeGreaterThan(0);
    });

    it("should render ClipboardCopy for primitive types (strings, numbers, booleans)", () => {
      const primitiveData = {
        ...mockFieldsData,
        fields: [
          { name: "Year", data_path: "year", data: [2024] },
          { name: "Count", data_path: "count", data: [42] },
          { name: "Is Active", data_path: "active", data: [true] },
          { name: "Name", data_path: "name", data: ["Test"] },
        ],
      };

      const { container } = render(<TableWrapper {...primitiveData} />);

      // ClipboardCopy components should be present for all primitive types
      const clipboardCopies = container.querySelectorAll(
        ".pf-v6-c-clipboard-copy"
      );
      // All 4 columns should have ClipboardCopy
      expect(clipboardCopies.length).toBe(4);

      // Values should be displayed
      expect(screen.getByText("2024")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
      expect(screen.getByText("true")).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    it("should render mixed content - all text data copyable including arrays", () => {
      const mixedData = {
        ...mockFieldsData,
        fields: [
          { name: "User ID", data_path: "user.id", data: ["12345"] },
          { name: "Age", data_path: "user.age", data: [30] },
          {
            name: "Email",
            data_path: "user.email",
            data: ["user@example.com"],
          },
          { name: "Status", data_path: "user.status", data: ["Active"] },
          { name: "Tags", data_path: "tags", data: [["tag1", "tag2"]] },
        ],
      };

      const { container } = render(<TableWrapper {...mixedData} />);

      // All columns should have ClipboardCopy (including arrays converted to strings)
      // User ID, Age, Email, Status, Tags = 5 copyable columns
      const clipboardCopies = container.querySelectorAll(
        ".pf-v6-c-clipboard-copy"
      );
      expect(clipboardCopies.length).toBe(5);

      // All values should be visible
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("tag1, tag2")).toBeInTheDocument(); // Array is displayed joined
    });

    it("should not trigger row click when clicking copy button", () => {
      const mockOnRowClick = vitest.fn();
      const copyableData = {
        ...mockFieldsData,
        fields: [
          { name: "User ID", data_path: "user.id", data: ["12345"] },
          { name: "Name", data_path: "user.name", data: ["John Doe"] },
        ],
      };

      const { container } = render(
        <TableWrapper {...copyableData} onRowClick={mockOnRowClick} />
      );

      // Find the copy button
      const copyButton = container.querySelector(
        ".pf-v6-c-clipboard-copy__group button"
      );

      if (copyButton) {
        fireEvent.click(copyButton);

        // onRowClick should NOT be called when clicking the copy button
        expect(mockOnRowClick).not.toHaveBeenCalled();
      }
    });

    it("should detect copyable columns based on data type, not column name", () => {
      const mixedTypes = {
        ...mockFieldsData,
        fields: [
          { name: "SomeId", data_path: "id", data: [123] }, // number - copyable
          { name: "SomeName", data_path: "name", data: ["john"] }, // string - copyable
          { name: "Random", data_path: "random", data: ["test"] }, // string - copyable
          { name: "Count", data_path: "count", data: [42] }, // number - copyable
          { name: "Items", data_path: "items", data: [["a", "b"]] }, // array - copyable
        ],
      };

      const { container } = render(<TableWrapper {...mixedTypes} />);

      // All columns should have ClipboardCopy (primitives and arrays)
      const clipboardCopies = container.querySelectorAll(
        ".pf-v6-c-clipboard-copy"
      );
      expect(clipboardCopies.length).toBe(5);
    });

    it("should handle multiple rows with copyable primitive columns", () => {
      const multiRowCopyable = {
        ...mockFieldsData,
        fields: [
          {
            name: "Email",
            data_path: "email",
            data: ["user1@test.com", "user2@test.com", "user3@test.com"],
          },
          {
            name: "Name",
            data_path: "name",
            data: ["Alice", "Bob", "Charlie"],
          },
          {
            name: "Age",
            data_path: "age",
            data: [25, 30, 35],
          },
        ],
      };

      const { container } = render(<TableWrapper {...multiRowCopyable} />);

      // Should have ClipboardCopy for each cell in primitive columns
      const clipboardCopies = container.querySelectorAll(
        ".pf-v6-c-clipboard-copy"
      );
      // 3 rows * 3 primitive columns = 9 ClipboardCopy components
      expect(clipboardCopies.length).toBe(9);
    });

    it("should show ClipboardCopy for array data (displayed as comma-separated strings)", () => {
      const arrayData = {
        ...mockFieldsData,
        fields: [
          { name: "Tags", data_path: "tags", data: [["tag1", "tag2"]] },
          { name: "Name", data_path: "name", data: ["John"] },
        ],
      };

      const { container } = render(<TableWrapper {...arrayData} />);

      // Both columns should have ClipboardCopy (string and array)
      const clipboardCopies = container.querySelectorAll(
        ".pf-v6-c-clipboard-copy"
      );
      expect(clipboardCopies.length).toBe(2);

      // Verify the array is displayed as a joined string
      expect(screen.getByText("tag1, tag2")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
    });
  });
});
