import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { TableProps, TableColumn, SortDirection } from './Table.types';

/**
 * Table component with sorting and responsive design
 *
 * @example
 * ```tsx
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   status: 'active' | 'inactive';
 * }
 *
 * const columns: TableColumn<User>[] = [
 *   { key: 'name', label: 'Nombre', sortable: true },
 *   { key: 'email', label: 'Email' },
 *   {
 *     key: 'status',
 *     label: 'Estado',
 *     render: (user) => (
 *       <Badge variant={user.status === 'active' ? 'success' : 'error'}>
 *         {user.status}
 *       </Badge>
 *     ),
 *   },
 * ];
 *
 * <Table
 *   columns={columns}
 *   data={users}
 *   keyExtractor={(user) => user.id}
 *   onRowClick={(user) => navigate(`/users/${user.id}`)}
 * />
 * ```
 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No hay datos para mostrar',
  loading = false,
  loadingRows = 5,
  hoverable = true,
  striped = false,
  className = '',
  onRowClick,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle column sort
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    if (sortKey === column.key) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(column.key);
      setSortDirection('asc');
    }
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    const column = columns.find((col) => col.key === sortKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      let result = 0;

      if (column.sortFn) {
        result = column.sortFn(a, b);
      } else {
        const aVal = a[sortKey] as string | number;
        const bVal = b[sortKey] as string | number;

        if (aVal < bVal) result = -1;
        if (aVal > bVal) result = 1;
      }

      return sortDirection === 'asc' ? result : -result;
    });
  }, [data, sortKey, sortDirection, columns]);

  // Alignment classes
  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`w-full overflow-x-auto ${className}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-sm font-semibold text-slate-200 ${getAlignClass(column.align)}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: loadingRows }).map((_, idx) => (
              <tr key={idx} className="border-b border-slate-700">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    <div className="h-5 bg-slate-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (sortedData.length === 0) {
    return (
      <div className={`w-full overflow-x-auto ${className}`}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-sm font-semibold text-slate-200 ${getAlignClass(column.align)}`}
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <p className="text-slate-400 text-sm">{emptyMessage}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800 border-b border-slate-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-sm font-semibold text-slate-200 ${getAlignClass(column.align)} ${
                  column.sortable ? 'cursor-pointer select-none hover:bg-slate-700' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center gap-2 justify-start">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ArrowUp
                        className={`h-3 w-3 -mb-1 ${
                          sortKey === column.key && sortDirection === 'asc'
                            ? 'text-blue-400'
                            : 'text-slate-600'
                        }`}
                      />
                      <ArrowDown
                        className={`h-3 w-3 ${
                          sortKey === column.key && sortDirection === 'desc'
                            ? 'text-blue-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIdx) => (
            <tr
              key={keyExtractor(row)}
              className={`
                border-b border-slate-700 transition-colors
                ${hoverable ? 'hover:bg-slate-800' : ''}
                ${striped && rowIdx % 2 === 1 ? 'bg-slate-900/30' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 text-sm text-slate-200 ${getAlignClass(column.align)}`}
                >
                  {column.render ? column.render(row) : (row[column.key] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
