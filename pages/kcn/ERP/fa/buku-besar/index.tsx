import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { ContextMenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import {
    Grid,
    GridComponent,
    ColumnDirective,
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
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
    Aggregate,
} from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRefresh } from '@fortawesome/free-solid-svg-icons';
import styles from './style.module.css';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import { useSession } from '@/pages/api/sessionContext';
import { useRouter } from 'next/router';
import moment from 'moment';
import { DaftarAkunKredit, GetPeriode, MasterDivisi } from './model/api';
import DialogDaftarAkunKredit from './modal/DialogDaftarAkunKredit';
import {
    ExportToCustomExcel,
    GetListDataBukuBesar,
    GetListDataBukuBesarSort,
    HandleChangeDivisiJual,
    HandleModalInput,
    HandleSearchNamaAkun,
    HandleSearchNoAkun,
    HandleTgl,
    OnClick_CetakDaftarBukuBesar,
    PrintData,
} from './functional/fungsiForm';
enableRipple(true);
import withReactContent from 'sweetalert2-react-content';
import {
    CustomSumDeb,
    CustomSumKre,
    CustomSumSaldoKumulatif,
    CustomTotDebKre,
    SumDebet,
    SumKredit,
    SumSaldoKumulatif,
    swalToast,
    TemplateNamaAkun,
    TemplateNoAkun,
    TotDebKre,
} from './interface/template';
import { GetListPpiEffect } from '../ppi/model/apiPpi';
import DialogPpiListTunai from '../ppi/component/dialogPpiListTunai';
import DialogPpiListTransfer from '../ppi/component/dialogPpiListTransfer';
import DialogPpiListWarkat from '../ppi/component/dialogPpiListWarkat';
import DialogPencairanWarkat from '../ppi/component/dialogPencairanWarkat';
import DialogPenolakanWarkat from '../ppi/component/dialogPenolakanWarkat';
import DialogPembatalanWarkat from '../ppi/component/dialogPembatalanWarkat';
import axios from 'axios';
import Swal from 'sweetalert2';
import DialogCreateBM from '../bm/component/DialogCreateBM';
import FrmPraBkk from '../bkk/component/frmPraBkk';
import ModalJurnalUmumProps from '../ju/modal/ju';
import { GetListPhuEffect } from '../phu/model/apiPhu';
import DialogPhuList from '../phu/component/dialogPhuList';
import DialogPhuListTransfer from '../phu/component/dialogPhuListTransfer';
import DialogPhuListWarkat from '../phu/component/dialogPhuListWarkat';
import DialogPencairanWarkatPhu from '../phu/component/dialogPencairanWarkat';
import DialogPenolakanWarkatPhu from '../phu/component/dialogPenolakanWarkat';
import DialogPembatalanWarkatPhu from '../phu/component/dialogPembatalanWarkat';

