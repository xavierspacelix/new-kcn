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
import styles from '../ppilist.module.css';
import {
    CekSubledger,
    DaftarAkunDebet,
    DaftarCust,
    DaftarSalesman,
    DaftarSupplierAll,
    DaftarUangMuka,
    // DataDetailDokDataFaktur,
    // DataDetailDokDataJurnal,
    ListCustFilter,
    ListSubledger,
} from '../model/apiPpi';
import { GetInfo, fetchPreferensi, tanpaKoma } from '@/utils/routines';

import React from 'react';

const fungsiFormPpiList = () => {
    return <div>fungsiFormPpiList</div>;
};

export default fungsiFormPpiList;

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
const HandleNoBuktiPenerimaanInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        noBuktiPenerimaanValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoBuktiPenerimaanChecked: newValue.length > 0,
    }));
};
const HandleTglPpi = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
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
const HandleTglBuat = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
    if (tipe === 'tanggalAwal') {
        setFilterData((prevState: any) => ({
            ...prevState,
            date3: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalBuatChecked: true,
        }));
    } else {
        setFilterData((prevState: any) => ({
            ...prevState,
            date4: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalBuatChecked: true,
        }));
    }
};
const HandleNoTtpInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        noTTPValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoTTPChecked: newValue.length > 0,
    }));
};
const HandleKolektorChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        kolektorValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isKolektorChecked: newValue.length > 0,
    }));
};
const HandleActualKolektorChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        actualKolektorValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isActualKolektorChecked: newValue.length > 0,
    }));
};
const HandleNoCustomerInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        noCustomerValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNoCustomerChecked: newValue.length > 0,
    }));
};
const HandleNamaCustomerInputChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        namaCustomerValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isNamaCustomerChecked: newValue.length > 0,
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
const HandleJenisPenerimaanChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        selectedOptionJenisPenerimaan: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isJenisPenerimaanChecked: newValue.length > 0,
    }));
};

const HandleStatusWarkatChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        selectedOptionStatusWarkat: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isStatusWarkatChecked: newValue.length > 0,
    }));
};

const ValueJenisPenerimaan = [
    { value: 'Tunai', label: 'Tunai' },
    { value: 'Transfer', label: 'Transfer' },
    { value: 'Warkat', label: 'Warkat' },
];
const ValueStatusWarkat = [
    { value: 'Baru', label: 'Baru' },
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
const HandleTglPpiJt = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
    if (tipe === 'tanggalAwal') {
        setFilterData((prevState: any) => ({
            ...prevState,
            date5: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalJTChecked: true,
        }));
    } else {
        setFilterData((prevState: any) => ({
            ...prevState,
            date6: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalJTChecked: true,
        }));
    }
};
const HandleTglPpiPencairan = async (date: any, tipe: string, setFilterData: Function, setCheckboxFilter: Function) => {
    if (tipe === 'tanggalAwal') {
        setFilterData((prevState: any) => ({
            ...prevState,
            date7: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalPencairanChecked: true,
        }));
    } else {
        setFilterData((prevState: any) => ({
            ...prevState,
            date8: date,
        }));
        setCheckboxFilter((prevState: any) => ({
            ...prevState,
            isTanggalPencairanChecked: true,
        }));
    }
};
const HandleAkunDebetChange = (event: string, setFilterData: Function, setCheckboxFilter: Function) => {
    const newValue = event;
    setFilterData((prevState: any) => ({
        ...prevState,
        akunDebetValue: newValue,
    }));
    setCheckboxFilter((prevState: any) => ({
        ...prevState,
        isAkunDebetChecked: newValue.length > 0,
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
// const HandleRowSelected = (args: any, setListStateData: Function) => {
//     setListStateData((prevState: any) => ({
//         ...prevState,
//         selectedRowKodePhu: args.data.kode_dokumen,
//     }));
// };

// ini saat rows di eksekusi dengan arah panah keyboard
// const RowSelectingListData = (args: any, setListStateData: Function, kode_entitas: string, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function) => {
//     // console.log(args.data.kode_ttb);
//     ListDetailDok('IDR', args.data.kode_dokumen, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal);
//     setListStateData((prevState: any) => ({
//         ...prevState,
//         noDokumen: args.data.no_dokumen,
//         tglDokumen: args.data.tgl_dokumen,
//     }));
// };
// END
//==================================================================================================

// //==================================================================================================
// // Fungsi untuk pilihan button LIST
// const SetDataDokumenPhu = async (tipe: string, selectedRowKodePhu: string, kode_entitas: string, setListStateData: Function, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function) => {
//     if (selectedRowKodePhu !== '') {
//         if (tipe === 'ubah') {
//         } else if (tipe === 'detailDok') {
//             setListStateData((prevState: any) => ({
//                 ...prevState,
//                 selectedItem: selectedRowKodePhu,
//             }));
//             ListDetailDok('IDR', selectedRowKodePhu, kode_entitas, setDetailDokDataFaktur, setDetailDokDataJurnal);
//         } else if (tipe === 'cetak_form_kecil') {
//             OnClick_CetakFormKecil(selectedRowKodePhu, kode_entitas);
//         } else if (tipe === 'cetak_form_besar') {
//             OnClick_CetakFormKecil(selectedRowKodePhu, kode_entitas);
//         }
//     } else {
//         withReactContent(swalToast).fire({
//             icon: 'warning',
//             title: '<p style="font-size:12px; color:white;">Silahkan pilih data PHU terlebih dahulu</p>',
//             width: '100%',
//             customClass: {
//                 popup: styles['colored-popup'], // Custom class untuk sweetalert
//             },
//         });
//     }
// };
// // END
// //==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan data detail Dok berdasarkan kode TTB
// const ListDetailDok = async (mu: any, kode_phu: any, kode_entitas: any, setDetailDokDataFaktur: Function, setDetailDokDataJurnal: Function) => {
//     try {
//         const resultDetailDataFaktur: any[] = await DataDetailDokDataFaktur(mu, kode_phu, kode_entitas);
//         await setDetailDokDataFaktur(resultDetailDataFaktur);
//         const resultDetailDataJurnal: any[] = await DataDetailDokDataJurnal(kode_phu, kode_entitas);
//         await setDetailDokDataJurnal(resultDetailDataJurnal);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Akun Debet
const HandleModalicon = async (
    tipeDialog: string,
    tipe: string,
    setStateDataHeader: Function,
    setDataDaftarAkunDebet: Function,
    setDataDaftarCust: Function,
    kode_entitas: string,
    kode_cust: string,
    setDataDaftarUangMuka: Function,
    args: any,
    setStateDataDetail: Function,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    setDataDaftarSalesman: Function,
    idDokumen: any,
    tipeAdd: any,
    vToken: any
) => {
    if (tipe === 'akunKredit') {
        const resultDaftarAkunDebet: any[] = await DaftarAkunDebet(kode_entitas, tipeDialog);
        await setDataDaftarAkunDebet(resultDaftarAkunDebet);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunDebetVisible: true,
            tipeAkunDialogVisible: tipeDialog,
        }));
        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            rowsIdJurnal: tipeAdd === 'add' ? idDokumen : args.id,
        }));
    } else if (tipe === 'cust') {
        const resultDaftarCust: any[] = await DaftarCust(kode_entitas, vToken);
        await setDataDaftarCust(resultDaftarCust);
        if (args.nodes.length > 0) {
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
                    html: `<p style="font-size:12px">Untuk Mengganti customer, detail alokasi dana harus dikosongkan.</p>`,
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
                        // await setStateDataHeader((prevState: any) => ({
                        //     ...prevState,
                        //     dialogDaftarCustVisible: true,
                        //     tipeCustDialogVisible: tipeDialog,
                        // }));
                    }
                });
            return;
        } else {
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarCustVisible: true,
                tipeCustDialogVisible: tipeDialog,
            }));
        }
    } else if (tipe === 'uangMuka') {
        const resultDaftarUangMuka: any[] = await DaftarUangMuka(kode_entitas, kode_cust);
        await setDataDaftarUangMuka(resultDaftarUangMuka);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarUangMukaVisible: true,
        }));
    } else if (tipe === 'kolektor') {
        const resultDaftarSalesman: any[] = await DaftarSalesman(vToken, kode_entitas, tipeDialog);
        await setDataDaftarSalesman(resultDaftarSalesman);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSalesmanVisible: true,
            tipeSalesmanDialogVisible: tipeDialog,
        }));
        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            rowsIdJurnal: tipeAdd === 'add' ? idDokumen : args.id,
        }));
    } else if (tipe === 'akunSubledger') {
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
                        //     dialogDaftarCustVisible: true,
                        // }));
                    }
                });
            return;
        } else if (resultCekSubledger[0].tipe === 'hutang') {
            const resultDaftarCust: any[] = await DaftarSupplierAll(kode_entitas);
            await setDataDaftarCust(resultDaftarCust);
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarCustVisible: true,
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
// Fungsi untuk Filter Search No Salesman Daftar Salesman
const HandleSearchNoSales = (event: any, setStateDataHeader: Function, setFilteredDataSalesman: Function, dataDaftarSalesman: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoAkun: searchValue,
    }));

    const filteredData = searchDataNoSales(searchValue, dataDaftarSalesman);
    setFilteredDataSalesman(filteredData);

    const searchNamaSales = document.getElementById('searchNamaSales') as HTMLInputElement;
    if (searchNamaSales) {
        searchNamaSales.value = '';
    }
};

