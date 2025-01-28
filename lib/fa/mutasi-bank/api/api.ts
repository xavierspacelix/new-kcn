import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

//=================================================================
// API yang digunakan untuk List Akun Kas Mutasi Bank
const DaftarAkunKredit = async (kode_entitas: any, token: any): Promise<any[]> => {
    if (kode_entitas || token) {
        const response = await axios.get(`${apiUrl}/erp/list_akun_kas_mutasi_bank?`, {
            params: {
                entitas: kode_entitas,
                // param1: 'kas',
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const listDaftarAkunKredit = response.data.data;
        return listDaftarAkunKredit;
    } else {
        return [];
    }
};
//END
//=================================================================

//=================================================================
// API List Mutasi Bank Via API
const GetListMutasiBank = async (paramObject: any): Promise<any[]> => {
    // console.log('paramObject GetListTabNoRek = ', kode_entitas, token);
    if (paramObject.kode_entitas || paramObject.token) {
        const response = await axios.get(`${apiUrl}/erp/list_mutasi_bank?`, {
            params: {
                entitas: paramObject.kode_entitas,
                param1: paramObject.tgl_awal,
                param2: paramObject.tgl_akhir,
                param3: paramObject.bank,
                param4: paramObject.no_rek,
                param5: paramObject.nama_pemilik,
                param6: paramObject.keterangan,
                param7: paramObject.nama_cust,
                param8: paramObject.rek_akun_kas,
                param9: paramObject.mutasi_transaksi,
                param10: paramObject.posting_rekonsil,
                param11: paramObject.tipe_dok,
                param12: paramObject.no_rek_tab,
            },
            headers: {
                Authorization: `Bearer ${paramObject.token}`,
            },
        });

        const ListMutasiBank = response.data.data;
        return ListMutasiBank;
    } else {
        return [];
    }
};
//END
//=================================================================

//=================================================================
// API Untuk Cek Akun Kas berdasarkan bank mutasi
const GetCekAkunKasBank = async (kode_entitas: any, token: any, kode_akun: any) => {
    if (kode_entitas || token) {
        const response = await axios.get(`${apiUrl}/erp/cek_akun_kas_mutasi_bank?`, {
            params: {
                entitas: kode_entitas,
                param1: kode_akun,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const GetCekAkunKasBank = response.data.data;
        return GetCekAkunKasBank;
    } else {
        return null;
    }
};
//END
//=================================================================

//=================================================================
// API Untuk Tab di Header List
const GetListTabNoRek = async (kode_entitas: any, token: any) => {
    if (kode_entitas || token) {
        const response = await axios.get(`${apiUrl}/erp/list_tab_no_rek?`, {
            params: {
                entitas: kode_entitas,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const GetCekAkunKasBank = response.data.data;
        return GetCekAkunKasBank;
    } else {
        return null;
    }
};
//END
//=================================================================

//=================================================================
// API Untuk Cek Data Penerimaan di Tb Keuangan
const GetCekPenerimaanWarkatDialog = async (paramObject: any) => {
    if (paramObject.kode_entitas || paramObject.token) {
        const response = await axios.get(`${apiUrl}/erp/cek_penerimaan_warkat_dialog?`, {
            params: {
                entitas: paramObject.kode_entitas,
                param1: paramObject.noRekeningApi,
                param2: paramObject.tglTransaksiMutasi,
                param3: paramObject.jumlahMu,
                param4: paramObject.description,
                param5: paramObject.dokumen,
            },
            headers: {
                Authorization: `Bearer ${paramObject.token}`,
            },
        });

        const GetCekPenerimaanWarkatDialog = response.data.data;
        return GetCekPenerimaanWarkatDialog;
    } else {
        return null;
    }
};
//END
//=================================================================

//=================================================================
// API Untuk Cek Daftar Penerimaan Warkat di Tb Keuangan
const GetDaftarPenerimaanWarkat = async (paramObject: any, recordCount: any) => {
    if (paramObject.kode_entitas || paramObject.token) {
        const response = await axios.get(`${apiUrl}/erp/daftar_penerimaan_warkat?`, {
            params: {
                entitas: paramObject.kode_entitas,
                param1: paramObject.noRekeningApi,
                param2: paramObject.tglTransaksiMutasi,
                param3: paramObject.jumlahMu,
                param4: paramObject.description,
                param5: paramObject.dokumen,
                param6: 'B',
                recordCount: recordCount,
            },
            headers: {
                Authorization: `Bearer ${paramObject.token}`,
            },
        });

        const GetDaftarPenerimaanWarkat = response.data.data;
        return GetDaftarPenerimaanWarkat;
    } else {
        return null;
    }
};
//END
//=================================================================

//=================================================================
// API Untuk Cek Daftar Penerimaan Warkat di Tb Keuangan
const GetDaftarPenerimaanWarkatPhu = async (paramObject: any, recordCount: any) => {
    if (paramObject.kode_entitas || paramObject.token) {
        const response = await axios.get(`${apiUrl}/erp/daftar_penerimaan_warkat?`, {
            params: {
                entitas: paramObject.kode_entitas,
                param1: paramObject.noRekeningApi,
                param2: paramObject.tglTransaksiMutasi,
                param3: paramObject.jumlahMu,
                param4: paramObject.description,
                param5: paramObject.dokumen,
                param6: 'W',
                recordCount: recordCount,
            },
            headers: {
                Authorization: `Bearer ${paramObject.token}`,
            },
        });

        const GetDaftarPenerimaanWarkat = response.data.data;
        return GetDaftarPenerimaanWarkat;
    } else {
        return null;
    }
};
//END
//=================================================================

//=================================================================
// API yang digunakan untuk API Bank, Close dan Release
const PatchReleaseCloseApiBank = async (paramObject: any, token: any) => {
    if (paramObject.kode_entitas || token) {
        const response = await axios.post(`${apiUrl}/erp/update_api_bank`, paramObject, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const PatchReleaseCloseApiBank = response.data;
        return PatchReleaseCloseApiBank;
    } else {
        return null;
    }
};
// END
//=================================================================

//=================================================================
// API yang digunakan untuk API Bank, Close dan Release
const UpdateCatatanMutasiBank = async (paramObject: any) => {
    if (paramObject.kode_entitas || paramObject.token) {
        const response = await axios.post(`${apiUrl}/erp/update_catatan_mutasi_bank`, paramObject, {
            headers: {
                Authorization: `Bearer ${paramObject.token}`,
            },
        });
        const UpdateCatatanMutasiBank = response.data;
        return UpdateCatatanMutasiBank;
    } else {
        return null;
    }
};
// END
//=================================================================

export {
    UpdateCatatanMutasiBank,
    GetDaftarPenerimaanWarkatPhu,
    PatchReleaseCloseApiBank,
    GetDaftarPenerimaanWarkat,
    GetCekPenerimaanWarkatDialog,
    GetListTabNoRek,
    GetCekAkunKasBank,
    GetListMutasiBank,
    DaftarAkunKredit,
};
