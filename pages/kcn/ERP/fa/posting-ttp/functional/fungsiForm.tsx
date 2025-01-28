import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { frmNumber } from '@/utils/routines';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { faCamera, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { GetHp2Cust, GetPreferensi, GetWaAkunting, GetWagwServer, UpdateCustBl60Api, UpdateCustBlApi } from '../model/api';
import axios from 'axios';

import React from 'react'

export default function fungsiForm() {
  return (
    <div>fungsiForm</div>
  )
}


// Custom Penjumlahan yang bdi bawah grid
const customTotTunai = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

const totTunai = (args: any) => {
    const totTunai = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(item.nilai_tunai === '' ? '0' : item.nilai_tunai);
    }, 0);
    return frmNumber(totTunai);
};

const customTotTransfer = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

const totTransfer = (args: any) => {
    const totTransfer = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(item.nilai_transfer === '' ? '0' : item.nilai_transfer);
    }, 0);
    return frmNumber(totTransfer);
};

const customTotWarkat = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

const totWarkat = (args: any) => {
    const totWarkat = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(item.nilai_warkat === '' ? '0' : item.nilai_warkat);
    }, 0);
    return frmNumber(totWarkat);
};

const customTotUangMuka = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

const totUangMuka = (args: any) => {
    const totTitipan = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(item.nilai_titipan === '' ? '0' : item.nilai_titipan);
    }, 0);
    return frmNumber(totTitipan);
};

const customTotPembulatan = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

const totPembulatan = (args: any) => {
    const totPembulatan = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(item.nilai_bulat === '' ? '0' : item.nilai_bulat);
    }, 0);
    return frmNumber(totPembulatan);
};

const customTotJmlTerima = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

const totJmlTerima = (args: any) => {
    const totJmlTerima = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(item.jml_terima === '' ? '0' : item.jml_terima);
    }, 0);
    return frmNumber(totJmlTerima);
};
// End

// judul Grid Header Bukti Ttp Spesimen
const headerBuktiTtpSalesman = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Bukti TTP Salesman" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3 }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Bukti TTP
                    <br />
                    Salesman
                </span>
            </div>
        </TooltipComponent>
    );
};
// End

// judul Grid Header Spesimen Ttd Customer
const headerSpesimenTtdCustomer = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Spesimen TTD Customer" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3 }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Spesimen
                    <br />
                    TTD Customer
                </span>
            </div>
        </TooltipComponent>
    );
};
// End

// judul Grid Header Spesimen Sesuai
const headerSpesimenSesuai = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Spesimen Sesuai" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3 }}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Spesimen
                    <br />
                    Sesuai
                </span>
            </div>
        </TooltipComponent>
    );
};
// End

// // Template isi Grid
// const templatePosted = (args: any) => {
//     return <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>{args.proses === 'Y' ? <FontAwesomeIcon icon={faCheck} width="18" height="18" /> : pl}</div>;
// };

// const templateBuktiTTP = (args: any) => {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//             <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>{args.tombol_ttp === 'Y' ? <FontAwesomeIcon icon={faCheck} width="18" height="18" /> : null}</div>
//             <div onClick={() => loadImage(args.filegambar_ttp)} style={{ fontWeight: 'bold', fontSize: '14px' }}>
//                 {args.tombol_ttp === 'Y' ? <FontAwesomeIcon icon={faCamera} width="18" height="18" /> : null}
//             </div>
//         </div>
//     );
// };

// const templateTombolTTD = (args: any) => {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
//             <div style={{ color: 'green', fontWeight: 'bold', fontSize: '14px' }}>{args.tombol_ttd === 'Y' ? <FontAwesomeIcon icon={faCheck} width="18" height="18" /> : null}</div>
//             <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{args.tombol_ttd === 'Y' ? <FontAwesomeIcon icon={faCamera} width="18" height="18" /> : null}</div>
//         </div>
//     );
// };

