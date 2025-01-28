import { ButtonComponent, RadioButtonComponent, CheckBoxComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
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
import * as React from 'react';
import { useEffect, useState, useCallback, useRef } from 'react';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import styles from '../index.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes, faArrowRight, faEraser, faTrashCan, faUpload } from '@fortawesome/free-solid-svg-icons';
import {
    headerDibayarTransfer,
    headerDibayarTunai,
    headerDibayarUangMuka,
    headerDibayarWarkat,
    headerNoRekening,
    headerPembayaranFaktur,
    headerSisaDibayar,
    swalDialog,
    swalPopUp,
    swalToast,
} from './template';
import { GetEditTtp, GetMasterDetailPosting } from '../model/api';

interface templateDetailProps {
    userid: any;
    kode_entitas: any;
    dataMasterList: any;
    token: any;

    refreshData: any;
    recordsDataFakturTunaiRef: any;
    recordsDataFakturTransferRef: any;
    recordsDataFakturWarkatRef: any;
    recordsDataFakturTitipanRef: any;
    setListStateData: any;
    listStateData: any;
    plagJenis: any;
    dataBarang: any;
    setDataBarang: Function;
    clickDaftarFaktur: any;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
let statusJurnal: string;
let gridJurnalPpiListRef: Grid | any;
let gridTunaiRef: Grid | any;
let gridTransferRef: Grid | any;
let gridWarkatRef: Grid | any;
let gridTitipanRef: Grid | any;

const TemplateDetail: React.FC<templateDetailProps> = ({
    userid,
    kode_entitas,
    dataMasterList,
    token,
    refreshData,
    recordsDataFakturTunaiRef,
    recordsDataFakturTransferRef,
    recordsDataFakturWarkatRef,
    recordsDataFakturTitipanRef,
    setListStateData,
    listStateData,
    plagJenis,
    dataBarang,
    setDataBarang,
    clickDaftarFaktur,
}: templateDetailProps) => {
    // const gridTunaiRef = useRef<GridComponent>(null);
    // const gridTransferRef = useRef<GridComponent | any>(null);
    // const gridWarkatRef = useRef<GridComponent>(null);
    // const gridTitipanRef = useRef<GridComponent>(null);
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };
    const qtyParams = { params: { format: 'N2' } };
    const [tipeInput, setTipeInput] = useState('');

    const simulateInputChange = (element: HTMLInputElement, newValue: string) => {
        // Set value and dispatch an input event
        element.value = newValue;
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
    };

    const editJumlah = {
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
                    setTipeInput('jumlah'); // Memperbarui state saat nilai diubah
                    calculateTotalCost(args);
                });
            }
        },
    };

    const [previousBayarMu, setPreviousBayarMu] = useState(0); // Untuk bayar_mu
    const [previousPembulatan, setPreviousPembulatan] = useState(0); // Untuk pembulatan
    const calculateTotalCost = (args: any) => {
        let refGrid, refGrid1;
        if (args.rowData.jenis === 'C') {
            refGrid1 = gridTunaiRef;
            refGrid = gridTunaiRef?.element.querySelector('form').ej2_instances[0];
        } else if (args.rowData.jenis === 'T') {
            refGrid = gridTransferRef?.element.querySelector('form').ej2_instances[0];
            refGrid1 = gridTransferRef;
        } else if (args.rowData.jenis === 'W') {
            refGrid = gridWarkatRef?.element.querySelector('form').ej2_instances[0];
            refGrid1 = gridWarkatRef;
        } else {
            refGrid = gridTitipanRef?.element.querySelector('form').ej2_instances[0];
            refGrid1 = gridTitipanRef;
        }
        // Ambil nilai input
        let bayarMu = parseFloat(refGrid.getInputElement('bayar_mu').value || '0');
        let pembulatan = parseFloat(refGrid.getInputElement('pembulatan').value || '0');

        // Jika input negatif, kembalikan ke nilai sebelumnya
        if (bayarMu < 0) {
            bayarMu = previousBayarMu; // Gunakan nilai sebelumnya
            refGrid.getInputElement('bayar_mu').value = bayarMu.toString(); // Set ke UI
        } else {
            setPreviousBayarMu(bayarMu); // Simpan nilai baru sebagai nilai sebelumnya
        }

        if (pembulatan < 0) {
            pembulatan = previousPembulatan; // Gunakan nilai sebelumnya
            refGrid.getInputElement('pembulatan').value = pembulatan.toString(); // Set ke UI
        } else {
            setPreviousPembulatan(pembulatan); // Simpan nilai baru sebagai nilai sebelumnya
        }

        // Menghitung total bayarMu + pembulatan
        const total = bayarMu + pembulatan;

        // Mengupdate input jumlah di UI
        refGrid.getInputElement('jumlah').value = total.toFixed(2);
    };

    const kalkulasi = (args: any) => {
        let grid, plagGrid, plag: any;
        if (args.requestType === 'save') {
            if (args.rowData.no_fj === undefined) {
                if (plagJenis === 'Tunai') {
                    plagGrid = gridTunaiRef;
                } else if (plagJenis === 'Transfer') {
                    plagGrid = gridTransferRef;
                } else if (plagJenis === 'Warkat') {
                    plagGrid = gridWarkatRef;
                } else {
                    plagGrid = gridTitipanRef;
                }
                if (dataBarang?.nodes.length > 0) {
                    // Salin data dari gridJurnalPpiListRef.dataSource ke variabel baru untuk manipulasi
                    const newNodes = dataBarang?.nodes.filter((node: any) => node.no_fj !== undefined);
                    plagGrid.setProperties({ dataSource: newNodes });
                    setDataBarang({ nodes: newNodes });
                    plagGrid.refresh();
                } else {
                    const updatedNodes = dataBarang?.nodes.filter((node: any) => node.no_fj !== undefined);

                    plagGrid.setProperties({ dataSource: updatedNodes });
                    setDataBarang({ nodes: updatedNodes });
                    plagGrid.refresh();
                }
            } else {
                if (args.rowData.jenis === 'C') {
                    grid = gridTunaiRef.dataSource;
                    plag = 'Tunai';
                } else if (args.rowData.jenis === 'T') {
                    grid = gridTransferRef.dataSource;
                    plag = 'Transfer';
                } else if (args.rowData.jenis === 'W') {
                    grid = gridWarkatRef.dataSource;
                    plag = 'Warkat';
                } else {
                    grid = gridTitipanRef.dataSource;
                    plag = 'Titipan';
                }
                // Cek apakah ada nilai 0 di grid
                const hasZero = grid?.some((item: any) => item.jumlah === 0);

                // Jika ada nilai 0, tampilkan peringatan
                if (hasZero) {
                    withReactContent(swalPopUp).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px;color:white;margin-right: -42px;">Nilai bayar tidak boleh 0.</p>',
                        width: '50%', // Atur lebar popup sesuai kebutuhan
                        target: '#dialogTtpList',
                        heightAuto: true,
                        timer: 3000,
                        showConfirmButton: false, // Menampilkan tombol konfirmasi
                        allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                        allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
                        customClass: {
                            popup: styles['colored-popup'], // Custom class untuk sweetalert
                        },
                    });
                    return;
                }

                const totalJumlah = grid?.reduce((total: any, item: any) => {
                    // Pastikan item tidak undefined dan item.debet_rp bisa diparse
                    if (item && item.jumlah !== undefined && !isNaN(parseFloat(item.jumlah))) {
                        return total + parseFloat(item.jumlah);
                    }
                    return total; // Jika item atau debet_rp tidak valid, kembalikan total tanpa penambahan
                }, 0);
                setListStateData((prevState: any) => ({
                    ...prevState,
                    jmlFaktur: totalJumlah,
                    plagJmlFaktur: 'detail',
                    plagTipe: plag,
                }));
            }
        }
    };

    const handleDetailAdd = (tipe: any) => {
        const id = dataBarang?.nodes.length + 1;
        if (tipe === 'Tunai') {
            gridTunaiRef?.addRecord();
        } else if (tipe === 'Transfer') {
            gridTransferRef?.addRecord();
        } else if (tipe === 'Warkat') {
            gridWarkatRef?.addRecord();
        } else {
            gridTitipanRef?.addRecord();
        }
    };

    const handleDetailDelete = async (tipe: any) => {
        let currentDetailBarang, grid;
        if (tipe === 'Tunai') {
            currentDetailBarang = gridTunaiRef?.getSelectedRecords() || [];
            grid = gridTunaiRef;
        } else if (tipe === 'Transfer') {
            currentDetailBarang = gridTransferRef?.getSelectedRecords() || [];
            grid = gridTransferRef;
        } else if (tipe === 'Warkat') {
            currentDetailBarang = gridWarkatRef?.getSelectedRecords() || [];
            grid = gridWarkatRef;
        } else {
            currentDetailBarang = gridTitipanRef?.getSelectedRecords() || [];
            grid = gridTitipanRef;
        }

        if (currentDetailBarang.length > 0) {
            // Tambahkan CSS untuk tombol
            const style = document.createElement('style');
            style.innerHTML = `
            .swal2-popup .btn {
            margin-left: 10px;
            }
    `;
            document.head.appendChild(style);

            const confirm = await withReactContent(swalDialog).fire({
                // title: `${currentDetailBarang[0].no_sj === undefined ? '' : `<p style="font-size:12px"><b>${currentDetailBarang[0].no_sj}</b></p>`}`,
                html: `
    <div style="font-size:12px; margin: 0;">
        <p style="margin: 0;">No Faktur: ${currentDetailBarang[0].no_fj === undefined ? '' : currentDetailBarang[0].no_fj}</p>
        <p style="margin: 0;">Di bayar: ${currentDetailBarang[0].bayar_mu}</p>
        <p style="margin: 0;">Apakah pembayaran faktur atau titipan ini akan di hapus?</p>
    </div>
`,
                width: '350px',
                heightAuto: true,
                target: '#dialogTtpList',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '&ensp; Ya &ensp;',
                cancelButtonText: 'Tidak',
                reverseButtons: false,
                allowOutsideClick: false, // Menonaktifkan penutupan saat klik di luar
                allowEscapeKey: false, // Menonaktifkan penutupan dengan tombol Escape
            });

            if (confirm.isConfirmed) {
                const diskripsi: string = currentDetailBarang[0].no_fj;
                grid?.deleteRecord(currentDetailBarang[0]);

                withReactContent(swalDialog).fire({
                    title: `<p style="font-size:12px"><b>${diskripsi}</b></p>`,
                    html: '<p style="font-size:12px">Data barang berhasil dihapus</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 2000,
                    target: '#dialogTtpList',
                });
            }
        } else {
            document.getElementById('gridTtbList')?.focus();
            withReactContent(swalToast).fire({
                icon: 'warning',
                title: '<p style="font-size:12px">Silahkan pilih data barang terlebih dahulu</p>',
                width: '100%',
                target: '#dialogTtbList',
            });
        }
    };

    const handleDetailDeleteAll = () => {
        setDataBarang((state: any) => ({
            ...state,
            nodes: [],
        }));
    };

    //================ Editing template untuk kolom grid detail barang ==================
    const editTemplateNoFjTunai = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_fj_tunai" name="no_fj_tunai" className="no_fj_tunai" value={args.no_fj} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoFjTunai"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={clickDaftarFaktur}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateNoFjTransfer = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_fj_transfer" name="no_fj_transfer" className="no_fj_transfer" value={args.no_fj} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoFjTransfer"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={clickDaftarFaktur}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateNoFjWarkat = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_fj_warkat" name="no_fj_warkat" className="no_fj_warkat" value={args.no_fj} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoFjWarkat"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={clickDaftarFaktur}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateNoFjTitipan = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_fj_titipan" name="no_fj_titipan" className="no_fj_titipan" value={args.no_fj} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoFjTitipan"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                onClick={clickDaftarFaktur}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editTemplateNoRekening = (args: any) => {
        return (
            <div>
                <TooltipComponent content="Pilih data barang" opensOn="Hover" openDelay={1000} position="TopRight" target="#buNoItem">
                    <div className="col-xs-6 col-sm-6 col-lg-6 col-md-6" style={{ paddingRight: '20px' }}>
                        <TextBoxComponent id="no_dokumen" name="no_dokumen" className="no_dokumen" value={args.no_dokumen} readOnly={true} showClearButton={false} />
                        <span>
                            <ButtonComponent
                                id="buNoDokumen"
                                type="button" //Solusi tdk refresh halaman saat selesai onClick
                                cssClass="e-primary e-small e-round"
                                iconCss="e-icons e-small e-search"
                                // onClick={clickDaftarFaktur}
                                style={{ backgroundColor: '#3b3f5c' }}
                            />
                        </span>
                    </div>
                </TooltipComponent>
            </div>
        );
    };

    const editNoWarkat = () => {
        const formEle = gridWarkatRef?.element.querySelector('form').ej2_instances[0];
        formEle.getInputElement('no_dokumen').value;
    };
    const noWarkat = { params: { change: editNoWarkat } };

    return (
        <div className="panel-tab" style={{ background: '#F7F7F7', width: '100%', height: '322px' }}>
            <TabComponent
                /*ref={(t) => (tabPhuList = t)}*/ selectedItem={plagJenis === 'Tunai' ? 0 : plagJenis === 'Transfer' ? 1 : plagJenis === 'Warkat' ? 2 : plagJenis === 'Titipan' ? 3 : 0}
                animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}
                height="100%"
            >
                <div className="e-tab-header">
                    <div tabIndex={0}>1. Tunai</div>
                    <div tabIndex={1}>2. Transfer</div>
                    <div tabIndex={2}>3. Warkat</div>
                    <div tabIndex={3}>4. Uang Muka</div>
                </div>
                {/*===================== Content menampilkan data barang =======================*/}
                <div className="e-content">
                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={0}>
                        <GridComponent
                            id="gridTunaiList"
                            name="gridTunaiList"
                            className="gridTunaiList"
                            locale="id"
                            ref={(g: any) => (gridTunaiRef = g)}
                            dataSource={plagJenis === 'Tunai' ? dataBarang?.nodes : null}
                            editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            allowResizing={true}
                            autoFit={true}
                            rowHeight={22}
                            height={170} //170 barang jadi 150 barang produksi
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            // actionBegin={actionBaginKalkulasi}
                            actionComplete={kalkulasi}
                            recordClick={(args: any) => {
                                let currentDaftarBarang = gridTunaiRef?.getSelectedRecords() || [];
                                if (currentDaftarBarang.length > 0) {
                                    gridTunaiRef?.startEdit();
                                }
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="id_ttp" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />
                                <ColumnDirective field="no_fj" isPrimaryKey={true} headerText="No. Faktur" headerTextAlign="Center" textAlign="Left" width="150" editTemplate={editTemplateNoFjTunai} />
                                <ColumnDirective isPrimaryKey={true} format="N2" field="netto_mu" headerText="Nilai Faktur" headerTextAlign="Center" textAlign="Center" width="120" />
                                <ColumnDirective
                                    field="sisa_mu"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    // headerTemplate={headerNilaiFaktur}
                                    headerText="Sisa yang harus dibayar"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="140"
                                    headerTemplate={headerSisaDibayar}
                                />
                                <ColumnDirective
                                    field="bayar_mu"
                                    format="N2"
                                    edit={editJumlah}
                                    headerText="Dibayar Tunai"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerDibayarTunai}
                                />
                                <ColumnDirective
                                    field="pembulatan"
                                    isPrimaryKey={true}
                                    // headerTemplate={headerSisaNilaiFaktur}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembulatan"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    // editTemplate={EditTemplateSisaNilaiFaktur}
                                />
                                <ColumnDirective
                                    field="jumlah"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembayaran Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerPembayaranFaktur}
                                />
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
                                                        <ButtonComponent
                                                            id="buAdd1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick1
                                                            cssClass="e-primary e-small"
                                                            iconCss="e-icons e-small e-plus"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                            onClick={() => handleDetailAdd('Tunai')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDelete1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-warning e-small"
                                                            iconCss="e-icons e-small e-trash"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                            onClick={() => handleDetailDelete('Tunai')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDeleteAll1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-danger e-small"
                                                            iconCss="e-icons e-small e-erase"
                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                            onClick={handleDetailDeleteAll}
                                                        />
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
                        <GridComponent
                            id="gridTransferList"
                            name="gridTransferList"
                            className="gridTransferList"
                            locale="id"
                            ref={(g: any) => (gridTransferRef = g)}
                            dataSource={plagJenis === 'Transfer' ? dataBarang?.nodes : null}
                            editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            allowResizing={true}
                            autoFit={true}
                            rowHeight={22}
                            height={170} //170 barang jadi 150 barang produksi
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            // actionBegin={actionBaginKalkulasi}
                            recordClick={(args: any) => {
                                let currentDaftarBarang = gridTransferRef?.getSelectedRecords() || [];
                                if (currentDaftarBarang.length > 0) {
                                    gridTransferRef?.startEdit();
                                }
                            }}
                            actionComplete={kalkulasi}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="id_ttp" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />

                                <ColumnDirective
                                    field="no_fj"
                                    isPrimaryKey={true}
                                    headerText="No. Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="150"
                                    editTemplate={editTemplateNoFjTransfer}
                                />
                                <ColumnDirective
                                    isPrimaryKey={true}
                                    field="netto_mu"
                                    headerText="Nilai Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="120"
                                    format="N2"
                                    // editTemplate={EditTemplateHari}
                                />
                                <ColumnDirective
                                    field="sisa_mu"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerTemplate={headerSisaDibayar}
                                    headerText="Sisa yang harus dibayar"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="140"
                                    // editTemplate={EditTemplateNilaiFaktur}
                                />
                                <ColumnDirective
                                    isPrimaryKey={true}
                                    field="no_dokumen"
                                    headerText="No. Rekening Bank Transfer"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="120"
                                    headerTemplate={headerNoRekening}
                                    editTemplate={editTemplateNoRekening}
                                />
                                <ColumnDirective
                                    isPrimaryKey={true}
                                    field="bank_tujuan"
                                    headerText="No. Struk"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="80"
                                    // editTemplate={EditTemplateHari}
                                />
                                <ColumnDirective
                                    field="tgl_warkat"
                                    isPrimaryKey={true}
                                    headerText="Tgl. Efektif"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="100"
                                    format={formatDate}
                                    type="date"
                                    edit={formatDate}
                                    // editTemplate={EditTemplateTglFj}
                                />
                                <ColumnDirective
                                    field="bayar_mu"
                                    format="N2"
                                    edit={editJumlah}
                                    headerText="Dibayar Transfer"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerDibayarTransfer}
                                />
                                <ColumnDirective
                                    field="pembulatan"
                                    isPrimaryKey={true}
                                    // headerTemplate={headerSisaNilaiFaktur}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembulatan"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    // editTemplate={EditTemplateSisaNilaiFaktur}
                                />
                                <ColumnDirective
                                    field="jumlah"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembayaran Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerPembayaranFaktur}
                                />
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
                                                        <ButtonComponent
                                                            id="buAdd1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick1
                                                            cssClass="e-primary e-small"
                                                            iconCss="e-icons e-small e-plus"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                            onClick={() => handleDetailAdd('Transfer')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDelete1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-warning e-small"
                                                            iconCss="e-icons e-small e-trash"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                            onClick={() => handleDetailDelete('Transfer')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDeleteAll1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-danger e-small"
                                                            iconCss="e-icons e-small e-erase"
                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                            onClick={handleDetailDeleteAll}
                                                        />
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
                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={2}>
                        <GridComponent
                            id="gridWarkatList"
                            name="gridWarkatList"
                            className="gridWarkatList"
                            locale="id"
                            ref={(g: any) => (gridWarkatRef = g)}
                            dataSource={plagJenis === 'Warkat' ? dataBarang?.nodes : null}
                            editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            allowResizing={true}
                            autoFit={true}
                            rowHeight={22}
                            height={170} //170 barang jadi 150 barang produksi
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            // actionBegin={actionBeginDetailBarang}
                            // recordClick={gridWarkatRef?.startEdit()}
                            actionComplete={kalkulasi}
                            recordClick={(args: any) => {
                                let currentDaftarBarang = gridWarkatRef?.getSelectedRecords() || [];
                                if (currentDaftarBarang.length > 0) {
                                    gridWarkatRef?.startEdit();
                                }
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="id_ttp" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />

                                <ColumnDirective
                                    field="no_fj"
                                    isPrimaryKey={true}
                                    headerText="No. Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="150"
                                    editTemplate={editTemplateNoFjWarkat}
                                />
                                <ColumnDirective
                                    isPrimaryKey={true}
                                    field="netto_mu"
                                    format="N2"
                                    headerText="Nilai Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="120"
                                    // editTemplate={EditTemplateHari}
                                />
                                <ColumnDirective
                                    field="sisa_mu"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerTemplate={headerSisaDibayar}
                                    headerText="Sisa yang harus dibayar"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="140"
                                    // editTemplate={EditTemplateNilaiFaktur}
                                />
                                <ColumnDirective isPrimaryKey={true} field="bank_tujuan" headerText="Warkat Bank" headerTextAlign="Center" textAlign="Center" width="140" />
                                <ColumnDirective
                                    field="no_dokumen"
                                    headerText="No. Warkat"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="80"
                                    // editTemplate={EditTemplateHari}
                                    edit={noWarkat}
                                />
                                <ColumnDirective
                                    field="tgl_warkat"
                                    isPrimaryKey={true}
                                    headerText="Tgl. Warkat"
                                    headerTextAlign="Center"
                                    textAlign="Center"
                                    width="100"
                                    format={formatDate}
                                    type="date"
                                    edit={formatDate}
                                    // editTemplate={EditTemplateTglFj}
                                />
                                <ColumnDirective
                                    field="bayar_mu"
                                    format="N2"
                                    edit={editJumlah}
                                    headerText="Dibayar Warkat"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerDibayarWarkat}
                                />
                                <ColumnDirective
                                    field="pembulatan"
                                    isPrimaryKey={true}
                                    // headerTemplate={headerSisaNilaiFaktur}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembulatan"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    // editTemplate={EditTemplateSisaNilaiFaktur}
                                />
                                <ColumnDirective
                                    field="jumlah"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembayaran Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerPembayaranFaktur}
                                />
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
                                                        <ButtonComponent
                                                            id="buAdd1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick1
                                                            cssClass="e-primary e-small"
                                                            iconCss="e-icons e-small e-plus"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                            onClick={() => handleDetailAdd('Warkat')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDelete1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-warning e-small"
                                                            iconCss="e-icons e-small e-trash"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                            onClick={() => handleDetailDelete('Warkat')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDeleteAll1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-danger e-small"
                                                            iconCss="e-icons e-small e-erase"
                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                            onClick={handleDetailDeleteAll}
                                                        />
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
                    <div style={{ width: '100%', height: '100%', marginTop: '5px' }} tabIndex={3}>
                        <GridComponent
                            id="gridUangMukaList"
                            name="gridUangMukaList"
                            className="gridUangMukaList"
                            locale="id"
                            ref={(g: any) => (gridTitipanRef = g)}
                            dataSource={plagJenis === 'Titipan' ? dataBarang?.nodes : null}
                            editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, newRowPosition: 'Bottom' }}
                            selectionSettings={{ mode: 'Row', type: 'Single' }}
                            allowResizing={true}
                            autoFit={true}
                            rowHeight={22}
                            height={170} //170 barang jadi 150 barang produksi
                            gridLines={'Both'}
                            loadingIndicator={{ indicatorType: 'Shimmer' }}
                            // actionBegin={actionBeginDetailBarang}
                            actionComplete={kalkulasi}
                            recordClick={(args: any) => {
                                let currentDaftarBarang = gridTitipanRef?.getSelectedRecords() || [];
                                if (currentDaftarBarang.length > 0) {
                                    gridTitipanRef?.startEdit();
                                }
                            }}
                        >
                            <ColumnsDirective>
                                <ColumnDirective field="id_ttp" type="number" isPrimaryKey={true} headerText="No." headerTextAlign="Center" textAlign="Center" width="30" />

                                <ColumnDirective
                                    field="no_fj"
                                    isPrimaryKey={true}
                                    headerText="No. Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Left"
                                    width="150"
                                    editTemplate={editTemplateNoFjTitipan}
                                />
                                <ColumnDirective isPrimaryKey={true} format="N2" field="netto_mu" headerText="Nilai Faktur" headerTextAlign="Center" textAlign="Center" width="120" />
                                <ColumnDirective
                                    field="sisa_mu"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    // headerTemplate={headerNilaiFaktur}
                                    headerText="Sisa yang harus dibayar"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="140"
                                    headerTemplate={headerSisaDibayar}
                                />
                                <ColumnDirective
                                    field="jumlah"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Dibayar Uang Muka"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerDibayarUangMuka}
                                />
                                <ColumnDirective
                                    field="pembulatan"
                                    isPrimaryKey={true}
                                    // headerTemplate={headerSisaNilaiFaktur}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembulatan"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    // editTemplate={EditTemplateSisaNilaiFaktur}
                                />
                                <ColumnDirective
                                    field="dibayar"
                                    isPrimaryKey={true}
                                    format="N2"
                                    // edit={qtyParams}
                                    headerText="Pembayaran Faktur"
                                    headerTextAlign="Center"
                                    textAlign="Right"
                                    width="120"
                                    headerTemplate={headerPembayaranFaktur}
                                />
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
                                                        <ButtonComponent
                                                            id="buAdd1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick1
                                                            cssClass="e-primary e-small"
                                                            iconCss="e-icons e-small e-plus"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                            onClick={() => handleDetailAdd('Titipan')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDelete1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-warning e-small"
                                                            iconCss="e-icons e-small e-trash"
                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                            onClick={() => handleDetailDelete('Titipan')}
                                                        />
                                                        <ButtonComponent
                                                            id="buDeleteAll1"
                                                            type="button" //Solusi tdk refresh halaman saat selesai onClick
                                                            cssClass="e-danger e-small"
                                                            iconCss="e-icons e-small e-erase"
                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                            onClick={handleDetailDeleteAll}
                                                        />
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
                </div>
            </TabComponent>
        </div>
    );
};

export default TemplateDetail;
