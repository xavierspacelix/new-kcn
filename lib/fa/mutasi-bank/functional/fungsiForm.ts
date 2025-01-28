import moment from 'moment';
import { HandleChangeParamsObject } from '@utils/fa/mutasi-bank/template/HandleChangeParamsObject';
import { DaftarAkunKredit, GetListTabNoRek } from '../api/api';

import Swal from 'sweetalert2';

const swalPopUp = Swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    showClass: {
        popup: `
        animate__animated
        animate__zoomIn
        animate__faster
      `,
    },
    hideClass: {
        popup: `
        animate__animated
        animate__zoomOut
        animate__faster
      `,
    },
});

const swalDialog = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary btn-sm',
        cancelButton: 'btn btn-dark btn-sm ltr:mr-3 rtl:ml-3',
        popup: 'sweet-alerts',
    },
    buttonsStyling: false,
    showClass: {
        popup: `
          animate__animated
          animate__zoomIn
          animate__faster
        `,
    },
    hideClass: {
        popup: `
          animate__animated
          animate__zoomOut
          animate__faster
        `,
    },
});

const swalToast = Swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3500,
    showClass: {
        popup: `
          animate__animated
          animate__zoomIn
          animate__faster
        `,
    },
    hideClass: {
        popup: `
          animate__animated
          animate__zoomOut
          animate__faster
        `,
    },
});

// =============================================================================
// Fungsi untuk mengaktifkan modal daftar Akun di Filter
const ClickViewDaftarAkun = (params: HandleChangeParamsObject) => {
    params.vRefreshData.current += 1;
    params.setListStateData((prevState: any) => ({
        ...prevState,
        plagViewModalDaftarAkun: true,
    }));

    params.setFilterData((prevState: any) => ({
        ...prevState,
        noAkunValue: '',
        namaAkunValue: '',
    }));

    params.setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoNamaAkunChecked: false,
    }));
};
// =============================================================================

// =============================================================================
// handle fungsi untuk mencara data Aku berdasarkan nama dan no
const handleModalDaftarAkun = async (params: HandleChangeParamsObject) => {
    const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(params.kode_entitas, params.token);
    if (params.tipe === 'namaAkun') {
        params.setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isNoNamaAkunChecked: true,
        }));
        params.setFilterData((prevState: any) => ({
            ...prevState,
            namaAkunValue: params.valueObject,
            searchNamaAkun: params.valueObject,
            tipeFocusOpen: params.tipe,
        }));

        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarAkun: true,
        }));

        HandleSearchNamaAkun(params.valueObject, params.setFilterData, params.setStateDataArray, resultDaftarAkunKredit);
    } else if (params.tipe === 'noAkun') {
        params.setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isNoNamaAkunChecked: true,
        }));
        params.setFilterData((prevState: any) => ({
            ...prevState,
            noAkunValue: params.valueObject,
            searchNoAkun: params.valueObject,
            tipeFocusOpen: params.tipe,
        }));

        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarAkun: true,
        }));

        handleSearchNoAkun(params.valueObject, params.setFilterData, params.setStateDataArray, resultDaftarAkunKredit);
    }
};

const handleModalDaftarAkunList = async (params: HandleChangeParamsObject) => {
    const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(params.kode_entitas, params.token);
    if (params.tipe === 'namaAkun') {
        params.setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isNoNamaAkunChecked: true,
        }));
        params.setFilterData((prevState: any) => ({
            ...prevState,
            namaAkunValue: params.valueObject,
            searchNamaAkun: params.valueObject,
            tipeFocusOpen: params.tipe,
        }));

        const searchNamaAkun = document.getElementById(`searchNamaAkun`) as HTMLInputElement;
        if (searchNamaAkun) {
            searchNamaAkun.value = params.valueObject; // Mengatur nilai input file ke kosong
        }

        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarAkun: true,
        }));

        HandleSearchNamaAkun(params.valueObject, params.setFilterData, params.setStateDataArray, resultDaftarAkunKredit);
    } else if (params.tipe === 'noAkun') {
        params.setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isNoNamaAkunChecked: true,
        }));
        params.setFilterData((prevState: any) => ({
            ...prevState,
            noAkunValue: params.valueObject,
            searchNoAkun: params.valueObject,
            tipeFocusOpen: params.tipe,
        }));

        const searchNoAkun = document.getElementById(`searchNoAkun`) as HTMLInputElement;
        if (searchNoAkun) {
            searchNoAkun.value = params.valueObject; // Mengatur nilai input file ke kosong
        }

        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarAkun: true,
        }));

        handleSearchNoAkun(params.valueObject, params.setFilterData, params.setStateDataArray, resultDaftarAkunKredit);
    }
};

