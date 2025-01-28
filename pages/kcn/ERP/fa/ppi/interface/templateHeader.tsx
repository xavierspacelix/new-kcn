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
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormatNilaiJumlah, HandleModalicon, HandleModalInput, HandleModalInputCust, HandleModalInputKolektor, HandleTglDok } from '../functional/fungsiFormPpiList';
import { frmNumber } from '@/utils/routines';
import { GetListTabNoRek, DaftarAkunKredit } from '@/lib/fa/mutasi-bank/api/api';
import Flatpickr from 'react-flatpickr';
import { DaftarAkunDebet } from '../model/apiPpi';

interface templateHeaderProps {
    userid: any;
    kode_entitas: any;
    stateDataHeader: any;
    setStateDataHeader: Function;
    setDataDaftarAkunDebet: Function;
    setFilteredDataAkunDebet: Function;
    dataDaftarAkunDebet: any;

    setDataDaftarCust: Function;
    setDataDaftarUangMuka: Function;
    setStateDataDetail: Function;
    setDataDaftarCustomer: Function;
    setDataDaftarSubledger: Function;
    setDataDaftarSalesman: Function;
    idDokumen: any;
    tipeAdd: any;
    vToken: any;

    setFilteredDataCust: Function;
    dataDaftarCust: any;
    setFilteredDataSalesman: Function;
    dataDaftarSalesman: any;

    setDataBarang: Function;
    setStateDataFooter: Function;
    dataBarang: any;
    modalJenisPenerimaan: any;
    dataHeaderAPI: any;
    onRefreshTipe: any;
    masterDataState: any;
}

