//==================================================================================================

import withReactContent from 'sweetalert2-react-content';
import { HandleChangeParamsObject } from '../template/HandleChangeParamsObject';
import { swalDialog, swalPopUp } from '@/lib/fa/mutasi-bank/functional/fungsiForm';
import styles from '@styles/index.module.css';
import { PatchReleaseCloseApiBank } from '@/lib/fa/mutasi-bank/api/api';
import { frmNumber } from '../../../global/fungsi';

// Template untuk kolom "no akun" Modal Akun Kredit
const TemplateNoAkun = (args: any) => {
    return (
        <div style={args.header === 'Y' ? { fontWeight: 'bold' } : { fontWeight: 'none', marginLeft: 12 }}>
            {/* Isi template sesuai kebutuhan */}
            {args.no_akun}
        </div>
    );
};
// END
//==================================================================================================

//==================================================================================================
// Template untuk kolom "no akun" Modal Akun Kredit
const TemplateNamaAkun = (args: any) => {
    return (
        <div style={args.header === 'Y' ? { fontWeight: 'bold' } : { fontWeight: 'none', marginLeft: 12 }}>
            {/* Isi template sesuai kebutuhan */}
            {args.nama_akun}
        </div>
    );
};
// END
//==================================================================================================

const HandleProsesPosting = (params: HandleChangeParamsObject) => {
    if (params.prevDataSelectedRef.current.selectType === '') {
        // Jika ID sudah ada, munculkan alert dan hentikan eksekusi
        withReactContent(swalPopUp).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;margin-right: -42px;">Pilih terlebih dahulu data mutasi</p>',
            width: '50%',
            // target: '#dialogPhuList',
            heightAuto: true,
            timer: 3000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: styles['colored-popup'],
            },
        });
        return;
    }

    if (params.prevDataSelectedRef.current.selectReconcil === 'Y') {
        withReactContent(swalPopUp).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data mutasi bank sudah diposting atau direkonsiliasi</p>',
            width: '50%',
            heightAuto: true,
            timer: 3000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: styles['colored-popup'],
            },
        });
        return;
    }

    if (params.prevDataSelectedRef.current.selectType === 'CR') {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalPostingRekonsil: true,
        }));
    } else {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalPostingRekonsilDB: true,
        }));
    }
};

const BtnClickApiBank = async (params: HandleChangeParamsObject) => {
    const paramObject = {
        kode_dokumen: params.prevDataSelectedRef.current.kode_dokumen,
        dokumen: params.prevDataSelectedRef.current.dokumen,
        no_dokumen: params.prevDataSelectedRef.current.no_dokumen,
        userid: params.userid.toUpperCase(),
        id: params.prevDataSelectedRef.current.apiId,
        proses: params.tipe,
    };
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

    console.log('paramObject = ', paramObject);

    if (params.tipe === 'RELEASE') {
        withReactContent(swalDialog)
            .fire({
                title: `<p style="font-size:12px">Anda benar-benar ingin MEMBUKA LAGI API yang sudah di rekonsil dengan total Rp. ${frmNumber(
                    params.prevDataSelectedRef.current.jumlahMu
                )}?</span></p>`,
                width: '31.4%',
                // target: '#dialogPhuList',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                showCancelButton: true, // Menampilkan tombol cancel
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const respReleaseApiBank = await PatchReleaseCloseApiBank(paramObject, params.token);
                    if (respReleaseApiBank.status === true) {
                        withReactContent(swalPopUp).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil di Release</p>',
                            width: '50%',
                            // target: '#dialogPhuList',
                            heightAuto: true,
                            timer: 3000,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            customClass: {
                                popup: styles['colored-popup'],
                            },
                        });

                        // params.handleRefreshData();
                        params.handleRefreshData();
                        return;
                    }
                }
            });
    } else if (params.tipe === 'CLOSE') {
        withReactContent(swalDialog)
            .fire({
                title: `<p style="font-size:12px">Anda benar-benar ingin MENUTUP API Bank yang belum di rekonsil dengan total Rp. ${frmNumber(
                    params.prevDataSelectedRef.current.jumlahMu
                )}?</span></p>`,
                width: '31.4%',
                // target: '#dialogPhuList',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                showCancelButton: true, // Menampilkan tombol cancel
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const respReleaseApiBank = await PatchReleaseCloseApiBank(paramObject, params.token);
                    if (respReleaseApiBank.status === true) {
                        withReactContent(swalPopUp).fire({
                            icon: 'warning',
                            title: '<p style="font-size:12px;color:white;margin-right: -42px;">Data Berhasil di Close</p>',
                            width: '50%',
                            // target: '#dialogPhuList',
                            heightAuto: true,
                            timer: 3000,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            customClass: {
                                popup: styles['colored-popup'],
                            },
                        });

                        params.handleRefreshData();
                        return;
                    }
                }
            });
    }
};

const templates = {
    BtnClickApiBank,
    HandleProsesPosting,
    TemplateNoAkun,
    TemplateNamaAkun,
};

export default templates;
