import { useEffect, useState } from 'react';

export const encryptData = (data: any) => {
    try {
        let encryptedData = '';
        for (let i = 0; i < data.length; i++) {
            encryptedData += String.fromCharCode(data.charCodeAt(i) + 1);
        }
        return encryptedData;
    } catch (error) {
        console.error('Gagal mengenkripsi data:', error);
        return '';
    }
};

export const decryptData = (encryptedData: any) => {
    try {
        let decryptedData = '';
        for (let i = 0; i < encryptedData.length; i++) {
            decryptedData += String.fromCharCode(encryptedData.charCodeAt(i) - 1);
        }
        return decryptedData;
    } catch (error) {
        console.error('Gagal mendekripsi data:', error);
        return '';
    }
};

const dataSessionStorage = () => {
    const [namaUser, setNamaUser] = useState<string>('');
    const [nip, setNIP] = useState<string>('');
    const [kode_entitas, setKode_entitas] = useState<string>('');
    const [userid, setUserid] = useState<string>('');
    const [kode_user, setkode_user] = useState<string>('');
    const [kode_kry, setKode_kry] = useState<string>('');
    const [kode_jabatan, setkode_jabatan] = useState<string>('');
    const [nama_jabatan, setNama_jabatan] = useState<string>('');
    const [menuData, setmenuData] = useState<string>('');
    const [tipe, setTipe] = useState<string>('');
    const [tipeUser, setTipeUser] = useState<string>('');
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const storedNamaUser = sessionStorage.getItem('nama_user');
        if (storedNamaUser) {
            setNamaUser(decryptData(storedNamaUser));
        }
        const storedNIP = sessionStorage.getItem('nip');
        if (storedNIP) {
            setNIP(decryptData(storedNIP));
        }
        const storedkode_entitas = sessionStorage.getItem('kode_entitas');
        if (storedkode_entitas) {
            setKode_entitas(decryptData(storedkode_entitas));
        }
        const storeduserid = sessionStorage.getItem('userid');
        if (storeduserid) {
            setUserid(decryptData(storeduserid));
        }
        const storedkode_user = sessionStorage.getItem('kode_user');
        if (storedkode_user) {
            setkode_user(decryptData(storedkode_user));
        }
        const storedkode_kry = sessionStorage.getItem('kode_kry');
        if (storedkode_kry) {
            setKode_kry(decryptData(storedkode_kry));
        }
        const storedkode_jabatan = sessionStorage.getItem('kode_jabatan');
        if (storedkode_jabatan) {
            setkode_jabatan(decryptData(storedkode_jabatan));
        }
        const storednama_jabatan = sessionStorage.getItem('nama_jabatan');
        if (storednama_jabatan) {
            setNama_jabatan(decryptData(storednama_jabatan));
        }
        const storedmenu_data = sessionStorage.getItem('menuData');
        if (storedmenu_data) {
            setmenuData(decryptData(storedmenu_data));
        }
        const storedtipe = sessionStorage.getItem('tipe');
        if (storedtipe) {
            setTipe(decryptData(storedtipe));
        }
        const storedtipeUser = sessionStorage.getItem('tipeUser');
        if (storedtipeUser) {
            setTipeUser(storedtipeUser);
        }
        const storedtoken = sessionStorage.getItem('token');
        if (storedtoken) {
            setToken(storedtoken);
        }
    }, []);

    return {
        namaUser,
        nip,
        kode_entitas,
        userid,
        kode_user,
        kode_kry,
        kode_jabatan,
        nama_jabatan,
        menuData,
        tipe,
        tipeUser,
        token,
    };
};

export default dataSessionStorage;
