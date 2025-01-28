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
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
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
    Aggregate,
    Freeze,
    ExcelExport,
    PdfExport,
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
import styles from './phulist.module.css';
// import { SetDataDokumenTtb, PencarianNoTtb, PencarianNoReff } from './component/fungsiFormTtbList';
import { GetPeriode } from './model/apiPhu';
import { frmNumber, showLoading, usersMenu } from '@/utils/routines';
import Draggable from 'react-draggable';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import {
    HandleAkunKreditChange,
    HandleJenisPembayaranChange,
    HandleNamaSupplierInputChange,
    HandleNoBuktiPembayaranInputChange,
    HandleNoSupplierInputChange,
    HandleNoWarkatChange,
    HandleTglPhu,
    HandleTglPhuJt,
    HandleTglPhuPencairan,
    ValueJenisPembayaran,
    HandleNoReffInputChange,
    CurrencyFormat,
    PencarianNoBukti,
    PencarianJumlah,
    HandleRowSelected,
    SetDataDokumenPhu,
    RowSelectingListData,
    ListDetailDok,
    OnClick_CetakFormKecil,
    OnClick_CetakDaftarPhu,
    OnClick_CetakFormBesar,
} from './component/fungsiFormPhuList';
import { GetListPhuEffect } from './model/apiPhu';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import DialogPhuList from './component/dialogPhuList';
import { useSession } from '@/pages/api/sessionContext';
import DialogPhuListTransfer from './component/dialogPhuListTransfer';
import DialogPhuListWarkat from './component/dialogPhuListWarkat';
import DialogPencairanWarkat from './component/dialogPencairanWarkat';
import DialogPenolakanWarkat from './component/dialogPenolakanWarkat';
import DialogPembatalanWarkat from './component/dialogPembatalanWarkat';
import { SafelyAddClassToRef } from './component/template';

enableRipple(true);

// interface PHUListProps {
//     userid: any;
//     kode_entitas: any;
//     kode_user: any;
// }

