import { frmNumber, tanpaKoma } from '@/utils/routines';
import { DaftarAkunKredit, ListBukuBesar, SaldoAwal } from '../model/api';
// import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ConvertDataToHtml } from '../interface/template';
import withReactContent from 'sweetalert2-react-content';
import styles from '../style.module.css';
import swal from 'sweetalert2';
import moment from 'moment';
// import * from '../../phu/report/form_phu_kecil'

import React from 'react'

export default function fungsiForm() {
  return (
    <div>fungsiForm</div>
  )
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
// Fungsi Set List Data
const GetListDataBukuBesar = async (paramObject: any) => {
    const resultSaldoBesar: any[] = await SaldoAwal(paramObject.kode_entitas, paramObject.kode_akun, paramObject.tgl_awal, paramObject.token);
    const resultListBukuBesar: any[] = await ListBukuBesar(paramObject.kode_entitas, paramObject.kode_akun, paramObject.divisiJual, paramObject.tgl_awal, paramObject.tgl_akhir, paramObject.token);

    // Tambahkan saldo kumulatif ke data dari API 2
    let currentSaldoKumulatif: any = parseFloat(tanpaKoma(resultSaldoBesar[0].saldoawal));
    const updatedListBukuBesar = resultListBukuBesar.map((item) => {
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
            saldo_kumulatif: frmNumber(tanpaKoma(resultSaldoBesar[0].saldoawal)), // Format sebagai string dengan koma sebagai pemisah ribuan
        },
        ...updatedListBukuBesar,
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

const GetListDataBukuBesarSort = async (paramObject: any) => {
    const resultSaldoBesar: any[] = await SaldoAwal(paramObject.kode_entitas, paramObject.kode_akun, paramObject.tgl_awal, paramObject.token);
    const resultListBukuBesar: any[] = await ListBukuBesar(paramObject.kode_entitas, paramObject.kode_akun, paramObject.divisiJual, paramObject.tgl_awal, paramObject.tgl_akhir, paramObject.token);

    let sorted: any;
    if (paramObject.tipe === 'tanggal') {
        if (paramObject.plag === 'DESC') {
            // Urutkan berdasarkan tgl_dokumen secara descending
            sorted = sortData(resultListBukuBesar, 'tgl_dokumen', 'desc');
        } else {
            // Urutkan berdasarkan tgl_dokumen secara ascending
            sorted = sortData(resultListBukuBesar, 'tgl_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'dok') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'noRef') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'no_dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'no_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'ket') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'catatan', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'catatan', 'asc');
        }
    } else if (paramObject.tipe === 'debet') {
        if (paramObject.plag === 'DESC') {
            sorted = sortDataNilai(resultListBukuBesar, 'debet', 'desc');
        } else {
            sorted = sortDataNilai(resultListBukuBesar, 'debet', 'asc');
        }
    } else if (paramObject.tipe === 'kredit') {
        if (paramObject.plag === 'DESC') {
            sorted = sortDataNilai(resultListBukuBesar, 'kredit', 'desc');
        } else {
            sorted = sortDataNilai(resultListBukuBesar, 'kredit', 'asc');
        }
    } else if (paramObject.tipe === 'saldoKum') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'tgl_dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'tgl_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'subledger') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'subledger', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'subledger', 'asc');
        }
    } else if (paramObject.tipe === 'dept') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'no_dept', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'no_dept', 'asc');
        }
    } else if (paramObject.tipe === 'namaKar') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'nama_kry', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'nama_kry', 'asc');
        }
    } else if (paramObject.tipe === 'divisiJual') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuBesar, 'kode_jual', 'desc');
        } else {
            sorted = sortData(resultListBukuBesar, 'kode_jual', 'asc');
        }
    }
    // Tambahkan saldo kumulatif ke data dari API 2
    let currentSaldoKumulatif: any = parseFloat(tanpaKoma(resultSaldoBesar[0].saldoawal));
    const updatedListBukuBesar = sorted.map((item: any) => {
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
            saldo_kumulatif: frmNumber(tanpaKoma(resultSaldoBesar[0].saldoawal)), // Format sebagai string dengan koma sebagai pemisah ribuan
        },
        ...updatedListBukuBesar,
    ];
    return combinedData;
};

