import { HandleChangeParamsObject } from '@/utils/fa/phe/template/HandleChangeParamsObject';
import Swal from 'sweetalert2';
import { GetBankEks, GetListAlokasiPembayaranPhe, GetTbImagesPhe, LoadImagesPhe, getListPhe } from '../api/api';
import { HandleChangeParamsObjectDialogPhe } from '@/utils/fa/phe/template/HandleChangeParamsObjectDialogPhe';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import { fetchPreferensi, frmNumber, tanpaKoma } from '@/utils/global/fungsi';
import moment from 'moment';

async function showLoading1(closeWhenDataIsFulfilled: boolean) {
    if (closeWhenDataIsFulfilled) {
        Swal.fire({
            padding: '3em',
            imageUrl: '/assets/images/loader-1.gif',
            imageWidth: 170,
            imageHeight: 170,
            imageAlt: 'Custom image',
            background: 'rgba(0,0,0,.0)',
            backdrop: 'rgba(0,0,0,0.0)',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
        });
    } else {
        Swal.close(); // Menutup tampilan loading
    }
}

//======= Setting tampilan sweet alert  =========
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

//==================================================================================================
// Fungsi Untuk mencari Data List berdasarkan no PHE
const pencarianNoPhe = async (params: HandleChangeParamsObject) => {
    const searchValue = params.valueObject;
    params.setStateDataHeaderList((prevState: any) => ({
        ...prevState,
        searchNoPhe: searchValue,
    }));
    const filteredDataBaru = pencarianDataNoPhe(searchValue, params.recordsData);
    const FilteredDataApproval = pencarianDataNoPhe(searchValue, params.recordsDataApprove);
    const filteredDataBayar = pencarianDataNoPhe(searchValue, params.recordsDataBayar);
    params.setFilteredData(filteredDataBaru);
    params.setFilteredDataApproval(FilteredDataApproval);
    params.setFilteredDataBaru(filteredDataBayar);

    const cariBayar = document.getElementById('cariBayar') as HTMLInputElement;
    if (cariBayar) {
        cariBayar.value = '';
    }
};

const pencarianDataNoPhe = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.no_phe.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk mencari Data List berdasarkan Bayar
const pencarianBayar = async (params: HandleChangeParamsObject) => {
    const searchValue = params.valueObject;
    params.setStateDataHeaderList((prevState: any) => ({
        ...prevState,
        searchBayar: searchValue,
    }));
    const filteredDataBaru = pencarianDataBayar(searchValue, params.recordsData);
    const FilteredDataApproval = pencarianDataBayar(searchValue, params.recordsDataApprove);
    const filteredDataBayar = pencarianDataBayar(searchValue, params.recordsDataBayar);
    params.setFilteredData(filteredDataBaru);
    params.setFilteredDataApproval(FilteredDataApproval);
    params.setFilteredDataBaru(filteredDataBayar);

    const cariNoPhe = document.getElementById('cariNoPhe') as HTMLInputElement;
    if (cariNoPhe) {
        cariNoPhe.value = '';
    }
};

const pencarianDataBayar = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        if (recordsData.length > 0) {
            // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
            const filteredData = recordsData.filter((item) => String(item.total_mu).startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk menampilkan Alokasi Pembayaran pada saat Klik Nama Ekspedisi
const handleNamaEkspedisiChange = async (params: HandleChangeParamsObjectDialogPhe) => {
    const paramObject = {
        kode_entitas: params.kode_entitas,
        kode_phe: 'NAME',
        pph23: params.stateDataHeader?.pph23 === '' ? 'N' : params.stateDataHeader?.pph23,
        kode_rpe: params.stateDataHeader?.kodeRpe,
        via: params.valueObject,
        token: params.token,
    };
    const respListAlokasiPembayaranPhe = await GetListAlokasiPembayaranPhe(paramObject);
    const respListAlokasiPembayaranPheFix = respListAlokasiPembayaranPhe.map((item: any, index: number) => ({
        ...item,
        id: `${index + 1}`,
        total_berat: parseFloat(item.total_berat),
        biaya_lain: parseFloat(item.biaya_lain),
        potongan_lain: parseFloat(item.potongan_lain),
        netto_mu: parseFloat(item.netto_mu),
        sisa_hutang: parseFloat(item.sisa_hutang),
        sisaFix: parseFloat(item.sisa_hutang),
        bayar_mu: parseFloat(item.bayar_mu),
    }));

    // Menghitung total netto_mu
    const totalNettoMu = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
    // Menghitung Total Pembayaran
    const totalPembayaran = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_mu) || 0), 0);
    // Menghitung total sisa Hutang
    const totalSisaHutang = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (item.sisa_hutang || 0), 0);

    params.setStateDataHeader((prevState: any) => ({
        ...prevState,
        totalBarang: respListAlokasiPembayaranPheFix.length,
    }));
    // params.setStateDataFooter((prevState: any) => ({
    //     ...prevState,
    //     totalHutang: totalNettoMu,
    //     sisaHutang: totalSisaHutang,
    // }));
    params.setStateDataFooter((prevState: any) => ({
        ...prevState,
        totalHutang: totalNettoMu,
        totalPembayaran: totalPembayaran,
        sisaHutang: totalNettoMu - totalPembayaran,
        selisihAlokasiDana: (params.stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(params.stateDataHeader?.jumlahBayar)) - totalPembayaran,
    }));
    params.setDataAlokasiPembayaran({ nodes: respListAlokasiPembayaranPheFix });
    params.gridPheListRef?.setProperties({ dataSource: respListAlokasiPembayaranPheFix });
    params.gridPheListRef?.refresh();
};
// END
//==================================================================================================