const PHUList = () => {
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
    const parentRef = useRef<HTMLDivElement>(null);

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
    // ============================ Pembayaran Hutang (PHU) ===========================================
    // State Baru Untuk PHU
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
        tipe: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '', tipe: '' });
    const kode_menu = '60201'; // kode menu PHU

    // ================== State untuk filter data list ===============================
    const [filterData, setFilterData] = useState({
        noBuktiPembayaranValue: '',
        date1: moment(), // tanggal awal PHU
        date2: moment().endOf('month'), // tanggal akhir PHU
        noSupplierValue: '',
        namaSupplierValue: '',
        noReffValue: '',
        selectedOptionJenisPembayaran: '',
        noWarkatValue: '',
        date3: moment(), // tanggal awal jatuh tempo warkat
        date4: moment().endOf('month'), // tanggal akhir jatuh tempo warkat
        date5: moment(), // tanggal awal pencairan/penolakan
        date6: moment().endOf('month'), // tanggal akhir pencairan/penolakan
        akunKreditValue: '',
        searchNoBukti: '',
        searchJumlah: '',
    });
    // End

    // ================== State untuk filter data list yang berupa checkbox ===============================
    const [checkboxFilter, setCheckboxFilter] = useState({
        isNoBuktiPembayaranChecked: false,
        isTanggalChecked: true,
        isNoSupplierChecked: false,
        isNamaSupplierChecked: false,
        isNoReffChecked: false,
        isJenisPembayaraChecked: false,
        isNoWarkatChecked: false,
        isTanggalJTChecked: false,
        isTanggalPencairanChecked: false,
        isAkunKreditChecked: false,
    });
    // End

    // ================== State untuk all list data ===============================
    const [listStateData, setListStateData] = useState({
        selectedRowKodePhu: '',
        selectedItem: null,
        dialogFilterJenisPembayaran: false,
        selectedModalJenisPembayaran: 'Tunai',
        noDokumen: '',
        tglDokumen: '',
        masterDataState: 'BARU',
        masterKodeDokumen: 'BARU',
        dialogInputDataVisible: false,
        tipeDialog: '',
        selectedKodeSupp: '',
        tipeBatal: '',
    });
    // End

    // ======== Fungsi pemilihan radio button jenis pembayaran pada saat show baru  ========
    let radioInstanceTunai: any, radioInstanceTransfer: any, radioInstanceWarkat: any;
    function changeModalJenisPembayaran(tipe: any): void {
        if (tipe === 'Tunai') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedModalJenisPembayaran: radioInstanceTunai.id,
            }));
        } else if (tipe === 'Transfer') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedModalJenisPembayaran: radioInstanceTransfer.id,
            }));
        } else {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedModalJenisPembayaran: radioInstanceWarkat.id,
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

    type PHUListItem = {
        kode_dokumen: string;
        no_dokumen: any;
        tgl_dokumen: any;
        tgl_trxdokumen: any;
        no_warkat: any;
        tgl_valuta: any;
        tgl_pengakuan: any;
        jumlah_mu: any;
        pembayaran: any;
        no_supp: any;
        nama_supp: any;
        akun_byr: any;
        no_kontrak_um: any;
    };
    const [recordsData, setRecordsData] = useState<PHUListItem[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const recordsDataRef = useRef<PHUListItem[]>([]);
    const [detailDokDataFaktur, setDetailDokDataFaktur] = useState<any[]>([]);
    const [detailDokDataJurnal, setDetailDokDataJurnal] = useState<any[]>([]);

    //======== Setting hint / tooltip untuk grid List Data ========
    let tooltipListData: Tooltip | any;
    const columnListData: Object = {
        'No. Bukti': 'Nomor dokumen pembayaran hutang',
        Tanggal: 'Tanggal dokumen pembayaran hutang',
        'Tgl. Buat': 'Tanggal transaksi dokumen pembayaran hutang',
        'No. Cek/BG': 'No Warkat pembayaran hutang ',
        'Tgl. Jatuh Tempo': 'Tanggal jatuh tempo pembayaran hutang',
        'Tgl. Pencairan': 'Tanggal pencairan pembayaran hutang',
        Jumlah: 'Jumlah pembayaran hutang',
        Pembayaran: 'Jenis/Status pembayaran hutang',
        'No. Supp': 'Nomor supplier pembayaran hutang',
        'Nama Supplier': 'Nama supplier pembayaran hutang',
        'Akun Kredit': 'Akun kredit pembayaran hutang',
        'No. Kontrak': 'No kontrak pembayaran hutang',
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
            if (window.innerWidth < 1000) {
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
        if (args.requestType === 'refresh') {
            let vDokumen = 'BB';
            let vNoDokumen = 'all';
            let vNoWarkat = 'all';
            let vNoSupp = 'all';
            let vNamaSupp = 'all';
            let vTglPhuAwal = tanggalHariIni; //tanggalHariIni
            let vTglPhuAkhir = tanggalAkhirBulan; //tanggalAkhirBulan

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
            setRecordsData(responseData);
            recordsDataRef.current = responseData;
            // await showLoading1(false);
        }
    };

    useEffect(() => {
        const refreshData = async () => {
            let vDokumen = 'BB';
            let vNoDokumen = 'all';
            let vNoWarkat = 'all';
            let vNoSupp = 'all';
            let vNamaSupp = 'all';
            let vTglPhuAwal = tanggalHariIni; //tanggalHariIni
            let vTglPhuAkhir = tanggalAkhirBulan; //tanggalAkhirBulan

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
            setRecordsData(responseData);
            recordsDataRef.current = responseData;
        };
        refreshData();
    }, []);

    const gridKey = `${JSON.stringify(recordsDataRef.current)}`;

    const vRefreshData = useRef(0);
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
                let vDokumen = 'BB';
                let vNoDokumen = 'all';
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

                if (checkboxFilter.isNoBuktiPembayaranChecked) {
                    vNoDokumen = `${filterData.noBuktiPembayaranValue}`;
                }

                if (checkboxFilter.isTanggalChecked) {
                    const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
                    const formattedDate2 = filterData.date2.format('YYYY-MM-DD');
                    vTglPhuAwal = `${formattedDate1}`;
                    vTglPhuAkhir = `${formattedDate2}`;
                }

                if (checkboxFilter.isNoSupplierChecked) {
                    vNoSupp = `${filterData.noSupplierValue}`;
                }

                if (checkboxFilter.isNamaSupplierChecked) {
                    vNamaSupp = `${filterData.namaSupplierValue}`;
                }

                if (checkboxFilter.isNoReffChecked) {
                    vNoReff = `${filterData.noReffValue}`;
                }

                if (checkboxFilter.isJenisPembayaraChecked) {
                    vJenisPembayaran = `${filterData.selectedOptionJenisPembayaran}`;
                }

                if (checkboxFilter.isNoWarkatChecked) {
                    vNoWarkat = `${filterData.noWarkatValue}`;
                }

                if (checkboxFilter.isTanggalJTChecked) {
                    const formattedDate1 = filterData.date3.format('YYYY-MM-DD');
                    const formattedDate2 = filterData.date4.format('YYYY-MM-DD');
                    vTglPhuJtAwal = `${formattedDate1}`;
                    vTglPhuJtAkhir = `${formattedDate2}`;
                }

                if (checkboxFilter.isTanggalPencairanChecked) {
                    const formattedDate1 = filterData.date5.format('YYYY-MM-DD');
                    const formattedDate2 = filterData.date6.format('YYYY-MM-DD');
                    vTglPhuPencairanAwal = `${formattedDate1}`;
                    vTglPhuPencairanAkhir = `${formattedDate2}`;
                }

                if (checkboxFilter.isAkunKreditChecked) {
                    vAkunBayar = `${filterData.akunKreditValue}`;
                }

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
                setRecordsData(responseData);
                recordsDataRef.current = responseData;
                showLoading1(false);

                const cariNoBukti = document.getElementById('cariNoBukti') as HTMLInputElement;
                if (cariNoBukti) {
                    cariNoBukti.value = '';
                }
                const cariJumlah = document.getElementById('cariJumlah') as HTMLInputElement;
                if (cariJumlah) {
                    cariJumlah.value = '';
                }
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
        SafelyAddClassToRef(parentRef, 'some-class');
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
            dialogFilterJenisPembayaran: false,
            tipeDialog: tipe,
        }));
        SafelyAddClassToRef(parentRef, 'some-class');
    };
    // End

    // === Fungsi untuk menampilkan modal pilihan jenis bayar sebum masuk ke modal input data ===
    const showBaru = async () => {
        vRefreshData.current += 1;
        // await RefreshDetailSj(kode_entitas, custSelectedKode, refKodeCust.current, setDataDetailSj);
        await setListStateData((prevState: any) => ({
            ...prevState,
            dialogFilterJenisPembayaran: true,
            masterDataState: 'BARU',
        }));
        SafelyAddClassToRef(parentRef, 'some-class');
    };

    const closeModalShowBaru = () => {
        setListStateData((prevState: any) => ({
            ...prevState,
            dialogFilterJenisPembayaran: false,
        }));
        SafelyAddClassToRef(parentRef, 'some-class');
    };
    // End

    // ============================================================================
    // ============================ END ===========================================
    // ============================================================================

    let gridListData: Grid | any;
    let selectedListData: any[] = [];
    const [selectedRowKodeTtb, setSelectedRowKodeTtb] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailDok, setDetailDok] = useState<any[]>([]);

    const [dataDetailDokTtb, setDataDetailDokTtb] = useState({ no_ttb: '', tgl_ttb: '' });

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    //================ Disable hari minggu di calendar ==============
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

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
            text: 'Form Pembayaran Hutang (Form Kecil)',
        },
        {
            id: 'formBesar',
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Pembayaran Hutang (Form Besar)',
        },
        {
            id: 'daftarPembayaran',
            iconCss: 'e-icons e-thumbnail',
            text: 'Daftar Pembayaran Hutang',
        },
    ];

    function menuCetakSelect(args: MenuEventArgs) {
        if (args.item.id === 'formKecil') {
            OnClick_CetakFormKecil(listStateData.selectedRowKodePhu, kode_entitas);
        } else if (args.item.id === 'formBesar') {
            OnClick_CetakFormBesar(listStateData.selectedRowKodePhu, kode_entitas);
        } else if (args.item.id === 'daftarPembayaran') {
            OnClick_CetakDaftarPhu(listStateData.selectedRowKodePhu, kode_entitas, filterData.date1.format('YYYY-MM-DD'), filterData.date2.format('YYYY-MM-DD'));
        }
    }

    // INI YANG TERBARU
    const [masterBarangProduksi, setMasterBarangProduksi] = useState<string>('Y');

    const showEditRecord = async () => {
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
                selectedModalJenisPembayaran: listStateData.selectedModalJenisPembayaran,
                tipeDialog: listStateData.tipeDialog,
                selectedKodeSupp: listStateData.selectedKodeSupp,
            }));

            SafelyAddClassToRef(parentRef, 'some-class');
        }
    };

    //

    const selectingRowsData = (args: any) => {
        if (args.data !== undefined) {
            ListDetailDok('IDR', args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal);
            setListStateData((prevState: any) => ({
                ...prevState,
                noDokumen: args.data.no_dokumen,
                tglDokumen: args.data.tgl_dokumen,
            }));

            SafelyAddClassToRef(parentRef, 'some-class');
        }
    };

    const selectedRowsData = (args: any) => {
        console.log('args = ', args);
        if (args.data !== undefined) {
            setListStateData((prevState: any) => ({
                ...prevState,
                masterKodeDokumen: args.data.kode_dokumen,
                selectedModalJenisPembayaran: args.data.pembayaran,
                tipeDialog: args.data.pembayaran,
                selectedKodeSupp: args.data.kode_supp,
                masterDataState: 'EDIT',
                selectedRowKodePhu: args.data.kode_dokumen,
            }));

            SafelyAddClassToRef(parentRef, 'some-class');
        }
    };

    const handleRowDoubleClicked = (args: any) => {
        vRefreshData.current += 1;
        console.log('args = ', args);
        setListStateData((prevState: any) => ({
            ...prevState,
            masterKodeDokumen: args.rowData.kode_dokumen,
            masterDataState: 'EDIT',
            selectedModalJenisPembayaran: args.rowData.pembayaran,
            dialogInputDataVisible: true,
            tipeDialog: args.rowData.pembayaran,
            selectedKodeSupp: args.rowData.kode_supp,
        }));

        SafelyAddClassToRef(parentRef, 'some-class');
    };

    const btnClickPencairan = (tipe: any) => {
        vRefreshData.current += 1;
        console.log('gridListData = ', gridListData.getSelectedRecords());
        const data = gridListData.getSelectedRecords();
        if (data.length > 0) {
            if (tipe === 'pencairan') {
                console.log('Tipe = ', tipe);
                if (data[0].kosong === 'P' || data[0].kosong === 'K') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Dokumen ini bukan Cek / Bilyet Giro.</p>',
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else if (data[0].kosong === 'T') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white;">Cek / Bilyet Giro ${data[0].no_warkat} sudah ditolak</p>`,
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
                        masterDataState: 'EDIT',
                        masterKodeDokumen: data[0].kode_dokumen,
                        dialogInputDataVisible: true,
                        selectedModalJenisPembayaran: data[0].kosong === 'C' ? 'Edit Pencairan' : 'Pencairan',
                        tipeDialog: 'Pencairan',
                        selectedKodeSupp: data[0].kode_supp,
                    }));

                    const parent = document.getElementById('parent-element-id');
                    if (parent && parent.classList) {
                        parent.classList.add('some-class');
                    }
                }
            } else if (tipe === 'penolakan') {
                if (data[0].kosong === 'P' || data[0].kosong === 'K') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Dokumen ini bukan Cek / Bilyet Giro.</p>',
                        width: '100%',
                        // target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else if (data[0].kosong === 'C') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white;">Cek / Bilyet Giro ${data[0].no_warkat} sudah dicairkan</p>`,
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
                        masterDataState: 'EDIT',
                        masterKodeDokumen: data[0].kode_dokumen,
                        dialogInputDataVisible: true,
                        selectedModalJenisPembayaran: data[0].kosong === 'T' ? 'Edit Penolakan' : 'Penolakan',
                        tipeDialog: 'Penolakan',
                        selectedKodeSupp: data[0].kode_supp,
                    }));
                    // Manipulasi DOM dengan aman
                    const parent = document.getElementById('parent-element-id');
                    if (parent && parent.classList) {
                        // Akses classList di sini
                        parent.classList.add('some-class');
                    }
                }
            } else if (tipe === 'pembatalan') {
                if (data[0].kosong === 'C' || data[0].kosong === 'T') {
                    setListStateData((prevState: any) => ({
                        ...prevState,
                        masterDataState: 'EDIT',
                        masterKodeDokumen: data[0].kode_dokumen,
                        dialogInputDataVisible: true,
                        selectedModalJenisPembayaran: data[0].kosong === 'C' ? 'batal cair' : 'batal tolak',
                        tipeDialog: 'Pembatalan',
                        selectedKodeSupp: data[0].kode_supp,
                        tipeBatal: data[0].kosong === 'C' ? 'batal cair' : 'batal tolak',
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
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
    };

    const customTotJumlahMu = (props: any) => {
        return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
    };

    const totJumlahMu = (args: any) => {
        console.log('args = ', args);
        const jumlahMu = args.result.reduce((total: number, item: any) => {
            return total + parseFloat(item.jumlah_mu === '' ? '0' : item.jumlah_mu);
        }, 0);
        return frmNumber(jumlahMu);
    };

    // ===========================================================================================

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
                                <TooltipComponent content="Membuat pembayaran hutang baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                                    <TooltipComponent content="Edit data pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                        <TooltipComponent content="Hapus data pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnHapus">
                                            {/* <TooltipComponent content="Cetak data pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnCetak"> */}
                                            <TooltipComponent content="Pencairan pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnPencairan">
                                                <TooltipComponent content="Penolakan pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnPenolakan">
                                                    <TooltipComponent content="Pembatalan pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnPembatalan">
                                                        <TooltipComponent content="Tampilkan detail pembayaran hutang" opensOn="Hover" openDelay={1000} target="#btnDetail">
                                                            <TooltipComponent content="Persetujuan dokumen" opensOn="Hover" openDelay={1000} target="#btnApproval">
                                                                <ButtonComponent
                                                                    id="btnBaru"
                                                                    cssClass="e-primary e-small"
                                                                    style={
                                                                        userMenu.baru === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR'
                                                                            ? { ...styleButton }
                                                                            : { ...styleButtonDisabled, color: '#1c1b1f61' }
                                                                    }
                                                                    disabled={userMenu.baru === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                                                    onClick={showBaru}
                                                                    content="Baru"
                                                                ></ButtonComponent>

                                                                <ButtonComponent
                                                                    id="btnEdit"
                                                                    cssClass="e-primary e-small"
                                                                    style={
                                                                        userMenu.edit === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR'
                                                                            ? { ...styleButton }
                                                                            : { ...styleButtonDisabled, color: '#1c1b1f61' }
                                                                    }
                                                                    disabled={userMenu.edit === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
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
                                                                    disabled={sidebarVisible}
                                                                    onClick={toggleClick}
                                                                    content="Filter"
                                                                ></ButtonComponent>

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
                                                                    content={state.contentPencairan}
                                                                    onClick={() => btnClickPencairan('pencairan')}
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
                                                                    content={state.contentPenolakan}
                                                                    onClick={() => btnClickPencairan('penolakan')}
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
                                                                    content={state.contentPembatalan}
                                                                    onClick={() => btnClickPencairan('pembatalan')}
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
                                                                        SetDataDokumenPhu(
                                                                            'detailDok',
                                                                            listStateData.selectedRowKodePhu,
                                                                            kode_entitas,
                                                                            setListStateData,
                                                                            setDetailDokDataFaktur,
                                                                            setDetailDokDataJurnal
                                                                        )
                                                                    }
                                                                    iconCss={state.iconCss}
                                                                    content={state.content}
                                                                ></ButtonComponent>

                                                                <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                                    <TextBoxComponent
                                                                        id="cariNoBukti"
                                                                        className="searchtext"
                                                                        placeholder="<Cari No. Bukti>"
                                                                        showClearButton={true}
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
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            PencarianJumlah(value, setFilterData, setFilteredData, recordsDataRef.current);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                    {/* </TooltipComponent> */}
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
                            Pembayaran Hutang (PHU)
                        </span>
                    </div>
                </div>

                <div className="flex">
                    <div style={{ width: '17%', visibility: sidebarVisible ? 'visible' : 'hidden' }}>
                        {/* ===============  Filter Data ========================   */}
                        {/* {disabledFilter && ( */}
                        <div className="panel-filter" style={{ background: '#dedede', width: '100%', maxHeight: '663px', overflowY: 'auto' }}>
                            <div className="flex items-center text-center">
                                <div style={{ width: '11%', marginLeft: '17px' }}>
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
                                </div>
                                <div style={{ width: '79%' }}>
                                    <h5 style={{ textAlign: 'left' }} className="text-lg font-bold">
                                        Filtering Data
                                    </h5>
                                </div>
                                <div style={{ width: '10%', marginLeft: '-25px' }}>
                                    <button
                                        //onClick={toggleFilterData}
                                        onClick={closeClick}
                                    >
                                        <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                    </button>
                                </div>
                            </div>
                            <div className="mb-5 mt-3 h-px w-full border-b border-black dark:border-[#1b2e4b]"></div>
                            <div className="flex">
                                <CheckBoxComponent
                                    label="No. Bukti Pembayaran"
                                    checked={checkboxFilter.isNoBuktiPembayaranChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoBuktiPembayaranChecked: value,
                                        }));
                                    }}
                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noBuktiPembayaranValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoBuktiPembayaranInputChange(value, setFilterData, setCheckboxFilter);
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
                                            HandleTglPhu(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                                <p
                                    className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between"
                                    style={{ width: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2.5vh' }}
                                >
                                    s/d
                                </p>
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
                                            HandleTglPhu(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Supplier"
                                    checked={checkboxFilter.isNoSupplierChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNoSupplierChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.noSupplierValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoSupplierInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Nama Supplier"
                                    checked={checkboxFilter.isNamaSupplierChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNamaSupplierChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.namaSupplierValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNamaSupplierInputChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Reff (SJ Supplier)"
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
                                    label="Jenis/Status Pembayaran"
                                    checked={checkboxFilter.isJenisPembayaraChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isJenisPembayaraChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        id="jenis"
                                        className="form-select"
                                        dataSource={ValueJenisPembayaran.map((data: any) => data.value)}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleJenisPembayaranChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                        value={filterData.selectedOptionJenisPembayaran}
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
                                        value={filterData.date3.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglPhuJt(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                                <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
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
                                            HandleTglPhuJt(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
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
                                        value={filterData.date5.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTglPhuPencairan(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                                <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
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
                                            HandleTglPhuPencairan(moment(args.value), 'tanggalAkhir', setFilterData, setCheckboxFilter);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Akun Kredit"
                                    checked={checkboxFilter.isAkunKreditChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isAkunKreditChecked: value,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.akunKreditValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleAkunKreditChange(value, setFilterData, setCheckboxFilter);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '1%', visibility: sidebarVisible ? 'visible' : 'hidden' }}></div>
                    <div style={{ width: '82%' }}>
                        <div className="panel" style={{ height: '705px', background: '#dedede', margin: sidebarVisible ? '' : 'auto auto auto -22%', overflowY: 'auto' }}>
                            <div className="panel-data" style={{ width: '100%', height: '688px' }}>
                                <TooltipComponent ref={(t) => (tooltipListData = t)} opensOn="Hover" beforeRender={beforeRenderListData} target=".e-headertext">
                                    <TabComponent id="defaultTab">
                                        <div className="e-tab-header" style={{ marginBottom: 10 }}>
                                            <div> Data List </div>
                                        </div>
                                        <div className="e-content">
                                            <GridComponent
                                                key={gridKey}
                                                id="gridListData"
                                                locale="id"
                                                ref={(g) => (gridListData = g)}
                                                dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                                // allowExcelExport={true}
                                                // excelExportComplete={ExportComplete}
                                                // allowPdfExport={true}
                                                // pdfExportComplete={ExportComplete}
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
                                                height={540}
                                                gridLines={'Both'}
                                                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                rowSelected={selectedRowsData}
                                                recordDoubleClick={handleRowDoubleClicked}
                                                rowSelecting={selectingRowsData}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective
                                                        field="no_dokumen"
                                                        headerText="No. Bukti"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                    />
                                                    <ColumnDirective
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
                                                        field="tgl_trxdokumen"
                                                        headerText="Tgl. Buat"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        type="date"
                                                        format={formatDate}
                                                    />
                                                    <ColumnDirective
                                                        field="no_warkat"
                                                        headerText="No. Cek/BG"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_valuta"
                                                        headerText="Tgl. Jatuh Tempo"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        type="date"
                                                        format={formatDate}
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_pengakuan"
                                                        headerText="Tgl. Pencairan"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        type="date"
                                                        clipMode="EllipsisWithTooltip"
                                                        format={formatDate}
                                                    />
                                                    <ColumnDirective
                                                        field="jumlah_mu"
                                                        headerText="Jumlah"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        //autoFit
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        template={(args: any) => <div style={{ color: 'red' }}>{CurrencyFormat(args.jumlah_mu)}</div>}
                                                        customAttributes={{ class: styles['custom-css'] }}
                                                    />
                                                    <ColumnDirective
                                                        field="pembayaran"
                                                        headerText="Pembayaran"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                        // headerTemplate={gudangHeader}
                                                    />
                                                    <ColumnDirective
                                                        field="no_supp"
                                                        headerText="No. Supp"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="nama_supp"
                                                        headerText="Nama Supplier"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="300"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="akun_byr"
                                                        headerText="Akun Kredit"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="250"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="no_kontrak_um"
                                                        headerText="No. Kontrak"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="200"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                </ColumnsDirective>
                                                <AggregatesDirective>
                                                    <AggregateDirective>
                                                        <AggregateColumnsDirective>
                                                            <AggregateColumnDirective field="jumlah_mu" type="Custom" customAggregate={totJumlahMu} footerTemplate={customTotJumlahMu} />
                                                        </AggregateColumnsDirective>
                                                    </AggregateDirective>
                                                </AggregatesDirective>
                                                <Inject services={[Aggregate, Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder]} />
                                            </GridComponent>
                                        </div>
                                    </TabComponent>
                                </TooltipComponent>
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
                    </div>
                </div>

                <div
                    style={{
                        minHeight: '51px',
                        marginTop: '-75px',
                        marginBottom: '11px',
                        width: '17%',
                        backgroundColor: '#dedede',
                        visibility: sidebarVisible ? 'visible' : 'hidden',
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                        borderBottomRightRadius: '10px',
                    }}
                >
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
                </div>
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
                                        Detail Pembayaran Hutang : {listStateData.noDokumen} - {moment(listStateData.tglDokumen).format('DD-MM-YYYY')}
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
                                ref={(g) => (gridListData = g)}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="no_sj" headerText="No. SJ Supplier" width="80" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="no_fb" headerText="No. Faktur" width="80" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="tgl_fb"
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
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="total_hutang" headerText="Nilai Faktur" width="100" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="bayar_mu"
                                        template={(args: any) => <div>{CurrencyFormat(args.bayar_mu)}</div>}
                                        headerText="Dibayar"
                                        width="100"
                                        textAlign="Right"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="sisa_hutang"
                                        template={(args: any) => <div>{CurrencyFormat(args.sisa_hutang)}</div>}
                                        headerText="Sisa Hutang"
                                        width="100"
                                        textAlign="Right"
                                        headerTextAlign="Center"
                                    />
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
                                ref={(g) => (gridListData = g)}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="no_akun" headerText="No. Akun" width="80" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="nama_akun" headerText="Nama" width="200" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="debet_rp"
                                        template={(args: any) => <div>{CurrencyFormat(args.debet_rp)}</div>}
                                        headerText="Debet"
                                        width="100"
                                        textAlign="Right"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="kredit_rp"
                                        template={(args: any) => <div>{CurrencyFormat(args.kredit_rp)}</div>}
                                        headerText="Kredit"
                                        width="100"
                                        textAlign="Right"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="catatan" headerText="Keterangan" width="250" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective clipMode="EllipsisWithTooltip" field="kode_mu" headerText="MU" width="50" textAlign="Left" headerTextAlign="Center" />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="kurs"
                                        template={(args: any) => <div>{CurrencyFormat(args.kurs)}</div>}
                                        headerText="Kurs"
                                        width="70"
                                        textAlign="Right"
                                        headerTextAlign="Center"
                                    />
                                    <ColumnDirective
                                        clipMode="EllipsisWithTooltip"
                                        field="jumlah_rp"
                                        template={(args: any) => <div>{args.jumlah_rp < 0 ? '(' + CurrencyFormat(args.jumlah_rp * -1) + ')' : CurrencyFormat(args.jumlah_rp)}</div>}
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
                <DialogPhuList
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
                        }));
                        handleRefreshData();
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag=""
                    token={token}
                />
            ) : listStateData.tipeDialog === 'Transfer' ? (
                <DialogPhuListTransfer
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
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag=""
                    token={token}
                />
            ) : listStateData.tipeDialog === 'Warkat' ? (
                <DialogPhuListWarkat
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
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag=""
                    token={token}
                />
            ) : listStateData.tipeDialog === 'Pencairan' ? (
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
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag=""
                    token={token}
                />
            ) : listStateData.tipeDialog === 'Penolakan' ? (
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
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    plag=""
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
                        }));
                    }}
                    onRefresh={handleRefreshData}
                    kode_user={kode_user}
                    modalJenisPembayaran={listStateData.selectedModalJenisPembayaran}
                    // onRefreshTipe={(tipeDialog: any) => onRefreshTipe(tipeDialog)}
                    selectedKodeSupp={listStateData.selectedKodeSupp}
                    onRefreshTipe={vRefreshData.current}
                    tipeBatal={listStateData.tipeBatal}
                    plag=""
                />
            )}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog Show Baru (Filter Jenis Pembayaran) =============================*/}
            {/*==================================================================================================*/}
            {listStateData.dialogFilterJenisPembayaran && (
                <DialogComponent
                    id="dialogPhuJenisPembayaran"
                    name="dialogPhuJenisPembayaran"
                    className="dialogPhuJenisPembayaran"
                    target="#main-target"
                    // header="Pembayaran Hutang"
                    header={() => {
                        let header: JSX.Element | string = '';
                        header = (
                            <div>
                                <div className="header-title">Pembayaran Hutang</div>
                            </div>
                        );

                        return header;
                    }}
                    visible={listStateData.dialogFilterJenisPembayaran}
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
                            checked={listStateData.selectedModalJenisPembayaran === 'Tunai'}
                            change={() => changeModalJenisPembayaran('Tunai')}
                            ref={(radio1) => (radioInstanceTunai = radio1 as RadioButtonComponent)}
                            cssClass="e-small"
                            style={{ fontSize: 10 }}
                        />
                    </div>
                    <div className="flex items-center" style={{ marginTop: 10 }}>
                        <RadioButtonComponent
                            id="Transfer"
                            label="Transfer Bank"
                            name="size"
                            checked={listStateData.selectedModalJenisPembayaran === 'Transfer'}
                            change={() => changeModalJenisPembayaran('Transfer')}
                            ref={(radio3) => (radioInstanceTransfer = radio3 as RadioButtonComponent)}
                            cssClass="e-small"
                        />
                    </div>
                    <div className="flex items-center" style={{ marginTop: 10 }}>
                        <RadioButtonComponent
                            id="Warkat"
                            label="Warkat (Cek / BG)"
                            name="size"
                            checked={listStateData.selectedModalJenisPembayaran === 'Warkat'}
                            change={() => changeModalJenisPembayaran('Warkat')}
                            ref={(radio3) => (radioInstanceWarkat = radio3 as RadioButtonComponent)}
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
                            content="Lanjut"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                            onClick={() => showNewRecord(listStateData.selectedModalJenisPembayaran)}
                        />
                    </div>
                </DialogComponent>
            )}
            {/*==================================================================================================*/}
        </div>
    );
};

// export { getServerSideProps };

export default PHUList;
