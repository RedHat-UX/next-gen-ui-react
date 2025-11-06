import { Card, CardBody, ClipboardCopy } from "@patternfly/react-core";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Caption,
} from "@patternfly/react-table";

import ErrorPlaceholder from "./ErrorPlaceholder";

import "./TableWrapper.css";

interface FieldData {
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
}

interface TableWrapperProps {
  component: "table";
  title: string;
  id: string;
  fields: FieldData[];
  className?: string;
  onRowClick?: (rowData: Record<string, string | number | null>) => void;
}

const TableWrapper = (props: TableWrapperProps) => {
  const { title, id, fields, className, onRowClick } = props;

  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const hasNoTitle = !title || title.trim() === "";

  // Helper function to determine if a field contains copyable text data
  const isFieldCopyable = (field: FieldData): boolean => {
    if (!field.data || field.data.length === 0) return false;

    // Check the first non-null/non-undefined value to determine type
    const sampleValue = field.data.find(
      (val) => val !== null && val !== undefined
    );
    if (!sampleValue) return false;

    // Arrays are converted to comma-separated strings, so they're copyable
    if (Array.isArray(sampleValue)) {
      return true;
    }

    // Make primitive values copyable (string, number, boolean)
    // Exclude objects, React elements, functions, etc.
    const valueType = typeof sampleValue;
    return (
      valueType === "string" ||
      valueType === "number" ||
      valueType === "boolean"
    );
  };

  // Transform fields data into table format
  const transformFieldsToTableData = () => {
    if (hasNoFields)
      return { columns: [], rows: [], copyableColumns: new Set<string>() };

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create columns from field names and track which are copyable
    const transformedColumns = fields.map((field) => ({
      key: field.name,
      label: field.name,
    }));

    const copyableColumns = new Set(
      fields.filter(isFieldCopyable).map((field) => field.name)
    );

    // Create rows based on the maximum data length
    const transformedRows = [];
    for (let i = 0; i < maxDataLength; i++) {
      const row: Record<string, string | number | null> = {};
      fields.forEach((field) => {
        const value = field.data[i];
        if (value === null || value === undefined) {
          row[field.name] = "";
        } else if (Array.isArray(value)) {
          row[field.name] = value.join(", ");
        } else {
          row[field.name] = String(value);
        }
      });
      transformedRows.push(row);
    }

    return {
      columns: transformedColumns,
      rows: transformedRows,
      copyableColumns,
    };
  };

  const { columns, rows, copyableColumns } = transformFieldsToTableData();
  const hasNoData = rows.length === 0;

  // If no title and no fields, show error
  if (hasNoTitle && hasNoFields) {
    return (
      <Card id={id} className={className}>
        <CardBody>
          <ErrorPlaceholder
            hasError={false}
            noContentMessage="No content available"
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card id={id} className={className}>
      <CardBody>
        {hasNoData ? (
          <ErrorPlaceholder
            hasError={false}
            noContentMessage="No data available"
          />
        ) : (
          <Table variant="compact" borders>
            <Caption>{title}</Caption>
            <Thead>
              <Tr>
                {columns.map((col, index) => (
                  <Th key={index}>{col.label}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, rowIndex) => (
                <Tr
                  key={rowIndex}
                  data-testid={`row-${rowIndex}`}
                  onClick={() => onRowClick?.(row)}
                  style={onRowClick ? { cursor: "pointer" } : undefined}
                >
                  {columns.map((col, colIndex) => {
                    const cellValue = row[col.key];
                    const isCopyableColumn = copyableColumns.has(col.key);

                    return (
                      <Td key={colIndex}>
                        {isCopyableColumn ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <ClipboardCopy
                              hoverTip="Copy"
                              clickTip="Copied"
                              variant="inline-compact"
                              className="ngui-clipboard-copy"
                            >
                              {String(cellValue)}
                            </ClipboardCopy>
                          </div>
                        ) : (
                          cellValue
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default TableWrapper;
