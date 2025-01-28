import swal from 'sweetalert2';
import { frmNumber } from '@/utils/routines';
import { useRouter } from 'next/router';
import withReactContent from 'sweetalert2-react-content';
import { GetTbImages, ListCustFilter } from '../model/api';
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

import React from 'react';

export default function fungsiFormTtb() {
    return <div>fungsiFormTtb</div>;
}

const HandleModalChange = (event: any, tipe: string, setChangeNumber: Function, setHandleNamaCust: Function, setModal1: Function, setSearchNamaCust: Function) => {
    setChangeNumber((prevTotal: number) => prevTotal + 1);
    if (tipe === 'customer') {
        setSearchNamaCust(event);
        setHandleNamaCust(event);
        setModal1(true);
    }
};

const HandleSelectedData = (dataObject: any, tipe: string, setCustSelected: Function, setCustSelectedKode: Function, setSelectedKodeRelasi: Function, setModal2: Function) => {
    const { nama_relasi, kode_cust, kode_relasi } = dataObject;
    setCustSelected(nama_relasi);
    setCustSelectedKode(kode_cust);
    setSelectedKodeRelasi(kode_relasi);
    if (tipe === 'row') {
        setModal2(true);
    }
    // else if (tipe === 'daftarPP') {
    //     setModal5(true);
    // }
};

const HandleModalItem = async (tipe: string, id: any, setRowId: Function, setModCustRow: Function, custSelected: string, setModal2: Function) => {
    setRowId(id);

    if (custSelected === '') {
        swal.fire({
            title: 'Customer belum diisi',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'custom-popup-class',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                await setModCustRow(true);
                // if (suppSelected !== '') {
                //     await setModal6(true);
                // }
            }
        });
    } else if (tipe === 'no_sj') {
        setModal2(true);
    }
};

const refKodeGudang = { current: '' };
const refNamaGudang = { current: '' };
const refAlasan = { current: '' };
const HandleGudangChange = (kode_gudang: string, event: string, setSelectedOptionGudang: Function, setSelectedOptionKodeGudang: Function) => {
    const newValue = event;
    setSelectedOptionGudang(newValue);
    setSelectedOptionKodeGudang(kode_gudang);
    refKodeGudang.current = kode_gudang;
    refNamaGudang.current = newValue;
};

const HandleAlasanChange = (event: string, setSelectedOptionAlasan: Function) => {
    const newValue = event;
    setSelectedOptionAlasan(newValue);
    refAlasan.current = newValue;
};

const HandleBatal = (router: any) => {
    router.push({ pathname: './ttblist' });
};

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

