import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import { useRouter } from 'next/router';
// import

export const listDaftarRelasiApi = async (kode_entitas: string, pKode_relasi: string, pNama_relasi: string, pTipe: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    type DaftarRelasiListGrid = {
        kode_relasi: string;
        tipe: string;
        nama_relasi: string;
        alamat: string;
        alamat2: string;
        kota: string;
        propinsi: string;
        kodepos: string;
        negara: string;
        telp: string;
        telp2: string;
        hp: string;
        hp2: string;
        fax: string;
        email: string;
        website: string;
        npwp: string;
        siup: null;
        personal: string;
        ktp: string;
        sim: string;
        tgl_relasi: string;
        catatan: string;
        userid: string;
        tgl_update: string;
        kecamatan: string;
        kelurahan: string;
    };
    if (kode_entitas !== null && kode_entitas !== '') {
        try {
            let vKodeRelasi = 'all';
            let vNamaRelasi = 'all';
            let vTipe = 'all';
            let vLimit = '10000';

            if (pKode_relasi == null || pKode_relasi == '') {
                vKodeRelasi = 'all';
            } else {
                vKodeRelasi = `${pKode_relasi}`;
            }
            if (pNama_relasi == null || pNama_relasi == '') {
                vNamaRelasi = 'all';
            } else {
                vNamaRelasi = `${pNama_relasi}`;
            }
            if (pTipe == null || pTipe == '') {
                vTipe = 'all';
            } else {
                vTipe = `${pTipe}`;
            }

            const response = await axios.get(`${apiUrl}/erp/list_daftar_relasi?`, {
                params: {
                    entitas: kode_entitas,
                    param1: vKodeRelasi,
                    param2: vNamaRelasi,
                    param3: vTipe,
                    paramLimit: vLimit,
                },
            });

            const responseData = response.data.data;

            const transformedDataListDaftarRelasi: DaftarRelasiListGrid[] = responseData.map((item: any) => ({
                ...item,
            }));
            return transformedDataListDaftarRelasi;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    const router = useRouter();
    if (kode_entitas == null || kode_entitas == '') {
        alert('Silahkan Login Kembali, Session Habis');
        setTimeout(() => {
            router.push({ pathname: '/' });
        }, 1000);
        swal.close;
    }
};

import React from 'react'

const api = () => {
  return (
    <div>api</div>
  )
}

export default api
