const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';

//=================================================================
// API yang digunakan pada FormPhuList
const GetListPpiEffect = async (paramObject: any) => {
    const {
        kode_entitas,
        vDokumen,
        vNoDokumen,
        vNoWarkat,
        vNoCust,
        vNamaCust,
        vTglPpiAwal,
        vTglPpiAkhir,
        vTglPpiJtAwal,
        vTglPpiJtAkhir,
        vTglPpiPencairanAwal,
        vTglPpiPencairanAkhir,
        vNoReff,
        vKolektor,
        vActualKolektor,
        vJenisPenerimaan,
        vLimit,
        vAkunDebet,
        vToken,
        vWhere,
    } = paramObject;

    const response = await axios.get(`${apiUrl}/erp/list_ppi?`, {
        headers: {
            Authorization: `Bearer ${vToken}`,
        },
        params: {
            entitas: kode_entitas,
            whereParam: vWhere,
        },
    });
    const responseData = response.data.data;
    return responseData;
};

const DataDetailDokDataFaktur = async (kode_dokumen: any, kode_entitas: any, vToken: string) => {
    const response = await axios.get(`${apiUrl}/erp/detail_dok_ppi?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_dokumen,
        },
        headers: {
            Authorization: `Bearer ${vToken}`,
        },
    });

    const detail_dok_ppi = response.data.data;
    const responseDetailDok = {
        detailFaktur: detail_dok_ppi.dataFaktur,
        detailJurnal: detail_dok_ppi.dataJurnal,
    };

    return responseDetailDok;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PPI Daftar Akun DEBET
const DaftarAkunDebet = async (kode_entitas: any, tipeDialog: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/daftar_akun_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: tipeDialog === 'header' ? 'kas' : 'all',
        },
    });

    const listDaftarAkunDebet = response.data.data;
    return listDaftarAkunDebet;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PPI Daftar Akun DEBET
const DaftarAkunJurnal = async (kode_entitas: any, kode_user: string, kode_akun: string, token: string): Promise<any[]> => {
    let respAkunJabatan;
    let respAkunPpi;
    let listDaftarAkunDebet;
    const paramAkunJabatan = `where x.kode_user="${kode_user}" and x.kode_akun ="${kode_akun}"`;
    try {
        const reqAkunJabatan = await axios.get(`${apiUrl}/erp/list_akun_global?`, {
            params: {
                entitas: kode_entitas,
                param1: 'SQLAkunDPPIJabatan',
                param2: paramAkunJabatan,
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        respAkunJabatan = reqAkunJabatan.data;

        const reqAkunPpi = await axios.get(`${apiUrl}/erp/list_akun_global?`, {
            params: {
                entitas: kode_entitas,
                param1: 'SQLAkunPPI',
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        respAkunPpi = reqAkunPpi.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    if (respAkunJabatan.length > 0) {
        listDaftarAkunDebet = respAkunJabatan.data;
    } else {
        listDaftarAkunDebet = respAkunPpi.data;
    }

    // const listDaftarAkunDebet = response.data.data;
    return listDaftarAkunDebet;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PPI Daftar kolektor / salesman
const DaftarSalesman = async (vToken: any, kode_entitas: any, tipeDialog: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_salesman?`, {
        headers: {
            Authorization: `Bearer ${vToken}`,
        },
        params: {
            entitas: kode_entitas,
            param1: 'all',
            param2: 'all',
        },
    });

    const listDaftarSalesman = response.data.data;
    return listDaftarSalesman;
};
//END
//=================================================================

//=================================================================
// API View TTD PPI
const loadFileGambarTTD = async (kode_entitas: any, kodeSO: any, KodeCust: any) => {
    const response = await axios.get(`${apiUrl}/erp/view_ttd_so`, {
        params: {
            entitas: kode_entitas,
            param1: kodeSO,
            param2: KodeCust,
        },
    });
    const fileGambarById = response.data.data;

    return fileGambarById;
};

//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PPI Daftar Customer
const DaftarCust = async (kode_entitas: any, vToken: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_customer_ppi?`, {
        headers: {
            Authorization: `Bearer ${vToken}`,
        },
        params: {
            entitas: kode_entitas,
        },
    });

    const listDaftarCustomer = response.data.data;
    return listDaftarCustomer;
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
// API yang digunakan pada Detail Rows Input PPI
const DetailNoFakturPpi = async (vToken: any, kode_entitas: any, kode_cust: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_nofaktur_ppi?`, {
        headers: {
            Authorization: `Bearer ${vToken}`,
        },
        params: {
            entitas: kode_entitas,
            param1: kode_cust,
        },
    });

    const listDaftarUangMuka = response.data.data;
    return listDaftarUangMuka;
};

