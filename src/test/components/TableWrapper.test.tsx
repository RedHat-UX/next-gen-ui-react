import { render, screen } from "@testing-library/react";

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

    expect(screen.getByText("N/A")).toBeInTheDocument();
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

    // Check that the title appears in the table caption
    const tableCaption = screen.getByRole("grid").querySelector("caption");
    expect(tableCaption).toHaveTextContent("Details of Toy Story");
    // Should not crash with empty fields
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
    // Second row should have N/A for Field 2
    const naElements = screen.getAllByText("N/A");
    expect(naElements.length).toBeGreaterThan(0);
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
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
