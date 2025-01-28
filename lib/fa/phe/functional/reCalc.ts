import { generateNU } from '@/utils/global/fungsi';
import moment from 'moment';

const ReCalc = async (gridPheListRef: any, paramObject: any, gridPheJurnalListRef: any) => {
    const filteredNodes = gridPheListRef.filter((node: any) => parseFloat(node.bayar_mu) !== 0);
    const newNodes = await Promise.all(
        filteredNodes.map(async (node: any, index: number) => {
            return {
                // ...node,
                id_phe: index + 1,
                kode_rpe: node.kode_rpe,
                pay: 'Y',
                rpeba: 'N',
                harga_eks: 0,
                ket_klaim_eks: '',
                harga_tambahan: 0,
                bayar_mu: node.bayar_mu,
            };
        })
    );

    let newNodesJurnal;
    if (gridPheJurnalListRef && Array.isArray(gridPheJurnalListRef)) {
        const dataSource = [...gridPheJurnalListRef]; // Salin array

        newNodesJurnal = await Promise.all(
            dataSource?.map(async (node: any) => {
                return {
                    // ...node,
                    id_dokumen: node.id,
                    dokumen: 'JU',
                    tgl_dokumen: paramObject.tglDokumen,
                    kode_akun: node.kode_akun,
                    kode_subledger: node.kode_subledger,
                    kurs: node.kurs,
                    debet_rp: node.debet_rp,
                    kredit_rp: node.kredit_rp,
                    jumlah_rp: node.jumlah_mu,
                    jumlah_mu: node.jumlah_mu,
                    catatan: node.catatan,
                    no_warkat: null,
                    tgl_valuta: paramObject.tglDokumen,
                    persen: 0,
                    kode_dept: node.kode_dept,
                    kode_kerja: null,
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: null,
                    userid: paramObject.userid,
                    tgl_update: paramObject.tgl_update,
                    audit: null,
                    kode_kry: null,
                    kode_jual: node.kode_jual,
                    no_kontrak_um: null,
                };
            })
        );
    }

    const catatan = newNodesJurnal?.[0]?.catatan || null;
    const generateNoDok = await generateNU(paramObject.kode_entitas, '', '20', moment().format('YYYYMM'));

    const newNodesKeuangan = {
        kode_dokumen: '',
        dokumen: 'JU',
        no_dokumen: generateNoDok,
        tgl_dokumen: paramObject?.tglDokumen,
        no_warkat: null,
        tgl_valuta: null,
        kode_cust: null,
        kode_akun_debet: null,
        kode_supp: null,
        kode_akun_kredit: null,
        kode_akun_diskon: null,
        kurs: null,
        debet_rp: paramObject.jumlahBayar,
        kredit_rp: paramObject.jumlahBayar,
        jumlah_rp: paramObject.jumlahBayar,
        jumlah_mu: paramObject.jumlahBayar,
        pajak: null,
        kosong: null,
        kepada: null,
        catatan: catatan,
        status: 'Terbuka',
        userid: paramObject.userid,
        tgl_update: paramObject.tgl_update,
        status_approved: null,
        tgl_approved: null,
        tgl_pengakuan: null,
        no_TTP: null,
        tgl_TTP: null,
        kode_sales: null,
        kode_fk: null,
        approval: 'N',
        tgl_setorgiro: null,
        faktur: 'N',
        barcode: null,
        komplit: 'N',
        validasi1: 'N',
        validasi2: 'N',
        validasi3: 'N',
        validasi_ho2: 'N',
        validasi_ho3: 'N',
        validasi_catatan: null,
        tolak_catatan: null,
        kode_kry: null,
        // tgl_trxdokumen: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        tgl_trxdokumen: paramObject?.tglDokumen,
        api_id: 0,
        api_pending: null,
        api_catatan: null,
        api_norek: null,
        kode_aktiva: null,
        kode_rpe: null,
        kode_phe: null,
        kode_rps: null,
        kode_um: null,
        no_kontrak_um: null,
    };

    const newDataDetailSimpan = {
        detailJson: newNodes,
        detailJurnal: newNodesJurnal,
        detailKeuangan: newNodesKeuangan,
        generateNU: generateNoDok,
    };
    return newDataDetailSimpan;
};

export { ReCalc };
