import React, { useRef, useState } from 'react';
import { BkListApi, DataDetailDok, GetPeriode } from '../model/api';
import withReactContent from 'sweetalert2-react-content';
import styles from '../prabkklist.module.css';
import swal from 'sweetalert2';
import moment from 'moment';
import { Token } from '@mui/icons-material';
import { Grid } from '@syncfusion/ej2-react-grids';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent, SelectedEventArgs, FileInfo } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { frmNumber } from '@/utils/routines';
import { resExcel, resPdf, resUnknow, resWord, resZip } from '../../bm/component/resource';
import JSZip from 'jszip';
import axios from 'axios';
import Swal from 'sweetalert2';

const swalToast = swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 3000,
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

const ButtonUbah = (kode_dok: any, tipe: any) => {
    const base64EncodedString = btoa(`kode_dokumen=${kode_dok}&tipe=${tipe}`);
    return base64EncodedString;
};

const ButtonDetailDok = (kode_dok: any) => {
    return kode_dok;
};

const OnClick_CetakForm = (selectedRowKodeDok: any, kode_entitas: string) => {
    if (selectedRowKodeDok === '') {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px;color:white;">Silahkan pilih data terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
        return;
    }

    let height = window.screen.availHeight - 150;
    let width = window.screen.availWidth - 200;
    let leftPosition = window.screen.width / 2 - (width / 2 + 10);
    let topPosition = window.screen.height / 2 - (height / 2 + 50);

    let iframe = `
            <html><head>
            <title>Form Tanda Terima Barang | Next KCN Sytem</title>
            <style>body, html {width: 100%; height: 100%; margin: 0; padding: 0}</style>
            </head><body>
            <iframe src="./report/form_ttb?entitas=${kode_entitas}&kode_ttb=${selectedRowKodeDok}" style="height:calc(100% - 4px);width:calc(100% - 4px)"></iframe>
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

const SearchData = (jenisPencarian: any, keyword: any, recordsData: any[]) => {
    if (jenisPencarian === 'pencarianNoDok') {
        if (keyword === '') {
            return recordsData;
        } else {
            // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
            const filteredData = recordsData.filter((item) => item.no_dokumen.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    } else if (jenisPencarian === 'pencarianNama') {
        if (keyword === '') {
            // Jika keyword kosong, kembalikan semua data
            return recordsData;
        } else {
            // Lakukan pencarian di sini, misalnya dengan filter data berdasarkan kata kunci
            const filteredData = recordsData.filter((item) => item.keterangan.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    }
};

const EksekusiPencarian = async (jenisPencarian: any, event: string, setSearch: Function, setFilteredData: Function, recordsData: any[]) => {
    if (jenisPencarian === 'PencarianNama') {
        const searchValue = event;
        setSearch(searchValue);
        const filteredData = SearchData('pencarianNama', searchValue, recordsData);
        setFilteredData(filteredData);

        const cariNama = document.getElementById('cariNama') as HTMLInputElement;
        if (cariNama) {
            cariNama.value = '';
        }
    } else if (jenisPencarian === 'PencarianNo') {
        const searchValue = event;
        setSearch(searchValue);
        const filteredData = SearchData('pencarianNoDok', searchValue, recordsData);
        setFilteredData(filteredData);

        const cariNoReff = document.getElementById('cariNoReff') as HTMLInputElement;
        if (cariNoReff) {
            cariNoReff.value = '';
        }
    }
};

const SetDataDokumen = async (
    tipe: string,
    selectedRowKodeDok: string,
    kode_entitas: string,
    dataDetailDok: any,
    router: any,
    setSelectedItem: Function,
    setDetailDok: Function,
    token: any,
    jenistab: any
) => {
    if (selectedRowKodeDok !== '') {
        if (tipe === 'ubah') {
            const responseData: any[] = await GetPeriode(kode_entitas, token);
            const periode = responseData[0].periode;
            const tanggalMomentPeriode = moment(periode, 'YYYYMM');
            const periodeTahunBulan = tanggalMomentPeriode.format('YYYYMM');

            const tglPembanding = moment(dataDetailDok.tgl_dokumen).format('YYYYMM');

            // Mendapatkan tahun dan bulan dari setiap tanggal
            const yearA = parseInt(periodeTahunBulan.substring(0, 4));
            const monthA = parseInt(periodeTahunBulan.substring(4, 6));

            const yearB = parseInt(tglPembanding.substring(0, 4));
            const monthB = parseInt(tglPembanding.substring(4, 6));

            if (yearB < yearA || (yearB === yearA && monthB < monthA)) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px; color:white">Tanggal Transaksi lebih kecil dari periode yang sekarang, tidak bisa dikoreksi.</p>',
                    width: '100%',
                    customClass: {
                        popup: styles['colored-popup'], // Custom class untuk sweetalert
                    },
                });
            } else {
                const result = ButtonUbah(selectedRowKodeDok, 'Ubah');
                router.push({ pathname: './prabkk', query: { str: result } });
            }
        } else if (tipe === 'detailDok') {
            const result = ButtonDetailDok(selectedRowKodeDok);
            // console.log(result);
            setSelectedItem(result);
            ListDetailDok(result, jenistab, kode_entitas, setDetailDok, token);
        } else if (tipe === 'cetak') {
            OnClick_CetakForm(selectedRowKodeDok, kode_entitas);
        }
    } else {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: '<p style="font-size:12px; color:white;">Silahkan pilih data terlebih dahulu</p>',
            width: '100%',
            customClass: {
                popup: styles['colored-popup'], // Custom class untuk sweetalert
            },
        });
    }
};

const ListDetailDok = async (kodeDok: any, jenisTab: any, kode_entitas: any, setDetailDok: Function, token: any) => {
    try {
        const result: any[] = await DataDetailDok(kodeDok, jenisTab, kode_entitas, token);

        const modifiedDetailDok: any = result.map((item: any) => ({
            ...item,
            debet_rp: item.debet_rp === '0.0000' ? '' : frmNumber(parseFloat(item.debet_rp)),
            kredit_rp: item.kredit_rp === '0.0000' ? '' : frmNumber(parseFloat(item.kredit_rp)),
            jumlah_mu: item.jumlah_mu === '0.0000' ? '' : frmNumber(parseFloat(item.jumlah_mu)),
            kurs: frmNumber(parseFloat(item.kurs)),
        }));

        await setDetailDok(modifiedDetailDok);
    } catch (error) {
        console.error('Error:', error);
    }
};

// const refreshDataList = async (paramList: any, setDetailList: Function, dsGridList: Grid, token: any, setProgressValue: Function, setDisplayedProgress: Function, setLoadingMessage: Function) => {
//     try {
//         await BkListApi(paramList, token, progress)
//             .then((result: any) => {
//                 setProgressValue(progress);
//                 setDisplayedProgress(Math.round(progress));

//                 if (progress < 30) {
//                     setLoadingMessage('Initializing data fetch...');
//                     setDetailList(result);
//                 } else if (progress < 60) {
//                     setLoadingMessage('Processing records...');
//                     dsGridList.dataSource = result;
//                 } else if (progress < 90) {
//                     setLoadingMessage('Almost complete...');
//                 } else {
//                     setLoadingMessage('Finalizing...');
//                 }
//                 // setDetailList(result);
//                 // dsGridList.dataSource = result;
//             })
//             .catch((error) => {
//                 console.error('Error:', error.message);
//             });

//         setTimeout(() => {}, 500);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };

const refreshDataList = async (
    paramList: any,
    setDetailList: Function,
    dsGridList: Grid,
    token: any,
    setIsLoadingProgress: Function,
    setProgressValue: Function,
    setDisplayedProgress: Function,
    setLoadingMessage: Function
) => {
    try {
        setIsLoadingProgress(true);
        setProgressValue(0);
        setDisplayedProgress(0);
        setLoadingMessage('Fetching data...');
        // console.log('paramList xxxxxxxx', paramList);
        await BkListApi(paramList, token, (progress: number) => {
            setProgressValue(progress);
            setDisplayedProgress(Math.round(progress));

            if (progress < 30) {
                setLoadingMessage('Initializing data fetch...');
            } else if (progress < 60) {
                setLoadingMessage('Processing records...');
            } else if (progress < 90) {
                setLoadingMessage('Almost complete...');
            } else {
                setLoadingMessage('Finalizing...');
            }
        })
            .then((result: any) => {
                setDetailList(result);
                dsGridList.dataSource = result;

                setProgressValue(100);
                setDisplayedProgress(100);
                setLoadingMessage('Complete!');

                setTimeout(() => {
                    setIsLoadingProgress(false);
                    setProgressValue(0);
                    setDisplayedProgress(0);
                }, 500);
            })
            .catch((error) => {
                setIsLoadingProgress(false);
                setProgressValue(0);
                setDisplayedProgress(0);
                console.error('Error:', error.message);
            });

        // Hapus setTimeout kosong karena tidak diperlukan
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const handleInputJumlah = (name: any, value: any) => {
    const jumlah_mu = document.getElementById('jumlah_mu') as HTMLInputElement;
    if (jumlah_mu) {
        return (jumlah_mu.value = frmNumber(value));
    }
};

// ======================IMAGE UPLOAD=================================
// const [jsonImageEdit, setJsonImageEdit] = useState([]);
// const [isSaving, setIsSaving] = useState(false);
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

const handleFileSelect = async (args: any, jenis: any, imageState: any, setImageState: Function) => {
    const file = args.filesData[0].rawFile;
    const fileName = file.name.toLowerCase(); // Ubah nama file ke huruf kecil
    const fileExtension = fileName.split('.').pop()?.toLowerCase(); // Ambil ekstensi file dalam huruf kecil

    if (jenis === '1') {
        setImageState((prevData: any) => ({
            ...prevData,
            nameImage: 'BK' + moment().format('YYMMDDHHmmss') + '.' + fileExtension,
        }));
    } else if (jenis === '2') {
        setImageState((prevData: any) => ({
            ...prevData,
            nameImage2: 'BK' + moment().format('YYMMDDHHmmss') + '.' + fileExtension,
        }));
    } else if (jenis === '3') {
        setImageState((prevData: any) => ({
            ...prevData,
            nameImage3: 'BK' + moment().format('YYMMDDHHmmss') + '.' + fileExtension,
        }));
    } else if (jenis === '4') {
        setImageState((prevData: any) => ({
            ...prevData,
            nameImage4: 'BK' + moment().format('YYMMDDHHmmss') + '.' + fileExtension,
        }));
    }

    const reader = new FileReader();
    const cekImage = imageState;

    reader.onload = (e: any) => {
        if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
            const IDjenisGambar = document.getElementsByClassName('e-upload-files');

            if (jenis === '1') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview: e.target.result as string,
                }));
                IDjenisGambar[0]?.setAttribute('id', jenis);
            } else if (jenis === '2') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview2: e.target.result as string,
                }));
                IDjenisGambar[1]?.setAttribute('id', jenis);
            } else if (jenis === '3') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview3: e.target.result as string,
                }));
                IDjenisGambar[2]?.setAttribute('id', jenis);
            } else if (jenis === '4') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview4: e.target.result as string,
                }));
                IDjenisGambar[3]?.setAttribute('id', jenis);
            }
        } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
            if (jenis === '1') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview: resExcel,
                }));
            } else if (jenis === '2') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview2: resExcel,
                }));
            } else if (jenis === '3') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview3: resExcel,
                }));
            } else if (jenis === '4') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview4: resExcel,
                }));
            }
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            if (jenis === '1') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview: resWord,
                }));
            } else if (jenis === '2') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview2: resWord,
                }));
            } else if (jenis === '3') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview3: resWord,
                }));
            } else if (jenis === '4') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview4: resWord,
                }));
            }
        } else if (fileExtension === 'zip' || fileExtension === 'rar') {
            if (jenis === '1') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview1: resZip,
                }));
            } else if (jenis === '2') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview2: resZip,
                }));
            } else if (jenis === '3') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview3: resZip,
                }));
            } else if (jenis === '4') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview4: resZip,
                }));
            }
        } else if (fileExtension === 'pdf') {
            if (jenis === '1') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview: resPdf,
                }));
            } else if (jenis === '2') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview2: resPdf,
                }));
            } else if (jenis === '3') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview3: resPdf,
                }));
            } else if (jenis === '4') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview4: resPdf,
                }));
            }
        } else {
            if (jenis === '1') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview: resUnknow,
                }));
            } else if (jenis === '2') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview2: resUnknow,
                }));
            } else if (jenis === '3') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview3: resUnknow,
                }));
            } else if (jenis === '4') {
                setImageState((prevData: any) => ({
                    ...prevData,
                    preview4: resUnknow,
                }));
            }
        }
    };

    if (file) {
        reader.readAsDataURL(file);
    }
};

const handleRemove = (jenis: any, imageState: any, setImageState: Function) => {
    if (jenis === '1') {
        setImageState((prevData: any) => ({
            ...prevData,
            preview: null,
        }));
        const element: any = document.getElementById(jenis);
        // element.parentNode.removeChild(element);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
        // const element = document.getElementById(jenis);
        // element.querySelectorAll(`:scope > #${jenis}`);
    } else if (jenis === '2') {
        setImageState((prevData: any) => ({
            ...prevData,
            preview2: null,
        }));
        // const element: any = document.querySelector('.e-upload-file-list');
        const element: any = document.getElementById(jenis);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
    } else if (jenis === '3') {
        setImageState((prevData: any) => ({
            ...prevData,
            preview3: null,
        }));
        // const element: any = document.querySelector('.e-upload-file-list');
        const element: any = document.getElementById(jenis);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
    } else if (jenis === '4') {
        // setPreview4(null);
        // setImageState({
        //     ...imageState,
        //     preview4: null,
        // });
        setImageState((prevData: any) => ({
            ...prevData,
            preview4: null,
        }));
        // const element: any = document.querySelector('.e-upload-file-list');
        const element: any = document.getElementById(jenis);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
    } else if (jenis === 'all') {
        withReactContent(Swal)
            .fire({
                html: 'Apakah anda akan membersihkan semua gambar?',
                width: '20%',
                target: '#FrmPraBkk',
                showCancelButton: true,
                confirmButtonText: '<p style="font-size:10px">Ya</p>',
                cancelButtonText: '<p style="font-size:10px">Tidak</p>',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    setImageState((prevData: any) => ({
                        ...prevData,
                        preview: null,
                        preview2: null,
                        preview3: null,
                        preview4: null,
                    }));
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
// const [jsonImageEdit, setJsonImageEdit] = useState([]);
const handleUpload = async (
    kode_dokumen: any,
    imageState: any,
    kode_entitas: any,
    masterDataState: any,
    masterKodeDokumen: any,
    uploaderRef: any,
    uploaderRef2: any,
    uploaderRef3: any,
    uploaderRef4: any,
    jsonImageEdit: any
) => {
    // console.log({
    //     kode_dokumen,
    //     imageState,
    //     kode_entitas,
    //     masterDataState,
    //     masterKodeDokumen,
    //     uploaderRef,
    //     uploaderRef2,
    //     uploaderRef3,
    //     uploaderRef4,
    //     jsonImageEdit,
    // });
    if (uploaderRef.current && uploaderRef2.current && uploaderRef3.current && uploaderRef4.current) {
        const filesArray = [
            imageState.preview ? [{ rawFile: await fetch(imageState.preview).then((res) => res.blob()), fileName: imageState.nameImage }] : uploaderRef.current.getFilesData(), // ubah menjadi fileuploader
            imageState.preview2 ? [{ rawFile: await fetch(imageState.preview2).then((res) => res.blob()), fileName: imageState.nameImage2 }] : uploaderRef2.current.getFilesData(), // ubah menjadi fileuploader
            imageState.preview3 ? [{ rawFile: await fetch(imageState.preview3).then((res) => res.blob()), fileName: imageState.nameImage3 }] : uploaderRef3.current.getFilesData(), // ubah menjadi fileuploader
            imageState.preview4 ? [{ rawFile: await fetch(imageState.preview4).then((res) => res.blob()), fileName: imageState.nameImage4 }] : uploaderRef4.current.getFilesData(), // ubah menjadi fileuploader
        ];
        const nameImages = [imageState.nameImage, imageState.nameImage2, imageState.nameImage3, imageState.nameImage4];
        const zip = new JSZip();
        let filesAdded = false;

        filesArray.forEach((files, index) => {
            if (files.length > 0) {
                const file = files[0].rawFile;
                zip.file(nameImages[index], file);
                filesAdded = true;
            }
        });
        // console.log(filesAdded);
        if (filesAdded) {
            try {
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const formData = new FormData();
                formData.append('myimage', zipBlob, `IMG_${kode_dokumen}.zip`);
                formData.append('ets', kode_entitas);
                formData.append('nama_file_image', `IMG_${kode_dokumen}.zip`); // dari response simpan ju

                const response = await axios.post(`${apiUrl}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    const result = response.data;
                    // console.log('Upload successful:', result);
                    // myAlert('Berhasil Upload');

                    const createJson = (id: any, nameImage: any) => ({
                        entitas: kode_entitas,
                        kode_dokumen: kode_dokumen, // dari response simpan
                        id_dokumen: id,
                        dokumen: 'BK',
                        filegambar: nameImage,
                        fileoriginal: 'defaulf-file',
                    });

                    const jsonZip = {
                        entitas: kode_entitas,
                        kode_dokumen: kode_dokumen, // dari response simpan
                        id_dokumen: '999', //default
                        dokumen: 'BK',
                        filegambar: `IMG_${kode_dokumen}.zip`, // dari response simpan
                        fileoriginal: 'defaulf - file.zip',
                    };

                    const combinedArray = filesArray.map((files, index) => (files.length > 0 ? createJson(index + 1, nameImages[index]) : null)).filter(Boolean);

                    combinedArray.push(jsonZip);
                    // jika edit
                    // cari id yang tidak ada disini untuk dihapus
                    if (masterDataState === 'EDIT') {
                        const combinedIds = combinedArray.map((item: any) => item.id_dokumen.toString());
                        const editIds = jsonImageEdit.map((item: any) => item.id_dokumen.toString());
                        const missingIds = editIds.filter((id: any) => !combinedIds.includes(id));
                        const paramsArrayDelete = missingIds.join(',');

                        if (paramsArrayDelete !== '') {
                            //DELETE TB_IMAGES
                            try {
                                const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                                    params: {
                                        entitas: kode_entitas,
                                        param1: masterKodeDokumen,
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
                        // console.log('simpan fungsi ke database image');
                        return insertResponse.data;
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
            // console.log('Tanpa Gambar // tidak ada perubahan');

            //kondisi jika gambar dihapus semua

            //hapus semua
            if (jsonImageEdit.length > 0) {
                try {
                    const response = await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                        params: {
                            entitas: kode_entitas,
                            param1: masterKodeDokumen,
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
// ======================END IMAGE UPLOAD====================================

const HandleRowSelected = async (args: any, setSelectedRowKodeDokumen: Function) => {
    setSelectedRowKodeDokumen(args.data?.kode_dokumen);
};

const rowSelectingListData = async (args: any, setDetailListPraBkk: Function, kode_entitas: string, setDetailDok: Function, token: any, jenisTab: any) => {
    // rowIdxListData.current = args.rowIndex;
    // await ListDetailDok(args.data?.kode_dokumen, jenisTab, kode_entitas, setDetailDok, token);
    await setDetailListPraBkk((prevState: any) => ({
        ...prevState,
        kode_dokumen: args.data?.kode_dokumen,
        no_dokumen: args.data?.no_dokumen,
        tgl_dokumen: args.data?.tgl_dokumen,
    }));
};
export {
    EksekusiPencarian,
    OnClick_CetakForm,
    SetDataDokumen,
    refreshDataList,
    handleInputJumlah,
    handleFileSelect,
    handleRemove,
    handleUpload,
    ListDetailDok,
    rowSelectingListData,
    HandleRowSelected,
};
