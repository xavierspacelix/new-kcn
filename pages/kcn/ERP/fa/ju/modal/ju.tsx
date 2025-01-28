import React, { useId } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import styles from './justyle.module.css';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent, SelectedEventArgs, FileInfo } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { formatNumber, frmNumber, generateNU, FillFromSQL, FirstDayInPeriod, tanpaKoma, fetchPreferensi, overQTYAll, entitaspajak } from '@/utils/routines';
import { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import axios from 'axios';
import stylesTtb from '../julist.module.css';
import { Internationalization, loadCldr, L10n, enableRipple, getValue, Browser } from '@syncfusion/ej2-base';
import idIDLocalization from 'public/syncfusion/locale.json';
import Swal from 'sweetalert2';
import { resWord, resExcel, resZip, resUnknow, resPdf } from './resource';
import Image from 'next/image';
L10n.load(idIDLocalization);
import JSZip from 'jszip';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';
interface dialogJurnalUmum {
    userid: string;
    kode_entitas: any;
    isOpen: boolean;
    onClose: () => void;
    kode_user: any;
    status_edit: boolean;
    kode_ju_edit: any;
    onRefresh: () => void;
    token: any;
    plag: any;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
let gridDataJurnal: Grid | any;
let gridAkunJurnalList: Grid | any;
let gridAkunSubledgerList: Grid | any;
let gridListKry: Grid | any;
let gridListUangMuka: Grid | any;
let gridSupplierList: Grid | any;
let gridDepartmentList: Grid | any;
let gridCustList: Grid | any;
let statusNolJurnal: string;

const ModalJurnalUmum: React.FC<dialogJurnalUmum> = ({ userid, kode_entitas, isOpen, onClose, kode_user, status_edit, kode_ju_edit, onRefresh, token, plag }) => {
    const [listDepartemen, setListDepartemen] = useState([]);
    const [listKodeJual, setListKodeJual] = useState([]);
    const [searchNoAkun, setSearchNoAkun] = useState('');
    const [searchNamaAkun, setSearchNamaAkun] = useState('');
    const [searchNoSupp, setSearchNoSupp] = useState('');
    const [searchNamaSupp, setSearchNamaSupp] = useState('');
    const [searchNoCust, setSearchNoCust] = useState('');
    const [searchNamaCust, setSearchNamaCust] = useState('');
    const [searchNamaSales, setSearchNamaSales] = useState('');
    const [searchNoAkunSubledger, setSearchNoAkunSubledger] = useState('');
    const [searchNamaSubledger, setSearchNamaSubledger] = useState('');
    const [searchNamaKaryawan, setSearchNamaKaryawan] = useState('');
    const [selectedBarang, setSelectedBarang] = useState<any>('');
    const [selectedTab, setSelectedTab] = useState<any>('Jurnal');
    const [indexDataJurnal, setIndexDataJurnal] = useState(0);
    const [modalAkunJurnal, setModalAkunJurnal] = useState(false);
    const [modalAkunSubledger, setModalAkunSubledger] = useState(false);
    const [modalListKaryawan, setModalListKaryawan] = useState(false);
    const [modalListUangMuka, setModalListUangMuka] = useState(false);
    const [modalSupplierRow, setModalSupplierRow] = useState(false);
    const [modalCustRow, setModalCustRow] = useState(false);
    const [modalListDepartment, setModalListDepartment] = useState(false);
    const [filteredDataDepartment, setFilteredDataDepartment] = useState([]);
    const [searchNamaDepartment, setSearchNamaDepartment] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<any>('');
    let tryAgain = useRef(1);

    //HEADER
    const [NoJU, setNoJU] = useState('');
    const [keterangan, setKeterangan] = useState<any>('');
    const [selectedCust, setSelectedCust] = useState<any>('');
    const [selectedSupplier, setSelectedSupplier] = useState<any>('');
    const [selectedAkunJurnal, setSelectedAkunJurnal] = useState<any>('');
    const [selectedAkunSubledger, setSelectedAkunSubledger] = useState<any>('');
    const [selectedNamaKry, setSelectedNamaKry] = useState<any>('');
    const [selectedNoKontrakUM, setSelectedNoKontrakUM] = useState<any>('');
    const [selectedHead, setSelectedHead] = useState('1');
    const [UpdateDetail, setUpdateDetail] = useState<any>(false);

    //EDIT
    const [kodeJU, setKodeJU] = useState<any>('');
    const [tglJU, setTgl_JU] = useState<any>(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [tglValuta, setTgl_Valuta] = useState<any>(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [tglTrx, setTgl_Trx] = useState<any>(moment().format('YYYY-MM-DD HH:mm:ss'));
    const [tglDokumen, setTglDokumen] = useState<any>(moment());

    const [totalDebit, setTotalDebit] = useState<any>(0);
    const [totalKredit, setTotalKredit] = useState<any>(0);

    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(false);
    const [jsonImageEdit, setJsonImageEdit] = useState([]);
    const [modalPreview, setModalPreview] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(0.5);
    const [isSaving, setIsSaving] = useState(false);

    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();

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
            target: '#dialogJUList',
        });
    };

    // DETAIL
    useEffect(() => {
        const Async = async () => {
            await FillFromSQL(kode_entitas, 'departemen')
                .then((result: any) => {
                    const modifiedData = result
                        .map((item: any) => ({
                            ...item,
                            dept_ku: item.no_dept_dept + ' - ' + item.nama_dept,
                            dept_ku2: item.kode_dept + '*' + item.nama_dept,
                        }))
                        .sort((a: any, b: any) => a.nama_dept.localeCompare(b.nama_dept));

                    setListDepartemen(modifiedData);
                    console.log(modifiedData);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            const kodeJual = await axios.get(`${apiUrl}/erp/kode_jual?`, {
                params: {
                    entitas: kode_entitas,
                },
            });
            console.log(kodeJual.data.data);
            setListKodeJual(kodeJual.data.data);

            //EDIT
            if (status_edit) {
                const listHeaderDetail = await axios.get(`${apiUrl}/erp/master_jurnal_umum?`, {
                    // master detail
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        entitas: kode_entitas,
                        param1: kode_ju_edit,
                    },
                });
                console.log('listHeaderDetail', listHeaderDetail);
                if (listHeaderDetail.data.status === true) {
                    const dataMasterEdit = listHeaderDetail.data.data.master[0];
                    const dataDetailEdit = listHeaderDetail.data.data.jurnal;
                    console.log(dataMasterEdit);
                    console.log(dataDetailEdit);
                    //HEADER
                    setNoJU(dataMasterEdit.no_dokumen);
                    setKeterangan(dataMasterEdit.catatan);
                    setTgl_JU(dataMasterEdit.tgl_trxdokumen === null ? dataMasterEdit.tgl_dokumen : dataMasterEdit.tgl_trxdokumen);
                    console.log(dataMasterEdit.tgl_dokumen);
                    setTgl_Valuta(dataMasterEdit.tgl_valuta);
                    setTgl_Trx(moment(dataMasterEdit.tgl_trxdokumen, 'YYYY-MM-DD HH:mm:ss'));
                    setKodeJU(kode_ju_edit);
                    setTglDokumen(moment(dataMasterEdit.tgl_dokumen, 'YYYY-MM-DD HH:mm:ss'));

                    const modifiedDetailJurnal = dataDetailEdit.map((item: any) => ({
                        ...item,
                        debet_rp: parseFloat(item.debet_rp),
                        kredit_rp: parseFloat(item.kredit_rp),
                        jumlah_rp: parseFloat(item.jumlah_rp),
                        jumlah_mu: parseFloat(item.jumlah_mu),
                        kurs: parseFloat(item.kurs),
                    }));
                    gridDataJurnal.dataSource = modifiedDetailJurnal;
                } else {
                    console.log('gagal');
                }

                //LOAD DAN EXTRACT saat posisi EDIT
                const loadtbImages = await axios.get(`${apiUrl}/erp/load_images`, {
                    params: {
                        entitas: kode_entitas,
                        param1: kode_ju_edit,
                    },
                });

                const result = loadtbImages.data.data;
                // console.log(result);
                setJsonImageEdit(result);
                const imagesMap = [null, null, null, null];

                if (result.length > 0) {
                    result.forEach((item: any) => {
                        imagesMap[item.id_dokumen - 1] = item.filegambar;
                    });
                }

                const zipData = result.find((item: any) => item.id_dokumen == '999');

                if (zipData) {
                    const loadImage = await axios.get(`${apiUrl}/erp/extrak_zip`, {
                        params: {
                            entitas: kode_entitas,
                            nama_zip: zipData.filegambar,
                        },
                    });

                    const images = loadImage.data.images;

                    const nameSetters = [setNameImage, setNameImage2, setNameImage3, setNameImage4];
                    const previewSetters = [setPreview, setPreview2, setPreview3, setPreview4];

                    imagesMap.forEach((filegambar, index) => {
                        if (filegambar) {
                            const fileUri = images.find((item: any) => item.fileName == filegambar);
                            if (fileUri) {
                                previewSetters[index](fileUri.imageUrl);
                                nameSetters[index](fileUri.fileName);
                            }
                        }
                    });
                } else {
                    console.error('Zip data not found');
                }
                //END
            } else {
                generateNU(kode_entitas, '', '20', moment().format('YYYYMM'))
                    .then((result) => {
                        console.log(result);
                        setNoJU(result);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        };
        Async();
    }, []);

    //AKUN JURNAL
    useEffect(() => {
        const fetchDataAkunJurnal = async () => {
            try {
                const responseAkunJurnal = await axios.get(`${apiUrl}/erp/akun_jurnal`, {
                    params: { entitas: kode_entitas },
                });

                const responseListAkun = responseAkunJurnal.data.data;
                console.log('diekse');
                console.log(responseListAkun);
                const lowerCaseSearchNoAkun = searchNoAkun.toLowerCase();
                const lowerCaseSearchNamaAkun = searchNamaAkun.toLowerCase();

                const finalFilteredListAkun = responseListAkun.filter(
                    (item: any) => item.no_akun.toLowerCase().includes(lowerCaseSearchNoAkun) && item.nama_akun.toLowerCase().includes(lowerCaseSearchNamaAkun)
                );

                const listToSet = searchNoAkun === '' && searchNamaAkun === '' ? responseListAkun : finalFilteredListAkun;

                gridAkunJurnalList.dataSource = listToSet;
            } catch (error) {
                console.log(error);
            }
        };
        if (modalAkunJurnal) {
            fetchDataAkunJurnal();
        }
    }, [apiUrl, kode_entitas, searchNoAkun, searchNamaAkun, modalAkunJurnal]);

    //AKUN SUBLEDGER
    useEffect(() => {
        const fetchAkunSubledger = async () => {
            try {
                if (gridDataJurnal.dataSource.length > 0) {
                    const responseAkunSubledger = await axios.get(`${apiUrl}/erp/list_subledger_by_kodeakun`, {
                        params: { entitas: kode_entitas, param1: gridDataJurnal.dataSource[indexDataJurnal].kode_akun },
                    });

                    const responseListAkunSubledger = responseAkunSubledger.data.data;
                    const lowerCaseSearchNoSubledger = searchNoAkunSubledger.toLowerCase();
                    const lowerCaseSearchNamaSubledger = searchNamaSubledger.toLowerCase();

                    const finalFilteredListAkun = responseListAkunSubledger.filter(
                        (item: any) => item.no_subledger.toLowerCase().includes(lowerCaseSearchNoSubledger) && item.nama_subledger.toLowerCase().includes(lowerCaseSearchNamaSubledger)
                    );

                    const listToSet = searchNoAkunSubledger === '' && searchNamaSubledger === '' ? responseListAkunSubledger : finalFilteredListAkun;

                    gridAkunSubledgerList.dataSource = listToSet;
                    console.log('diekse');
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (modalAkunSubledger) {
            fetchAkunSubledger();
        }
    }, [apiUrl, kode_entitas, searchNoAkunSubledger, searchNamaSubledger, modalAkunSubledger]);

    //LIST KARYAWAN
    useEffect(() => {
        const fetchSupplierDataKaryawan = async () => {
            try {
                const responseAkunJurnal = await axios.get(`${apiUrl}/erp/list_karyawan`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { entitas: kode_entitas },
                });

                const responseListKry = responseAkunJurnal.data.data;

                const lowerNamaKry = searchNamaKaryawan.toLowerCase();

                const finalFilteredListAkun = responseListKry.filter((item: any) => item.nama_kry.toLowerCase().includes(lowerNamaKry));

                const listToSet = searchNamaKaryawan === '' ? responseListKry : finalFilteredListAkun;

                gridListKry.dataSource = listToSet;
            } catch (error) {
                console.log(error);
            }
        };
        if (modalListKaryawan) {
            fetchSupplierDataKaryawan();
        }
    }, [apiUrl, kode_entitas, searchNamaKaryawan, modalListKaryawan]);

    //LIST NO KONTRAK UANG MUKA
    useEffect(() => {
        const fetchKontrakUangMukaList = async () => {
            try {
                if (gridDataJurnal.dataSource.length > 0) {
                    const responseAkunSubledger = await axios.get(`${apiUrl}/erp/list_no_kontrak_um`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: { entitas: kode_entitas, param1: gridDataJurnal.dataSource[indexDataJurnal].no_subledger },
                    });

                    console.log(gridDataJurnal.dataSource[indexDataJurnal].no_subledger);

                    const responseListAkunSubledger = responseAkunSubledger.data.data;
                    // console.log(responseListAkunSubledger);
                    const modifiedData = responseListAkunSubledger.map((item: any) => ({
                        ...item,
                        belum_dibayar_rp: parseFloat(item.belum_dibayar_rp),
                        sisa_rp: parseFloat(item.sisa_rp),
                    }));
                    gridListUangMuka.dataSource = modifiedData;
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchKontrakUangMukaList();
    }, [apiUrl, kode_entitas, modalListUangMuka]);

    // CUSTOMER
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const ListCustFilter = async (kode_entitas: string, param1: string, param2: string, param3: string) => {
                    const response = await axios.get(`${apiUrl}/erp/list_cust_so?`, {
                        params: {
                            entitas: kode_entitas,
                            param1: param1,
                            param2: param2,
                            param3: param3,
                        },
                    });
                    const result = response.data;
                    return result;
                };
                const response = await ListCustFilter(kode_entitas, searchNamaCust, searchNoCust, searchNamaSales);

                if (response.status) {
                    gridCustList.dataSource = response.data;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCustomerData();
    }, [searchNoCust, searchNamaCust, searchNamaSales]);

    const recordClickHandle = (args: any) => {
        if (args.rowData.header === 'Y') {
            setModalAkunJurnal(false);
            myAlert(`No. Akun ${args.rowData.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi.`);
        } else {
            const selectedItems = args.rowData;
            console.log(selectedItems);
            setSelectedAkunJurnal(selectedItems);
            setModalAkunJurnal(false);
            if (selectedItems.isledger === 'Y') {
                setModalAkunSubledger(true);
            } else if (selectedItems.tipe === 'Hutang') {
                setModalSupplierRow(true);
            } else if (selectedItems.tipe === 'Piutang') {
                setModalCustRow(true);
            } else if (selectedItems.tipe === 'Beban' || selectedItems.tipe === 'Beban Lain-Lain') {
                // setModalAkunSubledger(true);
                setModalListDepartment(true);
                // setModalListKaryawan(true);
            }
            const editedData = {
                ...gridDataJurnal.dataSource[indexDataJurnal],
                isledger: selectedItems.isledger,
                kode_akun: selectedItems.kode_akun,
                no_akun: selectedItems.no_akun,
                nama_akun: selectedItems.nama_akun,
                tipe: selectedItems.tipe,
                kode_subledger: null, // jika diganti dibuat kosong
                subledger: null,
                kode_kry: null,
                nama_kry: null,
                kode_dept: null,
                nama_dept: null,
                no_kontrak_um: null,
            };
            gridDataJurnal.dataSource[indexDataJurnal] = editedData;
            gridDataJurnal.refresh();
            setSearchNoAkun('');
            setSearchNamaAkun('');
        }
    };

    //SUPPLIER
    useEffect(() => {
        const fetchSupplierData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/erp/m_supplier`, {
                    params: { entitas: kode_entitas },
                });
                const responseListSupp = response.data.data;

                const lowerCaseSearchNoSupp = searchNoSupp.toLowerCase();
                const lowerCaseSearchNamaSupp = searchNamaSupp.toLowerCase();

                const filteredList = responseListSupp.filter(
                    (item: any) => item.no_supp.toLowerCase().includes(lowerCaseSearchNoSupp) && item.nama_relasi.toLowerCase().includes(lowerCaseSearchNamaSupp)
                );

                const finalFilteredList = searchNoSupp === '' && searchNamaSupp === '' ? responseListSupp : filteredList;

                gridSupplierList.dataSource = finalFilteredList;
            } catch (error) {
                console.log(error);
            }
        };

        fetchSupplierData();
    }, [apiUrl, kode_entitas, searchNoSupp, searchNamaSupp]);

    const dialogClose = () => {
        onClose();
    };

    const handleDetail_Add = async (jenis: any) => {
        // await handleDetail_EndEdit();
        // gridDataJurnal.endEdit();
        // gridDataJurnal.startEdit();
        const totalLine = gridDataJurnal.dataSource.length;
        const isNoBarangNotEmpty = gridDataJurnal.dataSource.every((item: any) => item.no_akun !== '');
        const isDBKRNotEmpty = gridDataJurnal.dataSource.every((item: any) => item.debet_rp !== 0 || item.kredit_rp !== 0);
        console.log(gridDataJurnal.dataSource);

        if (jenis === 'selected') {
            // buat blocking saat menambah barang dari modal
            console.log('nothing');
        } else if ((totalLine === 0 && jenis === 'new') || (isNoBarangNotEmpty && jenis === 'new' && isDBKRNotEmpty)) {
            // if (selectedGudang && selectedGudang2) {
            // console.log('A', gridDataJurnal.dataSource);
            let debet = 0;
            let kredit = 0;

            if (totalLine > 0) {
                const index = gridDataJurnal.dataSource.length - 1;
                if (totalDebit === totalKredit) {
                    debet = 0;
                    kredit = 0;
                } else if (gridDataJurnal.dataSource[index].debet_rp > 0) {
                    if (totalDebit > totalKredit) {
                        kredit = totalDebit - totalKredit;
                    } else {
                        debet = totalKredit - totalDebit;
                    }
                    // debet = 0;
                } else if (gridDataJurnal.dataSource[index].kredit_rp > 0) {
                    if (totalKredit > totalDebit) {
                        debet = totalKredit - totalDebit;
                    } else {
                        kredit = totalDebit - totalKredit;
                    }
                    // kredit = 0;
                }
            }

            const detailBarangBaru = {
                kode_dokumen: status_edit ? kodeJU : '',
                id_dokumen: totalLine + 1,
                dokumen: 'JU',
                tgl_dokumen: moment(tglDokumen).format('YYYY-MM-DD HH:mm:ss'),
                kode_akun: '',
                no_akun: '',
                nama_akun: '',
                tipe: '',
                kode_subledger: null,
                subledger: '',
                no_subledger: '',
                kurs: 1.0,
                debet_rp: debet,
                kredit_rp: kredit,
                jumlah_rp: 0,
                jumlah_mu: 0,
                // catatan: totalLine === 0 ? keterangan : '',
                catatan: keterangan,
                no_warkat: null,
                tgl_valuta: null,
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
                no_kontrak_um: null,
                kode_mu: 'IDR',
                nama_dept: '',
                nama_kry: '',
            };
            gridDataJurnal.addRecord(detailBarangBaru, totalLine);
            // setTimeout(() => {
            //   gridDataJurnal.startEdit(totalLine);
            // }, 200);
            setTambah(true);
        } else {
            document.getElementById('gridDataJurnal')?.focus();
            myAlert(`Silahkan melengkapi data barang sebelum menambah data baru.`);
        }
    };

    const handleDetail_EndEdit = async () => {
        gridDataJurnal.endEdit();
    };

    const handlePilihDepartment = async () => {
        const updateDepartment = {
            kode_dept: selectedDepartment.kode_dept,
            nama_dept: selectedDepartment.nama_dept,
        };

        if (selectedRowIndex >= 0 && selectedRowIndex < gridDataJurnal.dataSource.length) {
            gridDataJurnal.dataSource[selectedRowIndex] = {
                ...gridDataJurnal.dataSource[selectedRowIndex],
                ...updateDepartment,
            };
            setTambah(true);

            gridDataJurnal.refresh();
        } else {
            console.error('Invalid selectedRowIndex:', selectedRowIndex);
        }

        setModalListDepartment(false);
        setModalListKaryawan(true);
    };

    const PencarianNamaDepartment = async (event: string, setSearchNamaDepartment: Function, setFilteredDataDepartment: Function, listDepartment: any[]) => {
        const searchValue = event;
        setSearchNamaDepartment(searchValue);
        const filteredData = SearchDataNamaDepartment(searchValue, listDepartment);
        setFilteredDataDepartment(filteredData);
    };

    const SearchDataNamaDepartment = (keyword: any, listDepartemen: any[]) => {
        if (keyword === '') {
            return listDepartemen;
        } else {
            const filteredData = listDepartemen.filter((item) => item.nama_dept.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const rowSelectingDetailBarang = (args: any) => {
        setSelectedRowIndex(args.rowIndex);
        console.log(args.rowIndex);
    };

    const actionBeginDetailJurnal = async (args: any) => {
        console.log(args.requestType);
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
                if (tambah === false) {
                    let editedData;
                    console.log(statusNolJurnal);
                    if (statusNolJurnal === 'Debit' && gridDataJurnal.dataSource[args.rowIndex].debet_rp !== 0) {
                        editedData = { ...args.data, kredit_rp: 0 };
                        gridDataJurnal.dataSource[args.rowIndex] = editedData;
                    } else if (statusNolJurnal === 'Kredit' && gridDataJurnal.dataSource[args.rowIndex].kredit_rp !== 0) {
                        editedData = { ...args.data, debet_rp: 0 };
                        gridDataJurnal.dataSource[args.rowIndex] = editedData;
                    }
                    kalkulasiJurnal();
                    gridDataJurnal.refresh();
                    setUpdateDetail(true);
                } else if (edit) {
                    console.log('SINI');
                    // KALKULASI 2
                    kalkulasiJurnal();
                    gridDataJurnal.refresh();
                    setUpdateDetail(true);
                }
                break;
            case 'beginEdit':
                console.log('EDIT');
                setTambah(false);
                setEdit(true);
                kalkulasiJurnal();
                break;
            case 'delete':
                gridDataJurnal.dataSource.forEach((item: any, index: any) => {
                    item.id_dokumen = index + 1;
                });
                gridDataJurnal.refresh();
                break;
            case 'refresh':
                console.log(gridDataJurnal.dataSource.length);
                kalkulasiJurnal();
                console.log('REFRESH');
                setTambah(false);
                setEdit(false);
                break;
            default:
                break;
        }
        console.log('COMPLETED :' + args.requestType);
    };

    const totalDebetRef = useRef(0);
    const totalKreditRef = useRef(0);

    const kalkulasiJurnal = () => {
        console.log('diekse', gridDataJurnal.dataSource);
        Promise.all(
            gridDataJurnal.dataSource.map(async (item: any) => {
                if (item.debet_rp === 0) {
                    item.jumlah_mu = (item.debet_rp + item.kredit_rp) * -1;
                    item.jumlah_rp = (item.debet_rp + item.kredit_rp) * -1;
                } else if (item.kredit_rp === 0) {
                    item.jumlah_mu = item.debet_rp + item.kredit_rp;
                    item.jumlah_rp = item.debet_rp + item.kredit_rp;
                }
            })
        ).then(() => {
            const totalDebit = gridDataJurnal.dataSource.reduce((total: any, item: any) => {
                return total + item.debet_rp;
            }, 0);
            const totalKredit = gridDataJurnal.dataSource.reduce((total: any, item: any) => {
                return total + item.kredit_rp;
            }, 0);
            totalDebetRef.current = totalDebit;
            totalKreditRef.current = totalKredit;
            setTotalDebit(totalDebit);
            setTotalKredit(totalKredit);
        });
    };

    const DetailBarangDelete = () => {
        if (gridDataJurnal.dataSource.length > 0) {
            withReactContent(Swal)
                .fire({
                    html: `Hapus data baris ${selectedRowIndex + 1}?`,
                    width: '15%',
                    target: '#dialogJUList',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        console.log(selectedRowIndex);
                        gridDataJurnal.dataSource.splice(selectedRowIndex, 1);
                        gridDataJurnal.dataSource.forEach((item: any, index: any) => {
                            item.id_dokumen = index + 1;
                        });
                        gridDataJurnal.refresh();
                    } else {
                        console.log('cancel');
                    }
                });
        }
    };

    const DetailBarangDeleteAll = () => {
        if (gridDataJurnal.dataSource.length > 0) {
            withReactContent(Swal)
                .fire({
                    html: 'Hapus semua data?',
                    width: '15%',
                    target: '#dialogJUList',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        gridDataJurnal.dataSource.splice(0, gridDataJurnal.dataSource.length);
                        gridDataJurnal.refresh();
                    } else {
                        console.log('cancel');
                    }
                });
        }
    };

    //KEYBOARD
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            console.log(selectedTab);
            if (selectedTab === 'Jurnal') {
                if (event.key === 'Insert') {
                    handleDetail_Add('new');
                } else if (event.key === 'Delete') {
                    DetailBarangDeleteAll();
                } else if (event.key === 'Enter') {
                    gridDataJurnal.endEdit();
                }
            } else if (selectedTab === 'File') {
                if (event.key === 'Insert') {
                    console.log('Insert key pressed');
                } else if (event.key === 'Delete') {
                    // DetailBarangDeleteAllJurnal();
                } else if (event.key === 'Enter') {
                    gridDataJurnal.endEdit();
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    //================ Editing template untuk kolom grid detail barang ==================

    const editTemplateSubLedger = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.subledger} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={async () => {
                                    if (gridDataJurnal.dataSource[args.index].nama_akun === '') {
                                        myAlert(`No. Akun belum diisi.`);
                                    } else {
                                        setIndexDataJurnal(args.index);
                                        const akun = gridDataJurnal.dataSource[args.index].kode_akun;
                                        const no_akun = gridDataJurnal.dataSource[args.index].no_akun;
                                        const tipe = gridDataJurnal.dataSource[args.index].tipe;
                                        const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
                                            params: {
                                                entitas: kode_entitas,
                                                param1: akun,
                                            },
                                        });
                                        if (tipe === 'Piutang') {
                                            console.log('subledger customer');
                                            setModalCustRow(true);
                                        } else if (tipe === 'Hutang') {
                                            console.log('subledger supplier');
                                            setModalSupplierRow(true);
                                        } else if (cek_subledger.data.data[0].subledger === 'Y') {
                                            setModalAkunSubledger(true);
                                        } else {
                                            myAlert(`No. Akun ${no_akun} tidak mempunyai subsidiary ledger.`);
                                        }
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

    const editTemplateNoKontrakUM = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.no_kontrak_um} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    if (gridDataJurnal.dataSource[args.index].no_akun === '') {
                                        myAlert(`No akun belum terisi.`);
                                    } else {
                                        setModalListUangMuka(true);
                                        setIndexDataJurnal(args.index);
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

    const editTemplateDepartemen = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.nama_dept} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    if (gridDataJurnal.dataSource[args.index].no_akun === '') {
                                        myAlert(`Silahkan pilih akun terlebih dulu.`);
                                    } else {
                                        setModalListDepartment(true);
                                        setIndexDataJurnal(args.index);
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
    // const editTemplateDepartemen = (args: any) => {
    //   return (
    //     <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
    //       {/* <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.departemen} readOnly={true} showClearButton={false} /> */}
    //       <DropDownListComponent
    //         id="dept"
    //         name="dept"
    //         dataSource={listDepartemen}
    //         fields={{ value: 'dept_ku2', text: `nama_dept` }}
    //         floatLabelType="Never"
    //         placeholder={args.nama_dept}
    //         onChange={(e: any) => {
    //           // console.log(e);
    //           if (gridDataJurnal.dataSource[args.index].no_akun === '') {
    //             myAlert(`Silahkan pilih akun terlebih dulu`);
    //           } else {
    //             gridDataJurnal.dataSource[args.index] = { ...gridDataJurnal.dataSource[args.index], kode_dept: e.value.split(/\*/)[0], nama_dept: e.value.split(/\*/)[1] };
    //             gridDataJurnal.refresh();
    //             // console.log(gridDataJurnal.dataSource[args.index]);
    //           }
    //         }}
    //       />
    //     </div>
    //   );
    // };

    const editTemplateNamaKaryawan = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.nama_kry} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    if (gridDataJurnal.dataSource[args.index].nama_dept === '') {
                                        myAlert(`Silahkan pilih akun terlebih dulu.`);
                                    } else {
                                        setModalListKaryawan(true);
                                        setIndexDataJurnal(args.index);
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

    const editTemplateDivisiPenjualan = (args: any) => {
        return (
            <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6">
                <DropDownListComponent
                    id="dept"
                    name="dept"
                    dataSource={listKodeJual}
                    fields={{ value: 'kode_jual', text: `kode_jual` }}
                    floatLabelType="Never"
                    placeholder={args.kode_jual}
                    onChange={(e: any) => {
                        gridDataJurnal.dataSource[args.index] = { ...gridDataJurnal.dataSource[args.index], kode_jual: e.value };
                        gridDataJurnal.refresh();
                    }}
                />
            </div>
        );
    };

    const editTemplateNoAkun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_akun" name="no_akun" className="no_akun" value={args.no_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={async () => {
                                    console.log(args.index);
                                    setIndexDataJurnal(args.index);
                                    setModalAkunJurnal(true);
                                    gridAkunJurnalList.refresh();
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateNamaAkun = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.nama_akun} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem2"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    setModalAkunJurnal(true);
                                    console.log(args.index);
                                    setIndexDataJurnal(args.index);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const templateNoAkun = (args: any) => {
        return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.no_akun}</div>;
    };

    const templateNamaAkun = (args: any) => {
        return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.nama_akun}</div>;
    };

    const headerDivisiPenjualan = () => (
        <div style={{ textAlign: 'center', lineHeight: '1.5em', marginTop: 6, marginBottom: 6 }}>
            Divisi
            <div>Penjualan</div>
        </div>
    );

    const headerAkunPembantu = () => (
        <div style={{ textAlign: 'center', lineHeight: '1.5em' }}>
            Akun Pembantu
            <div>(Subledger)</div>
        </div>
    );

    const headerJumlahmu = () => (
        <div style={{ textAlign: 'center', lineHeight: '1.5em' }}>
            Jumlah
            <div>(MU)</div>
        </div>
    );

    const saveDoc = async () => {
        const akun = gridDataJurnal.dataSource[selectedRowIndex].kode_akun;
        const cek_subledger = await axios.get(`${apiUrl}/erp/cek_subledger?`, {
            params: {
                entitas: kode_entitas,
                param1: akun,
            },
        });

        try {
            const periode = await FirstDayInPeriod(kode_entitas);
            const formatPeriode = moment(periode).format('YYYY-MM-DD');
            const isJumlahEmpty = gridDataJurnal.dataSource.every((item: any) => item.jumlah_rp === 0);
            const isDepartmentNull = gridDataJurnal.dataSource.some((item: any) => (item.tipe === 'Beban' || item.tipe === 'Beban Lain-Lain') && item.kode_dept === null);
            const isDivisiNull = gridDataJurnal.dataSource.some(
                (item: any) => (item.tipe === 'Pendapatan' || item.tipe === 'Pendapatan Lain-Lain' || item.tipe === 'Beban' || item.tipe === 'Beban Lain-Lain') && item.kode_jual === null
            );
            const isSubledgerNull = gridDataJurnal.dataSource.some((item: any) => (item.tipe === 'Hutang' || item.tipe === 'Piutang' || item.isledger === 'Y') && item.subledger === null);

            // Cek akses
            const users_app = await axios.get(`${apiUrl}/erp/users_app`, {
                params: {
                    entitas: kode_entitas,
                    param1: userid,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            const users_appbackdate = users_app.data.data[0].app_backdate;

            //ENT PAJAK DAN ROLE USERS
            const checkDate = async (EntitasPajak: any, userid: any, app_date: any, tgl_ju: any) => {
                if (!EntitasPajak) {
                    if (userid.toLowerCase() !== 'administrator') {
                        if (users_appbackdate !== 'Y') {
                            const dokumenDate = moment(tgl_ju, 'YYYY-MM-DD HH:mm:ss');
                            const appDate = moment(app_date, 'YYYY-MM-DD HH:mm:ss');
                            if (dokumenDate.isAfter(appDate)) {
                                if (dokumenDate.diff(appDate, 'days') > 2) {
                                    myAlert('Tanggal lebih besar dari 3 hari.');
                                    return false;
                                }
                            } else {
                                if (appDate.diff(dokumenDate, 'days') > 14) {
                                    myAlert('Tanggal lebih besar dari 14 hari.');
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
            };

            const checkEntPajak = await entitaspajak(kode_entitas, userid);
            const modcheckEntPajak = checkEntPajak === 'false' ? false : true;
            const checkDateFlag = await checkDate(modcheckEntPajak, userid, moment().format('YYYY-MM-DD HH:mm:ss'), tglDokumen);
            //END ENT PAJAK DAN ROLE USERS
            // =====BLOCKING SAVE=====
            // DATA DETAIL KOSONG
            if (gridDataJurnal.dataSource.length === 0) {
                myAlert(`Data Jurnal belum diisi.`);
                // JUMLAH KOSONG
            } else if (isSubledgerNull) {
                myAlert('Data Subledger belum diisi.');
            } else if (isDepartmentNull) {
                myAlert('Data Departemen belum diisi.');
            } else if (isDivisiNull) {
                myAlert('Data Divisi Penjualan belum diisi.');
            } else if (isJumlahEmpty) {
                myAlert(`Nilai Debit atau Kredit belum diisi.`);
                // SELISIH
            } else if (totalDebetRef.current - totalKreditRef.current !== 0) {
                myAlert(`Bukti Kas Keluar tidak bisa disimpan masih ada selisih Db/Kr.`);
                //PEDIODE /* AKUN */TANSI
            } else if (tglJU < formatPeriode) {
                myAlert(`Tanggal transaksi tidak dalam periode akuntansi.`);
                //ENT PAJAK DAN ROLE USERS
            } else if (!checkDateFlag) {
                return;
            } else {
                startProgress();
                //tambah generateNU disini saat button simpan ditekan
                //LOLOS
                const modifiedDetailJurnal = gridDataJurnal.dataSource.map((item: any) => ({
                    ...item,
                    tgl_dokumen: moment(tglDokumen).format('YYYY-MM-DD HH:mm:ss'),
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                }));

                let defaultNoJU: any;
                if (status_edit !== true) {
                    const fromAPI = await generateNU(kode_entitas, '', '20', moment().format('YYYYMM'));
                    defaultNoJU = fromAPI;
                } else {
                    defaultNoJU = NoJU;
                }

                const JSON = {
                    entitas: kode_entitas,
                    kode_dokumen: status_edit ? kodeJU : '',
                    dokumen: 'JU',
                    no_dokumen: defaultNoJU,
                    tgl_dokumen: moment(tglDokumen).format('YYYY-MM-DD HH:mm:ss'), //tgldokumen edit
                    no_warkat: null,
                    tgl_valuta: tglValuta, //tglvaluta edit
                    kode_cust: null,
                    kode_akun_debet: null,
                    kode_supp: null,
                    kode_akun_kredit: null,
                    kode_akun_diskon: null,
                    kurs: null,
                    debet_rp: totalDebit,
                    kredit_rp: totalKredit,
                    jumlah_rp: totalDebit, //total
                    jumlah_mu: totalDebit, //total
                    pajak: null,
                    kosong: null,
                    kepada: null,
                    catatan: keterangan,
                    status: 'Terbuka',
                    userid: userid,
                    tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                    status_approved: null,
                    tgl_approved: null,
                    tgl_pengakuan: null,
                    no_TTP: null,
                    tgl_TTP: null,
                    kode_sales: null,
                    kode_fk: null,
                    approval: null,
                    tgl_setorgiro: null,
                    faktur: null,
                    barcode: null,
                    komplit: null,
                    validasi1: null,
                    validasi2: null,
                    validasi3: null,
                    validasi_ho2: null,
                    validasi_ho3: null,
                    validasi_catatan: null,
                    tolak_catatan: null,
                    kode_kry: null,
                    tgl_trxdokumen: moment().format('YYYY-MM-DD HH:mm:ss'), //tgl_trxdokumen edit
                    api_id: null,
                    api_pending: null,
                    api_catatan: null,
                    api_norek: null,
                    kode_aktiva: null,
                    kode_um: null,
                    no_kontrak_um: null,
                    kode_rps: null,
                    jurnal: modifiedDetailJurnal,
                };
                if (isSaving) return; // Menghindari double input
                setIsSaving(true);

                if (status_edit == true) {
                    //EDIT API
                    console.log(JSON);
                    var responseAPI = await axios.patch(`${apiUrl}/erp/update_ju`, JSON, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    //SAVE API
                    var responseAPI = await axios.post(`${apiUrl}/erp/simpan_ju`, JSON, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
                if (responseAPI.data.status === true) {
                    gridDataJurnal.dataSource.splice(0, gridDataJurnal.dataSource.length);
                    gridDataJurnal.refresh();
                    if (status_edit !== true) {
                        await generateNU(kode_entitas, defaultNoJU, '20', moment().format('YYYYMM'));
                        handleUpload(responseAPI.data.kode_dokumen);
                        endProgress();
                    } else {
                        handleUpload(kodeJU); // gambar
                        endProgress();
                    }
                    //AUDIT
                    const auditResponse = await axios.post(`${apiUrl}/erp/simpan_audit`, {
                        entitas: kode_entitas,
                        kode_audit: null,
                        dokumen: 'JU',
                        kode_dokumen: status_edit == true ? kodeJU : responseAPI.data.kode_dokumen,
                        no_dokumen: NoJU,
                        tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                        proses: status_edit == true ? 'EDIT' : 'NEW',
                        diskripsi: `Jurnal Umum nilai transaksi = ${totalDebit.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`,
                        userid: userid, // userid login web
                        system_user: '', //username login
                        system_ip: '', //ip address
                        system_mac: '', //mac address
                    });
                    console.log(auditResponse, 'auditResponse');
                    withReactContent(swal)
                        .fire({
                            title: ``,
                            html:
                                status_edit == true ? '<p style="font-size:12px">Perubahan Data Jurnal Umum berhasil disimpan</p>' : '<p style="font-size:12px">Data Jurnal Umum berhasil disimpan</p>',
                            target: '#dialogJUList',
                            icon: 'success',
                            width: '350px',
                            heightAuto: true,
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        .then(() => {
                            onRefresh();
                            setTimeout(() => {
                                onClose();
                            }, 100);
                        });
                    endProgress();
                } else {
                    if (responseAPI.data.message.toLowerCase().startsWith(`Duplicate entry 'JU`.toLocaleLowerCase())) {
                        if (tryAgain.current >= 2) {
                            console.log('Tetap gagal di percobaan ke', tryAgain.current);
                            withReactContent(swal).fire({
                                title: ``,
                                html:
                                    status_edit == true
                                        ? '<p style="font-size:12px">Perubahan Data Jurnal Umum gagal disimpan ' + responseAPI.data.message + '</p>'
                                        : '<p style="font-size:12px">Data Jurnal Umum gagal disimpan ' + responseAPI.data.message + '</p>',
                                target: '#dialogJUList',
                                icon: 'error',
                                width: '350px',
                                heightAuto: true,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            tryAgain.current = 1;
                            endProgress();
                            return;
                        }
                        tryAgain.current += 1;
                        console.log('iya duplikat coba lagi');
                        await generateNU(kode_entitas, defaultNoJU, '20', moment().format('YYYYMM'));
                        saveDoc();
                        return;
                    } else if (responseAPI.data.message === 'Server sedang sibuk, mohon coba lagi beberapa saat.') {
                        // console.log('Else IF tereksekusi');
                        withReactContent(swal).fire({
                            title: `Gagal Simpan JU!`,
                            text: `Server sedang sibuk, silahkan coba beberapa saat lagi.`,
                            target: '#dialogJUList',
                            icon: 'error',
                            width: '350px',
                            heightAuto: true,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        endProgress();
                        return;
                    } else {
                        withReactContent(swal).fire({
                            title: ``,
                            html: status_edit == true ? '<p style="font-size:12px">Perubahan Data Jurnal Umum gagal disimpan</p>' : '<p style="font-size:12px">Data Jurnal Umum gagal disimpan</p>',
                            target: '#dialogJUList',
                            icon: 'error',
                            width: '350px',
                            heightAuto: true,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        endProgress();
                    }
                }
            }
        } catch (error) {
            withReactContent(swal).fire({
                title: ``,
                html: status_edit == true ? '<p style="font-size:12px">Perubahan Data Jurnal Umum gagal disimpan</p>' : '<p style="font-size:12px">Data Jurnal Umum gagal disimpan</p>',
                target: '#dialogJUList',
                icon: 'error',
                width: '350px',
                heightAuto: true,
                showConfirmButton: false,
                timer: 1500,
            });
            endProgress();
        } finally {
            setIsSaving(false); // Setelah proses penyimpanan selesai
            endProgress();
        }
    };

    // ======================IMAGE UPLOAD=================================
    let uploaderRef: any = useRef<UploaderComponent>(null);
    let uploaderRef2: any = useRef<UploaderComponent>(null);
    let uploaderRef3: any = useRef<UploaderComponent>(null);
    let uploaderRef4: any = useRef<UploaderComponent>(null);
    const [preview, setPreview] = useState<any>(null);
    const [preview2, setPreview2] = useState<any>(null);
    const [preview3, setPreview3] = useState<any>(null);
    const [preview4, setPreview4] = useState<any>(null);
    const [nameImage, setNameImage] = useState<any>(null);
    const [nameImage2, setNameImage2] = useState<any>(null);
    const [nameImage3, setNameImage3] = useState<any>(null);
    const [nameImage4, setNameImage4] = useState<any>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const handleFileSelect = (args: any, jenis: any) => {
        const file = args.filesData[0]?.rawFile;
        const fileName = file.name.toLowerCase(); // Ubah nama file ke huruf kecil
        const lastDotIndex = fileName.lastIndexOf('.');
        const fileExtension = fileName.slice(lastDotIndex + 1).toLowerCase();
        console.log(fileExtension);

        if (jenis === '1') {
            setNameImage('BM' + moment().format('YYMMDDHHmmss' + '.' + fileExtension));
        } else if (jenis === '2') {
            setNameImage2('BM' + moment().format('YYMMDDHHmmss' + '.' + fileExtension));
        } else if (jenis === '3') {
            setNameImage3('BM' + moment().format('YYMMDDHHmmss' + '.' + fileExtension));
        } else if (jenis === '4') {
            setNameImage4('BM' + moment().format('YYMMDDHHmmss' + '.' + fileExtension));
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
                if (jenis === '1') {
                    setPreview(e.target.result as string);
                } else if (jenis === '2') {
                    setPreview2(e.target.result as string);
                } else if (jenis === '3') {
                    setPreview3(e.target.result as string);
                } else if (jenis === '4') {
                    setPreview4(e.target.result as string);
                }
            } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
                if (jenis === '1') {
                    setPreview(resExcel);
                } else if (jenis === '2') {
                    setPreview2(resExcel);
                } else if (jenis === '3') {
                    setPreview3(resExcel);
                } else if (jenis === '4') {
                    setPreview4(resExcel);
                }
            } else if (fileExtension === 'doc' || fileExtension === 'docx') {
                if (jenis === '1') {
                    setPreview(resWord);
                } else if (jenis === '2') {
                    setPreview2(resWord);
                } else if (jenis === '3') {
                    setPreview3(resWord);
                } else if (jenis === '4') {
                    setPreview4(resWord);
                }
            } else if (fileExtension === 'zip' || fileExtension === 'rar') {
                if (jenis === '1') {
                    setPreview(resZip);
                } else if (jenis === '2') {
                    setPreview2(resZip);
                } else if (jenis === '3') {
                    setPreview3(resZip);
                } else if (jenis === '4') {
                    setPreview4(resZip);
                }
            } else if (fileExtension === 'pdf') {
                if (jenis === '1') {
                    setPreview(resPdf);
                } else if (jenis === '2') {
                    setPreview2(resPdf);
                } else if (jenis === '3') {
                    setPreview3(resPdf);
                } else if (jenis === '4') {
                    setPreview4(resPdf);
                }
            } else {
                if (jenis === '1') {
                    setPreview(resUnknow);
                } else if (jenis === '2') {
                    setPreview2(resUnknow);
                } else if (jenis === '3') {
                    setPreview3(resUnknow);
                } else if (jenis === '4') {
                    setPreview4(resUnknow);
                }
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = (jenis: any) => {
        const element: any = document.getElementById(jenis);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
        if (jenis === '1') {
            setPreview(null);
        } else if (jenis === '2') {
            setPreview2(null);
        } else if (jenis === '3') {
            setPreview3(null);
        } else if (jenis === '4') {
            setPreview4(null);
        } else if (jenis === 'all') {
            withReactContent(Swal)
                .fire({
                    html: 'Apakah anda akan membersihkan semua gambar?',
                    width: '20%',
                    target: '#dialogJUList',
                    showCancelButton: true,
                    confirmButtonText: '<p style="font-size:10px">Ya</p>',
                    cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        setPreview(null);
                        setPreview2(null);
                        setPreview3(null);
                        setPreview4(null);
                        const elements: any = document.getElementsByClassName('e-upload-file-list');
                        while (elements.length > 0) {
                            elements[0].parentNode.removeChild(elements[0]);
                        }
                    } else {
                        console.log('cancel');
                    }
                });
        }
    };

    const handleUpload = async (kode_dokumen: any) => {
        if (uploaderRef.current && uploaderRef2.current && uploaderRef3.current && uploaderRef4.current) {
            const filesArray = [
                preview ? [{ rawFile: await fetch(preview).then((res) => res.blob()), fileName: nameImage }] : uploaderRef.current.getFilesData(), // ubah menjadi fileuploader
                preview2 ? [{ rawFile: await fetch(preview2).then((res) => res.blob()), fileName: nameImage2 }] : uploaderRef2.current.getFilesData(), // ubah menjadi fileuploader
                preview3 ? [{ rawFile: await fetch(preview3).then((res) => res.blob()), fileName: nameImage3 }] : uploaderRef3.current.getFilesData(), // ubah menjadi fileuploader
                preview4 ? [{ rawFile: await fetch(preview4).then((res) => res.blob()), fileName: nameImage4 }] : uploaderRef4.current.getFilesData(), // ubah menjadi fileuploader
            ];
            console.log(filesArray);

            const nameImages = [nameImage, nameImage2, nameImage3, nameImage4];
            console.log(nameImages);
            const zip = new JSZip();
            let filesAdded = false;

            filesArray.forEach((files, index) => {
                if (files.length > 0) {
                    const file = files[0].rawFile;
                    zip.file(nameImages[index], file);
                    filesAdded = true;
                }
            });

            if (filesAdded) {
                try {
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    const formData = new FormData();
                    formData.append('myimage', zipBlob);
                    formData.append('ets', kode_entitas);
                    formData.append('nama_file_image', `IMG_${kode_dokumen}.zip`); // dari response simpan ju

                    const response = await axios.post(`${apiUrl}/upload`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (response.status === 200) {
                        const result = response.data;
                        console.log('Upload successful:', result);
                        // myAlert('Berhasil Upload');

                        const createJson = (id: any, nameImage: any) => ({
                            entitas: kode_entitas,
                            kode_dokumen: kode_dokumen, // dari response simpan
                            id_dokumen: id,
                            dokumen: 'BM',
                            filegambar: nameImage,
                            fileoriginal: 'default.jpg',
                        });

                        const jsonZip = {
                            entitas: kode_entitas,
                            kode_dokumen: kode_dokumen, // dari response simpan
                            id_dokumen: '999', //default
                            dokumen: 'JU',
                            filegambar: `IMG_${kode_dokumen}.zip`, // dari response simpan
                            fileoriginal: 'default.zip',
                        };

                        const combinedArray = filesArray.map((files, index) => (files.length > 0 ? createJson(index + 1, nameImages[index]) : null)).filter(Boolean);

                        combinedArray.push(jsonZip);

                        console.log(combinedArray);
                        console.log(jsonImageEdit);

                        // jika edit
                        // cari id yang tidak ada disini untuk dihapus
                        if (status_edit === true) {
                            const combinedIds = combinedArray.map((item: any) => item.id_dokumen.toString());
                            const editIds = jsonImageEdit.map((item: any) => item.id_dokumen.toString());
                            const missingIds = editIds.filter((id) => !combinedIds.includes(id));
                            const paramsArrayDelete = missingIds.join(',');
                            console.log(paramsArrayDelete);
                            if (paramsArrayDelete !== '') {
                                //DELETE TB_IMAGES
                                try {
                                    const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                                        params: {
                                            entitas: kode_entitas,
                                            param1: kode_dokumen,
                                            param2: paramsArrayDelete, // Sesuaikan dengan data yang diperlukan untuk menghapus
                                        },
                                    });
                                    console.log('Response dari penghapusan file pendukung:', response.data);
                                } catch (error) {
                                    console.error('Error saat menghapus file pendukung:', error);
                                }
                            } else {
                                console.log('tidak ada yg perlu dihapus');
                            }
                        }

                        // INSERT
                        try {
                            // Simpan data ke database
                            const insertResponse = await axios.post(`${apiUrl}/erp/simpan_tbimages`, combinedArray);
                            console.log(insertResponse);
                        } catch (error) {
                            console.error('Error saat menyimpan data baru:', error);
                        }
                    } else {
                        console.error('Upload failed:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            } else {
                console.log('Tanpa Gambar // tidak ada perubahan');

                //kondisi jika gambar dihapus semua
                console.log(jsonImageEdit);
                //hapus semua
                if (jsonImageEdit.length > 0) {
                    try {
                        const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                            params: {
                                entitas: kode_entitas,
                                param1: kode_dokumen,
                                param2: '1,2,3,4,999', // Sesuaikan dengan data yang diperlukan untuk menghapus
                            },
                        });
                        console.log('Response dari penghapusan file pendukung:', response.data);
                    } catch (error) {
                        console.error('Error saat menghapus file pendukung:', error);
                    }
                }
            }
        } else {
            console.log('Uploader refs are not defined');
        }
    };

    const handleDownloadImage = (jenis: string) => {
        const imageUrl = jenis === '1' ? preview : jenis === '2' ? preview2 : jenis === '3' ? preview3 : jenis === '4' ? preview4 : null;
        const fileName = jenis === '1' ? nameImage : jenis === '2' ? nameImage2 : jenis === '3' ? nameImage3 : jenis === '4' ? nameImage4 : null;

        if (!imageUrl || !fileName) {
            console.error('No image to download');
            return;
        }

        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePreviewImage = (jenis: string) => {
        if (jenis === 'open') {
            setModalPreview(true);
        } else if (jenis === 'close') {
            setModalPreview(false);
        }
    };

    const handleWheel = (event: any) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            setZoomLevel((prevScale) => Math.min(prevScale + 0.1, 6));
        } else {
            setZoomLevel((prevScale) => Math.max(prevScale - 0.1, 0.5));
        }
    };

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setStartPosition({ x: event.clientX - translate.x, y: event.clientY - translate.y });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            setTranslate({
                x: event.clientX - startPosition.x,
                y: event.clientY - startPosition.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (modalPreview) {
            window.addEventListener('wheel', handleWheel, { passive: false });
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [modalPreview, handleMouseMove, handleMouseUp, handleWheel]);
    // ======================END IMAGE UPLOAD====================================

    return (
        <DialogComponent
            id="dialogJUList"
            isModal={true}
            width="85%"
            height="65%"
            visible={isOpen}
            close={() => {
                console.log('closeDialog');
                //hapus
                dialogClose();
                gridDataJurnal.dataSource.splice(0, gridDataJurnal.dataSource.length);
                gridDataJurnal.refresh();
            }}
            header={status_edit === false ? 'Jurnal Umum' : 'Jurnal Umum (EDIT)'}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            enableResize={true}
        >
            <div style={{ minWidth: '70%', overflow: 'auto' }}>
                <div>
                    <div>
                        {/* ===============  Master Header Data ========================   */}
                        <div className="mb-1" style={{ padding: 10, marginTop: -5 }}>
                            <div className="panel-tabel" style={{ width: '70%' }}>
                                <table className={styles.table} style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '10%' }}>Tgl. Buat</th>
                                            <th style={{ width: '10%' }}>Tanggal</th>
                                            <th style={{ width: '10%' }}>No. Bukti</th>
                                            <th style={{ width: '50%' }}>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <DatePickerComponent
                                                    style={{ fontSize: '12px', height: '10px', textAlign: 'center' }}
                                                    locale="id"
                                                    cssClass="e-custom-style"
                                                    placeholder="Tgl. PP"
                                                    showClearButton={false}
                                                    format="dd-MM-yyyy"
                                                    value={status_edit ? tglJU : new Date()} // Menggunakan objek Date untuk menetapkan nilai awal
                                                    disabled
                                                >
                                                    {/* <Inject services={[MaskedDateTime]} /> */}
                                                </DatePickerComponent>
                                            </td>
                                            <td>
                                                <DatePickerComponent
                                                    style={{ fontSize: '12px', height: '10px', textAlign: 'center' }}
                                                    locale="id"
                                                    cssClass="e-custom-style"
                                                    showClearButton={false}
                                                    enableMask={true}
                                                    maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                    format="dd-MM-yyyy"
                                                    value={tglDokumen.toDate()} // Menggunakan objek Date untuk menetapkan nilai awal
                                                    change={(args: ChangeEventArgsCalendar) => {
                                                        if (args.value) {
                                                            const selectedDate = moment(args.value);
                                                            const hour = tglDokumen.hour() || moment().hour();
                                                            const minute = tglDokumen.minute() || moment().minute();
                                                            const second = tglDokumen.second() || moment().second();

                                                            selectedDate.set({
                                                                hour: hour,
                                                                minute: minute,
                                                                second: second,
                                                            });
                                                            setTglDokumen(selectedDate);
                                                        } else {
                                                            setTglDokumen(moment());
                                                        }
                                                    }}
                                                    // readOnly
                                                    // allowEdit={false}
                                                >
                                                    <Inject services={[MaskedDateTime]} />
                                                </DatePickerComponent>
                                            </td>
                                            <td>
                                                <div className="container">
                                                    <TextBoxComponent style={{ fontSize: '12px', textAlign: 'center' }} placeholder="No. Bukti" value={NoJU} readonly />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="container">
                                                    <TextBoxComponent
                                                        style={{ fontSize: '12px', textAlign: 'left' }}
                                                        onChange={(e: any) => setKeterangan(e.value)}
                                                        value={keterangan}
                                                        onBlur={() => {
                                                            console.log('asd');
                                                            //hanya index 0
                                                            if (gridDataJurnal.dataSource.length > 0) {
                                                                const editedData = {
                                                                    ...gridDataJurnal.dataSource[0],
                                                                    catatan: keterangan,
                                                                };
                                                                gridDataJurnal.dataSource[0] = editedData;
                                                                gridDataJurnal.refresh();
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* ===============  Detail Data ========================   */}
                        <div className="panel-tab" style={{ background: '#f0f0f0', width: '100%', height: '440px', marginTop: -5, borderRadius: 10 }}>
                            <TabComponent
                                // ref={(t) => (tabTtbList = t)}
                                selectedItem={0}
                                animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                height="100%"
                            >
                                <div className="e-tab-header" style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => setSelectedTab('Jurnal')}
                                        tabIndex={0}
                                        style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        Data Jurnal
                                    </div>
                                    <div
                                        onClick={() => setSelectedTab('File')}
                                        tabIndex={1}
                                        style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                    >
                                        File Pendukung
                                    </div>
                                </div>

                                {/*===================== Content menampilkan data barang =======================*/}
                                <div className="e-content">
                                    {/* //DATA JURNAL */}
                                    <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <TooltipComponent openDelay={1000} target=".e-headertext">
                                            <GridComponent
                                                id="gridDataJurnal"
                                                name="gridDataJurnal"
                                                className="gridDataJurnal"
                                                locale="id"
                                                ref={(g: any) => (gridDataJurnal = g)}
                                                // dataSource={dataBarang.nodes}
                                                editSettings={{
                                                    allowAdding: true,
                                                    allowEditing: true,
                                                    // allowDeleting: status_edit == true ? false : true,
                                                    newRowPosition: 'Bottom',
                                                }}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowResizing={true}
                                                autoFit={true}
                                                rowHeight={22}
                                                height={250} //170 barang jadi 150 barang produksi
                                                gridLines={'Both'}
                                                actionBegin={actionBeginDetailJurnal}
                                                actionComplete={actionCompleteDetailJurnal}
                                                rowSelecting={rowSelectingDetailBarang}
                                                created={() => {}}
                                                allowKeyboard={false}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective field="id_dokumen" type="number" isPrimaryKey={true} headerText="ID" headerTextAlign="Center" textAlign="Center" width="30" />
                                                    <ColumnDirective
                                                        field="no_akun"
                                                        headerText="No. Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                        // allowEditing={false}
                                                        editTemplate={editTemplateNoAkun}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_akun"
                                                        headerText="Nama Akun"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="200"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateNamaAkun}
                                                    />
                                                    <ColumnDirective
                                                        field="debet_rp"
                                                        format="N2"
                                                        headerText="Debet"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="kredit_rp"
                                                        format="N2"
                                                        headerText="Kredit"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective field="catatan" headerText="Keterangan" headerTextAlign="Center" textAlign="Left" width="250" clipMode="EllipsisWithTooltip" />
                                                    <ColumnDirective
                                                        field="kode_mu"
                                                        headerText="MU"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="40"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                    />
                                                    <ColumnDirective
                                                        field="kurs"
                                                        format="N2"
                                                        headerText="Kurs"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="40"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                    />
                                                    <ColumnDirective
                                                        field="jumlah_mu"
                                                        headerTemplate={headerJumlahmu}
                                                        format="N2"
                                                        headerText="Jumlah (MU)"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="100"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                    />
                                                    <ColumnDirective
                                                        field="subledger"
                                                        headerTemplate={headerAkunPembantu}
                                                        headerText="Akun Pembantu (Subledger)"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="170"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        editTemplate={editTemplateSubLedger}
                                                    />
                                                    <ColumnDirective
                                                        field="no_kontrak_um"
                                                        headerText="No. Kontrak UM"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="155"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        editTemplate={editTemplateNoKontrakUM}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_dept"
                                                        headerText="Departemen"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="120"
                                                        clipMode="EllipsisWithTooltip"
                                                        editTemplate={editTemplateDepartemen}
                                                    />
                                                    <ColumnDirective
                                                        field="nama_kry"
                                                        headerText="Nama Karyawan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="120"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        editTemplate={editTemplateNamaKaryawan}
                                                    />
                                                    <ColumnDirective
                                                        field="kode_jual"
                                                        headerTemplate={headerDivisiPenjualan}
                                                        // headerText={'Divisi\nPenjualan'}
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="80"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        editTemplate={editTemplateDivisiPenjualan}
                                                    />
                                                </ColumnsDirective>

                                                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                            </GridComponent>
                                        </TooltipComponent>
                                        <div style={{ padding: 5 }} className="panel-pager">
                                            <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                    <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                        <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll2">
                                                            <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                    {/* {status_edit == true ? (
                                                                        <div style={{ marginTop: 28 }} className="mt-1 flex"></div>
                                                                    ) : ( */}
                                                                    <div className="mt-1 flex">
                                                                        {plag === 'bukuBesar' ? null : (
                                                                            <>
                                                                                <ButtonComponent
                                                                                    id="buAdd1"
                                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                    cssClass="e-primary e-small"
                                                                                    iconCss="e-icons e-small e-plus"
                                                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                    onClick={() => handleDetail_Add('new')}
                                                                                />
                                                                                <ButtonComponent
                                                                                    id="buDelete1"
                                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                    cssClass="e-warning e-small"
                                                                                    iconCss="e-icons e-small e-trash"
                                                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                    onClick={() => {
                                                                                        DetailBarangDelete();
                                                                                    }}
                                                                                />
                                                                                <ButtonComponent
                                                                                    id="buDeleteAll2"
                                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                    cssClass="e-danger e-small"
                                                                                    iconCss="e-icons e-small e-erase"
                                                                                    style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                    onClick={() => {
                                                                                        DetailBarangDeleteAll();
                                                                                        console.log('diklkik');
                                                                                    }}
                                                                                />
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    {/* )} */}
                                                                    <div style={{ float: 'right', marginTop: -33 }}>
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style={{ paddingRight: '10px', fontSize: 11 }}>
                                                                                        <b>Total Db/Kr :</b>
                                                                                    </td>
                                                                                    <td style={{ fontSize: 11 }}>
                                                                                        <b>{frmNumber(totalDebit)}</b>
                                                                                    </td>
                                                                                    <td style={{ fontSize: 11 }}>
                                                                                        <b>{frmNumber(totalKredit)}</b>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style={{ paddingRight: '10px', fontSize: 11 }}>
                                                                                        <b>Selisih :</b>
                                                                                    </td>
                                                                                    <td style={{ fontSize: 11 }}>
                                                                                        <b>{frmNumber(totalDebit - totalKredit)}</b>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </div>
                                    </div>
                                    {/* //FILE PENDUKUNG */}
                                    <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                // position: 'fixed',
                                                zIndex: 1000, // zIndex untuk bisa diklik
                                                // right: 0,
                                                // backgroundColor: '#F2FDF8',
                                                position: 'absolute',
                                                // bottom: 0,
                                                right: 0,
                                                borderBottomLeftRadius: '6px',
                                                borderBottomRightRadius: '6px',
                                                // width: '100%',
                                                // height: '55px',
                                                // display: 'inline-block',
                                                overflowX: 'scroll',
                                                overflowY: 'hidden',
                                                scrollbarWidth: 'none',
                                                // border: '1px solid',
                                                marginRight: 10,
                                            }}
                                        >
                                            {/* <ButtonComponent
                                                id="clean"
                                                content="Hapus Gambar"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-trash"
                                                style={{ width: '190px', marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    handleRemove(selectedHead);
                                                }}
                                            /> */}
                                            <ButtonComponent
                                                id="cleanall"
                                                content="Bersihkan Semua Gambar"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-erase"
                                                style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    handleRemove('all');
                                                }}
                                            />
                                            <ButtonComponent
                                                id="savefile"
                                                content="Simpan ke File"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-download"
                                                style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    handleDownloadImage(selectedHead);
                                                }}
                                            />
                                            <ButtonComponent
                                                id="preview"
                                                content="Preview"
                                                cssClass="e-primary e-small"
                                                iconCss="e-icons e-small e-image"
                                                style={{ width: '190px', marginTop: 5, marginRight: 2, backgroundColor: '#3b3f5c' }}
                                                onClick={() => {
                                                    handlePreviewImage('open');
                                                }}
                                            />
                                            {modalPreview && (
                                                <div
                                                    style={{
                                                        position: 'fixed',
                                                        top: '0',
                                                        left: '0',
                                                        width: '100vw',
                                                        height: '100vh',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        zIndex: '1000',
                                                        overflow: 'hidden',
                                                    }}
                                                    // onClick={() => setModalPreview(false)}
                                                >
                                                    <div
                                                        style={{
                                                            position: 'relative',
                                                            textAlign: 'center',
                                                            zIndex: '1001',
                                                            cursor: 'grab',
                                                            transform: `translate(${translate.x}px, ${translate.y}px)`,
                                                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                                                        }}
                                                        onMouseDown={handleMouseDown}
                                                        onMouseUp={handleMouseUp}
                                                        onWheel={handleWheel}
                                                    >
                                                        <Image
                                                            src={
                                                                selectedHead === '1'
                                                                    ? preview
                                                                    : selectedHead === '2'
                                                                    ? preview2
                                                                    : selectedHead === '3'
                                                                    ? preview3
                                                                    : selectedHead === '4'
                                                                    ? preview4
                                                                    : null
                                                            }
                                                            style={{
                                                                transform: `scale(${zoomLevel})`,
                                                                transition: 'transform 0.1s ease',
                                                                cursor: 'pointer',
                                                                maxWidth: '100vw',
                                                                maxHeight: '100vh',
                                                            }}
                                                            className={zoomLevel === 2 ? 'zoomed' : ''}
                                                            onMouseDown={handleMouseDown}
                                                            onMouseUp={handleMouseUp}
                                                            alt="Large Image"
                                                            width={500}
                                                            height={500}
                                                        />
                                                    </div>
                                                    <div
                                                        style={{
                                                            position: 'fixed',
                                                            top: '10px',
                                                            right: '10px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            zIndex: '1001',
                                                        }}
                                                    >
                                                        <ButtonComponent
                                                            cssClass="e-primary e-small"
                                                            iconCss=""
                                                            style={{
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <span
                                                                className="e-icons e-close"
                                                                style={{ fontSize: '24px' }}
                                                                onClick={() => {
                                                                    handlePreviewImage('close');
                                                                    setZoomLevel(0.5);
                                                                    setTranslate({ x: 0, y: 0 });
                                                                }}
                                                            ></span>
                                                        </ButtonComponent>
                                                        <ButtonComponent
                                                            cssClass="e-primary e-small"
                                                            iconCss=""
                                                            style={{
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <span className="e-icons e-zoom-in" style={{ fontSize: '24px' }} onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 6))}></span>
                                                        </ButtonComponent>
                                                        <ButtonComponent
                                                            cssClass="e-primary e-small"
                                                            iconCss=""
                                                            style={{
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                backgroundColor: 'transparent',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <span className="e-icons e-zoom-out" style={{ fontSize: '24px' }} onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}></span>
                                                        </ButtonComponent>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <TabComponent
                                            // ref={(t) => (tabTtbList = t)}
                                            selectedItem={0}
                                            animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                            height="100%"
                                            style={{ marginTop: -10, fontSize: 12 }}
                                        >
                                            <div className="e-tab-header" style={{ display: 'flex' }}>
                                                <div
                                                    tabIndex={0}
                                                    onClick={() => setSelectedHead('1')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Nota Pendukung
                                                </div>
                                                <div
                                                    tabIndex={1}
                                                    onClick={() => setSelectedHead('2')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Bukti Persetujuan
                                                </div>
                                                <div
                                                    tabIndex={2}
                                                    onClick={() => setSelectedHead('3')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Bukti Pendukung 1
                                                </div>
                                                <div
                                                    tabIndex={3}
                                                    onClick={() => setSelectedHead('4')}
                                                    style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                                >
                                                    Bukti Pendukung 2
                                                </div>
                                            </div>

                                            {/*===================== Content menampilkan data barang =======================*/}
                                            <div className="e-content">
                                                {/* //A */}
                                                <div tabIndex={0} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload"
                                                                type="file"
                                                                ref={uploaderRef}
                                                                // asyncSettings={path}
                                                                // autoUpload={false}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '1')}
                                                                removing={() => handleRemove('1')}
                                                            />
                                                        </div>
                                                        {preview && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                        {/* {preview && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }}>
                                                                <SlideshowLightbox>
                                                                    <img style={{ width: 300, height: '100%' }} className="w-full rounded" src={preview} />
                                                                </SlideshowLightbox>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                                {/* //B */}
                                                <div tabIndex={1} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload2"
                                                                type="file"
                                                                ref={uploaderRef2}
                                                                // asyncSettings={path}
                                                                // autoUpload={false}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '2')}
                                                                removing={() => handleRemove('2')}
                                                            />
                                                        </div>
                                                        {preview2 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview2} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                        {/* {preview2 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }}>
                                                                <SlideshowLightbox>
                                                                    <img style={{ width: 300, height: '100%' }} className="w-full rounded" src={preview2} />
                                                                </SlideshowLightbox>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                                {/* //C */}
                                                <div tabIndex={2} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload3"
                                                                type="file"
                                                                ref={uploaderRef3}
                                                                // asyncSettings={path}
                                                                // autoUpload={false}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '3')}
                                                                removing={() => handleRemove('3')}
                                                            />
                                                        </div>
                                                        {preview3 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview3} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                        {/* {preview3 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }}>
                                                                <SlideshowLightbox>
                                                                    <img style={{ width: 300, height: '100%' }} className="w-full rounded" src={preview3} />
                                                                </SlideshowLightbox>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                                {/* //D */}
                                                <div tabIndex={4} style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                                    <div style={{ display: 'flex' }}>
                                                        <div style={{ width: 400 }}>
                                                            <UploaderComponent
                                                                id="previewfileupload4"
                                                                type="file"
                                                                ref={uploaderRef4}
                                                                // asyncSettings={path}
                                                                // autoUpload={false}
                                                                multiple={false}
                                                                selected={(e) => handleFileSelect(e, '4')}
                                                                removing={() => handleRemove('4')}
                                                            />
                                                        </div>
                                                        {preview4 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                <Image src={preview4} alt="Large Image" width={300} height={300} style={{ width: '100%', height: '300px' }} />
                                                            </div>
                                                        )}
                                                        {/* {preview4 && (
                                                            <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }}>
                                                                <SlideshowLightbox>
                                                                    <img style={{ width: 300, height: '100%' }} className="w-full rounded" src={preview4} />
                                                                </SlideshowLightbox>
                                                            </div>
                                                        )} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabComponent>
                                    </div>
                                </div>
                            </TabComponent>
                        </div>
                    </div>
                </div>
                {/* =================  Tombol action dokumen ==================== */}
                <div
                    style={{
                        // backgroundColor: '#F2FDF8',
                        position: 'absolute',
                        bottom: 0,
                        right: -20,
                        borderBottomLeftRadius: '6px',
                        borderBottomRightRadius: '6px',
                        width: '100%',
                        height: '55px',
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
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={() => {
                            dialogClose();
                            gridDataJurnal.dataSource.splice(0, gridDataJurnal.dataSource.length);
                            gridDataJurnal.refresh();
                        }}
                    />
                    {plag === 'bukuBesar' ? null : (
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Simpan"
                            cssClass="e-primary e-small"
                            iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                gridDataJurnal.endEdit();
                                kalkulasiJurnal();
                                gridDataJurnal.refresh();
                                // console.log(gridDataJurnal.dataSource);

                                setTimeout(() => {
                                    saveDoc();
                                }, 800);
                            }}
                        />
                    )}
                    {/* <ButtonComponent
                        id="buSimpanDokumen1"
                        content="Simpan"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-save"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={() => {
                            saveDoc();
                        }}
                    /> */}
                </div>

                {/* MODAL AKUN JURNAL */}
                {modalAkunJurnal && (
                    <DialogComponent
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Akun Jurnal'}
                        visible={modalAkunJurnal}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        enableResize={true}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="425"
                        height="450"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalAkunJurnal(false);
                            setSearchNoAkun('');
                            setSearchNamaAkun('');
                        }}
                        closeOnEscape={true}
                    >
                        <div className="form-input mb-1 mr-1" style={{ width: '135px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNoAkun"
                                name="searchNoAkun"
                                className="searchNoAkun"
                                placeholder="<No. Akun>"
                                showClearButton={true}
                                value={searchNoAkun}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNamaAkun')[0] as HTMLFormElement).value = '';
                                    setSearchNamaAkun('');
                                    const value: any = args.value;
                                    setSearchNoAkun(value);
                                }}
                            />
                        </div>
                        <div className="form-input mb-1" style={{ width: '275px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNamaAkun"
                                name="searchNamaAkun"
                                className="searchNamaAkun"
                                placeholder="<Nama Akun>"
                                showClearButton={true}
                                value={searchNamaAkun}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNoAkun')[0] as HTMLFormElement).value = '';
                                    setSearchNoAkun('');
                                    const value: any = args.value;
                                    setSearchNamaAkun(value);
                                }}
                            />
                        </div>
                        <GridComponent
                            locale="id"
                            ref={(g: any) => (gridAkunJurnalList = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'267'}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowSelecting={(args: any) => {
                                console.log(args.data);
                                setSelectedAkunJurnal(args.data);
                            }}
                            recordDoubleClick={recordClickHandle}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_akun" headerText="No. Akun" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective
                                    field="nama_akun"
                                    headerText="Keterangan"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="60"
                                    clipMode="EllipsisWithTooltip"
                                    template={templateNamaAkun}
                                />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setModalAkunJurnal(false);
                                setSearchNoAkun('');
                                setSearchNamaAkun('');
                            }}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                console.log('selectedAkunJurnal', selectedAkunJurnal);

                                if (!selectedAkunJurnal) {
                                    myAlert(`Silahkan pilih akun terlebih dulu.`);
                                } else if (selectedAkunJurnal.header === 'Y') {
                                    setModalAkunJurnal(false);
                                    myAlert(`No. Akun ${selectedAkunJurnal.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi.`);
                                } else {
                                    const selectedItems = selectedAkunJurnal;
                                    console.log(selectedItems);
                                    setSelectedAkunJurnal(selectedItems);
                                    setModalAkunJurnal(false);

                                    if (selectedItems.isledger === 'Y') {
                                        setModalAkunSubledger(true);
                                    } else if (selectedItems.tipe === 'Hutang') {
                                        setModalSupplierRow(true);
                                    } else if (selectedItems.tipe === 'Piutang') {
                                        setModalCustRow(true);
                                    } else if (selectedItems.tipe === 'Beban' || selectedItems.tipe === 'Beban Lain-Lain') {
                                        // setModalAkunSubledger(true);
                                        setModalListDepartment(true);
                                        // setModalListKaryawan(true);
                                    }

                                    const editedData = {
                                        ...gridDataJurnal.dataSource[indexDataJurnal],
                                        isledger: selectedItems.isledger,
                                        kode_akun: selectedItems.kode_akun,
                                        no_akun: selectedItems.no_akun,
                                        nama_akun: selectedItems.nama_akun,
                                        tipe: selectedItems.tipe,
                                        kode_subledger: null, // jika diganti dibuat kosong
                                        subledger: null,
                                        kode_kry: null,
                                        nama_kry: null,
                                        kode_dept: null,
                                        nama_dept: null,
                                        no_kontrak_um: null,
                                    };
                                    gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                    gridDataJurnal.refresh();

                                    setSearchNoAkun('');
                                    setSearchNamaAkun('');
                                }

                                // if (selectedAkunJurnal) {
                                //   console.log(selectedAkunJurnal);
                                //   setModalAkunJurnal(false);
                                //   const editedData = {
                                //     ...gridDataJurnal.dataSource[indexDataJurnal],
                                //     kode_akun: selectedAkunJurnal.kode_akun,
                                //     no_akun: selectedAkunJurnal.no_akun,
                                //     nama_akun: selectedAkunJurnal.nama_akun,
                                //     tipe: selectedAkunJurnal.tipe,
                                //     kode_subledger: null, // jika diganti dibuat kosong
                                //     subledger: null,
                                //     kode_kry: null,
                                //     nama_kry: null,
                                //     kode_dept: null,
                                //     nama_dept: null,
                                //     no_kontrak_um: null,
                                //   };
                                //   gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                //   gridDataJurnal.refresh();
                                // } else {
                                //   myAlert(`Silahkan pilih akun terlebih dulu.`);
                                // }
                            }}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL AKUN JURNAL */}

                {/* MODAL SUBLEDGER list_subledger_by_kodeakun*/}
                {modalAkunSubledger && (
                    <DialogComponent
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Subledger'}
                        visible={modalAkunSubledger}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        enableResize={true}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="425"
                        height="450"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalAkunSubledger(false);
                            setSearchNoAkunSubledger('');
                            setSearchNamaSubledger('');
                        }}
                        closeOnEscape={true}
                    >
                        <div className="form-input mb-1 mr-1" style={{ width: '135px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNoAkunSub"
                                name="searchNoAkunSub"
                                className="searchNoAkunSub"
                                placeholder="<No. Akun>"
                                showClearButton={true}
                                value={searchNoAkun}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNamaAkunSub')[0] as HTMLFormElement).value = '';
                                    setSearchNamaSubledger('');
                                    const value: any = args.value;
                                    setSearchNoAkunSubledger(value);
                                }}
                            />
                        </div>
                        <div className="form-input mb-1" style={{ width: '275px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNamaAkunSub"
                                name="searchNamaAkunSub"
                                className="searchNamaAkunSub"
                                placeholder="<Nama Akun>"
                                showClearButton={true}
                                value={searchNamaAkun}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNoAkunSub')[0] as HTMLFormElement).value = '';
                                    setSearchNoAkunSubledger('');
                                    const value: any = args.value;
                                    setSearchNamaSubledger(value);
                                }}
                            />
                        </div>
                        <GridComponent
                            locale="id"
                            ref={(g: any) => (gridAkunSubledgerList = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'267'}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowSelecting={(args: any) => {
                                console.log(args.data);
                                setSelectedAkunSubledger(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                const selectedItems = args.rowData;
                                console.log(selectedItems);
                                setSelectedAkunSubledger(selectedItems);
                                setModalAkunSubledger(false);
                                const editedData = {
                                    ...gridDataJurnal.dataSource[indexDataJurnal],
                                    kode_subledger: selectedAkunSubledger.kode_subledger,
                                    subledger: selectedAkunSubledger.subledger,
                                    no_subledger: selectedAkunSubledger.no_subledger,
                                };
                                gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                gridDataJurnal.refresh();
                                setSearchNamaSubledger('');
                                setSearchNoAkunSubledger('');

                                setModalListDepartment(true);
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_subledger" headerText="No. Akun" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective
                                    field="nama_subledger"
                                    headerText="Keterangan"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="60"
                                    clipMode="EllipsisWithTooltip"
                                    // template={templateNamaAkun}
                                />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setModalAkunSubledger(false);
                                setSearchNoAkunSubledger('');
                                setSearchNamaSubledger('');
                            }}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                if (selectedAkunSubledger) {
                                    console.log(selectedAkunSubledger);
                                    setModalAkunSubledger(false);
                                    const editedData = {
                                        ...gridDataJurnal.dataSource[indexDataJurnal],
                                        kode_subledger: selectedAkunSubledger.kode_subledger,
                                        subledger: selectedAkunSubledger.subledger,
                                        no_subledger: selectedAkunSubledger.no_subledger,
                                    };
                                    gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                    gridDataJurnal.refresh();
                                    setModalListDepartment(true);
                                } else {
                                    myAlert(`Silahkan pilih akun terlebih dulu.`);
                                }
                            }}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL SUBLEDGER */}

                {/* MODAL NO KONTRAK UANG MUKA list_uangmuka_ju*/}
                {modalListUangMuka && (
                    <DialogComponent
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Uang Muka'}
                        visible={modalListUangMuka}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        enableResize={true}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="725"
                        height="450"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalListUangMuka(false);
                        }}
                        closeOnEscape={true}
                    >
                        <div>Jenis Vendor</div>
                        <GridComponent
                            locale="id"
                            ref={(g: any) => (gridListUangMuka = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'308'}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowSelecting={(args: any) => {
                                console.log(args.data);
                                setSelectedNoKontrakUM(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                const selectedItems = args.rowData;
                                console.log(selectedItems);
                                setSelectedAkunJurnal(selectedItems);
                                setModalListUangMuka(false);
                                const editedData = {
                                    ...gridDataJurnal.dataSource[indexDataJurnal],
                                    no_kontrak_um: selectedItems.no_kontrak,
                                };
                                gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                gridDataJurnal.refresh();
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_dokumen" headerText="No. Dokumen" headerTextAlign="Center" textAlign="Left" width="90" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="no_kontrak" headerText="No. Kontrak" headerTextAlign="Center" textAlign="Left" width="90" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="tgl_dokumen" headerText="Tgl. Dokumen" headerTextAlign="Center" textAlign="Left" width="40" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective
                                    format={'N2'}
                                    field="belum_dibayar_rp"
                                    headerText="Total Uang Muka"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="40"
                                    clipMode="EllipsisWithTooltip"
                                />
                                <ColumnDirective format={'N2'} field="sisa_rp" headerText="Sisa Uang Muka" headerTextAlign="Center" textAlign="Right" width="40" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setModalListUangMuka(false);
                            }}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                if (selectedNoKontrakUM) {
                                    console.log(selectedNoKontrakUM);
                                    setModalListUangMuka(false);
                                    const editedData = {
                                        ...gridDataJurnal.dataSource[indexDataJurnal],
                                        no_kontrak_um: selectedNoKontrakUM.no_kontrak,
                                    };
                                    gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                    gridDataJurnal.refresh();
                                } else {
                                    myAlert(`Silahkan pilih no kontrak terlebih dulu.`);
                                }
                            }}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL UM */}

                {/* MODAL NAMA KARYAWAN list_karyawan */}
                {modalListKaryawan && (
                    <DialogComponent
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Karyawan'}
                        visible={modalListKaryawan}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        enableResize={true}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="425"
                        height="450"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalListKaryawan(false);
                            setSearchNamaKaryawan('');
                        }}
                        closeOnEscape={true}
                    >
                        <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNoAkun"
                                name="searchNoAkun"
                                className="searchNoAkun"
                                placeholder="<Nama Karyawan>"
                                showClearButton={true}
                                value={searchNoAkun}
                                input={(args: FocusInEventArgs) => {
                                    const value: any = args.value;
                                    setSearchNamaKaryawan(value);
                                }}
                            />
                        </div>
                        <GridComponent
                            locale="id"
                            ref={(g: any) => (gridListKry = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'267'}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowSelecting={(args: any) => {
                                console.log(args.data);
                                setSelectedNamaKry(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                const selectedItems = args.rowData;
                                console.log(selectedItems);
                                setSelectedNamaKry(selectedItems);
                                setModalListKaryawan(false);
                                const editedData = {
                                    ...gridDataJurnal.dataSource[indexDataJurnal],
                                    kode_kry: selectedNamaKry.kode_kry,
                                    nama_kry: selectedNamaKry.nama_kry,
                                };
                                gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                gridDataJurnal.refresh();

                                setSearchNamaKaryawan('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="kode_hrm" headerText="Kode" headerTextAlign="Center" textAlign="Left" width="30" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_kry" headerText="Nama Karyawan" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="jabatan" headerText="Jabatan" headerTextAlign="Center" textAlign="Left" width="60" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setModalListKaryawan(false);
                                setSearchNamaKaryawan('');
                            }}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                if (selectedNamaKry) {
                                    setModalListKaryawan(false);
                                    const editedData = {
                                        ...gridDataJurnal.dataSource[indexDataJurnal],
                                        kode_kry: selectedNamaKry.kode_kry,
                                        nama_kry: selectedNamaKry.nama_kry,
                                    };
                                    gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                    gridDataJurnal.refresh();
                                } else {
                                    myAlert(`Silahkan pilih karyawan terlebih dulu.`);
                                }
                            }}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL KARYAWAN */}

                {/* MODAL CUSTOMER */}
                {modalCustRow && (
                    <DialogComponent
                        id="dialogDaftarCustomer"
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Customer'}
                        visible={modalCustRow}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="1200"
                        height="480"
                        enableResize={true}
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalCustRow(false);
                            setSearchNoCust('');
                            setSearchNamaCust('');
                            setSearchNamaSales('');
                        }}
                        closeOnEscape={true}
                    >
                        <div className="form-input mb-1 mr-1" style={{ width: '13%', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="noCust"
                                name="noCust"
                                className="noCust"
                                placeholder="<No. Cust>"
                                showClearButton={true}
                                value={searchNoCust}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('namaCust')[0] as HTMLFormElement).value = '';
                                    setSearchNamaCust('');
                                    (document.getElementsByName('namaSales')[0] as HTMLFormElement).value = '';
                                    setSearchNamaSales('');
                                    const value: any = args.value;
                                    setSearchNoCust(value);
                                }}
                            />
                        </div>
                        <div className="form-input mb-1 mr-1" style={{ width: '30%', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="namaCust"
                                name="namaCust"
                                className="namaCust"
                                placeholder="<Nama Customer>"
                                showClearButton={true}
                                value={searchNamaCust}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('noCust')[0] as HTMLFormElement).value = '';
                                    setSearchNoCust('');
                                    (document.getElementsByName('namaSales')[0] as HTMLFormElement).value = '';
                                    setSearchNamaSales('');
                                    const value: any = args.value;
                                    setSearchNamaCust(value);
                                }}
                            />
                        </div>

                        <div className="form-input mb-1" style={{ width: '55%', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="namaSales"
                                name="namaSales"
                                className="namaSales"
                                placeholder="<Nama Salesman>"
                                showClearButton={true}
                                value={searchNamaSales}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('namaCust')[0] as HTMLFormElement).value = '';
                                    setSearchNamaCust('');
                                    (document.getElementsByName('noCust')[0] as HTMLFormElement).value = '';
                                    setSearchNoCust('');
                                    const value: any = args.value;
                                    setSearchNamaSales(value);
                                }}
                            />
                        </div>

                        <GridComponent
                            id="gridDaftarCustomer"
                            locale="id"
                            ref={(g) => (gridCustList = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'265'}
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            rowSelecting={(args: any) => {
                                console.log(args.data);
                                setSelectedCust(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                console.log(args.rowData);
                                const selectedItems = args.rowData;
                                setSelectedCust(selectedItems);
                                setModalCustRow(false);
                                const editedData = {
                                    ...gridDataJurnal.dataSource[indexDataJurnal],
                                    kode_subledger: selectedItems.kode_cust,
                                    subledger: selectedItems.subledger,
                                    no_subledger: selectedItems.no_cust,
                                };
                                gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                gridDataJurnal.refresh();
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_relasi" headerText="Nama Customer" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="status_warna" headerText="Info Detail" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <div style={{ marginTop: 15 }} className="flex items-center justify-between">
                            <div className={stylesTtb['custom-box-wrapper']}>
                                <div className={stylesTtb['custom-box-aktif']}></div>
                                <div className={stylesTtb['box-text']}>Aktif</div>
                                <div className={stylesTtb['custom-box-non-aktif']}></div>
                                <div className={stylesTtb['box-text']}>Non Aktif</div>
                                <div className={stylesTtb['custom-box-bl']}></div>
                                <div className={stylesTtb['box-text']}>BlackList-G</div>
                                <div className={stylesTtb['custom-box-noo']}></div>
                                <div className={stylesTtb['box-text']}>New Open Outlet</div>
                                <div className={stylesTtb['custom-box-batal-noo']}></div>
                                <div className={stylesTtb['box-text']}>Batal NOO</div>
                                <div className={stylesTtb['custom-box-tidak-digarap']}></div>
                                <div className={stylesTtb['box-text']}>Tidak Digarap</div>
                            </div>
                        </div>
                        <div className="flex" style={{ justifyContent: 'flex-end', padding: 10, marginTop: -20 }}>
                            <ButtonComponent
                                id="buSimpanDokumen14"
                                content="Pilih"
                                cssClass="e-primary e-small"
                                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                                onClick={() => {
                                    if (selectedCust) {
                                        setModalCustRow(false);
                                        const editedData = {
                                            ...gridDataJurnal.dataSource[indexDataJurnal],
                                            kode_subledger: selectedCust.kode_cust,
                                            subledger: selectedCust.subledger,
                                            no_subledger: selectedCust.no_cust,
                                        };
                                        gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                        gridDataJurnal.refresh();
                                    } else {
                                        myAlert(`Silahkan pilih Customer terlebih dulu.`);
                                    }
                                }}
                            />
                            <ButtonComponent
                                id="buBatalDokumen1"
                                content="Batal"
                                cssClass="e-primary e-small"
                                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                                onClick={() => {
                                    setModalCustRow(false);
                                    setSearchNoCust('');
                                    setSearchNamaCust('');
                                    setSearchNamaSales('');
                                }}
                            />
                        </div>
                    </DialogComponent>
                )}
                {/* END MODAL CUSTOMER */}

                {/* MODAL DAFTAR SUPPLIER */}
                {modalSupplierRow && (
                    <DialogComponent
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Supplier'}
                        visible={modalSupplierRow}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        enableResize={true}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="420"
                        height="444"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalSupplierRow(false);
                            setSearchNoSupp('');
                            setSearchNamaSupp('');
                        }}
                        closeOnEscape={true}
                    >
                        <div className="form-input mb-1 mr-1" style={{ width: '120px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNoSupp"
                                name="searchNoSupp"
                                className="searchNoSupp"
                                placeholder="<No. Supplier>"
                                showClearButton={true}
                                value={searchNoSupp}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNamaSupp')[0] as HTMLFormElement).value = '';
                                    setSearchNamaSupp('');
                                    const value: any = args.value;
                                    setSearchNoSupp(value);
                                }}
                            />
                        </div>
                        <div className="form-input mb-1 mr-1" style={{ width: '250px', display: 'inline-block' }}>
                            <TextBoxComponent
                                id="searchNamaSupp"
                                name="searchNamaSupp"
                                className="searchNamaSupp"
                                placeholder="<Nama>"
                                showClearButton={true}
                                value={searchNamaSupp}
                                input={(args: FocusInEventArgs) => {
                                    (document.getElementsByName('searchNoSupp')[0] as HTMLFormElement).value = '';
                                    setSearchNoSupp('');
                                    const value: any = args.value;
                                    setSearchNamaSupp(value);
                                }}
                            />
                        </div>

                        <GridComponent
                            locale="id"
                            style={{ width: '100%', height: '78%' }}
                            ref={(g) => (gridSupplierList = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'286'}
                            rowSelecting={(args: any) => {
                                console.log(args.data);
                                setSelectedSupplier(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                const selectedItems = args.rowData;
                                setSelectedSupplier(selectedItems);
                                setModalSupplierRow(false);
                                const editedData = {
                                    ...gridDataJurnal.dataSource[indexDataJurnal],
                                    kode_subledger: selectedItems.kode_supp,
                                    subledger: selectedItems.subledger,
                                    no_subledger: selectedItems.no_supp,
                                };
                                gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                gridDataJurnal.refresh();
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="no_supp" headerText="No. Supplier" headerTextAlign="Center" textAlign="Left" width="95" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Left" width="40" clipMode="EllipsisWithTooltip" />
                                <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="280" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            // iconCss="e-icons e-small e-close"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                setModalSupplierRow(false);
                                setSearchNoSupp('');
                                setSearchNamaSupp('');
                            }}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen15"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            // iconCss="e-icons e-small e-save"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                            onClick={() => {
                                if (selectedSupplier) {
                                    setModalSupplierRow(false);
                                    const editedData = {
                                        ...gridDataJurnal.dataSource[indexDataJurnal],
                                        kode_subledger: selectedSupplier.kode_supp,
                                        subledger: selectedSupplier.subledger,
                                        no_subledger: selectedSupplier.no_supp,
                                    };
                                    gridDataJurnal.dataSource[indexDataJurnal] = editedData;
                                    gridDataJurnal.refresh();
                                } else {
                                    myAlert('Silahkan pilih Supplier terlebih dulu');
                                }
                            }}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL SUUPLIER */}

                {/* MODAL LIST DEPARTMEN */}
                {modalListDepartment && (
                    <DialogComponent
                        target="#dialogJUList"
                        style={{ position: 'fixed' }}
                        header={'Daftar Departmen'}
                        visible={modalListDepartment}
                        isModal={true}
                        animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                        allowDragging={true}
                        showCloseIcon={true}
                        width="300"
                        height="400"
                        position={{ X: 'center', Y: 'center' }}
                        close={() => {
                            setModalListDepartment(false);
                            setSearchNamaDepartment('');

                            const cariNamaDepartment = document.getElementById('cariNamaDepartment') as HTMLInputElement;
                            if (cariNamaDepartment) {
                                cariNamaDepartment.value = '';
                            }
                        }}
                        closeOnEscape={true}
                    >
                        <div className="flex">
                            <div className="form-input mb-1 mr-1" style={{ display: 'inline-block' }}>
                                <TextBoxComponent
                                    id="cariNamaDepartment"
                                    className="searchtext"
                                    placeholder="Cari Nama Departmen"
                                    showClearButton={true}
                                    input={(args: ChangeEventArgsInput) => {
                                        const value: any = args.value;
                                        PencarianNamaDepartment(value, setSearchNamaDepartment, setFilteredDataDepartment, listDepartemen);
                                    }}
                                    floatLabelType="Never"
                                />
                            </div>
                        </div>
                        <GridComponent
                            id="dialogListDepartmen"
                            locale="id"
                            style={{ width: '100%', height: '75%' }}
                            dataSource={searchNamaDepartment !== '' ? filteredDataDepartment : listDepartemen}
                            // ref={(g) => (gridDepartmentList = g)}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            rowHeight={22}
                            width={'100%'}
                            height={'220'}
                            rowSelecting={(args: any) => {
                                setSelectedDepartment(args.data);
                            }}
                            recordDoubleClick={(args: any) => {
                                handlePilihDepartment();
                                setSearchNamaDepartment('');
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="nama_dept" headerText="" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                            </ColumnsDirective>
                            <Inject services={[Selection]} />
                        </GridComponent>
                        <ButtonComponent
                            id="buBatalDokumen1"
                            content="Batal"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, backgroundColor: '#3b3f5c' }}
                            onClick={() => setModalListDepartment(false)}
                        />
                        <ButtonComponent
                            id="buSimpanDokumen1"
                            content="Pilih"
                            cssClass="e-primary e-small"
                            style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 5, backgroundColor: '#3b3f5c' }}
                            onClick={() => handlePilihDepartment()}
                        />
                    </DialogComponent>
                )}
                {/* END MODAL LIST DEPARTMEN */}

                {/* DIALOG PROGRESS BAR */}
                <GlobalProgressBar />
                {/* END DIALOG PROGRESS BAR */}
            </div>
        </DialogComponent>
    );
};

export default ModalJurnalUmum;
