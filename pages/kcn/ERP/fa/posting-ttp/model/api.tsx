const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';

import React from 'react'

export default function api() {
  return (
    <div>api</div>
  )
}


//=================================================================
// API yang digunakan pada FormPhuList
const GetListPostingTtp = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/list_posting_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.vNoTtp,
            param2: paramObject.vTglAwal, //tanggalHariIni
            param3: paramObject.vTglAkhir, //tanggalAkhirBulan
            param4: paramObject.vNamaCust,
            param5: paramObject.vNamaSalesman,
            param6: paramObject.vProsesPosting,
            param7: paramObject.vPengajuanCU,
            param8: paramObject.vPengajuanPembatalan,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada FormPhuList
const GetMasterDetailPosting = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/master_detail_posting_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_dokumen,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API untuk mengambil decode gambar spesimen
const GetLoadGambarByName = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/load_gambar_byName?`, {
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_cust,
            param2: paramObject.filePendukung,
        },
    });
    const responseData = response.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menyimpan keterangan SC
const UpdateCatatan = async (paramObject: any, token: any) => {
    const response = await axios.patch(`${apiUrl}/erp/update_catatan`, paramObject, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
// END
//=================================================================

//=================================================================
// API yang digunakan pada FormPhuList
const GetCetKodeDokumenPPI = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/cek_no_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_dokumen,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menyimpan keterangan SC
const UpdatePengajuanApp = async (paramObject: any, token: any) => {
    const response = await axios.patch(`${apiUrl}/erp/approval_pengajuan_ttp`, paramObject, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk Edit Posting TTP
const GetEditTtp = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/edit_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_dokumen,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetDaftarFaktur = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/list_faktur_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_cust,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetCekNoTTP = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/cek_no_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.no_ttp,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetPreferensiPosting = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/prefrensi_posting_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_cust,
            param2: paramObject.kode_sales,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetSetting = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/setting?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetNonAktifCust = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/non_aktif_cust?`, {
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_cust,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetDaftarMutasi = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/list_mutasi_bank_via_api_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            param1: paramObject.nilai_transfer,
            param2: paramObject.no_rek,
            param3: paramObject.tgl_awal,
            param4: paramObject.tgl_akhir,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetDetailTtp = async (paramObject: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_detail_ttp?`, {
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.dok,
            param2: paramObject.kode_dokumen,
            param3: paramObject.jenis,
            param4: paramObject.no_rek,
            param5: paramObject.struk,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetPreferensi = async (kode_entitas: any) => {
    const response = await axios.get(`${apiUrl}/erp/preferensi?`, {
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
// API yang digunakan untuk Daftar Faktur
const GetWaAkunting = async (token: any, kode_entitas: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_wa-akunting?`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
// API yang digunakan untuk Daftar Faktur
const GetWagwServer = async (token: any, kode_entitas: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_wagw-server?`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
// API yang digunakan untuk Daftar Faktur
const GetHp2Cust = async (token: any, kode_entitas: any, kode_cust: any) => {
    const response = await axios.get(`${apiUrl}/erp/get_hp2_cust?`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            entitas: kode_entitas,
            param1: kode_cust,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk menyimpan keterangan SC
const UpdateCustBlApi = async (paramObjectBl: any, token: any) => {
    const response = await axios.patch(`${apiUrl}/erp/update_cust_bl`, paramObjectBl, {
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
const UpdateCustBl60Api = async (paramObjectBl: any, token: any) => {
    const response = await axios.patch(`${apiUrl}/erp/update_cust_bl60`, paramObjectBl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk Daftar Faktur
const GetListPostingTtpByKode = async (token: any, kode_entitas: any, kode_dokumen: any) => {
    const response = await axios.get(`${apiUrl}/erp/list_posting_ttp_by_kode?`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            entitas: kode_entitas,
            param1: kode_dokumen,
        },
    });
    const responseData = response.data.data;
    return responseData;
};
//END
//=================================================================

export {
    GetListPostingTtpByKode,
    UpdateCustBl60Api,
    UpdateCustBlApi,
    GetHp2Cust,
    GetWagwServer,
    GetWaAkunting,
    GetPreferensi,
    GetDetailTtp,
    GetDaftarMutasi,
    GetNonAktifCust,
    GetSetting,
    GetPreferensiPosting,
    GetCekNoTTP,
    GetDaftarFaktur,
    GetEditTtp,
    UpdatePengajuanApp,
    GetCetKodeDokumenPPI,
    UpdateCatatan,
    GetLoadGambarByName,
    GetMasterDetailPosting,
    GetListPostingTtp,
};
