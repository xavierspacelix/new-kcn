/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
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

import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);

import * as ReactDom from 'react-dom';
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Pakai fungsi dari routines ============================
import {
    DiskonByCalc,
    FillFromSQL,
    FirstDayInPeriod,
    ResetTime2,
    fetchPreferensi,
    formatNumber,
    frmNumber,
    generateNU,
    generateNUDivisi,
    generateTerbilang,
    qty2QtyStd,
    tanpaKoma,
} from '@/utils/routines';
//========================================================

import { useRouter } from 'next/router';

import styles from './mk.module.css';
import stylesTtb from '../mklist.module.css';
// import { HandelCatatan, HandleAlasanChange, HandleCaraPengiriman, HandleGudangChange, HandleModalChange, HandleModaliconChange, HandleRemoveRowsOtomatis, HandleSelectedData } from './fungsiFrmMk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { GetDlgDetailSjItem, GetListEditTtb, GetMasterAlasan, PatchUpdateTtb, PostSimpanAudit, PostSimpanTtb } from '../model/api';
// import { ReCalcDataNodesTtb } from './reCalc';
import { GetListDlgMkTtb } from '../model/api';
import {
    FetchDataListCust,
    FetchDlgListFj,
    HandleSearchNamaCust,
    HandleSearchNamaSales,
    HandleSearchNoCust,
    HandleSelectedDataCustomer,
    HandleSearchNoFj,
    HandleSearchTglFj,
    HandleSearchNoTtb,
    HandleSearchTglTtb,
    FetchDlgListTtb,
    FetchDlgTtbMk,
    HandleSearchNoBarang,
    HandleKelompokChange,
    HandleKategoriChange,
    HandleMerkChange,
    HandleSearchNamaBarang,
    DetailBarangDeleteAll,
    DetailBarangDelete,
} from './fungsiFrmMkList';
import { table } from '@syncfusion/ej2/grids';
import { HandelCatatan, HandleModalChange, HandleModaliconChange, HandleRemoveRowsOtomatis } from './fungsiFrmMk';
import Swal from 'sweetalert2';
import { useSession } from '@/pages/api/sessionContext';
import { Refresh } from '@mui/icons-material';
import FrmDlgMk from './frmdlgmk';

enableRipple(true);

interface FrmMkProps {
    userid: any;
    kode_entitas: any;
    masterKodeDokumen: any;
    masterDataState: any;
    isOpen: boolean;
    onClose: any;
    onRefresh: any;
    kode_user: any;
}

let buttonInputData: ButtonPropsModel[];
let gridJurnalDetail: Grid | any;
let tabMkDetail: Tab | any;
let gridMkDetail: Grid | any;

let gridDaftarCustomer: Grid | any;
let buttonDaftarCustomer: ButtonPropsModel[];
let currentDaftarCustomer: any[] = [];
let dialogDaftarCustomer: Dialog | any;

let dlgListFJ: Dialog | any;
let gridDlgListFj: Grid | any;
let btnDlgListFj: ButtonPropsModel[];
let currentDlgListFj: any[] = [];

let dlgListTtb: Dialog | any;
let gridDlgListTtb: Grid | any;
let btnDlgListTtb: ButtonPropsModel[];
let currentDlgListTtb: any[] = [];

let frmDlgTtbMk: Dialog | any;
let dgDlgTtbMk: Grid | any;
let buttonDlgTtbMk: ButtonPropsModel[];
let currentDlgListTtbMk: any[] = [];

let tipettbdlgMK: any;
let frmDlgAkunJurnal: Dialog | any;
let dgDlgAkunJurnal: Grid | any;
let buttonDlgAkunJurnal: ButtonPropsModel[];
let currentDlgAkunJurnal: any[] = [];
let tipeDlgAkunJurnal: any;
let tipe: any;
let statusNolJurnal: string;

