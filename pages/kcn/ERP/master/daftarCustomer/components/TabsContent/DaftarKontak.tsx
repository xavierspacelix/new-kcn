import React from 'react';
import { ColumnDirective, ColumnsDirective, Edit, Grid, GridComponent, Inject, Sort, Toolbar } from '@syncfusion/ej2-react-grids';
import { dKTabInterface } from '../Template';
import DialogDaftarKontak from '../Dialog/DialogDaftarKontak';
interface DaftarKontakProps {
    dataSource: dKTabInterface[];
    params: {
        userid: string;
        kode_cust: string;
        kode_relasi?: string;
        nama_relasi?: string;
        entitas: string;
        token: string;
        kotaArray: any[];
        kecamatanArray: any[];
        kelurahanArray: any[];
        provinsiArray: any[];
        negaraArray: any[];
    };
}
let gridDKType: Grid;
const DaftarKontak = ({ dataSource, params }: DaftarKontakProps) => {
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const [stateKontak, setStateKontak] = React.useState('ready');
    const [kontak, setKontak] = React.useState<dKTabInterface>({
        kode_relasi: params.kode_relasi ?? '',
        id_relasi: 0,
        nama_lengkap: '',
        nama_person: '',
        jab: '',
        hubungan: '',
        bisnis: '',
        bisnis2: '',
        telp: '',
        hp: '',
        hp2: '',
        fax: '',
        email: '',
        catatan: '',
        file_kuasa: '',
        file_ktp: '',
        file_ttd: '',
        aktif_kontak: '',
    });
    const actionBegin = (args: any) => {
        if (args.requestType === 'add') {
            setStateKontak(args.requestType);
            setKontak({
                kode_relasi: params.kode_relasi ?? '',
                id_relasi: 0,
                nama_lengkap: '',
                nama_person: '',
                jab: '',
                hubungan: '',
                bisnis: '',
                bisnis2: '',
                telp: '',
                hp: '',
                hp2: '',
                fax: '',
                email: '',
                catatan: '',
                file_kuasa: '',
                file_ktp: '',
                file_ttd: '',
                aktif_kontak: '',
            });
            setIsOpenDialog(true);
        }
    };

    return (
        <>
            <GridComponent
                id="gridListData"
                locale="id"
                dataSource={dataSource}
                allowExcelExport={true}
                ref={(gridDK: GridComponent) => (gridDKType = gridDK as GridComponent)}
                allowPdfExport={true}
                editSettings={{ allowEditing: true, allowAdding: true, allowDeleting: true }}
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
                actionBegin={actionBegin}
                actionComplete={() => {}}
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
            {/* {isOpenDialog && ( */}
                <DialogDaftarKontak
                    isOpen={isOpenDialog}
                    onClose={() => {
                        setIsOpenDialog(false);
                    }}
                    params={params}
                    state={stateKontak}
                    setParams={undefined}
                    args={kontak}
                    requestType={''}
                />
            {/* )} */}
        </>
    );
};

export default DaftarKontak;
