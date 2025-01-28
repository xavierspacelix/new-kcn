import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { FaCalendar, FaCamera, FaCross } from 'react-icons/fa';
import { loadCldr, L10n } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from 'public/syncfusion/locale.json';
import moment from 'moment';
L10n.load(idIDLocalization);
import DatePicker from 'react-datepicker';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { IoIosClose } from 'react-icons/io';

import { id } from 'date-fns/locale';
import { downloadBase64Image, resetFilePendukung } from '../function/function';
import Swal from 'sweetalert2';
import PDFForm from './PDFForm';
import { useSession } from '@/pages/api/sessionContext';
import axios from 'axios';
import GlobalProgressBar from '@/components/GlobalProgressBar';
import { useProgress } from '@/context/ProgressContext';

const forDialogAndSwallOriKendaraanMaster = ({
    masterData,
    masterState,
    visible,
    onClose,
    refreshData,
    bokflag = false,
}: {
    masterData: any;
    masterState: any;
    visible: boolean;
    onClose: Function;
    refreshData: Function;
    bokflag: boolean;
}) => {
    const { sessionData } = useSession();
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const token = sessionData?.token ?? '';
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const { startProgress, isLoading, updateProgress, endProgress, setLoadingMessage } = useProgress();
    const header = 'Kendaraan ' + masterState + (Object?.keys(masterData || {}).length !== 0 && masterState !== 'BARU' ? ' Nomor : ' + masterData?.nopol : '');
    const [headeterState, setHeadeterState] = useState({
        no_kendaraan: '',
        merek: '',
        jenis_kendaraan: '',
        non_aktif: 'Y',
    });

    const styleButtonFilePendukung = {
        width: 125 + 'px',
        height: '28px',
        marginBottom: '0.5em',
        marginTop: 0.5 + 'em',
        marginRight: 0.8 + 'em',
        backgroundColor: '#3b3f5c',
    };
    const [jendelaPendukung, setJendelaPendukung] = useState('gambar');

    //file pendukung state
    const [tabUploadActive, setTabUploadActive] = React.useState<String | any>(0);
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

    const [informasiState, setInformasiState] = useState({
        nama_pemilik: '',
        alamat: '',
        no_bpkb: '',
        tahun_pembuatan: '',
        no_mesin: '',
        isi_silinder_cc: '',
        no_rangka: '',
        warna: '',
        kapasitas_angkutan_kg: '',
        minimal_tonase_kg: '',
        armada_pengiriman_barang: 'N',
        hitung_kpi: 'N',
        tgl_berlaku_stnk: '',
        biaya_adm_stnk_tnkb: '',
        tgl_berlaku_pajak: '',
        biaya_pkb: '',
        tgl_registrasi_kir: '',
        biaya_registrasi_kir: '',
        nama_dealer: '',
        tgl_beli: '',
        harga_beli_otr: '',
        tgl_operasional_awal: '',
        tgl_operasional_akhir: '',
    });
    const [lainLainState, setLainLainState] = useState({
        nama_leasing: '',
        no_kontrak: '',
        tgl: '',
        nama_debitur: '',
        alamat: '',
        nilai_uang_muka: '0',
        nilai_angsuran: '0',
        tgl_jatuh_tempo: '',
        nama_asuransi: '',
        no_polis: '',
        tgl_asuransi: '',
        nama_tergantung: '',
        alamat_asuransi: '',
        harga_patungan: '',
        tgl_jatuh_tempo_asuransi: '',
        catatan: '',
    });
    const [deleteFilePendukung, setDeleteFilePendukung] = React.useState<[] | any>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFiles, setUploadedFiles] = React.useState<{ [key: string]: File | null | any }>(resetFilePendukung());

    const handleHeaderChange = (e: any) => {
        const { name, value } = e.target;

        // Update filterState
        setHeadeterState((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const savedoc = async () => {
        startProgress();
        console.log('SAVE DOC');

        const dataSimpan = {
            entitas: kode_entitas,
            nopol: headeterState?.no_kendaraan === '' || null ? null : headeterState?.no_kendaraan,
            merek: headeterState?.merek === '' || null ? null : headeterState?.merek,
            jenis: headeterState?.jenis_kendaraan === '' || null ? null : headeterState?.jenis_kendaraan,
            aktif: headeterState?.non_aktif === '' || null ? null : headeterState?.non_aktif,
            nama: informasiState?.nama_pemilik === '' || null ? null : informasiState?.nama_pemilik,
            alamat: informasiState?.alamat === '' || null ? null : informasiState?.alamat,
            nobpkb: informasiState?.no_bpkb === '' || null ? null : informasiState?.no_bpkb,
            tahun_buat: informasiState?.tahun_pembuatan === '' || null ? null : informasiState?.tahun_pembuatan,
            nomesin: informasiState?.no_mesin === '' || null ? null : informasiState?.no_mesin,
            silinder: informasiState?.isi_silinder_cc === '' || null ? null : informasiState?.isi_silinder_cc,
            noranka: informasiState?.no_rangka === '' || null ? null : informasiState?.no_rangka,
            warna: informasiState?.warna === '' || null ? null : informasiState?.warna,
            kapasitas: informasiState?.kapasitas_angkutan_kg === '' || null ? null : parseFloat(informasiState?.kapasitas_angkutan_kg.replace(/,/g, '')),
            tonase: informasiState?.minimal_tonase_kg === '' || null ? null : parseFloat(informasiState?.minimal_tonase_kg.replace(/,/g, '')),
            armada_kirim: informasiState?.armada_pengiriman_barang === '' || null ? null : informasiState?.armada_pengiriman_barang,
            hitungkpi: informasiState?.hitung_kpi === '' || null ? null : informasiState?.hitung_kpi,
            tgl_stnk:
                informasiState?.tgl_berlaku_stnk === '' || null
                    ? null
                    : moment(informasiState?.tgl_berlaku_stnk).isValid()
                    ? moment(informasiState?.tgl_berlaku_stnk).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            nilai_stnk: informasiState?.biaya_adm_stnk_tnkb === '' || null ? null : parseFloat(informasiState?.biaya_adm_stnk_tnkb.replace(/,/g, '')),
            tgl_pajak:
                informasiState?.tgl_berlaku_pajak === '' || null
                    ? null
                    : moment(informasiState?.tgl_berlaku_pajak).isValid()
                    ? moment(informasiState?.tgl_berlaku_pajak).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            nilai_pajak: informasiState?.biaya_pkb === '' || null ? null : parseFloat(informasiState?.biaya_pkb.replace(/,/g, '')),
            tgl_kir:
                informasiState?.tgl_registrasi_kir === '' || null
                    ? null
                    : moment(informasiState?.tgl_registrasi_kir).isValid()
                    ? moment(informasiState?.tgl_registrasi_kir).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            nilai_kir: informasiState?.biaya_registrasi_kir === '' || null ? null : parseFloat(informasiState?.biaya_registrasi_kir.replace(/,/g, '')),
            dealer: informasiState?.nama_dealer === '' || null ? null : informasiState?.nama_dealer,
            tgl_beli: informasiState?.tgl_beli === '' || null ? null : moment(informasiState?.tgl_beli).isValid() ? moment(informasiState?.tgl_beli).format('YYYY-MM-DD HH:mm:ss') : null,
            harga_beli: informasiState?.harga_beli_otr === '' || null ? null : parseFloat(informasiState?.harga_beli_otr.replace(/,/g, '')),
            tgl_mulai:
                informasiState?.tgl_operasional_awal === '' || null
                    ? null
                    : moment(informasiState?.tgl_operasional_awal).isValid()
                    ? moment(informasiState?.tgl_operasional_awal).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            tgl_akhir:
                informasiState?.tgl_operasional_akhir === '' || null
                    ? null
                    : moment(informasiState?.tgl_operasional_akhir).isValid()
                    ? moment(informasiState?.tgl_operasional_akhir).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            leasing: lainLainState?.nama_leasing === '' || null ? null : lainLainState?.nama_leasing,
            no_kontrak: lainLainState?.no_kontrak === '' || null ? null : lainLainState?.no_kontrak,
            tgl_kontrak: lainLainState?.tgl === '' || null ? null : moment(lainLainState?.tgl).isValid() ? moment(lainLainState?.tgl).format('YYYY-MM-DD HH:mm:ss') : null,
            nama_kontrak: lainLainState?.nama_debitur === '' || null ? null : lainLainState?.nama_debitur,
            alamat_kontrak: lainLainState?.alamat === '' || null ? null : lainLainState?.alamat,
            nilai_um: lainLainState?.nilai_uang_muka === '' || null ? null : parseFloat(lainLainState?.nilai_uang_muka.replace(/,/g, '')),
            nilai_angsuran: lainLainState?.nilai_angsuran === '' || null ? null : parseFloat(lainLainState?.nilai_angsuran.replace(/,/g, '')),
            tgl_leasing:
                lainLainState?.tgl_jatuh_tempo === '' || null ? null : moment(lainLainState?.tgl_jatuh_tempo).isValid() ? moment(lainLainState?.tgl_jatuh_tempo).format('YYYY-MM-DD HH:mm:ss') : null,
            asuransi: lainLainState?.nama_asuransi === '' || null ? null : lainLainState?.nama_asuransi,
            no_polis: lainLainState?.no_polis === '' || null ? null : lainLainState?.no_polis,
            tgl_polis: lainLainState?.tgl_asuransi === '' || null ? null : moment(lainLainState?.tgl_asuransi).isValid() ? moment(lainLainState?.tgl_asuransi).format('YYYY-MM-DD HH:mm:ss') : null,
            nama_polis: lainLainState?.nama_tergantung === '' || null ? null : lainLainState?.nama_tergantung,
            alamat_polis: lainLainState?.alamat_asuransi === '' || null ? null : lainLainState?.alamat_asuransi,
            nilai_asuransi: lainLainState?.harga_patungan === '' ? null : parseFloat(lainLainState?.harga_patungan.replace(/,/g, '')),
            tgl_asuransi:
                lainLainState?.tgl_jatuh_tempo_asuransi === '' || null
                    ? null
                    : moment(lainLainState?.tgl_jatuh_tempo_asuransi).isValid()
                    ? moment(lainLainState?.tgl_jatuh_tempo_asuransi).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            catatan: lainLainState?.catatan === '' || null ? null : lainLainState?.catatan,
            personal: null,
            fileprefix: null,
            filegambar: null,
            filegambar2: null,
            filegambar3: null,
            filegambar4: null,
            filepdf: null,
            filepdf2: null,
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        try {
            const response: any = await axios.post(`${apiUrl}/erp/simpan_kendaraan?`, dataSimpan, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                await uploadGambarNoZip(dataSimpan.nopol);
                await refreshData();
                Swal.fire({ text: 'Berhasil Simpan!', target: '#forDialogAndSwall', timer: 1500 });
                await setTimeout(() => endProgress(), 700);

                onClose();
            }
        } catch (error: any) {
            if (error) {
                console.log(error);
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: error?.response?.data?.error,
                    target: '#forDialogAndSwallOri',
                    timer: 1500,
                    icon: 'warning',
                });
                await setTimeout(() => endProgress(), 700);
            }
        }
    };
    const getAllFilePendukung = async (id: any) => {
        //100BSKMPT10044
        setUploadedFiles(resetFilePendukung);
        try {
            const responseFilePendukung = await axios.get(`${apiUrl}/erp/get_tb_images?`, {
                params: {
                    entitas: kode_entitas,
                    param1: masterData.nopol,
                },
            });

            console.log('responseFilePendukung', responseFilePendukung?.data.data);

            responseFilePendukung?.data.data.map(async (item: any) => {
                console.log('terpanggil');

                const getImage = await axios.get(`${apiUrl}/erp/load_fileGambar_byId?`, {
                    params: {
                        entitas: kode_entitas,
                        param1: item.kode_dokumen,
                        param2: item.id_dokumen,
                        param3: kode_entitas,
                    },
                });
                const mimeType = getImage?.data.data[0].decodeBase64_string.split(':')[1].split(';')[0];
                // const blob = base64ToBlob(getImage?.data.data[0].decodeBase64_string, mimeType);
                const file = new File([getImage?.data.data[0].decodeBase64_string], item.filegambar, { type: mimeType });
                const temp: any = uploadedFiles;
                temp[parseInt(item.id_dokumen)] = { file: file, fileUrl: getImage?.data.data[0].decodeBase64_string, tabIndex: parseInt(item.id_dokumen) };
                setUploadedFiles(temp);
            });
        } catch (error) {}
    };

    // console.log('log ke id semua', uploadedFiles);

    const uploadGambarNoZip = async (id: any) => {
        if (masterState !== 'BARU') {
            // const indexDelete =

            const responseFilePendukung = await axios.get(`${apiUrl}/erp/get_tb_images?`, {
                params: {
                    entitas: kode_entitas,
                    param1: id,
                },
            });

            if (responseFilePendukung?.data.data.length !== 0) {
                const filePendukung_lama: any[] = [];
                const kodeDokumen = responseFilePendukung?.data.data[0].kode_dokumen;
                responseFilePendukung?.data.data.map((item: any) => {
                    filePendukung_lama.push(item.id_dokumen);
                });
                const result = filePendukung_lama.join(',');
                console.log('edit file pendukung', result);

                await axios.delete(`${apiUrl}/erp/hapus_file_pendukung`, {
                    params: {
                        entitas: kode_entitas,
                        param1: kodeDokumen,
                        param2: result,
                    },
                });

                await Promise.all(
                    responseFilePendukung?.data.data.map(async (item: any) => {
                        await axios.delete(`${apiUrl}/erp/hapus_file_pendukung_ftp`, {
                            params: {
                                entitas: kode_entitas,
                                param1: item.filegambar,
                            },
                        });
                    })
                );
            }
        }
        if (masterState !== '') {
            for (let index = 1; index <= Object?.keys(uploadedFiles || {}).length; index++) {
                if (index === 21) index = 51;
                if (index === 22) index = 52;
                if (uploadedFiles[index]?.file === null || uploadedFiles[index] === undefined) {
                    console.log('UPLOAD KELUAR DI INDEX ', index);

                    continue;
                }
                const formData = new FormData();
                const mimeType = uploadedFiles[index].fileUrl.split(':')[1].split(';')[0];
                const payload = base64ToBlob(uploadedFiles[index].fileUrl.split(',')[1], mimeType);
                console.log('payload', payload);
                formData.append('myimage', payload, uploadedFiles[index].file.name);
                formData.append('nama_file_image', uploadedFiles[index].file.name);
                formData.append('kode_dokumen', id);
                formData.append('dokumen', 'NP');
                formData.append('ets', kode_entitas);

                console.log('log ke id ', index);

                if (Object?.keys(uploadedFiles || {}).length > 0) {
                    try {
                        // Lakukan unggah menggunakan Axios
                        const response = await axios.post(`${apiUrl}/upload`, formData);

                        // console.log('UPLOAD PER IMAGE : ', response);

                        // Proses respon dari server
                        let jsonSimpan;

                        if (Array.isArray(response.data.nama_file_image)) {
                            jsonSimpan = response.data.nama_file_image.map((namaFile: any, index: any) => {
                                return {
                                    entitas: kode_entitas,
                                    kode_dokumen: id,
                                    id_dokumen: uploadedFiles[index].tabIndex,
                                    dokumen: 'NP',
                                    filegambar: namaFile,
                                    fileoriginal: response.data.filesinfo[index] ? response.data.filesinfo[index].fileoriginal : null,
                                };
                            });
                        } else {
                            jsonSimpan = {
                                entitas: kode_entitas,
                                kode_dokumen: id,
                                id_dokumen: uploadedFiles[index].tabIndex,
                                dokumen: 'NP',
                                filegambar: response.data.nama_file_image,
                                fileoriginal: response.data.filesinfo,
                            };
                        }

                        if (response.data.status === true) {
                            // if (selectedFile !== 'update') {
                            await axios
                                .post(`${apiUrl}/erp/simpan_tbimages`, jsonSimpan)
                                .then((response) => {})
                                .catch((error) => {
                                    console.error('Error simpan tbimages:', error);
                                });
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                if (index === 51) index = 21;
            }
        }
    };

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
    const editdoc = async () => {
        startProgress();
        console.log('SAVE DOC');

        const dataSimpan = {
            entitas: kode_entitas,
            nopol: headeterState?.no_kendaraan === '' || null ? null : headeterState?.no_kendaraan,
            merek: headeterState?.merek === '' || null ? null : headeterState?.merek,
            jenis: headeterState?.jenis_kendaraan === '' || null ? null : headeterState?.jenis_kendaraan,
            aktif: headeterState?.non_aktif === '' || null ? null : headeterState?.non_aktif,
            nama: informasiState?.nama_pemilik === '' || null ? null : informasiState?.nama_pemilik,
            alamat: informasiState?.alamat === '' || null ? null : informasiState?.alamat,
            nobpkb: informasiState?.no_bpkb === '' || null ? null : informasiState?.no_bpkb,
            tahun_buat: informasiState?.tahun_pembuatan === '' || null ? null : informasiState?.tahun_pembuatan,
            nomesin: informasiState?.no_mesin === '' || null ? null : informasiState?.no_mesin,
            silinder: informasiState?.isi_silinder_cc === '' || null ? null : informasiState?.isi_silinder_cc,
            noranka: informasiState?.no_rangka === '' || null ? null : informasiState?.no_rangka,
            warna: informasiState?.warna === '' || null ? null : informasiState?.warna,
            kapasitas: informasiState?.kapasitas_angkutan_kg === '' || null ? null : parseFloat(informasiState?.kapasitas_angkutan_kg.replace(/,/g, '')),
            tonase: informasiState?.minimal_tonase_kg === '' || null ? null : parseFloat(informasiState?.minimal_tonase_kg.replace(/,/g, '')),
            armada_kirim: informasiState?.armada_pengiriman_barang === '' || null ? null : informasiState?.armada_pengiriman_barang,
            hitungkpi: informasiState?.hitung_kpi === '' || null ? null : informasiState?.hitung_kpi,
            tgl_stnk:
                informasiState?.tgl_berlaku_stnk === null ? null : moment(informasiState?.tgl_berlaku_stnk).isValid() ? moment(informasiState?.tgl_berlaku_stnk).format('YYYY-MM-DD HH:mm:ss') : null,
            nilai_stnk: informasiState?.biaya_adm_stnk_tnkb === '' || null ? null : parseFloat(informasiState?.biaya_adm_stnk_tnkb.replace(/,/g, '')),
            tgl_pajak:
                informasiState?.tgl_berlaku_pajak === null ? null : moment(informasiState?.tgl_berlaku_pajak).isValid() ? moment(informasiState?.tgl_berlaku_pajak).format('YYYY-MM-DD HH:mm:ss') : null,
            nilai_pajak: informasiState?.biaya_pkb === '' || null ? null : parseFloat(informasiState?.biaya_pkb.replace(/,/g, '')),
            tgl_kir:
                informasiState?.tgl_registrasi_kir === null
                    ? null
                    : moment(informasiState?.tgl_registrasi_kir).isValid()
                    ? moment(informasiState?.tgl_registrasi_kir).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            nilai_kir: informasiState?.biaya_registrasi_kir === '' || null ? null : parseFloat(informasiState?.biaya_registrasi_kir.replace(/,/g, '')),
            dealer: informasiState?.nama_dealer === '' || null ? null : informasiState?.nama_dealer,
            tgl_beli: informasiState?.tgl_beli === null ? null : moment(informasiState?.tgl_beli).isValid() ? moment(informasiState?.tgl_beli).format('YYYY-MM-DD HH:mm:ss') : null,
            harga_beli: informasiState?.harga_beli_otr === '' || null ? null : parseFloat(informasiState?.harga_beli_otr.replace(/,/g, '')),
            tgl_mulai:
                informasiState?.tgl_operasional_awal === null
                    ? null
                    : moment(informasiState?.tgl_operasional_awal).isValid()
                    ? moment(informasiState?.tgl_operasional_awal).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            tgl_akhir:
                informasiState?.tgl_operasional_akhir === null
                    ? null
                    : moment(informasiState?.tgl_operasional_akhir).isValid()
                    ? moment(informasiState?.tgl_operasional_akhir).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            leasing: lainLainState?.nama_leasing === '' || null ? null : lainLainState?.nama_leasing,
            no_kontrak: lainLainState?.no_kontrak === '' || null ? null : lainLainState?.no_kontrak,
            tgl_kontrak: lainLainState?.tgl === null ? null : moment(lainLainState?.tgl).isValid() ? moment(lainLainState?.tgl).format('YYYY-MM-DD HH:mm:ss') : null,
            nama_kontrak: lainLainState?.nama_debitur === '' || null ? null : lainLainState?.nama_debitur,
            alamat_kontrak: lainLainState?.alamat === '' || null ? null : lainLainState?.alamat,
            nilai_um: lainLainState?.nilai_uang_muka === '' || null ? null : parseFloat(lainLainState?.nilai_uang_muka.replace(/,/g, '')),
            nilai_angsuran: lainLainState?.nilai_angsuran === '' || null ? null : parseFloat(lainLainState?.nilai_angsuran.replace(/,/g, '')),
            tgl_leasing: lainLainState?.tgl_jatuh_tempo === null ? null : moment(lainLainState?.tgl_jatuh_tempo).isValid() ? moment(lainLainState?.tgl_jatuh_tempo).format('YYYY-MM-DD HH:mm:ss') : null,
            asuransi: lainLainState?.nama_asuransi === '' || null ? null : lainLainState?.nama_asuransi,
            no_polis: lainLainState?.no_polis === '' || null ? null : lainLainState?.no_polis,
            tgl_polis: lainLainState?.tgl_asuransi === null ? null : moment(lainLainState?.tgl_asuransi).isValid() ? moment(lainLainState?.tgl_asuransi).format('YYYY-MM-DD HH:mm:ss') : null,
            nama_polis: lainLainState?.nama_tergantung === '' || null ? null : lainLainState?.nama_tergantung,
            alamat_polis: lainLainState?.alamat_asuransi === '' || null ? null : lainLainState?.alamat_asuransi,
            nilai_asuransi: lainLainState?.harga_patungan === '' ? null : parseFloat(lainLainState?.harga_patungan.replace(/,/g, '')),
            tgl_asuransi:
                lainLainState?.tgl_jatuh_tempo_asuransi === null
                    ? null
                    : moment(lainLainState?.tgl_jatuh_tempo_asuransi).isValid()
                    ? moment(lainLainState?.tgl_jatuh_tempo_asuransi).format('YYYY-MM-DD HH:mm:ss')
                    : null,
            catatan: lainLainState?.catatan === '' || null ? null : lainLainState?.catatan,
            personal: null,
            fileprefix: null,
            filegambar: null,
            filegambar2: null,
            filegambar3: null,
            filegambar4: null,
            filepdf: null,
            filepdf2: null,
            userid: userid.toUpperCase(),
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            Old_nopol: masterData?.nopol,
        };

        try {
            const response: any = await axios.patch(`${apiUrl}/erp/update_kendaraan?`, dataSimpan, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                await uploadGambarNoZip(dataSimpan.nopol);
                Swal.fire({ text: 'Berhasil Simpan!', target: '#forDialogAndSwall', timer: 3000 });
                await refreshData();
                await setTimeout(() => endProgress(), 700);
                onClose();
            }
        } catch (error: any) {
            if (error) {
                await setTimeout(() => endProgress(), 700);
                console.log(error);
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: error?.response?.data?.error,
                    target: '#forDialogAndSwallOri',
                    icon: 'warning',
                });
            }
        }
    };

    const handlePreview = () => {
        if (uploadedFiles[tabUploadActive + 1].fileUrl === null) {
            return alert('Pilih dulu file pendukung nya');
        }
        const temp = uploadedFiles[tabUploadActive + 1];

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
                const renamedFile = new File([file], 'NP' + newFileName, { type: file.type });

                const reader = new FileReader();
                reader.readAsDataURL(renamedFile);
                reader.onloadend = () => {
                    const temp = uploadedFiles;
                    let currentTab = tabUploadActive;
                    temp[parseInt(tabUploadActive + 1)] = { file: renamedFile, fileUrl: reader.result as string, tabIndex: parseInt(tabUploadActive + 1) };
                    console.log('Upload file hapus : ', temp);
                    setTabUploadActive(-1);
                    setTimeout(() => {
                        setTabUploadActive(currentTab);
                    }, 100);
                    setUploadedFiles(temp);
                };
            }
        }
    };

    const [isFocused, setIsFocused] = useState({
        biaya_adm_stnk_tnkb: false,
        biaya_pkb: false,
        biaya_registrasi_kir: false,
        nilai_uang_muka: false,
        nilai_angsuran: false,
        harga_beli_otr: false,
        kapasitas_angkutan_kg: false,
        minimal_tonase_kg: false,
        harga_patungan: false,
    });

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

    const validasiForm = () => {
        // Gabungkan semua state yang perlu divalidasi
        const allStates = {
            ...headeterState,
        };

        // Iterasi setiap properti di objek gabungan
        for (const [key, value] of Object?.entries(allStates || {})) {
            if (value === '' || value === null || value === undefined) {
                // Tampilkan pesan error swal jika ada properti yang kosong
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    target: '#forDialogAndSwallOri',
                    text: `${formatString(key)} belum diisi`,
                });
                return false; // Berhenti validasi jika ada yang kosong
            }
        }

        if (informasiState?.no_rangka === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                target: '#forDialogAndSwallOri',
                text: `No rangka belum diisi`,
            });
            return false; // Berhenti validasi jika ada yang kosong
        }

        return masterState === 'BARU' ? savedoc() : editdoc(); // Lolos validasi jika semua properti terisi
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
        })); // Format angka saat blur
    };

    function formatString(input: string) {
        // Split berdasarkan underscore (_)
        const words = input.split('_');

        // Kapitalisasi huruf pertama setiap kata
        const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        // Gabungkan kembali dengan spasi
        return formattedWords.join(' ');
    }

    const informasiChange = (e: any) => {
        const { name, value } = e.target;
        if (name === 'tahun_pembuatan') {
            if (/^\d{0,4}$/.test(value)) {
                // Validasi hanya angka sampai 6 digit
                console.log('/^d{0,4}$/.test(value)', /^\d{0,4}$/.test(value));
                setInformasiState((prev: any) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else if (name === 'isi_silinder_cc') {
            if (/^\d{0,6}$/.test(value)) {
                // Validasi hanya angka sampai 6 digit
                setInformasiState((prev: any) => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setInformasiState((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Update filterState
    };
    const lainLainChange = (e: any) => {
        const { name, value } = e.target;

        // Update filterState
        setLainLainState((prev: any) => ({
            ...prev,
            [name]: value,
        }));
    };
    const clickTabIndex = (event: any) => {
        const tabIndex = event.currentTarget.tabIndex;
        setTabUploadActive(tabIndex);
        // console.log('Tab index clicked:', tabIndex);
        //
        // e-item e-toolbar-item e-active
    };
    const [activeTab, setActiveTab] = useState('informasi');
    useEffect(() => {
        const dialogElement = document.getElementById('forDialogAndSwallOriKendaraanMaster');
        if (dialogElement) {
            dialogElement.style.maxHeight = 'none';
            dialogElement.style.maxWidth = 'none';
        }
    }, []);

    const handleRotateLeft = () => setRotationAngle(rotationAngle - 90);
    const handleRotateRight = () => setRotationAngle(rotationAngle + 90);

    const formatNumber = (num: string) => {
        if (!num) return ''; // Jika kosong, kembalikan string kosong
        const parsedNumber = parseFloat(num.replace(/,/g, ''));
        if (isNaN(parsedNumber)) return ''; // Jika tidak valid, kembalikan string kosong
        return parsedNumber.toLocaleString('en-US');
    };

    const hiddenNol = (val: string | any) => {
        if (val == '0' || val === null || val === undefined || typeof val === 'undefined' || isNaN(val)) {
            return String('');
        } else {
            return String(val);
        }
    };
    const convertStringTuNol = (val: any) => {
        if (val === '' || val === null || isNaN(val)) {
            return String('0');
        } else {
            return String(val);
        }
    };

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    useEffect(() => {
        if (masterState !== 'BARU') {
            
            setHeadeterState({
                no_kendaraan: masterData?.nopol,
                merek: masterData?.merek,
                jenis_kendaraan: masterData?.jenis,
                non_aktif: masterData?.aktif,
            });

            //         parseFloat(informasiState?.kapasitas_angkutan_kg.replace(/,/g, ''))
            // parseFloat(informasiState?.minimal_tonase_kg.replace(/,/g, ''))
            // parseFloat(informasiState?.biaya_adm_stnk_tnkb.replace(/,/g, ''))
            // parseFloat(informasiState?.biaya_pkb.replace(/,/g, ''))
            // parseFloat(informasiState?.biaya_registrasi_kir.replace(/,/g, ''))
            // parseFloat(informasiState?.harga_beli_otr.replace(/,/g, ''))
            // parseFloat(lainLainState?.nilai_uang_muka .replace(/,/g, ''))
            // parseFloat(lainLainState?.nilai_angsuran.replace(/,/g, ''))
            // parseFloat(lainLainState?.harga_patungan.replace(/,/g, ''))

            setInformasiState({
                nama_pemilik: masterData?.nama,
                alamat: masterData?.alamat,
                no_bpkb: masterData?.nobpkb,
                tahun_pembuatan: masterData?.tahun_buat,
                no_mesin: masterData?.nomesin,
                isi_silinder_cc: masterData?.silinder,
                no_rangka: masterData?.noranka,
                warna: masterData?.warna,
                kapasitas_angkutan_kg: String(SpreadNumber(masterData?.kapasitas)),
                minimal_tonase_kg: String(SpreadNumber(masterData?.tonase)),
                armada_pengiriman_barang: masterData?.armada_kirim,
                hitung_kpi: masterData?.hitungkpi,
                tgl_berlaku_stnk: masterData?.tgl_stnk !== '' || null ? masterData?.tgl_stnk : '',
                biaya_adm_stnk_tnkb: String(SpreadNumber(masterData?.nilai_stnk)),
                tgl_berlaku_pajak: masterData?.tgl_pajak !== '' || null ? masterData?.tgl_pajak : '',
                biaya_pkb: String(SpreadNumber(masterData?.nilai_pajak)),
                tgl_registrasi_kir: masterData?.tgl_kir !== '' || null ? masterData?.tgl_kir : '',
                biaya_registrasi_kir: String(SpreadNumber(masterData?.nilai_kir)),
                nama_dealer: masterData?.dealer,
                tgl_beli: masterData?.tgl_beli !== '' || null ? masterData?.tgl_beli : '',
                harga_beli_otr: String(SpreadNumber(masterData?.harga_beli)),
                tgl_operasional_awal: masterData?.tgl_mulai !== '' || null ? masterData?.tgl_mulai : '',
                tgl_operasional_akhir: masterData?.tgl_akhir !== '' || null ? masterData?.tgl_akhir : '',
            });
            setLainLainState({
                nama_leasing: masterData?.leasing,
                no_kontrak: masterData?.no_kontrak,
                tgl: masterData?.tgl_kontrak !== '' || null ? masterData?.tgl_kontrak : '',
                nama_debitur: masterData?.nama_kontrak,
                alamat: masterData?.alamat_kontrak,
                nilai_uang_muka: String(SpreadNumber(masterData?.nilai_um)),
                nilai_angsuran: String(SpreadNumber(masterData?.nilai_angsuran)),
                tgl_jatuh_tempo: masterData?.tgl_leasing !== '' || null ? masterData?.tgl_leasing : '',
                nama_asuransi: masterData?.asuransi,
                no_polis: masterData?.no_polis,
                tgl_asuransi: masterData?.tgl_polis !== '' || null ? masterData?.tgl_polis : '',
                nama_tergantung: masterData?.nama_polis,
                alamat_asuransi: masterData?.alamat_polis,
                harga_patungan: String(SpreadNumber(masterData?.nilai_asuransi)),
                tgl_jatuh_tempo_asuransi: masterData?.tgl_asuransi !== '' || null ? masterData?.tgl_asuransi : '',
                catatan: masterData?.catatan,
            });

            getAllFilePendukung(masterData?.nopol);
        }
    }, []);
    const handleFileChange = async (event: { target: { files: any[] } } | any) => {
        const file = event.target.files?.[0];
        if (file && file.type.includes('image')) {
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
                const renamedFile = new File([file], 'NP' + newFileName, { type: file.type });

                const reader = new FileReader();
                reader.readAsDataURL(renamedFile);
                reader.onloadend = () => {
                    const temp = uploadedFiles;
                    let currentTab = tabUploadActive;
                    temp[parseInt(tabUploadActive + 1)] = { file: renamedFile, fileUrl: reader.result as string, tabIndex: parseInt(tabUploadActive + 1) };
                    console.log('Upload file hapus : ', temp);
                    setTabUploadActive(-1);
                    setTimeout(() => {
                        setTabUploadActive(currentTab);
                    }, 100);
                    setUploadedFiles(temp);
                };
            }
        } else {
            alert('Please upload a JPG file.');
        }
        // Reset the input value to allow re-upload of the same file if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    const handleOpenModal = (index: any) => {};
    const handleDeleteFilePendukungOne = () => {
        Swal.fire({
            title: 'Yakin hapus File Pendukung urutan ke ' + parseInt(tabUploadActive + 1),
            text: 'Tekan ya jika yakin!',
            icon: 'warning',
            target: '#forDialogAndSwallOri',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya hapus!',
        }).then((result: any) => {
            if (result.isConfirmed) {
                const temp = uploadedFiles;
                temp[parseInt(tabUploadActive + 1)] = { file: null, fileUrl: null, tabIndex: parseInt(tabUploadActive + 1) };
                console.log('Upload file hapus : ', temp);
                setDeleteFilePendukung([...deleteFilePendukung, tabUploadActive + 1]);

                setUploadedFiles(temp);
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'File pendukung ' + parseInt(tabUploadActive + 1),
                    icon: 'success',
                    timer: 1500,
                    target: '#forDialogAndSwallOri',
                });
            }
        });
    };
    const handleBersihkanSemua = () => {
        Swal.fire({
            title: 'Hapus Semua gambar',
            text: 'Tekan ya jika yakin!',
            icon: 'warning',
            target: '#forDialogAndSwallOri',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya hapus!',
        }).then((result) => {
            if (result.isConfirmed) {
                const temp = Object?.values(uploadedFiles || {}).filter((item) => item.file !== null);
                let tempIndexForDelete: any = [];
                temp.map((item) => tempIndexForDelete.push(item.tabIndex));

                console.log('Upload file hapus : ', tempIndexForDelete);
                setDeleteFilePendukung([...tempIndexForDelete]);

                setUploadedFiles(resetFilePendukung());
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'File pendukung ',
                    icon: 'success',
                    timer: 1500,
                    target: '#forDialogAndSwallOri',
                });
            }
        });
    };
    return (
        <DialogComponent
            id="forDialogAndSwallOriKendaraanMaster"
            isModal={true}
            width="93%"
            height="90%"
            visible={visible}
            close={() => onClose()}
            header={header}
            showCloseIcon={true}
            target="#forDialogAndSwall"
            // closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            position={{ X: 'center', Y: 'center' }} // Dialog berada di tengah
        >
            <div className="flex h-full w-full flex-col" id="forDialogAndSwallOri">
                {bokflag === false && <GlobalProgressBar />}
                <div className="h-[15%]  w-full">
                    <table className="ml-10 max-w-[450px]">
                        <tr className="border-none">
                            <td className="w-52 text-right text-xs">No. Kendaraan</td>
                            <td className="flex w-72 gap-2">
                                <input
                                    type="text"
                                    id="no_kendaraan"
                                    className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="No. Kendaraan"
                                    name="no_kendaraan"
                                    value={headeterState?.no_kendaraan}
                                    style={{ height: '3.2vh' }}
                                    autoComplete="off"
                                    onChange={handleHeaderChange}
                                />

                                <label htmlFor={`non-aktif`} className="m-0 flex w-28 items-center gap-1 text-xs text-gray-900">
                                    <input
                                        type="checkbox"
                                        id={`non-aktif`}
                                        value={'Y'}
                                        checked={headeterState?.non_aktif !== 'Y'}
                                        onChange={() =>
                                            setHeadeterState((oldData) => ({
                                                ...oldData,
                                                non_aktif: oldData.non_aktif === 'Y' ? 'N' : 'Y',
                                            }))
                                        }
                                    />{' '}
                                    {`Non Aktif`}
                                </label>
                            </td>
                        </tr>
                        <tr className="border-none">
                            <td className="text-right text-xs">Merek</td>
                            <td className="flex items-center">
                                <input
                                    type="text"
                                    id="merek"
                                    className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Merek"
                                    name="merek"
                                    value={headeterState?.merek}
                                    style={{ height: '3.2vh' }}
                                    autoComplete="off"
                                    onChange={handleHeaderChange}
                                />
                            </td>
                        </tr>
                        <tr className="border-none">
                            <td className="text-right text-xs">Jenis. Kendaraan</td>
                            <td className="w-32">
                                <input
                                    type="text"
                                    id="jenis_kendaraan"
                                    className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="Jenis Kendaraan"
                                    name="jenis_kendaraan"
                                    value={headeterState?.jenis_kendaraan}
                                    style={{ height: '3.2vh' }}
                                    autoComplete="off"
                                    onChange={handleHeaderChange}
                                />
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="h-[77%] w-full overflow-y-auto pt-3">
                    <div className="-mt-5 flex w-full border-b border-gray-300">
                        <button
                            onClick={() => setActiveTab('informasi')}
                            className={`px-3 py-2 text-xs font-semibold ${activeTab === 'informasi' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Infromasi
                        </button>
                        <button
                            onClick={() => setActiveTab('lainLain')}
                            className={`px-3 py-2 text-xs font-semibold ${activeTab === 'lainLain' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Lain-Lain
                        </button>
                        {/* <button
                            onClick={() => setActiveTab('catatan')}
                            className={`px-3 py-2 text-xs font-semibold ${activeTab === 'catatan' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            Catatan
                        </button> */}
                        <button
                            onClick={() => setActiveTab('FilePendukung')}
                            className={`px-3 py-2 text-xs font-semibold ${activeTab === 'FilePendukung' ? 'border-b-2 border-orange-500 text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                            File Pendukung
                        </button>
                    </div>
                    <div className={`flex h-[95%] w-full overflow-y-auto  ${activeTab === 'informasi' ? 'block' : 'hidden'} `}>
                        <div className="flex">
                            <div>
                                <table className="w-[650px] p-0">
                                    <h3 className="bold text-sm underline"> Informasi Pemilik :</h3>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">Nama. Pemilik</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nama_pemilik"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Nama. Pemilik"
                                                name="nama_pemilik"
                                                value={informasiState?.nama_pemilik}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">Merek</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="alamat"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder="Merek"
                                                name="alamat"
                                                value={informasiState?.alamat}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">No. BPKB</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <input
                                                type="text"
                                                id="no_bpkb"
                                                className="w-[135px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('no_bpkb')}
                                                name="no_bpkb"
                                                value={informasiState?.no_bpkb}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                            <label htmlFor="tahun_pembuatan" className="flex w-full items-center justify-end gap-2 text-xs">
                                                Tahun Pembuatan
                                                <input
                                                    type="text"
                                                    id="tahun_pembuatan"
                                                    className="w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                    placeholder={formatString('tahun_pembuatan')}
                                                    name="tahun_pembuatan"
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    value={informasiState?.tahun_pembuatan}
                                                    style={{ height: '3.2vh' }}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('no_mesin')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <input
                                                type="text"
                                                id="no_mesin"
                                                className="w-[135px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('no_mesin')}
                                                name="no_mesin"
                                                value={informasiState?.no_mesin}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                            <label htmlFor="isi_silinder_cc" className="flex w-full items-center justify-end gap-2 text-xs">
                                                {formatString('isi_silinder_CC')}
                                                <input
                                                    type="text"
                                                    id="isi_silinder_cc"
                                                    className="w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                    placeholder={'isi silinder (CC)'}
                                                    name="isi_silinder_cc"
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    value={informasiState?.isi_silinder_cc}
                                                    style={{ height: '3.2vh' }}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('no_rangka')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <input
                                                type="text"
                                                id="no_rangka"
                                                className="w-[135px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('no_rangka')}
                                                name="no_rangka"
                                                value={informasiState?.no_rangka}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                            <label htmlFor="warna" className="flex w-full items-center justify-end gap-2 text-xs">
                                                {formatString('warna')}
                                                <input
                                                    type="text"
                                                    id="warna"
                                                    className="w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                    placeholder={formatString('warna')}
                                                    name="warna"
                                                    value={informasiState?.warna}
                                                    style={{ height: '3.2vh' }}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('kapasitas_angkutan_kg')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <input
                                                type="text"
                                                id="kapasitas_angkutan_kg"
                                                className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                    isFocused.kapasitas_angkutan_kg === true ? 'text-left' : 'text-right'
                                                }`}
                                                placeholder={formatString('kapasitas_angkutan_kg')}
                                                name="kapasitas_angkutan_kg"
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                }}
                                                value={
                                                    isFocused.kapasitas_angkutan_kg ? hiddenNol(informasiState?.kapasitas_angkutan_kg) : formatNumber(hiddenNol(informasiState?.kapasitas_angkutan_kg))
                                                }
                                                style={{ height: '3.2vh' }}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('minimal_tonase_kg')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <input
                                                type="text"
                                                id="minimal_tonase_kg"
                                                className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                    isFocused.minimal_tonase_kg === true ? 'text-left' : 'text-right'
                                                }`}
                                                placeholder={formatString('minimal_tonase_kg')}
                                                name="minimal_tonase_kg"
                                                value={isFocused.minimal_tonase_kg ? hiddenNol(informasiState?.minimal_tonase_kg) : formatNumber(hiddenNol(informasiState?.minimal_tonase_kg))}
                                                style={{ height: '3.2vh' }}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                }}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                autoComplete="off"
                                                onChange={informasiChange}
                                            />
                                            <label htmlFor={`armada_pengiriman_barang`} className="m-0 flex w-[178px]  items-center gap-1 text-xs text-gray-900">
                                                <input
                                                    type="checkbox"
                                                    id={`armada_pengiriman_barang`}
                                                    value={'Y'}
                                                    checked={informasiState?.armada_pengiriman_barang === 'Y'}
                                                    onChange={() =>
                                                        setInformasiState((oldData) => ({
                                                            ...oldData,
                                                            armada_pengiriman_barang: oldData.armada_pengiriman_barang === 'Y' ? 'N' : 'Y',
                                                        }))
                                                    }
                                                />{' '}
                                                {formatString('armada_pengiriman_barang')}
                                            </label>
                                            <label htmlFor={`hitung_kpi_form`} className="m-0 flex w-[100px] items-center  justify-end gap-1 text-xs text-gray-900">
                                                <input
                                                    type="checkbox"
                                                    id={`hitung_kpi_form`}
                                                    value={'Y'}
                                                    checked={informasiState?.hitung_kpi === 'Y'}
                                                    onChange={() =>
                                                        setInformasiState((oldData) => ({
                                                            ...oldData,
                                                            hitung_kpi: oldData.hitung_kpi === 'Y' ? 'N' : 'Y',
                                                        }))
                                                    }
                                                />{' '}
                                                {formatString('hitung_kpi')}
                                            </label>
                                        </td>
                                    </tr>

                                    <h3 className="bold text-sm underline"> Pengingat :</h3>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('tgl_berlaku_stnk')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={informasiState?.tgl_berlaku_stnk ? moment(informasiState?.tgl_berlaku_stnk).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setInformasiState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl_berlaku_stnk: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={informasiState?.tgl_berlaku_stnk ? moment(informasiState?.tgl_berlaku_stnk).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />

                                            <label htmlFor="biaya_adm_stnk_tnkb" className="flex w-full items-center justify-end gap-2 text-xs">
                                                {formatString('biaya_adm_stnk_tnkb')}
                                                <input
                                                    type="text"
                                                    id="biaya_adm_stnk_tnkb"
                                                    className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                        isFocused.biaya_adm_stnk_tnkb === true ? 'text-left' : 'text-right'
                                                    }`}
                                                    placeholder={formatString('biaya_adm_stnk_tnkb')}
                                                    name="biaya_adm_stnk_tnkb"
                                                    value={isFocused.biaya_adm_stnk_tnkb ? hiddenNol(informasiState?.biaya_adm_stnk_tnkb) : formatNumber(hiddenNol(informasiState?.biaya_adm_stnk_tnkb))}
                                                    style={{ height: '3.2vh' }}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('tgl_berlaku_pajak')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={informasiState?.tgl_berlaku_pajak ? moment(informasiState?.tgl_berlaku_pajak).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setInformasiState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl_berlaku_pajak: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={informasiState?.tgl_berlaku_pajak ? moment(informasiState?.tgl_berlaku_pajak).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />

                                            <label htmlFor="biaya_pkb" className="flex w-full items-center justify-end gap-2 text-xs">
                                                {formatString('biaya_pkb')}
                                                <input
                                                    type="text"
                                                    id="biaya_pkb"
                                                    className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                        isFocused.biaya_pkb === true ? 'text-left' : 'text-right'
                                                    }`}
                                                    placeholder={formatString('biaya_pkb')}
                                                    name="biaya_pkb"
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    value={isFocused.biaya_pkb ? hiddenNol(informasiState?.biaya_pkb) : formatNumber(hiddenNol(informasiState?.biaya_pkb))}
                                                    style={{ height: '3.2vh' }}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('tgl_registrasi_kir')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={informasiState?.tgl_registrasi_kir ? moment(informasiState?.tgl_registrasi_kir).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setInformasiState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl_registrasi_kir: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={informasiState?.tgl_registrasi_kir ? moment(informasiState?.tgl_registrasi_kir).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />

                                            <label htmlFor="biaya_registrasi_kir" className="flex w-full items-center justify-end gap-2 text-xs">
                                                {formatString('biaya_registrasi_kir')}
                                                <input
                                                    type="text"
                                                    id="biaya_registrasi_kir"
                                                    className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                        isFocused.biaya_registrasi_kir === true ? 'text-left' : 'text-right'
                                                    }`}
                                                    placeholder={formatString('biaya_registrasi_kir')}
                                                    name="biaya_registrasi_kir"
                                                    value={
                                                        isFocused.biaya_registrasi_kir ? hiddenNol(informasiState?.biaya_registrasi_kir) : formatNumber(hiddenNol(informasiState?.biaya_registrasi_kir))
                                                    }
                                                    style={{ height: '3.2vh' }}
                                                    onFocus={handleFocus}
                                                    onBlur={handleBlur}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                    }}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </label>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div className="flex flex-col">
                                <div>
                                    <table>
                                        <h3 className="bold text-sm underline"> Infromasi Pembelian :</h3>
                                        <tr className="border-none">
                                            <td className=" text-right text-xs">{formatString('nama_dealer')}</td>
                                            <td className="flex w-[440px]">
                                                <input
                                                    type="text"
                                                    id="nama_dealer"
                                                    className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                    placeholder={formatString('nama_dealer')}
                                                    name={'nama_dealer'}
                                                    value={informasiState?.nama_dealer}
                                                    style={{ height: '3.2vh' }}
                                                    autoComplete="off"
                                                    onChange={informasiChange}
                                                />
                                            </td>
                                        </tr>
                                        <tr className="border-none">
                                            <td className="text-right text-xs">{formatString('tgl_beli')}</td>
                                            <td className="flex w-[440px] items-center gap-2">
                                                <DatePicker
                                                    showIcon
                                                    id="tglSekarang"
                                                    selected={informasiState?.tgl_beli ? moment(informasiState?.tgl_beli).toDate() : null}
                                                    onChange={(date: Date | null) =>
                                                        setInformasiState((oldData: any) => ({
                                                            ...oldData,
                                                            tgl_beli: date ? moment(date).format('YYYY-MM-DD') : '',
                                                        }))
                                                    }
                                                    dateFormat="dd-MM-yyyy"
                                                    className="w-[100%] rounded border border-gray-300"
                                                    calendarClassName="left-16"
                                                    showYearDropdown
                                                    isClearable
                                                    clearButtonClassName="text-red-500"
                                                    dropdownMode="select"
                                                    customInput={
                                                        <div className="relative flex items-center">
                                                            <input
                                                                className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                type="text"
                                                                readOnly
                                                                value={informasiState?.tgl_beli ? moment(informasiState?.tgl_beli).format('DD-MM-YYYY') : ''}
                                                            />
                                                            <FaCalendar
                                                                className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                                style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                            />
                                                        </div>
                                                    }
                                                />

                                                <label htmlFor="harga_beli_otr" className="flex w-full items-center justify-end gap-2 text-xs">
                                                    {formatString('harga_beli_otr')}
                                                    <input
                                                        type="text"
                                                        id="harga_beli_otr"
                                                        className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                            isFocused.harga_beli_otr === true ? 'text-left' : 'text-right'
                                                        }`}
                                                        placeholder={formatString('harga_beli_otr')}
                                                        name="harga_beli_otr"
                                                        value={isFocused.harga_beli_otr ? hiddenNol(informasiState?.harga_beli_otr) : formatNumber(hiddenNol(informasiState?.harga_beli_otr))}
                                                        style={{ height: '3.2vh' }}
                                                        onFocus={handleFocus}
                                                        onBlur={handleBlur}
                                                        autoComplete="off"
                                                        onChange={informasiChange}
                                                    />
                                                </label>
                                            </td>
                                        </tr>

                                        <h3 className="bold text-sm underline"> Pemakaian Kendaraan :</h3>
                                        <tr className="border-none">
                                            <td className="text-right text-xs">{formatString('tgl_operasional_awal')}</td>
                                            <td className="flex w-[440px] items-center gap-2">
                                                <DatePicker
                                                    showIcon
                                                    id="tglSekarang"
                                                    selected={informasiState?.tgl_operasional_awal ? moment(informasiState?.tgl_operasional_awal).toDate() : null}
                                                    onChange={(date: Date | null) =>
                                                        setInformasiState((oldData: any) => ({
                                                            ...oldData,
                                                            tgl_operasional_awal: date ? moment(date).format('YYYY-MM-DD') : '',
                                                        }))
                                                    }
                                                    dateFormat="dd-MM-yyyy"
                                                    className="w-[100%] rounded border border-gray-300"
                                                    calendarClassName="left-16"
                                                    showYearDropdown
                                                    isClearable
                                                    clearButtonClassName="text-red-500"
                                                    dropdownMode="select"
                                                    customInput={
                                                        <div className="relative flex items-center">
                                                            <input
                                                                className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                type="text"
                                                                readOnly
                                                                value={informasiState?.tgl_operasional_awal ? moment(informasiState?.tgl_operasional_awal).format('DD-MM-YYYY') : ''}
                                                            />
                                                            <FaCalendar
                                                                className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                                style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                            />
                                                        </div>
                                                    }
                                                />

                                                <label htmlFor="tgl_operasional_akhir" className="flex w-full items-center justify-end gap-2 text-xs">
                                                    {'S/D'}
                                                    <DatePicker
                                                        showIcon
                                                        id="tglSekarang"
                                                        selected={informasiState?.tgl_operasional_akhir ? moment(informasiState?.tgl_operasional_akhir).toDate() : null}
                                                        onChange={(date: Date | null) =>
                                                            setInformasiState((oldData: any) => ({
                                                                ...oldData,
                                                                tgl_operasional_akhir: date ? moment(date).format('YYYY-MM-DD') : '',
                                                            }))
                                                        }
                                                        dateFormat="dd-MM-yyyy"
                                                        className="w-[100%] rounded border border-gray-300"
                                                        calendarClassName="left-16"
                                                        showYearDropdown
                                                        isClearable
                                                        clearButtonClassName="text-red-500"
                                                        dropdownMode="select"
                                                        customInput={
                                                            <div className="relative flex items-center">
                                                                <input
                                                                    className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                                    type="text"
                                                                    readOnly
                                                                    value={informasiState?.tgl_operasional_akhir ? moment(informasiState?.tgl_operasional_akhir).format('DD-MM-YYYY') : ''}
                                                                />
                                                                <FaCalendar
                                                                    className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                                    style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                                />
                                                            </div>
                                                        }
                                                    />
                                                </label>
                                            </td>
                                        </tr>
                                        <h3 className="bold text-sm underline"> Catatan :</h3>
                                        <tr className="border-none">
                                            <td className="text-right text-xs"></td>
                                            <td className="flex w-[440px] items-center gap-2">
                                                <textarea
                                                    id="simple-textarea"
                                                    className="h-full w-full rounded-sm border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                                    placeholder="Tuliskan Catatan"
                                                    name="catatan"
                                                    rows={8}
                                                    value={lainLainState?.catatan}
                                                    onChange={lainLainChange}
                                                ></textarea>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex h-[95%] w-full ${activeTab === 'lainLain' ? 'block' : 'hidden'} `}>
                        <div>
                            <h3 className="bold text-sm underline"> Informasi Leasing :</h3>
                            <table className="w-[650px] p-0">
                                <tbody>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('nama_leasing')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nama_leasing"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('nama_leasing')}
                                                name="nama_leasing"
                                                value={lainLainState?.nama_leasing}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('no_kontrak')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="no_kontrak"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('no_kontrak')}
                                                name="no_kontrak"
                                                value={lainLainState?.no_kontrak}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('Tanggal')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={lainLainState?.tgl ? moment(lainLainState?.tgl).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setLainLainState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={lainLainState?.tgl ? moment(lainLainState?.tgl).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('nama_debitur')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nama_debitur"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('nama_debitur')}
                                                name="nama_debitur"
                                                value={lainLainState?.nama_debitur}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('alamat')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="alamat"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('alamat')}
                                                name="alamat"
                                                value={lainLainState?.alamat}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('nilai_uang_muka')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nilai_uang_muka"
                                                className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                    isFocused.nilai_uang_muka === true ? 'text-left' : 'text-right'
                                                }`}
                                                placeholder={formatString('nilai_uang_muka')}
                                                name="nilai_uang_muka"
                                                value={isFocused.nilai_uang_muka ? hiddenNol(lainLainState?.nilai_uang_muka) : formatNumber(hiddenNol(lainLainState?.nilai_uang_muka))}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                }}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('nilai_angsuran')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nilai_angsuran"
                                                className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                    isFocused.nilai_angsuran === true ? 'text-left' : 'text-right'
                                                }`}
                                                placeholder={formatString('nilai_angsuran')}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                }}
                                                name="nilai_angsuran"
                                                value={isFocused.nilai_angsuran ? hiddenNol(lainLainState?.nilai_angsuran) : formatNumber(hiddenNol(lainLainState?.nilai_angsuran))}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('tgl_jatuh_tempo')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={lainLainState?.tgl_jatuh_tempo ? moment(lainLainState?.tgl_jatuh_tempo).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setLainLainState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl_jatuh_tempo: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={lainLainState?.tgl_jatuh_tempo ? moment(lainLainState?.tgl_jatuh_tempo).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3 className="bold text-sm underline"> Infromasi Asuransi :</h3>
                            <table>
                                <tbody>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('nama_asuransi')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nama_asuransi"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('nama_asuransi')}
                                                name="nama_asuransi"
                                                value={lainLainState?.nama_asuransi}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('no_polis')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="no_polis"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('no_polis')}
                                                name="no_polis"
                                                value={lainLainState?.no_polis}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('tgl_asuransi')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={lainLainState?.tgl_asuransi ? moment(lainLainState?.tgl_asuransi).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setLainLainState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl_asuransi: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={lainLainState?.tgl_asuransi ? moment(lainLainState?.tgl_asuransi).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('nama_tertanggung')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="nama_tergantung"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('nama_tergantung')}
                                                name="nama_tergantung"
                                                value={lainLainState?.nama_tergantung}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('alamat_asuransi')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="alamat_asuransi"
                                                className="mb-1 w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                placeholder={formatString('alamat_asuransi')}
                                                name="alamat_asuransi"
                                                value={lainLainState?.alamat_asuransi}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className=" text-right text-xs">{formatString('harga_pertanggungan')}</td>
                                        <td className="flex w-[440px]">
                                            <input
                                                type="text"
                                                id="harga_patungan"
                                                className={`w-[133px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                    isFocused.harga_patungan === true ? 'text-left' : 'text-right'
                                                }`}
                                                placeholder={formatString('harga_pertanggungan')}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                                }}
                                                name="harga_patungan"
                                                value={isFocused.harga_patungan ? hiddenNol(lainLainState?.harga_patungan) : formatNumber(hiddenNol(lainLainState?.harga_patungan))}
                                                onFocus={handleFocus}
                                                onBlur={handleBlur}
                                                style={{ height: '3.2vh' }}
                                                autoComplete="off"
                                                onChange={lainLainChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="border-none">
                                        <td className="text-right text-xs">{formatString('tgl_jatuh_tempo')}</td>
                                        <td className="flex w-[440px] items-center gap-2">
                                            <DatePicker
                                                showIcon
                                                id="tglSekarang"
                                                selected={lainLainState?.tgl_jatuh_tempo_asuransi ? moment(lainLainState?.tgl_jatuh_tempo_asuransi).toDate() : null}
                                                onChange={(date: Date | null) =>
                                                    setLainLainState((oldData: any) => ({
                                                        ...oldData,
                                                        tgl_jatuh_tempo_asuransi: date ? moment(date).format('YYYY-MM-DD') : '',
                                                    }))
                                                }
                                                dateFormat="dd-MM-yyyy"
                                                className="w-[100%] rounded border border-gray-300"
                                                calendarClassName="left-16"
                                                showYearDropdown
                                                isClearable
                                                clearButtonClassName="text-red-500"
                                                dropdownMode="select"
                                                customInput={
                                                    <div className="relative flex items-center">
                                                        <input
                                                            className="h-[3.2vh] w-[135px] rounded-sm border border-gray-400 bg-gray-50 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                            type="text"
                                                            readOnly
                                                            value={lainLainState?.tgl_jatuh_tempo_asuransi ? moment(lainLainState?.tgl_jatuh_tempo_asuransi).format('DD-MM-YYYY') : ''}
                                                        />
                                                        <FaCalendar
                                                            className="absolute left-2 cursor-pointer text-[11px] text-gray-500"
                                                            style={{ pointerEvents: 'none' }} // Ikon tetap muncul tanpa mengganggu klik input
                                                        />
                                                    </div>
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`flex h-[95%] w-full ${activeTab === 'catatan' ? 'block' : 'hidden'} `}>
                        <textarea
                            id="simple-textarea"
                            className="h-full w-full rounded-sm border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Tuliskan Catatan"
                            name="catatan"
                            rows={8}
                            value={lainLainState?.catatan}
                            onChange={lainLainChange}
                        ></textarea>
                    </div>
                    <div className={`flex h-[95%] w-full flex-col ${activeTab === 'FilePendukung' ? 'block' : 'hidden'} `}>
                        <div className="flex w-full pl-5 ">
                            <button
                                onClick={() => setJendelaPendukung('gambar')}
                                className={`px-3 py-2 text-xs font-semibold ${jendelaPendukung === 'gambar' ? 'border-b-2 border-blue-500 text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                Gambar
                            </button>
                            <button
                                onClick={() => setJendelaPendukung('pdf')}
                                className={`px-3 py-2 text-xs font-semibold ${jendelaPendukung === 'pdf' ? 'border-b-2 border-blue-500 text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                PDF
                            </button>
                        </div>
                        <div className={`h-full w-full gap-1 ${jendelaPendukung === 'gambar' ? 'block' : 'hidden'}`}>
                            <div className="panel-tab dsd float-start flex h-full  w-full flex-col md:w-[50%]" style={{ background: '#fff' }}>
                                {/* <TabComponent ref={(t) => (tabDialogFilePendukung = t)} selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                        
                                    </TabComponent> */}
                                <div className="flex h-[10%] w-full  border">
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 0 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={0}
                                    >
                                        1
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 1 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={1}
                                    >
                                        2
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 2 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={2}
                                    >
                                        3
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 3 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={3}
                                    >
                                        4
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 4 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={4}
                                    >
                                        5
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 5 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={5}
                                    >
                                        6
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 6 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={6}
                                    >
                                        7
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 7 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={7}
                                    >
                                        8
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 8 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={8}
                                    >
                                        9
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 9 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={9}
                                    >
                                        10
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 10 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={10}
                                    >
                                        11
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 11 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={11}
                                    >
                                        12
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 12 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={12}
                                    >
                                        13
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 13 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={13}
                                    >
                                        14
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 14 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={14}
                                    >
                                        15
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 15 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={15}
                                    >
                                        16
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 16 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={16}
                                    >
                                        17
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 17 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={17}
                                    >
                                        18
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 18 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={18}
                                    >
                                        19
                                    </div>
                                    <div
                                        className={`flex w-8 cursor-pointer items-center justify-center text-xs hover:bg-slate-200 ${
                                            tabUploadActive === 19 && 'z-30 border-4 border-b-0 border-l-slate-200 border-r-slate-200  border-t-slate-200'
                                        }`}
                                        onClick={clickTabIndex}
                                        tabIndex={19}
                                    >
                                        20
                                    </div>
                                </div>
                                <div className="flex h-[80%] w-full items-center justify-center overflow-hidden">
                                    <div className={`h-full w-full `} onPaste={(e) => handlePaste(e)}>
                                        {uploadedFiles[parseInt(tabUploadActive + 1)]?.fileUrl === null ? (
                                            <div className="flex h-full w-full items-center justify-center ">Gambar belum ada untuk tab {parseInt(tabUploadActive + 1)}</div>
                                        ) : (
                                            <div className="flex h-full  w-full content-center items-center justify-center">
                                                <img
                                                    src={uploadedFiles[parseInt(tabUploadActive + 1)]?.fileUrl}
                                                    alt={`File pendukung urutan ${parseInt(tabUploadActive + 1)}`}
                                                    className="h-full w-auto cursor-pointer "
                                                    onClick={handlePreview}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex h-[250px] min-w-[200px]    rounded border px-5 shadow">
                                <div className="flex flex-col">
                                    <ButtonComponent onClick={handleClick} id="btnFile" type="button" cssClass="e-primary e-small" style={styleButtonFilePendukung}>
                                        Scanner
                                    </ButtonComponent>
                                    <ButtonComponent onClick={handleClick} id="btnFile" type="button" cssClass="e-primary e-small" style={styleButtonFilePendukung}>
                                        File
                                    </ButtonComponent>
                                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    <ButtonComponent onClick={handleDeleteFilePendukungOne} id="btnFile" type="button" cssClass="e-primary e-small" style={styleButtonFilePendukung}>
                                        Bersihkan Gambar
                                    </ButtonComponent>
                                    <ButtonComponent onClick={handleBersihkanSemua} id="btnFile" type="button" cssClass="e-primary e-small" style={styleButtonFilePendukung}>
                                        Bersihkan Semua
                                    </ButtonComponent>
                                    <ButtonComponent
                                        onClick={() => {
                                            uploadedFiles[parseInt(tabUploadActive + 1)]?.fileUrl === null
                                                ? null
                                                : downloadBase64Image(uploadedFiles[parseInt(tabUploadActive + 1)]?.fileUrl, uploadedFiles[parseInt(tabUploadActive + 1)]?.file.name);
                                        }}
                                        id="btnFile"
                                        type="button"
                                        cssClass="e-primary e-small"
                                        style={styleButtonFilePendukung}
                                    >
                                        Simpan Ke File
                                    </ButtonComponent>
                                    <ButtonComponent onClick={handlePreview} id="btnFile" type="button" cssClass="e-primary e-small flex" style={styleButtonFilePendukung}>
                                        <span className="flex h-full w-full items-center justify-center gap-2">
                                            <FaCamera /> Preview
                                        </span>
                                    </ButtonComponent>
                                </div>
                                <div>
                                    Keterangan
                                    <ol className="list-inside list-decimal">
                                        <li>Foto Tampak Depan</li>
                                        <li>Foto Samping Kanan</li>
                                        <li>Foto Samping Kiri</li>
                                        <li>Foto Tampak Belakang</li>
                                        <li>Foto Tampak Dalam</li>
                                        <li>Foto Plat Nomor</li>
                                        <li>Foto KIR</li>
                                        <li>Foto STNK</li>
                                        <li>Foto Nomor Rangka</li>
                                        <li>Foto Nomor Mesin</li>
                                        <li>Foto Dongkrak</li>
                                        <li>Foto Ban Serep</li>
                                        <li>Foto Kunci-kunci</li>
                                        <li>Foto P3K</li>
                                        <li>Foto Buku Service</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <div className={`h-full w-full gap-1 ${jendelaPendukung === 'pdf' ? 'block' : 'hidden'}`}>
                            <PDFForm masterState={masterState} pdfIndex={51} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                            <PDFForm masterState={masterState} pdfIndex={52} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
                        </div>
                    </div>
                </div>
                <div className="flex  h-[7%] w-full justify-end gap-2 pr-2">
                    {/* <button className="px-4 rounded py-2 text-sm font-semibold text-black border border-gray-400 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
        Berikut
    </button> */}
                    <button
                        onClick={validasiForm}
                        disabled={isLoading}
                        className="rounded border border-gray-400 bg-gray-200 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Simpan
                    </button>
                    <button
                        onClick={() => onClose()}
                        className="rounded border border-gray-400 bg-gray-200 px-4 py-2 text-sm font-semibold text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Batal
                    </button>
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
                            ) : (
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
            </div>
        </DialogComponent>
    );
};

export default forDialogAndSwallOriKendaraanMaster;
