import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { L10n } from '@syncfusion/ej2-base';
import idIDLocalization from '@/public/syncfusion/locale.json';

import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
L10n.load(idIDLocalization);
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSearchMinus, faSearchPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import FrmCustomerDlg from './frmCustomerDlg';
import { myAlertGlobal } from '@/utils/routines';
import FrmDlgAkunJurnal from './frmDlgAkunJurnal';
import FrmSupplierDlg from './frmSupplierDlg';
import FrmDlgSubLedger from './frmSubledgerDlg';
import FrmDlgKaryawan from './frmKaryawanDlg';
import FrmDlgDepartement from './frmDepartemenDlg';
import { handleFileSelect, handleRemove } from './fungsi';
import { exitCode } from 'process';

interface DetailPraBkkProps {
    stateDokumen: any;
    isOpen: boolean;
    onClose: () => void;
    onRefresh: any;
    objekDetail: any;
    setobjekDetail: any;
    // stateDialog: any;
    // setStateDialog: any;
    objekImage: any;
    stateObjekImage: any;
    dataUploadRef: (e: any) => void;
    setTipeRequest: any;
    listAkunJurnalObjek: any;
    objekHeader: any;
    setObjekHeader: any;
    headerKeuanganJumlahRp: any;
    isFilePendukungBk: any;
}
let gridDetailBkk: Grid | any;
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

