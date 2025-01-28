import Swal from 'sweetalert2';
import { DaftarAkunKredit, ListBukuSubledger, ListCustFilter } from '../model/api';
import moment from 'moment';
import { frmNumber, tanpaKoma } from '@/utils/routines';

import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ConvertDataToHtml } from '../interface/template';

import React from 'react'

export default function fungsiForm() {
  return (
    <div>fungsiForm</div>
  )
}


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
//==================================================================================================
// Fungsi untuk Filter Search No Akun Daftar Akun Kredit
const HandleSearchNoAkun = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoAkun: searchValue,
    }));

    const filteredData = searchDataNoAkun(searchValue, dataDaftarAkunKredit);
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
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk Filter Search Nama Akun Daftar Akun Kredit
const HandleSearchNamaAkun = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaAkun: searchValue,
    }));
    const filteredData = searchDataNamaAkun(searchValue, dataDaftarAkunKredit);
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
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan daftar Akun kredit lewat change input
const refDataSubledger = { current: null };
const HandleModalInput = async (
    value: string,
    tipePilih: string,
    setStateDataHeader: Function,
    setStateDataArray: Function,
    kode_entitas: string,
    dataDaftarAkunKredit: any,
    tipe: string,
    paramobject: any,
    stateDataHeader: any,
    dataDaftarSupplier: any,
    dataDaftarSubledger: any
) => {
    if (tipePilih === 'akun') {
        const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(paramobject);
        await setStateDataArray((prevState: any) => ({
            ...prevState,
            recordsData: resultDaftarAkunKredit,
        }));
        // await setDataDaftarAkunKredit(resultDaftarAkunKredit);

        if (tipe === 'noAkun') {
            await HandleSearchNoAkun(value, setStateDataHeader, setStateDataArray, resultDaftarAkunKredit);
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarAkunKreditVisible: true,
                searchNoAkun: value,
                tipeFilterOpen: 'Input',
                tipeFocusOpen: 'noAkun',
            }));
        } else {
            await HandleSearchNamaAkun(value, setStateDataHeader, setStateDataArray, resultDaftarAkunKredit);
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                dialogDaftarAkunKreditVisible: true,
                searchNamaAkun: value,
                tipeFilterOpen: 'Input',
                tipeFocusOpen: 'namaAkun',
            }));
        }
    } else {
        if (tipe === 'noSubledger') {
            if (stateDataHeader?.tipeAkun === 'Piutang') {
                await HandleSearchNoCust(value, setStateDataHeader, kode_entitas, setStateDataArray);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarCustomerVisible: true,
                    searchNoCust: value,
                    tipeFocusOpenCust: 'inputNoSubledger',
                }));
            } else if (stateDataHeader?.tipeAkun === 'Hutang') {
                await HandleSearchNoSupplier(value, setStateDataHeader, setStateDataArray, dataDaftarSupplier);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSupplierVisible: true,
                    searchNoSupplier: value,
                    tipeFocusOpenCust: 'inputNoSubledger',
                }));
            } else {
                if (dataDaftarSubledger !== undefined) {
                    refDataSubledger.current = dataDaftarSubledger;
                }
                await HandleSearchNoSubledger(value, setStateDataHeader, setStateDataArray, refDataSubledger.current);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSubledgerVisible: true,
                    searchNoSubledger: value,
                    tipeFocusOpenCust: 'inputNoSubledger',
                }));
            }
        } else if (tipe === 'namaSubledger') {
            if (stateDataHeader?.tipeAkun === 'Piutang') {
                await HandleSearchNamaCust(value, setStateDataHeader, kode_entitas, setStateDataArray);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarCustomerVisible: true,
                    searchNamaCust: value,
                    tipeFocusOpenCust: 'inputNamaSubledger',
                }));
            } else if (stateDataHeader?.tipeAkun === 'Hutang') {
                await HandleSearchNamaSupplier(value, setStateDataHeader, setStateDataArray, dataDaftarSupplier);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSupplierVisible: true,
                    searchNamaSupplier: value,
                    tipeFocusOpenCust: 'inputNamaSubledger',
                }));
            } else {
                if (dataDaftarSubledger !== undefined) {
                    refDataSubledger.current = dataDaftarSubledger;
                }
                await HandleSearchNamaSubledger(value, setStateDataHeader, setStateDataArray, refDataSubledger.current);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    dialogDaftarSubledgerVisible: true,
                    searchNamaSubledger: value,
                    tipeFocusOpenCust: 'inputNamaSubledger',
                }));
            }
        }
    }
};
// END
//==================================================================================================

