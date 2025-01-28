import React, { useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import styles from '../ppilist.module.css';
import { CekSubledger, DaftarSupplierAll, ListCustFilter, ListSubledger } from '../model/apiPpi';

interface DialogDaftarAkunDebetProps {
    visible: boolean;
    stateDataHeader: any;
    // buttonDaftarAkunKredit: any;
    // gridDaftarAkunKredit: any;
    setStateDataHeader: any;
    dataDaftarAkunDebet: any;
    filteredDataAkunDebet: any;
    // handleClickDaftarAkunKredit: any;
    // handleClickDaftarAkunKreditJurnal: any;
    swalToast: any;
    HandleSearchNoAkun: any;
    HandleSearchNamaAkun: any;
    TemplateNoAkun: any;
    TemplateNamaAkun: any;
    setFilteredDataAkunDebet: Function;
    setDataJurnal: Function;
    stateDataDetail: any;
    rowIdJurnal: any;
    kode_entitas: any;
    setStateDataDetail: any;
    setDataDaftarCust: any;
    setDataDaftarSubledger: any;
}

const DialogDaftarAkunDebet: React.FC<DialogDaftarAkunDebetProps> = ({
    visible,
    stateDataHeader,
    // buttonDaftarAkunKredit,
    // gridDaftarAkunKredit,
    setStateDataHeader,
    dataDaftarAkunDebet,
    filteredDataAkunDebet,
    // handleClickDaftarAkunKredit,
    // handleClickDaftarAkunKreditJurnal,
    swalToast,
    HandleSearchNoAkun,
    HandleSearchNamaAkun,
    TemplateNoAkun,
    TemplateNamaAkun,
    setFilteredDataAkunDebet,
    setDataJurnal,
    stateDataDetail,
    rowIdJurnal,
    kode_entitas,
    setStateDataDetail,
    setDataDaftarCust,
    setDataDaftarSubledger,
}) => {
    let buttonDaftarAkunKredit: ButtonPropsModel[];
    let currentDaftarAkunKredit: any[] = [];
    // let gridDaftarAkunDebet: Grid | any;
    let dialogDaftarAkunKredit: Dialog | any;
    const gridDaftarAkunDebet = useRef<GridComponent>(null);

    interface DaftarAkunDebet {
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
                currentDaftarAkunKredit = gridDaftarAkunDebet.current?.getSelectedRecords() || [];
                if (currentDaftarAkunKredit.length > 0) {
                    if (currentDaftarAkunKredit[0].header !== 'Y') {
                        if (stateDataHeader?.tipeAkunDialogVisible === 'header') {
                            handleClickDaftarAkunKredit(currentDaftarAkunKredit[0]);
                            setStateDataHeader((prevState: any) => ({
                                ...prevState,
                                dialogDaftarAkunDebetVisible: false,
                            }));
                        } else if (stateDataHeader?.tipeAkunDialogVisible === 'akunJurnal') {
                            handleClickDaftarAkunKreditJurnal(currentDaftarAkunKredit[0]);
                            setStateDataHeader((prevState: any) => ({
                                ...prevState,
                                dialogDaftarAkunDebetVisible: false,
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
            noAkunValue: data.no_akun,
            namaAkunValue: data.nama_akun,
            kodeAkun: data.kode_akun,
            tipeAkun: data.tipe,
            isLedger: data.isledger,
        }));
    };

    const handleClickDaftarAkunKreditJurnal = async (data: any) => {
        const resultCekSubledger: any[] = await CekSubledger(kode_entitas, data.kode_akun);
        if (resultCekSubledger[0].tipe === 'hutang') {
            const resultDaftarCust: any[] = await DaftarSupplierAll(kode_entitas);
            await setDataDaftarCust(resultDaftarCust);
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarCustVisible: true,
                tipeSupplierDialogVisible: 'akunSubledger',
                tipeCustDialogVisible: 'subledger',
            }));
            // await setStateDataDetail((prevState: any) => ({
            //     ...prevState,
            //     rowsIdJurnal: data.id,
            // }));
        } else if (resultCekSubledger[0].tipe === 'piutang') {
            const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, 'all', 'all', 'all');
            await setDataDaftarCust(resultDaftarCustomer);
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarCustVisible: true,
                tipeSupplierDialogVisible: 'akunSubledger',
                tipeCustDialogVisible: 'subledger',
            }));
            // await setStateDataDetail((prevState: any) => ({
            //     ...prevState,
            //     rowsIdJurnal: data.id,
            // }));
        } else if (resultCekSubledger[0].subledger === 'Y') {
            const resultListSubledger: any[] = await ListSubledger(kode_entitas, data.kode_akun);
            await setDataDaftarSubledger(resultListSubledger);
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                dialogDaftarSubledgerVisible: true,
            }));
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: `<p style="font-size:12px; color:white;">No. Akun ${data.no_akun} tidak mempunyai subsidiary ledger</p>`,
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
                target: '#dialogPhuList',
            });
        }
        await setDataJurnal((state: any) => {
            const newNodes = state.nodes.map((node: any) => {
                if (node.id === rowIdJurnal) {
                    return {
                        ...node,
                        no_akun: data.no_akun,
                        nama_akun: data.nama_akun,
                        kode_akun: data.kode_akun,
                        kurs: data.kurs,
                        mu: data.kode_mu,
                        tipe: data.tipe,
                        kode_subledger: null,
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                    };
                } else {
                    return node;
                }
            });
            return {
                nodes: newNodes,
            };
        });
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
            dialogDaftarAkunDebetVisible: false,
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
            dialogDaftarAkunDebetVisible: false,
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
                gridDaftarAkunDebet.current?.clearSelection();
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
                    // gridDaftarAkunDebet.dataSource = [];
                    gridDaftarAkunDebet.current?.setProperties({ dataSource: [] });
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
                        HandleSearchNoAkun(value, setStateDataHeader, setFilteredDataAkunDebet, dataDaftarAkunDebet);
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
                        HandleSearchNamaAkun(value, setStateDataHeader, setFilteredDataAkunDebet, dataDaftarAkunDebet);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarAkunDebet"
                locale="id"
                ref={gridDaftarAkunDebet}
                dataSource={stateDataHeader?.searchKeywordNoAkun !== '' || stateDataHeader?.searchKeywordNamaAkun !== '' ? filteredDataAkunDebet : dataDaftarAkunDebet}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (args) {
                        const rowIndex: number = args.row.rowIndex;
                        const currentDaftarAkunDebet = args.rowData;
                        if (currentDaftarAkunDebet) {
                            if (currentDaftarAkunDebet.header !== 'Y') {
                                if (stateDataHeader?.tipeAkunDialogVisible === 'header') {
                                    handleClickDaftarAkunKredit(currentDaftarAkunDebet);
                                    setStateDataHeader((prevState: any) => ({
                                        ...prevState,
                                        dialogDaftarAkunDebetVisible: false,
                                    }));
                                } else if (stateDataHeader?.tipeAkunDialogVisible === 'akunJurnal') {
                                    handleClickDaftarAkunKreditJurnal(currentDaftarAkunDebet);
                                    setStateDataHeader((prevState: any) => ({
                                        ...prevState,
                                        dialogDaftarAkunDebetVisible: false,
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
                    // if (gridDaftarAkunDebet) {
                    //     const rowIndex: number = args.row.rowIndex;
                    //     gridDaftarAkunDebet.selectRow(rowIndex);
                    //     const currentDaftarAkunKredit = gridDaftarAkunDebet.getSelectedRecords();
                    //     if (currentDaftarAkunKredit.length > 0) {
                    //         if (currentDaftarAkunKredit[0].header !== 'Y') {
                    //             if (stateDataHeader?.tipeAkunDialogVisible === 'header') {
                    //                 handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                    //                 setStateDataHeader((prevState: any) => ({
                    //                     ...prevState,
                    //                     dialogDaftarAkunDebetVisible: false,
                    //                 }));
                    //             } else if (stateDataHeader?.tipeAkunDialogVisible === 'akunJurnal') {
                    //                 handleClickDaftarAkunKreditJurnal(currentDaftarAkunKredit);
                    //                 setStateDataHeader((prevState: any) => ({
                    //                     ...prevState,
                    //                     dialogDaftarAkunDebetVisible: false,
                    //                 }));
                    //             }
                    //         } else {
                    //             withReactContent(swalToast).fire({
                    //                 icon: 'warning',
                    //                 title: '<p style="font-size:12px;color:white;">Silahkan pilih akun selain akun header.</p>',
                    //                 width: '100%',
                    //                 target: '#dialogDaftarAkunKredit',
                    //                 customClass: {
                    //                     popup: styles['colored-popup'], // Custom class untuk sweetalert
                    //                 },
                    //             });
                    //         }
                    //     } else {
                    //         withReactContent(swalToast).fire({
                    //             icon: 'warning',
                    //             title: '<p style="font-size:12px;color:white;">Silahkan pilih akun terlebih dahulu.</p>',
                    //             width: '100%',
                    //             target: '#dialogDaftarAkunKredit',
                    //             customClass: {
                    //                 popup: styles['colored-popup'], // Custom class untuk sweetalert
                    //             },
                    //         });
                    //     }
                    // }
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

export default DialogDaftarAkunDebet;
