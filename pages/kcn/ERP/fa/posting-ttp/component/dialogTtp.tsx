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
import { DiskonByCalc, FillFromSQL, appBackdate, fetchPreferensi, frmNumber, generateNU, generateNUDivisi } from '@/utils/routines';
//========================================================

import { useRouter } from 'next/router';

import styles from './spp.module.css';
import stylesTtb from '../ttblist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faPlay,
    faSave,
    faBackward,
    faCancel,
    faFileArchive,
    faCamera,
    faTimes,
    faSearchPlus,
    faSearchMinus,
    faEraser,
    faTrashCan,
    faUpload,
} from '@fortawesome/free-solid-svg-icons';
import JSZip from 'jszip';
import Flatpickr from 'react-flatpickr';
import TemplateHeader from '../interface/templateHeader';
import TemplateDetail from '../interface/templateDetail';
import { GetDaftarFaktur, GetEditTtp } from '../model/api';
import DialogDaftarFaktur from '../modal/DialogDaftarFaktur';

enableRipple(true);

interface dialogTtpProps {
    userid: any;
    kode_entitas: any;
    entitas: any;
    isOpen: any;
    onClose: any;
    dataMasterList: any;
    token: any;
    recordsDataAlokasiDana: any;
    recordsDataFaktur: any;
    refreshData: any;
    setListStateData: Function;
    listStateData: any;
}

