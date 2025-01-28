/* eslint-disable react-hooks/rules-of-hooks */
import { useSession } from '@/pages/api/sessionContext';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useRef, useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import Draggable from 'react-draggable';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel /*Tab, TabComponent*/ } from '@syncfusion/ej2-react-navigations';
import { Dialog, DialogComponent, Tooltip, TooltipComponent, TooltipEventArgs, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import {
    Grid,
    GridComponent,
    ColumnDirective,
    ColumnsDirective,
    Inject,
    Page,
    Edit,
    Sort,
    Filter,
    Group,
    Resize,
    Reorder,
    Selection,
    ExcelExport,
    PdfExport,
    Toolbar,
    CommandColumn,
} from '@syncfusion/ej2-react-grids';
import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';

import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);

import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './prabkklist.module.css';
import { BkListApi, DataDetailDok, GetPeriode } from '../bkk/model/api';
import { SetDataDokumen, EksekusiPencarian, refreshDataList, ListDetailDok, rowSelectingListData, HandleRowSelected } from './component/fungsi';
import { log } from 'console';
import FrmDlgAkunJurnal from './component/frmDlgAkunJurnal';
import FrmPraBkk from './component/frmPraBkk';
import Link from 'next/link';
import { sortBy } from 'lodash';
import { Tab } from '@headlessui/react';
import { classNames } from 'primereact/utils';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Aggregate } from '@syncfusion/ej2/grids';
// import classNames from 'classnames';

//======= Setting hak akses user ... ========
let disabledBaru = false;
let disabledEdit = false;
let disabledHapus = false;
let disabledCetak = false;
let sidebarObj: SidebarComponent;
let type: SidebarType = 'Push';
let mediaQueryState: string = '(min-width: 600px)';
let cMenuCetak: ContextMenuComponent;
let selectedListData: any[] = [];
let tooltipListData: Tooltip | any;

// let gridListDataBaru: Grid | any;
let gridListDataApproved: Grid | any;
let gridListData: Grid | any;
let gridListDataDetailDok: Grid | any;
// let tabList: Tab | any;
let jenisIdTab: any;

let menuHeaderItems: MenuItemModel[] = [
    {
        iconCss: 'e-icons e-print',
        text: 'Cetak ke printer',
    },
    {
        iconCss: 'e-icons',
        text: 'Export ke file',
        items: [
            { iconCss: 'e-icons e-export-pdf', text: 'PDF' },
            { iconCss: 'e-icons e-export-excel', text: 'XLSX' },
            { iconCss: 'e-icons e-export-csv', text: 'CSV' },
        ],
    },
];
type BkkListField = {
    kode_dokumen: any;
    dokumen: any;
    no_dokumen: any;
    tgl_dokumen: any;
    no_warkat: any;
    tgl_valuta: any;
    kode_cust: any;
    kode_akun_debet: any;
    kode_supp: any;
    kode_akun_kredit: any;
    kode_akun_diskon: any;
    kurs: any;
    debet_rp: any;
    kredit_rp: any;
    jumlah_rp: any;
    jumlah_mu: any;
    pajak: any;
    kosong: any;
    kepada: any;
    catatan: any;
    status: any;
    userid: any;
    tgl_update: any;
    status_approved: any;
    tgl_approved: any;
    tgl_pengakuan: any;
    no_TTP: any;
    tgl_TTP: any;
    kode_sales: any;
    kode_fk: any;
    approval: any;
    tgl_setorgiro: any;
    faktur: any;
    barcode: any;
    komplit: any;
    validasi1: any;
    validasi2: any;
    validasi3: any;
    validasi_ho2: any;
    validasi_ho3: any;
    validasi_catatan: any;
    tolak_catatan: any;
    kode_kry: any;
    tgl_trxdokumen: any;
    api_id: any;
    api_pending: any;
    api_catatan: any;
    api_norek: any;
    kode_aktiva: any;
    kode_rpe: any;
    kode_phe: any;
    kode_rps: any;
    kode_um: any;
    no_kontrak_um: any;
    no_akun_kredit: any;
    nama_akun_kredit: any;
    ket_kredit: any;
    kode_mu: any;
    status_warkat: any;
    no_fk: any;
    gambar1: any;
    gambar2: any;
};

