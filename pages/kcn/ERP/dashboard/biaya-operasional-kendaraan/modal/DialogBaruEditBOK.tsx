import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { FaSearch } from 'react-icons/fa';
import moment from 'moment';
import { generateNU } from '@/utils/routines';
import DIalogKendaraan from './DIalogKendaraan';
import DialogPengemudi from './DialogPengemudi';
import DialogListServis from './DIalogListServis';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import DialogBaruEditKendaraanMaster from '../../../master/kendaraan/modal/DialogBaruEditKendaraanMaster';
import Swal from 'sweetalert2';
import axios from 'axios';
import DialogServisCrud from './DialogServisCrud';
import idIDLocalization from 'public/syncfusion/locale.json';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import { loadCldr, L10n, getValue } from '@syncfusion/ej2-base';
import { Inject } from '@syncfusion/ej2-react-grids';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import 'moment/locale/id';
import { useProgress } from '@/context/ProgressContext';
import GlobalProgressBar from '@/components/GlobalProgressBar';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
enableRipple(true);

const DialogBaruEditBOK = ({
    visible,
    onClose,
    masterState = '',
    kode_entitas,
    masterData = {},
    refereshData,
    token,
    userid,
    Cetak_Form_BOK,
}: {
    visible: boolean;
    onClose: Function;
    masterState: string;
    kode_entitas: string;
    masterData: any;
    refereshData: Function;
    token: string;
    userid: string;
    Cetak_Form_BOK: Function;
}) => {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const { startProgress, updateProgress, endProgress, setLoadingMessage } = useProgress();
    let tryAgain = useRef(1);

    const header = 'Biaya Operasional Kendaraann ' + masterState + (Object.keys(masterData).length !== 0 && masterState === 'EDIT' ? ' Nomor : ' + masterData.no_fk : '');
    let items: any = [
        {
            text: 'Form BOK',
        },
        {
            text: 'Daftar BOK',
        },
    ];

    const [visbleDialogKendaraan, setVisbleDialogKendaraan] = useState(false);
    const [visbleDialogPengemudi, setVisbleDialogPengemudi] = useState(false);
    const [visbleDialogListServis, setVisbleDialogListServis] = useState(false);
    const [visbleDialogServisCrud, setVisbleDialogServisCrud] = useState(false);
    const [visbleDialogTambahKendaraan, setVisbleDialogTambahKendaraan] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    const onCetakDialog = useRef(false);

    const [headerDialogState, setHeaderDialogState] = useState({
        tgl_bok: masterState === 'BARU' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment(masterData.tgl_fk).format('YYYY-MM-DD HH:mm:ss'),
        no_bok: '',
        no_kendaraan: '',
        tujuan: '',
        pengemudi: '',
    });

    const [bodyState, setBodyState] = useState({
        nama_spbu: '',
        liter: '0',
        nominal_bbm: '0',
        jenis_perbaikan: '',
        nominal_servis: '0',
        km_sebelumnya: '0',
        posisi_km_sekarang: '0',
        km_jalan: '0',
        uang_jalan: '0',
        kenek: '0',
        parkir: '0',
        tol: '0',
        bongkar_muat: '0',
        mel: '0',
        lain_lain: '0',
        total: '0',
        rasio: '0',
    });
    const [keterangan, setKeterangan] = useState('');
    const [isFocused, setIsFocused] = useState({
        liter: false,
        nominal_bbm: false,
        nominal_servis: false,
        km_sebelumnya: false,
        posisi_km_sekarang: false,
        km_jalan: false,
        uang_jalan: false,
        kenek: false,
        parkir: false,
        tol: false,
        bongkar_muat: false,
        mel: false,
        lain_lain: false,
        total: false,
        rasio: false,
    }); // Untuk melacak status fokus

    // Fungsi untuk memformat angka dengan pemisah ribuan
    const formatNumber = (num: string) => {
        if (!num) return ''; // Jika kosong, kembalikan string kosong
        const parsedNumber = parseFloat(num.replace(/,/g, ''));
        if (isNaN(parsedNumber)) return ''; // Jika tidak valid, kembalikan string kosong
        return parsedNumber.toLocaleString('en-US');
    };

    // Fungsi untuk menangani perubahan nilai
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Update filterState
        setBodyState((prev: any) => ({
            ...prev,
            [name]: value.replace(/,/g, ''),
        }));
    };

    const handleSelectCetak = (args: any) => {
        if (args.item.text === 'Form BOK') {
            onCetakDialog.current = true;
            console.log('onCetakDialog.current', onCetakDialog.current);

            validasiForm();
        } else {
            return;
        }
    };

    // Fungsi saat input mendapatkan fokus
    const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsFocused((prev: any) => ({
            ...prev,
            [name]: true,
        }));
        e.target.select();
    };

    const handleShowKendaraan = () => {
        setVisbleDialogKendaraan(false);
        // document.getElementById('km_sebelumnya')!.focus();
        // document.getElementById('km_sebelumnya')!.blur();
    };
    const handleShowPengemudi = () => {
        setVisbleDialogPengemudi(false);
    };
    const handleShowListServis = () => {
        setVisbleDialogListServis(false);
    };
    const handleShowServisCrud = () => {
        console.log('ke klik');

        setVisbleDialogServisCrud(false);
    };

    // Fungsi saat input kehilangan fokus
    const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsFocused((prev: any) => ({
            ...prev,
            [name]: false,
        }));
        const kmjalan = convertStringTuNol(parseFloat(bodyState.posisi_km_sekarang.replace(/,/g, '')) - parseFloat(bodyState.km_sebelumnya.replace(/,/g, '')));
        setBodyState((prev: any) => ({
            ...prev,
            [name]: value.replace(/,/g, ''),
            km_jalan: convertStringTuNol(parseFloat(bodyState.posisi_km_sekarang.replace(/,/g, '')) - parseFloat(bodyState.km_sebelumnya.replace(/,/g, ''))),
            total: convertStringTuNol(
                parseFloat(convertStringTuNol(bodyState.nominal_bbm.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.nominal_servis.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.uang_jalan.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.kenek.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.parkir.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.tol.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.bongkar_muat.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.mel.replace(/,/g, ''))) +
                    parseFloat(convertStringTuNol(bodyState.lain_lain.replace(/,/g, '')))
            ),
            rasio: convertStringTuNol(parseFloat(kmjalan) / parseFloat(bodyState.liter.replace(/,/g, ''))),
        })); // Format angka saat blur
    };

    useEffect(() => {
        const dialogElement = document.getElementById('dialogBaruEditBOK');
        if (dialogElement) {
            dialogElement.style.maxHeight = 'none';
            dialogElement.style.maxWidth = 'none';
        }
    }, []);

    const setGenereteNU = async () => {
        const vNoMBUtama = await generateNU(kode_entitas, '', '96', moment().format('YYYYMM'));

        setHeaderDialogState((oldData) => ({
            ...oldData,
            no_bok: vNoMBUtama,
        }));
    };
    useEffect(() => {
        if (masterState === 'BARU') {
            setGenereteNU();
        } else {
            setBodyState({
                nama_spbu: masterData.spbu,
                liter: masterData.liter,
                nominal_bbm: masterData.nominal,
                nominal_servis: masterData.servis,
                jenis_perbaikan: masterData.jenis_servis,
                km_sebelumnya: masterData.kmawal,
                posisi_km_sekarang: masterData.kmakhir,
                km_jalan: masterData.kmjarak,
                uang_jalan: masterData.jalan,
                kenek: masterData.kenek,
                parkir: masterData.parkir,
                tol: masterData.tol,
                bongkar_muat: masterData.bongkar,
                mel: masterData.mel,
                lain_lain: masterData.lain,
                rasio: masterData.rasio,
                total: masterData.jumlah_mu,
            });
            setHeaderDialogState({
                tgl_bok: moment(masterData.tgl_fk).format('YYYY-MM-DD HH:mm:ss'),
                no_bok: masterData.no_fk,
                no_kendaraan: masterData.nopol,
                tujuan: masterData.tujuan,
                pengemudi: masterData.pengemudi,
            });

            setKeterangan(masterData.keterangan);
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
    const hiddenNol = (val: string) => {
        if (val == '0') {
            return String('');
        } else {
            return String(val);
        }
    };
    const convertStringTuNol = (val: any) => {
        if (val == '' || val == null || isNaN(val)) {
            return String('0');
        } else {
            return String(val);
        }
    };

    const validasiForm = () => {
        // Gabungkan semua state yang perlu divalidasi
        const allStates = {
            ...headerDialogState,
        };

        // Iterasi setiap properti di objek gabungan
        for (const [key, value] of Object.entries(allStates)) {
            if (value === '' || value === null || value === undefined) {
                // Tampilkan pesan error swal jika ada properti yang kosong
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    target: '#forDialogAndSwall',
                    timer: 2000,
                    text: `${formatString(key)} harus diisi`,
                });
                return false; // Berhenti validasi jika ada yang kosong
            }
        }

        if (parseFloat(bodyState.posisi_km_sekarang.replace(/,/g, '')) < parseFloat(bodyState.km_sebelumnya.replace(/,/g, ''))) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                target: '#forDialogAndSwall',
                timer: 2000,
                text: `Gagal Simpan Karena KM Sekarang < KM Sebelumnya`,
            });
            return false; // Berhenti validasi jika ada yang kosong
        }

        if (parseFloat(bodyState.total.replace(/,/g, '')) < 0 || bodyState.total == '0') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                target: '#forDialogAndSwall',
                timer: 2000,
                text: `Nilai Nominal belum di isi.`,
            });
            return false; // Berhenti validasi jika ada yang kosong
        }

        return masterState === 'BARU' ? savedoc() : editdoc(); // Lolos validasi jika semua properti terisi
    };

    const savedoc = async () => {
        startProgress();
        const vNoMBUtama = await generateNU(kode_entitas, '', '96', moment().format('YYYYMM'));

        console.log({
            ...headerDialogState,
            ...bodyState,
            keterangan,
        });

        const kirim = {
            entitas: kode_entitas,
            no_fk: vNoMBUtama,
            tgl_fk: moment(headerDialogState.tgl_bok).format('YYYY-MM-DD HH:mm:ss'),
            nopol: headerDialogState.no_kendaraan.slice(0, 14),
            tujuan: headerDialogState.tujuan,
            pengemudi: headerDialogState.pengemudi,
            spbu: bodyState.nama_spbu,
            liter: bodyState.liter == '' ? '0' : bodyState.liter,
            nominal: bodyState.nominal_bbm == '' ? '0' : bodyState.nominal_bbm,
            servis: bodyState.nominal_servis == '' ? '0' : bodyState.nominal_servis,
            jenis_servis: bodyState.jenis_perbaikan,
            kmawal: bodyState.km_sebelumnya == '' ? '0' : bodyState.km_sebelumnya,
            kmakhir: bodyState.posisi_km_sekarang == '' ? '0' : bodyState.posisi_km_sekarang,
            kmjarak: bodyState.km_jalan == '' ? '0' : bodyState.km_jalan,
            jalan: bodyState.uang_jalan == '' ? '0' : bodyState.uang_jalan,
            kenek: bodyState.kenek == '' ? '0' : bodyState.kenek,
            parkir: bodyState.parkir == '' ? '0' : bodyState.parkir,
            tol: bodyState.tol == '' ? '0' : bodyState.tol,
            bongkar: bodyState.bongkar_muat == '' ? '0' : bodyState.bongkar_muat,
            mel: bodyState.mel == '' ? '0' : bodyState.mel,
            lain: bodyState.lain_lain == '' ? '0' : bodyState.lain_lain,
            rasio: bodyState.rasio == '' ? '0' : bodyState.rasio,
            jumlah_mu: bodyState.total == '' ? '0' : bodyState.total,
            keterangan: keterangan,
            userid: userid.toUpperCase(),
        };

        try {
            const response: any = await axios.post(`${apiUrl}/erp/simpan_bok_dashboard?`, kirim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                await generateNU(kode_entitas, vNoMBUtama, '96', moment().format('YYYYMM'));
                const auditReqBodySPM = {
                    entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'BO',
                    kode_dokumen: response.data.data.kodeDokumen,
                    no_dokumen: vNoMBUtama,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'NEW',
                    diskripsi: `Biaya Operasional Kendaraan nilai transaksi = ${formatNumber(bodyState.total)}`,
                    userid: userid,
                    system_user: '', //username login
                    system_ip: '', //ip address
                    system_mac: '', //mac address
                };
                await axios.post(`${apiUrl}/erp/simpan_audit`, auditReqBodySPM);
                await refereshData();
                endProgress();
                Swal.fire({
                    title: 'Berhasil Simpan',
                    target: '#main-target',
                    timer: 2000,
                    icon: 'success',
                });
                if (onCetakDialog.current === true) {
                    Cetak_Form_BOK(response.data.data.kodeDokumen);
                }
                onClose();
            }
        } catch (error: any) {
            if (error) {
                console.log(error);
                // ke pa hari
                if (error?.response?.data?.error.toLowerCase().startsWith(`Error saving data : Duplicate entry '`.toLocaleLowerCase())) {
                    if (tryAgain.current >= 2) {
                        console.log('Tetap gagal di percobaan ke', tryAgain.current);
                        Swal.fire({
                            title: 'Gagal Simpan, coba lagi',
                            text: error?.response?.data?.error,
                            target: '#forDialogAndSwall',
                            timer: 5000,
                            icon: 'warning',
                        });
                        tryAgain.current = 1;
                        endProgress();
                        return;
                    }
                    console.log('iya duplikat coba lagi percobaan ke ', tryAgain.current);
                    tryAgain.current += 1;
                    await generateNU(kode_entitas, vNoMBUtama, '96', moment().format('YYYYMM'));
                    savedoc();
                    return;
                }
                endProgress();
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: error?.response?.data?.error,
                    target: '#forDialogAndSwall',
                    timer: 5000,
                    icon: 'warning',
                });
                return;
            }
        }
    };

    const editdoc = async () => {
        console.log('edit dok');
        startProgress();
        const kirim = {
            kode_fk: masterData.kode_fk,
            entitas: kode_entitas,
            no_fk: masterData.no_fk,
            tgl_fk: moment(headerDialogState.tgl_bok).format('YYYY-MM-DD HH:mm:ss'),
            nopol: headerDialogState.no_kendaraan.slice(0, 14),
            tujuan: headerDialogState.tujuan,
            pengemudi: headerDialogState.pengemudi,
            spbu: bodyState.nama_spbu,
            liter: bodyState.liter == '' ? '0' : bodyState.liter,
            nominal: bodyState.nominal_bbm == '' ? '0' : bodyState.nominal_bbm,
            servis: bodyState.nominal_servis == '' ? '0' : bodyState.nominal_servis,
            jenis_servis: bodyState.jenis_perbaikan,
            kmawal: bodyState.km_sebelumnya == '' ? '0' : bodyState.km_sebelumnya,
            kmakhir: bodyState.posisi_km_sekarang == '' ? '0' : bodyState.posisi_km_sekarang,
            kmjarak: bodyState.km_jalan == '' ? '0' : bodyState.km_jalan,
            jalan: bodyState.uang_jalan == '' ? '0' : bodyState.uang_jalan,
            kenek: bodyState.kenek == '' ? '0' : bodyState.kenek,
            parkir: bodyState.parkir == '' ? '0' : bodyState.parkir,
            tol: bodyState.tol == '' ? '0' : bodyState.tol,
            bongkar: bodyState.bongkar_muat == '' ? '0' : bodyState.bongkar_muat,
            mel: bodyState.mel == '' ? '0' : bodyState.mel,
            lain: bodyState.lain_lain == '' ? '0' : bodyState.lain_lain,
            rasio: bodyState.rasio == '' ? '0' : bodyState.rasio,
            jumlah_mu: bodyState.total == '' ? '0' : bodyState.total,
            keterangan: keterangan,
            userid: userid.toUpperCase(),
        };

        try {
            const response: any = await axios.patch(`${apiUrl}/erp/update_bok_dashboard?`, kirim, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response', response);

            if (response.data.status) {
                const auditReqBodySPM = {
                    entitas: kode_entitas,
                    kode_audit: null,
                    dokumen: 'BO',
                    kode_dokumen: masterData.kodeDokumen,
                    no_dokumen: masterData.no_fk,
                    tanggal: moment().format('YYYY-MM-DD HH:mm:ss'),
                    proses: 'EDIT',
                    diskripsi: `Biaya Operasional Kendaraan nilai transaksi = ${formatNumber(bodyState.total)}`,
                    userid: userid,
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
                    timer: 2000,
                });
                endProgress();
                if (onCetakDialog.current === true) {
                    Cetak_Form_BOK(response.data.data.kodeDokumen);
                }
                onClose();
            }
        } catch (error: any) {
            if (error) {
                console.log(error);
                Swal.fire({
                    title: 'Gagal Simpan',
                    text: error?.response?.data?.error,
                    target: '#forDialogAndSwall',
                    timer: 2000,
                    icon: 'warning',
                });
                endProgress();
                return;
            }
        }
    };

    const handleTgl = async (date: any, tipe: string) => {
        if (tipe === 'tgl_bok') {
            setHeaderDialogState((oldData: any) => ({
                ...oldData,
                tgl_bok: moment(date).format('YYYY-MM-DD'),
            }));
        }
    };
    return (
        <DialogComponent
            id="dialogBaruEditBOK"
            isModal={true}
            width="93%"
            height="90%"
            visible={visible}
            close={() => onClose()}
            header={header}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            position={{ X: 'center', Y: 'center' }} // Dialog berada di tengah
            style={{ position: 'fixed' }}
        >
            <div className="flex h-full w-full flex-col" id="forDialogAndSwall">
                {/* <GlobalProgressBar /> */}
                {visbleDialogKendaraan && (
                    <DIalogKendaraan
                        token={token}
                        apiUrl={apiUrl}
                        kode_entitas={kode_entitas}
                        visible={visbleDialogKendaraan}
                        onClose={handleShowKendaraan}
                        setHeaderDialogState={setHeaderDialogState}
                        setBodyState={setBodyState}
                    />
                )}
                {visbleDialogPengemudi && (
                    <DialogPengemudi
                        token={token}
                        apiUrl={apiUrl}
                        kode_entitas={kode_entitas}
                        visible={visbleDialogPengemudi}
                        onClose={handleShowPengemudi}
                        setHeaderDialogState={setHeaderDialogState}
                    />
                )}
                {visbleDialogListServis && (
                    <DialogListServis token={token} apiUrl={apiUrl} kode_entitas={kode_entitas} visible={visbleDialogListServis} onClose={handleShowListServis} setHeaderDialogState={setBodyState} />
                )}
                {visbleDialogServisCrud && (
                    <DialogServisCrud
                        userid={userid}
                        token={token}
                        apiUrl={apiUrl}
                        kode_entitas={kode_entitas}
                        visible={visbleDialogServisCrud}
                        onClose={handleShowServisCrud}
                        setHeaderDialogState={setBodyState}
                    />
                )}

                {visbleDialogTambahKendaraan === true && (
                    <DialogBaruEditKendaraanMaster
                        refreshData={() => {}}
                        visible={visbleDialogTambahKendaraan}
                        onClose={() => setVisbleDialogTambahKendaraan(false)}
                        masterState={'BARU'}
                        masterData={[]}
                        bokflag={true}
                    />
                )}
                <div className="h-[30%]  w-full border-b">
                    <table className="ml-10 w-[350px]">
                        <tbody className="border-none">
                            <tr className="border-none">
                                <td className="w-28 text-right text-xs">Tanggal</td>
                                <td className="w-72">
                                    <span className="flex h-[4vh] w-full items-center rounded-sm border border-gray-400 bg-white px-2 ">
                                        <DatePickerComponent
                                            locale="id"
                                            cssClass="e-custom-style"
                                            enableMask={true}
                                            showClearButton={false}
                                            format="dd-MM-yyyy"
                                            value={moment(headerDialogState.tgl_bok).toDate()}
                                            change={(args: ChangeEventArgsCalendar) => {
                                                handleTgl(args.value, 'tgl_bok');
                                            }}
                                            style={{
                                                width: '100%',
                                            }}
                                        >
                                            <Inject services={[MaskedDateTime]} />
                                        </DatePickerComponent>
                                    </span>
                                </td>
                            </tr>
                            <tr className="border-none">
                                <td className="w-28 text-right text-xs">No. Bukti</td>
                                <td className="w-72">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        id="no_bok"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="No. Bukti"
                                        readOnly
                                        name="no_bok"
                                        autoFocus={true}
                                        value={headerDialogState.no_bok}
                                        style={{ height: '4vh' }}
                                    />
                                </td>
                            </tr>
                            <tr className="border-none">
                                <td className="w-36 text-right text-xs">
                                    <span className="flex h-full w-full items-center">
                                        <span className="cursor-pointer !text-base" onClick={() => setVisbleDialogTambahKendaraan(true)}>
                                            ➡️
                                        </span>
                                        <span>No. kendaraan</span>
                                    </span>
                                </td>
                                <td className="flex items-center">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        id="no_kendaraan"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="No. Kendaraan"
                                        name="no_kendaraan"
                                        value={headerDialogState.no_kendaraan}
                                        style={{ height: '4vh' }}
                                        onChange={(e) => {
                                            setVisbleDialogKendaraan(true);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="flex items-center justify-center rounded-sm bg-blue-600 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ height: '4vh' }}
                                        onClick={() => setVisbleDialogKendaraan(true)}
                                    >
                                        <FaSearch />
                                    </button>
                                </td>
                            </tr>
                            <tr className="border-none">
                                <td className="w-28 text-right text-xs">Tujuan</td>
                                <td className="w-72">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        id="tujuan"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="Tujuan"
                                        value={headerDialogState.tujuan}
                                        style={{ height: '4vh' }}
                                        onChange={(e) => {
                                            setHeaderDialogState((oldData: any) => ({
                                                ...oldData,
                                                tujuan: e.target.value,
                                            }));
                                        }}
                                    />
                                </td>
                            </tr>
                            <tr className="border-none">
                                <td className="text-right text-xs ">Pengemudi</td>
                                <td className="flex items-center">
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        id="pengemudi"
                                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                        placeholder="pengemudi"
                                        name="pengemudi"
                                        value={headerDialogState.pengemudi}
                                        style={{ height: '4vh' }}
                                        onChange={(e) => {}}
                                    />
                                    <button
                                        type="button"
                                        className="flex items-center justify-center rounded-sm bg-blue-600 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ height: '4vh' }}
                                        onClick={() => {
                                            setVisbleDialogPengemudi(true);
                                        }}
                                    >
                                        <FaSearch />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex h-[60%] w-full border-b">
                    <div>
                        <h3 className="bold text-sm underline"> Pengisian BBM :</h3>
                        <table className="ml-10 w-[350px]">
                            <tbody>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('nama_spbu')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 `}
                                            placeholder={formatString('nama_spbu')}
                                            name="nama_spbu"
                                            value={bodyState.nama_spbu} // Format hanya saat blur
                                            onChange={(e) => {
                                                setBodyState((oldData: any) => ({
                                                    ...oldData,
                                                    nama_spbu: e.target.value,
                                                }));
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('liter')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.liter ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('liter')}
                                            name="liter"
                                            value={isFocused.liter ? hiddenNol(bodyState.liter) : formatNumber(hiddenNol(bodyState.liter))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('nominal_bbm')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.nominal_bbm ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('nominal_bbm')}
                                            name="nominal_bbm"
                                            value={isFocused.nominal_bbm ? hiddenNol(bodyState.nominal_bbm) : formatNumber(hiddenNol(bodyState.nominal_bbm))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 className="bold text-sm underline"> Servis :</h3>
                        <table className="ml-6 w-[350px]">
                            <tbody>
                                <tr className=" border-none">
                                    <td className="w-28 text-right text-xs">
                                        <span className="flex h-full w-full items-center">
                                            <span className="cursor-pointer !text-base " onClick={() => setVisbleDialogServisCrud(true)}>
                                                ➡️
                                            </span>
                                            <span className=" w-[90px]">{formatString('jenis_perbaikan')}</span>
                                        </span>
                                    </td>

                                    <td className="flex items-center">
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="jenis_perbaikan"
                                            className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                            placeholder={formatString('jenis_perbaikan')}
                                            name="jenis_perbaikan"
                                            value={bodyState.jenis_perbaikan}
                                            style={{ height: '4vh' }}
                                            onChange={(e) => {
                                                setVisbleDialogListServis(true);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="flex items-center justify-center rounded-sm bg-blue-600 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{ height: '4vh' }}
                                            onClick={() => setVisbleDialogListServis(true)}
                                        >
                                            <FaSearch />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('nominal_servis')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.nominal_servis ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('nominal_servis')}
                                            name="nominal_servis"
                                            value={isFocused.nominal_servis ? hiddenNol(bodyState.nominal_servis) : formatNumber(hiddenNol(bodyState.nominal_servis))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h3 className="bold text-sm underline"> Pencatatan Kilo Meter :</h3>
                        <table className="ml-10 w-[350px]">
                            <tbody>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('km_sebelumnya')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="km_sebelumnya"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.km_sebelumnya ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('km_sebelumnya')}
                                            name="km_sebelumnya"
                                            value={isFocused.km_sebelumnya ? hiddenNol(bodyState.km_sebelumnya) : formatNumber(hiddenNol(bodyState.km_sebelumnya))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            readOnly={headerDialogState?.no_kendaraan?.trim() == '0' || headerDialogState?.no_kendaraan?.trim() == ''}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('posisi_km_sekarang')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.posisi_km_sekarang ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('posisi_km_sekarang')}
                                            name="posisi_km_sekarang"
                                            value={isFocused.posisi_km_sekarang ? hiddenNol(bodyState.posisi_km_sekarang) : formatNumber(hiddenNol(bodyState.posisi_km_sekarang))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            readOnly={headerDialogState?.no_kendaraan?.trim() == '0' || headerDialogState?.no_kendaraan?.trim() == ''}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('km_jalan')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            readOnly
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-200 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.km_jalan ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('km_jalan')}
                                            name="km_jalan"
                                            value={isFocused.km_jalan ? hiddenNol(bodyState.km_jalan) : formatNumber(hiddenNol(bodyState.km_jalan))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 className="bold text-sm underline"> Beban Operasional :</h3>
                        <table className="md:-[300px] ml-10 w-[250px]">
                            <tbody>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('uang_jalan')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.uang_jalan ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('uang_jalan')}
                                            name="uang_jalan"
                                            value={isFocused.uang_jalan ? hiddenNol(bodyState.uang_jalan) : formatNumber(hiddenNol(bodyState.uang_jalan))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('kenek')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.kenek ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('kenek')}
                                            name="kenek"
                                            value={isFocused.kenek ? hiddenNol(bodyState.kenek) : formatNumber(hiddenNol(bodyState.kenek))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('parkir')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.parkir ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('parkir')}
                                            name="parkir"
                                            value={isFocused.parkir ? hiddenNol(bodyState.parkir) : formatNumber(hiddenNol(bodyState.parkir))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('tol')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.tol ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('tol')}
                                            name="tol"
                                            value={isFocused.tol ? hiddenNol(bodyState.tol) : formatNumber(hiddenNol(bodyState.tol))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('bongkar_muat')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.bongkar_muat ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('bongkar_muat')}
                                            name="bongkar_muat"
                                            value={isFocused.bongkar_muat ? hiddenNol(bodyState.bongkar_muat) : formatNumber(hiddenNol(bodyState.bongkar_muat))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('mel')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.mel ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('mel')}
                                            name="mel"
                                            value={isFocused.mel ? hiddenNol(bodyState.mel) : formatNumber(hiddenNol(bodyState.mel))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('lain_lain')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.lain_lain ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('lain_lain')}
                                            name="lain_lain"
                                            value={isFocused.lain_lain ? hiddenNol(bodyState.lain_lain) : formatNumber(hiddenNol(bodyState.lain_lain))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('total')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            readOnly
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-200 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.total ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('total')}
                                            name="total"
                                            value={isFocused.total ? hiddenNol(bodyState.total) : formatNumber(hiddenNol(bodyState.total))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                                <tr className="border-none">
                                    <td className="w-28 text-right text-xs">{formatString('rasio')}</td>
                                    <td>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            id="number-input"
                                            readOnly
                                            className={`h-[3vh] w-[100px] rounded-sm border border-gray-400 bg-gray-200 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                                isFocused.rasio ? 'text-left' : 'text-right'
                                            }`}
                                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Hapus karakter non-angka
                                            }}
                                            placeholder={formatString('rasio')}
                                            name="rasio"
                                            value={isFocused.rasio ? hiddenNol(bodyState.rasio) : formatNumber(hiddenNol(bodyState.rasio))} // Format hanya saat blur
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full md:w-[50%]">
                        <h3 className="bold text-sm underline"> Keterangan :</h3>
                        <textarea
                            id="simple-textarea"
                            className="h-[50%] w-full rounded-sm border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Keterangan BOK"
                            name="keterangan"
                            rows={8}
                            value={keterangan}
                            onChange={(e) => setKeterangan(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div className="flex h-[10%]  w-full items-center justify-end gap-2">
                    <DropDownButtonComponent id="dropdownelement" items={items} style={{ height: '50%', backgroundColor: 'GrayText' }} select={handleSelectCetak}>
                        {' '}
                        Cetak{' '}
                    </DropDownButtonComponent>
                    <ButtonComponent type="submit" onClick={validasiForm}>
                        Simpan
                    </ButtonComponent>
                    <ButtonComponent type="submit" onClick={() => onClose()}>
                        Tutup
                    </ButtonComponent>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogBaruEditBOK;
