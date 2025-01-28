import React, { useEffect, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import moment from 'moment';
import styles from '@styles/index.module.css';
import { DaftarAkunKredit, GetCekAkunKasBank } from '@/lib/fa/mutasi-bank/api/api';
import { handleModalDaftarAkun, swalToast } from '@/lib/fa/mutasi-bank/functional/fungsiForm';
import template from '@utils/fa/mutasi-bank/interface/fungsi';
const { TemplateNamaAkun, TemplateNoAkun } = template;

interface DialogDaftarAkunKreditProps {
    visible: boolean;
    listStateData: any;
    setListStateData: any;
    kode_entitas: any;
    vRefreshData: any;
    dataDaftarAkunKredit: any;
    filteredDataAkunKredit: any;
    setFilterData: Function;
    filterData: any;
    setCheckboxFilter: Function;
    setStateDataArray: Function;
    token: any;
    handleParamsObject: any;
}

let gridKeyDaftarAkunKredit = ``;
const DialogDaftarAkunKredit: React.FC<DialogDaftarAkunKreditProps> = ({
    visible,
    listStateData,
    setListStateData,
    kode_entitas,
    vRefreshData,
    dataDaftarAkunKredit,
    filteredDataAkunKredit,
    setFilterData,
    filterData,
    setCheckboxFilter,
    setStateDataArray,
    token,
    handleParamsObject,
}) => {
    let buttonDaftarAkunKredit: ButtonPropsModel[];
    let currentDaftarAkunKredit: any[] = [];
    // let gridDaftarAkunKredit: Grid | any;
    let dialogDaftarAkunKredit: Dialog | any;
    // gridKeyDaftarAkunKredit = `${moment().format('HHmmss')}-${JSON.stringify(dataDaftarAkunKredit)}`;
    const gridDaftarAkunKredit = useRef<GridComponent>(null);

    interface DaftarAkunKredit {
        header: string;
        tipe: string;
        kode_akun: string;
    }

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(kode_entitas, token);
            gridDaftarAkunKredit.current?.setProperties({ dataSource: resultDaftarAkunKredit });
            gridDaftarAkunKredit.current?.refresh();
            setStateDataArray((prevState: any) => ({
                ...prevState,
                dataDaftarAkunKredit: resultDaftarAkunKredit,
            }));
        };
        async();
    }, [vRefreshData, gridDaftarAkunKredit.current, kode_entitas, token, setStateDataArray]);
    buttonDaftarAkunKredit = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: async () => {
                currentDaftarAkunKredit = gridDaftarAkunKredit.current?.getSelectedRecords() || [];
                if (currentDaftarAkunKredit.length > 0) {
                    const resultBlokingAkun = await cekAkunKasBank(currentDaftarAkunKredit[0].kode_akun);
                    if (resultBlokingAkun === true) {
                        if (currentDaftarAkunKredit[0].header !== 'Y') {
                            handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                            setListStateData((prevState: any) => ({
                                ...prevState,
                                plagViewModalDaftarAkun: false,
                            }));
                            setCheckboxFilter((prevState: any) => ({
                                ...prevState,
                                isNoNamaAkunChecked: true,
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
                            title: '<p style="font-size:12px;color:white;">No. Rekening belum didaftarkan di data bank.</p>',
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
                closeModal();
            },
        },
    ];

    const closeModal = () => {
        setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarAkun: false,
            searchNoAkun: '',
            searchNamaAkun: '',
            searchKeywordNamaAkun: '',
            searchKeywordNoAkun: '',
        }));
    };

    const handleClickDaftarAkunKredit = (data: any) => {
        setFilterData((prevState: any) => ({
            ...prevState,
            noAkunValue: data[0].no_akun,
            namaAkunValue: data[0].nama_akun,
            kodeAkunValue: data[0].no_rekening,
        }));
    };

    const cekAkunKasBank = async (kode_akun: any) => {
        const respCekAkunKasBank = await GetCekAkunKasBank(kode_entitas, token, kode_akun);
        if (respCekAkunKasBank.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <DialogComponent
            id="dialogDaftarAkunKredit"
            // target="#main-target"
            // style={{ position: 'fixed', maxHeight: undefined }}
            className={styles['no-max-height']}
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
            width="30%"
            height="550px"
            buttons={buttonDaftarAkunKredit}
            // position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarAkunKredit.current?.clearSelection();
                closeModal();
                const searchNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
                if (searchNoAkun) {
                    searchNoAkun.value = '';
                }
                const searchNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
                if (searchNamaAkun) {
                    searchNamaAkun.value = '';
                }
                if (listStateData.searchNoAkun !== '' || listStateData.searchNamaAkun !== '') {
                    gridDaftarAkunKredit.current?.setProperties({ dataSource: [] });
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (filterData?.tipeFocusOpen === 'noAkun') {
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
            <div className="form-input mb-1 mr-1" style={{ width: '112px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoAkun"
                    name="searchNoAkun"
                    className="searchNoAkun"
                    placeholder="<No. Akun>"
                    showClearButton={true}
                    // value={filterData?.searchNoAkun}
                    input={(args: any) => {
                        const valueObject: any = args.value;
                        const tipe = 'noAkun';
                        const mergerObject = {
                            ...handleParamsObject,
                            valueObject,
                            tipe,
                        };
                        handleModalDaftarAkun(mergerObject);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '441px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaAkun"
                    name="searchNamaAkun"
                    className="searchNamaAkun"
                    placeholder="<Nama Akun>"
                    showClearButton={true}
                    // value={filterData?.searchNamaAkun}
                    input={(args: any) => {
                        const valueObject: any = args.value;
                        const tipe = 'namaAkun';
                        const mergerObject = {
                            ...handleParamsObject,
                            valueObject,
                            tipe,
                        };

                        handleModalDaftarAkun(mergerObject);
                    }}
                />
            </div>
            <GridComponent
                // key={gridKeyDaftarAkunKredit}
                id="gridDaftarAkunKredit"
                locale="id"
                ref={gridDaftarAkunKredit}
                dataSource={filterData?.searchKeywordNoAkun !== '' || filterData?.searchKeywordNamaAkun !== '' ? filteredDataAkunKredit : dataDaftarAkunKredit}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'357'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={async (args: any) => {
                    if (gridDaftarAkunKredit.current) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarAkunKredit.current?.selectRow(rowIndex);
                        const currentDaftarAkunKredit = (gridDaftarAkunKredit.current?.getSelectedRecords() as DaftarAkunKredit[]) || [];
                        if (currentDaftarAkunKredit.length > 0) {
                            const resultBlokingAkun = await cekAkunKasBank(currentDaftarAkunKredit[0].kode_akun);
                            if (resultBlokingAkun === true) {
                                if (currentDaftarAkunKredit[0].header !== 'Y') {
                                    handleClickDaftarAkunKredit(currentDaftarAkunKredit);
                                    setListStateData((prevState: any) => ({
                                        ...prevState,
                                        plagViewModalDaftarAkun: false,
                                    }));

                                    setCheckboxFilter((prevState: any) => ({
                                        ...prevState,
                                        isNoNamaAkunChecked: true,
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
                                    title: '<p style="font-size:12px;color:white;">No. Rekening belum didaftarkan di data bank.</p>',
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
                    <ColumnDirective template={TemplateNoAkun} field="no_akun" headerText="No. Akun" headerTextAlign="Center" textAlign="Left" width="15" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective template={TemplateNamaAkun} field="nama_akun" headerText="Tanggal" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarAkunKredit;
