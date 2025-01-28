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

let dgKaryawan: Grid | any;

const FrmDlgKaryawan = ({ stateDokumen, kode_entitas, isOpen, onClose, onBatal, selectedData, target, kodeAkun, vRefreshData }: FrmDlgAkunJurnalProps) => {
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

    const [modalListKaryawan, setModalListKaryawan] = useState(false);
    const [searchNamaKaryawan, setSearchNamaKaryawan] = useState('');
    const [filteredDataNamaKaryawan, setFilteredDataNamaKaryawan] = useState('');
    const [listKaryawan, setListKaryawan] = useState([]);
    const [selectedKaryawan, setSelectedKaryawan] = useState<any>('');

    const PencarianNamaKaryawan = async (event: string, setSearchNamaKaryawan: Function, setFilteredDataNamaKaryawan: Function, listKaryawan: any[]) => {
        const searchValue = event;
        setSearchNamaKaryawan(searchValue);
        const filteredData = SearchDataNamaKaryawan(searchValue, listKaryawan);
        setFilteredDataNamaKaryawan(filteredData);
    };

    const SearchDataNamaKaryawan = (keyword: any, listKaryawan: any[]) => {
        if (keyword === '') {
            return listKaryawan;
        } else {
            const filteredData = listKaryawan.filter((item) => item.nama_kry.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const refreshDaftarKaryawan = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_karyawan`, {
                params: {
                    entitas: stateDokumen.kode_entitas,
                },
                headers: {
                    Authorization: `Bearer ${stateDokumen.token}`,
                },
            });

            setListKaryawan(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         refreshDaftarKaryawan();
    //     }, 500);
    // }, [isOpen, searchNamaKaryawan]);
    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit = refreshDaftarKaryawan();
            dgKaryawan?.setProperties({ dataSource: resultDaftarAkunKredit });
            dgKaryawan?.refresh();
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [vRefreshData]);

    return (
        <div>
            <DialogComponent
                // ref={(d) => (dgKaryawan = d)}
                id="frmDlgKaryawan"
                name="frmDlgKaryawan"
                className="frmDlgKaryawan"
                target={`#${target}`}
                style={{ position: 'fixed' }}
                header={'Daftar Karyawan'}
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                allowDragging={true}
                showCloseIcon={true}
                width="500"
                height="400"
                position={{ X: 'center', Y: 'center' }}
                zIndex={998}
                close={() => {
                    setSearchNamaKaryawan('');
                    const cariNamaKaryawan = document.getElementById('cariNamaKaryawan') as HTMLInputElement;
                    if (cariNamaKaryawan) {
                        cariNamaKaryawan.value = '';
                    }
                    onClose();
                }}
                closeOnEscape={true}
            >
                <div className="flex">
                    <div className="form-input mb-1 mr-1" style={{ display: 'inline-block' }}>
                        <TextBoxComponent
                            id="cariNamaKaryawan"
                            className="searchtext"
                            placeholder="Cari Nama Karyawan"
                            showClearButton={true}
                            input={(args: ChangeEventArgsInput) => {
                                const value: any = args.value;
                                PencarianNamaKaryawan(value, setSearchNamaKaryawan, setFilteredDataNamaKaryawan, listKaryawan);
                            }}
                            floatLabelType="Never"
                        />
                    </div>
                </div>
                <GridComponent
                    id="dgKaryawan"
                    locale="idIsKaryawan"
                    ref={(g: any) => (dgKaryawan = g)}
                    style={{ width: '100%', height: '75%' }}
                    dataSource={searchNamaKaryawan !== '' ? filteredDataNamaKaryawan : listKaryawan}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    gridLines={'Both'}
                    width={'100%'}
                    height={'220'}
                    rowSelecting={(args: any) => {
                        setSelectedKaryawan(args.data);
                        selectedData(args.data);
                    }}
                    recordDoubleClick={(args: any) => {
                        if (dgKaryawan) {
                            const rowIndex: number = args.row.rowIndex;
                            const selectedItems = args.rowData;
                            dgKaryawan.selectRow(rowIndex);
                            setSelectedKaryawan(selectedItems);
                            // selectedData(selectedItems);
                            // getFromModalAkunJurnal();
                            onClose();
                        }
                        // onClose();
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective allowEditing={false} field="kode_hrm" headerText="No." headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective allowEditing={false} field="nama_kry" headerText="Nama Karyawan" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective allowEditing={false} field="jabatan" headerText="Jabatan" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
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
                        if (selectedKaryawan) {
                            selectedData(selectedKaryawan);
                            onClose();
                        } else {
                            myAlertGlobal(`Silahkan pilih akun terlebih dulu.`, 'frmDlgKaryawan');
                        }
                    }}
                />
            </DialogComponent>
        </div>
    );
};

export default FrmDlgKaryawan;
