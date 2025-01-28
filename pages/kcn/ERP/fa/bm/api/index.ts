import axios from 'axios';
import swal from 'sweetalert2';

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

export const cekSaldoBukuBesar = async (data: any) => {
  const { entitas, token, kode_akun } = data;

  try {
    const response = await axios.get(`${apiUrl}/erp/cek_saldo_buku_besar`, {
      params: {
        entitas,
        param1: kode_akun,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error Cek Saldo Buku Besar: ', error);
  }
};

export const validasiJurnal = async (data: any) => {
  const { entitas, kode_akun, kode_subledger, tgl_dokumen, jumlah_rp, token } = data;
  try {
    const response = await axios.get(`${apiUrl}/erp/validasi_jurnal`, {
      params: {
        entitas,
        param1: kode_akun,
        param2: kode_subledger,
        param3: tgl_dokumen,
        param4: jumlah_rp,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error Validasi Jurnal: ', error);
  }
};

export const cekSaldoValid = async (kode_akun: any, kode_subledger: any, tgl: any, jumlah_rp: any, kode_entitas: any, token: any) => {
  const data = await cekSaldoBukuBesar({
    entitas: kode_entitas,
    token,
    kode_akun: kode_akun,
  });

  const modifiedSubledger = kode_subledger === null ? '' : kode_subledger;

  if (data.length > 0) {
    const validasi = await validasiJurnal({
      entitas: kode_entitas,
      kode_akun,
      kode_subledger: modifiedSubledger !== '' && data.isSubledger === 'Y' ? modifiedSubledger : '%%',
      tgl_dokumen: tgl,
      jumlah_rp,
      token,
    });

    if (validasi.length) {
      if (validasi[0].valid === 'N') {
        swal.fire({
          icon: 'error',
          title: '<p style="font-size:12px; padding: 0px !important;">*** Saldo Akun setelah transaksi tidak normal ***</p>',
          html: `
          <div style="padding: 0px !important;">
          Nama akun: ${validasi[0].no_akun} - ${validasi[0].nama_akun}<br>
          Saldo Normal: ${validasi[0].normal}<br>
          Saldo Akhir: ${validasi[0].saldo}<br>
          Saldo Setelah Transaksi: ${validasi[0].saldo_akhir}<br>
          Transaksi jurnal tidak bisa disimpan.
          </div>
        `,
          target: '#dialogBMList',
        });
        return false;
      } else {
        return true;
      }
    }
  }
  return true;
};
