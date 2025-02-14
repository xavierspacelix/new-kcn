import React from 'react';
import { PotensiaProdukProps } from '../../functions/definition';
import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids';

interface DaftarKontakProps {
    dataSource: PotensiaProdukProps[];
    params: {
        userid: string;
        kode_cust: string;
    };
    setFormPotensialProdukField: React.Dispatch<React.SetStateAction<PotensiaProdukProps[]>>;
}
let gridPotensialProdukType: GridComponent;
const PotentialProduk = ({ dataSource, params, setFormPotensialProdukField }: DaftarKontakProps) => {
    return (
        <GridComponent
            id="gridListData"
            locale="id"
            dataSource={dataSource}
            allowExcelExport={true}
            ref={(gridDK: GridComponent) => (gridPotensialProdukType = gridDK as GridComponent)}
            allowPdfExport={true}
            editSettings={{ allowEditing: true, allowDeleting: true }}
            selectionSettings={{
                mode: 'Row',
                type: 'Single',
            }}
            allowSorting={true}
            allowResizing={true}
            allowReordering={true}
            pageSettings={{
                pageSize: 25,
                pageCount: 5,
                pageSizes: ['25', '50', '100', 'All'],
            }}
            rowHeight={22}
            height={'40vh'}
            gridLines={'Both'}
            rowSelected={(args) => {
                // setEditValue(args.data);
            }}
            loadingIndicator={{ indicatorType: 'Spinner' }}
            recordDoubleClick={() => {
                // myAlertGlobal('Untuk Mengedit Data Gunakan Tombol Dibawah Tabel.', 'dialogCustomer', 'warning');
                // gridDKType.editModule.closeEdit();
            }}
        >
            <ColumnsDirective>
                <ColumnDirective width={200} field="kategori" headerText="Kategori" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="kelompok" headerText="Kelompok" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                <ColumnDirective width={200} field="catatan" headerText="Catatan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
            </ColumnsDirective>
        </GridComponent>
    );
};

export default PotentialProduk;
