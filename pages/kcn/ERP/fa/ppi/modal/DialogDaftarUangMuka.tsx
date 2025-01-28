import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';

interface DialogDaftarUangMukaProps {
    visible: boolean;
    stateDataHeader: any;
    // buttonDaftarUangMuka: any;
    // gridDaftarUangMuka: any;
    setStateDataHeader: any;
    dataDaftarUangMuka: any;
    // handleClickDaftarUangMuka: any;
    swalToast: any;
    formatDate: any;
    CurrencyFormat: any;
}

const DialogDaftarUangMuka: React.FC<DialogDaftarUangMukaProps> = ({
    visible,
    stateDataHeader,
    // buttonDaftarUangMuka,
    // gridDaftarUangMuka,
    setStateDataHeader,
    dataDaftarUangMuka,
    // handleClickDaftarUangMuka,
    swalToast,
    formatDate,
    CurrencyFormat,
}) => {
    let dialogDaftarUangMuka: Dialog | any;
    let buttonDaftarUangMuka: ButtonPropsModel[];
    let currentDaftarUangMuka: any[] = [];
    let gridDaftarUangMuka: Grid | any;

    buttonDaftarUangMuka = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarUangMuka = gridDaftarUangMuka.getSelectedRecords();
                if (currentDaftarUangMuka.length > 0) {
                    handleClickDaftarUangMuka(currentDaftarUangMuka);
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        dialogDaftarUangMukaVisible: false,
                        // pilihAkunKredit: true,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data uang muka</p>',
                        width: '100%',
                        target: '#dialogDaftarUangMuka',
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
                setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarUangMukaVisible: false,
                }));
            },
        },
    ];

    const handleClickDaftarUangMuka = (data: any) => {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            noKontrakValue: data[0].no_kontrak,
        }));
    };

    return (
        <DialogComponent
            id="dialogDaftarUangMuka"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={() => {
                return (
                    <div>
                        <div className="header-title" style={{ width: '93%' }}>
                            Daftar Uang Muka
                        </div>
                    </div>
                );
            }}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="60%"
            height="65%"
            buttons={buttonDaftarUangMuka}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarUangMuka.clearSelection();
                setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarUangMukaVisible: false,
                }));
            }}
            closeOnEscape={true}
            open={(args: any) => {
            }}
        >
            <div style={{ backgroundColor: '#9f9a9a', textAlign: 'left', fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                <span>Jenis Vendor</span>
            </div>
            <GridComponent
                id="gridDaftarUangMuka"
                locale="id"
                ref={(g: any) => (gridDaftarUangMuka = g)}
                dataSource={dataDaftarUangMuka}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarUangMuka) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarUangMuka.selectRow(rowIndex);
                        const currentDaftarUangMuka = gridDaftarUangMuka.getSelectedRecords();
                        if (currentDaftarUangMuka.length > 0) {
                            handleClickDaftarUangMuka(currentDaftarUangMuka);
                            setStateDataHeader((prevState: any) => ({
                                ...prevState,
                                dialogDaftarUangMukaVisible: false,
                            }));
                        } else {
                            swalToast().fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data uang muka</p>',
                                width: '100%',
                                target: '#dialogDaftarUangMuka',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_dokumen" headerText="No. Dokumen" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="no_kontrak" headerText="No. Kontrak" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="tgl_dok" headerText="Tgl. Dokumen" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" format={formatDate} type="date" />
                    <ColumnDirective
                        template={(args: any) => <div>{CurrencyFormat(args.total_rp)}</div>}
                        field="total_rp"
                        headerText="Total Uang Muka"
                        headerTextAlign="Center"
                        textAlign="Right"
                        width="100"
                        clipMode="EllipsisWithTooltip"
                    />
                    <ColumnDirective
                        template={(args: any) => <div>{CurrencyFormat(args.sisa_rp)}</div>}
                        field="sisa_rp"
                        headerText="Sisa Uang Muka"
                        headerTextAlign="Center"
                        textAlign="Right"
                        width="100"
                        clipMode="EllipsisWithTooltip"
                    />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarUangMuka;
