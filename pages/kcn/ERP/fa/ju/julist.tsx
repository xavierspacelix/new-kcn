import { useSession } from '@/pages/api/sessionContext';
import { useEffect, useState, useRef } from 'react';
import { MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import Dropdown from '../../../../../components/Dropdown';
import axios from 'axios';
import swal from 'sweetalert2';
import moment from 'moment';
import { SidebarComponent, SidebarType, ContextMenuComponent, MenuItemModel, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
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
    Aggregate,
    AggregatesDirective,
    AggregateDirective,
    AggregateColumnsDirective,
    AggregateColumnDirective,
} from '@syncfusion/ej2-react-grids';
import { ButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { faArrowsRotate, faMagnifyingGlass, faPlay, faSquareCaretDown, faTimes, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usersMenu, viewPeriode } from '@/utils/routines';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import ModalJurnalUmumProps from './modal/ju';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import idIDLocalization from 'public/syncfusion/locale.json';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import * as React from 'react';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
enableRipple(true);
let gridListDataJU: Grid | any;
let gridListDataJUDetail: Grid | any;
let paramList: any;

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
    const [statusEdit, setStatusEdit] = useState(false); // filter
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [modalJurnalUmum, setModalJurnalUmum] = useState<any>(false); // Modal
    const [modalDetail, setModalDetail] = useState(false); // Modal Detail
    const [detailFetch, setDetailFetch] = useState<any>('');
    const [pageSize, setPageSize] = useState(25);
    const [selectedRow ,setSelectedRow] = useState<any>(null);

    const [periode,setPeriode] = useState<any>('');

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
        if (!args || !args.item) {
            console.log('Menu event args or item is undefined.');
            return;
        }
        const { text } = args.item;
        if (text === 'Cetak ke printer') {
            gridListDataJU.print();
        } else if (text === 'PDF') {
            gridListDataJU.showSpinner();
            gridListDataJU.pdfExport();
        } else if (text === 'XLSX') {
            gridListDataJU.showSpinner();
            gridListDataJU.excelExport();
        } else if (text === 'CSV') {
            gridListDataJU.showSpinner();
            gridListDataJU.csvExport();
        } else {
            console.log('Unhandled menu item:', text);
        }
    };

    const ExportComplete = (): void => {
        gridListDataJU.hideSpinner();
    };

    const gridWidth = sidebarVisible ? 'calc(100% - 290px)' : '100%';
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
                const formattedDate1 = moment(date1).format('YYYY-MM-DD');
                const formattedDate2 = moment(date2).format('YYYY-MM-DD');
                vTglAwal = `${formattedDate1}`;
                vTglAkhir = `${formattedDate2}`;
            }

            if (isTanggalBuatChecked) {
                const formattedDate1 = moment(date3).format('YYYY-MM-DD');
                const formattedDate2 = moment(date4).format('YYYY-MM-DD');
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

            paramList = {
                entitas: kode_entitas,
                param1: vNoBukti, // no_bukti
                param2: vTglAwal, // tgl_awal
                param3: vTglAkhir, // tgl_akhir
                param4: vCatatan, // catatan
                param5: vTglBuatAwal, // tgl_buat_awal
                param6: vTglBuatAkhir, // tgl_buat_akhir
                param7: pageSize,
            };

            const responseData = response.data.data;
            console.log("responseData",responseData);
            
            setShowLoader(false);

            const modifiedResponseData = responseData.map((item: any) => {
                return {
                    ...item,
                    jumlah_rp: parseFloat(item.jumlah_rp),
                };
            });

            console.log(modifiedResponseData);
            if (gridListDataJU) {
                gridListDataJU.dataSource = modifiedResponseData;
            }
            if (userid !== 'administrator' && userid !== 'ADMINISTRATOR') {
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
        const fetchData = async () => {
            try {
                const periode = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);
                setPeriode(periode);
            } catch (error) {
                // console.error('Error:', error);
            }
        };
        fetchData();
    }, [kode_entitas]);

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const halfScreenWidth = window.screen.availWidth / 2;
            if (screenWidth < halfScreenWidth) {
                setSidebarVisible(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        setShowLoader(true);
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
                    const formattedDate1 = moment(date1).format('YYYY-MM-DD');
                    const formattedDate2 = moment(date2).format('YYYY-MM-DD');
                    vTglAwal = `${formattedDate1}`;
                    vTglAkhir = `${formattedDate2}`;
                }

                if (isTanggalBuatChecked) {
                    const formattedDate1 = moment(date3).format('YYYY-MM-DD');
                    const formattedDate2 = moment(date4).format('YYYY-MM-DD');
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

                console.log({
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

                paramList = {
                    entitas: kode_entitas,
                    param1: vNoBukti, // no_bukti
                    param2: vTglAwal, // tgl_awal
                    param3: vTglAkhir, // tgl_akhir
                    param4: vCatatan, // catatan
                    param5: vTglBuatAwal, // tgl_buat_awal
                    param6: vTglBuatAkhir, // tgl_buat_akhir
                    param7: pageSize,
                };

                const responseData = response.data.data;
                const modifiedResponseData = responseData.map((item: any) => {
                    return {
                        ...item,
                        jumlah_rp: parseFloat(item.jumlah_rp),
                    };
                });

                console.log(modifiedResponseData);
                gridListDataJU.dataSource = modifiedResponseData;
                setShowLoader(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleInputNoBukti = (value: any) => {
        console.log(value);
        setNoBuktiValue(value);
        setIsNoBuktiChecked(value.length > 0);
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

    const handleInputKeterangan = (value: any) => {
        setKeteranganValue(value);
        setIsKeteranganChecked(value.length > 0);
    };

    const handleRowSelected = (args: any) => {
        console.log(args.data.kode_dokumen);
        setSelectedRowKode(args.data.kode_dokumen);
        console.log("args",args);
        
        setSelectedRow(args.data);
        //sini lanjut
        setSelectedRowNoJU({ no_ju: args.data.no_dokumen, tgl_ju: args.data.tgl_dokumen });
    };

    const handleShowFilter = (value: any) => {
        if (value) {
            setSidebarVisible(true);
        } else {
            setSidebarVisible(false);
        }
    };

    const dateFormat = (field: any, data: any) => {
        return data[field] ? moment(data[field]).format('DD-MM-YYYY') : '';
    };

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

    const OnClick_CetakForm = (jenis: any) => {
        console.log(paramList);
        console.log(selectedRowKode);
        const param = {
            entitas: kode_entitas,
            param1: selectedRowKode,
        };
        // Encode Base64
        const strCommand = btoa(JSON.stringify(param));

        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        // } else {
        let iframe: any;
        if (jenis === '1') {
            if (selectedRowKode === '') {
                myAlert('Silahkan pilih data terlebih dahulu.');
                return;
            }
            iframe = `
                        <html><head>
                        <title>Form Jurnal Umum | Next KCN Sytem</title>
                        <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
                        </head><body>
                        <iframe src="./report/form_ju?entitas=${kode_entitas}&param1=${selectedRowKode}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
                        </body></html>`;
        } else if (jenis === '2') {
            iframe = `
                    <html><head>
                    <title>List Jurnal Umum | Next KCN Sytem</title>
                    <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
                    </head><body>
                    <iframe src="./report/list_ju?entitas=${paramList.entitas}&param1=${paramList.param1}&param2=${paramList.param2}&param3=${paramList.param3}&param4=${paramList.param4}&param5=${paramList.param5}&param6=${paramList.param6}&param7=${paramList.param7}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
                    </body></html>`;
        }

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
        }
        // }
    };

    const cekPeriode = (dateNow: any) => {
        console.log("PERIODE EDIT",dateNow);
        
        
        const periodeReal = periode.match(/(\d+)\s\w+\s(\d{4})/);
        const peride = periode.split('-')[1].split('s/d')[0]
        console.log("peride",peride);
        
        if (periodeReal) {
       
            // Output: "7/2024"
            
            const tanggal_sekarang = dateNow.split(' ')[0]; // Format: dd-mm-yyyy
            console.log("tanggal_sekarang",dateNow);
    
            const tanggalSekarangMoment = moment(tanggal_sekarang, 'YYYY-MM-DD').format('DD-MM-YYYY');
    
            // Parsing periode ke tanggal awal bulan untuk membandingkan
            const dataPeriodeMoment = moment(peride.trimStart(),"D MMMM YYYY").format('DD-MM-YYYY');
            
            const momentA = moment(tanggalSekarangMoment, 'DD-MM-YYYY');
            const momentB = moment(dataPeriodeMoment, 'DD-MM-YYYY');
            
    
    // Membandingkan apakah b <= a
    const isBeforeOrEqual = momentB.isSameOrBefore(momentA);
            
            // Membandingkan tanggal
            if (isBeforeOrEqual === false) {
              myAlert('Tanggal Transaksi lebih kecil dari tanggal periode.');
              return false
            } else {
              return true
            }
          } else {
            myAlert('Periode tidak valid');
          }
    }

    const handleActionBegin = (args: any) => {
        console.log(args.requestType);
        if (args.requestType === 'paging' && args.currentPage) {
            console.log(args.pageSize);
            // setPageSize(args.pageSize);
            paramList = {
                ...paramList,
                param7: args.pageSize,
            };
        }
    };

    return (
        <div className="main" id="main-target">
            {showLoader && contentLoader()}
            {/* =================================BUTTON=================================== */}
            <div style={{ minHeight: '40px', marginTop: '-3px', marginBottom: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        onClick={() => handleShowFilter(true)}
                        disabled={sidebarVisible}
                        content="Filter"
                        style={sidebarVisible ? { color: 'white', marginLeft: 5, backgroundColor: '#dedede' } : { backgroundColor: 'rgb(59 63 92)', marginLeft: 5, color: 'white' }}
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
                                            onClick={() => OnClick_CetakForm('1')}
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
                                            onClick={() => OnClick_CetakForm('2')}
                                            disabled={userMenu.cetak === 'Y' ? false : true}
                                            // disabled={true}
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
                <div style={{ float: 'right' }} className="flex items-center justify-between">
                    <div className="mr-auto">
                        <span className="font-serif text-lg font-bold" style={{ fontSize: 16, fontFamily: 'roboto' }}>
                            Jurnal Umum (JU)
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
                    width="290px"
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
                                        checked={isNoBuktiChecked}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsNoBuktiChecked(value);
                                        }}
                                        style={{ borderRadius: 3, borderColor: 'gray' }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <TextBoxComponent placeholder="" value={noBuktiValue} input={(args) => handleInputNoBukti(args.value)} />
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
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(date1).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggalAwal');
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
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(date2).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggalAkhir');
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Tanggal Buat"
                                        checked={isTanggalBuatChecked}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsTanggalBuatChecked(value);
                                        }}
                                    />
                                </div>

                                <div className={`grid grid-cols-1 justify-between gap-1 sm:flex `}>
                                    <div className="form-input mt-1 flex justify-between">
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(date3).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTglBuat(args.value, 'tanggalAwal');
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
                                            enableMask={true}
                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(date4).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTglBuat(args.value, 'tanggalAkhir');
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </div>
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <CheckBoxComponent
                                        label="Keterangan"
                                        checked={isKeteranganChecked}
                                        change={(args: ChangeEventArgsButton) => {
                                            const value: any = args.checked;
                                            setIsKeteranganChecked(value);
                                        }}
                                    />
                                </div>

                                <div className="mt-1 flex justify-between">
                                    <div className="container form-input">
                                        <TextBoxComponent
                                            placeholder=""
                                            value={keteranganValue}
                                            input={(args: FocusInEventArgs) => {
                                                const value: any = args.value;
                                                handleInputKeterangan(value);
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
                    style={{ background: '#dedede', width: gridWidth, margin: 'auto auto auto' + (sidebarVisible ? ' 290px' : ' 0'), overflowY: 'auto', borderRadius: 7 }}
                >
                    <div className="panel-data" style={{ width: '100%' }}>
                        <div className="e-content">
                            <div>
                                <GridComponent
                                    id="gridListDataJU"
                                    locale="id"
                                    ref={(g) => (gridListDataJU = g)}
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
                                    rowSelecting={handleRowSelected}
                                    recordDoubleClick={() => {
                                        const isCekPeriode =  cekPeriode(selectedRow.tgl_dokumen);
                                if(isCekPeriode === false){
                                    return
                                }
                                        setStatusEdit(true);
                                        setModalJurnalUmum(true);
                                        console.log(selectedRowKode);
                                    }}
                                    rowHeight={23}
                                    pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                                    allowResizing={true}
                                    autoFit={true}
                                    actionBegin={handleActionBegin}
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
                                    <AggregatesDirective>
                                        <AggregateDirective>
                                            <AggregateColumnsDirective>
                                                <AggregateColumnDirective field="jumlah_rp" type="Sum" format="N2" footerTemplate="${Sum}" />
                                            </AggregateColumnsDirective>
                                        </AggregateDirective>
                                    </AggregatesDirective>
                                    <Inject services={[Page, Sort, Filter, Group, Resize, Aggregate]} />
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
                </div>
                {/* ===============  END GRID ========================   */}
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