//=================================================================================
// Handle Filter Daftar Customer
// ini digunakan untuk filter no cust
const HandleSearchNoCust = (event: any, setStateDataHeader: Function, kode_entitas: string, setStateDataArray: Function) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoCust: searchValue,
    }));
    const filteredData = searchDataNoCust(searchValue, kode_entitas, setStateDataArray);
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

const searchDataNoCust = async (keyword: any, kode_entitas: string, setStateDataArray: Function) => {
    // Jika keyword kosong, kembalikan semua data

    try {
        const response = await ListCustFilter(kode_entitas, 'all', keyword, 'all');

        setStateDataArray((prevState: any) => ({
            ...prevState,
            filteredDataCustomer: response,
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// ini digunakan untuk filter nama cust
const HandleSearchNamaCust = (event: any, setStateDataHeader: Function, kode_entitas: string, setStateDataArray: Function) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaCust: searchValue,
    }));
    const filteredData = searchDataNamaCust(searchValue, kode_entitas, setStateDataArray);
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

const searchDataNamaCust = async (keyword: any, kode_entitas: string, setStateDataArray: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, keyword, 'all', 'all');
        setStateDataArray((prevState: any) => ({
            ...prevState,
            filteredDataCustomer: response,
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// ini digunakan untuk filter nama sales
const HandleSearchNamaSales = (event: any, setStateDataHeader: Function, kode_entitas: string, setStateDataArray: Function) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSales: searchValue,
    }));
    const filteredData = searchDataNamaSales(searchValue, kode_entitas, setStateDataArray);
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

const searchDataNamaSales = async (keyword: any, kode_entitas: string, setStateDataArray: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, 'all', 'all', keyword);
        setStateDataArray((prevState: any) => ({
            ...prevState,
            filteredDataCustomer: response,
        }));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// END
//=================================================================================

//=================================================================================
// Fungsi untuk Memasukan data Customer sesuai dengan customer yang dipilih
const refNamaCust = { current: null };
const refKodeCust = { current: null };
const refKodeRelasi = { current: null };
const HandleSelectedDataCustomer = async (kode_entitas: any, dataObject: any, tipe: string, setStateDataHeader: Function, setStateDataArray: Function, stateDataHeader: any, token: any) => {
    const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
    const paramObject = {
        kode_entitas: kode_entitas,
        kode_akun: stateDataHeader?.kodeAkun,
        kode_subledger: tipe === 'pilih' ? dataObject[0].kode_cust : dataObject.kode_cust,
        kode_jual:
            stateDataHeader?.divisiJualDefault === 'ALL'
                ? stateDataHeader?.divisiJualDefault.toLowerCase()
                : stateDataHeader?.divisiJualDefault === 'ALL'
                ? stateDataHeader?.divisiJualDefault.toLowerCase()
                : stateDataHeader?.divisiJualDefault,
        no_kontrak_um: stateDataHeader?.noKontrakUm === '' ? 'all' : stateDataHeader?.noKontrakUm,
        tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
        tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
        token: token,
        tglAwalSaldoAwal: tglAwalSaldoAwal,
    };
    if (tipe === 'pilih') {
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            noSubValue: dataObject[0].no_cust,
            namaSubValue: dataObject[0].nama_relasi,
            kodeSubValue: dataObject[0].kode_cust,
            kodeRelasiValue: dataObject[0].kode_relasi,
        }));

        refNamaCust.current = dataObject[0].nama_relasi;
        refKodeCust.current = dataObject[0].kode_cust;
        refKodeRelasi.current = dataObject[0].kode_relasi;
        const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
        await setStateDataArray((prevState: any) => ({
            ...prevState,
            recordsData: getListDataBukuSubledger,
        }));
    } else {
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            noSubValue: dataObject.no_cust,
            namaSubValue: dataObject.nama_relasi,
            kodeSubValue: dataObject.kode_cust,
            kodeRelasiValue: dataObject.kode_relasi,
        }));

        refNamaCust.current = dataObject.nama_relasi;
        refKodeCust.current = dataObject.kode_cust;
        refKodeRelasi.current = dataObject.kode_relasi;
        const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
        await setStateDataArray((prevState: any) => ({
            ...prevState,
            recordsData: getListDataBukuSubledger,
        }));
    }
};

