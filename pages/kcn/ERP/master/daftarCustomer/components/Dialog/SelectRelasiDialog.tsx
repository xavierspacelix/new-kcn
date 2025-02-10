import { myAlertGlobal } from '@/utils/routines';
import React from 'react';
import { fetchDaftarRelasi } from '../../functions/definition';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import stylesHeader from './customerHeader.module.css';
import { ColumnDirective, ColumnsDirective, Filter, GridComponent, Group, Inject, Page, Sort } from '@syncfusion/ej2-react-grids';
import { iPTabValue } from '../Template';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
interface RelasiProps {
    kode_relasi: string;
    nama_relasi: string;
    alamat: string;
    alamat2: string;
    kodepos: string;
    kota: string;
    kelurahan: string;
    kecamatan: string;
    propinsi: string;
    negara: string;
    npwp: string;
    siup: string;
    personal: string;
    ktp: string;
    sim: string;
    telp: string;
    telp2: string;
    hp: string;
    hp2: string;
    fax: string;
    email: string;
    website: string;
}
interface NewEditProps {
    isOpen: boolean;
    onClose: (args: any) => void;
    params: {
        entitas: string;
        token: string;
    };
}
type iPTabInterface = {
    id: number;
    name: string;
    label: string;
    type: string;
    value: string;
    options?: SelectionItem[];
    isAction?: boolean;
    icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    readOnly: boolean;
    hint?: string;
};

