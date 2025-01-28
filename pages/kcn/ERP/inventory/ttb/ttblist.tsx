import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations';
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
import { faCamera, faSave, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
// import { getServerSideProps } from '@/pages/api/getServerSide';
import styles from './ttblist.module.css';
import {
    HandleAlasan,
    HandleKategoriChange,
    HandleKelompokChange,
    HandleNamaCustInputChange,
    HandleNoReffInputChange,
    HandleNoTtbInputChange,
    HandlePilihSemua,
    HandleRowDoubleClicked,
    HandleRowSelected,
    HandleTgl,
    SetDataDokumenTtb,
    checkboxTemplate,
    HandleGudangChange,
    HandleStatusDokInputChange,
    HandleGagalKirim,
    PencarianNoTtb,
    PencarianNoReff,
    ListDetailDok,
    HandlePembatalan,
    checkboxTemplatePembatalan,
    editTemplateKeteranganSC,
    plagInputKetSc,
    plag,
    ket1Sc,
    editTemplateNoMb,
    noMb,
    plagNoMb,
    kodeTtbValue,
    editTemplateUser1,
    kodeTtbValueKet1,
} from './functional/fungsiFormTtbList';
import { GetListTtb, GetListTtbEffect, GetMasterAlasan, GetPeriode, GetTtbMasterGagal, PatchPembatalan, SimpanKeteranganSc, UpdateKeteranganSc } from './model/api';
import { FillFromSQL, appBackdate, frmNumber } from '@/utils/routines';
import { showLoading, usersMenu } from '@/utils/routines';
import Draggable from 'react-draggable';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);

import DialogTtbList from './component/dialogTtbList';
import { useSession } from '@/pages/api/sessionContext';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { HandleCloseZoom, HandleZoomIn, HandleZoomOut, LoadDataImage, OpenPreview, swalDialog, swalPopUp } from './functional/fungsiFormTtb';

enableRipple(true);

