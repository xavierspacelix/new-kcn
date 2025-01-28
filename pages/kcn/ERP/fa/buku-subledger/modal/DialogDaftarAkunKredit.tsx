import React, { useEffect, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import moment from 'moment';
import styles from '../style.module.css';
import { DaftarAkunKredit, ListSubledger } from '../model/api';
// import { GetListDataBukuBesar } from '../component/fungsiForm';

interface DialogDaftarAkunKreditProps {
    visible: boolean;
    stateDataHeader: any;
    setStateDataHeader: any;
    dataDaftarAkunKredit: any;
    filteredDataAkunKredit: any;
    swalToast: any;
    HandleSearchNoAkun: any;
    HandleSearchNamaAkun: any;
    TemplateNoAkun: any;
    TemplateNamaAkun: any;
    setStateDataArray: Function;
    // setRecordsData: Function;
    kode_entitas: any;
    token: any;
    refDataArray: any;
    vRefreshData: any;
}

let gridKeyDaftarAkunKredit = ``;
const DialogDaftarAkunKredit: React.FC<DialogDaftarAkunKreditProps> = ({
    visible,
    stateDataHeader,
    setStateDataHeader,
    dataDaftarAkunKredit,
    filteredDataAkunKredit,
    swalToast,
    HandleSearchNoAkun,
    HandleSearchNamaAkun,
    TemplateNoAkun,
    TemplateNamaAkun,
    setStateDataArray,
    // setRecordsData,
    kode_entitas,
    token,
    refDataArray,
    vRefreshData,
}) => {
    let buttonDaftarAkunKredit: ButtonPropsModel[];
    let currentDaftarAkunKredit: any[] = [];
    // let gridDaftarAkunKredit: Grid | any;
    let dialogDaftarAkunKredit: Dialog | any;
    gridKeyDaftarAkunKredit = `${moment().format('HHmmss')}-${JSON.stringify(dataDaftarAkunKredit)}`;
    const gridDaftarAkunKredit = useRef<GridComponent>(null);

    interface DaftarAkunKredit {
        header: string;
        tipe: string;
        // tambahkan properti lainnya sesuai kebutuhan
    }

    const paramobject = {
        kode_entitas: kode_entitas,
        tipeDialog: 'SQLAkunSubledger',
        token: token,
    };

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(paramobject);
            gridDaftarAkunKredit.current?.setProperties({ dataSource: resultDaftarAkunKredit });
            gridDaftarAkunKredit.current?.refresh();
        };
        async();
    }, [vRefreshData]);
    buttonDaftarAkunKredit = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarAkunKredit = gridDaftarAkunKredit.current?.getSelectedRecords() || [];
                if (currentDaftarAkunKredit.length > 0) {
                    if (currentDaftarAkunKredit[0].header !== 'Y') {
                        handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                        setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunKreditVisible: false,
                            viewTipe: currentDaftarAkunKredit[0].tipe,
                        }));
                    } else {
                        withReactContent(swalToast).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px;color:white;">Silahkan pilih akun selain akun header.</p>',
                            width: '100%',
                            target: '#dialogDaftarAkunKredit',
                            customClass: {
                                popup: styles['colored-popup'], // Custom class untuk sweetalert
                            },
                        });
                    }
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Silahkan pilih data akun</p>',
                        width: '100%',
                        target: '#dialogDaftarAkunKredit',
                        customClass: {
                            popup: styles['colored-popup'],
                        },
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
                handleHapusRow();
            },
        },
    ];

    const handleClickDaftarAkunKredit = async (data: any) => {
        const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            noAkunValue: data[0].no_akun,
            namaAkunValue: data[0].nama_akun,
            kodeAkun: data[0].kode_akun,
            tipeAkun: data[0].tipe,
        }));

        const responseSubledger: any[] = await ListSubledger(kode_entitas, data[0].kode_akun);
        await setStateDataArray((prevState: any) => ({
            ...prevState,
            dataDaftarSubledger: responseSubledger,
        }));

        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: data[0].kode_akun,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            divisiJual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };

        // const getListDataBukuBesar: any[] = await GetListDataBukuBesar(paramObject);
        // setRecordsData(getListDataBukuBesar);
    };

    const handleHapusRow = async () => {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: false,
        }));
    };

    const handleHapusRowCloseGrid = async () => {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: false,
            searchNoAkun: '',
            searchNamaAkun: '',
            searchKeywordNamaAkun: '',
            searchKeywordNoAkun: '',
        }));

        const searchNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
        if (searchNoAkun) {
            searchNoAkun.value = '';
        }
        const searchNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
        if (searchNamaAkun) {
            searchNamaAkun.value = '';
        }
    };

    return (
        <DialogComponent
            id="dialogDaftarAkunKredit"
            target="#main-target"
            style={{ position: 'fixed' }}
            header={() => (
                <div>
                    <div className="header-title" style={{ width: '93%' }}>
                        Daftar Akun
                    </div>
                </div>
            )}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="27%"
            height="50%"
            buttons={buttonDaftarAkunKredit}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarAkunKredit.current?.clearSelection();
                handleHapusRowCloseGrid();
                if (stateDataHeader?.searchNoAkun !== '' || stateDataHeader?.searchNamaAkun !== '') {
                    gridDaftarAkunKredit.current?.setProperties({ dataSource: [] });
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFilterOpen === 'Input') {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoAkun: stateDataHeader?.searchNoAkun,
                        searchNamaAkun: stateDataHeader?.searchNamaAkun,
                    }));
                } else {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoAkun: '',
                        searchNamaAkun: '',
                    }));
                    const searchNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
                    if (searchNoAkun) {
                        searchNoAkun.value = '';
                    }
                    const searchNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
                    if (searchNamaAkun) {
                        searchNamaAkun.value = '';
                    }
                }

                if (stateDataHeader?.tipeFocusOpen === 'noAkun') {
                    setTimeout(function () {
                        document.getElementById('searchNoAkun')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaAkun')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoAkun"
                    name="searchNoAkun"
                    className="searchNoAkun"
                    placeholder="<No. Akun>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoAkun}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoAkun(value, setStateDataHeader, setStateDataArray, dataDaftarAkunKredit);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaAkun"
                    name="searchNamaAkun"
                    className="searchNamaAkun"
                    placeholder="<Nama Akun>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNamaAkun}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaAkun(value, setStateDataHeader, setStateDataArray, dataDaftarAkunKredit);
                    }}
                />
            </div>
            <GridComponent
                // key={gridKeyDaftarAkunKredit}
                id="gridDaftarAkunKredit"
                locale="id"
                ref={gridDaftarAkunKredit}
                dataSource={stateDataHeader?.searchKeywordNoAkun !== '' || stateDataHeader?.searchKeywordNamaAkun !== '' ? filteredDataAkunKredit : dataDaftarAkunKredit}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'300px'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarAkunKredit.current) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarAkunKredit.current?.selectRow(rowIndex);
                        const currentDaftarAkunKredit = (gridDaftarAkunKredit.current?.getSelectedRecords() as DaftarAkunKredit[]) || [];
                        if (currentDaftarAkunKredit.length > 0) {
                            if (currentDaftarAkunKredit[0].header !== 'Y') {
                                handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                                setStateDataHeader((prevState: any) => ({
                                    ...prevState,
                                    dialogDaftarAkunKreditVisible: false,
                                    viewTipe: currentDaftarAkunKredit[0].tipe,
                                    noSubValue: '',
                                    namaSubValue: '',
                                    kodeSubValue: '',
                                }));
                            } else {
                                withReactContent(swalToast).fire({
                                    icon: 'warning',
                                    title: '<p style="font-size:12px;color:white;">Silahkan pilih akun selain akun header.</p>',
                                    width: '100%',
                                    target: '#dialogDaftarAkunKredit',
                                    customClass: {
                                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                                    },
                                });
                            }
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px;color:white;">Silahkan pilih akun terlebih dahulu.</p>',
                                width: '100%',
                                target: '#dialogDaftarAkunKredit',
                                customClass: {
                                    popup: styles['colored-popup'],
                                },
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective template={TemplateNoAkun} field="no_akun" headerText="No. Akun" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective template={TemplateNamaAkun} field="nama_akun" headerText="Nama Akun" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarAkunKredit;
