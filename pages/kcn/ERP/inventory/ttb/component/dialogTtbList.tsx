import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);

import * as ReactDom from 'react-dom';
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Pakai fungsi dari routines ============================
import { DiskonByCalc, FillFromSQL, appBackdate, fetchPreferensi, frmNumber, generateNU, generateNUDivisi } from '@/utils/routines';
//========================================================

import { useRouter } from 'next/router';

import styles from './spp.module.css';
import stylesTtb from '../ttblist.module.css';
import {
    HandelCatatan,
    HandleAlasanChange,
    HandleCaraPengiriman,
    HandleCloseZoom,
    HandleGudangChange,
    HandleModalChange,
    HandleModaliconChange,
    HandleRemoveRowsOtomatis,
    HandleSelectedData,
    HandleZoomIn,
    HandleZoomOut,
    OpenPreview,
    OpenPreviewInsert,
    refAlasan,
    refKodeGudang,
    refNamaGudang,
} from '../functional/fungsiFormTtb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faPlay,
    faSave,
    faBackward,
    faCancel,
    faFileArchive,
    faCamera,
    faTimes,
    faSearchPlus,
    faSearchMinus,
    faEraser,
    faTrashCan,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { GetDlgDetailSjItem, GetListEditTtb, GetMasterAlasan, GetTbImages, GudangTtb, LoadImages, PatchUpdateTtb, PostSimpanAudit, PostSimpanTempTtb, PostSimpanTtb } from '../model/api';
import { ReCalcDataNodesTtb } from '../functional/reCalc';
import {
    FetchDataListCust,
    FilterCustomer,
    HandleSearchNamaBarang,
    HandleSearchNamaCust,
    HandleSearchNamaSales,
    HandleSearchNoBarang,
    HandleSearchNoCust,
    HandleSelectedDataCustomer,
    RefreshDetailSjItem,
    refNamaCust,
    refKodeCust,
    refKodeRelasi,
    DetailBarangEdit,
    DetailBarangDelete,
    DetailBarangDeleteAll,
    RefreshDetailSj,
    HandleSearchNoDok,
    HandleSearchNamaRelasi,
    HandleSelectedDataCustomer1,
    DetailBarangDeleteKosong,
} from '../functional/fungsiFormTtbList';
import DialogDaftarSjItemTtb from '../modal/DialogDaftarSjItemTtb';
import DialogDaftarSjTtb from '../modal/DialogDaftarSjTtb';
import DialogDaftarCustomerTtb from '../modal/DialogDaftarCustomerTtb';
import JSZip from 'jszip';
import ImageWithDeleteButton from './ImageWithDeleteButton';
import Flatpickr from 'react-flatpickr';
import { cekDataDiDatabase } from '@/utils/global/fungsi';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';

enableRipple(true);

interface dialogTtbListProps {
    userid: any;
    kode_entitas: any;
    entitas: any;
    masterKodeDokumen: any;
    masterDataState: any;
    masterBarangProduksi: any;
    isOpen: boolean;
    onClose: any;
    onRefresh: any;
    kode_user: any;
    refreshKey: any;
    onOpen: any;
    token: any;
    valueAppBackdate: boolean;
}