const TemplateHeader: React.FC<templateHeaderProps> = ({
    userid,
    kode_entitas,
    stateDataHeader,
    setStateDataHeader,
    setDataDaftarAkunDebet,
    setFilteredDataAkunDebet,
    dataDaftarAkunDebet,

    setDataDaftarCust,
    setDataDaftarUangMuka,
    setStateDataDetail,
    setDataDaftarCustomer,
    setDataDaftarSubledger,
    setDataDaftarSalesman,
    idDokumen,
    tipeAdd,
    vToken,
    setFilteredDataCust,
    dataDaftarCust,
    setFilteredDataSalesman,
    dataDaftarSalesman,
    setDataBarang,
    setStateDataFooter,
    dataBarang,
    modalJenisPenerimaan,
    dataHeaderAPI,
    onRefreshTipe,
    masterDataState,
}: // masterKodeDokumen,
// masterDataState,
// isOpen,
// onClose,
// kode_user,
// modalJenisPembayaran,
// selectedKodeSupp,
// onRefreshTipe,
templateHeaderProps) => {
    // State State Untuk Header

    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    let disabledHeader: any;
    if (
        modalJenisPenerimaan === 'Pencairan' ||
        modalJenisPenerimaan === 'Penolakan' ||
        modalJenisPenerimaan === 'batal cair' ||
        modalJenisPenerimaan === 'batal tolak' ||
        modalJenisPenerimaan === 'UpdateFilePendukung' ||
        modalJenisPenerimaan === 'Edit Pencairan' ||
        modalJenisPenerimaan === 'Edit Penolakan'
    ) {
        disabledHeader = true;
    } else {
        disabledHeader = false;
    }

    const [noAkunAPi, setNoAkunApi] = React.useState('');
    const [namaAkunAPi, setNamaAkun] = React.useState('');
    const jumlahBayarApi = React.useRef('');
    React.useEffect(() => {
        const async = async () => {
            if (dataHeaderAPI?.tipeApi === 'API' || dataHeaderAPI?.tipeApi === 'APIWarkat') {
                // const jumlahBayar = document.getElementById('jumlahBayar') as HTMLInputElement;
                // if (jumlahBayar) {
                //     jumlahBayar.value = frmNumber(dataHeaderAPI?.jumlahMu);
                // }

                // setJumlahBayar(dataHeaderAPI?.jumlahMu);

                const respListTabNoRek = await GetListTabNoRek(kode_entitas, vToken);
                const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === dataHeaderAPI?.noRekeningApi);

                const respDaftarAkunKredit: any[] = await DaftarAkunDebet(kode_entitas, 'all');
                const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0].kode_akun);
                setNoAkunApi(respDaftarAkunKreditFix[0].no_akun);
                setNamaAkun(respDaftarAkunKreditFix[0].nama_akun);
                await setStateDataHeader((prevState: any) => ({
                    ...prevState,
                    noAkunValue: respDaftarAkunKreditFix[0].no_akun,
                    namaAkunValue: respDaftarAkunKreditFix[0].nama_akun,
                    kodeAkun: respDaftarAkunKreditFix[0].kode_akun,
                    tipeAkun: respDaftarAkunKreditFix[0].tipe,
                    isLedger: respDaftarAkunKreditFix[0].isledger,

                    jumlahBayar: dataHeaderAPI?.jumlahMu,
                    // tglDokumen: moment(dataHeaderAPI?.tglTransaksiMutasi),
                }));
                FormatNilaiJumlah(frmNumber(dataHeaderAPI?.jumlahMu), setStateDataHeader, setDataBarang, setStateDataFooter);
            }
        };
        async();
    }, [onRefreshTipe]);

    const lunasSemua = async () => {
        const newNodes = dataBarang.nodes.map((node: any) => {
            const originalSisaFaktur = node.sisa_faktur2; // Simpan nilai asli
            let sisaFaktur = originalSisaFaktur - originalSisaFaktur;
            return {
                ...node,
                sisa_faktur2: sisaFaktur,
                bayar_mu: originalSisaFaktur, // Gunakan nilai asli
            };
        });

        let totPenerimaan = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.bayar_mu);
        }, 0);

        let totPiutang = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.owing);
        }, 0);

        await setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalPenerimaan: totPenerimaan,
            selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
            sisaPiutang: totPiutang - totPenerimaan,
            totalPiutang: totPiutang,
        }));

        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            disabledLunasSemua: true,
            disabledBatalSemua: false,
        }));

        await setDataBarang({ nodes: newNodes });
    };
    const batalSemua = async () => {
        const newNodes = await dataBarang.nodes.map((node: any) => {
            let sisaFaktur = node.sisa_faktur2;
            return {
                ...node,
                sisa_faktur2: node.bayar_mu,
                bayar_mu: node.bayar_mu - node.bayar_mu,
            };
        });

        let totPenerimaan: any;
        let totPiutang: any;

        totPenerimaan = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.bayar_mu);
        }, 0);
        totPiutang = newNodes.reduce((acc: number, node: any) => {
            return acc + parseFloat(node.owing);
        }, 0);

        await setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalPenerimaan: totPenerimaan,
            selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
            sisaPiutang: totPiutang - totPenerimaan,
            totalPiutang: totPiutang,
        }));

        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            disabledLunasSemua: false,
            disabledBatalSemua: true,
        }));

        await setDataBarang({ nodes: newNodes });
    };

    return (
        <div className="mb-1">
            <div className="panel-tabel" style={{ width: '100%' }}>
                <div className="flex">
                    <div style={{ width: '40%' }}>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '21%', textAlign: 'right', marginRight: 6 }}>Tgl. Buat </label>
                            <div className="form-input mt-1 flex justify-between" style={{ width: '37%', borderRadius: 2 }}>
                                {dataHeaderAPI?.tipeApi === 'API' ? (
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={stateDataHeader?.tglBuat.toDate()}
                                        // change={(args: ChangeEventArgsCalendar) => {
                                        //     HandleTglPhuJt(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
                                        // }}
                                        style={{ margin: '-5px' }}
                                        disabled={true}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                ) : (
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={stateDataHeader?.tglBuat.toDate()}
                                        // change={(args: ChangeEventArgsCalendar) => {
                                        //     HandleTglPhuJt(moment(args.value), 'tanggalAwal', setFilterData, setCheckboxFilter);
                                        // }}
                                        style={{ margin: '-5px' }}
                                        disabled={true}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                )}
                            </div>
                            <label style={{ width: '38%', textAlign: 'right', marginRight: 6 }}>Keterangan API Bank</label>
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '21%', textAlign: 'right', marginRight: 6 }}>Tanggal</label>
                            <div className="form-input mt-1 flex justify-between" style={{ width: '37%', borderRadius: 2 }}>
                                {modalJenisPenerimaan === 'Pencairan' ||
                                modalJenisPenerimaan === 'Penolakan' ||
                                modalJenisPenerimaan === 'batal cair' ||
                                modalJenisPenerimaan === 'batal tolak' ||
                                modalJenisPenerimaan === 'UpdateFilePendukung' ||
                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                modalJenisPenerimaan === 'Edit Penolakan' ||
                                dataHeaderAPI?.tipeApi === 'APIWarkat' ? (
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={stateDataHeader?.tglDokumen.toDate()}
                                        // value={dataHeaderAPI?.tipeApi === 'API' ? moment(dataHeaderAPI?.tglTransaksiMutasi).toDate() : stateDataHeader?.tglDokumen.toDate()}
                                        style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                        disabled={disabledHeader}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                ) : dataHeaderAPI?.tipeApi === 'API' ? (
                                    // <Flatpickr
                                    //     // key="flatpickr" // Unique key for Flatpickr
                                    //     value={moment(dataHeaderAPI?.tglTransaksiMutasi).toDate()}
                                    //     options={{
                                    //         dateFormat: 'd-m-Y',
                                    //     }}
                                    //     className="form-input"
                                    //     style={{ fontSize: '11px', width: '15vh', color: '#afadadee', border: 'none' }}
                                    //     disabled={true}
                                    // />
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={moment(dataHeaderAPI?.tglTransaksiMutasi).toDate()}
                                        // value={dataHeaderAPI?.tipeApi === 'API' ? moment(dataHeaderAPI?.tglTransaksiMutasi).toDate() : stateDataHeader?.tglDokumen.toDate()}
                                        style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                        disabled={true}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                ) : (
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        // renderDayCell={onRenderDayCell}
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        // value={stateDataHeader?.tglDokumen.toDate()}
                                        value={dataHeaderAPI?.tipeApi === 'API' ? moment(dataHeaderAPI?.tglTransaksiMutasi).toDate() : stateDataHeader?.tglDokumen.toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            setStateDataHeader((prevState: any) => ({
                                                ...prevState,
                                                tglDokumen: moment(args.value),
                                            }));
                                        }}
                                        style={{ margin: '0', height: 'auto', fontSize: '14px', padding: '0' }}
                                        disabled={disabledHeader}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                )}
                            </div>
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '21%', textAlign: 'right', marginRight: 6 }}>No. Dokumen</label>
                            <input
                                className={` container form-input`}
                                style={{ background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '37%', borderRadius: 2 }}
                                disabled={true}
                                value={stateDataHeader?.noDokumenValue}
                                readOnly
                            ></input>
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            {modalJenisPenerimaan === 'Warkat' || modalJenisPenerimaan === 'Penolakan' || modalJenisPenerimaan === 'Edit Penolakan' || modalJenisPenerimaan === 'batal tolak' ? (
                                <>
                                    <div style={{ marginTop: '25px' }}></div>
                                </>
                            ) : (
                                <>
                                    <label style={{ width: '23.7%', textAlign: 'right', marginRight: 5 }}>Akun Debet</label>
                                    <input
                                        className={` container form-input`}
                                        onChange={(event) =>
                                            HandleModalInput(event.target.value, setStateDataHeader, setDataDaftarAkunDebet, kode_entitas, setFilteredDataAkunDebet, dataDaftarAkunDebet, 'noAkun')
                                        }
                                        style={
                                            modalJenisPenerimaan !== 'UpdateFilePendukung'
                                                ? { borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '22%' }
                                                : { backgroundColor: '#eeeeee', borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '22%' }
                                        }
                                        value={dataHeaderAPI?.tipeApi === 'API' || dataHeaderAPI?.tipeApi === 'APIWarkat' ? noAkunAPi : stateDataHeader?.noAkunValue}
                                        onFocus={(event) => event.target.select()}
                                        placeholder="<No Akun>"
                                        disabled={modalJenisPenerimaan === 'UpdateFilePendukung' || dataHeaderAPI?.tipeApi === 'API' ? true : false}
                                    ></input>
                                    <input
                                        className={` container form-input`}
                                        onChange={(event) => {
                                            HandleModalInput(event.target.value, setStateDataHeader, setDataDaftarAkunDebet, kode_entitas, setFilteredDataAkunDebet, dataDaftarAkunDebet, 'namaAkun');
                                        }}
                                        style={
                                            modalJenisPenerimaan !== 'UpdateFilePendukung'
                                                ? { borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '52%' }
                                                : { backgroundColor: '#eeeeee', borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '52%' }
                                        }
                                        value={dataHeaderAPI?.tipeApi === 'API' || dataHeaderAPI?.tipeApi === 'APIWarkat' ? namaAkunAPi : stateDataHeader?.namaAkunValue}
                                        onFocus={(event) => event.target.select()}
                                        placeholder="<Nama Akun>"
                                        disabled={modalJenisPenerimaan === 'UpdateFilePendukung' || dataHeaderAPI?.tipeApi === 'API' ? true : false}
                                    ></input>
                                    <div
                                        style={{ width: '12%', marginLeft: 0, marginTop: 4 }}
                                        onClick={() =>
                                            HandleModalicon(
                                                'header',
                                                'akunKredit',
                                                setStateDataHeader,
                                                setDataDaftarAkunDebet,
                                                setDataDaftarCust,
                                                kode_entitas,
                                                stateDataHeader?.kodeCustomerValue,
                                                setDataDaftarUangMuka,
                                                '',
                                                setStateDataDetail,
                                                setDataDaftarCustomer,
                                                setDataDaftarSubledger,
                                                setDataDaftarSalesman,
                                                idDokumen,
                                                tipeAdd,
                                                vToken
                                            )
                                        }
                                    >
                                        {modalJenisPenerimaan === 'UpdateFilePendukung' || dataHeaderAPI?.tipeApi === 'API' || dataHeaderAPI?.tipeApi === 'APIWarkat' ? null : (
                                            <button
                                                className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                            >
                                                <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '23.7%', textAlign: 'right', marginRight: 5 }}>Customer</label>
                            <input
                                className={` container form-input`}
                                onChange={(event) =>
                                    HandleModalInputCust(event.target.value, setStateDataHeader, setDataDaftarCust, kode_entitas, setFilteredDataCust, dataDaftarCust, 'noCust', vToken)
                                }
                                style={
                                    disabledHeader === false
                                        ? { borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '22%' }
                                        : { backgroundColor: '#eeeeee', borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '22%' }
                                }
                                value={stateDataHeader?.noCustomerValue}
                                onFocus={(event) => event.target.select()}
                                placeholder="<No Cust>"
                                disabled={disabledHeader}
                            ></input>
                            <input
                                className={` container form-input`}
                                onChange={(event) => {
                                    HandleModalInputCust(event.target.value, setStateDataHeader, setDataDaftarCust, kode_entitas, setFilteredDataCust, dataDaftarCust, 'namaCust', vToken);
                                }}
                                style={
                                    disabledHeader === false
                                        ? { borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '52%' }
                                        : { backgroundColor: '#eeeeee', borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '52%' }
                                }
                                value={stateDataHeader?.namaCustomerValue}
                                onFocus={(event) => event.target.select()}
                                placeholder="<Nama Customer>"
                                disabled={disabledHeader}
                            ></input>
                            <div
                                style={{ width: '12%', marginLeft: 0, marginTop: 4 }}
                                onClick={() =>
                                    HandleModalicon(
                                        'header',
                                        'cust',
                                        setStateDataHeader,
                                        setDataDaftarAkunDebet,
                                        setDataDaftarCust,
                                        kode_entitas,
                                        stateDataHeader?.kodeCustomerValue,
                                        setDataDaftarUangMuka,
                                        dataBarang, // args
                                        setStateDataDetail,
                                        setDataDaftarCustomer,
                                        setDataDaftarSubledger,
                                        setDataDaftarSalesman,
                                        idDokumen,
                                        tipeAdd,
                                        vToken
                                    )
                                }
                            >
                                {modalJenisPenerimaan === 'Pencairan' ||
                                modalJenisPenerimaan === 'Penolakan' ||
                                modalJenisPenerimaan === 'batal cair' ||
                                modalJenisPenerimaan === 'batal tolak' ||
                                modalJenisPenerimaan === 'UpdateFilePendukung' ||
                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                modalJenisPenerimaan === 'Edit Penolakan' ? null : (
                                    <>
                                        <button
                                            className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                            style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                        >
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '30%' }}>
                        <textarea
                            disabled={true}
                            value={dataHeaderAPI?.tipeApi === 'API' ? dataHeaderAPI?.description : stateDataHeader?.apiCatatan}
                            style={{ marginTop: 2, width: '95.7%', height: 140, backgroundColor: '#eeeeee', border: '1px solid #bfc9d4' }}
                        ></textarea>
                        {masterDataState === 'BARU' ? null : stateDataHeader?.kodeAkun === stateDataHeader?.kodeAkunUangMukaJual ? (
                            <div style={{ width: 250, marginTop: 6, backgroundColor: '#08713c', color: 'yellow' }}>
                                <label style={{ textAlign: 'left', marginRight: 6 }}>Saldo Uang Muka = {frmNumber(stateDataHeader?.uangMuka)}</label>
                            </div>
                        ) : null}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                        <div className="flex" style={{ alignItems: 'center', marginTop: '5px', marginBottom: '5px' }}>
                            <label style={{ width: '24%', textAlign: 'right', marginRight: 6, marginTop: '11px' }}>Kolektor</label>
                            <input
                                className={` container form-input`}
                                onChange={(event) => {
                                    HandleModalInputKolektor(
                                        event.target.value,
                                        setStateDataHeader,
                                        setDataDaftarSalesman,
                                        kode_entitas,
                                        setFilteredDataSalesman,
                                        dataDaftarSalesman,
                                        'namaKolektor',
                                        vToken
                                    );
                                }}
                                style={
                                    disabledHeader === false
                                        ? { borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '63%' }
                                        : { backgroundColor: '#eeeeee', borderRadius: 2, fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '63%' }
                                }
                                value={stateDataHeader?.nama_salesValue}
                                onFocus={(event) => event.target.select()}
                                placeholder="<Nama Kolektor>"
                                disabled={disabledHeader}
                            ></input>
                            {modalJenisPenerimaan === 'Pencairan' ||
                            modalJenisPenerimaan === 'Penolakan' ||
                            modalJenisPenerimaan === 'batal cair' ||
                            modalJenisPenerimaan === 'batal tolak' ||
                            modalJenisPenerimaan === 'UpdateFilePendukung' ||
                            modalJenisPenerimaan === 'Edit Pencairan' ||
                            modalJenisPenerimaan === 'Edit Penolakan' ? (
                                <div style={{ width: '12%', marginLeft: 0, marginTop: 4 }}>
                                    <button
                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                        style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                    >
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    style={{ width: '12%', marginLeft: 0, marginTop: 4 }}
                                    onClick={() =>
                                        HandleModalicon(
                                            'header',
                                            'kolektor',
                                            setStateDataHeader,
                                            setDataDaftarAkunDebet,
                                            setDataDaftarCust,
                                            kode_entitas,
                                            stateDataHeader?.kodeCustomerValue,
                                            setDataDaftarUangMuka,
                                            '',
                                            setStateDataDetail,
                                            setDataDaftarCustomer,
                                            setDataDaftarSubledger,
                                            setDataDaftarSalesman,
                                            idDokumen,
                                            tipeAdd,
                                            vToken
                                        )
                                    }
                                >
                                    <button
                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                        style={{ height: 26, marginLeft: 0, borderRadius: 2 }}
                                    >
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" style={{ margin: '2px 2px 0px 6px' }} />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex">
                            <div style={{ width: '38%' }}>
                                <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 1, height: 136 }}>
                                    <label>No./Tgl TTP</label>
                                    <div className="container form-input" style={{ borderRadius: 2, width: '100%', marginLeft: 0, marginTop: 4 }}>
                                        <TextBoxComponent
                                            id="noReferensi"
                                            placeholder=""
                                            value={stateDataHeader?.noReferensi}
                                            input={(args: FocusInEventArgs) => {
                                                const value: any = args.value;
                                                setStateDataHeader((prevState: any) => ({
                                                    ...prevState,
                                                    noReferensi: value,
                                                }));
                                            }}
                                            disabled={modalJenisPenerimaan === 'UpdateFilePendukung'}
                                        />
                                    </div>
                                    <div className="form-input mt-1 flex justify-between" style={{ width: '100%', borderRadius: 2 }}>
                                        {modalJenisPenerimaan === 'UpdateFilePendukung' ? (
                                            <DatePickerComponent
                                                locale="id"
                                                cssClass="e-custom-style"
                                                // renderDayCell={onRenderDayCell}
                                                enableMask={true}
                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                showClearButton={false}
                                                format="dd-MM-yyyy"
                                                value={stateDataHeader?.tglReferensi.toDate()}
                                                disabled={disabledHeader}
                                            >
                                                <Inject services={[MaskedDateTime]} />
                                            </DatePickerComponent>
                                        ) : (
                                            <DatePickerComponent
                                                locale="id"
                                                cssClass="e-custom-style"
                                                // renderDayCell={onRenderDayCell}
                                                enableMask={true}
                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                showClearButton={false}
                                                format="dd-MM-yyyy"
                                                value={stateDataHeader?.tglReferensi.toDate()}
                                                change={(args: ChangeEventArgsCalendar) => {
                                                    HandleTglDok(moment(args.value), 'tglReferensi', setStateDataHeader);
                                                }}
                                            >
                                                <Inject services={[MaskedDateTime]} />
                                            </DatePickerComponent>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {modalJenisPenerimaan === 'Warkat' ? (
                                <>
                                    <div style={{ width: '62%' }}>
                                        <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 1, height: 136 }}>
                                            <div className="flex">
                                                <div style={{ width: '45%' }}>
                                                    <label>No. Warkat</label>
                                                </div>
                                                <div style={{ width: '55%', marginTop: '-13px' }}>
                                                    <div className="container form-input" style={{ borderRadius: 2, width: '100%', marginLeft: 0, marginTop: 4 }}>
                                                        <TextBoxComponent
                                                            value={stateDataHeader?.noWarkat}
                                                            id="noWarkat"
                                                            placeholder=""
                                                            input={(args: FocusInEventArgs) => {
                                                                const value: any = args.value;
                                                                setStateDataHeader((prevState: any) => ({
                                                                    ...prevState,
                                                                    noWarkat: value,
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div style={{ width: '45%' }}>
                                                    <label style={{ marginTop: '14px' }}>Tgl. Jatuh Tempo</label>
                                                </div>
                                                <div style={{ width: '55%' }}>
                                                    <div className="form-input mt-1 flex justify-between" style={{ width: '100%', borderRadius: 2 }}>
                                                        <DatePickerComponent
                                                            locale="id"
                                                            cssClass="e-custom-style"
                                                            // renderDayCell={onRenderDayCell}
                                                            enableMask={true}
                                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                            showClearButton={false}
                                                            format="dd-MM-yyyy"
                                                            value={stateDataHeader?.tglValuta.toDate()}
                                                            change={(args: ChangeEventArgsCalendar) => {
                                                                setStateDataHeader((prevState: any) => ({
                                                                    ...prevState,
                                                                    tglValuta: moment(args.value),
                                                                }));
                                                            }}
                                                        >
                                                            <Inject services={[MaskedDateTime]} />
                                                        </DatePickerComponent>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : modalJenisPenerimaan === 'Transfer' ? (
                                <>
                                    <div style={{ width: '62%' }}>
                                        <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 1, height: 136 }}>
                                            <label>No. Bukti Transfer</label>
                                            <div className="container form-input" style={{ borderRadius: 2, width: '73%', marginLeft: 0, marginTop: 4 }}>
                                                <TextBoxComponent
                                                    value={stateDataHeader?.noBuktiTransfer}
                                                    id="noBuktiTransfer"
                                                    placeholder=""
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        setStateDataHeader((prevState: any) => ({
                                                            ...prevState,
                                                            noBuktiTransfer: value,
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            {/* <div className="form-input mt-1 flex justify-between" style={{ width: '73%', borderRadius: 2 }}>
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div> */}
                                        </div>
                                    </div>
                                </>
                            ) : modalJenisPenerimaan === 'Pencairan' ||
                              modalJenisPenerimaan === 'Penolakan' ||
                              modalJenisPenerimaan === 'batal cair' ||
                              modalJenisPenerimaan === 'batal tolak' ||
                              modalJenisPenerimaan === 'Edit Pencairan' ||
                              modalJenisPenerimaan === 'Edit Penolakan' ? (
                                <>
                                    <div style={{ width: '62%' }}>
                                        <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 1, height: 136 }}>
                                            <div className="flex">
                                                <div style={{ width: '45%' }}>
                                                    <label>No. Warkat</label>
                                                </div>
                                                <div style={{ width: '55%', marginTop: '-13px' }}>
                                                    {dataHeaderAPI?.tipeApi === 'APIWarkat' ? (
                                                        <input
                                                            className={` container form-input`}
                                                            style={{
                                                                background: '#eeeeee',
                                                                fontSize: 11,
                                                                marginTop: 4,
                                                                marginLeft: 0,
                                                                borderColor: '#bfc9d4',
                                                                width: '99%',
                                                                borderRadius: 2,
                                                                height: '33px',
                                                            }}
                                                            disabled={true}
                                                            value={stateDataHeader?.noWarkat}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="container form-input" style={{ borderRadius: 2, width: '100%', marginLeft: 0, marginTop: 4 }}>
                                                            <TextBoxComponent
                                                                value={stateDataHeader?.noWarkat}
                                                                id="noWarkat"
                                                                placeholder=""
                                                                input={(args: FocusInEventArgs) => {
                                                                    const value: any = args.value;
                                                                    setStateDataHeader((prevState: any) => ({
                                                                        ...prevState,
                                                                        noWarkat: value,
                                                                    }));
                                                                }}
                                                                disabled={dataHeaderAPI?.tipeApi === 'APIWarkat' ? true : false}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div style={{ width: '45%' }}>
                                                    <label style={{ marginTop: '14px' }}>Tgl. Jatuh Tempo</label>
                                                </div>
                                                <div style={{ width: '55%' }}>
                                                    {dataHeaderAPI?.tipeApi === 'APIWarkat' ? (
                                                        <input
                                                            className={` container form-input`}
                                                            style={{
                                                                background: '#eeeeee',
                                                                fontSize: 11,
                                                                marginTop: 4,
                                                                marginLeft: 0,
                                                                borderColor: '#bfc9d4',
                                                                width: '99%',
                                                                borderRadius: 2,
                                                                height: '33px',
                                                            }}
                                                            disabled={true}
                                                            value={moment(stateDataHeader?.tglValuta).format('DD-MM-YYYY')}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="form-input mt-1 flex justify-between" style={{ width: '100%', borderRadius: 2 }}>
                                                            <DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                value={stateDataHeader?.tglValuta.toDate()}
                                                                disabled={disabledHeader}
                                                            >
                                                                <Inject services={[MaskedDateTime]} />
                                                            </DatePickerComponent>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <div style={{ width: '45%' }}>
                                                    <label style={{ marginTop: '14px' }}>Tgl. Efektif</label>
                                                </div>
                                                <div style={{ width: '55%' }}>
                                                    {dataHeaderAPI?.tipeApi === 'APIWarkat' ? (
                                                        <input
                                                            className={` container form-input`}
                                                            style={{
                                                                background: '#eeeeee',
                                                                fontSize: 11,
                                                                marginTop: 4,
                                                                marginLeft: 0,
                                                                borderColor: '#bfc9d4',
                                                                width: '99%',
                                                                borderRadius: 2,
                                                                height: '33px',
                                                            }}
                                                            disabled={true}
                                                            value={moment(dataHeaderAPI?.tglTransaksiMutasi).format('DD-MM-YYYY')}
                                                            // value={moment(dataHeaderAPI?.tglTransaksiMutasi).toDate()}
                                                            readOnly
                                                        ></input>
                                                    ) : (
                                                        <div className="form-input mt-1 flex justify-between" style={{ width: '100%', borderRadius: 2 }}>
                                                            <DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                value={stateDataHeader?.tglEfektif.toDate()}
                                                                change={(args: ChangeEventArgsCalendar) => {
                                                                    setStateDataHeader((prevState: any) => ({
                                                                        ...prevState,
                                                                        tglEfektif: moment(args.value),
                                                                    }));
                                                                }}
                                                            >
                                                                <Inject services={[MaskedDateTime]} />
                                                            </DatePickerComponent>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ width: '62%' }}>
                                        <div className="border p-3" style={{ backgroundColor: '#eeeeee', borderRadius: 1, height: 136 }}></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex" style={{ alignItems: 'center' }}>
                    <div style={{ width: '8.9%' }}></div>
                    <div
                        style={
                            modalJenisPenerimaan === 'Warkat'
                                ? { width: '62%', marginTop: '-18px' }
                                : modalJenisPenerimaan === 'Pencairan' ||
                                  modalJenisPenerimaan === 'Penolakan' ||
                                  modalJenisPenerimaan === 'batal cair' ||
                                  modalJenisPenerimaan === 'batal tolak' ||
                                  modalJenisPenerimaan === 'UpdateFilePendukung' ||
                                  modalJenisPenerimaan === 'Edit Pencairan' ||
                                  modalJenisPenerimaan === 'Edit Penolakan'
                                ? { width: '62%', marginTop: '-4px' }
                                : { width: '62%', marginTop: '-11px' }
                        }
                    >
                        <textarea
                            value={stateDataHeader?.catatanValue}
                            disabled={true}
                            style={{ position: 'sticky', width: '87.4%', height: 98, backgroundColor: '#eeeeee', border: '1px solid #bfc9d4' }}
                        ></textarea>
                    </div>
                    <div style={{ width: '30%' }}>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '100%', marginRight: 6, textAlign: 'right' }}>Kurs</label>
                            <input
                                value={dataHeaderAPI?.tipeApi === 'API' ? '1.00' : stateDataHeader?.kursValue}
                                disabled={true}
                                className={` container form-input`}
                                style={{
                                    backgroundColor: '#eeeeee',
                                    borderRadius: 2,
                                    fontSize: 11,
                                    marginTop: 4,
                                    marginRight: 17,
                                    borderColor: '#bfc9d4',
                                    width: '40%',
                                    // textAlign: 'right',
                                }}
                                readOnly
                            ></input>
                            {stateDataHeader?.disabledBayarAllFaktur === true ? <div style={{ width: '38%' }}></div> : <label style={{ width: '38%', fontWeight: 'bold', marginTop: 9 }}>IDR</label>}
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <label style={{ width: '100%', marginRight: 6, textAlign: 'right' }}>Jumlah</label>
                            {modalJenisPenerimaan === 'UpdateFilePendukung' ? (
                                <input
                                    className={` container form-input`}
                                    onFocus={(event) => event.target.select()}
                                    onBlur={(event) => FormatNilaiJumlah(event.target.value, setStateDataHeader, setDataBarang, setStateDataFooter)}
                                    id="jumlahBayar"
                                    onKeyDown={(event) => {
                                        const char = event.key;
                                        const isValidChar = /[0-9.\s]/.test(char) || event.keyCode === 8;
                                        if (!isValidChar) {
                                            event.preventDefault();
                                        }
                                        const inputValue = (event.target as HTMLInputElement).value;
                                        if (char === '.' && inputValue.includes('.')) {
                                            event.preventDefault();
                                        }
                                    }}
                                    style={
                                        disabledHeader === false
                                            ? { textAlign: 'right', borderRadius: 2, fontSize: 11, marginTop: 4, marginRight: 26, borderColor: '#bfc9d4', width: '74%' }
                                            : { backgroundColor: '#eeeeee', textAlign: 'right', borderRadius: 2, fontSize: 11, marginTop: 4, marginRight: 26, borderColor: '#bfc9d4', width: '74%' }
                                    }
                                    disabled={dataHeaderAPI?.tipeApi === 'API' ? true : disabledHeader}
                                    value={frmNumber(stateDataHeader?.jumlahBayar)}
                                ></input>
                            ) : (
                                <input
                                    className={` container form-input`}
                                    onFocus={(event) => event.target.select()}
                                    onBlur={(event) => FormatNilaiJumlah(event.target.value, setStateDataHeader, setDataBarang, setStateDataFooter)}
                                    id="jumlahBayar"
                                    onKeyDown={(event) => {
                                        const char = event.key;
                                        const isValidChar = /[0-9.\s]/.test(char) || event.keyCode === 8;
                                        if (!isValidChar) {
                                            event.preventDefault();
                                        }
                                        const inputValue = (event.target as HTMLInputElement).value;
                                        if (char === '.' && inputValue.includes('.')) {
                                            event.preventDefault();
                                        }
                                    }}
                                    style={
                                        disabledHeader === false
                                            ? { textAlign: 'right', borderRadius: 2, fontSize: 11, marginTop: 4, marginRight: 26, borderColor: '#bfc9d4', width: '74%' }
                                            : { backgroundColor: '#eeeeee', textAlign: 'right', borderRadius: 2, fontSize: 11, marginTop: 4, marginRight: 26, borderColor: '#bfc9d4', width: '74%' }
                                    }
                                    disabled={dataHeaderAPI?.tipeApi === 'API' ? true : disabledHeader}
                                ></input>
                            )}
                        </div>
                        <div className="flex" style={{ alignItems: 'center' }}>
                            <div style={{ width: '82%' }}></div>
                            <div style={{ width: '84%', marginBottom: '13px', marginTop: '7px' }}>
                                {modalJenisPenerimaan === 'Pencairan' ||
                                modalJenisPenerimaan === 'Penolakan' ||
                                modalJenisPenerimaan === 'batal cair' ||
                                modalJenisPenerimaan === 'batal tolak' ||
                                modalJenisPenerimaan === 'UpdateFilePendukung' ||
                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                modalJenisPenerimaan === 'Edit Penolakan' ? null : (
                                    <>
                                        <ButtonComponent
                                            id="buLunasSemua"
                                            content="Lunas Semua"
                                            disabled={stateDataHeader?.disabledLunasSemua}
                                            cssClass="e-primary e-small"
                                            // iconCss="e-icons e-small e-search"
                                            style={{ width: '42%', marginRight: '10px', backgroundColor: '#3b3f5c', marginTop: 2, color: '#545252', background: '#eeeeee' }}
                                            // onClick={() => {
                                            //     stateDataHeader?.disabledResetPembayaran === true
                                            //         ? BayarSemuaFaktur(setDataBarang, setStateDataFooter, setStateDataHeader, stateDataHeader)
                                            //         : ResetPembayaran(setDataBarang, setStateDataFooter, setStateDataHeader);
                                            // }}
                                            onClick={lunasSemua}
                                        />
                                        <ButtonComponent
                                            id="buBatalSemua"
                                            content="Batalkan Semua"
                                            disabled={stateDataHeader?.disabledBatalSemua}
                                            cssClass="e-primary e-small"
                                            // iconCss="e-icons e-small e-search"
                                            style={{ width: '47%', backgroundColor: '#3b3f5c', marginTop: 2, color: '#545252', background: '#eeeeee' }}
                                            // onClick={() => {
                                            //     stateDataHeader?.disabledResetPembayaran === true
                                            //         ? BayarSemuaFaktur(setDataBarang, setStateDataFooter, setStateDataHeader, stateDataHeader)
                                            //         : ResetPembayaran(setDataBarang, setStateDataFooter, setStateDataHeader);
                                            // }}
                                            onClick={batalSemua}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex" style={{ alignItems: 'center', marginTop: 12, textAlign: 'left' }}>
                    <div style={{ width: '100%', color: 'green', marginLeft: '20px', marginBottom: '10px' }}>
                        <b>{stateDataHeader?.jumlahBayar !== '' ? '** ' + stateDataHeader?.terbilangJumlah + ' **' : ''}</b>
                    </div>
                    <div style={{ width: '75%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default TemplateHeader;
