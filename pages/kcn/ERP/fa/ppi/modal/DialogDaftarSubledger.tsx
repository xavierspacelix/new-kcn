import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';

interface DialogDaftarSubledgerProps {
    visible: boolean;
    stateDataDetail: any;
    stateDataHeader: any;
    // buttonDaftarSubledger: any;
    // gridDaftarSubledger: any;
    setStateDataDetail: Function;
    filteredDataSubledger: any;
    dataDaftarSubledger: any;
    HandleSearchNoSubledger: any;
    HandleSearchNamaSubledger: any;
    // handleClickDaftarSubledger: any;
    swalToast: any;
    setFilteredDataSubledger: Function;
    setDataJurnal: Function;
}

const DialogDaftarSubledger: React.FC<DialogDaftarSubledgerProps> = ({
    visible,
    stateDataDetail,
    stateDataHeader,
    // buttonDaftarSubledger,
    // gridDaftarSubledger,
    setStateDataDetail,
    filteredDataSubledger,
    dataDaftarSubledger,
    HandleSearchNoSubledger,
    HandleSearchNamaSubledger,
    // handleClickDaftarSubledger,
    swalToast,
    setFilteredDataSubledger,
    setDataJurnal,
}) => {
    let buttonDaftarSubledger: ButtonPropsModel[];
    let currentDaftarSubledger: any[] = [];
    let gridDaftarSubledger: Grid | any;
    let dialogDaftarSubledger: Dialog | any;

    buttonDaftarSubledger = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarSubledger = gridDaftarSubledger.getSelectedRecords();
                if (currentDaftarSubledger.length > 0) {
                    handleClickDaftarSubledger(currentDaftarSubledger);
                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        dialogDaftarSubledgerVisible: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data akun</p>',
                        width: '100%',
                        target: '#dialogDaftarSubledger',
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
                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSubledgerVisible: false,
                }));
            },
        },
    ];

    const handleClickDaftarSubledger = async (data: any) => {
        await setDataJurnal((state: any) => {
            const newNodes = state?.nodes.map((node: any) => {
                if (node.id === stateDataDetail?.rowsIdJurnal) {
                    return {
                        ...node,
                        subledger: data[0].subledger,
                        kode_subledger: data[0].kode_subledger,
                        no_subledger: data[0].no_subledger,
                        nama_subledger: data[0].nama_subledger,
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

    return (
        <DialogComponent
            id="dialogDaftarSubledger"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={() => {
                return (
                    <div>
                        <div className="header-title" style={{ width: '93%' }}>
                            Subledger
                        </div>
                    </div>
                );
            }}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="40%"
            height="65%"
            buttons={buttonDaftarSubledger}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarSubledger.clearSelection();
                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSubledgerVisible: false,
                    searchNoSubledger: '',
                    searchNamaSubledger: '',
                    searchKeywordNamaSubledger: '',
                    searchKeywordNoSubledger: '',
                }));
                const searchNoSubledger = document.getElementById('searchNoSubledger') as HTMLInputElement;
                if (searchNoSubledger) {
                    searchNoSubledger.value = '';
                }
                const searchNamaSubledger = document.getElementById('searchNamaSubledger') as HTMLInputElement;
                if (searchNamaSubledger) {
                    searchNamaSubledger.value = '';
                }
                if (stateDataDetail?.searchNoSubledger != '' || stateDataDetail?.searchNamaSubledger != '') {
                    gridDaftarSubledger.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFilterOpen === 'Input') {
                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        searchNoSubledger: stateDataDetail?.searchNoSubledger,
                        searchNamaSubledger: stateDataDetail?.searchNamaSubledger,
                    }));
                } else {
                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        searchNoSubledger: '',
                        searchNamaSubledger: '',
                    }));
                    const searchNoSubledger = document.getElementById('searchNoSubledger') as HTMLInputElement;
                    if (searchNoSubledger) {
                        searchNoSubledger.value = '';
                    }
                    const searchNamaSubledger = document.getElementById('searchNamaSubledger') as HTMLInputElement;
                    if (searchNamaSubledger) {
                        searchNamaSubledger.value = '';
                    }
                }

                if (stateDataHeader?.tipeFocusOpen === 'noAkun') {
                    setTimeout(function () {
                        document.getElementById('searchNoSubledger')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaSubledger')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoSubledger"
                    name="searchNoSubledger"
                    className="searchNoSubledger"
                    placeholder="<No. Subledger>"
                    showClearButton={true}
                    value={stateDataDetail?.searchNoSubledger}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoSubledger(value, setStateDataDetail, setFilteredDataSubledger, dataDaftarSubledger);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaSubledger"
                    name="searchNamaSubledger"
                    className="searchNamaSubledger"
                    placeholder="<Nama Subledger>"
                    showClearButton={true}
                    value={stateDataDetail?.searchNamaSubledger}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaSubledger(value, setStateDataDetail, setFilteredDataSubledger, dataDaftarSubledger);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarSubledger"
                locale="id"
                ref={(g: any) => (gridDaftarSubledger = g)}
                dataSource={stateDataDetail?.searchKeywordNoSubledger !== '' || stateDataDetail?.searchKeywordNamaSubledger !== '' ? filteredDataSubledger : dataDaftarSubledger}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarSubledger) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarSubledger.selectRow(rowIndex);
                        const currentDaftarSubledger = gridDaftarSubledger.getSelectedRecords();
                        if (currentDaftarSubledger.length > 0) {
                            handleClickDaftarSubledger(currentDaftarSubledger);
                            setStateDataDetail((prevState: any) => ({
                                ...prevState,
                                dialogDaftarSubledgerVisible: false,
                            }));
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data barang</p>',
                                width: '100%',
                                target: '#dialogDaftarSubledger',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_subledger" headerText="No. Subledger" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_subledger" headerText="Keterangan" headerTextAlign="Left" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSubledger;
