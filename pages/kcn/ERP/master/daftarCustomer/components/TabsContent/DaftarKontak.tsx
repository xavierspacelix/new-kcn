import React from 'react';
import { Column, ColumnDirective, ColumnsDirective, DialogEditEventArgs, Edit, GridComponent, Inject, Sort, Toolbar } from '@syncfusion/ej2-react-grids';
import { baseFormDKField, dKTabInterface, dKTabValue } from '../Template';
import DialogDaftarKontak from '../Dialog/DialogDaftarKontak';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { myAlertGlobal } from '@/utils/routines';

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
    setFormDKField: React.Dispatch<React.SetStateAction<dKTabInterface[]>>;
}
let gridDKType: GridComponent;
const DaftarKontak = ({ dataSource, params, setFormDKField }: DaftarKontakProps) => {
    const [isOpenDialog, setIsOpenDialog] = React.useState(false);
    const [stateKontak, setStateKontak] = React.useState('ready');
    const [editValue, setEditValue] = React.useState<dKTabInterface>(dKTabValue);
    const deleteRecord = () => {
        gridDKType.deleteRecord();
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
                    setEditValue(args.data);
                }}
                loadingIndicator={{ indicatorType: 'Spinner' }}
                recordDoubleClick={() => {
                    myAlertGlobal('Untuk Mengedit Data Gunakan Tombol Dibawah Tabel.', 'dialogCustomer', 'warning');
                    gridDKType.editModule.closeEdit();
                }}
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
                <Inject services={[Edit, Sort]} />
            </GridComponent>
            <div className="panel-pager">
                <TooltipComponent content="Baru" opensOn="Hover" openDelay={5} target="#btnNew">
                    <TooltipComponent content="Ubah" opensOn="Hover" openDelay={5} target="#btnEdit">
                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={5} target="#btnDelete">
                            <TooltipComponent content="Info Detail Customer" opensOn="Hover" openDelay={5} target="#btnInfoDetail">
                                <div className="flex items-center justify-start gap-3">
                                    <div className="flex">
                                        <ButtonComponent
                                            id="btnNew"
                                            type="button"
                                            cssClass="e-primary e-small"
                                            iconCss="e-icons e-small e-plus"
                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                            onClick={() => {
                                                setStateKontak('new');
                                                let id = dataSource.length > 0 ? Math.max(...dataSource.map((item) => item.id_relasi)) + 1 : 1;
                                                setEditValue({
                                                    ...dKTabValue,
                                                    kode_relasi: params.kode_relasi ?? '',
                                                    id_relasi: id,
                                                });
                                                setIsOpenDialog(true);
                                            }}
                                        />
                                        <ButtonComponent
                                            id="btnEdit"
                                            type="button"
                                            cssClass="e-warning e-small"
                                            iconCss="e-icons e-small e-edit"
                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                            onClick={() => {
                                                const data = gridDKType.getSelectedRecords();
                                                if (data.length > 0) {
                                                    setEditValue(data[0] as dKTabInterface);
                                                    setStateKontak('edit');
                                                    setIsOpenDialog(true);
                                                } else {
                                                    myAlertGlobal('Pilih Data Yang Akan Diubah.', 'dialogCustomer', 'warning');
                                                }
                                            }}
                                        />
                                        <ButtonComponent
                                            id="btnDelete"
                                            type="button"
                                            cssClass="e-danger e-small"
                                            iconCss="e-icons e-small e-trash"
                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                            onClick={() => {
                                                deleteRecord();
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-[#BB6C74]">
                                        Untuk mengubah dan melihat detail file pendukung surat kuasa, ktp dan spesimen <br />
                                        penanggung jawab silahkan tekan tombol "Info Customer" pilih tab Daftar Kontak.
                                    </p>
                                    <ButtonComponent
                                        id="btnInfoDetail"
                                        type="button"
                                        iconCss="e-icons e-small e-description"
                                        cssClass="e-danger e-small"
                                        style={{
                                            width: 'auto',
                                            marginBottom: '0.5em',
                                            marginTop: 0.5 + 'em',
                                            marginRight: 0.8 + 'em',
                                            backgroundColor: '#e6e6e6',
                                            color: 'black',
                                        }}
                                        onClick={() => {
                                            console.log('dataSource', dataSource);
                                            gridDKType.refresh();
                                        }}
                                        content="Info Customer"
                                    />
                                </div>
                            </TooltipComponent>
                        </TooltipComponent>
                    </TooltipComponent>
                </TooltipComponent>
            </div>
            {isOpenDialog && (
                <DialogDaftarKontak
                    isOpen={isOpenDialog}
                    onClose={(args) => {
                        setFormDKField((prev: any) => [...prev, args]);
                        setIsOpenDialog(false);
                    }}
                    params={{
                        kode_relasi: params.kode_relasi,
                        nama_relasi: params.nama_relasi,
                        dataKontak: [editValue],
                    }}
                    state={stateKontak}
                />
            )}
        </>
    );
};

export default DaftarKontak;
