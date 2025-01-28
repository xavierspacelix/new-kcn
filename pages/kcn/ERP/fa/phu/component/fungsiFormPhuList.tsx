import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import moment from 'moment';
import styles from '../phulist.module.css';
import { CekSubledger, DaftarAkunKredit, DaftarSupplier, DaftarSupplierAll, DaftarUangMuka, DataDetailDokDataFaktur, DataDetailDokDataJurnal, ListCustFilter, ListSubledger } from '../model/apiPhu';
import { GetInfo, fetchPreferensi, tanpaKoma } from '@/utils/routines';

import React from 'react';

export default function fungsiFormPhuList() {
    return <div>fungsiFormPhuList</div>;
}

const swalToast = swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
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

const swalDialog = swal.mixin({
    customClass: {
        confirmButton: 'btn btn-dark btn-sm',
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

//==================================================================================================
// Handle Filter Data List
const HandleNoBuktiPembayaranInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        noBuktiPembayaranValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoBuktiPembayaranChecked: newValue.length > 0,
    }));
};
const HandleTglPhu = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
    if (tipe === 'tanggalAwal') {
        setFilterData((prevState: any) => ({
            ...prevState,
            date1: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalChecked: true,
        }));
    } else {
        setFilterData((prevState: any) => ({
            ...prevState,
            date2: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalChecked: true,
        }));
    }
};
const HandleNoSupplierInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        noSupplierValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoSupplierChecked: newValue.length > 0,
    }));
};
const HandleNamaSupplierInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        namaSupplierValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNamaSupplierChecked: newValue.length > 0,
    }));
};
const HandleNoReffInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;

    setFilterData((prevState: any) => ({
        ...prevState,
        noReffValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoReffChecked: newValue.length > 0,
    }));
};
const HandleJenisPembayaranChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        selectedOptionJenisPembayaran: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isJenisPembayaraChecked: newValue.length > 0,
    }));
};
const ValueJenisPembayaran = [
    { value: 'Tunai', label: 'Tunai' },
    { value: 'Transfer', label: 'Transfer' },
    { value: 'Warkat', label: 'Warkat' },
    { value: 'Cair', label: 'Cair' },
    { value: 'Tolak', label: 'Tolak' },
];
const HandleNoWarkatChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        noWarkatValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoWarkatChecked: newValue.length > 0,
    }));
};
const HandleTglPhuJt = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
    if (tipe === 'tanggalAwal') {
        setFilterData((prevState: any) => ({
            ...prevState,
            date3: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalJTChecked: true,
        }));
    } else {
        setFilterData((prevState: any) => ({
            ...prevState,
            date4: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalJTChecked: true,
        }));
    }
};
const HandleTglPhuPencairan = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
    if (tipe === 'tanggalAwal') {
        setFilterData((prevState: any) => ({
            ...prevState,
            date4: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalPencairanChecked: true,
        }));
    } else {
        setFilterData((prevState: any) => ({
            ...prevState,
            date5: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalPencairanChecked: true,
        }));
    }
};
const HandleAkunKreditChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        akunKreditValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isAkunKreditChecked: newValue.length > 0,
    }));
};
// END
//==================================================================================================

//==================================================================================================
// Format Rupiah
const formatCurrency: Object = { skeleton: 'C3', format: ',0.00;-,0.00;#', maximumFractionDigits: 2 };
const CurrencyFormat = (num: any) => {
    const numericValue = parseFloat(num); // Convert the value to number
    if (isNaN(numericValue)) {
        // If not a valid number, return an empty string or the original value
        return '';
    } else {
        let intl: Internationalization = new Internationalization();
        let nFormatter: Function = intl.getNumberFormat(formatCurrency);
        let formattedValue: string = nFormatter(numericValue);
        return formattedValue;
    }
};

//END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk mencari Data List berdasarkan no bukti
const PencarianNoBukti = async (event: string, setFilterData: Function, setFilteredData: Function, recordsData: any[]) => {
    const searchValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        searchNoBukti: searchValue,
    }));

    const filteredData = SearchDataNoBukti(searchValue, recordsData);
    setFilteredData(filteredData);

    const cariJumlah = document.getElementById('cariJumlah') as HTMLInputElement;
    if (cariJumlah) {
        cariJumlah.value = '';
    }
};

const SearchDataNoBukti = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.no_dokumen.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk mencari Data List berdasarkan jumlah mu
const PencarianJumlah = async (event: string, setFilterData: Function, setFilteredData: Function, recordsData: any[]) => {
    const searchValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        searchJumlah: searchValue,
    }));

    const filteredData = SearchDataJumlah(searchValue, recordsData);
    setFilteredData(filteredData);

    const cariNoBukti = document.getElementById('cariNoBukti') as HTMLInputElement;
    if (cariNoBukti) {
        cariNoBukti.value = '';
    }
};

const SearchDataJumlah = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.jumlah_mu.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk select data list berdasarkan kode phu untuk menampilkan detail data PHU
// ini saat rows di eksekusi dengan klik
const HandleRowSelected = (args: any, setListStateData: Function) => {
    setListStateData((prevState: any) => ({
        ...prevState,
        selectedRowKodePhu: args.data.kode_dokumen,
    }));
};

// ini saat rows di eksekusi dengan arah panah keyboard
const RowSelectingListData = (args: any, setListStateData: Function, kode_entitas: string, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function) => {
    ListDetailDok('IDR', args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal);
    setListStateData((prevState: any) => ({
        ...prevState,
        noDokumen: args.data.no_dokumen,
        tglDokumen: args.data.tgl_dokumen,
    }));
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk pilihan button LIST
const SetDataDokumenPhu = async (tipe: string, selectedRowKodePhu: string, kode_entitas: string, setListStateData: Function, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function) => {
    if (selectedRowKodePhu !== '') {
        if (tipe === 'ubah') {
        } else if (tipe === 'detailDok') {
            setListStateData((prevState: any) => ({
                ...prevState,
                selectedItem: selectedRowKodePhu,
            }));
            ListDetailDok('IDR', selectedRowKodePhu, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal);
        } else if (tipe === 'cetak_form_kecil') {
            OnClick_CetakFormKecil(selectedRowKodePhu, kode_entitas);
        } else if (tipe === 'cetak_form_besar') {
            OnClick_CetakFormKecil(selectedRowKodePhu, kode_entitas);
        }
    } else {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px; color:white;">Silahkan pilih data PHU terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan data detail Dok berdasarkan kode TTB
const ListDetailDok = async (mu: any, kode_phu: any, kode_entitas: any, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function) => {
    try {
        const resultDetailDataFaktur: any[] = await DataDetailDokDataFaktur(mu, kode_phu, kode_entitas);
        await setDetailDokDataFaktur(resultDetailDataFaktur);
        const resultDetailDataJurnal: any[] = await DataDetailDokDataJurnal(kode_phu, kode_entitas);
        await setDetailDokDataJurnal(resultDetailDataJurnal);
    } catch (error) {
        console.error('Error:', error);
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Akun kredit
const HandleModalicon = async (
    tipeDialog: string,
    tipe: string,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kode_entitas: string,
    kode_supp: string,
    setDataDaftarUangMuka: Function,
    args: any,
    setStateDataDetail: Function,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any
) => {
    if (tipe === 'akunKredit') {
        const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(kode_entitas, tipeDialog);
        let tipeAdd1: any;

        if (args.no_akun === undefined) {
            tipeAdd1 = tipeAdd;
        } else {
            tipeAdd1 = '';
        }

        await setDataDaftarAkunKredit(resultDaftarAkunKredit);
        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            rowsIdJurnal: tipeAdd1 === 'add' ? idDokumen : args.id,
        }));
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: true,
            tipeAkunDialogVisible: tipeDialog,
        }));
    } else if (tipe === 'supplier') {
        const resultDaftarSupplier: any[] = await DaftarSupplier(kode_entitas);

        if (kode_supp !== '') {
            // Tambahkan CSS untuk tombol
            const style = document.createElement('style');
            style.innerHTML = `
            .swal2-popup .btn {
            margin-left: 10px;
            }
    `;
            document.head.appendChild(style);

            withReactContent(swalDialog)
                .fire({
                    html: `<p style="font-size:12px">Perubahan supplier menyebabkan perubahan pada faktur. Ubah Supplier?</p>`,
                    width: '350px',
                    heightAuto: true,
                    target: '#dialogPhuList',
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: '&ensp; Yes &ensp;',
                    cancelButtonText: '&ensp; No &ensp;',
                    reverseButtons: false,
                })
                .then(async (result) => {
                    if (result.value) {
                        const dataSelainFilter = resultDaftarSupplier.filter((supplier) => supplier.kode_supp !== kode_supp);
                        await setDataDaftarSupplier(dataSelainFilter);
                        await setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarSupplierVisible: true,
                            tipeSupplierDialogVisible: tipeDialog,
                            plagGantiSupplier: 'Plag',
                        }));
                    }
                });
            return;
        }
        await setDataDaftarSupplier(resultDaftarSupplier);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSupplierVisible: true,
            tipeSupplierDialogVisible: tipeDialog,
        }));
    } else if (tipe === 'uangMuka') {
        const resultDaftarUangMuka: any[] = await DaftarUangMuka(kode_entitas, kode_supp);
        await setDataDaftarUangMuka(resultDaftarUangMuka);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarUangMukaVisible: true,
        }));
    } else if (tipe === 'subledger') {
        const resultCekSubledger: any[] = await CekSubledger(kode_entitas, args.kode_akun);

        if (resultCekSubledger[0].tipe === '') {
            withReactContent(swalDialog)
                .fire({
                    html: `<p style="font-size:12px">No. Akun belum diisi</p>`,
                    width: '350px',
                    heightAuto: true,
                    target: '#dialogPhuList',
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: '&ensp; Yes &ensp;',
                    cancelButtonText: '&ensp; No &ensp;',
                    reverseButtons: true,
                })
                .then(async (result) => {
                    if (result.value) {
                        // await setStateDataHeader((prevState: any) => ({
                        //     ...prevState,
                        //     dialogDaftarSupplierVisible: true,
                        // }));
                    }
                });
            return;
        } else if (resultCekSubledger[0].tipe === 'hutang') {
            const resultDaftarSupplier: any[] = await DaftarSupplierAll(kode_entitas);
            await setDataDaftarSupplier(resultDaftarSupplier);
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarSupplierVisible: true,
                tipeSupplierDialogVisible: tipeDialog,
            }));
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                rowsIdJurnal: args.id,
            }));
        } else if (resultCekSubledger[0].tipe === 'piutang') {
            const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, 'all', 'all', 'all');
            await setDataDaftarCustomer(resultDaftarCustomer);
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                dialogDaftarCustomerVisible: true,
            }));
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                rowsIdJurnal: args.id,
            }));
        } else if (resultCekSubledger[0].subledger === 'Y') {
            const resultListSubledger: any[] = await ListSubledger(kode_entitas, args.kode_akun);
            await setDataDaftarSubledger(resultListSubledger);
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                dialogDaftarSubledgerVisible: true,
                rowsIdJurnal: args.id,
            }));
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: `<p style="font-size:12px; color:white;">No. Akun ${args.no_akun} tidak mempunyai subsidiary ledger</p>`,
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
                target: '#dialogPhuList',
            });
        }
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search No Akun Daftar Akun Kredit
const HandleSearchNoAkun = (event: any, setStateDataHeader: Function, setFilteredDataAkunKredit: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoAkun: searchValue,
    }));

    const filteredData = searchDataNoAkun(searchValue, dataDaftarAkunKredit);
    setFilteredDataAkunKredit(filteredData);

    const searchNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
    if (searchNamaAkun) {
        searchNamaAkun.value = '';
    }
};

