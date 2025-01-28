import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { RiFileExcel2Line, RiRefreshFill } from 'react-icons/ri';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { AggregateColumnsDirective, Aggregate, AggregateDirective, AggregatesDirective } from '@syncfusion/ej2-react-grids';
import { AggregateColumnDirective, Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { frmNumber, viewPeriode } from '@/utils/routines';
import { useSession } from '@/pages/api/sessionContext';
import moment from 'moment';
import idIDLocalization from 'public/syncfusion/locale.json';
import DialogDaftarAkun from './modal/DialogDaftarAkun';
import axios from 'axios';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { GetListMutasiDetailShort } from './function/fungsiForm';
import { ExportToCustomExcel } from './function/fungsiForm';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.min.css";

// flatpickr("#dateInput", {
//   dateFormat: "d-m-Y", // Format dd-mm-yyyy
// });

const RekapDanDetailMutasi = () => {
    const firstRender = useRef(true);
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const router = useRouter();
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const [activeTab, setActiveTab] = useState('rekapitulasi');
    const gridRekapitulasiSaldo = useRef<Grid | any>(null);
    const gridDetailMutasi = useRef<Grid | any>(null);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const [headerState, setHeaderState] = useState({
        nama_akun: '',
        no_akun: '',
        tanggal_awal: '2021-10-31',
        tanggal_akhir: '2021-10-31',
        aktifState: false,
        kode_akun: '',
    });


    const [handleUpdateTab, setHandleUpdateTab] = useState(false)

    const [modalAkun, setModalAkun] = useState(false);

    const [lastSaldoKumulatif, setlastSaldoKumulatif] = useState(0);

    const [rekapDataSource, setRekapDataSource] = useState<any>([]);

    const [rekapDataOriginal, setrekapDataOriginal] = useState([]);

    const [plagSort, setPlagSort] = useState({
        sortTanggal: '',
        sortDok: '',
        sortNoDokumen: '',
        sortCatatan: '',
        sortKet: '',
        sortDebet: '',
        sortKredit: '',
        sortSaldoKum: '',
        sortDept: '',
        sortNamaKar: '',
        sortDivisiPen: '',
        sortNoKontrak: '',
    });
    const handleSortBy = async (tipe: any) => {
        let plag;
        if (tipe === 'tanggal') {
            if (plagSort.sortTanggal === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortTanggal: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortTanggal === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortTanggal: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortTanggal === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortTanggal: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'dok') {
            if (plagSort.sortDok === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDok: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortDok === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDok: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortDok === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDok: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'NoDokumen') {
            if (plagSort.sortNoDokumen === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNoDokumen: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortNoDokumen === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNoDokumen: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortNoDokumen === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortNoDokumen: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'Catatan') {
            if (plagSort.sortCatatan === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortCatatan: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortCatatan === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortCatatan: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortCatatan === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortCatatan: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'debet') {
            if (plagSort.sortDebet === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDebet: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortDebet === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDebet: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortDebet === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortDebet: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'kredit') {
            if (plagSort.sortKredit === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKredit: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortKredit === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKredit: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortKredit === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortKredit: 'DESC',
                }));
                plag = 'DESC';
            }
        } else if (tipe === 'saldoKum') {
            if (plagSort.sortSaldoKum === '') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSaldoKum: 'DESC',
                }));
                plag = 'DESC';
            } else if (plagSort.sortSaldoKum === 'DESC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSaldoKum: 'ASC',
                }));
                plag = 'ASC';
            } else if (plagSort.sortSaldoKum === 'ASC') {
                setPlagSort((prev: any) => ({
                    ...prev,
                    sortSaldoKum: 'DESC',
                }));
                plag = 'DESC';
            }
        }
        const tglAwalSaldoAwal = moment(headerState.tanggal_awal);
        const paramObject = {
            dataOriginal: gridDetailMutasi.current.dataSource,
            plag: plag,
            tipe: tipe,
        };

        const getListDataBukuSubledger: any[] = await GetListMutasiDetailShort(paramObject);
        gridDetailMutasi.current.dataSource = getListDataBukuSubledger;
        gridDetailMutasi.current.refresh();
    };

    useEffect(() => {
        if(handleUpdateTab === true) {
          
            if(activeTab === 'detail') {
                if( Object.keys(selectedRow).length !== 0) {
                    hanldeRecordDoubleClick('any');
                }
                refreshListData(headerState.kode_akun)
                setHandleUpdateTab(false)
            } else {
               
                if( Object.keys(selectedRow).length !== 0) {
                    hanldeRecordDoubleClick('rekapitulasi');
                }
                refreshListData(headerState.kode_akun)
                setHandleUpdateTab(false)
                setActiveTab('rekapitulasi');
            }
        }
    },[handleUpdateTab])

    const headerKredit = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('kredit')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Kredit</span>
            </div>
        );
    };

    const headerDebet = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('debet')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Debet</span>
            </div>
        );
    };

    // Fungsi untuk menangani perubahan input
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        // Jika input checkbox, kita gunakan checked, jika bukan, gunakan value
        setHeaderState((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleTgl = async (date: any, tipe: string) => {


            if (tipe === 'tanggalAwal') {
                setHeaderState((oldData: any) => ({
                    ...oldData,
                    tanggal_awal: moment(date).format('YYYY-MM-DD'),
                }));
    
                if(activeTab === 'detail') {
                   setHandleUpdateTab(true)
                } else {
                    setHandleUpdateTab(true)
                }
            } else {
                setHeaderState((oldData: any) => ({
                    ...oldData,
                    tanggal_akhir: moment(date).format('YYYY-MM-DD'),
                }));
                if(activeTab === 'detail') {
                    setHandleUpdateTab(true)
                 } else {
                    setHandleUpdateTab(true)
                 }
            }
        
    };

    const headerTanggal = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('tanggal')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Tanggal</span>
            </div>
        );
    };

    const headerDok = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('dok')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Dok.</span>
            </div>
        );
    };

    const headerNoDokumen = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('NoDokumen')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Referensi</span>
            </div>
        );
    };
    const headerSaldo = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('saldoKum')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Saldo Kumulatif</span>
            </div>
        );
    };

    const headerCatatan = () => {
        return (
            <div style={{ width: '100%' }} onClick={() => handleSortBy('sortCatatan')}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px' }}>Keterangan</span>
            </div>
        );
    };

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };
    const [selectedRow, setSelectedRow] = useState<any>({});
    const refreshListData = async (kode_akun: any) => {
        if (kode_entitas !== null && kode_entitas !== '') {
            try {
                let paramTgl_awal = headerState.tanggal_awal;
                let paramTgl_akhir = headerState.tanggal_akhir;
                let paramkode_akun = kode_akun;
                let paramNol = headerState.aktifState === false ? 0 : 1;

                if (paramkode_akun === '' && firstRender.current === false) {
                    await Swal.fire({
                        title: 'Pilih terlebih dahulu kode akun',
                        icon: 'warning',
                        target: '#targetForSwalDialog',
                    });
                }

                if(kode_akun === 'firstRender') return

                const response = await axios.get(`${apiUrl}/erp/list_rekapitulasi_saldo?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: paramTgl_awal,
                        param2: paramTgl_akhir,
                        param3: paramkode_akun,
                        param4: paramNol,
                        // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responseData = response.data.data;
                let modifiedData = responseData.sort((a: any, b: any) => {
                    const hasLettersA = /[a-zA-Z]/.test(a.no_subledger); // Cek apakah a mengandung huruf
                    const hasLettersB = /[a-zA-Z]/.test(b.no_subledger); // Cek apakah b mengandung huruf

                    if (hasLettersA && !hasLettersB) return -1; // Jika a mengandung huruf dan b tidak, a berada di atas
                    if (!hasLettersA && hasLettersB) return 1; // Jika b mengandung huruf dan a tidak, b berada di atas
                    return 0; // Jika keduanya sama-sama mengandung huruf atau tidak, urutannya tidak berubah
                });

                await Promise.all(
                    (modifiedData = modifiedData.map((item: any) => ({
                        ...item,
                        kredit: SpreadNumber(item.kredit),
                        awal: SpreadNumber(item.awal),
                        balance: SpreadNumber(item.balance),
                        debet: SpreadNumber(item.debet),
                        perubahan: SpreadNumber(item.kredit) * -1 + SpreadNumber(item.debet),
                    })))
                );
                setRekapDataSource(modifiedData);
                gridRekapitulasiSaldo.current!.setProperties({ dataSource: modifiedData });
                gridRekapitulasiSaldo.current!.refresh();

                setModalAkun(false);

                // console.log('response supplier : ', { responseData });
            } catch (error) {
                console.error('Error fetching data refreshListData:', error);
            }
        } else {
            await Swal.fire({
                title: 'Sesi login telah berakhir.!',
                icon: 'warning',
                target: '#main-target',
            });

            setTimeout(() => {
                return router.push({ pathname: '/' });
            }, 1000);
        }
    };

    const handleZeroValue = (field: string, data: any) => {
        return data[field] === 0 ? '' : data[field];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const periode = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);

                const peride = periode.split('-')[1].split('s/d');
                const dataPeriodeMoment = moment(peride[0].trimStart(), 'D MMMM YYYY').format('YYYY-MM-DD');
                const dataPeriodeMomentAkhir = moment(peride[1].trimStart(), 'D MMMM YYYY').format('YYYY-MM-DD');
                setHeaderState({
                    nama_akun: '',
                    no_akun: '',
                    tanggal_awal: dataPeriodeMoment,
                    tanggal_akhir: dataPeriodeMomentAkhir,
                    aktifState: false,
                    kode_akun: '',
                });
            } catch (error) {
                console.log('error periode :', error);
            }
        };
        fetchData();
        
    }, [kode_entitas]);

    const footerSum = (props: any) => {
        
        return <span>{frmNumber(props.Sum)}</span>;
    };

    const custom = (props: any) => {
        
        return <span>{frmNumber(props.Custom)}</span>;
    };
    const customAggregateFn = (args: any) => {
        const val = args.result[args.result.length - 1].balance;
        return val;
    };
    const handleSelect = async (args: any) => {
        setHeaderState((oldData: any) => ({
            ...oldData,
            kode_akun: args.data.kode_akun,
        }));
        setSelectedRow(args.data);
    };

    const queryCellInfoEvent = (args: any) => {
        const col = args.column;
        const data = args.data;
        switch (data.tgl_dokumen) {
            case '':
                console.log();
                if (col.field === 'catatan') {
                    args.colSpan = 3;
                }
                break;
        }
    };

    const exportKeExcel = async () => {
        console.log('gridDetailMutasi.current.dataSource.length', gridDetailMutasi.current.dataSource.length);

        if (gridDetailMutasi.current.dataSource.length === 0 || headerState.no_akun === '') {
            return await Swal.fire({
                title: 'Data Detail Mutasi belum ada!',
                icon: 'warning',
                target: '#targetForSwalDialog',
            });
        } else {
            console.log('objectToExcel');
            try {
                const objectToExcel = {
                    periode: `Periode Tgl. ${moment(headerState.tanggal_awal).format('DD MMM YYYY')} s/d ${moment(headerState.tanggal_akhir).format('DD MMM YYYY')}`,
                    no_akun: `No. Akun : ${headerState.no_akun} - ${headerState.nama_akun}`,
                    no_subledger: `No. Subledger : ${selectedRow.no_akun} - ${selectedRow.nama_subledger}`,
                    kode_entitas: kode_entitas === '999' ? 'TRAINING' : kode_entitas,
                    title: `SUMMARY SUBLEDGER`,
                };

                const exportToExcel = await ExportToCustomExcel(gridDetailMutasi.current.dataSource, 'Buku-Subledger(Next)', objectToExcel);
                if (exportToExcel === true) {
                    await Swal.fire({
                        title: 'Excel telah ter export, silahkan buka file',
                        icon: 'success',
                        target: '#targetForSwalDialog',
                    });
                }
            } catch (error) {
                console.log('error export excel', error);
            }
        }
    };
    const hanldeRecordDoubleClick = async (args: any) => {
        try {
            let paramTgl_awal = headerState.tanggal_awal;
            let paramTgl_akhir = headerState.tanggal_akhir;
            let paramkode_akun = headerState.kode_akun;
            let paramNol = headerState.aktifState === false ? 0 : 1;
            const response = await axios.get(`${apiUrl}/erp/list_detail_mutasi?`, {
                params: {
                    entitas: kode_entitas,
                    param1: selectedRow.kode_akun,
                    param2: selectedRow.kode_subledger,
                    param3: paramTgl_awal,
                    param4: paramTgl_akhir,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.data;
            console.log("responseData",responseData);
            let currentSaldoKumulatif = SpreadNumber(response.data.data[0].balance);
            
            let modfiedData = responseData.map((item: any) => {
                const debet = SpreadNumber(item.debet) || 0;
        const kredit = SpreadNumber(item.kredit) || 0;

            // Hitung saldo kumulatif
            currentSaldoKumulatif += debet - kredit;
                if(item.no_dokumen === "") return {
                    ...item,
                    debet: debet,
                    kredit: kredit,
                    balance:currentSaldoKumulatif,
                }
                return {
                    ...item,
                    tgl_dokumen: item.tgl_dokumen === '' ? '' : moment(item.tgl_dokumen).format('DD-MM-YYYY'),
                    debet: debet,
                    kredit: kredit,
                    balance:currentSaldoKumulatif,
                }
            });



       
            

            setrekapDataOriginal(modfiedData);

            gridDetailMutasi.current.dataSource = modfiedData;
            gridDetailMutasi.current.refresh();

           
            if(args === 'rekapitulasi') {
                console.log('rekapp');
                
                setTimeout(() => {
                    setActiveTab('rekapitulasi');
                }, 1000);
            } else {

                setTimeout(() => {
                    setActiveTab('detail');
                }, 1000);
            }



            console.log('handle double click', responseData);
        } catch (error) {}
    };

    console.log("rekapDataOriginal",rekapDataOriginal);
    
    return (
        <div className="Main -mt-3" id="main-target">
            {modalAkun && (
                <DialogDaftarAkun
                    visible={modalAkun}
                    setVisibel={setModalAkun}
                    setHeaderState={setHeaderState}
                    headerState={headerState}
                    handleChange={handleChange}
                    kode_entitas={kode_entitas}
                    userid={userid}
                    token={token}
                    refreshListData={refreshListData}
                    RekapDataSource={rekapDataSource}
                />
            )}
            <div id="header " className="flex items-start">
                {/* <div className={`w-[110px] ${activeTab === 'rekapitulasi' ? 'hidden' : `block`}`}>
                    <button
                        onClick={async() => {
                            await exportKeExcel();
                            
                        }}
                        className={`flex w-[110px] items-center rounded-md ${
                            activeTab === 'rekapitulasi' ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-[#3a3f5c] hover:bg-[#787a87]'
                        } p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 `}
                       
                    >
                        <RiFileExcel2Line className="text-md" />
                        Export XLS
                    </button>
                </div> */}
                <div>
                    <table className="ml-10 w-[500px]">
                        <tbody>
                            <tr className="border-none">
                                <td className="text-sm">Nama</td>
                                <td className="w-32 ">
                                    <input
                                        type="text"
                                        id="no_akun"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="no akun"
                                        name="no_akun"
                                        value={headerState.no_akun}
                                        style={{ height: '3vh' }}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setModalAkun(true);
                                            setTimeout(() => {
                                                document.getElementById('no_akun_dialog')!.focus();
                                            }, 2000);
                                        }}
                                    />
                                </td>
                                <td className="">
                                    <div className="flex h-full w-full items-center  p-0">
                                        {/* Input */}
                                        <input
                                            type="text"
                                            id="nama_akun"
                                            className="flex-1  border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="keterangan akun"
                                            name="nama_akun"
                                            value={headerState.nama_akun}
                                            style={{ height: '3vh' }}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setModalAkun(true);
                                                setTimeout(() => {
                                                    document.getElementById('nama_akun_dialog')!.focus();
                                                }, 1000);
                                            }}
                                        />

                                        {/* Button */}
                                        <button
                                            type="button"
                                            className="flex items-center justify-center rounded-r-sm bg-blue-600 px-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ height: '3vh' }}
                                            onClick={() => {
                                                firstRender.current = false
                                                setModalAkun(true);
                                            }}
                                        >
                                            <FaSearch />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="border-none">
                                <td className="text-sm">Tanggal</td>
                                <td className="w-32 relative">
                                    <span className="border pl-2 absolute top-1">
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(headerState.tanggal_awal).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggalAwal');
                                            }}
                                            // style={{
                                            //     border: '1px solid black',
                                            //     borderRadius: '3px'
                                            // }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </span>
                                </td>
                                <td className="flex items-center">
                                    <label className="mr-1 w-10 text-xs" style={{ marginBottom: -2 }}>
                                        S/D
                                    </label>
                                    <span className="h-full border pl-2">
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(headerState.tanggal_akhir).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggalAkhir');
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="aktifState"
                                        checked={headerState.aktifState}
                                        onChange={handleChange}
                                        className="ml-3 h-3 w-3 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                        style={{
                                            borderColor: '#ffffff',
                                        }}
                                    />
                                    <label className="ml-2 text-xs w-24" style={{ marginBottom: -2 }}>
                                        Termasuk Nol
                                    </label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={async () => {
                        firstRender.current = false
                        await refreshListData(headerState.kode_akun);
                    }}
                    className="ml-3 flex items-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                >
                    <RiRefreshFill className="text-md" />
                    Refresh
                </button>
                <div className="flex w-full justify-end">
                    <h2 className="bold text-lg">Rekap Dan Detail Mutasi Subledger</h2>
                </div>
            </div>
            <div className="h-[60vh] w-full">
                <div className="flex border-b border-gray-300">
                    <button
                        onClick={() => setActiveTab('rekapitulasi')}
                        className={`px-3 py-2 text-xs font-semibold ${activeTab === 'rekapitulasi' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        Rekapitulasi Saldo
                    </button>
                    <button
                        onClick={() => setActiveTab('detail')}
                        className={`px-3 py-2 text-xs font-semibold ${activeTab === 'detail' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                        Detail Mutasi
                    </button>
                </div>

                <div className="h-[58vh] rounded-b-md border border-gray-300 ">
                    <div className={`text-sm ${activeTab === 'rekapitulasi' ? 'block' : 'hidden'}`}>
                        <TooltipComponent openDelay={1000} target=".e-headertext">
                            <GridComponent
                                id="gridRekapitulasiSaldo "
                                name="gridRekapitulasiSaldo "
                                className="gridRekapitulasiSaldo "
                                locale="id"
                                ref={gridRekapitulasiSaldo}
                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                rowHeight={22}
                                gridLines={'Both'}
                                height={'55vh'}
                                allowResizing={true}
                                dataSource={rekapDataSource}
                                rowSelecting={handleSelect}
                                recordDoubleClick={hanldeRecordDoubleClick}
                                allowKeyboard={false}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective field="no_subledger" type="number" isPrimaryKey={true} headerText="No. Subledger" headerTextAlign="Center" textAlign="Center" autoFit={true} />
                                    <ColumnDirective
                                        field="nama_subledger"
                                        headerText="Keterangan"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                        // // editTemplate={editTemplateNamaAkun}
                                    />
                                    <ColumnDirective
                                        field="awal"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        format="N2"
                                        headerText="Awal"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="debet"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        format="N2"
                                        headerText="Debet"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="kredit"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        format="N2"
                                        headerText="Kredit"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="balance"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        format="N2"
                                        headerText="Saldo"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="perubahan"
                                        format="N2"
                                        headerText="Perubahan"
                                        headerTextAlign="Center"
                                        textAlign="Right"
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                    />
                                </ColumnsDirective>
                                <AggregatesDirective>
                                    <AggregateDirective>
                                        <AggregateColumnsDirective>
                                            <AggregateColumnDirective field="awal" type="Sum" footerTemplate={footerSum} />
                                            <AggregateColumnDirective field="debet" type="Sum" footerTemplate={footerSum} />
                                            <AggregateColumnDirective field="kredit" type="Sum" footerTemplate={footerSum} />
                                            <AggregateColumnDirective field="balance" type="Sum" footerTemplate={footerSum} />
                                            <AggregateColumnDirective field="perubahan" type="Sum" footerTemplate={footerSum} />
                                        </AggregateColumnsDirective>
                                    </AggregateDirective>
                                </AggregatesDirective>

                                <Inject services={[Aggregate, Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                            </GridComponent>
                        </TooltipComponent>
                    </div>

                    <div className={`text-sm ${activeTab === 'detail' ? 'block' : 'hidden'}`}>
                        <h2>
                            {selectedRow?.no_subledger} - {selectedRow?.nama_subledger}
                        </h2>
                        <TooltipComponent openDelay={1000} target=".e-headertext">
                            <GridComponent
                                id="gridDetailMutasi "
                                name="gridDetailMutasi "
                                className="gridDetailMutasi "
                                locale="id"
                                ref={gridDetailMutasi}
                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                rowHeight={22}
                                gridLines={'Both'}
                                height={'53vh'}
                                allowKeyboard={false}
                                allowResizing={true}
                                queryCellInfo={queryCellInfoEvent}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective
                                        field="tgl_dokumen"
                                        headerText="Tanggal"
                                        headerTextAlign="Center"
                                        textAlign="Center"
                                        autoFit={true}
                                        width="90"
                                        headerTemplate={headerTanggal}
                                    />
                                    <ColumnDirective
                                        field="dokumen"
                                        headerTemplate={headerDok}
                                        headerText="Dok."
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        // width={'auto'}
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                        
                                        //
                                        // editTemplate={editTemplateNoAkun}
                                    />
                                    <ColumnDirective
                                        field="no_dokumen"
                                        headerTemplate={headerNoDokumen}
                                        headerText="Referensi"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        // width={'auto'}
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                        // // editTemplate={editTemplateNamaAkun}
                                    />
                                    <ColumnDirective
                                        headerTemplate={headerCatatan}
                                        field="catatan"
                                        headerText="Keterangan"
                                        headerTextAlign="Center"
                                        textAlign="Left"
                                        // width={'auto'}
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="debet"
                                        headerTemplate={headerDebet}
                                        format="N2"
                                        textAlign="Right"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        headerText="Debet"
                                        headerTextAlign="Center"
                                        width={'145'}
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        field="kredit"
                                        headerTemplate={headerKredit}
                                        format="N2"
                                        textAlign="Right"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        headerText="Kredit"
                                        headerTextAlign="Center"
                                        width={'145'}
                                        autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                    <ColumnDirective
                                        headerTemplate={headerSaldo}
                                        field="balance"
                                        format="N2"
                                        textAlign="Right"
                                        valueAccessor={(field, data) => handleZeroValue(field, data)}
                                        headerText="Saldo Kumulatif"
                                        headerTextAlign="Center"
                                        width={'145'}
                                        // autoFit={true}
                                        clipMode="EllipsisWithTooltip"
                                    />
                                </ColumnsDirective>

                                <AggregatesDirective>
                                    <AggregateDirective>
                                        <AggregateColumnsDirective>
                                            <AggregateColumnDirective field="debet" type="Sum" footerTemplate={footerSum} />
                                            <AggregateColumnDirective field="kredit" type="Sum" footerTemplate={footerSum} />
                                            <AggregateColumnDirective field="balance" type="Custom" customAggregate={customAggregateFn} footerTemplate={custom}/>
                                        </AggregateColumnsDirective>
                                    </AggregateDirective>
                                </AggregatesDirective>

                                <Inject services={[Aggregate, Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                            </GridComponent>
                        </TooltipComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RekapDanDetailMutasi;
