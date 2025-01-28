import Swal from 'sweetalert2';
import { frmNumber, tanpaKoma } from '@/utils/routines';
import React from 'react'

export default function template() {
  return (
    <div>template</div>
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

const ConvertDataToHtml = (data: any, objectToExcel: any) => {
    // Menghitung total debet dan kredit
    const totalDebet = data.reduce((sum: number, item: any) => sum + parseFloat(item.debet.replace(/,/g, '') || 0), 0).toFixed(2);
    const totalKredit = data.reduce((sum: number, item: any) => sum + parseFloat(item.kredit.replace(/,/g, '') || 0), 0).toFixed(2);

    // Menghitung saldo awal
    const saldoAwal = data.filter((data: any) => data.dokumen === '');

    //Menghitung Saldo Akhir
    const sortedData = data.sort((a: any, b: any) => {
        return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
    });

    const lastItem = sortedData[sortedData.length - 1];
    const saldoAkhir = lastItem ? parseFloat(tanpaKoma(lastItem.saldo_kumulatif) || '0') : 0;

    // Menghitung Perubahan
    const perubahan = (saldoAkhir - parseFloat(saldoAwal[0].saldo_kumulatif.replace(/,/g, ''))).toFixed(2);

    return `
      <div style="font-family: Calibri, sans-serif;">
    <h2 style="text-align: center">
        ${objectToExcel.kode_entitas}<br/>
        ${objectToExcel.title}<br/>
        ${objectToExcel.periode}
    </h2>
    <h4>
${objectToExcel.kode_entitas}<br/>
        ${objectToExcel.no_akun}
    </h4>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px">
        <thead>
            <tr>
                <th style="width: 10%; border-bottom: 1px solid black; text-align: center; padding: 5px;">Tanggal</th>
                <th style="width: 10%; border-bottom: 1px solid black; text-align: center; padding: 5px;">Dok.</th>
                <th style="width: 10%; border-bottom: 1px solid black; text-align: center; padding: 5px;">No. Ref</th>
                <th style="width: 40%; border-bottom: 1px solid black; text-align: center; padding: 5px;">Keterangan</th>
                <th style="width: 10%; border-bottom: 1px solid black; text-align: center; padding: 5px;">Debet</th>
                <th style="width: 10%; border-bottom: 1px solid black; text-align: center; padding: 5px;">Kredit</th>
                <th style="width: 10%; border-bottom: 1px solid black; text-align: center; padding: 5px;">Kumulatif</th>
            </tr>
        </thead>
        <tbody>
            ${data
                .map(
                    (item: any) => `
              <tr>
                <td style="width: 10%; padding: 5px;font-size:12px;">${item.tgl_dokumen}</td>
                <td style="width: 10%; padding: 5px;font-size:12px;">${item.dokumen}</td>
                <td style="width: 10%; padding: 5px;font-size:12px;">${item.no_dokumen}</td>
                <td style="width: 40%; padding: 5px;font-size:12px;">${item.catatan}</td>
                <td style="width: 10%; padding: 5px;font-size:12px;">${item.debet}</td>
                <td style="width: 10%; padding: 5px;font-size:12px;">${item.kredit}</td>
                <td style="width: 10%; padding: 5px;font-size:12px;">${item.saldo_kumulatif}</td>
              </tr>
            `
                )
                .join('')}
            <tr>
                <td colspan="7" style="border-top: 1px solid black;"></td> <!-- Garis di atas saldoAwal -->
            </tr>
            <tr style="font-size:13px;">
              <td colspan="3" style="font-weight: bold; padding: 5px;">Saldo Awal&nbsp;&nbsp;&nbsp;${saldoAwal[0].saldo_kumulatif}</td>
              <td colspan="1" style="text-align: right; font-weight: bold; padding: 5px;">Total Debet/Kredit</td>
              <td colspan="1" style="text-align: right; padding: 5px;">${frmNumber(totalDebet)}</td>
              <td colspan="1" style="text-align: right; padding: 5px;">${frmNumber(totalKredit)}</td>
              <td colspan="1" style="text-align: right; padding: 5px;"></td>
            </tr>
            <tr style="font-size:13px;">
              <td colspan="3" style="font-weight: bold; padding: 5px;">Saldo Akhir&nbsp;&nbsp;&nbsp;${frmNumber(saldoAkhir)}</td>
              <td colspan="1" style="text-align: right; font-weight: bold; padding: 5px;">Perubahan</td>
              <td colspan="1" style="text-align: right; padding: 5px;">${frmNumber(perubahan)}</td>
               <td colspan="1" style="text-align: right; padding: 5px;"></td>
               <td colspan="1" style="text-align: right; padding: 5px;"></td>
            </tr>
            <tr>
                <td colspan="7" style="border-bottom: 1px solid black;"></td> <!-- Garis di bawah saldoAkhir -->
            </tr>
        </tbody>
    </table>
</div>
    `;
};

//==================================================================================================
// Template untuk kolom "no akun" Modal Akun Kredit
const TemplateNoAkun = (args: any) => {
    return (
        <div style={args.header === 'Y' ? { fontWeight: 'bold' } : { fontWeight: 'none', marginLeft: 12 }}>
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
        <div style={args.header === 'Y' ? { fontWeight: 'bold' } : { fontWeight: 'none', marginLeft: 12 }}>
            {/* Isi template sesuai kebutuhan */}
            {args.nama_akun}
        </div>
    );
};
// END
//==================================================================================================

const SumDebet = (args: any) => {
    const debet = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(tanpaKoma(item.debet) === '' ? '0' : tanpaKoma(item.debet));
    }, 0);
    return frmNumber(debet);
};
const SumKredit = (args: any) => {
    const kredit = args.result.reduce((total: number, item: any) => {
        return total + parseFloat(tanpaKoma(item.kredit) === '' ? '0' : tanpaKoma(item.kredit));
    }, 0);
    return frmNumber(kredit);
};
const TotDebKre = (args: any) => {
    const debet = args.result.filter((item: any) => item.debet !== '').length;
    const kredit = args.result.filter((item: any) => item.kredit !== '').length;
    return { debet, kredit };
};
const SumSaldoKumulatif = (args: any) => {
    const sortedData = args.result.sort((a: any, b: any) => {
        return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
    });

    const lastItem = sortedData[sortedData.length - 1];
    const saldo_kumulatif = lastItem ? parseFloat(tanpaKoma(lastItem.saldo_kumulatif) || '0') : 0;

    return frmNumber(saldo_kumulatif);
};

const CustomSumDeb = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};
const CustomSumKre = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};
const CustomTotDebKre = (props: any) => {
    return (
        <span style={{ fontWeight: 'bold' }}>
            Trx Db: {props.Custom.debet}&nbsp;&nbsp;&nbsp; Trx Kr: {props.Custom.kredit}
        </span>
    );
};
const CustomSumSaldoKumulatif = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

export { swalToast, CustomSumDeb, CustomSumKre, CustomTotDebKre, CustomSumSaldoKumulatif, SumDebet, SumKredit, TotDebKre, SumSaldoKumulatif, TemplateNamaAkun, TemplateNoAkun, ConvertDataToHtml };