const searchDataNoSales = (keyword: any, dataDaftarSalesman: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarSalesman;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarSalesman.filter((item: any) => item.no_sales.toLowerCase().includes(keyword.toLowerCase()));
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
    setDataDaftarAkunDebet: Function,
    kode_entitas: string,
    setFilteredDataAkunDebet: Function,
    dataDaftarAkunDebet: any,
    tipe: string
) => {
    const resultDaftarAkunDebet: any[] = await DaftarAkunDebet(kode_entitas, 'header');
    await setDataDaftarAkunDebet(resultDaftarAkunDebet);
    if (tipe === 'noAkun') {
        await HandleSearchNoAkun(value, setStateDataHeader, setFilteredDataAkunDebet, resultDaftarAkunDebet);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunDebetVisible: true,
            searchNoAkun: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'noAkun',
        }));
    } else {
        await HandleSearchNamaAkun(value, setStateDataHeader, setFilteredDataAkunDebet, resultDaftarAkunDebet);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarAkunDebetVisible: true,
            searchNamaAkun: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'namaAkun',
        }));
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search No Cust
const HandleSearchNoCustomer = (event: any, setStateDataHeader: Function, setFilteredDataCust: Function, dataDaftarCust: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoCust: searchValue,
    }));

    const filteredData = searchDataNoCustomer(searchValue, dataDaftarCust);
    setFilteredDataCust(filteredData);

    const searchNamaCust = document.getElementById('searchNamaCust') as HTMLInputElement;
    if (searchNamaCust) {
        searchNamaCust.value = '';
    }
};

const searchDataNoCustomer = (keyword: any, dataDaftarCust: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarCust;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarCust.filter((item: any) => item.no_cust.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search Nama Cust
const HandleSearchNamaCustomer = (event: any, setStateDataHeader: Function, setFilteredDataCust: Function, dataDaftarCust: any) => {
    console.log('dataDaftarCust = ', setFilteredDataCust, dataDaftarCust);

    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaCust: searchValue,
    }));
    const filteredData = searchDataNamaCustomer(searchValue, dataDaftarCust);
    setFilteredDataCust(filteredData);

    const searchNoCust = document.getElementById('searchNoCust') as HTMLInputElement;
    if (searchNoCust) {
        searchNoCust.value = '';
    }
};

const searchDataNamaCustomer = (keyword: any, dataDaftarCust: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarCust;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarCust.filter((item: any) => item.nama_relasi.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Customer lewat change input
const HandleModalInputCust = async (
    value: string,
    setStateDataHeader: Function,
    setDataDaftarCust: Function,
    kode_entitas: string,
    setFilteredDataCust: Function,
    dataDaftarAkunDebet: any,
    tipe: string,
    vToken: any
) => {
    const resultDaftarCust: any[] = await DaftarCust(kode_entitas, vToken);
    await setDataDaftarCust(resultDaftarCust);
    if (tipe === 'noSupplier') {
        await HandleSearchNoCust(value, setStateDataHeader, setFilteredDataCust, resultDaftarCust);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarCustVisible: true,
            searchNoCust: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'noCust',
        }));
    } else {
        await HandleSearchNamaCust(value, setStateDataHeader, setFilteredDataCust, resultDaftarCust);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarCustVisible: true,
            searchNamaCust: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'namaCust',
        }));
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Customer lewat change input
const HandleModalInputKolektor = async (
    value: string,
    setStateDataHeader: Function,
    setDataDaftarSalesman: Function,
    kode_entitas: string,
    setFilteredDataSalesman: Function,
    dataDaftarAkunDebet: any,
    tipe: string,
    vToken: any
) => {
    const resultDaftarSalesman: any[] = await DaftarSalesman(vToken, kode_entitas, '');
    await setDataDaftarSalesman(resultDaftarSalesman);
    if (tipe === 'namaKolektor') {
        await HandleSearchNamaSales(value, setStateDataHeader, setFilteredDataSalesman, resultDaftarSalesman);
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarSalesmanVisible: true,
            searchNamaSales: value,
            tipeFilterOpen: 'Input',
            tipeFocusOpen: 'namaKolektor',
        }));
    }
};

const HandleSearchNamaSales = (event: any, setStateDataHeader: Function, setFilteredDataSalesman: Function, dataDaftarSalesman: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSales: searchValue,
    }));

    const filteredData = searchDataNamaSales(searchValue, dataDaftarSalesman);
    setFilteredDataSalesman(filteredData);

    const searchNamaSales = document.getElementById('searchNamaSales') as HTMLInputElement;
    if (searchNamaSales) {
        searchNamaSales.value = '';
    }
};