const handleSearchNoAkun = (event: any, setFilterData: Function, setStateDataArray: Function, resultDaftarAkunKredit: any) => {
    const searchValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        searchKeywordNoAkun: searchValue,
    }));

    const filteredData = searchDataNoAkun(searchValue, resultDaftarAkunKredit);
    setStateDataArray((prevState: any) => ({
        ...prevState,
        filteredDataAkunKredit: filteredData,
    }));

    const searchNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
    if (searchNamaAkun) {
        searchNamaAkun.value = '';
    }
};

const searchDataNoAkun = (keyword: any, dataDaftarAkunKredit: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarAkunKredit;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarAkunKredit.filter((item: any) => item.no_akun.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};

const HandleSearchNamaAkun = (event: any, setFilterData: Function, setStateDataArray: Function, resultDaftarAkunKredit: any) => {
    const searchValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        searchKeywordNamaAkun: searchValue,
    }));
    const filteredData = searchDataNamaAkun(searchValue, resultDaftarAkunKredit);
    setStateDataArray((prevState: any) => ({
        ...prevState,
        filteredDataAkunKredit: filteredData,
    }));

    const searchNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
    if (searchNoAkun) {
        searchNoAkun.value = '';
    }
};

const searchDataNamaAkun = (keyword: any, dataDaftarAkunKredit: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarAkunKredit;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarAkunKredit.filter((item: any) => item.nama_akun.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// =============================================================================

// =============================================================================
// menetapkand data yang di pililh berdasarkan row
const SelectedRowsData = (args: any, params: HandleChangeParamsObject) => {
    if (args.data !== undefined) {
        params.prevDataSelectedRef.current.selectType = args.data.type;
        params.prevDataSelectedRef.current.selectReconcil = args.data.reconcil;
        params.prevDataSelectedRef.current.tglTransaksiMutasi = args.data.valuta;
        params.prevDataSelectedRef.current.jumlahMu = args.data.amount;
        params.prevDataSelectedRef.current.tipeApi = 'API';
        params.prevDataSelectedRef.current.noRekeningApi = args.data.account_number;
        params.prevDataSelectedRef.current.description = args.data.description;
        params.prevDataSelectedRef.current.apiId = args.data.id;
        params.prevDataSelectedRef.current.apiPending = args.data.pending;
        params.prevDataSelectedRef.current.kode_dokumen = args.data.kode_dokumen;
        params.prevDataSelectedRef.current.dokumen = args.data.dokumen;
        params.prevDataSelectedRef.current.no_dokumen = args.data.no_dokumen;

        // setSelectType(args.data.type);
        // setSelectReconcil(args.data.reconcil);
        // // Pastikan hanya memperbarui state jika data berubah
        // setListStateData((prevState: any) => {
        //     if (prevState.tglTransaksiMutasi !== args.data.valuta || prevState.jumlahMu !== args.data.amount || prevState.noRekeningApi !== args.data.account_number) {
        //         return {
        //             ...prevState,
        //             tglTransaksiMutasi: args.data.valuta,
        //             jumlahMu: args.data.amount,
        //             tipeApi: 'API',
        //             noRekeningApi: args.data.account_number,
        //             description: args.data.description,
        //             apiId: args.data.id,
        //             apiPending: args.data.pending,
        //         };
        //     }
        //     return prevState; // Tidak ada perubahan, tidak memperbarui state
        // });
    }
};
// =============================================================================

// =============================================================================
// handle untuk mengaktifkan tab tab yang ada di list
const HandleClickTabs = (params: HandleChangeParamsObject) => {
    try {
        params.setActiveTab(params.valueObject);
        params.setTabIndex(params.tipe);

        const filteredData = params.tipe === 'Semua' ? params.recordsDataRef.current : params.recordsDataRef.current.filter((item: any) => item.account_number === params.tipe);
        params.setRecordsData(filteredData);
    } catch (error) {
        console.error(error);
    }
};
// =============================================================================

// =============================================================================
// Fungsi untuk menampilkan modal pilihan data BM, PPI, PHU, BK
const ShowNewRecord = (params: HandleChangeParamsObject) => {
    params.vRefreshData.current += 1;
    if (params.selectedModalJenisTransaksi.current === 'phuWarkat') {
        params.setParamObjectDaftarPenerimaanPhu((prevState: any) => ({
            ...prevState,
            tglTransaksiMutasi: moment(params.prevDataSelectedRef.current.tglTransaksiMutasi).format('YYYY-MM-DD'),
            jumlahMu: params.prevDataSelectedRef.current.jumlahMu,
            tipeApi: params.prevDataSelectedRef.current.tipeApi,
            noRekeningApi: params.prevDataSelectedRef.current.noRekeningApi,
            description: params.prevDataSelectedRef.current.description,
            apiId: params.prevDataSelectedRef.current.apiId,
            apiPending: params.prevDataSelectedRef.current.apiPending,
            dokumen: 'BB',
            token: params.token,
            kode_entitas: params.kode_entitas,
        }));
    } else {
        params.setParamObjectDaftarPenerimaan((prevState: any) => ({
            ...prevState,
            tglTransaksiMutasi: moment(params.prevDataSelectedRef.current.tglTransaksiMutasi).format('YYYY-MM-DD'),
            jumlahMu: params.prevDataSelectedRef.current.jumlahMu,
            tipeApi: params.prevDataSelectedRef.current.tipeApi,
            noRekeningApi: params.prevDataSelectedRef.current.noRekeningApi,
            description: params.prevDataSelectedRef.current.description,
            apiId: params.prevDataSelectedRef.current.apiId,
            apiPending: params.prevDataSelectedRef.current.apiPending,
            dokumen: 'PU',
            token: params.token,
            kode_entitas: params.kode_entitas,
        }));
    }
    if (params.selectedModalJenisTransaksi.current === 'bmPemasukanLain') {
        params.setStatusPage('CREATE');
        params.setModalHandleDataBM(true);
        params.setBaru(false);
        params.setListStateData((prevState: any) => ({
            ...prevState,
            tipeDialog: params.selectedModalJenisTransaksi.current,
        }));
    } else if (params.selectedModalJenisTransaksi.current === 'ppiTransfer') {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            masterDataState: 'BARU',
            masterKodeDokumen: 'BARU',
            dialogInputDataVisible: true,
            dialogFilterJenisPenerimaan: false,
            tipeDialog: params.selectedModalJenisTransaksi.current,
        }));
    } else if (params.selectedModalJenisTransaksi.current === 'ppiWarkat') {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarPenerimaan: true,
        }));
    } else if (params.selectedModalJenisTransaksi.current === 'bmPos') {
        params.setStatusPagePOS('CREATE');
        params.setModalHandleDataBMPOS(true);
        params.setBaru(false);
        params.setListStateData((prevState: any) => ({
            ...prevState,
            tipeDialog: params.selectedModalJenisTransaksi.current,
        }));
    } else if (params.selectedModalJenisTransaksi.current === 'phuTransfer') {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            masterDataState: 'BARU',
            masterKodeDokumen: 'BARU',
            dialogInputDataVisible: true,
            dialogFilterJenisPembayaran: false,
            tipeDialog: params.selectedModalJenisTransaksi.current,
        }));
    } else if (params.selectedModalJenisTransaksi.current === 'phuWarkat') {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            plagViewModalDaftarPenerimaanPhu: true,
        }));
    } else if (params.selectedModalJenisTransaksi.current === 'bkPengeluaran') {
        params.setMasterDataState('BARU');
        params.setMasterKodeDokumen('BARU');
        params.setJenisUpdateBKK(0);
        params.setCON_BKK('BKK');
        params.setIsFilePendukungBk('N');
        params.setListStateData((prevState: any) => ({
            ...prevState,
            tipeDialog: params.selectedModalJenisTransaksi.current,
            dialogInputDataVisible: true,
        }));
    }

    params.setListStateData((prevState: any) => ({
        ...prevState,
        plagViewModalPostingRekonsil: false,
        plagViewModalPostingRekonsilDB: false,
    }));
};
// =============================================================================

