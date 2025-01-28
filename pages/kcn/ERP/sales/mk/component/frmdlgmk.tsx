import * as React from 'react';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState, useCallback, useRef } from 'react';

import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';

import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);

import { useRouter } from 'next/router';
import styles from './mk.module.css';
import stylesTtb from '../mklist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GetListDlgMkTtb } from '../model/api';

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
import { HandelCatatan, HandleModalChange, HandleModaliconChange, HandleRemoveRowsOtomatis } from './fungsiFrmMk';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

interface frmdlgmkProps {
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
let tooltipDetailBarang: Tooltip | any;
let setFocus: any;
let statusNolJurnal: string;

const FrmDlgMk = ({ userid, kode_entitas, masterKodeDokumen, masterDataState, isOpen, onClose, onRefresh, kode_user }: frmdlgmkProps) => {
    const router = useRouter;
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const swalDialog = Swal.mixin({
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

    const swalToast = Swal.mixin({
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

    const myAlert = (text: any) => {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: `<p style="font-size:12px">${text}</p>`,
            width: '100%',
            target: '#frmMk',
        });
    };

    const [dataHeader, setDataHeader] = useState({ nodes: [] });
    const [dataBarang, setDataBarang] = useState({ nodes: [] });
    const [dataJurnal, setDataJurnal] = useState<any>({ nodes: [] });
    const [divisiPenjualan, setDivisiPenjualan] = useState('');
    const [tagCustomer, setTagCustomer] = useState('');
    const [changeNumber, setChangeNumber] = useState(0);
    const [handleNamaCust, setHandleNamaCust] = useState('');

    const [modalCust, setModalCust] = useState(false); //customer
    const [modalDlgTtbMK, setModalDlgTtbMk] = useState(false);
    const [totalBarang, setTotalBarang] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    //*========================== STATE DATA HEADER================================
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
    const [quMMKtotal_mu, setquMMKtotal_mu] = useState<any>('');
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
    //*===================================================================

    const [modalDlgFj, setModalDlgFj] = useState(false);
    const [modalDlgTtb, setModalDlgTtb] = useState(false);
    const [valueKenaPajak, setValueKenaPajak] = useState<string>('');
    const [IdDokumen, setIdDokumen] = useState(0);

    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [selectedRowIndexJurnal, setSelectedRowIndexJurnal] = useState(0);

    const [IdDokumenJurnal, setIdDokumenJurnal] = useState(0);
    const [tambahJurnal, setTambahJurnal] = useState(false);
    const [searchNoAkun, setSearchNoAkun] = useState('');
    const [searchNamaAkun, setSearchNamaAkun] = useState('');
    const [selectedAkunJurnal, setSelectedAkunJurnal] = useState<any>('');
    const [indexDataJurnal, setIndexDataJurnal] = useState('');
    const [modalAkunJurnal, setModalAkunJurnal] = useState(false);

    const [totalDebit, setTotalDebit] = useState<any>(0);
    const [totalKredit, setTotalKredit] = useState<any>(0);

    const [catatanValue, setCatatanValue] = useState('');
    const [listDepartemen, setListDepartemen] = useState([]);

    let lbSumDiskonDok: any;
    let lbTotalDPP: any;
    let lbTotalPajak: any;
    let qudMkInclude: any, quDMKpajak_mu: any;
    let vPajak: any, vDiskonPerBarang: any, vTotDiskonPerBarang: any, vTotalAwal: any, vTotal_mu: any, vNetto_mu: any, vTotal_dpp: any, vTotal_Diskon_mu: any;
    const [hasilTotalDpp, sethasilTotalDpp] = useState<any>('');
    const [hasilVPajak, sethasilVPajak] = useState<any>('');
    const [sumDiskonDok, SetSumDiskonDok] = useState<any>('');
    const [terbilang, setTerbilang] = useState('');
    const [dataTotalHeader, setDataTotalHeader] = useState({ jumlahMu: 0, totalDiskonMu: 0, totalJumlahPajak: 0 });

    const simpanDokumen = async () => {
        // console.log('mauk pa ekooo');
        // saveDoc();
    };

    let textareaObj: any;
    function onCreateMultiline(): void {
        // textareaObj.addAttributes({ rows: 1 });
        // textareaObj.respectiveElement.style.height = 'auto';
        // textareaObj.respectiveElement.style.height = '60px';
        //textareaObj.respectiveElement.scrollHeight + 'px';
    }

    const ReCallRefreshModal = () => {
        setquMMKno_mk('<Baru>');
        setquMMKkode_mk('');
        // setDate1(new Date());
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

        // setDataTotalHeader((prevState) => ({
        //     ...prevState,
        //     jumlahMu: 0,
        //     totalDiskonMu: 0,
        //     totalJumlahPajak: 0,
        // }));
        // setTotalBarang(0);
    };

    const closeDialogMkForm = async () => {
        await ReCallRefreshModal();
        await setTimeout(() => {
            // onRefresh();
        }, 100);
        await onClose();
    };

    const handleClearInput = async (textClear: any) => {
        const clearInput = document.getElementById(textClear) as HTMLInputElement;
        if (clearInput) {
            clearInput.value = '';
        }
    };

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

    const rowDataBoundDetailBarang = (args: any) => {
        if (args.row) {
            if (getValue('kode_mk', args.data) == 'ADDROW') {
                args.row.style.background = '#F2FDF8';
            } else {
                args.row.style.background = '#ffffff';
            }
        }
    };
    //*============= Format cell pada grid Detail Barang =============
    const queryCellInfoDetailBarang = (args: any) => {
        if ((args.column?.field === 'fpp_btg' || args.column?.field === 'fpp_harga_btg' || args.column?.field === 'berat') && !args.column?.isSelected) {
            args.cell.style.color = '#B6B5B5';
        }
    };

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
                                    setModalDlgTtbMk(true);
                                    HandleModaliconChange('noItem', dataBarang, quMMKno_cust, setModalDlgTtbMk);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const calculateData = async () => {
        const id = parseFloat((document.getElementsByName('id_mk')[0] as HTMLFormElement).value);
        setDataBarang((state: any) => {
            const newNodes = state.nodes.map((node: any) => {
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
            const id = dataBarang.nodes.length + 1;
            setIdDokumen(id);
            const totalLine = dataBarang.nodes.length;
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

            const hasEmptyFields = dataBarang.nodes.some((row: { no_item: string }) => row.no_item === '');

            if (!hasEmptyFields) {
                setDataBarang((state: any) => ({
                    ...state,
                    nodes: state.nodes.concat(newNode),
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
        //     nodes: state.nodes.concat(detailJurnalBaru),
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
        //     nodes: state.nodes.concat(detailJurnalBaruPiutang),
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
            if (dataBarang.nodes.length > 0) {
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
                    const dataObjek: any = dataBarang.nodes;
                    //   DeleteAllRecord(Qujurnal);
                    value1 = dataObjek.reduce((total: number, node: any) => {
                        return total + node.jumlah_mu;
                    }, 0);

                    const result = await fetchPreferensi(kode_entitas, apiUrl);
                    // console.log(result[0].kode_akun_persediaan);

                    // Jurnal Retur Penjualan (D)
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
                    combinedArray.push(detailJurnalBaru);
                    // setDataJurnal((state: any) => ({
                    //     ...state,
                    //     nodes: state.nodes.concat(detailJurnalBaru),
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
                            kurs: quMMKkurs,
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
                        //     nodes: state.nodes.concat(detailJurnalPiutangDagang),
                        // }));
                        // console.log(dataJurnal);
                        i++;
                    }

                    // Jurnal Diskon atau Potongan (K)
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
                            kurs: quMMKkurs,
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
                        //     nodes: state.nodes.concat(detailJurnalBaru),
                        // }));
                        // console.log(gridJurnalDetail.dataSource);
                        i++;
                    }

                    // Jurnal Diskon atau Potongan Langsung (K)
                    let detailJurnalDiskonPotonganLangsung: any;
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
                            kurs: quMMKkurs,
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
                        //     nodes: state.nodes.concat(detailJurnalBaru),
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
                    const vCekAkunPajak = cekAkunPajak.data.data[0].kode_akun;
                    // console.log(vCekAkunPajak);
                    if (vCekAkunPajak === '' || vCekAkunPajak === null) {
                    } else {
                        // console.log('masuk mas brooooooooooo');
                        const quJurnalkode_akun = result[0].kode_akun;
                        const quJurnalno_akun = result[0].no_akun;
                        const quJurnalnama_akun = result[0].nama_akun;
                        const quJurnaltipe = result[0].tipe;

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
                        //     nodes: state.nodes.concat(detailJurnalBaru),
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

    const recalc = () => {
        // console.log('totalJumlahMu ', totalJumlahMu);
        // var totalJumlahMu = dataBarang.nodes.length > 0 ? jumlahkanTotalJumlahMu(dataBarang) : jumlahkanTotalJumlahMu(detailDataFetch);
        // vTotalAwal = totalJumlahMu;
        vNetto_mu = 0;
        vTotal_Diskon_mu = 0;
        vTotDiskonPerBarang = 0;
        vTotal_dpp = 0;

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

        const dataObjek: any = dataBarang.nodes;
        // for (var i = 0; i < dataObjek.length; i++) {
        //     vTotal_mu += dataObjek[i].jumlah_mu;
        //     vTotal_Diskon_mu += dataObjek[i].qty_std * (dataObjek[i].diskon_mu + dataObjek[i].potongan_mu);
        // }
        vTotal_mu = dataObjek.reduce((total: number, node: any) => {
            return total + node.jumlah_mu; //parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
        }, 0);
        vTotal_Diskon_mu = dataObjek.reduce((total: number, node: any) => {
            return total + node.qty_std * (node.diskon_mu + node.potongan_mu); //parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
        }, 0);

        vTotDiskonPerBarang = dataObjek.reduce((total: number, node: any) => {
            return total + (node.disc_per_item / node.qty_fj) * node.qty; //parseFloat(node.jumlah_mu.replace(/[^0-9.-]+/g, ''));
        }, 0);

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
                qudMkInclude = 'E';
                quDMKpajak_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.pajak_fj / node.qty_fj) * node.qty;
                }, 0);
                vNetto_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.jumlah_mu + node.pajak_mu);
                }, 0);
                vTotal_dpp = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.jumlah_mu + vTotDiskonPerBarang);
                }, 0);
            } else {
                qudMkInclude = 'I';
                quDMKpajak_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.pajak_fj / node.qty_fj) * node.qty;
                }, 0);
                vNetto_mu = dataObjek.reduce((total: number, node: any) => {
                    return total + node.jumlah_mu;
                }, 0);
                vTotal_dpp = dataObjek.reduce((total: number, node: any) => {
                    return total + (node.jumlah_mu - vTotDiskonPerBarang - node.pajak_mu);
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
                return total + (node.jumlah_mu - vTotDiskonPerBarang);
            }, 0);
            // console.log('vTotal_dpp ', vTotal_dpp);
        }

