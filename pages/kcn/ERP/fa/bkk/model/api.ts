const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import moment from 'moment';
import { frmNumber } from '@/utils/routines';
import { log } from 'console';

// const token = sessionData?.token ?? '';

const GetPeriode = async (kode_entitas: any, token: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/get_info?`, {
        params: {
            entitas: kode_entitas,
        },
        headers: { Authorization: `Bearer ${token}` },
    });

    const responseData = response.data.data;
    return responseData;
};

const DataDetailDok = async (kode_dok: any, jenisTab: any, kode_entitas: any, token: any): Promise<any[]> => {
    const response = await axios.get(`${apiUrl}/erp/detail_dok_bkk?`, {
        params: {
            entitas: kode_entitas,
            param1: jenisTab,
            param2: kode_dok,
        },
        headers: { Authorization: `Bearer ${token}` },
    });

    const listDetailDokumen = response.data.data;

    return listDetailDokumen;
};

// const BkListApi = async (paramsList: any, token: any, onProgress: (progress: number) => void) => {
//     try {
//         onProgress?.(10);
//         const responseData = await axios.get(`${apiUrl}/erp/list_pengeluaran_lain_bk?`, {
//             params: paramsList,
//             headers: { Authorization: `Bearer ${token}` },
//             onDownloadProgress: (progressEvent: any) => {
//                 const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 onProgress(percentCompleted);
//             },
//         });
//         // const responseDataBkkList = responseData.data.data;

//         const responseDataBkkList: any[] = responseData.data.data.map((field: any) => ({
//             ...field,
//             debet_rp: parseFloat(field.debet_rp),
//             kredit_rp: parseFloat(field.kredit_rp),
//             jumlah_rp: parseFloat(field.jumlah_rp),
//             jumlah_mu: parseFloat(field.jumlah_mu),
//         }));
//         onProgress?.(90);

//         return responseDataBkkList;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

let progressInterval: NodeJS.Timer;
const BkListApi = async (paramsList: any, token: any, onProgress: (progress: number) => void) => {
    // console.log('paramsList', paramsList);
    let progressValue = 0;

    try {
        progressInterval = setInterval(() => {
            if (progressValue < 90) {
                progressValue += 1;
                onProgress(progressValue);
            }
        }, 20);

        const responseData = await axios.get(`${apiUrl}/erp/list_pengeluaran_lain_bk?`, {
            params: paramsList,
            headers: { Authorization: `Bearer ${token}` },
            onDownloadProgress: (progressEvent: any) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });

        // Bersihkan interval progress
        clearInterval(progressInterval);

        // Set progress ke 100% setelah data selesai diproses
        onProgress(100);

        const responseDataBkkList: any[] = responseData.data.data.map((field: any) => ({
            ...field,
            debet_rp: parseFloat(field.debet_rp),
            kredit_rp: parseFloat(field.kredit_rp),
            jumlah_rp: parseFloat(field.jumlah_rp),
            jumlah_mu: parseFloat(field.jumlah_mu),
        }));

        return responseDataBkkList;
    } catch (error) {
        // Bersihkan interval progress jika terjadi error
        clearInterval(progressInterval);
        console.error('Error fetching data:', error);
        throw error;
    }
};

const PraBkkEdit = async (paramList: any, token: any) => {
    try {
        const responseData = await axios.get(`${apiUrl}/erp/master_detail_jurnal_kredit_pengeluaran_lain_bk?`, {
            params: paramList,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // const responseDataPraBkk = responseData.data.data;
        // console.log(responseData.data.data, 'responseDataPraBkk');

        const { master, detail, kredit } = responseData.data.data;
        const modifiedMaster = master.map((item: any) => {
            return {
                ...item,
                kurs: frmNumber(parseFloat(item.kurs).toFixed(2)),
                // jumlah_mu: parseFloat(item.jumlah_mu),
                jumlah_mu: parseFloat(item.jumlah_mu),
                // jumlah_mu: frmNumber(item.jumlah_mu),

                // balance: frmNumber(parseFloat(item.balance).toFixed(2)),
            };
        });
        // console.log(modifiedMaster, 'modifiedMaster');
        const modifiedDetail = detail.map((item: any) => {
            return {
                ...item,
                // kurs: parseFloat(item.kurs).toFixed(2),
                jumlah_mu: parseFloat(item.jumlah_mu),
                // jumlah_mu: frmNumber(parseFloat(item.jumlah_mu).toFixed(2)),
                // balance: frmNumber(item.balance),
            };
        });
        // console.log(modifiedDetail, 'modifiedDetail');
        const objPraBkkEdit = {
            master: modifiedMaster,
            detail: modifiedDetail,
        };

        return objPraBkkEdit;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export { GetPeriode, DataDetailDok, BkListApi, PraBkkEdit };
