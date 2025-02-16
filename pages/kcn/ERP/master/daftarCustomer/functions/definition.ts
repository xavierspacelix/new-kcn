import { ColumnMenuItemModel } from '@syncfusion/ej2/grids';
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import { RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { useState, ReactNode } from 'react';
import Swal from 'sweetalert2';
import moment from 'moment';

export const swalToast = Swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3500,
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
export const menuGantiSalesManItems: ColumnMenuItemModel[] = [
    {
        text: 'Per Customer',
    },
    {
        text: 'Customer Pilihan',
    },
    {
        text: 'Semua Sales...',
    },
];

export const menuUpdateKlasifikasiItems: ColumnMenuItemModel[] = [
    {
        text: 'Blacklist / Open Blacklist Customer',
    },
    {
        text: 'Batal NOO (New Open Outlet)',
    },
    {
        text: 'Customer Tidak Digarap',
    },
    {
        text: 'Auto Blacklist dan Non Aktif Customer...',
    },
];

export function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
}
export const tabKlasifikasiArray = [
    {
        Klasifikasi: 'Semua',
        kelas: 'Semua',
    },
    {
        Klasifikasi: 'Klasifikasi-A',
        kelas: 'A',
    },
    {
        Klasifikasi: 'Klasifikasi-B',
        kelas: 'B',
    },
    {
        Klasifikasi: 'Klasifikasi-C',
        kelas: 'C',
    },
    {
        Klasifikasi: 'Klasifikasi-D',
        kelas: 'D',
    },
    {
        Klasifikasi: 'Klasifikasi-E',
        kelas: 'E',
    },
    {
        Klasifikasi: 'Klasifikasi-F',
        kelas: 'F',
    },
    {
        Klasifikasi: 'Blacklist-G',
        kelas: 'G',
    },
    {
        Klasifikasi: 'GROUP-H',
        kelas: 'H',
    },
    {
        Klasifikasi: 'CALON-NOO',
        kelas: 'N',
    },
    {
        Klasifikasi: 'BATAL-NOO',
        kelas: 'M',
    },
    {
        Klasifikasi: 'Klasifikasi-AF',
        kelas: 'A-F',
    },
    {
        Klasifikasi: 'TIDAK DIGARAP',
        kelas: 'L',
    },
];
export const styleButton = {
    width: 57 + 'px',
    height: '28px',
    marginBottom: '0.5em',
    marginTop: 0.5 + 'em',
    marginRight: 0.8 + 'em',
    backgroundColor: '#3b3f5c',
};

const getFilterValuesWithSequentialKeys = (filterArray: any[]) => {
    let counter = 2;
    return filterArray.reduce((acc, item) => {
        if (item.type === 'radio') {
            // Logika khusus untuk tipe radio
            acc[`param${counter}`] = item.value;
            counter++;
        } else if (item.type === 'dateRange') {
            acc[`param${counter}`] = item.checked && item.awalValue ? item.awalValue.toISOString().split('T')[0] : 'all';
            counter++;
            acc[`param${counter}`] = item.checked && item.akhirValue ? item.akhirValue.toISOString().split('T')[0] : 'all';
            counter++;
        } else {
            acc[`param${counter}`] = item.checked ? item.value : 'all';
            counter++;
        }
        return acc;
    }, {});
};

