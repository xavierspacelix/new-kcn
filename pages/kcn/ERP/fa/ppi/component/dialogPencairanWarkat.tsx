import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from '../ppilist.module.css';

// Pakai fungsi dari routines ============================
import { DiskonByCalc, FillFromSQL, GetInfo, entitaspajak, fetchPreferensi, frmNumber, generateNU, generateNUDivisi, tanpaKoma } from '@/utils/routines';
//========================================================

import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { ReCalcDataNodes } from '../functional/reCalc';
import {
    AutoJurnalSimpan,
    CekTglBackDate,
    CekTglMinusSatu,
    CekTglPlus14,
    CekTglPlus3,
    CurrencyFormat,
    DetailNoFakturJurnal,
    DetailNoFakturJurnalPencairanWarkat,
    GenerateTotalJurnal,
    GenerateTotalJurnalEdit,
    HandleModalicon,
    HandleSearchNamaAkun,
    HandleSearchNamaCustomer,
    HandleSearchNamaSales,
    HandleSearchNamaSubledger,
    HandleSearchNoAkun,
    HandleSearchNoCustomer,
    HandleSearchNoSales,
    HandleSearchNoSubledger,
    TemplateNamaAkun,
    TemplateNoAkun,
    Terbilang,
} from '../functional/fungsiFormPpiList';
import {
    CekSubledger,
    CekUserApp,
    DaftarAkunDebet,
    DaftarAkunJurnal,
    DaftarSalesman,
    DaftarSupplierAll,
    ListCustFilter,
    ListEditPPIDetail,
    ListEditPPIJurnal,
    ListEditPPIMaster,
    ListSubledger,
    loadFileGambarTTD,
} from '../model/apiPpi';
import TemplateHeader from '../interface/templateHeader';
import TemplateDetail from '../interface/templateDetail';
import TemplateFooter from '../interface/templateFooter';
import { swalDialog, swalPopUp, swalToast, tabs } from '../interface/template';
import DialogDaftarAkunDebet from '../modal/DialogDaftarAkunDebet';
import DialogDaftarCust from '../modal/DialogDaftarCust';
import DialogDaftarSalesman from '../modal/DialogDaftarSalesman';
import Draggable from 'react-draggable';
import JSZip from 'jszip';
import DialogDaftarSubledger from '../modal/DialogDaftarSubledger';
import { GetListTabNoRek } from '@/lib/fa/mutasi-bank/api/api';
import { GridComponent } from '@syncfusion/ej2-react-grids';

enableRipple(true);

interface dialogPencairanWarkatProps {
    userid: any;
    kode_entitas: any;
    masterKodeDokumen: any;
    masterDataState: any;
    masterBarangProduksi: any;
    isOpen: boolean;
    onClose: any;
    onRefresh: any;
    kode_user: any;
    modalJenisPenerimaan: any;
    token: any;
    // selectedKodeSupp: any;
    onRefreshTipe: any;
    isFilePendukungPPI: any;
    setisFilePendukungPPI: Function;
}

