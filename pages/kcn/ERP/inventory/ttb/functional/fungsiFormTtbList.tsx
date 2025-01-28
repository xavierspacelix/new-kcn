import swal from 'sweetalert2';
import moment from 'moment';
import { DataDetailDok, GetPeriode, ListCustFilter, RefreshDetailSjItemAPI, RefreshDetailSjAPI } from '../model/api';
import withReactContent from 'sweetalert2-react-content';
import styles from '../ttblist.module.css';
import { HandleModaliconChange } from './fungsiFormTtb';
import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { current } from '@reduxjs/toolkit';


export default function fungsiFormTtbList() {
  return (
    <div>fungsiFormTtbList</div>
  )
}


//==================================================================================================
// Handle untuk Grid Data List
const generalAffairColumns: any = [
    {
        field: 'ket2',
        headerText: 'Keterangan',
        width: 200,
        minWidth: 10,
        textAlign: 'left',
    },
    {
        field: 'cek',
        headerText: 'Check',
        width: 150,
        minWidth: 10,
        textAlign: 'center',
    },
    {
        field: 'user2',
        headerText: 'User',
        width: 150,
        minWidth: 10,
        textAlign: 'center',
    },
];
const supplyChainColumns: any = [
    {
        field: 'ket1',
        headerText: 'Keterangan',
        width: 200,
        minWidth: 10,
        textAlign: 'left',
        cellStyle: {
            background: 'blue', // Ganti dengan warna latar belakang yang Anda inginkan
        },
    },
    {
        field: 'no_mb',
        headerText: 'No. MB',
        width: 150,
        minWidth: 10,
        textAlign: 'center',
    },
    {
        field: 'user1',
        headerText: 'User',
        width: 150,
        minWidth: 10,
        textAlign: 'center',
    },
];

const supplyChainHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>Supply Chain</span>
        </div>
    );
};

const generalAffairHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 14, textAlign: 'center', color: 'white' }}>General Affair</span>
        </div>
    );
};
const namaCustHeader = (tipe: any) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>Customer</span>
        </div>
    );
};

const noSjHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>No. SJ</span>
        </div>
    );
};

const noKendaraanHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>No. Kendaraan</span>
        </div>
    );
};

const gudangHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>Gudang</span>
        </div>
    );
};

const alasanHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>Alasan</span>
        </div>
    );
};

const dokumenHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>Dokumen</span>
        </div>
    );
};

const statusHeader = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <span style={{ textAlign: 'center' }}>Status</span>
        </div>
    );
};

const checkboxTemplate = (props: any) => {
    // Jika nilai kolom "gagal" adalah "Y", centang checkbox, jika tidak, kosongkan
    const checkboxStyle = {
        backgroundColor: props.gagal === 'Y' ? '#f2f2f2' : 'transparent', // Menyesuaikan latar belakang berdasarkan nilai "gagal"
    };
    return <input type="checkbox" checked={props.gagal === 'Y'} style={checkboxStyle} readOnly />;
};

const plagInputKetSc = { current: false };
const plag = { current: 0 };
const ket1Sc = { current: '' };
const noMb = { current: '' };
const plagNoMb = { current: '' };
const kodeTtbValueKet1 = { current: '' };

const clickKetSc = (props: any) => {
    plagInputKetSc.current = true;
    plag.current += 1;
    ket1Sc.current = props.ket1;
    noMb.current = props.no_mb;
    plagNoMb.current = '';
    kodeTtbValueKet1.current = props.kode_ttb;
};
const editTemplateKeteranganSC = (props: any) => {
    return (
        <div onClick={() => clickKetSc(props)} className="col-xs-6 col-sm-6 col-lg-6 col-md-6 flex justify-end" style={{ paddingRight: '0px' }}>
            <input readOnly={true} id={`ket1${props.kode_ttb}`} value={props.ket1} style={{ width: '183px', backgroundColor: 'transparent', border: 'none' }}></input>
            {/* <button
                type="submit"
                className="btn mb-2 flex h-[4.5vh] items-center justify-center"
                style={{
                    backgroundColor: '#eeeeee',
                    color: 'white',
                    marginTop: '0px',
                    marginBottom: '0px',
                    borderRadius: '5px',
                    fontSize: '13px',
                    width: '5px',
                    height: '18px',
                }}
            >
                <FontAwesomeIcon icon={faSearch} className="shrink-0 rtl:ml-2" style={{ width: '12px', color: 'black' }} />
            </button> */}
        </div>
    );
};

