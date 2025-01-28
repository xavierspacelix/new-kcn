import React, { use, useCallback, useRef } from 'react';
import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import styles from './styling.module.css';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { frmNumber, generateNU, FillFromSQL } from '@/utils/routines';
import { useState, useEffect } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import Image from 'next/image';
import axios from 'axios';
import { L10n } from '@syncfusion/ej2-base';
import idIDLocalization from 'public/syncfusion/locale.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faList } from '@fortawesome/free-solid-svg-icons';
import { resWord, resExcel, resZip, resUnknow, resPdf } from './resource';
import JSZip from 'jszip';
import { DaftarAkunDebet } from '../../ppi/model/apiPpi';
import { GetListTabNoRek } from '@/lib/fa/mutasi-bank/api/api';
import { cekSaldoValid } from '../api';
import { swalDialog } from '@/lib/fa/mutasi-bank/functional/fungsiForm';
import { CekTglBackDate } from '../../ppi/functional/fungsiFormPpiList';
import { cekDataDiDatabase, cekNoDokTerakhir, isEntitasPajak } from '@/utils/global/fungsi';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';

L10n.load(idIDLocalization);

interface DialogBMList {
    userid: string;
    kode_entitas: any;
    isOpen: boolean;
    onClose: () => void;
    kode_user: any;
    kode_bm: any;
    statusPage: any;
    selectedRowStatus: any;
    onRefresh: any;
    isFilePendukung: any;
    isApprovedData: any;
    token: any;
    dataListMutasibank: any;
    onRefreshTipe: any;
    gridList?: any;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

let gridDaftarSubledgerCustomer: Grid | any;
let gridDaftarSubledgerSupplier: Grid | any;
let gridDaftarSubledgerIsLedgerY: Grid | any;
let gridDaftarAkunHeader: Grid | any;
let gridDaftarAkunDetail: Grid | any;
let gridAlokasiDana: Grid | any;
let gridDaftarKaryawan: Grid | any;
let gridDaftarDepartmen: Grid | any;

const DialogBMList: React.FC<DialogBMList> = ({
    userid,
    kode_entitas,
    isOpen,
    onClose,
    kode_user,
    kode_bm,
    statusPage,
    selectedRowStatus,
    onRefresh,
    isFilePendukung,
    isApprovedData,
    token,
    dataListMutasibank,
    onRefreshTipe,
    gridList,
}) => {
    // data Header dari MUTASI API
    // console.log('dataListMutasibank = ', dataListMutasibank);
    const [noAkunAPi, setNoAkunApi] = React.useState('');
    const [namaAkunAPi, setNamaAkun] = React.useState('');
    // handle jumlah mu
    const [inputValueJumlah_mu, setInputValueJumlah_mu] = useState<any>('');
    const [outputWordsJumlah_mu, setOutputWordsJumlah_mu] = useState('');

    const [date1, setDate1] = useState<any>(moment());
    const [date2, setDate2] = useState<any>(moment());

    const [noAkunValueHeader, setNoAkunValueHeader] = useState<string>('');
    const [namaAkunValueHeader, setNamaAkunValueHeader] = useState<string>('');
    const [kursHeader, setKursHeader] = useState<any>('');
    const [apiCatatan, setApiCatatan] = useState<string>('');
    const [saldoBalance, setSaldoBalance] = useState('');
    const [noTTP, setNoTTP] = useState('');
    const [kodeSales, setKodeSales] = useState('');

    // kalkulasi jurnal
    const [totalKredit, setTotalKredit] = useState<any>(0);
    const [totalDebet, setTotalDebet] = useState<any>(0);
    const [selisih, setSelisih] = useState<number>(0);

    const vRefreshData = useRef(0);
    const gridJurnalHeaderList = useRef<GridComponent>(null);
    const gridDaftarSubledgerCustomerJurnal = useRef<GridComponent>(null);
    const gridDaftarJurnalDetailList = useRef<GridComponent>(null);

    const [dataJurnalHeader, setDataJurnalHeader] = useState<any>('');
    const [dataJurnalforSaveDoc, setDataJurnalforSaveDoc] = useState<any>('');
    const [selectedSubledgerAllDataHeader, setSelectedSubledgerAllDataHeader] = useState<any>('');
    const [selectedkode_Subledger, setSelectedKode_Subledger] = useState<any>('');
    const [selectedSubledgerNamaRelasi, setSelectedSubledgerNamaRelasi] = useState<any>('');

    const [showModalBackdate, setShowModalBackdate] = useState(false);
    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();

    React.useEffect(() => {
        const async = async () => {
            if (dataListMutasibank?.tipeApi === 'API') {
                const tglJamDokumen = moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYY-MM-DD HH:mm:ss');

                const updatedTglJamDokumen = moment(tglJamDokumen)
                    .set({
                        hour: moment().hour(),
                        minute: moment().minute(),
                        second: moment().second(),
                    })
                    .format('YYYY-MM-DD HH:mm:ss');

                const respListTabNoRek = await GetListTabNoRek(kode_entitas, token);
                const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === dataListMutasibank?.noRekeningApi);

                const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
                const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0].kode_akun);
                setNoAkunApi(respDaftarAkunKreditFix[0].no_akun);
                setNamaAkun(respDaftarAkunKreditFix[0].nama_akun);
                // masukan State untuk simpan data
                setInputValueJumlah_mu(String(dataListMutasibank?.jumlahMu));
                setDate2(moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYY-MM-DD'));
                setNoAkunValueHeader(respDaftarAkunKreditFix[0].no_akun);
                setNamaAkunValueHeader(respDaftarAkunKreditFix[0].nama_akun);
                setKursHeader(1);
                setSelisih(dataListMutasibank?.jumlahMu);
                setApiCatatan(dataListMutasibank?.description);
                setDataJurnalHeader({ kode_akun: respDaftarAkunKreditFix[0].kode_akun });
                const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
                    params: {
                        entitas: kode_entitas,
                        param1: 'SQLAkunKas',
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responSaldobalance = response.data.data.filter((data: any) => data.no_akun === respDaftarAkunKreditFix[0].no_akun);
                setSaldoBalance(responSaldobalance[0].balance);
                //END

                // Create JURNAL
                setSelectedSubledgerAllDataHeader('');
                setSelectedKode_Subledger('');
                setSelectedSubledgerNamaRelasi('');

                const jurnalHeader = {
                    ...(statusPage === 'EDIT' && { kode_dokumen: kode_bm }),
                    id_dokumen: 1,
                    dokumen: 'BM',
                    tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                    kode_akun: respDaftarAkunKreditFix[0].kode_akun,
                    kode_subledger: selectedkode_Subledger,
                    kurs: 1,
                    no_akun: respDaftarAkunKreditFix[0].no_akun,
                    nama_akun: respDaftarAkunKreditFix[0].nama_akun,
                    debet_rp: formatNumber(String(dataListMutasibank?.jumlahMu)),
                    kredit_rp: 0,
                    nilai_mu: 0,
                    jumlah_rp: formatNumber(String(dataListMutasibank?.jumlahMu)),
                    jumlah_mu: formatNumber(String(dataListMutasibank?.jumlahMu)),
                    catatan: keterangan,
                    no_warkat: null,
                    tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                    persen: 0,
                    nama_relasi: null,
                    kode_dept: null,
                    kode_kerja: null,
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'Y',
                    tgl_rekonsil: updatedTglJamDokumen,
                    userid: userid.toUpperCase(),
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: null,
                    kode_kry: null,
                    kode_jual: null,
                    no_kontrak_um: '',
                };
                console.log('setDataJurnalforSaveDoc = ', jurnalHeader);

                setDataJurnalforSaveDoc(jurnalHeader);
                setModalDaftarAkunHeader(false);
            }
        };
        async();
        // console.log(noAkunAPi);
    }, [onRefreshTipe, vRefreshData.current]);
    //
    const [isButtonDisabled, setIsButtonDisabled] = useState<any>(false);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (isFilePendukung === 'Y') {
            setIsButtonDisabled(true);
        } else {
            setIsButtonDisabled(false);
        }
    }, [isFilePendukung]);

    // mnoBM
    const [mNoBM, mSetNoBM] = useState('');
    const [resultNoBM, setResultNoBM] = useState('');
    const [terimaDari, setTerimaDari] = useState('');
    const [keterangan, setKeterangan] = useState('');
    const [inputJumlahDebet, setInputJumlahDebet] = useState<any>(null);
    const [tgl, setTgl] = useState('');
    const [noBukti, setNoBukti] = useState('');

    const handleTerima = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerimaDari(e.target.value);
    };

    const handleKeterangan = (e: any) => {
        const newValue = e;
        setKeterangan(newValue);

        // Update catatan in the grid data source
        if (modalAkunSource === 'header') {
            // Update in header data
            const updatedJurnalHeader = {
                ...dataJurnalforSaveDoc,
                catatan: newValue,
            };
            setDataJurnalforSaveDoc(updatedJurnalHeader);
        } else if (modalAkunSource === 'detail') {
            if (selectedRowIndex !== undefined && gridAlokasiDana.dataSource[selectedRowIndex]) {
                gridAlokasiDana.dataSource[selectedRowIndex].catatan = newValue;
                gridAlokasiDana.refresh();
            }
        }
    };

    const handleCreate = async () => {
        const result = await generateNU(kode_entitas, '', '17', dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM'));
        if (result) {
            mSetNoBM(result);
        } else {
            console.error('undefined');
        }
    };

    const handleEdit = async () => {
        const response = await axios.get(`${apiUrl}/erp/master_detail_jurnal_debet_pemasukkan_lain_bm?entitas=${kode_entitas}&param1=${kode_bm}&param2=${selectedRowStatus}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { master, detail, debet } = response.data.data;

        if (master.length > 0) {
            const dataMaster = master[0];
            const kursHeader = parseInt(dataMaster.kurs, 10);
            mSetNoBM(dataMaster.no_dokumen);
            setTerimaDari(dataMaster.kepada);
            setKeterangan(dataMaster.catatan);
            setNoTTP(dataMaster.no_TTP);
            setKodeSales(dataMaster.kode_sales);

            setSelectedSubledgerAllDataHeader((prevState: any) => ({
                ...prevState,
                kode_subledger: dataMaster.kode_cust,
            }));

            setDataJurnalHeader((prevState: any) => ({
                ...prevState,
                kode_akun: dataMaster.kode_akun_debet,
            }));

            setSelectedJurnalHeader((prevState: any) => ({
                ...prevState,
                balance: dataMaster.balance,
            }));

            const formattedJumlah_mu = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
            }).format(dataMaster.jumlah_mu);

            const formattedJumlahDebet = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
            }).format(dataMaster.debet_rp);

            setNoBukti(dataMaster.no_dokumen);
            setTgl(dataMaster.tgl_dokumen);
            setInputJumlahDebet(formattedJumlahDebet);
            setInputValueJumlah_mu(formattedJumlah_mu);
            setNoAkunValueHeader(dataMaster.no_akun);
            setNamaAkunValueHeader(dataMaster.nama_akun);
            setSelectedSubledgerNamaRelasi(dataMaster.subledger);
            setKursHeader(kursHeader);
            setApiCatatan(dataMaster.api_catatan);
            setDate2(moment(dataMaster.tgl_dokumen, 'YYYY-MM-DD HH:mm:ss'));
            setDate1(moment(dataMaster.tgl_trxdokumen, 'YYYY-MM-DD HH:mm:ss'));
        }
        if (debet.length > 0) {
            const mappedAlokasiDanaHeader = debet.map((item: any) => ({
                kode_dokumen: item.kode_dokumen,
                id_dokumen: item.id_dokumen,
                dokumen: item.dokumen,
                tgl_dokumen: item.tgl_dokumen,
                kode_akun: item.kode_akun,
                kode_subledger: item.kode_subledger,
                kurs: item.kurs,
                tipe: item.tipe,
                no_warkat: item.no_warkat,
                tgl_valuta: item.tgl_valuta,
                persen: item.persen,
                kode_dept: item.kode_dept,
                kode_kerja: item.kode_kerja,
                approval: item.approval,
                posting: item.posting,
                rekonsiliasi: item.rekonsiliasi,
                tgl_rekonsil: item.tgl_rekonsil,
                userid: item.userid,
                tgl_update: item.tgl_update,
                audit: item.audit,
                kode_kry: item.kode_kry,
                kode_jual: item.kode_jual,
                no_kontrak_um: item.no_kontrak_um,
                no_akun: item.no_akun,
                nama_akun: item.nama_akun,
                kredit_rp: item.kredit_rp,
                nilai_mu: item.nilai_mu,
                Keterangan: item.catatan,
                nama_relasi: item.subledger,
                department: item.nama_dept,
                nama_karyawan: item.nama_kry,
                divisi_penjualan: item.kode_jual,
                nama_dept: item.nama_dept,
                nama_kry: item.nama_kry,
            }));
            const dataJurnalforSaveDoc = mappedAlokasiDanaHeader.length > 0 ? mappedAlokasiDanaHeader[0] : null;
            setDataJurnalforSaveDoc(dataJurnalforSaveDoc);
        }

        if (detail.length > 0) {
            const mappedAlokasiDanaDetail = detail.map((item: any) => ({
                kode_dokumen: item.kode_dokumen,
                id_dokumen: item.id_dokumen,
                dokumen: item.dokumen,
                tgl_dokumen: item.tgl_dokumen,
                kode_akun: item.kode_akun,
                kode_subledger: item.kode_subledger,
                kurs: item.kurs,
                tipe: item.tipe,
                debet_rp: item.debet_rp,
                jumlah_rp: item.jumlah_rp,
                jumlah_mu: item.jumlah_mu,
                catatan: item.catatan,
                no_warkat: item.no_warkat,
                tgl_valuta: item.tgl_valuta,
                persen: item.persen,
                kode_dept: item.kode_dept,
                kode_kerja: item.kode_kerja,
                approval: item.approval,
                posting: item.posting,
                rekonsiliasi: item.rekonsiliasi,
                tgl_rekonsil: item.tgl_rekonsil,
                userid: item.userid,
                tgl_update: item.tgl_update,
                audit: item.audit,
                kode_kry: item.kode_kry,
                kode_jual: item.kode_jual,
                no_kontrak_um: item.no_kontrak_um,
                no_akun: item.no_akun,
                nama_akun: item.nama_akun,
                kredit_rp: item.kredit_rp,
                nilai_mu: item.nilai_mu,
                Keterangan: item.catatan,
                nama_relasi: item.subledger,
                department: item.nama_dept,
                nama_karyawan: item.nama_kry,
                divisi_penjualan: item.kode_jual,
                nama_dept: item.nama_dept,
                nama_kry: item.nama_kry,
            }));
            gridAlokasiDana.dataSource = mappedAlokasiDanaDetail;
        } else {
            console.log('gagal');
        }
    };

    const fetchData = async () => {
        try {
            if (statusPage === 'CREATE') {
                handleCreate();
            } else if (statusPage === 'EDIT') {
                handleEdit();
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusPage, kode_entitas, kode_user, kode_bm]);

    // ***// END DETAIL BM //***//

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

    const dialogClose = () => {
        if (gridAlokasiDana && gridAlokasiDana.dataSource) {
            gridAlokasiDana.dataSource.splice(0, gridAlokasiDana.dataSource.length);
        }
        setDate1(moment());
        setDate2(moment());
        onClose();
    };

    ////////////////////////
    // Daftar Akun Jurnal //
    ////////////////////////

    const [modalDaftarAkunHeader, setModalDaftarAkunHeader] = useState(false);
    const [modalDaftarAkunDetail, setModalDaftarAkunDetail] = useState(false);
    const [modalAkunSource, setModalAkunSource] = useState('');
    const [modalSubledgerSource, setModalSubledgerSource] = useState('');

    const [searchNoAkunJurnalHeader, setSearchNoakunJurnalHeader] = useState('');
    const [searchNamaAkunJurnalHeader, setSearchNamaAkunJurnalHeader] = useState('');

    const [searchNoAkunJurnalDetail, setSearchNoakunJurnalDetail] = useState('');
    const [searchNamaAkunJurnalDetail, setSearchNamaAkunJurnalDetail] = useState('');

    const [selectedJurnalHeader, setSelectedJurnalHeader] = useState<any>('');
    const [selectedJurnalDetail, setSelectedJurnalDetail] = useState<any>('');
    const [selectedSubledgerHeader, setSelectedSubledgerHeader] = useState<any>('');

    const [listDaftarAkunHeader, setDaftarAkunHeader] = useState([]);
    const [listDaftarAkunDetail, setDaftarAkunDetail] = useState([]);

    const [listKaryawan, setListKaryawan] = useState([]);
    const [listDepartment, setlistDepartment] = useState([]);
    const [filteredDataJurnalHeader, setFilteredDataJurnalHeader] = useState<any[]>([]);
    const [filteredDataJurnalDetail, setFilteredDataJurnalDetail] = useState<any[]>([]);

    const [dataSubledger, setDataSubledger] = useState('');
    const [kodeMu, setKodeMu] = useState('');

    const refreshDaftarAkunHeader = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
                params: {
                    entitas: kode_entitas,
                    param1: 'SQLAkunKas',
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            gridJurnalHeaderList.current?.setProperties({ dataSource: response.data.data });
            gridJurnalHeaderList.current?.refresh();

            setDaftarAkunHeader(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftarAkunDetail = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/akun_jurnal`, {
                params: {
                    entitas: kode_entitas,
                },
            });

            const responAkunDetail = response.data.data;

            gridDaftarJurnalDetailList.current?.setProperties({ dataSource: responAkunDetail });
            gridDaftarJurnalDetailList.current?.refresh();

            setDaftarAkunDetail(responAkunDetail);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftarKaryawan = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_karyawan`, {
                params: {
                    entitas: kode_entitas,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setListKaryawan(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const divisiDepartment = async () => {
        await FillFromSQL(kode_entitas, 'departemen')
            .then((result: any) => {
                const modifiedData = result.map((item: any) => ({
                    ...item,
                    dept_ku: item.no_dept_dept + '-' + item.nama_dept,
                    dept_ku2: item.kode_dept + '*' + item.no_dept_dept + '-' + item.nama_dept,
                }));
                setlistDepartment(modifiedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    //No. Akun dan Nama Akun Header
    const PencarianNoakunJurnalHeader = async (event: string, setSearchNoakunJurnal: Function, setFilteredDataJurnalHeader: Function, listDaftarAkunHeader: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoakunJurnalHeader(searchValue, listDaftarAkunHeader);
        setFilteredDataJurnalHeader(filteredData);

        const cariNamaAkunHeader = document.getElementById('cariNamaAkunHeader') as HTMLInputElement;
        if (cariNamaAkunHeader) {
            cariNamaAkunHeader.value = '';
        }
    };

    const SearchDataNoakunJurnalHeader = (keyword: any, listDaftarAkunHeader: any[]) => {
        if (keyword === '') {
            return listDaftarAkunHeader;
        } else {
            const filteredData = listDaftarAkunHeader.filter((item) => item.no_akun.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaakunJurnalHeader = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredDataJurnalHeader: Function, listDaftarAkunHeader: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaakunJurnalHeader(searchValue, listDaftarAkunHeader);
        setFilteredDataJurnalHeader(filteredData);

        const cariNoAkunHeader = document.getElementById('cariNoAkunHeader') as HTMLInputElement;
        if (cariNoAkunHeader) {
            cariNoAkunHeader.value = '';
        }
    };

    const SearchDataNamaakunJurnalHeader = (keyword: any, listDaftarAkunHeader: any[]) => {
        if (keyword === '') {
            return listDaftarAkunHeader;
        } else {
            const filteredData = listDaftarAkunHeader.filter((item) => item.nama_akun.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    //No. Akun dan Nama Akun Detail
    const PencarianNoakunJurnalDetail = async (event: string, setSearchNoakunJurnal: Function, setFilteredDataJurnalDetail: Function, listDaftarAkunDetail: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoakunJurnalDetail(searchValue, listDaftarAkunDetail);
        setFilteredDataJurnalDetail(filteredData);

        const cariNamaAkunDetail = document.getElementById('cariNamaAkunDetail') as HTMLInputElement;
        if (cariNamaAkunDetail) {
            cariNamaAkunDetail.value = '';
        }
    };

    const SearchDataNoakunJurnalDetail = (keyword: any, listDaftarAkunDetail: any[]) => {
        if (keyword === '') {
            return listDaftarAkunDetail;
        } else {
            const filteredData = listDaftarAkunDetail.filter((item) => item.no_akun.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaakunJurnalDetail = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredDataJurnalDetail: Function, listDaftarAkunDetail: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaakunJurnalDetail(searchValue, listDaftarAkunDetail);
        setFilteredDataJurnalDetail(filteredData);

        const cariNoAkunDetail = document.getElementById('cariNoAkunDetail') as HTMLInputElement;
        if (cariNoAkunDetail) {
            cariNoAkunDetail.value = '';
        }
    };

    const SearchDataNamaakunJurnalDetail = (keyword: any, listDaftarAkunHeader: any[]) => {
        if (keyword === '') {
            return listDaftarAkunHeader;
        } else {
            const filteredData = listDaftarAkunHeader.filter((item) => item.nama_akun.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    function stringToNumber(value: string): number {
        // Hapus semua koma dari string
        const cleanedValue = value.replace(/,/g, '');
        // Ubah string menjadi angka desimal
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? 0 : number; // Pastikan nilai kembali 0 jika tidak valid
    }

    const handlePilihJurnal = async () => {
        if (selectedJurnalHeader.header === 'Y' && modalAkunSource === 'header') {
            swal.fire({
                text: `No akun ${selectedJurnalHeader.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi`,
                icon: 'warning',
                target: '#dialogJurnalHeaderList',
            });
        } else if (selectedJurnalDetail.header === 'Y' && modalAkunSource === 'detail') {
            swal.fire({
                text: `No akun ${selectedJurnalDetail.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi`,
                icon: 'warning',
                target: '#dialogJurnalDetailList',
            });
        } else {
            if (modalAkunSource === 'header') {
                setDataJurnalHeader(selectedJurnalHeader);
                setNoAkunValueHeader(selectedJurnalHeader.no_akun);
                setNamaAkunValueHeader(selectedJurnalHeader.nama_akun);
                setKursHeader(selectedJurnalHeader.kurs);
                setSelectedSubledgerAllDataHeader('');
                setSelectedKode_Subledger('');
                setSelectedSubledgerNamaRelasi('');

                const jurnalHeader = {
                    ...(statusPage === 'EDIT' && { kode_dokumen: kode_bm }),
                    id_dokumen: 1,
                    dokumen: 'BM',
                    tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                    kode_akun: selectedJurnalHeader.kode_akun,
                    kode_subledger: selectedkode_Subledger,
                    kurs: selectedJurnalHeader.kurs,
                    no_akun: selectedJurnalHeader.no_akun,
                    nama_akun: selectedJurnalHeader.nama_akun,
                    debet_rp: formatNumber(inputValueJumlah_mu),
                    kredit_rp: 0,
                    nilai_mu: 0,
                    jumlah_rp: formatNumber(inputValueJumlah_mu),
                    jumlah_mu: formatNumber(inputValueJumlah_mu),
                    catatan: keterangan,
                    no_warkat: null,
                    tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                    persen: 0,
                    nama_relasi: null,
                    kode_dept: null,
                    kode_kerja: null,
                    approval: null,
                    posting: null,
                    rekonsiliasi: null,
                    tgl_rekonsil: null,
                    userid: userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: null,
                    kode_kry: null,
                    kode_jual: null,
                    no_kontrak_um: '',
                };
                console.log('setDataJurnalforSaveDoc = ', jurnalHeader);

                const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: selectedJurnalHeader.kode_akun,
                    },
                });

                if (cek_subledger.data.data[0].subledger === 'Y') {
                    await refreshSubledgerHeader();
                    setModalSubledgerSource('header');
                    setTimeout(() => {
                        setModalSubledgerHeader(true);
                    }, 100);
                }

                setDataJurnalforSaveDoc(jurnalHeader);
                setModalDaftarAkunHeader(false);
            } else if (modalAkunSource === 'detail') {
                const totalLine = gridAlokasiDana.dataSource.length;

                let id_dokumenJurnal;
                if (statusPage === 'CREATE') {
                    id_dokumenJurnal = totalLine === 1 ? 2 : totalLine + 1;
                } else if (statusPage === 'EDIT') {
                    id_dokumenJurnal = gridAlokasiDana.dataSource[selectedRowIndex].id_dokumen;
                    if (id_dokumenJurnal === undefined) {
                        id_dokumenJurnal = totalLine + 1;
                    }
                }

                // console.log('GRID DATA: ', gridAlokasiDana.dataSource[selectedRowIndex]);

                const nilaiMU = gridAlokasiDana.dataSource[selectedRowIndex].nilai_mu;

                const detailBarangBaru = {
                    ...(statusPage === 'EDIT' && { kode_dokumen: kode_bm }),
                    id_dokumen: id_dokumenJurnal,
                    dokumen: 'BM',
                    tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                    kode_akun: selectedJurnalDetail.kode_akun,
                    no_akun: selectedJurnalDetail.no_akun,
                    nama_akun: selectedJurnalDetail.nama_akun,
                    kredit_rp: 0,
                    // nilai_mu: selisih == 0 ? Number(formatNumber(inputValueJumlah_mu)) : selisih,
                    // nilai_mu: totalDebet === totalKredit ? 0 : selisih === 0 ? Number(formatNumber(inputValueJumlah_mu)) : selisih,
                    nilai_mu: nilaiMU != 0 ? stringToNumber(nilaiMU) : totalDebet === totalKredit ? 0 : selisih === 0 ? stringToNumber(inputValueJumlah_mu) : selisih,
                    kurs: selectedJurnalDetail.kurs,
                    tipe: selectedJurnalDetail.tipe,
                    kode_mu: selectedJurnalDetail.kode_mu,
                    debet_rp: 0,
                    no_warkat: null,
                    tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                    persen: 0,
                    kode_kerja: null,
                    approval: null,
                    posting: null,
                    rekonsiliasi: null,
                    tgl_rekonsil: null,
                    userid: userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: null,
                    kode_kry: null,
                    no_kontrak_um: '',
                    catatan: keterangan,
                    nama_dept: null,
                    kode_jual: null,
                    nama_relasi: null,
                    kode_subledger: null,
                };

                // if (detailBarangBaru.nilai_mu == Number(formatNumber(inputValueJumlah_mu))) {
                //   gridAlokasiDana.dataSource[selectedRowIndex] = { ...detailBarangBaru, nilai_mu: Number(formatNumber(inputValueJumlah_mu)) };
                // } else {
                //   gridAlokasiDana.dataSource[selectedRowIndex] = { ...detailBarangBaru, nilai_mu: totalDebet === totalKredit ? 0 : selisih === 0 ? Number(formatNumber(inputValueJumlah_mu)) : selisih };
                // }
                gridAlokasiDana.dataSource[selectedRowIndex] = detailBarangBaru;

                const akun = gridAlokasiDana.dataSource[selectedRowIndex].kode_akun;
                const isTipeBeban = gridAlokasiDana.dataSource[selectedRowIndex].tipe === 'Beban' || gridAlokasiDana.dataSource[selectedRowIndex].tipe === 'Beban Lain-Lain';
                const isTipePendapatan = gridAlokasiDana.dataSource[selectedRowIndex].tipe === 'Pendapatan';
                const isTipePiutang = gridAlokasiDana.dataSource[selectedRowIndex].tipe === 'Piutang';
                const isTipeHutang = gridAlokasiDana.dataSource[selectedRowIndex].tipe === 'Hutang';
                const kode_mu = gridAlokasiDana.dataSource[selectedRowIndex].kode_mu;

                const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: akun,
                    },
                });

                setKodeMu(kode_mu);

                if (cek_subledger.data.data[0].subledger === 'Y') {
                    await refreshDaftaSubledgerIsLedgerY(akun);
                    setModalSubledgerSource('detail');
                    setTimeout(() => {
                        setModalDaftarSubledgerIsLedgerY(true);
                    }, 100);
                } else if (isTipePiutang) {
                    await refreshDaftaSubledgerCustomer(kode_mu);
                    setModalSubledgerSource('detail');
                    setTimeout(() => {
                        setModalDaftarSubledgerCustomer(true);
                    }, 100);
                } else if (isTipeHutang) {
                    await refreshDaftaSubledgerSupplier(kode_mu);
                    setModalSubledgerSource('detail');
                    setTimeout(() => {
                        setModalDaftarSubledgerSupplier(true);
                    }, 100);
                }

                if (isTipeBeban || isTipePendapatan) {
                    if (cek_subledger.data.data[0].subledger === 'Y') {
                        setTimeout(() => {
                            setModalListDepartment(false);
                        }, 400);
                    } else {
                        setTimeout(() => {
                            setModalListDepartment(true);
                        }, 400);
                    }
                }

                setTambah(true);

                gridAlokasiDana.refresh();
                setModalDaftarAkunDetail(false);
            }
        }
    };

    let buttonDaftarSubledgerHeader: ButtonPropsModel[];

    buttonDaftarSubledgerHeader = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                handlePilihSubledgerHeader();
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                //iconCss: 'e-icons e-close',
                cssClass: 'e-primary e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                setModalSubledgerHeader(false);
            },
        },
    ];

    const gridIndukHeaderJurnal = (props: any) => {
        return <div style={{ fontWeight: props.header === 'Y' ? 'bold' : 'normal', marginLeft: props.header === 'N' ? '0.5rem' : '0' }}>{props[props.column.field]}</div>;
    };

    ///////////////
    // Subledger //
    ///////////////

    const [selectedSubledgerCustomer, setSelectedSubledgerCustomer] = useState<any>('');
    const [selectedSubledgerIsLedgerY, setSelectedSubledgerIsLedgerY] = useState<any>('');
    const [selectedSubledgerSupplier, setSelectedSubledgerSupplier] = useState<any>('');

    const [listDaftarSubledgerCustomer, setDaftarSubledgerCustomer] = useState([]);
    const [listDaftarSubledgerIsLedgerY, setDaftarSubledgerIsLedgerY] = useState([]);
    const [listDaftarSubledgerSupplier, setDaftarSubledgerSupplier] = useState([]);

    const [searchNoSubledgerCustomer, setSearchNoSublegerCustomer] = useState('');
    const [searchNamaSubledgerCustomer, setSearchNamaSublegerCustomer] = useState('');
    const [searchSalesmanSubledgerCustomer, setSearchSalesmanSublegerCustomer] = useState('');

    const refreshDaftaSubledgerCustomer = async (kode_mu: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/customer_dlg_bm`, {
                params: {
                    entitas: kode_entitas,
                    param1: kode_mu,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;

            gridDaftarSubledgerCustomerJurnal.current?.setProperties({ dataSource: result.data });
            gridDaftarSubledgerCustomerJurnal.current?.refresh();

            if (result.status) {
                setDaftarSubledgerCustomer(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftaSubledgerIsLedgerY = async (kodeAkun: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_subledger_by_kodeakun`, {
                params: {
                    entitas: kode_entitas,
                    param1: kodeAkun,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarSubledgerIsLedgerY(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftaSubledgerSupplier = async (kode_mu: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/m_supplier`, {
                params: {
                    entitas: kode_entitas,
                    param1: kode_mu,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarSubledgerSupplier(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    let buttonDaftarAkunKasDetail: ButtonPropsModel[];
    let currentDaftarAkunKasDetail: any[] = [];

    // Tambahan ini untuk button
    buttonDaftarAkunKasDetail = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarAkunKasDetail = (gridJurnalHeaderList.current?.getSelectedRecords() as any[]) || [];
                if (currentDaftarAkunKasDetail.length > 0) {
                    if (currentDaftarAkunKasDetail[0].header !== 'Y') {
                        handlePilihJurnal();
                    } else {
                        withReactContent(swalToast).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px;color:white;">Silahkan pilih akun selain akun header.</p>',
                            width: '100%',
                            target: '#dialogBMList',
                            customClass: {
                                popup: styles['colored-popup'], // Custom class untuk sweetalert
                            },
                        });
                    }
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Silahkan pilih data akun</p>',
                        width: '100%',
                        target: '#dialogBMList',
                        customClass: {
                            popup: styles['colored-popup'],
                        },
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                //iconCss: 'e-icons e-close',
                cssClass: 'e-primary e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                setModalDaftarAkunDetail(false);
            },
        },
    ];

    let buttonDaftarAkunKas: ButtonPropsModel[];
    let currentDaftarAkunKas: any[] = [];

    // Tambahan ini untuk button
    buttonDaftarAkunKas = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarAkunKas = (gridJurnalHeaderList.current?.getSelectedRecords() as any[]) || [];
                if (currentDaftarAkunKas.length > 0) {
                    if (currentDaftarAkunKas[0].header !== 'Y') {
                        handlePilihJurnal();
                    } else {
                        withReactContent(swalToast).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px;color:white;">Silahkan pilih akun selain akun header.</p>',
                            width: '100%',
                            target: '#dialogBMList',
                            customClass: {
                                popup: styles['colored-popup'], // Custom class untuk sweetalert
                            },
                        });
                    }
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Silahkan pilih data akun</p>',
                        width: '100%',
                        target: '#dialogBMList',
                        customClass: {
                            popup: styles['colored-popup'],
                        },
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                //iconCss: 'e-icons e-close',
                cssClass: 'e-primary e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                setModalDaftarAkunHeader(false);
            },
        },
    ];

    const [modalDaftarSubledgerCustomer, setModalDaftarSubledgerCustomer] = useState(false);
    const [modalDaftarSubledgerSupplier, setModalDaftarSubledgerSupplier] = useState(false);
    const [modalDaftarSubledgerIsLedgerY, setModalDaftarSubledgerIsLedgerY] = useState(false);

    const [modalListKaryawan, setModalListKaryawan] = useState(false);
    const [modalListDepartment, setModalListDepartment] = useState(false);

    const [selectedRowIndex, setSelectedRowIndex] = useState(0);

    const rowSelectingDetailJurnalDetail = (args: any) => {
        setSelectedRowIndex(args.rowIndex);
    };

    // handle update subledger di alokasi dana
    const handlePilihSubledger_Customer = async () => {
        console.log(selectedSubledgerCustomer, 'Data Masuk');

        if (modalSubledgerSource == 'detail') {
            const updateSubledger = {
                nama_relasi: selectedSubledgerCustomer.nama_relasi,
                kode_subledger: selectedSubledgerCustomer.kode_cust,
            };
            if (selectedRowIndex >= 0 && selectedRowIndex < gridAlokasiDana.dataSource.length) {
                gridAlokasiDana.dataSource[selectedRowIndex] = {
                    ...gridAlokasiDana.dataSource[selectedRowIndex],
                    ...updateSubledger,
                };
                console.log(gridAlokasiDana.dataSource, 'Data Masuk Akhir');
                setTambah(true);
                gridAlokasiDana.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
        setModalDaftarSubledgerCustomer(false);
    };

    const handlePilihSubledgerHeader = async () => {
        setSelectedSubledgerAllDataHeader(selectedSubledgerHeader);
        setSelectedKode_Subledger(selectedSubledgerHeader.kode_subledger);
        setSelectedSubledgerNamaRelasi(selectedSubledgerHeader.nama_subledger);
        setModalSubledgerHeader(false);
    };

    const handlePilihSubledger_IsLedgerY = async () => {
        if (modalSubledgerSource === 'detail') {
            const updateSubledger = {
                nama_relasi: selectedSubledgerIsLedgerY.nama_subledger,
                kode_subledger: selectedSubledgerIsLedgerY.kode_subledger,
            };

            if (selectedRowIndex >= 0 && selectedRowIndex < gridAlokasiDana.dataSource.length) {
                gridAlokasiDana.dataSource[selectedRowIndex] = {
                    ...gridAlokasiDana.dataSource[selectedRowIndex],
                    ...updateSubledger,
                };
                setTambah(true);

                gridAlokasiDana.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }

        const akun = gridAlokasiDana.dataSource[selectedRowIndex].kode_akun;

        const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
            params: {
                entitas: kode_entitas,
                param1: akun,
            },
        });

        if (cek_subledger.data.data[0].subledger === 'Y') {
            setModalListDepartment(true);
        }

        setModalDaftarSubledgerIsLedgerY(false);
    };

    const handlePilihSubledgerSupplier = async () => {
        if (modalSubledgerSource == 'detail') {
            const updateSubledger = {
                nama_relasi: selectedSubledgerSupplier.nama_relasi,
                kode_subledger: selectedSubledgerSupplier.kode_supp,
            };

            if (selectedRowIndex >= 0 && selectedRowIndex < gridAlokasiDana.dataSource.length) {
                gridAlokasiDana.dataSource[selectedRowIndex] = {
                    ...gridAlokasiDana.dataSource[selectedRowIndex],
                    ...updateSubledger,
                };
                setTambah(true);

                gridAlokasiDana.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
        setModalDaftarSubledgerSupplier(false);
    };

    const [searchNoIsLedgerY, setSearchNoIsLedgerY] = useState('');
    const [searchNamaIsLedgerY, setSearchNamaIsLedgerY] = useState('');
    const [filteredDataIsLedgerY, setFilteredDataIsLedgerY] = useState('');

    const PencarianNoakunIsLedgerY = async (event: string, setSearchNoakunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoIsLedgerY(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNamaIsLedgerY = document.getElementById('cariNamaIsLedgerY') as HTMLInputElement;
        if (cariNamaIsLedgerY) {
            cariNamaIsLedgerY.value = '';
        }
    };

    const SearchDataNoIsLedgerY = (keyword: any, listDaftarSubledgerIsLedgerY: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerIsLedgerY;
        } else {
            const filteredData = listDaftarSubledgerIsLedgerY.filter((item) => item.no_subledger.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaakunIsLedgerY = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaisLedgerY(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNoIsLedgerY = document.getElementById('cariNoIsLedgerY') as HTMLInputElement;
        if (cariNoIsLedgerY) {
            cariNoIsLedgerY.value = '';
        }
    };

    const SearchDataNamaisLedgerY = (keyword: any, listDaftarSubledgerIsLedgerY: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerIsLedgerY;
        } else {
            const filteredData = listDaftarSubledgerIsLedgerY.filter((item) => item.nama_subledger.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const [filteredDataSubledgerSupplier, setFilteredDataSubledgerSupplier] = useState('');
    const [searchNoSubledgerSupplier, setSearchNoSubledgerSupplier] = useState('');
    const [searchNamaSubledgerSupplier, setSearchNamaSubledgerSupplier] = useState('');

    const PencarianNoSubledgerSupplier = async (event: string, setSearchNoSubledgerSupplier: Function, setFilteredData: Function, listDaftarSubledgerSupplier: any[]) => {
        const searchValue = event;
        setSearchNoSubledgerSupplier(searchValue);
        const filteredData = SearchDataNoSubledgerSupplier(searchValue, listDaftarSubledgerSupplier);
        setFilteredData(filteredData);

        const cariNamaAkun = document.getElementById('cariNamaAkun') as HTMLInputElement;
        if (cariNamaAkun) {
            cariNamaAkun.value = '';
        }
    };

    const SearchDataNoSubledgerSupplier = (keyword: any, listDaftarSubledgerSupplier: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerSupplier;
        } else {
            const filteredData = listDaftarSubledgerSupplier.filter((item) => item.no_supp.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaSubledgerSupplier = async (event: string, setSearchNamaSubledgerSupplier: Function, setFilteredData: Function, listDaftarSubledgerSupplier: any[]) => {
        const searchValue = event;
        setSearchNamaSubledgerSupplier(searchValue);
        const filteredData = SearchDataNamaSubledgerSupplier(searchValue, listDaftarSubledgerSupplier);
        setFilteredData(filteredData);

        const cariNoAkun = document.getElementById('cariNoAkun') as HTMLInputElement;
        if (cariNoAkun) {
            cariNoAkun.value = '';
        }
    };

    const SearchDataNamaSubledgerSupplier = (keyword: any, listDaftarSubledgerSupplier: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerSupplier;
        } else {
            const filteredData = listDaftarSubledgerSupplier.filter((item) => item.nama_relasi.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    // **Nama Karyawan** //
    const [selectedKaryawan, setSelectedKaryawan] = useState<any>('');
    const [filteredDataNamaKaryawan, setFilteredDataNamaKaryawan] = useState('');

    const PencarianNamaKaryawan = async (event: string, setSearchNamaKaryawan: Function, setFilteredDataNamaKaryawan: Function, listKaryawan: any[]) => {
        const searchValue = event;
        setSearchNamaKaryawan(searchValue);
        const filteredData = SearchDataNamaKaryawan(searchValue, listKaryawan);
        setFilteredDataNamaKaryawan(filteredData);
    };

    const SearchDataNamaKaryawan = (keyword: any, listKaryawan: any[]) => {
        if (keyword === '') {
            return listKaryawan;
        } else {
            const filteredData = listKaryawan.filter((item) => item.nama_kry.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const handlePilihKaryawan = async () => {
        const updateKaryawan = {
            kode_kry: selectedKaryawan.kode_kry,
            nama_kry: selectedKaryawan.nama_kry,
        };

        if (selectedRowIndex >= 0 && selectedRowIndex < gridAlokasiDana.dataSource.length) {
            gridAlokasiDana.dataSource[selectedRowIndex] = {
                ...gridAlokasiDana.dataSource[selectedRowIndex],
                ...updateKaryawan,
            };
            setTambah(true);

            gridAlokasiDana.refresh();
        } else {
            console.error('Invalid selectedRowIndex:', selectedRowIndex);
        }

        setModalListKaryawan(false);
    };

    // **Department** //

    const [selectedDepartment, setSelectedDepartment] = useState<any>('');
    const [filteredDataDepartment, setFilteredDataDepartment] = useState('');

    const PencarianNamaDepartment = async (event: string, setSearchNamaDepartment: Function, setFilteredDataDepartment: Function, listDepartment: any[]) => {
        const searchValue = event;
        setSearchNamaDepartment(searchValue);
        const filteredData = SearchDataNamaDepartment(searchValue, listDepartment);
        setFilteredDataDepartment(filteredData);
    };

    const SearchDataNamaDepartment = (keyword: any, listDepartemen: any[]) => {
        if (keyword === '') {
            return listDepartemen;
        } else {
            const filteredData = listDepartemen.filter((item) => item.nama_dept.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const handlePilihDepartment = async () => {
        const updateDepartment = {
            kode_dept: selectedDepartment.kode_dept,
            nama_dept: selectedDepartment.nama_dept,
        };

        if (selectedRowIndex >= 0 && selectedRowIndex < gridAlokasiDana.dataSource.length) {
            gridAlokasiDana.dataSource[selectedRowIndex] = {
                ...gridAlokasiDana.dataSource[selectedRowIndex],
                ...updateDepartment,
            };
            setTambah(true);

            gridAlokasiDana.refresh();
        } else {
            console.error('Invalid selectedRowIndex:', selectedRowIndex);
        }

        setModalListDepartment(false);
        setModalListKaryawan(true);
    };

    // handle balance
    let formattedBalance = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(selectedJurnalHeader.balance);

    let resultBalance = isNaN(Number(selectedJurnalHeader.balance)) ? '' : formattedBalance;

    function terbilang(a: any): string {
        var bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
        var kalimat = '';

        if (typeof a === 'number') {
            a = parseFloat(a.toFixed(2));
        } else {
            a = parseFloat(parseFloat(a).toFixed(2));
        }

        var parts = a.toString().split('.');
        var angkaUtama = parseInt(parts[0]);
        var angkaDesimal = parts[1] ? parseFloat('0.' + parts[1]) : 0;

        function angkaKeKata(angka: number): string {
            if (angka === 0) {
                return '';
            }
            if (angka < 12) {
                return bilangan[angka];
            } else if (angka < 20) {
                return bilangan[angka - 10] + ' Belas';
            } else if (angka < 100) {
                var depan = Math.floor(angka / 10);
                var belakang = angka % 10;
                return bilangan[depan] + ' Puluh ' + (belakang > 0 ? bilangan[belakang] : '');
            } else if (angka < 200) {
                return 'Seratus ' + angkaKeKata(angka - 100);
            } else if (angka < 1000) {
                var depan = Math.floor(angka / 100);
                var belakang = angka % 100;
                return bilangan[depan] + ' Ratus ' + angkaKeKata(belakang);
            } else if (angka < 2000) {
                return 'Seribu ' + angkaKeKata(angka - 1000);
            } else if (angka < 1000000) {
                var depan = Math.floor(angka / 1000);
                var belakang = angka % 1000;
                return angkaKeKata(depan) + ' Ribu ' + angkaKeKata(belakang);
            } else if (angka < 1000000000) {
                var depan = Math.floor(angka / 1000000);
                var belakang = angka % 1000000;
                return angkaKeKata(depan) + ' Juta ' + angkaKeKata(belakang);
            } else if (angka < 1000000000000) {
                var depan = Math.floor(angka / 1000000000);
                var belakang = angka % 1000000000;
                return angkaKeKata(depan) + ' Milyar ' + angkaKeKata(belakang);
            } else if (angka < 1000000000000000) {
                var depan = Math.floor(angka / 1000000000000);
                var belakang = angka % 1000000000000;
                return angkaKeKata(depan) + ' Triliun ' + angkaKeKata(belakang);
            }
            return ''; // Untuk angka yang lebih besar
        }

        kalimat = angkaKeKata(angkaUtama);
        if (kalimat === '') {
            kalimat = 'Nol';
        }

        // Tambahkan bagian desimal menjadi sen
        if (angkaDesimal > 0) {
            var sen = Math.round(angkaDesimal * 100); // Konversi desimal menjadi sen
            if (sen > 0) {
                kalimat += ' Koma ' + angkaKeKata(sen) + ' Sen';
            }
        }

        return kalimat.trim();
    }

    const handleInputChange = (event: any) => {
        const value = event.target.value;
        setInputValueJumlah_mu(value);

        // Gunakan parseFloat untuk membaca nilai desimal
        if (!isNaN(parseFloat(value)) && value !== '') {
            const number = parseFloat(value);
            const words = terbilang(number);
            setOutputWordsJumlah_mu(`** ${words} **`);
        } else {
            setOutputWordsJumlah_mu('Masukkan angka yang valid');
        }
    };

    useEffect(() => {
        if (statusPage === 'EDIT') {
            if (inputValueJumlah_mu) {
                const number = parseInt(formatNumber(inputValueJumlah_mu), 10);
                const words = terbilang(number);
                setOutputWordsJumlah_mu(`** ${words} **`);
            } else {
                setOutputWordsJumlah_mu('Masukkan angka yang valid');
            }
        }
    }, [inputValueJumlah_mu]);

    const handleInputBlur = () => {
        if (!isNaN(Number(inputValueJumlah_mu.replace(/,/g, ''))) && inputValueJumlah_mu !== '') {
            const formattedValue = parseFloat(inputValueJumlah_mu.replace(/,/g, '')).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            setInputValueJumlah_mu(formattedValue);
        }
    };

    const handleInputFocus = () => {
        if (inputValueJumlah_mu !== '') {
            const rawValue = parseFloat(inputValueJumlah_mu.replace(/,/g, '')).toString();
            setInputValueJumlah_mu(rawValue);
        }
    };

    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(false);

    const actionBeginDetailJurnal = (args: any) => {
        if (args.requestType === 'save') {
            const data = args.data;
            if (data.kredit_rp) {
                data.jumlah_rp = '-' + parseFloat(data.kredit_rp);
                data.jumlah_mu = '-' + parseFloat(data.kredit_rp);
            }
        }
    };

    const actionCompleteDetailJurnal = async (args: any) => {
        switch (args.requestType) {
            case 'save':
                if (tambah === false) {
                    const editedData = args.data;
                    gridAlokasiDana.dataSource[args.rowIndex] = editedData;
                    kalkulasiJurnal();
                    gridAlokasiDana.refresh();
                } else if (edit) {
                    kalkulasiJurnal();
                    gridAlokasiDana.refresh();
                }
                break;
            case 'beginEdit':
                setTambah(false);
                setEdit(true);
                kalkulasiJurnal();
                break;
            case 'delete':
                gridAlokasiDana.dataSource.forEach((item: any, index: any) => {
                    item.id = index + 1;
                });
                gridAlokasiDana.refresh();
                break;
            case 'refresh':
                kalkulasiJurnal();
                setTambah(false);
                setEdit(false);
                break;
            default:
                break;
        }
    };

    const handleDataJurnal = async (jenis: any) => {
        const totalLine = gridAlokasiDana.dataSource.length;
        const isNoBarangNotEmpty = gridAlokasiDana.dataSource.every((item: any) => item.no_akun !== null);

        if (keterangan === '') {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Keterangan belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (Number(formatNumber(inputValueJumlah_mu)) === 0) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Jumlah (MU) belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if ((totalLine === 0 && jenis === 'new') || (isNoBarangNotEmpty && jenis === 'new')) {
            const detailBarangBaru = {
                id: totalLine + 1,
                no_akun: null,
                nama_akun: null,
                nilai_mu: 0,
                kredit_rp: 0,
                catatan: null,
                nama_relasi: null,
                department: null,
                nama_karyawan: null,
                kode_jual: null,
                nama_jual: null,
                nama_kry: null,
                kode_dept: null,
                no_dept: null,
                nama_dept: null,
                kurs: null,
                debet_rp: 0,
                jumlah_rp: null,
                jumlah_mu: null,
                kode_subledger: null,
            };
            gridAlokasiDana.addRecord(detailBarangBaru, totalLine);
            setTambah(true);
            gridAlokasiDana.refresh();
        } else {
            document.getElementById('gridAlokasiDana')?.focus();
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Silahkan melengkapi data sebelum menambah data baru</p>',
                width: '100%',
                target: '#gridAlokasiDana',
            });
        }
    };

    const editTemplateNoAkunJurnal = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.no_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    if (listDaftarAkunDetail.length > 0) {
                                        setModalDaftarAkunDetail(true);
                                        setModalAkunSource('detail');
                                    }
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateNamaAkunJurnal = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalAkunSource('detail');
                                    setModalDaftarAkunDetail(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateMaster_Subledger = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_relasi} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={async () => {
                                    setModalSubledgerSource('detail');
                                    // handleButtonSubledger();

                                    const akun = gridAlokasiDana.dataSource[args.index].kode_akun;
                                    const no_akun = gridAlokasiDana.dataSource[args.index].no_akun;
                                    const tipe = gridAlokasiDana.dataSource[args.index].tipe;
                                    const kode_mu = gridAlokasiDana.dataSource[args.index].kode_mu;

                                    const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
                                        params: {
                                            entitas: kode_entitas,
                                            param1: akun,
                                        },
                                    });

                                    setDataSubledger(cek_subledger.data.data[0].subledger);

                                    if (tipe === 'Piutang') {
                                        await refreshDaftaSubledgerCustomer(kode_mu);
                                        if (listDaftarSubledgerCustomer) {
                                            setModalDaftarSubledgerCustomer(true);
                                        }
                                    } else if (tipe === 'Hutang') {
                                        await refreshDaftaSubledgerSupplier(kode_mu);
                                        if (listDaftarSubledgerSupplier) {
                                            setModalDaftarSubledgerSupplier(true);
                                        }
                                    } else if (cek_subledger.data.data[0].subledger === 'Y') {
                                        await refreshDaftaSubledgerIsLedgerY(akun);
                                        if (listDaftarSubledgerIsLedgerY) {
                                            setModalDaftarSubledgerIsLedgerY(true);
                                        }
                                    } else {
                                        withReactContent(swalToast).fire({
                                            icon: 'error',
                                            title: `<p style="font-size:12px">Data Akun ${no_akun} Tidak Mempunyai Subledger</p>`,
                                            width: '100%',
                                            target: '#dialogBMList',
                                        });
                                    }
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const [searchNamaKaryawan, setSearchNamaKaryawan] = useState('');

    const editTemplateNamaKaryawan = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_kry} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalListKaryawan(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const [searchNamaDepartment, setSearchNamaDepartment] = useState('');

    const editTemplateNamaDepartment = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_dept} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalListDepartment(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const [listKodeJual, setListKodeJual] = useState([]);

    const fetchKodeJualData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/kode_jual?entitas=${kode_entitas}`);
            if (response.data.status) {
                const modifiedData = response.data.data.map((item: any) => ({
                    ...item,
                    jual_ku: item.kode_jual + ' - ' + item.nama_jual,
                    jual_ku2: item.kode_jual + '*' + item.kode_jual + ' - ' + item.nama_jual,
                }));
                setListKodeJual(modifiedData);
            } else {
                console.error('Failed to fetch data:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchKodeJualData();
    }, [kode_entitas]);

    const editTemplateKodeJual = (args: any) => {
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DropDownListComponent
                    id="jual"
                    name="jual"
                    dataSource={listKodeJual}
                    fields={{ value: 'jual_ku2', text: 'jual_ku' }}
                    floatLabelType="Never"
                    placeholder={args.kode_jual}
                    onChange={(e: any) => {
                        gridAlokasiDana.dataSource[args.index] = {
                            ...gridAlokasiDana.dataSource[args.index],
                            kode_jual: e.value.split('*')[0],
                            nama_jual: e.value.split('*')[1],
                        };
                        gridAlokasiDana.refresh();
                    }}
                />
            </div>
        );
    };

    useEffect(() => {
        // console.log(gridAlokasiDana.dataSource, 'grid')
        divisiDepartment();
        refreshDaftarAkunHeader();
        refreshDaftarAkunDetail();
        refreshDaftarKaryawan();
        refreshDaftaSubledgerCustomer(kodeMu);
    }, [kode_entitas, vRefreshData.current]);

    ////// ***SUBLEDGER HEADER*** //////
    const [modalSubledgerHeader, setModalSubledgerHeader] = useState(false);
    const [listSubledgerHeader, setListSubledgerHeader] = useState([]);
    const [filteredDataSubledgerHeader, setFilteredDataSubledgerHeader] = useState([]);
    const [searchNoSubledger, setSearchNoSubledger] = useState('');
    const [searchNamaSubledger, setSearchNamaSubledger] = useState('');

    const refreshSubledgerHeader = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_subledger_by_kode_akun`, {
                params: {
                    entitas: kode_entitas,
                    param1: selectedJurnalHeader.kode_akun || dataJurnalHeader.kode_akun,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responSubledgerHeader = response.data.data;

            setListSubledgerHeader(responSubledgerHeader);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        refreshSubledgerHeader();
    }, [kode_entitas, selectedJurnalHeader, dataJurnalHeader]);

    const PencarianNoSubledgerHeader = async (event: string, setSearchNoSubledger: Function, setFilteredDataSubledgerHeader: Function, listSubledgerHeader: any[]) => {
        const searchValue = event;
        setSearchNoSubledger(searchValue);
        const filteredData = SearchDataNoSubledgerHeader(searchValue, listSubledgerHeader);
        setFilteredDataSubledgerHeader(filteredData);

        const cariNamaSubledger = document.getElementById('cariNamaSubledger') as HTMLInputElement;
        if (cariNamaSubledger) {
            cariNamaSubledger.value = '';
        }
    };

    const SearchDataNoSubledgerHeader = (keyword: any, listSubledgerHeader: any[]) => {
        if (keyword === '') {
            return listSubledgerHeader;
        } else {
            const filteredData = listSubledgerHeader.filter((item) => item.no_subledger.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaSubledgerHeader = async (event: string, setSearchNamaSubledger: Function, setFilteredDataSubledgerHeader: Function, listSubledgerHeader: any[]) => {
        const searchValue = event;
        setSearchNamaSubledger(searchValue);
        const filteredData = SearchDataNamaSubledgerHeader(searchValue, listSubledgerHeader);
        setFilteredDataSubledgerHeader(filteredData);

        const cariNoSubledger = document.getElementById('cariNoSubledger') as HTMLInputElement;
        if (cariNoSubledger) {
            cariNoSubledger.value = '';
        }
    };

    const SearchDataNamaSubledgerHeader = (keyword: any, listSubledgerHeader: any[]) => {
        if (keyword === '') {
            return listSubledgerHeader;
        } else {
            const filteredData = listSubledgerHeader.filter((item) => item.nama_subledger.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    ////// ***END SUBLEDGER HEADER*** //////

    const formatNumber = (numString: string) => {
        return numString.replace(/,/g, '').split('.')[0];
    };

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    const tglJamDokumen = moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYY-MM-DD HH:mm:ss');

    const updatedTglJamDokumen = moment(tglJamDokumen)
        .set({
            hour: moment().hour(),
            minute: moment().minute(),
            second: moment().second(),
        })
        .format('YYYY-MM-DD HH:mm:ss');

    const validate = async () => {
        const someNoAkunNull = gridAlokasiDana.dataSource.some((item: any) => item.no_akun === null);
        const someNamaAkunNull = gridAlokasiDana.dataSource.some((item: any) => item.nama_akun === null);
        const someKreditNull = gridAlokasiDana.dataSource.some((item: any) => item.nilai_mu === 0);
        const isDepartmentNull = gridAlokasiDana.dataSource.some((item: any) => (item.tipe === 'Beban' || item.tipe === 'Beban Lain-Lain') && item.kode_dept === null);
        const isKaryawanNull = gridAlokasiDana.dataSource.some((item: any) => (item.tipe === 'Beban' || item.tipe === 'Beban Lain-Lain') && item.kode_kry === null);
        const isDivisiNull = gridAlokasiDana.dataSource.some(
            (item: any) => (item.tipe === 'Pendapatan' || item.tipe === 'Pendapatan Lain-Lain' || item.tipe === 'Beban' || item.tipe === 'Beban Lain-Lain') && item.kode_jual === null
        );
        const isSubledgerNull = gridAlokasiDana.dataSource.some((item: any) => item.tipe === 'Piutang' && item.nama_relasi === null);

        if (!terimaDari) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Terima dari belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (keterangan === '') {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Keterangan belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (someNoAkunNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">No akun pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (someNamaAkunNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Nama akun pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (someKreditNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Kredit(MU) pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (isSubledgerNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Akun Subledger pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (isDepartmentNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Department pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (isKaryawanNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Nama Karyawan pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (isDivisiNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Divisi pada data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (gridAlokasiDana.dataSource.length === 0) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Data alokasi belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (!dataJurnalHeader.kode_akun) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Akun debet belum diisi</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        if (selisih !== 0) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Pemasukan lain tidak bisa disimpan masih ada selisih Db/Kr</p>',
                width: '100%',
                target: '#dialogBMList',
            });
            return false;
        }

        const resultCekTglBackDate = await CekTglBackDate(dataListMutasibank === 'Y' ? date2.format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen);
        const date = moment(date2).format('YYYY-MM-DD HH:mm:ss');
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

            setShowModalBackdate(true);

            // withReactContent(swalDialog)
            //   .fire({
            //     title: `<p style="font-size:12px">Tanggal lebih kecil dari hari ini, transaksi akan dilanjutkan ?</span></p>`,
            //     target: '#dialogBMList',
            //     confirmButtonText: 'Yes',
            //     cancelButtonText: 'No', // Menambahkan teks tombol cancel
            //     showCancelButton: true, // Menampilkan tombol cancel
            //   })
            //   .then(async (result) => {
            //     if (result.isConfirmed) {
            //       const cekValidasiHeader = await cekSaldoValid(
            //         dataJurnalHeader.kode_akun,
            //         selectedSubledgerAllDataHeader.kode_subledger,
            //         date,
            //         Number(formatNumber(inputValueJumlah_mu)),
            //         kode_entitas,
            //         token
            //       );
            //       const cekValidasiDetail = await Promise.all(
            //         gridAlokasiDana.dataSource.map(async (item: any) => {
            //           return await cekSaldoValid(item.kode_akun, item.kode_subledger, date, SpreadNumber(item.nilai_mu), kode_entitas, token);
            //         })
            //       );

            //       if (cekValidasiDetail.includes(false) || cekValidasiHeader === false) {
            //         return;
            //       }

            //       saveDoc();
            //     }
            //   });
            return;
        }

        const cekValidasiHeader = await cekSaldoValid(dataJurnalHeader.kode_akun, selectedSubledgerAllDataHeader.kode_subledger, date, Number(formatNumber(inputValueJumlah_mu)), kode_entitas, token);
        const cekValidasiDetail = await Promise.all(
            gridAlokasiDana.dataSource.map(async (item: any) => {
                return await cekSaldoValid(item.kode_akun, item.kode_subledger, date, SpreadNumber(item.nilai_mu), kode_entitas, token);
            })
        );

        if (cekValidasiDetail.includes(false) || cekValidasiHeader === false) {
            return;
        }

        return saveDoc();
    };

    const handleSaveBackdate = async () => {
        setShowModalBackdate(false);
        const date = moment(date2).format('YYYY-MM-DD HH:mm:ss');
        const cekValidasiHeader = await cekSaldoValid(dataJurnalHeader.kode_akun, selectedSubledgerAllDataHeader.kode_subledger, date, Number(formatNumber(inputValueJumlah_mu)), kode_entitas, token);
        const cekValidasiDetail = await Promise.all(
            gridAlokasiDana.dataSource.map(async (item: any) => {
                return await cekSaldoValid(item.kode_akun, item.kode_subledger, date, SpreadNumber(item.nilai_mu), kode_entitas, token);
            })
        );

        if (cekValidasiDetail.includes(false) || cekValidasiHeader === false) {
            return;
        }

        return saveDoc();
    };

    const saveDoc = async () => {
        const modifiedDetailJurnal = gridAlokasiDana.dataSource.map((item: any) => {
            const { no_akun, nama_akun, nama_relasi, nama_dept, nama_kry, nama_jual, nilai_mu, ...value } = item;

            let debet_rp = '0';
            let kredit_rp = '0';
            let jumlahRp = '0';

            // Mengikuti logika selisih positif/negatif dari kode Delphi
            if (nilai_mu > 0) {
                // Jika selisih positif: debet = 0, kredit = nilai absolut
                debet_rp = '0';
                kredit_rp = String(Math.abs(nilai_mu));
                // Ketika ada kredit_rp, jumlah_rp menjadi minus
                jumlahRp = String(-Math.abs(nilai_mu));
            } else if (nilai_mu < 0) {
                // Jika selisih negatif: kredit = 0, debet = nilai absolut
                kredit_rp = '0';
                debet_rp = String(Math.abs(nilai_mu));
                // Ketika ada debet_rp, jumlah_rp menjadi positif
                jumlahRp = String(Math.abs(nilai_mu));
            }

            return {
                ...value,
                tgl_dokumen: dataListMutasibank === 'Y' ? `${date2.format('YYYY-MM-DD')} ${moment().format('HH:mm:ss')}` : updatedTglJamDokumen,
                tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                tgl_valuta: dataListMutasibank === 'Y' ? `${date2.format('YYYY-MM-DD')} ${moment().format('HH:mm:ss')}` : updatedTglJamDokumen,
                debet_rp,
                kredit_rp,
                jumlah_rp: jumlahRp,
                jumlah_mu: jumlahRp,
                approval: 'N',
                posting: 'N',
                rekonsiliasi: dataListMutasibank === 'Y' ? 'N' : 'Y',
                tgl_rekonsil: dataListMutasibank === 'Y' ? null : updatedTglJamDokumen,
                userid: userid.toUpperCase(),
            };
        });

        const noBm = await generateNU(kode_entitas, '', '17', dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM'));

        // console.log('dataJurnalforSaveDoc = ', dataJurnalforSaveDoc);
        const modifiedDataJurnalHeader = {
            ...dataJurnalforSaveDoc,
            tgl_dokumen: dataListMutasibank === 'Y' ? `${date2.format('YYYY-MM-DD')} ${moment().format('HH:mm:ss')}` : updatedTglJamDokumen,
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            tgl_valuta: dataListMutasibank === 'Y' ? `${date2.format('YYYY-MM-DD')} ${moment().format('HH:mm:ss')}` : updatedTglJamDokumen,
            debet_rp: stringToNumber(inputValueJumlah_mu),
            jumlah_rp: stringToNumber(inputValueJumlah_mu),
            jumlah_mu: stringToNumber(inputValueJumlah_mu),
            catatan: keterangan,
            rekonsiliasi: dataListMutasibank === 'Y' ? 'N' : 'Y',
            tgl_rekonsil: dataListMutasibank === 'Y' ? null : updatedTglJamDokumen,
            kode_subledger: selectedSubledgerAllDataHeader.kode_subledger === '' ? '' : selectedSubledgerAllDataHeader.kode_subledger,
            userid: userid.toUpperCase(),
        };

        // console.log('modifiedDataJurnalHeader = ', modifiedDataJurnalHeader);

        const pajak = await isEntitasPajak(kode_entitas, userid, token);

        const reqBody = {
            entitas: kode_entitas,
            bm_pos: 'N',
            param2: selectedRowStatus,
            kode_dokumen: statusPage === 'EDIT' ? kode_bm : '',
            dokumen: 'BM',
            no_dokumen: statusPage === 'EDIT' ? mNoBM : noBm,
            tgl_dokumen: dataListMutasibank === 'Y' ? date2.format('YYYY-MM-DD HH:mm:ss') : updatedTglJamDokumen,
            no_warkat: null,
            tgl_valuta: null,
            kode_cust: selectedSubledgerAllDataHeader.kode_subledger === undefined ? null : selectedSubledgerAllDataHeader.kode_subledger,
            kode_akun_debet: dataJurnalHeader.kode_akun,
            kode_supp: null,
            kode_akun_kredit: null,
            kode_akun_diskon: null,
            kurs: kursHeader,
            debet_rp: String(totalDebet),
            kredit_rp: String(totalKredit),
            jumlah_rp: stringToNumber(inputValueJumlah_mu),
            jumlah_mu: stringToNumber(inputValueJumlah_mu),
            pajak: dataListMutasibank === 'Y' ? null : 'N',
            kosong: null,
            kepada: terimaDari,
            catatan: keterangan,
            status: 'Terbuka',
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            status_approved: null,
            tgl_approved: null,
            tgl_pengakuan: null,
            no_TTP: noTTP !== '' ? noTTP : null,
            tgl_TTP: null,
            kode_sales: kodeSales !== '' ? kodeSales : null,
            nama_sales: null,
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
            tgl_trxdokumen: date1.format('YYYY-MM-DD HH:mm:ss'),
            api_id: dataListMutasibank === 'Y' ? 0 : dataListMutasibank?.apiId,
            api_pending: dataListMutasibank === 'Y' ? null : dataListMutasibank?.apiPending,
            api_catatan: dataListMutasibank === 'Y' ? null : dataListMutasibank?.description,
            api_norek: dataListMutasibank === 'Y' ? '' : dataListMutasibank?.noRekeningApi,
            kode_aktiva: null,
            kode_um: null,
            no_kontrak_um: null,
            isEntitasPajak: pajak ? 'Y' : 'N',
            jurnal: [modifiedDataJurnalHeader, ...modifiedDetailJurnal],
        };

        // console.log(modifiedDataJurnalHeader);
        // console.log(...modifiedDetailJurnal);
        // console.log('reqBody = ', reqBody);

        try {
            startProgress();
            let responseAPI;

            if (statusPage === 'CREATE' && isApprovedData === 'N') {
                let noDokApprove;
                const cekDataMaster = await cekDataDiDatabase(kode_entitas, 'tb_m_keuangan_master', 'no_dokumen', reqBody.no_dokumen, token);
                const cekData = await cekDataDiDatabase(kode_entitas, 'tb_m_keuangan', 'no_dokumen', reqBody.no_dokumen, token);

                if (cekDataMaster) {
                    const cekNoDok = await cekNoDokTerakhir(kode_entitas, 'tb_m_keuangan_master', 'BM', '0', '', token);
                    if (cekNoDok.length > 0) {
                        await generateNU(
                            kode_entitas,
                            cekNoDok[0].strnum,
                            '17',
                            dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM')
                        );

                        noDokApprove = await generateNU(
                            kode_entitas,
                            '',
                            '17',
                            dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM')
                        );

                        reqBody.no_dokumen = noDokApprove;
                    }
                } else if (cekData) {
                    const cekNoDok = await cekNoDokTerakhir(kode_entitas, 'tb_m_keuangan', 'BM', '0', '', token);
                    if (cekNoDok.length > 0) {
                        await generateNU(
                            kode_entitas,
                            cekNoDok[0].strnum,
                            '17',
                            dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM')
                        );

                        noDokApprove = await generateNU(
                            kode_entitas,
                            '',
                            '17',
                            dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM')
                        );

                        reqBody.no_dokumen = noDokApprove;
                    }
                }

                if (dataListMutasibank === 'Y') {
                    responseAPI = await axios.post(`${apiUrl}/erp/simpan_bm`, reqBody, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } else {
                    // ini nanti dibenrinndulu sama juan APInya
                    responseAPI = await axios.post(`${apiUrl}/erp/simpan_bm_mutasi_bank`, reqBody, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            } else if (statusPage === 'EDIT' && isApprovedData === 'N') {
                responseAPI = await axios.patch(`${apiUrl}/erp/update_pemasukkan_lain_bm`, reqBody, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (isApprovedData === 'Y') {
                let noDokApprove;

                const cekData = await cekDataDiDatabase(kode_entitas, 'tb_m_keuangan', 'no_dokumen', reqBody.no_dokumen, token);

                if (cekData) {
                    const cekNoDok = await cekNoDokTerakhir(kode_entitas, 'tb_m_keuangan_master', 'BM', '0', '', token);
                    if (cekNoDok.length > 0) {
                        await generateNU(
                            kode_entitas,
                            cekNoDok[0].strnum,
                            '17',
                            dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM')
                        );

                        noDokApprove = await generateNU(
                            kode_entitas,
                            '',
                            '17',
                            dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM')
                        );

                        reqBody.no_dokumen = noDokApprove;
                    }
                }

                responseAPI = await axios.post(`${apiUrl}/erp/approval_pemasukkan_lain_bm`, reqBody, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            if (responseAPI && responseAPI.data.status === true) {
                if (statusPage === 'CREATE' && isApprovedData === 'N') {
                    await generateNU(kode_entitas, noBm, '17', dataListMutasibank === 'Y' ? moment().format('YYYYMM') : moment(dataListMutasibank?.tglTransaksiMutasi).format('YYYYMM'));
                    handleUpload(responseAPI.data.kode_dokumen);

                    const auditReqBody = {
                        entitas: kode_entitas,
                        kode_audit: null,
                        dokumen: 'BM',
                        kode_dokumen: responseAPI.data.kode_dokumen,
                        no_dokumen: mNoBM,
                        tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                        proses: 'NEW',
                        diskripsi: `BM item = ${gridAlokasiDana.dataSource.length} nilai transaksi ${inputValueJumlah_mu}`,
                        userid: userid,
                        system_user: '', //username login
                        system_ip: '', //ip address
                        system_mac: '', //mac address
                    };

                    //       console.log('Audit Request Body:', auditReqBody);

                    await axios.post(`${apiUrl}/erp/simpan_audit`, auditReqBody);

                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Input Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogBMList',
                    });
                    endProgress();
                } else if (statusPage === 'EDIT' && isApprovedData === 'N') {
                    handleUpload(kode_bm);
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Edit Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogBMList',
                    });
                    endProgress();
                } else if (isApprovedData === 'Y') {
                    handleUpload(kode_bm);
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Approve Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogBMList',
                    });
                    endProgress();
                }

                setTimeout(async () => {
                    dialogClose();
                    const data = await onRefresh();
                    // if (gridList) {
                    //     gridList.current?.setProperties({ dataSource: data });
                    //     gridList.current?.refresh();
                    // }
                }, 1500);
            } else {
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: `<p style="font-size:12px">Gagal Menyimpan Data: ${responseAPI?.data.message}</p>`,
                    width: '100%',
                    target: '#dialogBMList',
                });
                endProgress();
            }
        } catch (error) {
            console.error('Error:', error);
            endProgress();
        } finally {
            endProgress();
        }
    };

    // FILE PENDUKUNG
    const [jsonImageEdit, setJsonImageEdit] = useState([]);

    const handleUpload = async (kode_dokumen: any) => {
        if (uploaderRef.current && uploaderRef2.current && uploaderRef3.current && uploaderRef4.current) {
            const filesArray = [
                preview
                    ? [{ rawFile: await fetch(preview).then((res) => res.blob()), fileName: nameImage, originalName: uploaderRef.current.getFilesData()[0]?.name }]
                    : uploaderRef.current.getFilesData(),
                preview2
                    ? [{ rawFile: await fetch(preview2).then((res) => res.blob()), fileName: nameImage2, originalName: uploaderRef2.current.getFilesData()[0]?.name }]
                    : uploaderRef2.current.getFilesData(),
                preview3
                    ? [{ rawFile: await fetch(preview3).then((res) => res.blob()), fileName: nameImage3, originalName: uploaderRef3.current.getFilesData()[0]?.name }]
                    : uploaderRef3.current.getFilesData(),
                preview4
                    ? [{ rawFile: await fetch(preview4).then((res) => res.blob()), fileName: nameImage4, originalName: uploaderRef4.current.getFilesData()[0]?.name }]
                    : uploaderRef4.current.getFilesData(),
            ];

            const nameImages = [nameImage, nameImage2, nameImage3, nameImage4];
            const zip = new JSZip();
            let filesAdded = false;

            filesArray.forEach((files, index) => {
                if (files.length > 0) {
                    const file = files[0].rawFile;
                    zip.file(nameImages[index], file);
                    filesAdded = true;
                }
            });

            if (filesAdded) {
                try {
                    console.log(kode_dokumen, 'kode_dokumen');
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    const formData = new FormData();
                    formData.append('myimage', zipBlob);
                    formData.append('ets', kode_entitas);
                    formData.append('nama_file_image', `IMG_${kode_dokumen}.zip`); // dari response simpan bm

                    const response = await axios.post(`${apiUrl}/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (response.status === 200) {
                        const result = response.data;
                        // console.log('Upload successful:', result);
                        // myAlert('Berhasil Upload');

                        const createJson = (id: any, nameImage: any, originalName: any) => ({
                            entitas: kode_entitas,
                            kode_dokumen: kode_dokumen,
                            id_dokumen: id,
                            dokumen: 'BM',
                            filegambar: nameImage,
                            fileoriginal: originalName,
                        });

                        const jsonZip: any = {
                            entitas: kode_entitas,
                            kode_dokumen: kode_dokumen,
                            id_dokumen: '999', //default
                            dokumen: 'BM',
                            filegambar: `IMG_${kode_dokumen}.zip`, // dari response simpan
                            fileoriginal: 'default.zip',
                        };

                        const combinedArray = filesArray.map((files, index) => (files.length > 0 ? createJson(index + 1, nameImages[index], files[0].originalName) : null)).filter(Boolean);

                        combinedArray.push(jsonZip);

                        // console.log(combinedArray);
                        // console.log(jsonImageEdit);

                        // jika edit
                        // cari id yang tidak ada disini untuk dihapus
                        if (statusPage === 'EDIT') {
                            const combinedIds = combinedArray.map((item: any) => item.id_dokumen.toString());
                            const editIds = jsonImageEdit.map((item: any) => item.id_dokumen.toString());
                            const missingIds = editIds.filter((id) => !combinedIds.includes(id));
                            const paramsArrayDelete = missingIds.join(',');
                            // console.log(paramsArrayDelete);
                            if (paramsArrayDelete !== '') {
                                //DELETE TB_IMAGES
                                try {
                                    const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                                        params: {
                                            entitas: kode_entitas,
                                            param1: kode_dokumen,
                                            param2: paramsArrayDelete, // Sesuaikan dengan data yang diperlukan untuk menghapus
                                        },
                                    });
                                    console.log('Response dari penghapusan file pendukung:', response.data);
                                } catch (error) {
                                    console.error('Error saat menghapus file pendukung:', error);
                                }
                            } else {
                                console.log('tidak ada yg perlu dihapus');
                            }
                        }

                        // INSERT
                        try {
                            // Simpan data ke database
                            const insertResponse = await axios.post(`${apiUrl}/erp/simpan_tbimages`, combinedArray);
                            console.log(insertResponse);
                        } catch (error) {
                            console.error('Error saat menyimpan data baru:', error);
                        }
                    } else {
                        console.error('Upload failed:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            } else {
                // console.log('Tanpa Gambar // tidak ada perubahan');

                //kondisi jika gambar dihapus semua
                // console.log(jsonImageEdit);
                //hapus semua
                if (jsonImageEdit.length > 0) {
                    try {
                        const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                            params: {
                                entitas: kode_entitas,
                                param1: kode_dokumen,
                                param2: '1,2,3,4,999', // Sesuaikan dengan data yang diperlukan untuk menghapus
                            },
                        });
                        // console.log('Response dari penghapusan file pendukung:', response.data);
                    } catch (error) {
                        console.error('Error saat menghapus file pendukung:', error);
                    }
                }
            }
        } else {
            console.log('Uploader refs are not defined');
        }
    };

    // DETAIL
    useEffect(() => {
        const Async = async () => {
            if (statusPage === 'EDIT') {
                //LOAD DAN EXTRACT saat posisi EDIT
                const loadtbImages = await axios.get(`${apiUrl}/erp/load_images`, {
                    params: {
                        entitas: kode_entitas,
                        param1: kode_bm,
                    },
                });

                const result = loadtbImages.data.data;
                // console.log(result);
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
                            entitas: kode_entitas,
                            nama_zip: zipData.filegambar,
                        },
                    });

                    const images = loadImage.data.images;

                    const nameSetters = [setNameImage, setNameImage2, setNameImage3, setNameImage4];
                    const previewSetters = [setPreview, setPreview2, setPreview3, setPreview4];

                    imagesMap.forEach((filegambar, index) => {
                        if (filegambar) {
                            const fileUri = images.find((item: any) => item.fileName == filegambar);
                            if (fileUri) {
                                previewSetters[index](fileUri.imageUrl);
                                nameSetters[index](fileUri.fileName);
                            }
                        }
                    });
                } else {
                    console.error('Zip data not found');
                }
                //END
            }
        };
        Async();
    }, [kode_entitas, kode_bm]);

    const [selectedHead, setSelectedHead] = useState('1');
    let uploaderRef: any = useRef<UploaderComponent>(null);
    let uploaderRef2: any = useRef<UploaderComponent>(null);
    let uploaderRef3: any = useRef<UploaderComponent>(null);
    let uploaderRef4: any = useRef<UploaderComponent>(null);
    const [preview, setPreview] = useState<any>(null);
    const [preview2, setPreview2] = useState<any>(null);
    const [preview3, setPreview3] = useState<any>(null);
    const [preview4, setPreview4] = useState<any>(null);
    const [nameImage, setNameImage] = useState<any>(null);
    const [nameImage2, setNameImage2] = useState<any>(null);
    const [nameImage3, setNameImage3] = useState<any>(null);
    const [nameImage4, setNameImage4] = useState<any>(null);

    const handleFileSelect = (args: any, jenis: any) => {
        const file = args.filesData[0].rawFile;
        const fileName = file.name.toLowerCase(); // Ubah nama file ke huruf kecil
        const lastDotIndex = fileName.lastIndexOf('.');
        const fileExtension = fileName.slice(lastDotIndex + 1).toLowerCase();
        // console.log(fileExtension);

        if (jenis === '1') {
            setNameImage('BM' + moment().format('YYMMDDHHmmss') + '.' + fileExtension);
        } else if (jenis === '2') {
            setNameImage2('BM' + moment().format('YYMMDDHHmmss') + '.' + fileExtension);
        } else if (jenis === '3') {
            setNameImage3('BM' + moment().format('YYMMDDHHmmss') + '.' + fileExtension);
        } else if (jenis === '4') {
            setNameImage4('BM' + moment().format('YYMMDDHHmmss') + '.' + fileExtension);
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            const IDjenisGambar = document.getElementsByClassName('e-upload-files');
            if (IDjenisGambar.length > 0) {
                if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
                    if (jenis === '1') {
                        setPreview(e.target.result as string);
                        IDjenisGambar[0]?.setAttribute('id', jenis);
                    } else if (jenis === '2') {
                        setPreview2(e.target.result as string);
                        IDjenisGambar[1]?.setAttribute('id', jenis);
                    } else if (jenis === '3') {
                        setPreview3(e.target.result as string);
                        IDjenisGambar[2]?.setAttribute('id', jenis);
                    } else if (jenis === '4') {
                        setPreview4(e.target.result as string);
                        IDjenisGambar[3]?.setAttribute('id', jenis);
                    }
                } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                    if (jenis === '1') {
                        setPreview(resExcel);
                        IDjenisGambar[0]?.setAttribute('id', jenis);
                    } else if (jenis === '2') {
                        setPreview2(resExcel);
                        IDjenisGambar[1]?.setAttribute('id', jenis);
                    } else if (jenis === '3') {
                        setPreview3(resExcel);
                        IDjenisGambar[2]?.setAttribute('id', jenis);
                    } else if (jenis === '4') {
                        setPreview4(resExcel);
                        IDjenisGambar[3]?.setAttribute('id', jenis);
                    }
                } else if (fileExtension === 'doc' || fileExtension === 'docx') {
                    if (jenis === '1') {
                        setPreview(resWord);
                    } else if (jenis === '2') {
                        setPreview2(resWord);
                    } else if (jenis === '3') {
                        setPreview3(resWord);
                    } else if (jenis === '4') {
                        setPreview4(resWord);
                    }
                } else if (fileExtension === 'zip' || fileExtension === 'rar') {
                    if (jenis === '1') {
                        setPreview(resZip);
                    } else if (jenis === '2') {
                        setPreview2(resZip);
                    } else if (jenis === '3') {
                        setPreview3(resZip);
                    } else if (jenis === '4') {
                        setPreview4(resZip);
                    }
                } else if (fileExtension === 'pdf') {
                    if (jenis === '1') {
                        setPreview(resPdf);
                    } else if (jenis === '2') {
                        setPreview2(resPdf);
                    } else if (jenis === '3') {
                        setPreview3(resPdf);
                    } else if (jenis === '4') {
                        setPreview4(resPdf);
                    }
                } else {
                    if (jenis === '1') {
                        setPreview(resUnknow);
                    } else if (jenis === '2') {
                        setPreview2(resUnknow);
                    } else if (jenis === '3') {
                        setPreview3(resUnknow);
                    } else if (jenis === '4') {
                        setPreview4(resUnknow);
                    }
                }
            } else {
                console.error("No elements found with class 'e-upload-files'");
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (jenis: any) => {
        const element: any = document.getElementById(jenis);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
        if (jenis === '1') {
            setPreview(null);
        } else if (jenis === '2') {
            setPreview2(null);
        } else if (jenis === '3') {
            setPreview3(null);
        } else if (jenis === '4') {
            setPreview4(null);
        } else if (jenis === 'all') {
            withReactContent(Swal)
                .fire({
                    html: 'Apakah anda akan membersihkan semua gambar?',
                    width: '20%',
                    target: '#dialogBMList',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        setPreview(null);
                        setPreview2(null);
                        setPreview3(null);
                        setPreview4(null);
                        const elements: any = document.getElementsByClassName('e-upload-file-list');
                        while (elements.length > 0) {
                            elements[0].parentNode.removeChild(elements[0]);
                        }
                    } else {
                        console.log('cancel');
                    }
                });
        }
    };

    const kalkulasiJurnal = () => {
        // Check if there's data in the grid
        if (!gridAlokasiDana.dataSource || gridAlokasiDana.dataSource.length === 0) {
            setTotalKredit(0);
            setTotalDebet(0);
            setSelisih(0);
            return;
        }

        let newTotalKredit = 0;
        let newTotalDebet = 0;

        // Iterate through all data in the grid
        gridAlokasiDana.dataSource.forEach((item: any) => {
            const nilai_mu = Number(item.nilai_mu);

            if (nilai_mu > 0) {
                // Jika nilai_mu positif, masuk ke kredit
                newTotalKredit += nilai_mu;
            } else {
                // Jika nilai_mu negatif, masuk ke debit (gunakan Math.abs untuk mengubah ke positif)
                newTotalDebet += Math.abs(nilai_mu);
            }
        });

        // Tambahkan inputValueJumlah_mu ke total debit
        if (inputValueJumlah_mu) {
            newTotalDebet += stringToNumber(inputValueJumlah_mu);
        }

        setTotalKredit(newTotalKredit);
        setTotalDebet(newTotalDebet);

        // Hitung selisih
        const newSelisih = newTotalDebet - newTotalKredit;
        setSelisih(newSelisih);
    };

    // DELETE DATA DI ALOKASI DANA
    const DetailAlokasiDanaDelete = () => {
        withReactContent(Swal)
            .fire({
                html: `Hapus data di baris ${selectedRowIndex + 1}?`,
                width: '15%',
                target: '#dialogBMList',
                showCancelButton: true,
                confirmButtonText: '<p style="font-size:10px">Ya</p>',
                cancelButtonText: '<p style="font-size:10px">Tidak</p>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    gridAlokasiDana.dataSource.splice(selectedRowIndex, 1);
                    gridAlokasiDana.dataSource.forEach((item: any, index: any) => {
                        item.id = index + 1;
                    });
                    gridAlokasiDana.refresh();
                } else {
                    console.log('cancel');
                }
            });
    };

    const DetailAlokasiDanaAll = () => {
        withReactContent(Swal)
            .fire({
                html: 'Hapus semua data barang?',
                width: '15%',
                target: '#dialogBMList',
                showCancelButton: true,
                confirmButtonText: '<p style="font-size:10px">Ya</p>',
                cancelButtonText: '<p style="font-size:10px">Tidak</p>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    // Clear the grid data
                    gridAlokasiDana.dataSource.splice(0, gridAlokasiDana.dataSource.length);
                    gridAlokasiDana.refresh();

                    // Reset the calculations
                    setTotalKredit(0);
                    setTotalDebet(0);
                    setSelisih(0);

                    // Reset other related states if needed
                    // setInputValueJumlah_mu('');  // If you want to reset this too
                } else {
                    console.log('cancel');
                }
            });
    };

    // IMAGE DOWNLOAD & PREVIEW
    const [modalPreview, setModalPreview] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const handlePreviewImage = (jenis: string) => {
        if (jenis === 'open') {
            setModalPreview(true);
        } else if (jenis === 'close') {
            setModalPreview(false);
        }
    };

    const handleDownloadImage = (jenis: string) => {
        const imageUrl = jenis === '1' ? preview : jenis === '2' ? preview2 : jenis === '3' ? preview3 : jenis === '4' ? preview4 : null;
        const fileName = jenis === '1' ? nameImage : jenis === '2' ? nameImage2 : jenis === '3' ? nameImage3 : jenis === '4' ? nameImage4 : null;

        if (!imageUrl || !fileName) {
            console.error('No image to download');
            return;
        }

        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    const imageSrc = selectedHead === '1' ? preview : selectedHead === '2' ? preview2 : selectedHead === '3' ? preview3 : selectedHead === '4' ? preview4 : null;

    useEffect(() => {
        if (modalPreview) {
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
    }, [modalPreview, handleMouseMove, handleMouseUp, handleWheel]);
    // ======================END IMAGE UPLOAD====================================

    return (
        <DialogComponent
            id="dialogBMList"
            isModal={true}
            width="85%"
            height="100%"
            visible={isOpen}
            close={() => {
                dialogClose();
            }}
            header={isApprovedData === 'Y' ? 'Pemasukan Lain (APPROVAL)' : statusPage === 'CREATE' ? 'Pemasukan Lain' : `Pemasukan Lain (EDIT) : ${noBukti} ${moment(tgl).format('DD-MM-YYYY')}`}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
        >
            <div style={{ minWidth: '70%', overflow: 'auto' }}>
                <div>
                    <div>
                        {/* ===============  Master Header Data ========================   */}
                        <div className="mb-1">
                            <div className="panel-tabel" style={{ width: '100%' }}>
                                <div className="mt-1 flex">
                                    <div style={{ width: '400px' }}>
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '22%', textAlign: 'right', marginRight: 6 }}>Tgl. Buat </label>
                                            <div className="form-input flex justify-between" style={{ borderRadius: 2, width: '140px', height: '35px' }}>
                                                <DatePickerComponent
                                                    locale="id"
                                                    cssClass="e-custom-style"
                                                    enableMask={true}
                                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                    showClearButton={false}
                                                    format="dd-MM-yyyy"
                                                    value={date1.toDate()}
                                                    disabled={true}
                                                >
                                                    <Inject services={[MaskedDateTime]} />
                                                </DatePickerComponent>
                                            </div>
                                        </div>

                                        <div className="mt-1 flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '22%', textAlign: 'right', marginRight: 6 }}>Tanggal</label>
                                            {dataListMutasibank?.tipeApi === 'API' ? (
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 4,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '140px',
                                                        borderRadius: 2,
                                                        height: '35px',
                                                    }}
                                                    disabled={true}
                                                    value={moment(dataListMutasibank?.tglTransaksiMutasi).format('DD-MM-YYYY')}
                                                    // value={moment(dataHeaderAPI.tglTransaksiMutasi).toDate()}
                                                    readOnly
                                                ></input>
                                            ) : (
                                                <>
                                                    <div className="form-input flex justify-between" style={{ borderRadius: 2, width: '140px', height: '35px' }}>
                                                        <DatePickerComponent
                                                            disabled={isButtonDisabled}
                                                            locale="id"
                                                            cssClass="e-custom-style"
                                                            placeholder="Tgl. PP"
                                                            showClearButton={false}
                                                            format="dd-MM-yyyy"
                                                            value={date2.toDate()}
                                                            change={(args: ChangeEventArgsCalendar) => {
                                                                if (args.value) {
                                                                    const selectedDate = moment(args.value);
                                                                    const hour = date2.hour() || moment().hour();
                                                                    const minute = date2.minute() || moment().minute();
                                                                    const second = date2.second() || moment().second();

                                                                    selectedDate.set({
                                                                        hour: hour,
                                                                        minute: minute,
                                                                        second: second,
                                                                    });
                                                                    setDate2(selectedDate);
                                                                } else {
                                                                    setDate2(moment());
                                                                }
                                                            }}
                                                        >
                                                            <Inject services={[MaskedDateTime]} />
                                                        </DatePickerComponent>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* No. Bukti */}
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '22%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>No. Bukti</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ width: '140px', background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                disabled={true}
                                                value={mNoBM}
                                                readOnly
                                            ></input>
                                        </div>

                                        {/* No Akun Kas */}
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '181px', textAlign: 'right', marginRight: 6, marginTop: 8 }}>No Akun Kas</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ width: '70px', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                disabled={true}
                                                value={dataListMutasibank?.tipeApi === 'API' ? noAkunAPi : noAkunValueHeader}
                                                readOnly
                                            ></input>

                                            <input
                                                className={`container form-input`}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                disabled={true}
                                                value={dataListMutasibank?.tipeApi === 'API' ? namaAkunAPi : namaAkunValueHeader}
                                                readOnly
                                            ></input>
                                            {dataListMutasibank?.tipeApi === 'API' ? (
                                                <div style={{ width: '14%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                                            ) : (
                                                <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        className="ml-2"
                                                        onClick={() => {
                                                            if (!isButtonDisabled && listDaftarAkunHeader.length > 0) {
                                                                vRefreshData.current += 1;
                                                                setModalDaftarAkunHeader(true);
                                                                setModalAkunSource('header');
                                                            }
                                                        }}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Subledger */}
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '131px', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Subledger</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                disabled={true}
                                                value={selectedSubledgerNamaRelasi}
                                                readOnly
                                            ></input>
                                            <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FontAwesomeIcon
                                                    icon={faList}
                                                    className="ml-2"
                                                    onClick={() => {
                                                        if (!isButtonDisabled) {
                                                            if (listSubledgerHeader.length > 0) {
                                                                setModalSubledgerHeader(true);
                                                            } else {
                                                                swal.fire({
                                                                    text: `Tidak ada subledger pada akun ${selectedJurnalHeader.nama_akun}`,
                                                                    icon: 'warning',
                                                                    target: '#dialogBMList',
                                                                });
                                                            }
                                                        }
                                                    }}
                                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '119px', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Terima Dari</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                defaultValue={terimaDari}
                                                disabled={isButtonDisabled}
                                                onBlur={handleTerima}
                                            ></input>
                                        </div>
                                        <div className="mb-3 flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '119px', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Keterangan</label>
                                            <textarea
                                                className={`container form-input`}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                defaultValue={keterangan}
                                                disabled={isButtonDisabled}
                                                onBlur={(event: any) => handleKeterangan(event.target.value)}
                                            ></textarea>
                                        </div>
                                        <div style={{ marginLeft: 10, color: 'darkgreen', fontWeight: 'bold' }}>{outputWordsJumlah_mu}</div>
                                    </div>

                                    {/* ///////// */}
                                    {/* SALDO KAS */}
                                    {/* ///////// */}

                                    <div style={{ width: '200px', marginTop: 120, marginLeft: 30, marginRight: 30 }}>
                                        <label style={{ width: '60px', textAlign: 'center' }}>Saldo Kas : {dataListMutasibank?.tipeApi === 'API' ? frmNumber(saldoBalance) : resultBalance}</label>
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '73px', textAlign: 'right', marginRight: 6 }}>Kurs</label>
                                            <div>
                                                <input
                                                    className={`container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 4,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '80%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={dataListMutasibank?.tipeApi === 'API' ? 1 : kursHeader}
                                                    readOnly
                                                ></input>
                                                <span style={{ fontSize: 11, fontWeight: 'bold', marginLeft: 4 }}>IDR</span>
                                            </div>
                                        </div>
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '65px', textAlign: 'right', marginRight: 6 }}>Jumlah (MU)</label>
                                            <input
                                                disabled={isButtonDisabled || dataListMutasibank?.tipeApi === 'API'}
                                                className={`container form-input`}
                                                value={dataListMutasibank?.tipeApi === 'API' ? frmNumber(dataListMutasibank?.jumlahMu) : inputValueJumlah_mu}
                                                onChange={handleInputChange}
                                                onBlur={handleInputBlur}
                                                onFocus={handleInputFocus}
                                                onKeyPress={(e) => {
                                                    if (!/^[0-9.]$/.test(e.key) || (e.key === '.' && e.currentTarget.value.includes('.'))) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                style={{
                                                    fontSize: 11,
                                                    marginTop: 4,
                                                    marginLeft: 0,
                                                    borderColor: '#bfc9d4',
                                                    width: '80%',
                                                    borderRadius: 2,
                                                    textAlign: 'right',
                                                    backgroundColor: dataListMutasibank?.tipeApi === 'API' ? '#eeeeee' : '#fff',
                                                }}
                                                readOnly={dataListMutasibank?.tipeApi === 'API'}
                                            ></input>
                                        </div>
                                    </div>

                                    {/* //////// */}
                                    {/* API BANK */}
                                    {/* //////// */}

                                    <div>
                                        <div style={{ alignItems: 'center' }}>
                                            <label>Keterangan API Bank</label>
                                            <textarea
                                                className={`container form-input`}
                                                style={{
                                                    background: '#eeeeee',
                                                    fontSize: 11,
                                                    marginTop: 4,
                                                    borderColor: '#bfc9d4',
                                                    width: '250px',
                                                    height: '70px',
                                                    borderRadius: 2,
                                                    resize: 'none',
                                                }}
                                                value={dataListMutasibank?.tipeApi === 'API' ? dataListMutasibank?.description : apiCatatan}
                                                disabled={true}
                                                readOnly
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ===============  Detail Data ========================   */}
                        <div
                            className="panel-tab"
                            style={{
                                background: '#f0f0f0',
                                width: '100%',
                                // height: '280px',
                                marginTop: 10,
                                borderRadius: 10,
                            }}
                        >
                            <TabComponent
                                //  ref={(t) => (tabBMList = t)}
                                selectedItem={isFilePendukung === 'Y' ? 1 : 0}
                                animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                // height="100%"
                            >
                                <div className="e-tab-header" style={{ display: 'flex' }}>
                                    <div tabIndex={0} style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}>
                                        Alokasi Dana
                                    </div>
                                    <div tabIndex={1} style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}>
                                        File Pendukung
                                    </div>
                                </div>

                                {/*===================== Content menampilkan alokasi dana =======================*/}
                                <div className="e-content">
                                    {/* //Alokasi Dana */}
                                    <div tabIndex={0} style={{ width: '100%', height: '280px', marginTop: '5px', padding: 10 }}>
                                        <TooltipComponent openDelay={1000} target=".e-headertext">
                                            <GridComponent
                                                id="gridAlokasiDana"
                                                name="gridAlokasiDana"
                                                className="gridAlokasiDana"
                                                locale="id"
                                                ref={(g) => (gridAlokasiDana = g)}
                                                editSettings={{
                                                    allowAdding: !isButtonDisabled,
                                                    allowEditing: !isButtonDisabled,
                                                    newRowPosition: 'Bottom',
                                                }}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowResizing={true}
                                                autoFit={true}
                                                rowHeight={22}
                                                height={170}
                                                gridLines={'Both'}
                                                actionBegin={actionBeginDetailJurnal}
                                                actionComplete={actionCompleteDetailJurnal}
                                                rowSelecting={rowSelectingDetailJurnalDetail}
                                                created={() => {}}
                                                allowKeyboard={false}
                                            >
                                                <ColumnsDirective>
                                                <ColumnDirective field="id" visible={false} isPrimaryKey />
                                                    <ColumnDirective
                                                        field="no_akun"
                                                        headerText="No. Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateNoAkunJurnal}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_akun"
                                                        headerText="Nama Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="220"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateNamaAkunJurnal}
                                                    />
                                                    <ColumnDirective
                                                        field="nilai_mu"
                                                        headerText="Kredit (MU)"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={true}
                                                        template={(props: any) => {
                                                            return <span>{props.nilai_mu ? parseFloat(props.nilai_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                        }}
                                                    />
                                                    <ColumnDirective
                                                        field="catatan"
                                                        headerText="Keterangan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={true}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_relasi"
                                                        headerText="Akun Pembantu (Subledger)"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="310"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateMaster_Subledger}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_dept"
                                                        headerText="Department"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="160"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateNamaDepartment}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_kry"
                                                        headerText="Nama Karyawan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateNamaKaryawan}
                                                    />
                                                    <ColumnDirective
                                                        field="kode_jual"
                                                        headerText="Divisi Penjualan"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateKodeJual}
                                                    />
                                                </ColumnsDirective>

                                                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                            </GridComponent>
                                        </TooltipComponent>
                                        <div style={{ paddingTop: 5 }}>
                                            <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                    <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                        <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                            <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                    <div className="mt-1 flex">
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
                                                                            type="button"
                                                                            cssClass="e-danger e-small"
                                                                            iconCss="e-icons e-small e-erase"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                            onClick={() => {
                                                                                DetailAlokasiDanaAll();
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div style={{ float: 'right', marginTop: -30 }}>
                                                                        <div style={{ marginBottom: '10px' }}>
                                                                            <div style={{ display: 'inline-block', marginRight: '10px', fontSize: '11px' }}>
                                                                                <b>Total Db/Kr :</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px', marginRight: '10px' }}>
                                                                                <b>{totalDebet ? frmNumber(totalDebet) : frmNumber(inputValueJumlah_mu)}</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px' }}>
                                                                                <b>{frmNumber(totalKredit)}</b>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ display: 'inline-block', marginRight: '10px', fontSize: '11px' }}>
                                                                                <b>Selisih :</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px' }}>
                                                                                <b>{frmNumber(selisih)}</b>
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

                                    <div tabIndex={1} style={{ width: '100%', height: '350px', marginTop: '5px', padding: 10 }}>
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
                                                    handleRemove(selectedHead);
                                                }}
                                            />
                                            <ButtonComponent
                                                id="cleanall"
                                                content="Bersihkan Semua Gambar"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-erase"
                                                style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    handleRemove('all');
                                                }}
                                            />

                                            <ButtonComponent
                                                id="savefile"
                                                content="Simpan ke File"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-download"
                                                style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    handleDownloadImage(selectedHead);
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
                                                            src={
                                                                selectedHead === '1'
                                                                    ? preview
                                                                    : selectedHead === '2'
                                                                    ? preview2
                                                                    : selectedHead === '3'
                                                                    ? preview3
                                                                    : selectedHead === '4'
                                                                    ? preview4
                                                                    : null
                                                            }
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
                                                            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
                                                            style={{
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                fontSize: '25px',
                                                            }}
                                                        />
                                                        <ButtonComponent
                                                            cssClass="e-flat e-primary"
                                                            iconCss="e-icons e-zoom-in"
                                                            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 6))}
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
                                                    onClick={() => setSelectedHead('1')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Nota Pendukung
                                                </div>
                                                <div
                                                    tabIndex={1}
                                                    onClick={() => setSelectedHead('2')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Bukti Persetujuan
                                                </div>
                                                <div
                                                    tabIndex={2}
                                                    onClick={() => setSelectedHead('3')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Bukti Pendukung 1
                                                </div>
                                                <div
                                                    tabIndex={3}
                                                    onClick={() => setSelectedHead('4')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Bukti Pendukung 2
                                                </div>
                                            </div>

                                            {/*===================== Content menampilkan data barang =======================*/}
                                            <div className="e-content">
                                                {/* //A */}
                                                <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload"
                                                                type="file"
                                                                ref={uploaderRef}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '1')}
                                                                removing={() => handleRemove('1')}
                                                            />
                                                        </div>
                                                        {preview && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* //B */}
                                                <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload2"
                                                                type="file"
                                                                ref={uploaderRef2}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '2')}
                                                                removing={() => handleRemove('2')}
                                                            />
                                                        </div>
                                                        {preview2 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview2} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* //C */}
                                                <div tabIndex={2} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload3"
                                                                type="file"
                                                                ref={uploaderRef3}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '3')}
                                                                removing={() => handleRemove('3')}
                                                            />
                                                        </div>
                                                        {preview3 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview3} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* //D */}
                                                <div tabIndex={4} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload4"
                                                                type="file"
                                                                ref={uploaderRef4}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '4')}
                                                                removing={() => handleRemove('4')}
                                                            />
                                                        </div>
                                                        {preview4 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview4} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabComponent>
                                    </div>

                                    {/* END FILE PENDUKUNG */}
                                </div>
                            </TabComponent>
                        </div>
                    </div>
                </div>

                {/* MODAL LIST DAFTAR AKUN JURNAL HEADER */}
                {modalDaftarAkunHeader && (
                    <DialogComponent
                        // ref={(d) => (gridDaftarAkunHeader = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Akun'}
                        // footerTemplate={footerTemplateJurnalHeader}
                        buttons={buttonDaftarAkunKas}
                        visible={modalDaftarAkunHeader}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="420"
                        height="450"
                        close={() => {
                            setSearchNoakunJurnalHeader('');
                            setSearchNamaAkunJurnalHeader('');

                            setModalAkunSource('');
                            const cariNamaAkunHeader = document.getElementById('cariNamaAkunHeader') as HTMLInputElement;
                            const cariNoAkunHeader = document.getElementById('cariNoAkunHeader') as HTMLInputElement;

                            if (cariNamaAkunHeader) {
                                cariNamaAkunHeader.value = '';
                            }

                            if (cariNoAkunHeader) {
                                cariNoAkunHeader.value = '';
                            }
                            setModalDaftarAkunHeader(false);
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                                <TextBoxComponent
                                    id="cariNoAkunHeader"
                                    className="searchtext"
                                    placeholder="Cari Nomor akun Jurnal"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNoakunJurnalHeader(value, setSearchNoakunJurnalHeader, setFilteredDataJurnalHeader, listDaftarAkunHeader);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                            <div className="form-input mb-1 mr-1">
                                <TextBoxComponent
                                    id="cariNamaAkunHeader"
                                    className="searchtext"
                                    placeholder="Cari Nama akun Jurnal"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaakunJurnalHeader(value, setSearchNamaAkunJurnalHeader, setFilteredDataJurnalHeader, listDaftarAkunHeader);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogJurnalHeaderList"
                            locale="id"
                            ref={gridJurnalHeaderList}
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNoAkunJurnalHeader !== '' || searchNamaAkunJurnalHeader !== '' ? filteredDataJurnalHeader : listDaftarAkunHeader}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'275'}
                            rowSelecting={(args: any) => {
                                // console.log(args.data);

                                setSelectedJurnalHeader(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihJurnal();
                                setSearchNoakunJurnalHeader('');
                                setSearchNamaAkunJurnalHeader('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="no_akun"
                                    template={gridIndukHeaderJurnal}
                                    headerText="Kode Akun"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="95"
                                    clipMode="EllipsisWithTooltip"
                                />
                                <ColumnDirective
                                    field="nama_akun"
                                    template={gridIndukHeaderJurnal}
                                    headerText="Nama Akun"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="280"
                                    clipMode="EllipsisWithTooltip"
                                />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                    </DialogComponent>
                )}
                {/* END MODAL LIST DAFTAR AKUN JURNAL HEADER */}

                {/* MODAL LIST DAFTAR AKUN JURNAL DETAIL */}
                {modalDaftarAkunDetail && (
                    <DialogComponent
                        // ref={(d) => (gridDaftarAkunDetail = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Akun'}
                        // footerTemplate={footerTemplateJurnalDetail}
                        buttons={buttonDaftarAkunKasDetail}
                        visible={modalDaftarAkunDetail}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="415"
                        height="480"
                        close={() => {
                            setSearchNoakunJurnalDetail('');
                            setSearchNamaAkunJurnalDetail('');
                            setModalAkunSource('');
                            const cariNamaAkunDetail = document.getElementById('cariNamaAkunDetail') as HTMLInputElement;
                            const cariNoAkunDetail = document.getElementById('cariNoAkunDetail') as HTMLInputElement;

                            if (cariNamaAkunDetail) {
                                cariNamaAkunDetail.value = '';
                            }

                            if (cariNoAkunDetail) {
                                cariNoAkunDetail.value = '';
                            }
                            setModalDaftarAkunDetail(false);
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                                <TextBoxComponent
                                    id="cariNoAkunDetail"
                                    className="searchtext"
                                    placeholder="Cari Nomor akun Jurnal"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNoakunJurnalDetail(value, setSearchNoakunJurnalDetail, setFilteredDataJurnalDetail, listDaftarAkunDetail);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                            <div className="form-input mb-1 mr-1">
                                <TextBoxComponent
                                    id="cariNamaAkunDetail"
                                    className="searchtext"
                                    placeholder="Cari Nama akun Jurnal"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaakunJurnalDetail(value, setSearchNamaAkunJurnalDetail, setFilteredDataJurnalDetail, listDaftarAkunDetail);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogJurnalDetailList"
                            ref={gridDaftarJurnalDetailList}
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNoAkunJurnalDetail !== '' || searchNamaAkunJurnalDetail !== '' ? filteredDataJurnalDetail : listDaftarAkunDetail}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'255'}
                            rowSelecting={(args: any) => {
                                setSelectedJurnalDetail(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihJurnal();
                                setSearchNoakunJurnalDetail('');
                                setSearchNamaAkunJurnalDetail('');
                            }}
                            allowPaging={false}
                            allowSorting={true}
                            pageSettings={{
                                pageSize: 10,
                                // pageCount: 10,
                                // pageSizes: ['10', '50', '100', 'All']
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective
                                    field="no_akun"
                                    template={gridIndukHeaderJurnal}
                                    headerText="Kode Akun"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="95"
                                    clipMode="EllipsisWithTooltip"
                                />
                                <ColumnDirective
                                    field="nama_akun"
                                    template={gridIndukHeaderJurnal}
                                    headerText="Nama Akun"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="280"
                                    clipMode="EllipsisWithTooltip"
                                />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                    </DialogComponent>
                )}
                {/* END MODAL LIST DAFTAR AKUN JURNAL DETAIL */}

                {/* MODAL LIST SUBLEDGER HEADER */}
                {modalSubledgerHeader && (
                    <DialogComponent
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Subledger'}
                        // footerTemplate={footerTemplateSubledgerHeader}
                        buttons={buttonDaftarSubledgerHeader}
                        visible={modalSubledgerHeader}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="415"
                        height="480"
                        close={() => {
                            setModalSubledgerHeader(false);
                            setSearchNoSubledger('');
                            setSearchNamaSubledger('');
                            const cariNamaSubledger = document.getElementById('cariNamaSubledger') as HTMLInputElement;
                            if (cariNamaSubledger) {
                                cariNamaSubledger.value = '';
                            }

                            const cariNoSubledger = document.getElementById('cariNoSubledger') as HTMLInputElement;
                            if (cariNoSubledger) {
                                cariNoSubledger.value = '';
                            }
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                                <TextBoxComponent
                                    id="cariNoSubledger"
                                    className="searchtext"
                                    placeholder="Cari Nomor Subledger"
                                    showClearButton={true}
                                    input={(args: any) => {
                                        const value: any = args.value;
                                        PencarianNoSubledgerHeader(value, setSearchNoSubledger, setFilteredDataSubledgerHeader, listSubledgerHeader);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                            <div className="form-input mb-1 mr-1">
                                <TextBoxComponent
                                    id="cariNamaSubledger"
                                    className="searchtext"
                                    placeholder="Cari Nama Subledger"
                                    showClearButton={true}
                                    input={(args: any) => {
                                        const value: any = args.value;
                                        PencarianNamaSubledgerHeader(value, setSearchNamaSubledger, setFilteredDataSubledgerHeader, listSubledgerHeader);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogSubledgerHeaderList"
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNoSubledger !== '' || searchNamaSubledger !== '' ? filteredDataSubledgerHeader : listSubledgerHeader}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'255'}
                            rowSelecting={(args: any) => {
                                setSelectedSubledgerHeader(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihSubledgerHeader();
                                setSearchNoSubledger('');
                                setSearchNamaSubledger('');
                            }}
                            allowPaging={false}
                            allowSorting={true}
                            pageSettings={{
                                pageSize: 10,
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_subledger" headerText="No Subledger" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_subledger" headerText="Nama Subledger" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection, Page, Resize]} />
                        </GridComponent>
                    </DialogComponent>
                )}
                {/* END MODAL LIST SUBLEDGER HEADER */}

                {/* MODAL LIST DAFTAR SUBLEDGER CUSTOMER */}
                {modalDaftarSubledgerCustomer && (
                    <DialogComponent
                        ref={(d) => (gridDaftarSubledgerCustomer = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Customer'}
                        visible={modalDaftarSubledgerCustomer}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="950"
                        height="400"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalDaftarSubledgerCustomer(false);
                            setSearchNoSublegerCustomer('');
                            setSearchNamaSublegerCustomer('');
                            setSearchSalesmanSublegerCustomer('');
                            (document.getElementsByName('searchNoSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            (document.getElementsByName('searchNamaSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            (document.getElementsByName('searchSalesmanSubledgerCustomer')[0] as HTMLFormElement).value = '';
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="searchNoSubledgerCustomer"
                                    name="searchNoSubledgerCustomer"
                                    className="searchNoSubledgerCustomer"
                                    placeholder="<No. Akun>"
                                    showClearButton={true}
                                    value={searchNoSubledgerCustomer}
                                    input={(args: FocusInEventArgs) => {
                                        (document.getElementsByName('searchNamaSubledgerCustomer')[0] as HTMLFormElement).value = '';
                                        (document.getElementsByName('searchSalesmanSubledgerCustomer')[0] as HTMLFormElement).value = '';
                                        setSearchNamaSublegerCustomer('');
                                        setSearchSalesmanSublegerCustomer('');
                                        const value: any = args.value;
                                        setSearchNoSublegerCustomer(value);
                                    }}
                                />
                            </div>
                            <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="searchNamaSubledgerCustomer"
                                    name="searchNamaSubledgerCustomer"
                                    className="searchNamaSubledgerCustomer"
                                    placeholder="<Nama Akun>"
                                    showClearButton={true}
                                    value={searchNamaSubledgerCustomer}
                                    input={(args: FocusInEventArgs) => {
                                        (document.getElementsByName('searchNoSubledgerCustomer')[0] as HTMLFormElement).value = '';
                                        (document.getElementsByName('searchSalesmanSubledgerCustomer')[0] as HTMLFormElement).value = '';
                                        setSearchNoSublegerCustomer('');
                                        setSearchSalesmanSublegerCustomer('');
                                        const value: any = args.value;
                                        setSearchNamaSublegerCustomer(value);
                                    }}
                                />
                            </div>
                            <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="searchSalesmanSubledgerCustomer"
                                    name="searchSalesmanSubledgerCustomer"
                                    className="searchSalesmanSubledgerCustomer"
                                    placeholder="<Nama Salesman>"
                                    showClearButton={true}
                                    value={searchSalesmanSubledgerCustomer}
                                    input={(args: FocusInEventArgs) => {
                                        (document.getElementsByName('searchNoSubledgerCustomer')[0] as HTMLFormElement).value = '';
                                        (document.getElementsByName('searchNamaSubledgerCustomer')[0] as HTMLFormElement).value = '';
                                        setSearchNoSublegerCustomer('');
                                        setSearchNamaSublegerCustomer('');
                                        const value: any = args.value;
                                        setSearchSalesmanSublegerCustomer(value);
                                    }}
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogSubledgerCustomer"
                            locale="id"
                            ref={gridDaftarSubledgerCustomerJurnal}
                            style={{ width: '100%', height: '75%' }}
                            dataSource={listDaftarSubledgerCustomer}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'220'}
                            rowSelecting={(args: any) => {
                                setSelectedSubledgerCustomer(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihSubledger_Customer();
                                setSearchNoSublegerCustomer('');
                                setSearchNamaSublegerCustomer('');
                                setSearchSalesmanSublegerCustomer('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_cust" headerText="Kode no_cust" headerTextAlign="Center" textAlign="Center" width="65" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_relasi" headerText="Nama Akun" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="status_warna" headerText="Info Detail" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection, Page, Resize]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                            onClick={() => setModalDaftarSubledgerCustomer(false)}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                            onClick={() => handlePilihSubledger_Customer()}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL LIST DAFTAR SUBLEDGER CUSTOMER */}

                {/* MODAL LIST DAFTAR SUBLEDGER DARI TABLE SUBLEDGER (ISLEDGER = Y) */}
                {modalDaftarSubledgerIsLedgerY && (
                    <DialogComponent
                        ref={(d) => (gridDaftarSubledgerIsLedgerY = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Subledger'}
                        visible={modalDaftarSubledgerIsLedgerY}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="500"
                        height="400"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalDaftarSubledgerIsLedgerY(false);
                            setSearchNoIsLedgerY('');
                            setSearchNamaIsLedgerY('');

                            const cariNoIsLedgerY = document.getElementById('cariNoIsLedgerY') as HTMLInputElement;
                            if (cariNoIsLedgerY) {
                                cariNoIsLedgerY.value = '';
                            }

                            const cariNamaIsLedgerY = document.getElementById('cariNamaIsLedgerY') as HTMLInputElement;
                            if (cariNamaIsLedgerY) {
                                cariNamaIsLedgerY.value = '';
                            }
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                                <TextBoxComponent
                                    id="cariNoIsLedgerY"
                                    className="searchtext"
                                    placeholder="Cari No. Subledger"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNoakunIsLedgerY(value, setSearchNoIsLedgerY, setFilteredDataIsLedgerY, listDaftarSubledgerIsLedgerY);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                            <div className="form-input mb-1 mr-1">
                                <TextBoxComponent
                                    id="cariNamaIsLedgerY"
                                    className="searchtext"
                                    placeholder="Cari Keterangan"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaakunIsLedgerY(value, setSearchNamaIsLedgerY, setFilteredDataIsLedgerY, listDaftarSubledgerIsLedgerY);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogSubledgerisLedgerY"
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNoIsLedgerY !== '' || searchNamaIsLedgerY !== '' ? filteredDataIsLedgerY : listDaftarSubledgerIsLedgerY}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'220'}
                            rowSelecting={(args: any) => {
                                setSelectedSubledgerIsLedgerY(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihSubledger_IsLedgerY();
                                setSearchNoIsLedgerY('');
                                setSearchNamaIsLedgerY('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_subledger" headerText="No Subledger" headerTextAlign="Center" textAlign="Center" width="65" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_subledger" headerText="keterangan" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                            onClick={() => setModalDaftarSubledgerIsLedgerY(false)}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                            onClick={() => handlePilihSubledger_IsLedgerY()}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL LIST DAFTAR SUBLEDGER DARI TABLE SUBLEDGER (ISLEDGER = Y) */}

                {/* MODAL LIST DAFTAR SUBLEDGER SUPPLIER */}
                {modalDaftarSubledgerSupplier && (
                    <DialogComponent
                        ref={(d) => (gridDaftarSubledgerSupplier = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Supplier'}
                        visible={modalDaftarSubledgerSupplier}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="500"
                        height="400"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalDaftarSubledgerSupplier(false);
                            setSearchNoSubledgerSupplier('');
                            setSearchNamaSubledgerSupplier('');

                            const cariNoSubledgerSupplier = document.getElementById('cariNoSubledgerSupplier') as HTMLInputElement;
                            if (cariNoSubledgerSupplier) {
                                cariNoSubledgerSupplier.value = '';
                            }

                            const cariNamaSubledgerSupplier = document.getElementById('cariNamaSubledgerSupplier') as HTMLInputElement;
                            if (cariNamaSubledgerSupplier) {
                                cariNamaSubledgerSupplier.value = '';
                            }
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                                <TextBoxComponent
                                    id="cariNoSubledgerSupplier"
                                    className="searchtext"
                                    placeholder="Cari No. Supplier"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNoSubledgerSupplier(value, setSearchNoSubledgerSupplier, setFilteredDataSubledgerSupplier, listDaftarSubledgerSupplier);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                            <div className="form-input mb-1 mr-1">
                                <TextBoxComponent
                                    id="cariNamaSubledgerSupplier"
                                    className="searchtext"
                                    placeholder="Cari Nama Supplier"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaSubledgerSupplier(value, setSearchNamaSubledgerSupplier, setFilteredDataSubledgerSupplier, listDaftarSubledgerSupplier);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogSubledgerSupplier"
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNoSubledgerSupplier !== '' || searchNamaSubledgerSupplier !== '' ? filteredDataSubledgerSupplier : listDaftarSubledgerSupplier}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'220'}
                            rowSelecting={(args: any) => {
                                setSelectedSubledgerSupplier(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihSubledgerSupplier();
                                setSearchNoSubledgerSupplier('');
                                setSearchNamaSubledgerSupplier('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_supp" headerText="No Supplier" headerTextAlign="Center" textAlign="Left" width="65" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" width="35" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_relasi" headerText="keterangan" headerTextAlign="Left" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                            onClick={() => setModalDaftarSubledgerSupplier(false)}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                            onClick={() => handlePilihSubledgerSupplier()}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL LIST DAFTAR SUBLEDGER SUPPLIER */}

                {/* MODAL LIST DAFTAR KARYAWAN */}
                {modalListKaryawan && (
                    <DialogComponent
                        ref={(d) => (gridDaftarKaryawan = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Karyawan'}
                        visible={modalListKaryawan}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="500"
                        height="400"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalListKaryawan(false);
                            setSearchNamaKaryawan('');

                            const cariNamaKaryawan = document.getElementById('cariNamaKaryawan') as HTMLInputElement;
                            if (cariNamaKaryawan) {
                                cariNamaKaryawan.value = '';
                            }
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="cariNamaKaryawan"
                                    className="searchtext"
                                    placeholder="Cari Nama Karyawan"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaKaryawan(value, setSearchNamaKaryawan, setFilteredDataNamaKaryawan, listKaryawan);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogListKaryawan"
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNamaKaryawan !== '' ? filteredDataNamaKaryawan : listKaryawan}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'220'}
                            rowSelecting={(args: any) => {
                                setSelectedKaryawan(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihKaryawan();
                                setSearchNamaKaryawan('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="kode_hrm" headerText="" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_kry" headerText="" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="jabatan" headerText="" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                            onClick={() => setModalListKaryawan(false)}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                            onClick={() => handlePilihKaryawan()}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL LIST DAFTAR KARYAWAN */}

                {/* MODAL LIST DEPARTMEN */}
                {modalListDepartment && (
                    <DialogComponent
                        ref={(d) => (gridDaftarDepartmen = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Departmen'}
                        visible={modalListDepartment}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="300"
                        height="400"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalListDepartment(false);
                            setSearchNamaDepartment('');

                            const cariNamaDepartment = document.getElementById('cariNamaDepartment') as HTMLInputElement;
                            if (cariNamaDepartment) {
                                cariNamaDepartment.value = '';
                            }
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="cariNamaDepartment"
                                    className="searchtext"
                                    placeholder="Cari Nama Departmen"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaDepartment(value, setSearchNamaDepartment, setFilteredDataDepartment, listDepartment);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogListDepartmen"
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNamaDepartment !== '' ? filteredDataDepartment : listDepartment}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'220'}
                            rowSelecting={(args: any) => {
                                setSelectedDepartment(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihDepartment();
                                setSearchNamaDepartment('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="nama_dept" headerText="" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                            onClick={() => setModalListDepartment(false)}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                            onClick={() => handlePilihDepartment()}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL LIST DEPARTMEN */}

                {/* DIALOG BACKDATE*/}
                {showModalBackdate && (
                    <DialogComponent
                        id="dialogBackdate"
                        ref={(d) => (gridDaftarDepartmen = d)}
                        target="#dialogBMList"
                        style={{ position: 'fixed', padding: '10px' }}
                        visible={showModalBackdate}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={false}
                        showCloseIcon={false}
                        width="500"
                        height="auto"
                        position={{ X: 'center', Y: 'center' }}
                        // close={() => {
                        //   setShowModalBackdate(false);
                        // }}
                        closeOnEscape={false}
                    >
                        <div>
                            <p className="text-center text-base text-black">Tanggal lebih kecil dari hari ini, transaksi akan dilanjutkan?</p>
                        </div>
                        <div className="flex flex-row-reverse items-center justify-center gap-1">
                            <ButtonComponent
                                id="buBatalDokumen1"
                                content="No"
                                cssClass="e-primary e-small"
                                style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                                onClick={() => setShowModalBackdate(false)}
                            />
                            <ButtonComponent
                                id="buSimpanDokumen1"
                                content="Yes"
                                cssClass="e-primary e-small"
                                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                                onClick={() => handleSaveBackdate()}
                            />
                        </div>
                    </DialogComponent>
                )}
                {/* END DIALOG BACKDATE */}

                {/* DIALOG PROGRESS BAR */}
                <GlobalProgressBar />
                {/* END DIALOG PROGRESS BAR */}

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
                    <ButtonComponent
                        id="buBatalDokumen1"
                        content="Batal"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-close"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={dialogClose}
                    />

                    <ButtonComponent
                        id="buSimpanDokumen1"
                        content="Simpan"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-save"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={() => {
                            validate();
                        }}
                    />
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogBMList;