//==================================================================================================
// Format Rupiah
const formatCurrency: Object = { skeleton: 'C3', format: ',0.00;-,0.00;#', maximumFractionDigits: 2 };
const currencyFormat = (num: any) => {
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

const frmNumberSyncfusion = (value: any) => {
    // Menggunakan fungsi Number() untuk mengonversi string menjadi angka
    let numericValue = Number(value);

    // Memeriksa apakah nilai numerik adalah NaN
    if (isNaN(numericValue)) {
        numericValue = 0; // Mengubah NaN menjadi 0
    }

    // Menggunakan fungsi Number.toLocaleString() untuk memformat angka
    const formattedValue = numericValue.toLocaleString('de-DE', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formattedValue;
};
//END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk menampilkan Alokasi Pembayaran pada saat Klik PPH 23
const handlePph23Change = async (params: HandleChangeParamsObjectDialogPhe) => {
    if (params.stateDataHeader?.via !== '') {
        const paramObject = {
            kode_entitas: params.kode_entitas,
            kode_phe: 'NAME',
            pph23: params.valueObject,
            kode_rpe: params.stateDataHeader?.kodeRpe,
            via: params.stateDataHeader?.via,
            token: params.token,
        };
        const respListAlokasiPembayaranPhe = await GetListAlokasiPembayaranPhe(paramObject);
        const respListAlokasiPembayaranPheFix = respListAlokasiPembayaranPhe.map((item: any, index: number) => ({
            ...item,
            id: `${index + 1}`,
            total_berat: parseFloat(item.total_berat),
            biaya_lain: parseFloat(item.biaya_lain),
            potongan_lain: parseFloat(item.potongan_lain),
            netto_mu: parseFloat(item.netto_mu),
            sisa_hutang: parseFloat(item.sisa_hutang),
            sisaFix: parseFloat(item.sisa_hutang),
            bayar_mu: parseFloat(item.bayar_mu),
        }));

        // Menghitung total netto_mu
        const totalNettoMu = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
        // Menghitung Total Pembayaran
        const totalPembayaran = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_mu) || 0), 0);
        // Menghitung total sisa Hutang
        const totalSisaHutang = respListAlokasiPembayaranPheFix.reduce((sum: any, item: any) => sum + (item.sisa_hutang || 0), 0);

        params.setStateDataHeader((prevState: any) => ({
            ...prevState,
            totalBarang: respListAlokasiPembayaranPheFix.length,
        }));
        // params.setStateDataFooter((prevState: any) => ({
        //     ...prevState,
        //     totalHutang: totalNettoMu,
        //     sisaHutang: totalSisaHutang,
        // }));

        params.setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalHutang: totalNettoMu,
            totalPembayaran: totalPembayaran,
            sisaHutang: totalNettoMu - totalPembayaran,
            selisihAlokasiDana: (params.stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(params.stateDataHeader?.jumlahBayar)) - totalPembayaran,
        }));

        params.setDataAlokasiPembayaran({ nodes: respListAlokasiPembayaranPheFix });
        params.gridPheListRef?.setProperties({ dataSource: respListAlokasiPembayaranPheFix });
        params.gridPheListRef?.refresh();
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk menampilkan Alokasi Pembayaran pada saat Klik PPH 23
const handleJumlahBayar = async (params: HandleChangeParamsObjectDialogPhe) => {
    let jumlah_bayar: any;
    const format = params.valueObject.includes(',');
    if (format) {
        jumlah_bayar = tanpaKoma(params.valueObject);
    } else {
        jumlah_bayar = params.valueObject;
    }

    // Fungsi untuk mengonversi karakter pertama menjadi huruf kapital
    const capitalizeFirstLetter = (str: any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Kata yang ingin diubah
    const originalString = Terbilang(jumlah_bayar === '' || jumlah_bayar === null || jumlah_bayar === undefined ? 0 : parseFloat(jumlah_bayar));

    // Mengonversi karakter pertama menjadi huruf kapital
    const capitalizedString = capitalizeFirstLetter(originalString);

    const newNodes = await params.gridPheListRef.dataSource.map((nodes: any) => {
        return nodes;
    });

    const jumlahYangAkanDibayar = newNodes.reduce((acc: number, node: any) => {
        if (parseFloat(node.bayar_mu) > 0) {
            return acc + parseFloat(node.bayar_mu);
        }
        return acc;
    }, 0);

    params.setStateDataHeader((prevState: any) => ({
        ...prevState,
        jumlahBayar: jumlah_bayar === '' || jumlah_bayar === null || jumlah_bayar === undefined ? '' : parseFloat(jumlah_bayar),
        terbilangJumlah: jumlah_bayar === '' || jumlah_bayar === null || jumlah_bayar === undefined ? '' : '** ' + capitalizedString + ' **',
    }));
    params.setStateDataFooter((prevState: any) => ({
        ...prevState,
        selisihAlokasiDana: jumlahYangAkanDibayar === 0 ? jumlah_bayar : jumlah_bayar - jumlahYangAkanDibayar,
    }));

    const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
    if (jumlahBayar) {
        jumlahBayar.value = frmNumber(jumlah_bayar);
    }
};

// END
//==================================================================================================

// =================================================================================
// Cek Tanggal Minus Satu untuk pengecekan tgl dokumen pada saat input
const cekTglMinusSatu = async (tglDok: any) => {
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
const cekTglBackDate = async (tglDok: any) => {
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

const handleDoubleClick = (args: any, params: HandleChangeParamsObject) => {
    params.setMasterDataState('EDIT');
    params.setMasterKodeDokumen(args.rowData.kode_phe);
    params.setDialogInputDataVisible(true);
    params.setRefreshKey((prevKey: any) => prevKey + 1);
    params.setStateDataParams((prevState: any) => ({
        ...prevState,
        via: args.rowData.via,
        pph23: args.rowData.pph23,
        kode_phe: args.rowData.kode_phe,
        kode_rpe: '',
        kode_dokumen: '',
    }));
};

const handleDoubleClickApp = (args: any, params: HandleChangeParamsObject) => {
    params.setMasterDataState(args.rowData.status === 'Terbuka' ? 'EDIT APP' : 'EDIT RELEASE');
    params.setMasterKodeDokumen(args.rowData.kode_phe);
    params.setDialogInputDataVisible(true);
    params.setRefreshKey((prevKey: any) => prevKey + 1);
    params.setStateDataParams((prevState: any) => ({
        ...prevState,
        via: args.rowData.via,
        pph23: args.rowData.pph23,
        kode_phe: args.rowData.kode_phe,
        kode_rpe: '',
        kode_dokumen: '',
    }));
};

const handleRowSelected = (args: any, params: HandleChangeParamsObject) => {
    if (args.data !== undefined) {
        params.setMasterKodeDokumen(args.data.kode_phe);
        params.setRefreshKey((prevKey: any) => prevKey + 1);
        params.setStateDataParams((prevState: any) => ({
            ...prevState,
            via: args.data.via,
            pph23: args.data.pph23,
            kode_phe: args.data.kode_phe,
            kode_rpe: '',
            kode_dokumen: '',
            statusApproval: args.data.statusApproval,
            status: args.data.status,
            status_app: args.data.status_app,
            no_dokumen: args.data.no_dokumen,
            no_phe: args.data.no_phe,
            tgl_phe: args.data.tgl_phe,
        }));
    }
};

const OpenPreviewInsert = (
    index: any,
    setIndexPreview: Function,
    setIsOpenPreview: Function,
    setZoomScale: Function,
    setPosition: Function,
    loadFilePendukung: any,
    extractedFiles: any,
    setImageDataUrl: Function,
    images: any
) => {
    setIndexPreview(index);
    setIsOpenPreview(true);
    setZoomScale(0.5); // Reset zoom scale
    setPosition({ x: 0, y: 0 }); // Reset position

    if (!images[index]) {
        const foundItem = loadFilePendukung.find((item: any) => parseFloat(item.id_dokumen) - 1 === index);
        const filegambar = foundItem?.decodeBase64_string;
        if (filegambar) {
            const imageUrl = filegambar;
            setImageDataUrl(imageUrl || '');
        }
    } else {
        setImageDataUrl(images[index][0]);
    }
};

const load = (params: HandleChangeParamsObjectDialogPhe) => {
    if (params.masterDataState !== 'BAYAR') {
        let instance = (document!.getElementById('gridPheList') as any).ej2_instances[0];
        if (instance) {
            instance.element.addEventListener('mouseup', function (e: any) {
                if ((e.target as HTMLElement).classList.contains('e-rowcell')) {
                    if (instance.isEdit) instance.endEdit();
                    const test = (e.target as any).getAttribute('data-colindex');
                    let index: number = parseInt((e.target as any).getAttribute('Index'));
                    instance.selectRow(index);
                    instance.startEdit();

                    if (test) {
                        document.getElementById('gridPheListbayar_mu')?.focus();
                        (document.getElementById('gridPheListbayar_mu') as any).select();
                    }
                }
            });
        }
    }
};

const onClickAutoJurnal = async (params: HandleChangeParamsObjectDialogPhe) => {
    let totalPembayaran, formattedNoReff;
    let dataJurnalPembulatan: any;
    if (params.gridPheListRef && Array.isArray(params.gridPheListRef?.dataSource)) {
        const dataSource = [...params.gridPheListRef?.dataSource]; // Salin array
        // Menghitung Total Pembayaran
        totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_mu) || 0), 0);
        // Filter data untuk hanya menyertakan item dengan kode_phe yang tidak null
        const noReffList = dataSource.filter((item) => item.kode_phe !== null).map((item) => item.no_reff);

        // Membuat string sesuai format
        formattedNoReff = noReffList.map((item) => `INV ${item}`).join(', ');
    }
    const paramObject = {
        kode_entitas: params.kode_entitas,
        pph23: params.stateDataHeader?.pph23,
        via: params.stateDataHeader?.via,
        token: params.token,
    };

    const respGetBankEks = await GetBankEks(paramObject);
    const catRek = `${respGetBankEks[0].bank} ${respGetBankEks[0].no_rek} ${respGetBankEks[0].nama_rek} `;

    const selisih = (params.stateDataHeader?.jumlahBayar === '' ? 0 : params.stateDataHeader?.jumlahBayar) - totalPembayaran;
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const quSetting = await fetchPreferensi(params.kode_entitas, apiUrl);
    const dataJurnalArry = [
        {
            id: 1,
            kode_akun: params.stateDataHeader?.kodeAkunJurnal1,
            no_akun: params.stateDataHeader?.noAkun1,
            nama_akun: params.stateDataHeader?.namaAkun1,
            tipe: params.stateDataHeader?.tipeAkun,
            isledger: '',
            // kode_subledger: stateDataHeader?.kodeSupplierValue,
            // no_subledger: stateDataHeader?.noSupplierValue,
            // nama_subledger: stateDataHeader?.namaSupplierValue,
            kode_subledger: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            debet_rp: params.stateDataHeader?.kurs * totalPembayaran,
            kredit_rp: 0,
            kurs: params.stateDataHeader?.kurs,
            mu: 'IDR',
            departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
            kode_dept: params.stateDataHeader?.kodeDept,
            jumlah_mu: params.stateDataHeader?.kurs * totalPembayaran,
            catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
            kode_jual: params.stateDataHeader?.kodeJual,
            nama_jual: params.stateDataHeader?.kodeJual,
        },
        {
            id: 4,
            kode_akun: params.stateDataHeader?.kodeAkunJurnal2,
            no_akun: params.stateDataHeader?.noAkun2,
            nama_akun: params.stateDataHeader?.namaAkun2,
            tipe: params.stateDataHeader?.tipeAkun,
            isledger: '',
            kode_subledger: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            debet_rp: 0,
            kredit_rp: params.stateDataHeader?.kurs * parseFloat(params.stateDataHeader?.jumlahBayar),
            kurs: params.stateDataHeader?.kurs,
            mu: 'IDR',
            departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
            kode_dept: params.stateDataHeader?.kodeDept,
            jumlah_mu: params.stateDataHeader?.kurs * parseFloat(params.stateDataHeader?.jumlahBayar) * -1,
            catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
            kode_jual: params.stateDataHeader?.kodeJual,
            nama_jual: params.stateDataHeader?.kodeJual,
        },
    ];

    if (selisih < 0) {
        if (selisih >= -1000) {
            dataJurnalPembulatan = [
                {
                    id: 2,
                    kode_akun: quSetting[0].kode_akun_pendbulat,
                    no_akun: quSetting[0].no_pend_bulat,
                    nama_akun: quSetting[0].nama_pend_bulat,
                    tipe: quSetting[0].tipe_pend_bulat,

                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: 0,
                    kredit_rp: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih * -1 : params.stateDataHeader?.kurs * 1000,
                    kurs: params.stateDataHeader?.kurs,
                    mu: 'IDR',
                    departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                    kode_dept: params.stateDataHeader?.kodeDept,
                    jumlah_mu: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                    catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                    kode_jual: params.stateDataHeader?.kodeJual,
                    nama_jual: params.stateDataHeader?.kodeJual,
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
                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: 0,
                    kredit_rp: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih * -1 : params.stateDataHeader?.kurs * 1000,
                    kurs: params.stateDataHeader?.kurs,
                    mu: 'IDR',
                    departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                    kode_dept: params.stateDataHeader?.kodeDept,
                    jumlah_mu: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000 * -1,
                    catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                    kode_jual: params.stateDataHeader?.kodeJual,
                    nama_jual: params.stateDataHeader?.kodeJual,
                },
                {
                    id: 3,
                    kode_akun: quSetting[0].kode_akun_pendbulat,
                    no_akun: quSetting[0].no_pend_bulat,
                    nama_akun: quSetting[0].nama_pend_bulat,
                    tipe: quSetting[0].tipe_pend_bulat,
                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: 0,
                    kredit_rp: (params.stateDataHeader?.kurs * selisih + 1000) * -1,
                    kurs: params.stateDataHeader?.kurs,
                    mu: 'IDR',
                    departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                    kode_dept: params.stateDataHeader?.kodeDept,
                    jumlah_mu: params.stateDataHeader?.kurs * selisih + 1000,
                    catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                    kode_jual: params.stateDataHeader?.kodeJual,
                    nama_jual: params.stateDataHeader?.kodeJual,
                },
            ];
        }

        params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
        const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

        params.gridPheJurnalListRef?.setProperties({ dataSource: mergedDataSource });
    } else {
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
                        // debet_rp: 0,
                        debet_rp: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                        kredit_rp: 0,
                        kurs: params.stateDataHeader?.kurs,
                        mu: 'IDR',
                        departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                        kode_dept: params.stateDataHeader?.kodeDept,
                        jumlah_mu: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                        catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                        kode_jual: params.stateDataHeader?.kodeJual,
                        nama_jual: params.stateDataHeader?.kodeJual,
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
                        debet_rp: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                        kredit_rp: 0,
                        kurs: params.stateDataHeader?.kurs,
                        mu: 'IDR',
                        departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                        kode_dept: params.stateDataHeader?.kodeDept,
                        jumlah_mu: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,

                        catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                        kode_jual: params.stateDataHeader?.kodeJual,
                        nama_jual: params.stateDataHeader?.kodeJual,
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
                        debet_rp: params.stateDataHeader?.kurs * selisih - 1000,
                        kredit_rp: 0,
                        kurs: params.stateDataHeader?.kurs,
                        mu: 'IDR',
                        departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                        kode_dept: params.stateDataHeader?.kodeDept,
                        jumlah_mu: params.stateDataHeader?.kurs * selisih - 1000,
                        catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                        kode_jual: params.stateDataHeader?.kodeJual,
                        nama_jual: params.stateDataHeader?.kodeJual,
                    },
                ];
            }

            params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
            const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

            params.gridPheJurnalListRef?.setProperties({ dataSource: mergedDataSource });
        } else {
            params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
        }
    }

    // params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
    params.gridPheJurnalListRef?.refresh();

    const totalDebet = params.gridPheJurnalListRef?.dataSource.reduce((total: any, item: any) => {
        return total + parseFloat(item.debet_rp);
    }, 0);
    const totalKredit = params.gridPheJurnalListRef?.dataSource.reduce((total: any, item: any) => {
        return total + parseFloat(item.kredit_rp);
    }, 0);

    params.setStateDataFooter((prevState: any) => ({
        ...prevState,
        totalDebet: totalDebet,
        totalKredit: totalKredit,
        totalSelisih: totalDebet - totalKredit,
    }));

    // await setDataJurnal({ nodes: dataJurnalArry });
    // await GenerateTotalJurnal(dataJurnal, setDataJurnal, setStateDataDetail);
};

