import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../../../store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { ViewerWrapperProps } from '../../../../../../components/ReportViewer';

// use the dynamic import to load the report viewer wrapper: https://nextjs.org/docs/advanced-features/dynamic-import
import dynamic from 'next/dynamic';
const Viewer = dynamic<ViewerWrapperProps>(
    async () => {
        return (await import('../../../../../../components/grapecity-viewer-print')).default;
    },
    { ssr: false }
);

const ReportPage = () => {
    const [entitas, setEntitas] = useState('');
    const [tglAwal, setTglAwal] = useState('');
    const [tglAkhir, setTglAkhir] = useState('');
    const [plagTab, setPlagTab] = useState('');
    const [token, setToken] = useState('');
    const [param1, setParam1] = useState('all');
    const [param2, setParam2] = useState('all');
    const [param3, setParam3] = useState('all');
    const [param4, setParam4] = useState('all');
    const [param5, setParam5] = useState('all');
    const [param6, setParam6] = useState('all');
    const [param7, setParam7] = useState('all');
    const [param8, setParam8] = useState('all');
    const [param9, setParam9] = useState('all');
    const [param10, setParam10] = useState('all');
    const [param11, setParam11] = useState('all');
    const [param12, setParam12] = useState('all');
    const [param13, setParam13] = useState('all');
    const [param14, setParam14] = useState('all');
    const [param15, setParam15] = useState('all');
    const [param16, setParam16] = useState('all');
    const [param17, setParam17] = useState('all');
    const [param18, setParam18] = useState('all');
    const [param19, setParam19] = useState('all');
    const [param20, setParam20] = useState('0');
    const [param21, setParam21] = useState('0');
    const [param22, setParam22] = useState('0');
    const [param23, setParam23] = useState('0');
    const [param24, setParam24] = useState('0');
    const [param25, setParam25] = useState('all');
    const [param26, setParam26] = useState('all');

    useEffect(() => {
        const urlSearchString = window.location.search;
        const params = new URLSearchParams(urlSearchString);
        const entitas : any = params.get('entitas');
        const param1 : any = params.get('param1');
        const param2 : any = params.get('param2');
        const param3 : any = params.get('param3');
        const param4 : any = params.get('param4');
        const param5 : any = params.get('param5');
        const param6 : any = params.get('param6');
        const param7 : any = params.get('param7');
        const param8 : any = params.get('param8');
        const param9 : any = params.get('param9');
        const param10 : any = params.get('param10');
        const param11 : any = params.get('param11');
        const param12 : any = params.get('param12');
        const param13 : any = params.get('param13');
        const param14 : any = params.get('param14');
        const param15 : any = params.get('param15');
        const param16 : any = params.get('param16');
        const param17 : any = params.get('param17');
        const param18 : any = params.get('param18');
        const param19 : any = params.get('param19');
        const param20 : any = params.get('param20');
        const param21 : any = params.get('param21');
        const param22 : any = params.get('param22');
        const param23 : any = params.get('param23');
        const param24 : any = params.get('param24');
        const param25 : any = params.get('param25');
        const param26 : any = params.get('param26');
        const token : any = params.get('token');

        if (entitas !== null) {
            setEntitas(entitas);
        }
        if (param1 !== null) {
            setParam1(param1);
        }
        if (param2 !== null) {
            setParam2(param2);
        }
        if (param3 !== null) {
            setParam3(param3);
        }
        if (param4 !== null) {
            setParam4(param4);
        }
        if (param5 !== null) {
            setParam5(param5);
        }
        if (param6 !== null) {
            setParam6(param6);
        }
        if (param7 !== null) {
            setParam7(param7);
        }
        if (param8 !== null) {
            setParam8(param8);
        }
        if (param9 !== null) {
            setParam9(param9);
        }
        if (param10 !== null) {
            setParam10(param10);
        }
        if (param11 !== null) {
            setParam11(param11);
        }
        if (param12 !== null) {
            setParam12(param12);
        }
        if (param13 !== null) {
            setParam13(param13);
        }
        if (param14 !== null) {
            setParam14(param14);
        }
        if (param15 !== null) {
            setParam15(param15);
        }
        if (param16 !== null) {
            setParam16(param16);
        }
        if (param17 !== null) {
            setParam17(param17);
        }
        if (param18 !== null) {
            setParam18(param18);
        }
        if (param19 !== null) {
            setParam19(param19);
        }
        if (param20 !== null) {
            setParam20(param20);
        }
        if (param21 !== null) {
            setParam21(param21);
        }
        if (param22 !== null) {
            setParam22(param22);
        }
        if (param23 !== null) {
            setParam23(param23);
        }
        if (param24 !== null) {
            setParam24(param24);
        }
        if (param25 !== null) {
            setParam25(param25);
        }
        if (param26 !== null) {
            setParam26(param26);
        }
        if (token !== null) {
            setToken(token);
        }
    }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Form Penerimaan Piutang'));
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
                Value: [param1],
            },
            {
                Name: 'param2',
                Value: [param2],
            },
            {
                Name: 'param3',
                Value: [param3],
            },
            {
                Name: 'param4',
                Value: [param4],
            },
            {
                Name: 'param5',
                Value: [param5],
            },
            {
                Name: 'param6',
                Value: [param6],
            },
            {
                Name: 'param7',
                Value: [param7],
            },
            {
                Name: 'param8',
                Value: [param8],
            },
            {
                Name: 'param9',
                Value: [param9],
            },
            {
                Name: 'param10',
                Value: [param10],
            },
            {
                Name: 'param11',
                Value: [param11],
            },
            {
                Name: 'param12',
                Value: [param12],
            },
            {
                Name: 'param13',
                Value: [param13],
            },
            {
                Name: 'param14',
                Value: [param14],
            },
            {
                Name: 'param15',
                Value: [param15],
            },
            {
                Name: 'param16',
                Value: [param16],
            },
            {
                Name: 'param17',
                Value: [param17],
            },
            {
                Name: 'param18',
                Value: [param18],
            },
            {
                Name: 'param19',
                Value: [param19],
            },
            {
                Name: 'param20',
                Value: [param20],
            },
            {
                Name: 'param21',
                Value: [param21],
            },
            {
                Name: 'param22',
                Value: [param22],
            },
            {
                Name: 'param23',
                Value: [param23],
            },
            {
                Name: 'param24',
                Value: [param24],
            },
            {
                Name: 'param25',
                Value: [param25],
            },
            {
                Name: 'param26',
                Value: [param26],
            },
            {
                Name: 'token',
                Value: [token],
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <Viewer reportUri="/report/transaksi//fa/ppi/daftar_ppi.rdlx-json" reportParam={parameter} />
        </div>
    );
};

ReportPage.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};

export default ReportPage;