// const FrmMk: React.FC<FrmMkProps> = ({ masterKodeDokumen, masterDataState, isOpen, onClose, onRefresh }: FrmMkProps) => {
const FrmMk = ({ userid, kode_entitas, masterKodeDokumen, masterDataState, isOpen, onClose, onRefresh, kode_user }: FrmMkProps) => {
    // const { sessionData, isLoading } = useSession();
    // const kode_entitas = sessionData?.kode_entitas ? '';
    // const userid = sessionData?.userid ? '';
    // const kode_user = sessionData?.kode_user ? '';

    // if (isLoading) {
    //     return;
    // }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // console.log('masterDataState ', masterDataState);
    const router = useRouter();
    const { kodeDok } = router.query;
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const gridMkDetailRef = useRef<GridComponent>(null);

    const [divisiPenjualan, setDivisiPenjualan] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [tipeArgs, settipeArgs] = useState('');
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
    const [modalDlgFj, setModalDlgFj] = useState(false);
    const [searchNoFj, setSearchNoFj] = useState('');
    const [searchTglFj, setSearchTglFj] = useState('');
    const [activeSearchDlgNoFj, setActiveSearchactiveSearchDlgNoFj] = useState('no_sj');
    const [dsDaftarDlgFj, setDsDaftarDlgFj] = useState<any[]>([]);

    const [searchKeywordNoFj, setSearchKeywordNoFj] = useState<string>('');
    const [searchKeywordTglFj, setSearchKeywordTglFj] = useState<string>('');
    const [filteredDataFj, setFilteredDataFj] = useState([]);
    const [valueKenaPajak, setValueKenaPajak] = useState<string>('');

    const [modalDlgTtb, setModalDlgTtb] = useState(false);
    const [searchNoTtb, setSearchNoTtb] = useState('');
    const [searchTglTtb, setSearchTglTtb] = useState('');
    const [activeSearchDlgNoTtb, setActiveSearchactiveSearchDlgNoTtb] = useState('no_ttb');
    const [dsDaftarDlgTtb, setDsDaftarDlgTtb] = useState<any[]>([]);

    const [searchKeywordNoTtb, setSearchKeywordNoTtb] = useState<string>('');
    const [searchKeywordTglTtb, setSearchKeywordTglTtb] = useState<string>('');
    const [filteredDataTtb, setFilteredDataTtb] = useState([]);

    const [quMMKkode_mk, setquMMKkode_mk] = useState<any>('');
    const [quMMKno_mk, setquMMKno_mk] = useState<any>('');
    const [quMMKtgl_mk, setquMMKtgl_mk] = useState(new Date());
    const [quMMKno_reff, setquMMKno_reff] = useState<any>('');
    const [quMMKkode_cust, setquMMKkode_cust] = useState<any>('');
    const [quMMKkode_ttb, setquMMKkode_ttb] = useState<any>('');
    const [quMMKkode_fj, setquMMKkode_fj] = useState<any>('');
    const [quMMKkode_mu, setquMMKkode_mu] = useState<any>('');
    const [quMMKkurs, setquMMKkurs] = useState<any>('');
    const [quMMKkurs_pajak, setquMMKkurs_pajak] = useState<any>('');
    const [quMMKkena_pajak, setquMMKkena_pajak] = useState<any>('');
    const [quMMKdiskon_dok, setquMMKdiskon_dok] = useState<any>('');
    const [quMMKtotal_mu, setquMMKtotal_mu] = useState<any>('0.00');
    const [quMMKdiskon_dok_mu, setquMMKdiskon_dok_mu] = useState<any>('');
    const [quMMKtotal_diskon_mu, setquMMKtotal_diskon_mu] = useState<any>('');
    const [quMMKtotal_pajak_mu, setquMMKtotal_pajak_mu] = useState<any>('');
    const [quMMKnetto_mu, setquMMKnetto_mu] = useState<any>(0);
    const [quMMKtotal_rp, setquMMKtotal_rp] = useState<any>('');
    const [quMMKdiskon_dok_rp, setquMMKdiskon_dok_rp] = useState<any>('');
    const [quMMKtotal_diskon_rp, setquMMKtotal_diskon_rp] = useState<any>('');
    const [quMMKtotal_pajak_rp, setquMMKtotal_pajak_rp] = useState<any>('');
    const [quMMKnetto_rp, setquMMKnetto_rp] = useState<any>('');
    const [quMMKkode_akun_diskon_dok, setquMMKkode_akun_diskon_dok] = useState<any>('');
    const [quMMKketerangan, setquMMKketerangan] = useState<any>('');
    const [quMMKstatus, setquMMKstatus] = useState<any>('');
    const [quMMKuserid, setquMMKuserid] = useState<any>('');
    const [quMMKtgl_update, setquMMKtgl_update] = useState<any>('');
    const [quMMKdiskon_def, setquMMKdiskon_def] = useState<any>('');
    const [quMMKkode_pajak, setquMMKkode_pajak] = useState<any>('');
    const [quMMKnama_relasi, setquMMKnama_relasi] = useState<any>('');
    const [quMMKalamat, setquMMKalamat] = useState<any>('');
    const [quMMKnilai_pajak, setquMMKnilai_pajak] = useState<any>('');
    const [quMMKnama_sales, setquMMKnama_sales] = useState<any>('');
    const [quMMKkode_sales, setquMMKkode_sales] = useState<any>('');
    const [quMMKno_cust, setquMMKno_cust] = useState<any>('');
    const [quMMKno_fj, setquMMKno_fj] = useState<any>('');
    const [quMMKno_ttb, setquMMKno_ttb] = useState<any>('');
    const [quMMKtipe, setquMMKtipe] = useState<any>('');
    const [quMMKkode_jual, setquMMKkode_jual] = useState<any>('');

    const [date1, setDate1] = useState<any>(new Date());
    const [masterTglMk, setMasterTglMk] = useState<moment.Moment>(moment());
    const [tglMkEdit, setTglMkEdit] = useState('');
    const [custSelectedKode, setCustSelectedKode] = useState<any>('');
    const [custSelected, setCustSelected] = useState<any>('');

    const [catatanValue, setCatatanValue] = useState('');
    const [selectedCaraPengiriman, setSelectedCaraPengiriman] = useState<any>('Dikirim');
    const [dataTotalHeader, setDataTotalHeader] = useState({ jumlahMu: 0, totalDiskonMu: 0, totalJumlahPajak: 0 });
    const [TotalBarang, setTotalBarang] = useState(0);

    const [terbilang, setTerbilang] = useState('');
    const [changeNumber, setChangeNumber] = useState(0);
    const [handleNamaCust, setHandleNamaCust] = useState('');
    const [modalCust, setModalCust] = useState(false); //customer
    const [selectedKodeRelasi, setSelectedKodeRelasi] = useState<any>('');
    const [TotalRecords, setTotalRecords] = useState(0);

    const [dataHeader, setDataHeader] = useState({ nodes: [] });
    let currentDaftarBarang: any[] = [];

    type NodesDataBarang = {
        kode_mk: any;
        id_mk: any;
        kode_ttb: any;
        id_ttb: any;
        kode_fj: any;
        id_fj: any;
        kode_sj: any;
        id_sj: any;
        kode_do: any;
        id_do: any;
        kode_so: any;
        id_so: any;
        kode_item: any;
        diskripsi: any;
        satuan: any;
        qty: any;
        sat_std: any;
        qty_std: any;
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
        pajak_mu: any;
        jumlah_mu: any;
        jumlah_rp: any;
        kode_dept: any;
        kode_kerja: any;
        hpp: any;
        no_ttb: any;
        no_item: any;
        nama_dept: any;
        nama_kerja: any;
        qty_fj: any;
        pajak_fj: any;
        disc_per_item: any;
    };

    // const [dataBarang, setDataBarang] = useState<{ nodes: NodesDataBarang[] }>({ nodes: [] }); // useState({ nodes: [] });
    const [dataBarang, setDataBarang] = useState<any>({ nodes: [] });
    const [dataJurnal, setDataJurnal] = useState<any>({ nodes: [] });

    const [totalDebit, setTotalDebit] = useState<any>(0);
    const [totalKredit, setTotalKredit] = useState<any>(0);
    const [keterangan, setKeterangan] = useState<any>('');
    const [indexDataJurnal, setIndexDataJurnal] = useState('');
    const [modalAkunJurnal, setModalAkunJurnal] = useState(false);
    const [listAkunJurnal, setListAkunJurnal] = useState<any[]>([]);
    const [UpdateDetail, setUpdateDetail] = useState<any>(false);
    const [tagCustomer, setTagCustomer] = useState('');
    const [bendera, setBendera] = useState(false);
    const [disabledSimpan, setDisabledSimpan] = useState(false);

    const ReCallRefreshModal = () => {
        setquMMKno_mk('<Baru>');
        setquMMKkode_mk('');
        setDate1(new Date());
        setquMMKtgl_mk(new Date());
        // setTglMkEdit('');
        setquMMKnama_relasi('');
        // refNamaCust.current = null;
        setquMMKkode_cust('');
        setDataHeader((prevState) => ({
            ...prevState,
            kode_mk: '',
            no_mk: '',
            tgl_mk: '',
            no_reff: '',
            kode_sales: '',
            kode_cust: '',
            kode_ttb: '',
            kode_fj: '',
            kode_mu: '',
            kurs: '',
            kurs_pajak: '',
            kena_pajak: '',
            diskon_dok: 0,
            total_mu: 0,
            diskon_dok_mu: 0,
            total_diskon_mu: 0,
            total_pajak_mu: 0,
            netto_mu: 0,
            total_rp: 0,
            diskon_dok_rp: 0,
            total_diskon_rp: 0,
            total_pajak_rp: 0,
            netto_rp: 0,
            kode_akun_diskon_dok: '',
            keterangan: '',
            status: '',
            userid: '',
            tgl_update: '',
            kode_jual: '',
            no_fj: '',
            no_ttb: '',
            diskon_def: '',
            kode_pajak: '',
            no_cust: '',
            tipe: '',
            nama_relasi: '',
            alamat: '',
            nilai_pajak: '',
            nama_sales: '',
        }));

        setquMMKketerangan('');
        setquMMKkode_jual('');
        // setSelectedCaraPengiriman('Dikirim');

        setDataTotalHeader((prevState) => ({
            ...prevState,
            jumlahMu: 0,
            totalDiskonMu: 0,
            totalJumlahPajak: 0,
        }));
        setTotalBarang(0);
    };

    // const closeFrmMk = async () => {
    //     await ReCallRefreshModal();
    //     await setTimeout(() => {
    //         // onRefresh();
    //     }, 100);
    //     await onClose();
    // };

    const [IdDokumen, setIdDokumen] = useState(0);
    //=========== Setting format tanggal sesuai locale ID ===========
    const formatFloat: Object = { skeleton: 'C3', format: ',0.####;-,0.#####;#', maximumFractionDigits: 4 };

    const calculateData = async () => {
        const id = parseFloat((document.getElementsByName('id_mk')[0] as HTMLFormElement).value);
        setDataBarang((state: any) => {
            const newNodes = state?.nodes.map((node: any) => {
                // console.log('id_mk = ' + node.id_mk + 'IdDokumen = ' + id);
                if (node.id_mk === id) {
                    let qty_std = parseFloat((document.getElementsByName('qty')[0] as HTMLFormElement).value);
                    if (qty_std <= parseFloat(node.jml_mak)) {
                        let diskon_mu = node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
                        let harga_mu = node.harga_mu === null || node.harga_mu === '' ? 0 : parseFloat(node.harga_mu); //node.harga_btg
                        let potongan_mu = node.potongan_mu === null || node.potongan_mu === '' ? 0 : parseFloat(node.potongan_mu);
                        let nilai_pajak = node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak);
                        let diskon = node.diskon === null || node.diskon === '' ? '0' : node.diskon;

                        let diskonMu, jumlah_mu: any, pajak_mu: any, diskon_mu_tot: any, total_diskon_mu: any;
                        total_diskon_mu = 0;
                        jumlah_mu = (diskon_mu !== null || diskon_mu !== '') && qty_std > 0 && harga_mu > 0 ? qty_std * (harga_mu - potongan_mu - diskon_mu) : harga_mu * qty_std;

                        if (node.kode_pajak === 'N') {
                            pajak_mu = 0;
                        } else if (node.kode_pajak === 'E') {
                            pajak_mu = (jumlah_mu * nilai_pajak) / 100;
                        } else if (node.kode_pajak === 'I') {
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
                        total_diskon_mu = qty_std * (diskon_mu + potongan_mu);
                        // console.log(
                        //     'diskon_mu = ' + diskon_mu + 'harga_mu = ' + harga_mu + 'potongan_mu = ' + potongan_mu + 'nilai_pajak = ' + nilai_pajak + 'diskon = ' + diskon + 'pajak mu = ' + pajak_mu
                        // );
                        return {
                            ...node,
                            jumlah_mu: jumlah_mu,
                            nilai_pajak: pajak_mu,
                            pajak_mu: pajak_mu,
                            total_diskon_mu: total_diskon_mu,
                            diskon_mu: diskon_mu_tot,
                            kuantitas: qty_std,
                        };
                    } else {
                        withReactContent(swalDialog).fire({
                            icon: 'error',
                            title: `<p style="font-size:12px">Jumlah maksimum "${node.nama_barang}" yang dapat di-retur kan adalah ${frmNumber(node.jml_mak)} BTG</p>`,
                            width: '20%',
                            target: '#dialogTtbList',
                            confirmButtonText: 'Ok',
                        });

                        let qty_std;
                        qty_std = parseFloat(node.jml_mak);
                        let diskon_mu = node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
                        let harga_mu = node.harga_mu === null || node.harga_mu === '' ? 0 : parseFloat(node.harga_mu); //node.harga_btg
                        let potongan_mu = node.potongan_mu === null || node.potongan_mu === '' ? 0 : parseFloat(node.potongan_mu);
                        let nilai_pajak = node.nilai_pajak === null || node.nilai_pajak === '' ? 0 : parseFloat(node.pajak);
                        let diskon = node.diskon === null || node.diskon === '' ? '0' : node.diskon;

                        // Perhitungan
                        let diskonMu, jumlah_mu: any, pajak_mu: any, diskon_mu_tot: any, total_diskon_mu: any;
                        total_diskon_mu = 0;
                        jumlah_mu = (diskon_mu !== null || diskon_mu !== '') && qty_std > 0 && harga_mu > 0 ? qty_std * (harga_mu - potongan_mu - diskon_mu) : harga_mu * qty_std;
                        if (node.kode_pajak === 'N') {
                            pajak_mu = 0;
                        } else if (node.kode_pajak === 'E') {
                            pajak_mu = (jumlah_mu * nilai_pajak) / 100;
                        } else if (node.kode_pajak === 'I') {
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
                        total_diskon_mu = qty_std * (diskon_mu + potongan_mu);
                        // END
                        const kuantitas = document.getElementById('kuantitas' + node.id) as HTMLInputElement;
                        if (kuantitas) {
                            kuantitas.value = frmNumber(node.qty_std);
                        }

                        return {
                            ...node,
                            jumlah_mu: jumlah_mu,
                            nilai_pajak: pajak_mu,
                            pajak_mu: pajak_mu,
                            total_diskon_mu: total_diskon_mu,
                            diskon_mu: diskon_mu_tot,
                        };
                    }
                } else {
                    return node;
                }
            });
            let totalJumlahMu = 0,
                totalDiskonMu = 0,
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

            setDataTotalHeader((prevState) => ({
                ...prevState,
                jumlahMu: totalJumlahMu,
                totalDiskonMu: totalDiskonMu,
                totalJumlahPajak: totalJumlahPajak,
            }));

            return {
                nodes: newNodes,
            };
        });
    };
    const qtyParams = { params: { format: 'N', decimals: 4, showClearButton: false, showSpinButton: false, change: calculateData } };
    const handleDetailBarang_Add = async () => {
        if (quMMKkode_cust === '') {
            withReactContent(Swal).fire({
                // icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>Customer belum diisi.</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        } else if (quMMKkode_fj === '') {
            withReactContent(Swal).fire({
                // icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>No Faktur belum diisi.</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        } else if (quMMKkode_ttb === '') {
            withReactContent(Swal).fire({
                // icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>No TTB belum diisi.</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        } else {
            const id = dataBarang?.nodes.length + 1;
            setIdDokumen(id);
            const totalLine = dataBarang?.nodes.length;
            const newNode = {
                kode_mk: '',
                id_mk: id,
                kode_ttb: '',
                id_ttb: '',
                kode_fj: '',
                id_fj: '',
                kode_sj: '',
                id_sj: '',
                kode_do: '',
                id_do: '',
                kode_so: '',
                id_so: '',
                kode_item: '',
                diskripsi: '',
                satuan: '',
                qty: 0,
                sat_std: 0,
                qty_std: 0,
                kode_mu: '',
                kurs: 0,
                kurs_pajak: '',
                harga_mu: 0,
                diskon: 0,
                diskon_mu: 0,
                potongan_mu: 0,
                kode_pajak: '',
                pajak: '',
                include: '',
                pajak_mu: 0,
                jumlah_mu: 0,
                jumlah_rp: 0,
                kode_dept: '',
                kode_kerja: '',
                hpp: 0,
                no_ttb: '',
                no_item: '',
                nama_dept: '',
                nama_kerja: '',
                qty_fj: 0,
                pajak_fj: 0,
                disc_per_item: 0,
            };

            const hasEmptyFields = dataBarang?.nodes.some((row: { no_item: string }) => row.no_item === '');

            if (!hasEmptyFields) {
                setDataBarang((state: any) => ({
                    ...state,
                    nodes: state?.nodes.concat(newNode),
                }));
                gridMkDetail.addRecord();
            } else {
                // alert('Harap isi nama barang sebelum tambah data');
                document.getElementById('gridMkDetail')?.focus();
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px">Harap isi data sebelum tambah detail barang</p>',
                    width: '100%',
                    target: '#frmMk',
                });
            }
        }
    };

    const [IdDokumenJurnal, setIdDokumenJurnal] = useState(0);
    const [tambahJurnal, setTambahJurnal] = useState(false);
    const [searchNoAkun, setSearchNoAkun] = useState('');
    const [searchNamaAkun, setSearchNamaAkun] = useState('');
    const [selectedAkunJurnal, setSelectedAkunJurnal] = useState<any>('');

    const handleDetailJurnal_EndEdit = async () => {
        gridJurnalDetail.endEdit();
    };
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [selectedRowIndexJurnal, setSelectedRowIndexJurnal] = useState(0);

    const getFromModalAkunJurnal = async () => {
        await handleDetailJurnal_EndEdit();
        handleDetailJurnal_Add('selected');
        setModalAkunJurnal(false);
    };

    const handleDetailJurnal_Add = async (jenis: any) => {
        // if (dataBarang?.nodes.length > 0) {
        await handleDetailJurnal_EndEdit();
        const totalLine = gridJurnalDetail.dataSource.length; //dataJurnal?.nodes.length + 1;
        const isNoAkunEmpty = gridJurnalDetail.dataSource.every((item: any) => item.no_akun !== '');
        // console.log('dataBarang?.nodes.length ', dataBarang?.nodes.length);
        if (jenis === 'selected') {
            //BUAT BLOKINGAN JURNAL
            try {
                const detailJurnalBaru = {
                    kode_dokumen: '',
                    id_dokumen: totalLine,
                    dokumen: '',
                    tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                    kode_akun: selectedAkunJurnal.kode_akun,
                    kode_subledger: '',
                    kurs: quMMKkurs,
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
                    approval: '',
                    posting: '',
                    rekonsiliasi: '',
                    tgl_rekonsil: '',
                    userid: userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: '',
                    kode_kry: '',
                    kode_jual: divisiPenjualan,
                    no_kontrak_um: '',
                    no_akun: selectedAkunJurnal.no_akun,
                    nama_akun: selectedAkunJurnal.nama_akun,
                    tipe: selectedAkunJurnal.tipe,
                    kode_mu: quMMKkode_mu,
                    nama_dept: '',
                    nama_kerja: '',
                    no_subledger: '',
                    nama_subledger: '',
                    isledger: '',
                };

                gridJurnalDetail.dataSource[selectedRowIndexJurnal] = detailJurnalBaru;
                setTambahJurnal(true);
                gridJurnalDetail.refresh();
                return;
            } catch (error) {
                console.error('Error:', error);
            }
        } else if ((totalLine === 0 && jenis === 'new') || (isNoAkunEmpty && jenis === 'new')) {
            // console.log('masuk jurnal ', dataBarang?.nodes.length);
            const detailJurnalBaru = {
                kode_dokumen: '',
                id_dokumen: totalLine + 1,
                dokumen: '',
                tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                kode_akun: '',
                kode_subledger: '',
                kurs: quMMKkurs,
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
                approval: '',
                posting: '',
                rekonsiliasi: '',
                tgl_rekonsil: '',
                userid: userid,
                tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                audit: '',
                kode_kry: '',
                kode_jual: divisiPenjualan,
                no_kontrak_um: '',
                no_akun: '',
                nama_akun: '',
                tipe: '',
                kode_mu: quMMKkode_mu,
                nama_dept: '',
                nama_kerja: '',
                no_subledger: '',
                nama_subledger: '',
                isledger: '',
            };

            gridJurnalDetail.addRecord(detailJurnalBaru, totalLine);

            // setTimeout(() => {
            //     gridJurnalDetail.startEdit(totalLine);
            // },200);
            // gridJurnalDetail.dataSource[selectedRowIndexJurnal] = detailJurnalBaru;
            setTambahJurnal(true);
            // gridJurnalDetail.refresh();
        } else {
            document.getElementById('gridJurnalDetail')?.focus();
            myAlert(`Silahkan melengkapi data barang sebelum menambah data baru.`);
        }
        // } else {
        //     myAlert(`Data Barang Kosong. Detail Jurnal tidak bisa ditambah.`);
        // }
    };

    const closeDialogMkForm = async () => {
        await ReCallRefreshModal();
        await setTimeout(() => {
            // onRefresh();
        }, 100);
        await onClose();
    };

    const simpanDokumen = async () => {
        // console.log('mauk pa ekooo');
        saveDoc();
    };

    buttonInputData = [
        {
            buttonModel: {
                content: 'Tutup',
                cssClass: 'e-danger e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: closeDialogMkForm,
        },
    ];

    // ================================== MODAL CUSTOMER =================
    const [searchNoCust, setSearchNoCust] = useState('');
    const [searchNamaCust, setSearchNamaCust] = useState('');
    const [searchNamaSales, setSearchNamaSales] = useState('');
    const [activeSearchDaftarCustomer, setActiveSearchDaftarCustomer] = useState('namaCust');

    // const [dsDaftarCustomer, setDsDaftarCustomer] = useState([]);
    // const [searchKeywordNoCust, setSearchKeywordNoCust] = useState<string>('');
    // const [searchKeywordNamaCust, setSearchKeywordNamaCust] = useState<string>('');
    // const [searchKeywordNamaSales, setSearchKeywordNamaSales] = useState<string>('');
    // const [filteredDataDlgCust, setFilteredDataDlgCust] = useState([]);

    // const [dsDataCust, setDsDataCust] = useState([]);
    const [noCustomerState, setNoCustomerState] = useState('');
    const [namaRelasiState, setNamaRelasiState] = useState('');
    const [namaSalesState, setNamaSalesState] = useState('');
    const fetchDataCustomerDlg = async () => {
        let paramNoCust = noCustomerState || 'all';
        let paramNamaRelasi = namaRelasiState || 'all';
        let paramNamaSales = namaSalesState || 'all';
        const responseDataCustomerListDlg = await axios.get(`${apiUrl}/erp/list_customer_mk_dlg?`, {
            params: {
                entitas: kode_entitas,
                param1: paramNoCust,
                param2: paramNamaRelasi,
                param3: paramNamaSales,
            },
        });
        const dataCustomerListDlg = responseDataCustomerListDlg.data.data;
        // setDsDataCust(dataCustomerListDlg);
        gridDaftarCustomer.dataSource = dataCustomerListDlg;
    };

    useEffect(() => {
        // console.log('eksekusi');
        fetchDataCustomerDlg();
    }, [noCustomerState, namaRelasiState, namaSalesState]);

    const [dsDataFj, setDsDataFj] = useState([]);
    const [tglFjState, setTglFjState] = useState('');
    const [noFjState, setNoFjState] = useState('');
    const fetchDataFjDlg = async () => {
        let paramKodeCust = quMMKkode_cust || 'all';
        let paramTglFJ = tglFjState || 'all';
        let paramNoFJ = noFjState || 'all';
        const response = await axios.get(`${apiUrl}/erp/list_fj_dialog?`, {
            params: {
                entitas: kode_entitas,
                param1: paramKodeCust,
                param2: paramNoFJ,
                param3: paramTglFJ,
            },
        });
        // console.log('response :', {
        //     entitas: kode_entitas,
        //     param1: paramKodeCust,
        //     param2: paramNoFJ,
        //     param3: paramTglFJ,
        // });

        const dataFj = response.data.data;
        const modifiedDataFj: any = dataFj.map((node: any) => ({
            ...node,
            tgl: moment(node.tgl).format('DD-MM-YYYY HH:mm:ss'),
        }));

        // console.log('modifiedDataFj ', dataFj);
        setDsDataFj(modifiedDataFj);
    };
    useEffect(() => {
        // console.log('eksekusi');
        fetchDataFjDlg();
    }, [quMMKkode_cust, noFjState, tglFjState]);

    const [dsDataTtb, setDsDataTtb] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [search, setSearch] = useState('');

    const [tglTtbState, setTglTtbState] = useState('');
    const [noTtbState, setNoTtbState] = useState('');

    const fetchDataTtbDlg = async () => {
        let paramKodeCust = quMMKkode_cust || 'all';
        let paramKodeFj = quMMKkode_fj || 'all';
        let paramTglTtb = tglFjState || 'all';
        let paramNoTtb = noFjState || 'all';
        const response = await axios.get(`${apiUrl}/erp/list_ttb_dialog?`, {
            params: {
                entitas: kode_entitas,
                param1: paramKodeCust,
                param2: paramKodeFj,
                param3: paramNoTtb,
                param4: paramTglTtb,
            },
        });

        const dataTtb = response.data.data;
        const modifiedDataTtb: any = dataTtb.map((node: any) => ({
            ...node,
            tgl: moment(node.tgl).format('DD-MM-YYYY'),
        }));
        gridDlgListTtb.dataSource = modifiedDataTtb;
        // setDsDataTtb(modifiedDataTtb);
    };
    useEffect(() => {
        // console.log('eksekusi');
        fetchDataTtbDlg();
        // }, [quMMKkode_fj, quMMKkode_cust, noTtbState, tglTtbState]);
    }, [modalDlgTtb]);

    const handleDlgCust = (
        dataObject: any,
        kode_cust: any,
        no_cust: any,
        nama_relasi: any,
        kode_pajak: any,
        kode_mu: any,
        kode_sales: any,
        nama_sales: any,
        kurs: any,
        kurs_pajak: any,
        tipeMk: any,
        kena_pajak: any,
    ) => {
        // console.log(dataObject[0].kurs_pajak);

        kode_cust(dataObject[0].kode_cust);
        no_cust(dataObject[0].no_cust);
        nama_relasi(dataObject[0]?.nama_relasi);
        kode_pajak(dataObject[0].kode_pajak);
        kode_mu(dataObject[0].kode_mu);
        kode_sales(dataObject[0].kode_sales);
        nama_sales(dataObject[0].nama_sales);
        kurs(Number(dataObject[0].kurs).toFixed(2));
        kurs_pajak(Number(dataObject[0].kurs_pajak).toFixed(2));
        tipeMk(dataObject[0].tipe);
        kena_pajak(dataObject[0].kena_pajak);
    };

    buttonDaftarCustomer = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarCustomer = gridDaftarCustomer.getSelectedRecords();
                if (currentDaftarCustomer.length > 0) {
                    handleDlgCust(
                        currentDaftarCustomer,
                        setquMMKkode_cust,
                        setquMMKno_cust,
                        setquMMKnama_relasi,
                        setquMMKkode_pajak,
                        setquMMKkode_mu,
                        setquMMKkode_sales,
                        setquMMKnama_sales,
                        setquMMKkurs,
                        setquMMKkurs_pajak,
                        setquMMKtipe,
                        setquMMKkena_pajak,
                    );
                    setModalCust(false);
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                        width: '100%',
                        target: '#dialogDaftarCustomer',
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
            click: async () => {
                const noCustInput = (await document.getElementById('noCust')) as HTMLInputElement;
                if (noCustInput) {
                    noCustInput.value = '';
                }
                await setModalCust(false);
            },
        },
    ];
    // ================================== END MODAL CUSTOMER =================

    // ========================== MODAL DIALOG FJ =============================

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

    const handleDlgFj = (dataObject: any, no_fj: any, kode_fj: any, no_reff: any, kena_pajak: any, kode_sales: any) => {
        // console.log(dataObject[0]);
        no_fj(dataObject[0].no_fj);
        kode_fj(dataObject[0].kode);
        no_reff(dataObject[0].no_fj);
        kena_pajak(dataObject[0].kena_pajak);
        kode_sales(dataObject[0].kode_sales);

        if (dataObject[0].kena_pajak === 'N') {
            setValueKenaPajak('Tanpa Pajak');
        } else if (dataObject[0].kena_pajak === 'I') {
            setValueKenaPajak('Include ( I )');
        } else if (dataObject[0].kena_pajak === 'E') {
            setValueKenaPajak('Exclude ( E )');
        }
    };

    btnDlgListFj = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDlgListFj = gridDlgListFj.getSelectedRecords();
                if (currentDlgListFj.length > 0) {
                    handleDlgFj(currentDlgListFj, setquMMKno_fj, setquMMKkode_fj, setquMMKno_reff, setquMMKkena_pajak, setquMMKkode_sales);
                    setModalDlgFj(false);
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data Faktur</p>',
                        width: '100%',
                        target: '#dialogDaftarCustomer',
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
            click: async () => {
                const noFjInput = (await document.getElementById('noFj')) as HTMLInputElement;
                if (noFjInput) {
                    noFjInput.value = '';
                }
                await setModalDlgFj(false);
            },
        },
    ];
    const [selectedRowDlgFj, setSelectedRowDlgFj] = useState(0);
    const rowSelectingDlgFj = (args: any) => {
        setSelectedRowDlgFj(args.data);
        // console.log(args.data);
    };

    //========================================================================================

    // ========================== MODAL DIALOG TTB =============================

    const swalToastTtb = swal.mixin({
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

    const handleDlgTtb = (dataObject: any, no_ttb: any, kode_ttb: any) => {
        // console.log(dataObject[0]);
        no_ttb(dataObject[0].no_ttb);
        kode_ttb(dataObject[0].kode);
    };

    btnDlgListTtb = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDlgListTtb = gridDlgListTtb.getSelectedRecords();
                if (currentDlgListTtb.length > 0) {
                    handleDlgTtb(currentDlgListTtb, setquMMKno_ttb, setquMMKkode_ttb);
                    setModalDlgTtb(false);
                } else {
                    withReactContent(swalToastTtb).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data Faktur</p>',
                        width: '100%',
                        target: '#dialogDaftarCustomer',
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
            click: async () => {
                const noTtbInput = (await document.getElementById('noTtb')) as HTMLInputElement;
                if (noTtbInput) {
                    noTtbInput.value = '';
                }
                await setModalDlgTtb(false);
            },
        },
    ];
    const [selectedRowDlgTtb, setSelectedRowDlgTtb] = useState(0);
    const rowSelectingDlgTtb = (args: any) => {
        setSelectedRowDlgTtb(args.data);
        // console.log(args.data);
    };

    //========================================================================================

    //============== Format baris pada grid Detail Barang =============
    const rowDataBoundDetailBarang = (args: any) => {
        if (args.row) {
            if (getValue('kode_mk', args.data) == 'ADDROW') {
                args.row.style.background = '#F2FDF8';
            } else {
                args.row.style.background = '#ffffff';
            }
        }
    };

    //============= Format cell pada grid Detail Barang =============
    const queryCellInfoDetailBarang = (args: any) => {
        if ((args.column?.field === 'fpp_btg' || args.column?.field === 'fpp_harga_btg' || args.column?.field === 'berat') && !args.column?.isSelected) {
            args.cell.style.color = '#B6B5B5';
        }
    };

    let textareaObj: any;
    function onCreateMultiline(): void {
        textareaObj.addAttributes({ rows: 1 });
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = '60px'; //textareaObj.respectiveElement.scrollHeight + 'px';
    }

    const editTemplateNoBarang = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_item" name="no_item" className="no_item" value={args.no_item} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    // console.log('ABC');
                                    // FilterCustomer(refNamaCust.current, swalDialog, dataBarang, custSelected, setHandleNamaCust, setModal1, DialogDaftarSjItem);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

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

    const [selectedRowCust, setSelectedRowCust] = useState(0);
    const rowSelectingDlgCustomer = (args: any) => {
        setSelectedRowCust(args.data);
        // console.log(args.data);
    };

    useEffect(() => {
        FillFromSQL(kode_entitas, 'departemen')
            .then((result: any) => {
                const modifiedData = result.map((item: any) => ({
                    ...item,
                    dept_ku: item.no_dept_dept + ' - ' + item.nama_dept,
                    dept_ku2: item.kode_dept + '*' + item.no_dept_dept + ' - ' + item.nama_dept,
                }));
                setListDepartemen(modifiedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        FillFromSQL(kode_entitas, 'kategori', '')
            .then((result) => {
                setApiResponseKategori(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        FillFromSQL(kode_entitas, 'kelompok', '')
            .then((result) => {
                setApiResponseKelompok(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        FillFromSQL(kode_entitas, 'merk', '')
            .then((result) => {
                setApiResponseMerk(result);
                // console.log(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [kode_entitas]);

    // console.log(custSelected);
    const mounted = useRef(false);
    const [listDepartemen, setListDepartemen] = useState([]);
    const [listPajak, setListPajak] = useState([]);
    const [dateGenerateNu, setDateGenerateNu] = useState<moment.Moment>(moment());
    let pJenisValue: any;

    useEffect(() => {
        // console.log('MASUK PA EKOOOO EDITTTTTTTTT');
        FillFromSQL(kode_entitas, 'pajak')
            .then((result: any) => {
                setListPajak(result);
                // console.log(result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        if (masterDataState === 'BARU') {
            // console.log('masterDataState', masterDataState);
            // console.log('MASUK PA EKOOOO BARUUUUU');
            setquMMKstatus('Terbuka');
            // generateNU(kode_entitas, '', '15', moment().format('YYYYMM'))
            generateNUDivisi(kode_entitas, '', divisiPenjualan, '15', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${divisiPenjualan}`)
                .then((result) => {
                    setquMMKno_mk(result);
                    // mSetNoMPB('');
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            // console.log('MASUK PA EKOOOO EDITTTTTTTTT');
            EditMk(masterKodeDokumen);
        }
        // }
    }, [kode_entitas]);

    const handleClearInput = async (textClear: any) => {
        const clearInput = document.getElementById(textClear) as HTMLInputElement;
        if (clearInput) {
            clearInput.value = '';
        }
    };

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
    let setFocus: any;

    //================ Editing template untuk kolom grid detail barang ==================
    const tombolDetailDlgItemBarang = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_item" name="no_item" className="no_item" value={args.no_item} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    // console.log(quMMKkode_cust);
                                    // if (quMMKkode_cust === '') {
                                    //     withReactContent(Swal).fire({
                                    //         // icon: 'error',
                                    //         title: `<span style='color: gray; font-weight: bold;'>Customer belum diisi.</span>`,
                                    //         width: '20%',
                                    //         target: '#frmMk',
                                    //         confirmButtonText: 'Ok',
                                    //     });

                                    // } else {
                                    setModalDlgTtbMk(true);
                                    HandleModaliconChange('noItem', dataBarang, quMMKno_cust, setModalDlgTtbMk);
                                    // }
                                    //// FilterCustomer(refNamaCust.current, swalDialog, dataBarang, custSelected, setHandleNamaCust, setModal1, DialogDaftarSjItem);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    // ========================== MODAL DIALOG TTB MK =============================
    useEffect(() => {
        let paramObject = {
            entitas: kode_entitas,
            vKodeCust: quMMKkode_cust,
            vKodeFj: quMMKkode_fj,
            vKodeTtb: quMMKkode_ttb,
            vKategori: 'all',
            vKelompok: 'all',
            vMerk: 'all',
            vNoItem: 'all',
            vNamaBarang: 'all',
        };
        FetchDlgTtbMk(paramObject, setRecordsDlgTtbMk);
        //  FetchDlgListTtb(kode_entitas, quMMKkode_cust, quMMKkode_fj, setDsDaftarDlgTtb);
    }, [kode_entitas, quMMKkode_cust, quMMKkode_fj, quMMKkode_ttb]);

    const [modalDlgTtbMK, setModalDlgTtbMk] = useState(false);
    const [selectedRowDlgTtbMk, setSelectedRowDlgTtbMk] = useState(0);
    const [filteredDataDlgTtbMk, setFilteredDataDlgTtbMk] = useState([]);
    const [recordsDlgTtbMk, setRecordsDlgTtbMk] = useState<DlgMkTtb[]>([]);
    const [activeSearchDlgNoBarang, setActiveSearchactiveSearchDlgNoBarang] = useState('no_item');

    const [isKategoriChecked, setIsKategoriChecked] = useState(false);
    const [isKelompokChecked, setIsKelompokChecked] = useState(false);
    const [isMerkChecked, setIsMerkChecked] = useState(false);
    const [isPilihSemua, setIsPilihSemua] = useState(false);
    const [apiResponseKategori, setApiResponseKategori] = useState<any[]>([]);
    const [apiResponseKelompok, setApiResponseKelompok] = useState<any[]>([]);
    const [apiResponseMerk, setApiResponseMerk] = useState<any[]>([]);
    const [selectedOptionKategori, setSelectedOptionKategori] = useState<string>('');
    const [selectedOptionKelompok, setSelectedOptionKelompok] = useState<string>('');
    const [selectedOptionMerk, setSelectedOptionMerk] = useState<string>('');
    const [searchNoBarang, setSearchNoBarang] = useState<string>('');
    const [searchNamaBarang, setSearchNamaBarang] = useState<string>('');

    type DlgMkTtb = {
        kode_ttb: any;
        id_ttb: any;
        kode_sj: any;
        id_sj: any;
        kode_do: any;
        id_do: any;
        kode_so: any;
        id_so: any;
        kode_item: any;
        diskripsi: any;
        satuan: any;
        qty: any;
        sat_std: any;
        qty_std: any;
        qty_sisa: any;
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
        pajak_mu: any;
        jumlah_mu: any;
        jumlah_rp: any;
        ket: any;
        kode_dept: any;
        kode_kerja: any;
        hpp: any;
        qty_sisa_lkb: any;
        no_ttb: any;
        tgl_ttb: any;
        kode_jual: any;
        kode_fj: any;
        id_fj: any;
        qty_fj: any;
        pajak_fj: any;
        disc_per_item: any;
        kirim_per_item: any;
        no_fj: any;
        no_item: any;
        harga_mu_fj: any;
        diskon_fj: any;
        potongan_mu_fj: any;
        kode_pajak_fj: any;
        pajak_d_fj: any;
        include_fj: any;
        qty_mk: any;
        jumlah_mu_fj: any;
    };

    const swalToastTtbMk = swal.mixin({
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
    const [nilaiHasil, setNilaiHasil] = useState('');
    const setPilihDetailBarang = async (item: any) => {
        // console.log('item', item);
        // console.log(dataBarang.nodes);

        if (isPilihSemua) {
            const dataDetail = await Promise.all(
                item.map(async (currentItem: any, vIdMk: any) => {
                    if (quMMKkode_jual === '' || divisiPenjualan === '') {
                        setDivisiPenjualan(currentItem.kode_jual);

                        if (masterDataState == 'BARU') {
                            const result = await generateNUDivisi(
                                kode_entitas,
                                '',
                                currentItem.kode_jual,
                                '15',
                                dateGenerateNu.format('YYYYMM'),
                                dateGenerateNu.format('YYMM') + `${currentItem.kode_jual}`,
                            );
                            setquMMKno_mk(result);
                        }
                    }

                    let nilaiQtyStd: number = 0;
                    let nilaiHasil: number = 0;
                    nilaiHasil = await qty2QtyStd(kode_entitas, currentItem.kode_item, currentItem.sat_std, currentItem.sat_std, currentItem.qty_sisa);

                    if (currentItem.sat_std !== '' && currentItem.sat_std !== null && currentItem.qty_sisa !== '' && currentItem.qty_sisa !== null) {
                        nilaiQtyStd = currentItem.satuan !== currentItem.sat_std ? nilaiHasil : currentItem.qty;
                    }

                    const hargaMu = currentItem.harga_mu_fj;
                    const potonganMu = currentItem.potongan_mu_fj;
                    const nilaiDiskon = currentItem.diskon == '' || currentItem.diskon === null ? 0 : parseFloat(currentItem.diskon);
                    const nilaiDiskonMu = (nilaiDiskon * hargaMu) / 100;
                    const nilaiJumlahMu = nilaiQtyStd * (hargaMu - potonganMu - nilaiDiskonMu);
                    const nilaiJumlahRp = nilaiJumlahMu * currentItem.kurs;
                    return {
                        id_mk: vIdMk + 1,
                        kode_ttb: currentItem.kode_ttb,
                        id_ttb: currentItem.id_ttb,
                        kode_fj: currentItem.kode_fj,
                        id_fj: currentItem.id_fj,
                        kode_sj: currentItem.kode_sj,
                        id_sj: currentItem.id_sj,
                        kode_do: currentItem.kode_do,
                        id_do: currentItem.id_do,
                        kode_so: currentItem.kode_so,
                        id_so: currentItem.id_so,
                        qty_fj: currentItem.qty_fj,
                        pajak_fj: currentItem.pajak_fj,
                        disc_per_item: currentItem.disc_per_item,
                        no_item: currentItem.no_item,
                        kode_item: currentItem.kode_item,
                        diskripsi: currentItem.diskripsi,
                        satuan: currentItem.sat_std,
                        sat_std: currentItem.sat_std,
                        qty: currentItem.qty_sisa,
                        harga_mu: currentItem.harga_mu_fj,
                        diskon: currentItem.diskon_fj,
                        potongan_mu: currentItem.potongan_mu_fj,
                        kode_pajak: currentItem.kode_pajak_fj,
                        pajak: currentItem.pajak_d_fj,
                        include: qudMkInclude,
                        hpp: currentItem.hpp,
                        kode_mu: currentItem.kode_mu,
                        kurs: currentItem.kurs,
                        kurs_pajak: currentItem.kurs_pajak,
                        qty_std: nilaiQtyStd,
                        jumlah_mu: nilaiJumlahMu,
                        diskon_mu: nilaiDiskonMu,
                        jumlah_rp: nilaiJumlahRp,
                        pajak_mu: currentItem.pajak_mu,
                        pajak_ui: currentItem.pajak_ui,
                    };
                }),
            );
            setTotalBarang(dataDetail.length);
            setDataBarang({ nodes: dataDetail });
            setIsPilihSemua(false);
            // console.log('newNodes akhir', dataDetail);
        } else {
            const filterKodeTtb = dataBarang.nodes.some((row: { kode_ttb: string }) => row.kode_ttb === item[0].kode_ttb);
            const filterIdTtb = dataBarang.nodes.some((row: { id_ttb: string }) => row.id_ttb === item[0].id_ttb);
            const filterKodeItem = dataBarang.nodes.some((row: { kode_item: string }) => row.kode_item === item[0].kode_item);

            // REMARK DULU SEMENTARA BUAT TES YA
            // if (filterKodeTtb === true || filterIdTtb === true || filterKodeItem === true) {
            if (filterKodeTtb === true && filterIdTtb === true && filterKodeItem === true) {
                withReactContent(swalDialog)
                    .fire({
                        icon: 'error',
                        title: `<span style='color: gray; font-weight: bold;'>Barang ${item[0].diskripsi} untuk No. TTB ${item[0].no_ttb} sudah ada.</span>`,
                        width: '20%',
                        target: '#frmMk',
                        confirmButtonText: 'Ok',
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            HandleRemoveRowsOtomatis(setDataBarang);
                        }
                    });

                return;
            }

            if (quMMKkode_jual === '' || divisiPenjualan === '') {
                await setDivisiPenjualan(item[0].kode_jual);

                if (masterDataState == 'BARU') {
                    await generateNUDivisi(kode_entitas, '', item[0].kode_jual, '15', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${item[0].kode_jual}`)
                        .then((result) => {
                            setquMMKno_mk(result);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            }
            let nilaiQtyStd: number = 0;
            let nilaiHasil: number = 0;
            nilaiHasil = await qty2QtyStd(kode_entitas, item[0].kode_item, item[0].sat_std, item[0].sat_std, item[0].qty_sisa);
            if (item[0].sat_std !== '' || item[0].sat_std !== null || item[0].qty_sisa !== '' || item[0].qty_sisa !== null) {
                if (item[0].satuan !== item[0].sat_std) {
                    nilaiQtyStd = nilaiHasil;
                } else {
                    nilaiQtyStd = item[0].qty;
                }
            }

            const newNodes: any = dataBarang.nodes.map((node: any) => {
                // let diskon = '';
                if (node.id_mk === IdDokumen) {
                    const hargaMu = item[0].harga_mu_fj; //.includes(',') ? parseFloat(tanpaKoma(item[0].harga_mu_fj)) : parseFloat(item[0].harga_mu_fj);
                    const potonganMu = item[0].potongan_mu_fj; //.includes(',') ? parseFloat(tanpaKoma(item[0].potongan_mu_fj)) : parseFloat(item[0].potongan_mu_fj);
                    const nilaiDiskon = item[0].diskon == '' || item[0].diskon === null ? 0 : parseFloat(item[0].diskon);
                    const nilaiDiskonMu = (nilaiDiskon * hargaMu) / 100;
                    const nilaiJumlahMu = nilaiQtyStd * (hargaMu - potonganMu - nilaiDiskonMu);
                    const nilaiJumlahRp = nilaiJumlahMu * item[0].kurs;
                    return {
                        ...node,
                        id_mk: IdDokumen,
                        kode_ttb: item[0].kode_ttb,
                        id_ttb: item[0].id_ttb,
                        kode_fj: item[0].kode_fj,
                        id_fj: item[0].id_fj,
                        kode_sj: item[0].kode_sj,
                        id_sj: item[0].id_sj,
                        kode_do: item[0].kode_do,
                        id_do: item[0].id_do,
                        kode_so: item[0].kode_so,
                        id_so: item[0].id_so,
                        qty_fj: item[0].qty_fj,
                        pajak_fj: item[0].pajak_fj,
                        disc_per_item: item[0].disc_per_item,
                        no_item: item[0].no_item,
                        kode_item: item[0].kode_item,
                        diskripsi: item[0].diskripsi,
                        satuan: item[0].sat_std,
                        sat_std: item[0].sat_std,
                        qty: item[0].qty_sisa,
                        harga_mu: item[0].harga_mu_fj,
                        diskon: item[0].diskon_fj,
                        potongan_mu: item[0].potongan_mu_fj,
                        kode_pajak: item[0].kode_pajak_fj,
                        pajak: item[0].pajak_d_fj,
                        include: qudMkInclude, //item[0].include_fj,
                        hpp: item[0].hpp,
                        kode_mu: item[0].kode_mu,
                        kurs: item[0].kurs,
                        kurs_pajak: item[0].kurs_pajak,
                        qty_std: nilaiQtyStd,
                        jumlah_mu: nilaiJumlahMu,
                        diskon_mu: nilaiDiskonMu,
                        jumlah_rp: nilaiJumlahRp,
                        pajak_mu: item[0].pajak_mu, //quDMKpajak_mu,
                        pajak_ui: item[0].pajak_ui,
                    };
                } else {
                    return node;
                }
            });

            // console.log(newNodes);

            setTotalBarang(IdDokumen);
            setDataBarang({ nodes: newNodes });
            // console.log('newNodes 1 ', newNodes);
        }
    };

    // const setPilihDetailBarang = async (item: any) => {
    //     console.log('item', item);

    //     let newNodes = [...dataBarang.nodes];

    //     const processItem = async (currentItem: any) => {
    //         const filterKodeTtb = newNodes.some((row: { kode_ttb: string }) => row.kode_ttb === currentItem.kode_ttb);
    //         const filterIdTtb = newNodes.some((row: { id_ttb: string }) => row.id_ttb === currentItem.id_ttb);
    //         const filterKodeItem = newNodes.some((row: { kode_item: string }) => row.kode_item === currentItem.kode_item);

    //         if (filterKodeTtb && filterIdTtb && filterKodeItem) {
    //             return; // Skip this item if it already exists
    //         }

    //         if (quMMKkode_jual === '' || divisiPenjualan === '') {
    //             setDivisiPenjualan(currentItem.kode_jual);

    //             if (masterDataState == 'BARU') {
    //                 const result = await generateNUDivisi(kode_entitas, '', currentItem.kode_jual, '15', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${currentItem.kode_jual}`);
    //                 setquMMKno_mk(result);
    //             }
    //         }

    //         let nilaiQtyStd: number;
    //         const nilaiHasil = await qty2QtyStd(kode_entitas, currentItem.kode_item, currentItem.sat_std, currentItem.sat_std, currentItem.qty_sisa);

    //         if (currentItem.sat_std !== '' && currentItem.sat_std !== null && currentItem.qty_sisa !== '' && currentItem.qty_sisa !== null) {
    //             nilaiQtyStd = currentItem.satuan !== currentItem.sat_std ? nilaiHasil : currentItem.qty;
    //         }

    //         const hargaMu = currentItem.harga_mu_fj;
    //         const potonganMu = currentItem.potongan_mu_fj;
    //         const nilaiDiskon = currentItem.diskon == '' || currentItem.diskon === null ? 0 : parseFloat(currentItem.diskon);
    //         const nilaiDiskonMu = (nilaiDiskon * hargaMu) / 100;
    //         const nilaiJumlahMu = nilaiQtyStd * (hargaMu - potonganMu - nilaiDiskonMu);
    //         const nilaiJumlahRp = nilaiJumlahMu * currentItem.kurs;

    //         return {
    //             id_mk: IdDokumen,
    //             kode_ttb: currentItem.kode_ttb,
    //             id_ttb: currentItem.id_ttb,
    //             kode_fj: currentItem.kode_fj,
    //             id_fj: currentItem.id_fj,
    //             kode_sj: currentItem.kode_sj,
    //             id_sj: currentItem.id_sj,
    //             kode_do: currentItem.kode_do,
    //             id_do: currentItem.id_do,
    //             kode_so: currentItem.kode_so,
    //             id_so: currentItem.id_so,
    //             qty_fj: currentItem.qty_fj,
    //             pajak_fj: currentItem.pajak_fj,
    //             disc_per_item: currentItem.disc_per_item,
    //             no_item: currentItem.no_item,
    //             kode_item: currentItem.kode_item,
    //             diskripsi: currentItem.diskripsi,
    //             satuan: currentItem.sat_std,
    //             sat_std: currentItem.sat_std,
    //             qty: currentItem.qty_sisa,
    //             harga_mu: currentItem.harga_mu_fj,
    //             diskon: currentItem.diskon_fj,
    //             potongan_mu: currentItem.potongan_mu_fj,
    //             kode_pajak: currentItem.kode_pajak_fj,
    //             pajak: currentItem.pajak_d_fj,
    //             include: qudMkInclude,
    //             hpp: currentItem.hpp,
    //             kode_mu: currentItem.kode_mu,
    //             kurs: currentItem.kurs,
    //             kurs_pajak: currentItem.kurs_pajak,
    //             qty_std: nilaiQtyStd,
    //             jumlah_mu: nilaiJumlahMu,
    //             diskon_mu: nilaiDiskonMu,
    //             jumlah_rp: nilaiJumlahRp,
    //             pajak_mu: currentItem.pajak_mu,
    //             pajak_ui: currentItem.pajak_ui,
    //         };
    //     };

    //     if (isPilihSemua) {
    //         try {
    //             if (item.length > 0) {
    //                 const processedItems = await Promise.all(item.map(processItem));
    //                 newNodes = [...newNodes, ...processedItems.filter(Boolean)];
    //             }
    //         } finally {
    //             setIsPilihSemua(false);
    //         }
    //     } else {
    //         const processedItem = await processItem(item[0]);
    //         if (processedItem) {
    //             newNodes.push(processedItem);
    //         }
    //     }

    //     setTotalBarang(IdDokumen);
    //     setDataBarang({ nodes: newNodes });

    //     // Update Syncfusion Grid
    //     if (gridMkDetail) {
    //         gridMkDetail.dataSource = newNodes;
    //         gridMkDetail.refresh();
    //     }
    // };

    const btnViewDlgTtbMk = async () => {
        // console.log('data Barang', dataBarang);
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                let vKategori = 'all';
                let vKelompok = 'all';
                let vMerk = 'all';

                if (isKategoriChecked) {
                    vKategori = `${selectedOptionKategori}`;
                }

                if (isKelompokChecked) {
                    vKelompok = `${selectedOptionKelompok}`;
                }

                if (isMerkChecked) {
                    vMerk = `${selectedOptionMerk}`;
                }

                let paramObject = {
                    entitas: kode_entitas,
                    vKodeCust: quMMKkode_cust,
                    vKodeFj: quMMKkode_fj,
                    vKodeTtb: quMMKkode_ttb,
                    vKategori: vKategori,
                    vKelompok: vKelompok,
                    vMerk: vMerk,
                    vNoItem: 'all',
                    vNamaBarang: 'all',
                };
                const responseData = await GetListDlgMkTtb(paramObject);

                // console.log(responseData);
                setRecordsDlgTtbMk(responseData);
                //  showLoading1(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    // const HandleDlgPilihTtbMk = (dataObject: any, no_fj: any, kode_fj: any, no_reff: any, kena_pajak: any, kode_sales: any) => {
    //     // console.log(dataObject[0]);
    //     no_fj(dataObject[0].no_fj);
    //     kode_fj(dataObject[0].kode);
    //     no_reff(dataObject[0].no_fj);
    //     kena_pajak(dataObject[0].kena_pajak);
    //     kode_sales(dataObject[0].kode_sales);

    //     if (dataObject[0].kode_pajak_fj === 'S') {
    //         setValueKenaPajak('Tanpa Pajak');
    //     } else if (dataObject[0].kena_pajak === 'I') {
    //         setValueKenaPajak('Include ( I )');
    //     } else if (dataObject[0].kena_pajak === 'E') {
    //         setValueKenaPajak('Exclude ( E )');
    //     }
    // };

    const HandleDlgPilihTtbMk = (currentDlgListTtbMk: any) => {
        //  currentDlgListTtbMk = dgDlgTtbMk.getSelectedRecords();
        if (dgDlgTtbMk) {
            //Selecting row first
            // const rowIndex: number = args.row.rowIndex;
            // dgDlgTtbMk.selectRow(rowIndex);
            currentDlgListTtbMk = dgDlgTtbMk.getSelectedRecords();
            // console.log(currentDlgListTtbMk);
            if (currentDlgListTtbMk.length > 0) {
                const modifiedDataDlg: any = currentDlgListTtbMk.map((node: any) => ({
                    ...node,
                    pajak_ui: node.kode_pajak_fj === 'S' ? 'S - PPN 10%' : node.kode_pajak_fj === 'T' ? 'T - PPN 11%' : 'N - Tanpa Pajak',
                }));
                setPilihDetailBarang(modifiedDataDlg);
                // console.log(modifiedDataDlg);
                setModalDlgTtbMk(false);
            } else {
                withReactContent(swalToastTtbMk).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                    width: '100%',
                    target: '#frmttbdlgMK',
                });
            }
        }
    };

    buttonDlgTtbMk = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: async () => {
                if (isPilihSemua) {
                    await Swal.fire({
                        title: `Pilih semua data ?`,
                        showCancelButton: true,
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'Tidak',
                        target: '#frmttbdlgMK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // console.log('dgDlgTtbMk', dgDlgTtbMk);
                            const modifiedDataDlg: any = dgDlgTtbMk.dataSource.map((node: any) => ({
                                ...node,
                                pajak_ui: node.kode_pajak_fj === 'S' ? 'S - PPN 10%' : node.kode_pajak_fj === 'T' ? 'T - PPN 11%' : 'N - Tanpa Pajak',
                            }));
                            // console.log('modifiedDataDlg', modifiedDataDlg);
                            setPilihDetailBarang(modifiedDataDlg);
                            setModalDlgTtbMk(false);
                        } else {
                            setIsPilihSemua(false);
                        }
                    });
                } else {
                    // console.log('pilih satuan');
                    currentDlgListTtbMk = dgDlgTtbMk.getSelectedRecords();
                    // console.log(currentDlgListTtbMk);
                    if (currentDlgListTtbMk.length > 0) {
                        HandleDlgPilihTtbMk(currentDlgListTtbMk);
                        setModalDlgTtbMk(false);
                    } else {
                        withReactContent(swalToastTtbMk).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px">Silahkan pilih data Faktur</p>',
                            width: '100%',
                            target: '#dialogDaftarCustomer',
                        });
                    }
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
            click: async () => {
                const noBarangInput = (await document.getElementById('noItem')) as HTMLInputElement;
                if (noBarangInput) {
                    noBarangInput.value = '';
                }
                await setModalDlgTtbMk(false);
            },
        },
    ];

    const rowSelectingDlgTtbMk = (args: any) => {
        setSelectedRowDlgTtbMk(args.data);
        // console.log(args.data);
    };

    let lbSumDiskonDok: any;
    let lbTotalDPP: any;
    let lbTotalPajak: any;
    let qudMkInclude: any, quDMKpajak_mu: any;
    let vPajak: any, vDiskonPerBarang: any, vTotDiskonPerBarang: any, vTotalAwal: any, vTotal_mu: any, vNetto_mu: any, vTotal_dpp: any, vTotal_Diskon_mu: any;
    let vPajakMu: any;
    const [hasilTotalDpp, sethasilTotalDpp] = useState<any>('');
    const [hasilVPajak, sethasilVPajak] = useState<any>('');
    const [sumDiskonDok, SetSumDiskonDok] = useState<any>('');

    const recalc = () => {
        vNetto_mu = 0;
        vTotal_Diskon_mu = 0;
        vTotDiskonPerBarang = 0;
        vTotal_dpp = 0;
        vDiskonPerBarang = 0;
        vPajakMu = 0;

        setquMMKtotal_mu(0);
        setquMMKtotal_diskon_mu(0);
        setquMMKtotal_pajak_mu(0);
        setquMMKnetto_mu(0);
        setquMMKtotal_rp(0);
        setquMMKdiskon_dok_mu(0);
        setquMMKdiskon_dok_rp(0);
        setquMMKnetto_rp(0);
        setquMMKtotal_diskon_rp(0);
        setquMMKdiskon_dok(0);

        vPajak = 0;
        vTotDiskonPerBarang = 0;

        const dataObjek: any = dataBarang?.nodes;
        vTotal_mu = dataObjek.reduce((total: number, node: any) => {
            return total + node.jumlah_mu; //parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
        }, 0);

        vTotal_Diskon_mu = dataObjek.reduce((total: number, node: any) => {
            return total + node.qty_std * (node.diskon_mu + node.potongan_mu); //parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
        }, 0);

        vDiskonPerBarang = dataObjek.reduce((total: number, node: any) => {
            return total + (node.disc_per_item / node.qty_fj) * node.qty; //parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
        }, 0);

        if (vDiskonPerBarang === 'NaN') {
            vDiskonPerBarang = 0;
        }

        vTotDiskonPerBarang = vDiskonPerBarang;

        if (vTotDiskonPerBarang === 'NaN') {
            vTotDiskonPerBarang = 0;
        }

        if (quMMKkena_pajak === 'I' || quMMKkena_pajak === 'E') {
            let vPajakValue;
            if (dataObjek.kode_pajak === 'N') {
                vPajakValue = 0;
            } else if (dataObjek.kode_pajak === 'S') {
                vPajakValue = 1.1;
            } else if (dataObjek.kode_pajak === 'T') {
                vPajakValue = 1.11;
            }
            if (quMMKkena_pajak === 'E') {
                // console.log(dataObjek);
                // console.log(dataObjek[0]?.jumlah_mu);
                // console.log(dataObjek[0]?.pajak_mu);
                qudMkInclude = 'E';
                quDMKpajak_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.pajak_fj / node.qty_fj) * node.qty;
                }, 0);

                vNetto_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.jumlah_mu + (node.pajak_fj / node.qty_fj) * node.qty);
                }, 0);

                vTotal_dpp = dataObjek.reduce((total: number, node: any) => {
                    vDiskonPerBarang = (node.disc_per_item / node.qty_fj) * node.qty;
                    return total + (node.jumlah_mu - vDiskonPerBarang);
                }, 0);
            } else {
                // console.log(quMMKkena_pajak);
                qudMkInclude = 'I';
                quDMKpajak_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.pajak_fj / node.qty_fj) * node.qty;
                }, 0);
                vNetto_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + node.jumlah_mu;
                }, 0);
                vTotal_dpp = dataObjek.reduce((total: number, node: any) => {
                    vPajakMu = (node.pajak_fj / node.qty_fj) * node.qty;
                    vDiskonPerBarang = (node.disc_per_item / node.qty_fj) * node.qty;
                    return total + (node.jumlah_mu - vDiskonPerBarang - vPajakMu);
                }, 0);
            }
            vPajak = quDMKpajak_mu;
        } else {
            qudMkInclude = 'N';
            quDMKpajak_mu = 0;
            vNetto_mu = dataObjek.reduce((total: number, node: any) => {
                return total + node.jumlah_mu;
            }, 0);
            vTotal_dpp = dataObjek.reduce((total: number, node: any) => {
                return total + (node.jumlah_mu - vDiskonPerBarang);
            }, 0);
            // console.log('vTotal_dpp ', vTotal_dpp);
        }

        vNetto_mu = vNetto_mu - vTotDiskonPerBarang;

        setquMMKtotal_mu(vTotal_mu);
        setquMMKtotal_pajak_mu(vPajak);
        setquMMKtotal_pajak_rp(vPajak);
        setquMMKnetto_mu(vNetto_mu);

        setquMMKtotal_diskon_mu(vTotal_Diskon_mu);
        setquMMKdiskon_dok_mu(vTotDiskonPerBarang);

        setquMMKtotal_rp(vTotal_mu * quMMKkurs);
        setquMMKdiskon_dok_rp(vTotDiskonPerBarang * quMMKkurs);
        setquMMKnetto_rp(vNetto_mu * quMMKkurs);
        setquMMKtotal_diskon_rp(vTotal_Diskon_mu * quMMKkurs);
        setquMMKdiskon_dok(quMMKdiskon_dok_mu * quMMKkurs);

        if (isNaN(vTotal_dpp)) {
            sethasilTotalDpp('0.00');
        } else {
            sethasilTotalDpp(vTotal_dpp);
        }

        if (isNaN(vTotDiskonPerBarang)) {
            SetSumDiskonDok('0.00');
        } else {
            SetSumDiskonDok(vTotDiskonPerBarang);
        }

        if (isNaN(vPajak)) {
            sethasilVPajak('0.00');
        } else {
            sethasilVPajak(vPajak);
        }
    };

    useEffect(() => {
        // console.log(dataBarang.nodes.length);
        // console.log('use Effect');
        if (dataBarang.nodes.length >= 0) {
            recalc();
            if (quMMKnetto_mu > 0) {
                generateTerbilang(
                    kode_entitas,
                    // parseFloat(quMMKnetto_mu))
                    parseFloat(
                        tanpaKoma(
                            quMMKnetto_mu.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }),
                        ),
                    ),
                )
                    .then((result) => {
                        if (dataBarang?.nodes.length === 0) {
                            setTerbilang('');
                        } else {
                            setTerbilang(result + ' Rupiah');
                        }
                        // alert(result);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
        // }, [dataBarang, kode_entitas, quMMKnetto_mu, recalc]);
    }, [dataBarang, kode_entitas, quMMKnetto_mu]);

    // ========================== MODAL DIALOG TTB MK =============================

    //AKUN JURNAL
    useEffect(() => {
        const fetchSupplierDataJurnal = async () => {
            try {
                const responseAkunJurnal = await axios.get(`${apiUrl}/erp/akun_jurnal`, {
                    params: { entitas: kode_entitas },
                });

                const responseListAkun = responseAkunJurnal.data.data;

                const lowerCaseSearchNoAkun = searchNoAkun.toLowerCase();
                const lowerCaseSearchNamaAkun = searchNamaAkun.toLowerCase();

                const finalFilteredListAkun = responseListAkun.filter(
                    (item: any) => item.no_akun.toLowerCase().includes(lowerCaseSearchNoAkun) && item.nama_akun.toLowerCase().includes(lowerCaseSearchNamaAkun),
                );

                const listToSet = searchNoAkun === '' && searchNamaAkun === '' ? responseListAkun : finalFilteredListAkun;
                setListAkunJurnal((prevList) => {
                    if (JSON.stringify(prevList) !== JSON.stringify(listToSet)) {
                        return listToSet;
                    }
                    return prevList;
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchSupplierDataJurnal();
    }, [searchNoAkun, searchNamaAkun]);

    const EditMk = async (pKodeDok: any) => {
        try {
            const dataHeader = await axios.get(`${apiUrl}/erp/master_mk?`, {
                params: {
                    entitas: kode_entitas,
                    param1: pKodeDok,
                },
            });

            const result = dataHeader.data.data;
            const resHeader = result[0] || {};
            // console.log(resHeader);
            setquMMKkode_mk(resHeader.kode_mk);
            setquMMKtgl_mk(resHeader.tgl_mk);
            setquMMKno_mk(resHeader.no_mk);
            setquMMKnama_relasi(resHeader?.nama_relasi);
            setquMMKno_fj(resHeader.no_fj);
            setquMMKno_ttb(resHeader.no_ttb);
            setquMMKkena_pajak(resHeader.kena_pajak);
            setquMMKstatus(resHeader.status);
            setDivisiPenjualan(resHeader.kode_jual);
            // setquMMKkurs(resHeader.kurs);
            // setquMMKkurs_pajak(resHeader.kurs_pajak);
            setquMMKkurs(Number(resHeader.kurs).toFixed(2));
            setquMMKkurs_pajak(Number(resHeader.kurs_pajak).toFixed(2));
            setquMMKno_reff(resHeader.no_reff);
            setquMMKkode_sales(resHeader.kode_sales);
            setquMMKkode_cust(resHeader.kode_cust);
            setquMMKkode_ttb(resHeader.kode_ttb);
            setquMMKkode_fj(resHeader.kode_fj);
            setquMMKkode_mu(resHeader.kode_mu);
            setquMMKkode_akun_diskon_dok(resHeader.kode_akun_diskon_dok);
            setCatatanValue(resHeader.keterangan);

            if (resHeader.kena_pajak === 'N') {
                setValueKenaPajak('Tanpa Pajak');
            } else if (resHeader.kena_pajak === 'I') {
                setValueKenaPajak('Include ( I )');
            } else if (resHeader.kena_pajak === 'E') {
                setValueKenaPajak('Exclude ( E )');
            }
        } catch (error) {
            console.error('Error fetching data master MK:', error);
        }

        try {
            const dataDetail = await axios.get(`${apiUrl}/erp/detail_mk?`, {
                params: {
                    entitas: kode_entitas,
                    param1: pKodeDok,
                },
            });
            const result = dataDetail.data.data;
            // console.log(result);
            const modifiedDataDlg: any = result.map((node: any) => ({
                ...node,
                pajak_ui: node.kode_pajak === 'S' ? 'S - PPN 10%' : node.kode_pajak === 'T' ? 'T - PPN 11%' : 'N - Tanpa Pajak',
            }));
            setDataBarang({ nodes: modifiedDataDlg });
        } catch (error) {
            console.error('Error fetching data detail MK:', error);
        }

        let fetchingDataJurnal, modifiedDetailJurnal;
        try {
            const dataJurnal = await axios.get(`${apiUrl}/erp/jurnal_mk?`, {
                params: {
                    entitas: kode_entitas,
                    param1: pKodeDok,
                },
            });
            fetchingDataJurnal = dataJurnal.data.data;
            modifiedDetailJurnal = fetchingDataJurnal.map((item: any) => ({
                ...item,
                debet_rp: parseFloat(item.debet_rp),
                kredit_rp: parseFloat(item.kredit_rp),
                jumlah_rp: parseFloat(item.jumlah_rp),
                jumlah_mu: parseFloat(item.jumlah_mu),
            }));
            gridJurnalDetail.dataSource = modifiedDetailJurnal;
        } catch (error) {
            console.error('Error fetching data Jurnal MK:', error);
        }

        try {
            recalc();
            await ReCalcJournal(modifiedDetailJurnal);
        } catch (error) {
            console.error('Error Recalc & Recalc JurnalMK:', error);
        }
    };

    //==========================DATA JURNAL===================================

    const editTemplateMasterItem_No_Akun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih no akun" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="noAkun" name="noAkun" className="noAkun" value={args.no_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoAkun"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    HandleModaliconChange('noAkunJurnal', dataJurnal, quMMKno_cust, setModalAkunJurnal);
                                    // setModalAkunJurnal(true);
                                    // console.log(args.index);
                                    setIndexDataJurnal(args.index);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const AutoJurnalAntarCabang = async () => {
        const combinedArray = [];
        const result = await fetchPreferensi(kode_entitas, apiUrl);
        // console.log(result[0].kode_akun_persediaan);

        // Pos Piutang dalam penyelesaian
        const quJurnalkode_akun = result[0].kode_akun_penjualan_cabang;
        const quJurnalno_akun = result[0].no_penjualan_cabang;
        const quJurnalnama_akun = result[0].nama_penjualan_cabang;

        let quJurnalkode_subledger, quJurnalnama_subledger;
        await SimpanLeger(quMMKkode_cust).then((result) => {
            quJurnalkode_subledger = quMMKkode_cust;
            quJurnalnama_subledger = result[0].subledger;
        });

        const quJurnaldebet_rp = quMMKnetto_mu + quMMKdiskon_dok_mu + quMMKtotal_diskon_mu - quMMKtotal_pajak_mu;
        const quJurnaljumlah_rp = quJurnaldebet_rp;
        const quJurnaltgl_dokumen = quMMKtgl_mk;
        const quJurnaljumlah_mu = quJurnaljumlah_rp * quMMKkurs;
        const quJurnalcatatan = 'Piutang Dalam Penyelesaian No. MK: ' + quMMKno_mk;

        let i = 1; // id_dokumen
        const detailJurnalPiutangDalamPenyelesaian = {
            kode_dokumen: '',
            id_dokumen: i,
            dokumen: 'MK',
            tgl_dokumen: quJurnaltgl_dokumen,
            kode_akun: quJurnalkode_akun,
            kode_subledger: quJurnalkode_subledger,
            kurs: quMMKkurs,
            debet_rp: quJurnaldebet_rp,
            kredit_rp: 0,
            jumlah_rp: quJurnaljumlah_rp,
            jumlah_mu: quJurnaljumlah_mu,
            catatan: quJurnalcatatan,
            no_warkat: '',
            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
            persen: 0,
            kode_dept: '',
            kode_kerja: '',
            approval: '',
            posting: '',
            rekonsiliasi: '',
            tgl_rekonsil: '',
            userid: userid,
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            audit: '',
            kode_kry: '',
            kode_jual: divisiPenjualan,
            no_kontrak_um: '',
            no_akun: quJurnalno_akun,
            nama_akun: quJurnalnama_akun,
            tipe: '',
            kode_mu: quMMKkode_mu,
            nama_dept: '',
            nama_kerja: '',
            no_subledger: '',
            nama_subledger: quJurnalnama_subledger,
            isledger: '',
        };

        combinedArray.push(detailJurnalPiutangDalamPenyelesaian);
        // setDataJurnal((state: any) => ({
        //     ...state,
        //     nodes: state?.nodes.concat(detailJurnalBaru),
        // }));

        i++;

        //Piutang Antar Cabang
        const response = await axios.get(`${apiUrl}/erp/akun_antar_cabang?`, {
            params: {
                entitas: kode_entitas,
                param1: quMMKkode_cust,
            },
        });
        const responseData = response.data.data;
        // return responseData.map((item: any) => ({
        //     ...item,
        //     quJurnalKode_akun_piutang: item.Kode_akun_piutang,
        //     quJurnalNo_piutang: item.No_piutang,
        //     quJurnalNama_Piutang: item.Nama_Piutang,
        // }));

        const quJurnalkode_akunPiutang = responseData[0].Kode_akun_piutang;
        const quJurnalno_akunPiutang = responseData[0].No_piutang;
        const quJurnalnama_akunPiutang = responseData[0].quJurnalNama_Piutang;
        const qujurnalcatatanPiutang = 'Piutang Antar Cabang No. MK: ' + quMMKno_mk;

        let quJurnalkode_subledgerPiutang, quJurnalnama_subledgerPiutang;
        await SimpanLeger(quMMKkode_cust).then((result) => {
            quJurnalkode_subledgerPiutang = quMMKkode_cust;
            quJurnalnama_subledgerPiutang = result[0].subledger;
        });

        const quJurnalkredit_rpPiutang = quMMKnetto_mu + quMMKdiskon_dok_mu + quMMKtotal_diskon_mu - quMMKtotal_pajak_mu;
        const quJurnaljumlah_rpPiutang = -quJurnalkredit_rpPiutang;
        const quJurnaltgl_dokumenPiutang = quMMKtgl_mk;
        const quJurnaljumlah_muPiutang = quJurnaljumlah_rpPiutang * quMMKkurs;

        const detailJurnalPiutangAntarCabang = {
            kode_dokumen: '',
            id_dokumen: i,
            dokumen: 'MK',
            tgl_dokumen: quJurnaltgl_dokumenPiutang,
            kode_akun: quJurnalkode_akunPiutang,
            kode_subledger: quJurnalkode_subledgerPiutang,
            kurs: quMMKkurs,
            debet_rp: 0,
            kredit_rp: quJurnalkredit_rpPiutang,
            jumlah_rp: quJurnaljumlah_rpPiutang,
            jumlah_mu: quJurnaljumlah_muPiutang,
            catatan: qujurnalcatatanPiutang,
            no_warkat: '',
            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
            persen: 0,
            kode_dept: '',
            kode_kerja: '',
            approval: '',
            posting: '',
            rekonsiliasi: '',
            tgl_rekonsil: '',
            userid: userid,
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            audit: '',
            kode_kry: '',
            kode_jual: divisiPenjualan,
            no_kontrak_um: '',
            no_akun: quJurnalno_akunPiutang,
            nama_akun: quJurnalnama_akunPiutang,
            tipe: 'quJurnaltipe',
            kode_mu: '',
            nama_dept: '',
            nama_kerja: '',
            no_subledger: '',
            nama_subledger: quJurnalnama_subledgerPiutang,
            isledger: '',
        };
        combinedArray.push(detailJurnalPiutangAntarCabang);
        // setDataJurnal((state: any) => ({
        //     ...state,
        //     nodes: state?.nodes.concat(detailJurnalBaruPiutang),
        // }));
        i++;

        setDataJurnal({ nodes: combinedArray });
        // setDataJurnal(combinedArray);
    };

    const SimpanLeger = async (kodeCust: any) => {
        const response = await axios.get(`${apiUrl}/erp/get_nama_ledger?`, {
            params: {
                entitas: kode_entitas,
                param1: kodeCust,
            },
        });
        const responseData = response.data.data;
        return responseData.map((item: any) => ({
            ...item,
            quJurnalnama_subledger: item.subledger,
        }));
    };

    const autoJurnal = async () => {
        try {
            if (dataBarang?.nodes.length > 0) {
                recalc();
                if (quMMKtipe === 'Cabang') {
                    AutoJurnalAntarCabang;
                } else {
                    const combinedArray = [];
                    let Journal = true;
                    let ID_jurnal = 0;
                    let value1 = 0;
                    //    thppj := 0;
                    let Total = 0;
                    const dataObjek: any = dataBarang?.nodes;
                    // DeleteAllRecord(Qujurnal);
                    // DetailBarangDeleteAllJurnal('2');
                    value1 = dataObjek.reduce((total: number, node: any) => {
                        return total + node.jumlah_mu;
                    }, 0);

                    const result = await fetchPreferensi(kode_entitas, apiUrl);
                    // console.log(result[0].kode_akun_persediaan);

                    // Jurnal Retur Penjualan (D)

                    // console.log(quMMKnetto_mu);
                    // console.log(quMMKdiskon_dok_mu);
                    // console.log(quMMKtotal_diskon_mu);
                    // console.log(quMMKtotal_pajak_mu);
                    const quJurnalkode_akun = result[0].kode_akun_retjual;
                    const quJurnalno_akun = result[0].no_retjual;
                    const quJurnalnama_akun = result[0].nama_retjual;
                    const quJurnaltipe = result[0].tipe_retjual;
                    const quJurnalcatatan = 'Retur Faktur No. ' + quMMKno_reff + ' (' + quMMKnama_relasi + ')';
                    const quJurnaltgl_dokumen = quMMKtgl_mk;
                    const quJurnaldebet_rp = quMMKnetto_mu + quMMKdiskon_dok_mu + quMMKtotal_diskon_mu - quMMKtotal_pajak_mu;
                    const quJurnaljumlah_rp = quJurnaldebet_rp;
                    const quJurnaljumlah_mu = quJurnaljumlah_rp * quMMKkurs;
                    // const totalLine = gridJurnalDetail.dataSource.length;

                    let i = 1; // id_dokumen
                    const detailJurnalBaru = {
                        kode_dokumen: '',
                        id_dokumen: i,
                        dokumen: 'MK',
                        tgl_dokumen: quJurnaltgl_dokumen,
                        kode_akun: quJurnalkode_akun,
                        kode_subledger: '',
                        kurs: Number(quMMKkurs).toFixed(2),
                        debet_rp: quJurnaldebet_rp,
                        kredit_rp: 0,
                        jumlah_rp: quJurnaljumlah_rp,
                        jumlah_mu: quJurnaljumlah_mu,
                        catatan: quJurnalcatatan,
                        no_warkat: '',
                        tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                        persen: 0,
                        kode_dept: '',
                        kode_kerja: '',
                        approval: '',
                        posting: '',
                        rekonsiliasi: '',
                        tgl_rekonsil: '',
                        userid: userid,
                        tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                        audit: '',
                        kode_kry: '',
                        kode_jual: divisiPenjualan,
                        no_kontrak_um: '',
                        no_akun: quJurnalno_akun,
                        nama_akun: quJurnalnama_akun,
                        tipe: quJurnaltipe,
                        kode_mu: quMMKkode_mu,
                        nama_dept: '',
                        nama_kerja: '',
                        no_subledger: '',
                        nama_subledger: '',
                        isledger: '',
                    };
                    combinedArray.push(detailJurnalBaru);
                    // setDataJurnal((state: any) => ({
                    //     ...state,
                    //     nodes: state?.nodes.concat(detailJurnalBaru),
                    // }));
                    // console.log(dataJurnal);
                    // gridJurnalDetail.dataSource = dataJurnal;
                    // console.log(gridJurnalDetail.dataSource);

                    i++;
                    // console.log('i ', i);

                    let IsTunai = false;
                    const kode_FT = quMMKkode_fj.substring(0, 2);
                    // console.log('kode_FT ', kode_FT);
                    if (kode_FT === 'FT') {
                        const cekIsTunai = await axios.get(`${apiUrl}/erp/cek_is_tunai?`, {
                            params: {
                                entitas: kode_entitas,
                                param1: quMMKkode_fj,
                            },
                        });
                        const vCekIsTunai = cekIsTunai.data.data[0].lunas;
                        // console.log('vCekIsTunai ', vCekIsTunai);
                        if (vCekIsTunai === 'Y') {
                            // console.log('true');
                            IsTunai = true;
                        } else {
                            // console.log('false');
                            IsTunai = false;
                        }
                    }

                    let detailJurnalPiutangDagang: any;
                    // console.log(quMMKnetto_mu);

                    // if (){
                    //     myAlert('Data Barang masih kosong');
                    // } else {

                    // }
                    // Jurnal Piutang Dagang (K)
                    if (quMMKnetto_mu > 0) {
                        let quJurnalkode_subledger: any, quJurnalno_subledger: any, quJurnalnama_subledger: any;
                        let quJurnaltgl_dokumen, quJurnalkredit_rp, quJurnaljumlah_rp, quJurnaljumlah_mu, Total;
                        let quJurnalkode_akun, quJurnalno_akun, quJurnalnama_akun, quJurnaltipe, quJurnalcatatan;
                        if (IsTunai) {
                            quJurnalkode_akun = result[0].kode_akun_kas;
                            quJurnalno_akun = result[0].no_kas;
                            quJurnalnama_akun = result[0].nama_kas;
                            quJurnaltipe = result[0].tipe_kas;
                            quJurnalcatatan = 'Pengeluaran Retur Tunai ' + quMMKnama_relasi + ', No. MK : ' + quMMKno_mk + ' atas Faktur No. ' + quMMKno_reff;
                        } else {
                            quJurnalkode_akun = result[0].kode_akun_piutang;
                            quJurnalno_akun = result[0].no_piutang;
                            quJurnalnama_akun = result[0].nama_piutang;
                            quJurnaltipe = result[0].tipe_piutang;
                            quJurnalcatatan = 'Pengurangan Piutang ' + quMMKnama_relasi + ', No. MK : ' + quMMKno_mk + ' atas Faktur No. ' + quMMKno_reff;
                        }

                        if (quJurnaltipe === 'piutang' || quJurnaltipe === 'piutang jangka panjang' || quJurnaltipe === 'piutang lancar lainnya') {
                            quJurnalkode_subledger = quMMKkode_cust;
                            quJurnalno_subledger = quMMKno_cust;
                            quJurnalnama_subledger = quMMKnama_relasi;
                        }

                        quJurnaltgl_dokumen = quMMKtgl_mk;
                        quJurnalkredit_rp = quMMKnetto_mu;
                        Total = quJurnalkredit_rp;
                        quJurnaljumlah_rp = -quJurnalkredit_rp;
                        quJurnaljumlah_mu = quJurnaljumlah_rp * quMMKkurs;

                        await SimpanLeger(quMMKkode_cust).then((result) => {
                            quJurnalkode_subledger = quMMKkode_cust;
                            quJurnalnama_subledger = result[0].subledger;
                            // console.log('result ', result);
                        });

                        detailJurnalPiutangDagang = {
                            kode_dokumen: '',
                            id_dokumen: i,
                            dokumen: 'MK',
                            tgl_dokumen: quJurnaltgl_dokumen,
                            kode_akun: quJurnalkode_akun,
                            kode_subledger: quJurnalkode_subledger,
                            kurs: Number(quMMKkurs).toFixed(2),
                            debet_rp: 0,
                            kredit_rp: quJurnalkredit_rp,
                            jumlah_rp: quJurnaljumlah_rp,
                            jumlah_mu: quJurnaljumlah_mu,
                            catatan: quJurnalcatatan,
                            no_warkat: '',
                            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                            persen: 0,
                            kode_dept: '',
                            kode_kerja: '',
                            approval: '',
                            posting: '',
                            rekonsiliasi: '',
                            tgl_rekonsil: '',
                            userid: userid,
                            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                            audit: '',
                            kode_kry: '',
                            kode_jual: divisiPenjualan,
                            no_kontrak_um: '',
                            no_akun: quJurnalno_akun,
                            nama_akun: quJurnalnama_akun,
                            tipe: quJurnaltipe,
                            kode_mu: quMMKkode_mu,
                            nama_dept: '',
                            nama_kerja: '',
                            no_subledger: quJurnalno_subledger,
                            nama_subledger: quJurnalnama_subledger,
                            isledger: '',
                        };
                        combinedArray.push(detailJurnalPiutangDagang);
                        // setDataJurnal((state: any) => ({
                        //     ...state,
                        //     nodes: state?.nodes.concat(detailJurnalPiutangDagang),
                        // }));
                        // console.log(dataJurnal);
                        i++;
                    }

                    // Jurnal Diskon atau Potongan (K)
                    // console.log(quMMKtotal_diskon_mu);
                    let detailJurnalDiskonPotongan: any;
                    if (quMMKtotal_diskon_mu > 0) {
                        const quJurnalkode_akun = result[0].kode_akun_diskon_item;
                        const quJurnalno_akun = result[0].no_diskon_item;
                        const quJurnalnama_akun = result[0].nama_diskon_item;
                        const quJurnaltgl_dokumen = quMMKtgl_mk;
                        const quJurnalkredit_rp = quMMKtotal_diskon_mu;
                        const quJurnaljumlah_rp = quMMKtotal_diskon_mu * -1;
                        const quJurnaljumlah_mu = quJurnaljumlah_rp;
                        const quJurnalcatatan = 'Potongan Penjualan';

                        detailJurnalDiskonPotongan = {
                            kode_dokumen: '',
                            id_dokumen: i,
                            dokumen: 'MK',
                            tgl_dokumen: quJurnaltgl_dokumen,
                            kode_akun: quJurnalkode_akun,
                            kode_subledger: '',
                            kurs: Number(quMMKkurs).toFixed(2),
                            debet_rp: 0,
                            kredit_rp: quJurnalkredit_rp,
                            jumlah_rp: quJurnaljumlah_rp,
                            jumlah_mu: quJurnaljumlah_mu,
                            catatan: quJurnalcatatan,
                            no_warkat: '',
                            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                            persen: 0,
                            kode_dept: '',
                            kode_kerja: '',
                            approval: '',
                            posting: '',
                            rekonsiliasi: '',
                            tgl_rekonsil: '',
                            userid: userid,
                            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                            audit: '',
                            kode_kry: '',
                            kode_jual: divisiPenjualan,
                            no_kontrak_um: '',
                            no_akun: quJurnalno_akun,
                            nama_akun: quJurnalnama_akun,
                            tipe: quJurnaltipe,
                            kode_mu: quMMKkode_mu,
                            nama_dept: '',
                            nama_kerja: '',
                            no_subledger: '',
                            nama_subledger: '',
                            isledger: '',
                        };
                        combinedArray.push(detailJurnalDiskonPotongan);
                        // gridJurnalDetail.dataSource[0] = detailJurnalBaru;
                        // await setDataJurnal((state: any) => ({
                        //     ...state,
                        //     nodes: state?.nodes.concat(detailJurnalBaru),
                        // }));
                        // console.log(gridJurnalDetail.dataSource);
                        i++;
                    }

                    // Jurnal Diskon atau Potongan Langsung (K)
                    let detailJurnalDiskonPotonganLangsung: any;
                    // console.log(quMMKdiskon_dok_mu);
                    if (quMMKdiskon_dok_mu > 0) {
                        const quJurnalkode_akun = result[0].kode_akun_diskon_jual;
                        const quJurnalno_akun = result[0].no_diskon_jual;
                        const quJurnalnama_akun = result[0].nama_diskon_jual;

                        const quJurnaltgl_dokumen = quMMKtgl_mk;
                        const quJurnalkredit_rp = quMMKdiskon_dok_mu;
                        const quJurnaljumlah_rp = quMMKdiskon_dok_mu * -1;
                        const quJurnaljumlah_mu = quJurnaljumlah_rp;
                        const quJurnalcatatan = 'Potongan Penjualan Langsung';

                        detailJurnalDiskonPotonganLangsung = {
                            kode_dokumen: '',
                            id_dokumen: i,
                            dokumen: 'MK',
                            tgl_dokumen: quJurnaltgl_dokumen,
                            kode_akun: quJurnalkode_akun,
                            kode_subledger: '',
                            kurs: Number(quMMKkurs).toFixed(2),
                            debet_rp: 0,
                            kredit_rp: quJurnalkredit_rp,
                            jumlah_rp: quJurnaljumlah_rp,
                            jumlah_mu: quJurnaljumlah_mu,
                            catatan: quJurnalcatatan,
                            no_warkat: '',
                            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                            persen: 0,
                            kode_dept: '',
                            kode_kerja: '',
                            approval: '',
                            posting: '',
                            rekonsiliasi: '',
                            tgl_rekonsil: '',
                            userid: userid,
                            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                            audit: '',
                            kode_kry: '',
                            kode_jual: divisiPenjualan,
                            no_kontrak_um: '',
                            no_akun: quJurnalno_akun,
                            nama_akun: quJurnalnama_akun,
                            tipe: quJurnaltipe,
                            kode_mu: quMMKkode_mu,
                            nama_dept: '',
                            nama_kerja: '',
                            no_subledger: '',
                            nama_subledger: '',
                            isledger: '',
                        };
                        combinedArray.push(detailJurnalDiskonPotonganLangsung);
                        // gridJurnalDetail.dataSource[0] = detailJurnalBaru;
                        // await setDataJurnal((state: any) => ({
                        //     ...state,
                        //     nodes: state?.nodes.concat(detailJurnalBaru),
                        // }));
                        // console.log(gridJurnalDetail.dataSource);
                        i++;
                    }

                    // Jurnal Pajak (D)
                    let detailJurnalPajak: any;
                    const cekAkunPajak = await axios.get(`${apiUrl}/erp/cek_akun_pajak?`, {
                        params: {
                            entitas: kode_entitas,
                            param1: quMMKkode_pajak,
                        },
                    });
                    // console.log({
                    //     params: {
                    //         entitas: kode_entitas,
                    //         param1: quMMKkode_pajak,
                    //     },
                    // });
                    // console.log(cekAkunPajak);
                    const vCekAkunPajak = cekAkunPajak.data.data[0].kode_akun;
                    // console.log(vCekAkunPajak);
                    if (vCekAkunPajak === '' || vCekAkunPajak === null) {
                    } else {
                        const quJurnalkode_akun = cekAkunPajak.data.data[0].kode_akun;
                        const quJurnalno_akun = cekAkunPajak.data.data[0].no_akun;
                        const quJurnalnama_akun = cekAkunPajak.data.data[0].nama_akun;
                        const quJurnaltipe = cekAkunPajak.data.data[0].tipe;

                        const quJurnaldebet_rp = quMMKtotal_pajak_mu;
                        const quJurnaljumlah_rp = quJurnaldebet_rp;
                        const quJurnaljumlah_mu = quJurnaljumlah_rp;
                        const quJurnalcatatan = 'Pajak ' + 'No. MK : ' + quMMKno_mk + ' atas Faktur No : ' + quMMKno_fj;

                        detailJurnalPajak = {
                            kode_dokumen: '',
                            id_dokumen: i,
                            dokumen: 'MK',
                            tgl_dokumen: quJurnaltgl_dokumen,
                            kode_akun: quJurnalkode_akun,
                            kode_subledger: '',
                            kurs: quMMKkurs,
                            debet_rp: quJurnaldebet_rp,
                            kredit_rp: 0,
                            jumlah_rp: quJurnaljumlah_rp,
                            jumlah_mu: quJurnaljumlah_mu,
                            catatan: quJurnalcatatan,
                            no_warkat: '',
                            tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                            persen: 0,
                            kode_dept: '',
                            kode_kerja: '',
                            approval: '',
                            posting: '',
                            rekonsiliasi: '',
                            tgl_rekonsil: '',
                            userid: userid,
                            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                            audit: '',
                            kode_kry: '',
                            kode_jual: divisiPenjualan,
                            no_kontrak_um: '',
                            no_akun: quJurnalno_akun,
                            nama_akun: quJurnalnama_akun,
                            tipe: quJurnaltipe,
                            kode_mu: quMMKkode_mu,
                            nama_dept: '',
                            nama_kerja: '',
                            no_subledger: '',
                            nama_subledger: '',
                            isledger: '',
                        };
                        combinedArray.push(detailJurnalPajak);
                        // gridJurnalDetail.dataSource[0] = detailJurnalBaru;
                        // setDataJurnal((state: any) => ({
                        //     ...state,
                        //     nodes: state?.nodes.concat(detailJurnalBaru),
                        // }));
                        // console.log(gridJurnalDetail.dataSource);
                        i++;
                    }

                    Journal = false;
                    const NetDokumen = quMMKnetto_mu;
                    // console.log('combinedArray ', combinedArray);
                    // setDataJurnal({ nodes: combinedArray });
                    gridJurnalDetail.dataSource = combinedArray;
                    // gridJurnalDetail.refresh();
                    await ReCalcJournal(combinedArray);
                }
            } else {
                myAlert('Data Barang masih kosong');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    let LastID: any, TotDebet: any, TotKredit: any, selisih: any;

    const ReCalcJournal = async (dataObjek: any) => {
        TotDebet = dataObjek.reduce((total: number, node: any) => {
            return total + node.debet_rp;
        }, 0);
        TotKredit = dataObjek.reduce((total: number, node: any) => {
            return total + node.kredit_rp;
        }, 0);
        selisih = TotDebet - TotKredit;
        setTotalDebit(TotDebet);
        setTotalKredit(TotKredit);
    };

    const editTemplateMasterItem_Nama_Akun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="namaAkun" name="namaAkun" className="namaAkun" value={args.nama_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem2"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalAkunJurnal(true);
                                    // console.log(args.index);
                                    setIndexDataJurnal(args.index);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateNoAkun = (args: any) => {
        return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.no_akun}</div>;
    };

    const templateNamaAkun = (args: any) => {
        return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.nama_akun}</div>;
    };

    const rowSelectingDetailJurnal = (args: any) => {
        setSelectedRowIndex(args.rowIndex);
        // console.log(args.rowIndex);
    };

    const rowSelectingDialogAkun = (args: any) => {
        // setSelectedRowIndex(args.rowIndex);
        setSelectedAkunJurnal(args.data);
        // console.log(args.rowIndex);
    };

    const actionBeginDetailJurnal = async (args: any) => {
        // console.log('BEGIN :' + args.requestType);
        // console.log(dataJurnal);
        // gridJurnalDetail.dataSource = { dataJurnal };
        if (args.requestType === 'beginEdit') {
            // console.log(args);
            // console.log('Debit:', args.rowData.debet_rp);
            // console.log('Kredit:', args.rowData.kredit_rp);
            if (args.rowData.debet_rp === 0) {
                // console.log('masuk sini');
                // setStatusNol('Debit');
                statusNolJurnal = 'Debit';
            } else if (args.rowData.kredit_rp === 0) {
                // setStatusNol('Kredit');
                statusNolJurnal = 'Kredit';
                // console.log('masuk sini2');
            }
            // setDebit(args.rowData.debet_rp);
            // setKredit(args.rowData.kredit_rp);
        }
    };

    const actionCompleteDetailJurnal = async (args: any) => {
        let index = args.rowIndex;
        switch (args.requestType) {
            case 'save':
                // console.log(args.rowData);
                let editedData;
                // console.log(statusNolJurnal);
                // console.log(gridJurnalDetail.dataSource[index]?.debet_rp);
                if (statusNolJurnal === 'Debit' && gridJurnalDetail.dataSource[index]?.debet_rp !== 0) {
                    editedData = { ...args.data, kredit_rp: 0 };
                    gridJurnalDetail.dataSource[index] = editedData;
                } else if (statusNolJurnal === 'Kredit' && gridJurnalDetail.dataSource[index]?.kredit_rp !== 0) {
                    editedData = { ...args.data, debet_rp: 0 };
                    gridJurnalDetail.dataSource[index] = editedData;
                }
                // console.log(args);
                // kalkulasiJurnal();
                gridJurnalDetail.refresh();
                ReCalcJournal(gridJurnalDetail.dataSource);
                break;
            case 'beginEdit':
                // console.log('EDIT');
                // kalkulasiJurnal();
                ReCalcJournal(gridJurnalDetail.dataSource);
                break;
            case 'delete':
                break;
            case 'refresh':
                // console.log('REFRESH');
                // kalkulasiJurnal();
                ReCalcJournal(gridJurnalDetail.dataSource);
                break;
            default:
                break;
        }
        // console.log('COMPLETED :' + args.requestType);
    };

    const DeleteDetailJurnal: any = () => {
        withReactContent(Swal)
            .fire({
                // icon: 'warning',
                html: `Hapus data barang baris ${selectedRowIndexJurnal + 1}?`,
                width: '15%',
                target: '#frmMk',
                showCancelButton: true,
                confirmButtonText: '<p style="font-size:10px">Ya</p>',
                cancelButtonText: '<p style="font-size:10px">Tidak</p>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    // console.log(selectedRowIndexJurnal);
                    gridJurnalDetail.dataSource.splice(selectedRowIndexJurnal, 1);
                    gridJurnalDetail.dataSource.forEach((item: any, index: any) => {
                        item.id_mk = index + 1;
                    });
                    gridJurnalDetail.refresh();
                } else {
                    // console.log('cancel');
                }
            });
    };

    const editTemplateSubLedger = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Daftar Customer" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="noCust" name="noCust" className="noCust" value={args?.nama_relasi} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    // console.log('ICO only');
                                    // setModalCust(true);
                                    const value: any = args.value;
                                    // console.log('on Input');
                                    setTagCustomer('Detail');
                                    HandleModalChange(value, 'customerSubsidi', setChangeNumber, setHandleNamaCust, setModalCust);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateDepartemen = (args: any) => {
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                {/* <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.departemen} readOnly={true} showClearButton={false} /> */}
                <DropDownListComponent
                    id="dept"
                    name="dept"
                    dataSource={listDepartemen}
                    fields={{ value: 'dept_ku2', text: `dept_ku` }}
                    floatLabelType="Never"
                    placeholder={args.departemen}
                    onChange={(e: any) => {
                        // console.log(e);
                        gridJurnalDetail.dataSource[args.index] = { ...gridJurnalDetail.dataSource[args.index], kode_dept: e.value.split(/\*/)[0], departemen: e.value.split(/\*/)[1] };
                        gridJurnalDetail.refresh();
                        // console.log(gridJurnalDetail.dataSource[args.index]);
                    }}
                />
            </div>
        );
    };

    const DetailBarangDeleteAllJurnal = (tagButton: any) => {
        if (tagButton === '1') {
            withReactContent(Swal)
                .fire({
                    // icon: 'warning',
                    html: 'Hapus semua data jurnal?',
                    width: '15%',
                    target: '#frmMk',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        // setDataJurnal({ nodes: [] });
                        //tambah warning alert konfirmasi delete all
                        // gridMBList.refresh();
                        gridJurnalDetail.dataSource = [];
                        // gridMBList.refresh();
                    } else {
                        console.log('cancel');
                    }
                });
        } else if (tagButton === '2') {
            gridJurnalDetail.dataSource = [];
        }
    };

    const myAlert = (text: any) => {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: `<p style="font-size:12px">${text}</p>`,
            width: '100%',
            target: '#frmMk',
        });
    };

    //===========================END JURNAL=========================================================================
    const handleDetail_EndEdit = async () => {
        // gridMkDetail.endEdit();
        // // gridMkDetailRef.current?.endEdit();
        if (gridMkDetail) {
            (gridMkDetail as any).endEdit(); // Menyimpan perubahan edit
        }
    };

    // const saveDoc = async (data: any) => {
    const saveDoc = async () => {
        // console.log('result 0 ', dataBarang);
        // await ambilDetail().then(async (result) => {
        //     console.log('result 1 ', result);
        //     setDataBarang((state: any) => ({
        //         ...state,
        //         nodes: result,
        //     }));
        // });
        // const updatedDataBarang = await ambilDetail();
        // console.log('result 3 ', dataBarang);
        try {
            setDisabledSimpan(true);
            setShowLoader(true);
            const updatedDataBarang: any = await ambilDetail(); // Get the updated data after calling ambilDetail()
            // console.log('result 3', updatedDataBarang);

            const periode = await FirstDayInPeriod(kode_entitas);
            const formatPeriode = moment(periode).format('YYYY-MM-DD');
            // const formatTglMk = moment(quMMKtgl_mk).format('YYYY-MM-DD HH:mm:ss');
            const formatTglMk = moment(quMMKtgl_mk).format('YYYY-MM-DD');
            // console.log('gridJurnalDetail.dataSource.length ', gridJurnalDetail.dataSource.length);
            // console.log('dataBarang?.nodes.length ', dataBarang?.nodes.length);
            // console.log('quMMKstatus ', quMMKstatus);
            // console.log('formatTglMk  ', formatTglMk + '<' + 'formatPeriode ', formatPeriode);
            if (updatedDataBarang.length < 1) {
                myAlert('Data Detail Memo Kredit belum diisi');
            } else if (gridJurnalDetail.dataSource.length < 1) {
                myAlert('Data jurnal belum dikalkulasi');
            } else if (quMMKstatus !== 'Terbuka') {
                myAlert('Status Dokumen ' + quMMKstatus + ' Tidak dapat Disimpan Kembali');
            } else if (formatTglMk < formatPeriode) {
                myAlert('Maaf, tanggal transaksi yang anda masukan lebih kecil dari periode yang dijalankan, data tidak dapat di simpan');
            } else if (totalDebit - totalKredit !== 0) {
                myAlert(`Jurnal masih ada selisih.`);
            } else if (!divisiPenjualan) {
                myAlert(`Divisi Penjualan belum diisi.`);
            } else if (!quMMKno_mk) {
                myAlert(`Nomor MK belum diisi.`);
            } else if (!quMMKtgl_mk) {
                myAlert(`Tanggal belum diisi.`);
            } else if (!quMMKnama_relasi) {
                myAlert(`Customer belum diisi.`);
            } else {
                await ResetTime2(kode_entitas, formatTglMk).then((result) => {
                    setquMMKtgl_mk(result);
                    // console.log('result ', result);
                });
                //?Detail Barang
                // console.log(dataBarang?.nodes);
                const modifiedDetailJson: any = updatedDataBarang.map((item: any) => ({
                    ...item,
                    pajak_mu: quMMKkena_pajak === 'E' || quMMKkena_pajak === 'I' ? (item.pajak_fj / item.qty_fj) * item.qty : 0,
                }));

                const modifiedDetailJurnal = gridJurnalDetail.dataSource.map((item: any) => ({
                    ...item,
                    tgl_dokumen: masterDataState == 'EDIT' ? quMMKtgl_mk : moment().format('YYYY-MM-DD HH:mm:ss'),
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    tgl_rekonsil: null,
                    approval: null,
                    posting: null,
                    rekonsiliasi: null,
                }));
                const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                //?Header Detail & Jurnal
                // if (masterDataState == 'EDIT') {
                //     console.log(quMMKkode_mk);
                // } else {
                //     console.log('KOSONG');
                // }
                let jumlahItem: any;
                let noDok =
                    masterDataState === 'EDIT'
                        ? quMMKno_mk
                        : await generateNUDivisi(kode_entitas, '', divisiPenjualan, '15', dateGenerateNu.format('YYYYMM'), dateGenerateNu.format('YYMM') + `${divisiPenjualan}`);
                const JSON = {
                    entitas: kode_entitas,
                    kode_mk: masterDataState == 'EDIT' ? quMMKkode_mk : '',
                    no_mk: noDok,

                    tgl_mk: moment(quMMKtgl_mk).format('YYYY-MM-DD HH:mm:ss'),
                    no_reff: quMMKno_reff,
                    kode_sales: quMMKkode_sales,
                    kode_cust: quMMKkode_cust,
                    kode_ttb: quMMKkode_ttb,
                    kode_fj: quMMKkode_fj,
                    kode_mu: quMMKkode_mu,
                    kurs: quMMKkurs,
                    kurs_pajak: quMMKkurs_pajak,
                    kena_pajak: quMMKkena_pajak,
                    diskon_dok: quMMKdiskon_dok,
                    total_mu: quMMKtotal_mu,
                    diskon_dok_mu: quMMKdiskon_dok_mu,
                    total_diskon_mu: quMMKtotal_diskon_mu,
                    total_pajak_mu: quMMKtotal_pajak_mu,
                    netto_mu: quMMKnetto_mu,
                    total_rp: quMMKtotal_rp,
                    diskon_dok_rp: quMMKdiskon_dok_rp,
                    total_diskon_rp: quMMKtotal_diskon_rp,
                    total_pajak_rp: quMMKtotal_pajak_rp,
                    netto_rp: quMMKnetto_rp,
                    kode_akun_diskon_dok: '',
                    keterangan: quMMKketerangan,
                    status: quMMKstatus,
                    userid: userid,
                    tgl_update: currentDateTime,
                    kode_jual: divisiPenjualan,
                    detail: modifiedDetailJson,
                    jurnal: modifiedDetailJurnal,
                };
                jumlahItem = modifiedDetailJson.length;
                // console.log('JSONSIMPAN', JSON);

                if (masterDataState === 'EDIT') {
                    //EDIT API
                    // console.log('masuk edit');
                    var responseAPI = await axios.patch(`${apiUrl}/erp/update_mk`, JSON);
                } else {
                    //SAVE API
                    // console.log('masuk simpan');
                    var responseAPI = await axios.post(`${apiUrl}/erp/simpan_mk`, JSON);
                }
                console.log('responseAPI.data.status', responseAPI.data.status);

                try {
                    if (responseAPI.data.status === true) {
                        //SETELAH BERHASIL COUNTER NO MB
                        if (masterDataState !== 'EDIT') {
                            await generateNUDivisi(kode_entitas, noDok, divisiPenjualan, '15', moment(quMMKtgl_mk).format('YYYYMM'), moment(quMMKtgl_mk).format('YYMM') + `${divisiPenjualan}`);
                        }
                        //AUDIT
                        const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                            entitas: kode_entitas,
                            kode_audit: null,
                            dokumen: 'MK',
                            kode_dokumen: masterDataState == 'EDIT' ? quMMKkode_mk : responseAPI.data.data[0],
                            no_dokumen: quMMKno_mk,
                            tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                            proses: masterDataState == 'Edit' ? 'EDIT' : 'NEW',
                            // diskripsi: `MK item =  ${gridMkDetail.dataSource.length}  nilai transaksi ${vTotal_mu.toLocaleString('en-US', {
                            //     minimumFractionDigits: 2,
                            //     maximumFractionDigits: 2,
                            // })}`,
                            diskripsi: `MK item =  ${jumlahItem}  nilai transaksi ${quMMKtotal_mu.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}`,
                            userid: userid, // userid login web
                            system_user: '', //username login
                            system_ip: '', //ip address
                            system_mac: '', //mac address
                        });
                        // console.log(auditResponse, 'auditResponse');
                        // withReactContent(swal)
                        // .fire({
                        //     title: ``,
                        //     html: masterDataState == 'EDIT' ? '<p style="font-size:12px">Perubahan Data MK berhasil disimpan</p>' : '<p style="font-size:12px">Data MK berhasil disimpan</p>',
                        //     target: '#frmMk',
                        //     icon: 'success',
                        //     confirmButtonText
                        //     width: '350px',
                        //     heightAuto: true,
                        //     showConfirmButton: false,
                        //     timer: 1500,
                        // })
                        withReactContent(swalToast)
                            .fire({
                                target: '#frmMk',
                                icon: 'success',
                                title: masterDataState == 'EDIT' ? '<p style="font-size:12px">Perubahan Data MK berhasil disimpan</p>' : '<p style="font-size:12px">Data MK berhasil disimpan</p>',
                                width: '100%',
                            })
                            .then(() => {
                                // window.location.href = './mklist';
                                // router.push('./mblist');
                                closeDialogMkForm();
                                onRefresh();
                            });
                    } else {
                        withReactContent(swal).fire({
                            title: ``,
                            html: masterDataState == 'EDIT' ? '<p style="font-size:12px">Perubahan Data MK gagal disimpan</p>' : '<p style="font-size:12px">Data MK gagal disimpan</p>',
                            target: '#frmMk',
                            icon: 'error',
                            width: '350px',
                            heightAuto: true,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                } catch (error) {
                    console.log('error Response simpan atau update', error + responseAPI.data.status);
                }
            }
        } catch (error) {
            //error
            console.log('error');
        } finally {
            setShowLoader(false);
            setDisabledSimpan(false);
        }
    };
    // let dialogDaftarCustomer: Dialog | any;

    // TEST JUAN

    const handleBersihkanAll = async () => {
        await DetailBarangDeleteAll(swalDialog, setDataBarang, setTotalBarang, setTotalRecords, setIdDokumen);
        DetailBarangDeleteAllJurnal('2');
        // await JurnalDeleteAll(setDataJurnal, setTotalDebit, setTotalKredit, setTotalRecords, setIdDokumen);
    };

    const handleBersihkanSatuan = async () => {
        await DetailBarangDelete(gridMkDetail, swalDialog, IdDokumen, setIdDokumen, setDataBarang);
        // await DetailBarangDelete(gridMkDetailRef.current, swalDialog, IdDokumen, setIdDokumen, setDataBarang);
        DetailBarangDeleteAllJurnal('2');
        // await JurnalDeleteAll(setDataJurnal, setTotalDebit, setTotalKredit, setTotalRecords, setIdDokumen);
    };

    const handleHapusRow = async () => {
        await setDataBarang((state: any) => {
            const updatedNodes = state?.nodes.filter((node: any) => node.no_item !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
    };

    const deleteById = (id_mk: any) => {
        const updatedData = dataBarang?.nodes.filter((item: any) => item.id_mk !== id_mk);
        setDataBarang({ nodes: updatedData });
    };

    const DetailBarangDeleteKosong = async (swalDialog: any, setDataBarang: Function, setTotalBarang: Function, setTotalRecords: Function, setIdDokumen: Function, id: any, dataBarang: any) => {
        document.getElementById('gridTtbList')?.focus();
        // console.log('setDataBarang = ', setDataBarang);
        setDataBarang((state: any) => {
            // Mengecek apakah ada node yang memiliki 'no_sj' yang kosong
            const hasEmptyNodes = state?.nodes.some((node: any) => node.no_sj === '');
            if (hasEmptyNodes === true) {
            }

            return {
                ...state,
            };
        });
    };

    let tipeRequest: any;
    const ambilDetail = async () => {
        // Update the state by filtering out items with empty no_item
        setDataBarang((state: any) => {
            const updatedNodes = state?.nodes.filter((node: any) => node.no_item !== '');
            // console.log('updatedNodes', updatedNodes);
            return {
                ...state, // Ensure you spread the existing state
                nodes: updatedNodes,
            };
        });

        // Fetch data for filtered items
        const currentDataBarang = await new Promise((resolve) => {
            setDataBarang((state: any) => {
                const filteredItems = state?.nodes.filter((item: any) => item.no_item !== '');
                resolve(filteredItems);
                return state; // Return the unchanged state
            });
        });

        // Return the currentDataBarang which contains the filtered items
        return currentDataBarang;
    };
    // const ambilDetail = async () => {
    //     // Directly filter the dataBarang before updating the state
    //     const updatedNodes = dataBarang?.nodes.filter((node: any) => node.no_item !== '');

    //     // Create the updated dataBarang
    //     const updatedDataBarang = {
    //         ...dataBarang,
    //         nodes: updatedNodes,
    //     };

    //     // Update the state with the filtered data
    //     setDataBarang(updatedDataBarang);

    //     // Return the filtered dataBarang
    //     return updatedDataBarang;
    // };

    const handleActionBagin = async (args: any) => {
        if (args.requestType === 'save') {
            // Prevent default save behavior
            args.cancel = true;

            // Get the current dataBarang state
            const updatedDataBarang = (prevDataBarang: any) => {
                // Filter out nodes with empty 'no_item'
                const updatedNodes = prevDataBarang?.nodes.filter((node: any) => node.no_item !== '');

                // Return the updated state with filtered nodes
                return {
                    ...prevDataBarang,
                    nodes: updatedNodes,
                };
            };

            // Set the filtered data to state
            setDataBarang((prevState: any) => updatedDataBarang(prevState));

            // Optionally, refresh the grid if you have a reference to it
            // gridInstance.refresh();

            // Return the updated dataBarang (since it was calculated beforehand)
            return updatedDataBarang(dataBarang);
        }
    };

    // const handleActionBagin = async (args: any) => {
    //     if (args.requestType === 'save') {
    //         // Prevent default save behavior if necessary
    //         args.cancel = true;

    //         // Update state based on the grid data
    //         setDataBarang((state: any) => {
    //             // Filter out nodes with empty 'no_item'
    //             const updatedNodes = state?.nodes.filter((node: any) => node.no_item !== '');

    //             // If there are changes, update the state
    //             if (updatedNodes.length < state?.nodes.length) {
    //                 return {
    //                     ...state,
    //                     nodes: updatedNodes,
    //                 };
    //             }

    //             // Return the current state if no updates are needed
    //             return state;
    //         });

    //         // Optionally, you may want to refresh the grid or trigger an update
    //         // for the Syncfusion Grid here if needed
    //         // For example:
    //         // gridInstance.refresh(); // Ensure you have a reference to your grid instance
    //         console.log('dataBarang', dataBarang);
    //     }
    // };

    const handleActionBagin3 = async (args: any) => {
        if (args.requestType === 'save') {
            setDataBarang((state: any) => {
                // Check if any node has an empty 'no_item'
                const hasEmptyNodes = state?.nodes.some((node: any) => node.no_item === '');

                if (hasEmptyNodes) {
                    withReactContent(swalDialog)
                        .fire({
                            title: '',
                            html: '<p style="font-size:12px; margin-left: 46px;">Ada data barang yang kosong, hapus data barang</p>',
                            width: '280px',
                            heightAuto: true,
                            target: '#frmMk',
                            focusConfirm: false,
                            confirmButtonText: '&ensp; Hapus &ensp;',
                            reverseButtons: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            customClass: {
                                confirmButton: stylesTtb['custom-confirm-button'],
                            },
                        })
                        .then(async (result) => {
                            if (result.value) {
                                setBendera(true);
                                setDataBarang((state: any) => {
                                    const updatedNodes = state?.nodes.filter((node: any) => node.no_item !== '');
                                    return {
                                        ...state,
                                        nodes: updatedNodes,
                                    };
                                });
                            } else if (result.dismiss === swal.DismissReason.cancel) {
                                // Handle cancel if needed
                            }
                        });
                }

                // Return the current state regardless of whether there were empty nodes
                return {
                    ...state,
                };
            });
        }
    };

    // const hasEmptyNodes = dataBarang?.nodes.some((node: any) => node.no_item === '');
    // const handleHapusGridKosong = async () => {
    //     console.log('tipeRequest ', tipeRequest);
    //     if (tipeArgs === 'save') {
    //         setDataBarang((state: any) => {
    //             // const hasEmptyNodes = state?.nodes.some((node: any) => node.no_item === '');
    //             console.log(hasEmptyNodes);
    //             if (hasEmptyNodes === true) {
    //                 console.log('eksekusi');
    //                 setDataBarang((state: any) => {
    //                     const updatedNodes = state?.nodes.filter((node: any) => node.no_item !== '');
    //                     return {
    //                         ...state,
    //                         nodes: updatedNodes,
    //                     };
    //                 });
    //             }

    //             return {
    //                 ...state,
    //             };
    //         });
    //     }
    // };

    // console.log(gridMkDetail);
    // useEffect(() => {
    //     handleHapusGridKosong();
    //     // setDataBarang((state: any) => {
    //     //     // const hasEmptyNodes = state?.nodes.some((node: any) => node.no_item === '');
    //     //     console.log(hasEmptyNodes);
    //     //     if (hasEmptyNodes === true) {
    //     //         console.log('eksekusi');
    //     //         setDataBarang((state: any) => {
    //     //             const updatedNodes = state?.nodes.filter((node: any) => node.no_item !== '');
    //     //             return {
    //     //                 ...state,
    //     //                 nodes: updatedNodes,
    //     //             };
    //     //         });
    //     //     }
    //     //     return {
    //     //         ...state,
    //     //     };
    //     // });
    // }, [hasEmptyNodes]);

    return (
        <div>
            {/* BARU */}
            <DialogComponent
                id="frmMk"
                name="frmMk"
                className="frmMk"
                target="#main-target"
                header={() => {
                    let header: string = '';
                    if (masterDataState == 'BARU') {
                        header = `Baru Memo Kredit - Retur Penjualan Tunai || Divisi Penjualan : ${divisiPenjualan}`;
                    } else if (masterDataState == 'EDIT') {
                        header = `Edit Memo Kredit - Retur Penjualan Tunai || Divisi Penjualan : ${divisiPenjualan}`;
                    } else if (masterDataState == 'PREVIEW') {
                        header = `Preview Memo Kredit - Retur Penjualan Tunai || Divisi Penjualan : ${divisiPenjualan}`;
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
                height="100%" // "700px" //100%"
                position={{ X: 'center', Y: 'center' }} //Y: 8 }}
                style={{ position: 'fixed' }}
                buttons={buttonInputData}
                close={() => {
                    // console.log('closeDialog');
                    closeDialogMkForm();
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
                    {showLoader && contentLoader()}
                    <div>
                        {/* screen loader  */}
                        {/* {showLoader && contentLoader()} */}

                        <div>
                            {/* ===============  Master Header Data ========================   */}

                            <div className="mb-1" style={{ padding: 10 }}>
                                {/* <div className="panel-tabel" style={{ width: '100%' }}> */}
                                <div className="panel-tabel" style={{ width: '100%' }}>
                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-10">
                                            <table className={styles.table}>
                                                <thead>
                                                    <tr>
                                                        {/* <th colSpan={2} style={{ width: '10%' }}>
                                                    Tanggal
                                                </th> */}
                                                        <th style={{ width: '20%' }}>Tanggal</th>
                                                        <th style={{ width: '20%' }}>No. MK</th>
                                                        <th style={{ width: '55%' }}>Customer</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                placeholder="Tgl. MK"
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                // value={masterTglMk.toDate()}\
                                                                value={quMMKtgl_mk}
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
                                                        </td>
                                                        <td>
                                                            <TextBoxComponent placeholder="No. MK" value={quMMKno_mk} readonly={true} />
                                                        </td>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        id="edcustomer"
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Masukan Nama Customer"
                                                                        value={quMMKnama_relasi}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // console.log('on Input');
                                                                            HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModalCust);
                                                                            setTagCustomer('Header');
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() => {
                                                                            // console.log('Ikon diklik!');
                                                                            setTagCustomer('Header');
                                                                        }}
                                                                        style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            onClick={() => {
                                                                                if (quMMKno_fj !== '') {
                                                                                    withReactContent(Swal).fire({
                                                                                        // icon: 'error',
                                                                                        title: `<span style='color: gray; font-weight: bold;'>Customer tidak dapat diganti, hapus dulu nomer Faktur Jual.</span>`,
                                                                                        width: '20%',
                                                                                        target: '#frmMk',
                                                                                        confirmButtonText: 'Ok',
                                                                                    });
                                                                                } else {
                                                                                    HandleModaliconChange('customer', dataBarang, quMMKno_cust, setModalCust);
                                                                                }
                                                                                // HandleModaliconChange('customer', dataBarang, custSelected, setHandleNamaCust, setModalCust);
                                                                            }}
                                                                            style={{ margin: '7px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <thead>
                                                    <tr className={styles.table}>
                                                        <th style={{ width: '20%' }}>No. Faktur</th>
                                                        <th style={{ width: '20%' }}>No. TTB</th>
                                                        <th style={{ width: '55%' }}>Pajak</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        id="edFaktur"
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Masukan No. Faktur"
                                                                        // value={quMMKkode_cust === '' || quMMKkode_cust === null ? '' : quMMKkode_fj}
                                                                        value={quMMKno_fj}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // console.log('');
                                                                            if (quMMKkode_cust === '') {
                                                                                withReactContent(Swal)
                                                                                    .fire({
                                                                                        // icon: 'error',
                                                                                        title: `<span style='color: gray; font-weight: bold;'>Customer belum diisi.</span>`,
                                                                                        width: '20%',
                                                                                        target: '#frmMk',
                                                                                        confirmButtonText: 'Ok',
                                                                                    })
                                                                                    .then((result) => {
                                                                                        setModalCust(true);
                                                                                        handleClearInput('edFaktur');
                                                                                    });

                                                                                // HandleModaliconChange('customer', dataBarang, quMMKno_cust, setModalCust);
                                                                            } else {
                                                                                setquMMKno_fj('');
                                                                                HandleModalChange(value, 'fj', setChangeNumber, setHandleNamaCust, setModalDlgFj);
                                                                            }
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() => {
                                                                            // console.log('FJ Ikon diklik!');
                                                                        }}
                                                                        style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            onClick={() => {
                                                                                if (!quMMKnama_relasi) {
                                                                                    withReactContent(Swal)
                                                                                        .fire({
                                                                                            // icon: 'error',
                                                                                            title: `<span style='color: gray; font-weight: bold;'>Customer belum diisi.</span>`,
                                                                                            width: '20%',
                                                                                            target: '#frmMk',
                                                                                            confirmButtonText: 'Ok',
                                                                                        })
                                                                                        .then((result) => {
                                                                                            setTagCustomer('Header');
                                                                                            setModalCust(true);
                                                                                        });
                                                                                } else {
                                                                                    HandleModaliconChange('fj', [], quMMKkode_cust, setModalDlgFj);
                                                                                }
                                                                            }}
                                                                            style={{ margin: '7px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        id="edTTB"
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Masukan No. TTB"
                                                                        value={quMMKno_ttb}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            if (quMMKkode_cust === '') {
                                                                                withReactContent(Swal).fire({
                                                                                    // icon: 'error',
                                                                                    title: `<span style='color: gray; font-weight: bold;'>No. Faktur belum diisi.</span>`,
                                                                                    width: '20%',
                                                                                    target: '#frmMk',
                                                                                    confirmButtonText: 'Ok',
                                                                                });
                                                                                handleClearInput('edTTB');
                                                                            } else {
                                                                                setquMMKno_ttb('');
                                                                                // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModalDlgFj);
                                                                                HandleModalChange(value, 'ttb', setChangeNumber, setHandleNamaCust, setModalDlgTtb);
                                                                            }
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() => {
                                                                            // console.log('TTB Ikon diklik!');
                                                                        }}
                                                                        style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            onClick={async () => {
                                                                                HandleModaliconChange('ttb', [], quMMKno_fj, setModalDlgTtb);
                                                                            }}
                                                                            // onClick={async () => {
                                                                            //     console.log('setDsDaftarDlgTtb ', setDsDaftarDlgTtb);
                                                                            //     await FetchDlgListTtb(kode_entitas, quMMKkode_cust, quMMKkode_fj, setDsDaftarDlgTtb);
                                                                            //     await HandleModaliconChange('ttb', [], quMMKno_fj, setModalDlgTtb);
                                                                            // }}
                                                                            style={{ margin: '7px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        placeholder="Pajak"
                                                                        value={valueKenaPajak}
                                                                        readonly={true}
                                                                        //  value={quMMKkena_pajak} readonly={true}
                                                                    />
                                                                    {/* <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Pajak"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    /> */}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-span-2">
                                            <table className={styles.table}>
                                                <thead>
                                                    <tr>
                                                        <th>Kurs</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Kurs"
                                                                        value={quMMKkurs}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <thead>
                                                    <tr className={styles.table}>
                                                        <th style={{ width: '20%' }}>Kurs Pajak</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Kurs Pajak"
                                                                        value={quMMKkurs_pajak}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* {JSON.stringify(quMMKkode_cust)} */}
                            {/* =======================================  DATA DETAIL ============================================================================   */}

                            <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '315px' }}>
                                <TabComponent ref={(t: any) => (tabMkDetail = t)} selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                    <div className="e-tab-header" style={{ display: 'flex' }}>
                                        <div
                                            tabIndex={0}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            1. Data Barang
                                        </div>
                                        <div
                                            tabIndex={1}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            2. Jurnal
                                        </div>
                                    </div>

                                    {/*===================== Content menampilkan data barang dan data jurnal=======================*/}
                                    <div className="e-content">
                                        {/*start tab 1*/}
                                        <div style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <TooltipComponent ref={(t: any) => (tooltipDetailBarang = t)} beforeRender={beforeRenderDetailBarang} openDelay={1000} target=".e-headertext">
                                                <GridComponent
                                                    id="gridMkDetail"
                                                    name="gridMkDetail"
                                                    className="gridMkDetail"
                                                    locale="id"
                                                    ref={(g: any) => (gridMkDetail = g)}
                                                    // ref={gridMkDetailRef}
                                                    dataSource={dataBarang?.nodes}
                                                    editSettings={{ allowAdding: true, allowEditing: false, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    rowHeight={22}
                                                    height={170} //170 barang jadi 150 barang produksi
                                                    gridLines={'Both'}
                                                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    // toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                                                    rowDataBound={rowDataBoundDetailBarang}
                                                    queryCellInfo={queryCellInfoDetailBarang}
                                                    recordClick={(args: any) => {
                                                        // console.log(args);
                                                        currentDaftarBarang = gridMkDetail.getSelectedRecords() || [];
                                                        if (currentDaftarBarang.length > 0) {
                                                            gridMkDetail.startEdit();
                                                            // document.getElementById('kuantitas')?.focus();
                                                        }
                                                    }}
                                                    actionBegin={handleActionBagin}
                                                    recordDoubleClick={(args: any) => {
                                                        setFocus = args.column;
                                                    }}
                                                    allowKeyboard={false}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective
                                                            field="no_item"
                                                            // isPrimaryKey={true}
                                                            headerText="No. Barang"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="85"
                                                            clipMode="EllipsisWithTooltip"
                                                            editTemplate={tombolDetailDlgItemBarang}
                                                        />
                                                        <ColumnDirective
                                                            field="diskripsi"
                                                            // isPrimaryKey={true}
                                                            headerText="Nama Barang"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateNoBarang}
                                                            editTemplate={tombolDetailDlgItemBarang}
                                                        />
                                                        <ColumnDirective
                                                            field="satuan"
                                                            // editTemplate={editTemplateSatuan}
                                                            headerText="Satuan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="60"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="qty"
                                                            format="N2" //{formatFloat}
                                                            // editType="numericedit"
                                                            edit={qtyParams}
                                                            //editTemplate={editTemplateQty}
                                                            headerText="Kuantitas"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="70"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="harga_mu"
                                                            format="N2" //{formatFloat}
                                                            // editType="numericedit"
                                                            headerText="Harga"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="diskon"
                                                            format="N2" //{formatFloat}
                                                            // editType="numericedit"
                                                            headerText="Diskon (%)"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="70"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="potongan_mu"
                                                            format="N2" //{formatFloat}
                                                            // editType="numericedit"
                                                            headerText="Potongan"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective field="pajak_ui" headerText="Pajak" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective
                                                            field="jumlah_mu"
                                                            format="N2" //{formatFloat}
                                                            // editType="numericedit"
                                                            headerText="Jumlah"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="160"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                    </ColumnsDirective>

                                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                </GridComponent>
                                            </TooltipComponent>
                                            {/* END TAB 1 */}
                                            {/* MASTER FOOTER DATA BARANG */}
                                            <div style={{ padding: 5 }} className="panel-pager">
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
                                                                                onClick={handleDetailBarang_Add}
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
                                                                                onClick={() => handleBersihkanSatuan()}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buDeleteAll1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-danger e-small"
                                                                                iconCss="e-icons e-small e-erase"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                // onClick={() => DetailBarangDeleteAll(swalDialog, setDataBarang, setTotalBarang, setTotalRecords, setIdDokumen)}
                                                                                onClick={() => handleBersihkanAll()}
                                                                            />
                                                                            {/* <ButtonComponent
                                                                                id="buSimpanDokumen1"
                                                                                content="Daftar SJ"
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-search"
                                                                                style={{ float: 'right', width: '90px', marginRight: 2.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                // onClick={DialogDaftarSj}
                                                                            /> */}
                                                                            {/* <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                <b>Jumlah Barang :</b>&nbsp;&nbsp;&nbsp;{TotalBarang}
                                                                            </div> */}
                                                                        </div>
                                                                    </TooltipComponent>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </div>
                                        </div>

                                        {/*start tab 2*/}
                                        {/* //JURNAL */}
                                        <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <ButtonComponent
                                                id="autojurnal"
                                                content="Auto Jurnal"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-refresh"
                                                // disabled={masterDataState == 'EDIT' ? true : false}
                                                // style={{ float: 'right', width: '110px', marginTop: -40, marginRight: 2, backgroundColor: masterDataState == 'EDIT' ? '#dedede' : '#3b3f5c' }}
                                                style={{ float: 'right', width: '110px', marginTop: -40, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    autoJurnal();
                                                }}
                                            />
                                            <TooltipComponent
                                                // ref={(t) => (tooltipDetailBarang = t)}
                                                // beforeRender={beforeRenderDetailBarang}
                                                openDelay={1000}
                                                target=".e-headertext"
                                            >
                                                <GridComponent
                                                    id="gridJurnalDetail"
                                                    name="gridJurnalDetail"
                                                    className="gridJurnalDetail"
                                                    locale="id"
                                                    ref={(j: any) => (gridJurnalDetail = j)} // UBAH SESUAI JURNAL
                                                    // dataSource={dataJurnal?.nodes}
                                                    // editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                    // editSettings={{ allowAdding: true, allowEditing: masterDataState == 'EDIT' ? false : true, newRowPosition: 'Bottom' }}
                                                    editSettings={{ allowAdding: false, allowEditing: false, newRowPosition: 'Bottom' }}
                                                    // editSettings={{ allowAdding: true, allowEditing: false, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    rowHeight={22}
                                                    height={170} //170 barang jadi 150 barang produksi
                                                    gridLines={'Both'}
                                                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    // toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                                                    // rowDataBound={rowDataBoundDetailBarang}
                                                    // queryCellInfo={queryCellInfoDetailBarang}

                                                    rowSelecting={(args: any) => {
                                                        // console.log(args.data);
                                                        // setSelectedAkunJurnal(args.data);
                                                        setSelectedRowIndexJurnal(args.rowIndex);
                                                    }}
                                                    // rowSelecting={rowSelectingDetailJurnal}
                                                    actionBegin={actionBeginDetailJurnal}
                                                    actionComplete={actionCompleteDetailJurnal}
                                                    created={() => {
                                                        //Tempatkan posisi toolbar dibawah grid
                                                        //gridMBList.element.appendChild(
                                                        //     gridMBList.element.querySelector('.e-toolbar'));
                                                    }}
                                                    allowKeyboard={false}
                                                    // dataBound={() => {
                                                    //     if (gridMBList) {
                                                    //         gridMBList.selectRow(0);
                                                    //         gridMBList.selectRow(dataBarang?.nodes.length - 1);
                                                    //     }
                                                    // }}
                                                    // recordDoubleClick={(args: any) => {
                                                    //     setFocus = args.column;
                                                    // }}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective field="id_dokumen" type="number" isPrimaryKey={true} headerText="ID" headerTextAlign="Center" textAlign="Center" width="30" />
                                                        <ColumnDirective
                                                            field="no_akun"
                                                            // isPrimaryKey={true}
                                                            headerText="No. Akun"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="70"
                                                            clipMode="EllipsisWithTooltip"
                                                            editTemplate={editTemplateMasterItem_No_Akun}
                                                        />
                                                        <ColumnDirective
                                                            field="nama_akun"
                                                            // isPrimaryKey={true}
                                                            headerText="Nama Akun"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                            editTemplate={editTemplateMasterItem_Nama_Akun}
                                                        />
                                                        <ColumnDirective
                                                            field="debet_rp"
                                                            // editTemplate={editTemplateDebit}
                                                            format="N2"
                                                            headerText="Debet"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="80"
                                                            clipMode="EllipsisWithTooltip"
                                                            // allowEditing={false}
                                                        />
                                                        <ColumnDirective
                                                            field="kredit_rp"
                                                            format="N2"
                                                            // editType="numericedit"
                                                            // edit={qtyParams}
                                                            //editTemplate={editTemplateQty}
                                                            headerText="Kredit"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="80"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="catatan"
                                                            headerText="Keterangan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="235"
                                                            clipMode="EllipsisWithTooltip"
                                                            // allowEditing={false}
                                                        />
                                                        <ColumnDirective
                                                            field="kode_mu"
                                                            headerText="MU"
                                                            headerTextAlign="Center"
                                                            textAlign="Center"
                                                            width="50"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateSubLedger}
                                                        />
                                                        <ColumnDirective
                                                            field="kurs"
                                                            headerText="Kurs"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="50"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateSubLedger}
                                                        />
                                                        <ColumnDirective
                                                            field="jumlah_mu"
                                                            format="N2"
                                                            headerText="Jumlah (MU)"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="80"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateSubLedger}
                                                        />
                                                        <ColumnDirective
                                                            field="nama_subledger"
                                                            headerText="Subsidiary Ledger"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="150"
                                                            clipMode="EllipsisWithTooltip"
                                                            editTemplate={editTemplateSubLedger}
                                                        />
                                                        <ColumnDirective
                                                            field="departemen"
                                                            headerText="Departemen"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="150"
                                                            clipMode="EllipsisWithTooltip"
                                                            editTemplate={editTemplateDepartemen}
                                                        />
                                                        <ColumnDirective
                                                            field="kode_jual"
                                                            headerText="Divisi Penjualan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="50"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                    </ColumnsDirective>

                                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                </GridComponent>
                                            </TooltipComponent>
                                            <div style={{ padding: 5 }} className="panel-pager">
                                                {/* <TooltipComponent content="Detail Jurnal Baru" opensOn="Hover" openDelay={1000} target="#buAdd2">
                                                    <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit2">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete2">
                                                            <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll2">
                                                                <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                    <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                        <div className="mt-1 flex">
                                                                            <ButtonComponent
                                                                                id="buAdd1"
                                                                                type="button"
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-plus"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={() => handleDetailJurnal_Add('new')}
                                                                            />

                                                                            <ButtonComponent
                                                                                id="buDelete2"
                                                                                type="button"
                                                                                cssClass="e-warning e-small"
                                                                                iconCss="e-icons e-small e-trash"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                onClick={() => {
                                                                                    DeleteDetailJurnal();
                                                                                }}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buDeleteAll2"
                                                                                type="button"
                                                                                cssClass="e-danger e-small"
                                                                                iconCss="e-icons e-small e-erase"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                onClick={() => {
                                                                                    DetailBarangDeleteAllJurnal('1');
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </TooltipComponent>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent> */}
                                                <div style={{ float: 'right', marginTop: -8 }}>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px', fontSize: 11 }}>
                                                                    <b>Total Db/Kr :</b>
                                                                </td>
                                                                {/* selisih = TotDebet - TotKredit; */}
                                                                <td style={{ fontSize: 11 }}>
                                                                    <b>{frmNumber(totalDebit)}</b>
                                                                    {/* <b>{frmNumber(TotDebet)}</b> */}
                                                                </td>
                                                                <td style={{ fontSize: 11 }}>
                                                                    <b>{frmNumber(totalKredit)}</b>
                                                                    {/* <b>{frmNumber(TotKredit)}</b> */}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{ paddingRight: '10px', fontSize: 11 }}>
                                                                    <b>Selisih :</b>
                                                                </td>
                                                                <td style={{ fontSize: 11 }}>
                                                                    <b>{frmNumber(totalDebit - totalKredit)}</b>
                                                                    {/* <b>{frmNumber(selisih)}</b> */}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* <div>
                                                    <p style={{ fontSize: '12px', marginTop: 10, marginLeft: 10 }}>
                                                        <b>Keterangan :</b>
                                                    </p>
                                                    <div className="panel-input" style={{ width: '100%', height: 60, marginTop: 5 }}>
                                                        <TextBoxComponent value={keterangan} onChange={(e: any) => setKeterangan(e.target.value)} />
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </TabComponent>
                            </div>

                            {/* ===============  Master Footerl========================   */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="col-span-4">
                                    <div className="mt-1">
                                        <p className="set-font-11">
                                            <b>Catatan :</b>
                                        </p>
                                        <div className="panel-input">
                                            <TextBoxComponent
                                                ref={(t: any) => {
                                                    textareaObj = t;
                                                }}
                                                multiline={true}
                                                created={onCreateMultiline}
                                                value={catatanValue}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    // HandelCatatan(value, setCatatanValue);
                                                    HandelCatatan(value, setquMMKketerangan);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                        Terbilang : <span style={{ fontSize: '15px', marginTop: '12px', color: 'green', textTransform: 'capitalize' }}>{terbilang}</span>
                                    </div>
                                    {/* <div className="flex" style={{ alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', marginTop: '12px', color: 'green', textTransform: 'capitalize' }}>{terbilang}</span>
                                    </div> */}
                                </div>
                                <div className="col-span-2">
                                    <div className={styles['grid-rightNote']}>
                                        <div className="mt-5 flex justify-between">
                                            <div>
                                                <div>Sub Total</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {/* vTotal_mu */}
                                                    <span style={{ margin: '0 5px', fontWeight: 'bold' }}>{quMMKtotal_mu == '0.00' ? '0.00' : frmNumber(quMMKtotal_mu)}</span>
                                                    {/*<span style={{ margin: '0 5px', fontWeight: 'bold' }}>{formatNumber(totalJumlahMu) == '0.00' ? null : formatNumber(totalJumlahMu)}</span> */}
                                                    {/* {noItem ? diskon_dok_rp : headerDataFetch[0]?.diskon_dok_rp !== '0.00' ? headerDataFetch[0]?.diskon_dok_rp : null} */}
                                                    {/* kondisi  */}
                                                    {/* Jika no_lpbSelected dipilih, maka tampilkan diskon_dok_rp, jika no_lpbSelected tidak dipilih maka lanjut ke kondisi selanjutnya */}
                                                    {/* jika headerDataFetch : diskon_dok_rp nilainya bukan '0.00' maka tampilkan headerDataFetch : diskon_dok_rp */}
                                                    {/* jika tidak ada kondisi yang terpenuhi maka tampilkan null */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>Diskon</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    <span style={{ margin: '0 5px', fontWeight: 'bold' }}>{sumDiskonDok == 'NaN' ? 0.0 : frmNumber(sumDiskonDok)}</span>
                                                    {/* {no_lpbSelected ? diskon_dok_rp : headerDataFetch[0]?.diskon_dok_rp !== '0.00' ? headerDataFetch[0]?.diskon_dok_rp : null} */}
                                                    {/* kondisi  */}
                                                    {/* Jika no_lpbSelected dipilih, maka tampilkan diskon_dok_rp, jika no_lpbSelected tidak dipilih maka lanjut ke kondisi selanjutnya */}
                                                    {/* jika headerDataFetch : diskon_dok_rp nilainya bukan '0.00' maka tampilkan headerDataFetch : diskon_dok_rp */}
                                                    {/* jika tidak ada kondisi yang terpenuhi maka tampilkan null */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>DPP</div> {/* Harga Asli Sebelum Ditambah Pajak */}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    <span style={{ margin: '0 5px', fontWeight: 'bold' }}>{hasilTotalDpp == 'NaN' ? 0.0 : frmNumber(hasilTotalDpp)}</span>
                                                    {/* {no_lpbSelected && total_pajak_rp ? total_rp : headerDataFetch[0]?.total_pajak_rp !== '0.00' && !no_lpbSelected ? headerDataFetch[0]?.total_rp : null} */}
                                                    {/* kondisi : */}
                                                    {/* jika no_lpbSelected dipilih dan total_pajak_rp memiliki value maka tampilkan total_rp jika tidak lanjut ke kondisi selanjutnya */}
                                                    {/* jika headerDataFetch : total_pajak_rp nilainya bukan '0.00' && no_lpbSelected belum dipilih maka tampilkan headerDataFetch : total_rp*/}
                                                    {/* jika tidak ada kondisi yang terpenuhi maka tampilkan null */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>Pajak</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    <span style={{ margin: '0 5px', fontWeight: 'bold' }}>{hasilVPajak == '0.00' ? 0.0 : frmNumber(hasilVPajak)}</span>
                                                    {/* {no_lpbSelected ? total_pajak_rp : headerDataFetch[0]?.total_pajak_rp !== '0.00' ? headerDataFetch[0]?.total_pajak_rp : null} */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-1 h-2 border-t-2 border-solid border-black"></div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>Total Setelah Pajak</div>
                                            </div>
                                            <div>
                                                <span style={{ margin: '0 5px', fontWeight: 'bold' }}>{quMMKnetto_mu == '0.00' ? 0.0 : frmNumber(quMMKnetto_mu)}</span>
                                                {/* <div style={{ fontWeight: 'bold' }}>{netto_rp ? netto_rp : headerDataFetch[0]?.netto_rp}</div> */}
                                                {/*<div style={{ fontWeight: 'bold' }}>{totalSetelahPajak == '0.00' ? null : totalSetelahPajak}</div>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ================= END SUB TOTAL ==================== */}

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
                                        onClick={closeDialogMkForm}
                                        disabled={disabledSimpan}
                                    />
                                )}
                                {(masterDataState == 'BARU' || masterDataState == 'EDIT') && (
                                    <ButtonComponent
                                        id="buSimpanDokumen1"
                                        content="Simpan"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-save"
                                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                        // onClick={() => saveDoc(dataBarang)}
                                        onClick={simpanDokumen}
                                        disabled={disabledSimpan}
                                    />
                                )}
                            </div>
                            {/* ============================================================ */}
                        </div>
                    </div>
                </div>
            </DialogComponent>
            {/* <FrmDlgMk
                userid={userid}
                kode_entitas={kode_entitas}
                masterKodeDokumen={masterKodeDokumen}
                masterDataState={masterDataState}
                isOpen={true}
                onClose={''}
                onRefresh={''}
                kode_user={kode_user}
            /> */}

            {/*==================================================================================================*/}
            {/*=================================== Modal Customer yang ada pada Header =============================*/}
            {/*==================================================================================================*/}
            <DialogComponent
                ref={(d: any) => (dialogDaftarCustomer = d)}
                id="dialogDaftarCustomer"
                target="#frmMk"
                style={{ position: 'fixed' }}
                header={'Daftar Customer'}
                visible={modalCust}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                allowDragging={true}
                showCloseIcon={true}
                width="84%"
                height="85%"
                buttons={buttonDaftarCustomer}
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    // console.log('closeDialog');
                    gridDaftarCustomer.clearSelection();
                    setModalCust(false);
                    if (searchNoCust !== '' || searchNamaCust !== '' || searchNamaSales !== '') {
                        gridDaftarCustomer.dataSource = [];
                    }
                    const noCustInput = document.getElementById('noCust') as HTMLInputElement;
                    if (noCustInput) {
                        noCustInput.value = '';
                    }
                    // setSearchNoCust('');
                    // setSearchNamaCust('');
                    // setSearchNamaSales('');
                }}
                closeOnEscape={true}
                open={(args: any) => {
                    // args.preventFocus = true;
                    // console.log('openDialogCustomer');
                    const data = '';
                    args.preventFocus = true;
                    setNoCustomerState(data);
                    setNamaRelasiState(data);
                    setNamaSalesState(data);
                }}
                enableResize={true}
            >
                <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="noCust"
                        name="noCust"
                        className="noCust"
                        placeholder="<No. Cust>"
                        showClearButton={true}
                        value={searchNoCust}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            // console.log(value)
                            setNoCustomerState(value);
                        }}
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '300px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="namaCust"
                        name="namaCust"
                        className="namaCust"
                        placeholder="<Nama Customer>"
                        showClearButton={true}
                        value={searchNamaCust}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            setNamaRelasiState(value);
                        }}
                    />
                </div>

                <div className="form-input mb-1" style={{ width: '300px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="namaSales"
                        name="namaSales"
                        className="namaSales"
                        placeholder="<Nama Salesman>"
                        showClearButton={true}
                        value={searchNamaSales}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            setNamaSalesState(value);
                        }}
                    />
                </div>

                <GridComponent
                    id="gridDaftarCustomer"
                    locale="id"
                    //style={{ width: '100%', height: '100%' }}
                    ref={(g: any) => (gridDaftarCustomer = g)}
                    // dataSource={dsDataCust}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    width={'100%'}
                    height={'286'}
                    gridLines={'Both'}
                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                    rowSelecting={rowSelectingDlgCustomer}
                    recordDoubleClick={(args: any) => {
                        if (gridDaftarCustomer) {
                            //Selecting row first
                            const rowIndex: number = args.row.rowIndex;
                            gridDaftarCustomer.selectRow(rowIndex);
                            currentDaftarCustomer = gridDaftarCustomer.getSelectedRecords();
                            // console.log(currentDaftarCustomer);
                            if (currentDaftarCustomer.length > 0) {
                                // console.log(tagCustomer);
                                if (tagCustomer === 'Header') {
                                    handleDlgCust(
                                        currentDaftarCustomer,
                                        setquMMKkode_cust,
                                        setquMMKno_cust,
                                        setquMMKnama_relasi,
                                        setquMMKkode_pajak,
                                        setquMMKkode_mu,
                                        setquMMKkode_sales,
                                        setquMMKnama_sales,
                                        setquMMKkurs,
                                        setquMMKkurs_pajak,
                                        setquMMKtipe,
                                        setquMMKkena_pajak,
                                    );
                                    setModalCust(false);
                                } else if (tagCustomer === 'Detail') {
                                    // console.log(tagCustomer);
                                    const selectedItems = args.rowData;
                                    // console.log(selectedItems);
                                    setSelectedAkunJurnal(selectedItems);
                                    setModalCust(false);
                                    const editedData = {
                                        ...gridJurnalDetail.dataSource[indexDataJurnal],
                                        no_subledger: selectedItems.no_cust,
                                        nama_subledger: selectedItems.subledger,
                                    };
                                    // console.log(editedData);
                                    gridJurnalDetail.dataSource[indexDataJurnal] = editedData;
                                    gridJurnalDetail.refresh();
                                }

                                // setModalCust(false);
                            } else {
                                withReactContent(swalToast).fire({
                                    icon: 'warning',
                                    title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                                    width: '100%',
                                    target: '#dialogDaftarCustomer',
                                });
                            }
                        }
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective field="nama_relasi" headerText="Nama Customer" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective
                            field="status_warna"
                            headerText="Info Detail"
                            headerTextAlign="Center"
                            textAlign="Left"
                            width="95"
                            clipMode="EllipsisWithTooltip"
                            template={templateCustomerInfoDetail}
                        />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
                <div className="mt-4 flex items-center justify-between">
                    <div className={stylesTtb['custom-box-wrapper']}>
                        <div className={stylesTtb['custom-box-aktif']}></div>
                        <div className={stylesTtb['box-text']}>Aktif</div>
                        <div className={stylesTtb['custom-box-non-aktif']}></div>
                        <div className={stylesTtb['box-text']}>Non Aktif</div>
                        <div className={stylesTtb['custom-box-bl']}></div>
                        <div className={stylesTtb['box-text']}>BlackList-G</div>
                        <div className={stylesTtb['custom-box-noo']}></div>
                        <div className={stylesTtb['box-text']}>New Open Outlet</div>
                        <div className={stylesTtb['custom-box-batal-noo']}></div>
                        <div className={stylesTtb['box-text']}>Batal NOO</div>
                        <div className={stylesTtb['custom-box-tidak-digarap']}></div>
                        <div className={stylesTtb['box-text']}>Tidak Digarap</div>
                    </div>
                </div>
            </DialogComponent>
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal FJ yang ada pada Header =============================*/}
            {/*==================================================================================================*/}
            <DialogComponent
                id="dlgListFJ"
                target="#frmMk"
                style={{ position: 'fixed' }}
                header={'Daftar Faktur'}
                // ref={(d) => (dlgListFJ = d)}
                visible={modalDlgFj}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                allowDragging={true}
                showCloseIcon={true}
                // width="40%"
                // height="85%"
                width="400px"
                buttons={btnDlgListFj}
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    // console.log('closeDialog');
                    // gridDlgListFj.clearSelection();
                    const cari = document.getElementById('noFj') as HTMLInputElement;
                    if (cari) {
                        cari.value = '';
                    }
                    // if (searchNoFj !== '' || searchTglFj !== '') {
                    //     gridDlgListFj.dataSource = [];
                    // }
                    setSearch('');
                    setSearchText('');
                    setModalDlgFj(false);
                }}
                closeOnEscape={true}
                // open={(args: any) => {
                //     // console.log('openDialogCustomer');
                //     const data = '';
                //     // HandleSearchNoFj('', setSearchKeywordNoFj, kode_entitas, quMMKkode_cust, setFilteredDataFj);
                //     // // setSearchNoFj('');
                //     // // setSearchTglFj('');
                //     // setTimeout(function () {
                //     //     document.getElementById(activeSearchDlgNoFj)?.focus();
                //     //     // setSearchNoFj(data);
                //     //     // setSearchTglFj(data);
                //     // }, 100);
                //     setNoFjState(data);
                //     setTglFjState(data);
                // }}
            >
                {/* <div className="form-input mb-1 mr-1" style={{ width: '200px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="noFj"
                        name="noFj"
                        className="noFj"
                        placeholder="<No. Faktur>"
                        showClearButton={true}
                        value={searchNoFj}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            // console.log(value)
                            // HandleSearchNoFj(value, setSearchKeywordNoFj, kode_entitas, quMMKkode_cust, setFilteredDataFj);
                            setNoFjState(value);
                        }}
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '200px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="tglFj"
                        name="tglFj"
                        className="tglFj"
                        placeholder="<Tanggal>"
                        showClearButton={true}
                        value={searchTglFj}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            // HandleSearchTglFj(value, setSearchKeywordTglFj, kode_entitas, quMMKkode_cust, setFilteredDataFj);
                            setTglFjState(value);
                        }}
                    />
                </div> */}
                <div className="mb-2 w-full rounded border border-gray-400 px-1">
                    <TextBoxComponent
                        id="search"
                        name="search"
                        className="searchtext"
                        placeholder="Cari <No. Faktur> / <Tanggal>..."
                        showClearButton={true}
                        value={searchText}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            setSearchText(value);
                        }}
                        floatLabelType="Never"
                    />
                </div>

                <GridComponent
                    id="gridDlgListFj"
                    // locale="id"
                    //style={{ width: '100%', height: '100%' }}
                    ref={(g: any) => (gridDlgListFj = g)}
                    dataSource={dsDataFj}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    searchSettings={{ fields: ['no_fj', 'tgl'], key: searchText }}
                    rowHeight={22}
                    // width={'89%'}
                    // height={'286'}
                    height={200}
                    gridLines={'Both'}
                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                    rowSelecting={rowSelectingDlgFj}
                    recordDoubleClick={(args: any) => {
                        if (gridDlgListFj) {
                            //Selecting row first
                            const rowIndex: number = args.row.rowIndex;
                            gridDlgListFj.selectRow(rowIndex);
                            currentDlgListFj = gridDlgListFj.getSelectedRecords();
                            // console.log(currentDaftarCustomer);
                            if (currentDlgListFj.length > 0) {
                                // HandleSelectedDataCustomer(currentDaftarCustomer, (tipe = 'header'), setCustSelected, setCustSelectedKode, setSelectedKodeRelasi, setModal2);

                                handleDlgFj(currentDlgListFj, setquMMKno_fj, setquMMKkode_fj, setquMMKno_reff, setquMMKkena_pajak, setquMMKkode_sales);
                                setModalDlgFj(false);
                            } else {
                                withReactContent(swalToast).fire({
                                    icon: 'warning',
                                    title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                                    width: '100%',
                                    target: '#dlgListFJ',
                                });
                            }
                        }
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="no_fj" headerText="No. Faktur" headerTextAlign="Center" textAlign="Left" width="110" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective field="tgl" headerText="Tanggal" headerTextAlign="Center" textAlign="Left" width="320" clipMode="EllipsisWithTooltip" />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
            </DialogComponent>
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal TTB yang ada pada Header =============================*/}
            {/*==================================================================================================*/}
            <DialogComponent
                id="dlgListTtb"
                target="#frmMk"
                style={{ position: 'fixed' }}
                header={'Daftar TTB'}
                // ref={(d) => (dlgListTtb = d)}
                visible={modalDlgTtb}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                allowDragging={true}
                showCloseIcon={true}
                // width="40%"
                // height="85%"
                width="400px"
                buttons={btnDlgListTtb}
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    // console.log('closeDialog');
                    // gridDlgListTtb.clearSelection();
                    const cari = document.getElementById('search') as HTMLInputElement;
                    if (cari) {
                        cari.value = '';
                    }
                    setSearch('');
                    setSearchText('');
                    setModalDlgTtb(false);
                    // if (searchNoTtb !== '' || searchTglTtb !== '') {
                    //     gridDlgListTtb.dataSource = [];
                    // }
                }}
                closeOnEscape={true}
                // open={(args: any) => {
                //     // console.log('openDialogCustomer');
                //     args.preventFocus = true;
                //     const data = '';

                //     setNoTtbState(data);
                //     setTglTtbState(data);
                // }}
            >
                {/* <div className="form-input mb-1 mr-1" style={{ width: '200px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="noTtb"
                        name="noTtb"
                        className="noTtb"
                        placeholder="<No. TTB>"
                        showClearButton={true}
                        value={searchNoTtb}
                        input={(args: ChangeEventArgsInput) => {
                            const value: any = args.value;
                            // console.log(value)
                            // HandleSearchNoTtb(value, setSearchKeywordNoTtb, kode_entitas, quMMKkode_cust, quMMKkode_ttb, setFilteredDataTtb);
                            setNoTtbState(value);
                            setSearchText(value);
                        }}
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '200px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="tglTtb"
                        name="tglTtb"
                        className="tglTtb"
                        placeholder="<Tanggal>"
                        showClearButton={true}
                        value={searchTglFj}
                        input={(args: ChangeEventArgsInput) => {
                            const value: any = args.value;
                            // HandleSearchTglTtb(value, setSearchKeywordTglTtb, kode_entitas, quMMKkode_cust, quMMKkode_fj, setFilteredDataTtb);
                            setTglTtbState(value);
                            setSearchText(value);
                        }}
                    />
                </div> */}
                <div className="mb-2 w-full rounded border border-gray-400 px-1">
                    <TextBoxComponent
                        id="search"
                        name="search"
                        className="searchtext"
                        placeholder="Cari <No. TTB> / <Tanggal>..."
                        showClearButton={true}
                        value={searchText}
                        input={(args: FocusInEventArgs) => {
                            const value: any = args.value;
                            setSearchText(value);
                        }}
                        floatLabelType="Never"
                    />
                </div>

                <GridComponent
                    id="gridDaftarTtb"
                    // locale="id"
                    //style={{ width: '100%', height: '100%' }}
                    ref={(g: any) => (gridDlgListTtb = g)}
                    // dataSource={searchKeywordNoTtb !== '' || searchKeywordTglTtb !== '' ? filteredDataTtb : dsDaftarDlgTtb}
                    dataSource={search} //{dsDataTtb}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    searchSettings={{ fields: ['no_ttb', 'tgl'], key: searchText }}
                    rowHeight={22}
                    // width={'89%'}
                    // height={'286'}
                    height={200}
                    gridLines={'Both'}
                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                    rowSelecting={rowSelectingDlgTtb}
                    recordDoubleClick={(args: any) => {
                        if (gridDlgListTtb) {
                            //Selecting row first
                            const rowIndex: number = args.row.rowIndex;
                            gridDlgListTtb.selectRow(rowIndex);
                            currentDlgListTtb = gridDlgListTtb.getSelectedRecords();
                            // console.log(currentDaftarCustomer);
                            if (currentDlgListTtb.length > 0) {
                                handleDlgTtb(currentDlgListTtb, setquMMKno_ttb, setquMMKkode_ttb);
                                setModalDlgTtb(false);
                            } else {
                                withReactContent(swalToast).fire({
                                    icon: 'warning',
                                    title: '<p style="font-size:12px">Silahkan pilih data faktur</p>',
                                    width: '100%',
                                    target: '#dlgListTtb',
                                });
                            }
                        }
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="no_ttb" headerText="No. TTB" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective field="tgl" headerText="Tanggal" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                    </ColumnsDirective>
                    {/* <Inject services={[Selection]} /> */}
                </GridComponent>
            </DialogComponent>
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal Dlg TTB MK No. Item yang ada pada Detail ===============*/}
            {/*==================================================================================================*/}
            <DialogComponent
                ref={(d: any) => (frmDlgTtbMk = d)}
                id="frmttbdlgMK"
                target="#frmMk"
                style={{ position: 'fixed' }}
                header={'Daftar Tanda Terima Barang'}
                visible={modalDlgTtbMK}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                allowDragging={true}
                showCloseIcon={true}
                width="84%"
                height="70%"
                buttons={buttonDlgTtbMk}
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    // console.log('closeDialog');
                    dgDlgTtbMk.clearSelection();
                    setModalDlgTtbMk(false);
                    if (searchNoBarang !== '' || searchNamaBarang !== '') {
                        dgDlgTtbMk.dataSource = [];
                    }
                    const noBarangInput = document.getElementById('noItem') as HTMLInputElement;
                    if (noBarangInput) {
                        noBarangInput.value = '';
                    }
                }}
                closeOnEscape={true}
                open={(args: any) => {
                    // console.log('openDialog', recordsDlgTtbMk);
                    // console.log('openDialogCustomer');
                    const data = '';
                    HandleSearchNoBarang('', setSearchNoBarang, kode_entitas, quMMKkode_cust, quMMKkode_fj, quMMKkode_ttb, setFilteredDataDlgTtbMk);
                    setTimeout(function () {
                        document.getElementById(activeSearchDlgNoBarang)?.focus();
                    }, 100);
                }}
            >
                <div className="grid h-full grid-cols-12 gap-4">
                    <div className="col-span-3">
                        {' '}
                        <div className="panel-filter h-full p-3" style={{ background: '#dedede', width: '100%' }}>
                            <div className="flex items-center text-center">
                                {/* <button
                                    className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900"
                                    //onClick={toggleFilterData}
                                    // onClick={closeClick}
                                >
                                    <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                </button> */}
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
                            <div id="inputFilter">
                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Kategori"
                                        checked={isKategoriChecked}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsKategoriChecked(value);
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
                                                HandleKategoriChange(value, setSelectedOptionKategori, setIsKategoriChecked);
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
                                        label="Merek Produk"
                                        checked={isMerkChecked}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsMerkChecked(value);
                                        }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <DropDownListComponent
                                            id="merk"
                                            className="form-select"
                                            dataSource={apiResponseMerk.map((data: any) => data.merk)}
                                            placeholder="--Silahkan Pilih--"
                                            change={(args: ChangeEventArgsDropDown) => {
                                                const value: any = args.value;
                                                HandleMerkChange(value, setSelectedOptionMerk, setIsMerkChecked);
                                            }}
                                            value={selectedOptionMerk}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Pilih Semua"
                                        checked={isPilihSemua}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsPilihSemua(value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-center">
                                <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-refresh"
                                        content="Refresh Data"
                                        style={{ backgroundColor: '#3b3f5c', marginTop: '15px' }}
                                        onClick={btnViewDlgTtbMk}
                                    />
                                </TooltipComponent>
                            </div>
                        </div>
                    </div>
                    {/*===============================================PENCARIAN================================================= */}
                    <div className="col-span-9">
                        <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="noItem"
                                name="noItem"
                                className="noItem"
                                placeholder="<No. Barang>"
                                showClearButton={true}
                                value={searchNoBarang}
                                input={(args: FocusInEventArgs) => {
                                    const value: any = args.value;
                                    // console.log(value)
                                    HandleSearchNoBarang(value, setSearchNoBarang, kode_entitas, quMMKkode_cust, quMMKkode_fj, quMMKkode_ttb, setFilteredDataDlgTtbMk);
                                }}
                            />
                        </div>
                        <div className="form-input mb-1 mr-1" style={{ width: '300px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="namaBarang"
                                name="namaBarang"
                                className="namaBarang"
                                placeholder="<Nama Barang>"
                                showClearButton={true}
                                value={searchNamaBarang}
                                input={(args: FocusInEventArgs) => {
                                    const value: any = args.value;
                                    HandleSearchNamaBarang(value, setSearchNamaBarang, kode_entitas, quMMKkode_cust, quMMKkode_fj, quMMKkode_ttb, setFilteredDataDlgTtbMk);
                                }}
                            />
                        </div>

                        <GridComponent
                            id="dgDlgTtbMk"
                            locale="id"
                            //style={{ width: '100%', height: '100%' }}
                            ref={(g: any) => (dgDlgTtbMk = g)}
                            dataSource={searchNoBarang !== '' || searchNamaBarang !== '' ? filteredDataDlgTtbMk : recordsDlgTtbMk} // dsDlgTtbMk}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'370'}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowSelecting={rowSelectingDlgTtbMk}
                            recordDoubleClick={(args: any) => {
                                if (dgDlgTtbMk) {
                                    //Selecting row first
                                    const rowIndex: number = args.row.rowIndex;
                                    dgDlgTtbMk.selectRow(rowIndex);
                                    currentDlgListTtbMk = dgDlgTtbMk.getSelectedRecords();
                                    if (currentDlgListTtbMk.length > 0) {
                                        const modifiedDataDlg: any = currentDlgListTtbMk.map((node: any) => ({
                                            ...node,
                                            pajak_ui: node.kode_pajak_fj === 'S' ? 'S - PPN 10%' : node.kode_pajak_fj === 'T' ? 'T - PPN 11%' : 'N - Tanpa Pajak',
                                        }));
                                        setPilihDetailBarang(modifiedDataDlg);
                                        // console.log(modifiedDataDlg);
                                        setModalDlgTtbMk(false);
                                    } else {
                                        withReactContent(swalToastTtbMk).fire({
                                            icon: 'warning',
                                            title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                                            width: '100%',
                                            target: '#frmttbdlgMK',
                                        });
                                    }
                                }
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_item" headerText="No. Barang" headerTextAlign="Center" textAlign="Left" width="75" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="diskripsi" headerText="Nama Barang" headerTextAlign="Center" textAlign="Left" width="180" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="satuan" headerText="Satuan" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="qty" format={formatFloat} headerText="Kuantitas" headerTextAlign="Center" textAlign="Right" width="70" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="qty_mk" format={formatFloat} headerText="Sisa" headerTextAlign="Center" textAlign="Right" width="70" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="harga_mu_fj" format={formatFloat} headerText="Harga" headerTextAlign="Center" textAlign="Right" width="70" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="jumlah_mu_fj" format={formatFloat} headerText="Jumalah" headerTextAlign="Center" textAlign="Right" width="85" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                    </div>
                </div>
                {/* <div className="mt-4 flex items-center justify-between">
                    <div className={stylesTtb['custom-box-wrapper']}>
                        <div className={stylesTtb['custom-box-aktif']}></div>
                        <div className={stylesTtb['box-text']}>Aktif</div>
                        <div className={stylesTtb['custom-box-non-aktif']}></div>
                        <div className={stylesTtb['box-text']}>Non Aktif</div>
                        <div className={stylesTtb['custom-box-bl']}></div>
                        <div className={stylesTtb['box-text']}>BlackList-G</div>
                        <div className={stylesTtb['custom-box-noo']}></div>
                        <div className={stylesTtb['box-text']}>New Open Outlet</div>
                        <div className={stylesTtb['custom-box-batal-noo']}></div>
                        <div className={stylesTtb['box-text']}>Batal NOO</div>
                        <div className={stylesTtb['custom-box-tidak-digarap']}></div>
                        <div className={stylesTtb['box-text']}>Tidak Digarap</div>
                    </div>
                </div> */}
            </DialogComponent>
            {/*==================================================================================================*/}

            {/*==================================================================================================*/}
            {/*=================================== Modal Dlg Akun Jurnal pada Detail ===============*/}
            {/*==================================================================================================*/}
            <DialogComponent
                ref={(d: any) => (frmDlgAkunJurnal = d)}
                id="frmDlgAkunJurnal"
                target="#frmMk"
                style={{ position: 'fixed' }}
                header={'Daftar Akun'}
                visible={modalAkunJurnal}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                allowDragging={true}
                showCloseIcon={true}
                // width="84%"
                // height="85%"
                width="425"
                height="450"
                // buttons={buttonDlgTtbMk}
                position={{ X: 'center', Y: 'center' }}
                closeOnEscape={true}
                close={() => {
                    setModalAkunJurnal(false);
                    setSearchNoAkun('');
                    setSearchNamaAkun('');
                }}
            >
                <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="searchNoAkun"
                        name="searchNoAkun"
                        className="searchNoAkun"
                        placeholder="<No. Akun>"
                        showClearButton={true}
                        value={searchNoAkun}
                        input={(args: FocusInEventArgs) => {
                            (document.getElementsByName('searchNamaAkun')[0] as HTMLFormElement).value = '';
                            setSearchNamaAkun('');
                            const value: any = args.value;
                            setSearchNoAkun(value);
                        }}
                    />
                </div>
                <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="searchNamaAkun"
                        name="searchNamaAkun"
                        className="searchNamaAkun"
                        placeholder="<Nama Akun>"
                        showClearButton={true}
                        value={searchNamaAkun}
                        input={(args: FocusInEventArgs) => {
                            (document.getElementsByName('searchNoAkun')[0] as HTMLFormElement).value = '';
                            setSearchNoAkun('');
                            const value: any = args.value;
                            setSearchNamaAkun(value);
                        }}
                    />
                </div>
                <GridComponent
                    id="dgDlgAkunJurnal"
                    locale="id"
                    ref={(g: any) => (dgDlgAkunJurnal = g)}
                    dataSource={listAkunJurnal}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    width={'100%'}
                    height={'267'}
                    // gridLines={'Both'}
                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                    rowSelecting={(args: any) => {
                        // console.log(args.data);
                        setSelectedAkunJurnal(args.data);
                        // setSelectedRowIndex(args.rowIndex);
                    }}
                    // rowSelecting={rowSelectingDialogAkun}
                    recordDoubleClick={(args: any) => {
                        if (args.rowData.header === 'Y') {
                            setModalAkunJurnal(false);
                            myAlert(`No. Akun ${args.rowData.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi.`);
                        } else {
                            if (dgDlgAkunJurnal) {
                                const rowIndex: number = args.row.rowIndex;
                                const selectedItems = args.rowData;
                                dgDlgAkunJurnal.selectRow(rowIndex);
                                setSelectedAkunJurnal(selectedItems);
                                getFromModalAkunJurnal();
                                // gridJurnalDetail.refresh();
                                // // console.log(selectedItems);
                                // setSelectedAkunJurnal(selectedItems);
                                // setModalAkunJurnal(false);
                                // const editedData = {
                                //     ...gridJurnalDetail.dataSource[indexDataJurnal],
                                //     kode_akun: selectedItems.kode_akun,
                                //     no_akun: selectedItems.no_akun,
                                //     nama_akun: selectedItems.nama_akun,
                                //     tipe: selectedItems.tipe,
                                // };
                                // gridJurnalDetail.dataSource[indexDataJurnal] = editedData;
                                // gridJurnalDetail.refresh();
                            }
                        }
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective
                            // template={(args: any) => TemplateNoAkun(args)}
                            field="no_akun"
                            headerText="No. Akun"
                            headerTextAlign="Center"
                            textAlign="Left"
                            width="30"
                            clipMode="EllipsisWithTooltip"
                            template={templateNoAkun}
                        />
                        <ColumnDirective
                            // template={(args: any) => TemplateNamaAkun(args)}
                            field="nama_akun"
                            headerText="Keterangan"
                            headerTextAlign="Center"
                            textAlign="Left"
                            width="60"
                            clipMode="EllipsisWithTooltip"
                            template={templateNamaAkun}
                        />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
                <ButtonComponent
                    id="buBatalDokumen1"
                    content="Batal"
                    cssClass="e-primary e-small"
                    // iconCss="e-icons e-small e-close"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    onClick={() => {
                        setModalAkunJurnal(false);
                        setSearchNoAkun('');
                        setSearchNamaAkun('');
                    }}
                />
                <ButtonComponent
                    id="buSimpanDokumen1"
                    content="Pilih"
                    cssClass="e-primary e-small"
                    // iconCss="e-icons e-small e-save"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    onClick={() => {
                        if (selectedAkunJurnal) {
                            // console.log(selectedAkunJurnal);
                            setModalAkunJurnal(false);
                            const editedData = {
                                ...gridJurnalDetail.dataSource[indexDataJurnal],
                                kode_akun: selectedAkunJurnal.kode_akun,
                                no_akun: selectedAkunJurnal.no_akun,
                                nama_akun: selectedAkunJurnal.nama_akun,
                                tipe: selectedAkunJurnal.tipe,
                            };
                            gridJurnalDetail.dataSource[indexDataJurnal] = editedData;
                            gridJurnalDetail.refresh();
                        } else {
                            myAlert(`Silahkan pilih akun terlebih dulu.`);
                        }
                    }}
                />
            </DialogComponent>
            {/*==================================================================================================*/}
        </div>
    );
};

export default FrmMk;