const searchDataNamaSales = (keyword: any, dataDaftarSalesman: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarSalesman;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarSalesman.filter((item: any) => item.nama_sales.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk hapus detail no faktur di dalam rows
const DetailNoFakturDelete = async (gridPpiList: any, swalDialog: any, setDataBarang: Function, setStateDataFooter: Function, setStateDataHeader: Function, stateDataHeader: any) => {
    let currentDetailNoFaktur: any;
    currentDetailNoFaktur = gridPpiList?.getSelectedRecords() || [];
    if (currentDetailNoFaktur.length > 0) {
        if (gridPpiList && Array.isArray(gridPpiList?.dataSource)) {
            const dataSource = [...gridPpiList?.dataSource]; // Salin array
            // Perbarui elemen yang memiliki idAlokasiDana
            dataSource.forEach((item) => {
                if (item.no_fj === currentDetailNoFaktur[0].no_fj) {
                    item.sisa_faktur2 = parseFloat(item.sisa_faktur2) + parseFloat(item.bayar_mu);
                    item.bayar_mu = 0;
                }
            });

            let totPenerimaan: any;
            let totPiutang: any;

            totPenerimaan = dataSource.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.bayar_mu);
            }, 0);
            totPiutang = dataSource.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.owing);
            }, 0);

            setStateDataFooter((prevState: any) => ({
                ...prevState,
                totalPenerimaan: totPenerimaan,
                selisihAlokasiDana: stateDataHeader?.jumlahBayar - totPenerimaan,
                sisaPiutang: totPiutang - totPenerimaan,
            }));

            setStateDataHeader((prevState: any) => ({
                ...prevState,
                disabledResetPembayaran: true,
            }));

            // Perbarui data source grid
            gridPpiList!.dataSource = dataSource;
            setDataBarang({ nodes: dataSource });
            // Refresh grid
            gridPpiList?.refresh();

            console.log('asdasdsaddsasd');
        } else {
            console.error('Grid reference atau data source tidak valid');
        }
        // await setDataBarang((state: any) => {
        //     const newNodes = state.nodes.map((node: any) => {
        //         if (node.no_fj === currentDetailNoFaktur[0].no_fj) {
        //             let bayarMu = node.bayar_mu;
        //             let sisaFaktur;
        //             sisaFaktur = parseFloat(node.sisa_faktur2) + parseFloat(bayarMu);
        //             return {
        //                 ...node,
        //                 sisa_faktur2: sisaFaktur,
        //                 bayar_mu: 0,
        //             };
        //         } else {
        //             return node;
        //         }
        //     });

        //     let totPenerimaan: any;
        //     let totPiutang: any;

        //     totPenerimaan = newNodes.reduce((acc: number, node: any) => {
        //         return acc + parseFloat(node.bayar_mu);
        //     }, 0);
        //     totPiutang = newNodes.reduce((acc: number, node: any) => {
        //         return acc + parseFloat(node.owing);
        //     }, 0);

        //     setStateDataFooter((prevState: any) => ({
        //         ...prevState,
        //         totalPenerimaan: totPenerimaan,
        //         selisihAlokasiDana: stateDataHeader?.jumlahBayar - totPenerimaan,
        //         sisaPiutang: totPiutang - totPenerimaan,
        //     }));

        //     setStateDataHeader((prevState: any) => ({
        //         ...prevState,
        //         disabledResetPembayaran: true,
        //     }));

        //     return {
        //         nodes: newNodes,
        //     };
        // });
    } else {
        document.getElementById('gridPpiList')?.focus();
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
    gridPpiList: any,
    swalDialog: any,
    setDataBarang: Function,
    setStateDataFooter: Function,
    setStateDataHeader: Function,
    stateDataHeader: any,
    setDataJurnal: any
) => {
    let currentDetailNoFaktur: any;
    currentDetailNoFaktur = gridPpiList?.getSelectedRecords() || [];
    document.getElementById('gridPpiList')?.focus();

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
            html: `<p style="font-size:12px">Hapus semua detail pembayaran ?</p>`,
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
                // await setStateDataHeader((prevState: any) => ({
                //     ...prevState,
                //     dialogDaftarCustVisible: true,
                //     tipeCustDialogVisible: tipeDialog,
                // }));
                if (gridPpiList && Array.isArray(gridPpiList.dataSource)) {
                    const dataSource = [...gridPpiList.dataSource]; // Salin array

                    // Perbarui elemen yang memiliki idAlokasiDana
                    dataSource.forEach((item) => {
                        if (item.bayar_mu > 0) {
                            item.sisa_faktur2 = item.bayar_mu;
                            item.bayar_mu = 0; // Set nilai bayar_mu menjadi nol
                        }
                    });

                    let totPenerimaan: any;
                    let totPiutang: any;

                    totPenerimaan = dataSource.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.bayar_mu);
                    }, 0);
                    totPiutang = dataSource.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.owing);
                    }, 0);

                    setStateDataFooter((prevState: any) => ({
                        ...prevState,
                        totalPenerimaan: totPenerimaan,
                        selisihAlokasiDana: stateDataHeader?.jumlahBayar - totPenerimaan,
                        sisaPiutang: totPiutang - totPenerimaan,
                    }));

                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        disabledResetPembayaran: true,
                    }));

                    // Perbarui data source grid
                    gridPpiList.dataSource = dataSource;
                    setDataBarang({ nodes: dataSource });
                    // Refresh grid
                    gridPpiList.refresh();
                } else {
                    console.error('Grid reference atau data source tidak valid');
                }
                // // await setDataBarang((state: any) => ({
                // //     ...state,
                // //     nodes: [],
                // // }));

                // // await setDataBarang((state: any) => {
                // //     const newNodes = state.nodes.map((node: any) => {
                // //         return {
                // //             ...node,
                // //         };
                // //     });

                // //     let totPenerimaan: any;
                // //     let totPiutang: any;

                // //     totPenerimaan = newNodes.reduce((acc: number, node: any) => {
                // //         return acc + parseFloat(node.bayar_mu);
                // //     }, 0);
                // //     totPiutang = newNodes.reduce((acc: number, node: any) => {
                // //         return acc + parseFloat(node.owing);
                // //     }, 0);

                // //     setStateDataFooter((prevState: any) => ({
                // //         ...prevState,
                // //         totalPenerimaan: totPenerimaan,
                // //         selisihAlokasiDana: stateDataHeader?.jumlahBayar - totPenerimaan,
                // //         sisaPiutang: totPiutang - totPenerimaan,
                // //     }));

                // //     setStateDataHeader((prevState: any) => ({
                // //         ...prevState,
                // //         disabledResetPembayaran: true,
                // //     }));

                // //     return {
                // //         nodes: newNodes,
                // //     };
                // });

                withReactContent(swalDialog)
                    .fire({
                        html: `<p style="font-size:12px">Hapus semua jurnal?</p>`,
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
                            await setDataJurnal((state: any) => ({
                                ...state,
                                nodes: [],
                            }));
                        }
                    });
            }
        });
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
    setDataDaftarAkunDebet: Function,
    setDataDaftarCust: Function,
    kodeCustomerValue: any,
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
    setDataDaftarSalesman: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: any,
    editDataJurnal: any,
    vToken: any,
    idJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.bayar_mu === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.bayar_mu);
        }, 0); // ini sama Hutang
        // Tunai, Transfer, Warkat
        if ((modalJenisPembayaran === 'Tunai' || modalJenisPembayaran !== 'Warkat') && namaAkunValue === '') {
            withReactContent(swalDialog)
                .fire({
                    title: '<p style="font-size:12px">Akun Debet belum diisi.</p>',
                    width: '11%',
                    target: '#dialogPhuList',
                    confirmButtonText: 'OK',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        await HandleModalicon(
                            'header',
                            'akunDebet',
                            setStateDataHeader,
                            setDataDaftarAkunDebet,
                            setDataDaftarCust,
                            kode_entitas,
                            kodeCustomerValue,
                            setDataDaftarUangMuka,
                            '',
                            setStateDataDetail,
                            setDataDaftarCustomer,
                            setDataDaftarSubledger,
                            setDataDaftarSalesman,
                            idDokumen,
                            tipeAdd,
                            vToken
                        );
                        await setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunDebetVisible: true,
                        }));
                    }
                });
            return false;
        }

        if (hasEmptyNoFb <= 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (jumlahBayar === '') {
            // Jumlah Bayar sama dengan kredit Rp
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
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
                title: '<p style="font-size:12px">No. Bukti Transfer belum diisi.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (totalJumlahPembayaran === 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Belum ada pembayaran faktur di alokasi dana.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;
        console.log('ssssssssssssssssssssss = ', selisih, stateDataHeader?.kodeAkunHutang);

        const filteredData = dataBarang.nodes.filter((item: any) => item.bayar_mu > 0);
        const noFjList = filteredData.map((item: any) => item.no_fj);
        const catatanNoFaktur = noFjList.join(',');
        const dataJurnalArry = [
            {
                id: 1,
                kode_akun: stateDataHeader?.kodeAkun,
                no_akun: stateDataHeader?.noAkunValue,
                nama_akun: stateDataHeader?.namaAkunValue,
                tipe: stateDataHeader?.tipeAkun,
                isledger: stateDataHeader?.isLedger,
                // kode_subledger: stateDataHeader?.kodeSupplierValue,
                // no_subledger: stateDataHeader?.noSupplierValue,
                // nama_subledger: stateDataHeader?.namaSupplierValue,
                kode_subledger: '',
                no_subledger: '',
                nama_subledger: '',
                subledger: '',
                debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                catatan: 'Dok. ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur ' + catatanNoFaktur + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
            {
                id: 4,
                kode_akun: stateDataHeader?.kodeAkunHutang,
                no_akun: stateDataHeader?.noHutang,
                nama_akun: stateDataHeader?.namaHutang,
                tipe: stateDataHeader?.tipeAkun,
                isledger: stateDataHeader?.isLedger,
                kode_subledger: stateDataHeader?.kodeCustomerValue,
                no_subledger: '',
                nama_subledger: stateDataHeader?.namaCustomerValue,
                subledger: stateDataHeader?.namaCustomerValue,
                debet_rp: 0,
                kredit_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran * -1,
                catatan: 'Dok. ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur ' + catatanNoFaktur + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
        ];

        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);
        let dataJurnalPembulatan: any;
        if (selisih < 0) {
            if (selisih >= -1000) {
                dataJurnalPembulatan = [
                    {
                        id: 2,
                        kode_akun: quSetting[0].kode_akun_bebbulat,
                        no_akun: quSetting[0].no_beban_bulat,
                        nama_akun: quSetting[0].nama_beban_bulat,
                        tipe: quSetting[0].tipe_beban_bulat,

                        kode_subledger: '',
                        no_subledger: '',
                        nama_subledger: '',
                        subledger: '',
                        debet_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        kode_jual: '',
                        nama_jual: '',
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
                        debet_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        kode_jual: '',
                        nama_jual: '',
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
                        debet_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        kode_jual: '',
                        nama_jual: '',
                    },
                ];
            }

            if (masterDataState === 'BARU') {
                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));
                console.log('dataJurnalArry 1 = ', dataJurnalArry);
            } else {
                console.log('dataJurnalArry 1 = ', dataJurnalArry);
                // await setDataJurnal({ nodes: editDataJurnal });

                await setDataJurnal({ nodes: dataJurnalArry });
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));
            }
        } else {
            if (selisih > 0) {
                if (selisih <= 1000) {
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
                            // kredit_rp: selisih >= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                            kredit_rp: selisih >= 1000 ? stateDataHeader?.kursValue * 1000 : stateDataHeader?.kursValue * selisih,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= 1000 ? stateDataHeader?.kursValue * 1000 * -1 : stateDataHeader?.kursValue * selisih * -1,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                            kode_jual: '',
                            nama_jual: '',
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
                            kredit_rp: selisih >= 1000 ? stateDataHeader?.kursValue * (selisih - selisih + 1000) : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * (selisih - selisih + 1000) * -1 : stateDataHeader?.kursValue * 1000 * -1,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                            kode_jual: '',
                            nama_jual: '',
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
                            debet_rp: stateDataHeader?.kursValue * selisih - 1000,
                            kredit_rp: 0,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                            kode_jual: '',
                            nama_jual: '',
                        },
                    ];
                }
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));
                    console.log('dataJurnalArry 2 = ', dataJurnalArry);
                } else {
                    // await setDataJurnal({ nodes: editDataJurnal });
                    console.log('dataJurnalArry 2 = ', dataJurnalArry);
                    await setDataJurnal({ nodes: dataJurnalArry });
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));
                }
            } else {
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    console.log('dataJurnalArry 3 = ', dataJurnalArry);
                } else {
                    // await setDataJurnal({ nodes: editDataJurnal });
                    console.log('dataJurnalArry 3 = ', dataJurnalArry);
                    await setDataJurnal({ nodes: dataJurnalArry });
                }
            }
        }

        await GenerateTotalJurnal(dataJurnal, setDataJurnal, setStateDataDetail);
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
            await hapusEntriJurnal(setDataJurnal, currentDetailJurnal[0].id, setStateDataDetail, dataJurnal, currentDetailJurnal, gridJurnalList.dataSource, idJurnal);
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
    setDataDaftarSalesman: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: any,
    editDataJurnal: any,
    vToken: any,
    idJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.bayar_mu === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.bayar_mu);
        }, 0); // ini sama Hutang
        // Tunai, Transfer, Warkat

        const filteredNoFj = dataBarang.nodes
            .filter((item: any) => item.bayar_mu > 0)
            .map((item: any) => item.no_fj)
            .join(',');

        if (hasEmptyNoFb <= 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (jumlahBayar === '') {
            // Jumlah Bayar sama dengan kredit Rp
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
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
                title: '<p style="font-size:12px">No. Warkat belum diisi.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (totalJumlahPembayaran === 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Belum ada pembayaran faktur di alokasi dana.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;
        const dataJurnalArry = [
            {
                id: 1,
                kode_akun: stateDataHeader?.kodeAkunPiutangBg,
                no_akun: stateDataHeader?.noAkunPiutangBg,
                nama_akun: stateDataHeader?.namaAkunPiutangBg,
                tipe: stateDataHeader?.tipeAkunPiutangBg,

                kode_subledger: stateDataHeader?.kodeCustomerValue,
                no_subledger: stateDataHeader?.noCustomerValue,
                nama_subledger: stateDataHeader?.namaCustomerValue,
                subledger: stateDataHeader?.noCustomerValue + '-' + stateDataHeader?.namaCustomerValue,
                // debet_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                // jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran,
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                // catatan: stateDataHeader?.namaPiutang + ' atas : ' + stateDataHeader?.namaCustomerValue, noDokumenValue
                catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
            {
                id: 4,
                kode_akun: stateDataHeader?.kodeAkunPiutang,
                no_akun: stateDataHeader?.noPiutang,
                nama_akun: stateDataHeader?.namaPiutang,
                tipe: stateDataHeader?.tipePiutang,
                kode_subledger: stateDataHeader?.kodeCustomerValue,
                no_subledger: stateDataHeader?.noCustomerValue,
                nama_subledger: stateDataHeader?.namaCustomerValue,
                subledger: stateDataHeader?.noCustomerValue + '-' + stateDataHeader?.namaCustomerValue,
                debet_rp: 0,
                // kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kredit_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                // jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran * -1,
                catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
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
                        kredit_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000 * -1,
                        // catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                        kode_jual: '',
                        nama_jual: '',
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
                        kredit_rp: selisih >= 1000 ? stateDataHeader?.kursValue * (selisih - selisih + 1000) : stateDataHeader?.kursValue * 1000,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * (selisih - selisih + 1000) * -1 : stateDataHeader?.kursValue * 1000 * -1,
                        catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                        kode_jual: '',
                        nama_jual: '',
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
                        debet_rp: stateDataHeader?.kursValue * selisih - 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
                        catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                        kode_jual: '',
                        nama_jual: '',
                    },
                ];
            }
            if (masterDataState === 'BARU') {
                await setDataJurnal({ nodes: dataJurnalArry });
                gridJurnalList.dataSource = dataJurnalArry;
                await setDataJurnal((prevState: any) => ({
                    nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                }));
                gridJurnalList.dataSource = [...dataJurnal.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);
            } else {
                await setDataJurnal({ nodes: editDataJurnal });
                gridJurnalList.dataSource = editDataJurnal;
            }
        } else {
            if (selisih < 0) {
                if (selisih >= -1000) {
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
                            debet_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kredit_rp: 0,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                            kode_jual: '',
                            nama_jual: '',
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
                            debet_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kredit_rp: 0,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                            kode_jual: '',
                            nama_jual: '',
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
                            debet_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                            kredit_rp: 0,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                            catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                            kode_jual: '',
                            nama_jual: '',
                        },
                    ];
                }
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    gridJurnalList.dataSource = dataJurnalArry;
                    await setDataJurnal((prevState: any) => ({
                        nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
                    }));
                    gridJurnalList.dataSource = [...dataJurnal.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);
                } else {
                    await setDataJurnal({ nodes: editDataJurnal });
                    gridJurnalList.dataSource = editDataJurnal;
                }
            } else {
                if (masterDataState === 'BARU') {
                    await setDataJurnal({ nodes: dataJurnalArry });
                    gridJurnalList.dataSource = dataJurnalArry;
                } else {
                    await setDataJurnal({ nodes: editDataJurnal });
                    gridJurnalList.dataSource = editDataJurnal;
                }
            }
        }
        // await setDataJurnal({ nodes: dataJurnalArry });
        // await setDataJurnal((prevState: any) => ({
        //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        // }));
        await GenerateTotalJurnal(dataJurnal, setDataJurnal, setStateDataDetail);
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
            await hapusEntriJurnal(setDataJurnal, currentDetailJurnal[0].id, setStateDataDetail, dataJurnal, currentDetailJurnal, gridJurnalList.dataSource, idJurnal);
        }
    }
};

