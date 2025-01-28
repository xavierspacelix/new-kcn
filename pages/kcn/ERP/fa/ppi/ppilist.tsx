import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ChangeEventArgs as ChangeEventArgsInput, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
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
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
    Aggregate,
} from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
// import { getServerSideProps } from '@/pages/api/getServerSide';
import styles from './ppilist.module.css';
// import { SetDataDokumenTtb, PencarianNoTtb, PencarianNoReff } from './component/fungsiFormTtbList';
import { GetPeriode } from './model/apiPpi';
import { frmNumber, showLoading, usersMenu } from '@/utils/routines';
import Draggable from 'react-draggable';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import {
    HandleAkunDebetChange,
    HandleJenisPenerimaanChange,
    HandleNamaCustomerInputChange,
    HandleNoBuktiPenerimaanInputChange,
    HandleNoTtpInputChange,
    HandleNoCustomerInputChange,
    HandleNoWarkatChange,
    HandleTglPpi,
    HandleTglBuat,
    HandleTglPpiJt,
    HandleTglPpiPencairan,
    ValueJenisPenerimaan,
    HandleNoReffInputChange,
    HandleKolektorChange,
    HandleActualKolektorChange,
    CurrencyFormat,
    PencarianNoBukti,
    PencarianJumlah,
    HandleStatusWarkatChange,
    ValueStatusWarkat,
} from './functional/fungsiFormPpiList';
import { DataDetailDokDataFaktur, GetListPpiEffect } from './model/apiPpi';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { useSession } from '@/pages/api/sessionContext';
import DialogPpiListTransfer from './component/dialogPpiListTransfer';
import DialogPpiListWarkat from './component/dialogPpiListWarkat';
import DialogPpiListTunai from './component/dialogPpiListTunai';
import DialogPencairanWarkat from './component/dialogPencairanWarkat';
import DialogPenolakanWarkat from './component/dialogPenolakanWarkat';
import DialogPembatalanWarkat from './component/dialogPembatalanWarkat';

enableRipple(true);

// interface PHUListProps {
//     userid: any;
//     kode_entitas: any;
//     kode_user: any;
// }

