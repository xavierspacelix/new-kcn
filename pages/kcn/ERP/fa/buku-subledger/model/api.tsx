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
const DaftarAkunKredit = async (paramObject: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_akun_global?`, {
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.tipeDialog,
        },
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
    });

    const listDaftarAkunKredit = response.data.data;
    return listDaftarAkunKredit;
};
//END
//=================================================================

//=================================================================
// API Master Divisi
const MasterDivisi = async (paramObject: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/master_divisi?`, {
        params: {
            entitas: paramObject.kode_entitas,
        },
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
    });

    const MasterDivisi = response.data.data;
    return MasterDivisi;
};

//END
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
    const result = response.data.data;
    return result;
};
//END
//=================================================================

//=================================================================
// API yang digunakan pada Form Input PHU Daftar Supplier
const DaftarSupplier = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/m_supplier?`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const listDaftarSupplier = response.data.data;
    return listDaftarSupplier;
};
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
// API List Buku Subledger
const ListBukuSubledger = async (paramObject: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_buku_subledger?`, {
        params: {
            entitas: paramObject.kode_entitas,
            param1: paramObject.kode_akun, // kode akun
            param2: paramObject.kode_subledger, // kode Subledger
            param3: paramObject.kode_jual, // Kode Jual
            param4: paramObject.no_kontrak_um, // No Kontrak
            param5: paramObject.tgl_awal, //  Tgl Awal
            param6: paramObject.tgl_akhir, // Tgl Akhir
        },
        headers: {
            Authorization: `Bearer ${paramObject.token}`,
        },
    });

    const ListBukuBesar = response.data.data;
    return ListBukuBesar;
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

export { GetPeriode, DaftarUangMuka, ListBukuSubledger, ListSubledger, DaftarSupplier, ListCustFilter, MasterDivisi, DaftarAkunKredit };