const searchDataNoAkun = (keyword: any, dataDaftarAkunKredit: any) => {
    // Jika keyword kosong, kembalikan semua data
    console.log('masuk sini');
    
    if (keyword === '') {
        return dataDaftarAkunKredit;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarAkunKredit.filter((item: any) => item.no_akun.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search Nama Akun Daftar Akun Kredit
const HandleSearchNamaAkun = (event: any, setStateDataHeader: Function, setFilteredDataAkunKredit: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaAkun: searchValue,
    }));
    const filteredData = searchDataNamaAkun(searchValue, dataDaftarAkunKredit);
    setFilteredDataAkunKredit(filteredData);

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
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search No Akun Daftar Subledger
const HandleSearchNoSubledger = (event: any, setStateDataDetail: Function, setFilteredDataSubledger: Function, dataDaftarSubledger: any) => {
    const searchValue = event;
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNoSubledger: searchValue,
    }));

    const filteredData = searchDataNoSubledger(searchValue, dataDaftarSubledger);
    setFilteredDataSubledger(filteredData);

    const searchNamaSubledger = document.getElementById('searchNamaSubledger') as HTMLInputElement;
    if (searchNamaSubledger) {
        searchNamaSubledger.value = '';
    }
};

const searchDataNoSubledger = (keyword: any, dataDaftarSubledger: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarSubledger;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarSubledger.filter((item: any) => item.no_subledger.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search Nama Akun Daftar Subledger
const HandleSearchNamaSubledger = (event: any, setStateDataDetail: Function, setFilteredDataSubledger: Function, dataDaftarSubledger: any) => {
    const searchValue = event;
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSubledger: searchValue,
    }));
    const filteredData = searchDataNamaSubledger(searchValue, dataDaftarSubledger);
    setFilteredDataSubledger(filteredData);

    const searchNoSubledger = document.getElementById('searchNoSubledger') as HTMLInputElement;
    if (searchNoSubledger) {
        searchNoSubledger.value = '';
    }
};

const searchDataNamaSubledger = (keyword: any, dataDaftarSubledger: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarSubledger;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarSubledger.filter((item: any) => item.nama_subledger.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Template untuk kolom "no akun" Modal Akun Kredit
const TemplateNoAkun = (args: any) => {
    return (
        <div style={args.no_akun === args.noakun ? { fontWeight: 'bold' } : { fontWeight: 'none', marginLeft: 12 }}>
            {/* Isi template sesuai kebutuhan */}
            {args.no_akun}
        </div>
    );
};
// END
//==================================================================================================

//==================================================================================================
// Template untuk kolom "no akun" Modal Akun Kredit
const TemplateNamaAkun = (args: any) => {
    return (
        <div style={args.no_akun === args.noakun ? { fontWeight: 'bold' } : { fontWeight: 'none', marginLeft: 12 }}>
            {/* Isi template sesuai kebutuhan */}
            {args.nama_akun}
        </div>
    );
};

// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Akun kredit lewat change input
const HandleModalInput = async (
    value: string,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    kode_entitas: string,
    setFilteredDataAkunKredit: Function,
    dataDaftarAkunKredit: any,
    tipe: string
) => {
    const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(kode_entitas, 'header');
    await setDataDaftarAkunKredit(resultDaftarAkunKredit);

    if (tipe === 'noAkun') {
        await HandleSearchNoAkun(value, setStateDataHeader, setFilteredDataAkunKredit, resultDaftarAkunKredit);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: true,
            searchNoAkun: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'noAkun',
        }));
    } else {
        await HandleSearchNamaAkun(value, setStateDataHeader, setFilteredDataAkunKredit, resultDaftarAkunKredit);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunKreditVisible: true,
            searchNamaAkun: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'namaAkun',
        }));
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search No Supplier
const HandleSearchNoSupplier = (event: any, setStateDataHeader: Function, setFilteredDataSupplier: Function, dataDaftarSupplier: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoSupplier: searchValue,
    }));

    const filteredData = searchDataNoSupplier(searchValue, dataDaftarSupplier);
    setFilteredDataSupplier(filteredData);

    const searchNamaSupplier = document.getElementById('searchNamaSupplier') as HTMLInputElement;
    if (searchNamaSupplier) {
        searchNamaSupplier.value = '';
    }
};

const searchDataNoSupplier = (keyword: any, dataDaftarSupplier: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarSupplier;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarSupplier.filter((item: any) => item.no_supp.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search Nama Supplier
const HandleSearchNamaSupplier = (event: any, setStateDataHeader: Function, setFilteredDataSupplier: Function, dataDaftarSupplier: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSupplier: searchValue,
    }));
    const filteredData = searchDataNamaSupplier(searchValue, dataDaftarSupplier);
    setFilteredDataSupplier(filteredData);

    const searchNoSupplier = document.getElementById('searchNoSupplier') as HTMLInputElement;
    if (searchNoSupplier) {
        searchNoSupplier.value = '';
    }
};

const searchDataNamaSupplier = (keyword: any, dataDaftarSupplier: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarSupplier;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarSupplier.filter((item: any) => item.nama_relasi.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Supplier lewat change input
const HandleModalInputSupplier = async (
    value: string,
    setStateDataHeader: Function,
    setDataDaftarSupplier: Function,
    kode_entitas: string,
    setFilteredDataSupplier: Function,
    dataDaftarAkunKredit: any,
    tipe: string
) => {
    const resultDaftarSupplier: any[] = await DaftarSupplier(kode_entitas);
    await setDataDaftarSupplier(resultDaftarSupplier);
    if (tipe === 'noSupplier') {
        await HandleSearchNoSupplier(value, setStateDataHeader, setFilteredDataSupplier, resultDaftarSupplier);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSupplierVisible: true,
            searchNoSupplier: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'noSupplier',
        }));
    } else {
        await HandleSearchNamaSupplier(value, setStateDataHeader, setFilteredDataSupplier, resultDaftarSupplier);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSupplierVisible: true,
            searchNamaSupplier: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'namaSupplier',
        }));
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk hapus detail no faktur di dalam rows
const DetailNoFakturDelete = async (
    gridPhuList: any,
    swalDialog: any,
    setDataBarang: Function,
    setStateDataFooter: Function,
    setStateDataHeader: Function,
    stateDataHeader: any,
    stateDataFooter: any,
    trigerKalkulasi: any
) => {
    let currentDetailNoFaktur: any;
    currentDetailNoFaktur = gridPhuList?.getSelectedRecords() || [];
    
    

    if (currentDetailNoFaktur.length > 0) {
        console.log('currentDetailNoFaktur',currentDetailNoFaktur);

    const temp = gridPhuList.dataSource.filter((item: any) => item.no_fb === currentDetailNoFaktur[0].no_fb)[0]
    const indexnya = gridPhuList.dataSource.findIndex((item: any) => item.no_fb === currentDetailNoFaktur[0].no_fb)
    const newTemp = {
        ...temp,
        jumlah_pembayaran: 0,
        sisa: temp.sisa_hutang
    }

    gridPhuList!.dataSource[indexnya] = newTemp
    gridPhuList!.refresh()
    trigerKalkulasi();
    } else {
        document.getElementById('gridPhuList')?.focus();
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px">Silahkan pilih data no faktur terlebih dahulu</p>',
            width: '100%',
            target: '#dialogPhuList',
        });
    }
};
//END
//==================================================================================================

//==================================================================================================
// Fungsi untuk hapus all detail no faktur di dalam rows
const DetailNoFakturDeleteAll = async (
    gridPhuList: any,
    swalDialog: any,
    setDataBarang: Function,
    setStateDataFooter: Function,
    setStateDataHeader: Function,
    stateDataHeader: any,
    stateDataFooter: any,
    trigerKalkulasi: any
) => {
    let currentDetailNoFaktur: any;
    currentDetailNoFaktur = gridPhuList?.getSelectedRecords() || [];
    const temp = gridPhuList!.dataSource.map((item: any) => ({
        ...item,
        jumlah_pembayaran: 0,
        sisa: item.sisa_hutang
    }));
    gridPhuList!.dataSource = temp
    gridPhuList!.refresh();
    trigerKalkulasi();
};
// End
//==================================================================================================

