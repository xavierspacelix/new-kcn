import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import styles from './daftarRelasi.module.css';
import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import { getServerSideProps } from '@/pages/api/getServerSide';
import axios from 'axios';
interface daftarRelasiMainFormProps {
    userid: any;
    kode_entitas: any;
    kode_user: any;
}
const createDaftarRelasi = ({ kode_entitas, kode_user }: daftarRelasiMainFormProps) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const routerDaftarRelasi = useRouter();
    const mounted = useRef(false);

    const [dateSejakRelasi, setDateSejakRelasi] = useState(moment());
    const [mTglRelasi, mSetTglRelasi] = useState(moment()); // useState<any>(new Date());
    const [tipeRelasiValue, setTipeRelasiValue] = useState('');
    const [mNamaPerusahaan, mSetNamaPerusahaan] = useState('');
    const [dataDetail, setDataDetail] = useState({ nodes: [] });
    // const [apiTipeRelasiValue, setApiTipeRelasiValue] =
    const { x_ } = routerDaftarRelasi.query;
    interface QueryParams {
        [key: string]: string;
    }
    let decodedData: string = '';
    let pJenisValue: any, pKodeRelasiValue: any;

    if (typeof x_ === 'string') {
        decodedData = Buffer.from(x_, 'base64').toString('ascii');

        const queryParams = decodedData.split('&').reduce((acc: QueryParams, keyValue) => {
            const [key, value] = keyValue.split('=');
            acc[key] = value;
            return acc;
        }, {} as QueryParams);

        const { kode_relasi, jenis } = queryParams;
        pKodeRelasiValue = kode_relasi;
        pJenisValue = jenis;
    }
    const [mKodeRelasi, mSetKodeRelasi] = useState('');
    const [mTipeRelasi, mSetTipeRelasi] = useState('');
    const [mAlamatRelasi, mSetAlamatRelasi] = useState('');
    const apiTipeRelasi = [{ tipe: 'Perorangan' }, { tipe: 'Badan Hukum' }];
    const EditRelasi = async (pKodeRelasi: any) => {
        try {
            const headerRelasi = await axios.get(`${apiUrl}/erp/list_daftar_relasi?`, {
                params: {
                    entitas: kode_entitas,
                    param1: pKodeRelasi,
                    param2: 'all',
                    param3: 'all',
                    paramLimit: '25',
                },
            });

            const result = headerRelasi.data.data;
            console.log(result);

            const resHeader = result[0] || {};
            mSetKodeRelasi(resHeader.kode_relasi);
            mSetTipeRelasi(resHeader.tipe);
            mSetTglRelasi(resHeader.tgl_relasi);
            mSetNamaPerusahaan(resHeader.nama_relasi);
            mSetAlamatRelasi(resHeader.alamat);
        } catch (error) {
            console.error('Error fetching data master Daftar Relasi:', error);
        }
    };
    const handleSelectOnChange = (e: any, tipe: any) => {
        const selectedValue = e.target.value;
        if (tipe === 'tipe_relasi') {
            mSetTipeRelasi(selectedValue);
        }
    };
    const handleRelasiBaru = () => {
        const id = dataDetail.nodes.length + 1;

        const newNode = {
            id: id,
            id_mpb: id,
            no_item: '',
            diskripsi: '',
            satuan: '',
            qty: 0,
            ket: '',
            berat: 0,
            no_dok: '',
            no_sj: '',
            tgl_sj: new Date(),
        };

        const fieldKosong = dataDetail.nodes.some((row: { diskripsi: string }) => row.diskripsi === '');

        if (!fieldKosong) {
            // console.log('not kosong')
            setDataDetail((state: any) => ({
                ...state,
                nodes: state.nodes.concat(newNode),
                // nodes: dataDetail.nodes,
            }));
            // console.log(newNode.no_sj)
        } else {
            alert('Harap isi detail sebelum tambah data');
        }
        // throw new Error('Function not implemented.');
    };
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            if (pJenisValue !== 'edit') {
                handleRelasiBaru();
            }

            if (pJenisValue === 'edit') {
                // if (!kode_mpb === "") {
                EditRelasi(pKodeRelasiValue);
            }
        }
    }, [EditRelasi, handleRelasiBaru, kode_entitas, kode_user, pJenisValue, pKodeRelasiValue, routerDaftarRelasi.query]);
    const [noRegisterValue, setNoRegisterValue] = useState('');
    return (
        <div>
            <div className="table-responsive panel mb-3" style={{ background: '#dedede' }}>
                <div className="mb-5">
                    <div className="mb-3 flex" style={{ alignItems: 'center' }}>
                        <div style={{ flex: 0.5, fontSize: '2.5vh' }}> Relasi Baru </div>
                        <div
                            style={{
                                flex: 1.0,
                                marginBottom: -11,
                                marginTop: 2,
                            }}
                        ></div>
                        <div
                            style={{
                                marginBottom: -11,
                                marginTop: 2,
                                textAlign: 'right',
                                background: 'black',
                                color: 'white',
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        ></div>
                    </div>
                    {/* Form */}
                    <table className={styles.table}>
                        <tbody>
                            <tr>
                                <th
                                    style={{
                                        textAlign: 'center',
                                        width: '15%',
                                        background: `#adf4f5`,
                                        fontWeight: `bold`,
                                        color: `black`,
                                    }}
                                >
                                    No. Register
                                </th>
                                <th
                                    style={{
                                        textAlign: 'center',
                                        width: '20%',
                                        background: `#adf4f5`,
                                        fontWeight: `bold`,
                                        color: `black`,
                                    }}
                                >
                                    Tipe Relasi
                                </th>
                                <th
                                    style={{
                                        textAlign: 'center',
                                        width: '20%',
                                        background: `#adf4f5`,
                                        fontWeight: `bold`,
                                        color: `black`,
                                    }}
                                >
                                    Relasi Sejak
                                </th>
                                <th
                                    style={{
                                        textAlign: 'center',
                                        width: '45%',
                                        background: `#adf4f5`,
                                        fontWeight: `bold`,
                                        color: `black`,
                                    }}
                                >
                                    Perusahaan
                                </th>
                            </tr>
                            <tr>
                                <td
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                    }}
                                >
                                    <div className="flex" style={{ justifyContent: 'center' }}>
                                        <input
                                            className={`${styles.inputTableBasic}`}
                                            type="text"
                                            placeholder="<New Reg>"
                                            id="No. Register"
                                            value={mKodeRelasi}
                                            readOnly={true}
                                            style={{ borderRadius: 4, height: 23, marginTop: -4, marginBottom: -4, textAlign: 'center' }}
                                        />
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <select id="tipeRelasi" className="form-select" onChange={(e) => handleSelectOnChange(e, 'tipe_relasi')} value={mTipeRelasi}>
                                        <option value="" hidden>
                                            -- Silahkan Pilih Data --
                                        </option>
                                        {apiTipeRelasi.map((tipe) => (
                                            <option key={tipe.tipe} value={tipe.tipe}>
                                                {tipe.tipe}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <Flatpickr
                                        value={moment(mTglRelasi).format('DD-MM-YYYY HH:mm:ss')}
                                        options={{
                                            dateFormat: 'd-m-Y',
                                        }}
                                        style={{
                                            width: '20vh',
                                            borderRadius: 4,
                                            height: 23,
                                            marginTop: -4,
                                            marginBottom: -4,
                                            textAlign: 'center',
                                        }}
                                        className={` ${styles.inputTableBasicDate}`}
                                        onChange={(date) => {
                                            const selectedTglSejakRelas = moment(date[0]);
                                            selectedTglSejakRelas.set({
                                                hour: moment().hour(),
                                                minute: moment().minute(),
                                                second: moment().second(),
                                            });
                                            mSetTglRelasi(selectedTglSejakRelas);
                                        }}
                                    />
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="flex">
                                        <input
                                            id="perushaaan"
                                            placeholder="Masukan Nama Perusahaan"
                                            type="text"
                                            defaultValue={mNamaPerusahaan}
                                            className={`mt-1 ltr:rounded-r-none rtl:rounded-l-none ${styles.inputTableBasicSearch}`}
                                            style={{
                                                padding: 4,
                                                borderRadius: 4,
                                                height: 23,
                                                marginTop: -4,
                                                marginBottom: -4,
                                            }}
                                            onChange={(e) => mSetNamaPerusahaan(e.target.value)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="panel" id="detail">
                    <div className="mb-5">
                        {/* <h5 className="text-lgfont-semibold dark:text-white-light">DETAIL</h5> */}
                        <Tab.Group>
                            <Tab.List className="mt-3 flex flex-wrap">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? 'flex items-center justify-between gap-3 text-secondary !outline-none before:!w-full' : 'flex items-center justify-between gap-3'}
                                            relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                            id="1"
                                        >
                                            {/* prettier-ignore */}
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path opacity="0.5" d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195" stroke="currentColor" stroke-width="1.5"></path> <path d="M8 14H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 10.5H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M9 17.5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path> <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="currentColor" stroke-width="1.5"></path> </svg>
                                            1. Informasi
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${
                                                selected ? 'flex items-center justify-between gap-3 text-secondary !outline-none before:!w-full' : 'flex items-center justify-between gap-3'
                                            } relative -mb-[1px] flex items-center p-5 py-3 before:absolute before:bottom-0 before:left-0 before:right-0 before:m-auto before:inline-block before:h-[1px] before:w-0 before:bg-secondary before:transition-all before:duration-700 hover:text-secondary hover:before:w-full`}
                                        >
                                            {/* prettier-ignore */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" > <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M14 2s2.2.2 5 3 3 5 3 5M14.207 5.536s.99.282 2.475 1.767c1.485 1.485 1.768 2.475 1.768 2.475M10.038 5.316l.649 1.163c.585 1.05.35 2.426-.572 3.349 0 0 0 0 0 0s-1.12 1.119.91 3.148c2.027 2.027 3.146.91 3.147.91 0 0 0 0 0 0 .923-.923 2.3-1.158 3.349-.573l1.163.65c1.585.884 1.772 3.106.379 4.5-.837.836-1.863 1.488-2.996 1.53-1.908.073-5.149-.41-8.4-3.66-3.25-3.251-3.733-6.492-3.66-8.4.043-1.133.694-2.159 1.53-2.996 1.394-1.393 3.616-1.206 4.5.38z" ></path> </svg>
                                            2. Kontak
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <div className="active pt-5">
                                        <form action="#" className="w-full">
                                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="alamat" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Alamat
                                                        </label>
                                                        <textarea
                                                            name="alamat"
                                                            id="alamat"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: Jln. Terusan Pasir Koja"
                                                            required
                                                            value={mAlamatRelasi}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="provinsi" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Provinsi
                                                        </label>
                                                        <select
                                                            id="provinsi"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                        >
                                                            <option selected disabled>
                                                                --Pilih Provinsi--
                                                            </option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="FR">France</option>
                                                            <option value="DE">Germany</option>
                                                        </select>
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="kota" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Kota
                                                        </label>
                                                        <select
                                                            id="kota"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                        >
                                                            <option selected disabled>
                                                                --Pilih Kota--
                                                            </option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="FR">France</option>
                                                            <option value="DE">Germany</option>
                                                        </select>
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="kecamatan" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Kecamatan
                                                        </label>
                                                        <select
                                                            id="kecamatan"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                        >
                                                            <option selected disabled>
                                                                --Pilih Kecamatan--
                                                            </option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="FR">France</option>
                                                            <option value="DE">Germany</option>
                                                        </select>
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="kelurahan" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Kelurahan
                                                        </label>
                                                        <select
                                                            id="kelurahan"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                        >
                                                            <option selected disabled>
                                                                --Pilih Kelurahan--
                                                            </option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="FR">France</option>
                                                            <option value="DE">Germany</option>
                                                        </select>
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="kode_pos" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Kode Pos
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="kode_pos"
                                                            id="kode_pos"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: 401513"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label htmlFor="negara" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Negara
                                                        </label>
                                                        <select
                                                            id="negara"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                        >
                                                            <option selected disabled>
                                                                --Pilih Negara--
                                                            </option>
                                                            <option value="US">United States</option>
                                                            <option value="CA">Canada</option>
                                                            <option value="FR">France</option>
                                                            <option value="DE">Germany</option>
                                                        </select>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="no_npwp" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            No. NPWP
                                                        </label>
                                                        <input
                                                            type=""
                                                            name="no_npwp"
                                                            id="no_npwp"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: 1234567890123456"
                                                            required
                                                            value={''}
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="no_siup" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            No. SIUP
                                                        </label>
                                                        <input
                                                            type=""
                                                            name="no_siup"
                                                            id="no_siup"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: 1234567890123456"
                                                            required
                                                            value={''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                    <div className="sm:col-span-2">
                                                        <label htmlFor="personal" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                                            Personal
                                                        </label>
                                                        <input
                                                            name="personal"
                                                            id="personal"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: Jln. Terusan Pasir Koja"
                                                            required
                                                            value={''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <div className="active pt-5">
                                        <p>Kontak</p>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </div>
            <div className="panel mt-3" style={{ background: '#dedede' }}>
                <div className={styles['grid-containerNote1']}>
                    <div className={styles['grid-leftNote']}>
                        <div>
                            <label htmlFor="catatan">Catatan:</label>
                            <form>
                                <div className="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600">
                                    <div className="rounded-b-lg bg-white px-4 py-2 dark:bg-gray-800">
                                        <label className="sr-only">Publish post</label>
                                        <textarea
                                            id="editor"
                                            rows={3}
                                            className=" form-input block w-full border-0 bg-white px-0 text-sm text-gray-800 outline-0 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                            placeholder=""
                                            required
                                            style={{ height: 100 }}
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export { getServerSideProps };
export default createDaftarRelasi;