const DetailNoFakturJurnalPencairanWarkat = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunDebet: Function,
    setDataDaftarCust: Function,
    kodeCustomerValue: any,
    setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    modalJenisPenerimaan: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    setDataDaftarSalesman: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: string,
    editDataJurnal: any,
    vToken: any,
    idJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.bayar_mu === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.bayar_mu);
        }, 0); // ini sama Hutang

        const filteredNoFj = dataBarang.nodes
            .filter((item: any) => item.bayar_mu > 0)
            .map((item: any) => item.no_fj)
            .join(',');

        // Tunai, Transfer, Warkat
        if ((modalJenisPenerimaan === 'Tunai' || modalJenisPenerimaan !== 'Warkat') && namaAkunValue === '') {
            withReactContent(swalDialog)
                .fire({
                    title: '<p style="font-size:12px">Akun Debet belum diisi.</p>',
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
                            setDataDaftarAkunDebet,
                            setDataDaftarCust,
                            kode_entitas,
                            kodeCustomerValue,
                            setDataDaftarUangMuka,
                            '',
                            setStateDataDetail,
                            setDataDaftarCustomer,
                            setDataDaftarSubledger,
                            setDataDaftarSalesman,
                            idDokumen,
                            tipeAdd,
                            vToken
                        );
                        await setStateDataHeader((prevState: any) => ({
                            ...prevState,
                            dialogDaftarAkunDebetVisible: true,
                        }));
                    }
                });
            return false;
        }

        if (hasEmptyNoFb <= 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (jumlahBayar === '') {
            // Jumlah Bayar sama dengan kredit Rp
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Alokasi dana belum diisi.</p>',
                width: '15%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
            if (jumlahBayar) {
                jumlahBayar.focus();
            }
            return false;
        }

        if (modalJenisPenerimaan === 'Transfer' && (stateDataHeader?.noBuktiTransfer === '' || stateDataHeader?.noBuktiTransfer === null || stateDataHeader?.noBuktiTransfer === undefined)) {
            // nanti ditambahkan no_warkat
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">No. Bukti Transfer belum diisi.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        if (totalJumlahPembayaran === 0) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Belum ada pembayaran faktur di alokasi dana.</p>',
                width: '16%',
                target: '#dialogPhuList',
                confirmButtonText: 'OK',
            });
            return false;
        }

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;
        const dataJurnalArry = [
            {
                id: 101,
                kode_akun: stateDataHeader?.kodeAkun,
                no_akun: stateDataHeader?.noAkunValue,
                nama_akun: stateDataHeader?.namaAkunValue,
                tipe: stateDataHeader?.tipeAkun,
                isledger: stateDataHeader?.isLedger,
                // kode_subledger: stateDataHeader?.kodeSupplierValue,
                // no_subledger: stateDataHeader?.noSupplierValue,
                // nama_subledger: stateDataHeader?.namaSupplierValue,
                kode_subledger: '',
                no_subledger: '',
                nama_subledger: '',
                subledger: '',
                // debet_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                debet_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                // jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran,
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                // catatan: stateDataHeader?.namaPiutang + ' atas : ' + stateDataHeader?.namaCustomerValue, noDokumenValue
                catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
            {
                id: 104,
                kode_akun: stateDataHeader?.kodeAkunPiutangBg,
                no_akun: stateDataHeader?.noAkunPiutangBg,
                nama_akun: stateDataHeader?.namaAkunPiutangBg,
                tipe: stateDataHeader?.tipeAkunPiutangBg,

                kode_subledger: stateDataHeader?.kodeCustomerValue,
                no_subledger: stateDataHeader?.noCustomerValue,
                nama_subledger: stateDataHeader?.namaCustomerValue,
                subledger: stateDataHeader?.noCustomerValue + '-' + stateDataHeader?.namaCustomerValue,
                debet_rp: 0,
                kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
        ];
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);
        let dataJurnalPembulatan: any;
        // if (selisih > 0) {
        //     if (selisih <= 1000) {
        //         dataJurnalPembulatan = [
        //             {
        //                 id: 102,
        //                 kode_akun: quSetting[0].kode_akun_bebbulat,
        //                 no_akun: quSetting[0].no_beban_bulat,
        //                 nama_akun: quSetting[0].nama_beban_bulat,
        //                 tipe: quSetting[0].tipe_beban_bulat,
        //                 // kode_subledger: stateDataHeader?.kodeSupplierValue,
        //                 // no_subledger: stateDataHeader?.noSupplierValue,
        //                 // nama_subledger: stateDataHeader?.namaSupplierValue,
        //                 kode_subledger: '',
        //                 no_subledger: '',
        //                 nama_subledger: '',
        //                 subledger: '',
        //                 debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
        //                 kredit_rp: 0,
        //                 kurs: stateDataHeader?.kursValue,
        //                 mu: 'IDR',
        //                 departemen: '',
        //                 kode_dept: '',
        //                 jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
        //                 // catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_beban_bulat,
        //                 catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                 kode_jual: '',
        //                 nama_jual: '',
        //             },
        //         ];
        //     } else {
        //         dataJurnalPembulatan = [
        //             {
        //                 id: 102,
        //                 kode_akun: quSetting[0].kode_akun_bebbulat,
        //                 no_akun: quSetting[0].no_beban_bulat,
        //                 nama_akun: quSetting[0].nama_beban_bulat,
        //                 tipe: quSetting[0].tipe_beban_bulat,
        //                 // kode_subledger: stateDataHeader?.kodeSupplierValue,
        //                 // no_subledger: stateDataHeader?.noSupplierValue,
        //                 // nama_subledger: stateDataHeader?.namaSupplierValue,
        //                 kode_subledger: '',
        //                 no_subledger: '',
        //                 nama_subledger: '',
        //                 subledger: '',
        //                 debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
        //                 kredit_rp: 0,
        //                 kurs: stateDataHeader?.kursValue,
        //                 mu: 'IDR',
        //                 departemen: '',
        //                 kode_dept: '',
        //                 jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
        //                 // catatan: 'Pembulatan atas : ' + stateDataHeader?.namaCustomerValue + ' dengan ' + quSetting[0].nama_beban_bulat,
        //                 catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                 kode_jual: '',
        //                 nama_jual: '',
        //             },
        //             {
        //                 id: 103,
        //                 kode_akun: quSetting[0].kode_akun_bebbulat,
        //                 no_akun: quSetting[0].no_beban_bulat,
        //                 nama_akun: quSetting[0].nama_beban_bulat,
        //                 tipe: quSetting[0].tipe_beban_bulat,
        //                 // kode_subledger: stateDataHeader?.kodeSupplierValue,
        //                 // no_subledger: stateDataHeader?.noSupplierValue,
        //                 // nama_subledger: stateDataHeader?.namaSupplierValue,
        //                 kode_subledger: '',
        //                 no_subledger: '',
        //                 nama_subledger: '',
        //                 subledger: '',
        //                 debet_rp: stateDataHeader?.kursValue * selisih - 1000,
        //                 kredit_rp: 0,
        //                 kurs: stateDataHeader?.kursValue,
        //                 mu: 'IDR',
        //                 departemen: '',
        //                 kode_dept: '',
        //                 jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
        //                 // catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                 catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                 kode_jual: '',
        //                 nama_jual: '',
        //             },
        //         ];
        //     }
        //     await setDataJurnal({ nodes: dataJurnalArry });
        //     await setDataJurnal((prevState: any) => ({
        //         nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        //     }));
        // } else {
        //     if (selisih < 0) {
        //         if (selisih >= -1000) {
        //             dataJurnalPembulatan = [
        //                 {
        //                     id: 102,
        //                     kode_akun: quSetting[0].kode_akun_pendbulat,
        //                     no_akun: quSetting[0].no_pend_bulat,
        //                     nama_akun: quSetting[0].nama_pend_bulat,
        //                     tipe: quSetting[0].tipe_pend_bulat,
        //                     // kode_subledger: stateDataHeader?.kodeSupplierValue,
        //                     // no_subledger: stateDataHeader?.noSupplierValue,
        //                     // nama_subledger: stateDataHeader?.namaSupplierValue,
        //                     kode_subledger: '',
        //                     no_subledger: '',
        //                     nama_subledger: '',
        //                     subledger: '',
        //                     debet_rp: 0,
        //                     kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
        //                     kurs: stateDataHeader?.kursValue,
        //                     mu: 'IDR',
        //                     departemen: '',
        //                     kode_dept: '',
        //                     jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
        //                     // catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                     catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                     kode_jual: '',
        //                     nama_jual: '',
        //                 },
        //             ];
        //         } else {
        //             dataJurnalPembulatan = [
        //                 {
        //                     id: 102,
        //                     kode_akun: quSetting[0].kode_akun_pendbulat,
        //                     no_akun: quSetting[0].no_pend_bulat,
        //                     nama_akun: quSetting[0].nama_pend_bulat,
        //                     tipe: quSetting[0].tipe_pend_bulat,
        //                     // kode_subledger: stateDataHeader?.kodeSupplierValue,
        //                     // no_subledger: stateDataHeader?.noSupplierValue,
        //                     // nama_subledger: stateDataHeader?.namaSupplierValue,
        //                     kode_subledger: '',
        //                     no_subledger: '',
        //                     nama_subledger: '',
        //                     subledger: '',
        //                     debet_rp: 0,
        //                     kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
        //                     kurs: stateDataHeader?.kursValue,
        //                     mu: 'IDR',
        //                     departemen: '',
        //                     kode_dept: '',
        //                     jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
        //                     // catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                     catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                     kode_jual: '',
        //                     nama_jual: '',
        //                 },
        //                 {
        //                     id: 103,
        //                     kode_akun: quSetting[0].kode_akun_pendbulat,
        //                     no_akun: quSetting[0].no_pend_bulat,
        //                     nama_akun: quSetting[0].nama_pend_bulat,
        //                     tipe: quSetting[0].tipe_pend_bulat,
        //                     // kode_subledger: stateDataHeader?.kodeSupplierValue,
        //                     // no_subledger: stateDataHeader?.noSupplierValue,
        //                     // nama_subledger: stateDataHeader?.namaSupplierValue,
        //                     kode_subledger: '',
        //                     no_subledger: '',
        //                     nama_subledger: '',
        //                     subledger: '',
        //                     debet_rp: 0,
        //                     kredit_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
        //                     kurs: stateDataHeader?.kursValue,
        //                     mu: 'IDR',
        //                     departemen: '',
        //                     kode_dept: '',
        //                     jumlah_mu: stateDataHeader?.kursValue * selisih + 1000,
        //                     // catatan: 'Dok ' + stateDataHeader?.noDokumenValue + ' Untuk Faktur : ' + filteredNoFj + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                     catatan: 'Pencairan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
        //                     kode_jual: '',
        //                     nama_jual: '',
        //                 },
        //             ];
        //         }
        //         await setDataJurnal({ nodes: dataJurnalArry });
        //         await setDataJurnal((prevState: any) => ({
        //             nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        //         }));
        //     } else {
        //         await setDataJurnal({ nodes: dataJurnalArry });
        //     }
        // }
        await setDataJurnal({ nodes: dataJurnalArry });
        // await setDataJurnal((prevState: any) => ({
        //     nodes: [...prevState.nodes, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id),
        // }));
        await GenerateTotalJurnal(dataJurnal, setDataJurnal, setStateDataDetail);
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
            await hapusEntriJurnal(setDataJurnal, currentDetailJurnal[0].id, setStateDataDetail, dataJurnal, currentDetailJurnal, gridJurnalList.dataSource, idJurnal);
        }
    }
};

