import { Card, CardBody } from "@patternfly/react-core";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Caption,
} from "@patternfly/react-table";
import { CopyIcon, CheckIcon } from "@patternfly/react-icons";
import React, { useState } from "react";

import ErrorPlaceholder from "./ErrorPlaceholder";

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

// Copy button component with visual feedback
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};

const TableWrapper = (props: TableWrapperProps) => {
  const { title, id, fields, className, onRowClick } = props;
  
  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;
  const hasNoTitle = !title || title.trim() === "";

  // Transform fields data into table format
  const transformFieldsToTableData = () => {
    if (hasNoFields) return { columns: [], rows: [] };

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create columns from field names
    const transformedColumns = fields.map((field) => ({
      key: field.name,
      label: field.name,
    }));

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

    return { columns: transformedColumns, rows: transformedRows };
  };

  const { columns, rows } = transformFieldsToTableData();
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
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                  isHoverable={!!onRowClick}
                >
                  {columns.map((col, colIndex) => {
                    const cellValue = row[col.key];
                    
                    // Add copy button for ID, Name, URL, Email columns
                    const isCopyableColumn = ['id', 'name', 'url', 'email', 'cluster'].some(
                      keyword => col.key.toLowerCase().includes(keyword)
                    );

                    return (
                      <Td key={colIndex}>
                        {isCopyableColumn ? (
                          <span className="cell-with-copy">
                            <span className="cell-value">{cellValue}</span>
                            <CopyButton text={String(cellValue)} />
                          </span>
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
