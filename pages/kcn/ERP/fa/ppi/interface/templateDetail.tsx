import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { Grid, GridComponent, VirtualScroll, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import styles from '../ppilist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes, faArrowRight, faEraser, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import { swalDialog, swalToast, tabs, tabsTransfer, tabsWarkat } from './template';
import { CurrencyFormat, DetailNoFakturDelete, DetailNoFakturDeleteAll, HandleCariNoFj } from '../functional/fungsiFormPpiList';
import { DetailNoFakturPpi, DetailNoFakturPpiPajak, GetBarcodeWarkat, GetTbImages, loadFileGambarTTD, LoadImages } from '../model/apiPpi';
import ImageWithDeleteButton from '../functional/ImageWithDeleteButton';
import { frmNumber } from '@/utils/routines';

interface templateDetailProps {
    userid: any;
    kode_entitas: any;
    dataBarang: any;
    setStateDataHeader: Function;
    setDataBarang: Function;
    setStateDataFooter: Function;
    stateDataHeader: any;
    setStateDataDetail: Function;
    masterDataState: any;
    onClickAutoJurnal: any;
    dataJurnal: any;
    setDataJurnal: Function;

    setIndexPreview: Function;
    setIsOpenPreview: Function;
    setZoomScale: Function;
    setPosition: Function;
    setImageDataUrl: Function;
    setFilteredDataBarang: Function;
    stateDataDetail: any;
    filteredDataBarang: any;
    viewTTDDialog: any;
    handleAddDetailJurnal: any;
    listDepartement: any;
    listDivisi: any;
    onClickTemplateAkun: any;
    onClickSubsidiaryLedger: any;
    vToken: any;

    images: any[];
    setImages: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedFiles: Function;
    setNamaFiles: Function;
    loadFilePendukung: any;
    setLoadFilePendukung: Function;

    extractedFiles: any;
    setExtractedFiles: Function;
    setNamaFilesExt1: Function;

    masterKodeDokumen: any;
    onRefreshTipe: any;
    clearAllImages: any;
    modalJenisPenerimaan: any;

    cetakBarcodewarkat: any;
    isFilePendukungPPI: any;
    gridPpiListRef: any;
    gridPpiListRefCurrent: any;
    // isOpen: boolean;
    // onClose: any;
    // kode_user: any;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
let statusJurnal: string;
let gridJurnalPpiListRef: Grid | any;
const pageSettings = {
    pageSize: 100,
};
const TemplateDetail: React.FC<templateDetailProps> = ({
    userid,
    kode_entitas,
    dataBarang,
    setStateDataHeader,
    setDataBarang,
    setStateDataFooter,
    stateDataHeader,
    setStateDataDetail,
    masterDataState,
    onClickAutoJurnal,
    dataJurnal,
    setDataJurnal,

    setIndexPreview,
    setIsOpenPreview,
    setZoomScale,
    setPosition,
    setImageDataUrl,
    setFilteredDataBarang,
    stateDataDetail,
    filteredDataBarang,
    viewTTDDialog,
    handleAddDetailJurnal,

    listDepartement,
    listDivisi,
    onClickTemplateAkun,
    onClickSubsidiaryLedger,
    vToken,

    images,
    setImages,
    setSelectedFiles,
    setNamaFiles,
    loadFilePendukung,
    setLoadFilePendukung,

    extractedFiles,
    setExtractedFiles,
    setNamaFilesExt1,

    masterKodeDokumen,
    onRefreshTipe,
    clearAllImages,
    modalJenisPenerimaan,

    cetakBarcodewarkat,
    isFilePendukungPPI,
    gridPpiListRef,
    gridPpiListRefCurrent,
}: templateDetailProps) => {
    let tabsFilePendukung: any[];
    if (modalJenisPenerimaan === 'Tunai') {
        tabsFilePendukung = tabs;
    } else if (modalJenisPenerimaan === 'Transfer') {
        tabsFilePendukung = tabsTransfer;
    } else {
        tabsFilePendukung = tabsWarkat;
    }

    let currentDaftarBarang: any[] = [];
    let currentDaftarJurnal: any[] = [];
    // const gridPpiListRef = useRef<GridComponent>(null);
    // const gridJurnalPpiListRef = useRef<GridComponent>(null);
    // const [images, setImages] = useState<string[][]>([]);

    useEffect(() => {
        if (masterDataState === 'BARU') {
            if (gridPpiListRefCurrent) {
                // Setel dataSource menjadi array kosong
                gridPpiListRefCurrent?.setProperties({ dataSource: [] });

                // Jika grid memerlukan refresh untuk memperbarui tampilan, panggil refresh()
                gridPpiListRefCurrent?.refresh();
            }
        }
    }, []);

    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const qtyParams = { params: { format: 'N2' } };
    const headerSisaNilaiFaktur = () => {
        const bgcolor = 'tranparent';
        const fcolor = '#5d676e';
        return (
            // <TooltipComponent content="Sisa nilai faktur yang harus dibayar" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: 4, marginBottom: 4 }}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Sisa nilai faktur
                    <br />
                    yang harus dibayar
                </span>
            </div>
            // </TooltipComponent>
        );
    };

    const headerJumlahPenerimaan = () => {
        const bgcolor = 'tranparent';
        const fcolor = '#5d676e';
        return (
            // <TooltipComponent content="Jumlah Penerimaan" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: 4, marginBottom: 4 }}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Jumlah
                    <br />
                    Penerimaan
                </span>
            </div>
            // </TooltipComponent>
        );
    };

    const headerNilaiFaktur = () => {
        const bgcolor = 'tranparent';
        const fcolor = '#5d676e';
        return (
            // <TooltipComponent content="Jumlah Penerimaan" opensOn="Hover" openDelay={1000} position="BottomCenter">
            <div style={{ background: bgcolor, width: '100%', lineHeight: 1.3, marginTop: 4, marginBottom: 4 }}>
                <span style={{ width: '80px', fontSize: 11, textAlign: 'center', paddingLeft: '0px', color: fcolor, background: bgcolor }}>
                    Nilai Faktur
                    <br />
                    (MU)
                </span>
            </div>
            // </TooltipComponent>
        );
    };

    // const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, args: any) => {
    //     if (event.key === ' ') {
    //         // Jika tombol Space ditekan
    //         event.preventDefault(); // Mencegah scroll pada tombol Space
    //         handleTemplatePilih1(args.no_fj, !args.bayar_mu); // Toggle nilai checkbox
    //     }
    // };

    const templatePilih = (args: any) => {
        const checkboxStyle = {
            accentColor: '#4361EE',
        };
        return (
            <input
                disabled={
                    modalJenisPenerimaan === 'Pencairan' ||
                    modalJenisPenerimaan === 'Penolakan' ||
                    modalJenisPenerimaan === 'batal cair' ||
                    modalJenisPenerimaan === 'batal tolak' ||
                    modalJenisPenerimaan === 'Edit Pencairan' ||
                    modalJenisPenerimaan === 'Edit Penolakan'
                        ? true
                        : false
                }
                onClick={(event: any) => handleTemplatePilih1(args, event.target.checked, args.index)}
                // onKeyDown={(event: any) => handleKeyDown(event, args)} // Tambahkan handler untuk tombol Space
                type="checkbox"
                checked={args.bayar_mu > 0 ? true : false}
                style={checkboxStyle}
                readOnly
            />
        );
    };

    const editTemplatePilih = (args: any) => {
        const checkboxStyle = {
            accentColor: '#4361EE',
        };
        return (
            <input
                disabled={
                    modalJenisPenerimaan === 'Pencairan' ||
                    modalJenisPenerimaan === 'Penolakan' ||
                    modalJenisPenerimaan === 'batal cair' ||
                    modalJenisPenerimaan === 'batal tolak' ||
                    modalJenisPenerimaan === 'Edit Pencairan' ||
                    modalJenisPenerimaan === 'Edit Penolakan'
                        ? true
                        : false
                }
                onClick={(event) => handleTemplatePilih(event, args)}
                type="checkbox"
                checked={args.bayar_mu > 0 ? true : false}
                style={checkboxStyle}
                readOnly
            />
        );
    };

    const handleTemplatePilih = async (event: any, args: any) => {
        const isCheck = event.target.checked;
        const noFj = args.no_fj;
        const bayarMu = parseFloat(args.bayar_mu);

        const dataSource = gridPpiListRefCurrent?.dataSource;

        if (Array.isArray(dataSource)) {
            // Cari indeks elemen berdasarkan `no_fj`
            const index = dataSource.findIndex((item) => item.no_fj === args.no_fj);

            if (index !== -1) {
                console.log('Target ditemukan:', dataSource[index]);

                // Siapkan variabel untuk data yang telah diedit
                let editedData;

                if (isCheck) {
                    // Logika saat checkbox dicentang
                    editedData = {
                        ...dataSource[index],
                        sisa_faktur2: 0,
                        bayar_mu: dataSource[index].sisa_faktur2, // Salin nilai awal `sisa_faktur2`
                    };
                } else {
                    // Logika saat checkbox tidak dicentang
                    const sisaFaktur = parseFloat(dataSource[index].sisa_faktur2) + bayarMu;
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        disabledResetPembayaran: true,
                    }));
                    editedData = {
                        ...dataSource[index],
                        sisa_faktur2: sisaFaktur, // Hitung ulang `sisa_faktur2`
                        bayar_mu: 0, // Reset nilai `bayar_mu`
                    };
                }

                // Perbarui elemen dalam array di indeks yang ditemukan
                dataSource[index] = editedData;

                // Debugging tambahan
                console.log('Data yang diperbarui:', editedData);
                console.log('DataSource setelah diupdate:', dataSource);

                let totPenerimaan: any;
                let totPiutang: any;

                totPenerimaan = dataSource.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.bayar_mu);
                }, 0);
                totPiutang = dataSource.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.owing);
                }, 0);

                await setStateDataFooter((prevState: any) => ({
                    ...prevState,
                    totalPenerimaan: totPenerimaan,
                    selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
                    sisaPiutang: totPiutang - totPenerimaan,
                    totalPiutang: totPiutang,
                }));

                // Salin array untuk memaksa rendering ulang di grid (untuk kasus reaktivitas)
                gridPpiListRefCurrent!.dataSource = [...dataSource]; // Salinan baru
                setDataBarang({ nodes: [...dataSource] });

                // Refresh grid untuk memperbarui tampilan
                if (gridPpiListRefCurrent?.refresh) {
                    gridPpiListRefCurrent.refresh();
                }
            } else {
                console.error(`Data dengan no_fj: ${args.no_fj} tidak ditemukan di dataSource.`);
            }
        } else {
            console.error('dataSource bukan array atau belum diinisialisasi.');
        }

        // const newNodes = await dataBarang?.nodes.map((node: any) => {
        //     if (node.no_fj === noFj) {
        //         // let jumlahPembayaran = parseFloat((document.getElementsByName('jumlah_pembayaran')[0] as HTMLFormElement).value);
        //         let sisaFaktur;
        //         if (isCheck === true) {
        //             sisaFaktur = node.sisa_faktur2 - node.sisa_faktur2;
        //             return {
        //                 ...node,
        //                 sisa_faktur2: sisaFaktur,
        //                 bayar_mu: node.sisa_faktur2,
        //             };
        //         } else {
        //             sisaFaktur = parseFloat(node.sisa_faktur2) + bayarMu;
        //             setStateDataHeader((prevState: any) => ({
        //                 ...prevState,
        //                 disabledResetPembayaran: true,
        //             }));
        //             return {
        //                 ...node,
        //                 sisa_faktur2: sisaFaktur,
        //                 bayar_mu: 0,
        //             };
        //         }
        //     } else {
        //         return node;
        //     }
        // });

        // let totPenerimaan: any;
        // let totPiutang: any;

        // totPenerimaan = newNodes.reduce((acc: number, node: any) => {
        //     return acc + parseFloat(node.bayar_mu);
        // }, 0);
        // totPiutang = newNodes.reduce((acc: number, node: any) => {
        //     return acc + parseFloat(node.owing);
        // }, 0);

        // await setStateDataFooter((prevState: any) => ({
        //     ...prevState,
        //     totalPenerimaan: totPenerimaan,
        //     selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
        //     sisaPiutang: totPiutang - totPenerimaan,
        //     totalPiutang: totPiutang,
        // }));

        // // const isNoZeroPayment = newNodes.every((node: any) => node.jumlah_pembayaran !== 0);
        // // if (isNoZeroPayment) {
        // //     await setStateDataHeader((prevState: any) => ({
        // //         ...prevState,
        // //         disabledResetPembayaran: true,
        // //     }));
        // // } else {
        // //     await setStateDataHeader((prevState: any) => ({
        // //         ...prevState,
        // //         disabledResetPembayaran: false,
        // //     }));
        // // }

        // await setDataBarang({ nodes: newNodes });
        // //     return {
        // //         nodes: newNodes,
        // //     };
        // // });
    };

    const handleTemplatePilih1 = async (args: any, event: any, rowIndex: any) => {
        // console.log('temlate detail grid gridPpiListRef = ', gridPpiListRefCurrent?.dataSource);

        const isCheck = event;
        const noFj = args.no_fj;

        const dataSource = gridPpiListRefCurrent?.dataSource;

        if (Array.isArray(dataSource)) {
            // Cari indeks elemen berdasarkan `no_fj`
            const index = dataSource.findIndex((item) => item.no_fj === args.no_fj);

            if (index !== -1) {
                console.log('Target ditemukan:', dataSource[index]);

                // Siapkan variabel untuk data yang telah diedit
                let editedData;

                if (isCheck) {
                    // Logika saat checkbox dicentang
                    editedData = {
                        ...dataSource[index],
                        sisa_faktur2: 0,
                        bayar_mu: dataSource[index].sisa_faktur2, // Salin nilai awal `sisa_faktur2`
                    };
                } else {
                    // Logika saat checkbox tidak dicentang
                    const sisaFaktur = parseFloat(dataSource[index].sisa_faktur2) + parseFloat(dataSource[index].bayar_mu);
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        disabledResetPembayaran: true,
                    }));
                    editedData = {
                        ...dataSource[index],
                        sisa_faktur2: sisaFaktur, // Hitung ulang `sisa_faktur2`
                        bayar_mu: 0, // Reset nilai `bayar_mu`
                    };
                }

                // Perbarui elemen dalam array di indeks yang ditemukan
                dataSource[index] = editedData;

                // Debugging tambahan
                console.log('Data yang diperbarui:', editedData);
                console.log('DataSource setelah diupdate:', dataSource);

                let totPenerimaan: any;
                let totPiutang: any;

                totPenerimaan = await dataSource.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.bayar_mu);
                }, 0);
                totPiutang = await dataSource.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.owing);
                }, 0);

                await setStateDataFooter((prevState: any) => ({
                    ...prevState,
                    totalPenerimaan: totPenerimaan,
                    selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
                    sisaPiutang: totPiutang - totPenerimaan,
                    totalPiutang: totPiutang,
                }));

                // Salin array untuk memaksa rendering ulang di grid (untuk kasus reaktivitas)
                gridPpiListRefCurrent!.dataSource = [...dataSource]; // Salinan baru
                setDataBarang({ nodes: [...dataSource] });

                // Refresh grid untuk memperbarui tampilan
                if (gridPpiListRefCurrent?.refresh) {
                    gridPpiListRefCurrent.refresh();
                }
            } else {
                console.error(`Data dengan no_fj: ${args.no_fj} tidak ditemukan di dataSource.`);
            }
        } else {
            console.error('dataSource bukan array atau belum diinisialisasi.');
        }

        // const tempDataSource: any = gridPpiListRefCurrent?.dataSource;
        // const tempPerNoFB = tempDataSource[rowIndex];

        // let newNodes: any;
        // if (tempPerNoFB.no_fj === noFj) {
        //     let bayarMu = tempPerNoFB.bayar_mu;
        //     let sisaFaktur;
        //     if (isCheck === true) {
        //         sisaFaktur = tempPerNoFB.sisa_faktur2 - tempPerNoFB.sisa_faktur2;
        //         newNodes = {
        //             ...tempPerNoFB,
        //             sisa_faktur2: sisaFaktur,
        //             bayar_mu: tempPerNoFB.sisa_faktur2,
        //         };
        //     } else {
        //         sisaFaktur = parseFloat(tempPerNoFB.sisa_faktur2) + parseFloat(bayarMu);
        //         setStateDataHeader((prevState: any) => ({
        //             ...prevState,
        //             disabledResetPembayaran: true,
        //         }));
        //         newNodes = {
        //             ...tempPerNoFB,
        //             sisa_faktur2: sisaFaktur,
        //             bayar_mu: 0,
        //         };
        //     }
        // }

        // console.log('argsxxx', newNodes);

        // gridPpiListRefCurrent.dataSource[rowIndex] = newNodes;
        // gridPpiListRefCurrent?.refresh();

        // await setDataBarang((state: any) => {
        // const newNodes = await dataBarang?.nodes.map((node: any) => {
        //     if (node.no_fj === noFj) {
        //         let bayarMu = node.bayar_mu;
        //         let sisaFaktur;
        //         if (isCheck === true) {
        //             sisaFaktur = node.sisa_faktur2 - node.sisa_faktur2;
        //             return {
        //                 ...node,
        //                 sisa_faktur2: sisaFaktur,
        //                 bayar_mu: node.sisa_faktur2,
        //             };
        //         } else {
        //             sisaFaktur = parseFloat(node.sisa_faktur2) + parseFloat(bayarMu);
        //             setStateDataHeader((prevState: any) => ({
        //                 ...prevState,
        //                 disabledResetPembayaran: true,
        //             }));
        //             return {
        //                 ...node,
        //                 sisa_faktur2: sisaFaktur,
        //                 bayar_mu: 0,
        //             };
        //         }
        //     } else {
        //         return node;
        //     }
        // });

        // // let totPenerimaan: any;
        // // let totPiutang: any;

        // // totPenerimaan = await newNodes.reduce((acc: number, node: any) => {
        // //     return acc + parseFloat(node.bayar_mu);
        // // }, 0);
        // // totPiutang = await newNodes.reduce((acc: number, node: any) => {
        // //     return acc + parseFloat(node.owing);
        // // }, 0);

        // // await setStateDataFooter((prevState: any) => ({
        // //     ...prevState,
        // //     totalPenerimaan: totPenerimaan,
        // //     selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
        // //     sisaPiutang: totPiutang - totPenerimaan,
        // //     totalPiutang: totPiutang,
        // // }));

        // // const isNoZeroPayment = await newNodes.every((node: any) => node.jumlah_pembayaran !== 0);
        // // if (isNoZeroPayment) {
        // //     await setStateDataHeader((prevState: any) => ({
        // //         ...prevState,
        // //         disabledResetPembayaran: false,
        // //     }));
        // // } else {
        // //     await setStateDataHeader((prevState: any) => ({
        // //         ...prevState,
        // //         disabledResetPembayaran: true,
        // //     }));
        // // }

        // await setDataBarang({ nodes: newNodes });
    };
    // End

    const frmNumberSyncfusion = (value: any) => {
        // Menggunakan fungsi Number() untuk mengonversi string menjadi angka
        let numericValue = Number(value);

        // Memeriksa apakah nilai numerik adalah NaN
        if (isNaN(numericValue)) {
            numericValue = 0; // Mengubah NaN menjadi 0
        }

        // Menggunakan fungsi Number.toLocaleString() untuk memformat angka
        const formattedValue = numericValue.toLocaleString('de-DE', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formattedValue;
    };

    const EditTemplateSisaFaktur = (args: any) => {
        return (
            <div>
                <input
                    style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-21px', color: '#b1acac' }}
                    id="sisa_faktur2"
                    name="sisa_faktur2"
                    value={frmNumberSyncfusion(args.sisa_faktur2)}
                    disabled={true}
                />
            </div>
        );
    };

    const EditTemplateSisaNilaiFaktur = (args: any) => {
        return (
            <div>
                <input
                    style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-21px', color: '#b1acac' }}
                    id="owing"
                    name="owing"
                    value={frmNumberSyncfusion(args.owing)}
                    disabled={true}
                />
            </div>
        );
    };

    const EditTemplateNilaiPajak = (args: any) => {
        return (
            <div>
                <input
                    style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-21px', color: '#b1acac' }}
                    id="total_pajak_rp"
                    name="total_pajak_rp"
                    value={frmNumberSyncfusion(args.total_pajak_rp)}
                    disabled={true}
                />
            </div>
        );
    };

    const EditTemplateNilaiFaktur = (args: any) => {
        return (
            <div>
                <input
                    style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-21px', color: '#b1acac' }}
                    id="netto_mu"
                    name="netto_mu"
                    value={frmNumberSyncfusion(args.netto_mu)}
                    disabled={true}
                />
            </div>
        );
    };

    const EditTemplateTglJt = (args: any) => {
        return (
            <div>
                <input
                    style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-70px', color: '#b1acac' }}
                    id="JT"
                    name="JT"
                    value={moment(args.JT).format('DD-MM-YYYY')}
                    disabled={true}
                />
            </div>
        );
    };

    const EditTemplateTglFj = (args: any) => {
        return (
            <div>
                <input
                    style={{ textAlign: 'right', backgroundColor: 'transparent', border: 'none', marginLeft: '-70px', color: '#b1acac' }}
                    id="tgl_fj"
                    name="tgl_fj"
                    // value={moment(args.tgl_fj).format('DD-MM-YYYY')}
                    disabled={true}
                />
            </div>
        );
    };

    // JUrnal
    const OpenPreviewInsert = (index: any) => {
        setIndexPreview(index);
        setIsOpenPreview(true);
        setZoomScale(0.5); // Reset zoom scale
        setPosition({ x: 0, y: 0 }); // Reset position

        // if (index === '1') {
        //     setImageDataUrl(stateDataDetail?.preview);
        // } else if (index === '2') {
        //     setImageDataUrl(stateDataDetail?.preview2);
        // } else if (index === '3') {
        //     setImageDataUrl(stateDataDetail?.preview3);
        // } else {
        //     setImageDataUrl(stateDataDetail?.preview4);
        // }

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

    const inputDepartemenJurnalRef = useRef(null);
    const rowIdDepartemenJurnalRef = useRef(null);

    const tipeDetailJurnal = useRef('');

    const TemplateDepartemen = (args: any) => {
        return (
            <div className="container form-input" style={{ border: 'none' }}>
                <DropDownListComponent
                    id="departemen"
                    className="form-select"
                    dataSource={listDepartement.map((data: any) => data.nama_dept)}
                    placeholder="-- Silahkan Pilih Departemen --"
                    change={(d: ChangeEventArgsDropDown) => {
                        const selectedDept = listDepartement.find((dept: any) => dept.nama_dept === d.value);
                        inputDepartemenJurnalRef.current = selectedDept;
                        rowIdDepartemenJurnalRef.current = args.id;
                        tipeDetailJurnal.current = 'departemen';
                        reCall(tipeDetailJurnal.current, inputDepartemenJurnalRef.current, setDataJurnal, rowIdDepartemenJurnalRef.current);
                    }}
                    value={stateDataDetail?.selectedOptionDepartemen}
                />
            </div>
        );
    };

    const inputDivisiJurnalRef = useRef(null);
    const rowIdDivisiJurnalRef = useRef(null);

    const TemplateDivisi = (args: any) => {
        return (
            <div className="container form-input" style={{ border: 'none' }}>
                <DropDownListComponent
                    id="divisi"
                    className="form-select"
                    dataSource={listDivisi}
                    fields={{ text: 'nama_jual', value: 'kode_jual' }}
                    placeholder="-- Silahkan Pilih Divisi --"
                    headerTemplate={() => (
                        <div className={styles['dropdown-header']}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: 65 }}>Kode Jual</th>
                                        <th>Nama Jual</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    )}
                    itemTemplate={(data: any) => (
                        <div className={styles['dropdown-item']}>
                            <table style={{ border: 2 }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '65px' }}>{data.kode_jual}</td>
                                        <td style={{ textAlign: 'left' }}>{data.nama_jual}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    valueTemplate={(data: any) => (
                        <span style={{ display: 'flex', justifyContent: 'left', alignItems: 'flex-end', height: '2.4vh', fontSize: '12px' }}>
                            {data ? data.kode_jual + ' | ' + data.nama_jual : '--Silahkan Pilih--'}
                        </span>
                    )}
                    change={(d: ChangeEventArgsDropDown) => {
                        const selectedDiv = listDivisi.find((div: any) => div.kode_jual === d.value);
                        inputDivisiJurnalRef.current = selectedDiv;
                        rowIdDivisiJurnalRef.current = args.id;
                        tipeDetailJurnal.current = 'divisi';
                        reCall(tipeDetailJurnal.current, inputDivisiJurnalRef.current, setDataJurnal, rowIdDivisiJurnalRef.current);
                    }}
                    //value={stateDataDetail?.selectedOptionDivisi}
                />
            </div>
        );
    };

    const EditTemplateNoAkun = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <TextBoxComponent id="no_akun" name="no_akun" className="no_akun" value={args.no_akun} disabled readOnly />
                    <span>
                        <ButtonComponent
                            id="buNoAkun"
                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                            cssClass="e-primary e-small e-round"
                            iconCss="e-icons e-small e-search"
                            onClick={() => onClickTemplateAkun(args)}
                            style={{ backgroundColor: '#3b3f5c' }}
                        />
                    </span>
                </div>
            </div>
        );
    };
    const EditTemplateNamaAkun = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                    <TextBoxComponent id="nama_akun" name="nama_akun" className="nama_akun" value={args.nama_akun} disabled readOnly />
                    <span>
                        <ButtonComponent
                            id="buNamaAkun"
                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                            cssClass="e-primary e-small e-round"
                            iconCss="e-icons e-small e-search"
                            onClick={() => onClickTemplateAkun(args)}
                            style={{ backgroundColor: '#3b3f5c' }}
                        />
                    </span>
                </div>
            </div>
        );
    };

    const EditTemplateSubledger = (args: any) => {
        return (
            <div>
                <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px', textAlign: 'right' }}>
                    <TextBoxComponent id="subledger" name="subledger" className="subledger" value={args.subledger} disabled readOnly />
                    <span>
                        <ButtonComponent
                            id="buSubledger"
                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                            cssClass="e-primary e-small e-round"
                            iconCss="e-icons e-small e-search"
                            onClick={() => onClickSubsidiaryLedger(args)}
                            style={{ backgroundColor: '#3b3f5c' }}
                        />
                    </span>
                </div>
            </div>
        );
    };
    const reCall = async (tipe: string, value: any, setDataJurnal: any, rowsIdJurnal: any) => {
        if (tipe === 'keterangan') {
            const newNodes = await dataJurnal?.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        catatan: value,
                    };
                } else {
                    return node;
                }
            });

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'departemen') {
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                selectedOptionDepartemen: value.kode_dept,
            }));
            const newNodes = await dataJurnal?.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        departemen: value.nama_dept,
                        kode_dept: value.kode_dept,
                    };
                } else {
                    return node;
                }
            });

            await setDataJurnal({ nodes: newNodes });
        } else if (tipe === 'divisi') {
            await setStateDataDetail((prevState: any) => ({
                ...prevState,
                selectedOptionDivisi: value.kode_jual,
            }));
            const newNodes = await dataJurnal?.nodes.map((node: any) => {
                if (node.id === rowsIdJurnal) {
                    return {
                        ...node,
                        nama_jual: value.nama_jual,
                        kode_jual: value.kode_jual,
                    };
                } else {
                    return node;
                }
            });

            await setDataJurnal({ nodes: newNodes });
        }
    };

    const handleClickPelunasanPajak = async (vCheck: any) => {
        let resultDetailNoFakturPpi: any[];

        if (vCheck === false) {
            resultDetailNoFakturPpi = await DetailNoFakturPpi(vToken, kode_entitas, stateDataHeader?.kodeCustomerValue);
        } else {
            resultDetailNoFakturPpi = await DetailNoFakturPpiPajak(vToken, kode_entitas, stateDataHeader?.kodeCustomerValue);
        }

        // await setDataDetailNoFakturPpi(resultDetailNoFakturPpi);

        let totHutang: any;
        let sisaHutang: any;

        Promise.all(
            resultDetailNoFakturPpi.map((item: any) => {
                return {
                    id: stateDataDetail?.idDokumen + 1,
                    kode_dokumen: item.kode_dokumen,
                    id_dokumen: item.id_dokumen,
                    kode_fj: item.kode_fj,
                    no_fj: item.no_fj,
                    tgl_fj: item.tgl_fj,
                    JT: item.JT,
                    hari2: item.hari2,
                    netto_mu: item.netto_mu,
                    kode_mu: item.kode_mu,
                    total_pajak_rp: item.total_pajak_rp,
                    lunas_pajak: item.lunas_pajak,
                    lunas_mu: item.lunas_mu,
                    owing: item.owing,
                    pajak: item.pajak,
                    cetak_tunai: item.cetak_tunai,
                    bayar_mu: 0,
                    sisa_faktur2: item.owing - 0,

                    // pay: item.pay,
                    // bayar: item.bayar,
                    // byr: item.byr,
                    // total_hutang: item.total_hutang,
                    // sisa_hutang: item.sisa_hutang,
                    // faktur: item.faktur,
                    // tot_pajak: item.tot_pajak,
                    // no_sj: item.no_sj,
                    // no_vch: item.no_vch,
                    // no_inv: item.no_inv,
                    // sisa: item.sisa_hutang,
                    // jumlah_pembayaran: 0,
                };
            })
        ).then((newData) => {
            const filteredNewData = newData.filter((data: any) => data !== null); // Filter newData yang tidak memiliki no_barang yang sudah ada di state?.nodes
            const newNodes = [...filteredNewData.filter((data: any) => data !== null)];

            setDataBarang((state: any) => {
                // const existingNodes = state?.nodes.filter((node: any) => node.no_sj === dataItem[0].no_dok);
                const filteredNewData = newData.filter((data: any) => data !== null); // Filter newData yang tidak memiliki no_barang yang sudah ada di state?.nodes
                const newNodes = [...filteredNewData.filter((data: any) => data !== null)];
                totHutang = newData.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.sisa_faktur2);
                }, 0);
                sisaHutang = newData.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.sisa_faktur2);
                }, 0);
                return { ...state, nodes: newNodes }; // Memperbarui nodes dengan data yang diperbarui
            });

            if (gridPpiListRef && Array.isArray(gridPpiListRef.current?.dataSource)) {
                // Salin array untuk menghindari mutasi langsung pada dataSource
                const dataSource = [...gridPpiListRef.current?.dataSource];

                // Flag untuk menentukan apakah baris ditemukan
                let isRowUpdated = false;

                // Perbarui dataSource pada grid
                gridPpiListRef.current?.setProperties({ dataSource: newNodes });

                // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
                if (gridPpiListRef.current?.refresh) {
                    gridPpiListRef.current?.refresh();
                }
            }
        });

        await setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalHutang: 0,
            sisaHutang: 0,
            totalPembayaran: 0,
            selisihAlokasiDana: 0,
        }));
    };

    const editBayarMu = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'number'; // Membatasi input hanya untuk angka
            input.step = 'any'; // Mengizinkan angka desimal
            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 ? '' : value;

                // Mengatur fokus dan memindahkan kursor ke akhir teks
                setTimeout(() => {
                    input.focus();
                    input.select(); // Memblokir seluruh teks di dalam input
                }, 0);
            }
        },
    };

    const actionBeginDetailBarang = async (args: any) => {
        const dataSource = gridPpiListRefCurrent?.dataSource;
        if (args.requestType === 'save') {
            try {
                const newNodes = await dataSource.map((node: any) => {
                    if (node.no_fj === args.rowData.no_fj) {
                        // let jumlahPembayaran = parseFloat((document.getElementsByName('jumlah_pembayaran')[0] as HTMLFormElement).value);
                        let sisaFaktur;
                        if (args.data.bayar_mu < 0) {
                            withReactContent(swalDialog).fire({
                                html: `<p style="font-size:12px">Nilai Jumlah Penerimaan tidak boleh minus.</p>`,
                                width: '350px',
                                heightAuto: true,
                                target: '#dialogPhuList',
                                focusConfirm: false,
                                confirmButtonText: '&ensp; Yes &ensp;',
                                reverseButtons: true,
                            });

                            return {
                                ...node,
                                bayar_mu: frmNumber(0),
                            };
                        } else {
                            if (args.data.bayar_mu > node.sisa_faktur2) {
                                sisaFaktur = node.sisa_faktur2 - node.sisa_faktur2;
                                setStateDataDetail((prevState: any) => ({
                                    ...prevState,
                                    isChecboxPilih: true,
                                }));

                                if (sisaFaktur === 0) {
                                    return {
                                        ...node,
                                        sisa_faktur2: sisaFaktur === 0 ? node.owing - args.data.bayar_mu : sisaFaktur,
                                        bayar_mu: sisaFaktur === 0 ? args.data.bayar_mu : node.owing,
                                    };
                                } else {
                                    withReactContent(swalDialog).fire({
                                        html: `<p style="font-size:12px">Jumlah pembayaran lebih besar dari sisa nilai faktur yang harus dibayar, nilai pembayaran akan disesuaikan.</p>`,
                                        width: '350px',
                                        heightAuto: true,
                                        target: '#dialogPhuList',
                                        focusConfirm: false,
                                        confirmButtonText: '&ensp; Yes &ensp;',
                                        reverseButtons: true,
                                    });

                                    return {
                                        ...node,
                                        sisa_faktur2: sisaFaktur === 0 ? node.owing - args.data.bayar_mu : sisaFaktur,
                                        bayar_mu: sisaFaktur === 0 ? args.data.bayar_mu : node.owing,
                                    };
                                }
                            } else {
                                sisaFaktur = parseFloat(node.sisa_faktur2) - args.data.bayar_mu;

                                setStateDataDetail((prevState: any) => ({
                                    ...prevState,
                                    isChecboxPilih: true,
                                }));
                                return {
                                    ...node,
                                    sisa_faktur2: sisaFaktur,
                                    // jumlah_pembayaran: masterDataState === 'EDIT' ? (jumlahPembayaran === 0 ? node.jumlah_pembayaran : jumlahPembayaran) : jumlahPembayaran,
                                    bayar_mu: args.data.bayar_mu === null ? 0 : args.data.bayar_mu,
                                };
                            }
                        }
                    } else {
                        return node;
                    }
                });

                let totPenerimaan: any;
                let totPiutang: any;
                let totSisaPiutang: any;

                totPenerimaan = await newNodes.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.bayar_mu);
                }, 0);
                totPiutang = await newNodes.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.owing);
                }, 0);

                totSisaPiutang = await newNodes.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.sisa_faktur2);
                }, 0);

                await setStateDataFooter((prevState: any) => ({
                    ...prevState,
                    totalPiutang: masterDataState === 'EDIT' ? totPiutang - args.data.bayar_mu + totPenerimaan : totPiutang,
                    totalPenerimaan: totPenerimaan,
                    selisihAlokasiDana: parseFloat(stateDataHeader?.jumlahBayar === '' ? '0' : stateDataHeader?.jumlahBayar) - parseFloat(totPenerimaan),
                    sisaPiutang: masterDataState === 'EDIT' ? totPiutang - args.data.bayar_mu : totSisaPiutang,
                }));

                // const isNoZeroPayment = newNodes.every((node: any) => node.jumlah_pembayaran !== 0);

                // if (isNoZeroPayment) {
                //     await setStateDataHeader((prevState: any) => ({
                //         ...prevState,
                //         disabledResetPembayaran: false,
                //     }));
                // } else {
                //     await setStateDataHeader((prevState: any) => ({
                //         ...prevState,
                //         disabledResetPembayaran: true,
                //     }));
                // }

                await setDataBarang({ nodes: newNodes });
                gridPpiListRefCurrent!.dataSource = newNodes;
                if (gridPpiListRefCurrent?.refresh) {
                    gridPpiListRefCurrent.refresh();
                }
            } catch (error) {
                console.error('Terjadi kesalahan:', error);
                // Tambahkan logika penanganan kesalahan di sini, jika diperlukan
            }
        }
    };

    const handleClick = async (tab: any, tabIndex: any) => {
        let id_dokumen: any;
        if (masterDataState !== 'BARU') {
            if (tab.id === 3) {
                id_dokumen = parseFloat(tabIndex) + 1;
            } else {
                id_dokumen = tabIndex;
            }

            const load = await LoadImages(kode_entitas, masterKodeDokumen);
            const filterLoad = load.filter((item: any) => item.id_dokumen === id_dokumen);
            if (filterLoad > 0) {
                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    selectedFile: 'update',
                    fileGambar: filterLoad[0].filegambar,
                }));
            } else {
                setStateDataDetail((prevState: any) => ({
                    ...prevState,
                    selectedFile: 'baru',
                    fileGambar: '',
                }));
            }
        } else {
            setStateDataDetail((prevState: any) => ({
                ...prevState,
                selectedFile: 'baru',
                fileGambar: '',
            }));
        }

        const input = document.getElementById(`imageInput${tabIndex}`) as HTMLInputElement;
        if (input) {
            input.click();
        }
        // Implement your button click logic here
    };

    const formattedName = moment().format('YYMMDDHHmmss');

    // Fungsi untuk menangani paste gambar
    const handlePaste = (e: any, tabIndex: any) => {
        if (stateDataDetail?.kodeValidasi === '') {
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px;color:white;">Warkat Cek atau Bilyet Giro belum dicetak barcode.</p>',
                width: '100%',
                target: '#dialogPhuList',
                customClass: {
                    popup: styles['colored-popup'], // Custom class untuk sweetalert
                },
            });
        } else {
            e.preventDefault();

            const items = e.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                    const file = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newImageUrl = event.target?.result;
                        // Memastikan bahwa newImageUrl adalah string sebelum menggunakannya
                        if (typeof newImageUrl === 'string') {
                            const newImages = [...images];
                            newImages[tabIndex] = [newImageUrl];
                            setImages(newImages);
                        }
                    };
                    reader.readAsDataURL(file);

                    if (stateDataDetail?.selectedFile === 'update') {
                        setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);
                        setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, stateDataDetail?.fileGambar.substring(0, stateDataDetail?.fileGambar.length - 4)]);
                    }
                    if (stateDataDetail?.selectedFile === 'baru') {
                        setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);
                        setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, formattedName]);
                    }
                }
            }
        }
    };

    const handleFileUpload = (e: any, tabIndex: any) => {
        // Implement your file upload logic here

        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageData = reader.result;
            if (typeof imageData === 'string') {
                setImages((prevImages: any) => {
                    const newImages = [...prevImages];
                    newImages[tabIndex] = [imageData];
                    return newImages;
                });
            }
        };
        reader.readAsDataURL(file);

        const newFiles = [...e.target.files];
        if (stateDataDetail?.selectedFile === 'update') {
            setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);

            const newNamaFiles = new Array(newFiles.length).fill(formattedName);

            setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, stateDataDetail?.fileGambar.substring(0, stateDataDetail?.fileGambar.length - 4)]);
        }
        if (stateDataDetail?.selectedFile === 'baru') {
            setSelectedFiles((prevFiles: any) => [...prevFiles, { file, tabIndex }]);

            const newNamaFiles = new Array(newFiles.length).fill(formattedName);
            setNamaFiles((prevNamaFiles: any) => [...prevNamaFiles, formattedName]);
            // setNamaFiles((prevNamaFiles: any) => [formattedName]);
        }
    };

    const clearImage = (tabIndex: number) => {
        setImages((prevImages: any) => {
            const newImages = [...prevImages];
            newImages[tabIndex] = [];
            return newImages;
        });
        setSelectedFiles((prevSelectedFiles: any) => {
            const newSelectedFiles = prevSelectedFiles.filter((file: any) => file.tabIndex !== tabIndex);
            return newSelectedFiles;
        });
        setLoadFilePendukung((prevSelectedFiles: any) => {
            const newSelectedFiles = loadFilePendukung.filter((file: any) => file.id_dokumen !== tabIndex);
            return newSelectedFiles;
        });
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

    useEffect(() => {
        if (masterDataState === 'EDIT' || masterDataState === 'UpdateFilePendukung' || masterDataState === 'Pencairan') {
            loadDataImage(masterKodeDokumen);
        }
    }, [onRefreshTipe]);

    const loadDataImage = async (kode_ttb: any) => {
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
                .map((fileName: string) => fileName.replace(/\.(jpg|jpeg|png)$/, '').replace('PU', ''));

            setSelectedFiles((prevFiles: any) => [
                ...prevFiles,
                ...newFiles.map((item: any) => ({
                    file: item.file,
                    // tabIndex: modalJenisPenerimaan === 'Warkat' ? (parseFloat(item.responseIndex) === 2 ? String(parseFloat(item.responseIndex) + 1) : item.responseIndex) : item.responseIndex,
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

    // Jurnal
    const [tipeInput, setTipeInput] = useState('');

    const simulateInputChange = (element: HTMLInputElement, newValue: string) => {
        // Set value and dispatch an input event
        element.value = newValue;
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    };

    const editDebetRp = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'number'; // Membatasi input hanya untuk angka
            input.step = 'any'; // Mengizinkan angka desimal

            input.addEventListener('click', () => {
                input.select(); // Memblokir seluruh teks di dalam input
            });

            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 || value === null || value === undefined ? '' : value;
                // Mengatur fokus dan memindahkan kursor ke akhir teks
                setTimeout(() => {
                    input.focus();
                    input.select();
                    // if (input.setSelectionRange) {
                    //     input.setSelectionRange(input.value.length, input.value.length);
                    // }
                }, 0);

                // Simulate input change if needed
                const nilai = value === '' || value == null || value === undefined ? 0 : value;
                simulateInputChange(input, nilai.toString());

                // Update state on each edit
                input.addEventListener('input', (e: any) => {
                    setTipeInput('Debet'); // Memperbarui state saat nilai diubah
                });
            }
        },
    };
    const editKreditRp = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'number'; // Membatasi input hanya untuk angka
            input.step = 'any'; // Mengizinkan angka desimal

            // Event listener untuk memblokir teks saat input diklik
            input.addEventListener('click', () => {
                input.select(); // Memblokir seluruh teks di dalam input
            });

            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 || value === null || value === undefined ? 0 : value;

                // Update state on each edit
                input.addEventListener('input', (e: any) => {
                    setTipeInput('Kredit'); // Memperbarui state saat nilai diubah
                });
            }
        },
    };
    const editKeterangan = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'text';

            // Event listener untuk memblokir teks saat input diklik
            input.addEventListener('click', () => {
                input.select(); // Memblokir seluruh teks di dalam input
            });

            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 || value === null || value === undefined ? '' : value;

                // Update state on each edit
                input.addEventListener('input', (e: any) => {
                    setTipeInput('Keterangan'); // Memperbarui state saat nilai diubah
                });
            }
        },
    };
    const editKurs = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'number'; // Membatasi input hanya untuk angka
            input.step = 'any'; // Mengizinkan angka desimal

            // Event listener untuk memblokir teks saat input diklik
            input.addEventListener('click', () => {
                input.select(); // Memblokir seluruh teks di dalam input
            });

            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 || value === null || value === undefined ? 0 : value;

                // Update state on each edit
                input.addEventListener('input', (e: any) => {
                    setTipeInput('Kurs'); // Memperbarui state saat nilai diubah
                });
            }
        },
    };
    const editJumnlahMu = {
        create: () => {
            const input = document.createElement('input');
            input.type = 'number'; // Membatasi input hanya untuk angka
            input.step = 'any'; // Mengizinkan angka desimal

            // Event listener untuk memblokir teks saat input diklik
            input.addEventListener('click', () => {
                input.select(); // Memblokir seluruh teks di dalam input
            });

            return input;
        },

        write: (args: any) => {
            const input = args.element;
            const value = args.rowData[args.column.field]; // Mengambil nilai awal dari data

            if (input) {
                // Kosongkan input jika nilai awalnya 0, jika tidak, biarkan nilai tetap
                input.value = value === 0 || value === null || value === undefined ? 0 : value;

                // Update state on each edit
                input.addEventListener('input', (e: any) => {
                    setTipeInput('JumlahMu'); // Memperbarui state saat nilai diubah
                });
            }
        },
    };

    interface DataItem {
        id: number;
        debet_rp: number;
        kredit_rp: number;
        catatan: string;
        kurs: number;
        jumlah_mu: number;
    }

    const actionCompleteDataJurnal = (args: any) => {
        if (args.requestType === 'save') {
            if (args.rowData.nama_akun === undefined || args.rowData.no_akun === undefined) {
                if (dataJurnal?.nodes.length > 0) {
                    const hasEmptyNodes = gridJurnalPpiListRef.dataSource.some((node: any) => node.no_akun === '');
                    if (hasEmptyNodes) {
                        // Alert atau aksi lainnya jika ada node dengan no_akun kosong
                    }
                    // Salin data dari gridJurnalPpiListRef.dataSource ke variabel baru untuk manipulasi
                    const newNodes = gridJurnalPpiListRef?.dataSource.filter((node: any) => node.no_akun !== null);

                    // Perbarui data di gridJurnalPpiListRef.dataSource
                    gridJurnalPpiListRef.setProperties({ dataSource: newNodes });
                    setDataJurnal({ nodes: newNodes });
                    // Segarkan grid untuk memperbarui tampilannya
                    gridJurnalPpiListRef.refresh();
                } else {
                    const updatedNodes = gridJurnalPpiListRef?.dataSource.filter((node: any) => node.no_akun !== null);
                    gridJurnalPpiListRef.setProperties({ dataSource: updatedNodes });
                    setDataJurnal({ nodes: updatedNodes });
                    // Segarkan grid untuk memperbarui tampilannya
                    gridJurnalPpiListRef.refresh();
                }
            } else {
                const gridRef = gridJurnalPpiListRef;
                if (gridRef) {
                    // Asumsikan dataSource adalah array tipe DataItem[]
                    const dataSource = gridJurnalPpiListRef?.dataSource;

                    if (Array.isArray(dataSource)) {
                        let kreditRp, debetRp, jumlahMu, catatan, kurs, editedData;

                        if (tipeInput === 'Debet') {
                            kreditRp = 0;
                            debetRp = dataSource[args.rowIndex].debet_rp;
                            jumlahMu = dataSource[args.rowIndex].debet_rp * dataSource[args.rowIndex].kurs;
                            editedData = { ...args.data, debet_rp: debetRp, kredit_rp: kreditRp, jumlah_mu: jumlahMu };
                        } else if (tipeInput === 'Kredit') {
                            kreditRp = dataSource[args.rowIndex].kredit_rp;
                            debetRp = 0;
                            jumlahMu = dataSource[args.rowIndex].kredit_rp * dataSource[args.rowIndex].kurs * -1;
                            editedData = { ...args.data, debet_rp: debetRp, kredit_rp: kreditRp, jumlah_mu: jumlahMu };
                        } else if (tipeInput === 'JumlahMu') {
                            if (dataSource[args.rowIndex].jumlah_mu > 0) {
                                kreditRp = 0;
                                debetRp = dataSource[args.rowIndex].debet_rp * dataSource[args.rowIndex].kurs;
                                jumlahMu = dataSource[args.rowIndex].jumlah_mu;
                                editedData = { ...args.data, debet_rp: debetRp, kredit_rp: kreditRp, jumlah_mu: jumlahMu };
                            } else {
                                kreditRp = dataSource[args.rowIndex].kredit_rp * dataSource[args.rowIndex].kurs;
                                debetRp = 0;
                                jumlahMu = dataSource[args.rowIndex].jumlah_mu;
                                editedData = { ...args.data, debet_rp: debetRp, kredit_rp: kreditRp, jumlah_mu: jumlahMu };
                            }
                        } else if (tipeInput === 'Keterangan') {
                            catatan = dataSource[args.rowIndex].catatan;
                            editedData = { ...args.data, catatan: catatan };
                        } else if (tipeInput === 'Kurs') {
                            kurs = dataSource[args.rowIndex].kurs;
                            editedData = { ...args.data, kurs: kurs };
                        } else {
                            editedData = { ...args.data };
                        }

                        // Update dataSource with the edited data
                        dataSource[args.rowIndex] = editedData;

                        const totalDebet = dataSource.reduce((total: any, item: any) => {
                            // Pastikan item tidak undefined dan item.debet_rp bisa diparse
                            if (item && item.debet_rp !== undefined && !isNaN(parseFloat(item.debet_rp))) {
                                return total + parseFloat(item.debet_rp);
                            }
                            return total; // Jika item atau debet_rp tidak valid, kembalikan total tanpa penambahan
                        }, 0);

                        const totalKredit = dataSource.reduce((total: any, item: any) => {
                            // Pastikan item tidak undefined dan item.kredit_rp bisa diparse
                            if (item && item.kredit_rp !== undefined && !isNaN(parseFloat(item.kredit_rp))) {
                                return total + parseFloat(item.kredit_rp);
                            }
                            return total; // Jika item atau kredit_rp tidak valid, kembalikan total tanpa penambahan
                        }, 0);

                        const selisih = totalDebet - totalKredit;
                        const nilaiSelisih = selisih >= 0 ? selisih : selisih * -1;

                        setStateDataDetail((prevState: any) => ({
                            ...prevState,
                            totalDebet: totalDebet,
                            totalKredit: totalKredit,
                            totalSelisih: nilaiSelisih,
                        }));

                        // Refresh the grid to reflect the changes
                        gridRef.refresh(); // or gridRef.refreshRows([args.rowIndex]);
                    }
                    // kalkulasi();
                }
            }
        }
    };

    const [idJurnal, setIdJurnal] = useState('');
    const selectedRowsData = (args: any) => {
        if (args.data !== undefined) {
            setIdJurnal(args.data.id);
        }
    };
    const selectingRowsData = (args: any) => {
        if (args.data !== undefined) {
            setIdJurnal(args.data.id);
        }
    };

    const [cetakBarcode, setCetakBarcode] = useState(0);
    const cekUploadWarkat = (index: any) => {
        if (modalJenisPenerimaan === 'Warkat') {
            if (index === 2) {
                setCetakBarcode(index + 1);
            } else {
                setCetakBarcode(index);
            }
        } else {
            setCetakBarcode(index);
        }
    };

    const selectedRowIndex = useRef<number | null>(null);

    const onSelectedRows = (args: any) => {
        selectedRowIndex.current = args.rowIndex;
    };

    const handleDataBound = () => {
        if (gridPpiListRefCurrent && selectedRowIndex.current !== null) {
            (gridPpiListRefCurrent as any).selectRow(selectedRowIndex.current, false);
        }
    };

    useEffect(() => {
        if (gridPpiListRefCurrent && selectedRowIndex.current !== null) {
            (gridPpiListRefCurrent as any).selectRow(selectedRowIndex.current, false);
        }
    }, [selectedRowIndex.current, stateDataDetail, filteredDataBarang, dataBarang]);

    return (
        <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '360px' }}>
            <div className="flex" style={{ marginTop: 5, marginBottom: 5 }}>
                <div style={{ marginLeft: 12 }}>
                    <CheckBoxComponent
                        label="Pelunasan Pajak"
                        cssClass="e-small"
                        checked={stateDataDetail?.isChecboxPelunasanPajak}
                        disabled={
                            modalJenisPenerimaan === 'Pencairan' ||
                            modalJenisPenerimaan === 'Penolakan' ||
                            modalJenisPenerimaan === 'batal cair' ||
                            modalJenisPenerimaan === 'batal tolak' ||
                            modalJenisPenerimaan === 'UpdateFilePendukung' ||
                            modalJenisPenerimaan === 'Edit Pencairan' ||
                            modalJenisPenerimaan === 'Edit Penolakan'
                                ? true
                                : stateDataHeader?.pelunasanPajak
                        }
                        change={(args: ChangeEventArgsButton) => {
                            const value: any = args.checked;
                            setStateDataDetail((prevState: any) => ({
                                ...prevState,
                                isChecboxPelunasanPajak: value,
                            }));
                            handleClickPelunasanPajak(value);
                        }}
                    />
                    <button
                        style={{
                            float: 'right',
                            width: '90px',
                            marginTop: '0em',
                            marginLeft: '2.2em',
                            marginRight: '3.2em',
                            backgroundColor: '#3b3f5c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '5px',
                            height: '20px',
                        }}
                        onClick={viewTTDDialog}
                    >
                        <FontAwesomeIcon icon={faCamera} style={{ marginRight: '0.5em', width: '22px', height: '14px' }} />
                        View TTD
                    </button>
                    {/* <ButtonComponent
                        id="buViewTtd"
                        content="View TTD"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-View"
                        style={{ float: 'right', width: '90px', marginTop: 0 + 'em', marginLeft: 2.2 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={viewTTDDialog}
                    /> */}
                </div>
            </div>

            <TabComponent /*ref={(t) => (tabPhuList = t)}*/ selectedItem={isFilePendukungPPI === 'Y' ? 2 : 0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                <div className="e-tab-header">
                    <div tabIndex={0}>1. Alokasi Dana</div>
                    <div tabIndex={1}>2. Jurnal</div>
                    <div tabIndex={2}>3. File Pendukung</div>
                </div>
                {/*===================== Content menampilkan data barang =======================*/}
                <div className="e-content">
                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                        {/* <TooltipComponent ref={(t) => (tooltipDetailBarang = t)} beforeRender={beforeRenderDetailBarang} openDelay={1000} target=".e-headertext"> */}
                        <GridComponent
                            id="gridPpiList"
                            name="gridPpiList"
                            className="gridPpiList"
                            locale="id"
                            ref={gridPpiListRef}
                            dataSource={stateDataDetail?.searchKeywordNoFj !== '' ? filteredDataBarang : dataBarang?.nodes}
                            editSettings={
                                modalJenisPenerimaan === 'Pencairan' ||
                                modalJenisPenerimaan === 'Penolakan' ||
                                modalJenisPenerimaan === 'batal cair' ||
                                modalJenisPenerimaan === 'batal tolak' ||
                                modalJenisPenerimaan === 'UpdateFilePendukung' ||
                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                modalJenisPenerimaan === 'Edit Penolakan'
                                    ? { allowAdding: false, allowEditing: false, allowDeleting: false, newRowPosition: 'Bottom' }
                                    : { allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }
                            }
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            allowResizing={true}
                            autoFit={true}
                            rowHeight={22}
                            // enableVirtualization={true}
                            // pageSettings={pageSettings}
                            // infiniteScrollSettings={{ enableCache: true, maxBlocks: 3 }}
                            allowPaging={true}
                            pageSettings={{ pageSize: 25, pageCount: 5, pageSizes: ['25', '50', '100', 'All'] }}
                            allowSorting={true}
                            height={170} //170 barang jadi 150 barang produksi
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            actionBegin={actionBeginDetailBarang}
                            rowSelected={onSelectedRows}
                            dataBound={handleDataBound}
                            // actionComplete={actionCompleteDetailBarang}
                            // recordClick={(args: any) => {
                            //     currentDaftarBarang = gridPpiListRef.current?.getSelectedRecords() || [];
                            //     if (currentDaftarBarang.length > 0) {
                            //         gridPpiListRef.current?.startEdit();
                            //         document.getElementById('bayar_mu')?.focus();
                            //     }
                            // }}
                        >
                            <ColumnsDirective>
                                {/* <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" /> */}

                                <ColumnDirective
                                    field="no_fj"
                                    isPrimaryKey={true}
                                    headerText="No. Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="120"
                                    // editTemplate={EditTemplateNoFb}
                                />
                                <ColumnDirective
                                    field="tgl_fj"
                                    isPrimaryKey={true}
                                    headerText="Tanggal"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="100"
                                    format={formatDate}
                                    type="date"
                                    edit={formatDate}
                                    editTemplate={EditTemplateTglFj}
                                />
                                <ColumnDirective
                                    field="JT"
                                    isPrimaryKey={true}
                                    headerText="Jatuh Tempo"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="100"
                                    format={formatDate}
                                    type="date"
                                    editTemplate={EditTemplateTglJt}
                                />
                                <ColumnDirective
                                    isPrimaryKey={true}
                                    field="hari2"
                                    headerText="Hari"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="50"
                                    // editTemplate={EditTemplateHari}
                                />
                                <ColumnDirective
                                    field="netto_mu"
                                    isPrimaryKey={true}
                                    format="N2"
                                    edit={qtyParams}
                                    headerTemplate={headerNilaiFaktur}
                                    headerText="Nilai Faktur (MU)"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    editTemplate={EditTemplateNilaiFaktur}
                                />
                                <ColumnDirective
                                    field="total_pajak_rp"
                                    isPrimaryKey={true}
                                    format="N2"
                                    edit={qtyParams}
                                    headerText="Nilai Pajak"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    editTemplate={EditTemplateNilaiPajak}
                                />
                                <ColumnDirective
                                    field="owing"
                                    isPrimaryKey={true}
                                    headerTemplate={headerSisaNilaiFaktur}
                                    format="N2"
                                    edit={qtyParams}
                                    headerText="Sisa nilai faktur yang harus dibayar"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="150"
                                    editTemplate={EditTemplateSisaNilaiFaktur}
                                />
                                <ColumnDirective
                                    template={templatePilih}
                                    // field="nama_barang"
                                    headerText="Pilih"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="50"
                                    editTemplate={editTemplatePilih}
                                />
                                <ColumnDirective
                                    field="bayar_mu"
                                    format="N2"
                                    edit={editBayarMu}
                                    // edit={qtyParams}
                                    // editTemplate={editTemplateBayarMu}
                                    // template={editTemplateJumlahBayar}
                                    headerTemplate={headerJumlahPenerimaan}
                                    headerText="Jumlah Penerimaan"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                />
                                <ColumnDirective
                                    field="sisa_faktur2"
                                    isPrimaryKey={true}
                                    format="N2"
                                    edit={qtyParams}
                                    headerText="Sisa"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    editTemplate={EditTemplateSisaFaktur}
                                />
                            </ColumnsDirective>

                            <Inject services={[VirtualScroll, Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                        </GridComponent>
                        {/* </TooltipComponent> */}

                        <div className="panel-pager">
                            <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                    <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                        <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                            <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                    <div className="mt-1 flex">
                                                        {modalJenisPenerimaan === 'Pencairan' ||
                                                        modalJenisPenerimaan === 'Penolakan' ||
                                                        modalJenisPenerimaan === 'batal cair' ||
                                                        modalJenisPenerimaan === 'batal tolak' ||
                                                        modalJenisPenerimaan === 'UpdateFilePendukung' ||
                                                        modalJenisPenerimaan === 'Edit Pencairan' ||
                                                        modalJenisPenerimaan === 'Edit Penolakan' ? null : (
                                                            <>
                                                                <ButtonComponent
                                                                    id="buDelete1"
                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                    cssClass="e-warning e-small"
                                                                    iconCss="e-icons e-small e-trash"
                                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                    onClick={() =>
                                                                        DetailNoFakturDelete(gridPpiListRefCurrent, swalDialog, setDataBarang, setStateDataFooter, setStateDataHeader, stateDataHeader)
                                                                    }
                                                                />
                                                                <ButtonComponent
                                                                    id="buDeleteAll1"
                                                                    type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                    cssClass="e-danger e-small"
                                                                    iconCss="e-icons e-small e-erase"
                                                                    style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                    onClick={() =>
                                                                        DetailNoFakturDeleteAll(
                                                                            gridPpiListRefCurrent,
                                                                            swalDialog,
                                                                            setDataBarang,
                                                                            setStateDataFooter,
                                                                            setStateDataHeader,
                                                                            stateDataHeader,
                                                                            setDataJurnal
                                                                        )
                                                                    }
                                                                />
                                                            </>
                                                        )}
                                                        <input
                                                            id="cariNoFj"
                                                            name="cariNoFj"
                                                            className={` container form-input`}
                                                            placeholder="< CARI NO. FAKTUR >"
                                                            style={
                                                                modalJenisPenerimaan === 'Pencairan' ||
                                                                modalJenisPenerimaan === 'Penolakan' ||
                                                                modalJenisPenerimaan === 'batal cair' ||
                                                                modalJenisPenerimaan === 'batal tolak' ||
                                                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                                                modalJenisPenerimaan === 'Edit Penolakan'
                                                                    ? { backgroundColor: '#eeeeee', borderRadius: 2, fontSize: 11, marginLeft: 0, borderColor: '#bfc9d4', width: '16%' }
                                                                    : { borderRadius: 2, fontSize: 11, marginLeft: 0, borderColor: '#bfc9d4', width: '16%' }
                                                            }
                                                            onChange={(event) => HandleCariNoFj(event.target.value, setStateDataDetail, setFilteredDataBarang, dataBarang)}
                                                            disabled={
                                                                modalJenisPenerimaan === 'Pencairan' ||
                                                                modalJenisPenerimaan === 'Penolakan' ||
                                                                modalJenisPenerimaan === 'batal cair' ||
                                                                modalJenisPenerimaan === 'batal tolak' ||
                                                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                                                modalJenisPenerimaan === 'Edit Penolakan'
                                                                    ? true
                                                                    : false
                                                            }
                                                        ></input>
                                                        <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                            {/* <b>Jumlah Faktur :</b>&nbsp;&nbsp;&nbsp;{stateDataDetail?.jumlahFaktur} */}
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
                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={1}>
                        {/* <TooltipComponent ref={(t) => (tooltipDetailBarang = t)} beforeRender={beforeRenderDetailBarang} openDelay={1000} target=".e-headertext"> */}
                        <GridComponent
                            id="gridJurnalList"
                            name="gridJurnalList"
                            className="gridJurnalList"
                            locale="id"
                            // ref={gridJurnalPpiListRef}
                            ref={(j: any) => (gridJurnalPpiListRef = j)} // UBAH SESUAI JURNAL
                            dataSource={dataJurnal?.nodes}
                            editSettings={
                                modalJenisPenerimaan === 'UpdateFilePendukung'
                                    ? { allowAdding: false, allowEditing: false, allowDeleting: false, newRowPosition: 'Bottom' }
                                    : { allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }
                            }
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            allowResizing={true}
                            autoFit={true}
                            // allowSorting={true}
                            rowHeight={22}
                            height={170} //170 barang jadi 150 barang produksi
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            // actionBegin={actionBeginDataJurnal}
                            actionComplete={actionCompleteDataJurnal}
                            rowSelected={selectedRowsData}
                            rowSelecting={selectingRowsData}
                            recordClick={(args: any) => {
                                currentDaftarJurnal = gridJurnalPpiListRef?.getSelectedRecords() || [];
                                if (currentDaftarJurnal.length > 0) {
                                    gridJurnalPpiListRef?.startEdit();
                                    // gridJurnalListRef.current?.sta;
                                    // document.getElementById('jumlah')?.focus();
                                }
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="id" visible={false} type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />
                                <ColumnDirective
                                    field="no_akun"
                                    // isPrimaryKey={true}
                                    headerText="No. Akun"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="100"
                                    // clipMode="EllipsisWithTooltip"
                                    editTemplate={EditTemplateNoAkun}
                                />
                                <ColumnDirective
                                    field="nama_akun"
                                    // isPrimaryKey={true}
                                    headerText="Nama Akun"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="130"
                                    // clipMode="EllipsisWithTooltip"
                                    editTemplate={EditTemplateNamaAkun}
                                />
                                <ColumnDirective
                                    field="debet_rp"
                                    format="N2"
                                    edit={editDebetRp}
                                    // edit={qtyParams}
                                    // editTemplate={EditTemplateNilaiDebet}
                                    headerText="Debet"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="100"
                                />
                                <ColumnDirective
                                    field="kredit_rp"
                                    format="N2"
                                    edit={editKreditRp}
                                    // edit={qtyParams}
                                    // editTemplate={EditTemplateNilaiKredit}
                                    headerText="Kredit"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="100"
                                />
                                <ColumnDirective
                                    field="catatan"
                                    headerText="Keterangan"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="200"
                                    edit={editKeterangan}
                                    // clipMode="EllipsisWithTooltip"
                                    // editTemplate={EditTemplateKeterangan}
                                />
                                <ColumnDirective
                                    // isPrimaryKey={true}
                                    field="mu"
                                    headerText="MU"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="50"
                                    // clipMode="EllipsisWithTooltip"
                                    // editTemplate={EditTemplateMu}
                                />
                                <ColumnDirective
                                    field="kurs"
                                    format="N2"
                                    headerText="Kurs"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="50"
                                    edit={editKurs}
                                    // editTemplate={EditTemplateNilaiKurs}
                                />
                                <ColumnDirective
                                    field="jumlah_mu"
                                    format="N2"
                                    edit={editJumnlahMu}
                                    headerText="Jumlah [MU]"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="110"
                                    // editTemplate={EditTemplateNilaiJumlahMu}
                                />
                                <ColumnDirective
                                    // isPrimaryKey={true}
                                    field="subledger"
                                    headerText="Subsidiary Ledger"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="150"
                                    // clipMode="EllipsisWithTooltip"
                                    editTemplate={EditTemplateSubledger}
                                />
                                <ColumnDirective editTemplate={TemplateDepartemen} field="departemen" headerText="Departemen" headerTextAlign="Center" textAlign="Left" width="150" />
                                <ColumnDirective editTemplate={TemplateDivisi} field="kode_jual" headerText="Divisi Penjualan" headerTextAlign="Center" textAlign="Left" width="280" />
                            </ColumnsDirective>

                            <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                        </GridComponent>
                        {/* </TooltipComponent> */}

                        <div className="panel-pager">
                            <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                    <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                        <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                            <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                    <div className="mt-1 flex">
                                                        <div style={{ width: '75%' }}>
                                                            {modalJenisPenerimaan === 'UpdateFilePendukung' || modalJenisPenerimaan === 'batal tolak' ? null : (
                                                                <>
                                                                    <ButtonComponent
                                                                        id="buAdd1"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick1
                                                                        cssClass="e-primary e-small"
                                                                        iconCss="e-icons e-small e-plus"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                        onClick={() => handleAddDetailJurnal(gridJurnalPpiListRef)}
                                                                    />
                                                                    <ButtonComponent
                                                                        id="buDelete1"
                                                                        // content="Hapus"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-warning e-small"
                                                                        iconCss="e-icons e-small e-trash"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                        onClick={() => onClickAutoJurnal('delete', gridJurnalPpiListRef, idJurnal)}
                                                                    />
                                                                    <ButtonComponent
                                                                        id="buDeleteAll1"
                                                                        // content="Bersihkan"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-danger e-small"
                                                                        iconCss="e-icons e-small e-erase"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                        onClick={() => onClickAutoJurnal('deleteAll', gridJurnalPpiListRef, idJurnal)}
                                                                    />

                                                                    <ButtonComponent
                                                                        id="buDeleteAll1"
                                                                        content="Auto Jurnal"
                                                                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                        cssClass="e-danger e-small"
                                                                        iconCss="e-icons e-small e-description"
                                                                        style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em', backgroundColor: '#3b3f5c' }}
                                                                        onClick={() => onClickAutoJurnal('autoJurnal', gridJurnalPpiListRef, idJurnal)}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                        <div style={{ width: '25%' }}>
                                                            <div className=" flex">
                                                                <div style={{ width: '30%', textAlign: 'right' }}>
                                                                    <b>Total Db/Kr :</b>
                                                                </div>
                                                                <div style={{ width: '35%', textAlign: 'right' }}>
                                                                    <b>{CurrencyFormat(stateDataDetail?.totalDebet)}</b>
                                                                </div>
                                                                <div style={{ width: '35%', textAlign: 'right' }}>
                                                                    <b>{CurrencyFormat(stateDataDetail?.totalKredit)}</b>
                                                                </div>
                                                            </div>

                                                            <div className="mt-1 flex">
                                                                <div style={{ width: '30%', textAlign: 'right' }}>
                                                                    <b>Selisih :</b>
                                                                </div>
                                                                <div style={{ width: '35%', textAlign: 'right' }}>
                                                                    <b>{CurrencyFormat(stateDataDetail?.totalSelisih)}</b>
                                                                </div>
                                                                <div style={{ width: '35%', textAlign: 'right' }}>
                                                                    <b>{CurrencyFormat(stateDataDetail?.totalSelisihKredit)}</b>
                                                                </div>
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
                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={2}>
                        <TabComponent selectedItem={stateDataDetail?.activeTab} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                            <div className="e-tab-header">
                                {tabsFilePendukung.map((tab: any, index: any) => (
                                    <div
                                        className="flex h-[41px] items-center justify-center"
                                        key={index}
                                        tabIndex={index}
                                        onClick={() => {
                                            setCetakBarcode(tab.id);
                                            setStateDataDetail((prevState: any) => ({
                                                ...prevState,
                                                activeTab: index,
                                            }));
                                        }}
                                    >
                                        {/* Filter berdasarkan masterDataState dan content */}
                                        {
                                            masterDataState === 'Pencairan' || masterDataState === 'Penolakan' || masterDataState === 'Pembatalan'
                                                ? tab.content !== 'Content 3' && tab.title // Hanya tampilkan jika bukan 'Content 3'
                                                : tab.title // Tampilkan semua tab title jika tidak dalam kondisi filter
                                        }
                                    </div>
                                ))}
                            </div>
                            <div className="e-content">
                                {tabsFilePendukung.map((tab: any, index: any) => (
                                    <div key={index} style={{ width: '100%', height: '50%', marginTop: '5px' }} tabIndex={index}>
                                        <div className="flex">
                                            <div style={{ width: '27%' }}>
                                                <div
                                                    className="border p-3"
                                                    onPaste={(e) => handlePaste(e, index)} // Menangani data clipboard saat paste
                                                    onContextMenu={() => handleClick(tab, index)}
                                                    // onPaste={(e) => handlePaste(e, index)} // Menangani data clipboard saat paste
                                                    // onContextMenu={() => handleClick(index)}
                                                    style={{ backgroundColor: 'white', borderRadius: 6, fontSize: 11, height: '189px' }}
                                                >
                                                    {masterDataState === 'BARU' ? (
                                                        images &&
                                                        Array.isArray(images[index]) &&
                                                        images[index].length > 0 && (
                                                            <ImageWithDeleteButton
                                                                imageUrl={images[index][0]}
                                                                onDelete={() => clearImage(index)}
                                                                index={index}
                                                                setIndexPreview={setIndexPreview}
                                                                setIsOpenPreview={setIsOpenPreview}
                                                                setZoomScale={setZoomScale}
                                                                setPosition={setPosition}
                                                                loadFilePendukung={loadFilePendukung}
                                                                extractedFiles={extractedFiles}
                                                                setImageDataUrl={setImageDataUrl}
                                                                images={images}
                                                                OpenPreviewInsert={(index: any) => OpenPreviewInsert(index)}
                                                            />
                                                        )
                                                    ) : masterDataState === 'EDIT' || masterDataState === 'Pencairan' || masterDataState === 'APPROVAL' || masterDataState === 'UpdateFilePendukung' ? (
                                                        images && Array.isArray(images[index]) ? (
                                                            <>
                                                                {images[index].length > 0
                                                                    ? images &&
                                                                      Array.isArray(images[index]) &&
                                                                      images[index].length > 0 && (
                                                                          <ImageWithDeleteButton
                                                                              imageUrl={images[index][0]}
                                                                              onDelete={() => clearImage(index)}
                                                                              index={index}
                                                                              setIndexPreview={setIndexPreview}
                                                                              setIsOpenPreview={setIsOpenPreview}
                                                                              setZoomScale={setZoomScale}
                                                                              setPosition={setPosition}
                                                                              loadFilePendukung={loadFilePendukung}
                                                                              extractedFiles={extractedFiles}
                                                                              setImageDataUrl={setImageDataUrl}
                                                                              images={images}
                                                                              OpenPreviewInsert={(index: any) => OpenPreviewInsert(index)}
                                                                          />
                                                                      )
                                                                    : (() => {
                                                                          const foundItem = loadFilePendukung.find(
                                                                              (item: any) => item.id_dokumen === (modalJenisPenerimaan === 'Warkat' && tab.id === 3 ? index + 1 : index)
                                                                          );
                                                                          const filegambar = foundItem?.filegambar;
                                                                          if (filegambar) {
                                                                              const imageUrl = extractedFiles.find((item: any) => item.fileName === filegambar)?.imageUrl;
                                                                              return (
                                                                                  imageUrl && (
                                                                                      <ImageWithDeleteButton
                                                                                          imageUrl={imageUrl}
                                                                                          onDelete={() => clearImage(index)}
                                                                                          index={index}
                                                                                          setIndexPreview={setIndexPreview}
                                                                                          setIsOpenPreview={setIsOpenPreview}
                                                                                          setZoomScale={setZoomScale}
                                                                                          setPosition={setPosition}
                                                                                          loadFilePendukung={loadFilePendukung}
                                                                                          extractedFiles={extractedFiles}
                                                                                          setImageDataUrl={setImageDataUrl}
                                                                                          images={images}
                                                                                          OpenPreviewInsert={(index: any) => OpenPreviewInsert(index)}
                                                                                      />
                                                                                  )
                                                                              );
                                                                          }
                                                                          return null;
                                                                      })()}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(() => {
                                                                    const foundItem = loadFilePendukung.find(
                                                                        (item: any) => item.id_dokumen === (modalJenisPenerimaan === 'Warkat' && tab.id === 3 ? index + 1 : index)
                                                                    );
                                                                    const filegambar = foundItem?.filegambar;
                                                                    if (filegambar) {
                                                                        const imageUrl = extractedFiles.find((item: any) => item.fileName === filegambar)?.imageUrl;
                                                                        return (
                                                                            imageUrl && (
                                                                                <ImageWithDeleteButton
                                                                                    imageUrl={imageUrl}
                                                                                    onDelete={() => clearImage(index)}
                                                                                    index={index}
                                                                                    setIndexPreview={setIndexPreview}
                                                                                    setIsOpenPreview={setIsOpenPreview}
                                                                                    setZoomScale={setZoomScale}
                                                                                    setPosition={setPosition}
                                                                                    loadFilePendukung={loadFilePendukung}
                                                                                    extractedFiles={extractedFiles}
                                                                                    setImageDataUrl={setImageDataUrl}
                                                                                    images={images}
                                                                                    OpenPreviewInsert={(index: any) => OpenPreviewInsert(index)}
                                                                                />
                                                                            )
                                                                        );
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </>
                                                        )
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div style={{ width: '1%' }}></div>
                                            <div style={{ width: '10%' }}>
                                                {modalJenisPenerimaan === 'Pencairan' ||
                                                modalJenisPenerimaan === 'Penolakan' ||
                                                modalJenisPenerimaan === 'batal cair' ||
                                                modalJenisPenerimaan === 'batal tolak' ||
                                                modalJenisPenerimaan === 'Edit Pencairan' ||
                                                modalJenisPenerimaan === 'Edit Penolakan' ? (
                                                    <>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '110px',
                                                                height: '15%',
                                                                marginTop: '76px',
                                                                borderRadius: '5px',
                                                                fontSize: '11px',
                                                            }}
                                                            onClick={() => OpenPreviewInsert(index)}
                                                        >
                                                            <FontAwesomeIcon icon={faCamera} className="shrink-0 ltr:mr-2 rtl:ml-2" fontSize="12px" width="18" height="18" />
                                                            Preview
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="file"
                                                            id={`imageInput${index}`}
                                                            name={`image${index}`}
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => handleFileUpload(e, index)}
                                                            multiple
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '152px',
                                                                height: '13%',
                                                                marginTop: -7,
                                                                borderRadius: '5px',
                                                                fontSize: '11px',
                                                            }}
                                                            onClick={() => {
                                                                if (stateDataDetail?.kodeValidasi === '') {
                                                                    withReactContent(swalToast).fire({
                                                                        icon: 'warning',
                                                                        title: '<p style="font-size:12px;color:white;">Warkat Cek atau Bilyet Giro belum dicetak barcode.</p>',
                                                                        width: '100%',
                                                                        target: '#dialogPhuList',
                                                                        customClass: {
                                                                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                                                                        },
                                                                    });
                                                                } else {
                                                                    handleClick(tab, index);
                                                                }
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faUpload} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                            File ...
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '152px',
                                                                height: '13%',
                                                                marginTop: -7,
                                                                borderRadius: '5px',
                                                                fontSize: '11px',
                                                            }}
                                                            // onClick={() => handleUploadZip('123')} // ini bukan
                                                            onClick={() => clearImage(index)}
                                                        >
                                                            <FontAwesomeIcon icon={faEraser} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                            Bersihkan Gambar
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '152px',
                                                                height: '13%',
                                                                marginTop: -7,
                                                                borderRadius: '5px',
                                                                fontSize: '11px',
                                                            }}
                                                            onClick={clearAllImages}
                                                        >
                                                            <FontAwesomeIcon icon={faTrashCan} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                            Bersihkan Semua ...
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '152px',
                                                                height: '13%',
                                                                marginTop: -7,
                                                                borderRadius: '5px',
                                                                fontSize: '11px',
                                                            }}
                                                            onClick={() => OpenPreviewInsert(index)}
                                                        >
                                                            <FontAwesomeIcon icon={faCamera} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                                            Preview
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {cetakBarcode === 3 ? (
                                                <>
                                                    <div style={{ width: '1%' }}></div>
                                                    <div style={{ width: '20%' }}>
                                                        <button
                                                            type="submit"
                                                            className="btn mb-2 h-[4.5vh]"
                                                            style={{
                                                                backgroundColor: '#3b3f5c',
                                                                color: 'white',
                                                                width: '145px',
                                                                height: '15%',
                                                                marginTop: '-8px',
                                                                borderRadius: '5px',
                                                                fontSize: '11px',
                                                            }}
                                                            onClick={cetakBarcodewarkat}
                                                        >
                                                            <FontAwesomeIcon icon={faArrowRight} className="shrink-0 ltr:mr-2 rtl:ml-2" fontSize="12px" width="18" height="18" />
                                                            Cetak Barcode
                                                        </button>
                                                        {stateDataDetail?.kodeValidasi !== '' ? (
                                                            <>
                                                                <label style={{ marginTop: '-4px' }}>Kode Validasi :</label>
                                                                <label style={{ marginTop: '-4px' }}>{stateDataDetail?.kodeValidasi}</label>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabComponent>
                    </div>
                </div>
            </TabComponent>
        </div>
    );
};
export default TemplateDetail;