const DialogPencairanWarkat: React.FC<dialogPencairanWarkatProps> = ({
    userid,
    kode_entitas,
    masterKodeDokumen,
    masterDataState,
    masterBarangProduksi,
    isOpen,
    onClose,
    onRefresh,
    kode_user,
    modalJenisPenerimaan,
    token,
    onRefreshTipe,
    isFilePendukungPPI,
    setisFilePendukungPPI,
}: // selectedKodeSupp,
// onRefreshTipe,
dialogPencairanWarkatProps) => {
    const router = useRouter();
    const [stateDataHeader, setStateDataHeader] = useState({
        // ============================
        // boolean Dialog modal
        disabledBayarAllFaktur: true,
        dialogDaftarAkunDebetVisible: false,
        dialogDaftarSalesmanVisible: false,
        dialogDaftarCustVisible: false,
        dialogDaftarUangMukaVisible: false,
        disabledResetPembayaran: true,
        disabledLunasSemua: false,
        disabledBatalSemua: false,
        // ============================

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
        isLedger: '',
        tipeAkunDialogVisible: 'header',
        tipeSalesmanDialogVisible: 'header',
        // ============================

        // ============================
        //Search Modal Cust
        searchNoCust: '',
        searchNamaCust: '',
        searchKeywordNoCust: '',
        searchKeywordNamaCust: '',
        //Input Value Akun Kredit
        noCustomerValue: '',
        namaCustomerValue: '',
        kodeCustomerValue: '',
        catatanValue: '',
        kodeAkunHutang: '',
        noHutang: '',
        namaHutang: '',
        tipeHutang: '',

        tipeCustDialogVisible: 'header',
        // ============================

        // ============================
        //Search Modal Sales
        searchNoSales: '',
        searchNamaSales: '',
        searchKeywordNoSales: '',
        searchKeywordNamaSales: '',

        // ============================
        // lain lain
        tipeFilterOpen: '',
        tipeFocusOpen: '',
        pilihAkunKredit: false,
        kode_salesValue: '', // value kode sales
        nama_salesValue: '', // value nama sales
        wa_salesValue: '', // value wa sales
        noDokumenValue: '', // value No Dokumen
        kursValue: '', // Value Kurs
        pelunasanPajak: false, // disable checbox Pelunasan Pajak
        jumlahBayar: '',
        terbilangJumlah: '',
        tglDokumen: moment(),
        tglBuat: moment(),
        tglReferensi: moment(),
        noReferensi: '',
        saldoKas: '',
        noBuktiTransfer: '',
        noWarkat: '',
        tglValuta: moment(),
        tglEfektif: moment(),

        tglTransaksiMutasi: '',
        jumlahMu: '',
        tipeApi: '',
        noRekeningApi: '',
        description: '',

        kodeAkunDiskon: '',
        kodeAkunKredit: '',
        debetRp: 0,

        apiId: 0,
        apiCatatan: null,
        apiPending: null,
        apiNorek: null,
        // ============================
    });
    // End

    const [images, setImages] = useState<string[][]>([]);
    const [selectedFiles, setSelectedFiles] = useState<any>([]);
    const [selectedNamaFiles, setNamaFiles] = useState<any>([]);
    const [loadFilePendukung, setLoadFilePendukung] = useState<ImageData[]>([]);
    type ExtractedFile = {
        imageUrl: string;
        fileName: string;
    };

    const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
    const [selectedNamaFilesExt1, setNamaFilesExt1] = useState('');
    const gridPpiListRef = useRef<GridComponent>(null);

    // State State Untuk Detail
    const [stateDataDetail, setStateDataDetail] = useState({
        // Upload
        activeTab: 0,
        selectedFile: 'baru',
        fileGambar: '',
        formattedName: moment().format('YYMMDDHHmmss'),
        // ============================
        // Lain Lain
        vPjk: '',
        vKodeDokumen: '',
        vMu: '',
        isChecboxPelunasanPajak: false,
        idDokumen: 0,
        jumlahFaktur: 0,
        isChecboxPilih: false,
        // ============================

        // Data Jurnal
        rowsIdJurnal: '',
        totalDebet: 0,
        totalKredit: 0,
        totalSelisih: 0,
        dialogDaftarCustomerVisible: false,
        searchNoCust: '',
        searchNamaCust: '',
        searchNamaSales: '',
        searchKeywordNoCust: '',
        searchKeywordNamaCust: '',
        searchKeywordNamaSales: '',
        activeSearchDaftarCustomer: 'namaCust',

        selectedOptionDepartemen: '',
        selectedOptionDivisi: '',

        // Data Subledger Jurnal
        dialogDaftarSubledgerVisible: false,
        searchNoSubledger: '',
        searchNamaSubledger: '',
        searchKeywordNamaSubledger: '',
        searchKeywordNoSubledger: '',

        // Cari No Surat jalan
        searchNoFj: '',
        searchKeywordNoFj: '',
        kodeValidasi: '',
        countBarcode: 0,
    });
    // End

    // State State Untuk Footer
    const [stateDataFooter, setStateDataFooter] = useState({
        // ============================
        // Lain Lain
        vKeterangan: '',
        totalPiutang: 0,
        totalPenerimaan: 0,
        sisaPiutang: 0,
        selisihAlokasiDana: 0,
        // ============================
    });
    // End

    const [dateGenerateNu, setDateGenerateNu] = useState<moment.Moment>(moment());
    type DataNode = {
        // Tambahkan properti lainnya sesuai kebutuhan
        id: number;
        kode_dokumen: string;
        id_dokumen: string;
        pay: string;
        kode_fj: string;
        no_fj: any;
        tgl_fj: any;
        lunas_mu: any;
        total_pajak_rp: any;
        kode_mu: any;
        bayar_mu: any;
        owing: any;
        pajak: string;
        lunas_awal: any;
        sisa_faktur: any;
        JT: any;
        hari: any;
        kosong: any;
        lunas_pajak: any;
        approval: any;
        koreksi: any;
        cetak_tunai: any;
        hari2: any;
        sisa_faktur2: any;

        // bayar: any;
        // byr: any;
        // total_hutang: any;
        // sisa_hutang: any;
        // faktur: any;
        // tot_pajak: any;
        // tgl_jt: any;
        // no_sj: any;
        // no_vch: any;
        // no_inv: any;
        // sisa: any;
        // jumlah_pembayaran: any;
    };

    type DataNodeJurnal = {
        id: any;
        kode_akun: any;
        no_akun: any;
        nama_akun: any;
        tipe: any;
        kode_subledger: any;
        no_subledger: any;
        nama_subledger: any;
        subledger: any;
        debet_rp: any;
        kredit_rp: any;
        kurs: any;
        mu: any;
        departemen: any;
        kode_dept: any;
        jumlah_mu: any;
        catatan: any;
        kode_jual: any;
        nama_jual: any;
    };

    const [dataBarang, setDataBarang] = useState<{ nodes: DataNode[] }>({ nodes: [] });
    const [filteredDataBarang, setFilteredDataBarang] = useState<{ nodes: DataNode[] }>({ nodes: [] });
    const [dataJurnal, setDataJurnal] = useState<{ nodes: DataNodeJurnal[] }>({ nodes: [] });

    const [dataDaftarAkunDebet, setDataDaftarAkunDebet] = useState<any[]>([]);
    const [dataDaftarSalesman, setDataDaftarSalesman] = useState<any[]>([]);
    const dataDaftarSalesmanRef = useRef<any[]>([]);
    const [dataDaftarCust, setDataDaftarCust] = useState<any[]>([]);
    const [dataDaftarCustomer, setDataDaftarCustomer] = useState<any[]>([]);
    const [dataDaftarUangMuka, setDataDaftarUangMuka] = useState<any[]>([]);
    const [dataDaftarSubledger, setDataDaftarSubledger] = useState<any[]>([]);
    const [filteredDataAkunDebet, setFilteredDataAkunDebet] = useState<any[]>([]);
    const [filteredDataSalesman, setFilteredDataSalesman] = useState<any[]>([]);
    const [filteredDataCust, setFilteredDataCust] = useState<any[]>([]);
    const [filteredDataCustomer, setFilteredDataCustomer] = useState<any[]>([]);
    const [filteredDataSubledger, setFilteredDataSubledger] = useState<any[]>([]);
    const [listDepartement, setListDepartement] = useState<any[]>([]);
    const [listDivisi, setListDivisi] = useState<any[]>([]);
    const [idDokumen, setIdDokumen] = useState(0);
    const [tipeAdd, setTipeAdd] = useState('');
    const [dataDetailNoFakturPpi, setDataDetailNoFakturPpi] = useState<any[]>([]);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    useEffect(() => {
        const dialogElement = document.getElementById('dialogPhuList');
        if (dialogElement) {
            dialogElement.style.maxHeight = 'none';
            dialogElement.style.maxWidth = 'none';
        }
    }, []);

    const [showLoader, setShowLoader] = useState(true);
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

    // const tabs = [
    //     { title: 'Bukti TTP Tidak Lengkap', content: 'Content 1' },
    //     { title: 'Bukti TTP Lengkap', content: 'Content 2' },
    //     { title: 'Bukti Transfer', content: 'Content 3' },
    // ];

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

    const closeDialogPpiList = async () => {
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
        // await onRefreshTipe(kodeDokumen);
    };

    const ReCallRefreshModal = async () => {
        const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
        if (jumlahBayar) {
            jumlahBayar.value = '';
        }
        const cariNoSj = document.getElementById('cariNoSj') as HTMLInputElement;
        if (cariNoSj) {
            cariNoSj.value = '';
        }
        await setStateDataHeader((prevState) => ({
            ...prevState,
            // boolean Dialog modal
            disabledBayarAllFaktur: true,
            dialogDaftarAkunDebetVisible: false,
            dialogDaftarSalesmanVisible: false,
            dialogDaftarCustVisible: false,
            dialogDaftarUangMukaVisible: false,
            disabledResetPembayaran: true,
            disabledLunasSemua: false,
            disabledBatalSemua: false,
            // ============================

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
            isLedger: '',
            tipeAkunDialogVisible: 'header',
            tipeSalesmanDialogVisible: 'header',
            // ============================

            // ============================
            //Search Modal Supplier
            searchNoCust: '',
            searchNamaCust: '',
            searchKeywordNoCust: '',
            searchKeywordNamaCust: '',
            //Input Value Akun Kredit
            noCustomerValue: '',
            namaCustomerValue: '',
            kodeCustomerValue: '',
            catatanValue: '',
            kodeAkunHutang: '',
            noHutang: '',
            namaHutang: '',
            tipeHutang: '',

            tipeCustDialogVisible: 'header',
            // ============================

            // ============================
            //Search Modal Sales
            searchNoSales: '',
            searchNamaSales: '',
            searchKeywordNoSales: '',
            searchKeywordNamaSales: '',

            // ============================
            // lain lain
            tipeFilterOpen: '',
            tipeFocusOpen: '',
            pilihAkunKredit: false,
            kode_salesValue: '', // value kode sales
            nama_salesValue: '', // value nama sales
            wa_salesValue: '', // value wa sales
            noDokumenValue: '', // value No Dokumen
            kursValue: '', // Value Kurs
            pelunasanPajak: false, // disable checbox Pelunasan Pajak
            jumlahBayar: '',
            terbilangJumlah: '',
            tglDokumen: moment(),
            tglBuat: moment(),
            tglReferensi: moment(),
            noReferensi: '',
            saldoKas: '',
            noBuktiTransfer: '',
            noWarkat: '',
            tglValuta: moment(),
            // ============================
        }));

        await setStateDataDetail((prevState) => ({
            ...prevState,
            // Lain Lain
            vPjk: '',
            vKodeDokumen: '',
            vMu: '',
            isChecboxPelunasanPajak: false,
            idDokumen: 0,
            jumlahFaktur: 0,
            isChecboxPilih: false,
            // ============================

            // Data Jurnal
            rowsIdJurnal: '',
            totalDebet: 0,
            totalKredit: 0,
            totalSelisih: 0,
            dialogDaftarCustomerVisible: false,
            searchNoCust: '',
            searchNamaCust: '',
            searchNamaSales: '',
            searchKeywordNoCust: '',
            searchKeywordNamaCust: '',
            searchKeywordNamaSales: '',
            activeSearchDaftarCustomer: 'namaCust',

            selectedOptionDepartemen: '',
            selectedOptionDivisi: '',

            // Data Subledger Jurnal
            dialogDaftarSubledgerVisible: false,
            searchNoSubledger: '',
            searchNamaSubledger: '',
            searchKeywordNamaSubledger: '',
            searchKeywordNoSubledger: '',

            // Cari No Surat jalan
            searchNoFj: '',
            searchKeywordNoFj: '',
        }));

        await setStateDataFooter((prevState) => ({
            ...prevState,
            vKeterangan: '',
            totalPiutang: 0,
            totalPenerimaan: 0,
            sisaPiutang: 0,
            selisihAlokasiDana: 0,
        }));

        await setDataBarang((state: any) => ({
            ...state,
            nodes: [],
        }));

        await setDataJurnal((state: any) => ({
            ...state,
            nodes: [],
        }));
        setisFilePendukungPPI('');
    };

    let buttonInputData: ButtonPropsModel[];
    buttonInputData = [
        {
            buttonModel: {
                content: 'Tutup',
                cssClass: 'e-danger e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: closeDialogPpiList,
        },
    ];

    function terbilang(nilaiDefault: any) {
        const result = CurrencyFormat(nilaiDefault);
        // Fungsi untuk mengonversi karakter pertama menjadi huruf kapital
        const capitalizeFirstLetter = (str: any) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        // Kata yang ingin diubah
        const originalString = Terbilang(nilaiDefault);

        // Mengonversi karakter pertama menjadi huruf kapital
        const capitalizedString = capitalizeFirstLetter(originalString);
        return capitalizedString;
    }

    const refreshDatasource = async () => {
        setShowLoader(true);
        let jumlah_Bayar: any;
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                await fetchPreferensi(kode_entitas, apiUrl)
                    .then((result) => {
                        setStateDataHeader((prevState: any) => ({
                            ...prevState,

                            noPiutang: result[0].no_piutang,
                            namaPiutang: result[0].nama_piutang,
                            kodeAkunPiutang: result[0].kode_akun_piutang,
                            tipePiutang: result[0].tipe_piutang,

                            kodeAkunPiutangBg: result[0].kode_akun_piutang_bg,
                            noAkunPiutangBg: result[0].no_piutang_bg,
                            namaAkunPiutangBg: result[0].nama_piutang_bg,
                            tipeAkunPiutangBg: result[0].tipe_piutang_bg,

                            // noAkunValue: result[0].no_piutang_bg,
                            // namaAkunValue: result[0].nama_piutang_bg,
                            // kodeAkun: result[0].kode_akun_piutang_bg,
                            // tipeAkun: result[0].tipe_piutang_bg,
                        }));
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                await FillFromSQL(kode_entitas, 'departemen')
                    .then((result) => {
                        setListDepartement(result);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

                const response = await axios.get(`${apiUrl}/erp/kode_jual`, {
                    params: {
                        entitas: kode_entitas,
                    },
                });
                const responseListAreaJual = response.data.data;
                setListDivisi(responseListAreaJual);

                if (masterDataState == 'BARU') {
                    // await ReCallRefreshModal();
                    await generateNU(kode_entitas, '', '19', dateGenerateNu.format('YYYYMM'))
                        .then((result) => {
                            setStateDataHeader((prevState: any) => ({
                                ...prevState,
                                noDokumenValue: result,
                            }));
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                    const resultDaftarSalesman: any[] = await DaftarSalesman(token, kode_entitas, 'header');
                    dataDaftarSalesmanRef.current = resultDaftarSalesman;
                    await setDataDaftarSalesman(resultDaftarSalesman);

                    // await fetchPreferensi(kode_entitas, apiUrl)
                    //     .then((result) => {
                    //         setStateDataHeader((prevState: any) => ({
                    //             ...prevState,
                    //             noAkunValue: result[0].no_piutang_bg,
                    //             namaAkunValue: result[0].nama_piutang_bg,
                    //             kodeAkun: result[0].kode_akun_piutang_bg,
                    //             tipeAkun: result[0].tipe_piutang_bg,

                    //             kodeAkunPiutangBg: result[0].kode_akun_piutang_bg,
                    //             noAkunPiutangBg: result[0].no_piutang_bg,
                    //             namaAkunPiutangBg: result[0].nama_piutang_bg,
                    //             tipeAkunPiutangBg: result[0].tipe_piutang_bg,
                    //         }));
                    //     })
                    //     .catch((error) => {
                    //         console.error('Error:', error);
                    //     });
                } else {
                    const resultListEditPPIMaster: any[] = await ListEditPPIMaster(kode_entitas, masterKodeDokumen, '0', '100', token);
                    const resultListEditPPIDetail: any[] = await ListEditPPIDetail(kode_entitas, masterKodeDokumen, '0', '100', token);
                    await resultListEditPPIMaster.map((item: any) => {
                        setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            tglBuat: moment(item.tgl_trxdokumen),
                            tglDokumen: moment(item.tgl_dokumen),
                            noDokumenValue: item.no_dokumen,

                            kodeAkun: modalJenisPenerimaan === 'Edit Pencairan' ? item.kode_akun_debet : '',
                            noAkunValue: modalJenisPenerimaan === 'Edit Pencairan' ? item.no_akun : '',
                            namaAkunValue: modalJenisPenerimaan === 'Edit Pencairan' ? item.nama_akun : '',

                            kodeCustomerValue: item.kode_cust,
                            noCustomerValue: item.no_cust,
                            namaCustomerValue: item.nama_cust,

                            kode_salesValue: item.kode_sales,
                            nama_salesValue: item.nama_sales,

                            jumlahBayar: item.jumlah_mu,
                            saldoKas: frmNumber(item.balance),
                            kursValue: frmNumber(item.kurs),
                            terbilangJumlah: terbilang(parseFloat(item.jumlah_mu)),
                            noReferensi: item.no_TTP,
                            noWarkat: item.no_warkat,
                            tglReferensi: moment(item.tgl_TTP),
                            tglValuta: moment(item.tgl_valuta),
                            catatanValue: item.ket_cust,
                            kodeAkunDiskon: item.kode_akun_diskon,
                            kodeAkunKredit: item.kode_akun_kredit,
                            debetRp: item.debet_rp,

                            apiId: item.api_id,
                            apiCatatan: item.api_catatan,
                            apiPending: item.api_pending,
                            apiNorek: item.api_norek,
                        }));

                        const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
                        if (jumlahBayar) {
                            jumlahBayar.value = frmNumber(item.jumlah_mu);
                        }

                        const noReferensi = document.getElementById('noReferensi') as HTMLInputElement;
                        if (noReferensi) {
                            noReferensi.value = item.no_TTP;
                        }

                        const noBuktiTransfer = document.getElementById('noBuktiTransfer') as HTMLInputElement;
                        if (noBuktiTransfer) {
                            noBuktiTransfer.value = item.no_warkat;
                        }

                        setStateDataFooter((prevState: any) => ({
                            ...prevState,
                            vKeterangan: item.catatan,
                        }));

                        const vKeterangan = document.getElementById('vKeterangan') as HTMLInputElement;
                        if (vKeterangan) {
                            vKeterangan.value = item.catatan;
                        }

                        setStateDataDetail((prevState: any) => ({
                            ...prevState,
                            kodeValidasi: item.barcode,
                        }));

                        jumlah_Bayar = item.jumlah_mu;
                    });

                    const detail = await resultListEditPPIDetail.map((item: any) => {
                        return {
                            id: item.id_dokumen,
                            kode_dokumen: item.kode_dokumen,
                            id_dokumen: item.id_dokumen,
                            pay: item.pay,

                            kode_fj: item.kode_fj,
                            no_fj: item.no_fj,
                            tgl_fj: item.tgl_fj,
                            netto_mu: parseFloat(item.netto_mu),
                            lunas_mu: parseFloat(item.lunas_mu),
                            total_pajak_rp: parseFloat(item.total_pajak_rp),
                            kode_mu: item.kode_mu,
                            bayar_mu: parseFloat(item.bayar_mu),
                            owing: parseFloat(item.owing),
                            pajak: item.pajak,
                            lunas_awal: item.Lunas_awal,
                            sisa_faktur: parseFloat(item.sisaPiutangFaktur2),
                            JT: item.JT,
                            hari: item.hari,
                            kosong: item.kosong,
                            lunas_pajak: item.lunas_pajak,
                            approval: item.approval,
                            koreksi: item.koreksi,
                            cetak_tunai: item.cetak_tunai,
                            hari2: item.hari2,
                            sisa_faktur2: parseFloat(item.sisaPiutangFaktur2),
                        };
                    });
                    await setDataBarang({ nodes: detail });
                    // await setEditDataBarang({ nodes: detail });

                    if (modalJenisPenerimaan === 'Edit Pencairan') {
                        const resultListEditPPIJurnal: any[] = await ListEditPPIJurnal(kode_entitas, masterKodeDokumen, '100', '199', token);
                        const jurnal = await resultListEditPPIJurnal.map((item: any) => {
                            return {
                                id: item.id_dokumen,
                                kode_akun: item.kode_akun,
                                no_akun: item.no_akun,
                                nama_akun: item.nama_akun,
                                tipe: item.tipe,
                                kode_subledger: item.kode_subledger,
                                no_subledger: item.no_subledger,
                                nama_subledger: item.nama_subledger,
                                subledger: item.nama_subledger,
                                debet_rp: parseFloat(item.debet_rp),
                                kredit_rp: parseFloat(item.kredit_rp),
                                kurs: parseFloat(item.kurs),
                                mu: item.kode_mu,
                                departemen: item.nama_dept,
                                kode_dept: item.kode_dept,
                                jumlah_mu: parseFloat(item.jumlah_mu),
                                // catatan: modalJenisPembayaran === 'Transfer' && kode_entitas === '898' ? stateDataHeader?.noBuktiTransfer+' atas : '+stateDataHeader?.namaSupplierValue : stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                                catatan: item.catatan,
                                kode_jual: item.kode_jual,
                                nama_jual: item.kode_jual, // ini ganti jadi nama_jual
                            };
                        });

                        await setDataJurnal({ nodes: jurnal });
                        // await setEditDataJurnal(jurnal);
                        await GenerateTotalJurnalEdit(jurnal, setDataJurnal, setStateDataDetail);
                    }

                    await setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        jumlahFaktur: resultListEditPPIDetail.length,
                    }));

                    let totPenerimaan: any;
                    let totPiutang: any;
                    let totSisaPiutang: any;

                    totPenerimaan = await resultListEditPPIDetail.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.bayar_mu);
                    }, 0);

                    totPiutang = await resultListEditPPIDetail.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.owing);
                    }, 0);

                    totSisaPiutang = await resultListEditPPIDetail.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.sisaPiutangFaktur2);
                    }, 0);

                    // await setStateDataFooter((prevState: any) => ({
                    //     ...prevState,
                    //     totalPenerimaan: totPenerimaan,
                    //     selisihAlokasiDana: parseFloat(jumlah_Bayar === '' ? '0' : jumlah_Bayar) - parseFloat(totPenerimaan),
                    //     // sisaHutang: totHutang - totPembayaran,
                    //     sisaPiutang: totPiutang,
                    //     // totalHutang: totHutang,
                    //     totalPiutang: totPiutang + totPenerimaan,
                    // }));

                    await setStateDataFooter((prevState: any) => ({
                        ...prevState,
                        totalPenerimaan: totPenerimaan,
                        selisihAlokasiDana: parseFloat(jumlah_Bayar === '' ? '0' : jumlah_Bayar) - parseFloat(totPenerimaan),
                        // sisaHutang: totHutang - totPembayaran,
                        // sisaPiutang: totPiutang,
                        sisaPiutang: totSisaPiutang,
                        // totalHutang: totHutang,
                        // totalPiutang: totPiutang + totPenerimaan,
                        totalPiutang: totPiutang,
                    }));
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

    useEffect(() => {
        refreshDatasource();
    }, [onRefreshTipe]);
    // End

    const onClickAutoJurnal = async (tipe: any, gridJurnalPpiListRef: any, idJurnal: any) => {
        let TipeData: any;
        if (tipe === 'autoJurnal') {
            TipeData = tipe;
        } else if (tipe === 'delete') {
            TipeData = tipe;
        } else if (tipe === 'deleteAll') {
            TipeData = tipe;
        }

        if (masterBarangProduksi === 'Y') {
            DetailNoFakturJurnalPencairanWarkat(
                TipeData,
                kode_entitas,
                stateDataHeader?.namaAkunValue,
                // respDaftarAkunKreditFix[0].nama_akun,
                setStateDataHeader,
                setDataDaftarAkunDebet,
                setDataDaftarCust,
                stateDataHeader?.kodeCustomerValue,
                setDataDaftarUangMuka,
                dataBarang,
                stateDataHeader?.jumlahBayar,
                // masterBarangProduksi?.jumlahMu,
                modalJenisPenerimaan,
                setDataJurnal,
                stateDataHeader,
                gridJurnalPpiListRef, //gridJurnalListRef.current
                setStateDataDetail,
                dataJurnal,
                setDataDaftarCustomer,
                setDataDaftarSubledger,
                setDataDaftarSalesman,
                idDokumen,
                tipeAdd,
                masterDataState,
                '', //editDataJurnal
                token,
                idJurnal
            );
        } else {
            const respListTabNoRek = await GetListTabNoRek(kode_entitas, token);
            const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === masterBarangProduksi?.noRekeningApi);

            const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
            const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0].kode_akun);
            const updatedState = {
                ...stateDataHeader,
                noAkunValue: respDaftarAkunKreditFix[0]?.no_akun,
                namaAkunValue: respDaftarAkunKreditFix[0]?.nama_akun,
                kodeAkun: respDaftarAkunKreditFix[0]?.kode_akun,
                tipeAkun: respDaftarAkunKreditFix[0]?.tipe,
                isLedger: respDaftarAkunKreditFix[0]?.isledger,
                jumlahBayar: masterBarangProduksi?.jumlahMu,
                // tglDokumen: moment(masterBarangProduksi?.tglTransaksiMutasi),
            };

            // setStateDataHeader(updatedState);

            DetailNoFakturJurnalPencairanWarkat(
                TipeData,
                kode_entitas,
                // stateDataHeader?.namaAkunValue,
                respDaftarAkunKreditFix[0].nama_akun,
                setStateDataHeader,
                setDataDaftarAkunDebet,
                setDataDaftarCust,
                stateDataHeader?.kodeCustomerValue,
                setDataDaftarUangMuka,
                dataBarang,
                // stateDataHeader?.jumlahBayar,
                masterBarangProduksi?.jumlahMu,
                modalJenisPenerimaan,
                setDataJurnal,
                masterBarangProduksi === 'Y' ? stateDataHeader : updatedState,
                gridJurnalPpiListRef, //gridJurnalListRef.current
                setStateDataDetail,
                dataJurnal,
                setDataDaftarCustomer,
                setDataDaftarSubledger,
                setDataDaftarSalesman,
                idDokumen,
                tipeAdd,
                masterDataState,
                '', //editDataJurnal
                token,
                idJurnal
            );
        }
    };

    const [indexPreview, setIndexPreview] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState<any>(null);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [zoomScale, setZoomScale] = useState(0.5);

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

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

    const handleZoomIn = () => {
        setZoomScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
    };

    const handleZoomOut = () => {
        setZoomScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
    };

    const handleCloseZoom = () => {
        setIsOpenPreview(false);
    };

    const [showPreviewTTDModal, setShowPreviewTTDModal] = useState(false);
    const [selectedImagesOwner, setSelectedImagesOwner] = useState('');
    const [modalPositionTTD] = useState({ top: '10%', left: '15%', background: '#dedede' });

    const viewTTDDialog = async () => {
        await setShowPreviewTTDModal(true);
        setSelectedImagesOwner('?');
        const load = await loadFileGambarTTD(kode_entitas, '', stateDataHeader?.kodeCustomerValue);
        if (load.length > 0 && stateDataHeader?.kodeCustomerValue !== '') {
            // if (load[0].st === '0') {
            setSelectedImagesOwner(load[1].fileGambarDecodeBase64_string);
            //  }
        } else {
            swal.fire({
                title: 'Spesimen TTD di Master customer tidak tersedia',
                icon: 'error',
            });
            throw 'exit';
        }
    };

    const cancelPreviewTTD = () => {
        setShowPreviewTTDModal(false);
        // setSelectedImages([]);
    };

    const dokumenId = useRef(0);
    const tipe_Add = useRef('');
    const letIdDokumen = 1;

    const handleAddDetailJurnal = async (handleAddDetailJurnal: any) => {
        const idList = dataJurnal.nodes.map((node: any) => node.id);
        const maxId = Math.max(...idList);
        const id = maxId + 1;
        if (stateDataHeader?.namaAkunValue === '') {
            withReactContent(swalDialog)
                .fire({
                    title: '<p style="font-size:12px">Akun Kredit belum diisi.</p>',
                    width: '11%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'OK',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        await HandleModalicon(
                            'header',
                            'akunKredit',
                            setStateDataHeader,
                            setDataDaftarAkunDebet,
                            setDataDaftarCust,
                            kode_entitas,
                            stateDataHeader?.kodeCustomerValue,
                            setDataDaftarUangMuka,
                            '',
                            setStateDataDetail,
                            setDataDaftarCustomer,
                            setDataDaftarSubledger,
                            setDataDaftarSalesman,
                            idDokumen,
                            'add',
                            token
                        );
                        await setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunKreditVisible: true,
                        }));
                    }
                });
            return;
        } else {
            if (idList.length > 0) {
                dokumenId.current = id;
                tipe_Add.current = 'add';
            } else {
                dokumenId.current = letIdDokumen;
                tipe_Add.current = 'add';
            }

            const hasTwoSpecificNodes = dataJurnal.nodes.filter((node: any) => (node.tipe === 'Hutang' || node.tipe === 'Piutang') && node.subledger === '');
            const dataDebetKreditSome = dataJurnal.nodes.some((node: any) => node.debet_rp === 0 && node.kredit_rp === 0);
            const cekNoAkun = dataJurnal.nodes.filter((node: any) => node.debet_rp === 0 && node.kredit_rp === 0);
            if (dataDebetKreditSome === true) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px;color:white;">Nilai debet atau kredit belum diisi untuk No Akun : ${cekNoAkun[0].no_akun}</p>`,
                    width: '100%',
                    target: '#dialogPhuList',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }

            if (hasTwoSpecificNodes.length > 0) {
                const resultCekSubledger: any[] = await CekSubledger(kode_entitas, hasTwoSpecificNodes[0].kode_akun);
                if (resultCekSubledger[0].tipe === 'hutang') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">No. Akun mempunyai subsidiary ledger.</p>',
                        width: '100%',
                        target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else if (resultCekSubledger[0].tipe === 'piutang') {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">No. Akun mempunyai subsidiary ledger.</p>',
                        width: '100%',
                        target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                }
            }

            const newNode = {
                id_ppi: dokumenId.current,
                id: dokumenId.current,
                kode_akun: '',
                no_akun: '',
                nama_akun: '',
                tipe: '',
                kode_subledger: '',
                no_subledger: '',
                nama_subledger: '',
                subledger: '',
                debet_rp: 0,
                kredit_rp: 0,
                kurs: '',
                mu: '',
                departemen: '',
                kode_dept: '',
                jumlah_mu: '',
                catatan: '',
            };

            const hasEmptyFields = dataJurnal.nodes.some((row: { no_akun: string }) => row.no_akun === '');

            if (!hasEmptyFields) {
                setDataJurnal((state: any) => ({
                    ...state,
                    nodes: state.nodes.concat(newNode),
                }));
                handleAddDetailJurnal?.addRecord();
            } else {
                // alert('Harap isi nama barang sebelum tambah data');
                document.getElementById('gridJurnalList')?.focus();
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px;color:white;">Harap isi no Akun sebelum tambah data</p>',
                    width: '100%',
                    target: '#dialogJurnalList',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            }
        }
    };

    // Jurnal
    const onClickTemplateAkun = async (args: any) => {
        let tipeAdd: any;
        const resultDaftarAkunDebet: any[] = await DaftarAkunJurnal(kode_entitas, kode_user, stateDataHeader?.kodeAkun, token);
        setDataDaftarAkunDebet(resultDaftarAkunDebet);
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunDebetVisible: true,
            tipeAkunDialogVisible: 'akunJurnal',
        }));
        if (args.no_akun === undefined) {
            tipeAdd = tipe_Add.current;
        } else {
            tipeAdd = '';
        }
        setStateDataDetail((prevState: any) => ({
            ...prevState,
            // rowsIdJurnal: dokumenId.current,
            rowsIdJurnal: tipeAdd === 'add' ? dokumenId.current : args.id,
        }));
    };

    const onClickSubsidiaryLedger = async (args: any) => {
        if (args.no_akun === undefined) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Akun Belum dipilih</p>',
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        } else {
            const resultCekSubledger: any[] = await CekSubledger(kode_entitas, args.kode_akun);
            if (resultCekSubledger[0].tipe === 'hutang') {
                const resultDaftarCust: any[] = await DaftarSupplierAll(kode_entitas);
                await setDataDaftarCust(resultDaftarCust);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarCustVisible: true,
                    tipeSupplierDialogVisible: 'akunSubledger',
                }));
                await setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    rowsIdJurnal: args.id,
                }));
            } else if (resultCekSubledger[0].tipe === 'piutang') {
                const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, 'all', 'all', 'all');
                await setDataDaftarCust(resultDaftarCustomer);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarCustVisible: true,
                    tipeCustDialogVisible: 'akunSubledger',
                }));
                await setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    rowsIdJurnal: args.id,
                }));
            } else if (resultCekSubledger[0].subledger === 'Y') {
                const resultListSubledger: any[] = await ListSubledger(kode_entitas, args.kode_akun);
                await setDataDaftarSubledger(resultListSubledger);
                await setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSubledgerVisible: true,
                    rowsIdJurnal: args.id,
                }));
            } else {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px; color:white;">No. Akun ${args.no_akun} tidak mempunyai subsidiary ledger</p>`,
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                    target: '#dialogPhuList',
                });
            }
        }
        // await HandleModalicon(
        //     'akunSubledger',
        //     'subledger',
        //     setStateDataHeader,
        //     setDataDaftarAkunDebet,
        //     setDataDaftarCust,
        //     kode_entitas,
        //     stateDataHeader?.kodeCustomerValue,
        //     setDataDaftarUangMuka,
        //     args,
        //     setStateDataDetail,
        //     setDataDaftarCustomer,
        //     setDataDaftarSubledger,
        //     setDataDaftarSalesman,
        //     idDokumen,
        //     tipeAdd,
        //     token
        // );
    };

    // Fungsi untuk memeriksa apakah ada tabIndex 0 dan 1
    function hasTabIndex0And1(selectedFiles: any[]): boolean {
        const tabIndexes = selectedFiles.map((item: any) => item.tabIndex);
        return tabIndexes.includes(2);
    }

    const handleUploadZip = async (kode_dokumen: any) => {
        const formData = new FormData();
        const jsonData = [];
        const zip = new JSZip();
        let entitas;
        let namaFileImage: any;

        for (let index = 0; index < selectedFiles.length; index++) {
            const fileWithTabIdx = selectedFiles[index];
            const file = fileWithTabIdx.file;
            const tabIdx = fileWithTabIdx.tabIndex;
            const fileExtension = file.name.split('.').pop();

            // formData.append(`nama_file_image`, selectedFile !== 'update' ? `SP${selectedNamaFiles[index]}.${fileExtension}` : fileGambar);
            const fileNameWithExtension = masterDataState !== 'BARU' ? `PU${selectedNamaFiles[index]}.${fileExtension}` : `PU${selectedNamaFiles[index]}.${fileExtension}`;
            namaFileImage = fileNameWithExtension;

            const arrayBuffer = await new Response(file).arrayBuffer();
            // Menambahkan file ke dalam zip dengan ekstensi yang sesuai
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
                jsonData.push(jsonEntry);
            }
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
        // console.log('JsonInput = ', jsonData);

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

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isDataFetchedReload, setIsDataFetchedReload] = useState(false);

    const Data = async () => {
        if (masterBarangProduksi === 'Y') {
            const ResDetailNoFakturJurnalPencairanWarkat = await DetailNoFakturJurnalPencairanWarkat(
                'autoJurnal',
                kode_entitas,
                stateDataHeader?.namaAkunValue,
                setStateDataHeader,
                setDataDaftarAkunDebet,
                setDataDaftarCust,
                stateDataHeader?.kodeCustomerValue,
                setDataDaftarUangMuka,
                dataBarang,
                stateDataHeader?.jumlahBayar,
                modalJenisPenerimaan,
                setDataJurnal,
                stateDataHeader,
                '', //gridJurnalListRef.current
                setStateDataDetail,
                dataJurnal,
                setDataDaftarCustomer,
                setDataDaftarSubledger,
                setDataDaftarSalesman,
                idDokumen,
                tipeAdd,
                masterDataState,
                '', //editDataJurnal
                token,
                ''
            );
            return ResDetailNoFakturJurnalPencairanWarkat;
        } else {
            const respListTabNoRek = await GetListTabNoRek(kode_entitas, token);
            const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === masterBarangProduksi?.noRekeningApi);

            const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
            const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0].kode_akun);
            const updatedState = {
                ...stateDataHeader,
                noAkunValue: respDaftarAkunKreditFix[0]?.no_akun,
                namaAkunValue: respDaftarAkunKreditFix[0]?.nama_akun,
                kodeAkun: respDaftarAkunKreditFix[0]?.kode_akun,
                tipeAkun: respDaftarAkunKreditFix[0]?.tipe,
                isLedger: respDaftarAkunKreditFix[0]?.isledger,
                jumlahBayar: masterBarangProduksi?.jumlahMu,
                // tglDokumen: moment(masterBarangProduksi?.tglTransaksiMutasi),
            };

            // setStateDataHeader(updatedState);

            const ResDetailNoFakturJurnalPencairanWarkat = await DetailNoFakturJurnalPencairanWarkat(
                'autoJurnal',
                kode_entitas,
                respDaftarAkunKreditFix[0].nama_akun,
                setStateDataHeader,
                setDataDaftarAkunDebet,
                setDataDaftarCust,
                stateDataHeader?.kodeCustomerValue,
                setDataDaftarUangMuka,
                dataBarang,
                masterBarangProduksi?.jumlahMu,
                modalJenisPenerimaan,
                setDataJurnal,
                masterBarangProduksi === 'Y' ? stateDataHeader : updatedState,
                '', //gridJurnalListRef.current
                setStateDataDetail,
                dataJurnal,
                setDataDaftarCustomer,
                setDataDaftarSubledger,
                setDataDaftarSalesman,
                idDokumen,
                tipeAdd,
                masterDataState,
                '', //editDataJurnal
                token,
                ''
            );

            return ResDetailNoFakturJurnalPencairanWarkat;
        }
    };

    let updatedState: any;
    const updateStateRef = useRef('');
    useEffect(() => {
        if (isDataFetched) {
            setIsDataFetched(false); // Reset flag
            saveDoc(updateStateRef.current);
        }
    }, [dataJurnal, isDataFetched]);

    useEffect(() => {
        if (isDataFetchedReload) {
            setIsDataFetchedReload(false); // Reset flag
            closeDialogPpiList();
        }
    }, [isDataFetchedReload]);

    const prosesBlokingTerbaru = () => {
        const promises = dataJurnal.nodes.map(async (item: any) => {
            const result = await CekSubledger(kode_entitas, item.kode_akun);
            console.log('result = ', result);
            if (result[0].subledger === 'Y' && (item.subledger === '' || item.subledger === null || item.subledger === undefined)) {
                const data = {
                    status: true,
                    no_akun: item.no_akun,
                };
                return data;
            } else if (
                (item.tipe === 'Hutang' && (item.subledger === '' || item.subledger === null || item.subledger === undefined)) ||
                (item.tipe === 'Piutang' && (item.subledger === '' || item.subledger === null || item.subledger === undefined)) ||
                item.subledger === 'Y'
            ) {
                const data = {
                    status: true,
                    no_akun: item.no_akun,
                };
                return data;
            }
            return false;
        });

        // Menangani hasil promises
        Promise.all(promises).then((statuses) => {
            // Filter semua item dengan status true
            const trueItems = statuses.filter((item) => {
                return typeof item === 'object' && item !== null && item.status === true;
            });

            if (trueItems.length > 0) {
                // Gabungkan semua no_akun dari elemen yang memenuhi syarat
                const noAkunList = trueItems.map((item: any) => item.no_akun).join(', ');

                // Tampilkan alert satu kali dengan daftar no_akun
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px;color:white;">No. Akun mempunyai subsidiary ledger. No Akun: ${noAkunList}.</p>`,
                    width: '100%',
                    target: '#dialogPhuList',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            } else {
                prosesBloking();
                console.log('All accounts have subledger N.');
            }

            console.log('data = ', statuses);
        });
    };

    const prosesBloking = async () => {
        const dataDebetKreditSome = dataJurnal.nodes.some((node: any) => node.debet_rp === 0 && node.kredit_rp === 0);
        const cekNoAkun = dataJurnal.nodes.filter((node: any) => node.debet_rp === 0 && node.kredit_rp === 0);
        if (dataDebetKreditSome === true) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;">Nilai debet atau kredit belum diisi untuk No Akun : ${cekNoAkun[0].no_akun}</p>`,
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        // console.log('stateDataHeader = ', stateDataHeader);
        if (dataJurnal.nodes.length > 0) {
            // cek Nilai Jurnal
            // Menjumlahkan total debet_rp
            const totalDebet = dataJurnal.nodes.reduce((sum: any, row: any) => sum + row.debet_rp, 0);

            // Menjumlahkan total kredit_rp
            const totalKredit = dataJurnal.nodes.reduce((sum: any, row: any) => sum + row.kredit_rp, 0);

            // Jika total debet dan kredit tidak sama, lakukan blokir atau peringatan
            if (totalDebet.toFixed(2) !== totalKredit.toFixed(2)) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px;color:white">Nilai jurnal berbeda dengan nilai dokumen, periksa kembali</p>',
                    width: '100%',
                    target: '#dialogPhuList',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }

            // // Jika total debet dan kredit sama, bandingkan dengan state lain
            // const stateLain = parseFloat(stateDataHeader?.jumlahBayar); // Misalkan state lain yang ingin kamu bandingkan
            // if (totalDebet !== stateLain && totalKredit !== stateLain) {
            //     withReactContent(swalToast).fire({
            //         icon: 'warning',
            //         title: '<p style="font-size:12px;color:white">Nilai jurnal berbeda dengan nilai dokumen, periksa kembali</p>',
            //         width: '100%',
            //         target: '#dialogPhuList',
            //         customClass: {
            //             popup: styles['colored-popup'], // Custom class untuk sweetalert
            //         },
            //     });
            //     return;
            // }
            // End
        }

        const inputTanggal = moment(stateDataHeader?.tglDokumen).format('YYYY-MM-DD'); // contoh tanggal input
        const adaTanggalLebihBesar = dataBarang.nodes.some((item: any) => {
            const tanggalItem = moment(item.tgl_fb).format('YYYY-MM-DD'); // asumsi item.tanggal dalam format yang bisa diubah ke Date

            return tanggalItem > inputTanggal && parseFloat(item.jumlah_pembayaran) > 0;
        });

        if (masterBarangProduksi?.tipeApi === 'APIWarkat') {
            const respListTabNoRek = await GetListTabNoRek(kode_entitas, token);
            const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === masterBarangProduksi?.noRekeningApi);

            const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
            const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0]?.kode_akun);

            const tglEfektif = moment(masterBarangProduksi?.tglTransaksiMutasi).format('YYYY-MM-DD HH:mm:ss');

            const updatedTglEfektif = moment(tglEfektif)
                .set({
                    hour: moment().hour(),
                    minute: moment().minute(),
                    second: moment().second(),
                })
                .format('YYYY-MM-DD HH:mm:ss');

            updatedState = {
                noAkunValue: respDaftarAkunKreditFix[0]?.no_akun,
                namaAkunValue: respDaftarAkunKreditFix[0]?.nama_akun,
                kodeAkun: respDaftarAkunKreditFix[0]?.kode_akun,
                tipeAkun: respDaftarAkunKreditFix[0]?.tipe,
                isLedger: respDaftarAkunKreditFix[0]?.isledger,
                jumlahBayar: masterBarangProduksi?.jumlahMu,
                tglDokumen: moment(stateDataHeader?.tglDokumen).format('YYYY-MM-DD HH:mm:ss'),
                tglEfektif: updatedTglEfektif,
            };

            updateStateRef.current = updatedState;

            // setStateDataHeader(updatedState); // Pastikan Anda menggunakan metode untuk memperbarui state
        }

        const resultTglMinusSatu = await CekTglMinusSatu(masterBarangProduksi === 'Y' ? stateDataHeader?.tglDokumen : updatedState.tglDokumen);

        if (resultTglMinusSatu === true) {
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
                    title: `<p style="font-size:12px">Tanggal lebih kecil dari hari ini, transaksi akan dilanjutkan ?</span></p>`,
                    width: '16.4%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No', // Menambahkan teks tombol cancel
                    showCancelButton: true, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        saveDoc(updatedState);
                    }
                });
            return;
        }

        const resultCekTglBackDate = await CekTglBackDate(masterBarangProduksi === 'Y' ? stateDataHeader?.tglDokumen : updatedState.tglDokumen);
        if (resultCekTglBackDate === true) {
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
                    title: `<p style="font-size:12px">Tanggal lebih kecil dari hari ini, transaksi akan dilanjutkan ?</span></p>`,
                    width: '16.4%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No', // Menambahkan teks tombol cancel
                    showCancelButton: true, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        saveDoc(updatedState);
                    }
                });
            return;
        }

        //cek backdate
        const resultCekUserApp: any[] = await CekUserApp(kode_entitas, userid);
        const resultTglPlus3 = await CekTglPlus3(stateDataHeader?.tglDokumen);
        const resultTglPlus14 = await CekTglPlus14(stateDataHeader?.tglDokumen);

        //blocking jika bukan pajak============================================
        await entitaspajak(kode_entitas, userid)
            .then(async (result) => {
                if (result === 'false') {
                    if (resultCekUserApp[0].app_backdate === 'N' || userid !== 'administrator') {
                        if (resultTglPlus3 === true) {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px;color:white;">Tanggal lebih besar dari 3 hari.</p>',
                                width: '100%',
                                target: '#dialogPhuList',
                                customClass: {
                                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                                },
                            });
                            return;
                        } else if (resultTglPlus14 === true) {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px;color:white;">Tanggal lebih besar dari 14 hari.</p>',
                                width: '100%',
                                target: '#dialogPhuList',
                                customClass: {
                                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                                },
                            });
                            return;
                        }
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        const hasAkunDivisiNodes = dataJurnal.nodes.filter(
            (node: any) =>
                (node.tipe === 'Pendapatan' || node.tipe === 'Pendapatan Lain-Lain' || node.tipe === 'Beban' || node.tipe === 'Beban Lain-Lain') && (node.kode_jual === '' || node.kode_jual === null)
        );

        if (hasAkunDivisiNodes.length > 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Divisi penjualan belum diisi.</p>',
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (stateDataDetail.totalDebet.toFixed(2) !== stateDataDetail.totalKredit.toFixed(2)) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Jurnal masih ada selisih.</p>',
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        // Proses Simpan
        saveDoc(updatedState);
    };

    const saveDoc = async (updatedState: any) => {
        console.log('updatedState 12 = ', updatedState);
        let jsonData: any, generateNoDok: any;
        const paramObject = {
            // tglDokumen: stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss'),
            tglDokumen: masterBarangProduksi === 'Y' ? moment(stateDataHeader?.tglEfektif).format('YYYY-MM-DD HH:mm:ss') : updatedState.tglEfektif,
            userid: userid.toUpperCase(),
            tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),

            tgl_rekonsil:
                masterBarangProduksi === 'Y'
                    ? stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss')
                    : masterBarangProduksi?.tipeApi === 'APIWarkat'
                    ? updatedState.tglDokumen
                    : stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss'),
            tgl_valuta: masterBarangProduksi === 'Y' ? moment(stateDataHeader?.tglEfektif).format('YYYY-MM-DD HH:mm:ss') : updatedState.tglEfektif,
            tipeApi: masterBarangProduksi === 'Y' ? '' : masterBarangProduksi?.tipeApi,
            rekonsiliasi: 'Y',
        };

        console.log('paramObject = ', paramObject);

        // generate Ulang no Dokumen
        if (masterDataState === 'BARU') {
            await generateNU(kode_entitas, '', '19', dateGenerateNu.format('YYYYMM'))
                .then((result) => {
                    generateNoDok = result;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            generateNoDok = stateDataHeader?.noDokumenValue;
        }
        // END

        // if (stateDataHeader?.kodeAkun === '' || stateDataHeader?.kodeAkun === null || stateDataHeader?.kodeAkun === undefined) {
        //     withReactContent(swalToast).fire({
        //         icon: 'warning',
        //         title: '<p style="font-size:12px;color:white;">Kode Akun Debet belum diisi.</p>',
        //         width: '100%',
        //         target: '#dialogPhuList',
        //         customClass: {
        //             popup: styles['colored-popup'], // Custom class untuk sweetalert
        //         },
        //     });
        //     return;
        // }

        if (dataJurnal.nodes.length <= 0 && dataBarang.nodes.length > 0) {
            const dataRes = await Data();
            if (dataRes === true) {
                setIsDataFetched(true);
            }
        } else {
            await ReCalcDataNodes(dataBarang, dataJurnal, paramObject)
                .then((result) => {
                    jsonData = {
                        con_pay: 'pencairan',
                        kode_dokumen: masterDataState === 'BARU' ? '' : masterKodeDokumen,
                        entitas: kode_entitas,
                        dokumen: 'PU',
                        // no_dokumen: stateDataHeader?.noDokumenValue,
                        no_dokumen: generateNoDok,
                        // tgl_dokumen: masterBarangProduksi === 'Y' ? stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss') : updatedState.tglDokumen.format('YYYY-MM-DD HH:mm:ss'),
                        tgl_dokumen: stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss'),
                        no_warkat: stateDataHeader?.noWarkat,
                        tgl_valuta: stateDataHeader?.tglValuta.format('YYYY-MM-DD HH:mm:ss'),
                        kode_cust: stateDataHeader?.kodeCustomerValue,
                        kode_akun_debet: masterBarangProduksi === 'Y' ? stateDataHeader?.kodeAkun : updatedState.kodeAkun,
                        kode_supp: null,
                        kode_akun_kredit: masterDataState === 'BARU' ? null : stateDataHeader?.kodeAkunKredit,
                        // kode_akun_kredit: null,
                        kode_akun_diskon: masterDataState === 'BARU' ? null : stateDataHeader?.kodeAkunDiskon,
                        kurs: stateDataHeader?.kursValue,
                        debet_rp: masterDataState === 'BARU' ? 0 : stateDataHeader?.debetRp,
                        // debet_rp: 0,
                        kredit_rp: masterBarangProduksi === 'Y' ? tanpaKoma(stateDataHeader?.jumlahBayar) : updatedState.jumlahBayar,
                        jumlah_rp: masterBarangProduksi === 'Y' ? parseFloat(tanpaKoma(stateDataHeader?.jumlahBayar)) : updatedState.jumlahBayar,
                        jumlah_mu: masterBarangProduksi === 'Y' ? tanpaKoma(stateDataHeader?.jumlahBayar) : updatedState.jumlahBayar,
                        pajak: 'N',
                        kosong: 'C',
                        kepada: stateDataHeader?.namaCustomerValue,
                        catatan: stateDataFooter.vKeterangan,
                        status: 'Tertutup',
                        userid: userid.toUpperCase(),
                        tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        status_approved: 'Warkat',
                        tgl_approved: null,
                        tgl_pengakuan: masterBarangProduksi === 'Y' ? stateDataHeader?.tglEfektif.format('YYYY-MM-DD HH:mm:ss') : updatedState.tglEfektif,
                        no_TTP: stateDataHeader?.noReferensi === '' ? '-' : stateDataHeader?.noReferensi,
                        tgl_TTP: stateDataHeader?.tglReferensi.format('YYYY-MM-DD HH:mm:ss'),
                        kode_sales: stateDataHeader?.kode_salesValue,
                        nama_sales: stateDataHeader?.nama_salesValue,
                        kode_fk: null,
                        approval: 'N',
                        tgl_setorgiro: null,
                        faktur: 'N',
                        barcode: stateDataDetail.kodeValidasi,
                        komplit: 'N',
                        validasi1: 'N',
                        validasi2: 'N',
                        validasi3: 'N',
                        validasi_ho2: 'N',
                        validasi_ho3: 'N',
                        validasi_catatan: null,
                        tolak_catatan: null,
                        kode_kry: null,
                        // tgl_trxdokumen: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        // tgl_trxdokumen: moment(stateDataHeader?.tglBuat).format('YYYY-MM-DD HH:mm:ss'),
                        tgl_trxdokumen: masterDataState === 'BARU' ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : stateDataHeader?.tglBuat.format('YYYY-MM-DD HH:mm:ss'),
                        api_id: masterBarangProduksi === 'Y' ? stateDataHeader.apiId : masterBarangProduksi?.tipeApi === 'APIWarkat' ? masterBarangProduksi?.apiId : stateDataHeader.apiId,
                        api_catatan:
                            masterBarangProduksi === 'Y' ? stateDataHeader.apiCatatan : masterBarangProduksi?.tipeApi === 'APIWarkat' ? masterBarangProduksi?.description : stateDataHeader.apiCatatan,
                        api_pending:
                            masterBarangProduksi === 'Y' ? stateDataHeader.apiPending : masterBarangProduksi?.tipeApi === 'APIWarkat' ? masterBarangProduksi?.apiPending : stateDataHeader.apiPending,
                        api_norek:
                            masterBarangProduksi === 'Y' ? stateDataHeader.apiNorek : masterBarangProduksi?.tipeApi === 'APIWarkat' ? masterBarangProduksi?.noRekeningApi : stateDataHeader.apiNorek,
                        kode_um: null,
                        no_kontrak_um: null,
                        detail: result.detailJson,
                        jurnal: result.detailJurnal,
                    };
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            console.log('jsonData = ', jsonData);
            let responsePencairan: any;
            if (masterDataState === 'Pencairan') {
                try {
                    if (masterBarangProduksi === 'Y') {
                        responsePencairan = await axios.post(`${apiUrl}/erp/pencairan_pembatalan_ppi`, jsonData, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    } else {
                        responsePencairan = await axios.post(`${apiUrl}/erp/pencairan_warkat_ppi`, jsonData, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });
                    }

                    const resultSimpan = responsePencairan.data;
                    const status = resultSimpan.status;
                    const errormsg = resultSimpan.serverMessage;

                    if (status === true) {
                        const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                            entitas: kode_entitas,
                            kode_audit: null,
                            dokumen: 'PU',
                            kode_dokumen: resultSimpan.kode_dokumen,
                            no_dokumen: stateDataHeader?.noDokumenValue,
                            tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                            proses: 'EDIT',
                            diskripsi: `Pencairan BG nilai transaksi = ${frmNumber(stateDataHeader?.jumlahBayar)}`,
                            userid: userid.toUpperCase(), // userid login web
                            system_user: '', //username login
                            system_ip: '', //ip address
                            system_mac: '', //mac address
                        });
                        if (auditResponse.data.status === true) {
                            await withReactContent(swalPopUp).fire({
                                icon: 'success',
                                title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil disimpan.</p>',
                                width: '50%', // Atur lebar popup sesuai kebutuhan
                                target: '#dialogPhuList',
                                heightAuto: true,
                                timer: 2000,
                                showConfirmButton: false, // Menampilkan tombol konfirmasi
                                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                                customClass: {
                                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                                },
                            });
                            await setIsDataFetchedReload(true);
                        }
                    }
                } catch (error: any) {
                    withReactContent(swalDialog).fire({
                        title: ``,
                        html: error,
                        icon: 'warning',
                        width: '20%',
                        heightAuto: true,
                        showConfirmButton: true,
                        confirmButtonText: 'Ok',
                        target: '#dialogPhuList',
                    });
                }
            } else if (masterDataState === 'Edit Pencairan') {
                const response = await axios.post(`${apiUrl}/erp/pencairan_pembatalan_ppi`, jsonData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const resultSimpan = response.data;
                const status = resultSimpan.status;
                const errormsg = resultSimpan.serverMessage;
                if (status === true) {
                    const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                        entitas: kode_entitas,
                        kode_audit: null,
                        dokumen: 'PU',
                        kode_dokumen: resultSimpan.kode_dokumen,
                        no_dokumen: stateDataHeader?.noDokumenValue,
                        tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                        proses: 'EDIT',
                        diskripsi: `Pencairan BG nilai transaksi = ${frmNumber(stateDataHeader?.jumlahBayar)}`,
                        userid: userid.toUpperCase(), // userid login web
                        system_user: '', //username login
                        system_ip: '', //ip address
                        system_mac: '', //mac address
                    });
                    if (auditResponse.data.status === true) {
                        await withReactContent(swalPopUp).fire({
                            icon: 'success',
                            title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil disimpan.</p>',
                            width: '50%', // Atur lebar popup sesuai kebutuhan
                            target: '#dialogPhuList',
                            heightAuto: true,
                            timer: 2000,
                            showConfirmButton: false, // Menampilkan tombol konfirmasi
                            allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                            allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                            customClass: {
                                popup: styles['colored-popup'], // Custom class untuk sweetalert
                            },
                        });
                        await setIsDataFetchedReload(true);
                    }
                }
            }
        }
    };

    return (
        <div>
            <DialogComponent
                id="dialogPhuList"
                name="dialogPhuList"
                className="dialogPhuList"
                target="#main-target"
                header={() => {
                    let header: JSX.Element | string = '';
                    if (masterDataState == 'BARU') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Penerimaan Piutang Baru <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ {modalJenisPenerimaan} ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'Pencairan') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Edit Penerimaan Piutang{' '}
                                    <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ {modalJenisPenerimaan.toUpperCase()} ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'PREVIEW') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Preview Penerimaan Piutang <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ {modalJenisPenerimaan} ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState === 'UpdateFilePendukung') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Edit Penerimaan Piutang <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ UPDATE FILE PEDUKUNG ]</span>
                                </div>
                            </div>
                        );
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
                width="75%" //"70%"
                height="90%"
                position={{ X: 'center', Y: 8 }}
                style={{ position: 'fixed', height: '85%' }}
                buttons={buttonInputData}
                close={closeDialogPpiList}
                closeOnEscape={false}
                open={(args: any) => {
                    // ReCallRefreshModal();
                    args.preventFocus = true;
                }}
            >
                <div style={{ minWidth: '70%', overflow: 'auto' }}>
                    <div>
                        {/* screen loader  */}
                        {/* {showLoader && contentLoader()} */}

                        <div>
                            <TemplateHeader
                                userid={userid}
                                kode_entitas={kode_entitas}
                                stateDataHeader={stateDataHeader}
                                setStateDataHeader={setStateDataHeader}
                                setDataDaftarAkunDebet={setDataDaftarAkunDebet}
                                setFilteredDataAkunDebet={setFilteredDataAkunDebet}
                                dataDaftarAkunDebet={dataDaftarAkunDebet}
                                setDataDaftarCust={setDataDaftarCust}
                                setDataDaftarUangMuka={setDataDaftarUangMuka}
                                setStateDataDetail={setStateDataDetail}
                                setDataDaftarCustomer={setDataDaftarCustomer}
                                setDataDaftarSubledger={setDataDaftarSubledger}
                                setDataDaftarSalesman={setDataDaftarSalesman}
                                idDokumen={idDokumen}
                                tipeAdd={tipeAdd}
                                vToken={token}
                                setFilteredDataCust={setFilteredDataCust}
                                dataDaftarCust={dataDaftarCust}
                                setFilteredDataSalesman={setFilteredDataSalesman}
                                dataDaftarSalesman={dataDaftarSalesman}
                                setDataBarang={setDataBarang}
                                setStateDataFooter={setStateDataFooter}
                                dataBarang={dataBarang}
                                modalJenisPenerimaan={modalJenisPenerimaan}
                                dataHeaderAPI={masterBarangProduksi === 'Y' ? stateDataHeader : masterBarangProduksi}
                                onRefreshTipe={onRefreshTipe}
                                masterDataState={masterDataState}
                            />
                            <TemplateDetail
                                userid={userid}
                                kode_entitas={kode_entitas}
                                dataBarang={dataBarang}
                                setStateDataHeader={setStateDataHeader}
                                setDataBarang={setDataBarang}
                                setStateDataFooter={setStateDataFooter}
                                stateDataHeader={stateDataHeader}
                                setStateDataDetail={setStateDataDetail}
                                masterDataState={masterDataState}
                                onClickAutoJurnal={(tipe: any, gridJurnalPpiListRef: any, idJurnal: any) => onClickAutoJurnal(tipe, gridJurnalPpiListRef, idJurnal)}
                                dataJurnal={dataJurnal}
                                setIndexPreview={setIndexPreview}
                                setIsOpenPreview={setIsOpenPreview}
                                setZoomScale={setZoomScale}
                                setPosition={setPosition}
                                setImageDataUrl={setImageDataUrl}
                                setFilteredDataBarang={setFilteredDataBarang}
                                stateDataDetail={stateDataDetail}
                                filteredDataBarang={filteredDataBarang}
                                viewTTDDialog={viewTTDDialog}
                                handleAddDetailJurnal={(gridJurnalPpiListRef: any) => handleAddDetailJurnal(gridJurnalPpiListRef)}
                                listDepartement={listDepartement}
                                listDivisi={listDivisi}
                                onClickTemplateAkun={(args: any) => onClickTemplateAkun(args)}
                                setDataJurnal={setDataJurnal}
                                onClickSubsidiaryLedger={(args: any) => onClickSubsidiaryLedger(args)}
                                vToken={token}
                                images={images}
                                setImages={setImages}
                                setSelectedFiles={setSelectedFiles}
                                setNamaFiles={setNamaFiles}
                                loadFilePendukung={loadFilePendukung}
                                setLoadFilePendukung={setLoadFilePendukung}
                                extractedFiles={extractedFiles}
                                setExtractedFiles={setExtractedFiles}
                                setNamaFilesExt1={setNamaFilesExt1}
                                masterKodeDokumen={masterKodeDokumen}
                                onRefreshTipe={onRefreshTipe}
                                clearAllImages={clearAllImages}
                                modalJenisPenerimaan={modalJenisPenerimaan}
                                cetakBarcodewarkat={''}
                                isFilePendukungPPI={isFilePendukungPPI}
                                gridPpiListRef={gridPpiListRef}
                                gridPpiListRefCurrent={gridPpiListRef.current}
                            />
                            <TemplateFooter
                                userid={userid}
                                kode_entitas={kode_entitas}
                                stateDataFooter={stateDataFooter}
                                setStateDataFooter={setStateDataFooter}
                                modalJenisPenerimaan={modalJenisPenerimaan}
                            />
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
                    {(masterDataState == 'BARU' || masterDataState == 'Pencairan') && (
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-close"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                            onClick={closeDialogPpiList}
                        />
                    )}
                    {(masterDataState == 'BARU' || masterDataState == 'Pencairan') && (
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Simpan"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                            // onClick={saveDoc}
                            onClick={prosesBlokingTerbaru}
                        />
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
                                    alt={`Zoomed ${imageDataUrl}`}
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
                                    <span className="e-icons e-zoom-in" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={handleZoomIn}></span>
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
                                    <span className="e-icons e-zoom-out" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={handleZoomOut}></span>
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
                                    <span className="e-icons e-close" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={handleCloseZoom}></span>
                                </ButtonComponent>
                            </div>
                        </div>
                    )}

                    {/*==================================================================================================*/}
                    {/*=================================== Modal dialog untuk view TTD =============================*/}
                    {/*==================================================================================================*/}

                    {/* Modal Preview TTDFile Pendukung Images */}
                    {showPreviewTTDModal &&
                        (selectedImagesOwner !== '' ? (
                            <>
                                <Draggable>
                                    <div className={`${styles.modalPreviewPictureDragable}`} style={modalPositionTTD}>
                                        <div className="overflow-auto">
                                            <div>
                                                <table className={styles.table}>
                                                    <thead>
                                                        <tr>
                                                            <th>Gambar Spesimen Owner</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ background: 'white' }}>
                                                                <img id="imgOwner" src={selectedImagesOwner} style={{ maxWidth: '700px', maxHeight: '350px' }} />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <button className={`${styles.closeButtonDetailDragable}`} onClick={cancelPreviewTTD}>
                                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                        </button>
                                    </div>
                                </Draggable>
                            </>
                        ) : null)}
                    {/* ============================================================ */}
                </div>
            </DialogComponent>
            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Akun Kredit =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarAkunDebet
                visible={stateDataHeader?.dialogDaftarAkunDebetVisible}
                stateDataHeader={stateDataHeader}
                // buttonDaftarAkunKredit={buttonDaftarAkunKredit}
                // gridDaftarAkunKredit={gridDaftarAkunKredit}
                setStateDataHeader={setStateDataHeader}
                dataDaftarAkunDebet={dataDaftarAkunDebet}
                filteredDataAkunDebet={filteredDataAkunDebet}
                // handleClickDaftarAkunKredit={handleClickDaftarAkunKredit}
                // handleClickDaftarAkunKreditJurnal={handleClickDaftarAkunKreditJurnal}
                swalToast={swalToast}
                HandleSearchNoAkun={HandleSearchNoAkun}
                HandleSearchNamaAkun={HandleSearchNamaAkun}
                TemplateNoAkun={TemplateNoAkun}
                TemplateNamaAkun={TemplateNamaAkun}
                setFilteredDataAkunDebet={setFilteredDataAkunDebet}
                setDataJurnal={setDataJurnal}
                stateDataDetail={stateDataDetail}
                rowIdJurnal={stateDataDetail.rowsIdJurnal}
                kode_entitas={kode_entitas}
                setStateDataDetail={setStateDataDetail}
                setDataDaftarCust={setDataDaftarCust}
                setDataDaftarSubledger={setDataDaftarSubledger}
            />
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Daftar Supplier =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarCust
                visible={stateDataHeader?.dialogDaftarCustVisible}
                stateDataHeader={stateDataHeader}
                // buttonDaftarSupplier={buttonDaftarSupplier}
                // gridDaftarSupplier={gridDaftarSupplier}
                setStateDataHeader={setStateDataHeader}
                filteredDataCust={filteredDataCust}
                dataDaftarCust={dataDaftarCust}
                HandleSearchNoCustomer={HandleSearchNoCustomer}
                HandleSearchNamaCustomer={HandleSearchNamaCustomer}
                // handleClickDaftarSupplier={handleClickDaftarSupplier}
                // handleClickDaftarSupplierJurnal={handleClickDaftarSupplierJurnal}
                swalToast={swalToast}
                setFilteredDataCust={setFilteredDataCust}
                stateDataDetail={stateDataDetail}
                setDataDetailNoFakturPpi={setDataDetailNoFakturPpi}
                kode_entitas={kode_entitas}
                setDataBarang={setDataBarang}
                setStateDataFooter={setStateDataFooter}
                setStateDataDetail={setStateDataDetail}
                setDataJurnal={setDataJurnal}
                vToken={token}
                gridPpiListRef={gridPpiListRef}
            />
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Salesman   =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarSalesman
                visible={stateDataHeader?.dialogDaftarSalesmanVisible}
                stateDataHeader={stateDataHeader}
                // buttonDaftarAkunKredit={buttonDaftarAkunKredit}
                // gridDaftarAkunKredit={gridDaftarAkunKredit}
                setStateDataHeader={setStateDataHeader}
                // dataDaftarSalesman={dataDaftarSalesman}
                dataDaftarSalesman={dataDaftarSalesmanRef.current}
                filteredDataSalesman={filteredDataSalesman}
                // handleClickDaftarAkunKredit={handleClickDaftarAkunKredit}
                // handleClickDaftarAkunKreditJurnal={handleClickDaftarAkunKreditJurnal}
                swalToast={swalToast}
                HandleSearchNoSales={HandleSearchNoSales}
                HandleSearchNamaSales={HandleSearchNamaSales}
                TemplateNoAkun={TemplateNoAkun}
                TemplateNamaAkun={TemplateNamaAkun}
                setFilteredDataSalesman={setFilteredDataSalesman}
                setDataJurnal={setDataJurnal}
                stateDataDetail={stateDataDetail}
                rowIdJurnal={idDokumen}
            />
            {/*==================================================================================================*/}
            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Subledger =================================*/}
            {/*==================================================================================================*/}
            <DialogDaftarSubledger
                visible={stateDataDetail.dialogDaftarSubledgerVisible}
                stateDataDetail={stateDataDetail}
                stateDataHeader={stateDataHeader}
                // buttonDaftarSubledger={buttonDaftarSubledger}
                // gridDaftarSubledger={gridDaftarSubledger}
                setStateDataDetail={setStateDataDetail}
                filteredDataSubledger={filteredDataSubledger}
                dataDaftarSubledger={dataDaftarSubledger}
                HandleSearchNoSubledger={HandleSearchNoSubledger}
                HandleSearchNamaSubledger={HandleSearchNamaSubledger}
                // handleClickDaftarSubledger={handleClickDaftarSubledger}
                swalToast={swalToast}
                setFilteredDataSubledger={setFilteredDataSubledger}
                setDataJurnal={setDataJurnal}
            />
            {/*==================================================================================================*/}
        </div>
    );
};

export default DialogPencairanWarkat;
