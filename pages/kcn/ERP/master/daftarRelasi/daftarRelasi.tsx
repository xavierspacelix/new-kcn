import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { ContextMenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';

import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useRouter } from 'next/router';

import DialogRelasi from './component/DialogRelasi';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useSession } from '@/pages/api/sessionContext';
// import { useSession } from '@/pages/api/sessionContext';
enableRipple(true);

const RelasiList = () => {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const token = sessionData?.token ?? '';
    const userid = sessionData?.userid ?? '';

    if (isLoading) {
        return;
    }
    const router = useRouter();
    const { norelasi, isRedirectFromSupp } = router.query;
    // Loading data indicator
    const [showLoader, setShowLoader] = useState(true);
    const contentLoader = () => {
        return (
            // prettier-ignore
            <div className="screen_loader animate__animated flex justify-center items-center fixed inset-0 z-[60] place-content-center bg-[#ffffff00] dark:bg-[#060818]">
                <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 67 67"
                            to="-360 67 67"
                            dur="2.5s"
                            repeatCount="indefinite"
                        />
                    </path>
                    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
        );
    };
    const [dsListData, setDSListData] = useState<[]>([]);
    let gridListData: Grid | any;
    let selectedListData: any[] = [];
    // Base URL API Data
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    //======== Variabel parameter untuk filter list data =========
    const [noRegisterValue, setNoRegisterValue] = useState<string>('');
    const [isNoRegisterChecked, setIsNoRegisterChecked] = useState<boolean>(false);
    const [namaRelasiValue, setNamaRelasiValue] = useState<string>('');
    const [isNamaRelasiChecked, setIsNamaRelasiChecked] = useState<boolean>(false);
    const [isTipeRelasiChecked, setIsTipeRelasiChecked] = useState<boolean>(false);
    const [tipeRelasiValue, setTipeRelasiValue] = useState<string>('');
    let disabledBaru = false;
    let disabledEdit = false;
    let disabledHapus = false;
    let disabledCetak = false;

    //======= Setting tampilan sweet alert  =========
    const swalDialog = swal.mixin({
        customClass: {
            confirmButton: 'btn btn-primary btn-sm',
            cancelButton: 'btn btn-dark btn-sm ltr:mr-3 rtl:ml-3',
            popup: 'sweet-alerts',
        },
        buttonsStyling: false,
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
    const swalToast = swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2000,
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
    //======== Datasource untuk daftar permintaan pembelian ========
    // useEffect(() => {
    const refreshListData = async () => {
        if (kode_entitas !== null || kode_entitas !== '') {
            setShowLoader(true);
            try {
                let vKodeRelasi = 'all';
                let vNamaRelasi = 'all';
                let vTipe = 'all';
                let vLimit = '10000';

                if (noRegisterValue == null || noRegisterValue == '' || !isNoRegisterChecked) {
                    vKodeRelasi = 'all';
                } else {
                    vKodeRelasi = `${noRegisterValue}`;
                }
                if (namaRelasiValue == null || namaRelasiValue == '' || !isNamaRelasiChecked) {
                    vNamaRelasi = 'all';
                } else {
                    vNamaRelasi = `${namaRelasiValue}`;
                }
                if (tipeRelasiValue == null || tipeRelasiValue == '' || !isTipeRelasiChecked) {
                    vTipe = 'all';
                } else {
                    vTipe = `${tipeRelasiValue}`;
                }
                const response = await axios.get(`${apiUrl}/erp/master_daftar_relasi?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: vKodeRelasi,
                        param2: vNamaRelasi,
                        param3: vTipe,
                        paramLimit: vLimit,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responseData = response.data.data;

                setTimeout(() => {
                    setDSListData(responseData);
                }, 300);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        if (kode_entitas == null || kode_entitas == '') {
            withReactContent(swalDialog).fire({
                title: `<p style="font-size:12px">Sesi login telah habis, silahkan login kembali.</p>`,
                icon: 'error',
                width: '360px',
                heightAuto: true,
            });

            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        } else {
            setShowLoader(false);
        }
    };
    // refreshListData();
    // }, []);
    //visible panel sidebar
    const [panelVisible, setPanelVisible] = useState(true);
    const handleTogglePanel = () => {
        setPanelVisible(!panelVisible);
    };
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const handleFilterClick = () => {
        setPanelVisible(true);
    };
    // const mountedListData = useRef(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Relasi'));
        if (norelasi) {
            setMasterDataState('EDIT');
            setMasterKodeRelasi(norelasi as string);

            setDialogInputDataVisible(true);
        } else if (isRedirectFromSupp) {
            setMasterDataState('BARU');
            setDialogInputDataVisible(true);
        }
    }, []);
    // Panggil refreshListData saat nilai filter berubah

    const [filter, setFilter] = useState({
        no_register: 'all',
        nama_relasi: 'all',
        tipe_relasi: 'all',
    });
    useEffect(() => {
        refreshListData();
    }, [filter]);
    const handleFilterInput = (e: any) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value,
        });

        // Lakukan pengecekan checkbox berdasarkan nilai yang diinput
        const checkboxName = `${name}_checkbox`; // Anggaplah checkbox memiliki nama yang sama dengan input filter, ditambahkan dengan _checkbox
        const checkboxValue = value !== 'all'; // Jika nilai filter bukan 'all', checkbox akan dicek, jika tidak, tidak akan dicek
        const checkbox = document.getElementById(checkboxName) as HTMLInputElement | null;
        if (checkbox) {
            checkbox.checked = checkboxValue;
        }
    };
    // Handle Filter Input
    const handleNoRegisterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setNoRegisterValue(newValue);
        setIsNoRegisterChecked(newValue.length > 0);
    };
    const handleNamaRelasiInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setNamaRelasiValue(newValue);
        setIsNamaRelasiChecked(newValue.length > 0);
    };
    const handleTipeRelasiInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setTipeRelasiValue(newValue);
        setIsTipeRelasiChecked(newValue.length > 0);
    };
    //======= Fungsi menampilkan window/tab baru tanpa kena blok di Browser ========
    function bypassBlokBrowserWindow() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(true);
            }, 1000);
        });
    }

    //==========  Popup menu untuk header grid List Data ===========
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

    function menuHeaderSelect(args: MenuEventArgs) {
        if (args.item.text === 'Cetak ke printer') {
            gridListData.print();
        } else if (args.item.text === 'PDF') {
            gridListData.showSpinner();
            gridListData.pdfExport();
        } else if (args.item.text === 'XLSX') {
            gridListData.showSpinner();
            gridListData.excelExport();
        } else if (args.item.text === 'CSV') {
            gridListData.showSpinner();
            gridListData.csvExport();
        }
    }
    const ExportComplete = (): void => {
        gridListData.hideSpinner();
    };

    //======== Setting hint / tooltip untuk grid List Data ========
    let tooltipListData: Tooltip | any;
    const columnListData: Object = {
        'No. Register': 'Nomor Register Relasi',
        Nama: 'Nama Relasi',
        Personal: 'Kontak Personal',
        Produksi: 'Permintaan barang produksi',
        Batal: 'Outstanding PP yang dibatalkan',
        'No. Telepon': 'Nomor Telepon Relasin',
        'No. HP': 'Nomor HP Relasi',
        WhatsApp: 'Nomor WhatsApp Relasi',
        Provinsi: 'Provinsi Relasi',
        Kota: 'Kota Relasi',
        Kecamatan: 'Kecamatan Relasi',
        Kelurahan: 'Kelurahan Relasi',
    };
    const beforeRenderListData = (args: TooltipEventArgs) => {
        const description = (columnListData as any)[(args as any).target.innerText];
        if (description) {
            tooltipListData.content = description;
        }
    };
    //=============================================================
    //============== Inisialisasi modal dialog ====================
    const [dialogDetailDataVisible, setDialogDetailDataVisible] = useState(false);
    const [dialogInputDataVisible, setDialogInputDataVisible] = useState(false);
    //======================= State Data Master ====================
    const [masterDataState, setMasterDataState] = useState<string>('BARU');
    const [masterKodeRelasi, setMasterKodeRelasi] = useState<string>('BARU');
    const [detailKodeRelasi, setDetailKodeRelasi] = useState<string>('BARU');
    const rowIdxListData = useRef(0);
    const rowSelectingListData = (args: any) => {
        rowIdxListData.current = args.rowIndex;
        if (args.data != undefined) {
            if (dialogDetailDataVisible) {
                setDetailKodeRelasi(args.data.kode_relasi);
            }
        }
    };

    //================= Fungsi tombol utama List Data ==============
    const showPilihDokumen = () => {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px">Silahkan pilih data Relasi terlebih dahulu</p>',
            width: '100%',
        });
    };

    const showNewRecord = async () => {
        console.log('showNewRecord');
        setMasterDataState('BARU');
        setDialogInputDataVisible(true);
    };
    const showEditRecord = () => {
        selectedListData = gridListData.getSelectedRecords();
        console.log(selectedListData);

        if (selectedListData.length > 0) {
            console.log('showEditRecord: ' + selectedListData[0].kode_relasi);

            setMasterDataState('EDIT');
            setMasterKodeRelasi(selectedListData[0].kode_relasi);

            setDialogInputDataVisible(true);
        } else {
            showPilihDokumen();
        }
    };
    const showPreviewRecord = () => {
        selectedListData = gridListData.getSelectedRecords();
        if (selectedListData.length > 0) {
            console.log('showPreviewRecord: ' + selectedListData[0].kode_relasi);

            setMasterDataState('PREVIEW');
            setMasterKodeRelasi(selectedListData[0].kode_relasi);
            setDialogInputDataVisible(true);
        } else {
            showPilihDokumen();
        }
    };
    const showDetailRecord = () => {
        selectedListData = gridListData.getSelectedRecords();
        if (selectedListData.length > 0) {
            console.log('showDetailRecord: ' + selectedListData[0].kode_relasi);

            if (!dialogDetailDataVisible) {
                setDetailKodeRelasi(selectedListData[0].kode_pp);
                setDialogDetailDataVisible(true);
            }
        } else {
            showPilihDokumen();
        }
    };

    //============== Format cell pada grid List Data ===============
    const queryCellInfoListData = (args: any) => {
        if (args.column?.field === 'kota') {
            if (getValue('kota', args.data) == '') {
                args.cell.style.background = 'red';
            }
        }
    };

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    //================ Disable hari minggu di calendar ==============
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    return (
        <>
            <div className="Main" id="main-target">
                {/*==================================================================================================*/}
                {/*================================ Tampilan utama Permintaan Pembelian =============================*/}
                {/*==================================================================================================*/}
                <div>
                    {/* screen loader */}
                    {showLoader && contentLoader()}
                    <p className="set-font-18 mb-3">
                        <b>Daftar Relasi</b>
                    </p>
                    <div style={{ minHeight: '40px' }} className="mb-4 flex flex-col justify-between md:flex-row">
                        <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
                            <TooltipComponent content="Daftarkan Relasi baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                                <TooltipComponent content="Edit data relasi" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                    {/* <TooltipComponent content="Hapus data relasi" opensOn="Hover" openDelay={1000} target="#btnHapus"> */}
                                    <TooltipComponent content="Tampilkan detail Relasi" opensOn="Hover" openDelay={1000} target="#btnDetail">
                                        <div className="flex flex-col md:flex-row">
                                            <button id="btnBaru" disabled={disabledBaru} type="submit" className="btn btn-primary mb-2 md:mb-0 md:mr-2" onClick={showNewRecord}>
                                                Baru
                                            </button>
                                            {/* Component Modal Tambah Data Relasi */}
                                            <button id="btnEdit" onClick={() => showEditRecord()} type="submit" className="btn btn-primary mb-2 md:mb-0 md:mr-2">
                                                Ubah
                                            </button>
                                            <button
                                                id="btnFilter"
                                                type="submit"
                                                className={`btn btn-primary mb-2 md:mb-0 md:mr-2 ${panelVisible ? 'pointer-events-none opacity-50' : ''}`}
                                                onClick={handleFilterClick}
                                            >
                                                Filter
                                            </button>
                                            {/* Component Modal Edit Data Relasi */}
                                            {/* <button id="btnHapus" type="submit" className="btn btn-danger mb-2 md:mb-0 md:mr-2">
                                                    Hapus
                                                </button> */}
                                        </div>
                                    </TooltipComponent>
                                    {/* </TooltipComponent> */}
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </div>
                </div>
                <div className="relative flex h-full gap-3 sm:h-[calc(100vh_-_90%)]">
                    {showLoader && contentLoader()}
                    {panelVisible && (
                        <div
                            className={`panel absolute z-10 hidden h-full w-[300px] max-w-full flex-none space-y-4  p-4 dark:border-[#191e3a] xl:relative xl:block xl:h-auto ltr:rounded-r-none ltr:xl:rounded-r-md rtl:rounded-l-none rtl:xl:rounded-l-md ${
                                isShowTaskMenu && '!block'
                            }`}
                            style={{ background: '#dedede' }}
                        >
                            <div className="flex h-full flex-col pb-16">
                                <div className="pb-5">
                                    <div className="flex items-center text-center">
                                        <button className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900" onClick={handleTogglePanel}>
                                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                        </button>
                                        <div className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                {/* prettier-ignore */}
                                                <path
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                d="M22 5.814v.69c0 1.038 0 1.557-.26 1.987-.26.43-.733.697-1.682 1.231l-2.913 1.64c-.636.358-.955.538-1.182.735a2.68 2.68 0 00-.9 1.49c-.063.285-.063.619-.063 1.286v2.67c0 1.909 0 2.863-.668 3.281-.668.418-1.607.05-3.486-.684-.895-.35-1.342-.524-1.594-.879C9 18.907 9 18.451 9 17.542v-2.67c0-.666 0-1-.064-1.285a2.68 2.68 0 00-.898-1.49c-.228-.197-.547-.377-1.183-.735l-2.913-1.64c-.949-.534-1.423-.8-1.682-1.23C2 8.06 2 7.541 2 6.503v-.69"
                                            ></path>
                                                <path
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    d="M22 5.815c0-1.327 0-1.99-.44-2.403C21.122 3 20.415 3 19 3H5c-1.414 0-2.121 0-2.56.412C2 3.824 2 4.488 2 5.815"
                                                    opacity="0.5"
                                                ></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Filtering Data</h3>
                                    </div>
                                </div>
                                <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                                <PerfectScrollbar className="growltr:-mr3.5 ltr:pr3.5 relative h-full rtl:-ml-3.5 rtl:pl-3.5">
                                    <form className="flex h-full flex-col gap-6">
                                        <div>
                                            <label className="mt-3 flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    name="no_register"
                                                    className="form-checkbox"
                                                    checked={isNoRegisterChecked}
                                                    onChange={() => setIsNoRegisterChecked(!isNoRegisterChecked)}
                                                />
                                                <span>No. Register</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="--- No. Register ---"
                                                className="form-input"
                                                name="no_register"
                                                value={noRegisterValue}
                                                onChange={handleNoRegisterInputChange}
                                            />
                                            <label className="mt-3 flex cursor-pointer items-center">
                                                <input
                                                    placeholder=""
                                                    type="checkbox"
                                                    className="form-checkbox"
                                                    checked={isNamaRelasiChecked}
                                                    onChange={() => setIsNamaRelasiChecked(!isNamaRelasiChecked)}
                                                />
                                                <span>Nama Relasi</span>
                                            </label>
                                            <input type="text" placeholder="--- Nama Relasi ---" className="form-input" value={namaRelasiValue} onChange={handleNamaRelasiInputChange} />
                                            <label className="mt-3 flex cursor-pointer items-center">
                                                <input type="checkbox" className="form-checkbox" checked={isTipeRelasiChecked} onChange={() => setIsTipeRelasiChecked(!isTipeRelasiChecked)} />
                                                <span>Tipe</span>
                                            </label>
                                            <select
                                                id="tipeRelasi"
                                                className="form-select"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    handleTipeRelasiInputChange(e);
                                                    setTipeRelasiValue(e.target.value);
                                                }}
                                                value={tipeRelasiValue}
                                            >
                                                <option value="" disabled>
                                                    {'-- Silahkan Pilih Data--'}
                                                </option>
                                                <option value="Perorangan">Perorangan</option>
                                                <option value="Badan Hukum">Badan Hukum</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    refreshListData();
                                                }}
                                                className="btn btn-primary mt-2"
                                            >
                                                <FontAwesomeIcon icon={faArrowsRotate} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                Refresh Data
                                            </button>
                                        </div>
                                    </form>
                                </PerfectScrollbar>
                            </div>
                        </div>
                    )}
                    <div
                        className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${isShowTaskMenu && '!block xl:!hidden'}`}
                        onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
                    ></div>
                    <div className="h-full flex-1 overflow-auto">
                        <div className="cursor flex items-center ltr:mr-3 rtl:ml-3">
                            <button type="button" className="block hover:text-primary xl:hidden ltr:mr-3 rtl:ml-3" onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        {showLoader && contentLoader()}
                        <div className="panel-data overflow-hidden" style={{ background: '#dedede', width: '100%' }}>
                            <TooltipComponent opensOn="Hover" openDelay={1000} beforeRender={beforeRenderListData} target=".e-headertext" ref={(t) => (tooltipListData = t)}>
                                <GridComponent
                                    id="gridListData"
                                    ref={(g) => (gridListData = g)}
                                    locale="id"
                                    dataSource={dsListData}
                                    allowExcelExport={true}
                                    excelExportComplete={ExportComplete}
                                    allowPdfExport={true}
                                    pdfExportComplete={ExportComplete}
                                    editSettings={{ allowDeleting: true }}
                                    selectionSettings={{
                                        mode: 'Row',
                                        type: 'Single',
                                    }}
                                    allowPaging={true}
                                    allowSorting={true}
                                    // allowGrouping={true}
                                    allowFiltering={false}
                                    allowResizing={true}
                                    autoFit={true}
                                    allowReordering={true}
                                    pageSettings={{
                                        pageSize: 25,
                                        pageCount: 5,
                                        pageSizes: ['25', '50', '100', 'All'],
                                    }}
                                    rowHeight={22}
                                    height={370}
                                    gridLines={'Both'}
                                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                                    queryCellInfo={queryCellInfoListData}
                                    rowSelecting={rowSelectingListData}
                                    dataBound={() => {
                                        //Selecting row after the refresh Complete
                                        if (gridListData) {
                                            gridListData.selectRow(rowIdxListData.current);
                                        }
                                    }}
                                    recordDoubleClick={(args: any) => {
                                        if (gridListData) {
                                            const rowIndex: number = args.row.rowIndex;
                                            gridListData.selectRow(rowIndex);
                                            showEditRecord();
                                        }
                                    }}
                                >
                                    <ColumnsDirective>
                                        <ColumnDirective
                                            field="kode_relasi"
                                            headerText="No. Register"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="110"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="nama_relasi"
                                            headerText="Nama"
                                            headerTextAlign="Center"
                                            textAlign="Left"
                                            // autoFit
                                            width="250"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="telp"
                                            headerText="Telepon"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="80"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="hp"
                                            headerText="No. Hp"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="80"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="hp2"
                                            headerText="WhatsApp"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="80"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="propinsi"
                                            headerText="Provinsi"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="100"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="kota"
                                            headerText="Kota"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="100"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="kecamatan"
                                            headerText="Kecamatan"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="100"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                        <ColumnDirective
                                            field="kelurahan"
                                            headerText="Kelurahan"
                                            headerTextAlign="Center"
                                            textAlign="Center"
                                            // autoFit
                                            width="100"
                                            clipMode="EllipsisWithTooltip"
                                        />
                                    </ColumnsDirective>
                                    <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                </GridComponent>
                            </TooltipComponent>
                            {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                            <ContextMenuComponent
                                id="contextmenu"
                                target=".e-gridheader"
                                items={menuHeaderItems}
                                select={menuHeaderSelect}
                                animationSettings={{
                                    duration: 800,
                                    effect: 'FadeIn',
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/*==================================================================================================*/}
                <DialogRelasi
                    token={token}
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeRelasi={masterKodeRelasi}
                    masterDataState={masterDataState}
                    isOpen={dialogInputDataVisible}
                    onClose={() => {
                        setDialogInputDataVisible(false);
                    }}
                    onRefresh={refreshListData}
                />
            </div>
        </>
    );
};
export default RelasiList;
