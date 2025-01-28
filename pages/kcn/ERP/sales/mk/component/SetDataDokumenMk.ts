import moment from 'moment';
import { GetPeriode } from '../model/api';
import withReactContent from 'sweetalert2-react-content';
import styles from '../mklist.module.css';
import { swalToast, ButtonUbah, ButtonDetailDok, ListDetailDok, OnClick_CetakFormMk } from './fungsiFrmMkList';

// const SetDataDokumenMk = async (tipe: string, selectedRowKodeMk: string, kode_entitas: string, dataDetailDokMk: any, router: any, setSelectedItem: Function, setDetailDok: Function) => {
//     if (selectedRowKodeMk !== '') {
//         if (tipe === 'ubah') {
//             const responseData: any[] = await GetPeriode(kode_entitas);
//             const periode = responseData[0].periode;
//             const tanggalMomentPeriode = moment(periode, 'YYYYMM');
//             const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

//             const tglPembanding = moment(c.tgl_ttb).format('YYYYMM');

//             // Mendapatkan tahun dan bulan dari setiap tanggal
//             const yearA = parseInt(periodeTahunBulan.substring(0, 4));
//             const monthA = parseInt(periodeTahunBulan.substring(4, 6));

//             const yearB = parseInt(tglPembanding.substring(0, 4));
//             const monthB = parseInt(tglPembanding.substring(4, 6));

//             if (yearB < yearA || (yearB === yearA && monthB < monthA)) {
//                 withReactContent(swalToast).fire({
//                     icon: 'warning',
//                     title: '<p style="font-size:12px; color:white">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
//                     width: '100%',
//                     customClass: {
//                         popup: styles['colored-popup'], // Custom class untuk sweetalert
//                     },
//                 });
//             } else {
//                 const result = ButtonUbah(selectedRowKodeMk, 'Ubah');
//                 router.push({ pathname: './ttb', query: { str: result } });
//             }
//         } else if (tipe === 'detailDok') {
//             const result = ButtonDetailDok(selectedRowKodeMk);
//             setSelectedItem(result);
//             ListDetailDok(result, kode_entitas, setDetailDok);
//         } else if (tipe === 'cetak') {
//             OnClick_CetakFormMk(selectedRowKodeMk, kode_entitas);
//         }
//     } else {
//         // swal.fire({
//         //     title: 'Pilih Data terlebih dahulu.',
//         //     icon: 'error',
//         //     timer: 2000,
//         //     showConfirmButton: false,
//         // });
//         withReactContent(swalToast).fire({
//             icon: 'warning',
//             title: '<p style="font-size:12px; color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
//             width: '100%',
//             customClass: {
//                 popup: styles['colored-popup'], // Custom class untuk sweetalert
//             },
//         });
//     }
// };
