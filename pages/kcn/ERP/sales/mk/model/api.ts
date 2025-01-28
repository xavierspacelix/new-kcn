const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';

const GetPeriode = async (kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/get_info?`, {
        params: {
            entitas: kode_entitas,
        },
    });

    const responseData = response.data.data;
    return responseData;
};

const DataDetailDok = async (kode_mk: any, kode_entitas: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/list_detail_doc_mk?`, {
        params: {
            entitas: kode_entitas,
            param1: kode_mk,
        },
    });

    // console.log(response.data.data);
    const listDetailDok = response.data.data;

    return listDetailDok;
};

const GetListMk = async (paramObject: any) => {
    // console.log(paramObject);
    // const { kode_entitas, vNoMk, vTglAwal, vTglAkhir, vNoFaktur, vNoTtb, vNoCust, vNamaCust, vlimit } = paramObject;
    // const response = await axios.get(`${apiUrl}/erp/list_mk?`, {
    //     params: {
    //         entitas: kode_entitas,
    //         param1: vNoMk,
    //         param2: vTglAwal,
    //         param3: vTglAkhir,
    //         param4: vNoFaktur,
    //         param5: vNoTtb,
    //         param6: vNoCust,
    //         param7: vNamaCust,
    //         param8: vlimit,
    //     },
    // });
    // // console.log({
    // //     params: {
    // //         entitas: kode_entitas,
    // //         param1: vNoMk,
    // //         param2: vTglAwal,
    // //         param3: vTglAkhir,
    // //         param4: vNoFaktur,
    // //         param5: vNoTtb,
    // //         param6: vNoCust,
    // //         param7: vNamaCust,
    // //         param8: vlimit,
    // //     },
    // // });
    // const responseData = response.data.data;
    // // console.log(responseData);
    // return responseData;
};

const GetListMkEffect = async (paramObject: any) => {
    // console.log('dieksekusi');
    const { kode_entitas, vGagal, vNoTtb, vTglAwal, vTglAkhir, vNamaRelasi, vNoReff, vKodeGudang, vGrp, vKustom10, vStatus, vAlasan, vPilihanGrp, vLimit } = paramObject;
    const response = await axios.get(`${apiUrl}/erp/get_ttb?`, {
        params: {
            entitas: kode_entitas,
            gagal: vGagal, // Gagal
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
            limit: vLimit,
        },
    });
    const responseData = response.data.data;
    return responseData;
};

const ListCustFilter = async (kode_entitas: string, param1: string, param2: string, param3: string) => {
    const response = await axios.get(`${apiUrl}/erp/list_customer_mk_dlg?`, {
        params: {
            entitas: kode_entitas,
            param1: param1,
            param2: param2,
            param3: param3,
        },
    });
    // console.log('ListCustFilter ', {
    //     params: {
    //         entitas: kode_entitas,
    //         param1: param1,
    //         param2: param2,
    //         param3: param3,
    //     },
    // });
    const result = response.data.data;
    // console.log(result);

    return result;
};

const ListDlgFj = async (kode_entitas: string, param1: string, param2: string, param3: string) => {
    const response = await axios.get(`${apiUrl}/erp/list_fj_dialog?`, {
        params: {
            entitas: kode_entitas,
            param1: param1,
            param2: param2,
            param3: param3,
        },
    });
    // console.log('ListDlgFj ', {
    //     params: {
    //         entitas: kode_entitas,
    //         param1: param1,
    //         param2: param2,
    //         param3: param3,
    //     },
    // });
    const result = response.data;
    return result;
};

const ListDlgTtb = async (kode_entitas: string, param1: string, param2: string, param3: string, param4: string) => {
    const response = await axios.get(`${apiUrl}/erp/list_ttb_dialog?`, {
        params: {
            entitas: kode_entitas,
            param1: param1,
            param2: param2,
            param3: param3,
            param4: param4,
        },
    });
    const result = response.data;
    return result;
};

const GetListDlgMkTtb = async (paramObject: any) => {
    const { entitas, vKodeCust, vKodeFj, vKodeTtb, vKategori, vKelompok, vMerk, vNoItem, vNamaBarang } = paramObject;
    //    console.log('masuk pa eko')
    // console.log(paramObject);
    const response = await axios.get(`${apiUrl}/erp/list_dlg_ttb_mk?`, {
        params: {
            entitas: entitas,
            param1: vKodeCust,
            param2: vKodeFj,
            param3: vKodeTtb,
            param4: vKategori,
            param5: vKelompok,
            param6: vMerk,
            param7: vNoItem,
            param8: vNamaBarang,
        },
    });
    // console.log(response);
    // console.log('masuk pa eko 222');
    // console.log('ListDlgTtb ', {
    //     params: {
    //         entitas: entitas,
    //         param1: vKodeCust,
    //         param2: vKodeFj,
    //         param3: vKodeTtb,
    //         param4: vKategori,
    //         param5: vKelompok,
    //         param6: vMerk,
    //         param7: vNoItem,
    //         param8: vNamaBarang,
    //     },
    // });

    const responseData = response.data.data;
    // console.log(responseData);
    return responseData;
};

export {
    ListDlgTtb,
    // RefreshDetailSjAPI,
    ListCustFilter,
    ListDlgFj,
    // RefreshDetailSjItemAPI,
    DataDetailDok,
    GetPeriode,
    // GetMasterAlasan,
    GetListMk,
    GetListMkEffect,
    GetListDlgMkTtb,
    // GetListEditTtb,
    // GetDlgDetailSjItem,
    // PostSimpanTtb,
    // PostSimpanAudit,
    // PatchUpdateTtb,
    // GetListTtbEffect,
};
