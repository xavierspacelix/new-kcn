// import * as React from 'react';
// import { useRouter } from 'next/router';
// import styles from './mk.module.css';
// import stylesTtb from '../mklist.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

// import { useEffect, useState, useCallback, useRef } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// import swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
// import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
// import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
// import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
// import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
// import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
// import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
// import { DataManager } from '@syncfusion/ej2-data';
// import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
// import { table } from '@syncfusion/ej2/grids';

// import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
// import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
// import * as numbers from 'cldr-data/main/id/numbers.json';
// import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
// import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
// import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week

// loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

// import idIDLocalization from '@/public/syncfusion/locale.json';
// L10n.load(idIDLocalization);

// interface FrmMkProps {
//     userid: any;
//     kode_entitas: any;
//     masterKodeDokumen: any;
//     masterDataState: any;
//     masterBarangProduksi: any;
//     isOpen: boolean;
//     onClose: any;
//     onRefresh: any;
//     kode_user: any;
// }

// // let tipettbdlgMK: any;
// // let buttonDlgAkunJurnal: ButtonPropsModel[];
// // let currentDlgAkunJurnal: any[] = [];
// // let tipeDlgAkunJurnal: any;
// // let tipe: any;
// let gridJurnalDetail: Grid | any;
// let dgDlgAkunJurnal: Grid | any;
// let frmDlgAkunJurnal: Dialog | any;
// let statusNolJurnal: string;

// const FrmDlgAkunJurnal: React.FC<FrmMkProps> = ({}: FrmMkProps) => {
//     const [dataJurnal, setDataJurnal] = useState<any>({ nodes: [] });

//     const [totalDebit, setTotalDebit] = useState<any>(0);
//     const [totalKredit, setTotalKredit] = useState<any>(0);
//     const [indexDataJurnal, setIndexDataJurnal] = useState('');
//     const [modalAkunJurnal, setModalAkunJurnal] = useState(false);
//     const [listAkunJurnal, setListAkunJurnal] = useState<any[]>([]);
//     // const [IdDokumenJurnal, setIdDokumenJurnal] = useState(0);
//     // const [tambahJurnal, setTambahJurnal] = useState(false);
//     const [searchNoAkun, setSearchNoAkun] = useState('');
//     const [searchNamaAkun, setSearchNamaAkun] = useState('');
//     const [selectedAkunJurnal, setSelectedAkunJurnal] = useState<any>('');
//     const [selectedRowIndex, setSelectedRowIndex] = useState(0);
//     const [selectedRowIndexJurnal, setSelectedRowIndexJurnal] = useState(0);

//     let LastID: any, TotDebet: any, TotKredit: any, selisih: any;

//     const swalToast = swal.mixin({
//         toast: true,
//         position: 'center',
//         customClass: {
//             popup: 'colored-toast',
//         },
//         showConfirmButton: false,
//         timer: 3500,
//         showClass: {
//             popup: `
//               animate__animated
//               animate__zoomIn
//               animate__faster
//             `,
//         },
//         hideClass: {
//             popup: `
//               animate__animated
//               animate__zoomOut
//               animate__faster
//             `,
//         },
//     });

//     const myAlert = (text: any) => {
//         withReactContent(swalToast).fire({
//             icon: 'warning',
//             title: `<p style="font-size:12px">${text}</p>`,
//             width: '100%',
//             target: '#frmMk',
//         });
//     };

//     const handleDetailJurnal_EndEdit = async () => {
//         gridJurnalDetail.endEdit();
//     };

//     const getFromModalAkunJurnal = async () => {
//         await handleDetailJurnal_EndEdit();
//         handleDetailJurnal_Add('selected');
//         setModalAkunJurnal(false);
//     };

//     const handleDetailJurnal_Add = async (jenis: any) => {
//         // if (dataBarang.nodes.length > 0) {
//         await handleDetailJurnal_EndEdit();
//         const totalLine = gridJurnalDetail.dataSource.length; //dataJurnal.nodes.length + 1;
//         const isNoAkunEmpty = gridJurnalDetail.dataSource.every((item: any) => item.no_akun !== '');
//         // console.log('dataBarang.nodes.length ', dataBarang.nodes.length);
//         if (jenis === 'selected') {
//             //BUAT BLOKINGAN JURNAL
//             try {
//                 const detailJurnalBaru = {
//                     kode_dokumen: '',
//                     id_dokumen: totalLine,
//                     dokumen: '',
//                     tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
//                     kode_akun: selectedAkunJurnal.kode_akun,
//                     kode_subledger: '',
//                     kurs: quMMKkurs,
//                     debet_rp: 0,
//                     kredit_rp: 0,
//                     jumlah_rp: 0,
//                     jumlah_mu: 0,
//                     catatan: '',
//                     no_warkat: '',
//                     tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                     persen: 0,
//                     kode_dept: '',
//                     kode_kerja: '',
//                     approval: '',
//                     posting: '',
//                     rekonsiliasi: '',
//                     tgl_rekonsil: '',
//                     userid: userid,
//                     tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                     audit: '',
//                     kode_kry: '',
//                     kode_jual: divisiPenjualan,
//                     no_kontrak_um: '',
//                     no_akun: selectedAkunJurnal.no_akun,
//                     nama_akun: selectedAkunJurnal.nama_akun,
//                     tipe: selectedAkunJurnal.tipe,
//                     kode_mu: quMMKkode_mu,
//                     nama_dept: '',
//                     nama_kerja: '',
//                     no_subledger: '',
//                     nama_subledger: '',
//                     isledger: '',
//                 };

