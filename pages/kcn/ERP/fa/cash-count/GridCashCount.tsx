import React from 'react'
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

const GridCashCount = ({list_kas_opname,selectedRowHandle,gridCashCount,
    recordDoubleClick}:{list_kas_opname: any; selectedRowHandle: any;
        recordDoubleClick: any; gridCashCount: Grid | any}) => {
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy HH:ss' };
    const formatDateYM: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const headerNewLine = (value1: any, value2: any) => (
        <div style={{ textAlign: 'center', lineHeight: '1.5em' }}>
            {value1}
            <div>{value2}</div>
        </div>
    );

    const sokTemplate = (args: any) => {
        
        return (<div className='text-center'>
            {args.sok === "Y" ? "✔️" : ''} 
        </div>)
    }

    const sapTemplate = (args: any) => {
        
        return (<div className='text-center'>
            {args.sap === "Y" ? "✔️" : ''} 
        </div>)
    }

    const sfileTemplate = (args: any) => {
        
        return (<div className='text-center'>
            {args.sfile === "Y" ? "✔️" : ''} 
        </div>)
    }
  return (
    <>
    <style>
                                    {`
                    .e-row .e-rowcell:hover {
                        cursor: pointer;
                    }

                    .e-row.e-selectionbackground {
                        cursor: pointer;
                    }
                    .e-grid .e-headertext {
                        font-size: 11px !important;
                    }
                    .e-grid .e-rowcell {
                        font-size: 11px !important;
                    }
                `}
                                </style>
    <GridComponent
        id="gridListCashCount"
        locale="id"
        // dataSource={list_kas_opname}
        height={'60vh'}
        pageSettings={{
            pageSize: 25,
            pageCount: 5,
            pageSizes: ['25', '50', '100', 'All'],
        }}
        rowSelected={selectedRowHandle}
        recordDoubleClick={recordDoubleClick}
        allowPaging={true}
        gridLines="Both"
        allowResizing={true}
        allowReordering={true}
        allowSorting={true}
        rowHeight={23}
        // rowDataBound={rowDataBound}
        ref={gridCashCount}
    >
        <ColumnsDirective>
            <ColumnDirective field="tgl"  type={'date'} format={formatDateYM} headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="no_akun" width="80" headerText="No. Akun" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="nama_akun" width="130" headerText="Nama Akun Kas" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="nfisik" format="N2" headerTemplate={() => headerNewLine('saldo','Fisik')} headerText="Tujuan" headerTextAlign="Center" textAlign="Right" width="110" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="nsistem" format="N2"  headerTemplate={() => headerNewLine('saldo','Sistem')} headerText="Pengemudi" headerTextAlign="Center" textAlign="Right" width="110" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="nselisih" format="N2" headerTemplate={() => headerNewLine('Selisih','Fisik-Sistem')} headerText="Jumlah (MU)" headerTextAlign="Center" textAlign="Right"  width="110" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="napp" format="N2" headerTemplate={() => headerNewLine('Saldo','Belum Approved')} headerText="Keterangan" headerTextAlign="Center" textAlign="Right" width="110" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="sap" template={sapTemplate} headerTemplate={() => headerNewLine('Blm App.','Sesuai')} headerText="Status" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="sok" template={sokTemplate} headerTemplate={() => headerNewLine('Jumlah','Sesuai')} headerText="Status" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="sfile" template={sfileTemplate} headerTemplate={() => headerNewLine('File','Pendukung')} headerText="Status" headerTextAlign="Center" textAlign="Left" width="65" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="alasan" headerText="Catatan" headerTextAlign="Center" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="userid" headerText="userid" headerTextAlign="Center" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
            <ColumnDirective field="tgl_update" type='date' format={formatDate} headerTemplate={() => headerNewLine('Tgl. Update','Terakhir')} headerText="Tgl. Update" headerTextAlign="Center" textAlign="Left" width="130" clipMode="EllipsisWithTooltip" />
        </ColumnsDirective>
        <Inject services={[Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder, ExcelExport, PdfExport]} />
    </GridComponent>
    </>
  )
}

export default GridCashCount