//==================================================================================================
// Fungsi Set List Data
const GetListDataBukuSubledger = async (paramObject: any) => {
    const resultListBukuSubledger: any = await ListBukuSubledger(paramObject);
    const respSaldo = resultListBukuSubledger.saldo[0].saldoawal;

    // Tambahkan saldo kumulatif ke data dari API 2
    let currentSaldoKumulatif: any = parseFloat(tanpaKoma(resultListBukuSubledger.saldo[0].saldoawal));
    const updatedListBukuSubledger = resultListBukuSubledger.master.map((item: any) => {
        // Konversi debet dan kredit ke float setelah menghapus koma
        const debet = parseFloat(item.debet.replace(/,/g, '')) || 0;
        const kredit = parseFloat(item.kredit.replace(/,/g, '')) || 0;

        // Hitung saldo kumulatif
        currentSaldoKumulatif += debet - kredit;

        // Tambahkan field saldo_kumulatif
        return {
            ...item,
            tgl_dokumen: String(moment(item.tgl_dokumen).format('DD-MM-YYYY')),
            debet: item.debet === '0' ? '' : frmNumber(tanpaKoma(item.debet)),
            kredit: item.kredit === '0' ? '' : frmNumber(tanpaKoma(item.kredit)),
            saldo_kumulatif: frmNumber(currentSaldoKumulatif), // Format sebagai string dengan koma sebagai pemisah ribuan
        };
    });

    // Gabungkan data
    const combinedData = [
        {
            kode_dokumen: '',
            dokumen: '',
            tgl_dokumen: '',
            no_dokumen: '',
            STATUS: '',
            catatan: `Saldo sampai dengan ${paramObject.tglAwalSaldoAwal.format('DD MMM YYYY')}`,
            debet: '',
            kredit: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            no_dept: '',
            nama_dept: '',
            no_kerja: '',
            nama_kry: '',
            kode_jual: '',
            saldo_kumulatif: frmNumber(tanpaKoma(resultListBukuSubledger.saldo[0].saldoawal)), // Format sebagai string dengan koma sebagai pemisah ribuan
        },
        ...updatedListBukuSubledger,
    ];
    return combinedData;
};

