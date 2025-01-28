import React, { useCallback, useRef } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import styles from './styling.module.css';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { frmNumber, generateNU, FillFromSQL, fetchPreferensi, appBackdate } from '@/utils/routines';
import { useState, useEffect } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import axios from 'axios';
import { L10n } from '@syncfusion/ej2-base';
import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import Swal from 'sweetalert2';
import Flatpickr from 'react-flatpickr';
import GridBarang from './GridBarang';

// export const dynamic = "force-dynamic";

interface DialogPSList {
    userid: string;
    kode_entitas: any;
    isOpen: boolean;
    onClose: () => void;
    kode_user: any;
    kode_ps: any;
    statusPage: any;
    onRefresh: any;
    token: any;
    valueAppBackdate: any;
    dataTemp: any;
    setDataTemp: any;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

let tabPSList: Tab | any;
let tooltipDetailBarang: Tooltip | any;
let gridDaftarBarang: Grid | any;
let gridDaftarAkun: Grid | any;
let gridDaftarSubledgerCustomer: Grid | any;
let gridDaftarSubledgerSupplier: Grid | any;
let gridDaftarRefrensiMutasiBarang: Grid | any;
let gridDaftarSubledgerIsLedgerY: Grid | any;
let gridJURNALList: Grid | any;

const DialogPSList: React.FC<DialogPSList> = ({ userid, kode_entitas, isOpen, onClose, kode_user, kode_ps, statusPage, token, onRefresh, valueAppBackdate, dataTemp, setDataTemp }) => {
    // **DATA GUDANG** //
    const [selectedKodeGudang, setSelectedKodeGudang] = useState<string>('');
    const [selectedNamaGudang, setSelectedNamaGudang] = useState<string>('');
    const [focusOnGridPsList, setFocusOnGridPsList] = useState<boolean>(true);
    const gridPSList = useRef<any>(null);

    console.log('focusOnGridPsList: ', focusOnGridPsList);

    const [tabSelected, setTabSelected] = useState<string>('dataBarangTab');

    const handleGudangChange = (e: any) => {
        if (statusPage === 'EDIT') {
            gridJURNALList.dataSource.splice(0, gridJURNALList.dataSource.length);
            gridJURNALList.refresh();
            gridPSList.current!.dataSource.splice(0, gridPSList.current!.dataSource.length);
            gridPSList.current!.refresh();
        }
        const selectedGudangData = listGudangforDetail.find((gudang: any) => gudang.nama_gudang === e.value);
        if (selectedGudangData) {
            setSelectedKodeGudang(selectedGudangData.kode_gudang);
            setSelectedNamaGudang(selectedGudangData.nama_gudang);
        }
    };

    console.log('dataTemp', dataTemp);

    // **END DATA GUDANG** //

    //***// DETAIL PS //***//
    const [kodePS, setKodePS] = useState('');
    const [mNoPS, mSetNoPS] = useState('');
    const [date1, setDate1] = useState<any>(moment());

    const [catatanValue, setCatatanValue] = useState('');
    const HandelCatatan = (e: any, setCatatanValue: Function) => {
        setCatatanValue(e);
    };

    const [penyesuaianNilai, setpenyesuaianNilai] = useState<any>(false);

    const handleCheckboxChangeAdjValue = () => {
        setpenyesuaianNilai(!penyesuaianNilai);
    };

    const [listGudangforDetail, setlistGudangforDetail] = useState<any[]>([]);

    const apiGudang = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_gudang_forfilter?`, {
                params: {
                    entitas: kode_entitas,
                    param1: kode_user,
                },
            });
            const responseData = response.data.data;
            const transformedData_getGudang = responseData.map((item: any) => ({
                kode_gudang: item.kode_gudang,
                nama_gudang: item.nama_gudang,
            }));

            setlistGudangforDetail(transformedData_getGudang);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        apiGudang();
    }, [apiUrl, kode_entitas, kode_user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (statusPage === 'CREATE') {
                    if (listGudangforDetail.length > 0) {
                        const { kode_gudang, nama_gudang } = listGudangforDetail[0];
                        setSelectedKodeGudang(kode_gudang);
                        setSelectedNamaGudang(nama_gudang);
                    }

                    const result = await generateNU(kode_entitas, '', '09', moment().format('YYYYMM'));
                    if (result) {
                        mSetNoPS(result);
                    } else {
                        console.error('undefined');
                    }
                } else if (statusPage === 'EDIT') {
                    const response = await axios.get(`${apiUrl}/erp/master_detail_jurnal_ps?entitas=${kode_entitas}&param1=${kode_ps}`);
                    const { master, detail, jurnal } = response.data.data;

                    if (master) {
                        const dataMaster = master[0];
                        setKodePS(dataMaster.kode_ps);
                        const dbDate = moment(dataMaster.tgl_ps, 'YYYY-MM-DD HH:mm:ss');
                        setDate1(dbDate);
                        mSetNoPS(dataMaster.no_ps);
                        setSelectedKodeGudang(dataMaster.kode_gudang);
                        setSelectedNamaGudang(dataMaster.nama_gudang);
                        setCatatanValue(dataMaster.keterangan);
                        setTotalNilaiPersediaan(dataMaster.netto_rp);
                        setpenyesuaianNilai(dataMaster.nilai_adj == 'Y' ? true : false);
                    }
                    if (detail) {
                        console.log('DETAIL EDIT :', detail);

                        const mappedBarangDetails = detail.map((item: any) => ({
                            kode_ps: item.kode_ps,
                            id_ps: item.id_ps,
                            kode_item: item.kode_item,
                            satuan: item.satuan,
                            qty: item.qty,
                            sat_std: item.sat_std,
                            qty_std: item.qty_std,
                            harga_rp: parseFloat(parseFloat(item.harga_rp).toFixed(2)),
                            jumlah_rp: parseFloat(parseFloat(item.jumlah_rp).toFixed(2)),
                            kode_dept: item.kode_dept,
                            kode_kerja: item.kode_kerja,
                            hpp: parseFloat(parseFloat(item.hpp).toFixed(2)),
                            no_kontrak: item.no_kontrak,
                            kustom2: item.no_mbref,
                            kode_sumber: item.kode_sumber,
                            kode_rps: item.kode_rps,
                            beban: item.beban,
                            catatan: item.catatan,
                            no_barang: item.no_item,
                            nama_barang: item.nama_item,
                            batal_beban: item.batal_beban,
                            batal_alasan: item.batal_alasan,
                            batal_userid: item.batal_userid,
                            batal_tanggal: item.batal_tanggal,
                        }));

                        gridPSList.current!.dataSource = mappedBarangDetails;

                        // Untuk Manual Pembebanan
                        let kode_sumber_detail = null;
                        kode_sumber_detail = detail[0].kode_sumber;

                        if (kode_sumber_detail === 'PS') {
                            setManualPembebanan(true);
                        } else if (kode_sumber_detail === null) {
                            setManualPembebanan(false);
                        }
                    }

                    if (jurnal) {
                        const mappedJurnalDetails = jurnal.map((item: any) => ({
                            kode_dokumen: item.kode_dokumen,
                            id_dokumen: item.id_dokumen,
                            dokumen: item.dokumen,
                            tgl_dokumen: item.tgl_dokumen,
                            kode_akun: item.kode_akun,
                            no_akun: item.no_akun,
                            nama_akun: item.nama_akun,
                            tipe: item.tipe,
                            kode_subledger: item.kode_subledger,
                            kurs: item.kurs,
                            debet_rp: Math.abs(item.debet_rp),
                            kredit_rp: Math.abs(item.kredit_rp),
                            jumlah_rp: Math.abs(item.jumlah_rp),
                            jumlah_mu: Math.abs(item.jumlah_mu),
                            catatan: item.catatan,
                            no_warkat: item.no_warkat,
                            tgl_valuta: item.tgl_valuta,
                            persen: item.persen,
                            kode_dept: item.kode_dept,
                            kode_kerja: item.kode_kerja,
                            approval: item.approval,
                            posting: item.posting,
                            rekonsiliasi: item.rekonsiliasi,
                            tgl_rekonsil: item.tgl_rekonsil,
                            userid: item.userid,
                            tgl_update: item.tgl_update,
                            audit: item.audit,
                            kode_kry: item.kode_kry,
                            kode_jual: item.kode_jual,
                            // nama_relasi: null,
                            nama_relasi: item.nama_subledger,
                            no_kontrak_um: item.no_kontrak_um,
                            department: item.department,
                        }));

                        gridJURNALList.dataSource = mappedJurnalDetails;
                    }
                }
            } catch (error) {
                console.error('Terjadi kesalahan saat memuat data:', error);
            }
        };
        fetchData();
    }, [apiUrl, statusPage, listGudangforDetail, kode_entitas, kode_user, kode_ps]);
    //***// END DETAIL PS //***//

    const [listDaftarBarang, setDaftarBarang] = useState([]);

    const [searchNoItem, setSearchNoItem] = useState('');
    const [searchNamaItem, setSearchNamaItem] = useState('');

    const [modalDaftarBarang, setModalDaftarBarang] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState<any>('');

    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(false);

    // useEffect(() => {
    //     if(tabSelected === 'dataBarangTab'){
    //         gridPSList.current!.setProperties({ dataSource: dataTemp });
    //         gridPSList.current!.refresh();
    //     }
    // },[tabSelected]);

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

    const divisiDepartment = async () => {
        await FillFromSQL(kode_entitas, 'departemen')
            .then((result: any) => {
                const modifiedData = result.map((item: any) => ({
                    ...item,
                    dept_ku: item.no_dept_dept + '-' + item.nama_dept,
                    dept_ku2: item.kode_dept + '*' + item.no_dept_dept + '-' + item.nama_dept,
                }));
                setListDepartemen(modifiedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const fetchKodeJualData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/kode_jual?entitas=${kode_entitas}`);
            if (response.data.status) {
                const modifiedData = response.data.data.map((item: any) => ({
                    ...item,
                    jual_ku: item.kode_jual + ' - ' + item.nama_jual,
                    jual_ku2: item.kode_jual + '*' + item.kode_jual + ' - ' + item.nama_jual,
                }));
                setListKodeJual(modifiedData);
            } else {
                console.error('Failed to fetch data:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        divisiDepartment();
        fetchKodeJualData();
        refreshDaftarAkun();
    }, [searchNoItem, searchNamaItem, kode_entitas]);

