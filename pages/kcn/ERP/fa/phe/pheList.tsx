import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { SidebarComponent, SidebarType, ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ChangeEventArgs as ChangeEventArgsInput, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import {
    Grid,
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
    Aggregate,
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
import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
// import { getServerSideProps } from '@/pages/api/getServerSide';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import { useSession } from '@/pages/api/sessionContext';
import { TabComponent } from '@syncfusion/ej2-react-navigations';
import { LoadDataImage, swalDialog, swalPopUp } from '../../inventory/ttb/functional/fungsiFormTtb';
import { PostReleasePhe, getListPhe } from '@/lib/fa/phe/api/api';
import { handleDoubleClick, handleDoubleClickApp, handleRowSelected, pencarianBayar, pencarianNoPhe, showLoading1, swalToast, totBayarMu } from '@/lib/fa/phe/functional/fungsiForm';
import DialogPhe from './component/dialogPhe';
import style from '@/styles/index.module.css';
import { usersApp, appBackdate, usersMenu } from '@/utils/global/fungsi';
import { CustomSumBayarMu } from '@/utils/fa/phe/interface/fungsi';

enableRipple(true);

let textareaObj: any;
const PheList = () => {
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

    let sidebarObj: SidebarComponent;
    let type: SidebarType = 'Push';
    let mediaQueryState: string = '(min-width: 600px)';

    // =====================================================================
    // INI KODINGAN TERBARU PHE
    const [stateFiilterData, setStateFilterData] = useState({
        noPheValue: '',
        date1: moment(),
        date2: moment().endOf('month'),
        namaEkspedisiValue: '',
        noReffValue: '',
        selectedOptionPph: 'semua',
        selectedOptionLunas: 'semua',
    });

    const [stateChecked, setStateChecked] = useState({
        isNoPheChecked: false,
        isTanggalChecked: true,
        isNamaEkspedisiChecked: false,
        isNoReffChecked: false,
    });

    const [stateDataHeaderList, setStateDataHeaderList] = useState({
        searchNoPhe: '',
        searchBayar: '',
    });

    const [stateDataParams, setStateDataParams] = useState({
        via: '',
        pph23: '',
        kode_phe: '',
        kode_rpe: '',
        kode_dokumen: '', // untuk pembayaran kalo ada jurnal
        statusApproval: '',
        status: '',
        status_app: '',
        no_dokumen: '',
        no_phe: '',
        tgl_phe: '',
    });
    // END

    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
        app_fpp: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '', app_fpp: '' });
    const kode_menu = '60203'; // kode menu PO
    const [refreshKey, setRefreshKey] = useState(0);

    type PHEListItem = {
        no_phe: string;
        tgl_phe: any;
        via: any;
        no_reff: any;
        pph23: any;
        netto_mu: any;
        total_mu: any;
        status: any;
        statusApproval: any;
        no_dokumen: any;
        no_dokumen_rev: any;
    };
    const [recordsData, setRecordsData] = useState<PHEListItem[]>([]);
    const [recordsDataApprove, setRecordsDataApprove] = useState<PHEListItem[]>([]);
    const [recordsDataBayar, setRecordsDataBayar] = useState<PHEListItem[]>([]);
    const recordsDataRef = useRef<PHEListItem[]>([]);
    const recordsDataApproveRef = useRef<PHEListItem[]>([]);
    const recordsDataBayarRef = useRef<PHEListItem[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [filteredDataApproval, setFilteredDataApproval] = useState<any[]>([]);
    const [filteredDataBayar, setFilteredDataBaru] = useState<any[]>([]);

    // INI YANG TERBARU
    const [masterDataState, setMasterDataState] = useState<string>('BARU');
    const [masterKodeDokumen, setMasterKodeDokumen] = useState<string>('BARU');
    const [masterBarangProduksi, setMasterBarangProduksi] = useState<string>('Y');
    const [dialogInputDataVisible, setDialogInputDataVisible] = useState(false);

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    // let gridListData: Grid | any;
    const gridListDataRef = useRef<GridComponent>(null);
    const gridListDataApprovalRef = useRef<GridComponent>(null);
    const gridListDataBayarRef = useRef<GridComponent>(null);

    const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonApp = { fontWeight: 'bold', width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#e6e6e6' };
    const styleButtonDisabled = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

    const tanggalSekarang = moment();
    // Menentukan tanggal awal bulan
    const tanggalAwalBulan = tanggalSekarang.startOf('month');
    // Menentukan tanggal akhir bulan dengan moment.js
    const tanggalHariIni = moment(new Date()).format('YYYY-MM-DD');
    const tanggalAkhirBulan = moment(tanggalAwalBulan.endOf('month')).format('YYYY-MM-DD');

    const [valueAppBackdate, setValueAppBackdate] = useState(true);
    const vRefreshData = useRef(0);

    // ====================== FUNGSI FUNGSI BARU PHE ==========================

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

        await appBackdate(kode_entitas, userid)
            .then((result) => {
                setValueAppBackdate(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        const respUsersApp = await usersApp(kode_entitas, userid);
        setUserMenu((prevState: any) => ({
            ...prevState,
            app_fpp: respUsersApp[0].app_fpp,
        }));
        // console.log('respUsersApp = ', respUsersApp[0].app_fpp);
    };

    useEffect(() => {
        const refreshData = async () => {
            let entitas = kode_entitas;
            let noPhe = 'all';
            let tglAwal = tanggalHariIni; //tanggalHariIni
            let tglAkhir = tanggalAkhirBulan; //tanggalAkhirBulan
            // let tglAwal = '2024-12-18'; //tanggalHariIni
            // let tglAkhir = '2024-12-18'; //tanggalAkhirBulan

            let namaEkspedisi = 'all';
            let noReff = 'all';
            let pph23 = 'all';
            let statusLunas = 'all';

            const paramObject = {
                kode_entitas: entitas,
                noPhe: noPhe,
                tglAwal: tglAwal, //tanggalHariIni
                tglAkhir: tglAkhir, //tanggalAkhirBulan

                namaEkspedisi: namaEkspedisi,
                noReff: noReff,
                pph23: pph23,
                statusLunas: statusLunas,
                token: token,
            };

            const responseDataBaru = await getListPhe(paramObject, '0');
            const responseDataApproval = await getListPhe(paramObject, '1');
            const responseDataPembayaran = await getListPhe(paramObject, '2');
            // Menambahkan field baru ke responseDataApprove
            const responseDataBaruFix = responseDataBaru.map((item: any) => ({
                ...item,
                statusApproval: 'Baru',
                netto_mu: parseFloat(item.netto_mu),
                total_mu: parseFloat(item.total_mu),
            }));

            const responseDataApproveFix = responseDataApproval.map((item: any) => ({
                ...item,
                statusApproval: 'Approval',
                netto_mu: parseFloat(item.netto_mu),
                total_mu: parseFloat(item.total_mu),
            }));

            const responseDataBayarFix = responseDataPembayaran.map((item: any) => ({
                ...item,
                statusApproval: 'Bayar',
                netto_mu: parseFloat(item.netto_mu),
                total_mu: parseFloat(item.total_mu),
            }));

            setRecordsData(responseDataBaruFix);
            setRecordsDataApprove(responseDataApproveFix);
            setRecordsDataBayar(responseDataBayarFix);
            recordsDataRef.current = responseDataBaruFix;
            recordsDataApproveRef.current = responseDataApproveFix;
            recordsDataBayarRef.current = responseDataBayarFix;
        };
        refreshData();
        fetchDataUseEffect();
    }, []);

    const handleRefreshData = async () => {
        vRefreshData.current += 1;
        const cariNoPhe = document.getElementById('cariNoPhe') as HTMLInputElement;
        if (cariNoPhe) {
            cariNoPhe.value = '';
        }

        const cariBayar = document.getElementById('cariBayar') as HTMLInputElement;
        if (cariBayar) {
            cariBayar.value = '';
        }
        setStateDataHeaderList((prevState: any) => ({
            ...prevState,
            searchNoPhe: '',
            searchBayar: '',
        }));
        await showLoading1(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                let entitas = kode_entitas;
                let noPhe = 'all';
                let tglAwal = 'all'; //tanggalHariIni
                let tglAkhir = 'all'; //tanggalAkhirBulan

                let namaEkspedisi = 'all';
                let noReff = 'all';
                let pph23 = 'all';
                let statusLunas = 'all';

                if (stateChecked.isNoPheChecked) {
                    noPhe = `${stateFiilterData.noPheValue}`;
                }

                if (stateChecked.isTanggalChecked) {
                    const formattedDate1 = stateFiilterData.date1.format('YYYY-MM-DD');
                    const formattedDate2 = stateFiilterData.date2.format('YYYY-MM-DD');
                    tglAwal = `${formattedDate1}`;
                    tglAkhir = `${formattedDate2}`;
                }

                if (stateChecked.isNamaEkspedisiChecked) {
                    namaEkspedisi = `${stateFiilterData.namaEkspedisiValue}`;
                }

                if (stateChecked.isNoReffChecked) {
                    noReff = `${stateFiilterData.noReffValue}`;
                }

                if (stateFiilterData.selectedOptionPph === 'semua') {
                    pph23 = 'all';
                } else if (stateFiilterData.selectedOptionPph === 'ya') {
                    pph23 = 'P';
                } else if (stateFiilterData.selectedOptionPph === 'tidak') {
                    pph23 = 'N';
                }

                if (stateFiilterData.selectedOptionLunas === 'semua') {
                    statusLunas = 'all';
                } else if (stateFiilterData.selectedOptionLunas === 'lunas') {
                    statusLunas = 'Lunas';
                } else if (stateFiilterData.selectedOptionLunas === 'batalBayar') {
                    statusLunas = 'Batal Bayar';
                }

                const paramObject = {
                    kode_entitas: entitas,
                    noPhe: noPhe,
                    tglAwal: tglAwal, //tanggalHariIni
                    tglAkhir: tglAkhir, //tanggalAkhirBulan

                    namaEkspedisi: namaEkspedisi,
                    noReff: noReff,
                    pph23: pph23,
                    statusLunas: statusLunas,
                    token: token,
                };

                const responseDataBaru = await getListPhe(paramObject, '0');
                const responseDataApproval = await getListPhe(paramObject, '1');
                const responseDataPembayaran = await getListPhe(paramObject, '2');
                // Menambahkan field baru ke responseDataApprove
                const responseDataBaruFix = responseDataBaru.map((item: any) => ({
                    ...item,
                    statusApproval: 'Baru',
                    netto_mu: parseFloat(item.netto_mu),
                    total_mu: parseFloat(item.total_mu),
                }));

                const responseDataApproveFix = responseDataApproval.map((item: any) => ({
                    ...item,
                    statusApproval: 'Approval',
                    netto_mu: parseFloat(item.netto_mu),
                    total_mu: parseFloat(item.total_mu),
                }));

                const responseDataBayarFix = responseDataPembayaran.map((item: any) => ({
                    ...item,
                    statusApproval: 'Bayar',
                    netto_mu: parseFloat(item.netto_mu),
                    total_mu: parseFloat(item.total_mu),
                }));

                setRecordsData(responseDataBaruFix);
                setRecordsDataApprove(responseDataApproveFix);
                setRecordsDataBayar(responseDataBayarFix);
                recordsDataRef.current = responseDataBaruFix;
                recordsDataApproveRef.current = responseDataApproveFix;
                recordsDataBayarRef.current = responseDataBayarFix;
                showLoading1(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const showNewRecord = async () => {
        setMasterDataState('BARU');
        setMasterKodeDokumen('BARU');

        setDialogInputDataVisible(true);
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const showEditRecord = () => {
        if (masterKodeDokumen === '' || masterKodeDokumen === 'BARU') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PHE terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: style['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setMasterDataState('EDIT');
        setMasterKodeDokumen(masterKodeDokumen);
        setDialogInputDataVisible(true);
        setRefreshKey((prevKey: any) => prevKey + 1);
    };

    const showAppBtlRecord = (tipe: any) => {
        if (masterKodeDokumen === '' || masterKodeDokumen === 'BARU') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PHE terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: style['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        if (tipe === 'approval') {
            if (stateDataParams.status === 'Terbuka' && stateDataParams.statusApproval === 'Approval') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Status approval Disetujui tidak dapat dikoreksi</p>',
                    width: '100%',
                    customClass: {
                        popup: style['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }
        } else {
            if (stateDataParams.statusApproval === 'Baru' && stateDataParams.status === 'Terbuka') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Status approval Terbuka tidak dapat dibatalkan</p>',
                    width: '100%',
                    customClass: {
                        popup: style['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }
        }

        setMasterDataState(`${tipe === 'approval' ? 'APPROVAL' : 'BATAL APP'}`);
        setMasterKodeDokumen(masterKodeDokumen);
        setDialogInputDataVisible(true);
        setRefreshKey((prevKey: any) => prevKey + 1);
    };

    const onClickRelease = async () => {
        const jsonData = {
            entitas: kode_entitas,
            userid: userid.toUpperCase(),
            kode_phe: stateDataParams.kode_phe,
        };
        const reqReleasePhe = await PostReleasePhe(jsonData, token, kode_entitas);
        if (reqReleasePhe.data.status === true) {
            await withReactContent(swalPopUp).fire({
                icon: 'success',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data RPE berhasil di Release</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                heightAuto: true,
                timer: 2000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: style['colored-popup'], // Custom class untuk sweetalert
                },
            });
            handleRefreshData();
        }
    };

    const showBayarRecord = (tipe: any) => {
        if (masterKodeDokumen === '' || masterKodeDokumen === 'BARU') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PHE terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: style['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setMasterDataState(`${tipe === 'bayar' ? 'BAYAR' : 'BATAL BAYAR'}`);
        setMasterKodeDokumen(masterKodeDokumen);
        setDialogInputDataVisible(true);
        setRefreshKey((prevKey: any) => prevKey + 1);
    };

    const showUpdateFilePendukung = () => {
        if (masterKodeDokumen === '' || masterKodeDokumen === 'BARU') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data PHE terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: style['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setMasterDataState(stateDataParams.status_app === 'Baru' ? 'EDIT' : 'FilePendukung');
        setMasterKodeDokumen(masterKodeDokumen);
        setDialogInputDataVisible(true);
        setRefreshKey((prevKey: any) => prevKey + 1);
    };

    const showReleaseRecord = () => {
        if (stateDataParams.status === 'Batal Bayar' && stateDataParams.status_app === 'Disetujui') {
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

    .custom-content p {
        margin: 5px 0; /* Sesuaikan margin antara baris */
    }
`;
            document.head.appendChild(style);

            withReactContent(swalDialog)
                .fire({
                    title: '<p style="font-size:13px; font-weight:bold; text-align:center;">Release RPE dari Pembatalan Pembayaran Ekspedisi</p>',
                    html: `
            <div class="custom-content" style="font-size:13px; text-align:left;">
                <p><strong>No. PHE   :</strong> ${stateDataParams.no_phe}</p>
                <p><strong>Tanggal   :</strong> ${moment(stateDataParams.tgl_phe).format('DD-MM-YYYY')}</p>
            </div>
        `,
                    width: '21%',
                    // target: '#dialogTtbList',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'No',
                    showCancelButton: true,
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        onClickRelease();
                    }
                });
            return;
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Hanya Status Batal Bayar yang dapat di Release RPE nya.</p>',
                width: '100%',
                customClass: {
                    popup: style['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
    };

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

    //============== Format baris pada grid List Data  =============
    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            if (getValue('status', args.data) == 'Lunas' && getValue('status_app', args.data) === 'Baru') {
                args.row.style.background = '#35df0d';
            } else if (getValue('status', args.data) == 'Lunas' && getValue('status_app', args.data) === 'Disetujui') {
                args.row.style.background = 'yellow';
            } else if (getValue('status', args.data) == 'Terbuka' && getValue('status_app', args.data) === 'Disetujui') {
                args.row.style.background = 'yellow';
            } else if (getValue('status', args.data) == 'Terbuka' && getValue('status_app', args.data) === 'Ditolak') {
                args.row.style.background = 'yellow';
            } else if (getValue('status', args.data) == 'Batal Bayar' && getValue('status_app', args.data) === 'Disetujui') {
                args.row.style.background = 'yellow';
            } else if (getValue('status', args.data) == 'Release' && getValue('status_app', args.data) === 'Disetujui') {
                args.row.style.background = 'yellow';
            }
        }
    };

    //============== Format cell pada grid list Data ===============
    const queryCellInfoListDataBaru = (args: any) => {
        if (getValue('status', args.data) == 'Lunas' && getValue('status_app', args.data) === 'Baru') {
            args.cell.style.color = 'black';
        } else if (getValue('status', args.data) == 'Terbuka' && getValue('status_app', args.data) === 'Baru') {
            args.cell.style.color = 'blue';
        } else if (getValue('status', args.data) == 'Terbuka' && getValue('status_app', args.data) === 'Ditolak') {
            args.cell.style.color = 'red';
        } else if (getValue('status', args.data) == 'Terbuka' && getValue('status_app', args.data) === 'Koreksi') {
            args.cell.style.color = 'blue';
        } else if (getValue('status', args.data) == 'Batal Bayar' && getValue('status_app', args.data) === 'Baru') {
            args.cell.style.color = 'blue';
        }
    };
    const queryCellInfoListDataApproval = (args: any) => {
        args.cell.style.color = 'red';
    };
    const queryCellInfoListDataBayar = (args: any) => {
        if (getValue('status', args.data) == 'Lunas' && getValue('status_app', args.data) === 'Baru') {
            args.cell.style.color = 'black';
        } else {
            args.cell.style.color = 'red';
        }
    };

    // END

    const handleParamsObject = {
        kode_entitas: kode_entitas,
        token: token,
        userid: userid,
        entitas: entitas,
        vRefreshData: vRefreshData,
        tipe: '',
        valueObject: null,
        setStateDataHeaderList,
        setRecordsData,
        setRecordsDataApprove,
        setRecordsDataBayar,
        setFilteredData,
        setFilteredDataApproval,
        setFilteredDataBaru,

        setMasterDataState,
        setMasterKodeDokumen,
        setDialogInputDataVisible,
        setRefreshKey,
        setStateDataParams,

        recordsData,
        recordsDataApprove,
        recordsDataBayar,

        masterDataState,
        masterKodeDokumen,
        dialogInputDataVisible,
        refreshKey,
        stateDataParams,
    };
    // ===========================================================================================

    //

    return (
        <div className="Main" id="main-target">
            {/*==================================================================================================*/}
            {/*================================ Tampilan utama Tanda Terima Barang =============================*/}
            {/*==================================================================================================*/}
            <div>
                <div style={{ minHeight: '40px', marginTop: '-19px', marginBottom: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                                        <ButtonComponent
                                                            id="btnApp"
                                                            cssClass="e-primary e-small"
                                                            style={
                                                                userMenu.app_fpp === '2' || userid === 'administrator' || userid === 'ADMINISTRATOR'
                                                                    ? { ...styleButtonApp, width: 100 + 'px', color: 'green' }
                                                                    : { ...styleButtonDisabled, width: 100 + 'px', color: '#1c1b1f61' }
                                                            }
                                                            disabled={userMenu.app_fpp === '2' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                                            // disabled={true}
                                                            onClick={() => showAppBtlRecord('approval')}
                                                            content="Approval"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
                                                        ></ButtonComponent>

                                                        <ButtonComponent
                                                            id="btnBatalApp"
                                                            cssClass="e-primary e-small"
                                                            style={
                                                                userMenu.app_fpp === '2' || userid === 'administrator' || userid === 'ADMINISTRATOR'
                                                                    ? { ...styleButtonApp, width: 125 + 'px', color: '#95050a' }
                                                                    : { ...styleButtonDisabled, width: 125 + 'px', color: '#1c1b1f61' }
                                                            }
                                                            disabled={userMenu.app_fpp === '2' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                                            onClick={() => showAppBtlRecord('batal')}
                                                            content="Batal Approval"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
                                                        ></ButtonComponent>

                                                        <ButtonComponent
                                                            id="btnPembayaran"
                                                            cssClass="e-primary e-small"
                                                            style={{ ...styleButtonApp, width: 119 + 'px', color: 'green' }}
                                                            disabled={entitas === '898' ? false : true}
                                                            // disabled={true}
                                                            onClick={() => {
                                                                showBayarRecord('bayar');
                                                            }}
                                                            content="Pembayaran"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
                                                        ></ButtonComponent>

                                                        <ButtonComponent
                                                            id="btnBatalPembayaran"
                                                            cssClass="e-primary e-small"
                                                            style={{ ...styleButtonApp, width: 143 + 'px', color: 'green' }}
                                                            disabled={entitas === '898' ? false : true}
                                                            // disabled={true}
                                                            onClick={() => {
                                                                showBayarRecord('batal bayar');
                                                            }}
                                                            content="Batal Pembayaran"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
                                                        ></ButtonComponent>

                                                        <ButtonComponent
                                                            id="btnReleaseRpe"
                                                            cssClass="e-primary e-small"
                                                            style={
                                                                userMenu.app_fpp === '2' || userid === 'administrator' || userid === 'ADMINISTRATOR'
                                                                    ? { ...styleButtonApp, width: 125 + 'px', color: 'green' }
                                                                    : { ...styleButtonDisabled, width: 125 + 'px', color: '#1c1b1f61' }
                                                            }
                                                            disabled={userMenu.app_fpp === '2' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                                                            // disabled={true}
                                                            onClick={showReleaseRecord}
                                                            content="Release RPE"
                                                            iconCss="e-icons e-medium e-chevron-right"
                                                            iconPosition="Left"
                                                        ></ButtonComponent>

                                                        {/* <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}> */}
                                                        <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                            <TextBoxComponent
                                                                id="cariNoPhe"
                                                                className="searchtext"
                                                                placeholder="<Cari Nomor PHE>"
                                                                showClearButton={false}
                                                                //input={(args: FocusInEventArgs) => {
                                                                input={(args: ChangeEventArgsInput) => {
                                                                    const value: any = args.value;
                                                                    const mergerObject = {
                                                                        ...handleParamsObject,
                                                                        valueObject: value,
                                                                    };
                                                                    pencarianNoPhe(mergerObject);
                                                                }}
                                                                floatLabelType="Never"
                                                            />
                                                        </div>

                                                        <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                            <TextBoxComponent
                                                                id="cariBayar"
                                                                className="searchtext"
                                                                placeholder="<Bayar>"
                                                                showClearButton={true}
                                                                //input={(args: FocusInEventArgs) => {
                                                                input={(args: ChangeEventArgsInput) => {
                                                                    const value: any = args.value;
                                                                    const mergerObject = {
                                                                        ...handleParamsObject,
                                                                        valueObject: value,
                                                                    };
                                                                    pencarianBayar(mergerObject);
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
                            Pembayaran Hutang Ekspedisi (PHE)
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
                        <div className="panel-filter" style={{ background: '#dedede', width: '100%', height: '100%', overflowY: 'auto' }}>
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
                                    label="No. PHE"
                                    checked={stateChecked.isNoPheChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setStateChecked((prevState: any) => ({
                                            ...prevState,
                                            isNoPheChecked: value,
                                        }));
                                    }}
                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={stateFiilterData.noPheValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setStateChecked((prevState: any) => ({
                                                ...prevState,
                                                isNoPheChecked: value,
                                            }));
                                            setStateFilterData((prevState: any) => ({
                                                ...prevState,
                                                noPheValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="Tanggal"
                                    checked={stateChecked.isTanggalChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setStateChecked((prevState: any) => ({
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
                                        value={stateFiilterData.date1.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            setStateChecked((prevState: any) => ({
                                                ...prevState,
                                                isTanggalChecked: true,
                                            }));
                                            setStateFilterData((prevState: any) => ({
                                                ...prevState,
                                                date1: moment(args.value),
                                            }));
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
                                        value={stateFiilterData.date2.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            setStateChecked((prevState: any) => ({
                                                ...prevState,
                                                isTanggalChecked: true,
                                            }));
                                            setStateFilterData((prevState: any) => ({
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
                                    label="Nama Ekspedisi"
                                    checked={stateChecked.isNamaEkspedisiChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setStateChecked((prevState: any) => ({
                                            ...prevState,
                                            isNamaEkspedisiChecked: true,
                                        }));
                                    }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={stateFiilterData.namaEkspedisiValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setStateChecked((prevState: any) => ({
                                                ...prevState,
                                                isNamaEkspedisiChecked: value,
                                            }));
                                            setStateFilterData((prevState: any) => ({
                                                ...prevState,
                                                namaEkspedisiValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <CheckBoxComponent
                                    label="No. Reff"
                                    checked={stateChecked.isNoReffChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setStateChecked((prevState: any) => ({
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
                                        value={stateFiilterData.noReffValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setStateChecked((prevState: any) => ({
                                                ...prevState,
                                                isNoReffChecked: value,
                                            }));
                                            setStateFilterData((prevState: any) => ({
                                                ...prevState,
                                                noReffValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 11 }}>PPH</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="pph"
                                    id="ya"
                                    className="form-radio"
                                    checked={stateFiilterData.selectedOptionPph === 'ya'}
                                    onChange={(event) =>
                                        setStateFilterData((prevState: any) => ({
                                            ...prevState,
                                            selectedOptionPph: event.target.id,
                                        }))
                                    }
                                />
                                <label htmlFor="ya" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="pph"
                                    id="tidak"
                                    className="form-radio ml-4"
                                    checked={stateFiilterData.selectedOptionPph === 'tidak'}
                                    onChange={(event) =>
                                        setStateFilterData((prevState: any) => ({
                                            ...prevState,
                                            selectedOptionPph: event.target.id,
                                        }))
                                    }
                                />
                                <label htmlFor="tidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="pph"
                                    id="semua"
                                    className="form-radio ml-4"
                                    checked={stateFiilterData.selectedOptionPph === 'semua'}
                                    onChange={(event) =>
                                        setStateFilterData((prevState: any) => ({
                                            ...prevState,
                                            selectedOptionPph: event.target.id,
                                        }))
                                    }
                                />
                                <label htmlFor="semua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>

                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 11 }}>Lunas</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="pembayaranLunas"
                                    id="lunas"
                                    className="form-radio"
                                    checked={stateFiilterData.selectedOptionLunas === 'lunas'}
                                    onChange={(event) =>
                                        setStateFilterData((prevState: any) => ({
                                            ...prevState,
                                            selectedOptionLunas: event.target.id,
                                        }))
                                    }
                                />
                                <label htmlFor="lunas" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Lunas
                                </label>

                                <input
                                    type="radio"
                                    name="pembayaranLunas"
                                    id="batalBayar"
                                    className="form-radio ml-4"
                                    checked={stateFiilterData.selectedOptionLunas === 'batalBayar'}
                                    onChange={(event) =>
                                        setStateFilterData((prevState: any) => ({
                                            ...prevState,
                                            selectedOptionLunas: event.target.id,
                                        }))
                                    }
                                />
                                <label htmlFor="batalBayar" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Batal Bayar
                                </label>

                                <input
                                    type="radio"
                                    name="pembayaranLunas"
                                    id="semua"
                                    className="form-radio ml-4"
                                    checked={stateFiilterData.selectedOptionLunas === 'semua'}
                                    onChange={(event) =>
                                        setStateFilterData((prevState: any) => ({
                                            ...prevState,
                                            selectedOptionLunas: event.target.id,
                                        }))
                                    }
                                />
                                <label htmlFor="semua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>
                        </div>
                    </SidebarComponent>

                    {/* ===============  Grid Data ========================   */}
                    <div className="panel" style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 315px' : ' 0'), overflowY: 'auto' }}>
                        <div className="panel-data" style={{ width: '100%', height: '660px' }}>
                            <TabComponent selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                <div className="e-tab-header" style={{ marginBottom: 10 }}>
                                    <div tabIndex={0} className="flex h-[41px] items-center justify-center">
                                        {' '}
                                        1. PHE Baru
                                    </div>
                                    <div tabIndex={1} className="flex h-[41px] items-center justify-center">
                                        {' '}
                                        2. Approval{' '}
                                    </div>
                                    <div tabIndex={2} className="flex h-[41px] items-center justify-center">
                                        {' '}
                                        3. Selesai Bayar{' '}
                                    </div>
                                    {/* <div tabIndex={0}> Data List</div> */}
                                </div>
                                <div className="e-content">
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                        <GridComponent
                                            // key={gridKey}
                                            // key={`key-${refreshGrid}`}
                                            id="gridListData"
                                            locale="id"
                                            // ref={(g) => (gridListData = g)}
                                            ref={gridListDataRef}
                                            dataSource={stateDataHeaderList.searchNoPhe !== '' || stateDataHeaderList.searchBayar !== '' ? filteredData : recordsDataRef.current}
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
                                            queryCellInfo={queryCellInfoListDataBaru}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={(args) => {
                                                const mergerObject = {
                                                    ...handleParamsObject,
                                                };
                                                handleRowSelected(args, mergerObject);
                                            }}
                                            recordDoubleClick={(args) => {
                                                const mergerObject = {
                                                    ...handleParamsObject,
                                                };
                                                handleDoubleClick(args, mergerObject);
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_phe"
                                                    headerText="No. PHE"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="125"
                                                />
                                                <ColumnDirective
                                                    field="tgl_phe"
                                                    headerText="Tgl. PHE"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="via"
                                                    headerText="Ekspedisi"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="400"
                                                />
                                                <ColumnDirective
                                                    field="no_reff"
                                                    headerText="No. Reff"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="120"
                                                />
                                                <ColumnDirective
                                                    field="pph23"
                                                    headerText="pph23"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="65"
                                                />

                                                <ColumnDirective
                                                    field="netto_mu"
                                                    format="N2"
                                                    headerText="Jumlah"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                />
                                                <ColumnDirective
                                                    field="total_mu"
                                                    format="N2"
                                                    headerText="Total Bayar"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                />
                                                <ColumnDirective
                                                    field="status"
                                                    headerText="status"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="80"
                                                />
                                                <ColumnDirective
                                                    field="status_app"
                                                    headerText="Approval"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                />
                                                <ColumnDirective
                                                    field="no_dokumen"
                                                    headerText="No. Jurnal"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="150"
                                                />

                                                <ColumnDirective field="no_dokumen_rev" headerText="No. Jurnal Rev" headerTextAlign="Center" textAlign="Left" width="150" />
                                            </ColumnsDirective>
                                            <AggregatesDirective>
                                                <AggregateDirective>
                                                    <AggregateColumnsDirective>
                                                        <AggregateColumnDirective field="total_mu" type="Custom" customAggregate={totBayarMu} footerTemplate={CustomSumBayarMu} />
                                                    </AggregateColumnsDirective>
                                                </AggregateDirective>
                                            </AggregatesDirective>
                                            <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                        <GridComponent
                                            // key={gridKey}
                                            id="gridListData"
                                            locale="id"
                                            // ref={(g) => (gridListData = g)}
                                            ref={gridListDataApprovalRef}
                                            dataSource={stateDataHeaderList.searchNoPhe !== '' || stateDataHeaderList.searchBayar !== '' ? filteredDataApproval : recordsDataApproveRef.current}
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
                                            // // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            queryCellInfo={queryCellInfoListDataApproval}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={(args) => {
                                                const mergerObject = {
                                                    ...handleParamsObject,
                                                };
                                                handleRowSelected(args, mergerObject);
                                            }}
                                            recordDoubleClick={(args) => {
                                                const mergerObject = {
                                                    ...handleParamsObject,
                                                };
                                                handleDoubleClickApp(args, mergerObject);
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_phe"
                                                    headerText="No. PHE"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="125"
                                                />
                                                <ColumnDirective
                                                    field="tgl_phe"
                                                    headerText="Tgl. PHE"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="via"
                                                    headerText="Ekspedisi"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="400"
                                                />
                                                <ColumnDirective
                                                    field="no_reff"
                                                    headerText="No. Reff"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="120"
                                                />
                                                <ColumnDirective
                                                    field="pph23"
                                                    headerText="pph23"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="65"
                                                />

                                                <ColumnDirective
                                                    field="netto_mu"
                                                    format="N2"
                                                    headerText="Jumlah"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                />
                                                <ColumnDirective
                                                    field="total_mu"
                                                    format="N2"
                                                    headerText="Total Bayar"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                />
                                                <ColumnDirective
                                                    field="status"
                                                    headerText="status"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="80"
                                                />
                                                <ColumnDirective
                                                    field="status_app"
                                                    headerText="Approval"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                />
                                                <ColumnDirective
                                                    field="no_dokumen"
                                                    headerText="No. Jurnal"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="150"
                                                />

                                                <ColumnDirective field="no_dokumen_rev" headerText="No. Jurnal Rev" headerTextAlign="Center" textAlign="Left" width="150" />
                                            </ColumnsDirective>
                                            <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={2}>
                                        <GridComponent
                                            // key={gridKey}
                                            id="gridListData"
                                            locale="id"
                                            // ref={(g) => (gridListData = g)}
                                            ref={gridListDataBayarRef}
                                            dataSource={stateDataHeaderList.searchNoPhe !== '' || stateDataHeaderList.searchBayar !== '' ? filteredDataBayar : recordsDataBayarRef.current}
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
                                            // // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            queryCellInfo={queryCellInfoListDataBayar}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={(args) => {
                                                const mergerObject = {
                                                    ...handleParamsObject,
                                                };
                                                handleRowSelected(args, mergerObject);
                                            }}
                                            recordDoubleClick={(args) => {
                                                const mergerObject = {
                                                    ...handleParamsObject,
                                                };
                                                handleDoubleClickApp(args, mergerObject);
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_phe"
                                                    headerText="No. PHE"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="125"
                                                />
                                                <ColumnDirective
                                                    field="tgl_phe"
                                                    headerText="Tgl. PHE"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="via"
                                                    headerText="Ekspedisi"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="400"
                                                />
                                                <ColumnDirective
                                                    field="no_reff"
                                                    headerText="No. Reff"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="120"
                                                />
                                                <ColumnDirective
                                                    field="pph23"
                                                    headerText="pph23"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="65"
                                                />

                                                <ColumnDirective
                                                    field="netto_mu"
                                                    format="N2"
                                                    headerText="Jumlah"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                />
                                                <ColumnDirective
                                                    field="total_mu"
                                                    format="N2"
                                                    headerText="Total Bayar"
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                />
                                                <ColumnDirective
                                                    field="status"
                                                    headerText="status"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="80"
                                                />
                                                <ColumnDirective
                                                    field="statusApproval"
                                                    headerText="Approval"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                />
                                                <ColumnDirective
                                                    field="no_dokumen"
                                                    headerText="No. Jurnal"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="150"
                                                />

                                                <ColumnDirective field="no_dokumen_rev" headerText="No. Jurnal Rev" headerTextAlign="Center" textAlign="Left" width="150" />
                                            </ColumnsDirective>
                                            <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                </div>
                            </TabComponent>

                            {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                            <ContextMenuComponent id="contextmenu" target=".e-gridheader" animationSettings={{ duration: 800, effect: 'FadeIn' }} />
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
                    >
                        <div className="flex">
                            <div style={{ width: '172px' }}>
                                <TooltipComponent content="Update File Pendukung" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Update File Pendukung"
                                        style={{ backgroundColor: '#9f9a9a', marginTop: '46px', marginLeft: '10px', color: 'black' }}
                                        onClick={showUpdateFilePendukung}
                                    />
                                </TooltipComponent>
                            </div>

                            <div style={{ width: '10%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* {isOpenPreview && (
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
            )} */}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk view TTD =============================*/}
            {/*==================================================================================================*/}

            <DialogPhe
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
                stateDataParams={stateDataParams}
                setStateDataDataParams={setStateDataParams}
            />
            {/* )} */}
        </div>
    );
};

// export { getServerSideProps };

export default PheList;
