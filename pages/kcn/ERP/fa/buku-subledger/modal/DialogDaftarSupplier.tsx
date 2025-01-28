import React, { useEffect } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { swalToast } from '../interface/template';
import { GetListDataBukuSubledger, HandleSearchNamaSupplier, HandleSearchNoSupplier } from '../functional/fungsiForm';
import moment from 'moment';
// import { DetailNoFakturPhu } from '../model/apiPhu';

interface DialogDaftarSupplierProps {
    visible: boolean;
    stateDataHeader: any;
    setStateDataHeader: Function;
    filteredDataSupplier: any;
    dataDaftarSupplier: any;
    setStateDataArray: any;
    kode_entitas: any;
    token: any;
}

const DialogDaftarSupplier: React.FC<DialogDaftarSupplierProps> = ({
    visible,
    stateDataHeader,
    setStateDataHeader,
    filteredDataSupplier,
    dataDaftarSupplier,
    setStateDataArray,
    kode_entitas,
    token,
}) => {
    let dialogDaftarSupplier: Dialog | any;
    let buttonDaftarSupplier: ButtonPropsModel[];
    let currentDaftarSupplier: any[] = [];
    let gridDaftarSupplier: Grid | any;
    let keyGrid: any;

    useEffect(() => {
        keyGrid = `${JSON.stringify(filteredDataSupplier)}`;
    }, [filteredDataSupplier]);

    buttonDaftarSupplier = [
        {
            buttonModel: {
                content: 'Pilih',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarSupplier = gridDaftarSupplier.getSelectedRecords();
                if (currentDaftarSupplier.length > 0) {
                    handleClickDaftarSupplier(currentDaftarSupplier, '', 'pilih');
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        dialogDaftarSupplierVisible: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data supplier</p>',
                        width: '100%',
                        target: '#dialogDaftarSupplier',
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: async () => {
                handleHapusRowCloseGrid();
            },
        },
    ];

    const handleHapusRowCloseGrid = async () => {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSupplierVisible: false,
            searchNoSupplier: '',
            searchNamaSupplier: '',
            searchKeywordNamaSupplier: '',
            searchKeywordNoSupplier: '',
        }));
        const searchNoSupplier = document.getElementById('searchNoSupplier') as HTMLInputElement;
        if (searchNoSupplier) {
            searchNoSupplier.value = '';
        }
        const searchNamaSupplier = document.getElementById('searchNamaSupplier') as HTMLInputElement;
        if (searchNamaSupplier) {
            searchNamaSupplier.value = '';
        }
    };

    const handleClickDaftarSupplier = async (data: any, object: any, tipe: any) => {
        const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            kode_subledger: tipe === 'pilih' ? data[0].kode_supp : object.kode_supp,
            kode_jual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
            no_kontrak_um: stateDataHeader?.noKontrakUm === '' ? 'all' : stateDataHeader?.noKontrakUm,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };

        if (tipe === 'pilih') {
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                noSubValue: data[0].no_supp,
                namaSubValue: data[0].nama_relasi,
                kodeSubValue: data[0].kode_supp,
                dialogDaftarSupplierVisible: false,
            }));
        } else {
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                noSubValue: object.no_supp,
                namaSubValue: object.nama_relasi,
                kodeSubValue: object.kode_supp,
                dialogDaftarSupplierVisible: false,
            }));
        }

        const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
        setStateDataArray((prevState: any) => ({
            ...prevState,
            recordsData: getListDataBukuSubledger,
        }));
    };

    const handleDoubleClickDaftarSupplier = async (args: any) => {
        const object = args.rowData;
        await handleClickDaftarSupplier('', object, 'doubleClick');
    };

    return (
        <DialogComponent
            id="dialogDaftarSupplier"
            target="#main-target"
            style={{ position: 'fixed' }}
            header={() => {
                return (
                    <div>
                        <div className="header-title" style={{ width: '93%' }}>
                            Daftar Supplier
                        </div>
                    </div>
                );
            }}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="40%"
            height="65%"
            buttons={buttonDaftarSupplier}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarSupplier.clearSelection();
                handleHapusRowCloseGrid();
                if (stateDataHeader?.searchNoSupplier != '' || stateDataHeader?.searchNamaSupplier != '') {
                    gridDaftarSupplier.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFocusOpenCust === 'inputNoSubledger') {
                    setTimeout(function () {
                        document.getElementById('searchNoSupplier')?.focus();
                    }, 100);
                } else if (stateDataHeader?.tipeFocusOpenCust === 'inputNamaSubledger') {
                    setTimeout(function () {
                        document.getElementById('searchNamaSupplier')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaSupplier')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoSupplier"
                    name="searchNoSupplier"
                    className="searchNoSupplier"
                    placeholder="<No. Supplier>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoSupplier}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoSupplier(value, setStateDataHeader, setStateDataArray, dataDaftarSupplier);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaSupplier"
                    name="searchNamaSupplier"
                    className="searchNamaSupplier"
                    placeholder="<Nama Supplier>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNamaSupplier}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaSupplier(value, setStateDataHeader, setStateDataArray, dataDaftarSupplier);
                    }}
                />
            </div>
            <GridComponent
                key={keyGrid}
                id="gridDaftarSupplier"
                locale="id"
                ref={(g) => (gridDaftarSupplier = g)}
                dataSource={stateDataHeader?.searchKeywordNoSupplier !== '' || stateDataHeader?.searchKeywordNamaSupplier !== '' ? filteredDataSupplier : dataDaftarSupplier}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'450'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={handleDoubleClickDaftarSupplier}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_supp" headerText="No. Supplier" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" width="20" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="130" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSupplier;