const noMbValue = { current: '' };
const initialNoMbValue = { current: '' };
const kodeTtbValue = { current: '' };

const clicksimpanNoMb = (event: any, props: any) => {
    plag.current += 1;
    ket1Sc.current = props.ket1;
    noMb.current = event;
    plagNoMb.current = 'no_mb';
    kodeTtbValue.current = props.kode_ttb;
};

const handleBlur = (event: any, props: any) => {
    if (initialNoMbValue.current !== event) {
        // Jika ada perubahan nilai, jalankan fungsi
        clicksimpanNoMb(event, props);
    }
};

const editTemplateNoMb = (props: any) => {
    // const no_mb = document.getElementById('no_mb') as HTMLInputElement;
    // if (no_mb) {
    //     no_mb.value = props.no_mb;
    // }
    noMbValue.current = props.no_mb || '';
    initialNoMbValue.current = props.no_mb || '';
    return (
        <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 flex justify-end" style={{ paddingRight: '0px' }}>
            <input
                id="no_mb"
                defaultValue={props.no_mb}
                style={{ width: '83px', backgroundColor: 'transparent', border: 'none' }}
                onChange={(e) => (noMbValue.current = e.target.value)}
                onBlur={(event: any) => handleBlur(event.target.value, props)}
            ></input>
        </div>
    );
};

const editTemplateUser1 = (props: any) => {
    return (
        <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6 flex justify-end" style={{ paddingRight: '0px' }}>
            <input id={`user1${props.kode_ttb}`} value={props.user1} style={{ width: '85px', backgroundColor: 'transparent', border: 'none' }} disabled={true}></input>
        </div>
    );
};

const checkboxTemplatePembatalan = (props: any) => {
    // Jika nilai kolom "gagal" adalah "Y", centang checkbox, jika tidak, kosongkan
    const checkboxStyle = {
        backgroundColor: props.pembatalan === 'Y' ? '#f2f2f2' : 'transparent', // Menyesuaikan latar belakang berdasarkan nilai "gagal"
    };
    return <input type="checkbox" checked={props.pembatalan === 'Y'} style={checkboxStyle} readOnly />;
};

