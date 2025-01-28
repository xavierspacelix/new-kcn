import swal from 'sweetalert2';
import moment from 'moment';
import { DataDetailDok, GetListDlgMkTtb, GetPeriode, ListCustFilter, ListDlgFj, ListDlgTtb } from '../model/api';
import withReactContent from 'sweetalert2-react-content';
import styles from '../mklist.module.css';
import { HandleModaliconChange } from './fungsiFrmMk';
import React from 'react';
import { Refresh } from '@mui/icons-material';

export const swalToast = swal.mixin({
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

const ButtonUbah = (kode_mk: any, tipe: any) => {
    const base64EncodedString = btoa(`kode_ttb=${kode_mk}&tipe=${tipe}`);
    return base64EncodedString;
};
export const ButtonDetailDok = (kode_mk: any) => {
    return kode_mk;
};

export const ListDetailDok = async (kode_mk: any, kode_entitas: any, setDetailDok: Function) => {
    try {
        const result: any[] = await DataDetailDok(kode_mk, kode_entitas);
        const modifiedDetailDok: any = result.map((item: any) => ({
            ...item,
            qty: parseFloat(item.qty),
            harga_mu: parseFloat(item.harga_mu),
            potongan_mu: parseFloat(item.potongan_mu),
            jumlah_mu: parseFloat(item.jumlah_mu),
        }));

        // console.log(modifiedDetailDok);

        setDetailDok(modifiedDetailDok);
    } catch (error) {
        console.error('Error:', error);
    }
};

const OnClick_CetakFormMk = (selectedRowKodeMk: any, kode_entitas: string) => {
    if (selectedRowKodeMk === '') {
        // swal.fire({
        //     title: 'Pilih Data terlebih dahulu.',
        //     icon: 'error',
        // });
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;">Silahkan pilih data MK terlebih dahulu</p>',
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
            <title>Form Tanda Terima Barang | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/form_ttb?entitas=${kode_entitas}&kode_ttb=${selectedRowKodeMk}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

    let win = window.open(
        '',
        '_blank',
        `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`,
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

const SetDataDokumenMk = async (tipe: string, selectedRowKodeMk: string, kode_entitas: string, dataDetailDokMk: any, router: any, setSelectedItem: Function, setDetailDok: Function) => {
    if (selectedRowKodeMk !== '') {
        if (tipe === 'ubah') {
            const responseData: any[] = await GetPeriode(kode_entitas);
            const periode = responseData[0].periode;
            const tanggalMomentPeriode = moment(periode, 'YYYYMM');
            const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

            const tglPembanding = moment(dataDetailDokMk.tgl_mk).format('YYYYMM');

            // Mendapatkan tahun dan bulan dari setiap tanggal
            const yearA = parseInt(periodeTahunBulan.substring(0, 4));
            const monthA = parseInt(periodeTahunBulan.substring(4, 6));

            const yearB = parseInt(tglPembanding.substring(0, 4));
            const monthB = parseInt(tglPembanding.substring(4, 6));

            if (yearB < yearA || (yearB === yearA && monthB < monthA)) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else {
                const result = ButtonUbah(selectedRowKodeMk, 'Ubah');
                router.push({ pathname: './mk', query: { str: result } });
            }
        } else if (tipe === 'detailDok') {
            const result = ButtonDetailDok(selectedRowKodeMk);
            setSelectedItem(result);
            ListDetailDok(result, kode_entitas, setDetailDok);
        } else if (tipe === 'cetak') {
            OnClick_CetakFormMk(selectedRowKodeMk, kode_entitas);
        }
    } else {
        // swal.fire({
        //     title: 'Pilih Data terlebih dahulu.',
        //     icon: 'error',
        //     timer: 2000,
        //     showConfirmButton: false,
        // });
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px; color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
    }
};
const PencarianNoMk = async (event: string, setSearchNoMk: Function, setFilteredData: Function, recordsData: any[]) => {
    const searchValue = event;
    setSearchNoMk(searchValue);
    const filteredData = SearchDataNoMk(searchValue, recordsData);
    setFilteredData(filteredData);

    const cariNoReff = document.getElementById('cariNoReff') as HTMLInputElement;
    if (cariNoReff) {
        cariNoReff.value = '';
    }
};
const SearchDataNoMk = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.no_mk.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

const SearchDataNamaCust = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.no_reff.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

const PencarianNamaCust = async (event: string, setSearchNamaCust: Function, setFilteredData: Function, recordsData: any[]) => {
    const searchValue = event;
    setSearchNamaCust(searchValue);
    const filteredData = SearchDataNamaCust(searchValue, recordsData);
    setFilteredData(filteredData);

    const cariNoMk = document.getElementById('cariNoMk') as HTMLInputElement;
    if (cariNoMk) {
        cariNoMk.value = '';
    }
};

const HandleNoMkInputChange = (event: string, setNoMkValue: Function, setIsNoMkChecked: Function) => {
    // console.log(event);
    const newValue = event;
    setNoMkValue(newValue);
    setIsNoMkChecked(newValue.length > 0);
};

const HandleTgl = async (date: any, tipe: string, setTglAwal: Function, setTglAkhir: Function, setIsTanggalChecked: Function) => {
    if (tipe === 'tanggalAwal') {
        setTglAwal(date);
        setIsTanggalChecked(true);
    } else {
        setTglAkhir(date);
        setIsTanggalChecked(true);
    }
};

const HandleNoFakturInputChange = (event: string, setNoFakturValue: Function, setIsNoFakturChecked: Function) => {
    const newValue = event;
    setNoFakturValue(newValue);
    setIsNoFakturChecked(newValue.length > 0);
};

const HandleNoTtbInputChange = (event: string, setNoFakturValue: Function, setIsNoFakturChecked: Function) => {
    const newValue = event;
    setNoFakturValue(newValue);
    setIsNoFakturChecked(newValue.length > 0);
};

const HandleNoCustInputChange = (event: string, setNoFakturValue: Function, setIsNoFakturChecked: Function) => {
    const newValue = event;
    setNoFakturValue(newValue);
    setIsNoFakturChecked(newValue.length > 0);
};

const HandleNamaCustInputChange = (event: string, setNamaCustValue: Function, setIsNamaCustChecked: Function) => {
    const newValue = event;
    setNamaCustValue(newValue);
    setIsNamaCustChecked(newValue.length > 0);
};

const HandleRowSelected = (args: any, setSelectedRowKodeMk: Function) => {
    setSelectedRowKodeMk(args.data?.kode_mk);
};

const HandleRowDoubleClicked = async (args: any, userMenu: any, kode_entitas: string, router: any, gridListData: any, selectedListData: any[]) => {
    const rowIndex: number = args.row.rowIndex;
    gridListData.selectRow(rowIndex);
    selectedListData = gridListData.getSelectedRecords();

    if (userMenu.edit !== 'N') {
        const responseData: any[] = await GetPeriode(kode_entitas);
        const periode = responseData[0].periode;
        const tanggalMomentPeriode = moment(periode, 'YYYYMM');
        const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

        const tglPembanding = moment(selectedListData[0].tgl_mk).format('YYYYMM');

        // Mendapatkan tahun dan bulan dari setiap tanggal
        const yearA = parseInt(periodeTahunBulan.substring(0, 4));
        const monthA = parseInt(periodeTahunBulan.substring(4, 6));

        const yearB = parseInt(tglPembanding.substring(0, 4));
        const monthB = parseInt(tglPembanding.substring(4, 6));

        if (yearB < yearA || (yearB === yearA && monthB < monthA)) {
            // swal.fire({
            //     html: `<span style='color: gray; font-weight: bold;'><b>Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</b></span>`,
            //     icon: 'warning',
            //     // timer: 2000,
            //     showConfirmButton: true,
            // });
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        } else {
            const result = RowDoubleClick(selectedListData[0].kode_mk, 'Ubah');
            router.push({ pathname: './component/frmMk', query: { str: result } });
        }
    }
};

const RowDoubleClick = (kode_mk: any, tipe: string) => {
    const base64EncodedString = btoa(`kode_mk=${kode_mk}&tipe=${tipe}`);
    return base64EncodedString;
};

const RowSelectingListData = (args: any, setDataDetailDokMk: Function, kode_entitas: string, setDetailDok: Function) => {
    // console.log(args.data);
    ListDetailDok(args.data?.kode_mk, kode_entitas, setDetailDok);
    setDataDetailDokMk((prevState: any) => ({
        ...prevState,
        no_mk: args.data?.no_mk,
        tgl_mk: args.data?.tgl_mk,
    }));
};

const checkboxTemplate = (props: any) => {
    // Jika nilai kolom "gagal" adalah "Y", centang checkbox, jika tidak, kosongkan
    const checkboxStyle = {
        backgroundColor: props.gagal === 'Y' ? '#f2f2f2' : 'transparent', // Menyesuaikan latar belakang berdasarkan nilai "gagal"
    };
    return <input type="checkbox" checked={props.gagal === 'Y'} style={checkboxStyle} readOnly />;
};

//=================================================================================
// Fungsi untuk Memsaukan data Customer sesuai dengan customer yang dipilih
// const refNamaCust = { current: null };
// const refKodeCust = { current: null };
// const refKodeRelasi = { current: null };
// const refnoCust = { current: null };
const HandleSelectedDataCustomer = (dataObject: any, tipe: string, setCustSelected: Function, setCustSelectedKode: Function, setSelectedKodeRelasi: Function, setModal2: Function) => {
    setCustSelectedKode(dataObject[0].kode_cust);
    setCustSelected(dataObject[0]?.nama_relasi);

    setSelectedKodeRelasi(dataObject[0].kode_relasi);

    // refNamaCust.current = dataObject[0].nama_relasi;
    // refKodeCust.current = dataObject[0].kode_cust;
    // refKodeRelasi.current = dataObject[0].kode_relasi;
    // refnoCust.current = dataObject[0].no_cust;
    if (tipe === 'row') {
        setModal2(true);
    }
};

//===================================== DIALOG TTB ============================================
const FetchDlgListTtb = async (kode_entitas: string, kodeCust: string, kodeFj: string, setDsDaftarDlgTtb: Function) => {
    try {
        // console.log('sfafffffffffffffffffffff');
        const response = await ListDlgTtb(kode_entitas, kodeCust, kodeFj, 'all', 'all');
        // console.log('response ', response);
        if (response.status) {
            setDsDaftarDlgTtb(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const searchDataNoTtb = async (keyword: any, kode_entitas: string, kodeCust: string, kodeFj: string, setFilteredDataDlgTtb: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListDlgTtb(kode_entitas, kodeCust, kodeFj, keyword, 'all');
        if (response.status) {
            setFilteredDataDlgTtb(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNoTtb = (event: any, setSearchKeywordNoTtb: Function, kode_entitas: string, kodeCust: string, kodeFj: string, setFilteredDataDlgTtb: Function) => {
    const searchValue = event;
    setSearchKeywordNoTtb(searchValue);
    const filteredData = searchDataNoTtb(searchValue, kode_entitas, kodeCust, kodeFj, setFilteredDataDlgTtb);
    // const noFjInput = document.getElementById('noFj') as HTMLInputElement;
    const tglTtbInput = document.getElementById('tglTtb') as HTMLInputElement;

    // if (noFjInput) {
    //     noFjInput.value = '';
    // }
    if (tglTtbInput) {
        tglTtbInput.value = '';
    }
};

const searchDataTglTtb = async (keyword: any, kode_entitas: string, kodeCust: string, kodeFj: string, setFilteredDataDlgTtb: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListDlgTtb(kode_entitas, kodeCust, kodeFj, 'all', keyword);
        if (response.status) {
            setFilteredDataDlgTtb(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchTglTtb = (event: any, setSearchKeywordTglTtb: Function, kode_entitas: string, kodeCust: string, kodeFj: string, setFilteredDataTtb: Function) => {
    const searchValue = event;
    setSearchKeywordTglTtb(searchValue);
    const filteredData = searchDataTglTtb(searchValue, kode_entitas, kodeCust, kodeFj, setFilteredDataTtb);
    const tglTtbInput = document.getElementById('noFj') as HTMLInputElement;

    if (tglTtbInput) {
        tglTtbInput.value = '';
    }
};

//===================================== END DIALOG TB ============================================

//===================================== DIALOG FJ ============================================
const FetchDlgListFj = async (kode_entitas: string, kodeCust: string, setDsDaftarDlgFj: Function) => {
    try {
        // console.log(keyword);
        // console.log(kode_entitas);
        // console.log(kodeCust);
        // console.log(setDsDaftarFj);
        const response = await ListDlgFj(kode_entitas, kodeCust, 'all', 'all');
        // console.log('response ', response);
        if (response.status) {
            setDsDaftarDlgFj(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const searchDataNoFj = async (keyword: any, kode_entitas: string, kodeCust: string, setFilteredDataDlgFj: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListDlgFj(kode_entitas, kodeCust, keyword, 'all');
        if (response.status) {
            setFilteredDataDlgFj(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNoFj = (event: any, setSearchKeywordNoFj: Function, kode_entitas: string, kodeCust: string, setFilteredDataDlgFj: Function) => {
    const searchValue = event;
    // console.log('setSearchKeywordNoFj ', setSearchKeywordNoFj);
    setSearchKeywordNoFj(searchValue);
    const filteredData = searchDataNoFj(searchValue, kode_entitas, kodeCust, setFilteredDataDlgFj);
    // const noFjInput = document.getElementById('noFj') as HTMLInputElement;
    const tglFjInput = document.getElementById('tglFj') as HTMLInputElement;

    // if (noFjInput) {
    //     noFjInput.value = '';
    // }
    if (tglFjInput) {
        tglFjInput.value = '';
    }
};

const searchDataTglFj = async (keyword: any, kode_entitas: string, kodeCust: string, setFilteredDataDlgFj: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListDlgFj(kode_entitas, kodeCust, 'all', keyword);
        if (response.status) {
            setFilteredDataDlgFj(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchTglFj = (event: any, setSearchKeywordTglFj: Function, kode_entitas: string, kodeCust: string, setFilteredDataDlgFj: Function) => {
    const searchValue = event;
    setSearchKeywordTglFj(searchValue);
    const filteredData = searchDataTglFj(searchValue, kode_entitas, kodeCust, setFilteredDataDlgFj);
    const tglFjInput = document.getElementById('noFj') as HTMLInputElement;

    if (tglFjInput) {
        tglFjInput.value = '';
    }
};
//===================================== END DIALOG FJ ============================================

//===================================== DIALOG CUST ============================================
// Fungsi menampilkan Data Customer dari API
const FetchDataListCust = async (kode_entitas: string, setDsDaftarCustomer: Function) => {
    try {
        // console.log(kode_entitas);
        // console.log(setDsDaftarCustomer);

        const response = await ListCustFilter(kode_entitas, 'all', 'all', 'all');
        // console.log('response ', response);
        setDsDaftarCustomer(response);
        // if (response.status) {
        //     setDsDaftarCustomer(response);
        // }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNoCust = (event: any, setSearchKeywordNoCust: Function, kode_entitas: string, setFilteredDataDlgCust: Function) => {
    const searchValue = event;
    // console.log(searchValue);
    setSearchKeywordNoCust(searchValue);
    const filteredData = searchDataNoCust(searchValue, kode_entitas, setFilteredDataDlgCust);
    // console.log(filteredData);
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

const searchDataNoCust = async (keyword: any, kode_entitas: string, setFilteredDataDlgCust: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, keyword, 'all', 'all');
        // console.log(response)
        if (response.status) {
            setFilteredDataDlgCust(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNamaCust = (event: any, setSearchKeywordNamaCust: Function, kode_entitas: string, setFilteredDataDlgCust: Function) => {
    const searchValue = event;
    setSearchKeywordNamaCust(searchValue);
    const filteredData = searchDataNamaCust(searchValue, kode_entitas, setFilteredDataDlgCust);
    // setFilteredData(filteredData);

    const noCustInput = document.getElementById('noSales') as HTMLInputElement;
    const namaSalesInput = document.getElementById('namaSales') as HTMLInputElement;

    if (noCustInput) {
        noCustInput.value = '';
    }
    if (namaSalesInput) {
        namaSalesInput.value = '';
    }
};

const searchDataNamaCust = async (keyword: any, kode_entitas: string, setFilteredDataDlgCust: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, 'all', keyword, 'all');

        if (response.status) {
            setFilteredDataDlgCust(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNamaSales = (event: any, setSearchKeywordNamaSales: Function, kode_entitas: string, setFilteredDataDlgCust: Function) => {
    const searchValue = event;
    setSearchKeywordNamaSales(searchValue);
    const filteredData = searchDataNamaSales(searchValue, kode_entitas, setFilteredDataDlgCust);
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

const searchDataNamaSales = async (keyword: any, kode_entitas: string, setFilteredDataDlgCust: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, 'all', 'all', keyword);

        if (response.status) {
            setFilteredDataDlgCust(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

//===================================== END DIALOG CUST ============================================
//=================================================================================

//===================================== DIALOG DIALOG TtbMk ============================================
const FetchDlgTtbMk = async (paramObject: any, setDsDaftarDlgTtbMk: Function) => {
    try {
        // console.log('sfafffffffffffffffffffff');
        const response = await GetListDlgMkTtb(paramObject);
        // console.log('response ', response);
        if (response.length > 0) {
            setDsDaftarDlgTtbMk(response);
            // console.log(response);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const searchDataNoBarang = async (keyword: any, kode_entitas: string, kodeCust: string, kodeFj: string, kodeTtb: string, setFilteredDataDlgTtb: Function) => {
    let paramObject = {
        entitas: kode_entitas,
        vKodeCust: kodeCust,
        vKodeFj: kodeFj,
        vKodeTtb: kodeTtb,
        vKategori: 'all',
        vKelompok: 'all',
        vMerk: 'all',
        vNoItem: keyword,
        vNamaBarang: 'all',
    };
    try {
        const response = await GetListDlgMkTtb(paramObject);
        if (response) {
            setFilteredDataDlgTtb(response);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNoBarang = (event: any, setSearchKeywordNoBarang: Function, kode_entitas: string, kodeCust: string, kodeFj: string, kodeTtb: string, setFilteredDataDlgTtb: Function) => {
    const searchValue = event;
    // console.log('setSearchKeywordNoFj ', setSearchKeywordNoFj);
    setSearchKeywordNoBarang(searchValue);
    const filteredData = searchDataNoBarang(searchValue, kode_entitas, kodeCust, kodeFj, kodeTtb, setFilteredDataDlgTtb);
    const noItemInput = document.getElementById('noItem') as HTMLInputElement;
    if (noItemInput) {
        noItemInput.value = '';
    }
};

const searchDataNamaBarang = async (keyword: any, kode_entitas: string, kodeCust: string, kodeFj: string, kodeTtb: string, setFilteredDataDlgTtb: Function) => {
    let paramObject = {
        entitas: kode_entitas,
        vKodeCust: kodeCust,
        vKodeFj: kodeFj,
        vKodeTtb: kodeTtb,
        vKategori: 'all',
        vKelompok: 'all',
        vMerk: 'all',
        vNoItem: 'all',
        vNamaBarang: keyword,
    };
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await GetListDlgMkTtb(paramObject);

        if (response) {
            setFilteredDataDlgTtb(response);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleSearchNamaBarang = (event: any, setSearchKeywordNamaBarang: Function, kode_entitas: string, kodeCust: string, kodeFj: string, kodeTtb: string, setFilteredDataDlgTtb: Function) => {
    const searchValue = event;
    setSearchKeywordNamaBarang(searchValue);
    const filteredData = searchDataNamaBarang(searchValue, kode_entitas, kodeCust, kodeFj, kodeTtb, setFilteredDataDlgTtb);
    // setFilteredData(filteredData);

    const noItemInput = document.getElementById('noItem') as HTMLInputElement;
    const namaBarangInput = document.getElementById('namaBarang') as HTMLInputElement;

    if (noItemInput) {
        noItemInput.value = '';
    }
    if (namaBarangInput) {
        namaBarangInput.value = '';
    }
};

const HandleKategoriChange = (event: string, setSelectedOptionKetgori: Function, setIsKategoriChecked: Function) => {
    const newValue = event;
    setSelectedOptionKetgori(newValue);
    setIsKategoriChecked(newValue.length > 0);
};

const HandleKelompokChange = (event: string, setSelectedOptionKelompok: Function, setIsKelompokChecked: Function) => {
    const newValue = event;
    setSelectedOptionKelompok(newValue);
    setIsKelompokChecked(newValue.length > 0);
};

const HandleMerkChange = (event: string, setSelectedOptionMerk: Function, setIsMerkChecked: Function) => {
    const newValue = event;
    setSelectedOptionMerk(newValue);
    setIsMerkChecked(newValue.length > 0);
};

//=================================================================================
// Fungsi untuk edit detail barang di dalam rows
let currentDetailBarang: any[] = [];
const DetailBarangEdit = (gridMkList: any) => {
    currentDetailBarang = gridMkList.getSelectedRecords();
    if (currentDetailBarang.length > 0) {
        gridMkList.startEdit();
        gridMkList.sta;
    } else {
        document.getElementById('gridMkList')?.focus();
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px">Silahkan pilih data barang terlebih dahulu</p>',
            width: '100%',
            target: '#dialogTtbList',
        });
    }
};
// END
//=================================================================================

//=================================================================================
// Fungsi untuk hapus detail barang di dalam rows
const DetailBarangDelete = (gridMkDetail: any, swalDialog: any, IdDokumen: any, setIdDokumen: Function, setDataBarang: Function) => {
    currentDetailBarang = gridMkDetail.getSelectedRecords();
    // console.log(currentDetailBarang);
    // console.log(gridMkDetail.dataSource);
    const dataBarang = gridMkDetail.dataSource;
    if (currentDetailBarang.length > 0) {
        const confirm = withReactContent(swalDialog)
            .fire({
                title: `${currentDetailBarang[0].no_sj === undefined ? '' : `<p style="font-size:12px"><b>${currentDetailBarang[0].no_sj}</b></p>`}`,
                html: `<p style="font-size:12px">Apakah anda yakin akan menghapus data barang ini ( ${currentDetailBarang[0].nama_barang === undefined ? '' : currentDetailBarang[0].nama_barang})</p>`,
                width: '350px',
                heightAuto: true,
                target: '#frmMk',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '&ensp; Ya &ensp;',
                cancelButtonText: 'Tidak',
                reverseButtons: true,
            })
            .then((result) => {
                if (result.value) {
                    // console.log(currentDetailBarang[0]);
                    const diskripsi: string = currentDetailBarang[0].diskripsi;
                    gridMkDetail.deleteRecord(currentDetailBarang[0]);

                    const deleteById = (id_mk: any) => {
                        const updatedData = dataBarang.filter((item: any) => item.id_mk !== id_mk);
                        setDataBarang({ nodes: updatedData });
                    };

                    deleteById(currentDetailBarang[0].id_mk);

                    const id = IdDokumen - 1;
                    setIdDokumen(id);

                    // if (currentDetailBarang[0].kode_pp == 'ADDROW') {
                    //     console.log('ID ==>> ' + IdDokumen);
                    //     const id = IdDokumen - 1;
                    //     setIdDokumen(id);
                    // }
                    // alert('sukses dihapus');

                    // withReactContent(swalDialog).fire({
                    //     title: `<p style="font-size:12px"><b>${diskripsi}</b></p>`,
                    //     html: '<p style="font-size:12px">Data barang berhasil dihapus</p>',
                    //     icon: 'success',
                    //     width: '350px',
                    //     heightAuto: true,
                    //     showConfirmButton: false,
                    //     timer: 2000,
                    //     target: '#frmMk',
                    // });
                    swal.fire({
                        title: `<p style="font-size:12px"><b>${diskripsi}</b></p>`,
                        html: '<p style="font-size:12px">Data barang berhasil dihapus</p>',
                        icon: 'success',
                        width: '350px',
                        heightAuto: true,
                        showConfirmButton: false,
                        timer: 2000,
                        target: '#frmMk',
                    });
                } else if (result.dismiss === swal.DismissReason.cancel) {
                    //...
                }
            });
    } else {
        document.getElementById('gridMkDetail')?.focus();
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px">Silahkan pilih data barang terlebih dahulu</p>',
            width: '100%',
            target: '#frmMk',
        });
    }
};
// END
//=================================================================================

//=================================================================================
// Fungsi untuk hapus all detail barang di dalam rows
const DetailBarangDeleteAll = async (swalDialog: any, setDataBarang: Function, setTotalBarang: Function, setTotalRecords: Function, setIdDokumen: Function) => {
    document.getElementById('gridMkDetail')?.focus();
    withReactContent(swalDialog)
        .fire({
            title: ``,
            html: '<p style="font-size:12px">Apakah anda yakin akan menghapus semua data barang</p>',
            width: '350px',
            heightAuto: true,
            target: '#frmMk',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '&ensp; Ya &ensp;',
            cancelButtonText: 'Tidak',
            reverseButtons: true,
        })
        .then(async (result) => {
            if (result.value) {
                await setDataBarang((state: any) => ({
                    ...state,
                    nodes: [],
                }));
                // setDataBarang([]);
                setTotalBarang(0);
                setTotalRecords(-1);

                setIdDokumen(0);

                // withReactContent(swalDialog).fire({
                //     title: ``,
                //     html: '<p style="font-size:12px">Data semua barang berhasil dihapus</p>',
                //     icon: 'success',
                //     width: '350px',
                //     heightAuto: true,
                //     showConfirmButton: false,
                //     timer: 2000,
                //     target: '#frmMk',
                // });
                swal.fire({
                    title: ``,
                    html: '<p style="font-size:12px">Data semua barang berhasil dihapus</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 2000,
                    target: '#frmMk',
                });
            } else if (result.dismiss === swal.DismissReason.cancel) {
                //...
            }
        });
};
//=================================================================================

//===================================== END DIALOG TtbMk ============================================

export {
    HandleKelompokChange,
    HandleKategoriChange,
    HandleMerkChange,
    HandleSearchNoBarang,
    HandleSearchNamaBarang,
    HandleSearchNoTtb,
    HandleSearchTglTtb,
    HandleSearchTglFj,
    HandleSearchNoFj,
    FetchDlgTtbMk,
    FetchDataListCust,
    FetchDlgListFj,
    FetchDlgListTtb,
    RowSelectingListData,
    HandleSearchNamaSales,
    HandleSearchNoCust,
    HandleSearchNamaCust,
    HandleSelectedDataCustomer,
    HandleRowDoubleClicked,
    HandleRowSelected,
    HandleNoFakturInputChange,
    HandleNamaCustInputChange,
    HandleNoCustInputChange,
    HandleNoTtbInputChange,
    HandleTgl,
    HandleNoMkInputChange,
    PencarianNamaCust,
    PencarianNoMk,
    SetDataDokumenMk,
    ButtonUbah,
    OnClick_CetakFormMk,
    DetailBarangDelete,
    DetailBarangDeleteAll,
    // refNamaCust,
};

export default checkboxTemplate;