const DetailNoFakturJurnalPenolakanWarkat = async (
    tipe: string,
    kode_entitas: string,
    // namaAkunValue: any,
    // setStateDataHeader: Function,
    // setDataDaftarAkunKredit: Function,
    // setDataDaftarSupplier: Function,
    // kodeSupplierValue: any,
    // setDataDaftarUangMuka: Function,
    dataBarang: any,
    jumlahBayar: any,
    // modalJenisPembayaran: any,
    setDataJurnal: Function,
    stateDataHeader: any,
    // gridJurnalList: any,
    setStateDataDetail: Function,
    dataJurnal: any,
    // setStateDataDetail: any,
    // setDataDaftarCustomer: Function,
    // setDataDaftarSubledger: Function,
    // idDokumen: any,
    // tipeAdd: any,
    // masterDataState: string,
    // editDataJurnal: any
    token: any,
    idJurnal: any
) => {
    if (tipe === 'autoJurnal') {
        const hasEmptyNoFb = dataBarang.nodes.length;
        const isNoZeroJumPembayaran = dataBarang.nodes.every((node: any) => node.jumlah_pembayaran === 0);
        const totalJumlahPembayaran = dataBarang.nodes.reduce((total: any, item: any) => {
            return total + parseFloat(item.bayar_mu);
        }, 0); // ini sama Hutang

        // Tunai, Transfer, Warkat

        const selisih = (jumlahBayar === '' ? 0 : jumlahBayar) - totalJumlahPembayaran;

        const dataJurnalArry = [
            {
                id: 201,
                kode_akun: stateDataHeader?.kodeAkunPiutang,
                no_akun: stateDataHeader?.noPiutang,
                nama_akun: stateDataHeader?.namaPiutang,
                tipe: stateDataHeader?.tipePiutang,
                kode_subledger: stateDataHeader?.kodeCustomerValue,
                no_subledger: stateDataHeader?.noCustomerValue,
                nama_subledger: stateDataHeader?.namaCustomerValue,
                subledger: stateDataHeader?.noCustomerValue + '-' + stateDataHeader?.namaCustomerValue,
                debet_rp: stateDataHeader?.kursValue * totalJumlahPembayaran,
                kredit_rp: 0,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * totalJumlahPembayaran,
                catatan: 'Penolakan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
            {
                id: 204,
                kode_akun: stateDataHeader?.kodeAkunPiutangBg,
                no_akun: stateDataHeader?.noAkunPiutangBg,
                nama_akun: stateDataHeader?.namaAkunPiutangBg,
                tipe: stateDataHeader?.tipeAkunPiutangBg,
                kode_subledger: stateDataHeader?.kodeCustomerValue,
                no_subledger: stateDataHeader?.noCustomerValue,
                nama_subledger: stateDataHeader?.namaCustomerValue,
                subledger: stateDataHeader?.noCustomerValue + '-' + stateDataHeader?.namaCustomerValue,
                debet_rp: 0,
                kredit_rp: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar,
                kurs: stateDataHeader?.kursValue,
                mu: 'IDR',
                departemen: '',
                kode_dept: '',
                jumlah_mu: stateDataHeader?.kursValue * stateDataHeader?.jumlahBayar * -1,
                catatan: 'Penolakan Piutang Warkat ' + stateDataHeader?.noWarkat + ' Dengan Bukti : ' + stateDataHeader?.noDokumenValue + ' Oleh ' + stateDataHeader?.namaCustomerValue,
                kode_jual: '',
                nama_jual: '',
            },
        ];
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
        const quSetting = await fetchPreferensi(kode_entitas, apiUrl);

        let dataJurnalPembulatan: any;
        if (selisih > 0) {
            if (selisih <= 1000) {
                dataJurnalPembulatan = [
                    {
                        id: 202,
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
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        kode_jual: '',
                        nama_jual: '',
                    },
                ];
            } else {
                dataJurnalPembulatan = [
                    {
                        id: 202,
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
                        debet_rp: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: selisih <= 1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        kode_jual: '',
                        nama_jual: '',
                    },
                    {
                        id: 203,
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
                        debet_rp: stateDataHeader?.kursValue * selisih - 1000,
                        kredit_rp: 0,
                        kurs: stateDataHeader?.kursValue,
                        mu: 'IDR',
                        departemen: '',
                        kode_dept: '',
                        jumlah_mu: stateDataHeader?.kursValue * selisih - 1000,
                        catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_beban_bulat,
                        kode_jual: '',
                        nama_jual: '',
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
                            id: 202,
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
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                            kode_jual: '',
                            nama_jual: '',
                        },
                    ];
                } else {
                    dataJurnalPembulatan = [
                        {
                            id: 202,
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
                            debet_rp: 0,
                            kredit_rp: selisih >= -1000 ? stateDataHeader?.kursValue * selisih * -1 : stateDataHeader?.kursValue * 1000,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: selisih >= -1000 ? stateDataHeader?.kursValue * selisih : stateDataHeader?.kursValue * 1000 * -1,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                            kode_jual: '',
                            nama_jual: '',
                        },
                        {
                            id: 203,
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
                            debet_rp: 0,
                            kredit_rp: (stateDataHeader?.kursValue * selisih + 1000) * -1,
                            kurs: stateDataHeader?.kursValue,
                            mu: 'IDR',
                            departemen: '',
                            kode_dept: '',
                            jumlah_mu: stateDataHeader?.kursValue * selisih + 1000,
                            catatan: 'Pembulatan atas : ' + stateDataHeader?.namaSupplierValue + ' dengan ' + quSetting[0].nama_pend_bulat,
                            kode_jual: '',
                            nama_jual: '',
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
        await GenerateTotalJurnal(dataJurnal, setDataJurnal, setStateDataDetail);
        return true;
    }
};

const AutoJurnalSimpan = async (
    tipe: string,
    kode_entitas: string,
    namaAkunValue: any,
    setStateDataHeader: Function,
    setDataDaftarAkunDebet: Function,
    setDataDaftarCust: Function,
    kodeCustomerValue: any,
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
    setDataDaftarSalesman: Function,
    idDokumen: any,
    tipeAdd: any,
    masterDataState: string,
    editDataJurnal: any,
    vToken: any,
    idJurnal: any
) => {
    const ResDetailNoFakturJurnal = await DetailNoFakturJurnal(
        'autoJurnal',
        kode_entitas,
        stateDataHeader?.namaAkunValue,
        setStateDataHeader,
        setDataDaftarAkunDebet,
        setDataDaftarCust,
        stateDataHeader?.kodeCustomerValue,
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
        setDataDaftarSalesman,
        idDokumen,
        tipeAdd,
        masterDataState,
        editDataJurnal,
        vToken,
        idJurnal
    );

    return ResDetailNoFakturJurnal;

    // return dataJurnal;
};

const hitungSelisih = (nodes: any[], currentDetailJurnal: any, setStateDataDetail: Function) => {
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

const hapusEntriJurnal = async (setDataJurnal: Function, nodeId: string, setStateDataDetail: Function, dataJurnal: any, currentDetailJurnal: any, gridJurnalList: any, idJurnal: any) => {
    // Check if dataSource exists and is an array before proceeding
    if (Array.isArray(gridJurnalList)) {
        // Filter the gridJurnalList dataSource to remove the entry with the matching idJurnal
        const updatedDataSource = gridJurnalList.filter((item: any) => item.id !== idJurnal);

        // Update the dataSource of gridJurnalList
        gridJurnalList = updatedDataSource;
    }

    await setDataJurnal((state: any) => {
        const newNodes = state.nodes.filter((node: any) => node.id !== nodeId);
        const selisih = hitungSelisih(newNodes, currentDetailJurnal, setStateDataDetail);
        return {
            ...state,
            nodes: newNodes,
        };
    });

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

// const HandleRowSelectedJurnal = (args: any, setStateDataDetail: Function) => {
//     console.log('Id = ' + args.data.id);
//     setStateDataDetail((prevState: any) => ({
//         ...prevState,
//         rowsIdJurnal: args.data.id,
//     }));
// };

const GenerateTotalJurnalEdit = async (dataJurnal: any, setDataJurnal: Function, setStateDataDetail: Function) => {
    const newNodes = dataJurnal.map((node: any) => {
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
        totalSelisih: totalKredit - totalDebet,
    }));

    setDataJurnal({ nodes: newNodes });
};

const GenerateTotalJurnal = async (dataJurnal: any, setDataJurnal: Function, setStateDataDetail: Function) => {
    // const newNodes = dataJurnal.nodes.map((node: any) => {
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
            totalSelisih: totalKredit - totalDebet,
        }));

        return {
            nodes: newNodes,
        };
    });
};

//==================================================================================================

// //==================================================================================================
// // Fungsi Terbilang nilai
// const Terbilang = (number: number): string => {
//     const huruf = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
//     const belasan = ['sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
//     const puluhan = ['', 'sepuluh', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];

//     if (number < 10) {
//         return huruf[number];
//     } else if (number < 20) {
//         return belasan[number - 10]; // Ini sudah benar, mengembalikan 'sebelas' untuk 11
//     } else if (number < 100) {
//         return puluhan[Math.floor(number / 10)] + ' ' + huruf[number % 10];
//     } else if (number < 200) {
//         return 'seratus ' + Terbilang(number - 100);
//     } else if (number < 1000) {
//         return huruf[Math.floor(number / 100)] + ' ratus ' + Terbilang(number % 100);
//     } else if (number < 2000) {
//         return 'seribu ' + Terbilang(number - 1000);
//     } else if (number < 1000000) {
//         return Terbilang(Math.floor(number / 1000)) + ' ribu ' + Terbilang(number % 1000);
//     } else if (number < 1000000000) {
//         return Terbilang(Math.floor(number / 1000000)) + ' juta ' + Terbilang(number % 1000000);
//     } else if (number < 1000000000000) {
//         return Terbilang(Math.floor(number / 1000000000)) + ' milyar ' + Terbilang(number % 1000000000);
//     } else if (number < 1000000000000000) {
//         return Terbilang(Math.floor(number / 10000000000001000000000)) + ' triliun ' + Terbilang(number % 1000000000000);
//     }
//     return '';
// };
// //==================================================================================================

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
const HandleSearchNoCust = (event: any, setStateDataHeader: Function, setFilteredDataCust: Function, dataDaftarCust: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoCust: searchValue,
    }));

    const filteredData = searchDataNoCust(searchValue, dataDaftarCust);
    setFilteredDataCust(filteredData);

    const searchNamaCust = document.getElementById('searchNamaCust') as HTMLInputElement;
    if (searchNamaCust) {
        searchNamaCust.value = '';
    }
};

