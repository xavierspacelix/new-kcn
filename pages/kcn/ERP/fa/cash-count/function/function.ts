export const HandleSearchNoAkun = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader(searchValue);

    const filteredData = searchDataNoAkun(searchValue, dataDaftarAkunKredit);
    
    setStateDataArray(filteredData);

    
};

const searchDataNoAkun = (keyword: any, dataDaftarAkunKredit: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarAkunKredit;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarAkunKredit.filter((item: any) => item.no_akun.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

export const HandleSearchNamaAkun = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader(searchValue);

    const filteredData = searchDataNamaAkun(searchValue, dataDaftarAkunKredit);
    
    setStateDataArray(filteredData);

    
};
const searchDataNamaAkun = (keyword: any, dataDaftarAkunKredit: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarAkunKredit;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarAkunKredit.filter((item: any) => item.nama_akun.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};