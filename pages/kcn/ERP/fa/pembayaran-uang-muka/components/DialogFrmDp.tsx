import React, { useEffect, useState } from 'react';

// Syncfusion
import { GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection, Grid } from '@syncfusion/ej2-react-grids';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { ButtonComponent, ChangeEventArgs } from '@syncfusion/ej2-react-buttons';
import { TabComponent } from '@syncfusion/ej2-react-navigations';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';

// Others
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { reCalc, SpreadNumber, swalToast, validate } from '../utils';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSupplier } from '../../../../../../lib/fa/pembayaran-uang-muka/hooks/useSupplier';
import DialogListSupplier from './DialogListSupplier';
import { frmNumber, generateNU, swalDialog } from '@/utils/routines';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';
import axios from 'axios';
import Image from 'next/image';
import useUploadFiles2 from '../../../../../../lib/fa/pembayaran-uang-muka/hooks/useUploadFiles2';

interface DialogFrmFppProps {
    isOpen: boolean;
    onClose: () => void;
    token: string;
    kode_entitas: string;
    statusPage: string;
    userid: string;
    kode_dokumen: string;
    onRefresh: Function;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

let gridDpList: Grid | any;

const DialogFrmDp: React.FC<DialogFrmFppProps> = ({ isOpen, onClose, token, kode_entitas, kode_dokumen, statusPage, userid, onRefresh }) => {
    // MASTER DATA
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [masterData, setMasterData] = useState({
        no_um: '',
        tgl_dok: moment(),
        no_kontrak: '',
        keterangan: '',
        tgl_bayar: statusPage === 'PEMBAYARAN' ? moment() : undefined,
        no_reff: '',
        lunas_rp: 0,
        sisa_rp: 0,
        netto_rp: 0,
        total_rp: 0,
        belum_dibayar_rp: 0,

        // supplier (probably)
        no_supp: '',
        kode_supp: '',
        nama_supplier: '',
        no_ju_approve: '',

        // exclude
        bayar_rp: 0,
        terbilang: '',
    });
    const [isAmountFocused, setIsAmountFocused] = useState(false);

    const updateMasterState = (field: any, value: any) => {
        setMasterData((prevState: any) => ({
            ...prevState,
            [field]: value,
        }));
    };

    // GLOBAL STATE MANAGEMENT
    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // GLOBAL FUNCTIONS
    const rowSelectingDetailJurnalDetail = (args: any) => {
        setSelectedRowIndex(args.rowIndex);
    };

    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    const handleCreate = async () => {
        const result = await generateNU(kode_entitas, '', '30', moment().format('YYYYMM'));
        if (result) {
            updateMasterState('no_um', result);
        } else {
            console.error('undefined');
        }
    };

    // Handle Edit
    const handleEdit = async () => {
        const response = await axios.get(`${apiUrl}/erp/master_detail_pembayaran_uang_muka`, {
            params: {
                entitas: kode_entitas,
                param1: kode_dokumen,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { master } = response.data.data;

        updateMasterState('no_um', master.no_um);
        updateMasterState('tgl_dok', moment(master.tgl_dok, 'YYYY-MM-DD HH:mm:ss'));
        updateMasterState('no_kontrak', master.no_kontrak);
        updateMasterState('keterangan', master.keterangan);
        if (master.tgl_bayar !== null) {
            updateMasterState('tgl_bayar', moment(master.tgl_bayar, 'YYYY-MM-DD HH:mm:ss'));
        }
        updateMasterState('no_reff', master.no_reff);
        updateMasterState('lunas_rp', master.lunas_rp);
        updateMasterState('sisa_rp', master.sisa_rp);
        updateMasterState('netto_rp', master.netto_rp);
        updateMasterState('total_rp', master.total_rp);
        updateMasterState('belum_dibayar_rp', master.belum_dibayar_rp);

        updateMasterState('no_supp', master.no_supp);
        updateMasterState('kode_supp', master.kode_supp);
        updateMasterState('nama_supplier', master.nama_supplier);

        updateMasterState('no_ju_approve', master.no_ju_approve);

        const { detail } = response.data.data;

        if (detail.length > 0) {
            const mappedBarang = detail.map((item: any) => ({
                ...item,
                harga_mu: SpreadNumber(item.harga_mu),
                jumlah_rp: SpreadNumber(item.jumlah_rp),
                tambahan_um: SpreadNumber(item.tambahan_um),
                total_um: SpreadNumber(item.total_um),
            }));
            gridDpList!.dataSource = mappedBarang;
        }
    };

    const actionCompleteDetailJurnal = async (args: any) => {
        switch (args.requestType) {
            case 'save':
                if (tambah === false) {
                    const editedData = args.data;
                    gridDpList.dataSource[args.rowIndex] = editedData;
                    reCalc(gridDpList, masterData, updateMasterState);
                    gridDpList.refresh();
                } else if (edit) {
                    reCalc(gridDpList, masterData, updateMasterState);
                    gridDpList.refresh();
                }
                break;
            case 'beginEdit':
                setTambah(false);
                setEdit(true);
                reCalc(gridDpList, masterData, updateMasterState);
                break;
            case 'delete':
                if (Array.isArray(gridDpList.dataSource)) {
                    gridDpList.dataSource.forEach((item: any, index: any) => {
                        item.id = index + 1;
                    });
                }
                gridDpList.refresh();
                break;
            case 'refresh':
                reCalc(gridDpList, masterData, updateMasterState);
                setTambah(false);
                setEdit(false);
                break;
            default:
                break;
        }
    };

    const handleDataJurnal = async (jenis: any) => {
        const totalLine = gridDpList.dataSource.length;
        const isNoBarangNotEmpty = gridDpList.dataSource.every((item: any) => item.jumlah_rp > 0);

        if ((totalLine === 0 && jenis === 'new') || (isNoBarangNotEmpty && jenis === 'new')) {
            // if (totalLine === 0 && jenis === 'new') {
            const detailBarangBaru = {
                id_um: totalLine! + 1,
                diskripsi: null,
                satuan: null,
                qty: 0,
                qty_std: 0,
                sat_std: null,
                qty_batal: 0,
                harga_mu: 0,
                jumlah_rp: 0,
                tambahan_um: 0,
                total_um: 0,
                catatan: null,
            };

            gridDpList.addRecord(detailBarangBaru, totalLine);
            setTambah(true);
            gridDpList.refresh();
        } else {
            document.getElementById('gridDpList')?.focus();
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Jumlah MU tidak boleh kurang dari nol</p>',
                width: '100%',
                target: '#gridDpList',
            });
        }
    };

    // DELETE DATA DI ALOKASI DANA
    const DetailAlokasiDanaDelete = async () => {
        // const confirm = await withReactContent(swalDialog).fire({
        //   html: `Hapus data di baris ${selectedRowIndex + 1}?`,
        //   width: '360px',
        //   heightAuto: true,
        //   target: '#dialogFrmDp',
        //   focusConfirm: false,
        //   showCancelButton: true,
        //   confirmButtonText: '<p style="font-size:10px">Ya</p>',
        //   cancelButtonText: '<p style="font-size:10px">Tidak</p>',
        //   reverseButtons: false,
        //   allowOutsideClick: false,
        //   allowEscapeKey: false,
        // });

        // if (confirm.isConfirmed) {
        //   gridDpList.dataSource.splice(selectedRowIndex, 1);
        //   gridDpList.dataSource.forEach((item: any, index: any) => {
        //     item.id = index + 1;
        //   });
        //   gridDpList.refresh();
        // }

        swal.fire({
            html: `Hapus data di baris ${selectedRowIndex + 1}?`,
            width: '15%',
            target: '#dialogFrmDp',
            showCancelButton: true,
            confirmButtonText: '<p style="font-size:10px">Ya</p>',
            cancelButtonText: '<p style="font-size:10px">Tidak</p>',
        }).then((result) => {
            if (result.isConfirmed) {
                gridDpList.dataSource.splice(selectedRowIndex, 1);
                gridDpList.dataSource.forEach((item: any, index: any) => {
                    item.id = index + 1;
                });
                gridDpList.refresh();
            }
        });
    };

    const DetailAlokasiDanaAll = async () => {
        // const confirm = await withReactContent(swalDialog).fire({
        //   html: `Hapus semua data barang?`,
        //   width: '360px',
        //   heightAuto: true,
        //   target: '#dialogFrmDp',
        //   focusConfirm: false,
        //   showCancelButton: true,
        //   confirmButtonText: '<p style="font-size:10px">Ya</p>',
        //   cancelButtonText: '<p style="font-size:10px">Tidak</p>',
        //   reverseButtons: false,
        //   allowOutsideClick: false,
        //   allowEscapeKey: false,
        // });

        // if (confirm.isConfirmed) {
        //   gridDpList.dataSource.splice(0, gridDpList.dataSource.length);
        //   gridDpList.refresh();
        // }

        swal.fire({
            html: 'Hapus semua data barang?',
            width: '15%',
            target: '#dialogFrmDp',
            showCancelButton: true,
            confirmButtonText: '<p style="font-size:10px">Ya</p>',
            cancelButtonText: '<p style="font-size:10px">Tidak</p>',
        }).then((result) => {
            if (result.isConfirmed) {
                gridDpList.dataSource.splice(0, gridDpList.dataSource.length);
                gridDpList.refresh();
            }
        });
    };

    // UPLOAD FILES
    const {
        dataFiles,
        handleDownloadImage,
        handleFileSelect,
        handleRemove,
        handleUpload,
        imageSrc,
        selectedHead,
        setDataFiles,
        setJsonImageEdit,
        setSelectedHead,
        updateStateFiles,
        uploaderRefPembayaran1,
        uploaderRefPembayaran2,
        uploaderRefPembayaran3,
        uploaderRefPembayaran4,
        uploaderRefPembayaran5,
        uploaderRefPengajuan1,
        uploaderRefPengajuan2,
        uploaderRefPengajuan3,
        uploaderRefPengajuan4,
        uploaderRefPengajuan5,
    } = useUploadFiles2({
        apiUrl,
        kode_entitas,
        statusPage,
        kode_dokumen,
    });

    // LOAD IMAGE PENGAJUAN
    useEffect(() => {
        const getStateIndex = (id: number) => {
            if (id >= 1 && id <= 5) return id - 1;
            if (id >= 20 && id <= 24) return id - 15;
            return null;
        };

        const loadImages = async () => {
            if (statusPage === 'EDIT' || statusPage === 'APPROVAL' || statusPage === 'UPDATE-FILE' || statusPage === 'PEMBAYARAN') {
                try {
                    // Load images data
                    const loadtbImages = await axios.get(`${apiUrl}/erp/load_images`, {
                        params: {
                            entitas: kode_entitas,
                            param1: kode_dokumen,
                        },
                    });

                    const result = loadtbImages.data.data;
                    setJsonImageEdit(result);

                    // Process each image from the result
                    const imageLoadPromises = result.map(async (item: any) => {
                        const response = await axios.get(`${apiUrl}/erp/load_fileGambar_byId`, {
                            params: {
                                entitas: kode_entitas,
                                param1: kode_dokumen,
                                param2: item.id_dokumen,
                            },
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        return {
                            ...item,
                            imageData: response.data,
                        };
                    });

                    // Wait for all image loads to complete
                    const loadedImages = await Promise.all(imageLoadPromises);

                    // Set states based on id_dokumen ranges
                    loadedImages.forEach((image) => {
                        console.log(image);

                        const { id_dokumen, filegambar, imageData } = image;

                        // Helper function to determine state index

                        const stateIndex = getStateIndex(Number(id_dokumen));

                        if (stateIndex !== null) {
                            // Update preview state
                            const previewStateName = `preview${stateIndex + 1}`;
                            updateStateFiles(previewStateName, imageData.data[0].decodeBase64_string);

                            // Update name state
                            const nameStateName = `nameImage${stateIndex + 1}`;
                            updateStateFiles(nameStateName, filegambar);
                        }
                    });

                    // Handle ZIP file if exists
                    const zipData = result.find((item: any) => item.id_dokumen === '999');
                    if (zipData) {
                        const loadImage = await axios.get(`${apiUrl}/erp/extrak_zip`, {
                            params: {
                                entitas: kode_entitas,
                                nama_zip: zipData.filegambar,
                            },
                        });

                        const images = loadImage.data.images;

                        images.forEach((fileUri: any) => {
                            const matchingImage = result.find((item: any) => item.filegambar === fileUri.fileName);
                            if (matchingImage) {
                                const stateIndex = getStateIndex(Number(matchingImage.id_dokumen));
                                if (stateIndex !== null) {
                                    updateStateFiles(`preview${stateIndex + 1}`, fileUri.imageUrl);
                                    updateStateFiles(`nameImage${stateIndex + 1}`, fileUri.fileName);
                                }
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error loading images:', error);
                }
            }
        };

        loadImages();
    }, [kode_entitas, kode_dokumen, statusPage]);

    // IMAGE DOWNLOAD & PREVIEW
    const [modalPreview, setModalPreview] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const handlePreviewImage = (jenis: string) => {
        // console.log('imageSrc: ', imageSrc);

        if (jenis === 'open') {
            setModalPreview(true);
        } else if (jenis === 'close') {
            setModalPreview(false);
        }
    };

    const handleWheel = (event: any) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            setZoomLevel((prevScale) => Math.min(prevScale + 0.1, 6));
        } else {
            setZoomLevel((prevScale) => Math.max(prevScale - 0.1, 0.5));
        }
    };

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setStartPosition({ x: event.clientX - translate.x, y: event.clientY - translate.y });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            setTranslate({
                x: event.clientX - startPosition.x,
                y: event.clientY - startPosition.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Save Doc
    const saveDoc = async (flag: string) => {
        if (isLoading) return;

        gridDpList.endEdit();
        const modifiedDetailJurnal = gridDpList.dataSource.map((item: any) => ({
            ...item,
            kode_um: statusPage === 'CREATE' ? '' : kode_dokumen,
        }));

        // Validasi
        const validationResult = validate(gridDpList, masterData, statusPage);

        if (!validationResult.isValid) {
            swal.fire({
                icon: 'warning',
                text: validationResult.message,
                target: '#dialogFrmDp',
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        // validasi file pembayaran
        if ((dataFiles.preview6 === null || dataFiles.preview6 === '') && statusPage === 'PEMBAYARAN') {
            swal.fire({
                icon: 'warning',
                text: 'File pendukung pembayaran belum di upload',
                showConfirmButton: false,
                timer: 1500,
                target: '#dialogFrmDp',
            });
            return;
        }

        const noUm = await generateNU(kode_entitas, '', '30', moment().format('YYYYMM'));
        const noJu = await generateNU(kode_entitas, '', '20', moment().format('YYYYMM'));
        // detail 1
        const kode_akun = await axios.get(`${apiUrl}/erp/preparing_jurnal_uang_muka`, {
            params: {
                entitas: kode_entitas,
                param1: 0,
                param2: 'all',
                param3: 'all',
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        // API preparing_jurnal_uang_muka param1 == 1, param2 = pake no_supp, param3 = pake kode_akun dari hasil api yang param1 == 0
        const kode_subledger = await axios.get(`${apiUrl}/erp/preparing_jurnal_uang_muka`, {
            params: {
                entitas: kode_entitas,
                param1: 1,
                param2: masterData.no_supp,
                param3: kode_akun.data.data[0].kode_akun,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        // detail 2
        const kode_akun2 = await axios.get(`${apiUrl}/erp/preparing_jurnal_uang_muka`, {
            params: {
                entitas: kode_entitas,
                param1: 6,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        const reqBody = {
            entitas: kode_entitas,
            kode_um: statusPage === 'CREATE' ? '' : kode_dokumen,
            no_um: statusPage === 'CREATE' ? noUm : masterData.no_um,
            kode_supp: masterData.kode_supp,
            no_supp: masterData.no_supp,
            nama_supplier: masterData.nama_supplier,
            no_kontrak: masterData.no_kontrak,
            tgl_dok: masterData.tgl_dok.format('YYYY-MM-DD HH:mm:ss'),
            total_rp: masterData.total_rp,
            netto_rp: masterData.netto_rp,
            sisa_rp: masterData.bayar_rp > 0 && statusPage === 'PEMBAYARAN' ? masterData.sisa_rp : 0,
            lunas_rp: masterData.lunas_rp,
            sudah_dibayar_rp: 0,
            belum_dibayar_rp: masterData.belum_dibayar_rp,
            sudah_diambil_rp: 0,
            approval: 'B',
            tgl_approval: null,
            user_approval: null,
            status_dok: 'Baru',
            tgl_bayar: masterData.tgl_bayar ? moment(masterData.tgl_bayar).format('YYYY-MM-DD HH:mm:ss') : null,
            keterangan: masterData.keterangan,
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            po_pabrik: null,
            no_reff: masterData.no_reff,
            no_ju_approve: statusPage === 'CREATE' ? null : masterData.no_ju_approve,
            no_ju_bayar: null,
            no_ju_phu: null,
            detail: modifiedDetailJurnal,
        };

        const catatan =
            statusPage === 'APPROVAL'
                ? `[Auto Jurnal] - PENGAKUAN UANG MUKA SUPPLIER ${reqBody.nama_supplier} NO. KONTRAK ${reqBody.no_kontrak}`
                : `[Auto Jurnal] - PEMBAYARAN UANG MUKA SUPPLIER ${reqBody.nama_supplier} NO. KONTRAK ${reqBody.no_kontrak}`;

        const payloadKeuangan = {
            dokumen: 'JU',
            no_dokumen: noJu,
            tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
            no_warkat: null,
            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
            kode_cust: null,
            kode_akun_debet: null,
            kode_supp: reqBody.kode_supp,
            kode_akun_kredit: null,
            kode_akun_diskon: null,
            kurs: 1,
            debet_rp: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
            kredit_rp: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
            jumlah_rp: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
            jumlah_mu: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
            pajak: null,
            kosong: null,
            kepada: null,
            catatan: catatan,
            status: 'Terbuka',
            userid: reqBody.userid,
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            status_approved: null,
            tgl_approved: null,
            tgl_pengakuan: null,
            no_TTP: null,
            tgl_TTP: null,
            kode_sales: null,
            kode_fk: null,
            approval: null,
            tgl_setorgiro: null,
            faktur: null,
            barcode: null,
            komplit: null,
            validasi1: null,
            validasi2: null,
            validasi3: null,
            validasi_ho2: null,
            validasi_ho3: null,
            validasi_catatan: null,
            tolak_catatan: null,
            kode_kry: null,
            tgl_trxdokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
            api_id: null,
            api_pending: null,
            api_catatan: null,
            api_norek: null,
            kode_aktiva: null,
            kode_um: reqBody.kode_um,
            no_kontrak_um: reqBody.no_kontrak,
        };

        const payloadJurnal = [
            {
                id_dokumen: 1,
                dokumen: 'JU',
                tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                kode_akun: kode_akun.data.data[0].kode_akun,
                kode_subledger: kode_subledger?.data?.data?.[0]?.kode_subledger ?? null,
                kurs: 1,
                debet_rp: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
                kredit_rp: 0,
                jumlah_rp: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
                jumlah_mu: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
                catatan: payloadKeuangan.catatan,
                no_warkat: null,
                tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                persen: 0,
                kode_dept: null,
                kode_kerja: null,
                approval: 'N',
                posting: 'N',
                rekonsiliasi: 'N',
                tgl_rekonsil: null,
                userid: userid.toUpperCase(),
                tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                audit: null,
                kode_kry: null,
                kode_jual: null,
                no_kontrak_um: null,
            },
            {
                id_dokumen: 2,
                dokumen: 'JU',
                tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                kode_akun: kode_akun2.data.data[0].kode_akun,
                kode_subledger: kode_subledger?.data?.data?.[0]?.kode_subledger ?? null,
                kurs: 1,
                debet_rp: 0,
                kredit_rp: statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp,
                jumlah_rp: Number(statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp) * -1,
                jumlah_mu: Number(statusPage === 'APPROVAL' ? reqBody.total_rp : masterData.bayar_rp) * -1,
                catatan: payloadKeuangan.catatan,
                no_warkat: null,
                tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                persen: 0,
                kode_dept: null,
                kode_kerja: null,
                approval: 'N',
                posting: 'N',
                rekonsiliasi: 'N',
                tgl_rekonsil: null,
                userid: userid.toUpperCase(),
                tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                audit: null,
                kode_kry: null,
                kode_jual: null,
                no_kontrak_um: null,
            },
        ];

        // console.log('reqBody: ', reqBody);
        // console.log('gridDpList.dataSource: ', gridDpList.dataSource);

        try {
            setIsLoading(true);
            startProgress();
            let responseApi;

            const itemLen = gridDpList.dataSource.length;

            // SIMPAN / UPDATE DATA BODY
            if (statusPage === 'CREATE') {
                responseApi = await axios.post(`${apiUrl}/erp/simpan_pembayaran_uang_muka`, reqBody, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000, // Timeout 5 detik
                });
            } else if (statusPage === 'EDIT') {
                responseApi = await axios.patch(`${apiUrl}/erp/update_pembayaran_uang_muka`, reqBody, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (statusPage === 'APPROVAL') {
                if (flag === 'approval') {
                    const modifiedBody = {
                        ...reqBody,
                        proses: 'app',
                        approval: 'Y',
                        status_dok: 'Proses',
                        user_approval: userid.toUpperCase(),
                        tgl_approval: moment().format('YYYY-MM-DD HH:mm:ss'),
                        no_ju_approve: noJu,
                        keuangan: payloadKeuangan,
                        jurnal: payloadJurnal,
                    };

                    if (kode_akun.data.data.length > 1) {
                        endProgress();
                        swal.fire({
                            icon: 'error',
                            text: 'Daftar akun lebih dari satu. Jurnal tidak dapat di lanjutkan',
                            showConfirmButton: false,
                            timer: 1500,
                            target: '#dialogFrmDp',
                        });

                        return;
                    }

                    if (kode_subledger.data.data.length !== 1) {
                        endProgress();
                        swal.fire({
                            icon: 'error',
                            text: 'Subledger tidak ada atau lebih dari satu akun. Jurnal tidak dapat di lanjutkan.',
                            showConfirmButton: false,
                            timer: 1500,
                            target: '#dialogFrmDp',
                        });

                        return;
                    }

                    responseApi = await axios.post(`${apiUrl}/erp/approval_pembayaran_uang_muka`, modifiedBody, {
                        params: { entitas: kode_entitas, param1: 0 },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } else if (flag === 'reject') {
                    const modifiedBody = {
                        ...reqBody,
                        proses: 'app',
                        approval: 'N',
                        status_dok: 'Tolak',
                        user_approval: userid.toUpperCase(),
                        tgl_approval: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };

                    responseApi = await axios.patch(`${apiUrl}/erp/update_pembayaran_uang_muka`, modifiedBody, {
                        params: { entitas: kode_entitas, param1: 0 },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } else if (flag === 'correction') {
                    const modifiedBody = {
                        ...reqBody,
                        proses: 'app',
                        approval: 'K',
                        status_dok: 'Koreksi',
                        user_approval: userid.toUpperCase(),
                        tgl_approval: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };

                    responseApi = await axios.patch(`${apiUrl}/erp/update_pembayaran_uang_muka`, modifiedBody, {
                        params: { entitas: kode_entitas, param1: 0 },
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            } else if (statusPage === 'PEMBAYARAN') {
                // Filter jurnal untuk puide = 100
                const filteredJurnal = kode_entitas == '100' ? [payloadJurnal[0]] : payloadJurnal;
                const lunasRp = SpreadNumber(masterData.lunas_rp) + Number(masterData.bayar_rp);
                const sudahDibayarRp = lunasRp;

                const modifiedBody = {
                    ...reqBody,
                    proses: 'bayar',
                    status_dok: lunasRp > 0 && lunasRp >= masterData.netto_rp ? 'Lunas' : 'Belum Lunas',
                    approval: 'Y',
                    sudah_dibayar_rp: sudahDibayarRp,
                    lunas_rp: lunasRp,
                    no_ju_bayar: noJu,
                    keuangan: payloadKeuangan,
                    jurnal: filteredJurnal,
                };

                responseApi = await axios.post(`${apiUrl}/erp/approval_pembayaran_uang_muka`, modifiedBody, {
                    params: { entitas: kode_entitas, param1: 0 },
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            // CEK STATUS RESPONSEAPI
            if (responseApi && responseApi.data.status) {
                if (statusPage === 'CREATE') {
                    await generateNU(kode_entitas, noUm, '30', moment().format('YYYYMM'));
                    handleUpload(responseApi.data.data.kode_um);

                    // Save Audit
                    // const auditBody = {
                    //   entitas: kode_entitas,
                    //   kode_audit: null,
                    //   dokumen: 'UM',
                    //   kode_dokumen: responseApi.data.kode_um,
                    //   tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    //   proses: 'NEW',
                    //   diskripsi: ``,
                    //   userid: userid.toUpperCase(),
                    //   system_user: '',
                    //   system_ip: '',
                    //   system_mac: '',
                    // };

                    // await axios.post(`${apiUrl}/erp/simpan_audit`, auditBody);
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Input Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogFrmDp',
                    });
                    endProgress();
                } else if (statusPage === 'EDIT') {
                    handleUpload(kode_dokumen);
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Edit Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogFrmDp',
                    });
                    endProgress();
                } else if (statusPage === 'APPROVAL') {
                    if (flag === 'approval') {
                        await generateNU(kode_entitas, noJu, '20', moment().format('YYYYMM'));
                    }
                    handleUpload(kode_dokumen);
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Approve Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogFrmDp',
                    });
                    endProgress();
                } else if (statusPage === 'PEMBAYARAN') {
                    await generateNU(kode_entitas, noJu, '20', moment().format('YYYYMM'));
                    handleUpload(kode_dokumen);
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Pembayaran Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogFrmDp',
                    });
                    endProgress();
                }
            }

            setTimeout(() => {
                gridDpList.dataSource.splice(0, itemLen);
                swal.fire({
                    timer: 10,
                    showConfirmButton: false,
                });
                onClose();
                onRefresh();
            }, 1000);
        } catch (error: any) {
            setIsLoading(false);
            if (error.code === 'ECONNABORTED') {
                console.error('Request timeout');
                swal.fire({
                    icon: 'error',
                    title: 'Request timeout',
                    timer: 2000,
                    showConfirmButton: false,
                    target: '#dialogFrmDp',
                });
            } else if (error.response.data.error === 'Server sedang sibuk, mohon coba lagi beberapa saat.') {
                swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                    text: 'Server sedang sibuk, mohon coba lagi beberapa saat.',
                    timer: 3500,
                    showConfirmButton: false,
                    target: '#dialogFrmDp',
                });
            } else {
                console.error('Error during API call:', error);
                swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                    timer: 3500,
                    showConfirmButton: false,
                    target: '#dialogFrmDp',
                });
            }
            endProgress();
        } finally {
            setIsLoading(false);
            endProgress();
        }
    };

    // FETCH DATA
    const {
        modalDaftarSupplier,
        setModalDaftarSupplier,
        listDaftarSupplier,
        filteredDataSupplier,
        setFilteredDataSupplier,
        searchNoSupp,
        setSearchNoSupp,
        searchNamaRelasi,
        setSearchNamaRelasi,
        selectedSupplier,
        setSelectedSupplier,
        PencarianSupplier,
        handlePilihVendor,
    } = useSupplier(apiUrl, token, kode_entitas, updateMasterState);

    const fetchData = () => {
        try {
            if (statusPage === 'CREATE') {
                handleCreate();
            } else {
                handleEdit();
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data:', error);
        }
    };

    // Buttons
    const buttonsFrmUm: ButtonPropsModel[] = [
        ...(statusPage === 'APPROVAL'
            ? [
                  {
                      buttonModel: {
                          content: 'Ditolak',
                          iconCss: 'e-icons e-small e-export-xls',
                          cssClass: 'e-primary e-small',
                          disabled: isLoading,
                      },
                      isFlat: false,
                      click: () => {
                          if (!isLoading) {
                              saveDoc('reject');
                          }
                      },
                  },
                  {
                      buttonModel: {
                          content: 'Koreksi',
                          iconCss: 'e-icons e-small e-annotation-edit',
                          cssClass: 'e-primary e-small',
                          disabled: isLoading,
                      },
                      isFlat: false,
                      click: () => {
                          if (!isLoading) {
                              saveDoc('correction');
                          }
                      },
                  },
              ]
            : []),
        {
            buttonModel: {
                content: statusPage === 'CREATE' || statusPage === 'EDIT' ? 'Simpan' : statusPage === 'APPROVAL' ? 'Disetujui' : 'Bayar',
                iconCss: statusPage === 'CREATE' || statusPage === 'EDIT' ? 'e-icons e-small e-save' : 'e-icons e-small e-check-box',
                cssClass: 'e-primary e-small',
                disabled: isLoading,
            },
            isFlat: false,
            click: () => {
                if (!isLoading) {
                    saveDoc('approval');
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                iconCss: 'e-icons e-small e-close',
                cssClass: 'e-primary e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                onClose();
                gridDpList.dataSource.splice(0, gridDpList.dataSource.length);
                gridDpList.refresh();
            },
        },
    ];

    useEffect(() => {
        const dialogElement = document.getElementById('dialogFrmDp');
        if (dialogElement) {
            dialogElement.style.maxHeight = 'none';
            dialogElement.style.maxWidth = 'none';
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [statusPage, kode_entitas, token]);
    return (
        <DialogComponent
            id="dialogFrmDp"
            isModal
            width="85%"
            height="90%"
            visible={isOpen}
            close={() => {
                onClose();
                gridDpList.dataSource.splice(0, gridDpList.dataSource.length);
                gridDpList.refresh();
            }}
            header={statusPage === 'CREATE' ? 'FORM UANG MUKA < BARU >' : statusPage === 'EDIT' || statusPage === 'UPDATE-FILE' ? 'FORM UANG MUKA < EDIT >' : 'FORM UANG MUKA'}
            showCloseIcon
            target={'#main-target'}
            closeOnEscape
            allowDragging
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            buttons={buttonsFrmUm}
        >
            <div className="mb-1">
                {/* =========== MASTER HEADER =========== */}
                <div className="flex gap-7 px-7 py-3">
                    {/* ====== LEFT SIDE ======= */}
                    <div>
                        {/* Tgl Buat */}
                        <div className="flex items-center gap-2">
                            <label className="w-20 text-right">Tgl. Buat</label>
                            <div className="form-input mt-1 flex justify-between" style={{ width: '50%', borderRadius: 2 }}>
                                <DatePickerComponent
                                    locale="id"
                                    cssClass="e-custom-style"
                                    // renderDayCell={onRenderDayCell}
                                    enableMask={true}
                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                    showClearButton={false}
                                    format="dd-MM-yyyy"
                                    value={masterData.tgl_dok.toDate()}
                                    change={(args: ChangeEventArgsCalendar) => {
                                        updateMasterState('tgl_dok', moment(args.value));
                                    }}
                                    style={{ margin: '-5px' }}
                                >
                                    <Inject services={[MaskedDateTime]} />
                                </DatePickerComponent>
                            </div>
                        </div>
                        {/* No UM */}
                        <div className="mt-1 flex items-center gap-2">
                            <label className="w-20 text-right">No. Dokumen</label>
                            <input className="form-input" style={{ width: '50%', borderRadius: 2 }} value={masterData.no_um} readOnly />
                        </div>
                        {/* Supplier */}
                        <div className="mt-1 flex items-center gap-2">
                            <label className="w-20 text-right">Supplier</label>
                            <div className="flex">
                                <input className="form-input" style={{ width: '30%', borderRadius: 2 }} value={masterData.no_supp} readOnly />
                                <input className="form-input" style={{ width: '60%', borderRadius: 2 }} value={masterData.nama_supplier} readOnly />
                                <button
                                    className="ml-1 flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                    style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                    onClick={() => {
                                        setModalDaftarSupplier(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                </button>
                            </div>
                        </div>
                        {/* No Kontrak */}
                        <div className="mt-1 flex items-center gap-2">
                            <label className="w-20 text-right">No. Kontrak</label>
                            <input
                                className="form-input"
                                style={{ width: '50%', borderRadius: 2 }}
                                defaultValue={masterData.no_kontrak}
                                onBlur={(e) => updateMasterState('no_kontrak', e.target.value)}
                            />
                        </div>
                        {/* Keterangan */}
                        <div className="mt-1 flex items-start gap-2">
                            <label className="w-20 text-right">Keterangan</label>
                            <textarea
                                cols={50}
                                rows={5}
                                className="border border-gray-400 p-1 font-semibold text-black"
                                defaultValue={masterData.keterangan}
                                onBlur={(e) => updateMasterState('keterangan', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    {/* ====== RIGHT SIDE ====== */}
                    {statusPage === 'PEMBAYARAN' && (
                        <div>
                            <div className="h-full bg-white-dark px-2 py-3 text-white">
                                <span className="flex w-full items-center justify-center bg-purple-800 px-2 text-center">Tgl. Dibayar</span>
                                <div className="mt-5 flex items-center gap-2">
                                    <label className="w-14 text-right">Tgl. Bayar</label>
                                    <div className="form-input mt-1 flex justify-between" style={{ width: '70%', borderRadius: 2 }}>
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            // renderDayCell={onRenderDayCell}
                                            enableMask={false}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={masterData.tgl_bayar ? moment(masterData.tgl_bayar).toDate() : masterData.tgl_bayar}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                updateMasterState('tgl_bayar', moment(args.value));
                                            }}
                                            style={{ margin: '-5px' }}
                                            // disabled={true}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div>
                                </div>
                                <div className="mt-1 flex items-center gap-2">
                                    <label className="w-14 text-right">No. Reff</label>
                                    <input
                                        className="form-input"
                                        style={{ width: '70%', borderRadius: 2 }}
                                        defaultValue={masterData.no_reff}
                                        onBlur={(e) => updateMasterState('no_reff', e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="w-14 text-right">Jumlah Bayar</label>
                                    <input
                                        className={`form-input text-right`}
                                        value={isAmountFocused ? masterData.bayar_rp : frmNumber(masterData.bayar_rp)}
                                        onChange={(e) => updateMasterState('bayar_rp', e.target.value)}
                                        onFocus={() => setIsAmountFocused(true)}
                                        onBlur={() => {
                                            setIsAmountFocused(false);
                                            reCalc(gridDpList, masterData, updateMasterState);
                                        }}
                                        onKeyPress={(e) => {
                                            if (!/^[0-9.]$/.test(e.key) || (e.key === '.' && e.currentTarget.value.includes('.'))) {
                                                e.preventDefault();
                                            }
                                        }}
                                        style={{ width: '70%', borderRadius: 2 }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* ======== DETAIL JURNAL ==========  */}
                <div className="panel-tab my-2" style={{ background: '#F7F7F7', width: '100%', height: 'auto' }}>
                    <TabComponent selectedItem={statusPage === 'UPDATE-FILE' ? 1 : 0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                        {/* Header */}
                        <div className="e-tab-header">
                            <button tabIndex={0}>1. Alokasi Dana</button>
                            <button tabIndex={1} onClick={() => setSelectedHead('pengajuan-1')}>
                                2. File Pengajuan
                            </button>
                            <button tabIndex={2} onClick={() => setSelectedHead('pembayaran-1')}>
                                3. File Pembayaran
                            </button>
                        </div>

                        {/* Content */}
                        <div className="e-content">
                            {/* 1. Grid Component - INDEX [0] */}
                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                {/* Table */}
                                <GridComponent
                                    id="gridDpList"
                                    name="gridDpList"
                                    locale="id"
                                    ref={(g) => (gridDpList = g)}
                                    editSettings={{
                                        allowAdding: true,
                                        allowEditing: true,
                                        allowDeleting: true,
                                        newRowPosition: 'Bottom',
                                    }}
                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                    allowResizing={true}
                                    autoFit={true}
                                    rowHeight={22}
                                    height={170} //170 barang jadi 150 barang produksi
                                    gridLines={'Both'}
                                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                                    actionComplete={actionCompleteDetailJurnal}
                                    rowSelecting={rowSelectingDetailJurnalDetail}
                                >
                                    <ColumnsDirective>
                                        <ColumnDirective field="diskripsi" headerText="Diskripsi atau Nama Barang" headerTextAlign="Center" textAlign="Left" width="150" allowEditing />
                                        <ColumnDirective
                                            field="qty"
                                            headerText="Kuantitas (Kg)"
                                            headerTextAlign="Center"
                                            textAlign="Right"
                                            width="150"
                                            allowEditing
                                            template={(props: any) => (props.qty ? parseFloat(props.qty).toLocaleString('en-US') : '')}
                                        />
                                        <ColumnDirective
                                            field="harga_mu"
                                            headerText="Harga/Kg"
                                            headerTextAlign="Center"
                                            textAlign="Right"
                                            width="150"
                                            allowEditing
                                            template={(props: any) => {
                                                return <span>{props.harga_mu ? parseFloat(props.harga_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                            }}
                                        />
                                        <ColumnDirective
                                            field="jumlah_rp"
                                            headerText="Total"
                                            headerTextAlign="Center"
                                            textAlign="Right"
                                            width="150"
                                            allowEditing={false}
                                            template={(props: any) => {
                                                return <span>{props.jumlah_rp ? parseFloat(props.jumlah_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                            }}
                                        />
                                        <ColumnDirective
                                            field="tambahan_um"
                                            headerText="Tambahan Uang Muka"
                                            headerTextAlign="Center"
                                            textAlign="Right"
                                            width="150"
                                            allowEditing
                                            template={(props: any) => {
                                                return <span>{props.tambahan_um ? parseFloat(props.tambahan_um).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                            }}
                                        />
                                        <ColumnDirective
                                            field="total_um"
                                            headerText="Total Uang Muka"
                                            headerTextAlign="Center"
                                            textAlign="Right"
                                            width="150"
                                            allowEditing={false}
                                            template={(props: any) => {
                                                return <span>{props.total_um ? parseFloat(props.total_um).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                            }}
                                        />
                                    </ColumnsDirective>

                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                </GridComponent>

                                {/* Action Buttons */}
                                <div className="panel-pager">
                                    <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                        <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                            <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                    <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                        <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                            <div className="mb-5 mt-1 flex">
                                                                <div className="flex flex-col gap-3" style={{ width: '70%' }}>
                                                                    <div>
                                                                        <ButtonComponent
                                                                            id="buAdd1"
                                                                            type="button"
                                                                            cssClass="e-primary e-small"
                                                                            iconCss="e-icons e-small e-plus"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                            onClick={() => handleDataJurnal('new')}
                                                                        />
                                                                        <ButtonComponent
                                                                            id="buDelete1"
                                                                            // content="Hapus"
                                                                            type="button"
                                                                            cssClass="e-warning e-small"
                                                                            iconCss="e-icons e-small e-trash"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                            onClick={() => {
                                                                                DetailAlokasiDanaDelete();
                                                                            }}
                                                                        />
                                                                        <ButtonComponent
                                                                            id="buDeleteAll1"
                                                                            // content="Bersihkan"
                                                                            type="button"
                                                                            cssClass="e-danger e-small"
                                                                            iconCss="e-icons e-small e-erase"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                            onClick={() => {
                                                                                DetailAlokasiDanaAll();
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <p className="mt-5 text-green-700">{masterData.terbilang}</p>
                                                                    </div>
                                                                </div>
                                                                <div style={{ width: '28%' }}>
                                                                    <div className="flex justify-end">
                                                                        <div style={{ width: '30%', textAlign: 'right' }}>
                                                                            <b>Sub Total :</b>
                                                                        </div>
                                                                        <div style={{ width: '35%', textAlign: 'right' }}>
                                                                            <b>{frmNumber(masterData.total_rp)}</b>
                                                                        </div>
                                                                    </div>
                                                                    <hr className="my-3" />

                                                                    <div className="flex justify-end">
                                                                        <div style={{ width: '30%', textAlign: 'right' }}>
                                                                            <b>Total :</b>
                                                                        </div>
                                                                        <div style={{ width: '35%', textAlign: 'right' }}>
                                                                            <b>{frmNumber(masterData.netto_rp)}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex justify-end">
                                                                        <div style={{ width: '30%', textAlign: 'right' }}>
                                                                            <b>Lunas :</b>
                                                                        </div>
                                                                        <div style={{ width: '35%', textAlign: 'right' }}>
                                                                            <b>{frmNumber(masterData.lunas_rp)}</b>
                                                                        </div>
                                                                    </div>

                                                                    <hr className="my-3" />

                                                                    <div className="flex justify-end">
                                                                        <div style={{ width: '30%', textAlign: 'right' }}>
                                                                            <b>Sisa :</b>
                                                                        </div>
                                                                        <div style={{ width: '35%', textAlign: 'right' }}>
                                                                            <b>{frmNumber(masterData.sisa_rp)}</b>
                                                                        </div>
                                                                    </div>
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
                            {/* 2. File Pengajuan - INDEX [1] */}
                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        zIndex: 1000, // zIndex untuk bisa diklik
                                        position: 'absolute',
                                        right: 0,
                                        borderBottomLeftRadius: '6px',
                                        borderBottomRightRadius: '6px',
                                        overflowX: 'scroll',
                                        overflowY: 'hidden',
                                        scrollbarWidth: 'none',
                                        marginRight: 10,
                                    }}
                                >
                                    <ButtonComponent
                                        id="clean"
                                        content="Hapus Gambar"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-trash"
                                        style={{ width: '190px', marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handleRemove(`${selectedHead}`);
                                        }}
                                    />
                                    <ButtonComponent
                                        id="cleanall"
                                        content="Bersihkan Semua Gambar"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-erase"
                                        style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handleRemove('pengajuan-all');
                                        }}
                                    />

                                    <ButtonComponent
                                        id="savefile"
                                        content="Simpan ke File"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-download"
                                        style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handleDownloadImage(`${selectedHead}`);
                                        }}
                                    />

                                    <ButtonComponent
                                        id="preview"
                                        content="Preview"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-image"
                                        style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handlePreviewImage('open');
                                        }}
                                    />

                                    {modalPreview && imageSrc && (
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
                                                    cursor: 'grab',
                                                    transform: `translate(${translate.x}px, ${translate.y}px)`,
                                                    transition: isDragging ? 'none' : 'transform 0.1s ease',
                                                }}
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                onWheel={handleWheel}
                                            >
                                                <Image
                                                    src={imageSrc}
                                                    style={{
                                                        transform: `scale(${zoomLevel})`,
                                                        transition: 'transform 0.1s ease',
                                                        cursor: 'pointer',
                                                        maxWidth: '100vw',
                                                        maxHeight: '100vh',
                                                    }}
                                                    className={zoomLevel === 2 ? 'zoomed' : ''}
                                                    onMouseDown={handleMouseDown}
                                                    onMouseUp={handleMouseUp}
                                                    alt="Large Image"
                                                    width={500}
                                                    height={500}
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
                                                    cssClass="e-flat e-primary"
                                                    iconCss="e-icons e-zoom-out"
                                                    onClick={() => {
                                                        setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
                                                    }}
                                                    style={{
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '25px',
                                                    }}
                                                />
                                                <ButtonComponent
                                                    cssClass="e-flat e-primary"
                                                    iconCss="e-icons e-zoom-in"
                                                    onClick={() => {
                                                        setZoomLevel((prev) => Math.min(prev + 0.1, 6));
                                                    }}
                                                    style={{
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '25px',
                                                    }}
                                                />
                                                <ButtonComponent
                                                    cssClass="e-flat e-primary"
                                                    iconCss="e-icons e-close"
                                                    onClick={() => {
                                                        handlePreviewImage('close');
                                                        setZoomLevel(1);
                                                        setTranslate({ x: 0, y: 0 });
                                                    }}
                                                    style={{
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '25px',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <TabComponent selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%" style={{ marginTop: -10, fontSize: 12 }}>
                                    <div className="e-tab-header" style={{ display: 'flex' }}>
                                        <div
                                            tabIndex={0}
                                            onClick={() => setSelectedHead('pengajuan-1')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            1
                                        </div>
                                        <div
                                            tabIndex={1}
                                            onClick={() => setSelectedHead('pengajuan-2')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            2
                                        </div>
                                        <div
                                            tabIndex={2}
                                            onClick={() => setSelectedHead('pengajuan-3')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            3
                                        </div>
                                        <div
                                            tabIndex={3}
                                            onClick={() => setSelectedHead('pengajuan-4')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            4
                                        </div>
                                        <div
                                            tabIndex={4}
                                            onClick={() => setSelectedHead('pengajuan-5')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            5
                                        </div>
                                    </div>
                                    <div className="e-content">
                                        {/* [1] */}
                                        <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPengajuan1}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pengajuan-1')}
                                                        removing={() => handleRemove('pengajuan-1')}
                                                    />
                                                </div>
                                                {dataFiles.preview1 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview1} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [2] */}
                                        <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPengajuan2}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pengajuan-2')}
                                                        removing={() => handleRemove('pengajuan-2')}
                                                    />
                                                </div>
                                                {dataFiles.preview2 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview2} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [3] */}
                                        <div tabIndex={2} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPengajuan3}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pengajuan-3')}
                                                        removing={() => handleRemove('pengajuan-3')}
                                                    />
                                                </div>
                                                {dataFiles.preview3 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview3} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [4] */}
                                        <div tabIndex={3} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPengajuan4}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pengajuan-4')}
                                                        removing={() => handleRemove('pengajuan-4')}
                                                    />
                                                </div>
                                                {dataFiles.preview4 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview4} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [5] */}
                                        <div tabIndex={4} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPengajuan5}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pengajuan-5')}
                                                        removing={() => handleRemove('pengajuan-5')}
                                                    />
                                                </div>
                                                {dataFiles.preview5 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview5} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabComponent>
                            </div>
                            {/* 3. File Pembayaran - INDEX [2] */}
                            <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        zIndex: 1000, // zIndex untuk bisa diklik
                                        position: 'absolute',
                                        right: 0,
                                        borderBottomLeftRadius: '6px',
                                        borderBottomRightRadius: '6px',
                                        overflowX: 'scroll',
                                        overflowY: 'hidden',
                                        scrollbarWidth: 'none',
                                        marginRight: 10,
                                    }}
                                >
                                    <ButtonComponent
                                        id="clean"
                                        content="Hapus Gambar"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-trash"
                                        style={{ width: '190px', marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handleRemove(`${selectedHead}`);
                                        }}
                                    />
                                    <ButtonComponent
                                        id="cleanall"
                                        content="Bersihkan Semua Gambar"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-erase"
                                        style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handleRemove('pembayaran-all');
                                        }}
                                    />

                                    <ButtonComponent
                                        id="savefile"
                                        content="Simpan ke File"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-download"
                                        style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handleDownloadImage(`pembayaran-${selectedHead}`);
                                        }}
                                    />

                                    <ButtonComponent
                                        id="preview"
                                        content="Preview"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-image"
                                        style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                        onClick={() => {
                                            handlePreviewImage('open');
                                        }}
                                    />
                                </div>
                                <TabComponent selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%" style={{ marginTop: -10, fontSize: 12 }}>
                                    <div className="e-tab-header" style={{ display: 'flex' }}>
                                        <div
                                            tabIndex={0}
                                            onClick={() => setSelectedHead('pembayaran-1')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            1
                                        </div>
                                        <div
                                            tabIndex={1}
                                            onClick={() => setSelectedHead('pembayaran-2')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            2
                                        </div>
                                        <div
                                            tabIndex={2}
                                            onClick={() => setSelectedHead('pembayaran-3')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            3
                                        </div>
                                        <div
                                            tabIndex={3}
                                            onClick={() => setSelectedHead('pembayaran-4')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            4
                                        </div>
                                        <div
                                            tabIndex={4}
                                            onClick={() => setSelectedHead('pembayaran-5')}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            5
                                        </div>
                                    </div>
                                    <div className="e-content">
                                        {/* [1] */}
                                        <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPembayaran1}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pembayaran-1')}
                                                        removing={() => handleRemove('pembayaran-1')}
                                                    />
                                                </div>
                                                {dataFiles.preview6 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview6} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [2] */}
                                        <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPembayaran2}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pembayaran-2')}
                                                        removing={() => handleRemove('pembayaran-2')}
                                                    />
                                                </div>
                                                {dataFiles.preview7 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview7} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [3] */}
                                        <div tabIndex={2} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPembayaran3}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pembayaran-3')}
                                                        removing={() => handleRemove('pembayaran-3')}
                                                    />
                                                </div>
                                                {dataFiles.preview8 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview8} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [4] */}
                                        <div tabIndex={3} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPembayaran4}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pembayaran-4')}
                                                        removing={() => handleRemove('pembayaran-4')}
                                                    />
                                                </div>
                                                {dataFiles.preview9 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview9} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* [5] */}
                                        <div tabIndex={4} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: 400 }}>
                                                    <UploaderComponent
                                                        id="previewfileupload"
                                                        type="file"
                                                        ref={uploaderRefPembayaran5}
                                                        multiple={false}
                                                        selected={(e) => handleFileSelect(e, 'pembayaran-5')}
                                                        removing={() => handleRemove('pembayaran-5')}
                                                    />
                                                </div>
                                                {dataFiles.preview10 && (
                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                        <Image src={dataFiles.preview10} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TabComponent>
                            </div>
                        </div>
                    </TabComponent>
                </div>
            </div>

            {/* DIALOG SUPPLIER */}
            {modalDaftarSupplier && (
                <DialogListSupplier
                    isOpen={modalDaftarSupplier}
                    onClose={() => {
                        setModalDaftarSupplier(false);
                        setSearchNoSupp('');
                        setSearchNamaRelasi('');
                        setFilteredDataSupplier(listDaftarSupplier);
                    }}
                    handlePilihSupplier={handlePilihVendor}
                    pencarianSupplier={(e: any, a: any) => PencarianSupplier(e, a)}
                    setSelectedSupplier={setSelectedSupplier}
                    dataSource={searchNoSupp !== '' || searchNamaRelasi !== '' ? filteredDataSupplier : listDaftarSupplier}
                />
            )}
            {/* END DIALOG SUPPLIER */}

            {/* DIALOG PROGRESS BAR */}
            <GlobalProgressBar />
            {/* END DIALOG PROGRESS BAR */}
        </DialogComponent>
    );
};

export default DialogFrmDp;
