import React from 'react';
import {
    Grid,
    GridComponent,
    ColumnDirective,
    ColumnsDirective,
    Inject,
    Page,
    Edit,
    Sort,
    Filter,
    Group,
    Resize,
    Reorder,
    Selection,
    ExcelExport,
    PdfExport,
    rowSelected,
} from '@syncfusion/ej2-react-grids';

const GridList = ({
    rowSelecting,
    bokList,
    handleSelect,
    handleRecordDoubleClick,
    formatDate,
    gridBok,
}: {
    rowSelecting: any;
    bokList: any;
    handleSelect: any;
    handleRecordDoubleClick: any;
    formatDate: any;
    gridBok: any;
}) => {
    const pilihTemplate = (args: any) => {
        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={`hitung_kpi`}
                    className="mx-auto"
                    checked={args.pilih === 'Y'}
                    disabled={args.st === 'Tertutup'}
                    onChange={() => {
                        const temp = args.pilih === 'Y' ? 'N' : 'Y';
                        const tempArray = {
                            ...gridBok.current!.dataSource[args.index],
                            pilih: args.pilih === 'Y' ? 'N' : 'Y',
                        };
                        gridBok.current!.dataSource[args.index] = tempArray;
                        gridBok.current!.refresh();
                    }}
                />
            </div>
        );
    };
    return (
        <GridComponent
            id="gridListData"
            locale="id"
            // dataSource={bokList}
            height={'60vh'}
            rowSelected={handleSelect}
            recordDoubleClick={handleRecordDoubleClick}
            allowPaging={true}
            gridLines="Both"
            allowResizing={true}
            allowSorting={true}
            ref={gridBok}
            pageSettings={{
                pageSize: 25,
                pageCount: 5,
                pageSizes: ['25', '50', '100', 'All'],
            }}
            rowHeight={23}
        >
            <ColumnsDirective>
                <ColumnDirective field="tgl_fk" format={formatDate} type={'date'} headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="no_fk" width="110" headerText="No. Bukti BOK" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="nopol" width="80" headerText="No. Kendaraan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="tujuan" headerText="Tujuan" headerTextAlign="Center" textAlign="Left" width="110" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="pengemudi" headerText="Pengemudi" headerTextAlign="Center" textAlign="Left" width="110" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="jumlah_mu" headerText="Jumlah (MU)" headerTextAlign="Center" textAlign="Right" format="N2" width="150" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="keterangan" headerText="Keterangan" headerTextAlign="Center" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="st" headerText="Status" headerTextAlign="Center" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="pilih" template={pilihTemplate} width="30" headerText="Pilih" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
            </ColumnsDirective>
            <Inject services={[Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder, ExcelExport, PdfExport]} />
        </GridComponent>
    );
};

export default GridList;