const searchDataNoCust = (keyword: any, dataDaftarCust: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarCust;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarCust.filter((item: any) => item.no_cust.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};

// ini digunakan untuk filter nama cust
const HandleSearchNamaCust = (event: any, setStateDataHeader: Function, setFilteredDataCust: Function, dataDaftarCust: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaCust: searchValue,
    }));
    const filteredData = searchDataNamaCust(searchValue, dataDaftarCust);
    setFilteredDataCust(filteredData);

    const searchNoCust = document.getElementById('searchNoCust') as HTMLInputElement;
    if (searchNoCust) {
        searchNoCust.value = '';
    }
};

const searchDataNamaCust = (keyword: any, dataDaftarCust: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDaftarCust;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDaftarCust.filter((item: any) => item.nama_relasi.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
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
    const tglMinusSatu = moment(transaction).format('YYYY-MM-DD') > moment(yesterday).format('YYYY-MM-DD') && moment(transaction).format('YYYY-MM-DD') < moment(today).format('YYYY-MM-DD');
    return tglMinusSatu;
};

// End
// =================================================================================

// =================================================================================
// Cek Tanggal Minus Satu untuk pengecekan tgl dokumen pada saat input

const CekTglBackDate = async (tglDok: any) => {
    // pengecekan tanggal kurang 1 hari dari hari ini
    // Dapatkan tanggal hari ini
    const tglDokumen = moment(tglDok).format('YYYY-MM-DD');
    const today = new Date();

    // Kurangi 1 hari dari tanggal hari ini
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate());

    // Ubah tanggal transaksi menjadi objek Date
    const transaction = new Date(tglDokumen);

    // Bandingkan tanggal transaksi dengan tanggal yang telah dikurangi 1 hari
    const tglMinusSatu = moment(transaction).format('YYYY-MM-DD') < moment(yesterday).format('YYYY-MM-DD') && moment(transaction).format('YYYY-MM-DD') < moment(today).format('YYYY-MM-DD');
    return tglMinusSatu;
};