//==================================================================================================
// Fungsi untuk Detail Rows Jurnal
const DetailNoFakturJurnal = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kodeSupplierValue: any,
    setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    modalJenisPembayaran: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: string,
    editDataJurnal: any,
    dataDetailNoFakturPhu: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.jumlah_pembayaran === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.jumlah_pembayaran);
        }, 0); // ini sama Hutang

        // Tunai, Transfer, Warkat
        if ((modalJenisPembayaran === 'Tunai' || modalJenisPembayaran !== 'Warkat') && namaAkunValue === '') {
            withReactContent(swalDialog)
                .fire({
                    title: '<p style="font-size:12px">Akun Kredit belum diisi.</p>',
                    width: '11%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'OK',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        await HandleModalicon(
                            'header',
                            'akunKredit',
                            setStateDataHeader,
                            setDataDaftarAkunKredit,
                            setDataDaftarSupplier,
                            kode_entitas,
                            kodeSupplierValue,
                            setDataDaftarUangMuka,
                            '',
                            setStateDataDetail,
                            setDataDaftarCustomer,
                            setDataDaftarSubledger,
                            idDokumen,
                            tipeAdd
                        );
                        await setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunKreditVisible: true,
                        }));
                    }
                });
            return false;
        }

        if (hasEmptyNoFb <= 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return false;
        }

        console.log('Jumlah Bayar: ', jumlahBayar);

        if (jumlahBayar === '') {
            // Jumlah Bayar sama dengan kredit Rp
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
            if (jumlahBayar) {
                jumlahBayar.focus();
            }
            return false;
        }

        if (modalJenisPembayaran === 'Transfer' && (stateDataHeader?.noBuktiTransfer === '' || stateDataHeader?.noBuktiTransfer === null || stateDataHeader?.noBuktiTransfer === undefined)) {
            // nanti ditambahkan no_warkat
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">No. Bukti Transfer belum diisi.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return false;
        }

        if (totalJumlahPembayaran === 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Belum ada pembayaran faktur di alokasi dana.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return false;
        }

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;

        console.log('State Data Header: ', stateDataHeader);
        console.log('dataDetailFaktur: ', dataDetailNoFakturPhu.dataSource);

        const filteredDataSource = dataDetailNoFakturPhu.dataSource.filter((item: any) => item.jumlah_pembayaran > 0);

        let catatan1;
        let catatan2;
        if (modalJenisPembayaran === 'Transfer') {
            if (kode_entitas == '898') {
                // Proses INV
                const no_inv_list = filteredDataSource.map((item: any) => (item.no_inv ? item.no_inv.trim() : '')).filter((inv: any) => inv !== '');

                // Proses V (no_vch)
                const no_vch_list = filteredDataSource.map((item: any) => (item.no_vch ? item.no_vch.slice(-3) : '')).filter((vch: any) => vch !== '');

                // Proses FB (no_fb)
                const no_fb_list = filteredDataSource.map((item: any) => (item.no_fb ? item.no_fb.slice(-3) : '')).filter((fb: any) => fb !== '');

                // Bagian INV
                let invPart = '';
                if (no_inv_list.length > 0) {
                    invPart = `, INV ${no_inv_list.join(', ')}`;
                } else {
                    invPart = ', INV';
                }

                // Bagian V (no_vch)
                let vPart = '';
                if (no_vch_list.length > 0) {
                    vPart = `, ${no_vch_list.map((v: any) => `V ${v}`).join(', ')}`;
                } else {
                    vPart = ', V';
                }

                // Bagian FB (no_fb)
                let fbPart = '';
                if (no_fb_list.length > 0) {
                    fbPart = `, ${no_fb_list.map((fb: any) => `FB ${fb}`).join(', ')}`;
                } else {
                    fbPart = ', FB';
                }

                catatan1 = `${stateDataHeader?.noBuktiTransfer} atas: ${stateDataHeader?.namaSupplierValue}${invPart}${vPart}${fbPart}`;
                catatan2 = catatan1;
            } else {
                catatan1 = `${stateDataHeader?.namaHutang} atas : ${stateDataHeader?.namaSupplierValue}`;
                catatan2 = `Pembayaran ${modalJenisPembayaran} atas : ${stateDataHeader?.namaSupplierValue} dengan ${stateDataHeader?.namaAkunValue}`;
            }
        } else if (modalJenisPembayaran === 'Tunai') {
            if (stateDataHeader?.namaAkunValue === 'Uang Muka Pembelian') {
                catatan1 = `${stateDataHeader?.namaHutang} atas : ${stateDataHeader?.namaSupplierValue}`;
                catatan2 = `[Auto Jurnal]-PENGAMBILAN BARANG ATAS UANG MUKA SUPPLIER : ${stateDataHeader?.namaSupplierValue} NO. KONTRAK ${stateDataHeader?.noKontrakValue}`;
            } else {
                catatan1 = `${stateDataHeader?.namaHutang} atas : ${stateDataHeader?.namaSupplierValue}`;
                catatan2 = `Pembayaran ${modalJenisPembayaran} atas : ${stateDataHeader?.namaSupplierValue} dengan ${stateDataHeader?.namaAkunValue}`;
            }
        } else {
            catatan1 = `${stateDataHeader?.namaHutang} atas : ${stateDataHeader?.namaSupplierValue}`;
            catatan2 = `Pembayaran ${modalJenisPembayaran} atas : ${stateDataHeader?.namaSupplierValue} dengan ${stateDataHeader?.namaAkunValue}`;
        }

        // GET KODE SUBLEDGER
        const resultListSubledger: any[] = await ListSubledger(kode_entitas, stateDataHeader?.kodeAkun);
        const kodeSubledger = resultListSubledger.find((item: any) => item.nama_subledger === stateDataHeader?.namaSupplierValue)?.kode_subledger;

        const dataJurnalArry = [
            {
                id: 1,
                kode_akun: stateDataHeader?.kodeAkunHutang,
                no_akun: stateDataHeader?.noHutang,
                nama_akun: stateDataHeader?.namaHutang,
                tipe: stateDataHeader?.tipeHutang,
                kode_subledger: stateDataHeader?.kodeSupplierValue,
                no_subledger: stateDataHeader?.noSupplierValue,
                nama_subledger: stateDataHeader?.namaSupplierValue,
                subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                debet_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran,
                // catatan: modalJenisPembayaran === 'Transfer' && kode_entitas === '898' ? stateDataHeader?.noBuktiTransfer+' atas : '+stateDataHeader?.namaSupplierValue : stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                // catatan: stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                catatan: catatan1,
            },
            {
                id: 4,
                kode_akun: stateDataHeader?.kodeAkun,
                no_akun: stateDataHeader?.noAkunValue,
                nama_akun: stateDataHeader?.namaAkunValue,
                tipe: stateDataHeader?.tipeAkun,
                // kode_subledger: stateDataHeader?.kodeSupplierValue,
                // no_subledger: stateDataHeader?.noSupplierValue,
                // nama_subledger: stateDataHeader?.namaSupplierValue,
                kode_subledger: stateDataHeader?.noAkunValue === '1-11002' ? kodeSubledger : '',
                no_subledger: stateDataHeader?.noAkunValue === '1-11002' ? stateDataHeader?.noSupplierValue : '',
                nama_subledger: stateDataHeader?.noAkunValue === '1-11002' ? stateDataHeader?.namaSupplierValue : '',
                subledger: stateDataHeader?.noAkunValue === '1-11002' ? stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue : '',
                debet_rp: 0,
                kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                // catatan: 'Pembayaran ' + modalJenisPembayaran + ' atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + stateDataHeader?.namaAkunValue,
                catatan: catatan2,
            },
        ];
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);

        let dataJurnalPembulatan: any;
        if (selisih > 0) {
            if (selisih <= 1000) {
                dataJurnalPembulatan = [
                    {
                        id: 2,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                ];
            } else {
                dataJurnalPembulatan = [
                    {
                        id: 2,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                    {
                        id: 3,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: stateDataHeader?.kursValue * selisih - 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                ];
            }
            if (masterDataState === 'BARU') {
                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));

                gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                gridJurnalList?.setProperties({ dataSource: mergedDataSource });
            } else {
                // if (stateDataHeader === 'Plag') {
                //     await setDataJurnal({ nodes: dataJurnalArry });
                //     await setDataJurnal((prevState: any) => ({
                //         nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                //     }));
                // } else {
                //     await setDataJurnal({ nodes: editDataJurnal });
                // }
                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));

                gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                gridJurnalList?.setProperties({ dataSource: mergedDataSource });
            }
        } else {
            if (selisih < 0) {
                if (selisih >= -1000) {
                    dataJurnalPembulatan = [
                        {
                            id: 2,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                    ];
                } else {
                    dataJurnalPembulatan = [
                        {
                            id: 2,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000 * -1,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                        {
                            id: 3,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: stateDataHeader?.kursValue * selisih + 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                    ];
                }
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));

                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                    const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                    gridJurnalList?.setProperties({ dataSource: mergedDataSource });
                } else {
                    // if (stateDataHeader === 'Plag') {
                    //     await setDataJurnal({ nodes: dataJurnalArry });
                    //     await setDataJurnal((prevState: any) => ({
                    //         nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    //     }));
                    // } else {
                    //     await setDataJurnal({ nodes: editDataJurnal });
                    // }
                    await setDataJurnal({ nodes: dataJurnalArry });
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));

                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                    const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                    gridJurnalList?.setProperties({ dataSource: mergedDataSource });
                }
            } else {
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                } else {
                    // if (stateDataHeader === 'Plag') {
                    //     await setDataJurnal({ nodes: dataJurnalArry });
                    // } else {
                    //     await setDataJurnal({ nodes: editDataJurnal });
                    // }
                    await setDataJurnal({ nodes: dataJurnalArry });
                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                }
            }
        }
        // await setDataJurnal({ nodes: dataJurnalArry });
        // await setDataJurnal((prevState: any) => ({
        //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        // }));
        await GenerateTotalJurnal(setDataJurnal, setStateDataDetail);

        if (gridJurnalList && Array.isArray(gridJurnalList?.dataSource)) {
            console.log('masuk sini bre');

            // Salin array untuk menghindari mutasi langsung pada dataSource
            const dataSource = [...gridJurnalList.dataSource];
            const promises = dataSource.map(async (item: any) => {
                const result = await CekSubledger(kode_entitas, item.kode_akun);
                console.log('result = ', result);
                if (item.tipe !== null) {
                    if (result[0].subledger === 'Y' && (item.subledger === '' || item.subledger === null || item.subledger === undefined)) {
                        const data = {
                            status: true,
                            no_akun: item.no_akun,
                        };
                        return data;
                    } else if (
                        (item.tipe.toLowerCase() === 'hutang' && (item.subledger === '' || item.subledger === null || item.subledger === undefined)) ||
                        (item.tipe.toLowerCase() === 'piutang' && (item.subledger === '' || item.subledger === null || item.subledger === undefined)) ||
                        item.subledger === 'Y'
                    ) {
                        const data = {
                            status: true,
                            no_akun: item.no_akun,
                        };
                        return data;
                    }
                }
                return false;
            });

            // Menangani hasil promises
            Promise.all(promises).then((statuses) => {
                // Filter semua item dengan status true
                const trueItems = statuses.filter((item) => {
                    return typeof item === 'object' && item !== null && item.status === true;
                });

                if (trueItems.length > 0) {
                    // Gabungkan semua no_akun dari elemen yang memenuhi syarat
                    const noAkunList = trueItems.map((item: any) => item.no_akun).join(', ');

                    // Tampilkan alert satu kali dengan daftar no_akun
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px;color:white;">No. Akun mempunyai subsidiary ledger. No Akun: ${noAkunList}.</p>`,
                        width: '100%',
                        target: '#dialogPhuList',
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                } else {
                    console.log('All accounts have subledger N.');
                }

                console.log('data = ', statuses);
            });
        }
        return true;
    } else if (tipe === 'deleteAll') {
        // Tambahkan CSS untuk tombol
        const style = document.createElement('style');
        style.innerHTML = `
        .swal2-popup .btn {
        margin-left: 10px;
        }
`;
        document.head.appendChild(style);

        withReactContent(swalDialog)
            .fire({
                html: `<p style="font-size:12px">Hapus semua data Jurnal?.</p>`,
                width: '211px',
                heightAuto: true,
                target: '#dialogPhuList',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '&ensp; Yes &ensp;',
                cancelButtonText: '&ensp; No &ensp;',
                reverseButtons: false,
            })
            .then(async (result) => {
                if (result.value) {
                    // setDataJurnal((state: any) => ({
                    //     ...state,
                    //     nodes: [],
                    // }));
                    gridJurnalList?.setProperties({ dataSource: [] });

                    setStateDataDetail((prevState: any) => ({
                        ...prevState,
                        totalDebet: 0,
                        totalKredit: 0,
                        totalSelisih: 0,
                    }));

                    gridJurnalList?.refresh();
                }
            });
    } else if (tipe === 'delete') {
        let currentDetailJurnal: any;
        currentDetailJurnal = gridJurnalList?.getSelectedRecords() || [];
        if (currentDetailJurnal.length > 0) {
            await hapusEntriJurnal(gridJurnalList, setDataJurnal, currentDetailJurnal[0].id, setStateDataDetail, dataJurnal, currentDetailJurnal);
        }
    }
};