        vNetto_mu = vNetto_mu;
        vNetto_mu = vNetto_mu - vTotDiskonPerBarang;

        setquMMKtotal_mu(vTotal_mu);
        setquMMKtotal_pajak_mu(vPajak);
        setquMMKtotal_pajak_rp(vPajak);
        setquMMKnetto_mu(vNetto_mu);

        setquMMKtotal_diskon_mu(vTotal_Diskon_mu);
        setquMMKtotal_diskon_mu(vTotDiskonPerBarang);

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
                        <TextBoxComponent id="noCust" name="noCust" className="noCust" value={args.nama_relasi} readOnly={true} showClearButton={false} />
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
    const DetailBarangDeleteAllJurnal = () => {
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
    };

    const handleDetailJurnal_Add = async (jenis: any) => {
        // if (dataBarang.nodes.length > 0) {
        await handleDetailJurnal_EndEdit();
        const totalLine = gridJurnalDetail.dataSource.length; //dataJurnal.nodes.length + 1;
        const isNoAkunEmpty = gridJurnalDetail.dataSource.every((item: any) => item.no_akun !== '');
        // console.log('dataBarang.nodes.length ', dataBarang.nodes.length);
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
            // console.log('masuk jurnal ', dataBarang.nodes.length);
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

    const handleDetailJurnal_EndEdit = async () => {
        gridJurnalDetail.endEdit();
    };

    return (
        <div>
            <DialogComponent
                id="frmMk1"
                name="frmMk1"
                className="frmMk1"
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
                                                                        // setDate1(selectedDate);
                                                                    } else {
                                                                        // setDate1(moment());
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
                                                                                withReactContent(Swal).fire({
                                                                                    // icon: 'error',
                                                                                    title: `<span style='color: gray; font-weight: bold;'>Customer belum diisi.</span>`,
                                                                                    width: '20%',
                                                                                    target: '#frmMk',
                                                                                    confirmButtonText: 'Ok',
                                                                                });
                                                                                handleClearInput('edFaktur');
                                                                            } else {
                                                                                setquMMKno_fj('');
                                                                                HandleModalChange(value, 'fj', setChangeNumber, setHandleNamaCust, setModalDlgFj);
                                                                            }
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                        // onKeyDown={() => console.log('key was pressed')}
                                                                        // onKeyDown={(event) => {
                                                                        //     const char = event.key;
                                                                        //     const isValidChar = /[0-9.\s]/.test(char) || event.keyCode === 8;
                                                                        //     if (!isValidChar) {
                                                                        //         event.preventDefault();
                                                                        //     }
                                                                        //     const inputValue = (event.target as HTMLInputElement).value;
                                                                        //     if (char === '.' && inputValue.includes('.')) {
                                                                        //         event.preventDefault();
                                                                        //     }
                                                                        // }}
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
                                                                            onClick={() => HandleModaliconChange('fj', [], quMMKkode_cust, setModalDlgFj)}
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

                            <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '300px' }}>
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
                                                    dataSource={dataBarang.nodes}
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
                                                    // actionBegin={actionBeginDetailBarang}
                                                    // actionComplete={actionCompleteDetailBarang}
                                                    // rowSelecting={rowSelectingDetailBarang}
                                                    created={() => {
                                                        //Tempatkan posisi toolbar dibawah grid
                                                        //gridTtbList.element.appendChild(
                                                        //     gridTtbList.element.querySelector('.e-toolbar'));
                                                    }}
                                                    dataBound={() => {
                                                        if (gridMkDetail) {
                                                            gridMkDetail.selectRow(0);
                                                            gridMkDetail.selectRow(dataBarang.nodes.length - 1);
                                                        }
                                                    }}
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
                                                            width="260"
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
                                                        <ColumnDirective field="kode_pajak" headerText="Pajak" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective
                                                            field="jumlah_mu"
                                                            format="N2" //{formatFloat}
                                                            // editType="numericedit"
                                                            headerText="Jumlah"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="260"
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
                                                                                onClick={() => DetailBarangDelete(gridMkDetail, swalDialog, IdDokumen, setIdDokumen, setDataBarang)}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buDeleteAll1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-danger e-small"
                                                                                iconCss="e-icons e-small e-erase"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                onClick={() => DetailBarangDeleteAll(swalDialog, setDataBarang, setTotalBarang, setTotalRecords, setIdDokumen)}
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
                                                    // dataSource={dataJurnal.nodes}
                                                    // editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                    // editSettings={{ allowAdding: true, allowEditing: masterDataState == 'EDIT' ? false : true, newRowPosition: 'Bottom' }}
                                                    editSettings={{ allowAdding: true, allowEditing: true, newRowPosition: 'Bottom' }}
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
                                                    //         gridMBList.selectRow(dataBarang.nodes.length - 1);
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
                                                            width="100"
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
                                                            width="120"
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
                                                            width="120"
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
                                                            textAlign="Left"
                                                            width="50"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateSubLedger}
                                                        />
                                                        <ColumnDirective
                                                            field="kurs"
                                                            headerText="Kurs"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
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
                                                            width="120"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateSubLedger}
                                                        />
                                                        <ColumnDirective
                                                            field="nama_subledger"
                                                            headerText="Subsidiary Ledger"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
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
                                                <TooltipComponent content="Detail Jurnal Baru" opensOn="Hover" openDelay={1000} target="#buAdd2">
                                                    <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit2">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete2">
                                                            <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll2">
                                                                <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                    <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                        {/* {masterDataState == 'EDIT' ? ( */}
                                                                        {/* <div style={{ marginTop: 28 }} className="mt-1 flex"></div> */}
                                                                        {/* ) : ( */}
                                                                        <div className="mt-1 flex">
                                                                            <ButtonComponent
                                                                                id="buAdd1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-plus"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                // onClick={() => handleDetail_Add('new')}
                                                                                onClick={() => handleDetailJurnal_Add('new')}
                                                                            />
                                                                            {/* <ButtonComponent
                                                                                id="buEdit2"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-edit"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={handleDetail_Edit_Jurnal}
                                                                            /> */}
                                                                            <ButtonComponent
                                                                                id="buDelete2"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-warning e-small"
                                                                                iconCss="e-icons e-small e-trash"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                onClick={() => {
                                                                                    // DetailBarangDelete(gridJurnalDetail, swalDialog, IdDokumen, setIdDokumen);
                                                                                    DeleteDetailJurnal();
                                                                                }}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buDeleteAll2"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-danger e-small"
                                                                                iconCss="e-icons e-small e-erase"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                onClick={() => {
                                                                                    DetailBarangDeleteAllJurnal();
                                                                                    // console.log('diklkik jurnal');
                                                                                }}
                                                                            />
                                                                        </div>

                                                                        <div style={{ float: 'right', marginTop: -33 }}>
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
                                                                    </TooltipComponent>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
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
                                                // created={onCreateMultiline}
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
                                                    <span style={{ margin: '0 5px', fontWeight: 'bold' }}>{quMMKtotal_mu == '0.00' ? null : frmNumber(quMMKtotal_mu)}</span>
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
                                    />
                                )}
                            </div>
                            {/* ============================================================ */}
                        </div>
                    </div>
                </div>
            </DialogComponent>
        </div>
    );
};

export default FrmDlgMk;