const FrmPraBkkList = () => {
    const router = useRouter();
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }
    // const rowIdxListData = useRef(0);

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '' });
    const kode_menu = '40600';
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const [jenisTab, setJenisTab] = useState('Baru');

    const [masterDataState, setMasterDataState] = useState<string>('');
    const [masterKodeDokumen, setMasterKodeDokumen] = useState<string>('BARU');
    const [jenisUpdateBKK, setJenisUpdateBKK] = useState(0);
    const [CON_BKK, setCON_BKK] = useState<string>('BKK');
    const [jenisDialog, setJenisDialog] = useState('header0');

    const [showFrmDlgAkunJurnal, setShowFrmDlgAkunJurnal] = useState(false);
    const [dialogInputDataVisible, setDialogInputDataVisible] = useState(false);

    const [recordsDataDetailList, setRecordsDataDetailList] = useState<BkkListField[]>([]);

    const [showLoader, setShowLoader] = useState(true);
    const [modalPosition, setModalPosition] = useState({ top: '3%', right: '2%', width: '40%', background: '#dedede' });
    const [windowHeight, setWindowHeight] = useState(0);
    const [searchNamaCust, setSearchNamaCust] = useState('');

    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const [detailDok, setDetailDok] = useState<any[]>([]);
    const [detailListPraBkk, setDetailListPraBkk] = useState({ no_dokumen: '', tgl_dokumen: '' });
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedRowKodeDok, setSelectedRowKodeDok] = useState('');

    const stateDokumen = {
        kode_entitas: kode_entitas,
        kode_user: kode_user,
        userid: userid,
        jenisUpdateBKK: jenisUpdateBKK,
        CON_BKK: CON_BKK,
        masterKodeDokumen: masterKodeDokumen,
        masterDataState: masterDataState,
        jenisTab: jenisTab,
        token: token,
    };
    const vRefreshDataAkun = useRef(0);
    let openFrom: string = '';

    const [stateDialog, setStateDialog] = useState('header');
    const [isFilePendukungBk, setIsFilePendukungBk] = useState('N');

    const [formDataState, setFormDataState] = useState({
        chbKode: false,
        edKode: 'all',
        chbTanggal: true,
        edTglAwal: moment().format('YYYY-MM-DD'),
        edTglAkhir: moment().endOf('month'),
        chbTanggalBuat: false,
        edTglAwalBuat: moment().format('YYYY-MM-DD'),
        edTglAkhirBuat: moment().endOf('month'),
        chbAkun: false,
        edKodeAkun: '',
        edNoAkun: 'all',
        edNamaAkun: 'all',
        chbKet: false,
        edKet: 'all',
        chbNoBOK: false,
        edNoBOK: 'all',
        chbNoCek: false,
        edNoCek: 'all',
        chbStatusWarkat: false,
        cbStatusWarkat: 'all',
        chbNota: false,
        chbBukti: false,
    });

    const paramList = {
        entitas: kode_entitas,
        param1: formDataState.chbTanggal ? formDataState.edTglAwal : 'all',
        param2: formDataState.chbTanggal ? moment(formDataState.edTglAkhir).format('YYYY-MM-DD') : 'all', // tglAkhir.format('YYYY-MM-DD') : 'all',
        param3: formDataState.chbKet ? formDataState.edKet : 'all',
        param4: formDataState.chbKode ? formDataState.edKode : 'all',
        param5: formDataState.chbNoCek ? formDataState.edNoCek : 'all',
        param6: formDataState.chbTanggalBuat ? formDataState.edTglAwalBuat : 'all',
        param7: formDataState.chbTanggalBuat ? moment(formDataState.edTglAkhirBuat).format('YYYY-MM-DD') : 'all',
        param8: formDataState.chbAkun ? formDataState.edNoAkun : 'all',
        param9: formDataState.chbNota ? 'Y' : 'N',
        param10: formDataState.chbBukti ? 'Y' : 'N',
        param11: formDataState.chbStatusWarkat ? formDataState.cbStatusWarkat : 'all',
        param12: formDataState.chbNoBOK ? formDataState.edNoBOK : 'all',
        param13: jenisTab === 'Baru' ? 'baru' : jenisTab === 'Approved' ? 'approved' : 'all',
    };

    const onKlikTabList = async () => {
        // await refreshDataList(paramList, setRecordsDataDetailList, jenisTab === 'baru' ? gridListDataBaru : gridListDataApproved, token);
        await refreshDataList(paramList, setRecordsDataDetailList, gridListData, token);
    };

    const handleSelectedDataJurnal = (dataObject: any) => {
        setFormDataState({
            ...formDataState,
            edNoAkun: dataObject.no_akun,
            edNamaAkun: dataObject.nama_akun,
            edKodeAkun: dataObject.kode_akun,
            chbAkun: true,
        });
    };

    const handleOnCloseDlgAkun = () => {
        setShowFrmDlgAkunJurnal(false);
    };

    const handleOnBatalDlgAkun = () => {
        setShowFrmDlgAkunJurnal(false);
        setFormDataState({
            ...formDataState,
            edNoAkun: '',
            edNamaAkun: '',
            edKodeAkun: '',
            chbAkun: false,
        });
    };

    const handleInputAkun = async (inputTipe: any) => {
        if (inputTipe === 'deleteContentBackward') {
            setFormDataState({
                ...formDataState,
                edNamaAkun: '',
                edKodeAkun: '',
                chbAkun: false,
            });
        } else {
            setShowFrmDlgAkunJurnal(true);
        }
    };

    const ExportComplete = (): void => {
        gridListData.hideSpinner();
    };
    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            if (getValue('status', args.data) == 'Tertutup') {
                args.row.style.background = '#f5f4f4';
            } else if (getValue('status', args.data) == 'Proses') {
                args.row.style.background = '#fbffc8';
            } else {
                args.row.style.background = '#ffffff';
            }
        }
    };

    const queryCellInfoListData = (args: any) => {
        if (args.column?.field === 'status') {
            if (getValue('status', args.data) == 'Tertutup') {
                args.cell.style.color = 'red';
            } else if (getValue('status', args.data) == 'Proses') {
                args.cell.style.color = 'maroon';
            }
        }
        if (args.column?.field === 'status_app') {
            if (getValue('status_app', args.data) == 'Disetujui') {
                args.cell.style.color = 'green';
            } else if (getValue('status_app', args.data) == 'Koreksi') {
                args.cell.style.color = 'maroon';
            } else if (getValue('status_app', args.data) == 'Ditolak') {
                args.cell.style.color = 'red';
            } else {
                args.cell.style.color = 'blue';
            }
        }
    };

    const columnListData: Object = {
        'No. Bukti': 'Nomor dokumen pengeluaran lain',
        Tanggal: 'Tanggal dokumen pengeluaran lain',
        'Tgl. Dibuat': 'Tanggal dibuat dokumen',
        'Dibayar dari Akun Kredit': 'Nama akun kredit',
        MU: 'Mata Uang',
        Jumlah: 'Jumlah pengeluaran',
        Keterangan: 'NKeterangan',
        'No. Warkat': 'No. Warkat',
        'Tgl. Valuta': 'Tanggal Valuta',
        'Status Warkat': 'Status Warkat',
        'No. Bukti BOK': 'No. Bukti BOK',
    };
    // const beforeRenderListData = (args: TooltipEventArgs) => {
    //     const description = (columnListData as any)[(args as any).target.innerText];
    //     if (description) {
    //         tooltipListData.content = description;
    //     }
    // };

    if (isLoading) {
        return;
    }

    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
    }

    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    function menuHeaderSelect(args: MenuEventArgs) {
        if (args.item.text === 'Cetak ke printer') {
            gridListData.print();
        } else if (args.item.text === 'PDF') {
            gridListData.showSpinner();
            gridListData.pdfExport();
        } else if (args.item.text === 'XLSX') {
            gridListData.showSpinner();
            gridListData.excelExport();
        } else if (args.item.text === 'CSV') {
            gridListData.showSpinner();
            gridListData.csvExport();
        }
    }

    function bypassBlokBrowserWindow() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(true);
            }, 1000);
        });
    }

    const closeModal = () => {
        setSelectedItem(null);
    };

    const contentLoader = () => {
        return (
            <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#ffffff00] dark:bg-[#060818]">
                <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
        );
    };

    //======= Setting tampilan sweet alert  =========
    // const swalDialog = swal.mixin({
    //     customClass: {
    //         confirmButton: 'btn btn-primary btn-sm',
    //         cancelButton: 'btn btn-dark btn-sm ltr:mr-3 rtl:ml-3',
    //         popup: 'sweet-alerts',
    //     },
    //     buttonsStyling: false,
    //     showClass: {
    //         popup: `
    //           animate__animated
    //           animate__zoomIn
    //           animate__faster
    //         `,
    //     },
    //     hideClass: {
    //         popup: `
    //           animate__animated
    //           animate__zoomOut
    //           animate__faster
    //         `,
    //     },
    // });

    const swalToast = swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2000,
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

    const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonAppoval = { width: 150 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const formatFloat: Object = { skeleton: 'C3', format: ',0.####;-,0.#####;#', maximumFractionDigits: 4 };

    // const onCreate = () => {
    //     sidebarObj.element.style.visibility = '';
    // };
    // const toggleClick = () => {
    //     setSidebarVisible(true);
    // };
    // const closeClick = () => {
    //     setSidebarVisible(false);
    // };

    const showNewRecord = async () => {
        setMasterDataState('BARU');
        setMasterKodeDokumen('BARU');
        setJenisUpdateBKK(0);
        setCON_BKK('BKK');
        setDialogInputDataVisible(true);
        setIsFilePendukungBk('N');
    };

    let selectDataGrid: any[] = [];
    const showEditRecord = async (jenisEdit: any) => {
        // console.log(jenisEdit);
        selectDataGrid = gridListData.getSelectedRecords();
        // console.log('selectedRowKodeDok', selectDataGrid[0]?.kode_dokumen);

        // if (selectedRowKodeDok === '') {
        if (selectDataGrid[0]?.kode_dokumen === '' || selectDataGrid[0]?.kode_dokumen === undefined) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        } else {
            // console.log('jenisEdit ', jenisEdit);
            if (jenisEdit === 'Edit Biasa') {
                // console.log('edit biasa');
                // selectDataGrid = gridListData.getSelectedRecords();
                setMasterDataState('EDIT');
                setCON_BKK('BKK');
                setMasterKodeDokumen(selectDataGrid[0]?.kode_dokumen);
                setDialogInputDataVisible(true);
                setIsFilePendukungBk('N');
            } else if (jenisEdit === 'Edit Approved') {
                // console.log('edit approved');
                if (jenisTab === 'Approved') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px; color:white;">Data sudah di approved</p>',
                        width: '100%',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                } else {
                    // selectDataGrid = gridListData.getSelectedRecords();
                    setMasterDataState('EDIT');
                    setCON_BKK('APPROVE_ORI');
                    setJenisUpdateBKK(0);
                    setMasterKodeDokumen(selectDataGrid[0]?.kode_dokumen);
                    setDialogInputDataVisible(true);
                    setIsFilePendukungBk('N');
                }
            } else if (jenisEdit === 'Edit File Pendukung') {
                // console.log('edit file pendukung');
                if (jenisTab === 'Baru') {
                    // selectDataGrid = gridListData.getSelectedRecords();
                    setMasterDataState('EDIT');
                    setCON_BKK('PREVIEW_IMAGE');
                    setJenisUpdateBKK(1);
                    setMasterKodeDokumen(selectDataGrid[0]?.kode_dokumen);
                    setDialogInputDataVisible(true);
                    setIsFilePendukungBk('Y');
                } else {
                    // selectDataGrid = gridListData.getSelectedRecords();
                    setMasterDataState('EDIT');
                    setCON_BKK('PREVIEW_IMAGE_ORI');
                    setJenisUpdateBKK(1);
                    setMasterKodeDokumen(selectDataGrid[0]?.kode_dokumen);
                    setDialogInputDataVisible(true);
                    setIsFilePendukungBk('Y');
                }
            }
        }
    };

    // const refreshListData = async () => {
    //     const responseData = await BkListApi(paramList, token);
    // };

    const handleCheckboxChange = (name: any, value: any) => {
        setFormDataState((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleInputChange = (name: any, value: any, cekBoxname: any) => {
        setFormDataState((prevFormData: any) => ({
            ...prevFormData,
            [name]: value,
            [cekBoxname]: value !== '',
            // [`checked_${name}`]: value !== '',
        }));
    };

    const handleSearch = (value: any) => {
        if (gridListData) {
            gridListData.search(value);
        }
    };

    // const created = () => {
    //     (document.getElementById((gridListData as GridComponent).element.id + '_searchbar') as HTMLElement).addEventListener('keyup', (event) => {
    //         (gridListData as GridComponent).search((event.target as HTMLInputElement).value);
    //     });
    // };

    const tabKategoriArray = [
        {
            kategori: 'Baru',
        },
        {
            kategori: 'Approved',
        },
    ];

    const [panelVisible, setPanelVisible] = useState(true);
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const handleTogglePanel = () => {
        setPanelVisible(!panelVisible);
    };
    const handleFilterClick = () => {
        setPanelVisible(true);
    };

    // const Box = () => {
    //     return (
    //         <div>
    //             <p>Hello world</p>
    //         </div>
    //     );
    // };

    let resultAkunJabatan: any;
    let resultAkun: any;
    const [listAkunJurnal, setListAkunJurnal] = useState([]);
    const refreshDaftarAkun = async () => {
        try {
            let paramHeader: any;
            let paramDetail: any;
            paramHeader = `where x.kode_user="${stateDokumen?.kode_user}"`;
            // paramDetail = `where x.kode_user="${stateDokumen?.kode_user}" and x.kode_akun ="${kodeAkun}"`;
            const responseAkunJabatan = await axios.get(`${apiUrl}/erp/list_akun_global`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: 'SQLAkunMBkkJabatan',
                    param2: paramHeader,
                },
                headers: { Authorization: `Bearer ${stateDokumen?.token}` },
            });
            resultAkunJabatan = responseAkunJabatan.data;
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
        try {
            const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: 'SQLAkunKas',
                },
                headers: { Authorization: `Bearer ${stateDokumen?.token}` },
            });
            resultAkun = response.data;
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }

        if (resultAkunJabatan?.length < 0) {
            setListAkunJurnal(resultAkunJabatan?.data);
            return resultAkunJabatan.data;
            // setShowDialogAkun(true);
        } else {
            setListAkunJurnal(resultAkun?.data);
            return resultAkun.data;
        }
    };

    const handleDialogAkun = async () => {
        // const refreshDaftarAkun = async () =>
        vRefreshDataAkun.current += 1;
        if (listAkunJurnal.length < 0) {
            setShowFrmDlgAkunJurnal(true);
        } else {
            setShowFrmDlgAkunJurnal(true);
        }
        // };
    };

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [stateDokumen?.kode_entitas]);

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkun = await refreshDaftarAkun();
            // console.log('resultDaftarAkun', resultDaftarAkun);
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [vRefreshDataAkun]);

    useEffect(() => {
        onKlikTabList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDokumen?.jenisTab]);

    const handleRefreshData = async () => {
        try {
            await refreshDataList(paramList, setRecordsDataDetailList, gridListData, token);
        } catch (error) {
            console.error(error);
        }
    };

    let cMenuCetak: ContextMenuComponent;

    function btnPrintClick(e: any): void {
        var clientRect = (e.target as Element).getBoundingClientRect();
        cMenuCetak.open(clientRect.bottom, clientRect.left);
    }

    let menuCetakItems: MenuItemModel[] = [
        {
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Pengeluaran Lain',
            items: [
                {
                    iconCss: 'e-icons e-thumbnail',
                    text: 'Form Kecil',
                },
                {
                    iconCss: 'e-icons e-thumbnail',
                    text: 'Form Besar',
                },
            ],
        },
        {
            iconCss: 'e-icons e-thumbnail',
            text: 'Daftar Pengeluaran Lain',
        },
    ];

    const OnClick_CetakForm = (selectedRowKode: any, tag: any, namaMenuCetak: any) => {
        // console.log(jenisTab);

        if (selectedRowKode === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Silahkan pilih data BKK terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        if (jenisTab === 'Approved') {
            // if (tag === '1') {
            if (namaMenuCetak === 'Form Kecil') {
                let iframe = `
            <html><head>
            <title>Form Pengeluaran Lain | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/rpDBkkKecil?entitas=${stateDokumen?.kode_entitas}&param1=${selectedRowKode}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

                let win = window.open(
                    '',
                    '_blank',
                    `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
                );

                if (win) {
                    setShowLoader(true);
                    setTimeout(() => {
                        let link = win!.document.createElement('link');
                        link.type = 'image/png';
                        link.rel = 'shortcut icon';
                        link.href = '/favicon.png';
                        win!.document.getElementsByTagName('head')[0].appendChild(link);
                        win!.document.write(iframe);
                        setShowLoader(false);
                    }, 300);
                } else {
                    console.error('Window failed to open.');
                }
                // } else if (tag === '2') {
            } else if (namaMenuCetak === 'Form Besar') {
                // const vParamsList1 = {
                //     param1: isTanggalChecked ? tglAwal.format('YYYY-MM-DD') : 'all',
                // };
                // const vParamsList2 = {
                //     param2: isTanggalChecked ? tglAkhir.format('YYYY-MM-DD') : 'all',
                // };

                let iframe = `
            <html><head>
            <title>Daftar Memo Kredit | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
              <iframe src="./report/rpDBkkBesar?entitas=${stateDokumen?.kode_entitas}&param1=${selectedRowKode}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

                let win = window.open(
                    '',
                    '_blank',
                    `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
                );

                if (win) {
                    let link = win!.document.createElement('link');
                    link.type = 'image/png';
                    link.rel = 'shortcut icon';
                    link.href = '/favicon.png';
                    win!.document.getElementsByTagName('head')[0].appendChild(link);
                    win!.document.write(iframe);
                } else {
                    console.error('Window failed to open.');
                }
                // } else if (tag === '3') {
                // } else if (namaMenuCetak === 'Form Kecil') {
            } else if (namaMenuCetak === 'Daftar Pengeluaran Lain') {
                const vParamsList1 = {
                    param1: formDataState.chbTanggal ? moment(formDataState.edTglAwal).format('YYYY-MM-DD') : 'all',
                };
                const vParamsList2 = {
                    param2: formDataState.chbTanggal ? moment(formDataState.edTglAkhir).format('YYYY-MM-DD') : 'all',
                };
                const vParamsList3 = {
                    token: token,
                };

                let iframe = `
            <html><head>
            <title>Daftar Memo Kredit | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
              <iframe src="./report/rpDaftarBkk?entitas=${stateDokumen?.kode_entitas}&param1=${vParamsList1.param1}&param2=${vParamsList2.param2}&token=${vParamsList3.token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

                let win = window.open(
                    '',
                    '_blank',
                    `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
                );

                if (win) {
                    let link = win.document.createElement('link');
                    link.type = 'image/png';
                    link.rel = 'shortcut icon';
                    link.href = '/favicon.png';
                    win.document.getElementsByTagName('head')[0].appendChild(link);
                    win.document.write(iframe);
                } else {
                    console.error('Window failed to open.');
                }
            }
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Data yang belum di approve tidak dapat di print.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        }
    };

    function menuCetakSelect(args: MenuEventArgs) {
        // console.log('cetak ', args.item.id);
        OnClick_CetakForm(selectedRowKodeDok, args.item.id, args.item.text);
        // SetDataDokumenMk('cetak', selectedRowKodeMk, kode_entitas, dataDetailDokMk, router, setSelectedItem, setDetailDok);
    }

    const onCreate = () => {
        sidebarObj.element.style.visibility = '';
    };
    const toggleClick = () => {
        setSidebarVisible(true);
    };
    const closeClick = () => {
        setSidebarVisible(false);
    };

    return (
        <>
            <div className="Main" id="main-target">
                <div>
                    {/* {showLoader && contentLoader()} */}
                    {/* HEADER MENU BARU */}
                    <div className="flex w-full flex-grow">
                        <div className="w-full">
                            <div className="mb-4 items-center justify-between rounded-md border-b bg-white p-4 pb-2  shadow-md md:flex">
                                <div className="grid w-full grid-cols-12 border-b">
                                    <div className="mt-1p-4 col-span-3 mb-2 items-center justify-between  pb-2 md:flex">
                                        {/* HEADER FORM (BARU UBAH HAPUS CETAK) */}

                                        <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
                                            <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} target="#btnRefresh">
                                                <TooltipComponent content="Membuat memo kredit baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                                                    <TooltipComponent content="Edit data memo kredit" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                                        <TooltipComponent content="Hapus data memo kredit" opensOn="Hover" openDelay={1000} target="#btnHapus">
                                                            <TooltipComponent content="Cetak data memo kredit" opensOn="Hover" openDelay={1000} target="#btnCetak">
                                                                <TooltipComponent content="Tampilkan detail memo kredit" opensOn="Hover" openDelay={1000} target="#btnDetail">
                                                                    {/* <TooltipComponent content="Persetujuan dokumen" opensOn="Hover" openDelay={1000} target="#btnApproval"> */}
                                                                    <div className="flex space-x-2">
                                                                        <div className="relative">
                                                                            <ButtonComponent
                                                                                id="btnBaru"
                                                                                cssClass="e-primary e-small"
                                                                                style={styleButton}
                                                                                disabled={disabledBaru}
                                                                                // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                                                onClick={showNewRecord}
                                                                                content="Baru"
                                                                            ></ButtonComponent>

                                                                            <ButtonComponent
                                                                                id="btnEdit"
                                                                                cssClass="e-primary e-small"
                                                                                style={styleButton}
                                                                                disabled={disabledEdit}
                                                                                onClick={() => {
                                                                                    showEditRecord('Edit Biasa');
                                                                                }}
                                                                                content="Ubah"
                                                                            ></ButtonComponent>
                                                                            <ButtonComponent
                                                                                content="Filter"
                                                                                id="btnFilter"
                                                                                type="submit"
                                                                                cssClass="e-primary e-small"
                                                                                style={
                                                                                    panelVisible
                                                                                        ? {
                                                                                              width: '57px',
                                                                                              height: '28px',
                                                                                              marginBottom: '0.5em',
                                                                                              marginTop: '0.5em',
                                                                                              marginRight: '0.8em',
                                                                                          }
                                                                                        : { ...styleButton, color: 'white' }
                                                                                }
                                                                                onClick={handleFilterClick}
                                                                                disabled={panelVisible}
                                                                            ></ButtonComponent>

                                                                            {/* <ButtonComponent
                                                                id="btnHapus"
                                                                cssClass="e-primary e-small"
                                                                style={styleButton}
                                                                disabled={disabledHapus}
                                                                // onCslick={showDeleteRecord}
                                                                content="Hapus"
                                                            ></ButtonComponent> */}

                                                                            <ContextMenuComponent
                                                                                id="cMenuCetak"
                                                                                ref={(scope) => (cMenuCetak = scope as any)}
                                                                                items={menuCetakItems}
                                                                                select={menuCetakSelect}
                                                                                animationSettings={{ duration: 800, effect: 'FadeIn' }}
                                                                            />

                                                                            <ButtonComponent
                                                                                id="btnCetak"
                                                                                cssClass="e-primary e-small"
                                                                                style={{ ...styleButton, width: 75 + 'px' }}
                                                                                disabled={disabledCetak}
                                                                                onClick={btnPrintClick}
                                                                                content="Cetak"
                                                                                iconCss="e-icons e-medium e-chevron-down"
                                                                                iconPosition="Right"
                                                                            ></ButtonComponent>
                                                                        </div>
                                                                    </div>

                                                                    {/* </TooltipComponent> */}
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </TooltipComponent>
                                    </div>
                                    <div className="mt-1p-4 col-span-7 mb-2 items-center justify-between  pb-2 md:flex">
                                        <div className="flex space-x-2">
                                            <div className="relative">
                                                <ButtonComponent
                                                    id="btnApproval"
                                                    cssClass="e-primary e-small"
                                                    style={styleButtonAppoval}
                                                    disabled={disabledBaru}
                                                    // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                    onClick={() => {
                                                        showEditRecord('Edit Approved');
                                                    }}
                                                    content="Approval"
                                                ></ButtonComponent>
                                                <ButtonComponent
                                                    id="btnUpdateFilePendukung"
                                                    cssClass="e-primary e-small"
                                                    style={styleButtonAppoval}
                                                    disabled={disabledBaru}
                                                    // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                    onClick={() => {
                                                        showEditRecord('Edit File Pendukung');
                                                    }}
                                                    content="Update File Pendukung"
                                                ></ButtonComponent>
                                                <ButtonComponent
                                                    id="btnDetail"
                                                    cssClass="e-primary e-small"
                                                    style={styleButtonAppoval}
                                                    disabled={false}
                                                    // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                    onClick={() => {
                                                        SetDataDokumen(
                                                            'detailDok',
                                                            selectedRowKodeDok, //stateDokumen?.masterKodeDokumen,
                                                            stateDokumen?.kode_entitas,
                                                            detailListPraBkk,
                                                            router,
                                                            setSelectedItem,
                                                            setDetailDok,
                                                            stateDokumen?.token,
                                                            jenisTab
                                                        );
                                                        setIsFilePendukungBk('Y');
                                                    }}
                                                    content="Detail Dokumen"
                                                ></ButtonComponent>
                                            </div>
                                        </div>
                                    </div>
                                    {/* END HEADER Form (BARU UBAH HAPUS CETAK*/}
                                    <div className="mt-1p-4 col-span-2 mb-2 items-center justify-between  pb-2 md:flex">
                                        <div className="text-right text-xl font-semibold">Pengeluaran Lain (BK)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="main-content" style={{ position: 'sticky', overflow: 'hidden' }} className="flex !gap-6">
                    <SidebarComponent
                        id="default-sidebar"
                        target={'#main-content'}
                        ref={(Sidebar) => (sidebarObj = Sidebar as SidebarComponent)}
                        // style={{ background: 'transparent', visibility: 'hidden', marginRight: '0.8em' }}
                        style={{
                            background: '#dedede',
                            marginRight: '2rem',
                            display: 'block',
                            visibility: sidebarVisible ? 'visible' : 'hidden',
                            // maxHeight: `100px`,
                            overflowY: 'auto',
                            // borderRight:'2px',
                        }}
                        created={onCreate}
                        //showBackdrop={showBackdrop}
                        type={type}
                        // width="315px"
                        width="315px"
                        height={200}
                        mediaQuery={mediaQueryState}
                        isOpen={true}
                        open={() => setSidebarVisible(true)}
                        close={() => setSidebarVisible(false)}
                    >
                        <div className="panel-filter p-3" style={{ background: '#dedede', width: '100%' }}>
                            <div className="flex items-center text-center">
                                <button
                                    className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900"
                                    //onClick={toggleFilterData}
                                    onClick={closeClick}
                                >
                                    <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                </button>
                                <div className="shrink-0">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                        <path
                                            opacity="0.5"
                                            d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M7 10.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M9 17.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path
                                            d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </div>
                                <h5 className="text-lg font-bold ltr:ml-3 rtl:mr-3">Filtering Data</h5>
                            </div>
                        </div>
                    </SidebarComponent>
                </div>

                {/* PANEL FILTER DAN GRID LIST */}
                <div className="relative flex h-full gap-3 sm:h-[calc(100vh_-_100px)]">
                    {panelVisible && (
                        <div
                            className={`panel absolute z-10 hidden h-full w-[300px] max-w-full flex-none space-y-4 p-4 dark:border-[#191e3a] xl:relative xl:block xl:h-auto ltr:rounded-r-none ltr:xl:rounded-r-md rtl:rounded-l-none rtl:xl:rounded-l-md ${
                                isShowTaskMenu && '!block'
                            }`}
                            style={{ background: '#dedede' }}
                        >
                            <div className="flex h-full flex-col overflow-auto">
                                {/* <div className="flex h-full flex-col"> */}
                                <div className="pb-5">
                                    <div className="flex items-center text-center">
                                        <button className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900" onClick={handleTogglePanel}>
                                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                        </button>
                                        <div className="shrink-0">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                <path
                                                    opacity="0.5"
                                                    d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M7 10.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M9 17.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path
                                                    d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </div>
                                        <h5 className="text-lg font-bold ltr:ml-3 rtl:mr-3">Filtering Data</h5>
                                    </div>
                                </div>
                                <div className="mb-5 h-px w-full border-b border-black dark:border-[#1b2e4b]"></div>
                                {/* KOMPONEN FILTER */}
                                <PerfectScrollbar className="growltr:-mr3.5 ltr:pr3 relative mb-5 h-full rtl:-ml-3.5 rtl:pl-3 ">
                                    {/* <div className="flex flex-col items-center justify-between overflow-auto" id="Candil"> */}
                                    <div className="flex h-full flex-col gap-6 overflow-auto">
                                        <div id="inputFilter">
                                            {/* NO BUKTI */}
                                            <div className="flex">
                                                <CheckBoxComponent
                                                    label="No. Bukti"
                                                    name="chbKode"
                                                    checked={formDataState.chbKode}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbKode', value);
                                                    }}
                                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        name="edKode"
                                                        placeholder="No. Dokumen"
                                                        value={formDataState.edKode === 'all' ? '' : formDataState.edKode}
                                                        onChange={(args: any) => handleInputChange(args.target.name, args.value, 'chbKode')}
                                                    />
                                                </div>
                                            </div>
                                            {/* TANGGAL */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="Tanggal"
                                                    name="chbTanggal"
                                                    checked={formDataState.chbTanggal}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbTanggal', value);
                                                        // setIsTanggalChecked(value);
                                                    }}
                                                    // onChange={handleCheckboxChange}
                                                />
                                            </div>
                                            <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                                <div className="form-input mt-1 flex justify-between">
                                                    <DatePickerComponent
                                                        locale="id"
                                                        name="edTglAwal"
                                                        cssClass="e-custom-style"
                                                        // renderDayCell={onRenderDayCell}
                                                        enableMask={true}
                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                        showClearButton={false}
                                                        format="dd-MM-yyyy"
                                                        value={moment(formDataState.edTglAwal).toDate()}
                                                        // onChange={(args: any) => handleInputChange(args.target.name, moment(args.value).format('YYYY-MM-DD'), 'chbTanggal')}
                                                        change={(args: ChangeEventArgsCalendar) => {
                                                            // console.log(args.value);
                                                            handleInputChange('edTglAwal', moment(args.value).format('YYYY-MM-DD'), 'chbTanggal');
                                                        }}
                                                    >
                                                        <Inject services={[MaskedDateTime]} />
                                                    </DatePickerComponent>
                                                </div>
                                                <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
                                                <div className="form-input mt-1 flex justify-between">
                                                    <DatePickerComponent
                                                        locale="id"
                                                        name="edTglAkhir"
                                                        cssClass="e-custom-style"
                                                        // renderDayCell={onRenderDayCell}
                                                        enableMask={true}
                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                        showClearButton={false}
                                                        format="dd-MM-yyyy"
                                                        value={moment(formDataState.edTglAkhir).toDate()} //{tglAkhir.toDate()}
                                                        // onChange={(args: any) => handleInputChange(args.target.name, moment(args.value).format('YYYY-MM-DD'), 'chbTanggal')}
                                                        change={(args: ChangeEventArgsCalendar) => {
                                                            // console.log(args.value);
                                                            handleInputChange('edTglAkhir', moment(args.value).format('YYYY-MM-DD'), 'chbTanggal');
                                                        }}
                                                    >
                                                        <Inject services={[MaskedDateTime]} />
                                                    </DatePickerComponent>
                                                </div>
                                            </div>
                                            {/* TANGGAL BUAT */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="Tanggal Buat"
                                                    name="chbTanggalBuat"
                                                    checked={formDataState.chbTanggalBuat}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbTanggalBuat', value);
                                                    }}
                                                />
                                            </div>
                                            <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                                <div className="form-input mt-1 flex justify-between">
                                                    <DatePickerComponent
                                                        locale="id"
                                                        name="edTglAwalBuat"
                                                        cssClass="e-custom-style"
                                                        // renderDayCell={onRenderDayCell}
                                                        enableMask={true}
                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                        showClearButton={false}
                                                        format="dd-MM-yyyy"
                                                        value={moment(formDataState.edTglAwalBuat).toDate()} // {tglAwalTrx.toDate()}
                                                        // onChange={(args: any) => handleInputChange(args.target.name, moment(args.value).format('YYYY-MM-DD'), 'chbTanggalBuat')}
                                                        change={(args: ChangeEventArgsCalendar) => {
                                                            // console.log(args.value);
                                                            handleInputChange('edTglAwalBuat', moment(args.value).format('YYYY-MM-DD'), 'chbTanggalBuat');
                                                        }}
                                                    >
                                                        <Inject services={[MaskedDateTime]} />
                                                    </DatePickerComponent>
                                                </div>
                                                <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
                                                <div className="form-input mt-1 flex justify-between">
                                                    <DatePickerComponent
                                                        locale="id"
                                                        name="edTglAkhirBuat"
                                                        cssClass="e-custom-style"
                                                        // renderDayCell={onRenderDayCell}
                                                        enableMask={true}
                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                        showClearButton={false}
                                                        format="dd-MM-yyyy"
                                                        value={moment(formDataState.edTglAkhirBuat).toDate()} //{tglAkhirTrx.toDate()}
                                                        // onChange={(args: any) => handleInputChange(args.target.name, moment(args.value).format('YYYY-MM-DD'), 'chbTanggalBuat')}
                                                        change={(args: ChangeEventArgsCalendar) => {
                                                            // console.log(args.value);
                                                            handleInputChange('edTglAkhirBuat', moment(args.value).format('YYYY-MM-DD'), 'chbTanggalBuat');
                                                        }}
                                                    >
                                                        <Inject services={[MaskedDateTime]} />
                                                    </DatePickerComponent>
                                                </div>
                                            </div>
                                            {/* NO AKUN */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="No. Akun / Nama Akun"
                                                    name="chbAkun"
                                                    checked={formDataState.chbAkun}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbAkun', value);
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        placeholder="No. Akun"
                                                        name="edNoAkun"
                                                        value={formDataState.edNoAkun === 'all' ? '' : formDataState.edNoAkun}
                                                        showClearButton={true}
                                                        input={async (args: any) => {
                                                            // const inputTipe = args.event.inputType; // const value: any = args.value;
                                                            // await handleInputAkun(inputTipe);
                                                            // handleDialogAkun();
                                                        }}
                                                        onChange={(args: any) => {
                                                            handleDialogAkun();
                                                            handleInputChange(args.target.name, args.value, 'chbAkun');
                                                        }}
                                                    />
                                                </div>
                                                <ButtonComponent
                                                    id="buNoAkun"
                                                    name="buAkun"
                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                    cssClass="e-primary e-small e-round"
                                                    iconCss="e-icons e-small e-search"
                                                    onClick={() => {
                                                        openFrom = 'list';
                                                        handleDialogAkun();
                                                        // setStateDialog('header');
                                                        // setShowFrmDlgAkunJurnal(true);
                                                    }}
                                                    style={{ marginTop: 5, marginLeft: -25, backgroundColor: '#3b3f5c' }}
                                                />
                                            </div>
                                            {/* NAMA AKUN */}
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        placeholder="Nama Akun"
                                                        name="edNamaAkun"
                                                        value={formDataState.edNamaAkun === 'all' ? '' : formDataState.edNamaAkun}
                                                        showClearButton={true}
                                                        // input={async (args: any) => {
                                                        //     // const value: any = args.value;
                                                        //     // const inputTipe = args.event.inputType; // const value: any = args.value;
                                                        //     // await handleInputAkun(inputTipe);
                                                        //     handleDialogAkun();
                                                        // }}
                                                        onChange={(args: any) => {
                                                            handleDialogAkun();
                                                            handleInputChange(args.target.name, args.value, 'chbAkun');
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* KETERANGAN */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="Keterangan"
                                                    name="chbKet"
                                                    checked={formDataState.chbKet}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbKet', value);
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        placeholder="Keterangan"
                                                        name="edKet"
                                                        value={formDataState.edKet === 'all' ? '' : formDataState.edKet}
                                                        // input={(args: FocusInEventArgs) => {
                                                        //     const value: any = args.value;
                                                        //     // HandleNoTtbInputChange(value, setnoTtb, setIsNoTtbChecked);
                                                        // }}
                                                        onChange={(args: any) => handleInputChange(args.target.name, args.value, 'chbKet')}
                                                    />
                                                </div>
                                            </div>
                                            {/* NO BOK */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="No. Bukti BOK"
                                                    name="chbNoBOK"
                                                    checked={formDataState.chbNoBOK}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbNoBOK', value);
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        placeholder="No. BOK"
                                                        name="edNoBOK"
                                                        value={formDataState.edNoBOK === 'all' ? '' : formDataState.edNoBOK}
                                                        // input={(args: FocusInEventArgs) => {
                                                        //     const value: any = args.value;
                                                        //     // HandleNoCustInputChange(value, setnoCust, setisNoCustChecked);
                                                        // }}
                                                        onChange={(args: any) => handleInputChange(args.target.name, args.value, 'chbNoBOK')}
                                                    />
                                                </div>
                                            </div>
                                            {/* NO WARKAT */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="No. Warkat"
                                                    name="chbNoCek"
                                                    checked={formDataState.chbNoCek}
                                                    // change={(args: ChangeEventArgsButton) => {
                                                    //     const value: any = args.checked;
                                                    //     handleCheckboxChange('chbNoCek', value);
                                                    // }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        placeholder="No. Warkat"
                                                        name="edNoCek"
                                                        value={formDataState.edNoCek === 'all' ? '' : formDataState.edNoCek}
                                                        // input={(args: FocusInEventArgs) => {
                                                        //     const value: any = args.value;
                                                        //     // HandleNamaCustInputChange(value, setNamaCustValue, setIsNamaCustChecked);
                                                        // }}
                                                        onChange={(args: any) => handleInputChange(args.target.name, args.value, 'chbNoCek')}
                                                    />
                                                </div>
                                            </div>
                                            {/* STATUS WARKAT */}
                                            <div className="mt-2 flex justify-between">
                                                <CheckBoxComponent
                                                    label="Status Warkat"
                                                    name="chbStatusWarkat"
                                                    checked={formDataState.chbStatusWarkat}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbStatusWarkat', value);
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <div className="container form-input">
                                                    <DropDownListComponent
                                                        name="cbStatusWarkat"
                                                        dataSource={['Terbuka', 'Proses', 'Tertutup']}
                                                        placeholder="--Silahkan Pilih--"
                                                        value={formDataState.cbStatusWarkat}
                                                        // change={(args: ChangeEventArgsDropDown) => {
                                                        //     const value: any = args.value;
                                                        //     // HandleStatusDokInputChange(value, setStatusDokValue, setIsStatusDokChecked);
                                                        // }}
                                                        onChange={(args: any) => handleInputChange(args.target.name, args.value, 'chbStatusWarkat')}
                                                    />
                                                </div>
                                            </div>
                                            {/* NOTA PENGELUARAN */}
                                            <div className="mt-1 space-y-1">
                                                <CheckBoxComponent
                                                    label="Tidak Ada Nota Pengeluaran"
                                                    name="chbNota"
                                                    checked={formDataState.chbNota}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbNota', value);
                                                    }}
                                                    // cssClass="e-danger"
                                                />
                                            </div>
                                            {/* BUKTI PERSETUJUAN */}
                                            <div className="mt-1 space-y-1">
                                                <CheckBoxComponent
                                                    label="Tidak Ada Bukti Persetujuan"
                                                    name="chbBukti"
                                                    checked={formDataState.chbBukti}
                                                    change={(args: ChangeEventArgsButton) => {
                                                        const value: any = args.checked;
                                                        handleCheckboxChange('chbBukti', value);
                                                    }}
                                                    // cssClass="e-danger"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </PerfectScrollbar>
                                {/* TOMBOL REFRESH DATA BAWAH */}
                                <div className="mb-2 flex justify-center">
                                    <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                        <ButtonComponent
                                            cssClass="e-primary e-small"
                                            iconCss="e-icons e-medium e-refresh"
                                            content="Refresh Data"
                                            style={{ backgroundColor: '#3b3f5c' }}
                                            // onClick={() => refreshDataList(paramList, setRecordsDataDetailList, jenisTab === 'baru' ? gridListData : gridListDataApproved, token)}
                                            onClick={() => refreshDataList(paramList, setRecordsDataDetailList, gridListData, token)}
                                        />
                                    </TooltipComponent>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* TODO: GRIDDDDDDDD */}
                    {/* BATAS ATAS */}
                    <div
                        className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowTaskMenu && '!block xl:!hidden'}`}
                        onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
                    ></div>

                    <div className="h-full flex-1 overflow-auto">
                        <div className="flex items-center ltr:mr-3 rtl:ml-3">
                            <button type="button" className="block hover:text-primary xl:hidden ltr:mr-3 rtl:ml-3" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div
                            className="panel h-auto  flex-1"
                            style={{
                                background: '#dedede',
                                boxShadow: '5px -5px 5px rgba(0, 0, 0, 0.3), 5px 5px 5px rgba(0, 0, 0, 0.3)',
                                margin: panelVisible ? '' : 'auto auto auto ',
                                overflowY: 'auto',
                            }}
                        >
                            {/* <div
                            className={`panel bg-white-200/50 absolute z-10 mb-1 hidden h-auto w-[300px] max-w-full flex-none p-4 dark:border-[#191e3a] xl:relative xl:block xl:h-auto ltr:rounded-r-none ltr:xl:rounded-r-md rtl:rounded-l-none rtl:xl:rounded-l-md`}
                            style={{ background: '#dedede', margin: panelVisible ? '' : 'auto auto auto ', overflowY: 'auto', width: '100%' }}
                        > */}
                            {/* </div> */}
                            {/* BATAS BAWAH */}
                            {/* <div className="panel h-full flex-1 " style={{ background: '#dedede', margin: panelVisible ? '' : 'auto auto auto ', overflowY: 'auto' }}> */}
                            {/* <div className="panel-data w-full"> */}
                            <div className="mb-2  w-full items-center border border-black bg-white" style={{ display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="cariNoBk"
                                    name="edCariNoBk"
                                    className="cariNoBk"
                                    placeholder="search..."
                                    showClearButton={true}
                                    value={searchNamaCust}
                                    input={(args: FocusInEventArgs) => {
                                        const value: any = args.value;
                                        handleSearch(args.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="panel h-full flex-1 " style={{ background: '#dedede', margin: panelVisible ? '' : 'auto auto auto ', overflowY: 'auto' }}>
                            <div className="panel-data" style={{ width: '100%' }}>
                                {/* TAB BUAT GRID */}
                                <Tab.Group>
                                    <Tab.List className="flex space-x-1 overflow-x-auto rounded-xl  p-1">
                                        {tabKategoriArray.map((item) => (
                                            // <Tab
                                            //     key={item.kategori}
                                            //     as={Fragment}
                                            //     className={({ selected }: any) =>
                                            //         classNames(
                                            //             'w-full  px-2.5 py-1.5 text-xs  font-medium focus:outline-none',
                                            //             selected ? 'rounded-t-md border-b-2 border-blue-400 bg-blue-200/50 text-blue-600' : ' text-gray-900 hover:border-b-2 hover:border-blue-400'
                                            //         )
                                            //     }
                                            // >
                                            //     <button className="whitespace-nowrap " id={`${item.kategori}`} onClick={() => setJenisTab(item.kategori)}>
                                            //         {item.kategori}
                                            //     </button>
                                            // </Tab>

                                            <Tab as={Fragment} key={item.kategori}>
                                                {({ selected }) => (
                                                    <button
                                                        className={`px-2.5 py-1.5 text-xs  font-medium focus:outline-none ${
                                                            selected ? 'rounded-t-md border-b-2 border-blue-400 bg-blue-200/50 text-blue-600' : 'text-gray-900 hover:border-b-2 hover:border-blue-400'
                                                        }`}
                                                        id={`${item.kategori}`}
                                                        onClick={() => setJenisTab(item.kategori)}
                                                    >
                                                        {item.kategori}
                                                    </button>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                    <Tab.Panels>
                                        {tabKategoriArray.map((item) => (
                                            <Tab.Panel key={item.kategori}>
                                                <div className="overflow-hidden" style={{ background: '#dedede', width: '100%' }}>
                                                    <GridComponent
                                                        id="gridListData"
                                                        locale="id"
                                                        // dataSource={recordsDataDetailList}
                                                        // toolbar={['Search']}
                                                        ref={(g: any) => (gridListData = g)}
                                                        // created={created}
                                                        allowExcelExport={true}
                                                        loadingIndicator={{ indicatorType: 'Spinner' }}
                                                        excelExportComplete={ExportComplete}
                                                        allowPdfExport={true}
                                                        pdfExportComplete={ExportComplete}
                                                        editSettings={{ allowDeleting: true }}
                                                        selectionSettings={{
                                                            mode: 'Row',
                                                            type: 'Single',
                                                        }}
                                                        allowPaging={true}
                                                        allowSorting={true}
                                                        allowFiltering={false}
                                                        allowResizing={true}
                                                        autoFit={true}
                                                        allowReordering={true}
                                                        pageSettings={{
                                                            pageSize: 25,
                                                            pageCount: 5,
                                                            pageSizes: ['25', '50', '100', 'All'],
                                                        }}
                                                        rowHeight={22}
                                                        width={'100%'}
                                                        height={545}
                                                        gridLines={'Both'}
                                                        // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                        // queryCellInfo={queryCellInfoListData}
                                                        // rowDataBound={rowDataBoundListData}
                                                        // dataBound={() => {
                                                        //     if (gridListData) {
                                                        //         gridListData.selectRow(rowIdxListData.current);
                                                        //     }
                                                        // }}
                                                        // recordDoubleClick={showEditRecord}
                                                        recordDoubleClick={async (args: any) => {
                                                            if (gridListData) {
                                                                // console.log('masuk sini');
                                                                const rowIndex: number = args.row.rowIndex;
                                                                gridListData.selectRow(rowIndex);
                                                                showEditRecord('Edit Biasa');
                                                            }
                                                        }}
                                                        rowSelected={async (args: any) => {
                                                            // await HandleRowSelected(args, setSelectedRowKodeDok);
                                                            setDetailListPraBkk({
                                                                ...detailListPraBkk,
                                                                no_dokumen: args.data?.no_dokumen,
                                                                tgl_dokumen: moment(args.data?.tgl_dokumen).format('YYYY-MM-DD'),
                                                            });
                                                            HandleRowSelected(args, setSelectedRowKodeDok);
                                                            ListDetailDok(args.data?.kode_dokumen, stateDokumen?.jenisTab, stateDokumen?.kode_entitas, setDetailDok, stateDokumen?.token);
                                                        }}
                                                        // rowSelecting={(args) => rowSelectingListData(args, setDetailListPraBkk, kode_entitas, setDetailDok, stateDokumen?.token, jenisTab)}
                                                        aggregates={[
                                                            {
                                                                columns: [
                                                                    {
                                                                        type: 'Sum',
                                                                        field: 'jumlah_mu',
                                                                        format: 'N2',
                                                                        footerTemplate: (props: any) => {
                                                                            return <div className="px-2 text-right">{props.Sum.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</div>;
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        ]}
                                                    >
                                                        <ColumnsDirective>
                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="no_dokumen"
                                                                headerText="No. Bukti"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                //autoFit
                                                                width="110"
                                                                clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                            />
                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="tgl_dokumen"
                                                                headerText="Tanggal"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                //autoFit
                                                                width="100"
                                                                clipMode="EllipsisWithTooltip"
                                                                type="date"
                                                                format={formatDate}
                                                            />
                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="tgl_trxdokumen"
                                                                headerText="Tgl. Dibuat"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                //autoFit
                                                                width="100"
                                                                clipMode="EllipsisWithTooltip"
                                                                type="date"
                                                                format={formatDate}
                                                            />
                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="ket_kredit"
                                                                headerText="Dibayar dari Akun Kredit"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                //autoFit
                                                                width="200"
                                                                clipMode="EllipsisWithTooltip"
                                                            />

                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="kode_mu"
                                                                headerText="MU"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                //autoFit
                                                                width="50"
                                                                clipMode="EllipsisWithTooltip"
                                                            />

                                                            {/*  */}

                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="jumlah_mu"
                                                                headerText="Jumlah"
                                                                format={formatFloat}
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                //autoFit
                                                                width="110"
                                                                clipMode="EllipsisWithTooltip"
                                                            />

                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="catatan"
                                                                headerText="Keterangan"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                //autoFit
                                                                width="300"
                                                                clipMode="EllipsisWithTooltip"
                                                            />

                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="no_warkat"
                                                                headerText="No. Warkat"
                                                                // format={formatFloat}
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                //autoFit
                                                                width="110"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="tgl_valuta"
                                                                headerText="Tgl. Valuta"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                //autoFit
                                                                width="100"
                                                                clipMode="EllipsisWithTooltip"
                                                                type="date"
                                                                format={formatDate}
                                                            />

                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="status_warkat"
                                                                headerText="Status Warkat"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                //autoFit
                                                                width="110"
                                                                clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                            />

                                                            <ColumnDirective
                                                                allowEditing={false}
                                                                field="no_fk"
                                                                headerText="No. Bukti BOK"
                                                                // format={formatFloat}
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                //autoFit
                                                                width="110"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                        </ColumnsDirective>
                                                        {/* <Inject services={[Page, Toolbar]} /> */}
                                                        <Inject services={[Page, Selection, Aggregate, Edit, Toolbar, Sort, Group, Filter, Resize, Reorder, /*Freeze,*/ ExcelExport, PdfExport]} />
                                                    </GridComponent>
                                                </div>
                                            </Tab.Panel>
                                        ))}
                                    </Tab.Panels>
                                </Tab.Group>
                                {/* </TooltipComponent> */}
                                {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                                <ContextMenuComponent
                                    id="contextmenu"
                                    target=".e-gridheader"
                                    items={menuHeaderItems}
                                    select={menuHeaderSelect}
                                    animationSettings={{ duration: 800, effect: 'FadeIn' }}
                                />
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                </div>

                {selectedItem && (
                    <Draggable>
                        <div className={`${styles.modalDetailDragable}`} style={modalPosition}>
                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 18, fontWeight: 500 }}>
                                        Pengeluaran Lain : {detailListPraBkk.no_dokumen} - {moment(detailListPraBkk.tgl_dokumen).format('DD-MM-YYYY')}
                                    </span>
                                </div>
                                <GridComponent dataSource={detailDok} height={200} width={'100%'} gridLines={'Both'} allowSorting={true} ref={(g: any) => (gridListDataDetailDok = g)}>
                                    <ColumnsDirective>
                                        <ColumnDirective field="no_akun" headerText="No. Akun" width="75" textAlign="Center" headerTextAlign="Center" />
                                        <ColumnDirective field="nama_akun" headerText="Nama" width="150" textAlign="Left" headerTextAlign="Center" />
                                        <ColumnDirective field="debet_rp" format="N2" headerText="Debet" width="100" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="kredit_rp" format="N2" headerText="Kredit" width="100" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="catatan" headerText="Keterangan" width="200" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="kode_mu" headerText="MU" width="50" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="kurs" format="N2" headerText="Kurs" width="50" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="jumlah_mu" format="N2" headerText="Jumlah" width="100" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="subledger" headerText="Subledger" width="125" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="nama_dept" headerText="Departemen" width="100" textAlign="Right" headerTextAlign="Center" />
                                        <ColumnDirective field="nama_kry" headerText="Karyawan" width="125" textAlign="Right" headerTextAlign="Center" />
                                    </ColumnsDirective>
                                    <Inject services={[Page, Sort, Filter, Group]} />
                                </GridComponent>
                            </div>
                            <button
                                className={`${styles.closeButtonDetailDragable}`}
                                onClick={() => {
                                    closeModal();
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                            </button>
                        </div>
                    </Draggable>
                )}
            </div>
            {showFrmDlgAkunJurnal && (
                <FrmDlgAkunJurnal
                    kode_entitas={kode_entitas}
                    isOpen={showFrmDlgAkunJurnal}
                    onClose={() => {
                        handleOnCloseDlgAkun();
                        setJenisDialog('');
                    }}
                    onBatal={() => {
                        handleOnBatalDlgAkun();
                        setJenisDialog('');
                    }}
                    selectedData={(dataObject: any) => handleSelectedDataJurnal(dataObject)}
                    target={'main-target'}
                    stateDokumen={stateDokumen}
                    kodeAkun={''}
                    // stateDialogAja={'header'}
                    listAkunJurnalObjek={listAkunJurnal ? listAkunJurnal : []}
                    vRefreshDataAkun={vRefreshDataAkun.current ? vRefreshDataAkun.current : null}
                    openFrom={'list'}
                />
            )}
            {dialogInputDataVisible && (
                <FrmPraBkk
                    stateDokumen={stateDokumen}
                    isOpen={dialogInputDataVisible ? dialogInputDataVisible : false}
                    onClose={() => {
                        setDialogInputDataVisible(false);
                    }}
                    onRefresh={handleRefreshData}
                    isFilePendukungBk={isFilePendukungBk}
                    dataListMutasibank="Y"
                    onRefreshTipe={0}
                    // stateDialog={stateDialog}
                    // setStateDialog={setStateDialog}
                />
            )}
        </>
    );
};

export default FrmPraBkkList;
