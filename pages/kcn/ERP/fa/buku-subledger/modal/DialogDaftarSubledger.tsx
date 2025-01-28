import React, { useEffect, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { DaftarSupplier, DaftarUangMuka, ListSubledger } from '../model/api';
import { swalToast } from '../interface/template';
import { GetListDataBukuSubledger, HandleSearchNamaSubledger, HandleSearchNoSubledger } from '../functional/fungsiForm';
import moment from 'moment';

interface DialogDaftarSubledgerProps {
    visible: boolean;
    stateDataHeader: any;
    setStateDataHeader: Function;
    filteredDataSubledger: any;
    setStateDataArray: any;
    kode_entitas: any;
    stateDataArray: any;
    token: any;
}

const DialogDaftarSubledger: React.FC<DialogDaftarSubledgerProps> = ({
    visible,
    stateDataHeader,
    setStateDataHeader,
    filteredDataSubledger,
    setStateDataArray,
    kode_entitas,
    stateDataArray,
    token,
}) => {
    let buttonDaftarSubledger: ButtonPropsModel[];
    let currentDaftarSubledger: any[] = [];
    let gridDaftarSubledger: Grid | any;
    let dialogDaftarSubledger: Dialog | any;
    const refDataSubledger = useRef('');

    if (stateDataArray?.dataDaftarSubledger === undefined) {
    } else {
        refDataSubledger.current = stateDataArray?.dataDaftarSubledger;
    }
    buttonDaftarSubledger = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarSubledger = gridDaftarSubledger.getSelectedRecords();
                if (currentDaftarSubledger.length > 0) {
                    handleClickDaftarSubledger(currentDaftarSubledger, '', 'pilih');
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        dialogDaftarSubledgerVisible: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data akun</p>',
                        width: '100%',
                        target: '#dialogDaftarSubledger',
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                //iconCss: 'e-icons e-close',
                cssClass: 'e-primary e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                handleHapusRowCloseGrid();
            },
        },
    ];

    const handleClickDaftarSubledger = async (data: any, object: any, tipe: any) => {
        let noSubledger: any;
        const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            kode_subledger: tipe === 'pilih' ? data[0].kode_subledger : object.kode_subledger,
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
                noSubValue: data[0].no_subledger,
                namaSubValue: data[0].nama_subledger,
                kodeSubValue: data[0].kode_subledger,
                dialogDaftarSubledgerVisible: false,
                viewTipe: stateDataHeader?.namaAkunValue === 'Uang Muka Pembelian' || stateDataHeader?.namaAkunValue === 'UANG MUKA SUPPLIER' ? stateDataHeader?.namaAkunValue : stateDataHeader?.tipeAkun,
            }));
            noSubledger = data[0].no_subledger;
        } else {
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                noSubValue: object.no_subledger,
                namaSubValue: object.nama_subledger,
                kodeSubValue: object.kode_subledger,
                dialogDaftarSubledgerVisible: false,
                viewTipe: stateDataHeader?.namaAkunValue === 'Uang Muka Pembelian' || stateDataHeader?.namaAkunValue === 'UANG MUKA SUPPLIER' ? stateDataHeader?.namaAkunValue : stateDataHeader?.tipeAkun,
            }));
            noSubledger = object.no_subledger;
        }

        const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
        await setStateDataArray((prevState: any) => ({
            ...prevState,
            recordsData: getListDataBukuSubledger,
        }));

        const respListSupplier: any[] = await DaftarSupplier(kode_entitas);

        const filterlistSupplier = await respListSupplier.filter((supp: any) => supp.no_supp === noSubledger);
        if (filterlistSupplier.length > 0) {
            const respListUangMuka: any[] = await DaftarUangMuka(kode_entitas, filterlistSupplier[0].kode_supp);
            await setStateDataArray((prevState: any) => ({
                ...prevState,
                dataDaftarUangMuka: respListUangMuka,
            }));
        }
    };

    const handleDoubleClickDaftarSubledger = async (args: any) => {
        const object = args.rowData;
        await handleClickDaftarSubledger('', object, 'doubleClick');
    };

    const handleHapusRowCloseGrid = async () => {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSubledgerVisible: false,
            searchNoSubledger: '',
            searchNamaSubledger: '',
            searchKeywordNamaSubledger: '',
            searchKeywordNoSubledger: '',
        }));
        const searchNoSubledger = document.getElementById('searchNoSubledger') as HTMLInputElement;
        if (searchNoSubledger) {
            searchNoSubledger.value = '';
        }
        const searchNamaSubledger = document.getElementById('searchNamaSubledger') as HTMLInputElement;
        if (searchNamaSubledger) {
            searchNamaSubledger.value = '';
        }
    };

    return (
        <DialogComponent
            id="dialogDaftarSubledger"
            target="#main-target"
            style={{ position: 'fixed' }}
            header={() => {
                return (
                    <div>
                        <div className="header-title" style={{ width: '93%' }}>
                            Daftar Akun Pembantu (Subledger)
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
            height="47%"
            buttons={buttonDaftarSubledger}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarSubledger.clearSelection();
                handleHapusRowCloseGrid();
                if (stateDataHeader?.searchNoSubledger != '' || stateDataHeader?.searchNamaSubledger != '') {
                    gridDaftarSubledger.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFocusOpenCust === 'inputNoSubledger') {
                    setTimeout(function () {
                        document.getElementById('searchNoSubledger')?.focus();
                    }, 100);
                } else if (stateDataHeader?.tipeFocusOpenCust === 'inputNamaSubledger') {
                    setTimeout(function () {
                        document.getElementById('searchNamaSubledger')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaSubledger')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoSubledger"
                    name="searchNoSubledger"
                    className="searchNoSubledger"
                    placeholder="<No. Subledger>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoSubledger}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoSubledger(value, setStateDataHeader, setStateDataArray, refDataSubledger.current);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaSubledger"
                    name="searchNamaSubledger"
                    className="searchNamaSubledger"
                    placeholder="<Nama Subledger>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNamaSubledger}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaSubledger(value, setStateDataHeader, setStateDataArray, refDataSubledger.current);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarSubledger"
                locale="id"
                ref={(g) => (gridDaftarSubledger = g)}
                dataSource={stateDataHeader?.searchKeywordNoSubledger !== '' || stateDataHeader?.searchKeywordNamaSubledger !== '' ? filteredDataSubledger : refDataSubledger.current}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={handleDoubleClickDaftarSubledger}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_subledger" headerText="No. Subledger" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_subledger" headerText="Keterangan" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSubledger;
