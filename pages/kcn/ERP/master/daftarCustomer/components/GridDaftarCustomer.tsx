import React from 'react';
import { ColumnDirective, ColumnsDirective, Edit, ExcelExport, Filter, Freeze, GridComponent, Group, Inject, Page, PdfExport, Reorder, Resize, Selection, Sort } from '@syncfusion/ej2-react-grids';

interface GridCustomer {
    gridRef: any;
    customerData: any[];
    recordDoubleClickHandle: (args: any) => void;
    rowSelectedHandle: (args: any) => void;
}
const GridDaftarCustomer = ({ gridRef, customerData, recordDoubleClickHandle, rowSelectedHandle }: GridCustomer) => {
    const queryCellInfoListData = (args: any) => {
        const field = args.column?.field;
        const data = args.data;

        if (field === 'nama_relasi') {
            if (data && data.terima_dokumen === 'N') {
                args.cell.style.background = '#FADFBF';
                args.cell.style.color = '#F70000';
            }
            if (data && data.kelas === 'N') {
                args.cell.style.background = '#00ffffa2';
                args.cell.style.color = '#003cff';
            }
        }

        if (data && data.aktif !== 'Y') {
            args.cell.style.color = 'rgba(52, 52, 52, 0.7)';
        }

        if (field === 'no_cust') {
            if (data && data.recNo % 2 === 0) {
                args.cell.style.background = '#FFFFF0';
            }
        }

        if (field === 'tgl_selesai') {
            args.cell.style.background = '#80FFFF';
        }
    };
    return (
        <GridComponent
            id="gridListData"
            locale="id"
            dataSource={customerData}
            allowExcelExport={true}
            ref={gridRef}
            allowPdfExport={true}
            editSettings={{ allowDeleting: true }}
            selectionSettings={{
                mode: 'Row',
                type: 'Single',
            }}
            allowPaging={true}
            allowSorting={true}
            allowFiltering={false}
            allowResizing={true}
            autoFit={true}
            allowReordering={true}
            pageSettings={{
                pageSize: 25,
                pageCount: 5,
                pageSizes: ['25', '50', '100', 'All'],
            }}
            rowHeight={22}
            height={'58vh'}
            gridLines={'Both'}
            loadingIndicator={{ indicatorType: 'Spinner' }}
            queryCellInfo={queryCellInfoListData}
            recordDoubleClick={recordDoubleClickHandle}
            rowSelecting={rowSelectedHandle}
        >
            <ColumnsDirective>
                <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" isFrozen={true} />
                <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="250" clipMode="EllipsisWithTooltip" isFrozen={true} />
                <ColumnDirective field="tgl_register" headerText="Tgl. Register" headerTextAlign="Center" textAlign="Center" width={80} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="kelas" headerText="Klasifikasi" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                <ColumnDirective
                    field="telp"
                    headerText="Telp"
                    headerTextAlign="Center"
                    textAlign="Center"
                    // autoFit
                    width="100"
                    clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective field="hp" headerText="No. HP" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="no_hp2" headerText="WhatsApp" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="area" headerText="Kode RA" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="lokasi" headerText="Wilayah Penjualan" headerTextAlign="Center" textAlign="Center" autoFit clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="kecamatan" headerText="Kecamatan" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="kelurahan" headerText="Kelurahan" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="nama_sales" headerText="SalesMan" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="plafond" headerText="Plafond Kredit" headerTextAlign="Center" textAlign="Right" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="nama_termin" headerText="Termin" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" autoFit clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="nama_bank" headerText="Nama Bank" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="no_rekening" headerText="No. Rekening" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                <ColumnDirective field="nama_rekening" headerText="Nama Rekening" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
            </ColumnsDirective>
            <Inject services={[Freeze, Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder, ExcelExport, PdfExport]} />
        </GridComponent>
    );
};

export default GridDaftarCustomer;