// Sorting function that accepts a field and order ('asc' or 'desc')
function sortData(data: any, field: any, order = 'asc') {
    return data.sort((a: any, b: any) => {
        let valueA = a[field];
        let valueB = b[field];

        // Compare for strings or dates
        if (typeof valueA === 'string' || valueA instanceof Date) {
            valueA = valueA.toString().toLowerCase();
            valueB = valueB.toString().toLowerCase();
        }

        // Compare the values based on order
        if (order === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });
}

function sortDataNilai(data: any[], field: string, order = 'asc') {
    return data.sort((a: any, b: any) => {
        let valueA = a[field];
        let valueB = b[field];

        // Handle "debet" and "kredit" fields (strings with commas that need to be parsed as numbers)
        if (field === 'debet' || field === 'kredit') {
            valueA = parseFloat(valueA.replace(/,/g, '') || '0'); // Remove commas and convert to number
            valueB = parseFloat(valueB.replace(/,/g, '') || '0'); // Remove commas and convert to number
        }

        // Handle string or date comparisons
        else if (typeof valueA === 'string' || valueA instanceof Date) {
            valueA = valueA.toString().toLowerCase();
            valueB = valueB.toString().toLowerCase();
        }

        // Compare the values based on order
        if (order === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });
}

const GetListDataBukuSubledgerSort = async (paramObject: any) => {
    const resultListBukuSubledger: any = await ListBukuSubledger(paramObject);
    const respSaldo = resultListBukuSubledger.saldo[0].saldoawal;

    let sorted: any;
    if (paramObject.tipe === 'tanggal') {
        if (paramObject.plag === 'DESC') {
            // Urutkan berdasarkan tgl_dokumen secara descending
            sorted = sortData(resultListBukuSubledger.master, 'tgl_dokumen', 'desc');
        } else {
            // Urutkan berdasarkan tgl_dokumen secara ascending
            sorted = sortData(resultListBukuSubledger.master, 'tgl_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'dok') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'noRef') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'no_dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'no_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'ket') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'catatan', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'catatan', 'asc');
        }
    } else if (paramObject.tipe === 'debet') {
        if (paramObject.plag === 'DESC') {
            sorted = sortDataNilai(resultListBukuSubledger.master, 'debet', 'desc');
        } else {
            sorted = sortDataNilai(resultListBukuSubledger.master, 'debet', 'asc');
        }
    } else if (paramObject.tipe === 'kredit') {
        if (paramObject.plag === 'DESC') {
            sorted = sortDataNilai(resultListBukuSubledger.master, 'kredit', 'desc');
        } else {
            sorted = sortDataNilai(resultListBukuSubledger.master, 'kredit', 'asc');
        }
    } else if (paramObject.tipe === 'saldoKum') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'tgl_dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'tgl_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'dept') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'no_dept', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'no_dept', 'asc');
        }
    } else if (paramObject.tipe === 'namaKar') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'nama_kry', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'nama_kry', 'asc');
        }
    } else if (paramObject.tipe === 'divisiJual') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'kode_jual', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'kode_jual', 'asc');
        }
    } else if (paramObject.tipe === 'noKontrak') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger.master, 'no_kontrak', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger.master, 'no_kontrak', 'asc');
        }
    }

    // Tambahkan saldo kumulatif ke data dari API 2
    let currentSaldoKumulatif: any = parseFloat(tanpaKoma(resultListBukuSubledger.saldo[0].saldoawal));
    const updatedListBukuSubledger = sorted.map((item: any) => {
        // Konversi debet dan kredit ke float setelah menghapus koma
        const debet = parseFloat(item.debet.replace(/,/g, '')) || 0;
        const kredit = parseFloat(item.kredit.replace(/,/g, '')) || 0;

        // Hitung saldo kumulatif
        currentSaldoKumulatif += debet - kredit;

        // Tambahkan field saldo_kumulatif
        return {
            ...item,
            tgl_dokumen: String(moment(item.tgl_dokumen).format('DD-MM-YYYY')),
            debet: item.debet === '0' ? '' : frmNumber(tanpaKoma(item.debet)),
            kredit: item.kredit === '0' ? '' : frmNumber(tanpaKoma(item.kredit)),
            saldo_kumulatif: frmNumber(currentSaldoKumulatif), // Format sebagai string dengan koma sebagai pemisah ribuan
        };
    });

    // Gabungkan data
    const combinedData = [
        {
            kode_dokumen: '',
            dokumen: '',
            tgl_dokumen: '',
            no_dokumen: '',
            STATUS: '',
            catatan: `Saldo sampai dengan ${paramObject.tglAwalSaldoAwal.format('DD MMM YYYY')}`,
            debet: '',
            kredit: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            no_dept: '',
            nama_dept: '',
            no_kerja: '',
            nama_kry: '',
            kode_jual: '',
            saldo_kumulatif: frmNumber(tanpaKoma(resultListBukuSubledger.saldo[0].saldoawal)), // Format sebagai string dengan koma sebagai pemisah ribuan
        },
        ...updatedListBukuSubledger,
    ];
    return combinedData;
};

const HandleChangeDivisiJual = async (value: any, kode_entitas: any, token: any, stateDataHeader: any, setStateDataArray: Function, setStateDataHeader: Function) => {
    const kodeJual = value;
    const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
    const paramObject = {
        kode_entitas: kode_entitas,
        kode_akun: stateDataHeader?.kodeAkun,
        kode_subledger: stateDataHeader?.kodeSubValue,
        kode_jual: kodeJual === 'ALL' ? kodeJual.toLowerCase() : kodeJual,
        no_kontrak_um: stateDataHeader?.noKontrakUm === '' ? 'all' : stateDataHeader?.noKontrakUm,
        tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
        tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
        token: token,
        tglAwalSaldoAwal: tglAwalSaldoAwal,
    };

    const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
    await setStateDataArray((prevState: any) => ({
        ...prevState,
        recordsData: getListDataBukuSubledger,
    }));
    await setStateDataHeader((prevState: any) => ({
        ...prevState,
        divisiJualDefault: value,
    }));
};

