import { useSession } from '@/pages/api/sessionContext';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { RiRefreshFill } from 'react-icons/ri';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';
import axios from 'axios';

import { motion } from 'framer-motion';
import { LinearProgress } from '@mui/material';

const tabKlasifikasiArray = [
    {
        Klasifikasi: 'Semua',
        kelas: 'Semua',
    },
    {
        Klasifikasi: 'Klasifikasi A',
        kelas: 'A',
    },
    {
        Klasifikasi: 'Klasifikasi B',
        kelas: 'B',
    },
    {
        Klasifikasi: 'Klasifikasi C',
        kelas: 'C',
    },
    {
        Klasifikasi: 'Klasifikasi D',
        kelas: 'D',
    },
    {
        Klasifikasi: 'Klasifikasi E',
        kelas: 'E',
    },
    {
        Klasifikasi: 'Klasifikasi F',
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
        kelas: 'AF',
    },
    {
        Klasifikasi: 'TIDAK DIGARAP',
        kelas: 'L',
    },
];

const tipeArray = [
    {
        tipe: 'Lokal',
    },
    {
        tipe: 'Grup',
    },
];

interface FilterListState {
    rayon: any[]; // Ganti 'any' dengan tipe data spesifik jika diketahui
    salesman: any[];
    tipe: any[];
    kategori: any[];
    kelompok_produk: any[];
    propinsi: any[];
    kota: any[];
    kecamatan: any[];
    kelurahan: any[];
}

