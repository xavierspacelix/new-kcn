import { ColumnMenuItemModel } from '@syncfusion/ej2/grids';
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
import axios from 'axios';
import Swal from 'sweetalert2';

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
        if (item.type === "radio") {
            // Logika khusus untuk tipe radio
            acc[`param${counter}`] = item.value; 
            counter++;
        } else if (item.type === "dateRange") {
            acc[`param${counter}`] = item.checked && item.awalValue ? item.awalValue.toISOString().split('T')[0] : "all";
            counter++;
            acc[`param${counter}`] = item.checked && item.akhirValue ? item.akhirValue.toISOString().split('T')[0] : "all";
            counter++;
        } else {
            acc[`param${counter}`] = item.checked ? item.value : "all";
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
            }
        });
        return data.data.data;
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
    const data = await axios.get(`${apiUrl}/erp/list_wilayah_daftar_relasi?`, {
        params: {
            entitas: entitas,
            param1: type,
        },
    });
    return data.data.data;
};