const DialogTtp: React.FC<dialogTtpProps> = ({
    userid,
    kode_entitas,
    entitas,
    isOpen,
    onClose,
    dataMasterList,
    token,
    recordsDataAlokasiDana,
    recordsDataFaktur,
    refreshData,
    setListStateData,
    listStateData,
}: // masterKodeDokumen,
// masterDataState,
// masterBarangProduksi,
// onClose,
// onRefresh,
// kode_user,
// refreshKey,
// onOpen,
// token,
// valueAppBackdate,
dialogTtpProps) => {
    const closeDialogTtp = async () => {
        await onClose();
        await recallRefresh();
    };

    type FakturItem = {
        id_ttp: number;
        id: number;
        kode_dokumen: string;
        kode_fj: string;
        jenis: string;
        no_dokumen: string;
        bank_tujuan: string;
        tgl_warkat: string;
        bayar_mu: string;
        pembulatan: string;
        filegambar: string;
        filegambar_pendukung: string;
        no_fj: string;
        tgl_fj: string;
        netto_mu: string;
        sisa_mu: string;
        jumlah: string;
    };

    const recordsDataFakturTunaiRef = useRef<FakturItem[]>([]);
    const recordsDataFakturTransferRef = useRef<FakturItem[]>([]);
    const recordsDataFakturWarkatRef = useRef<FakturItem[]>([]);
    const recordsDataFakturTitipanRef = useRef<FakturItem[]>([]);
    const [plagJenis, setPlagJenis] = useState('');
    const [dataBarang, setDataBarang] = useState<{ nodes: FakturItem[] }>({ nodes: [] });
    const [dialogDaftarFakturVisible, setDialogDaftarFakturVisible] = useState(false);
    const [daftarFaktur, setDaftarFaktur] = useState<any[]>([]);

    const paramObject = {
        kode_entitas: kode_entitas,
        token: token,
        kode_dokumen: dataMasterList?.kode_dokumen,
        kode_cust: dataMasterList?.kode_cust,
    };

    let counter = 1;
    useEffect(() => {
        const async = async () => {
            const respEditTtb = await GetEditTtp(paramObject);
            const responseDataFix = respEditTtb.map((item: any) => ({
                ...item,
                bayar_mu: parseFloat(item.bayar_mu),
                pembulatan: parseFloat(item.pembulatan),
                netto_mu: parseFloat(item.netto_mu),
                sisa_mu: parseFloat(item.sisa_mu),
                jumlah: parseFloat(item.jumlah),
            }));

            Promise.all(
                responseDataFix.map((item: any) => {
                    return {
                        id_ttp: counter++,
                        id: item.id,
                        kode_dokumen: item.kode_dokumen,
                        kode_fj: item.kode_fj,
                        jenis: item.jenis,
                        no_dokumen: item.no_dokumen,
                        bank_tujuan: item.bank_tujuan,
                        tgl_warkat: item.tgl_warkat,
                        bayar_mu: item.bayar_mu,
                        pembulatan: item.pembulatan,
                        filegambar: item.filegambar,
                        filegambar_pendukung: item.filegambar_pendukung,
                        no_fj: item.no_fj,
                        tgl_fj: item.tgl_fj,
                        netto_mu: item.netto_mu,
                        sisa_mu: item.sisa_mu,
                        jumlah: item.jumlah,
                    };
                })
            ).then((newData) => {
                setDataBarang((state: any) => {
                    const existingNodes = state?.nodes.filter((node: any) => node.kode_dokumen === dataMasterList?.kode_dokumen);
                    const newNodes = [...existingNodes, ...newData.filter((data: any) => data !== null)];
                    return { ...state, nodes: newNodes }; // Memperbarui nodes dengan data yang diperbarui
                });
            });

            const respDaftarFaktur = await GetDaftarFaktur(paramObject);
            const responseDataFakturFix = respDaftarFaktur.map((item: any) => ({
                ...item,
                netto_mu: parseFloat(item.netto_mu),
                sisa_mu: parseFloat(item.sisa_mu),
            }));
            setDaftarFaktur(responseDataFakturFix);

            if (dataMasterList?.nilai_tunai > 0) {
                setPlagJenis('Tunai');
                // recordsDataFakturTunaiRef.current = recordsDataFaktur;
            } else if (dataMasterList?.nilai_transfer > 0) {
                setPlagJenis('Transfer');
                // recordsDataFakturTransferRef.current = recordsDataFaktur;
            } else if (dataMasterList?.nilai_warkat > 0) {
                setPlagJenis('Warkat');
                // recordsDataFakturWarkatRef.current = recordsDataFaktur;
            } else {
                setPlagJenis('Titipan');
                // recordsDataFakturTitipanRef.current = recordsDataFaktur;
            }
        };
        async();
    }, [refreshData]);

    const recallRefresh = () => {
        setDataBarang((state: any) => ({
            ...state,
            nodes: [],
        }));
        setListStateData((prevState: any) => ({
            ...prevState,
            plagJmlFaktur: 'header',
        }));
    };

    const clickDaftarFaktur = () => {
        setDialogDaftarFakturVisible(true);
    };

    const clickPilihDetailFaktur = (dataFaktur: any) => {
        const newIdDokumen = dataBarang?.nodes.length + 1;
        let maxIdValue;
        // Mengambil id terbesar
        if (dataBarang?.nodes.length > 0) {
            maxIdValue = dataBarang?.nodes.reduce((max: any, item: any) => (item.id > max ? item.id : max), dataBarang?.nodes[0].id);
        } else {
            maxIdValue = 1;
        }
        const newItem = {
            id_ttp: newIdDokumen,
            id: maxIdValue + 1,
            kode_dokumen: dataMasterList?.kode_dokumen,
            kode_fj: dataFaktur[0].kode_fj,
            jenis: plagJenis === 'Tunai' ? 'C' : plagJenis === 'Transfer' ? 'T' : plagJenis === 'Warkat' ? 'W' : 'U',
            no_dokumen: '',
            bank_tujuan: '1',
            tgl_warkat: moment().toISOString(),
            bayar_mu: '',
            pembulatan: '',
            filegambar: '',
            filegambar_pendukung: '',
            no_fj: dataFaktur[0].no_fj,
            tgl_fj: dataFaktur[0].tgl_fj,
            netto_mu: dataFaktur[0].netto_mu,
            sisa_mu: dataFaktur[0].sisa_mu,
            jumlah: '',
        };

        setDataBarang({ nodes: [...dataBarang?.nodes, newItem] });
    };

    return (
        <div>
            {/*==================================================================================================*/}
            {/*====================== Modal dialog untuk input edit dan menambah data baru ======================*/}
            {/*==================================================================================================*/}
            <DialogComponent
                id="dialogTtpList"
                name="dialogTtpList"
                className="dialogTtpList"
                target="#main-target"
                header="Tanda Terima Pembayaran"
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                resizeHandles={['All']}
                allowDragging={true}
                showCloseIcon={true}
                width="60%" //"70%"
                // height="70%"
                position={{ X: 'center', Y: 8 }}
                style={{ position: 'fixed' }}
                // buttons={buttonInputData}
                close={closeDialogTtp}
                closeOnEscape={false}
                open={(args: any) => {
                    args.preventFocus = true;
                }}
            >
                <TemplateHeader userid={userid} kode_entitas={kode_entitas} dataMasterList={dataMasterList} setListStateData={setListStateData} listStateData={listStateData} />
                <TemplateDetail
                    userid={userid}
                    kode_entitas={kode_entitas}
                    dataMasterList={dataMasterList}
                    token={token}
                    refreshData={refreshData}
                    recordsDataFakturTunaiRef={recordsDataFakturTunaiRef.current}
                    recordsDataFakturTransferRef={recordsDataFakturTransferRef.current}
                    recordsDataFakturWarkatRef={recordsDataFakturWarkatRef.current}
                    recordsDataFakturTitipanRef={recordsDataFakturTitipanRef.current}
                    setListStateData={setListStateData}
                    listStateData={listStateData}
                    plagJenis={plagJenis}
                    dataBarang={dataBarang}
                    setDataBarang={setDataBarang}
                    clickDaftarFaktur={() => clickDaftarFaktur()}
                />

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
                    <ButtonComponent
                        id="buBatalDokumen1"
                        content="Batal"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-close"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 3.2 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={closeDialogTtp}
                    />

                    <ButtonComponent
                        id="buSimpanDokumen1"
                        content="Simpan"
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-save"
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                        // onClick={saveDoc}
                    />
                </div>
            </DialogComponent>

            <DialogDaftarFaktur
                dialogDaftarFakturVisible={dialogDaftarFakturVisible}
                setDialogDaftarFakturVisible={setDialogDaftarFakturVisible}
                dataMasterList={dataMasterList}
                daftarFaktur={daftarFaktur}
                clickPilihDetailFaktur={(dataFaktur: any) => {
                    clickPilihDetailFaktur(dataFaktur);
                }}
            />
        </div>
    );
};

export default DialogTtp;