const onClickAutoJurnalBatalApp = async (params: HandleChangeParamsObjectDialogPhe) => {
    let totalPembayaran, formattedNoReff;
    let dataJurnalPembulatan: any;
    if (params.gridPheListRef && Array.isArray(params.gridPheListRef?.dataSource)) {
        const dataSource = [...params.gridPheListRef?.dataSource]; // Salin array
        // Menghitung Total Pembayaran
        totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_mu) || 0), 0);
        // Filter data untuk hanya menyertakan item dengan kode_phe yang tidak null
        const noReffList = dataSource.filter((item) => item.kode_phe !== null).map((item) => item.no_reff);

        // Membuat string sesuai format
        formattedNoReff = noReffList.map((item) => `INV ${item}`).join(', ');
    }
    const paramObject = {
        kode_entitas: params.kode_entitas,
        pph23: params.stateDataHeader?.pph23,
        via: params.stateDataHeader?.via,
        token: params.token,
    };

    const respGetBankEks = await GetBankEks(paramObject);
    const catRek = `${respGetBankEks[0].bank} ${respGetBankEks[0].no_rek} ${respGetBankEks[0].nama_rek} `;

    const selisih = (params.stateDataHeader?.jumlahBayar === '' ? 0 : params.stateDataHeader?.jumlahBayar) - totalPembayaran;
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const quSetting = await fetchPreferensi(params.kode_entitas, apiUrl);
    const dataJurnalArry = [
        {
            id: 1,
            kode_akun: params.stateDataHeader?.kodeAkunJurnal1,
            no_akun: params.stateDataHeader?.noAkun1,
            nama_akun: params.stateDataHeader?.namaAkun1,
            tipe: params.stateDataHeader?.tipeAkun,
            isledger: '',
            // kode_subledger: stateDataHeader?.kodeSupplierValue,
            // no_subledger: stateDataHeader?.noSupplierValue,
            // nama_subledger: stateDataHeader?.namaSupplierValue,
            kode_subledger: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            // debet_rp: params.stateDataHeader?.kurs * totalPembayaran,
            // kredit_rp: 0,
            debet_rp: 0,
            kredit_rp: params.stateDataHeader?.kurs * totalPembayaran,
            kurs: params.stateDataHeader?.kurs,
            mu: 'IDR',
            departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
            kode_dept: params.stateDataHeader?.kodeDept,
            jumlah_mu: params.stateDataHeader?.kurs * totalPembayaran * -1,
            catatan:
                '[REV.JU ' +
                params.stateDataHeader?.noDokumen +
                '] PHE. ' +
                params.stateDataHeader?.noPheValue +
                ', ' +
                params.kode_entitas +
                ', EXP ' +
                params.stateDataHeader?.via +
                ', ' +
                formattedNoReff +
                ', TR ' +
                catRek,
            kode_jual: params.stateDataHeader?.kodeJual,
            nama_jual: params.stateDataHeader?.kodeJual,
        },
        {
            id: 4,
            kode_akun: params.stateDataHeader?.kodeAkunJurnal2,
            no_akun: params.stateDataHeader?.noAkun2,
            nama_akun: params.stateDataHeader?.namaAkun2,
            tipe: params.stateDataHeader?.tipeAkun,
            isledger: '',
            kode_subledger: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            // debet_rp: 0,
            // kredit_rp: params.stateDataHeader?.kurs * parseFloat(params.stateDataHeader?.jumlahBayar),
            debet_rp: params.stateDataHeader?.kurs * parseFloat(params.stateDataHeader?.jumlahBayar),
            kredit_rp: 0,
            kurs: params.stateDataHeader?.kurs,
            mu: 'IDR',
            departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
            kode_dept: params.stateDataHeader?.kodeDept,
            jumlah_mu: params.stateDataHeader?.kurs * parseFloat(params.stateDataHeader?.jumlahBayar),
            catatan: '[REV] PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
            kode_jual: params.stateDataHeader?.kodeJual,
            nama_jual: params.stateDataHeader?.kodeJual,
        },
    ];

    if (selisih < 0) {
        if (selisih >= -1000) {
            dataJurnalPembulatan = [
                {
                    id: 2,
                    kode_akun: quSetting[0].kode_akun_pendbulat,
                    no_akun: quSetting[0].no_pend_bulat,
                    nama_akun: quSetting[0].nama_pend_bulat,
                    tipe: quSetting[0].tipe_pend_bulat,

                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih * -1 : params.stateDataHeader?.kurs * 1000,
                    kredit_rp: 0,
                    kurs: params.stateDataHeader?.kurs,
                    mu: 'IDR',
                    departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                    kode_dept: params.stateDataHeader?.kodeDept,
                    jumlah_mu: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                    catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                    kode_jual: params.stateDataHeader?.kodeJual,
                    nama_jual: params.stateDataHeader?.kodeJual,
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
                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih * -1 : params.stateDataHeader?.kurs * 1000,
                    kredit_rp: 0,
                    kurs: params.stateDataHeader?.kurs,
                    mu: 'IDR',
                    departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                    kode_dept: params.stateDataHeader?.kodeDept,
                    jumlah_mu: selisih >= -1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000 * -1,
                    catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                    kode_jual: params.stateDataHeader?.kodeJual,
                    nama_jual: params.stateDataHeader?.kodeJual,
                },
                {
                    id: 3,
                    kode_akun: quSetting[0].kode_akun_pendbulat,
                    no_akun: quSetting[0].no_pend_bulat,
                    nama_akun: quSetting[0].nama_pend_bulat,
                    tipe: quSetting[0].tipe_pend_bulat,
                    kode_subledger: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    debet_rp: (params.stateDataHeader?.kurs * selisih + 1000) * -1,
                    kredit_rp: 0,
                    kurs: params.stateDataHeader?.kurs,
                    mu: 'IDR',
                    departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                    kode_dept: params.stateDataHeader?.kodeDept,
                    jumlah_mu: params.stateDataHeader?.kurs * selisih + 1000,
                    catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                    kode_jual: params.stateDataHeader?.kodeJual,
                    nama_jual: params.stateDataHeader?.kodeJual,
                },
            ];
        }

        params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
        const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

        params.gridPheJurnalListRef?.setProperties({ dataSource: mergedDataSource });
    } else {
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
                        // debet_rp: 0,
                        debet_rp: 0,
                        kredit_rp: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                        kurs: params.stateDataHeader?.kurs,
                        mu: 'IDR',
                        departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                        kode_dept: params.stateDataHeader?.kodeDept,
                        jumlah_mu: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                        catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                        kode_jual: params.stateDataHeader?.kodeJual,
                        nama_jual: params.stateDataHeader?.kodeJual,
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
                        debet_rp: 0,
                        kredit_rp: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,
                        kurs: params.stateDataHeader?.kurs,
                        mu: 'IDR',
                        departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                        kode_dept: params.stateDataHeader?.kodeDept,
                        jumlah_mu: selisih <= 1000 ? params.stateDataHeader?.kurs * selisih : params.stateDataHeader?.kurs * 1000,

                        catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                        kode_jual: params.stateDataHeader?.kodeJual,
                        nama_jual: params.stateDataHeader?.kodeJual,
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
                        debet_rp: 0,
                        kredit_rp: params.stateDataHeader?.kurs * selisih - 1000,
                        kurs: params.stateDataHeader?.kurs,
                        mu: 'IDR',
                        departemen: params.stateDataHeader?.noDept + ' - ' + params.stateDataHeader?.namaDept,
                        kode_dept: params.stateDataHeader?.kodeDept,
                        jumlah_mu: params.stateDataHeader?.kurs * selisih - 1000,
                        catatan: 'PHE. ' + params.stateDataHeader?.noPheValue + ', ' + params.kode_entitas + ', EXP ' + params.stateDataHeader?.via + ', ' + formattedNoReff + ', TR ' + catRek,
                        kode_jual: params.stateDataHeader?.kodeJual,
                        nama_jual: params.stateDataHeader?.kodeJual,
                    },
                ];
            }

            params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
            const mergedDataSource = [...dataJurnalArry, ...dataJurnalPembulatan].sort((a, b) => a.id - b.id);

            params.gridPheJurnalListRef?.setProperties({ dataSource: mergedDataSource });
        } else {
            params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
        }
    }

    // params.gridPheJurnalListRef?.setProperties({ dataSource: dataJurnalArry });
    params.gridPheJurnalListRef?.refresh();

    const totalDebet = params.gridPheJurnalListRef?.dataSource.reduce((total: any, item: any) => {
        return total + parseFloat(item.debet_rp);
    }, 0);
    const totalKredit = params.gridPheJurnalListRef?.dataSource.reduce((total: any, item: any) => {
        return total + parseFloat(item.kredit_rp);
    }, 0);

    params.setStateDataFooter((prevState: any) => ({
        ...prevState,
        totalDebet: totalDebet,
        totalKredit: totalKredit,
        totalSelisih: totalDebet - totalKredit,
    }));

    // await setDataJurnal({ nodes: dataJurnalArry });
    // await GenerateTotalJurnal(dataJurnal, setDataJurnal, setStateDataDetail);
};

