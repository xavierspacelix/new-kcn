import * as React from 'react';
import { ButtonComponent, CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import 'flatpickr/dist/flatpickr.css';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
import idIDLocalization from 'public/syncfusion/locale.json';
import { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import styles from '../daftarRelasi.module.css';
import moment from 'moment';
import { useRouter } from 'next/router';
L10n.load(idIDLocalization);
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
enableRipple(true);
interface dialogRelasiProps {
    token: any;
    userid: any;
    kode_entitas: any;
    masterKodeRelasi: any;
    masterDataState: any;
    isOpen: boolean;
    onClose: any;
    onRefresh?: any;
    target?: string;
}

interface ProvinsiStateAPI {
    nama_propinsi: string;
}
interface KotaStateAPI {
    nama_propinsi: string;
    nama_kota: string;
}
interface KecamatanStateAPI {
    nama_kecamatan: string;
}
interface KelurahanStateAPI {
    nama_kecamatan: string;
    nama_kelurahan: string;
    nama_kodepos: string;
}

interface DetailRelasi {
    kode_relasi: string;
    id_relasi: string;
    nama_lengkap: string;
    nama_person: string;
    jab: string;
    hubungan: string;
    bisnis: string;
    bisnis2: string;
    telp: string;
    hp: string;
    hp2: string;
    fax: string;
    email: string;
    catatan: string;
    file_kuasa: string;
    file_ktp: string;
    file_ttd: string;
    aktif_kontak: string;
}
const DialogRelasi: React.FC<dialogRelasiProps> = ({ userid, kode_entitas, masterKodeRelasi, masterDataState, isOpen, onClose, onRefresh, token, target }: dialogRelasiProps) => {
    // Base URL API Data
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const router = useRouter();
    const { norelasi, isRedirectFromSupp, masterState, nomor_supplier } = router.query;
    const [masterKeterangan, setMasterKeterangan] = useState<any>(null);

    const [provinsiList, setProvinsiList] = useState<ProvinsiStateAPI[]>([]);
    const [kotaList, setKotaList] = useState<KotaStateAPI[]>([]);
    const [kecamatanList, setKecamatanList] = useState<KecamatanStateAPI[]>([]);
    const [kelurahanList, setKelurahanList] = useState<KelurahanStateAPI[]>([]);
    let gridDetailRelasi: Grid | any;
    const [stateBrowse, setStateBrowse] = useState<boolean>(true);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const tabId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('tabId') || '' : '';

    //======================= State Data Master ====================
    const [masterData, setMasterData] = useState({
        entitas: kode_entitas,
        kode_relasi: '',
        tipe: '',
        nama_relasi: '',
        alamat: '',
        alamat2: '',
        kota: '',
        propinsi: '',
        kodepos: '',
        negara: '',
        telp: '',
        telp2: '',
        hp: '',
        hp2: '',
        fax: '',
        email: '',
        website: '',
        npwp: '',
        siup: '',
        personal: '',
        ktp: '',
        sim: '',
        tgl_relasi: moment.Moment,
        catatan: '',
        userid: userid,
        tgl_update: moment.Moment,
        kecamatan: '',
        kelurahan: '',
    });
    const [kontakRelasiForm, setKontakRelasiForm] = useState<DetailRelasi[]>([]);

    // Loading data indicator
    const [showLoader, setShowLoader] = useState(true);
    const closeDialogRelasi = () => {
        console.log('BATAL CLICKED');

        if (norelasi) {
            const targetUrl = '/kcn/ERP/master/supplier/supplier';
            const queryParams = {
                tabId: tabId,
                norelasi: norelasi,
                masterState: masterState,
                nomor_supplier: nomor_supplier ? nomor_supplier : '',
            };
            return router.push({
                pathname: targetUrl,
                query: queryParams,
            });
        } else if (isRedirectFromSupp) {
            const targetUrl = '/kcn/ERP/master/supplier/supplier';
            const queryParams = {
                isRedirectFromSupp: isRedirectFromSupp,
            };
            return router.push({
                pathname: targetUrl,
                query: queryParams,
            });
        }
        onClose();
        setTimeout(() => {
            if (onRefresh) {
                onRefresh();
            }
        }, 100);
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
    const convertDateToString = (date: Date) => {
        // Konversi tanggal ke string dengan format YYYY-MM-DD HH:mm:ss
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };
    const postingInputData = async (data: any) => {
        let jsonSave: any;
        if (masterDataState == 'BARU') {
            jsonSave = {
                entitas: kode_entitas,
                tipe: masterData.tipe,
                nama_relasi: masterData.nama_relasi,
                alamat: masterData.alamat,
                alamat2: masterData.alamat2,
                kota: masterData.kota,
                propinsi: masterData.propinsi,
                kodepos: masterData.kodepos,
                negara: masterData.negara,
                telp: masterData.telp,
                telp2: masterData.telp2,
                hp: masterData.hp,
                hp2: masterData.hp2,
                fax: masterData.fax,
                email: masterData.email,
                website: masterData.website,
                npwp: masterData.npwp,
                siup: masterData.siup,
                personal: masterData.personal,
                ktp: masterData.ktp,
                sim: masterData.sim,
                tgl_relasi: masterData.tgl_relasi,
                catatan: masterData.catatan,
                userid: userid,
                tgl_update: masterData.tgl_update,
                kecamatan: masterData.kecamatan,
                kelurahan: masterData.kelurahan,
                detail: kontakRelasiForm?.json,
            };

            const response = await axios.post(`${apiUrl}/erp/simpan_relasi`, jsonSave);
            const result = response.data;
            const status = result.status;
            const errormsg = result.serverMessage;
            if (status === true) {
                withReactContent(swalToast).fire({
                    title: ``,
                    html: '<p style="font-size:12px">Data Relasi Baru berhasil disimpan</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 1500,
                    target: target ?? '#main-target',
                });
                if (norelasi) {
                    const targetUrl = '/kcn/ERP/master/supplier/supplier';
                    const queryParams = {
                        tabId: tabId,
                        norelasi: norelasi,
                        masterState: masterState,
                        nomor_supplier: nomor_supplier ? nomor_supplier : '',
                    };
                    return router.push({
                        pathname: targetUrl,
                        query: queryParams,
                    });
                } else if (isRedirectFromSupp) {
                    const targetUrl = '/kcn/ERP/master/supplier/supplier';
                    const queryParams = {
                        isRedirectFromSupp: isRedirectFromSupp,
                    };
                    return router.push({
                        pathname: targetUrl,
                        query: queryParams,
                    });
                }
                closeDialogRelasi();
                setDialogKontakRelasiVisible(false);
            } else {
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px">' + errormsg + '</p>',
                    width: '100%',
                    target: '#DialogRelasi',
                });
            }
        } else if (masterDataState == 'EDIT') {
            jsonSave = {
                entitas: kode_entitas,
                kode_relasi: masterData.kode_relasi,
                tipe: masterData.tipe,
                nama_relasi: masterData.nama_relasi,
                alamat: masterData.alamat,
                alamat2: masterData.alamat2,
                kota: masterData.kota,
                propinsi: masterData.propinsi,
                kodepos: masterData.kodepos,
                negara: masterData.negara,
                telp: masterData.telp,
                telp2: masterData.telp2,
                hp: masterData.hp,
                hp2: masterData.hp2,
                fax: masterData.fax,
                email: masterData.email,
                website: masterData.website,
                npwp: masterData.npwp,
                siup: masterData.siup,
                personal: masterData.personal,
                ktp: masterData.ktp,
                sim: masterData.sim,
                tgl_relasi: masterData.tgl_relasi,
                catatan: masterData.catatan,
                userid: masterData.userid,
                tgl_update: masterData.tgl_update,
                kecamatan: masterData.kecamatan,
                kelurahan: masterData.kelurahan,
                detail: kontakRelasiForm,
            };
            // console.log(masterData.tgl_relasi);
            const response = await axios.patch(`${apiUrl}/erp/update_relasi`, jsonSave);
            const result = response.data;
            const status = result.status;
            const errormsg = result.serverMessage;
            if (status === true) {
                withReactContent(swalToast).fire({
                    title: ``,
                    html: '<p style="font-size:12px">Data Relasi berhasil disimpan</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 1500,
                    target: target ?? '#main-target',
                });
                if (norelasi) {
                    const targetUrl = '/kcn/ERP/master/supplier/supplier';
                    const queryParams = {
                        tabId: tabId,
                        norelasi: norelasi,
                        masterState: masterState,
                        nomor_supplier: nomor_supplier ? nomor_supplier : '',
                    };
                    return router.push({
                        pathname: targetUrl,
                        query: queryParams,
                    });
                } else if (isRedirectFromSupp) {
                    const targetUrl = '/kcn/ERP/master/supplier/supplier';
                    const queryParams = {
                        isRedirectFromSupp: isRedirectFromSupp,
                    };
                    return router.push({
                        pathname: targetUrl,
                        query: queryParams,
                    });
                }
                closeDialogRelasi();
            } else {
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px">' + errormsg + '</p>',
                    width: '100%',
                    target: '#dialogKontakRelasi',
                });
            }
        }
    };
    const simpanData = async (data: any) => {
        if (!masterData.nama_relasi) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: 'Perusahaan Belum Diisi',
                width: '100%',
                target: '#DialogRelasi',
            });
        } else if (!masterData.alamat) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: 'Alamat Belum Diisi',
                width: '100%',
                target: '#DialogRelasi',
            });
        } else if (!masterData.kodepos) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: 'Kode Pos Belum Diisi',
                width: '100%',
                target: '#DialogRelasi',
            });
        } else if (!masterData.kota) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: 'Kota Belum Diisi',
                width: '100%',
                target: '#DialogRelasi',
            });
        } else if (!masterData.telp) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: 'Telepon Belum Diisi',
                width: '100%',
                target: '#DialogRelasi',
            });
        } else if (!masterData.personal) {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: 'Personal Belum Diisi',
                width: '100%',
                target: '#DialogRelasi',
            });
        } else {
            await postingInputData(data);
        }
    };
    useEffect(() => {
        const refreshDatasource = async () => {
            setShowLoader(true);
            if (masterDataState == 'BARU') {
                setMasterData({
                    entitas: kode_entitas,
                    kode_relasi: '',
                    tipe: '',
                    nama_relasi: '',
                    alamat: '',
                    alamat2: '',
                    kota: '',
                    propinsi: '',
                    kodepos: '',
                    negara: '',
                    telp: '',
                    telp2: '',
                    hp: '',
                    hp2: '',
                    fax: '',
                    email: '',
                    website: '',
                    npwp: '',
                    siup: '',
                    personal: '',
                    ktp: '',
                    sim: '',
                    tgl_relasi: new Date(),
                    catatan: '',
                    userid: '',
                    tgl_update: new Date(),
                    kecamatan: '',
                    kelurahan: '',
                });
                setKontakRelasiForm({
                    kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
                    id_relasi: '',
                    nama_lengkap: '',
                    nama_person: '',
                    jab: '',
                    hubungan: '',
                    bisnis: '',
                    bisnis2: '',
                    telp: '',
                    hp: '',
                    hp2: '',
                    fax: '',
                    email: '',
                    catatan: '',
                    file_kuasa: '',
                    file_ktp: '',
                    file_ttd: '',
                    aktif_kontak: 'Y',
                });
            }

            if (masterDataState == 'EDIT') {
                const responseHeader = await axios.get(`${apiUrl}/erp/master_daftar_relasi?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: masterKodeRelasi,
                        param2: 'all',
                        param3: 'all',
                        paramLimit: 1,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseDataHeader = responseHeader.data.data[0];
                setMasterData(responseDataHeader);

                const responseDetail = await axios.get(`${apiUrl}/erp/detail_daftar_relasi?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: masterKodeRelasi,
                    },
                });

                const responseDataDetail = responseDetail.data.data;
                setKontakRelasiForm(responseDataDetail);

                // Menunggu beberapa saat sebelum mengeksekusi kode selanjutnya
                setTimeout(() => {
                    // Kode selanjutnya setelah pengaturan data selesai
                    setShowLoader(false);
                }, 300);
            } else {
                setShowLoader(false);
            }
        };
        refreshDatasource();
    }, [masterKodeRelasi, masterDataState]);

    let tabDialogRelasi: Tab | any;
    let buttonInputData: ButtonPropsModel[];
    buttonInputData = [
        {
            buttonModel: {
                content: 'Tutup',
                cssClass: 'e-danger e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: closeDialogRelasi,
        },
    ];
    //======= Disable hari minggu di calendar ========
    function onRenderDayCell(args: RenderDayCellEventArgs): void {
        if ((args.date as Date).getDay() === 0) {
            args.isDisabled = true;
        }
    }
    const apiTipeRelasi = [
        {
            tipe: 'Perorangan',
        },
        {
            tipe: 'Badan Hukum',
        },
    ];
    let textareaObj: any;
    function onCreateMultiline(): void {
        textareaObj.addAttributes({ rows: 1 });
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = '60px'; //textareaObj.respectiveElement.scrollHeight + 'px';
    }
    function onInputMultiline(args: FocusInEventArgs): void {
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = Math.max(textareaObj.respectiveElement.scrollHeight, 60) + 'px';

        const value: any = args.value;
        setMasterKeterangan(value);
    }

    let setFocus: any;

    // UseEffect untuk data Wilayah
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data Provinsi jika daftarnya masih kosong
                if (provinsiList.length === 0) {
                    const responseProvinsi = await fetch(
                        `${apiUrl}/erp/list_wilayah_daftar_relasi?` +
                            new URLSearchParams({
                                entitas: kode_entitas,
                                param1: 'provinsi',
                            })
                    );
                    const dataProvinsi = await responseProvinsi.json();
                    setProvinsiList(dataProvinsi.data);
                }

                // Fetch data Kota jika daftarnya masih kosong
                if (kotaList.length === 0) {
                    const responseKota = await fetch(
                        `${apiUrl}/erp/list_wilayah_daftar_relasi?` +
                            new URLSearchParams({
                                entitas: kode_entitas,
                                param1: 'kota',
                            })
                    );
                    const dataKota = await responseKota.json();
                    setKotaList(dataKota.data);
                }

                // Fetch data Kecamatan jika daftarnya masih kosong
                if (kecamatanList.length === 0) {
                    const responseKecamatan = await fetch(
                        `${apiUrl}/erp/list_wilayah_daftar_relasi?` +
                            new URLSearchParams({
                                entitas: kode_entitas,
                                param1: 'kecamatan',
                            })
                    );
                    const dataKecamatan = await responseKecamatan.json();
                    setKecamatanList(dataKecamatan.data);
                }

                // Fetch data Kelurahan jika daftarnya masih kosong
                if (kelurahanList.length === 0) {
                    const responseKelurahan = await fetch(
                        `${apiUrl}/erp/list_wilayah_daftar_relasi?` +
                            new URLSearchParams({
                                entitas: kode_entitas,
                                param1: 'kelurahan',
                            })
                    );
                    const dataKelurahan = await responseKelurahan.json();
                    setKelurahanList(dataKelurahan.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [masterKodeRelasi]); // Empty dependency array to run only once when component mounts
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setMasterData({
            ...masterData,
            [name]: value,
        });
    };

    const rowDataBoundDetailRelasi = (args: any) => {
        if (args.row) {
            if (getValue('kode_relasi', args.data) == 'ADDROW') {
                args.row.style.background = '#F2FDF8';
            } else {
                args.row.style.background = '#ffffff';
            }
        }
    };

    //============= Format cell pada grid Detail Barang =============
    const queryCellInfoDetailRelasi = (args: any) => {
        if ((args.column?.field === 'fpp_btg' || args.column?.field === 'fpp_harga_btg' || args.column?.field === 'berat') && !args.column?.isSelected) {
            args.cell.style.color = '#B6B5B5';
        }
    };
    //======= Fungsi menampilkan window/tab baru tanpa kena blok di Browser ========
    const [TotalRelasi, setTotalRelasi] = useState(0);
    const [TotalRecords, setTotalRecords] = useState(0);

    const [idRelasi, setIdRelasi] = useState(0);
    const [rowIdxDetailBarang, setRowIdxDetailBarang] = useState(0);
    let dialogKontakRelasi: Dialog | any;
    const [dialogKontakRelasiVisible, setDialogKontakRelasiVisible] = useState(false);
    const addDetailRelasi = async () => {
        setEditModeDetail(false);
        setSelectedListData({
            kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
            id_relasi: '',
            nama_lengkap: '',
            nama_person: '',
            jab: '',
            hubungan: '',
            bisnis: '',
            bisnis2: '',
            telp: '',
            hp: '',
            hp2: '',
            fax: '',
            email: '',
            catatan: '',
            file_kuasa: '',
            file_ktp: '',
            file_ttd: '',
            aktif_kontak: 'Y',
        });
        setDialogKontakRelasiVisible(true);
    };
    useEffect(() => {
        if (masterDataState === 'BARU') {
            setSelectedListData({
                kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
                id_relasi: '',
                nama_lengkap: '',
                nama_person: '',
                jab: '',
                hubungan: '',
                bisnis: '',
                bisnis2: '',
                telp: '',
                hp: '',
                hp2: '',
                fax: '',
                email: '',
                catatan: '',
                file_kuasa: '',
                file_ktp: '',
                file_ttd: '',
                aktif_kontak: 'Y',
            });
        }
    }, [masterDataState]);

    const [inputValue, setInputValue] = useState({
        kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
        id_relasi: '',
        nama_lengkap: '',
        nama_person: '',
        jab: '',
        hubungan: '',
        bisnis: '',
        bisnis2: '',
        telp: '',
        hp: '',
        hp2: '',
        fax: '',
        email: '',
        catatan: '',
        file_kuasa: '',
        file_ktp: '',
        file_ttd: '',
        aktif_kontak: 'Y',
    });

    const handleInputChange = (event: any) => {
        const target = event.target || event.currentTarget;
        const { name, type, checked, value } = target;
        const newValue = type === 'checkbox' ? (checked ? 'N' : 'Y') : value;
        setInputValue({ ...inputValue, [name]: newValue });
    };
    const [editModeDetail, setEditModeDetail] = useState(false);
    let totalLine = kontakRelasiForm.length;

    if (masterDataState === 'BARU') {
        totalLine = 0;
    }

    let buttonKontakRelasi: ButtonPropsModel[];
    buttonKontakRelasi = [
        {
            buttonModel: {
                content: 'Simpan',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                if (!editModeDetail) {
                    console.log('masuk sini');

                    const id = idRelasi + totalLine + 1;

                    const newObject = {
                        ...inputValue,
                        id_relasi: totalLine + 1,
                    };

                    // Kosongkan nil''ai input setelah ditambahkan ke dalam array
                    setInputValue({
                        kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
                        id_relasi: '',
                        nama_lengkap: '',
                        nama_person: '',
                        jab: '',
                        hubungan: '',
                        bisnis: '',
                        bisnis2: '',
                        telp: '',
                        hp: '',
                        hp2: '',
                        fax: '',
                        email: '',
                        catatan: '',
                        file_kuasa: '',
                        file_ktp: '',
                        file_ttd: '',
                        aktif_kontak: 'Y',
                    });
                    // kontakRelasiForm.push(newObject);
                    gridDetailRelasi.addRecord(newObject);
                    // kontakRelasiForm.push(newObject);
                    setRowIdxDetailBarang(id);
                    setDialogKontakRelasiVisible(false);
                } else {
                    console.log('masuksini');

                    const rowIndex = gridDetailRelasi.getSelectedRowIndexes();
                    const existingData = gridDetailRelasi.properties.dataSource;
                    const updatedArray = (existingData[rowIndex] = {
                        ...inputValue,
                    });
                    console.log(updatedArray);

                    kontakRelasiForm[rowIndex] = {
                        ...updatedArray,
                    };
                    console.log(kontakRelasiForm[rowIndex]);
                    gridDetailRelasi.refresh();
                    setDialogKontakRelasiVisible(false);
                    setInputValue({
                        kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
                        id_relasi: '',
                        nama_lengkap: '',
                        nama_person: '',
                        jab: '',
                        hubungan: '',
                        bisnis: '',
                        bisnis2: '',
                        telp: '',
                        hp: '',
                        hp2: '',
                        fax: '',
                        email: '',
                        catatan: '',
                        file_kuasa: '',
                        file_ktp: '',
                        file_ttd: '',
                        aktif_kontak: 'Y',
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                //iconCss: 'e-icons e-close',
                cssClass: 'e-danger e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                setEditModeDetail(false);

                setDialogKontakRelasiVisible(false);
                setInputValue({
                    kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
                    id_relasi: '',
                    nama_lengkap: '',
                    nama_person: '',
                    jab: '',
                    hubungan: '',
                    bisnis: '',
                    bisnis2: '',
                    telp: '',
                    hp: '',
                    hp2: '',
                    fax: '',
                    email: '',
                    catatan: '',
                    file_kuasa: '',
                    file_ktp: '',
                    file_ttd: '',
                    aktif_kontak: 'Y',
                });
            },
        },
    ];

    const [isAktifKontakChecked, setIsAktifKontakChecked] = useState<boolean>(false);
    const [selectedListData, setSelectedListData] = useState({
        kode_relasi: masterDataState == 'BARU' ? '' : masterData.kode_relasi,
        id_relasi: '',
        nama_lengkap: '',
        nama_person: '',
        jab: '',
        hubungan: '',
        bisnis: '',
        bisnis2: '',
        telp: '',
        hp: '',
        hp2: '',
        fax: '',
        email: '',
        catatan: '',
        file_kuasa: '',
        file_ktp: '',
        file_ttd: '',
        aktif_kontak: 'Y',
    }); // State untuk data terpilih dari grid

    const showEditRecord = () => {
        setEditModeDetail(true);
        const selectedData = gridDetailRelasi.getSelectedRecords();

        if (selectedData.length > 0 && masterDataState === 'EDIT' && masterKodeRelasi === selectedData[0].kode_relasi) {
            setSelectedListData(selectedData);
            setInputValue(selectedData[0]);
            setDialogKontakRelasiVisible(true);
        } else {
            withReactContent(swalDialog).fire({
                title: 'Pilih Data Detail yang Akan di Update!',
                icon: 'info',
                target: '#DialogRelasi',
                width: '350px',
            });
        }
    };

    const hubunganKepemilikanArray = [
        {
            name: 'Anggota Keluarga Pemilik',
        },
        {
            name: 'Manager Keuangan',
        },
        {
            name: 'Manager Pembelian',
        },
        {
            name: 'Admin Keuangan',
        },
        {
            name: 'Admin Pembelian',
        },
        {
            name: 'karyawan Toko',
        },
        {
            name: 'Lainnya',
        },
    ];
    const jabatanArray = [
        {
            name: 'Pemilik',
        },
        {
            name: 'Suami / Istri Pemilik',
        },
        {
            name: 'Anak Pemilik',
        },
        {
            name: 'Orang Tua Pemilik',
        },
        {
            name: 'Saudara Lain',
        },
        {
            name: 'Orang Lain (Tidak Memiliki Hub dengan Pemilik',
        },
        {
            name: 'Lainnya',
        },
    ];
    // const editOptions = {
    //     allowAdding: true,
    //     allowDeleting: true,
    //     allowEditing: true,
    //     mode: 'Dialog',
    //     template: showEditRecord,
    // };
    return (
        <>
            <div>
                {/* prettier-ignore */}
                <DialogComponent
                    id="DialogRelasi"
                    name="DialogRelasi"
                    className="DialogRelasi"
                    target={target ?? '#main-target'}
                    header={() => {
                        let header: string = '';
                        if (masterDataState == 'BARU') {
                            header = 'Daftar Relasi Baru';
                        } else if (masterDataState == 'EDIT') {
                            header = 'Edit Relasi';
                        }
                        return header;
                    }}
                    visible={isOpen}
                    isModal={true}
                    animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                    enableResize={true}
                    resizeHandles={['All']}
                    allowDragging={true}
                    //showCloseIcon={true}
                    width="80%" //"70%"
                    height="100%"
                    position={{ X: 'center', Y: 'center' }}
                    style={{ position: 'fixed' }}
                    buttons={buttonInputData}
                    close={() => {
                        closeDialogRelasi;
                    }}
                    closeOnEscape={false}
                    open={(args: any) => {
                        args.preventFocus = true;
                    }}
                >
                    <div style={{ minWidth: '430px', overflow: 'auto' }}>
                        <div>
                            {/* screen loader  */}
                            {/* {showLoader && contentLoader()} */}
                            <div>
                                {/* ===============  Master Header Data ========================   */}
                                <div className="mb-1">
                                    <div className="panel-tabel">
                                        <table className={styles.table} style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '110px' }}>No. Register</th>
                                                    <th style={{ width: '150px' }}>Tipe Relasi</th>
                                                    <th style={{ width: '150px' }}>Tanggal</th>
                                                    <th style={{ width: '300px' }}>Perusahaan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <TextBoxComponent placeholder="No. Register" value={masterData.kode_relasi} readonly={true} />
                                                    </td>
                                                    <td>
                                                        <div className="flex">
                                                        <select
                                                                value={masterData.tipe || ''} // Menetapkan nilai default
                                                                name="tipe"
                                                                onChange={handleChange}
                                                                className="block w-full text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"

                                                            >
                                                                <option value="" disabled selected={!masterData.tipe}>
                                                                    {masterData.tipe === null
                                                                        ? '-- Belum Memilih Tipe --'
                                                                        : '-- Pilih Tipe --'}
                                                                </option>
                                                                {apiTipeRelasi.map((tipe, index) => (
                                                                    <option value={tipe.tipe} key={tipe.tipe + index+1}>
                                                                        {tipe.tipe}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <DatePickerComponent
                                                            locale="id"
                                                            // cssClass="e-custom-style"
                                                            renderDayCell={onRenderDayCell}
                                                            placeholder="Tgl. Relasi"
                                                            enableMask={true}
                                                            maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                            showClearButton={false}
                                                            format="dd-MM-yyyy"
                                                            value={masterData.tgl_relasi}
                                                            change={(args: ChangeEventArgsCalendar) => {
                                                                if (args.value) {
                                                                    
                                                                    setMasterData({
                                                                        ...masterData,
                                                                        tgl_relasi: moment(args.value).format('YYYY-MM-DD HH:mm:ss'),
                                                                        tgl_update: moment(args.value).format('YYYY-MM-DD HH:mm:ss'),
                                                                    });
                                                                } else {
                                                                    setMasterData({
                                                                        ...masterData,
                                                                        tgl_relasi: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                                        tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                                    });
                                                                }
                                                            }}
                                                            readonly={masterDataState == 'EDIT'}
                                                        >
                                                            <Inject services={[MaskedDateTime]} />
                                                        </DatePickerComponent>
                                                    </td>
                                                    <td>
                                                        <TextBoxComponent
                                                            id="searchNamaItem"
                                                            name="nama_relasi"
                                                            className="nama_relasi"
                                                            placeholder="<Nama Perusahaan>"
                                                            showClearButton={true}
                                                            value={masterData.nama_relasi}
                                                            input={(args: FocusInEventArgs) => {
                                                                const value: any = args.value;
                                                                setMasterData({
                                                                    ...masterData,
                                                                    nama_relasi: value,
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* ===============  Detail Data ========================   */}
                                <div className="panel-tab" style={{ background: '#fff', width: '100%', height: 'auto' }}>
                                    <TabComponent
                                        ref={(t) => (tabDialogRelasi = t)}
                                        selectedItem={0}
                                        animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                                        height="100%"
                                    >
                                        <div className="e-tab-header">
                                            <div tabIndex={0}>Informasi</div>
                                            <div tabIndex={1}>Kontak</div>
                                        </div>
                                        {/*===================== Content menampilkan data barang =======================*/}
                                        <div className="e-content">
                                            <div style={{ width: 'auto', height: 'auto', marginTop: '5px' }} className="p-4">
                                                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="propinsi"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Provinsi
                                                            </label>
                                                            <select
                                                                value={masterData.propinsi || ''} // Menetapkan nilai default
                                                                name="propinsi"
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            >
                                                                <option value="" disabled selected={!masterData.propinsi}>
                                                                    {masterData.propinsi === null
                                                                        ? '-- Belum Memilih Provinsi --'
                                                                        : '-- Pilih Provinsi --'}
                                                                </option>
                                                                {/* Menghapus atribut 'selected' */}
                                                                {provinsiList.map((propinsi, index) => (
                                                                    <option key={propinsi.nama_propinsi  + index+1} value={propinsi.nama_propinsi}>
                                                                        {propinsi.nama_propinsi}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="kota"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Kota
                                                            </label>
                                                            <select
                                                                value={masterData.kota || ''} // Menetapkan nilai default
                                                                name="kota"
                                                                onChange={handleChange}
                                                                className=" block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            >
                                                                <option value="" disabled selected={!masterData.kota}>
                                                                    {masterData.kota === null ? '-- Belum Memilih Kota --' : '-- Pilih Kota --'}
                                                                </option>
                                                                {kotaList.map((kota,index) => (
                                                                    <option key={kota.nama_kota+ index+1} value={kota.nama_kota}>
                                                                        {kota.nama_kota}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="kecamatan"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Kecamatan
                                                            </label>
                                                            <select
                                                                value={masterData.kecamatan || ''} // Menetapkan nilai default
                                                                name="kecamatan"
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            >
                                                                <option value="" disabled selected={!masterData.kecamatan}>
                                                                    {masterData.kecamatan === null
                                                                        ? '-- Belum Memilih Kecamatan --'
                                                                        : '-- Pilih Kecamatan --'}
                                                                </option>
                                                                {kecamatanList.map((kecamatan,index) => (
                                                                    <option value={kecamatan.nama_kecamatan} key={kecamatan.nama_kecamatan, + index+1}>
                                                                        {kecamatan.nama_kecamatan}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="kelurahan"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Kelurahan
                                                            </label>
                                                            <select
                                                                value={masterData.kelurahan || ''} // Menetapkan nilai default atau string kosong jika null
                                                                name="kelurahan"
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            >
                                                                <option value="" disabled selected={!masterData.kelurahan}>
                                                                    {masterData.kelurahan === null
                                                                        ? '-- Belum Memilih Kelurahan --'
                                                                        : '-- Pilih Kelurahan --'}
                                                                </option>
                                                                {kelurahanList.map((kelurahan, index) => (
                                                                    <option value={kelurahan.nama_kelurahan} key={kelurahan.nama_kelurahan+ index+1}>
                                                                        {kelurahan.nama_kelurahan}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="kode_pos"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Kode Pos
                                                            </label>
                                                            <input
                                                                value={masterData.kodepos || ''} // Menetapkan nilai default atau string kosong jika null
                                                                name="kodepos"
                                                                onChange={handleChange}
                                                                type="number"
                                                                id="kode_pos"
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 401513"
                                                                
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="negara"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Negara
                                                            </label>
                                                            <select
                                                                value={masterData.negara || ''} // Menetapkan nilai default atau string kosong jika null
                                                                name="negara"
                                                                onChange={handleChange}
                                                                id="negara"
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            >
                                                                <option selected disabled>
                                                                    --Pilih Negara--
                                                                </option>
                                                                <option value="Indonesia">Indonesia</option>
                                                            </select>
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="no_npwp"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                No. NPWP
                                                            </label>
                                                            <input
                                                                name="npwp"
                                                                value={masterData.npwp || ''}
                                                                onChange={handleChange}
                                                                type="number"
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="no_siup"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                No. SIUP
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="siup"
                                                                id="no_siup"
                                                                value={masterData.siup || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                                        <div className="sm:col-span-2 ">
                                                            <label
                                                                htmlFor="personal"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Personal
                                                            </label>
                                                            <input
                                                                name="personal"
                                                                value={masterData.personal || ''}
                                                                onChange={handleChange}
                                                                type="text"
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="no_siup"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                No. KTP
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="ktp"
                                                                value={masterData.ktp || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="no_siup"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                No. SIM
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="sim"
                                                                value={masterData.sim || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="telp"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Telepon 1
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="telp"
                                                                value={masterData.telp || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="telp2"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Telepon 2
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="telp2"
                                                                value={masterData.telp2 || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="hp"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Handphone 1
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="hp"
                                                                value={masterData.hp || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <label
                                                                htmlFor="hp2"
                                                                className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                            >
                                                                Whatsapp
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="hp2"
                                                                value={masterData.hp2 || ''}
                                                                onChange={handleChange}
                                                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="Cth: 1234567890123456"
                                                                
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="fax"
                                                            className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Facimile
                                                        </label>
                                                        <input
                                                            type="number"
                                                            name="fax"
                                                            value={masterData.fax || ''}
                                                            onChange={handleChange}
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: 1234567890123456"
                                                            
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={masterData.email || ''}
                                                            onChange={handleChange}
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: admin@kcngroup.com"
                                                            
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Website
                                                        </label>
                                                        <div className="flex">
                                                            <span className="rounded-e-0 inline-flex items-center rounded-s-md border border-gray-300 bg-gray-200 px-2 text-[12px] text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
                                                                www.
                                                            </span>
                                                            <input
                                                                name="website"
                                                                value={masterData.website || ''}
                                                                onChange={handleChange}
                                                                type="text"
                                                                id="website-admin"
                                                                className="block w-full rounded-r-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                placeholder="kencanagroup.com"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="alamat"
                                                            className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Alamat
                                                        </label>
                                                        <textarea
                                                            name="alamat"
                                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            placeholder="Cth: Jln. Terusan Pasir Koja"
                                                            value={masterData.alamat}
                                                            onChange={(e) => handleChange(e)} // Invoke handleChange with the event parameter
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/*================= Content menampilkan file pendukung =================*/}
                                            <div className="set-font-11" style={{ width: '100%', height: '100%', marginTop: '1px' }}>
                                                <GridComponent
                                                    id="gridDetailRelasi"
                                                    name="gridDetailRelasi"
                                                    className="gridDetailRelasi"
                                                    locale="id"
                                                    ref={(g) => (gridDetailRelasi = g)}
                                                    dataSource={kontakRelasiForm}
                                                    
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    allowResizing={true}
                                                    // editSettings={editOptions}
                                                    autoFit={true}
                                                    rowHeight={22}
                                                    height={170} //170 barang jadi 150 barang produksi
                                                    gridLines={'Both'}
                                                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    rowDataBound={rowDataBoundDetailRelasi}
                                                    queryCellInfo={queryCellInfoDetailRelasi}                                        
                                                    dataBound={() => {
                                                        if (gridDetailRelasi) {
                                                            // gridDetailRelasi.autoFitColumns([]);
                                                            //Pilih baris terakhir saat grid data refresh Complete
                                                            // gridDetailRelasi.selectRow(0);
                                                            gridDetailRelasi.selectRow(gridDetailRelasi.length - 1);
                                                        }
                                                    }}
                                                    recordDoubleClick={(args: any) => {
                                                        if (gridDetailRelasi) {
                                                            const rowIndex: number = args.row.rowIndex;
                                                            gridDetailRelasi.selectRow(rowIndex);
                
                                                           showEditRecord();
                                                        }
                                                    }}
                                                >
                                                    <ColumnsDirective>
                                                        <ColumnDirective
                                                            field="nama_lengkap"
                                                            isPrimaryKey={true}
                                                            headerText="Nama Lengkap"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="jab"
                                                            headerText="Jabatan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="hubungan"
                                                            headerText="Hubungan Kepemilikan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="bisnis"
                                                            headerText="Telp. Kantor"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="hp2"
                                                            headerText="WhatsApp"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="200"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                    </ColumnsDirective>

                                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                </GridComponent>
                                                <div className="panel-pager">
                                                    <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                            <div className="mt-1 flex">
                                                                <ButtonComponent
                                                                    id="buAdd1"
                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                    cssClass="e-primary e-small"
                                                                    iconCss="e-icons e-small e-plus"
                                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                    disabled={!stateBrowse}
                                                                    onClick={addDetailRelasi}
                                                                />
                                                                
                                                                <ButtonComponent
                                                                    id="buAdd1"
                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                    cssClass="e-warning e-small"
                                                                    iconCss="e-icons e-small e-trash"
                                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                    disabled={!stateBrowse}
                                                                    onClick={addDetailRelasi}
                                                                />
                                                            </div>
                                                        
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </div>
                                            </div>
                                            {/*======================================================================*/}
                                        </div>
                                    </TabComponent>
                                </div>
                            </div>
                            <div>
                                {/* ===============  Master Footer Data ========================   */}
                                <div className="mt-1">
                                    <p className="set-font-11">
                                        <b>Catatan :</b>
                                    </p>
                                    <div className="panel-input" style={{ width: '80%' }}>
                                        <TextBoxComponent
                                            ref={(t) => {
                                                textareaObj = t;
                                            }}
                                            multiline={true}
                                            name='catatan'
                                            created={onCreateMultiline}
                                            value={masterData.catatan || ''}
                                            input={(args: FocusInEventArgs) => {
                                                const value: any = args.value;
                                                setMasterData({
                                                    ...masterData,
                                                    catatan: value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* =================  Tombol action dokumen ==================== */}
                        <div
                            style={{
                                backgroundColor: '#F2FDF8',
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
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
                            {(masterDataState == 'BARU' || masterDataState == 'EDIT') && (
                                <ButtonComponent
                                    id="buBatalDokumen1"
                                    content="Batal"
                                    cssClass="e-danger e-small"
                                    iconCss="e-icons e-small e-close"
                                    style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em' }}
                                    onClick={closeDialogRelasi}
                                />
                            )}
                            {(masterDataState == 'BARU' || masterDataState == 'EDIT') && (
                                <ButtonComponent
                                    id="buSimpanDokumen1"
                                    content="Simpan"
                                    cssClass="e-primary e-small"
                                    iconCss="e-icons e-small e-save"
                                    style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em' }}
                                    onClick={() => {simpanData(kontakRelasiForm)}}
                                />
                            )}
                        </div>
                    </div>
                </DialogComponent>
            </div>
            <DialogComponent
                ref={(d) => (dialogKontakRelasi = d)}
                id="dialogKontakRelasi"
                name="dialogKontakRelasi"
                target="#DialogRelasi"
                style={{ position: 'fixed' }}
                header={'Kontak Relasi'}
                visible={dialogKontakRelasiVisible}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                //enableResize={true}
                //resizeHandles={['All']}
                allowDragging={true}
                showCloseIcon={true}
                width="500"
                height="500"
                buttons={buttonKontakRelasi}
                position={{ X: 'center', Y: 'center' }}
                close={() => {
                    setDialogKontakRelasiVisible(false);
                }}
                closeOnEscape={true}
                open={() => {}}
            >
                <div>
                    <table className={`${styles.table}`} style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '100%' }}>Nama Lengkap</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <TextBoxComponent placeholder="Nama Lengkap" name="nama_lengkap" value={inputValue.nama_lengkap || selectedListData.nama_lengkap} onChange={handleInputChange} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className={`${styles.table} border-b`} style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '60%' }}>Panggilan</th>
                                <th style={{ width: '40%' }}>Non Aktif</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <TextBoxComponent placeholder="Panggilan" name="nama_person" value={inputValue.nama_person || selectedListData.nama_person} onChange={handleInputChange} />
                                </td>
                                <td>
                                    <CheckBoxComponent
                                        // label="Aktif Kontak"
                                        checked={inputValue.aktif_kontak === 'N' || selectedListData.aktif_kontak === 'N'}
                                        value={inputValue.aktif_kontak || selectedListData.aktif_kontak}
                                        onChange={handleInputChange}
                                        name="aktif_kontak"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="p-3">
                        <div className="gap-6">
                            <div className="mb-3 sm:col-span-2">
                                <label htmlFor="kota" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                    Jabatan
                                </label>
                                <select
                                    value={selectedListData.jab || inputValue.jab} // Menetapkan nilai default
                                    name="jab"
                                    onChange={handleInputChange}
                                    className=" block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="" disabled selected={!inputValue.jab}>
                                        {inputValue.jab === null ? '-- Belum Memilih Jabatan --' : '-- Pilih Jabatan --'}
                                    </option>
                                    {jabatanArray.map((jab, index) => (
                                        <option key={(jab.name, +index + 1)} value={jab.name}>
                                            {jab.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3 sm:col-span-2">
                                <label htmlFor="kota" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                    Hubungan Kepemilikan
                                </label>
                                <select
                                    value={inputValue.hubungan || selectedListData.hubungan} // Menetapkan nilai default
                                    name="hubungan"
                                    onChange={handleInputChange}
                                    className=" block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                >
                                    <option value="" disabled selected={!inputValue.hubungan}>
                                        {inputValue.hubungan === null ? '-- Belum Memilih Hubungan --' : '-- Pilih Hubungan --'}
                                    </option>
                                    {hubunganKepemilikanArray.map((hubungan, index) => (
                                        <option key={(hubungan.name, +index + 1)} value={hubungan.name}>
                                            {hubungan.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-3 grid w-full grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <div className="mb-3 w-full">
                                        <label htmlFor="bisnis" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                            Telp. Kantor 1
                                        </label>
                                        <input
                                            type="number"
                                            name="bisnis"
                                            id="bisnis"
                                            value={inputValue.bisnis || selectedListData.bisnis}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Cth: 1234567890123456"
                                        />
                                    </div>
                                    <div className="mb-3 w-full">
                                        <label htmlFor="bisnis2" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                            Telp. Kantor 2
                                        </label>
                                        <input
                                            type="number"
                                            name="bisnis2"
                                            id="bisnis2"
                                            value={inputValue.bisnis2 || selectedListData.bisnis2}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Cth: 1234567890123456"
                                        />
                                    </div>
                                    <div className="mb-3 w-full">
                                        <label htmlFor="telp" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                            Telp. Rumah
                                        </label>
                                        <input
                                            type="number"
                                            name="telp"
                                            id="telp"
                                            value={inputValue.telp || selectedListData.telp}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Cth: 1234567890123456"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-3 w-full">
                                        <label htmlFor="hp" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                            Handphone
                                        </label>
                                        <input
                                            type="number"
                                            name="hp"
                                            id="hp"
                                            value={inputValue.hp || selectedListData.hp}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Cth: 1234567890123456"
                                        />
                                    </div>
                                    <div className="mb-3 w-full">
                                        <label htmlFor="hp2" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                            WhatsApp
                                        </label>
                                        <input
                                            type="number"
                                            name="hp2"
                                            id="hp2"
                                            value={inputValue.hp2 || selectedListData.hp2}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Cth: 1234567890123456"
                                        />
                                    </div>
                                    <div className="mb-3 w-full">
                                        <label htmlFor="fax" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                            Facimile
                                        </label>
                                        <input
                                            type="number"
                                            name="fax"
                                            id="fax"
                                            value={inputValue.fax || selectedListData.fax}
                                            onChange={handleInputChange}
                                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder="Cth: 1234567890123456"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 sm:col-span-2">
                                <label htmlFor="email" className="mb-2 block text-[12px] font-medium text-gray-900 dark:text-white">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={inputValue.email || selectedListData.email}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Cth: 1234567890123456"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogComponent>
        </>
    );
};

export default DialogRelasi;