// const templateSpesimenSesuai = (args: any) => {
//     return (
//         <div style={args.ttd === 'Y' ? { color: 'green', fontWeight: 'bold', fontSize: '14px' } : args.ttd === 'N' ? { color: 'red', fontWeight: 'bold', fontSize: '14px' } : {}}>
//             {args.ttd === 'Y' ? <FontAwesomeIcon icon={faCheck} width="18" height="18" /> : args.ttd === 'N' ? <FontAwesomeIcon icon={faX} width="18" height="18" /> : null}
//         </div>
//     );
// };
// End

const HandleZoomIn = (setZoomScale: Function) => {
    setZoomScale((prevScale: any) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
};

const HandleZoomOut = (setZoomScale: Function) => {
    setZoomScale((prevScale: any) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
};

const HandleCloseZoom = (setIsOpenPreview: Function) => {
    setIsOpenPreview(false);
};

const paramProps = { ttd: '', kode_dokumen: '', no_ttp: '', catatan: '', plagInputCatatan: false, plag: 0 };
const clickCatatan = (props: any) => {
    console.log('props = ', props);
    (paramProps.ttd = props.ttd),
        (paramProps.kode_dokumen = props.kode_dokumen),
        (paramProps.no_ttp = props.no_ttp),
        (paramProps.catatan = props.catatan),
        (paramProps.plagInputCatatan = true),
        (paramProps.plag += 1);
};

const editTemplateCatatan = (props: any) => {
    return (
        <div onClick={() => clickCatatan(props)} className="col-xs-6 col-sm-6 col-lg-6 col-md-6 flex justify-end" style={{ paddingRight: '0px' }}>
            <input readOnly={true} id={`catatan${props.kode_dokumen}`} value={props.catatan} style={{ width: '233px', backgroundColor: 'transparent', border: 'none' }}></input>
        </div>
    );
};

//BlackList Customer
const UpdateCustBl = async (paramObjectBl: any, token: any) => {
    const respUpdateCustBlApi = await UpdateCustBlApi(paramObjectBl, token);
    return respUpdateCustBlApi;
};

//BlackList Customer 60 hari
const UpdateCustBl60 = async (paramObjectBl: any, token: any) => {
    const respUpdateCustBl60Api = await UpdateCustBl60Api(paramObjectBl, token);
    return respUpdateCustBl60Api;
};

// Fungsi untuk mengonversi base64 ke Blob
function base64ToBlob(base64: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}
// End

// Fungsi untuk membuat objek File dari Blob
function blobToFile(blob: any, fileName: any) {
    blob.lastModifiedDate = new Date();
    return new File([blob], fileName, { type: blob.type, lastModified: blob.lastModifiedDate });
}
// End

// Komponen ProgressBar
const ProgressBar = ({ progress, isError }: { progress: number; isError: boolean }) => {
    return (
        <div style={{ width: '100%', backgroundColor: '#f3f3f3', height: '4px', marginBottom: '10px' }}>
            <div
                style={{
                    width: `${progress}%`,
                    backgroundColor: isError ? '#ff4d4f' : '#29d', // Warna merah saat error
                    height: '100%',
                    transition: 'width 0.2s ease-in-out',
                }}
            />
        </div>
    );
};

// Komponen Modal
const Modal = ({ isOpen, progress, isError, message }: { isOpen: boolean; progress: number; isError: boolean; message: string }) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: '300px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    textAlign: 'center',
                }}
            >
                <h2>{isError ? 'Gagal Menyimpan Data' : 'Menyimpan Data...'}</h2>
                <ProgressBar progress={progress} isError={isError} />
                <p>{progress}%</p>
                <p>{message}</p>
            </div>
        </div>
    );
};