const PPIList = () => {
    // const [ppiListOtomatis, setPpiListOtomatis] = useState<any[]>([]);

    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const nip = sessionData?.nip ?? '';
    const kode_user = sessionData?.nip ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }
    const router = useRouter();

    const rowIdxListData = useRef(0);

    //======= Setting hak akses user ... ========
    let disabledBaru = false;
    let disabledEdit = false;
    let disabledHapus = false;
    let disabledCetak = false;

    let sidebarObj: SidebarComponent;
    let type: SidebarType = 'Push';
    let mediaQueryState: string = '(min-width: 600px)';

    // ================================================================================================
    // ============================ Pembayaran Hutang (PPI) ===========================================
    // State Baru Untuk PPI
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
        tipe: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '', tipe: '' });
    const kode_menu = '60202'; // kode menu PPI

    // ================== State untuk filter data list ===============================
    const [filterData, setFilterData] = useState({
        noBuktiPenerimaanValue: '',
        date1: moment(), // tanggal awal PPI
        date2: moment().endOf('month'), // tanggal akhir PPI
        date3: moment(), // tanggal buat
        date4: moment().endOf('month'), // tanggal akhir buat
        noTTPValue: '',
        selectedOptionJenisPenerimaan: '',
        noWarkatValue: '',
        date5: moment(), // tanggal awal jatuh tempo
        date6: moment().endOf('month'), // tanggal akhir jatuh tempo
        date7: moment(), // tanggal awal pencairan
        date8: moment().endOf('month'), // tanggal akhir pencairan
        selectedOptionStatusWarkat: '',
        noCustomerValue: '',
        namaCustomerValue: '',
        noReffValue: '',
        kolektorValue: '',
        actualKolektorValue: '',
        akunDebetValue: '',
        searchNoBukti: '',
        searchJumlah: '',
        plagOtomatis: '',
    });
    // End

    // ==================state klasifikasi customer ====================================
    const [selectedRadioKlasifikasiCust, setselectedRadioKlasifikasiCust] = useState('all');
    const handleRadioKlasifikasiCust = (event: any) => {
        setselectedRadioKlasifikasiCust(event.target.value);
    };

    //end

    // ================== State untuk filter data list yang berupa checkbox ===============================
    const [checkboxFilter, setCheckboxFilter] = useState({
        isNoBuktiPenerimaanChecked: false,
        isTanggalChecked: true,
        isTanggalBuatChecked: false,
        isNoTTPChecked: false,
        isJenisPenerimaanChecked: false,
        isNoWarkatChecked: false,
        isTanggalJTChecked: false,
        isTanggalPencairanChecked: false,
        isStatusWarkatChecked: false,
        isNoCustomerChecked: false,
        isNamaCustomerChecked: false,
        isNoReffChecked: false,
        isKolektorChecked: false,
        isActualKolektorChecked: false,
        isAkunDebetChecked: false,
        isFileBelumKomplitChecked: false,
        isFileBelumValidasiChecked: false,
        isFileValidasi1Checked: false,
        isFileValidasi2Checked: false,
        isFileValidasi3Checked: false,
    });
    // End

    // ================== State untuk all list data ===============================
    const [listStateData, setListStateData] = useState({
        selectedRowKodePpi: '',
        selectedItem: null,
        dialogFilterJenisPenerimaan: false,
        selectedModalJenisPenerimaan: 'Tunai',
        noDokumen: '',
        tglDokumen: '',
        masterDataState: 'BARU',
        masterKodeDokumen: 'BARU',
        dialogInputDataVisible: false,
        tipeDialog: '',
        selectedKodeSupp: '',
        plagTab: 'PPI OTOMATIS',
        tipeBatal: '',
    });
    // End

    // ======== Fungsi pemilihan radio button jenis pembayaran pada saat show baru  ========
    let radioInstanceTunai: any, radioInstanceTransfer: any, radioInstanceWarkat: any;
    function changeModalJenisPenerimaan(tipe: any): void {
        if (tipe === 'Tunai') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedModalJenisPenerimaan: radioInstanceTunai.id,
            }));
        } else if (tipe === 'Transfer') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedModalJenisPenerimaan: radioInstanceTransfer.id,
            }));
        } else {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedModalJenisPenerimaan: radioInstanceWarkat.id,
            }));
        }
    }
    // End

    // ======= Variabel label untuk Tombol button List ==========
    const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonDisabled = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };
    const [state, setState] = useState({
        content: 'Detail Dok',
        contentPencairan: 'Pencairan',
        contentPenolakan: 'Penolakan',
        contentPembatalan: 'Pembatalan',
        iconCss: 'e-icons e-medium e-chevron-down',
    });
    // End

    type PPIListItem = {
        kode_dokumen: string;
        dokumen: string;
        no_dokumen: any;
        tgl_dokumen: any;
        no_warkat: any;
        jatuh_tempo: any;
        tgl_valuta: any;
        jenis: any;
        kepada: any;
        status: any;
        nama_cust: any;
        cair: any;
        kosong: any;
        jumlah_mu: any;
        pengakuan: any;
        no_ttp: any;
        nama_sales: any;
        no_cust: any;
        nama_akun: any;
        faktur: any;
        kode_sales: any;
        cetak_w: any;
        status_w: any;
        komplit: any;
        validasi1: any;
        validasi2: any;
        validasi3: any;
        validasi_ho2: any;
        validasi_ho3: any;
        validasi_catatan: any;
        api_id: any;
        tgl_trxdokumen: any;
        kode_cust: any;
        kode_akun_debet: any;
        kode_supp: any;
        kode_akun_kredit: any;
        kode_akun_diskon: any;
        kurs: any;
        debet_rp: any;
        kresit_rp: any;
        jumlah_rp: any;
        pajak: any;
        catatan: any;
        user_id: any;
        tgl_update: any;
        status_approved: any;
        tgl_approved: any;
        tgl_pengakuan: any;
        tgl_ttp: any;
        kode_fk: any;
        approval: any;
        tgl_setorgiro: any;
        barcode: any;
        tolak_catatan: any;
        kode_kry: any;
        api_pending: any;
        api_catatan: any;
        api_norek: any;
        kode_aktiva: any;
        kode_rpe: any;
        kode_phe: any;
        gambar1: any;
        gambar2: any;
        gambar3: any;
        kelas: any;
        id_dokumen: any;
        nama_penagih: any;
    };
    const [recordsData, setRecordsData] = useState<PPIListItem[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const recordsDataRef = useRef<PPIListItem[]>([]);
    const [detailDokDataFaktur, setDetailDokDataFaktur] = useState<any[]>([]);
    const [detailDokDataJurnal, setDetailDokDataJurnal] = useState<any[]>([]);

    const [ppiOtomatis, setPpiOtomatis] = useState<PPIListItem[]>([]);
    const [ppiManual, setPpiManual] = useState<PPIListItem[]>([]);
    const filterTab = () => {
        //filteredData : recordsDataRef
        const ppiOtomatisTab: any[] = recordsDataRef.current.filter((item: any) => item.kode_akun_diskon === 'MOBAPP');
        const ppiManualTab: any[] = recordsDataRef.current.filter((item: any) => item.kode_akun_diskon === null);
        setFilterData((prevState: any) => ({
            ...prevState,
            plagOtomatis: 'otomatis',
        }));
        setPpiOtomatis(ppiOtomatisTab);
        setPpiManual(ppiManualTab);
        console.log('ppiOtomatisTab = ', ppiOtomatisTab, ppiManualTab);
    };
    const [isFilePendukungPPI, setisFilePendukungPPI] = useState<any>('');

    //======== Setting hint / tooltip untuk grid List Data ========
    let tooltipListData: Tooltip | any;
    const columnListData: Object = {
        'Tgl. Pencairan/Tolak': 'Tgl. Pencairan/Tolak',
    };
    const beforeRenderListData = (args: TooltipEventArgs) => {
        const description = (columnListData as any)[(args as any).target.innerText];
        if (description) {
            tooltipListData.content = description;
        }
    };
    // End

    // ================ Menentukan Tanggal =========================================
    // Menentukan tanggal awal bulan
    const tanggalSekarang = moment();
    // Menentukan tanggal akhir bulan dengan moment.js
    const tanggalAwalBulan = tanggalSekarang.startOf('month');
    const tanggalHariIni = moment(new Date()).format('YYYY-MM-DD');
    const tanggalAkhirBulan = moment(tanggalAwalBulan.endOf('month')).format('YYYY-MM-DD');
    // End

    const modalPosition = {
        top: '3%',
        right: '2%',
        width: '40%',
        background: '#dedede',
    };

    const fetchDataUseEffect = async () => {
        await usersMenu(kode_entitas, userid, kode_menu)
            .then((result) => {
                const { baru, edit, hapus, cetak } = result;
                setUserMenu((prevState) => ({
                    ...prevState,
                    baru: baru,
                    edit: edit,
                    hapus: hapus,
                    cetak: cetak,
                    tipe: 'baru',
                }));
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchDataUseEffect();
    }, []);

    //==========  Popup menu untuk header grid List Data ===========
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
    const ExportComplete = (): void => {
        gridListData.hideSpinner();
    };
    // End

    // ================== Funsgi Reload untuk Responsive sidebar filter ==========================
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

    // ===================== Fungsi refresh Data list =========================================
    const actionBeginDetailBarang = async (args: any) => {
        // await showLoading1(true);
        if (args.requestType === 'refresh') {
            let vDokumen = 'PU';
            let vNoDokumen = 'all';
            let vTglPpiAwal = tanggalHariIni; //tanggalHariIni
            let vTglPpiAkhir = tanggalAkhirBulan; //tanggalAkhirBulan

            let vNoWarkat = 'all';
            let vStatusWarkat = 'all';
            let vNoCust = 'all';
            let vNamaCust = 'all';
            let vNoReff = 'all';
            let vKolektor = 'all';
            let vActualKolektor = 'all';

            let vTglPpiJtAwal = 'all';
            let vTglPpiJtAkhir = 'all';
            let vTglPpiPencairanAwal = 'all';
            let vTglPpiPencairanAkhir = 'all';
            let vJenisPenerimaan = 'all';
            let vLimit = '1000';
            let vAkunDebet = 'all';
            let vFileBelumKomplit = 'all';
            let vFileBelumValidasi = 'all';
            let vFileValidasi1 = 'all';
            let vFileValidasi2 = 'all';
            let vFileValidasi3 = 'all';

            let vWhere = '';

            if (checkboxFilter.isTanggalChecked) {
                const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
                const formattedDate2 = filterData.date2.format('YYYY-MM-DD 23:59:59');
                vTglPpiAwal = `${formattedDate1}`;
                vTglPpiAkhir = `${formattedDate2}`;
                vWhere = ' where dokumen="PU" and ' + vWhere + " tgl_dokumen between '" + `${formattedDate1}` + "' and '" + `${formattedDate2}` + "' ";
            }

            let paramObject = {
                kode_entitas: kode_entitas,
                vDokumen: vDokumen,
                vNoDokumen: vNoDokumen,
                vNoWarkat: vNoWarkat,
                vNoSupp: vNoCust,
                vNamaSupp: vNamaCust,
                vTglPpiAwal: vTglPpiAwal,
                vTglPpiAkhir: vTglPpiAkhir,
                vTglPpiJtAwal: vTglPpiJtAwal,
                vTglPpiJtAkhir: vTglPpiJtAkhir,
                vTglPpiPencairanAwal: vTglPpiPencairanAwal,
                vTglPpiPencairanAkhir: vTglPpiPencairanAkhir,
                vNoReff: vNoReff,
                vKolektor: vKolektor,
                vActualKolektor: vActualKolektor,
                vJenisPenerimaan: vJenisPenerimaan,
                vLimit: vLimit,
                vAkunDebet: vAkunDebet,
                vToken: token,
                vWhere: vWhere,
            };

            const responseData = await GetListPpiEffect(paramObject);
            setRecordsData(responseData);
            recordsDataRef.current = responseData;
            // await showLoading1(false);

            filterTab();
        }
    };

    useEffect(() => {
        const refreshData = async () => {
            let vDokumen = 'PU';
            let vNoDokumen = 'all';
            let vTglPpiAwal = tanggalHariIni; //tanggalHariIni
            let vTglPpiAkhir = tanggalAkhirBulan; //tanggalAkhirBulan

            let vNoWarkat = 'all';
            let vStatusWarkat = 'all';
            let vNoCust = 'all';
            let vNamaCust = 'all';
            let vNoReff = 'all';
            let vKolektor = 'all';
            let vActualKolektor = 'all';

            let vTglPpiJtAwal = 'all';
            let vTglPpiJtAkhir = 'all';
            let vTglPpiPencairanAwal = 'all';
            let vTglPpiPencairanAkhir = 'all';
            let vJenisPenerimaan = 'all';
            let vLimit = '1000';
            let vAkunDebet = 'all';
            let vFileBelumKomplit = 'all';
            let vFileBelumValidasi = 'all';
            let vFileValidasi1 = 'all';
            let vFileValidasi2 = 'all';
            let vFileValidasi3 = 'all';

            let vWhere = '';

            if (checkboxFilter.isTanggalChecked) {
                const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
                const formattedDate2 = filterData.date2.format('YYYY-MM-DD 23:59:59');
                vTglPpiAwal = `${formattedDate1}`;
                vTglPpiAkhir = `${formattedDate2}`;
                vWhere = ' where dokumen="PU" and ' + vWhere + " tgl_dokumen between '" + `${formattedDate1}` + "' and '" + `${formattedDate2}` + "' ";
            }

            let paramObject = {
                kode_entitas: kode_entitas,
                vDokumen: vDokumen,
                vNoDokumen: vNoDokumen,
                vNoWarkat: vNoWarkat,
                vNoSupp: vNoCust,
                vNamaSupp: vNamaCust,
                vTglPpiAwal: vTglPpiAwal,
                vTglPpiAkhir: vTglPpiAkhir,
                vTglPpiJtAwal: vTglPpiJtAwal,
                vTglPpiJtAkhir: vTglPpiJtAkhir,
                vTglPpiPencairanAwal: vTglPpiPencairanAwal,
                vTglPpiPencairanAkhir: vTglPpiPencairanAkhir,
                vNoReff: vNoReff,
                vKolektor: vKolektor,
                vActualKolektor: vActualKolektor,
                vJenisPenerimaan: vJenisPenerimaan,
                vLimit: vLimit,
                vAkunDebet: vAkunDebet,
                vToken: token,
                vWhere: vWhere,
            };

            const responseData = await GetListPpiEffect(paramObject);
            const responseDataFix = responseData.map((item: any) => ({
                ...item,
                tgl_valuta: item.kosong === null ? null : item.tgl_valuta,
            }));
            setRecordsData(responseDataFix);
            recordsDataRef.current = responseDataFix;
            filterTab();
        };
        refreshData();
    }, []);

    const gridKey = `${JSON.stringify(recordsDataRef.current)}`;

    const vRefreshData = useRef(0);
    // useEffect(() => {
    //     handleRefreshData();
    // }, []);

    // const onRefreshTipe = async (tipeDialog: any) => {
    //     await setUserMenu((prevState: any) => ({
    //         ...prevState,
    //         tipe: tipeDialog,
    //     }));
    // };

    const handleRefreshData = async () => {
        vRefreshData.current += 1;
        await setFilterData((prevState: any) => ({
            ...prevState,
            searchNoBukti: '',
            searchJumlah: '',
        }));
        await showLoading1(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                let vDokumen = 'PU';
                let vNoDokumen = 'all';
                let vTglPpiAwal = 'all'; //tanggalHariIni
                let vTglPpiAkhir = 'all'; //tanggalAkhirBulan

                let vNoWarkat = 'all';
                let vStatusWarkat = 'all';
                let vNoCust = 'all';
                let vNamaCust = 'all';
                let vNoReff = 'all';
                let vKolektor = 'all';
                let vActualKolektor = 'all';

                let vTglPpiJtAwal = 'all';
                let vTglPpiJtAkhir = 'all';
                let vTglPpiPencairanAwal = 'all';
                let vTglPpiPencairanAkhir = 'all';
                let vJenisPenerimaan = 'all';
                let vLimit = '1000';
                let vAkunDebet = 'all';
                let vFileBelumKomplit = 'all';
                let vFileBelumValidasi = 'all';
                let vFileValidasi1 = 'all';
                let vFileValidasi2 = 'all';
                let vFileValidasi3 = 'all';

                let vWhere = '';

                if (checkboxFilter.isNoBuktiPenerimaanChecked) {
                    vNoDokumen = `${filterData.noBuktiPenerimaanValue}`;
                    vWhere = vWhere + " no_dokumen like '" + `${filterData.noBuktiPenerimaanValue}` + "%' and ";
                }
                if (checkboxFilter.isTanggalChecked) {
                    const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
                    const formattedDate2 = filterData.date2.format('YYYY-MM-DD 23:59:59');
                    vTglPpiAwal = `${formattedDate1}`;
                    vTglPpiAkhir = `${formattedDate2}`;
                    vWhere = vWhere + " tgl_dokumen between '" + `${formattedDate1}` + "' and '" + `${formattedDate2}` + "' and ";
                }
                if (checkboxFilter.isTanggalBuatChecked) {
                    const formattedDate3 = filterData.date3.format('YYYY-MM-DD');
                    const formattedDate4 = filterData.date4.format('YYYY-MM-DD 23:59:59');
                    vTglPpiAwal = `${formattedDate3}`;
                    vTglPpiAkhir = `${formattedDate4}`;
                    vWhere = vWhere + " tgl_trxdokumen between '" + `${formattedDate3}` + "' and '" + `${formattedDate4}` + "' and ";
                }
                if (checkboxFilter.isNoTTPChecked) {
                    vNoDokumen = `${filterData.noTTPValue}`;
                    vWhere = vWhere + " no_ttp like '" + `${filterData.noTTPValue}` + "%' and ";
                }
                if (checkboxFilter.isJenisPenerimaanChecked) {
                    vJenisPenerimaan = `${filterData.selectedOptionJenisPenerimaan}`;
                    if (`${filterData.selectedOptionJenisPenerimaan}` === 'Tunai') {
                        vWhere = vWhere + " (ifnull(kosong,0)<>'B' and ifnull(kosong,0)<>'C' and ifnull(kosong,0)<>'T') and trim(ifnull(no_warkat,''))='' and ";
                    } else if (`${filterData.selectedOptionJenisPenerimaan}` === 'Transfer') {
                        vWhere = vWhere + " (ifnull(kosong,0)<>'B' and ifnull(kosong,0)<>'C' and ifnull(kosong,0)<>'T') and trim(ifnull(no_warkat,''))<>'' and ";
                    } else {
                        vWhere = vWhere + " (kosong='B' or kosong='C' or kosong='T') and ";
                    }
                }
                if (checkboxFilter.isNoWarkatChecked) {
                    vNoWarkat = `${filterData.noWarkatValue}`;
                    vWhere = vWhere + " no_warkat like '" + `${filterData.noWarkatValue}` + "%' and ";
                }
                if (checkboxFilter.isTanggalJTChecked) {
                    const formattedDate5 = filterData.date5.format('YYYY-MM-DD');
                    const formattedDate6 = filterData.date6.format('YYYY-MM-DD 23:59:59');
                    vTglPpiJtAwal = `${formattedDate5}`;
                    vTglPpiJtAkhir = `${formattedDate6}`;
                    vWhere = vWhere + " tgl_valuta between '" + `${formattedDate5}` + "' and '" + `${formattedDate6}` + "' and ";
                }
                if (checkboxFilter.isTanggalPencairanChecked) {
                    const formattedDate7 = filterData.date7.format('YYYY-MM-DD');
                    const formattedDate8 = filterData.date8.format('YYYY-MM-DD 23:59:59');
                    vTglPpiPencairanAwal = `${formattedDate7}`;
                    vTglPpiPencairanAkhir = `${formattedDate8}`;
                    vWhere = vWhere + " tgl_pengakuan between '" + `${formattedDate7}` + "' and '" + `${formattedDate8}` + "' and ";
                }
                if (checkboxFilter.isStatusWarkatChecked) {
                    vStatusWarkat = `${filterData.selectedOptionStatusWarkat}`;
                    if (`${filterData.selectedOptionStatusWarkat}` === 'Baru') {
                        vWhere = vWhere + " kosong='B' and ";
                    } else if (`${filterData.selectedOptionStatusWarkat}` === 'Cair') {
                        vWhere = vWhere + " kosong='C' and ";
                    } else {
                        vWhere = vWhere + " kosong='T' and ";
                    }
                }
                if (checkboxFilter.isNoCustomerChecked) {
                    vNoCust = `${filterData.noCustomerValue}`;
                    vWhere = vWhere + " no_cust like '" + `${filterData.noCustomerValue}` + "%' and ";
                }
                if (checkboxFilter.isNamaCustomerChecked) {
                    vNamaCust = `${filterData.namaCustomerValue}`;
                    vWhere = vWhere + " nama_cust like '" + `${filterData.namaCustomerValue}` + "%' and ";
                }
                if (checkboxFilter.isNoReffChecked) {
                    vNoReff = `${filterData.noReffValue}`;
                    vWhere =
                        vWhere +
                        "kode_dokumen in ( select distinct kode_dokumen from tb_d_penerimaan a left join tb_m_fj b on (b.kode_fj=a.kode_fj) where b.no_fj like '" +
                        `${filterData.noReffValue}` +
                        "%') and ";
                }
                if (checkboxFilter.isKolektorChecked) {
                    vNamaCust = `${filterData.kolektorValue}`;
                    vWhere = vWhere + " nama_sales like '" + `${filterData.kolektorValue}` + "%' and ";
                }
                if (checkboxFilter.isActualKolektorChecked) {
                    vNamaCust = `${filterData.actualKolektorValue}`;
                    vWhere = vWhere + " nama_penagih like '" + `${filterData.actualKolektorValue}` + "%' and ";
                }
                if (checkboxFilter.isAkunDebetChecked) {
                    vAkunDebet = `${filterData.akunDebetValue}`;
                    vWhere = vWhere + " nama_akun like '" + `${filterData.akunDebetValue}` + "%' and ";
                }
                if (checkboxFilter.isFileBelumKomplitChecked) {
                    //vAkunDebet = `${filterData.filebeValue}`;
                    vWhere =
                        vWhere +
                        " IF( (IFNULL(kosong,0)<>'B' AND IFNULL(kosong,0)<>'C' AND IFNULL(kosong,0)<>'T') AND TRIM(IFNULL(no_warkat,''))='',  " +
                        " (IFNULL(filegambarG,'')='' ), " +
                        "  IF ((IFNULL(kosong,0)<>'B' AND IFNULL(kosong,0)<>'C' AND IFNULL(kosong,0)<>'T') AND TRIM(IFNULL(no_warkat,''))<>'', " +
                        "    (IFNULL(filegambarG,'')='' OR IFNULL(filegambarH,'')=''), " +
                        "     IF((kosong='B' OR kosong='C' OR kosong='T'), " +
                        "          (IFNULL(filegambarG,'')='' OR IFNULL(filegambarI,'')=''), " +
                        "          (IFNULL(filegambarG,'')='' OR IFNULL(filegambarI,'')='')  " +
                        '       ) ' +
                        '     ) ' +
                        ') and ';
                }
                if (checkboxFilter.isFileBelumValidasiChecked) {
                    vWhere = vWhere + " validasi1<>'Y' and validasi2<>'Y' and validasi3<>'Y' and ";
                }
                if (checkboxFilter.isFileValidasi1Checked) {
                    vWhere = vWhere + " validasi1='Y' and ";
                }
                if (checkboxFilter.isFileValidasi2Checked) {
                    vWhere = vWhere + " validasi2='Y' and ";
                }
                if (checkboxFilter.isFileValidasi3Checked) {
                    vWhere = vWhere + " validasi3='Y' and ";
                }

                if (selectedRadioKlasifikasiCust === 'AF') {
                    vWhere = vWhere + " (kelas BETWEEN 'A' AND 'F') and ";
                } else if (selectedRadioKlasifikasiCust === 'G') {
                    vWhere = vWhere + " kelas='G' and ";
                } else if (selectedRadioKlasifikasiCust === 'H') {
                    vWhere = vWhere + " kelas='H' and ";
                }

                //==========hasil where=============
                if (vWhere === '') {
                    vWhere = "where dokumen='PU' ";
                } else {
                    vWhere = "where dokumen='PU' and " + vWhere.substring(0, vWhere.length - 4);
                }

                let paramObject = {
                    kode_entitas: kode_entitas,
                    vDokumen: vDokumen,
                    vNoDokumen: vNoDokumen,
                    vNoWarkat: vNoWarkat,
                    vNoSupp: vNoCust,
                    vNamaSupp: vNamaCust,
                    vTglPpiAwal: vTglPpiAwal,
                    vTglPpiAkhir: vTglPpiAkhir,
                    vTglPpiJtAwal: vTglPpiJtAwal,
                    vTglPpiJtAkhir: vTglPpiJtAkhir,
                    vTglPpiPencairanAwal: vTglPpiPencairanAwal,
                    vTglPpiPencairanAkhir: vTglPpiPencairanAkhir,
                    vNoReff: vNoReff,
                    vKolektor: vKolektor,
                    vActualKolektor: vActualKolektor,
                    vJenisPenerimaan: vJenisPenerimaan,
                    vLimit: vLimit,
                    vAkunDebet: vAkunDebet,
                    vToken: token,
                    vWhere: vWhere,
                };

                console.log('paramObject = ', paramObject);

                const responseData = await GetListPpiEffect(paramObject);
                const responseDataFix = responseData.map((item: any) => ({
                    ...item,
                    tgl_valuta: item.kosong === null ? null : item.tgl_valuta,
                    jumlah_mu: parseFloat(item.jumlah_mu),
                }));
                setRecordsData(responseDataFix);
                recordsDataRef.current = responseDataFix;
                showLoading1(false);

                const cariNoBukti = document.getElementById('cariNoBukti') as HTMLInputElement;
                if (cariNoBukti) {
                    cariNoBukti.value = '';
                }
                const cariJumlah = document.getElementById('cariJumlah') as HTMLInputElement;
                if (cariJumlah) {
                    cariJumlah.value = '';
                }
                filterTab();
            } catch (error) {
                console.error(error);
            }
        }
    };
    // End

    const closeModal = () => {
        setListStateData((prevState: any) => ({
            ...prevState,
            selectedItem: null,
        }));
    };

    const swalToast = swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 3000,
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

    // ================ Fungsi untuk menampilkan modal input data ==================
    const showNewRecord = async (tipe: string) => {
        vRefreshData.current += 1;
        await setListStateData((prevState: any) => ({
            ...prevState,
            masterDataState: 'BARU',
            masterKodeDokumen: 'BARU',
            dialogInputDataVisible: true,
            dialogFilterJenisPenerimaan: false,
            tipeDialog: tipe,
        }));
    };
    // End

    // === Fungsi untuk menampilkan modal pilihan jenis bayar sebum masuk ke modal input data ===
    const showBaru = async () => {
        vRefreshData.current += 1;
        // await RefreshDetailSj(kode_entitas, custSelectedKode, refKodeCust.current, setDataDetailSj);
        await setListStateData((prevState: any) => ({
            ...prevState,
            dialogFilterJenisPenerimaan: true,
            masterDataState: 'BARU',
        }));
    };

    const closeModalShowBaru = () => {
        setListStateData((prevState: any) => ({
            ...prevState,
            dialogFilterJenisPenerimaan: false,
        }));
    };
    // End

    // ============================================================================
    // ============================ END ===========================================
    // ============================================================================

    let gridListData: Grid | any;
    let gridListData1: Grid | any;
    let selectedListData: any[] = [];
    const [selectedRowKodeTtb, setSelectedRowKodeTtb] = useState('');
    const [selectedRowKodePpi, setSelectedRowKodePpi] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailDok, setDetailDok] = useState<any[]>([]);

    const [dataDetailDokTtb, setDataDetailDokTtb] = useState({ no_ttb: '', tgl_ttb: '' });

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

    //============== Format baris pada grid List Data  =============
    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            if (getValue('filegambarG', args.data) === '' || getValue('filegambarG', args.data) === null || getValue('filegambarG', args.data) === undefined) {
                args.row.style.background = 'white';
            } else {
                args.row.style.background = '#ffffd5';
            }
        }
    };

    //============== Format cell pada grid List Data ===============
    const queryCellInfoListData = (args: any) => {
        if (args.column?.field === 'jumlah_mu') {
            args.cell.style.color = 'red';
        }
    };

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    //================ Disable hari minggu di calendar ==============
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    // INI YANG TERBARU
    const [masterBarangProduksi, setMasterBarangProduksi] = useState<string>('Y');

    const showEditRecord = async () => {
        console.log('masterKodeDokumen = ', listStateData.masterKodeDokumen);
        vRefreshData.current += 1;
        if (listStateData.masterKodeDokumen === 'BARU') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PPI terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (listStateData.selectedModalJenisPenerimaan === 'Cair') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Data PPI sudah CAIR, tidak dapat di edit.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        const responseData: any[] = await GetPeriode(kode_entitas);
        const periode = responseData[0].periode;
        const tanggalMomentPeriode = moment(periode, 'YYYYMM');
        const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

        const tglPembanding = moment(dataDetailDokTtb.tgl_ttb).format('YYYYMM');

        // Mendapatkan tahun dan bulan dari setiap tanggal
        const yearA = parseInt(periodeTahunBulan.substring(0, 4));
        const monthA = parseInt(periodeTahunBulan.substring(4, 6));

        const yearB = parseInt(tglPembanding.substring(0, 4));
        const monthB = parseInt(tglPembanding.substring(4, 6));

        if (yearB < yearA || (yearB === yearA && monthB < monthA)) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        } else {
            setListStateData((prevState: any) => ({
                ...prevState,
                masterDataState: 'EDIT',
                masterKodeDokumen: listStateData.masterKodeDokumen,
                dialogInputDataVisible: true,
                selectedModalJenisPenerimaan: listStateData.selectedModalJenisPenerimaan,
                tipeDialog: listStateData.tipeDialog,
                selectedKodeSupp: listStateData.selectedKodeSupp,
            }));
        }
    };

    const showUpdateFilePendukung = async () => {
        console.log('listStateData.tipeDialog = ', listStateData.tipeDialog, listStateData.selectedKodeSupp);
        vRefreshData.current += 1;
        if (listStateData.masterKodeDokumen === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setListStateData((prevState: any) => ({
            ...prevState,
            masterDataState: 'UpdateFilePendukung',
            masterKodeDokumen: listStateData.masterKodeDokumen,
            dialogInputDataVisible: true,
            selectedModalJenisPenerimaan: 'UpdateFilePendukung',
            tipeDialog: listStateData.tipeDialog,
            selectedKodeSupp: listStateData.selectedKodeSupp,
        }));
        setisFilePendukungPPI('Y');
    };

    //

    const selectingRowsData = (args: any) => {
        if (args.data !== undefined) {
            ListDetailDok(args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal, token);
            setListStateData((prevState: any) => ({
                ...prevState,
                noDokumen: args.data.no_dokumen,
                tglDokumen: args.data.tgl_dokumen,
            }));
        }
    };

    const selectingRowsDataManual = (args: any) => {
        if (args.data !== undefined) {
            ListDetailDok(args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal, token);
            setListStateData((prevState: any) => ({
                ...prevState,
                noDokumen: args.data.no_dokumen,
                tglDokumen: args.data.tgl_dokumen,
            }));
        }
    };

    const selectingRowsDataSemua = (args: any) => {
        if (args.data !== undefined) {
            ListDetailDok(args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal, token);
            setListStateData((prevState: any) => ({
                ...prevState,
                noDokumen: args.data.no_dokumen,
                tglDokumen: args.data.tgl_dokumen,
            }));
        }
    };

    const selectedRowsData = (args: any) => {
        if (args.data !== undefined) {
            setListStateData((prevState: any) => ({
                ...prevState,
                masterKodeDokumen: args.data.kode_dokumen,
                selectedModalJenisPenerimaan: args.data.Jenis,
                tipeDialog: args.data.Jenis,
                selectedKodeSupp: args.data.kode_supp,
                masterDataState: 'EDIT',
                selectedRowKodePpi: args.data.kode_dokumen,
            }));
        }
    };

    const selectedRowsDataManual = (args: any) => {
        if (args.data !== undefined) {
            setListStateData((prevState: any) => ({
                ...prevState,
                masterKodeDokumen: args.data.kode_dokumen,
                selectedModalJenisPenerimaan: args.data.Jenis,
                tipeDialog: args.data.Jenis,
                selectedKodeSupp: args.data.kode_supp,
                masterDataState: 'EDIT',
                selectedRowKodePpi: args.data.kode_dokumen,
            }));
        }
    };

    const selectedRowsDataSemua = (args: any) => {
        if (args.data !== undefined) {
            setListStateData((prevState: any) => ({
                ...prevState,
                masterKodeDokumen: args.data.kode_dokumen,
                selectedModalJenisPenerimaan: args.data.Jenis,
                tipeDialog: args.data.Jenis,
                selectedKodeSupp: args.data.kode_supp,
                masterDataState: 'EDIT',
                selectedRowKodePpi: args.data.kode_dokumen,
            }));
        }
    };

    const handleRowDoubleClicked = (args: any) => {
        vRefreshData.current += 1;
        if (args.rowData.Jenis === 'Cair') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Data PPI sudah CAIR, tidak dapat di edit.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setListStateData((prevState: any) => ({
            ...prevState,
            masterKodeDokumen: args.rowData.kode_dokumen,
            masterDataState: 'EDIT',
            selectedModalJenisPenerimaan: args.rowData.Jenis,
            dialogInputDataVisible: true,
            tipeDialog: args.rowData.Jenis,
            selectedKodeSupp: args.rowData.kode_supp,
        }));
    };

    const handleRowDoubleClickedManual = (args: any) => {
        vRefreshData.current += 1;
        if (args.rowData.Jenis === 'Cair') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Data PPI sudah CAIR, tidak dapat di edit.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setListStateData((prevState: any) => ({
            ...prevState,
            masterKodeDokumen: args.rowData.kode_dokumen,
            masterDataState: 'EDIT',
            selectedModalJenisPenerimaan: args.rowData.Jenis,
            dialogInputDataVisible: true,
            tipeDialog: args.rowData.Jenis,
            selectedKodeSupp: args.rowData.kode_supp,
        }));
    };

    const handleRowDoubleClickedSemua = (args: any) => {
        vRefreshData.current += 1;
        if (args.rowData.Jenis === 'Cair') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Data PPI sudah CAIR, tidak dapat di edit.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setListStateData((prevState: any) => ({
            ...prevState,
            masterKodeDokumen: args.rowData.kode_dokumen,
            masterDataState: 'EDIT',
            selectedModalJenisPenerimaan: args.rowData.Jenis,
            dialogInputDataVisible: true,
            tipeDialog: args.rowData.Jenis,
            selectedKodeSupp: args.rowData.kode_supp,
        }));
    };

    // ============ untuk menampilkan dropdown cetak dan fungsi pemanggilan nya =================
    let cMenuCetak: ContextMenuComponent;
    function btnPrintClick(e: any): void {
        var clientRect = (e.target as Element).getBoundingClientRect();
        cMenuCetak.open(clientRect.bottom, clientRect.left);
    }

    let menuCetakItems: MenuItemModel[] = [
        {
            id: 'formKecil',
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Penerimaan Piutang (Form Kecil)',
        },
        {
            id: 'formBesar',
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Penerimaan Piutang (Form Besar)',
        },
        {
            id: 'daftarPembayaran',
            iconCss: 'e-icons e-thumbnail',
            text: 'Daftar Penerimaan Piutang',
        },
    ];

    function menuCetakSelect(args: MenuEventArgs) {
        if (args.item.id === 'formKecil') {
            OnClick_CetakFormKecil(listStateData.selectedRowKodePpi, kode_entitas, token);
        } else if (args.item.id === 'formBesar') {
            OnClick_CetakFormBesar(listStateData.selectedRowKodePpi, kode_entitas, token);
        } else if (args.item.id === 'daftarPembayaran') {
            let tglAwal;
            if (checkboxFilter.isTanggalChecked === true) {
                tglAwal = filterData.date1.format('YYYY-MM-DD');
            } else {
                tglAwal = '2000-01-01';
            }
            OnClick_CetakDaftarPpi(listStateData.selectedRowKodePpi, kode_entitas, tglAwal, filterData.date2.format('YYYY-MM-DD'), listStateData.plagTab, token);
        }
    }

    //==================================================================================================
    // Fungsi untuk menampilkan Cetak Form Kecil PHU
    const OnClick_CetakFormKecil = (kode_ppi: any, kode_entitas: string, token: string) => {
        if (kode_ppi === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Silahkan pilih data PPI terlebih dahulu</p>',
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
        let iframe = `
            <html><head>
            <title>Form Penerimaan Piutang | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/form_ppi_kecil?entitas=${kode_entitas}&kode_ppi=${kode_ppi}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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
    };
    // END

    const OnClick_CetakFormBesar = (kode_ppi: any, kode_entitas: string, token: string) => {
        if (kode_ppi === '') {
            // swal.fire({
            //     title: 'Pilih Data terlebih dahulu.',
            //     icon: 'error',
            // });
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Silahkan pilih data PHU terlebih dahulu</p>',
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

        let iframe = `
                <html><head>
                <title>Form Penerimaan Piutang | Next KCN Sytem</title>
                <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
                </head><body>
                <iframe src="./report/form_ppi_besar?entitas=${kode_entitas}&kode_ppi=${kode_ppi}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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
    };

    //==================================================================================================
    // Fungsi untuk menampilkan Cetak Daftar PHU
    const OnClick_CetakDaftarPpi = (kode_ppi: any, kode_entitas: string, tgl_awal: string, tgl_akhir: string, plagTab: string, token: string) => {
        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        let iframe = `
            <html><head>
            <title>Form Penerimaan Piutang | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/daftar_ppi?entitas=${kode_entitas}&param1=${checkboxFilter.isNoBuktiPenerimaanChecked ? filterData.noBuktiPenerimaanValue : 'all'}&param2=${
            checkboxFilter.isTanggalChecked ? moment(filterData.date1).format('YYYY-MM-DD') : 'all'
        }&param3=${checkboxFilter.isTanggalChecked ? moment(filterData.date2).format('YYYY-MM-DD') : 'all'}&param4=${
            checkboxFilter.isTanggalBuatChecked ? moment(filterData.date3).format('YYYY-MM-DD') : 'all'
        }&param5=${checkboxFilter.isTanggalBuatChecked ? moment(filterData.date4).format('YYYY-MM-DD') : 'all'}&param6=${checkboxFilter.isNoTTPChecked ? filterData.noTTPValue : 'all'}&param7=${
            checkboxFilter.isJenisPenerimaanChecked ? filterData.selectedOptionJenisPenerimaan : 'all'
        }&param8=${checkboxFilter.isNoWarkatChecked ? filterData.noWarkatValue : 'all'}&param9=${checkboxFilter.isTanggalJTChecked ? moment(filterData.date5).format('YYYY-MM-DD') : 'all'}&param10=${
            checkboxFilter.isTanggalJTChecked ? moment(filterData.date6).format('YYYY-MM-DD') : 'all'
        }&param11=${checkboxFilter.isTanggalPencairanChecked ? moment(filterData.date7).format('YYYY-MM-DD') : 'all'}&param12=${
            checkboxFilter.isTanggalPencairanChecked ? moment(filterData.date8).format('YYYY-MM-DD') : 'all'
        }&param13=${checkboxFilter.isStatusWarkatChecked ? filterData.selectedOptionStatusWarkat : 'all'}&param14=${checkboxFilter.isNoCustomerChecked ? filterData.noCustomerValue : 'all'}&param15=${
            checkboxFilter.isNamaCustomerChecked ? filterData.namaCustomerValue : 'all'
        }&param16=${checkboxFilter.isNoReffChecked ? filterData.noReffValue : 'all'}&param17=${checkboxFilter.isKolektorChecked ? filterData.kolektorValue : 'all'}&param18=${
            checkboxFilter.isActualKolektorChecked ? filterData.actualKolektorValue : 'all'
        }&param19=${checkboxFilter.isAkunDebetChecked ? filterData.akunDebetValue : 'all'}&param20=${checkboxFilter.isFileBelumKomplitChecked ? 1 : 0}&param21=${
            checkboxFilter.isFileBelumKomplitChecked ? 1 : 0
        }&param22=${0}&param23=${0}&param24=${0}&param25=${selectedRadioKlasifikasiCust !== 'Semua' ? selectedRadioKlasifikasiCust : 'all'}&param26=${
            listStateData.plagTab
        }&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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
    };
    // END

    const gridListDataRefOtomatis = useRef<GridComponent>(null);
    const gridListDataRefManual = useRef<GridComponent>(null);
    const gridListDataRefSemua = useRef<GridComponent>(null);

    const handleTabClick = (tipe: any) => {
        console.log('Tipe = ', tipe);
        if (tipe === 'ppiOtomatis') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedRowKodePpi,
                plagTab: 'PPI OTOMATIS',
            }));
            if (gridListDataRefOtomatis.current) {
                gridListDataRefOtomatis.current.clearSelection();
            }
        } else if (tipe === 'ppiManual') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedRowKodePpi,
                plagTab: 'PPI MANUAL',
            }));
            if (gridListDataRefManual.current) {
                gridListDataRefManual.current.clearSelection();
            }
        } else {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedRowKodePpi,
                plagTab: 'SEMUA',
            }));
            if (gridListDataRefSemua.current) {
                gridListDataRefSemua.current.clearSelection();
            }
        }
    };

    //==================================================================================================
    // Fungsi untuk pilihan button LIST
    const SetDataDokumenPpi = async (
        tipe: string,
        selectedRowKodePpi: string,
        kode_entitas: string,
        setListStateData: Function,
        setDetailDokDataFaktur: Function,
        setDetailDokDataJurnal: Function,
        token: any
    ) => {
        if (selectedRowKodePpi !== '') {
            if (tipe === 'ubah') {
            } else if (tipe === 'detailDok') {
                setListStateData((prevState: any) => ({
                    ...prevState,
                    selectedItem: selectedRowKodePpi,
                }));
                ListDetailDok(selectedRowKodePpi, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal, token);
            }
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PPI terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        }
    };
    // END
    //==================================================================================================

    //==================================================================================================
    // Fungsi untuk menampilkan data detail Dok berdasarkan kode TTB
    const ListDetailDok = async (kode_ppi: any, kode_entitas: any, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function, token: any) => {
        try {
            const resultDetailDataFaktur = await DataDetailDokDataFaktur(kode_ppi, kode_entitas, token);
            await setDetailDokDataFaktur(resultDetailDataFaktur.detailFaktur);
            await setDetailDokDataJurnal(resultDetailDataFaktur.detailJurnal);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // END
    //==================================================================================================

    const customTotJumlahMu = (props: any) => {
        return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
    };

    const totJumlahMu = (args: any) => {
        const jumlahMu = args.result.reduce((total: number, item: any) => {
            return total + parseFloat(item.jumlah_mu === '' ? '0' : item.jumlah_mu);
        }, 0);
        return frmNumber(jumlahMu);
    };

    const btnClickPencairan = async (tipe: any) => {
        vRefreshData.current += 1;
        let dataGrid: any;
        if (listStateData.plagTab === 'PPI OTOMATIS') {
            dataGrid = gridListDataRefOtomatis.current?.getSelectedRecords();
        } else if (listStateData.plagTab === 'PPI MANUAL') {
            dataGrid = gridListDataRefManual.current?.getSelectedRecords();
        } else {
            dataGrid = gridListDataRefSemua.current?.getSelectedRecords();
        }

        if (dataGrid && dataGrid.length > 0) {
            if (tipe === 'pencairan') {
                await setListStateData((prevState: any) => ({
                    ...prevState,
                    masterDataState: 'Pencairan',
                    masterKodeDokumen: dataGrid[0].kode_dokumen,
                    selectedModalJenisPenerimaan: dataGrid[0].kosong === 'C' ? 'Edit Pencairan' : 'Pencairan',
                    tipeDialog: dataGrid[0].kosong === 'C' ? 'Edit Pencairan' : 'Pencairan',
                    selectedKodeSupp: dataGrid[0].kode_supp,
                }));

                if (dataGrid[0].Jenis === 'Tunai' || dataGrid[0].Jenis === 'Transfer') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Dokumen ini bukan Warkat.</p>',
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else if (dataGrid[0].kosong === 'T') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white;">Warkat ${dataGrid[0].no_warkat} sudah ditolak</p>`,
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else {
                    setListStateData((prevState: any) => ({
                        ...prevState,
                        dialogInputDataVisible: true,
                    }));

                    const parent = document.getElementById('parent-element-id');
                    if (parent && parent.classList) {
                        parent.classList.add('some-class');
                    }
                }
            } else if (tipe === 'penolakan') {
                setListStateData((prevState: any) => ({
                    ...prevState,
                    masterDataState: 'Penolakan',
                    masterKodeDokumen: dataGrid[0].kode_dokumen,
                    selectedModalJenisPenerimaan: dataGrid[0].kosong === 'T' ? 'Edit Penolakan' : 'Penolakan',
                    tipeDialog: dataGrid[0].kosong === 'T' ? 'Edit Penolakan' : 'Penolakan',
                    selectedKodeSupp: dataGrid[0].kode_supp,
                }));

                if (dataGrid[0].Jenis === 'Tunai' || dataGrid[0].Jenis === 'Transfer') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Dokumen ini bukan Warkat</p>',
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else if (dataGrid[0].kosong === 'C') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white;">Warkat ${dataGrid[0].no_warkat} sudah dicairkan, batalkan terlebih dahulu</p>`,
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else {
                    setListStateData((prevState: any) => ({
                        ...prevState,
                        dialogInputDataVisible: true,
                    }));
                    // Manipulasi DOM dengan aman
                    const parent = document.getElementById('parent-element-id');
                    if (parent && parent.classList) {
                        // Akses classList di sini
                        parent.classList.add('some-class');
                    }
                }
            } else {
                if (dataGrid[0].kosong === 'C' || dataGrid[0].kosong === 'T') {
                    setListStateData((prevState: any) => ({
                        ...prevState,
                        masterDataState: 'Pembatalan',
                        masterKodeDokumen: dataGrid[0].kode_dokumen,
                        dialogInputDataVisible: true,
                        selectedModalJenisPenerimaan: dataGrid[0].kosong === 'C' ? 'batal cair' : 'batal tolak',
                        tipeDialog: 'Pembatalan',
                        selectedKodeSupp: dataGrid[0].kode_supp,
                        tipeBatal: dataGrid[0].kosong === 'C' ? 'batal cair' : 'batal tolak',
                    }));
                    // Manipulasi DOM dengan aman
                    const parent = document.getElementById('parent-element-id');
                    if (parent && parent.classList) {
                        // Akses classList di sini
                        parent.classList.add('some-class');
                    }
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white;">Pembatalan hanya berlaku pada warkat yang telah cair/ditolak</p>`,
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                }
            }
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PPI terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
    };

    return (
        <div className="Main" id="main-target">
            {/*==================================================================================================*/}
            {/*================================ Tampilan utama Tanda Terima Barang =============================*/}
            {/*==================================================================================================*/}
            <div>
                <div style={{ minHeight: '40px', marginTop: '-3px', marginBottom: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
                            <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} target="#btnRefresh">
                                <TooltipComponent content="Membuat penerimaan piutang baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                                    <TooltipComponent content="Edit data penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                        <TooltipComponent content="Hapus data penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnHapus">
                                            <TooltipComponent content="Cetak data penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnCetak">
                                                <TooltipComponent content="Pencairan penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnPencairan">
                                                    <TooltipComponent content="Penolakan penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnPenolakan">
                                                        <TooltipComponent content="Pembatalan penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnPembatalan">
                                                            <TooltipComponent content="Tampilkan detail penerimaan piutang" opensOn="Hover" openDelay={1000} target="#btnDetail">
                                                                <TooltipComponent content="Persetujuan dokumen" opensOn="Hover" openDelay={1000} target="#btnApproval">
                                                                    <ButtonComponent
                                                                        id="btnBaru"
                                                                        cssClass="e-primary e-small"
                                                                        style={styleButton}
                                                                        disabled={disabledBaru}
                                                                        // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                                        onClick={showBaru}
                                                                        content="Baru"
                                                                    ></ButtonComponent>

                                                                    <ButtonComponent
                                                                        id="btnEdit"
                                                                        cssClass="e-primary e-small"
                                                                        style={styleButton}
                                                                        disabled={disabledEdit}
                                                                        onClick={showEditRecord}
                                                                        content="Ubah"
                                                                    ></ButtonComponent>
                                                                    <ButtonComponent
                                                                        id="btnFilter"
                                                                        cssClass="e-primary e-small"
                                                                        style={
                                                                            sidebarVisible
                                                                                ? { width: '57px', height: '28px', marginBottom: '0.5em', marginTop: '0.5em', marginRight: '0.8em' }
                                                                                : { ...styleButton, color: 'white' }
                                                                        }
                                                                        // disabled={disabledFilter}
                                                                        disabled={sidebarVisible}
                                                                        //onClick={showFilterData}
                                                                        onClick={toggleClick}
                                                                        content="Filter"
                                                                    ></ButtonComponent>

                                                                    {/* <ButtonComponent
                                                                    id="btnHapus"
                                                                    cssClass="e-primary e-small"
                                                                    style={styleButton}
                                                                    disabled={disabledHapus}
                                                                    // onClick={showDeleteRecord}
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
                                                                        style={
                                                                            userMenu.cetak === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR'
                                                                                ? { ...styleButton, width: 75 + 'px' }
                                                                                : { ...styleButtonDisabled, width: 75 + 'px', color: '#1c1b1f61' }
                                                                        }
                                                                        disabled={userMenu.cetak === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                                                        onClick={btnPrintClick}
                                                                        content="Cetak"
                                                                        iconCss="e-icons e-medium e-chevron-down"
                                                                        iconPosition="Right"
                                                                    ></ButtonComponent>

                                                                    <ButtonComponent
                                                                        id="btnPencairan"
                                                                        cssClass="e-primary e-small"
                                                                        style={{
                                                                            width: 85 + 'px',
                                                                            height: 28,
                                                                            marginBottom: '0.5em',
                                                                            marginTop: 0.5 + 'em',
                                                                            marginRight: 0.8 + 'em',
                                                                            backgroundColor: '#e6e6e6',
                                                                            color: 'black',
                                                                        }}
                                                                        disabled={false}
                                                                        onClick={() => btnClickPencairan('pencairan')}
                                                                        content={state.contentPencairan}
                                                                    ></ButtonComponent>

                                                                    <ButtonComponent
                                                                        id="btnPenolakan"
                                                                        cssClass="e-primary e-small"
                                                                        style={{
                                                                            width: 85 + 'px',
                                                                            height: 28,
                                                                            marginBottom: '0.5em',
                                                                            marginTop: 0.5 + 'em',
                                                                            marginRight: 0.8 + 'em',
                                                                            backgroundColor: '#e6e6e6',
                                                                            color: 'black',
                                                                        }}
                                                                        disabled={false}
                                                                        onClick={() => btnClickPencairan('penolakan')}
                                                                        content={state.contentPenolakan}
                                                                    ></ButtonComponent>

                                                                    <ButtonComponent
                                                                        id="btnPembatalan"
                                                                        cssClass="e-primary e-small"
                                                                        style={{
                                                                            width: 85 + 'px',
                                                                            height: 28,
                                                                            marginBottom: '0.5em',
                                                                            marginTop: 0.5 + 'em',
                                                                            marginRight: 0.8 + 'em',
                                                                            backgroundColor: '#e6e6e6',
                                                                            color: 'black',
                                                                        }}
                                                                        disabled={false}
                                                                        onClick={() => btnClickPencairan('pembatalan')}
                                                                        content={state.contentPembatalan}
                                                                    ></ButtonComponent>

                                                                    <ButtonComponent
                                                                        id="btnDetail"
                                                                        cssClass="e-primary e-small"
                                                                        style={{
                                                                            width: 100 + 'px',
                                                                            marginBottom: '0.5em',
                                                                            marginTop: 0.5 + 'em',
                                                                            marginRight: 0.8 + 'em',
                                                                            backgroundColor: '#e6e6e6',
                                                                            color: 'black',
                                                                        }}
                                                                        disabled={false}
                                                                        onClick={() =>
                                                                            // SetDataDokumenTtb('detailDok', selectedRowKodeTtb, kode_entitas, dataDetailDokTtb, router, setSelectedItem, setDetailDok)
                                                                            SetDataDokumenPpi(
                                                                                'detailDok',
                                                                                listStateData.selectedRowKodePpi,
                                                                                kode_entitas,
                                                                                setListStateData,
                                                                                setDetailDokDataFaktur,
                                                                                setDetailDokDataJurnal,
                                                                                token
                                                                            )
                                                                        }
                                                                        iconCss={state.iconCss}
                                                                        content={state.content}
                                                                    ></ButtonComponent>

                                                                    {/* <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}> */}
                                                                    <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                                        <TextBoxComponent
                                                                            id="cariNoBukti"
                                                                            className="searchtext"
                                                                            placeholder="<Cari No. Bukti>"
                                                                            showClearButton={true}
                                                                            //input={(args: FocusInEventArgs) => {
                                                                            input={(args: ChangeEventArgsInput) => {
                                                                                const value: any = args.value;
                                                                                PencarianNoBukti(value, setFilterData, setFilteredData, recordsDataRef.current);
                                                                            }}
                                                                            floatLabelType="Never"
                                                                        />
                                                                    </div>

                                                                    <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                                        <TextBoxComponent
                                                                            id="cariJumlah"
                                                                            className="searchtext"
                                                                            placeholder="<Cari Jumlah>"
                                                                            showClearButton={true}
                                                                            //input={(args: FocusInEventArgs) => {
                                                                            input={(args: ChangeEventArgsInput) => {
                                                                                const value: any = args.value;
                                                                                PencarianJumlah(value, setFilterData, setFilteredData, recordsDataRef.current);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </TooltipComponent>
                                    </TooltipComponent>
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </div>
                    <div className="ml-3 mr-1" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                            PPI List Data
                        </span>
                    </div>
                </div>

                <div id="main-content" style={{ display: 'flex', gap: '3px', position: 'sticky', overflow: 'hidden' }}>
                    <SidebarComponent
                        id="default-sidebar"
                        target={'#main-content'}
                        ref={(Sidebar) => (sidebarObj = Sidebar as any)}
                        // style={{ background: 'transparent', visibility: 'hidden', marginRight: '0.8em' }}
                        style={{
                            background: 'transparent',
                            marginRight: '0.8em',
                            display: 'block',
                            visibility: sidebarVisible ? 'visible' : 'hidden',
                            // maxHeight: `100px`,
                            overflowY: 'auto',
                        }}
                        created={onCreate}
                        //showBackdrop={showBackdrop}
                        type={type}
                        width="315px"
                        height={200}
                        mediaQuery={mediaQueryState}
                        isOpen={true}
                        open={() => setSidebarVisible(true)}
                        close={() => setSidebarVisible(false)}
                        enableGestures={false}
                    >
                        {/* ===============  Filter Data ========================   */}
                        {/* {disabledFilter && ( */}
                        <div className="panel-filter" style={{ background: '#dedede', width: '100%' }}>
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
                            <div className="flex">
                                <CheckBoxComponent
                                    label="No. Bukti Penerimaan"
                                    checked={checkboxFilter.isNoBuktiPenerimaanChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoBuktiPenerimaanChecked: value,
                                        }));
                                    }}
                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noBuktiPenerimaanValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoBuktiPenerimaanInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

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
                                            HandleTglPpi(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
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
                                            HandleTglPpi(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Tanggal Buat"
                                    checked={checkboxFilter.isTanggalBuatChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isTanggalBuatChecked: value,
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
                                        value={filterData.date3.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglBuat(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
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
                                        value={filterData.date4.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglBuat(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. TTP"
                                    checked={checkboxFilter.isNoTTPChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoTTPChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noTTPValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoTtpInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Jenis Penerimaan"
                                    checked={checkboxFilter.isJenisPenerimaanChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isJenisPenerimaanChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        id="jenis"
                                        className="form-select"
                                        dataSource={ValueJenisPenerimaan.map((data: any) => data.value)}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleJenisPenerimaanChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                        value={filterData.selectedOptionJenisPenerimaan}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Warkat"
                                    checked={checkboxFilter.isNoWarkatChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoWarkatChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noWarkatValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoWarkatChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Jatuh Tempo Warkat"
                                    checked={checkboxFilter.isTanggalJTChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isTanggalJTChecked: value,
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
                                        value={filterData.date5.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglPpiJt(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
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
                                        value={filterData.date6.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglPpiJt(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Pencairan/Penolakan"
                                    checked={checkboxFilter.isTanggalPencairanChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isTanggalPencairanChecked: value,
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
                                        value={filterData.date7.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglPpiPencairan(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
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
                                        value={filterData.date8.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglPpiPencairan(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Status Warkat"
                                    checked={checkboxFilter.isStatusWarkatChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isStatusWarkatChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        id="jenis"
                                        className="form-select"
                                        dataSource={ValueStatusWarkat.map((data: any) => data.value)}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleStatusWarkatChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                        value={filterData.selectedOptionStatusWarkat}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Customer"
                                    checked={checkboxFilter.isNoCustomerChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoCustomerChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noCustomerValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoCustomerInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Nama Customer"
                                    checked={checkboxFilter.isNamaCustomerChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNamaCustomerChecked: value,
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
                                            HandleNamaCustomerInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Reff (Faktur Penjualan)"
                                    checked={checkboxFilter.isNoReffChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoReffChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noReffValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoReffInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Kolektor"
                                    checked={checkboxFilter.isKolektorChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isKolektorChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.kolektorValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleKolektorChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Actual Kolektor"
                                    checked={checkboxFilter.isActualKolektorChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isActualKolektorChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.actualKolektorValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleActualKolektorChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Akun Debet"
                                    checked={checkboxFilter.isAkunDebetChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isAkunDebetChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.akunDebetValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleAkunDebetChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="File pendukung belum komplit"
                                    checked={checkboxFilter.isFileBelumKomplitChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isFileBelumKomplitChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            {/* <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Dokumen PPI belum divalidasi"
                                    checked={checkboxFilter.isFileBelumValidasiChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isFileBelumValidasiChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Validasi Dokumen #1"
                                    checked={checkboxFilter.isFileValidasi1Checked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isFileValidasi1Checked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Validasi Dokumen #2"
                                    checked={checkboxFilter.isFileValidasi2Checked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isFileValidasi2Checked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Validasi Dokumen #3"
                                    checked={checkboxFilter.isFileValidasi3Checked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isFileValidasi3Checked: value,
                                        }));
                                    }}
                                />
                            </div> */}

                            <div className="mt-3 flex items-center">
                                <div className="font-bold">Klasifikasi Customer</div>
                            </div>
                            <div>
                                <div className="flex" style={{}}>
                                    <div>
                                        <label className="inline-flex">
                                            <input
                                                type="radio"
                                                name="customer_classification"
                                                className="form-radio"
                                                value="Semua"
                                                checked={selectedRadioKlasifikasiCust === 'Semua'}
                                                onChange={handleRadioKlasifikasiCust}
                                                style={{ marginTop: 2 }}
                                            />
                                            <span className="ml-2">Semua</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex" style={{ marginTop: -2 }}>
                                    <div>
                                        <label className="inline-flex">
                                            <input
                                                type="radio"
                                                name="customer_classification"
                                                className="form-radio"
                                                value="AF"
                                                checked={selectedRadioKlasifikasiCust === 'AF'}
                                                onChange={handleRadioKlasifikasiCust}
                                                style={{ marginTop: 2 }}
                                            />
                                            <span className="ml-2">A - F</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex" style={{ marginTop: -2 }}>
                                    <div>
                                        <label className="inline-flex">
                                            <input
                                                type="radio"
                                                name="customer_classification"
                                                className="form-radio"
                                                value="G"
                                                checked={selectedRadioKlasifikasiCust === 'G'}
                                                onChange={handleRadioKlasifikasiCust}
                                                style={{ marginTop: 2 }}
                                            />
                                            <span className="ml-2">G</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex" style={{ marginTop: -2 }}>
                                    <div>
                                        <label className="inline-flex">
                                            <input
                                                type="radio"
                                                name="customer_classification"
                                                className="form-radio"
                                                value="H"
                                                checked={selectedRadioKlasifikasiCust === 'H'}
                                                onChange={handleRadioKlasifikasiCust}
                                                style={{ marginTop: 2 }}
                                            />
                                            <span className="ml-2">H</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SidebarComponent>

                    {/* ===============  Grid Data ========================   */}
                    <div className="panel" style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 315px' : ' 0'), overflowY: 'auto' }}>
                        <div className="panel-data" style={{ width: '100%' }}>
                            {/* <TooltipComponent ref={(t: any) => (tooltipListData = t)} opensOn="Hover" beforeRender={beforeRenderListData} target=".e-headertext"> */}
                            <TabComponent id="defaultTab" animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}>
                                <div className="e-tab-header" style={{ marginBottom: 10 }}>
                                    <div tabIndex={0} onClick={() => handleTabClick('ppiOtomatis')}>
                                        {' '}
                                        PPI Otomatis{' '}
                                    </div>
                                    <div tabIndex={1} onClick={() => handleTabClick('ppiManual')}>
                                        {' '}
                                        PPI Manual{' '}
                                    </div>
                                    <div tabIndex={2} onClick={() => handleTabClick('semua')}>
                                        {' '}
                                        Semua{' '}
                                    </div>
                                </div>
                                <div className="e-content">
                                    {/*===================tabindex0=============================== */}
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                        <GridComponent
                                            key={gridKey}
                                            id="gridListData"
                                            locale="id"
                                            ref={gridListDataRefOtomatis}
                                            //dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                            dataSource={
                                                filterData.searchNoBukti !== '' || filterData.searchJumlah !== ''
                                                    ? filteredData
                                                    : filterData.plagOtomatis === 'otomatis'
                                                    ? ppiOtomatis
                                                    : recordsDataRef.current
                                            }
                                            allowExcelExport={true}
                                            excelExportComplete={ExportComplete}
                                            allowPdfExport={true}
                                            pdfExportComplete={ExportComplete}
                                            editSettings={{ allowDeleting: true }}
                                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                                            allowPaging={true}
                                            allowSorting={true}
                                            allowFiltering={false}
                                            allowResizing={true}
                                            autoFit={true}
                                            allowReordering={true}
                                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                            rowHeight={22}
                                            width={'100%'}
                                            height={500}
                                            gridLines={'Both'}
                                            // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            queryCellInfo={queryCellInfoListData}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={selectedRowsData}
                                            recordDoubleClick={handleRowDoubleClicked}
                                            rowSelecting={selectingRowsData}
                                            // actionBegin={(args: any) => {
                                            //     if (vRefreshData.current === 0) {
                                            //         actionBeginDetailBarang(args);
                                            //     }
                                            // }}
                                            dataBound={() => {
                                                if (gridListData) {
                                                    gridListData.selectRow(rowIdxListData.current);
                                                }
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_dokumen"
                                                    headerText="No. Bukti"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    // clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                />
                                                <ColumnDirective
                                                    field="tgl_dokumen"
                                                    headerText="Tanggal"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="tgl_trxdokumen"
                                                    headerText="Tgl. Buat"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="no_TTP"
                                                    headerText="No. TTP"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="130"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="no_warkat"
                                                    headerText="No. Cek/BG"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="tgl_valuta"
                                                    headerText="Tgl. Jatuh Tempo"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="tgl_pengakuan"
                                                    headerText="Tgl. Pencairan/Tolak"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="125"
                                                    type="date"
                                                    clipMode="EllipsisWithTooltip"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="jumlah_mu"
                                                    headerText="Jumlah"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    format="N2"
                                                    //autoFit
                                                    width="150"
                                                    // clipMode="EllipsisWithTooltip"
                                                    // template={(args: any) => <div style={{ color: 'red' }}>{CurrencyFormat(args.jumlah_mu)}</div>}
                                                    customAttributes={{ class: styles['custom-css'] }}
                                                />
                                                <ColumnDirective
                                                    field="Jenis"
                                                    headerText="Pembayaran"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                    // headerTemplate={gudangHeader}
                                                />
                                                <ColumnDirective
                                                    field="kelas"
                                                    headerText="Kelas"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="60"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="no_cust"
                                                    headerText="No. Cust"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_cust"
                                                    headerText="Nama Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="300"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_akun"
                                                    headerText="Akun Debet"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="120"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_sales"
                                                    headerText="Kolektor"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="status"
                                                    headerText="Status"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                            </ColumnsDirective>
                                            <AggregatesDirective>
                                                <AggregateDirective>
                                                    <AggregateColumnsDirective>
                                                        <AggregateColumnDirective field="jumlah_mu" type="Custom" customAggregate={totJumlahMu} footerTemplate={customTotJumlahMu} />
                                                    </AggregateColumnsDirective>
                                                </AggregateDirective>
                                            </AggregatesDirective>
                                            <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                    {/* ===========tabindex1========================= */}
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                        <GridComponent
                                            key={gridKey}
                                            id="gridListData"
                                            locale="id"
                                            ref={gridListDataRefManual}
                                            // dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                            dataSource={
                                                filterData.searchNoBukti !== '' || filterData.searchJumlah !== ''
                                                    ? filteredData
                                                    : filterData.plagOtomatis === 'otomatis'
                                                    ? ppiManual
                                                    : recordsDataRef.current
                                            }
                                            allowExcelExport={true}
                                            excelExportComplete={ExportComplete}
                                            allowPdfExport={true}
                                            pdfExportComplete={ExportComplete}
                                            editSettings={{ allowDeleting: true }}
                                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                                            allowPaging={true}
                                            allowSorting={true}
                                            allowFiltering={false}
                                            allowResizing={true}
                                            autoFit={true}
                                            allowReordering={true}
                                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                            rowHeight={22}
                                            width={'100%'}
                                            height={500}
                                            gridLines={'Both'}
                                            // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            queryCellInfo={queryCellInfoListData}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={selectedRowsDataManual}
                                            recordDoubleClick={handleRowDoubleClickedManual}
                                            rowSelecting={selectingRowsDataManual}
                                            // actionBegin={(args: any) => {
                                            //     if (vRefreshData.current === 0) {
                                            //         actionBeginDetailBarang(args);
                                            //     }
                                            // }}
                                            dataBound={() => {
                                                if (gridListData) {
                                                    gridListData.selectRow(rowIdxListData.current);
                                                }
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_dokumen"
                                                    headerText="No. Bukti"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    // clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                />
                                                <ColumnDirective
                                                    field="tgl_dokumen"
                                                    headerText="Tanggal"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="tgl_trxdokumen"
                                                    headerText="Tgl. Buat"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="no_TTP"
                                                    headerText="No. TTP"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="130"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="no_warkat"
                                                    headerText="No. Cek/BG"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="tgl_valuta"
                                                    headerText="Tgl. Jatuh Tempo"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="tgl_pengakuan"
                                                    headerText="Tgl. Pencairan/Tolak"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="125"
                                                    type="date"
                                                    clipMode="EllipsisWithTooltip"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="jumlah_mu"
                                                    headerText="Jumlah"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    format="N2"
                                                    //autoFit
                                                    width="150"
                                                    // clipMode="EllipsisWithTooltip"
                                                    // template={(args: any) => <div style={{ color: 'red' }}>{CurrencyFormat(args.jumlah_mu)}</div>}
                                                    customAttributes={{ class: styles['custom-css'] }}
                                                />
                                                <ColumnDirective
                                                    field="Jenis"
                                                    headerText="Pembayaran"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                    // headerTemplate={gudangHeader}
                                                />
                                                <ColumnDirective
                                                    field="kelas"
                                                    headerText="Kelas"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="60"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="no_cust"
                                                    headerText="No. Cust"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_cust"
                                                    headerText="Nama Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="300"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_akun"
                                                    headerText="Akun Debet"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="120"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_sales"
                                                    headerText="Kolektor"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="status"
                                                    headerText="Status"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                            </ColumnsDirective>
                                            <AggregatesDirective>
                                                <AggregateDirective>
                                                    <AggregateColumnsDirective>
                                                        <AggregateColumnDirective field="jumlah_mu" type="Custom" customAggregate={totJumlahMu} footerTemplate={customTotJumlahMu} />
                                                    </AggregateColumnsDirective>
                                                </AggregateDirective>
                                            </AggregatesDirective>
                                            <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                    {/* ===========tabindex2========================= */}
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={2}>
                                        <GridComponent
                                            key={gridKey}
                                            id="gridListData"
                                            locale="id"
                                            ref={gridListDataRefSemua}
                                            dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                            allowExcelExport={true}
                                            excelExportComplete={ExportComplete}
                                            allowPdfExport={true}
                                            pdfExportComplete={ExportComplete}
                                            editSettings={{ allowDeleting: true }}
                                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                                            allowPaging={true}
                                            allowSorting={true}
                                            allowFiltering={false}
                                            allowResizing={true}
                                            autoFit={true}
                                            allowReordering={true}
                                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                            rowHeight={22}
                                            width={'100%'}
                                            height={500}
                                            gridLines={'Both'}
                                            // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            queryCellInfo={queryCellInfoListData}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={selectedRowsDataSemua}
                                            recordDoubleClick={handleRowDoubleClickedSemua}
                                            rowSelecting={selectingRowsDataSemua}
                                            // actionBegin={(args: any) => {
                                            //     if (vRefreshData.current === 0) {
                                            //         actionBeginDetailBarang(args);
                                            //     }
                                            // }}
                                            dataBound={() => {
                                                if (gridListData) {
                                                    gridListData.selectRow(rowIdxListData.current);
                                                }
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_dokumen"
                                                    headerText="No. Bukti"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    // clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                />
                                                <ColumnDirective
                                                    field="tgl_dokumen"
                                                    headerText="Tanggal"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="tgl_trxdokumen"
                                                    headerText="Tgl. Buat"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="no_TTP"
                                                    headerText="No. TTP"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="130"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="no_warkat"
                                                    headerText="No. Cek/BG"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="tgl_valuta"
                                                    headerText="Tgl. Jatuh Tempo"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="tgl_pengakuan"
                                                    headerText="Tgl. Pencairan/Tolak"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="125"
                                                    type="date"
                                                    clipMode="EllipsisWithTooltip"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="jumlah_mu"
                                                    headerText="Jumlah"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    format="N2"
                                                    //autoFit
                                                    width="150"
                                                    // clipMode="EllipsisWithTooltip"
                                                    // template={(args: any) => <div style={{ color: 'red' }}>{CurrencyFormat(args.jumlah_mu)}</div>}
                                                    customAttributes={{ class: styles['custom-css'] }}
                                                />
                                                <ColumnDirective
                                                    field="Jenis"
                                                    headerText="Pembayaran"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                    // headerTemplate={gudangHeader}
                                                />
                                                <ColumnDirective
                                                    field="kelas"
                                                    headerText="Kelas"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="60"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="no_cust"
                                                    headerText="No. Cust"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_cust"
                                                    headerText="Nama Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="300"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_akun"
                                                    headerText="Akun Debet"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="120"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="nama_sales"
                                                    headerText="Kolektor"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="status"
                                                    headerText="Status"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="80"
                                                    // clipMode="EllipsisWithTooltip"
                                                />
                                            </ColumnsDirective>
                                            <AggregatesDirective>
                                                <AggregateDirective>
                                                    <AggregateColumnsDirective>
                                                        <AggregateColumnDirective field="jumlah_mu" type="Custom" customAggregate={totJumlahMu} footerTemplate={customTotJumlahMu} />
                                                    </AggregateColumnsDirective>
                                                </AggregateDirective>
                                            </AggregatesDirective>
                                            <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                </div>
                            </TabComponent>
                            {/* </TooltipComponent> */}
                            {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                            <ContextMenuComponent id="contextmenu" target=".e-gridheader" items={menuHeaderItems} select={menuHeaderSelect} animationSettings={{ duration: 800, effect: 'FadeIn' }} />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div style={{ minHeight: '51px', marginTop: '-24px', marginBottom: '11px', width: '308px', backgroundColor: '#dedede', visibility: sidebarVisible ? 'visible' : 'hidden' }}>
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
                        }}
                    >
                        <div className="flex">
                            <div style={{ width: '172px' }}>
                                <TooltipComponent content="Update File Pendukung" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Update File Pendukung"
                                        style={{ backgroundColor: '#9f9a9a', marginTop: '15px', marginLeft: '10px', color: 'black' }}
                                        onClick={showUpdateFilePendukung}
                                    />
                                </TooltipComponent>
                            </div>
                            <div style={{ width: '140px' }}>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className={styles['custom-box-wrapper']}>
                                        <div className={styles['custom-box-ttp-lengkap']}></div>
                                        <div className={styles['box-text']}>TTP Lengkap</div>
                                    </div>
                                </div>
                            </div>
                            {/* <div style={{ width: '147px' }}>
                                <TooltipComponent content="Validasai Dokumen" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        disabled={true}
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Validasi Dokumen"
                                        style={{ backgroundColor: '#9f9a9a', marginTop: '15px', marginLeft: '10px', color: 'black' }}
                                        onClick={handleRefreshData}
                                    />
                                </TooltipComponent>
                            </div>
                            <div style={{ width: '195px' }}>
                                <TooltipComponent content="Pengganti Faktur Tagihan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Pengganti Faktur Tagihan"
                                        style={{ backgroundColor: '#9f9a9a', marginTop: '15px', marginLeft: '10px', color: 'red' }}
                                        onClick={handleRefreshData}
                                    />
                                </TooltipComponent>
                            </div> */}
                            <div style={{ width: '10%' }}></div>
                        </div>
                    </div>
                </div>
                {/* <div style={{ minHeight: '51px', marginTop: '-24px', marginBottom: '11px', width: '308px', backgroundColor: '#dedede', visibility: sidebarVisible ? 'visible' : 'hidden' }}>
                    <div className="mt-6 flex justify-center">
                        <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                            <ButtonComponent
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-medium e-refresh"
                                content="Refresh Data"
                                style={{ backgroundColor: '#3b3f5c', marginTop: '15px' }}
                                onClick={handleRefreshData}
                            />
                        </TooltipComponent>
                    </div>
                </div> */}
            </div>
            {/*==================================================================================================*/}
            {listStateData.selectedItem && (
                <Draggable>
                    <div className={`${styles.modalDetailDragable}`} style={modalPosition}>
                        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                            <div style={{ marginBottom: 10 }}>
                                <div className="flex items-center text-center">
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
                                    <span style={{ fontSize: 18, fontWeight: 500, marginLeft: 10 }}>
                                        Detail Penerimaan Piutang : {listStateData.noDokumen} - {moment(listStateData.tglDokumen).format('DD-MM-YYYY')}
                                    </span>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#73ed73', textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>
                                <span>Data Faktur</span>
                            </div>
                            <GridComponent
                                dataSource={detailDokDataFaktur}
                                height={100}
                                // width={'80%'}
                                gridLines={'Both'}
                                allowSorting={true}
                                ref={(g: any) => (gridListData = g)}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="no_fj" headerText="No. Faktur" width="80" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="tgl_fj"
                                        type="date"
                                        format={formatDate}
                                        headerText="Tanggal"
                                        width="80"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="tgl_jt"
                                        type="date"
                                        format={formatDate}
                                        headerText="Jatuh Tempo"
                                        width="80"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="hari"
                                        template={(args: any) => <div>{args.hari < 0 ? '(' + args.hari * -1 + ')' : args.hari}</div>}
                                        headerText="Hari"
                                        width="50"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="netto_mu" headerText="Nilai Faktur" width="100" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="bayar_mu" headerText="Dibayar" width="100" textAlign="Right" headerTextAlign="Center" />
                                </ColumnsDirective>
                                <Inject services={[Page, Sort, Filter, Group]} />
                            </GridComponent>
                            <div style={{ backgroundColor: '#73ed73', textAlign: 'center', fontWeight: 'bold', fontSize: 12, marginTop: 4 }}>
                                <span>Data Jurnal</span>
                            </div>
                            <GridComponent
                                dataSource={detailDokDataJurnal}
                                height={120}
                                // width={'80%'}
                                gridLines={'Both'}
                                allowSorting={true}
                                ref={(g: any) => (gridListData = g)}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="no_akun" headerText="No. Akun" width="80" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="nama_akun" headerText="Nama" width="200" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="debet_rp" headerText="Debet" width="100" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="kredit_rp" headerText="Kredit" width="100" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="catatan" headerText="Keterangan" width="250" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="kode_mu" headerText="MU" width="50" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="kurs" headerText="Kurs" width="70" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="jumlah_rp"
                                        template={(args: any) => <div>{args.jumlah_rp < 0 ? '(' + args.jumlah_rp * -1 + ')' : args.jumlah_rp}</div>}
                                        headerText="Jumlah"
                                        width="100"
                                        textAlign="Right"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="subledger" headerText="Subledger" width="200" textAlign="Left" headerTextAlign="Center" />
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

            {listStateData.tipeDialog === 'Tunai' ? (
                <DialogPpiListTunai
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={listStateData.masterKodeDokumen}
                    masterDataState={listStateData.masterDataState}
                    masterBarangProduksi={masterBarangProduksi}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                        if (gridListDataRefOtomatis.current) {
                            gridListDataRefOtomatis.current.clearSelection();
                        }
                        if (gridListDataRefManual.current) {
                            gridListDataRefManual.current.clearSelection();
                        }
                        if (gridListDataRefSemua.current) {
                            gridListDataRefSemua.current.clearSelection();
                        }
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
                    masterBarangProduksi={masterBarangProduksi}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                        if (gridListDataRefOtomatis.current) {
                            gridListDataRefOtomatis.current.clearSelection();
                        }
                        if (gridListDataRefManual.current) {
                            gridListDataRefManual.current.clearSelection();
                        }
                        if (gridListDataRefSemua.current) {
                            gridListDataRefSemua.current.clearSelection();
                        }
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
                    masterBarangProduksi={masterBarangProduksi}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                        if (gridListDataRefOtomatis.current) {
                            gridListDataRefOtomatis.current.clearSelection();
                        }
                        if (gridListDataRefManual.current) {
                            gridListDataRefManual.current.clearSelection();
                        }
                        if (gridListDataRefSemua.current) {
                            gridListDataRefSemua.current.clearSelection();
                        }
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
                    masterBarangProduksi={masterBarangProduksi}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                        if (gridListDataRefOtomatis.current) {
                            gridListDataRefOtomatis.current.clearSelection();
                        }
                        if (gridListDataRefManual.current) {
                            gridListDataRefManual.current.clearSelection();
                        }
                        if (gridListDataRefSemua.current) {
                            gridListDataRefSemua.current.clearSelection();
                        }
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
                    masterBarangProduksi={masterBarangProduksi}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                        if (gridListDataRefOtomatis.current) {
                            gridListDataRefOtomatis.current.clearSelection();
                        }
                        if (gridListDataRefManual.current) {
                            gridListDataRefManual.current.clearSelection();
                        }
                        if (gridListDataRefSemua.current) {
                            gridListDataRefSemua.current.clearSelection();
                        }
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
                    masterBarangProduksi={masterBarangProduksi}
                    isOpen={listStateData.dialogInputDataVisible}
                    onClose={() => {
                        setListStateData((prevState: any) => ({
                            ...prevState,
                            dialogInputDataVisible: false,
                            masterKodeDokumen: 'BARU',
                        }));
                        if (gridListDataRefOtomatis.current) {
                            gridListDataRefOtomatis.current.clearSelection();
                        }
                        if (gridListDataRefManual.current) {
                            gridListDataRefManual.current.clearSelection();
                        }
                        if (gridListDataRefSemua.current) {
                            gridListDataRefSemua.current.clearSelection();
                        }
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

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog Show Baru (Filter Jenis Pembayaran) =============================*/}
            {/*==================================================================================================*/}
            {listStateData.dialogFilterJenisPenerimaan && (
                <DialogComponent
                    id="dialogPpiJenisPembayaran"
                    name="dialogPpiJenisPembayaran"
                    className="dialogPpiJenisPembayaran"
                    target="#main-target"
                    // header="Pembayaran Hutang"
                    header={() => {
                        let header: JSX.Element | string = '';
                        header = (
                            <div>
                                <div className="header-title">Pembayaran Piutang</div>
                            </div>
                        );

                        return header;
                    }}
                    visible={listStateData.dialogFilterJenisPenerimaan}
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
                    close={closeModalShowBaru}
                    // buttons={buttonInputData}
                >
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>[ Jenis Pembayaran ]</span>
                    </div>
                    <hr style={{ marginBottom: 10 }}></hr>
                    <div className="flex items-center">
                        <RadioButtonComponent
                            id="Tunai"
                            label="Tunai"
                            name="size"
                            checked={listStateData.selectedModalJenisPenerimaan === 'Tunai'}
                            change={() => changeModalJenisPenerimaan('Tunai')}
                            ref={(radio1) => (radioInstanceTunai = radio1 as any)}
                            cssClass="e-small"
                            style={{ fontSize: 10 }}
                        />
                    </div>
                    <div className="flex items-center" style={{ marginTop: 10 }}>
                        <RadioButtonComponent
                            id="Transfer"
                            label="Transfer Bank"
                            name="size"
                            checked={listStateData.selectedModalJenisPenerimaan === 'Transfer'}
                            change={() => changeModalJenisPenerimaan('Transfer')}
                            ref={(radio3) => (radioInstanceTransfer = radio3 as any)}
                            cssClass="e-small"
                        />
                    </div>
                    <div className="flex items-center" style={{ marginTop: 10 }}>
                        <RadioButtonComponent
                            id="Warkat"
                            label="Warkat (Cek / BG)"
                            name="size"
                            checked={listStateData.selectedModalJenisPenerimaan === 'Warkat'}
                            change={() => changeModalJenisPenerimaan('Warkat')}
                            ref={(radio3) => (radioInstanceWarkat = radio3 as any)}
                            cssClass="e-small"
                        />
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
                            onClick={closeModalShowBaru}
                        />
                        <ButtonComponent
                            id="buSimpan"
                            content="OK"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                            onClick={() => showNewRecord(listStateData.selectedModalJenisPenerimaan)}
                        />
                    </div>
                </DialogComponent>
            )}
            {/*==================================================================================================*/}
        </div>
    );
};

// export { getServerSideProps };

export default PPIList;
