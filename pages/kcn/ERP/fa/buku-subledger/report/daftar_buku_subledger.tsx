import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../../../store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { ViewerWrapperProps } from '../../../../../../components/ReportViewer';

// use the dynamic import to load the report viewer wrapper: https://nextjs.org/docs/advanced-features/dynamic-import
import dynamic from 'next/dynamic';
const Viewer = dynamic<ViewerWrapperProps>(
    async () => {
        return (await import('../../../../../../components/grapecity-viewer')).default;
    },
    { ssr: false }
);

const ReportPage = () => {
    const [entitas, setEntitas] = useState('');
    const [kodeAkun, setKodeAkun] = useState('');
    const [kodeSubledger, setKodeSubledger] = useState('');
    const [kodeDivisi, setKodeDivisi] = useState('');
    const [noKontrak, setNoKontrak] = useState('');
    const [tglAwal, setTglAwal] = useState('');
    const [tglAkhir, setTglAkhir] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        const entitas = params.get('entitas');
        const param1 = params.get('kode_akun');
        const param2 = params.get('kode_subledger');
        const param3 = params.get('kode_divisi');
        const param4 = params.get('no_kontrak');
        const param5 = params.get('tgl_awal');
        const param6 = params.get('tgl_akhir');
        const token = params.get('token');

        if (entitas !== null) {
            setEntitas(entitas);
        }
        if (param1 !== null) {
            setKodeAkun(param1);
        }
        if (param2 !== null) {
            setKodeSubledger(param2);
        }
        if (param3 !== null) {
            setKodeDivisi(param3);
        }
        if (param4 !== null) {
            setNoKontrak(param4);
        }
        if (param5 !== null) {
            setTglAwal(param5);
        }
        if (param6 !== null) {
            setTglAkhir(param6);
        }
        if (token !== null) {
            setToken(token);
        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Laporan Buku Subledger'));
    });

    // Setting lisensi untuk Grapecity ActiveReportsJS
    // if (typeof window !== 'undefined') {
    //     import('../../../../../../components/ARJS-License');
    // }

    const parameter = {
        ReportParams: [
            {
                Name: 'entitas',
                Value: [entitas],
            },
            {
                Name: 'param1',
                Value: [kodeAkun],
            },
            {
                Name: 'param2',
                Value: [kodeSubledger],
            },
            {
                Name: 'param3',
                Value: [kodeDivisi],
            },
            {
                Name: 'param4',
                Value: [noKontrak],
            },
            {
                Name: 'param5',
                Value: [tglAwal],
            },
            {
                Name: 'param6',
                Value: [tglAkhir],
            },
            {
                Name: 'token',
                Value: [token],
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Viewer reportUri="/report/transaksi//fa/buku-subledger/daftar_buku_subledger.rdlx-json" reportParam={parameter} />
        </div>
    );
};

ReportPage.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};

export default ReportPage;
