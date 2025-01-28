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
    kodeMu: any;
    vRefreshData: any;
}

let dgSupplierDlg: Grid | any;

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

const FrmSupplierDlg = ({ stateDokumen, kode_entitas, isOpen, onClose, onBatal, selectedData, target, kodeMu, vRefreshData }: FrmDlgAkunJurnalProps) => {
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

    const [modalDaftarSubledgerSupplier, setModalDaftarSubledgerSupplier] = useState(false);
    const [filteredDataSubledgerSupplier, setFilteredDataSubledgerSupplier] = useState('');
    const [searchNoSubledgerSupplier, setSearchNoSubledgerSupplier] = useState('');
    const [searchNamaSubledgerSupplier, setSearchNamaSubledgerSupplier] = useState('');
    const [selectedSubledgerSupplier, setSelectedSubledgerSupplier] = useState<any>('');
    const [listDaftarSubledgerSupplier, setDaftarSubledgerSupplier] = useState([]);

    const refreshDaftaSubledgerSupplier = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/suplier_dlg_bk`, {
                params: {
                    entitas: kode_entitas,
                    param1: kodeMu,
                },
                headers: {
                    Authorization: `Bearer ${stateDokumen[0].token}`,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarSubledgerSupplier(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const PencarianNoSubledgerSupplier = async (event: string, setSearchNoSubledgerSupplier: Function, setFilteredData: Function, listDaftarSubledgerSupplier: any[]) => {
        const searchValue = event;
        setSearchNoSubledgerSupplier(searchValue);
        const filteredData = SearchDataNoSubledgerSupplier(searchValue, listDaftarSubledgerSupplier);
        setFilteredData(filteredData);

        const cariNamaAkun = document.getElementById('cariNamaAkun') as HTMLInputElement;
        if (cariNamaAkun) {
            cariNamaAkun.value = '';
        }
    };
    const SearchDataNoSubledgerSupplier = (keyword: any, listDaftarSubledgerSupplier: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerSupplier;
        } else {
            const filteredData = listDaftarSubledgerSupplier.filter((item) => item.no_supp.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaSubledgerSupplier = async (event: string, setSearchNamaSubledgerSupplier: Function, setFilteredData: Function, listDaftarSubledgerSupplier: any[]) => {
        const searchValue = event;
        setSearchNamaSubledgerSupplier(searchValue);
        const filteredData = SearchDataNamaSubledgerSupplier(searchValue, listDaftarSubledgerSupplier);
        setFilteredData(filteredData);

        const cariNoAkun = document.getElementById('cariNoAkun') as HTMLInputElement;
        if (cariNoAkun) {
            cariNoAkun.value = '';
        }
    };
    const SearchDataNamaSubledgerSupplier = (keyword: any, listDaftarSubledgerSupplier: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerSupplier;
        } else {
            const filteredData = listDaftarSubledgerSupplier.filter((item) => item.nama_relasi.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         refreshDaftaSubledgerSupplier();
    //     }, 500);
    // }, [isOpen, searchNamaSubledgerSupplier, searchNoSubledgerSupplier, kodeMu]);
    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit = refreshDaftaSubledgerSupplier();
            dgSupplierDlg?.setProperties({ dataSource: resultDaftarAkunKredit });
            dgSupplierDlg?.refresh();
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [vRefreshData]);

    return (
        <DialogComponent
            // ref={(d) => (dgSupplierDlg = d)}
            id="frmSupplierDlg"
            name="frmSupplierDlg"
            className="frmSupplierDlg"
            target={`#${target}`}
            style={{ position: 'fixed' }}
            header={'Daftar Suplier'}
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
                // setModalDaftarSubledgerSupplier(false);
                setSearchNoSubledgerSupplier('');
                setSearchNamaSubledgerSupplier('');

                const cariNoSubledgerSupplier = document.getElementById('cariNoSubledgerSupplier') as HTMLInputElement;
                if (cariNoSubledgerSupplier) {
                    cariNoSubledgerSupplier.value = '';
                }

                const cariNamaSubledgerSupplier = document.getElementById('cariNamaSubledgerSupplier') as HTMLInputElement;
                if (cariNamaSubledgerSupplier) {
                    cariNamaSubledgerSupplier.value = '';
                }
                onClose();
            }}
            closeOnEscape={true}
        >
            <div className="flex">
                <div className="form-input mb-1 mr-1" style={{ width: '120px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="cariNoSubledgerSupplier"
                        className="searchtext"
                        placeholder="Cari No. Supplier"
                        showClearButton={true}
                        input={(args: ChangeEventArgsInput) => {
                            const value: any = args.value;
                            PencarianNoSubledgerSupplier(value, setSearchNoSubledgerSupplier, setFilteredDataSubledgerSupplier, listDaftarSubledgerSupplier);
                        }}
                        floatLabelType="Never"
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '270px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="cariNamaSubledgerSupplier"
                        className="searchtext"
                        placeholder="Cari Nama Supplier"
                        showClearButton={true}
                        input={(args: ChangeEventArgsInput) => {
                            const value: any = args.value;
                            PencarianNamaSubledgerSupplier(value, setSearchNamaSubledgerSupplier, setFilteredDataSubledgerSupplier, listDaftarSubledgerSupplier);
                        }}
                        floatLabelType="Never"
                    />
                </div>
            </div>
            <GridComponent
                id="dgSupplierDlg"
                locale="idIsSubledger"
                style={{ width: '100%', height: '75%' }}
                ref={(d: any) => (dgSupplierDlg = d)}
                dataSource={searchNoSubledgerSupplier !== '' || searchNamaSubledgerSupplier !== '' ? filteredDataSubledgerSupplier : listDaftarSubledgerSupplier}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'220'}
                gridLines={'Both'}
                rowSelecting={(args: any) => {
                    setSelectedSubledgerSupplier(args.data);
                    // selectedData(args.data);
                }}
                recordDoubleClick={(args: any) => {
                    if (dgSupplierDlg) {
                        const rowIndex: number = args.row.rowIndex;
                        const selectedItems = args.rowData;
                        dgSupplierDlg.selectRow(rowIndex);
                        setSelectedSubledgerSupplier(selectedItems);
                        selectedData(selectedItems);
                        // getFromModalAkunJurnal();
                        onClose();
                    }

                    // handlePilihSubledgerSupplier();
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective allowEditing={false} field="no_supp" headerText="No Supplier" headerTextAlign="Center" textAlign="Left" width="65" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective allowEditing={false} field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" width="35" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective allowEditing={false} field="nama_relasi" headerText="keterangan" headerTextAlign="Left" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                // onClick={() => setModalDaftarSubledgerSupplier(false)}
                onClick={() => onBatal()}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                // onClick={() => handlePilihSubledgerSupplier()}
                onClick={() => {
                    if (selectedSubledgerSupplier) {
                        selectedData(selectedSubledgerSupplier);
                        onClose();
                    } else {
                        myAlert(`Silahkan pilih akun terlebih dulu.`);
                    }
                }}
            />
        </DialogComponent>
    );
};

export default FrmSupplierDlg;