const batalSemuaInvoice = (params: HandleChangeParamsObjectDialogPhe) => {
    if (params.gridPheListRef && Array.isArray(params.gridPheListRef.dataSource)) {
        const dataSource = [...params.gridPheListRef.dataSource]; // Salin array

        // Perbarui elemen yang memiliki idAlokasiDana
        dataSource.forEach((item) => {
            item.sisa_hutang = item.sisaFix;
            item.bayar_mu = 0; // Set nilai bayar_mu menjadi nol
            item.bayar_muFix = 0;
        });

        // Menghitung total netto_mu
        const totalNettoMu = dataSource.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
        // Menghitung Total Pembayaran
        const totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_muFix) || 0), 0);

        params.setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalHutang: totalNettoMu,
            totalPembayaran: totalPembayaran,
            sisaHutang: totalNettoMu - totalPembayaran,
            selisihAlokasiDana: (params.stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(params.stateDataHeader?.jumlahBayar)) - totalPembayaran,
        }));

        // Perbarui data source grid
        params.gridPheListRef.dataSource = dataSource;
        // Refresh grid
        params.gridPheListRef.refresh();
        params.setPlagButtonbayarInvoice('Bayar');
    } else {
        console.error('Grid reference atau data source tidak valid');
    }
};

const bayarSemuaInvoice = (params: HandleChangeParamsObjectDialogPhe) => {
    if (params.gridPheListRef && Array.isArray(params.gridPheListRef.dataSource)) {
        if (params.gridPheListRef?.dataSource.length > 0) {
            const dataSource = [...params.gridPheListRef.dataSource]; // Salin array

            // Perbarui elemen yang memiliki idAlokasiDana
            dataSource.forEach((item) => {
                item.sisa_hutang = 0;
                item.bayar_mu = item.sisaFix; // Set nilai bayar_mu menjadi nol
                item.bayar_muFix = item.sisaFix;
            });

            // Menghitung total netto_mu
            const totalNettoMu = dataSource.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
            // Menghitung Total Pembayaran
            const totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_muFix) || 0), 0);

            params.setStateDataFooter((prevState: any) => ({
                ...prevState,
                totalHutang: totalNettoMu,
                totalPembayaran: totalPembayaran,
                sisaHutang: totalNettoMu - totalPembayaran,
                selisihAlokasiDana: (params.stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(params.stateDataHeader?.jumlahBayar)) - totalPembayaran,
            }));

            // Perbarui data source grid
            params.gridPheListRef.dataSource = dataSource;
            // Refresh grid
            params.gridPheListRef.refresh();
            params.setPlagButtonbayarInvoice('Batal');
        }
    } else {
        console.error('Grid reference atau data source tidak valid');
    }
};