// End
// =================================================================================

// =================================================================================
// Cek Tanggal Plus Tiga untuk pengecekan tgl dokumen pada saat input

const CekTglPlus3 = async (tglDok: any) => {
    // pengecekan tanggal plus 3 hari dari hari ini
    // Dapatkan tanggal hari ini
    const tglDokumen = moment(tglDok).format('YYYY-MM-DD');
    const today = new Date();

    // Kurangi 1 hari dari tanggal hari ini
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() + 3);

    // Ubah tanggal transaksi menjadi objek Date
    const transaction = new Date(tglDokumen);

    // Bandingkan tanggal transaksi dengan tanggal yang telah dikurangi 1 hari

    const tglMinusSatu = moment(transaction).format('YYYY-MM-DD') === moment(yesterday).format('YYYY-MM-DD');
    return tglMinusSatu;
};

// End
// =================================================================================

// =================================================================================
// Cek Tanggal Plus 14 untuk pengecekan tgl dokumen pada saat input

const CekTglPlus14 = async (tglDok: any) => {
    // pengecekan tanggal plus 3 hari dari hari ini
    // Dapatkan tanggal hari ini
    const tglDokumen = moment(tglDok).format('YYYY-MM-DD');
    const today = new Date();

    // Kurangi 1 hari dari tanggal hari ini
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() + 14);

    // Ubah tanggal transaksi menjadi objek Date
    const transaction = new Date(tglDokumen);

    // Bandingkan tanggal transaksi dengan tanggal yang telah dikurangi 1 hari
    const tglMinusSatu = moment(transaction).format('YYYY-MM-DD') === moment(yesterday).format('YYYY-MM-DD');
    return tglMinusSatu;
};

// End
// =================================================================================

