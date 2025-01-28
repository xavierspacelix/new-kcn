import { GetDetailTtp } from '../model/api';

import React from 'react'

export default function reCalc() {
  return (
    <div>reCalc</div>
  )
}


const ReCalc = async (paramobject: any) => {
    const respDetailTTP = await GetDetailTtp(paramobject);
    const newNodes = await Promise.all(
        respDetailTTP.map(async (node: any, index: number) => {
            return {
                // ...node,
                id_dokumen: node.id_dokumen,
                kode_fj: node.kode_fj,
                bayar_mu: node.jumlah,
                pajak: 'N',
                pay: 'Y',
            };
        })
    );

    const idJurnal = 1;
    const newJurnal = [
        {
            id_dokumen: idJurnal,
            dokumen: paramobject.dok_penerimaan,
            tgl_dokumen: paramobject.tgl_dokumen,
            kode_akun: paramobject.kode_akun_debet,
            kode_subledger: paramobject.sub_akun_debet,
            kurs: paramobject.kurs,
            debet_rp: paramobject.jumlah,
            kredit_rp: 0,
            jumlah_rp: paramobject.jumlah,
            jumlah_mu: paramobject.jumlah,
            catatan: `Dok ${paramobject.no_dokumen} Untuk Faktur ${respDetailTTP[0].no_fj} Oleh ${paramobject?.nama_relasi}`,
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
            catatan: `Dok ${paramobject.no_dokumen} Untuk Faktur ${respDetailTTP[0].no_fj} Oleh ${paramobject?.nama_relasi}`,
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

    if (parseFloat(paramobject.pembulatan) < 0) {
        newJurnal.push({
            id_dokumen: idJurnal + 2,
            dokumen: paramobject.dok_penerimaan,
            tgl_dokumen: paramobject.tgl_dokumen,
            kode_akun: paramobject.kode_akun_beban_bulat,
            kode_subledger: null,
            kurs: paramobject.kurs,
            debet_rp: paramobject.pembulatan * -1,
            kredit_rp: 0,
            jumlah_rp: paramobject.pembulatan * -1,
            jumlah_mu: paramobject.pembulatan * -1,
            catatan: `Pembulatan Atas ${paramobject?.nama_relasi}`,
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
        });
    } else if (parseFloat(paramobject.pembulatan) > 0) {
        newJurnal.push({
            id_dokumen: idJurnal + 2,
            dokumen: paramobject.dok_penerimaan,
            tgl_dokumen: paramobject.tgl_dokumen,
            kode_akun: paramobject.kode_akun_pendapatan_bulat,
            kode_subledger: null,
            kurs: paramobject.kurs,
            debet_rp: 0,
            kredit_rp: paramobject.pembulatan,
            jumlah_rp: paramobject.pembulatan * -1,
            jumlah_mu: paramobject.pembulatan * -1,
            catatan: `Pembulatan Atas ${paramobject?.nama_relasi}`,
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
        });
    }

    // console.log('newNodes = ', newNodes);
    // console.log('respDetailTTP = ', respDetailTTP);
    // console.log('pembulatan = ', parseFloat(paramobject.pembulatan));
    const newDataDetailSimpan = {
        detailJson: newNodes,
        detailJurnal: newJurnal,
    };
    return newDataDetailSimpan;
};

export { ReCalc };