const pageSettings = { pageSize: 25 };
const sortSettings = { columns: [{ field: 'OrderID', direction: 'Ascending' }] };
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan Cetak Form TTB
const OnClick_CetakFormTtb = (selectedRowKodeTtb: any, kode_entitas: string) => {
    if (selectedRowKodeTtb === '') {
        // swal.fire({
        //     title: 'Pilih Data terlebih dahulu.',
        //     icon: 'error',
        // });
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
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
            <iframe src="./report/form_ttb?entitas=${kode_entitas}&kode_ttb=${selectedRowKodeTtb}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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

const setPrintOptions = (document: any, settings: any) => {
    // Pastikan pengaturan cetak sudah didefinisikan dalam objek settings
    if (settings && settings.paperSize && settings.orientation) {
        // Terapkan pengaturan cetak seperti ukuran kertas, orientasi, dll.
        document.printer.paperSize = settings.paperSize;
        document.printer.orientation = settings.orientation;
    } else {
        console.error('Pengaturan cetak tidak lengkap.');
    }
};
//==================================================================================================

//==================================================================================================
// Fungsi Untuk mencari Data List berdasarkan no Referensi
const PencarianNoReff = async (event: string, setSearchNoReff: Function, setFilteredData: Function, recordsData: any[], plagFilterTab: any, recordsDataApprove: any[]) => {
    let dataCari: any;
    if (plagFilterTab === 'Baru') {
        dataCari = recordsData;
    } else {
        dataCari = recordsDataApprove;
    }

    const searchValue = event;
    setSearchNoReff(searchValue);
    const filteredData = SearchDataNoReff(searchValue, dataCari);
    setFilteredData(filteredData);

    const cariNoTtb = document.getElementById('cariNoTtb') as HTMLInputElement;
    if (cariNoTtb) {
        cariNoTtb.value = '';
    }
};

const SearchDataNoReff = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.no_reff.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi Untuk mencari Data List berdasarkan no TTB
const PencarianNoTtb = async (event: string, setSearchNoTtb: Function, setFilteredData: Function, recordsData: any[], plagFilterTab: any, recordsDataApprove: any[]) => {
    let dataCari: any;
    if (plagFilterTab === 'Baru') {
        dataCari = recordsData;
    } else {
        dataCari = recordsDataApprove;
    }

    const searchValue = event;
    setSearchNoTtb(searchValue);
    const filteredData = SearchDataNoTtb(searchValue, dataCari);
    setFilteredData(filteredData);

    const cariNoReff = document.getElementById('cariNoReff') as HTMLInputElement;
    if (cariNoReff) {
        cariNoReff.value = '';
    }
};

const SearchDataNoTtb = (keyword: any, recordsData: any[]) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return recordsData;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = recordsData.filter((item) => item.no_ttb.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk select data list berdasarkan kode ttb untuk menampilkan detail data TTB
// ini saat rows di eksekusi dengan arah panah keyboard
const RowSelectingListData = (args: any, setDataDetailDokTtb: Function, kode_entitas: string, setDetailDok: Function, plagFilterTab: any) => {
    ListDetailDok(args.data.kode_ttb, kode_entitas, setDetailDok, plagFilterTab);
    setDataDetailDokTtb((prevState: any) => ({
        ...prevState,
        no_ttb: args.data.no_ttb,
        tgl_ttb: args.data.tgl_ttb,
    }));
};

// ini saat rows di eksekusi dengan klik
const HandleRowSelected = (args: any, setSelectedRowKodeTtb: Function, setStatusApproval: Function, setSelectedRowNoTtb: Function, setSelectedPembatalan: Function) => {
    if (args.data !== undefined) {
        setSelectedRowKodeTtb(args.data.kode_ttb);
        setStatusApproval(args.data.statusApproval);
        setSelectedRowNoTtb(args.data.no_ttb);
        setSelectedPembatalan(args.data.pembatalan);
    }
};

// ini saat rows di eksekusi dengan double klik
const HandleRowDoubleClicked = async (
    args: any,
    userMenu: any,
    kode_entitas: string,
    router: any,
    gridListData: any,
    selectedListData: any[],
    userid: string,
    setMasterDataState: Function,
    setMasterKodeDokumen: Function,
    setDialogInputDataVisible: Function,
    setRefreshKey: Function,
    statusApproval: any,
    selectedPembatalan: any
) => {
    // const rowIndex: number = args.row.rowIndex;
    // gridListData.selectRow(rowIndex);
    // selectedListData = gridListData.getSelectedRecords();
    const selectedList = args.rowData;

    if (userMenu.edit !== 'N' || userid === 'administrator') {
        const responseData: any[] = await GetPeriode(kode_entitas);
        const periode = responseData[0].periode;
        const tanggalMomentPeriode = moment(periode, 'YYYYMM');
        const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

        const tglPembanding = moment(selectedList.tgl_ttb).format('YYYYMM');

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
            // const result = RowDoubleClick(selectedListData[0].kode_ttb, 'Ubah');
            // router.push({ pathname: './ttb', query: { str: result } });
            if (statusApproval === 'Approval') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Data sudah di Approval, tidak dapat di koreksi.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else if (selectedPembatalan === 'Y') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white;">Data sudah di batalkan, tidak dapat di edit.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else {
                setMasterDataState('EDIT');
                setMasterKodeDokumen(selectedList.kode_ttb);
                setDialogInputDataVisible(true);
                setRefreshKey((prevKey: any) => prevKey + 1);
            }
        }
    }
};

// ini di eksekusi saat fungsi HandleRowDoubleClicked di eksekusi
const RowDoubleClick = (kode_ttb: any, tipe: string) => {
    const base64EncodedString = btoa(`kode_ttb=${kode_ttb}&tipe=${tipe}`);
    return base64EncodedString;
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi Button Button pada data list
// ini button untuk tombol DETAIL DOK, di ekesekusi saat fungsi SetDataDokumenTtb di jalankan
const ButtonDetailDok = (kode_ttb: any) => {
    return kode_ttb;
};

// ini button untuk tombol UBAH, di ekesekusi saat fungsi SetDataDokumenTtb di jalankan
const ButtonUbah = (kode_ttb: any, tipe: any) => {
    const base64EncodedString = btoa(`kode_ttb=${kode_ttb}&tipe=${tipe}`);
    return base64EncodedString;
};
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk pilihan button Data Dokumen
const SetDataDokumenTtb = async (
    tipe: string,
    selectedRowKodeTtb: string,
    kode_entitas: string,
    dataDetailDokTtb: any,
    router: any,
    setSelectedItem: Function,
    setDetailDok: Function,
    plagFilterTab: any
) => {
    if (selectedRowKodeTtb !== '') {
        if (tipe === 'ubah') {
            const responseData: any[] = await GetPeriode(kode_entitas);
            const periode = responseData[0].periode;
            const tanggalMomentPeriode = moment(periode, 'YYYYMM');
            const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

            const tglPembanding = moment(dataDetailDokTtb.tgl_ttb).format('YYYYMM');

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
                    title: '<p style="font-size:12px; color:white">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else {
                const result = ButtonUbah(selectedRowKodeTtb, 'Ubah');
                router.push({ pathname: './ttb', query: { str: result } });
            }
        } else if (tipe === 'detailDok') {
            const result = ButtonDetailDok(selectedRowKodeTtb);
            setSelectedItem(result);
            ListDetailDok(result, kode_entitas, setDetailDok, plagFilterTab);
        } else if (tipe === 'cetak') {
            OnClick_CetakFormTtb(selectedRowKodeTtb, kode_entitas);
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
// END
//==================================================================================================

//==================================================================================================
// Fungsi untuk menampilkan data detail Dok berdasarkan kode TTB
const ListDetailDok = async (kode_ttb: any, kode_entitas: any, setDetailDok: Function, plagFilterTab: any) => {
    try {
        const result: any[] = await DataDetailDok(kode_ttb, kode_entitas, plagFilterTab);
        setDetailDok(result);
    } catch (error) {
        console.error('Error:', error);
    }
};
// END
//==================================================================================================

//==================================================================================================
// Handle Filter Data List
const HandleTgl = async (date: any, tipe: string, setDate1: Function, setDate2: Function, setIsTanggalChecked: Function) => {
    if (tipe === 'tanggalAwal') {
        setDate1(date);
        setIsTanggalChecked(true);
    } else {
        setDate2(date);
        setIsTanggalChecked(true);
    }
};

const HandleNoTtbInputChange = (event: string, setNoTtbValue: Function, setIsNoTtbChecked: Function) => {
    const newValue = event;
    setNoTtbValue(newValue);
    setIsNoTtbChecked(newValue.length > 0);
};

const HandleNamaCustInputChange = (event: string, setNamaCustValue: Function, setIsNamaCustChecked: Function) => {
    const newValue = event;
    setNamaCustValue(newValue);
    setIsNamaCustChecked(newValue.length > 0);
};

const HandleNoReffInputChange = (event: string, setNoReffValue: Function, setIsNoReffChecked: Function) => {
    const newValue = event;
    setNoReffValue(newValue);
    setIsNoReffChecked(newValue.length > 0);
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

const HandleGudangChange = (event: string, setSelectedOptionGudang: Function, setIsGudangChecked: Function) => {
    const newValue = event;
    setSelectedOptionGudang(newValue);
    setIsGudangChecked(newValue.length > 0);
};

const HandleStatusDokInputChange = (event: string, setStatusDokValue: Function, setIsStatusDokChecked: Function) => {
    const newValue = event;
    setStatusDokValue(newValue);
    setIsStatusDokChecked(newValue.length > 0);
};

const HandleGagalKirim = (event: any, setSelectedOptionGagalKirim: Function) => {
    setSelectedOptionGagalKirim(event);
};

const HandlePembatalan = (event: any, setSelectedOptionPembatalan: Function) => {
    setSelectedOptionPembatalan(event);
};

// Handle untuk Fitur ALASAN FILTER
const HandlePilihSemua = (alasanChecked: boolean[], setAlasanChecked: Function) => {
    const newAlasanChecked = alasanChecked.map(() => !alasanChecked.every((checked) => checked));

    // const newAlasanChecked = alasanChecked.map(() => true);
    setAlasanChecked(newAlasanChecked); // Memperbarui state dengan array yang diperbarui
};

const HandleAlasan = (index: number, alasanChecked: boolean[], setAlasanChecked: Function) => {
    const newAlasanChecked = [...alasanChecked];
    newAlasanChecked[index] = !newAlasanChecked[index];
    setAlasanChecked(newAlasanChecked);

    // ini fungsi untuk memilih salah satu dan bisa di unchecked
    // const updatedChecked = alasanChecked.map((checked, i) => (i === index ? !checked : false));
    // setAlasanChecked(updatedChecked);
};
// END
//==================================================================================================

const HandleButtonClick = (kode_ttb: any, tipe: string, router: any) => {
    const base64EncodedString = btoa(`kode_ttb=${kode_ttb}&tipe=${tipe}`);
    // router.push({ pathname: './po', query: { name: 'produksi', jenisTransaksi: jenisTransaksi, kode_sp: 'BARU' } });
    router.push({ pathname: './ttb', query: { str: base64EncodedString } });
};

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

//====================================================================================
// Handle Filter Daftar Surat Jalan Item
// ini digunakan untuk filter no barang
const HandleSearchNoBarang = (event: any, setSearchKeywordNoBarang: Function, setFilteredDataSjItem: Function, dataDetailSjItem: any) => {
    const searchValue = event;
    setSearchKeywordNoBarang(searchValue);
    const filteredData = searchDataNoBarang(searchValue, dataDetailSjItem);
    setFilteredDataSjItem(filteredData);

    const searchNamaItem1 = document.getElementById('searchNamaItem1') as HTMLInputElement;

    if (searchNamaItem1) {
        searchNamaItem1.value = '';
    }
};

const searchDataNoBarang = (keyword: any, dataDetailSjItem: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDetailSjItem;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        // const filteredData = detailPPItem.filter((item) => item.no_item.toLowerCase().includes(keyword.toLowerCase()));
        const filteredData = dataDetailSjItem.filter((item: any) => item.no_item.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

// ini digunakan untuk filter nama barang
const HandleSearchNamaBarang = (event: any, setSearchKeywordNamaBarang: Function, setFilteredDataSjItem: Function, dataDetailSjItem: any) => {
    const searchValue = event;
    setSearchKeywordNamaBarang(searchValue);
    const filteredData = searchDataNamaBarang(searchValue, dataDetailSjItem);
    setFilteredDataSjItem(filteredData);

    const searchNoItem1 = document.getElementById('searchNoItem1') as HTMLInputElement;

    if (searchNoItem1) {
        searchNoItem1.value = '';
    }
};

const searchDataNamaBarang = (keyword: any, dataDetailSjItem: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDetailSjItem;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDetailSjItem.filter((item: any) => item.diskripsi.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

// ini digunakan untuk filter no dokumen pada daftar sj header
const HandleSearchNoDok = (event: any, setSearchKeywordNoDok: Function, setFilteredDataSj: Function, dataDetailSj: any) => {
    const searchValue = event;
    setSearchKeywordNoDok(searchValue);
    const filteredData = searchDataNoDok(searchValue, dataDetailSj);
    setFilteredDataSj(filteredData);

    const namaRelasiInput = document.getElementById('searchNamaRelasi') as HTMLInputElement;
    if (namaRelasiInput) {
        namaRelasiInput.value = '';
    }
};

const searchDataNoDok = (keyword: any, dataDetailSj: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDetailSj;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDetailSj.filter((item: any) => item.no_dok.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

const HandleSearchNamaRelasi = (event: any, setSearchKeywordNamaRelasi: Function, setFilteredDataSj: Function, dataDetailSj: any) => {
    const searchValue = event;
    setSearchKeywordNamaRelasi(searchValue);
    const filteredData = searchDataNamaRelasi(searchValue, dataDetailSj);
    setFilteredDataSj(filteredData);

    const noDokInput = document.getElementById('searchNoDokumen') as HTMLInputElement;
    if (noDokInput) {
        noDokInput.value = '';
    }
};

const searchDataNamaRelasi = (keyword: any, dataDetailSj: any) => {
    // Jika keyword kosong, kembalikan semua data
    if (keyword === '') {
        return dataDetailSj;
    } else {
        // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
        const filteredData = dataDetailSj.filter((item: any) => item?.nama_relasi.toLowerCase().startsWith(keyword.toLowerCase()));
        return filteredData;
    }
};

//END
//===================================================================================

//===================================================================================
// Fungsi untuk mendapatkan data detail SJ Item dengan API
const RefreshDetailSjItem = async (kode_entitas: string, custSelectedKode: any, refKodeCust: any, setDataDetailSjItem: Function, entitas: any) => {
    try {
        const response = await RefreshDetailSjItemAPI(kode_entitas, custSelectedKode, refKodeCust, entitas);

        if (response.status) {
            setDataDetailSjItem(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// END
//=================================================================================

//=================================================================================
//Fungsi untuk memfilter qty kalo customer belum di isi
const FilterCustomer = (
    refNamaCust: any,
    swalDialog: any,
    dataBarang: any,
    custSelected: any,
    setHandleNamaCust: Function,
    setModal1: Function,
    DialogDaftarSjItem: Function,
    kode_entitas: any,
    setDsDaftarCustomer: Function,
    setDataBarang: Function
) => {
    if (refNamaCust === '' || refNamaCust === null) {
        withReactContent(swalDialog)
            .fire({
                icon: 'error',
                title: '<p style="font-size:12px">Customer belum di isi</p>',
                width: '20%',
                target: '#dialogTtbList',
                confirmButtonText: 'Ok',
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
            })
            .then((result) => {
                if (result.isConfirmed) {
                    HandleModaliconChange('customer', dataBarang, custSelected, setHandleNamaCust, setModal1, kode_entitas, setDsDaftarCustomer, setDataBarang);
                }
            });
    } else {
        DialogDaftarSjItem();
    }
};
// END
//=================================================================================

//=================================================================================
// Handle Filter Daftar Customer
// ini digunakan untuk filter no cust
const HandleSearchNoCust = (event: any, setSearchKeywordNoCust: Function, kode_entitas: string, setFilteredData: Function) => {
    const searchValue = event;
    setSearchKeywordNoCust(searchValue);
    const filteredData = searchDataNoCust(searchValue, kode_entitas, setFilteredData);
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

const searchDataNoCust = async (keyword: any, kode_entitas: string, setFilteredData: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, 'all', keyword, 'all');

        if (response.status) {
            setFilteredData(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// ini digunakan untuk filter nama cust
const HandleSearchNamaCust = (event: any, setSearchKeywordNamaCust: Function, kode_entitas: string, setFilteredData: Function) => {
    const searchValue = event;
    setSearchKeywordNamaCust(searchValue);
    const filteredData = searchDataNamaCust(searchValue, kode_entitas, setFilteredData);
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

const searchDataNamaCust = async (keyword: any, kode_entitas: string, setFilteredData: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, keyword, 'all', 'all');

        if (response.status) {
            setFilteredData(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// ini digunakan untuk filter nama sales
const HandleSearchNamaSales = (event: any, setSearchKeywordNamaSales: Function, kode_entitas: string, setFilteredData: Function) => {
    const searchValue = event;
    setSearchKeywordNamaSales(searchValue);
    const filteredData = searchDataNamaSales(searchValue, kode_entitas, setFilteredData);
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

const searchDataNamaSales = async (keyword: any, kode_entitas: string, setFilteredData: Function) => {
    // Jika keyword kosong, kembalikan semua data
    try {
        const response = await ListCustFilter(kode_entitas, 'all', 'all', keyword);

        if (response.status) {
            setFilteredData(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// END
//=================================================================================

//=================================================================================
// Fungsi menampilkan Data Customer dari API
const FetchDataListCust = async (kode_entitas: string, setDsDaftarCustomer: Function) => {
    try {
        const response = await ListCustFilter(kode_entitas, 'all', 'all', 'all');

        if (response.status) {
            setDsDaftarCustomer(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// END
//=================================================================================

//=================================================================================
// Fungsi untuk Memsaukan data Customer sesuai dengan customer yang dipilih
const refNamaCust = { current: null };
const refKodeCust = { current: null };
const refKodeRelasi = { current: null };
const HandleSelectedDataCustomer = (dataObject: any, tipe: string, setCustSelected: Function, setCustSelectedKode: Function, setSelectedKodeRelasi: Function, setModal2: Function) => {
    setCustSelected(dataObject[0]?.nama_relasi);
    setCustSelectedKode(dataObject[0].kode_cust);
    setSelectedKodeRelasi(dataObject[0].kode_relasi);
    refNamaCust.current = dataObject[0]?.nama_relasi;
    refKodeCust.current = dataObject[0].kode_cust;
    refKodeRelasi.current = dataObject[0].kode_relasi;
    if (tipe === 'row') {
        setModal2(true);
    }
};

const HandleSelectedDataCustomer1 = (dataObject: any, tipe: string, setCustSelected: Function, setCustSelectedKode: Function, setSelectedKodeRelasi: Function, setModal2: Function) => {
    setCustSelected(dataObject?.nama_relasi);
    setCustSelectedKode(dataObject.kode_cust);
    setSelectedKodeRelasi(dataObject.kode_relasi);
    refNamaCust.current = dataObject?.nama_relasi;
    refKodeCust.current = dataObject.kode_cust;
    refKodeRelasi.current = dataObject.kode_relasi;
    if (tipe === 'row') {
        setModal2(true);
    }
};
//=================================================================================

//=================================================================================
// Fungsi untuk edit detail barang di dalam rows
let currentDetailBarang: any[] = [];
const DetailBarangEdit = (gridTtbList: any) => {
    currentDetailBarang = gridTtbList.getSelectedRecords();
    if (currentDetailBarang.length > 0) {
        gridTtbList.startEdit();
        gridTtbList.sta;
    } else {
        document.getElementById('gridTtbList')?.focus();
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
const DetailBarangDelete = async (gridTtbList: any, swalDialog: any, IdDokumen: any, setIdDokumen: Function, tipe: string, nama_barang: string, setDataBarang: Function, setTotalBarang: Function) => {
    currentDetailBarang = gridTtbList?.getSelectedRecords() || [];
    const dataBarang = gridTtbList.dataSource;
    if (tipe === 'deleteTombol') {
        if (currentDetailBarang.length > 0) {
            // Tambahkan CSS untuk tombol
            const style = document.createElement('style');
            style.innerHTML = `
            .swal2-popup .btn {
            margin-left: 10px;
            }
    `;
            document.head.appendChild(style);

            const confirm = await withReactContent(swalDialog).fire({
                title: `${currentDetailBarang[0].no_sj === undefined ? '' : `<p style="font-size:12px"><b>${currentDetailBarang[0].no_sj}</b></p>`}`,
                html: `<p style="font-size:12px">Apakah anda yakin akan menghapus data barang ini ( ${currentDetailBarang[0].nama_barang === undefined ? '' : currentDetailBarang[0].nama_barang})</p>`,
                width: '350px',
                heightAuto: true,
                target: '#dialogTtbList',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '&ensp; Ya &ensp;',
                cancelButtonText: 'Tidak',
                reverseButtons: false,
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
            });

            if (confirm.isConfirmed) {
                const diskripsi: string = currentDetailBarang[0].nama_barang;
                gridTtbList?.deleteRecord(currentDetailBarang[0]);
                const id = IdDokumen - 1;
                setIdDokumen(id);

                withReactContent(swalDialog).fire({
                    title: `<p style="font-size:12px"><b>${diskripsi}</b></p>`,
                    html: '<p style="font-size:12px">Data barang berhasil dihapus</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 2000,
                    target: '#dialogTtbList',
                });
            }
        } else {
            document.getElementById('gridTtbList')?.focus();
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Silahkan pilih data barang terlebih dahulu</p>',
                width: '100%',
                target: '#dialogTtbList',
            });
        }
    } else {
        setDataBarang({ nodes: dataBarang });
        setTotalBarang(dataBarang.length);
        withReactContent(swalDialog).fire({
            title: `<p style="font-size:12px"><b>${nama_barang}</b></p>`,
            html: '<p style="font-size:12px">Data barang berhasil dihapus</p>',
            icon: 'success',
            width: '350px',
            heightAuto: true,
            showConfirmButton: false,
            timer: 2000,
            target: '#dialogTtbList',
        });
    }
};
// END
//=================================================================================

//=================================================================================
// Fungsi untuk hapus all detail barang di dalam rows
const DetailBarangDeleteAll = async (swalDialog: any, setDataBarang: Function, setTotalBarang: Function, setTotalRecords: Function, setIdDokumen: Function) => {
    document.getElementById('gridTtbList')?.focus();

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
            title: ``,
            html: '<p style="font-size:12px">Apakah anda yakin akan menghapus semua data barang</p>',
            width: '350px',
            heightAuto: true,
            target: '#dialogTtbList',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '&ensp; Ya &ensp;',
            cancelButtonText: 'Tidak',
            reverseButtons: false,
            allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
            allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
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

                withReactContent(swalDialog).fire({
                    title: ``,
                    html: '<p style="font-size:12px">Data semua barang berhasil dihapus</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 2000,
                    target: '#dialogTtbList',
                });
            } else if (result.dismiss === swal.DismissReason.cancel) {
                //...
            }
        });
};

const DetailBarangDeleteKosong = async (swalDialog: any, setDataBarang: Function, setTotalBarang: Function, setTotalRecords: Function, setIdDokumen: Function, id: any, dataBarang: any) => {
    document.getElementById('gridTtbList')?.focus();
    setDataBarang((state: any) => {
        // Mengecek apakah ada node yang memiliki 'no_sj' yang kosong
        const hasEmptyNodes = state?.nodes.some((node: any) => node.no_sj === '');
        if (hasEmptyNodes === true) {
        }

        return {
            ...state,
        };
    });
};
//=================================================================================

//===================================================================================
// Fungsi untuk mendapatkan data detail SJ Item dengan API
const RefreshDetailSj = async (kode_entitas: string, custSelectedKode: any, refKodeCust: any, setDataDetailSj: Function, entitas: any) => {
    try {
        const response = await RefreshDetailSjAPI(kode_entitas, refKodeCust, custSelectedKode, entitas);

        if (response.status) {
            setDataDetailSj(response.data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
// END
//=================================================================================

// type ImageType = "pdf" | "doc";

// const imageObj: Record<ImageType, string> = {
//     pdf: 'data:@file/png;base64,',
//     doc: 'data:@file/png;base64,'
// };

// export const getResImage = async (type: ImageType): Promise<string> => {
//     return imageObj[type];
// };

export {
    kodeTtbValueKet1,
    editTemplateUser1,
    kodeTtbValue,
    plagNoMb,
    noMb,
    editTemplateNoMb,
    ket1Sc,
    plag,
    plagInputKetSc,
    editTemplateKeteranganSC,
    checkboxTemplatePembatalan,
    HandlePembatalan,
    DetailBarangDeleteKosong,
    HandleSelectedDataCustomer1,
    HandleSearchNoDok,
    HandleSearchNamaRelasi,
    refKodeRelasi,
    RefreshDetailSj,
    DetailBarangDeleteAll,
    DetailBarangDelete,
    refNamaCust,
    refKodeCust,
    DetailBarangEdit,
    HandleSelectedDataCustomer,
    FetchDataListCust,
    HandleSearchNamaSales,
    HandleSearchNamaCust,
    HandleSearchNoCust,
    FilterCustomer,
    RefreshDetailSjItem,
    HandleSearchNamaBarang,
    HandleSearchNoBarang,
    supplyChainHeader,
    generalAffairHeader,
    namaCustHeader,
    noSjHeader,
    noKendaraanHeader,
    gudangHeader,
    alasanHeader,
    dokumenHeader,
    statusHeader,
    checkboxTemplate,
    generalAffairColumns,
    supplyChainColumns,
    pageSettings,
    OnClick_CetakFormTtb,
    PencarianNoReff,
    PencarianNoTtb,
    RowSelectingListData,
    ButtonDetailDok,
    ButtonUbah,
    SetDataDokumenTtb,
    ListDetailDok,
    HandleTgl,
    HandleNoTtbInputChange,
    HandleNamaCustInputChange,
    HandleNoReffInputChange,
    HandlePilihSemua,
    HandleAlasan,
    HandleKategoriChange,
    HandleKelompokChange,
    HandleGudangChange,
    HandleStatusDokInputChange,
    HandleGagalKirim,
    HandleButtonClick,
    HandleRowSelected,
    HandleRowDoubleClicked,
};
