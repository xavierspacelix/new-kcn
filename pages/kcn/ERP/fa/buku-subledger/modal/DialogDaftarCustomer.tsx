import React, { useEffect } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import { HandleSelectedDataCustomer } from '../functional/fungsiForm';
import stylesTtb from "../style.module.css"

interface DialogDaftarCustomerProps {
    modal1: boolean;
    stateDataHeader: any;
    setStateDataHeader: Function;
    kode_entitas: string;
    filteredDataCustomer: any;
    dataDaftarCustomer: any;
    swalToast: any;
    setStateDataArray: Function;
    stylesTtbb: any;
    HandleSearchNoCust: Function;
    HandleSearchNamaCust: Function;
    HandleSearchNamaSales: Function;
    templateCustomerInfoDetail: Function;
    // HandleSelectedDataCustomer: Function;
    token: any;
}

const DialogDaftarCustomer: React.FC<DialogDaftarCustomerProps> = ({
    modal1,
    stateDataHeader,
    setStateDataHeader,
    kode_entitas,
    filteredDataCustomer,
    dataDaftarCustomer,
    swalToast,
    setStateDataArray,
    stylesTtbb,
    HandleSearchNoCust,
    HandleSearchNamaCust,
    HandleSearchNamaSales,
    templateCustomerInfoDetail,
    // HandleSelectedDataCustomer,
    token,
}) => {
    let dialogDaftarCustomer: Dialog | any;
    let buttonDaftarCustomer: ButtonPropsModel[];
    let currentDaftarCustomer: any[] = [];
    let gridDaftarCustomer: Grid | any;
    let keyGrid: any;

    useEffect(() => {
        keyGrid = `${JSON.stringify(filteredDataCustomer)}`;
    }, [filteredDataCustomer]);

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
                    HandleSelectedDataCustomer(kode_entitas, currentDaftarCustomer, 'pilih', setStateDataHeader, setStateDataArray, stateDataHeader, token);
                    setStateDataHeader((prevState: any) => ({
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
                handleHapusRowCloseGrid();
            },
        },
    ];

    const rowDataBoundListData = (args: any) => {
        if (args.row) {
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

    const recordDoubleDaftarCustomer = async (args: any) => {
        currentDaftarCustomer = args.rowData;
        await HandleSelectedDataCustomer(kode_entitas, currentDaftarCustomer, 'doubelClick', setStateDataHeader, setStateDataArray, stateDataHeader, token);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarCustomerVisible: false,
        }));
    };

    const handleHapusRowCloseGrid = async () => {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarCustomerVisible: false,
            searchNoCust: '',
            searchNamaCust: '',
            searchNamaSales: '',
            searchKeywordNoCust: '',
            searchKeywordNamaCust: '',
            searchKeywordNamaSales: '',
        }));

        const noCust = document.getElementById('noCust') as HTMLInputElement;
        if (noCust) {
            noCust.value = '';
        }
        const namaCust = document.getElementById('namaCust') as HTMLInputElement;
        if (namaCust) {
            namaCust.value = '';
        }
        const namaSales = document.getElementById('namaSales') as HTMLInputElement;
        if (namaSales) {
            namaSales.value = '';
        }
    };

    return (
        <DialogComponent
            ref={(d) => (dialogDaftarCustomer = d)}
            id="dialogDaftarCustomer"
            target="#main-target"
            // target="#main-target"
            style={{ position: 'fixed' }}
            header={'Daftar Customer'}
            visible={modal1}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="70%"
            height="85%"
            buttons={buttonDaftarCustomer}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarCustomer.clearSelection();
                handleHapusRowCloseGrid();
                if (stateDataHeader?.searchNoCust !== '' || stateDataHeader?.searchNamaCust !== '' || stateDataHeader?.searchNamaSales !== '') {
                    gridDaftarCustomer.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                const data = '';
                if (stateDataHeader?.tipeFocusOpenCust === 'inputNoSubledger') {
                    setTimeout(function () {
                        document.getElementById('noCust')?.focus();
                    }, 100);
                } else if (stateDataHeader?.tipeFocusOpenCust === 'inputNamaSubledger') {
                    setTimeout(function () {
                        document.getElementById('namaCust')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('namaCust')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="noCust"
                    name="noCust"
                    className="noCust"
                    placeholder="<No. Cust>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoCust}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNoCust(value, setStateDataHeader, kode_entitas, setStateDataArray);
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
                    value={stateDataHeader?.searchNamaCust}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNamaCust(value, setStateDataHeader, kode_entitas, setStateDataArray);
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
                    value={stateDataHeader?.searchNamaSales}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNamaSales(value, setStateDataHeader, kode_entitas, setStateDataArray);
                    }}
                />
            </div>

            <GridComponent
                key={keyGrid}
                id="gridDaftarCustomer"
                locale="id"
                //style={{ width: '100%', height: '100%' }}
                ref={(g) => (gridDaftarCustomer = g)}
                dataSource={
                    stateDataHeader?.searchKeywordNoCust !== '' || stateDataHeader?.searchKeywordNamaCust !== '' || stateDataHeader?.searchKeywordNamaSales !== ''
                        ? filteredDataCustomer
                        : dataDaftarCustomer
                }
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'500'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={recordDoubleDaftarCustomer}
                rowDataBound={rowDataBoundListData}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_relasi" headerText="Nama Customer" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="360" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective
                        field="status_warna"
                        headerText="Info Detail"
                        headerTextAlign="Center"
                        textAlign="Left"
                        width="95"
                        clipMode="EllipsisWithTooltip"
                        // template={templateCustomerInfoDetail}
                    />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
            <div className="mt-4 flex items-center justify-between">
                <div className={stylesTtb['custom-box-wrapper']}>
                    <div className={stylesTtb['custom-box-aktif']}></div>
                    <div className={stylesTtb['box-text']}>Aktif</div>
                    <div className={stylesTtb['custom-box-non-aktif']}></div>
                    <div className={stylesTtb['box-text']}>Non Aktif</div>
                    <div className={stylesTtb['custom-box-bl']}></div>
                    <div className={stylesTtb['box-text']}>BlackList-G</div>
                    <div className={stylesTtb['custom-box-noo']}></div>
                    <div className={stylesTtb['box-text']}>New Open Outlet</div>
                    <div className={stylesTtb['custom-box-batal-noo']}></div>
                    <div className={stylesTtb['box-text']}>Batal NOO</div>
                    <div className={stylesTtb['custom-box-tidak-digarap']}></div>
                    <div className={stylesTtb['box-text']}>Tidak Digarap</div>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogDaftarCustomer;