const ReportList = () => {
    const router = useRouter();
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const nip = sessionData?.nip ?? '';
    const kode_user = sessionData?.nip ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }

    const styleButton = { width: 69 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    let disabledCetak = false;
    let tooltipListData: Tooltip | any;
    let gridListData: Grid | any;

    // ================== State untuk filter data list ===============================
    const [stateDataHeader, setStateDataHeader] = useState({
        date1: moment().subtract(1, 'months').startOf('month'), // tanggal awal
        date2: moment().subtract(1, 'months').endOf('month'), // tanggal akhir
        dialogDaftarAkunKreditVisible: false,

        // ============================
        //Search Modal Akun Kredit
        searchNoAkun: '',
        searchNamaAkun: '',
        searchKeywordNoAkun: '',
        searchKeywordNamaAkun: '',
        //Input Value Akun Kredit
        noAkunValue: '',
        namaAkunValue: '',
        kodeAkun: '',
        tipeAkun: '',
        tipeAkunDialogVisible: 'header',
        divisiJualDefault: 'ALL',
        viewTipe: '',
        // ============================
    });
    type ListItem = {
        tgl_dokumen: any;
        dokumen: any;
        no_dokumen: any;
        catatan: any;
        debet: any;
        kredit: any;
        subledger: any;
        nama_dept: any;
        nama_kry: any;
        kode_jual: any;
    };
    const [recordsData, setRecordsData] = useState<ListItem[]>([]);
    const dataDaftarAkunKreditRef = useRef<any[]>([]);
    const [filteredDataAkunKredit, setFilteredDataAkunKredit] = useState<any[]>([]);
    const [masterDivisi, setMasterDivisi] = useState<any[]>([]);

    const [dataDaftarAkunKredit, setDataDaftarAkunKredit] = useState<any[]>([]);

    const [listStateData, setListStateData] = useState({
        masterKodeDokumen: '',
        masterDataState: '',
        selectedModalJenisPenerimaan: '',
        selectedModalJenisPembayaran: 'Tunai',
        dialogInputDataVisible: false,
        dialogInputDataVisiblePhu: false,
        tipeDialog: '',
        tipeDialogPhu: '',
        selectedKodeSupp: '',
        selectedRowKodePhu: '',
        tipeBatal: '',
    });
    // End

    // const gridKey = `${stateDataHeader?.noAkunValue}-${stateDataHeader?.namaAkunValue}`;

    useEffect(() => {
        const refreshData = async () => {
            const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(kode_entitas, 'akun');
            dataDaftarAkunKreditRef.current = resultDaftarAkunKredit;
            setDataDaftarAkunKredit(resultDaftarAkunKredit);

            const resultMasterDivisi: any[] = await MasterDivisi(kode_entitas, token);
            setMasterDivisi(resultMasterDivisi);

            const resPeriode: any[] = await GetPeriode(kode_entitas);

            const periode = resPeriode[0].periode; // contoh: 202110
            const year = parseInt(periode.substring(0, 4), 10);
            const month = parseInt(periode.substring(4), 10);

            const firstDay = moment(new Date(year, month - 1, 1)); // Konversi ke Moment
            const lastDay = moment(new Date(year, month, 0)); // Konversi ke Moment
            // Set tglAwal and tglAkhir using state1 and state2
            setStateDataHeader((prevfState: any) => ({
                ...prevfState,
                date1: firstDay,
                date2: lastDay,
            }));
        };
        refreshData();
    }, []);

    // ============ untuk menampilkan dropdown cetak dan fungsi pemanggilan nya =================
    let cMenuCetak: ContextMenuComponent;
    function btnPrintClick(e: any): void {
        var clientRect = (e.target as Element).getBoundingClientRect();
        cMenuCetak.open(clientRect.bottom, clientRect.left);
    }

    let menuCetakItems: MenuItemModel[] = [
        {
            id: 'keLayar',
            iconCss: 'e-icons e-thumbnail',
            text: 'Ke Layar',
        },
        {
            id: 'printer',
            iconCss: 'e-icons e-print',
            text: 'Printer',
        },
        {
            id: 'konversiExcel',
            iconCss: 'e-icons e-excel-icon',
            text: 'Konversi ke Excel',
        },
    ];

    const objectToExcel = {
        periode: `Periode Tgl. ${moment(stateDataHeader?.date1).format('DD MMM YYYY')} s/d ${moment(stateDataHeader?.date2).format('DD MMM YYYY')}`,
        no_akun: `No. Akun : ${stateDataHeader?.noAkunValue} - ${stateDataHeader?.namaAkunValue}`,
        kode_entitas: kode_entitas === '999' ? 'TRAINING' : kode_entitas,
        title: `BUKU BESAR`,
    };

    const menuCetakSelect = async (args: MenuEventArgs) => {
        if (args.item.id === 'keLayar') {
            const paramObject = {
                kode_entitas: kode_entitas,
                kode_akun: stateDataHeader?.kodeAkun,
                kode_divisi: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
                tgl_awal: stateDataHeader?.date1.format('YYYY-MM-DD'),
                tgl_akhir: stateDataHeader?.date2.format('YYYY-MM-DD'),
                token: token,
            };
            OnClick_CetakDaftarBukuBesar(paramObject);
        } else if (args.item.id === 'printer') {
            if (stateDataHeader?.noAkunValue === '' || stateDataHeader?.namaAkunValue === '') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px;color:white;">No. Akun harus di pilih terlebih dahulu.</p>',
                    width: '100%',
                    target: '#main-target',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }
            const printData = PrintData(recordsData, objectToExcel);
        } else if (args.item.id === 'konversiExcel') {
            const exportToExcel = await ExportToCustomExcel(recordsData, 'Buku-Besar(Next)', objectToExcel);
            if (exportToExcel === true) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px;color:white;">File Excel telah diunduh. Silakan buka file tersebut untuk melihat isinya..</p>',
                    width: '100%',
                    target: '#main-target',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            }
        }
    };

    const vRefreshData = useRef(0);
    const handleModalIcon = () => {
        vRefreshData.current += 1;
        setStateDataHeader((prevState) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: true,
        }));
    };

    //================ Disable hari minggu di calendar ==============
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    const handleClickRefresh = async () => {
        const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            divisiJual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };

        const getListDataBukuBesar: any[] = await GetListDataBukuBesar(paramObject);
        setRecordsData(getListDataBukuBesar);
    };

    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [isFilePendukungPPI, setisFilePendukungPPI] = useState<any>('Y');
    // State BM
    const [selectedRowStatus, setSelectedRowStatus] = useState<any>('');
    const [selectedRow, setSelectedRow] = useState<any>('');
    const [selectedRowno_dokumen, setSelectedRowno_dokumen] = useState<any>('');
    const [selectedRowTUMataunonTUM, setSelectedRowTUMataunonTUM] = useState<any>('');
    const [selectedRowBMPOS, setSelectedRowBMPOS] = useState<any>('');
    const [isFilePendukung, setisFilePendukung] = useState<any>('');
    const [isApprovedData, setisApprovedData] = useState<any>('');
    const [modalHandleDataBM, setModalHandleDataBM] = useState(false);
    const [modalHandleDataBMTUM, setModalHandleDataBMTUM] = useState(false);
    const [modalHandleDataBMPOS, setModalHandleDataBMPOS] = useState(false);
    const [statusPage, setStatusPage] = useState('');
    const [statusPageTUM, setStatusPageTUM] = useState('');
    const [statusPagePOS, setStatusPagePOS] = useState('');
    const [baru, setBaru] = useState(false);
    // END

    // state BK
    const [masterDataState, setMasterDataState] = useState<string>('');
    const [CON_BKK, setCON_BKK] = useState<string>('BKK');
    const [jenisUpdateBKK, setJenisUpdateBKK] = useState(0);
    const [masterKodeDokumen, setMasterKodeDokumen] = useState<string>('BARU');
    const [dialogInputDataVisible, setDialogInputDataVisible] = useState(false);
    const [jenisTab, setJenisTab] = useState('Baru');
    let stateDokumen: any = {
        kode_entitas: kode_entitas,
        kode_user: kode_user,
        userid: userid,
        jenisUpdateBKK: 1,
        CON_BKK: 'PREVIEW_IMAGE_ORI',
        masterKodeDokumen: masterKodeDokumen,
        masterDataState: 'EDIT',
        jenisTab: 'Approved',
        token: token,
    };
    const [isFilePendukungBk, setisFilePendukungBk] = useState<any>('Y');

    // END

    // State JU
    const [selectedRowKode, setSelectedRowKode] = useState<any>('');
    const [selectedRowNoJU, setSelectedRowNoJU] = useState({ no_ju: '', tgl_ju: '' });
    const [statusEdit, setStatusEdit] = useState(false); // filter
    const [modalJurnalUmum, setModalJurnalUmum] = useState<any>(false); // Modal
    // END

    const handleRowSelected = async (args: any) => {
        if (args.data.dokumen === 'PU') {
        } else if (args.data.dokumen === 'BM') {
            const responseApproved = await axios.get(`${apiUrl}/erp/list_pemasukkan_lain_bm?`, {
                params: {
                    entitas: kode_entitas,
                    param1: 'all', // Tgl Dokumen Awal
                    param2: 'all', // Tgl Dokumen Akhir
                    param3: 'all', // Catatan
                    param4: args.data.no_dokumen, // No Dokumen
                    param5: 'all', // No Warkat
                    param6: 'all', // Tgl Dibuat Awal
                    param7: 'all', // Tgl Dibuat Akhir
                    param8: 'all', // Kode Akun Debet
                    param9: 'N', // Tidak Ada Nota Pengeluaran Y atau N
                    param10: 'N', // Tidak Ada Bukti Persetujuan Y atau N
                    param11: 'all', //Status Warkat ( '0' = 'Baru' ,= '1' = 'Cair', '2' = 'Tolak' )
                    param12: 'approved',
                    param13: 'all',
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const transformedDataApproved = responseApproved.data.data.map((item: any) => ({
                ...item,
                statusBM: 'approved',
            }));

            setSelectedRowStatus(transformedDataApproved[0].statusBM);
            setSelectedRow(args.data.kode_dokumen);
            setSelectedRowno_dokumen(args.data.no_dokumen);
            setSelectedRowTUMataunonTUM(transformedDataApproved[0].kode_supp);
            setSelectedRowBMPOS(transformedDataApproved[0].bm_pos);
        } else if (args.data.dokumen === 'JU') {
            setSelectedRowKode(args.data.kode_dokumen);
            setSelectedRowNoJU({ no_ju: args.data.no_dokumen, tgl_ju: args.data.tgl_dokumen });
        } else if (args.data.dokumen === 'BB') {
            let vDokumen = 'BB';
            let vNoDokumen = args.data.no_dokumen;
            let vNoWarkat = 'all';
            let vNoSupp = 'all';
            let vNamaSupp = 'all';
            let vTglPhuAwal = 'all'; //tanggalHariIni
            let vTglPhuAkhir = 'all'; //tanggalAkhirBulan

            let vTglPhuJtAwal = 'all';
            let vTglPhuJtAkhir = 'all';
            let vTglPhuPencairanAwal = 'all';
            let vTglPhuPencairanAkhir = 'all';
            let vNoReff = 'all';
            let vJenisPembayaran = 'all';
            let vLimit = '1000';
            let vAkunBayar = 'all';

            let paramObject = {
                kode_entitas: kode_entitas,
                vDokumen: vDokumen,
                vNoDokumen: vNoDokumen,
                vNoWarkat: vNoWarkat,
                vNoSupp: vNoSupp,
                vNamaSupp: vNamaSupp,
                vTglPhuAwal: vTglPhuAwal,
                vTglPhuAkhir: vTglPhuAkhir,
                vTglPhuJtAwal: vTglPhuJtAwal,
                vTglPhuJtAkhir: vTglPhuJtAkhir,
                vTglPhuPencairanAwal: vTglPhuPencairanAwal,
                vTglPhuPencairanAkhir: vTglPhuPencairanAkhir,
                vNoReff: vNoReff,
                vJenisPembayaran: vJenisPembayaran,
                vLimit: vLimit,
                vAkunBayar: vAkunBayar,
            };

            const responseData = await GetListPhuEffect(paramObject);

            if (args.data !== undefined) {
                setListStateData((prevState: any) => ({
                    ...prevState,
                    masterKodeDokumen: responseData[0].kode_dokumen,
                    selectedModalJenisPembayaran: responseData[0].pembayaran,
                    tipeDialogPhu: responseData[0].pembayaran,
                    selectedKodeSupp: responseData[0].kode_supp,
                    masterDataState: 'EDIT',
                    selectedRowKodePhu: responseData[0].kode_dokumen,
                }));
            }
        }
    };

    const handleClickPreview = async (args: any) => {
        console.log('args.rowData.dokumen = ', args.rowData.dokumen);
        if (args.rowData.STATUS === 'Tertutup') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Status dok. Tertutup tidak boleh dikoreksi.</p>',
                width: '100%',
                target: '#main-target',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (args.rowData.dokumen === 'PU') {
            vRefreshData.current += 1;
            let paramObject = {
                kode_entitas: kode_entitas,
                vToken: token,
                vWhere: `where no_dokumen LIKE '${args.rowData.no_dokumen}%'`,
            };
            const responseData = await GetListPpiEffect(paramObject);
            if (userid === 'administrator') {
                setListStateData((prevState: any) => ({
                    ...prevState,
                    masterKodeDokumen: args.rowData.kode_dokumen,
                    masterDataState: 'EDIT',
                    selectedModalJenisPenerimaan: responseData[0].Jenis,
                    dialogInputDataVisible: true,
                    tipeDialog: responseData[0].Jenis,
                    selectedKodeSupp: responseData[0].kode_supp,
                }));
            } else {
                vRefreshData.current += 1;
                setListStateData((prevState: any) => ({
                    ...prevState,
                    masterDataState: 'UpdateFilePendukung',
                    masterKodeDokumen: args.rowData.kode_dokumen,
                    dialogInputDataVisible: true,
                    selectedModalJenisPenerimaan: 'UpdateFilePendukung',
                    tipeDialog: responseData[0].Jenis,
                    selectedKodeSupp: listStateData.selectedKodeSupp,
                }));
                setisFilePendukungPPI('Y');
            }
        } else if (args.rowData.dokumen === 'BM') {
            if (selectedRowBMPOS === 'Y') {
                handleNavigateLinkPOS('edit');
                setisApprovedData('N');
                setisFilePendukung('Y');
            } else if (selectedRowBMPOS === 'N') {
                if (selectedRowTUMataunonTUM === 'TUM') {
                } else {
                    handleNavigateLink('edit');
                    setisApprovedData('N');
                    setisFilePendukung('Y');
                }
            } else if (selectedRowBMPOS === null || selectedRowBMPOS === undefined) {
                handleNavigateLink('edit');
                setisApprovedData('N');
                setisFilePendukung('Y');
            }
        } else if (args.rowData.dokumen === 'BK') {
            setMasterDataState('EDIT');
            setCON_BKK('PREVIEW_IMAGE_ORI');
            setJenisUpdateBKK(1);
            setMasterKodeDokumen(args.rowData.kode_dokumen);
            setDialogInputDataVisible(true);
            setisFilePendukungBk('Y');

            stateDokumen = [
                {
                    kode_entitas: kode_entitas,
                    kode_user: kode_user,
                    userid: userid,
                    jenisUpdateBKK: 1,
                    CON_BKK: 'PREVIEW_IMAGE_ORI',
                    masterKodeDokumen: args.rowData.kode_dokumen,
                    masterDataState: 'EDIT',
                    jenisTab: 'Approved',
                    token: token,
                    // isFilePendukungBk: 'Y'
                },
            ];
        } else if (args.rowData.dokumen === 'JU') {
            setStatusEdit(true);
            setModalJurnalUmum(true);
        } else if (args.rowData.dokumen === 'BB') {
            vRefreshData.current += 1;
            setListStateData((prevState: any) => ({
                ...prevState,
                dialogInputDataVisiblePhu: true,
            }));
        } else if (args.rowData.dokumen === 'FJ' || args.rowData.dokumen === 'PB' || args.rowData.dokumen === 'SJ' || args.rowData.dokumen === 'MB' || args.rowData.dokumen === 'TB') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Status dok. tidak boleh dikoreksi.</p>',
                width: '100%',
                target: '#main-target',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
    };

    const handleNavigateLink = (jenis: any) => {
        setModalHandleDataBM(false);
        if (jenis === 'edit') {
            if (selectedRow) {
                setStatusPage('EDIT');
                setModalHandleDataBM(true);
            } else {
                Swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else if (jenis === 'create') {
            setStatusPage('CREATE');
            setModalHandleDataBM(true);
            setBaru(false);
        }
    };

    const handleNavigateLinkPOS = (jenis: any) => {
        setModalHandleDataBMPOS(false);
        if (jenis === 'edit') {
            if (selectedRow) {
                setStatusPagePOS('EDIT');
                setModalHandleDataBMPOS(true);
            } else {
                Swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else if (jenis === 'create') {
            setStatusPagePOS('CREATE');
            setModalHandleDataBMPOS(true);
            setBaru(false);
        }
    };

    const handleRefreshData = async () => {};

    const headerTanggal = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('tanggal')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Tanggal</span>
            </div>
        );
    };

    const headerDokumen = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('dok')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Dok.</span>
            </div>
        );
    };

    const headerNoRef = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('noRef')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>No. Referensi</span>
            </div>
        );
    };

    const headerKet = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('ket')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Keterangan</span>
            </div>
        );
    };

    const headerDebet = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('debet')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Debet</span>
            </div>
        );
    };

    const headerKredit = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('kredit')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Kredit</span>
            </div>
        );
    };

    const headerSaldoKum = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('saldoKum')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Saldo Kumulatif</span>
            </div>
        );
    };

    const headerSub = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('subledger')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Akun Pembantu (Subledger)</span>
            </div>
        );
    };

    const headerDept = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('dept')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Departemen</span>
            </div>
        );
    };

    const headerNamaKar = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('namaKar')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Nama Karyawan</span>
            </div>
        );
    };

    const headerDivisiJual = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('divisiJual')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Divisi Penjualan</span>
            </div>
        );
    };

    const [plagSort, setPlagSort] = useState({
        sortTanggal: '',
        sortDok: '',
        sortNoRef: '',
        sortKet: '',
        sortDebet: '',
        sortKredit: '',
        sortSaldoKum: '',
        sortSubl: '',
        sortDept: '',
        sortNamaKar: '',
        sortDivisiPen: '',
    });
    const handleSortBy = async (tipe: any) => {
        let plag;
        if (tipe === 'tanggal') {
            if (plagSort.sortTanggal === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortTanggal: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortTanggal === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortTanggal: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortTanggal === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortTanggal: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'dok') {
            if (plagSort.sortDok === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDok: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortDok === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDok: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortDok === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDok: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'noRef') {
            if (plagSort.sortNoRef === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNoRef: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortNoRef === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNoRef: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortNoRef === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNoRef: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'ket') {
            if (plagSort.sortKet === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKet: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortKet === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKet: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortKet === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKet: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'debet') {
            if (plagSort.sortDebet === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDebet: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortDebet === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDebet: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortDebet === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDebet: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'kredit') {
            if (plagSort.sortKredit === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKredit: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortKredit === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKredit: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortKredit === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKredit: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'saldoKum') {
            if (plagSort.sortSaldoKum === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSaldoKum: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortSaldoKum === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSaldoKum: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortSaldoKum === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSaldoKum: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'subledger') {
            if (plagSort.sortSubl === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSubl: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortSubl === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSubl: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortSubl === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSubl: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'dept') {
            if (plagSort.sortDept === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDept: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortDept === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDept: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortDept === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDept: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'namaKar') {
            if (plagSort.sortNamaKar === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNamaKar: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortNamaKar === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNamaKar: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortNamaKar === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNamaKar: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'divisiJual') {
            if (plagSort.sortDivisiPen === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDivisiPen: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortDivisiPen === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDivisiPen: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortDivisiPen === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDivisiPen: 'DESC',
                }));
                plag = 'DESC';
            }
        }

        const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            divisiJual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
            plag: plag,
            tipe: tipe,
        };

        const getListDataBukuBesar: any[] = await GetListDataBukuBesarSort(paramObject);
        setRecordsData(getListDataBukuBesar);
    };

    return (
        <div className="Main" id="main-target">
            <div>
                <div style={{ minHeight: '40px', marginTop: '-3px', marginBottom: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="flex">
                            <div style={{ width: '168px' }}>
                                <ContextMenuComponent
                                    id="cMenuCetak"
                                    ref={(scope) => (cMenuCetak = scope as ContextMenuComponent)}
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
                            <div
                                style={{
                                    width: '80%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '3.5vh',
                                }}
                            >
                                <div className="flex">
                                    <div style={{ width: '68px' }}>
                                        <h5 style={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '4.5vh' }}>No. Akun :</h5>
                                    </div>
                                    <div style={{ width: '96px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <input
                                            className={` container form-input`}
                                            style={{
                                                borderTopLeftRadius: 4,
                                                borderBottomLeftRadius: 4,
                                                borderTopRightRadius: 2,
                                                borderBottomRightRadius: 2,
                                                fontSize: 11,
                                                marginTop: 4,
                                                marginLeft: 2,
                                                borderColor: '#bfc9d4',
                                                padding: 5,
                                            }}
                                            value={stateDataHeader?.noAkunValue}
                                            onChange={(event) =>
                                                HandleModalInput(
                                                    event.target.value,
                                                    setStateDataHeader,
                                                    setDataDaftarAkunKredit,
                                                    kode_entitas,
                                                    setFilteredDataAkunKredit,
                                                    dataDaftarAkunKredit,
                                                    'noAkun'
                                                )
                                            }
                                            onFocus={(event) => event.target.select()}
                                            placeholder="<No Akun>"
                                        ></input>
                                    </div>
                                    <div style={{ width: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <input
                                            className={` container form-input`}
                                            style={{ borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', padding: 5 }}
                                            value={stateDataHeader?.namaAkunValue}
                                            onChange={(event) => {
                                                HandleModalInput(
                                                    event.target.value,
                                                    setStateDataHeader,
                                                    setDataDaftarAkunKredit,
                                                    kode_entitas,
                                                    setFilteredDataAkunKredit,
                                                    dataDaftarAkunKredit,
                                                    'namaAkun'
                                                );
                                            }}
                                            onFocus={(event) => event.target.select()}
                                            placeholder="<Nama Akun>"
                                        ></input>
                                    </div>
                                    <div style={{ width: '10%' }}>
                                        <button
                                            className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                            style={{ height: 33, marginLeft: 0, marginTop: 7 }}
                                            onClick={handleModalIcon}
                                        >
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                        </button>
                                    </div>
                                    {stateDataHeader?.viewTipe === 'Pendapatan' ||
                                    stateDataHeader?.viewTipe === 'Pendapatan Lain-lain' ||
                                    stateDataHeader?.viewTipe === 'HPP' ||
                                    stateDataHeader?.viewTipe === 'Beban' ||
                                    stateDataHeader?.viewTipe === 'Beban Lain-lain' ? (
                                        <>
                                            <div style={{ width: '111px', background: '#b4e7b4', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}>
                                                <h5 style={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '4.5vh' }}>
                                                    Divisi Penjualan :
                                                </h5>
                                            </div>
                                            <div style={{ width: '276px', background: '#b4e7b4', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                                                <div className="mt-1 flex justify-between">
                                                    <div className="container form-input">
                                                        <DropDownListComponent
                                                            id="divisiJual"
                                                            className="form-select"
                                                            dataSource={masterDivisi}
                                                            fields={{ text: 'nama_jual', value: 'kode_jual' }}
                                                            placeholder={stateDataHeader?.divisiJualDefault + ' | SEMUA DIVISI'}
                                                            headerTemplate={() => (
                                                                <div className={styles['dropdown-header']}>
                                                                    <table>
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ width: 65 }}>Kode Jual</th>
                                                                                <th>Nama Jual</th>
                                                                            </tr>
                                                                        </thead>
                                                                    </table>
                                                                </div>
                                                            )}
                                                            itemTemplate={(data: any) => (
                                                                <div className={styles['dropdown-item']}>
                                                                    <table style={{ border: 2 }}>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ width: '65px' }}>{data.kode_jual}</td>
                                                                                <td style={{ textAlign: 'left' }}>{data.nama_jual}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                            valueTemplate={(data: any) => (
                                                                <span style={{ display: 'flex', justifyContent: 'left', alignItems: 'flex-end', height: '2.4vh', fontSize: '12px' }}>
                                                                    {data ? data.kode_jual + ' | ' + data.nama_jual : '--Silahkan Pilih--'}
                                                                </span>
                                                            )}
                                                            change={(args: ChangeEventArgsDropDown) => {
                                                                const value: any = args.value;
                                                                HandleChangeDivisiJual(value, kode_entitas, token, stateDataHeader, setRecordsData, setStateDataHeader);
                                                            }}
                                                            // value={stateDataHeader?.divisiJualDefault}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ width: '111px', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}></div>
                                            <div style={{ width: '276px', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ml-3 mr-1" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                            Buku Besar
                        </span>
                    </div>
                </div>
                <div className="flex" style={{ marginTop: '-13px' }}>
                    <div style={{ width: '213px', textAlign: 'right' }}>
                        <h5 style={{ fontWeight: 'bold', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '-153px', height: '3.5vh' }}>Tanggal :</h5>
                    </div>
                    <div
                        style={{
                            width: '121px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '3.5vh',
                        }}
                    >
                        <div className="form-input mt-1 flex justify-between">
                            <DatePickerComponent
                                locale="id"
                                cssClass="e-custom-style"
                                // renderDayCell={onRenderDayCell}
                                enableMask={true}
                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                showClearButton={false}
                                format="dd-MM-yyyy"
                                value={stateDataHeader?.date1.toDate()}
                                change={(args: ChangeEventArgsCalendar) => {
                                    HandleTgl(moment(args.value), 'tanggalAwal', kode_entitas, token, stateDataHeader, setRecordsData, setStateDataHeader);
                                }}
                            >
                                <Inject services={[MaskedDateTime]} />
                            </DatePickerComponent>
                        </div>
                    </div>
                    <div
                        style={{
                            width: '2%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '3.5vh',
                        }}
                    >
                        <h5 style={{ fontWeight: 'bold', fontSize: 13 }}> s/d</h5>
                    </div>
                    <div
                        style={{
                            width: '121px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '3.5vh',
                        }}
                    >
                        <div className="form-input mt-1 flex justify-between">
                            <DatePickerComponent
                                locale="id"
                                cssClass="e-custom-style"
                                // renderDayCell={onRenderDayCell}
                                enableMask={true}
                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                showClearButton={false}
                                format="dd-MM-yyyy"
                                value={stateDataHeader?.date2.toDate()}
                                change={(args: ChangeEventArgsCalendar) => {
                                    HandleTgl(moment(args.value), 'tanggalAkhir', kode_entitas, token, stateDataHeader, setRecordsData, setStateDataHeader);
                                }}
                            >
                                <Inject services={[MaskedDateTime]} />
                            </DatePickerComponent>
                        </div>
                    </div>
                    <button
                        style={{
                            width: '90px',
                            marginLeft: 'auto',
                            backgroundColor: '#3b3f5c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '5px',
                            height: '26px',
                        }}
                        onClick={handleClickRefresh}
                    >
                        <FontAwesomeIcon icon={faRefresh} style={{ marginRight: '0.5em', width: '22px', height: '14px' }} />
                        Refresh
                    </button>
                </div>
                <div className="panel" style={{ height: '677px', background: '#dedede', marginTop: '15px' }}>
                    <div className="panel-data" style={{ width: '100%', height: '660px' }}>
                        <div className="e-content">
                            <GridComponent
                                id="gridListData"
                                locale="id"
                                // ref={(g) => (gridListData = g)}
                                dataSource={recordsData}
                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                allowPaging={true}
                                // allowSorting={true}
                                allowResizing={true}
                                // allowReordering={true}
                                pageSettings={{ pageSize: 100, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                rowHeight={22}
                                width={'100%'}
                                height={550}
                                rowSelected={handleRowSelected}
                                recordDoubleClick={handleClickPreview}
                                gridLines={'Both'}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="tgl_dokumen"
                                        headerText="Tanggal"
                                        headerTextAlign="Center"
                                        textAlign="Center"
                                        //autoFit
                                        width="90"
                                        headerTemplate={headerTanggal}
                                    />
                                    <ColumnDirective field="dokumen" headerText="Dok" headerTextAlign="Center" textAlign="Center" width="50" headerTemplate={headerDokumen} />
                                    <ColumnDirective field="no_dokumen" headerText="No. Referensi" headerTextAlign="Center" textAlign="Center" width="120" headerTemplate={headerNoRef} />
                                    <ColumnDirective
                                        field="catatan"
                                        headerText="Keterangan"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="370"
                                        clipMode="EllipsisWithTooltip"
                                        headerTemplate={headerKet}
                                    />

                                    <ColumnDirective field="debet" headerText="Debet" headerTextAlign="Center" textAlign="Right" width="110" headerTemplate={headerDebet} />

                                    <ColumnDirective field="kredit" headerText="Kredit" headerTextAlign="Center" textAlign="Right" width="110" headerTemplate={headerKredit} />
                                    <ColumnDirective
                                        field="saldo_kumulatif"
                                        headerText="Saldo Kumulatif"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        width="150"
                                        template={(args: any) => <div style={parseFloat(args.saldo_kumulatif) < 0 ? { color: 'red' } : {}}>{args.saldo_kumulatif}</div>}
                                        headerTemplate={headerSaldoKum}
                                    />
                                    <ColumnDirective
                                        field="subledger"
                                        headerText="Akun Pembantu (Subledger)"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="200"
                                        clipMode="EllipsisWithTooltip"
                                        headerTemplate={headerSub}
                                    />
                                    <ColumnDirective field="no_dept" headerText="Departemen" headerTextAlign="Center" textAlign="Left" width="150" headerTemplate={headerDept} />
                                    <ColumnDirective field="nama_kry" headerText="Nama Karyawan" headerTextAlign="Center" textAlign="Left" width="150" headerTemplate={headerNamaKar} />
                                    <ColumnDirective field="kode_jual" headerText="Divisi Penjualan" headerTextAlign="Center" textAlign="Left" width="100" headerTemplate={headerDivisiJual} />
                                </ColumnsDirective>
                                <AggregatesDirective>
                                    <AggregateDirective>
                                        <AggregateColumnsDirective>
                                            <AggregateColumnDirective field="catatan" type="Custom" customAggregate={TotDebKre} footerTemplate={CustomTotDebKre} />
                                            <AggregateColumnDirective field="debet" type="Custom" customAggregate={SumDebet} footerTemplate={CustomSumDeb} />
                                            <AggregateColumnDirective field="kredit" type="Custom" customAggregate={SumKredit} footerTemplate={CustomSumKre} />
                                            <AggregateColumnDirective field="saldo_kumulatif" type="Custom" customAggregate={SumSaldoKumulatif} footerTemplate={CustomSumSaldoKumulatif} />
                                        </AggregateColumnsDirective>
                                    </AggregateDirective>
                                </AggregatesDirective>
                                <Inject services={[Aggregate, Page, Selection, Edit, Sort, Group, Filter, Resize]} />
                            </GridComponent>
                        </div>

                        {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                        <ContextMenuComponent id="contextmenu" target=".e-gridheader" animationSettings={{ duration: 800, effect: 'FadeIn' }} />
                    </div>
                </div>
                {/*==================================================================================================*/}
                {/*=================================== Modal dialog untuk Akun Kredit =============================*/}
                {/*==================================================================================================*/}
                <DialogDaftarAkunKredit
                    visible={stateDataHeader?.dialogDaftarAkunKreditVisible}
                    stateDataHeader={stateDataHeader}
                    setStateDataHeader={setStateDataHeader}
                    // dataDaftarAkunKredit={dataDaftarAkunKreditRef.current}
                    dataDaftarAkunKredit={dataDaftarAkunKredit}
                    filteredDataAkunKredit={filteredDataAkunKredit}
                    swalToast={swalToast}
                    HandleSearchNoAkun={HandleSearchNoAkun}
                    HandleSearchNamaAkun={HandleSearchNamaAkun}
                    TemplateNoAkun={TemplateNoAkun}
                    TemplateNamaAkun={TemplateNamaAkun}
                    setFilteredDataAkunKredit={setFilteredDataAkunKredit}
                    setRecordsData={setRecordsData}
                    kode_entitas={kode_entitas}
                    token={token}
                    vRefreshData={vRefreshData.current}
                />
                {/*==================================================================================================*/}
            </div>

            {/* Dialog PPI */}
            {listStateData.tipeDialog === 'Tunai' ? (
                <DialogPpiListTunai
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan={listStateData.selectedModalJenisPenerimaan}
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : listStateData.tipeDialog === 'Transfer' ? (
                <DialogPpiListTransfer
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan={listStateData.selectedModalJenisPenerimaan}
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : listStateData.tipeDialog === 'Warkat' ? (
                <DialogPpiListWarkat
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan={listStateData.selectedModalJenisPenerimaan}
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : listStateData.tipeDialog === 'Pencairan' || listStateData.tipeDialog === 'Ciar' || listStateData.tipeDialog === 'Edit Pencairan' ? (
                <DialogPencairanWarkat
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan={listStateData.selectedModalJenisPenerimaan}
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : listStateData.tipeDialog === 'Penolakan' || listStateData.tipeDialog === 'Tolak' || listStateData.tipeDialog === 'Edit Penolakan' ? (
                <DialogPenolakanWarkat
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan={listStateData.selectedModalJenisPenerimaan}
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : (
                <DialogPembatalanWarkat
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan={listStateData.selectedModalJenisPenerimaan}
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            )}
            {/* Dialog BM */}
            {modalHandleDataBM && (
                <DialogCreateBM
                    userid={userid}
                    kode_entitas={kode_entitas}
                    isOpen={modalHandleDataBM}
                    onClose={() => {
                        setModalHandleDataBM(false);
                        setStatusPage('');
                    }}
                    kode_user={kode_user}
                    onRefresh={handleRefreshData}
                    kode_bm={selectedRow}
                    statusPage={statusPage}
                    selectedRowStatus={selectedRowStatus}
                    isFilePendukung={isFilePendukung}
                    isApprovedData={isApprovedData}
                    token={token}
                    dataListMutasibank="Y"
                    onRefreshTipe={0}
                />
            )}

            {/* Dialog BK */}
            <FrmPraBkk
                stateDokumen={stateDokumen}
                isOpen={dialogInputDataVisible}
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
            {/* Dialog JU */}
            {modalJurnalUmum && (
                <ModalJurnalUmumProps
                    userid={userid}
                    kode_entitas={kode_entitas}
                    isOpen={modalJurnalUmum}
                    onClose={() => {
                        setModalJurnalUmum(false);
                    }}
                    kode_user={kode_user}
                    status_edit={statusEdit}
                    kode_ju_edit={selectedRowKode}
                    onRefresh={handleRefreshData}
                    token={token}
                    plag="bukuBesar"
                />
            )}

            {/* Dialog PHU */}
            {listStateData.tipeDialogPhu === 'Tunai' ? (
                <DialogPhuList
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisiblePhu}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisiblePhu: false,
                        }));
                        handleRefreshData();
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag="bukuBesar"
                />
            ) : listStateData.tipeDialogPhu === 'Transfer' ? (
                <DialogPhuListTransfer
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisiblePhu}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisiblePhu: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag="bukuBesar"
                    token={token}
                />
            ) : listStateData.tipeDialogPhu === 'Warkat' ? (
                <DialogPhuListWarkat
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisiblePhu}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisiblePhu: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag="bukuBesar"
                />
            ) : listStateData.tipeDialogPhu === 'Pencairan' ? (
                <DialogPencairanWarkatPhu
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisiblePhu}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisiblePhu: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag="bukuBesar"
                    token={token}
                />
            ) : listStateData.tipeDialogPhu === 'Penolakan' ? (
                <DialogPenolakanWarkatPhu
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisiblePhu}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisiblePhu: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag="bukuBesar"
                />
            ) : (
                <DialogPembatalanWarkatPhu
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={''}
                    isOpen={listStateData.dialogInputDataVisiblePhu}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisiblePhu: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    tipeBatal={listStateData.tipeBatal}
                    plag="bukuBesar"
                />
            )}
        </div>
    );
};

// export { getServerSideProps };

export default ReportList;