// END
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
    worksheet.getCell('A2').value = 'BUKU BESAR';
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

    // Add table headers
    const headers = ['Tanggal', 'Dok.', 'No. Ref', 'Keterangan', 'Debet', 'Kredit', 'Kumulatif'];
    worksheet.addRow(headers);
    worksheet.getRow(6).eachCell((cell) => {
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
    const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(kode_entitas, 'all');
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
// Fungsi Print Data
// const PrintData = (data: any, objectToExcel: any) => {
//     const printWindow = window.open('', '_blank');
//     const htmlContent = ConvertDataToHtml(data, objectToExcel);
//     printWindow?.document.write(`
//       <html>
//         <head>
//           <title>Cetak Laporan</title>
//           <style>
//             @media print {
//               table { page-break-after: auto; }
//               tr { page-break-inside: avoid; page-break-after: auto; }
//               td { page-break-inside: avoid; page-break-after: auto; }
//               thead { display: table-header-group; }
//               tfoot { display: table-footer-group; }
//             }
//           </style>
//         </head>
//         <body onload="window.print();window.close()">
//           ${htmlContent}
//         </body>
//       </html>
//     `);
//     printWindow?.document.close();
// };
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
// Fungsi untuk menampilkan Cetak Daftar Buku Besar
const OnClick_CetakDaftarBukuBesar = (paramObject: any) => {
    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframeSrc = `./buku-besar/report/daftar_buku_besar?entitas=${paramObject.kode_entitas}&kode_akun=${paramObject.kode_akun}&kode_divisi=${paramObject.kode_divisi}&tgl_awal=${paramObject.tgl_awal}&tgl_akhir=${paramObject.tgl_akhir}&token=${paramObject.token}`;

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
            <title>Laporan Buku Besar | Next KCN Sytem</title>
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

const HandleChangeDivisiJual = async (value: any, kode_entitas: any, token: any, stateDataHeader: any, setRecordsData: Function, setStateDataHeader: Function) => {
    const kodeJual = value;
    const tglAwalSaldoAwal = moment(stateDataHeader?.date1).subtract(1, 'days');
    if (stateDataHeader?.noAkunValue !== '' || stateDataHeader?.namaAkunValue !== '') {
        const paramObject = {
            kode_entitas: kode_entitas,
            kode_akun: stateDataHeader?.kodeAkun,
            tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
            tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
            token: token,
            divisiJual: kodeJual === 'ALL' ? kodeJual.toLowerCase() : kodeJual,
            tglAwalSaldoAwal: tglAwalSaldoAwal,
        };

        const getListDataBukuBesar: any[] = await GetListDataBukuBesar(paramObject);
        setRecordsData(getListDataBukuBesar);
    }
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        divisiJualDefault: value,
    }));
};

const HandleTgl = async (date: any, tipe: string, kode_entitas: any, token: any, stateDataHeader: any, setRecordsData: Function, setStateDataHeader: Function) => {
    if (tipe === 'tanggalAwal') {
        if (stateDataHeader?.noAkunValue !== '' || stateDataHeader?.namaAkunValue !== '') {
            const tglAwalSaldoAwal = moment(date).subtract(1, 'days');
            const paramObject = {
                kode_entitas: kode_entitas,
                kode_akun: stateDataHeader?.kodeAkun,
                tgl_awal: moment(date).format('YYYY-MM-DD'),
                tgl_akhir: moment(stateDataHeader?.date2).format('YYYY-MM-DD'),
                token: token,
                divisiJual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
                tglAwalSaldoAwal: tglAwalSaldoAwal,
            };
            const getListDataBukuBesar: any[] = await GetListDataBukuBesar(paramObject);
            setRecordsData(getListDataBukuBesar);
        }
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            date1: date,
        }));
    } else {
        if (stateDataHeader?.noAkunValue !== '' || stateDataHeader?.namaAkunValue !== '') {
            const tglAwalSaldoAwal = moment(date).subtract(1, 'days');
            const paramObject = {
                kode_entitas: kode_entitas,
                kode_akun: stateDataHeader?.kodeAkun,
                tgl_awal: moment(stateDataHeader?.date1).format('YYYY-MM-DD'),
                tgl_akhir: moment(date).format('YYYY-MM-DD'),
                token: token,
                divisiJual: stateDataHeader?.divisiJualDefault === 'ALL' ? stateDataHeader?.divisiJualDefault.toLowerCase() : stateDataHeader?.divisiJualDefault,
                tglAwalSaldoAwal: tglAwalSaldoAwal,
            };
            const getListDataBukuBesar: any[] = await GetListDataBukuBesar(paramObject);
            setRecordsData(getListDataBukuBesar);
        }
        setStateDataHeader((prevState: any) => ({
            ...prevState,
            date2: date,
        }));
    }
};

export {
    GetListDataBukuBesarSort,
    HandleTgl,
    HandleChangeDivisiJual,
    OnClick_CetakDaftarBukuBesar,
    PrintData,
    HandleModalInput,
    ExportToCustomExcel,
    GetListDataBukuBesar,
    HandleSearchNoAkun,
    HandleSearchNamaAkun,
};
