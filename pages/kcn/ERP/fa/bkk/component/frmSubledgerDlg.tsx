import * as React from 'react';
import { useRouter } from 'next/router';
import styles from './mk.module.css';
import stylesTtb from '../mklist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { table } from '@syncfusion/ej2/grids';

import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from '@/public/syncfusion/locale.json';
import Swal from 'sweetalert2';
import { myAlertGlobal } from '@/utils/routines';
L10n.load(idIDLocalization);

interface FrmDlgAkunJurnalProps {
    stateDokumen: any;
    kode_entitas: any;
    isOpen: boolean;
    onClose: any;
    onBatal: any;
    selectedData: any;
    target: any;
    kodeAkun: any;
    jenis: any;
    vRefreshData: any;
}

let dgSubLedger: Grid | any;

// const FrmDlgAkunJurnal: React.FC<FrmMkProps> = ({}: FrmMkProps) => {
const FrmDlgSubLedger = ({ stateDokumen, kode_entitas, isOpen, onClose, onBatal, selectedData, target, kodeAkun, jenis, vRefreshData }: FrmDlgAkunJurnalProps) => {
    // console.log('vRefreshData', vRefreshData);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const swalToast = swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 3500,
        showClass: {
            popup: `
              animate__animated
              animate__zoomIn
              animate__faster
            `,
        },
        hideClass: {
            popup: `
              animate__animated
              animate__zoomOut
              animate__faster
            `,
        },
    });

    const myAlert = (text: any) => {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: `<p style="font-size:12px">${text}</p>`,
            width: '100%',
            target: '#frmSupplierDlg',
        });
    };

    const [modalDaftarSubledgerIsLedgerY, setModalDaftarSubledgerIsLedgerY] = useState(false);
    const [searchNoIsLedgerY, setSearchNoIsLedgerY] = useState('');
    const [searchNamaIsLedgerY, setSearchNamaIsLedgerY] = useState('');
    const [filteredDataIsLedgerY, setFilteredDataIsLedgerY] = useState('');
    const [listDaftarSubledgerIsLedgerY, setDaftarSubledgerIsLedgerY] = useState([]);
    const [selectedSubledgerIsLedgerY, setSelectedSubledgerIsLedgerY] = useState<any>('');

    const PencarianNoakunIsLedgerY = async (event: string, setSearchNoakunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoIsLedgerY(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNamaIsLedgerY = document.getElementById('cariNamaIsLedgerY') as HTMLInputElement;
        if (cariNamaIsLedgerY) {
            cariNamaIsLedgerY.value = '';
        }
    };

    const SearchDataNoIsLedgerY = (keyword: any, listDaftarSubledgerIsLedgerY: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerIsLedgerY;
        } else {
            const filteredData = listDaftarSubledgerIsLedgerY.filter((item) => item.no_subledger.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaakunIsLedgerY = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaisLedgerY(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNoIsLedgerY = document.getElementById('cariNoIsLedgerY') as HTMLInputElement;
        if (cariNoIsLedgerY) {
            cariNoIsLedgerY.value = '';
        }
    };

    const SearchDataNamaisLedgerY = (keyword: any, listDaftarSubledgerIsLedgerY: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerIsLedgerY;
        } else {
            const filteredData = listDaftarSubledgerIsLedgerY.filter((item) => item.nama_subledger.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const refreshDaftaSubledgerIsLedgerY = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_subledger_by_kodeakun`, {
                params: {
                    entitas: kode_entitas,
                    param1: kodeAkun,
                },
            });
            // console.log('kodeAkun', kodeAkun);
            const result = response.data;

            if (result.status) {
                setDaftarSubledgerIsLedgerY(result.data);
                return result.data;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         refreshDaftaSubledgerIsLedgerY();
    //     }, 500);
    // }, [isOpen, searchNamaIsLedgerY, searchNoIsLedgerY, kodeAkun]);
    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit = await refreshDaftaSubledgerIsLedgerY();
            // console.log('resultDaftarAkunKredit', resultDaftarAkunKredit);
            dgSubLedger?.setProperties({ dataSource: resultDaftarAkunKredit });
            dgSubLedger?.refresh();
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [vRefreshData]);

    return (
        <div>
            <DialogComponent
                // ref={(d) => (gridDaftarSubledgerIsLedgerY = d)}
                id="frmDlgSubLedger"
                name="frmDlgSubLedger"
                className="frmDlgSubLedger"
                // target={`#${target}`}
                target={'#FrmPraBkk'}
                style={{ position: 'fixed' }}
                header={'Daftar Subledger'}
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                allowDragging={true}
                showCloseIcon={true}
                width="500"
                height="400"
                position={{ X: 'center', Y: 'center' }}
                zIndex={90000}
                close={() => {
                    // setModalDaftarSubledgerIsLedgerY(false);
                    setSearchNoIsLedgerY('');
                    setSearchNamaIsLedgerY('');

                    const cariNoIsLedgerY = document.getElementById('cariNoIsLedgerY') as HTMLInputElement;
                    if (cariNoIsLedgerY) {
                        cariNoIsLedgerY.value = '';
                    }

                    const cariNamaIsLedgerY = document.getElementById('cariNamaIsLedgerY') as HTMLInputElement;
                    if (cariNamaIsLedgerY) {
                        cariNamaIsLedgerY.value = '';
                    }
                    onClose();
                }}
                closeOnEscape={true}
            >
                <div className="flex">
                    <div className="form-input mb-1 mr-1" style={{ width: '120px', display: 'inline-block' }}>
                        <TextBoxComponent
                            id="cariNoIsLedgerY"
                            className="searchtext"
                            placeholder="<Cari No. Subledger>"
                            showClearButton={true}
                            input={(args: ChangeEventArgsInput) => {
                                const value: any = args.value;
                                PencarianNoakunIsLedgerY(value, setSearchNoIsLedgerY, setFilteredDataIsLedgerY, listDaftarSubledgerIsLedgerY);
                            }}
                            floatLabelType="Never"
                        />
                    </div>
                    <div className="form-input mb-1 mr-1" style={{ width: '270px', display: 'inline-block' }}>
                        <TextBoxComponent
                            id="cariNamaIsLedgerY"
                            className="searchtext"
                            placeholder="Cari Keterangan"
                            showClearButton={true}
                            input={(args: ChangeEventArgsInput) => {
                                const value: any = args.value;
                                PencarianNamaakunIsLedgerY(value, setSearchNamaIsLedgerY, setFilteredDataIsLedgerY, listDaftarSubledgerIsLedgerY);
                            }}
                            floatLabelType="Never"
                        />
                    </div>
                </div>
                <GridComponent
                    id="dgSubLedger"
                    locale="idIsLedgerY"
                    style={{ width: '100%', height: '75%' }}
                    ref={(d: any) => (dgSubLedger = d)}
                    dataSource={searchNoIsLedgerY !== '' || searchNamaIsLedgerY !== '' ? filteredDataIsLedgerY : listDaftarSubledgerIsLedgerY}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    width={'100%'}
                    height={'220'}
                    gridLines={'Both'}
                    rowSelecting={(args: any) => {
                        setSelectedSubledgerIsLedgerY(args.data);
                        // selectedData(args.data);
                    }}
                    recordDoubleClick={(args: any) => {
                        if (dgSubLedger) {
                            const rowIndex: number = args.row.rowIndex;
                            const selectedItems = args.rowData;
                            dgSubLedger.selectRow(rowIndex);
                            setSelectedSubledgerIsLedgerY(selectedItems);
                            selectedData(selectedItems);

                            onClose();
                        }
                        // handlePilihSubledger_IsLedgerY();
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective allowEditing={false} field="no_subledger" headerText="No Subledger" headerTextAlign="Center" textAlign="Center" width="65" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective allowEditing={false} field="nama_subledger" headerText="keterangan" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
                <ButtonComponent
                    id="buBatalDokumen1"
                    content="Batal"
                    cssClass="e-primary e-small"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    // onClick={() => setModalDaftarSubledgerIsLedgerY(false)}
                    onClick={() => onBatal()}
                />
                <ButtonComponent
                    id="buSimpanDokumen1"
                    content="Pilih"
                    cssClass="e-primary e-small"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    // onClick={() => handlePilihSubledger_IsLedgerY()}
                    onClick={() => {
                        if (selectedSubledgerIsLedgerY) {
                            selectedData(selectedSubledgerIsLedgerY);
                            onClose();
                        } else {
                            myAlert(`Silahkan pilih akun terlebih dulu.`);
                        }
                    }}
                />
            </DialogComponent>
        </div>
    );
};

export default FrmDlgSubLedger;