    const dialogClose = () => {
        setSelectedKodeGudang('');
        setSelectedNamaGudang('');
        setTabSelected('dataBarangTab');
        if (gridPSList && gridPSList.current!.dataSource) {
            gridPSList.current!.dataSource.splice(0, gridPSList.current!.dataSource.length);
        }

        if (gridJURNALList && gridJURNALList.dataSource) {
            gridJURNALList.dataSource.splice(0, gridJURNALList.dataSource.length);
        }
        onClose();
    };

    const useDebounce = (callback: Function, delay: number) => {
        const debounceRef = useRef<any>();

        return useCallback(
            (...args: any[]) => {
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }

                debounceRef.current = setTimeout(() => {
                    callback(...args);
                }, delay);
            },
            [callback, delay],
        );
    };
    const handleDataBarangNew = useDebounce(async (jenis: any) => {
        const totalLine = gridPSList.current!.dataSource.length;
        const isNoBarangNotEmpty = gridPSList.current!.dataSource.every((item: any) => item.no_barang !== null);

        const manualValue = manualPembebanan ? 'Manual pembebanan' : null;
        // gridPSList?.addRecord(); // Menambahkan record baru
        if ((totalLine === 0 && jenis === 'new') || (isNoBarangNotEmpty && jenis === 'new')) {
            let qty = Number(gridPSList.current.dataSource[0].qty);
            if (qty < 0) {
                qty = qty * -1;
            }

            const invalidItem = gridPSList.current!.dataSource.find((item: any) => Number(qty).toFixed(1) > Number(item.kualitas_standar_stok).toFixed(1));
            const qtyOrJumlahRpNotFilled = gridPSList.current!.dataSource.some((item: any) => item.jumlah_rp === 0);

            if (invalidItem) {
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: `<p style="font-size:12px">Kualitas standar (${qty}) melebihi stok yang ada (${Number(invalidItem.kualitas_standar_stok).toFixed(1)})</p>`,
                    width: '100%',
                    target: '#dialogPSList',
                });
                return;
            }

            if (qtyOrJumlahRpNotFilled) {
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: `<p style="font-size:12px">Kuantitas atau nilai penyesuaian belum diisi</p>`,
                    width: '100%',
                    target: '#dialogPSList',
                });
                return;
            }

            const detailBarangBaru = {
                kode_ps: kodePS || null,
                id_ps: totalLine + 1,
                kode_item: null,
                satuan: null,
                qty: 1,
                sat_std: null,
                qty_std: null,
                harga_rp: 0,
                jumlah_rp: 0,
                kode_dept: null,
                kode_kerja: null,
                hpp: 0,
                no_kontrak: null,
                no_mbref: null,
                kode_sumber: null,
                kode_rps: null,
                beban: null,
                catatan: manualValue,
                no_barang: null,
                nama_barang: null,
                kualitas_standar_stok: null,
            };

            gridPSList.current!.addRecord(); // Menambahkan record baru
            setTambah(false);
            setEdit(true);
        }
    }, 200);

    const handleDataBarang = useDebounce(async (jenis: any) => {
        console.log('masuk sini');
        const totalLine = gridPSList.current!.dataSource.length;
        const isNoBarangNotEmpty = gridPSList.current!.dataSource.every((item: any) => item.no_barang !== null);

        const manualValue = manualPembebanan ? 'Manual pembebanan' : null;
        // gridPSList?.addRecord(); // Menambahkan record baru

        if (jenis === 'selected') {
            try {
                // Menggunakan Promise.all untuk menjalankan dua request secara paralel
                const [response, stockResponse] = await Promise.all([
                    axios.get(`${apiUrl}/erp/hpp_ps`, {
                        params: {
                            entitas: kode_entitas,
                            param1: selectedBarang.kode_item,
                            param2: moment().format('YYYY-MM-DD HH:mm:ss'),
                            param3: selectedKodeGudang,
                        },
                    }),
                    axios.get(`${apiUrl}/erp/qty_stock_all`, {
                        params: {
                            entitas: kode_entitas,
                            param1: selectedBarang.kode_item,
                            param2: moment().format('YYYY-MM-DD HH:mm:ss'),
                            param3: selectedKodeGudang,
                            param4: '',
                            param5: 'ps',
                        },
                    }),
                ]);
                const result = response.data.data;
                const harga_hpp = result[0]?.hpp || 0;
                const stockResult = stockResponse.data.data;
                const kualitasStandarStok = stockResult[0]?.stok || 0;
                const detailBarangBaru = {
                    kode_ps: kodePS || null,
                    id_ps: totalLine + 1,
                    kode_item: selectedBarang.kode_item,
                    satuan: selectedBarang.satuan,
                    qty: 1,
                    sat_std: selectedBarang.satuan,
                    qty_std: null,
                    harga_rp: penyesuaianNilai ? 0 : parseFloat(harga_hpp),
                    jumlah_rp: penyesuaianNilai ? 0 : parseFloat(harga_hpp),
                    kode_dept: null,
                    kode_kerja: null,
                    hpp: penyesuaianNilai ? 0 : parseFloat(harga_hpp),
                    no_kontrak: null,
                    no_mbref: null,
                    kode_sumber: null,
                    kode_rps: null,
                    beban: null,
                    catatan: manualValue,
                    no_barang: selectedBarang.no_item,
                    nama_barang: selectedBarang.nama_item,
                    kualitas_standar_stok: kualitasStandarStok,
                };
                // Membuat salinan dataSource dan memodifikasinya
                const updatedDataSource = [...gridPSList.current!.dataSource];
                updatedDataSource[totalLine] = detailBarangBaru;
                gridPSList.current!.dataSource = updatedDataSource;
                setTimeout(() => {
                    const temp = [...gridPSList.current!.dataSource];
                    setDataTemp(temp);
                }, 200);
                setTambah(false);
                setEdit(true);
                // gridPSList.current!.refresh(); // Refresh grid setelah dataSource diperbarui
            } catch (error) {
                console.error('Error fetching data:', error);
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: `<p style="font-size:12px">Gagal memuat data barang</p>`,
                    width: '100%',
                    target: '#dialogPSList',
                });
            }
        } else {
            document.getElementById('gridPSList')?.focus();
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Silahkan melengkapi data barang sebelum menambah data baru</p>',
                width: '100%',
                target: '#dialogPSList',
            });
        }
    }, 1000);

    const rowSelectingDetailBarang = (args: any) => {
        setSelectedRowIndex(args.rowIndex);
    };

    const getFromModalBarang = useCallback(async () => {
        handleDataBarang('selected');
        setModalDaftarBarang(false);
    }, [handleDataBarang, setModalDaftarBarang]);

    // const actionBeginDetailBarang = async (args: any) => {
    //     console.log('aaaaa');
    // };

    const formatFloat = { format: 'N2', decimals: 4 };
    const qtyParams = { params: { format: 'N2', decimals: 4, showClearButton: false, showSpinButton: false } };

    //================ END HANDLE DELETE TABLE BARANG ==================

    //==================== TEMPLATE MASTER BARANG ==================

    const refreshDaftarBarang = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_barang?`, {
                params: {
                    entitas: kode_entitas,
                    kode: searchNoItem ? searchNoItem : 'all',
                    nama: searchNamaItem ? searchNamaItem : 'all',
                    limit: '25',
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarBarang(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        refreshDaftarBarang();
    }, [searchNoItem, searchNamaItem, kode_entitas]);

    const [kodeItemSelected, setKodeItemSelected] = useState<any>('');

    //================ END TEMPLATE MASTER BARANG ==================

    //====================  ****DATA HEADER****  =======================//

    // **TANGGAL** //

    // Disable hari minggu di calendar
    let textareaObj: any;
    function onCreateMultiline(): void {
        textareaObj.addAttributes({ rows: 1 });
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = '60px';
    }

    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }

    // **END TANGGAL** //

    //====================  ****END DATA HEADER****  =======================//

    //////////////////////////////////////////////////////////////////////////
    ////////////////////////// *******JURNAL******* //////////////////////////
    //////////////////////////////////////////////////////////////////////////

    const [modalDaftarAkun, setModalDaftarAkun] = useState(false);
    const [selectedJurnal, setSelectedJurnal] = useState<any>('');
    const [selectedSubledgerCustomer, setSelectedSubledgerCustomer] = useState<any>('');
    const [selectedSubledgerIsLedgerY, setSelectedSubledgerIsLedgerY] = useState<any>('');
    const [selectedSubledgerSupplier, setSelectedSubledgerSupplier] = useState<any>('');
    const [selectedMutasiBarang, setSelectedMutasiBarang] = useState<any>('');

    const [listDaftarAkun, setDaftarAkun] = useState<any>([]);
    const [listDaftarSubledgerCustomer, setDaftarSubledgerCustomer] = useState([]);
    const [listDaftarSubledgerIsLedgerY, setDaftarSubledgerIsLedgerY] = useState([]);
    const [listDaftarSubledgerSupplier, setDaftarSubledgerSupplier] = useState([]);
    const [listDaftarRefrensiMutasiBarang, setDaftarRefrensiMutasiBarang] = useState([]);
    const [selectedRowIndexJurnal, setSelectedRowIndexJurnal] = useState(0);

    const refreshDaftarAkun = async () => {
        await setSearchNoakunJurnal('');
        await setSearchNamaAkunJurnal('');
        try {
            const response = await axios.get(`${apiUrl}/erp/akun_jurnal`, {
                params: {
                    entitas: kode_entitas,
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

    const refreshDaftaSubledgerCustomer = async (kode_mu: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/customer_dlg_bm`, {
                params: {
                    entitas: kode_entitas,
                    param1: kode_mu,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;
            if (result.status) {
                setDaftarSubledgerCustomer(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftaSubledgerIsLedgerY = async (kodeAkun: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/get_subledger_by_kode_akun`, {
                params: {
                    entitas: kode_entitas,
                    param1: kodeAkun,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarSubledgerIsLedgerY(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftaSubledgerSupplier = async (kode_mu: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/suplier_dlg_bm`, {
                params: {
                    entitas: kode_entitas,
                    param1: kode_mu,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarSubledgerSupplier(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const refreshDaftarRefrensiMutasiBarang = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_ref_mb_in`, {
                params: {
                    entitas: kode_entitas,
                    param1: selectedKodeGudang,
                    param2: kodeItemSelected,
                },
            });
            const result = response.data;

            if (result.status) {
                setDaftarRefrensiMutasiBarang(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (kodeItemSelected) {
            refreshDaftarRefrensiMutasiBarang();
        }
    }, [kode_entitas, selectedKodeGudang, kodeItemSelected]);

    const gridIndukHeaderJurnal = (props: any) => {
        return <div style={{ fontWeight: props.header === 'Y' ? 'bold' : 'normal', marginLeft: props.header === 'N' ? '0.5rem' : '0' }}>{props[props.column.field]}</div>;
    };

    const getFromModalAkun = async () => {
        if (selectedJurnal.header === 'Y') {
            swal.fire({
                text: `No akun ${selectedJurnal.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi`,
                icon: 'warning',
                target: '#dialogJurnalHeaderList',
            });
        } else {
            handleEditAkunJurnal('selected');
            setModalDaftarAkun(false);
        }
    };

    const getFromModalSubledger_Customer = async () => {
        handleEditSubledgerCustomer('selected');
        setModalDaftarSubledgerCustomer(false);
    };

    const getFromModalSubledger_IsLedgerY = async () => {
        handleEditSubledgerIsLedgerY('selected');
        setModalDaftarSubledgerIsLedgerY(false);
    };

    const getFromModalSubledgerSupplier = async () => {
        handleEditSubledgerSupplier('selected');
        setModalDaftarSubledgerSupplier(false);
    };

    const getMutasiBarang = async () => {
        console.log(gridPSList.current!.dataSource);

        handleEditMutasiBarang('selected');
        setModalDaftarRefrensiMutasiBarang(false);
    };

    const handleEditAkunJurnal = async (jenis: any) => {
        if (jenis === 'selected') {
            const updateSelectedJurnal = {
                kode_akun: selectedJurnal.kode_akun,
                no_akun: selectedJurnal.no_akun,
                nama_akun: selectedJurnal.nama_akun,
                tipe: selectedJurnal.tipe,
                kode_mu: selectedJurnal.kode_mu,
                nama_relasi: '',
                kode_subledger: '',
                userid: userid,
            };
            if (selectedRowIndexJurnal >= 0 && selectedRowIndexJurnal < gridJURNALList.dataSource.length) {
                gridJURNALList.dataSource[selectedRowIndexJurnal] = {
                    ...gridJURNALList.dataSource[selectedRowIndexJurnal],
                    ...updateSelectedJurnal,
                };
                setTambah(true);
                setSelectedSubledgerCustomer('');
                setSelectedSubledgerIsLedgerY('');
                setSelectedSubledgerSupplier('');
                gridJURNALList.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
    };

    const handleEditSubledgerCustomer = async (jenis: any) => {
        if (jenis === 'selected') {
            const updateSubledger = {
                nama_relasi: selectedSubledgerCustomer?.nama_relasi,
                kode_subledger: selectedSubledgerCustomer.kode_cust,
                userid: userid,
            };
            if (selectedRowIndexJurnal >= 0 && selectedRowIndexJurnal < gridJURNALList.dataSource.length) {
                gridJURNALList.dataSource[selectedRowIndexJurnal] = {
                    ...gridJURNALList.dataSource[selectedRowIndexJurnal],
                    ...updateSubledger,
                };
                setTambah(true);
                gridJURNALList.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
    };

    const handleEditSubledgerIsLedgerY = async (jenis: any) => {
        if (jenis === 'selected') {
            const updateSubledger = {
                nama_relasi: selectedSubledgerIsLedgerY.nama_subledger,
                kode_subledger: selectedSubledgerIsLedgerY.kode_subledger,
                userid: userid,
            };
            if (selectedRowIndexJurnal >= 0 && selectedRowIndexJurnal < gridJURNALList.dataSource.length) {
                gridJURNALList.dataSource[selectedRowIndexJurnal] = {
                    ...gridJURNALList.dataSource[selectedRowIndexJurnal],
                    ...updateSubledger,
                };
                setTambah(true);
                gridJURNALList.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
    };

    const handleEditSubledgerSupplier = async (jenis: any) => {
        if (jenis === 'selected') {
            const updateSubledger = {
                nama_relasi: selectedSubledgerSupplier?.nama_relasi,
                kode_subledger: selectedSubledgerSupplier.kode_supp,
                userid: userid,
            };
            if (selectedRowIndexJurnal >= 0 && selectedRowIndexJurnal < gridJURNALList.dataSource.length) {
                gridJURNALList.dataSource[selectedRowIndexJurnal] = {
                    ...gridJURNALList.dataSource[selectedRowIndexJurnal],
                    ...updateSubledger,
                };
                setTambah(true);
                gridJURNALList.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
    };

    const handleEditMutasiBarang = async (jenis: any) => {
        if (jenis === 'selected') {
            const updateRefrensiMutasiBarang = {
                kustom2: selectedMutasiBarang.kustom2,
            };
            if (selectedRowIndex >= 0 && selectedRowIndex < gridPSList.current!.dataSource.length) {
                gridPSList.current!.dataSource[selectedRowIndex] = {
                    ...gridPSList.current!.dataSource[selectedRowIndex],
                    ...updateRefrensiMutasiBarang,
                };
                console.log('aku data: ', gridPSList.current.dataSource);
                setTambah(true);
                gridPSList.current!.refresh();
            } else {
                console.error('Invalid selectedRowIndex:', selectedRowIndex);
            }
        }
    };

    const rowSelectingDetailJurnal = (args: any) => {
        setSelectedRowIndexJurnal(args.rowIndex);
    };

    const [totalDebit, setTotalDebit] = useState<any>(0);
    const [totalKredit, setTotalKredit] = useState<any>(0);

    let statusNolJurnal: string;

    const actionBeginDetailJurnal = async (args: any) => {
        if (args.requestType === 'beginEdit') {
            if (args.rowData.debet_rp === 0) {
                statusNolJurnal = 'Debit';
            } else if (args.rowData.kredit_rp === 0) {
                statusNolJurnal = 'Kredit';
            }
        }
    };

    const actionCompleteDetailJurnal = async (args: any) => {
        switch (args.requestType) {
            case 'save':
                let editedData;
                if (statusNolJurnal === 'Debit' && gridJURNALList.dataSource[args.rowIndex].debet_rp !== 0) {
                    editedData = { ...args.data, kredit_rp: 0 };
                    gridJURNALList.dataSource[args.rowIndex] = editedData;
                } else if (statusNolJurnal === 'Kredit' && gridJURNALList.dataSource[args.rowIndex].kredit_rp !== 0) {
                    editedData = { ...args.data, debet_rp: 0 };
                    gridJURNALList.dataSource[args.rowIndex] = editedData;
                }
                kalkulasiJurnal();
                gridJURNALList.refresh();
                break;
            case 'beginEdit':
                break;
            case 'delete':
                break;
            case 'refresh':
                kalkulasiJurnal();
                break;
            default:
                break;
        }
    };

    const kalkulasiJurnal = () => {
        Promise.all(
            gridJURNALList.dataSource.map(async (item: any) => {
                item.jumlah_mu = item.debet_rp - item.kredit_rp;
                item.jumlah_rp = item.debet_rp - item.kredit_rp;
            }),
        ).then(() => {
            const totalDebit = gridJURNALList.dataSource.reduce((total: any, item: any) => {
                return total + item.debet_rp;
            }, 0);
            const totalKredit = gridJURNALList.dataSource.reduce((total: any, item: any) => {
                return total + item.kredit_rp;
            }, 0);

            setTotalDebit(totalDebit);
            setTotalKredit(totalKredit);
        });
    };

    const [totalNilaiPersediaan, setTotalNilaiPersediaan] = useState<any>(0);

    const autoJurnal = async () => {
        console.log(gridPSList.current!.dataSource);

        const invalidItem = gridPSList.current!.dataSource.find((item: any) => {
            return Number(item.qty) < 0 && Number(Math.abs(Number(item.qty)).toFixed(1)) > Number(Number(item.kualitas_standar_stok).toFixed(1));
        });

        const isNotEmptyQty = gridPSList.current.dataSource.every((item: any) => item.qty === null);

        if (invalidItem) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: `<p style="font-size:12px">Kualitas standar (${Math.abs(Number(invalidItem.qty)).toFixed(1)}) melebihi stok yang ada (${Number(invalidItem.kualitas_standar_stok).toFixed(
                    1,
                )})</p>`,
                width: '100%',
                target: '#dialogPSList',
            });
            return;
        }
        if (isNotEmptyQty) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: `<p style="font-size:12px">Lengkapi kuantitas di data barang</p>`,
                width: '100%',
                target: '#dialogPSList',
            });
            return;
        }

        try {
            const result = await fetchPreferensi(kode_entitas, apiUrl);

            const getAkunJurnalById = async (kode_entitas: any, kode_akun: any) => {
                const response = await axios.get(`${apiUrl}/erp/akun_jurnal_by_id?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: kode_akun,
                        param2: 'all',
                        param3: 'all',
                    },
                });
                return response.data.data[0];
            };

            const [resAkunPersediaanBarangDagang, resAkunBebanPenyesuaianPersediaan] = await Promise.all([
                getAkunJurnalById(kode_entitas, result[0].kode_akun_persediaan),
                getAkunJurnalById(kode_entitas, result[0].kode_akun_kerusakan_barang),
            ]);

            const akunJurnal = (isPositive: boolean) => ({
                kode_akun: isPositive ? resAkunPersediaanBarangDagang.kode_akun : resAkunBebanPenyesuaianPersediaan.kode_akun,
                no_akun: isPositive ? resAkunPersediaanBarangDagang.no_akun : resAkunBebanPenyesuaianPersediaan.no_akun,
                nama_akun: isPositive ? resAkunPersediaanBarangDagang.nama_akun : resAkunBebanPenyesuaianPersediaan.nama_akun,
                tipe: isPositive ? resAkunPersediaanBarangDagang.tipe : resAkunBebanPenyesuaianPersediaan.tipe,
            });

            const isPositive = totalNilaiPersediaan >= 0;

            const reqbody1 = akunJurnal(isPositive);
            const reqbody2 = akunJurnal(!isPositive);

            if (gridPSList.current!.dataSource.length === 0 || gridPSList.current!.dataSource.some((item: any) => !item.no_barang.trim())) {
                document.getElementById('gridPSList')?.focus();
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: `<p style="font-size:12px">Silahkan isi data barang terlebih dulu</p>`,
                    width: '100%',
                    target: '#dialogPSList',
                });
            } else {
                const json = {
                    kode_dokumen: kodePS ? kodePS : null,
                    id_dokumen: 1,
                    dokumen: 'PS',
                    tgl_dokumen: date1.format('YYYY-MM-DD HH:mm:ss'),
                    // kode_akun: resAkunPersediaanBarangDagang.kode_akun,
                    // no_akun: resAkunPersediaanBarangDagang.no_akun,
                    // nama_akun: resAkunPersediaanBarangDagang.nama_akun,
                    // tipe: resAkunPersediaanBarangDagang.tipe,
                    ...reqbody1,
                    kode_subledger: null,
                    kurs: 1.0,
                    debet_rp: Math.abs(totalNilaiPersediaan),
                    kredit_rp: 0,
                    // jumlah_rp: totalNilaiPersediaan,
                    // jumlah_mu: totalNilaiPersediaan,
                    catatan: catatanValue + ` No. ${mNoPS}`,
                    no_warkat: null,
                    tgl_valuta: date1.format('YYYY-MM-DD HH:mm:ss'),
                    persen: 0.0,
                    kode_dept: null,
                    kode_kerja: null,
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: null,
                    userid: userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: null,
                    kode_kry: null,
                    kode_jual: null,
                    nama_relasi: null,
                    no_kontrak_um: null,
                    department: null,
                };
                const json2 = {
                    kode_dokumen: kodePS ? kodePS : null,
                    id_dokumen: 2,
                    dokumen: 'PS',
                    tgl_dokumen: date1.format('YYYY-MM-DD HH:mm:ss'),
                    // kode_akun: resAkunBebanPenyesuaianPersediaan.kode_akun,
                    // no_akun: resAkunBebanPenyesuaianPersediaan.no_akun,
                    // nama_akun: resAkunBebanPenyesuaianPersediaan.nama_akun,
                    // tipe: resAkunBebanPenyesuaianPersediaan.tipe,
                    ...reqbody2,
                    kode_subledger: null,
                    kurs: 1.0,
                    debet_rp: 0,
                    kredit_rp: Math.abs(totalNilaiPersediaan),
                    // jumlah_rp: totalNilaiPersediaan,
                    // jumlah_mu: totalNilaiPersediaan,
                    catatan: catatanValue + ` No. ${mNoPS}`,
                    no_warkat: null,
                    tgl_valuta: date1.format('YYYY-MM-DD HH:mm:ss'),
                    persen: 0.0,
                    kode_dept: null,
                    kode_kerja: null,
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: null,
                    userid: userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    audit: null,
                    kode_kry: null,
                    kode_jual: null,
                    nama_relasi: null,
                    no_kontrak_um: null,
                    department: null,
                };

                const combinedArray: any = [];

                combinedArray.push(json);
                combinedArray.push(json2);
                gridJURNALList.dataSource = combinedArray;
                gridJURNALList.refresh();
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    const editTemplateMaster_No_Akun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data akun jurnal" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.no_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalDaftarAkun(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateMaster_Nama_Akun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args.nama_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalDaftarAkun(true);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const [modalDaftarSubledgerCustomer, setModalDaftarSubledgerCustomer] = useState(false);
    const [modalDaftarSubledgerSupplier, setModalDaftarSubledgerSupplier] = useState(false);
    const [modalDaftarSubledgerIsLedgerY, setModalDaftarSubledgerIsLedgerY] = useState(false);
    const [modalDaftarRefrensiMutasiBarang, setModalDaftarRefrensiMutasiBarang] = useState(false);

    const editTemplateMaster_Subledger = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent value={args?.nama_relasi} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button"
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={async () => {
                                    const akun = gridJURNALList.dataSource[args.index].kode_akun;
                                    const no_akun = gridJURNALList.dataSource[args.index].no_akun;
                                    const tipe = gridJURNALList.dataSource[args.index].tipe;
                                    const kode_mu = gridJURNALList.dataSource[args.index].kode_mu;
                                    const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
                                        params: {
                                            entitas: kode_entitas,
                                            param1: akun,
                                        },
                                    });
                                    if (tipe === 'Piutang') {
                                        await refreshDaftaSubledgerCustomer(kode_mu);
                                        if (listDaftarSubledgerCustomer) {
                                            setModalDaftarSubledgerCustomer(true);
                                        }
                                    } else if (tipe === 'Hutang') {
                                        await refreshDaftaSubledgerSupplier(kode_mu);
                                        if (listDaftarSubledgerSupplier) {
                                            setModalDaftarSubledgerSupplier(true);
                                        }
                                    } else if (cek_subledger.data.data[0].subledger === 'Y') {
                                        await refreshDaftaSubledgerIsLedgerY(akun);
                                        if (listDaftarSubledgerIsLedgerY) {
                                            setModalDaftarSubledgerIsLedgerY(true);
                                        }
                                    } else {
                                        withReactContent(swalToast).fire({
                                            icon: 'error',
                                            title: `<p style="font-size:12px">Data Akun ${no_akun} Tidak Mempunyai Subledger</p>`,
                                            width: '100%',
                                            target: '#dialogPSList',
                                        });
                                    }
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    //============================= LIST department =============================

    const [listDepartemen, setListDepartemen] = useState<any>([]);

    const editTemplateDepartemen = (args: any) => {
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DropDownListComponent
                    id="dept"
                    name="dept"
                    dataSource={listDepartemen}
                    fields={{ value: 'dept_ku2', text: `dept_ku` }}
                    floatLabelType="Never"
                    placeholder={args.department == 'undefined-undefined' ? '' : args.department}
                    onChange={(e: any) => {
                        gridJURNALList.dataSource[args.index] = { ...gridJURNALList.dataSource[args.index], kode_dept: e.value.split(/\*/)[0], department: e.value.split(/\*/)[1] };
                        gridJURNALList.refresh();
                    }}
                />
            </div>
        );
    };
    //============================= END LIST department =============================

    //============================= LIST KODE JUAL (DIVISI PERNJUALAN) ================================

    const [listKodeJual, setListKodeJual] = useState([]);

    const editTemplateKodeJual = (args: any) => {
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DropDownListComponent
                    id="jual"
                    name="jual"
                    dataSource={listKodeJual}
                    fields={{ value: 'jual_ku2', text: 'jual_ku' }}
                    floatLabelType="Never"
                    placeholder={args.kode_jual}
                    onChange={(e: any) => {
                        gridJURNALList.dataSource[args.index] = {
                            ...gridJURNALList.dataSource[args.index],
                            kode_jual: e.value.split('*')[0],
                            nama_jual: e.value.split('*')[1],
                        };
                        gridJURNALList.refresh();
                    }}
                />
            </div>
        );
    };
    //============================= END LIST KODE JUAL (DIVISI PENJUALAN) =============================

    const DetailBarangDeleteAllJurnal = () => {
        withReactContent(Swal)
            .fire({
                html: '<p>Hapus semua data jurnal?</p>',
                width: '19%',
                target: '#dialogPSList',
                showCancelButton: true,
                confirmButtonText: '<p style="font-size:10px">Ya</p>',
                cancelButtonText: '<p style="font-size:10px">Tidak</p>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    gridJURNALList.dataSource.splice(0, gridJURNALList.dataSource.length);
                    gridJURNALList.refresh();
                } else {
                    // console.log('cancel');
                }
            });
    };

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////// *******END JURNAL******* //////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    const [filteredData, setFilteredData] = useState('');
    const [searchNoIsLedgerY, setSearchNoIsLedgerY] = useState('');
    const [searchNamaIsLedgerY, setSearchNamaIsLedgerY] = useState('');

    // FILTER JURNAL //
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

    // FILTER SUBLEDGER ISLEDGER Y //
    const [filteredDataIsLedgerY, setFilteredDataIsLedgerY] = useState('');
    const [searchNoAkunJurnal, setSearchNoakunJurnal] = useState('');
    const [searchNamaAkunJurnal, setSearchNamaAkunJurnal] = useState('');

    const PencarianNoakunIsLedgerY = async (event: string, setSearchNoakunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoIsLedgerY(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNamaIsLedgerY = document.getElementById('cariNamaIsLedgerY') as HTMLInputElement;
        if (cariNamaIsLedgerY) {
            cariNamaIsLedgerY.value = '';
        }
    };

    const SearchDataNoIsLedgerY = (keyword: any, listDaftarSubledgerIsLedgerY: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerIsLedgerY;
        } else {
            const filteredData = listDaftarSubledgerIsLedgerY.filter((item) => item.no_subledger.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaakunIsLedgerY = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaisLedgerY(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNoIsLedgerY = document.getElementById('cariNoIsLedgerY') as HTMLInputElement;
        if (cariNoIsLedgerY) {
            cariNoIsLedgerY.value = '';
        }
    };

    const SearchDataNamaisLedgerY = (keyword: any, listDaftarSubledgerIsLedgerY: any[]) => {
        if (keyword === '') {
            return listDaftarSubledgerIsLedgerY;
        } else {
            const filteredData = listDaftarSubledgerIsLedgerY.filter((item) => item.nama_subledger.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    // FILTER SUBLEDGER SUPPLIER //
    const [filteredDataSubledgerSupplier, setFilteredDataSubledgerSupplier] = useState('');
    const [searchNoSubledgerSupplier, setSearchNoSubledgerSupplier] = useState('');
    const [searchNamaSubledgerSupplier, setSearchNamaSubledgerSupplier] = useState('');

    const PencarianNoSubledgerSupplier = async (event: string, setSearchNoSubledgerSupplier: Function, setFilteredData: Function, listDaftarAkun: any[]) => {
        const searchValue = event;
        setSearchNoSubledgerSupplier(searchValue);
        const filteredData = SearchDataNoSubledgerSupplier(searchValue, listDaftarAkun);
        setFilteredData(filteredData);

        const cariNamaAkun = document.getElementById('cariNamaAkun') as HTMLInputElement;
        if (cariNamaAkun) {
            cariNamaAkun.value = '';
        }
    };

    const SearchDataNoSubledgerSupplier = (keyword: any, listDaftarAkun: any[]) => {
        if (keyword === '') {
            return listDaftarAkun;
        } else {
            const filteredData = listDaftarAkun.filter((item) => item.no_supp.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaSubledgerSupplier = async (event: string, setSearchNamaSubledgerSupplier: Function, setFilteredData: Function, listDaftarAkun: any[]) => {
        const searchValue = event;
        setSearchNamaSubledgerSupplier(searchValue);
        const filteredData = SearchDataNamaSubledgerSupplier(searchValue, listDaftarAkun);
        setFilteredData(filteredData);

        const cariNoAkun = document.getElementById('cariNoAkun') as HTMLInputElement;
        if (cariNoAkun) {
            cariNoAkun.value = '';
        }
    };

    const SearchDataNamaSubledgerSupplier = (keyword: any, listDaftarAkun: any[]) => {
        if (keyword === '') {
            return listDaftarAkun;
        } else {
            const filteredData = listDaftarAkun.filter((item) => item?.nama_relasi.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    // FILTER SUBLEDGER CUSTOMER //
    const [filteredDataCustomer, setFilteredDataCustomer] = useState<any>([]);
    const [searchNoCust, setSearchNoCust] = useState<any>('');
    const [searchnamaCustPusat, setSearchnamaCustPusat] = useState<any>('');
    const [searchNamaSalesman, setSearchNamaSalesman] = useState<any>('');

    const PencarianCustomer = (event: any, setSearchValue: Function, setFilteredData: Function, listData: any[], field: any) => {
        const searchValue = event;
        setSearchValue(searchValue);
        const filteredData = SearchDataCustomer(searchValue, listData, field);
        setFilteredData(filteredData);
    };

    const SearchDataCustomer = (keyword: any, listData: any[], field: any) => {
        if (keyword === '') {
            return listData;
        } else {
            const filteredData = listData.filter((item) => item[field].toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const validate = async () => {
        const filteJurnal = gridJURNALList.dataSource.filter((item: any) => item.hasOwnProperty('no_akun') && item.no_akun !== '');
        const someKodeDeptNull = gridJURNALList.dataSource.some(
            (item: any) =>
                item.kode_dept === null &&
                [
                    //'Pendapatan',
                    //'Pendapatan Lain-Lain',
                    'Beban',
                    'Beban Lain-Lain',
                ].includes(item.tipe),
        );

        const someKodeJualNull = gridJURNALList.dataSource.some((item: any) => item.kode_jual === null && ['Pendapatan', 'Pendapatan Lain-Lain', 'Beban', 'Beban Lain-Lain'].includes(item.tipe));

        const qtyNull = gridPSList.current!.dataSource.some((item: any) => item.qty === null);
        const jumlahrpNull = gridPSList.current!.dataSource.some((item: any) => item.jumlah_rp === 0);

        if (filteJurnal.length <= 0) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Jurnal masih kosong</p>',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        if (someKodeDeptNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Departemen belum diisi</p>',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        if (someKodeJualNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Divisi penjualan belum diisi</p>',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        if (qtyNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Kuantitas belum diisi</p>',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        if (jumlahrpNull) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Nilai Persediaan belum diisi</p>',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        if (!catatanValue) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: '<p style="font-size:12px">Keterangan belum diisi</p>',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        // Kondisi tambahan: Cek subledger untuk setiap kode akun
        for (const item of gridJURNALList.dataSource) {
            const { kode_akun, nama_relasi, tipe, kode_mu } = item;
            try {
                const params = {
                    entitas: kode_entitas,
                    param1: kode_akun,
                };
                const response = await axios.get(`${apiUrl}/erp/cek_subledger_by_akunid`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: kode_akun,
                    },
                });

                if (response.data.data && (nama_relasi === null || nama_relasi === '')) {
                    if (tipe === 'Piutang') {
                        await refreshDaftaSubledgerCustomer(kode_mu);
                        if (listDaftarSubledgerCustomer) {
                            setModalDaftarSubledgerCustomer(true);
                        }
                    } else if (tipe === 'Hutang') {
                        await refreshDaftaSubledgerSupplier(kode_mu);
                        if (listDaftarSubledgerSupplier) {
                            setModalDaftarSubledgerSupplier(true);
                        }
                    } else if (cek_subledger.data.data[0].subledger === 'Y') {
                        await refreshDaftaSubledgerIsLedgerY(kode_akun);
                        if (listDaftarSubledgerIsLedgerY) {
                            setModalDaftarSubledgerIsLedgerY(true);
                        }
                    }
                    return false;
                }
            } catch (error) {
                console.error('Error checking subledger:', error);
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: 'Terjadi kesalahan saat memeriksa subledger.',
                    width: '100%',
                    target: '#dialogPSList',
                });
                return false;
            }
        }

        if (
            totalNilaiPersediaan === '' ||
            totalNilaiPersediaan === null ||
            totalNilaiPersediaan === 'NaN' ||
            totalNilaiPersediaan === 0 ||
            totalNilaiPersediaan === 0.0 ||
            totalNilaiPersediaan === '0.0000'
        ) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: 'Total Penyesuaian belum terisi.',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }
        const isNotEmptyQty = gridPSList.current.dataSource.every((item: any) => item.qty === null);
        if (isNotEmptyQty) {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: 'Kuantitas barang belum di isi.',
                width: '100%',
                target: '#dialogPSList',
            });
            return false;
        }

        return saveDoc();
        alert('data berhasil disimpan');
    };

    const saveDoc = async () => {
        // const dataTemp = gridPSList.current.dataSource;
        // console.log("dataTemp :",dataTemp );
        // return;

        if (gridPSList) {
            (gridPSList as any).current.endEdit(); // Menyimpan perubahan edit
        }

        if (statusPage == 'CREATE') {
            const modifiedDetailJson: any = gridPSList.current!.dataSource.map((item: any) => {
                const { no_barang, nama_barang, qty, kode_ps, kualitas_standar_stok, ...value } = item;
                return { ...value, qty, qty_std: qty, kode_sumber: manualPembebanan ? 'PS' : null, no_mbref: item.kustom2, catatan: manualPembebanan ? 'Manual pembebanan' : null };
            });

            const modifiedDetailJurnal: any = gridJURNALList.dataSource.map((item: any, index: number) => {
                const { kode_dokumen, no_akun, nama_akun, tipe, nama_relasi, nama_jual, departemen, no_kontrak_um, batal_beban, batal_alasan, batal_userid, batal_tanggal, ...value } = item;
                return { ...value };
            });

            const kode_akun_ps = gridJURNALList.dataSource.length > 0 ? gridJURNALList.dataSource[0].kode_akun : '';
            const penyesuaianNilaiValue = penyesuaianNilai ? 'Y' : 'N';
            const reqBody = {
                entitas: kode_entitas,
                no_ps: mNoPS,
                tgl_ps: date1.format('YYYY-MM-DD HH:mm:ss'),
                tgl_buku: date1.format('YYYY-MM-DD HH:mm:ss'),
                kode_gudang: selectedKodeGudang,
                kode_akun_ps: kode_akun_ps,
                nilai_adj: penyesuaianNilaiValue,
                netto_rp: totalNilaiPersediaan,
                keterangan: catatanValue,
                status: 'Terbuka',
                userid: userid,
                kode_item: null,
                qty_std: null,
                tgl_update: date1.format('YYYY-MM-DD HH:mm:ss'),
                detail: modifiedDetailJson,
                jurnal: modifiedDetailJurnal,
            };
            try {
                const resultNoPS = await generateNU(kode_entitas, '', '09', moment().format('YYYYMM'));
                const response = await axios.post(`${apiUrl}/erp/simpan_ps`, reqBody);

                if (response.data.status === true) {
                    await generateNU(kode_entitas, resultNoPS, '09', moment().format('YYYYMM'));

                    const auditReqBody = {
                        entitas: kode_entitas,
                        kode_audit: null,
                        dokumen: 'PS',
                        kode_dokumen: response.data.kode_dokumen,
                        no_dokumen: mNoPS,
                        tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                        proses: 'NEW',
                        diskripsi: `PS item = ${modifiedDetailJson.length} nilai transaksi ${totalNilaiPersediaan}`,
                        userid: userid,
                        system_user: '', //username login
                        system_ip: '', //ip address
                        system_mac: '', //mac address
                    };

                    await axios.post(`${apiUrl}/erp/simpan_audit`, auditReqBody);

                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Input Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogPSList',
                    });
                    setTimeout(() => {
                        dialogClose();
                        onRefresh();
                    }, 1000);
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px">Input Data Gagal</p>`,
                        width: '100%',
                        target: '#dialogPSList',
                    });
                }
            } catch (error: any) {
                console.error('Error:', error);
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: `<p style="font-size:12px">${error.message}</p>`,
                    width: '100%',
                    target: '#dialogPSList',
                });
                return;
            }
        } else if (statusPage == 'EDIT') {
            const modifiedDetailJson: any = gridPSList.current!.dataSource.map((item: any) => {
                const { no_barang, nama_barang, qty, kualitas_standar_stok, ...value } = item;
                return { ...value, qty, qty_std: qty, kode_sumber: manualPembebanan ? 'PS' : null, no_mbref: item.kustom2, catatan: manualPembebanan ? 'Manual pembebanan' : null, kode_ps: kodePS };
            });

            const modifiedDetailJurnal: any = gridJURNALList.dataSource.map((item: any, index: number) => {
                const { no_akun, nama_akun, tipe, nama_relasi, nama_jual, departemen, no_kontrak_um, batal_beban, batal_alasan, batal_userid, batal_tanggal, ...value } = item;
                return { ...value };
            });

            const kode_akun_ps = gridJURNALList.dataSource.length > 0 ? gridJURNALList.dataSource[0].kode_akun : '';
            const penyesuaianNilaiValue = penyesuaianNilai ? 'Y' : 'N';
            const reqBody = {
                entitas: kode_entitas,
                no_ps: mNoPS,
                tgl_ps: date1.format('YYYY-MM-DD HH:mm:ss'),
                tgl_buku: date1.format('YYYY-MM-DD HH:mm:ss'),
                kode_gudang: selectedKodeGudang,
                kode_akun_ps: kode_akun_ps,
                nilai_adj: penyesuaianNilaiValue,
                netto_rp: totalNilaiPersediaan,
                keterangan: catatanValue,
                status: 'Terbuka',
                userid: userid,
                kode_item: null,
                qty_std: null,
                tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                kode_ps: kodePS,
                detail: modifiedDetailJson,
                jurnal: modifiedDetailJurnal,
            };
            try {
                const response = await axios.patch(`${apiUrl}/erp/update_ps`, reqBody);
                if (response.data.status === true) {
                    withReactContent(swalToast).fire({
                        icon: 'success',
                        title: `<p style="font-size:12px">Edit Data berhasil</p>`,
                        width: '100%',
                        target: '#dialogPSList',
                    });

                    setTimeout(() => {
                        dialogClose();
                        onRefresh();
                    }, 1000);
                }
                if (response.data.status === false) {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: `<p style="font-size:12px">Edit Data Gagal</p>`,
                        width: '100%',
                        target: '#dialogPSList',
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const [manualPembebanan, setManualPembebanan] = useState<any>(false);
    const handleCheckboxChangePembebanan = () => {
        setManualPembebanan(!manualPembebanan);
    };

    const footerTemplateJurnal = () => (
        <div style={{ width: '395px' }} className="fixed bottom-0">
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => {
                    setModalDaftarAkun(false);
                }}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => getFromModalAkun()}
            />
        </div>
    );

    const footerTemplateBarang = () => (
        <div style={{ width: '395px' }}>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => setModalDaftarBarang(false)}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => getFromModalBarang()}
            />
        </div>
    );

    const footerTemplateSubledgerCustomer = () => (
        <div style={{ width: '925px' }}>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => setModalDaftarSubledgerCustomer(false)}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => getFromModalSubledger_Customer()}
            />
        </div>
    );
    const footerTemplateSubledgerSupplier = () => (
        <div style={{ width: '325px' }}>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => setModalDaftarSubledgerSupplier(false)}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => getFromModalSubledgerSupplier()}
            />
        </div>
    );

    const footerTemplateSubledgerisY = () => (
        <div style={{ width: '395px' }}>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => setModalDaftarSubledgerIsLedgerY(false)}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => getFromModalSubledger_IsLedgerY()}
            />
        </div>
    );

    const footerTemplateMutasiBarang = () => (
        <div style={{ width: '775px' }}>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => setModalDaftarRefrensiMutasiBarang(false)}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', backgroundColor: '#3b3f5c', marginLeft: 20 }}
                onClick={() => getMutasiBarang()}
            />
        </div>
    );

    const templateKuantitas = (args: any) => {
        const value = args.qty === '' || args.qty === undefined || args.qty === null ? 0 : args.qty;
        const formattedValue = value < 0 ? `(${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })})` : value.toLocaleString('en-US', { minimumFractionDigits: 2 });
        return <span>{formattedValue}</span>;
    };

    return (
        <DialogComponent
            id="dialogPSList"
            isModal={true}
            width="93%"
            height={695}
            visible={isOpen}
            close={() => {
                dialogClose();
            }}
            // header={statusPage === 'CREATE' ? 'Penyesuaian Stok' : `Penyesuaian Stok (EDIT) : ${kodePS}`}
            header={statusPage === 'CREATE' ? 'Penyesuaian Stok' : `Penyesuaian Stok (EDIT)`}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            position={{ X: 'center', Y: 8 }}
            style={{ position: 'fixed' }}
        >
            <div style={{ minWidth: '70%', overflow: 'auto' }} id="targetModal">
                <div>
                    <div>
                        {/* ===============  Master Header Data ========================   */}
                        <div style={{ padding: 2 }}>
                            <div className="panel-tabel" style={{ width: '100%' }}>
                                <table className={styles.table} style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>Tanggal</th>
                                            <th style={{ width: '20%' }}>No. PS</th>
                                            <th style={{ width: '70%' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <>
                                                    {valueAppBackdate === true ? (
                                                        <Flatpickr
                                                            key="flatpickr" // Unique key for Flatpickr
                                                            value={date1.toDate()}
                                                            options={{
                                                                dateFormat: 'd-m-Y',
                                                            }}
                                                            className="form-input"
                                                            style={{ fontSize: '11px', width: '15vh', color: '#afadadee', border: 'none' }}
                                                            disabled={true}
                                                        />
                                                    ) : (
                                                        <DatePickerComponent
                                                            locale="id"
                                                            cssClass="e-custom-style"
                                                            placeholder="Tgl. PP"
                                                            showClearButton={false}
                                                            format="dd-MM-yyyy"
                                                            value={date1.toDate()}
                                                            change={(args: ChangeEventArgsCalendar) => {
                                                                if (args.value) {
                                                                    const selectedDate = moment(args.value);
                                                                    const hour = date1.hour() || moment().hour();
                                                                    const minute = date1.minute() || moment().minute();
                                                                    const second = date1.second() || moment().second();

                                                                    selectedDate.set({
                                                                        hour: hour,
                                                                        minute: minute,
                                                                        second: second,
                                                                    });
                                                                    setDate1(selectedDate);
                                                                } else {
                                                                    setDate1(moment());
                                                                }
                                                            }}
                                                        >
                                                            <Inject services={[MaskedDateTime]} />
                                                        </DatePickerComponent>
                                                    )}
                                                </>
                                            </td>
                                            <td>
                                                <TextBoxComponent placeholder="No. PS" value={mNoPS} readonly={true} />
                                            </td>
                                            <td rowSpan={3} onFocus={() => setFocusOnGridPsList(false)} onBlur={() => setFocusOnGridPsList(true)}>
                                                <TextBoxComponent
                                                    ref={(t) => {
                                                        textareaObj = t;
                                                    }}
                                                    multiline={true}
                                                    created={onCreateMultiline}
                                                    value={catatanValue}
                                                    input={(args: FocusInEventArgs) => {
                                                        console.log('ARGS :', args);

                                                        const value: any = args.value;
                                                        HandelCatatan(value, setCatatanValue);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr className={styles.table}>
                                            <th colSpan={2}>Gudang</th>
                                        </tr>
                                        <tr>
                                            <td style={{ textAlign: 'center' }} colSpan={2}>
                                                {selectedNamaGudang ? (
                                                    <DropDownListComponent
                                                        id="dropdown"
                                                        dataSource={listGudangforDetail.map((gudang: any) => gudang.nama_gudang)}
                                                        value={selectedNamaGudang}
                                                        placeholder="Pilih Gudang"
                                                        change={handleGudangChange}
                                                    />
                                                ) : null}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* ===============  Detail Data ========================   */}

                        <div className="panel-tab" style={{ background: '#f0f0f0', width: '100%', height: '370px', marginTop: 10, borderRadius: 10 }}>
                            <div className="mt-1 flex">
                                <label style={{ color: 'red' }}>
                                    <input className="form-checkbox ml-2 text-danger" type="checkbox" checked={penyesuaianNilai} onChange={handleCheckboxChangeAdjValue} />
                                    <text>Penyesuaian Nilai</text>
                                </label>
                                <label style={{ color: 'red' }}>
                                    <input className="form-checkbox ml-2 text-danger" type="checkbox" checked={manualPembebanan} onChange={handleCheckboxChangePembebanan} />
                                    <text>Manual Pembebanan</text>
                                </label>
                            </div>
                            <TabComponent ref={(t: any) => (tabPSList = t)} selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                <div className="e-tab-header" style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => setTabSelected('dataBarangTab')}
                                        tabIndex={0}
                                        style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Data Barang
                                    </div>
                                    <div
                                        onClick={() => setTabSelected('jurnalTab')}
                                        tabIndex={1}
                                        style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Jurnal
                                    </div>
                                </div>

                                {/*===================== Content menampilkan data barang =======================*/}
                                <div className="e-content">
                                    {/* //DATA BARANG */}
                                    <div tabIndex={0} className="h-full w-full p-3">
                                        <GridBarang
                                            setTotalNilaiPersediaan={setTotalNilaiPersediaan}
                                            totalNilaiPersediaan={totalNilaiPersediaan}
                                            listDaftarRefrensiMutasiBarang={listDaftarRefrensiMutasiBarang}
                                            manualPembebanan={manualPembebanan}
                                            selectedKodeGudang={selectedKodeGudang}
                                            kode_entitas={kode_entitas}
                                            penyesuaianNilai={penyesuaianNilai}
                                            listDaftarBarang={listDaftarBarang}
                                            userId={userid}
                                            barangState={[]}
                                            gridPsList={gridPSList}
                                            dsJenisVendor={[
                                                { nama_jenis_supp: 'test 1', kode_jenis: '123' },
                                                { nama_jenis_supp: 'test 1', kode_jenis: '123' },
                                            ]}
                                            onEditItem={false}
                                            selectedNamaGudang={selectedNamaGudang}
                                            gridDaftarRefrensiMutasiBarang={gridDaftarRefrensiMutasiBarang}
                                            searchNoItem={searchNoItem}
                                            setSearchNamaItem={setSearchNamaItem}
                                            searchNamaItem={searchNamaItem}
                                            setSearchNoItem={setSearchNoItem}
                                            kodeItemSelected={kodeItemSelected}
                                            setKodeItemSelected={setKodeItemSelected}
                                        />
                                    </div>

                                    {/* //JURNAL */}
                                    <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <ButtonComponent
                                            id="autojurnal"
                                            content="AutoJurnal"
                                            cssClass="e-primary e-small"
                                            iconCss="e-icons e-small e-refresh"
                                            style={{ float: 'right', width: '110px', marginTop: -40, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                            onClick={() => {
                                                autoJurnal();
                                            }}
                                        />

                                        <TooltipComponent openDelay={1000} target=".e-headertext">
                                            <GridComponent
                                                id="gridJURNALList"
                                                name="gridJURNALList"
                                                className="gridJURNALList"
                                                locale="id"
                                                ref={(j: any) => (gridJURNALList = j)}
                                                editSettings={{ allowEditing: true, newRowPosition: 'Bottom' }}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowResizing={true}
                                                autoFit={true}
                                                rowHeight={22}
                                                height={130}
                                                gridLines={'Both'}
                                                actionBegin={actionBeginDetailJurnal}
                                                actionComplete={actionCompleteDetailJurnal}
                                                rowSelecting={rowSelectingDetailJurnal}
                                                created={() => {}}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective field="id_dokumen" type="number" isPrimaryKey={true} headerText="ID" headerTextAlign="Center" textAlign="Center" width="30" />
                                                    <ColumnDirective
                                                        field="no_akun"
                                                        headerText="No. Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateMaster_No_Akun}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_akun"
                                                        headerText="Nama Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="200"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateMaster_Nama_Akun}
                                                    />
                                                    <ColumnDirective
                                                        field="debet_rp"
                                                        headerText="Debet"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="120"
                                                        clipMode="EllipsisWithTooltip"
                                                        template={(props: any) => {
                                                            return <span>{props.debet_rp ? parseFloat(props.debet_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                        }}
                                                    />
                                                    <ColumnDirective
                                                        field="kredit_rp"
                                                        headerText="Kredit"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="120"
                                                        clipMode="EllipsisWithTooltip"
                                                        template={(props: any) => {
                                                            return <span>{props.kredit_rp ? parseFloat(props.kredit_rp).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                        }}
                                                    />
                                                    <ColumnDirective field="catatan" headerText="Keterangan" headerTextAlign="Center" textAlign="Center" width="190" clipMode="EllipsisWithTooltip" />
                                                    <ColumnDirective
                                                        field="nama_relasi"
                                                        headerText="Subsidiary Ledger"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateMaster_Subledger}
                                                    />
                                                    <ColumnDirective
                                                        field="department"
                                                        headerText="Departemen"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateDepartemen}
                                                        template={(props: any) => {
                                                            const departmentValue = props.department === 'undefined-undefined' ? '' : props.department;
                                                            return <span>{departmentValue}</span>;
                                                        }}
                                                    />
                                                    <ColumnDirective
                                                        field="kode_jual"
                                                        headerText="Divisi Penjualan"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateKodeJual}
                                                    />
                                                </ColumnsDirective>

                                                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                            </GridComponent>
                                        </TooltipComponent>

                                        <div style={{ paddingTop: 5 }}>
                                            <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd2">
                                                <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit2">
                                                    <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete2">
                                                        <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                            <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                    <div className="mt-1 flex">
                                                                        <ButtonComponent
                                                                            id="buDeleteAll2"
                                                                            type="button"
                                                                            cssClass="e-danger e-small"
                                                                            iconCss="e-icons e-small e-erase"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                            onClick={() => {
                                                                                DetailBarangDeleteAllJurnal();
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    <div style={{ float: 'right', marginTop: -33 }}>
                                                                        <div style={{ marginBottom: '10px' }}>
                                                                            <div style={{ display: 'inline-block', marginRight: '10px', fontSize: '11px' }}>
                                                                                <b>Total Db/Kr :</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px', marginRight: '10px' }}>
                                                                                <b>{frmNumber(totalDebit)}</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px' }}>
                                                                                <b>{frmNumber(totalKredit)}</b>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <div style={{ display: 'inline-block', marginRight: '10px', fontSize: '11px' }}>
                                                                                <b>Selisih :</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px' }}>
                                                                                <b>{frmNumber(totalDebit - totalKredit)}</b>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </div>
                                    </div>
                                    {/* END JURNAL */}
                                </div>
                            </TabComponent>
                        </div>
                    </div>
                </div>
                {/* =================  Tombol action dokumen ==================== */}

                <div
                    style={{
                        backgroundColor: '#F2FDF8',
                        // position: 'absolute',
                        // bottom: 0,
                        // right: 0,
                        borderBottomLeftRadius: '6px',
                        borderBottomRightRadius: '6px',
                        width: '100%',
                        // height: '55px',
                        display: 'inline-block',
                        overflowX: 'scroll',
                        overflowY: 'hidden',
                        scrollbarWidth: 'none',
                    }}
                >
                    <ButtonComponent
                        id="buBatalDokumen1"
                        content="Batal"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-close"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={dialogClose}
                    />

                    <ButtonComponent
                        id="buSimpanDokumen1"
                        content="Simpan"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-save"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={() => validate()}
                    />
                </div>

                {/* MODAL DAFTAR BARANG */}
                <DialogComponent
                    ref={(d: any) => (gridDaftarBarang = d)}
                    target="#dialogPSList"
                    style={{ position: 'fixed' }}
                    header={'Daftar Barang'}
                    footerTemplate={footerTemplateBarang}
                    visible={modalDaftarBarang}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="420"
                    close={() => {
                        setModalDaftarBarang(false);
                        setSearchNoItem('');
                        setSearchNamaItem('');
                    }}
                    closeOnEscape={true}
                >
                    <div className="flex">
                        <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                            <TextBoxComponent
                                id="searchNoItem1"
                                name="searchNoItem1"
                                className="searchNoItem1"
                                placeholder="<No. Akun>"
                                showClearButton={true}
                                value={searchNoItem}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNamaItem1')[0] as HTMLFormElement).value = '';
                                    setSearchNamaItem('');
                                    const value: any = args.value;
                                    setSearchNoItem(value);
                                }}
                            />
                        </div>
                        <div className="form-input mb-1 mr-1">
                            <TextBoxComponent
                                id="searchNamaItem1"
                                name="searchNamaItem1"
                                className="searchNamaItem1"
                                placeholder="<Nama Akun>"
                                showClearButton={true}
                                value={searchNamaItem}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNoItem1')[0] as HTMLFormElement).value = '';
                                    setSearchNoItem('');
                                    const value: any = args.value;
                                    setSearchNamaItem(value);
                                }}
                            />
                        </div>
                    </div>
                    <GridComponent
                        locale="id"
                        style={{ width: '100%', height: '94%' }}
                        dataSource={listDaftarBarang}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        rowHeight={22}
                        height={'328'}
                        rowSelecting={(args: any) => {
                            setSelectedBarang(args.data);
                        }}
                        recordDoubleClick={(args: any) => {
                            getFromModalBarang();
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field="no_item" headerText="No. Barang" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="nama_item" headerText="Nama Barang" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Selection]} />
                    </GridComponent>
                </DialogComponent>
                {/* END MODAL DAFTAR BARANG */}

                {/* MODAL LIST AKUN JURNAL */}
                <DialogComponent
                    ref={(d: any) => (gridDaftarAkun = d)}
                    target="#dialogPSList"
                    style={{ position: 'fixed' }}
                    header={'Daftar Akun'}
                    footerTemplate={footerTemplateJurnal}
                    visible={modalDaftarAkun}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="420"
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
                        setFilteredData(listDaftarAkun);
                    }}
                    closeOnEscape={true}
                >
                    <div className="flex">
                        <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
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
                        <div className="form-input mb-1 mr-1">
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
                    </div>
                    <GridComponent
                        id="dialogJurnalHeaderList"
                        locale="id"
                        style={{ width: '100%', height: '100%' }}
                        dataSource={searchNoAkunJurnal !== '' || searchNamaAkunJurnal !== '' ? filteredData : listDaftarAkun}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        rowHeight={22}
                        height={'328'}
                        rowSelecting={(args: any) => {
                            setSelectedJurnal(args.data);
                        }}
                        recordDoubleClick={(args: any) => {
                            getFromModalAkun();
                        }}
                        allowPaging={true}
                        allowSorting={true}
                        pageSettings={{
                            pageSize: 15,
                            // pageCount: 10,
                            // pageSizes: ['10', '50', '100', 'All']
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective
                                field="no_akun"
                                template={gridIndukHeaderJurnal}
                                headerText="Kode Akun"
                                headerTextAlign="Center"
                                textAlign="Left"
                                width="95"
                                clipMode="EllipsisWithTooltip"
                            />
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
                {/* END MODAL LIST AKUN JURNAL */}

                {/* MODAL LIST SUBLEDGER CUSTOMER */}
                <DialogComponent
                    ref={(d: any) => (gridDaftarSubledgerCustomer = d)}
                    footerTemplate={footerTemplateSubledgerCustomer}
                    target="#dialogPSList"
                    style={{ position: 'fixed' }}
                    header={'Daftar Customer'}
                    visible={modalDaftarSubledgerCustomer}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="950"
                    position={{ X: 'center', Y: 'center' }}
                    close={() => {
                        setSearchNoCust('');
                        setSearchnamaCustPusat('');
                        setSearchNamaSalesman('');
                        setFilteredDataCustomer(listDaftarSubledgerCustomer);
                        const cariNoCust = document.getElementById('cariNoCust') as HTMLInputElement;
                        if (cariNoCust) {
                            cariNoCust.value = '';
                        }

                        const carinamaCustPusat = document.getElementById('carinamaCustPusat') as HTMLInputElement;
                        if (carinamaCustPusat) {
                            carinamaCustPusat.value = '';
                        }

                        const cariNamaSalesman = document.getElementById('cariNamaSalesman') as HTMLInputElement;
                        if (cariNamaSalesman) {
                            cariNamaSalesman.value = '';
                        }
                        setModalDaftarSubledgerCustomer(false);
                    }}
                    closeOnEscape={true}
                >
                    <div className="mb-2 mt-1 flex gap-2">
                        <div className="form-input ">
                            <TextBoxComponent
                                id="cariNoCust"
                                className="searchtext"
                                placeholder="Cari No Customer"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value = args.value;
                                    PencarianCustomer(value, setSearchNoCust, setFilteredDataCustomer, listDaftarSubledgerCustomer, 'no_cust');
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                        <div className="form-input ">
                            <TextBoxComponent
                                id="carinamaCustPusat"
                                className="searchtext"
                                placeholder="Cari Nama Relasi"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value = args.value;
                                    PencarianCustomer(value, setSearchnamaCustPusat, setFilteredDataCustomer, listDaftarSubledgerCustomer, 'nama_relasi');
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                        <div className="form-input ">
                            <TextBoxComponent
                                id="cariNamaSalesman"
                                className="searchtext"
                                placeholder="Cari Nama Salesman"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value = args.value;
                                    PencarianCustomer(value, setSearchNamaSalesman, setFilteredDataCustomer, listDaftarSubledgerCustomer, 'nama_salesman');
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                    </div>

                    <GridComponent
                        locale="id"
                        style={{ width: '100%', height: '95%' }}
                        // dataSource={listDaftarSubledgerCustomer}
                        dataSource={searchNoCust !== '' || searchnamaCustPusat !== '' || searchNamaSalesman !== '' ? filteredDataCustomer : listDaftarSubledgerCustomer}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        rowHeight={22}
                        height={'300'}
                        rowSelecting={(args: any) => {
                            setSelectedSubledgerCustomer(args.data);
                        }}
                        recordDoubleClick={(args: any) => {
                            getFromModalSubledger_Customer();
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field="no_cust" headerText="Kode no_cust" headerTextAlign="Center" textAlign="Center" width="65" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="nama_relasi" headerText="Nama Akun" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="status_warna" headerText="Info Detail" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Selection]} />
                    </GridComponent>
                </DialogComponent>
                {/* END MODAL LIST SUBLEDGER CUSTOMER */}

                {/* MODAL LIST SUBLEDGER DARI TABLE SUBLEDGER (ISLEDGER = Y) */}
                <DialogComponent
                    ref={(d: any) => (gridDaftarSubledgerIsLedgerY = d)}
                    target="#dialogPSList"
                    footerTemplate={footerTemplateSubledgerisY}
                    style={{ position: 'fixed' }}
                    header={'Daftar Subledger'}
                    visible={modalDaftarSubledgerIsLedgerY}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="420"
                    position={{ X: 'center', Y: 'center' }}
                    close={() => {
                        setModalDaftarSubledgerIsLedgerY(false);
                        setSearchNoIsLedgerY('');
                        setSearchNamaIsLedgerY('');

                        const cariNoIsLedgerY = document.getElementById('cariNoIsLedgerY') as HTMLInputElement;
                        if (cariNoIsLedgerY) {
                            cariNoIsLedgerY.value = '';
                        }

                        const cariNamaIsLedgerY = document.getElementById('cariNamaIsLedgerY') as HTMLInputElement;
                        if (cariNamaIsLedgerY) {
                            cariNamaIsLedgerY.value = '';
                        }
                    }}
                    closeOnEscape={true}
                >
                    <div className="flex">
                        <div className="form-input mb-1 mr-1" style={{ width: '45%' }}>
                            <TextBoxComponent
                                id="cariNoIsLedgerY"
                                className="searchtext"
                                placeholder="Cari No. Subledger"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value: any = args.value;
                                    PencarianNoakunIsLedgerY(value, setSearchNoIsLedgerY, setFilteredDataIsLedgerY, listDaftarSubledgerIsLedgerY);
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                        <div className="form-input mb-1 mr-1">
                            <TextBoxComponent
                                id="cariNamaIsLedgerY"
                                className="searchtext"
                                placeholder="Cari Keterangan"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value: any = args.value;
                                    PencarianNamaakunIsLedgerY(value, setSearchNamaIsLedgerY, setFilteredDataIsLedgerY, listDaftarSubledgerIsLedgerY);
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                    </div>
                    <GridComponent
                        locale="idIsLedgerY"
                        style={{ width: '100%', height: '100%' }}
                        dataSource={searchNoIsLedgerY !== '' || searchNamaIsLedgerY !== '' ? filteredDataIsLedgerY : listDaftarSubledgerIsLedgerY}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        rowHeight={22}
                        height={'300'}
                        rowSelecting={(args: any) => {
                            setSelectedSubledgerIsLedgerY(args.data);
                        }}
                        recordDoubleClick={(args: any) => {
                            getFromModalSubledger_IsLedgerY();
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field="no_subledger" headerText="No Subledger" headerTextAlign="Center" textAlign="Center" width="65" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="nama_subledger" headerText="keterangan" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Selection]} />
                    </GridComponent>
                </DialogComponent>
                {/* END MODAL LIST SUBLEDGER DARI TABLE SUBLEDGER (ISLEDGER = Y) */}

                {/* MODAL LIST SUBLEDGER SUPPLIER */}
                <DialogComponent
                    ref={(d: any) => (gridDaftarSubledgerSupplier = d)}
                    footerTemplate={footerTemplateSubledgerSupplier}
                    target="#dialogPSList"
                    style={{ position: 'fixed' }}
                    header={'Daftar Supplier'}
                    visible={modalDaftarSubledgerSupplier}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="350"
                    position={{ X: 'center', Y: 'center' }}
                    close={() => {
                        setModalDaftarSubledgerSupplier(false);
                        setSearchNoSubledgerSupplier('');
                        setSearchNamaSubledgerSupplier('');

                        const cariNoSubledgerSupplier = document.getElementById('cariNoSubledgerSupplier') as HTMLInputElement;
                        if (cariNoSubledgerSupplier) {
                            cariNoSubledgerSupplier.value = '';
                        }

                        const cariNamaSubledgerSupplier = document.getElementById('cariNamaSubledgerSupplier') as HTMLInputElement;
                        if (cariNamaSubledgerSupplier) {
                            cariNamaSubledgerSupplier.value = '';
                        }
                    }}
                    closeOnEscape={true}
                >
                    <div className="flex">
                        <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                            <TextBoxComponent
                                id="cariNoSubledgerSupplier"
                                className="searchtext"
                                placeholder="Cari No. Supplier"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value: any = args.value;
                                    PencarianNoSubledgerSupplier(value, setSearchNoSubledgerSupplier, setFilteredDataSubledgerSupplier, listDaftarSubledgerSupplier);
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                        <div className="form-input mb-1 mr-1">
                            <TextBoxComponent
                                id="cariNamaIsLedgerY"
                                className="searchtext"
                                placeholder="Cari Nama Supplier"
                                showClearButton={true}
                                input={(args: ChangeEventArgsInput) => {
                                    const value: any = args.value;
                                    PencarianNamaSubledgerSupplier(value, setSearchNamaSubledgerSupplier, setFilteredDataSubledgerSupplier, listDaftarSubledgerSupplier);
                                }}
                                floatLabelType="Never"
                            />
                        </div>
                    </div>
                    <GridComponent
                        locale="idIsLedgerY"
                        style={{ width: '100%', height: '95%' }}
                        dataSource={searchNoSubledgerSupplier !== '' || searchNamaSubledgerSupplier !== '' ? filteredDataSubledgerSupplier : listDaftarSubledgerSupplier}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        rowHeight={22}
                        height={'300'}
                        rowSelecting={(args: any) => {
                            setSelectedSubledgerSupplier(args.data);
                        }}
                        recordDoubleClick={(args: any) => {
                            getFromModalSubledgerSupplier();
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field="no_supp" headerText="No Supplier" headerTextAlign="Center" textAlign="Left" width="65" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" width="35" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="nama_relasi" headerText="keterangan" headerTextAlign="Left" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Selection]} />
                    </GridComponent>
                </DialogComponent>
                {/* END MODAL LIST SUBLEDGER SUPPLIER */}

                {/* MODAL LIST MUTASI BARANG */}
                <DialogComponent
                    ref={(d: any) => (gridDaftarRefrensiMutasiBarang = d)}
                    target="#dialogPSList"
                    footerTemplate={footerTemplateMutasiBarang}
                    style={{ position: 'fixed' }}
                    header={`Daftar MB(IN) : ${selectedNamaGudang}`}
                    visible={modalDaftarRefrensiMutasiBarang}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    allowDragging={true}
                    showCloseIcon={true}
                    width="800"
                    position={{ X: 'center', Y: 'center' }}
                    close={() => {
                        setModalDaftarRefrensiMutasiBarang(false);
                    }}
                    closeOnEscape={true}
                >
                    <div className="flex">
                        <div className="form-input mb-1 mr-1" style={{ width: '40%' }}></div>
                    </div>
                    <GridComponent
                        locale="daftarMutasiBarang"
                        style={{ width: '100%', height: '95%' }}
                        dataSource={listDaftarRefrensiMutasiBarang}
                        selectionSettings={{ mode: 'Row', type: 'Single' }}
                        rowHeight={22}
                        height={'300'}
                        rowSelecting={(args: any) => {
                            setSelectedMutasiBarang(args.data);
                        }}
                        recordDoubleClick={(args: any) => {
                            getMutasiBarang();
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field="kustom2" headerText="No MB" headerTextAlign="Center" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="kustom3" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="70" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="diskon" headerText="No Kendaraan" headerTextAlign="Left" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="no_item" headerText="No Barang" headerTextAlign="Left" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="nama_item" headerText="Nama Barang" headerTextAlign="Left" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
                            <ColumnDirective field="min_qty" headerText="OTD" headerTextAlign="Left" textAlign="Left" width="40" clipMode="EllipsisWithTooltip" />
                        </ColumnsDirective>
                        <Inject services={[Selection]} />
                    </GridComponent>
                </DialogComponent>
                {/* END MODAL LIST MUTASI BARANG */}
            </div>
        </DialogComponent>
    );
};

export default React.memo(DialogPSList);
