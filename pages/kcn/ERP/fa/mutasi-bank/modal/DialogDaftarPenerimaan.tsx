import React, { useEffect, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import moment from 'moment';
import styles from '@styles/index.module.css';
// import { TemplateNamaAkun, TemplateNoAkun } from '../interface/template';
import { DaftarAkunKredit, GetCekAkunKasBank, GetCekPenerimaanWarkatDialog, GetDaftarPenerimaanWarkat } from '@/lib/fa/mutasi-bank/api/api';
import { handleModalDaftarAkun, ShowNewRecordWarkat, swalToast } from '@/lib/fa/mutasi-bank/functional/fungsiForm';
import template from '@utils/fa/mutasi-bank/interface/fungsi';
const { TemplateNamaAkun, TemplateNoAkun } = template;

interface DialogDaftarPenerimaanProps {
    visible: boolean;
    listStateData: any;
    setListStateData: any;
    kode_entitas: any;
    vRefreshData: any;
    paramObject: any;
    handleParamsObject: any;
    token: any;
}

let gridKeyDaftarAkunKredit = ``;
const DialogDaftarPenerimaan: React.FC<DialogDaftarPenerimaanProps> = ({ visible, listStateData, setListStateData, kode_entitas, vRefreshData, paramObject, handleParamsObject, token }) => {
    let buttonDaftarPenerimaan: ButtonPropsModel[];
    let currentDaftarPenerimaan: any[] = [];
    // let gridDaftarPenerimaan: Grid | any;
    let dialogDaftarPenerimaan: Dialog | any;
    let recordCount: any;
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const recordsDataRef = useRef('');
    const gridDaftarPenerimaan = useRef<GridComponent>(null);
    // gridKeyDaftarAkunKredit = `${moment().format('HHmmss')}-${JSON.stringify(dataDaftarAkunKredit)}`;

    useEffect(() => {
        const async = async () => {
            if (paramObject.noRekeningApi !== '') {
                const respCekDataPenerimaan = await GetCekPenerimaanWarkatDialog(paramObject);
                const recordCount = respCekDataPenerimaan.length > 0 ? 1 : 0;
                const resultDaftarPenerimaanWarkat = await GetDaftarPenerimaanWarkat(paramObject, recordCount);
                const resultDaftarPenerimaanWarkatFix = resultDaftarPenerimaanWarkat.map((item: any) => ({
                    ...item,
                    jumlah_rp: parseFloat(item.jumlah_rp),
                    tgl_dokumen: moment(item.tgl_dokumen).format('DD-MM-YYYY'),
                }));

                recordsDataRef.current = resultDaftarPenerimaanWarkatFix;
                gridDaftarPenerimaan.current?.setProperties({ dataSource: resultDaftarPenerimaanWarkatFix });
                gridDaftarPenerimaan.current?.refresh();
            }
        };
        async();
    }, [vRefreshData, paramObject, gridDaftarPenerimaan.current]);
    buttonDaftarPenerimaan = [
        {
            buttonModel: {
                content: 'Update',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: async () => {
                currentDaftarPenerimaan = gridDaftarPenerimaan.current?.getSelectedRecords() || [];
                if (currentDaftarPenerimaan.length > 0) {
                    handleClickDaftarPenerimaan(currentDaftarPenerimaan);
                    setListStateData((prevState: any) => ({
                        ...prevState,
                        plagViewModalDaftarPenerimaan: false,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Silahkan pilih data penerimaan</p>',
                        width: '100%',
                        target: '#dialogDaftarPenerimaan',
                        customClass: {
                            popup: styles['colored-popup'],
                        },
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
                closeModal();
            },
        },
    ];

    const closeModal = () => {
        setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarPenerimaan: false,
        }));
    };

    const handleClickDaftarPenerimaan = (data: any) => {
        const mergerObject = {
            ...handleParamsObject,
            tipe: 'pencairanWarkatPpi',
            additionalData: data,
        };
        ShowNewRecordWarkat(mergerObject);
    };

    return (
        <DialogComponent
            id="dialogDaftarPenerimaan"
            // target="#main-target"
            // style={{ position: 'fixed', maxHeight: undefined }}
            className={styles['no-max-height']}
            header={() => (
                <div>
                    <div className="header-title" style={{ width: '93%' }}>
                        Daftar Penerimaan
                    </div>
                </div>
            )}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="57%"
            height="490px"
            buttons={buttonDaftarPenerimaan}
            // position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarPenerimaan.current?.clearSelection();
                closeModal();
            }}
            closeOnEscape={true}
        >
            <GridComponent
                // key={gridKey}
                id="gridDaftarPenerimaan"
                locale="id"
                ref={gridDaftarPenerimaan}
                dataSource={recordsDataRef.current}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'357'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarPenerimaan.current) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarPenerimaan.current?.selectRow(rowIndex);
                        currentDaftarPenerimaan = gridDaftarPenerimaan.current?.getSelectedRecords() || [];
                        handleClickDaftarPenerimaan(currentDaftarPenerimaan);
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            plagViewModalDaftarPenerimaan: false,
                        }));
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="dokumen" headerText="Tipe Dok." headerTextAlign="Center" textAlign="Center" width="8" />
                    <ColumnDirective field="no_dokumen" headerText="No. Dokumen" headerTextAlign="Center" textAlign="Center" width="15" />
                    <ColumnDirective field="tgl_dokumen" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="13" />
                    <ColumnDirective field="jumlah_rp" headerText="Jumlah Rp." headerTextAlign="Center" textAlign="Right" width="15" format="N2" />
                    <ColumnDirective field="keterangan" headerText="Keterangan" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarPenerimaan;