const DetailNoFakturJurnalWarkat = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kodeSupplierValue: any,
    setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    modalJenisPembayaran: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: any,
    editDataJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        console.log('stateDataHeader 12= ', stateDataHeader?.kodeAkunHutang);
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.jumlah_pembayaran === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.jumlah_pembayaran);
        }, 0); // ini sama Hutang

        // Tunai, Transfer, Warkat

        if (hasEmptyNoFb <= 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return false;
        }

        if (jumlahBayar === '') {
            // Jumlah Bayar sama dengan kredit Rp
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
            if (jumlahBayar) {
                jumlahBayar.focus();
            }
            return false;
        }

        if (modalJenisPembayaran === 'Warkat' && (stateDataHeader?.noWarkat === '' || stateDataHeader?.noWarkat === null || stateDataHeader?.noWarkat === undefined)) {
            // nanti ditambahkan no_warkat
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">No. Warkat belum diisi.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return false;
        }

        if (totalJumlahPembayaran === 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Belum ada pembayaran faktur di alokasi dana.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return false;
        }

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;

        const dataJurnalArry = [
            {
                id: 1000,
                kode_akun: stateDataHeader?.kodeAkunHutang,
                no_akun: stateDataHeader?.noHutang,
                nama_akun: stateDataHeader?.namaHutang,
                tipe: stateDataHeader?.tipeHutang,
                kode_subledger: stateDataHeader?.kodeSupplierValue,
                no_subledger: stateDataHeader?.noSupplierValue,
                nama_subledger: stateDataHeader?.namaSupplierValue,
                subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                debet_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran,
                catatan: stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
            },
            {
                id: 1003,
                kode_akun: stateDataHeader?.kodeAkunHutangBg,
                no_akun: stateDataHeader?.noAkunHutangBg,
                nama_akun: stateDataHeader?.namaAkunHutangBg,
                tipe: stateDataHeader?.tipeAkunHutangBg,
                kode_subledger: stateDataHeader?.kodeSupplierValue,
                no_subledger: stateDataHeader?.noSupplierValue,
                nama_subledger: stateDataHeader?.namaSupplierValue,
                subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                debet_rp: 0,
                kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                catatan: 'Pembayaran atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + stateDataHeader?.namaAkunHutangBg,
            },
        ];
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);

        let dataJurnalPembulatan: any;
        if (selisih > 0) {
            if (selisih <= 1000) {
                dataJurnalPembulatan = [
                    {
                        id: 1001,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                ];
            } else {
                dataJurnalPembulatan = [
                    {
                        id: 1001,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                    {
                        id: 1002,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: stateDataHeader?.kursValue * selisih - 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                ];
            }
            if (masterDataState === 'BARU') {
                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));

                gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                gridJurnalList?.setProperties({ dataSource: mergedDataSource });
            } else {
                // await setDataJurnal({ nodes: editDataJurnal });

                // gridJurnalList?.setProperties({ dataSource: editDataJurnal });
                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));

                gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                gridJurnalList?.setProperties({ dataSource: mergedDataSource });
            }
        } else {
            if (selisih < 0) {
                if (selisih >= -1000) {
                    dataJurnalPembulatan = [
                        {
                            id: 1001,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                    ];
                } else {
                    dataJurnalPembulatan = [
                        {
                            id: 1001,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000 * -1,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                        {
                            id: 1002,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: stateDataHeader?.kursValue * selisih + 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                    ];
                }
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));

                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                    const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                    gridJurnalList?.setProperties({ dataSource: mergedDataSource });
                } else {
                    // await setDataJurnal({ nodes: editDataJurnal });
                    // gridJurnalList?.setProperties({ dataSource: editDataJurnal });
                    await setDataJurnal({ nodes: dataJurnalArry });
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));

                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                    const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

                    gridJurnalList?.setProperties({ dataSource: mergedDataSource });
                }
            } else {
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                } else {
                    // await setDataJurnal({ nodes: editDataJurnal });
                    // gridJurnalList?.setProperties({ dataSource: editDataJurnal });
                    await setDataJurnal({ nodes: dataJurnalArry });
                    gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                }
            }
        }
        // await setDataJurnal({ nodes: dataJurnalArry });
        // await setDataJurnal((prevState: any) => ({
        //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        // }));
        await GenerateTotalJurnal(setDataJurnal, setStateDataDetail);
        return true;
    } else if (tipe === 'deleteAll') {
        setDataJurnal((state: any) => ({
            ...state,
            nodes: [],
        }));
        setStateDataDetail((prevState: any) => ({
            ...prevState,
            totalDebet: 0,
            totalKredit: 0,
        }));
    } else if (tipe === 'delete') {
        let currentDetailJurnal: any;
        currentDetailJurnal = gridJurnalList?.getSelectedRecords() || [];
        if (currentDetailJurnal.length > 0) {
            await hapusEntriJurnal(gridJurnalList, setDataJurnal, currentDetailJurnal[0].id, setStateDataDetail, dataJurnal, currentDetailJurnal);
        }
    }
};

