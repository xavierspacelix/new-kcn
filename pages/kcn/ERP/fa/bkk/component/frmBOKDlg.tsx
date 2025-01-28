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
    vRefreshData: any;
}

let dgBok: Grid | any;

const FrmBOKDlg = ({ stateDokumen, kode_entitas, isOpen, onClose, onBatal, selectedData, target, kodeAkun, vRefreshData }: FrmDlgAkunJurnalProps) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    // const vRefreshData = useRef(0);
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

    // const [modalListKaryawan, setModalListKaryawan] = useState(false);
    const [searchNoBok, setSearchNoBok] = useState('');
    const [filteredDataNoBok, setFilteredDataNoBok] = useState('');
    const [listBok, setListBok] = useState([]);
    const [selectedNoBok, setSelectedNoBok] = useState<any>('');

    const PencarianNoBok = async (event: string, setNoBok: Function, setFilteredDataNoBok: Function, listBok: any[]) => {
        const searchValue = event;
        setNoBok(searchValue);
        const filteredData = SearchDataNoBok(searchValue, listBok);
        setFilteredDataNoBok(filteredData);
    };

    const SearchDataNoBok = (keyword: any, listBok: any[]) => {
        if (keyword === '') {
            return listBok;
        } else {
            const filteredData = listBok.filter((item) => item.no_fk.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const refreshDaftarBOK = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_bok`, {
                params: {
                    entitas: stateDokumen.kode_entitas,
                },
                headers: {
                    Authorization: `Bearer ${stateDokumen.token}`,
                },
            });
            const modifiedListBok = response.data.data.map((item: any) => ({
                ...item,
                tgl_fk: moment(item.tgl_fk).format('DD-MM-YYYY'),
                jumlah_mu: parseFloat(item.jumlah_mu),
            }));

            setListBok(modifiedListBok);

            return modifiedListBok;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkun = await refreshDaftarBOK();
        };
        async();
    }, [isOpen, searchNoBok, vRefreshData]);

    return (
        <div>
            <DialogComponent
                // ref={(d) => (dgBok = d)}
                id="frmBOKDlg"
                name="frmBOKDlg"
                className="frmBOKDlg"
                target={`#${target}`}
                style={{ position: 'fixed' }}
                header={'Daftar BOK'}
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                allowDragging={true}
                showCloseIcon={true}
                width="500"
                height="400"
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    setSearchNoBok('');
                    const cariNoBok = document.getElementById('cariNoBok') as HTMLInputElement;
                    if (cariNoBok) {
                        cariNoBok.value = '';
                    }
                    onClose();
                }}
                closeOnEscape={true}
            >
                <div className="flex">
                    <div className="form-input mb-1 mr-1" style={{ display: 'inline-block' }}>
                        <TextBoxComponent
                            id="cariNoBok"
                            className="searchtext"
                            placeholder="Cari No Bok"
                            showClearButton={true}
                            input={(args: ChangeEventArgsInput) => {
                                const value: any = args.value;
                                PencarianNoBok(value, setSearchNoBok, setFilteredDataNoBok, listBok);
                            }}
                            floatLabelType="Never"
                        />
                    </div>
                </div>
                <GridComponent
                    id="dgBok"
                    locale="idIsKaryawan"
                    ref={(g: any) => (dgBok = g)}
                    gridLines={'Both'}
                    style={{ width: '100%', height: '75%' }}
                    dataSource={searchNoBok !== '' ? filteredDataNoBok : listBok}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    width={'100%'}
                    height={'220'}
                    rowSelecting={(args: any) => {
                        setSelectedNoBok(args.data);
                        // selectedData(args.data);
                    }}
                    recordDoubleClick={(args: any) => {
                        if (dgBok) {
                            const rowIndex: number = args.row.rowIndex;
                            const selectedItems = args.rowData;
                            dgBok.selectRow(rowIndex);
                            setSelectedNoBok(selectedItems);
                            selectedData(selectedItems);
                            // getFromModalAkunJurnal();
                            onClose();
                        }
                        // onClose();
                    }}
                    allowPaging={true}
                    allowSorting={true}
                    pageSettings={{
                        pageSize: 10,
                        pageCount: 10,
                        pageSizes: ['10', '50', '100', 'All'],
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective allowEditing={false} field="no_fk" headerText="No. Bukti" headerTextAlign="Center" textAlign="Center" width="75" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective allowEditing={false} field="tgl_fk" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="75" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective
                            allowEditing={false}
                            field="jumlah_mu"
                            headerText="Jumlah (MU)"
                            headerTextAlign="Center"
                            textAlign="Right"
                            width="75"
                            format="N2"
                            clipMode="EllipsisWithTooltip"
                        />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
                <ButtonComponent
                    id="buBatalDokumen1"
                    content="Batal"
                    cssClass="e-primary e-small"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    // onClick={() => setModalListKaryawan(false)}
                    onClick={() => onBatal()}
                />
                <ButtonComponent
                    id="buSimpanDokumen1"
                    content="Pilih"
                    cssClass="e-primary e-small"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    // onClick={() => handlePilihKaryawan()}
                    onClick={() => {
                        if (selectedNoBok) {
                            selectedData(selectedNoBok);
                            onClose();
                        } else {
                            myAlertGlobal(`Silahkan pilih akun terlebih dulu.`, 'frmBOKDlg');
                        }
                    }}
                />
            </DialogComponent>
        </div>
    );
};

export default FrmBOKDlg;
