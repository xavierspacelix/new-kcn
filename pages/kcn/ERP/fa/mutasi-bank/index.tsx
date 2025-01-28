import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { SidebarComponent, SidebarType } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar } from '@syncfusion/ej2-react-calendars';
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
    Freeze,
    ExcelExport,
    PdfExport,
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
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
// import { getServerSideProps } from '@/pages/api/getServerSide';
import styles from '@styles/index.module.css';
import { frmNumber, generateNU, showLoading, usersMenu } from '@utils/global/fungsi';
import Draggable from 'react-draggable';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useSession } from '@/pages/api/sessionContext';
import DialogDaftarAkunKredit from './modal/DialogDaftarAkunKredit';
import {
    ClickViewDaftarAkun,
    HandleClickTabs,
    handleModalDaftarAkun,
    handleModalDaftarAkunList,
    ListTabNoRek,
    SelectedRowsData,
    ShowNewRecord,
    swalDialog,
    swalPopUp,
} from '@/lib/fa/mutasi-bank/functional/fungsiForm';
import { GetCekPenerimaanWarkatDialog, GetListMutasiBank, GetListTabNoRek, PatchReleaseCloseApiBank, UpdateCatatanMutasiBank } from '@/lib/fa/mutasi-bank/api/api';
import { Tab } from '@headlessui/react';
import DialogPpiListTransfer from '../ppi/component/dialogPpiListTransfer';
import DialogDaftarPenerimaan from './modal/DialogDaftarPenerimaan';
import DialogPencairanWarkat from '../ppi/component/dialogPencairanWarkat';
import DialogPencairanWarkatPhu from '../phu/component/dialogPencairanWarkat';
import DialogCreateBM from '../bm/component/DialogCreateBM';
import DialogCreateBMPOS from '../bm/component/DialogCreateBMPOS';
// import { BtnClickApiBank, HandleProsesPosting } from './interface/template';
import template from '@utils/fa/mutasi-bank/interface/fungsi';
import DialogPhuListTransfer from '../phu/component/dialogPhuListTransfer';
import DialogDaftarPenerimaanPhu from './modal/DialogDaftarPenerimaanPhu';
import FrmPraBkk from '../bkk/component/frmPraBkk';
const { BtnClickApiBank, HandleProsesPosting } = template;

enableRipple(true);