const handleDelete = (tipe: any, params: HandleChangeParamsObjectDialogPhe) => {
    if (tipe === 'delete') {
        if (params.gridPheListRef && Array.isArray(params.gridPheListRef.dataSource)) {
            const dataSource = [...params.gridPheListRef.dataSource]; // Salin array

            // Perbarui elemen yang memiliki idAlokasiDana
            dataSource.forEach((item) => {
                if (item.id === params.idAlokasiDana) {
                    item.sisa_hutang = item.sisaFix;
                    item.bayar_mu = 0; // Set nilai bayar_mu menjadi nol
                    item.bayar_muFix = 0;
                }
            });

            // Menghitung total netto_mu
            const totalNettoMu = dataSource.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
            // Menghitung Total Pembayaran
            const totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_muFix) || 0), 0);

            params.setStateDataFooter((prevState: any) => ({
                ...prevState,
                totalHutang: totalNettoMu,
                totalPembayaran: totalPembayaran,
                sisaHutang: totalNettoMu - totalPembayaran,
                selisihAlokasiDana: (params.stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(params.stateDataHeader?.jumlahBayar)) - totalPembayaran,
            }));

            // Perbarui data source grid
            params.gridPheListRef.dataSource = dataSource;
            // Refresh grid
            params.gridPheListRef.refresh();
        } else {
            console.error('Grid reference atau data source tidak valid');
        }
    } else {
        if (params.gridPheListRef && Array.isArray(params.gridPheListRef.dataSource)) {
            const dataSource = [...params.gridPheListRef.dataSource]; // Salin array

            // Perbarui elemen yang memiliki idAlokasiDana
            dataSource.forEach((item) => {
                if (item.bayar_mu > 0) {
                    item.sisa_hutang = item.sisaFix;
                    item.bayar_mu = 0; // Set nilai bayar_mu menjadi nol
                    item.bayar_muFix = 0;
                }
            });

            // Menghitung total netto_mu
            const totalNettoMu = dataSource.reduce((sum: any, item: any) => sum + (item.netto_mu || 0), 0);
            // Menghitung Total Pembayaran
            const totalPembayaran = dataSource.reduce((sum: any, item: any) => sum + (parseFloat(item.bayar_muFix) || 0), 0);

            params.setStateDataFooter((prevState: any) => ({
                ...prevState,
                totalHutang: totalNettoMu,
                totalPembayaran: totalPembayaran,
                sisaHutang: totalNettoMu - totalPembayaran,
                selisihAlokasiDana: (params.stateDataHeader?.jumlahBayar === '' ? 0 : parseFloat(params.stateDataHeader?.jumlahBayar)) - totalPembayaran,
            }));

            // Perbarui data source grid
            params.gridPheListRef.dataSource = dataSource;
            // Refresh grid
            params.gridPheListRef.refresh();
        } else {
            console.error('Grid reference atau data source tidak valid');
        }
    }
};