const HandleTgl = async (date: any, tipe: string, kode_entitas: any, token: any, stateDataHeader: any, setStateDataArray: Function, setStateDataHeader: Function) => {
    let paramObject;
    if (tipe === 'tanggalAwal') {
        const tglAwalSaldoAwal = moment(date).subtract(1, 'days');
        paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            kode_subledger: stateDataHeader?.kodeSubValue,
            kode_jual:
                stateDataHeader?.divisiJualDefault === 'ALL'
                    ? stateDataHeader?.divisiJualDefault.toLowerCase()
                    : stateDataHeader?.divisiJualDefault === 'ALL'
                    ? stateDataHeader?.divisiJualDefault.toLowerCase()
                    : stateDataHeader?.divisiJualDefault,
            no_kontrak_um: stateDataHeader?.noKontrakUm === '' ? 'all' : stateDataHeader?.noKontrakUm,
            tgl_awal: moment(date).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            date1: date,
        }));
        if (stateDataHeader?.noAkunValue !== '' || stateDataHeader?.namaAkunValue !== '') {
            const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
            await setStateDataArray((prevState: any) => ({
                ...prevState,
                recordsData: getListDataBukuSubledger,
            }));
        }
    } else {
        const tglAwalSaldoAwal = moment(date).subtract(1, 'days');
        paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            kode_subledger: stateDataHeader?.kodeSubValue,
            kode_jual:
                stateDataHeader?.divisiJualDefault === 'ALL'
                    ? stateDataHeader?.divisiJualDefault.toLowerCase()
                    : stateDataHeader?.divisiJualDefault === 'ALL'
                    ? stateDataHeader?.divisiJualDefault.toLowerCase()
                    : stateDataHeader?.divisiJualDefault,
            no_kontrak_um: stateDataHeader?.noKontrakUm === '' ? 'all' : stateDataHeader?.noKontrakUm,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(date).format('YYYY-MM-DD'),
            token: token,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            date2: date,
        }));
        if (stateDataHeader?.noAkunValue !== '' || stateDataHeader?.namaAkunValue !== '') {
            const getListDataBukuSubledger: any[] = await GetListDataBukuSubledger(paramObject);
            await setStateDataArray((prevState: any) => ({
                ...prevState,
                recordsData: getListDataBukuSubledger,
            }));
        }
    }
};

//==================================================================================================
// Fungsi untuk Filter Search No Supplier
const HandleSearchNoSupplier = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarSupplier: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNoSupplier: searchValue,
    }));

    const filteredData = searchDataNoSupplier(searchValue, dataDaftarSupplier);
    setStateDataArray(() => ({
        filteredDataSupplier: filteredData,
    }));

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
const HandleSearchNamaSupplier = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarSupplier: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSupplier: searchValue,
    }));
    const filteredData = searchDataNamaSupplier(searchValue, dataDaftarSupplier);
    setStateDataArray(() => ({
        filteredDataSupplier: filteredData,
    }));

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
// Fungsi untuk Filter Search No Akun Daftar Subledger
const HandleSearchNoSubledger = (event: any, setStateDataDetail: Function, setStateDataArray: Function, dataDaftarSubledger: any) => {
    const searchValue = event;
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNoSubledger: searchValue,
    }));

    const filteredData = searchDataNoSubledger(searchValue, dataDaftarSubledger);
    setStateDataArray(() => ({
        filteredDataSubledger: filteredData,
    }));

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
const HandleSearchNamaSubledger = (event: any, setStateDataDetail: Function, setStateDataArray: Function, dataDaftarSubledger: any) => {
    const searchValue = event;
    setStateDataDetail((prevState: any) => ({
        ...prevState,
        searchKeywordNamaSubledger: searchValue,
    }));
    const filteredData = searchDataNamaSubledger(searchValue, dataDaftarSubledger);
    setStateDataArray(() => ({
        filteredDataSubledger: filteredData,
    }));

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
// Fungsi Export To Excel
const ExportToCustomExcel = async (data: any[], fileName: any, objectToExcel: any) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Add header
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1').value = `${objectToExcel.kode_entitas}`;
    worksheet.getCell('A1').style = {
        font: { size: 14, bold: true },
        alignment: { horizontal: 'center' },
    };

    worksheet.mergeCells('A2:G2');
    worksheet.getCell('A2').value = 'SUMMARY SUBLEDGER';
    worksheet.getCell('A2').style = {
        font: { size: 16, bold: true, color: { argb: 'FFFF0000' } }, // Warna teks merah },
        alignment: { horizontal: 'center' },
    };

    worksheet.mergeCells('A3:G3');
    worksheet.getCell('A3').value = `${objectToExcel.periode}`;
    worksheet.getCell('A3').style = {
        font: { size: 12, bold: true },
        alignment: { horizontal: 'center' },
    };

    worksheet.mergeCells('A4:B4');
    worksheet.getCell('A4').value = `${objectToExcel.kode_entitas}`;
    worksheet.getCell('A4').style = {
        font: { size: 12, bold: true },
        alignment: { horizontal: 'left' },
    };

    worksheet.mergeCells('A5:G5');
    worksheet.getCell('A5').value = `${objectToExcel.no_akun}`;
    worksheet.getCell('A5').style = {
        font: { size: 12, bold: true },
        alignment: { horizontal: 'left' },
    };

    worksheet.mergeCells('A6:G6');
    worksheet.getCell('A6').value = `${objectToExcel.no_subledger}`;
    worksheet.getCell('A6').style = {
        font: { size: 12, bold: true },
        alignment: { horizontal: 'left' },
    };

    // Add table headers
    const headers = ['Tanggal', 'Dok.', 'No. Ref', 'Keterangan', 'Debet', 'Kredit', 'Kumulatif'];
    worksheet.addRow(headers);
    worksheet.getRow(7).eachCell((cell) => {
        cell.style = {
            font: { bold: true },
            alignment: { horizontal: 'center' },
            border: {
                bottom: { style: 'thin' },
            },
        };
    });

    data.forEach((item) => {
        const row = worksheet.addRow([item.tgl_dokumen, item.dokumen, item.no_dokumen, item.catatan, item.debet, item.kredit, item.saldo_kumulatif]);

        // Mengatur style font untuk setiap sel di baris data
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            cell.style = {
                font: {
                    size: 10, // Ukuran font
                    color: { argb: 'FF000000' }, // Warna teks hitam
                },
                alignment: colNumber >= 5 ? { horizontal: 'right' } : { horizontal: 'left' }, // Rata kanan untuk kolom Debet, Kredit, dan Saldo Kumulatif
            };
        });
    });

    // Set column widths
    worksheet.columns = [
        { width: 12 }, // Column A
        { width: 5 }, // Column B
        { width: 15 }, // Column C
        { width: 50 }, // Column D
        { width: 15 }, // Column E
        { width: 15 }, // Column F
        { width: 20 }, // Column G
    ];

    // Write file to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Save file
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    return true;
};

