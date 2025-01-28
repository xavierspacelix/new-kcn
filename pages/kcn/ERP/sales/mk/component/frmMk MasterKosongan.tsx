import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from '@/public/syncfusion/locale.json';
L10n.load(idIDLocalization);

import * as ReactDom from 'react-dom';
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Pakai fungsi dari routines ============================
import { DiskonByCalc, FillFromSQL, frmNumber, generateNU, generateNUDivisi } from '@/utils/routines';
//========================================================

import { useRouter } from 'next/router';

import styles from './mk.module.css';
import stylesTtb from '../mklist.module.css';
// import { HandelCatatan, HandleAlasanChange, HandleCaraPengiriman, HandleGudangChange, HandleModalChange, HandleModaliconChange, HandleRemoveRowsOtomatis, HandleSelectedData } from './fungsiFrmMk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { GetDlgDetailSjItem, GetListEditTtb, GetMasterAlasan, PatchUpdateTtb, PostSimpanAudit, PostSimpanTtb } from '../model/api';
// import { ReCalcDataNodesTtb } from './reCalc';
import // FetchDataListCust,
// FilterCustomer,
// HandleSearchNamaBarang,
// HandleSearchNamaCust,
// HandleSearchNamaSales,
// HandleSearchNoBarang,
// HandleSearchNoCust,
// HandleSelectedDataCustomer,
// RefreshDetailSjItem,
// refNamaCust,
// refKodeCust,
// refKodeRelasi,
// DetailBarangEdit,
// DetailBarangDelete,
// DetailBarangDeleteAll,
// RefreshDetailSj,
// HandleSearchNoDok,
// HandleSearchNamaRelasi,
'./fungsiFrmMkList';
import { table } from '@syncfusion/ej2/grids';
import { HandelCatatan } from './fungsiFrmMk';

enableRipple(true);

interface FrmMkProps {
    userid: any;
    kode_entitas: any;
    masterKodeDokumen: any;
    masterDataState: any;
    masterBarangProduksi: any;
    isOpen: boolean;
    onClose: any;
    onRefresh: any;
    kode_user: any;
}

