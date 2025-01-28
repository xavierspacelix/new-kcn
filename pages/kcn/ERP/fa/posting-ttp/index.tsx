import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ChangeEventArgs as ChangeEventArgsInput, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
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
import { faBook, faCamera, faCheck, faList, faSave, faTimes, faX } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
// import { getServerSideProps } from '@/pages/api/getServerSide';
import styles from './index.module.css';
// import { SetDataDokumenTtb, PencarianNoTtb, PencarianNoReff } from './component/fungsiFormTtbList';
import { GetTbImages } from '@/pages/kcn/ERP/fa/ppi/model/apiPpi';
import { frmNumber, generateNU, showLoading, usersMenu } from '@/utils/routines';
import Draggable from 'react-draggable';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import { useSession } from '@/pages/api/sessionContext';
import {
    GetCekNoTTP,
    GetDetailTtp,
    GetHp2Cust,
    GetListPostingTtp,
    GetListPostingTtpByKode,
    GetLoadGambarByName,
    GetMasterDetailPosting,
    GetNonAktifCust,
    GetPreferensi,
    GetPreferensiPosting,
    GetSetting,
    GetWaAkunting,
    GetWagwServer,
    UpdateCatatan,
    UpdatePengajuanApp,
} from './model/api';
import {
    base64ToBlob,
    blobToFile,
    customTotJmlTerima,
    customTotPembulatan,
    customTotTransfer,
    customTotTunai,
    customTotUangMuka,
    customTotWarkat,
    editTemplateCatatan,
    HandleCloseZoom,
    HandleZoomIn,
    HandleZoomOut,
    headerBuktiTtpSalesman,
    headerSpesimenSesuai,
    headerSpesimenTtdCustomer,
    kirimWa,
    Modal,
    OnClick_DaftarDPP,
    paramProps,
    // templateBuktiTTP,
    // templatePosted,
    // templateSpesimenSesuai,
    // templateTombolTTD,
    totJmlTerima,
    totPembulatan,
    totTransfer,
    totTunai,
    totUangMuka,
    totWarkat,
    UpdateCustBl,
    UpdateCustBl60,
} from './functional/fungsiForm';
// import { swalPopUp } from '../phu/component/fungsiFormPhuList';
import { swalPopUp } from '../phu/component/fungsiFormPhuList';
import { showLoading1, swalDialog, swalToast } from './interface/template';
import DialogTtp from './component/dialogTtp';
import DialogDaftarMutasi from './modal/DialogDaftarMutasi';
import { ReCalc } from './functional/reCalc';
import axios from 'axios';
import JSZip from 'jszip';
import { ReCalcBM } from './functional/reCalcBM';

enableRipple(true);

