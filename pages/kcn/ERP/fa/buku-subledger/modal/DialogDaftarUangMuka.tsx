import React, { useEffect } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { swalToast } from '../interface/template';
import { CurrencyFormat, GetListDataBukuSubledger, HandleSearchNamaSupplier, HandleSearchNoSupplier } from '../functional/fungsiForm';
import moment from 'moment';
import Swal from 'sweetalert2';

interface DialogDaftarUangMukaProps {
    visible: boolean;
    stateDataHeader: any;
    setStateDataHeader: Function;
    setStateDataArray: any;
    kode_entitas: any;
    token: any;
    stateDataArray: any;
}

const DialogDaftarUangMuka: React.FC<DialogDaftarUangMukaProps> = ({ visible, stateDataHeader, setStateDataHeader, setStateDataArray, kode_entitas, token, stateDataArray }) => {
    let dialogDaftarUangMuka: Dialog | any;
    let buttonDaftarUangMuka: ButtonPropsModel[];
    let currentDaftarUangMuka: any[] = [];
    let gridDaftarUangMuka: Grid | any;
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

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

    const handleClickDaftarUangMuka = async (data: any) => {
        const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            kode_subledger: stateDataHeader?.kodeSubValue,
            kode_jual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
            no_kontrak_um: data[0].no_kontrak,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };

        console.log('paramObject = ', paramObject);
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            noKontrakUm: data[0].no_kontrak,
        }));

        const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
        await setStateDataArray((prevState: any) => ({
            ...prevState,
            recordsData: getListDataBukuSubledger,
        }));
    };

    return (
        <DialogComponent
            id="dialogDaftarUangMuka"
            target="#main-target"
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
            height="45%"
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
            open={(args: any) => {}}
        >
            <div style={{ backgroundColor: '#9f9a9a', textAlign: 'left', fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                <span>Jenis Vendor</span>
            </div>
            <GridComponent
                id="gridDaftarUangMuka"
                locale="id"
                ref={(g) => (gridDaftarUangMuka = g)}
                dataSource={stateDataArray?.dataDaftarUangMuka}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286px'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
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
                            Swal.fire({
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
