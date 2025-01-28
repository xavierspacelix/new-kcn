import Swal from 'sweetalert2';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';

import React from 'react'

export default function template() {
  return (
    <div>template</div>
  )
}


const swalPopUp = Swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
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

// judul Grid Header Bukti Ttp Spesimen
const headerSisaDibayar = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Sisa yang harus dibayar" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Sisa yang harus
                    <br />
                    dibayar
                </span>
            </div>
        </TooltipComponent>
    );
};

const headerNoRekening = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="No. Rekening Bank Transfer" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    No. Rekening Bank
                    <br />
                    Transfer
                </span>
            </div>
        </TooltipComponent>
    );
};

const headerDibayarTransfer = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Dibayar Transfer" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Dibayar
                    <br />
                    Transfer
                </span>
            </div>
        </TooltipComponent>
    );
};

const headerDibayarTunai = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Dibayar Tunai" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Dibayar
                    <br />
                    Tunai
                </span>
            </div>
        </TooltipComponent>
    );
};

const headerDibayarWarkat = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Dibayar Warkat" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Dibayar
                    <br />
                    Warkat
                </span>
            </div>
        </TooltipComponent>
    );
};

const headerDibayarUangMuka = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Dibayar Uang Muka" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Dibayar
                    <br />
                    Uang Muka
                </span>
            </div>
        </TooltipComponent>
    );
};

const headerPembayaranFaktur = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <TooltipComponent content="Pembayaran Faktur" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: '4px', marginBottom: '4px' }}>
                <span style={{ width: '100px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Pembayaran
                    <br />
                    Faktur
                </span>
            </div>
        </TooltipComponent>
    );
};
// End

// ============= Fungsi Show Loading =========================
const showLoading1 = async (closeWhenDataIsFulfilled: boolean) => {
    if (closeWhenDataIsFulfilled) {
        Swal.fire({
            padding: '3em',
            imageUrl: '/assets/images/loader-1.gif',
            imageWidth: 170,
            imageHeight: 170,
            imageAlt: 'Custom image',
            background: 'rgba(0,0,0,.0)',
            backdrop: 'rgba(0,0,0,0.0)',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
        });
    } else {
        Swal.close(); // Menutup tampilan loading
    }
};
// End

export {
    showLoading1,
    swalToast,
    headerSisaDibayar,
    headerNoRekening,
    headerDibayarTransfer,
    headerDibayarTunai,
    headerDibayarWarkat,
    headerDibayarUangMuka,
    headerPembayaranFaktur,
    swalDialog,
    swalPopUp,
};
