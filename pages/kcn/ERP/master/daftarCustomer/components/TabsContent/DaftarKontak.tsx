import React from 'react';
import { ColumnDirective, ColumnsDirective, Edit, GridComponent, Inject, Sort, Toolbar } from '@syncfusion/ej2-react-grids';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

interface DaftarKontakProps {
    gridRef: any;
    daftarKontak: any[];
    actionBeginHandle: (args: any) => void;
    editBeginHandle: (args: any) => void;
}
const DaftarKontak = ({ gridRef, daftarKontak, actionBeginHandle, editBeginHandle }: DaftarKontakProps) => {

    return (
        <GridComponent
            id="gridListData"
            locale="id"
            dataSource={daftarKontak}
            allowExcelExport={true}
            ref={gridRef}
            allowPdfExport={true}
            editSettings={{ allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Bottom' }}
            selectionSettings={{
                mode: 'Row',
                type: 'Single',
            }}
            toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
            allowSorting={true}
            allowResizing={true}
            // autoFit={true}
            allowReordering={true}
            pageSettings={{
                pageSize: 25,
                pageCount: 5,
                pageSizes: ['25', '50', '100', 'All'],
            }}
            rowHeight={22}
            height={'40vh'}
            gridLines={'Both'}
            loadingIndicator={{ indicatorType: 'Spinner' }}
            actionBegin={actionBeginHandle}
            // beginEdit={editBeginHandle}
            // recordDoubleClick={recordDoubleClickHandle}
            // rowSelecting={rowSelectedHandle}
        >
            <ColumnsDirective>
                <ColumnDirective width={200} field="nama_lengkap" headerText="Nama Lengkap" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="nama_person" headerText="Panggilan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="jab" headerText="Jabatan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="hubungan" headerText="Hubungan Kepemilikan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="bisnis" headerText="Telp. Kantor" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="hp2" headerText="WhatsApp" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="catatan" headerText="Catatan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
            </ColumnsDirective>
            <Inject services={[Edit, Sort, Toolbar]} />
        </GridComponent>
    );
};

export default DaftarKontak;