type SelectionItem = {
    name?: string;
    label: string;
    value: string | boolean;
};
let gridRelasiType: GridComponent;
const SelectRelasiDialog = ({ isOpen, onClose, params }: NewEditProps) => {
    const [relasiSource, setRelasiSource] = React.useState<RelasiProps[]>([]);
    const [showLoader, setShowLoader] = React.useState(false);
    const [filter, setFilter] = React.useState({
        kode_relasi: '',
        nama_relasi: '',
    });
    const [iPTab, setIPTab] = React.useState<any[]>([
        {
            id: 1,
            name: 'alamat',
            label: 'Alamat',
            value: '',
            visible: true,
        },
        {
            id: 2,
            name: 'alamat2',
            value: '',
            label: '',
        },
        {
            id: 3,
            name: 'kota',
            label: 'Kota',
            value: '',
            visible: true,
        },
        {
            id: 4,
            name: 'kodepos',
            label: 'Kode Pos',
            type: 'number',
            value: '',
            visible: true,
        },
        {
            id: 5,
            name: 'kecamatan',
            label: 'Kecamatan',
            value: '',
            visible: true,
        },
        {
            id: 6,
            name: 'propinsi',
            label: 'Provinsi',
            value: '',
            visible: true,
        },
        {
            id: 7,
            name: 'kelurahan',
            label: 'Kelurahan',
            value: '',
            visible: true,
        },
        {
            id: 8,
            name: 'negara',
            label: 'Negara',
            value: '',
            visible: true,
        },
        {
            id: 9,
            name: 'npwp',
            label: 'No. NPWP',
            value: '',
            visible: true,
        },
        {
            id: 10,
            name: 'siup',
            label: 'No. SIUP',
            value: '',
            visible: true,
        },
        {
            id: 11,
            name: 'personal',
            label: 'Personal',
            value: '',
            visible: true,
        },
        {
            id: 12,
            name: 'ktp',
            label: 'No. KTP',
            value: '',
            visible: true,
        },
        {
            id: 13,
            name: 'sim',
            label: 'No. SIM',
            value: '',
            visible: true,
        },
        {
            id: 14,
            name: 'telp',
            label: 'Telepon 1',
            value: '',
            visible: true,
        },
        {
            id: 15,
            name: 'telp2',
            label: 'Telepon 2',
            value: '',
            visible: true,
        },
        {
            id: 16,
            name: 'hp',
            label: 'Handphone',
            value: '',
            visible: true,
        },
        {
            id: 17,
            name: 'hp2',
            label: 'No. Whatsapp',
            value: '',
            visible: true,
        },
        {
            id: 18,
            name: 'fax',
            label: 'Facimile',
            value: '',
            visible: true,
        },
        {
            id: 19,
            name: 'email',
            label: 'Email',
            value: '',
            visible: true,
        },
        {
            id: 20,
            name: 'website',
            label: 'Website',
            value: '',
            visible: true,
        },
        {
            id: 21,
            name: 'kode_relasi',
            label: 'Kode Relasi',
            value: '',
            visible: false,
        },
        {
            id: 22,
            name: 'nama_relasi',
            label: 'Nama Relasi',
            value: '',
            visible: false,
        },
    ]);

    const fecthRelasiData = async () => {
        try {
            setShowLoader(true);
            await fetchDaftarRelasi(params.entitas, params.token).then((res) => {
                setRelasiSource(res);
            });
        } catch (error) {
            setShowLoader(false);
            myAlertGlobal(`Terjadi Kesalahan Server! ${error}`, 'dialogCustomer', 'warning');
        } finally {
            setShowLoader(false);
        }
    };
    const footerTemplateDlg = () => {
        return (
            <div className="mx-auto flex items-center justify-between">
                <div className="flex items-center justify-between ">
                    <ButtonComponent
                        id="btnNewRelasi"
                        cssClass="e-primary e-small"
                        style={{
                            width: 'auto',
                            backgroundColor: '#e6e6e6',
                            color: 'black',
                        }}
                        //  {/*  TODO: onClick */}
                        onClick={() => {}}
                        content="Relasi Baru"
                        iconCss="e-icons e-medium e-chevron-right"
                    ></ButtonComponent>
                </div>

                <div className="flex">
                    {/* TODO: onClick */}
                    <div className="e-btn e-danger e-small" onClick={closeDialog}>
                        Pilih
                    </div>
                    <div className="e-btn e-danger e-small" onClick={closeDialog}>
                        Batal
                    </div>
                </div>
            </div>
        );
    };
    const rowSelectingListData = (args: any) => {
        const data = args.data;
        const detailField = iPTab
            .filter((item) => data.hasOwnProperty(item.name))
            .map((item) => ({
                ...item,
                value: data[item.name] ?? '',
            }));
        setIPTab(detailField);
    };
    const closeDialog = () => {
        if (gridRelasiType) {
            if (gridRelasiType?.getSelectedRecords().length > 0) {
                console.log('MASUK KE SESI INI');
                onClose(gridRelasiType?.getSelectedRecords());
            } else {
                myAlertGlobal(`Silahkan Pilih Data Terlebih Dahulu!`, 'DialogSelecteRelasi', 'warning');
            }
        } else {
            myAlertGlobal(`Terjadi Kesalahan Server! Mohon Coba Lagi`, 'DialogSelecteRelasi', 'warning');
        }
    };
    React.useEffect(() => {
        if (isOpen) {
            fecthRelasiData();
        }
    }, [isOpen]);

    return (
        <DialogComponent
            id="DialogSelecteRelasi"
            isModal={true}
            width="40%"
            height="100%"
            visible={isOpen}
            close={closeDialog}
            header={'Daftar Relasi'}
            position={{ X: 'right', Y: 'center' }}
            showCloseIcon={true}
            target="#dialogCustomer"
            closeOnEscape={false}
            footerTemplate={footerTemplateDlg}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            enableResize={true}
        >
            <div>
                <div className="flex flex-col gap-3">
                    <div className={`panel-tabel col-span-full`} style={{ width: '100%' }}>
                        <table className={`${stylesHeader.table}`}>
                            <thead>
                                <tr>
                                    <th style={{ width: '50%' }}>No. Register</th>
                                    <th style={{ width: '50%' }}>Nama Lengkap</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextBoxComponent
                                            className={`${stylesHeader.inputTableBasic}`}
                                            name="kode_relasi"
                                            value={filter.kode_relasi}
                                            onChange={(args: any) => {
                                                if (gridRelasiType) {
                                                    if (gridRelasiType && gridRelasiType.searchSettings) {
                                                        gridRelasiType.searchSettings.fields = ['kode_relasi'];
                                                        gridRelasiType.searchSettings.key = args.value;
                                                    }
                                                }
                                            }}
                                            style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                        />
                                    </td>
                                    <td>
                                        <TextBoxComponent
                                            className={`${stylesHeader.inputTableBasic}`}
                                            name="nama_relasi"
                                            value={filter.nama_relasi}
                                            onChange={(args: any) => {
                                                if (gridRelasiType) {
                                                    if (gridRelasiType && gridRelasiType.searchSettings) {
                                                        gridRelasiType.searchSettings.fields = ['nama_relasi'];
                                                        gridRelasiType.searchSettings.key = args.value;
                                                    }
                                                }
                                            }}
                                            style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <GridComponent
                        id="gridRelasiList"
                        name="gridRelasiList"
                        className="gridRelasiList"
                        selectedRowIndex={1}
                        ref={(gridRelasi: GridComponent) => (gridRelasiType = gridRelasi as GridComponent)}
                        locale="id"
                        dataSource={relasiSource}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        allowResizing={true}
                        width={'580px'}
                        height={120} //170 barang jadi 150 barang produksi
                        gridLines={'Both'}
                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                        rowSelecting={rowSelectingListData}
                        pageSettings={{
                            pageSize: 25,
                        }}
                        recordDoubleClick={closeDialog}
                    >
                        <ColumnsDirective>
                            <ColumnDirective width={'210'} field="kode_relasi" isPrimaryKey={true} headerText="No. Register" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective width={'200'} field="nama_relasi" headerText="Nama Lengkap" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Page, Sort, Filter]} />
                    </GridComponent>
                    <div className="">
                        <div className="grid h-[360px] grid-cols-1 gap-1 overflow-auto p-1 md:grid-cols-2">
                            {iPTab
                                ?.filter((item: any) => item.visible)
                                .map((item, index) => {
                                    if (
                                        item.name.startsWith('kota') ||
                                        item.name.startsWith('kodepos') ||
                                        item.name.startsWith('propinsi') ||
                                        item.name.startsWith('kecamatan') ||
                                        item.name.startsWith('kelurahan') ||
                                        item.name.startsWith('kecamatan') ||
                                        item.name.startsWith('negara') ||
                                        item.name.startsWith('ktp') ||
                                        item.name.startsWith('sim') ||
                                        item.name.startsWith('telp') ||
                                        item.name.startsWith('telp2') ||
                                        item.name.startsWith('hp') ||
                                        item.name.startsWith('hp2')
                                    ) {
                                        return (
                                            <div key={item.name + index}>
                                                {item.label && <span className="e-label font-bold">{item.label}</span>}
                                                <div className="form-input">
                                                    <TextBoxComponent
                                                        id={item.name + index}
                                                        value={item.value}
                                                        onChange={(event: any) => {
                                                            // handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    } else if (item.name.startsWith('fax')) {
                                        return (
                                            <div key={item.name + index}>
                                                {item.label && <span className="e-label font-bold">{item.label}</span>}
                                                <div className="form-input">
                                                    <TextBoxComponent
                                                        id={item.name + index}
                                                        value={item.value}
                                                        onChange={(event: any) => {
                                                            // handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="col-span-2" key={item.name + index}>
                                                {item.label && <span className="e-label font-bold">{item.label}</span>}
                                                <div className="form-input">
                                                    <TextBoxComponent
                                                        id={item.name + index}
                                                        value={item.value}
                                                        onChange={(event: any) => {
                                                            // handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            {/* item.name.startsWith('alamat') ? (
                                     <div className="col-span-2" key={item.name + index}>
                                         <span className="e-label font-bold">{item.label}</span>
                                         <div className="form-input">
                                             <TextBoxComponent id={item.name + index} value={item.value} disabled />
                                         </div>
                                     </div>
                                 ) : (
                                     <></>
                                 )
                             )} */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </DialogComponent>
    );
};

export default SelectRelasiDialog;
