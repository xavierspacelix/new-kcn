import React, { useEffect, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import styles from '../ppilist.module.css';
import { CekSubledger, DaftarSupplierAll, GetKodeJual, ListCustFilter, ListSubledger } from '../model/apiPpi';
import { swalToast } from '@/lib/fa/mutasi-bank/functional/fungsiForm';

interface DialogDivisiJualProps {
    visible: boolean;
    vRefreshData: any;
    setDataDivisJual: Function;
    dataDivisiJual: any;
    kode_entitas: any;
    setStateDataDetail: Function;
    setDataJurnal: Function;
    dataJurnal: any;
    rowIdDivisiJurnalRef: any;
}

const DialogDivisiJual: React.FC<DialogDivisiJualProps> = ({
    visible,
    vRefreshData,
    setDataDivisJual,
    dataDivisiJual,
    kode_entitas,
    setStateDataDetail,
    setDataJurnal,
    dataJurnal,
    rowIdDivisiJurnalRef,
}) => {
    let buttonDivisiJual: ButtonPropsModel[];
    let currentDivisiJual: any[] = [];
    // let gridDaftarAkunDebet: Grid | any;
    let dialogDivisiJual: Dialog | any;
    const gridDivisiJual = useRef<GridComponent>(null);

    interface DaftarAkunDebet {
        header: string;
        tipe: string;
        kode_akun: string;
    }

    useEffect(() => {
        const async = async () => {
            const resultDivisiJual = await GetKodeJual(kode_entitas);
            gridDivisiJual.current?.setProperties({ dataSource: resultDivisiJual });
            gridDivisiJual.current?.refresh();
            setDataDivisJual(resultDivisiJual);
        };
        async();
    }, [vRefreshData]);

    buttonDivisiJual = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDivisiJual = gridDivisiJual.current?.getSelectedRecords() || [];
                if (currentDivisiJual.length > 0) {
                    handleClickDaftarAkunKredit(currentDivisiJual[0]);
                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        dialogDaftarAkunDebetVisible: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Silahkan pilih divisi terlebih dahulu.</p>',
                        width: '100%',
                        target: '#dialogDivisiJual',
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

    const handleClickDaftarAkunKredit = async (data: any) => {
        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            selectedOptionDivisi: data.kode_jual,
            dialogDivisiJualVisible: false,
        }));
        const newNodes = await dataJurnal?.nodes.map((node: any) => {
            if (node.id === rowIdDivisiJurnalRef) {
                return {
                    ...node,
                    nama_jual: data.nama_jual,
                    kode_jual: data.kode_jual,
                };
            } else {
                return node;
            }
        });

        await setDataJurnal({ nodes: newNodes });

        // gridDivisiJual.current?.setProperties({ dataSource: newNodes });
        // gridDivisiJual.current?.refresh();
    };

    const handleHapusRow = () => {
        setStateDataDetail((prevState: any) => ({
            ...prevState,
            dialogDivisiJualVisible: false,
        }));
    };

    return (
        <DialogComponent
            id="dialogDivisiJual"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={() => (
                <div>
                    <div className="header-title" style={{ width: '93%' }}>
                        Divisi Penjualan
                    </div>
                </div>
            )}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="25%"
            height="65%"
            buttons={buttonDivisiJual}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDivisiJual.current?.clearSelection();
                handleHapusRow();
            }}
            closeOnEscape={true}
            // open={(args: any) => {

            // }}
        >
            {/* <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaDivisi"
                    name="searchNamaDivisi"
                    className="searchNamaDivisi"
                    placeholder="<Nama Divisi>"
                    showClearButton={true}
                    // value={stateDataHeader?.searchNoAkun}
                    input={(args: any) => {
                        const value: any = args.value;
                        // HandleSearchNoAkun(value, setStateDataHeader, setFilteredDataAkunDebet, dataDaftarAkunDebet);
                    }}
                />
            </div> */}
            <GridComponent
                id="gridDaftarAkunDebet"
                locale="id"
                ref={gridDivisiJual}
                // dataSource={stateDataHeader?.searchKeywordNoAkun !== '' || stateDataHeader?.searchKeywordNamaAkun !== '' ? filteredDataAkunDebet : dataDaftarAkunDebet}
                dataSource={dataDivisiJual}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (args) {
                        const rowIndex: number = args.row.rowIndex;
                        const currentDivisiJual = args.rowData;
                        if (currentDivisiJual) {
                            handleClickDaftarAkunKredit(currentDivisiJual);
                            setStateDataDetail((prevState: any) => ({
                                ...prevState,
                                dialogDaftarAkunDebetVisible: false,
                            }));
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
                    <ColumnDirective field="nama_jual" headerText="Nama Divisi" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDivisiJual;
