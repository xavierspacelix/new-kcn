import Swal from 'sweetalert2';

import React from 'react'

export default function template() {
  return (
    <div>template</div>
  )
}


//======= Setting tampilan sweet alert  =========
const swalDialog = Swal.mixin({
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

const tabs = [
    { title: 'Bukti TTP Tidak Lengkap', content: 'Content 1', id: 0 },
    { title: 'Bukti TTP Lengkap', content: 'Content 2', id: 1 },
    { title: 'Bukti Serah Terima', content: 'Content 3', id: 2 },
];

const tabsTransfer = [
    { title: 'Bukti TTP Tidak Lengkap', content: 'Content 1', id: 0 },
    { title: 'Bukti TTP Lengkap', content: 'Content 2', id: 1 },
    { title: 'Bukti Transfer', content: 'Content 3', id: 2 },
];

const tabsWarkat = [
    { title: 'Bukti TTP Tidak Lengkap', content: 'Content 1', id: 0 },
    { title: 'Bukti TTP Lengkap', content: 'Content 2', id: 1 },
    { title: 'Warkat Cek/Giro', content: 'Content 3', id: 3 },
];

export { tabsWarkat, tabsTransfer, tabs, swalDialog, swalToast, swalPopUp };