// END
//==================================================================================================

//==================================================================================================
// Fungsi Print Data
const PrintData = (data: any, objectToExcel: any) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <html>
            <head>
              <title>Cetak Laporan</title>
              <style>
                @media print {
                  table { page-break-after: auto; }
                  tr { page-break-inside: avoid; page-break-after: auto; }
                  td { page-break-inside: avoid; page-break-after: auto; }
                  thead { display: table-header-group; }
                  tfoot { display: table-footer-group; }
                }
              </style>
            </head>
            <body onload="window.print();">
              ${ConvertDataToHtml(data, objectToExcel)}
            </body>
          </html>
        `);
        iframeDoc.close();

        if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.onafterprint = () => {
                document.body.removeChild(iframe);
            };
        }
    } else {
        console.error('Failed to access iframe document.');
    }
};

// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan Cetak Daftar Buku Subledger
const OnClick_CetakDaftarBukuSubledger = (paramObject: any) => {
    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframeSrc = `./buku-subledger/report/daftar_buku_subledger?entitas=${paramObject.kode_entitas}&kode_akun=${paramObject.kode_akun}&kode_subledger=${paramObject.kode_subledger}&kode_divisi=${paramObject.kode_jual}&no_kontrak=${paramObject.no_kontrak_um}&tgl_awal=${paramObject.tgl_awal}&tgl_akhir=${paramObject.tgl_akhir}&token=${paramObject.token}`;

    fetch(iframeSrc)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(() => {
            let iframe = `
            <html><head>
            <title>Laporan Buku Subledger | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="${iframeSrc}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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
        })
        .catch((error) => {
            console.error('Failed to load resource:', error);
        });
};
// END

export {
    GetListDataBukuSubledgerSort,
    OnClick_CetakDaftarBukuSubledger,
    PrintData,
    ExportToCustomExcel,
    CurrencyFormat,
    GetListDataBukuSubledger,
    HandleSearchNamaSubledger,
    HandleSearchNoSubledger,
    HandleSearchNamaSupplier,
    HandleSearchNoSupplier,
    HandleTgl,
    HandleChangeDivisiJual,
    HandleSelectedDataCustomer,
    HandleSearchNamaSales,
    HandleSearchNamaCust,
    HandleSearchNoCust,
    HandleModalInput,
    HandleSearchNoAkun,
    HandleSearchNamaAkun,
    swalToast,
};
