import { GetDetailTtp } from '../model/api';

import React from 'react'

export default function reCalcBM() {
  return (
    <div>reCalcBM</div>
  )
}


const ReCalcBM = async (paramobject: any) => {
    const idJurnal = 1;
    const newJurnal = [
        {
            id_dokumen: idJurnal,
            dokumen: paramobject.dok_penerimaan,
            tgl_dokumen: paramobject.tgl_dokumen,
            kode_akun: paramobject.kode_akun_debet,
            kode_subledger: paramobject.sub_akun_debet,
            kurs: paramobject.kurs,
            debet_rp: paramobject.dibayar,
            kredit_rp: 0,
            jumlah_rp: paramobject.dibayar,
            jumlah_mu: paramobject.dibayar,
            catatan: `UANG MUKA DEPOSIT ATAS ${paramobject?.nama_relasi}`,
            no_warkat: null,
            tgl_valuta: paramobject.tgl_dokumen,
            persen: 0,
            kode_dept: null,
            kode_kerja: null,
            approval: 'N',
            posting: 'N',
            rekonsiliasi: 'N',
            tgl_rekonsil: null,
            userid: paramobject.userid,
            tgl_update: paramobject.tgl_update,
            audit: null,
            kode_kry: null,
            kode_jual: null,
            no_kontrak_um: null,
        },
        {
            id_dokumen: idJurnal + 1,
            dokumen: paramobject.dok_penerimaan,
            tgl_dokumen: paramobject.tgl_dokumen,
            kode_akun: paramobject.kode_akun_kredit,
            kode_subledger: paramobject.sub_akun_kredit,
            kurs: paramobject.kurs,
            debet_rp: 0,
            kredit_rp: paramobject.dibayar,
            jumlah_rp: paramobject.dibayar * -1,
            jumlah_mu: paramobject.dibayar * -1,
            catatan: `UANG MUKA DEPOSIT ATAS ${paramobject?.nama_relasi}`,
            no_warkat: null,
            tgl_valuta: paramobject.tgl_dokumen,
            persen: 0,
            kode_dept: null,
            kode_kerja: null,
            approval: 'N',
            posting: 'N',
            rekonsiliasi: 'N',
            tgl_rekonsil: null,
            userid: paramobject.userid,
            tgl_update: paramobject.tgl_update,
            audit: null,
            kode_kry: null,
            kode_jual: null,
            no_kontrak_um: null,
        },
    ];

    // console.log('respDetailTTP = ', newJurnal);
    const newDataDetailSimpan = {
        detailJurnal: newJurnal,
    };
    return newDataDetailSimpan;
};

export { ReCalcBM };