// // =================================================================================
// // Cek Periode Akuntasi
// const CekPeriodeAkutansi = async (ets: string, stateDataHeader: any) => {
//     try {
//         const result = await GetInfo(ets);
//         const getInfo = result[0].periode;
//         const periode = getInfo;
//         const tanggalMomentPeriode = moment(periode, 'YYYYMM');
//         const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');
//         console.log('periodeTahunBulan = ', periodeTahunBulan, ' tanggalMomentPeriode =', tanggalMomentPeriode);

//         const tglPembanding = moment(stateDataHeader?.tglDokumen).format('YYYYMM');

//         // Mendapatkan tahun dan bulan dari setiap tanggal
//         const yearA = parseInt(periodeTahunBulan.substring(0, 4));
//         const monthA = parseInt(periodeTahunBulan.substring(4, 6));

//         const yearB = parseInt(tglPembanding.substring(0, 4));
//         const monthB = parseInt(tglPembanding.substring(4, 6));

//         return { yearA, monthA, yearB, monthB, periode };
//     } catch (error) {
//         console.error('Error:', error);
//         return null; // Kembalikan null jika terjadi kesalahan
//     }
// };

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
const HandleCariNoFj = (event: any, setStateDataDetail: Function, setFilteredDataBarang: Function, dataBarang: any) => {
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNoFj: event,
    }));

    const filteredData = searchDataNoFJAlokasiDana(event, dataBarang.nodes);
    setFilteredDataBarang(filteredData);
};

const searchDataNoFJAlokasiDana = (keyword: any, dataBarang: any) => {
    if (keyword === '') {
        return dataBarang;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataBarang.filter((item: any) => item.no_fj.toLowerCase().includes(keyword.toLowerCase()));
        return filteredData;
    }
};

// End
// =================================================================================

// // =================================================================================
// // Handle Input Keterangan
// const HandleKeterangan = (value: any, setStateDataFooter: Function) => {
//     setStateDataFooter((prevState: any) => ({
//         ...prevState,
//         vKeterangan: value,
//     }));
// };
// // End
// // =================================================================================

// =================================================================================
// Fungsi untuk format nilai jumlah di header
const FormatNilaiJumlah = async (event: any, setStateDataHeader: Function, setDataBarang: Function, setStateDataFooter: Function) => {
    console.log('event = ', event);

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
        console.log('nilaiDefault = ', nilaiDefault);

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

        let totPenerimaan: any;
        await setDataBarang((state: any) => {
            const newNodes = state.nodes.map((node: any) => {
                return {
                    ...node,
                };
            });

            totPenerimaan = newNodes.reduce((acc: number, node: any) => {
                return acc + parseFloat(node.bayar_mu);
            }, 0);

            return {
                nodes: newNodes,
            };
        });

        const selisihAlokasiDana = parseFloat(nilaiDefault) - parseFloat(totPenerimaan);

        await setStateDataFooter((prevState: any) => ({
            ...prevState,
            selisihAlokasiDana: selisihAlokasiDana,
        }));
    }
};

// End
// =================================================================================

// // =================================================================================
// // Fungsi yang digunakan untuk tombol di bawah jumlah dengan kondisi reset pembayaran
// const ResetPembayaran = async (setDataBarang: Function, setStateDataFooter: Function, setStateDataHeader: Function, jumlahBayar: any) => {
//     await setDataBarang((state: any) => {
//         const newNodes = state.nodes.map((node: any) => {
//             let jumlahPembayaran = node.bayar_mu;
//             let sisaPembayaran;

//             sisaPembayaran = parseFloat(node.sisa_faktur2) + parseFloat(jumlahPembayaran);
//             return {
//                 ...node,
//                 sisa_faktur2: sisaPembayaran,
//                 bayar_mu: 0,
//             };
//         });

//         let totPembayaran: any;
//         let totHutang: any;

//         totPembayaran = newNodes.reduce((acc: number, node: any) => {
//             return acc + parseFloat(node.bayar_mu);
//         }, 0);
//         totHutang = newNodes.reduce((acc: number, node: any) => {
//             return acc + parseFloat(node.owing);
//         }, 0);

//         setStateDataFooter((prevState: any) => ({
//             ...prevState,
//             totalPembayaran: totPembayaran,
//             selisihAlokasiDana: jumlahBayar === '' ? 0 - totPembayaran : jumlahBayar - totPembayaran,
//             sisaHutang: totHutang - totPembayaran,
//         }));

//         setStateDataHeader((prevState: any) => ({
//             ...prevState,
//             disabledResetPembayaran: true,
//         }));

//         return {
//             nodes: newNodes,
//         };
//     });
// };
// // End
// // =================================================================================

// // =================================================================================
// // Fungsi yang digunakan untuk tombol di bawah jumlah dengan kondisi reset pembayaran
// const BayarSemuaFaktur = async (setDataBarang: Function, setStateDataFooter: Function, setStateDataHeader: Function, jumlahBayar: any) => {
//     console.log('Bayar Semua Aplikasi');
//     await setDataBarang((state: any) => {
//         const newNodes = state.nodes.map((node: any) => {
//             let sisaPembayaran;
//             sisaPembayaran = node.owing - node.owing;
//             return {
//                 ...node,
//                 sisa_faktur2: sisaPembayaran,
//                 bayar_mu: node.owing,
//             };
//         });

//         let totPembayaran: any;
//         let totHutang: any;

//         totPembayaran = newNodes.reduce((acc: number, node: any) => {
//             return acc + parseFloat(node.bayar_mu);
//         }, 0);
//         totHutang = newNodes.reduce((acc: number, node: any) => {
//             return acc + parseFloat(node.owing);
//         }, 0);

//         setStateDataFooter((prevState: any) => ({
//             ...prevState,
//             totalPembayaran: totPembayaran,
//             selisihAlokasiDana: jumlahBayar === '' ? 0 - totPembayaran : jumlahBayar - totPembayaran,
//             sisaHutang: totHutang - totPembayaran,
//         }));

//         setStateDataHeader((prevState: any) => ({
//             ...prevState,
//             disabledResetPembayaran: false,
//         }));

//         return {
//             nodes: newNodes,
//         };
//     });
// };
// // End
// // =================================================================================

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

export {
    CekTglBackDate,
    GenerateTotalJurnalEdit,
    CekTglPlus3,
    CekTglPlus14,
    OnClick_CetakDaftarPhu,
    OnClick_CetakFormKecil,
    CekPeriodeAkutansiPencairanWarkat,
    DetailNoFakturJurnalPencairanWarkat,
    DetailNoFakturJurnalPenolakanWarkat,
    GenerateTotalJurnal,
    DetailNoFakturJurnalWarkat,
    AutoJurnalSimpan,
    // BayarSemuaFaktur,
    // ResetPembayaran,
    FormatNilaiJumlah,
    // HandleKeterangan,
    HandleCariNoFj,
    HandleTglDok,
    // CekPeriodeAkutansi,
    CekTglMinusSatu,
    HandleSearchNamaSubledger,
    HandleSearchNoSubledger,
    HandleSearchNamaSales,
    HandleSearchNamaCust,
    HandleSearchNoCust,
    Terbilang,
    // HandleRowSelectedJurnal,
    DetailNoFakturJurnal,
    DetailNoFakturDeleteAll,
    DetailNoFakturDelete,
    HandleModalInputCust,
    HandleSearchNamaCustomer,
    HandleSearchNoCustomer,
    HandleModalInputKolektor,
    HandleModalInput,
    TemplateNamaAkun,
    TemplateNoAkun,
    HandleSearchNamaAkun,
    HandleSearchNoAkun,
    HandleSearchNoSales,
    HandleModalicon,
    // RowSelectingListData,
    // ListDetailDok,
    // SetDataDokumenPhu,
    // HandleRowSelected,
    PencarianJumlah,
    PencarianNoBukti,
    CurrencyFormat,
    HandleAkunDebetChange,
    HandleTglPpiPencairan,
    HandleTglPpiJt,
    HandleNoWarkatChange,
    ValueJenisPenerimaan,
    HandleJenisPenerimaanChange,
    HandleNoReffInputChange,
    HandleNoBuktiPenerimaanInputChange,
    HandleTglPpi,
    HandleNoCustomerInputChange,
    HandleNamaCustomerInputChange,
    ValueStatusWarkat,
    HandleStatusWarkatChange,
    HandleTglBuat,
    HandleNoTtpInputChange,
    HandleKolektorChange,
    HandleActualKolektorChange,
};