let textareaObj: any;
const PostingTtpList = () => {
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

    // ================================================================================================
    // State Baru Untuk TTP
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
        tipe: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '', tipe: '' });
    const kode_menu = '60206'; // kode menu TTP

    // ================== State untuk filter data list ===============================
    const [filterData, setFilterData] = useState({
        noTTPValue: '',
        date1: moment(), // tanggal awal PPI
        date2: moment().endOf('month'), // tanggal akhir PPI
        noCustomerValue: '',
        namaCustomerValue: '',
        noSalesValue: '',
        namaSalesValue: '',
        selectedOptionProsesPosting: 'prosesPostingTidak',
        selectedOptionPengajuanCu: 'pengajuanCuSemua',
        selectedOptionPengajuanPembatalan: 'pengajuanPembatalanSemua',
    });
    // End

    //end

    // ================== State untuk filter data list yang berupa checkbox ===============================
    const [checkboxFilter, setCheckboxFilter] = useState({
        isNoTTPChecked: false,
        isTanggalChecked: true,
        isNamaCustChecked: false,
        isNamaSalesmanChecked: false,
        isTampilkanAlokasiDanaChecked: false,
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
    });
    // End

    type TTPListItem = {
        kode_dokumen: string;
        dokumen: string;
        no_dokumen: any;
        tgl_dokumen: any;
    };

    type AlokasiDanaItem = {
        kode_dokumen: string;
        dokumen: string;
        no_dokumen: any;
        tgl_dokumen: any;
    };

    type FakturItem = {
        kode_dokumen: string;
        dokumen: string;
        no_dokumen: any;
        tgl_dokumen: any;
    };
    const [recordsData, setRecordsData] = useState<TTPListItem[]>([]);
    const [recordsDataAlokasiDana, setRecordsDataAlokasiDana] = useState<AlokasiDanaItem[]>([]);
    const [recordsDataFaktur, setRecordsDataFaktur] = useState<FakturItem[]>([]);

    const recordsDataRef = useRef<TTPListItem[]>([]);
    const recordsDataAlokasiDanaRef = useRef<AlokasiDanaItem[]>([]);
    const recordsDataFakturRef = useRef<FakturItem[]>([]);
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
    // End

    const gridListData = useRef<GridComponent>(null);
    const gridListDataAlokasiDana = useRef<GridComponent>(null);
    const gridListDataFaktur = useRef<GridComponent>(null);
    const [modalPositionCatatan, setModalPositionCatatan] = useState({ top: '30%', right: '30%', width: '30%', background: '#dedede' });
    const [dateGenerateNu, setDateGenerateNu] = useState<moment.Moment>(moment());
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

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

    const refreshData = async () => {
        let vNoTtp = 'all';
        let vTglAwal = tanggalHariIni; //tanggalHariIni
        let vTglAkhir = tanggalAkhirBulan; //tanggalAkhirBulan
        let vNamaCust = 'all';
        let vNamaSalesman = 'all';
        let vProsesPosting = 'N';
        let vPengajuanCU = 'all';
        let vPengajuanPembatalan = 'all';

        if (checkboxFilter.isTanggalChecked) {
            const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
            const formattedDate2 = filterData.date2.format('YYYY-MM-DD');
            vTglAwal = `${formattedDate1}`;
            vTglAkhir = `${formattedDate2}`;
        }

        let paramObject = {
            kode_entitas: kode_entitas,
            token: token,
            vNoTtp: vNoTtp,
            vTglAwal: vTglAwal, //tanggalHariIni
            vTglAkhir: vTglAkhir, //tanggalAkhirBulan
            vNamaCust: vNamaCust,
            vNamaSalesman: vNamaSalesman,
            vProsesPosting: vProsesPosting,
            vPengajuanCU: vPengajuanCU,
            vPengajuanPembatalan: vPengajuanPembatalan,
        };
        const responseData = await GetListPostingTtp(paramObject);

        const responseDataFix = responseData.map((item: any) => ({
            ...item,
            nilai_tunai: parseFloat(item.nilai_tunai),
            nilai_transfer: parseFloat(item.nilai_transfer),
            nilai_warkat: parseFloat(item.nilai_warkat),
            nilai_titipan: parseFloat(item.nilai_titipan),
            nilai_bulat: parseFloat(item.nilai_bulat),
            jml_terima: parseFloat(item.jml_terima),
        }));
        setRecordsData(responseDataFix);
        recordsDataRef.current = responseDataFix;
    };

    // Fungsi Refresh Data
    const handleRefreshData = async () => {
        vRefreshData.current += 1;
        await showLoading1(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                let vNoTtp = 'all';
                let vTglAwal = 'all'; //tanggalHariIni
                let vTglAkhir = 'all'; //tanggalAkhirBulan
                let vNamaCust = 'all';
                let vNamaSalesman = 'all';
                let vProsesPosting = 'all';
                let vPengajuanCU = 'all';
                let vPengajuanPembatalan = 'all';

                if (checkboxFilter.isNoTTPChecked) {
                    vNoTtp = `${filterData.noTTPValue}`;
                }

                if (checkboxFilter.isTanggalChecked) {
                    const formattedDate1 = filterData.date1.format('YYYY-MM-DD');
                    const formattedDate2 = filterData.date2.format('YYYY-MM-DD');
                    vTglAwal = `${formattedDate1}`;
                    vTglAkhir = `${formattedDate2}`;
                }

                if (checkboxFilter.isNamaCustChecked) {
                    vNamaCust = `${filterData.namaCustomerValue}`;
                }

                if (checkboxFilter.isNamaSalesmanChecked) {
                    vNamaSalesman = `${filterData.namaSalesValue}`;
                }

                if (filterData.selectedOptionProsesPosting === 'prosesPostingSemua') {
                    vProsesPosting = 'all';
                } else if (filterData.selectedOptionProsesPosting === 'prosesPostingYa') {
                    vProsesPosting = 'Y';
                } else if (filterData.selectedOptionProsesPosting === 'prosesPostingTidak') {
                    vProsesPosting = 'N';
                }

                if (filterData.selectedOptionPengajuanCu === 'pengajuanCuSemua') {
                    vPengajuanCU = 'all';
                } else if (filterData.selectedOptionPengajuanCu === 'pengajuanCuYa') {
                    vPengajuanCU = 'Y';
                } else if (filterData.selectedOptionPengajuanCu === 'pengajuanCuTidak') {
                    vPengajuanCU = 'N';
                }

                if (filterData.selectedOptionPengajuanPembatalan === 'pengajuanPembatalanSemua') {
                    vPengajuanPembatalan = 'all';
                } else if (filterData.selectedOptionPengajuanPembatalan === 'pengajuanPembatalanYa') {
                    vPengajuanPembatalan = 'Y';
                } else if (filterData.selectedOptionPengajuanPembatalan === 'pengajuanPembatalanTidak') {
                    vPengajuanPembatalan = 'N';
                }

                let paramObject = {
                    kode_entitas: kode_entitas,
                    token: token,
                    vNoTtp: vNoTtp,
                    vTglAwal: vTglAwal, //tanggalHariIni
                    vTglAkhir: vTglAkhir, //tanggalAkhirBulan
                    vNamaCust: vNamaCust,
                    vNamaSalesman: vNamaSalesman,
                    vProsesPosting: vProsesPosting,
                    vPengajuanCU: vPengajuanCU,
                    vPengajuanPembatalan: vPengajuanPembatalan,
                };

                const responseData = await GetListPostingTtp(paramObject);

                const responseDataFix = responseData.map((item: any) => ({
                    ...item,
                    nilai_tunai: parseFloat(item.nilai_tunai),
                    nilai_transfer: parseFloat(item.nilai_transfer),
                    nilai_warkat: parseFloat(item.nilai_warkat),
                    nilai_titipan: parseFloat(item.nilai_titipan),
                    nilai_bulat: parseFloat(item.nilai_bulat),
                    jml_terima: parseFloat(item.jml_terima),
                }));

                setRecordsData(responseDataFix);
                recordsDataRef.current = responseDataFix;
                showLoading1(false);
                // if (gridListData.current) {
                //     gridListData.current.clearSelection();
                // }
            } catch (error) {
                console.error(error);
            }
        }
    };
    // End

    const gridKey = `${JSON.stringify(recordsDataRef.current)}`;

    useEffect(() => {
        fetchDataUseEffect();
        refreshData();
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
        // if (gridListData.current) {
        //     gridListData.current.clearSelection();
        // }
    }, []);

    // Saat Klik Row yang ada di grid
    const selectedRowsData = useCallback(
        async (args: any) => {
            const selectedRowIndex = args.rowIndex; // Simpan indeks baris yang dipilih
            rowIdxListData.current = selectedRowIndex; // Simpan dalam ref untuk digunakan nanti

            // Cek apakah args.data dan kode_dokumen sudah berubah, jika belum, tidak perlu memanggil ulang
            if (args.data && args.data.kode_dokumen !== listStateData.plagKodeDokumen) {
                listStateData.plagKodeDokumen = args.data.kode_dokumen;
                fetchMasterDetail(args.data.kode_dokumen);
                dataStateSelectedRows(args.data);
            }
        },

        [listStateData]
    ); // Dependensi di sini adalah listStateData

    const [dataMasterList, setDataMasterList] = useState('');
    const [plagCheckboxAlokasiDana, setPlagCheckboxAlokasiDana] = useState(false);
    // const [dataMasterAlokasiDana, setDataMasterAlokasiDana] = useState('');
    // const [dataDetailFaktur, setDataDetailFaktur] = useState('');

    const dataStateSelectedRows = (data: any) => {
        setDataMasterList(data);
        setListStateData((prevState: any) => ({
            ...prevState,
            appCetakUlang: data.app_cetak_ulang,
            cetakUlang: data.cetak_ulang,
            appBatal: data.app_batal,
            batal: data.batal,
            noTtp: data.no_ttp,
            kodeDokumen: data.kode_dokumen,
            filegambarCetakUlang: data.filegambar_cetak_ulang,
            ketCetakUlang: data.ket_cetak_ulang,
            filegambarBatal: data.filegambar_batal,
            ketBatal: data.ket_batal,
            kodeSales: data.kode_sales,
            kodeCust: data.kode_cust,
            jmlTitipan: data.jml_titipan,
            nilaiTitipan: data.nilai_titipan,
            nilaiTunai: data.nilai_tunai,
            nilaiTransfer: data.nilai_transfer,
            nilaiWarkat: data.nilai_warkat,
            namaRelasi: data.nama_relasi,
        }));
    };

    // Fungsi untuk mengambil data master detail
    const fetchMasterDetail = async (kode_dokumen: any) => {
        const paramObject = {
            kode_entitas: kode_entitas,
            token: token,
            kode_dokumen: kode_dokumen,
        };

        if (kode_dokumen !== '') {
            const responseData = await GetMasterDetailPosting(paramObject);
            const responseDataAlokasiDanaFix = responseData.master.map((item: any) => ({
                ...item,
                dibayar: parseFloat(item.dibayar),
                pembulatan: parseFloat(item.pembulatan),
                jumlah: parseFloat(item.jumlah),
                amount: parseFloat(item.amount),
                jenis: item.jenis === 'C' ? 'Tunai' : item.jenis === 'T' ? 'Transfer' : item.jenis === 'W' ? 'Warkat' : 'Titipan',
            }));

            const responseDataFakturFix = responseData.detail.map((item: any) => ({
                ...item,
                dibayar: parseFloat(item.dibayar),
                pembulatan: parseFloat(item.pembulatan),
                jumlah: parseFloat(item.jumlah),
                netto_mu: parseFloat(item.netto_mu),
                sisa_mu: parseFloat(item.sisa_mu),
            }));
            gridListDataAlokasiDana.current?.setProperties({ dataSource: responseDataAlokasiDanaFix });
            gridListDataFaktur.current?.setProperties({ dataSource: responseDataFakturFix });

            setRecordsDataAlokasiDana(responseDataAlokasiDanaFix);
            setRecordsDataFaktur(responseDataFakturFix);
            recordsDataAlokasiDanaRef.current = responseDataAlokasiDanaFix;
            recordsDataFakturRef.current = responseDataFakturFix;
        }
    };
    // End

    // // Fungsi untuk mengonversi base64 ke Blob
    // function base64ToBlob(base64: any, contentType = '', sliceSize = 512) {
    //     const byteCharacters = atob(base64);
    //     const byteArrays = [];

    //     for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //         const slice = byteCharacters.slice(offset, offset + sliceSize);

    //         const byteNumbers = new Array(slice.length);
    //         for (let i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }

    //         const byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }

    //     return new Blob(byteArrays, { type: contentType });
    // }
    // // End

    // // Fungsi untuk membuat objek File dari Blob
    // function blobToFile(blob: any, fileName: any) {
    //     blob.lastModifiedDate = new Date();
    //     return new File([blob], fileName, { type: blob.type, lastModified: blob.lastModifiedDate });
    // }
    // // End

    const loadDataImage = async (kode_dokumen: any, filegambar: any, indexFileGambar: any) => {
        const responseDataImage = await GetTbImages(kode_entitas, kode_dokumen);

        const fileName = filegambar;
        const withoutExtension = fileName.split('.')[0];
        // setLoadFilePendukung(responseDataImage);
        let vnamaZip = `${withoutExtension}.zip`;
        const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
        const data = await responsePreviewImg.json();

        if (data.status === true) {
            const newFiles = data.images
                .filter((item: any) => item.fileName === filegambar)
                .map((item: any, index: any) => {
                    // Hilangkan prefix 'data:image/jpg;base64,' jika ada
                    const base64String = item.imageUrl.split(',')[1];
                    const contentType = 'image/jpeg'; // menyesuaikan dengan tipe File
                    const fileName = item.fileName;

                    const blob = base64ToBlob(base64String, contentType);
                    const matchedItem = responseDataImage.find((dataItem: any) => dataItem.filegambar === fileName);

                    return {
                        file: blobToFile(blob, fileName),

                        responseIndex: matchedItem ? matchedItem.id_dokumen : null,
                    };
                });

            // const uniqueFormattedNames = newFiles.map((_: any, index: any) => `${formattedName}${index}`);
            const uniqueFormattedNames = responseDataImage
                .map((fileObj: any) => fileObj.filegambar)
                .filter((fileName: string) => !fileName.endsWith('.zip'))
                .map((fileName: string) => fileName.replace(/\.(jpg|jpeg|png)$/, '').replace('PU', ''));

            // Memperbarui selectedFiles
            const updatedSelectedFiles = [
                ...newFiles.map((item: any) => ({
                    file: item.file,
                    tabIndex: indexFileGambar,
                    responseIndex: item.responseIndex,
                })),
            ];

            // Memperbarui namaFiles
            const updatedNamaFiles = [...uniqueFormattedNames];

            handleUploadZip(kode_dokumen, updatedSelectedFiles, updatedNamaFiles, filegambar);

            // Mengambil nama file pertama untuk setNamaFilesExt1
            if (newFiles.length > 0) {
                setNamaFilesExt1(newFiles[0].file.name);
            }

            setExtractedFiles(data.images);
        } else {
            setExtractedFiles([]);
        }
    };

    // Tentukan tipe dari setiap entri JSON
    interface JsonEntry {
        entitas: string;
        kode_dokumen: string;
        id_dokumen: string;
        dokumen: string;
        filegambar: string;
        fileoriginal: string;
    }

    const handleUploadZip = async (kode_dokumen: any, updatedSelectedFiles: any, updatedNamaFiles: any, filegambar: any) => {
        const formData = new FormData();
        const jsonData = [];
        const zip = new JSZip();
        let entitas;
        let namaFileImage: any;

        // Gunakan objek untuk memastikan hanya id_dokumen terakhir yang disimpan
        // Definisikan uniqueEntries dengan tipe yang benar
        const uniqueEntries: { [key: string]: JsonEntry } = {};
        for (let index = 0; index < updatedSelectedFiles.length; index++) {
            const fileWithTabIdx = updatedSelectedFiles[index];
            const file = fileWithTabIdx.file;
            const tabIdx = fileWithTabIdx.tabIndex;
            const fileExtension = file.name.split('.').pop();

            const fileNameWithExtension = `${filegambar}`;
            namaFileImage = fileNameWithExtension;

            const arrayBuffer = await new Response(file).arrayBuffer();
            zip.file(fileNameWithExtension, arrayBuffer, { binary: true });

            if (tabIdx !== -1) {
                const jsonEntry = {
                    entitas: kode_entitas,
                    kode_dokumen: kode_dokumen,
                    id_dokumen: String(tabIdx),
                    dokumen: 'PU',
                    filegambar: fileNameWithExtension,
                    fileoriginal: fileNameWithExtension,
                };

                // Simpan entry dengan id_dokumen sebagai kunci, menggantikan jika sudah ada
                uniqueEntries[jsonEntry.id_dokumen] = jsonEntry;
            }
        }

        // Konversi objek uniqueEntries menjadi array dan simpan di jsonData
        for (const key in uniqueEntries) {
            jsonData.push(uniqueEntries[key]);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        formData.append('myimage', zipBlob, `IMG_${kode_dokumen}.zip`);
        formData.append('nama_file_image', `IMG_${kode_dokumen}.zip`);
        formData.append('kode_dokumen', '');

        let tabIdx = updatedSelectedFiles.length > 0 ? updatedSelectedFiles[0].tabIndex + 1 : 0;
        formData.append('id_dokumen', tabIdx);
        formData.append('dokumen', 'PU');

        if (kode_entitas === '99999') {
            entitas = '999';
        } else {
            entitas = kode_entitas;
        }
        formData.append('ets', entitas);

        // console.log('FormData Contents:');
        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        // console.log('JsonInput = ', jsonData);
        // console.log('JsonInput = ', formData);

        if (updatedSelectedFiles.length > 0) {
            try {
                // Lakukan unggah menggunakan Axios
                const response = await axios.post(`${apiUrl}/upload`, formData);

                // Proses respon dari server
                let jsonSimpan;

                if (Array.isArray(response.data.nama_file_image)) {
                    jsonSimpan = response.data.nama_file_image.map((namaFile: any, index: any) => {
                        return {
                            entitas: kode_entitas,
                            kode_dokumen: kode_dokumen,
                            id_dokumen: response.data.id_dokumen[index],
                            dokumen: 'PU',
                            filegambar: namaFile,
                            fileoriginal: response.data.filesinfo[index] ? response.data.filesinfo[index].fileoriginal : null,
                        };
                    });
                } else {
                    jsonSimpan = {
                        entitas: kode_entitas,
                        kode_dokumen: kode_dokumen,
                        id_dokumen: '999',
                        dokumen: 'PU',
                        filegambar: response.data.nama_file_image,
                        fileoriginal: response.data.filesinfo,
                    };
                }

                if (response.data.status === true) {
                    await axios
                        .post(`${apiUrl}/erp/simpan_tbimages`, jsonSimpan)
                        .then((response) => {})
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    await axios
                        .post(`${apiUrl}/erp/simpan_tbimages`, jsonData)
                        .then((response) => {})
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // =========================================================================================
    // FUNGSI LAMA YANG BELUM DIHAPUS

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

    // ============================================================================
    // ============================ END ===========================================
    // ============================================================================

    // let gridListData: Grid | any;

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

    //============== Format baris pada grid List Data  =============
    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            if (getValue('app_cetak_ulang', args.data) == 'N' && getValue('cetak_ulang', args.data) == 'Y') {
                args.row.style.background = '#fbffc8';
            } else if (getValue('app_batal', args.data) == 'N' && getValue('batal', args.data) == 'Y') {
                args.row.style.background = '#ffcece';
            } else if (getValue('app_batal', args.data) == 'Y' && getValue('batal', args.data) == 'Y') {
                args.row.style.background = '#e6e2de';
            }
        }
    };

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    // const selectingRowsData = (args: any) => {
    //     if (args.data !== undefined) {
    //         // ListDetailDok(args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal, token);
    //         setListStateData((prevState: any) => ({
    //             ...prevState,
    //             noDokumen: args.data.no_dokumen,
    //             tglDokumen: args.data.tgl_dokumen,
    //         }));
    //     }
    // };

    const [indexPreview, setIndexPreview] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [isOpenPreviewDobel, setIsOpenPreviewDobel] = useState(false);
    const [isOpenPreviewDobelTtd, setIsOpenPreviewDobelTtd] = useState(false);
    const [zoomScale, setZoomScale] = useState(0.5);

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [rotationAngle, setRotationAngle] = useState(0);

    const handleRotateLeft = () => setRotationAngle(rotationAngle - 90);
    const handleRotateRight = () => setRotationAngle(rotationAngle + 90);

    type ExtractedFile = {
        imageUrl: string;
        fileName: string;
    };
    const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
    const [selectedNamaFilesExt1, setNamaFilesExt1] = useState('');

    // Template isi Grid
    const templatePosted = (args: any) => {
        return (
            <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>
                {args.proses === 'Y' ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                            readOnly={true}
                            style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                fontSize: '16px', // Sesuaikan ukuran font
                            }}
                            value={'✔'}
                        />
                    </div>
                ) : plagPosted === true && kodeDok === args.kode_dokumen ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                            readOnly={true}
                            style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                fontSize: '16px', // Sesuaikan ukuran font
                            }}
                            value={'✔'}
                        />
                    </div>
                ) : null}
            </div>
        );
    };

    const templateBuktiTTP = (args: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>
                    {args.tombol_ttp === 'Y' ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                                readOnly={true}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    textAlign: 'left',
                                    backgroundColor: 'transparent',
                                    borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                    fontSize: '16px', // Sesuaikan ukuran font
                                }}
                                value={'✔'}
                            />
                        </div>
                    ) : null}
                </div>
                <div onClick={() => loadImageDobel(args.filegambar_ttp, args.filegambar_ttd, args.kode_cust, 'buktiTtp')} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {args.tombol_ttp === 'Y' ? <FontAwesomeIcon icon={faCamera} width="18" height="18" /> : null}
                </div>
            </div>
        );
    };

    const templateTombolTTD = (args: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>
                    {args.tombol_ttd === 'Y' ? (
                        <input
                            readOnly={true}
                            style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'left',
                                backgroundColor: 'transparent',
                                borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                fontSize: '16px', // Sesuaikan ukuran font
                            }}
                            value={'✔'}
                        />
                    ) : null}
                </div>
                <div onClick={() => loadImageDobel(args.filegambar_ttd, args.filegambar_ttd, args.kode_cust, 'ttdCust')} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {args.tombol_ttd === 'Y' ? <FontAwesomeIcon icon={faCamera} width="18" height="18" /> : null}
                </div>
            </div>
        );
    };

    const templateSpesimenSesuai = (args: any) => {
        return (
            <div onDoubleClick={() => handleSpesimenSesuai(args)}>
                <div style={args.ttd === 'Y' ? { color: 'green', fontWeight: 'bold', fontSize: '14px' } : args.ttd === 'N' ? { color: 'red', fontWeight: 'bold', fontSize: '14px' } : {}}>
                    {args.ttd === 'Y' ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                                id={`ttd${args.kode_dokumen}`}
                                readOnly={true}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                    borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                    fontSize: '16px', // Sesuaikan ukuran font
                                }}
                                value={'✔'}
                            />
                            {/* <FontAwesomeIcon
                                icon={faCheck} // Atau ikon lain sesuai kebutuhan
                                style={{
                                    position: 'absolute',
                                    left: '50%', // Menyesuaikan posisi ikon
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: 'green',
                                }}
                            /> */}
                        </div>
                    ) : args.ttd === 'N' ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                                id={`ttd${args.kode_dokumen}`}
                                readOnly={true}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                    borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                    fontSize: '16px', // Sesuaikan ukuran font
                                }}
                                value={'X'}
                            />
                        </div>
                    ) : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                                id={`ttd${args.kode_dokumen}`}
                                readOnly={true}
                                style={{
                                    width: '233px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    paddingLeft: '25px', // Pemberian ruang untuk ikon
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const loadImage = async (filePendukung: any, kode_cust: any, tipe: any) => {
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        setIndexPreview(filePendukung);
        setIsOpenPreview(true);
        setZoomScale(0.5); // Reset zoom scale
        setPosition({ x: 0, y: 0 }); // Reset position
        setImageDataUrl('');

        if (tipe === 'buktiTtp') {
            let fileGambar = filePendukung.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === filePendukung)?.imageUrl;
                setImageDataUrl(imageUrl || '');
            }
        } else if (tipe === 'buktiBayar') {
            let fileGambar = filePendukung.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === filePendukung)?.imageUrl;
                setImageDataUrl(imageUrl || '');
            }
        } else {
            const paramObject = {
                kode_entitas: kode_entitas,
                kode_cust: kode_cust,
                filePendukung: filePendukung,
            };

            try {
                const respDecodeFileGambar = await GetLoadGambarByName(paramObject);

                if (respDecodeFileGambar.status === true) {
                    setImageDataUrl(respDecodeFileGambar.data[0].decodeBase64_string || '');
                } else {
                    // Jika status dari response false
                    setImageDataUrl('');
                    console.error('Data tidak ditemukan atau tidak valid.');
                }
            } catch (error: any) {
                // Mengatur tampilan default saat error terjadi
                setImageDataUrl('');

                // Menangani error secara spesifik
                if (error.response) {
                    // Error 500 dari server
                    console.error(`Server Error: ${error.response.status} - ${error.response.data}`);
                } else if (error.request) {
                    // Permintaan dibuat tetapi tidak ada respon
                    console.error('No response received from server.');
                } else {
                    // Error saat membuat permintaan
                    console.error('Error:', error.message);
                }

                await withReactContent(swalPopUp).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px;color:white;margin-right: -42px;">Terjadi kesalahan saat memuat gambar. File gambar tidak ada di FTP.</p>',
                    width: '50%', // Atur lebar popup sesuai kebutuhan
                    target: '#dialogPhuList',
                    heightAuto: true,
                    timer: 3000,
                    showConfirmButton: false, // Menampilkan tombol konfirmasi
                    allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                    allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            }
        }
    };

    const [imageDataUrlTtd, setImageDataUrlTtd] = useState('');
    const [imageDataUrlTtp, setImageDataUrlTtp] = useState('');
    const [zoomScaleTtd, setZoomScaleTtd] = useState(0.5);
    const [positionTtd, setPositionTtd] = useState({ x: 0, y: 0 });
    const [indexPreviewTtd, setIndexPreviewTtd] = useState('');
    const [indexPreviewTtp, setIndexPreviewTtp] = useState('');
    const [kodeCustTtd, setKodeCustTtd] = useState('');
    const loadImageDobel = async (filePendukung: any, filependukungTtd: any, kode_cust: any, tipe: any) => {
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        setIndexPreviewTtp(filePendukung);
        setIndexPreviewTtd(filependukungTtd);
        setKodeCustTtd(kode_cust);
        setZoomScale(1); // Reset zoom scale
        setPosition({ x: 0, y: 0 }); // Reset position
        setImageDataUrlTtp('');
        setImageDataUrlTtd('');

        if (tipe === 'buktiTtp') {
            let fileGambar = filePendukung.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === filePendukung)?.imageUrl;
                setImageDataUrlTtp(imageUrl || '');
                setIsOpenPreviewDobel(true);
            }

            // TTD Spesimen
            const paramObject = {
                kode_entitas: kode_entitas,
                kode_cust: kode_cust,
                filePendukung: filependukungTtd,
            };

            try {
                const respDecodeFileGambar = await GetLoadGambarByName(paramObject);

                if (respDecodeFileGambar.status === true) {
                    setImageDataUrlTtd(respDecodeFileGambar.data[0].decodeBase64_string || '');
                    setIsOpenPreviewDobelTtd(true);
                } else {
                    // Jika status dari response false
                    setImageDataUrlTtd('');
                    console.error('Data tidak ditemukan atau tidak valid.');
                }
            } catch (error: any) {
                // Mengatur tampilan default saat error terjadi
                setImageDataUrlTtd('');

                // Menangani error secara spesifik
                if (error.response) {
                    // Error 500 dari server
                    console.error(`Server Error: ${error.response.status} - ${error.response.data}`);
                } else if (error.request) {
                    // Permintaan dibuat tetapi tidak ada respon
                    console.error('No response received from server.');
                } else {
                    // Error saat membuat permintaan
                    console.error('Error:', error.message);
                }

                await withReactContent(swalPopUp).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px;color:white;margin-right: -42px;">Terjadi kesalahan saat memuat gambar. File gambar tidak ada di FTP.</p>',
                    width: '50%', // Atur lebar popup sesuai kebutuhan
                    target: '#dialogPhuList',
                    heightAuto: true,
                    timer: 3000,
                    showConfirmButton: false, // Menampilkan tombol konfirmasi
                    allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                    allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            }
        } else {
            let fileGambar = filePendukung.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === filePendukung)?.imageUrl;
                setImageDataUrlTtp(imageUrl || '');
                setIsOpenPreviewDobel(true);
            }

            const paramObject = {
                kode_entitas: kode_entitas,
                kode_cust: kode_cust,
                filePendukung: filePendukung,
            };

            try {
                const respDecodeFileGambar = await GetLoadGambarByName(paramObject);

                if (respDecodeFileGambar.status === true) {
                    setImageDataUrlTtd(respDecodeFileGambar.data[0].decodeBase64_string || '');
                    setIsOpenPreviewDobelTtd(true);
                } else {
                    // Jika status dari response false
                    setImageDataUrlTtd('');
                    console.error('Data tidak ditemukan atau tidak valid.');
                }
            } catch (error: any) {
                // Mengatur tampilan default saat error terjadi
                setImageDataUrlTtd('');

                // Menangani error secara spesifik
                if (error.response) {
                    // Error 500 dari server
                    console.error(`Server Error: ${error.response.status} - ${error.response.data}`);
                } else if (error.request) {
                    // Permintaan dibuat tetapi tidak ada respon
                    console.error('No response received from server.');
                } else {
                    // Error saat membuat permintaan
                    console.error('Error:', error.message);
                }

                await withReactContent(swalPopUp).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px;color:white;margin-right: -42px;">Terjadi kesalahan saat memuat gambar. File gambar tidak ada di FTP.</p>',
                    width: '50%', // Atur lebar popup sesuai kebutuhan
                    target: '#dialogPhuList',
                    heightAuto: true,
                    timer: 3000,
                    showConfirmButton: false, // Menampilkan tombol konfirmasi
                    allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                    allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            }
        }
    };

    const handleZoom = (tipe: any) => {
        if (tipe === 'ttd') {
            setZoomScaleTtd(1);
            setPositionTtd({ x: 0, y: 0 }); // Reset position
            setImageDataUrlTtd('');
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

    const [plagInputCatatan, setPlagInputCatatan] = useState(false);
    const [InputCatatan, setInputCatatan] = useState('');

    useEffect(() => {
        const hasRunEffect = sessionStorage.getItem('hasRunEffect');
        if (!hasRunEffect) {
            setPlagInputCatatan(paramProps.plagInputCatatan);
            setInputCatatan(paramProps.catatan);
            // Set status sudah menjalankan efek
            sessionStorage.setItem('hasRunEffect', 'true');
        }

        // Optional: Reset ketika komponen tidak lagi digunakan
        return () => {
            sessionStorage.removeItem('hasRunEffect');
        };
    }, [paramProps.plag]);

    const closeModalCatatan = () => {
        setPlagInputCatatan(false);
    };

    const updateCatatan = async () => {
        const paramObject = {
            entitas: kode_entitas,
            catatan: InputCatatan,
            ttd: paramProps.ttd,
            kode_dokumen: paramProps.kode_dokumen,
        };

        const response = await UpdateCatatan(paramObject, token);
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
            setPlagInputCatatan(false);
            await withReactContent(swalPopUp).fire({
                icon: 'success',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Catatan Berhasil disimpan.</p>',
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
            const catatan = document.getElementById(`catatan${paramProps.kode_dokumen}`) as HTMLInputElement;
            if (catatan) {
                catatan.value = InputCatatan;
            }
        }
    };

    const handleSpesimenSesuai = async (args: any) => {
        let paramObject, plaging;
        if (args.ttd === 'Y') {
            paramObject = {
                entitas: kode_entitas,
                catatan: args.catatan,
                ttd: 'N',
                kode_dokumen: args.kode_dokumen,
            };
            plaging = 'X';
        } else if (args.ttd === 'N') {
            paramObject = {
                entitas: kode_entitas,
                catatan: args.catatan,
                ttd: null,
                kode_dokumen: args.kode_dokumen,
            };
            plaging = '';
        } else {
            paramObject = {
                entitas: kode_entitas,
                catatan: args.catatan,
                ttd: 'Y',
                kode_dokumen: args.kode_dokumen,
            };
            plaging = '✔';
        }

        const response = await UpdateCatatan(paramObject, token);
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
            await withReactContent(swalPopUp).fire({
                icon: 'success',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Spesimen Sesuai Berhasil Plaging.</p>',
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
            handleRefreshData();
        }
    };

    const handlePrevBuktiBayar = (args: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input
                            readOnly={true}
                            style={{
                                width: '100%',
                                height: '100%',
                                textAlign: 'left',
                                backgroundColor: 'transparent',
                                borderRadius: '5px', // Atur sesuai dengan kebutuhan
                                fontSize: '16px', // Sesuaikan ukuran font
                            }}
                            value={'✔'}
                        />
                    </div>
                </div>
                <div
                    onClick={() => (args.filegambar === '' || args.filegambar === null || args.filegambar === undefined ? null : loadImage(args.filegambar, args.sub_akun_kredit, 'buktiBayar'))}
                    style={{ fontWeight: 'bold', fontSize: '14px' }}
                >
                    <FontAwesomeIcon icon={faCamera} width="18" height="18" />
                </div>
            </div>
        );
    };
    const [apiIds, setApiIds] = useState<{ [key: string]: string }>({});
    const [jumlahCR, setJumlahCR] = useState<{ [key: string]: string }>({});

    const handleApiId = (args: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                {args.jenis === 'Tunai' || args.jenis === 'Titipan' || args.jenis === 'Warkat' ? null : (
                    <>
                        <div>
                            <input
                                id={`apiId${args.id}`}
                                readOnly={true}
                                defaultValue={apiIds[args.id] || ''}
                                // value={args.api_id === 0 ? '' : args.api_id}
                                style={{ width: '72px', backgroundColor: 'transparent', border: 'none' }}
                            ></input>
                        </div>
                        <div onClick={() => clickDaftarMutasi(args)} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            <FontAwesomeIcon icon={faBook} width="18" height="18" />
                        </div>
                    </>
                )}
            </div>
        );
    };

    const handleJumlahCR = (args: any) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                {args.jenis === 'Tunai' || args.jenis === 'Titipan' || args.jenis === 'Warkat' ? null : (
                    <>
                        <div>
                            <input
                                id={`jumlahCr${args.id}`}
                                readOnly={true}
                                defaultValue={frmNumber(jumlahCR[args.id] || '')}
                                // value={args.api_id === 0 ? '' : args.api_id}
                                style={{ width: '94px', backgroundColor: 'transparent', border: 'none', textAlign: 'right' }}
                            ></input>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const clickDaftarMutasi = (args: any) => {
        vRefreshData.current += 1;
        setListStateData((prevState) => ({
            ...prevState,
            clickDaftarMutasi: true,
            // nilaiTransfer: args.dibayar,
            nilaiTransfer: String(parseFloat(args.dibayar) + parseFloat(args.pembulatan)),
            noRek: args.no_rekening,
            tglAwal: moment(args.tgl_valuta).format('YYYY-MM-DD'),
            tglAkhir: moment(args.tgl_valuta).format('YYYY-MM-DD'),
            idDok: args.id,
        }));
    };

    const [progress, setProgress] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState(''); // Pesan untuk keberhasilan atau kegagalan

    const modalPositionFilePendukung = { top: '29%', right: '43%', width: '363px', background: '#dedede' };
    const modalPositionFilePendukungTTP = { top: '29%', right: '56%', width: '541px', background: '#dedede' };
    const modalPositionFilePendukungTTD = { top: '29%', right: '17%', width: '541px', background: '#dedede' };
    const [imageUrl, setImageUrl] = useState('');
    const btnClickApprovalPengajuan = async (tipe: any) => {
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        setListStateData((prevState: any) => ({
            ...prevState,
            plagFilePendukung: true,
        }));

        if (tipe === 'cetakUlang') {
            let fileGambar = listStateData.filegambarCetakUlang.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === listStateData.filegambarCetakUlang)?.imageUrl;
                setImageUrl(imageUrl || '');
            }
        } else if (tipe === 'pembatalan') {
            let fileGambar = listStateData.filegambarBatal.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === listStateData.filegambarBatal)?.imageUrl;
                setImageUrl(imageUrl || '');
            }
        } else if (tipe === 'batal') {
            let fileGambar = listStateData.filegambarBatal.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === listStateData.filegambarBatal)?.imageUrl;
                setImageUrl(imageUrl || '');
            }
        }
    };

    const OpenPreview = async (tipe: any) => {
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        setIndexPreview(1);
        setIsOpenPreview(true);
        setZoomScale(0.5); // Reset zoom scale
        setPosition({ x: 0, y: 0 }); // Reset position
        setImageDataUrl('');

        if (tipe === 'cetakUlang') {
            let fileGambar = listStateData.filegambarCetakUlang.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === listStateData.filegambarCetakUlang)?.imageUrl;
                setImageDataUrl(imageUrl || '');
            }
        } else {
            let fileGambar = listStateData.filegambarBatal.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();
            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === listStateData.filegambarBatal)?.imageUrl;
                setImageDataUrl(imageUrl || '');
            }
        }
    };

    const OpenPreviewDobel = async (tipe: any) => {
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        setIndexPreview(1);
        setIsOpenPreview(true);
        setZoomScale(0.5); // Reset zoom scale
        setPosition({ x: 0, y: 0 }); // Reset position
        setImageDataUrl('');

        if (tipe === 'ttp') {
            let fileGambar = indexPreviewTtp.replace('.jpg', '');
            let vnamaZip = fileGambar + '.zip';

            const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
            const data = await responsePreviewImg.json();

            if (data.status === true) {
                const imageUrl = data.images.find((item: any) => item.fileName === indexPreviewTtp)?.imageUrl;
                setImageDataUrl(imageUrl || '');
            }
        } else {
            const paramObject = {
                kode_entitas: kode_entitas,
                kode_cust: kodeCustTtd,
                filePendukung: indexPreviewTtd,
            };

            try {
                const respDecodeFileGambar = await GetLoadGambarByName(paramObject);

                if (respDecodeFileGambar.status === true) {
                    setImageDataUrl(respDecodeFileGambar.data[0].decodeBase64_string || '');
                } else {
                    // Jika status dari response false
                    setImageDataUrlTtd('');
                    console.error('Data tidak ditemukan atau tidak valid.');
                }
            } catch (error: any) {
                // Mengatur tampilan default saat error terjadi
                setImageDataUrlTtd('');

                // Menangani error secara spesifik
                if (error.response) {
                    // Error 500 dari server
                    console.error(`Server Error: ${error.response.status} - ${error.response.data}`);
                } else if (error.request) {
                    // Permintaan dibuat tetapi tidak ada respon
                    console.error('No response received from server.');
                } else {
                    // Error saat membuat permintaan
                    console.error('Error:', error.message);
                }

                await withReactContent(swalPopUp).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px;color:white;margin-right: -42px;">Terjadi kesalahan saat memuat gambar. File gambar tidak ada di FTP.</p>',
                    width: '50%', // Atur lebar popup sesuai kebutuhan
                    target: '#dialogPhuList',
                    heightAuto: true,
                    timer: 3000,
                    showConfirmButton: false, // Menampilkan tombol konfirmasi
                    allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                    allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            }
        }
    };

    const handlePengajuanApproval = async (tipe: any, labelClick: any) => {
        let paramObject, plag;
        if (tipe === 'cetakUlang') {
            if (labelClick === 'disetujui') {
                paramObject = {
                    entitas: kode_entitas,
                    kode_dokumen: listStateData.kodeDokumen,
                    // Kalau Approval
                    approve: 'Y', // Y atau N
                    // Kalau Pembatalan
                    // "reject": "Y" // Y atau N
                };
                plag = 'Pengajuan cetak ulang berhasil disetujui';
            } else {
                paramObject = {
                    entitas: kode_entitas,
                    kode_dokumen: listStateData.kodeDokumen,
                    // Kalau Approval
                    approve: 'N', // Y atau N
                    // Kalau Pembatalan
                    // "reject": "Y" // Y atau N
                };
                plag = 'Pengajuan cetak ulang berhasil ditolak';
            }
        } else {
            if (labelClick === 'disetujui') {
                paramObject = {
                    entitas: kode_entitas,
                    kode_dokumen: listStateData.kodeDokumen,
                    // Kalau Approval
                    // approve: 'Y', // Y atau N
                    // Kalau Pembatalan
                    reject: 'Y', // Y atau N
                };
                plag = 'Pengajuan pembatalan berhasil disetujui';
            } else {
                paramObject = {
                    entitas: kode_entitas,
                    kode_dokumen: listStateData.kodeDokumen,
                    // Kalau Approval
                    // approve: 'N', // Y atau N
                    // Kalau Pembatalan
                    reject: 'N', // Y atau N
                };
                plag = 'Pengajuan pembatalan berhasil ditolak';
            }
        }

        const response = await UpdatePengajuanApp(paramObject, token);
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
            await withReactContent(swalPopUp).fire({
                icon: 'success',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">${plag}.</p>`,
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
            handleRefreshData();
            setListStateData((prevState: any) => ({
                ...prevState,
                plagFilePendukung: false,
            }));
        }
    };

    const handleEditTtp = async () => {
        vRefreshData.current += 1;
        if (listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y') {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Status TTP pengajuan cetak ulang tidak bisa diedit.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (listStateData.appBatal === 'N' && listStateData.batal === 'Y') {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Status TTP pengajuan pembatalan tidak bisa diedit.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        setListStateData((prevState: any) => ({
            ...prevState,
            plagEditDialogTtp: true,
        }));
    };

    const clickDaftarDetailMutasi = (data: any) => {
        // Update state dengan ID API yang baru berdasarkan ID yang sesuai
        // Mengecek apakah data[0].id sudah ada di dalam apiIds
        const isIdAlreadyUsed = Object.values(apiIds).includes(data[0].id);

        if (isIdAlreadyUsed) {
            // Jika ID sudah ada, munculkan alert dan hentikan eksekusi
            withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data API hanya digunakan untuk 1 kali transaksi</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        // Jika ID belum ada, update state dengan nilai baru
        setApiIds((prev) => ({
            ...prev,
            [listStateData.idDok]: data[0].id, // Update ID berdasarkan args.id (row ID)
        }));
        // setApiIds((prev) => ({
        //     ...prev,
        //     [listStateData.idDok]: data[0].id,
        // }));
        setJumlahCR((prev) => ({
            ...prev,
            [listStateData.idDok]: data[0].amount,
        }));

        // Pastikan gridListDataAlokasiDana.current ada dan dataSource adalah array
        if (gridListDataAlokasiDana.current) {
            const currentDataSource = gridListDataAlokasiDana.current.dataSource;

            // Periksa apakah dataSource adalah array
            if (Array.isArray(currentDataSource)) {
                // Update dataSource menggunakan map
                const updatedDataSource = currentDataSource.map((item) => {
                    if (item.id === listStateData.idDok) {
                        return {
                            ...item,
                            api_id: data[0].id, // Update API ID
                            api_catatan: data[0].description,
                            api_norek: data[0].account_number,
                            amount: data[0].amount, // Update Jumlah CR jika diperlukan
                        };
                    }
                    return item;
                });

                // Set dataSource baru ke grid
                gridListDataAlokasiDana.current.dataSource = updatedDataSource;

                // Refresh grid setelah update
                gridListDataAlokasiDana.current.refresh();
            } else {
                console.error('dataSource bukan array:', currentDataSource);
            }
        }
    };

    const handleProsesPosting = async () => {
        if (listStateData.kodeDokumen === '') {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Pilih terlebih dahulu no TTP.</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#main-target',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        const responseDataPostingTtp = await GetListPostingTtpByKode(token, kode_entitas, listStateData.kodeDokumen);

        if (responseDataPostingTtp[0].appCetakUlang === 'N' && responseDataPostingTtp[0].cetakUlang === 'Y') {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Status TTP pengajuan cetak ulang tidak bisa diposting.</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (responseDataPostingTtp[0].appBatal === 'N' && responseDataPostingTtp[0].batal === 'Y') {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Status TTP pengajuan pembatalan tidak bisa diposting.</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (listStateData.appBatal === 'Y' && listStateData.batal === 'Y') {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Status TTP sudah dibatalkan tidak bisa diposting.</p>',
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        const paramObject = {
            kode_entitas: kode_entitas,
            no_ttp: listStateData.noTtp,
            token: token,
            kode_cust: listStateData.kodeCust,
            kode_sales: listStateData.kodeSales,
            kode_dokumen: listStateData.kodeDokumen,
        };

        const respCekNoTtp = await GetCekNoTTP(paramObject);
        if (respCekNoTtp.length > 0) {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Dokumen TTP sudah pernah diposting ke PPI/BM No: ${listStateData.noTtp} Hubungi Keuangan untuk dicheck kembali data ini.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        const respPreferensiPosting = await GetPreferensiPosting(paramObject);
        if (
            (respPreferensiPosting[0].kode_akun_titipan === '' || respPreferensiPosting[0].kode_akun_titipan === null) &&
            parseFloat(listStateData.jmlTitipan) + parseFloat(listStateData.nilaiTitipan) > 0
        ) {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Akun Titipan atau Uang Muka Penjualan belum disetting.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (
            (respPreferensiPosting[0].kode_sub_titipan === '' || respPreferensiPosting[0].kode_sub_titipan === null) &&
            parseFloat(listStateData.jmlTitipan) + parseFloat(listStateData.nilaiTitipan) > 0
        ) {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Subledger Titipan atau Uang Muka Penjualan belum disetting.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if ((respPreferensiPosting[0].kode_akun_tunai === '' || respPreferensiPosting[0].kode_akun_tunai === null) && parseFloat(listStateData.nilaiTunai) > 0) {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Akun Piutang Salesman belum disetting.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if ((respPreferensiPosting[0].kode_sub_tunai === '' || respPreferensiPosting[0].kode_sub_tunai === null) && parseFloat(listStateData.nilaiTunai) > 0) {
            await withReactContent(swalPopUp).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;margin-right: -42px;">Subledger Piutang Salesman belum disetting.</p>`,
                width: '50%', // Atur lebar popup sesuai kebutuhan
                // target: '#dialogPhuList',
                heightAuto: true,
                timer: 3000,
                showConfirmButton: false, // Menampilkan tombol konfirmasi
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        // Cek Umur Faktur dan Warkat
        const respSetting = await GetSetting(paramObject);
        const respNonAktifCust = await GetNonAktifCust(paramObject);
        const paramObjectBl = {
            hari_blacklist: respSetting[0].hari_blacklist,
            kode_termin: respNonAktifCust[0].kode_termin,
            kode_cust: listStateData.kodeCust,
            entitas: kode_entitas,
            hari_nonaktif: respSetting[0].hari_nonaktif,
        };

        if (respSetting[0].hari_blacklist > 0 && (respNonAktifCust[0].od_faktur > respSetting[0].hari_blacklist || respNonAktifCust[0].od_warkat > respSetting[0].hari_blacklist)) {
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

            await withReactContent(swalDialog)
                .fire({
                    title: `
            <div style="text-align: left; font-size:12px;margin-top: -35px;margin-bottom: -23px;">
                <span>Terdapat faktur atau warkat tagihan melebihi ${respSetting[0].hari_blacklist} hari dari tgl. terima.</span><br>
                <span>Kebijakan perusahaan customer diklasifikasikan "G" (Blacklist).</span>
            </div>
        `,
                    width: '22%',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                    showCancelButton: false, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const respUpdateCustBl = await UpdateCustBl(paramObjectBl, token);
                    }
                });
        } else if (respSetting[0].hari_nonaktif > 0 && (respNonAktifCust[0].od > respSetting[0].hari_nonaktif || respNonAktifCust[0].od_warkat > respSetting[0].hari_nonaktif)) {
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

            await withReactContent(swalDialog)
                .fire({
                    title: `
            <div style="text-align: left; font-size:12px;margin-top: -35px;margin-bottom: -23px;">
                <span>Terdapat faktur tagihan melebihi ${respSetting[0].hari_nonaktif} hari.</span><br>
                <span>Kebijakan perusahaan sementara customer akan dinon aktifkan.</span>
            </div>
        `,
                    width: '22%',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                    showCancelButton: false, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const respUpdateCustBl60 = await UpdateCustBl60(paramObjectBl, token);
                    }
                });
        }

        // Cek API ID untuk Ynag Transfer
        const respMaster = await GetMasterDetailPosting(paramObject);
        // Cek apakah ada item yang memenuhi kondisi
        if (Array.isArray(gridListDataAlokasiDana.current?.dataSource)) {
            const hasApiIdZero = gridListDataAlokasiDana.current?.dataSource.some((item: any) => item.jenis === 'Transfer' && item.api_id === 0);
            if (hasApiIdZero) {
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
                        title: `<p style="font-size:12px">Alokasi dana dari jenis transfer harus memilih Mutasi Bank via API.</span></p>`,
                        width: '16.4%',
                        // target: '#dialogPhuList',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                        showCancelButton: true, // Menampilkan tombol cancel
                    })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            setListStateData((prevState: any) => ({
                                ...prevState,
                                plagListAlokasiDana: true,
                            }));
                            fetchMasterDetail(listStateData.kodeDokumen);
                            // pembatalanDoc();
                            // saveDoc()
                        }
                    });
                return;
            }
        }

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

        await withReactContent(swalDialog)
            .fire({
                title: `
            <div style="text-align: left; font-size:12px;margin-top: -40px;margin-bottom: -23px;">
                <span>No. TTP : ${listStateData.noTtp}
                Customer : ${listStateData.namaRelasi}</span><br>
                <span>Apakah tanda terima pembayaran akan di proses?</span>
            </div>
        `,
                width: '22%',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                showCancelButton: true, // Menampilkan tombol cancel
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    prosesData();
                }
            });
    };

    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(() => setProgress(0), 1000);
            return () => clearTimeout(timeout);
        }
    }, [progress]);

    const [plagPosted, setPlagPosted] = useState(false);
    const [kodeDok, setKodeDok] = useState('');

    type DataItem = {
        kode_dokumen: string;
        entitas: string;
        dokumen: string;
        no_dokumen: string;
        tgl_dokumen: string;
        no_warkat: string | null;
        tgl_valuta: string | null;
        kode_cust: string | null;
        kode_akun_debet: string | null;
        kode_supp: string | null;
        kode_akun_kredit: string | null;
        kode_akun_diskon: string;
        kurs: number;
        debet_rp: number;
        kredit_rp: number;
        jumlah_rp: number;
        jumlah_mu: number;
        pajak: string;
        kosong: string | null;
        kepada: string;
        catatan: string | null;
        status: string;
        userid: string;
        tgl_update: string;
        status_approved: string | null;
        tgl_approved: string | null;
        tgl_pengakuan: string | null;
        no_TTP: string;
        tgl_TTP: string;
        kode_sales: string;
        kode_fk: string | null;
        approval: string | null;
        tgl_setorgiro: string | null;
        faktur: string;
        barcode: string | null;
        komplit: string;
        validasi1: string;
        validasi2: string;
        validasi3: string;
        validasi_ho2: string;
        validasi_ho3: string;
        validasi_catatan: string | null;
        tolak_catatan: string | null;
        kode_kry: string | null;
        tgl_trxdokumen: string;
        api_id: number | string;
        api_catatan: string | null;
        api_pending: string;
        api_norek: string | null;
        kode_aktiva: string | null;
        kode_rpe: string | null;
        kode_phe: string | null;
        kode_rps: string | null;
        kode_um: string | null;
        no_kontrak_um: string | null;
        bm_pos: string;
        jenis: string;
        nama_cust: string;
        nama_sales: string;
        detail: any; // Sesuaikan dengan struktur `result.detailJson`
        jurnal: any; // Sesuaikan dengan struktur `result.detailJurnal`
        audit: any; // Sesuaikan dengan struktur `result.detailJurnal`
        filegambar: any;
    };

    const prosesData = async () => {
        // Periksa apakah dataSource adalah array
        let filterListData: any;
        let plagTipeTransaksi: any;
        let jsonData: any;
        let generateNoDok: any;
        let gridAlokasiDana: any;
        if (Array.isArray(gridListData.current?.dataSource)) {
            filterListData = gridListData.current?.dataSource.filter((item: any) => item.kode_dokumen === listStateData.kodeDokumen);
            if (filterListData[0].nilai_transfer > 0) {
                plagTipeTransaksi = 'T';
            } else if (filterListData[0].nilai_tunai > 0) {
                plagTipeTransaksi = 'C';
            } else if (filterListData[0].nilai_warkat > 0) {
                plagTipeTransaksi = 'W';
            }
        }

        // kirimWa(filterListData[0].nama_relasi, filterListData[0].kode_cust);

        if (plagCheckboxAlokasiDana === true) {
            gridAlokasiDana = gridListDataAlokasiDana.current?.dataSource;
        } else {
            gridAlokasiDana = recordsDataAlokasiDana;
        }

        // let hasilJsonData = {
        //     entitas: kode_entitas, // kode_entitas adalah variabel yang sudah ada
        //     data: DataItem[]
        // };

        const hasilJsonData: { entitas: string; data: DataItem[] } = {
            entitas: kode_entitas,
            data: [], // Array berisi objek dengan tipe `DataItem`
        };

        if (Array.isArray(gridAlokasiDana)) {
            for (const item of gridAlokasiDana) {
                const tglJamDokumen = moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss');

                const updatedTglJamDokumen = moment(tglJamDokumen)
                    .set({
                        hour: moment().hour(),
                        minute: moment().minute(),
                        second: moment().second(),
                    })
                    .format('YYYY-MM-DD HH:mm:ss');
                // const generateNoDok = await generateNU(kode_entitas, '', item.dok === 'PU' ? '19' : '17', dateGenerateNu.format('YYYYMM'));
                const generateNoDok = await generateNU(
                    kode_entitas,
                    '',
                    item.dok === 'PU' ? '19' : '17',
                    item.jenis === 'Warkat' ? moment(filterListData[0].tgl_ttp).format('YYYYMM') : moment(item.tgl_valuta).format('YYYYMM')
                );
                const paramObject = {
                    // param object untuk Detail Faktur
                    token: token,
                    kode_entitas: kode_entitas,
                    dok: item.dok,
                    kode_dokumen: item.kode_dokumen,
                    jenis: item.jenis === 'Transfer' ? 'T' : item.jenis === 'Tunai' ? 'C' : item.jenis === 'Warkat' ? 'W' : 'U',
                    no_rek: item.jenis === 'Transfer' ? item.no_dokumen : item.jenis === 'Tunai' ? '' : item.no_dokumen,
                    struk: item.jenis === 'Transfer' ? item.bank_tujuan : item.jenis === 'Tunai' ? '' : item.bank_tujuan,

                    // param Object untuk Jurnal
                    dok_penerimaan: item.dok,
                    // tgl_dokumen: item.jenis === 'Transfer' ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss') : moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss'),
                    // tgl_dokumen: moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss'),
                    tgl_dokumen:
                        item.jenis === 'Transfer'
                            ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss')
                            : item.jenis === 'Warkat'
                            ? moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss')
                            : updatedTglJamDokumen,
                    kode_akun_debet: item.kode_akun_debet,
                    kode_akun_kredit: item.kode_akun_kredit,
                    kode_akun_beban_bulat: item.kode_akun_beban_bulat,
                    kode_akun_pendapatan_bulat: item.kode_akun_pendapatan_bulat,
                    sub_akun_debet: item.sub_akun_debet,
                    sub_akun_kredit: item.sub_akun_kredit,
                    kurs: 1,
                    jumlah: item.jumlah,
                    dibayar: item.dibayar,
                    pembulatan: item.pembulatan,
                    nama_relasi: filterListData[0].nama_relasi,
                    no_dokumen: generateNoDok,
                    userid: userid.toUpperCase(),
                    tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                };
                if (item.dok === 'PU') {
                    // const generateNoDok = await generateNU(kode_entitas, '', '19', dateGenerateNu.format('YYYYMM'));
                    // const generateNoDok = await generateNU(kode_entitas, '', '19', moment(item.tgl_valuta).format('YYYYMM'));
                    const generateNoDok = await generateNU(
                        kode_entitas,
                        '',
                        '19',
                        item.jenis === 'Warkat' ? moment(filterListData[0].tgl_ttp).format('YYYYMM') : moment(item.tgl_valuta).format('YYYYMM')
                    );
                    const result = await ReCalc(paramObject);
                    hasilJsonData.data.push({
                        kode_dokumen: '',
                        entitas: kode_entitas,
                        dokumen: item.dok,
                        // // no_dokumen: stateDataHeader?.noDokumenValue,
                        no_dokumen: generateNoDok,
                        // tgl_dokumen: moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss'),
                        // tgl_dokumen: item.jenis === 'Transfer' ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss') : moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss'),
                        // tgl_dokumen: moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss'),
                        tgl_dokumen:
                            item.jenis === 'Transfer'
                                ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss')
                                : item.jenis === 'Warkat'
                                ? moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss')
                                : updatedTglJamDokumen,
                        no_warkat: item.jenis === 'Transfer' ? item.api_norek : item.jenis === 'Tunai' ? null : item.no_warkat,
                        // tgl_valuta: item.jenis === 'Warkat' ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss') : null,
                        tgl_valuta: item.jenis === 'Warkat' ? updatedTglJamDokumen : null,
                        kode_cust: item.sub_akun_kredit,
                        kode_akun_debet: item.kode_akun_debet,
                        kode_supp: null,
                        kode_akun_kredit: item.kode_akun_kredit,
                        kode_akun_diskon: 'MOBAPP',
                        kurs: 1,
                        debet_rp: item.jumlah,
                        kredit_rp: item.jumlah,
                        jumlah_rp: item.jumlah,
                        jumlah_mu: item.jumlah,
                        pajak: 'N',
                        kosong: item.jenis === 'Warkat' ? 'B' : null,
                        kepada: filterListData[0].nama_relasi,
                        catatan: null,
                        status: 'Terbuka',
                        userid: userid.toUpperCase(),
                        tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        status_approved: null,
                        tgl_approved: null,
                        tgl_pengakuan: null,
                        no_TTP: filterListData[0].no_ttp,
                        tgl_TTP: filterListData[0].tgl_ttp,
                        kode_sales: filterListData[0].kode_sales,
                        kode_fk: null,
                        approval: null,
                        tgl_setorgiro: null,
                        faktur: 'N',
                        barcode: null,
                        komplit: 'N',
                        validasi1: 'N',
                        validasi2: 'N',
                        validasi3: 'N',
                        validasi_ho2: 'N',
                        validasi_ho3: 'N',
                        validasi_catatan: null,
                        tolak_catatan: null,
                        kode_kry: null,
                        tgl_trxdokumen: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        api_id: item.jenis === 'Transfer' ? item.api_id : 0,
                        api_catatan: item.jenis === 'Transfer' ? item.api_catatan : null,
                        api_pending: item.jenis === 'Transfer' ? item.api_pending : 'N',
                        api_norek: item.jenis === 'Transfer' ? item.api_norek : null,
                        kode_aktiva: null,
                        kode_rpe: null,
                        kode_phe: null,
                        kode_rps: null,
                        kode_um: null,
                        no_kontrak_um: null,
                        bm_pos: 'N',
                        jenis: item.jenis === 'Transfer' ? 'T' : item.jenis === 'Tunai' ? 'C' : item.jenis === 'Warkat' ? 'W' : 'U',
                        nama_cust: filterListData[0].nama_relasi,
                        nama_sales: filterListData[0].nama_sales,
                        detail: result.detailJson,
                        jurnal: result.detailJurnal,
                        audit: [
                            {
                                entitas: kode_entitas,
                                kode_audit: null,
                                dokumen: 'PU',
                                kode_dokumen: '',
                                no_dokumen: generateNoDok,
                                tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                                proses: 'NEW',
                                diskripsi: `Penerimaan Piutang ${item.jenis} nilai transaksi = ${frmNumber(item.jumlah)}`,
                                userid: userid.toUpperCase(),
                                system_user: '',
                                system_ip: '',
                                system_mac: '',
                            },
                        ],
                        filegambar: item.filegambar,
                    });
                    // const generateNu = await generateNU(kode_entitas, generateNoDok, '19', moment(filterListData[0].tgl_ttp).format('YYYYMM'));
                    // const generateNu = await generateNU(kode_entitas, generateNoDok, '19', moment(item.tgl_valuta).format('YYYYMM'));
                    const generateNu = await generateNU(
                        kode_entitas,
                        generateNoDok,
                        '19',
                        item.jenis === 'Warkat' ? moment(filterListData[0].tgl_ttp).format('YYYYMM') : moment(item.tgl_valuta).format('YYYYMM')
                    );
                } else {
                    // const generateNoDokBM = await generateNU(kode_entitas, '', '17', dateGenerateNu.format('YYYYMM'));
                    // const generateNoDokBM = await generateNU(kode_entitas, '', '17', moment(item.tgl_valuta).format('YYYYMM'));
                    const generateNoDokBM = await generateNU(
                        kode_entitas,
                        '',
                        '17',
                        item.jenis === 'Warkat' ? moment(filterListData[0].tgl_ttp).format('YYYYMM') : moment(item.tgl_valuta).format('YYYYMM')
                    );
                    const result = await ReCalcBM(paramObject);
                    hasilJsonData.data.push({
                        kode_dokumen: '',
                        entitas: kode_entitas,
                        dokumen: item.dok,
                        // // no_dokumen: stateDataHeader?.noDokumenValue,
                        no_dokumen: generateNoDokBM,
                        // tgl_dokumen: moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss'),
                        // tgl_dokumen: item.jenis === 'Transfer' ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss') : moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss'),
                        // tgl_dokumen: moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss'),
                        tgl_dokumen:
                            item.jenis === 'Transfer'
                                ? moment(item.tgl_valuta).format('YYYY-MM-DD HH:mm:ss')
                                : item.jenis === 'Warkat'
                                ? moment(filterListData[0].tgl_ttp).format('YYYY-MM-DD HH:mm:ss')
                                : updatedTglJamDokumen,
                        no_warkat: null,
                        tgl_valuta: null,
                        kode_cust: item.sub_akun_debet,
                        kode_akun_debet: item.kode_akun_debet,
                        kode_supp: null,
                        kode_akun_kredit: item.kode_akun_kredit,
                        kode_akun_diskon: 'MOBAPP',
                        kurs: 1,
                        debet_rp: item.dibayar,
                        kredit_rp: item.dibayar,
                        jumlah_rp: item.dibayar,
                        jumlah_mu: item.dibayar,
                        pajak: 'N',
                        kosong: '0',
                        kepada: filterListData[0].nama_relasi,
                        catatan: `UANG MUKA DEPOSIT ATAS ${filterListData[0].nama_relasi}`,
                        status: 'Terbuka',
                        userid: userid.toUpperCase(),
                        tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        status_approved: null,
                        tgl_approved: null,
                        tgl_pengakuan: null,
                        no_TTP: filterListData[0].no_ttp,
                        tgl_TTP: filterListData[0].tgl_ttp,
                        kode_sales: filterListData[0].kode_sales,
                        kode_fk: null,
                        approval: null,
                        tgl_setorgiro: null,
                        faktur: 'N',
                        barcode: null,
                        komplit: 'N',
                        validasi1: 'N',
                        validasi2: 'N',
                        validasi3: 'N',
                        validasi_ho2: 'N',
                        validasi_ho3: 'N',
                        validasi_catatan: null,
                        tolak_catatan: null,
                        kode_kry: null,
                        tgl_trxdokumen: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        api_id: item.jenis === 'Transfer' ? item.api_id : 0,
                        api_catatan: item.jenis === 'Transfer' ? item.api_catatan : null,
                        api_pending: item.jenis === 'Transfer' ? item.api_pending : 'N',
                        api_norek: item.jenis === 'Transfer' ? item.api_norek : null,
                        kode_aktiva: null,
                        kode_rpe: null,
                        kode_phe: null,
                        kode_rps: null,
                        kode_um: null,
                        no_kontrak_um: null,
                        bm_pos: 'N',
                        jenis: item.jenis === 'Transfer' ? 'T' : item.jenis === 'Tunai' ? 'C' : item.jenis === 'Warkat' ? 'W' : 'U',
                        nama_cust: filterListData[0].nama_relasi,
                        nama_sales: filterListData[0].nama_sales,
                        detail: [],
                        jurnal: result.detailJurnal,
                        audit: [
                            {
                                entitas: kode_entitas,
                                kode_audit: null,
                                dokumen: 'BM',
                                kode_dokumen: '',
                                no_dokumen: generateNoDok,
                                tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                                proses: 'NEW',
                                diskripsi: `Pemasukan lain nilai transaksi = ${frmNumber(item.jumlah)}`,
                                userid: userid.toUpperCase(),
                                system_user: '',
                                system_ip: '',
                                system_mac: '',
                            },
                        ],
                        filegambar: item.filegambar,
                    });
                    // const generateNu = await generateNU(kode_entitas, generateNoDokBM, '17', moment(filterListData[0].tgl_ttp).format('YYYYMM'));
                    // const generateNu = await generateNU(kode_entitas, generateNoDokBM, '17', moment(item.tgl_valuta).format('YYYYMM'));
                    const generateNu = await generateNU(
                        kode_entitas,
                        generateNoDokBM,
                        '17',
                        item.jenis === 'Warkat' ? moment(filterListData[0].tgl_ttp).format('YYYYMM') : moment(item.tgl_valuta).format('YYYYMM')
                    );
                }
            }
        }

        // ==============================================================
        // proses insert Transaksi dari POSTING TTP
        setIsSaving(true);
        setIsModalOpen(true); // Buka modal
        setProgress(0);
        setIsError(false);
        setMessage(''); // Reset pesan

        const interval = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + 10 : prev));
        }, 300);
        try {
            // Menunggu 3 detik sebelum memproses permintaan
            await new Promise((resolve) => setTimeout(resolve, 3000));
            const response = await axios.post(`${apiUrl}/erp/proses_posting_ttp`, hasilJsonData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Proses Simpan Data.....');
            setProgress(30); // Berhasil menyimpan data PPI
            for (const item of response.data.data) {
                // console.log('hasil = ', item.kodeDokumen, item.filegambar, item.jenis, item.tgl_TTP);
                // Response : kode_dokumen, filegambar, jenis, no_dokumen, tgl_TTP

                await new Promise((resolve) => setTimeout(resolve, 3000));
                if (item.jenis !== 'U') {
                    loadDataImage(item.kodeDokumen, item.filegambar, item.jenis === 'T' ? 2 : item.jenis === 'C' ? 2 : 3);
                }
                setMessage('Proses Upload File Pendukung.....');
                setProgress(50); // Berhasil mengunggah file

                // Generate nomor unik
                if (item.dokumen === 'PU') {
                    await generateNU(kode_entitas, item.no_dokumen, '19', moment(item.tgl_dokumen).format('YYYYMM'))
                        .then(() => setProgress(70)) // Berhasil generate nomor unik
                        .catch((error) => {
                            setProgress(0); // Reset progress jika gagal
                            setMessage(`Penambahan Counter No. PPI gagal: ${error.message}`);
                            swalDialog.fire({
                                title: '',
                                html: `Penambahan Counter No. PPI gagal: ${error.message}`,
                                icon: 'warning',
                                width: '20%',
                                heightAuto: true,
                                showConfirmButton: true,
                                confirmButtonText: 'Ok',
                                target: '#dialogPhuList',
                            });
                            throw error;
                        });
                } else {
                    // Generate nomor unik
                    await generateNU(kode_entitas, item.no_dokumen, '17', moment(item.tgl_dokumen).format('YYYYMM'))
                        .then(() => setProgress(70)) // Berhasil generate nomor unik
                        .catch((error) => {
                            setProgress(0); // Reset progress jika gagal
                            setMessage(`Penambahan Counter No. BM gagal: ${error.message}`);
                            swalDialog.fire({
                                title: '',
                                html: `Penambahan Counter No. PPI gagal: ${error.message}`,
                                icon: 'warning',
                                width: '20%',
                                heightAuto: true,
                                showConfirmButton: true,
                                confirmButtonText: 'Ok',
                                target: '#dialogPhuList',
                            });
                            throw error;
                        });
                }

                await new Promise((resolve) => setTimeout(resolve, 3000));

                //Kirim Wa
                kirimWa(filterListData[0].nama_relasi, filterListData[0].kode_cust, token, kode_entitas);
                setMessage('Proses Kirim WA.....');
                setProgress(100); // Selesai dengan sukses

                setMessage('Data Berhasil Disimpan');
                setPlagPosted(true);
                setKodeDok(filterListData[0].kode_dokumen);
                handleRefreshData();
            }
        } catch (error: any) {
            clearInterval(interval);
            setIsError(true); // Set error jika penyimpanan gagal
            setMessage(error.message); // Tampilkan pesan error
        } finally {
            setIsSaving(false);
            clearInterval(interval); // Hentikan interval
            setTimeout(() => {
                setIsModalOpen(false); // Tutup modal setelah delay
                setProgress(0); // Reset progress
                setIsError(false); // Reset error state
            }, 2000); // Tutup modal setelah 2 detik
        }
    };

    const handleDppCustomer = (args: any) => {
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_cust: args.kode_cust,
            tgl_akhir: moment().format('YYYY-MM-DD'),
            token: token,
        };
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <>
                    <div>
                        <input id={`apiId${args.id}`} readOnly={true} value={args.nama_relasi} style={{ width: '265px', backgroundColor: 'transparent', border: 'none' }}></input>
                    </div>
                    <div onClick={() => OnClick_DaftarDPP(paramObject)} style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        <FontAwesomeIcon icon={faList} width="18" height="18" />
                    </div>
                </>
            </div>
        );
    };

    const rowDataSelectedFaktur = async (args: any) => {
        console.log('Data Alokasi Dana = ', args);
        const paramObject = {
            kode_entitas: kode_entitas,
            dok: args.data.dok,
            kode_dokumen: args.data.kode_dokumen,
            jenis: args.data.jenis === 'Warkat' ? 'W' : args.data.jenis === 'Transfer' ? 'T' : args.data.jenis === 'Tunai' ? 'C' : 'U',
            no_rek: args.data.no_dokumen,
            struk: args.data.bank_tujuan,
            token: token,
        };
        console.log('paramObjeck = ', paramObject);
        const dataFaktur = await GetDetailTtp(paramObject);
        const responseDataFakturFix = dataFaktur.map((item: any) => ({
            ...item,
            dibayar: parseFloat(item.dibayar),
            pembulatan: parseFloat(item.pembulatan),
            jumlah: parseFloat(item.jumlah),
            netto_mu: parseFloat(item.netto_mu),
            sisa_mu: parseFloat(item.sisa_mu),
        }));
        gridListDataFaktur.current?.setProperties({ dataSource: responseDataFakturFix });
        gridListDataFaktur.current?.refresh();
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
                                        <ButtonComponent
                                            id="btnApproval"
                                            cssClass="e-primary e-small"
                                            style={styleButtonApp}
                                            disabled={false}
                                            onClick={() =>
                                                listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                                    ? btnClickApprovalPengajuan('cetakUlang')
                                                    : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                                    ? btnClickApprovalPengajuan('pembatalan')
                                                    : listStateData.appBatal === 'Y' && listStateData.batal === 'Y'
                                                    ? btnClickApprovalPengajuan('batal')
                                                    : null
                                            }
                                            // onClick={btnClickApprovalPengajuan}
                                            content="Approval Pengajuan"
                                        ></ButtonComponent>
                                    ) : (
                                        <ButtonComponent
                                            id="btnApproval"
                                            cssClass="e-primary e-small"
                                            style={{ width: '127px', height: '28px', marginBottom: '0.5em', marginTop: '0.5em', marginRight: '0.8em' }}
                                            disabled={true}
                                            onClick={() =>
                                                listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                                    ? btnClickApprovalPengajuan('cetakUlang')
                                                    : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                                    ? btnClickApprovalPengajuan('pembatalan')
                                                    : listStateData.appBatal === 'Y' && listStateData.batal === 'Y'
                                                    ? btnClickApprovalPengajuan('batal')
                                                    : null
                                            }
                                            // onClick={btnClickApprovalPengajuan}
                                            content="Approval Pengajuan"
                                        ></ButtonComponent>
                                    )}
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </div>
                    <div className="ml-3 mr-1" style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                            Proses Posting TTP...
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
                            style={listStateData.plagListAlokasiDana === false ? { background: '#dedede', width: '100%', height: '635px' } : { background: '#dedede', width: '100%', height: '670px' }}
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
                            <div className="flex">
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
                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                />
                            </div>

                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        // value={filterData.noBuktiPenerimaanValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isNoTTPChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                noTTPValue: value,
                                            }));
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
                                    label="Customer"
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
                                <CheckBoxComponent
                                    label="Salesman"
                                    checked={checkboxFilter.isNamaSalesmanChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isNamaSalesmanChecked: value,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mt-1 flex justify-between">
                                <div className="container form-input">
                                    <TextBoxComponent
                                        placeholder=""
                                        value={filterData.namaSalesValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setCheckboxFilter((prevState: any) => ({
                                                ...prevState,
                                                isNamaSalesmanChecked: true,
                                            }));
                                            setFilterData((prevState: any) => ({
                                                ...prevState,
                                                namaSalesValue: value,
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Proses Posting</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="prosesPosting"
                                    id="prosesPostingYa"
                                    className="form-radio"
                                    checked={filterData.selectedOptionProsesPosting === 'prosesPostingYa'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionProsesPosting: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="prosesPostingYa" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="prosesPosting"
                                    id="prosesPostingTidak"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionProsesPosting === 'prosesPostingTidak'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionProsesPosting: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="prosesPostingTidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="prosesPosting"
                                    id="prosesPostingSemua"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionProsesPosting === 'prosesPostingSemua'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionProsesPosting: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="prosesPostingSemua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Pengajuan Cetak Ulang</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="pengajuanCu"
                                    id="pengajuanCuYa"
                                    className="form-radio"
                                    checked={filterData.selectedOptionPengajuanCu === 'pengajuanCuYa'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPengajuanCu: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="pengajuanCuYa" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="pengajuanCu"
                                    id="pengajuanCuTidak"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionPengajuanCu === 'pengajuanCuTidak'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPengajuanCu: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="pengajuanCuTidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="default_text_color"
                                    id="pengajuanCuSemua"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionPengajuanCu === 'pengajuanCuSemua'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPengajuanCu: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="pengajuanCuSemua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>
                            <div className="mt-2 flex justify-between">
                                <div className="font-bold">
                                    <span style={{ fontWeight: 'bold', fontSize: 12 }}>Pengajuan Pembatalan</span>
                                </div>
                            </div>
                            <div className="mt-1 flex">
                                <input
                                    type="radio"
                                    name="pengajuanPembatalan"
                                    id="pengajuanPembatalanYa"
                                    className="form-radio"
                                    checked={filterData.selectedOptionPengajuanPembatalan === 'pengajuanPembatalanYa'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPengajuanPembatalan: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="pengajuanPembatalanYa" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    YA
                                </label>

                                <input
                                    type="radio"
                                    name="pengajuanPembatalan"
                                    id="pengajuanPembatalanTidak"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionPengajuanPembatalan === 'pengajuanPembatalanTidak'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPengajuanPembatalan: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="pengajuanPembatalanTidak" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Tidak
                                </label>

                                <input
                                    type="radio"
                                    name="pengajuanPembatalan"
                                    id="pengajuanPembatalanSemua"
                                    className="form-radio ml-4"
                                    checked={filterData.selectedOptionPengajuanPembatalan === 'pengajuanPembatalanSemua'}
                                    onChange={(event) => {
                                        setFilterData((prevState) => ({
                                            ...prevState,
                                            selectedOptionPengajuanPembatalan: event.target.id,
                                        }));
                                    }}
                                />
                                <label htmlFor="pengajuanPembatalanSemua" className="ml-1" style={{ marginBottom: -2, fontSize: 11 }}>
                                    Semua
                                </label>
                            </div>
                            <div className="mt-6 items-center justify-between">
                                <div className={styles['custom-box-wrapper-posting-ttp']}>
                                    <div className={styles['custom-box-cetak-ulang']}></div>
                                    <div className={styles['box-text']}>Pengajuan Cetak Ulang</div>
                                </div>
                            </div>
                            <div className="mt-2 items-center justify-between">
                                <div className={styles['custom-box-wrapper-posting-ttp']}>
                                    <div className={styles['custom-box-pembatalan']}></div>
                                    <div className={styles['box-text']}>Pengajuan Pembatalan</div>
                                </div>
                            </div>
                            <div className="mt-2 items-center justify-between">
                                <div className={styles['custom-box-wrapper-posting-ttp']}>
                                    <div className={styles['custom-box-batal']}></div>
                                    <div className={styles['box-text']}>Dibatalkan</div>
                                </div>
                            </div>
                        </div>
                    </SidebarComponent>

                    {/* ===============  Grid Data ========================   */}
                    <div className="panel" style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 315px' : ' 350px'), overflowY: 'auto' }}>
                        <div className="panel-data" style={{ width: '100%' }}>
                            <div style={{ marginBottom: 10 }}>
                                <div className="e-content">
                                    {/*===================tabindex0=============================== */}
                                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }}>
                                        <GridComponent
                                            key={gridKey}
                                            id="gridListData"
                                            locale="id"
                                            ref={gridListData}
                                            //dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                            dataSource={recordsDataRef.current}
                                            allowExcelExport={true}
                                            allowPdfExport={true}
                                            // editSettings={{ allowDeleting: true }}
                                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                                            allowPaging={true}
                                            allowSorting={true}
                                            allowFiltering={false}
                                            allowResizing={true}
                                            autoFit={true}
                                            allowReordering={true}
                                            // pageSettings={
                                            //     listStateData.plagListAlokasiDana === true
                                            //         ? { pageSize: 7, pageCount: 5, pageSizes: ['7', '14', '25', '50', '100', 'All'] }
                                            //         : { pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }
                                            // }
                                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                            rowHeight={20}
                                            width={'100%'}
                                            height={listStateData.plagListAlokasiDana === true ? 231 : 533}
                                            gridLines={'Both'}
                                            // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={selectedRowsData}
                                            dataBound={() => {
                                                if (gridListData.current && rowIdxListData.current !== undefined) {
                                                    gridListData.current?.selectRow(rowIdxListData.current); // Pilih kembali baris yang sebelumnya dipilih
                                                }
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_ttp"
                                                    headerText="No. TTP"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="120"
                                                    clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                />
                                                <ColumnDirective
                                                    field="tgl_ttp"
                                                    headerText="Tanggal"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="80"
                                                    clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="nama_relasi"
                                                    headerText="Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="300"
                                                    clipMode="EllipsisWithTooltip"
                                                    template={handleDppCustomer}
                                                />
                                                <ColumnDirective
                                                    field="nama_sales"
                                                    headerText="Salesman"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="200"
                                                    clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective field="proses" headerText="Posted" headerTextAlign="Center" textAlign="Center" width="50" template={templatePosted} />
                                                <ColumnDirective
                                                    field="tombol_ttp"
                                                    headerText="Bukti TTP Salesman"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    headerTemplate={headerBuktiTtpSalesman}
                                                    width="70"
                                                    template={templateBuktiTTP}
                                                />
                                                <ColumnDirective
                                                    field="tombol_ttd"
                                                    headerText="Spesimen TTD Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    headerTemplate={headerSpesimenTtdCustomer}
                                                    width="80"
                                                    template={templateTombolTTD}
                                                />
                                                <ColumnDirective
                                                    field="ttd"
                                                    headerText="Spesimen Sesuai"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    headerTemplate={headerSpesimenSesuai}
                                                    width="70"
                                                    template={templateSpesimenSesuai}
                                                />
                                                <ColumnDirective field="catatan" headerText="Catatan" headerTextAlign="Center" textAlign="Left" width="250" template={editTemplateCatatan} />

                                                <ColumnDirective
                                                    columns={[
                                                        {
                                                            field: 'nilai_tunai',
                                                            headerText: 'Tunai',
                                                            format: 'N2',
                                                            headerTextAlign: 'Center',
                                                            textAlign: 'Right',
                                                            width: 100,
                                                        },
                                                        {
                                                            field: 'nilai_transfer',
                                                            headerText: 'Transfer',
                                                            format: 'N2',
                                                            headerTextAlign: 'Center',
                                                            textAlign: 'Right',
                                                            width: 100,
                                                        },
                                                        {
                                                            field: 'nilai_warkat',
                                                            headerText: 'Warkat',
                                                            format: 'N2',
                                                            headerTextAlign: 'Center',
                                                            textAlign: 'Right',
                                                            width: 100,
                                                        },
                                                        {
                                                            field: 'nilai_titipan',
                                                            headerText: 'Uang Muka/Deposit',
                                                            format: 'N2',
                                                            headerTextAlign: 'Center',
                                                            textAlign: 'Right',
                                                            width: 110,
                                                        },
                                                        {
                                                            field: 'nilai_bulat',
                                                            headerText: 'Pembulatan',
                                                            format: 'N2',
                                                            headerTextAlign: 'Center',
                                                            textAlign: 'Right',
                                                            width: 100,
                                                        },
                                                        {
                                                            field: 'jml_terima',
                                                            headerText: 'Jml. Terima',
                                                            format: 'N2',
                                                            headerTextAlign: 'Center',
                                                            textAlign: 'Right',
                                                            width: 100,
                                                        },
                                                    ]}
                                                    headerText="Rincian Penerimaan"
                                                    textAlign="Center"
                                                />
                                                <ColumnDirective
                                                    field="tgl_proses"
                                                    headerText="Tgl. Proses PPI"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    clipMode="EllipsisWithTooltip"
                                                />
                                                <ColumnDirective
                                                    field="userid_proses"
                                                    headerText="UserId"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="100"
                                                    clipMode="EllipsisWithTooltip"
                                                />
                                            </ColumnsDirective>
                                            <AggregatesDirective>
                                                <AggregateDirective>
                                                    <AggregateColumnsDirective>
                                                        <AggregateColumnDirective field="nilai_tunai" type="Custom" customAggregate={totTunai} footerTemplate={customTotTunai} />
                                                        <AggregateColumnDirective field="nilai_transfer" type="Custom" customAggregate={totTransfer} footerTemplate={customTotTransfer} />
                                                        <AggregateColumnDirective field="nilai_warkat" type="Custom" customAggregate={totWarkat} footerTemplate={customTotWarkat} />
                                                        <AggregateColumnDirective field="nilai_titipan" type="Custom" customAggregate={totUangMuka} footerTemplate={customTotUangMuka} />
                                                        <AggregateColumnDirective field="nilai_bulat" type="Custom" customAggregate={totPembulatan} footerTemplate={customTotPembulatan} />
                                                        <AggregateColumnDirective field="jml_terima" type="Custom" customAggregate={totJmlTerima} footerTemplate={customTotJmlTerima} />
                                                    </AggregateColumnsDirective>
                                                </AggregateDirective>
                                            </AggregatesDirective>
                                            <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>

                                    {listStateData.plagListAlokasiDana === true ? (
                                        <>
                                            <label style={{ padding: '4px 3px 3px 7px', backgroundColor: '#4a4d4d', marginTop: '5px', marginBottom: '-5px', color: 'white' }}>Alokasi Dana</label>
                                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }}>
                                                <GridComponent
                                                    // key={gridKey}
                                                    id="gridListDataAlokasiDana"
                                                    locale="id"
                                                    ref={gridListDataAlokasiDana}
                                                    //dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                                    // dataSource={recordsDataAlokasiDanaRef.current}
                                                    allowExcelExport={true}
                                                    allowPdfExport={true}
                                                    // editSettings={{ allowDeleting: true }}
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    // allowPaging={true}
                                                    allowSorting={true}
                                                    allowFiltering={false}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    allowReordering={true}
                                                    // pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                                    rowHeight={22}
                                                    width={'100%'}
                                                    height={130}
                                                    gridLines={'Both'}
                                                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    rowDataBound={rowDataBoundListData}
                                                    rowSelected={rowDataSelectedFaktur}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective
                                                            field="dok"
                                                            headerText="Dokumen"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            //autoFit
                                                            width="80"
                                                        />
                                                        <ColumnDirective
                                                            field="jenis"
                                                            headerText="Jenis"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            //autoFit
                                                            width="80"
                                                        />
                                                        <ColumnDirective
                                                            field="no_warkat"
                                                            headerText="No. Warkat"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            //autoFit
                                                            width="100"
                                                        />
                                                        <ColumnDirective
                                                            field="tgl_valuta"
                                                            headerText="Tanggal"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            //autoFit
                                                            width="80"
                                                            type="date"
                                                            format={formatDate}
                                                        />
                                                        <ColumnDirective
                                                            field="nama_bank"
                                                            headerText="Nama Bank"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            //autoFit
                                                            width="80"
                                                        />
                                                        <ColumnDirective
                                                            field="no_rekening"
                                                            headerText="No. Rekening"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            //autoFit
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="nama_rekening"
                                                            headerText="Nama Pemilik"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            //autoFit
                                                            width="150"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="dibayar"
                                                            headerText="Dibayar"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            format="N2"
                                                            width="110"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="pembulatan"
                                                            headerText="Pembulatan"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            format="N2"
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />

                                                        <ColumnDirective field="api_id" headerText="API ID" headerTextAlign="Center" textAlign="Center" width="100" template={handleApiId} />
                                                        <ColumnDirective field="amount" headerText="Jumlah CR" headerTextAlign="Center" textAlign="Left" width="110" template={handleJumlahCR} />
                                                        <ColumnDirective
                                                            field="filegambar"
                                                            headerText="Bukti Bayar"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="80"
                                                            template={handlePrevBuktiBayar}
                                                        />
                                                    </ColumnsDirective>
                                                    <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                                </GridComponent>
                                            </div>
                                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }}>
                                                <GridComponent
                                                    // key={gridKey}
                                                    id="gridListData"
                                                    locale="id"
                                                    ref={gridListDataFaktur}
                                                    //dataSource={filterData.searchNoBukti !== '' || filterData.searchJumlah !== '' ? filteredData : recordsDataRef.current}
                                                    // dataSource={recordsDataFakturRef.current}
                                                    allowExcelExport={true}
                                                    allowPdfExport={true}
                                                    // editSettings={{ allowDeleting: true }}
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    // allowPaging={true}
                                                    allowSorting={true}
                                                    allowFiltering={false}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    allowReordering={true}
                                                    // pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                                    rowHeight={22}
                                                    width={'100%'}
                                                    height={120}
                                                    gridLines={'Both'}
                                                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    rowDataBound={rowDataBoundListData}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective field="id_dokumen" headerText="No." headerTextAlign="Center" textAlign="Center" width="50" />
                                                        <ColumnDirective
                                                            field="no_fj"
                                                            headerText="No. Faktur"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            //autoFit
                                                            width="120"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="tgl_fj"
                                                            headerText="Tanggal"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            //autoFit
                                                            width="80"
                                                            clipMode="EllipsisWithTooltip"
                                                            type="date"
                                                            format={formatDate}
                                                        />
                                                        <ColumnDirective
                                                            field="tgl_tempo"
                                                            headerText="Jatuh Tempo"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            //autoFit
                                                            width="80"
                                                            clipMode="EllipsisWithTooltip"
                                                            type="date"
                                                            format={formatDate}
                                                        />
                                                        <ColumnDirective
                                                            field="hari"
                                                            headerText="Hari"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            width="60"
                                                            clipMode="EllipsisWithTooltip"
                                                            template={(props: any) => {
                                                                const value = parseFloat(props.hari);
                                                                const formattedValue =
                                                                    value < 0
                                                                        ? `(${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 0 })})`
                                                                        : value.toLocaleString('en-US', { minimumFractionDigits: 0 });
                                                                return <span style={value < 0 ? { color: 'red' } : {}}>{formattedValue}</span>;
                                                            }}
                                                        />
                                                        <ColumnDirective
                                                            field="netto_mu"
                                                            headerText="Nilai Faktur"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            format="N2"
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="sisa_mu"
                                                            headerText="Sisa yang harus dibayar"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            format="N2"
                                                            width="130"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="dibayar"
                                                            headerText="Pembayaran"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            format="N2"
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                    </ColumnsDirective>
                                                    <Inject services={[Aggregate, Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                                </GridComponent>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                            {/* <div className="e-tab-header" style={{ marginBottom: 10 }}>
                                        <div tabIndex={0} onClick={() => handleTabClick('ppiOtomatis')}>
                                            {' '}
                                            PPI Otomatis{' '}
                                        </div>
                                    </div> */}
                            {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                            <ContextMenuComponent id="contextmenu" target=".e-gridheader" animationSettings={{ duration: 800, effect: 'FadeIn' }} />
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
                            <div style={{ marginTop: '17px', marginLeft: '12px' }}>
                                <CheckBoxComponent
                                    label="Tampilkan Alokasi Dana"
                                    checked={checkboxFilter.isTampilkanAlokasiDanaChecked}
                                    change={(args: ChangeEventArgsButton) => {
                                        const value: any = args.checked;
                                        setCheckboxFilter((prevState: any) => ({
                                            ...prevState,
                                            isTampilkanAlokasiDanaChecked: value,
                                        }));
                                        setListStateData((prevState) => ({
                                            ...prevState,
                                            plagListAlokasiDana: value,
                                        }));
                                        fetchMasterDetail(listStateData.kodeDokumen);
                                        setPlagCheckboxAlokasiDana(true);
                                    }}
                                    style={{ borderRadius: 3, borderColor: 'gray' }}
                                    cssClass={styles['bold-label']}
                                />
                            </div>
                            <div style={{ width: '172px' }}>
                                <TooltipComponent content="Proses Posting" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-chevron-right"
                                        iconPosition="Left"
                                        content="Proses Posting"
                                        style={{ backgroundColor: '#3dd13d', marginTop: '15px', marginLeft: '10px', color: 'black', fontWeight: 'bold' }}
                                        onClick={handleProsesPosting}
                                        // onClick={post}
                                    />
                                </TooltipComponent>
                            </div>
                            <div style={{ marginTop: '19px', marginLeft: '-23px' }}>
                                <label style={{ fontSize: '12px', color: '#95050a', fontWeight: 'bold' }}>NB : Notifikasi akan terkirim setelah proses posting</label>
                            </div>
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
            {/* Modal Catatan */}
            {plagInputCatatan === true ? (
                <>
                    <Draggable disabled={true}>
                        <div className={`${styles.modalDetailDragable}`} style={modalPositionCatatan}>
                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 18, fontWeight: 500 }}>Isi Catatan TTP : {paramProps.no_ttp}</span>
                                </div>
                                <hr style={{ borderTop: '1px solid #000', margin: '10px 0' }} />
                                <div className="panel-input" style={{ width: '100%', height: '200px' }}>
                                    <TextBoxComponent
                                        id="vKeteranganSC"
                                        ref={(t) => {
                                            textareaObj = t;
                                        }}
                                        multiline={true}
                                        value={InputCatatan}
                                        blur={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            setInputCatatan(value);
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
                                                updateCatatan();
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
                                            onClick={closeModalCatatan}
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

            {/* Modal Approval Pengajuan */}
            {listStateData.plagFilePendukung === true ? (
                <>
                    <Draggable>
                        <div className={`${styles.modalDetailDragable}`} style={modalPositionFilePendukung}>
                            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 14, fontWeight: 'bold' }}>
                                        Approval Pengajuan{' '}
                                        {listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                            ? 'Cetak Ulang'
                                            : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                            ? 'Pembatalan'
                                            : listStateData.appBatal === 'Y' && listStateData.batal === 'Y'
                                            ? 'Pembatalan'
                                            : null}{' '}
                                        <span
                                            style={
                                                listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y' ? { fontWeight: 'bold', color: 'green' } : { fontWeight: 'bold', color: 'red' }
                                            }
                                        >
                                            {listStateData.noTtp}
                                        </span>
                                    </span>
                                </div>
                                <hr style={{ border: '1px solid gray' }} />
                                <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                    <div className="e-content">
                                        <div style={{ width: '100%', height: '50%', marginTop: '5px' }}>
                                            <div className="flex">
                                                <div style={{ width: '70%' }}>
                                                    <div className="border p-3" style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '275px' }}>
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Tab1`}
                                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                            onClick={() =>
                                                                listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                                                    ? OpenPreview('cetakUlang')
                                                                    : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                                                    ? OpenPreview('pembatalan')
                                                                    : listStateData.appBatal === 'Y' && listStateData.batal === 'Y'
                                                                    ? OpenPreview('Pembatalan')
                                                                    : null
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ width: '5%' }}></div>
                                                {listStateData.appBatal === 'Y' && listStateData.batal === 'Y' ? null : (
                                                    <div style={{ width: '25%' }}>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 "
                                                            style={{
                                                                // backgroundColor: '#3b3f5c',
                                                                color: 'green',
                                                                width: '100%',
                                                                height: '13%',
                                                                marginTop: 0,
                                                                borderRadius: '5px',
                                                                fontSize: '13px',
                                                                marginLeft: '-9px',
                                                                fontWeight: 'bold',
                                                            }}
                                                            onClick={() =>
                                                                listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                                                    ? handlePengajuanApproval('cetakUlang', 'disetujui')
                                                                    : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                                                    ? handlePengajuanApproval('pembatalan', 'disetujui')
                                                                    : null
                                                            }
                                                        >
                                                            Disetujui
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 "
                                                            style={{
                                                                // backgroundColor: '#3b3f5c',
                                                                color: 'red',
                                                                width: '100%',
                                                                height: '13%',
                                                                marginTop: 0,
                                                                borderRadius: '5px',
                                                                fontSize: '13px',
                                                                marginLeft: '-9px',
                                                                fontWeight: 'bold',
                                                            }}
                                                            onClick={() =>
                                                                listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                                                    ? handlePengajuanApproval('cetakUlang', 'tolak')
                                                                    : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                                                    ? handlePengajuanApproval('pembatalan', 'tolak')
                                                                    : null
                                                            }
                                                        >
                                                            Tolak
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 "
                                                            style={{
                                                                // backgroundColor: '#3b3f5c',
                                                                color: 'black',
                                                                width: '100%',
                                                                height: '13%',
                                                                marginTop: 0,
                                                                borderRadius: '5px',
                                                                fontSize: '13px',
                                                                marginLeft: '-9px',
                                                                fontWeight: 'bold',
                                                            }}
                                                            onClick={() => {
                                                                setListStateData((prevState: any) => ({
                                                                    ...prevState,
                                                                    plagFilePendukung: false,
                                                                }));
                                                            }}
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <hr style={{ borderTop: '1px solid #000', margin: '10px 0' }} />
                                            <div className="panel-input" style={{ width: '100%', height: '35px', display: 'flex' }}>
                                                <input
                                                    disabled={true}
                                                    value={
                                                        listStateData.appCetakUlang === 'N' && listStateData.cetakUlang === 'Y'
                                                            ? listStateData.ketCetakUlang
                                                            : listStateData.appBatal === 'N' && listStateData.batal === 'Y'
                                                            ? listStateData.ketBatal
                                                            : listStateData.appBatal === 'Y' && listStateData.batal === 'Y'
                                                            ? listStateData.ketBatal
                                                            : ''
                                                    }
                                                    style={{ fontSize: '12px', fontWeight: 'bold', width: '286px', backgroundColor: 'transparent', border: 'none' }}
                                                ></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`${styles.closeButtonDetailDragable}`}
                                onClick={() => {
                                    setListStateData((prevState: any) => ({
                                        ...prevState,
                                        plagFilePendukung: false,
                                    }));
                                }}
                            >
                                <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                            </button>
                        </div>
                    </Draggable>
                </>
            ) : null}
            {/* ============================================================ */}

            {/* Modal Approval Pengajuan */}
            {isOpenPreviewDobel === true ? (
                <>
                    <Draggable>
                        <div className={`${styles.modalDetailDragable}`} style={modalPositionFilePendukungTTP}>
                            <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 14, fontWeight: 'bold' }}>
                                        Bukti TTP Salesman : <span style={{ fontWeight: 'bold', color: 'red' }}>{listStateData.noTtp}</span>
                                    </span>
                                </div>
                                <hr style={{ border: '1px solid gray' }} />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                    <div className="e-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                        <div style={{ width: '100%', height: '50%', marginTop: '5px' }}>
                                            <div className="flex" style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <div className="border p-3" style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '450px' }}>
                                                        <img
                                                            src={imageDataUrlTtp}
                                                            alt={`Zoomed ${indexPreviewTtp}`}
                                                            style={{ maxWidth: '100%', maxHeight: '106%' }}
                                                            onClick={() => OpenPreviewDobel('ttp')}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ width: '5%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className={`${styles.closeButtonDetailDragable}`}
                                    onClick={() => {
                                        setIsOpenPreviewDobel(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                </button>
                            </div>
                        </div>
                    </Draggable>
                </>
            ) : null}
            {/* ============================================================ */}

            {isOpenPreviewDobelTtd === true ? (
                <>
                    <Draggable>
                        <div className={`${styles.modalDetailDragable}`} style={modalPositionFilePendukungTTD}>
                            <div className="overflow-auto" style={{ maxHeight: '600px' }}>
                                <div style={{ marginBottom: 21 }}>
                                    <span style={{ fontSize: 14, fontWeight: 'bold' }}>
                                        Spesimen TTD Customer : <span style={{ fontWeight: 'bold', color: 'red' }}>{listStateData.noTtp}</span>
                                    </span>
                                </div>
                                <hr style={{ border: '1px solid gray' }} />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '5px' }} tabIndex={1}>
                                    <div className="e-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                        <div style={{ width: '100%', height: '50%', marginTop: '5px' }}>
                                            <div className="flex" style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <div className="border p-3" style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '450px' }}>
                                                        <img
                                                            src={imageDataUrlTtd}
                                                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                            alt={`Zoomed ${indexPreviewTtd}`}
                                                            onClick={() => OpenPreviewDobel('ttd')}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ width: '5%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className={`${styles.closeButtonDetailDragable}`}
                                    onClick={() => {
                                        setIsOpenPreviewDobelTtd(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                </button>
                            </div>
                        </div>
                    </Draggable>
                </>
            ) : null}
            {/* ============================================================ */}

            <DialogTtp
                userid={userid}
                kode_entitas={kode_entitas}
                entitas={entitas}
                isOpen={listStateData.plagEditDialogTtp}
                onClose={() => {
                    setListStateData((prevState: any) => ({
                        ...prevState,
                        plagEditDialogTtp: false,
                    }));
                }}
                dataMasterList={dataMasterList}
                token={token}
                recordsDataAlokasiDana={recordsDataAlokasiDana}
                recordsDataFaktur={recordsDataFakturRef.current}
                refreshData={vRefreshData.current}
                setListStateData={setListStateData}
                listStateData={listStateData}
            />

            <DialogDaftarMutasi
                setListStateData={setListStateData}
                listStateData={listStateData}
                refreshData={vRefreshData.current}
                token={token}
                clickDaftarDetailMutasi={(currentDaftarBarang: any) => clickDaftarDetailMutasi(currentDaftarBarang)}
            />

            <Modal isOpen={isModalOpen} progress={progress} isError={isError} message={message} />

            {/* ============================================================ */}
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
                    // onClick={() => HandleCloseZoom(setIsOpenPreview)}
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
                                transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px) rotate(${rotationAngle}deg)`,
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
                            cssClass="e-primary e-small"
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                marginTop: '-10px',
                            }}
                        >
                            <span className="e-icons e-undo" style={{ fontSize: '32px' }} onClick={handleRotateLeft}></span>
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass="e-primary e-small"
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                marginTop: '-20px',
                            }}
                        >
                            <span className="e-icons e-redo" style={{ fontSize: '32px' }} onClick={handleRotateRight}></span>
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
                            <span className="e-icons e-close" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={() => HandleCloseZoom(setIsOpenPreview)}></span>
                        </ButtonComponent>
                    </div>
                </div>
            )}
        </div>
    );
};

// export { getServerSideProps };

export default PostingTtpList;
