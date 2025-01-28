import moment from "moment";
import { frmNumber } from "@/utils/routines";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import React from 'react'

export default function fungsiForm() {
  return (
    <div>fungsiForm</div>
  )
}


export const HandleSearchNoAkun = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        no_akun: searchValue,
    }));

    const filteredData = searchDataNoAkun(searchValue, dataDaftarAkunKredit);
    
    setStateDataArray(filteredData);

    
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

export const HandleSearchNamaAkun = (event: any, setStateDataHeader: Function, setStateDataArray: Function, dataDaftarAkunKredit: any) => {
    const searchValue = event;
    setStateDataHeader((prevState: any) => ({
        ...prevState,
        nama_akun: searchValue,
    }));

    const filteredData = searchDataNamaAkun(searchValue, dataDaftarAkunKredit);
    
    setStateDataArray(filteredData);

    
};

function sortData(data: any, field: any, order = 'asc') {

    return data.sort((a: any, b: any) => {
        if (!a.tgl_dokumen) return -1;
    if (!b.tgl_dokumen) return 1;
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
        if (!a.tgl_dokumen) return -1;
    if (!b.tgl_dokumen) return 1;
        let valueA = a[field];
        let valueB = b[field];     

        // Compare the values based on order
        if (order === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });
}



export const GetListMutasiDetailShort = async (paramObject: any) => {
    const resultListBukuSubledger: any = paramObject.dataOriginal;
    console.log("resultListBukuSubledger",resultListBukuSubledger);
    

    let sorted: any;
    if (paramObject.tipe === 'tanggal') {
        if (paramObject.plag === 'DESC') {
            // Urutkan berdasarkan tgl_dokumen secara descending
            sorted = sortData(resultListBukuSubledger, 'tgl_dokumen', 'desc');
        } else {
            // Urutkan berdasarkan tgl_dokumen secara ascending
            sorted = sortData(resultListBukuSubledger, 'tgl_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'dok') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger, 'dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger, 'dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'NoDokumen') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger, 'no_dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger, 'no_dokumen', 'asc');
        }
    } else if (paramObject.tipe === 'sortCatatan') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger, 'catatan', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger, 'catatan', 'asc');
        }
    } else if (paramObject.tipe === 'debet') {
        if (paramObject.plag === 'DESC') {
            sorted = sortDataNilai(resultListBukuSubledger, 'debet', 'desc');
        } else {
            sorted = sortDataNilai(resultListBukuSubledger, 'debet', 'asc');
        }
    } else if (paramObject.tipe === 'kredit') {
        if (paramObject.plag === 'DESC') {
            sorted = sortDataNilai(resultListBukuSubledger, 'kredit', 'desc');
        } else {
            sorted = sortDataNilai(resultListBukuSubledger, 'kredit', 'asc');
        }
    } else if (paramObject.tipe === 'saldoKum') {
        if (paramObject.plag === 'DESC') {
            sorted = sortData(resultListBukuSubledger, 'tgl_dokumen', 'desc');
        } else {
            sorted = sortData(resultListBukuSubledger, 'tgl_dokumen', 'asc');
        }
    }

    // Tambahkan saldo kumulatif ke data dari API 2
    let currentSaldoKumulatif: any = parseFloat(resultListBukuSubledger[0].balance);
    const updatedListBukuSubledger = sorted.map((item: any) => {
        // Konversi debet dan kredit ke float setelah menghapus koma
        const debet = item.debet || 0;
        const kredit = item.kredit || 0;

        // Hitung saldo kumulatif
        currentSaldoKumulatif += debet - kredit;

        // Tambahkan field balance
        return {
            ...item,
            tgl_dokumen: item.tgl_dokumen,
            debet: item.debet,
            kredit: item.kredit,
            balance: currentSaldoKumulatif, // Format sebagai string dengan koma sebagai pemisah ribuan
        };
    });

    // Gabungkan data
    const combinedData = [
        ...updatedListBukuSubledger,
    ];

    console.log("combinedData",combinedData);
    
    return combinedData;
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

export const ExportToCustomExcel = async (data: any[], fileName: any, objectToExcel: any) => {
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
        const row = worksheet.addRow([item.tgl_dokumen, item.dokumen, item.no_dokumen, item.catatan, item.debet === "NaN" ? '' : item.debet, item.kredit  === "NaN" ? '' :item.debet, item.balance]);

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