// interface TTBListProps {
//     userid: any;
//     kode_entitas: any;
//     kode_user: any;
// }
let textareaObj: any;
const TTBList = () => {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const nip = sessionData?.nip ?? '';
    const kode_user = sessionData?.nip ?? '';
    const entitas = sessionData?.entitas ?? '';
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

    // ini kodingan terbaru TTB dengan tampilan syncfusion

    // State Baru Untuk TTB
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '' });
    const kode_menu = '40600'; // kode menu PO

    const [isNoTtbChecked, setIsNoTtbChecked] = useState(false);
    const [noTtbValue, setNoTtbValue] = useState('');

    const [date1, setDate1] = useState<moment.Moment>(moment());
    const [date2, setDate2] = useState<moment.Moment>(moment().endOf('month'));
    const [isTanggalChecked, setIsTanggalChecked] = useState<boolean>(true);

    const [isNamaCustChecked, setIsNamaCustChecked] = useState<boolean>(false);
    const [namaCustValue, setNamaCustValue] = useState<string>('');

    const [isNoReffChecked, setIsNoReffChecked] = useState<boolean>(false);
    const [noReffValue, setNoReffValue] = useState<string>('');

    const [selectedOptionKategori, setSelectedOptionKetgori] = useState<string>('');
    const [isKategoriChecked, setIsKategoriChecked] = useState<boolean>(false);

    const [selectedOptionNonKategori, setSelectedOptionNonKetgori] = useState<string>('');
    const [isNonKategoriChecked, setIsNonKategoriChecked] = useState<boolean>(false);

    const [selectedOptionKelompok, setSelectedOptionKelompok] = useState<string>('');
    const [isKelompokChecked, setIsKelompokChecked] = useState<boolean>(false);

    const [selectedOptionGudang, setSelectedOptionGudang] = useState<string>('');
    const [isGudangChecked, setIsGudangChecked] = useState<boolean>(false);

    const [statusDokValue, setStatusDokValue] = useState<string>('');
    const [isStatusDokChecked, setIsStatusDokChecked] = useState<boolean>(false);
    const [selectedOptionGagalKirim, setSelectedOptionGagalKirim] = useState('semua');
    const [selectedOptionPembatalan, setSelectedOptionPembatalan] = useState('pembatalanSemua');
    const [plagFilterTab, setPlagFilterTab] = useState('Baru');
    const [modalPositionKet, setModalPositionKet] = useState({ top: '30%', right: '30%', width: '30%', background: '#dedede' });

    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        { title: 'Bukti Surat Jalan Kembali', content: 'Content 1' },
        { title: 'Bukti Barang Kembali', content: 'Content 2' },
        { title: 'Bukti Lain Lain', content: 'Content 3' },
        { title: 'Bukti Lain Lain 2', content: 'Content 4' },
    ];

    type TTBListItem = {
        kode_ttb: string;
        no_ttb: any;
        tgl_ttb: any;
        kode_jual: any;
        nama_relasi: any;
        nama_gudang: any;
        alasan: any;
        dokumen: any;
        status: any;
        gagal: any;
        ket1: any;
        no_mb: any;
        user1: any;
        ket2: any;
        cek: any;
        user2: any;
        tgl_sj: any;
        no_reff: any;
    };
    const [recordsData, setRecordsData] = useState<TTBListItem[]>([]);
    const [recordsDataApprove, setRecordsDataApprove] = useState<TTBListItem[]>([]);
    const recordsDataRef = useRef<TTBListItem[]>([]);
    const recordsDataApproveRef = useRef<TTBListItem[]>([]);

    interface CheckboxItem {
        alasan?: string; // tambahkan tipe untuk properti 'alasan' jika diperlukan
    }
    const [checkboxDataMasterAlasan, setCheckboxDataMasterAlasan] = useState<CheckboxItem[]>([]);

    const [apiResponseKategori, setApiResponseKategori] = useState<any[]>([]);
    const [apiResponseKelompok, setApiResponseKelompok] = useState<any[]>([]);
    const [apiResponseGudang, setApiResponseGudang] = useState<any[]>([]);

    // let gridListData: Grid | any;
    const gridListDataRef = useRef<GridComponent>(null);
    const gridListDataApprovalRef = useRef<GridComponent>(null);
    let selectedListData: any[] = [];
    const [selectedRowKodeTtb, setSelectedRowKodeTtb] = useState('');
    const [selectedRowNoTtb, setSelectedRowNoTtb] = useState('');
    const [selectedPembatalan, setSelectedPembatalan] = useState('');
    const [statusApproval, setStatusApproval] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailDok, setDetailDok] = useState<any[]>([]);
    const [modalPosition, setModalPosition] = useState({ top: '3%', right: '2%', width: '51%', background: '#dedede' });
    const [dataDetailDokTtb, setDataDetailDokTtb] = useState({ no_ttb: '', tgl_ttb: '' });
    const [searchNoTtb, setSearchNoTtb] = useState('');
    const [searchNoReff, setSearchNoReff] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonApp = { fontWeight: 'bold', width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#e6e6e6' };
    const styleButtonDisabled = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };
    const [state, setState] = useState({
        content: 'Detail Dok',
        iconCss: 'e-icons e-medium e-chevron-down',
    });
    const modalPositionFilePendukung = { top: '41%', right: '43%', width: '39%', background: '#dedede' };

    const [alasanChecked, setAlasanChecked] = useState<boolean[]>([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';
    const [inputKetSc, setInputKetSc] = useState('');

    //======== Setting hint / tooltip untuk grid List Data ========
    let tooltipListData: Tooltip | any;
    const columnListData: Object = {
        'No. TTB': 'Nomor dokumen tanda terima barang',
        Tanggal: 'Tanggal dokumen tanda terima barang',
        Divisi: 'Kode penjual',
        Customer: 'Customer ',
        'No SJ': 'Nomor surat jalan',
        'Tgl. Kirim': 'Tanggal pegiriman',
        'No. Kendaraan': 'Nomor kendaraan',
        Gudang: 'Gudang',
        Alasan: 'Alasan TTB',
        Dokumen: 'Sumber dokumen',
        Status: 'Status Pengiriman',
        // 'Gagal Kirim': 'Gagal pengiriman',
        Keterangan: 'Keterangan',
        'No. MB': 'Nomor MB',
        User: 'User',
        Check: 'Check general affair',
    };
    const beforeRenderListData = (args: TooltipEventArgs) => {
        const description = (columnListData as any)[(args as any).target.innerText];
        if (description) {
            tooltipListData.content = description;
        }
    };
    //=============================================================
    const tanggalSekarang = moment();
    // Menentukan tanggal awal bulan
    const tanggalAwalBulan = tanggalSekarang.startOf('month');
    // Menentukan tanggal akhir bulan dengan moment.js
    const tanggalHariIni = moment(new Date()).format('YYYY-MM-DD');
    const tanggalAkhirBulan = moment(tanggalAwalBulan.endOf('month')).format('YYYY-MM-DD');
    const fetchDataRef = useRef();
    const [valueAppBackdate, setValueAppBackdate] = useState(true);

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
                }));
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        const masterAlasan: any[] = await GetMasterAlasan(kode_entitas);
        setCheckboxDataMasterAlasan(masterAlasan);

        await FillFromSQL(kode_entitas, 'kategori', '')
            .then((result) => {
                setApiResponseKategori(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        await FillFromSQL(kode_entitas, 'kelompok', '')
            .then((result) => {
                setApiResponseKelompok(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        await FillFromSQL(kode_entitas, 'gudang', kode_user)
            .then((result) => {
                setApiResponseGudang(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        await appBackdate(kode_entitas, userid)
            .then((result) => {
                setValueAppBackdate(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        const defaultAlasanChecked = Array(masterAlasan.length).fill(true);
        setAlasanChecked(defaultAlasanChecked);
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
            gridListDataRef.current?.print();
        } else if (args.item.text === 'PDF') {
            gridListDataRef.current?.showSpinner();
            gridListDataRef.current?.pdfExport();
        } else if (args.item.text === 'XLSX') {
            gridListDataRef.current?.showSpinner();
            gridListDataRef.current?.excelExport();
        } else if (args.item.text === 'CSV') {
            gridListDataRef.current?.showSpinner();
            gridListDataRef.current?.csvExport();
        }
    }
    const ExportComplete = (): void => {
        gridListDataRef.current?.hideSpinner();
    };
    //=============================================================

    //============== Format baris pada grid List Data  =============
    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            if (getValue('pembatalan', args.data) == 'Y') {
                args.row.style.background = '#fde4e4';
            }
        }
    };

    //============== Format cell pada grid List Data ===============
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
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Tanda Terima Barang',
        },
    ];

    function menuCetakSelect(args: MenuEventArgs) {
        if (plagFilterTab === 'Baru') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Data baru tidak bisa di cetak.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        } else {
            SetDataDokumenTtb('cetak', selectedRowKodeTtb, kode_entitas, dataDetailDokTtb, router, setSelectedItem, setDetailDok, plagFilterTab);
        }
    }
    // ===========================================================================================

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

    // ===========================================================================================

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

    const filterTab = (tipe: any) => {
        if (tipe == 'Baru') {
            console.log('Tipe = ', tipe);
        } else {
            console.log('Tipe = ', tipe);
        }

        setPlagFilterTab(tipe);
        setSelectedRowKodeTtb('');
        if (gridListDataRef.current) {
            gridListDataRef.current.clearSelection();
        }
    };

    useEffect(() => {
        const refreshData = async () => {
            let vGagal = 'all';
            let vPembatalan = 'all';
            let vNoTtb = 'all';
            let vTglAwal = tanggalHariIni; //tanggalHariIni
            let vTglAkhir = tanggalAkhirBulan; //tanggalAkhirBulan

            let vNamaRelasi = 'all';
            let vNoReff = 'all';
            let vKodeGudang = 'all';
            let vGrp = 'all';
            let vKustom10 = 'all';
            let vStatus = 'all';
            let vAlasan = 'all';
            let vPilihanGrp = 'all';
            let vLimit = '1000';

            let paramObject = {
                kode_entitas: kode_entitas,
                vGagal: vGagal, // Gagal
                vPembatalan: vPembatalan, // Pembatalan
                vNoTtb: vNoTtb, // No TTB
                vTglAwal: vTglAwal, // Tanggal Awal
                vTglAkhir: vTglAkhir, // Tanggal Akhir
                vNamaRelasi: vNamaRelasi, // nama Relasi
                vNoReff: vNoReff, // No Reff
                vKodeGudang: vKodeGudang, // Kode Gudang
                vGrp: vGrp, // Grp
                vKustom10: vKustom10, // Kelompok
                vStatus: vStatus, // Status Dokumen
                vAlasan: vAlasan, // Alasan
                vPilihanGrp: vPilihanGrp, // Pilihan Grp Y N All
                vLimit: vLimit,
            };

            const responseDataBaru = await GetListTtbEffect(paramObject, 'baru');
            const responseDataApprove = await GetListTtbEffect(paramObject, 'approve');
            // Menambahkan field baru ke responseDataApprove
            const responseDataBaruFix = responseDataBaru.map((item: any) => ({
                ...item,
                statusApproval: 'Baru',
            }));

            const responseDataApproveFix = responseDataApprove.map((item: any) => ({
                ...item,
                statusApproval: 'Approval',
            }));

            setRecordsData(responseDataBaruFix);
            setRecordsDataApprove(responseDataApproveFix);
            recordsDataRef.current = responseDataBaruFix;
            recordsDataApproveRef.current = responseDataApproveFix;
        };
        refreshData();
        // filterTab('Baru')
    }, []);

    const gridKey = `${searchNoTtb}-${searchNoReff}-${JSON.stringify(recordsDataRef.current)}`;
    const gridKeyApproval = `${searchNoTtb}-${searchNoReff}-${JSON.stringify(recordsDataApproveRef.current)}`;
    const vRefreshData = useRef(0);

    const handleRefreshData = async () => {
        vRefreshData.current += 1;
        const cariNoTtb = document.getElementById('cariNoTtb') as HTMLInputElement;
        if (cariNoTtb) {
            cariNoTtb.value = '';
        }

        const cariNoReff = document.getElementById('cariNoReff') as HTMLInputElement;
        if (cariNoReff) {
            cariNoReff.value = '';
        }
        await setSearchNoReff('');
        await setSearchNoTtb('');
        await showLoading1(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                const alasanTerpilih = checkboxDataMasterAlasan
                    .filter((item, index) => alasanChecked[index]) // Filter alasan yang terpilih
                    .map((item) => item.alasan) // Ambil nama alasan saja
                    .join(','); // Gabungkan dengan koma sebagai pemisah

                let vGagal = 'all';
                let vPembatalan = 'all';
                let vNoTtb = 'all';
                let vTglAwal = 'all'; //tanggalHariIni
                let vTglAkhir = 'all'; //tanggalAkhirBulan

                let vNamaRelasi = 'all';
                let vNoReff = 'all';
                let vKodeGudang = 'all';
                let vGrp = 'all';
                let vKustom10 = 'all';
                let vStatus = 'all';
                let vAlasan = alasanTerpilih;
                let vPilihanGrp = 'all';
                let vLimit = '1000';

                if (isNoTtbChecked) {
                    vNoTtb = `${noTtbValue}`;
                }

                if (isTanggalChecked) {
                    const formattedDate1 = date1.format('YYYY-MM-DD');
                    const formattedDate2 = date2.format('YYYY-MM-DD');
                    vTglAwal = `${formattedDate1}`;
                    vTglAkhir = `${formattedDate2}`;
                }

                if (isNamaCustChecked) {
                    vNamaRelasi = `${namaCustValue}`;
                }

                if (isNoReffChecked) {
                    vNoReff = `${noReffValue}`;
                }

                if (isKategoriChecked && !isNonKategoriChecked) {
                    vPilihanGrp = 'Y';
                    vGrp = `${selectedOptionKategori}`;
                } else if (!isKategoriChecked && isNonKategoriChecked) {
                    vPilihanGrp = 'N';
                    vGrp = `${selectedOptionKategori}`;
                } else if (isKategoriChecked && isNonKategoriChecked) {
                    vPilihanGrp = 'all';
                    vGrp = `all`;
                }

                if (isKelompokChecked) {
                    vKustom10 = `${selectedOptionKelompok}`;
                }

                if (isGudangChecked) {
                    vKodeGudang = `${selectedOptionGudang}`;
                }

                if (isStatusDokChecked) {
                    vStatus = `${statusDokValue}`;
                }

                if (selectedOptionGagalKirim === 'semua') {
                    vGagal = 'all';
                } else if (selectedOptionGagalKirim === 'ya') {
                    vGagal = 'Y';
                } else if (selectedOptionGagalKirim === 'tidak') {
                    vGagal = 'N';
                }

                if (selectedOptionPembatalan === 'pembatalanSemua') {
                    vPembatalan = 'all';
                } else if (selectedOptionPembatalan === 'pembatalanYa') {
                    vPembatalan = 'Y';
                } else if (selectedOptionPembatalan === 'pembatalanTidak') {
                    vPembatalan = 'N';
                }

                let paramObject = {
                    kode_entitas: kode_entitas,
                    vGagal: vGagal, // Gagal
                    vPembatalan: vPembatalan, // Pembatalan
                    vNoTtb: vNoTtb, // No TTB
                    vTglAwal: vTglAwal, // Tanggal Awal
                    vTglAkhir: vTglAkhir, // Tanggal Akhir
                    vNamaRelasi: vNamaRelasi, // nama Relasi
                    vNoReff: vNoReff, // No Reff
                    vKodeGudang: vKodeGudang, // Kode Gudang
                    vGrp: vGrp, // Grp
                    vKustom10: vKustom10, // Kelompok
                    vStatus: vStatus, // Status Dokumen
                    vAlasan: vAlasan, // Alasan
                    vPilihanGrp: vPilihanGrp, // Pilihan Grp Y N All
                    vLimit: vLimit,
                };
                const responseDataBaru = await GetListTtb(paramObject, 'baru');
                const responseDataApprove = await GetListTtb(paramObject, 'approve');

                const responseDataBaruFix = responseDataBaru.map((item: any) => ({
                    ...item,
                    statusApproval: 'Baru',
                }));

                const responseDataApproveFix = responseDataApprove.map((item: any) => ({
                    ...item,
                    statusApproval: 'Approval',
                }));
                setRecordsData(responseDataBaruFix);
                setRecordsDataApprove(responseDataApproveFix);
                recordsDataRef.current = responseDataBaruFix;
                recordsDataApproveRef.current = responseDataApproveFix;
                showLoading1(false);
            } catch (error) {
                console.error(error);
            }
        }
    };
    // ===========================================================================================

    const [closePlagInpuKetSc, setClosePlagInpuKetSc] = useState(plagInputKetSc.current);
    const closeModal = (tipe: any) => {
        if (tipe === 'detailDok') {
            setSelectedItem(null);
        } else if (tipe === 'ketSc') {
            plagInputKetSc.current = false;
        } else {
            setPlagFilePendukung(false);
        }
    };

    const headerProduksi = () => {
        const bgcolor = 'tranparent';
        const fcolor = '#5d676e';
        return (
            <TooltipComponent content="Gagal Kirim" opensOn="Hover" openDelay={1000} position="BottomCenter">
                <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3 }}>
                    <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                        Gagal
                        <br />
                        Kirim
                    </span>
                </div>
            </TooltipComponent>
        );
    };
    //

    // INI YANG TERBARU
    const [masterDataState, setMasterDataState] = useState<string>('BARU');
    const [masterKodeDokumen, setMasterKodeDokumen] = useState<string>('BARU');
    const [masterBarangProduksi, setMasterBarangProduksi] = useState<string>('Y');
    const [dialogInputDataVisible, setDialogInputDataVisible] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    const showNewRecord = async () => {
        setMasterDataState('BARU');
        setMasterKodeDokumen('BARU');

        setDialogInputDataVisible(true);
        setRefreshKey((prevKey) => prevKey + 1);
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

    const showEditRecord = async () => {
        if (selectedRowKodeTtb === '') {
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
            if (statusApproval === 'Approval') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Data sudah di Approval, tidak dapat di koreksi.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else {
                setMasterDataState('EDIT');
                setMasterKodeDokumen(selectedRowKodeTtb);
                setDialogInputDataVisible(true);
                setRefreshKey((prevKey) => prevKey + 1);
            }
        }
    };

    const showAppRecord = async () => {
        if (selectedRowKodeTtb === '') {
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
            if (statusApproval === 'Approval') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Data sudah di Approval, tidak dapat di koreksi.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else if (selectedPembatalan === 'Y') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Data sudah di batalkan, tidak dapat di approval.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else {
                setMasterDataState('APPROVAL');
                setMasterKodeDokumen(selectedRowKodeTtb);
                setDialogInputDataVisible(true);
                setRefreshKey((prevKey) => prevKey + 1);
            }
        }
    };

    const [dialogKey, setDialogKey] = useState(0);

    const closeAndRefreshDialog = () => {
        setDialogKey((prevKey) => prevKey + 1); // Mengubah key untuk memaksa React memperbarui komponen
    };

    interface ImageData {
        dokumen: string;
        filegambar: string;
        fileoriginal: any; // Sesuaikan dengan tipe yang sesuai
        gambar: any; // Sesuaikan dengan tipe yang sesuai
        id_dokumen: number; // Sesuaikan dengan tipe yang sesuai
        kode_dokumen: string;
        st: string;
        base64_string: string;
        decodeBase64_string: string;
        nama_file: string;
    }

    const [plagCekFilePendukung, setPlagFilePendukung] = useState(false);
    const [loadFilePendukung, setLoadFilePendukung] = useState<ImageData[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<any>([]);
    const [selectedNamaFiles, setNamaFiles] = useState<any>([]);
    const [selectedNamaFilesExt1, setNamaFilesExt1] = useState('');
    type ExtractedFile = {
        imageUrl: string;
        fileName: string;
    };
    const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
    const [indexPreview, setIndexPreview] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [zoomScale, setZoomScale] = useState(0.5);

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleFilePendukung = async () => {
        await LoadDataImage(selectedRowKodeTtb, kode_entitas, setLoadFilePendukung, setSelectedFiles, setNamaFiles, setNamaFilesExt1, setExtractedFiles);
        await setPlagFilePendukung(true);
    };

    const handleWheel = (event: any) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            // Scroll up
            setZoomScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
        } else {
            // Scroll down
            setZoomScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
        }
    };

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isOpenPreview) {
            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isOpenPreview, handleMouseMove, handleMouseUp, handleWheel]);

    const handlePembatalan = () => {
        if (selectedRowKodeTtb === '') {
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

        if (statusApproval === 'Approval') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Data sudah di Approval, tidak dapat di batalkan.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        } else {
            // Tambahkan CSS untuk tombol
            const style = document.createElement('style');
            style.innerHTML = `
            .swal2-popup .btn {
                margin-left: 10px;
                }

            .swal2-confirm, .swal2-cancel {
                width: 70px;  /* Atur ukuran lebar yang sama */
                height: 33px;  /* Atur ukuran tinggi yang sama */
                font-size: 14px;  /* Sesuaikan ukuran font */
            }
            `;
            document.head.appendChild(style);

            withReactContent(swalDialog)
                .fire({
                    title: `<p style="font-size:12px">Anda yakin ingin membatalkan No. TTB ini <span style="font-weight:bold">[ ${selectedRowNoTtb} ]</span></p>`,
                    width: '16.4%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                    showCancelButton: true, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        pembatalanDoc();
                        // saveDoc()
                    }
                });
        }
    };

    const pembatalanDoc = async () => {
        const paramObject = {
            entitas: kode_entitas,
            kode_ttb: selectedRowKodeTtb,
        };
        const response = await PatchPembatalan(paramObject, token);
        const result = response.data;
        const status = result.status;
        const errormsg = result.serverMessage;
        if (status === true) {
            handleRefreshData();
            if (gridListDataRef.current) {
                gridListDataRef.current.clearSelection();
            }
        }
    };

    const [plagInputKetSc1, setPlagInputKetSc1] = useState(false);
    const [plagFilterInput, setPlagFilterInput] = useState('');
    const [selectedNoMb, setSelectedNoMb] = useState('');

    useEffect(() => {
        const hasRunEffect = sessionStorage.getItem('hasRunEffect');
        if (!hasRunEffect) {
            if (plagNoMb.current === '') {
                setPlagInputKetSc1(plagInputKetSc.current);
                setPlagFilterInput(ket1Sc.current);
                setSelectedNoMb(noMb.current);
            } else {
                simpanUpdateNoMb();
            }
            // Set status sudah menjalankan efek
            sessionStorage.setItem('hasRunEffect', 'true');
        }

        // Optional: Reset ketika komponen tidak lagi digunakan
        return () => {
            sessionStorage.removeItem('hasRunEffect');
        };
    }, [plag.current]);

    const closeModalKetSc = (tipe: any) => {
        if (tipe === 'ketSc') {
            setPlagInputKetSc1(false);
        }
    };

    const simpanUpdateNoMb = async () => {
        const paramObject = {
            entitas: kode_entitas,
            kode_ttb: kodeTtbValue.current, //selectedRowKodeTtb
            gagal: null,
            ket1: ket1Sc.current === '' ? null : ket1Sc.current,
            no_mb: noMb.current === '' ? null : noMb.current,
            user1: userid.toUpperCase(),
            tgl1: moment().format('YYYY-MM-DD HH:mm:ss'),
            ket2: null,
            cek: null,
            user2: null,
            tgl2: moment().format('YYYY-MM-DD HH:mm:ss'),
            no_ttb: selectedRowNoTtb,
        };
        const response = await GetTtbMasterGagal(kode_entitas, kodeTtbValue.current);
        const result = response;

        if ((ket1Sc.current === '' || ket1Sc.current === null) && (noMb.current === '' || noMb.current === null)) {
        } else {
            if (result.length > 0) {
                const response = await UpdateKeteranganSc(paramObject, token);
                const result = response.data;
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
                    setPlagInputKetSc1(false);
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">No MB Berhasil di EDIT.</p>',
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
                    // handleRefreshData();
                    // if (gridListDataRef.current) {
                    //     gridListDataRef.current.clearSelection();
                    // }
                }
            } else {
                const response = await SimpanKeteranganSc(paramObject, token);
                const result = response.data;
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
                    setPlagInputKetSc1(false);
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">No MB Berhasil disimpan.</p>',
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
                    const user1 = document.getElementById(`user1${kodeTtbValue.current}`) as HTMLInputElement;
                    if (user1) {
                        user1.value = userid.toUpperCase();
                    }
                    // handleRefreshData();
                    // if (gridListDataRef.current) {
                    //     gridListDataRef.current.clearSelection();
                    // }
                }
            }
        }
    };

    const simpanUpdateKetSc = async () => {
        const paramObject = {
            entitas: kode_entitas,
            kode_ttb: kodeTtbValueKet1.current, // selectedRowKodeTtb,
            gagal: null,
            // ket1: tipe === 'simpan' ? inputKetSc : plagFilterInput,
            ket1: plagFilterInput,
            no_mb: noMb.current, // selectedNoMb,
            user1: userid.toUpperCase(),
            tgl1: moment().format('YYYY-MM-DD HH:mm:ss'),
            ket2: null,
            cek: null,
            user2: null,
            tgl2: moment().format('YYYY-MM-DD HH:mm:ss'),
            no_ttb: selectedRowNoTtb,
            // plag: tipe,
        };

        const response = await GetTtbMasterGagal(kode_entitas, kodeTtbValueKet1.current);
        const result = response;
        console.log('aaaaaaaaaaaaa = ', plagFilterInput, plagFilterInput);

        if ((plagFilterInput === '' || plagFilterInput === null) && (noMb.current === '' || noMb.current === null)) {
        } else {
            if (result.length > 0) {
                const response = await UpdateKeteranganSc(paramObject, token);
                const result = response.data;
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
                    setPlagInputKetSc1(false);
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">Keterangan Berhasil di EDIT.</p>',
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
                    const ket1 = document.getElementById(`ket1${kodeTtbValueKet1.current}`) as HTMLInputElement;
                    if (ket1) {
                        ket1.value = plagFilterInput;
                    }
                    const user1 = document.getElementById(`user1${kodeTtbValueKet1.current}`) as HTMLInputElement;
                    if (user1) {
                        user1.value = userid.toUpperCase();
                    }
                    // handleRefreshData();
                    // if (gridListDataRef.current) {
                    //     gridListDataRef.current.clearSelection();
                    // }
                }
            } else {
                console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
                const response = await SimpanKeteranganSc(paramObject, token);
                const result = response.data;
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
                    setPlagInputKetSc1(false);
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">Keterangan Berhasil disimpan.</p>',
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
                    const ket1 = document.getElementById(`ket1${kodeTtbValueKet1.current}`) as HTMLInputElement;
                    if (ket1) {
                        ket1.value = plagFilterInput;
                    }
                    const user1 = document.getElementById(`user1${kodeTtbValueKet1.current}`) as HTMLInputElement;
                    if (user1) {
                        user1.value = userid.toUpperCase();
                    }
                    // handleRefreshData();
                    // if (gridListDataRef.current) {
                    //     gridListDataRef.current.clearSelection();
                    // }
                }
            }
        }
    };

    //

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
                                <TooltipComponent content="Membuat tanda terima barang baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                                    <TooltipComponent content="Edit data tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                        <TooltipComponent content="Hapus data tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnHapus">
                                            <TooltipComponent content="Cetak data tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnCetak">
                                                <TooltipComponent content="Tampilkan detail tanda terima barang" opensOn="Hover" openDelay={1000} target="#btnDetail">
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
                                                            // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                            onClick={showNewRecord}
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
                                                            id="btnApp"
                                                            cssClass="e-primary e-small"
                                                            style={
                                                                entitas === '898'
                                                                    ? { ...styleButtonApp, width: 100 + 'px', color: 'green' }
                                                                    : { ...styleButtonDisabled, width: 100 + 'px', color: '#1c1b1f61' }
                                                            }
                                                            disabled={entitas === '898' ? false : true}
                                                            // disabled={true}
                                                            onClick={showAppRecord}
                                                            content="Approval"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
                                                        ></ButtonComponent>

                                                        <ButtonComponent
                                                            id="btnPembatalan"
                                                            cssClass="e-primary e-small"
                                                            style={
                                                                entitas === '898'
                                                                    ? { ...styleButtonApp, width: 125 + 'px', color: '#95050a' }
                                                                    : { ...styleButtonDisabled, width: 125 + 'px', color: '#1c1b1f61' }
                                                            }
                                                            disabled={entitas === '898' ? false : true}
                                                            onClick={handlePembatalan}
                                                            content="Pembatalan"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
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
                                                                SetDataDokumenTtb('detailDok', selectedRowKodeTtb, kode_entitas, dataDetailDokTtb, router, setSelectedItem, setDetailDok, plagFilterTab)
                                                            }
                                                            iconCss={state.iconCss}
                                                            content={state.content}
                                                        ></ButtonComponent>

                                                        {/* <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}> */}
                                                        <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                            <TextBoxComponent
                                                                id="cariNoTtb"
                                                                className="searchtext"
                                                                placeholder="Cari Nomor TTB"
                                                                showClearButton={false}
                                                                //input={(args: FocusInEventArgs) => {
                                                                input={(args: ChangeEventArgsInput) => {
                                                                    const value: any = args.value;
                                                                    PencarianNoTtb(value, setSearchNoTtb, setFilteredData, recordsDataRef.current, plagFilterTab, recordsDataApproveRef.current);
                                                                }}
                                                                floatLabelType="Never"
                                                            />
                                                        </div>

                                                        <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                            <TextBoxComponent
                                                                id="cariNoReff"
                                                                className="searchtext"
                                                                placeholder="Cari Nomor Referensi"
                                                                showClearButton={true}
                                                                //input={(args: FocusInEventArgs) => {
                                                                input={(args: ChangeEventArgsInput) => {
                                                                    const value: any = args.value;
                                                                    PencarianNoReff(value, setSearchNoReff, setFilteredData, recordsDataRef.current, plagFilterTab, recordsDataApproveRef.current);
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
                    </div>
                    <div className="ml-3 mr-1" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                            Tanda Terima Barang (TTB)
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
                        <div className="panel-filter" style={{ background: '#dedede', width: '100%', maxHeight: '650px', overflowY: 'auto' }}>
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
                                    label="No. TTB"
                                    checked={isNoTtbChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsNoTtbChecked(value);
                                    }}
                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={noTtbValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoTtbInputChange(value, setNoTtbValue, setIsNoTtbChecked);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Tanggal"
                                    checked={isTanggalChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsTanggalChecked(value);
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
                                        value={date1.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTgl(moment(args.value), 'tanggalAwal', setDate1, setDate2, setIsTanggalChecked);
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
                                        value={date2.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            HandleTgl(moment(args.value), 'tanggalAkhir', setDate1, setDate2, setIsTanggalChecked);
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Nama Customer"
                                    checked={isNamaCustChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsNamaCustChecked(value);
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={namaCustValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNamaCustInputChange(value, setNamaCustValue, setIsNamaCustChecked);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Referensi"
                                    checked={isNoReffChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsNoReffChecked(value);
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={noReffValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandleNoReffInputChange(value, setNoReffValue, setIsNoReffChecked);
                                        }}
                                    />
                                </div>
                            </div>

                            <label className="mt-2 flex cursor-pointer items-center">
                                <span style={{ fontWeight: 'bold' }}>Alasan :</span>
                            </label>

                            <div className="border p-3" style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11 }}>
                                <div className="mb-2" style={{ marginBottom: 4 }}>
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        checked={alasanChecked.every((checked) => checked)}
                                        onChange={() => HandlePilihSemua(alasanChecked, setAlasanChecked)}
                                    />
                                    <span style={{ fontWeight: 'bold' }}>Pilih Semua</span>
                                </div>
                                {checkboxDataMasterAlasan.map((item, index) => (
                                    <div key={index} className="mb-2" style={{ marginBottom: -2 }}>
                                        <label className="mt-1 inline-flex">
                                            <input
                                                type="checkbox"
                                                name={item.alasan}
                                                className="peer form-checkbox"
                                                checked={alasanChecked[index]} // Atur checked berdasarkan defaultAlasanChecked atau alasanChecked
                                                onChange={() => HandleAlasan(index, alasanChecked, setAlasanChecked)}
                                            />
                                            <span>{item.alasan}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Kategori"
                                    checked={isKategoriChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsKategoriChecked(value);
                                    }}
                                />
                                <CheckBoxComponent
                                    label="Non Kategori"
                                    checked={isNonKategoriChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsNonKategoriChecked(value);
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        id="kategori"
                                        className="form-select"
                                        dataSource={apiResponseKategori.map((data: any) => data.grp)}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleKategoriChange(value, setSelectedOptionKetgori, setIsKategoriChecked);
                                        }}
                                        value={selectedOptionKategori}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Kelompok Produk"
                                    checked={isKelompokChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsKelompokChecked(value);
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        id="kelompok"
                                        className="form-select"
                                        dataSource={apiResponseKelompok.map((data: any) => data.kel)}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleKelompokChange(value, setSelectedOptionKelompok, setIsKelompokChecked);
                                        }}
                                        value={selectedOptionKelompok}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Gudang"
                                    checked={isGudangChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsGudangChecked(value);
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        id="gudang"
                                        className="form-select"
                                        dataSource={apiResponseGudang.map((data: any) => data.nama_gudang)}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleGudangChange(value, setSelectedOptionGudang, setIsGudangChecked);
                                        }}
                                        value={selectedOptionGudang}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Status Dokumen"
                                    checked={isStatusDokChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setIsStatusDokChecked(value);
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <DropDownListComponent
                                        dataSource={['Terbuka', 'Proses', 'Tertutup']}
                                        placeholder="--Silahkan Pilih--"
                                        change={(args: ChangeEventArgsDropDown) => {
                                            const value: any = args.value;
                                            HandleStatusDokInputChange(value, setStatusDokValue, setIsStatusDokChecked);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ backgroundColor: 'red', color: 'yellow', fontWeight: 'bold', fontSize: 11 }}>Gagal Kirim</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="gagal_kirim"
                                    id="ya"
                                    className="form-radio"
                                    checked={selectedOptionGagalKirim === 'ya'}
                                    onChange={(event) => HandleGagalKirim(event.target.id, setSelectedOptionGagalKirim)}
                                />
                                <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="gagal_kirim"
                                    id="tidak"
                                    className="form-radio ml-4"
                                    checked={selectedOptionGagalKirim === 'tidak'}
                                    onChange={(event) => HandleGagalKirim(event.target.id, setSelectedOptionGagalKirim)}
                                />
                                <label htmlFor="tidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="gagal_kirim"
                                    id="semua"
                                    className="form-radio ml-4"
                                    checked={selectedOptionGagalKirim === 'semua'}
                                    onChange={(event) => HandleGagalKirim(event.target.id, setSelectedOptionGagalKirim)}
                                />
                                <label htmlFor="semua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ backgroundColor: '#95050a', color: 'white', fontWeight: 'bold', fontSize: 11 }}>Pembatalan</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="pembatalan"
                                    id="pembatalanYa"
                                    className="form-radio"
                                    checked={selectedOptionPembatalan === 'pembatalanYa'}
                                    onChange={(event) => HandlePembatalan(event.target.id, setSelectedOptionPembatalan)}
                                />
                                <label htmlFor="pembatalanYa" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="pembatalan"
                                    id="pembatalanTidak"
                                    className="form-radio ml-4"
                                    checked={selectedOptionPembatalan === 'pembatalanTidak'}
                                    onChange={(event) => HandlePembatalan(event.target.id, setSelectedOptionPembatalan)}
                                />
                                <label htmlFor="pembatalanTidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="pembatalan"
                                    id="pembatalanSemua"
                                    className="form-radio ml-4"
                                    checked={selectedOptionPembatalan === 'pembatalanSemua'}
                                    onChange={(event) => HandlePembatalan(event.target.id, setSelectedOptionPembatalan)}
                                />
                                <label htmlFor="pembatalanSemua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>
                        </div>
                    </SidebarComponent>

                    {/* ===============  Grid Data ========================   */}
                    <div className="panel" style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 315px' : ' 0'), overflowY: 'auto' }}>
                        <div className="panel-data" style={{ width: '100%', height: '660px' }}>
                            <TooltipComponent ref={(t: any) => (tooltipListData = t)} opensOn="Hover" beforeRender={beforeRenderListData} target=".e-headertext">
                                <TabComponent selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                    <div className="e-tab-header" style={{ marginBottom: 10 }}>
                                        <div tabIndex={0} onClick={() => filterTab('Baru')} className="flex h-[41px] items-center justify-center">
                                            {' '}
                                            Baru
                                        </div>
                                        <div tabIndex={1} onClick={() => filterTab('Approval')} className="flex h-[41px] items-center justify-center">
                                            {' '}
                                            Approval{' '}
                                        </div>
                                        {/* <div tabIndex={0}> Data List</div> */}
                                    </div>
                                    <div className="e-content">
                                        <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                            <GridComponent
                                                key={gridKey}
                                                id="gridListData"
                                                locale="id"
                                                // ref={(g) => (gridListData = g)}
                                                ref={gridListDataRef}
                                                dataSource={searchNoTtb !== '' || searchNoReff !== '' ? filteredData : recordsDataRef.current}
                                                allowExcelExport={true}
                                                excelExportComplete={ExportComplete}
                                                allowPdfExport={true}
                                                pdfExportComplete={ExportComplete}
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
                                                height={501}
                                                gridLines={'Both'}
                                                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                queryCellInfo={queryCellInfoListData}
                                                rowDataBound={rowDataBoundListData}
                                                rowSelected={(args) => HandleRowSelected(args, setSelectedRowKodeTtb, setStatusApproval, setSelectedRowNoTtb, setSelectedPembatalan)}
                                                recordDoubleClick={(args) =>
                                                    HandleRowDoubleClicked(
                                                        args,
                                                        userMenu,
                                                        kode_entitas,
                                                        router,
                                                        gridListDataRef.current,
                                                        selectedListData,
                                                        userid,
                                                        setMasterDataState,
                                                        setMasterKodeDokumen,
                                                        setDialogInputDataVisible,
                                                        setRefreshKey,
                                                        statusApproval,
                                                        selectedPembatalan
                                                    )
                                                }
                                                rowSelecting={(args) => {
                                                    if (args.data !== undefined) {
                                                        ListDetailDok(args.data.kode_ttb, kode_entitas, setDetailDok, plagFilterTab);
                                                        // ListDetailDok(args.data.kode_ttb, kode_entitas, setDetailDok);
                                                        setDataDetailDokTtb((prevState: any) => ({
                                                            ...prevState,
                                                            no_ttb: args.data.no_ttb,
                                                            tgl_ttb: args.data.tgl_ttb,
                                                        }));
                                                    }
                                                }}
                                                // rowSelecting={(args) => RowSelectingListData(args, setDataDetailDokTtb, kode_entitas, setDetailDok)}
                                                // actionBegin={actionBeginDetailBarang}
                                                // actionComplete={actionBeginDetailBarang}
                                                dataBound={() => {
                                                    if (gridListDataRef.current) {
                                                        gridListDataRef.current?.selectRow(rowIdxListData.current);
                                                    }
                                                }}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective
                                                        field="no_ttb"
                                                        headerText="No. TTB"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                        // freeze="Left"
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_ttb"
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
                                                        field="kode_jual"
                                                        headerText="Divisi"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="nama_relasi"
                                                        headerText="Customer"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="300"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="no_reff"
                                                        headerText="No. SJ"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_sj"
                                                        headerText="Tgl. Kirim"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        type="date"
                                                        clipMode="EllipsisWithTooltip"
                                                        format={formatDate}
                                                    />
                                                    <ColumnDirective
                                                        field="nopol_sj"
                                                        headerText="No. Kendaraan"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="120"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="nama_gudang"
                                                        headerText="Gudang"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip"
                                                        // headerTemplate={gudangHeader}
                                                    />
                                                    <ColumnDirective
                                                        field="alasan"
                                                        headerText="Alasan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="250"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="dokumen"
                                                        headerText="Dokumen"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="status"
                                                        headerText="Status"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="gagal"
                                                        headerTemplate={headerProduksi}
                                                        headerText="Gagal Kirim"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        template={checkboxTemplate}
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="pembatalan"
                                                        // headerTemplate={headerProduksi}
                                                        headerText="Batal"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        template={checkboxTemplatePembatalan}
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                </ColumnsDirective>
                                                <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                            </GridComponent>
                                        </div>
                                        <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                            <GridComponent
                                                key={gridKeyApproval}
                                                id="gridListData"
                                                locale="id"
                                                // ref={(g) => (gridListData = g)}
                                                ref={gridListDataRef}
                                                dataSource={searchNoTtb !== '' || searchNoReff !== '' ? filteredData : recordsDataApproveRef.current}
                                                allowExcelExport={true}
                                                excelExportComplete={ExportComplete}
                                                allowPdfExport={true}
                                                pdfExportComplete={ExportComplete}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowPaging={true}
                                                allowSorting={true}
                                                allowFiltering={false}
                                                allowResizing={true}
                                                autoFit={true}
                                                allowReordering={true}
                                                pageSettings={{ pageSize: 20, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                                rowHeight={22}
                                                width={'100%'}
                                                height={530}
                                                gridLines={'Both'}
                                                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                queryCellInfo={queryCellInfoListData}
                                                rowDataBound={rowDataBoundListData}
                                                rowSelected={(args) => HandleRowSelected(args, setSelectedRowKodeTtb, setStatusApproval, setSelectedRowNoTtb, setSelectedPembatalan)}
                                                recordDoubleClick={(args) =>
                                                    HandleRowDoubleClicked(
                                                        args,
                                                        userMenu,
                                                        kode_entitas,
                                                        router,
                                                        gridListDataRef.current,
                                                        selectedListData,
                                                        userid,
                                                        setMasterDataState,
                                                        setMasterKodeDokumen,
                                                        setDialogInputDataVisible,
                                                        setRefreshKey,
                                                        statusApproval,
                                                        selectedPembatalan
                                                    )
                                                }
                                                rowSelecting={(args) => {
                                                    if (args.data !== undefined) {
                                                        ListDetailDok(args.data.kode_ttb, kode_entitas, setDetailDok, plagFilterTab);
                                                        // ListDetailDok(args.data.kode_ttb, kode_entitas, setDetailDok);
                                                        setDataDetailDokTtb((prevState: any) => ({
                                                            ...prevState,
                                                            no_ttb: args.data.no_ttb,
                                                            tgl_ttb: args.data.tgl_ttb,
                                                        }));
                                                    }
                                                }}
                                                // rowSelecting={(args) => RowSelectingListData(args, setDataDetailDokTtb, kode_entitas, setDetailDok)}
                                                // actionBegin={actionBeginDetailBarang}
                                                // actionComplete={actionBeginDetailBarang}
                                                dataBound={() => {
                                                    if (gridListDataRef.current) {
                                                        gridListDataRef.current?.selectRow(rowIdxListData.current);
                                                    }
                                                }}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective
                                                        field="no_ttb"
                                                        headerText="No. TTB"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip"
                                                        freeze="Left"
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_ttb"
                                                        headerText="Tanggal"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        type="date"
                                                        format={formatDate}
                                                        freeze="Left"
                                                    />
                                                    <ColumnDirective
                                                        field="kode_jual"
                                                        headerText="Divisi"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                        freeze="Left"
                                                    />
                                                    <ColumnDirective
                                                        field="nama_relasi"
                                                        headerText="Customer"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="300"
                                                        clipMode="EllipsisWithTooltip"
                                                        freeze="Left"
                                                    />
                                                    <ColumnDirective
                                                        field="status"
                                                        headerText="Status"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        freeze="Left"
                                                    />
                                                    <ColumnDirective
                                                        field="no_reff"
                                                        headerText="No. SJ"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_sj"
                                                        headerText="Tgl. Kirim"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        type="date"
                                                        clipMode="EllipsisWithTooltip"
                                                        format={formatDate}
                                                    />
                                                    <ColumnDirective
                                                        field="nopol_sj"
                                                        headerText="No. Kendaraan"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="120"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="nama_gudang"
                                                        headerText="Gudang"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="110"
                                                        clipMode="EllipsisWithTooltip"
                                                        // headerTemplate={gudangHeader}
                                                    />
                                                    <ColumnDirective
                                                        field="alasan"
                                                        headerText="Alasan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        //autoFit
                                                        width="250"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="dokumen"
                                                        headerText="Dokumen"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        //autoFit
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    {/* <ColumnDirective
                                                            field="status"
                                                            headerText="Status"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            //autoFit
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                            freeze="Left"
                                                        /> */}
                                                    <ColumnDirective
                                                        field="gagal"
                                                        headerTemplate={headerProduksi}
                                                        headerText="Gagal Kirim"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        template={checkboxTemplate}
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        columns={[
                                                            {
                                                                field: 'ket1',
                                                                headerText: 'Keterangan',
                                                                headerTextAlign: 'Center',
                                                                textAlign: 'Left',
                                                                width: '200',
                                                                // clipMode: 'EllipsisWithTooltip',
                                                                template: editTemplateKeteranganSC,
                                                            },
                                                            {
                                                                field: 'no_mb',
                                                                headerText: 'No. MB',
                                                                headerTextAlign: 'Center',
                                                                textAlign: 'Center',
                                                                width: 100,
                                                                // clipMode: 'EllipsisWithTooltip',
                                                                template: editTemplateNoMb,
                                                            },
                                                            {
                                                                field: 'user1',
                                                                headerText: 'User',
                                                                headerTextAlign: 'Center',
                                                                textAlign: 'Center',
                                                                width: 100,
                                                                // clipMode: 'EllipsisWithTooltip',
                                                                template: editTemplateUser1,
                                                            },
                                                        ]}
                                                        headerText="Supply Chain"
                                                        textAlign="Center"
                                                    />
                                                    {/* <ColumnDirective
                                                            columns={[
                                                                {
                                                                    field: 'ket2',
                                                                    headerText: 'Keterangan',
                                                                    headerTextAlign: 'Center',
                                                                    textAlign: 'Left',
                                                                    width: '150',
                                                                    // clipMode: 'EllipsisWithTooltip',
                                                                },
                                                                { field: 'cek', headerText: 'Check', headerTextAlign: 'Center', textAlign: 'Center', width: 85, clipMode: 'EllipsisWithTooltip' },
                                                                { field: 'user2', headerText: 'User', headerTextAlign: 'Center', textAlign: 'Center', width: 85, clipMode: 'EllipsisWithTooltip' },
                                                            ]}
                                                            headerText="General Affair"
                                                            textAlign="Center"
                                                        /> */}
                                                </ColumnsDirective>
                                                <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                            </GridComponent>
                                        </div>
                                    </div>
                                </TabComponent>
                            </TooltipComponent>
                            {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                            <ContextMenuComponent id="contextmenu" target=".e-gridheader" items={menuHeaderItems} select={menuHeaderSelect} animationSettings={{ duration: 800, effect: 'FadeIn' }} />
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div
                        onClick={handleRefreshData}
                        style={{ minHeight: '51px', marginTop: '-26px', marginBottom: '11px', width: '308px', backgroundColor: '#dedede', visibility: sidebarVisible ? 'visible' : 'hidden' }}
                    >
                        <div className="mt-6 flex justify-center">
                            <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                <ButtonComponent
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-medium e-refresh"
                                    content="Refresh Data"
                                    style={{ backgroundColor: '#3b3f5c', marginTop: '1px', marginBottom: '17px' }}
                                    // onClick={handleRefreshData}
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
                            marginTop: '-43px',
                            marginBottom: '11px',
                            backgroundColor: '#dedede',
                            overflowY: 'auto',
                            marginLeft: '-6px',
                        }}
                    ></div>
                </div>
            </div>
            {/*==================================================================================================*/}
            {selectedItem && (
                <Draggable>
                    <div className={`${styles.modalDetailDragable}`} style={modalPosition}>
                        <div className="overflow-auto" style={{ maxHeight: '400px', maxWidth: '100%' }}>
                            <div style={{ marginBottom: 21 }}>
                                <span style={{ fontSize: 18, fontWeight: 500 }}>
                                    Detail Tanda Terima Barang : {dataDetailDokTtb.no_ttb} - {moment(dataDetailDokTtb.tgl_ttb).format('DD-MM-YYYY')}
                                </span>
                            </div>
                            <GridComponent
                                dataSource={detailDok}
                                height={160}
                                // width={'80%'}
                                gridLines={'Both'}
                                rowHeight={22}
                                allowResizing={true}
                                allowReordering={true}
                                // ref={(g) => (gridListData = g)}
                                ref={gridListDataRef}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective field="no_item" headerText="No. Barang" width="50" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="nama_item" headerText="Nama Barang" width="200" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                    <ColumnDirective field="nama_cetak" headerText="Nama Cetak SJ" width="200" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                    <ColumnDirective field="satuan" headerText="Satuan" width="35" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="qty" headerText="Kuantitas" width="45" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective field="ket" headerText="Keterangan" width="125" textAlign="Left" headerTextAlign="Left" />
                                </ColumnsDirective>
                                <Inject services={[Page, Sort, Filter, Group]} />
                            </GridComponent>
                        </div>
                        <button
                            className={`${styles.closeButtonDetailDragable}`}
                            onClick={() => {
                                closeModal('detailDok');
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                        </button>
                        <div style={{ width: '25%' }}>
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
                                    onClick={handleFilePendukung}
                                    className="btn btn-primary mb-2 md:mb-0 md:mr-2"
                                >
                                    <FontAwesomeIcon icon={faCamera} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    File Pendukung
                                </button>
                            </>
                        </div>
                    </div>
                </Draggable>
            )}

            {plagCekFilePendukung && (
                <Draggable>
                    <div className={`${styles.modalDetailDragable}`} style={modalPositionFilePendukung}>
                        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                            <div style={{ marginBottom: 21 }}>
                                <span style={{ fontSize: 18, fontWeight: 500 }}>File Pendukung : {moment(dataDetailDokTtb.tgl_ttb).format('DD-MM-YYYY')}</span>
                            </div>
                            <hr style={{ border: '1px solid gray' }} />
                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                <TabComponent selectedItem={activeTab} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                    <div className="e-tab-header">
                                        {tabs.map((tab, index) => (
                                            <div key={index} tabIndex={index} onClick={() => setActiveTab(index)}>
                                                {tab.title}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="e-content">
                                        {tabs.map((tab, index) => (
                                            <div key={index} style={{ width: '100%', height: '50%', marginTop: '5px' }} tabIndex={index}>
                                                <div className="flex">
                                                    <div style={{ width: '70%' }}>
                                                        <div className="border p-3" style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '239px' }}>
                                                            {
                                                                <>
                                                                    {(() => {
                                                                        const foundItem = loadFilePendukung.find((item: any) => item.id_dokumen === index);
                                                                        const filegambar = foundItem?.filegambar;
                                                                        if (filegambar) {
                                                                            const imageUrl = extractedFiles.find((item) => item.fileName === filegambar)?.imageUrl;
                                                                            return (
                                                                                imageUrl && (
                                                                                    <img
                                                                                        src={imageUrl}
                                                                                        alt={`Tab ${index + 1}`}
                                                                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                                                        onClick={() =>
                                                                                            OpenPreview(
                                                                                                index,
                                                                                                setIndexPreview,
                                                                                                setIsOpenPreview,
                                                                                                setZoomScale,
                                                                                                setPosition,
                                                                                                loadFilePendukung,
                                                                                                extractedFiles,
                                                                                                setImageDataUrl
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                )
                                                                            );
                                                                        }
                                                                        return null;
                                                                    })()}
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div style={{ width: '5%' }}></div>
                                                    <div style={{ width: '25%' }}>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '100%',
                                                                height: '13%',
                                                                marginTop: -7,
                                                                borderRadius: '5px',
                                                                fontSize: '13px',
                                                            }}
                                                            onClick={() =>
                                                                OpenPreview(index, setIndexPreview, setIsOpenPreview, setZoomScale, setPosition, loadFilePendukung, extractedFiles, setImageDataUrl)
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faCamera} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                            Preview
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabComponent>
                            </div>
                        </div>
                        <button
                            className={`${styles.closeButtonDetailDragable}`}
                            onClick={() => {
                                closeModal('filePendukung');
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                        </button>
                    </div>
                </Draggable>
            )}

            {isOpenPreview && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '1000',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            textAlign: 'center',
                            zIndex: '1001',
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                    >
                        <img
                            src={imageDataUrl}
                            alt={`Zoomed ${indexPreview}`}
                            style={{
                                transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px)`,
                                transition: 'transform 0.1s ease',
                                cursor: 'pointer',
                                maxWidth: '100vw',
                                maxHeight: '100vh',
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                        />
                    </div>
                    <div
                        style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            zIndex: '1001',
                        }}
                    >
                        <ButtonComponent
                            id="zoomIn"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-zoom-in" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => HandleZoomIn(setZoomScale)}></span>
                        </ButtonComponent>
                        <ButtonComponent
                            id="zoomOut"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-zoom-out" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => HandleZoomOut(setZoomScale)}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            id="close"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-close" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={() => HandleCloseZoom(setIsOpenPreview, setImageDataUrl)}></span>
                        </ButtonComponent>
                    </div>
                </div>
            )}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk view TTD =============================*/}
            {/*==================================================================================================*/}

            {/* Modal Preview TTDFile Pendukung Images */}
            {plagInputKetSc1 === true ? (
                <>
                    <Draggable disabled={true}>
                        <div className={`${styles.modalDetailDragable}`} style={modalPositionKet}>
                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 18, fontWeight: 500 }}>Keterangan Supply Chain : {selectedRowNoTtb}</span>
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
                                        value={plagFilterInput}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setInputKetSc(value);
                                            setPlagFilterInput(value);
                                        }}
                                        cssClass={styles['custom-textbox']}
                                    />
                                </div>
                            </div>
                            <button
                                className={`${styles.closeButtonDetailDragable}`}
                                onClick={() => {
                                    closeModalKetSc('ketSc');
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
                                                simpanUpdateKetSc();
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
                                            onClick={() => closeModalKetSc('ketSc')}
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

            <DialogTtbList
                userid={userid}
                kode_entitas={kode_entitas}
                entitas={entitas}
                masterKodeDokumen={masterKodeDokumen}
                masterDataState={masterDataState}
                masterBarangProduksi={masterBarangProduksi}
                isOpen={dialogInputDataVisible}
                onClose={() => {
                    setDialogInputDataVisible(false);
                }}
                onRefresh={handleRefreshData}
                kode_user={kode_user}
                refreshKey={refreshKey}
                onOpen={() => {
                    setDialogInputDataVisible(true);
                }}
                token={token}
                valueAppBackdate={valueAppBackdate}
            />
        </div>
    );
};

// export { getServerSideProps };

export default TTBList;
