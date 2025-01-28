import React from 'react';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';

const pageSettings = {
    pageSize: 25,
    pageCount: 5,
    pageSizes: ['25', '50', '100', 'All'],
}
export default function GridKendaraanList({
    list_kendaraan,
    rowselectHandle,
    recordDoubleClickHandle,
    nonAktifTemplate,
    armadaKirimTemplate,
    hitungKPI,
    gridKendaraan
}: {
    list_kendaraan: any;
    rowselectHandle: any;
    recordDoubleClickHandle: any;
    nonAktifTemplate: any;
    armadaKirimTemplate: any;
    hitungKPI: any;
    gridKendaraan: any
}) {
    return (
        <GridComponent
            id="GridList"
            locale="id"
            ref={gridKendaraan}
            // dataSource={list_kendaraan}
            height={'60vh'}
            pageSettings={pageSettings}
            rowSelected={rowselectHandle}
            recordDoubleClick={recordDoubleClickHandle}
            allowPaging={true}
            width={'100%'}
            gridLines="Both"
            allowResizing={true}
            allowReordering={true}
            allowSorting={true}
            rowHeight={23}
        >
            <ColumnsDirective>
                <ColumnDirective field="nopol" headerText="No. Kendaraan" headerTextAlign="Center" textAlign="Left" width="120" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="merek" autoFit={true} headerText="Merek" headerTextAlign="Center" textAlign="Left" width="90" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="tahun_buat" headerText="Tahun" headerTextAlign="Center" textAlign="Left" width="90" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="jenis" autoFit={true} headerText="Jenis Kendaraan" headerTextAlign="Center" textAlign="Left" width="90" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="nobpkb" headerText="No. BPKB" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="aktif" template={nonAktifTemplate} headerText="Non Aktif" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                <ColumnDirective
                    field="armada_kirim"
                    autoFit={true}
                    template={armadaKirimTemplate}
                    headerText="Armada Kirim"
                    headerTextAlign="Center"
                    textAlign="Left"
                    width="60"
                    clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective field="hitungkpi" template={hitungKPI} headerText="Hitung KPI" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
            </ColumnsDirective>
            <Inject services={[Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder, ExcelExport, PdfExport]} />
        </GridComponent>
    );
}