// =============================================================================
// Fungsi untuk menampilkan inputan pencairan warkat berdasarkan data penerimaan
const ShowNewRecordWarkat = (params: HandleChangeParamsObject) => {
    params.vRefreshData.current += 1;
    if (params.tipe === 'pencairanWarkatPpi') {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            masterDataState: 'Pencairan',
            masterKodeDokumen: params.additionalData[0].kode_dokumen,
            selectedModalJenisPenerimaan: 'Pencairan',
            tipeDialog: 'Pencairan',
            selectedKodeSupp: '',
            dialogInputDataVisible: true,
        }));

        params.prevDataSelectedRef.current.tipeApi = 'APIWarkat';
    } else {
        params.setListStateData((prevState: any) => ({
            ...prevState,
            masterDataState: 'EDIT',
            masterKodeDokumen: params.additionalData[0].kode_dokumen,
            selectedModalJenisPenerimaan: 'Pencairan',
            tipeDialog: 'PencairanPhu',
            selectedKodeSupp: '',
            dialogInputDataVisible: true,
            plagViewModalDaftarPenerimaanPhu: false,
        }));

        params.prevDataSelectedRef.current.tipeApi = 'APIWarkat';
    }
};
// =============================================================================

// =============================================================================
// fungsi untuk menampilkan data no rekening di list
const ListTabNoRek = async (params: HandleChangeParamsObject) => {
    let index = 0; // Mulai dari 0 setiap kali fungsi dipanggil
    const responseData = await GetListTabNoRek(params.kode_entitas, params.token);
    const responseDataFix = responseData.map((item: any) => ({
        // ...item,
        tabIndex: (index += 1),
        label: item.no_rekening,
    }));

    params.setTabs(responseDataFix);
};
// =============================================================================



export { handleModalDaftarAkunList, ListTabNoRek, ShowNewRecordWarkat, ShowNewRecord, HandleClickTabs, SelectedRowsData, ClickViewDaftarAkun, handleModalDaftarAkun, swalDialog, swalToast, swalPopUp };
