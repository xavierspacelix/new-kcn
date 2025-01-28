import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ChangeEventArgs as ChangeEventArgsInput, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
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
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
    Aggregate,
} from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import moment from 'moment';
import swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styles from './bmlist.module.css';
import Draggable from 'react-draggable';
import withReactContent from 'sweetalert2-react-content';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
L10n.load(idIDLocalization);
enableRipple(true);
import { useSession } from '@/pages/api/sessionContext';
import axios from 'axios';
import DialogCreateBM from './component/DialogCreateBM';
import Tum from './component/tum';
import DialogCreateBMPOS from './component/DialogCreateBMPOS';
import { isEntitasPajak } from '@/utils/global/fungsi';
import { usersMenu } from '@/utils/routines';

const BmList = () => {
    const { sessionData, isLoading } = useSession();
    console.log('Session Data: ', sessionData);

    const entitas_user = sessionData?.entitas ?? '';
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    //======= Setting hak akses user ... ========
    let disabledBaru = false;
    let disabledEdit = false;
    let disabledHapus = false;
    let disabledCetak = false;

    let sidebarObj: SidebarComponent;
    let type: SidebarType = 'Push';
    let mediaQueryState: string = '(min-width: 600px)';

    // State Baru Untuk BM
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
    }
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '' });
    const kode_menu = '60103'; // kode menu BM

    let gridListDataBaru: Grid | any;
    let gridListDataApproved: Grid | any;

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailDok, setDetailDok] = useState<any[]>([]);

    const [modalPosition, setModalPosition] = useState({ top: '3%', right: '2%', width: '100%', background: '#dedede' });
    const [dataHeaderDokBM, setDataHeaderDokBM] = useState({ no_dokumen: '', tgl_dokumen: '' });
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonFilePendukung = { width: 140 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonApproval = { width: 70 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };
    const styleButtonDisabled = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };
    const styleButtonApprovalDisabled = { width: 70 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };
    const styleButtonFilePendukungDisabled = { width: 140 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#ece7f5' };
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

    //======== Setting hint / tooltip untuk grid List Data ========
    let tooltipListData: Tooltip | any;

    //////////////////////////
    // ** FILTER SIDEBAR ** //
    //////////////////////////

    //No. Bukti
    const [noBuktiValue, setNoBuktiValue] = useState<string>('');
    const [isNoBukti, setIsNoBukti] = useState<boolean>(false);

    const handleNoBuktiInputChange = (event: string, setNoBuktiValue: Function, setIsNoBukti: Function) => {
        const newValue = event;
        setNoBuktiValue(newValue);
        setIsNoBukti(newValue.length > 0);
    };

    //No. Akun/ Nama Akun
    const [noAkunValue, setNoAkunValue] = useState<string>('');
    const [namaAkunValue, setNamaAkunValue] = useState<string>('');
    const [isNoNamaAkun, setIsNoNamaAkun] = useState<boolean>(false);

    const handleNoAkunInputChange = (event: string, setNoAkunValue: Function, setIsNoNamaAkun: Function) => {
        const newValue = event;
        setNoAkunValue(newValue);
        setIsNoNamaAkun(newValue.length > 0);
    };

    const handleNamaAkunInputChange = (event: string, setNamaAkunValue: Function, setIsNoNamaAkun: Function) => {
        const newValue = event;
        setNamaAkunValue(newValue);
        setIsNoNamaAkun(newValue.length > 0);
    };

    //Keterangan
    const [keteranganValue, setKeteranganValue] = useState<string>('');
    const [isKeterangan, setIsKeterangan] = useState<boolean>(false);

    const handleKeteranganInputChange = (event: string, setKeteranganValue: Function, setIsKeterangan: Function) => {
        const newValue = event;
        setKeteranganValue(newValue);
        setIsKeterangan(newValue.length > 0);
    };

    //No Warkat
    const [noWarkatValue, setNoWarkatValue] = useState<string>('');
    const [isNoWarkat, setIsnoWarkat] = useState<boolean>(false);

    const handleNoWarkatInputChange = (event: string, setNoWarkatValue: Function, setIsnoWarkat: Function) => {
        const newValue = event;
        setNoWarkatValue(newValue);
        setIsnoWarkat(newValue.length > 0);
    };

    //Tanggal
    const [date1, setDate1] = useState<moment.Moment>(moment());
    const [date2, setDate2] = useState<moment.Moment>(moment().endOf('month'));

    const [date3, setDate3] = useState<moment.Moment>(moment());
    const [date4, setDate4] = useState<moment.Moment>(moment().endOf('month'));

    const [isDateRangeChecked, setIsDateRangeChecked] = useState<boolean>(true);

    const HandleTgl = async (date: any, tipe: string, setDate1: Function, setDate2: Function, setIsDateRangeChecked: Function) => {
        if (tipe === 'tanggalAwal') {
            setDate1(date);
            setIsDateRangeChecked(true);
        } else {
            setDate2(date);
            setIsDateRangeChecked(true);
        }
    };

    const [isDateRangeChecked2, setIsDateRangeChecked2] = useState<boolean>(false);

    const HandleTgl2 = async (date: any, tipe: string, setDate3: Function, setDate4: Function, setIsDateRangeChecked2: Function) => {
        if (tipe === 'tanggalAwal') {
            setDate3(date);
            setIsDateRangeChecked2(true);
        } else {
            setDate4(date);
            setIsDateRangeChecked2(true);
        }
    };

    //Warkat Sidebar
    const [selectedOptionStatusWarkat, setSelectedOptionStatusWarkat] = useState<string>('');
    const [isStatusWarkat, setIsStatusWarkat] = useState<boolean>(false);

    const HandleStatusWarkatChange = (event: string, setSelectedOptionStatusWarkat: Function, setIsStatusWarkat: Function) => {
        const newValue = event;
        setSelectedOptionStatusWarkat(newValue);
        setIsStatusWarkat(newValue.length > 0);
    };

    // Status Batal Sidebar
    const [selectedOptionStatusBatal, setSelectedOptionStatusBatal] = useState<string>('');
    const [isStatusBatal, setIsStatusBatal] = useState<boolean>(false);

    const HandleStatusBatalChange = (event: string, setSelectedOptionStatusBatal: Function, setIsStatusBatal: Function) => {
        const newValue = event;
        setSelectedOptionStatusBatal(newValue);
        setIsStatusBatal(newValue.length > 0);
    };

    // Checkbox
    const [isTidakAdaNotaPengeluaran, setIsTidakAdaNotaPengeluaran] = useState<boolean>(false);
    const [isTidakAdaBuktiPersetujuan, setIsTidakAdaBuktiPersetujuan] = useState<boolean>(false);

    //////////////////////////////
    // ** END FILTER SIDEBAR ** //
    //////////////////////////////

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
            gridListDataApproved.print();
        } else if (args.item.text === 'PDF') {
            gridListDataApproved.showSpinner();
            gridListDataApproved.pdfExport();
        } else if (args.item.text === 'XLSX') {
            gridListDataApproved.showSpinner();
            gridListDataApproved.excelExport();
        } else if (args.item.text === 'CSV') {
            gridListDataApproved.showSpinner();
            gridListDataApproved.csvExport();
        }
    }

    const ExportComplete = (): void => {
        gridListDataApproved.hideSpinner();
    };

    //================ Disable hari minggu di calendar ==============
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    // ===========================================================================================

    // ================== Fungsi Reload untuk Responsive sidebar filter ==========================
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
            if (window.innerWidth < 800) {
                setSidebarVisible(false);
            } else {
                setSidebarVisible(true);
            }
        };

        if (typeof window !== 'undefined') {
            setWindowHeight(window.innerHeight);
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    const toggleClick = () => {
        setSidebarVisible(true);
    };

    const closeClick = () => {
        setSidebarVisible(false);
    };

    // ===========================================================================================

    const closeModal = () => {
        setSelectedItem(null);
    };

    const [modalHandleDataBM, setModalHandleDataBM] = useState(false);
    const [modalHandleDataBMTUM, setModalHandleDataBMTUM] = useState(false);
    const [modalHandleDataBMPOS, setModalHandleDataBMPOS] = useState(false);

    const [statusPage, setStatusPage] = useState('');
    const [statusPageTUM, setStatusPageTUM] = useState('');
    const [statusPagePOS, setStatusPagePOS] = useState('');

    const [selectedRow, setSelectedRow] = useState<any>('');
    const [selectedRowTUMataunonTUM, setSelectedRowTUMataunonTUM] = useState<any>('');
    const [selectedRowBMPOS, setSelectedRowBMPOS] = useState<any>('');
    const [selectedRowno_dokumen, setSelectedRowno_dokumen] = useState<any>('');
    const [selectedRowStatus, setSelectedRowStatus] = useState<any>('');
    const [selectedStatusBatal, setSelectedStatusBatal] = useState<any>('');

    // console.log(selectedRowStatus, 'selectedRowStatus')

    const [isFilePendukung, setisFilePendukung] = useState<any>('');
    const [isApprovedData, setisApprovedData] = useState<any>('');

    const handleRowSelected = (args: any) => {
        setSelectedStatusBatal(args.data.batal);
        setSelectedRowStatus(args.data.statusBM);
        setSelectedRow(args.data.kode_dokumen);
        setSelectedRowno_dokumen(args.data.no_dokumen);
        setSelectedRowTUMataunonTUM(args.data.kode_supp);
        setSelectedRowBMPOS(args.data.bm_pos);
    };

    const handleNavigateLink = (jenis: any) => {
        setModalHandleDataBM(false);
        if (jenis === 'edit') {
            if (selectedRow) {
                setStatusPage('EDIT');
                setModalHandleDataBM(true);
            } else {
                swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else if (jenis === 'create') {
            setStatusPage('CREATE');
            setModalHandleDataBM(true);
            setBaru(false);
        }
    };

    const handleNavigateLinkTUM = (jenis: any) => {
        setModalHandleDataBMTUM(false);
        if (jenis === 'edit') {
            if (selectedRow) {
                setStatusPageTUM('EDIT');
                setModalHandleDataBMTUM(true);
            } else {
                swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        }
    };

    const handleNavigateLinkPOS = (jenis: any) => {
        setModalHandleDataBMPOS(false);
        if (jenis === 'edit') {
            if (selectedRow) {
                setStatusPagePOS('EDIT');
                setModalHandleDataBMPOS(true);
            } else {
                swal.fire({
                    title: 'Warning',
                    text: 'Silahkan pilih data terlebih dahulu.',
                    icon: 'warning',
                });
            }
        } else if (jenis === 'create') {
            setStatusPagePOS('CREATE');
            setModalHandleDataBMPOS(true);
            setBaru(false);
        }
    };

    /// DETAIL DOK ///

    const router = useRouter();

    const [state, setState] = useState({
        content: 'Detail Dok',
        iconCss: 'e-icons e-medium e-chevron-down',
    });

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

    const DataDetailDok = async (selectedRow: any, selectedRowStatus: any, kode_entitas: any): Promise<any[]> => {
        const response = await axios.get(`${apiUrl}/erp/list_detail_dok_bm?`, {
            params: {
                entitas: kode_entitas,
                param1: selectedRowStatus,
                param2: selectedRow,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const listDetailDok = response.data.data;
        return listDetailDok;
    };

    const ListDetailDok = async (selectedRow: any, selectedRowStatus: any, kode_entitas: any, setDetailDok: Function) => {
        try {
            const result: any[] = await DataDetailDok(selectedRow, selectedRowStatus, kode_entitas);
            setDetailDok(result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const ButtonDetailDok = (selectedRow: any) => {
        return selectedRow;
    };

    const ButtonDetailDokStatus = (selectedRowStatus: any) => {
        return selectedRowStatus;
    };

    const SetDataDokumenBM = async (tipe: string, selectedRow: string, selectedRowStatus: string, kode_entitas: string, setSelectedItem: Function, setDetailDok: Function) => {
        if (selectedRow !== '') {
            if (tipe === 'detailDok') {
                const result = ButtonDetailDok(selectedRow);
                const result2 = ButtonDetailDokStatus(selectedRowStatus);
                setSelectedItem(result);
                ListDetailDok(result, result2, kode_entitas, setDetailDok);
            }
        } else {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'],
                },
            });
        }
    };

    const RowSelectingListData = (args: any, setDataHeaderDokBM: Function, kode_entitas: string, setDetailDok: Function) => {
        ListDetailDok(args.data.kode_dokumen, args.data.statusBM, kode_entitas, setDetailDok);
        setDataHeaderDokBM((prevState: any) => ({
            ...prevState,
            no_dokumen: args.data.no_dokumen,
            tgl_dokumen: args.data.tgl_dokumen,
        }));
    };

    // Cetak //
    let cMenuCetak: ContextMenuComponent;

    function btnPrintClick(e: any): void {
        var clientRect = (e.target as Element).getBoundingClientRect();
        cMenuCetak.open(clientRect.bottom, clientRect.left);
    }

    let menuCetakItems: MenuItemModel[] = [
        {
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Pemasukan Lain',
            items: [
                {
                    iconCss: 'e-icons e-thumbnail',
                    text: 'Form Kecil',
                },
                {
                    iconCss: 'e-icons e-thumbnail',
                    text: 'Form Besar',
                },
            ],
        },
        {
            iconCss: 'e-icons e-thumbnail',
            text: 'Daftar Pemasukan Lain',
        },
    ];

    function menuCetakSelect(args: MenuEventArgs) {
        if (args.item.text === 'Form Kecil') {
            OnClick_CetakFormBM(selectedRow, selectedRowno_dokumen, kode_entitas, './report/formbm_kecil');
        } else if (args.item.text === 'Form Besar') {
            OnClick_CetakFormBM(selectedRow, selectedRowno_dokumen, kode_entitas, './report/formbm_besar');
        } else if (args.item.text === 'Daftar Pemasukan Lain') {
            OnClick_CetakDaftarFormBM(kode_entitas, './report/daftarPemasukanLain');
        }
    }

    const OnClick_CetakFormBM = (selectedRowkodeDokumen: any, selectedRowno_dokumen: any, kode_entitas: string, url: string) => {
        if (selectedRow === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Silahkan pilih data terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'],
                },
            });
            return;
        }

        if (selectedRowStatus === 'baru') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Data yang belum di approve tidak dapat di print</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'],
                },
            });
            return;
        }

        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        let iframe = `
        <html><head>
        <title>Form Pemasukan Lain | Next KCN Sytem</title>
        <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
        </head><body>
        <iframe src="${url}?entitas=${kode_entitas}&param1=${selectedRowkodeDokumen}&param2=${selectedRowno_dokumen}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
        </body></html>`;

        let win = window.open(
            '',
            '_blank',
            `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
        );

        if (win) {
            let link = win.document.createElement('link');
            link.type = 'image/png';
            link.rel = 'shortcut icon';
            link.href = '/favicon.png';
            win.document.getElementsByTagName('head')[0].appendChild(link);
            win.document.write(iframe);
        } else {
            console.error('Window failed to open.');
        }
    };

    const OnClick_CetakDaftarFormBM = (kode_entitas: string, url: string) => {
        if (selectedRowStatus === 'baru') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Data yang belum di approve tidak dapat di print</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'],
                },
            });
            return;
        }

        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        let iframe = `
        <html><head>
        <title>Form Penyesuaian Stok | Next KCN Sytem</title>
        <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
        </head><body>
        <iframe src="${url}?entitas=${kode_entitas}&param1=${isDateRangeChecked ? date1.format('YYYY-MM-DD') : 'all'}&param2=${
            isDateRangeChecked ? date2.format('YYYY-MM-DD') : 'all'
        }" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
        </body></html>`;

        let win = window.open(
            '',
            '_blank',
            `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`
        );

        if (win) {
            let link = win.document.createElement('link');
            link.type = 'image/png';
            link.rel = 'shortcut icon';
            link.href = '/favicon.png';
            win.document.getElementsByTagName('head')[0].appendChild(link);
            win.document.write(iframe);
        } else {
            console.error('Window failed to open.');
        }
    };

    // Fetch Data
    const [recordsDataBaru, setRecordsDataBaru] = useState<any[]>([]);
    const [recordsDataApproved, setRecordsDataApproved] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async (param12Value: any, setStateFunction: any, statusBMValue: string) => {
            try {
                const params = {
                    entitas: kode_entitas,
                    param1: isDateRangeChecked ? date1.format('YYYY-MM-DD') : 'all',
                    param2: isDateRangeChecked ? date2.format('YYYY-MM-DD') : 'all',
                    param3: 'all',
                    param4: 'all',
                    param5: 'all',
                    param6: 'all',
                    param7: 'all',
                    param8: 'all',
                    param9: 'N',
                    param10: 'N',
                    param11: 'all',
                    param12: param12Value,
                    param13: 'N',
                };

                const response = await axios.get(`${apiUrl}/erp/list_pemasukkan_lain_bm?`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status) {
                    const dataWithStatusBM = response.data.data.map((item: any) => ({
                        ...item,
                        statusBM: statusBMValue,
                    }));
                    setStateFunction(dataWithStatusBM);
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData('baru', setRecordsDataBaru, 'baru');
        fetchData('approved', setRecordsDataApproved, 'approved');
    }, [apiUrl, kode_entitas]);

    // Daftar Akun Jurnal //

    const handleClickJurnal = () => {
        setModalDaftarAkun(true);
    };

    const [modalDaftarAkun, setModalDaftarAkun] = useState(false);

    const [searchNoAkunJurnal, setSearchNoakunJurnal] = useState('');
    const [searchNamaAkunJurnal, setSearchNamaAkunJurnal] = useState('');
    const [selectedJurnal, setSelectedJurnal] = useState<any>('');
    const [selectedKodeAkunJurnal, setSelectedKodeAkunJurnal] = useState<any>('');
    const [listDaftarAkun, setDaftarAkun] = useState([]);

    const refreshDaftarAkun = async () => {
        await setSearchNoakunJurnal('');
        await setSearchNamaAkunJurnal('');
        try {
            const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
                params: {
                    entitas: kode_entitas,
                    param1: 'SQLAkunKas',
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarAkun(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        refreshDaftarAkun();
    }, [kode_entitas]);

    const PencarianNoakunJurnal = async (event: string, setSearchNoakunJurnal: Function, setFilteredData: Function, listDaftarAkun: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoakunJurnal(searchValue, listDaftarAkun);
        setFilteredData(filteredData);

        const cariNamaAkun = document.getElementById('cariNamaAkun') as HTMLInputElement;
        if (cariNamaAkun) {
            cariNamaAkun.value = '';
        }
    };

    const SearchDataNoakunJurnal = (keyword: any, listDaftarAkun: any[]) => {
        if (keyword === '') {
            return listDaftarAkun;
        } else {
            const filteredData = listDaftarAkun.filter((item) => item.no_akun.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaakunJurnal = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredData: Function, listDaftarAkun: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaakunJurnal(searchValue, listDaftarAkun);
        setFilteredData(filteredData);

        const cariNoAkun = document.getElementById('cariNoAkun') as HTMLInputElement;
        if (cariNoAkun) {
            cariNoAkun.value = '';
        }
    };

    const SearchDataNamaakunJurnal = (keyword: any, listDaftarAkun: any[]) => {
        if (keyword === '') {
            return listDaftarAkun;
        } else {
            const filteredData = listDaftarAkun.filter((item) => item.nama_akun.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const handlePilihJurnal = () => {
        if (selectedJurnal) {
            if (selectedJurnal.header === 'Y') {
                swal.fire({
                    text: `No akun ${selectedJurnal.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi`,
                    icon: 'warning',
                    target: '#dialogJurnalHeaderList',
                });
            } else {
                setNoAkunValue(selectedJurnal.no_akun);
                setNamaAkunValue(selectedJurnal.nama_akun);
                setSelectedKodeAkunJurnal(selectedJurnal.kode_akun);
                setIsNoNamaAkun(true);
                setModalDaftarAkun(false);
            }
        }
    };

    const gridIndukHeaderJurnal = (props: any) => {
        return <div style={{ fontWeight: props.header === 'Y' ? 'bold' : 'normal', marginLeft: props.header === 'N' ? '0.5rem' : '0' }}>{props[props.column.field]}</div>;
    };

    // ** REFRESH DATA **  //
    const handleRefreshData = async () => {
        try {
            const responseBaru = await axios.get(`${apiUrl}/erp/list_pemasukkan_lain_bm?`, {
                params: {
                    entitas: kode_entitas,
                    param1: isDateRangeChecked ? date1.format('YYYY-MM-DD') : 'all', // Tgl Dokumen Awal
                    param2: isDateRangeChecked ? date2.format('YYYY-MM-DD') : 'all', // Tgl Dokumen Akhir
                    param3: isKeterangan ? keteranganValue : 'all', // Catatan
                    param4: isNoBukti ? noBuktiValue : 'all', // No Dokumen
                    param5: isNoWarkat ? noWarkatValue : 'all', // No Warkat
                    param6: isDateRangeChecked2 ? date3.format('YYYY-MM-DD') : 'all', // Tgl Dibuat Awal
                    param7: isDateRangeChecked2 ? date4.format('YYYY-MM-DD') : 'all', // Tgl Dibuat Akhir
                    param8: isNoNamaAkun ? selectedKodeAkunJurnal : 'all', // Kode Akun Debet
                    param9: isTidakAdaNotaPengeluaran ? 'Y' : 'N', // Tidak Ada Nota Pengeluaran Y atau N
                    param10: isTidakAdaBuktiPersetujuan ? 'Y' : 'N', // Tidak Ada Bukti Persetujuan Y atau N
                    param11: isStatusWarkat
                        ? selectedOptionStatusWarkat === 'baru'
                            ? '0'
                            : selectedOptionStatusWarkat === 'cair'
                            ? '1'
                            : selectedOptionStatusWarkat === 'batal'
                            ? '2'
                            : 'all'
                        : 'all', //Status Warkat ( '0' = 'Baru' ,= '1' = 'Cair', '2' = 'Tolak' )
                    param12: 'baru',
                    param13: selectedOptionStatusBatal === 'Ya' ? 'Y' : selectedOptionStatusBatal === 'Tidak' ? 'N' : 'all',
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseApproved = await axios.get(`${apiUrl}/erp/list_pemasukkan_lain_bm?`, {
                params: {
                    entitas: kode_entitas,
                    param1: isDateRangeChecked ? date1.format('YYYY-MM-DD') : 'all', // Tgl Dokumen Awal
                    param2: isDateRangeChecked ? date2.format('YYYY-MM-DD') : 'all', // Tgl Dokumen Akhir
                    param3: isKeterangan ? keteranganValue : 'all', // Catatan
                    param4: isNoBukti ? noBuktiValue : 'all', // No Dokumen
                    param5: isNoWarkat ? noWarkatValue : 'all', // No Warkat
                    param6: isDateRangeChecked2 ? date3.format('YYYY-MM-DD') : 'all', // Tgl Dibuat Awal
                    param7: isDateRangeChecked2 ? date4.format('YYYY-MM-DD') : 'all', // Tgl Dibuat Akhir
                    param8: isNoNamaAkun ? selectedKodeAkunJurnal : 'all', // Kode Akun Debet
                    param9: isTidakAdaNotaPengeluaran ? 'Y' : 'N', // Tidak Ada Nota Pengeluaran Y atau N
                    param10: isTidakAdaBuktiPersetujuan ? 'Y' : 'N', // Tidak Ada Bukti Persetujuan Y atau N
                    param11: isStatusWarkat
                        ? selectedOptionStatusWarkat === 'baru'
                            ? '0'
                            : selectedOptionStatusWarkat === 'cair'
                            ? '1'
                            : selectedOptionStatusWarkat === 'batal'
                            ? '2'
                            : 'all'
                        : 'all', //Status Warkat ( '0' = 'Baru' ,= '1' = 'Cair', '2' = 'Tolak' )
                    param12: 'approved',
                    param13: 'all',
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const transformedDataBaru = responseBaru.data.data.map((item: any) => ({
                ...item,
                statusBM: 'baru',
            }));

            const transformedDataApproved = responseApproved.data.data.map((item: any) => ({
                ...item,
                statusBM: 'approved',
            }));

            setRecordsDataBaru(transformedDataBaru);
            setRecordsDataApproved(transformedDataApproved);
        } catch (error) {
            console.error(error);
        }
    };

    // ** FILTER HEADER ** //

    const [searchNoBM, setSearchNoBM] = useState('');
    const [searchKeterangan, setSearchKeterangan] = useState('');
    const [filteredDataApproved, setFilteredDataApproved] = useState([]);
    const [filteredDataBaru, setFilteredDataBaru] = useState([]);

    const PencarianNoKeterangan = async (event: any, setSearchNoReff: any, setFilteredDataApproved: any, setFilteredDataBaru: any, recordsDataApproved: any, recordsDataBaru: any) => {
        const searchValue = event;
        setSearchNoReff(searchValue);
        const filteredApproved = SearchDataKeterangan(searchValue, recordsDataApproved);
        const filteredBaru = SearchDataKeterangan(searchValue, recordsDataBaru);
        setFilteredDataApproved(filteredApproved);
        setFilteredDataBaru(filteredBaru);

        const cariNoBM = document.getElementById('cariNoBM') as HTMLInputElement;
        if (cariNoBM) {
            cariNoBM.value = '';
        }
    };

    const SearchDataKeterangan = (keyword: any, recordsData: any) => {
        if (keyword === '') {
            return recordsData;
        } else {
            const filteredData = recordsData.filter((item: any) => item.catatan.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNoBM = async (event: any, setSearchNoBM: any, setFilteredDataApproved: any, setFilteredDataBaru: any, recordsDataApproved: any, recordsDataBaru: any) => {
        const searchValue = event;
        setSearchNoBM(searchValue);
        const filteredApproved = SearchDataNoBM(searchValue, recordsDataApproved);
        const filteredBaru = SearchDataNoBM(searchValue, recordsDataBaru);
        setFilteredDataApproved(filteredApproved);
        setFilteredDataBaru(filteredBaru);

        const keterangan = document.getElementById('keterangan') as HTMLInputElement;
        if (keterangan) {
            keterangan.value = '';
        }
    };

    const SearchDataNoBM = (keyword: any, recordsData: any) => {
        if (keyword === '') {
            return recordsData;
        } else {
            const filteredData = recordsData.filter((item: any) => item.no_dokumen.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const footerTemplate = () => (
        <div>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c' }}
                onClick={() => {
                    setModalDaftarAkun(false);
                    const cariNamaAkun = document.getElementById('cariNamaAkun') as HTMLInputElement;
                    if (cariNamaAkun) {
                        cariNamaAkun.value = '';
                    }

                    const cariNoAkun = document.getElementById('cariNoAkun') as HTMLInputElement;
                    if (cariNoAkun) {
                        cariNoAkun.value = '';
                    }
                }}
            />

            <ButtonComponent id="buSimpanDokumen1" content="Pilih" cssClass="e-primary e-small" style={{ float: 'right', backgroundColor: '#3b3f5c' }} onClick={() => handlePilihJurnal()} />
        </div>
    );

    // ENTITAS PAJAK
    const [pajakEntitas, setPajakEntitas] = useState<any>('N');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/erp/entitas_pajak?entitas=${kode_entitas}&param1=${userid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data.data;

                const matchedEntity = data.find((entity: any) => entity.kodecabang === kode_entitas);
                if (matchedEntity) {
                    setPajakEntitas(matchedEntity.pajak);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [apiUrl, kode_entitas, userid, token]);

    const [baru, setBaru] = useState(false);

    const SvgComponent: React.FC = () => {
        return (
            <div className="shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                    <path
                        opacity="0.5"
                        d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                    <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7 10.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9 17.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path
                        d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    />
                </svg>
            </div>
        );
    };

    const handleShowFilter = (value: any) => {
        if (value) {
            setSidebarVisible(true);
        } else {
            setSidebarVisible(false);
        }
    };

    const handleBatalClick = async () => {
        if (!selectedRow) {
            swal.fire({
                title: 'Silahkan pilih data terlebih dahulu.',
                icon: 'warning',
                target: '#main-target',
            });
            return;
        }

        if (selectedStatusBatal === 'Y') {
            swal.fire({
                title: `Silahkan pilih data yang belum dibatalkan.`,
                icon: 'warning',
                target: '#main-target',
            });
            return;
        }

        if (selectedRowStatus === 'approved') {
            swal.fire({
                title: `Silahkan pilih data baru. Data approved tidak dapat dibatalkan.`,
                icon: 'warning',
                target: '#main-target',
            });
            return;
        }

        const reqBody = {
            entitas: kode_entitas,
            kode_dokumen: selectedRow,
            userid: userid.toUpperCase(),
        };
        // console.log(reqBody);

        swal.fire({
            icon: 'question',
            title: 'Anda yakin ingin membatalkan proses ini? Tindakan ini tidak dapat dikembalikan.',
            showCancelButton: true,
            target: '#main-target',
            backdrop: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                // alert('Dibatalkan!');
                try {
                    const res = await axios.post(`${apiUrl}/erp/pembatalan_bk_bm`, reqBody, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (res.data.status) {
                        swal.fire({
                            title: 'Berhasil melakukan pembatalan',
                            icon: 'success',
                            target: '#main-target',
                        });

                        setTimeout(() => {
                            handleRefreshData();
                            gridListDataBaru.refresh();
                        }, 300);
                    }
                } catch (err) {
                    swal.fire({
                        title: 'Gagal melakukan pembatalan',
                        icon: 'error',
                        target: '#main-target',
                    });
                }
            }
        });
    };

    const [isPajak, setIsPajak] = useState<any>(false);
    const getIsPajak = async () => {
        const response = await isEntitasPajak(kode_entitas, userid, token);
        setIsPajak(response);
    };

    useEffect(() => {
        getIsPajak();
    }, []);

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

        fetchUserMenu();
    }, []);

    const isEditDisabled = selectedRowStatus === 'approved' ? !((userMenu.edit === 'Y' && entitas_user === '898') || userid.toLowerCase() === 'administrator') : false;
    
    return (
        <div className="main" id="main-target">
            {/* =================================BUTTON=================================== */}
            <div style={{ minHeight: '40px', marginTop: '-3px', marginBottom: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="flex flex-wrap items-center">
                    <ButtonComponent
                        id="btnDataBaru"
                        cssClass="e-primary e-small"
                        style={userMenu.baru === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? { ...styleButton } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                        disabled={userMenu.baru === 'Y' || userid === 'administrator' || userid === 'ADMINISTRATOR' ? false : true}
                        onClick={() => {
                            if (!isPajak) {
                                setBaru(true);
                            } else {
                                setisFilePendukung('N');
                                setisApprovedData('N');
                                handleNavigateLink('create');
                            }
                        }}
                        content="Baru"
                    ></ButtonComponent>

                    <ButtonComponent
                        id="btnUbah"
                        cssClass="e-primary e-small"
                        style={!isEditDisabled ? { ...styleButton } : { ...styleButtonDisabled, color: '#1c1b1f61' }}
                        disabled={isEditDisabled}
                        onClick={() => {
                            if (!selectedRow) {
                                swal.fire({
                                    title: 'Silahkan pilih data terlebih dahulu.',
                                    icon: 'warning',
                                    target: '#main-target',
                                });
                                return;
                            }

                            if (selectedStatusBatal === 'Y') {
                                swal.fire({
                                    title: 'Silahkan pilih data yang belum dibatalkan.',
                                    icon: 'warning',
                                    target: '#main-target',
                                });
                                return;
                            }

                            if (selectedRowBMPOS === 'Y') {
                                handleNavigateLinkPOS('edit');
                                setisFilePendukung('N');
                                setisApprovedData('N');
                            } else if (selectedRowBMPOS === 'N') {
                                console.log('aku tereksekusi');
                                if (selectedRowTUMataunonTUM === 'TUM') {
                                    handleNavigateLinkTUM('edit');
                                    setisFilePendukung('N');
                                    setisApprovedData('N');
                                } else {
                                    handleNavigateLink('edit');
                                    setisFilePendukung('N');
                                    setisApprovedData('N');
                                }
                            } else {
                                handleNavigateLink('edit');
                                setisFilePendukung('N');
                                setisApprovedData('N');
                            }
                        }}
                        content="Ubah"
                    />

                    <ButtonComponent id="btnFilter" cssClass="e-primary e-small" style={styleButton} disabled={disabledEdit} onClick={handleBatalClick} content="Batal"></ButtonComponent>

                    <ButtonComponent
                        id="btnFilter"
                        cssClass="e-primary e-small"
                        style={sidebarVisible ? { width: '57px', height: '28px', marginBottom: '0.5em', marginTop: '0.5em', marginRight: '0.8em' } : { ...styleButton, color: 'white' }}
                        disabled={sidebarVisible}
                        onClick={toggleClick}
                        content="Filter"
                    ></ButtonComponent>

                    <ContextMenuComponent
                        id="cMenuCetak"
                        ref={(scope) => (cMenuCetak = scope as ContextMenuComponent)}
                        items={menuCetakItems}
                        select={menuCetakSelect}
                        animationSettings={{ duration: 800, effect: 'FadeIn' }}
                    />

                    {!isPajak && (
                        <ButtonComponent
                            id="approvalBM"
                            cssClass="e-primary e-small"
                            style={entitas_user === '898' || userid.toLowerCase() === 'administrator' ? styleButtonApproval : styleButtonApprovalDisabled}
                            disabled={entitas_user === '898' || userid.toLowerCase() === 'administrator' ? false : true}
                            onClick={() => {
                                if (selectedRowStatus === 'approved') {
                                    setisApprovedData('N');
                                    setisFilePendukung('N');
                                    swal.fire({
                                        title: '',
                                        html: '<div style="margin-left: 10px;">Pilih data BKM baru yang belum diapproval.</div>',
                                        icon: 'warning',
                                        confirmButtonText: 'OK',
                                    });
                                } else if (selectedStatusBatal === 'Y') {
                                    swal.fire({
                                        title: '',
                                        html: '<div style="margin-left: 10px;">Pilih data BKM baru.</div>',
                                        icon: 'warning',
                                        confirmButtonText: 'OK',
                                    });
                                } else if (selectedRowStatus === 'baru') {
                                    setisApprovedData('Y');
                                    setisFilePendukung('N');
                                    handleNavigateLink('edit');
                                }
                            }}
                            content="Approval"
                        ></ButtonComponent>
                    )}

                    <ButtonComponent
                        id="btnUpdateFilePendukung"
                        cssClass="e-primary e-small"
                        style={styleButtonFilePendukung}
                        disabled={disabledEdit}
                        onClick={() => {
                            if (selectedStatusBatal === 'Y') {
                                swal.fire({
                                    title: '',
                                    html: '<div style="margin-left: 10px;">Pilih data BKM baru.</div>',
                                    icon: 'warning',
                                    confirmButtonText: 'OK',
                                });
                                return;
                            }

                            if (selectedRowBMPOS === 'Y') {
                                handleNavigateLinkPOS('edit');
                                setisApprovedData('N');
                                setisFilePendukung('Y');
                            } else if (selectedRowBMPOS === 'N') {
                                if (selectedRowTUMataunonTUM === 'TUM') {
                                } else {
                                    handleNavigateLink('edit');
                                    setisApprovedData('N');
                                    setisFilePendukung('Y');
                                }
                            }
                        }}
                        content="Update FIle Pendukung"
                    />

                    <ButtonComponent
                        id="btnDetail"
                        cssClass="e-primary e-small"
                        style={{ width: 100 + 'px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#e6e6e6', color: 'black' }}
                        disabled={false}
                        onClick={() => SetDataDokumenBM('detailDok', selectedRow, selectedRowStatus, kode_entitas, setSelectedItem, setDetailDok)}
                        iconCss={state.iconCss}
                        content={state.content}
                    ></ButtonComponent>

                    <ButtonComponent
                        id="btnCetak"
                        cssClass="e-primary e-small"
                        style={{ ...styleButton, width: 75 + 'px' }}
                        disabled={disabledCetak}
                        onClick={btnPrintClick}
                        content="Cetak"
                        iconCss="e-icons e-medium e-chevron-down"
                        iconPosition="Right"
                    ></ButtonComponent>

                    <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                        <TextBoxComponent
                            id="cariNoBM"
                            className="searchtext"
                            placeholder="Cari Nomor BM"
                            showClearButton={true}
                            input={(args) => {
                                const value = args.value;
                                PencarianNoBM(value, setSearchNoBM, setFilteredDataApproved, setFilteredDataBaru, recordsDataApproved, recordsDataBaru);
                            }}
                            floatLabelType="Never"
                        />
                    </div>

                    <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                        <TextBoxComponent
                            id="keterangan"
                            className="searchtext"
                            placeholder="Keterangan"
                            showClearButton={true}
                            input={(args) => {
                                const value = args.value;
                                PencarianNoKeterangan(value, setSearchKeterangan, setFilteredDataApproved, setFilteredDataBaru, recordsDataApproved, recordsDataBaru);
                            }}
                            floatLabelType="Never"
                        />
                    </div>
                </div>
                <div style={{ float: 'right' }} className="flex items-center justify-between">
                    <div className="mr-auto">
                        <span className="font-serif text-lg" style={{ fontSize: 16 }}>
                            Pemasukan Lain (BM)
                        </span>
                    </div>
                </div>
            </div>
            {/* =================================END BUTTON=================================== */}

            <div id="main-content" style={{ position: 'sticky', overflow: 'hidden' }} className="flex !gap-6">
                {/* ==============================FILTER============================================== */}
                <SidebarComponent
                    id="default-sidebar"
                    target={'#main-content'}
                    style={{
                        background: '#dedede',
                        marginRight: '2rem',
                        display: 'block',
                        overflowY: 'auto',
                        borderRadius: 7,
                    }}
                    width="305px"
                    height={200}
                    isOpen={sidebarVisible}
                    open={() => setSidebarVisible(true)}
                    close={() => setSidebarVisible(false)}
                    enableGestures={false}
                >
                    <div className="panel-filter " style={{ background: '#dedede', height: '100%' }}>
                        <div className="flex items-center text-center">
                            <button className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900" onClick={() => handleShowFilter(false)}>
                                <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                            </button>
                            <SvgComponent />
                            <h5 className="text-lg font-bold ltr:ml-3 rtl:mr-3">Filtering Data</h5>
                        </div>
                        <div className="mb-5 mt-3 h-px w-full border-b border-black dark:border-[#1b2e4b]"></div>
                        <div className="flex flex-col items-center justify-between" id="Candil">
                            <div id="inputFilter">
                                <div className="flex">
                                    <CheckBoxComponent
                                        label="No. Bukti"
                                        checked={isNoBukti}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsNoBukti(value);
                                        }}
                                        style={{ borderRadius: 3, borderColor: 'gray' }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <TextBoxComponent
                                            placeholder=""
                                            value={noBuktiValue}
                                            input={(args: FocusInEventArgs) => {
                                                const value: any = args.value;
                                                handleNoBuktiInputChange(value, setNoBuktiValue, setIsNoBukti);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Tanggal"
                                        checked={isDateRangeChecked}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsDateRangeChecked(value);
                                        }}
                                    />
                                </div>

                                <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                    <div className="form-input mt-1 flex justify-between">
                                        <DatePickerComponent
                                            locale="id"
                                            style={{ fontSize: '12px' }}
                                            cssClass="e-custom-style"
                                            // renderDayCell={onRenderDayCell}
                                            enableMask={true}
                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={date1.toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                HandleTgl(moment(args.value), 'tanggalAwal', setDate1, setDate2, setIsDateRangeChecked);
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
                                            value={date2.toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                HandleTgl(moment(args.value), 'tanggalAkhir', setDate1, setDate2, setIsDateRangeChecked);
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Tanggal Buat"
                                        checked={isDateRangeChecked2}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsDateRangeChecked2(value);
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
                                            value={date3.toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                HandleTgl2(moment(args.value), 'tanggalAwal', setDate3, setDate4, setIsDateRangeChecked2);
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
                                            value={date4.toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                HandleTgl2(moment(args.value), 'tanggalAkhir', setDate3, setDate4, setIsDateRangeChecked2);
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div>
                                </div>

                                <div className="mt-2 flex">
                                    <CheckBoxComponent
                                        label="No Akun/Nama Akun"
                                        checked={isNoNamaAkun}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsNoNamaAkun(value);
                                        }}
                                        style={{ borderRadius: 3, borderColor: 'gray' }}
                                    />
                                </div>

                                <div className="flex">
                                    <div style={{ width: '90%' }}>
                                        <div className="mt-1 flex justify-between">
                                            <div className="container form-input">
                                                <TextBoxComponent
                                                    placeholder=""
                                                    value={noAkunValue}
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        handleNoAkunInputChange(value, setNoAkunValue, setIsNoNamaAkun);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-1 flex justify-between">
                                            <div className="container form-input">
                                                <TextBoxComponent
                                                    placeholder=""
                                                    value={namaAkunValue}
                                                    input={(args: FocusInEventArgs) => {
                                                        const value: any = args.value;
                                                        handleNamaAkunInputChange(value, setNamaAkunValue, setIsNoNamaAkun);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ width: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon icon={faSearch} onClick={handleClickJurnal} className="ml-2 mt-3" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                                    </div>
                                </div>

                                <div className="mt-2 flex">
                                    <CheckBoxComponent
                                        label="Keterangan"
                                        checked={isKeterangan}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsKeterangan(value);
                                        }}
                                        style={{ borderRadius: 3, borderColor: 'gray' }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <TextBoxComponent
                                            placeholder=""
                                            value={keteranganValue}
                                            input={(args: FocusInEventArgs) => {
                                                const value: any = args.value;
                                                handleKeteranganInputChange(value, setKeteranganValue, setIsKeterangan);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex">
                                    <CheckBoxComponent
                                        label="No Warkat"
                                        checked={isNoWarkat}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsnoWarkat(value);
                                        }}
                                        style={{ borderRadius: 3, borderColor: 'gray' }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <TextBoxComponent
                                            placeholder=""
                                            value={noWarkatValue}
                                            input={(args: FocusInEventArgs) => {
                                                const value: any = args.value;
                                                handleNoWarkatInputChange(value, setNoWarkatValue, setIsnoWarkat);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Status Warkat"
                                        checked={isStatusWarkat}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsStatusWarkat(value);
                                        }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <DropDownListComponent
                                            id="statuswarkat"
                                            className="form-select"
                                            dataSource={['baru', 'cair', 'tolak']}
                                            placeholder="--Silahkan Pilih--"
                                            change={(args: ChangeEventArgsDropDown) => {
                                                const value: any = args.value;
                                                HandleStatusWarkatChange(value, setSelectedOptionStatusWarkat, setIsStatusWarkat);
                                            }}
                                            value={selectedOptionStatusWarkat}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Status Batal"
                                        checked={isStatusBatal}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsStatusBatal(value);
                                        }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <DropDownListComponent
                                            id="statusbatal"
                                            className="form-select"
                                            dataSource={['Semua', 'Ya', 'Tidak']}
                                            placeholder="--Silahkan Pilih--"
                                            change={(args: ChangeEventArgsDropDown) => {
                                                const value: any = args.value;
                                                HandleStatusBatalChange(value, setSelectedOptionStatusBatal, setIsStatusBatal);
                                            }}
                                            value={selectedOptionStatusBatal}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 space-y-1">
                                    <div>
                                        <label className="inline-flex" style={{ fontSize: 11 }}>
                                            <input
                                                type="checkbox"
                                                className="peer form-checkbox"
                                                checked={isTidakAdaNotaPengeluaran}
                                                onChange={() => setIsTidakAdaNotaPengeluaran(!isTidakAdaNotaPengeluaran)}
                                            />
                                            <span className="peer-checked:text-primary">Tidak Ada Nota Pengeluaran</span>
                                        </label>
                                        <label className="inline-flex" style={{ fontSize: 11 }}>
                                            <input
                                                type="checkbox"
                                                className="peer form-checkbox"
                                                checked={isTidakAdaBuktiPersetujuan}
                                                onChange={() => setIsTidakAdaBuktiPersetujuan(!isTidakAdaBuktiPersetujuan)}
                                            />
                                            <span className="peer-checked:text-primary">Tidak Ada Bukti Persetujuan</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-center">
                                <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                    <ButtonComponent
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-medium e-refresh"
                                        content="Refresh Data"
                                        style={{ backgroundColor: '#3b3f5c' }}
                                        onClick={handleRefreshData}
                                    />
                                </TooltipComponent>
                            </div>
                        </div>
                    </div>
                </SidebarComponent>
                {/* ==============================END FILTER============================================== */}

                {/* ===============  GRID ========================   */}
                <div
                    className="panel border-l-[5px] border-white"
                    style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 305px' : ' 0'), overflowY: 'auto', borderRadius: 7 }}
                >
                    <div className="panel-data" style={{ width: '100%' }}>
                        <div className="e-content">
                            <div>
                                <TabComponent
                                    // ref={(t) => (tabTtbList = t)}
                                    selectedItem={isPajak ? 1 : 0}
                                    animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                    height="100%"
                                >
                                    {!isPajak && (
                                        <div className="e-tab-header" style={{ display: 'flex' }}>
                                            <div
                                                tabIndex={0}
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    padding: '10px 20px',
                                                    cursor: 'pointer',
                                                    borderBottom: '3px solid transparent',
                                                }}
                                            >
                                                Baru
                                            </div>
                                            <div tabIndex={1} style={{ fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}>
                                                Approved
                                            </div>
                                        </div>
                                    )}
                                    <div className="e-content">
                                        {/* INDEX 0 */}
                                        {!isPajak && (
                                            <div
                                                tabIndex={0}
                                                style={{ marginTop: -5, fontSize: '12px', fontWeight: 'bold', padding: '10px 12px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                            >
                                                <div>
                                                    <GridComponent
                                                        ref={(g) => (gridListDataBaru = g)}
                                                        dataSource={recordsDataBaru.length > 0 ? (searchNoBM !== '' || searchKeterangan !== '' ? filteredDataBaru : recordsDataBaru) : []}
                                                        allowExcelExport={true}
                                                        excelExportComplete={ExportComplete}
                                                        allowPdfExport={true}
                                                        pdfExportComplete={ExportComplete}
                                                        allowPaging={true}
                                                        allowSorting={true}
                                                        allowFiltering={false}
                                                        allowResizing={true}
                                                        autoFit={true}
                                                        allowReordering={true}
                                                        pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                                        rowHeight={22}
                                                        width={'100%'}
                                                        height={505}
                                                        gridLines={'Both'}
                                                        loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                        rowSelected={handleRowSelected}
                                                        rowSelecting={(args) => RowSelectingListData(args, setDataHeaderDokBM, kode_entitas, setDetailDok)}
                                                        recordDoubleClick={() => {
                                                            if (selectedStatusBatal === 'Y') {
                                                                swal.fire({
                                                                    title: 'Silahkan pilih data yang belum dibatalkan.',
                                                                    icon: 'warning',
                                                                    target: '#main-target',
                                                                });
                                                                return;
                                                            }

                                                            const isAllowedToEdit =
                                                                selectedRowStatus === 'approved'
                                                                    ? userid.toLowerCase() === 'asteria' || userid.toLowerCase() === 'administrator'
                                                                    : userMenu.edit === 'Y' || userid.toLowerCase() === 'administrator';

                                                            // Jika tidak diizinkan untuk edit, tampilkan pesan warning
                                                            if (!isAllowedToEdit) {
                                                                return;
                                                            }

                                                            handleNavigateLink('edit');
                                                            setisFilePendukung('N');
                                                            setisApprovedData('N');
                                                        }}
                                                        queryCellInfo={(args) => {
                                                            if (args.data.batal === 'Y' || args.data.batal === 'Y') {
                                                                args.cell.style.color = '#DB1E1F';
                                                            } else {
                                                                args.cell.style.color = '';
                                                            }
                                                        }}
                                                    >
                                                        <ColumnsDirective>
                                                            <ColumnDirective
                                                                field="no_dokumen"
                                                                headerText="No. Bukti"
                                                                width="150"
                                                                textAlign="Center"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                field="tgl_dokumen"
                                                                headerText="Tanggal"
                                                                width="100"
                                                                textAlign="Center"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                                format={formatDate}
                                                                type="Date"
                                                            />

                                                            <ColumnDirective
                                                                field="tgl_trxdokumen"
                                                                headerText="Tanggal Buat"
                                                                width="100"
                                                                textAlign="Center"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                                format={formatDate}
                                                                type="Date"
                                                            />

                                                            <ColumnDirective
                                                                field="ket_debet"
                                                                headerText="Diterima ke Akun Debet"
                                                                width="250"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective field="kode_mu" headerText="MU" width="50" textAlign="Center" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                                            <ColumnDirective
                                                                field="jumlah_mu"
                                                                headerText="Jumlah"
                                                                width="120"
                                                                textAlign="Right"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                                template={(props: any) => {
                                                                    return <span>{props.jumlah_mu ? parseFloat(props.jumlah_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                                }}
                                                            />
                                                            <ColumnDirective
                                                                field="catatan"
                                                                headerText="Keterangan"
                                                                width="350"
                                                                textAlign="Left"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                field="no_warkat"
                                                                headerText="No Warkat"
                                                                width="100"
                                                                textAlign="Left"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                field="tgl_valuta"
                                                                headerText="Tgl Valuta"
                                                                width="100"
                                                                textAlign="Left"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                field="status_warkat"
                                                                headerText="Status Warkat"
                                                                width="100"
                                                                textAlign="Center"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                field="batal"
                                                                headerText="Status Batal"
                                                                width="100"
                                                                textAlign="Center"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                            <ColumnDirective
                                                                field="bm_pos"
                                                                headerText="BM POS"
                                                                width="100"
                                                                textAlign="Center"
                                                                headerTextAlign="Center"
                                                                clipMode="EllipsisWithTooltip"
                                                            />
                                                        </ColumnsDirective>
                                                        <AggregatesDirective>
                                                            <AggregateDirective>
                                                                <AggregateColumnsDirective>
                                                                    <AggregateColumnDirective
                                                                        field="jumlah_mu"
                                                                        type="Sum"
                                                                        footerTemplate={(props: any) => {
                                                                            return <span>{parseFloat(props.Sum).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>;
                                                                        }}
                                                                    />
                                                                </AggregateColumnsDirective>
                                                            </AggregateDirective>
                                                        </AggregatesDirective>
                                                        <Inject
                                                            services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport, Aggregate]}
                                                        />
                                                    </GridComponent>
                                                    <ContextMenuComponent
                                                        id="contextmenu"
                                                        target=".e-gridheader"
                                                        items={menuHeaderItems}
                                                        select={menuHeaderSelect}
                                                        animationSettings={{ duration: 500, effect: 'FadeIn' }}
                                                    />
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
                                        )}

                                        {/* INDEX 1 */}
                                        <div
                                            tabIndex={1}
                                            style={{ marginTop: -5, fontSize: '12px', fontWeight: 'bold', padding: '10px 12px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            <div>
                                                <GridComponent
                                                    ref={(g) => (gridListDataApproved = g)}
                                                    dataSource={recordsDataApproved.length > 0 ? (searchNoBM !== '' || searchKeterangan !== '' ? filteredDataApproved : recordsDataApproved) : []}
                                                    allowExcelExport={true}
                                                    excelExportComplete={ExportComplete}
                                                    allowPdfExport={true}
                                                    pdfExportComplete={ExportComplete}
                                                    allowPaging={true}
                                                    allowSorting={true}
                                                    allowFiltering={false}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    allowReordering={true}
                                                    pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                                    rowHeight={22}
                                                    width={'100%'}
                                                    height={505}
                                                    gridLines={'Both'}
                                                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    rowSelected={handleRowSelected}
                                                    rowSelecting={(args) => RowSelectingListData(args, setDataHeaderDokBM, kode_entitas, setDetailDok)}
                                                    recordDoubleClick={() => {
                                                        if (selectedStatusBatal === 'Y') {
                                                            swal.fire({
                                                                title: 'Silahkan pilih data yang belum dibatalkan.',
                                                                icon: 'warning',
                                                                target: '#main-target',
                                                            });
                                                            return;
                                                        }

                                                        const isAllowedToEdit =
                                                            selectedRowStatus === 'approved'
                                                                ? userid.toLowerCase() === 'asteria' || userid.toLowerCase() === 'administrator'
                                                                : userMenu.edit === 'Y' || userid.toLowerCase() === 'administrator';

                                                        // Jika tidak diizinkan untuk edit, tampilkan pesan warning
                                                        if (!isAllowedToEdit) {
                                                            return;
                                                        }

                                                        handleNavigateLink('edit');
                                                        setisFilePendukung('N');
                                                        setisApprovedData('N');
                                                    }}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective
                                                            field="no_dokumen"
                                                            headerText="No. Bukti"
                                                            width="150"
                                                            textAlign="Center"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="tgl_dokumen"
                                                            headerText="Tanggal"
                                                            width="100"
                                                            textAlign="Center"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                            format={formatDate}
                                                            type="Date"
                                                        />

                                                        <ColumnDirective
                                                            field="tgl_trxdokumen"
                                                            headerText="Tanggal Buat"
                                                            width="100"
                                                            textAlign="Center"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                            format={formatDate}
                                                            type="Date"
                                                        />
                                                        <ColumnDirective field="ket_debet" headerText="Diterima ke Akun Debet" width="250" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective field="kode_mu" headerText="MU" width="50" textAlign="Center" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective
                                                            field="jumlah_mu"
                                                            headerText="Jumlah"
                                                            width="120"
                                                            textAlign="Right"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                            template={(props: any) => {
                                                                return <span>{props.jumlah_mu ? parseFloat(props.jumlah_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                            }}
                                                        />
                                                        <ColumnDirective field="catatan" headerText="Keterangan" width="350" textAlign="Left" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective
                                                            field="no_warkat"
                                                            headerText="No Warkat"
                                                            width="100"
                                                            textAlign="Left"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="tgl_valuta"
                                                            headerText="Tgl Valuta"
                                                            width="100"
                                                            textAlign="Left"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="status_warkat"
                                                            headerText="Status Warkat"
                                                            width="100"
                                                            textAlign="Center"
                                                            headerTextAlign="Center"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective field="bm_pos" headerText="BM POS" width="100" textAlign="Center" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                                    </ColumnsDirective>
                                                    <AggregatesDirective>
                                                        <AggregateDirective>
                                                            <AggregateColumnsDirective>
                                                                <AggregateColumnDirective
                                                                    field="jumlah_mu"
                                                                    type="Sum"
                                                                    footerTemplate={(props: any) => {
                                                                        return <span>{parseFloat(props.Sum).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>;
                                                                    }}
                                                                />
                                                            </AggregateColumnsDirective>
                                                        </AggregateDirective>
                                                    </AggregatesDirective>
                                                    <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport, Aggregate]} />
                                                </GridComponent>
                                                <ContextMenuComponent
                                                    id="contextmenu"
                                                    target=".e-gridheader"
                                                    items={menuHeaderItems}
                                                    select={menuHeaderSelect}
                                                    animationSettings={{ duration: 500, effect: 'FadeIn' }}
                                                />
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
                                </TabComponent>
                                <ContextMenuComponent
                                    id="contextmenu"
                                    target=".e-gridheader"
                                    items={menuHeaderItems}
                                    select={menuHeaderSelect}
                                    animationSettings={{ duration: 500, effect: 'FadeIn' }}
                                />
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
                </div>
                {/* ===============  END GRID ========================   */}
            </div>

            {/* MODAL LIST DAFTAR AKUN JURNAL */}
            <DialogComponent
                // ref={(d) => (gridDaftarAkun = d)}
                style={{ position: 'fixed' }}
                header={'Daftar Akun'}
                footerTemplate={footerTemplate}
                visible={modalDaftarAkun}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                allowDragging={true}
                showCloseIcon={true}
                width="420"
                height="450"
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    setModalDaftarAkun(false);
                    setSearchNoakunJurnal('');
                    setSearchNamaAkunJurnal('');
                    const cariNamaAkun = document.getElementById('cariNamaAkun') as HTMLInputElement;
                    if (cariNamaAkun) {
                        cariNamaAkun.value = '';
                    }

                    const cariNoAkun = document.getElementById('cariNoAkun') as HTMLInputElement;
                    if (cariNoAkun) {
                        cariNoAkun.value = '';
                    }
                }}
                closeOnEscape={true}
            >
                <div className="form-input mb-1 mr-1" style={{ width: '120px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="cariNoAkun"
                        className="searchtext"
                        placeholder="Cari Nomor akun Jurnal"
                        showClearButton={true}
                        input={(args: ChangeEventArgsInput) => {
                            const value: any = args.value;
                            PencarianNoakunJurnal(value, setSearchNoakunJurnal, setFilteredData, listDaftarAkun);
                        }}
                        floatLabelType="Never"
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '270px', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="cariNamaAkun"
                        className="searchtext"
                        placeholder="Cari Nama akun Jurnal"
                        showClearButton={true}
                        input={(args: ChangeEventArgsInput) => {
                            const value: any = args.value;
                            PencarianNamaakunJurnal(value, setSearchNamaAkunJurnal, setFilteredData, listDaftarAkun);
                        }}
                        floatLabelType="Never"
                    />
                </div>
                <GridComponent
                    id="dialogJurnalHeaderList"
                    locale="id"
                    style={{ width: '100%', height: '75%' }}
                    dataSource={searchNoAkunJurnal !== '' || searchNamaAkunJurnal !== '' ? filteredData : listDaftarAkun}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    width={'100%'}
                    height={'275'}
                    rowSelecting={(args: any) => {
                        setSelectedJurnal(args.data);
                    }}
                    recordDoubleClick={(args: any) => {
                        handlePilihJurnal();
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective field="no_akun" template={gridIndukHeaderJurnal} headerText="Kode Akun" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective
                            field="nama_akun"
                            template={gridIndukHeaderJurnal}
                            headerText="Nama Akun"
                            headerTextAlign="Center"
                            textAlign="Left"
                            width="280"
                            clipMode="EllipsisWithTooltip"
                        />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
            </DialogComponent>

            {/* END MODAL LIST DAFTAR AKUN JURNAL */}

            {selectedItem && (
                <Draggable>
                    <div className={`${styles.modalDetailDragable}`} style={modalPosition}>
                        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                            <div style={{ marginBottom: 21 }}>
                                <span style={{ fontSize: 18, fontWeight: 500 }}>
                                    Detail Penyesuaian dan Rebuild Stok : {dataHeaderDokBM.no_dokumen} - {dataHeaderDokBM.tgl_dokumen}
                                </span>
                            </div>
                            <GridComponent dataSource={detailDok} width={'100%'} rowHeight={30} gridLines={'Both'} allowSorting={true}>
                                <ColumnsDirective>
                                    <ColumnDirective field="no_akun" headerText="No Akun" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="nama_akun" width="200" headerText="Nama" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective
                                        field="debet_rp"
                                        headerText="Debet"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                        template={(props: any) => {
                                            return <span>{props.debet_rp ? parseFloat(props.debet_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />

                                    <ColumnDirective
                                        field="kredit_rp"
                                        headerText="Kredit"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                        template={(props: any) => {
                                            return <span>{props.kredit_rp ? parseFloat(props.kredit_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />

                                    <ColumnDirective field="catatan" width="210" headerText="Keterangan" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective width="50" field="kode_mu" headerText="MU" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective
                                        width="50"
                                        field="kurs"
                                        headerText="Kurs"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                        template={(props: any) => {
                                            return <span>{props.kurs ? parseFloat(props.kurs).toFixed(2) : ''}</span>;
                                        }}
                                    />

                                    <ColumnDirective
                                        field="jumlah_mu"
                                        headerText="Jumlah"
                                        textAlign="Center"
                                        headerTextAlign="Center"
                                        template={(props: any) => {
                                            return <span>{props.jumlah_mu ? parseFloat(props.jumlah_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                        }}
                                    />

                                    <ColumnDirective field="subledger" headerText="Subledger" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="nama_kry" headerText="Karyawan" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="nama_dept" headerText="Departmen" textAlign="Center" headerTextAlign="Center" />
                                </ColumnsDirective>
                                <Inject services={[Page, Sort, Filter, Group]} />
                            </GridComponent>
                        </div>
                        <button
                            className={`${styles.closeButtonDetailDragable}`}
                            onClick={() => {
                                closeModal();
                            }}
                        >
                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                        </button>
                    </div>
                </Draggable>
            )}

            {baru && !isPajak && (
                <DialogComponent
                    id="dialogBMList"
                    name="dialogBMList"
                    className="dialogBMList"
                    target="#main-target"
                    header={() => {
                        let header: JSX.Element | string = '';
                        header = (
                            <div>
                                <div className="header-title">Pemasukan Lain</div>
                            </div>
                        );

                        return header;
                    }}
                    visible={baru}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    resizeHandles={['All']}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="50"
                    height="130"
                    position={{ X: 'center', Y: 'center' }}
                    style={{ position: 'fixed' }}
                    close={() => {
                        setBaru(false);
                    }}
                >
                    <div style={{ marginLeft: 20, marginBottom: 10 }}>
                        <ButtonComponent
                            cssClass="e-secondary e-small"
                            style={{ width: '90%' }}
                            onClick={() => {
                                setisFilePendukung('N');
                                setisApprovedData('N');
                                handleNavigateLink('create');
                            }}
                        >
                            Pemasukan Lain
                        </ButtonComponent>
                    </div>
                    <div style={{ marginLeft: 20, marginBottom: 10 }}>
                        <ButtonComponent
                            cssClass="e-secondary e-small"
                            style={{ width: '90%' }}
                            onClick={() => {
                                setisFilePendukung('N');
                                setisApprovedData('N');
                                handleNavigateLinkPOS('create');
                            }}
                        >
                            Pembayaran Faktur Tunai (POS)
                        </ButtonComponent>
                    </div>
                </DialogComponent>
            )}

            {modalHandleDataBM && (
                <DialogCreateBM
                    userid={userid}
                    kode_entitas={kode_entitas}
                    isOpen={modalHandleDataBM}
                    onClose={() => {
                        setModalHandleDataBM(false);
                        setStatusPage('');
                    }}
                    kode_user={kode_user}
                    onRefresh={handleRefreshData}
                    kode_bm={selectedRow}
                    statusPage={statusPage}
                    selectedRowStatus={selectedRowStatus}
                    isFilePendukung={isFilePendukung}
                    isApprovedData={isApprovedData}
                    token={token}
                    dataListMutasibank="Y"
                    onRefreshTipe={0}
                />
            )}

            {modalHandleDataBMTUM && (
                <Tum
                    userid={userid}
                    kode_entitas={kode_entitas}
                    isOpen={modalHandleDataBMTUM}
                    onClose={() => {
                        setModalHandleDataBMTUM(false);
                        setStatusPageTUM('');
                    }}
                    kode_user={kode_user}
                    onRefresh={handleRefreshData}
                    kode_bm={selectedRow}
                    statusPage={statusPageTUM}
                    selectedRowStatus={selectedRowStatus}
                    token={token}
                />
            )}

            {modalHandleDataBMPOS && (
                <DialogCreateBMPOS
                    userid={userid}
                    kode_entitas={kode_entitas}
                    isOpen={modalHandleDataBMPOS}
                    onClose={() => {
                        setBaru(false);
                        setModalHandleDataBMPOS(false);
                        setStatusPagePOS('');
                    }}
                    kode_user={kode_user}
                    onRefresh={handleRefreshData}
                    kode_bm={selectedRow}
                    statusPage={statusPagePOS}
                    selectedRowStatus={selectedRowStatus}
                    isFilePendukung={isFilePendukung}
                    token={token}
                    dataListMutasibank="Y"
                    onRefreshTipe={0}
                />
            )}
        </div>
    );
};

export default BmList;