const kirimWa = async (nama_relasi: any, kode_cust: any, token: any, kode_entitas: any) => {
    let waAcc2: any;
    let param3: any;
    const respPreferensi = await GetPreferensi(kode_entitas);
    const respWaAkunting = await GetWaAkunting(token, kode_entitas);
    if (respWaAkunting.length > 0) {
        waAcc2 = respWaAkunting[0].wa_acc2;
    } else {
        waAcc2 = '';
    }
    const pesanWa = `*Kepada pelanggan setia*

*${nama_relasi}*

Terima kasih telah melakukan pembayaran kepada kami

*Apabila belum dan atau tidak menerima Tanda Terima Pembayaran (TTP) berupa hasil cetakan mohon segera membalas pesan WA ini*

*Untuk setiap pembayaran yang telah kami terima, akan terkirim pesan WA otomatis kepada nomor pelanggan. Dan apabila setelah melakukan pembayaran tidak menerima pesan WA, mohon segera menghubungi nomor OM yang tertera di bawah ini*

Untuk informasi lebih lanjut, silahkan hubungi :
Operasional Manager: ${respPreferensi[0].nama_manager}
_https://wa.me/${respPreferensi[0].wa_regional}_${waAcc2}
_https://wa.me/${waAcc2}_

*TERIMA KASIH*`;

    const respWagwServer = await GetWagwServer(token, kode_entitas);
    if (respWagwServer[0].wagw_server === '192.168.1.6') {
        param3 = '8DWO19';
    } else if (respWagwServer[0].wagw_serverwa === '192.168.1.7') {
        param3 = 'AC9RYO';
    } else if (respWagwServer[0].wagw_serverwa === '192.168.1.11') {
        param3 = 'IT22M0';
    }

    const respGetHp2Cust = await GetHp2Cust(token, kode_entitas, kode_cust);
    const response = await axios.post(`http://10.10.1.109/api/v1/send-wa/text-only`, null, {
        params: {
            param1: kode_entitas === '999' ? '081212630358' : respGetHp2Cust[0].hp2, //respGetHp2Cust[0].hp2,
            param2: pesanWa,
            param3: param3, // kode Device Wa Blas
        },
    });
};

//==================================================================================================
// Fungsi untuk menampilkan daftar Piutang pelanggan
const OnClick_DaftarDPP = (paramObject: any) => {
    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframeSrc = `./posting-ttp/report/form_dpp?entitas=${paramObject.kode_entitas}&kode_cust=${paramObject.kode_cust}&tgl_akhir=${paramObject.tgl_akhir}&token=${paramObject.token}`;

    fetch(iframeSrc)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(() => {
            let iframe = `
            <html><head>
            <title>Daftar Piutang Pelanggan | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="${iframeSrc}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

            let win = window.open(
                '',
                '_blank',
                `status=no,width=${width},height=${height},resizable=yes
                ,left=${leftPosition},top=${topPosition}
                ,screenX=${leftPosition},screenY=${topPosition}
                ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
            );

            if (win) {
                let link = win.document.createElement('link');
                link.type = 'image/png';
                link.rel = 'shortcut icon';
                link.href = '/favicon.png';
                win.document.getElementsByTagName('head')[0].appendChild(link);
                win.document.write(iframe);
            } else {
                console.error('Window failed to open.');
            }
        })
        .catch((error) => {
            console.error('Failed to load resource:', error);
        });
};
// END

export {
    OnClick_DaftarDPP,
    kirimWa,
    Modal,
    ProgressBar,
    blobToFile,
    base64ToBlob,
    UpdateCustBl60,
    UpdateCustBl,
    paramProps,
    editTemplateCatatan,
    HandleCloseZoom,
    HandleZoomIn,
    HandleZoomOut,
    // templateBuktiTTP,
    // templateTombolTTD,
    // templateSpesimenSesuai,
    // templatePosted,
    headerBuktiTtpSalesman,
    headerSpesimenSesuai,
    headerSpesimenTtdCustomer,
    customTotTunai,
    totTunai,
    customTotTransfer,
    totTransfer,
    customTotWarkat,
    totWarkat,
    customTotUangMuka,
    totUangMuka,
    customTotPembulatan,
    totPembulatan,
    customTotJmlTerima,
    totJmlTerima,
};