const DetailNoFakturJurnalPencairanWarkat = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kodeSupplierValue: any,
    setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    modalJenisPembayaran: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: string,
    editDataJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.jumlah_pembayaran === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.jumlah_pembayaran);
        }, 0); // ini sama Hutang

        // Tunai, Transfer, Warkat
        if ((modalJenisPembayaran === 'Tunai' || modalJenisPembayaran !== 'Warkat') && namaAkunValue === '') {
            withReactContent(swalDialog)
                .fire({
                    title: '<p style="font-size:12px">Akun Kredit belum diisi.</p>',
                    width: '11%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'OK',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        await HandleModalicon(
                            'header',
                            'akunKredit',
                            setStateDataHeader,
                            setDataDaftarAkunKredit,
                            setDataDaftarSupplier,
                            kode_entitas,
                            kodeSupplierValue,
                            setDataDaftarUangMuka,
                            '',
                            setStateDataDetail,
                            setDataDaftarCustomer,
                            setDataDaftarSubledger,
                            idDokumen,
                            tipeAdd
                        );
                        await setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunKreditVisible: true,
                        }));
                    }
                });
            return false;
        }

        const selisih = (jumlahBayar === '' ? 0 : parseFloat(jumlahBayar)) - totalJumlahPembayaran;

        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);

        console.log('selisih = ', selisih, jumlahBayar, totalJumlahPembayaran);

        let dataJurnalPembulatan: any, dataJurnalArry: any;
        if (selisih > 0) {
            dataJurnalArry = [
                {
                    id: 3000,
                    kode_akun: stateDataHeader?.kodeAkunHutangBg,
                    no_akun: stateDataHeader?.noAkunHutangBg,
                    nama_akun: stateDataHeader?.namaAkunHutangBg,
                    tipe: stateDataHeader?.tipeAkunHutangBg,
                    kode_subledger: stateDataHeader?.kodeSupplierValue,
                    no_subledger: stateDataHeader?.noSupplierValue,
                    nama_subledger: stateDataHeader?.namaSupplierValue,
                    subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                    debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                    kredit_rp: 0,
                    kurs: stateDataHeader?.kursValue,
                    mu: 'IDR',
                    departemen: '',
                    kode_dept: '',
                    jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                    // catatan: modalJenisPembayaran === 'Transfer' && kode_entitas === '898' ? stateDataHeader?.noBuktiTransfer+' atas : '+stateDataHeader?.namaSupplierValue : stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                    catatan: stateDataHeader?.namaAkunHutangBg + ' atas : ' + stateDataHeader?.namaSupplierValue,
                },
                {
                    id: 3003,
                    kode_akun: stateDataHeader?.kodeAkun,
                    no_akun: stateDataHeader?.noAkunValue,
                    nama_akun: stateDataHeader?.namaAkunValue,
                    tipe: stateDataHeader?.tipeAkun,
                    // kode_subledger: stateDataHeader?.kodeSupplierValue,
                    // no_subledger: stateDataHeader?.noSupplierValue,
                    // nama_subledger: stateDataHeader?.namaSupplierValue,
                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: 0,
                    kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                    kurs: stateDataHeader?.kursValue,
                    mu: 'IDR',
                    departemen: '',
                    kode_dept: '',
                    jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                    catatan: 'Pencairan ' + stateDataHeader?.namaAkunHutangBg + ' atas : ' + stateDataHeader?.namaSupplierValue,
                },
            ];
            // if (selisih <= 1000) {
            //     dataJurnalPembulatan = [
            //         {
            //             id: 3001,
            //             kode_akun: quSetting[0].kode_akun_bebbulat,
            //             no_akun: quSetting[0].no_beban_bulat,
            //             nama_akun: quSetting[0].nama_beban_bulat,
            //             tipe: quSetting[0].tipe_beban_bulat,
            //             // kode_subledger: stateDataHeader?.kodeSupplierValue,
            //             // no_subledger: stateDataHeader?.noSupplierValue,
            //             // nama_subledger: stateDataHeader?.namaSupplierValue,
            //             kode_subledger: '',
            //             no_subledger: '',
            //             nama_subledger: '',
            //             subledger: '',
            //             debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
            //             kredit_rp: 0,
            //             kurs: stateDataHeader?.kursValue,
            //             mu: 'IDR',
            //             departemen: '',
            //             kode_dept: '',
            //             jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
            //             catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
            //         },
            //     ];
            // } else {
            //     dataJurnalPembulatan = [
            //         {
            //             id: 3001,
            //             kode_akun: quSetting[0].kode_akun_bebbulat,
            //             no_akun: quSetting[0].no_beban_bulat,
            //             nama_akun: quSetting[0].nama_beban_bulat,
            //             tipe: quSetting[0].tipe_beban_bulat,
            //             // kode_subledger: stateDataHeader?.kodeSupplierValue,
            //             // no_subledger: stateDataHeader?.noSupplierValue,
            //             // nama_subledger: stateDataHeader?.namaSupplierValue,
            //             kode_subledger: '',
            //             no_subledger: '',
            //             nama_subledger: '',
            //             subledger: '',
            //             debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
            //             kredit_rp: 0,
            //             kurs: stateDataHeader?.kursValue,
            //             mu: 'IDR',
            //             departemen: '',
            //             kode_dept: '',
            //             jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
            //             catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
            //         },
            //         {
            //             id: 3002,
            //             kode_akun: quSetting[0].kode_akun_bebbulat,
            //             no_akun: quSetting[0].no_beban_bulat,
            //             nama_akun: quSetting[0].nama_beban_bulat,
            //             tipe: quSetting[0].tipe_beban_bulat,
            //             // kode_subledger: stateDataHeader?.kodeSupplierValue,
            //             // no_subledger: stateDataHeader?.noSupplierValue,
            //             // nama_subledger: stateDataHeader?.namaSupplierValue,
            //             kode_subledger: '',
            //             no_subledger: '',
            //             nama_subledger: '',
            //             subledger: '',
            //             debet_rp: stateDataHeader?.kursValue * selisih - 1000,
            //             kredit_rp: 0,
            //             kurs: stateDataHeader?.kursValue,
            //             mu: 'IDR',
            //             departemen: '',
            //             kode_dept: '',
            //             jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
            //             catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
            //         },
            //     ];
            // }
            await setDataJurnal({ nodes: dataJurnalArry });
            gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
            // await setDataJurnal((prevState: any) => ({
            //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
            // }));
            console.log('dataJurnalArry = ', dataJurnalArry);
        } else {
            if (selisih < 0) {
                dataJurnalArry = [
                    {
                        id: 3000,
                        kode_akun: stateDataHeader?.kodeAkunHutangBg,
                        no_akun: stateDataHeader?.noAkunHutangBg,
                        nama_akun: stateDataHeader?.namaAkunHutangBg,
                        tipe: stateDataHeader?.tipeAkunHutangBg,
                        kode_subledger: stateDataHeader?.kodeSupplierValue,
                        no_subledger: stateDataHeader?.noSupplierValue,
                        nama_subledger: stateDataHeader?.namaSupplierValue,
                        subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                        debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                        // catatan: modalJenisPembayaran === 'Transfer' && kode_entitas === '898' ? stateDataHeader?.noBuktiTransfer+' atas : '+stateDataHeader?.namaSupplierValue : stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                        catatan: stateDataHeader?.namaAkunHutangBg + ' atas : ' + stateDataHeader?.namaSupplierValue,
                    },
                    {
                        id: 3003,
                        kode_akun: stateDataHeader?.kodeAkun,
                        no_akun: stateDataHeader?.noAkunValue,
                        nama_akun: stateDataHeader?.namaAkunValue,
                        tipe: stateDataHeader?.tipeAkun,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: 0,
                        kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                        catatan: 'Pencairan ' + stateDataHeader?.namaAkunHutangBg + ' atas : ' + stateDataHeader?.namaSupplierValue,
                    },
                ];
                // if (selisih >= -1000) {

                //     dataJurnalPembulatan = [
                //         {
                //             id: 3001,
                //             kode_akun: quSetting[0].kode_akun_pendbulat,
                //             no_akun: quSetting[0].no_pend_bulat,
                //             nama_akun: quSetting[0].nama_pend_bulat,
                //             tipe: quSetting[0].tipe_pend_bulat,
                //             // kode_subledger: stateDataHeader?.kodeSupplierValue,
                //             // no_subledger: stateDataHeader?.noSupplierValue,
                //             // nama_subledger: stateDataHeader?.namaSupplierValue,
                //             kode_subledger: '',
                //             no_subledger: '',
                //             nama_subledger: '',
                //             subledger: '',
                //             debet_rp: 0,
                //             kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                //             kurs: stateDataHeader?.kursValue,
                //             mu: 'IDR',
                //             departemen: '',
                //             kode_dept: '',
                //             jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                //             catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                //         },
                //     ];
                // } else {
                //     dataJurnalPembulatan = [
                //         {
                //             id: 3001,
                //             kode_akun: quSetting[0].kode_akun_pendbulat,
                //             no_akun: quSetting[0].no_pend_bulat,
                //             nama_akun: quSetting[0].nama_pend_bulat,
                //             tipe: quSetting[0].tipe_pend_bulat,
                //             // kode_subledger: stateDataHeader?.kodeSupplierValue,
                //             // no_subledger: stateDataHeader?.noSupplierValue,
                //             // nama_subledger: stateDataHeader?.namaSupplierValue,
                //             kode_subledger: '',
                //             no_subledger: '',
                //             nama_subledger: '',
                //             subledger: '',
                //             debet_rp: 0,
                //             kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                //             kurs: stateDataHeader?.kursValue,
                //             mu: 'IDR',
                //             departemen: '',
                //             kode_dept: '',
                //             jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000 * -1,
                //             catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                //         },
                //         {
                //             id: 3002,
                //             kode_akun: quSetting[0].kode_akun_pendbulat,
                //             no_akun: quSetting[0].no_pend_bulat,
                //             nama_akun: quSetting[0].nama_pend_bulat,
                //             tipe: quSetting[0].tipe_pend_bulat,
                //             // kode_subledger: stateDataHeader?.kodeSupplierValue,
                //             // no_subledger: stateDataHeader?.noSupplierValue,
                //             // nama_subledger: stateDataHeader?.namaSupplierValue,
                //             kode_subledger: '',
                //             no_subledger: '',
                //             nama_subledger: '',
                //             subledger: '',
                //             debet_rp: 0,
                //             kredit_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                //             kurs: stateDataHeader?.kursValue,
                //             mu: 'IDR',
                //             departemen: '',
                //             kode_dept: '',
                //             jumlah_mu: stateDataHeader?.kursValue * selisih + 1000,
                //             catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                //         },
                //     ];
                // }
                console.log('dataJurnalArry 1= ', dataJurnalArry);
                await setDataJurnal({ nodes: dataJurnalArry });
                gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                // await setDataJurnal((prevState: any) => ({
                //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                // }));
            } else {
                dataJurnalArry = [
                    {
                        id: 3000,
                        kode_akun: stateDataHeader?.kodeAkunHutangBg,
                        no_akun: stateDataHeader?.noAkunHutangBg,
                        nama_akun: stateDataHeader?.namaAkunHutangBg,
                        tipe: stateDataHeader?.tipeAkunHutangBg,
                        kode_subledger: stateDataHeader?.kodeSupplierValue,
                        no_subledger: stateDataHeader?.noSupplierValue,
                        nama_subledger: stateDataHeader?.namaSupplierValue,
                        subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                        debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                        // catatan: modalJenisPembayaran === 'Transfer' && kode_entitas === '898' ? stateDataHeader?.noBuktiTransfer+' atas : '+stateDataHeader?.namaSupplierValue : stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
                        catatan: stateDataHeader?.namaAkunHutangBg + ' atas : ' + stateDataHeader?.namaSupplierValue,
                    },
                    {
                        id: 3003,
                        kode_akun: stateDataHeader?.kodeAkun,
                        no_akun: stateDataHeader?.noAkunValue,
                        nama_akun: stateDataHeader?.namaAkunValue,
                        tipe: stateDataHeader?.tipeAkun,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: 0,
                        kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                        catatan: 'Pencairan ' + stateDataHeader?.namaAkunHutangBg + ' atas : ' + stateDataHeader?.namaSupplierValue,
                    },
                ];
                await setDataJurnal({ nodes: dataJurnalArry });
                gridJurnalList?.setProperties({ dataSource: dataJurnalArry });
                console.log('dataJurnalArry 2= ', dataJurnalArry);
            }

            // console.log('dataJurnalArry = ', dataJurnalArry);
        }
        // await setDataJurnal({ nodes: dataJurnalArry });
        // await setDataJurnal((prevState: any) => ({
        //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        // }));
        // console.log('dataJurnalArry = ', dataJurnalArry);
        await GenerateTotalJurnal(setDataJurnal, setStateDataDetail);
        // await GenerateTotalJurnalEdit(dataJurnalArry, setDataJurnal, setStateDataDetail);
        return true;
    }
};

