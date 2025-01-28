import { useSession } from '@/pages/api/sessionContext';

const Main = () => {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const nama_user = sessionData?.nama_user ?? '';
    const userid = sessionData?.userid ?? '';
    const nip = sessionData?.nip ?? '';

    if (isLoading) {
        return;
    }

    // if (!sessionData) {
    //     return <div>No session data available</div>;
    // }

    return (
        <div>
            <div>Nama user : {nama_user}</div>
            <div>NIP : {nip}</div>
            <div>Entitas : {kode_entitas}</div>
            <div>User ID : {userid}</div>
        </div>
    );
};

export default Main;
