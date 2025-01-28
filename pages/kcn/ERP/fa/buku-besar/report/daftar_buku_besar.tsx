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
    const [kodeDivisi, setKodeDivisi] = useState('');
    const [tglAwal, setTglAwal] = useState('');
    const [tglAkhir, setTglAkhir] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        const entitas = params.get('entitas');
        const param1 = params.get('kode_akun');
        const param2 = params.get('kode_divisi');
        const param3 = params.get('tgl_awal');
        const param4 = params.get('tgl_akhir');
        const token = params.get('token');

        if (entitas !== null) {
            setEntitas(entitas);
        }
        if (param1 !== null) {
            setKodeAkun(param1);
        }
        if (param2 !== null) {
            setKodeDivisi(param2);
        }
        if (param3 !== null) {
            setTglAwal(param3);
        }
        if (param4 !== null) {
            setTglAkhir(param4);
        }
        if (token !== null) {
            setToken(token);
        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Laporan Buku Besar'));
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
                Value: [kodeDivisi],
            },
            {
                Name: 'param3',
                Value: [tglAwal],
            },
            {
                Name: 'param4',
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
            <Viewer reportUri="/report/transaksi//fa/buku-besar/daftar_buku_besar.rdlx-json" reportParam={parameter} />
        </div>
    );
};

ReportPage.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};

export default ReportPage;
