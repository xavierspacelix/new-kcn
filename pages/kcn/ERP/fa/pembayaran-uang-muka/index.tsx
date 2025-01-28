import React, { Fragment, useEffect, useRef, useState } from 'react';

// Syncfusion
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
    ExcelExport,
    PdfExport,
    CommandColumn,
} from '@syncfusion/ej2-react-grids';
import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { FocusInEventArgs, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';

// Others
import { useSession } from '@/pages/api/sessionContext';
import swal from 'sweetalert2';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import styles from './index.module.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Tab } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import DialogFrmDp from './components/DialogFrmDp';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
import { usersMenu } from '@/utils/routines';

L10n.load(idIDLocalization);
enableRipple(true);

// Styling
const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
const styleButtonApproval = { width: 110 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
const styleButtonPembatalan = { width: 130 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
const styleButtonUpdate = { width: 150 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
const styleButtonDisabled = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };
const styleButtonApprovalDisabled = { width: 110 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };

const swalToast = swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
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

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

const juBayarCheckbox = (args: any) => {
    let bgColor;
    if (args.status_dok === 'Tolak') {
        bgColor = '#E4080A';
    } else if (args.status_dok === 'Batal') {
        bgColor = '#FEFE00';
    } else if (args.status_dok === 'Lunas') {
        bgColor = '#63D734';
    }
    return <input style={{ backgroundColor: bgColor }} type="checkbox" checked={args.ju_bayar === 'Y' ? true : false} readOnly />;
};

const juPhuCheckbox = (args: any) => {
    let bgColor;
    if (args.status_dok === 'Tolak') {
        bgColor = '#E4080A';
    } else if (args.status_dok === 'Batal') {
        bgColor = '#FEFE00';
    } else if (args.status_dok === 'Lunas') {
        bgColor = '#63D734';
    }
    return <input style={{ backgroundColor: bgColor }} type="checkbox" checked={args.ju_phu === 'Y' ? true : false} readOnly />;
};

const PembayaranUangMuka = () => {
    // Sessions
    const { sessionData, isLoading } = useSession();

    const entitas_user = sessionData?.entitas ?? '';

    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }

    // State Baru Untuk UM
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '' });
    const [userApp, setUserApp] = useState('');
    const [aksesBayarUm, setAksesBayarUm] = useState('');
    const kode_menu = '60207'; // kode menu UM

    //   Global State Management
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
    const [panelVisible, setPanelVisible] = useState(true);
    const [searchNoUm, setSearchNoUm] = useState('');
    const [searchKeterangan, setSearchKeterangan] = useState('');
    const [statusPage, setStatusPage] = useState('');
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [showModalCreate, setShowModalCreate] = useState(false);

    //   Filter State Management
    const [filterData, setFilterData] = useState({
        // FILTER TANGGAL
        tglAwal: moment(),
        tglAkhir: moment().endOf('month'),
        isTglChecked: true,

        // OTHER FILTER
        noDokumenValue: '',
        isNoDokumenChecked: false,
        supplierValue: '',
        isSupplierChecked: false,
        noKontrakValue: '',
        isNoKontrakChecked: false,
        lunas: 'Belum Lunas',
        statusApproval: 'Semua',
        sisaDp: 'Semua',
    });

    const updateStateFilter = (field: any, value: any) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Refs
    const noDokumenRef = useRef<HTMLInputElement>(null);
    const keteranganRef = useRef<HTMLInputElement>(null);
    const gridListData = useRef<GridComponent>(null);

    // Handle Filter
    const handleTogglePanel = () => {
        setPanelVisible(!panelVisible);
    };

    const handleFilterClick = () => {
        setPanelVisible(true);
    };

    // Handle Selected Row
    const handleRowSelected = (args: any) => {
        setSelectedRow(args.data);
    };

    // Handle Search
    const handleSearchNoUm = (e: any) => {
        setSearchNoUm(e.target.value);

        let temp: any = data.filter((item: any) => item.no_um.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredData(temp);

        return noDokumenRef?.current?.focus();
    };

    const handleChangeSearchKeterangan = (e: any) => {
        setSearchKeterangan(e.target.value);
        let temp = data.filter((item: any) => item.nama_relasi.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredData(temp);

        return keteranganRef?.current?.focus();
    };

    const handleClearSearchNoUm = () => {
        setSearchNoUm('');
        fetchData();
    };

    const handleClearSearchKeterangan = () => {
        setSearchKeterangan('');
        fetchData();
    };

    // Handle Navigate Link
    const handleNavigateLink = (jenis: any) => {
        setShowModalCreate(false);
        if (jenis === 'edit') {
            if (selectedRow) {
                setStatusPage('EDIT');
                setShowModalCreate(true);
            } else {
                swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else if (jenis === 'create') {
            setStatusPage('CREATE');
            setShowModalCreate(true);
        } else if (jenis === 'approval') {
            if (selectedRow) {
                setStatusPage('APPROVAL');
                setShowModalCreate(true);
            } else {
                swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else if (jenis === 'pembayaran') {
            if (selectedRow) {
                setStatusPage('PEMBAYARAN');
                setShowModalCreate(true);
            } else {
                swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else {
            swal.fire({
                title: 'Warning',
                text: 'Silahkan pilih data terlebih dahulu.',
                icon: 'warning',
            });
        }
    };

    // APPROVAL
    const handleApproval = async () => {
        const status_dok = selectedRow.status_dok;
        const condition = status_dok !== 'Lunas' || status_dok !== 'Disetujui' || status_dok !== 'Tolak' || status_dok !== 'Belum Lunas' || status_dok !== 'Proses';

        if (selectedRow.ju_approve === 'Y') {
            swal.fire({
                icon: 'warning',
                text: 'Data sudah di Approve.',
            });
        } else if (condition) {
            handleNavigateLink('approval');
        } else {
            swal.fire({
                icon: 'warning',
                text: 'Data tidak dapat di Approve, pastikan status dokumen dan hak akses approval sesuai levelnya.',
            });
        }
    };

    // PEMBATALAN
    const handlePembatalan = async () => {
        const response = await axios.get(`${apiUrl}/erp/master_detail_pembayaran_uang_muka`, {
            params: {
                entitas: kode_entitas,
                param1: selectedRow.kode_um,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { master, detail } = response.data.data;

        const status_dok = selectedRow.status_dok;
        const condition = status_dok === 'Baru' || status_dok === 'Tolak' || status_dok === 'Proses' || userid.toLowerCase() === 'administrator';

        if (status_dok === 'Batal') {
            swal.fire({
                icon: 'warning',
                text: 'Pembayaran tidak dapat dilakukan, data sudah di batalkan.',
            });
            return;
        }

        if (!condition) {
            swal.fire({
                icon: 'warning',
                text: 'Pembatalan tidak dapat dilakukan, pastikan status dokumen dan hak akses approval sesuai levelnya.',
                backdrop: true,
                showConfirmButton: false,
                timer: 1500,
            });

            return;
        }

        swal.fire({
            icon: 'question',
            html: `
      <div className="flex flex-col gap-2 !pr-0">
      <strong class="text-lg mb-4">Batalkan Dokumen Uang Muka</strong>
        <p>No. UM : ${selectedRow.no_um}</p>
        <p>Tanggal : ${selectedRow.tgl_dok}</p>
      </div>
      `,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            backdrop: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const reqBody = {
                    ...master,
                    detail: detail,
                    status_dok: 'Batal',
                    lunas_rp: 0,
                    no_ju_approve: '',
                    entitas: kode_entitas,
                };

                const responseAPI = await axios.patch(`${apiUrl}/erp/update_pembayaran_uang_muka`, reqBody, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (responseAPI && responseAPI.data.status) {
                    swal.fire({
                        icon: 'success',
                        text: 'Data berhasil dibatalkan.',
                        showConfirmButton: false,
                        timer: 1500,
                    });

                    fetchData();
                } else {
                    swal.fire({
                        icon: 'error',
                        text: 'Data gagal dibatalkan.',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        });
    };

    // Pembayaran
    const handlePembayaran = async () => {
        const status_dok = selectedRow.status_dok;
        const condition = status_dok !== 'Lunas' || status_dok !== 'Baru' || status_dok !== 'Tolak';

        if (status_dok === 'Batal') {
            swal.fire({
                icon: 'warning',
                text: 'Pembayaran tidak dapat dilakukan, data sudah di batalkan.',
            });
            return;
        }

        if (selectedRow.ju_approve !== 'Y') {
            swal.fire({
                icon: 'warning',
                text: 'Pembayaran tidak dapat dilakukan, data belum di approve.',
            });
            return;
        }

        if (condition) {
            handleNavigateLink('pembayaran');
        } else {
            swal.fire({
                icon: 'warning',
                text: 'Pembayaran tidak dapat dilakukan, pastikan status dokumen dan hak akses approval sesuai levelnya.',
            });
        }
    };

    // Grid configuration
    const gridOptions = {
        /**
         * page settings menyebabkan refresh terjadi ketika row selected.
         * jadi boleh dikomen untuk mencegah refresh ketika row selected.
         */
        pageSettings: {
            pageSize: 25,
            pageCount: 5,
            pageSizes: ['25', '50', '100', 'All'],
        },
        selectionSettings: {
            mode: 'Row',
            type: 'Single',
        },
        allowPaging: true,
        allowSorting: true,
        allowFiltering: false,
        allowResizing: true,
        autoFit: true,
        allowReordering: true,
        rowHeight: 22,
        height: '100%',
        gridLines: 'Both',
        // loadingIndicator: { indicatorType: 'Shimmer' },
    };

    // ====== FETCHING DATA =======
    const fetchData = async () => {
        const params: any = {
            entitas: kode_entitas,
            param1: filterData.isTglChecked ? filterData.tglAwal.format('YYYY-MM-DD') : 'all',
            param2: filterData.isTglChecked ? filterData.tglAkhir.format('YYYY-MM-DD') : 'all',
            param3: filterData.isNoDokumenChecked ? filterData.noDokumenValue : 'all',
            param4: filterData.isSupplierChecked ? filterData.supplierValue : 'all',
            param5: filterData.isNoKontrakChecked ? filterData.noKontrakValue : 'all',
            param6: filterData.lunas === 'Semua' ? 'all' : filterData.lunas,
            param7: filterData.statusApproval === 'Disetujui' ? 'Y' : filterData.statusApproval === 'Koreksi' ? 'K' : filterData.statusApproval === 'Belum Disetujui' ? 'N' : 'all',
            param8: filterData.sisaDp === 'Semua' ? 'all' : filterData.sisaDp,
        };

        try {
            const response = await axios.get(`${apiUrl}/erp/list_pembayaran_uang_muka`, {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });

            const modifiedData = response.data.data.map((item: any) => ({
                ...item,
                tgl_dok: moment(item.tgl_dok).format('DD-MM-YYYY'),
            }));

            setData(modifiedData);
            gridListData.current?.setProperties({ dataSource: modifiedData });
            gridListData.current?.refresh();
        } catch (error) {
            console.error('Error Fetching List: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch Akses User
    useEffect(() => {
        const fetchUserMenu = async () => {
            await usersMenu(kode_entitas, userid, kode_menu)
                .then((res) => {
                    const { baru, edit, hapus, cetak } = res;
                    setUserMenu((prevState) => ({
                        ...prevState,
                        baru,
                        edit,
                        hapus,
                        cetak,
                    }));
                })
                .catch((err) => {
                    console.error('Error: ', err);
                });
        };

        const fetchUserApp = async () => {
            await axios
                .get(`${apiUrl}/erp/users_app`, {
                    params: { entitas: kode_entitas, param1: userid },
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setUserApp(res.data.data[0].app_um);
                    setAksesBayarUm(res.data.data[0].akses_byr_um);
                })
                .catch((err) => {
                    console.log('Error fetching user app: ', err);
                });
        };

        fetchUserMenu();
        fetchUserApp();
    }, []);

    return (
        <div className="Main h-[75vh]" id="main-target">
            {/* === Search Group & Button Group === */}
            <div style={{ minHeight: '40px' }} className="mb-4 flex flex-col items-center justify-between md:flex-row">
                <div className="gap-2 sm:flex">
                    {/*=== Button Group ===*/}
                    <div className="flex flex-col pr-1 sm:border-r md:flex-row">
                        <ButtonComponent
                            id="btnDataBaru"
                            cssClass="e-primary e-small"
                            content="Baru"
                            style={userMenu.baru === 'Y' || userid.toLowerCase() === 'administrator' ? { ...styleButton } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                            disabled={userMenu.baru === 'Y' || userid.toLowerCase() === 'administrator' ? false : true}
                            onClick={() => handleNavigateLink('create')}
                        />
                        <ButtonComponent
                            id="btnDataUbah"
                            cssClass="e-primary e-small"
                            content="Ubah"
                            disabled={userMenu.edit === 'Y' || userid.toLowerCase() === 'administrator' ? false : true}
                            style={userMenu.edit === 'Y' || userid.toLowerCase() === 'administrator' ? { ...styleButton } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                            onClick={() => {
                                if (selectedRow.ju_approve === 'Y') {
                                    swal.fire({
                                        icon: 'warning',
                                        text: 'Data sudah di Approve.',
                                    });
                                    return;
                                }
                                handleNavigateLink('edit');
                            }}
                        />
                        <ButtonComponent
                            id="btnFilter"
                            cssClass="e-primary e-small"
                            style={
                                panelVisible
                                    ? {
                                          width: '57px',
                                          height: '28px',
                                          marginBottom: '0.5em',
                                          marginTop: '0.5em',
                                          marginRight: '0.8em',
                                      }
                                    : { ...styleButton, color: 'white' }
                            }
                            onClick={handleFilterClick}
                            disabled={panelVisible}
                            content="Filter"
                        />

                        <ButtonComponent
                            id="btnApproval"
                            cssClass="e-primary e-small"
                            style={userApp === 'Y' || userid.toLowerCase() === 'administrator' ? { ...styleButtonApproval } : { ...styleButtonApprovalDisabled, color: '#1c1b1f61' }}
                            disabled={userid.toLowerCase() === 'administrator' || userApp === 'Y' ? false : true}
                            content="Approval"
                            onClick={handleApproval}
                        />

                        <ButtonComponent
                            id="btnPembatalanFpac"
                            cssClass="e-primary e-small"
                            style={styleButtonPembatalan}
                            // disabled={disabledEdit}
                            content="Pembatalan"
                            onClick={handlePembatalan}
                        />

                        <ButtonComponent
                            id="btnPembayaran"
                            cssClass="e-primary e-small"
                            style={
                                userApp === 'Y' || aksesBayarUm === 'Y' || userid.toLowerCase() === 'administrator'
                                    ? { ...styleButtonApproval }
                                    : { ...styleButtonApprovalDisabled, color: '#1c1b1f61' }
                            }
                            disabled={userApp === 'Y' || userid.toLowerCase() === 'administrator' || aksesBayarUm === 'Y' ? false : true}
                            content="Pembayaran"
                            onClick={handlePembayaran}
                        />
                    </div>

                    {/*=== Search Group ===*/}
                    <div className="ml-1 flex max-w-xl items-center gap-3">
                        {/* Search No Dokumen */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="searchNoDokumen"
                                className="mb-1 w-full rounded-lg border border-gray-300 bg-white p-3 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="< No. Dokumen >"
                                style={{ height: '4vh' }}
                                value={searchNoUm}
                                ref={noDokumenRef}
                                onChange={handleSearchNoUm}
                            />
                            {searchNoUm && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                                    onClick={handleClearSearchNoUm}
                                >
                                    &times;
                                </button>
                            )}
                        </div>

                        {/* Search Keterangan */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                id="searchKeterangan"
                                className="mb-1 w-full rounded-lg border border-gray-300 bg-white p-3 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="< Nama Supplier >"
                                style={{ height: '4vh' }}
                                value={searchKeterangan}
                                ref={keteranganRef}
                                onChange={handleChangeSearchKeterangan}
                            />
                            {searchKeterangan && (
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                                    onClick={handleClearSearchKeterangan}
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="ml-3 mr-1" style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                        Pembayaran Uang Muka
                    </span>
                </div>
            </div>

            {/* === Filter & Table === */}
            <div className="relative flex h-[calc(100vh-230px)] gap-3">
                {/* Filter */}
                {panelVisible && (
                    <div
                        className={`panel absolute z-10 hidden h-full w-[300px] max-w-full flex-none space-y-4 p-4 dark:border-[#191e3a] xl:relative xl:block xl:h-auto ltr:rounded-r-none ltr:xl:rounded-r-md rtl:rounded-l-none rtl:xl:rounded-l-md ${
                            isShowTaskMenu && '!block'
                        }`}
                        style={{ background: '#dedede' }}
                    >
                        <div className="flex h-full flex-col pb-3">
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
                                            />
                                            <path
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                d="M22 5.815c0-1.327 0-1.99-.44-2.403C21.122 3 20.415 3 19 3H5c-1.414 0-2.121 0-2.56.412C2 3.824 2 4.488 2 5.815"
                                                opacity="0.5"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Filtering Data</h3>
                                </div>
                            </div>

                            <div className="mb-1 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>

                            <PerfectScrollbar className="growltr:-mr3.5 ltr:pr3.5 relative h-full rtl:-ml-3.5 rtl:pl-3.5">
                                <div className="flex h-full flex-col gap-6 overflow-auto">
                                    {/* Filter List */}
                                    <div>
                                        {/* // TANGGAL DOKUMEN // */}
                                        <div className="mt-2 flex justify-between">
                                            <CheckBoxComponent
                                                label="Tanggal"
                                                checked={filterData.isTglChecked}
                                                change={(args: ChangeEventArgsButton) => {
                                                    const value: any = args.checked;
                                                    updateStateFilter('isTglChecked', value);
                                                }}
                                            />
                                        </div>

                                        <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                            <div className="form-input mt-1 flex justify-between">
                                                <DatePickerComponent
                                                    locale="id"
                                                    style={{ fontSize: '12px' }}
                                                    cssClass="e-custom-style"
                                                    //   renderDayCell={onRenderDayCell}
                                                    enableMask={true}
                                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                    showClearButton={false}
                                                    format="dd-MM-yyyy"
                                                    value={filterData.tglAwal.toDate()}
                                                    change={(args: ChangeEventArgsCalendar) => {
                                                        // HandleTgl(moment(args.value), 'tanggalAwal', setDate1, setDate2, setIsDateRangeChecked);
                                                        updateStateFilter('tglAwal', moment(args.value));
                                                        updateStateFilter('isTglChecked', true);
                                                    }}
                                                >
                                                    <Inject services={[MaskedDateTime]} />
                                                </DatePickerComponent>
                                            </div>
                                            <p className="set-font-9 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
                                            <div className="form-input mt-1 flex justify-between">
                                                <DatePickerComponent
                                                    locale="id"
                                                    style={{ fontSize: '12px' }}
                                                    cssClass="e-custom-style"
                                                    //   renderDayCell={onRenderDayCell}
                                                    enableMask={true}
                                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                    showClearButton={false}
                                                    format="dd-MM-yyyy"
                                                    value={filterData.tglAkhir.toDate()}
                                                    change={(args: ChangeEventArgsCalendar) => {
                                                        updateStateFilter('tglAkhir', moment(args.value));
                                                        updateStateFilter('isTglChecked', true);
                                                    }}
                                                >
                                                    <Inject services={[MaskedDateTime]} />
                                                </DatePickerComponent>
                                            </div>
                                        </div>

                                        {/* No Dokumen */}
                                        <div className="mt-2 flex">
                                            <CheckBoxComponent
                                                label="No. Dokumen"
                                                checked={filterData.isNoDokumenChecked}
                                                change={(args: ChangeEventArgsButton) => {
                                                    const value: any = args.checked;
                                                    updateStateFilter('isNoDokumenChecked', value);
                                                }}
                                                style={{ borderRadius: 3, borderColor: 'gray' }}
                                            />
                                        </div>
                                        <div className="mt-1 flex justify-between">
                                            <div className="container form-input">
                                                <TextBoxComponent
                                                    placeholder=""
                                                    value={filterData.noDokumenValue}
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        updateStateFilter('noDokumenValue', value);
                                                        updateStateFilter('isNoDokumenChecked', value.length > 0);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Supplier */}
                                        <div className="mt-2 flex">
                                            <CheckBoxComponent
                                                label="Supplier"
                                                checked={filterData.isSupplierChecked}
                                                change={(args: ChangeEventArgsButton) => {
                                                    const value: any = args.checked;
                                                    updateStateFilter('isSupplierChecked', value);
                                                }}
                                                style={{ borderRadius: 3, borderColor: 'gray' }}
                                            />
                                        </div>
                                        <div className="mt-1 flex justify-between">
                                            <div className="container form-input">
                                                <TextBoxComponent
                                                    placeholder=""
                                                    value={filterData.supplierValue}
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        updateStateFilter('supplierValue', value);
                                                        updateStateFilter('isSupplierChecked', value.length > 0);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* No Kontrak */}
                                        <div className="mt-2 flex">
                                            <CheckBoxComponent
                                                label="No Kontrak"
                                                checked={filterData.isNoKontrakChecked}
                                                change={(args: ChangeEventArgsButton) => {
                                                    const value: any = args.checked;
                                                    updateStateFilter('isNoKontrakChecked', value);
                                                }}
                                                style={{ borderRadius: 3, borderColor: 'gray' }}
                                            />
                                        </div>
                                        <div className="mt-1 flex justify-between">
                                            <div className="container form-input">
                                                <TextBoxComponent
                                                    placeholder=""
                                                    value={filterData.noKontrakValue}
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        updateStateFilter('noKontrakValue', value);
                                                        updateStateFilter('isNoKontrakChecked', value.length > 0);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Status Lunas */}
                                        <div>
                                            <div className="mt-3 font-bold">
                                                <span>Lunas</span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2">
                                                {['Lunas', 'Belum Lunas', 'Semua'].map((option) => (
                                                    <label key={option} className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="lunas"
                                                            value={option}
                                                            checked={filterData.lunas === option}
                                                            onChange={(e) => updateStateFilter('lunas', e.currentTarget.value)}
                                                            className="form-radio"
                                                        />
                                                        <span className="ml-1">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Approval */}
                                        <div>
                                            <div className="mt-3 font-bold">
                                                <span>Lunas</span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2">
                                                {['Disetujui', 'Belum Disetujui', 'Koreksi', 'Semua'].map((option) => (
                                                    <label key={option} className="inline-flex flex-wrap items-center">
                                                        <input
                                                            type="radio"
                                                            name="statusApproval"
                                                            value={option}
                                                            checked={filterData.statusApproval === option}
                                                            onChange={(e) => updateStateFilter('statusApproval', e.currentTarget.value)}
                                                            className="form-radio"
                                                        />
                                                        <span className="ml-1">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Sisa DP */}
                                        <div>
                                            <div className="mt-3 font-bold">
                                                <span>Sisa Uang Muka</span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-2">
                                                {['Sisa', 'Tidak', 'Semua'].map((option) => (
                                                    <label key={option} className="inline-flex flex-wrap items-center">
                                                        <input
                                                            type="radio"
                                                            name="sisaDp"
                                                            value={option}
                                                            checked={filterData.sisaDp === option}
                                                            onChange={(e) => updateStateFilter('sisaDp', e.currentTarget.value)}
                                                            className="form-radio"
                                                        />
                                                        <span className="ml-1">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Refresh Button */}
                                    <div className="flex justify-center">
                                        <button type="button" onClick={fetchData} className="btn btn-primary mt-2">
                                            <FontAwesomeIcon icon={faArrowsRotate} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Refresh Data
                                        </button>
                                    </div>
                                </div>
                            </PerfectScrollbar>
                        </div>
                    </div>
                )}

                <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 `} onClick={() => setIsShowTaskMenu(isShowTaskMenu)}></div>

                {/* Table */}
                <div className="h-full flex-1 overflow-auto">
                    <Tab.Group defaultIndex={0}>
                        <Tab.List className="flex gap-2">
                            <Tab as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        // onClick={() => setSelectedTab(0)}
                                        className={`${
                                            selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'
                                        } -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                    >
                                        1. Uang Muka
                                    </button>
                                )}
                            </Tab>
                        </Tab.List>
                        <Tab.Panels className="h-[calc(100%_-_40px)]">
                            <GridComponent
                                {...gridOptions}
                                ref={gridListData}
                                dataSource={searchKeterangan !== '' || searchNoUm !== '' ? filteredData : data}
                                rowSelected={handleRowSelected}
                                recordDoubleClick={(args: any) => {
                                    handleNavigateLink('edit');
                                }}
                                locale="id"
                                queryCellInfo={(args) => {
                                    if (args.data.status_dok === 'Tolak') {
                                        args.cell.style.backgroundColor = '#E4080A';
                                    } else if (args.data.status_dok === 'Batal') {
                                        args.cell.style.backgroundColor = '#FEFE00';
                                    } else if (args.data.status_dok === 'Lunas') {
                                        args.cell.style.backgroundColor = '#63D734';
                                    }
                                }}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="tgl_dok"
                                        headerText="Tanggal"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="90"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="no_um"
                                        headerText="No. Dokumen"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="150"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="nama_relasi"
                                        headerText="Supplier"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        // width="230"
                                        autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="no_kontrak"
                                        headerText="No. Kontrak"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="140"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="total_rp"
                                        headerText="Total Uang Muka (Rp.)"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        width="150"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                        template={(props: any) => {
                                            return <span>{props.total_rp ? parseFloat(props.total_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />
                                    <ColumnDirective
                                        field="userid"
                                        headerText="PIC Buat"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="120"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="status_app"
                                        headerText="Approval"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="150"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="status_dok"
                                        headerText="Status Dokumen"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="150"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="sudah_dibayar_rp"
                                        headerText="Sudah Dibayar (Rp.)"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        width="120"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                        template={(props: any) => {
                                            return <span>{props.sudah_dibayar_rp ? parseFloat(props.sudah_dibayar_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />
                                    <ColumnDirective
                                        field="belum_dibayar_rp"
                                        headerText="Belum Dibayar (Rp.)"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        width="120"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                        template={(props: any) => {
                                            return <span>{props.belum_dibayar_rp ? parseFloat(props.belum_dibayar_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />
                                    <ColumnDirective
                                        field="sudah_diambil_rp"
                                        headerText="Sudah Diambil (Rp.)"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        width="120"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                        template={(props: any) => {
                                            return <span>{props.sudah_diambil_rp ? parseFloat(props.sudah_diambil_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />
                                    <ColumnDirective
                                        field="sisa_rp"
                                        headerText="Sisa Uang Muka Supplier (Rp.)"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        width="120"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                        template={(props: any) => {
                                            return <span>{props.sisa_rp ? parseFloat(props.sisa_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />
                                    <ColumnDirective
                                        field="ju_approve"
                                        headerText="JU Approved"
                                        headerTextAlign="Center"
                                        textAlign="Center"
                                        width="80"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                        template={(props: any) => {
                                            return <input type="checkbox" checked={props.ju_approve === 'Y' ? true : false} readOnly />;
                                        }}
                                    />
                                    <ColumnDirective
                                        field="no_ju_approve"
                                        headerText="No. JU (Approved)"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        width="120"
                                        // autoFit
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        columns={[
                                            {
                                                field: 'ju_bayar',
                                                headerText: 'JU Bayar',
                                                headerTextAlign: 'Center',
                                                textAlign: 'Center',
                                                width: '80',
                                                clipMode: 'EllipsisWithTooltip',
                                                template: juBayarCheckbox,
                                            },
                                            { field: 'no_ju_bayar', headerText: 'No. JU (Bayar)', headerTextAlign: 'Left', textAlign: 'Center', width: '120', clipMode: 'EllipsisWithTooltip' },
                                            {
                                                field: 'ju_phu',
                                                headerText: 'JU PHU',
                                                headerTextAlign: 'Center',
                                                textAlign: 'Center',
                                                width: '80',
                                                clipMode: 'EllipsisWithTooltip',
                                                template: juPhuCheckbox,
                                            },
                                            { field: 'no_ju_phu', headerText: 'No. JU (PHU)', headerTextAlign: 'Center', textAlign: 'Left', width: '120', clipMode: 'EllipsisWithTooltip' },
                                        ]}
                                        headerTextAlign="Center"
                                        textAlign="Center"
                                        headerText="No. Dokumen JU Terakhir"
                                    />
                                </ColumnsDirective>
                                <Inject services={[Page, Selection, Edit, Sort, Group, Filter, Resize, Reorder, CommandColumn]} />
                            </GridComponent>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>

            {/* === Modal === */}
            {showModalCreate && (
                <DialogFrmDp
                    isOpen={showModalCreate}
                    onClose={() => setShowModalCreate(false)}
                    statusPage={statusPage}
                    token={token}
                    kode_entitas={kode_entitas}
                    kode_dokumen={selectedRow?.kode_um}
                    userid={userid}
                    onRefresh={fetchData}
                />
            )}
        </div>
    );
};

export default PembayaranUangMuka;
