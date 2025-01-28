// import React from 'react';
import { useEffect, useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faMagnifyingGlass, faPlay, faSquareCaretDown, faTimes, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import styles from './julist.module.css';
import { showLoading, usersMenu, FirstDayInPeriod } from '@/utils/routines';
import moment from 'moment';
import axios from 'axios';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import swal from 'sweetalert2';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useSession } from '@/pages/api/sessionContext';
import withReactContent from 'sweetalert2-react-content';
import Dropdown from '../../../../../components/Dropdown';
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import {
    Grid,
    GridComponent,
    ColumnDirective,
    ColumnsDirective,
    Inject,
    Page,
    Edit,
    Sort,
    Filter,
    Group,
    Resize,
    Reorder,
    Selection,
    Freeze,
    ExcelExport,
    PdfExport,
} from '@syncfusion/ej2-react-grids';
import ModalJurnalUmumProps from './modal/ju';

// let gridListDataJU: Grid | any;
let gridListDataJU: Grid | any;
let gridListDataJUDetail: Grid | any;

const JurnalUmumList = () => {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
    }
    const kode_menu = '60101';
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: 'Y', edit: 'Y', hapus: 'Y', cetak: 'Y' });
    const [isNoBuktiChecked, setIsNoBuktiChecked] = useState(false);
    const [isTanggalChecked, setIsTanggalChecked] = useState(true);
    const [isTanggalBuatChecked, setIsTanggalBuatChecked] = useState(false);
    const [isKeteranganChecked, setIsKeteranganChecked] = useState(false);
    const [noBuktiValue, setNoBuktiValue] = useState('');
    const [keteranganValue, setKeteranganValue] = useState('');
    const [date1, setDate1] = useState<moment.Moment>(moment());
    const [date2, setDate2] = useState<moment.Moment>(moment().endOf('month'));
    const [date3, setDate3] = useState<moment.Moment>(moment());
    const [date4, setDate4] = useState<moment.Moment>(moment().endOf('month'));
    const [selectedRowKode, setSelectedRowKode] = useState<any>('');
    const [selectedRowNoJU, setSelectedRowNoJU] = useState({ no_ju: '', tgl_ju: '' });
    const [panelVisible, setPanelVisible] = useState(true); // filter
    const [statusEdit, setStatusEdit] = useState(false); // filter

    const [modalJurnalUmum, setModalJurnalUmum] = useState<any>(false); // Modal
    const [modalDetail, setModalDetail] = useState(false); // Modal Detail
    const [recordsData, setRecordsData] = useState<any>([]);
    const [detailFetch, setDetailFetch] = useState<any>('');

    // ============PRINT PDF SYNCFUSION=================
    let menuHeaderItems: MenuItemModel[] = [
        {
            iconCss: 'e-icons e-print',
            text: 'Cetak ke printer',
        },
        {
            iconCss: 'e-icons',
            text: 'Export ke file',
            items: [
                { iconCss: 'e-icons e-export-pdf', text: 'PDF' },
                { iconCss: 'e-icons e-export-excel', text: 'XLSX' },
                { iconCss: 'e-icons e-export-csv', text: 'CSV' },
            ],
        },
    ];

    const menuHeaderSelect = (args: MenuEventArgs) => {
        if (args.item.text === 'Cetak ke printer') {
            gridListDataJU.print();
        } else if (args.item.text === 'PDF') {
            gridListDataJU.showSpinner();
            gridListDataJU.pdfExport();
        } else if (args.item.text === 'XLSX') {
            gridListDataJU.showSpinner();
            gridListDataJU.excelExport();
        } else if (args.item.text === 'CSV') {
            gridListDataJU.showSpinner();
            gridListDataJU.csvExport();
        }
    };

    const ExportComplete = (): void => {
        gridListDataJU.hideSpinner();
    };
    // ============END PRINT PDF SYNCFUSION=================

    // ================MY ALERT===================
    const swalToast = swal.mixin({
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

    const myAlert = (text: any) => {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: `<p style="font-size:12px">${text}</p>`,
            width: '100%',
            target: '#dialogJenisTransaksiJU',
        });
    };
    // ================END MY ALERT===================

    useEffect(() => {
        const fetchDataUseEffect = async () => {
            const tanggalSekarang = moment();
            const tanggalAwalBulan = tanggalSekarang.startOf('month');
            const tanggalHariIni = moment(new Date()).format('YYYY-MM-DD');
            const tanggalAkhirBulan = moment(tanggalAwalBulan.endOf('month')).format('YYYY-MM-DD');
            // showLoading1(true);

            let vNoBukti = 'all';
            let vTglAwal = 'all'; //tanggalHariIni
            let vTglAkhir = 'all'; //tanggalAkhirBulan
            let vTglBuatAwal = 'all';
            let vTglBuatAkhir = 'all';
            let vCatatan = 'all';

            if (isNoBuktiChecked) {
                vNoBukti = `${noBuktiValue}`;
            }

            if (isTanggalChecked) {
                const formattedDate1 = date1.format('YYYY-MM-DD');
                const formattedDate2 = date2.format('YYYY-MM-DD');
                vTglAwal = `${formattedDate1}`;
                vTglAkhir = `${formattedDate2}`;
            }

            if (isTanggalBuatChecked) {
                const formattedDate1 = date3.format('YYYY-MM-DD');
                const formattedDate2 = date4.format('YYYY-MM-DD');
                vTglBuatAwal = `${formattedDate1}`;
                vTglBuatAkhir = `${formattedDate2}`;
            }

            if (isKeteranganChecked) {
                vCatatan = `${keteranganValue}`;
            }

            const response = await axios.get(`${apiUrl}/erp/list_jurnal_umum?`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    entitas: kode_entitas,
                    param1: vNoBukti, // no_bukti
                    param2: vTglAwal, // tgl_awal
                    param3: vTglAkhir, // tgl_akhir
                    param4: vCatatan, // catatan
                    param5: vTglBuatAwal, // tgl_buat_awal
                    param6: vTglBuatAkhir, // tgl_buat_akhir
                },
            });

            const responseData = response.data.data;
            showLoading1(false);

            const modifiedResponseData = responseData.map((item: any) => {
                return {
                    ...item,
                    jumlah_rp: parseFloat(item.jumlah_rp),
                };
            });

            console.log(modifiedResponseData);
            setRecordsData(modifiedResponseData);
            if (gridListDataJU) {
                gridListDataJU.dataSource = modifiedResponseData;
            }
            if (userid !== 'administrator') {
                await usersMenu(kode_entitas, userid, kode_menu)
                    .then((result) => {
                        const { baru, edit, hapus, cetak } = result;
                        setUserMenu((prevState) => ({
                            ...prevState,
                            baru: baru,
                            edit: edit,
                            hapus: hapus,
                            cetak: cetak,
                        }));
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            } else {
                //ADMIN
                setUserMenu((prevState) => ({
                    ...prevState,
                    baru: 'Y',
                    edit: 'Y',
                    hapus: 'Y',
                    cetak: 'Y',
                }));
            }
        };
        fetchDataUseEffect();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const halfScreenWidth = window.screen.availWidth / 2;
            if (screenWidth < halfScreenWidth) {
                setPanelVisible(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //DETAIL
    // const fetchData = async (kode_dokumen: any) => {
    //     try {
    //         const responseDetail = await axios.get(`${apiUrl}/erp/master_jurnal_umum?`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             params: {
    //                 entitas: kode_entitas,
    //                 param1: kode_dokumen,
    //             },
    //         });
    //         const dataMaster = responseDetail.data.data.master[0];
    //         // console.log(dataMaster);
    //         // console.log(dataMaster.no_dokumen);
    //         // console.log(dataMaster.tgl_dokumen);
    //         // setDataInfoDetail({ no_dokumen: dataMaster.no_dokumen, tgl_dokumen: dataMaster.tgl_dokumen });
    //         const ress = responseDetail.data.data.jurnal;
    //         const modifiedResponseData = ress.map((item: any) => {
    //             return {
    //                 ...item,
    //                 debet_rp: parseFloat(item.debet_rp),
    //                 kredit_rp: parseFloat(item.kredit_rp),
    //                 jumlah_rp: parseFloat(item.jumlah_rp),
    //                 jumlah_mu: parseFloat(item.jumlah_mu),
    //                 kurs: parseFloat(item.kurs),
    //             };
    //         });
    //         console.log(modifiedResponseData);
    //         gridListDataJUDetail.dataSource = modifiedResponseData;
    //         setDetailFetch(modifiedResponseData);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    useEffect(() => {
        console.log(selectedRowKode);
        const fetchDataDetail = async () => {
            try {
                const responseDetail = await axios.get(`${apiUrl}/erp/master_jurnal_umum?`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        entitas: kode_entitas,
                        param1: selectedRowKode,
                    },
                });
                const dataMaster = responseDetail.data.data.master[0];
                // console.log(dataMaster);
                // console.log(dataMaster.no_dokumen);
                // console.log(dataMaster.tgl_dokumen);
                // setDataInfoDetail({ no_dokumen: dataMaster.no_dokumen, tgl_dokumen: dataMaster.tgl_dokumen });
                const ress = responseDetail.data.data.jurnal;
                const modifiedResponseData = ress.map((item: any) => {
                    return {
                        ...item,
                        debet_rp: parseFloat(item.debet_rp),
                        kredit_rp: parseFloat(item.kredit_rp),
                        jumlah_rp: parseFloat(item.jumlah_rp),
                        jumlah_mu: parseFloat(item.jumlah_mu),
                        kurs: parseFloat(item.kurs),
                    };
                });
                console.log(modifiedResponseData);
                gridListDataJUDetail.dataSource = modifiedResponseData;
                setDetailFetch(modifiedResponseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataDetail();
    }, [selectedRowKode, modalDetail]);

    const handleRefreshData = async () => {
        showLoading1(true);
        if (kode_entitas !== null || kode_entitas !== '') {
            console.log(kode_entitas);
            try {
                let vNoBukti = 'all';
                let vTglAwal = 'all'; //tanggalHariIni
                let vTglAkhir = 'all'; //tanggalAkhirBulan
                let vTglBuatAwal = 'all';
                let vTglBuatAkhir = 'all';
                let vCatatan = 'all';

                if (isNoBuktiChecked) {
                    vNoBukti = `${noBuktiValue}`;
                }

                if (isTanggalChecked) {
                    const formattedDate1 = date1.format('YYYY-MM-DD');
                    const formattedDate2 = date2.format('YYYY-MM-DD');
                    vTglAwal = `${formattedDate1}`;
                    vTglAkhir = `${formattedDate2}`;
                }

                if (isTanggalBuatChecked) {
                    const formattedDate1 = date3.format('YYYY-MM-DD');
                    const formattedDate2 = date4.format('YYYY-MM-DD');
                    vTglBuatAwal = `${formattedDate1}`;
                    vTglBuatAkhir = `${formattedDate2}`;
                }

                if (isKeteranganChecked) {
                    vCatatan = `${keteranganValue}`;
                }

                const response = await axios.get(`${apiUrl}/erp/list_jurnal_umum?`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        entitas: kode_entitas,
                        param1: vNoBukti, // no_bukti
                        param2: vTglAwal, // tgl_awal
                        param3: vTglAkhir, // tgl_akhir
                        param4: vCatatan, // catatan
                        param5: vTglBuatAwal, // tgl_buat_awal
                        param6: vTglBuatAkhir, // tgl_buat_akhir
                    },
                });

                const responseData = response.data.data;
                const modifiedResponseData = responseData.map((item: any) => {
                    return {
                        ...item,
                        jumlah_rp: parseFloat(item.jumlah_rp),
                    };
                });

                // setRecordsData(modifiedResponseData);
                gridListDataJU.dataSource = modifiedResponseData;
                showLoading1(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleTogglePanel = () => {
        setPanelVisible(!panelVisible);
    };

    const handleFilterClick = () => {
        setPanelVisible(true);
    };

    const handleInputNoBukti = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setNoBuktiValue(newValue);
        setIsNoBuktiChecked(newValue.length > 0);
    };

    const handleTgl = async (date: any, tipe: string) => {
        if (tipe === 'tanggalAwal') {
            setDate1(date);
            setIsTanggalChecked(true);
        } else {
            setDate2(date);
            setIsTanggalChecked(true);
        }
    };

    const handleTglBuat = async (date: any, tipe: string) => {
        if (tipe === 'tanggalAwal') {
            setDate3(date);
            setIsTanggalBuatChecked(true);
        } else {
            setDate4(date);
            setIsTanggalBuatChecked(true);
        }
    };

    const handleInputKeterangan = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setKeteranganValue(newValue);
        setIsKeteranganChecked(newValue.length > 0);
    };

    async function showLoading1(closeWhenDataIsFulfilled: boolean) {
        if (closeWhenDataIsFulfilled) {
            swal.fire({
                padding: '3em',
                imageUrl: '/assets/images/loader-1.gif',
                imageWidth: 170,
                imageHeight: 170,
                imageAlt: 'Custom image',
                background: 'rgba(0,0,0,.0)',
                backdrop: 'rgba(0,0,0,0.0)',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        } else {
            swal.close(); // Menutup tampilan loading
        }
    }

    // let kode_ju_edit: any = null; // kenapa pake let ada bugs
    // let no_ju: any = null; // kenapa pake let ada bugs
    // let tgl_ju: any = null; // kenapa pake let ada bugs
    const handleRowSelected = (args: any) => {
        console.log(args.data.kode_dokumen);
        // kode_ju_edit = args.data.kode_dokumen;
        // no_ju = args.data.no_dokumen;
        // tgl_ju = args.data.tgl_dokumen;
        // fetchData(args.data.kode_dokumen);
        setSelectedRowKode(args.data.kode_dokumen);
        setSelectedRowNoJU({ no_ju: args.data.no_dokumen, tgl_ju: args.data.tgl_dokumen });
    };

    const testFunction = () => {
        console.log('asd');
    };

    const dateFormat = (field: any, data: any) => {
        return data[field] ? moment(data[field]).format('DD-MM-YYYY') : '';
    };

    return (
        <div className="main" id="main-target">
            <div style={{ marginTop: -3 }} className="mb-2 flex flex-col items-center justify-between md:flex-row">
                <div className="flex flex-wrap items-center">
                    <ButtonComponent
                        id="btnBaru"
                        cssClass="e-primary e-small"
                        onClick={() => {
                            setStatusEdit(false);
                            setModalJurnalUmum(true);
                        }}
                        disabled={userMenu.baru === 'Y' ? false : true}
                        content="Baru"
                        style={{ backgroundColor: 'rgb(59 63 92)' }}
                    ></ButtonComponent>
                    <ButtonComponent
                        id="btnUbah"
                        cssClass="e-primary e-small"
                        onClick={() => {
                            if (selectedRowKode !== '') {
                                setStatusEdit(true);
                                setModalJurnalUmum(true);
                                console.log(selectedRowKode);
                            } else {
                                myAlert(`Silahkan pilih data yang akan diedit.`);
                            }
                        }}
                        disabled={userMenu.edit === 'Y' ? false : true}
                        content="Ubah"
                        style={{ backgroundColor: 'rgb(59 63 92)', marginLeft: 5 }}
                    ></ButtonComponent>
                    <ButtonComponent
                        id="btnFilter"
                        cssClass="e-primary e-small"
                        onClick={handleFilterClick}
                        disabled={panelVisible}
                        content="Filter"
                        style={panelVisible ? { color: 'white', marginLeft: 5, backgroundColor: '#dedede' } : { backgroundColor: 'rgb(59 63 92)', marginLeft: 5, color: 'white' }}
                    ></ButtonComponent>
                    {/* CETAK */}
                    <div style={{ marginLeft: 5, marginRight: 0 }} className="relative">
                        <div className="dropdown">
                            <Dropdown
                                offset={[0, 5]}
                                placement={`bottom-start`}
                                // btnClassName="btn btn-dark md:mr-1"
                                button={
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontSize: 11,
                                            backgroundColor: 'rgb(59 63 92)',
                                            color: 'white',
                                            padding: '2.5px 10px',
                                            borderRadius: '4px',
                                            fontFamily: 'Roboto',
                                        }}
                                    >
                                        Cetak
                                        <FontAwesomeIcon icon={faSquareCaretDown} className="ml-2" width="15" height="15" />
                                    </div>
                                }
                            >
                                <ul style={{ width: '150px', fontSize: 12, textAlign: 'left' }}>
                                    <li>
                                        <button
                                            type="button"
                                            // onClick={() => OnClick_CetakFormMB('1')}
                                            disabled={userMenu.cetak === 'Y' ? false : true}
                                            style={
                                                userMenu.cetak !== 'Y'
                                                    ? {
                                                          color: '#888',
                                                          cursor: 'not-allowed',
                                                          pointerEvents: 'none',
                                                      }
                                                    : {}
                                            }
                                        >
                                            Form Jurnal Umum{' '}
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            // onClick={() => OnClick_CetakFormMB('8')}
                                            // disabled={userMenu.cetak === 'Y' ? false : true}
                                            disabled={true}
                                            style={
                                                // userMenu.cetak !== 'Y'
                                                //     ? {
                                                {
                                                    color: '#888',
                                                    cursor: 'not-allowed',
                                                    pointerEvents: 'none',
                                                }
                                                // : {}
                                            }
                                        >
                                            Daftar Jurnal Umum
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    {/* END CETAK */}
                    <ButtonComponent
                        id="btnDetaildok"
                        cssClass="e-primary e-small"
                        onClick={() => {
                            setModalDetail(true);
                        }}
                        content="Detail Dok."
                        style={{ backgroundColor: 'rgb(59 63 92)', marginLeft: 5, height: 25 }}
                    ></ButtonComponent>
                </div>

                <div className="mt-3 flex items-center md:mt-0">
                    <span className="font-serif text-lg" style={{ fontSize: 16 }}>
                        Jurnal Umum (JU)
                    </span>
                </div>
            </div>

            <div className={styles['flex-container']} style={{ fontSize: '11px' }}>
                {panelVisible && (
                    <div className="panel" style={{ background: '#dedede', width: '300px' }}>
                        <button className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900" onClick={handleTogglePanel}>
                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                        </button>
                        {/* <form> */}
                        <label className=" flex cursor-pointer items-center">
                            <input type="checkbox" className="form-checkbox" checked={isNoBuktiChecked} onChange={() => setIsNoBuktiChecked(!isNoBuktiChecked)} />
                            <span style={{ fontWeight: 'bold' }}>No. Bukti</span>
                        </label>
                        <input style={{ marginTop: -10, fontSize: 11 }} type="text" placeholder="" className="form-input" value={noBuktiValue} onChange={handleInputNoBukti} />

                        <label style={{ marginTop: 5 }} className="mt-3 flex cursor-pointer items-center">
                            <input type="checkbox" className="form-checkbox" checked={isTanggalChecked} onChange={() => setIsTanggalChecked(!isTanggalChecked)} />
                            <span style={{ fontWeight: 'bold' }}>Tanggal</span>
                        </label>
                        <div style={{ marginTop: -2 }} className="grid grid-cols-1 justify-between gap-1 sm:flex">
                            <Flatpickr
                                value={date1.format('DD-MM-YYYY')}
                                options={{
                                    dateFormat: 'd-m-Y',
                                }}
                                className="form-input"
                                style={{ fontSize: 11, width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}
                                onChange={(date) => handleTgl(moment(date[0]), 'tanggalAwal')}
                            />
                            <p className="mt-1 hidden sm:block">S/D</p>
                            <Flatpickr
                                value={date2.format('DD-MM-YYYY')}
                                options={{
                                    dateFormat: 'd-m-Y',
                                }}
                                className="form-input"
                                style={{ fontSize: 11, width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}
                                onChange={(date) => handleTgl(moment(date[0]), 'tanggalAkhir')}
                            />
                        </div>

                        <label style={{ marginTop: 0 }} className="mt-3 flex cursor-pointer items-center">
                            <input type="checkbox" className="form-checkbox" checked={isTanggalBuatChecked} onChange={() => setIsTanggalBuatChecked(!isTanggalBuatChecked)} />
                            <span style={{ fontWeight: 'bold' }}>Tanggal Buat</span>
                        </label>
                        <div style={{ marginTop: -2 }} className="grid grid-cols-1 justify-between gap-1 sm:flex">
                            <Flatpickr
                                value={date3.format('DD-MM-YYYY')}
                                options={{
                                    dateFormat: 'd-m-Y',
                                }}
                                className="form-input"
                                style={{ fontSize: 11, width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}
                                onChange={(date) => handleTglBuat(moment(date[0]), 'tanggalAwal')}
                            />
                            <p className="mt-1 hidden sm:block">S/D</p>
                            <Flatpickr
                                value={date4.format('DD-MM-YYYY')}
                                options={{
                                    dateFormat: 'd-m-Y',
                                }}
                                className="form-input"
                                style={{ fontSize: 11, width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}
                                onChange={(date) => handleTglBuat(moment(date[0]), 'tanggalAkhir')}
                            />
                        </div>

                        <label className=" flex cursor-pointer items-center">
                            <input type="checkbox" className="form-checkbox" checked={isKeteranganChecked} onChange={() => setIsKeteranganChecked(!isKeteranganChecked)} />
                            <span style={{ fontWeight: 'bold' }}>Keterangan</span>
                        </label>
                        <input style={{ marginTop: -10, fontSize: 11 }} type="text" placeholder="" className="form-input" value={keteranganValue} onChange={handleInputKeterangan} />

                        <div className="mt-5 flex justify-center">
                            <ButtonComponent
                                style={{ backgroundColor: 'rgb(59 63 92)' }}
                                cssClass="e-primary e-small"
                                iconCss="e-icons e-medium e-refresh"
                                content="Refresh Data"
                                onClick={() => handleRefreshData()}
                            />
                        </div>
                        {/* </form> */}
                    </div>
                )}
                <div className="panel" style={{ background: '#dedede', width: panelVisible ? '85%' : '100%' }}>
                    <div>
                        <GridComponent
                            id="gridListDataJU"
                            locale="id"
                            ref={(g) => (gridListDataJU = g)}
                            dataSource={recordsData}
                            allowExcelExport={true}
                            excelExportComplete={ExportComplete}
                            allowPdfExport={true}
                            pdfExportComplete={ExportComplete}
                            height={600}
                            width={'100%'}
                            gridLines={'Both'}
                            allowPaging={true}
                            allowSorting={true}
                            selectionSettings={{ type: 'Single' }}
                            rowSelected={handleRowSelected}
                            recordDoubleClick={() => {
                                setStatusEdit(true);
                                setModalJurnalUmum(true);
                                console.log(selectedRowKode);
                            }}
                            rowHeight={23}
                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                            allowResizing={true}
                            autoFit={true}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_dokumen" headerText="No. Bukti" width="150" textAlign="Center" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective valueAccessor={dateFormat} field="tgl_dokumen" headerText="Tanggal" width="150" textAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective
                                    valueAccessor={dateFormat}
                                    field="tgl_trxdokumen"
                                    headerText="Tgl. Dibuat"
                                    width="150"
                                    textAlign="Center"
                                    headerTextAlign="Center"
                                    clipMode="EllipsisWithTooltip"
                                />
                                <ColumnDirective format="N2" field="jumlah_rp" headerText="Jumlah" width="150" textAlign="Right" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="catatan" headerText="Keterangan" width="950" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Page, Sort, Filter, Group, Resize]} />
                        </GridComponent>
                        <ContextMenuComponent id="contextmenu" target=".e-gridheader" items={menuHeaderItems} select={menuHeaderSelect} animationSettings={{ duration: 500, effect: 'FadeIn' }} />
                        <style>
                            {`
                    .e-row .e-rowcell:hover {
                        cursor: pointer;
                    }

                    .e-row.e-selectionbackground {
                        cursor: pointer;
                    }
                    .e-grid .e-headertext {
                        font-size: 11px !important;
                    }
                    .e-grid .e-rowcell {
                        font-size: 11px !important;
                    }
                `}
                        </style>
                    </div>
                </div>
            </div>
            {/* BARU */}
            {modalJurnalUmum && (
                <ModalJurnalUmumProps
                    userid={userid}
                    kode_entitas={kode_entitas}
                    isOpen={modalJurnalUmum}
                    onClose={() => {
                        setModalJurnalUmum(false);
                    }}
                    kode_user={kode_user}
                    status_edit={statusEdit}
                    kode_ju_edit={selectedRowKode}
                    onRefresh={handleRefreshData}
                    token={token}
                    plag=""
                />
            )}
            {/* DETAIL */}
            {modalDetail && (
                <DialogComponent
                    id="dialogJenisTransaksiMB"
                    name="dialogJenisTransaksiMB"
                    className="dialogJenisTransaksiMB"
                    target="#main-target"
                    header={`Jurnal Umum : ${selectedRowNoJU.no_ju} - ${moment(selectedRowNoJU.tgl_ju).format('DD-MM-YYYY')}`}
                    visible={modalDetail}
                    // isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    enableResize={true}
                    resizeHandles={['All']}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="1400"
                    height="220"
                    position={{ X: 'center', Y: '180' }}
                    style={{ position: 'fixed' }}
                    close={() => {
                        setModalDetail(false);
                    }}
                >
                    <div>
                        <GridComponent
                            id="gridListDataJUDetail"
                            gridLines={'Both'}
                            allowResizing={true}
                            locale="id"
                            style={{ width: '100%', height: '68%' }}
                            ref={(ju_d) => (gridListDataJUDetail = ju_d)}
                            dataSource={detailFetch}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'100'}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_akun" headerText="No. Akun" width="40" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_akun" headerText="Nama" width="110" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective format={'N2'} field="debet_rp" headerText="Debet" width="60" textAlign="Right" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective format={'N2'} field="kredit_rp" headerText="Kredit" width="60" textAlign="Right" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="catatan" headerText="Keterangan" width="200" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kode_mu" headerText="MU" width="25" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective format={'N2'} field="kurs" headerText="Kurs" width="25" textAlign="Right" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective format={'N2'} field="jumlah_rp" headerText="Jumlah" width="60" textAlign="Right" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="subledger" headerText="Subledger" width="100" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_dept" headerText="Departemen" width="100" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_kry" headerText="Karyawan" width="100" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Page, Sort, Filter, Group, Resize]} />
                        </GridComponent>
                        <ContextMenuComponent id="contextmenu" target=".e-gridheader" items={menuHeaderItems} select={menuHeaderSelect} animationSettings={{ duration: 500, effect: 'FadeIn' }} />
                        <style>
                            {`
                    .e-row .e-rowcell:hover {
                        cursor: pointer;
                    }

                    .e-row.e-selectionbackground {
                        cursor: pointer;
                    }
                `}
                        </style>
                    </div>
                </DialogComponent>
            )}
        </div>
    );
};

export default JurnalUmumList;