const clearAllImages = (params: HandleChangeParamsObjectDialogPhe) => {
    params.setTipeSelectedBersihkangambar('bersihkan');
    params.setLoadFilePendukung((prevLoadFilePendukung: any) => {
        const removedIds = prevLoadFilePendukung.map((item: any) => item.id_dokumen); // Mengambil semua ID dokumen yang akan dihapus

        // Mengubah array ID yang dihapus menjadi string dengan format '1,2'
        const removedIdsString = removedIds.join(',');

        // Memperbarui state selectedBersihkangambar dengan string ID yang dihapus
        params.setSelectedBersihkangambar((prevSelectedBersihkangambar: any) => {
            if (!prevSelectedBersihkangambar) {
                return removedIdsString;
            } else {
                // Memeriksa apakah ID sudah ada dalam string sebelumnya
                const updatedString = removedIds.every((id: any) => prevSelectedBersihkangambar.indexOf(id.toString()) === -1) ? `,${removedIdsString}` : '';
                return prevSelectedBersihkangambar + updatedString;
            }
        });

        // Mengembalikan array kosong untuk menghapus semua data
        return [];
    });

    params.setImages([]);

    params.setSelectedFiles([]);
    params.setLoadFilePendukung([]);
    // Mengatur ulang input file
    params.tabs.forEach((_: any, index: any) => {
        const input = document.getElementById(`imageInput${index}`) as HTMLInputElement;
        if (input) {
            input.value = ''; // Mengatur nilai input file ke kosong
        }
    });
};

