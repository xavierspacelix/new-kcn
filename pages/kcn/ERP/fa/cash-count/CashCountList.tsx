import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { RiRefreshFill } from 'react-icons/ri';
import GridCashCount from './GridCashCount';
import idIDLocalization from 'public/syncfusion/locale.json';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import moment from 'moment';
import { Inject } from '@syncfusion/ej2-react-grids';
import { useSession } from '@/pages/api/sessionContext';
import { useRouter } from 'next/router';
import { viewPeriode } from '@/utils/routines';
import axios from 'axios';
import BaruEditCashCount from './modal/BaruEditCashCount';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
enableRipple(true);

const CashCountList = () => {
    const dispatch = useDispatch();
    const { sessionData } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const router = useRouter();
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const gridCashCount = useRef<any>(null);

    const [visibleBaruEditCashCount, setVisibleBaruEditCashCount] = useState(false);
    const [masterState, setMasterState] = useState('');
    const [masterData, setMasterData] = useState({});
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [list_kas_opname, setlist_kas_opname] = useState([]);

    const [dialogLaporan, setDialogLaporan] = useState(false);

    const [filterState, setFilterState] = useState({
        tanggal_awal: '',
        tanggal_akhir: '',
        akun_kas: '',
        kode_akun: '',
        penjumlahan_sesuai: 'all',
        file_pendukung: 'all',
    });
    const [checkboxState, setCheckboxState] = useState({
        akun_kas: false,
        kode_akun: false,
        penjumlahan_sesuai: false,
        file_pendukung: false,
        tanggal_input: false,
    });

    const [laporanHarianState, setLaporanHarianState] = useState({
        tanggal: moment().format('YYYY-MM-DD'),
        akun_kas: '',
        kode_akun: '',
        warkat: false,
    });

    const laporanHarianStateChange = (e: any) => {
        const { name, value } = e.target;

        // Update filterState
        setLaporanHarianState((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [akun_kas, setAkun_kas] = useState([]);
    const [akun_kasLaporan, setAkun_kasLaporan] = useState([]);

    // console.log('filter list state', filterState);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        // Update filterState
        setFilterState((prev: any) => ({
            ...prev,
            [name]: value,
        }));

        // Update checkboxState
        setCheckboxState((prev: any) => ({
            ...prev,
            [name]: value.trim() !== '',
        }));
    };

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    const [isScreenWide, setScreenWide] = useState(false);

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

    const refreshData = async (fetch_awal = false) => {
        let param1 = checkboxState.tanggal_input ? filterState.tanggal_awal : 'all';
        let param2 = checkboxState.tanggal_input ? filterState.tanggal_akhir : 'all';
        if (fetch_awal === true) {
            const periode = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);
            const peride = periode.split('-')[1].split('s/d');
            param1 = moment(peride[0].trimStart(), 'D MMMM YYYY').format('YYYY-MM-DD');
            param2 = moment().format('YYYY-MM-DD');
        }
        let param3 = checkboxState.akun_kas ? filterState.kode_akun : 'all';
        try {
            const response = await axios.get(`${apiUrl}/erp/list_kas_opname?`, {
                params: {
                    entitas: kode_entitas,
                    param1,
                    param2,
                    param3,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let modData = response.data.data.map((item: any) => {
                return {
                    ...item,
                    nfisik: SpreadNumber(item.nfisik),
                    nsistem: SpreadNumber(item.nsistem),
                    nselisih: SpreadNumber(item.nselisih),
                    napp: SpreadNumber(item.napp),
                };
            });

            if (filterState.file_pendukung !== 'all') {
                modData = modData.filter((item: any) => item.sfile === filterState.file_pendukung);
            }

            if (filterState.penjumlahan_sesuai !== 'all') {
                modData = modData.filter((item: any) => item.sok === filterState.penjumlahan_sesuai);
            }

            gridCashCount.current.setProperties({ dataSource: modData });
            gridCashCount.current!.refresh();

            // setlist_kas_opname(modData);
        } catch (error) {
            console.log('error fetch', error);
        }
    };

    useEffect(() => {
        if (kode_entitas) {
            const fetchData = async () => {
                try {
                    const periode = await viewPeriode(kode_entitas == '99999' ? '999' : kode_entitas);

                    const peride = periode.split('-')[1].split('s/d');
                    const dataPeriodeMoment = moment(peride[0].trimStart(), 'D MMMM YYYY').format('YYYY-MM-DD');
                    const dataPeriodeMomentAkhir = moment().format('YYYY-MM-DD');
                    setFilterState((oldData) => ({
                        ...oldData,
                        tanggal_awal: dataPeriodeMoment,
                        tanggal_akhir: dataPeriodeMomentAkhir,
                    }));
                } catch (error) {
                    console.log('error periode :', error);
                }
            };

            const getAkunLaporan = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/erp/list_akun_kas_mutasi_bank?`, {
                        params: {
                            entitas: kode_entitas,
                            // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const modfiedData = response.data.data.filter((item: any) => item.header !== 'Y');
                    setAkun_kasLaporan(modfiedData);
                } catch (error) {
                    console.log('error saat get akun', error);
                }
            };
            const getAkun = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/erp/list_akun_global?`, {
                        params: {
                            entitas: kode_entitas,
                            param1: 'SQLAkunKas',
                            // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const modfiedData = response.data.data.filter((item: any) => item.header !== 'Y' && item.nama_akun.toLowerCase().startsWith('kas'));
                    setAkun_kas(modfiedData);
                } catch (error) {
                    console.log('error saat get akun', error);
                }
            };
            getAkunLaporan();
            fetchData();
            getAkun();
            refreshData(true);
        }
        dispatch(setPageTitle(kode_entitas + ' | Kas Opaname'));
    }, [kode_entitas]);

    const handleTgl = async (date: any, tipe: string) => {
        if (tipe === 'tanggal_awal') {
            setFilterState((oldData: any) => ({
                ...oldData,
                tanggal_awal: moment(date).format('YYYY-MM-DD'),
            }));
            setCheckboxState((oldData: any) => ({
                ...oldData,
                tanggal_input: true,
            }));
        } else if (tipe === 'tanggal_akhir') {
            setFilterState((oldData: any) => ({
                ...oldData,
                tanggal_akhir: moment(date).format('YYYY-MM-DD'),
            }));
            setCheckboxState((oldData: any) => ({
                ...oldData,
                tanggal_input: true,
            }));
        } else {
            setLaporanHarianState((oldData: any) => ({
                ...oldData,
                tanggal: moment(date).format('YYYY-MM-DD'),
            }));
        }
    };

    const selectedRowHandle = (args: any) => {
        setSelectedRow(args.data);
        setLaporanHarianState((oldData) => ({
            ...oldData,
            kode_akun: args.data.kode_akun,
            tanggal: moment(args.data.tgl).format('YYYY-MM-DD'),
            akun_kas: args.data.nama_akun,
        }));
    };

    console.log('akun_kas', laporanHarianState);

    const recordDoubleClick = (args: any) => {
        // if(!selectedRow) {
        //     return alert('Pilih Data Dulu');
        // }
        if (Object.keys(selectedRow).length === 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Pilih Data!',
                target: '#dialogListKendaraan',
                text: `Pilih Data Terlebih Dahulu`,
            });
        }
        setMasterState('EDIT');
        setVisibleBaruEditCashCount(true);
    };

    const ubahFilePendukung = (args: any) => {
        if (Object.keys(selectedRow).length === 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Pilih Data!',
                target: '#dialogListKendaraan',
                text: `Pilih Data Terlebih Dahulu`,
            });
        }
        setMasterState('UBAH_FILE');
        setVisibleBaruEditCashCount(true);
    };

    const Cetak_Form_BOK = (onSaveDoc: any = '') => {
        if (laporanHarianState.kode_akun === '') {
            return Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                target: '#dialogListKendaraan',
                text: `Akun Kas harus diisi`,
            });
        }
        let height = window.screen.availHeight - 150;
        let width = window.screen.availWidth - 200;
        let leftPosition = window.screen.width / 2 - (width / 2 + 10);
        let topPosition = window.screen.height / 2 - (height / 2 + 50);

        let iframe = `
                <html><head>
                <title>Form Kash Opname | Next KCN Sytem</title>
                <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
                </head><body>
                <iframe src="./report/kas_harian?entitas=${kode_entitas}&param1=${laporanHarianState.tanggal}&param2=${laporanHarianState.kode_akun}&param3=${
            laporanHarianState.warkat ? 'Y' : 'N'
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

    const cetakByHtml = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/report_form_kas_opname?`, {
                params: {
                    entitas: kode_entitas,
                    param1: laporanHarianState.tanggal,
                    param2: laporanHarianState.kode_akun,
                    param3: laporanHarianState.warkat ? 'Y' : 'N',
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            PrintData(response.data);
        } catch (error) {}
    };

    function formatNumber(num: any) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const ConvertDataToHtml = (data: any) => {
        const nama_entitas = data?.data_NamaEntitas;
        const data_Periode = data?.data_Periode;
        const penerimaan = data.data.data_kas.filter((item: any) => item.kr === 1);
        const pengeluaraan = data.data.data_kas.filter((item: any) => item.kr === 2);
        const totalPenerimaan = penerimaan.reduce((sum: number, item: any) => SpreadNumber(sum) + SpreadNumber(item.tunai), 0);
        const totalPengeluaran = pengeluaraan.reduce((sum: number, item: any) => SpreadNumber(sum) + SpreadNumber(item.tunai), 0);
        console.log('totalPenerimaan', penerimaan);

        // const totalKredit = data.reduce((sum: number, item: any) => sum + parseFloat(item.kredit.replace(/,/g, '') || 0), 0).toFixed(2);

        const saldoAwal = formatNumber(SpreadNumber(data.data.data_kas[0]?.tunai));
        const saldoAkhir = SpreadNumber(data.data.data_kas[0]?.tunai) + totalPenerimaan - totalPengeluaran;

        let hasKr1 = data?.data?.data_kas.some((item: any) => item.kr === 1);
        let hasKr2 = data?.data?.data_kas.some((item: any) => item.kr === 2);
        console.log('masuk cetak', data);
        console.log('tunai', saldoAwal, saldoAkhir);
        // Menghitung total debet dan kredit

        return `
          <div style="font-family: Calibri, sans-serif;font-size: 13px">
          
       

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px">
        <thead>
        <p style="font-size: 8pt">${moment().format('DD MMM YYYY HH:mm')}</p>
            <tr style="border-buttom: solid 1px black">
            <td style="text-align: center" colspan="7">
            ${kode_entitas}<br/>
            Laporan Harian ${selectedRow?.nama_akun}<br/>
            ${data_Periode}
        </td>
            </tr>
                <tr style="font-size: 8pt">
                    <th align="left" style="width: 10%; border-bottom: 1px solid black; text-align: left; padding: 2px; font-size: 8pt;">No</th>
                    <th align="left" style="width: 30%; border-bottom: 1px solid black; text-align: left; padding: 2px; font-size: 8pt;">Keterangan.</th>
                    <th align="left" style="width: 10%; border-bottom: 1px solid black; text-align: left; padding: 2px; font-size: 8pt;">No. Cek / BG</th>
                    <th align="left" style="width: 10%; border-bottom: 1px solid black; text-align: left; padding: 2px; font-size: 8pt;">Tgl. Valuta</th>
                    <th align="left" style="width: 10%; border-bottom: 1px solid black; text-align: right; padding: 2px; font-size: 8pt;">Kas / Bank</th>
                    <th align="left" style="width: 10%; border-bottom: 1px solid black; text-align: left; padding: 2px; font-size: 8pt;">Warkat</th>
                    <th align="left" style="width: 20%; border-bottom: 1px solid black; text-align: left; padding: 2px; font-size: 8pt;">Akun Debet / Kredit</th>
                </tr>
            </thead>
           <tbody>
           <tr style="border-bottom: 1px dotted black;font-size: 8pt; ">
           
            <td colspan="4" style="color: blue" className="text-blue-500">
            ${data.data.data_kas[0]?.keterangan}
            </td>
            <td align="right" style="font-weight:bold">
            ${saldoAwal}
            </td>
           </tr>
           ${
               hasKr1
                   ? `
            <tr style="border-bottom: 1px dotted black; font-size: 8pt;">
                <td colspan="4">
                PENERIMAAN</td>
            </tr>
            <tr style="font-size: 8pt">
            <td colspan="7">
            <table style="width: 100%">
            <thead>
            <tr style="font-size: 8pt">
            <th colspan="4" align="left">PENERIMAAN LAIN-LAIN<th>
            <th colspan="3"></th>
            </tr>
            </thead>
            <tbody>
            ${penerimaan
                .map(
                    (item: any, index: number) => `
            <tr style="font-size: 8pt">
           <td>${index + 1}</td>
           <td colspan="2">${item.keterangan}</td>
           <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(item.tunai))}</td>
           <td>${item.nama_akun}</td>
           </tr>
           `
                )
                .join('')}
           </tbody>
           </tfooter>
           <tr style="font-size: 8pt">
            <td colspan="3">
            TOTAL PENERIMAAN ---------------------------------------
            </td>
            <td align="right" style="font-weight:bold">${formatNumber(totalPenerimaan)}</td>
            <td>
            </td>
           </tr>
           </tfooter>
            </table>
            </td>
            </tr>
            `
                   : ''
           }
           ${
               hasKr2
                   ? `
         <tr style="border-bottom: 1px dotted black; font-size: 8pt;">
             <td colspan="4">
             PENGELUARAN</td>
         </tr>
         <tr style="font-size: 8pt">
         <td colspan="7">
         <table style="width: 100%">
         <tbody>
         ${pengeluaraan
             .map(
                 (item: any, index: number) => `
         <tr style="font-size: 8pt">
        <td>${index + 1}</td>
        <td colspan="2">${item.keterangan}</td>
        <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(item.tunai))}</td>
        <td>${item.nama_akun}</td>
        </tr>
        `
             )
             .join('')}
        </tbody>
        </tfooter>
        <tr style="font-size: 8pt">
         <td colspan="3">
         TOTAL PENGELUARAAN ---------------------------------------
         </td>
         <td align="right" style="font-weight:bold">${formatNumber(totalPengeluaran)}</td>
         <td>
         </td>
        </tr>
        </tfooter>
         </table>
         </td>
         </tr>
         `
                   : ''
           }
        <tr style="border-bottom: 1px dotted black;  font-size: 8pt; ">
                <td colspan="4">
                SALDO AKHIR</td>
                <td align="right" style="font-weight:bold">${formatNumber(saldoAkhir)}</td>
            </tr>
            <tr>
            <td colspan="3">
            <table border="1" cellspacing="0" style="margin-top: 5px; width: 100%;" >
            <thead>
                <tr style="font-size: 8pt">
                <th>Nominal</th>
                <th>Kertas</th>
                <th>Koin</th>
                <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr style="font-size: 8pt">
                    <td>100.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k100000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c100000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n100000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>75.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k75000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c75000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n75000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>50.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k50000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c50000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n50000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>20.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k20000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c20000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n20000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>10.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k10000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c10000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n10000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>5.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k5000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c5000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n5000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>2.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k2000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c2000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n2000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>1.000</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k1000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c1000))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n1000))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>500</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k500))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c500))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n500))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>200</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k200))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c200))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n200))}</td>
                </tr>
                <tr style="font-size: 8pt">
                    <td>100</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].k100))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].c100))}</td>
                    <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].n100))}</td>
                </tr>
            </tbody>
            <tfooter>
            <tr>
            <td colspan="2"><td>
            <td align="right" style="font-size: 8pt" align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].nfisik))}</td>
            </tr>
            </tfooter>
        </table>
            </td>
           <td colspan="4" style="position: relative; text-align: center; height: 100px;">
    <table style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 100%;">
        <tr style="font-size: 8pt;">
            <td># User INPUT Terakhir</td>
            <td>${data?.data?.data_kop[0].user_input}</td>
        </tr>
        <tr style="font-size: 8pt;">
            <td># Total Fisik Uang</td>
            <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].nfisik))}</td>
        </tr>
        <tr style="font-size: 8pt;">
            <td># Total Belum Approved</td>
            <td align="right" style="font-weight:bold">${formatNumber(SpreadNumber(data?.data?.data_kop[0].napp))}</td>
        </tr>
        <tr style="font-size: 8pt;">
            <td># Kas Selisih (lebih / kurang)</td>
            <td align="right" style="font-weight:bold">${
                SpreadNumber(data?.data?.data_kop[0].nselisih) < SpreadNumber(data?.data?.data_kop[0].nfisik)
                    ? formatNumber(SpreadNumber(data?.data?.data_kop[0].nselisih)) !== 0
                        ? '-' + formatNumber(SpreadNumber(data?.data?.data_kop[0].nselisih))
                        : 0
                    : formatNumber(SpreadNumber(data?.data?.data_kop[0].nselisih))
            }</td>
        </tr>
        <tr style="font-size: 8pt;">
            <td># Catatan Selisih :</td>
            <td>${data?.data?.data_kop[0].alasan === null ? '' : data?.data?.data_kop[0].alasan}</td>
        </tr>
        <tr style="font-size: 8pt;">
            <td>Dibuat</td>
            <td>Diperiksa</td>
            <td>Disetujui</td>
        </tr>
    </table>
</td>


             
            </tr>
           </tbody>
        </table>
       
    </div>
        `;
    };

    const PrintData = (data: any) => {
        console.log('tunai', data);

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(`
              <html>
                <head>
                  <title>Cetak Laporan Kas Harian</title>
                  <style>
                    @media print {
                      table { page-break-after: auto; }
                      tr { page-break-inside: avoid; page-break-after: auto; }
                      td { page-break-inside: avoid; page-break-after: auto; }
                      thead { display: table-header-group; }
                      tfoot { display: table-footer-group; }
                    }
                  </style>
                </head>
                <body onload="window.print();">
                  ${ConvertDataToHtml(data)}
                </body>
              </html>
            `);
            iframeDoc.close();

            if (iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.onafterprint = () => {
                    document.body.removeChild(iframe);
                };
            }
        } else {
            console.error('Failed to access iframe document.');
        }
    };

    // console.log("akun_kasLaporan",akun_kasLaporan);

    return (
        <div className="Main overflow-visible" id="main-target">
            {visibleBaruEditCashCount ? (
                <BaruEditCashCount
                    visible={visibleBaruEditCashCount}
                    onClose={() => {
                        setVisibleBaruEditCashCount(false);
                        setMasterData({});
                        setMasterState('');
                    }}
                    kode_entitas={kode_entitas}
                    masterState={masterState}
                    masterData={selectedRow}
                    refereshData={refreshData}
                    token={token}
                    userid={userid}
                />
            ) : null}
            {dialogLaporan && (
                <DialogComponent
                    id="dialogListKendaraan"
                    isModal={true}
                    width="30%"
                    height="40%"
                    header={'Laporan Kas Harian'}
                    visible={dialogLaporan}
                    close={() => setDialogLaporan(false)}
                    showCloseIcon={true}
                    target="#main-target"
                    closeOnEscape={false}
                    allowDragging={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    position={{ X: 'center', Y: 'center' }} // Dialog berada di tengah
                    style={{ position: 'fixed' }}
                >
                    <div className="h-full w-full flex-col">
                        <div className="h-[85%] w-full">
                            <div className="flex flex-col">
                                <label className="mb-1 flex items-center gap-2 text-xs">Tanggal Input</label>
                                <div className="flex w-full items-center">
                                    <span className="flex h-[5vh] w-[45%] items-center rounded border bg-white">
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            width={180}
                                            value={moment(laporanHarianState.tanggal).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tanggal');
                                            }}
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </span>
                                </div>
                            </div>

                            <div className="mb-1 flex w-full flex-col items-start">
                                <label className="mb-1 flex items-center gap-2 text-xs">Akun Kas</label>
                                <select
                                    name="kode_akun"
                                    value={laporanHarianState.kode_akun}
                                    onChange={laporanHarianStateChange}
                                    className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Akun Kas</option>
                                    {akun_kasLaporan.length !== 0 &&
                                        akun_kasLaporan.map((item: any) => (
                                            <option key={item.kode_akun} value={item.kode_akun}>
                                                {item.nama_akun}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className="mb-1 flex w-full flex-col items-start">
                                <label className="mb-1 flex items-center gap-2 text-xs">
                                    <input
                                        type="checkbox"
                                        checked={laporanHarianState.warkat}
                                        onChange={(e) =>
                                            setLaporanHarianState((prev) => ({
                                                ...prev,
                                                warkat: !prev.warkat,
                                            }))
                                        }
                                    />{' '}
                                    Tanggal Input
                                </label>
                            </div>
                        </div>
                        <div className="flex h-[15%] w-full justify-end gap-2 pb-2 pr-2">
                            <ButtonComponent type="submit" onClick={cetakByHtml}>
                                Simpan
                            </ButtonComponent>
                            <ButtonComponent type="submit" onClick={() => setDialogLaporan(false)}>
                                Tutup
                            </ButtonComponent>
                        </div>
                    </div>
                </DialogComponent>
            )}
            <div className="-mt-3 flex items-center gap-3 space-x-2 p-1">
                <div className="flex space-x-2">
                    <button
                        className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]"
                        onClick={() => {
                            setVisibleBaruEditCashCount(true);
                            setMasterState('BARU');
                        }}
                    >
                        Baru
                    </button>
                    <button className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]" onClick={recordDoubleClick}>
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
                </div>

                <div className="flex w-[700px] space-x-2 border-l border-gray-400 pl-2">
                    <button className="flex items-center text-xs font-semibold text-green-700 hover:text-green-900" onClick={ubahFilePendukung}>
                        <span className="mr-1">▶</span> File Pendukung
                    </button>
                    <button
                        onClick={() => {
                            setDialogLaporan(true);
                            console.log('ke triger');
                        }}
                        className="flex items-center rounded border border-red-500 px-2 text-xs font-semibold text-red-700 hover:text-red-900"
                    >
                        <span className="mr-1">▶</span> Laporan Harian Kas Dan Warkat
                    </button>
                </div>
                <div className="flex w-full justify-end">
                    <h3 className="text-lg font-bold">Kas Opname</h3>
                </div>
            </div>
            <div className="relative flex  h-full w-full gap-1">
                {isSidebarVisible && (
                    <div className="relative flex w-[250px] flex-col items-center justify-between overflow-hidden rounded-lg border-blue-400 bg-gray-300">
                        <div className="h-[30px] w-full bg-[#dedede] py-1 pl-2">
                            Filter
                            <button
                                className="absolute right-3 top-1 flex items-center justify-center rounded-full border border-black p-0.5 text-xs"
                                onClick={() => setSidebarVisible(!isSidebarVisible)}
                            >
                                <IoClose />
                            </button>
                        </div>
                        <div className={`flex h-full w-full flex-col rounded border border-black-light `}>
                            <div className="flex h-full flex-col items-center overflow-x-auto bg-[#dedede] p-1 px-1.5">
                                <div className="mb-1 flex flex-col">
                                    <label className="mb-1 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.tanggal_input}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    tanggal_input: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Tanggal Input
                                    </label>
                                    <div className="flex w-full items-center">
                                        <span className="flex h-[5vh] w-[45%] items-center rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                                            <DatePickerComponent
                                                locale="id"
                                                cssClass="e-custom-style"
                                                enableMask={true}
                                                showClearButton={false}
                                                format="dd-MM-yyyy"
                                                width="100%"
                                                value={moment(filterState.tanggal_awal).toDate()}
                                                change={(args: ChangeEventArgsCalendar) => {
                                                    handleTgl(args.value, 'tanggal_awal');
                                                }}
                                            >
                                                <Inject services={[MaskedDateTime]} />
                                            </DatePickerComponent>
                                        </span>

                                        <label className="mr-1 flex w-[10%] text-xs" style={{ marginBottom: -2 }}>
                                            S/D
                                        </label>
                                        <span className="flex h-[5vh] w-[45%] items-center rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
                                            <DatePickerComponent
                                                locale="id"
                                                cssClass="e-custom-style"
                                                enableMask={true}
                                                showClearButton={false}
                                                format="dd-MM-yyyy"
                                                width="100%"
                                                value={moment(filterState.tanggal_akhir).toDate()}
                                                change={(args: ChangeEventArgsCalendar) => {
                                                    handleTgl(args.value, 'tanggal_akhir');
                                                }}
                                            >
                                                <Inject services={[MaskedDateTime]} />
                                            </DatePickerComponent>
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-1 flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={checkboxState.kode_akun}
                                            onChange={(e) =>
                                                setCheckboxState((prev) => ({
                                                    ...prev,
                                                    kode_akun: e.target.checked,
                                                }))
                                            }
                                        />{' '}
                                        Akun Kas
                                    </label>
                                    <select
                                        name="kode_akun"
                                        value={filterState.kode_akun}
                                        onChange={handleInputChange}
                                        className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="">Select Akun Kas</option>
                                        {akun_kas.length !== 0 &&
                                            akun_kas.map((item: any) => (
                                                <option key={item.kode_akun} value={item.kode_akun}>
                                                    {item.nama_akun}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-2 text-xs font-semibold text-gray-700">File Pendukung</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center text-xs font-medium text-gray-800">
                                            <input
                                                type="radio"
                                                name="penjumlahan_sesuai"
                                                value="Y"
                                                checked={filterState.penjumlahan_sesuai === 'Y'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="ml-2">Ya</span>
                                        </label>
                                        <label className="flex items-center text-xs font-medium text-gray-800">
                                            <input
                                                type="radio"
                                                name="penjumlahan_sesuai"
                                                value="N"
                                                checked={filterState.penjumlahan_sesuai === 'N'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="ml-2">Tidak</span>
                                        </label>
                                        <label className="flex items-center text-xs font-medium text-gray-800">
                                            <input
                                                type="radio"
                                                name="penjumlahan_sesuai"
                                                value="all"
                                                checked={filterState.penjumlahan_sesuai === 'all'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="ml-2">Semua</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-1 flex w-full flex-col items-start">
                                    <label className="mb-2 text-xs font-semibold text-gray-700">File Pendukung</label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center text-xs font-medium text-gray-800">
                                            <input
                                                type="radio"
                                                name="file_pendukung"
                                                value="Y"
                                                checked={filterState.file_pendukung === 'Y'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="ml-2">Ya</span>
                                        </label>
                                        <label className="flex items-center text-xs font-medium text-gray-800">
                                            <input
                                                type="radio"
                                                name="file_pendukung"
                                                value="N"
                                                checked={filterState.file_pendukung === 'N'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="ml-2">Tidak</span>
                                        </label>
                                        <label className="flex items-center text-xs font-medium text-gray-800">
                                            <input
                                                type="radio"
                                                name="file_pendukung"
                                                value="all"
                                                checked={filterState.file_pendukung === 'all'}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-400"
                                            />
                                            <span className="ml-2">Semua</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex h-[10%] w-full items-center justify-center bg-white">
                                <button
                                    onClick={async () => await refreshData()}
                                    className="ml-3 flex h-7 items-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                                >
                                    <RiRefreshFill className="text-md" />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`flex-1 rounded bg-[#dedede]  p-2 ${isSidebarVisible ? 'w-[80%]' : 'w-full'}`}>
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
                    <div className="h-ful w-full rounded  bg-white p-1">
                        <GridCashCount list_kas_opname={list_kas_opname} selectedRowHandle={selectedRowHandle} recordDoubleClick={recordDoubleClick} gridCashCount={gridCashCount} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashCountList;