const DetailNoFakturJurnalPenolakanWarkat = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kodeSupplierValue: any,
    setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    modalJenisPembayaran: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: string,
    editDataJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.jumlah_pembayaran === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.jumlah_pembayaran);
        }, 0); // ini sama Hutang

        // Tunai, Transfer, Warkat

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;

        const dataJurnalArry = [
            {
                id: 2000,
                kode_akun: stateDataHeader?.kodeAkunHutang,
                no_akun: stateDataHeader?.noHutang,
                nama_akun: stateDataHeader?.namaHutang,
                tipe: stateDataHeader?.tipeHutang,
                kode_subledger: stateDataHeader?.kodeSupplierValue,
                no_subledger: stateDataHeader?.noSupplierValue,
                nama_subledger: stateDataHeader?.namaSupplierValue,
                subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                debet_rp: 0,
                kredit_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran * -1,
                catatan: 'Penolakan. ' + stateDataHeader?.namaHutang + ' atas : ' + stateDataHeader?.namaSupplierValue,
            },
            {
                id: 2003,
                kode_akun: stateDataHeader?.kodeAkunHutangBg,
                no_akun: stateDataHeader?.noAkunHutangBg,
                nama_akun: stateDataHeader?.namaAkunHutangBg,
                tipe: stateDataHeader?.tipeAkunHutangBg,
                kode_subledger: stateDataHeader?.kodeSupplierValue,
                no_subledger: stateDataHeader?.noSupplierValue,
                nama_subledger: stateDataHeader?.namaSupplierValue,
                subledger: stateDataHeader?.noSupplierValue + '-' + stateDataHeader?.namaSupplierValue,
                debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                catatan: 'Penolakan. Pembayaran atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + stateDataHeader?.namaAkunHutangBg,
            },
        ];
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);

        let dataJurnalPembulatan: any;
        if (selisih > 0) {
            if (selisih <= 1000) {
                dataJurnalPembulatan = [
                    {
                        id: 2001,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                ];
            } else {
                dataJurnalPembulatan = [
                    {
                        id: 2001,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                    {
                        id: 2002,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,
                        // kode_subledger: stateDataHeader?.kodeSupplierValue,
                        // no_subledger: stateDataHeader?.noSupplierValue,
                        // nama_subledger: stateDataHeader?.namaSupplierValue,
                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: stateDataHeader?.kursValue * selisih - 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                    },
                ];
            }
            await setDataJurnal({ nodes: dataJurnalArry });
            await setDataJurnal((prevState: any) => ({
                nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
            }));
        } else {
            if (selisih < 0) {
                if (selisih >= -1000) {
                    dataJurnalPembulatan = [
                        {
                            id: 2001,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                    ];
                } else {
                    dataJurnalPembulatan = [
                        {
                            id: 2001,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000 * -1,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                        {
                            id: 2002,
                            kode_akun: quSetting[0].kode_akun_pendbulat,
                            no_akun: quSetting[0].no_pend_bulat,
                            nama_akun: quSetting[0].nama_pend_bulat,
                            tipe: quSetting[0].tipe_pend_bulat,
                            // kode_subledger: stateDataHeader?.kodeSupplierValue,
                            // no_subledger: stateDataHeader?.noSupplierValue,
                            // nama_subledger: stateDataHeader?.namaSupplierValue,
                            kode_subledger: '',
                            no_subledger: '',
                            nama_subledger: '',
                            subledger: '',
                            debet_rp: 0,
                            kredit_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: stateDataHeader?.kursValue * selisih + 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                        },
                    ];
                }
                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));
            } else {
                await setDataJurnal({ nodes: dataJurnalArry });
            }
        }
        // await setDataJurnal({ nodes: dataJurnalArry });
        // await setDataJurnal((prevState: any) => ({
        //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        // }));
        await GenerateTotalJurnal(setDataJurnal, setStateDataDetail);
        return true;
    }
};

const AutoJurnalSimpan = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kodeSupplierValue: any,
    setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    modalJenisPembayaran: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: string,
    editDataJurnal: any,
    dataDetailNoFakturPhu: any
) => {
    const ResDetailNoFakturJurnal = await DetailNoFakturJurnal(
        'autoJurnal',
        kode_entitas,
        stateDataHeader?.namaAkunValue,
        setStateDataHeader,
        setDataDaftarAkunKredit,
        setDataDaftarSupplier,
        stateDataHeader?.kodeSupplierValue,
        setDataDaftarUangMuka,
        dataBarang,
        stateDataHeader?.jumlahBayar,
        modalJenisPembayaran,
        setDataJurnal,
        stateDataHeader,
        gridJurnalList,
        setStateDataDetail,
        dataJurnal,
        setDataDaftarCustomer,
        setDataDaftarSubledger,
        idDokumen,
        tipeAdd,
        masterDataState,
        editDataJurnal,
        dataDetailNoFakturPhu
    );
    return ResDetailNoFakturJurnal;

    // return dataJurnal;
};

const hitungSelisih = (nodes: any, currentDetailJurnal: any, setStateDataDetail: Function) => {
    let totalDebet = 0;
    let totalKredit = 0;

    totalDebet = nodes.reduce((total: any, item: any) => {
        return total + parseFloat(item.debet_rp);
    }, 0);
    totalKredit = nodes.reduce((total: any, item: any) => {
        return total + parseFloat(item.kredit_rp);
    }, 0);

    // Memastikan selisih tidak negatif
    const selisih = totalDebet - totalKredit;
    const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

    setStateDataDetail((prevState: any) => ({
        ...prevState,
        totalDebet: totalDebet,
        totalKredit: totalKredit,
        totalSelisih: nilaiSelisih,
    }));

    return selisih >= 0 ? selisih : selisih * -1;
};

const hapusEntriJurnal = async (gridJurnalList: any, setDataJurnal: Function, nodeId: string, setStateDataDetail: Function, dataJurnal: any, currentDetailJurnal: any) => {
    // Check if dataSource exists and is an array before proceeding
    if (gridJurnalList && Array.isArray(gridJurnalList?.dataSource)) {
        // Filter the gridJurnalList dataSource to remove the entry with the matching idJurnal
        const dataSource = [...gridJurnalList.dataSource];
        const updatedDataSource = dataSource.filter((item: any) => item.id !== nodeId);

        // Update the dataSource of gridJurnalList
        // gridJurnalList = updatedDataSource;

        gridJurnalList?.setProperties({ dataSource: updatedDataSource });
        hitungSelisih(updatedDataSource, currentDetailJurnal, setStateDataDetail);
        if (gridJurnalList.refresh) {
            gridJurnalList.refresh();
        }
    }

    // await setDataJurnal((state: any) => {
    //     const newNodes = state.nodes.filter((node: any) => node.id !== nodeId);
    //     const selisih = hitungSelisih(newNodes, currentDetailJurnal, setStateDataDetail);

    //     return {
    //         ...state,
    //         nodes: newNodes,
    //     };
    // });

    const hasEmptyJurnal = dataJurnal.nodes.length - 1;
    if (hasEmptyJurnal === 0) {
        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            totalDebet: 0,
            totalKredit: 0,
            totalSelisih: 0,
        }));
    }
};

const HandleRowSelectedJurnal = (args: any, setStateDataDetail: Function) => {
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        rowsIdJurnal: args.data.id,
    }));
};

const GenerateTotalJurnal = async (setDataJurnal: Function, setStateDataDetail: Function) => {
    await setDataJurnal((state: any) => {
        const newNodes = state.nodes.map((node: any) => {
            return {
                ...node,
            };
        });

        const totalDebet = newNodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.debet_rp);
        }, 0);
        const totalKredit = newNodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.kredit_rp);
        }, 0);

        setStateDataDetail((prevState: any) => ({
            ...prevState,
            totalDebet: totalDebet,
            totalKredit: totalKredit,
            totalSelisih: 0,
        }));

        return {
            nodes: newNodes,
        };
    });
};

