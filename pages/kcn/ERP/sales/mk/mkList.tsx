/* eslint-disable react-hooks/rules-of-hooks */
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';
import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from '@/public/syncfusion/locale.json';
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
import { getServerSideProps } from '@/pages/api/getServerSide';
import moment from 'moment';
import styles from './mklist.module.css';
import { GetListMk, GetListMkEffect } from './model/api';
import {
    HandleNamaCustInputChange,
    HandleNoCustInputChange,
    HandleNoFakturInputChange,
    HandleNoMkInputChange,
    HandleNoTtbInputChange,
    HandleRowDoubleClicked,
    HandleRowSelected,
    HandleTgl,
    PencarianNoMk,
    PencarianNamaCust,
    RowSelectingListData,
    SetDataDokumenMk,
} from './component/fungsiFrmMkList';
import checkboxTemplate from './component/fungsiFrmMkList';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import Draggable from 'react-draggable';
import FrmMk from './component/frmMk';
import { useSession } from '@/pages/api/sessionContext';

enableRipple(true);
// interface frmMKListProps {
//     userid: any;
//     kode_entitas: any;
//     kode_user: any;
//     token: any;
// }
// const MkList = ({ userid, kode_entitas, token, kode_user }: frmMKListProps) => {
const MkList = () => {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';

    if (isLoading) {
        return;
    }
    interface UserMenuState {
        baru: any;
        edit: any;
        hapus: any;
        cetak: any;
    }

    type MKListItem = {
        kode_mk: any;
        no_mk: any;
        tgl_mk: any;
        no_reff: any;
        kode_sales: any;
        kode_cust: any;
        kode_ttb: any;
        kode_fj: any;
        kode_mu: any;
        kurs: any;
        kurs_pajak: any;
        kena_pajak: any;
        diskon_dok: any;
        total_mu: any;
        diskon_dok_mu: any;
        total_diskon_mu: any;
        total_pajak_mu: any;
        netto_mu: any;
        total_rp: any;
        diskon_dok_rp: any;
        total_diskon_rp: any;
        total_pajak_rp: any;
        netto_rp: any;
        kode_akun_diskon_dok: any;
        keterangan: any;
        status: any;
        userid: any;
        tgl_update: any;
        kode_jual: any;
        no_ttb: any;
        no_cust: any;
        nama_cust: any;
        dpp_mu: any;
        netto_mk: any;
        netto_fj: any;
    };
    const router = useRouter();
    const rowIdxListData = useRef(0);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [userMenu, setUserMenu] = useState<UserMenuState>({ baru: '', edit: '', hapus: '', cetak: '' });
    const kode_menu = '60102';

    const [isNoMkChecked, setIsNoMkChecked] = useState(false);
    const [noMk, setnoMk] = useState('');
    const [isTanggalChecked, setIsTanggalChecked] = useState<boolean>(true);
    const [tglAwal, settglAwal] = useState<moment.Moment>(moment());
    const [tglAkhir, settglAkhir] = useState<moment.Moment>(moment().endOf('month'));
    const [isNoFakturChecked, setisNoFakturChecked] = useState(false);
    const [noFaktur, setnoFaktur] = useState('');
    const [isNoTtbChecked, setIsNoTtbChecked] = useState(false);
    const [noTtb, setnoTtb] = useState('');
    const [isNoCustChecked, setisNoCustChecked] = useState(false);
    const [noCust, setnoCust] = useState('');
    const [isNamaCustChecked, setIsNamaCustChecked] = useState<boolean>(false);
    const [namaCustValue, setNamaCustValue] = useState<string>('');
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    // const [mkListData, setmkListData] = useState<[]>([]);

    const [showLoader, setShowLoader] = useState(true);

    function bypassBlokBrowserWindow() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(true);
            }, 1000);
        });
    }

    const contentLoader = () => {
        return (
            <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#ffffff00] dark:bg-[#060818]">
                <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
        );
    };

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

    const refreshListData = async () => {
        setSearchNoReff('');
        setsearchNamaCust('');
        // console.log('ddsfdfsdffsdf');
        if (kode_entitas !== null || kode_entitas !== '') {
            setShowLoader(true);
            try {
                let vNoMk = 'all';
                let vTglAwal = 'all';
                let vTglAkhir = 'all';
                let vNoFaktur = 'all';
                let vNoTtb = 'all';
                let vNoCust = 'all';
                let vNamaCust = 'all';
                let vlimit = '1000';

                if (isNoMkChecked) {
                    vNoMk = `${noMk}`;
                }

                if (isTanggalChecked) {
                    vTglAwal = `${tglAwal.format('YYYY-MM-DD')}`;
                    vTglAkhir = `${tglAkhir.format('YYYY-MM-DD')}`;
                }

                if (isNoFakturChecked) {
                    vNoFaktur = `${noFaktur}`;
                }

                if (isNoTtbChecked) {
                    vNoTtb = `${noTtb}`;
                }

                if (isNoCustChecked) {
                    vNoCust = `Y`;
                }

                if (isNamaCustChecked) {
                    vNamaCust = `Y`;
                }

                const response = await axios.get(`${apiUrl}/erp/list_mk?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: vNoMk,
                        param2: vTglAwal,
                        param3: vTglAkhir,
                        param4: vNoFaktur,
                        param5: vNoTtb,
                        param6: vNoCust,
                        param7: vNamaCust,
                        param8: vlimit,
                    },
                    headers: { Authorization: `Bearer ${token}` },
                });
                const responseData = response.data.data;

                //# setRecordsDataDetail(responseData);
                // gridListData.dataSource = responseData;
                setTimeout(() => {
                    // setmkListData(responseData);
                    setRecordsDataDetail(responseData);
                    setShowLoader(false);
                }, 300);
            } catch (error) {
                console.error(error);
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

    useEffect(() => {
        refreshListData();
        // console.log('rerere');
    }, []);

    // const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#3b3f5c' };

    const styleButton = { width: 57 + 'px', height: '28px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em' };
    const [state, setState] = useState({
        content: 'Detail Dok',
        iconCss: 'e-icons e-medium e-chevron-down',
    });

    const [masterDataState, setMasterDataState] = useState<string>('');
    const [masterKodeDokumen, setMasterKodeDokumen] = useState<string>('BARU');
    const [dialogInputDataVisible, setDialogInputDataVisible] = useState(false);
    const [selectedRowKodeMk, setSelectedRowKodeMk] = useState('');
    const [dataDetailDokMk, setDataDetailDokMk] = useState({ no_mk: '', tgl_mk: '' });
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [detailDok, setDetailDok] = useState<any[]>([]);
    const [searchNoReff, setSearchNoReff] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [recordsDataDetail, setRecordsDataDetail] = useState<MKListItem[]>([]);
    const [searchNoMk, setSearchNoMk] = useState('');
    const [searchNamaCust, setsearchNamaCust] = useState('');

    const [masterBarangProduksi, setMasterBarangProduksi] = useState<string>('Y');

    const showNewRecord = async () => {
        setMasterDataState('BARU');
        setMasterKodeDokumen('BARU');

        setDialogInputDataVisible(true);
    };

    const showEditRecord = async () => {
        if (selectedRowKodeMk === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px; color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        } else {
            setMasterDataState('EDIT');
            // const x = Buffer.from(`entitas=${kode_entitas}&kode_mpb=${selectedRowKodeMk}&jenis=edit`).toString('base64');
            // router.push({ pathname: './mk/component', query: { x_: x } });
            setMasterKodeDokumen(selectedRowKodeMk);
            setDialogInputDataVisible(true);
            // if (selectedRowKodeMk !== '') {
            //     setDialogInputDataVisible(true);
            // } else {
            //     withReactContent(swalToast).fire({
            //         icon: 'warning',
            //         title: '<p style="font-size:12px; color:white;">Kode Dokumen tidak terdeteksi</p>',
            //         width: '100%',
            //         customClass: {
            //             popup: styles['colored-popup'], // Custom class untuk sweetalert
            //         },
            //     });
            //     setDialogInputDataVisible(false);
            //     return;
            // }
        }
    };

    const onCreate = () => {
        sidebarObj.element.style.visibility = '';
    };
    const toggleClick = () => {
        setSidebarVisible(true);
    };
    const closeClick = () => {
        setSidebarVisible(false);
    };

    //======= Setting hak akses user ... ========
    let disabledBaru = false;
    let disabledEdit = false;
    let disabledHapus = false;
    let disabledCetak = false;
    let sidebarObj: SidebarComponent;
    let type: SidebarType = 'Push';
    let mediaQueryState: string = '(min-width: 600px)';

    let cMenuCetak: ContextMenuComponent;
    let gridListData: Grid | any;
    let selectedListData: any[] = [];

    function btnPrintClick(e: any): void {
        var clientRect = (e.target as Element).getBoundingClientRect();
        cMenuCetak.open(clientRect.bottom, clientRect.left);
    }

    let menuCetakItems: MenuItemModel[] = [
        {
            iconCss: 'e-icons e-thumbnail',
            text: 'Form Memo Kredit',
            id: '1',
        },
        {
            iconCss: 'e-icons e-thumbnail',
            text: 'Daftar Memo Kredit',
            id: '2',
        },
    ];

    const OnClick_CetakFormMk = (selectedRowKodeMk: any, tag: any) => {
        if (selectedRowKodeMk === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Silahkan pilih data TTB terlebih dahulu</p>',
                width: '100%',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
            return;
        }

        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        if (tag === '1') {
            let iframe = `
            <html><head>
            <title>Form Memo Kredit | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/rpDMk?entitas=${kode_entitas}&param1=${selectedRowKodeMk}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

            let win = window.open(
                '',
                '_blank',
                `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`,
            );

            if (win) {
                setShowLoader(true);
                setTimeout(() => {
                    let link = win!.document.createElement('link');
                    link.type = 'image/png';
                    link.rel = 'shortcut icon';
                    link.href = '/favicon.png';
                    win!.document.getElementsByTagName('head')[0].appendChild(link);
                    win!.document.write(iframe);
                    setShowLoader(false);
                }, 300);
            } else {
                console.error('Window failed to open.');
            }
        } else if (tag === '2') {
            const vParamsList1 = {
                param1: isTanggalChecked ? tglAwal.format('YYYY-MM-DD') : 'all',
            };
            const vParamsList2 = {
                param2: isTanggalChecked ? tglAkhir.format('YYYY-MM-DD') : 'all',
            };

            let iframe = `
            <html><head>
            <title>Daftar Memo Kredit | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/rpMMk?entitas=${kode_entitas}&param1=${vParamsList1.param1}&param2=${vParamsList2.param2}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
            </body></html>`;

            let win = window.open(
                '',
                '_blank',
                `status=no,width=${width},height=${height},resizable=yes
          ,left=${leftPosition},top=${topPosition}
          ,screenX=${leftPosition},screenY=${topPosition}
          ,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no`,
            );

            if (win) {
                let link = win!.document.createElement('link');
                link.type = 'image/png';
                link.rel = 'shortcut icon';
                link.href = '/favicon.png';
                win!.document.getElementsByTagName('head')[0].appendChild(link);
                win!.document.write(iframe);
            } else {
                console.error('Window failed to open.');
            }
        }
    };

    function menuCetakSelect(args: MenuEventArgs) {
        // console.log('cetak ', args.item.id);
        OnClick_CetakFormMk(selectedRowKodeMk, args.item.id);
        // SetDataDokumenMk('cetak', selectedRowKodeMk, kode_entitas, dataDetailDokMk, router, setSelectedItem, setDetailDok);
    }

    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    //================ Disable hari minggu di calendar ==============
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    const closeModal = () => {
        setSelectedItem(null);
    };

    const [modalPosition, setModalPosition] = useState({ top: '3%', right: '2%', width: '40%', background: '#dedede' });
    const [windowHeight, setWindowHeight] = useState(0);
    const gridWidth = sidebarVisible ? 'calc(100% - 315px)' : '100%';

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

    const tanggalSekarang = moment();
    // Menentukan tanggal awal bulan
    const tanggalAwalBulan = tanggalSekarang.startOf('month');
    // Menentukan tanggal akhir bulan dengan moment.js
    const tanggalHariIni = moment(new Date()).format('YYYY-MM-DD');
    const tanggalAkhirBulan = moment(tanggalAwalBulan.endOf('month')).format('YYYY-MM-DD');

    const actionBeginDetailBarang = async (args: any) => {
        // if (args.requestType === 'refresh') {
        //     // console.log('tes', args);
        //     let vNoMk = 'all';
        //     let vTglAwal = tanggalHariIni;
        //     let vTglAkhir = tanggalAkhirBulan;
        //     let vNoFaktur = 'all';
        //     let vNoTtb = 'all';
        //     let vNoCust = 'all';
        //     let vNamaCust = 'all';
        //     let vlimit = '1000';
        //     let paramObject = {
        //         kode_entitas: kode_entitas,
        //         vNoMk: vNoMk, // No TTB
        //         vTglAwal: vTglAwal, // Tanggal Awal
        //         vTglAkhir: vTglAkhir, // Tanggal Akhir
        //         vNoFaktur: vNoFaktur, // nama Relasi
        //         vNoTtb: vNoTtb, // No Reff
        //         vNamaCust: vNamaCust, // Kode Gudang
        //         vlimit: vlimit, // Grp
        //         vNoCust: vNoCust,
        //     };
        //     const responseData = await GetListMk(paramObject);
        //     setRecordsDataDetail(responseData);
        //     // console.log(responseData);
        //     // console.log('actionBegin Request type: ' + args.requestType);
        // }
    };

    const actionCompleteDetailBarang = async (args: any) => {
        if (args.requestType === 'refresh') {
            // console.log('actionComplete Request type: ' + args.requestType);
        }
    };

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

    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            if (getValue('status', args.data) == 'Tertutup') {
                args.row.style.background = '#f5f4f4';
            } else if (getValue('status', args.data) == 'Proses') {
                args.row.style.background = '#fbffc8';
            } else {
                args.row.style.background = '#ffffff';
            }
        }
    };

    const queryCellInfoListData = (args: any) => {
        if (args.column?.field === 'status') {
            if (getValue('status', args.data) == 'Tertutup') {
                args.cell.style.color = 'red';
            } else if (getValue('status', args.data) == 'Proses') {
                args.cell.style.color = 'maroon';
            }
        }
        if (args.column?.field === 'status_app') {
            if (getValue('status_app', args.data) == 'Disetujui') {
                args.cell.style.color = 'green';
            } else if (getValue('status_app', args.data) == 'Koreksi') {
                args.cell.style.color = 'maroon';
            } else if (getValue('status_app', args.data) == 'Ditolak') {
                args.cell.style.color = 'red';
            } else {
                args.cell.style.color = 'blue';
            }
        }
    };
    let tooltipListData: Tooltip | any;
    const columnListData: Object = {
        'No. MK': 'Nomor dokumen tanda terima barang',
        Tanggal: 'Tanggal dokumen Memo Kredit',
        Divisi: 'Kode penjual',
        'No. Faktur': 'No. Faktur ',
        'No TTB': 'No. TTB',
        'Netto FJ': 'Netto FJ',
        'Netto MK': 'Netto MK',
        'No. Customer': 'No. Customer',
        'Nama Customer': 'Nama Customer',
    };
    const beforeRenderListData = (args: TooltipEventArgs) => {
        const description = (columnListData as any)[(args as any).target.innerText];
        if (description) {
            tooltipListData.content = description;
        }
    };
    const formatFloat: Object = { skeleton: 'C3', format: ',0.####;-,0.#####;#', maximumFractionDigits: 4 };

    const headerTabel = () => {
        const bgcolor = 'tranparent';
        const fcolor = '#5d676e';
        return (
            <TooltipComponent content="Gagal Kirim" opensOn="Hover" openDelay={1000} position="BottomCenter">
                <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3 }}>
                    <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                        Gagal
                        <br />
                        Kirim
                    </span>
                </div>
            </TooltipComponent>
        );
    };

    return (
        <div className="Main" id="main-target">
            <div>
                {showLoader && contentLoader()}
                <div className="grid grid-cols-12 gap-2" style={{ minHeight: '40px', marginTop: '-3px', marginBottom: '11px' }}>
                    <div className="col-span-6">
                        <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
                            <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} target="#btnRefresh">
                                <TooltipComponent content="Membuat memo kredit baru" opensOn="Hover" openDelay={1000} target="#btnBaru">
                                    <TooltipComponent content="Edit data memo kredit" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                        <TooltipComponent content="Hapus data memo kredit" opensOn="Hover" openDelay={1000} target="#btnHapus">
                                            <TooltipComponent content="Cetak data memo kredit" opensOn="Hover" openDelay={1000} target="#btnCetak">
                                                <TooltipComponent content="Tampilkan detail memo kredit" opensOn="Hover" openDelay={1000} target="#btnDetail">
                                                    {/* <TooltipComponent content="Persetujuan dokumen" opensOn="Hover" openDelay={1000} target="#btnApproval"> */}
                                                    <ButtonComponent
                                                        id="btnBaru"
                                                        cssClass="e-primary e-small"
                                                        style={styleButton}
                                                        disabled={disabledBaru}
                                                        // onClick={() => HandleButtonClick('BARU', 'baru', router)}
                                                        onClick={showNewRecord}
                                                        content="Baru"
                                                    ></ButtonComponent>

                                                    <ButtonComponent
                                                        id="btnEdit"
                                                        cssClass="e-primary e-small"
                                                        style={styleButton}
                                                        disabled={disabledEdit}
                                                        onClick={showEditRecord}
                                                        content="Ubah"
                                                    ></ButtonComponent>
                                                    <ButtonComponent
                                                        id="btnFilter"
                                                        cssClass="e-primary e-small"
                                                        style={
                                                            sidebarVisible
                                                                ? { width: '57px', height: '28px', marginBottom: '0.5em', marginTop: '0.5em', marginRight: '0.8em' }
                                                                : { ...styleButton, color: 'white' }
                                                        }
                                                        // disabled={disabledFilter}
                                                        disabled={sidebarVisible}
                                                        //onClick={showFilterData}
                                                        onClick={toggleClick}
                                                        content="Filter"
                                                    ></ButtonComponent>

                                                    <ButtonComponent
                                                        id="btnHapus"
                                                        cssClass="e-primary e-small"
                                                        style={styleButton}
                                                        disabled={disabledHapus}
                                                        // onClick={showDeleteRecord}
                                                        content="Hapus"
                                                    ></ButtonComponent>

                                                    <ContextMenuComponent
                                                        id="cMenuCetak"
                                                        ref={(scope) => (cMenuCetak = scope as any)}
                                                        items={menuCetakItems}
                                                        select={menuCetakSelect}
                                                        animationSettings={{ duration: 800, effect: 'FadeIn' }}
                                                    />

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

                                                    <ButtonComponent
                                                        id="btnDetail"
                                                        cssClass="e-primary e-small"
                                                        style={{ width: 100 + 'px', marginBottom: '0.5em', marginTop: 0.5 + 'em', marginRight: 0.8 + 'em', backgroundColor: '#e6e6e6', color: 'black' }}
                                                        disabled={false}
                                                        onClick={() => SetDataDokumenMk('detailDok', selectedRowKodeMk, kode_entitas, dataDetailDokMk, router, setSelectedItem, setDetailDok)}
                                                        iconCss={state.iconCss}
                                                        content={state.content}
                                                    ></ButtonComponent>

                                                    {/* <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}> */}
                                                    <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                        <TextBoxComponent
                                                            id="cariNoMk"
                                                            className="searchtext"
                                                            placeholder="Cari Nomor MK"
                                                            showClearButton={true}
                                                            //input={(args: FocusInEventArgs) => {
                                                            input={(args: ChangeEventArgsInput) => {
                                                                const value: any = args.value;
                                                                PencarianNoMk(value, setSearchNoMk, setFilteredData, recordsDataDetail);
                                                            }}
                                                            floatLabelType="Never"
                                                        />
                                                    </div>

                                                    <div className="form-input ml-3 mr-1" style={{ width: '180px', display: 'inline-block' }}>
                                                        <TextBoxComponent
                                                            id="cariNamaCust"
                                                            className="searchtext"
                                                            placeholder="Cari Nama Customer"
                                                            showClearButton={true}
                                                            //input={(args: FocusInEventArgs) => {
                                                            input={(args: ChangeEventArgsInput) => {
                                                                const value: any = args.value;
                                                                PencarianNamaCust(value, setsearchNamaCust, setFilteredData, recordsDataDetail);
                                                            }}
                                                        />
                                                    </div>
                                                    {/* </TooltipComponent> */}
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </TooltipComponent>
                                    </TooltipComponent>
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </div>
                    <div className="col-span-6">
                        <div className="flex justify-end">
                            <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                                Memo Kredit (MK) - (Retur Penjualan Tunai)
                            </span>
                        </div>
                    </div>
                </div>

                <div id="main-content" style={{ position: 'sticky', overflow: 'hidden' }} className="flex !gap-6">
                    <SidebarComponent
                        id="default-sidebar"
                        target={'#main-content'}
                        ref={(Sidebar) => (sidebarObj = Sidebar as any)}
                        // style={{ background: 'transparent', visibility: 'hidden', marginRight: '0.8em' }}
                        style={{
                            background: '#dedede',
                            marginRight: '2rem',
                            display: 'block',
                            visibility: sidebarVisible ? 'visible' : 'hidden',
                            // maxHeight: `100px`,
                            overflowY: 'auto',
                            // borderRight:'2px',
                        }}
                        created={onCreate}
                        //showBackdrop={showBackdrop}
                        type={type}
                        // width="315px"
                        width="315px"
                        height={200}
                        mediaQuery={mediaQueryState}
                        isOpen={true}
                        open={() => setSidebarVisible(true)}
                        close={() => setSidebarVisible(false)}
                    >
                        {/* ===============  Filter Data ========================   */}
                        {/* {disabledFilter && ( */}
                        <div className="panel-filter p-3" style={{ background: '#dedede', width: '100%' }}>
                            <div className="flex items-center text-center">
                                <button
                                    className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900"
                                    //onClick={toggleFilterData}
                                    onClick={closeClick}
                                >
                                    <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                </button>
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
                                <h5 className="text-lg font-bold ltr:ml-3 rtl:mr-3">Filtering Data</h5>
                            </div>
                            <div className="mb-5 mt-3 h-px w-full border-b border-black dark:border-[#1b2e4b]"></div>
                            <div className="flex flex-col items-center justify-between" id="Candil">
                                <div id="inputFilter">
                                    <div className="flex">
                                        <CheckBoxComponent
                                            label="No. MK"
                                            checked={isNoMkChecked}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setIsNoMkChecked(value);
                                            }}
                                            style={{ borderRadius: 3, borderColor: 'gray' }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between">
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                placeholder=""
                                                value={noMk}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandleNoMkInputChange(value, setnoMk, setIsNoMkChecked);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between">
                                        <CheckBoxComponent
                                            label="Tanggal"
                                            checked={isTanggalChecked}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setIsTanggalChecked(value);
                                            }}
                                        />
                                    </div>

                                    <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                        <div className="form-input mt-1 flex justify-between">
                                            <DatePickerComponent
                                                locale="id"
                                                cssClass="e-custom-style"
                                                renderDayCell={onRenderDayCell}
                                                enableMask={true}
                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                showClearButton={false}
                                                format="dd-MM-yyyy"
                                                value={tglAwal.toDate()}
                                                change={(args: ChangeEventArgsCalendar) => {
                                                    HandleTgl(moment(args.value), 'tanggalAwal', settglAwal, settglAkhir, setIsTanggalChecked);
                                                }}
                                            >
                                                <Inject services={[MaskedDateTime]} />
                                            </DatePickerComponent>
                                        </div>
                                        <p className="set-font-11 ml-0.5 mr-0.5 mt-3 flex justify-between">s/d</p>
                                        <div className="form-input mt-1 flex justify-between">
                                            <DatePickerComponent
                                                locale="id"
                                                cssClass="e-custom-style"
                                                renderDayCell={onRenderDayCell}
                                                enableMask={true}
                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                showClearButton={false}
                                                format="dd-MM-yyyy"
                                                value={tglAkhir.toDate()}
                                                change={(args: ChangeEventArgsCalendar) => {
                                                    HandleTgl(moment(args.value), 'tanggalAkhir', settglAwal, settglAkhir, setIsTanggalChecked);
                                                }}
                                            >
                                                <Inject services={[MaskedDateTime]} />
                                            </DatePickerComponent>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between">
                                        <CheckBoxComponent
                                            label="No. Faktur"
                                            checked={isNoFakturChecked}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setisNoFakturChecked(value);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between">
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                placeholder=""
                                                value={noFaktur}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandleNoFakturInputChange(value, setnoFaktur, setisNoFakturChecked);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between">
                                        <CheckBoxComponent
                                            label="No. TTB"
                                            checked={isNoTtbChecked}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setIsNoTtbChecked(value);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between">
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                placeholder=""
                                                value={noTtb}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandleNoTtbInputChange(value, setnoTtb, setIsNoTtbChecked);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between">
                                        <CheckBoxComponent
                                            label="No. Customer"
                                            checked={isNoCustChecked}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setisNoCustChecked(value);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between">
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                placeholder=""
                                                value={noCust}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandleNoCustInputChange(value, setnoCust, setisNoCustChecked);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between">
                                        <CheckBoxComponent
                                            label="Nama Customer"
                                            checked={isNamaCustChecked}
                                            change={(args: ChangeEventArgsButton) => {
                                                const value: any = args.checked;
                                                setIsNamaCustChecked(value);
                                            }}
                                        />
                                    </div>

                                    <div className="mt-1 flex justify-between">
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                placeholder=""
                                                value={namaCustValue}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandleNamaCustInputChange(value, setNamaCustValue, setIsNamaCustChecked);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <TooltipComponent content="Refresh data yang ditampilkan" opensOn="Hover" openDelay={1000} position="BottomCenter">
                                        <ButtonComponent
                                            cssClass="e-primary e-small"
                                            iconCss="e-icons e-medium e-refresh"
                                            content="Refresh Data"
                                            style={{ backgroundColor: '#3b3f5c', marginTop: '15px' }}
                                            onClick={refreshListData}
                                        />
                                    </TooltipComponent>
                                </div>
                            </div>
                        </div>
                    </SidebarComponent>
                    {/* ===============  Grid Data ========================   */}
                    {/* <div className="panel" style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 325px' : ' 0'), overflowY: 'auto' }}> */}
                    <div
                        className="panel border-l-[5px] border-white"
                        // className="panel "
                        style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 315px' : ' 0'), overflowY: 'auto' }}
                    >
                        <div className="panel-data" style={{ width: '100%' }}>
                            <TooltipComponent ref={(t: any) => (tooltipListData = t)} opensOn="Hover" beforeRender={beforeRenderListData} target=".e-headertext">
                                <TabComponent id="defaultTab">
                                    <div className="e-tab-header" style={{ marginBottom: 10 }}>
                                        <div> Data List </div>
                                    </div>
                                    <div className="e-content">
                                        <GridComponent
                                            id="gridListData"
                                            locale="id"
                                            ref={(g: any) => (gridListData = g)}
                                            // dataSource={searchNoMk !== '' || searchNamaCust !== '' ? filteredData : recordsDataDetail}
                                            dataSource={recordsDataDetail}
                                            allowExcelExport={true}
                                            excelExportComplete={ExportComplete}
                                            allowPdfExport={true}
                                            pdfExportComplete={ExportComplete}
                                            editSettings={{ allowDeleting: true }}
                                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                                            allowPaging={true}
                                            allowSorting={true}
                                            allowFiltering={false}
                                            allowResizing={true}
                                            autoFit={true}
                                            allowReordering={true}
                                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                            rowHeight={22}
                                            width={'100%'}
                                            height={500}
                                            gridLines={'Both'}
                                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                                            queryCellInfo={queryCellInfoListData}
                                            rowDataBound={rowDataBoundListData}
                                            rowSelected={(args) => HandleRowSelected(args, setSelectedRowKodeMk)}
                                            // recordDoubleClick={(args) => HandleRowDoubleClicked(args, userMenu, kode_entitas, router, gridListData, selectedListData)}
                                            recordDoubleClick={showEditRecord}
                                            rowSelecting={(args) => RowSelectingListData(args, setDataDetailDokMk, kode_entitas, setDetailDok)}
                                            // actionBegin={actionBeginDetailBarang}
                                            // actionComplete={actionCompleteDetailBarang}
                                            dataBound={() => {
                                                if (gridListData) {
                                                    gridListData.selectRow(rowIdxListData.current);
                                                }
                                            }}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective
                                                    field="no_mk"
                                                    headerText="No. MK"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                />
                                                <ColumnDirective
                                                    field="tgl_mk"
                                                    headerText="Tanggal"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="100"
                                                    clipMode="EllipsisWithTooltip"
                                                    type="date"
                                                    format={formatDate}
                                                />
                                                <ColumnDirective
                                                    field="kode_jual"
                                                    headerText="Divisi"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="80"
                                                    clipMode="EllipsisWithTooltip"
                                                />

                                                <ColumnDirective
                                                    field="no_reff"
                                                    headerText="No. Faktur"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    clipMode="EllipsisWithTooltip"
                                                />

                                                <ColumnDirective
                                                    field="no_ttb"
                                                    headerText="No. TTB"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    clipMode="EllipsisWithTooltip"
                                                />

                                                {/*  */}

                                                <ColumnDirective
                                                    field="netto_fj"
                                                    headerText="Netto FJ"
                                                    format={formatFloat}
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                    clipMode="EllipsisWithTooltip"
                                                />

                                                <ColumnDirective
                                                    field="netto_mk"
                                                    headerText="Netto MK"
                                                    format={formatFloat}
                                                    headerTextAlign="Center"
                                                    textAlign="Right"
                                                    //autoFit
                                                    width="110"
                                                    clipMode="EllipsisWithTooltip"
                                                />

                                                <ColumnDirective
                                                    field="no_cust"
                                                    headerText="No. Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Center"
                                                    //autoFit
                                                    width="110"
                                                    clipMode="EllipsisWithTooltip" /*freeze="Left"*/
                                                />

                                                <ColumnDirective
                                                    field="nama_cust"
                                                    headerText="Customer"
                                                    headerTextAlign="Center"
                                                    textAlign="Left"
                                                    //autoFit
                                                    width="300"
                                                    clipMode="EllipsisWithTooltip"
                                                />
                                            </ColumnsDirective>
                                            <Inject services={[Page, Selection, Edit, /*Toolbar,*/ Sort, Group, Filter, Resize, Reorder /*, Freeze,*/, ExcelExport, PdfExport]} />
                                        </GridComponent>
                                    </div>
                                </TabComponent>
                            </TooltipComponent>
                            {/*============ Tampilkan popup menu untuk print dan simpan ke file ================*/}
                            <ContextMenuComponent id="contextmenu" target=".e-gridheader" items={menuHeaderItems} select={menuHeaderSelect} animationSettings={{ duration: 800, effect: 'FadeIn' }} />
                        </div>
                    </div>
                </div>
            </div>
            {/*==================================================================================================*/}
            {selectedItem && (
                <Draggable>
                    <div className={`${styles.modalDetailDragable}`} style={modalPosition}>
                        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                            <div style={{ marginBottom: 21 }}>
                                <span style={{ fontSize: 18, fontWeight: 500 }}>
                                    Detail MK : {dataDetailDokMk.no_mk} - {moment(dataDetailDokMk.tgl_mk).format('DD-MM-YYYY')}
                                </span>
                            </div>
                            <GridComponent dataSource={detailDok} height={200} width={700} gridLines={'Both'} allowSorting={true} ref={(g: any) => (gridListData = g)}>
                                <ColumnsDirective>
                                    <ColumnDirective field="no_item" headerText="No. Barang" width="50" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="diskripsi" headerText="Nama Barang" width="125" textAlign="Left" headerTextAlign="Left" />
                                    <ColumnDirective field="satuan" headerText="Satuan" width="50" textAlign="Center" headerTextAlign="Center" />
                                    <ColumnDirective field="qty" format="N2" headerText="Kuantitas" width="50" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective field="harga_mu" format="N2" headerText="Harga" width="50" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective field="diskon" headerText="Diskon" width="50" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective field="potongan_mu" format="N2" headerText="Potongan" width="50" textAlign="Right" headerTextAlign="Center" />
                                    <ColumnDirective field="jumlah_mu" format="N2" headerText="Jumlah" width="50" textAlign="Right" headerTextAlign="Center" />
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
            {dialogInputDataVisible && (
                <FrmMk
                    userid={userid}
                    kode_entitas={kode_entitas}
                    masterKodeDokumen={masterKodeDokumen}
                    masterDataState={masterDataState}
                    // masterBarangProduksi={masterBarangProduksi}
                    isOpen={dialogInputDataVisible}
                    onClose={() => {
                        setDialogInputDataVisible(false);
                    }}
                    onRefresh={refreshListData}
                    kode_user={kode_user}
                />
            )}
        </div>
    );
};

// export { getServerSideProps };
export default MkList;
