import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';

interface DialogDaftarSjProps {
    dialogDaftarSjVisible: boolean;
    searchNoDokumen: string;
    setSearchNoDokumen: Function;
    searchNamaRelasi: string;
    setSearchNamaRelasi: Function;
    searchKeywordNoDok: string;
    setSearchKeywordNoDok: Function;
    searchKeywordNamaRelasi: string;
    setSearchKeywordNamaRelasi: Function;
    dataDetailSj: any;
    filteredDataSj: any;
    setFilteredDataSj: Function;
    swalToast: any;
    HandleSearchNoDok: Function;
    HandleSearchNamaRelasi: Function;
    handleClickDaftarSj: Function;
    // activeSearchNoDokumen: string;
    setDialogDaftarSjVisible: Function;
    setSearchNamaRealasi: Function;
    setDataBarang: Function;
}

const DialogDaftarSjTtb: React.FC<DialogDaftarSjProps> = ({
    dialogDaftarSjVisible,
    searchNoDokumen,
    setSearchNoDokumen,
    searchNamaRelasi,
    setSearchNamaRelasi,
    searchKeywordNoDok,
    setSearchKeywordNoDok,
    searchKeywordNamaRelasi,
    setSearchKeywordNamaRelasi,
    dataDetailSj,
    filteredDataSj,
    setFilteredDataSj,
    swalToast,
    HandleSearchNoDok,
    HandleSearchNamaRelasi,
    handleClickDaftarSj,
    // activeSearchNoDokumen,
    setDialogDaftarSjVisible,
    setSearchNamaRealasi,
    setDataBarang,
}) => {
    let dialogDaftarSj: Dialog | any;
    let buttonDaftarSj: ButtonPropsModel[];
    let currentDaftarBarang: any[] = [];
    let gridDaftarSj: Grid | any;

    buttonDaftarSj = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarBarang = gridDaftarSj.getSelectedRecords();
                if (currentDaftarBarang.length > 0) {
                    handleClickDaftarSj(currentDaftarBarang);
                    setDialogDaftarSjVisible(false);
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data barang</p>',
                        width: '100%',
                        target: '#dialogDaftarSj',
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
                // setDialogDaftarSjVisible(false);
                handleHapusRow();
            },
        },
    ];

    const handleHapusRow = async () => {
        await setDataBarang((state: any) => {
            const updatedNodes = state?.nodes.filter((node: any) => node.no_sj !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        await setDialogDaftarSjVisible(false);
    };

    return (
        <DialogComponent
            ref={(d: any) => (dialogDaftarSj = d)}
            id="dialogDaftarSj"
            target="#dialogTtbList"
            style={{ position: 'fixed' }}
            header={'Daftar Surat Jalan'}
            visible={dialogDaftarSjVisible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="84%"
            height="65%"
            buttons={buttonDaftarSj}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                console.log('closeDialog');
                gridDaftarSj.clearSelection();
                // setDialogDaftarSjVisible(false);
                handleHapusRow();
                if (searchNoDokumen != '' || searchNamaRelasi != '') {
                    gridDaftarSj.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                console.log('openDialog');
                setSearchNoDokumen('');
                setSearchNamaRealasi('');
                setTimeout(function () {
                    // document.getElementById(activeSearchNoDokumen)?.focus();
                }, 100);
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoDokumen"
                    name="searchNoDokumen"
                    className="searchNoDokumen"
                    placeholder="<No. Dokumen>"
                    showClearButton={true}
                    value={searchNoDokumen}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNoDok(value, setSearchKeywordNoDok, setFilteredDataSj, dataDetailSj);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '300px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaRelasi"
                    name="searchNamaRelasi"
                    className="searchNamaRelasi"
                    placeholder="<Nama Relasi>"
                    showClearButton={true}
                    value={searchNamaRelasi}
                    input={(args: FocusInEventArgs) => {
                        const value: any = args.value;
                        HandleSearchNamaRelasi(value, setSearchKeywordNamaRelasi, setFilteredDataSj, dataDetailSj);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarSj"
                locale="id"
                //style={{ width: '100%', height: '100%' }}
                ref={(g: any) => (gridDaftarSj = g)}
                dataSource={searchKeywordNoDok !== '' || searchKeywordNamaRelasi !== '' ? filteredDataSj : dataDetailSj}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarSj) {
                        //Selecting row first
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarSj.selectRow(rowIndex);
                        currentDaftarBarang = gridDaftarSj.getSelectedRecords();
                        if (currentDaftarBarang.length > 0) {
                            handleClickDaftarSj(currentDaftarBarang);
                            setDialogDaftarSjVisible(false);
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data barang</p>',
                                width: '100%',
                                target: '#dialogDaftarSj',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_dok" headerText="No. Dokumen" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="tgl_dok" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="60" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="alamat" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="via" headerText="Via" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSjTtb;