const GenerateTotalJurnalEdit = async (dataJurnal: any, setDataJurnal: Function, setStateDataDetail: Function) => {
    console.log('dataJurnal = ', dataJurnal);
    // const newNodes = dataJurnal.map((node: any) => {
    //     return {
    //         ...node,
    //     };
    // });

    // const totalDebet = newNodes.reduce((total: any, item: any) => {
    //     return total + parseFloat(item.debet_rp);
    // }, 0);
    // const totalKredit = newNodes.reduce((total: any, item: any) => {
    //     return total + parseFloat(item.kredit_rp);
    // }, 0);

    // setStateDataDetail((prevState: any) => ({
    //     ...prevState,
    //     totalDebet: totalDebet,
    //     totalKredit: totalKredit,
    //     totalSelisih: totalKredit - totalDebet,
    // }));

    // setDataJurnal({ nodes: newNodes });
};

//==================================================================================================

//==================================================================================================
// Fungsi Terbilang nilai
function Terbilang(a: any): string { 
    var bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas']; 
    var kalimat = ''; 
 
    if (typeof a === 'number') { 
      a = parseFloat(a.toFixed(2)); 
    } else { 
      a = parseFloat(parseFloat(a).toFixed(2)); 
    } 
 
    var parts = a.toString().split('.'); 
    var angkaUtama = parseInt(parts[0]); 
    var angkaDesimal = parts[1] ? parseFloat('0.' + parts[1]) : 0; 
 
    function angkaKeKata(angka: number): string { 
      if (angka === 0) { 
        return ''; 
      } 
      if (angka < 12) { 
        return bilangan[angka]; 
      } else if (angka < 20) { 
        return bilangan[angka - 10] + ' Belas'; 
      } else if (angka < 100) { 
        var depan = Math.floor(angka / 10); 
        var belakang = angka % 10; 
        return bilangan[depan] + ' Puluh ' + (belakang > 0 ? bilangan[belakang] : ''); 
      } else if (angka < 200) { 
        return 'Seratus ' + angkaKeKata(angka - 100); 
      } else if (angka < 1000) { 
        var depan = Math.floor(angka / 100); 
        var belakang = angka % 100; 
        return bilangan[depan] + ' Ratus ' + angkaKeKata(belakang); 
      } else if (angka < 2000) { 
        return 'Seribu ' + angkaKeKata(angka - 1000); 
      } else if (angka < 1000000) { 
        var depan = Math.floor(angka / 1000); 
        var belakang = angka % 1000; 
        return angkaKeKata(depan) + ' Ribu ' + angkaKeKata(belakang); 
      } else if (angka < 1000000000) { 
        var depan = Math.floor(angka / 1000000); 
        var belakang = angka % 1000000; 
        return angkaKeKata(depan) + ' Juta ' + angkaKeKata(belakang); 
      } else if (angka < 1000000000000) { 
        var depan = Math.floor(angka / 1000000000); 
        var belakang = angka % 1000000000; 
        return angkaKeKata(depan) + ' Milyar ' + angkaKeKata(belakang); 
      } else if (angka < 1000000000000000) { 
        var depan = Math.floor(angka / 1000000000000); 
        var belakang = angka % 1000000000000; 
        return angkaKeKata(depan) + ' Triliun ' + angkaKeKata(belakang); 
      } 
      return ''; // Untuk angka yang lebih besar 
    } 
 
    kalimat = angkaKeKata(angkaUtama); 
    if (kalimat === '') { 
      kalimat = 'Nol'; 
    } 
 
    // Tambahkan bagian desimal menjadi sen 
    if (angkaDesimal > 0) { 
      var sen = Math.round(angkaDesimal * 100); // Konversi desimal menjadi sen 
      if (sen > 0) { 
        kalimat += ' Koma ' + angkaKeKata(sen) + ' Sen'; 
      } 
    } 
 
    return kalimat.trim(); 
  }

//==================================================================================================

//=================================================================================
// Handle Filter Daftar Customer
// ini digunakan untuk filter no cust
const HandleSearchNoCust = async (event: any, setStateDataDetail: Function, kode_entitas: string, setFilteredDataCustomer: Function) => {
    const searchValue = event;
    await setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNoCust: searchValue,
    }));
    const filteredData = searchDataNoCust(searchValue, kode_entitas, setFilteredDataCustomer);
    // setFilteredData(filteredData);

    const namaCustInput = document.getElementById('namaCust') as HTMLInputElement;
    const namaSalesInput = document.getElementById('namaSales') as HTMLInputElement;

    if (namaCustInput) {
        namaCustInput.value = '';
    }
    if (namaSalesInput) {
        namaSalesInput.value = '';
    }
};

const searchDataNoCust = async (keyword: any, kode_entitas: string, setFilteredDataCustomer: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, 'all', keyword, 'all');
        await setFilteredDataCustomer(resultDaftarCustomer);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// ini digunakan untuk filter nama cust
const HandleSearchNamaCust = async (event: any, setStateDataDetail: Function, kode_entitas: string, setFilteredDataCustomer: Function) => {
    const searchValue = event;
    await setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNamaCust: searchValue,
    }));
    const filteredData = searchDataNamaCust(searchValue, kode_entitas, setFilteredDataCustomer);
    // setFilteredData(filteredData);

    const noCustInput = document.getElementById('noCust') as HTMLInputElement;
    const namaSalesInput = document.getElementById('namaSales') as HTMLInputElement;

    if (noCustInput) {
        noCustInput.value = '';
    }
    if (namaSalesInput) {
        namaSalesInput.value = '';
    }
};

const searchDataNamaCust = async (keyword: any, kode_entitas: string, setFilteredDataCustomer: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, keyword, 'all', 'all');
        await setFilteredDataCustomer(resultDaftarCustomer);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// ini digunakan untuk filter nama sales
const HandleSearchNamaSales = async (event: any, setStateDataDetail: Function, kode_entitas: string, setFilteredDataCustomer: Function) => {
    const searchValue = event;
    await setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSales: searchValue,
    }));
    const filteredData = searchDataNamaSales(searchValue, kode_entitas, setFilteredDataCustomer);
    // setFilteredData(filteredData);

    const noCustInput = document.getElementById('noCust') as HTMLInputElement;
    const namaCustInput = document.getElementById('namaCust') as HTMLInputElement;

    if (noCustInput) {
        noCustInput.value = '';
    }
    if (namaCustInput) {
        namaCustInput.value = '';
    }
};

const searchDataNamaSales = async (keyword: any, kode_entitas: string, setFilteredDataCustomer: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const resultDaftarCustomer: any[] = await ListCustFilter(kode_entitas, 'all', 'all', keyword);
        await setFilteredDataCustomer(resultDaftarCustomer);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
//END
//=================================================================================

// =================================================================================
// Cek Tanggal Minus Satu untuk pengecekan tgl dokumen pada saat input

const CekTglMinusSatu = async (tglDok: any) => {
    // pengecekan tanggal kurang 1 hari dari hari ini
    // Dapatkan tanggal hari ini
    const tglDokumen = moment(tglDok).format('YYYY-MM-DD');
    const today = new Date();

    // Kurangi 1 hari dari tanggal hari ini
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Ubah tanggal transaksi menjadi objek Date
    const transaction = new Date(tglDokumen);

    // Bandingkan tanggal transaksi dengan tanggal yang telah dikurangi 1 hari
    const tglMinusSatu = transaction > yesterday && transaction < today;
    return tglMinusSatu;
};

// End
// =================================================================================

// =================================================================================
// Cek Periode Akuntasi
const CekPeriodeAkutansi = async (ets: string, stateDataHeader: any) => {
    try {
        const result = await GetInfo(ets);
        const getInfo = result[0].periode;
        const periode = getInfo;
        const tanggalMomentPeriode = moment(periode, 'YYYYMM');
        const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

        const tglPembanding = moment(stateDataHeader?.tglDokumen).format('YYYYMM');

        // Mendapatkan tahun dan bulan dari setiap tanggal
        const yearA = parseInt(periodeTahunBulan.substring(0, 4));
        const monthA = parseInt(periodeTahunBulan.substring(4, 6));

        const yearB = parseInt(tglPembanding.substring(0, 4));
        const monthB = parseInt(tglPembanding.substring(4, 6));

        return { yearA, monthA, yearB, monthB, periode };
    } catch (error) {
        console.error('Error:', error);
        return null; // Kembalikan null jika terjadi kesalahan
    }
};

const CekPeriodeAkutansiPencairanWarkat = async (ets: string, stateDataHeader: any) => {
    try {
        const result = await GetInfo(ets);
        const getInfo = result[0].periode;
        const periode = getInfo;
        const tanggalMomentPeriode = moment(periode, 'YYYYMM');
        const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

        const tglPembanding = moment(stateDataHeader?.tglEfektif).format('YYYYMM');

        // Mendapatkan tahun dan bulan dari setiap tanggal
        const yearA = parseInt(periodeTahunBulan.substring(0, 4));
        const monthA = parseInt(periodeTahunBulan.substring(4, 6));

        const yearB = parseInt(tglPembanding.substring(0, 4));
        const monthB = parseInt(tglPembanding.substring(4, 6));

        return { yearA, monthA, yearB, monthB, periode };
    } catch (error) {
        console.error('Error:', error);
        return null; // Kembalikan null jika terjadi kesalahan
    }
};
// End
// =================================================================================

// =================================================================================
// Handle Tanggal Dokumen pada saat di pilih
const HandleTglDok = (event: any, tipe: string, setStateDataHeader: Function) => {
    if (tipe === 'tglDokumen') {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            tglDokumen: event,
        }));
    } else if (tipe === 'tglJt') {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            tglJt: event,
        }));
    } else if (tipe === 'tglEfektif') {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            tglEfektif: event,
        }));
    } else {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            tglReferensi: event,
        }));
    }
};

// End
// =================================================================================

//=================================================================================
// Handle Filter Daftar Customer
// ini digunakan untuk filter no Surat jalan di alokasi dana
const HandleCariNoSj = (event: any, setStateDataDetail: Function, setFilteredDataBarang: Function, dataBarang: any,gridPhuListRef: any) => {
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNoSj: event,
    }));

    const filteredData = searchDataNoSJAlokasiDana(event, dataBarang.nodes);

    setFilteredDataBarang(filteredData);
};