const ListKonsolidasiCustomer = () => {
    const { sessionData } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const router = useRouter();
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const [activeTab, setActiveTab] = useState('data_customer');
    const gridRekapitulasiSaldo = useRef<Grid | any>(null);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const [dataSourceCustomer, setDataSourceCustomer] = useState([]);

    const [isLoading, setIsLoading] = useState<any>(0);
    const [errorMassage, setErrorMassage] = useState<any>('');
    const [currentIndicator, setCurrentIndicator] = useState<any>('');
    const [showLoadingModal, setShowLoadingModal] = useState<any>(false);

    const [filterState, setFilterState] = useState<any>({
        no_customer: '',
        nama: '',
        kontak_personal: '',
        rayon: '',
        salesman: '',
        tipe: '',
        kategori: '',
        kelompok_produk: '',
        rencana_kunjungan: 'all',
        customer_non_aktif: 'Y',
        tanggal_noo_awal: moment().startOf('month').format('YYYY-MM-DD'),
        tanggal_noo_akhir: moment().format('YYYY-MM-DD'),
        plafond_kredit_sudah_diaktifkan: 'all',
        customer_tunai: 'all',
        terima_dokumen_asli: 'all',
        propinsi: '',
        kota: '',
        kecamatan: '',
        kelurahan: '',
        no_rekening: '',
        nama_rekening: '',
        no_whatsapp: '',
        no_ktp: '',
        sudah_pernah_ada_transaksi: 'all',
        latitude: '',
        longitude: '',
        radius: '',
    }); 
    
    const refereshData = async (klas : any = "Semua") => {
        try {
            let param1: any = 'all',
                param2: any = 'all',
                param3: any = 'all',
                param4: any = 'all',
                param5: any = 'all',
                param6: any = 'all',
                param7: any = 'all',
                param8: any = 'all',
                param9: any = 'all',
                param10: any = 'all',
                param11: any = 'all',
                param12: any = 'all',
                param13: any = 'all',
                param14: any = 'all',
                param15: any = 'all',
                param16: any = 'all',
                param17: any = 'all',
                param18: any = 'all',
                param19: any = 'all',
                param20: any = 'all',
                param21: any = 'all',
                param22: any = 'all',
                param23: any = 'all',
                param24: any = 'all',
                param25: any = 'all',
                param26: any = 'all';
                
                if (filterState.no_customer !== '' && checkboxState.no_customer) {
                param1 = filterState.no_customer;
            }

            if (filterState.nama !== '' && checkboxState.nama) {
                param2 = filterState.nama;
            }
            
            if (filterState.kontak_personal !== '' && checkboxState.kontak_personal) {
                param3 = filterState.kontak_personal;
            }
            
            if (filterState.rayon !== '' && checkboxState.rayon) {
                param4 = filterState.rayon;
            }
            
            // sub area
            // if (filterState.no_customer === '??' && checkboxState.rayon) {
            //     param5 = filterState.no_customer;
            // }

            if (filterState.salesman !== '' && checkboxState.salesman) {
                param6 = filterState.salesman;
            }

            if (filterState.tipe !== '' && checkboxState.tipe) {
                param7 = filterState.tipe;
            }

            if (filterState.tanggal_noo_awal !== '' && checkboxState.tanggal_noo) {
                const temp = moment(filterState.tanggal_noo_awal).hour(moment().hour()).minute(moment().minute()).second(59).millisecond(999);

                param8 = filterState.tanggal_noo_awal;
            }

            if (filterState.tanggal_noo_akhir !== '' && checkboxState.tanggal_noo) {
                param9 = filterState.tanggal_noo_akhir;
            }
            
            if (filterState.kota !== '' && checkboxState.kota) {
                param10 = filterState.kota;
            }
            
            if (filterState.kecamatan !== '' && checkboxState.kecamatan) {
                param11 = filterState.kecamatan;
            }
            
            if (filterState.kelurahan !== '' && checkboxState.kelurahan) {
                param12 = filterState.kelurahan;
            }

            if (filterState.propinsi !== '' && checkboxState.propinsi) {
                param13 = filterState.propinsi;
            }
            
            if (filterState.no_rekening !== '' && checkboxState.no_rekening) {
                param14 = filterState.no_rekening;
            }
            
            if (filterState.nama_rekening !== '' && checkboxState.nama_rekening) {
                param15 = filterState.nama_rekening;
            }

            if (filterState.no_whatsapp !== '' && checkboxState.no_whatsapp) {
                param16 = filterState.no_whatsapp;
            }
            
            if (filterState.no_ktp !== '' && checkboxState.no_ktp) {
                param17 = filterState.no_ktp;
            }
            // kalo aktif ? kalo non ?
            if (filterState.rencana_kunjungan !== 'all') {
                param18 = filterState.rencana_kunjungan;
            }
            
            if(filterState.customer_non_aktif !== 'all'){
                param26 = filterState.customer_non_aktif;
            }
            
            if (klas !== 'Semua') {
                param19 = klas;
            }
            
            if (filterState.plafond_kredit_sudah_diaktifkan !== 'all') {
                param20 = filterState.plafond_kredit_sudah_diaktifkan === 'Y' ? 1 : 0;
            }
            
            if (filterState.customer_tunai !== '' && checkboxState.rayon) {
                param21 = filterState.customer_tunai;
            }

            if (filterState.terima_dokumen_asli !== '') {
                param22 = filterState.terima_dokumen_asli;
            }
            
            if (filterState.sudah_pernah_ada_transaksi !== 'all' && checkboxState.rayon) {
                param23 = filterState.sudah_pernah_ada_transaksi === 'Y' ? 1 : 0;
            }

            if (filterState.kategori !== '' && checkboxState.kategori) {
                param24 = filterState.kategori;
            }
            
            if (filterState.kelompok_produk !== '' && checkboxState.kelompok_produk) {
                param25 = filterState.kelompok_produk;
            }

            

            
            
            const temp: any = [];
            setErrorMassage('');
            
            for (const item of selectedEntitas) {
        setShowLoadingModal(true);
        setCurrentIndicator(`Memulai fetch di entitas ${item}`);
        setIsLoading(10);

        try {
            const response = await axios.get(`${apiUrl}/erp/list_info_cust?`, {
                params: {
                    entitas: item,
                    param1,
                    param2,
                    param3,
                    param4,
                    param5,
                    param6,
                    param7,
                    param8,
                    param9,
                    param10,
                    param11,
                    param12,
                    param13,
                    param14,
                    param15,
                    param16,
                    param17,
                    param18,
                    param19,
                    param20,
                    param21,
                    param22,
                    param23,
                    param24,
                    param25,
                    param26,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setCurrentIndicator(`Modifikasi data di entitas ${item}`);
            setIsLoading(50);

            const responseData = response.data.data;
            const modData = responseData
                .map((itemTemp: any) => {
                    if (checkboxState.longLangFilt) {
                        if (itemTemp.latitude !== null && itemTemp.longitude !== null) {
                            const tempLong: any = calculateDistance(itemTemp.latitude, itemTemp.longitude);
                            if (parseInt(tempLong) <= filterState.radius) {
                                const tempMeter = new Intl.NumberFormat('id-ID').format(parseInt(tempLong));
                                return {
                                    ...itemTemp,
                                    tgl_register: itemTemp.tgl_register === null ? null : moment(itemTemp.tgl_register).format('YYYY-MM-DD'),
                                    entitas: item,
                                    radius_jarak: `${tempMeter} M`,
                                };
                            }
                        }

                        return null; // Kembalikan null jika latitude/longitude tidak ada atau tidak memenuhi radius
                    } else {
                        return {
                            ...itemTemp,
                            tgl_register: itemTemp.tgl_register === null ? null : moment(itemTemp.tgl_register).format('YYYY-MM-DD'),
                            entitas: item,
                            radius_jarak: null,
                        };
                    }
                })
                .filter((item: any) => item !== null);

            temp.push(...modData);

            setIsLoading(100);
            setCurrentIndicator(`Modifikasi berhasil di entitas ${item}`);
        } catch (error) {
            console.error(`Error fetching data for entity ${item}:`, error);
            setCurrentIndicator(`Gagal memproses entitas ${item}`);
        }
                }

    setDataSourceCustomer(temp);
    setShowLoadingModal(false);
            } catch (error) {
            setErrorMassage('terjadi kesalahan');
        } 
    };

    // console.log('DataSourceCustomer', dataSourceCustomer);

    const [checkboxState, setCheckboxState] = useState({
        no_customer: false,
        nama: false,
        kontak_personal: false,
        rayon: false,
        salesman: false,
        tipe: false,
        kategori: false,
        kelompok_produk: false,
        tanggal_noo: false,
        propinsi: false,
        kota: false,
        kecamatan: false,
        kelurahan: false,
        no_rekening: false,
        nama_rekening: false,
        no_whatsapp: false,
        no_ktp: false,
        longLangFilt: false,
    });

    function calculateDistance(lat1Param: any, lon1Param: any) {
        const lat1 = parseFloat(lat1Param);
        const lon1 = parseFloat(lon1Param);

        const lat2: any = parseFloat(filterState.latitude);
        const lon2: any = parseFloat(filterState.longitude);
        const R = 6371e3; // Radius bumi dalam meter
        const φ1 = lat1 * (Math.PI / 180); // Konversi latitude pertama ke radian
        const φ2 = lat2 * (Math.PI / 180); // Konversi latitude kedua ke radian
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Jarak dalam meter
        return distance;
    }

    // const getcurrentLongitude = () => {
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             filterState.latitude = latitude;
    //             filterState.longitude = longitude;
    //         },
    //         (error) => {
    //             console.error('Error getting location:', error);
    //         }
    //     );
    // };

    const [listEntitas, setListEntitas] = useState<any>([]);

    const [filterListState, setFilterListState] = useState<FilterListState>({
        rayon: [],
        salesman: [],
        tipe: [...tipeArray],
        kategori: [],
        kelompok_produk: [],
        propinsi: [],
        kota: [],
        kecamatan: [],
        kelurahan: [],
    });

    const [selectedEntitas, setSelectedEntitas] = useState<any>([]);
    const [filterKlasifikasi, setFilterKlasifikasi] = useState('Semua');

    // useEffect(() => {
    //         refereshData()
    //     setShowLoadingModal(false);
    // }, [filterKlasifikasi]);

    // console.log('selectedEntitas', selectedEntitas);

    // Handle checkbox change
    const handleCheckboxChange = (kode: any) => {
        console.log(`selectedEntitas.includes(${kode})`, selectedEntitas.includes(kode));

        setSelectedEntitas((prevSelectedEntitas: any) => {
            // Check if kode is already selected
            if (prevSelectedEntitas.includes(kode)) {
                // Remove the kode from selected codes if already selected
                return prevSelectedEntitas.filter((item: any) => item !== kode);
            } else {
                // Add kode to selected codes if not already selected
                return [...prevSelectedEntitas, kode];
            }
        });
    };

    const pilihSemua = async () => {
        if (selectedEntitas.length !== listEntitas.length) {
            const cabang: any = [];
            await Promise.all(
                listEntitas.map((item: any) => {
                    return cabang.push(item.kodecabang);
                })
            );
            setSelectedEntitas([...cabang]);
        } else {
            setSelectedEntitas([]);
        }
    };

    const getAllEntitas = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/entitas_pajak?`, {
                params: {
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const filteredData = response.data.data.filter((item: any) => item.tampil === 'Y' && item.kodecabang !== '898');

            setListEntitas(filteredData);
        } catch (error) {
            console.log();
        }
    };
    const DataWilayah = async () => {
        const wilayahResponse = await axios.get(`${apiUrl}/erp/master_wilayah?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            rayon: wilayahResponse.data.data,
        }));
    };

    const DataSalesman = async () => {
        const salesmanResponse = await axios.get(`${apiUrl}/erp/salesman?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        console.log('salesmanResponse');

        setFilterListState((oldData) => ({
            ...oldData,
            salesman: salesmanResponse.data.data,
        }));
    };
    const dataKategori = async () => {
        const kategoriResponse = await axios.get(`${apiUrl}/erp/kategori?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kategori: kategoriResponse.data.data,
        }));
    };
    const dataKelompok = async () => {
        const kelompokResponse = await axios.get(`${apiUrl}/erp/kelompok?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kelompok_produk: kelompokResponse.data.data,
        }));
    };
    const dataPropinsi = async () => {
        const ProvinsiResponse = await axios.get(`${apiUrl}/erp/list_wilayah_daftar_relasi?`, {
            params: {
                entitas: kode_entitas,
                param1: 'provinsi',
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            propinsi: ProvinsiResponse.data.data,
        }));
    };
    const dataKota = async () => {
        const KotaResponse = await axios.get(`${apiUrl}/erp/list_wilayah_daftar_relasi?`, {
            params: {
                entitas: kode_entitas,
                param1: 'kota',
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kota: KotaResponse.data.data,
        }));
    };
    const dataKecamatan = async () => {
        const KecamatanResponse = await axios.get(`${apiUrl}/erp/list_wilayah_daftar_relasi?`, {
            params: {
                entitas: kode_entitas,
                param1: 'kecamatan',
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kecamatan: KecamatanResponse.data.data,
        }));
    };

    const dataKelurahan = async () => {
        const KelurahanResponse = await axios.get(`${apiUrl}/erp/list_wilayah_daftar_relasi?`, {
            params: {
                entitas: kode_entitas,
                param1: 'kelurahan',
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kelurahan: KelurahanResponse.data.data,
        }));
    };

    // console.log('filterListState', filterListState);

    useEffect(() => {
        if (token) {
            getAllEntitas();
            DataWilayah();
            DataSalesman();
            dataKategori();
            dataKelompok();
            dataPropinsi();
            dataKota();
            dataKecamatan();
            dataKelurahan();
        }
    }, [token]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        // Update filterState
        setFilterState((prev: any) => ({
            ...prev,
            [name]: value,
        }));

        // Update checkboxState
        setCheckboxState((prev) => ({
            ...prev,
            [name]: value.trim() !== '',
        }));
    };

    // console.log("filterListState", filterListState); 
    
    return (
        <>
            <div className="relative flex h-[70vh] w-full" id="targetForSwal">
                <div className="h-full w-[250px] ">
                    <div className="-mt-5 flex border-b border-gray-300">
                        <button
                            onClick={() => setActiveTab('data_customer')}
                            className={`px-3 py-2 text-xs font-semibold ${activeTab === 'data_customer' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Data Customer
                        </button>
                        <button
                            onClick={() => setActiveTab('konsolidasi')}
                            className={`px-3 py-2 text-xs font-semibold ${activeTab === 'konsolidasi' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Konsolidasi
                        </button>
                    </div>
                    <div className={`flex h-full w-full flex-col rounded border border-black-light ${activeTab === 'data_customer' ? 'block' : 'hidden'}`}>
                        <div className="h-[90%] overflow-x-auto bg-gray-300 p-1">
                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                no_customer: e.target.checked,
                                            }))
                                        }
                                        checked={checkboxState.no_customer}
                                        readOnly
                                    />{' '}
                                    No. Customer
                                </label>
                                <input
                                    type="text"
                                    id="no_customer"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="No. Customer"
                                    name="no_customer"
                                    value={filterState.no_customer}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.nama}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                nama: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Nama"
                                    name="nama"
                                    value={filterState.nama}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.kontak_personal}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                kontak_personal: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Kontak Personal
                                </label>
                                <input
                                    type="text"
                                    id="kontak_personal"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Kontak Personal"
                                    name="kontak_personal"
                                    value={filterState.kontak_personal}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>
                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.rayon}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                rayon: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Rayon (Wilayah Penjualan)
                                </label>
                                <select
                                    name="rayon"
                                    value={filterState.rayon}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Rayon</option>
                                    {filterListState.rayon.map((item: any, index) => (
                                        <option value={`${item.kode_area}`}>
                                        {item.area} {item.lokasi}
                                    </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.salesman}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                salesman: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Salesman
                                </label>
                                <select
                                    name="salesman"
                                    value={filterState.salesman}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Salesman</option>
                                    {filterListState.salesman.map((item: any, index) => (
                                        <option value={item.nama_sales} key={index}>
                                            {item.nama_sales}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.tipe}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                tipe: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Tipe
                                </label>
                                <select
                                    name="tipe"
                                    value={filterState.tipe}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Tipe</option>
                                    {filterListState.tipe.map((item: any, index) => (
                                        <option value={item.tipe} key={index}>
                                            {item.tipe}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center font-bold text-black">
                                <span>Potensial Produk</span>
                                <hr className="ml-2 flex-grow border-t border-black" />
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.kategori}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                kategori: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Kategori
                                </label>
                                <select
                                    name="kategori"
                                    value={filterState.kategori}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Kategori</option>
                                    {filterListState.kategori.map((item: any, index) => (
                                        <option value={item.grp} key={index}>
                                            {item.grp}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.kelompok_produk}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                kelompok_produk: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Kelompok Produk
                                </label>
                                <select
                                    name="kelompok_produk"
                                    value={filterState.kelompok_produk}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Kelompok Produk</option>
                                    {filterListState.kelompok_produk.map((item: any, index) => (
                                        <option value={item.kel} key={index}>
                                            {item.kel}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-0.5 text-xs font-semibold text-gray-700">Rencana Kunjungan</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="rencana_kunjungan" value="Y" checked={filterState.rencana_kunjungan === 'Y'} onChange={handleInputChange} className="mr-1" />
                                        Ya
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="rencana_kunjungan" value="N" checked={filterState.rencana_kunjungan === 'N'} onChange={handleInputChange} className="mr-1" />
                                        Tidak
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="rencana_kunjungan" value="all" checked={filterState.rencana_kunjungan === 'all'} onChange={handleInputChange} className="mr-1" />
                                        Semua
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-0.5 text-xs font-semibold text-gray-700">Customer Non Aktif</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="customer_non_aktif" value="N" checked={filterState.customer_non_aktif === 'N'} onChange={handleInputChange} className="mr-1" />
                                        Ya
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="customer_non_aktif" value="Y" checked={filterState.customer_non_aktif === 'Y'} onChange={handleInputChange} className="mr-1" />
                                        Tidak
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="customer_non_aktif" value="all" checked={filterState.customer_non_aktif === 'all'} onChange={handleInputChange} className="mr-1" />
                                        Semua
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={checkboxState.tanggal_noo}
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                tanggal_noo: e.target.checked,
                                            }))
                                        }
                                    />{' '}
                                    Tanggal NOO
                                </label>
                                <div className="flex w-full items-center">
                                    <input
                                        type="date"
                                        name="tanggal_noo_awal"
                                        value={filterState.tanggal_noo_awal}
                                        onChange={handleInputChange}
                                        className="w-[110px] rounded-sm border border-gray-400 bg-gray-50 p-0 text-xs leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        style={{ height: '20px' }}
                                    />

                                    <label className="mr-1 flex w-10 text-xs" style={{ marginBottom: -2 }}>
                                        S/D
                                        <input
                                            type="date"
                                            name="tanggal_noo_akhir"
                                            value={filterState.tanggal_noo_akhir}
                                            onChange={handleInputChange}
                                            className="w-[110px] rounded-sm border border-gray-400 bg-gray-50 p-0 text-xs leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            style={{ height: '20px' }}
                                        />
                                    </label>
                                </div>

                                <div className="mt-1 flex flex-col">
                                    <label className="mb-0.5 text-xs font-semibold text-gray-700">Plafond Kredit Sudah Diaktifkan</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="plafond_kredit_sudah_diaktifkan"
                                                value="Y"
                                                checked={filterState.plafond_kredit_sudah_diaktifkan === 'Y'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Ya
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="plafond_kredit_sudah_diaktifkan"
                                                value="N"
                                                checked={filterState.plafond_kredit_sudah_diaktifkan === 'N'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Tidak
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="plafond_kredit_sudah_diaktifkan"
                                                value="all"
                                                checked={filterState.plafond_kredit_sudah_diaktifkan === 'all'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Semua
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-0.5 text-xs font-semibold text-gray-700">Customer Tunai</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center text-xs">
                                            <input type="radio" name="customer_tunai" value="Y" checked={filterState.customer_tunai === 'Y'} onChange={handleInputChange} className="mr-1" />
                                            Ya
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input type="radio" name="customer_tunai" value="N" checked={filterState.customer_tunai === 'N'} onChange={handleInputChange} className="mr-1" />
                                            Tidak
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input type="radio" name="customer_tunai" value="all" checked={filterState.customer_tunai === 'all'} onChange={handleInputChange} className="mr-1" />
                                            Semua
                                        </label>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-0.5 text-xs font-semibold text-gray-700">{`Terima dokumen asli (Kantor Pusat)`}</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center text-xs">
                                            <input type="radio" name="terima_dokumen_asli" value="Y" checked={filterState.terima_dokumen_asli === 'Y'} onChange={handleInputChange} className="mr-1" />
                                            Ya
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input type="radio" name="terima_dokumen_asli" value="N" checked={filterState.terima_dokumen_asli === 'N'} onChange={handleInputChange} className="mr-1" />
                                            Tidak
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="terima_dokumen_asli"
                                                value="all"
                                                checked={filterState.terima_dokumen_asli === 'all'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Semua
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.propinsi}
                                            onChange={(e: any) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    propinsi: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Propinsi
                                    </label>
                                    <select
                                        name="propinsi"
                                        value={filterState.propinsi}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Select propinsi</option>
                                        {filterListState.propinsi.map((item: any, index) => (
                                            <option value={item.nama_propinsi} key={index}>
                                                {item.nama_propinsi}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.kota}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    kota: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Kota
                                    </label>
                                    <select
                                        name="kota"
                                        value={filterState.kota}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Select kota</option>
                                        {filterListState.kota.map((item: any, index) => (
                                            <option value={item.nama_kota} key={index}>
                                                {item.nama_kota}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.kecamatan}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    kecamatan: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Kecamatan
                                    </label>
                                    <select
                                        name="kecamatan"
                                        value={filterState.kecamatan}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Select kecamatan</option>
                                        {filterListState.kecamatan.map((item: any, index) => (
                                            <option value={item.nama_kecamatan} key={index}>
                                                {item.nama_kecamatan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.kelurahan}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    kelurahan: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Kelurahan
                                    </label>
                                    <select
                                        name="kelurahan"
                                        value={filterState.kelurahan}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Select Rayon</option>
                                        {filterListState.kelurahan.map((item: any, index) => (
                                            <option value={item.nama_kelurahan} key={index}>
                                                {item.nama_kelurahan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center font-bold text-black">
                                    <span>Bank</span>
                                    <hr className="ml-2 flex-grow border-t border-black" />
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.no_rekening}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    no_rekening: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        No Rekening
                                    </label>
                                    <input
                                        type="text"
                                        id="no_rekening"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Kontak Personal"
                                        name="no_rekening"
                                        value={filterState.no_rekening}
                                        onChange={handleInputChange}
                                        style={{ height: '3vh' }}
                                    />
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.nama_rekening}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    nama_rekening: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Nama Rekening
                                    </label>
                                    <input
                                        type="text"
                                        id="nama_rekening"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Kontak Personal"
                                        name="nama_rekening"
                                        value={filterState.nama_rekening}
                                        onChange={handleInputChange}
                                        style={{ height: '3vh' }}
                                    />
                                </div>

                                <div className="flex items-center font-bold text-black">
                                    <span>WhatsApp</span>
                                    <hr className="ml-2 flex-grow border-t border-black" />
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.no_whatsapp}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    no_whatsapp: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        No Whatsapp
                                    </label>
                                    <input
                                        type="text"
                                        id="no_whatsapp"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Kontak Personal"
                                        name="no_whatsapp"
                                        value={filterState.no_whatsapp}
                                        onChange={handleInputChange}
                                        style={{ height: '3vh' }}
                                    />
                                </div>

                                <div className="flex items-center font-bold text-black">
                                    <span>KTP</span>
                                    <hr className="ml-2 flex-grow border-t border-black" />
                                </div>

                                <div className="mb-0.5 flex flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.no_ktp}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    no_ktp: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        No. KTP
                                    </label>
                                    <input
                                        type="text"
                                        id="no_ktp"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Kontak Personal"
                                        name="no_ktp"
                                        value={filterState.no_ktp}
                                        onChange={handleInputChange}
                                        style={{ height: '3vh' }}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="mb-0.5 text-xs font-semibold text-gray-700">Sudah Pernah Ada Transaksi</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="sudah_pernah_ada_transaksi"
                                                value="Y"
                                                checked={filterState.sudah_pernah_ada_transaksi === 'Y'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Ya
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="sudah_pernah_ada_transaksi"
                                                value="N"
                                                checked={filterState.sudah_pernah_ada_transaksi === 'N'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Tidak
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input
                                                type="radio"
                                                name="sudah_pernah_ada_transaksi"
                                                value="all"
                                                checked={filterState.sudah_pernah_ada_transaksi === 'all'}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            Semua
                                        </label>
                                    </div>
                                </div>
                                <div className="flex items-center font-bold text-black">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.longLangFilt}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    longLangFilt: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Radius Wilayah
                                    </label>
                                    <hr className="ml-2 flex-grow border-t border-black" />
                                </div>
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">Latitude</label>
                                <input
                                    type="text"
                                    id="latitude"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="latitude"
                                    name="latitude"
                                    value={filterState.latitude}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>
                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">Longitude</label>
                                <input
                                    type="text"
                                    id="longitude"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Longitude"
                                    name="longitude"
                                    value={filterState.longitude}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>
                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">{`Radius (Meter)`}</label>
                                <input
                                    type="text"
                                    id="radius"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Jarak"
                                    name="radius"
                                    value={filterState.radius}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>
                        </div>
                        <div className="flex h-[10%] w-full items-center justify-center bg-white">
                            <button
                                onClick={async() => await refereshData()}
                                className="ml-3 flex h-7 items-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                            >
                                <RiRefreshFill className="text-md" />
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className={`flex h-full w-full flex-col rounded border border-black-light ${activeTab === 'konsolidasi' ? 'block' : 'hidden'}`}>
                        <div className="h-[90%] overflow-x-auto bg-gray-300 p-1">
                            <div className="mb-0.5 flex items-center">
                                <input type="checkbox" id="all-entitas" onChange={pilihSemua} />
                                <label htmlFor={`all-entitas`} className="m-0 text-xs text-gray-900">
                                    {`pilih semua`}
                                </label>
                            </div>
                            {listEntitas.map((item: any) => (
                                <div key={item.kodecabang} className="mb-0.5 flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${item.kodecabang}`}
                                        value={item.kodecabang}
                                        checked={selectedEntitas.includes(item.kodecabang)}
                                        onChange={() => handleCheckboxChange(item.kodecabang)}
                                    />
                                    <label htmlFor={`checkbox-${item.kodecabang}`} className="m-0 text-xs text-gray-900">
                                        {`[${item.kodecabang}] ${item.cabang}`}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex h-[10%] w-full items-center justify-center bg-white">
                            <button
                                onClick={async() => await refereshData()}
                                className="ml-3 flex h-7 items-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                            >
                                <RiRefreshFill className="text-md" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
                <div className=" h-full w-[80%]">
                    <div className="-mt-3 flex h-[30px] w-full overflow-x-auto overflow-y-hidden border-b border-gray-300">
                        {tabKlasifikasiArray.map((item) => (
                            <motion.button
                                key={item.kelas}
                                onClick={async() => {await refereshData(item.kelas); setFilterKlasifikasi(item.kelas)}}
                                className={`whitespace-nowrap px-3 py-2 text-xs font-semibold ${
                                    filterKlasifikasi === item.kelas ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'
                                }`}
                                whileTap={{ scale: 1.1 }} // Menambahkan animasi scale saat ditekan
                                transition={{ duration: 0.2 }}
                            >
                                {item.Klasifikasi}
                            </motion.button>
                        ))}
                    </div>
                    <div>
                        <GridComponent
                            id="gridListData"
                            locale="id"
                            dataSource={dataSourceCustomer}
                            // ref={(g: any) => (gridListData = g)}
                            editSettings={{ allowDeleting: true }}
                            selectionSettings={{
                                mode: 'Row',
                                type: 'Single',
                            }}
                            allowPaging={true}
                            allowSorting={true}
                            allowFiltering={false}
                            allowResizing={true}
                            autoFit={true}
                            allowReordering={true}
                            pageSettings={{
                                pageSize: 25,
                                pageCount: 5,
                                pageSizes: ['25', '50', '100', 'All'],
                            }}
                            rowHeight={22}
                            height={"60vh"}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="entitas" headerText="Entitas" headerTextAlign="Center" textAlign="Center" width="40" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="250" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="ktp" headerText="No. KTP" headerTextAlign="Center" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="tgl_register" headerText="Tgl. Register" headerTextAlign="Center" textAlign="Center" width={80} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kelas" headerText="Klasifikasi" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective
                                    field="telp"
                                    headerText="Telp"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    // autoFit
                                    width="100"
                                    clipMode="EllipsisWithTooltip"
                                />
                                <ColumnDirective field="hp" headerText="No. HP" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="no_hp2" headerText="WhatsApp" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="area" headerText="Kode RA" headerTextAlign="Center" textAlign="Center" width="80" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="lokasi" headerText="Wilayah Penjualan" headerTextAlign="Center" textAlign="Center" autoFit clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kecamatan" headerText="Kecamatan" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kelurahan" headerText="Kelurahan" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_sales" headerText="SalesMan" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="plafond" headerText="Plafond Kredit" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_termin" headerText="Termin" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" autoFit clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_bank" headerText="Nama Bank" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="no_rekening" headerText="No. Rekening" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_rekening" headerText="Nama Rekening" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="radius_jarak" headerText="Radius Jarak" headerTextAlign="Center" textAlign="Center" width={120} clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder, ExcelExport, PdfExport]} />
                        </GridComponent>
                    </div>
                </div>
            </div>

            <DialogComponent width="500px" height="200px" isModal={true} target="#targetForSwal" visible={showLoadingModal} close={() => setShowLoadingModal(false)} overlayClick={() => {}}>
                <div className="flex h-full w-full items-center justify-center">
                    <div className="w-full flex-grow px-10">
                        <p>Proses : {currentIndicator}</p>
                        <LinearProgress variant="buffer" value={isLoading} color={errorMassage === '' ? 'primary' : 'error'} valueBuffer={isLoading} />
                        <p className="text-red italic">{errorMassage === '' ? '' : errorMassage}</p>
                    </div>
                    {errorMassage.length !== 0 && (
                        <div className="flex w-full gap-2">
                            <button className="bg-red-400 p-5" onClick={() => setShowLoadingModal(false)}>
                                Tutup
                            </button>

                            <button className="bg-red-400 p-5">Coba lagi</button>
                        </div>
                    )}
                </div>
            </DialogComponent>
        </>
    );
};

export default ListKonsolidasiCustomer;
