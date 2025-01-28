import React, { useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { L10n } from '@syncfusion/ej2-base';
import idIDLocalization from '@/public/syncfusion/locale.json';
import { frmNumber, generateNU, FillFromSQL, fetchPreferensi, tanpaKoma, myAlertGlobal, formatNumber, FirstDayInPeriod, entitaspajak } from '@/utils/routines';
import { useState, useEffect } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import axios from 'axios';
L10n.load(idIDLocalization);
import Swal from 'sweetalert2';
import styles from './prabkk.module.css';
import stylesTtb from '../prabkklist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faMagnifyingGlass, faSearch } from '@fortawesome/free-solid-svg-icons';
import HeaderPraBkk from './headerPraBkk';
import DetailPraBkk from './detailPraBkk';
import { PraBkkEdit } from '../model/api';
import FrmBOKDlg from './frmBOKDlg';
import { handleInputJumlah, handleUpload } from './fungsi';
import { setImage } from '@syncfusion/ej2/spreadsheet';
import { exitCode } from 'process';
import { ProgressBarComponent, ProgressAnnotation } from '@syncfusion/ej2-react-progressbar';
import { cekDataDiDatabase, cekNoDokTerakhir, isEntitasPajak } from '@/utils/global/fungsi';
import { resExcel, resPdf, resUnknow, resWord, resZip } from '../../bm/component/resource';
import JSZip from 'jszip';

interface FrmPraBkkProps {
    stateDokumen: any;
    isOpen: boolean;
    onClose: () => void;
    onRefresh: any;
    isFilePendukungBk: any;
    dataListMutasibank: any;
    onRefreshTipe: any;
    // stateDialog: any;
    // setStateDialog: Function;
}

// const FrmPraBkk: React.FC<FrmPraBkkProps> = ({ stateDokumen, isOpen, onClose, onRefresh, stateDialog, setStateDialog }) => {
const FrmPraBkk: React.FC<FrmPraBkkProps> = ({ stateDokumen, isOpen, onClose, onRefresh, isFilePendukungBk, dataListMutasibank, onRefreshTipe }) => {
    // console.log('stateDokumen', stateDokumen);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [showDialogBok, setShowDialogBok] = useState(false);
    const [dariBok, setDariBok] = useState(false);

    const vRefreshData = useRef(0);

    let upload1: any;
    let upload2: any;
    let upload3: any;
    let upload4: any;

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

    const [isLoadingProgress, setIsLoadingProgress] = useState(false);
    const [disabledSimpan, setDisabledSimpan] = useState(false);

    const [progressValue, setProgressValue] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('Initializing...');

    const [displayedProgress, setDisplayedProgress] = useState(0);

    const handleAmbilDataUpload = (e: any) => {
        upload1 = e.uploaderRef;
        upload2 = e.uploaderRef2;
        upload3 = e.uploaderRef3;
        upload4 = e.uploaderRef4;
    };
    const [tag, setTag] = useState('');

    const stateBaru = async () => {
        setHeaderState({
            kode_dokumen: '',
            dokumen: 'BK',
            no_dokumen: '',
            tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
            no_warkat: null,
            tgl_valuta: null, //moment().format('YYYY-MM-DD HH:mm:ss'),
            kode_cust: '',
            kode_akun_debet: '',
            kode_supp: '',
            kode_akun_kredit: '',
            kode_akun_diskon: '',
            kurs: '',
            debet_rp: 0,
            kredit_rp: 0,
            jumlah_rp: 0,
            jumlah_mu: 0,
            pajak: 'N',
            kosong: '',
            kepada: '',
            catatan: '',
            status: 'Terbuka',
            userid: stateDokumen?.userid,
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            status_approved: '',
            tgl_approved: null, //moment().format('YYYY-MM-DD HH:mm:ss'),
            tgl_pengakuan: null, //moment().format('YYYY-MM-DD HH:mm:ss'),
            no_TTP: '',
            tgl_TTP: '',
            kode_sales: '',
            kode_fk: '',
            approval: '',
            tgl_setorgiro: '',
            faktur: '',
            barcode: '',
            komplit: '',
            validasi1: '',
            validasi2: '',
            validasi3: '',
            validasi_ho2: '',
            validasi_ho3: '',
            validasi_catatan: '',
            tolak_catatan: '',
            kode_kry: '',
            tgl_trxdokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
            api_id: 0,
            api_pending: '',
            api_catatan: '',
            api_norek: '',
            kode_aktiva: '',
            kode_rpe: '',
            kode_phe: '',
            kode_rps: '',
            kode_um: '',
            no_kontrak_um: '',
            bm_pos: '',
            no_akun: '',
            nama_akun: '',
            tipe: '',
            kode_mu: 'IDR',
            balance: '',
            no_fk: '',
            subledger: '',
            selisih: 0,
        });

        setDetailState([
            {
                kode_dokumen: '',
                id_dokumen: 2,
                dokumen: 'BK',
                tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                kode_akun: '',
                kode_subledger: '',
                kurs: '',
                debet_rp: 0,
                kredit_rp: 0,
                jumlah_rp: 0,
                jumlah_mu: 0,
                catatan: '',
                no_warkat: '',
                tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                persen: 0,
                kode_dept: '',
                kode_kerja: '',
                approval: 'N',
                posting: 'N',
                rekonsiliasi: 'N',
                tgl_rekonsil: '',
                userid: stateDokumen?.userid,
                tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                audit: '',
                kode_kry: '',
                kode_jual: '',
                no_kontrak_um: '',
                no_akun: '',
                nama_akun: '',
                tipe: '',
                kode_mu: '',
                no_kerja: '',
                nama_dept: '',
                nama_kry: '',
                no_subledger: '',
                nama_subledger: '',
                subledger: '',
                isledger: '',
                limit_bkk: '',
            },
        ]);
    };

    const dialogClose = async () => {
        await stateBaru();
        setImageState({
            preview: null,
            preview2: null,
            preview3: null,
            preview4: null,
            nameImage: null,
            nameImage2: null,
            nameImage3: null,
            nameImage4: null,
            selectedHead: '1',
        });
        onClose();
    };

    const [headerState, setHeaderState] = useState({
        kode_dokumen: '',
        dokumen: 'BK',
        no_dokumen: '',
        tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
        no_warkat: null,
        tgl_valuta: null,
        kode_cust: '',
        kode_akun_debet: '',
        kode_supp: '',
        kode_akun_kredit: '',
        kode_akun_diskon: '',
        kurs: '',
        debet_rp: 0,
        kredit_rp: 0,
        jumlah_rp: 0,
        jumlah_mu: 0,
        pajak: 'N',
        kosong: '',
        kepada: '',
        catatan: '',
        status: 'Terbuka',
        userid: stateDokumen?.userid,
        tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
        status_approved: '',
        tgl_approved: null, //moment().format('YYYY-MM-DD HH:mm:ss'),
        tgl_pengakuan: null, //moment().format('YYYY-MM-DD HH:mm:ss'),
        no_TTP: '',
        tgl_TTP: '',
        kode_sales: '',
        kode_fk: '',
        approval: '',
        tgl_setorgiro: '',
        faktur: '',
        barcode: '',
        komplit: '',
        validasi1: '',
        validasi2: '',
        validasi3: '',
        validasi_ho2: '',
        validasi_ho3: '',
        validasi_catatan: '',
        tolak_catatan: '',
        kode_kry: '',
        tgl_trxdokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
        api_id: 0,
        api_pending: '',
        api_catatan: '',
        api_norek: '',
        kode_aktiva: '',
        kode_rpe: '',
        kode_phe: '',
        kode_rps: '',
        kode_um: '',
        no_kontrak_um: '',
        bm_pos: '',
        no_akun: '',
        nama_akun: '',
        tipe: '',
        kode_mu: 'IDR',
        balance: '',
        no_fk: '',
        subledger: '',
        selisih: 0,
    });

    const [detailState, setDetailState] = useState([
        {
            kode_dokumen: '',
            id_dokumen: 2,
            dokumen: 'BK',
            tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
            kode_akun: '',
            kode_subledger: '',
            kurs: '',
            debet_rp: 0,
            kredit_rp: 0,
            jumlah_rp: 0,
            jumlah_mu: 0, //headerState.jumlah_mu, //0,
            catatan: '',
            no_warkat: '',
            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
            persen: 0,
            kode_dept: '',
            kode_kerja: '',
            approval: 'N',
            posting: 'N',
            rekonsiliasi: 'N',
            tgl_rekonsil: '',
            userid: stateDokumen?.userid,
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            audit: '',
            kode_kry: '',
            kode_jual: '',
            no_kontrak_um: '',
            no_akun: '',
            nama_akun: '',
            tipe: '',
            kode_mu: '',
            no_kerja: '',
            nama_dept: '',
            nama_kry: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            isledger: '',
            limit_bkk: '',
        },
    ]);

    const [jsonImageEdit, setJsonImageEdit] = useState([]);

    const [imageState, setImageState] = useState<any>({
        preview: null,
        preview2: null,
        preview3: null,
        preview4: null,
        nameImage: null,
        nameImage2: null,
        nameImage3: null,
        nameImage4: null,
        selectedHead: '1',
    });

    const handleCreate = async () => {
        stateBaru();
        const result = await generateNU(
            stateDokumen?.kode_entitas,
            '',
            '16',
            dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
        );
        if (result) {
            // setHeaderState(result);
            setHeaderState((prevFormData: any) => ({
                ...prevFormData,
                no_dokumen: result,
            }));
        } else {
            console.error('undefined');
        }
    };

    const handleEditImages = async () => {
        try {
            const loadtbImages = await axios.get(`${apiUrl}/erp/load_images`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: stateDokumen?.masterKodeDokumen,
                },
            });

            const result = loadtbImages.data.data;

            setJsonImageEdit(result);
            const imagesMap = [null, null, null, null];

            if (result.length > 0) {
                result.forEach((item: any) => {
                    imagesMap[item.id_dokumen - 1] = item.filegambar;
                });
            }

            const zipData = result.find((item: any) => item.id_dokumen == '999');

            if (zipData) {
                const loadImage = await axios.get(`${apiUrl}/erp/extrak_zip`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        nama_zip: zipData.filegambar,
                    },
                });

                const images = loadImage.data.images;
                imagesMap.forEach((filegambar, index) => {
                    if (filegambar) {
                        const fileUri = images.find((item: any) => item.fileName == filegambar);
                        if (fileUri) {
                            // previewSetters[index](fileUri.imageUrl);
                            // nameSetters[index](fileUri.fileName);
                            if (index === 0) {
                                setImageState((prevData: any) => ({
                                    ...prevData,
                                    preview: fileUri.imageUrl,
                                    nameImage: fileUri.fileName,
                                }));
                                // setImageState({ ...imageState, preview: fileUri.imageUrl, nameImage: fileUri.fileName });
                            } else if (index === 1) {
                                setImageState((prevData: any) => ({
                                    ...prevData,
                                    preview2: fileUri.imageUrl,
                                    nameImage2: fileUri.fileName,
                                }));
                            } else if (index === 2) {
                                setImageState((prevData: any) => ({
                                    ...prevData,
                                    preview3: fileUri.imageUrl,
                                    nameImage3: fileUri.fileName,
                                }));
                            } else if (index === 3) {
                                setImageState((prevData: any) => ({
                                    ...prevData,
                                    preview4: fileUri.imageUrl,
                                    nameImage4: fileUri.fileName,
                                }));
                            }
                        }
                    }
                });
            } else {
                console.error('Zip data not found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleEdit = async () => {
        const paramList = {
            entitas: stateDokumen?.kode_entitas,
            param1: stateDokumen?.masterKodeDokumen,
            param2: stateDokumen?.jenisTab === 'Baru' ? 'baru' : stateDokumen?.jenisTab === 'Approved' ? 'approved' : 'all',
        };

        try {
            await PraBkkEdit(paramList, stateDokumen?.token)
                .then((result: any) => {
                    const { master, detail } = result;
                    setHeaderState(master[0]);
                    setDetailState(detail);
                })
                .catch((error) => {
                    console.error('Error:', error.message);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSelectedDialogBok = (dataObject: any) => {
        let nilaiTanpaKoma: any;

        if ((typeof dataObject.jumlah_mu === 'string' && dataObject.jumlah_mu?.includes(',')) || (typeof dataObject.jumlah_mu === 'string' && dataObject.jumlah_mu?.includes('.'))) {
            nilaiTanpaKoma = parseFloat(tanpaKoma(dataObject.jumlah_mu));
        } else {
            nilaiTanpaKoma = dataObject.jumlah_mu;
        }
        setHeaderState({
            ...headerState,
            kode_fk: dataObject.kode_fk,
            no_fk: dataObject.no_fk,
            // jumlah_mu: frmNumber(dataObject.jumlah_mu), //nilaiTanpaKoma, //parseFloat(frmNumber(dataObject.jumlah_mu)),
            jumlah_mu: nilaiTanpaKoma, //dataObject.jumlah_mu,
            catatan: 'Realisasi BOK No. ' + dataObject.no_fk + '. ' + dataObject.keterangan,
            kode_mu: 'IDR',
            kurs: '1.00',
            // chbAkun: true,
        });
        // nilaiJumlahMu = dataObject.jumlah_mu; //('jumlah_mu', dataObject.jumlah_mu);
        handleInputJumlah('jumlah_mu', nilaiTanpaKoma); //dataObject.jumlah_mu);
        setDariBok(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (stateDokumen?.masterDataState === 'BARU') {
                    handleCreate();
                } else if (stateDokumen?.masterDataState === 'EDIT') {
                    handleEdit();
                    handleEditImages();
                }
            } catch (error) {
                console.error('Terjadi kesalahan saat memuat data:', error);
            }
        };
        fetchData();
        // handleHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDokumen?.masterDataState, stateDokumen?.masterKodeDokumen, isOpen]);

    function toPascalCase(str: any) {
        return str
            .toLowerCase() // Pastikan string dimulai dalam lowercase
            .split(' ') // Pisahkan string berdasarkan spasi atau delimiter lain
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama menjadi besar dan sisanya tetap kecil
            .join(''); // Gabungkan kembali tanpa spasi
    }

    const fetchSubledgerData2 = async (kodeAkun: any) => {
        try {
            const cekSubledger = await axios.get(`${apiUrl}/erp/cek_subledger`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: kodeAkun,
                },
            });
            // console.log('cekSubledger', cekSubledger);
            const modifiedData = cekSubledger.data.data.map((item: any) => {
                return { ...item, tipe: toPascalCase(item.tipe) };
            });
            // console.log('modifiedData', modifiedData);
            return modifiedData;
        } catch (error) {
            console.error('Error fetching subledger data:', error);
        }
    };

    const validateSubledgerInDetails = async () => {
        // console.log('cekSubledgervvvvvvvvvvvvv', detailState);

        // Use Promise.all to wait for all checks to complete
        const cekDetail: any = await Promise.all(
            detailState.map(async (item: any) => {
                // console.log('detailState', item);
                // console.log('detailState', item.kode_akun);

                const cekSub = await fetchSubledgerData2(item.kode_akun);
                // if (cekSub?.length > 0) {
                //     if (cekSub[0]?.subledger === 'Y') {
                //         // console.log('cekSub[0]?.subledger1', cekSub[0]?.subledger);
                //         // console.log('cekSub[0]?.tipe1', cekSub[0]?.tipe);

                //         if (!item.kode_subledger) {
                //             myAlertGlobal(`Subledger untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                //             return false; // Stop execution if subledger is empty
                //         }
                //     } else if (cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') {
                //         // console.log('cekSub[0]?.subledger2', cekSub[0]?.subledger);
                //         // console.log('cekSub[0]?.tipe2', cekSub[0]?.tipe);

                //         if (!item.kode_dept) {
                //             myAlertGlobal(`Departemen untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                //             return false;
                //         } else if (!item.nama_kry) {
                //             myAlertGlobal(`Nama karyawan untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                //             return false;
                //         } else if (!item.kode_jual) {
                //             myAlertGlobal(`Divisi penjualan untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                //             return false;
                //         }
                //     }
                // }
                if (cekSub?.length > 0) {
                    if ((cekSub[0]?.tipe === 'Hutang' || cekSub[0]?.tipe === 'Piutang' || cekSub[0]?.subledger === 'Y') && !item.kode_subledger) {
                        myAlertGlobal(`Subledger untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                        return false; // Stop execution if subledger is empty
                    } else if (cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') {
                        if (!item.kode_dept) {
                            myAlertGlobal(`Departemen untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                            return false;
                        } else if (!item.nama_kry) {
                            myAlertGlobal(`Nama karyawan untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                            return false;
                        }
                    } else if (cekSub[0]?.tipe === 'Pendapatan' || cekSub[0]?.tipe === 'Pendapatan Lain-Lain' || cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') {
                        if (!item.kode_jual) {
                            myAlertGlobal(`Divisi penjualan untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                            return false;
                        }
                    }
                    // if (cekSub[0]?.subledger === 'Y') {
                    //     // console.log('cekSub[0]?.subledger1', cekSub[0]?.subledger);
                    //     // console.log('cekSub[0]?.tipe1', cekSub[0]?.tipe);

                    //     if (!item.kode_subledger) {
                    //         myAlertGlobal(`Subledger untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                    //         return false; // Stop execution if subledger is empty
                    //     }
                    // } else if (cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') {
                    //     // console.log('cekSub[0]?.subledger2', cekSub[0]?.subledger);
                    //     // console.log('cekSub[0]?.tipe2', cekSub[0]?.tipe);

                    //     if (!item.kode_dept) {
                    //         myAlertGlobal(`Departemen untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                    //         return false;
                    //     } else if (!item.nama_kry) {
                    //         myAlertGlobal(`Nama karyawan untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                    //         return false;
                    //     } else if (!item.kode_jual) {
                    //         myAlertGlobal(`Divisi penjualan untuk akun ${item.nama_akun} belum diisi.`, 'FrmPraBkk');
                    //         return false;
                    //     }
                    // }
                }
                return true; // All checks passed for this item
            })
        );

        // Check if any of the checks failed
        return cekDetail.every((result: boolean) => result === true);
    };

    let interval: any;

    const resetStates = () => {
        clearInterval(interval);
        setIsLoadingProgress(false);
        setProgressValue(0);
    };

    // const handleDateValidation = async () => {
    //     try {
    //         const result = await Swal.fire({
    //             title: `Tanggal lebih kecil dari hari ini.`,
    //             showCancelButton: true,
    //             confirmButtonText: 'Ya',
    //             cancelButtonText: 'Batal',
    //             target: '#FrmPraBkk',
    //             allowOutsideClick: false,
    //         });

    //         if (!result.isConfirmed) {
    //             // resetStates();
    //             return false;
    //         }
    //         return true;
    //     } catch (error) {
    //         // resetStates();
    //         console.error('Error in date validation:', error);
    //         return false;
    //     }
    // };

    // const handleDateValidation = () => {
    //     return window.confirm('Tanggal lebih kecil dari hari ini. Lanjutkan?');
    // };

    const [showDateValidationModal, setShowDateValidationModal] = useState(false);
    const [dateValidationResolver, setDateValidationResolver] = useState<((value: boolean) => void) | null>(null);

    const handleDateValidation = () => {
        return new Promise<boolean>((resolve) => {
            setDateValidationResolver(() => resolve); // Store the resolver function
            setShowDateValidationModal(true);
        });
    };

    const handleConfirm = () => {
        if (dateValidationResolver) {
            dateValidationResolver(true);
        }
        setShowDateValidationModal(false);
        setDateValidationResolver(null);
    };

    const handleCancel = () => {
        if (dateValidationResolver) {
            dateValidationResolver(false);
        }
        setShowDateValidationModal(false);
        setDateValidationResolver(null);
    };

    // const handleDateValidation = async () => {
    //     try {
    //         // Add timeout to prevent infinite waiting
    //         const timeoutPromise = new Promise((_, reject) => {
    //             setTimeout(() => reject(new Error('Dialog timeout')), 10000); // 10 second timeout
    //         });

    //         const dialogPromise = Swal.fire({
    //             title: `Tanggal lebih kecil dari hari ini.`,
    //             showCancelButton: true,
    //             confirmButtonText: 'Ya',
    //             cancelButtonText: 'Batal',
    //             target: '#FrmPraBkk',
    //             allowOutsideClick: false,
    //             // Add these options to improve dialog behavior
    //             focusConfirm: true,
    //             returnFocus: false,
    //             willClose: () => {
    //                 // Cleanup any pending state here if needed
    //             },
    //         });

    //         // Race between dialog and timeout
    //         const result = (await Promise.race([dialogPromise, timeoutPromise])) as {
    //             isConfirmed: boolean;
    //             isDismissed: boolean;
    //             isDenied: boolean;
    //             value: any;
    //         };

    //         if (!result || !result.isConfirmed) {
    //             return false;
    //         }
    //         return true;
    //     } catch (error) {
    //         console.error('Error in date validation:', error);
    //         // Show error message to user
    //         Swal.fire({
    //             title: 'Error',
    //             text: 'Terjadi kesalahan saat validasi tanggal. Silakan coba lagi.',
    //             icon: 'error',
    //             target: '#FrmPraBkk',
    //         });
    //         return false;
    //     }
    // };

    const fetchSubledgerData = async (kodeAkun: any) => {
        try {
            const cekSubledger = await axios.get(`${apiUrl}/erp/cek_subledger`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: kodeAkun,
                },
            });
            return cekSubledger.data.data;
        } catch (error) {
            console.error('Error fetching subledger data:', error);
        }
    };

    const fetchSubledgerDataDetail = async (kodeAkun: any) => {
        try {
            const cekSubledger = await axios.get(`${apiUrl}/erp/cek_subledger`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: kodeAkun,
                },
            });

            const modifiedData = cekSubledger.data.data.map((item: any) => {
                return { ...item, tipe: toPascalCase(item.tipe) };
            });
            // setResponCekSubledger(modifiedData);
            return modifiedData;
        } catch (error) {
            console.error('Error fetching subledger data:', error);
        }
    };

    const validateKodeJualDetail = async (detailState: any) => {
        for (const item of detailState) {
            try {
                const cekSubDetail = await fetchSubledgerDataDetail(item.kode_akun);
                if (cekSubDetail?.length > 0) {
                    const tipe = cekSubDetail[0]?.tipe;
                    const isInvalidType = ['Pendapatan', 'Pendapatan Lain-Lain', 'Beban', 'Beban Lain-Lain'].includes(tipe);
                    if (isInvalidType && !item?.kode_jual) {
                        return false; // Menunjukkan validasi gagal
                    }
                }
            } catch (error) {
                console.error(`Error validating item with kode_akun: ${item.kode_akun}`, error);
                throw error; // Propagate error untuk ditangkap di catch
            }
        }
        return true; // Semua validasi berhasil
    };

    const blokingan = async () => {
        const entitasUser = await axios.get(`${apiUrl}/erp/get_entitas_user`, {
            params: {
                entitas: stateDokumen?.kode_entitas,
                param1: stateDokumen?.userid,
            },
            headers: {
                Authorization: `Bearer ${stateDokumen.token}`,
            },
        });
        const cekEntitasUser = entitasUser.data.data[0];

        const allowedEntities = new Set(['898', '698', '999']);
        const isEditable = stateDokumen?.masterDataState === 'EDIT' && stateDokumen?.jenisTab === 'Approved';
        const isUploadFilePendukung = stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI';
        if (isEditable && !allowedEntities.has(cekEntitasUser.kode_entitas) && cekEntitasUser.userid !== 'ADMINISTRATOR' && !isUploadFilePendukung) {
            myAlertGlobal('Transaksi BK tidak dapat diedit. Dokumen sudah di approved.', 'FrmPraBkk');
            throw exitCode;
        }

        const cekSub = await fetchSubledgerData(headerState?.kode_akun_kredit);

        const checkEntPajak = await entitaspajak(stateDokumen?.kode_entitas, stateDokumen?.userid);
        const modcheckEntPajak = checkEntPajak === 'false' ? false : true;

        const fetchNilaiKas = async () => {
            try {
                const cekNilaiKas = await axios.get(`${apiUrl}/erp/cek_akun_kas_negatif`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        param1: moment().subtract(1, 'day').format('YYYY-MM-DD'),
                        param2: moment().add(1, 'day').format('YYYY-MM-DD'),
                    },
                    headers: { Authorization: `Bearer ${stateDokumen?.token}` },
                });
                return cekNilaiKas.data.data;
            } catch (error) {
                console.error('Error fetching subledger data:', error);
            }
        };
        const cekFieldKas = await fetchNilaiKas();

        const cekPreferensi = await fetchPreferensi(stateDokumen?.kode_entitas, `${apiUrl}/erp/preferensi?`);

        const usersApp = await axios.get(`${apiUrl}/erp/users_app`, {
            params: {
                entitas: stateDokumen?.kode_entitas,
                param1: stateDokumen?.userid,
            },
        });
        const cekUserApp = usersApp.data.data;

        const periode = await FirstDayInPeriod(stateDokumen?.kode_entitas);
        const formatPeriode = moment(periode).format('YYYY-MM-DD');
        const appDateSubtract = moment().subtract(1, 'day').format('YYYY-MM-DD');
        const appDateOri = moment().format('YYYY-MM-DD');
        const vTglDok = moment(headerState?.tgl_dokumen).format('YYYY-MM-DD');

        const dokumenDate = moment(vTglDok, 'YYYY-MM-DD HH:mm:ss');
        const appDate = moment(appDateOri, 'YYYY-MM-DD HH:mm:ss');

        const isValidDivisiJual = await validateKodeJualDetail(detailState);

        if (!isValidDivisiJual) {
            // alert('Divisi penjualan belum diisi.');
            myAlertGlobal('Divisi penjualan belum diisi.', 'FrmPraBkk');
            throw exitCode;
            // return; // Hentikan eksekusi lebih lanjut
        }

        if (!moment(headerState?.tgl_dokumen).format('YYYY-MM-DD')) {
            myAlertGlobal('Tanggal belum diisi', 'FrmPraBkk');
            // return false;
            throw exitCode;
        }
        if (headerState?.no_dokumen === '') {
            myAlertGlobal('No. Bukti belum diisi', 'FrmPraBkk');
            return false;
            // throw exitCode;
        }
        if (headerState?.kode_akun_kredit === '') {
            myAlertGlobal('Akun Kredit belum diisi', 'FrmPraBkk');
            // return false;
            throw exitCode;
        }

        if (cekSub[0]?.subledger === 'Y' && headerState?.kode_supp === '') {
            myAlertGlobal('Subledger akun kredit belum diisi.', 'FrmPraBkk');
            // return false;
            throw exitCode;
        }

        if (headerState?.kepada === '') {
            myAlertGlobal('Bayar Kepada belum diisi', 'FrmPraBkk');
            return false;
            // throw exitCode;
        }
        if (detailState.length === 0) {
            myAlertGlobal('Data alokasi dana belum diisi.', 'FrmPraBkk');
            // return false;
            throw exitCode;
        }

        // if (headerState?.jumlah_mu === '0') {
        if (headerState?.jumlah_mu === 0) {
            myAlertGlobal('Jumlah MU tidak boleh kosong.', 'FrmPraBkk');
            // return false;
            throw exitCode;
        }
        // if (headerState.selisih !== 0) {
        //     myAlertGlobal('Pengeluaran Lain tidak bisa disimpan masih ada selisih Db/Kr.', 'FrmPraBkk');
        //     return false;
        // throw exitCode;
        // }
        if (headerState?.no_warkat !== '') {
            if (headerState?.kode_sales && headerState?.kosong !== '0') {
                myAlertGlobal('Tidak ada referensi no. warkat tsb, status warkat harus Baru.', 'FrmPraBkk');
                // return false;
                throw exitCode;
            }
            if (!headerState?.kode_sales && headerState?.kosong === '0') {
                myAlertGlobal('Status warkat dalam proses, pilihan harus Cair/Tolak.', 'FrmPraBkk');
                // return false;
                throw exitCode;
            }
        }
        if (stateDokumen?.jenisUpdateBKK !== 1) {
            if (vTglDok < formatPeriode) {
                myAlertGlobal('Tanggal tidak dalam periode akuntansi.', 'FrmPraBkk');
                // return false;
                throw exitCode;
            }

            if (vTglDok < appDateSubtract) {
                const shouldContinue = await handleDateValidation();
                if (!shouldContinue) {
                    return;
                }
            }

            if (headerState?.debet_rp - headerState?.kredit_rp !== 0) {
                myAlertGlobal('Pengeluaran Lain tidak bisa disimpan masih ada selisih Db/Kr.' + `${headerState?.debet_rp - headerState?.kredit_rp}`, 'FrmPraBkk');
                // return false;
                throw exitCode;
            }
            if (!entitaspajak(stateDokumen?.kode_entitas, stateDokumen?.kode_user)) {
                if (stateDokumen?.userid !== 'administrator') {
                    if (cekUserApp[0]?.app_backdate !== 'Y') {
                        if (dokumenDate.isAfter(appDate)) {
                            if (dokumenDate.diff(appDate, 'days') > 2) {
                                myAlertGlobal('Tanggal lebih besar dari 3 hari.', 'FrmPraBkk');
                                // return false;
                                throw exitCode;
                            } else if (appDate.diff(dokumenDate, 'days') > 14) {
                                myAlertGlobal('Tanggal lebih besar dari 14 hari.', 'FrmPraBkk');
                                // return false;
                                throw exitCode;
                            }
                        }
                    }
                }
            }

            if (cekPreferensi[0].block_kas_negatif === 'Y') {
                const mergedResult = [headerState].map((item: any) => {
                    const vKodeAkun = cekFieldKas.find((kodeAkun: any) => kodeAkun.kode_akun === item.kode_akun_kredit);
                    if (vKodeAkun) {
                        myAlertGlobal('Transaksi BK Di Blokir Akun Kas/Bank ada yang negatif, silahkan segera lakukan balancing.', 'FrmPraBkk');
                        // return false;
                        throw exitCode;
                    }
                    // return item;
                });
            }
            // console.log('stateDokumen?.CON_BKK', stateDokumen?.CON_BKK);
            // console.log('stateDokumen?.jenisTab', stateDokumen?.jenisTab);
        }

        if (tag === 'beginEdit') {
            myAlertGlobal('Detail grid belum lengkap', 'FrmPraBkk');
            return false;
            // throw exitCode;
        }

        return true;
    };

    const tglJamDokumen = moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYY-MM-DD HH:mm:ss');

    const updatedTglJamDokumen = moment(tglJamDokumen)
        .set({
            hour: moment().hour(),
            minute: moment().minute(),
            second: moment().second(),
        })
        .format('YYYY-MM-DD HH:mm:ss');

    const saveDoc2 = async () => {
        // const cekNoDok = await cekNoDokTerakhir(stateDokumen?.kode_entitas, 'tb_m_keuangan_master', 'BK', '0', '', stateDokumen?.token);
        // console.log('cekNoDok', cekNoDok);

        // if (cekNoDok.length > 0) {
        //     console.log('cekNoDok.strnum;', cekNoDok[0].strnum);
        // }

        console.log('stateDokumen?.masterDataState', stateDokumen?.masterDataState);
    };

    const saveDoc = async () => {
        try {
            setDisabledSimpan(true);
            const pajak = await isEntitasPajak(stateDokumen.kode_entitas, stateDokumen.userid, stateDokumen.token);

            const cekBlokingan = await blokingan();
            const isValid = await (async () => {
                setLoadingMessage('validate Subledger In Details...');
                setProgressValue(10);

                if (stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI') {
                    return true;
                } else {
                    return await validateSubledgerInDetails();
                }
            })();

            // console.log('isValid', isValid);
            if (!cekBlokingan) {
                myAlertGlobal('Data belum dapat disimpan, cek data terlebih dahulu', 'FrmPraBkk');
            } else if (isValid) {
                setIsLoadingProgress(true);
                setProgressValue(0);

                interval = setInterval(() => {
                    setProgressValue((prev) => {
                        if (prev >= 90) {
                            clearInterval(interval);
                            return 90;
                        }
                        return prev + 2;
                    });
                }, 40);

                // console.log('masuk saveDoc', stateDokumen?.CON_BKK);
                // throw exitCode;
                setLoadingMessage('create JSON...');
                setProgressValue(20);
                const isDebetEmpty = detailState.some((row: { jumlah_mu: any }) => row.jumlah_mu === 0);
                if (isDebetEmpty) {
                    // console.log('isDebetEmpty cek');
                    setTimeout(() => {
                        myAlertGlobal('Debet (MU) tidak boleh kosong. Proses Simpan dibatalkan', 'FrmPraBkk');
                        return;
                    }, 1000);
                    throw exitCode;
                }
                // console.log('isDebetEmpty', isDebetEmpty);
                const modifiedDetailJurnal: any = detailState.map((item: any, index: number) => {
                    const { no_akun, nama_akun, nama_relasi, nama_dept, nama_kry, nama_jual, ...value } = item;
                    return {
                        ...value,
                        kode_dokumen: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.masterKodeDokumen : '',
                        dokumen: 'BK',
                        tgl_dokumen: dataListMutasibank === 'Y' ? moment(headerState?.tgl_dokumen).format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen,
                        kode_akun: value.kode_akun,
                        kode_subledger: value.kode_subledger,
                        kurs: headerState?.kurs,

                        debet_rp: value.jumlah_mu < 0 ? 0 : value.jumlah_mu * value.kurs,
                        kredit_rp: value.jumlah_mu < 0 ? (value.jumlah_mu / value.kurs) * -1 : 0,
                        jumlah_rp: value.jumlah_mu < 0 ? (value.jumlah_mu / value.kurs) * 1 : value.jumlah_mu * value.kurs,
                        jumlah_mu: value.jumlah_mu < 0 ? (value.jumlah_mu / value.kurs) * 1 : value.jumlah_mu * value.kurs,

                        catatan: value.catatan,
                        no_warkat: null,
                        tgl_valuta: dataListMutasibank === 'Y' ? moment(headerState?.tgl_dokumen).format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen, //headerState?.tgl_dokumen,
                        persen: 0,
                        kode_dept: value.kode_dept,
                        kode_kerja: null,
                        approval: 'N',
                        posting: 'N',
                        rekonsiliasi: dataListMutasibank === 'Y' ? (headerState?.api_id > 0 ? 'Y' : 'N') : 'Y',
                        tgl_rekonsil: dataListMutasibank === 'Y' ? (headerState?.api_id > 0 ? headerState?.tgl_dokumen : null) : updatedTglJamDokumen,
                        userid: stateDokumen?.userid.toUpperCase(),
                        tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                        audit: null,
                        kode_kry: value.kode_kry,
                        kode_jual: value.kode_jual,
                        no_kontrak_um: null,
                    };
                });

                const modifiedDetailkredit = {
                    ...(stateDokumen?.setMasterDataState === 'EDIT' && { kode_dokumen: stateDokumen?.masterKodeDokumen }),
                    kode_dokumen: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.masterKodeDokumen : '',
                    id_dokumen: 1,
                    dokumen: 'BK',
                    tgl_dokumen: dataListMutasibank === 'Y' ? moment(headerState?.tgl_dokumen).format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen, // headerState?.tgl_dokumen,
                    kode_akun: headerState?.kode_akun_kredit,
                    kode_subledger: headerState?.kode_supp !== '' ? headerState?.kode_supp : '',
                    kurs: formatNumber(headerState?.kurs),
                    debet_rp: 0,
                    kredit_rp: headerState?.jumlah_mu,
                    jumlah_rp: headerState?.jumlah_mu * -1,
                    jumlah_mu: headerState?.jumlah_mu * -1,
                    catatan: headerState?.catatan,
                    no_warkat: headerState?.no_warkat,
                    tgl_valuta: dataListMutasibank === 'Y' ? moment(headerState?.tgl_dokumen).format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen, //headerState?.tgl_dokumen,
                    persen: 0,
                    kode_dept: null,
                    kode_kerja: null,
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: dataListMutasibank === 'Y' ? (headerState?.api_id > 0 ? 'Y' : 'N') : 'Y',
                    tgl_rekonsil: dataListMutasibank === 'Y' ? (headerState?.api_id > 0 ? headerState?.tgl_dokumen : null) : updatedTglJamDokumen,
                    userid: stateDokumen?.userid.toUpperCase(),
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: null,
                    kode_kry: null,
                    kode_jual: null,
                    no_kontrak_um: null,
                    // no_akun: '',
                    // nama_akun: '',
                    // tipe: '',
                    // kode_mu: '',
                    // no_kerja: '',
                    // nama_dept: '',
                    // nama_kry: '',
                    // no_subledger: '',
                    // nama_subledger: '',
                    // subledger: '',
                    // isledger: '',
                    // limit_bkk: '',
                };
                let noDok =
                    stateDokumen?.masterDataState === 'EDIT'
                        ? headerState?.no_dokumen
                        : await generateNU(
                              stateDokumen?.kode_entitas,
                              '',
                              '16',
                              dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                          );
                const reqBody = {
                    entitas: stateDokumen?.kode_entitas,
                    param2: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.jenisTab : '',
                    kode_dokumen: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.masterKodeDokumen : '',
                    dokumen: 'BK',
                    no_dokumen: noDok,
                    tgl_dokumen: dataListMutasibank === 'Y' ? moment(headerState?.tgl_dokumen).format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen,
                    no_warkat: null,
                    tgl_valuta: null,
                    kode_cust: null,
                    kode_akun_debet: null,
                    kode_supp: headerState?.kode_supp,
                    kode_akun_kredit: headerState?.kode_akun_kredit,
                    kode_akun_diskon: null,
                    kurs: headerState?.kurs,
                    // debet_rp: parseFloat(tanpaKoma(headerState?.jumlah_mu)),
                    // kredit_rp: parseFloat(tanpaKoma(headerState?.jumlah_mu)),
                    // jumlah_rp: parseFloat(tanpaKoma(headerState?.jumlah_mu)),
                    // jumlah_mu: parseFloat(tanpaKoma(headerState?.jumlah_mu)),
                    debet_rp: headerState?.debet_rp,
                    kredit_rp: headerState?.kredit_rp,
                    jumlah_rp: headerState?.jumlah_mu,
                    jumlah_mu: headerState?.jumlah_mu,
                    pajak: 'N',
                    kosong: null,
                    kepada: headerState?.kepada,
                    catatan: headerState?.catatan,
                    status: 'Terbuka',
                    userid: headerState?.userid.toUpperCase(),
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    status_approved: null,
                    tgl_approved: null,
                    tgl_pengakuan: null,
                    no_TTP: null,
                    tgl_TTP: null,
                    kode_sales: null,
                    nama_sales: null,
                    kode_fk: headerState?.kode_fk ? headerState?.kode_fk : null,
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
                    tgl_trxdokumen: moment(headerState?.tgl_trxdokumen).format('YYYY-MM-DD HH:mm:ss'),
                    api_id: dataListMutasibank === 'Y' ? 0 : dataListMutasibank?.apiId,
                    api_pending: dataListMutasibank === 'Y' ? null : dataListMutasibank?.apiPending,
                    api_catatan: dataListMutasibank === 'Y' ? null : dataListMutasibank?.description,
                    api_norek: dataListMutasibank === 'Y' ? '' : dataListMutasibank?.noRekeningApi,
                    kode_aktiva: null,
                    kode_rpe: null,
                    kode_phe: null,
                    kode_rps: null,
                    kode_um: null,
                    no_kontrak_um: null,
                    bm_pos: 'N',
                    isEntitasPajak: pajak ? 'Y' : 'N',
                    jurnal: [modifiedDetailkredit, ...modifiedDetailJurnal],
                };
                // console.log(reqBody, 'reqBody');

                // console.log('modifiedDetailkredit ', modifiedDetailkredit);
                // console.log('modifiedDetailJurnal ', modifiedDetailJurnal);

                //===========TES UPLOAD========================
                // console.log(reqBody, 'req Body');
                // handleUpload(
                //     // responseAPI.data.kode_dokumen,
                //     'tesKode',
                //     imageState,
                //     stateDokumen?.kode_entitas,
                //     stateDokumen?.masterDataState,
                //     stateDokumen?.masterKodeDokumen,
                //     upload1,
                //     upload2,
                //     upload3,
                //     upload4,
                //     jsonImageEdit
                // );
                //===========END TES UPLOAD====================

                // throw exitCode;

                // await handleUpload(
                //     // responseAPI.data.data.kode_dokumen,
                //     'BK0000002597',
                //     imageState,
                //     stateDokumen?.kode_entitas,
                //     stateDokumen?.masterDataState,
                //     // responseAPI.data.kode_dokumen, //stateDokumen?.masterKodeDokumen,
                //     'BK0000002597', //stateDokumen?.masterKodeDokumen,
                //     upload1,
                //     upload2,
                //     upload3,
                //     upload4,
                //     jsonImageEdit
                // );

                try {
                    let responseAPI: any;
                    let resultUpdateImage: any;
                    // console.log('stateDokumen?.masterDataState,', stateDokumen?.masterDataState);
                    // console.log('stateDokumen?.CON_BKK,', stateDokumen?.CON_BKK);
                    if (stateDokumen?.masterDataState === 'BARU') {
                        setLoadingMessage('simpan dokumen baru...');
                        setProgressValue(40);

                        let noDokBaru: any;

                        const cekData = await cekDataDiDatabase(
                            stateDokumen?.kode_entitas,
                            dataListMutasibank === 'Y' ? 'tb_m_keuangan_master' : 'tb_m_keuangan',
                            'no_dokumen',
                            reqBody.no_dokumen,
                            stateDokumen?.token
                        );

                        if (cekData) {
                            const cekNoDok = await cekNoDokTerakhir(
                                stateDokumen?.kode_entitas,
                                dataListMutasibank === 'Y' ? 'tb_m_keuangan_master' : 'tb_m_keuangan',
                                'BK',
                                '0',
                                '',
                                stateDokumen?.token
                            );

                            if (cekNoDok.length > 0) {
                                await generateNU(
                                    stateDokumen?.kode_entitas,
                                    cekNoDok[0].strnum,
                                    '16',
                                    dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                                );

                                noDokBaru = await generateNU(
                                    stateDokumen?.kode_entitas,
                                    '',
                                    '16',
                                    dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                                );

                                // console.log('cekNoDok[0].strnum', cekNoDok[0].strnum);
                                // console.log('noDokBaru', noDokBaru);
                                reqBody.no_dokumen = noDokBaru;
                            }

                            // const cekNoDok = await cekNoDokTerakhir(stateDokumen?.kode_entitas, 'tb_m_keuangan_master', 'BK', '0', '', stateDokumen?.token);

                            // if (cekNoDok) {
                            //     noDokBaru = await generateNU(
                            //         stateDokumen?.kode_entitas,
                            //         cekNoDok.strnum,
                            //         '16',
                            //         dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                            //     );

                            //     reqBody.no_dokumen = noDokBaru;
                            // }
                        }

                        if (dataListMutasibank === 'Y') {
                            responseAPI = await axios.post(`${apiUrl}/erp/simpan_bk`, reqBody, {
                                headers: {
                                    Authorization: `Bearer ${stateDokumen?.token}`,
                                },
                            });
                        } else {
                            responseAPI = await axios.post(`${apiUrl}/erp/simpan_bm_mutasi_bank`, reqBody, {
                                headers: { Authorization: `Bearer ${stateDokumen?.token}` },
                            });
                        }

                        // if (responseAPI?.data.status === true && cekData) {
                        //     await generateNU(
                        //         stateDokumen?.kode_entitas,
                        //         noDokBaru,
                        //         '16',
                        //         dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                        //     );
                        // }
                    } else if (stateDokumen?.CON_BKK === 'BKK') {
                        setLoadingMessage('update dokumen...');
                        setProgressValue(40);
                        responseAPI = await axios.patch(`${apiUrl}/erp/update_bk`, reqBody, {
                            headers: {
                                Authorization: `Bearer ${stateDokumen?.token}`,
                            },
                        });
                    } else if (stateDokumen?.CON_BKK === 'APPROVE_ORI') {
                        // console.log('masuk sini  approve');
                        let noDokApprove: any;

                        const cekData = await cekDataDiDatabase(stateDokumen?.kode_entitas, 'tb_m_keuangan', 'no_dokumen', reqBody.no_dokumen, stateDokumen?.token);

                        if (cekData) {
                            const cekNoDok = await cekNoDokTerakhir(stateDokumen?.kode_entitas, 'tb_m_keuangan_master', 'BK', '0', '', stateDokumen?.token);

                            if (cekNoDok.length > 0) {
                                await generateNU(
                                    stateDokumen?.kode_entitas,
                                    cekNoDok[0].strnum,
                                    '16',
                                    dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                                );

                                noDokApprove = await generateNU(
                                    stateDokumen?.kode_entitas,
                                    '',
                                    '16',
                                    dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                                );

                                reqBody.no_dokumen = noDokApprove;
                            }
                        }

                        setLoadingMessage('approve dokumen...');
                        setProgressValue(40);

                        // console.log('reqBody Approved', reqBody);

                        responseAPI = await axios.post(`${apiUrl}/erp/approval_pengeluaran_lain_bk`, reqBody, {
                            headers: {
                                Authorization: `Bearer ${stateDokumen?.token}`,
                            },
                        });

                        // if (responseAPI?.data.status === true && cekData) {
                        //     await generateNU(
                        //         stateDokumen?.kode_entitas,
                        //         noDokApprove,
                        //         '16',
                        //         dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                        //     );
                        // }

                        // } catch (error) {
                        // clearInterval(interval);
                        // setIsLoadingProgress(false);
                        // setProgressValue(0);
                        // throw exitCode;
                        // }

                        // console.log('responseAPI ', responseAPI);
                    } else if (stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI') {
                        // console.log('stateDokumen?.masterKodeDokumen,', stateDokumen?.masterKodeDokumen);
                        // console.log('stateDokumen?.masterDataState,', stateDokumen?.masterDataState);
                        // console.log('responseAPI ', responseAPI);
                        setLoadingMessage('update file pendukung...');
                        setProgressValue(40);
                        resultUpdateImage = await handleUpload(
                            stateDokumen?.masterKodeDokumen,
                            imageState,
                            stateDokumen?.kode_entitas,
                            stateDokumen?.masterDataState,
                            stateDokumen?.masterKodeDokumen,
                            upload1,
                            upload2,
                            upload3,
                            upload4,
                            jsonImageEdit
                        );

                        // console.log('resultUpdateImage', resultUpdateImage);
                    }

                    if (stateDokumen?.masterDataState === 'BARU' && responseAPI?.data.status === true) {
                        setLoadingMessage('generate no dokumen dan upload file pendukung...');
                        setProgressValue(60);
                        // await generateNU(stateDokumen?.kode_entitas, noDok, '16', moment().format('YYYYMM'));
                        await generateNU(
                            stateDokumen?.kode_entitas,
                            responseAPI?.data.data.no_dokumen,
                            '16',
                            dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                        );
                        await handleUpload(
                            responseAPI.data.kode_dokumen,
                            imageState,
                            stateDokumen?.kode_entitas,
                            stateDokumen?.masterDataState,
                            responseAPI.data.kode_dokumen, //stateDokumen?.masterKodeDokumen,
                            upload1,
                            upload2,
                            upload3,
                            upload4,
                            jsonImageEdit
                        );

                        setLoadingMessage('simpan audit trail...');
                        setProgressValue(80);
                        // myAlertGlobal('Input Data berhasil', 'FrmPraBkk');
                        const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                            entitas: stateDokumen?.kode_entitas,
                            kode_audit: null,
                            dokumen: 'BK',
                            kode_dokumen: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.masterKodeDokumen : responseAPI.data.data.kode_dokumen,
                            no_dokumen: headerState?.no_dokumen,
                            tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                            proses: 'BARU',
                            diskripsi: `Jurnal Umum nilai transaksi = ${headerState?.jumlah_mu}`,
                            userid: stateDokumen?.userid.toUpperCase(), // userid login web
                            system_user: '', //username login
                            system_ip: '', //ip address
                            system_mac: '', //mac address
                        });

                        withReactContent(swalToast).fire({
                            icon: 'success',
                            title: `<p style="font-size:12px">Input Data berhasil</p>`,
                            width: '100%',
                            target: '#FrmPraBkk',
                        });
                    } else if (stateDokumen?.masterDataState === 'EDIT') {
                        if (stateDokumen?.CON_BKK === 'BKK' && responseAPI?.data.status === true) {
                            setLoadingMessage('upload file pendukung...');
                            setProgressValue(60);
                            await handleUpload(
                                responseAPI.data.data.kode_dokumen,
                                imageState,
                                stateDokumen?.kode_entitas,
                                stateDokumen?.masterDataState,
                                stateDokumen?.masterKodeDokumen,
                                upload1,
                                upload2,
                                upload3,
                                upload4,
                                jsonImageEdit
                            );

                            setLoadingMessage('simpan audit trail...');
                            setProgressValue(80);

                            const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                                entitas: stateDokumen?.kode_entitas,
                                kode_audit: null,
                                dokumen: 'BK',
                                kode_dokumen: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.masterKodeDokumen : responseAPI.data.data.kode_dokumen,
                                no_dokumen: headerState?.no_dokumen,
                                tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                                proses: 'EDIT',
                                diskripsi: `Jurnal Umum nilai transaksi = ${headerState?.jumlah_mu}`,
                                userid: stateDokumen?.userid.toUpperCase(), // userid login web
                                system_user: '', //username login
                                system_ip: '', //ip address
                                system_mac: '', //mac address
                            });
                            withReactContent(swalToast).fire({
                                icon: 'success',
                                title: `<p style="font-size:12px">Edit Data berhasil</p>`,
                                width: '100%',
                                target: '#FrmPraBkk',
                            });
                        } else if (stateDokumen?.CON_BKK === 'APPROVE_ORI' && responseAPI?.data.status === true) {
                            setLoadingMessage('upload file pendukung...');
                            setProgressValue(60);
                            await generateNU(
                                stateDokumen?.kode_entitas,
                                responseAPI?.data.data.no_dokumen,
                                '16',
                                dataListMutasibank?.tipeApi === 'API' ? moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM') : moment().format('YYYYMM')
                            );
                            await handleUpload(
                                responseAPI.data.data.kode_dokumen,
                                imageState,
                                stateDokumen?.kode_entitas,
                                stateDokumen?.masterDataState,
                                stateDokumen?.masterKodeDokumen,
                                upload1,
                                upload2,
                                upload3,
                                upload4,
                                jsonImageEdit
                            );

                            setLoadingMessage('simpan audit trail...');
                            setProgressValue(80);
                            //AUDIT
                            const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                                entitas: stateDokumen?.kode_entitas,
                                kode_audit: null,
                                dokumen: 'BK',
                                kode_dokumen: stateDokumen?.masterDataState === 'EDIT' ? stateDokumen?.masterKodeDokumen : responseAPI.data.data.kode_dokumen,
                                no_dokumen: headerState?.no_dokumen,
                                tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                                // proses: stateDokumen?.masterDataState === 'EDIT' ? 'EDIT' : 'BARU',
                                proses: 'APPROVAL',
                                diskripsi: `Jurnal Umum nilai transaksi = ${headerState?.jumlah_mu}`,
                                userid: stateDokumen?.userid.toUpperCase(), // userid login web
                                system_user: '', //username login
                                system_ip: '', //ip address
                                system_mac: '', //mac address
                            });
                            withReactContent(swalToast).fire({
                                icon: 'success',
                                title: `<p style="font-size:12px">Approval Data berhasil</p>`,
                                width: '100%',
                                target: '#FrmPraBkk',
                            });
                        } else if ((stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI') && resultUpdateImage.status === true) {
                            setLoadingMessage('upload file pendukung...');
                            setProgressValue(80);
                            await myAlertGlobal('Upload File Pendukung Data berhasil', 'FrmPraBkk');
                            setTimeout(() => {
                                dialogClose();
                                onRefresh();
                            }, 1000);
                        }
                    }

                    setProgressValue(100);
                    clearInterval(interval);

                    setTimeout(() => {
                        dialogClose();
                        onRefresh();
                    }, 1000);
                } catch (error: any) {
                    // console.log(error.message);
                    // console.error('ErrorSaveDoc:', error);
                    myAlertGlobal(`Gagal Simpan - ErrorSaveDoc ${error}`, 'FrmPraBkk');
                    clearInterval(interval);
                    setIsLoadingProgress(false);
                    setProgressValue(0);
                }
            }
        } finally {
            // Reset loading state after a delay
            setTimeout(() => {
                setIsLoadingProgress(false);
                setProgressValue(0);
                setLoadingMessage('Initializing...');
                setDisabledSimpan(false);
            }, 1000);
        }
    };

    useEffect(() => {
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    useEffect(() => {
        if (progressValue > displayedProgress) {
            const timer = setTimeout(() => {
                setDisplayedProgress((prev) => Math.min(prev + 1, progressValue));
            }, 20); // Adjust this value to control animation speed
            return () => clearTimeout(timer);
        } else if (progressValue < displayedProgress) {
            setDisplayedProgress(progressValue);
        }
    }, [progressValue, displayedProgress]);
    // kalkulasi jurnal
    // const [totalDebet, setTotalDebet] = useState<any>(0);
    // const [inputValueJumlah_mu, setInputValueJumlah_mu] = useState<any>('');

    // const kalkulasiJurnal = () => {
    //     setInputValueJumlah_mu(headerState.jumlah_mu);
    //     const totalDebet = detailState.reduce((total: number, item: any) => {
    //         // Konversi kredit_rp ke number jika tidak null dan dapat dikonversi ke angka, jika tidak gunakan 0
    //         const debetRp = item.debet_rp !== null && !isNaN(Number(item.debet_rp)) ? Number(item.debet_rp) : 0;
    //         return total + debetRp;
    //     }, 0);
    //     setTotalDebet(totalDebet);
    // };

    // const resultSelisih = Number(formatNumber(inputValueJumlah_mu)) - totalDebet;
    const [totalDebet, setTotalDebet] = useState<any>(0);

    const handleHeaderDok = () => {
        let namaHeader;
        if (stateDokumen?.masterDataState === 'BARU') {
            namaHeader = 'Pengeluaran Lain (BARU) ';
        } else {
            if (stateDokumen?.CON_BKK === 'APPROVE_ORI' || stateDokumen?.CON_BKK === 'PREVIEW_ORI') {
                namaHeader = `Pengeluaran Lain (APPROVAL) : ${headerState?.no_dokumen} `;
            } else if (stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI') {
                namaHeader = `Update File Pendukung : ${headerState?.no_dokumen} `;
            } else if (stateDokumen?.CON_BKK === 'BKK' && stateDokumen?.jenisTab === 'Baru') {
                namaHeader = `Editing (Baru)  : ${headerState?.no_dokumen} `;
            } else if (stateDokumen?.CON_BKK === 'BKK' && stateDokumen?.jenisTab === 'Approved') {
                namaHeader = `Editing (Approved)  : ${headerState?.no_dokumen} `;
            }
        }
        return <div>{namaHeader}</div>;
    };

    return (
        <div>
            <DialogComponent
                id="FrmPraBkk"
                isModal={true}
                width="95%"
                height="65%"
                visible={isOpen}
                close={() => {
                    dialogClose();
                }}
                // header="Pengeluaran Lain"
                // header={stateDokumen?.masterDataState === 'BARU' ? 'Pengeluaran Lain ' : `Pengeluaran Lain (EDIT) : ${headerState?.no_dokumen} `}
                header={handleHeaderDok}
                showCloseIcon={true}
                target="#main-target"
                closeOnEscape={false}
                allowDragging={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                // style={{ maxHeight: '1800px' }}
                position={{ X: 'center', Y: 'top' }}
                resizeHandles={['All']}
                // enableResize={true}
            >
                <div style={{ minWidth: '100%', overflow: 'auto' }}>
                    <div>
                        {/* ===============  Master Header Data ========================   */}

                        <HeaderPraBkk
                            stateDokumen={stateDokumen}
                            isOpen={false}
                            onClose={onClose}
                            onRefresh={onRefresh}
                            objekHeader={headerState}
                            setobjekHeader={setHeaderState}
                            // stateDialog={stateDialog}
                            // setStateDialog={setStateDialog}
                            listAkunJurnalObjek={''}
                            fromBok={dariBok}
                            dataListMutasibank={dataListMutasibank}
                            onRefreshTipe={onRefreshTipe}
                        />

                        {/* =============== DATA DETAIL  ========================   */}
                        <DetailPraBkk
                            stateDokumen={stateDokumen}
                            isOpen={false}
                            onClose={onClose}
                            onRefresh={onRefresh}
                            objekDetail={detailState}
                            setobjekDetail={setDetailState}
                            objekImage={imageState}
                            stateObjekImage={setImageState}
                            dataUploadRef={(dataObjek: any) => handleAmbilDataUpload(dataObjek)}
                            setTipeRequest={(dataObjek: any) => {
                                // console.log(dataObjek);
                                setTag(dataObjek ?? false);
                            }}
                            listAkunJurnalObjek={''}
                            objekHeader={headerState}
                            setObjekHeader={setHeaderState}
                            headerKeuanganJumlahRp={(headerKeuanganJumlahRp: any) => {
                                setTotalDebet(headerKeuanganJumlahRp);
                            }}
                            isFilePendukungBk={isFilePendukungBk}
                        />
                        {/* </div> */}
                        {isLoadingProgress && (
                            // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            //     <div className="rounded-lg bg-white p-6 shadow-lg">
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                {progressValue > 0 && <div className="absolute inset-0 bg-black opacity-20" style={{ pointerEvents: 'auto' }} />}
                                <div className="rounded-lg bg-white p-6 shadow-lg">
                                    {/* <div className="mb-4 text-center text-lg font-semibold">Loading Data...{tabs[selectedIndex].id}</div> */}
                                    <div className="mb-4 text-center text-lg font-semibold">{loadingMessage}</div>
                                    <div className="flex justify-center">
                                        {progressValue > 0 && (
                                            <div className="relative">
                                                <ProgressBarComponent
                                                    id="circular-progress"
                                                    type="Circular"
                                                    height="160px"
                                                    width="160px"
                                                    trackThickness={15}
                                                    progressThickness={15}
                                                    cornerRadius="Round"
                                                    trackColor="#f3f3f3"
                                                    progressColor="#3b3f5c"
                                                    animation={{
                                                        enable: true,
                                                        duration: 2000, // Match this with the total time of the counter animation
                                                        delay: 0,
                                                    }}
                                                    value={progressValue}
                                                >
                                                    <Inject services={[ProgressAnnotation]} />
                                                </ProgressBarComponent>
                                                <div className="absolute left-0 right-0 top-0 flex h-full items-center justify-center">
                                                    <div className="text-center">
                                                        <span className="text-2xl font-bold">{`${displayedProgress}%`}</span>
                                                        <div className="text-sm text-gray-500">Complete</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
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
                            <div className="flex justify-between">
                                <div className="ml-5 grid w-[60%] grid-cols-6 gap-2">
                                    <div className="col-span-3">
                                        <div className="mt-1 flex items-center justify-start gap-2">
                                            <p className="set-font-11 whitespace-nowrap">
                                                <b>No. Bukti BOK :</b>
                                            </p>
                                            <div className="form-input">
                                                <TextBoxComponent
                                                    // created={'onCreateMultiline'}
                                                    value={headerState?.no_fk}
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        setShowDialogBok(true);
                                                        // HandelCatatan(value, setCatatanValue);
                                                        // HandelCatatan(value, setquMMKketerangan);
                                                    }}
                                                />
                                            </div>
                                            <div style={{ width: '5%', display: 'flex', alignItems: 'center' }}>
                                                <FontAwesomeIcon
                                                    icon={faSearch}
                                                    onClick={() => {
                                                        vRefreshData.current += 1;
                                                        setShowDialogBok(true);
                                                    }}
                                                    className="ml-2"
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className={styles['grid-rightNote']}>
                                            <div style={{ float: 'right' }}>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ paddingRight: '10px', fontSize: 11 }}>
                                                                <b>Total Db/Kr :</b>
                                                            </td>
                                                            {/* selisih = TotDebet - TotKredit; */}
                                                            <td style={{ fontSize: 11 }}>
                                                                {/* <b>{frmNumber(totalDebet)}</b> */}
                                                                {/* <b>{inputValueJumlah_mu ? inputValueJumlah_mu : '0.00'}</b> */}
                                                                <b>{frmNumber(headerState?.debet_rp) ? frmNumber(headerState?.debet_rp) : '0.00'}</b>
                                                            </td>
                                                            <td style={{ fontSize: 11 }}>
                                                                <b>{frmNumber(headerState?.kredit_rp) ? frmNumber(headerState?.kredit_rp) : '0.00'}</b>
                                                                {/* <b>{frmNumber(totalDebet)}</b> */}
                                                            </td>
                                                            {/* {JSON.stringify(headerState.kredit_rp)} */}
                                                        </tr>
                                                        <tr>
                                                            <td style={{ paddingRight: '10px', fontSize: 11 }}>
                                                                <b>Selisih :</b>
                                                            </td>
                                                            <td style={{ fontSize: 11 }}>
                                                                <b>{frmNumber(headerState?.selisih)}</b>
                                                                {/* <b>{frmNumber(resultSelisih)}</b> */}
                                                                {/* <b>0 :</b> */}
                                                                {/* <b>{frmNumber(totalDebit - totalKredit)}</b> */}
                                                                {/* <b>{frmNumber(selisih)}</b> */}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="w-[40%]"> */}
                                <div className={`w-[40%] p-4 ${isLoadingProgress ? 'pointer-events-none' : ''}`}>
                                    <ButtonComponent
                                        id="buBatalDokumen1"
                                        content="Batal"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-close"
                                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c' }}
                                        onClick={() => onClose()}
                                        disabled={disabledSimpan}
                                    />
                                    <ButtonComponent
                                        id="buSimpanDokumen1"
                                        content="Simpan"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-save"
                                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                        // onClick={() => validate()}
                                        onClick={async () => {
                                            // setTag('1');
                                            await saveDoc();
                                        }}
                                        disabled={disabledSimpan}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogComponent>
            {showDateValidationModal && (
                <DialogComponent
                    visible={true}
                    style={{ position: 'fixed' }}
                    isModal={true}
                    allowDragging={true}
                    header="Konfirmasi"
                    // content="Tanggal lebih kecil dari hari ini."
                    showCloseIcon={false}
                    width="400px"
                    position={{ X: 'center', Y: 'center' }}
                    // cssClass="custom-dialog"
                    // style={{ marginTop: '-20px' }}
                    buttons={[
                        {
                            buttonModel: {
                                content: 'Ya', // Button text
                                isPrimary: true, // Optional: to highlight the button
                            },
                            click: handleConfirm,
                        },
                        {
                            buttonModel: {
                                content: 'Batal', // Button text
                            },
                            click: handleCancel,
                        },
                    ]}
                >
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="fa-xs w-12" style={{ color: 'orange', marginRight: '8px' }} />
                        Tanggal yang Anda masukkan lebih kecil dari hari ini. Lanjutkan ?
                    </div>
                </DialogComponent>
            )}
            {showDialogBok && (
                <FrmBOKDlg
                    stateDokumen={stateDokumen}
                    kode_entitas={stateDokumen?.kode_entitas}
                    isOpen={showDialogBok}
                    onClose={() => {
                        setShowDialogBok(false);
                    }}
                    onBatal={() => {
                        setShowDialogBok(false);
                    }}
                    selectedData={(dataObject: any) => handleSelectedDialogBok(dataObject)}
                    target={'FrmPraBkk'}
                    kodeAkun={''}
                    vRefreshData={vRefreshData.current}
                />
            )}
        </div>
    );
};

export default FrmPraBkk;