const searchDataNoSJAlokasiDana = (keyword: any, dataBarang: any) => {
    if (keyword === '') {
        return dataBarang;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataBarang.filter((item: any) => item.no_sj.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};

// End
// =================================================================================

// =================================================================================
// Handle Input Keterangan
const HandleKeterangan = (value: any, setStateDataFooter: Function) => {
    setStateDataFooter((prevState: any) => ({
        ...prevState,
        vKeterangan: value,
    }));
};
// End
// =================================================================================

// =================================================================================
// Fungsi untuk format nilai jumlah di header
const FormatNilaiJumlah = async (event: any, setStateDataHeader: Function, setDataBarang: Function, setStateDataFooter: Function) => {
    if (event === '') {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            jumlahBayar: '',
        }));
    } else if (event === '0' || event === 0) {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            jumlahBayar: '',
        }));
    } else {
        const format = event.includes(',');
        let nilaiDefault: any;
        if (format) {
            nilaiDefault = tanpaKoma(event);
        } else {
            nilaiDefault = event;
        }
        const result = CurrencyFormat(nilaiDefault);

        // Fungsi untuk mengonversi karakter pertama menjadi huruf kapital
        const capitalizeFirstLetter = (str: any) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        // Kata yang ingin diubah
        const originalString = Terbilang(nilaiDefault);

        // Mengonversi karakter pertama menjadi huruf kapital
        const capitalizedString = capitalizeFirstLetter(originalString);

        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            jumlahBayar: nilaiDefault,
            terbilangJumlah: capitalizedString,
        }));

        const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
        if (jumlahBayar) {
            jumlahBayar.value = result;
        }

        let totPembayaran: any;
        let sisaHutang: any;
        let totalHutang: any;
        await setDataBarang((state: any) => {
            const newNodes = state.nodes.map((node: any) => {
                return {
                    ...node,
                };
            });

            totPembayaran = newNodes.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.jumlah_pembayaran);
            }, 0);

            sisaHutang = newNodes.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.sisa);
            }, 0);

            totalHutang = newNodes.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.sisa_hutang);
            }, 0);

            return {
                nodes: newNodes,
            };
        });

        const selisihAlokasiDana = parseFloat(nilaiDefault) - parseFloat(totPembayaran);

        await setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalPembayaran: totPembayaran,
            sisaHutang: sisaHutang,
            totalHutang: totalHutang,
            selisihAlokasiDana: selisihAlokasiDana,
        }));
    }
};

// End
// =================================================================================

// =================================================================================
// Fungsi yang digunakan untuk tombol di bawah jumlah dengan kondisi reset pembayaran
const ResetPembayaran = async (setDataBarang: Function, setStateDataFooter: Function, setStateDataHeader: Function) => {
    await setDataBarang((state: any) => {
        const newNodes = state.nodes.map((node: any) => {
            let jumlahPembayaran = node.jumlah_pembayaran;
            let sisaPembayaran;

            sisaPembayaran = parseFloat(node.sisa) + parseFloat(jumlahPembayaran);
            return {
                ...node,
                sisa: sisaPembayaran,
                jumlah_pembayaran: 0,
            };
        });

        let totPembayaran: any;
        let totHutang: any;

        totPembayaran = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.jumlah_pembayaran);
        }, 0);
        totHutang = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.faktur);
        }, 0);

        setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalPembayaran: totPembayaran,
            selisihAlokasiDana: totPembayaran,
            sisaHutang: totHutang - totPembayaran,
        }));

        setStateDataHeader((prevState: any) => ({
            ...prevState,
            disabledResetPembayaran: true,
        }));

        return {
            nodes: newNodes,
        };
    });
};
// End
// =================================================================================

// =================================================================================
// Fungsi yang digunakan untuk tombol di bawah jumlah dengan kondisi reset pembayaran
const BayarSemuaFaktur = async (setDataBarang: Function, setStateDataFooter: Function, setStateDataHeader: Function, stateDataHeader: any) => {
    await setDataBarang((state: any) => {
        const newNodes = state.nodes.map((node: any) => {
            let sisaPembayaran;
            sisaPembayaran = node.sisa_hutang - node.sisa_hutang;
            return {
                ...node,
                sisa: sisaPembayaran,
                jumlah_pembayaran: node.sisa_hutang,
            };
        });

        let totPembayaran: any;
        let totHutang: any;

        totPembayaran = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.jumlah_pembayaran);
        }, 0);
        totHutang = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.sisa_hutang);
        }, 0);

        console.log('stateDataHeader = ', stateDataHeader?.jumlahBayar, totPembayaran);
        setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalPembayaran: totPembayaran,
            selisihAlokasiDana: stateDataHeader?.jumlahBayar - totPembayaran,
            sisaHutang: totHutang - totPembayaran,
        }));

        setStateDataHeader((prevState: any) => ({
            ...prevState,
            disabledResetPembayaran: false,
        }));

        return {
            nodes: newNodes,
        };
    });
};
// End
// =================================================================================

//==================================================================================================
// Fungsi untuk menampilkan Cetak Form Kecil PHU
const OnClick_CetakFormKecil = (kode_phu: any, kode_entitas: string) => {
    if (kode_phu === '') {
        // swal.fire({
        //     title: 'Pilih Data terlebih dahulu.',
        //     icon: 'error',
        // });
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;">Silahkan pilih data PHU terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
        return;
    }

    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);
    console.log('kode_phu = ', `./report/form_phu_kecil?entitas=${kode_entitas}&kode_phu=${kode_phu}`);
    let iframe = `
            <html><head>
            <title>Form Pembayaran Hutang| Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/form_phu_kecil?entitas=${kode_entitas}&kode_phu=${kode_phu}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

    let win = window.open(
        '',
        '_blank',
        `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
    );

    if (win) {
        let link = win.document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = '/favicon.png';
        win.document.getElementsByTagName('head')[0].appendChild(link);
        win.document.write(iframe);
    } else {
        console.error('Window failed to open.');
    }
};
// END

//==================================================================================================
// Fungsi untuk menampilkan Cetak Form Besar PHU
const OnClick_CetakFormBesar = (kode_phu: any, kode_entitas: string) => {
    if (kode_phu === '') {
        // swal.fire({
        //     title: 'Pilih Data terlebih dahulu.',
        //     icon: 'error',
        // });
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;">Silahkan pilih data PHU terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
        return;
    }

    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframe = `
            <html><head>
            <title>Form Pembayaran Hutang| Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/form_phu_besar?entitas=${kode_entitas}&kode_phu=${kode_phu}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

    let win = window.open(
        '',
        '_blank',
        `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
    );

    if (win) {
        let link = win.document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = '/favicon.png';
        win.document.getElementsByTagName('head')[0].appendChild(link);
        win.document.write(iframe);
    } else {
        console.error('Window failed to open.');
    }
};
// END

//==================================================================================================
// Fungsi untuk menampilkan Cetak Daftar PHU
const OnClick_CetakDaftarPhu = (kode_phu: any, kode_entitas: string, tgl_awal: string, tgl_akhir: string) => {
    if (kode_phu === '') {
        // swal.fire({
        //     title: 'Pilih Data terlebih dahulu.',
        //     icon: 'error',
        // });
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;">Silahkan pilih data PHU terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
        return;
    }

    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframe = `
            <html><head>
            <title>Form Pembayaran Hutang| Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/daftar_phu?entitas=${kode_entitas}&tgl_awal=${tgl_awal}&tgl_akhir=${tgl_akhir}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

    let win = window.open(
        '',
        '_blank',
        `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
    );

    if (win) {
        let link = win.document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = '/favicon.png';
        win.document.getElementsByTagName('head')[0].appendChild(link);
        win.document.write(iframe);
    } else {
        console.error('Window failed to open.');
    }
};
// END

// ===========================================================================
// Alert
const swalPopUp = swal.mixin({
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

//END
//============================================================================

export {
    DetailNoFakturJurnalPenolakanWarkat,
    swalPopUp,
    OnClick_CetakFormBesar,
    OnClick_CetakDaftarPhu,
    OnClick_CetakFormKecil,
    CekPeriodeAkutansiPencairanWarkat,
    DetailNoFakturJurnalPencairanWarkat,
    GenerateTotalJurnal,
    DetailNoFakturJurnalWarkat,
    AutoJurnalSimpan,
    BayarSemuaFaktur,
    ResetPembayaran,
    FormatNilaiJumlah,
    HandleKeterangan,
    HandleCariNoSj,
    HandleTglDok,
    CekPeriodeAkutansi,
    CekTglMinusSatu,
    HandleSearchNamaSubledger,
    HandleSearchNoSubledger,
    HandleSearchNamaSales,
    HandleSearchNamaCust,
    HandleSearchNoCust,
    Terbilang,
    HandleRowSelectedJurnal,
    DetailNoFakturJurnal,
    DetailNoFakturDeleteAll,
    DetailNoFakturDelete,
    HandleModalInputSupplier,
    HandleSearchNamaSupplier,
    HandleSearchNoSupplier,
    HandleModalInput,
    TemplateNamaAkun,
    TemplateNoAkun,
    HandleSearchNamaAkun,
    HandleSearchNoAkun,
    HandleModalicon,
    RowSelectingListData,
    ListDetailDok,
    SetDataDokumenPhu,
    HandleRowSelected,
    PencarianJumlah,
    PencarianNoBukti,
    CurrencyFormat,
    HandleAkunKreditChange,
    HandleTglPhuPencairan,
    HandleTglPhuJt,
    HandleNoWarkatChange,
    ValueJenisPembayaran,
    HandleJenisPembayaranChange,
    HandleNoReffInputChange,
    HandleNoBuktiPembayaranInputChange,
    HandleTglPhu,
    HandleNoSupplierInputChange,
    HandleNamaSupplierInputChange,
};
