import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';

import stylesTtb from "../ttblist.module.css"


interface DialogDaftarCustomerProps {
    modal1: boolean;
    setModal1: Function;
    searchNoCust: string;
    setSearchNoCust: Function;
    searchNamaCust: string;
    setSearchNamaCust: Function;
    searchNamaSales: string;
    setSearchNamaSales: Function;
    searchKeywordNoCust: string;
    setSearchKeywordNoCust: Function;
    searchKeywordNamaCust: string;
    setSearchKeywordNamaCust: Function;
    searchKeywordNamaSales: string;
    setSearchKeywordNamaSales: Function;
    kode_entitas: string;
    filteredData: any;
    setFilteredData: Function;
    dsDaftarCustomer: any;
    recordDoubleDaftarCustomer: (args: any) => void;
    swalToast: any;
    HandleSearchNoCust: Function;
    HandleSearchNamaCust: Function;
    HandleSearchNamaSales: Function;
    activeSearchDaftarCustomer: string;
    // buttonDaftarCustomer: any[];
    stylesTtbB: any;
    templateCustomerInfoDetail: any;
    HandleSelectedDataCustomer: Function;
    setCustSelected: Function;
    setCustSelectedKode: Function;
    setSelectedKodeRelasi: Function;
    setModal2: Function;
}

const DialogDaftarCustomerTtb: React.FC<DialogDaftarCustomerProps> = ({
    modal1,
    setModal1,
    searchNoCust,
    setSearchNoCust,
    searchNamaCust,
    setSearchNamaCust,
    searchNamaSales,
    setSearchNamaSales,
    searchKeywordNoCust,
    setSearchKeywordNoCust,
    searchKeywordNamaCust,
    setSearchKeywordNamaCust,
    searchKeywordNamaSales,
    setSearchKeywordNamaSales,
    kode_entitas,
    filteredData,
    setFilteredData,
    dsDaftarCustomer,
    recordDoubleDaftarCustomer,
    swalToast,
    HandleSearchNoCust,
    HandleSearchNamaCust,
    HandleSearchNamaSales,
    activeSearchDaftarCustomer,
    // buttonDaftarCustomer,
    stylesTtbB,
    templateCustomerInfoDetail,
    HandleSelectedDataCustomer,
    setCustSelected,
    setCustSelectedKode,
    setSelectedKodeRelasi,
    setModal2,
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
                    HandleSelectedDataCustomer(currentDaftarCustomer, 'header', setCustSelected, setCustSelectedKode, setSelectedKodeRelasi, setModal2);
                    // setPilihDetailBarang(currentDaftarBarang);
                    setModal1(false);
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
                await setModal1(false);
            },
        },
    ];

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
            ref={(d: any) => (dialogDaftarCustomer = d)}
            id="dialogDaftarCustomer"
            target="#dialogTtbList"
            // target="#main-target"
            style={{ position: 'fixed' }}
            header={'Daftar Customer'}
            visible={modal1}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="84%"
            height="85%"
            buttons={buttonDaftarCustomer}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                console.log('closeDialog');
                gridDaftarCustomer.clearSelection();
                setModal1(false);
                if (searchNoCust !== '' || searchNamaCust !== '' || searchNamaSales !== '') {
                    gridDaftarCustomer.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                console.log('openDialogCustomer');
                const data = '';
                HandleSearchNoCust('', setSearchKeywordNoCust, kode_entitas, setFilteredData);
                setSearchNamaCust(data);
                setSearchNamaSales(data);
                setTimeout(function () {
                    document.getElementById(activeSearchDaftarCustomer)?.focus();
                    setSearchNoCust(data);
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
                    value={searchNoCust}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNoCust(value, setSearchKeywordNoCust, kode_entitas, setFilteredData);
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
                    value={searchNamaCust}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNamaCust(value, setSearchKeywordNamaCust, kode_entitas, setFilteredData);
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
                    value={searchNamaSales}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNamaSales(value, setSearchKeywordNamaSales, kode_entitas, setFilteredData);
                    }}
                />
            </div>

            <GridComponent
                id="gridDaftarCustomer"
                locale="id"
                //style={{ width: '100%', height: '100%' }}
                ref={(g: any) => (gridDaftarCustomer = g)}
                dataSource={searchKeywordNoCust !== '' || searchKeywordNamaCust !== '' || searchKeywordNamaSales !== '' ? filteredData : dsDaftarCustomer}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={recordDoubleDaftarCustomer}
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

export default DialogDaftarCustomerTtb;
