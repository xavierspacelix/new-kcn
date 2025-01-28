import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { swalToast } from '../interface/template';

interface DialogDaftarFakturProps {
    dialogDaftarFakturVisible: boolean;
    setDialogDaftarFakturVisible: Function;
    dataMasterList: any;
    daftarFaktur: any;
    clickPilihDetailFaktur: any;
    // searchNoItem: string;
    // setSearchNoItem: Function;
    // searchNamaItem: string;
    // setSearchNamaItem: Function;
    // searchKeywordNoBarang: string;
    // setSearchKeywordNoBarang: Function;
    // searchKeywordNamaBarang: string;
    // setSearchKeywordNamaBarang: Function;
    // dataDetailSjItem: any;
    // filteredDataSjItem: any;
    // setFilteredDataSjItem: Function;
    // swalToast: any;
    // HandleSearchNoBarang: Function;
    // HandleSearchNamaBarang: Function;
    // setPilihDetailBarang: Function;
    // setDialogDaftarSjItemVisible: Function;
    // setDataBarang: Function;
    // gridTtbListRef: any;
}

const DialogDaftarFaktur: React.FC<DialogDaftarFakturProps> = ({
    dialogDaftarFakturVisible,
    setDialogDaftarFakturVisible,
    dataMasterList,
    daftarFaktur,
    clickPilihDetailFaktur,
    // searchNoItem,
    // setSearchNoItem,
    // searchNamaItem,
    // setSearchNamaItem,
    // searchKeywordNoBarang,
    // setSearchKeywordNoBarang,
    // searchKeywordNamaBarang,
    // setSearchKeywordNamaBarang,
    // dataDetailSjItem,
    // filteredDataSjItem,
    // setFilteredDataSjItem,
    // swalToast,
    // HandleSearchNoBarang,
    // HandleSearchNamaBarang,
    // setPilihDetailBarang,
    // setDialogDaftarSjItemVisible,
    // setDataBarang,
    // gridTtbListRef,
}) => {
    let dialogDaftarFaktur: Dialog | any;
    let gridDaftarFaktur: Grid | any;
    let currentDaftarBarang: any[] = [];

    let buttonDaftarSjItem: ButtonPropsModel[];
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    buttonDaftarSjItem = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarBarang = gridDaftarFaktur.getSelectedRecords();
                if (currentDaftarBarang.length > 0) {
                    clickPilihDetailFaktur(currentDaftarBarang);
                    setDialogDaftarFakturVisible(false);
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data faktur</p>',
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
                handleCloseDialog();
            },
        },
    ];

    // const handleHapusRow = async () => {
    //     await setDataBarang((state: any) => {
    //         const currentDataSource = gridTtbListRef?.dataSource as any[];
    //         const filteredDataSource = currentDataSource.filter((item) => item.id != null);
    //         gridTtbListRef?.setProperties({ dataSource: filteredDataSource });
    //         return {
    //             ...state,
    //         };
    //     });
    //     await setDialogDaftarSjItemVisible(false);
    // };

    const handleCloseDialog = () => {
        setDialogDaftarFakturVisible(false);
    };

    return (
        <DialogComponent
            ref={(d: any) => (dialogDaftarFaktur = d)}
            id="dialogDaftarFaktur"
            target="#dialogTtpList"
            style={{ position: 'fixed' }}
            header={`Daftar Faktur [${dataMasterList?.nama_relasi}]`}
            visible={dialogDaftarFakturVisible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="50%"
            height="65%"
            buttons={buttonDaftarSjItem}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                // console.log('closeDialog');
                // gridDaftarSjItem.clearSelection();
                // handleHapusRow();
                // if (searchNoItem != '' || searchNamaItem != '') {
                //     gridDaftarSjItem.dataSource = [];
                // }
                handleCloseDialog();
            }}
            // closeOnEscape={true}
            // open={(args: any) => {
            //     console.log('openDialog');
            //     setSearchNoItem('');
            //     setSearchNamaItem('');
            //     setTimeout(function () {
            //         // document.getElementById(activeSearchDaftarBarang)?.focus();
            //     }, 100);
            // }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoItem1"
                    name="searchNoItem1"
                    className="searchNoItem1"
                    placeholder="<No. Barang>"
                    showClearButton={true}
                    // value={searchNoItem}
                    // input={(args: FocusInEventArgs) => {
                    //     const value: any = args.value;
                    //     HandleSearchNoBarang(value, setSearchKeywordNoBarang, setFilteredDataSjItem, dataDetailSjItem);
                    // }}
                />
            </div>
            <GridComponent
                id="gridDaftarFaktur"
                locale="id"
                //style={{ width: '100%', height: '100%' }}
                ref={(g: any) => (gridDaftarFaktur = g)}
                dataSource={daftarFaktur}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarFaktur) {
                        //Selecting row first
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarFaktur.selectRow(rowIndex);
                        currentDaftarBarang = gridDaftarFaktur.getSelectedRecords();
                        if (currentDaftarBarang.length > 0) {
                            clickPilihDetailFaktur(currentDaftarBarang);
                            setDialogDaftarFakturVisible(false);
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data faktur</p>',
                                width: '100%',
                                // target: '#dialogDaftarFaktur',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_fj" headerText="No. Faktur" headerTextAlign="Center" textAlign="Left" width="100" />
                    <ColumnDirective field="tgl_fj" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="80" format={formatDate} type="date" />
                    <ColumnDirective field="hari" headerText="OD" headerTextAlign="Center" textAlign="Center" width="60" />
                    <ColumnDirective field="netto_mu" format="N2" headerText="Nilai Faktur" headerTextAlign="Center" textAlign="Right" width="120" />
                    <ColumnDirective field="sisa_mu" format="N2" headerText="Sisa" headerTextAlign="Center" textAlign="Right" width="120" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarFaktur;
