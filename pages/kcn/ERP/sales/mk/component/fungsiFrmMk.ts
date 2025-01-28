import swal from 'sweetalert2';
import { frmNumber } from '@/utils/routines';
import { useRouter } from 'next/router';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

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
const HandleModaliconChange = async (tipe: string, dataDetail: any, dataText: any, setModal: Function) => {
    if (tipe === 'customer') {
        const cekNoItem = dataDetail.nodes.some((row: { no_item: string }) => row.no_item === '');
        // console.log(cekNoSj);
        if (dataDetail.nodes.length <= 0 || cekNoItem === true) {
            // setHandleNamaCust('');
            setModal(true);
        } else {
            withReactContent(swalDialog).fire({
                icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>Data MK telah terisi dengan Customer ${dataText} Untuk mengganti customer, kosongkan data TTB terlebih dahulu</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        }
    } else if (tipe === 'fj') {
        // console.log('dataText ', dataText);
        if (dataText !== '') {
            // setHandleNamaCust('');
            setModal(true);
        } else {
            withReactContent(Swal)
                .fire({
                    // icon: 'error',
                    title: `<span style='color: gray; font-weight: bold;'>Customer belum diisi.</span>`,
                    width: '20%',
                    target: '#frmMk',
                    confirmButtonText: 'Ok',
                })
                .then((result) => {
                    setModal(false);
                });
        }
    } else if (tipe === 'ttb') {
        // console.log('dataText TTB ', dataText);
        if (dataText !== '') {
            // setHandleNamaCust('');
            setModal(true);
        } else {
            withReactContent(Swal).fire({
                // icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>No. Faktur belum di isi.</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        }
    } else if (tipe === 'noItem') {
        // console.log('dataText TTB ', dataText);
        if (dataText !== '') {
            // setHandleNamaCust('');
            setModal(true);
        } else {
            withReactContent(Swal).fire({
                // icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>No. Faktur belum di isi.</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        }
    } else if (tipe === 'noAkunJurnal') {
        if (dataText !== '') {
            // console.log('dataText JURNAL ', dataText);
            // setHandleNamaCust('');
            setModal(true);
        } else {
            withReactContent(Swal).fire({
                // icon: 'error',
                title: `<span style='color: gray; font-weight: bold;'>Data header belum diisi.</span>`,
                width: '20%',
                target: '#frmMk',
                confirmButtonText: 'Ok',
            });
        }
    }
};

const HandelCatatan = (e: any, setCatatanValue: Function) => {
    setCatatanValue(e);
};

const HandleModalChange = (event: any, tipe: string, setChangeNumber: Function, setHandleNama: Function, setModal: Function) => {
    setChangeNumber((prevTotal: number) => prevTotal + 1);
    if (tipe === 'customer') {
        setHandleNama(event);
        setModal(true);
    } else if (tipe === 'fj') {
        setHandleNama(event);
        setModal(true);
    } else if (tipe === 'ttb') {
        setHandleNama(event);
        setModal(true);
    } else if (tipe === 'customerSubsidi') {
        setHandleNama(event);
        setModal(true);
    }
};
const HandleRemoveRowsOtomatis = (setDataDetail: Function) => {
    setDataDetail((state: any) => ({
        ...state,
        nodes: state?.nodes.filter((node: any) => node.diskripsi !== ''),
    }));
};

// const ReCalcDataNodesMk = async (dataDetail: any, objectHeader: any) => {
//     const { kode_entitas, include, kodeMk, tipeDoc } = objectHeader;
//     const newNodes = await Promise.all(
//         dataDetail.nodes.map(async (node: any) => {
//             return {
//                 ...node,
//                 id_mk: node.id_mk,
//                 diskripsi: node.nama_barang,
//                 qty: parseFloat(node.kuantitas),
//                 qty_std: parseFloat(node.kuantitas),
//                 qty_sisa: parseFloat(node.kuantitas),
//                 // kode_dept: node.kode_dept,
//                 // kode_kerja: node.kode_kerja,
//                 qty_sisa_lkb: parseFloat(node.kuantitas),
//                 // pajak_mu: node.nilai_pajak,
//                 pajak_mu: node.pajak_mu,
//                 jumlah_mu: node.jumlah_mu,
//                 jumlah_rp: node.jumlah_mu,
//                 // kode_ttb: kodeTtb,
//             };
//         })
//     );
//     const newDataDetailSimpan = {
//         detailJson: newNodes,
//     };

//     return newDataDetailSimpan;
// };

export {
    // HandleRemoveRows,
    HandleModalChange,
    // HandleSelectedData,
    // HandleModalItem,
    // HandleGudangChange,
    // HandleAlasanChange,
    // HandleBatal,
    HandleModaliconChange,
    // HandleCaraPengiriman,
    // HandleModalItemChange,
    // HandleDaftarSj,
    HandelCatatan,
    // HandleRemoveAllRows,
    HandleRemoveRowsOtomatis,
    // HandleRemoveRows,
    // HandleKirimIdRemove,
};
