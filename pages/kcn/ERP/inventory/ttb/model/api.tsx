const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';

/*
REDME
-- DataDetailDok -> API untuk menampilkan detail dok data TTB pada saat tombol detail dok di pilih, 
-- GetPeriode --> API untuk menampilkan periode yang sedang berjalan saat ini, 
    1. digunakan untuk membloking pada saat akan melakukan edit data TTB kalo legih kecil dari priode berjalan akan terbloking.
-- GetMasterAlasan -> API untuk menampilkan data master Alasan pada filter
-- GetListTtb --> API untuk menampilkan data list ttb sesuai filter
-- GetListEditTtb --> API untuk menampilkan data list untuk edit data
-- GetDlgDetailSjItem --> API untuk menampilkan daftar dialog detail data item SJ
-- PostSimpanTtb --> API untuk simpan data TTB
-- PostSimpanAudit -- > API untuk simpan data history data ttb ke table audit
-- PatchUpdateTtb --> API untuk update data TTB

*/

//=================================================================
// API yang digunakan pada FormTtbList

import React from 'react'

export default function api() {
  return (
    <div>api</div>
  )
}

const DataDetailDok = async (kode_ttb: any, kode_entitas: any, plagFilterTab: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_detail_dok_ttb?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ttb,
            param2: plagFilterTab === 'Baru' ? '' : 'approve',
        },
    });

    const listDetailDok = response.data.data;
    return listDetailDok;
};

const GetPeriode = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/get_info?`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const responseData = response.data.data;
    return responseData;
};

const GetListTtb = async (paramObject: any, jenis: any) => {
    const { kode_entitas, vGagal, vNoTtb, vTglAwal, vTglAkhir, vNamaRelasi, vNoReff, vKodeGudang, vGrp, vKustom10, vStatus, vAlasan, vPilihanGrp, vLimit, vPembatalan } = paramObject;
    const response = await axios.get(`${apiUrl}/erp/get_ttb?`, {
        params: {
            entitas: kode_entitas,
            gagal: vGagal, // Gagal
            pembatalan: vPembatalan, // Pembatalan
            no_ttb: vNoTtb, // No TTB
            tanggal_awal: vTglAwal, // Tanggal Awal
            tanggal_akhir: vTglAkhir, // Tanggal Akhir
            nama_relasi: vNamaRelasi, // nama Relasi
            no_reff: vNoReff, // No Reff
            kode_gudang: vKodeGudang, // Kode Gudang
            grp: vGrp, // Grp
            kustom10: vKustom10, // Kelompok
            status: vStatus, // Status Dokumen
            alasan: vAlasan, // Alasan
            pilihan_grp: vPilihanGrp, // Pilihan Grp Y N All
            jenis: jenis,
            limit: vLimit,
        },
    });
    const responseData = response.data.data;
    return responseData;
};

const GetListTtbEffect = async (paramObject: any, jenis: any) => {
    const { kode_entitas, vGagal, vNoTtb, vTglAwal, vTglAkhir, vNamaRelasi, vNoReff, vKodeGudang, vGrp, vKustom10, vStatus, vAlasan, vPilihanGrp, vLimit, vPembatalan } = paramObject;
    const response = await axios.get(`${apiUrl}/erp/get_ttb?`, {
        params: {
            entitas: kode_entitas,
            gagal: vGagal, // Gagal
            pembatalan: vPembatalan, // Pembatalan
            no_ttb: vNoTtb, // No TTB
            tanggal_awal: vTglAwal, // Tanggal Awal
            tanggal_akhir: vTglAkhir, // Tanggal Akhir
            nama_relasi: vNamaRelasi, // nama Relasi
            no_reff: vNoReff, // No Reff
            kode_gudang: vKodeGudang, // Kode Gudang
            grp: vGrp, // Grp
            kustom10: vKustom10, // Kelompok
            status: vStatus, // Status Dokumen
            alasan: vAlasan, // Alasan
            pilihan_grp: vPilihanGrp, // Pilihan Grp Y N All
            jenis: jenis,
            limit: vLimit,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada FormTtb
const GetListEditTtb = async (kode_entitas: any, kode_ttb: any, jenis: any) => {
    const response = await axios.get(`${apiUrl}/erp/list_edit_ttb`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ttb,
            param2: jenis,
        },
    });

    const responsData = response.data;
    return responsData;
};

const GetDlgDetailSjItem = async (kode_entitas: any, kode_cust: any, entitas: any) => {
    const response1 = await axios.get(`${apiUrl}/erp/dlg_detail_sj_item`, {
        params: {
            entitas: kode_entitas,
            param1: kode_cust,
            param2: '%',
            param3: '%',
            param4: '%',
            param5: entitas,
        },
    });
    const responsData = response1.data.data;
    return responsData;
};

const PostSimpanTtb = async (jsonData: any) => {
    const response = await axios.post(`${apiUrl}/erp/simpan_ttb`, jsonData);
    return response;
};

const PostSimpanTempTtb = async (jsonData: any, token: any) => {
    const response = await axios.post(`${apiUrl}/erp/simpan_ttb_temp`, jsonData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

const PostSimpanAudit = async (bodyObject: any) => {
    const { kode_entitas, kode_audit, dokumen, kode_dokumen, no_dokumen, tanggal, proses, diskripsi, userid, system_user, system_ip, system_mac } = bodyObject;
    const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
        entitas: kode_entitas,
        kode_audit: kode_audit,
        dokumen: dokumen,
        kode_dokumen: kode_dokumen,
        no_dokumen: no_dokumen,
        tanggal: tanggal,
        proses: proses,
        diskripsi: diskripsi,
        userid: userid, // userid login web
        system_user: system_user, //username login
        system_ip: system_ip, //ip address
        system_mac: system_mac, //mac address
    });
    return auditResponse;
};

const PatchUpdateTtb = async (jsonData: any) => {
    const response = await axios.patch(`${apiUrl}/erp/update_ttb`, jsonData);
    return response;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada FormTtb dan FormTtbList
const GetMasterAlasan = async (kode_entitas: any): Promise<any[]> => {
    const responseAlasan = await axios.get(`${apiUrl}/erp/master_alasan`, {
        params: {
            entitas: kode_entitas,
        },
    });
    const masterAlasan = responseAlasan.data.data;
    return masterAlasan;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Detail daftar SJ Item
const RefreshDetailSjItemAPI = async (kode_entitas: string, custSelectedKode: any, refKodeCust: any, entitas: any) => {
    const response = await axios.get(`${apiUrl}/erp/dlg_detail_sj_item?`, {
        params: {
            entitas: kode_entitas,
            param1: custSelectedKode === '' ? refKodeCust : custSelectedKode,
            param2: '%',
            param3: '%',
            param4: '%',
            param5: entitas,
        },
    });
    const result = response.data;
    return result;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk Filter Data Customer
const ListCustFilter = async (kode_entitas: string, param1: string, param2: string, param3: string) => {
    const response = await axios.get(`${apiUrl}/erp/list_cust_so?`, {
        params: {
            entitas: kode_entitas,
            param1: param1,
            param2: param2,
            param3: param3,
        },
    });
    const result = response.data;
    return result;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Detail daftar SJ Item
const RefreshDetailSjAPI = async (kode_entitas: string, refKodeCust: any, custSelectedKode: any, entitas: any) => {
    const response = await axios.get(`${apiUrl}/erp/dlg_detail_sj?`, {
        params: {
            entitas: kode_entitas,
            param1: refKodeCust === '' || refKodeCust === null || refKodeCust === undefined ? custSelectedKode : refKodeCust,
            param2: entitas,
        },
    });
    const result = response.data;
    return result;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk menganbil respone Imgaes
const GetTbImages = async (kode_entitas: string, kode_ttb: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_tb_images`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ttb,
        },
    });
    const get_tb_images = response.data.data;
    return get_tb_images;
};

