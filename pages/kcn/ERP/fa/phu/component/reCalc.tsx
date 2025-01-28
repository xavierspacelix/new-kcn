import { tanpaKoma } from '@/utils/routines';

import React from 'react';

export default function reCalc() {
    return <div>reCalc</div>;
}

const ReCalcDataNodes = async (dataBarang: any, dataJurnal: any, paramObject: any, stateDataHeader: any) => {
    const filteredNodes = dataBarang.filter((node: any) => parseFloat(node.jumlah_pembayaran) !== 0);

    const newNodes = await Promise.all(
        filteredNodes.map(async (node: any, index: number) => {
            return {
                // ...node,
                id_dokumen: index,
                kode_fb: node.kode_fb,
                bayar_mu: node.jumlah_pembayaran,
                pajak: 'N',
                pay: 'N',
            };
        })
    );

    const newNodesJurnal = await Promise.all(
        dataJurnal.map(async (node: any) => {
            return {
                // ...node,
                id_dokumen: node.id,
                dokumen: 'BB',
                tgl_dokumen: paramObject.tglDokumen,
                kode_akun: node.kode_akun,
                kode_subledger: node.kode_subledger,
                kurs: node.kurs,
                debet_rp: node.debet_rp,
                kredit_rp: node.kredit_rp,
                jumlah_rp: node.jumlah_mu,
                jumlah_mu: node.jumlah_mu,
                catatan: node.catatan,
                no_warkat:
                    paramObject.modalJenisPembayaran === 'Warkat' || paramObject.modalJenisPembayaran === 'Pencairan' || paramObject.modalJenisPembayaran === 'Penolakan'
                        ? node.kode_akun === paramObject.kodeAkunHutangBg
                            ? paramObject.noWarkat
                            : null
                        : null,
                tgl_valuta: paramObject.tipeApi === 'API' || paramObject.tipeApi === 'APIWarkat' ? paramObject.tgl_valuta : null,
                persen: 0,
                kode_dept: node.kode_dept,
                kode_kerja: null,
                approval: 'N',
                posting: 'N',
                rekonsiliasi: paramObject.tipeApi === 'API' || paramObject.tipeApi === 'APIWarkat' ? paramObject.rekonsiliasi : 'N',
                tgl_rekonsil: paramObject.tipeApi === 'API' || paramObject.tipeApi === 'APIWarkat' ? paramObject.tgl_rekonsil : null,
                userid: paramObject.userid,
                tgl_update: paramObject.tgl_update,
                audit: null,
                kode_kry: null,
                kode_jual: null,
                no_kontrak_um: node.nama_akun === 'Uang Muka Pembelian' ? stateDataHeader?.noKontrakValue : null,
            };
        })
    );

    const newDataDetailSimpan = {
        detailJson: newNodes,
        detailJurnal: newNodesJurnal,
    };
    return newDataDetailSimpan;
};

export { ReCalcDataNodes };
