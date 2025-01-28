export const getUserData = async (req: any) => {
    const nama_user = req.session.nama_user || '';
    const nip = req.session.nip || '';
    const kode_entitas = req.session.kode_entitas || '';
    const userid = req.session.userid || '';

    const kode_user = req.session.kode_user || '';
    const kode_kry = req.session.kode_kry || '';
    const kode_jabatan = req.session.kode_jabatan || '';
    const nama_jabatan = req.session.nama_jabatan || '';
    const token = req.session.token || '';

    return {
        nama_user,
        nip,
        kode_entitas,
        userid,
        kode_user,
        kode_kry,
        kode_jabatan,
        nama_jabatan,
        token,
    };
};
