import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { L10n } from '@syncfusion/ej2-base';
import idIDLocalization from '@/public/syncfusion/locale.json';

import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import axios from 'axios';
L10n.load(idIDLocalization);
import Swal from 'sweetalert2';
import styles from './prabkk.module.css';
import stylesTtb from '../prabkklist.module.css';
import { faList, faMagnifyingGlass, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { frmNumber, generateNU, generateTerbilang, moneyToString, myAlertGlobal, tanpaKoma } from '@/utils/routines';
import { PraBkkEdit } from '../model/api';
import FrmDlgAkunJurnal from './frmDlgAkunJurnal';
import FrmDlgSubLedger from './frmSubledgerDlg';
import { handleInputJumlah, SetDataDokumen } from './fungsi';
import { GetListTabNoRek } from '@/lib/fa/mutasi-bank/api/api';
import { DaftarAkunDebet } from '../../ppi/model/apiPpi';

interface HeaderPraBkkProps {
    stateDokumen: any;
    isOpen: boolean;
    onClose: () => void;
    onRefresh: any;
    objekHeader: any;
    setobjekHeader: Function;
    listAkunJurnalObjek: any;
    fromBok: boolean;
    dataListMutasibank: any;
    onRefreshTipe: any;
}

// const HeaderPraBkk = ({ stateDokumen, isOpen, onClose, onRefresh, objekHeader, setobjekHeader, stateDialog, setStateDialog, listAkunJurnalObjek }: HeaderPraBkkProps) => {
const HeaderPraBkk = ({ stateDokumen, isOpen, onClose, onRefresh, objekHeader, setobjekHeader, listAkunJurnalObjek, fromBok, dataListMutasibank, onRefreshTipe }: HeaderPraBkkProps) => {
    // console.log(fromBok, 'fromBok');
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const [apiBKK_status, setApiBKK_status] = useState(false);
    const [terbilang, setTerbilang] = useState('');
    const [modalDaftarAkun, setModalDaftarAkun] = useState(false);
    const [isAmountFocused, setIsAmountFocused] = useState(false);

    const [modalSource, setModalSource] = useState('');
    const [modalSourceAkun, setModalSourceAkun] = useState('hhh');
    const [showFrmDlgAkunJurnal, setShowFrmDlgAkunJurnal] = useState(false);
    // const [showFrmDlgSubLedger, setShowFrmDlgSubLedger] = useState(false);
    const [showDialogSubLedger, setShowDialogSubLedger] = useState(false);
    const [responCekSubledger, setResponCekSubledger] = useState<any[]>([]);
    const [listAkunJurnal, setListAkunJurnal] = useState([]);

    // data Header dari MUTASI API

    const [noAkunAPi, setNoAkunApi] = React.useState('');
    const [namaAkunAPi, setNamaAkun] = React.useState('');
    const [saldoBalance, setSaldoBalance] = useState('');

    React.useEffect(() => {
        const async = async () => {
            if (dataListMutasibank?.tipeApi === 'API') {
                const respListTabNoRek = await GetListTabNoRek(stateDokumen?.kode_entitas, stateDokumen?.token);
                const respListTabNoRekFix = respListTabNoRek.filter((data: any) => data.no_rekening === dataListMutasibank?.noRekeningApi);

                const respDaftarAkunKredit: any[] = await DaftarAkunDebet(stateDokumen?.kode_entitas, 'all');
                const respDaftarAkunKreditFix = respDaftarAkunKredit.filter((data: any) => data.kode_akun === respListTabNoRekFix[0].kode_akun);
                setNoAkunApi(respDaftarAkunKreditFix[0].no_akun);
                setNamaAkun(respDaftarAkunKreditFix[0].nama_akun);
                setobjekHeader((prevState: any) => ({
                    ...prevState,
                    kurs: '1',
                    no_akun: respDaftarAkunKreditFix[0].no_akun,
                    nama_akun: respDaftarAkunKreditFix[0].nama_akun,
                    jumlah_mu: dataListMutasibank?.jumlahMu,
                    api_catatan: dataListMutasibank?.description,
                    kode_akun_kredit: respDaftarAkunKreditFix[0].kode_akun,
                }));

                const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        param1: 'SQLAkunKas',
                    },
                    headers: {
                        Authorization: `Bearer ${stateDokumen?.token}`,
                    },
                });
                const responSaldobalance = response.data.data.filter((data: any) => data.no_akun === respDaftarAkunKreditFix[0].no_akun);
                setSaldoBalance(responSaldobalance[0].balance);

                // masukan State untuk simpan data
            }
        };
        async();
    }, [onRefreshTipe]);

    const handleSelectedDataJurnal = (dataObject: any) => {
        setobjekHeader({
            ...objekHeader,
            no_akun: dataObject.no_akun,
            nama_akun: dataObject.nama_akun,
            kode_akun_kredit: dataObject.kode_akun,
            kode_mu: dataObject.kode_mu,
            kurs: dataObject.kurs,
            balance: dataObject.balance,
            tipe: dataObject.tipe,
            kode_supp: '',
            subledger: '',
            // chbAkun: true,
        });
    };

    const handleSelectedDataSubLedger = (dataObject: any) => {
        setobjekHeader({
            ...objekHeader,
            kode_supp: dataObject.kode_subledger,
            subledger: dataObject.subledger,
        });
    };

    const handleInputChange = (name: any, value: any) => {
        // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue; //event.target.value;
        const newName = name; //event.target.name;
        if (name === 'jumlah_mu') {
            newValue = value;
        } else {
            newValue = value.toUpperCase();
        }
        setobjekHeader({
            ...objekHeader,
            [newName]: newValue,
        });
    };

    const handleButtonSubledger = async () => {
        vRefreshData.current += 1;
        setModalSource('header sub');
        if (objekHeader?.tipe === 'Piutang') {
            setShowDialogSubLedger(true);
        } else if (objekHeader?.tipe === 'Hutang') {
            setShowDialogSubLedger(true);
        } else if (responCekSubledger.length > 0 && responCekSubledger[0].subledger === 'Y') {
            setShowDialogSubLedger(true);
        } else {
            myAlertGlobal('Data Akun Tidak Mempunyai Subledger', 'FrmPraBkk');
        }
    };

    const fetchSubledgerData = async () => {
        try {
            const cekSubledger = await axios.get(`${apiUrl}/erp/cek_subledger`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: objekHeader?.kode_akun_kredit,
                },
            });
            setResponCekSubledger(cekSubledger.data.data);
        } catch (error) {
            console.error('Error fetching subledger data:', error);
        }
    };

    useEffect(() => {
        fetchSubledgerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDokumen?.kode_entitas, objekHeader]);

    useEffect(() => {
        if (objekHeader?.no_dokumen !== '') {
            let nilaiTanpaKoma: any;

            if ((typeof objekHeader?.jumlah_mu === 'string' && objekHeader.jumlah_mu?.includes(',')) || (typeof objekHeader?.jumlah_mu === 'string' && objekHeader.jumlah_mu?.includes('.'))) {
                nilaiTanpaKoma = parseFloat(tanpaKoma(objekHeader?.jumlah_mu));
            } else {
                nilaiTanpaKoma = objekHeader?.jumlah_mu;
            }

            // recalc();
            if (nilaiTanpaKoma > 0) {
                // const words = terbilangKonversi(nilaiTanpaKoma);
                // setTerbilang(`${words} Rupiah`);
                // generateTerbilang(stateDokumen?.kode_entitas, nilaiTanpaKoma)
                //     .then((result) => {
                //         if (nilaiTanpaKoma.length === 0) {
                //             setTerbilang('');
                //         } else {
                //             setTerbilang(result + ' Rupiah');
                //         }
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
                const nilaiKonversi = moneyToString(0, nilaiTanpaKoma);
                setTerbilang(`${nilaiKonversi}`);
            } else {
                setTerbilang('');
            }
        } else {
            setTerbilang('');
        }
    }, [objekHeader, stateDokumen]);

    let resultAkunJabatan: any;
    let resultAkun: any;

    // const refreshDaftarAkun = async () => {
    //     try {
    //         let paramHeader: any;
    //         let paramDetail: any;
    //         paramHeader = `where x.kode_user="${stateDokumen?.kode_user}"`;
    //         // paramDetail = `where x.kode_user="${stateDokumen?.kode_user}" and x.kode_akun ="${kodeAkun}"`;
    //         const responseAkunJabatan = await axios.get(`${apiUrl}/erp/list_akun_global`, {
    //             params: {
    //                 entitas: stateDokumen?.kode_entitas,
    //                 param1: 'SQLAkunMBkkJabatan',
    //                 param2: paramHeader,
    //             },
    //             headers: { Authorization: `Bearer ${stateDokumen?.token}` },
    //         });
    //         resultAkunJabatan = responseAkunJabatan.data;
    //     } catch (error: any) {
    //         console.error('Error fetching data:', error);
    //     }
    //     try {
    //         const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
    //             params: {
    //                 entitas: stateDokumen?.kode_entitas,
    //                 param1: 'SQLAkunKas',
    //             },
    //             headers: { Authorization: `Bearer ${stateDokumen?.token}` },
    //         });
    //         resultAkun = response.data;
    //     } catch (error: any) {
    //         console.error('Error fetching data:', error);
    //     }
    //     if (resultAkunJabatan.length < 0) {
    //         setListAkunJurnal(resultAkunJabatan.data);
    //         // setShowFrmDlgAkunJurnal(true);
    //     } else {
    //         setListAkunJurnal(resultAkun.data);
    //         // setShowFrmDlgAkunJurnal(true);
    //     }
    // };

    const refreshDaftarAkun = async () => {
        try {
            const [responseAkunJabatan, responseAkun] = await Promise.all([
                axios.get(`${apiUrl}/erp/list_akun_global`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        param1: 'SQLAkunMBkkJabatan',
                        param2: `where x.kode_user="${stateDokumen?.kode_user}"`,
                    },
                    headers: { Authorization: `Bearer ${stateDokumen?.token}` },
                }),
                axios.get(`${apiUrl}/erp/list_akun_global`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        param1: 'SQLAkunKas',
                    },
                    headers: { Authorization: `Bearer ${stateDokumen?.token}` },
                }),
            ]);

            // Use the results directly
            const resultAkunJabatan = responseAkunJabatan.data;
            const resultAkun = responseAkun.data;

            // Set the list based on the results
            setListAkunJurnal(resultAkunJabatan.length > 0 ? resultAkunJabatan.data : resultAkun.data);
            return resultAkunJabatan.length > 0 ? resultAkunJabatan.data : resultAkun.data;
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
    };

    const vRefreshData = useRef(0);
    const handleDialogAkun = async () => {
        // const refreshDaftarAkun = async () => {
        vRefreshData.current += 1;
        if (listAkunJurnal.length < 0) {
            // setListAkunJurnal(resultAkunJabatan.data);
            setShowFrmDlgAkunJurnal(true);
        } else {
            // listAkunJurnal(resultAkun.data);
            setShowFrmDlgAkunJurnal(true);
        }
        // };
    };

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkun = await refreshDaftarAkun();
            // console.log('resultDaftarAkun', resultDaftarAkun);
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDokumen?.masterDataState]);

    return (
        <div className="mb-1">
            <div className="panel-tabel" style={{ width: 'auto' }}>
                <div className="mb-1 grid grid-cols-1 gap-4 md:grid-cols-12">
                    <div className="col-span-5 ">
                        {/* <div className="ml-[40px] flex gap-3 sm:ml-[40px]"> */}
                        {/* TANGGAL */}
                        <div className="flex" style={{ alignItems: 'center', marginTop: '-5' }}>
                            {/* <div className="flex" style={{ alignItems: 'center' }}> */}
                            <label style={{ width: '15%', textAlign: 'right', marginRight: 6 }}>Tgl. Buat </label>
                            <div className="form-input mt-1 flex justify-between" style={{ borderRadius: 1, width: '120px' }}>
                                <DatePickerComponent
                                    locale="id"
                                    cssClass="e-custom-style"
                                    enableMask={true}
                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                    showClearButton={false}
                                    format="dd-MM-yyyy"
                                    value={moment(objekHeader?.tgl_trxdokumen).toDate()}
                                    change={(args: ChangeEventArgsCalendar) => {
                                        if (args.value) {
                                            const selectedDate = moment(args.value);
                                            selectedDate.set({
                                                hour: moment().hour(),
                                                minute: moment().minute(),
                                                second: moment().second(),
                                            });

                                            setobjekHeader({
                                                ...objekHeader,
                                                tgl_trxdokumen: moment(selectedDate).format('YYYY-MM-DD HH:mm:ss'),
                                            });
                                        } else {
                                            setobjekHeader({
                                                ...objekHeader,
                                                tgl_trxdokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                                            });
                                        }
                                    }}
                                    style={{ margin: '-5px' }}
                                    // disabled={true}
                                    // enabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? false : true}
                                    enabled={false}
                                >
                                    <Inject services={[MaskedDateTime]} />
                                </DatePickerComponent>
                            </div>
                            {/* </div> */}

                            {/* <div className="flex" style={{ alignItems: 'center' }}> */}
                            <label style={{ width: '16%', textAlign: 'right', marginRight: 6 }}>Tanggal </label>
                            {dataListMutasibank?.tipeApi === 'API' ? (
                                <input
                                    className={` container form-input`}
                                    style={{
                                        background: '#eeeeee',
                                        fontSize: 11,
                                        marginTop: 4,
                                        marginLeft: 0,
                                        borderColor: '#bfc9d4',
                                        width: '140px',
                                        borderRadius: 2,
                                        height: '35px',
                                    }}
                                    disabled={true}
                                    value={moment(dataListMutasibank?.tglTransaksiMutasi).format('DD-MM-YYYY')}
                                    // value={moment(dataHeaderAPI.tglTransaksiMutasi).toDate()}
                                    readOnly
                                ></input>
                            ) : (
                                <div className="form-input mt-1 flex justify-between" style={{ borderRadius: 2, width: '120px' }}>
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        enableMask={true}
                                        maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        value={moment(objekHeader?.tgl_dokumen).toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            if (args.value) {
                                                const selectedDate = moment(args.value);
                                                selectedDate.set({
                                                    hour: moment().hour(),
                                                    minute: moment().minute(),
                                                    second: moment().second(),
                                                });

                                                setobjekHeader({
                                                    ...objekHeader,
                                                    tgl_dokumen: moment(selectedDate).format('YYYY-MM-DD HH:mm:ss'),
                                                });
                                            } else {
                                                setobjekHeader({
                                                    ...objekHeader,
                                                    tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                });
                                            }
                                        }}
                                        style={{ margin: '-5px' }}
                                        // disabled={true}
                                        enabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? false : true}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                </div>
                            )}
                            {/* </div> */}
                        </div>

                        {/* No. Bukti */}
                        <div className="flex" style={{ alignItems: 'center', marginTop: '-5' }}>
                            <label style={{ width: '15%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>No. Bukti</label>
                            <input
                                className={`container form-input`}
                                style={{ width: '45%', background: '#eeeeee', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                disabled={true}
                                value={objekHeader?.no_dokumen}
                                readOnly
                            ></input>
                        </div>

                        {/* No Akun Kas */}
                        <div className="flex" style={{ alignItems: 'center', marginTop: '-5' }}>
                            <label className="whitespace-nowrap" style={{ width: '15%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>
                                No. Akun Kas
                            </label>
                            <input
                                name="no_akun"
                                className={`container form-input`}
                                // style={{ width: '70px', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                style={{ width: '20%', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                // disabled={true}
                                value={dataListMutasibank?.tipeApi === 'API' ? noAkunAPi : objekHeader?.no_akun}
                                // onChange={handleInputChange}
                                onChange={(args: any) => {
                                    handleDialogAkun();
                                    // handleInputChange(args.target.name, args.target.value)
                                }}
                                disabled={dataListMutasibank?.tipeApi === 'API' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                            ></input>

                            <input
                                name="nama_akun"
                                className={`container form-input`}
                                // style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                style={{ width: '60%', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                // disabled={true}
                                value={dataListMutasibank?.tipeApi === 'API' ? namaAkunAPi : objekHeader?.nama_akun}
                                // onChange={handleInputChange}
                                onChange={(args: any) => {
                                    handleDialogAkun();
                                    // handleInputChange(args.target.name, args.target.value)
                                }}
                                disabled={dataListMutasibank?.tipeApi === 'API' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                            ></input>
                            {dataListMutasibank?.tipeApi === 'API' ? (
                                <div style={{ width: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleDialogAkun();
                                        // setStateDialog('header');
                                        // setShowFrmDlgAkunJurnal(true);
                                    }}
                                    style={{ width: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                                >
                                    <FontAwesomeIcon icon={faSearch} className="ml-2" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                </button>
                            )}
                        </div>

                        {/* Subledger */}
                        <div className="flex" style={{ alignItems: 'center', marginTop: '-5' }}>
                            <label style={{ width: '15%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Subledger</label>
                            <input
                                name="subledger"
                                className={`container form-input`}
                                // style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                style={{ width: '80%', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                // disabled={true}
                                value={objekHeader?.subledger}
                                // onChange={(args: any) => handleInputChange(args.target.name, args.target.value)}
                                onChange={() => {
                                    handleButtonSubledger();
                                }}
                                disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                            ></input>
                            <button
                                style={{ width: '5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                            >
                                <FontAwesomeIcon
                                    icon={faList}
                                    onClick={() => {
                                        handleButtonSubledger();
                                        // handleButtonSubledger;
                                    }}
                                    className="ml-2"
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                            </button>
                        </div>

                        {/* BAYAR KEPADA */}
                        <div className="flex" style={{ alignItems: 'center', marginTop: '-5' }}>
                            <label style={{ width: '15%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Bayar Kepada</label>
                            <input
                                name="kepada"
                                autoCapitalize="characters"
                                className={`container form-input`}
                                // style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                style={{ width: '79%', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                value={objekHeader?.kepada}
                                // onChange={handleInputChange}
                                onChange={(args: any) => handleInputChange(args.target.name, args.target.value)}
                                disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                            ></input>
                        </div>

                        {/* Keterangan */}
                        <div className="flex" style={{ alignItems: 'center', marginTop: '-5' }}>
                            <label style={{ width: '15%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Keterangan</label>
                            <textarea
                                name="catatan"
                                autoCapitalize="characters" // "words" //characters
                                // style={{ marginTop: 1, width: '79%', height: '10%', marginLeft: 0, borderColor: '#bfc9d4', border: '1px solid #bfc9d4' }}
                                style={{ width: '79%', fontSize: 11, marginTop: 1, marginLeft: 0, borderColor: '#bfc9d4', border: '1px solid #bfc9d4', borderRadius: 2, color: 'black' }} // Changed text color to black
                                value={objekHeader?.catatan}
                                // onChange={handleInputChange}
                                onChange={(args: any) => handleInputChange(args.target.name, args.target.value)}
                                disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                            ></textarea>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 5, fontSize: '15px', fontWeight: 'bold' }}>
                            <span style={{ fontSize: '15px', marginTop: '12px', color: 'green', textTransform: 'capitalize' }}>{terbilang}</span>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="panel-tabel" style={{ display: 'none', width: '85%', background: '#eeeeee', marginTop: 2 }}>
                            <tr>
                                <th colSpan={1} style={{ textAlign: 'left', width: '8%', fontWeight: `bold`, color: `black` }}>
                                    Status Warkat
                                </th>
                                {/* <label className="whitespace-nowrap" style={{ width: '15%', textAlign: 'right', marginRight: 6 }}>
                                                    Status Warkat
                                                </label> */}
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'center' }}>
                                    <select
                                        id="idPengemudi"
                                        className={`form-select text-white-dark`}
                                        // style={{ border: 'none', textAlign: 'center', color: !pengemudi ? 'gray' : 'black' }}
                                        value={objekHeader?.kosong}
                                        // onChange={(e) => handleSelectOnChange(e, 'pengemudi')}
                                    >
                                        <option value="" disabled selected>
                                            Status Warkat
                                        </option>
                                        {/* {fillPengemudi.map((option: any, index) => (
                                                            <option key={index} value={option.pengemudi} style={{ color: 'black' }}>
                                                                {option.pengemudi}
                                                            </option>
                                                        ))} */}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                {/* <th colSpan={1} style={{ textAlign: 'left', width: '8%', background: `#adf4f5`, fontWeight: `bold`, color: `black` }}>
                                                    No. Warkat / Tgl. Valuta
                                                </th> */}
                                <th colSpan={1} style={{ textAlign: 'left', width: '8%', fontWeight: `bold`, color: `black`, marginTop: 2 }}>
                                    No. Warkat / Tgl. Valuta
                                </th>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="flex" style={{ alignItems: 'center' }}>
                                        <input
                                            className={`container form-input`}
                                            // style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                            style={{ width: '130%', background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                            disabled={true}
                                            value={objekHeader?.no_warkat}
                                            readOnly
                                        ></input>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FontAwesomeIcon
                                                icon={faSearch}
                                                onClick={() => {
                                                    // setModalSource('header');
                                                    // setModalDaftarAkun(true);
                                                }}
                                                className="ml-2"
                                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'center' }}>
                                    <div
                                        className="form-input mt-1 flex justify-between"
                                        // style={{ borderRadius: 2, width: '200px' }}
                                        style={{ fontSize: 11, marginTop: 4, marginLeft: 2, borderColor: '#bfc9d4', borderRadius: 2 }}
                                    >
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(objekHeader?.tgl_valuta).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                if (args.value) {
                                                    const selectedDate = moment(args.value);
                                                    selectedDate.set({
                                                        hour: moment().hour(),
                                                        minute: moment().minute(),
                                                        second: moment().second(),
                                                    });

                                                    setobjekHeader({
                                                        ...objekHeader,
                                                        tgl_valuta: selectedDate,
                                                    });
                                                } else {
                                                    setobjekHeader({
                                                        ...objekHeader,
                                                        tgl_valuta: moment(),
                                                    });
                                                }
                                            }}
                                            style={{ margin: '-5px' }}
                                            disabled={true}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div>
                                </td>
                            </tr>
                        </div>
                        {/* Saldo kas */}
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="inline-flex gap-2">
                                <p className="w-1/5 text-right ">Saldo Kas</p>
                                <div>
                                    <span style={{ textAlign: 'right', alignItems: 'center', fontSize: 11, fontWeight: 'bold', marginLeft: 4 }}>
                                        {dataListMutasibank?.tipeApi === 'API' ? frmNumber(saldoBalance) : frmNumber(objekHeader?.balance)}
                                    </span>
                                </div>
                            </div>
                            {/* KURS */}
                            <div className="inline-flex items-center gap-2">
                                <p className="w-1/5 text-right ">Kurs</p>
                                <div>
                                    <input
                                        className={`container form-input`}
                                        type="text"
                                        name=""
                                        id=""
                                        value={objekHeader?.kurs}
                                        style={{ textAlign: 'right', background: '#eeeeee', fontSize: 11, marginTop: 0, marginLeft: 0, borderColor: '#bfc9d4', width: '50%', borderRadius: 2 }}
                                    />
                                    <span className="ml-2" style={{ fontSize: 11, fontWeight: 'bold' }}>
                                        IDR
                                    </span>
                                </div>
                            </div>
                            {/* JUMLAH MU */}
                            <div className="inline-flex items-center gap-2">
                                <p className="w-1/5 text-right ">Jumlah (Mu)</p>
                                <input
                                    id="jumlah_mu"
                                    name="jumlah_mu"
                                    type="text"
                                    className="container form-input"
                                    style={{ textAlign: 'right', fontSize: 11, marginTop: 0, marginLeft: 0, borderColor: '#bfc9d4', width: '50%', borderRadius: 2 }}
                                    value={isAmountFocused ? objekHeader?.jumlah_mu : frmNumber(objekHeader?.jumlah_mu)}
                                    // value={objekHeader?.jumlah_mu}
                                    onChange={(e) => {
                                        // Only allow numbers and decimal point
                                        let value = e.target.value.replace(/[^\d.]/g, '');

                                        // Ensure only one decimal point
                                        const parts = value.split('.');
                                        if (parts.length > 2) {
                                            value = parts[0] + '.' + parts.slice(1).join('');
                                        }

                                        handleInputChange('jumlah_mu', value);
                                    }}
                                    // onChange={(e) => {
                                    //     // console.log('e.target.value ', e.target.value);
                                    //     // console.log('objekHeader ', objekHeader);
                                    //     console.log({
                                    //         value_mu: objekHeader.jumlah_mu,
                                    //         value_target: e.target.value,
                                    //         type_mu: typeof objekHeader.jumlah_mu,
                                    //     });

                                    //     setobjekHeader({
                                    //         ...objekHeader,
                                    //         jumlah_mu: e.target.value,
                                    //     });
                                    // }}
                                    onFocus={() => {
                                        setIsAmountFocused(true);
                                    }}
                                    onBlur={(e) => {
                                        // console.log('e.target.value ', e.target.value);
                                        // console.log('objekHeader ', objekHeader);
                                        setIsAmountFocused(false);
                                        if (!e.target.value) {
                                            handleInputChange('jumlah_mu', '0');
                                            return;
                                        }

                                        const numValue = parseFloat(e.target.value);
                                        if (!isNaN(numValue)) {
                                            handleInputChange('jumlah_mu', numValue.toString());
                                        }
                                    }}
                                    disabled={fromBok || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3">
                        <tr>
                            <th colSpan={1} style={{ textAlign: 'left', width: '100%', fontWeight: `bold`, color: `black` }}>
                                Keterangan API Bank
                            </th>
                            {/* <label className="whitespace-nowrap" style={{ width: '15%', textAlign: 'right', marginRight: 6 }}>
                                                    Status Warkat
                                                </label> */}
                        </tr>
                        <div className="container form-input" style={{ height: '100px', width: '350px', background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 2 }}>
                            <TextBoxComponent
                                id="edApiCatatan"
                                className={`${stylesTtb.inputTableBasic}`}
                                ref={(t) => {
                                    // textareaObj = t;
                                }}
                                multiline={true}
                                // created={'onCreateMultiline'}
                                value={dataListMutasibank?.tipeApi === 'API' ? dataListMutasibank?.description : objekHeader?.api_catatan}
                                input={(args: FocusInEventArgs) => {
                                    const value: any = args.value;
                                    // HandelCatatan(value, setCatatanValue);
                                    // HandelCatatan(value, setquMMKketerangan);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showFrmDlgAkunJurnal && (
                <FrmDlgAkunJurnal
                    kode_entitas={stateDokumen?.kode_entitas}
                    isOpen={showFrmDlgAkunJurnal}
                    onClose={() => {
                        setShowFrmDlgAkunJurnal(false);
                    }}
                    onBatal={() => {
                        setShowFrmDlgAkunJurnal(false);
                    }}
                    selectedData={(dataObject: any) => handleSelectedDataJurnal(dataObject)}
                    target={'FrmPraBkk'}
                    stateDokumen={stateDokumen}
                    kodeAkun={objekHeader?.kode_akun_kredit}
                    // stateDialogAja={stateDialog}
                    listAkunJurnalObjek={listAkunJurnal}
                    vRefreshDataAkun={vRefreshData.current}
                    openFrom={'header'}
                />
            )}
            {showDialogSubLedger && (
                <FrmDlgSubLedger
                    kode_entitas={stateDokumen?.kode_entitas}
                    isOpen={showDialogSubLedger}
                    onClose={() => {
                        setShowDialogSubLedger(false);
                        // handleOnCloseDlgAkun();
                    }}
                    onBatal={() => {
                        // handleOnBatalDlgAkun();
                        setShowDialogSubLedger(false);
                    }}
                    selectedData={(dataObject: any) => handleSelectedDataSubLedger(dataObject)}
                    target={'FrmPraBkk'}
                    stateDokumen={stateDokumen}
                    kodeAkun={objekHeader?.kode_akun_kredit}
                    jenis={modalSource}
                    vRefreshData={vRefreshData.current}
                />
            )}
        </div>
    );
};

export default HeaderPraBkk;
