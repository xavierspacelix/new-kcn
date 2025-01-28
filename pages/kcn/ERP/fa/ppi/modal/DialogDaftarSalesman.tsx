import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';

interface DialogDaftarSalesmanProps {
    visible: boolean;
    stateDataHeader: any;
    // buttonDaftarAkunKredit: any;
    // gridDaftarAkunKredit: any;
    setStateDataHeader: any;
    dataDaftarSalesman: any;
    filteredDataSalesman: any;
    // handleClickDaftarAkunKredit: any;
    // handleClickDaftarAkunKreditJurnal: any;
    swalToast: any;
    HandleSearchNoSales: any;
    HandleSearchNamaSales: any;
    TemplateNoAkun: any;
    TemplateNamaAkun: any;
    setFilteredDataSalesman: Function;
    setDataJurnal: Function;
    stateDataDetail: any;
    rowIdJurnal: any;
}

const DialogDaftarSalesman: React.FC<DialogDaftarSalesmanProps> = ({
    visible,
    stateDataHeader,
    // buttonDaftarAkunKredit,
    // gridDaftarAkunKredit,
    setStateDataHeader,
    dataDaftarSalesman,
    filteredDataSalesman,
    // handleClickDaftarAkunKredit,
    // handleClickDaftarAkunKreditJurnal,
    swalToast,
    HandleSearchNoSales,
    HandleSearchNamaSales,
    TemplateNoAkun,
    TemplateNamaAkun,
    setFilteredDataSalesman,
    setDataJurnal,
    stateDataDetail,
    rowIdJurnal,
}) => {
    let buttonDaftarSales: ButtonPropsModel[];
    let currentDaftarSales: any[] = [];
    let gridDaftarSalesman: Grid | any;
    let dialogDaftarSalesman: Dialog | any;
    buttonDaftarSales = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarSales = gridDaftarSalesman.getSelectedRecords();
                if (currentDaftarSales.length > 0) {
                    if (stateDataHeader?.tipeSalesmanDialogVisible === 'header') {
                        handleClickDaftarSales(currentDaftarSales);
                    }
                    handleClickDaftarSales(currentDaftarSales);
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        dialogDaftarSalesmanVisible: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data Salesman</p>',
                        width: '100%',
                        target: '#dialogDaftarSalesman',
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

    const handleClickDaftarSales = (data: any) => {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            no_salesValue: data[0].no_sales,
            nama_salesValue: data[0].nama_sales,
            kode_salesValue: data[0].kode_sales,
        }));
    };

    const handleHapusRow = async () => {
        await setDataJurnal((state: any) => {
            const updatedNodes = state?.nodes.filter((node: any) => node.no_sales !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSalesmanVisible: false,
        }));
    };

    const handleHapusRowCloseGrid = async () => {
        await setDataJurnal((state: any) => {
            const updatedNodes = state?.nodes.filter((node: any) => node.no_sales !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSalesmanVisible: false,
            searchNoSales: '',
            searchNamaSales: '',
            searchKeywordNamaSales: '',
            searchKeywordNoSales: '',
        }));
    };

    return (
        <DialogComponent
            id="dialogDaftarSalesman"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={() => (
                <div>
                    <div className="header-title" style={{ width: '93%' }}>
                        Daftar Kolektor / Salesman
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
            buttons={buttonDaftarSales}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarSalesman.clearSelection();
                handleHapusRowCloseGrid();
                const searchNoSales = document.getElementById('searchNoSales') as HTMLInputElement;
                if (searchNoSales) {
                    searchNoSales.value = '';
                }
                const searchNamaSales = document.getElementById('searchNamaSales') as HTMLInputElement;
                if (searchNamaSales) {
                    searchNamaSales.value = '';
                }
                if (stateDataHeader?.searchNoSales !== '' || stateDataHeader?.searchNamaSales !== '') {
                    gridDaftarSalesman.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFilterOpen === 'Input') {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoSales: stateDataHeader?.searchNoSales,
                        searchNamaSales: stateDataHeader?.searchNamaSales,
                    }));
                } else {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoSales: '',
                        searchNamaSales: '',
                    }));
                    const searchNoSales = document.getElementById('searchNoSales') as HTMLInputElement;
                    if (searchNoSales) {
                        searchNoSales.value = '';
                    }
                    const searchNamaSales = document.getElementById('searchNamaSales') as HTMLInputElement;
                    if (searchNamaSales) {
                        searchNamaSales.value = '';
                    }
                }

                if (stateDataHeader?.tipeFocusOpen === 'noSales') {
                    setTimeout(function () {
                        document.getElementById('searchNoSales')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaSales')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoSales"
                    name="searchNoSales"
                    className="searchNoSales"
                    placeholder="<No. Sales>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoSales}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoSales(value, setStateDataHeader, setFilteredDataSalesman, dataDaftarSalesman);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaSales"
                    name="searchNamaSales"
                    className="searchNamaSales"
                    placeholder="<Nama Sales>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNamaSales}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaSales(value, setStateDataHeader, setFilteredDataSalesman, dataDaftarSalesman);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarSalesman"
                locale="id"
                ref={(g: any) => (gridDaftarSalesman = g)}
                dataSource={stateDataHeader?.searchKeywordNoSales !== '' || stateDataHeader?.searchKeywordNamaSales !== '' ? filteredDataSalesman : dataDaftarSalesman}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarSalesman) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarSalesman.selectRow(rowIndex);
                        const currentDaftarSales = gridDaftarSalesman.getSelectedRecords();
                        if (currentDaftarSales.length > 0) {
                            if (stateDataHeader?.tipeSalesmanDialogVisible === 'header') {
                                handleClickDaftarSales(currentDaftarSales);
                                setStateDataHeader((prevState: any) => ({
                                    ...prevState,
                                    dialogDaftarSalesmanVisible: false,
                                }));
                            }
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data Sales</p>',
                                width: '100%',
                                target: '#dialogDaftarSalesman',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_sales" headerText="No. Sales" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_sales" headerText="Nama Sales" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSalesman;
