import React, { useEffect, useRef, useState } from 'react';
import GridList from './GridList';
import { motion } from 'framer-motion';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import Swal from 'sweetalert2';
import DialogBaruEditBOK from './modal/DialogBaruEditBOK';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import idIDLocalization from 'public/syncfusion/locale.json';
import { useSession } from '@/pages/api/sessionContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import { viewPeriode } from '@/utils/routines';
import { handleInputChange, HandleSearchKeteranganDataBok, HandleSearchNoDataBok, HandleTgl } from './function/function';
import { RiRefreshFill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { FaArrowDown, FaCalendar } from 'react-icons/fa';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';

const tabKlasifikasiArray = [
    {
        Klasifikasi: 'Semua',
        kelas: 'semua',
    },
    {
        Klasifikasi: 'Terbuka',
        kelas: 'terbuka ',
    },
    {
        Klasifikasi: 'Proses',
        kelas: 'proses',
    },
    {
        Klasifikasi: 'Tertutup',
        kelas: 'tertutup',
    },
];

export default function BokList() {
    const { sessionData } = useSession();
    const dispatch = useDispatch();
    const tabId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('tabId') || '' : '';
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const router = useRouter();
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';

    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    let items: any = [
        {
            text: 'Form BOK',
        },
        {
            text: 'Daftar BOK',
        },
    ];
    const gridBok = useRef<Grid | any>(null);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const refRefresh = useRef<any>(null);
    const checkboxRef = useRef<any>(null);
    const [periode, setPeriode] = useState<any>('');

    const [tglSekarang, setTglSekarang] = useState(new Date());
    const [tanggalAkhir, setTanggalAkhir] = useState(moment().endOf('month').toDate());

    //components state
    const [rowIdx, setRowIdx] = useState(null);
    const [date1, setDate1] = useState<moment.Moment>(moment());
    const [date2, setDate2] = useState<moment.Moment>(moment().endOf('month'));
    const [isTanggalChecked, setIsTanggalChecked] = useState<boolean>(true);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [bokList, setBokList] = useState([]);
    const [isScreenWide, setScreenWide] = useState(false);
    const [originalDataSource, setOriginalDataSource] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [originalNonModified, setOriginalNonModified] = useState([]);
    //modal state
    const [visibleBaruEditBok, setVisibleBaruEditBok] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    //crud state
    const [masterState, setMasterState] = useState('');
    const [masterData, setMasterData] = useState({});
    const [filterKlasifikasi, setFilterKlasifikasi] = useState('semua');
    const [filterState, setFilterState] = useState({
        tanggal_awal: moment(),
        tanggal_akhir: moment().endOf('month'),
        no_bok: '',
        no_kendaraan: '',
        tujuan: '',
        pengemudi: '',
        keterangan: '',
    });
    const [checkboxState, setCheckboxState] = useState({
        no_bok: false,
        no_kendaraan: false,
        tujuan: false,
        pengemudi: false,
        keterangan: false,
    });

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    const refereshData = async () => {
        // console.log('ke hit bro');

        try {
            let param1 = moment(tglSekarang).format('YYYY-MM-DD');
            let param2 = moment(tanggalAkhir).format('YYYY-MM-DD');
            let param3 = checkboxState.no_bok && filterState.no_bok !== '' ? filterState.no_bok : 'all';
            let param4 = checkboxState.no_kendaraan && filterState.no_kendaraan !== '' ? filterState.no_kendaraan : 'all';
            let param5 = checkboxState.tujuan && filterState.tujuan !== '' ? filterState.tujuan : 'all';
            let param6 = checkboxState.pengemudi && filterState.pengemudi !== '' ? filterState.pengemudi : 'all';
            let param7 = checkboxState.keterangan && filterState.keterangan !== '' ? filterState.keterangan : 'all';
            const response = await axios.get(`${apiUrl}/erp/list_bok_dashboard?`, {
                params: {
                    entitas: kode_entitas,
                    param1,
                    param2,
                    param3,
                    param4,
                    param5,
                    param6,
                    param7,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const transformedData = response.data.data.map((item: any) => {
                return {
                    ...item,
                    liter: SpreadNumber(item.liter),
                    nominal: SpreadNumber(item.nominal),
                    servis: SpreadNumber(item.servis),
                    kmawal: SpreadNumber(item.kmawal),
                    kmakhir: SpreadNumber(item.kmakhir),
                    kmjarak: SpreadNumber(item.kmjarak),
                    jalan: SpreadNumber(item.jalan),
                    kenek: SpreadNumber(item.kenek),
                    parkir: SpreadNumber(item.parkir),
                    tol: SpreadNumber(item.tol),
                    bongkar: SpreadNumber(item.bongkar),
                    mel: SpreadNumber(item.mel),
                    lain: SpreadNumber(item.lain),
                    rasio: SpreadNumber(item.rasio),
                    jumlah_mu: SpreadNumber(item.jumlah_mu),
                    pilih: 'N',
                };
            });
            setOriginalDataSource(transformedData);
            gridBok.current.setProperties({ dataSource: response.data.data });
            gridBok.current!.refresh();
            setBokList(transformedData);
            setOriginalNonModified(response.data.data);
            setFilterKlasifikasi('semua');
        } catch (error: any) {
            if (error.response.status === 401) {
                console.log('tidak ter otirasi');
            }
        }
    };

    // const HandleSearchNamaDataBesiKom = (cek: any, cek2: any, cek3: any, cek4: any) => {};
    // console.log("bokList",bokList);

    useEffect(() => {
        const handleResize = () => {
            const isWide = window.innerWidth >= 1280;
            setScreenWide(isWide);
            if (!isWide) {
                setSidebarVisible(false); // Hide sidebar by default on small screens
            } else {
                setSidebarVisible(true); // Show sidebar on large screens
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // console.log("kode_entitas",kode_entitas);

    useEffect(() => {
        dispatch(setPageTitle(kode_entitas + ' | BOK'));
        if (refRefresh.current && kode_entitas) {
            const fetchData = async () => {
                try {
                    const periode = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);
                    setPeriode(periode);
                } catch (error) {
                    // console.error('Error:', error);
                }
            };

            fetchData();
            refereshData();
        }
    }, [kode_entitas]); // Hanya jalankan ketika kode_entitas berubah

    useEffect(() => {
        // Step 2: Ambil elemen dengan ID tertentu
        const checkbox = document.getElementsByClassName('e-checkselectall');

        if (checkbox) {
            checkboxRef.current = checkbox;

            // Step 3: Tetapkan elemen ke Ref
            checkboxRef.current.checked = true; // Centang otomatis
        }
    }, []);

    function formatString(input: string) {
        // Split berdasarkan underscore (_)
        const words = input.split('_');

        // Kapitalisasi huruf pertama setiap kata
        const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        // Gabungkan kembali dengan spasi
        return formattedWords.join(' ');
    }
    const rowSelecting = (args: any) => {
        setRowIdx(args.rowIndex);
    };

    const handleSelect = (args: any) => {
        const temp = {
            ...args.data,
            liter: String(SpreadNumber(args?.data?.liter)),
            nominal: String(SpreadNumber(args?.data?.nominal)),
            servis: String(SpreadNumber(args?.data?.servis)),
            kmawal: String(SpreadNumber(args?.data?.kmawal)),
            kmakhir: String(SpreadNumber(args?.data?.kmakhir)),
            kmjarak: String(SpreadNumber(args?.data?.kmjarak)),
            jalan: String(SpreadNumber(args?.data?.jalan)),
            kenek: String(SpreadNumber(args?.data?.kenek)),
            parkir: String(SpreadNumber(args?.data?.parkir)),
            tol: String(SpreadNumber(args?.data?.tol)),
            bongkar: String(SpreadNumber(args?.data?.bongkar)),
            mel: String(SpreadNumber(args?.data?.mel)),
            lain: String(SpreadNumber(args?.data?.lain)),
            rasio: String(SpreadNumber(args?.data?.rasio)),
            jumlah_mu: String(SpreadNumber(args?.data?.jumlah_mu)),
        };
        setSelectedRow(temp);
    };

    const pilihTemplate = (args: any) => {
        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={`hitung_kpi`}
                    className="mx-auto"
                    checked={args.pilih === 'Y'}
                    disabled={args.st === 'Tertutup'}
                    onChange={() => {
                        const temp = args.pilih === 'Y' ? 'N' : 'Y';
                        const tempArray = {
                            ...gridBok.current!.dataSource[args.index],
                            pilih: args.pilih === 'Y' ? 'N' : 'Y',
                        };
                        gridBok.current!.dataSource[args.index] = tempArray;
                        gridBok.current!.refresh();
                    }}
                />
            </div>
        );
    };

    console.log('selectedRow', selectedRow);

    const Cetak_Form_BOK = (onSaveDoc: any = '') => {
        if (Object.keys(selectedRow).length === 0) {
            return Swal.fire({
                icon: 'warning',
                target: '#main-target',
                title: 'Pilih Data Terlebihh Dahulu',
            });
        }
        console.log('selectedRow?.kode_fk', selectedRow?.kode_fk);

        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        let iframe = `
                <html><head>
                <title>Form BOK | Next KCN Sytem</title>
                <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
                </head><body>
                <iframe src="./report/form_bok?entitas=${kode_entitas}&param1=${
            onSaveDoc !== '' ? onSaveDoc : selectedRow?.kode_fk
        }&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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
    const Cetak_Daftar_BOK = () => {
        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        let param1 = moment(tglSekarang).format('YYYY-MM-DD');
        let param2 = moment(tanggalAkhir).format('YYYY-MM-DD');
        let param3 = checkboxState.no_bok && filterState.no_bok !== '' ? filterState.no_bok : 'all';
        let param4 = checkboxState.no_kendaraan && filterState.no_kendaraan !== '' ? filterState.no_kendaraan : 'all';
        let param5 = checkboxState.tujuan && filterState.tujuan !== '' ? filterState.tujuan : 'all';
        let param6 = checkboxState.pengemudi && filterState.pengemudi !== '' ? filterState.pengemudi : 'all';
        let param7 = checkboxState.keterangan && filterState.keterangan !== '' ? filterState.keterangan : 'all';

        let iframe = `
                <html><head>
                <title>Daftar BOK | Next KCN Sytem</title>
                <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
                </head><body>
                <iframe src="./report/daftar_bok?entitas=${kode_entitas}&param1=${param1}&param2=${param2}&param3=${param3}&param4=${param4}&param5=${param5}&param7=${param7}&param6=${param6}&token=${token}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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

    const handleSelectCetak = (args: any) => {
        if (Object.keys(selectedRow).length === 0) {
            // swal.fire({
            //     title: 'Pilih Data terlebih dahulu.',
            //     icon: 'error',
            // });
            Swal.fire({
                icon: 'warning',
                target: '#main-target',
                title: 'Pilih Data Terlebihh Dahulu',
            });
            return;
        }
        if (args.item.text === 'Form BOK') {
            Cetak_Form_BOK('');
        } else {
            Cetak_Daftar_BOK();
        }
    };
    const cekPeriode = (dateNow: any) => {
        console.log('PERIODE EDIT', dateNow);

        const periodeReal = periode.match(/(\d+)\s\w+\s(\d{4})/);
        const peride = periode.split('-')[1].split('s/d')[0];
        console.log('peride', peride);

        if (periodeReal) {
            // Output: "7/2024"

            const tanggal_sekarang = dateNow.split(' ')[0]; // Format: dd-mm-yyyy
            console.log('tanggal_sekarang', dateNow);

            const tanggalSekarangMoment = moment(tanggal_sekarang, 'YYYY-MM-DD').format('DD-MM-YYYY');

            // Parsing periode ke tanggal awal bulan untuk membandingkan
            const dataPeriodeMoment = moment(peride.trimStart(), 'D MMMM YYYY').format('DD-MM-YYYY');

            const momentA = moment(tanggalSekarangMoment, 'DD-MM-YYYY');
            const momentB = moment(dataPeriodeMoment, 'DD-MM-YYYY');

            // Membandingkan apakah b <= a
            const isBeforeOrEqual = momentB.isSameOrBefore(momentA);

            // Membandingkan tanggal
            if (isBeforeOrEqual === false) {
                Swal.fire({
                    icon: 'warning',
                    target: '#main-target',
                    title: 'Tanggal Transaksi Lebih kecil dari tanggal periode',
                });
                return false;
            } else {
                return true;
            }
        } else {
            Swal.fire({
                icon: 'warning',
                target: '#main-target',
                title: 'Periode Tidak Valid',
            });
        }
    };
    const handleRecordDoubleClick = (args: any) => {
        if (selectedRow.st === 'Tertutup' || selectedRow.st === 'Proses') {
            return Swal.fire({
                icon: 'warning',
                target: '#main-target',
                title: 'Dokumen Terbuka Atau Tertutup Tidak bisa di edit',
            });
        }

        const isCekPeriode = cekPeriode(selectedRow.tgl_fk);
        if (isCekPeriode === false) {
            return;
        }

        setMasterState('EDIT');
        setVisibleBaruEditBok(true);
    };

    // const checkboxTemplate = (props: any) => {
    //     console.log("props",props);

    //     return (
    //         <input
    //             className='cursor-pointer'
    //             type="checkbox"
    //             id='pilih'
    //             onChange={() => {
    //                 setBokList((prevList: any) =>
    //                     prevList.map((item: any) =>
    //                         item.kode_fk === props.kode_fk ? { ...item, pilih: props.pilih === 'Y' ? 'N' : 'Y' } : item
    //                     )
    //                 );
    //             }}
    //             checked={props.pilih === 'Y'}
    //             disabled={props.st === 'Tertutup'} // Disable checkbox jika st === "Tertutup"
    //         />
    //     );
    // };

    const filterStatus = (kelas: any) => {
        if (kelas === 'Semua') {
            setBokList(originalDataSource);
            return;
        }
        const temp = originalDataSource.filter((item: any) => item.st === kelas);

        setBokList(temp);
    };

    return (
        <div className="Main overflow-visible" id="main-target">
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
                        #checkbox-grid-column8 {
                           margin-left: auto;
                        }
                `}
            </style>
            {visibleBaruEditBok ? (
                <DialogBaruEditBOK
                    visible={visibleBaruEditBok}
                    onClose={() => {
                        setVisibleBaruEditBok(false);
                        setMasterData({});
                        setMasterState('');
                    }}
                    kode_entitas={kode_entitas}
                    masterState={masterState}
                    masterData={selectedRow}
                    refereshData={refereshData}
                    token={token}
                    userid={userid}
                    Cetak_Form_BOK={Cetak_Form_BOK}
                />
            ) : null}

            <div className="flex items-center gap-3 space-x-2  p-1 ">
                <button
                    className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]"
                    onClick={() => {
                        setVisibleBaruEditBok(true);
                        setMasterState('BARU');
                    }}
                >
                    Baru
                </button>
                <button className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]" onClick={handleRecordDoubleClick}>
                    Ubah
                </button>
                <button
                    className={`rounded-md px-4 py-1.5 text-xs font-semibold  transition-colors duration-200 ${
                        isSidebarVisible ? 'bg-gray-200 text-gray-500' : 'bg-[#3a3f5c] text-white hover:bg-[#2f3451]'
                    }`}
                    onClick={() => setSidebarVisible(!isSidebarVisible)}
                >
                    Filter
                </button>
                <button
                    onClick={() => {
                        console.log('muncul cetak');
                        setIsDropdownOpen(true);
                    }}
                    className="relative flex items-center gap-1 rounded-md bg-[#3a3f5c] px-4  py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                >
                    Cetak <FaArrowDown />
                    {isDropdownOpen && (
                        <div
                            className="absolute left-0 top-5 z-20 mt-2 w-40 rounded-md border border-gray-300 bg-white shadow-lg"
                            onMouseLeave={() => {
                                console.log('exit cetak');
                                setIsDropdownOpen(false);
                            }}
                        >
                            <ul className="py-1 text-sm text-gray-700">
                                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={() => Cetak_Form_BOK('')}>
                                    Form BOK
                                </li>
                                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100" onClick={Cetak_Daftar_BOK}>
                                    Daftar BOK
                                </li>
                            </ul>
                        </div>
                    )}
                </button>

                <Link className="text-xs font-semibold text-gray-700 hover:text-blue-500 " href={`/kcn/ERP/dashboard/biaya-operasional-kendaraan/analisa-bok/AnalisaBOK?tabId=${tabId}`}>
                    Analisa BOK
                </Link>
                <div className="flex items-center space-x-2 border-l border-gray-400 pl-2">
                    <span className="mr-2">Cari</span>
                    <input
                        type="text"
                        id="<No Dokumen>"
                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="<No. Bukti>"
                        name="No_Dokumen_Search"
                        // value={filterState.diameter_real_timbangan}
                        // onChange={(e) => handleInputChange(setFilterState, setCheckboxState, e)}
                        onChange={(e: any) => {
                            HandleSearchNoDataBok(e.target.value, setFilterState, setBokList, originalDataSource);
                        }}
                        onFocus={(e: any) => {
                            HandleSearchNoDataBok(e.target.value, setFilterState, setBokList, originalDataSource);
                        }}
                        // style={{ height: '4vh' }}
                        autoComplete="off"
                    />
                    <input
                        type="text"
                        id="No_Distributor_Search"
                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="<Keterangan>"
                        name="No_Distributor_Search"
                        onChange={(e: any) => {
                            HandleSearchKeteranganDataBok(e.target.value, setFilterState, setBokList, originalDataSource);
                        }}
                        onFocus={(e: any) => {
                            HandleSearchKeteranganDataBok(e.target.value, setFilterState, setBokList, originalDataSource);
                        }}
                        // style={{ height: '4vh' }}
                        autoComplete="off"
                    />
                </div>
                {' | '}
                <button
                    className="text-xs font-semibold text-gray-700 hover:text-blue-500"
                    onClick={() => {
                        const temp = gridBok.current!.dataSource.map((item: any) => {
                            if (item.st === 'Tertutup') {
                                return {
                                    ...item,
                                    pilih: 'N',
                                };
                            } else {
                                return {
                                    ...item,
                                    pilih: item.pilih === 'Y' ? 'N' : 'Y',
                                };
                            }
                        });
                        gridBok.current!.dataSource = temp;
                        gridBok.current!.refresh();
                    }}
                >
                    Pilih Semua
                </button>
            </div>
            <div className="relative flex  h-full w-full gap-1">
                {isSidebarVisible && (
                    <div className="relative flex min-w-[250px] max-w-[260px] flex-col items-center justify-between overflow-hidden rounded-lg border-blue-400 bg-gray-300">
                        <div className="h-[30px]  w-full bg-[#dedede] py-1 pl-2">
                            Filter
                            <button
                                className="absolute right-3 top-1 flex items-center justify-center rounded-full border border-black p-0.5 text-xs"
                                onClick={() => setSidebarVisible(!isSidebarVisible)}
                            >
                                <IoClose />
                            </button>
                        </div>
                        <div className={`flex h-full w-full flex-col items-center rounded border border-black-light `}>
                            <div className="flex h-full flex-col items-center overflow-x-auto bg-[#dedede] p-1 px-1.5">
                                <div className="flex items-center">
                                    <div className="flex w-[45%] items-center">
                                        <DatePicker
                                            showIcon
                                            id="tglSekarang"
                                            selected={tglSekarang}
                                            onChange={(date: Date) => setTglSekarang(date)}
                                            dateFormat="dd-MM-yyyy"
                                            className="w-[100%] rounded border border-gray-300"
                                            calendarClassName="left-16"
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <div className="relative flex items-center">
                                                    <input
                                                        className="w-full rounded border border-gray-300 py-1 pl-8 pr-2 text-[11px]"
                                                        type="text"
                                                        readOnly
                                                        value={moment(tglSekarang).format('DD-MM-YYYY')}
                                                    />
                                                    <FaCalendar
                                                        className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                        style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                    />
                                                </div>
                                            }
                                        />
                                    </div>
                                    <span>S/D</span>
                                    <div className="flex w-[45%] items-center">
                                        <DatePicker
                                            showIcon
                                            calendarIconClassname="text-sm"
                                            id="tanggalAkhir"
                                            selected={tanggalAkhir}
                                            onChange={(date: Date) => setTanggalAkhir(date)}
                                            dateFormat="dd-MM-yyyy"
                                            className="w-[100%] rounded border border-gray-300"
                                            calendarClassName="right-16"
                                            showYearDropdown
                                            dropdownMode="select"
                                            customInput={
                                                <div className="relative flex items-center">
                                                    <input
                                                        className="w-full rounded border border-gray-300 py-1 pl-8 pr-2 text-[11px]"
                                                        type="text"
                                                        readOnly
                                                        value={moment(tanggalAkhir).format('DD-MM-YYYY')}
                                                    />
                                                    <FaCalendar
                                                        className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                        style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                    />
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.no_bok}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    no_bok: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        {formatString('no_bok')}
                                    </label>
                                    <input
                                        type="text"
                                        id="no_bok"
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder={formatString('no_bok')}
                                        name="no_bok"
                                        // value={filterState.no_bok}
                                        onChange={(e) => handleInputChange(setFilterState, setCheckboxState, e)}
                                        // style={{ height: '4vh' }}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.no_kendaraan}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    no_kendaraan: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        {formatString('no_kendaraannn')}
                                    </label>
                                    <input
                                        type="text"
                                        id="no_kendaraan"
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder={formatString('no_kendaraan')}
                                        name="no_kendaraan"
                                        value={filterState.no_kendaraan}
                                        onChange={(e) => handleInputChange(setFilterState, setCheckboxState, e)}
                                        // style={{ height: '4vh' }}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.tujuan}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    tujuan: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        {formatString('tujuan')}
                                    </label>
                                    <input
                                        type="text"
                                        id="tujuan"
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder={formatString('tujuan')}
                                        name="tujuan"
                                        value={filterState.tujuan}
                                        onChange={(e) => handleInputChange(setFilterState, setCheckboxState, e)}
                                        // style={{ height: '4vh' }}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.pengemudi}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    pengemudi: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        {formatString('pengemudi')}
                                    </label>
                                    <input
                                        type="text"
                                        id="pengemudi"
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder={formatString('pengemudi')}
                                        name="pengemudi"
                                        value={filterState.pengemudi}
                                        onChange={(e) => handleInputChange(setFilterState, setCheckboxState, e)}
                                        // style={{ height: '4vh' }}
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.keterangan}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    keterangan: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        {formatString('keterangan')}
                                    </label>
                                    <input
                                        type="text"
                                        id="keterangan"
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder={formatString('keterangan')}
                                        name="keterangan"
                                        value={filterState.keterangan}
                                        onChange={(e) => handleInputChange(setFilterState, setCheckboxState, e)}
                                        // style={{ height: '4vh' }}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                            <div className="flex h-[10%] w-full items-center justify-center bg-white">
                                <button
                                    onClick={() => refereshData()}
                                    ref={refRefresh}
                                    className="ml-3 flex h-7 items-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                                >
                                    <RiRefreshFill className="text-md" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className={` flex-1 overflow-x-auto rounded  bg-[#dedede] p-2`}>
                    <div className="h-ful w-full rounded bg-white p-1 ">
                        <div className=" flex h-[30px] w-full overflow-x-auto overflow-y-hidden border-b border-gray-300">
                            {tabKlasifikasiArray.map((item: any) => (
                                <motion.button
                                    key={item.kelas}
                                    onClick={async () => {
                                        setFilterKlasifikasi(item.kelas);
                                        filterStatus(item.Klasifikasi);
                                    }}
                                    className={`whitespace-nowrap px-3 py-2 text-xs font-semibold ${
                                        filterKlasifikasi === item.kelas ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'
                                    }`}
                                    whileTap={{ scale: 1.1 }} // Menambahkan animasi scale saat ditekan
                                    transition={{ duration: 0.2 }}
                                >
                                    {item.Klasifikasi}
                                </motion.button>
                            ))}
                        </div>
                        <div className="overflow-y-auto">
                            <GridList
                                rowSelecting={rowSelecting}
                                bokList={bokList}
                                handleSelect={handleSelect}
                                handleRecordDoubleClick={handleRecordDoubleClick}
                                formatDate={formatDate}
                                gridBok={gridBok}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
