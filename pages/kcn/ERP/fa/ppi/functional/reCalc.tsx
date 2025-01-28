import { tanpaKoma } from '@/utils/routines';

import React from 'react';

export default function reCalc() {
    return <div>reCalc</div>;
}

const ReCalcDataNodes = async (dataBarang: any, dataJurnal: any, paramObject: any) => {
    const filteredNodes = dataBarang?.nodes.filter((node: any) => parseFloat(node.bayar_mu) !== 0);
    console.log('filteredNodes = ', filteredNodes);
    const newNodes = await Promise.all(
        filteredNodes.map(async (node: any, index: number) => {
            return {
                // ...node,
                id_dokumen: index + 1,
                kode_fj: node.kode_fj,
                bayar_mu: node.bayar_mu,
                pajak: 'N',
                pay: 'Y',
            };
        })
    );

    const newNodesJurnal = await Promise.all(
        dataJurnal?.nodes.map(async (node: any) => {
            return {
                // ...node,
                id_dokumen: node.id,
                dokumen: 'PU',
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
                    paramObject.modalJenisPenerimaan === 'Warkat' || paramObject.modalJenisPenerimaan === 'Pencairan' || paramObject.modalJenisPenerimaan === 'Penolakan'
                        ? node.kode_akun === paramObject.kodeAkunPiutangBg
                            ? paramObject.noWarkat
                            : null
                        : null,
                tgl_valuta: paramObject.tglDokumen,
                persen: 0,
                kode_dept: node.kode_dept,
                kode_kerja: null,
                approval: 'N',
                posting: 'N',
                rekonsiliasi: paramObject?.tipeApi === 'API' ? paramObject.rekonsiliasi : 'N',
                tgl_rekonsil: paramObject?.tipeApi === 'API' ? paramObject.tgl_rekonsil : null,
                userid: paramObject.userid,
                tgl_update: paramObject.tgl_update,
                audit: null,
                kode_kry: null,
                kode_jual: node.kode_jual,
                no_kontrak_um: null,
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