const clearImage = (tabIndex: number, params: HandleChangeParamsObjectDialogPhe) => {
    params.setTipeSelectedBersihkangambar('bersihkan');
    const foundItem = params.loadFilePendukung.find((item: any) => parseFloat(item.id_dokumen) - 1 === tabIndex);
    params.setLoadFilePendukung((prevLoadFilePendukung: any) => {
        const removedIds = prevLoadFilePendukung.filter((item: any) => parseFloat(item.id_dokumen) - 1 === tabIndex).map((item: any) => item.id_dokumen);
        const newLoadFilePendukung = prevLoadFilePendukung.filter((item: any) => parseFloat(item.id_dokumen) - 1 === tabIndex);

        // Mengubah array ID yang dihapus menjadi string dengan format '1,2'
        const removedIdsString = removedIds.join(',');

        // Memperbarui state selectedBersihkangambar dengan string ID yang dihapus
        params.setSelectedBersihkangambar((prevSelectedBersihkangambar: any) => {
            if (!prevSelectedBersihkangambar) {
                return removedIdsString;
            } else {
                // Memeriksa apakah ID sudah ada dalam string sebelumnya
                const updatedString = removedIds.every((id: any) => prevSelectedBersihkangambar.indexOf(id.toString()) === -1) ? `,${removedIdsString}` : '';
                return prevSelectedBersihkangambar + updatedString;
            }
        });

        return newLoadFilePendukung;
    });

    params.setImages((prevImages: any) => {
        const newImages = [...prevImages];
        newImages[tabIndex] = [];
        return newImages;
    });
    params.setSelectedFiles((prevSelectedFiles: any) => {
        const newSelectedFiles = prevSelectedFiles.filter((file: any) => file.tabIndex !== tabIndex);
        return newSelectedFiles;
    });
    params.setLoadFilePendukung((prevSelectedFiles: any) => {
        const newSelectedFiles = params.loadFilePendukung.filter((file: any) => parseFloat(file.id_dokumen) - 1 !== tabIndex);
        return newSelectedFiles;
    });
};