const LoadImages = async (kode_entitas: any, kodeTtb: any) => {
    const response = await axios.get(`${apiUrl}/erp/load_images`, {
        params: {
            entitas: kode_entitas,
            param1: kodeTtb,
        },
    });
    const load_images = response.data.data;
    return load_images;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk Detail daftar SJ Item
const GudangTtb = async (kode_entitas: string, tipe: any, userid: any, entitas: any, kode_user: any) => {
    const response = await axios.get(`${apiUrl}/erp/gudang_ttb?`, {
        params: {
            entitas: kode_entitas,
            param1: tipe,
            param2: userid,
            param3: entitas,
            param4: kode_user,
        },
    });
    const result = response.data.data;
    return result;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk Detail daftar SJ Item
const PatchPembatalan = async (paramObject: any, token: any) => {
    const response = await axios.patch(`${apiUrl}/erp/pembatalan_ttb`, paramObject, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk menyimpan keterangan SC
const SimpanKeteranganSc = async (paramObject: any, token: any) => {
    const response = await axios.post(`${apiUrl}/erp/simpan_ket_sc`, paramObject, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk menyimpan keterangan SC
const UpdateKeteranganSc = async (paramObject: any, token: any) => {
    const response = await axios.patch(`${apiUrl}/erp/update_ket_sc`, paramObject, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk Mencari data di tabel master gagal
const GetTtbMasterGagal = async (kode_entitas: string, kode_ttb: string) => {
    const response = await axios.get(`${apiUrl}/erp/ttb_gagal?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_ttb,
        },
    });
    const result = response.data.data;
    return result;
};
// END
//=================================================================

export {
    GetTtbMasterGagal,
    SimpanKeteranganSc,
    UpdateKeteranganSc,
    PatchPembatalan,
    GudangTtb,
    PostSimpanTempTtb,
    LoadImages,
    GetTbImages,
    RefreshDetailSjAPI,
    ListCustFilter,
    RefreshDetailSjItemAPI,
    DataDetailDok,
    GetPeriode,
    GetMasterAlasan,
    GetListTtb,
    GetListEditTtb,
    GetDlgDetailSjItem,
    PostSimpanTtb,
    PostSimpanAudit,
    PatchUpdateTtb,
    GetListTtbEffect,
};
