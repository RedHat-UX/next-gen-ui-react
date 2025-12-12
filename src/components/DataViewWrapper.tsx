import { EmptyState, EmptyStateBody, Pagination } from "@patternfly/react-core";
import { DataView } from "@patternfly/react-data-view/dist/dynamic/DataView";
import { DataViewFilters } from "@patternfly/react-data-view/dist/dynamic/DataViewFilters";
import {
  DataViewTable,
  DataViewTh,
} from "@patternfly/react-data-view/dist/dynamic/DataViewTable";
import { DataViewTextFilter } from "@patternfly/react-data-view/dist/dynamic/DataViewTextFilter";
import { DataViewToolbar } from "@patternfly/react-data-view/dist/dynamic/DataViewToolbar";
import {
  useDataViewFilters,
  useDataViewPagination,
  useDataViewSort,
} from "@patternfly/react-data-view/dist/dynamic/Hooks";
import { CubesIcon } from "@patternfly/react-icons";
import { Tbody, Td, ThProps, Tr } from "@patternfly/react-table";
import { FunctionComponent, useMemo } from "react";

import ErrorPlaceholder from "./ErrorPlaceholder";

interface FieldData {
  name: string;
  data_path: string;
  data: (string | number | boolean | null | (string | number)[])[];
}

interface DataViewColumn {
  label: string;
  key: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataViewWrapperProps {
  component: "data-view" | "table"; // "table" supported for backwards compatibility
  title?: string;
  id: string;
  fields: FieldData[];
  className?: string;
  columns?: DataViewColumn[];
  perPage?: number;
  enableFilters?: boolean; // If undefined, auto-disables when 5 or fewer items
  enablePagination?: boolean; // If undefined, auto-disables when 5 or fewer items
  enableSort?: boolean;
  emptyStateMessage?: string;
}

const perPageOptions = [
  { title: "5", value: 5 },
  { title: "10", value: 10 },
  { title: "20", value: 20 },
  { title: "50", value: 50 },
];

const DataViewWrapper: FunctionComponent<DataViewWrapperProps> = ({
  id,
  fields,
  className,
  perPage: initialPerPage = 5,
  enableFilters,
  enablePagination,
  enableSort = true,
  emptyStateMessage = "No data available",
}) => {
  // Check for missing or invalid data
  const hasNoFields = !fields || fields.length === 0;

  // Transform fields data into table format
  const { columns, rows, filterableFields } = useMemo(() => {
    if (hasNoFields) {
      return { columns: [], rows: [], filterableFields: [] };
    }

    // Find the maximum number of data items across all fields
    const maxDataLength = Math.max(...fields.map((field) => field.data.length));

    // Create columns from field names
    const transformedColumns: DataViewColumn[] = fields.map((field) => ({
      key: field.name,
      label: field.name,
      sortable: true,
      filterable: true,
    }));

    // Helper function to format ISO dates for display
    const formatValue = (
      value: string | number | boolean | null | (string | number)[]
    ): string => {
      if (value === null || value === undefined) {
        return "";
      }
      if (Array.isArray(value)) {
        return value.join(", ");
      }

      const strValue = String(value);

      // Check for ISO date format and auto-format for display
      const isoDatePattern =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
      if (isoDatePattern.test(strValue)) {
        const date = new Date(strValue);
        if (!isNaN(date.getTime())) {
          // Format date based on whether it has time component
          const hasTime = strValue.includes("T");
          try {
            if (hasTime) {
              // Format with date and time
              return new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(date);
            } else {
              // Format date only
              return new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
              }).format(date);
            }
          } catch {
            // Fallback if Intl formatting fails
            return strValue;
          }
        }
      }

      return strValue;
    };

    // Create rows based on the maximum data length
    // Store both display value and original value (for sorting)
    const transformedRows: Record<string, string | number>[] = [];
    for (let i = 0; i < maxDataLength; i++) {
      const row: Record<string, string | number> = {};
      fields.forEach((field) => {
        const originalValue = field.data[i];
        const displayValue = formatValue(originalValue);
        row[field.name] = displayValue;
        // Store original value with a special key for sorting
        row[`__sort_${field.name}`] =
          originalValue === null || originalValue === undefined
            ? ""
            : Array.isArray(originalValue)
              ? originalValue.join(", ")
              : String(originalValue);
      });
      transformedRows.push(row);
    }

    // Get filterable field keys
    const filterable = transformedColumns
      .filter((col) => col.filterable)
      .map((col) => col.key);

    return {
      columns: transformedColumns,
      rows: transformedRows,
      filterableFields: filterable,
    };
  }, [fields, hasNoFields]);

  // Auto-disable pagination and filters if there are 5 or fewer items (unless explicitly set)
  const shouldEnablePagination =
    enablePagination !== undefined ? enablePagination : rows.length > 5;
  const shouldEnableFilters =
    enableFilters !== undefined ? enableFilters : rows.length > 5;

  // Initialize filters with all filterable fields
  const initialFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    filterableFields.forEach((field) => {
      filters[field] = "";
    });
    return filters;
  }, [filterableFields]);

  const { filters, onSetFilters, clearAllFilters } = useDataViewFilters({
    initialFilters,
  });

  const pagination = useDataViewPagination({ perPage: initialPerPage });
  const { page, perPage } = pagination;

  const { sortBy, direction, onSort } = useDataViewSort();

  // Sort and filter data
  const filteredData = useMemo(() => {
    return rows.filter((row) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key];
        if (!filterValue) return true;
        // Filter against both display value and original value
        const displayValue = String(row[key] || "");
        const sortKey = `__sort_${key}`;
        const originalValue = String(row[sortKey] || "");
        return (
          displayValue.toLowerCase().includes(filterValue.toLowerCase()) ||
          originalValue.toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    });
  }, [rows, filters]);

  const sortedData = useMemo(() => {
    if (!sortBy || !direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      // Use original values for sorting (stored with __sort_ prefix)
      const sortKey = `__sort_${sortBy}`;
      const aVal = String(a[sortKey] || a[sortBy] || "");
      const bVal = String(b[sortKey] || b[sortBy] || "");

      // Check for ISO date format (YYYY-MM-DD or full ISO 8601 with time)
      const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
      const aIsISO = isoDatePattern.test(aVal);
      const bIsISO = isoDatePattern.test(bVal);

      // If both values are ISO dates, parse and compare as dates
      if (aIsISO && bIsISO) {
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);

        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          const diff = aDate.getTime() - bDate.getTime();
          return direction === "asc" ? diff : -diff;
        }
      }

      // Strip leading non-numeric characters (except minus) for better number detection
      // This handles currency symbols ($100, £50, €25) and other prefixes
      const aStripped = aVal.replace(/^[^\d-]+/, "");
      const bStripped = bVal.replace(/^[^\d-]+/, "");

      // Extract leading numbers if present for numeric sorting
      const aNumMatch = aStripped.match(/^-?\d+\.?\d*/);
      const bNumMatch = bStripped.match(/^-?\d+\.?\d*/);

      // If both values have numbers (after stripping prefixes), sort numerically
      if (aNumMatch && bNumMatch && aNumMatch[0] && bNumMatch[0]) {
        const aNum = parseFloat(aNumMatch[0]);
        const bNum = parseFloat(bNumMatch[0]);

        if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) {
          return direction === "asc" ? aNum - bNum : bNum - aNum;
        }
      }

      // Fall back to string comparison
      if (direction === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [filteredData, sortBy, direction]);

  const sortByIndex = useMemo(
    () => columns.findIndex((item) => item.key === sortBy),
    [columns, sortBy]
  );

  const getSortParams = (columnIndex: number): ThProps["sort"] => ({
    sortBy: {
      index: sortByIndex,
      direction,
      defaultDirection: "asc",
    },
    onSort: (_event, index, direction) =>
      onSort(_event, columns[index].key, direction),
    columnIndex,
  });

  const dataViewColumns: DataViewTh[] = columns.map((column, index) => ({
    cell: column.label,
    props: enableSort && column.sortable ? { sort: getSortParams(index) } : {},
  }));

  const pageRows = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return sortedData.slice(start, end).map((row) => ({
      // Only include values for actual columns (filter out __sort_ keys)
      row: columns.map((col) => row[col.key]),
      props: {},
    }));
  }, [sortedData, page, perPage, columns]);

  const emptyState = (
    <Tbody>
      <Tr>
        <Td colSpan={columns.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText="No data found"
          >
            <EmptyStateBody>{emptyStateMessage}</EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  if (hasNoFields) {
    return (
      <div id={id} className={className}>
        <ErrorPlaceholder
          hasError={false}
          noContentMessage={emptyStateMessage}
        />
      </div>
    );
  }

  return (
    <div id={id} className={className}>
      <DataView activeState={sortedData.length > 0 ? undefined : "empty"}>
        <DataViewToolbar
          ouiaId={`${id}-toolbar-top`}
          clearAllFilters={clearAllFilters}
          filters={
            shouldEnableFilters ? (
              <DataViewFilters
                onChange={(_e, values) => onSetFilters(values)}
                values={filters}
              >
                {filterableFields.map((fieldKey) => (
                  <DataViewTextFilter
                    key={fieldKey}
                    filterId={fieldKey}
                    title={fieldKey}
                    placeholder={`Filter by ${fieldKey.toLowerCase()}`}
                  />
                ))}
              </DataViewFilters>
            ) : undefined
          }
          pagination={
            shouldEnablePagination ? (
              <Pagination
                isCompact
                perPageOptions={perPageOptions}
                itemCount={sortedData.length}
                {...pagination}
              />
            ) : undefined
          }
        />
        <DataViewTable
          aria-label="Data view table"
          ouiaId={id}
          columns={dataViewColumns}
          rows={pageRows}
          bodyStates={{ empty: emptyState }}
        />
        {shouldEnablePagination && (
          <DataViewToolbar
            ouiaId={`${id}-toolbar-bottom`}
            pagination={
              <Pagination
                isCompact
                perPageOptions={perPageOptions}
                itemCount={sortedData.length}
                {...pagination}
              />
            }
          />
        )}
      </DataView>
    </div>
  );
};

export default DataViewWrapper;
