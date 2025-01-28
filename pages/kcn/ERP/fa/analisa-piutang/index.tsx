import {
    PivotViewComponent,
    Inject,
    FieldList,
    CalculatedField,
    Toolbar,
    PDFExport,
    ExcelExport,
    ConditionalFormatting,
    NumberFormatting,
    GroupingBar,
    VirtualScroll,
    DrillThrough,
    Grouping,
} from '@syncfusion/ej2-react-pivotview';

import { select, createElement } from '@syncfusion/ej2-base';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useSession } from '@/pages/api/sessionContext';
import idIDLocalization from 'public/syncfusion/locale.json';
import axios from 'axios';
import { tanpaKoma } from '@/utils/global/fungsi';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);

interface FilterListState {
    kategori: any[];
    kelompok_produk: any[];
    merek: any[];
}

const DataPiutang = {
    jenis: '',
    no_cust: '',
    nama_relasi: '',
    kota: '',
    wilayah: '',
    kelas: '',
    no_sales: '',
    nama_sales: '',
    no_fj: '',
    tgl_fj: '',
    tahun: 0,
    bulan: 0,
    kategori: '',
    kelompok: '',
    merek: '',
    pilihan1: '',
    pilihan2: '',
    pilihan3: '',
    pilihan4: '',
    pilihan5: '',
    tgl_tempo: '',
    jatuh_tempo: null,
    tgl_faktur: null,
    umur: 0,
    tempo: '',
    jumlah: 0,
    sales_penjual: '',
    nama_om: null,
    nama_spv: null,
};

/**
 * PivotView Toolbar Sample
 */