//                 gridJurnalDetail.dataSource[selectedRowIndexJurnal] = detailJurnalBaru;
//                 setTambahJurnal(true);
//                 gridJurnalDetail.refresh();
//                 return;
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         } else if ((totalLine === 0 && jenis === 'new') || (isNoAkunEmpty && jenis === 'new')) {
//             // console.log('masuk jurnal ', dataBarang.nodes.length);
//             const detailJurnalBaru = {
//                 kode_dokumen: '',
//                 id_dokumen: totalLine + 1,
//                 dokumen: '',
//                 tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
//                 kode_akun: '',
//                 kode_subledger: '',
//                 kurs: quMMKkurs,
//                 debet_rp: 0,
//                 kredit_rp: 0,
//                 jumlah_rp: 0,
//                 jumlah_mu: 0,
//                 catatan: '',
//                 no_warkat: '',
//                 tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                 persen: 0,
//                 kode_dept: '',
//                 kode_kerja: '',
//                 approval: '',
//                 posting: '',
//                 rekonsiliasi: '',
//                 tgl_rekonsil: '',
//                 userid: userid,
//                 tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                 audit: '',
//                 kode_kry: '',
//                 kode_jual: divisiPenjualan,
//                 no_kontrak_um: '',
//                 no_akun: '',
//                 nama_akun: '',
//                 tipe: '',
//                 kode_mu: quMMKkode_mu,
//                 nama_dept: '',
//                 nama_kerja: '',
//                 no_subledger: '',
//                 nama_subledger: '',
//                 isledger: '',
//             };
//             gridJurnalDetail.addRecord(detailJurnalBaru, totalLine);
//             // setTimeout(() => {
//             //     gridJurnalDetail.startEdit(totalLine);
//             // },200);
//             // gridJurnalDetail.dataSource[selectedRowIndexJurnal] = detailJurnalBaru;
//             setTambahJurnal(true);
//         } else {
//             document.getElementById('gridJurnalDetail')?.focus();
//             myAlert(`Silahkan melengkapi data barang sebelum menambah data baru.`);
//         }
//     };

//     const templateNoAkun = (args: any) => {
//         return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.no_akun}</div>;
//     };

//     const templateNamaAkun = (args: any) => {
//         return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.nama_akun}</div>;
//     };

//     const editTemplateMasterItem_Nama_Akun = (args: any) => {
//         return (
//             <div>
//                 <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
//                     <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
//                         <TextBoxComponent id="namaAkun" name="namaAkun" className="namaAkun" value={args.nama_akun} readOnly={true} showClearButton={false} />
//                         <span>
//                             <ButtonComponent
//                                 id="buNoItem2"
//                                 type="button" //Solusi tdk refresh halaman saat selesai onClick
//                                 cssClass="e-primary e-small e-round"
//                                 iconCss="e-icons e-small e-search"
//                                 onClick={() => {
//                                     setModalAkunJurnal(true);
//                                     // console.log(args.index);
//                                     setIndexDataJurnal(args.index);
//                                 }}
//                                 style={{ backgroundColor: '#3b3f5c' }}
//                             />
//                         </span>
//                     </div>
//                 </TooltipComponent>
//             </div>
//         );
//     };

//     const editTemplateSubLedger = (args: any) => {
//         return (
//             <div>
//                 <TooltipComponent content="Daftar Customer" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
//                     <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
//                         <TextBoxComponent id="noCust" name="noCust" className="noCust" value={args.nama_relasi} readOnly={true} showClearButton={false} />
//                         <span>
//                             <ButtonComponent
//                                 id="buNoItem1"
//                                 type="button" //Solusi tdk refresh halaman saat selesai onClick
//                                 cssClass="e-primary e-small e-round"
//                                 iconCss="e-icons e-small e-search"
//                                 onClick={() => {
//                                     // console.log('ICO only');
//                                     // setModalCust(true);
//                                     const value: any = args.value;
//                                     // console.log('on Input');
//                                     setTagCustomer('Detail');
//                                     HandleModalChange(value, 'customerSubsidi', setChangeNumber, setHandleNamaCust, setModalCust);
//                                 }}
//                                 style={{ backgroundColor: '#3b3f5c' }}
//                             />
//                         </span>
//                     </div>
//                 </TooltipComponent>
//             </div>
//         );
//     };

//     const editTemplateDepartemen = (args: any) => {
//         return (
//             <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
//                 {/* <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.departemen} readOnly={true} showClearButton={false} /> */}
//                 <DropDownListComponent
//                     id="dept"
//                     name="dept"
//                     dataSource={listDepartemen}
//                     fields={{ value: 'dept_ku2', text: `dept_ku` }}
//                     floatLabelType="Never"
//                     placeholder={args.departemen}
//                     onChange={(e: any) => {
//                         // console.log(e);
//                         gridJurnalDetail.dataSource[args.index] = { ...gridJurnalDetail.dataSource[args.index], kode_dept: e.value.split(/\*/)[0], departemen: e.value.split(/\*/)[1] };
//                         gridJurnalDetail.refresh();
//                         // console.log(gridJurnalDetail.dataSource[args.index]);
//                     }}
//                 />
//             </div>
//         );
//     };

//     const AutoJurnalAntarCabang = async () => {
//         const combinedArray = [];
//         const result = await fetchPreferensi(kode_entitas, apiUrl);
//         // console.log(result[0].kode_akun_persediaan);

//         // Pos Piutang dalam penyelesaian
//         const quJurnalkode_akun = result[0].kode_akun_penjualan_cabang;
//         const quJurnalno_akun = result[0].no_penjualan_cabang;
//         const quJurnalnama_akun = result[0].nama_penjualan_cabang;

//         let quJurnalkode_subledger, quJurnalnama_subledger;
//         await SimpanLeger(quMMKkode_cust).then((result) => {
//             quJurnalkode_subledger = quMMKkode_cust;
//             quJurnalnama_subledger = result[0].subledger;
//         });

//         const quJurnaldebet_rp = quMMKnetto_mu + quMMKdiskon_dok_mu + quMMKtotal_diskon_mu - quMMKtotal_pajak_mu;
//         const quJurnaljumlah_rp = quJurnaldebet_rp;
//         const quJurnaltgl_dokumen = quMMKtgl_mk;
//         const quJurnaljumlah_mu = quJurnaljumlah_rp * quMMKkurs;
//         const quJurnalcatatan = 'Piutang Dalam Penyelesaian No. MK: ' + quMMKno_mk;

//         let i = 1; // id_dokumen
//         const detailJurnalPiutangDalamPenyelesaian = {
//             kode_dokumen: '',
//             id_dokumen: i,
//             dokumen: 'MK',
//             tgl_dokumen: quJurnaltgl_dokumen,
//             kode_akun: quJurnalkode_akun,
//             kode_subledger: quJurnalkode_subledger,
//             kurs: quMMKkurs,
//             debet_rp: quJurnaldebet_rp,
//             kredit_rp: 0,
//             jumlah_rp: quJurnaljumlah_rp,
//             jumlah_mu: quJurnaljumlah_mu,
//             catatan: quJurnalcatatan,
//             no_warkat: '',
//             tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//             persen: 0,
//             kode_dept: '',
//             kode_kerja: '',
//             approval: '',
//             posting: '',
//             rekonsiliasi: '',
//             tgl_rekonsil: '',
//             userid: userid,
//             tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//             audit: '',
//             kode_kry: '',
//             kode_jual: divisiPenjualan,
//             no_kontrak_um: '',
//             no_akun: quJurnalno_akun,
//             nama_akun: quJurnalnama_akun,
//             tipe: '',
//             kode_mu: quMMKkode_mu,
//             nama_dept: '',
//             nama_kerja: '',
//             no_subledger: '',
//             nama_subledger: quJurnalnama_subledger,
//             isledger: '',
//         };

//         combinedArray.push(detailJurnalPiutangDalamPenyelesaian);
//         // setDataJurnal((state: any) => ({
//         //     ...state,
//         //     nodes: state.nodes.concat(detailJurnalBaru),
//         // }));

//         i++;

//         //Piutang Antar Cabang
//         const response = await axios.get(`${apiUrl}/erp/akun_antar_cabang?`, {
//             params: {
//                 entitas: kode_entitas,
//                 param1: quMMKkode_cust,
//             },
//         });
//         const responseData = response.data.data;
//         // return responseData.map((item: any) => ({
//         //     ...item,
//         //     quJurnalKode_akun_piutang: item.Kode_akun_piutang,
//         //     quJurnalNo_piutang: item.No_piutang,
//         //     quJurnalNama_Piutang: item.Nama_Piutang,
//         // }));

//         const quJurnalkode_akunPiutang = responseData[0].Kode_akun_piutang;
//         const quJurnalno_akunPiutang = responseData[0].No_piutang;
//         const quJurnalnama_akunPiutang = responseData[0].quJurnalNama_Piutang;
//         const qujurnalcatatanPiutang = 'Piutang Antar Cabang No. MK: ' + quMMKno_mk;

//         let quJurnalkode_subledgerPiutang, quJurnalnama_subledgerPiutang;
//         await SimpanLeger(quMMKkode_cust).then((result) => {
//             quJurnalkode_subledgerPiutang = quMMKkode_cust;
//             quJurnalnama_subledgerPiutang = result[0].subledger;
//         });

//         const quJurnalkredit_rpPiutang = quMMKnetto_mu + quMMKdiskon_dok_mu + quMMKtotal_diskon_mu - quMMKtotal_pajak_mu;
//         const quJurnaljumlah_rpPiutang = -quJurnalkredit_rpPiutang;
//         const quJurnaltgl_dokumenPiutang = quMMKtgl_mk;
//         const quJurnaljumlah_muPiutang = quJurnaljumlah_rpPiutang * quMMKkurs;

//         const detailJurnalPiutangAntarCabang = {
//             kode_dokumen: '',
//             id_dokumen: i,
//             dokumen: 'MK',
//             tgl_dokumen: quJurnaltgl_dokumenPiutang,
//             kode_akun: quJurnalkode_akunPiutang,
//             kode_subledger: quJurnalkode_subledgerPiutang,
//             kurs: quMMKkurs,
//             debet_rp: 0,
//             kredit_rp: quJurnalkredit_rpPiutang,
//             jumlah_rp: quJurnaljumlah_rpPiutang,
//             jumlah_mu: quJurnaljumlah_muPiutang,
//             catatan: qujurnalcatatanPiutang,
//             no_warkat: '',
//             tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//             persen: 0,
//             kode_dept: '',
//             kode_kerja: '',
//             approval: '',
//             posting: '',
//             rekonsiliasi: '',
//             tgl_rekonsil: '',
//             userid: userid,
//             tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//             audit: '',
//             kode_kry: '',
//             kode_jual: divisiPenjualan,
//             no_kontrak_um: '',
//             no_akun: quJurnalno_akunPiutang,
//             nama_akun: quJurnalnama_akunPiutang,
//             tipe: 'quJurnaltipe',
//             kode_mu: '',
//             nama_dept: '',
//             nama_kerja: '',
//             no_subledger: '',
//             nama_subledger: quJurnalnama_subledgerPiutang,
//             isledger: '',
//         };
//         combinedArray.push(detailJurnalPiutangAntarCabang);
//         // setDataJurnal((state: any) => ({
//         //     ...state,
//         //     nodes: state.nodes.concat(detailJurnalBaruPiutang),
//         // }));
//         i++;

//         setDataJurnal({ nodes: combinedArray });
//         // setDataJurnal(combinedArray);
//     };

//     const SimpanLeger = async (kodeCust: any) => {
//         const response = await axios.get(`${apiUrl}/erp/get_nama_ledger?`, {
//             params: {
//                 entitas: kode_entitas,
//                 param1: kodeCust,
//             },
//         });
//         const responseData = response.data.data;
//         return responseData.map((item: any) => ({
//             ...item,
//             quJurnalnama_subledger: item.subledger,
//         }));
//     };

//     const autoJurnal = async () => {
//         try {
//             if (dataBarang.nodes.length > 0) {
//                 recalc();
//                 if (quMMKtipe === 'Cabang') {
//                     AutoJurnalAntarCabang;
//                 } else {
//                     const combinedArray = [];
//                     let Journal = true;
//                     let ID_jurnal = 0;
//                     let value1 = 0;
//                     //    thppj := 0;
//                     let Total = 0;
//                     const dataObjek: any = dataBarang.nodes;
//                     //   DeleteAllRecord(Qujurnal);
//                     value1 = dataObjek.reduce((total: number, node: any) => {
//                         return total + node.jumlah_mu;
//                     }, 0);

//                     const result = await fetchPreferensi(kode_entitas, apiUrl);
//                     // console.log(result[0].kode_akun_persediaan);

//                     // Jurnal Retur Penjualan (D)
//                     const quJurnalkode_akun = result[0].kode_akun_retjual;
//                     const quJurnalno_akun = result[0].no_retjual;
//                     const quJurnalnama_akun = result[0].nama_retjual;
//                     const quJurnaltipe = result[0].tipe_retjual;
//                     const quJurnalcatatan = 'Retur Faktur No. ' + quMMKno_reff + ' (' + quMMKnama_relasi + ')';
//                     const quJurnaltgl_dokumen = quMMKtgl_mk;
//                     const quJurnaldebet_rp = quMMKnetto_mu + quMMKdiskon_dok_mu + quMMKtotal_diskon_mu - quMMKtotal_pajak_mu;
//                     const quJurnaljumlah_rp = quJurnaldebet_rp;
//                     const quJurnaljumlah_mu = quJurnaljumlah_rp * quMMKkurs;
//                     // const totalLine = gridJurnalDetail.dataSource.length;

//                     let i = 1; // id_dokumen
//                     const detailJurnalBaru = {
//                         kode_dokumen: '',
//                         id_dokumen: i,
//                         dokumen: 'MK',
//                         tgl_dokumen: quJurnaltgl_dokumen,
//                         kode_akun: quJurnalkode_akun,
//                         kode_subledger: '',
//                         kurs: quMMKkurs,
//                         debet_rp: quJurnaldebet_rp,
//                         kredit_rp: 0,
//                         jumlah_rp: quJurnaljumlah_rp,
//                         jumlah_mu: quJurnaljumlah_mu,
//                         catatan: quJurnalcatatan,
//                         no_warkat: '',
//                         tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                         persen: 0,
//                         kode_dept: '',
//                         kode_kerja: '',
//                         approval: '',
//                         posting: '',
//                         rekonsiliasi: '',
//                         tgl_rekonsil: '',
//                         userid: userid,
//                         tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                         audit: '',
//                         kode_kry: '',
//                         kode_jual: divisiPenjualan,
//                         no_kontrak_um: '',
//                         no_akun: quJurnalno_akun,
//                         nama_akun: quJurnalnama_akun,
//                         tipe: quJurnaltipe,
//                         kode_mu: quMMKkode_mu,
//                         nama_dept: '',
//                         nama_kerja: '',
//                         no_subledger: '',
//                         nama_subledger: '',
//                         isledger: '',
//                     };
//                     combinedArray.push(detailJurnalBaru);
//                     // setDataJurnal((state: any) => ({
//                     //     ...state,
//                     //     nodes: state.nodes.concat(detailJurnalBaru),
//                     // }));
//                     // console.log(dataJurnal);
//                     // gridJurnalDetail.dataSource = dataJurnal;
//                     // console.log(gridJurnalDetail.dataSource);

//                     i++;
//                     // console.log('i ', i);

//                     let IsTunai = false;
//                     const kode_FT = quMMKkode_fj.substring(0, 2);
//                     // console.log('kode_FT ', kode_FT);
//                     if (kode_FT === 'FT') {
//                         const cekIsTunai = await axios.get(`${apiUrl}/erp/cek_is_tunai?`, {
//                             params: {
//                                 entitas: kode_entitas,
//                                 param1: quMMKkode_fj,
//                             },
//                         });
//                         const vCekIsTunai = cekIsTunai.data.data[0].lunas;
//                         // console.log('vCekIsTunai ', vCekIsTunai);
//                         if (vCekIsTunai === 'Y') {
//                             // console.log('true');
//                             IsTunai = true;
//                         } else {
//                             // console.log('false');
//                             IsTunai = false;
//                         }
//                     }

//                     let detailJurnalPiutangDagang: any;
//                     // Jurnal Piutang Dagang (K)
//                     if (quMMKnetto_mu > 0) {
//                         let quJurnalkode_subledger: any, quJurnalno_subledger: any, quJurnalnama_subledger: any;
//                         let quJurnaltgl_dokumen, quJurnalkredit_rp, quJurnaljumlah_rp, quJurnaljumlah_mu, Total;
//                         let quJurnalkode_akun, quJurnalno_akun, quJurnalnama_akun, quJurnaltipe, quJurnalcatatan;
//                         if (IsTunai) {
//                             quJurnalkode_akun = result[0].kode_akun_kas;
//                             quJurnalno_akun = result[0].no_kas;
//                             quJurnalnama_akun = result[0].nama_kas;
//                             quJurnaltipe = result[0].tipe_kas;
//                             quJurnalcatatan = 'Pengeluaran Retur Tunai ' + quMMKnama_relasi + ', No. MK : ' + quMMKno_mk + ' atas Faktur No. ' + quMMKno_reff;
//                         } else {
//                             quJurnalkode_akun = result[0].kode_akun_piutang;
//                             quJurnalno_akun = result[0].no_piutang;
//                             quJurnalnama_akun = result[0].nama_piutang;
//                             quJurnaltipe = result[0].tipe_piutang;
//                             quJurnalcatatan = 'Pengurangan Piutang ' + quMMKnama_relasi + ', No. MK : ' + quMMKno_mk + ' atas Faktur No. ' + quMMKno_reff;
//                         }

//                         if (quJurnaltipe === 'piutang' || quJurnaltipe === 'piutang jangka panjang' || quJurnaltipe === 'piutang lancar lainnya') {
//                             quJurnalkode_subledger = quMMKkode_cust;
//                             quJurnalno_subledger = quMMKno_cust;
//                             quJurnalnama_subledger = quMMKnama_relasi;
//                         }

//                         quJurnaltgl_dokumen = quMMKtgl_mk;
//                         quJurnalkredit_rp = quMMKnetto_mu;
//                         Total = quJurnalkredit_rp;
//                         quJurnaljumlah_rp = -quJurnalkredit_rp;
//                         quJurnaljumlah_mu = quJurnaljumlah_rp * quMMKkurs;

//                         await SimpanLeger(quMMKkode_cust).then((result) => {
//                             quJurnalkode_subledger = quMMKkode_cust;
//                             quJurnalnama_subledger = result[0].subledger;
//                             // console.log('result ', result);
//                         });

//                         detailJurnalPiutangDagang = {
//                             kode_dokumen: '',
//                             id_dokumen: i,
//                             dokumen: 'MK',
//                             tgl_dokumen: quJurnaltgl_dokumen,
//                             kode_akun: quJurnalkode_akun,
//                             kode_subledger: quJurnalkode_subledger,
//                             kurs: quMMKkurs,
//                             debet_rp: 0,
//                             kredit_rp: quJurnalkredit_rp,
//                             jumlah_rp: quJurnaljumlah_rp,
//                             jumlah_mu: quJurnaljumlah_mu,
//                             catatan: quJurnalcatatan,
//                             no_warkat: '',
//                             tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             persen: 0,
//                             kode_dept: '',
//                             kode_kerja: '',
//                             approval: '',
//                             posting: '',
//                             rekonsiliasi: '',
//                             tgl_rekonsil: '',
//                             userid: userid,
//                             tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             audit: '',
//                             kode_kry: '',
//                             kode_jual: divisiPenjualan,
//                             no_kontrak_um: '',
//                             no_akun: quJurnalno_akun,
//                             nama_akun: quJurnalnama_akun,
//                             tipe: quJurnaltipe,
//                             kode_mu: quMMKkode_mu,
//                             nama_dept: '',
//                             nama_kerja: '',
//                             no_subledger: quJurnalno_subledger,
//                             nama_subledger: quJurnalnama_subledger,
//                             isledger: '',
//                         };
//                         combinedArray.push(detailJurnalPiutangDagang);
//                         // setDataJurnal((state: any) => ({
//                         //     ...state,
//                         //     nodes: state.nodes.concat(detailJurnalPiutangDagang),
//                         // }));
//                         // console.log(dataJurnal);
//                         i++;
//                     }

//                     // Jurnal Diskon atau Potongan (K)
//                     let detailJurnalDiskonPotongan: any;
//                     if (quMMKtotal_diskon_mu > 0) {
//                         const quJurnalkode_akun = result[0].kode_akun_diskon_item;
//                         const quJurnalno_akun = result[0].no_diskon_item;
//                         const quJurnalnama_akun = result[0].nama_diskon_item;
//                         const quJurnaltgl_dokumen = quMMKtgl_mk;
//                         const quJurnalkredit_rp = quMMKtotal_diskon_mu;
//                         const quJurnaljumlah_rp = quMMKtotal_diskon_mu * -1;
//                         const quJurnaljumlah_mu = quJurnaljumlah_rp;
//                         const quJurnalcatatan = 'Potongan Penjualan';

//                         detailJurnalDiskonPotongan = {
//                             kode_dokumen: '',
//                             id_dokumen: i,
//                             dokumen: 'MK',
//                             tgl_dokumen: quJurnaltgl_dokumen,
//                             kode_akun: quJurnalkode_akun,
//                             kode_subledger: '',
//                             kurs: quMMKkurs,
//                             debet_rp: 0,
//                             kredit_rp: quJurnalkredit_rp,
//                             jumlah_rp: quJurnaljumlah_rp,
//                             jumlah_mu: quJurnaljumlah_mu,
//                             catatan: quJurnalcatatan,
//                             no_warkat: '',
//                             tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             persen: 0,
//                             kode_dept: '',
//                             kode_kerja: '',
//                             approval: '',
//                             posting: '',
//                             rekonsiliasi: '',
//                             tgl_rekonsil: '',
//                             userid: userid,
//                             tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             audit: '',
//                             kode_kry: '',
//                             kode_jual: divisiPenjualan,
//                             no_kontrak_um: '',
//                             no_akun: quJurnalno_akun,
//                             nama_akun: quJurnalnama_akun,
//                             tipe: quJurnaltipe,
//                             kode_mu: quMMKkode_mu,
//                             nama_dept: '',
//                             nama_kerja: '',
//                             no_subledger: '',
//                             nama_subledger: '',
//                             isledger: '',
//                         };
//                         combinedArray.push(detailJurnalDiskonPotongan);
//                         // gridJurnalDetail.dataSource[0] = detailJurnalBaru;
//                         // await setDataJurnal((state: any) => ({
//                         //     ...state,
//                         //     nodes: state.nodes.concat(detailJurnalBaru),
//                         // }));
//                         // console.log(gridJurnalDetail.dataSource);
//                         i++;
//                     }

//                     // Jurnal Diskon atau Potongan Langsung (K)
//                     let detailJurnalDiskonPotonganLangsung: any;
//                     if (quMMKdiskon_dok_mu > 0) {
//                         const quJurnalkode_akun = result[0].kode_akun_diskon_jual;
//                         const quJurnalno_akun = result[0].no_diskon_jual;
//                         const quJurnalnama_akun = result[0].nama_diskon_jual;

//                         const quJurnaltgl_dokumen = quMMKtgl_mk;
//                         const quJurnalkredit_rp = quMMKdiskon_dok_mu;
//                         const quJurnaljumlah_rp = quMMKdiskon_dok_mu * -1;
//                         const quJurnaljumlah_mu = quJurnaljumlah_rp;
//                         const quJurnalcatatan = 'Potongan Penjualan Langsung';

//                         detailJurnalDiskonPotonganLangsung = {
//                             kode_dokumen: '',
//                             id_dokumen: i,
//                             dokumen: 'MK',
//                             tgl_dokumen: quJurnaltgl_dokumen,
//                             kode_akun: quJurnalkode_akun,
//                             kode_subledger: '',
//                             kurs: quMMKkurs,
//                             debet_rp: 0,
//                             kredit_rp: quJurnalkredit_rp,
//                             jumlah_rp: quJurnaljumlah_rp,
//                             jumlah_mu: quJurnaljumlah_mu,
//                             catatan: quJurnalcatatan,
//                             no_warkat: '',
//                             tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             persen: 0,
//                             kode_dept: '',
//                             kode_kerja: '',
//                             approval: '',
//                             posting: '',
//                             rekonsiliasi: '',
//                             tgl_rekonsil: '',
//                             userid: userid,
//                             tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             audit: '',
//                             kode_kry: '',
//                             kode_jual: divisiPenjualan,
//                             no_kontrak_um: '',
//                             no_akun: quJurnalno_akun,
//                             nama_akun: quJurnalnama_akun,
//                             tipe: quJurnaltipe,
//                             kode_mu: quMMKkode_mu,
//                             nama_dept: '',
//                             nama_kerja: '',
//                             no_subledger: '',
//                             nama_subledger: '',
//                             isledger: '',
//                         };
//                         combinedArray.push(detailJurnalDiskonPotonganLangsung);
//                         // gridJurnalDetail.dataSource[0] = detailJurnalBaru;
//                         // await setDataJurnal((state: any) => ({
//                         //     ...state,
//                         //     nodes: state.nodes.concat(detailJurnalBaru),
//                         // }));
//                         // console.log(gridJurnalDetail.dataSource);
//                         i++;
//                     }

//                     // Jurnal Pajak (D)
//                     let detailJurnalPajak: any;
//                     const cekAkunPajak = await axios.get(`${apiUrl}/erp/cek_akun_pajak?`, {
//                         params: {
//                             entitas: kode_entitas,
//                             param1: quMMKkode_pajak,
//                         },
//                     });
//                     const vCekAkunPajak = cekAkunPajak.data.data[0].kode_akun;
//                     // console.log(vCekAkunPajak);
//                     if (vCekAkunPajak === '' || vCekAkunPajak === null) {
//                     } else {
//                         // console.log('masuk mas brooooooooooo');
//                         const quJurnalkode_akun = result[0].kode_akun;
//                         const quJurnalno_akun = result[0].no_akun;
//                         const quJurnalnama_akun = result[0].nama_akun;
//                         const quJurnaltipe = result[0].tipe;

//                         const quJurnaldebet_rp = quMMKtotal_pajak_mu;
//                         const quJurnaljumlah_rp = quJurnaldebet_rp;
//                         const quJurnaljumlah_mu = quJurnaljumlah_rp;
//                         const quJurnalcatatan = 'Pajak ' + 'No. MK : ' + quMMKno_mk + ' atas Faktur No : ' + quMMKno_fj;

//                         detailJurnalPajak = {
//                             kode_dokumen: '',
//                             id_dokumen: i,
//                             dokumen: 'MK',
//                             tgl_dokumen: quJurnaltgl_dokumen,
//                             kode_akun: quJurnalkode_akun,
//                             kode_subledger: '',
//                             kurs: quMMKkurs,
//                             debet_rp: quJurnaldebet_rp,
//                             kredit_rp: 0,
//                             jumlah_rp: quJurnaljumlah_rp,
//                             jumlah_mu: quJurnaljumlah_mu,
//                             catatan: quJurnalcatatan,
//                             no_warkat: '',
//                             tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             persen: 0,
//                             kode_dept: '',
//                             kode_kerja: '',
//                             approval: '',
//                             posting: '',
//                             rekonsiliasi: '',
//                             tgl_rekonsil: '',
//                             userid: userid,
//                             tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
//                             audit: '',
//                             kode_kry: '',
//                             kode_jual: divisiPenjualan,
//                             no_kontrak_um: '',
//                             no_akun: quJurnalno_akun,
//                             nama_akun: quJurnalnama_akun,
//                             tipe: quJurnaltipe,
//                             kode_mu: quMMKkode_mu,
//                             nama_dept: '',
//                             nama_kerja: '',
//                             no_subledger: '',
//                             nama_subledger: '',
//                             isledger: '',
//                         };
//                         combinedArray.push(detailJurnalPajak);
//                         // gridJurnalDetail.dataSource[0] = detailJurnalBaru;
//                         // setDataJurnal((state: any) => ({
//                         //     ...state,
//                         //     nodes: state.nodes.concat(detailJurnalBaru),
//                         // }));
//                         // console.log(gridJurnalDetail.dataSource);
//                         i++;
//                     }

//                     Journal = false;
//                     const NetDokumen = quMMKnetto_mu;
//                     // console.log('combinedArray ', combinedArray);
//                     // setDataJurnal({ nodes: combinedArray });
//                     gridJurnalDetail.dataSource = combinedArray;
//                     // gridJurnalDetail.refresh();
//                     await ReCalcJournal(combinedArray);
//                 }
//             } else {
//                 myAlert('Data Barang masih kosong');
//             }
//         } catch (error) {
//             console.error('Terjadi kesalahan:', error);
//         }
//     };

//     const ReCalcJournal = async (dataObjek: any) => {
//         TotDebet = dataObjek.reduce((total: number, node: any) => {
//             return total + node.debet_rp;
//         }, 0);
//         TotKredit = dataObjek.reduce((total: number, node: any) => {
//             return total + node.kredit_rp;
//         }, 0);
//         selisih = TotDebet - TotKredit;
//         setTotalDebit(TotDebet);
//         setTotalKredit(TotKredit);
//     };

//     const rowSelectingDetailJurnal = (args: any) => {
//         setSelectedRowIndex(args.rowIndex);
//         // console.log(args.rowIndex);
//     };

//     const rowSelectingDialogAkun = (args: any) => {
//         // setSelectedRowIndex(args.rowIndex);
//         setSelectedAkunJurnal(args.data);
//         // console.log(args.rowIndex);
//     };

//     const actionBeginDetailJurnal = async (args: any) => {
//         if (args.requestType === 'beginEdit') {
//             if (args.rowData.debet_rp === 0) {
//                 statusNolJurnal = 'Debit';
//             } else if (args.rowData.kredit_rp === 0) {
//                 statusNolJurnal = 'Kredit';
//             }
//         }
//     };

//     const actionCompleteDetailJurnal = async (args: any) => {
//         let index = args.rowIndex;
//         switch (args.requestType) {
//             case 'save':
//                 // console.log(args.rowData);
//                 let editedData;
//                 // console.log(statusNolJurnal);
//                 // console.log(gridJurnalDetail.dataSource[index]?.debet_rp);
//                 if (statusNolJurnal === 'Debit' && gridJurnalDetail.dataSource[index]?.debet_rp !== 0) {
//                     editedData = { ...args.data, kredit_rp: 0 };
//                     gridJurnalDetail.dataSource[index] = editedData;
//                 } else if (statusNolJurnal === 'Kredit' && gridJurnalDetail.dataSource[index]?.kredit_rp !== 0) {
//                     editedData = { ...args.data, debet_rp: 0 };
//                     gridJurnalDetail.dataSource[index] = editedData;
//                 }
//                 // console.log(args);
//                 // kalkulasiJurnal();
//                 gridJurnalDetail.refresh();
//                 ReCalcJournal(gridJurnalDetail.dataSource);
//                 break;
//             case 'beginEdit':
//                 // console.log('EDIT');
//                 // kalkulasiJurnal();
//                 ReCalcJournal(gridJurnalDetail.dataSource);
//                 break;
//             case 'delete':
//                 break;
//             case 'refresh':
//                 // console.log('REFRESH');
//                 // kalkulasiJurnal();
//                 ReCalcJournal(gridJurnalDetail.dataSource);
//                 break;
//             default:
//                 break;
//         }
//         // console.log('COMPLETED :' + args.requestType);
//     };

//     const DetailBarangDeleteAllJurnal = () => {
//         withReactContent(Swal)
//             .fire({
//                 // icon: 'warning',
//                 html: 'Hapus semua data jurnal?',
//                 width: '15%',
//                 target: '#frmMk',
//                 showCancelButton: true,
//                 confirmButtonText: '<p style="font-size:10px">Ya</p>',
//                 cancelButtonText: '<p style="font-size:10px">Tidak</p>',
//             })
//             .then((result) => {
//                 if (result.isConfirmed) {
//                     // setDataJurnal({ nodes: [] });
//                     //tambah warning alert konfirmasi delete all
//                     // gridMBList.refresh();
//                     gridJurnalDetail.dataSource = [];
//                     // gridMBList.refresh();
//                 } else {
//                     console.log('cancel');
//                 }
//             });
//     };

//     const DeleteDetailJurnal: any = () => {
//         withReactContent(Swal)
//             .fire({
//                 // icon: 'warning',
//                 html: `Hapus data barang baris ${selectedRowIndexJurnal + 1}?`,
//                 width: '15%',
//                 target: '#frmMk',
//                 showCancelButton: true,
//                 confirmButtonText: '<p style="font-size:10px">Ya</p>',
//                 cancelButtonText: '<p style="font-size:10px">Tidak</p>',
//             })
//             .then((result) => {
//                 if (result.isConfirmed) {
//                     // console.log(selectedRowIndexJurnal);
//                     gridJurnalDetail.dataSource.splice(selectedRowIndexJurnal, 1);
//                     gridJurnalDetail.dataSource.forEach((item: any, index: any) => {
//                         item.id_mk = index + 1;
//                     });
//                     gridJurnalDetail.refresh();
//                 } else {
//                     // console.log('cancel');
//                 }
//             });
//     };

//     return (
//         <div>
//             <DialogComponent
//                 ref={(d: any) => (frmDlgAkunJurnal = d)}
//                 id="frmDlgAkunJurnal"
//                 target="#frmMk"
//                 style={{ position: 'fixed' }}
//                 header={'Daftar Akun'}
//                 visible={modalAkunJurnal}
//                 isModal={true}
//                 animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
//                 allowDragging={true}
//                 showCloseIcon={true}
//                 // width="84%"
//                 // height="85%"
//                 width="425"
//                 height="450"
//                 // buttons={buttonDlgTtbMk}
//                 position={{ X: 'center', Y: 'center' }}
//                 closeOnEscape={true}
//                 close={() => {
//                     setModalAkunJurnal(false);
//                     setSearchNoAkun('');
//                     setSearchNamaAkun('');
//                 }}
//             >
//                 <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
//                     <TextBoxComponent
//                         id="searchNoAkun"
//                         name="searchNoAkun"
//                         className="searchNoAkun"
//                         placeholder="<No. Akun>"
//                         showClearButton={true}
//                         value={searchNoAkun}
//                         input={(args: FocusInEventArgs) => {
//                             (document.getElementsByName('searchNamaAkun')[0] as HTMLFormElement).value = '';
//                             setSearchNamaAkun('');
//                             const value: any = args.value;
//                             setSearchNoAkun(value);
//                         }}
//                     />
//                 </div>
//                 <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
//                     <TextBoxComponent
//                         id="searchNamaAkun"
//                         name="searchNamaAkun"
//                         className="searchNamaAkun"
//                         placeholder="<Nama Akun>"
//                         showClearButton={true}
//                         value={searchNamaAkun}
//                         input={(args: FocusInEventArgs) => {
//                             (document.getElementsByName('searchNoAkun')[0] as HTMLFormElement).value = '';
//                             setSearchNoAkun('');
//                             const value: any = args.value;
//                             setSearchNamaAkun(value);
//                         }}
//                     />
//                 </div>
//                 <GridComponent
//                     id="dgDlgAkunJurnal"
//                     locale="id"
//                     ref={(g: any) => (dgDlgAkunJurnal = g)}
//                     dataSource={listAkunJurnal}
//                     selectionSettings={{ mode: 'Row', type: 'Single' }}
//                     rowHeight={22}
//                     width={'100%'}
//                     height={'267'}
//                     // gridLines={'Both'}
//                     // loadingIndicator={{ indicatorType: 'Shimmer' }}
//                     rowSelecting={(args: any) => {
//                         // console.log(args.data);
//                         setSelectedAkunJurnal(args.data);
//                         // setSelectedRowIndex(args.rowIndex);
//                     }}
//                     // rowSelecting={rowSelectingDialogAkun}
//                     recordDoubleClick={(args: any) => {
//                         if (args.rowData.header === 'Y') {
//                             setModalAkunJurnal(false);
//                             myAlert(`No. Akun ${args.rowData.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi.`);
//                         } else {
//                             if (dgDlgAkunJurnal) {
//                                 const rowIndex: number = args.row.rowIndex;
//                                 const selectedItems = args.rowData;
//                                 dgDlgAkunJurnal.selectRow(rowIndex);
//                                 setSelectedAkunJurnal(selectedItems);
//                                 getFromModalAkunJurnal();
//                             }
//                         }
//                     }}
//                 >
//                     <ColumnsDirective>
//                         <ColumnDirective
//                             // template={(args: any) => TemplateNoAkun(args)}
//                             field="no_akun"
//                             headerText="No. Akun"
//                             headerTextAlign="Center"
//                             textAlign="Left"
//                             width="30"
//                             clipMode="EllipsisWithTooltip"
//                             template={templateNoAkun}
//                         />
//                         <ColumnDirective
//                             // template={(args: any) => TemplateNamaAkun(args)}
//                             field="nama_akun"
//                             headerText="Keterangan"
//                             headerTextAlign="Center"
//                             textAlign="Left"
//                             width="60"
//                             clipMode="EllipsisWithTooltip"
//                             template={templateNamaAkun}
//                         />
//                     </ColumnsDirective>
//                     <Inject services={[Selection]} />
//                 </GridComponent>
//                 <ButtonComponent
//                     id="buBatalDokumen1"
//                     content="Batal"
//                     cssClass="e-primary e-small"
//                     // iconCss="e-icons e-small e-close"
//                     style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
//                     onClick={() => {
//                         setModalAkunJurnal(false);
//                         setSearchNoAkun('');
//                         setSearchNamaAkun('');
//                     }}
//                 />
//                 <ButtonComponent
//                     id="buSimpanDokumen1"
//                     content="Pilih"
//                     cssClass="e-primary e-small"
//                     // iconCss="e-icons e-small e-save"
//                     style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
//                     onClick={() => {
//                         if (selectedAkunJurnal) {
//                             // console.log(selectedAkunJurnal);
//                             setModalAkunJurnal(false);
//                             const editedData = {
//                                 ...gridJurnalDetail.dataSource[indexDataJurnal],
//                                 kode_akun: selectedAkunJurnal.kode_akun,
//                                 no_akun: selectedAkunJurnal.no_akun,
//                                 nama_akun: selectedAkunJurnal.nama_akun,
//                                 tipe: selectedAkunJurnal.tipe,
//                             };
//                             gridJurnalDetail.dataSource[indexDataJurnal] = editedData;
//                             gridJurnalDetail.refresh();
//                         } else {
//                             myAlert(`Silahkan pilih akun terlebih dulu.`);
//                         }
//                     }}
//                 />
//             </DialogComponent>
//         </div>
//     );
// };

// export default FrmDlgAkunJurnal;

import React from 'react';

const frmDlgAkunJurnal = () => {
    return <div>frmDlgAkunJurnal</div>;
};

export default frmDlgAkunJurnal;
