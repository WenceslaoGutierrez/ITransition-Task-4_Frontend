import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  useReactTable,
  type OnChangeFn
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title?: string | null;
  company?: string | null;
  last_login_date: string | null;
  registration_date: string;
  status: 'active' | 'blocked';
}

export const columns: ColumnDef<UserData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className="translate-y-[2px]" />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const isBlocked = user.status === 'blocked';
      return (
        <div className={cn(isBlocked && 'text-gray-400 dark:text-gray-500')}>
          <div className={cn('font-medium px-3', isBlocked && 'line-through')}>
            {user.last_name}, {user.first_name}
          </div>
          <div className="text-xs px-3">
            {user.job_title && user.job_title !== 'N/A' ? user.job_title : ''}
            {user.job_title && user.job_title !== 'N/A' && user.company ? ', ' : ''}
            {user.company || ''}
            {(!user.job_title || user.job_title === 'N/A') && !user.company ? 'N/A' : ''}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const isBlocked = row.original.status === 'blocked';
      return <span className={cn(isBlocked && 'text-gray-400 dark:text-gray-500', 'px-3')}>{row.original.email}</span>;
    }
  },
  {
    accessorKey: 'last_login_date',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Last seen
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const isBlocked = user.status === 'blocked';
      const lastLogin = user.last_login_date;

      if (!lastLogin) {
        return <span className={cn('text-muted-foreground', isBlocked && 'text-gray-400 dark:text-gray-500', 'px-3')}>Never logged</span>;
      }
      try {
        const dateObject = parseISO(lastLogin);
        const relativeTime = formatDistanceToNow(dateObject, {
          addSuffix: true
        });
        return (
          <div title={dateObject.toLocaleString()} className={cn(isBlocked && 'text-gray-400 dark:text-gray-500', 'px-3')}>
            {relativeTime}
          </div>
        );
      } catch (error) {
        console.error('Error parsing last_login_date:', lastLogin, error);
        return (
          <div title={lastLogin || 'Invalid date'} className={cn(isBlocked && 'text-gray-400 dark:text-gray-500', 'px-3')}>
            {lastLogin ? new Date(lastLogin).toLocaleDateString() : 'Invalid date'}
          </div>
        );
      }
    }
  }
];

interface UserTableProps {
  columns: ColumnDef<UserData>[];
  data: UserData[];
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  emailFilterApplied: string;
}

export function UserTable({ columns, data, rowSelection, setRowSelection, sorting, setSorting, emailFilterApplied }: UserTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      columnVisibility
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true
  });

  useEffect(() => {
    table.getColumn('email')?.setFilterValue(emailFilterApplied);
  }, [emailFilterApplied, table]);

  return (
    <div className="rounded-b-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
