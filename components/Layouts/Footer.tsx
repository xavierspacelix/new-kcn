import { useSession } from '@/pages/api/sessionContext';
import { viewPeriode } from '@/utils/routines';
import { useEffect, useState } from 'react';

const Footer: any = () => {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';

    if (isLoading) {
        return;
    }
    const [periode, setPeriode] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const periode = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);
                setPeriode(periode);
            } catch (error) {
                // console.error('Error:', error);
            }
        };
        fetchData();
    }, [kode_entitas]);

    return (
        <div className="mt-auto flex justify-between p-6 pt-0 dark:text-white-dark ltr:sm:text-left rtl:sm:text-right">
            <div>© {new Date().getFullYear()}. Next KCN System.</div>
            <div>Periode : {periode}</div>
        </div>
    );
};

export default Footer;