const FrmMk: React.FC<FrmMkProps> = ({ userid, kode_entitas, masterKodeDokumen, masterDataState, masterBarangProduksi, isOpen, onClose, onRefresh, kode_user }: FrmMkProps) => {
    const router = useRouter();
    const [divisiPenjualan, setDivisiPenjualan] = useState('');
    const [showLoader, setShowLoader] = useState(true);
    const contentLoader = () => {
        return (
            <div className="screen_loader animate__animated fixed inset-0 z-[60] grid place-content-center bg-[#ffffff00] dark:bg-[#060818]">
                <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
                    <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite" />
                    </path>
                    <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                        <animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
        );
    };

    const [noTtbValue, setNoTtbValue] = useState<any>('');
    const [kodeTtb, setKodeTtb] = useState<any>('');
    const [date1, setDate1] = useState<any>(new Date());
    const [masterTglTtb, setMasterTglTtb] = useState<moment.Moment>(moment());
    const [tglTtbEdit, setTglTtbEdit] = useState('');
    const [custSelectedKode, setCustSelectedKode] = useState<any>('');
    const [custSelected, setCustSelected] = useState<any>('');
    const [selectedOptionGudang, setSelectedOptionGudang] = useState<string>('');
    const [selectedOptionKodeGudang, setSelectedOptionKodeGudang] = useState<string>('');
    const [selectedOptionAlasan, setSelectedOptionAlasan] = useState<string>('');
    const [dataHeader, setDataHeader] = useState({ noReff: '', via: '', pengemudi: '', nopol: '', statusFaktur: '', noFaktur: '', tglFaktur: '', kodePajak: '' });
    const [catatanValue, setCatatanValue] = useState('');
    const [selectedCaraPengiriman, setSelectedCaraPengiriman] = useState<any>('Dikirim');
    const [dataTotalHeader, setDataTotalHeader] = useState({ jumlahMu: 0, totalDiskonMu: 0, totalJumlahPajak: 0 });
    const [TotalBarang, setTotalBarang] = useState(0);
    const [dataBarang, setDataBarang] = useState({ nodes: [] });
    const [terbilang, setTerbilang] = useState('');

    const ReCallRefreshModal = () => {
        setNoTtbValue('<Baru>');
        setKodeTtb('');
        setDate1(new Date());
        setMasterTglTtb(moment());
        setTglTtbEdit('');
        setCustSelected('');
        // refNamaCust.current = null;
        setCustSelectedKode('');
        setSelectedOptionGudang('');
        setSelectedOptionKodeGudang('');
        setSelectedOptionAlasan('');
        setDataHeader((prevState) => ({
            ...prevState,
            noReff: '',
            via: '',
            pengemudi: '',
            nopol: '',
            statusFaktur: '',
            noFaktur: '',
            tglFaktur: '',
            kodePajak: '',
        }));

        setCatatanValue('');
        setDivisiPenjualan('');
        setSelectedCaraPengiriman('Dikirim');

        setDataTotalHeader((prevState) => ({
            ...prevState,
            jumlahMu: 0,
            totalDiskonMu: 0,
            totalJumlahPajak: 0,
        }));
        setTotalBarang(0);
    };

    const closeFrmMk = async () => {
        await ReCallRefreshModal();
        await setTimeout(() => {
            onRefresh();
        }, 100);
        await onClose();
    };

    let buttonInputData: ButtonPropsModel[];
    buttonInputData = [
        {
            buttonModel: {
                content: 'Tutup',
                cssClass: 'e-danger e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: closeFrmMk,
        },
    ];

    let tabMkDetail: Tab | any;
    let tooltipDetailBarang: Tooltip | any;
    let gridMkDetail: Grid | any;

    //============== Format baris pada grid Detail Barang =============
    const rowDataBoundDetailBarang = (args: any) => {
        if (args.row) {
            if (getValue('kode_pp', args.data) == 'ADDROW') {
                args.row.style.background = '#F2FDF8';
            } else {
                args.row.style.background = '#ffffff';
            }
        }
    };

    //============= Format cell pada grid Detail Barang =============
    const queryCellInfoDetailBarang = (args: any) => {
        if ((args.column?.field === 'fpp_btg' || args.column?.field === 'fpp_harga_btg' || args.column?.field === 'berat') && !args.column?.isSelected) {
            args.cell.style.color = '#B6B5B5';
        }
    };

    //=========== Setting format tanggal sesuai locale ID ===========
    const formatFloat: Object = { skeleton: 'C3', format: ',0.####;-,0.#####;#', maximumFractionDigits: 4 };

    let textareaObj: any;
    function onCreateMultiline(): void {
        textareaObj.addAttributes({ rows: 1 });
        textareaObj.respectiveElement.style.height = 'auto';
        textareaObj.respectiveElement.style.height = '60px'; //textareaObj.respectiveElement.scrollHeight + 'px';
    }

    const editTemplateNoBarang = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_sj_add" name="no_sj_add" className="no_sj_add" value={args.no_item} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoItem1"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={() => {
                                    console.log('ABC');
                                    // FilterCustomer(refNamaCust.current, swalDialog, dataBarang, custSelected, setHandleNamaCust, setModal1, DialogDaftarSjItem);
                                }}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const closeDialogMkForm = async () => {
        await ReCallRefreshModal();
        await setTimeout(() => {
            onRefresh();
        }, 100);
        await onClose();
    };

    const saveDoc = async (data: any) => {
        console.log(data);
    };

    useEffect(() => {
        // const totalDebetRp = dataJurnal.nodes.reduce((total: any, node: any) => {
        //     return total + parseFloat(tanpaKoma(node.debet_rp));
        // }, 0);
        // const totalKreditRp = dataJurnal.nodes.reduce((total: any, node: any) => {
        //     return total + parseFloat(tanpaKoma(node.kredit_rp));
        // }, 0);
        // setTotalDebet(totalDebetRp);
        // setTotalKredit(totalKreditRp);
        // setSelisih(totalDebetRp - totalKreditRp);
        // //HANDLE TERBILANG
        // if (selectedOptionPajak === 'N') {
        //     var nilaiTerbilang = subTotal - nominalDiskon + kirimMU;
        //     let [bagianBulat, bagianDesimal] = nilaiTerbilang.toString().split('.');
        //     console.log(nilaiTerbilang);
        //     generateTerbilang(kode_entitas, parseFloat(bagianBulat))
        //         .then((result) => {
        //             setTerbilang(result);
        //             // alert(result);
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // } else if (selectedOptionPajak === 'I') {
        //     var nilaiTerbilang = valueNilaiDpp + totalNilaiPajakRP + kirimMU;
        //     let [bagianBulat, bagianDesimal] = nilaiTerbilang.toString().split('.');
        //     generateTerbilang(kode_entitas, parseFloat(bagianBulat))
        //         .then((result) => {
        //             setTerbilang(result);
        //             // alert(result);
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // } else if (selectedOptionPajak === 'E') {
        //     var nilaiTerbilang = valueNilaiDpp + totalNilaiPajakRP + kirimMU;
        //     console.log(nilaiTerbilang);
        //     let [bagianBulat, bagianDesimal] = nilaiTerbilang.toString().split('.');
        //     generateTerbilang(kode_entitas, parseFloat(bagianBulat))
        //         .then((result) => {
        //             setTerbilang(result);
        //             // alert(result);
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // }
        //END
        // }, [dataJurnal, subTotal, nominalDiskon, kirimMU, valueNilaiDpp, totalNilaiPajakRP]);
    }, []);

    return (
        <div>
            {/* BARU */}
            <DialogComponent
                id="FrmMk"
                name="FrmMk"
                className="FrmMk"
                target="#main-target"
                header={() => {
                    let header: string = '';
                    if (masterDataState == 'BARU') {
                        header = `Baru Memo Kredit - Retur Penjualan Tunai || Divisi Penjualan : ${divisiPenjualan}`;
                    } else if (masterDataState == 'EDIT') {
                        header = `Edit Memo Kredit - Retur Penjualan Tunai || Divisi Penjualan : ${divisiPenjualan}`;
                    } else if (masterDataState == 'PREVIEW') {
                        header = `Preview Memo Kredit - Retur Penjualan Tunai || Divisi Penjualan : ${divisiPenjualan}`;
                    }
                    return header;
                }}
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                resizeHandles={['All']}
                allowDragging={true}
                showCloseIcon={true}
                width="80%" //"70%"
                height="700px" //100%"
                position={{ X: 'center', Y: 'center' }} //Y: 8 }}
                style={{ position: 'fixed' }}
                buttons={buttonInputData}
                close={() => {
                    // console.log('closeDialog');
                    closeFrmMk();
                    setDataBarang((state: any) => ({
                        ...state,
                        nodes: [],
                    }));
                }}
                closeOnEscape={false}
                open={(args: any) => {
                    // console.log('openDialog');
                    args.preventFocus = true;
                }}
            >
                <div style={{ minWidth: '70%', overflow: 'auto' }}>
                    <div>
                        {/* screen loader  */}
                        {/* {showLoader && contentLoader()} */}

                        <div>
                            {/* ===============  Master Header Data ========================   */}

                            <div className="mb-1" style={{ padding: 10 }}>
                                {/* <div className="panel-tabel" style={{ width: '100%' }}> */}
                                <div className="panel-tabel" style={{ width: '100%' }}>
                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-10">
                                            <table className={styles.table}>
                                                <thead>
                                                    <tr>
                                                        {/* <th colSpan={2} style={{ width: '10%' }}>
                                                    Tanggal
                                                </th> */}
                                                        <th style={{ width: '20%' }}>Tanggal</th>
                                                        <th style={{ width: '20%' }}>No. MK</th>
                                                        <th style={{ width: '55%' }}>Customer</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <DatePickerComponent
                                                                locale="id"
                                                                cssClass="e-custom-style"
                                                                // renderDayCell={onRenderDayCell}
                                                                placeholder="Tgl. MK"
                                                                enableMask={true}
                                                                maskPlaceholder={{ day: 'd', month: 'M', year: 'y' }}
                                                                showClearButton={false}
                                                                format="dd-MM-yyyy"
                                                                value={masterTglTtb.toDate()}
                                                                change={(args: ChangeEventArgsCalendar) => {
                                                                    if (args.value) {
                                                                        const selectedDate = moment(args.value);
                                                                        selectedDate.set({
                                                                            hour: moment().hour(),
                                                                            minute: moment().minute(),
                                                                            second: moment().second(),
                                                                        });
                                                                        setDate1(selectedDate);
                                                                    } else {
                                                                        setDate1(moment());
                                                                    }
                                                                }}
                                                            >
                                                                <Inject services={[MaskedDateTime]} />
                                                            </DatePickerComponent>
                                                        </td>
                                                        <td>
                                                            <TextBoxComponent placeholder="No. MK" value={noTtbValue} readonly={true} />
                                                        </td>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Masukan Nama Customer"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() => {
                                                                            console.log('Ikon diklik!');
                                                                        }}
                                                                        style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            // onClick={() => HandleModaliconChange('customer', dataBarang, custSelected, setHandleNamaCust, setModal1)}
                                                                            style={{ margin: '7px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <thead>
                                                    <tr className={styles.table}>
                                                        <th style={{ width: '20%' }}>No. Faktur</th>
                                                        <th style={{ width: '20%' }}>No. TTB</th>
                                                        <th style={{ width: '55%' }}>Pajak</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Masukan No. Faktur"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() => {
                                                                            console.log('Ikon diklik!');
                                                                        }}
                                                                        style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            // onClick={() => HandleModaliconChange('customer', dataBarang, custSelected, setHandleNamaCust, setModal1)}
                                                                            style={{ margin: '7px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Masukan No. TTB"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                        onClick={() => {
                                                                            console.log('Ikon diklik!');
                                                                        }}
                                                                        style={{ height: 28, background: 'white', borderColor: 'white' }}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            icon={faMagnifyingGlass}
                                                                            className="ml-2"
                                                                            width="15"
                                                                            height="15"
                                                                            // onClick={() => HandleModaliconChange('customer', dataBarang, custSelected, setHandleNamaCust, setModal1)}
                                                                            style={{ margin: '7px 2px 0px 6px' }}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent placeholder="Pajak" value={noTtbValue} readonly={true} />
                                                                    {/* <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Pajak"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    /> */}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-span-2">
                                            <table className={styles.table}>
                                                <thead>
                                                    <tr>
                                                        <th>Kurs</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Kurs"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                <thead>
                                                    <tr className={styles.table}>
                                                        <th style={{ width: '20%' }}>Kurs Pajak</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="flex">
                                                                <div className="container form-input" style={{ border: 'none' }}>
                                                                    <TextBoxComponent
                                                                        className={`${stylesTtb.inputTableBasic}`}
                                                                        placeholder="Kurs Pajak"
                                                                        value={custSelected}
                                                                        onFocus={(event) => {
                                                                            if (event.target instanceof HTMLInputElement) {
                                                                                event.target.select();
                                                                            }
                                                                        }}
                                                                        input={(args: ChangeEventArgsInput) => {
                                                                            const value: any = args.value;
                                                                            // HandleModalChange(value, 'customer', setChangeNumber, setHandleNamaCust, setModal1);
                                                                        }}
                                                                        style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===============  Detail Data ========================   */}

                            <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '300px' }}>
                                <TabComponent ref={(t: any) => (tabMkDetail = t)} selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }} height="100%">
                                    <div className="e-tab-header" style={{ display: 'flex' }}>
                                        <div
                                            tabIndex={0}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            1. Data Barang
                                        </div>
                                        <div
                                            tabIndex={1}
                                            style={{ marginTop: 10, fontSize: '12px', fontWeight: 'bold', padding: '10px 20px', cursor: 'pointer', borderBottom: '3px solid transparent' }}
                                        >
                                            2. Jurnal
                                        </div>
                                    </div>

                                    {/*===================== Content menampilkan data barang =======================*/}
                                    <div className="e-content">
                                        <div style={{ width: '100%', height: '100%', marginTop: '5px', padding: 10 }}>
                                            <TooltipComponent
                                                ref={(t: any) => (tooltipDetailBarang = t)}
                                                // beforeRender={beforeRenderDetailBarang}
                                                openDelay={1000}
                                                target=".e-headertext"
                                            >
                                                <GridComponent
                                                    id="gridMkDetail"
                                                    name="gridMkDetail"
                                                    className="gridMkDetail"
                                                    locale="id"
                                                    ref={(g: any) => (gridMkDetail = g)}
                                                    dataSource={dataBarang.nodes}
                                                    editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                                                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                    allowResizing={true}
                                                    autoFit={true}
                                                    rowHeight={22}
                                                    height={170} //170 barang jadi 150 barang produksi
                                                    gridLines={'Both'}
                                                    loadingIndicator={{ indicatorType: 'Shimmer' }}
                                                    // toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
                                                    rowDataBound={rowDataBoundDetailBarang}
                                                    queryCellInfo={queryCellInfoDetailBarang}
                                                    // actionBegin={actionBeginDetailBarang}
                                                    // actionComplete={CompletedEdit}
                                                    // rowSelecting={rowSelectingDetailBarang}
                                                    created={() => {
                                                        //Tempatkan posisi toolbar dibawah grid
                                                        //gridTtbList.element.appendChild(
                                                        //     gridTtbList.element.querySelector('.e-toolbar'));
                                                    }}
                                                    // dataBound={() => {
                                                    //     if (gridTtbList) {
                                                    //         gridTtbList.selectRow(0);
                                                    //         gridTtbList.selectRow(dataBarang.nodes.length - 1);
                                                    //     }
                                                    // }}
                                                    // recordDoubleClick={(args: any) => {
                                                    //     setFocus = args.column;
                                                    // }}
                                                >
                                                    <ColumnsDirective>
                                                        {/* <ColumnDirective field="id" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />
                                                    <ColumnDirective
                                                        field="no_sj"
                                                        isPrimaryKey={true}
                                                        // editTemplate={editTemplateNoSj}
                                                        headerText="No. SJ"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                    /> */}
                                                        <ColumnDirective
                                                            field="no_item"
                                                            // isPrimaryKey={true}
                                                            headerText="No. Barang"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="85"
                                                            clipMode="EllipsisWithTooltip"
                                                            // editTemplate={editTemplateNoSj}
                                                        />
                                                        <ColumnDirective
                                                            field="diskripsi"
                                                            // isPrimaryKey={true}
                                                            headerText="Nama Barang"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="260"
                                                            clipMode="EllipsisWithTooltip"
                                                            editTemplate={editTemplateNoBarang}
                                                        />
                                                        <ColumnDirective
                                                            field="satuan"
                                                            // editTemplate={editTemplateSatuan}
                                                            headerText="Satuan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="60"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective
                                                            field="qty"
                                                            // format={formatFloat}
                                                            // editType="numericedit"
                                                            // edit={qtyParams}
                                                            //editTemplate={editTemplateQty}
                                                            headerText="Kuantitas"
                                                            headerTextAlign="Center"
                                                            textAlign="Right"
                                                            width="70"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective field="harga_mu" headerText="Harga" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective field="diskon" headerText="Diskon (%)" headerTextAlign="Center" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective
                                                            field="potongan_mu"
                                                            headerText="Potongan"
                                                            headerTextAlign="Center"
                                                            textAlign="Left"
                                                            width="100"
                                                            clipMode="EllipsisWithTooltip"
                                                        />
                                                        <ColumnDirective field="kode_pajak" headerText="Pajak" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" />
                                                        <ColumnDirective field="jumlah_mu" headerText="Jumlah" headerTextAlign="Center" textAlign="Left" width="260" clipMode="EllipsisWithTooltip" />
                                                    </ColumnsDirective>

                                                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                                </GridComponent>
                                            </TooltipComponent>
                                            {/* END TAB 1 */}

                                            <div style={{ padding: 5 }} className="panel-pager">
                                                <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                    <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                            <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                                <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                    <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                        <div className="mt-1 flex">
                                                                            <ButtonComponent
                                                                                id="buAdd1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-plus"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                // onClick={handleDetailBarang_Add}
                                                                            />
                                                                            {/* <ButtonComponent
                                                                                id="buEdit1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-edit"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                onClick={() => DetailBarangEdit(gridTtbList)}
                                                                            /> */}
                                                                            <ButtonComponent
                                                                                id="buDelete1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-warning e-small"
                                                                                iconCss="e-icons e-small e-trash"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                                // onClick={() => DetailBarangDelete(gridTtbList, swalDialog, IdDokumen, setIdDokumen)}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buDeleteAll1"
                                                                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                                                cssClass="e-danger e-small"
                                                                                iconCss="e-icons e-small e-erase"
                                                                                style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                                // onClick={() => DetailBarangDeleteAll(swalDialog, setDataBarang, setTotalBarang, setTotalRecords, setIdDokumen)}
                                                                            />
                                                                            <ButtonComponent
                                                                                id="buSimpanDokumen1"
                                                                                content="Daftar SJ"
                                                                                cssClass="e-primary e-small"
                                                                                iconCss="e-icons e-small e-search"
                                                                                style={{ float: 'right', width: '90px', marginRight: 2.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                                // onClick={DialogDaftarSj}
                                                                            />
                                                                            {/* <div className="set-font-11" style={{ marginRight: 2 + 'em' }}>
                                                                                <b>Jumlah Barang :</b>&nbsp;&nbsp;&nbsp;{TotalBarang}
                                                                            </div> */}
                                                                        </div>
                                                                    </TooltipComponent>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </div>
                                        </div>
                                    </div>
                                </TabComponent>
                            </div>

                            {/* ===============  Master Footer Data ========================   */}
                            <div className="grid grid-cols-6 gap-2">
                                <div className="col-span-4">
                                    <div className="mt-1">
                                        <p className="set-font-11">
                                            <b>Catatan :</b>
                                        </p>
                                        <div className="panel-input">
                                            <TextBoxComponent
                                                ref={(t: any) => {
                                                    textareaObj = t;
                                                }}
                                                multiline={true}
                                                created={onCreateMultiline}
                                                value={catatanValue}
                                                input={(args: FocusInEventArgs) => {
                                                    const value: any = args.value;
                                                    HandelCatatan(value, setCatatanValue);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '15px', fontWeight: 'bold' }}>Terbilang :</div>
                                    <div className="flex" style={{ alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', marginTop: '12px', color: 'green', textTransform: 'capitalize' }}>{terbilang}</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className={styles['grid-rightNote']}>
                                        <div className="mt-5 flex justify-between">
                                            <div>
                                                <div>Sub Total</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {/* {no_lpbSelected ? diskon_dok_rp : headerDataFetch[0]?.diskon_dok_rp !== '0.00' ? headerDataFetch[0]?.diskon_dok_rp : null} */}
                                                    {/* kondisi  */}
                                                    {/* Jika no_lpbSelected dipilih, maka tampilkan diskon_dok_rp, jika no_lpbSelected tidak dipilih maka lanjut ke kondisi selanjutnya */}
                                                    {/* jika headerDataFetch : diskon_dok_rp nilainya bukan '0.00' maka tampilkan headerDataFetch : diskon_dok_rp */}
                                                    {/* jika tidak ada kondisi yang terpenuhi maka tampilkan null */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>Diskon</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {/* {no_lpbSelected ? diskon_dok_rp : headerDataFetch[0]?.diskon_dok_rp !== '0.00' ? headerDataFetch[0]?.diskon_dok_rp : null} */}
                                                    {/* kondisi  */}
                                                    {/* Jika no_lpbSelected dipilih, maka tampilkan diskon_dok_rp, jika no_lpbSelected tidak dipilih maka lanjut ke kondisi selanjutnya */}
                                                    {/* jika headerDataFetch : diskon_dok_rp nilainya bukan '0.00' maka tampilkan headerDataFetch : diskon_dok_rp */}
                                                    {/* jika tidak ada kondisi yang terpenuhi maka tampilkan null */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>DPP</div> {/* Harga Asli Sebelum Ditambah Pajak */}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {/* {no_lpbSelected && total_pajak_rp ? total_rp : headerDataFetch[0]?.total_pajak_rp !== '0.00' && !no_lpbSelected ? headerDataFetch[0]?.total_rp : null} */}
                                                    {/* kondisi : */}
                                                    {/* jika no_lpbSelected dipilih dan total_pajak_rp memiliki value maka tampilkan total_rp jika tidak lanjut ke kondisi selanjutnya */}
                                                    {/* jika headerDataFetch : total_pajak_rp nilainya bukan '0.00' && no_lpbSelected belum dipilih maka tampilkan headerDataFetch : total_rp*/}
                                                    {/* jika tidak ada kondisi yang terpenuhi maka tampilkan null */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>Pajak</div>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>
                                                    {/* {no_lpbSelected ? total_pajak_rp : headerDataFetch[0]?.total_pajak_rp !== '0.00' ? headerDataFetch[0]?.total_pajak_rp : null} */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-1 h-2 border-t-2 border-solid border-black"></div>

                                        <div className="flex justify-between">
                                            <div>
                                                <div>Total Setelah Pajak</div>
                                            </div>
                                            <div>{/* <div style={{ fontWeight: 'bold' }}>{netto_rp ? netto_rp : headerDataFetch[0]?.netto_rp}</div> */}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ================= END SUB TOTAL ==================== */}

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
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-close"
                                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                                        onClick={closeDialogMkForm}
                                    />
                                )}
                                {(masterDataState == 'BARU' || masterDataState == 'EDIT') && (
                                    <ButtonComponent
                                        id="buSimpanDokumen1"
                                        content="Simpan"
                                        cssClass="e-primary e-small"
                                        iconCss="e-icons e-small e-save"
                                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                        onClick={() => saveDoc(dataBarang)}
                                    />
                                )}
                            </div>
                            {/* ============================================================ */}
                        </div>
                    </div>
                </div>
            </DialogComponent>
        </div>
    );
};

export default FrmMk;
