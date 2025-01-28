// ===============================================================

import { frmNumberSyncfusion } from '@/lib/fa/phe/functional/fungsiForm';
import { HandleChangeParamsObjectDialogPhe } from '../template/HandleChangeParamsObjectDialogPhe';

// Header grid Jumlah Yang Akan Dibayar
const headerJumlahYangAkanDibayar = () => {
    const bgcolor = 'tranparent';
    const fcolor = '#5d676e';
    return (
        <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: 4, marginBottom: 4 }}>
            <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                Jumlah Yang
                <br />
                Akan Dibayar
            </span>
        </div>
    );
};
// END
// ===============================================================

// ===============================================================
// Template Format Rupiah Netto MU saat di edit
const editTemplateNettoMu = (args: any) => {
    return (
        <div>
            <input
                style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-21px', color: '#b1acac' }}
                id="netto_mu"
                name="netto_mu"
                value={frmNumberSyncfusion(args.netto_mu)}
                disabled={true}
            />
        </div>
    );
};
// END
// ===============================================================

// ===============================================================
// Template Format Rupiah Potongan Lain saat di edit
const editTemplatePotonganLain = (args: any) => {
    return (
        <div>
            <input
                style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-28px', color: '#b1acac' }}
                id="potongan_lain"
                name="potongan_lain"
                value={frmNumberSyncfusion(args.potongan_lain)}
                disabled={true}
            />
        </div>
    );
};
// END
// ===============================================================

// ===============================================================
// Template Format Rupiah Biaya Lain saat di edit
const editTemplateBiayaLain = (args: any) => {
    return (
        <div>
            <input
                style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-28px', color: '#b1acac' }}
                id="biaya_lain"
                name="biaya_lain"
                value={frmNumberSyncfusion(args.biaya_lain)}
                disabled={true}
            />
        </div>
    );
};
// END
// ===============================================================

// ===============================================================
// Template Format Rupiah Sisa Hutang saat di edit
const editTemplateSisaHutang = (args: any) => {
    return (
        <div>
            <input
                style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-21px', color: '#b1acac' }}
                id="biaya_lain"
                name="biaya_lain"
                value={frmNumberSyncfusion(args.sisa_hutang)}
                disabled={true}
            />
        </div>
    );
};
// END
// ===============================================================

// ===============================================================
// Template Format Rupiah Total Berat saat di edit
const editTemplateTotalBerat = (args: any) => {
    return (
        <div>
            <input
                style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-42px', color: '#b1acac' }}
                id="total_berat"
                name="total_berat"
                value={frmNumberSyncfusion(args.total_berat)}
                disabled={true}
            />
        </div>
    );
};
// END
// ===============================================================

// ===============================================================
// Template Format Rupiah Bayar Mu saat di edit
const editTemplateBayarMu = (args: any) => {
    return (
        <div>
            <input
                style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-42px', color: '#b1acac' }}
                id="bayar_mu"
                name="bayar_mu"
                value={frmNumberSyncfusion(args.bayar_mu)}
                disabled={true}
            />
        </div>
    );
};
// END
// ===============================================================

const CustomSumBayarMu = (props: any) => {
    return <span style={{ fontWeight: 'bold' }}>{props.Custom}</span>;
};

export { CustomSumBayarMu, editTemplateBayarMu, editTemplateSisaHutang, editTemplateTotalBerat, editTemplateBiayaLain, editTemplatePotonganLain, editTemplateNettoMu, headerJumlahYangAkanDibayar };
