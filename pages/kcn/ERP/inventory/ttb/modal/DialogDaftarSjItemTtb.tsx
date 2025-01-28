import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';

interface DialogDaftarSjItemProps {
    dialogDaftarSjItemVisible: boolean;
    searchNoItem: string;
    setSearchNoItem: Function;
    searchNamaItem: string;
    setSearchNamaItem: Function;
    searchKeywordNoBarang: string;
    setSearchKeywordNoBarang: Function;
    searchKeywordNamaBarang: string;
    setSearchKeywordNamaBarang: Function;
    dataDetailSjItem: any;
    filteredDataSjItem: any;
    setFilteredDataSjItem: Function;
    swalToast: any;
    HandleSearchNoBarang: Function;
    HandleSearchNamaBarang: Function;
    setPilihDetailBarang: Function;
    setDialogDaftarSjItemVisible: Function;
    setDataBarang: Function;
    gridTtbListRef: any;
}

const DialogDaftarSjItemTtb: React.FC<DialogDaftarSjItemProps> = ({
    dialogDaftarSjItemVisible,
    searchNoItem,
    setSearchNoItem,
    searchNamaItem,
    setSearchNamaItem,
    searchKeywordNoBarang,
    setSearchKeywordNoBarang,
    searchKeywordNamaBarang,
    setSearchKeywordNamaBarang,
    dataDetailSjItem,
    filteredDataSjItem,
    setFilteredDataSjItem,
    swalToast,
    HandleSearchNoBarang,
    HandleSearchNamaBarang,
    setPilihDetailBarang,
    setDialogDaftarSjItemVisible,
    setDataBarang,
    gridTtbListRef,
}) => {
    let dialogDaftarSjItem: Dialog | any;
    let dialogDaftarSj: Dialog | any;
    let gridDaftarSjItem: Grid | any;
    let currentDaftarBarang: any[] = [];

    let buttonDaftarSjItem: ButtonPropsModel[];
    buttonDaftarSjItem = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarBarang = gridDaftarSjItem.getSelectedRecords();
                if (currentDaftarBarang.length > 0) {
                    setPilihDetailBarang(currentDaftarBarang);
                    setDialogDaftarSjItemVisible(false);
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data barang</p>',
                        width: '100%',
                        target: '#dialogDaftarSjItem',
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
                // setDialogDaftarSjItemVisible(false);
                handleHapusRow();
            },
        },
    ];

    const handleHapusRow = async () => {
        await setDataBarang((state: any) => {
            const currentDataSource = gridTtbListRef?.dataSource as any[];
            const filteredDataSource = currentDataSource.filter((item) => item.id != null);
            gridTtbListRef?.setProperties({ dataSource: filteredDataSource });
            return {
                ...state,
            };
        });
        await setDialogDaftarSjItemVisible(false);
    };

    return (
        <DialogComponent
            ref={(d: any) => (dialogDaftarSjItem = d)}
            id="dialogDaftarSjItem"
            target="#dialogTtbList"
            style={{ position: 'fixed' }}
            header={'Daftar Surat Jalan'}
            visible={dialogDaftarSjItemVisible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="84%"
            height="65%"
            buttons={buttonDaftarSjItem}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                console.log('closeDialog');
                gridDaftarSjItem.clearSelection();
                handleHapusRow();
                if (searchNoItem != '' || searchNamaItem != '') {
                    gridDaftarSjItem.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                console.log('openDialog');
                setSearchNoItem('');
                setSearchNamaItem('');
                setTimeout(function () {
                    // document.getElementById(activeSearchDaftarBarang)?.focus();
                }, 100);
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoItem1"
                    name="searchNoItem1"
                    className="searchNoItem1"
                    placeholder="<No. Barang>"
                    showClearButton={true}
                    value={searchNoItem}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNoBarang(value, setSearchKeywordNoBarang, setFilteredDataSjItem, dataDetailSjItem);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '300px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaItem1"
                    name="searchNamaItem1"
                    className="searchNamaItem1"
                    placeholder="<Nama Barang>"
                    showClearButton={true}
                    value={searchNamaItem}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNamaBarang(value, setSearchKeywordNamaBarang, setFilteredDataSjItem, dataDetailSjItem);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarSjItem"
                locale="id"
                //style={{ width: '100%', height: '100%' }}
                ref={(g: any) => (gridDaftarSjItem = g)}
                dataSource={searchKeywordNoBarang !== '' || searchKeywordNamaBarang !== '' ? filteredDataSjItem : dataDetailSjItem}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarSjItem) {
                        //Selecting row first
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarSjItem.selectRow(rowIndex);
                        currentDaftarBarang = gridDaftarSjItem.getSelectedRecords();
                        if (currentDaftarBarang.length > 0) {
                            setPilihDetailBarang(currentDaftarBarang);
                            setDialogDaftarSjItemVisible(false);
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data barang</p>',
                                width: '100%',
                                target: '#dialogDaftarSjItem',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_sj" headerText="No. SJ" headerTextAlign="Center" textAlign="Left" width="120" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="tgl_sj" headerText="Tanggal SJ" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="no_item" headerText="No. Barang" headerTextAlign="Center" textAlign="Left" width="85" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="diskripsi" headerText="Nama Barang" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="qty" headerText="Qty" headerTextAlign="Center" textAlign="Right" width="75" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="jml_mak" headerText="Jumlah Max" headerTextAlign="Center" textAlign="Right" width="75" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSjItemTtb;
