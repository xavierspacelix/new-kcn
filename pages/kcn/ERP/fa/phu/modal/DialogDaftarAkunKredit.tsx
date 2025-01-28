import React, { useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import moment from 'moment';
import styles from '../phulist.module.css';
import { CekSubledger } from '../../ppi/model/apiPpi';
import { DaftarSupplierAll, ListCustFilter, ListSubledger } from '../model/apiPhu';

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
    setFilteredDataAkunKredit: Function;
    setDataJurnal: Function;
    stateDataDetail: any;
    rowIdJurnal: any;
    gridJurnalListRef: any;
    kode_entitas: any;
    setDataDaftarSupplier: Function;
    setStateDataDetail: any;
    setDataDaftarCustomer: Function;
    setDataDaftarSubledger: Function;
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
    setFilteredDataAkunKredit,
    setDataJurnal,
    stateDataDetail,
    rowIdJurnal,
    gridJurnalListRef,
    kode_entitas,
    setDataDaftarSupplier,
    setStateDataDetail,
    setDataDaftarCustomer,
    setDataDaftarSubledger,
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
        kode_akun: string;
    }

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
                        if (stateDataHeader?.tipeAkunDialogVisible === 'header') {
                            handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                        } else if (stateDataHeader?.tipeAkunDialogVisible === 'akunJurnal') {
                            handleClickDaftarAkunKreditJurnal(currentDaftarAkunKredit);
                        }
                        handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                        setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunKreditVisible: false,
                        }));
                    } else {
                        withReactContent(swalToast).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px;color:white;">Silahkan pilih akun selain akun header.</p>',
                            width: '100%',
                            target: '#dialogDaftarAkunKredit',
                            customClass: {
                                popup: styles['colored-popup'],
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

    const handleClickDaftarAkunKredit = (data: any) => {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            noAkunValue: data[0].no_akun,
            namaAkunValue: data[0].nama_akun,
            kodeAkun: data[0].kode_akun,
            tipeAkun: data[0].tipe,
        }));
    };

    const handleClickDaftarAkunKreditJurnal = async (data: any) => {
        if (gridJurnalListRef && Array.isArray(gridJurnalListRef?.dataSource)) {
            // Salin array untuk menghindari mutasi langsung pada dataSource
            const dataSource = [...gridJurnalListRef.dataSource];

            // Flag untuk menentukan apakah baris ditemukan
            let isRowUpdated = false;

            const resultCekSubledger: any[] = await CekSubledger(kode_entitas, data[0].kode_akun);
            console.log('resultCekSubledger = ', resultCekSubledger, dataSource, rowIdJurnal);
            if (resultCekSubledger[0].tipe === 'hutang') {
                const resultDaftarCust: any[] = await DaftarSupplierAll(kode_entitas);
                await setDataDaftarSupplier(resultDaftarCust);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarCustVisible: true,
                    tipeSupplierDialogVisible: 'akunSubledger',
                    // tipeCustDialogVisible: 'subledger',
                }));
                // await setStateDataDetail((prevState: any) => ({
                //     ...prevState,
                //     rowsIdJurnal: dataSource.id,
                // }));
            } else if (resultCekSubledger[0].tipe === 'piutang') {
                const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, 'all', 'all', 'all');
                await setDataDaftarCustomer(resultDaftarCustomer);
                await setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    dialogDaftarCustomerVisible: true,
                }));
                // await setStateDataDetail((prevState: any) => ({
                //     ...prevState,
                //     rowsIdJurnal: args.id,
                // }));
            } else if (resultCekSubledger[0].subledger === 'Y') {
                const resultListSubledger: any[] = await ListSubledger(kode_entitas, data[0].kode_akun);
                await setDataDaftarSubledger(resultListSubledger);
                await setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSubledgerVisible: true,
                    // rowsIdJurnal: args.id,
                }));
            } else {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px; color:white;">No. Akun ${data[0].no_akun} tidak mempunyai subsidiary ledger</p>`,
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                    target: '#dialogPhuList',
                });
            }

            // Modifikasi dataSource atau tambahkan baris baru
            const updatedDataSource = dataSource.map((item: any) => {
                if (item.id === rowIdJurnal) {
                    // Periksa apakah baris dengan id yang dimaksud ada
                    isRowUpdated = true;
                    return {
                        ...item,
                        no_akun: data[0].no_akun,
                        nama_akun: data[0].nama_akun,
                        kode_akun: data[0].kode_akun,
                        kurs: data[0].kurs,
                        mu: data[0].kode_mu,
                        tipe: data[0].tipe,
                        kode_subledger: null,
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                    };
                } else {
                    return item; // Kembalikan item yang tidak berubah
                }
            });

            // Jika tidak ada baris yang ditemukan, tambahkan baris baru
            if (!isRowUpdated) {
                const newRow = {
                    id_phu: rowIdJurnal,
                    id: rowIdJurnal, // Pastikan Anda memberikan ID baru atau menggunakan rowIdJurnal
                    kode_akun: data[0].kode_akun,
                    no_akun: data[0].no_akun,
                    nama_akun: data[0].nama_akun,
                    tipe: data[0].tipe,
                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: 0,
                    kredit_rp: 0,
                    kurs: data[0].kurs,
                    mu: data[0].kode_mu,
                    departemen: '',
                    kode_dept: '',
                    jumlah_mu: '',
                    catatan: '',
                };
                updatedDataSource.push(newRow); // Tambahkan baris baru
            }

            // Perbarui dataSource pada grid
            gridJurnalListRef.dataSource = updatedDataSource;

            // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
            if (gridJurnalListRef.refresh) {
                gridJurnalListRef.refresh();
            }

            console.log('Updated dataSource with new row = ', updatedDataSource);
        }
    };

    const handleHapusRow = async () => {
        await setDataJurnal((state: any) => {
            const updatedNodes = state.nodes.filter((node: any) => node.no_akun !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: false,
        }));
    };

    const handleHapusRowCloseGrid = async () => {
        await setDataJurnal((state: any) => {
            const updatedNodes = state.nodes.filter((node: any) => node.no_akun !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: false,
            searchNoAkun: '',
            searchNamaAkun: '',
            searchKeywordNamaAkun: '',
            searchKeywordNoAkun: '',
        }));
    };

    return (
        <DialogComponent
            id="dialogDaftarAkunKredit"
            target="#dialogPhuList"
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
            width="40%"
            height="65%"
            buttons={buttonDaftarAkunKredit}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarAkunKredit.current?.clearSelection();
                handleHapusRowCloseGrid();
                const searchNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
                if (searchNoAkun) {
                    searchNoAkun.value = '';
                }
                const searchNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
                if (searchNamaAkun) {
                    searchNamaAkun.value = '';
                }
                if (stateDataHeader?.searchNoAkun !== '' || stateDataHeader?.searchNamaAkun !== '') {
                    // gridDaftarAkunKredit.dataSource = [];
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
                        HandleSearchNoAkun(value, setStateDataHeader, setFilteredDataAkunKredit, dataDaftarAkunKredit);
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
                        HandleSearchNamaAkun(value, setStateDataHeader, setFilteredDataAkunKredit, dataDaftarAkunKredit);
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
                height={'286'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarAkunKredit.current) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarAkunKredit.current?.selectRow(rowIndex);
                        const currentDaftarAkunKredit = (gridDaftarAkunKredit.current?.getSelectedRecords() as DaftarAkunKredit[]) || [];
                        if (currentDaftarAkunKredit.length > 0) {
                            if (currentDaftarAkunKredit[0].header !== 'Y') {
                                if (stateDataHeader?.tipeAkunDialogVisible === 'header') {
                                    handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                                    setStateDataHeader((prevState: any) => ({
                                        ...prevState,
                                        dialogDaftarAkunKreditVisible: false,
                                    }));
                                } else if (stateDataHeader?.tipeAkunDialogVisible === 'akunJurnal') {
                                    console.log('aaaaaaaaaa = ');

                                    handleClickDaftarAkunKreditJurnal(currentDaftarAkunKredit);
                                    setStateDataHeader((prevState: any) => ({
                                        ...prevState,
                                        dialogDaftarAkunKreditVisible: false,
                                    }));
                                }
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
                                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                                },
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective template={TemplateNoAkun} field="no_akun" headerText="No. Akun" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective template={TemplateNamaAkun} field="nama_akun" headerText="Tanggal" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarAkunKredit;