let pivotObj: any;
let toolbarOptions: any = ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'Grid', 'Chart', 'SubTotal', 'GrandTotal'];
function PivotToolbar() {
    const { sessionData } = useSession();
    const dispatch = useDispatch();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    function queryCellInfo(args: any) {
        if (args.cell && args.cell.classList.contains('e-valuescontent') && args.data && args.data[0].hasChild) {
            let pivotValues;
            let colIndex = Number(args.cell.getAttribute('data-colindex'));
            if (!isNaN(colIndex)) {
                pivotValues = pivotObj?.pivotValues[args.data[colIndex].rowIndex][args.data[colIndex].colIndex];
            }
            if (pivotValues && args.cell && args.cell.classList.contains(pivotValues.cssClass)) {
                args.cell.classList.remove(pivotValues.cssClass);
                pivotValues.style = undefined;
            }
        }
    }

    const [filterListState, setFilterListState] = useState<FilterListState>({
        kategori: [],
        kelompok_produk: [],
        merek: [],
    });

    const [listData, setListData] = useState<any>([]);

    const [filterState, setFilterState] = useState<any>({
        sampai_dengan: moment().format('YYYY-MM-DD'),
        data_piutang: '0',
        jenis_piutang: 'all',
        jatuh_tempo: moment().format('YYYY-MM-DD'),
        tanggal_faktur_awal: moment().format('YYYY-MM-DD'),
        tanggal_faktur_akhir: moment().endOf('month').format('YYYY-MM-DD'),
        umur: '',
        customer: '',
        salesman: '',
        kategori: '',
        kelompok_produk: '',
        merek: '',
    });

    const [checkboxState, setCheckboxState] = useState({
        jatuh_tempo: false,
        tanggal_faktur: false,
        umur: false,
        customer: false,
        salesman: false,
        kategori: false,
        kelompok_produk: false,
        merek: false,
    });

    let dataSourceSettings: any = {
        enableSorting: true,
        columns: [{ name: 'kota', caption: 'Kota' }],
        rows: [
            { name: 'nama_relasi', caption: 'Customer', expandAll: true },
            { name: 'jenis', caption: 'Piutang', expandAll: true },
        ],
        values: [
            { name: 'jumlah', caption: 'Jumlah Piutang', type: 'Sum', format: 'C0' },
            { name: 'jumlah', caption: 'AVG Piutang', type: 'Avg', format: 'N0' },
        ],
        filters: [
            { name: 'no_cust', caption: 'No. Cust' },
            { name: 'kelas', caption: 'klasifikasi' },
            { name: 'nama_sales', caption: 'Salesman' },
            { name: 'wilayah', caption: 'Wilayah' },
            { name: 'kategori', caption: 'Kategori' },
            // { name: 'kelompok', caption: 'Kelompok Produk' },
            // { name: 'merek', caption: 'Merek Produk' },
            // { name: 'pilihan1', caption: 'Pilihan-1' },
            // { name: 'pilihan2', caption: 'Pilihan-2' },
            // { name: 'pilihan3', caption: 'Pilihan-3' },
            // { name: 'pilihan4', caption: 'Pilihan-4' },
            // { name: 'pilihan5', caption: 'Pilihan-5' },
            // { name: 'no_fj', caption: 'No. Faktur' },
            // { name: 'tgl_faktur', caption: 'Tgl. Faktur' },
            // { name: 'tahun', caption: 'Tahun' },
            // { name: 'bulan', caption: 'Bulan' },
            // { name: 'umur', caption: 'Umur' },
            // { name: 'tgl_tempo', caption: 'Tgl. Tempo' },
            // { name: 'nama_om', caption: 'Nama OM' },
            // { name: 'nama_spv', caption: 'Nama SPV' },
            // { name: 'sales_penjual', caption: 'Sales Penjual' },
        ],
        // filterSettings: [
        //     { name: 'tempo', type: 'Exclude', items: ['> 365 Hari'] },
        // ],
        formatSettings: [
            { name: 'jumlah', format: 'N2' },
            { name: 'umur', format: 'N0' },
        ],
        dataSource: listData,
        expandAll: false,
        fieldMapping: [
            { name: 'no_cust', caption: 'No. Customer' },
            { name: 'nama_relasi', caption: 'Customer' },
            { name: 'kota', caption: 'Kota' },
            { name: 'wilayah', caption: 'Wilayah' },
            { name: 'kelas', caption: 'Kelasifikasi' },
            { name: 'jumlah', caption: 'Jumlah Piutang', dataType: 'number' },
            { name: 'umur', caption: 'Umur Piutang', dataType: 'number' },
            { name: 'tempo', caption: 'Tempo' },
            { name: 'sales_penjual', caption: 'Sales penjual' },
            { name: 'nama_om', caption: 'Nama Om' },
            { name: 'nama_spv', caption: 'Nama SPV' },
            { name: 'no_sales', caption: 'No. Sales' },
            { name: 'no_fj', caption: 'No. FJ' },
            { name: 'tgl_fj', caption: 'Tgl FJ' },
            { name: 'tgl_faktur', caption: 'Tgl Faktur' },
            { name: 'jatuh_tempo', caption: 'Jatuh Tempo' },
            { name: 'tgl_tempo', caption: 'Tgl Tempo' },
        ],
        // conditionalFormatSettings: [
        //     {
        //         measure: 'jumlah',
        //         value1: 0,
        //         value2: 1000000,
        //         conditions: 'Between',
        //         style: {
        //             backgroundColor: '#E10000',
        //             color: 'white',
        //             fontFamily: 'Tahoma',
        //             fontSize: '12px',
        //         },
        //     },
        //     {
        //         measure: 'jumlah',
        //         value1: 10000000,
        //         conditions: 'GreaterThan',
        //         style: {
        //             backgroundColor: '#0C860C',
        //             color: 'white',
        //             fontFamily: 'Tahoma',
        //             fontSize: '12px',
        //         },
        //     },
        // ],
        showHeaderWhenEmpty: false,
        emptyCellsTextContent: '-',
    };
    const [activeTab, setActiveTab] = useState('data_tab');
    function cellTemplate(args: any) {
        if (args.cellInfo && args.cellInfo.axis === 'row' && args.cellInfo.valueSort.axis === 'university') {
            let imgElement = createElement('img', {
                className: 'university-logo',
                attrs: {
                    src: listData[args.cellInfo.index[0]]?.logo,
                    alt: args.cellInfo.formattedText + ' Image',
                    width: '30',
                    height: '30',
                },
            });
            let cellValue = select('.e-cellvalue', args.targetCell);
            cellValue.classList.add('e-hyperlinkcell');
            cellValue.addEventListener('click', hyperlinkCellClick.bind(pivotObj));
            args.targetCell.insertBefore(imgElement, cellValue);
        }
        return '';
    }

    const refreshListData = async () => {
        if (kode_entitas !== null && kode_entitas !== '') {
            try {
                let param1 = filterState.sampai_dengan;
                let param2 = 0;
                let param3 = 'all';
                let param4 = 'all';
                let param5 = 'all';
                let param6 = 'all';
                let param7 = 'all';
                let param8 = 'all';
                let param9 = 'all';
                let param10 = 'all';
                let param11 = 'all';
                let param12 = 'all';

                if (checkboxState.jatuh_tempo) {
                    param10 = filterState.jatuh_tempo;
                }

                if (checkboxState.tanggal_faktur) {
                    param11 = filterState.tanggal_faktur_awal;
                    param12 = filterState.tanggal_faktur_akhir;
                }

                if (checkboxState.umur) {
                    param8 = filterState.umur;
                }

                if (checkboxState.customer) {
                    param3 = filterState.customer;
                }

                if (checkboxState.salesman) {
                    param4 = filterState.salesman;
                }

                if (checkboxState.kategori) {
                    param5 = filterState.kategori;
                }

                if (checkboxState.kelompok_produk) {
                    param6 = filterState.kelompok_produk;
                }

                if (checkboxState.merek) {
                    param7 = filterState.merek;
                }

                if (filterState.jenis_piutang !== 'all') {
                    param9 = filterState.jenis_piutang;
                }

                if (filterState.data_piutang !== '0') {
                    param2 = filterState.data_piutang;
                }

                const response = await axios.get(`${apiUrl}/erp/analisa_piutang_ar?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: param1,
                        param2: param2,
                        param3: param3,
                        param4: param4,
                        param5: param5,
                        param6: param6,
                        param7: param7,
                        param8: param8,
                        param9: param9,
                        param10: param10,
                        param11: param11,
                        param12: param12,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responseData = response.data.data;
                const modData = responseData.map((item: any) => {
                    return {
                        ...item,
                        jumlah: tanpaKoma(item.jumlah), // Pastikan tanpaKoma mengubah string ke number
                    };
                });
                setListData(modData);
                setActiveTab('grid_tab');
                // dataSourceSettings.dataSource = response.data.data;
                console.log('Response AR :', responseData);

                // console.log('response supplier : ', { responseData });

                // setTimeout(() => {
                //     setDataSourceSupplier(responseData);
                //     setOriginalDataSource(responseData);

                // }, 300);
            } catch (error) {
                console.error('Error fetching data refreshListData:', error);
            }
        } else {
            // withReactContent(swalDialog).fire({
            //     title: `<p style="font-size:12px">Sesi login telah habis, silahkan login kembali.</p>`,
            //     icon: 'error',
            //     width: '360px',
            //     heightAuto: true,
            // });
            // setTimeout(() => {
            //     router.push({ pathname: '/' });
            // }, 1000);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        // Update filterState
        setFilterState((prev: any) => ({
            ...prev,
            [name]: value,
        }));

        // Update checkboxState
        setCheckboxState((prev) => ({
            ...prev,
            [name]: value.trim() !== '',
        }));
    };
    function hyperlinkCellClick(args: any) {
        let cell = args.target.parentElement;
        let pivotValue = pivotObj?.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('data-colindex'))];
        let link = listData[pivotValue.index[0]]?.link;
        window.open(link, '_blank');
    }
    function saveReport(args: any) {
        let reports = [];
        let isSaved = false;
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== '') {
            reports = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.report && args.reportName && args.reportName !== '') {
            let report = JSON.parse(args.report);
            report.dataSourceSettings.dataSource = [];
            report.pivotValues = [];
            args.report = JSON.stringify(report);
            reports.map(function (item: any) {
                if (args.reportName === item.reportName) {
                    item.report = args.report;
                    isSaved = true;
                }
            });
            if (!isSaved) {
                reports.push(args);
            }
            localStorage.pivotviewReports = JSON.stringify(reports);
        }
    }
    function fetchReport(args: any) {
        let reportCollection = [];
        let reportList: any = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== '') {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.forEach(function (item: any) {
            reportList.push(item.reportName);
        });
        args.reportName = reportList;
    }

    function loadReport(args: any) {
        let reportCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== '') {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.forEach(function (item: any) {
            if (args.reportName === item.reportName) {
                args.report = item.report;
            }
        });
        if (args.report) {
            let report = JSON.parse(args.report);
            report.dataSourceSettings.dataSource = pivotObj?.dataSourceSettings.dataSource || [
                {
                    jenis: '',
                    no_cust: '',
                    nama_relasi: '',
                    kota: '',
                    wilayah: '',
                    kelas: '',
                    no_sales: '',
                    nama_sales: '',
                    no_fj: '',
                    tgl_fj: '',
                    tahun: 0,
                    bulan: 0,
                    kategori: '',
                    kelompok: '',
                    merek: '',
                    pilihan1: '',
                    pilihan2: '',
                    pilihan3: '',
                    pilihan4: '',
                    pilihan5: '',
                    tgl_tempo: '',
                    jatuh_tempo: null,
                    tgl_faktur: null,
                    umur: 0,
                    tempo: '',
                    jumlah: 0,
                    sales_penjual: '',
                    nama_om: null,
                    nama_spv: null,
                },
            ];
            pivotObj.dataSourceSettings = report.dataSourceSettings;
        }
    }

    const handleTgl = async (date: any, tipe: string) => {
        if (tipe === 'tanggal_faktur_awal') {
            setFilterState((oldData: any) => ({
                ...oldData,
                tanggal_faktur_awal: moment(date).format('YYYY-MM-DD'),
            }));
            setCheckboxState((oldData: any) => ({
                ...oldData,
                tanggal_faktur: true,
            }));
        } else if (tipe === 'jatuh_tempo') {
            setFilterState((oldData: any) => ({
                ...oldData,
                jatuh_tempo: moment(date).format('YYYY-MM-DD'),
            }));
            setCheckboxState((oldData: any) => ({
                ...oldData,
                jatuh_tempo: true,
            }));
        } else if (tipe === 'sampai_dengan') {
            setFilterState((oldData: any) => ({
                ...oldData,
                sampai_dengan: moment(date).format('YYYY-MM-DD'),
            }));
            // setCheckboxState((oldData: any) => ({
            //     ...oldData,
            //     sampai_dengan: true
            // }))
        } else {
            setFilterState((oldData: any) => ({
                ...oldData,
                tanggal_faktur_akhir: moment(date).format('YYYY-MM-DD'),
            }));
            setCheckboxState((oldData: any) => ({
                ...oldData,
                tanggal_faktur: true,
            }));
        }
    };

    function removeReport(args: any) {
        let reportCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== '') {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection = reportCollection.filter((item: any) => item.reportName !== args.reportName);
        localStorage.pivotviewReports = JSON.stringify(reportCollection);
    }

    function renameReport(args: any) {
        let reportCollection = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== '') {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.isReportExists) {
            reportCollection = reportCollection.filter((item: any) => item.reportName !== args.rename);
        }
        reportCollection.forEach(function (item: any) {
            if (args.reportName === item.reportName) {
                item.reportName = args.rename;
            }
        });
        localStorage.pivotviewReports = JSON.stringify(reportCollection);
    }

    function newReport() {
        pivotObj?.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
    }
    function beforeToolbarRender(args: any) {
        args.customToolbar.splice(6, 0, {
            type: 'Separator',
        });
        args.customToolbar.splice(9, 0, {
            type: 'Separator',
        });
    }
    function chartOnLoad(args: any) {
        let selectedTheme = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1))
            .replace(/-dark/i, 'Dark')
            .replace(/contrast/i, 'Contrast')
            .replace(/-highContrast/i, 'HighContrast');
    }
    function chartSeriesCreated(args: any) {
        pivotObj.chartSettings.chartSeries.legendShape = pivotObj?.chartSettings.chartSeries.type === 'Polar' ? 'Rectangle' : 'SeriesType';
    }
    function excelQueryCellInfo(args: any) {
        if (args?.cell.axis === 'value' && args?.cell.value === undefined) {
            args.style.numberFormat = undefined;
        }
    }

    const dataKategori = async () => {
        const kategoriResponse = await axios.get(`${apiUrl}/erp/kategori?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kategori: kategoriResponse.data.data,
        }));
    };
    const dataKelompok = async () => {
        const kelompokResponse = await axios.get(`${apiUrl}/erp/kelompok?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            kelompok_produk: kelompokResponse.data.data,
        }));
    };
    const dataMerk = async () => {
        const kelompokResponse = await axios.get(`${apiUrl}/erp/merk?`, {
            params: {
                entitas: kode_entitas,
            },
        });
        setFilterListState((oldData) => ({
            ...oldData,
            merek: kelompokResponse.data.data,
        }));
    };

    useEffect(() => {
        if (token) {
            dispatch(setPageTitle(kode_entitas + ' | Analisa Piutang (AR)'));
            dataKategori();
            dataKelompok();
            dataMerk();
        }
    }, [token]);
    return (
        <div className="control-pane h-full w-full">
            <meta name="referrer" content="never"></meta>
            <div className="h-full w-full">
                <div className="-mt-5 flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab('data_tab')}
                        className={`px-3 py-2 text-xs font-semibold ${activeTab === 'data_tab' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        Data Customer
                    </button>
                    <button
                        onClick={() => setActiveTab('grid_tab')}
                        className={`px-3 py-2 text-xs font-semibold ${activeTab === 'grid_tab' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        Grid
                    </button>
                </div>
                <div className={`flex h-full w-full flex-col rounded border border-black-light bg-[#dedede] p-3 ${activeTab === 'data_tab' ? 'block' : 'hidden'}`}>
                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                        <DatePickerComponent
                            locale="id"
                            cssClass="e-custom-style"
                            enableMask={true}
                            showClearButton={false}
                            format="dd-MM-yyyy"
                            width={180}
                            value={moment(filterState.sampai_dengan).toDate()}
                            change={(args: ChangeEventArgsCalendar) => {
                                handleTgl(args.value, 'sampai_dengan');
                            }}
                            style={{
                                background: 'white',
                            }}
                        >
                            <Inject services={[MaskedDateTime]} />
                        </DatePickerComponent>
                        {/* <input
                            type="date"
                            name="sampai_dengan"
                            value={filterState.sampai_dengan}
                            onChange={handleInputChange}
                            className="w-[110px] rounded-sm border border-gray-400 bg-gray-50 p-0 text-xs leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            style={{ height: '20px' }}
                        />{' '} */}
                        Sampai Dengan
                    </label>

                    <hr />
                    <div className="flex">
                        <div className="kiri w-[35%]  p-2">
                            <div className="items-center font-bold text-black">
                                <span className="bg-[#dedede]">Data Piutang</span>
                                <div className="-mt-2 ml-2 flex flex-grow flex-col border border-black p-2">
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="data_piutang" value={'0'} checked={filterState.data_piutang === '0'} onChange={handleInputChange} className="mr-1" />
                                        Semua
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="data_piutang" value={'1'} checked={filterState.data_piutang === '1'} onChange={handleInputChange} className="mr-1" />
                                        Piutang Pelanggan
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="data_piutang" value={'2'} checked={filterState.data_piutang === '2'} onChange={handleInputChange} className="mr-1" />
                                        Piutang Warkat
                                    </label>
                                </div>
                            </div>
                            <div className="mt-3 items-center font-bold text-black">
                                <span className="bg-[#dedede]">Jenis Piutang</span>
                                <div className="-mt-2 ml-2 flex flex-grow flex-col border border-black p-2">
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="jenis_piutang" value="all" checked={filterState.jenis_piutang === 'all'} onChange={handleInputChange} className="mr-1" />
                                        Semua
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="jenis_piutang" value={'1'} checked={filterState.jenis_piutang === '1'} onChange={handleInputChange} className="mr-1" />
                                        Piutang Umum
                                    </label>
                                    <label className="flex items-center text-xs">
                                        <input type="radio" name="jenis_piutang" value={'2'} checked={filterState.jenis_piutang === '2'} onChange={handleInputChange} className="mr-1" />
                                        Piutang Group
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="kanan p-2">
                            <div className="space-y-4">
                                {/* Jatuh Tempo Pembayaran */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={checkboxState.jatuh_tempo}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    jatuh_tempo: e.target.checked,
                                                }))
                                            }
                                        />
                                        <label className="text-xs">Jatuh Tempo Pembayaran</label>
                                    </div>
                                    <DatePickerComponent
                                        locale="id"
                                        cssClass="e-custom-style"
                                        enableMask={true}
                                        showClearButton={false}
                                        format="dd-MM-yyyy"
                                        width={180}
                                        value={moment(filterState.jatuh_tempo).toDate()}
                                        change={(args: ChangeEventArgsCalendar) => {
                                            handleTgl(args.value, 'jatuh_tempo');
                                        }}
                                        style={{
                                            background: 'white',
                                        }}
                                    >
                                        <Inject services={[MaskedDateTime]} />
                                    </DatePickerComponent>
                                    {/* <input
                                        type="date"
                                        name="jatuh_tempo"
                                        value={filterState.jatuh_tempo}
                                        onChange={handleInputChange}
                                        className="ml-auto w-[110px] rounded-sm border border-gray-400 bg-gray-50 p-0 text-xs leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        style={{ height: '20px' }}
                                    /> */}
                                </div>

                                {/* Tanggal Faktur */}
                                <div className="flex ">
                                    <div className="flex w-80  items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={checkboxState.tanggal_faktur}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    tanggal_faktur: e.target.checked,
                                                }))
                                            }
                                        />
                                        <label className="text-xs">Tanggal Faktur</label>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            width={180}
                                            value={moment(filterState.tanggal_faktur_awal).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggal_faktur_awal');
                                            }}
                                            style={{
                                                background: 'white',
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                        {/* <input
                                            type="date"
                                            name="tanggal_faktur_awal"
                                            value={filterState.tanggal_faktur_awal}
                                            onChange={handleInputChange}
                                            className="w-[110px] rounded-sm border border-gray-400 bg-gray-50 p-0 text-xs leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            style={{ height: '20px' }}
                                        /> */}
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            width={180}
                                            style={{
                                                background: 'white',
                                            }}
                                            value={moment(filterState.tanggal_faktur_akhir).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggal_faktur_akhir');
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                        {/* <input
                                            type="date"
                                            name="tanggal_faktur_akhir"
                                            value={filterState.tanggal_faktur_akhir}
                                            onChange={handleInputChange}
                                            className="w-[110px] rounded-sm border border-gray-400 bg-gray-50 p-0 text-xs leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            style={{ height: '20px' }}
                                        /> */}
                                    </div>
                                </div>

                                {/* Umur Faktur */}
                                <div className="flex ">
                                    <div className="flex w-80 items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={checkboxState.umur}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    umur: e.target.checked,
                                                }))
                                            }
                                        />
                                        <label className="text-xs">Umur Faktur</label>
                                    </div>
                                    <select
                                        name="umur"
                                        value={filterState.umur}
                                        onChange={handleInputChange}
                                        className="mt-2 block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    >
                                        <option value="">Select Umur Faktur</option>
                                        <option value="30">30</option>
                                        <option value="45">45</option>
                                        <option value="60">60</option>
                                        <option value="90">90</option>
                                        <option value="120">120</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                customer: e.target.checked,
                                            }))
                                        }
                                        checked={checkboxState.customer}
                                        readOnly
                                    />{' '}
                                    Customer
                                </label>
                                <input
                                    type="text"
                                    id="customer"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Customer"
                                    name="customer"
                                    value={filterState.customer}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                salesman: e.target.checked,
                                            }))
                                        }
                                        checked={checkboxState.salesman}
                                        readOnly
                                    />{' '}
                                    salesman
                                </label>
                                <input
                                    type="text"
                                    id="salesman"
                                    className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Salesman"
                                    name="salesman"
                                    value={filterState.salesman}
                                    onChange={handleInputChange}
                                    style={{ height: '3vh' }}
                                />
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                kategori: e.target.checked,
                                            }))
                                        }
                                        checked={checkboxState.kategori}
                                        readOnly
                                    />{' '}
                                    kategori
                                </label>
                                <select
                                    name="kategori"
                                    value={filterState.kategori}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Kategori</option>
                                    {filterListState.kategori.map((item: any, index) => (
                                        <option value={item.grp} key={index}>
                                            {item.grp}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                kelompok_produk: e.target.checked,
                                            }))
                                        }
                                        checked={checkboxState.kelompok_produk}
                                        readOnly
                                    />{' '}
                                    kelompok produk
                                </label>
                                <select
                                    name="kelompok_produk"
                                    value={filterState.kelompok_produk}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Kelompok Produk</option>
                                    {filterListState.kelompok_produk.map((item: any, index) => (
                                        <option value={item.kel} key={index}>
                                            {item.kel}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-0.5 flex flex-col items-start">
                                <label className="mb-0.5 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        onChange={(e) =>
                                            setCheckboxState((prev) => ({
                                                ...prev,
                                                merek: e.target.checked,
                                            }))
                                        }
                                        checked={checkboxState.merek}
                                        readOnly
                                    />{' '}
                                    Merek
                                </label>
                                <select
                                    name="merek"
                                    value={filterState.merek}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-sm border border-gray-300 bg-gray-50 p-1 text-[10px] text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="">Select Merek</option>
                                    {filterListState.merek.map((item: any, index) => (
                                        <option value={item.merk} key={index}>
                                            {item.merk}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p>{`* Untuk banyak pilihan gunakan tanda koma.`}</p>

                            <button
                                onClick={refreshListData}
                                className="flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-black shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                                <span className="mr-2 text-yellow-500">
                                    {/* Ikon panah kanan */}
                                    ➡️
                                </span>
                                <span className="underline">Generate Data</span>
                            </button>
                        </div>
                    </div>
                </div>
                {activeTab === 'grid_tab' && (
                    <div className={`flex h-full w-full flex-col rounded border border-black-light ${activeTab === 'grid_tab' ? 'block' : 'hidden'}`}>
                        <div className="control-section h-full w-full" id="pivot-table-section" style={{ overflow: 'initial', overflowX: 'auto' }}>
                            <PivotViewComponent
                                id="PivotView"
                                ref={(scope) => {
                                    pivotObj = scope;
                                }}
                                dataSourceSettings={dataSourceSettings}
                                width={'100%'}
                                height={'600'}
                                showFieldList={true}
                                exportAllPages={false}
                                maxNodeLimitInMemberEditor={50}
                                cellTemplate={cellTemplate}
                                showGroupingBar={true}
                                allowGrouping={true}
                                enableVirtualization={true}
                                enableValueSorting={true}
                                allowDeferLayoutUpdate={true}
                                allowDrillThrough={true}
                                gridSettings={{
                                    columnWidth: 120,
                                    allowSelection: true,
                                    rowHeight: 25,
                                    selectionSettings: { mode: 'Cell', type: 'Multiple', cellSelectionMode: 'Box' },
                                    // excelQueryCellInfo: excelQueryCellInfo,
                                    // queryCellInfo: queryCellInfo,
                                }}
                                // allowExcelExport={true}
                                allowNumberFormatting={true}
                                allowConditionalFormatting={true}
                                // allowPdfExport={true}
                                showToolbar={true}
                                allowCalculatedField={true}
                                displayOption={{ view: 'Both' }}
                                toolbar={toolbarOptions}
                                newReport={newReport}
                                renameReport={renameReport}
                                removeReport={removeReport}
                                loadReport={loadReport}
                                fetchReport={fetchReport}
                                showTooltip={false}
                                saveReport={saveReport}
                                toolbarRender={beforeToolbarRender}
                                chartSettings={{ title: 'Analisis Piutang (AR)', load: chartOnLoad }}
                                chartSeriesCreated={chartSeriesCreated}
                                enableFieldSearching={true}
                            >
                                <Inject
                                    services={[
                                        FieldList,
                                        CalculatedField,
                                        Toolbar,
                                        // PDFExport,
                                        // ExcelExport,
                                        ConditionalFormatting,
                                        NumberFormatting,
                                        GroupingBar,
                                        Grouping,
                                        VirtualScroll,
                                        DrillThrough,
                                    ]}
                                />
                            </PivotViewComponent>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default PivotToolbar;

// const root = createRoot(document.getElementById('sample'));
// root.render(<PivotToolbar />);