const loadDataImage = async (kode_phe: any, params: HandleChangeParamsObjectDialogPhe) => {
    const responseDataImage = await GetTbImagesPhe(params.kode_entitas, kode_phe);
    params.setLoadFilePendukung(responseDataImage);
};

const handleFileUpload = (e: any, tabIndex: any, params: HandleChangeParamsObjectDialogPhe) => {
    // Implement your file upload logic here
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const imageData = reader.result;
        if (typeof imageData === 'string') {
            params.setImages((prevImages: any) => {
                const newImages = [...prevImages];
                newImages[tabIndex] = [imageData];
                return newImages;
            });
        }
    };
    reader.readAsDataURL(file);
    const newFiles = [...e.target.files];
    if (params.selectedFile === 'update') {
        params.setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);

        const newNamaFiles = new Array(newFiles.length).fill(params.formattedName);
        params.setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, params.fileGambar.substring(0, params.fileGambar.length - 4)]);
    }
    if (params.selectedFile === 'baru') {
        params.setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);

        const newNamaFiles = new Array(newFiles.length).fill(params.formattedName);
        params.setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, params.formattedName]);
    }
};

const handleClick = async (tabIndex: any, params: HandleChangeParamsObjectDialogPhe) => {
    if (params.masterKodeDokumen !== 'BARU') {
        const load = await LoadImagesPhe(params.kode_entitas, params.masterKodeDokumen);
        const filterLoad = load.filter((item: any) => parseFloat(item.id_dokumen) - 1 === tabIndex);

        if (filterLoad > 0) {
            params.setSelectedFile('update');
            params.setFileGambar(filterLoad[0].filegambar);
        } else {
            params.setFileGambar('');
            params.setSelectedFile('baru');
        }
    } else {
        params.setFileGambar('');
        params.setSelectedFile('baru');
    }

    const input = document.getElementById(`imageInput${tabIndex}`) as HTMLInputElement;
    if (input) {
        input.click();
    }
    // Implement your button click logic here
};

const handleCloseZoom = (setIsOpenPreview: Function, setImageDataUrl: Function) => {
    setIsOpenPreview(false);
    setImageDataUrl('');
};

const handleZoomIn = (setZoomScale: Function) => {
    setZoomScale((prevScale: any) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
};

const handleZoomOut = (setZoomScale: Function) => {
    setZoomScale((prevScale: any) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
};

const totBayarMu = (args: any) => {
    const bayarMu = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(tanpaKoma(item.bayar_mu) === '' ? '0' : tanpaKoma(item.bayar_mu));
    }, 0);
    return frmNumber(bayarMu);
};

export {
    totBayarMu,
    handleCloseZoom,
    handleZoomIn,
    handleZoomOut,
    handleDoubleClickApp,
    onClickAutoJurnalBatalApp,
    handleClick,
    handleFileUpload,
    loadDataImage,
    clearImage,
    clearAllImages,
    handleDelete,
    bayarSemuaInvoice,
    batalSemuaInvoice,
    onClickAutoJurnal,
    load,
    OpenPreviewInsert,
    handleRowSelected,
    handleDoubleClick,
    cekTglBackDate,
    cekTglMinusSatu,
    Terbilang,
    handleJumlahBayar,
    handlePph23Change,
    frmNumberSyncfusion,
    currencyFormat,
    handleNamaEkspedisiChange,
    swalDialog,
    swalToast,
    swalPopUp,
    pencarianBayar,
    showLoading1,
    pencarianNoPhe,
};
