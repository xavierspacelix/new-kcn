import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
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
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from '../phulist.module.css';

// Pakai fungsi dari routines ============================
import { FillFromSQL, frmNumber, tanpaKoma } from '@/utils/routines';
//========================================================

import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ReCalcDataNodes } from './reCalc';
import {
    BayarSemuaFaktur,
    CekPeriodeAkutansiPencairanWarkat,
    CurrencyFormat,
    DetailNoFakturDelete,
    DetailNoFakturDeleteAll,
    DetailNoFakturJurnal,
    DetailNoFakturJurnalPencairanWarkat,
    FormatNilaiJumlah,
    GenerateTotalJurnal,
    HandleCariNoSj,
    HandleKeterangan,
    HandleModalInput,
    HandleModalInputSupplier,
    HandleModalicon,
    HandleSearchNamaAkun,
    HandleSearchNamaCust,
    HandleSearchNamaSales,
    HandleSearchNamaSubledger,
    HandleSearchNamaSupplier,
    HandleSearchNoAkun,
    HandleSearchNoCust,
    HandleSearchNoSubledger,
    HandleSearchNoSupplier,
    HandleTglDok,
    ResetPembayaran,
    TemplateNamaAkun,
    TemplateNoAkun,
    Terbilang,
    swalPopUp,
} from './fungsiFormPhuList';
import { CekSubledger, ListEditPHUDetail, ListEditPHUJurnal, ListEditPHUMaster } from '../model/apiPhu';
import {
    EditTemplateFaktur,
    EditTemplateHari,
    EditTemplateMu,
    EditTemplateNamaAkun,
    EditTemplateNoAkun,
    EditTemplateNoFb,
    EditTemplateNoSj,
    EditTemplateNoVch,
    EditTemplateSisa,
    EditTemplateSisaHutang,
    EditTemplateSubledger,
    EditTemplateTglFb,
    EditTemplateTglJt,
} from './template';
import DialogDaftarSubledger from '../modal/DialogDaftarSubledger';
import DialogDaftarCustomer from '../modal/DialogDaftarCustomer';
import DialogDaftarSupplier from '../modal/DialogDaftarSupplier';
import DialogDaftarUangMuka from '../modal/DialogDaftarUangMuka';
import DialogDaftarAkunKredit from '../modal/DialogDaftarAkunKredit';
import { GetListTabNoRek } from '@/lib/fa/mutasi-bank/api/api';
import { DaftarAkunDebet } from '../../ppi/model/apiPpi';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';

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
    modalJenisPembayaran: any;
    selectedKodeSupp: any;
    onRefreshTipe: any;
    plag: any;
    token: any;
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
    modalJenisPembayaran,
    selectedKodeSupp,
    onRefreshTipe,
    plag,
    token,
}: dialogPencairanWarkatProps) => {
    // data Header dari MUTASI API
    const [noAkunAPi, setNoAkunApi] = React.useState('');
    const [namaAkunAPi, setNamaAkun] = React.useState('');

    React.useEffect(() => {
        const async = async () => {
            if (masterBarangProduksi?.tipeApi === 'API' || masterBarangProduksi?.tipeApi === 'APIWarkat') {
                const respListTabNoRek = await GetListTabNoRek(kode_entitas, token);
                const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === masterBarangProduksi?.noRekeningApi);

                const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
                const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0].kode_akun);
                setNoAkunApi(respDaftarAkunKreditFix[0].no_akun);
                setNamaAkun(respDaftarAkunKreditFix[0].nama_akun);
                // masukan State untuk simpan data
                console.log('respDaftarAkunKreditFix = ', respDaftarAkunKreditFix);
                setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    noAkunValue: respDaftarAkunKreditFix[0].no_akun,
                    namaAkunValue: respDaftarAkunKreditFix[0].nama_akun,
                    jumlahBayar: masterBarangProduksi?.jumlahMu,
                    kodeAkun: respDaftarAkunKreditFix[0].kode_akun,
                    tglEfektif: moment(masterBarangProduksi?.tglTransaksiMutasi).format('YYYY-MM-DD HH:mm:ss'),
                }));

                FormatNilaiJumlah(String(masterBarangProduksi?.jumlahMu), setStateDataHeader, setDataBarang, setStateDataFooter);
                //END
            }
        };
        async();
    }, [onRefreshTipe]);

    const router = useRouter();

    // ========================================================================================
    // ========================== Fungsi dari PHU =============================================
    // ========================================================================================

    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();

    // State State Untuk Header
    const [stateDataHeader, setStateDataHeader] = useState({
        // ============================
        // boolean Dialog modal
        disabledBayarAllFaktur: true,
        dialogDaftarAkunKreditVisible: false,
        dialogDaftarSupplierVisible: false,
        dialogDaftarUangMukaVisible: false,
        disabledResetPembayaran: true,
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
        tipeAkunDialogVisible: 'header',
        kodeAkunHutangBg: 'AK0000000071',
        noAkunHutangBg: '2-10102',
        namaAkunHutangBg: 'Hutang Warkat Supplier',
        tipeAkunHutangBg: 'Hutang',
        // ============================

        // ============================
        //Search Modal Supplier
        searchNoSupplier: '',
        searchNamaSupplier: '',
        searchKeywordNoSupplier: '',
        searchKeywordNamaSupplier: '',
        //Input Value Akun Kredit
        noSupplierValue: '',
        namaSupplierValue: '',
        kodeSupplierValue: '',
        kodeAkunHutang: '',
        noHutang: '',
        namaHutang: '',
        tipeHutang: '',
        tipeSupplierDialogVisible: 'header',
        // ============================

        // ============================
        // lain lain
        tipeFilterOpen: '',
        tipeFocusOpen: '',
        pilihAkunKredit: false,
        noKontrakValue: '', // value No Kontrak
        noDokumenValue: '', // value No Dokumen
        kursValue: '', // Value Kurs
        pelunasanPajak: false, // disable checbox Pelunasan Pajak
        jumlahBayar: '',
        terbilangJumlah: '',
        tglDokumen: moment(),
        tglBuat: moment(),
        tglReferensi: moment(),
        noReferensi: '-',
        saldoKas: '',
        noBuktiTransfer: '',
        noWarkat: '',
        tglJt: moment(),
        tglEfektif: null,
        disableMenu: false,
        // ============================
    });
    // End

    // State State Untuk Detail
    const [stateDataDetail, setStateDataDetail] = useState({
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

        // Data Subledger Jurnal
        dialogDaftarSubledgerVisible: false,
        searchNoSubledger: '',
        searchNamaSubledger: '',
        searchKeywordNamaSubledger: '',
        searchKeywordNoSubledger: '',

        // Cari No Surat jalan
        searchNoSj: '',
        searchKeywordNoSj: '',
    });
    // End

    // State State Untuk Footer
    const [stateDataFooter, setStateDataFooter] = useState({
        // ============================
        // Lain Lain
        vKeterangan: '',
        totalHutang: 0,
        totalPembayaran: 0,
        sisaHutang: 0,
        selisihAlokasiDana: 0,
        // ============================
    });
    // End

    const [dataDaftarAkunKredit, setDataDaftarAkunKredit] = useState<any[]>([]);
    const [dataDaftarSupplier, setDataDaftarSupplier] = useState<any[]>([]);
    const [dataDaftarCustomer, setDataDaftarCustomer] = useState<any[]>([]);
    const [dataDaftarUangMuka, setDataDaftarUangMuka] = useState<any[]>([]);
    const [dataDaftarSubledger, setDataDaftarSubledger] = useState<any[]>([]);
    const [filteredDataAkunKredit, setFilteredDataAkunKredit] = useState<any[]>([]);
    const [filteredDataSupplier, setFilteredDataSupplier] = useState<any[]>([]);
    const [filteredDataCustomer, setFilteredDataCustomer] = useState<any[]>([]);
    const [filteredDataSubledger, setFilteredDataSubledger] = useState<any[]>([]);
    const [listDepartement, setListDepartement] = useState<any[]>([]);
    const [dateGenerateNu, setDateGenerateNu] = useState<moment.Moment>(moment());
    type DataNode = {
        // Tambahkan properti lainnya sesuai kebutuhan
        id: number;
        kode_dokumen: string;
        id_dokumen: string;
        kode_fb: string;
        bayar_mu: string;
        pajak: string;
        pay: string;
        bayar: any;
        byr: any;
        no_fb: any;
        tgl_fb: any;
        total_hutang: any;
        sisa_hutang: any;
        owing: any;
        faktur: any;
        lunas_mu: any;
        tot_pajak: any;
        lunas_pajak: any;
        tgl_jt: any;
        hari: any;
        no_sj: any;
        no_vch: any;
        no_inv: any;
        sisa: any;
        jumlah_pembayaran: any;
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
    };
    const [dataBarang, setDataBarang] = useState<{ nodes: DataNode[] }>({ nodes: [] });
    const [filteredDataBarang, setFilteredDataBarang] = useState<{ nodes: DataNode[] }>({ nodes: [] });
    const [dataJurnal, setDataJurnal] = useState<{ nodes: DataNodeJurnal[] }>({ nodes: [] });

    const [dataDetailNoFakturPhu, setDataDetailNoFakturPhu] = useState<any[]>([]);

    // =========================== Variabel untuk daftar Customer =============================
    //End

    const actionBeginDataJurnal = async (args: any) => {
        if (args.requestType === 'save') {
            if (dataJurnal.nodes.length > 0) {
                setDataJurnal((state: any) => {
                    // Mengecek apakah ada node yang memiliki 'no_sj' yang kosong
                    const hasEmptyNodes = state.nodes.some((node: any) => node.no_akun === '');
                    if (hasEmptyNodes === true) {
                    }

                    return {
                        ...state,
                    };
                });

                const newNodes = await dataJurnal.nodes.map((node: any) => {
                    return {
                        ...node,
                    };
                });

                await setDataJurnal({ nodes: newNodes });
            } else {
                setDataJurnal((state: any) => {
                    // Mengecek apakah ada node yang memiliki 'no_sj' yang kosong
                    const hasEmptyNodes = state.nodes.some((node: any) => node.no_akun === '');
                    if (hasEmptyNodes === true) {
                        withReactContent(swalDialog)
                            .fire({
                                title: ``,
                                html: '<p style="font-size:12px; margin-left: 46px;">Ada data jurnal yang kosong, hapus data jurnal</p>',
                                width: '280px',
                                heightAuto: true,
                                target: '#dialogPhuList',
                                focusConfirm: false,
                                // showCancelButton: true,
                                confirmButtonText: '&ensp; Hapus &ensp;',
                                // cancelButtonText: 'Tidak',
                                reverseButtons: true,
                                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                                customClass: {
                                    confirmButton: styles['custom-confirm-button'],
                                    // cancelButton: 'custom-cancel-button' // Jika Anda ingin mengatur warna untuk tombol batal juga
                                },
                            })
                            .then(async (result) => {
                                if (result.value) {
                                    setDataJurnal((state: any) => {
                                        const updatedNodes = state.nodes.filter((node: any) => node.no_akun !== null);
                                        return {
                                            ...state,
                                            nodes: updatedNodes,
                                        };
                                    });
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
        }
    };
    const actionCompleteDataJurnal = async (args: any) => {
        if (args.requestType === 'save' || args.requestType === 'refresh') {
            if (tipeDetailJurnal.current === '') {
                const newNodes = await dataJurnal.nodes.map((node: any) => {
                    return {
                        ...node,
                        departemen: node.departemen,
                        kode_dept: node.kode_dept,
                    };
                });

                await setDataJurnal({ nodes: newNodes });
            } else {
                let inputJurnalRef: any, idJurnalRef: any;
                if (tipeDetailJurnal.current === 'debetRp') {
                    inputJurnalRef = inputDebetJurnalRef.current;
                    idJurnalRef = rowIdJurnalRef.current;
                    reCall(tipeDetailJurnal.current, inputJurnalRef, setDataJurnal, idJurnalRef);
                } else if (tipeDetailJurnal.current === 'kreditRp') {
                    inputJurnalRef = inputKreditJurnalRef.current;
                    idJurnalRef = rowIdKreditJurnalRef.current;
                    reCall(tipeDetailJurnal.current, inputJurnalRef, setDataJurnal, idJurnalRef);
                } else if (tipeDetailJurnal.current === 'keterangan') {
                    inputJurnalRef = inputKetJurnalRef.current;
                    idJurnalRef = rowIdKetJurnalRef.current;
                    reCall(tipeDetailJurnal.current, inputJurnalRef, setDataJurnal, idJurnalRef);
                } else if (tipeDetailJurnal.current === 'kurs') {
                    inputJurnalRef = inputKursJurnalRef.current;
                    idJurnalRef = rowIdKursJurnalRef.current;
                    reCall(tipeDetailJurnal.current, inputJurnalRef, setDataJurnal, idJurnalRef);
                } else if (tipeDetailJurnal.current === 'jumlahMu') {
                    inputJurnalRef = inputJumlahMuJurnalRef.current;
                    idJurnalRef = rowIdJumlahMuJurnalRef.current;
                    reCall(tipeDetailJurnal.current, inputJurnalRef, setDataJurnal, idJurnalRef);
                } else if (tipeDetailJurnal.current === 'departemen') {
                    inputJurnalRef = inputDepartemenJurnalRef.current;
                    idJurnalRef = rowIdDepartemenJurnalRef.current;
                    await setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        selectedOptionDepartemen: inputJurnalRef.nama_dept,
                    }));
                    const newNodes = await dataJurnal.nodes.map((node: any) => {
                        if (node.id === idJurnalRef) {
                            return {
                                ...node,
                                departemen: inputJurnalRef.nama_dept,
                                kode_dept: inputJurnalRef.kode_dept,
                            };
                        } else {
                            return node;
                        }
                    });

                    await setDataJurnal({ nodes: newNodes });
                }
            }
        }
    };

    const inputDebetJurnalRef = useRef(null);
    const inputKreditJurnalRef = useRef(null);
    const inputKetJurnalRef = useRef(null);
    const inputKursJurnalRef = useRef(null);
    const inputJumlahMuJurnalRef = useRef(null);
    const inputDepartemenJurnalRef = useRef(null);

    const rowIdJurnalRef = useRef(null);
    const rowIdKreditJurnalRef = useRef(null);
    const rowIdKetJurnalRef = useRef(null);
    const rowIdKursJurnalRef = useRef(null);
    const rowIdJumlahMuJurnalRef = useRef(null);
    const rowIdDepartemenJurnalRef = useRef(null);

    const tipeDetailJurnal = useRef('');

    const reCall = async (tipe: string, value: any, setDataJurnal: any, rowsIdJurnal: any) => {
        if (tipe === 'debetRp') {
            const newNodes = await dataJurnal.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        debet_rp: parseFloat(value),
                        jumlah_mu: value * parseFloat(node.kurs),
                        kredit_rp: 0,
                    };
                } else {
                    return node;
                }
            });

            const totalDebet = newNodes.reduce((total: any, item: any) => {
                return total + parseFloat(item.debet_rp);
            }, 0);
            const totalKredit = newNodes.reduce((total: any, item: any) => {
                return total + parseFloat(item.kredit_rp);
            }, 0);

            const selisih = totalDebet - totalKredit;
            const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

            setStateDataDetail((prevState: any) => ({
                ...prevState,
                totalDebet: totalDebet,
                totalKredit: totalKredit,
                totalSelisih: nilaiSelisih,
            }));

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'kreditRp') {
            const newNodes = await dataJurnal.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        kredit_rp: parseFloat(value),
                        jumlah_mu: value * parseFloat(node.kurs) * -1,
                        debet_rp: 0,
                    };
                } else {
                    return node;
                }
            });

            const totalDebet = newNodes.reduce((total: any, item: any) => {
                return total + parseFloat(item.debet_rp);
            }, 0);
            const totalKredit = newNodes.reduce((total: any, item: any) => {
                return total + parseFloat(item.kredit_rp);
            }, 0);

            const selisih = totalDebet - totalKredit;
            const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

            setStateDataDetail((prevState: any) => ({
                ...prevState,
                totalDebet: totalDebet,
                totalKredit: totalKredit,
                totalSelisih: nilaiSelisih,
            }));

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'keterangan') {
            const newNodes = await dataJurnal.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        catatan: value,
                    };
                } else {
                    return node;
                }
            });

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'kurs') {
            const newNodes = await dataJurnal.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        kurs: value,
                        debet_rp: value * (node.debet_rp === 0 ? 0 : node.jumlah_mu),
                        kredit_rp: value * (node.kredit_rp === 0 ? 0 : node.jumlah_mu * -1),
                        jumlah_mu: node.jumlah_mu,
                    };
                } else {
                    return node;
                }
            });

            const totalDebet = newNodes.reduce((total: any, item: any) => {
                return total + parseFloat(item.debet_rp);
            }, 0);
            const totalKredit = newNodes.reduce((total: any, item: any) => {
                return total + parseFloat(item.kredit_rp);
            }, 0);

            const selisih = totalDebet - totalKredit;
            const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

            setStateDataDetail((prevState: any) => ({
                ...prevState,
                totalDebet: totalDebet,
                totalKredit: totalKredit,
                totalSelisih: nilaiSelisih,
            }));

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'jumlahMu') {
            const newNodes = await dataJurnal.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        jumlah_mu: value,
                        debet_rp: value * parseFloat(node.kurs),
                        kredit_rp: 0,
                        // kredit_rp: value * (node.kredit_rp === 0 ? 0 : parseFloat(node.kurs)),
                    };
                } else {
                    return node;
                }
            });

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'departemen') {
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                selectedOptionDepartemen: value.kode_dept,
            }));
            const newNodes = await dataJurnal.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        departemen: value.nama_dept,
                        kode_dept: value.kode_dept,
                    };
                } else {
                    return node;
                }
            });

            await setDataJurnal({ nodes: newNodes });
        }
    };

    const reCallEdit = (tipe: any, id: any, value: any) => {
        if (gridJurnalListRef.current && Array.isArray(gridJurnalListRef.current?.dataSource)) {
            // Salin array untuk menghindari mutasi langsung pada dataSource
            const dataSource = [...gridJurnalListRef.current.dataSource];
            if (tipe === 'debetRp') {
                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Modifikasi dataSource atau tambahkan baris baru
                const updatedDataSource = dataSource.map((item: any) => {
                    if (item.id === id) {
                        // Periksa apakah baris dengan id yang dimaksud ada
                        isRowUpdated = true;
                        return {
                            ...item,
                            debet_rp: parseFloat(value),
                            jumlah_mu: value * parseFloat(item.kurs),
                            kredit_rp: 0,
                        };
                    } else {
                        return item; // Kembalikan item yang tidak berubah
                    }
                });

                const totalDebet = updatedDataSource.reduce((total: any, item: any) => {
                    return total + parseFloat(item.debet_rp);
                }, 0);
                const totalKredit = updatedDataSource.reduce((total: any, item: any) => {
                    return total + parseFloat(item.kredit_rp);
                }, 0);

                const selisih = totalDebet - totalKredit;
                const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    totalDebet: totalDebet,
                    totalKredit: totalKredit,
                    totalSelisih: nilaiSelisih,
                }));

                // Perbarui dataSource pada grid
                gridJurnalListRef.current.dataSource = updatedDataSource;

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridJurnalListRef.current.refresh) {
                    gridJurnalListRef.current.refresh();
                }
            } else if (tipe === 'kreditRp') {
                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Modifikasi dataSource atau tambahkan baris baru
                const updatedDataSource = dataSource.map((item: any) => {
                    if (item.id === id) {
                        // Periksa apakah baris dengan id yang dimaksud ada

                        isRowUpdated = true;
                        return {
                            ...item,
                            kredit_rp: parseFloat(value),
                            jumlah_mu: value * parseFloat(item.kurs) * -1,
                            debet_rp: 0,
                        };
                    } else {
                        return item; // Kembalikan item yang tidak berubah
                    }
                });

                const totalDebet = updatedDataSource.reduce((total: any, item: any) => {
                    return total + parseFloat(item.debet_rp);
                }, 0);
                const totalKredit = updatedDataSource.reduce((total: any, item: any) => {
                    return total + parseFloat(item.kredit_rp);
                }, 0);

                const selisih = totalDebet - totalKredit;
                const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    totalDebet: totalDebet,
                    totalKredit: totalKredit,
                    totalSelisih: nilaiSelisih,
                }));

                // Perbarui dataSource pada grid
                gridJurnalListRef.current.dataSource = updatedDataSource;

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridJurnalListRef.current.refresh) {
                    gridJurnalListRef.current.refresh();
                }
            } else if (tipe === 'keterangan') {
                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Modifikasi dataSource atau tambahkan baris baru
                const updatedDataSource = dataSource.map((item: any) => {
                    if (item.id === id) {
                        // Periksa apakah baris dengan id yang dimaksud ada
                        isRowUpdated = true;
                        return {
                            ...item,
                            catatan: value,
                        };
                    } else {
                        return item; // Kembalikan item yang tidak berubah
                    }
                });

                // Perbarui dataSource pada grid
                gridJurnalListRef.current.dataSource = updatedDataSource;

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridJurnalListRef.current.refresh) {
                    gridJurnalListRef.current.refresh();
                }
            } else if (tipe === 'kurs') {
                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Modifikasi dataSource atau tambahkan baris baru
                const updatedDataSource = dataSource.map((item: any) => {
                    if (item.id === id) {
                        // Periksa apakah baris dengan id yang dimaksud ada
                        isRowUpdated = true;
                        return {
                            ...item,
                            kurs: value,
                            debet_rp: value * (item.debet_rp === 0 ? 0 : item.jumlah_mu),
                            kredit_rp: value * (item.kredit_rp === 0 ? 0 : item.jumlah_mu * -1),
                            jumlah_mu: item.jumlah_mu,
                        };
                    } else {
                        return item; // Kembalikan item yang tidak berubah
                    }
                });

                const totalDebet = updatedDataSource.reduce((total: any, item: any) => {
                    return total + parseFloat(item.debet_rp);
                }, 0);
                const totalKredit = updatedDataSource.reduce((total: any, item: any) => {
                    return total + parseFloat(item.kredit_rp);
                }, 0);

                const selisih = totalDebet - totalKredit;
                const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    totalDebet: totalDebet,
                    totalKredit: totalKredit,
                    totalSelisih: nilaiSelisih,
                }));

                // Perbarui dataSource pada grid
                gridJurnalListRef.current.dataSource = updatedDataSource;

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridJurnalListRef.current.refresh) {
                    gridJurnalListRef.current.refresh();
                }
            } else if (tipe === 'jumlahMu') {
                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Modifikasi dataSource atau tambahkan baris baru
                const updatedDataSource = dataSource.map((item: any) => {
                    if (item.id === id) {
                        // Periksa apakah baris dengan id yang dimaksud ada
                        isRowUpdated = true;
                        return {
                            ...item,
                            jumlah_mu: value,
                            debet_rp: value * parseFloat(item.kurs),
                            kredit_rp: 0,
                        };
                    } else {
                        return item; // Kembalikan item yang tidak berubah
                    }
                });

                // Perbarui dataSource pada grid
                gridJurnalListRef.current.dataSource = updatedDataSource;

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridJurnalListRef.current.refresh) {
                    gridJurnalListRef.current.refresh();
                }
            } else if (tipe === 'departemen') {
                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    selectedOptionDepartemen: value.kode_dept,
                }));

                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Modifikasi dataSource atau tambahkan baris baru
                const updatedDataSource = dataSource.map((item: any) => {
                    if (item.id === id) {
                        // Periksa apakah baris dengan id yang dimaksud ada
                        isRowUpdated = true;
                        return {
                            ...item,
                            departemen: value.nama_dept,
                            kode_dept: value.kode_dept,
                        };
                    } else {
                        return item; // Kembalikan item yang tidak berubah
                    }
                });

                // Perbarui dataSource pada grid
                gridJurnalListRef.current.dataSource = updatedDataSource;

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridJurnalListRef.current.refresh) {
                    gridJurnalListRef.current.refresh();
                }
            }
        }
    };

    const EditTemplateDebetRp = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <input
                        style={{ background: 'transparent' }}
                        id="debet_rp"
                        name="debet_rp"
                        onBlur={(event: any) => {
                            inputDebetJurnalRef.current = event.target.value;
                            rowIdJurnalRef.current = args.id;
                            tipeDetailJurnal.current = 'debetRp';
                            reCallEdit('debetRp', args.id, event.target.value);
                            // reCall(tipeDetailJurnal.current, inputDebetJurnalRef.current, setDataJurnal, rowIdJurnalRef.current);
                        }}
                        defaultValue={args.debet_rp}
                        onFocus={(event: any) => event.target.select()}
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
                    />
                </div>
            </div>
        );
    };

    const EditTemplateKreditRp = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <input
                        style={{ background: 'transparent' }}
                        id="kredit_rp"
                        name="kredit_rp"
                        onBlur={(event: any) => {
                            inputKreditJurnalRef.current = event.target.value;
                            rowIdJurnalRef.current = args.id;
                            tipeDetailJurnal.current = 'kreditRp';
                            reCallEdit('kreditRp', args.id, event.target.value);
                            // reCall(tipeDetailJurnal.current, inputKreditJurnalRef.current, setDataJurnal, rowIdJurnalRef.current);
                        }}
                        defaultValue={args.kredit_rp}
                        onFocus={(event: any) => event.target.select()}
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
                    />
                </div>
            </div>
        );
    };

    const EditTemplateKeterangan = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <TextBoxComponent
                        id="catatan"
                        name="catatan"
                        className="catatan"
                        blur={(d: ChangeEventArgsInput) => {
                            const value: any = d.value;
                            inputKetJurnalRef.current = value;
                            rowIdKetJurnalRef.current = args.id;
                            tipeDetailJurnal.current = 'keterangan';
                            reCallEdit('keterangan', args.id, value);
                            // reCall('keterangan', inputKetJurnalRef.current, setDataJurnal, rowIdKetJurnalRef.current);
                        }}
                        value={args.catatan}
                        onFocus={(args: any) => {
                            args.target.select();
                        }}
                    />
                </div>
            </div>
        );
    };

    const EditTemplateKurs = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <input
                        style={{ background: 'transparent' }}
                        id="kurs"
                        name="kurs"
                        onBlur={(event: any) => {
                            inputKursJurnalRef.current = event.target.value;
                            rowIdKursJurnalRef.current = args.id;
                            tipeDetailJurnal.current = 'kurs';
                            reCallEdit('kurs', args.id, event.target.value);
                            // reCall(tipeDetailJurnal.current, inputKursJurnalRef.current, setDataJurnal, rowIdKursJurnalRef.current);
                        }}
                        defaultValue={args.kurs}
                        onFocus={(event: any) => event.target.select()}
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
                    />
                </div>
            </div>
        );
    };

    const EditTemplateJumlahMu = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <input
                        style={{ background: 'transparent' }}
                        id="jumlah_mu"
                        name="jumlah_mu"
                        onBlur={(event: any) => {
                            inputJumlahMuJurnalRef.current = event.target.value;
                            rowIdJumlahMuJurnalRef.current = args.id;
                            tipeDetailJurnal.current = 'jumlahMu';
                            reCallEdit('jumlahMu', args.id, event.target.value);
                            // reCall(tipeDetailJurnal.current, inputJumlahMuJurnalRef.current, setDataJurnal, rowIdJumlahMuJurnalRef.current);
                        }}
                        defaultValue={args.jumlah_mu}
                        onFocus={(event: any) => event.target.select()}
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
                    />
                </div>
            </div>
        );
    };

    const TemplateDepartemen = (args: any) => {
        return (
            <div className="container form-input" style={{ border: 'none' }}>
                <DropDownListComponent
                    id="departemen"
                    className="form-select"
                    dataSource={listDepartement.map((data: any) => data.nama_dept)}
                    placeholder="-- Silahkan Pilih Departemen --"
                    change={(d: ChangeEventArgsDropDown) => {
                        const selectedDept = listDepartement.find((dept) => dept.nama_dept === d.value);
                        inputDepartemenJurnalRef.current = selectedDept;
                        rowIdDepartemenJurnalRef.current = args.id;
                        tipeDetailJurnal.current = 'departemen';
                        reCallEdit('departemen', args.id, selectedDept);
                        // reCall(tipeDetailJurnal.current, inputDepartemenJurnalRef.current, setDataJurnal, rowIdDepartemenJurnalRef.current);
                    }}
                    value={stateDataDetail.selectedOptionDepartemen}
                />
            </div>
        );
    };

    const inputRef = useRef(null);
    const noFbRef = useRef(null);

    const qtyParams = { params: { format: 'N', decimals: 4, showClearButton: false, showSpinButton: false } };

    useEffect(() => {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            pilihAkunKredit: stateDataHeader?.noAkunValue === '' ? false : true,
            disabledBayarAllFaktur: stateDataHeader?.noSupplierValue === '' ? true : false,
        }));
    }, [stateDataHeader?.noAkunValue, stateDataHeader?.namaAkunValue, stateDataHeader?.noSupplierValue]);

    // =========================== Data Source =============================

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

    const [editDataJurnal, setEditDataJurnal] = useState<DataNodeJurnal[]>([]);
    const [editDataBarang, setEditDataBarang] = useState<{ nodes: DataNode[] }>({ nodes: [] });

    const refreshDatasource = async () => {
        setShowLoader(true);
        let jumlah_Bayar: any;
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                await FillFromSQL(kode_entitas, 'departemen')
                    .then((result) => {
                        setListDepartement(result);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
                const resultListEditPHUMaster: any[] = await ListEditPHUMaster(kode_entitas, 'IDR', masterKodeDokumen, selectedKodeSupp, modalJenisPembayaran === 'Edit Pencairan' ? 'C' : 'W');
                const resultListEditPHUDetail: any[] = await ListEditPHUDetail(kode_entitas, 'IDR', masterKodeDokumen, selectedKodeSupp, modalJenisPembayaran === 'Edit Pencairan' ? 'C' : 'W');
                const resultListEditPHUJurnal: any[] = await ListEditPHUJurnal(kode_entitas, 'IDR', masterKodeDokumen, selectedKodeSupp, modalJenisPembayaran === 'Edit Pencairan' ? 'C' : 'W');
                // if (resultListEditPhu.status === true) {
                await resultListEditPHUMaster.map((item: any) => {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        tglBuat: moment(item.tgl_trxdokumen),
                        tglDokumen: moment(item.tgl_dokumen),
                        noDokumenValue: item.no_dokumen,
                        kodeAkun: modalJenisPembayaran === 'Edit Pencairan' ? item.kode_akun_kredit : '',
                        noAkunValue: modalJenisPembayaran === 'Edit Pencairan' ? item.no_akun : '',
                        namaAkunValue: modalJenisPembayaran === 'Edit Pencairan' ? item.nama_akun : '',
                        kodeSupplierValue: item.kode_supp,
                        noSupplierValue: item.no_supp,
                        namaSupplierValue: item.nama_supp,
                        jumlahBayar: item.jumlah_mu,
                        saldoKas: frmNumber(item.balance),
                        kursValue: frmNumber(item.kurs),
                        terbilangJumlah: terbilang(parseFloat(item.jumlah_mu)),
                        noReferensi: item.no_TTP,
                        noWarkat: item.no_warkat,
                        tglReferensi: moment(item.tgl_TTP),
                        tglJt: moment(item.tgl_valuta),
                        tglEfektif: item.tgl_pengakuan,
                    }));

                    const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
                    if (jumlahBayar) {
                        jumlahBayar.value = frmNumber(item.jumlah_mu);
                    }

                    const noReferensi = document.getElementById('noReferensi') as HTMLInputElement;
                    if (noReferensi) {
                        noReferensi.value = item.no_TTP;
                    }

                    const noWarkat = document.getElementById('noWarkat') as HTMLInputElement;
                    if (noWarkat) {
                        noWarkat.value = item.no_warkat;
                    }

                    setStateDataFooter((prevState: any) => ({
                        ...prevState,
                        vKeterangan: item.catatan,
                    }));

                    const vKeterangan = document.getElementById('vKeterangan') as HTMLInputElement;
                    if (vKeterangan) {
                        vKeterangan.value = item.catatan;
                    }

                    jumlah_Bayar = item.jumlah_mu;
                });

                const detail = await resultListEditPHUDetail.map((item: any) => {
                    return {
                        id: item.id_dokumen,
                        kode_dokumen: item.kode_dokumen,
                        id_dokumen: item.id_dokumen,
                        kode_fb: item.kode_fb,
                        bayar_mu: item.bayar_mu,
                        pajak: item.pajak,
                        pay: item.pay,
                        bayar: item.bayar,
                        byr: item.byr,
                        no_fb: item.no_fb,
                        tgl_fb: item.tgl_fb,
                        total_hutang: item.total_hutang,
                        sisa_hutang: item.sisa_hutang,
                        owing: item.owing,
                        faktur: item.faktur,
                        lunas_mu: item.lunas_mu,
                        tot_pajak: item.tot_pajak,
                        lunas_pajak: item.lunas_pajak,
                        tgl_jt: item.tgl_jt,
                        hari: item.hari,
                        no_sj: item.no_sj,
                        no_vch: item.no_vch,
                        no_inv: item.no_inv,
                        sisa: tanpaKoma(item.owing),
                        jumlah_pembayaran: item.bayar,
                    };
                });
                await setDataBarang({ nodes: detail });
                await setEditDataBarang({ nodes: detail });

                if (modalJenisPembayaran === 'Edit Pencairan') {
                    const jurnal = await resultListEditPHUJurnal.map((item: any) => {
                        return {
                            id: item.id_dokumen,
                            kode_akun: item.kode_akun,
                            no_akun: item.no_akun,
                            nama_akun: item.nama_akun,
                            tipe: item.tipe,
                            kode_subledger: item.kode_subledger,
                            no_subledger: item.no_subledger,
                            nama_subledger: item.nama_subledger,
                            subledger: item.subledger,
                            debet_rp: parseFloat(item.debet_rp),
                            kredit_rp: parseFloat(item.kredit_rp),
                            kurs: parseFloat(item.kurs),
                            mu: item.kode_mu,
                            departemen: item.nama_dept,
                            kode_dept: item.kode_dept,
                            jumlah_mu: parseFloat(item.jumlah_mu),
                            // catatan: modalJenisPembayaran === 'Transfer' && kode_entitas === '898' ? stateDataHeader?.noBuktiTransfer+' atas : '+stateDataHeader?.namaSupplierValue : stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                            catatan: item.catatan,
                        };
                    });

                    await setDataJurnal({ nodes: jurnal });
                    await setEditDataJurnal(jurnal);
                    gridJurnalListRef.current?.setProperties({ dataSource: jurnal });
                }

                await setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    jumlahFaktur: resultListEditPHUDetail.length,
                }));

                let totPembayaran: any;
                let totHutang: any;

                totPembayaran = await resultListEditPHUDetail.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.bayar);
                }, 0);
                totHutang = await resultListEditPHUDetail.reduce((acc: number, node: any) => {
                    return acc + parseFloat(tanpaKoma(node.sisa_hutang));
                }, 0);

                await setStateDataFooter((prevState: any) => ({
                    ...prevState,
                    totalPembayaran: totPembayaran,
                    selisihAlokasiDana: parseFloat(jumlah_Bayar) - parseFloat(totPembayaran),
                    sisaHutang: totHutang - totPembayaran,
                    totalHutang: totHutang,
                }));

                await GenerateTotalJurnal(setDataJurnal, setStateDataDetail);
                // await GenerateTotalJurnalEdit(setDataJurnal, setStateDataDetail);

                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    disableMenu: true,
                }));
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

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    const headerSisaNilaiFaktur = () => {
        const bgcolor = 'tranparent';
        const fcolor = '#5d676e';
        return (
            <TooltipComponent content="Sisa nilai faktur yang harus dibayar" opensOn="Hover" openDelay={1000} position="BottomCenter">
                <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: 4, marginBottom: 4 }}>
                    <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                        Sisa nilai faktur
                        <br />
                        yang harus dibayar
                    </span>
                </div>
            </TooltipComponent>
        );
    };

    //================ Template untuk kolom grid list data ==================
    const templatePilih = (args: any) => {
        const checkboxStyle = {
            accentColor: '#4361EE',
        };
        return (
            <input
                // onClick={(event: any) => handleTemplatePilih1(args.no_fb, event.target.checked)}
                type="checkbox"
                checked={args.jumlah_pembayaran > 0 ? true : false}
                style={checkboxStyle}
                readOnly
            />
        );
    };

    const editTemplatePilih = (args: any) => {
        const checkboxStyle = {
            accentColor: '#4361EE',
        };
        return (
            <input
                // onClick={(event) => handleTemplatePilih(event, args)}
                type="checkbox"
                checked={args.jumlah_pembayaran > 0 ? true : false}
                style={checkboxStyle}
                readOnly
            />
        );
    };

    // ========================== Detail Data Faktur / Alokasi Dana ====================
    // let gridPhuList: Grid | any;
    const gridPhuListRef = useRef<GridComponent>(null);
    const gridJurnalListRef = useRef<GridComponent>(null);
    // let gridJurnalList: Grid | any;
    let tabPhuList: Tab | any;
    // End

    // Template untuk kolom "Info Detail"
    const templateCustomerInfoDetail = (args: any) => {
        return (
            <div
                style={
                    args.status_warna === 'BlackList-G'
                        ? { color: 'red', fontWeight: 'bold' }
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

    let currentDaftarBarang: any[] = [];
    let currentDaftarJurnal: any[] = [];

    const [idDokumen, setIdDokumen] = useState(0);
    const [tipeAdd, setTipeAdd] = useState('');
    const dokumenId = useRef(0);
    const tipe_Add = useRef('');

    const letIdDokumen = 3000;
    const handleAddDetailJurnal = async () => {
        if (gridJurnalListRef.current && Array.isArray(gridJurnalListRef.current?.dataSource)) {
            const dataSource = [...gridJurnalListRef.current?.dataSource]; // Salin array

            const idList = dataSource.map((node: any) => node.id);
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
                                setDataDaftarAkunKredit,
                                setDataDaftarSupplier,
                                kode_entitas,
                                stateDataHeader?.kodeSupplierValue,
                                setDataDaftarUangMuka,
                                '',
                                setStateDataDetail,
                                setDataDaftarCustomer,
                                setDataDaftarSubledger,
                                dokumenId.current,
                                'add'
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

                const hasTwoSpecificNodes = dataSource?.filter((node: any) => (node.tipe === 'Hutang' || node.tipe === 'Piutang') && node.subledger === '');
                const dataDebetKreditSome = dataSource?.some((node: any) => node.debet_rp === 0 && node.kredit_rp === 0);
                if (dataDebetKreditSome === true) {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;">Nilai debet atau kredit belum diisi</p>',
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
                    id_phu: dokumenId.current,
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

                const hasEmptyFields = dataSource?.some((row: { no_akun: string }) => row.no_akun === '');

                if (!hasEmptyFields) {
                    setDataJurnal((state: any) => ({
                        ...state,
                        nodes: state.nodes.concat(newNode),
                    }));
                    gridJurnalListRef.current?.addRecord();
                } else {
                    // alert('Harap isi nama barang sebelum tambah data');
                    document.getElementById('gridJurnalList')?.focus();
                    withReactContent(swalToast).fire({
                        icon: 'error',
                        title: '<p style="font-size:12px">Harap isi no Akun sebelum tambah data</p>',
                        width: '100%',
                        target: '#dialogJurnalList',
                    });
                }
            }
        }
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

    const closeDialogPhuList = async () => {
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
            dialogDaftarAkunKreditVisible: false,
            dialogDaftarSupplierVisible: false,
            dialogDaftarUangMukaVisible: false,
            disabledResetPembayaran: true,
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
            tipeAkunDialogVisible: 'header',
            // ============================

            // ============================
            //Search Modal Supplier
            searchNoSupplier: '',
            searchNamaSupplier: '',
            searchKeywordNoSupplier: '',
            searchKeywordNamaSupplier: '',
            //Input Value Akun Kredit
            noSupplierValue: '',
            namaSupplierValue: '',
            kodeSupplierValue: '',
            kodeAkunHutang: '',
            noHutang: '',
            namaHutang: '',
            tipeHutang: '',
            tipeSupplierDialogVisible: 'header',
            // ============================

            // ============================
            // lain lain
            tipeFilterOpen: '',
            tipeFocusOpen: '',
            pilihAkunKredit: false,
            noKontrakValue: '', // value No Kontrak
            noDokumenValue: '', // value No Dokumen
            kursValue: '', // Value Kurs
            pelunasanPajak: false, // disable checbox Pelunasan Pajak
            jumlahBayar: '',
            terbilangJumlah: '',
            tglDokumen: moment(),
            tglBuat: moment(),
            tglReferensi: moment(),
            noReferensi: '-',
            noBuktiTransfer: '',
            noWarkat: '',
            tglJt: moment(),
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

            // Data Subledger Jurnal
            dialogDaftarSubledgerVisible: false,
            searchNoSubledger: '',
            searchNamaSubledger: '',
            searchKeywordNamaSubledger: '',
            searchKeywordNoSubledger: '',

            // Cari No Surat jalan
            searchNoSj: '',
            searchKeywordNoSj: '',
        }));

        await setStateDataFooter((prevState) => ({
            ...prevState,
            vKeterangan: '',
            totalHutang: 0,
            totalPembayaran: 0,
            sisaHutang: 0,
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
            click: closeDialogPhuList,
        },
    ];

    //======= Setting tampilan sweet alert  =========
    const swalDialog = swal.mixin({
        customClass: {
            confirmButton: 'btn btn-dark btn-sm',
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

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatFloat: Object = { skeleton: 'C3', format: ',0.####;-,0.#####;#', maximumFractionDigits: 4, minimumFractionDigits: 2 };
    const formatCurrency: Object = { skeleton: 'C3', format: ',0.00;-,0.00;#', maximumFractionDigits: 2 };
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

    let setFocus: any;

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isDataFetchedReload, setIsDataFetchedReload] = useState(false);

    const Data = async () => {
        const ResDetailNoFakturJurnalPencairanWarkat = await DetailNoFakturJurnalPencairanWarkat(
            'autoJurnal',
            kode_entitas,
            stateDataHeader?.namaAkunValue,
            setStateDataHeader,
            setDataDaftarAkunKredit,
            setDataDaftarSupplier,
            stateDataHeader?.kodeSupplierValue,
            setDataDaftarUangMuka,
            dataBarang,
            stateDataHeader?.jumlahBayar,
            modalJenisPembayaran,
            setDataJurnal,
            stateDataHeader,
            gridJurnalListRef.current,
            setStateDataDetail,
            dataJurnal,
            setDataDaftarCustomer,
            setDataDaftarSubledger,
            dokumenId.current,
            tipe_Add.current,
            masterDataState,
            editDataJurnal
        );
        return ResDetailNoFakturJurnalPencairanWarkat;
    };
    let updatedState: any;

    useEffect(() => {
        if (isDataFetched) {
            setIsDataFetched(false); // Reset flag
            saveDoc(updatedState);
        }
    }, [dataJurnal, isDataFetched]);

    useEffect(() => {
        if (isDataFetchedReload) {
            setIsDataFetchedReload(false); // Reset flag
            closeDialogPhuList();
        }
    }, [isDataFetchedReload]);

    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const prosesBloking = async () => {
        const inputTanggal = moment(stateDataHeader?.tglDokumen).format('YYYY-MM-DD'); // contoh tanggal input
        const adaTanggalLebihBesar = dataBarang.nodes.some((item: any) => {
            const tanggalItem = moment(item.tgl_fb).format('YYYY-MM-DD'); // asumsi item.tanggal dalam format yang bisa diubah ke Date
            return tanggalItem > inputTanggal && parseFloat(item.jumlah_pembayaran) > 0;
        });
        const dataDebetKreditSome = dataJurnal.nodes.some((node: any) => node.debet_rp === 0 && node.kredit_rp === 0);
        const hasTwoSpecificNodes = dataJurnal.nodes.filter((node: any) => (node.tipe === 'Hutang' || node.tipe === 'Piutang') && node.subledger === '');
        const jumlahPembayaranFaktur = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.jumlah_pembayaran);
        }, 0);

        if (masterBarangProduksi?.tipeApi === 'APIWarkat') {
            const respListTabNoRek = await GetListTabNoRek(kode_entitas, token);
            const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === masterBarangProduksi?.noRekeningApi);

            const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
            const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0]?.kode_akun);

            console.log('respDaftarAkunKreditFix = ', respDaftarAkunKreditFix);
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

            // setStateDataHeader(updatedState); // Pastikan Anda menggunakan metode untuk memperbarui state
        }

        const result: any = await CekPeriodeAkutansiPencairanWarkat(kode_entitas, stateDataHeader);
        if (result.yearB < result.yearA || (result.yearB === result.yearA && result.monthB < result.monthA)) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: `<p style="font-size:12px;color:white;">Tanggal Effektif tidak dalam periode akuntansi, periode akutansi saat ini : ${result.periode}</p>`,
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (masterBarangProduksi === 'Y') {
            if (moment(stateDataHeader?.tglEfektif).format('YYYY-MM-DD') < moment(stateDataHeader?.tglDokumen).format('YYYY-MM-DD')) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px;color:white;">Tgl. Efektif pencairan tidak boleh lebih kecil dari tanggal dokumen.</p>`,
                    width: '100%',
                    target: '#dialogPhuList',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
                return;
            }
        }

        if (stateDataHeader?.tglEfektif === null || stateDataHeader?.tglEfektif === '' || stateDataHeader?.tglEfektif === undefined) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Tgl. Effektif belum diisi.</p>',
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        if (dataDebetKreditSome === true) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Nilai debet atau kredit belum diisi</p>',
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

        if (stateDataDetail.totalDebet !== stateDataDetail.totalKredit) {
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

        saveDoc(updatedState);
    };

    const saveDoc = async (updatedState: any) => {
        let jsonData;
        const paramObject = {
            // tglDokumen: stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss'),
            tglDokumen: masterBarangProduksi === 'Y' ? moment(stateDataHeader?.tglEfektif).format('YYYY-MM-DD HH:mm:ss') : updatedState.tglEfektif,
            userid: userid.toUpperCase(),
            tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            modalJenisPembayaran: modalJenisPembayaran,
            noWarkat: stateDataHeader?.noWarkat,
            kodeAkunHutangBg: stateDataHeader?.kodeAkunHutangBg,

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

        let dataSourceJurnal: any;
        if (gridJurnalListRef.current && Array.isArray(gridJurnalListRef.current?.dataSource)) {
            dataSourceJurnal = [...gridJurnalListRef.current?.dataSource]; // Salin array
        }

        if (dataSourceJurnal.length <= 0 && dataBarang.nodes.length > 0) {
            const dataRes = await Data();
            if (dataRes === true) {
                setIsDataFetched(true);
            }
        } else {
            // closeDialogPhuList();

            await ReCalcDataNodes(dataBarang, dataSourceJurnal, paramObject, stateDataHeader)
                .then((result) => {
                    jsonData = {
                        pelunasan: 'Pencairan',
                        kode_dokumen: masterDataState === 'BARU' ? '' : masterKodeDokumen,
                        entitas: kode_entitas,
                        dokumen: 'BB',
                        no_dokumen: stateDataHeader?.noDokumenValue,
                        tgl_dokumen: stateDataHeader?.tglDokumen.format('YYYY-MM-DD HH:mm:ss'),
                        no_warkat: stateDataHeader?.noWarkat,
                        tgl_valuta: stateDataHeader?.tglJt.format('YYYY-MM-DD HH:mm:ss'),
                        kode_cust: null,
                        kode_akun_debet: null,
                        kode_supp: stateDataHeader?.kodeSupplierValue,
                        kode_akun_kredit: stateDataHeader?.kodeAkun,
                        kode_akun_diskon: null,
                        kurs: stateDataHeader?.kursValue,
                        debet_rp: 0,
                        kredit_rp: tanpaKoma(stateDataHeader?.jumlahBayar),
                        jumlah_rp: parseFloat(tanpaKoma(stateDataHeader?.jumlahBayar)) * -1,
                        jumlah_mu: tanpaKoma(stateDataHeader?.jumlahBayar),
                        pajak: null,
                        kosong: 'C',
                        kepada: stateDataHeader?.namaSupplierValue,
                        catatan: stateDataFooter.vKeterangan,
                        status: 'Tertutup',
                        userid: userid.toUpperCase(),
                        tgl_update: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        status_approved: null,
                        tgl_approved: null,
                        tgl_pengakuan: masterBarangProduksi === 'Y' ? moment(stateDataHeader?.tglEfektif).format('YYYY-MM-DD') + ' 23:59:59' : updatedState.tglEfektif,
                        no_TTP: stateDataHeader?.noReferensi === '' ? '-' : stateDataHeader?.noReferensi,
                        tgl_TTP: stateDataHeader?.tglReferensi.format('YYYY-MM-DD HH:mm:ss'),
                        kode_sales: null,
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
                        tgl_trxdokumen: moment(stateDataHeader?.tglBuat).format('YYYY-MM-DD HH:mm:ss'),
                        api_id: masterBarangProduksi === 'Y' ? 0 : masterBarangProduksi?.apiId,
                        api_catatan: masterBarangProduksi === 'Y' ? null : masterBarangProduksi?.description,
                        api_pending: masterBarangProduksi === 'Y' ? null : masterBarangProduksi?.apiPending,
                        api_norek: masterBarangProduksi === 'Y' ? null : masterBarangProduksi?.noRekeningApi,
                        kode_um: null,
                        no_kontrak_um: null,
                        detail: result.detailJson,
                        jurnal: result.detailJurnal,
                    };
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            console.log('paramObject 0 = ', jsonData);
            console.log('masterDataState 0 = ', masterDataState);
            startProgress();

            let responsePencairan: any;
            if (masterBarangProduksi === 'Y') {
                responsePencairan = await axios.post(`${apiUrl}/erp/status_warkat_phu`, jsonData);
            } else {
                responsePencairan = await axios.post(`${apiUrl}/erp/status_warkat_phu_mutasi`, jsonData);
            }
            const resultSimpan = responsePencairan.data;
            const status = resultSimpan.status;
            const errormsg = resultSimpan.serverMessage;
            if (status === true) {
                const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                    entitas: kode_entitas,
                    kode_audit: masterKodeDokumen,
                    dokumen: 'BB',
                    kode_dokumen: masterKodeDokumen,
                    no_dokumen: stateDataHeader?.noDokumenValue,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'EDIT',
                    diskripsi: `Pembayaran Hutang pencairan warkat nilai transaksi = ${frmNumber(stateDataHeader?.jumlahBayar)}`,
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
                    endProgress();
                }
                endProgress();
            } else {
                withReactContent(swalDialog).fire({
                    title: ``,
                    html: errormsg,
                    icon: 'warning',
                    width: '20%',
                    heightAuto: true,
                    showConfirmButton: true,
                    confirmButtonText: 'Ok',
                    target: '#dialogPhuList',
                });
                endProgress();
            }
        }
    };

    // ========================================================================================
    // ===================================== END ==============================================
    // ========================================================================================

    return (
        <div>
            {/*==================================================================================================*/}
            {/*====================== Modal dialog untuk input edit dan menambah data baru ======================*/}
            {/*==================================================================================================*/}
            <DialogComponent
                id="dialogPhuList"
                name="dialogPhuList"
                className="dialogPhuList"
                target="#main-target"
                header={() => {
                    let header: JSX.Element | string = '';
                    if (masterDataState == 'EDIT') {
                        header = (
                            <div>
                                <div className="header-title">
                                    Pembayaran Hutang{' '}
                                    <span style={{ color: '#00ab55', fontWeight: 'bold', textTransform: 'uppercase', marginLeft: 10 }}>
                                        [ {modalJenisPembayaran} ] {masterBarangProduksi?.tipeApi === 'APIWarkat' ? '[ API ID : ' + masterBarangProduksi?.apiId + ' ]' : null}
                                    </span>
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
                height="85%"
                position={{ X: 'center', Y: 8 }}
                style={{ position: 'fixed', height: '85%' }}
                buttons={buttonInputData}
                close={() => {
                    closeDialogPhuList();
                    setDataBarang((state: any) => ({
                        ...state,
                        nodes: [],
                    }));
                }}
                closeOnEscape={false}
                open={(args: any) => {
                    // ReCallRefreshModal();
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
                                    <div className="flex">
                                        <div style={{ width: '33%' }}>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '21%', textAlign: 'right', marginRight: 6 }}>Tgl. Buat </label>
                                                <div className="form-input mt-1 flex justify-between" style={{ width: '37%', borderRadius: 2 }}>
                                                    <DatePickerComponent
                                                        locale="id"
                                                        cssClass="e-custom-style"
                                                        // renderDayCell={onRenderDayCell}
                                                        enableMask={true}
                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                        showClearButton={false}
                                                        format="dd-MM-yyyy"
                                                        value={stateDataHeader?.tglBuat.toDate()}
                                                        // change={(args: ChangeEventArgsCalendar) => {
                                                        //     HandleTglPhuJt(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
                                                        // }}
                                                        style={{ margin: '-5px' }}
                                                        disabled={true}
                                                    >
                                                        <Inject services={[MaskedDateTime]} />
                                                    </DatePickerComponent>
                                                </div>
                                                <label style={{ width: '38%', textAlign: 'right', marginRight: 6 }}>Keterangan API Bank</label>
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '21%', textAlign: 'right', marginRight: 6 }}>Tanggal</label>
                                                <div className="form-input mt-1 flex justify-between" style={{ width: '37%', borderRadius: 2 }}>
                                                    <DatePickerComponent
                                                        locale="id"
                                                        cssClass="e-custom-style"
                                                        // renderDayCell={onRenderDayCell}
                                                        enableMask={true}
                                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                        showClearButton={false}
                                                        format="dd-MM-yyyy"
                                                        value={stateDataHeader?.tglDokumen.toDate()}
                                                        change={(args: ChangeEventArgsCalendar) => {
                                                            HandleTglDok(moment(args.value), 'tglDokumen', setStateDataHeader);
                                                        }}
                                                        style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                                        disabled={true}
                                                        // readOnly
                                                    >
                                                        <Inject services={[MaskedDateTime]} />
                                                    </DatePickerComponent>
                                                </div>
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '21%', textAlign: 'right', marginRight: 6 }}>No. Dokumen</label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{ background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '37%', borderRadius: 2 }}
                                                    disabled={true}
                                                    value={stateDataHeader?.noDokumenValue}
                                                    readOnly
                                                ></input>
                                            </div>
                                            {modalJenisPembayaran === 'Warkat' ? (
                                                <div className="flex" style={{ alignItems: 'center' }}>
                                                    <label style={{ width: '24%', textAlign: 'right', marginRight: 6 }}></label>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex" style={{ alignItems: 'center' }}>
                                                        <label style={{ width: '24%', textAlign: 'right', marginRight: 6 }}>Akun Kredit</label>
                                                        <input
                                                            className={` container form-input`}
                                                            onChange={(event) =>
                                                                HandleModalInput(
                                                                    event.target.value,
                                                                    setStateDataHeader,
                                                                    setDataDaftarAkunKredit,
                                                                    kode_entitas,
                                                                    setFilteredDataAkunKredit,
                                                                    dataDaftarAkunKredit,
                                                                    'noAkun'
                                                                )
                                                            }
                                                            style={{ borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '22%' }}
                                                            value={stateDataHeader?.noAkunValue}
                                                            onFocus={(event) => event.target.select()}
                                                            disabled={masterBarangProduksi?.tipeApi === 'APIWarkat' ? true : false}
                                                        ></input>
                                                        <input
                                                            className={` container form-input`}
                                                            onChange={(event) => {
                                                                HandleModalInput(
                                                                    event.target.value,
                                                                    setStateDataHeader,
                                                                    setDataDaftarAkunKredit,
                                                                    kode_entitas,
                                                                    setFilteredDataAkunKredit,
                                                                    dataDaftarAkunKredit,
                                                                    'namaAkun'
                                                                );
                                                            }}
                                                            style={{ borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '52%' }}
                                                            value={stateDataHeader?.namaAkunValue}
                                                            onFocus={(event) => event.target.select()}
                                                            disabled={masterBarangProduksi?.tipeApi === 'APIWarkat' ? true : false}
                                                        ></input>
                                                        <div style={{ width: '12%', marginLeft: 0, marginTop: 4 }}>
                                                            {masterBarangProduksi?.tipeApi === 'APIWarkat' ? null : (
                                                                <button
                                                                    className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                    onClick={() => {
                                                                        HandleModalicon(
                                                                            'header',
                                                                            'akunKredit',
                                                                            setStateDataHeader,
                                                                            setDataDaftarAkunKredit,
                                                                            setDataDaftarSupplier,
                                                                            kode_entitas,
                                                                            stateDataHeader?.kodeSupplierValue,
                                                                            setDataDaftarUangMuka,
                                                                            '',
                                                                            setStateDataDetail,
                                                                            setDataDaftarCustomer,
                                                                            setDataDaftarSubledger,
                                                                            dokumenId.current,
                                                                            tipe_Add.current
                                                                        );
                                                                    }}
                                                                    style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faMagnifyingGlass}
                                                                        className="ml-2"
                                                                        width="15"
                                                                        height="15"
                                                                        onClick={() =>
                                                                            HandleModalicon(
                                                                                'header',
                                                                                'akunKredit',
                                                                                setStateDataHeader,
                                                                                setDataDaftarAkunKredit,
                                                                                setDataDaftarSupplier,
                                                                                kode_entitas,
                                                                                stateDataHeader?.kodeSupplierValue,
                                                                                setDataDaftarUangMuka,
                                                                                '',
                                                                                setStateDataDetail,
                                                                                setDataDaftarCustomer,
                                                                                setDataDaftarSubledger,
                                                                                dokumenId.current,
                                                                                tipe_Add.current
                                                                            )
                                                                        }
                                                                        style={{ margin: '2px 2px 0px 6px' }}
                                                                    />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            <div className="flex" style={{ alignItems: 'center', marginTop: -4 }}>
                                                <label style={{ width: '49%', textAlign: 'right', marginRight: 6 }}>Supplier</label>
                                                <input
                                                    className={` container form-input`}
                                                    onChange={(event) =>
                                                        HandleModalInputSupplier(
                                                            event.target.value,
                                                            setStateDataHeader,
                                                            setDataDaftarSupplier,
                                                            kode_entitas,
                                                            setFilteredDataSupplier,
                                                            dataDaftarSupplier,
                                                            'noSupplier'
                                                        )
                                                    }
                                                    style={{ borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '37%' }}
                                                    value={stateDataHeader?.noSupplierValue}
                                                    onFocus={(event) => event.target.select()}
                                                    disabled={masterBarangProduksi?.tipeApi === 'APIWarkat' ? true : stateDataHeader?.disableMenu}
                                                ></input>

                                                <input
                                                    className={` container form-input`}
                                                    onChange={(event) =>
                                                        HandleModalInputSupplier(
                                                            event.target.value,
                                                            setStateDataHeader,
                                                            setDataDaftarSupplier,
                                                            kode_entitas,
                                                            setFilteredDataSupplier,
                                                            dataDaftarSupplier,
                                                            'namaSupplier'
                                                        )
                                                    }
                                                    style={{ borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '100%' }}
                                                    value={stateDataHeader?.namaSupplierValue}
                                                    onFocus={(event) => event.target.select()}
                                                    // disabled={stateDataHeader?.disableMenu}
                                                    disabled={masterBarangProduksi?.tipeApi === 'APIWarkat' ? true : stateDataHeader?.disableMenu}
                                                ></input>

                                                <div style={{ width: '24%', marginLeft: 0, marginTop: 4 }}>
                                                    {masterBarangProduksi?.tipeApi === 'APIWarkat' ? null : (
                                                        <button
                                                            className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                            onClick={() => {
                                                                HandleModalicon(
                                                                    'header',
                                                                    'supplier',
                                                                    setStateDataHeader,
                                                                    setDataDaftarAkunKredit,
                                                                    setDataDaftarSupplier,
                                                                    kode_entitas,
                                                                    stateDataHeader?.kodeSupplierValue,
                                                                    setDataDaftarUangMuka,
                                                                    '',
                                                                    setStateDataDetail,
                                                                    setDataDaftarCustomer,
                                                                    setDataDaftarSubledger,
                                                                    dokumenId.current,
                                                                    tipe_Add.current
                                                                );
                                                            }}
                                                            style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                                            disabled={stateDataHeader?.disableMenu}
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faMagnifyingGlass}
                                                                className="ml-2"
                                                                width="15"
                                                                height="15"
                                                                onClick={() =>
                                                                    HandleModalicon(
                                                                        'header',
                                                                        'supplier',
                                                                        setStateDataHeader,
                                                                        setDataDaftarAkunKredit,
                                                                        setDataDaftarSupplier,
                                                                        kode_entitas,
                                                                        stateDataHeader?.kodeSupplierValue,
                                                                        setDataDaftarUangMuka,
                                                                        '',
                                                                        setStateDataDetail,
                                                                        setDataDaftarCustomer,
                                                                        setDataDaftarSubledger,
                                                                        dokumenId.current,
                                                                        tipe_Add.current
                                                                    )
                                                                }
                                                                style={{ margin: '2px 2px 0px 6px' }}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ width: '33%' }}>
                                            <textarea
                                                value={masterBarangProduksi?.description}
                                                disabled={true}
                                                style={{ marginTop: 2, width: '95.7%', height: 140, backgroundColor: '#eeeeee', border: '1px solid #bfc9d4' }}
                                            ></textarea>
                                            <div className="flex" style={{ alignItems: 'center', marginTop: -4 }}>
                                                {stateDataHeader?.pilihAkunKredit === false ? (
                                                    <>
                                                        {modalJenisPembayaran === 'Pencairan' ? (
                                                            <>
                                                                <div style={{ width: '18%' }}></div>
                                                                <div style={{ width: '74%' }}></div>
                                                                <div style={{ width: '20%' }}></div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <label style={{ width: '12%', textAlign: 'right', marginRight: 5 }}>No. Kontrak</label>
                                                                <input
                                                                    className={` container form-input`}
                                                                    style={{ borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '78%' }}
                                                                    value={stateDataHeader?.noKontrakValue}
                                                                    readOnly
                                                                ></input>
                                                                <div style={{ width: '9.5%', marginLeft: 0, marginTop: 4 }}>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() =>
                                                                            HandleModalicon(
                                                                                'header',
                                                                                'uangMuka',
                                                                                setStateDataHeader,
                                                                                setDataDaftarAkunKredit,
                                                                                setDataDaftarSupplier,
                                                                                kode_entitas,
                                                                                stateDataHeader?.kodeSupplierValue,
                                                                                setDataDaftarUangMuka,
                                                                                '',
                                                                                setStateDataDetail,
                                                                                setDataDaftarCustomer,
                                                                                setDataDaftarSubledger,
                                                                                dokumenId.current,
                                                                                tipe_Add.current
                                                                            )
                                                                        }
                                                                        style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            onClick={() =>
                                                                                HandleModalicon(
                                                                                    'header',
                                                                                    'uangMuka',
                                                                                    setStateDataHeader,
                                                                                    setDataDaftarAkunKredit,
                                                                                    setDataDaftarSupplier,
                                                                                    kode_entitas,
                                                                                    stateDataHeader?.kodeSupplierValue,
                                                                                    setDataDaftarUangMuka,
                                                                                    '',
                                                                                    setStateDataDetail,
                                                                                    setDataDaftarCustomer,
                                                                                    setDataDaftarSubledger,
                                                                                    dokumenId.current,
                                                                                    tipe_Add.current
                                                                                )
                                                                            }
                                                                            style={{ margin: '2px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ width: '18%' }}></div>
                                                        <div style={{ width: '74%' }}></div>
                                                        <div style={{ width: '20%' }}></div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 0, width: '13%', height: 144 }}>
                                            <label>No./Tgl Referensi</label>
                                            <div className="container form-input" style={{ borderRadius: 2, width: '164px', marginLeft: 0, marginTop: 4 }}>
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
                                                    disabled={masterBarangProduksi?.tipeApi === 'APIWarkat' ? false : stateDataHeader?.disableMenu}
                                                />
                                            </div>
                                            <div className="form-input mt-1 flex justify-between" style={{ width: '164px', borderRadius: 2 }}>
                                                <DatePickerComponent
                                                    locale="id"
                                                    cssClass="e-custom-style"
                                                    // renderDayCell={onRenderDayCell}
                                                    enableMask={true}
                                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                    showClearButton={false}
                                                    format="dd-MM-yyyy"
                                                    value={stateDataHeader?.tglReferensi.toDate()}
                                                    change={(args: ChangeEventArgsCalendar) => {
                                                        HandleTglDok(moment(args.value), 'tglReferensi', setStateDataHeader);
                                                    }}
                                                    style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                                    // disabled={true}
                                                    disabled={masterBarangProduksi?.tipeApi === 'APIWarkat' ? false : true}
                                                    // readOnly
                                                >
                                                    <Inject services={[MaskedDateTime]} />
                                                </DatePickerComponent>
                                            </div>
                                        </div>
                                        <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 0, width: '21%', height: 144 }}>
                                            <div className="flex">
                                                <div style={{ width: '39%' }}>
                                                    <label>No. Warkat</label>
                                                </div>
                                                <div style={{ width: '61%', marginTop: '-13px' }}>
                                                    {masterBarangProduksi?.tipeApi === 'APIWarkat' ? (
                                                        <input
                                                            className={` container form-input`}
                                                            style={{
                                                                background: '#eeeeee',
                                                                fontSize: 11,
                                                                marginTop: 4,
                                                                marginLeft: 0,
                                                                borderColor: '#bfc9d4',
                                                                width: '99%',
                                                                borderRadius: 2,
                                                                height: '33px',
                                                            }}
                                                            disabled={true}
                                                            value={stateDataHeader?.noWarkat}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="container form-input" style={{ borderRadius: 0, width: '164px%', marginLeft: 0, marginTop: 4 }}>
                                                            <TextBoxComponent
                                                                id="noWarkat"
                                                                placeholder=""
                                                                value={stateDataHeader?.noWarkat}
                                                                input={(args: FocusInEventArgs) => {
                                                                    const value: any = args.value;

                                                                    setStateDataHeader((prevState: any) => ({
                                                                        ...prevState,
                                                                        noWarkat: value,
                                                                    }));
                                                                }}
                                                                disabled={stateDataHeader?.disableMenu}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div style={{ width: '39%' }}>
                                                    <label style={{ marginTop: 6 }}>Tgl. Jatuh Tempo</label>
                                                </div>
                                                <div style={{ width: '61%', marginTop: '-13px' }}>
                                                    {masterBarangProduksi?.tipeApi === 'APIWarkat' ? (
                                                        <input
                                                            className={` container form-input`}
                                                            style={{
                                                                background: '#eeeeee',
                                                                fontSize: 11,
                                                                marginTop: 15,
                                                                marginLeft: 0,
                                                                borderColor: '#bfc9d4',
                                                                width: '99%',
                                                                borderRadius: 2,
                                                                height: '33px',
                                                            }}
                                                            disabled={true}
                                                            value={moment(stateDataHeader?.tglJt).format('DD-MM-YYYY')}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="form-input mt-1 flex justify-between" style={{ width: '164px', borderRadius: 2, marginTop: '13px' }}>
                                                            <DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                value={stateDataHeader?.tglJt.toDate()}
                                                                change={(args: ChangeEventArgsCalendar) => {
                                                                    HandleTglDok(moment(args.value), 'tglJt', setStateDataHeader);
                                                                }}
                                                                style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                                                disabled={true}
                                                                // readOnly
                                                            >
                                                                <Inject services={[MaskedDateTime]} />
                                                            </DatePickerComponent>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div style={{ width: '39%' }}>
                                                    <label style={{ marginTop: 6 }}>Tgl. Efektif</label>
                                                </div>
                                                <div style={{ width: '61%', marginTop: '-13px' }}>
                                                    {masterBarangProduksi?.tipeApi === 'APIWarkat' ? (
                                                        <input
                                                            className={` container form-input`}
                                                            style={{
                                                                background: '#eeeeee',
                                                                fontSize: 11,
                                                                marginTop: 15,
                                                                marginLeft: 0,
                                                                borderColor: '#bfc9d4',
                                                                width: '99%',
                                                                borderRadius: 2,
                                                                height: '33px',
                                                            }}
                                                            disabled={true}
                                                            value={moment(masterBarangProduksi?.tglTransaksiMutasi).format('DD-MM-YYYY')}
                                                            // value={moment(dataHeaderAPI.tglTransaksiMutasi).toDate()}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="form-input mt-1 flex justify-between" style={{ width: '164px', borderRadius: 2, marginTop: '13px' }}>
                                                            <DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                value={stateDataHeader?.tglEfektif ? moment(stateDataHeader?.tglEfektif).toDate() : undefined}
                                                                change={(args: ChangeEventArgsCalendar) => {
                                                                    HandleTglDok(moment(args.value), 'tglEfektif', setStateDataHeader);
                                                                }}
                                                                style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                                                // readOnly
                                                            >
                                                                <Inject services={[MaskedDateTime]} />
                                                            </DatePickerComponent>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex" style={{ marginBottom: 5 }}>
                                        <div style={{ width: '78%', height: 58, marginBottom: '3%' }}>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <div style={{ width: '10.3%' }}></div>
                                                <textarea
                                                    disabled={true}
                                                    style={{ position: 'sticky', width: '79.4%', height: 54, backgroundColor: '#eeeeee', border: '1px solid #bfc9d4' }}
                                                ></textarea>
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center', marginTop: 12, textAlign: 'left' }}>
                                                <div style={{ width: '100%', color: 'green' }}>
                                                    <b>{stateDataHeader?.jumlahBayar !== '' ? '** ' + stateDataHeader?.terbilangJumlah + ' **' : ''}</b>
                                                </div>
                                                {/* <div style={{ width: '75%' }}></div> */}
                                            </div>
                                        </div>
                                        <div style={{ width: '10%' }}></div>
                                        <div style={{ width: '20%', marginTop: '-16px' }}>
                                            <label>
                                                Saldo Kas :{' '}
                                                <span style={{ fontWeight: 'bold', marginLeft: 20 }}>
                                                    {masterDataState === 'BARU'
                                                        ? ''
                                                        : parseFloat(tanpaKoma(stateDataHeader?.saldoKas)) < 0
                                                        ? '(' + frmNumber(parseFloat(tanpaKoma(stateDataHeader?.saldoKas)) * -1) + ')'
                                                        : stateDataHeader?.saldoKas}
                                                </span>
                                            </label>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '16%', marginRight: 6, textAlign: 'right' }}>Kurs</label>
                                                <input
                                                    value={stateDataHeader?.kursValue}
                                                    disabled={true}
                                                    className={` container form-input`}
                                                    style={{
                                                        backgroundColor: '#eeeeee',
                                                        borderRadius: 2,
                                                        fontSize: 11,
                                                        marginTop: 4,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '40%',
                                                        textAlign: 'right',
                                                    }}
                                                    readOnly
                                                ></input>
                                                {stateDataHeader?.disabledBayarAllFaktur === true ? (
                                                    <div style={{ width: '38%' }}></div>
                                                ) : (
                                                    <label style={{ width: '38%', fontWeight: 'bold', marginTop: 9 }}>IDR</label>
                                                )}
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '16%', marginRight: 6 }}>Jumlah</label>
                                                <input
                                                    className={` container form-input`}
                                                    onBlur={(event) => FormatNilaiJumlah(event.target.value, setStateDataHeader, setDataBarang, setStateDataFooter)}
                                                    id="jumlahBayar"
                                                    style={{ textAlign: 'right', borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '78%' }}
                                                    disabled={stateDataHeader?.disableMenu}
                                                ></input>
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '16%', marginRight: 6 }}></label>
                                                <ButtonComponent
                                                    id="buBayarAllFaktur"
                                                    content={
                                                        stateDataHeader?.disabledBayarAllFaktur === true
                                                            ? 'Reset Pembayaran'
                                                            : stateDataHeader?.disabledResetPembayaran === true
                                                            ? 'Bayar Semua Faktur'
                                                            : 'Reset Pembayaran'
                                                    }
                                                    // disabled={stateDataHeader?.disabledBayarAllFaktur === true ? true : false}
                                                    cssClass="e-primary e-small"
                                                    // iconCss="e-icons e-small e-search"
                                                    style={
                                                        stateDataHeader?.disabledBayarAllFaktur === true
                                                            ? { width: '78%', backgroundColor: '#3b3f5c', marginTop: 2, color: '#c3c7cb', background: '#f1f2f3' }
                                                            : { width: '78%', backgroundColor: '#3b3f5c', marginTop: 2, color: '#605a5a', background: '#eeeeee' }
                                                    }
                                                    onClick={() => {
                                                        stateDataHeader?.disabledResetPembayaran === true
                                                            ? BayarSemuaFaktur(setDataBarang, setStateDataFooter, setStateDataHeader, stateDataHeader)
                                                            : ResetPembayaran(setDataBarang, setStateDataFooter, setStateDataHeader);
                                                    }}
                                                    disabled={stateDataHeader?.disableMenu}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===============  Detail Data ========================   */}
                            <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '315px' }}>
                                <div className="flex" style={{ marginTop: 5, marginBottom: 5 }}>
                                    <div style={{ marginLeft: 12 }}>
                                        <CheckBoxComponent
                                            label="Pelunasan Pajak"
                                            cssClass="e-small"
                                            checked={stateDataDetail.isChecboxPelunasanPajak}
                                            disabled={stateDataHeader?.disableMenu}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setStateDataDetail((prevState: any) => ({
                                                    ...prevState,
                                                    isChecboxPelunasanPajak: value,
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <TabComponent ref={(t) => (tabPhuList = t)} selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                    <div className="e-tab-header">
                                        <div tabIndex={0}>1. Alokasi Dana</div>
                                        <div tabIndex={1}>2. Jurnal</div>
                                    </div>
                                    {/*===================== Content menampilkan data barang =======================*/}
                                    <div className="e-content">
                                        <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                                            {/* <TooltipComponent ref={(t) => (tooltipDetailBarang = t)} beforeRender={beforeRenderDetailBarang} openDelay={1000} target=".e-headertext"> */}
                                            <GridComponent
                                                id="gridPhuList"
                                                name="gridPhuList"
                                                className="gridPhuList"
                                                locale="id"
                                                ref={gridPhuListRef}
                                                // dataSource={dataBarang.nodes}
                                                dataSource={stateDataDetail.searchKeywordNoSj !== '' ? filteredDataBarang : dataBarang.nodes}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowResizing={true}
                                                autoFit={true}
                                                rowHeight={22}
                                                height={170} //170 barang jadi 150 barang produksi
                                                gridLines={'Both'}
                                                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            >
                                                <ColumnsDirective>
                                                    {/* <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" /> */}
                                                    <ColumnDirective
                                                        field="no_sj"
                                                        isPrimaryKey={true}
                                                        headerText="No. SJ Supplier"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="100"
                                                        // clipMode="EllipsisWithTooltip"
                                                        // template={(args: any) => TemplateNoSj(args)}
                                                        editTemplate={EditTemplateNoSj}
                                                    />

                                                    <ColumnDirective
                                                        field="no_vch"
                                                        isPrimaryKey={true}
                                                        headerText="No. Voucher"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="100"
                                                        editTemplate={EditTemplateNoVch}
                                                    />
                                                    <ColumnDirective
                                                        field="no_fb"
                                                        isPrimaryKey={true}
                                                        headerText="No. Faktur"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="120"
                                                        editTemplate={EditTemplateNoFb}
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_fb"
                                                        isPrimaryKey={true}
                                                        headerText="Tanggal"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="100"
                                                        format={formatDate}
                                                        type="date"
                                                        // template={(args: any) => TemplateTglFb(args)}
                                                        editTemplate={EditTemplateTglFb}
                                                    />
                                                    <ColumnDirective
                                                        field="tgl_jt"
                                                        isPrimaryKey={true}
                                                        headerText="Jatuh Tempo"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="100"
                                                        format={formatDate}
                                                        type="date"
                                                        editTemplate={EditTemplateTglJt}
                                                    />
                                                    <ColumnDirective
                                                        isPrimaryKey={true}
                                                        field="hari"
                                                        headerText="Hari"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="50"
                                                        editTemplate={EditTemplateHari}
                                                    />
                                                    <ColumnDirective
                                                        field="faktur"
                                                        isPrimaryKey={true}
                                                        format={formatFloat}
                                                        editType="numericedit"
                                                        headerText="Nilai Faktur"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="120"
                                                        editTemplate={EditTemplateFaktur}
                                                    />
                                                    <ColumnDirective
                                                        field="sisa_hutang"
                                                        isPrimaryKey={true}
                                                        headerTemplate={headerSisaNilaiFaktur}
                                                        format={formatFloat}
                                                        editType="numericedit"
                                                        headerText="Sisa nilai faktur yang harus dibayar"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="120"
                                                        editTemplate={EditTemplateSisaHutang}
                                                    />
                                                    <ColumnDirective
                                                        template={templatePilih}
                                                        // field="nama_barang"
                                                        headerText="Pilih"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="50"
                                                        editTemplate={editTemplatePilih}
                                                    />
                                                    <ColumnDirective
                                                        field="jumlah_pembayaran"
                                                        format={formatFloat}
                                                        editType="numericedit"
                                                        edit={qtyParams}
                                                        // editTemplate={editTemplateJumlahBayar}
                                                        // template={editTemplateJumlahBayar}
                                                        headerText="Jumlah Pembayaran"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="120"
                                                    />
                                                    <ColumnDirective
                                                        field="sisa"
                                                        isPrimaryKey={true}
                                                        format={formatFloat}
                                                        editType="numericedit"
                                                        headerText="Sisa"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="120"
                                                        editTemplate={EditTemplateSisa}
                                                    />
                                                </ColumnsDirective>

                                                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                            </GridComponent>
                                            {/* </TooltipComponent> */}

                                            <div className="panel-pager">
                                                <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                    <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                            <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                                <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                    <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                        <div className="mt-1 flex">
                                                                            {/* <ButtonComponent
                                                                                id="buEdit1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-edit"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={() => DetailBarangEdit(gridPhuList)}
                                                                            /> */}
                                                                            {plag === 'bukuBesar' ? null : stateDataHeader?.disableMenu === false ? (
                                                                                <>
                                                                                    <ButtonComponent
                                                                                        id="buDelete1"
                                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                        cssClass="e-warning e-small"
                                                                                        iconCss="e-icons e-small e-trash"
                                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                        onClick={() =>
                                                                                            DetailNoFakturDelete(
                                                                                                gridPhuListRef.current,
                                                                                                swalDialog,
                                                                                                setDataBarang,
                                                                                                setStateDataFooter,
                                                                                                setStateDataHeader,
                                                                                                stateDataHeader,
                                                                                                stateDataFooter
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <ButtonComponent
                                                                                        id="buDeleteAll1"
                                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                        cssClass="e-danger e-small"
                                                                                        iconCss="e-icons e-small e-erase"
                                                                                        style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                        onClick={() =>
                                                                                            DetailNoFakturDeleteAll(
                                                                                                gridPhuListRef.current,
                                                                                                swalDialog,
                                                                                                setDataBarang,
                                                                                                setStateDataFooter,
                                                                                                setStateDataHeader,
                                                                                                stateDataHeader,
                                                                                                stateDataFooter
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </>
                                                                            ) : null}
                                                                            <input
                                                                                id="cariNoSj"
                                                                                name="cariNoSj"
                                                                                className={` container form-input`}
                                                                                placeholder="< CARI NO. SURAT JALAN >"
                                                                                style={{ borderRadius: 2, fontSize: 11, marginLeft: 0, borderColor: '#bfc9d4', width: '16%' }}
                                                                                onChange={(event) => HandleCariNoSj(event.target.value, setStateDataDetail, setFilteredDataBarang, dataBarang)}
                                                                                disabled={stateDataHeader?.disableMenu}
                                                                            ></input>
                                                                            <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                <b>Jumlah Faktur :</b>&nbsp;&nbsp;&nbsp;{stateDataDetail.jumlahFaktur}
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
                                            {/* <TooltipComponent ref={(t) => (tooltipDetailBarang = t)} beforeRender={beforeRenderDetailBarang} openDelay={1000} target=".e-headertext"> */}
                                            <GridComponent
                                                id="gridJurnalList"
                                                name="gridJurnalList"
                                                className="gridJurnalList"
                                                locale="id"
                                                ref={gridJurnalListRef}
                                                // dataSource={dataJurnal.nodes}
                                                editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowResizing={true}
                                                autoFit={true}
                                                rowHeight={22}
                                                height={170} //170 barang jadi 150 barang produksi
                                                gridLines={'Both'}
                                                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                // actionBegin={actionBeginDataJurnal}
                                                // actionComplete={actionCompleteDataJurnal}
                                                recordClick={(args: any) => {
                                                    currentDaftarJurnal = gridJurnalListRef.current?.getSelectedRecords() || [];
                                                    if (currentDaftarJurnal.length > 0) {
                                                        gridJurnalListRef.current?.startEdit();
                                                    }
                                                }}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective
                                                        field="id"
                                                        visible={false}
                                                        type="number"
                                                        isPrimaryKey={true}
                                                        headerText="No."
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="30"
                                                    />
                                                    <ColumnDirective
                                                        field="no_akun"
                                                        // isPrimaryKey={true}
                                                        headerText="No. Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={(args: any) =>
                                                            EditTemplateNoAkun(
                                                                args,
                                                                'akunKredit',
                                                                setStateDataHeader,
                                                                setDataDaftarAkunKredit,
                                                                setDataDaftarSupplier,
                                                                kode_entitas,
                                                                stateDataHeader?.kodeSupplierValue,
                                                                setDataDaftarUangMuka,
                                                                setStateDataDetail,
                                                                setDataDaftarCustomer,
                                                                setDataDaftarSubledger,
                                                                dokumenId.current,
                                                                tipe_Add.current
                                                            )
                                                        }
                                                    />
                                                    <ColumnDirective
                                                        field="nama_akun"
                                                        // isPrimaryKey={true}
                                                        headerText="Nama Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="130"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={(args: any) =>
                                                            EditTemplateNamaAkun(
                                                                args,
                                                                'akunKredit',
                                                                setStateDataHeader,
                                                                setDataDaftarAkunKredit,
                                                                setDataDaftarSupplier,
                                                                kode_entitas,
                                                                stateDataHeader?.kodeSupplierValue,
                                                                setDataDaftarUangMuka,
                                                                setStateDataDetail,
                                                                setDataDaftarCustomer,
                                                                setDataDaftarSubledger,
                                                                dokumenId.current,
                                                                tipe_Add.current
                                                            )
                                                        }
                                                    />
                                                    <ColumnDirective
                                                        field="debet_rp"
                                                        // isPrimaryKey={true}
                                                        format={formatFloat}
                                                        // editType="numericedit"
                                                        // edit={qtyParams}
                                                        editTemplate={EditTemplateDebetRp}
                                                        headerText="Debet"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="100"
                                                        // clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="kredit_rp"
                                                        // isPrimaryKey={true}
                                                        format={formatFloat}
                                                        // editType="numericedit"
                                                        // edit={qtyParams}
                                                        editTemplate={EditTemplateKreditRp}
                                                        headerText="Kredit"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="100"
                                                        // clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        // isPrimaryKey={true}
                                                        field="catatan"
                                                        headerText="Keterangan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="200"
                                                        // clipMode="EllipsisWithTooltip"
                                                        editTemplate={EditTemplateKeterangan}
                                                    />
                                                    <ColumnDirective
                                                        // isPrimaryKey={true}
                                                        field="mu"
                                                        headerText="MU"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="50"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={EditTemplateMu}
                                                    />
                                                    <ColumnDirective
                                                        // isPrimaryKey={true}
                                                        field="kurs"
                                                        headerText="Kurs"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="50"
                                                        // clipMode="EllipsisWithTooltip"
                                                        editTemplate={EditTemplateKurs}
                                                    />
                                                    <ColumnDirective
                                                        field="jumlah_mu"
                                                        // isPrimaryKey={true}
                                                        // headerTemplate={headerSisaNilaiFaktur}
                                                        // format={formatFloat}
                                                        // editType="numericedit"
                                                        // edit={qtyParams}
                                                        template={(args: any) => <div>{args.jumlah_mu < 0 ? '(' + CurrencyFormat(args.jumlah_mu * -1) + ')' : CurrencyFormat(args.jumlah_mu)}</div>}
                                                        headerText="Jumlah [MU]"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="110"
                                                        // clipMode="EllipsisWithTooltip"
                                                        editTemplate={EditTemplateJumlahMu}
                                                    />
                                                    <ColumnDirective
                                                        // isPrimaryKey={true}
                                                        field="subledger"
                                                        headerText="Subsidiary Ledger"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={(args: any) =>
                                                            EditTemplateSubledger(
                                                                args,
                                                                'subledger',
                                                                setStateDataHeader,
                                                                setDataDaftarAkunKredit,
                                                                setDataDaftarSupplier,
                                                                kode_entitas,
                                                                stateDataHeader?.kodeSupplierValue,
                                                                setDataDaftarUangMuka,
                                                                setStateDataDetail,
                                                                setDataDaftarCustomer,
                                                                setDataDaftarSubledger,
                                                                dokumenId.current,
                                                                tipe_Add.current
                                                            )
                                                        }
                                                    />
                                                    <ColumnDirective
                                                        editTemplate={TemplateDepartemen}
                                                        // isPrimaryKey={true}
                                                        field="departemen"
                                                        headerText="Departemen"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="200"
                                                    />
                                                </ColumnsDirective>

                                                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                            </GridComponent>
                                            {/* </TooltipComponent> */}

                                            <div className="panel-pager">
                                                <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                    <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                            <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                                <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                    <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                        <div className="mt-1 flex">
                                                                            <div style={{ width: '75%' }}>
                                                                                {plag === 'bukuBesar' ? null : (
                                                                                    <>
                                                                                        <ButtonComponent
                                                                                            id="buAdd1"
                                                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                            cssClass="e-primary e-small"
                                                                                            iconCss="e-icons e-small e-plus"
                                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                            onClick={handleAddDetailJurnal}
                                                                                        />
                                                                                        <ButtonComponent
                                                                                            id="buDelete1"
                                                                                            // content="Hapus"
                                                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                            cssClass="e-warning e-small"
                                                                                            iconCss="e-icons e-small e-trash"
                                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                            onClick={() =>
                                                                                                DetailNoFakturJurnal(
                                                                                                    'delete',
                                                                                                    kode_entitas,
                                                                                                    stateDataHeader?.namaAkunValue,
                                                                                                    setStateDataHeader,
                                                                                                    setDataDaftarAkunKredit,
                                                                                                    setDataDaftarSupplier,
                                                                                                    stateDataHeader?.kodeSupplierValue,
                                                                                                    setDataDaftarUangMuka,
                                                                                                    dataBarang,
                                                                                                    stateDataHeader?.jumlahBayar,
                                                                                                    modalJenisPembayaran,
                                                                                                    setDataJurnal,
                                                                                                    stateDataHeader,
                                                                                                    gridJurnalListRef.current,
                                                                                                    setStateDataDetail,
                                                                                                    dataJurnal,
                                                                                                    setDataDaftarCustomer,
                                                                                                    setDataDaftarSubledger,
                                                                                                    dokumenId.current,
                                                                                                    tipe_Add.current,
                                                                                                    masterDataState,
                                                                                                    editDataJurnal,
                                                                                                    gridPhuListRef.current
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <ButtonComponent
                                                                                            id="buDeleteAll1"
                                                                                            // content="Bersihkan"
                                                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                            cssClass="e-danger e-small"
                                                                                            iconCss="e-icons e-small e-erase"
                                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                            onClick={() =>
                                                                                                DetailNoFakturJurnal(
                                                                                                    'deleteAll',
                                                                                                    kode_entitas,
                                                                                                    stateDataHeader?.namaAkunValue,
                                                                                                    setStateDataHeader,
                                                                                                    setDataDaftarAkunKredit,
                                                                                                    setDataDaftarSupplier,
                                                                                                    stateDataHeader?.kodeSupplierValue,
                                                                                                    setDataDaftarUangMuka,
                                                                                                    dataBarang,
                                                                                                    stateDataHeader?.jumlahBayar,
                                                                                                    modalJenisPembayaran,
                                                                                                    setDataJurnal,
                                                                                                    stateDataHeader,
                                                                                                    gridJurnalListRef.current,
                                                                                                    setStateDataDetail,
                                                                                                    dataJurnal,
                                                                                                    setDataDaftarCustomer,
                                                                                                    setDataDaftarSubledger,
                                                                                                    dokumenId.current,
                                                                                                    tipe_Add.current,
                                                                                                    masterDataState,
                                                                                                    editDataJurnal,
                                                                                                    gridPhuListRef.current
                                                                                                )
                                                                                            }
                                                                                        />

                                                                                        <ButtonComponent
                                                                                            id="buDeleteAll1"
                                                                                            content="Auto Jurnal"
                                                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                            cssClass="e-danger e-small"
                                                                                            iconCss="e-icons e-small e-description"
                                                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                            onClick={() =>
                                                                                                DetailNoFakturJurnalPencairanWarkat(
                                                                                                    'autoJurnal',
                                                                                                    kode_entitas,
                                                                                                    stateDataHeader?.namaAkunValue,
                                                                                                    setStateDataHeader,
                                                                                                    setDataDaftarAkunKredit,
                                                                                                    setDataDaftarSupplier,
                                                                                                    stateDataHeader?.kodeSupplierValue,
                                                                                                    setDataDaftarUangMuka,
                                                                                                    dataBarang,
                                                                                                    stateDataHeader?.jumlahBayar,
                                                                                                    modalJenisPembayaran,
                                                                                                    setDataJurnal,
                                                                                                    stateDataHeader,
                                                                                                    gridJurnalListRef.current,
                                                                                                    setStateDataDetail,
                                                                                                    dataJurnal,
                                                                                                    setDataDaftarCustomer,
                                                                                                    setDataDaftarSubledger,
                                                                                                    dokumenId.current,
                                                                                                    tipe_Add.current,
                                                                                                    masterDataState,
                                                                                                    editDataJurnal
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <div style={{ width: '25%' }}>
                                                                                <div className=" flex">
                                                                                    <div style={{ width: '30%', textAlign: 'right' }}>
                                                                                        <b>Total Db/Kr :</b>
                                                                                    </div>
                                                                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                                                                        <b>{CurrencyFormat(stateDataDetail.totalDebet)}</b>
                                                                                    </div>
                                                                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                                                                        <b>{CurrencyFormat(stateDataDetail.totalKredit)}</b>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="mt-1 flex">
                                                                                    <div style={{ width: '30%', textAlign: 'right' }}>
                                                                                        <b>Selisih :</b>
                                                                                    </div>
                                                                                    <div style={{ width: '35%', textAlign: 'right' }}>
                                                                                        <b>{CurrencyFormat(stateDataDetail.totalSelisih)}</b>
                                                                                    </div>
                                                                                    {/* <div style={{ width: '35%', textAlign: 'right' }}>
                                                                                        <b>{CurrencyFormat(stateDataDetail.totalSelisihKredit)}</b>
                                                                                    </div> */}
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
                                    </div>
                                </TabComponent>
                            </div>

                            {/* ===============  Master Footer Data ========================   */}
                            <div className="flex">
                                <div style={{ width: '80%' }}>
                                    <div className="mt-1">
                                        <p className="set-font-11">
                                            <b>Keterangan :</b>
                                        </p>
                                        <div className="panel-input" style={{ width: '80%' }}>
                                            <TextBoxComponent
                                                id="vKeterangan"
                                                ref={(t) => {
                                                    textareaObj = t;
                                                }}
                                                multiline={true}
                                                created={onCreateMultiline}
                                                value={stateDataFooter.vKeterangan}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandleKeterangan(value, setStateDataFooter);
                                                }}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '20%' }}>
                                    <div className="mt-1 flex">
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>Total Hutang</b>
                                        </div>
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>{CurrencyFormat(stateDataFooter.totalHutang)}</b>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>Total Pembayaran</b>
                                        </div>
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>{CurrencyFormat(stateDataFooter.totalPembayaran)}</b>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>Sisa Hutang</b>
                                        </div>
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>{CurrencyFormat(stateDataFooter.sisaHutang)}</b>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>Selisih Alokasi Dana</b>
                                        </div>
                                        <div style={{ width: '50%', textAlign: 'right', fontWeight: 'bold' }}>
                                            <b>
                                                {stateDataFooter.selisihAlokasiDana < 0
                                                    ? '(' + CurrencyFormat(stateDataFooter.selisihAlokasiDana * -1) + ')'
                                                    : CurrencyFormat(stateDataFooter.selisihAlokasiDana)}
                                            </b>
                                        </div>
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
                        {(masterDataState == 'BARU' || masterDataState == 'EDIT') && (
                            <ButtonComponent
                                id="buBatalDokumen1"
                                content="Batal"
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-small e-close"
                                style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                                onClick={closeDialogPhuList}
                            />
                        )}
                        {masterDataState == 'BARU' || masterDataState == 'EDIT' ? (
                            plag === 'bukuBesar' ? null : (
                                <>
                                    <ButtonComponent
                                        id="buSimpanDokumen1"
                                        content="Simpan"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-save"
                                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                        // onClick={saveDoc}
                                        onClick={prosesBloking}
                                    />
                                </>
                            )
                        ) : null}
                    </div>
                    {/* ============================================================ */}
                </div>
                <GlobalProgressBar />
            </DialogComponent>
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Akun Kredit =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarAkunKredit
                visible={stateDataHeader?.dialogDaftarAkunKreditVisible}
                stateDataHeader={stateDataHeader}
                setStateDataHeader={setStateDataHeader}
                dataDaftarAkunKredit={dataDaftarAkunKredit}
                filteredDataAkunKredit={filteredDataAkunKredit}
                swalToast={swalToast}
                HandleSearchNoAkun={HandleSearchNoAkun}
                HandleSearchNamaAkun={HandleSearchNamaAkun}
                TemplateNoAkun={TemplateNoAkun}
                TemplateNamaAkun={TemplateNamaAkun}
                setFilteredDataAkunKredit={setFilteredDataAkunKredit}
                setDataJurnal={setDataJurnal}
                stateDataDetail={stateDataDetail}
                rowIdJurnal={dokumenId.current}
                gridJurnalListRef={gridJurnalListRef.current}
                kode_entitas={kode_entitas}
                setDataDaftarSupplier={setDataDaftarSupplier}
                setStateDataDetail={setStateDataDetail}
                setDataDaftarCustomer={setDataDaftarCustomer}
                setDataDaftarSubledger={setDataDaftarSubledger}
            />
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Daftar Supplier =============================*/}
            {/*==================================================================================================*/}
            <DialogDaftarSupplier
                visible={stateDataHeader?.dialogDaftarSupplierVisible}
                stateDataHeader={stateDataHeader}
                setStateDataHeader={setStateDataHeader}
                filteredDataSupplier={filteredDataSupplier}
                dataDaftarSupplier={dataDaftarSupplier}
                HandleSearchNoSupplier={HandleSearchNoSupplier}
                HandleSearchNamaSupplier={HandleSearchNamaSupplier}
                swalToast={swalToast}
                setFilteredDataSupplier={setFilteredDataSupplier}
                stateDataDetail={stateDataDetail}
                setDataDetailNoFakturPhu={setDataDetailNoFakturPhu}
                kode_entitas={kode_entitas}
                setDataBarang={setDataBarang}
                setStateDataFooter={setStateDataFooter}
                setStateDataDetail={setStateDataDetail}
                setDataJurnal={setDataJurnal}
                dataBarang={dataBarang}
                editDataBarang={editDataBarang}
                masterDataState={masterDataState}
                gridJurnalListRef={gridJurnalListRef.current}
            />
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Daftar Uang Muka ==========================*/}
            {/*==================================================================================================*/}
            <DialogDaftarUangMuka
                visible={stateDataHeader?.dialogDaftarUangMukaVisible}
                stateDataHeader={stateDataHeader}
                setStateDataHeader={setStateDataHeader}
                dataDaftarUangMuka={dataDaftarUangMuka}
                swalToast={swalToast}
                formatDate={formatDate}
                CurrencyFormat={CurrencyFormat}
            />
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal Customer yang ada pada Jurnal ==========================*/}
            {/*==================================================================================================*/}
            <DialogDaftarCustomer
                visible={stateDataDetail.dialogDaftarCustomerVisible}
                stateDataDetail={stateDataDetail}
                setStateDataDetail={setStateDataDetail}
                filteredDataCustomer={filteredDataCustomer}
                dataDaftarCustomer={dataDaftarCustomer}
                HandleSearchNoCust={HandleSearchNoCust}
                HandleSearchNamaCust={HandleSearchNamaCust}
                HandleSearchNamaSales={HandleSearchNamaSales}
                swalToast={swalToast}
                kode_entitas={kode_entitas}
                templateCustomerInfoDetail={templateCustomerInfoDetail}
                setFilteredDataCustomer={setFilteredDataCustomer}
                setDataJurnal={setDataJurnal}
                gridJurnalListRef={gridJurnalListRef.current}
            />
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal dialog untuk Subledger =================================*/}
            {/*==================================================================================================*/}
            <DialogDaftarSubledger
                visible={stateDataDetail.dialogDaftarSubledgerVisible}
                stateDataDetail={stateDataDetail}
                stateDataHeader={stateDataHeader}
                setStateDataDetail={setStateDataDetail}
                filteredDataSubledger={filteredDataSubledger}
                dataDaftarSubledger={dataDaftarSubledger}
                HandleSearchNoSubledger={HandleSearchNoSubledger}
                HandleSearchNamaSubledger={HandleSearchNamaSubledger}
                swalToast={swalToast}
                setFilteredDataSubledger={setFilteredDataSubledger}
                setDataJurnal={setDataJurnal}
                gridJurnalListRef={gridJurnalListRef.current}
                kode_entitas={kode_entitas}
            />
            {/*==================================================================================================*/}
        </div>
    );
};

export default DialogPencairanWarkat;
