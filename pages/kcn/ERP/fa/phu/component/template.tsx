import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import moment from 'moment';
import { frmNumber, tanpaKoma } from '@/utils/routines';
import { HandleModalicon } from './fungsiFormPhuList';

import React from 'react'

export default function template() {
  return (
    <div>template</div>
  )
}


// ===============================================================================================
// Template

// END
// ===============================================================================================

// ===============================================================================================
// Edit Tamplate
const EditTemplateNoSj = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                <TextBoxComponent id="no_sj" name="no_sj" className="no_sj" value={args.no_sj} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateNoVch = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                <TextBoxComponent id="no_vch" name="no_vch" className="no_vch" value={args.no_vch} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateNoFb = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                <TextBoxComponent id="no_fb" name="no_fb" className="no_fb" value={args.no_fb} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateTglFb = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'center' }}>
                <TextBoxComponent id="tgl_fb" name="tgl_fb" className="tgl_fb" value={moment(args.tgl_fb).format('DD-MM-YYYY')} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateTglJt = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'center' }}>
                <TextBoxComponent id="tgl_jt" name="tgl_jt" className="tgl_jt" value={moment(args.tgl_jt).format('DD-MM-YYYY')} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateHari = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'center' }}>
                <TextBoxComponent id="hari" name="hari" className="hari" value={args.hari} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateFaktur = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                <TextBoxComponent id="faktur" name="faktur" className="faktur" value={frmNumber(args.faktur)} disabled readOnly />
            </div>
        </div>
    );
};
const EditTemplateSisaHutang = (args: any) => {
    let sisa_hutang;
    const format = args.sisa_hutang.includes(',');
    if (format) {
        sisa_hutang = tanpaKoma(args.sisa_hutang);
    } else {
        sisa_hutang = args.sisa_hutang;
    }
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                <TextBoxComponent id="sisa_hutang" name="sisa_hutang" className="sisa_hutang" value={frmNumber(sisa_hutang)} disabled readOnly />
            </div>
        </div>
    );
};

const EditTemplateSisa = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                <TextBoxComponent id="sisa" name="sisa" className="sisa" value={frmNumber(args.sisa)} disabled readOnly />
            </div>
        </div>
    );
};

// Detail Jurnal
const EditTemplateNoAkun = (
    args: any,
    tipe: string,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kode_entitas: string,
    kode_supp: any,
    setDataDaftarUangMuka: Function,
    setStateDataDetail: Function,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any
) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                <TextBoxComponent id="no_akun" name="no_akun" className="no_akun" value={args.no_akun} disabled readOnly />
                <span>
                    <ButtonComponent
                        id="buNoAkun"
                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                        cssClass="e-primary e-small e-round"
                        iconCss="e-icons e-small e-search"
                        onClick={() => {
                            HandleModalicon(
                                'akunJurnal',
                                tipe,
                                setStateDataHeader,
                                setDataDaftarAkunKredit,
                                setDataDaftarSupplier,
                                kode_entitas,
                                kode_supp,
                                setDataDaftarUangMuka,
                                args,
                                setStateDataDetail,
                                setDataDaftarCustomer,
                                setDataDaftarSubledger,
                                idDokumen,
                                tipeAdd
                            );
                        }}
                        style={{ backgroundColor: '#3b3f5c' }}
                    />
                </span>
            </div>
        </div>
    );
};
const EditTemplateNamaAkun = (
    args: any,
    tipe: string,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kode_entitas: string,
    kode_supp: any,
    setDataDaftarUangMuka: Function,
    setStateDataDetail: Function,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any
) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                <TextBoxComponent id="nama_akun" name="nama_akun" className="nama_akun" value={args.nama_akun} disabled readOnly />
                <span>
                    <ButtonComponent
                        id="buNamaAkun"
                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                        cssClass="e-primary e-small e-round"
                        iconCss="e-icons e-small e-search"
                        onClick={() => {
                            HandleModalicon(
                                'akunJurnal',
                                tipe,
                                setStateDataHeader,
                                setDataDaftarAkunKredit,
                                setDataDaftarSupplier,
                                kode_entitas,
                                kode_supp,
                                setDataDaftarUangMuka,
                                args,
                                setStateDataDetail,
                                setDataDaftarCustomer,
                                setDataDaftarSubledger,
                                idDokumen,
                                tipeAdd
                            );
                        }}
                        style={{ backgroundColor: '#3b3f5c' }}
                    />
                </span>
            </div>
        </div>
    );
};

const EditTemplateMu = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                <TextBoxComponent id="mu" name="mu" className="mu" value={args.mu} disabled readOnly />
            </div>
        </div>
    );
};

const EditTemplateSubledger = (
    args: any,
    tipe: string,
    setStateDataHeader: Function,
    setDataDaftarAkunKredit: Function,
    setDataDaftarSupplier: Function,
    kode_entitas: string,
    kode_supp: any,
    setDataDaftarUangMuka: Function,
    setStateDataDetail: Function,
    setDataDaftarCustomer: Function,
    setDataDaftarSubledger: Function,
    idDokumen: any,
    tipeAdd: any
) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                <TextBoxComponent id="subledger" name="subledger" className="subledger" value={args.subledger} disabled readOnly />
                <span>
                    <ButtonComponent
                        id="buSubledger"
                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                        cssClass="e-primary e-small e-round"
                        iconCss="e-icons e-small e-search"
                        onClick={() => {
                            HandleModalicon(
                                'akunSubledger',
                                tipe,
                                setStateDataHeader,
                                setDataDaftarAkunKredit,
                                setDataDaftarSupplier,
                                kode_entitas,
                                kode_supp,
                                setDataDaftarUangMuka,
                                args,
                                setStateDataDetail,
                                setDataDaftarCustomer,
                                setDataDaftarSubledger,
                                idDokumen,
                                tipeAdd
                            );
                        }}
                        style={{ backgroundColor: '#3b3f5c' }}
                    />
                </span>
            </div>
        </div>
    );
};

const EditTemplateDepartemen = (args: any) => {
    return (
        <div>
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                <TextBoxComponent id="departemen" name="departemen" className="departemen" value={args.departemen} disabled readOnly />
            </div>
        </div>
    );
};

function SafelyAddClassToRef(ref: React.RefObject<HTMLElement>, className: string) {
    if (ref.current) {
        ref.current.classList.add(className);
    } else {
        console.error('Ref to element is null.');
    }
}

// END
// ===============================================================================================

export {
    SafelyAddClassToRef,
    EditTemplateDepartemen,
    EditTemplateSubledger,
    EditTemplateMu,
    EditTemplateNamaAkun,
    EditTemplateNoAkun,
    EditTemplateSisa,
    EditTemplateSisaHutang,
    EditTemplateFaktur,
    EditTemplateHari,
    EditTemplateTglJt,
    EditTemplateTglFb,
    EditTemplateNoFb,
    EditTemplateNoVch,
    EditTemplateNoSj,
};
