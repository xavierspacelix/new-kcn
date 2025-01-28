import { DiskonByCalc, tanpaKoma } from '@/utils/routines';
import moment from 'moment';


import React from 'react'

export default function reCalc() {
  return (
    <div>reCalc</div>
  )
}


const ReCalcDataNodesTtb = async (dataDetail: any, objectHeader: any) => {
    const { kode_entitas, include, kode, tipeDoc, date1, defaultNoTtb, userid, masterDataState, divisiPenjualan, kodeTtb } = objectHeader;
    const updateIds = (nodes: any) => {
        return nodes.map((node: any, index: any) => {
            return {
                ...node,
                id: index + 1,
            };
        });
    };

    const newNodes = await Promise.all(
        updateIds(dataDetail?.nodes).map(async (node: any) => {
            let diskon_mu = node.diskon_mu === null || node.diskon_mu === '' ? 0 : parseFloat(node.diskon_mu);
            let harga_mu = node.harga_mu === null || node.harga_mu === '' ? 0 : parseFloat(node.harga_mu); //node.harga_btg
            let potongan_mu = node.potongan_mu === null || node.potongan_mu === '' ? 0 : parseFloat(node.potongan_mu);
            let nilai_pajak = node.pajak === null || node.pajak === '' ? 0 : parseFloat(node.pajak);
            let diskon = node.diskon === null || node.diskon === '' ? '0' : node.diskon;

            let diskonMu, jumlah_mu: any, pajak_mu: any, diskon_mu_tot: any, total_diskon_mu: any, netto_rp: any;
            jumlah_mu = (diskon_mu !== null || diskon_mu !== '') && node.kuantitas > 0 && harga_mu > 0 ? node.kuantitas * (harga_mu - potongan_mu - diskon_mu) : harga_mu * node.kuantitas;

            if (node.include === 'N') {
                pajak_mu = 0;
                netto_rp = jumlah_mu;
            } else if (node.include === 'E') {
                pajak_mu = (jumlah_mu * nilai_pajak) / 100;
                netto_rp = jumlah_mu + pajak_mu;
            } else if (node.include === 'I') {
                netto_rp = jumlah_mu;
                if (nilai_pajak === 10) {
                    // pajak_mu = ((100 / 110) * jumlah_mu * nilai_pajak) / 100;
                    pajak_mu = jumlah_mu - (jumlah_mu * 100) / (100 + nilai_pajak);
                } else if (nilai_pajak === 11) {
                    // pajak_mu = ((100 / 111) * jumlah_mu * nilai_pajak) / 100;
                    pajak_mu = jumlah_mu - (jumlah_mu * 100) / (100 + nilai_pajak);
                } else {
                    pajak_mu = 0;
                }
            }
            diskon_mu_tot = DiskonByCalc(diskon, node.kuantitas * harga_mu);
            total_diskon_mu = node.kuantitas * diskon_mu;

            return {
                ...node,
                id_ttb: node.id,
                diskripsi: node.nama_barang,
                qty: parseFloat(node.kuantitas),
                qty_std: parseFloat(node.kuantitas),
                qty_sisa: parseFloat(node.kuantitas),
                kode_dept: node.kode_dept,
                kode_kerja: node.kode_kerja,
                qty_sisa_lkb: parseFloat(node.kuantitas),
                // pajak_mu: node.nilai_pajak,
                pajak_mu: pajak_mu,
                jumlah_mu: jumlah_mu,
                jumlah_rp: jumlah_mu,
                kode_ttb: kodeTtb,
                nilai_pajak: pajak_mu,
                total_diskon_mu: total_diskon_mu,
                diskon_mu: diskon_mu,
                nettoRp: netto_rp,
            };
        })
    );

    const totalJumlahMu = newNodes.reduce((acc: number, node: any) => {
        return acc + (parseFloat(node.jumlah_mu) || 0);
    }, 0);
    const totalDiskonMu = newNodes.reduce((acc: number, node: any) => {
        return acc + (parseFloat(node.total_diskon_mu) || 0);
    }, 0);
    const totalJumlahPajak = newNodes.reduce((acc: number, node: any) => {
        return acc + parseFloat(node.nilai_pajak);
    }, 0);
    const totalNettoRp = newNodes.reduce((acc: number, node: any) => {
        return acc + parseFloat(node.nettoRp);
    }, 0);

    // Hitung total nilai untuk setiap row
    const totalValues = dataDetail?.nodes.map((node: any) => {
        return node.kuantitas * parseFloat(node.hpp);
    });

    // Jumlahkan semua total nilai dari setiap row
    const grandTotalJurnal = totalValues.reduce((acc: any, value: any) => {
        return acc + value;
    }, 0);

    const dataJurnalArry = [
        {
            id_dokumen: 1,
            dokumen: 'TB',
            tgl_dokumen: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            kode_akun: objectHeader.kodeAkun1,
            kode_subledger: null,
            kurs: 1,
            debet_rp: grandTotalJurnal,
            kredit_rp: 0,
            jumlah_rp: grandTotalJurnal,
            jumlah_mu: grandTotalJurnal,
            catatan: `Persediaan TTB No: ${defaultNoTtb}`,
            no_warkat: null,
            tgl_valuta: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            persen: 0,
            kode_dept: null,
            kode_kerja: null,
            approval: 'N',
            posting: 'N',
            rekonsiliasi: 'N',
            tgl_rekonsil: null,
            userid: userid.toUpperCase(),
            tgl_update: masterDataState === 'EDIT' ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            audit: null,
            kode_kry: null,
            kode_jual: divisiPenjualan,
            no_kontrak_um: null,
            kodeTtb: kodeTtb,
        },
        {
            id_dokumen: 2,
            dokumen: 'TB',
            tgl_dokumen: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            kode_akun: objectHeader.kodeAkun2,
            kode_subledger: null,
            kurs: 1,
            debet_rp: 0,
            kredit_rp: grandTotalJurnal,
            jumlah_rp: grandTotalJurnal * -1,
            jumlah_mu: grandTotalJurnal * -1,
            catatan: `Harga Pokok TTB No: ${defaultNoTtb}`,
            no_warkat: null,
            tgl_valuta: moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            persen: 0,
            kode_dept: null,
            kode_kerja: null,
            approval: 'N',
            posting: 'N',
            rekonsiliasi: 'N',
            tgl_rekonsil: null,
            userid: userid.toUpperCase(),
            tgl_update: masterDataState === 'EDIT' ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : moment(date1).format('YYYY-MM-DD HH:mm:ss'),
            audit: null,
            kode_kry: null,
            kode_jual: divisiPenjualan,
            no_kontrak_um: null,
            kodeTtb: kodeTtb,
        },
    ];

    const newDataDetailSimpan = {
        detailJson: newNodes,
        detailJurnal: dataJurnalArry,
        jumlahMu: totalJumlahMu,
        totalDiskonMu: totalDiskonMu,
        totalJumlahPajak: totalJumlahPajak,
        nettoRp: totalNettoRp,
    };

    return newDataDetailSimpan;
};

export { ReCalcDataNodesTtb };