const DialogTtbList: React.FC<dialogTtbListProps> = ({
    userid,
    kode_entitas,
    entitas,
    masterKodeDokumen,
    masterDataState,
    masterBarangProduksi,
    isOpen,
    onClose,
    onRefresh,
    kode_user,
    refreshKey,
    onOpen,
    token,
    valueAppBackdate,
}: dialogTtbListProps) => {
    const router = useRouter();
    let imageUrls: any;

    // Loading data indicator
    const [showLoader, setShowLoader] = useState(true);
    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();

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

    const [refreshKeyAlasan1, setRefreshKeyAlasan1] = useState(0);
    const [refreshKeyGudang1, setRefreshKeyGudang1] = useState(0);

    const closeDialogTtbList = async () => {
        if (masterDataState === 'BARU') {
            await clearAllImages();
        } else {
            await clearAllImages();
        }
        await ReCallRefreshModal();
        await setTimeout(() => {
            onRefresh();
        }, 100);
        await onClose();
        setRefreshKeyAlasan1((prevKey: any) => prevKey + 1);
        setRefreshKeyGudang1((prevKey: any) => prevKey + 1);
        vFilterSaveLoad.current += 1;
    };

    const ReCallRefreshModal = () => {
        const gudang = document.getElementById('gudang12') as HTMLInputElement;
        if (gudang) {
            gudang.value = '';
        }

        const alasan = document.getElementById('alasan') as HTMLInputElement;
        if (alasan) {
            alasan.value = '';
        }

        setNoTtbValue('<Baru>');
        setKodeTtb('');
        setDate1(new Date());
        setMasterTglTtb(moment());
        setTglTtbEdit('');
        setCustSelected('');
        refNamaCust.current = null;
        setCustSelectedKode('');
        setSelectedOptionGudang('');
        setSelectedOptionKodeGudang('');
        refKodeGudang.current = '';
        refNamaGudang.current = '';
        setSelectedOptionAlasan('');
        refAlasan.current = '';
        setDataHeader((prevState) => ({
            ...prevState,
            noReff: '',
            via: '',
            pengemudi: '',
            nopol: '',
            statusFaktur: '',
            noFaktur: '',
            tglFaktur: '',
            kodePajak: '',
            include: '',
        }));

        setCatatanValue('');
        setDivisiPenjualan('');
        setSelectedCaraPengiriman('Dikirim');

        setDataTotalHeader((prevState) => ({
            ...prevState,
            jumlahMu: 0,
            totalDiskonMu: 0,
            totalJumlahPajak: 0,
        }));
        setTotalBarang(0);

        setDataBarang((state: any) => ({
            ...state,
            nodes: [],
        }));
    };

    // Base URL API Data
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [TotalRecords, setTotalRecords] = useState(0);
    const [TotalBarang, setTotalBarang] = useState(0);

    //======= Setting tampilan sweet alert  =========
    const swalDialog = swal.mixin({
        customClass: {
            confirmButton: 'btn btn-primary btn-sm',
            cancelButton: 'btn btn-dark btn-sm ltr:mr-3 rtl:ml-3',
            popup: 'sweet-alerts',
        },
        buttonsStyling: false,
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

    const swalPopUp = swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
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

    //======== Setting hint / tooltip untuk grid Data Barang =========
    let tooltipDetailBarang: Tooltip | any;
    const columnDetailBarang: Object = {
        'No.': 'Nomor urut data barang',
        'No. Barang': 'Nomor atau kode barang',
        'Nama Barang': 'Nama barang',
        Satuan: 'Satuan barang',
        Kuantitas: 'Jumlah kuantitas yang diminta',
        Keterangan: 'Keterangan atau diskripsi nama barang',
    };
    const beforeRenderDetailBarang = (args: TooltipEventArgs) => {
        const description = (columnDetailBarang as any)[(args as any).target.innerText];
        if (description) {
            tooltipDetailBarang.content = description;
        }
    };
    //==============================================================

    //========== Inisialisasi modal dialog data ====================
    // let dialogDaftarSjItem: Dialog | any;
    // let dialogDaftarSj: Dialog | any;

    const [dialogDaftarSjItemVisible, setDialogDaftarSjItemVisible] = useState(false);
    const [dialogDaftarSjVisible, setDialogDaftarSjVisible] = useState(false);

    //======================= State Data Master ====================
    const [masterTglTtb, setMasterTglTtb] = useState<moment.Moment>(moment());
    const [masterKeterangan, setMasterKeterangan] = useState<any>(null);

    let buttonInputData: ButtonPropsModel[];
    buttonInputData = [
        {
            buttonModel: {
                content: 'Tutup',
                cssClass: 'e-danger e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: closeDialogTtbList,
        },
    ];
    //==============================================================
    type NodesDataBarang = {
        id: any;
        no_sj: any;
        no_barang: any;
        nama_barang: any;
        satuan: any;
        kuantitas: any;
        kodecabang: any;
        keterangan: any;

        // Tambahan
        kode_sj: any;
        tgl_sj: any;
        id_sj: any;
        kode_do: any;
        id_do: any;
        kode_so: any;
        id_so: any;
        kode_item: any;
        sat_std: any;
        jml_mak: any;
        kode_mu: any;
        kurs: any;
        kurs_pajak: any;
        harga_mu: any;
        diskon: any;
        diskon_mu: any;
        potongan_mu: any;
        kode_pajak: any;
        pajak: any;
        include: any;
        hpp: any;
        pajak_mu: any;
        qty: any;
        qty_std: any;
        jumlah_mu: any;
        kode_dept: any;
        kode_kerja: any;
        kode_ttb: any;
        nilai_pajak: any;
        total_diskon_mu: any;
        nettoRp: any;
        lunas_mu: any;
        memo_mu: any;
        uang_muka_mu: any;
        netto_mu: any;
        no_faktur: any;
    };

    const [dataBarang, setDataBarang] = useState<{ nodes: NodesDataBarang[] }>({ nodes: [] });
    // const [dataBarang, setDataBarang] = useState<[]>([]);
    const [IdDokumen, setIdDokumen] = useState(0);
    const [stateBrowse, setStateBrowse] = useState<boolean>(true);

    // let gridTtbList: Grid | any;
    const gridTtbListRef = useRef<GridComponent>(null);
    let tabTtbList: Tab | any;
    let setFocus: any;
    // let gridDaftarBarangJadi: Grid | any;
    // let gridDaftarSjItem: Grid | any;
    // let gridDaftarSj: Grid | any;

    //======= Disable hari minggu di calendar ========
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    let textareaObj: any;
    function onCreateMultiline(): void {
        textareaObj.addAttributes({ rows: 1 });
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = '60px'; //textareaObj.respectiveElement.scrollHeight + 'px';
    }

    // Untuk daftar barang =============================================================
    const [dataDetailSjItem, setDataDetailSjItem] = useState<any[]>([]);
    const [dataDetailSj, setDataDetailSj] = useState<any[]>([]);
    let currentDaftarBarang: any[] = [];
    const [searchNoItem, setSearchNoItem] = useState('');
    const [searchNamaItem, setSearchNamaItem] = useState('');
    const [searchNoDokumen, setSearchNoDokumen] = useState('');
    const [searchNamaRelasi, setSearchNamaRealasi] = useState('');

    //=============================================================================
    //=============================================================================

    // DATA TERBARU
    const [date1, setDate1] = useState<any>(new Date()); // Tanggal TTB
    const [noTtbValue, setNoTtbValue] = useState<any>('');

    // Customer
    const [custSelected, setCustSelected] = useState<any>('');
    const [custSelectedKode, setCustSelectedKode] = useState<any>('');
    const [changeNumber, setChangeNumber] = useState(0);
    const [handleNamaCust, setHandleNamaCust] = useState('');
    const [modal1, setModal1] = useState(false); //customer
    const [selectedKodeRelasi, setSelectedKodeRelasi] = useState<any>('');
    // End

    const [modal2, setModal2] = useState(false); // Daftar SJ Per Item
    const [selectedCaraPengiriman, setSelectedCaraPengiriman] = useState<any>('Dikirim');
    interface CheckboxItem {
        alasan?: string; // tambahkan tipe untuk properti 'alasan' jika diperlukan
    }
    const [checkboxDataMasterAlasan, setCheckboxDataMasterAlasan] = useState<CheckboxItem[]>([]);
    const [selectedOptionAlasan, setSelectedOptionAlasan] = useState<string>('');
    const [kodeTtb, setKodeTtb] = useState<any>('');
    const [tglTtbEdit, setTglTtbEdit] = useState('');
    const [dataTotalHeader, setDataTotalHeader] = useState({ jumlahMu: 0, totalDiskonMu: 0, totalJumlahPajak: 0, nettoRp: 0 });
    const [catatanValue, setCatatanValue] = useState('');

    const masterDataStateRef = useRef('');
    const nettoRpRef = useRef(0);
    const jumlahMuRef = useRef(0);
    const totalDiskonMuRef = useRef(0);
    const totalJumlahPajakRef = useRef(0);
    type ExtractedFile = {
        imageUrl: string;
        fileName: string;
    };
    const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
    const [selectedNamaFilesExt1, setNamaFilesExt1] = useState('');

    // Fungsi untuk mengonversi base64 ke Blob
    function base64ToBlob(base64: any, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    // Fungsi untuk membuat objek File dari Blob
    function blobToFile(blob: any, fileName: any) {
        blob.lastModifiedDate = new Date();
        return new File([blob], fileName, { type: blob.type, lastModified: blob.lastModifiedDate });
    }

    //======== Datasource =========
    const refreshDatasource = async () => {
        masterDataStateRef.current = masterDataState;
        setShowLoader(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                if (masterDataState == 'BARU') {
                    setDate1(moment());
                    setNoTtbValue('<Baru>');

                    const masterAlasan: any[] = await GetMasterAlasan(kode_entitas);
                    setCheckboxDataMasterAlasan(masterAlasan);

                    // const gudangApi = await FillFromSQL(kode_entitas, 'gudang', kode_user)
                    //     .then((result) => {
                    //         setApiResponseGudang(result);
                    //         // alert(result);
                    //     })
                    //     .catch((error) => {
                    //         console.error('Error:', error);
                    //     });

                    const gudangTtb = await GudangTtb(kode_entitas, 'gudang_ttb', userid.toUpperCase(), entitas, kode_user);
                    setApiResponseGudang(gudangTtb);

                    await fetchPreferensi(kode_entitas, apiUrl)
                        .then((result) => {
                            setDataHeader((prevState: any) => ({
                                ...prevState,
                                kodeAkun1: result[0].kode_akun_persediaan,
                                kodeAkun2: result[0].kode_akun_hpp,
                            }));
                            // setSelectedOptionGudang(result[0].nama_gudang);
                            // setSelectedOptionKodeGudang(result[0].kode_gudang);
                            // refKodeGudang.current = result[0].kode_gudang;
                            // refNamaGudang.current = result[0].nama_gudang;

                            // const gudang = document.getElementById('gudang12') as HTMLInputElement;
                            // if (gudang) {
                            //     gudang.value = result[0].nama_gudang;
                            // }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                } else if (masterDataState === 'EDIT' || masterDataState === 'APPROVAL') {
                    const responsData = await GetListEditTtb(kode_entitas, masterKodeDokumen, 'baru');

                    if (responsData.status === true) {
                        // const responseDataImage = await GetTbImages(kode_entitas, responsData.data[0].kode_ttb);
                        setNoTtbValue(responsData.data[0].no_ttb);
                        setKodeTtb(responsData.data[0].kode_ttb);
                        setDate1(responsData.data[0].tgl_ttb);
                        setMasterTglTtb(moment(responsData.data[0].tgl_ttb));
                        setTglTtbEdit(responsData.data[0].tgl_ttb);
                        setCustSelected(responsData.data[0].nama_relasi);
                        refNamaCust.current = responsData.data[0].nama_relasi;
                        setCustSelectedKode(responsData.data[0].kode_cust);
                        // refKodeCust.current = responsData.data[0].kode_cust;
                        setSelectedOptionGudang(responsData.data[0].nama_gudang);
                        setSelectedOptionKodeGudang(responsData.data[0].kode_gudang);
                        refKodeGudang.current = responsData.data[0].kode_gudang;
                        refNamaGudang.current = responsData.data[0].nama_gudang;
                        setSelectedOptionAlasan(responsData.data[0].alasan);
                        refAlasan.current = responsData.data[0].alasan;
                        setDataHeader((prevState) => ({
                            ...prevState,
                            noReff: responsData.data[0].no_reff,
                            via: responsData.data[0].via,
                            pengemudi: responsData.data[0].pengemudi,
                            nopol: responsData.data[0].nopol,
                            statusFaktur: responsData.data[0].status_faktur,
                            noFaktur: responsData.data[0].no_faktur,
                            tglFaktur: responsData.data[0].tgl_faktur,
                            kodePajak: responsData.data[0].kode_pajak,
                            include: responsData.data[0].include,
                        }));

                        setCatatanValue(responsData.data[0].keterangan);
                        setDivisiPenjualan(responsData.data[0].kode_jual);
                        setSelectedCaraPengiriman(responsData.data[0].dokumen);

                        setDataTotalHeader((prevState) => ({
                            ...prevState,
                            jumlahMu: responsData.data[0].total_rp,
                            totalDiskonMu: responsData.data[0].total_diskon_rp,
                            totalJumlahPajak: responsData.data[0].total_pajak_rp,
                            nettoRp: responsData.data[0].netto_rp,
                        }));
                        nettoRpRef.current = parseFloat(responsData.data[0].netto_rp);
                        jumlahMuRef.current = parseFloat(responsData.data[0].total_rp);
                        totalDiskonMuRef.current = parseFloat(responsData.data[0].total_diskon_rp);
                        totalJumlahPajakRef.current = parseFloat(responsData.data[0].total_pajak_rp);
                        setTotalBarang(responsData.data.length);

                        const gudang = document.getElementById('gudang12') as HTMLInputElement;
                        if (gudang) {
                            gudang.value = responsData.data[0].nama_gudang;
                        }
                        const alasan = document.getElementById('alasan') as HTMLInputElement;
                        if (alasan) {
                            alasan.value = responsData.data[0].alasan;
                        }

                        setSelectedFile('update');

                        Promise.all(
                            responsData.data.map((item: any) => {
                                return {
                                    id: item.id_ttb,
                                    no_sj: item.no_sj,
                                    no_barang: item.no_item,
                                    nama_barang: item.diskripsi,
                                    satuan: item.satuan,
                                    kuantitas: item.qty.toFixed(2),
                                    kodecabang: '',
                                    keterangan: item.ket,

                                    // Tambahan
                                    kode_sj: item.kode_sj,
                                    tgl_sj: item.tgl_sj,
                                    id_sj: item.id_sj,
                                    kode_do: item.kode_do,
                                    id_do: item.id_do,
                                    kode_so: item.kode_so,
                                    id_so: item.id_so,
                                    kode_item: item.kode_item,
                                    sat_std: item.sat_std,
                                    jml_mak: item.jml_mak.toFixed(2),
                                    kode_mu: item.kode_mu,
                                    kurs: item.kurs,
                                    kurs_pajak: item.kurs_pajak,
                                    harga_mu: item.harga_mu,
                                    diskon: item.diskon,
                                    diskon_mu: parseFloat(item.diskon_mu),
                                    potongan_mu: item.potongan_mu,
                                    kode_pajak: item.kode_pajak,
                                    pajak: item.pajak,
                                    include: item.include,
                                    hpp: item.hpp,
                                    pajak_mu: item.pajak_mu,
                                    qty: parseFloat(item.qty).toFixed(2),
                                    qty_std: item.qty_std.toFixed(2),
                                    jumlah_mu: item.jumlah_mu,
                                    kode_dept: item.kode_dept,
                                    kode_kerja: item.kode_kerja,
                                    kode_ttb: item.kode_ttb,
                                    nilai_pajak: 0,
                                    total_diskon_mu: 0,
                                    nettoRp: 0,
                                };
                            })
                        ).then((newData) => {
                            setDataBarang((state: any) => {
                                const existingNodes = state.nodes.filter((node: any) => node.kode_ttb === masterKodeDokumen);
                                const newNodes = [...existingNodes, ...newData.filter((data: any) => data !== null)];
                                return { ...state, nodes: newNodes }; // Memperbarui nodes dengan data yang diperbarui
                            });
                        });
                        await loadDataImage(responsData.data[0].kode_ttb);
                    }
                } else {
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (kode_entitas == null || kode_entitas == '') {
            withReactContent(swalDialog).fire({
                title: `<p style="font-size:12px">Sesi login telah habis, silahkan login kembali.</p>`,
                icon: 'error',
                width: '360px',
                heightAuto: true,
            });

            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        } else {
            setShowLoader(false);
        }
    };

    const vFilterSaveLoad = useRef(0);

    useEffect(() => {
        refreshDatasource();
    }, [refreshKey]);

    // ================================== MODAL CUSTOMER =================
    const [dsDaftarCustomer, setDsDaftarCustomer] = useState<any[]>([]);
    let currentDaftarCustomer: any[] = [];
    let tipe: any;

    const [searchNoCust, setSearchNoCust] = useState('');
    const [searchNamaCust, setSearchNamaCust] = useState('');
    const [searchNamaSales, setSearchNamaSales] = useState('');
    const [activeSearchDaftarCustomer, setActiveSearchDaftarCustomer] = useState('namaCust');

    const [searchKeywordNoCust, setSearchKeywordNoCust] = useState<string>('');
    const [searchKeywordNamaCust, setSearchKeywordNamaCust] = useState<string>('');
    const [searchKeywordNamaSales, setSearchKeywordNamaSales] = useState<string>('');
    const [filteredData, setFilteredData] = useState([]);

    // END
    //=================================================================

    // ======================= Master Gudang ==========================
    const [apiResponseGudang, setApiResponseGudang] = useState<any[]>([]);
    const [selectedOptionGudang, setSelectedOptionGudang] = useState<string>('');
    const [selectedOptionKodeGudang, setSelectedOptionKodeGudang] = useState<string>('');

    //=================================================================

    let radioInstanceDikirim: RadioButtonComponent;
    let radioInstanceDiambil: RadioButtonComponent;

    function changeCaraPengirimanDikirim(): void {
        setSelectedCaraPengiriman(radioInstanceDikirim.label);
    }

    function changeCaraPengirimanDiambil(): void {
        setSelectedCaraPengiriman(radioInstanceDiambil.label);
    }
    //

    const filterNoSjKosong = useRef('');
    const handleDetailBarang_Add = async (tipe: any) => {
        if (tipe !== 'addTombol') {
            const id = dataBarang.nodes.length + 1;
            // setIdDokumen(id);
            setIdDokumen(id);
            filterNoSjKosong.current = 'noSj';
            const totalLine = dataBarang.nodes.length;
            const newNode = {
                id_ttb: id,
                id: id,
                no_sj: '',
                no_barang: '',
                nama_barang: '',
                satuan: '',
                kuantitas: 0,
                kodecabang: '',
                keterangan: '',

                // Tambahan
                kode_sj: '',
                tgl_sj: moment().format('YYYY-MM-DD HH:mm:ss'),
                id_sj: 0,
                kode_do: '',
                id_do: 0,
                kode_so: '',
                id_so: 0,
                kode_item: '',
                sat_std: '',
                jml_mak: 0,
                kode_mu: '',
                kurs: 0,
                kurs_pajak: 0,
                harga_mu: 0,
                diskon: 0,
                diskon_mu: 0,
                potongan_mu: 0,
                kode_pajak: 0,
                pajak: 0,
                include: '',
                hpp: 0,
                pajak_mu: 0,
                qty: 0,
                qty_std: 0,
                jumlah_mu: 0,
                kode_dept: '',
                kode_kerja: '',
                nilai_pajak: 0,
                total_diskon_mu: 0,
                nettoRp: 0,
            };

            const hasEmptyFields = dataBarang.nodes.some((row: { no_sj: string }) => row.no_sj === '');

            if (!hasEmptyFields) {
                // setDataBarang((state: any) => ({
                //     ...state,
                //     nodes: state.nodes.concat(newNode),
                // }));
                gridTtbListRef.current?.addRecord();
            } else {
                // alert('Harap isi nama barang sebelum tambah data');
                document.getElementById('gridTtbList')?.focus();
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px">Harap isi no SJ sebelum tambah data</p>',
                    width: '100%',
                    target: '#dialogTtbList',
                });
            }
        } else {
            gridTtbListRef.current?.addRecord();
        }
    };

    //================ Editing template untuk kolom grid detail barang ==================
    const editTemplateNoSj = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.no_item} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    FilterCustomer(
                                        refNamaCust.current,
                                        swalDialog,
                                        dataBarang,
                                        custSelected,
                                        setHandleNamaCust,
                                        setModal1,
                                        DialogDaftarSjItem,
                                        kode_entitas,
                                        setDsDaftarCustomer,
                                        setDataBarang
                                    );
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const DialogDaftarSjItem = async () => {
        await RefreshDetailSjItem(kode_entitas, custSelectedKode, refKodeCust.current, setDataDetailSjItem, entitas);
        await setDialogDaftarSjItemVisible(true);
    };

    const DialogDaftarSj = async () => {
        // if ((refNamaCust.current === '' || refNamaCust.current === null) && (refKodeCust.current === '' || refKodeCust.current === null)) {
        //     withReactContent(swalDialog)
        //         .fire({
        //             icon: 'error',
        //             title: '<p style="font-size:12px">Customer belum di isi</p>',
        //             width: '20%',
        //             target: '#dialogTtbList',
        //             confirmButtonText: 'Ok',
        //             allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
        //             allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
        //         })
        //         .then((result) => {
        //             if (result.isConfirmed) {
        //                 HandleModaliconChange('customer', dataBarang, custSelected, setHandleNamaCust, setModal1, kode_entitas, setDsDaftarCustomer, setDataBarang);
        //             }
        //         });
        // } else {
        //     await RefreshDetailSj(kode_entitas, 'all', refKodeCust.current, setDataDetailSj, entitas);
        //     await setDialogDaftarSjVisible(true);
        // }
        console.log('refKodeCust.current = ', refKodeCust.current);
        await RefreshDetailSj(kode_entitas, 'all', refKodeCust.current, setDataDetailSj, entitas);
        setDialogDaftarSjVisible(true);
    };

    const [filteredDataSjItem, setFilteredDataSjItem] = useState<any[]>([]);
    const [searchKeywordNoBarang, setSearchKeywordNoBarang] = useState<string>('');
    const [searchKeywordNamaBarang, setSearchKeywordNamaBarang] = useState<string>('');

    const [searchKeywordNoDok, setSearchKeywordNoDok] = useState<string>('');
    const [searchKeywordNamaRelasi, setSearchKeywordNamaRelasi] = useState<string>('');
    const [filteredDataSj, setFilteredDataSj] = useState<any[]>([]);

    const [dateGenerateNu, setDateGenerateNu] = useState<moment.Moment>(moment());
    const [divisiPenjualan, setDivisiPenjualan] = useState('');
    const [dataHeader, setDataHeader] = useState({
        noReff: '',
        via: '',
        pengemudi: '',
        nopol: '',
        statusFaktur: '',
        noFaktur: '',
        tglFaktur: '',
        kodePajak: '',
        kodeAkun1: '',
        kodeAkun2: '',
        include: '',
    });
    const setPilihDetailBarang = async (item: any) => {
        //Update data grid
        let totalJumlahMu = 0,
            totalDiskonMu = 0,
            totalJumlahPajak = 0;
        // const filterNoSj = dataBarang.nodes.some((row: { no_sj: string }) => row.no_sj === item[0].no_sj);
        const filterCondition = dataBarang.nodes.some(
            (row: { no_sj: string; no_barang: string; id_sj: any }) => row.no_sj === item[0].no_sj && row.no_barang === item[0].no_item && row.id_sj === item[0].id_sj
        );
        if (filterCondition === true) {
            withReactContent(swalDialog)
                .fire({
                    icon: 'error',
                    title: `<span style='color: gray; font-weight: bold;'>Barang ${item[0].diskripsi} untuk No. SJ ${item[0].no_sj} sudah ada.</span>`,
                    width: '20%',
                    target: '#dialogTtbList',
                    confirmButtonText: 'Ok',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        HandleRemoveRowsOtomatis(setDataBarang);
                    }
                });

            // return;
        } else {
            let netto_rp: any;
            await setDivisiPenjualan(item[0].kode_jual);
            await setDataHeader((prevState) => ({
                ...prevState,
                noReff: item[0].no_sj,
                via: item[0].via,
                pengemudi: item[0].pengemudi,
                nopol: item[0].nopol,
                statusFaktur: item[0].status_faktur,
                noFaktur: item[0].no_faktur,
                tglFaktur: item[0].tgl_faktur,
                kodePajak: item[0].kode_pajak,
                include: item[0].include,
            }));
            const result = await generateNUDivisi(kode_entitas, '', item[0].kode_jual, '08', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${item[0].kode_jual}`);
            setNoTtbValue(result);

            await setDataBarang((state: any) => {
                // Membuat objek baru dengan data baru
                const newIdDokumen = state.nodes.length + 1;
                const newItem = {
                    id: newIdDokumen,
                    no_sj: item[0].no_sj,
                    no_barang: item[0].no_item,
                    nama_barang: item[0].diskripsi,
                    satuan: item[0].satuan,
                    kuantitas: item[0].jml_mak.toFixed(2),
                    kodecabang: '',
                    keterangan: '',

                    // Tambahan
                    kode_sj: item[0].kode_sj,
                    tgl_sj: item[0].tgl_sj,
                    id_sj: item[0].id_sj,
                    kode_do: item[0].kode_do,
                    id_do: item[0].id_do,
                    kode_so: item[0].kode_so,
                    id_so: item[0].id_so,
                    kode_item: item[0].kode_item,
                    sat_std: item[0].sat_std,
                    jml_mak: item[0].jml_mak.toFixed(2),
                    kode_mu: item[0].kode_mu,
                    kurs: item[0].kurs,
                    kurs_pajak: item[0].kurs_pajak,
                    harga_mu: item[0].harga_mu,
                    diskon: item[0].diskon,
                    diskon_mu: item[0].diskon_mu,
                    potongan_mu: item[0].potongan_mu,
                    kode_pajak: item[0].kode_pajak,
                    pajak: item[0].pajak,
                    include: item[0].include,
                    hpp: item[0].hpp,
                    pajak_mu: item[0].pajak_mu,
                    qty: item[0].qty.toFixed(2),
                    qty_std: item[0].qty_std.toFixed(2),
                    jumlah_mu: item[0].jumlah_mu,
                    kode_dept: item[0].kode_dept,
                    kode_kerja: item[0].kode_kerja,
                    nilai_pajak: 0,
                    total_diskon_mu: 0,
                    nettoRp: 0,
                    lunas_mu: item[0].lunas_mu,
                    netto_mu: item[0].netto_mu,
                    memo_mu: item[0].memo_mu,
                    uang_muka_mu: item[0].uang_muka_mu,
                    no_faktur: item[0].no_faktur,
                };

                // Menghitung totalJumlahMu
                const totalJumlahMu =
                    state.nodes.reduce((acc: number, node: any) => {
                        // return acc + parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
                        return acc + (parseFloat(node.jumlah_mu) || 0);
                    }, 0) + parseFloat(newItem.jumlah_mu) || 0; //parseFloat(newItem.jumlah_mu.replace(/[^0-9.-]+/g, ''));

                // Menghitung totalDiskonMu
                const total_diskon_mu = newItem.diskon_mu * newItem.qty_std;
                const totalDiskonMu =
                    state.nodes.reduce((acc: number, node: any) => {
                        const diskon = node.qty * node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
                        return acc + diskon;
                    }, 0) + total_diskon_mu;

                // Menghitung totalJumlahPajak
                let pajak_mu1 = 0;
                if (dataHeader.include === 'N') {
                    pajak_mu1 = 0;
                    netto_rp = parseFloat(newItem.jumlah_mu);
                } else if (dataHeader.include === 'E') {
                    pajak_mu1 = (parseFloat(newItem.jumlah_mu) * (newItem.pajak === null || newItem.pajak === '' ? 0 : parseFloat(newItem.pajak))) / 100;
                    netto_rp = parseFloat(newItem.jumlah_mu) + pajak_mu1;
                } else if (dataHeader.include === 'I') {
                    netto_rp = parseFloat(newItem.jumlah_mu);
                    if ((newItem.pajak === null || newItem.pajak === '' ? 0 : parseFloat(newItem.pajak)) === 10) {
                        pajak_mu1 = parseFloat(newItem.jumlah_mu) - (parseFloat(newItem.jumlah_mu) * 100) / (100 + (newItem.pajak === null || newItem.pajak === '' ? 0 : parseFloat(newItem.pajak)));
                    } else if ((newItem.pajak === null || newItem.pajak === '' ? 0 : parseFloat(newItem.pajak)) === 11) {
                        pajak_mu1 = parseFloat(newItem.jumlah_mu) - (parseFloat(newItem.jumlah_mu) * 100) / (100 + (newItem.pajak === null || newItem.pajak === '' ? 0 : parseFloat(newItem.pajak)));
                    } else {
                        pajak_mu1 = 0;
                    }
                }
                const totalJumlahPajak =
                    state.nodes.reduce((acc: number, node: any) => {
                        let pajak = 0;
                        if (dataHeader.include === 'N') {
                            pajak = 0;
                            netto_rp = parseFloat(newItem.jumlah_mu);
                        } else if (dataHeader.include === 'E') {
                            pajak = (parseFloat(node.jumlah_mu) * (node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak))) / 100;
                            netto_rp = parseFloat(newItem.jumlah_mu) + pajak_mu1;
                        } else if (dataHeader.include === 'I') {
                            netto_rp = parseFloat(newItem.jumlah_mu);
                            if ((node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak)) === 10) {
                                pajak = parseFloat(node.jumlah_mu) - (parseFloat(node.jumlah_mu) * 100) / (100 + (node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak)));
                            } else if ((node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak)) === 11) {
                                pajak = parseFloat(node.jumlah_mu) - (parseFloat(node.jumlah_mu) * 100) / (100 + (node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak)));
                            } else {
                                pajak = 0;
                            }
                        }
                        return acc + pajak;
                    }, 0) + pajak_mu1;

                // Memperbarui data total header
                setDataTotalHeader((prevState) => ({
                    ...prevState,
                    jumlahMu: totalJumlahMu,
                    totalDiskonMu: totalDiskonMu,
                    totalJumlahPajak: totalJumlahPajak,
                    nettoRp: netto_rp,
                }));

                setTotalBarang(newIdDokumen);

                // Menambahkan item baru ke dalam array nodes
                return {
                    nodes: [...state.nodes, newItem],
                };
            });
        }

        // gridTtbList.startEdit();
    };

    const handleClickDaftarSj = async (dataItem: any) => {
        setCustSelected(dataItem[0].nama_relasi);
        setCustSelectedKode(dataItem[0].kode_cust);
        setSelectedKodeRelasi(dataItem[0].kode_relasi);
        const response = await GetDlgDetailSjItem(kode_entitas, dataItem[0].kode_cust, entitas);

        const filteredData = response.filter((item: { no_sj: string }) => {
            return item.no_sj === dataItem[0].no_dok;
        });
        let totalJumlahMu = 0,
            totalDiskonMu = 0,
            totalJumlahPajak = 0,
            netto_rp = 0,
            noId = 0;

        setTotalBarang(filteredData.length);
        await setDivisiPenjualan(dataItem[0].kode_jual);
        const result = await generateNUDivisi(kode_entitas, '', dataItem[0].kode_jual, '08', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${dataItem[0].kode_jual}`);
        setNoTtbValue(result);

        Promise.all(
            filteredData.map((item: any) => {
                const jumlah_mu1 =
                    (item.diskon_mu !== null || item.diskon_mu !== '') && item.qty_std > 0 && item.harga_mu > 0
                        ? item.qty_std * (item.harga_mu - item.potongan_mu - item.diskon_mu)
                        : item.harga_mu * item.qty_std;
                totalJumlahMu += jumlah_mu1;

                const total_diskon_mu =
                    item.qty_std === null || item.qty_std === '' ? 0 : parseFloat(item.qty_std) * (item.diskon_mu === null || item.diskon_mu === '' ? 0 : parseFloat(item.diskon_mu));
                totalDiskonMu += total_diskon_mu;

                let pajak_mu1 = 0;
                if (item.include === 'N') {
                    pajak_mu1 = 0;
                    netto_rp = jumlah_mu1;
                } else if (item.include === 'E') {
                    // pajak_mu1 = (parseFloat(item.jumlah_mu) * item.pajak === null || item.pajak === '' ? 0 : parseFloat(item.pajak)) / 100;
                    pajak_mu1 = (jumlah_mu1 * item.pajak === null || item.pajak === '' ? 0 : parseFloat(item.pajak)) / 100;
                    netto_rp = jumlah_mu1 + pajak_mu1;
                } else if (item.include === 'I') {
                    netto_rp = jumlah_mu1;
                    if ((item.pajak === null || item.pajak === '' ? 0 : parseFloat(item.pajak)) === 10) {
                        // pajak_mu = ((100 / 110) * jumlah_mu * nilai_pajak) / 100;
                        pajak_mu1 = jumlah_mu1 - (jumlah_mu1 * 100) / (100 + (item.pajak === null || item.pajak === '' ? 0 : parseFloat(item.pajak)));
                    } else if ((item.pajak === null || item.pajak === '' ? 0 : parseFloat(item.pajak)) === 11) {
                        // pajak_mu = ((100 / 111) * jumlah_mu * nilai_pajak) / 100;
                        pajak_mu1 = jumlah_mu1 - (jumlah_mu1 * 100) / (100 + (item.pajak === null || item.pajak === '' ? 0 : parseFloat(item.pajak)));
                    } else {
                        pajak_mu1 = 0;
                    }
                }
                totalJumlahPajak += pajak_mu1;
                noId += 1;

                return {
                    id: noId,
                    no_sj: item.no_sj,
                    no_barang: item.no_item,
                    nama_barang: item.diskripsi,
                    satuan: item.satuan,
                    kuantitas: item.jml_mak.toFixed(2),
                    kodecabang: '',
                    keterangan: '',

                    // Tambahan
                    kode_sj: item.kode_sj,
                    tgl_sj: item.tgl_sj,
                    id_sj: item.id_sj,
                    kode_do: item.kode_do,
                    id_do: item.id_do,
                    kode_so: item.kode_so,
                    id_so: item.id_so,
                    kode_item: item.kode_item,
                    sat_std: item.sat_std,
                    jml_mak: item.jml_mak.toFixed(2),
                    kode_mu: item.kode_mu,
                    kurs: item.kurs,
                    kurs_pajak: item.kurs_pajak,
                    harga_mu: item.harga_mu,
                    diskon: item.diskon,
                    diskon_mu: item.diskon_mu,
                    potongan_mu: item.potongan_mu,
                    kode_pajak: item.kode_pajak,
                    pajak: item.pajak,
                    include: item.include,
                    hpp: item.hpp,
                    // pajak_mu: item.pajak_mu,
                    pajak_mu: pajak_mu1,
                    qty: item.qty.toFixed(2),
                    qty_std: item.qty_std.toFixed(2),
                    // jumlah_mu: item.jumlah_mu,
                    jumlah_mu: jumlah_mu1,
                    kode_dept: item.kode_dept,
                    kode_kerja: item.kode_kerja,
                    nilai_pajak: 0,
                    total_diskon_mu: 0,
                    nettoRp: 0,
                    lunas_mu: item.lunas_mu,
                    netto_mu: item.netto_mu,
                    memo_mu: item.memo_mu,
                    uang_muka_mu: item.uang_muka_mu,
                    no_faktur: item.no_faktur,
                };
            })
        ).then((newData) => {
            setDataBarang((state: any) => {
                const existingNodes = state.nodes.filter((node: any) => node.no_sj === dataItem[0].no_dok);
                const filteredNewData = newData.filter((data: any) => !existingNodes.some((node: any) => node.no_barang === data.no_barang)); // Filter newData yang tidak memiliki no_barang yang sudah ada di state.nodes
                const newNodes = [...existingNodes, ...filteredNewData.filter((data: any) => data !== null)];
                return { ...state, nodes: newNodes }; // Memperbarui nodes dengan data yang diperbarui
            });

            setDataTotalHeader((prevState) => ({
                ...prevState,
                jumlahMu: totalJumlahMu,
                totalDiskonMu: totalDiskonMu,
                totalJumlahPajak: totalJumlahPajak,
                nettoRp: netto_rp,
            }));

            // Update data header dengan nilai dari filteredData
            if (filteredData.length > 0) {
                const firstItem = filteredData[0];
                setDataHeader((prevState) => ({
                    ...prevState,
                    noReff: firstItem.no_sj,
                    via: firstItem.via,
                    pengemudi: firstItem.pengemudi,
                    nopol: firstItem.nopol,
                    statusFaktur: firstItem.status_faktur,
                    noFaktur: firstItem.no_faktur,
                    tglFaktur: firstItem.tgl_faktur,
                    kodePajak: firstItem.kode_pajak,
                    include: firstItem.include,
                }));

                setCatatanValue(firstItem.keterangan);
                setSelectedOptionGudang(firstItem.nama_gudang);
                setSelectedOptionKodeGudang(firstItem.kode_gudang);
                refKodeGudang.current = firstItem.kode_gudang;
                refNamaGudang.current = firstItem.nama_gudang;
                const gudang = document.getElementById('gudang12') as HTMLInputElement;
                if (gudang) {
                    gudang.value = firstItem.nama_gudang;
                }
            }
        });
    };
    const filterShowDataBarangRef = useRef('');
    const calculateData = async (vQty: any) => {
        const id = parseFloat((document.getElementsByName('id')[0] as HTMLFormElement).value);

        await setDataBarang((state: any) => {
            const newNodes = state.nodes.map((node: any) => {
                if (node.id === id) {
                    // let qty_std = parseFloat((document.getElementsByName('kuantitas')[0] as HTMLFormElement).value);
                    // const kuantitas = document.getElementById('kuantitas') as HTMLInputElement;
                    let qty_std = parseFloat(vQty);
                    let jmlMak: any;
                    if (node.jml_mak === 0) {
                        if (masterDataStateRef.current === 'BARU') {
                            jmlMak = node.qty;
                        } else {
                            jmlMak = parseFloat(node.jml_mak) + parseFloat(node.qty);
                        }
                    } else {
                        if (masterDataStateRef.current === 'BARU') {
                            jmlMak = node.jml_mak;
                        } else {
                            jmlMak = parseFloat(node.jml_mak) + parseFloat(node.qty);
                        }
                    }
                    if (qty_std <= parseFloat(jmlMak)) {
                        let diskon_mu = node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
                        let harga_mu = node.harga_mu === null || node.harga_mu === '' ? 0 : parseFloat(node.harga_mu); //node.harga_btg
                        let potongan_mu = node.potongan_mu === null || node.potongan_mu === '' ? 0 : parseFloat(node.potongan_mu);
                        let nilai_pajak = node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak);
                        let diskon = node.diskon === null || node.diskon === '' ? '0' : node.diskon;

                        let diskonMu, jumlah_mu: any, pajak_mu: any, diskon_mu_tot: any, total_diskon_mu: any, netto_rp: any;
                        jumlah_mu = (diskon_mu !== null || diskon_mu !== '') && qty_std > 0 && harga_mu > 0 ? qty_std * (harga_mu - potongan_mu - diskon_mu) : harga_mu * qty_std;

                        if (node.include === 'N') {
                            pajak_mu = 0;
                            netto_rp = jumlah_mu;
                        } else if (node.include === 'E') {
                            pajak_mu = (jumlah_mu * nilai_pajak) / 100;
                            netto_rp = jumlah_mu + pajak_mu;
                        } else if (node.include === 'I') {
                            netto_rp = jumlah_mu;
                            if (nilai_pajak === 10) {
                                // pajak_mu = ((100 / 110) * jumlah_mu * nilai_pajak) / 100;
                                pajak_mu = jumlah_mu - (jumlah_mu * 100) / (100 + nilai_pajak);
                            } else if (nilai_pajak === 11) {
                                // pajak_mu = ((100 / 111) * jumlah_mu * nilai_pajak) / 100;
                                pajak_mu = jumlah_mu - (jumlah_mu * 100) / (100 + nilai_pajak);
                            } else {
                                pajak_mu = 0;
                            }
                        }
                        diskon_mu_tot = DiskonByCalc(diskon, qty_std * harga_mu);
                        total_diskon_mu = qty_std * diskon_mu;

                        return {
                            ...node,
                            jumlah_mu: jumlah_mu,
                            nilai_pajak: pajak_mu,
                            pajak_mu: pajak_mu,
                            total_diskon_mu: total_diskon_mu,
                            // total_diskon_mu: total_diskon_mu,
                            // diskon_mu: diskon_mu_tot,
                            diskon_mu: diskon_mu,
                            kuantitas: qty_std,
                            nettoRp: netto_rp,
                        };
                    } else {
                        // const show = showDialog(node.nama_barang, jmlMak, node.no_barang);

                        withReactContent(swalDialog).fire({
                            icon: 'error',
                            title: `<p style="font-size:12px">Jumlah maksimum "${node.nama_barang}" yang dapat di-retur kan adalah ${jmlMak} BTG</p>`,
                            width: '20%',
                            target: '#dialogTtbList',
                            confirmButtonText: 'Ok',
                            allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                            allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                        });
                        let qty_std;
                        qty_std = parseFloat(node.qty);
                        let diskon_mu = node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
                        let harga_mu = node.harga_mu === null || node.harga_mu === '' ? 0 : parseFloat(node.harga_mu); //node.harga_btg
                        let potongan_mu = node.potongan_mu === null || node.potongan_mu === '' ? 0 : parseFloat(node.potongan_mu);
                        let nilai_pajak = node.nilai_pajak === null || node.nilai_pajak === '' ? 0 : parseFloat(node.pajak);
                        let diskon = node.diskon === null || node.diskon === '' ? '0' : node.diskon;

                        // Perhitungan
                        let diskonMu, jumlah_mu: any, pajak_mu: any, diskon_mu_tot: any, total_diskon_mu: any, netto_rp: any;
                        jumlah_mu = (diskon_mu !== null || diskon_mu !== '') && qty_std > 0 && harga_mu > 0 ? qty_std * (harga_mu - potongan_mu - diskon_mu) : harga_mu * qty_std;
                        if (node.include === 'N') {
                            pajak_mu = 0;
                            netto_rp = jumlah_mu;
                        } else if (node.include === 'E') {
                            pajak_mu = (jumlah_mu * nilai_pajak) / 100;
                            netto_rp = jumlah_mu + pajak_mu;
                        } else if (node.include === 'I') {
                            netto_rp = jumlah_mu;
                            if (nilai_pajak === 10) {
                                // pajak_mu = ((100 / 110) * jumlah_mu * nilai_pajak) / 100;
                                pajak_mu = jumlah_mu - (jumlah_mu * 100) / (100 + nilai_pajak);
                            } else if (nilai_pajak === 11) {
                                // pajak_mu = ((100 / 111) * jumlah_mu * nilai_pajak) / 100;
                                pajak_mu = jumlah_mu - (jumlah_mu * 100) / (100 + nilai_pajak);
                            } else {
                                pajak_mu = 0;
                            }
                        }
                        diskon_mu_tot = DiskonByCalc(diskon, qty_std * harga_mu);
                        total_diskon_mu = qty_std * diskon_mu;
                        // END

                        const kuantitas = document.getElementById('kuantitas' + node.id) as HTMLInputElement;
                        if (kuantitas) {
                            kuantitas.value = node.qty_std;
                        }

                        return {
                            ...node,
                            jumlah_mu: jumlah_mu,
                            nilai_pajak: pajak_mu,
                            pajak_mu: pajak_mu,
                            total_diskon_mu: total_diskon_mu,
                            // diskon_mu: diskon_mu_tot,
                            diskon_mu: diskon_mu,
                            nettoRp: netto_rp,
                            kuantitas: vQty,
                        };
                    }
                } else {
                    return node;
                }
            });
            let totalJumlahMu = 0,
                totalDiskonMu = 0,
                totalNettoRp = 0,
                totalJumlahPajak = 0;

            totalJumlahMu = newNodes.reduce((acc: number, node: any) => {
                return acc + (parseFloat(node.jumlah_mu) || 0);
            }, 0);
            totalDiskonMu = newNodes.reduce((acc: number, node: any) => {
                return acc + (parseFloat(node.total_diskon_mu) || 0);
            }, 0);
            totalJumlahPajak = newNodes.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.nilai_pajak);
            }, 0);
            totalNettoRp = newNodes.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.nettoRp);
            }, 0);

            setDataTotalHeader((prevState) => ({
                ...prevState,
                jumlahMu: totalJumlahMu,
                totalDiskonMu: totalDiskonMu,
                totalJumlahPajak: totalJumlahPajak,
                nettoRp: totalNettoRp,
            }));

            return {
                nodes: newNodes,
            };
        });
    };
    // const qtyParams = { params: { format: 'N', decimals: 4, showClearButton: false, showSpinButton: false, change: calculateData } };
    const qtyParams = { params: { format: 'N2', decimals: 4, showClearButton: false, showSpinButton: false } };
    const formatFloat = { format: 'N2', decimals: 4 };

    const editTemplateSatuan = (args: any) => {
        const data: object = [{ satuan: 'KG' }, { satuan: 'BTG' }, { satuan: 'ROLL' }, { satuan: 'PCS' }, { satuan: 'SET' }, { satuan: 'LBR' }, , { satuan: 'DUS' }];
        const dataSatuan = new DataManager(data);
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DropDownListComponent
                    id="satuan_add"
                    name="satuan_add"
                    dataSource={dataSatuan}
                    fields={{ value: 'satuan', text: 'satuan' }}
                    floatLabelType="Never"
                    value={args.satuan}
                    onChange={() => {
                        setTimeout(function () {}, 100);
                    }}
                />
            </div>
        );
    };

    let alertShown = false;
    let itemsExceedingLimit: string[] = []; // Pastikan ini adalah array string
    let jumlahMak: string[] = []; // Pastikan ini adalah array string

    // Fungsi untuk memeriksa apakah ada tabIndex 0 dan 1
    function hasTabIndex0And1(selectedFiles: any[]): boolean {
        const tabIndexes = selectedFiles.map((item: any) => item.tabIndex);
        return tabIndexes.includes(0) && tabIndexes.includes(1);
    }

    // const saveDoc = (data: any) => {
    //     handleUploadZip('TB0000000229');
    // };

    const [disableTombolSimpan, setDisabledTombolSimpan] = useState(false);
    const saveDoc = async (data: any) => {
        startProgress();
        setDisabledTombolSimpan(true);
        // handleUploadZip(kodeTtb);
        if (gridTtbListRef.current) {
            (gridTtbListRef.current as any).endEdit(); // Menyimpan perubahan edit
        }

        dataBarang.nodes.map((node: any) => {
            let jmlMak: any;
            if (node.jml_mak === 0) {
                if (masterDataStateRef.current === 'BARU') {
                    jmlMak = node.qty;
                } else {
                    jmlMak = parseFloat(node.jml_mak) + parseFloat(node.qty);
                }
            } else {
                if (masterDataStateRef.current === 'BARU') {
                    jmlMak = node.jml_mak;
                } else {
                    jmlMak = parseFloat(node.jml_mak) + parseFloat(node.qty);
                }
            }
            // Menambahkan logika untuk mengecek apakah kuantitas lebih besar dari jml_mak
            if (node.kuantitas > parseFloat(jmlMak)) {
                alertShown = true;
                if (node.nama_barang) {
                    jumlahMak.push(jmlMak);
                    itemsExceedingLimit.push(node.nama_barang); // Asumsikan node.nama_barang adalah nama item
                } else {
                    jumlahMak.push(jmlMak);
                    itemsExceedingLimit.push('Nama barang tidak ditemukan'); // Pesan default jika nama barang tidak ditemukan
                }
            }
        });
        if (alertShown === true) {
            withReactContent(swalDialog).fire({
                icon: 'error',
                title: `<p style="font-size:12px">Jumlah maksimum "${itemsExceedingLimit[0]}" yang dapat di-retur kan adalah ${jumlahMak[0]} BTG</p>`,
                width: '20%',
                target: '#dialogTtbList',
                confirmButtonText: 'Ok',
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
            });
            return;
        }
        vFilterSaveLoad.current += 1;
        let jumlahItem, objectHeader: any;
        // let jsonData : any;
        // Dimatikan DULU karena coba menggunakan State
        let defaultNoTtb: any;
        if (masterDataState === 'BARU') {
            const result = await generateNUDivisi(kode_entitas, '', divisiPenjualan, '08', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${divisiPenjualan}`);
            defaultNoTtb = result;
        } else {
            defaultNoTtb = noTtbValue;
        }
        objectHeader = {
            kode_entitas: kode_entitas,
            include: dataHeader.include,
            kode: masterDataState,
            tipeDoc: 'baru',
            date1: date1,
            // defaultNoTtb: noTtbValue,
            defaultNoTtb: defaultNoTtb,
            userid: userid,
            masterDataState: masterDataState,
            divisiPenjualan: divisiPenjualan,
            kodeTtb: kodeTtb,
            kodeAkun1: dataHeader.kodeAkun1,
            kodeAkun2: dataHeader.kodeAkun2,
        };
        const hasEmptyNoSj = dataBarang.nodes.some((row: { no_sj: string }) => row.no_sj === '');
        const isBlocked = dataBarang.nodes.some((item: any) => item.lunas_mu > 0);
        const cekFaktur = dataBarang.nodes.some((item: any) => item.no_faktur === null);
        const newNodes = await dataBarang.nodes.map((node: any) => {
            let diskon_mu = node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
            let harga_mu = node.harga_mu === null || node.harga_mu === '' ? 0 : parseFloat(node.harga_mu); //node.harga_btg
            let potongan_mu = node.potongan_mu === null || node.potongan_mu === '' ? 0 : parseFloat(node.potongan_mu);
            let nilai_pajak = node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak);
            let diskon = node.diskon === null || node.diskon === '' ? '0' : node.diskon;

            let netto_mu = node.netto_mu === null || node.netto_mu === '' ? 0 : parseFloat(node.netto_mu);
            let lunas_mu = node.lunas_mu === null || node.lunas_mu === '' ? 0 : parseFloat(node.lunas_mu);
            let memo_mu = node.memo_mu === null || node.memo_mu === '' ? 0 : parseFloat(node.memo_mu);
            let uang_muka_mu = node.uang_muka_mu === null || node.uang_muka_mu === '' ? 0 : parseFloat(node.uang_muka_mu);

            let jumlah_mu = (diskon_mu !== null || diskon_mu !== '') && node.kuantitas > 0 && harga_mu > 0 ? node.kuantitas * (harga_mu - potongan_mu - diskon_mu) : harga_mu * node.kuantitas;
            let jumlah_faktur = netto_mu - lunas_mu + memo_mu + uang_muka_mu;
            return {
                ...node,
                jumlah_mu: jumlah_mu,
                jumlah_faktur: jumlah_faktur,
            };
        });

        const totalJumlahMu = newNodes.reduce((acc: number, node: any) => {
            return acc + (parseFloat(node.jumlah_mu) || 0);
        }, 0);
        const totalJumlahFaktur = newNodes.reduce((acc: number, node: any) => {
            return parseFloat(node.jumlah_faktur) || 0;
        }, 0);

        const invalidItem = dataBarang.nodes.find((item) => {
            // Membulatkan nilai kuantitas dan jml_mak menjadi 2 angka desimal
            const kuantitas = parseFloat(parseFloat(item.kuantitas).toFixed(2));
            const jmlMak = parseFloat(parseFloat(item.jml_mak).toFixed(2));

            // Membandingkan kuantitas dengan jml_mak yang sudah dibulatkan
            return kuantitas > jmlMak;
        });

        if (invalidItem) {
            // Jika ada item invalid, tampilkan pesan kesalahan
            withReactContent(swalDialog).fire({
                icon: 'error',
                title: `<p style="font-size:12px">Jumlah maksimum "${invalidItem.nama_barang}" yang dapat di-retur kan adalah ${invalidItem.jml_mak} BTG</p>`,
                width: '20%',
                target: '#dialogTtbList',
                confirmButtonText: 'Ok',
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
            });
            // return;
            return false; // Blok tindakan jika ada item invalid
        }

        // if (totalJumlahMu > totalJumlahFaktur) {
        //     withReactContent(swalToast).fire({
        //         icon: 'warning',
        //         title: `<p style="font-size:12px;color:white">Nilai TTB ${frmNumber(totalJumlahMu)} > Sisa Nilai ${frmNumber(totalJumlahFaktur)}, dari yang sudah di bayar</p>`,
        //         width: '100%',
        //         target: '#dialogTtbList',
        //         customClass: {
        //             popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
        //         },
        //     });
        //     return;
        // }

        if (catatanValue === '' || catatanValue === null || catatanValue === undefined) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white">Catatan harus diisi, Pastikan Anda menulis Catatan dengan benar</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        if (dataBarang.nodes.length <= 0 || hasEmptyNoSj === true) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white">Data barang belum diisi</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        if (custSelected === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white">Customer harus di pilih terlebih dahulu</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        if (refKodeGudang.current === '' && refNamaGudang.current === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white">Gudang harus di pilih terlebih dahulu</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        if (refAlasan.current === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white">Alasan harus di pilih terlebih dahulu</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        if (catatanValue.length < 10) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white">Catatan harus lebih dari 10 karakter</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        const isValidTabIndex = hasTabIndex0And1(selectedFiles);

        if (!isValidTabIndex) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white">Bukti Surat jalan dan Barang kembali harus di isi</p>',
                width: '100%',
                target: '#dialogTtbList',
                customClass: {
                    popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }
        const result = await ReCalcDataNodesTtb(dataBarang, objectHeader);
        const jsonData = {
            entitas: kode_entitas,
            kode_ttb: masterDataState === 'EDIT' || masterDataState === 'APPROVAL' ? kodeTtb : '',
            // no_ttb: noTtbValue,
            no_ttb: defaultNoTtb,
            tgl_ttb: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            tgl_buku: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            no_reff: dataHeader.noReff,
            dokumen: selectedCaraPengiriman,
            // kode_gudang: selectedOptionKodeGudang,
            kode_gudang: refKodeGudang.current,
            kode_cust: custSelectedKode,
            via: dataHeader.via,
            pengemudi: dataHeader.pengemudi,
            nopol: dataHeader.nopol,
            total_rp: result.jumlahMu,
            total_diskon_rp: result.totalDiskonMu,
            total_pajak_rp: result.totalJumlahPajak,
            netto_rp: result.nettoRp,
            keterangan: catatanValue,
            status: 'Terbuka',
            userid: userid.toUpperCase(),
            tgl_update: masterDataState === 'EDIT' || masterDataState === 'APPROVAL' ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            kode_jual: divisiPenjualan,
            // alasan: selectedOptionAlasan,
            alasan: refAlasan.current,
            status_faktur: dataHeader.statusFaktur,
            no_faktur: dataHeader.noFaktur,
            tgl_faktur: dataHeader.tglFaktur,
            jenis_ttb: '',
            detailTtb: result.detailJson,
            jurnal: result.detailJurnal,
        };
        jumlahItem = result.detailJson.length;
        // .then((result) => {
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // });
        var jsonString = JSON.stringify(jsonData);

        if (masterDataState === 'BARU') {
            if (cekFaktur === false) {
                if (totalJumlahMu > totalJumlahFaktur) {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white">Nilai TTB ${frmNumber(totalJumlahMu)} > Sisa Nilai ${frmNumber(totalJumlahFaktur)}, dari yang sudah di bayar</p>`,
                        width: '100%',
                        target: '#dialogTtbList',
                        customClass: {
                            popup: stylesTtb['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                }
            }

            const cekDataTtb = await cekDataDiDatabase(kode_entitas, 'tb_m_ttb_master', 'no_ttb', jsonData?.no_ttb, token);
            if (cekDataTtb) {
                // jsonData.no_ttb = defaultNoTtb;
                const generateCounter = await generateNUDivisi(kode_entitas, defaultNoTtb, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`);
                const generateNoDok = await generateNUDivisi(kode_entitas, '', divisiPenjualan, '08', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${divisiPenjualan}`);
                jsonData.no_ttb = generateNoDok;
            }

            // console.log('zzzzzzzzzzzzzz = ', jsonData);

            // const response = await PostSimpanTtb(jsonData);
            const response = await PostSimpanTempTtb(jsonData, token);
            const result = response.data;
            const status = result.status;
            const errormsg = result.serverMessage;
            if (status === true) {
                await handleUploadZip(result.kode_ttb);
                await generateNUDivisi(kode_entitas, result.data.no_ttb, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`);
                // await generateNUDivisi(kode_entitas, noTtbValue, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`);

                let bodyObject = {
                    kode_entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'TB',
                    kode_dokumen: result.kode_ttb,
                    // no_dokumen: noTtbValue,
                    // no_dokumen: defaultNoTtb,
                    no_dokumen: result.data.no_ttb,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'NEW',
                    diskripsi: `TTB item = ${jumlahItem} nilai transaksi = ${frmNumber(dataTotalHeader.jumlahMu)}`,
                    userid: userid.toUpperCase(), // userid login web
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                const auditResponse = await PostSimpanAudit(bodyObject);
                if (auditResponse.data.status === true) {
                    await generateNUDivisi(kode_entitas, result.data.no_ttb, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`);
                    endProgress();
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil disimpan.</p>',
                        width: '50%', // Atur lebar popup sesuai kebutuhan
                        target: '#dialogTtbList',
                        heightAuto: true,
                        timer: 2000,
                        showConfirmButton: false, // Menampilkan tombol konfirmasi
                        allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                        allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    await closeDialogTtbList();
                    setDisabledTombolSimpan(false);
                }
            } else {
                endProgress();
                withReactContent(swalDialog).fire({
                    title: ``,
                    html: errormsg,
                    icon: 'warning',
                    width: '20%',
                    heightAuto: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Ok',
                    target: '#dialogTtbList',
                });
                setDisabledTombolSimpan(false);
            }
        } else if (masterDataState === 'EDIT') {
            const response = await PatchUpdateTtb(jsonData);
            const result = response.data;
            const status = result.status;
            const errormsg = result.serverMessage;
            if (status === true) {
                await handleUploadZip(kodeTtb);
                let bodyObject = {
                    kode_entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'TB',
                    kode_dokumen: kodeTtb,
                    no_dokumen: noTtbValue,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'EDIT',
                    diskripsi: `TTB item = ${jumlahItem} nilai transaksi = ${frmNumber(dataTotalHeader.jumlahMu)}`,
                    userid: userid.toUpperCase(), // userid login web
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                const auditResponse = await PostSimpanAudit(bodyObject);
                if (auditResponse.data.status === true) {
                    endProgress();
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil di ${masterDataState}.</p>`,
                        width: '50%', // Atur lebar popup sesuai kebutuhan
                        target: '#dialogTtbList',
                        heightAuto: true,
                        timer: 2000,
                        showConfirmButton: false, // Menampilkan tombol konfirmasi
                        allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                        allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    await closeDialogTtbList();
                    setDisabledTombolSimpan(false);
                }
            } else {
                endProgress();
                withReactContent(swalDialog).fire({
                    title: ``,
                    html: errormsg,
                    icon: 'warning',
                    width: '20%',
                    heightAuto: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Ok',
                    target: '#dialogTtbList',
                });
                setDisabledTombolSimpan(false);
            }
        } else if (masterDataState === 'APPROVAL') {
            const cekDataTtb = await cekDataDiDatabase(kode_entitas, 'tb_m_ttb', 'no_ttb', jsonData?.no_ttb, token);
            if (cekDataTtb) {
                const generateNoDok = await generateNUDivisi(kode_entitas, '', divisiPenjualan, '08', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${divisiPenjualan}`);
                const generateCounter = await generateNUDivisi(kode_entitas, generateNoDok, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`);
                jsonData.no_ttb = generateNoDok;
            }

            const response = await PostSimpanTtb(jsonData);
            // const response = await PostSimpanTempTtb(jsonData, token);
            const result = response.data;
            const status = result.status;
            const errormsg = result.serverMessage;
            if (status === true) {
                await handleUploadZip(result.kode_ttb);
                // let getcounterno_ttb = await generateNUDivisi(kode_entitas, noTtbValue, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`)
                //     .then((result) => {
                //         // alert(result);
                //     })
                //     .catch((error) => {
                //         console.error('Error:', error);
                //         swal.fire({
                //             title: 'Penambahan Counter No TTB Gagal',
                //             icon: 'warning',
                //         });
                //     });
                let bodyObject = {
                    kode_entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'TB',
                    kode_dokumen: result.kode_ttb,
                    no_dokumen: noTtbValue,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'APPROVAL',
                    diskripsi: `TTB item = ${jumlahItem} nilai transaksi = ${frmNumber(dataTotalHeader.jumlahMu)}`,
                    userid: userid.toUpperCase(), // userid login web
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                const auditResponse = await PostSimpanAudit(bodyObject);
                if (auditResponse.data.status === true) {
                    endProgress();
                    await withReactContent(swalPopUp).fire({
                        icon: 'success',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil disimpan.</p>',
                        width: '50%', // Atur lebar popup sesuai kebutuhan
                        target: '#dialogTtbList',
                        heightAuto: true,
                        timer: 2000,
                        showConfirmButton: false, // Menampilkan tombol konfirmasi
                        allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                        allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    await closeDialogTtbList();
                    setDisabledTombolSimpan(false);
                }
            } else {
                endProgress();
                withReactContent(swalDialog).fire({
                    title: ``,
                    html: errormsg,
                    icon: 'warning',
                    width: '20%',
                    heightAuto: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Ok',
                    target: '#dialogTtbList',
                });
                setDisabledTombolSimpan(false);
            }
        }
    };

    // Template untuk kolom "Info Detail"
    const templateCustomerInfoDetail = (args: any) => {
        return (
            <div
                style={
                    args.status_warna === 'BlackList-G'
                        ? { color: 'yellow', fontWeight: 'bold' }
                        : args.status_warna === 'Tidak Digarap'
                        ? { color: '#f5800a', fontWeight: 'bold' }
                        : args.status_warna === 'Non Aktif'
                        ? { color: '#c0c0c0', fontWeight: 'bold' }
                        : args.status_warna === 'NOO'
                        ? { color: '#00ff80', fontWeight: 'bold' }
                        : args.status_warna === 'Batal NOO'
                        ? { color: '#ff8080', fontWeight: 'bold' }
                        : { color: 'black' }
                }
            >
                {/* Isi template sesuai kebutuhan */}
                {args.status_warna}
            </div>
        );
    };

    useEffect(() => {
        ReCallRefreshModal();
    }, [refreshKey]);

    const recordDoubleDaftarCustomer = (args: any) => {
        currentDaftarCustomer = args.rowData;
        HandleSelectedDataCustomer1(currentDaftarCustomer, (tipe = 'header'), setCustSelected, setCustSelectedKode, setSelectedKodeRelasi, setModal2);
        setModal1(false);
    };

    const handleActionBagin = async (args: any) => {
        if (args.requestType === 'save') {
            if (dataBarang.nodes.length > 0) {
                setDataBarang((state: any) => {
                    const currentDataSource = gridTtbListRef.current?.dataSource as any[];
                    const filteredDataSource = currentDataSource.filter((item) => item.id != null);
                    gridTtbListRef.current?.setProperties({ dataSource: filteredDataSource });

                    return {
                        ...state,
                    };
                });
            } else {
                setDataBarang((state: any) => {
                    // Mengecek apakah ada node yang memiliki 'no_sj' yang kosong
                    const hasEmptyNodes = state.nodes.some((node: any) => node.no_sj === '');
                    if (hasEmptyNodes !== true) {
                        withReactContent(swalDialog)
                            .fire({
                                title: ``,
                                html: '<p style="font-size:12px; margin-left: 46px;">Ada data barang yang kosong, hapus data barang</p>',
                                width: '280px',
                                heightAuto: true,
                                target: '#dialogTtbList',
                                focusConfirm: false,
                                // showCancelButton: true,
                                confirmButtonText: '&ensp; Hapus &ensp;',
                                // cancelButtonText: 'Tidak',
                                reverseButtons: true,
                                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                                customClass: {
                                    confirmButton: stylesTtb['custom-confirm-button'],
                                    // cancelButton: 'custom-cancel-button' // Jika Anda ingin mengatur warna untuk tombol batal juga
                                },
                            })
                            .then(async (result) => {
                                if (result.value) {
                                    // setDataBarang((state: any) => {
                                    //     const updatedNodes = state.nodes.filter((node: any) => node.no_sj !== '');
                                    //     return {
                                    //         ...state,
                                    //         nodes: updatedNodes,
                                    //     };
                                    // });
                                    gridTtbListRef.current?.setProperties({ dataSource: [] });
                                } else if (result.dismiss === swal.DismissReason.cancel) {
                                    //...
                                }
                            });
                    }

                    return {
                        ...state,
                    };
                });
            }

            calculateData(args.data.kuantitas);
        }
    };

    const handleActionComplate = async (args: any) => {
        if (args.requestType === 'add') {
            handleDetailBarang_Add(args.requestType);
        } else if (args.requestType === 'delete') {
            DetailBarangDelete(gridTtbListRef.current, swalDialog, IdDokumen, setIdDokumen, args.requestType, args.data[0].nama_barang, setDataBarang, setTotalBarang);
        }
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

    const [activeTab, setActiveTab] = useState(0);
    const [selectedFile, setSelectedFile] = useState('baru');
    const [images, setImages] = useState<string[][]>([]);
    const [selectedFiles, setSelectedFiles] = useState<any>([]);
    const [selectedNamaFiles, setNamaFiles] = useState<any>([]);
    const formattedName = moment().format('YYMMDDHHmmss');
    const [fileGambar, setFileGambar] = useState('');
    const [loadFilePendukung, setLoadFilePendukung] = useState<ImageData[]>([]);
    const tabs = [
        { title: 'Bukti Surat Jalan Kembali', content: 'Content 1' },
        { title: 'Bukti Barang Kembali', content: 'Content 2' },
        { title: 'Bukti Lain Lain', content: 'Content 3' },
        { title: 'Bukti Lain Lain 2', content: 'Content 4' },
    ];

    const handleFileUpload = (e: any, tabIndex: any) => {
        // Implement your file upload logic here
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result;
            if (typeof imageData === 'string') {
                setImages((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[tabIndex] = [imageData];
                    return newImages;
                });
            }
        };
        reader.readAsDataURL(file);
        const newFiles = [...e.target.files];
        if (selectedFile === 'update') {
            setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);

            const newNamaFiles = new Array(newFiles.length).fill(formattedName);
            setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, fileGambar.substring(0, fileGambar.length - 4)]);
        }
        if (selectedFile === 'baru') {
            setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);

            const newNamaFiles = new Array(newFiles.length).fill(formattedName);
            setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, formattedName]);
        }
    };

    const handleClick = async (tabIndex: any) => {
        if (masterKodeDokumen !== 'BARU') {
            const load = await LoadImages(kode_entitas, masterKodeDokumen);
            const filterLoad = load.filter((item: any) => item.id_dokumen === tabIndex);

            if (filterLoad > 0) {
                setSelectedFile('update');
                setFileGambar(filterLoad[0].filegambar);
            } else {
                setFileGambar('');
                setSelectedFile('baru');
            }
        } else {
            setFileGambar('');
            setSelectedFile('baru');
        }

        const input = document.getElementById(`imageInput${tabIndex}`) as HTMLInputElement;
        if (input) {
            input.click();
        }
        // Implement your button click logic here
    };

    // Tentukan tipe dari setiap entri JSON
    interface JsonEntry {
        entitas: string;
        kode_dokumen: string;
        id_dokumen: string;
        dokumen: string;
        filegambar: string;
    }

    const handleUploadZip = async (kode_dokumen: any) => {
        const formData = new FormData();
        const jsonData = [];
        const zip = new JSZip();
        let entitas;
        let namaFileImage: any;

        const uniqueEntries: { [key: string]: JsonEntry } = {};
        for (let index = 0; index < selectedFiles.length; index++) {
            const fileWithTabIdx = selectedFiles[index];
            const file = fileWithTabIdx.file;
            const tabIdx = fileWithTabIdx.tabIndex;
            const fileExtension = file.name.split('.').pop();

            // formData.append(`nama_file_image`, selectedFile !== 'update' ? `SP${selectedNamaFiles[index]}.${fileExtension}` : fileGambar);
            const fileNameWithExtension = masterDataState !== 'BARU' ? `TTB${selectedNamaFiles[index]}.${fileExtension}` : `TTB${selectedNamaFiles[index]}.${fileExtension}`;
            namaFileImage = fileNameWithExtension;

            const arrayBuffer = await new Response(file).arrayBuffer();
            // Menambahkan file ke dalam zip dengan ekstensi yang sesuai
            zip.file(fileNameWithExtension, arrayBuffer, { binary: true });

            if (tabIdx !== -1) {
                const jsonEntry = {
                    entitas: kode_entitas,
                    kode_dokumen: kode_dokumen,
                    id_dokumen: String(tabIdx),
                    dokumen: 'TTB',
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

        // Tambahkan blob ZIP ke FormData
        formData.append('myimage', zipBlob, `IMG_${kode_dokumen}.zip`);

        // Tambahkan informasi tambahan ke FormData
        formData.append('nama_file_image', `IMG_${kode_dokumen}.zip`);
        formData.append('kode_dokumen', '');

        // Tentukan nilai tabIdx yang benar, mungkin dengan memperhitungkan logika Anda
        let tabIdx = selectedFiles.length > 0 ? selectedFiles[0].tabIndex + 1 : 0;
        formData.append('id_dokumen', tabIdx);
        formData.append('dokumen', 'TTB');

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

        // console.log('jsonData = ', jsonData);
        // console.log('formData = ', formData);

        if (selectedFiles.length > 0) {
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
                            dokumen: 'TTB',
                            filegambar: namaFile,
                            fileoriginal: response.data.filesinfo[index] ? response.data.filesinfo[index].fileoriginal : null,
                        };
                    });
                } else {
                    jsonSimpan = {
                        entitas: kode_entitas,
                        kode_dokumen: kode_dokumen,
                        id_dokumen: '999',
                        dokumen: 'TTB',
                        filegambar: response.data.nama_file_image,
                        fileoriginal: response.data.filesinfo,
                    };
                }

                if (response.data.status === true) {
                    // if (selectedFile !== 'update') {
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
                    // }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const clearAllImages = () => {
        // setImages((prevImages: any) => {
        //     const newImages = [...prevImages];
        //     // Menghapus semua data di setImages
        //     newImages.forEach((_, index) => {
        //         newImages[index] = [];
        //     });
        //     return newImages;
        // });
        setImages([]);

        setSelectedFiles([]);
        setLoadFilePendukung([]);
        // Mengatur ulang input file
        tabs.forEach((_, index) => {
            const input = document.getElementById(`imageInput${index}`) as HTMLInputElement;
            if (input) {
                input.value = ''; // Mengatur nilai input file ke kosong
            }
        });
    };

    const clearImage = (tabIndex: number) => {
        setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages[tabIndex] = [];
            return newImages;
        });
        setSelectedFiles((prevSelectedFiles: any) => {
            const newSelectedFiles = prevSelectedFiles.filter((file: any) => file.tabIndex !== tabIndex);
            return newSelectedFiles;
        });
        setLoadFilePendukung((prevSelectedFiles: any) => {
            const newSelectedFiles = loadFilePendukung.filter((file: any) => file.id_dokumen !== tabIndex);
            return newSelectedFiles;
        });
    };

    const loadDataImage = async (kode_ttb: any) => {
        const responseDataImage = await GetTbImages(kode_entitas, kode_ttb);
        setLoadFilePendukung(responseDataImage);
        let vnamaZip = 'IMG_' + kode_ttb + '.zip';
        const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
        const data = await responsePreviewImg.json();
        if (data.status === true) {
            const newFiles = data.images
                .filter((item: any) => responseDataImage.some((dataItem: any) => dataItem.filegambar === item.fileName))
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
                .map((fileName: string) => fileName.replace(/\.(jpg|jpeg|png)$/, '').replace('TTB', ''));

            setSelectedFiles((prevFiles: any) => [
                ...prevFiles,
                ...newFiles.map((item: any) => ({
                    file: item.file,
                    tabIndex: item.responseIndex,
                    responseIndex: item.responseIndex,
                })),
            ]);

            setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, ...uniqueFormattedNames]);

            // Mengambil nama file pertama untuk setNamaFilesExt1
            if (newFiles.length > 0) {
                setNamaFilesExt1(newFiles[0].file.name);
            }

            setExtractedFiles(data.images);
        } else {
            setExtractedFiles([]);
        }
    };

    const [indexPreview, setIndexPreview] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [zoomScale, setZoomScale] = useState(0.5);

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const openPreview = (index: any) => {
        setIndexPreview(index);
        setIsOpenPreview(true);
        setZoomScale(0.5); // Reset zoom scale
        setPosition({ x: 0, y: 0 }); // Reset position

        if (!images[index]) {
            const foundItem = loadFilePendukung.find((item) => item.id_dokumen === index);
            const filegambar = foundItem?.filegambar;
            if (filegambar) {
                const imageUrl = extractedFiles.find((item) => item.fileName === filegambar)?.imageUrl;
                setImageDataUrl(imageUrl || '');
            }
        } else {
            setImageDataUrl(images[index][0]);
        }
    };

    const handleCloseZoom = () => {
        setIsOpenPreview(false);
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

    const handleZoomIn = () => {
        setZoomScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
    };

    const handleZoomOut = () => {
        setZoomScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
    };

    // Fungsi untuk menangani paste gambar
    const handlePaste = (e: any, tabIndex: any) => {
        e.preventDefault();

        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImageUrl = event.target?.result;
                    // Memastikan bahwa newImageUrl adalah string sebelum menggunakannya
                    if (typeof newImageUrl === 'string') {
                        const newImages = [...images];
                        newImages[tabIndex] = [newImageUrl];
                        setImages(newImages);
                    }
                };
                reader.readAsDataURL(file);

                if (selectedFile === 'update') {
                    setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);
                    setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, fileGambar.substring(0, fileGambar.length - 4)]);
                }
                if (selectedFile === 'baru') {
                    setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);
                    setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, formattedName]);
                }
            }
        }
    };

    const [selectedTab, setSelectedTab] = useState(0);
    const handleTabClick = (index: any) => {
        setSelectedTab(index);
    };

    return (
        <div>
            {/*==================================================================================================*/}
            {/*====================== Modal dialog untuk input edit dan menambah data baru ======================*/}
            {/*==================================================================================================*/}
            <DialogComponent
                id="dialogTtbList"
                name="dialogTtbList"
                className="dialogTtbList"
                target="#main-target"
                header={() => {
                    let header: string = '';
                    if (masterDataState == 'BARU') {
                        header = `Tanda Terima Barang Baru || Divisi Penjualan : ${divisiPenjualan}`;
                    } else if (masterDataState == 'EDIT') {
                        header = `Edit Tanda Terima Barang || Divisi Penjualan : ${divisiPenjualan}`;
                    } else if (masterDataState == 'APPROVAL') {
                        header = `Approval Tanda Terima Barang || Divisi Penjualan : ${divisiPenjualan}`;
                    }
                    return header;
                }}
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                resizeHandles={['All']}
                allowDragging={true}
                showCloseIcon={true}
                width="60%" //"70%"
                // height="70%"
                position={{ X: 'center', Y: 8 }}
                style={{ position: 'fixed' }}
                buttons={buttonInputData}
                close={() => {
                    closeDialogTtbList();
                    setDataBarang((state: any) => ({
                        ...state,
                        nodes: [],
                    }));
                }}
                closeOnEscape={false}
                open={(args: any) => {
                    args.preventFocus = true;
                }}
            >
                <div style={{ minWidth: '70%', overflow: 'auto' }}>
                    <div>
                        {/* screen loader  */}
                        {showLoader && contentLoader()}

                        <div>
                            {/* ===============  Master Header Data ========================   */}
                            <div className="mb-1">
                                <div className="panel-tabel" style={{ width: '100%' }}>
                                    <table className={styles.table} style={{ width: '80%' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '10%' }}>Tanggal</th>
                                                <th style={{ width: '10%' }}>No. TTB</th>
                                                <th style={{ width: '45%' }}>Customer</th>
                                                <th style={{ width: '25%' }}>Gudang</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <>
                                                        {valueAppBackdate === true ? (
                                                            <Flatpickr
                                                                key="flatpickr" // Unique key for Flatpickr
                                                                value={masterTglTtb.toDate()}
                                                                options={{
                                                                    dateFormat: 'd-m-Y',
                                                                }}
                                                                className="form-input"
                                                                style={{ fontSize: '11px', width: '15vh', color: '#afadadee', border: 'none' }}
                                                                disabled={true}
                                                            />
                                                        ) : (
                                                            <DatePickerComponent
                                                                key="datepicker" // Unique key for DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                placeholder="Tgl. TTB"
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                value={masterTglTtb.toDate()}
                                                                change={(args: ChangeEventArgsCalendar) => {
                                                                    if (args.value) {
                                                                        const selectedDate = moment(args.value);
                                                                        selectedDate.set({
                                                                            hour: moment().hour(),
                                                                            minute: moment().minute(),
                                                                            second: moment().second(),
                                                                        });
                                                                        setDate1(selectedDate);
                                                                    } else {
                                                                        setDate1(moment());
                                                                    }
                                                                }}
                                                            >
                                                                <Inject services={[MaskedDateTime]} />
                                                            </DatePickerComponent>
                                                        )}
                                                    </>
                                                </td>
                                                <td>
                                                    <TextBoxComponent placeholder="No. TTB" value={noTtbValue} readonly={true} />
                                                </td>
                                                <td>
                                                    <div className="flex">
                                                        <div className="container form-input" style={{ border: 'none' }}>
                                                            <TextBoxComponent
                                                                className={`${stylesTtb.inputTableBasic}`}
                                                                placeholder="Masukan Nama Customer"
                                                                value={custSelected}
                                                                onFocus={(event) => {
                                                                    if (event.target instanceof HTMLInputElement) {
                                                                        event.target.select();
                                                                    }
                                                                }}
                                                                input={(args: ChangeEventArgsInput) => {
                                                                    const value: any = args.value;
                                                                    HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1, setSearchNamaCust);
                                                                }}
                                                                style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                            />
                                                        </div>
                                                        <div
                                                            onClick={() =>
                                                                HandleModaliconChange(
                                                                    'customer',
                                                                    dataBarang,
                                                                    custSelected,
                                                                    setHandleNamaCust,
                                                                    setModal1,
                                                                    kode_entitas,
                                                                    setDsDaftarCustomer,
                                                                    setDataBarang
                                                                )
                                                            }
                                                        >
                                                            <button
                                                                className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                onClick={() => {
                                                                    console.log('Ikon diklik!');
                                                                }}
                                                                style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faMagnifyingGlass}
                                                                    className="ml-2"
                                                                    width="15"
                                                                    height="15"
                                                                    onClick={() =>
                                                                        HandleModaliconChange(
                                                                            'customer',
                                                                            dataBarang,
                                                                            custSelected,
                                                                            setHandleNamaCust,
                                                                            setModal1,
                                                                            kode_entitas,
                                                                            setDsDaftarCustomer,
                                                                            setDataBarang
                                                                        )
                                                                    }
                                                                    style={{ margin: '7px 2px 0px 6px' }}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex">
                                                        <DropDownListComponent
                                                            key={`dropdown-${refreshKeyGudang1}`}
                                                            id="gudang12"
                                                            className="form-select"
                                                            dataSource={apiResponseGudang.map((data: any) => data.nama_gudang)}
                                                            placeholder="-- Silahkan Pilih Gudang --"
                                                            change={(args: ChangeEventArgsDropDown) => {
                                                                const value: any = args.value;
                                                                const selectedGudang = apiResponseGudang.find((data: any) => data.nama_gudang === value);
                                                                const kode_gudang = selectedGudang ? selectedGudang.kode_gudang : null;
                                                                HandleGudangChange(kode_gudang, value, setSelectedOptionGudang, setSelectedOptionKodeGudang);
                                                            }}
                                                            // value={selectedOptionGudang}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className={styles.table}>
                                                <th style={{ width: '3%' }}>Cara Pengiriman</th>
                                                <th colSpan={2} style={{ width: '55%' }}>
                                                    Alasan
                                                </th>
                                            </tr>
                                            <tr>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="flex items-center">
                                                        <RadioButtonComponent
                                                            label="Dikirim"
                                                            name="size"
                                                            // checked={true}
                                                            checked={selectedCaraPengiriman === 'Dikirim'}
                                                            change={changeCaraPengirimanDikirim}
                                                            ref={(radio1) => (radioInstanceDikirim = radio1 as RadioButtonComponent)}
                                                            cssClass="e-small"
                                                            style={{ fontSize: 10 }}
                                                        />
                                                        <RadioButtonComponent
                                                            label="Diambil"
                                                            name="size"
                                                            checked={selectedCaraPengiriman === 'Diambil'}
                                                            change={changeCaraPengirimanDiambil}
                                                            ref={(radio3) => (radioInstanceDiambil = radio3 as RadioButtonComponent)}
                                                            cssClass="e-small"
                                                        />
                                                    </div>
                                                </td>
                                                <td colSpan={2}>
                                                    <div className="container form-input" style={{ border: 'none' }}>
                                                        <DropDownListComponent
                                                            key={`dropdown-${refreshKeyAlasan1}`}
                                                            id="alasan"
                                                            className="form-select"
                                                            dataSource={checkboxDataMasterAlasan.map((data: any) => data.alasan)}
                                                            placeholder="-- Silahkan Pilih Alasan --"
                                                            change={(args: ChangeEventArgsDropDown) => {
                                                                const value: any = args.value;
                                                                HandleAlasanChange(value, setSelectedOptionAlasan);
                                                            }}
                                                            // value={selectedOptionAlasan}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* ===============  Detail Data ========================   */}
                            <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '338px' }}>
                                <TabComponent ref={(t) => (tabTtbList = t)} selectedItem={selectedTab} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                    <div className="e-tab-header">
                                        <div tabIndex={0} onClick={() => handleTabClick(0)}>
                                            Data Barang
                                        </div>
                                        <div tabIndex={1} onClick={() => handleTabClick(1)}>
                                            File Pendukung
                                        </div>
                                    </div>
                                    {/*===================== Content menampilkan data barang =======================*/}
                                    <div className="e-content">
                                        <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                            <TooltipComponent ref={(t) => (tooltipDetailBarang = t)} beforeRender={beforeRenderDetailBarang} openDelay={1000} target=".e-headertext">
                                                <GridComponent
                                                    id="gridTtbList"
                                                    name="gridTtbList"
                                                    className="gridTtbList"
                                                    locale="id"
                                                    ref={gridTtbListRef}
                                                    dataSource={dataBarang.nodes}
                                                    editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    rowHeight={22}
                                                    height={170} //170 barang jadi 150 barang produksi
                                                    gridLines={'Both'}
                                                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    recordClick={(args: any) => {
                                                        currentDaftarBarang = gridTtbListRef.current?.getSelectedRecords() || [];
                                                        if (currentDaftarBarang.length > 0) {
                                                            gridTtbListRef.current?.startEdit();
                                                            document.getElementById('kuantitas')?.focus();
                                                        }
                                                    }}
                                                    actionBegin={handleActionBagin}
                                                    actionComplete={handleActionComplate}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />
                                                        <ColumnDirective
                                                            field="no_sj"
                                                            isPrimaryKey={true}
                                                            editTemplate={editTemplateNoSj}
                                                            headerText="No. SJ"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="150"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="no_barang"
                                                            isPrimaryKey={true}
                                                            headerText="No. Barang"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="85"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="nama_barang"
                                                            isPrimaryKey={true}
                                                            headerText="Nama Barang"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="260"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="satuan"
                                                            editTemplate={editTemplateSatuan}
                                                            headerText="Satuan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="80"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="kuantitas"
                                                            format={formatFloat}
                                                            editType="numericedit"
                                                            edit={qtyParams}
                                                            // editTemplate={editTemplateQty}
                                                            headerText="Kuantitas"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="70"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="keterangan"
                                                            headerText="Keterangan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="260"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                    </ColumnsDirective>

                                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                </GridComponent>
                                            </TooltipComponent>

                                            <div className="panel-pager">
                                                <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                    <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                            <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                                <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                    <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                        <div className="mt-1 flex">
                                                                            <ButtonComponent
                                                                                id="buAdd1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-plus"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={() => handleDetailBarang_Add('addTombol')}
                                                                            />
                                                                            {/* <ButtonComponent
                                                                                id="buEdit1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-edit"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={() => DetailBarangEdit(gridTtbList)}
                                                                            /> */}
                                                                            <ButtonComponent
                                                                                id="buDelete1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-warning e-small"
                                                                                iconCss="e-icons e-small e-trash"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                onClick={() =>
                                                                                    DetailBarangDelete(
                                                                                        gridTtbListRef.current,
                                                                                        swalDialog,
                                                                                        IdDokumen,
                                                                                        setIdDokumen,
                                                                                        'deleteTombol',
                                                                                        '',
                                                                                        setDataBarang,
                                                                                        setTotalBarang
                                                                                    )
                                                                                }
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buDeleteAll1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-danger e-small"
                                                                                iconCss="e-icons e-small e-erase"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                onClick={() => DetailBarangDeleteAll(swalDialog, setDataBarang, setTotalBarang, setTotalRecords, setIdDokumen)}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buSimpanDokumen1"
                                                                                content="Daftar SJ"
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-search"
                                                                                style={{ float: 'right', width: '90px', marginRight: 2.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={DialogDaftarSj}
                                                                            />
                                                                            <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                <b>Jumlah Barang :</b>&nbsp;&nbsp;&nbsp;{TotalBarang}
                                                                            </div>
                                                                        </div>
                                                                    </TooltipComponent>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </div>
                                        </div>
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
                                                                <div style={{ width: '43%' }}>
                                                                    <div
                                                                        className="border p-3"
                                                                        onPaste={(e) => handlePaste(e, index)} // Menangani data clipboard saat paste
                                                                        onContextMenu={() => handleClick(index)}
                                                                        style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '239px' }}
                                                                    >
                                                                        {masterDataState === 'BARU' ? (
                                                                            images[index] &&
                                                                            images[index].length > 0 && (
                                                                                <ImageWithDeleteButton
                                                                                    imageUrl={images[index][0]}
                                                                                    onDelete={() => clearImage(index)}
                                                                                    index={index}
                                                                                    setIndexPreview={setIndexPreview}
                                                                                    setIsOpenPreview={setIsOpenPreview}
                                                                                    setZoomScale={setZoomScale}
                                                                                    setPosition={setPosition}
                                                                                    loadFilePendukung={loadFilePendukung}
                                                                                    extractedFiles={extractedFiles}
                                                                                    setImageDataUrl={setImageDataUrl}
                                                                                    images={images}
                                                                                />
                                                                            )
                                                                        ) : masterDataState === 'EDIT' || masterDataState === 'APPROVAL' ? (
                                                                            images[index] ? (
                                                                                <>
                                                                                    {images[index].length > 0
                                                                                        ? images[index] &&
                                                                                          images[index].length > 0 && (
                                                                                              <ImageWithDeleteButton
                                                                                                  imageUrl={images[index][0]}
                                                                                                  onDelete={() => clearImage(index)}
                                                                                                  index={index}
                                                                                                  setIndexPreview={setIndexPreview}
                                                                                                  setIsOpenPreview={setIsOpenPreview}
                                                                                                  setZoomScale={setZoomScale}
                                                                                                  setPosition={setPosition}
                                                                                                  loadFilePendukung={loadFilePendukung}
                                                                                                  extractedFiles={extractedFiles}
                                                                                                  setImageDataUrl={setImageDataUrl}
                                                                                                  images={images}
                                                                                              />
                                                                                          )
                                                                                        : (() => {
                                                                                              const foundItem = loadFilePendukung.find((item: any) => item.id_dokumen === index);
                                                                                              const filegambar = foundItem?.filegambar;
                                                                                              if (filegambar) {
                                                                                                  const imageUrl = extractedFiles.find((item) => item.fileName === filegambar)?.imageUrl;
                                                                                                  return (
                                                                                                      imageUrl && (
                                                                                                          <ImageWithDeleteButton
                                                                                                              imageUrl={imageUrl}
                                                                                                              onDelete={() => clearImage(index)}
                                                                                                              index={index}
                                                                                                              setIndexPreview={setIndexPreview}
                                                                                                              setIsOpenPreview={setIsOpenPreview}
                                                                                                              setZoomScale={setZoomScale}
                                                                                                              setPosition={setPosition}
                                                                                                              loadFilePendukung={loadFilePendukung}
                                                                                                              extractedFiles={extractedFiles}
                                                                                                              setImageDataUrl={setImageDataUrl}
                                                                                                              images={images}
                                                                                                          />
                                                                                                      )
                                                                                                  );
                                                                                              }
                                                                                              return null;
                                                                                          })()}
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    {(() => {
                                                                                        const foundItem = loadFilePendukung.find((item: any) => item.id_dokumen === index);
                                                                                        const filegambar = foundItem?.filegambar;
                                                                                        if (filegambar) {
                                                                                            const imageUrl = extractedFiles.find((item) => item.fileName === filegambar)?.imageUrl;
                                                                                            return (
                                                                                                imageUrl && (
                                                                                                    <ImageWithDeleteButton
                                                                                                        imageUrl={imageUrl}
                                                                                                        onDelete={() => clearImage(index)}
                                                                                                        index={index}
                                                                                                        setIndexPreview={setIndexPreview}
                                                                                                        setIsOpenPreview={setIsOpenPreview}
                                                                                                        setZoomScale={setZoomScale}
                                                                                                        setPosition={setPosition}
                                                                                                        loadFilePendukung={loadFilePendukung}
                                                                                                        extractedFiles={extractedFiles}
                                                                                                        setImageDataUrl={setImageDataUrl}
                                                                                                        images={images}
                                                                                                    />
                                                                                                )
                                                                                            );
                                                                                        }
                                                                                        return null;
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div style={{ width: '4%' }}></div>
                                                                <div style={{ width: '48%' }}>
                                                                    <input
                                                                        type="file"
                                                                        id={`imageInput${index}`}
                                                                        name={`image${index}`}
                                                                        accept="image/*"
                                                                        style={{ display: 'none' }}
                                                                        onChange={(e) => handleFileUpload(e, index)}
                                                                        multiple
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn mb-2 h-[4.5vh]"
                                                                        style={{
                                                                            backgroundColor: '#3b3f5c',
                                                                            color: 'white',
                                                                            width: '152px',
                                                                            height: '13%',
                                                                            marginTop: -7,
                                                                            borderRadius: '5px',
                                                                            fontSize: '11px',
                                                                        }}
                                                                        onClick={() => handleClick(index)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faUpload} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                                        File ...
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        className="btn mb-2 h-[4.5vh]"
                                                                        style={{
                                                                            backgroundColor: '#3b3f5c',
                                                                            color: 'white',
                                                                            width: '152px',
                                                                            height: '13%',
                                                                            marginTop: -7,
                                                                            borderRadius: '5px',
                                                                            fontSize: '11px',
                                                                        }}
                                                                        // onClick={() => handleUploadZip('123')}
                                                                        onClick={() => clearImage(index)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEraser} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                                        Bersihkan Gambar
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        className="btn mb-2 h-[4.5vh]"
                                                                        style={{
                                                                            backgroundColor: '#3b3f5c',
                                                                            color: 'white',
                                                                            width: '152px',
                                                                            height: '13%',
                                                                            marginTop: -7,
                                                                            borderRadius: '5px',
                                                                            fontSize: '11px',
                                                                        }}
                                                                        onClick={clearAllImages}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrashCan} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                                        Bersihkan Semua ...
                                                                    </button>
                                                                    <button
                                                                        type="submit"
                                                                        className="btn mb-2 h-[4.5vh]"
                                                                        style={{
                                                                            backgroundColor: '#3b3f5c',
                                                                            color: 'white',
                                                                            width: '152px',
                                                                            height: '13%',
                                                                            marginTop: -7,
                                                                            borderRadius: '5px',
                                                                            fontSize: '11px',
                                                                        }}
                                                                        onClick={() =>
                                                                            OpenPreviewInsert(
                                                                                index,
                                                                                setIndexPreview,
                                                                                setIsOpenPreview,
                                                                                setZoomScale,
                                                                                setPosition,
                                                                                loadFilePendukung,
                                                                                extractedFiles,
                                                                                setImageDataUrl,
                                                                                images
                                                                            )
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
                                            {/* {isOpen1 && (
                                                <Lightbox
                                                    mainSrc={images[photoIndex]?.[0] || 'https://via.placeholder.com/300x200.png?text=Image+1'}
                                                    onCloseRequest={() => setIsOpen1(false)}
                                                    onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
                                                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
                                                />
                                            )} */}
                                        </div>
                                    </div>
                                </TabComponent>
                            </div>

                            {/* ===============  Master Footer Data ========================   */}
                            <div className="mt-1">
                                <p className="set-font-11">
                                    <b>Catatan :</b>
                                </p>
                                <div className="panel-input" style={{ width: '80%' }}>
                                    <TextBoxComponent
                                        ref={(t) => {
                                            textareaObj = t;
                                        }}
                                        multiline={true}
                                        created={onCreateMultiline}
                                        value={catatanValue}
                                        input={(args: FocusInEventArgs) => {
                                            const value: any = args.value;
                                            HandelCatatan(value, setCatatanValue);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* =================  Tombol action dokumen ==================== */}
                    <div
                        style={{
                            backgroundColor: '#F2FDF8',
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            borderBottomLeftRadius: '6px',
                            borderBottomRightRadius: '6px',
                            width: '100%',
                            height: '55px',
                            display: 'inline-block',
                            overflowX: 'scroll',
                            overflowY: 'hidden',
                            scrollbarWidth: 'none',
                        }}
                    >
                        {(masterDataState === 'BARU' || masterDataState === 'EDIT' || masterDataState === 'APPROVAL') && (
                            <ButtonComponent
                                id="buBatalDokumen1"
                                content="Batal"
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-small e-close"
                                style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                                onClick={closeDialogTtbList}
                            />
                        )}
                        {(masterDataState === 'BARU' || masterDataState === 'EDIT' || masterDataState === 'APPROVAL') && (
                            <ButtonComponent
                                id="buSimpanDokumen1"
                                content="Simpan"
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-small e-save"
                                style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                onClick={() => saveDoc(dataBarang)}
                                disabled={disableTombolSimpan}
                            />
                        )}
                    </div>
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
                </div>
                <GlobalProgressBar />
            </DialogComponent>

            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk daftar Sj Item =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarSjItemTtb
                dialogDaftarSjItemVisible={dialogDaftarSjItemVisible}
                searchNoItem={searchNoItem}
                searchNamaItem={searchNamaItem}
                searchKeywordNoBarang={searchKeywordNoBarang}
                searchKeywordNamaBarang={searchKeywordNamaBarang}
                dataDetailSjItem={dataDetailSjItem}
                filteredDataSjItem={filteredDataSjItem}
                swalToast={swalToast}
                setSearchNoItem={setSearchNoItem}
                setSearchNamaItem={setSearchNamaItem}
                setSearchKeywordNoBarang={setSearchKeywordNoBarang}
                setSearchKeywordNamaBarang={setSearchKeywordNamaBarang}
                setFilteredDataSjItem={setFilteredDataSjItem}
                HandleSearchNoBarang={HandleSearchNoBarang}
                HandleSearchNamaBarang={HandleSearchNamaBarang}
                setPilihDetailBarang={setPilihDetailBarang}
                setDialogDaftarSjItemVisible={setDialogDaftarSjItemVisible}
                setDataBarang={setDataBarang}
                gridTtbListRef={gridTtbListRef.current}
            />

            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal Customer yang ada pada Header =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarCustomerTtb
                modal1={modal1}
                searchNoCust={searchNoCust}
                searchNamaCust={searchNamaCust}
                searchNamaSales={searchNamaSales}
                searchKeywordNoCust={searchKeywordNoCust}
                searchKeywordNamaCust={searchKeywordNamaCust}
                searchKeywordNamaSales={searchKeywordNamaSales}
                kode_entitas={kode_entitas}
                filteredData={filteredData}
                dsDaftarCustomer={dsDaftarCustomer}
                swalToast={swalToast}
                activeSearchDaftarCustomer={activeSearchDaftarCustomer}
                // buttonDaftarCustomer: any[];
                stylesTtbB={stylesTtb}
                setModal1={setModal1}
                setSearchNoCust={setSearchNoCust}
                setSearchNamaCust={setSearchNamaCust}
                setSearchNamaSales={setSearchNamaSales}
                setSearchKeywordNoCust={setSearchKeywordNoCust}
                setSearchKeywordNamaCust={setSearchKeywordNamaCust}
                setSearchKeywordNamaSales={setSearchKeywordNamaSales}
                setFilteredData={setFilteredData}
                recordDoubleDaftarCustomer={recordDoubleDaftarCustomer}
                HandleSearchNoCust={HandleSearchNoCust}
                HandleSearchNamaCust={HandleSearchNamaCust}
                HandleSearchNamaSales={HandleSearchNamaSales}
                templateCustomerInfoDetail={templateCustomerInfoDetail}
                HandleSelectedDataCustomer={HandleSelectedDataCustomer}
                setCustSelected={setCustSelected}
                setCustSelectedKode={setCustSelectedKode}
                setSelectedKodeRelasi={setSelectedKodeRelasi}
                setModal2={setModal2}
            />

            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk daftar sj =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarSjTtb
                dialogDaftarSjVisible={dialogDaftarSjVisible}
                searchNoDokumen={searchNoDokumen}
                searchNamaRelasi={searchNamaRelasi}
                searchKeywordNoDok={searchKeywordNoDok}
                searchKeywordNamaRelasi={searchKeywordNamaRelasi}
                dataDetailSj={dataDetailSj}
                filteredDataSj={filteredDataSj}
                swalToast={swalToast}
                setSearchNoDokumen={setSearchNoDokumen}
                setSearchNamaRelasi={setSearchNamaRealasi}
                setSearchKeywordNoDok={setSearchKeywordNoDok}
                setSearchKeywordNamaRelasi={setSearchKeywordNamaRelasi}
                setFilteredDataSj={setFilteredDataSj}
                HandleSearchNoDok={HandleSearchNoDok}
                HandleSearchNamaRelasi={HandleSearchNamaRelasi}
                handleClickDaftarSj={handleClickDaftarSj}
                setDialogDaftarSjVisible={setDialogDaftarSjVisible}
                setSearchNamaRealasi={setSearchNamaRealasi}
                setDataBarang={setDataBarang}
            />

            {/*==================================================================================================*/}
        </div>
    );
};

export default DialogTtbList;
