import swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
import withReactContent from 'sweetalert2-react-content';
import { select } from '@syncfusion/ej2-base';
import { createSpinner, hideSpinner } from '@syncfusion/ej2-react-popups';
import { Internationalization } from '@syncfusion/ej2-base';

interface RoutinesProps {
    userid: any;
    kode_entitas: any;
    kode_user: any;
}

export async function showLoading() {
    swal.fire({
        padding: '3em',
        imageUrl: '/assets/images/loader-1.gif',
        imageWidth: 170,
        imageHeight: 170,
        imageAlt: 'Custom image',
        background: 'rgba(0,0,0,.0)',
        backdrop: 'rgba(0,0,0,0.0)',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
    });
}

export const generateNU = async (entitas: string, last_num: string, id: string, period: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    // const [skode, setskode] = useState<any>('');
    // const [surut, setsurut] = useState<any>('');
    let skode = '';
    let surut = '';

    try {
        const response = await axios.get(`${apiUrl}/erp/get_info?`, {
            params: {
                entitas: entitas,
            },
        });

        const responseData = response.data.data;
        const transformedData_getinfo = responseData.map((item: any) => ({
            kode: item.kode,
        }));
        //setskode (transformedData_getinfo[0].kode);
        skode = transformedData_getinfo[0].kode;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

    try {
        let speriode = moment(period).format('YYYYMM');
        let splastnum = '0';
        let prefix = '';
        let vperiodetahun = parseInt(moment(period).format('YY')) - 12;
        let vperiodebulan = parseInt(moment(period).format('MM')) + 5;

        if (last_num === '') {
            splastnum = '0';
        } else {
            prefix = skode + id + '.' + vperiodetahun.toString().padStart(2, '0') + vperiodebulan.toString().padStart(2, '0') + '.';

            if (last_num.substring(0, 10) === prefix && last_num.length === 15) {
                splastnum = last_num.substring(10, 15);
            } else {
                splastnum = '0';
            }
        }

        const response = await axios.get(`${apiUrl}/erp/get_nu?`, {
            params: {
                entitas: entitas,
                last_num: splastnum,
                id: id,
                period: period,
            },
        });

        const responseData = response.data.data;

        const transformedData_getNU = responseData.map((item: any) => ({
            pNewnum: item.pNewnum,
        }));

        // setsurut (transformedData_getNU[0].pNewnum);
        surut = transformedData_getNU[0].pNewnum;

        let nodok = '';
        if (last_num === '') {
            nodok = skode + id + '.' + vperiodetahun.toString().padStart(2, '0') + vperiodebulan.toString().padStart(2, '0') + '.' + surut.toString().padStart(5, '0');
        }

        return nodok;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const FillFromSQLProps = ({ userid, kode_entitas, kode_user }: RoutinesProps) => {};

// export const FillFromSQL = async (entitas: string, fld: string) =>  {
export const FillFromSQL = async (entitas: string, fld: string, kode_user?: any, token?: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    if (fld === 'departemen') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_dept?`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getdept = responseData.map((item: any) => ({
                kode_dept: item.kode_dept,
                no_dept_dept: item.no_dept,
                nama_dept: item.nama_dept,
            }));

            return transformedData_getdept;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'gudang') {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_gudang_forfilter?`, {
                params: {
                    entitas: entitas,
                    param1: kode_user,
                },
            });
            const responseData = response.data.data;
            const transformedData_getGudang = responseData.map((item: any) => ({
                kode_gudang: item.kode_gudang,
                nama_gudang: item.nama_gudang,
            }));

            return transformedData_getGudang;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'gudang_pabrik') {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_gudang_pabrik?`, {
                params: {
                    entitas: entitas,
                    param1: kode_user,
                },
            });
            const responseData = response.data.data;
            const transformedData_getGudang = responseData.map((item: any) => ({
                kode_gudang: item.kode_gudang,
                nama_gudang: item.nama_gudang,
            }));

            return transformedData_getGudang;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'pengiriman via') {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_via_pengiriman?`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getvia = responseData.map((item: any) => ({
                via: item.via,
            }));

            return transformedData_getvia;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'kategori') {
        try {
            const response = await axios.get(`${apiUrl}/erp/kategori`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getkategori = responseData.map((item: any) => ({
                grp: item.grp,
            }));

            return transformedData_getkategori;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'kelompok') {
        try {
            const response = await axios.get(`${apiUrl}/erp/kelompok`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getkelompok = responseData.map((item: any) => ({
                kel: item.kel,
            }));

            return transformedData_getkelompok;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'merk') {
        try {
            const response = await axios.get(`${apiUrl}/erp/merk`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getmerk = responseData.map((item: any) => ({
                merk: item.merk,
            }));

            return transformedData_getmerk;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'pajak') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_pajak`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getpajak = responseData.map((item: any) => ({
                kode_pajak: item.kode_pajak,
                catatan: item.catatan,
            }));

            return transformedData_getpajak;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'gudang_surat_jalan') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_gudang_surat_jalan?`, {
                params: {
                    entitas: entitas,
                    param1: kode_user,
                    param2: 'TTB',
                    param3: 'Y',
                },
            });
            const responseData = response.data.data;
            const transformedData_getGudang = responseData.map((item: any) => ({
                kode_gudang: item.kode_gudang,
                nama_gudang: item.nama_gudang,
            }));

            return transformedData_getGudang;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'kendaraankirim') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_kendaraan_kirim`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getnopol = responseData.map((item: any) => ({
                nopol: item.nopol,
            }));

            return transformedData_getnopol;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'pengemudi') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_pengemudi`, {
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;
            const transformedData_getpengemudi = responseData.map((item: any) => ({
                pengemudi: item.pengemudi,
            }));

            return transformedData_getpengemudi;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'pph23') {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_pph`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    entitas: entitas,
                },
            });
            const responseData = response.data.data;

            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'mu') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_mu`, {
                params: {
                    entitas: entitas,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.data;

            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'termin') {
        try {
            const response = await axios.get(`${apiUrl}/erp/termin_by_where`, {
                params: {
                    entitas: entitas,
                    param1: 'ORDER BY nama_termin',
                },
            });
            const responseData = response.data.data;

            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'jenis_vendor') {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_jenis_vendor`, {
                params: {
                    entitas: entitas === '999' ? '111' : entitas,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.data;

            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'satuan') {
        try {
            const response = await axios.get(`${apiUrl}/erp/all_satuan`);

            return response.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    } else if (fld === 'salesman') {
        try {
            const response = await axios.get(`${apiUrl}/erp/salesman`, {
                params: {
                    entitas: entitas,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.data;

            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
};

export const getEncodedParams = (json: object) => {
    const encodedParams = Buffer.from(JSON.stringify(json)).toString('base64');
    return encodedParams;
};

export const frmNumber = (value: any) => {
    // Menggunakan fungsi Number() untuk mengonversi string menjadi angka
    let numericValue = Number(value);

    // Memeriksa apakah nilai numerik adalah NaN
    if (isNaN(numericValue)) {
        numericValue = 0; // Mengubah NaN menjadi 0
    }

    // Menggunakan fungsi Number.toLocaleString() untuk memformat angka
    const formattedValue = numericValue.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formattedValue;
};

export const formatNumber = (number: any) => {
    const formattedNumber = number.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formattedNumber;
};

export const DiskonByCalc = (sDisk: string, D: any) => {
    let nDisk = 0;

    // Remove spaces from sDisk
    sDisk = sDisk.replace(/ /g, '');

    if (sDisk !== '') {
        let ps = sDisk.indexOf('+');

        if (ps > 0) {
            while (ps > 0) {
                nDisk += (parseFloat(sDisk.substring(0, ps)) * (D - nDisk)) / 100;
                sDisk = sDisk.substring(ps + 1);
                ps = sDisk.indexOf('+');
            }

            return nDisk + (parseFloat(sDisk) * (D - nDisk)) / 100;
        } else {
            return (parseFloat(sDisk) * D) / 100;
        }
    } else {
        return 0;
    }
};

export const tanpaKoma = (stringNilai: string) => {
    const tanpaKoma = stringNilai.replace(/,/g, '');
    return tanpaKoma;
};

export const formatCurrency = (value: any) => {
    // Menghapus semua karakter selain digit
    const cleanedValue = value.replace(/[^\d]/g, '');

    // Mengonversi nilai ke dalam format angka dengan koma sebagai pemisah ribuan
    const formattedValue = new Intl.NumberFormat('id-ID').format(cleanedValue);
    // const formattedNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(1000.76);

    // Mengganti titik dengan koma
    const finalValue = formattedValue.replace(/\./g, ',');

    return finalValue;
};

export const formatBerat = (value: string) => {
    // Memeriksa jika nilai input hanya berisi titik
    if (value === '.' || value === '. ') {
        return '0.'; // Mengembalikan 0. jika input hanya berisi titik
    }

    // Menghapus semua karakter selain digit dan titik desimal
    let cleanedValue = value.replace(/[^\d.]/g, '');

    // Memeriksa apakah nilai sudah memiliki titik desimal
    const decimalIndex = cleanedValue.indexOf('.');
    if (decimalIndex !== -1) {
        // Memastikan ada angka di sebelah kiri dari titik desimal
        cleanedValue = cleanedValue.replace(/^0+/, '');

        // Menambahkan nol di belakang nilai desimal jika hanya ada satu digit setelah titik desimal
        const decimalPart = cleanedValue.slice(decimalIndex + 1);
        if (decimalPart.length === 1) {
            cleanedValue += '0';
        }

        // Memastikan hanya dua digit di sebelah kanan dari titik desimal
        cleanedValue = cleanedValue.replace(/(\.\d{2}).*$/, '$1');
    } else {
        // Tambahkan titik desimal dan dua angka nol jika tidak ada titik desimal
        cleanedValue += '.00';
    }

    // Jika nilai diubah menjadi string kosong atau hanya titik, kembalikan nilai awal
    if (cleanedValue === '' || cleanedValue === '.') {
        return value;
    }

    // Mengonversi nilai ke dalam format angka dengan titik sebagai pemisah ribuan
    let formattedValue = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(parseFloat(cleanedValue));

    // Mengganti koma dengan titik sebagai pemisah desimal jika ada
    formattedValue = formattedValue.replace(/,/g, '.');

    return formattedValue;
};

// export const getUcode = async (kode_entitas: any, pid: any) => {
//     const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
//     try {
//         const response = await axios.get(`${apiUrl}/erp/get_ucode?`, {
//             params: {
//                 entitas: kode_entitas,
//                 pid: pid,
//             },
//         });

//         const result = response.data;
//         if (result) {
//             const ucodeData = result.data[0]['@pUcode'];
//             return ucodeData;
//         } else {
//             console.error('Error fetching ucode:', result.message);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching ucode:', error);
//         return null;
//     }
// };

// export { getServerSideProps };

export const generateNofakturFB = async (apiUrl: any, kode_entitas: any, no_lpbSelected: any) => {
    try {
        const response = await axios.get(`${apiUrl}/erp/get_info?`, {
            params: {
                entitas: kode_entitas,
            },
        });

        const responseData = response.data.data;
        const transformedData_getinfo = responseData.map((item: any) => ({
            kode: item.kode,
        }));

        const kodegetinfo = transformedData_getinfo[0].kode;

        const prefix = kodegetinfo.substring(0, 2);
        const newMiddle = '03';
        const rest = no_lpbSelected.substring(4);

        return `${prefix}${newMiddle}${rest}`;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// export const fetchPreferensi = async (kode_entitas: string, apiUrl: string) => {
//     try {
//         const response = await axios.get(`${apiUrl}/erp/preferensi?`, {
//             params: {
//                 entitas: kode_entitas,
//             },
//         });
//         const responseData = response.data.data;
//         return responseData.map((item: any) => ({
//             kode_akun_pengiriman: item.kode_akun_pengiriman,
//             kode_akun_diskon_item: item.kode_akun_diskon_item,
//             kode_akun_diskon_beli: item.kode_akun_diskon_beli,
//             alamat_gudang: item.alamat_gudang,
//         }));
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

export const viewPeriode = async (kode_entitas?: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/get_info?`, {
            params: {
                entitas: kode_entitas,
            },
        });

        const responseData = response?.data.data;
        let stahun: number;
        let sday: number;
        let sbulan: number;

        stahun = parseInt(responseData[0]?.periode.substring(0, 4));
        sbulan = parseInt(responseData[0]?.periode.substring(4));
        sday = 31;

        if (sbulan == 4 || sbulan == 6 || sbulan == 9 || sbulan == 11) {
            sday = 30;
        }
        if (sbulan == 2) {
            if (stahun % 4 == 0) {
                sday = 29;
            } else {
                sday = 28;
            }
        }

        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        let monthName = monthNames[sbulan - 1];

        return sbulan.toString() + '/' + stahun.toString() + ' - ' + '1 ' + monthName + ' ' + stahun.toString() + ' s/d ' + sday.toString() + ' ' + monthName + ' ' + stahun.toString();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const FirstDayInPeriod = async (kode_entitas: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/get_info?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        const responseData = response.data.data;

        let stahun: number;
        let sday: number;
        let sbulan: number;
        let pos: number;

        stahun = parseInt(responseData[0].periode.substring(0, 4));
        pos = parseInt(responseData[0].periode.substring(4));
        sbulan = parseInt(responseData[0].periode.substring(4));

        sday = 31;

        if (pos == 4 || pos == 6 || pos == 9 || pos == 11) {
            sday = 30;
        } else if (pos == 2) {
            if (stahun % 4 == 0) {
                sday = 29;
            } else {
                sday = 28;
            }
        }

        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Desember'];

        let monthName = monthNames[sbulan];

        return stahun.toString() + '-' + responseData[0].periode.substring(4) + '-01 00:00:00';
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const qty2QtyStd = async (entitas: any, kode_item: any, satuan: any, sat_std: any, qty: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!entitas) {
            throw new Error('Entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/qty_2Qty_Std?`, {
            params: {
                entitas: entitas,
                param1: kode_item,
            },
        });
        const responseData = response.data.data;

        let vkode_item, vsatuan, vsatuan2, vsatuan3;
        let vstd2, vkonversi2, vstd3, vkonversi3, vQty;

        vsatuan2 = responseData[0]?.satuan2 === undefined || responseData[0]?.satuan2 === '' || responseData[0]?.satuan2 === null ? '' : responseData[0]?.satuan2;
        vstd2 = parseFloat(responseData[0]?.std2);
        vkonversi2 = parseFloat(responseData[0]?.konversi2);
        vstd3 = parseFloat(responseData[0]?.std3);
        vkonversi3 = parseFloat(responseData[0]?.konversi3);
        vsatuan3 = responseData[0]?.satuan3 === undefined || responseData[0]?.satuan3 === '' || responseData[0]?.satuan3 === null ? '' : responseData[0]?.satuan3;

        // Konversi qty menjadi tipe number jika diperlukan
        const qtyNumber = parseFloat(qty);

        const satStd = sat_std === undefined || sat_std === '' ? '' : sat_std;
        const sat = satuan === undefined || satuan === '' ? '' : satuan;

        // console.log(vsatuan2, sat, satStd, vsatuan3);

        // Penyesuaian untuk menangani kasus konversi satuan
        if (sat?.toLowerCase() === satStd?.toLowerCase()) {
            var data = qtyNumber;
        } else if (sat?.toLowerCase() === vsatuan2?.toLowerCase()) {
            var data = (qtyNumber * vstd2) / vkonversi2;
        } else if (sat?.toLowerCase() === vsatuan3?.toLowerCase()) {
            var data = (qtyNumber * vstd3) / vkonversi3;
        } else {
            // Default return jika tidak ada konversi yang sesuai
            var data = qtyNumber;
        }
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchPreferensi = async (kode_entitas: string, _apiUrl: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        const response = await axios.get(`${apiUrl}/erp/preferensi?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        const responseData = response.data.data;
        return responseData.map((item: any) => ({
            ...item,
            kode_akun_pengiriman: item.kode_akun_pengiriman,
            no_kirim: item.no_kirim,
            nama_kirim: item.nama_kirim,
            tipe_kirim: item.tipe_kirim,
            kode_akun_kas: item.kode_akun_kas,
            no_kas: item.no_kas,
            nama_kas: item.nama_kas,
            tipe_kas: item.tipe_kas,
            kode_akun_diskon_item: item.kode_akun_diskon_item,
            kode_akun_diskon_beli: item.kode_akun_diskon_beli,
            no_diskon_beli: item.no_diskon_beli,
            nama_diskon_beli: item.nama_diskon_beli,
            tipe_diskon_beli: item.tipe_diskon_beli,
            alamat_gudang: item.alamat_gudang,
            multiproduk: item.multi_produk,
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const generateTerbilang = async (entitas: string, nominal: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    try {
        const response = await axios.get(`${apiUrl}/erp/terbilang?`, {
            params: {
                entitas: entitas,
                param1: nominal,
            },
        });

        const responseData = response.data.data;
        return responseData.terbilang;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const generateNUDivisi = async (entitas: string, last_num: string, kode_divisi: string, id: string, period: string, periodNo: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    // const [skode, setskode] = useState<any>('');
    // const [surut, setsurut] = useState<any>('');
    let skode = '';
    let surut = '';

    try {
        const response = await axios.get(`${apiUrl}/erp/get_info?`, {
            params: {
                entitas: entitas,
            },
        });

        const responseData = response.data.data;
        const transformedData_getinfo = responseData.map((item: any) => ({
            kode: item.kode,
        }));
        //setskode (transformedData_getinfo[0].kode);
        // skode = transformedData_getinfo[0].kode;
        skode = kode_divisi;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

    try {
        let speriode = moment(period).format('YYYYMM');
        let splastnum = '0';
        let prefix = '';
        let vperiodetahun = parseInt(moment(period).format('YY')) - 12;
        let vperiodebulan = parseInt(moment(period).format('MM')) + 5;

        if (last_num === '') {
            splastnum = '0';
        } else {
            prefix = skode + id + '.' + vperiodetahun.toString().padStart(2, '0') + vperiodebulan.toString().padStart(2, '0') + '.';

            if (last_num.substring(0, 10) === prefix && last_num.length === 15) {
                splastnum = last_num.substring(10, 15);
            } else {
                splastnum = '0';
            }
        }

        const response = await axios.get(`${apiUrl}/erp/get_nu?`, {
            params: {
                entitas: entitas,
                last_num: splastnum,
                id: id,
                period: periodNo,
            },
        });

        const responseData = response.data.data;

        const transformedData_getNU = responseData.map((item: any) => ({
            pNewnum: item.pNewnum,
        }));

        // setsurut (transformedData_getNU[0].pNewnum);
        surut = transformedData_getNU[0].pNewnum;

        let nodok = '';
        if (last_num === '') {
            nodok = kode_divisi + id + '.' + vperiodetahun.toString().padStart(2, '0') + vperiodebulan.toString().padStart(2, '0') + '.' + surut.toString().padStart(5, '0');
        }

        return nodok;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const usersMenu = async (entitas: string, userid: any, kode_menu: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    try {
        const response = await axios.get(`${apiUrl}/erp/users_menu?`, {
            params: {
                entitas: entitas,
                param1: userid,
                param2: kode_menu,
            },
        });

        const responseData = response.data.data;
        let baru, edit, hapus, cetak;
        if (responseData.length > 0) {
            baru = responseData[0].baru;
            edit = responseData[0].edit;
            hapus = responseData[0].hapus;
            cetak = responseData[0].cetak;
        } else {
            baru = '';
            edit = '';
            hapus = '';
            cetak = '';
        }
        return { baru, edit, hapus, cetak };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const entitaspajak = async (kode_entitas: string, userid: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        const response = await axios.get(`${apiUrl}/erp/entitas_pajak?`, {
            params: {
                param1: userid,
            },
        });
        const responseData = response.data.data;
        //alert(JSON.stringify(responseData) );

        let spajak2: any;
        for (var i = 0; i < responseData.length; i++) {
            // Periksa jika kode_cabang kosong
            if (responseData[i].kodecabang === kode_entitas && responseData[i].pajak === 'Y') {
                // Masukkan ke dalam kodeCabang dan hentikan iterasi
                spajak2 = 'true';
                break;
            } else {
                spajak2 = 'false';
            }
        }

        return spajak2;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const UpdateStatusCustomerNonAktif = async (kode_entitas: string, kode_cust: string) => {
    let Hasil: any;

    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        Hasil = 'false';

        const responsePref = await axios.get(`${apiUrl}/erp/preferensi?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        const responseDataPref = responsePref.data.data;

        const response = await axios.get(`${apiUrl}/erp/non_aktif_cust?`, {
            params: {
                entitas: kode_entitas,
                param1: kode_cust,
            },
        });
        const responseData = response.data.data;
        //alert(JSON.stringify(responseData) );

        let iOD: any;
        let iODFAKTUR: any;
        let iODWARKAT: any;
        let iKELAS: any;
        let iKodeTermin: any;

        if (responseData[0].kode_termin !== '') {
            iOD = responseData[0].od;
            iODFAKTUR = responseData[0].od_faktur;
            iODWARKAT = responseData[0].od_warkat;
            iKELAS = responseData[0].kelas;
            if (responseData[0].kode_net1 !== '') {
                iKodeTermin = responseData[0].kode_net1.AsString;
            } else {
                iKodeTermin = responseData[0].kode_termin.AsString;
            }
        } else {
            iOD = 0;
            iODFAKTUR = 0;
            iODWARKAT = 0;
            iKELAS = '';
            iKodeTermin = '';
        }

        if (iKELAS === '' || iKELAS === 'G' || iKELAS === 'L' || iKELAS === 'M' || iKELAS === 'N') {
        } else {
            if (responseDataPref[0].hari_blacklist > 0 && (iODFAKTUR > responseDataPref[0].hari_blacklist || iODWARKAT > responseDataPref[0].hari_blacklist)) {
                swal.fire({
                    title:
                        'Terdapat faktur atau warkat tagihan melebihi ' +
                        +responseDataPref[0].hari_blacklist +
                        ' hari dari tgl. terima' +
                        'Kebijakan perusahaan customer diklasifikasikan "G" (Blacklist).',
                    icon: 'warning',
                });

                let jsonSave: any;
                jsonSave = {
                    entitas: kode_entitas,
                    kode_cust: kode_cust,
                    kode_termin: iKodeTermin,
                    hari_blacklist: responseDataPref[0].hari_blacklist,
                };
                const response = await axios.patch(`${apiUrl}/erp/update_cust_bl`, jsonSave);

                const result = response.data;
                const status = result.status;
                const errormsg = result.serverMessage;
                if (status === false) {
                    swal.fire({
                        title: errormsg,
                        icon: 'warning',
                    });
                }
                Hasil = 'true';
            } else if (responseDataPref[0].hari_nonaktif > 0 && (iOD > responseDataPref[0].hari_nonaktif || iODWARKAT > responseDataPref[0].hari_nonaktif)) {
                swal.fire({
                    title: 'Terdapat faktur tagihan melebihi ' + +responseDataPref[0].hari_nonaktif + ' hari.' + 'Kebijakan perusahaan customer akan dinon aktifkan.',
                    icon: 'warning',
                });

                let jsonSave2: any;
                jsonSave2 = {
                    entitas: kode_entitas,
                    kode_cust: kode_cust,
                    hari_nonaktif: responseDataPref[0].hari_blacklist,
                };
                const response = await axios.patch(`${apiUrl}/erp/update_cust_bl60`, jsonSave2);

                const result = response.data;
                const status = result.status;
                const errormsg = result.serverMessage;
                if (status === false) {
                    swal.fire({
                        title: errormsg,
                        icon: 'warning',
                    });
                }
                Hasil = 'true';
            }
        }

        return Hasil;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const overQTYAll = async (kode_entitas: string, kodeGudang: string, kodeItem: string, tgl: string, kode_dokumen: string, qty: any, jenis: any, jenisWarning: any, target: any = '') => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    //param1 = kodeGudang, param2 = KodeItem, param3 = date, param4 = kodeDokumen
    let Lskip_persediaan;
    // let Lstok = 0;

    await fetchPreferensi(kode_entitas, `${apiUrl}/erp/preferensi?`)
        .then((result) => {
            Lskip_persediaan = result[0].skip_persediaan === '' || result[0].skip_persediaan === null ? '' : result[0].skip_persediaan;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    // console.log(Lskip_persediaan);
    try {
        if (Lskip_persediaan === 'N') {
            const response = await axios.get(`${apiUrl}/erp/qty_stock_all?`, {
                params: {
                    entitas: kode_entitas,
                    param1: kodeItem,
                    param2: tgl,
                    param3: kodeGudang,
                    param4: kode_dokumen,
                    param5: jenis,
                },
            });
            const responseData = response.data.data;

            if (responseData[0].stok < parseFloat(qty)) {
                swal.fire({
                    title: 'Warning',
                    text: `${jenisWarning}  (${qty}) melebihi stok yang ada (${responseData[0].stok}).`,
                    icon: 'warning',
                    target,
                });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export default function DaysBetween(Date1: Date, Date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((Date2.getTime() - Date1.getTime()) / oneDay));
    return diffDays + 1;
}

export const isCetakDokumen = async (kode_entitas: string, kodeDokumen: string, UDokumen: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    let Lskip_persediaan;
    try {
        const response = await axios.get(`${apiUrl}/erp/is_cetak_dokumen?`, {
            params: {
                entitas: kode_entitas,
                param1: kodeDokumen,
                param2: UDokumen,
            },
        });
        const responseData = response.data.data;
        // console.log();
        if (responseData.length > 0 && responseData[0].cnt > 0) {
            // Swal.fire({
            //     title: 'Warning',
            //     text: `${jenisWarning}  (${qty}) melebihi stok yang ada (${responseData[0].stok}).`,
            //     icon: 'warning',
            // });
            return true;
            // throw 'exit';
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const HitungBeratToleransi = async (T: number, L: number, P: number, B: number, Toleransi: number, R: string) => {
    let Panjang: number;
    let M: number;
    let Berat: number = B;

    if (R === '1' || R === '2') {
        if (R === '1') {
            Panjang = P;
        } else {
            Panjang = 156.6;
        }

        try {
            Berat = (T - Toleransi) * (T - Toleransi) * 0.006165 * Panjang;
        } catch (e) {
            Berat = 0;
        }

        if (T <= 0) {
            Berat = 0;
        }
    } else if (R === '3' || R === '4') {
        if (R === '3') {
            M = 5;
        } else {
            M = 3;
        }

        try {
            Berat = L - Toleransi * M;
        } catch (e) {
            Berat = 0;
        }

        if (L <= 0) {
            Berat = 0;
        }
    }

    return Math.round(Berat * 100) / 100;
};

export const ResetTime = async (kode_entitas: string, tanggal: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    let hasil: any;

    //const today = moment().add(7, 'days').toDate();
    const today = moment();
    const formattedDate = moment(tanggal).format('YYYY-MM-DD');
    const formattedDateMoment = moment(formattedDate, 'YYYY-MM-DD');

    if (formattedDateMoment.isBefore(moment(today).format('YYYY-MM-DD'), 'day')) {
        const response = await axios.get(`${apiUrl}/erp/backtime?`, {
            params: {
                entitas: kode_entitas,
                param1: moment(tanggal).format('YYYY-MM-DD'), // formattedDateMoment,
            },
        });
        const responseData = response.data.data;

        hasil = responseData[0].pDate;
    } else {
        //   alert('bbbbb');
        hasil = moment(tanggal).format('YYYY-MM-DD HH:mm:ss');
    }

    return hasil;
};

export const ResetTime2 = async (kode_entitas: string, tanggal: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    let hasil: any;

    //const today = moment().add(7, 'days').toDate();
    const today = moment();
    const tgldt: any = moment(tanggal).format('YYYY-MM-DD');
    const tglBackTime: any = moment(tanggal).format('YYYY-MM-DD HH:mm:ss');
    const tglAppDate: any = moment(today).format('YYYY-MM-DD');

    const responseAppTime = await axios.get(`${apiUrl}/erp/apptime?`, {
        params: {
            entitas: kode_entitas,
            param1: tgldt, // formattedDateMoment,
        },
    });
    const responseDataAppTime = responseAppTime.data.data;

    const responseBackTime = await axios.get(`${apiUrl}/erp/backtime?`, {
        params: {
            entitas: kode_entitas,
            param1: tglBackTime, // formattedDateMoment,
        },
    });
    const responseDataBackTime = responseBackTime.data.data;

    // console.log(tanggal);
    // console.log(tgldt);
    // console.log(tglBackTime);
    // console.log(tglAppDate);

    if (tgldt < tglAppDate) {
        // console.log('masuk back time');
        hasil = responseDataBackTime[0].pDate;
    } else {
        // console.log('masuk app time');
        hasil = responseDataAppTime[0].pDate;
    }

    // console.log(hasil);
    return hasil;
};

export const GetInfo = async (kode_entitas: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/get_info?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const checkIfNumberExists = async (noDok: any, kode_entitas: any): Promise<boolean> => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    try {
        const checkIfNumberExistsRes = await axios.get(`${apiUrl}/erp/nomor_do_tunai`, {
            params: {
                entitas: kode_entitas,
                param1: noDok,
            },
        });

        const checkIfNumberExistsRes2 = checkIfNumberExistsRes.data.data;

        return checkIfNumberExistsRes2.length > 0;
    } catch (error) {
        console.error('Error checking if number exists:', error);
        return false;
    }
};

//! OnetoOneNumber FAS
export const oneToOneNumber = async (vOld: string, dok: string, vTgl: string, kode_entitas: string): Promise<string> => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    let Reg: string = vOld.slice(-5).replace(/\D/g, ''); // Remove non-numeric characters
    Reg = Reg.padStart(5, '0'); // Pad with zeros if necessary

    const vTglDate = new Date(vTgl);
    const vTahun: number = vTglDate.getFullYear();
    const vBulan: number = vTglDate.getMonth() + 1;

    try {
        const quInfokodeRes = await axios.get(`${apiUrl}/erp/get_info`, {
            params: {
                entitas: kode_entitas,
            },
        });

        const quInfokode = quInfokodeRes.data.data;
        let Str: string = quInfokode[0].kode + dok + '.' + vTahun.toString().slice(-2).padStart(2, '0') + vBulan.toString().padStart(2, '0') + '.' + Reg;

        let Ret: string = Str + '1';
        let j: number = 1;

        // console.log(Str);
        // console.log(Ret);

        // Assuming Data.quList is some form of a database object
        while (true) {
            // Check if the generated number exists
            const exists = await checkIfNumberExists(Ret, kode_entitas); // Implement this function to check if Ret exists in your database
            if (!exists) {
                break; // If not exists, break the loop
            }

            // If exists, increment and try again
            j++;
            Ret = Str + j.toString();
        }

        return Ret;
    } catch (error) {
        console.error('Error fetching data:', error);
        return '';
    }
};

const swalToast = swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 2000,
    showClass: {
        popup: `
              animate__animated
              animate__zoomIn
              animate__faster
            `,
    },
    hideClass: {
        popup: `
              animate__animated
              animate__zoomOut
              animate__faster
            `,
    },
});

export const myAlertGlobal = (text: any, target: any, vIcon?: any) => {
    return withReactContent(swalToast).fire({
        icon: vIcon ?? 'warning',
        title: `<p style="font-size:12px">${text}</p>`,
        width: '100%',
        target: `#${target}`,
        // timer: 1000,
    });
};

// ====================Fungsi====================
export const moneyToString = (language: any, money: any) => {
    let str = '';
    let strCent = '';
    let cent = 0;
    let strTrans = '';
    let posAnd = 0;
    let thousand = false;
    const words: any = [];
    const CSTRING = '000000000000000000';

    const internalInit = (language: any) => {
        strTrans = '';
        posAnd = 0;
        if (language === 0) {
            words[0] = '';
            words[1] = 'se';
            words[2] = 'dua ';
            words[3] = 'tiga ';
            words[4] = 'empat ';
            words[5] = 'lima ';
            words[6] = 'enam ';
            words[7] = 'tujuh ';
            words[8] = 'delapan ';
            words[9] = 'sembilan ';
            thousand = false;
        } else {
            words[0] = '';
            words[1] = 'one ';
            words[2] = 'two ';
            words[3] = 'three ';
            words[4] = 'four ';
            words[5] = 'five ';
            words[6] = 'six ';
            words[7] = 'seven ';
            words[8] = 'eight ';
            words[9] = 'nine ';
            words[10] = 'ten ';
            words[11] = 'eleven ';
            words[12] = 'twelve ';
            words[13] = 'thirteen ';
            words[15] = 'fifteen ';
            words[22] = 'twenty ';
            words[23] = 'thirty ';
            words[25] = 'fifty ';
        }
    };

    const internalDelete = (language: any) => {
        if (language === 0) {
            if (strTrans.includes('triliun milyar')) strTrans = strTrans.slice(0, -7);
            else if (strTrans.includes('triliun juta')) strTrans = strTrans.slice(0, -5);
            else if (strTrans.includes('triliun ribu')) strTrans = strTrans.slice(0, -5);
            else if (strTrans.includes('milyar juta')) strTrans = strTrans.slice(0, -5);
            else if (strTrans.includes('milyar ribu')) strTrans = strTrans.slice(0, -5);
            else if (strTrans.includes('juta ribu')) strTrans = strTrans.slice(0, -5);
        } else {
            if (strTrans.includes('trillion billion')) strTrans = strTrans.slice(0, -8);
            else if (strTrans.includes('trillion million')) strTrans = strTrans.slice(0, -8);
            else if (strTrans.includes('trillion thousand')) strTrans = strTrans.slice(0, -9);
            else if (strTrans.includes('billion million')) strTrans = strTrans.slice(0, -8);
            else if (strTrans.includes('billion thousand')) strTrans = strTrans.slice(0, -9);
            else if (strTrans.includes('million thousand')) strTrans = strTrans.slice(0, -9);
        }
    };

    const internalMakeString = (i: number, ands: string, bils: any, cek: string) => {
        let result = '';
        switch (i) {
            case 1:
                if (bils !== '0' && ands.slice(1) === CSTRING.slice(0, ands.length - 1)) posAnd = strTrans.length;
                if (bils === '0') result = '';
                else if (bils === '8') result = words[parseInt(bils)] + 't hundred ';
                else if (bils >= '1' && bils <= '3') result = words[parseInt(bils)] + 'hundred ';
                else result = words[parseInt(bils)] + ' hundred ';
                break;
            case 2:
                if (bils !== '0' && (ands.slice(1) === CSTRING.slice(0, ands.length - 1) || ands.slice(2) === CSTRING.slice(0, ands.length - 2))) posAnd = strTrans.length;
                if (bils === '1') cek = 'teen ';
                else if (bils === '2' || bils === '3' || bils === '5') result = words[parseInt('2' + bils)];
                else if (bils === '4' || (bils >= '6' && bils <= '9')) result = words[parseInt(bils)] + 'ty ';
                break;
            case 3:
                if (bils !== '0' && ands.slice(1) === CSTRING.slice(0, ands.length - 1) && posAnd === 0 && strTrans.slice(-2) !== 'ty ') posAnd = strTrans.length;
                if (cek !== '') {
                    if (bils === '0') result = words[10];
                    else if ((bils >= '1' && bils <= '3') || bils === '5') result = words[parseInt('1' + bils)];
                    else result = words[parseInt(bils)] + cek;
                } else {
                    if (bils === '0' || (bils >= '1' && bils <= '3')) result = words[parseInt(bils)];
                    else if (bils === '8') result = words[parseInt(bils)] + 't ';
                    else result = words[parseInt(bils)] + ' ';
                }
                break;
            default:
                break;
        }
        return result;
    };

    const internalTranslate = (language: any, money: any) => {
        let s = money.toFixed(0).toString();
        internalInit(language);
        let tens = '';
        const lengthMap = [
            [
                15,
                () => {
                    if (language === 0) {
                        if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'ratus ';
                    } else strTrans += internalMakeString(1, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                14,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && s[1] !== '0') tens = 'belas ';
                        else if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'puluh ';
                    } else strTrans += internalMakeString(2, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                13,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && tens === '') strTrans += 'satu triliun ';
                        else strTrans += words[parseInt(s[0])] + tens + 'triliun ';
                    } else strTrans += internalMakeString(3, s, s[0], tens) + 'trillion ';
                    s = s.slice(1);
                },
            ],
            [
                12,
                () => {
                    if (language === 0) {
                        if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'ratus ';
                    } else strTrans += internalMakeString(1, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                11,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && s[1] !== '0') tens = 'belas ';
                        else if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'puluh ';
                    } else strTrans += internalMakeString(2, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                10,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && tens === '') strTrans += 'satu milyar ';
                        else strTrans += words[parseInt(s[0])] + tens + 'milyar ';
                    } else strTrans += internalMakeString(3, s, s[0], tens) + 'billion ';
                    internalDelete(language);
                    s = s.slice(1);
                },
            ],
            [
                9,
                () => {
                    if (language === 0) {
                        if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'ratus ';
                    } else strTrans += internalMakeString(1, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                8,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && s[1] !== '0') tens = 'belas ';
                        else if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'puluh ';
                    } else strTrans += internalMakeString(2, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                7,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && tens === '') strTrans += 'satu juta ';
                        else strTrans += words[parseInt(s[0])] + tens + 'juta ';
                    } else strTrans += internalMakeString(3, s, s[0], tens) + 'million ';
                    internalDelete(language);
                    s = s.slice(1);
                },
            ],
            [
                6,
                () => {
                    if (language === 0) {
                        if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'ratus ';
                    } else strTrans += internalMakeString(1, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                5,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && s[1] !== '0') tens = 'belas ';
                        else if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'puluh ';
                    } else strTrans += internalMakeString(2, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                4,
                () => {
                    if (language === 0) {
                        if (s[0] === '1' && tens === '') {
                            if (thousand) strTrans = strTrans.slice(0, -3) + 'se';
                            strTrans += 'ribu ';
                            thousand = true;
                        } else strTrans += words[parseInt(s[0])] + tens + 'ribu ';
                    } else strTrans += internalMakeString(3, s, s[0], tens) + 'thousand ';
                    internalDelete(language);
                    s = s.slice(1);
                },
            ],
            [
                3,
                () => {
                    if (language === 0) {
                        if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'ratus ';
                    } else strTrans += internalMakeString(1, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                2,
                () => {
                    tens = '';
                    if (language === 0) {
                        if (s[0] === '1' && s[1] !== '0') tens = 'belas ';
                        else if (s[0] !== '0') strTrans += words[parseInt(s[0])] + 'puluh ';
                    } else strTrans += internalMakeString(2, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                1,
                () => {
                    if (language === 0) {
                        if (tens !== '') strTrans += words[parseInt(s[0])] + tens;
                        else if (s[0] === '1') {
                            if (strTrans.slice(-3) === 'se ') strTrans += 'ribu ';
                            else strTrans += 'satu ';
                        } else strTrans += words[parseInt(s[0])];
                    } else strTrans += internalMakeString(3, s, s[0], tens);
                    s = s.slice(1);
                },
            ],
            [
                0,
                () => {
                    if (money !== 0 && posAnd !== 0) strTrans = strTrans.slice(0, posAnd) + ' and ' + strTrans.slice(posAnd);
                },
            ],
        ];
        // for (const [length, action] of lengthMap) {
        //     if (s.length === length) action();
        // }
        for (const [length, action] of lengthMap) {
            if (s.length === length && typeof action === 'function') {
                action();
            }
        }
        if (money === 0) strTrans = language === 0 ? 'nol ' : 'zero ';
        return strTrans;
    };

    money = Math.abs(money);
    const integerPart = Math.trunc(money);
    const decimalPart = Math.round((money - integerPart) * 100);

    str = internalTranslate(language, integerPart);
    if (decimalPart !== 0) {
        cent = decimalPart;
        strCent = internalTranslate(language, cent);
        return `${str}${strCent}sen`;
    } else {
        return `${str}`;
    }
};

// ==================Cara Pakai==================
// indonesian = 0
// inggris = 1
// {moneyToString(bahasa, nilai yang ingin dikonversi)}

// Routines dari pak misba
//=========== Setting format tanggal sesuai locale ID ===========
const formatFloat: Object = { format: ',0.####;-,0.####;#', maximumFractionDigits: 4 };
const formatKPI: Object = { format: ',0.###;-,0.###;#', maximumFractionDigits: 3 };

export const contentLoading = () => {
    return (
        <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#ffffff00] dark:bg-[#060818]">
            <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                    <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                </path>
                <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                    <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                </path>
            </svg>
        </div>
    );
};

export const hideLoading = (targetElementID: string) => {
    const targetElement: HTMLElement = select(targetElementID, document);
    hideSpinner(targetElement);
};

export const swalDialog = swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary btn-sm',
        cancelButton: 'btn btn-dark btn-sm ltr:mr-3 rtl:ml-3',
        popup: 'sweet-alerts',
    },
    buttonsStyling: false,
    showClass: {
        popup: `
            animate__animated
            animate__zoomIn
            animate__faster
          `,
    },
    hideClass: {
        popup: `
            animate__animated
            animate__zoomOut
            animate__faster
          `,
    },
});

export function floatFormat(num: any) {
    const numericValue = parseFloat(num); // Convert the value to number
    if (isNaN(numericValue)) {
        // If not a valid number, return an empty string or the original value
        return '';
    } else {
        let intl: Internationalization = new Internationalization();
        let nFormatter: Function = intl.getNumberFormat(formatFloat);
        let formattedValue: string = nFormatter(numericValue);
        return formattedValue;
    }
}

export function KPIFormat(num: any) {
    const numericValue = parseFloat(num); // Convert the value to number
    if (isNaN(numericValue)) {
        // If not a valid number, return an empty string or the original value
        return '';
    } else {
        let intl: Internationalization = new Internationalization();
        let nFormatter: Function = intl.getNumberFormat(formatKPI);
        let formattedValue: string = nFormatter(numericValue);
        return formattedValue;
    }
}

export const dataBulan = [
    { bln: 1, bulan: 'Januari' },
    { bln: 2, bulan: 'Februari' },
    { bln: 3, bulan: 'Maret' },
    { bln: 4, bulan: 'April' },
    { bln: 5, bulan: 'Mei' },
    { bln: 6, bulan: 'Juni' },
    { bln: 7, bulan: 'Juli' },
    { bln: 8, bulan: 'Augustus' },
    { bln: 9, bulan: 'September' },
    { bln: 10, bulan: 'Oktober' },
    { bln: 11, bulan: 'November' },
    { bln: 12, bulan: 'Desember' },
];

export const GetSuppMapping = async (kode_entitas: string, param1: string, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/get_supp_mapping?`, {
            params: {
                entitas: kode_entitas,
                param1: param1, //kodeEntitasCabang
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const GetEntitasUser = async (kode_entitas: string, param1: string, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/get_entitas_user?`, {
            params: {
                entitas: kode_entitas,
                param1: param1, //kodeUserCabang
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const GetEntitasPusat = async (kode_entitas: string, param1: string, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/get_entitas_pusat?`, {
            params: {
                entitas: kode_entitas,
                param1: param1, //namaBisnis
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const listFromSql = async (entitas: string, fld: string, kode_user?: any, token?: any, param1?: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    // console.log(param1);
    if (fld === 'satuan') {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_satuan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    entitas: entitas,
                    param1: param1,
                },
            });
            const responseData = response.data.data;

            return responseData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
};

//=================================================================
// API untuk mengambil users app
const GetUsersApp = async (kode_entitas: string, userid: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const response = await axios.get(`${apiUrl}/erp/users_app?`, {
        params: {
            entitas: kode_entitas,
            param1: userid,
        },
    });
    const result = response.data.data;
    return result;
};
// END
//=================================================================

//=================================================================
// API untuk mengambil users app
const GetEntitasPajak = async (kode_entitas: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const response = await axios.get(`${apiUrl}/erp/entitas_pajak_ttb?`, {
        params: {
            param1: kode_entitas,
        },
    });
    const result = response.data.data;
    return result;
};
// END
//=================================================================

export const appBackdate = async (kode_entitas: any, userid: any) => {
    let appBackdate: any;
    const getUsersApp = await GetUsersApp(kode_entitas, userid.toUpperCase());
    const getEntitasPajak = await GetEntitasPajak(kode_entitas);
    if (userid.toUpperCase() === 'ADMINISTRATOR') {
        appBackdate = false;
    } else {
        if (getEntitasPajak.length > 0) {
            appBackdate = false;
        } else {
            if (getUsersApp[0].app_backdate === 'Y') {
                appBackdate = false;
            } else {
                appBackdate = true;
            }
        }
    }

    return appBackdate;
};

export const myAlertGlobal2 = (text: any, target: any, vIcon?: any) => {
    return withReactContent(swal).fire({
        icon: vIcon ?? 'warning',
        title: `<p style="font-size:12px">${text}</p>`,
        width: '25%',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        target: `#${target}`,
        // timer: 1000,
    });
};

export const GetCustMapping = async (kode_entitas: string, param1: string, token: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    try {
        if (!kode_entitas) {
            throw new Error('kode_entitas is required');
        }

        const response = await axios.get(`${apiUrl}/erp/customer_mapping?`, {
            params: {
                entitas: kode_entitas,
                param1: param1, //kodeEntitasCabang
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const myAlertGlobal3 = (text: any, target: any, vIcon?: any) => {
    return withReactContent(swal).fire({
        icon: vIcon ?? 'warning',
        title: `<p style="font-size:12px">${text}</p>`,
        width: '25%',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Batal',
        target: `#${target}`,
        // timer: 1000,
    });
};

export const sendTelegramMessage = async (keyTokenTele: any, chatIdUser: any, message: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const botToken = keyTokenTele;
    const chatId = chatIdUser;
    const parseModeHtml = 'HTML';
    const url = `${apiUrl}/erp/send_text`;
    // const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await axios.get(url, {
            params: {
                // chat_id: chatId,
                // text: message,
                key: botToken,
                chatid: chatId,
                pesan: message,
                parse_mode: parseModeHtml,
            },
        });
        // console.log('response.data', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
};

export const settingTelegram = async (entitas: any, token: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const url = `${apiUrl}/erp/send_text`;
    // const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await axios.get(`${apiUrl}/erp/get_setting_tele`, {
            params: {
                entitas: entitas,
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        const resultTele = response.data.data;
        console.log('resultTele.data', resultTele);
        return resultTele;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
};
