import Dropdown from '@/components/Dropdown';
import { getServerSideProps } from '@/pages/api/getServerSide';
import { IRootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sortBy from 'lodash/sortBy';
import router from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import {
    GroupingState,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getCoreRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    getSortedRowModel,
    PaginationState,
} from '@tanstack/react-table';
interface DataTableProps {
    data: any[]; // Ubah tipe data sesuai dengan data yang Anda gunakan
    columns: ColumnDef<any>[]; // Gunakan ColumnDef dari react-table
    userid: any;
    kode_entitas: any;
    propsDaftarRelasiListApi: any;
    propsUserid: any;
    propsKode_entitas: any;
    propsKirimDataList: any;
}
function TabelDaftarRelasi({ data, columns, kode_entitas, propsDaftarRelasiListApi, propsKirimDataList }: DataTableProps) {
    const rowData = propsDaftarRelasiListApi;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Daftar Relsai'));
    });
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'kode_relasi'));
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setInitialRecords(sortBy(rowData, 'kode_relasi'));
    }, [rowData]);
    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item: any) => {
                const kodeRelasi = item.kode_relasi ? item.kode_relasi.toLowerCase() : '';
                const namaRelasi = item.nama_relasi ? item.nama_relasi.toLowerCase() : '';
                const personal = item.personal ? item.personal.toLowerCase() : '';
                const telp = item.telp ? item.telp.toLowerCase() : '';
                const hp = item.hp ? item.hp.toLowerCase() : '';
                const hp2 = item.hp2 ? item.hp2.toString().toLowerCase() : '';
                const kelurahan = item.kelurahan ? item.kelurahan.toLowerCase() : '';
                const kecamatan = item.kecamatan ? item.kecamatan.toLowerCase() : '';
                const kota = item.kota ? item.kota.toLowerCase() : '';

                return (
                    kodeRelasi.includes(search.toLowerCase()) ||
                    namaRelasi.includes(search.toLowerCase()) ||
                    personal.includes(search.toLowerCase()) ||
                    telp.includes(search.toLowerCase()) ||
                    hp.includes(search.toLowerCase()) ||
                    hp2.includes(search.toLowerCase()) ||
                    kelurahan.includes(search.toLowerCase()) ||
                    kecamatan.includes(search.toLocaleLowerCase()) ||
                    kota.includes(search.toLocaleLowerCase())
                );
            });
        });
    }, [rowData, search]);

    const [selectedRow, setSelectedRow] = useState('');
    const handleRowClick = (kode_relasi: any) => {
        setSelectedRow(kode_relasi);
        propsKirimDataList(kode_relasi);
        if (!selectedRow) {
            // alert('Pilih List Daftar Relasi yang akan diedit');
        } else {
            const x = Buffer.from(`entitas=${kode_entitas}&kode_relasi=${selectedRow}&jenis=edit`).toString('base64');
            router.push({ pathname: './DialogRelasi', query: { x_: x } });
        }
    };
    // TODO: Tanstack
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [grouping, setGrouping] = useState<GroupingState>([]);
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    useEffect(() => {
        const from = pagination.pageIndex * pagination.pageSize;
        const to = from + pagination.pageSize;
        setRecordsData(initialRecords.slice(from, to));
    }, [pagination, initialRecords]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const table = useReactTable({
        data,
        columns,
        state: {
            grouping,
            sorting,
            pagination,
            columnVisibility,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: false,
    });

    return (
        <>
            <div className="mb-3 flex items-center justify-end gap-3">
                <div className="dropdown">
                    <Dropdown
                        placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                        btnClassName="inline-flex items-center text-gray-500 bg-white border border-blue-300 focus:outline-none hover:bg-blue-100 focus:ring-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-3 py-1.5 "
                        button={
                            <>
                                <span className="font-bold ltr:mr-1 rtl:ml-1">Filter Kolom</span>
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9L12 15L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </>
                        }
                    >
                        <ul className="!min-w-lg mt-3 w-[200px] rounded-lg bg-white !py-3">
                            {table.getAllLeafColumns().map((column) => {
                                console.log(column);

                                return (
                                    <li key={column.id} className="px-1">
                                        <label onClick={column.getToggleVisibilityHandler()} className="cursor-pointer">
                                            <input
                                                {...{
                                                    type: 'checkbox',
                                                    checked: column.getIsVisible(),
                                                    onChange: column.getToggleVisibilityHandler(),
                                                }}
                                                className="form-checkbox"
                                            />
                                            {String(column.columnDef.header)}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </Dropdown>
                </div>
                <div className="flex">
                    <div className="flex items-center justify-center rounded-l-lg border border-[#e0e6ed] bg-[#919191] px-3 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="h-5 w-5 text-white" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M21 21l-3.5-3.5M17 10a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={(value) => setGlobalFilter(String(value))}
                        className="inline-flex items-center rounded-r-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        placeholder="Cari..."
                    />
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-t-lg">
                <table className="w-full  text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                    <thead className=" text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400 ">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="!bg-gray-200 text-center ">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan} scope="col" className=" border-r  border-slate-400">
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? 'flex cursor-pointer select-none items-center justify-between'
                                                            : ' border-b border-slate-400 !px-0 !py-0 text-center'
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    title={
                                                        header.column.getCanSort()
                                                            ? header.column.getNextSortingOrder() === 'asc'
                                                                ? 'Sort ascending'
                                                                : header.column.getNextSortingOrder() === 'desc'
                                                                ? 'Sort descending'
                                                                : 'Clear sort'
                                                            : undefined
                                                    }
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: (
                                                            <svg
                                                                className="h-5 w-5 text-gray-800 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fill-rule="evenodd"
                                                                    d="M5.575 13.729C4.501 15.033 5.43 17 7.12 17h9.762c1.69 0 2.618-1.967 1.544-3.271l-4.881-5.927a2 2 0 0 0-3.088 0l-4.88 5.927Z"
                                                                    clip-rule="evenodd"
                                                                />
                                                            </svg>
                                                        ),
                                                        desc: (
                                                            <svg
                                                                className="h-5 w-5 text-gray-800 dark:text-white"
                                                                aria-hidden="true"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fill-rule="evenodd"
                                                                    d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
                                                                    clip-rule="evenodd"
                                                                />
                                                            </svg>
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => {
                            return (
                                <tr
                                    key={row.id}
                                    className="cursor-pointer border-b !border-slate-300 bg-white hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                    onClick={() => handleRowClick(row.original.kode_relasi)}
                                    // onClick={() => console.log(row.original.kode_relasi)}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <td
                                                {...{
                                                    key: cell.id,
                                                    style: {
                                                        background: cell.getIsGrouped() ? '#0aff0082' : cell.getIsAggregated() ? '#ffa50078' : cell.getIsPlaceholder() ? '#ff000042' : '',
                                                    },
                                                }}
                                                className={`whitespace-nowrap border-r border-slate-400 px-6 py-4 font-medium  dark:text-white ${
                                                    selectedRow === row.original.kode_relasi ? '!font-bold text-[#66AAEE]' : 'text-gray-900'
                                                }`}
                                            >
                                                <>
                                                    {cell.getIsGrouped() ? (
                                                        // If it's a grouped cell, add an expander and row count
                                                        <>
                                                            <button
                                                                {...{
                                                                    onClick: row.getToggleExpandedHandler(),
                                                                    style: {
                                                                        cursor: row.getCanExpand() ? 'pointer' : 'normal',
                                                                    },
                                                                }}
                                                            >
                                                                {row.getIsExpanded() ? '👇' : '👉'} {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row.subRows.length})
                                                            </button>
                                                        </>
                                                    ) : cell.getIsAggregated() ? (
                                                        // If the cell is aggregated, use the Aggregated
                                                        // renderer for cell
                                                        flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
                                                    ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                                                        // Otherwise, just render the regular cell
                                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    )}
                                                </>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="relative flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                            !table.getCanPreviousPage() ? 'disabled cursor-not-allowed text-gray-500' : 'text-gray-900'
                        }`}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                            !table.getCanPreviousPage() ? 'disabled cursor-not-allowed text-gray-500' : 'text-gray-900'
                        }`}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
                    <div className="flex items-center justify-center gap-3">
                        <p className="flex gap-1 text-sm text-gray-700">
                            Showing
                            <span className="font-medium">{table.getRowModel().rows.length.toLocaleString()}</span>
                            of
                            <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>
                        </p>
                        <div className="inline-flex max-w-lg items-center">
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <nav className="isolate inline-flex space-x-2 rounded-md shadow-sm" aria-label="Pagination">
                            <span className="flex items-center gap-1">
                                <div>Page</div>
                                <strong>
                                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
                                </strong>
                            </span>
                            <button
                                className={`relative inline-flex items-center rounded-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                    !table.getCanPreviousPage() ? 'disabled cursor-not-allowed text-gray-500' : 'text-gray-900'
                                }`}
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Previous</span>
                            </button>
                            <button
                                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                                    !table.getCanNextPage() ? 'disabled cursor-not-allowed text-gray-500' : 'text-gray-900'
                                }`}
                                onClick={() => {
                                    const newPageIndex = pagination.pageIndex + 1;
                                    setPagination({ ...pagination, pageIndex: newPageIndex });
                                }}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path
                                        fillRule="evenodd"
                                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
export default TabelDaftarRelasi;
export { getServerSideProps };