const DetailNoFakturPpiPajak = async (vToken: any, kode_entitas: any, kode_cust: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_nofaktur_pajak_ppi?`, {
        headers: {
            Authorization: `Bearer ${vToken}`,
        },
        params: {
            entitas: kode_entitas,
            param1: kode_cust,
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
const ListEditPHUDetail = async (kode_entitas: any, kode_mu: string, kode_phu: string, kode_supp: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mu,
            param2: kode_phu,
            param3: kode_supp,
        },
    });

    const ListEditPHUDetail = response.data.data.detail;
    return ListEditPHUDetail;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPHUMaster = async (kode_entitas: any, kode_mu: string, kode_phu: string, kode_supp: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mu,
            param2: kode_phu,
            param3: kode_supp,
        },
    });

    const ListEditPHUMaster = response.data.data.master;
    return ListEditPHUMaster;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPHUJurnal = async (kode_entitas: any, kode_mu: string, kode_phu: string, kode_supp: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_phu?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mu,
            param2: kode_phu,
            param3: kode_supp,
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
// API yang digunakan cek user back date
const CekUserApp = async (kode_entitas: any, userid: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/users_app?`, {
        params: {
            entitas: kode_entitas,
            param1: userid,
        },
    });

    const listUserApp = response.data.data;
    return listUserApp;
};
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPPIMaster = async (kode_entitas: any, kode_ppi: string, batas_atas: string, batas_bawah: string, token: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/master_detail_ppi?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ppi,
            param2: batas_atas,
            param3: batas_bawah,
            // param4: kosong, // tipe transaksi pembayaran PHU (P : TUNAI, K: Transfer, W: Warkat, C: Cair, T: Tolak)
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const ListEditPPIMaster = response.data.data.master;
    return ListEditPPIMaster;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPPIDetail = async (kode_entitas: any, kode_ppi: string, batas_atas: string, batas_bawah: string, token: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/master_detail_ppi?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ppi,
            param2: batas_atas,
            param3: batas_bawah,
            // param4: kosong, // tipe transaksi pembayaran PHU (P : TUNAI, K: Transfer, W: Warkat, C: Cair, T: Tolak)
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const ListEditPPIDetail = response.data.data.detail;
    return ListEditPPIDetail;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menampilkan list EDIT PHU
const ListEditPPIJurnal = async (kode_entitas: any, kode_ppi: string, batas_atas: string, batas_bawah: string, token: string): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/master_detail_ppi?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ppi,
            param2: batas_atas,
            param3: batas_bawah,
            // param4: kosong, // tipe transaksi pembayaran PHU (P : TUNAI, K: Transfer, W: Warkat, C: Cair, T: Tolak)
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const ListEditPPIJurnal = response.data.data.jurnal;
    return ListEditPPIJurnal;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menganbil respone Imgaes
const GetTbImages = async (kode_entitas: string, kode_ppi: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_tb_images`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ppi,
        },
    });
    const get_tb_images = response.data.data;
    return get_tb_images;
};

const LoadImages = async (kode_entitas: any, kodePpi: any) => {
    const response = await axios.get(`${apiUrl}/erp/load_images`, {
        params: {
            entitas: kode_entitas,
            param1: kodePpi,
        },
    });
    const load_images = response.data.data;
    return load_images;
};
// END
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

//=================================================================
// API yang digunakan untuk menampilkan barcode
const GetBarcodeWarkat = async (kode_entitas: any, token: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/barcode_ppi?`, {
        params: {
            entitas: kode_entitas,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Bloking no rekening di Cust
const GetNamaBankCust = async (kode_entitas: any, token: any, kode_cust: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_nama_rek?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_cust,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Bloking no rekening di Cust
const GetKodeJual = async (kode_entitas: any) => {
    const response = await axios.get(`${apiUrl}/erp/kode_jual`, {
        params: {
            entitas: kode_entitas,
        },
    });
    const responseListKodeJual = response.data.data;

    const responseData = responseListKodeJual;
    return responseData;
};
//END
//=================================================================

import React from 'react';

const apiPpi = () => {
    return <div>apiPpi</div>;
};

export default apiPpi;

export {
    GetKodeJual,
    GetNamaBankCust,
    GetBarcodeWarkat,
    GetPeriode,
    DaftarAkunJurnal,
    GetTbImages,
    LoadImages,
    ListEditPPIJurnal,
    ListEditPPIDetail,
    ListEditPPIMaster,
    CekUserApp,
    CekNoWarkat,
    ListEditPHUJurnal,
    ListEditPHUMaster,
    ListEditPHUDetail,
    ListSubledger,
    ListCustFilter,
    CekSubledger,
    DaftarSupplierAll,
    DetailNoFakturPpi,
    DetailNoFakturPpiPajak,
    DaftarUangMuka,
    DaftarCust,
    DaftarAkunDebet,
    DataDetailDokDataFaktur,
    GetListPpiEffect,
    DaftarSalesman,
    loadFileGambarTTD,
};
