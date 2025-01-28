import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { frmNumber } from '@/utils/routines';

interface templateHeaderProps {
    userid: any;
    kode_entitas: any;
    dataMasterList: any;
    setListStateData: any;
    listStateData: any;
    // stateDataHeader: any;
    // setStateDataHeader: Function;
    // setDataDaftarAkunDebet: Function;
    // setFilteredDataAkunDebet: Function;
    // dataDaftarAkunDebet: any;

    // setDataDaftarCust: Function;
    // setDataDaftarUangMuka: Function;
    // setStateDataDetail: Function;
    // setDataDaftarCustomer: Function;
    // setDataDaftarSubledger: Function;
    // setDataDaftarSalesman: Function;
    // idDokumen: any;
    // tipeAdd: any;
    // vToken: any;

    // setFilteredDataCust: Function;
    // dataDaftarCust: any;
    // setFilteredDataSalesman: Function;
    // dataDaftarSalesman: any;

    // setDataBarang: Function;
    // setStateDataFooter: Function;
    // dataBarang: any;
    // modalJenisPenerimaan: any;
    // masterKodeDokumen: any;
    // masterDataState: any;
    // isOpen: boolean;
    // onClose: any;
    // kode_user: any;
    // modalJenisPembayaran: any;
}

const TemplateHeader: React.FC<templateHeaderProps> = ({
    userid,
    kode_entitas,
    dataMasterList,
    setListStateData,
    listStateData,
}: // stateDataHeader,
// setStateDataHeader,
// setDataDaftarAkunDebet,
// setFilteredDataAkunDebet,
// dataDaftarAkunDebet,

// setDataDaftarCust,
// setDataDaftarUangMuka,
// setStateDataDetail,
// setDataDaftarCustomer,
// setDataDaftarSubledger,
// setDataDaftarSalesman,
// idDokumen,
// tipeAdd,
// vToken,
// setFilteredDataCust,
// dataDaftarCust,
// setFilteredDataSalesman,
// dataDaftarSalesman,
// setDataBarang,
// setStateDataFooter,
// dataBarang,
// modalJenisPenerimaan,
// masterKodeDokumen,
// masterDataState,
// isOpen,
// onClose,
// kode_user,
// modalJenisPembayaran,
// selectedKodeSupp,
// onRefreshTipe,
templateHeaderProps) => {
    return (
        <div className="mb-1">
            <div className="panel-tabel" style={{ width: '100%' }}>
                <div className="flex">
                    <div style={{ width: '50%' }}>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '16%', textAlign: 'right', marginRight: 6 }}>Tanggal </label>
                            <input
                                className={` container form-input`}
                                style={{ background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '37%', borderRadius: 2 }}
                                disabled={true}
                                value={moment(dataMasterList?.tgl_ttp).format('DD-MM-YYYY')}
                                readOnly
                            />
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '16%', textAlign: 'right', marginRight: 6 }}>No. TTP</label>
                            <input
                                className={` container form-input`}
                                style={{ background: '#eeeeee', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', width: '37%', borderRadius: 2 }}
                                disabled={true}
                                value={dataMasterList?.no_ttp}
                                readOnly
                            />
                        </div>

                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '16%', textAlign: 'right', marginRight: 6 }}>Salesman</label>
                            <input
                                className={` container form-input`}
                                style={{ background: '#eeeeee', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', width: '78%', borderRadius: 2 }}
                                disabled={true}
                                value={dataMasterList?.nama_sales}
                                readOnly
                            />
                        </div>

                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '16%', textAlign: 'right', marginRight: 6 }}>Customer</label>
                            <input
                                className={` container form-input`}
                                style={{ background: '#eeeeee', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', width: '78%', borderRadius: 2 }}
                                disabled={true}
                                value={dataMasterList?.nama_relasi}
                                readOnly
                            />
                        </div>

                        <div className="flex">
                            <div style={{ width: '100%', marginLeft: '29px', marginTop: '4px', marginBottom: '5px' }}>
                                <div className="border p-3" style={{ borderRadius: 1, height: 209, borderColor: '#8d8c8cee' }}>
                                    <label style={{ textDecoration: 'underline', fontWeight: 'bold', fontSize: '13px' }}>Summary : </label>
                                    <div className="flex">
                                        <div style={{ width: '50%' }}>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Jml. Faktur </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagJmlFaktur === 'detail'
                                                            ? frmNumber(listStateData?.jmlFaktur)
                                                            : dataMasterList?.jml_faktur === '0.0000'
                                                            ? ''
                                                            : frmNumber(dataMasterList?.jml_faktur)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Jml. Uang Muka </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={dataMasterList?.jml_titipan === '0.0000' ? '' : frmNumber(dataMasterList?.jml_titipan)}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Jml. Pembayaran </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagJmlFaktur === 'detail'
                                                            ? frmNumber(listStateData?.jmlFaktur)
                                                            : dataMasterList?.jml_bayar === '0.0000'
                                                            ? ''
                                                            : frmNumber(dataMasterList?.jml_bayar)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div style={{ width: '50%' }}>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Tunai </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagTipe === 'Tunai'
                                                            ? listStateData?.plagJmlFaktur === 'detail'
                                                                ? frmNumber(listStateData?.jmlFaktur)
                                                                : dataMasterList?.nilai_tunai === 0
                                                                ? ''
                                                                : frmNumber(dataMasterList?.nilai_tunai)
                                                            : dataMasterList?.nilai_tunai === 0
                                                            ? ''
                                                            : frmNumber(dataMasterList?.nilai_tunai)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Transfer </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagTipe === 'Transfer'
                                                            ? listStateData?.plagJmlFaktur === 'detail'
                                                                ? frmNumber(listStateData?.jmlFaktur)
                                                                : dataMasterList?.nilai_transfer === 0
                                                                ? ''
                                                                : frmNumber(dataMasterList?.nilai_transfer)
                                                            : dataMasterList?.nilai_transfer === 0
                                                            ? ''
                                                            : frmNumber(dataMasterList?.nilai_transfer)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Warkat </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagTipe === 'Warkat'
                                                            ? listStateData?.plagJmlFaktur === 'detail'
                                                                ? frmNumber(listStateData?.jmlFaktur)
                                                                : dataMasterList?.nilai_warkat === 0
                                                                ? ''
                                                                : frmNumber(dataMasterList?.nilai_warkat)
                                                            : dataMasterList?.nilai_warkat === 0
                                                            ? ''
                                                            : frmNumber(dataMasterList?.nilai_warkat)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Uang Muka </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagTipe === 'Titipan'
                                                            ? listStateData?.plagJmlFaktur === 'detail'
                                                                ? frmNumber(listStateData?.jmlFaktur)
                                                                : dataMasterList?.nilai_titipan === 0
                                                                ? ''
                                                                : frmNumber(dataMasterList?.nilai_titipan)
                                                            : dataMasterList?.nilai_titipan === 0
                                                            ? ''
                                                            : frmNumber(dataMasterList?.nilai_titipan)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Pembulatan </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={dataMasterList?.nilai_bulat === 0 ? '' : frmNumber(dataMasterList?.nilai_bulat)}
                                                    readOnly
                                                />
                                            </div>
                                            <div className="flex" style={{ alignItems: 'center' }}>
                                                <label style={{ width: '43%', textAlign: 'right', marginRight: 6 }}>Jml. Diterima </label>
                                                <input
                                                    className={` container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 1,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '53%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={
                                                        listStateData?.plagJmlFaktur === 'detail'
                                                            ? frmNumber(listStateData?.jmlFaktur)
                                                            : dataMasterList?.jml_terima === 0
                                                            ? ''
                                                            : frmNumber(dataMasterList?.jml_terima)
                                                    }
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateHeader;