const DetailPraBkk = ({
    stateDokumen,
    isOpen,
    onClose,
    onRefresh,
    objekDetail,
    setobjekDetail,
    // stateDialog,
    // setStateDialog,
    objekImage,
    stateObjekImage,
    dataUploadRef,
    setTipeRequest,
    listAkunJurnalObjek,
    objekHeader,
    setObjekHeader,
    headerKeuanganJumlahRp,
    isFilePendukungBk,
}: DetailPraBkkProps) => {
    let terpilih: boolean = false;
    let selisihGlobal = 0;

    // console.log('isFilePendukungBk', isFilePendukungBk);
    const [selectedTab, setSelectedTab] = useState(0); // Initialize state for selected tab

    const [showDialogAkun, setShowDialogAkun] = useState(false);
    const [showDialogCustomer, setShowDialogCustomer] = useState(false);
    const [showDialogSupplier, setShowDialogSupplier] = useState(false);
    const [showDialogSubLedger, setShowDialogSubLedger] = useState(false);
    const [showDialogKaryawan, setShowDialogKaryawan] = useState(false);
    const [showDialogDepartemen, setShowDialogDepartemen] = useState(false);
    const [listKodeJual, setListKodeJual] = useState([]);
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [responCekSubledger, setResponCekSubledger] = useState<any[]>([]);
    const [modalSource, setModalSource] = useState('');
    const [modalSourceDetail, setModalSourceDetail] = useState('xxxx');
    const [listAkunJurnal, setListAkunJurnal] = useState([]);
    const [tipeRequestDetail, setTipeRequestDetail] = useState([]);

    let uploaderRef: any = useRef<UploaderComponent>(null);
    let uploaderRef2: any = useRef<UploaderComponent>(null);
    let uploaderRef3: any = useRef<UploaderComponent>(null);
    let uploaderRef4: any = useRef<UploaderComponent>(null);
    const [modalPreview, setModalPreview] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const vRefreshData = useRef(0);
    useEffect(() => {
        // Move the ref data passing to useEffect to ensure refs are ready
        if (dataUploadRef && uploaderRef && uploaderRef2 && uploaderRef3 && uploaderRef4) {
            dataUploadRef({
                uploaderRef,
                uploaderRef2,
                uploaderRef3,
                uploaderRef4,
            });
        }
    }, [dataUploadRef, uploaderRef, uploaderRef2, uploaderRef3, uploaderRef4]);

    const fetchKodeJualData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/kode_jual?entitas=${stateDokumen?.kode_entitas}`);
            if (response.data.status) {
                const modifiedData = response.data.data.map((item: any) => ({
                    ...item,
                    jual_ku: item.kode_jual + ' - ' + item.nama_jual,
                    jual_ku2: item.kode_jual + '*' + item.kode_jual + ' - ' + item.nama_jual,
                }));
                setListKodeJual(modifiedData);
            } else {
                console.error('Failed to fetch data:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function toPascalCase(str: any) {
        return str
            .toLowerCase() // Pastikan string dimulai dalam lowercase
            .split(' ') // Pisahkan string berdasarkan spasi atau delimiter lain
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama menjadi besar dan sisanya tetap kecil
            .join(''); // Gabungkan kembali tanpa spasi
    }

    const fetchSubledgerData = async (kodeAkun: any) => {
        try {
            const cekSubledger = await axios.get(`${apiUrl}/erp/cek_subledger`, {
                params: {
                    entitas: stateDokumen?.kode_entitas,
                    param1: kodeAkun,
                },
            });

            const modifiedData = cekSubledger.data.data.map((item: any) => {
                return { ...item, tipe: toPascalCase(item.tipe) };
            });
            setResponCekSubledger(modifiedData);
            return modifiedData;
        } catch (error) {
            console.error('Error fetching subledger data:', error);
        }
    };

    const handleButtonSubledger = async (pKodeAkun: any, pKodeSubledger: any) => {
        const cekSub = await fetchSubledgerData(pKodeAkun);
        // console.log('cekSub', cekSub);
        if (cekSub?.length > 0) {
            const { tipe, subledger } = cekSub[0]; // Destructure for better readability

            if ((tipe === 'Hutang' || tipe === 'Piutang' || subledger === 'Y') && pKodeSubledger === '') {
                // setShowDialogSubLedger(true);
                cdNoSubCustomDlg(pKodeAkun);
            }
            // console.log('gridDetailBkk.dataSource[selectedRowIndex].kode_dept', gridDetailBkk.dataSource[selectedRowIndex]);

            if ((tipe === 'Beban' || tipe === 'Beban Lain-Lain') && gridDetailBkk.dataSource[selectedRowIndex].kode_dept === '') {
                setShowDialogDepartemen(true);
            }
        }
    };

    const handleOnCloseSubledger = async (pKodeAkun: any, pKodeSubledger: any) => {
        const cekSub = await fetchSubledgerData(pKodeAkun);
        if (cekSub?.length > 0) {
            if (cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') {
                setShowDialogDepartemen(true);
                setShowDialogSubLedger(false);
            } else {
                setShowDialogSubLedger(false);
            }
        }
    };

    const handleOnCloseDepartement = async (pKodeAkun: any, pKodeSubledger: any) => {
        const cekSub = await fetchSubledgerData(pKodeAkun);
        if (cekSub?.length > 0) {
            if (cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') {
                setShowDialogKaryawan(true);
                setShowDialogDepartemen(false);
            } else {
                setShowDialogDepartemen(false);
            }
        }
    };

    const cdNoSubCustomDlg = async (pKodeAkun: any) => {
        // console.log('pKodeAkun', pKodeAkun);
        const cekSub = await fetchSubledgerData(pKodeAkun);
        // console.log(vTipeAkun);
        // console.log(pKodeAkun);
        // console.log('cekSub[0]?.tipe', cekSub[0]?.tipe);

        if (cekSub?.length > 0) {
            if (cekSub[0]?.tipe === 'Hutang') {
                setShowDialogSupplier(true);
            } else if (cekSub[0]?.tipe === 'Piutang') {
                setShowDialogCustomer(true);
            } else if (cekSub[0]?.subledger === 'Y') {
                setShowDialogSubLedger(true);
            }
            // else if ((cekSub[0]?.subledger === 'Beban' || cekSub[0]?.subledger === 'Beban Lain-Lain') && gridDetailBkk.dataSource[selectedRowIndex].kode_dept === '') {
            //     setShowDialogSubLedger(true);
            // }
        }
    };

    const templateSubledger = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Akun Pembantu (Subledger)" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.subledger} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    // console.log('argsklik', args);
                                    vRefreshData.current += 1;
                                    setModalSource('detail');

                                    cdNoSubCustomDlg(args.kode_akun);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateNoAkun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih No. Akun" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.no_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onBlur={(e: any) => {
                                    // const editedData = args.data;
                                    // gridDetailBkk.dataSource[selectedRowIndex] = editedData;
                                    // gridDetailBkk.refresh();
                                    // break;
                                    if (objekHeader.no_akun === '' || objekHeader.jumlah_mu === 0 || objekHeader.catatan === '') {
                                        gridDetailBkk.endEdit();
                                    }
                                }}
                                onClick={() => {
                                    if (objekHeader.no_akun === '') {
                                        myAlertGlobal('No. Akun Kas belum diisi.', 'FrmPraBkk');
                                    } else if (objekHeader.jumlah_mu === 0) {
                                        myAlertGlobal('Jumlah (Mu) belum diisi.', 'FrmPraBkk');
                                    } else if (objekHeader.catatan === '') {
                                        myAlertGlobal('Bayar Kepada belum diisi.', 'FrmPraBkk');
                                        // throw exitCode;
                                    } else if (objekHeader.kepada === '') {
                                        myAlertGlobal('Keterangan belum diisi.', 'FrmPraBkk');

                                        // throw exitCode;
                                    } else {
                                        handleDialogAkun();
                                    }
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateNamaAkun = (args: any) => {
        // console.log('templateNamaAkun objekHeader', objekHeader);

        return (
            <div>
                <TooltipComponent content="Pilih Nama Akun" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onBlur={(e: any) => {
                                    // const editedData = args.data;
                                    // gridDetailBkk.dataSource[selectedRowIndex] = editedData;
                                    if (objekHeader.no_akun === '' || objekHeader.jumlah_mu === 0 || objekHeader.catatan === '') {
                                        gridDetailBkk.endEdit();
                                    }
                                    // gridDetailBkk.refresh();
                                    // break;
                                    // gridDetailBkk.endEdit();
                                }}
                                onClick={() => {
                                    if (objekHeader.no_akun === '') {
                                        myAlertGlobal('No. Akun Kas belum diisi.', 'FrmPraBkk');
                                    } else if (objekHeader.jumlah_mu === 0) {
                                        myAlertGlobal('Jumlah (Mu) belum diisi.', 'FrmPraBkk');
                                    } else if (objekHeader.catatan === '') {
                                        myAlertGlobal('Bayar Kepada belum diisi.', 'FrmPraBkk');
                                        // throw exitCode;
                                    } else if (objekHeader.kepada === '') {
                                        myAlertGlobal('Keterangan belum diisi.', 'FrmPraBkk');

                                        // throw exitCode;
                                    } else {
                                        handleDialogAkun();
                                    }
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateKaryawan = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_kry} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    vRefreshData.current += 1;
                                    setShowDialogKaryawan(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateDepartemen = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_dept} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    vRefreshData.current += 1;
                                    setShowDialogDepartemen(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateDivisiPenjualan = (args: any) => {
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DropDownListComponent
                    id="jual"
                    name="jual"
                    dataSource={listKodeJual}
                    fields={{ value: 'jual_ku2', text: 'jual_ku' }}
                    floatLabelType="Never"
                    placeholder={args.kode_jual}
                    onChange={(e: any) => {
                        vRefreshData.current += 1;
                        gridDetailBkk.dataSource[args.index] = {
                            ...gridDetailBkk.dataSource[args.index],
                            kode_jual: e.value.split('*')[0],
                            nama_jual: e.value.split('*')[1],
                        };
                        gridDetailBkk.refresh();
                    }}
                />
            </div>
        );
    };

    const actionBeginGridDetail = (args: any) => {
        setTipeRequest(args.requestType);
    };

    const actionCompleteGridDetail = async (args: any) => {
        // console.log(args.requestType);
        switch (args.requestType) {
            case 'save':
                // console.log('tambah', tambah);
                if (tambah === false) {
                    const editedData = args.data;
                    gridDetailBkk.dataSource[selectedRowIndex] = editedData;
                    Recalc();
                    gridDetailBkk.refresh();
                } else if (edit) {
                    Recalc();
                    gridDetailBkk.refresh();
                }
                break;
            case 'beginEdit':
                setTambah(false);
                setEdit(true);
                // Recalc();

                break;
            case 'delete':
                const editedData = args.data;
                gridDetailBkk.dataSource.forEach((item: any, index: any) => {
                    item.id = index + 1;
                });
                gridDetailBkk.refresh();

                break;
            case 'refresh':
                // Recalc();
                setTambah(false);
                setEdit(false);
                break;
            default:
                break;
        }
    };

    const rowSelectingGridDetail = (args: any) => {
        // console.log('args', args.data.kode_akun);
        setSelectedRowIndex(args.rowIndex);
        setVkodeAkun(args.data.kode_akun);
    };

    const handleGridDetail_EndEdit = async () => {
        gridDetailBkk.endEdit();
    };

    function stringToNumber(value: string): number {
        // Hapus semua koma dari string
        const cleanedValue = value.replace(/,/g, '');

        // Ubah string menjadi angka desimal
        const number = parseFloat(cleanedValue);

        return isNaN(number) ? 0 : number; // Pastikan nilai kembali 0 jika tidak valid
    }

    const Recalc = async () => {
        // selisihGlobal = 0;

        // console.log('objekHeader recalc cccccc', objekHeader);
        // const vJumlahMu =
        //     parseFloat(objekHeader?.jumlah_mu?.replace(/,/g, '')) !== null && !isNaN(parseFloat(objekHeader?.jumlah_mu?.replace(/,/g, '')))
        // /         ? Number(parseFloat(objekHeader?.jumlah_mu?.replace(/,/g, '')))
        //         : 0;
        const vJumlahMu = objekHeader?.jumlah_mu;
        // const vJumlahMu = objekHeader?.jumlah_mu;

        const vKurs =
            parseFloat(objekHeader?.kurs?.replace(/,/g, '')) !== null && !isNaN(parseFloat(objekHeader?.kurs?.replace(/,/g, ''))) ? Number(parseFloat(objekHeader?.kurs?.replace(/,/g, ''))) : 0;

        const keuanganJumlahRp = vJumlahMu * vKurs;
        // console.log({
        //     a: typeof vKurs,
        //     b: vKurs,
        // });

        const keuanganDebetRp = gridDetailBkk.dataSource.reduce((total: any, item: any) => {
            const quKeuangandebet_rp = 0;
            const debetRp = item.jumlah_mu < 0 ? 0 : item.jumlah_mu * item.kurs;
            return total + quKeuangandebet_rp + debetRp;
        }, 0);

        let keuanganKreditRp = gridDetailBkk.dataSource.reduce((total: any, item: any) => {
            // console.log('item grid', item);
            const quKeuangankredit_rp = 0;
            const kreditRp = item.jumlah_mu < 0 ? (item.jumlah_mu / vKurs) * -1 : 0;
            // console.log('kreditRp', kreditRp);
            return total + quKeuangankredit_rp + kreditRp;
        }, 0);

        const keuanganKreditRp2 = parseFloat(vJumlahMu) + keuanganKreditRp;
        // console.log({
        //     a: typeof keuanganKreditRp,
        //     b: typeof vJumlahMu,
        // });
        // console.log('keuanganKreditRp ', keuanganKreditRp);
        // console.log('keuanganKreditRp2 ', keuanganKreditRp2);

        const keuanganSelisihRp = keuanganDebetRp - keuanganKreditRp2; //((keuanganKreditRp = 0 ? vJumlahMu : keuanganKreditRp));

        await headerKeuanganJumlahRp(keuanganJumlahRp);
        selisihGlobal = keuanganDebetRp - keuanganKreditRp2;
        await setObjekHeader((prevData: any) => ({
            ...prevData,
            debet_rp: keuanganDebetRp,
            kredit_rp: keuanganKreditRp2, //((keuanganKreditRp = 0 ? vJumlahMu : keuanganKreditRp)),
            selisih: keuanganSelisihRp,
            jumlah_mu: vJumlahMu,
            jumlah_rp: vJumlahMu, //keuanganJumlahRp,
        }));
        // console.log('Recalc objekHeader', objekHeader);
    };

    const handleDetailBaru = async (jenis: any) => {
        // setStateDialog('detail');
        await handleGridDetail_EndEdit();
        // console.log('objekHeader tambah,', objekHeader);

        let totalLine = gridDetailBkk.dataSource.length + 1;
        // console.log(totalLine);
        const hasEmptyFields = gridDetailBkk.dataSource.some((row: { no_akun: string }) => row.no_akun === '');
        const isDebetEmpty = gridDetailBkk.dataSource.some((row: { jumlah_mu: any }) => row.jumlah_mu === 0);
        // console.log('objekHeader', objekHeader);
        // console.log('objekDetail', objekDetail);
        // if ((totalLine === 1 && jenis === 'new') || (isNoAkunEmpty && jenis === 'new' && isDebetEmmpty)) {
        if (objekHeader.catatan === '') {
            myAlertGlobal('Keterangan belum diisi.', 'FrmPraBkk');
            throw exitCode;
        }
        if (objekHeader.kepada === '') {
            myAlertGlobal('Bayar Kepada belum diisi.', 'FrmPraBkk');
            throw exitCode;
        }
        const cekSub = await fetchSubledgerData(gridDetailBkk.dataSource[selectedRowIndex]?.kode_akun);
        // console.log('cekSub', cekSub);
        if (cekSub?.length > 0) {
            if (
                (cekSub[0]?.tipe === 'Pendapatan' || cekSub[0]?.tipe === 'Pendapatan Lain-Lain' || cekSub[0]?.tipe === 'Beban' || cekSub[0]?.tipe === 'Beban Lain-Lain') &&
                gridDetailBkk.dataSource[selectedRowIndex]?.kode_jual === ''
            ) {
                myAlertGlobal('Divisi penjualan belum diisi.', 'FrmPraBkk');
                return;
            }
        }

        await Recalc().then(() => {
            if (!hasEmptyFields && !isDebetEmpty) {
                const modifiedDetail = {
                    kode_dokumen: '',
                    id_dokumen: totalLine + 1,
                    dokumen: 'BK',
                    tgl_dokumen: moment().format('YYYY-MM-DD HH:mm:ss'),
                    kode_akun: '',
                    kode_subledger: '',
                    kurs: '',
                    debet_rp: 0,
                    kredit_rp: 0,
                    jumlah_rp: 0,
                    // jumlah_mu: objekHeader.selisih > 0 ? objekHeader.selisih * -1 : objekHeader.selisih * -1,
                    jumlah_mu: selisihGlobal * -1,
                    catatan: objekHeader.catatan, //'',
                    no_warkat: '',
                    tgl_valuta: moment().format('YYYY-MM-DD HH:mm:ss'),
                    persen: 0,
                    kode_dept: '',
                    kode_kerja: '',
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: '',
                    userid: stateDokumen?.userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: '',
                    kode_kry: '',
                    kode_jual: '',
                    no_kontrak_um: '',
                    no_akun: '',
                    nama_akun: '',
                    tipe: '',
                    kode_mu: '',
                    no_kerja: '',
                    nama_dept: '',
                    nama_kry: '',
                    no_subledger: '',
                    nama_subledger: '',
                    subledger: '',
                    isledger: '',
                    limit_bkk: '',
                };

                gridDetailBkk.addRecord(modifiedDetail, totalLine);
                setTimeout(() => {
                    // gridDetailBkk.startEdit(totalLine);
                }, 200);
                setTambah(true);
                setobjekDetail(gridDetailBkk.dataSource);
            } else {
                document.getElementById('gridDetailBkk')?.focus();
                if (isDebetEmpty && !hasEmptyFields) {
                    myAlertGlobal('Debet (MU) tidak boleh kosong', 'FrmPraBkk');
                } else {
                    myAlertGlobal('Silahkan melengkapi data sebelum menambah data baru', 'FrmPraBkk');
                }
            }
        });
        // console.log('objekHeader.selisih', objekHeader.selisih);
        // console.log('selisihGlobal', selisihGlobal);
    };

    const handleSelectedDialogCustomer = (dataObject: any) => {
        gridDetailBkk.dataSource[selectedRowIndex] = {
            ...gridDetailBkk.dataSource[selectedRowIndex],
            kode_subledger: dataObject.kode_cust,
            no_subledger: dataObject.no_cust,
            nama_subledger: dataObject.nama_relasi,
            subledger: dataObject.subledger,
        };
        gridDetailBkk.refresh();
    };

    const handleSelectedDialogSupplier = (dataObject: any) => {
        gridDetailBkk.dataSource[selectedRowIndex] = {
            ...gridDetailBkk.dataSource[selectedRowIndex],
            kode_subledger: dataObject.kode_supp,
            no_subledger: dataObject.no_supp,
            nama_subledger: dataObject.nama_relasi,
            subledger: dataObject.subledger,
        };

        gridDetailBkk.refresh();
    };

    const handleSelectedDialogDepartement = (dataObject: any) => {
        gridDetailBkk.dataSource[selectedRowIndex] = {
            ...gridDetailBkk.dataSource[selectedRowIndex],
            kode_dept: dataObject.kode_dept,
            nama_dept: dataObject.nama_dept,
        };
        gridDetailBkk.refresh();
    };

    const handleSelectedDialogKaryawan = (dataObject: any) => {
        gridDetailBkk.dataSource[selectedRowIndex] = {
            ...gridDetailBkk.dataSource[selectedRowIndex],
            kode_kry: dataObject.kode_kry,
            nama_kry: dataObject.nama_kry,
        };
        gridDetailBkk.refresh();
    };

    const handleSelectedDataSubLedger = (dataObject: any) => {
        gridDetailBkk.dataSource[selectedRowIndex] = {
            ...gridDetailBkk.dataSource[selectedRowIndex],
            kode_subledger: dataObject.kode_subledger,
            no_subledger: dataObject.no_subledger,
            nama_subledger: dataObject.nama_subledger,
            subledger: dataObject.subledger,
        };
        gridDetailBkk.refresh();
        terpilih = true;
    };

    const [vkodeAkun, setVkodeAkun] = useState('');
    const [vTipeAkun, setVTipeAkun] = useState('');

    const handleSelectedDialogAkun = async (dataObject: any) => {
        // console.log('pilih akun jurnal');

        if (dataObject.header === 'Y') {
            myAlertGlobal(`No akun ${dataObject.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi`, 'FrmPraBkk');
            return; // Exit early if the account is a parent account
        }

        let totalLine = gridDetailBkk.dataSource.length;
        let id_dokumenJurnal: any;

        // Determine the document ID based on the state
        if (stateDokumen?.masterDataState === 'BARU') {
            id_dokumenJurnal = totalLine === 1 ? 2 : totalLine + 1;
        } else if (stateDokumen?.masterDataState === 'EDIT') {
            id_dokumenJurnal = gridDetailBkk.dataSource[selectedRowIndex]?.id_dokumen || totalLine + 1;
        }
        // console.log('selisihGlobal,selisihGlobal', selisihGlobal);
        // Update the selected row with new account data
        // console.log('gridDetailBkk.dataSource[selectedRowIndex]', gridDetailBkk.dataSource[selectedRowIndex]);
        const updatedData = {
            ...gridDetailBkk.dataSource[selectedRowIndex],
            kode_akun: dataObject.kode_akun,
            no_akun: dataObject.no_akun,
            nama_akun: dataObject.nama_akun,
            kurs: dataObject.kurs,
            tipe: dataObject.tipe,
            kode_mu: dataObject.kode_mu,
            isledger: dataObject.isledger,
            catatan: objekHeader.catatan,
            // jumlah_mu: selisihGlobal === 0 ? objekHeader.jumlah_mu : selisihGlobal * -1,
            // jumlah_mu: id_dokumenJurnal === 2 ? objekHeader.jumlah_mu : objekHeader.selisih * -1,
            jumlah_mu:
                stateDokumen?.masterDataState === 'EDIT'
                    ? gridDetailBkk.dataSource[selectedRowIndex].jumlah_mu // Retain previous value
                    : id_dokumenJurnal === 2
                    ? Number(objekHeader.jumlah_mu)
                    : objekHeader.selisih * -1,
            kode_subledger: '',
            no_subledger: '',
            nama_subledger: '',
            subledger: '',
            kode_dept: '',
            nama_dept: '',
            kode_kry: '',
            nama_kry: '',
            kode_jual: '',
        };

        gridDetailBkk.dataSource[selectedRowIndex] = updatedData;
        setVkodeAkun(updatedData.kode_akun);
        setVTipeAkun(updatedData.tipe);
        gridDetailBkk.refresh();

        // console.log('gridDetailBkk ', gridDetailBkk.dataSource);

        await handleButtonSubledger(updatedData.kode_akun, updatedData.kode_subledger);
        await Recalc();
    };

    const DetailBarangDelete = () => {
        if (gridDetailBkk.dataSource.length > 0) {
            withReactContent(Swal)
                .fire({
                    html: `Hapus data baris ${selectedRowIndex + 1}?`,
                    width: '15%',
                    target: '#FrmPraBkk',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        let counterID = 2;
                        gridDetailBkk.dataSource.splice(selectedRowIndex, 1);
                        gridDetailBkk.dataSource.forEach((item: any, index: any) => {
                            // item.id_dokumen = index + 2;
                            item.id_dokumen = counterID++;
                        });
                        gridDetailBkk.refresh();
                        Recalc();
                    } else {
                        console.log('cancel');
                    }
                });
        }
    };

    const DetailBarangDeleteAll = () => {
        if (gridDetailBkk.dataSource.length > 0) {
            withReactContent(Swal)
                .fire({
                    html: 'Hapus semua data?',
                    width: '15%',
                    target: '#FrmPraBkk',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        gridDetailBkk.dataSource.splice(0, gridDetailBkk.dataSource.length);
                        gridDetailBkk.refresh();
                    } else {
                        console.log('cancel');
                    }
                });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                gridDetailBkk.dataSource = objekDetail;
            } catch (error) {
                console.error('Terjadi kesalahan saat memuat data:', error);
            }
        };
        fetchData();
        fetchKodeJualData();
        setobjekDetail(gridDetailBkk.dataSource);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateDokumen?.masterKodeDokumen, objekDetail]);

    useEffect(() => {
        stateObjekImage({ preview: null, preview2: null, preview3: null, preview4: null, nameImage: null, nameImage2: null, nameImage3: null, nameImage4: null, selectedHead: '1' });
        gridDetailBkk.refresh();
    }, [onClose]);

    // useEffect(() => {
    //     const async = async () => {
    //         const resultDaftarAkun = await refreshDaftarAkun();
    //         // console.log('resultDaftarAkun', resultDaftarAkun);
    //         // setListAkunJurnal(listAkunJurnalObjek);
    //     };
    //     async();

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [objekHeader]);

    useEffect(() => {
        Recalc();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objekHeader?.jumlah_mu, objekHeader?.selisih]);

    let resultAkunJabatan: any;
    let resultAkun: any;
    const refreshDaftarAkun = async () => {
        try {
            const paramDetail = `where x.kode_user="${stateDokumen?.kode_user}" and x.kode_akun ="${objekHeader?.kode_akun_kredit}"`;

            const [responseAkunJabatan, responseAkunTransaksi] = await Promise.all([
                axios.get(`${apiUrl}/erp/list_akun_global`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        param1: 'SQLAkunMBkkJabatan',
                        param2: paramDetail,
                    },
                    headers: { Authorization: `Bearer ${stateDokumen?.token}` },
                }),
                axios.get(`${apiUrl}/erp/list_akun_global`, {
                    params: {
                        entitas: stateDokumen?.kode_entitas,
                        param1: 'SQLAkunTransaksiBkk',
                    },
                    headers: { Authorization: `Bearer ${stateDokumen?.token}` },
                }),
            ]);

            // Use the results directly
            const resultAkunJabatan = responseAkunJabatan.data;
            const resultAkunTransaksi = responseAkunTransaksi.data;

            // Set the list based on the results
            setListAkunJurnal(resultAkunJabatan.length > 0 ? resultAkunJabatan.data : resultAkunTransaksi.data);
            return resultAkunJabatan.length > 0 ? resultAkunJabatan.data : resultAkunTransaksi.data;
        } catch (error: any) {
            console.error('Error fetching data:', error);
        }
        // try {
        //     const paramDetail = `where x.kode_user="${stateDokumen?.kode_user}" and x.kode_akun ="${objekHeader?.kode_akun_kredit}"`;
        //     // Fetch Akun Jabatan
        //     const responseAkunJabatan = await axios.get(`${apiUrl}/erp/list_akun_global`, {
        //         params: {
        //             entitas: stateDokumen?.kode_entitas,
        //             param1: 'SQLAkunMBkkJabatan',
        //             param2: paramDetail,
        //         },
        //         headers: { Authorization: `Bearer ${stateDokumen?.token}` },
        //     });
        //     // Fetch Akun Transaksi
        //     const responseAkunTransaksi = await axios.get(`${apiUrl}/erp/list_akun_global`, {
        //         params: {
        //             entitas: stateDokumen?.kode_entitas,
        //             param1: 'SQLAkunTransaksiBkk',
        //         },
        //         headers: { Authorization: `Bearer ${stateDokumen?.token}` },
        //     });
        //     const resultAkunJabatan = responseAkunJabatan.data;
        //     const resultAkunTransaksi = responseAkunTransaksi.data;
        //     if (resultAkunJabatan?.length < 0) {
        //         setListAkunJurnal(resultAkunJabatan?.data);
        //         return resultAkunJabatan.data;
        //         // setShowDialogAkun(true);
        //     } else {
        //         setListAkunJurnal(resultAkunTransaksi?.data);
        //         return resultAkunTransaksi.data;
        //     }
        //     // if (resultAkunJabatan?.length > 0) {
        //     //     // Changed < 0 to > 0
        //     //     setListAkunJurnal(resultAkunJabatan);
        //     //     return resultAkunJabatan;
        //     // } else {
        //     //     setListAkunJurnal(resultAkunTransaksi);
        //     //     return resultAkunTransaksi;
        //     // }
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }
    };

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkun = await refreshDaftarAkun();
            // console.log('resultDaftarAkun', resultDaftarAkun);
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
        // refreshDaftarAkun();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objekHeader, vRefreshData]);

    const handleDialogAkun = async () => {
        // console.log('masuk sini', listAkunJurnal);
        vRefreshData.current += 1;
        if (listAkunJurnal.length < 0) {
            setShowDialogAkun(true);
        } else {
            setShowDialogAkun(true);
        }
        // };
    };

    const handleDownloadImage = (jenis: string) => {
        const imageUrl = jenis === '1' ? objekImage?.preview : jenis === '2' ? objekImage?.preview2 : jenis === '3' ? objekImage?.preview3 : jenis === '4' ? objekImage?.preview4 : null;
        const fileName = jenis === '1' ? objekImage?.nameImage : jenis === '2' ? objekImage?.nameImage2 : jenis === '3' ? objekImage?.nameImage3 : jenis === '4' ? objekImage?.nameImage4 : null;

        if (!imageUrl || !fileName) {
            console.error('No image to download');
            return;
        }

        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePreviewImage = (jenis: string) => {
        if (jenis === 'open') {
            setModalPreview(true);
        } else if (jenis === 'close') {
            setModalPreview(false);
        }
    };

    const handleWheel = (event: any) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            setZoomLevel((prevScale) => Math.min(prevScale + 0.1, 6));
        } else {
            setZoomLevel((prevScale) => Math.max(prevScale - 0.1, 0.5));
        }
    };
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setStartPosition({ x: event.clientX - translate.x, y: event.clientY - translate.y });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            setTranslate({
                x: event.clientX - startPosition.x,
                y: event.clientY - startPosition.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (modalPreview) {
            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [modalPreview, handleMouseMove, handleMouseUp, handleWheel]);

    const onChangeTab = (e: any) => {
        setSelectedTab(e.target.attributes[0].value);
    };
    // console.log('stateDokumen', stateDokumen);
    useEffect(() => {
        // console.log('isFilePendukungBk', isFilePendukungBk);
        if (isFilePendukungBk === 'N' || stateDokumen?.masterDataState === 'BARU' || stateDokumen?.masterDataState === 'EDIT') {
            setSelectedTab(0);
        } else {
            setSelectedTab(1);
        }
    }, [isFilePendukungBk, isOpen]);

    const imageSrc =
        objekImage?.selectedHead === '1'
            ? objekImage?.preview
            : objekImage?.selectedHead === '2'
            ? objekImage?.preview2
            : objekImage?.selectedHead === '3'
            ? objekImage?.preview3
            : objekImage?.selectedHead === '4'
            ? objekImage?.preview4
            : null;

    return (
        <div className="mb-1">
            <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: 'auto', marginTop: 1, borderRadius: 10 }}>
                {/* <TabComponent selectedItem={isFilePendukungBk === 'Y' ? 1 : 0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%"> */}
                <TabComponent
                    onClick={(e: any) => onChangeTab(e)} //
                    selectedItem={selectedTab}
                    animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                    height="100%"
                >
                    <div className="e-tab-header" style={{ display: 'flex' }}>
                        <div tabIndex={0} style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}>
                            1. Alokasi Dana
                        </div>
                        <div tabIndex={1} style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}>
                            2. File Pendukung
                        </div>
                    </div>

                    {/*===================== Content menampilkan alokasi dana =======================*/}
                    <div className="e-content">
                        {/* //Alokasi Dana */}
                        <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 5 }}>
                            <TooltipComponent openDelay={1000} target=".e-headertext">
                                <GridComponent
                                    id="gridDetailBkk"
                                    name="gridDetailBkk"
                                    className="gridDetailBkk"
                                    locale="id"
                                    ref={(g: any) => (gridDetailBkk = g)}
                                    editSettings={{
                                        allowAdding: true,
                                        allowEditing: stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? false : true,
                                        allowDeleting: true,
                                        newRowPosition: 'Bottom',
                                    }}
                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                    allowResizing={true}
                                    autoFit={true}
                                    rowHeight={22}
                                    height={175} //170 barang jadi 150 barang produksi
                                    gridLines={'Both'}
                                    // loadingIndicator={{ indicatorType: 'Shimmer' }}
                                    actionBegin={actionBeginGridDetail}
                                    actionComplete={actionCompleteGridDetail}
                                    rowSelecting={rowSelectingGridDetail}
                                    // created={() => {
                                    //     //Tempatkan posisi toolbar dibawah grid
                                    //     //gridDetailBkk.element.appendChild(
                                    //     //     gridDetailBkk.element.querySelector('.e-toolbar'));
                                    // }}
                                    // recordDoubleClick={(args: any) => {
                                    //     // setFocus = args.column;
                                    // }}
                                    allowKeyboard={false}
                                >
                                    <ColumnsDirective>
                                        {/* <ColumnDirective field="id_dokumen" type="number" isPrimaryKey={true} headerText="ID" headerTextAlign="Center" textAlign="Center" width="30" /> */}
                                        <ColumnDirective
                                            field="no_akun"
                                            headerText="No. Akun"
                                            headerTextAlign="Center"
                                            textAlign="Left"
                                            width="80"
                                            clipMode="EllipsisWithTooltip"
                                            editTemplate={templateNoAkun}
                                        />
                                        <ColumnDirective
                                            field="nama_akun"
                                            headerText="Nama Akun"
                                            headerTextAlign="Center"
                                            textAlign="Left"
                                            width="220"
                                            clipMode="EllipsisWithTooltip"
                                            editTemplate={templateNamaAkun}
                                        />
                                        <ColumnDirective
                                            field="jumlah_mu"
                                            headerText="Debet (MU)"
                                            headerTextAlign="Center"
                                            textAlign="Right"
                                            width="100"
                                            format="N2"
                                            clipMode="EllipsisWithTooltip"
                                            allowEditing={true}
                                        />
                                        <ColumnDirective
                                            field="catatan"
                                            headerText="Keterangan"
                                            headerTextAlign="Center"
                                            textAlign="Left"
                                            width="150"
                                            clipMode="EllipsisWithTooltip"
                                            allowEditing={true}
                                        />
                                        <ColumnDirective
                                            field="subledger"
                                            headerText="Akun Pembantu (Subledger)"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            width="250"
                                            clipMode="EllipsisWithTooltip"
                                            editTemplate={templateSubledger}
                                            allowEditing={true}
                                        />
                                        <ColumnDirective
                                            field="nama_dept"
                                            headerText="Department"
                                            headerTextAlign="Center"
                                            textAlign="Left"
                                            width="160"
                                            clipMode="EllipsisWithTooltip"
                                            editTemplate={templateDepartemen}
                                            allowEditing={true}
                                        />
                                        <ColumnDirective
                                            field="nama_kry"
                                            headerText="Nama Karyawan"
                                            headerTextAlign="Center"
                                            textAlign="Left"
                                            width="150"
                                            clipMode="EllipsisWithTooltip"
                                            editTemplate={templateKaryawan}
                                        />

                                        <ColumnDirective
                                            field="kode_jual"
                                            headerText="Divisi Penjualan"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            width="100"
                                            clipMode="EllipsisWithTooltip"
                                            editTemplate={templateDivisiPenjualan}
                                        />
                                    </ColumnsDirective>

                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                </GridComponent>
                            </TooltipComponent>
                            <div style={{ padding: 2 }} className="panel-pager mb-10">
                                <div className=" grid grid-cols-12 gap-4">
                                    <div className="col-span-3">
                                        <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                            <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                    <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                        <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                            <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                <div className="mt-1 flex">
                                                                    <ButtonComponent
                                                                        id="buAdd1"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-primary e-small"
                                                                        iconCss="e-icons e-small e-plus"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                        onClick={() => handleDetailBaru('new')}
                                                                        disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                                                                    />
                                                                    {/* <ButtonComponent
                                                                                id="buEdit1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-edit"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={() => DetailBarangEdit(gridTtbList)}
                                                                            /> */}
                                                                    <ButtonComponent
                                                                        id="buDelete1"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-warning e-small"
                                                                        iconCss="e-icons e-small e-trash"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                        // onClick={() => DetailBarangDelete(gridMkDetail, swalDialog, IdDokumen, setIdDokumen, setDataBarang)}
                                                                        onClick={() => DetailBarangDelete()}
                                                                        disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                                                                    />
                                                                    <ButtonComponent
                                                                        id="buDeleteAll1"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-danger e-small"
                                                                        iconCss="e-icons e-small e-erase"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                        // onClick={() => DetailBarangDeleteAll(swalDialog, setDataBarang, setTotalBarang, setTotalRecords, setIdDokumen)}
                                                                        onClick={() => DetailBarangDeleteAll()}
                                                                        // onClick={() => handleBersihkanAll()}
                                                                        disabled={stateDokumen?.CON_BKK === 'PREVIEW_IMAGE' || stateDokumen?.CON_BKK === 'PREVIEW_IMAGE_ORI' ? true : false}
                                                                    />
                                                                    {/* <ButtonComponent
                                                                                id="buSimpanDokumen1"
                                                                                content="Daftar SJ"
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-search"
                                                                                style={{ float: 'right', width: '90px', marginRight: 2.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                // onClick={DialogDaftarSj}
                                                                            /> */}
                                                                    {/* <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                <b>Jumlah Barang :</b>&nbsp;&nbsp;&nbsp;{TotalBarang}
                                                                            </div> */}
                                                                </div>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </TooltipComponent>
                                    </div>

                                    <div className="col-span-4 "></div>
                                    <div className="col-span-4 "></div>
                                </div>
                            </div>
                        </div>

                        {/* //FILE PENDUKUNG */}
                        {/* //FILE PENDUKUNG */}
                        <div tabIndex={1} style={{ width: '100%', height: '375px', marginTop: '5px', padding: 10 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    // position: 'fixed',
                                    zIndex: 1000, // zIndex untuk bisa diklik
                                    // right: 0,
                                    // backgroundColor: '#F2FDF8',
                                    position: 'absolute',
                                    // bottom: 0,
                                    right: 0,
                                    borderBottomLeftRadius: '6px',
                                    borderBottomRightRadius: '6px',
                                    // width: '100%',
                                    // height: '55px',
                                    // display: 'inline-block',
                                    overflowX: 'scroll',
                                    overflowY: 'hidden',
                                    scrollbarWidth: 'none',
                                    // border: '1px solid',
                                    marginRight: 10,
                                }}
                            >
                                <ButtonComponent
                                    id="clean"
                                    content="Hapus Gambar"
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-small e-trash"
                                    style={{ width: '190px', marginRight: 2, backgroundColor: '#3b3f5c' }}
                                    onClick={() => {
                                        // handleRemove(imageState.selectedHead, imageState, setImageState);
                                        handleRemove(objekImage?.selectedHead, objekImage, stateObjekImage);
                                    }}
                                />
                                <ButtonComponent
                                    id="cleanall"
                                    content="Bersihkan Semua Gambar"
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-small e-erase"
                                    style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                    onClick={() => {
                                        // handleRemove('all', imageState, setImageState);
                                        handleRemove('all', objekImage, stateObjekImage);
                                    }}
                                />
                                <ButtonComponent
                                    id="savefile"
                                    content="Simpan ke File"
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-small e-download"
                                    style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                    onClick={() => {
                                        handleDownloadImage(objekImage?.selectedHead);
                                    }}
                                />
                                <ButtonComponent
                                    id="preview"
                                    content="Preview"
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-small e-image"
                                    style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                    onClick={() => {
                                        // console.log('objekImage?.selectedHead ', objekImage?.selectedHead);
                                        handlePreviewImage('open');
                                    }}
                                />
                                {modalPreview && imageSrc && (
                                    <div
                                        style={{
                                            position: 'fixed',
                                            top: '0',
                                            left: '0',
                                            width: '100vw',
                                            height: '100vh',
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: '1000',
                                            overflow: 'hidden',
                                        }}
                                        // onClick={() => setModalPreview(false)}
                                    >
                                        <div
                                            style={{
                                                position: 'relative',
                                                textAlign: 'center',
                                                zIndex: '1001',
                                                cursor: 'grab',
                                                transform: `translate(${translate.x}px, ${translate.y}px)`,
                                                transition: isDragging ? 'none' : 'transform 0.1s ease',
                                            }}
                                            onMouseDown={handleMouseDown}
                                            onMouseUp={handleMouseUp}
                                            onWheel={handleWheel}
                                        >
                                            <Image
                                                src={
                                                    objekImage?.selectedHead === '1'
                                                        ? objekImage?.preview
                                                        : objekImage?.selectedHead === '2'
                                                        ? objekImage?.preview2
                                                        : objekImage?.selectedHead === '3'
                                                        ? objekImage?.preview3
                                                        : objekImage?.selectedHead === '4'
                                                        ? objekImage?.preview4
                                                        : null
                                                }
                                                style={{
                                                    transform: `scale(${zoomLevel})`,
                                                    transition: 'transform 0.1s ease',
                                                    cursor: 'pointer',
                                                    maxWidth: '100vw',
                                                    maxHeight: '100vh',
                                                    width: '100%',
                                                    height: '300px',
                                                }}
                                                className={zoomLevel === 2 ? 'zoomed' : ''}
                                                onMouseDown={handleMouseDown}
                                                onMouseUp={handleMouseUp}
                                                alt="Large Image"
                                                width={300}
                                                height={300}
                                            />

                                            {/* <img
                                            src={
                                                objekImage?.selectedHead === '1'
                                                    ? objekImage?.preview
                                                    : objekImage?.selectedHead === '2'
                                                    ? objekImage?.preview2
                                                    : objekImage?.selectedHead === '3'
                                                    ? objekImage?.preview3
                                                    : objekImage?.selectedHead === '4'
                                                    ? objekImage?.preview4
                                                    : null
                                            }
                                            style={{
                                                transform: `scale(${zoomLevel})`,
                                                transition: 'transform 0.1s ease',
                                                cursor: 'pointer',
                                                maxWidth: '100vw',
                                                maxHeight: '100vh',
                                            }}
                                            className={zoomLevel === 2 ? 'zoomed' : ''}
                                            onMouseDown={handleMouseDown}
                                            onMouseUp={handleMouseUp}
                                        /> */}
                                        </div>
                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: '10px',
                                                right: '10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '10px',
                                                zIndex: '1001',
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faSearchMinus}
                                                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
                                                style={{
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '24px',
                                                }}
                                                width={24}
                                                height={24}
                                            />
                                            <FontAwesomeIcon
                                                icon={faSearchPlus}
                                                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 6))}
                                                style={{
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '24px',
                                                }}
                                                width={24}
                                                height={24}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                onClick={() => {
                                                    handlePreviewImage('close');
                                                    setZoomLevel(1);
                                                    setTranslate({ x: 0, y: 0 });
                                                }}
                                                style={{
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '24px',
                                                }}
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <TabComponent
                                // ref={(t) => (tabTtbList = t)}
                                selectedItem={0}
                                animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                height="100%"
                                style={{ marginTop: -10, fontSize: 12 }}
                            >
                                <div className="e-tab-header" style={{ display: 'flex' }}>
                                    <button
                                        tabIndex={0}
                                        onClick={() => {
                                            stateObjekImage((prevData: any) => ({
                                                ...prevData,
                                                selectedHead: '1',
                                            }));
                                        }}
                                        style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Nota Pendukung
                                    </button>
                                    <button
                                        tabIndex={1}
                                        onClick={async () => {
                                            stateObjekImage({
                                                ...objekImage,
                                                selectedHead: '2',
                                            });
                                            // await stateObjekImage((prevData: any) => ({
                                            //     ...prevData,
                                            //     selectedHead: '2',
                                            // }));
                                        }}
                                        style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Bukti Persetujuan
                                    </button>
                                    <div
                                        tabIndex={2}
                                        onClick={() => {
                                            stateObjekImage({
                                                ...objekImage,
                                                selectedHead: '3',
                                            });
                                        }}
                                        style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Bukti Pendukung 1
                                    </div>
                                    <div
                                        tabIndex={3}
                                        onClick={() => {
                                            stateObjekImage({
                                                ...objekImage,
                                                selectedHead: '4',
                                            });
                                            // setSelectedHead('4')
                                        }}
                                        style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Bukti Pendukung 2
                                    </div>
                                </div>

                                {/*===================== Content menampilkan data barang =======================*/}
                                <div className="e-content">
                                    {/* //A */}
                                    <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: 400 }}>
                                                <UploaderComponent
                                                    id="previewfileupload1"
                                                    type="file"
                                                    ref={uploaderRef}
                                                    multiple={false}
                                                    // selected={(e) => handleFileSelect(e, '1', imageState, setImageState)}
                                                    // removing={() => handleRemove('1', imageState, setImageState)}
                                                    selected={async (e: any) => {
                                                        await handleFileSelect(e, '1', objekImage, stateObjekImage);
                                                    }}
                                                    removing={() => handleRemove('1', objekImage, stateObjekImage)}
                                                />
                                            </div>
                                            {/* {imageState.preview && (
                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                <Image src={imageState.preview} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />

                                            </div>
                                        )} */}
                                            {objekImage?.preview && (
                                                <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                    <Image src={objekImage?.preview} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    {/* <img src={preview} alt="File preview" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* //B */}
                                    <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: 400 }}>
                                                <UploaderComponent
                                                    id="previewfileupload2"
                                                    type="file"
                                                    ref={uploaderRef2}
                                                    // asyncSettings={path}
                                                    // autoUpload={false}
                                                    multiple={false}
                                                    // selected={(e) => handleFileSelect(e, '2', imageState, setImageState)}
                                                    // removing={() => handleRemove('2', imageState, setImageState)}
                                                    selected={async (e) => {
                                                        // setTag('2');
                                                        await handleFileSelect(e, '2', objekImage, stateObjekImage);
                                                    }}
                                                    removing={() => handleRemove('2', objekImage, stateObjekImage)}
                                                />
                                            </div>
                                            {/* {imageState.preview2 && (
                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                <Image src={imageState.preview2} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                            </div>
                                        )} */}
                                            {objekImage?.preview2 && (
                                                <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                    <Image src={objekImage?.preview2} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    {/* <img src={preview} alt="File preview" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* //C */}
                                    <div tabIndex={2} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: 400 }}>
                                                <UploaderComponent
                                                    id="previewfileupload3"
                                                    type="file"
                                                    ref={uploaderRef3}
                                                    // asyncSettings={path}
                                                    // autoUpload={false}
                                                    multiple={false}
                                                    // selected={(e) => handleFileSelect(e, '3', imageState, setImageState)}
                                                    // removing={() => handleRemove('3', imageState, setImageState)}
                                                    selected={async (e) => {
                                                        // setTag('3');
                                                        await handleFileSelect(e, '3', objekImage, stateObjekImage);
                                                    }}
                                                    removing={() => handleRemove('3', objekImage, stateObjekImage)}
                                                />
                                            </div>
                                            {/* {imageState.preview3 && (
                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                <Image src={imageState.preview3} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                            </div>
                                        )} */}
                                            {objekImage?.preview3 && (
                                                <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                    <Image src={objekImage?.preview3} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    {/* <img src={preview} alt="File preview" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* //D */}
                                    <div tabIndex={4} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: 400 }}>
                                                <UploaderComponent
                                                    id="previewfileupload4"
                                                    type="file"
                                                    ref={uploaderRef4}
                                                    // asyncSettings={path}
                                                    // autoUpload={false}
                                                    multiple={false}
                                                    // selected={(e) => handleFileSelect(e, '4', imageState, setImageState)}
                                                    // removing={() => handleRemove('4', imageState, setImageState)}
                                                    selected={async (e) => {
                                                        // setTag('4');
                                                        await handleFileSelect(e, '4', objekImage, stateObjekImage);
                                                    }}
                                                    removing={() => handleRemove('4', objekImage, stateObjekImage)}
                                                />
                                            </div>
                                            {/* {imageState.preview4 && (
                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                <Image src={imageState.preview4} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                            </div>
                                        )} */}
                                            {objekImage?.preview4 && (
                                                <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                    <Image src={objekImage?.preview4} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                    {/* <img src={preview} alt="File preview" style={{ maxWidth: '100%', maxHeight: '300px' }} /> */}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabComponent>
                        </div>

                        {/* END FILE PENDUKUNG */}
                    </div>
                    {showDialogAkun && (
                        <FrmDlgAkunJurnal
                            kode_entitas={stateDokumen?.kode_entitas}
                            isOpen={showDialogAkun}
                            onClose={() => {
                                setShowDialogAkun(false);
                            }}
                            onBatal={() => {
                                setShowDialogAkun(false);
                            }}
                            selectedData={(dataObject: any) => handleSelectedDialogAkun(dataObject)}
                            target={'FrmPraBkk'}
                            stateDokumen={stateDokumen}
                            kodeAkun={''}
                            listAkunJurnalObjek={listAkunJurnal}
                            vRefreshDataAkun={vRefreshData.current}
                            openFrom={'detail'}
                        />
                    )}
                    {showDialogCustomer && (
                        <FrmCustomerDlg
                            kode_entitas={stateDokumen?.kode_entitas}
                            isOpen={showDialogCustomer}
                            onClose={() => {
                                setShowDialogCustomer(false);
                                // handleOnCloseDlgAkun();
                            }}
                            onBatal={() => {
                                // handleOnBatalDlgAkun();
                                setShowDialogCustomer(false);
                            }}
                            selectedData={(dataObject: any) => handleSelectedDialogCustomer(dataObject)}
                            target={'FrmPraBkk'}
                            vRefreshData={vRefreshData.current}
                        />
                    )}
                    {showDialogSubLedger && (
                        <FrmDlgSubLedger
                            stateDokumen={() => {
                                // console.log('vkodeAkun', vkodeAkun);
                                stateDokumen;
                            }}
                            kode_entitas={stateDokumen?.kode_entitas}
                            isOpen={showDialogSubLedger}
                            onClose={async () => {
                                // await handleButtonSubledger(gridDetailBkk.dataSource[selectedRowIndex]?.kode_akun, gridDetailBkk.dataSource[selectedRowIndex]?.kode_subledger);
                                await handleOnCloseSubledger(gridDetailBkk.dataSource[selectedRowIndex]?.kode_akun, gridDetailBkk.dataSource[selectedRowIndex]?.kode_subledger);
                                // setShowDialogSubLedger(false);
                                // handleOnCloseDlgAkun();
                            }}
                            onBatal={() => {
                                // handleOnBatalDlgAkun();
                                setShowDialogSubLedger(false);
                            }}
                            selectedData={(dataObject: any) => handleSelectedDataSubLedger(dataObject)}
                            target={'FrmPraBkk'}
                            kodeAkun={vkodeAkun} //{gridDetailBkk?.dataSource[selectedRowIndex]?.kode_akun}
                            jenis={modalSource}
                            vRefreshData={vRefreshData.current}
                        />
                    )}
                    {showDialogSupplier && (
                        <FrmSupplierDlg
                            stateDokumen={stateDokumen}
                            kode_entitas={stateDokumen?.kode_entitas}
                            isOpen={showDialogSupplier}
                            onClose={() => {
                                setShowDialogSupplier(false);
                                // handleOnCloseDlgAkun();
                            }}
                            onBatal={() => {
                                // handleOnBatalDlgAkun();
                                setShowDialogSupplier(false);
                            }}
                            selectedData={(dataObject: any) => handleSelectedDialogSupplier(dataObject)}
                            target={'FrmPraBkk'}
                            kodeMu={gridDetailBkk?.dataSource[selectedRowIndex]?.kode_mu}
                            vRefreshData={vRefreshData.current}
                        />
                    )}
                    {showDialogDepartemen && (
                        <FrmDlgDepartement
                            stateDokumen={stateDokumen}
                            isOpen={showDialogDepartemen}
                            onClose={async () => {
                                await handleOnCloseDepartement(gridDetailBkk.dataSource[selectedRowIndex]?.kode_akun, gridDetailBkk.dataSource[selectedRowIndex]?.kode_subledger);
                                // setShowDialogDepartemen(false);
                                // handleOnCloseDlgAkun();
                            }}
                            onBatal={() => {
                                // handleOnBatalDlgAkun();
                                setShowDialogDepartemen(false);
                            }}
                            selectedData={(dataObject: any) => handleSelectedDialogDepartement(dataObject)}
                            target={'FrmPraBkk'}
                            kodeAkun={gridDetailBkk?.dataSource[selectedRowIndex]?.kode_akun}
                            vRefreshData={vRefreshData.current}
                        />
                    )}
                    {showDialogKaryawan && (
                        <FrmDlgKaryawan
                            stateDokumen={stateDokumen}
                            kode_entitas={stateDokumen?.kode_entitas}
                            isOpen={showDialogKaryawan}
                            onClose={() => {
                                setShowDialogKaryawan(false);
                                // handleOnCloseDlgAkun();
                            }}
                            onBatal={() => {
                                // handleOnBatalDlgAkun();
                                setShowDialogKaryawan(false);
                            }}
                            selectedData={(dataObject: any) => handleSelectedDialogKaryawan(dataObject)}
                            target={'FrmPraBkk'}
                            kodeAkun={gridDetailBkk?.dataSource[selectedRowIndex]?.kode_akun}
                            vRefreshData={vRefreshData.current}
                        />
                    )}
                </TabComponent>
            </div>
        </div>
    );
};

export default DetailPraBkk;