const MutasiBankViaApi = () => {
    // let kode_entitas : any, token: any ;
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const nip = sessionData?.nip ?? '';
    const kode_user = sessionData?.nip ?? '';
    const entitas = sessionData?.entitas ?? '';
    const token = sessionData?.token ?? '';

    // ================== State untuk filter data list ===============================
    const [filterData, setFilterData] = useState({
        date1: moment(), // tanggal awal PPI
        date2: moment().endOf('month'), // tanggal akhir PPI
        selectedOptionMutasiTransaksi: 'semua',
        selectedOptionPostingRekonsil: 'tidak',
        selectedOptionTipeDokumen: 'semua',
        noAkunValue: '',
        namaAkunValue: '',
        kodeAkunValue: '',
        bankValue: '',
        noRekValue: '',
        namaPemilikValue: '',
        keteranganValue: '',
        namaCustomerValue: '',

        searchNoAkun: '',
        searchNamaAkun: '',
        searchKeywordNamaAkun: '',
        searchKeywordNoAkun: '',

        tipeFocusOpen: '',
    });
    // End
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '', tipe: '' });
    const kode_menu = '60206'; // kode menu TTP

    // ================== State untuk filter data list yang berupa checkbox ===============================
    const [checkboxFilter, setCheckboxFilter] = useState({
        isTanggalChecked: true,
        isNamaCustChecked: false,
        isNoNamaAkunChecked: false,
        isBankChecked: false,
        isNoRekChecked: false,
        isNamaPemilikChecked: false,
        isKeteranganChecked: false,
    });
    // End

    // ================== State untuk all list data ===============================
    const [listStateData, setListStateData] = useState({
        plagListAlokasiDana: false,
        plagKodeDokumen: '',
        appCetakUlang: '',
        cetakUlang: '',
        appBatal: '',
        batal: '',
        noTtp: '',
        kodeDokumen: '',
        filegambarCetakUlang: '',
        filegambarBatal: '',
        ketCetakUlang: '',
        ketBatal: '',
        plagFilePendukung: false,
        plagEditDialogTtp: false,
        jmlFaktur: '',
        plagJmlFaktur: 'header',
        plagTipe: '',
        clickDaftarMutasi: false,
        kodeSales: '',
        kodeCust: '',
        jmlTitipan: '',
        nilaiTitipan: '',
        nilaiTunai: '',
        namaRelasi: '',

        nilaiTransfer: '',
        nilaiWarkat: '',
        noRek: '',
        tglAwal: '',
        tglAkhir: '',
        idDok: '',

        // Terbaru
        plagViewModalDaftarAkun: false,
        plagViewModalPostingRekonsil: false,
        plagViewModalPostingRekonsilDB: false,
        selectedModalJenisTransaksi: '',
        plagViewModalDaftarPenerimaan: false,
        plagViewModalDaftarPenerimaanPhu: false,

        masterDataState: '',
        masterKodeDokumen: '',
        dialogInputDataVisible: false,
        dialogFilterJenisPenerimaan: false,
        tipeDialog: '',

        tglTransaksiMutasi: '',
        jumlahMu: '',
        tipeApi: 'API',
        noRekeningApi: '',
        description: '',
        apiId: '',
        apiPending: '',
    });
    // End
    let sidebarObj: SidebarComponent;
    let type: SidebarType = 'Push';
    let mediaQueryState: string = '(min-width: 600px)';

    // ================================================================================================
    // State Baru Untuk TTP
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
        tipe: any;
    }

    //end

    type TTPListItem = {
        kode_dokumen: string;
        dokumen: string;
        no_dokumen: any;
        tgl_dokumen: any;
    };

    const [stateDataArray, setStateDataArray] = useState<{
        dataDaftarAkunKredit: any[];
        filteredDataAkunKredit: any[];
        dataDaftarPenerimaanWarkat: any[];
    }>({
        dataDaftarAkunKredit: [],
        filteredDataAkunKredit: [],
        dataDaftarPenerimaanWarkat: [],
    });
    const refDataArray = useRef<{
        dataDaftarAkunKreditRef: any[];
    }>({
        dataDaftarAkunKreditRef: [],
    });

    const [recordsData, setRecordsData] = useState<TTPListItem[]>([]);
    const recordsDataRef = useRef<TTPListItem[]>([]);

    const styleButton = { width: 67 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonApp = { width: 126 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };

    // ================ Menentukan Tanggal =========================================
    // Menentukan tanggal awal bulan
    const tanggalSekarang = moment();
    // Menentukan tanggal akhir bulan dengan moment.js
    const tanggalAwalBulan = tanggalSekarang.startOf('month');
    const tanggalHariIni = moment(new Date()).format('YYYY-MM-DD');
    const tanggalAkhirBulan = moment(tanggalAwalBulan.endOf('month')).format('YYYY-MM-DD');
    // End

    const vRefreshData = useRef(0);
    const gridListData = useRef<GridComponent>(null);
    const [tabs, setTabs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState(0); // State untuk menyimpan index tab aktif
    const [isFilePendukungPPI, setisFilePendukungPPI] = useState<any>('');

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    //=========== State untuk sidebar filter dan body ===============
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

    const [modalHandleDataBMPOS, setModalHandleDataBMPOS] = useState(false);
    const [statusPagePOS, setStatusPagePOS] = useState('');
    const [baru, setBaru] = useState(false);
    const [modalHandleDataBM, setModalHandleDataBM] = useState(false);
    const [statusPage, setStatusPage] = useState('');

    const [tabIndex, setTabIndex] = useState('Semua');
    const gridKey = `${JSON.stringify(recordsDataRef.current)}`;
    const selectedModalJenisTransaksi = useRef('');
    const [paramObjectDaftarPenerimaan, setParamObjectDaftarPenerimaan] = useState({
        tglTransaksiMutasi: '',
        jumlahMu: '',
        tipeApi: 'API',
        noRekeningApi: '',
        description: '',
        apiId: '',
        apiPending: '',
        dokumen: 'PU',
        token: token,
        kode_entitas: '',
    });

    const [paramObjectDaftarPenerimaanPhu, setParamObjectDaftarPenerimaanPhu] = useState({
        tglTransaksiMutasi: '',
        jumlahMu: '',
        tipeApi: 'API',
        noRekeningApi: '',
        description: '',
        apiId: '',
        apiPending: '',
        dokumen: 'BB',
        token: token,
        kode_entitas: '',
    });

    //========== param Object untuk Fungsi =========================
    const prevDataSelectedRef = useRef({
        kode_dokumen: '',
        dokumen: '',
        no_dokumen: '',
        selectType: '',
        selectReconcil: '',
        tglTransaksiMutasi: '',
        jumlahMu: '',
        tipeApi: '',
        noRekeningApi: '',
        description: '',
        apiId: '',
        apiPending: '',
    });

    const [jenisUpdateBKK, setJenisUpdateBKK] = useState(0);
    const [CON_BKK, setCON_BKK] = useState<string>('BKK');
    const [masterKodeDokumen, setMasterKodeDokumen] = useState<string>('BARU');
    const [masterDataState, setMasterDataState] = useState<string>('');
    const [jenisTab, setJenisTab] = useState('Baru');
    const [isFilePendukungBk, setIsFilePendukungBk] = useState('N');
    const [modalPositionCatatan, setModalPositionCatatan] = useState({ top: '30%', right: '30%', width: '30%', background: '#dedede' });
    const [plagCatatan, setPlagCatatan] = useState(false);
    const [catatanInput, setCatatanInput] = useState('');
    const [kodeDokumen, setKodeDokumen] = useState('');
    const [tglDokumen, setTglDokumen] = useState('');
    const [noRek, setNoRek] = useState('');

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

    const handleRefreshData = async () => {
        vRefreshData.current += 1;

        await showLoading1(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                let vTglAwal = 'all'; //tanggalHariIni
                let vTglAkhir = 'all'; //tanggalAkhirBulan
                let vRekAkunKas = 'all';
                let vBank = 'all';
                let vNoRek = 'all';
                let vNamaPemilik = 'all';
                let vKeterangan = 'all';
                let vNamaCust = 'all';
                let vMutasiTransaksi = 'all';
                let vPostingRekonsil = 'all';
                let vTipeDok = 'all';
                let vNoRekTab = 'all';

                if (checkboxFilter.isTanggalChecked) {
                    const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
                    const formattedDate2 = filterData.date2.format('YYYY-MM-DD');
                    vTglAwal = `${formattedDate1}`;
                    vTglAkhir = `${formattedDate2}`;
                }

                if (checkboxFilter.isNoNamaAkunChecked) {
                    vRekAkunKas = `${filterData.kodeAkunValue}`;
                }

                if (checkboxFilter.isBankChecked) {
                    vBank = `${filterData.bankValue}`;
                }

                if (checkboxFilter.isNoRekChecked) {
                    vNoRek = `${filterData.noRekValue}`;
                }

                if (checkboxFilter.isNamaPemilikChecked) {
                    vNamaPemilik = `${filterData.namaPemilikValue}`;
                }

                if (checkboxFilter.isKeteranganChecked) {
                    vKeterangan = `${filterData.keteranganValue}`;
                }

                if (checkboxFilter.isNamaCustChecked) {
                    vNamaCust = `${filterData.namaCustomerValue}`;
                }

                if (filterData.selectedOptionMutasiTransaksi === 'semua') {
                    vMutasiTransaksi = 'all';
                } else if (filterData.selectedOptionMutasiTransaksi === 'keluarDb') {
                    vMutasiTransaksi = 'DB';
                } else if (filterData.selectedOptionMutasiTransaksi === 'masukCr') {
                    vMutasiTransaksi = 'CR';
                }

                if (filterData.selectedOptionPostingRekonsil === 'semua') {
                    vPostingRekonsil = 'all';
                } else if (filterData.selectedOptionPostingRekonsil === 'ya') {
                    vPostingRekonsil = '0';
                } else if (filterData.selectedOptionPostingRekonsil === 'tidak') {
                    vPostingRekonsil = '1';
                }

                if (filterData.selectedOptionTipeDokumen === 'semua') {
                    vTipeDok = 'all';
                } else if (filterData.selectedOptionTipeDokumen === 'pu') {
                    vTipeDok = 'PU';
                } else if (filterData.selectedOptionTipeDokumen === 'bb') {
                    vTipeDok = 'BB';
                } else if (filterData.selectedOptionTipeDokumen === 'bk') {
                    vTipeDok = 'BK';
                } else if (filterData.selectedOptionTipeDokumen === 'bm') {
                    vTipeDok = 'BM';
                }

                let paramObject = {
                    kode_entitas: kode_entitas,
                    token: token,
                    tgl_awal: vTglAwal,
                    tgl_akhir: vTglAkhir,
                    bank: vBank,
                    no_rek: vNoRek,
                    nama_pemilik: vNamaPemilik,
                    keterangan: vKeterangan,
                    nama_cust: vNamaCust,
                    rek_akun_kas: vRekAkunKas,
                    mutasi_transaksi: vMutasiTransaksi,
                    posting_rekonsil: vPostingRekonsil,
                    tipe_dok: vTipeDok,
                    no_rek_tab: vNoRekTab,
                };

                const responseData = await GetListMutasiBank(paramObject);

                const responseDataFix = responseData.map((item: any) => ({
                    ...item,
                    amount: parseFloat(item.amount),
                }));

                if (activeTab === 0) {
                    setRecordsData(responseDataFix);
                    recordsDataRef.current = responseDataFix;
                    showLoading1(false);
                } else {
                    const filteredData = responseDataFix.filter((item: any) => item.account_number === tabIndex);
                    setRecordsData(filteredData);
                    recordsDataRef.current = filteredData;
                    showLoading1(false);
                }
                // if (gridListData.current) {
                //     gridListData.current.clearSelection();
                // }

                gridListData.current?.setProperties({ dataSource: responseDataFix });
                gridListData.current?.refresh();
                return responseDataFix;
            } catch (error) {
                console.error(error);
            }
        }
    };

    const refreshData = async () => {
        let vTglAwal = tanggalHariIni; //tanggalHariIni
        let vTglAkhir = tanggalAkhirBulan; //tanggalAkhirBulan
        // let vTglAwal = 'all'; //tanggalHariIni
        // let vTglAkhir = 'all'; //tanggalAkhirBulan
        let vBank = 'all';
        let vNoRek = 'all';
        let vNamaPemilik = 'all';
        let vKeterangan = 'all';
        let vNamaCust = 'all';
        let vRekAkunKas = 'all';
        let vMutasiTransaksi = 'all';
        let vPostingRekonsil = 'all';
        let vTipeDok = 'all';
        let vNoRekTab = 'all';

        if (checkboxFilter.isTanggalChecked) {
            const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
            const formattedDate2 = filterData.date2.format('YYYY-MM-DD 23:59:59');
            vTglAwal = `${formattedDate1}`;
            vTglAkhir = `${formattedDate2}`;
        }

        let paramObject = {
            kode_entitas: kode_entitas,
            token: token,
            tgl_awal: vTglAwal,
            tgl_akhir: vTglAkhir,
            bank: vBank,
            no_rek: vNoRek,
            nama_pemilik: vNamaPemilik,
            keterangan: vKeterangan,
            nama_cust: vNamaCust,
            rek_akun_kas: vRekAkunKas,
            mutasi_transaksi: vMutasiTransaksi,
            posting_rekonsil: vPostingRekonsil,
            tipe_dok: vTipeDok,
            no_rek_tab: vNoRekTab,
        };

        const responseData = await GetListMutasiBank(paramObject);
        const responseDataFix = responseData.map((item: any) => ({
            ...item,
            amount: parseFloat(item.amount),
        }));
        setRecordsData(responseDataFix);
        recordsDataRef.current = responseDataFix;
    };

    const handleParamsObject = {
        kode_entitas: kode_entitas,
        token: token,
        userid: userid,
        entitas: entitas,
        vRefreshData: vRefreshData,
        setListStateData,
        setFilterData,
        setCheckboxFilter,
        setStateDataArray,
        prevDataSelectedRef: prevDataSelectedRef,
        tipe: '',
        valueObject: null,

        // Fungsi Click Tab Header List
        setTabIndex,
        setActiveTab,
        setRecordsData,
        recordsDataRef: recordsDataRef,

        // Fungsi showNewRecord
        setParamObjectDaftarPenerimaan,
        setParamObjectDaftarPenerimaanPhu,
        selectedModalJenisTransaksi,

        additionalData: [],

        handleRefreshData,
        setTabs,

        // BM
        setModalHandleDataBMPOS,
        setModalHandleDataBM,
        setStatusPagePOS,
        setBaru,
        setStatusPage,

        //BK
        setMasterDataState,
        setMasterKodeDokumen,
        setJenisUpdateBKK,
        setCON_BKK,
        setIsFilePendukungBk,
    };

    useEffect(() => {
        if (!isLoading && token && kode_entitas && userid && kode_user && entitas) {
            // Lakukan pemanggilan logika lain di sini
            refreshData();
            ListTabNoRek(handleParamsObject);
        }
    }, [isLoading, token, kode_entitas, userid, kode_user, entitas]);

    const [windowHeight, setWindowHeight] = useState(0);
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            if (window.innerWidth < 800) {
                setSidebarVisible(false);
            } else {
                setSidebarVisible(true);
            }
        };

        if (typeof window !== 'undefined') {
            setWindowHeight(window.innerHeight);
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    if (isLoading) {
        return;
    }
    // ============================================================================================
    //= END

    // ================== Funsgi Reload untuk Responsive sidebar filter ==========================

    const onCreate = () => {
        sidebarObj.element.style.visibility = '';
    };
    const toggleClick = () => {
        setSidebarVisible(true);
    };
    const closeClick = () => {
        setSidebarVisible(false);
    };
    // End

    let keyLoadListSemua: any;

    // ============= Fungsi Show Loading =========================
    async function showLoading1(closeWhenDataIsFulfilled: boolean) {
        if (closeWhenDataIsFulfilled) {
            swal.fire({
                padding: '3em',
                imageUrl: '/assets/images/loader-1.gif',
                imageWidth: 170,
                imageHeight: 170,
                imageAlt: 'Custom image',
                background: 'rgba(0,0,0,.0)',
                backdrop: 'rgba(0,0,0,0.0)',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        } else {
            swal.close(); // Menutup tampilan loading
        }
    }
    // End
    let textareaObj: any;
    const editTemplateCatatanMutasi = (props: any) => {
        return (
            <div onClick={() => clickCatatanMutasi(props)} className="col-xs-6 col-sm-6 col-lg-6 col-md-6 flex justify-end" style={{ paddingRight: '0px' }}>
                <input readOnly={true} id={`catatanInput${props.id}`} value={props.catatan} style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}></input>
            </div>
        );
    };

    const clickCatatanMutasi = (props: any) => {
        console.log('props = ', props);
        setPlagCatatan(true);
        setCatatanInput(props.catatan);
        setKodeDokumen(props.id);
        setTglDokumen(props.valuta), setNoRek(props.account_number);
    };

    const closeModalCatatan = () => {
        setPlagCatatan(false);
    };

    const simpanUpdateCatatan = async () => {
        const paramObject = {
            entitas: kode_entitas,
            id: kodeDokumen,
            catatan: catatanInput,
            token: token,
        };

        const response = await UpdateCatatanMutasiBank(paramObject);
        const result = response;
        const status = result.status;
        const errormsg = result.serverMessage;

        if (status !== true) {
            withReactContent(swalDialog).fire({
                title: ``,
                html: errormsg,
                icon: 'warning',
                width: '20%',
                heightAuto: true,
                showConfirmButton: true,
                confirmButtonText: 'Ok',
            });
        } else {
            setPlagCatatan(false);
            await withReactContent(swalPopUp).fire({
                icon: 'success',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Catatan Berhasil di EDIT.</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                heightAuto: true,
                timer: 2000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            const ket1 = document.getElementById(`catatanInput${kodeDokumen}`) as HTMLInputElement;
            if (ket1) {
                ket1.value = catatanInput;
            }
        }
    };
    return (
        <div className="Main" id="main-target">
            {/*==================================================================================================*/}
            {/*================================ Tampilan utama Tanda Terima Barang =============================*/}
            {/*==================================================================================================*/}
            <div>
                <div style={{ minHeight: '40px', marginTop: '-19px', marginBottom: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
                            <TooltipComponent content="Edit data penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                <TooltipComponent content="Hapus data penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnApproval">
                                    <ButtonComponent
                                        id="btnFilter"
                                        cssClass="e-primary e-small"
                                        style={sidebarVisible ? { width: '57px', height: '28px', marginBottom: '0.5em', marginTop: '0.5em', marginRight: '0.8em' } : { ...styleButton, color: 'white' }}
                                        // disabled={disabledFilter}
                                        disabled={sidebarVisible}
                                        //onClick={showFilterData}
                                        onClick={toggleClick}
                                        content="Filter"
                                    ></ButtonComponent>

                                    {/* <ButtonComponent id="btnEdit" cssClass="e-primary e-small" style={styleButton} disabled={disabledEdit} onClick={handleEditTtp} content="Edit TTP"></ButtonComponent> */}
                                    {userid === 'administrator' || entitas === '898' ? (
                                        <>
                                            <ButtonComponent
                                                id="btnReleaseApiBank"
                                                cssClass="e-primary e-small"
                                                style={styleButtonApp}
                                                disabled={false}
                                                onClick={() => {
                                                    const mergerObject = {
                                                        ...handleParamsObject,
                                                        tipe: 'RELEASE',
                                                    };
                                                    BtnClickApiBank(mergerObject);
                                                }}
                                                content="Release API Bank"
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                id="btnCloseApiBank"
                                                cssClass="e-primary e-small"
                                                style={styleButtonApp}
                                                disabled={false}
                                                onClick={() => {
                                                    const mergerObject = {
                                                        ...handleParamsObject,
                                                        tipe: 'CLOSE',
                                                    };
                                                    BtnClickApiBank(mergerObject);
                                                }}
                                                content="Close API Bank"
                                            ></ButtonComponent>
                                        </>
                                    ) : (
                                        <>
                                            <ButtonComponent
                                                id="btnReleaseApiBank"
                                                cssClass="e-primary e-small"
                                                style={{ width: 126 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em' }}
                                                disabled={true}
                                                onClick={() => {
                                                    const mergerObject = {
                                                        ...handleParamsObject,
                                                        tipe: 'RELEASE',
                                                    };
                                                    BtnClickApiBank(mergerObject);
                                                }}
                                                content="Release API Bank"
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                id="btnCloseApiBank"
                                                cssClass="e-primary e-small"
                                                style={{ width: 126 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em' }}
                                                disabled={true}
                                                onClick={() => {
                                                    const mergerObject = {
                                                        ...handleParamsObject,
                                                        tipe: 'CLOSE',
                                                    };
                                                    BtnClickApiBank(mergerObject);
                                                }}
                                                content="Close API Bank"
                                            ></ButtonComponent>
                                        </>
                                    )}
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Posting \ Rekonsil"
                                        style={{ backgroundColor: '#b3b3b3', marginLeft: '25px', color: 'black', fontWeight: 'bold' }}
                                        onClick={() => {
                                            HandleProsesPosting(handleParamsObject);
                                        }}
                                        // onClick={post}
                                    />
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </div>
                    <div className="ml-3 mr-1" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                            Mutasi Bank Via API
                        </span>
                    </div>
                </div>

                <div id="main-content" style={{ display: 'flex', gap: '3px', position: 'sticky', overflow: 'hidden' }}>
                    <SidebarComponent
                        id="default-sidebar"
                        target={'#main-content'}
                        ref={(Sidebar) => (sidebarObj = Sidebar as SidebarComponent)}
                        // style={{ background: 'transparent', visibility: 'hidden', marginRight: '0.8em' }}
                        style={{
                            background: '#dedede',
                            marginRight: '0.8em',
                            display: 'block',
                            visibility: sidebarVisible ? 'visible' : 'hidden',
                            // maxHeight: `100px`,
                            overflowY: 'auto',
                        }}
                        created={onCreate}
                        //showBackdrop={showBackdrop}
                        type={type}
                        width="310px"
                        height={200}
                        mediaQuery={mediaQueryState}
                        isOpen={true}
                        open={() => setSidebarVisible(true)}
                        close={() => setSidebarVisible(false)}
                        enableGestures={false}
                    >
                        {/* ===============  Filter Data ========================   */}
                        {/* {disabledFilter && ( */}
                        <div
                            className="panel-filter"
                            style={listStateData.plagListAlokasiDana === false ? { background: '#dedede', width: '100%' } : { background: '#dedede', width: '100%', height: '670px' }}
                        >
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
                            <div className="mb-5 mt-3 h-px w-full border-b border-black dark:border-[#1b2e4b]"></div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Tanggal"
                                    checked={checkboxFilter.isTanggalChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isTanggalChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                <div className="form-input mt-1 flex justify-between">
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={filterData.date1.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isTanggalChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                date1: moment(args.value),
                                            }));
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                                <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s\d</p>
                                <div className="form-input mt-1 flex justify-between">
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={filterData.date2.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isTanggalChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                date2: moment(args.value),
                                            }));
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Nomor dan Nama Akun Kas"
                                    checked={checkboxFilter.isNoNamaAkunChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoNamaAkunChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input" style={{ width: 244, marginLeft: 0 }}>
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noAkunValue}
                                        input={(args: FocusInEventArgs) => {
                                            const valueObject: any = args.value;
                                            const tipe = 'noAkun';
                                            const mergerObject = {
                                                ...handleParamsObject,
                                                tipe: tipe,
                                                valueObject: valueObject,
                                            };
                                            handleModalDaftarAkunList(mergerObject);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.namaAkunValue}
                                        input={(args: FocusInEventArgs) => {
                                            const valueObject: any = args.value;
                                            const tipe = 'namaAkun';
                                            const mergerObject = {
                                                ...handleParamsObject,
                                                tipe: tipe,
                                                valueObject: valueObject,
                                            };

                                            handleModalDaftarAkunList(mergerObject);
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        ClickViewDaftarAkun(handleParamsObject);
                                    }}
                                >
                                    <button
                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                        style={{ height: 37, marginLeft: 0, background: 'transparent', borderColor: 'transparent' }}
                                    >
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Bank"
                                    checked={checkboxFilter.isBankChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isBankChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.bankValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isBankChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                bankValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Rekening"
                                    checked={checkboxFilter.isNoRekChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoRekChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noRekValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isNoRekChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                noRekValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Nama Pemilik"
                                    checked={checkboxFilter.isNamaPemilikChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNamaPemilikChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.namaPemilikValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isNamaPemilikChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                namaPemilikValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Keterangan"
                                    checked={checkboxFilter.isKeteranganChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isKeteranganChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.keteranganValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isKeteranganChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                keteranganValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Nama Customer"
                                    checked={checkboxFilter.isNamaCustChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNamaCustChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.namaCustomerValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isNamaCustChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                namaCustomerValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Mutasi Transaksi</span>
                                </div>
                            </div>
                            <div className="mt-1">
                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="MutasiTransaksi"
                                        id="keluarDb"
                                        className="form-radio"
                                        checked={filterData.selectedOptionMutasiTransaksi === 'keluarDb'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionMutasiTransaksi: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="keluarDb" className="mb-0.5 ml-1" style={{ fontSize: 11 }}>
                                        Keluar (DB)
                                    </label>
                                </div>

                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="MutasiTransaksi"
                                        id="masukCr"
                                        className="form-radio"
                                        checked={filterData.selectedOptionMutasiTransaksi === 'masukCr'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionMutasiTransaksi: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="masukCr" className="mb-0.5  ml-1" style={{ fontSize: 11 }}>
                                        Masuk (CR)
                                    </label>
                                </div>

                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="MutasiTransaksi"
                                        id="semua"
                                        className="form-radio"
                                        checked={filterData.selectedOptionMutasiTransaksi === 'semua'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionMutasiTransaksi: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="semua" className="mb-0.5  ml-1" style={{ fontSize: 11 }}>
                                        Semua
                                    </label>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Posting / Rekonsiliasi</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="PostingRekonsil"
                                    id="ya"
                                    className="form-radio"
                                    checked={filterData.selectedOptionPostingRekonsil === 'ya'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPostingRekonsil: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="PostingRekonsil"
                                    id="tidak"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionPostingRekonsil === 'tidak'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPostingRekonsil: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="tidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="PostingRekonsil"
                                    id="semua"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionPostingRekonsil === 'semua'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPostingRekonsil: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="semua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Tipe Dokumen</span>
                                </div>
                            </div>
                            <div className="mt-1">
                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="TipeDokumen"
                                        id="pu"
                                        className="form-radio"
                                        checked={filterData.selectedOptionTipeDokumen === 'pu'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionTipeDokumen: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="pu" className="mb-0.5 ml-1" style={{ fontSize: 11 }}>
                                        PU (PPI)
                                    </label>
                                </div>

                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="TipeDokumen"
                                        id="bb"
                                        className="form-radio"
                                        checked={filterData.selectedOptionTipeDokumen === 'bb'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionTipeDokumen: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="bb" className="mb-0.5  ml-1" style={{ fontSize: 11 }}>
                                        BB (PHU)
                                    </label>
                                </div>

                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="TipeDokumen"
                                        id="bk"
                                        className="form-radio"
                                        checked={filterData.selectedOptionTipeDokumen === 'bk'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionTipeDokumen: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="bk" className="mb-0.5  ml-1" style={{ fontSize: 11 }}>
                                        BK (BKK)
                                    </label>
                                </div>

                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="TipeDokumen"
                                        id="bm"
                                        className="form-radio"
                                        checked={filterData.selectedOptionTipeDokumen === 'bm'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionTipeDokumen: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="bm" className="mb-0.5  ml-1" style={{ fontSize: 11 }}>
                                        BM (BKM)
                                    </label>
                                </div>

                                <div className="mb-0.5 flex items-center">
                                    <input
                                        type="radio"
                                        name="TipeDokumen"
                                        id="semua"
                                        className="form-radio"
                                        checked={filterData.selectedOptionTipeDokumen === 'semua'}
                                        onChange={(event) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                selectedOptionTipeDokumen: event.target.id,
                                            }));
                                        }}
                                    />
                                    <label htmlFor="semua" className="mb-0.5  ml-1" style={{ fontSize: 11 }}>
                                        Semua
                                    </label>
                                </div>
                            </div>
                        </div>
                    </SidebarComponent>

                    {/* ===============  Grid Data ========================   */}
                    <div className="panel" style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 315px' : ' 1px'), overflowY: 'auto' }}>
                        <div className="panel-data" style={{ width: '100%', height: '660px' }}>
                            <div className="h-full overflow-auto p-4 ">
                                <Tab.Group defaultIndex={0} onChange={(index) => setActiveTab(index)}>
                                    <Tab.List className="mt-1 flex w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                        {tabs.map((item, index) => (
                                            <Tab
                                                key={item.tabIndex}
                                                onClick={() => {
                                                    const mergerObject = {
                                                        ...handleParamsObject,
                                                        valueObject: index,
                                                        tipe: item.label,
                                                    };
                                                    HandleClickTabs(mergerObject);
                                                }}
                                            >
                                                {({ selected }) => (
                                                    <button
                                                        style={{ fontSize: '12px' }}
                                                        className={`${
                                                            selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-600'
                                                        } -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                )}
                                            </Tab>
                                        ))}
                                    </Tab.List>
                                    <div className="e-content">
                                        <Tab.Panels style={{ marginBottom: 10 }}>
                                            {tabs.map((tab, index) => (
                                                <Tab.Panel key={index}>
                                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                                        <GridComponent
                                                            // key={keyLoadListSemua}
                                                            id="gridListData1"
                                                            locale="id"
                                                            ref={gridListData}
                                                            //dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                                            dataSource={recordsData}
                                                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                            allowPaging={true}
                                                            allowSorting={true}
                                                            allowFiltering={false}
                                                            allowResizing
                                                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                                            rowHeight={20}
                                                            width={'100%'}
                                                            height={483}
                                                            gridLines={'Both'}
                                                            // rowDataBound={rowDataBoundListData}
                                                            rowSelected={(args) => {
                                                                SelectedRowsData(args, handleParamsObject);
                                                            }}
                                                        >
                                                            <ColumnsDirective>
                                                                <ColumnDirective
                                                                    field="valuta"
                                                                    headerText="Tgl. Transaksi"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Center"
                                                                    //autoFit
                                                                    width="120"
                                                                    type="date"
                                                                    format={formatDate}
                                                                    customAttributes={{ class: styles['custom-css'] }}
                                                                    freeze="Left"
                                                                />

                                                                <ColumnDirective
                                                                    field="bank_name"
                                                                    headerText="Bank"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="80"
                                                                    freeze="Left"
                                                                />
                                                                <ColumnDirective
                                                                    field="account_number"
                                                                    headerText="No. Rekening"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="120"
                                                                    freeze="Left"
                                                                />
                                                                <ColumnDirective
                                                                    field="account_name"
                                                                    headerText="Nama Pemilik"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    // headerTemplate={headerBuktiTtpSalesman}
                                                                    width="120"
                                                                    // template={templateBuktiTTP}
                                                                />
                                                                <ColumnDirective
                                                                    field="type"
                                                                    headerText="MT"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Center"
                                                                    // headerTemplate={headerSpesimenTtdCustomer}
                                                                    width="70"
                                                                    // template={templateTombolTTD}
                                                                />
                                                                <ColumnDirective
                                                                    field="amount"
                                                                    format="N2"
                                                                    headerText="Jumlah"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Right"
                                                                    // headerTemplate={headerSpesimenSesuai}
                                                                    width="100"
                                                                    // template={templateSpesimenSesuai}
                                                                />

                                                                <ColumnDirective
                                                                    field="description"
                                                                    headerText="Keterangan"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="350"
                                                                    clipMode="EllipsisWithTooltip"
                                                                />
                                                                <ColumnDirective
                                                                    field="pending"
                                                                    headerText="Pending"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Center"
                                                                    //autoFit
                                                                    width="100"
                                                                />
                                                                <ColumnDirective
                                                                    field="dokumen"
                                                                    headerText="Dokumen"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="100"
                                                                    customAttributes={{ class: styles['custom-css_green'] }}
                                                                />
                                                                <ColumnDirective
                                                                    field="no_dokumen"
                                                                    headerText="No. Dokumen"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="120"
                                                                    customAttributes={{ class: styles['custom-css_green'] }}
                                                                />
                                                                <ColumnDirective
                                                                    field="nama_cust"
                                                                    headerText="Nama Customer"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="250"
                                                                    clipMode="EllipsisWithTooltip"
                                                                    customAttributes={{ class: styles['custom-css_green'] }}
                                                                />
                                                                <ColumnDirective
                                                                    field="nama_sales"
                                                                    headerText="Nama Sales"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="150"
                                                                    customAttributes={{ class: styles['custom-css_green'] }}
                                                                />
                                                                <ColumnDirective
                                                                    field="catatan"
                                                                    headerText="Catatan"
                                                                    headerTextAlign="Center"
                                                                    textAlign="Left"
                                                                    //autoFit
                                                                    width="350"
                                                                    clipMode="EllipsisWithTooltip"
                                                                    template={editTemplateCatatanMutasi}
                                                                />
                                                            </ColumnsDirective>

                                                            <Inject
                                                                services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]}
                                                            />
                                                        </GridComponent>
                                                    </div>
                                                </Tab.Panel>
                                            ))}
                                        </Tab.Panels>
                                    </div>
                                </Tab.Group>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div style={{ minHeight: '51px', marginTop: '-30px', marginBottom: '11px', width: '308px', backgroundColor: '#dedede', visibility: sidebarVisible ? 'visible' : 'hidden' }}>
                        <div className="mt-6 flex justify-center">
                            <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                <ButtonComponent
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-medium e-refresh"
                                    content="Refresh Data"
                                    style={{ backgroundColor: '#3b3f5c', marginTop: '5px' }}
                                    onClick={handleRefreshData}
                                />
                            </TooltipComponent>
                        </div>
                    </div>
                    <div style={{ width: '8px' }}></div>
                    <div
                        style={{
                            width: gridWidth,
                            margin: sidebarVisible ? '-9px auto 11px 0' : 'auto auto auto -315px',
                            minHeight: '51px',
                            marginTop: '-9px',
                            marginBottom: '11px',
                            backgroundColor: '#dedede',
                            overflowY: 'auto',
                            marginLeft: '-6px',
                        }}
                    >
                        <div className="flex">
                            {/* <div style={{ width: '172px' }}>
                                <TooltipComponent content="Posting \ Rekonsil" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Posting \ Rekonsil"
                                        style={{ backgroundColor: '#b3b3b3', marginTop: '15px', marginLeft: '25px', color: 'black', fontWeight: 'bold' }}
                                        onClick={() => {
                                            HandleProsesPosting(handleParamsObject);
                                        }}
                                        // onClick={post}
                                    />
                                </TooltipComponent>
                            </div> */}
                            {/* <div style={{ width: '149px' }}>
                                <TooltipComponent content="Rekonsil Baru" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Rekonsil Baru"
                                        style={{ backgroundColor: '#b3b3b3', marginTop: '15px', marginLeft: '4px', color: 'black', fontWeight: 'bold' }}
                                        onClick={handleProsesPosting}
                                        // onClick={post}
                                    />
                                </TooltipComponent>
                            </div>
                            <div style={{ marginTop: '11px', marginLeft: '-10px' }}>
                                <label style={{ fontSize: '12px', color: 'black', fontWeight: 'bold', display: 'block', margin: 0 }}>
                                    Ket : Rekonsil Baru jika dalam satu hari ada pendingan yang sama
                                    <span style={{ display: 'block', textIndent: '10px', marginLeft: 20, marginTop: -4 }}>
                                        {' '}
                                        
                                        Nilai dan Keterangannya sama tapi itu adalah mutasi baru.
                                    </span>
                                </label>
                            </div> */}
                            <div style={{ width: '10%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <DialogDaftarAkunKredit
                visible={listStateData.plagViewModalDaftarAkun}
                listStateData={listStateData}
                setListStateData={setListStateData}
                kode_entitas={kode_entitas}
                vRefreshData={vRefreshData.current}
                dataDaftarAkunKredit={stateDataArray.dataDaftarAkunKredit}
                filteredDataAkunKredit={stateDataArray.filteredDataAkunKredit}
                setFilterData={setFilterData}
                filterData={filterData}
                setCheckboxFilter={setCheckboxFilter}
                setStateDataArray={setStateDataArray}
                token={token}
                handleParamsObject={handleParamsObject}
            />

            <DialogDaftarPenerimaan
                visible={listStateData.plagViewModalDaftarPenerimaan}
                listStateData={listStateData}
                setListStateData={setListStateData}
                kode_entitas={kode_entitas}
                vRefreshData={vRefreshData.current}
                token={token}
                paramObject={paramObjectDaftarPenerimaan}
                handleParamsObject={handleParamsObject}
                // showNewRecordWarkat={showNewRecordWarkat}
            />

            <DialogDaftarPenerimaanPhu
                visible={listStateData.plagViewModalDaftarPenerimaanPhu}
                listStateData={listStateData}
                setListStateData={setListStateData}
                kode_entitas={kode_entitas}
                vRefreshData={vRefreshData.current}
                token={token}
                paramObject={paramObjectDaftarPenerimaanPhu}
                handleParamsObject={handleParamsObject}
                // showNewRecordWarkat={showNewRecordWarkat}
            />

            {prevDataSelectedRef.current.selectType === 'CR' ? (
                //  =========================== Modal Mutasi Masuk CR =====================================
                <DialogComponent
                    id="dialogMutasiMasukDB"
                    name="dialogMutasiMasukDB"
                    target="#main-target"
                    header={() => <div className="header-title">Mutasi Masuk (CR)</div>}
                    visible={listStateData.plagViewModalPostingRekonsil}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    enableResize={true}
                    resizeHandles={['All']}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="15%"
                    height="23%"
                    position={{ X: 'center', Y: 350 }}
                    close={() => {
                        setListStateData((prevState) => ({
                            ...prevState,
                            plagViewModalPostingRekonsil: false,
                            plagViewModalPostingRekonsilDB: false,
                        }));
                    }}
                >
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>[ Jenis Transaksi ]</span>
                    </div>
                    <hr style={{ marginBottom: 10 }} />

                    {/* Radio Button Options */}
                    <div className="mt-1">
                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="bmPemasukanLain"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'bmPemasukanLain'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="bmPemasukanLain" className="mb-1 ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                Pemasukan Lain
                            </label>
                        </div>

                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="ppiTransfer"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'ppiTransfer'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="ppiTransfer" className="mb-1 ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                PPI - Transfer Bank
                            </label>
                        </div>

                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="ppiWarkat"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'ppiWarkat'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="ppiWarkat" className="mb-1 ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                PPI - Pencairan Warkat
                            </label>
                        </div>

                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="bmPos"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'bmPos'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="bmPos" className="mb-1 ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                Pemasukan Lain (POS)
                            </label>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div
                        style={{
                            backgroundColor: '#F2FDF8',
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            borderBottomLeftRadius: '6px',
                            borderBottomRightRadius: '6px',
                            width: '100%',
                            height: '45px',
                            display: 'inline-block',
                        }}
                    >
                        <ButtonComponent
                            id="buBatal"
                            content="Cancel"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-close"
                            style={{ float: 'right', width: '90px', marginTop: '1em', marginRight: '3.2em', backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setListStateData((prevState) => ({
                                    ...prevState,
                                    plagViewModalPostingRekonsil: false,
                                    plagViewModalPostingRekonsilDB: false,
                                }));
                            }}
                        />
                        <ButtonComponent
                            id="buSimpan"
                            content="OK"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: '1em', marginRight: '0.3em', backgroundColor: '#3b3f5c' }}
                            onClick={() => ShowNewRecord(handleParamsObject)}
                        />
                    </div>
                </DialogComponent>
            ) : (
                // =========================== Modal Mutasi Keluar DB =====================================
                <DialogComponent
                    id="dialogMutasiKeluarDB"
                    name="dialogMutasiKeluarDB"
                    target="#main-target"
                    // header="Pembayaran Hutang"
                    header={() => {
                        let header: JSX.Element | string = '';
                        header = (
                            <div>
                                <div className="header-title">Mutasi Keluar (DB)</div>
                            </div>
                        );

                        return header;
                    }}
                    visible={listStateData.plagViewModalPostingRekonsilDB}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    enableResize={true}
                    resizeHandles={['All']}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="15%" //"70%"
                    height="20%"
                    position={{ X: 'center', Y: 350 }}
                    style={{ position: 'fixed' }}
                    close={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            plagViewModalPostingRekonsilDB: false,
                            plagViewModalPostingRekonsil: false,
                        }));
                    }}
                    // buttons={buttonInputData}
                >
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>[ Jenis Transaksi ]</span>
                    </div>
                    <hr style={{ marginBottom: 10 }}></hr>
                    <div className="mt-1">
                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="bkPengeluaran"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'bkPengeluaran'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="bkPengeluaran" className="ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                Pengeluaran Lain
                            </label>
                        </div>

                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="phuTransfer"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'phuTransfer'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="phuTransfer" className="ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                PHU - Transfer Bank
                            </label>
                        </div>

                        <div className="mb-1.5 flex items-center">
                            <input
                                type="radio"
                                name="JenisTransaksi"
                                id="phuWarkat"
                                className="form-radio"
                                checked={listStateData.selectedModalJenisTransaksi === 'phuWarkat'}
                                onChange={(event) => {
                                    setListStateData((prevState) => ({
                                        ...prevState,
                                        selectedModalJenisTransaksi: event.target.id,
                                    }));
                                    selectedModalJenisTransaksi.current = event.target.id;
                                }}
                            />
                            <label htmlFor="phuWarkat" className="ml-1" style={{ fontSize: 11, marginBottom: 0 }}>
                                PHU - Pencairan warkat
                            </label>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: '#F2FDF8',
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            borderBottomLeftRadius: '6px',
                            borderBottomRightRadius: '6px',
                            width: '100%',
                            height: '45px',
                            display: 'inline-block',
                            overflowX: 'scroll',
                            overflowY: 'hidden',
                            scrollbarWidth: 'none',
                        }}
                    >
                        <ButtonComponent
                            id="buBatal"
                            content="Cancel"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-close"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setListStateData((prevState: any) => ({
                                    ...prevState,
                                    plagViewModalPostingRekonsilDB: false,
                                    plagViewModalPostingRekonsil: false,
                                }));
                            }}
                        />
                        <ButtonComponent
                            id="buSimpan"
                            content="OK"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                            onClick={() => ShowNewRecord(handleParamsObject)}
                        />
                    </div>
                </DialogComponent>
            )}

            {listStateData.tipeDialog === 'ppiTransfer' ? (
                <DialogPpiListTransfer
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    // masterBarangProduksi={listStateData}
                    masterBarangProduksi={prevDataSelectedRef.current}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan="Transfer"
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : listStateData.tipeDialog === 'Pencairan' ? (
                <DialogPencairanWarkat
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={prevDataSelectedRef.current}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPenerimaan="Pencairan"
                    token={token}
                    onRefreshTipe={vRefreshData.current}
                    isFilePendukungPPI={isFilePendukungPPI}
                    setisFilePendukungPPI={setisFilePendukungPPI}
                />
            ) : listStateData.tipeDialog === 'bmPemasukanLain' ? (
                modalHandleDataBM && (
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
                        kode_bm=""
                        statusPage={statusPage}
                        selectedRowStatus=""
                        isFilePendukung="N"
                        isApprovedData="N"
                        token={token}
                        dataListMutasibank={prevDataSelectedRef.current}
                        onRefreshTipe={vRefreshData.current}
                        gridList={gridListData}
                    />
                )
            ) : listStateData.tipeDialog === 'bmPos' ? (
                modalHandleDataBMPOS && (
                    <DialogCreateBMPOS
                        userid={userid}
                        kode_entitas={kode_entitas}
                        isOpen={modalHandleDataBMPOS}
                        onClose={() => {
                            setBaru(false);
                            setModalHandleDataBMPOS(false);
                            setStatusPagePOS('');
                        }}
                        kode_user={kode_user}
                        onRefresh={handleRefreshData}
                        kode_bm=""
                        statusPage={statusPagePOS}
                        selectedRowStatus="N"
                        isFilePendukung="N"
                        token={token}
                        dataListMutasibank={prevDataSelectedRef.current}
                        onRefreshTipe={vRefreshData.current}
                    />
                )
            ) : listStateData.tipeDialog === 'phuTransfer' ? (
                <DialogPhuListTransfer
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={prevDataSelectedRef.current}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran="Transfer"
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp=""
                    onRefreshTipe={vRefreshData.current}
                    plag=""
                    token={token}
                />
            ) : listStateData.tipeDialog === 'PencairanPhu' ? (
                <DialogPencairanWarkatPhu
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={prevDataSelectedRef.current}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran="Pencairan"
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp=""
                    onRefreshTipe={vRefreshData.current}
                    plag=""
                    token={token}
                />
            ) : listStateData.tipeDialog === 'bkPengeluaran' ? (
                <FrmPraBkk
                    stateDokumen={stateDokumen}
                    isOpen={listStateData.dialogInputDataVisible ? listStateData.dialogInputDataVisible : false}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    isFilePendukungBk={isFilePendukungBk}
                    dataListMutasibank={prevDataSelectedRef.current}
                    onRefreshTipe={vRefreshData.current}
                />
            ) : null}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk view TTD =============================*/}
            {/*==================================================================================================*/}

            {/* Modal Preview TTDFile Pendukung Images */}
            {plagCatatan === true ? (
                <>
                    <Draggable disabled={true}>
                        <div className={`${styles.modalDetailDragable}`} style={modalPositionCatatan}>
                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 18, fontWeight: 500 }}>
                                        Catatan Mutasi : {moment(tglDokumen).format('DD-MM-YYYY')} [ {noRek} ]
                                    </span>
                                </div>
                                <hr style={{ borderTop: '1px solid #000', margin: '10px 0' }} />
                                <div className="panel-input" style={{ width: '100%', height: '200px' }}>
                                    <TextBoxComponent
                                        id="vKeteranganSC"
                                        ref={(t) => {
                                            textareaObj = t;
                                        }}
                                        multiline={true}
                                        // created={onCreateMultiline}
                                        value={catatanInput}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCatatanInput(value);
                                        }}
                                        cssClass={styles['custom-textbox']}
                                    />
                                </div>
                            </div>
                            <button
                                className={`${styles.closeButtonDetailDragable}`}
                                onClick={() => {
                                    closeModalCatatan();
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                            </button>
                            <div className="flex justify-end">
                                <div style={{ width: '100px' }}>
                                    <>
                                        <button
                                            style={{
                                                backgroundColor: '#e6e6e6',
                                                color: 'black',
                                                borderColor: '#4c4949',
                                                fontWeight: 'bold',
                                                boxShadow: 'none',
                                                width: '90%',
                                                marginTop: '10px',
                                            }}
                                            type="button"
                                            onClick={() => {
                                                simpanUpdateCatatan();
                                            }}
                                            className="btn btn-primary mb-2 md:mb-0 md:mr-2"
                                        >
                                            <FontAwesomeIcon icon={faSave} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Simpan
                                        </button>
                                    </>
                                </div>
                                <div style={{ width: '100px' }}>
                                    <>
                                        <button
                                            style={{
                                                backgroundColor: '#e6e6e6',
                                                color: 'black',
                                                borderColor: '#4c4949',
                                                fontWeight: 'bold',
                                                boxShadow: 'none',
                                                width: '90%',
                                                marginTop: '10px',
                                            }}
                                            type="button"
                                            onClick={() => closeModalCatatan()}
                                            className="btn btn-primary mb-2 md:mb-0 md:mr-2"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Batal
                                        </button>
                                    </>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </>
            ) : null}
            {/* ============================================================ */}
        </div>
    );
};

// export { getServerSideProps };

export default MutasiBankViaApi;
