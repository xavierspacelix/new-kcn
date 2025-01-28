const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';

import React from 'react'

export default function apiPhu() {
  return (
    <div>apiPhu</div>
  )
}


//=================================================================
// API yang digunakan pada FormPhuList
const GetListPhuEffect = async (paramObject: any) => {
    console.log('dieksekusi');
    const {
        kode_entitas,
        vDokumen,
        vNoDokumen,
        vNoWarkat,
        vNoSupp,
        vNamaSupp,
        vTglPhuAwal,
        vTglPhuAkhir,
        vTglPhuJtAwal,
        vTglPhuJtAkhir,
        vTglPhuPencairanAwal,
        vTglPhuPencairanAkhir,
        vNoReff,
        vJenisPembayaran,
        vLimit,
        vAkunBayar,
    } = paramObject;
    const response = await axios.get(`${apiUrl}/erp/list_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: vDokumen,
            param2: vNoDokumen,
            param3: vNoWarkat,
            param4: vNoSupp,
            param5: vNamaSupp,
            param6: vTglPhuAwal,
            param7: vTglPhuAkhir,
            param8: vTglPhuJtAwal,
            param9: vTglPhuJtAkhir,
            param10: vTglPhuPencairanAwal,
            param11: vTglPhuPencairanAkhir,
            param12: vNoReff,
            param13: vJenisPembayaran,
            param14: vLimit,
            param15: vAkunBayar,
        },
    });
    const responseData = response.data.data;
    return responseData;
};

const DataDetailDokDataFaktur = async (mu: any, kode_dokumen: any, kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_data_faktur?`, {
        params: {
            entitas: kode_entitas,
            param1: mu,
            param2: kode_dokumen,
        },
    });

    const listDetailDok = response.data.data;
    return listDetailDok;
};

const DataDetailDokDataJurnal = async (kode_dokumen: any, kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_data_jurnal?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_dokumen,
        },
    });

    const listDetailDok = response.data.data;
    return listDetailDok;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PHU Daftar Akun KRedit
const DaftarAkunKredit = async (kode_entitas: any, tipeDialog: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/daftar_akun_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: tipeDialog === 'header' ? 'kas' : 'all',
        },
    });

    const listDaftarAkunKredit = response.data.data;
    return listDaftarAkunKredit;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PHU Daftar Supplier
const DaftarSupplier = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/daftar_supplier_phu?`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const listDaftarSupplier = response.data.data;
    return listDaftarSupplier;
};

const DaftarSupplierAll = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/m_supplier`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const responseListSupp = response.data.data;
    return responseListSupp;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Filter Data Customer
const ListCustFilter = async (kode_entitas: string, param1: string, param2: string, param3: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_cust_so?`, {
        params: {
            entitas: kode_entitas,
            param1: param1,
            param2: param2,
            param3: param3,
        },
    });
    const result = response.data.data;
    return result;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PHU Daftar Uang Muka
const DaftarUangMuka = async (kode_entitas: any, kode_supp: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/daftar_uangmuka_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_supp,
        },
    });

    const listDaftarUangMuka = response.data.data;
    return listDaftarUangMuka;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Detail Rows Input PHU
const DetailNoFakturPhu = async (kode_entitas: any, kode_supp: string, kode_dokumen: string, pjk: string, mu: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_nofaktur_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_supp,
            param2: kode_dokumen,
            param3: pjk,
            param4: mu,
        },
    });

    const listDaftarUangMuka = response.data.data;
    return listDaftarUangMuka;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Filter / Cek Subledger yes atau tidak dan menentukan tipe akun
const CekSubledger = async (kode_entitas: any, kode_akun: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_akun,
        },
    });

    const cekSubledger = response.data.data;
    return cekSubledger;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Filter / Cek Subledger yes atau tidak dan menentukan tipe akun
const ListSubledger = async (kode_entitas: any, kode_akun: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_subledger_by_kodeakun?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_akun,
        },
    });

    const listSubledger = response.data.data;
    return listSubledger;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPHUDetail = async (kode_entitas: any, kode_mu: string, kode_phu: string, kode_supp: string, kosong: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mu,
            param2: kode_phu,
            param3: kode_supp,
            param4: kosong, // tipe transaksi pembayaran PHU (P : TUNAI, K: Transfer, W: Warkat, C: Cair, T: Tolak)
        },
    });

    const ListEditPHUDetail = response.data.data.detail;
    return ListEditPHUDetail;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPHUMaster = async (kode_entitas: any, kode_mu: string, kode_phu: string, kode_supp: string, kosong: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mu,
            param2: kode_phu,
            param3: kode_supp,
            param4: kosong, // tipe transaksi pembayaran PHU (P : TUNAI, K: Transfer, W: Warkat, C: Cair, T: Tolak)
        },
    });

    const ListEditPHUMaster = response.data.data.master;
    return ListEditPHUMaster;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPHUJurnal = async (kode_entitas: any, kode_mu: string, kode_phu: string, kode_supp: string, kosong: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mu,
            param2: kode_phu,
            param3: kode_supp,
            param4: kosong, // tipe transaksi pembayaran PHU (P : TUNAI, K: Transfer, W: Warkat, C: Cair, T: Tolak)
        },
    });

    const ListEditPHUJurnal = response.data.data.jurnal;
    return ListEditPHUJurnal;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Cek No Warkat
const CekNoWarkat = async (kode_entitas: any, no_warkat: string, kode_dokumen: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/cek_no_warkat?`, {
        params: {
            entitas: kode_entitas,
            param1: no_warkat,
            param2: kode_dokumen,
        },
    });

    const CekNoWarkat = response.data.data;
    return CekNoWarkat;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Cek No Warkat
const GetPeriode = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/get_info?`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

export {
    GetPeriode,
    CekNoWarkat,
    ListEditPHUJurnal,
    ListEditPHUMaster,
    ListEditPHUDetail,
    ListSubledger,
    ListCustFilter,
    CekSubledger,
    DaftarSupplierAll,
    DetailNoFakturPhu,
    DaftarUangMuka,
    DaftarSupplier,
    DaftarAkunKredit,
    DataDetailDokDataJurnal,
    DataDetailDokDataFaktur,
    GetListPhuEffect,
};
