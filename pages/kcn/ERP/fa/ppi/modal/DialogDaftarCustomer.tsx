import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import stylesPpi from '../ppilist.module.css';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';

interface DialogDaftarCustomerProps {
    visible: boolean;
    stateDataDetail: any;
    // buttonDaftarCustomer: any;
    // gridDaftarCustomer: any;
    setStateDataDetail: Function;
    filteredDataCustomer: any;
    dataDaftarCustomer: any;
    HandleSearchNoCust: Function;
    HandleSearchNamaCust: Function;
    HandleSearchNamaSales: Function;
    // HandleSelectedDataCustomer: Function;
    swalToast: any;
    kode_entitas: any;
    templateCustomerInfoDetail: any;
    // stateDataHeader: any;
    setFilteredDataCustomer: Function;
    setDataJurnal: Function;
}

const DialogDaftarCustomer: React.FC<DialogDaftarCustomerProps> = ({
    visible,
    stateDataDetail,
    // buttonDaftarCustomer,
    // gridDaftarCustomer,
    setStateDataDetail,
    filteredDataCustomer,
    dataDaftarCustomer,
    HandleSearchNoCust,
    HandleSearchNamaCust,
    HandleSearchNamaSales,
    // HandleSelectedDataCustomer,
    swalToast,
    kode_entitas,
    templateCustomerInfoDetail,
    // stateDataHeader,
    setFilteredDataCustomer,
    setDataJurnal,
}) => {
    let dialogDaftarCustomer: Dialog | any;
    let buttonDaftarCustomer: ButtonPropsModel[];
    let currentDaftarCustomer: any[] = [];
    let gridDaftarCustomer: Grid | any;

    buttonDaftarCustomer = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarCustomer = gridDaftarCustomer.getSelectedRecords();
                if (currentDaftarCustomer.length > 0) {
                    // HandleSelectedDataCustomer(currentDaftarCustomer, (tipe = 'header'), setCustSelected, setCustSelectedKode, setSelectedKodeRelasi, setModal2);
                    HandleSelectedDataCustomer(currentDaftarCustomer);
                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        dialogDaftarCustomerVisible: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                        width: '100%',
                        target: '#dialogDaftarCustomer',
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
            click: async () => {
                handleHapusRow();
            },
        },
    ];

    const HandleSelectedDataCustomer = (data: any) => {
        setDataJurnal((state: any) => {
            const newNodes = state?.nodes.map((node: any) => {
                if (node.id === stateDataDetail?.rowsIdJurnal) {
                    return {
                        ...node,
                        subledger: data[0]?.nama_relasi,
                        kode_subledger: data[0].kode_cust,
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
            const updatedNodes = state?.nodes.filter((node: any) => node.no_akun !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            dialogDaftarCustomerVisible: false,
        }));
    };

    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            console.log('args = ', getValue('status_warna', args.data));
            if (getValue('status_warna', args.data) == 'BlackList-G') {
                args.row.style.background = 'red';
            } else if (getValue('status_warna', args.data) == 'Tidak Digarap') {
                args.row.style.background = '#f5800a';
            } else if (getValue('status_warna', args.data) == 'Non Aktif') {
                args.row.style.background = '#c0c0c0';
            } else if (getValue('status_warna', args.data) == 'NOO') {
                args.row.style.background = '#00ff80';
            } else if (getValue('status_warna', args.data) == 'Batal NOO') {
                args.row.style.background = '#ff8080';
            } else {
                args.row.style.background = 'white';
            }
        }
    };

    return (
        <DialogComponent
            id="dialogDaftarCustomer"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={'Daftar Customer'}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="84%"
            height="85%"
            buttons={buttonDaftarCustomer}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarCustomer.clearSelection();
                handleHapusRow();
                if (stateDataDetail?.searchNoCust !== '' || stateDataDetail?.searchNamaCust !== '' || stateDataDetail?.searchNamaSales !== '') {
                    gridDaftarCustomer.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                HandleSearchNoCust('', setStateDataDetail, kode_entitas, setFilteredDataCustomer);
                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    searchNamaCust: '',
                    searchNamaSales: '',
                }));

                setTimeout(function () {
                    document.getElementById(stateDataDetail?.activeSearchDaftarCustomer)?.focus();
                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        searchNoCust: '',
                    }));
                }, 100);
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="noCust"
                    name="noCust"
                    className="noCust"
                    placeholder="<No. Cust>"
                    showClearButton={true}
                    value={stateDataDetail?.searchNoCust}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoCust(value, setStateDataDetail, kode_entitas, setFilteredDataCustomer);
                    }}
                />
            </div>
            <div className="form-input mb-1 mr-1" style={{ width: '300px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="namaCust"
                    name="namaCust"
                    className="namaCust"
                    placeholder="<Nama Customer>"
                    showClearButton={true}
                    value={stateDataDetail?.searchNamaCust}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaCust(value, setStateDataDetail, kode_entitas, setFilteredDataCustomer);
                    }}
                />
            </div>

            <div className="form-input mb-1" style={{ width: '300px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="namaSales"
                    name="namaSales"
                    className="namaSales"
                    placeholder="<Nama Salesman>"
                    showClearButton={true}
                    value={stateDataDetail?.searchNamaSales}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaSales(value, setStateDataDetail, kode_entitas, setFilteredDataCustomer);
                    }}
                />
            </div>

            <GridComponent
                id="gridDaftarCustomer"
                locale="id"
                ref={(g: any) => (gridDaftarCustomer = g)}
                dataSource={
                    stateDataDetail?.searchKeywordNoCust !== '' || stateDataDetail?.searchKeywordNamaCust !== '' || stateDataDetail?.searchKeywordNamaSales !== ''
                        ? filteredDataCustomer
                        : dataDaftarCustomer
                }
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'400'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarCustomer) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarCustomer.selectRow(rowIndex);
                        const currentDaftarCustomer = gridDaftarCustomer.getSelectedRecords();
                        if (currentDaftarCustomer.length > 0) {
                            HandleSelectedDataCustomer(currentDaftarCustomer);
                            setStateDataDetail((prevState: any) => ({
                                ...prevState,
                                dialogDaftarCustomerVisible: false,
                            }));
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                                width: '100%',
                                target: '#dialogDaftarCustomer',
                            });
                        }
                    }
                }}
                rowDataBound={rowDataBoundListData}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_relasi" headerText="Nama Customer" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective
                        field="status_warna"
                        headerText="Info Detail"
                        headerTextAlign="Center"
                        textAlign="Left"
                        width="95"
                        clipMode="EllipsisWithTooltip"
                        template={templateCustomerInfoDetail}
                    />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
            <div className="mt-4 flex items-center justify-between">
                <div className={stylesPpi['custom-box-wrapper']}>
                    <div className={stylesPpi['custom-box-aktif']}></div>
                    <div className={stylesPpi['box-text']}>Aktif</div>
                    <div className={stylesPpi['custom-box-non-aktif']}></div>
                    <div className={stylesPpi['box-text']}>Non Aktif</div>
                    <div className={stylesPpi['custom-box-bl']}></div>
                    <div className={stylesPpi['box-text']}>BlackList-G</div>
                    <div className={stylesPpi['custom-box-noo']}></div>
                    <div className={stylesPpi['box-text']}>New Open Outlet</div>
                    <div className={stylesPpi['custom-box-batal-noo']}></div>
                    <div className={stylesPpi['box-text']}>Batal NOO</div>
                    <div className={stylesPpi['custom-box-tidak-digarap']}></div>
                    <div className={stylesPpi['box-text']}>Tidak Digarap</div>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogDaftarCustomer;
