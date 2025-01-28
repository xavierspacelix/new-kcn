import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import idIDLocalization from 'public/syncfusion/locale.json';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';
import moment from 'moment';
import { FaSearch } from 'react-icons/fa';
import GridPecahan from './GridPecahan';
import AkunKas from './AkunKas';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { downloadBase64Image } from '../../../master/kendaraan/function/function';
import axios from 'axios';
import Swal from 'sweetalert2';
import JSZip from 'jszip';
import { CiSearch } from 'react-icons/ci';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
enableRipple(true);

const BaruEditCashCount = ({
    visible,
    onClose,
    masterState = '',
    kode_entitas,
    masterData = {},
    refereshData,
    token,
    userid,
}: {
    visible: boolean;
    onClose: Function;
    masterState: string;
    kode_entitas: string;
    masterData: any;
    refereshData: Function;
    token: string;
    userid: string;
}) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const header = 'Cash Opaname ' + formatString(masterState) + (Object.keys(masterData).length !== 0 && masterState !== 'BARU' ? ' [ ' + masterData.tgl + ' ' + masterData.nama_akun + ']' : '');
    const fileInputRef = useRef<any>(null);
    const [headerState, setHeaderState] = useState({
        tanggal: moment().format('YYYY-MM-DD'),
        no_akun: '',
        nama_akun: '',
        kode_akun: '',
    });
    const [bodyState, setBodyState] = useState({
        saldo_akhir_fisik: '0',
        saldo_akhir_sistem: '0',
        selisih: '0',
        saldo_belum_approved: '0',
    });

    const [oldData, setOldData] = useState<any>({});

    const [catatan, setCatatan] = useState('');
    const [isFocused, setIsFocused] = useState({
        saldo_akhir_fisik: false,
        saldo_akhir_sistem: false,
        selisih: false,
        saldo_belum_approved: false,
    }); // Untuk melacak status fokus
    const [uploaldedFiles, setUploaldedFiles] = useState<any[]>([]);
    const [visbleDialogAkun, setVisbleDialogAkun] = useState(false);
    const gridPecahan = useRef<Grid | any>(null);

    //state file pendukung
    const [indexPreview, setIndexPreview] = useState(0);
    const [imageDataUrl, setImageDataUrl] = useState('');
    const [imageTipe, setImageTipe] = useState('');
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [isOpenPreviewDobel, setIsOpenPreviewDobel] = useState(false);
    const [isOpenPreviewDobelTtd, setIsOpenPreviewDobelTtd] = useState(false);
    const [zoomScale, setZoomScale] = useState(0.5);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [imageDataUrlTtd, setImageDataUrlTtd] = useState('');
    const [imageDataUrlTtp, setImageDataUrlTtp] = useState('');
    const [zoomScaleTtd, setZoomScaleTtd] = useState(0.5);
    const [positionTtd, setPositionTtd] = useState({ x: 0, y: 0 });
    const [rotationAngle, setRotationAngle] = useState(0);
    useEffect(() => {
        const dialogElement = document.getElementById('dialogBaruEditCashCount');
        if (dialogElement) {
            dialogElement.style.maxHeight = 'none';
            dialogElement.style.maxWidth = 'none';
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

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    function formatNumber(num: any) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    const handleTgl = async (date: any, tipe: string) => {
        if (tipe === 'tanggal') {
            setHeaderState((oldData: any) => ({
                ...oldData,
                tanggal: moment(date).format('YYYY-MM-DD'),
            }));

            const response = await axios.get(`${apiUrl}/erp/udf_saldobalanceglmu?`, {
                params: {
                    entitas: kode_entitas,
                    param1: headerState.kode_akun,
                    param2: moment(date).format('YYYY-MM-DD'),
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },

                // entitas=999&param1=SqlAkunPreferensi&param2=Kas&param3=Y&param4=Kas
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("get akun balance",response.data.data);
            setBodyState((oldData: any) => ({
                ...oldData,
                saldo_akhir_sistem: String(SpreadNumber(response.data.data.balance)),
                selisih: String(parseFloat(oldData.saldo_akhir_fisik.replace(/,/g, '')) - SpreadNumber(response.data.data.balance)),
                saldo_belum_approved: String(SpreadNumber(response.data.data.napp)),
            }));
        }
    };

    const validasiForm = () => {
        gridPecahan.current!.endEdit();
        // Gabungkan semua state yang perlu divalidasi
        const allStates = {
            ...bodyState,
            ...headerState,
        };

        // Iterasi setiap properti di objek gabungan
        for (const [key, value] of Object.entries(allStates)) {
            if (value === '' || value === null || value === undefined) {
                // Tampilkan pesan error swal jika ada properti yang kosong
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    target: '#forDialogAndSwall',
                    text: `${formatString(key)} harus diisi`,
                });
                return false; // Berhenti validasi jika ada yang kosong
            }
        }

        console.log('Pembulatan : ', Math.round(parseFloat(bodyState.selisih.replace(/,/g, ''))));

        if (Math.round(parseFloat(bodyState.selisih.replace(/,/g, ''))) !== 0 && catatan.length < 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Perhatian',
                target: '#forDialogAndSwall',
                text: `Catatan selisih opname belum diisi atau pastikan anda sudah memasukkan alasan selisih dengan benar.`,
            });
            return;
        }

        return masterState === 'BARU' ? savedoc() : masterState === 'EDIT' ? editdoc() : editFilePendukung(); // Lolos validasi jika semua properti terisi
    };
    console.log(uploaldedFiles);

    const savedoc = async () => {
        const temp = gridPecahan.current!.dataSource;

        const dataKirim = {
            entitas: kode_entitas,
            tgl: headerState.tanggal,
            kode_akun: headerState.kode_akun,
            k100: temp[10].kertas,
            k200: temp[9].kertas,
            k500: temp[8].kertas,
            k1000: temp[7].kertas,
            k2000: temp[6].kertas,
            k5000: temp[5].kertas,
            k10000: temp[4].kertas,
            k20000: temp[3].kertas,
            k50000: temp[2].kertas,
            k75000: temp[1].kertas,
            k100000: temp[0].kertas,
            c100: temp[10].koin,
            c200: temp[9].koin,
            c500: temp[8].koin,
            c1000: temp[7].koin,
            c2000: temp[6].koin,
            c5000: temp[5].koin,
            c10000: temp[4].koin,
            c20000: temp[3].koin,
            c50000: temp[2].koin,
            c75000: temp[1].koin,
            c100000: temp[0].koin,
            n100: temp[10].jumlah,
            n200: temp[9].jumlah,
            n500: temp[8].jumlah,
            n1000: temp[7].jumlah,
            n2000: temp[6].jumlah,
            n5000: temp[5].jumlah,
            n10000: temp[4].jumlah,
            n20000: temp[3].jumlah,
            n50000: temp[2].jumlah,
            n75000: temp[1].jumlah,
            n100000: temp[0].jumlah,
            nfisik: String(parseFloat(bodyState.saldo_akhir_fisik.replace(/,/g, ''))),
            nsistem: String(parseFloat(bodyState.saldo_akhir_sistem.replace(/,/g, ''))),
            nselisih: String(parseFloat(bodyState.selisih.replace(/,/g, ''))),
            napp: String(parseFloat(bodyState.saldo_belum_approved.replace(/,/g, ''))),
            alasan: catatan,
            fileopname: uploaldedFiles[0]?.file?.name || null,
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        try {
            const response: any = await axios.post(`${apiUrl}/erp/simpan_kas_opname?`, dataKirim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                const auditReqBodySPM = {
                    entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'KOP',
                    kode_dokumen: '',
                    no_dokumen: headerState.no_akun,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'NEW',
                    diskripsi: `Kas Opname : ${moment().format('DD-MM-YYY')} ${headerState.nama_akun} = ${formatNumber(bodyState.saldo_akhir_fisik)}`,
                    userid: userid.toUpperCase(),
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                await axios.post(`${apiUrl}/erp/simpan_audit`, auditReqBodySPM);
                await refereshData();
                Swal.fire({
                    title: 'Berhasil Simpan',
                    target: '#main-target',
                    icon: 'success',
                    timer: 1500,
                });
                if (uploaldedFiles.length === 0) {
                    refereshData();
                    onClose();
                    return;
                } else {
                    onClose();
                }
                await handleUploadZip('asal');
            }
        } catch (error: any) {
            if (error) {
                console.log(error);
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: `${error?.response?.data?.message} 
                (${error?.response?.data?.error})`,
                    target: '#forDialogAndSwall',
                    icon: 'warning',
                });
            }
        }
    };

    const editdoc = async () => {
        const temp = gridPecahan.current!.dataSource;

        const dataKirim = {
            entitas: kode_entitas,
            tgl: headerState.tanggal,
            kode_akun: headerState.kode_akun,
            k100: temp[10].kertas,
            k200: temp[9].kertas,
            k500: temp[8].kertas,
            k1000: temp[7].kertas,
            k2000: temp[6].kertas,
            k5000: temp[5].kertas,
            k10000: temp[4].kertas,
            k20000: temp[3].kertas,
            k50000: temp[2].kertas,
            k75000: temp[1].kertas,
            k100000: temp[0].kertas,
            c100: temp[10].koin,
            c200: temp[9].koin,
            c500: temp[8].koin,
            c1000: temp[7].koin,
            c2000: temp[6].koin,
            c5000: temp[5].koin,
            c10000: temp[4].koin,
            c20000: temp[3].koin,
            c50000: temp[2].koin,
            c75000: temp[1].koin,
            c100000: temp[0].koin,
            n100: temp[10].jumlah,
            n200: temp[9].jumlah,
            n500: temp[8].jumlah,
            n1000: temp[7].jumlah,
            n2000: temp[6].jumlah,
            n5000: temp[5].jumlah,
            n10000: temp[4].jumlah,
            n20000: temp[3].jumlah,
            n50000: temp[2].jumlah,
            n75000: temp[1].jumlah,
            n100000: temp[0].jumlah,
            nfisik: String(parseFloat(bodyState.saldo_akhir_fisik.replace(/,/g, ''))),
            nsistem: String(parseFloat(bodyState.saldo_akhir_sistem.replace(/,/g, ''))),
            nselisih: String(parseFloat(bodyState.selisih.replace(/,/g, ''))),
            napp: String(parseFloat(bodyState.saldo_belum_approved.replace(/,/g, ''))),
            alasan: catatan,
            fileopname: uploaldedFiles[0]?.file?.name || null,
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            Old_tgl: oldData.tgl,
            Old_kode_akun: oldData.kode_akun,
        };

        try {
            const response: any = await axios.patch(`${apiUrl}/erp/update_kas_opname?`, dataKirim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                const auditReqBodySPM = {
                    entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'KOP',
                    kode_dokumen: '',
                    no_dokumen: headerState.no_akun,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'EDIT',
                    diskripsi: `Kas Opname : ${moment().format('DD-MM-YYY')} ${headerState.nama_akun} = ${formatNumber(bodyState.saldo_akhir_fisik)}`,
                    userid: userid.toUpperCase(),
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                await axios.post(`${apiUrl}/erp/simpan_audit`, auditReqBodySPM);
                await refereshData();
                Swal.fire({
                    title: 'Berhasil Simpan',
                    target: '#main-target',
                    icon: 'success',
                    timer: 1500,
                });
                if (uploaldedFiles.length === 0) {
                    refereshData();
                    onClose();
                    return;
                } else {
                    onClose();
                }
            }
            await handleUploadZip('asal');
        } catch (error: any) {
            if (error) {
                console.log(error);
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: `${error?.response?.data?.message} 
                (${error?.response?.data?.error})`,
                    target: '#forDialogAndSwall',
                    icon: 'warning',
                });
            }
        }
    };

    const editFilePendukung = async () => {
        console.log('edit file pendukung');

        const temp = gridPecahan.current!.dataSource;

        const dataKirim = {
            ...oldData,
            fileopname: uploaldedFiles[0]?.file?.name || '',
            entitas: kode_entitas,
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            Old_tgl: oldData.tgl,
            Old_kode_akun: oldData.kode_akun,
        };

        try {
            const response: any = await axios.patch(`${apiUrl}/erp/update_kas_opname?`, dataKirim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                const auditReqBodySPM = {
                    entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'KOP',
                    kode_dokumen: '',
                    no_dokumen: headerState.no_akun,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'EDIT',
                    diskripsi: `Kas Opname : ${moment().format('DD-MM-YYY')} ${headerState.nama_akun} = ${formatNumber(bodyState.saldo_akhir_fisik)}`,
                    userid: userid.toUpperCase(),
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                await axios.post(`${apiUrl}/erp/simpan_audit`, auditReqBodySPM);
                await refereshData();
                Swal.fire({
                    title: 'Berhasil Simpan',
                    target: '#main-target',
                    icon: 'success',
                    timer: 1500,
                });
                if (uploaldedFiles.length === 0) {
                    refereshData();
                    onClose();
                    return;
                } else {
                    onClose();
                }
            }
            await handleUploadZip('asal');
        } catch (error: any) {
            if (error) {
                console.log(error);
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: `${error?.response?.data?.message} 
                (${error?.response?.data?.error})`,
                    target: '#forDialogAndSwall',
                    icon: 'warning',
                });
            }
        }
    };

    const handleUploadZip = async (kode_dokumen: any) => {
        // console.log('MASUK HANDLE UPLOAD :', Object.keys(uploaldedFiles).length);

        const formData = new FormData();
        const jsonData = [];
        const zip = new JSZip();
        let namaFileImage: any;

        for (let index = 0; index <= Object.keys(uploaldedFiles).length; index++) {
            // console.log('MASUK INDEX : ', index);
            if (uploaldedFiles[index]?.file === null || uploaldedFiles[index] === undefined) {
                console.log('UPLOAD KELUAR DI INDEX ', index);

                continue;
            }

            const fileWithTabIdx = uploaldedFiles[index];
            // console.log('upload fileWithTabIdx : ', uploaldedFiles[index]?.file?.name);

            const file = fileWithTabIdx.file;
            const tabIdx = fileWithTabIdx.id_dokumen;

            // formData.append(`nama_file_image`, selectedFile !== 'update' ? `SP${uploaldedFiles[index]?.fileName}.${fileExtension}` : fileGambar);
            const fileNameWithExtension = masterState !== 'BARU' ? `${uploaldedFiles[index]?.file?.name}` : `${uploaldedFiles[index]?.file?.name}`;
            namaFileImage = fileNameWithExtension;

            const fileNameWithOutExtension = fileNameWithExtension.split('.')[0];

            // console.log('dasdad = ', uploaldedFiles[index]?.file?.name);
            // const arrayBuffer = await new Response(uploaldedFiles.file).arrayBuffer();
            // Menambahkan file ke dalam zip dengan ekstensi yang sesuai
            const base64Content = uploaldedFiles[index]?.fileUrl.split(',')[1];
            zip.file(fileNameWithExtension, base64Content, { base64: true });

            if (tabIdx !== -1) {
                const jsonEntry = {
                    kode_entitas,
                    kode_dokumen: fileNameWithOutExtension,
                    id_dokumen: String(tabIdx),
                    dokumen: 'KOP',
                    filegambar: fileNameWithExtension,
                    fileoriginal: fileNameWithExtension,
                };
                jsonData.push(jsonEntry);
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        console.log(uploaldedFiles);

        const fileNameWithOutExtension = uploaldedFiles[0].file.name.split('.')[0];
        // Tambahkan blob ZIP ke FormData
        formData.append('myimage', zipBlob, `${fileNameWithOutExtension}.zip`);

        // Tambahkan informasi tambahan ke FormData
        formData.append('nama_file_image', `${fileNameWithOutExtension}.zip`);
        formData.append('kode_dokumen', '');

        // Tentukan nilai tabIdx yang benar, mungkin dengan memperhitungkan logika Anda
        let tabIdx = uploaldedFiles.length;
        formData.append('id_dokumen', String(tabIdx));
        formData.append('dokumen', 'KOP');

        formData.append('ets', kode_entitas);

        // console.log('FormData Contents:');
        // for (let pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }
        // console.log('upload JsonInput = ', jsonData);

        if (Object.keys(uploaldedFiles).length > 0) {
            try {
                // Lakukan unggah menggunakan Axios
                const response = await axios.post(`${apiUrl}/upload`, formData);

                // console.log('UPLOAD PER IMAGE : ', response);

                // Proses respon dari server
                let jsonSimpan;

                if (Array.isArray(response.data.nama_file_image)) {
                    jsonSimpan = response.data.nama_file_image.map((namaFile: any, index: any) => {
                        return {
                            kode_entitas,
                            kode_dokumen: kode_dokumen,
                            id_dokumen: response.data.id_dokumen[index],
                            dokumen: 'KOP',
                            filegambar: namaFile,
                            fileoriginal: response.data.filesinfo[index] ? response.data.filesinfo[index].fileoriginal : null,
                        };
                    });
                } else {
                    jsonSimpan = {
                        kode_entitas,
                        kode_dokumen: kode_dokumen,
                        id_dokumen: '999',
                        dokumen: 'KOP',
                        filegambar: response.data.nama_file_image,
                        fileoriginal: response.data.filesinfo,
                    };
                }

                if (response.data.status === true) {
                    // if (selectedFile !== 'update') {
                    // await axios
                    //     .post(`${apiUrl}/erp/simpan_tbimages`, jsonSimpan)
                    //     .then((response) => {})
                    //     .catch((error) => {
                    //         console.error('Error simpan tbimages:', error);
                    //     });
                    // await axios
                    //     .post(`${apiUrl}/erp/simpan_tbimages`, jsonData)
                    //     .then((response) => {})
                    //     .catch((error) => {
                    //         console.error('Error:', error);
                    //     });
                    // }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        try {
            if (masterState === 'EDIT') {
                await axios.delete(`${apiUrl}/erp/hapus_file_pendukung_ftp`, {
                    params: {
                        entitas: kode_entitas,
                        param1: oldData.fileopname.split('.')[0] + '.zip',
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        // Jika input checkbox, kita gunakan checked, jika bukan, gunakan value
        setHeaderState((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleChangeBody = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Update filterState
        setBodyState((prev: any) => ({
            ...prev,
            [name]: value.replace(/,/g, ''),
        }));
    };
    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsFocused((prev: any) => ({
            ...prev,
            [name]: true,
        }));
        e.target.select();
    };
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsFocused((prev: any) => ({
            ...prev,
            [name]: false,
        }));
        setBodyState((prev: any) => ({
            ...prev,
            [name]: value.replace(/,/g, ''),
            selisih: String(parseFloat(bodyState.saldo_akhir_fisik.replace(/,/g, '')) - parseFloat(bodyState.saldo_akhir_sistem.replace(/,/g, ''))),
        })); // Format angka saat blur
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDeleteFilePendukung = () => {
        if (uploaldedFiles.length === 0) {
            return alert('Pilih dulu file pendukung nya');
        }
        setUploaldedFiles([]);

        // console.log('tempMinIndex', tempMinIndex);
        // console.log('temp', temp);
    };

    const handlePreview = () => {
        if (uploaldedFiles.length === 0) {
            return alert('Pilih dulu file pendukung nya');
        }
        const temp = uploaldedFiles[0];

        setImageDataUrl(temp.fileUrl);
        setImageTipe(temp.file.type);
        setIsOpenPreview(true);
    };

    const handleZoom = (tipe: any) => {
        if (tipe === 'ttd') {
            setZoomScaleTtd(1);
            setPositionTtd({ x: 0, y: 0 }); // Reset position
            setImageDataUrlTtd('');
        }
    };

    const HandleZoomIn = (setZoomScale: Function) => {
        setZoomScale((prevScale: any) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
    };

    const HandleZoomOut = (setZoomScale: Function) => {
        setZoomScale((prevScale: any) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
    };

    const HandleCloseZoom = (setIsOpenPreview: Function) => {
        setIsOpenPreview(false);
    };

    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleDownloadFile = () => {
        const temp: any = uploaldedFiles.filter((item: any) => item.id_dokumen === indexPreview)[0];

        temp === undefined ? null : downloadBase64Image(temp?.fileUrl, temp.fileNameOri);
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (event: any) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            // Scroll up
            setZoomScale((prevScale) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
        } else {
            // Scroll down
            setZoomScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
        }
    };
    const getDetail = async () => {
        try {
            const param1 = masterData.tgl;
            const param2 = masterData.kode_akun;

            const response = await axios.get(`${apiUrl}/erp/detail_kas_opname?`, {
                params: {
                    entitas: kode_entitas,
                    param1: param1,
                    param2: param2,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setHeaderState({
                tanggal: moment(response.data.data[0].tgl).format('YYYY-MM-DD'),
                no_akun: response.data.data[0].no_akun,
                nama_akun: response.data.data[0].nama_akun,
                kode_akun: response.data.data[0].kode_akun,
            });
            setCatatan(response.data.data[0].alasan);
            setBodyState({
                saldo_akhir_fisik: String(SpreadNumber(response.data.data[0].nfisik)),
                saldo_akhir_sistem: String(SpreadNumber(response.data.data[0].nsistem)),
                selisih: String(SpreadNumber(response.data.data[0].nselisih)),
                saldo_belum_approved: String(SpreadNumber(response.data.data[0].napp)),
            });
            const temp = [
                { pecahan: 100000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 75000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 50000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 20000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 10000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 5000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 2000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 1000, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 500, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 200, kertas: 0, koin: 0, jumlah: 0 },
                { pecahan: 100, kertas: 0, koin: 0, jumlah: 0 },
            ];
            temp[10].kertas = SpreadNumber(response.data.data[0].k100);
            temp[9].kertas = SpreadNumber(response.data.data[0].k200);
            temp[8].kertas = SpreadNumber(response.data.data[0].k500);
            temp[7].kertas = SpreadNumber(response.data.data[0].k1000);
            temp[6].kertas = SpreadNumber(response.data.data[0].k2000);
            temp[5].kertas = SpreadNumber(response.data.data[0].k5000);
            temp[4].kertas = SpreadNumber(response.data.data[0].k10000);
            temp[3].kertas = SpreadNumber(response.data.data[0].k20000);
            temp[2].kertas = SpreadNumber(response.data.data[0].k50000);
            temp[1].kertas = SpreadNumber(response.data.data[0].k75000);
            temp[0].kertas = SpreadNumber(response.data.data[0].k100000);
            temp[10].koin = SpreadNumber(response.data.data[0].c100);
            temp[9].koin = SpreadNumber(response.data.data[0].c200);
            temp[8].koin = SpreadNumber(response.data.data[0].c500);
            temp[7].koin = SpreadNumber(response.data.data[0].c1000);
            temp[6].koin = SpreadNumber(response.data.data[0].c2000);
            temp[5].koin = SpreadNumber(response.data.data[0].c5000);
            temp[4].koin = SpreadNumber(response.data.data[0].c10000);
            temp[3].koin = SpreadNumber(response.data.data[0].c20000);
            temp[2].koin = SpreadNumber(response.data.data[0].c50000);
            temp[1].koin = SpreadNumber(response.data.data[0].c75000);
            temp[0].koin = SpreadNumber(response.data.data[0].c100000);
            temp[10].jumlah = SpreadNumber(response.data.data[0].n100);
            temp[9].jumlah = SpreadNumber(response.data.data[0].n200);
            temp[8].jumlah = SpreadNumber(response.data.data[0].n500);
            temp[7].jumlah = SpreadNumber(response.data.data[0].n1000);
            temp[6].jumlah = SpreadNumber(response.data.data[0].n2000);
            temp[5].jumlah = SpreadNumber(response.data.data[0].n5000);
            temp[4].jumlah = SpreadNumber(response.data.data[0].n10000);
            temp[3].jumlah = SpreadNumber(response.data.data[0].n20000);
            temp[2].jumlah = SpreadNumber(response.data.data[0].n50000);
            temp[1].jumlah = SpreadNumber(response.data.data[0].n75000);
            temp[0].jumlah = SpreadNumber(response.data.data[0].n100000);
            gridPecahan.current!.dataSource = temp;
            gridPecahan.current!.refresh();
            setOldData(response.data.data[0]);

            if (response.data.data[0].fileopname !== null || response.data.data[0].fileopname !== '') {
                const resFilePendukung = await axios.get(`${apiUrl}/erp/extrak_zip`, {
                    params: {
                        entitas: kode_entitas,
                        nama_zip: `${response.data.data[0].fileopname.split('.')[0]}.zip`,
                        // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                    },
                });
                const mimeType = resFilePendukung.data.images[0].imageUrl.split(':')[1].split(';')[0];
                // const blob = base64ToBlob(getImage.data.data[0].decodeBase64_string, mimeType);
                const file = new File([resFilePendukung.data.images[0].imageUrl], resFilePendukung.data.images[0].fileName, { type: mimeType });
                const temp = {
                    file: file,
                    fileUrl: resFilePendukung.data.images[0].imageUrl,
                    id_dokumen: 1,
                    fileNameOri: response.data.data[0].fileopname,
                };
                setUploaldedFiles((prevFiles) => [...prevFiles, temp]);
                setImageDataUrl(resFilePendukung.data.images[0].imageUrl);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (masterState !== 'BARU') {
            getDetail();
        }
    }, []);

    // console.log('dokumen', uploaldedFiles[0]?.file.type);

    useEffect(() => {
        if (isOpenPreview) {
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
    }, [isOpenPreview, handleMouseMove, handleMouseUp, handleWheel]);

    const handleRowSelectImage = (args: any) => {
        // console.log('args', args.data.id_dokumen);
        setIndexPreview(args.data.id_dokumen);
    };

    const handleRotateLeft = () => setRotationAngle(rotationAngle - 90);
    const handleRotateRight = () => setRotationAngle(rotationAngle + 90);

    const handleFileChange = async (event: { target: { files: any[] } } | any) => {
        const file = event.target.files?.[0];
        if (file) {
            const file = event.target.files[0];
            if (file) {
                // Generate a datetime string
                const now = new Date();
                const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

                // Create a new file name with the datetime string and original file extension
                const extension = file.name.split('.').pop();
                const newFileName = `${dateTimeString}.${extension}`;

                // Use a File constructor to create a new file object with the new name
                const renamedFile = new File([file], 'IMG_KASOP' + newFileName, { type: file.type });
                const reader: any = new FileReader();
                reader.readAsDataURL(renamedFile);
                reader.onloadend = () => {
                    const temp = { file: renamedFile, fileUrl: reader.result as string, fileNameOri: file.name, id_dokumen: 1 };
                    // setUploaldedFiles(temp);
                    setUploaldedFiles([temp]);
                    setImageDataUrl(reader.result);
                };
            }
        } else {
            alert('Please upload a Image / Video format');
        }
        // Reset the input value to allow re-upload of the same file if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePaste = (e: any) => {
        e.preventDefault();

        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                const now = new Date();
                const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

                // Create a new file name with the datetime string and original file extension
                const extension = file.name.split('.').pop();
                const newFileName = `${dateTimeString}.${extension}`;

                // Use a File constructor to create a new file object with the new name
                const renamedFile = new File([file], 'IMG_KASOP' + newFileName, { type: file.type });
                const reader: any = new FileReader();
                reader.readAsDataURL(renamedFile);
                reader.onloadend = () => {
                    const temp = { file: renamedFile, fileUrl: reader.result as string, fileNameOri: file.name, id_dokumen: 1 };
                    // setUploaldedFiles(temp);
                    setUploaldedFiles([temp]);
                    setImageDataUrl(reader.result);
                };
            }
        }
    };

    return (
        <DialogComponent
            id="dialogBaruEditCashCount"
            isModal={true}
            width="93%"
            height="95%"
            visible={visible}
            close={() => onClose()}
            header={header}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            position={{ X: 'center', Y: 'top' }} // Dialog berada di tengah
            style={{ position: 'fixed' }}
        >
            <div className="flex h-[90%] w-full flex-col overflow-x-auto p-2 md:flex-row" id="forDialogAndSwall">
                {visbleDialogAkun && (
                    <AkunKas
                        token={token}
                        apiUrl={apiUrl}
                        kode_entitas={kode_entitas}
                        visible={visbleDialogAkun}
                        onClose={() => setVisbleDialogAkun(false)}
                        setHeaderDialogState={setHeaderState}
                        setBodyState={setBodyState}
                        tanggal={headerState.tanggal}
                    />
                )}
                <div className="flex h-full w-[50%] flex-col gap-1">
                    <div className="mt-2 flex h-6 w-full items-center gap-2 ">
                        <div className="flex w-[15%] items-center justify-end ">
                            <label htmlFor="tanggal">Tanggal</label>
                        </div>
                        <div className="w-[85%]">
                            <span className="flex  w-[120px] items-center rounded border bg-white">
                                <DatePickerComponent
                                    locale="id"
                                    id="tanggal"
                                    cssClass="e-custom-style"
                                    enableMask={true}
                                    showClearButton={false}
                                    format="dd-MM-yyyy"
                                    width={180}
                                    value={moment(headerState.tanggal).toDate()}
                                    change={(args: ChangeEventArgsCalendar) => {
                                        handleTgl(args.value, 'tanggal');
                                    }}
                                    style={{
                                        width: 70,
                                        padding: 5,
                                    }}
                                >
                                    <Inject services={[MaskedDateTime]} />
                                </DatePickerComponent>
                            </span>
                        </div>
                    </div>

                    <div className=" mt-2 flex h-6 w-full items-center gap-2 ">
                        <div className="flex w-[15%] items-center justify-end ">
                            <label htmlFor="tanggal">Akun Kas</label>
                        </div>
                        <div className="flex w-[85%] gap-2">
                            <div>
                                <input
                                    type="text"
                                    id="no_akun"
                                    className="w-full rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px]"
                                    placeholder="no akun"
                                    name="no_akun"
                                    autoComplete="off"
                                    readOnly
                                    value={headerState.no_akun}
                                    // style={{ height: '4vh' }}
                                    // onChange={(e) => {
                                    //     handleChange(e);
                                    //     setModalAkun(true);
                                    //     setTimeout(() => {
                                    //         document.getElementById('no_akun_dialog')!.focus();
                                    //     }, 2000);
                                    // }}
                                />
                            </div>
                            <div className="flex w-full items-center">
                                <input
                                    type="text"
                                    // value={query}
                                    // onChange={handleInputChange}
                                    value={headerState.nama_akun}
                                    onKeyDown={() => setVisbleDialogAkun(true)}
                                    readOnly
                                    placeholder="Keterangan akun"
                                    className="w-full rounded-l border border-gray-300 bg-white px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] "
                                />
                                <button onClick={() => setVisbleDialogAkun(true)} className="rounded-r-md bg-blue-500 p-2  text-white hover:bg-blue-600">
                                    <CiSearch className="text-[10px] font-bold " />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex  w-full  gap-2 ">
                        <div className="flex w-[15%] items-start justify-end">
                            <label htmlFor="tanggal">Pecahan</label>
                        </div>
                        <div className="relative flex  w-[85%] flex-col ">
                            <div className="w-full  overflow-y-auto  overflow-x-visible border">
                                <GridPecahan setBodyState={setBodyState} gridPecahan={gridPecahan} masterState={masterState} />
                            </div>
                            <div className="flex flex-col ">
                                <div className="mt-1 flex h-full w-full flex-col justify-end gap-0.5 md:mt-2 ">
                                    <div className="mt-1 flex h-6 w-full items-center gap-2 ">
                                        <div className="flex w-[50%] items-center justify-end ">
                                            <label htmlFor="tanggal">{formatString('saldo_akhir_fisik')}</label>
                                        </div>
                                        <div className="flex w-[50%] justify-items-end ">
                                            <div className="flex w-full justify-items-end">
                                                {/* Input */}
                                                <input
                                                    type="text"
                                                    id="saldo_akhir_fisik"
                                                    autoComplete="off"
                                                    className={`w-full rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] ${
                                                        isFocused.saldo_akhir_fisik ? 'text-left' : 'text-right'
                                                    }
                                    `}
                                                    placeholder={formatString('saldo_akhir_fisik')}
                                                    name="saldo_akhir_fisik"
                                                    value={isFocused.saldo_akhir_fisik ? bodyState.saldo_akhir_fisik : formatNumber(bodyState.saldo_akhir_fisik)}
                                                    // style={{ height: '4vh' }}
                                                    onChange={handleChangeBody}
                                                    readOnly
                                                    onFocus={handleFocus}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    onBlur={handleBlur}
                                                />

                                                {/* Button */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-1 flex h-6 w-full items-center gap-2 ">
                                        <div className="flex w-[50%] items-center justify-end ">
                                            <label htmlFor="tanggal">{formatString('saldo_akhir_sistem')}</label>
                                        </div>
                                        <div className="flex w-[50%] justify-items-end ">
                                            <div className="flex w-full justify-items-end">
                                                {/* Input */}
                                                <input
                                                    type="text"
                                                    id="saldo_akhir_sistem"
                                                    autoComplete="off"
                                                    className={`w-full rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] ${
                                                        isFocused.saldo_akhir_sistem ? 'text-left' : 'text-right'
                                                    }
                                    `}
                                                    placeholder={formatString('saldo_akhir_sistem')}
                                                    name="saldo_akhir_sistem"
                                                    value={isFocused.saldo_akhir_sistem ? bodyState.saldo_akhir_sistem : formatNumber(bodyState.saldo_akhir_sistem)}
                                                    // style={{ height: '4vh' }}
                                                    onChange={handleChangeBody}
                                                    readOnly
                                                    onFocus={handleFocus}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    onBlur={handleBlur}
                                                />

                                                {/* Button */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-1 flex h-6 w-full items-center gap-2 ">
                                        <div className="flex w-[50%] items-center justify-end ">
                                            <label htmlFor="tanggal">{formatString('selisih')}</label>
                                        </div>
                                        <div className="flex w-[50%] justify-items-end ">
                                            <div className="flex w-full justify-items-end">
                                                {/* Input */}
                                                <input
                                                    type="text"
                                                    id="selisih"
                                                    autoComplete="off"
                                                    className={`w-full rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] ${
                                                        isFocused.selisih ? 'text-left' : 'text-right'
                                                    }
                                    `}
                                                    placeholder={formatString('selisih')}
                                                    name="selisih"
                                                    value={isFocused.selisih ? bodyState.selisih : formatNumber(bodyState.selisih)}
                                                    // style={{ height: '4vh' }}
                                                    onChange={handleChangeBody}
                                                    readOnly
                                                    onFocus={handleFocus}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    onBlur={handleBlur}
                                                />

                                                {/* Button */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-1 flex h-6 w-full items-center gap-2 ">
                                        <div className="flex w-[50%] items-center justify-end ">
                                            <label htmlFor="tanggal">{formatString('saldo_belum_approved')}</label>
                                        </div>
                                        <div className="flex w-[50%] justify-items-end ">
                                            <div className="flex w-full justify-items-end">
                                                {/* Input */}
                                                <input
                                                    type="text"
                                                    id="saldo_belum_approved"
                                                    autoComplete="off"
                                                    className={`w-full rounded border border-gray-300 bg-gray-100 px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] ${
                                                        isFocused.saldo_belum_approved ? 'text-left' : 'text-right'
                                                    }
                                    `}
                                                    placeholder={formatString('saldo_belum_approved')}
                                                    name="saldo_belum_approved"
                                                    value={isFocused.saldo_belum_approved ? bodyState.saldo_belum_approved : formatNumber(bodyState.saldo_belum_approved)}
                                                    // style={{ height: '4vh' }}
                                                    onChange={handleChangeBody}
                                                    readOnly
                                                    onFocus={handleFocus}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    onBlur={handleBlur}
                                                />

                                                {/* Button */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex h-full w-[50%] flex-col gap-1 pt-[30px]">
                    <div className="mt-2 flex h-6 w-full items-center gap-1 ">
                        <div className="flex w-[15%] items-center justify-end ">
                            <label htmlFor="tanggal">{formatString('catatan')}</label>
                        </div>
                        <div className="flex w-[85%] ">
                            <div className="w-full">
                                {/* Input */}
                                <input
                                    type="text"
                                    id="catatan"
                                    autoComplete="off"
                                    className="w-full rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] "
                                    placeholder="catatan"
                                    name="catatan"
                                    value={catatan}
                                    readOnly={masterState !== 'BARU' && masterState !== 'EDIT'}
                                    onChange={(e) => setCatatan(e.target.value)}
                                />

                                {/* Button */}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex h-6 w-full items-center gap-1 ">
                        <div className="flex w-[15%] items-center justify-end ">
                            <label htmlFor="tanggal">File Pendukung</label>
                        </div>
                        <div className="flex w-[85%] ">
                            {/* Input */}
                            <input
                                type="text"
                                id="file_pendukung"
                                autoComplete="off"
                                className="w-full rounded border border-gray-300 bg-white px-2 py-0.5 text-[10px] text-gray-800 placeholder-gray-400 transition-all placeholder:text-[10px] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 md:py-1 md:text-[12px] "
                                placeholder="Nama file pendukung"
                                name="file_pendukung"
                                readOnly
                                value={uploaldedFiles[0]?.fileNameOri ?? ''}
                                // onChange={handleChange}
                                style={{ height: '4vh' }}
                            />

                            {/* Button */}
                        </div>
                    </div>

                    <div className="mt-2 flex h-6 w-full items-center gap-2  md:mt-2">
                        <div className="flex w-[15%] items-center justify-end ">
                            <label htmlFor="tanggal">Upload </label>
                        </div>
                        <div className="flex w-[85%] ">
                            <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                            <button
                                onClick={handleClick}
                                className="ml-3 flex h-7 w-28 items-center justify-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                            >
                                Ambil File
                            </button>
                            <button
                                className="ml-3 flex h-7 w-28 items-center justify-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                                onClick={handleDeleteFilePendukung}
                            >
                                Hapus File
                            </button>
                            <button
                                onClick={() => {
                                    const temp: any = uploaldedFiles[0];

                                    temp === undefined ? null : downloadBase64Image(temp?.fileUrl, temp.fileNameOri);
                                }}
                                className="ml-3 flex h-7 w-28 items-center justify-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                            >
                                Simpan ke file
                            </button>
                            <button
                                className="ml-3 flex h-7 w-28 items-center justify-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                                onClick={handlePreview}
                            >
                                Preview
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex h-[350px] w-full items-start gap-1 ">
                        <div className="flex h-full w-[15%] items-start justify-end ">
                            <label htmlFor="tanggal">Preview</label>
                        </div>
                        <div className="flex h-full w-[85%] " onPaste={(e) => handlePaste(e)}>
                            {/* Input */}
                            <div className="flex h-[full] w-[80%] items-center justify-center border ">
                                {uploaldedFiles[0]?.file.type.includes('image') ? (
                                    <img
                                        src={imageDataUrl}
                                        alt={`Zoomed ${indexPreview}`}
                                        // style={{
                                        //     transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px) rotate(${rotationAngle}deg)`,
                                        //     transition: 'transform 0.1s ease',
                                        //     cursor: 'pointer',
                                        //     maxWidth: '100vw',
                                        //     maxHeight: '100vh',
                                        // }}

                                        onClick={handlePreview}
                                        className="h-full w-[auto] cursor-pointer"
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                    />
                                ) : uploaldedFiles[0]?.file.type.includes('video') ? (
                                    <video
                                        src={imageDataUrl}
                                        // style={{
                                        //     transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px) rotate(${rotationAngle}deg)`,
                                        //     transition: 'transform 0.1s ease',
                                        //     cursor: 'pointer',
                                        //     maxWidth: '100vw',
                                        //     maxHeight: '100vh',
                                        // }}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                        controls
                                        onClick={handlePreview}
                                        className="h-full w-[auto] cursor-pointer"
                                    />
                                ) : uploaldedFiles[0]?.file.type.includes('application') ? (
                                    <div className="flex h-full w-full items-center justify-center">File Pendukung bukan video / gambar</div>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">Belum Ada Gambar / Video yang di upload {`(Silahkan Paste)`}</div>
                                )}
                            </div>

                            {/* Button */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-[10%]   w-full items-center justify-end gap-2 pr-4">
                <ButtonComponent type="submit" onClick={validasiForm}>
                    Simpan
                </ButtonComponent>
                <ButtonComponent type="submit" onClick={() => onClose()}>
                    Tutup
                </ButtonComponent>
            </div>
            {isOpenPreview && (
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
                    // onClick={() => HandleCloseZoom(setIsOpenPreview)}
                >
                    <div
                        style={{
                            position: 'relative',
                            textAlign: 'center',
                            zIndex: '1001',
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                    >
                        {imageTipe.includes('image') ? (
                            <img
                                src={imageDataUrl}
                                alt={`Zoomed ${indexPreview}`}
                                style={{
                                    transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px) rotate(${rotationAngle}deg)`,
                                    transition: 'transform 0.1s ease',
                                    cursor: 'pointer',
                                    maxWidth: '100vw',
                                    maxHeight: '100vh',
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                            />
                        ) : imageTipe.includes('video') ? (
                            <video
                                src={imageDataUrl}
                                style={{
                                    transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px) rotate(${rotationAngle}deg)`,
                                    transition: 'transform 0.1s ease',
                                    cursor: 'pointer',
                                    maxWidth: '100vw',
                                    maxHeight: '100vh',
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                controls
                                width={500}
                                height={500}
                            />
                        ) : (
                            <div>
                                <p className="text-white">Format Tidak Di Dukung, Silahkan download</p>
                                <button
                                    onClick={() => {
                                        const temp: any = uploaldedFiles.filter((item: any) => item.id_dokumen === indexPreview)[0];

                                        temp === undefined ? null : downloadBase64Image(temp?.fileUrl, temp.fileNameOri);
                                    }}
                                    className="mx-auto flex h-7 w-28 items-center justify-center rounded-md bg-[#3a3f5c] p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#2f3451]"
                                >
                                    Simpan ke file
                                </button>
                            </div>
                        )}
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
                            id="zoomIn"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-zoom-in" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => HandleZoomIn(setZoomScale)}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            id="zoomOut"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-zoom-out" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => HandleZoomOut(setZoomScale)}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            cssClass="e-primary e-small"
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                marginTop: '-10px',
                            }}
                        >
                            <span className="e-icons e-undo" style={{ fontSize: '32px' }} onClick={handleRotateLeft}></span>
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass="e-primary e-small"
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                marginTop: '-20px',
                            }}
                        >
                            <span className="e-icons e-redo" style={{ fontSize: '32px' }} onClick={handleRotateRight}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            id="close"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-close" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={() => HandleCloseZoom(setIsOpenPreview)}></span>
                        </ButtonComponent>
                    </div>
                </div>
            )}
        </DialogComponent>
    );
};

export default BaruEditCashCount;
