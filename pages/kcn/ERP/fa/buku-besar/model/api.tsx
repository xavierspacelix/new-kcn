const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';

import React from 'react'

export default function api() {
  return (
    <div>api</div>
  )
}


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
// API List Buku Besar
const ListBukuBesar = async (kode_entitas: any, kode_akun: string, kode_jual: string, tgl_awal: string, tgl_akhir: string, token: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_buku_besar?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_akun, // kode akun
            param2: kode_jual, // kode jual
            param3: tgl_awal, // tgl awal
            param4: tgl_akhir, // tgl akhir
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const ListBukuBesar = response.data.data;
    return ListBukuBesar;
};

//END
//=================================================================

//=================================================================
// API List Saldo Awal Buku Besar
const SaldoAwal = async (kode_entitas: any, kode_akun: string, tgl_awal: string, token: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/total_buku_besar?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_akun, // kode akun
            param2: tgl_awal, // kode awal
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const ListBukuBesar = response.data.data;
    return ListBukuBesar;
};

//END
//=================================================================

//=================================================================
// API Master Divisi
const MasterDivisi = async (kode_entitas: any, token: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/master_divisi?`, {
        params: {
            entitas: kode_entitas,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const MasterDivisi = response.data.data;
    return MasterDivisi;
};

//END
//=================================================================

//=================================================================
// API Cek Periode
const GetPeriode = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/get_info?`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const responseData = response?.data.data;
    return responseData;
};

//END
//=================================================================

export { GetPeriode, SaldoAwal, MasterDivisi, ListBukuBesar, DaftarAkunKredit };