const swalPopUp = swal.mixin({
    toast: true,
    position: 'center',
    customClass: {
        popup: 'colored-toast',
    },
    showConfirmButton: false,
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

const HandleModaliconChange = async (
    tipe: string,
    dataDetail: any,
    custSelected: any,
    setHandleNamaCust: Function,
    setModal1: Function,
    kode_entitas: any,
    setDsDaftarCustomer: Function,
    setDataBarang: Function
) => {
    try {
        const response = await ListCustFilter(kode_entitas, 'all', 'all', 'all');
        await setDsDaftarCustomer(response.data);
        if (response.status) {
            const cekNoSj = await dataDetail?.nodes.some((row: { no_sj: string }) => row.no_sj === '');
            if (dataDetail?.nodes.length <= 0) {
                await setHandleNamaCust('');
                await setModal1(true);
            } else {
                if (cekNoSj === true) {
                    await setDataBarang((state: any) => ({
                        ...state,
                        nodes: [],
                    }));
                    await setHandleNamaCust('');
                    await setModal1(true);
                } else {
                    withReactContent(swalDialog).fire({
                        icon: 'error',
                        title: `<span style='color: gray; font-weight: bold;'>Data TTB telah terisi dengan Customer ${custSelected} Untuk mengganti customer, kosongkan data TTB terlebih dahulu</span>`,
                        width: '20%',
                        target: '#dialogTtbList',
                        confirmButtonText: 'Ok',
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const HandleCaraPengiriman = (event: any, setSelectedCaraPengiriman: Function) => {
    setSelectedCaraPengiriman(event);
};

const HandleModalItemChange = (
    event: string,
    tipe: string,
    id: any,
    custSelected: any,
    setModCustRow: Function,
    setTotalNum: Function,
    setNilaiValueNoSj: Function,
    setTipeValue: Function,
    setModal2: Function
) => {
    if (custSelected === '') {
        swal.fire({
            title: 'Customer belum diisi',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
            customClass: {
                popup: 'custom-popup-class',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                await setModCustRow(true);
                setTotalNum((prevTotal: any) => prevTotal + Number(id));

                // Menghapus await jika tidak menggunakan hasilnya
                // setNilaiValueNoBarang('');
                // setNilaiValueNamaBarang('');
                setNilaiValueNoSj('');

                if (tipe === 'no_sj') {
                    setNilaiValueNoSj(event);
                    setTipeValue(tipe);
                    // setNilaiValueNamaBarang('');
                    // setNilaiValueNoBarang('');
                }
            }
        });
    } else {
        setTotalNum((prevTotal: any) => prevTotal + Number(id));
        setNilaiValueNoSj(event);
        setTipeValue(tipe);
        setModal2(true);
    }
};

const HandleDaftarSj = async (tipe: any, custSelectedKode: any, setHandleKodeRelasiDaftarSj: Function, setModal3: Function) => {
    if (tipe === 'Ubah') {
        await setHandleKodeRelasiDaftarSj(custSelectedKode);
        await setModal3(true);
    } else {
        await setHandleKodeRelasiDaftarSj('%');
        await setModal3(true);
    }
};

const HandelCatatan = (e: any, setCatatanValue: Function) => {
    setCatatanValue(e);
};

const HandleRemoveAllRows = async (dataDetail: any, setDataDetail: Function, handleSubmit: Function) => {
    if (dataDetail?.nodes.length > 0) {
        const hasEmptyFields = dataDetail?.nodes.some((row: { nama_barang: string }) => row.nama_barang === '');
        if (!hasEmptyFields) {
            setDataDetail((state: any) => ({
                ...state,
                nodes: [],
            }));
            handleSubmit();
            // setButtonDisabled(false);
        } else {
            // Jika ada field yang kosong, Anda dapat menangani kasus ini di sini
        }
    } else {
        swal.fire({
            title: 'Tidak ada baris yang tersedia untuk dihapus.',
            icon: 'error',
        });
    }
};

const HandleRemoveRowsOtomatis = (setDataDetail: Function) => {
    setDataDetail((state: any) => ({
        ...state,
        nodes: state?.nodes.filter((node: any) => node.nama_barang !== ''),
    }));
};

const HandleRemoveRows = async (dataDetail: any, idRowRemove: any, setDataDetail: Function, handleSubmit: Function) => {
    if (dataDetail?.nodes.length > 0) {
        const hasEmptyFields = dataDetail?.nodes.some((row: { nama_barang: string }) => row.nama_barang === '');
        if (hasEmptyFields === true && dataDetail?.nodes.length === 1) {
            swal.fire({
                html: "<span style='color: gray; font-weight: bold;'>Tidak bisa menghapus baris data terakhir, sisakan setidaknya 1 baris data untuk ditampilkan.</span>",
                icon: 'error',
            });
        } else if (idRowRemove > 0) {
            swal.fire({
                html: `<span style='color: gray; font-weight: bold;'>Hapus Data Barang Rows Id ${idRowRemove} ?</span>`,
                showCancelButton: true,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    setDataDetail((state: any) => ({
                        ...state,
                        nodes: state?.nodes.filter((node: any) => node.id !== idRowRemove),
                    }));
                    if (dataDetail?.nodes.length <= 1) {
                        handleSubmit();
                    }
                    // setButtonDisabled(false);
                }
            });
        } else {
            swal.fire({
                html: `<span style='color: gray; font-weight: bold;'>Hapus Semua Data Barang ?</span>`,
                showCancelButton: true,
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    setDataDetail((state: any) => ({
                        ...state,
                        nodes: [],
                    }));
                    handleSubmit();
                    // setButtonDisabled(false);
                }
            });
        }
    }
};

const HandleKirimIdRemove = (idRow: any, setIdRowRemove: Function) => {
    setIdRowRemove(idRow);
};

// Fungsi untuk mengonversi base64 ke Blob
function base64ToBlob(base64: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

// Fungsi untuk membuat objek File dari Blob
function blobToFile(blob: any, fileName: any) {
    blob.lastModifiedDate = new Date();
    return new File([blob], fileName, { type: blob.type, lastModified: blob.lastModifiedDate });
}

const LoadDataImage = async (
    kode_ttb: any,
    kode_entitas: any,
    setLoadFilePendukung: Function,
    setSelectedFiles: Function,
    setNamaFiles: Function,
    setNamaFilesExt1: Function,
    setExtractedFiles: Function
) => {
    const responseDataImage = await GetTbImages(kode_entitas, kode_ttb);
    setLoadFilePendukung(responseDataImage);
    let vnamaZip = 'IMG_' + kode_ttb + '.zip';

    const responsePreviewImg = await fetch(`${apiUrl}/erp/extrak_zip?entitas=${kode_entitas}&nama_zip=${vnamaZip}`);
    const data = await responsePreviewImg.json();
    if (data.status === true) {
        const newFiles = data.images
            .filter((item: any) => responseDataImage.some((dataItem: any) => dataItem.filegambar === item.fileName))
            .map((item: any, index: any) => {
                // Hilangkan prefix 'data:image/jpg;base64,' jika ada
                const base64String = item.imageUrl.split(',')[1];
                const contentType = 'image/jpeg'; // menyesuaikan dengan tipe File
                const fileName = item.fileName;

                const blob = base64ToBlob(base64String, contentType);
                const matchedItem = responseDataImage.find((dataItem: any) => dataItem.filegambar === fileName);

                return {
                    file: blobToFile(blob, fileName),

                    responseIndex: matchedItem ? matchedItem.id_dokumen : null,
                };
            });

        // const uniqueFormattedNames = newFiles.map((_: any, index: any) => `${formattedName}${index}`);
        const uniqueFormattedNames = responseDataImage
            .map((fileObj: any) => fileObj.filegambar)
            .filter((fileName: string) => !fileName.endsWith('.zip'))
            .map((fileName: string) => fileName.replace(/\.(jpg|jpeg|png)$/, '').replace('TTB', ''));

        setSelectedFiles((prevFiles: any) => [
            ...prevFiles,
            ...newFiles.map((item: any) => ({
                file: item.file,
                tabIndex: item.responseIndex,
                responseIndex: item.responseIndex,
            })),
        ]);

        setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, ...uniqueFormattedNames]);

        // Mengambil nama file pertama untuk setNamaFilesExt1
        if (newFiles.length > 0) {
            setNamaFilesExt1(newFiles[0].file.name);
        }

        setExtractedFiles(data.images);
    } else {
        setExtractedFiles([]);
    }
};

const OpenPreview = (
    index: any,
    setIndexPreview: Function,
    setIsOpenPreview: Function,
    setZoomScale: Function,
    setPosition: Function,
    loadFilePendukung: any,
    extractedFiles: any,
    setImageDataUrl: Function
) => {
    setIndexPreview(index);
    setIsOpenPreview(true);
    setZoomScale(0.5); // Reset zoom scale
    setPosition({ x: 0, y: 0 }); // Reset position

    const foundItem = loadFilePendukung.find((item: any) => item.id_dokumen === index);
    if (foundItem) {
        const filegambar = foundItem?.filegambar;
        if (filegambar) {
            const imageUrl = extractedFiles.find((item: any) => item.fileName === filegambar)?.imageUrl;
            setImageDataUrl(imageUrl || '');
        }
    } else {
        setImageDataUrl([]);
    }
};

const OpenPreviewInsert = (
    index: any,
    setIndexPreview: Function,
    setIsOpenPreview: Function,
    setZoomScale: Function,
    setPosition: Function,
    loadFilePendukung: any,
    extractedFiles: any,
    setImageDataUrl: Function,
    images: any
) => {
    setIndexPreview(index);
    setIsOpenPreview(true);
    setZoomScale(0.5); // Reset zoom scale
    setPosition({ x: 0, y: 0 }); // Reset position

    if (!images[index]) {
        const foundItem = loadFilePendukung.find((item: any) => item.id_dokumen === index);
        const filegambar = foundItem?.filegambar;
        if (filegambar) {
            const imageUrl = extractedFiles.find((item: any) => item.fileName === filegambar)?.imageUrl;
            setImageDataUrl(imageUrl || '');
        }
    } else {
        setImageDataUrl(images[index][0]);
    }
};

const HandleCloseZoom = (setIsOpenPreview: Function, setImageDataUrl: Function) => {
    setIsOpenPreview(false);
    setImageDataUrl('');
};

const HandleWheel = (event: any, setZoomScale: Function) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        // Scroll up
        setZoomScale((prevScale: any) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
    } else {
        // Scroll down
        setZoomScale((prevScale: any) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
    }
};

const HandleZoomIn = (setZoomScale: Function) => {
    setZoomScale((prevScale: any) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
};

const HandleZoomOut = (setZoomScale: Function) => {
    setZoomScale((prevScale: any) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
};

export {
    OpenPreviewInsert,
    HandleCloseZoom,
    HandleWheel,
    HandleZoomIn,
    HandleZoomOut,
    OpenPreview,
    LoadDataImage,
    refKodeGudang,
    refNamaGudang,
    refAlasan,
    swalDialog,
    swalPopUp,
    // HandleRemoveRows,
    HandleModalChange,
    HandleSelectedData,
    HandleModalItem,
    HandleGudangChange,
    HandleAlasanChange,
    HandleBatal,
    HandleModaliconChange,
    HandleCaraPengiriman,
    HandleModalItemChange,
    HandleDaftarSj,
    HandelCatatan,
    HandleRemoveAllRows,
    HandleRemoveRowsOtomatis,
    HandleRemoveRows,
    HandleKirimIdRemove,
};
