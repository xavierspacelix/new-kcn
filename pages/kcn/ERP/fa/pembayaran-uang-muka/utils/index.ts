import Swal from 'sweetalert2';

export const SpreadNumber = (number: any | number | string) => {
  const temp = parseFloat(parseFloat(number).toFixed(2));
  return temp;
};

export const swalToast = Swal.mixin({
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

export const validate = (grid: any, masterData: any, statusPage: any) => {
  const isJurnalNull = grid.dataSource.length === 0;
  const isDiskripsuNull = grid.dataSource.some((item: any) => item.diskripsi === null);
  const isJumlahRpNull = grid.dataSource.some((item: any) => item.jumlah_rp <= 0);
  const isHargaMuNull = grid.dataSource.some((item: any) => item.harga_mu <= 0);

  if (isJurnalNull) {
    return {
      isValid: false,
      message: 'Data jurnal belum diisi.',
    };
  }

  if (isDiskripsuNull) {
    return {
      isValid: false,
      message: 'Data Deskripsi belum diisi.',
    };
  }

  if (isJumlahRpNull) {
    return {
      isValid: false,
      message: 'Harga beli tidak boleh <= 1',
    };
  }

  if (isHargaMuNull) {
    return {
      isValid: false,
      message: 'Jumlah tidak boleh kurang atau sama dengan nol.',
    };
  }

  if (masterData.no_supp === '' && masterData.nama_supplier === '') {
    return {
      isValid: false,
      message: 'Data Supplier belum diisi.',
    };
  }

  if (masterData.no_reff === '' && statusPage === 'PEMBAYARAN') {
    return {
      isValid: false,
      message: 'No. Reff belum diisi.',
    };
  }

  if (masterData.bayar_rp <= 0 && statusPage === 'PEMBAYARAN') {
    return {
      isValid: false,
      message: 'Jumlah Bayar tidak boleh <=0.',
    };
  }

  return { isValid: true, message: '' };
};

export const reCalc = (grid: any, masterData: any, updateState: Function) => {
  let newNettoRp = 0;
  let newSisaRp = 0;
  let newTotalRp = 0;
  let newBelumDibayarRp = 0;

  grid.dataSource.forEach((item: any) => {
    if (item.tambahan_um > 0) {
      item.jumlah_rp = item.qty * item.harga_mu;
      item.total_um = item.tambahan_um + item.jumlah_rp;
    } else if (item.harga_mu > 0) {
      item.jumlah_rp = item.qty * item.harga_mu;
      item.total_um = item.jumlah_rp;
    }

    newTotalRp += item.total_um;
    newNettoRp += item.total_um;
  });

  if (masterData.bayar_rp === 0 && masterData.lunas_rp > 0) {
    newSisaRp = newNettoRp - Number(masterData.lunas_rp);
  } else {
    newSisaRp = newNettoRp - Number(masterData.lunas_rp) - Number(masterData.bayar_rp);
  }

  newBelumDibayarRp = newTotalRp - Number(masterData.bayar_rp);

  // Update state
  updateState('netto_rp', newNettoRp);
  updateState('total_rp', newTotalRp);
  updateState('sisa_rp', newSisaRp);
  updateState('belum_dibayar_rp', newBelumDibayarRp);
};
