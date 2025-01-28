import React, { useRef, useState } from 'react';
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
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import idIDLocalization from 'public/syncfusion/locale.json';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';
import { select, createElement } from '@syncfusion/ej2-base';
import { useSession } from '@/pages/api/sessionContext';
import axios from 'axios';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);

let toolbarOptions: any = ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load', 'Grid', 'Chart', 'SubTotal', 'GrandTotal'];


const AnalisaBOK = () => {
    const { sessionData } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const pivotObj = useRef<any>(null);
    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };
    const [activeTab, setActiveTab] = useState('data_tab');
    const [listData, setListData] = useState<any>([]);
    const [checkboxState, setCheckboxState] = useState({
        supplier: false,
        no_kendaraan: false,
        tujuan: false,
        pengemudi: false,
        spbu: false,
        jenis_servis: false,
    });

    const [filterState, setFilterState] = useState({
        tanggal_awal: moment().startOf('month').format('YYYY-MM-DD'),
        tanggal_akhir: moment().format('YYYY-MM-DD'),
        supplier: '',
        no_kendaraan: '',
        tujuan: '',
        pengemudi: '',
        spbu: '',
        jenis_servis: '',
        data_biaya: '0',
    });
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
    const handleTgl = async (date: any, tipe: string) => {
        if (tipe === 'tanggal_awal') {
            setFilterState((oldData: any) => ({
                ...oldData,
                tanggal_awal: moment(date).format('YYYY-MM-DD'),
            }));
        } else {
            setFilterState((oldData: any) => ({
                ...oldData,
                tanggal_akhir: moment(date).format('YYYY-MM-DD'),
            }));
        }
    };
    const fetchData = async () => {
        if (kode_entitas !== null && kode_entitas !== '') {
            let param1 = filterState.data_biaya;
            let param2 = filterState.tanggal_awal;
            let param3 = filterState.tanggal_akhir;
            let param4 = filterState.no_kendaraan === '' ? 'all' : filterState.no_kendaraan;
            let param5 = filterState.tujuan === '' ? 'all' : filterState.tujuan;
            let param6 = filterState.pengemudi === '' ? 'all' : filterState.pengemudi;
            let param7 = filterState.spbu === '' ? 'all' : filterState.spbu;
            let param8 = filterState.jenis_servis === '' ? 'all' : filterState.jenis_servis;

            const response = await axios.get(`${apiUrl}/erp/analisa_bok?`, {
                params: {
                    entitas: kode_entitas,
                    param1: param1,
                    param2: param2,
                    param3: param3,
                    param4:  checkboxState.no_kendaraan ? param4 : 'all', 
                    param5:  checkboxState.tujuan ? param5 : 'all', 
                    param6:  checkboxState.pengemudi ? param6 : 'all', 
                    param7:  checkboxState.spbu ? param7 : 'all', 
                    param8: checkboxState.jenis_servis ? param8 : 'all', 
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.data;
            const modData = responseData.map((item: any) => {
                return {
                    ...item,
                    nominal: SpreadNumber(item.nominal), // Pastikan tanpaKoma mengubah string ke number
                };
            });
            setListData(modData);
            setActiveTab("grid_tab");
            // dataSourceSettings.dataSource = response.data.data;
            console.log("Response AP :",responseData);

        } else {
        }
    };

    let dataSourceSettings: any = {
        enableSorting: true,
        columns: [
            { name: 'jenis', caption: 'Jenis' },
        ],
        rows: [
            { name: 'nopol', caption: 'No. Kendaraan', expandAll: true },
        ],
        values: [
            { name: 'nominal', caption: 'Jumlah', type: 'Sum', format: 'C0' },
        ],
        filters: [
            { name: "tgl", caption: 'Tgl Transaksi' },
            { name: "tujuan", caption: 'Tujuan' },
            { name: "pengemudi", caption: 'Pengemudi' },
            { name: "nopol", caption: 'No. Kendaraan' },
            { name: "dokumen", caption: 'No. Dokumen' },
            { name: "keterangan", caption: 'Keterangan' },
            { name: "tanggal", caption: 'Tanggal' },
            { name: "bulan", caption: 'bulan' },
            { name: "tahun", caption: 'tahun' },
            
        ],
        formatSettings: [
            { name: 'nominal', format: 'N2' },
        ],
        dataSource: listData,
        expandAll: false,
    
        fieldMapping: [
            { name: "tgl", caption: 'Tgl Transaksi' },
            { name: "tujuan", caption: 'Tujuan' },
            { name: "pengemudi", caption: 'Pengemudi' },
            { name: "nopol", caption: 'No. Kendaraan' },
            { name: "dokumen", caption: 'No. Dokumen' },
            { name: "keterangan", caption: 'Keterangan' },
            { name: "tanggal", caption: 'Tanggal' },
            { name: "bulan", caption: 'bulan' },
            { name: "tahun", caption: 'tahun' },
            { name: "jenis", caption: 'Jenis' },
            { name: "liter", caption: 'Liter' },
            { name: "nominal", caption: 'Nominal' },
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
    function hyperlinkCellClick(args: any) {
        let cell = args.target.parentElement;
        let pivotValue = pivotObj.current!.pivotValues[Number(cell.getAttribute('index'))][Number(cell.getAttribute('data-colindex'))];
        let link = listData[pivotValue.index[0]]?.link;
        window.open(link, '_blank');
    }
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
        pivotObj.current!.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
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
        pivotObj.current!.chartSettings.chartSeries.legendShape = pivotObj.current!.chartSettings.chartSeries.type === 'Polar' ? 'Rectangle' : 'SeriesType';
    }
    function excelQueryCellInfo(args: any) {
        if (args?.cell.axis === 'value' && args?.cell.value === undefined) {
            args.style.numberFormat = undefined;
        }
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
            report.dataSourceSettings.dataSource = pivotObj.current!.dataSourceSettings.dataSource || [
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
            pivotObj.current!.dataSourceSettings = report.dataSourceSettings;
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
    return (
        <div className="control-pane h-full w-full">
            <meta name="referrer" content="never"></meta>
            <div className="-mt-5 flex border-b border-gray-300">
                <button
                    onClick={() => setActiveTab('data_tab')}
                    className={`px-3 py-2 text-xs font-semibold ${activeTab === 'data_tab' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                >
                    Filter BOK
                </button>
                <button
                    onClick={() => setActiveTab('grid_tab')}
                    className={`px-3 py-2 text-xs font-semibold ${activeTab === 'grid_tab' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                >
                    Grid
                </button>
            </div>
            <div className={`flex h-full w-full flex-col rounded border border-black-light bg-[#dedede] p-3 ${activeTab === 'data_tab' ? 'block' : 'hidden'}`}>
                <div className='flex w-full gap-2'>
                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                        <DatePickerComponent
                            locale="id"
                            cssClass="e-custom-style"
                            enableMask={true}
                            showClearButton={false}
                            format="dd-MM-yyyy"
                            width={180}
                            value={moment(filterState.tanggal_awal).toDate()}
                            change={(args: ChangeEventArgsCalendar) => {
                                handleTgl(args.value, 'tanggal_awal');
                            }}
                            style={{
                                background: 'white',
                            }}
                        >
                            <Inject services={[MaskedDateTime]} />
                        </DatePickerComponent>
                        Tanggal Awal
                    </label>

                    <label className="mb-0.5 flex items-center gap-2 text-xs">
                        <DatePickerComponent
                            locale="id"
                            cssClass="e-custom-style"
                            enableMask={true}
                            showClearButton={false}
                            format="dd-MM-yyyy"
                            width={180}
                            value={moment(filterState.tanggal_akhir).toDate()}
                            change={(args: ChangeEventArgsCalendar) => {
                                handleTgl(args.value, 'tanggal_akhir');
                            }}
                            style={{
                                background: 'white',
                            }}
                        >
                            <Inject services={[MaskedDateTime]} />
                        </DatePickerComponent>
                        Tanggal Akhir
                    </label>
                </div>
                <hr />
                <div className="flex">
                    <div className="kiri w-[35%]  p-2">
                        <div className="items-center font-bold text-black">
                            <span className="bg-[#dedede]">Data Biaya</span>
                            <div className="-mt-2 ml-2 flex flex-grow flex-col border border-black p-2">
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'0'} checked={filterState.data_biaya === '0'} onChange={handleInputChange} className="mr-1" />
                                    Semua
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'1'} checked={filterState.data_biaya === '1'} onChange={handleInputChange} className="mr-1" />
                                    Hutang Supplier
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'2'} checked={filterState.data_biaya === '2'} onChange={handleInputChange} className="mr-1" />
                                    Hutang Warkat
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'3'} checked={filterState.data_biaya === '3'} onChange={handleInputChange} className="mr-1" />
                                    Beban Operasional Lain :
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'4'} checked={filterState.data_biaya === '4'} onChange={handleInputChange} className="mr-3" />
                                    Uang Jalan Sopir
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'5'} checked={filterState.data_biaya === '5'} onChange={handleInputChange} className="mr-3" />
                                    Uang Kenek
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'6'} checked={filterState.data_biaya === '6'} onChange={handleInputChange} className="mr-3" />
                                    Parkir
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'7'} checked={filterState.data_biaya === '7'} onChange={handleInputChange} className="mr-3" />
                                    Tol
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'8'} checked={filterState.data_biaya === '8'} onChange={handleInputChange} className="mr-3" />
                                    Bongkar Muat
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'9'} checked={filterState.data_biaya === '9'} onChange={handleInputChange} className="mr-3" />
                                    Mel
                                </label>
                                <label className="flex items-center text-xs">
                                    <input type="radio" name="data_biaya" value={'10'} checked={filterState.data_biaya === '10'} onChange={handleInputChange} className="mr-3" />
                                    Lain - Lain
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="kanan w-[40%]">
                        <div className="mb-0.5 flex flex-col items-start">
                            <label className="mb-0.5 flex items-center gap-2 text-xs">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setCheckboxState((prev) => ({
                                            ...prev,
                                            no_kendaraan: e.target.checked,
                                        }))
                                    }
                                    checked={checkboxState.no_kendaraan}
                                />{' '}
                                No. Kendaraan
                            </label>
                            <input
                                type="text"
                                id="no_kendaraan"
                                className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="No. kendaraan"
                                name="no_kendaraan"
                                autoComplete="off"
                                value={filterState.no_kendaraan}
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
                                            tujuan: e.target.checked,
                                        }))
                                    }
                                    checked={checkboxState.tujuan}
                                />{' '}
                                Tujuan
                            </label>
                            <input
                                type="text"
                                id="tujuan"
                                className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="Tujuan"
                                name="tujuan"
                                autoComplete="off"
                                value={filterState.tujuan}
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
                                            pengemudi: e.target.checked,
                                        }))
                                    }
                                    checked={checkboxState.pengemudi}
                                />{' '}
                                Pengemudi
                            </label>
                            <input
                                type="text"
                                id="pengemudi"
                                className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="pengemudi"
                                name="pengemudi"
                                autoComplete="off"
                                value={filterState.pengemudi}
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
                                            spbu: e.target.checked,
                                        }))
                                    }
                                    checked={checkboxState.spbu}
                                />{' '}
                                SPBU
                            </label>
                            <input
                                type="text"
                                id="spbu"
                                className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="spbu"
                                name="spbu"
                                autoComplete="off"
                                value={filterState.spbu}
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
                                            jenis_servis: e.target.checked,
                                        }))
                                    }
                                    checked={checkboxState.jenis_servis}
                                />{' '}
                                Jenis Servis
                            </label>
                            <input
                                type="text"
                                id="jenis_servis"
                                className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                placeholder="Jenis Servis"
                                name="jenis_servis"
                                autoComplete="off"
                                value={filterState.jenis_servis}
                                onChange={handleInputChange}
                                style={{ height: '3vh' }}
                            />
                        </div>
                        <p className="text-sm">{`* Untuk banyak pilihan gunakan tanda koma`}</p>

                        <button
                            onClick={fetchData}
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
                <div className={`flex h-full w-full flex-col rounded border  ${activeTab === 'grid_tab' ? 'block' : 'hidden'}`}>
                    <div className="control-section h-full lg:h-[60vh] xl:h-[70vh] 2xl:[80vh] w-full" id="pivot-table-section" style={{ overflow: 'initial', overflowX: 'auto' }}>
                        
                        <PivotViewComponent
                            id="PivotView"
                            ref={pivotObj}
                            dataSourceSettings={dataSourceSettings}
                            width={'100%'}
                            height={'100%'}
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
                            // saveReport={saveReport}
                            toolbarRender={beforeToolbarRender}
                            chartSettings={{ title: 'Analisis Piutang (AR)', load: chartOnLoad }}
                            chartSeriesCreated={chartSeriesCreated}
                            enableFieldSearching={true}
                        >
                            <Inject
                                services={[FieldList, 
                                    CalculatedField,
                                    Toolbar, 
                                    // PDFExport,
                                    // ExcelExport,
                                    ConditionalFormatting,
                                    NumberFormatting,
                                    GroupingBar,
                                    Grouping,
                                    VirtualScroll,
                                    DrillThrough]}
                            />
                        </PivotViewComponent>
                    </div>
                </div>
                )}
        </div>
    );
};

export default AnalisaBOK;