export const fetchDataCustomer = async (params: any, token: string, entitas: string, klasifikasi: string) => {
    try {
        const parameters = getFilterValuesWithSequentialKeys(params);

        const data = await axios.get(`${apiUrl}/erp/list_daftar_customer?`, {
            params: {
                entitas: entitas,
                param1: klasifikasi,
                ...parameters,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const transformedData = data.data.data.map((item: any) => {
            return {
                ...item,
                plafond: item.plafond === null || item.plafond === '0.0000' ? null : new Intl.NumberFormat('id-ID').format(item.plafond),
            };
        });
        return transformedData;
    } catch (error: any) {
        console.error(error.message);
    }
};

export const getDataWilayah = async (entitas: string) => {
    const data = await axios.get(`${apiUrl}/erp/master_wilayah?`, {
        params: {
            entitas: entitas,
        },
    });
    return data.data.data;
};
export const getDataSalesman = async (entitas: string) => {
    const data = await axios.get(`${apiUrl}/erp/salesman?`, {
        params: {
            entitas: entitas,
        },
    });
    return data.data.data;
};
export const getDataKategori = async (entitas: string) => {
    const data = await axios.get(`${apiUrl}/erp/kategori?`, {
        params: {
            entitas: entitas,
        },
    });
    return data.data.data;
};
export const getDataKelompok = async (entitas: string) => {
    const data = await axios.get(`${apiUrl}/erp/kelompok?`, {
        params: {
            entitas: entitas,
        },
    });
    return data.data.data;
};
export const getDataRegionIndonesia = async (entitas: string, type: string) => {
    const data = await axios.get(`${apiUrl}/erp/list_wilayah_daftar_relasi`, {
        params: {
            entitas: entitas,
            param1: type,
        },
    });
    return data.data.data;
};

export const getDataMasterCustomer = async (entitas: string, kode_cust: string, token: string, type: string) => {
    if (type === 'master') {
        const data = await axios.get(`${apiUrl}/erp/master_customer?`, {
            params: {
                entitas: entitas,
                param1: kode_cust,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const newData = data.data.data.map((item: any) => {
            return {
                ...item,
                prospek: item.prospek === 'Y' ? true : false,
                aktif: item.aktif === 'N' ? true : false,
                terima_dokumen: item.terima_dokumen === 'Y' ? true : false,
                manual_hks_mobile: item.manual_hks_mobile === 'Y' ? true : false,
                pabrik: item.pabrik === 'Y' ? true : false,
                bayar_tunai: item.bayar_tunai === 'Y' ? true : false,
                rks: item.rks === 'Y' ? true : false,
                tgl_cust: item.tgl_cust === null ? null : moment(item.tgl_cust).format('YYYY-MM-DD'),
                tgl_register: item.tgl_cust === null ? null : moment(item.tgl_register).format('YYYY-MM-DD'),
            };
        });
        return newData;
    } else if (type === 'detail') {
        const data = await axios.get(`${apiUrl}/erp/detail_customer`, {
            params: {
                entitas: entitas,
                param1: kode_cust,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const newData = data.data.data.map((item: any) => {
            return {
                ...item,
                luas_toko: item.luas_toko === null ? null : parseFloat(item.luas_toko),
                luas_gudang: item.luas_gudang === null ? null : parseFloat(item.luas_gudang),
                jarak_dari_gudang: item.jarak_dari_gudang !== null ? parseFloat(item.jarak_dari_gudang) : null,
                order_cbd: item.order_cbd === 'Y' ? true : false,
                order_cod: item.order_cod === 'Y' ? true : false,
                order_kredit: item.order_kredit === 'Y' ? true : false,
                bayar_transfer: item.bayar_transfer === 'Y' ? true : false,
                bayar_giro: item.bayar_giro === 'Y' ? true : false,
                bayar_tunai: item.bayar_tunai === 'Y' ? true : false,
            };
        });
        return newData;
    } else if (type === 'jam_ops') {
        const data = await axios.get(`${apiUrl}/erp/jam_ops_customer?`, {
            params: {
                entitas: entitas,
                param1: kode_cust,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const newData = data.data.data.map((item: any) => {
            return {
                ...item,
                jam_buka_1: item?.jam_buka_1 === null ? '' : moment(item?.jam_buka_1, 'HH:mm:ss').format('HH:mm'),
                jam_buka_2: item?.jam_buka_2 === null ? '' : moment(item?.jam_buka_2, 'HH:mm:ss').format('HH:mm'),
                jam_buka_3: item?.jam_buka_3 === null ? '' : moment(item?.jam_buka_3, 'HH:mm:ss').format('HH:mm'),
                jam_buka_4: item?.jam_buka_4 === null ? '' : moment(item?.jam_buka_4, 'HH:mm:ss').format('HH:mm'),
                jam_buka_5: item?.jam_buka_5 === null ? '' : moment(item?.jam_buka_5, 'HH:mm:ss').format('HH:mm'),
                jam_buka_6: item?.jam_buka_6 === null ? '' : moment(item?.jam_buka_6, 'HH:mm:ss').format('HH:mm'),
                jam_buka_7: item?.jam_buka_7 === null ? '' : moment(item?.jam_buka_7, 'HH:mm:ss').format('HH:mm'),

                jam_tutup_1: item?.jam_tutup_1 === null ? '' : moment(item?.jam_tutup_1, 'HH:mm:ss').format('HH:mm'),
                jam_tutup_2: item?.jam_tutup_2 === null ? '' : moment(item?.jam_tutup_2, 'HH:mm:ss').format('HH:mm'),
                jam_tutup_3: item?.jam_tutup_3 === null ? '' : moment(item?.jam_tutup_3, 'HH:mm:ss').format('HH:mm'),
                jam_tutup_4: item?.jam_tutup_4 === null ? '' : moment(item?.jam_tutup_4, 'HH:mm:ss').format('HH:mm'),
                jam_tutup_5: item?.jam_tutup_5 === null ? '' : moment(item?.jam_tutup_5, 'HH:mm:ss').format('HH:mm'),
                jam_tutup_6: item?.jam_tutup_6 === null ? '' : moment(item?.jam_tutup_6, 'HH:mm:ss').format('HH:mm'),
                jam_tutup_7: item?.jam_tutup_7 === null ? '' : moment(item?.jam_tutup_7, 'HH:mm:ss').format('HH:mm'),

                buka_1: item?.buka_1 === 'Y' ? true : false,
                buka_2: item?.buka_2 === 'Y' ? true : false,
                buka_3: item?.buka_3 === 'Y' ? true : false,
                buka_4: item?.buka_4 === 'Y' ? true : false,
                buka_5: item?.buka_5 === 'Y' ? true : false,
                buka_6: item?.buka_6 === 'Y' ? true : false,
                buka_7: item?.buka_7 === 'Y' ? true : false,
            };
        });
        return newData;
    } else if (type === 'person') {
        const data = await axios.get(`${apiUrl}/erp/list_person_customer?`, {
            params: {
                entitas: entitas,
                param1: kode_cust,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const newData = data.data.data.map((item: any) => {
            return {
                ...item,
                aktif_kontak: item.aktif_kontak === 'Y' ? true : false,
            };
        });
        return newData;
    } else if (type === 'produk_potensial') {
        const data = await axios.get(`${apiUrl}/erp/potensial_produk_customer?`, {
            params: {
                entitas: entitas,
                param1: kode_cust,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data.data.data;
    }
};
export interface RelasiProps {
    kode_relasi: string;
    nama_relasi: string;
    alamat: string;
    alamat2: string;
    kodepos: string;
    kota: string;
    kelurahan: string;
    kecamatan: string;
    propinsi: string;
    negara: string;
    npwp: string;
    siup: string;
    personal: string;
    ktp: string;
    sim: string;
    telp: string;
    telp2: string;
    hp: string;
    hp2: string;
    fax: string;
    email: string;
    website: string;
}
export interface Customer {
    kode_cust: string;
    kode_relasi: string;
    no_cust: string;
    prospek: boolean;
    aktif: boolean;
    tgl_cust: string;
    kode_akun_piutang: string | null;
    kode_area: string;
    kode_sub_area: string | null;
    kode_termin: string | null;
    kode_mu: string | null;
    plafond: number;
    pemakaian: number | null;
    kode_sales: string;
    tipe: string;
    harga_def: string;
    diskon_def: number | null;
    kode_pajak: string;
    tipe_pajak: string | null;
    alamat_kirim1: string;
    alamat_kirim2: string;
    kota_kirim: string;
    propinsi_kirim: string;
    negara_kirim: string;
    pesan: string | null;
    cetak_pesan: string | null;
    catatan: string;
    userid: string;
    tgl_update: string;
    nama_relasi: string;
    alamat: string;
    alamat2: string;
    kodepos: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
    propinsi: string;
    negara: string;
    npwp: string;
    siup: string;
    personal: string;
    ktp: string;
    sim: string;
    telp: string;
    telp2: string;
    hp: string;
    hp2: string;
    fax: string;
    email: string;
    website: string;
    kode_akun_beban: string | null;
    beban_dikirim: number;
    beban_diambil: number | null;
    no_piutang: string;
    nama_piutang: string;
    tipe_piutang: string;
    no_beban: string;
    nama_beban: string;
    tipe_beban: string;
    plafond_atas: number;
    filegambar: File | null;
    filegambar2: File | null;
    filegambar3: File | null;
    filegambar4: File | null;
    filepdf: string;
    filepdf2: string;
    kelas: string;
    rks: boolean;
    kode_termin2: string | null;
    filegambar5: File | null;
    tipe2: string;
    status_wa: string;
    kecamatan_kirim: string;
    kelurahan_kirim: string;
    kodepos_kirim: string;
    lat_kirim: string;
    long_kirim: string;
    kelas_lama: string;
    bayar_tunai: boolean;
    tgl_sales: string | null;
    kode_sales_lama: string;
    dikontak: string;
    terima_dokumen: boolean;
    master_plafond: string;
    manual_hks_mobile: boolean;
    alasan: string | null;
    kode_termin_lama: string;
    kode_termin_lama2: string;
    user_register: string;
    tgl_register: string;
    pabrik: boolean;
}
export type JamOpsProps = {
    id: number;
    Hari?: string;
    JamBuka?: string;
    JamTutup?: string;
    Buka?: boolean;
};
export type FieldProps = {
    id: number;
    FieldName: string;
    Type: string;
    Value: string | Date | boolean;
    TabId: number;
    ReadOnly: boolean;
    IsAction: boolean;
    group: string;
    Visible: boolean;
    Label: string;
    Items?: ItemProps[];
};
export type ItemProps = {
    id: number;
    FieldName: string;
    Value: boolean;
    Label: string;
};
export type FieldDKProps = {
    id: number;
    FieldName: string;
    Type: string;
    Value: string | boolean;
    TabId: number;
    ReadOnly: boolean;
    IsAction: boolean;
    Visible: boolean;
    Label: string;
};
export type PotensiaProdukProps = {
    kode_cust: string;
    kategori: string;
    kelompok: string;
    catatan: string;
};
export type RekeningBankkProps = {
    kode_cust: string;
    nama_bank: string;
    no_rekening: string;
    nama_rekening: string;
    aktif: string;
    tgl_update: string;
    userid: string;
};
let id: number = 1;
export const customerTab = [
    {
        id: id++,
        name: 'Info Perusahaan',
    },
    {
        id: id++,
        name: 'Info Pemilik',
    },
    {
        id: id++,
        name: 'Daftar Kontak',
    },
    {
        id: id++,
        name: 'Penjualan',
    },
    {
        id: id++,
        name: 'Potensial Produk',
    },
    {
        id: id++,
        name: 'Lain-lain',
    },
    {
        id: id++,
        name: 'Catatan',
    },
    {
        id: id++,
        name: 'File Pendukung',
    },
    {
        id: id++,
        name: 'Rekening Bank',
    },
];

export function onRenderDayCell(args: RenderDayCellEventArgs): void {
    if ((args.date as Date).getDay() === 0) {
        args.isDisabled = true;
    }
}

export const generateNoCust = async (entitas: string, token: string) => {
    const data = await axios.get(`${apiUrl}/erp/generate_no_customer`, {
        params: {
            entitas: entitas,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const no_cust = data.data.data;
    return no_cust;
};

export const fetchDaftarRelasi = async (entitas: string, token: string) => {
    const responseData = await axios.get(`${apiUrl}/erp/list_relasi_dlg`, {
        params: {
            entitas: entitas,
            param1: 'all',
            param2: 'all',
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return responseData.data.data;
};

export const convertJamOpsToObject = (jamOps: JamOpsProps[], kodeCust: string, userid: string) => {
    const jamOpsObject: any = {
        id: '',
        kode_cust: kodeCust,
        jam_buka_1: '',
        jam_buka_2: '',
        jam_buka_3: '',
        jam_buka_4: '',
        jam_buka_5: '',
        jam_buka_6: '',
        jam_buka_7: '',
        jam_tutup_1: '',
        jam_tutup_2: '',
        jam_tutup_3: '',
        jam_tutup_4: '',
        jam_tutup_5: '',
        jam_tutup_6: '',
        jam_tutup_7: '',
        hari_libur: '',
        buka_1: 'N',
        buka_2: 'N',
        buka_3: 'N',
        buka_4: 'N',
        buka_5: 'N',
        buka_6: 'N',
        buka_7: 'N',
        tgl_update: moment(),
        userid: userid.toUpperCase(),
    };

    jamOps.forEach((item) => {
        jamOpsObject[`jam_buka_${item.id}`] = item.JamBuka;
        jamOpsObject[`jam_tutup_${item.id}`] = item.JamTutup;
        jamOpsObject[`buka_${item.id}`] = item.Buka ? 'Y' : 'N';
    });

    return jamOpsObject;
};

export const fetchKategoriKelompok = async (entitas: string, token: string) => {
    const data = await axios.get(`${apiUrl}/erp/list_produk_potensial`, {
        params: {
            entitas: entitas,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data.data.data;
};

export const fetchBank = async (entitas: string, token: string, kode_cust: string) => {
    const data = await axios.get(`${apiUrl}/erp/rekening_customer?`, {
        params: {
            entitas: entitas,
            param1: kode_cust,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data.data.data;
};
