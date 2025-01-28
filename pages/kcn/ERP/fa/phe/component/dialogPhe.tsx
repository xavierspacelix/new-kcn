import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TabComponent } from '@syncfusion/ej2-react-navigations';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar } from '@syncfusion/ej2-react-calendars';
import { GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import { viewPeriode } from '@/utils/routines';
import { useRouter } from 'next/router';
import styles from '@styles/index.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEraser, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FillFromSQL, FirstDayInPeriod, cekDataDiDatabase, fetchPreferensi, frmNumber, generateNU } from '@/utils/global/fungsi';
import {
    batalSemuaInvoice,
    bayarSemuaInvoice,
    cekTglBackDate,
    cekTglMinusSatu,
    clearAllImages,
    clearImage,
    currencyFormat,
    handleClick,
    handleCloseZoom,
    handleDelete,
    handleFileUpload,
    handleJumlahBayar,
    handleNamaEkspedisiChange,
    handlePph23Change,
    handleZoomIn,
    handleZoomOut,
    load,
    loadDataImage,
    onClickAutoJurnal,
    onClickAutoJurnalBatalApp,
    swalDialog,
    swalPopUp,
    swalToast,
} from '@/lib/fa/phe/functional/fungsiForm';
import { GetEditPhe, GetListEkspedisi, GetListPph } from '@/lib/fa/phe/api/api';
import { editTemplateBiayaLain, editTemplateNettoMu, editTemplatePotonganLain, editTemplateSisaHutang, editTemplateTotalBerat, headerJumlahYangAkanDibayar } from '@/utils/fa/phe/interface/fungsi';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';
import { ReCalc } from '@/lib/fa/phe/functional/reCalc';
import ImageWithDeleteButton from './ImageWithDeleteButton';

enableRipple(true);

interface dialogPheProps {
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
    stateDataParams: any;
    setStateDataDataParams: Function;
}

const DialogPhe: React.FC<dialogPheProps> = ({
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
    stateDataParams,
    setStateDataDataParams,
}: dialogPheProps) => {
    const router = useRouter();
    let imageUrls: any;

    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    // =================================================================================
    // INI FUNGSI DAN STATE UNTUK RPE
    //======== Datasource =========
    const [listEkspedisi, setListEkspedisi] = useState<[]>([]);
    const [listPph, setListPph] = useState<[]>([]);
    const vRefreshData = useRef(0);
    const NanJumlahBayar = useRef(0);
    const gridPheListRef = useRef<GridComponent>(null);
    const gridPheJurnalListRef = useRef<GridComponent>(null);
    // const qtyParams = { params: { format: 'N2' } };
    const qtyParams = { params: { format: 'N2', decimals: 4, showClearButton: false, showSpinButton: false } };
    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const [disableTombolSimpan, setDisabledTombolSimpan] = useState(false);
    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();
    const [refreshKeyNamaEks, setRefreshKeyNamaEks] = useState(0);
    const [refreshKeyPph23, setRefreshKeyPph23] = useState(0);
    const [plagButtonBayarInvoice, setPlagButtonbayarInvoice] = useState('Bayar');
    const [isActiveTabJurnal, setIsActiveTabJurnal] = useState('');

    // File Pendukung
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
        { title: '1', content: 'Content 1' },
        { title: '2', content: 'Content 2' },
        { title: '3', content: 'Content 3' },
        { title: '4', content: 'Content 4' },
        { title: '5', content: 'Content 5' },
    ];

    type ExtractedFile = {
        imageUrl: string;
        fileName: string;
    };

    const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
    const [selectedBersihkangambar, setSelectedBersihkangambar] = useState('');
    const [tipeBersihkangambar, setTipeSelectedBersihkangambar] = useState('baru');

    // Privewe File Pendukung
    const [indexPreview, setIndexPreview] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [zoomScale, setZoomScale] = useState(0.5);

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // END

    const [stateDataHeader, setStateDataHeader] = useState({
        noPheValue: '',
        dateGenerateNu: moment(),
        tanggal: moment(),
        tanggalBayar: moment(),
        via: '',
        pph23: 'N',
        kodePhe: '',
        kodeRpe: '',
        totalBarang: '',
        jumlahBayar: '',
        terbilangJumlah: '',
        kodeAkunJurnal1: '',
        kodeAkunJurnal2: '',
        noAkun1: '',
        noAkun2: '',
        namaAkun1: '',
        namaAkun2: '',
        tipeAkun: '',
        kurs: 1,
        kodeJual: '',
        namaDept: '',
        kodeDept: '',
        noDept: '',
        noReferensi: '',

        approval: null,
        // tglApproval: null,
        tglApproval: moment(),
        kodeDokumen: null,
        noDokumen: '',

        catatanPph23: '',
    });

    const [stateDataFooter, setStateDataFooter] = useState({
        totalHutang: '',
        totalPembayaran: '',
        sisaHutang: '',
        selisihAlokasiDana: '',
        keterangan: '',
        totalDebet: 0,
        totalKredit: 0,
        totalSelisih: 0,
    });

    type NodesDataAlokasiPembayaran = {
        kode_phe: any;
        id_phe: any;
        pay: any;
        no_reff: any;
        kode_rpe: any;
        no_rpe: any;
        tgl_rpe: any;
        via: any;
        total_mu: any;
        netto_mu: any;
        total_berat: any;
        total_berat_ekspedisi: any;
        total_berat_pabrik: any;
        total_klaim_ekspedisi: any;
        total_klaim_pabrik: any;
        pph23: any;
        byr: any;
        nilai_pph: any;
        potongan_lain: any;
        biaya_lain: any;
        bayar_mu: any;
        sisa_hutang: any;
        owing: any;
        bayar: any;
    };

    type NodesDataJurnal = {
        id: any;
    };

    const [dataAlokasiPembayaran, setDataAlokasiPembayaran] = useState<{ nodes: NodesDataAlokasiPembayaran[] }>({ nodes: [] });
    const [dataJurnal, setDataJurnal] = useState<{ nodes: NodesDataJurnal[] }>({ nodes: [] });

    const refreshDatasource = async () => {
        setShowLoader(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            const paramObject = {
                kode_entitas: kode_entitas,
                token: token,
                kode_phe: masterKodeDokumen,
                via: stateDataParams?.via,
                pph23: stateDataParams?.pph23,
                kode_rpe: stateDataParams?.kode_rpe,
                kode_dokumen: stateDataParams?.kode_dokumen,
            };
            try {
                if (masterDataState == 'BARU') {
                    reCacRefreshDialog();
                    const responseListEkspedisi = await GetListEkspedisi(paramObject);
                    const responseListPph = await GetListPph(paramObject);

                    const genearteNu = await generateNU(kode_entitas, '', '27', stateDataHeader?.dateGenerateNu.format('YYYYMM'));
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        noPheValue: genearteNu,
                    }));

                    setListEkspedisi(responseListEkspedisi);
                    setListPph(responseListPph);

                    const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
                    if (jumlahBayar) {
                        jumlahBayar.value = '';
                    }
                } else if (
                    masterDataState === 'EDIT' ||
                    masterDataState === 'APPROVAL' ||
                    masterDataState === 'BATAL APP' ||
                    masterDataState === 'BAYAR' ||
                    masterDataState === 'BATAL BAYAR' ||
                    masterDataState === 'FilePendukung' ||
                    masterDataState === 'EDIT APP' ||
                    masterDataState === 'EDIT RELEASE'
                ) {
                    const respDataEditPhe = await GetEditPhe(paramObject);
                    const responseListPph = await GetListPph(paramObject);
                    const respMasterEditPhe = respDataEditPhe.master;
                    const respAlokasiPembayaranEditPhe = respDataEditPhe.alokasiPembayaran;

                    const kodePph23 = responseListPph.filter((item: any) => item.kode_pajak === respMasterEditPhe.pph23);

                    const resultreferensi = await fetchPreferensi(kode_entitas, apiUrl);
                    const resultDepartement = await FillFromSQL(kode_entitas, 'departemen');
                    const resultDepartementFix = resultDepartement.filter((item: any) => item.nama_dept === 'LOGISTIK');

                    const jumlahRpe = respAlokasiPembayaranEditPhe.filter((item: any) => item.bayar_mu !== '' && item.bayar_mu !== null && item.bayar_mu !== undefined);
                    console.log('respAlokasiPembayaranEditPhe = ', stateDataParams.status_app, stateDataParams.status);
                    if (masterDataState === 'BAYAR') {
                        setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            tanggal: moment(respMasterEditPhe.tgl_phe),
                            noPheValue: respMasterEditPhe.no_phe,
                            via: respMasterEditPhe.via,
                            pph23: respMasterEditPhe.pph23,
                            jumlahBayar: respMasterEditPhe.netto_mu,
                            kodePhe: respMasterEditPhe.kode_phe,
                            kodeAkunJurnal1: resultreferensi[0].kode_akun_crrpe,
                            kodeAkunJurnal2: resultreferensi[0].kode_akun_creks,
                            noAkun1: resultreferensi[0].no_kredit_rpe,
                            noAkun2: resultreferensi[0].no_kredit_eks,
                            namaAkun1: resultreferensi[0].nama_kredit_rpe,
                            namaAkun2: resultreferensi[0].nama_kredit_eks,
                            tipeAkun: resultreferensi[0].tipe_kredit_eks,
                            kodeJual: resultreferensi[0].kode_jual,
                            namaDept: resultDepartementFix[0].nama_dept,
                            kodeDept: resultDepartementFix[0].kode_dept,
                            noDept: resultDepartementFix[0].no_dept_dept,
                            noReferensi: respMasterEditPhe.no_reff,
                            approval: respMasterEditPhe.approval,
                            tglApproval: moment(respMasterEditPhe.tgl_approval),
                            kodeDokumen: respMasterEditPhe.kode_dokumen,
                            noDokumen: stateDataParams?.no_dokumen,
                            totalBarang: String(jumlahRpe.length),
                            catatanPph23: kodePph23[0].catatan,
                        }));
                    } else {
                        setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            tanggal: moment(respMasterEditPhe.tgl_phe),
                            noPheValue: respMasterEditPhe.no_phe,
                            via: respMasterEditPhe.via,
                            pph23: respMasterEditPhe.pph23,
                            jumlahBayar: respMasterEditPhe.netto_mu,
                            kodePhe: respMasterEditPhe.kode_phe,
                            kodeAkunJurnal1: resultreferensi[0].kode_akun_crrpe,
                            kodeAkunJurnal2: resultreferensi[0].kode_akun_creks,
                            noAkun1: resultreferensi[0].no_kredit_rpe,
                            noAkun2: resultreferensi[0].no_kredit_eks,
                            namaAkun1: resultreferensi[0].nama_kredit_rpe,
                            namaAkun2: resultreferensi[0].nama_kredit_eks,
                            tipeAkun: resultreferensi[0].tipe_kredit_eks,
                            kodeJual: resultreferensi[0].kode_jual,
                            namaDept: resultDepartementFix[0].nama_dept,
                            kodeDept: resultDepartementFix[0].kode_dept,
                            noDept: resultDepartementFix[0].no_dept_dept,
                            tanggalBayar:
                                masterDataState === 'BAYAR'
                                    ? moment()
                                    : masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE'
                                    ? moment(respMasterEditPhe.tgl_bayar)
                                    : masterDataState === 'FilePendukung' && stateDataParams.status_app === 'Disetujui' && stateDataParams.status === 'Terbuka'
                                    ? moment()
                                    : masterDataState === 'FilePendukung'
                                    ? moment(respMasterEditPhe.tgl_bayar)
                                    : null,
                            noReferensi: respMasterEditPhe.no_reff,
                            approval: respMasterEditPhe.approval,
                            tglApproval: moment(respMasterEditPhe.tgl_approval),
                            kodeDokumen: respMasterEditPhe.kode_dokumen,
                            noDokumen: stateDataParams?.no_dokumen,
                            totalBarang: String(jumlahRpe.length),
                            catatanPph23: kodePph23[0].catatan,
                        }));
                    }
                    setStateDataFooter((prevState: any) => ({
                        ...prevState,
                        keterangan: respMasterEditPhe.keterangan,
                    }));

                    const respListAlokasiPembayaranPheFix = respAlokasiPembayaranEditPhe.map((item: any, index: number) => ({
                        ...item,
                        id: `${index + 1}`,
                        total_berat: parseFloat(item.total_berat),
                        biaya_lain: parseFloat(item.biaya_lain),
                        potongan_lain: parseFloat(item.potongan_lain),
                        netto_mu: parseFloat(item.netto_mu),
                        sisa_hutang: parseFloat(item.sisa_hutang),
                        sisaFix: parseFloat(item.sisa_hutang),
                        bayar_mu: parseFloat(item.bayar_mu),
                        bayar_muFix: parseFloat(item.bayar_mu),
                    }));

                    // Menghitung total netto_mu
                    const totalNettoMu = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
                    // Menghitung Total Pembayaran
                    const totalPembayaran = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_mu) || 0), 0);

                    setStateDataFooter((prevState: any) => ({
                        ...prevState,
                        totalHutang: totalNettoMu,
                        totalPembayaran: totalPembayaran,
                        sisaHutang: totalNettoMu - totalPembayaran,
                        selisihAlokasiDana: (respMasterEditPhe.netto_mu === '' ? 0 : parseFloat(respMasterEditPhe.netto_mu)) - totalPembayaran,
                    }));

                    gridPheListRef.current?.setProperties({ dataSource: respListAlokasiPembayaranPheFix });
                    gridPheListRef.current?.refresh();

                    const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
                    if (jumlahBayar) {
                        jumlahBayar.value = frmNumber(respMasterEditPhe.netto_mu);
                    }

                    const pph23 = document.getElementById('pph23') as HTMLInputElement;
                    if (pph23) {
                        pph23.value = kodePph23[0].catatan;
                    }

                    const namaEkspedisi = document.getElementById('namaEkspedisi') as HTMLInputElement;
                    if (namaEkspedisi) {
                        namaEkspedisi.value = respMasterEditPhe.via;
                    }

                    const mergerObject = {
                        ...handleParamsObject,
                    };

                    NanJumlahBayar.current = respMasterEditPhe.netto_mu;
                    await loadDataImage(respMasterEditPhe.kode_phe, mergerObject);
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

    useEffect(() => {
        refreshDatasource();
    }, [refreshKey]);

    const handleActionBaginRows = async (args: any) => {
        if (args.requestType === 'save') {
            console.log('args.data.bayar_mu = ', args.data.bayar_mu);
            const bayarMu = args.data.bayar_mu === null || args.data.bayar_mu === undefined || args.data.bayar_mu === '' ? 0 : parseFloat(args.data.bayar_mu);
            if (gridPheListRef.current && Array.isArray(gridPheListRef.current.dataSource)) {
                const dataSource = [...gridPheListRef.current.dataSource]; // Salin array
                const sisa = parseFloat(args.rowData.sisaFix) - bayarMu;
                const editedData = {
                    ...args.data,
                    sisa_hutang: sisa,
                    total_berat: args.rowData.total_berat,
                    biaya_lain: args.rowData.biaya_lain,
                    potongan_lain: args.rowData.potongan_lain,
                    netto_mu: args.rowData.netto_mu,
                    bayar_muFix: bayarMu,
                    bayar_mu: bayarMu,
                };

                // Update elemen di array salinan
                dataSource[args.rowIndex] = editedData;

                // Menghitung total netto_mu
                const totalNettoMu = dataSource.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
                // Menghitung Total Pembayaran
                const totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_mu) || 0), 0);

                const jumlahBayarTrue = isNaN(parseFloat(stateDataHeader?.jumlahBayar));
                const jumlah_bayar_mu = jumlahBayarTrue === true ? NanJumlahBayar.current : parseFloat(stateDataHeader?.jumlahBayar);

                setStateDataFooter((prevState: any) => ({
                    ...prevState,
                    totalHutang: totalNettoMu,
                    totalPembayaran: totalPembayaran,
                    sisaHutang: totalNettoMu - totalPembayaran,
                    selisihAlokasiDana:
                        masterDataState === 'BARU' ? (stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(stateDataHeader?.jumlahBayar)) - totalPembayaran : jumlah_bayar_mu - totalPembayaran,
                }));

                // Set dataSource baru
                gridPheListRef.current.dataSource = dataSource;
                gridPheListRef.current.refresh(); // Perbarui tampilan grid
            } else {
                console.error('DataSource is undefined or not an array.');
            }
        }
    };

    // ===============================================================
    // Template CheckBox yang ada di Grid pada saat posisi belum edit

    const handleKeyDown = (args: any, event: any) => {
        if (event.key === ' ') {
            // Jika tombol Space ditekan
            event.preventDefault(); // Mencegah scroll pada tombol Space
            handleTemplatePilih(args, !args.bayar_mu); // Toggle nilai checkbox
        }
    };

    const templatePilih = (args: any) => {
        const checkboxStyle = {
            accentColor: '#4361EE',
        };
        return (
            <input
                disabled={masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? true : false}
                onClick={(event: any) => handleTemplatePilih(args, event.target.checked)}
                onKeyDown={(event: any) => handleKeyDown(args, event)}
                type="checkbox"
                checked={args.bayar_muFix > 0 ? true : false}
                style={checkboxStyle}
                onChange={(event: any) => {}}
            />
        );
    };
    // END
    // ===============================================================

    // ===============================================================
    // Template CheckBox yang ada di Grid pada saat posisi sudah edit
    const editTemplatePilih = (args: any) => {
        const checkboxStyle = {
            accentColor: '#4361EE',
        };
        return (
            <input
                disabled={masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? true : false}
                onClick={(event: any) => handleTemplatePilih(args, event.target.checked)}
                type="checkbox"
                checked={args.bayar_muFix > 0 ? true : false}
                style={checkboxStyle}
                readOnly
                onChange={(event: any) => {}}
            />
        );
    };
    // END
    // ===============================================================

    const handleTemplatePilih = (args: any, event: any) => {
        if (gridPheListRef.current && Array.isArray(gridPheListRef.current.dataSource)) {
            const isCheck = event;
            const dataSource = [...gridPheListRef.current.dataSource]; // Salin array
            const sisaHutang = parseFloat(args.sisaFix) - parseFloat(args.sisaFix);
            if (isCheck === true) {
                const editedData = {
                    ...args,
                    sisa_hutang: sisaHutang,
                    total_berat: args.total_berat,
                    biaya_lain: args.biaya_lain,
                    potongan_lain: args.potongan_lain,
                    netto_mu: args.netto_mu,
                    bayar_mu: args.sisaFix,
                    bayar_muFix: args.sisaFix,
                };

                dataSource[args.index] = editedData;
            } else {
                const editedData = {
                    ...args,
                    sisa_hutang: args.sisaFix,
                    total_berat: args.total_berat,
                    biaya_lain: args.biaya_lain,
                    potongan_lain: args.potongan_lain,
                    netto_mu: args.netto_mu,
                    bayar_mu: 0,
                    bayar_muFix: 0,
                };

                dataSource[args.index] = editedData;
            }

            // Menghitung total netto_mu
            const totalNettoMu = dataSource.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
            // Menghitung Total Pembayaran
            const totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_muFix) || 0), 0);

            setStateDataFooter((prevState: any) => ({
                ...prevState,
                totalHutang: totalNettoMu,
                totalPembayaran: totalPembayaran,
                sisaHutang: totalNettoMu - totalPembayaran,
                selisihAlokasiDana: (stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(stateDataHeader?.jumlahBayar)) - totalPembayaran,
            }));

            // Set dataSource baru
            gridPheListRef.current.dataSource = dataSource;
            gridPheListRef.current.refresh(); // Perbarui tampilan grid
        } else {
            console.error('DataSource is undefined or not an array.');
        }
    };

    const activeTabJurnal = () => {
        setIsActiveTabJurnal('Y');
    };

    const prosesBloking = async (tipe: any) => {
        const totalPembayaran: any = stateDataFooter?.totalPembayaran === '' ? 0 : parseFloat(stateDataFooter?.totalPembayaran);
        const jumlahBayar: any = stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(stateDataHeader?.jumlahBayar);
        const periode = await FirstDayInPeriod(kode_entitas);
        const formatPeriode = moment(periode).format('YYYY-MM-DD');
        const periode_date = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);
        // setDisabledTombolSimpan(true);

        if (totalPembayaran <= 0 || jumlahBayar <= 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Jumlah Bayar tidak boleh 0.</p>',
                width: '100%',
                timer: 3000,
                target: '#dialogTtbList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (moment(stateDataHeader?.tanggal).format('YYYY-MM-DD') < formatPeriode) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;">Tanggal transaksi tidak dalam periode akuntansi Priode akuntansi saat ini : ${periode_date}</p>`,
                width: '100%',
                timer: 3000,
                target: '#dialogTtbList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        const resultTglMinusSatu = await cekTglMinusSatu(stateDataHeader?.tanggal);
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
                    title: `<p style="font-size:12px">Tanggal Dokumen lebih kecil dari hari ini, transaksi Realisasi akan dilanjutkan ?</span></p>`,
                    width: '16.4%',
                    target: '#dialogTtbList',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No', // Menambahkan teks tombol cancel
                    showCancelButton: true, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        saveDoc(tipe);
                    }
                });
            return;
        }

        const resultCekTglBackDate = await cekTglBackDate(stateDataHeader?.tanggal);
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
                    title: `<p style="font-size:12px">Tanggal Dokumen lebih kecil dari hari ini, transaksi Realisasi akan dilanjutkan ?</span></p>`,
                    width: '16.4%',
                    target: '#dialogTtbList',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No', // Menambahkan teks tombol cancel
                    showCancelButton: true, // Menampilkan tombol cancel
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        saveDoc(tipe);
                    }
                });
            return;
        }

        startProgress();
        setLoadingMessage('Simpan Data');
        saveDoc(tipe);
        endProgress();
    };

    const saveDoc = async (tipe: any) => {
        if (masterDataState === 'BAYAR') {
            if (stateDataHeader?.noReferensi === '' || stateDataHeader?.noReferensi === null) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px;color:white;">No Reff belum diisi.</p>`,
                    width: '100%',
                    timer: 3000,
                    target: '#dialogTtbList',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }

            if (gridPheJurnalListRef.current && Array.isArray(gridPheJurnalListRef.current?.dataSource)) {
                const dataSource = [...gridPheJurnalListRef.current?.dataSource]; // Salin array
                if (dataSource.length <= 0) {
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
                            title: `<p style="font-size:12px">Data jurnal belum diisi</span></p>`,
                            width: '16.4%',
                            target: '#dialogTtbList',
                            confirmButtonText: 'OK',
                            cancelButtonText: 'No', // Menambahkan teks tombol cancel
                            showCancelButton: false, // Menampilkan tombol cancel
                        })
                        .then(async (result) => {
                            if (result.isConfirmed) {
                                activeTabJurnal();
                            }
                        });
                    return;
                }
            }
        }

        let defaultNoPhe: any;
        if (masterDataState === 'BARU') {
            const genearteNu = await generateNU(kode_entitas, '', '27', stateDataHeader?.dateGenerateNu.format('YYYYMM'));
            defaultNoPhe = genearteNu;
        } else {
            defaultNoPhe = stateDataHeader?.noPheValue;
        }
        const paramObject = {
            kode_entitas: kode_entitas,
            token: token,
            tglDokumen:  moment(stateDataHeader?.tanggalBayar).isValid()
            ? moment(stateDataHeader?.tanggalBayar).format('YYYY-MM-DD HH:mm:ss')
            : moment().format('YYYY-MM-DD HH:mm:ss'),
            userid: userid.toUpperCase(),
            tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            jumlahBayar: stateDataHeader?.jumlahBayar,
        };

        const result = await ReCalc(gridPheListRef.current?.dataSource, paramObject, gridPheJurnalListRef.current?.dataSource);
        const jsonData = {
            proses: masterDataState === 'BAYAR' ? 'PEMBAYARAN' : masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' ? 'BATAL' : masterDataState,
            entitas: kode_entitas,
            kode_phe:
                masterDataState === 'BAYAR' ||
                masterDataState === 'BATAL BAYAR' ||
                masterDataState === 'EDIT' ||
                masterDataState === 'EDIT APP' ||
                masterDataState === 'APPROVAL' ||
                masterDataState === 'BATAL APP'
                    ? stateDataHeader?.kodePhe
                    : '',
            no_phe: defaultNoPhe,
            tgl_phe: moment(stateDataHeader?.tanggal).format('YYYY-MM-DD HH:mm:ss'),
            via: stateDataHeader?.via,
            kode_termin: null,
            kode_mu: 'IDR',
            kurs: 1,
            total_berat: 0,
            total_mu: stateDataHeader?.jumlahBayar, // belum harus di cek dulu
            netto_mu: stateDataHeader?.jumlahBayar, // belum harus di cek dulu
            keterangan: stateDataFooter?.keterangan,
            status: masterDataState === 'BAYAR' ? 'Lunas' : masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' ? 'Batal Bayar' : 'Terbuka',
            userid: userid.toUpperCase(),
            tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            approval:
                masterDataState === 'APPROVAL'
                    ? tipe === 'disetujui'
                        ? 'Y'
                        : tipe === 'koreksi'
                        ? 'C'
                        : tipe === 'ditolak'
                        ? 'N'
                        : null
                    : masterDataState === 'BATAL APP' || masterDataState === 'BARU' || masterDataState === 'EDIT' || masterDataState === 'EDIT APP'
                    ? null
                    : stateDataHeader?.approval,
            tgl_approval:
                masterDataState === 'APPROVAL'
                    ? tipe === 'disetujui' || tipe === 'koreksi' || tipe === 'ditolak'
                        ? moment().format('YYYY-MM-DD HH:mm:ss')
                        : null
                    : masterDataState === 'BATAL APP' || masterDataState === 'BARU' || masterDataState === 'EDIT' || masterDataState === 'EDIT APP'
                    ? null
                    : moment(stateDataHeader?.tglApproval).isValid()
                    ? moment(stateDataHeader?.tglApproval).format('YYYY-MM-DD HH:mm:ss')
                    : moment().format('YYYY-MM-DD HH:mm:ss'),
            no_reff: masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' ? stateDataHeader.noReferensi : null,
            bayar_mu: stateDataHeader?.jumlahBayar,
            total_berat_ekspedisi: 0,
            total_berat_pabrik: 0,
            total_klaim_ekspedisi: 0,
            total_klaim_pabrik: 0,
            total_tambahan: 0,
            total_pph: 0,
            sub_total: 0,
            pph23: stateDataHeader?.pph23 === '' || stateDataHeader?.pph23 === null || stateDataHeader?.pph23 === undefined ? 'N' : stateDataHeader?.pph23,
            biaya_lain: 0,
            ket_biaya: null,
            potongan_lain: 0,
            kode_dokumen: stateDataHeader?.kodeDokumen,
            tgl_bayar:
                masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE'
                    ?  moment(stateDataHeader?.tanggalBayar).isValid()
                    ? moment(stateDataHeader?.tanggalBayar).format('YYYY-MM-DD HH:mm:ss')
                    : moment().format('YYYY-MM-DD HH:mm:ss')
                    : null,
            kode_dokumen_rev: null,
            detail: result.detailJson,
            jurnal: result.detailJurnal,
            keuangan: masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' ? result.detailKeuangan : null,
        };

        console.log('Json Data = ', jsonData);
        if (masterDataState === 'BARU') {
            const cekDataTtb = await cekDataDiDatabase(kode_entitas, 'tb_m_phe', 'no_phe', jsonData?.no_phe, token);
            if (cekDataTtb) {
                // jsonData.no_ttb = defaultNoTtb;
                const generateCounter = await generateNU(kode_entitas, defaultNoPhe, '27', stateDataHeader?.dateGenerateNu.format('YYYYMM'));
                const generateNoDok = await generateNU(kode_entitas, '', '27', stateDataHeader?.dateGenerateNu.format('YYYYMM'));
                jsonData.no_phe = generateNoDok;
            }
            const response = await axios.post(`${apiUrl}/erp/simpan_phe`, jsonData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;
            const status = result.status;
            const errormsg = result.serverMessage;
            const error = result.error;
            if (status === true) {
                await generateNU(kode_entitas, defaultNoPhe, '27', stateDataHeader?.dateGenerateNu.format('YYYYMM'));
                // await generateNUDivisi(kode_entitas, noTtbValue, divisiPenjualan, '08', moment(date1).format('YYYYMM'), moment(date1).format('YYMM') + `${divisiPenjualan}`);
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
                await closeDialog();
                setDisabledTombolSimpan(false);
            } else {
                endProgress();
                withReactContent(swalDialog).fire({
                    title: `<p style="font-size:12px;color:black;margin-right: -42px;">${error}</p>`,
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
        } else if (masterDataState === 'EDIT' || masterDataState === 'EDIT APP' || masterDataState === 'APPROVAL' || masterDataState === 'BATAL APP') {
            console.log('Json Data = ', jsonData);
            const response = await axios.patch(`${apiUrl}/erp/update_phe`, jsonData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultSimpan = response.data;
            const status = resultSimpan.status;
            const errormsg = resultSimpan.serverMessage;
            const error = resultSimpan.error;
            if (status === true) {
                endProgress();
                await withReactContent(swalPopUp).fire({
                    icon: 'success',
                    title: `<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil di ${
                        masterDataState === 'APPROVAL'
                            ? tipe === 'disetujui' || tipe === 'koreksi' || tipe === 'ditolak'
                                ? tipe.toUpperCase()
                                : masterDataState
                            : masterDataState === 'BATAL APP'
                            ? 'BATAL APPROVAL'
                            : masterDataState
                    }</p>`,
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
                await closeDialog();
                setDisabledTombolSimpan(false);
            } else {
                endProgress();
                await withReactContent(swalDialog).fire({
                    title: `<p style="font-size:12px;color:black;margin-right: -42px;">${error}</p>`,
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
        } else if (masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE') {
            console.log('Json Data = ', jsonData);

            const response = await axios.patch(`${apiUrl}/erp/pembayaran_phe`, jsonData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resultSimpan = response.data;
            const status = resultSimpan.status;
            const errormsg = resultSimpan.serverMessage;
            const error = resultSimpan.error;
            if (status === true) {
                await handleUploadZip(resultSimpan.data.kode_phe, tipeBersihkangambar, selectedBersihkangambar);
                await generateNU(paramObject.kode_entitas, result.generateNU, '20', moment().format('YYYYMM'));
                endProgress();
                await withReactContent(swalPopUp).fire({
                    icon: 'success',
                    title: `<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil di ${masterDataState}</p>`,
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
                await closeDialog();
                setDisabledTombolSimpan(false);
            } else {
                endProgress();
                await withReactContent(swalDialog).fire({
                    title: `<p style="font-size:12px;color:white;margin-right: -42px;">${error}</p>`,
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

    const UpdateFilePendukung = async () => {
        await handleUploadZip(stateDataHeader?.kodePhe, tipeBersihkangambar, selectedBersihkangambar);
        await withReactContent(swalPopUp).fire({
            icon: 'success',
            title: '<p style="font-size:12px;color:white;margin-right: -42px;">File Pendukung berhasi di update.</p>',
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
        await closeDialog();
        setDisabledTombolSimpan(false);
    };

    const closeDialog = async () => {
        const mergerObject = {
            ...handleParamsObject,
        };

        clearAllImages(mergerObject);
        reCacRefreshDialog();
        setTimeout(() => {
            onRefresh();
        }, 100);
        await onClose();
        setRefreshKeyNamaEks((prevKey: any) => prevKey + 1);
        setRefreshKeyPph23((prevKey: any) => prevKey + 1);
    };

    const reCacRefreshDialog = () => {
        const namaEkspedisi = document.getElementById('namaEkspedisi') as HTMLInputElement;
        if (namaEkspedisi) {
            namaEkspedisi.value = '';
        }

        const pph23 = document.getElementById('pph23') as HTMLInputElement;
        if (pph23) {
            pph23.value = '';
        }

        const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
        if (jumlahBayar) {
            jumlahBayar.value = '';
        }

        setStateDataHeader((prevState: any) => ({
            ...prevState,
            noPheValue: '',
            dateGenerateNu: moment(),
            tanggal: moment(),
            tanggalBayar: moment(),
            via: '',
            pph23: '',
            kodePhe: '',
            kodeRpe: '',
            totalBarang: '',
            jumlahBayar: '',
            terbilangJumlah: '',
            kodeAkunJurnal1: '',
            kodeAkunJurnal2: '',
            noAkun1: '',
            noAkun2: '',
            namaAkun1: '',
            namaAkun2: '',
            tipeAkun: '',
            kurs: 1,
            kodeJual: '',
            namaDept: '',
            kodeDept: '',
            noDept: '',
            noReferensi: '',

            approval: null,
            // tglApproval: null,
            tglApproval: moment(),
            kodeDokumen: null,
            noDokumen: '',
        }));

        setStateDataFooter((prevState) => ({
            ...prevState,
            totalHutang: '',
            totalPembayaran: '',
            sisaHutang: '',
            selisihAlokasiDana: '',
            keterangan: '',
            totalDebet: 0,
            totalKredit: 0,
            totalSelisih: 0,
        }));
        gridPheListRef.current?.setProperties({ dataSource: [] });
        gridPheJurnalListRef.current?.setProperties({ dataSource: [] });
    };

    // Loading data indicator
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

    const selectedRowIndex = useRef<number | null>(null);
    // const [idAlokasiDana, setIdAlokasiDana] = useState('');
    const idAlokasiDana = useRef('');
    const selectedRowsData = (args: any) => {
        if (args.data !== undefined) {
            // setIdAlokasiDana(args.data.id);
            idAlokasiDana.current = args.data.id;
            selectedRowIndex.current = args.rowIndex;
        }
    };

    const handleParamsObject = {
        kode_entitas: kode_entitas,
        token: token,
        userid: userid,
        entitas: entitas,
        vRefreshData: vRefreshData,
        tipe: '',
        valueObject: null,
        setStateDataHeader,
        setStateDataFooter,
        setDataAlokasiPembayaran,
        stateDataHeader,
        stateDataFooter,
        dataAlokasiPembayaran,
        gridPheListRef: gridPheListRef.current,
        gridPheJurnalListRef: gridPheJurnalListRef.current,

        masterDataState,
        idAlokasiDana: idAlokasiDana.current,

        setPlagButtonbayarInvoice,

        setTipeSelectedBersihkangambar,
        setLoadFilePendukung,
        setSelectedBersihkangambar,
        setImages,
        setSelectedFiles,
        tabs,
        loadFilePendukung,
        selectedFile,
        formattedName,
        setNamaFiles,
        setFileGambar,
        fileGambar,
        masterKodeDokumen,

        setSelectedFile,
        setZoomScale,
        setIsDragging,
        setOffset,
        position,

        isDragging,
        setPosition,
        offset,
    };

    const styles1 = {
        container: {
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #c0c0c0',
            borderRadius: '4px',
            width: '300px',
            overflow: 'hidden',
        },
        input: {
            flex: 1,
            border: 'none',
            padding: '8px',
            fontSize: '14px',
            outline: 'none',
        },
        select: {
            border: 'none',
            // borderLeft: '1px solid #c0c0c0',
            padding: '8px',
            outline: 'none',
            background: '#fff',
        },
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
        const mergerObject = {
            ...handleParamsObject,
        };
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

    const handleUploadZip = async (kode_dokumen: any, tipeBersihkangambar: any, selectedBersihkangambar: any) => {
        const formData = new FormData();
        selectedFiles.forEach((fileWithTabIdx: any, index: any) => {
            const file = fileWithTabIdx.file; // Ambil file dari objek fileWithTabIdx
            const tabIdx = fileWithTabIdx.tabIndex; // Ambil tabIdx dari objek fileWithTabIdx
            formData.append(`myimage`, file);
            const fileExtension = file.name.split('.').pop();
            // formData.append(`nama_file_image`, selectedFile !== 'update' ? `SP${selectedNamaFiles[index]}.${fileExtension}` : fileGambar);
            formData.append(`nama_file_image`, `PE${selectedNamaFiles[index]}.${fileExtension}`);
            formData.append(`kode_dokumen`, kode_dokumen);
            formData.append(`id_dokumen`, tabIdx + 1);
            formData.append(`dokumen`, 'PE');
        });

        if (kode_entitas === '99999') {
            entitas = '999';
        } else {
            entitas = kode_entitas;
        }
        formData.append('ets', entitas);

        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        if (selectedFiles.length > 0) {
            await axios
                .post(`${apiUrl}/upload`, formData)
                .then((response) => {
                    let jsonSimpan;
                    if (Array.isArray(response.data.nama_file_image)) {
                        // Buat array JSON berdasarkan respon
                        jsonSimpan = response.data.nama_file_image.map((namaFile: any, index: any) => {
                            return {
                                entitas: kode_entitas,
                                kode_dokumen: kode_dokumen,
                                id_dokumen: response.data.id_dokumen[index],
                                dokumen: 'PE',
                                filegambar: namaFile,
                                fileoriginal: response.data.filesinfo[index] ? response.data.filesinfo[index].fileoriginal : null,
                            };
                        });
                    } else {
                        jsonSimpan = {
                            entitas: kode_entitas,
                            kode_dokumen: kode_dokumen,
                            id_dokumen: response.data.id_dokumen,
                            dokumen: 'PE',
                            filegambar: response.data.nama_file_image,
                            fileoriginal: response.data.filesinfo,
                        };
                    }
                    if (response.data.status === true) {
                        // if (selectedFile !== 'update') {
                        axios
                            .post(`${apiUrl}/erp/simpan_tbimages`, jsonSimpan)
                            .then((response) => {
                                console.log(response);
                            })
                            .catch((error) => {
                                console.error('Error:', error);
                            });
                        // }
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        if (tipeBersihkangambar === 'bersihkan') {
            const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung?`, {
                params: {
                    entitas: kode_entitas,
                    param1: kode_dokumen,
                    param2: selectedBersihkangambar,
                },
            });

            const hapusFilePendukung = response.data.data;
            console.log(hapusFilePendukung.serverStatus);
        }
    };

    const editBayarMu = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'text'; // Tetap menggunakan 'text' karena 'number' memiliki beberapa batasan
            input.step = 'any'; // Mengizinkan angka desimal

            // Tambahkan gaya untuk membuat teks rata kanan
            input.style.textAlign = 'right';

            // Tambahkan event listener untuk memblokir input selain angka
            input.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9.]/g, ''); // Mengizinkan angka dan titik desimal
            });

            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 ? '' : value;

                // Mengatur fokus dan memindahkan kursor ke akhir teks
                setTimeout(() => {
                    input.focus();
                    input.select(); // Memblokir seluruh teks di dalam input
                }, 0);
            }
        },
    };

    const handleDataBound = () => {
        if (gridPheListRef.current && selectedRowIndex.current !== null) {
            (gridPheListRef.current as any).selectRow(selectedRowIndex.current, false);
        }
    };

    useEffect(() => {
        if (gridPheListRef.current && selectedRowIndex.current !== null) {
            (gridPheListRef.current as any).selectRow(selectedRowIndex.current, false);
        }
    }, [selectedRowIndex.current, dataAlokasiPembayaran]);

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

    // END
    // ====================================================================

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
                    let header: JSX.Element | string = '';
                    if (masterDataState == 'BARU') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'EDIT') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Edit Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'APPROVAL') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Approval Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'BATAL APP') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Batal Approval Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'BAYAR' || masterDataState === 'EDIT RELEASE') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState == 'BATAL BAYAR') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Batal Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState === 'FilePendukung') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ UPDATE FILE PENDUKUNG ]</span>
                                </div>
                            </div>
                        );
                    } else if (masterDataState === 'EDIT APP') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Edit Approval Pembayaran Hutang Ekspedisi <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>[ PEMBAYARAN ]</span>
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
                width="80%" //"70%"
                height="79%"
                position={{ X: 'center', Y: 8 }}
                style={{ position: 'fixed' }}
                // buttons={buttonInputData}
                close={() => {
                    closeDialog();
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
                                <div className="panel-tabel h-[200px] w-[100%]">
                                    <div className="flex">
                                        <div className="w-[60%]">
                                            <div className="flex items-center">
                                                <label className="mr-[6px] w-[15%] text-right">Tanggal </label>
                                                {masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? (
                                                    <input
                                                        className={` container form-input`}
                                                        style={{
                                                            background: '#eeeeee',
                                                            fontSize: 11,
                                                            marginTop: 4,
                                                            marginLeft: 0,
                                                            borderColor: '#bfc9d4',
                                                            width: '21%',
                                                            borderRadius: 2,
                                                            height: '33px',
                                                        }}
                                                        disabled={true}
                                                        value={moment(stateDataHeader?.tanggal).format('DD-MM-YYYY')}
                                                        readOnly
                                                    ></input>
                                                ) : (
                                                    <div className="form-input mt-1 flex w-[21%] justify-between rounded-[2px]">
                                                        <DatePickerComponent
                                                            locale="id"
                                                            cssClass="e-custom-style"
                                                            // renderDayCell={onRenderDayCell}
                                                            enableMask={true}
                                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                            showClearButton={false}
                                                            format="dd-MM-yyyy"
                                                            value={stateDataHeader?.tanggal.toDate()}
                                                            change={(args: ChangeEventArgsCalendar) => {
                                                                setStateDataHeader((prevState: any) => ({
                                                                    ...prevState,
                                                                    tanggal: moment(args.value),
                                                                }));
                                                            }}
                                                            style={{ margin: '-5px' }}
                                                        >
                                                            <Inject services={[MaskedDateTime]} />
                                                        </DatePickerComponent>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <label className="mr-[6px] w-[15%] text-right">No. PHE</label>
                                                <input
                                                    className="container form-input ml-0 mt-1 w-[21%] rounded-[2px] border border-[#bfc9d4] bg-[#eeeeee] text-[11px]"
                                                    disabled={true}
                                                    value={stateDataHeader?.noPheValue}
                                                    readOnly
                                                ></input>
                                            </div>

                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label className="mr-[6px] mt-[17px] w-[15%] text-right">Nama Ekspedisi</label>
                                                {/* <div className="container form-input ml-0 mt-[13px] w-[30%] rounded-[2px] border border-[#bfc9d4] text-[11px]"> */}
                                                {masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? (
                                                    // <select
                                                    //     key={`dropdown-${refreshKeyNamaEks}`}
                                                    //     style={styles1.select}
                                                    //     // onChange={handleChange}
                                                    //     disabled={
                                                    //         masterDataState === 'BAYAR' ||
                                                    //         masterDataState === 'BATAL BAYAR' ||
                                                    //         masterDataState === 'EDIT RELEASE' ||
                                                    //         masterDataState === 'FilePendukung'
                                                    //     }
                                                    // >
                                                    //     <option value="" disabled>
                                                    //         -- Silahkan Pilih Nama Ekspedisi --
                                                    //     </option>
                                                    //     {listEkspedisi.map((data: any, index: any) => (
                                                    //         <option key={index} value={data.ekspedisi}>
                                                    //             {data.ekspedisi}
                                                    //         </option>
                                                    //     ))}
                                                    // </select>
                                                    <input
                                                        className="container form-input ml-0 mt-[11px] w-[30%] rounded-[2px] border border-[#bfc9d4] bg-[#eeeeee] text-[11px]"
                                                        disabled={true}
                                                        value={stateDataHeader?.via}
                                                        readOnly
                                                    ></input>
                                                ) : (
                                                    <div className="container form-input ml-0 mt-[13px] w-[30%] rounded-[2px] border border-[#bfc9d4] text-[11px]">
                                                        <DropDownListComponent
                                                            key={`dropdown-${refreshKeyNamaEks}`}
                                                            id="namaEkspedisi"
                                                            className="form-select"
                                                            dataSource={listEkspedisi.map((data: any) => data.ekspedisi)}
                                                            placeholder="-- Silahkan Pilih Nama Ekspedisi --"
                                                            change={(args: ChangeEventArgsDropDown) => {
                                                                const valueObject: any = args.value;
                                                                setStateDataHeader((prevState: any) => ({
                                                                    ...prevState,
                                                                    via: valueObject,
                                                                }));

                                                                const mergerObject = {
                                                                    ...handleParamsObject,
                                                                    valueObject,
                                                                };
                                                                handleNamaEkspedisiChange(mergerObject);
                                                            }}
                                                            // disabled={masterDataState === 'BAYAR' ? true : false}
                                                            // value={selectedOptionAlasan}
                                                        />
                                                    </div>
                                                )}
                                                {/* <div style={styles1.container}> */}
                                                {/* <input type="text" value="AZZKA TRANSPORT" readOnly style={styles1.input} /> */}

                                                {/* </div> */}
                                                {/* </div> */}
                                                <div className="mt-[-105px] flex w-[53%] items-center">
                                                    <label className="mt-[126px] w-[12%] text-right">PPH 23</label>
                                                    {/* <div className="container form-input ml-[2%] mt-[118px] w-[41%] rounded-[2px] border border-[#bfc9d4] text-[11px]"> */}
                                                    {masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? (
                                                        // <select
                                                        //     key={`dropdown-${refreshKeyPph23}`}
                                                        //     style={styles1.select}
                                                        //     // onChange={handleChange}
                                                        //     disabled={
                                                        //         masterDataState === 'BAYAR' ||
                                                        //         masterDataState === 'BATAL BAYAR' ||
                                                        //         masterDataState === 'EDIT RELEASE' ||
                                                        //         masterDataState === 'FilePendukung'
                                                        //     }
                                                        // >
                                                        //     <option value="" disabled>
                                                        //         -- Silahkan Pilih PPH --
                                                        //     </option>
                                                        //     {listPph.map((data: any, index: any) => (
                                                        //         <option key={index} value={data.kode_pajak}>
                                                        //             {data.catatan}
                                                        //         </option>
                                                        //     ))}
                                                        // </select>
                                                        <input
                                                            className="container form-input ml-0 ml-[10px] mt-[117px] w-[41%] rounded-[2px] border border-[#bfc9d4] bg-[#eeeeee] text-[11px]"
                                                            disabled={true}
                                                            value={stateDataHeader?.catatanPph23}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="container form-input ml-[2%] mt-[118px] w-[41%] rounded-[2px] border border-[#bfc9d4] text-[11px]">
                                                            <DropDownListComponent
                                                                key={`dropdown-${refreshKeyPph23}`}
                                                                id="pph23"
                                                                className="form-select"
                                                                dataSource={listPph}
                                                                placeholder="-- Silahkan Pilih PPH --"
                                                                fields={{ text: 'catatan', value: 'kode_pajak' }}
                                                                change={(args: ChangeEventArgsDropDown) => {
                                                                    const selectedCodes = args.value; // Mendapatkan kode yang dipilih sebagai array
                                                                    const selectedItems = listPph.filter((item: any) => item.kode_pajak === selectedCodes);
                                                                    const valueObject = selectedItems; // Mendapatkan objek lengkap berdasarkan kode
                                                                    setStateDataHeader((prevState: any) => ({
                                                                        ...prevState,
                                                                        pph23: selectedCodes,
                                                                    }));
                                                                    const mergerObject = {
                                                                        ...handleParamsObject,
                                                                        valueObject: selectedCodes,
                                                                    };
                                                                    handlePph23Change(mergerObject);
                                                                }}
                                                                // disabled={masterDataState === 'BAYAR' ? true : false}
                                                                // value={selectedOptionAlasan}
                                                            />
                                                        </div>
                                                    )}
                                                    {/* </div> */}
                                                </div>
                                            </div>
                                            <div style={{ width: '100%' }}>
                                                <label style={{ marginLeft: '10px', color: 'green', fontWeight: 'bold', marginTop: '5%' }}>{stateDataHeader?.terbilangJumlah}</label>
                                            </div>
                                        </div>
                                        <div style={{ width: '40%' }}>
                                            {masterDataState === 'BARU' ||
                                            masterDataState === 'EDIT' ||
                                            masterDataState === 'EDIT APP' ||
                                            masterDataState === 'APPROVAL' ||
                                            masterDataState === 'BATAL APP' ? (
                                                <div style={{ marginBottom: '22%' }}></div>
                                            ) : (
                                                <div className="mb-[5px] ml-auto h-[136px] w-[52%] rounded-[1px] border bg-[#d1d1d1] p-3">
                                                    <label className="flex items-center justify-center bg-[#034fdb] font-bold text-white">Tanggal Dibayar</label>
                                                    <div className="flex">
                                                        <div className="w-[34%]">
                                                            <label className="mt-[16px] flex items-center justify-end">Tanggal Bayar</label>
                                                        </div>
                                                        <div className="ml-[20px] w-[59%]">
                                                            {masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? (
                                                                <input
                                                                    className={` container form-input`}
                                                                    style={{
                                                                        background: '#eeeeee',
                                                                        fontSize: 11,
                                                                        marginTop: 4,
                                                                        marginLeft: 0,
                                                                        borderColor: '#bfc9d4',
                                                                        width: '100%',
                                                                        borderRadius: 2,
                                                                        height: '33px',
                                                                    }}
                                                                    disabled={true}
                                                                    value={moment(stateDataHeader?.tanggalBayar).format('DD-MM-YYYY')}
                                                                    readOnly
                                                                ></input>
                                                            ) : (
                                                                <div className="form-input mt-1 flex w-[100%] justify-between rounded-[2px]">
                                                                    <DatePickerComponent
                                                                        locale="id"
                                                                        cssClass="e-custom-style"
                                                                        enableMask={true}
                                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                        showClearButton={false}
                                                                        format="dd-MM-yyyy"
                                                                        value={stateDataHeader?.tanggalBayar === null ? moment().toDate() : stateDataHeader?.tanggalBayar.toDate()}
                                                                        change={(args: ChangeEventArgsCalendar) => {
                                                                            setStateDataHeader((prevState: any) => ({
                                                                                ...prevState,
                                                                                tanggalBayar: moment(args.value),
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <Inject services={[MaskedDateTime]} />
                                                                    </DatePickerComponent>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <div className="w-[34%]">
                                                            <label className="mt-[16px] flex items-center justify-end">No. Reff</label>
                                                        </div>
                                                        <div className="ml-[20px] w-[59%]">
                                                            {masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? (
                                                                <input
                                                                    className="container form-input ml-0 mt-1 h-[32px] w-[100%] rounded-[2px] border border-[#bfc9d4] bg-[#eeeeee] text-[11px]"
                                                                    disabled={true}
                                                                    value={stateDataHeader?.noReferensi}
                                                                    readOnly
                                                                ></input>
                                                            ) : (
                                                                <div className="container form-input ml-0 mt-[4px] w-[100%] rounded-[2]">
                                                                    <TextBoxComponent
                                                                        id="noReferensi"
                                                                        placeholder=""
                                                                        value={stateDataHeader?.noReferensi}
                                                                        input={(args: FocusInEventArgs) => {
                                                                            const value: any = args.value;
                                                                            setStateDataHeader((prevState: any) => ({
                                                                                ...prevState,
                                                                                noReferensi: value,
                                                                            }));
                                                                        }}
                                                                        // disabled={modalJenisPenerimaan === 'UpdateFilePendukung'}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="mt-[2px] flex items-center">
                                                <label className="ml-[35%] mt-[5px] w-[39%] text-right">Jumlah yang akan di Bayar</label>
                                                <input
                                                    id="jumlahBayar"
                                                    className="container form-input ml-[1%] mt-[2px] w-[26%] rounded-[2px] border border-[#bfc9d4] text-right text-[11px]"
                                                    disabled={
                                                        masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung'
                                                            ? true
                                                            : false
                                                    }
                                                    onFocus={(event) => event.target.select()}
                                                    onBlur={(event: any) => {
                                                        const valueObject = event.target.value;
                                                        const mergerObject = {
                                                            ...handleParamsObject,
                                                            valueObject,
                                                        };
                                                        handleJumlahBayar(mergerObject);
                                                    }}
                                                    onKeyDown={(event) => {
                                                        const char = event.key;
                                                        const isValidChar = /[0-9.\s]/.test(char) || event.keyCode === 8;
                                                        if (!isValidChar) {
                                                            event.preventDefault();
                                                        }
                                                        const inputValue = (event.target as HTMLInputElement).value;
                                                        if (char === '.' && inputValue.includes('.')) {
                                                            event.preventDefault();
                                                        }
                                                    }}
                                                    // value={stateDataHeader.noRpe}
                                                ></input>
                                            </div>
                                            <div className="mb-[5px] mt-[2px] flex items-center">
                                                <label className="ml-[51%] w-[26%]"></label>
                                                <ButtonComponent
                                                    id="buBayarAllFaktur"
                                                    content={plagButtonBayarInvoice === 'Bayar' ? 'Bayar Semua Invoice' : 'Batal Semua Pembayaran'}
                                                    // content={stateDataFooter.totalTagihan === 0 ? 'Bayar Semua Invoice' : stateDataHeader.disabledBatalInvoice === true ? 'Batal Semua Pembayaran' : 'Reset Pembayaran'}
                                                    disabled={
                                                        masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung'
                                                            ? true
                                                            : false
                                                    }
                                                    cssClass="e-primary e-small"
                                                    // iconCss="e-icons e-small e-search"
                                                    // style={
                                                    //     stateDataHeader.disabledBayarAllInvoice === true
                                                    //         ? { width: '24%', backgroundColor: '#3b3f5c', marginTop: 2, color: '#c3c7cb', background: '#f1f2f3', marginLeft: '1%' }
                                                    //         : { width: '24%', backgroundColor: '#3b3f5c', marginTop: 2, color: '#605a5a', background: '#eeeeee', marginLeft: '1%' }
                                                    // }
                                                    style={{
                                                        width: '28%',
                                                        backgroundColor: '#3b3f5c',
                                                        marginTop: 2,
                                                        color: '#605a5a',
                                                        background: '#eeeeee',
                                                        marginLeft: '1%',
                                                    }}
                                                    // onClick={() => {
                                                    //     stateDataHeader.disabledResetPembayaran === true
                                                    //         ? BayarSemuaFaktur(setDataBarang, setStateDataFooter, setStateDataHeader)
                                                    //         : ResetPembayaran(setDataBarang, setStateDataFooter, setStateDataHeader);
                                                    // }}
                                                    onClick={() => {
                                                        const mergerObject = {
                                                            ...handleParamsObject,
                                                        };

                                                        plagButtonBayarInvoice === 'Bayar' ? bayarSemuaInvoice(mergerObject) : batalSemuaInvoice(mergerObject);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===============  Detail Data ========================   */}
                            {masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung' ? (
                                <>
                                    <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '336px' }}>
                                        <TabComponent
                                            selectedItem={masterDataState === 'FilePendukung' ? 2 : isActiveTabJurnal === 'Y' ? 1 : 0}
                                            animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                            height="100%"
                                        >
                                            <div className="e-tab-header">
                                                <div tabIndex={0}>1. Alokasi Pembayaran</div>
                                                <div tabIndex={1}>2. Jurnal</div>
                                                <div tabIndex={2}>3. File Pendukung</div>
                                            </div>
                                            {/*===================== Content menampilkan data barang =======================*/}
                                            <div className="e-content">
                                                <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                                    <GridComponent
                                                        id="gridPheList"
                                                        name="gridPheList"
                                                        className="gridPheList"
                                                        locale="id"
                                                        ref={gridPheListRef}
                                                        dataSource={dataAlokasiPembayaran.nodes}
                                                        editSettings={
                                                            masterDataState === 'BAYAR' ||
                                                            masterDataState === 'BATAL BAYAR' ||
                                                            masterDataState === 'EDIT RELEASE' ||
                                                            masterDataState === 'FilePendukung'
                                                                ? { newRowPosition: 'Bottom' }
                                                                : { allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }
                                                        }
                                                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                        allowResizing={true}
                                                        autoFit={true}
                                                        rowHeight={22}
                                                        allowSorting={true}
                                                        height={220} //170 barang jadi 150 barang produksi
                                                        gridLines={'Both'}
                                                        // // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                        rowSelected={selectedRowsData}
                                                        dataBound={handleDataBound}
                                                        // load={load}
                                                        actionBegin={handleActionBaginRows}
                                                        // actionComplete={handleActionComplate}
                                                        recordClick={(args: any) => {
                                                            const currentDaftar = gridPheListRef.current?.getSelectedRecords() || [];
                                                            if (currentDaftar.length > 0) {
                                                                gridPheListRef.current?.startEdit();
                                                            }
                                                        }}
                                                    >
                                                        <ColumnsDirective>
                                                            <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />
                                                            <ColumnDirective
                                                                field="no_rpe"
                                                                isPrimaryKey={true}
                                                                // editTemplate={editTemplateNoSj}
                                                                headerText="No. RPE"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="120"
                                                            />
                                                            <ColumnDirective
                                                                field="tgl_rpe"
                                                                isPrimaryKey={true}
                                                                headerText="Tgl. RPE"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="85"
                                                                type="date"
                                                                format={formatDate}
                                                            />
                                                            <ColumnDirective
                                                                field="no_reff"
                                                                isPrimaryKey={true}
                                                                headerText="No. Faktur Ekspedisi"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="135"
                                                            />
                                                            <ColumnDirective field="pph23" isPrimaryKey={true} headerText="PPH 23" headerTextAlign="Center" textAlign="Center" width="50" />
                                                            <ColumnDirective
                                                                editTemplate={editTemplateTotalBerat}
                                                                // edit={qtyParams}
                                                                field="total_berat"
                                                                format="N2"
                                                                headerText="Total Berat"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="100"
                                                            />
                                                            <ColumnDirective
                                                                editTemplate={editTemplateBiayaLain}
                                                                isPrimaryKey={true}
                                                                // edit={qtyParams}
                                                                field="biaya_lain"
                                                                format="N2"
                                                                headerText="Biaya Lain"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="115"
                                                            />
                                                            <ColumnDirective
                                                                editTemplate={editTemplatePotonganLain}
                                                                // edit={qtyParams}
                                                                field="potongan_lain"
                                                                format="N2"
                                                                headerText="Potongan Lain"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="115"
                                                            />
                                                            <ColumnDirective
                                                                editTemplate={editTemplateNettoMu}
                                                                field="netto_mu"
                                                                format="N2"
                                                                headerText="Netto"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="135"
                                                            />
                                                            <ColumnDirective
                                                                editTemplate={editTemplatePilih}
                                                                template={templatePilih}
                                                                headerText="Pilih"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                width="50"
                                                            />
                                                            <ColumnDirective
                                                                field="bayar_mu"
                                                                format="N2"
                                                                headerText="Jumlah Yang Akan Dibayar"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="135"
                                                                isPrimaryKey={
                                                                    masterDataState === 'BAYAR' ||
                                                                    masterDataState === 'BATAL BAYAR' ||
                                                                    masterDataState === 'EDIT RELEASE' ||
                                                                    masterDataState === 'FilePendukung'
                                                                        ? true
                                                                        : false
                                                                }
                                                                // template={editTemplateBayarMu}
                                                                // editTemplate={editTemplateBayarMu}
                                                                headerTemplate={headerJumlahYangAkanDibayar}
                                                            />
                                                            <ColumnDirective
                                                                editTemplate={editTemplateSisaHutang}
                                                                // edit={qtyParams}
                                                                field="sisa_hutang"
                                                                format="N2"
                                                                headerText="Sisa"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="135"
                                                            />
                                                        </ColumnsDirective>

                                                        <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                    </GridComponent>

                                                    <div className="panel-pager">
                                                        <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                            <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                                <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                                    <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                                        <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                            <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                                <div className="mt-1 flex">
                                                                                    <ButtonComponent
                                                                                        id="buDelete1"
                                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                        cssClass="e-warning e-small"
                                                                                        iconCss="e-icons e-small e-trash"
                                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                        onClick={() => {
                                                                                            const mergerObject = {
                                                                                                ...handleParamsObject,
                                                                                            };
                                                                                            handleDelete('delete', mergerObject);
                                                                                        }}
                                                                                    />
                                                                                    <ButtonComponent
                                                                                        id="buDeleteAll1"
                                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                        cssClass="e-danger e-small"
                                                                                        iconCss="e-icons e-small e-erase"
                                                                                        style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                        onClick={() => {
                                                                                            const mergerObject = {
                                                                                                ...handleParamsObject,
                                                                                            };
                                                                                            handleDelete('deleteAll', mergerObject);
                                                                                        }}
                                                                                    />
                                                                                    <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                        <b>Jumlah RPE :</b>&nbsp;&nbsp;&nbsp;{stateDataHeader?.totalBarang}
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
                                                    <GridComponent
                                                        id="gridPheJurnalList"
                                                        name="gridPheJurnalList"
                                                        className="gridPheJurnalList"
                                                        locale="id"
                                                        ref={gridPheJurnalListRef}
                                                        dataSource={dataJurnal.nodes}
                                                        editSettings={
                                                            masterDataState === 'BAYAR' ||
                                                            masterDataState === 'BATAL BAYAR' ||
                                                            masterDataState === 'EDIT RELEASE' ||
                                                            masterDataState === 'FilePendukung'
                                                                ? { newRowPosition: 'Bottom' }
                                                                : { allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }
                                                        }
                                                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                        allowResizing={true}
                                                        autoFit={true}
                                                        rowHeight={22}
                                                        height={220} //170 barang jadi 150 barang produksi
                                                        gridLines={'Both'}
                                                        // // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                        rowSelected={selectedRowsData}
                                                        load={load}
                                                        actionBegin={handleActionBaginRows}
                                                        // actionComplete={handleActionComplate}
                                                    >
                                                        <ColumnsDirective>
                                                            {/* <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" /> */}
                                                            <ColumnDirective
                                                                field="no_akun"
                                                                isPrimaryKey={true}
                                                                headerText="No. Akun"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="80"
                                                                clipMode="EllipsisWithTooltip"
                                                                // editTemplate={EditTemplateNoAkun}
                                                            />
                                                            <ColumnDirective
                                                                field="nama_akun"
                                                                isPrimaryKey={true}
                                                                headerText="Nama Akun"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="150"
                                                                clipMode="EllipsisWithTooltip"
                                                                // editTemplate={EditTemplateNamaAkun}
                                                            />
                                                            <ColumnDirective
                                                                field="debet_rp"
                                                                format="N2"
                                                                // edit={editDebetRp}
                                                                // edit={qtyParams}
                                                                // editTemplate={EditTemplateNilaiDebet}
                                                                headerText="Debet"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="100"
                                                            />
                                                            <ColumnDirective
                                                                field="kredit_rp"
                                                                format="N2"
                                                                // edit={editKreditRp}
                                                                // edit={qtyParams}
                                                                // editTemplate={EditTemplateNilaiKredit}
                                                                headerText="Kredit"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="100"
                                                            />
                                                            <ColumnDirective
                                                                field="catatan"
                                                                headerText="Keterangan"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="350"
                                                                // edit={editKeterangan}
                                                                clipMode="EllipsisWithTooltip"
                                                                // editTemplate={EditTemplateKeterangan}
                                                            />
                                                            <ColumnDirective
                                                                isPrimaryKey={true}
                                                                field="mu"
                                                                headerText="MU"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                width="50"
                                                                clipMode="EllipsisWithTooltip"
                                                                // editTemplate={EditTemplateMu}
                                                            />
                                                            <ColumnDirective
                                                                field="kurs"
                                                                format="N2"
                                                                headerText="Kurs"
                                                                headerTextAlign="Center"
                                                                textAlign="Center"
                                                                width="50"
                                                                // edit={editKurs}
                                                                // editTemplate={EditTemplateNilaiKurs}
                                                            />
                                                            <ColumnDirective
                                                                field="jumlah_mu"
                                                                format="N2"
                                                                // edit={editJumnlahMu}
                                                                headerText="Jumlah [MU]"
                                                                headerTextAlign="Center"
                                                                textAlign="Right"
                                                                width="110"
                                                                // editTemplate={EditTemplateNilaiJumlahMu}
                                                            />
                                                            <ColumnDirective
                                                                isPrimaryKey={true}
                                                                field="subledger"
                                                                headerText="Subsidiary Ledger"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="150"
                                                                clipMode="EllipsisWithTooltip"
                                                                // editTemplate={EditTemplateSubledger}
                                                            />
                                                            <ColumnDirective
                                                                // editTemplate={TemplateDepartemen}
                                                                isPrimaryKey={true}
                                                                field="departemen"
                                                                headerText="Departemen"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="100"
                                                            />
                                                            <ColumnDirective
                                                                // editTemplate={TemplateDivisi}
                                                                isPrimaryKey={true}
                                                                field="kode_jual"
                                                                headerText="Divisi Penjualan"
                                                                headerTextAlign="Center"
                                                                textAlign="Left"
                                                                width="100"
                                                            />
                                                        </ColumnsDirective>

                                                        <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                    </GridComponent>

                                                    <div className="panel-pager">
                                                        <div className="mt-1 flex">
                                                            <div style={{ width: '75%' }}>
                                                                {/* {modalJenisPenerimaan === 'UpdateFilePendukung' || modalJenisPenerimaan === 'batal tolak' ? null : ( */}
                                                                <>
                                                                    <ButtonComponent
                                                                        id="buDeleteAll1"
                                                                        content="Auto Jurnal"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-danger e-small"
                                                                        iconCss="e-icons e-small e-description"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em', backgroundColor: '#3b3f5c' }}
                                                                        onClick={() => {
                                                                            const mergerObject = {
                                                                                ...handleParamsObject,
                                                                            };
                                                                            if (masterDataState === 'BAYAR') {
                                                                                onClickAutoJurnal(mergerObject);
                                                                            } else if (masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE') {
                                                                                onClickAutoJurnalBatalApp(mergerObject);
                                                                            }
                                                                        }}
                                                                    />
                                                                </>
                                                                {/* )} */}
                                                            </div>
                                                            <div style={{ width: '25%', fontSize: '11px' }}>
                                                                <div className=" flex">
                                                                    <div style={{ width: '30%', textAlign: 'right' }}>
                                                                        <b>Total Db/Kr :</b>
                                                                    </div>
                                                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                                                        <b>{frmNumber(stateDataFooter?.totalDebet)}</b>
                                                                    </div>
                                                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                                                        <b>{frmNumber(stateDataFooter?.totalKredit)}</b>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-1 flex">
                                                                    <div style={{ width: '30%', textAlign: 'right' }}>
                                                                        <b>Selisih :</b>
                                                                    </div>
                                                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                                                        <b>{frmNumber(stateDataFooter?.totalSelisih)}</b>
                                                                    </div>
                                                                    {/* <div style={{ width: '35%', textAlign: 'right' }}><b>{frmNumber(stateDataFooter?.totalSelisihKredit)}</b></div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={2}>
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
                                                                                onContextMenu={() => {
                                                                                    const mergerObject = {
                                                                                        ...handleParamsObject,
                                                                                    };
                                                                                    handleClick(index, mergerObject);
                                                                                }}
                                                                                style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '239px' }}
                                                                            >
                                                                                {masterDataState === 'BARU' ? (
                                                                                    images[index] &&
                                                                                    images[index].length > 0 && (
                                                                                        <ImageWithDeleteButton
                                                                                            imageUrl={images[index][0]}
                                                                                            onDelete={() => {
                                                                                                const mergerObject = {
                                                                                                    ...handleParamsObject,
                                                                                                };
                                                                                                clearImage(index, mergerObject);
                                                                                            }}
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
                                                                                ) : masterDataState === 'EDIT' ||
                                                                                  masterDataState === 'APPROVAL' ||
                                                                                  masterDataState === 'BAYAR' ||
                                                                                  masterDataState === 'BATAL BAYAR' ||
                                                                                  masterDataState === 'FilePendukung' ||
                                                                                  masterDataState === 'EDIT APP' ||
                                                                                  masterDataState === 'EDIT RELEASE' ? (
                                                                                    images[index] ? (
                                                                                        <>
                                                                                            {images[index].length > 0
                                                                                                ? images[index] &&
                                                                                                  images[index].length > 0 && (
                                                                                                      <ImageWithDeleteButton
                                                                                                          imageUrl={images[index][0]}
                                                                                                          onDelete={() => {
                                                                                                              const mergerObject = {
                                                                                                                  ...handleParamsObject,
                                                                                                              };
                                                                                                              clearImage(index, mergerObject);
                                                                                                          }}
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
                                                                                                      const foundItem = loadFilePendukung.find(
                                                                                                          (item: any) => parseFloat(item.id_dokumen) - 1 === index
                                                                                                      );
                                                                                                      const filegambar = foundItem?.decodeBase64_string;
                                                                                                      if (filegambar) {
                                                                                                          const imageUrl = filegambar;
                                                                                                          return (
                                                                                                              imageUrl && (
                                                                                                                  <ImageWithDeleteButton
                                                                                                                      imageUrl={imageUrl}
                                                                                                                      onDelete={() => {
                                                                                                                          const mergerObject = {
                                                                                                                              ...handleParamsObject,
                                                                                                                          };
                                                                                                                          clearImage(index, mergerObject);
                                                                                                                      }}
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
                                                                                                const foundItem = loadFilePendukung.find((item: any) => parseFloat(item.id_dokumen) - 1 === index);
                                                                                                const filegambar = foundItem?.decodeBase64_string;
                                                                                                if (filegambar) {
                                                                                                    const imageUrl = filegambar;
                                                                                                    return (
                                                                                                        imageUrl && (
                                                                                                            <ImageWithDeleteButton
                                                                                                                imageUrl={imageUrl}
                                                                                                                onDelete={() => {
                                                                                                                    const mergerObject = {
                                                                                                                        ...handleParamsObject,
                                                                                                                    };
                                                                                                                    clearImage(index, mergerObject);
                                                                                                                }}
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
                                                                                onChange={(e) => {
                                                                                    const mergerObject = {
                                                                                        ...handleParamsObject,
                                                                                    };
                                                                                    handleFileUpload(e, index, mergerObject);
                                                                                }}
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
                                                                                onClick={() => {
                                                                                    const mergerObject = {
                                                                                        ...handleParamsObject,
                                                                                    };
                                                                                    handleClick(index, mergerObject);
                                                                                }}
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
                                                                                onClick={() => {
                                                                                    const mergerObject = {
                                                                                        ...handleParamsObject,
                                                                                    };
                                                                                    clearImage(index, mergerObject);
                                                                                }}
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
                                                                                onClick={() => {
                                                                                    const mergerObject = {
                                                                                        ...handleParamsObject,
                                                                                    };
                                                                                    clearAllImages(mergerObject);
                                                                                }}
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
                                                                                // onClick={() =>
                                                                                //     OpenPreviewInsert(
                                                                                //         index,
                                                                                //         setIndexPreview,
                                                                                //         setIsOpenPreview,
                                                                                //         setZoomScale,
                                                                                //         setPosition,
                                                                                //         loadFilePendukung,
                                                                                //         extractedFiles,
                                                                                //         setImageDataUrl,
                                                                                //         images
                                                                                //     )
                                                                                // }
                                                                                onClick={() => handleUploadZip('PE0000000042', tipeBersihkangambar, selectedBersihkangambar)}
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
                                        </TabComponent>
                                    </div>
                                </>
                            ) : (
                                <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '336px' }}>
                                    <TabComponent animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                        <div className="e-tab-header">
                                            <div tabIndex={0}>1. Alokasi Pembayaran</div>
                                        </div>
                                        {/*===================== Content menampilkan data barang =======================*/}
                                        <div className="e-content">
                                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                                <GridComponent
                                                    id="gridPheList"
                                                    name="gridPheList"
                                                    className="gridPheList"
                                                    locale="id"
                                                    ref={gridPheListRef}
                                                    dataSource={dataAlokasiPembayaran.nodes}
                                                    editSettings={
                                                        masterDataState === 'BAYAR' || masterDataState === 'BATAL BAYAR' || masterDataState === 'EDIT RELEASE' || masterDataState === 'FilePendukung'
                                                            ? { newRowPosition: 'Bottom' }
                                                            : { allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }
                                                    }
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    rowHeight={22}
                                                    height={220} //170 barang jadi 150 barang produksi
                                                    gridLines={'Both'}
                                                    // // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    rowSelected={selectedRowsData}
                                                    dataBound={handleDataBound}
                                                    // load={load}
                                                    actionBegin={handleActionBaginRows}
                                                    // actionComplete={handleActionComplate}
                                                    // recordClick={(args: any) => {
                                                    //     const currentDaftar = gridPheListRef.current?.getSelectedRecords() || [];
                                                    //     if (currentDaftar.length > 0) {
                                                    //         gridPheListRef.current?.startEdit();
                                                    //     }
                                                    // }}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />
                                                        <ColumnDirective
                                                            field="no_rpe"
                                                            isPrimaryKey={true}
                                                            // editTemplate={editTemplateNoSj}
                                                            headerText="No. RPE"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="120"
                                                        />
                                                        <ColumnDirective
                                                            field="tgl_rpe"
                                                            isPrimaryKey={true}
                                                            headerText="Tgl. RPE"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="85"
                                                            type="date"
                                                            format={formatDate}
                                                        />
                                                        <ColumnDirective field="no_reff" isPrimaryKey={true} headerText="No. Faktur Ekspedisi" headerTextAlign="Center" textAlign="Left" width="135" />
                                                        <ColumnDirective field="pph23" isPrimaryKey={true} headerText="PPH 23" headerTextAlign="Center" textAlign="Center" width="50" />
                                                        <ColumnDirective
                                                            editTemplate={editTemplateTotalBerat}
                                                            // edit={qtyParams}
                                                            field="total_berat"
                                                            format="N2"
                                                            headerText="Total Berat"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="100"
                                                        />
                                                        <ColumnDirective
                                                            editTemplate={editTemplateBiayaLain}
                                                            isPrimaryKey={true}
                                                            // edit={qtyParams}
                                                            field="biaya_lain"
                                                            format="N2"
                                                            headerText="Biaya Lain"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="115"
                                                        />
                                                        <ColumnDirective
                                                            editTemplate={editTemplatePotonganLain}
                                                            // edit={qtyParams}
                                                            field="potongan_lain"
                                                            format="N2"
                                                            headerText="Potongan Lain"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="115"
                                                        />
                                                        <ColumnDirective
                                                            editTemplate={editTemplateNettoMu}
                                                            field="netto_mu"
                                                            format="N2"
                                                            headerText="Netto"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="135"
                                                        />
                                                        <ColumnDirective
                                                            editTemplate={editTemplatePilih}
                                                            template={templatePilih}
                                                            headerText="Pilih"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            width="50"
                                                        />
                                                        <ColumnDirective
                                                            field="bayar_mu"
                                                            format="N2"
                                                            headerText="Jumlah Yang Akan Dibayar"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="135"
                                                            edit={editBayarMu}
                                                            isPrimaryKey={
                                                                masterDataState === 'BAYAR' ||
                                                                masterDataState === 'BATAL BAYAR' ||
                                                                masterDataState === 'EDIT RELEASE' ||
                                                                masterDataState === 'FilePendukung'
                                                                    ? true
                                                                    : false
                                                            }
                                                            // template={editTemplateBayarMu}
                                                            // editTemplate={editTemplateBayarMu}
                                                            headerTemplate={headerJumlahYangAkanDibayar}
                                                        />
                                                        <ColumnDirective
                                                            editTemplate={editTemplateSisaHutang}
                                                            // edit={qtyParams}
                                                            field="sisa_hutang"
                                                            format="N2"
                                                            headerText="Sisa"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="135"
                                                        />
                                                    </ColumnsDirective>

                                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                </GridComponent>

                                                <div className="panel-pager">
                                                    <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                        <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                            <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                                <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                                    <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                        <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                            <div className="mt-1 flex">
                                                                                <ButtonComponent
                                                                                    id="buDelete1"
                                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                    cssClass="e-warning e-small"
                                                                                    iconCss="e-icons e-small e-trash"
                                                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                    onClick={() => {
                                                                                        const mergerObject = {
                                                                                            ...handleParamsObject,
                                                                                        };
                                                                                        handleDelete('delete', mergerObject);
                                                                                    }}
                                                                                />
                                                                                <ButtonComponent
                                                                                    id="buDeleteAll1"
                                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                    cssClass="e-danger e-small"
                                                                                    iconCss="e-icons e-small e-erase"
                                                                                    style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                    onClick={() => {
                                                                                        const mergerObject = {
                                                                                            ...handleParamsObject,
                                                                                        };
                                                                                        handleDelete('deleteAll', mergerObject);
                                                                                    }}
                                                                                />
                                                                                <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                    <b>Jumlah RPE :</b>&nbsp;&nbsp;&nbsp;{stateDataHeader?.totalBarang}
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
                                        </div>
                                    </TabComponent>
                                </div>
                            )}

                            {/* ===============  Master Footer Data ========================   */}
                            <div className="flex">
                                <div className="w-[70%]">
                                    <div className="mt-1">
                                        <p className="set-font-11">
                                            <b>Keterangan :</b>
                                        </p>
                                        <div className="panel-input" style={{ width: '80%' }}>
                                            <TextBoxComponent
                                                // ref={(t) => {
                                                //     textareaObj = t;
                                                // }}
                                                multiline={true}
                                                // created={onCreateMultiline}
                                                value={stateDataFooter.keterangan}
                                                blur={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    setStateDataFooter((prevState: any) => ({
                                                        ...prevState,
                                                        keterangan: value,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[30%]">
                                    <div className="flex" style={{ marginTop: '10px' }}>
                                        <div style={{ width: '70%' }}>
                                            <label style={{ textAlign: 'right' }}>Total Hutang</label>
                                        </div>
                                        <div style={{ width: '30%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{currencyFormat(stateDataFooter?.totalHutang)}</b>}</div>
                                    </div>
                                    <div className="flex" style={{ marginTop: '-5px' }}>
                                        <div style={{ width: '70%' }}>
                                            <label style={{ textAlign: 'right' }}>Total Pembayaran</label>
                                        </div>
                                        <div style={{ width: '30%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{currencyFormat(stateDataFooter?.totalPembayaran)}</b>}</div>
                                    </div>
                                    <div className="flex" style={{ marginTop: '-5px' }}>
                                        <div style={{ width: '70%' }}>
                                            <label style={{ textAlign: 'right' }}>Sisa Hutang</label>
                                        </div>
                                        <div style={{ width: '30%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{currencyFormat(stateDataFooter?.sisaHutang)}</b>}</div>
                                    </div>
                                    <div className="flex" style={{ marginTop: '-5px' }}>
                                        <div style={{ width: '70%' }}>
                                            <label style={{ textAlign: 'right' }}>selisih Alokasi Dana</label>
                                        </div>
                                        {parseFloat(stateDataFooter.selisihAlokasiDana) < 0 ? (
                                            <div style={{ width: '30%', textAlign: 'right', fontWeight: 'bold' }}>
                                                {<b>{'(' + currencyFormat(parseFloat(stateDataFooter?.selisihAlokasiDana) * -1) + ')'}</b>}
                                            </div>
                                        ) : (
                                            <div style={{ width: '30%', textAlign: 'right', fontWeight: 'bold' }}>{<b>{currencyFormat(stateDataFooter?.selisihAlokasiDana)}</b>}</div>
                                        )}
                                    </div>
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
                        {(masterDataState === 'BARU' ||
                            masterDataState === 'EDIT' ||
                            masterDataState === 'APPROVAL' ||
                            masterDataState === 'BATAL APP' ||
                            masterDataState === 'BAYAR' ||
                            masterDataState === 'BATAL BAYAR' ||
                            masterDataState === 'FilePendukung' ||
                            masterDataState === 'EDIT APP' ||
                            masterDataState === 'EDIT RELEASE') && (
                            <ButtonComponent
                                id="buBatalDokumen1"
                                content="Batal"
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-small e-close"
                                style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                                onClick={closeDialog}
                            />
                        )}
                        {(masterDataState === 'BARU' ||
                            masterDataState === 'EDIT' ||
                            masterDataState === 'BATAL APP' ||
                            masterDataState === 'BAYAR' ||
                            masterDataState === 'BATAL BAYAR' ||
                            masterDataState === 'FilePendukung' ||
                            masterDataState === 'EDIT APP') && (
                            <ButtonComponent
                                id="buSimpanDokumen1"
                                content="Simpan"
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-small e-save"
                                style={
                                    disableTombolSimpan === true
                                        ? { float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c', color: 'gray' }
                                        : { float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }
                                }
                                onClick={() => {
                                    if (masterDataState === 'FilePendukung') {
                                        UpdateFilePendukung();
                                    } else {
                                        prosesBloking('simpan');
                                    }
                                }}
                                // onClick={() => saveDoc()}
                                disabled={disableTombolSimpan}
                            />
                        )}
                        {masterDataState === 'APPROVAL' && (
                            <>
                                <ButtonComponent
                                    id="buDitolak"
                                    content="Ditolak"
                                    cssClass="e-primary e-small"
                                    // iconCss="e-icons e-small"
                                    style={
                                        disableTombolSimpan === true
                                            ? { float: 'right', height: '28px', width: '90px', marginTop: 1 + 'em', marginRight: 5.3 + 'em', backgroundColor: '#3b3f5c', color: 'gray' }
                                            : { float: 'right', height: '28px', width: '90px', marginTop: 1 + 'em', marginRight: 5.3 + 'em', backgroundColor: '#3b3f5c' }
                                    }
                                    onClick={() => prosesBloking('ditolak')}
                                    // onClick={() => saveDoc()}
                                    disabled={disableTombolSimpan}
                                />

                                <ButtonComponent
                                    id="buKoreksi"
                                    content="Koreksi"
                                    cssClass="e-primary e-small"
                                    // iconCss="e-icons e-small"
                                    style={
                                        disableTombolSimpan === true
                                            ? { float: 'right', height: '28px', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c', color: 'gray' }
                                            : { float: 'right', height: '28px', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c' }
                                    }
                                    onClick={() => prosesBloking('koreksi')}
                                    // onClick={() => saveDoc()}
                                    disabled={disableTombolSimpan}
                                />

                                <ButtonComponent
                                    id="buDisetujui"
                                    content="Disetujui"
                                    cssClass="e-primary e-small"
                                    // iconCss="e-icons e-small"
                                    style={
                                        disableTombolSimpan === true
                                            ? { float: 'right', height: '28px', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c', color: 'gray' }
                                            : { float: 'right', height: '28px', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c' }
                                    }
                                    onClick={() => prosesBloking('disetujui')}
                                    // onClick={() => saveDoc()}
                                    disabled={disableTombolSimpan}
                                />
                            </>
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
                                    <span className="e-icons e-zoom-in" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => handleZoomIn(setZoomScale)}></span>
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
                                    <span className="e-icons e-zoom-out" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => handleZoomOut(setZoomScale)}></span>
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
                                    <span className="e-icons e-close" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={() => handleCloseZoom(setIsOpenPreview, setImageDataUrl)}></span>
                                </ButtonComponent>
                            </div>
                        </div>
                    )}
                </div>
                <GlobalProgressBar />
            </DialogComponent>

            {/*==================================================================================================*/}
        </div>
    );
};

export default DialogPhe;
