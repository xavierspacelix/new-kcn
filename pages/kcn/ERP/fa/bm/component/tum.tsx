import React, { useCallback, useRef } from 'react';
import { ButtonComponent, ChangeEventArgs as ChangeEventArgsButton } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { TabComponent } from '@syncfusion/ej2-react-navigations';
import { frmNumber, generateNU } from '@/utils/routines';
import { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { L10n } from '@syncfusion/ej2-base';
import idIDLocalization from 'public/syncfusion/locale.json';

L10n.load(idIDLocalization);

interface DialogTUMList {
    userid: string;
    kode_entitas: any;
    isOpen: boolean;
    onClose: () => void;
    kode_user: any;
    kode_bm: any;
    statusPage: any;
    selectedRowStatus: any;
    onRefresh: any;
    token: any;
}

const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
let gridDaftarPesanananBarang: Grid | any;

const DialogTUMList: React.FC<DialogTUMList> = ({ userid, kode_entitas, isOpen, onClose, kode_user, kode_bm, statusPage, selectedRowStatus, onRefresh, token }) => {
    // mnoBM
    const [kursHeader, setKursHeader] = useState<any>('');

    const [mNoBM, mSetNoBM] = useState('');
    const [terimaDari, setTerimaDari] = useState('');
    const [keterangan, setKeterangan] = useState('');

    const handleTerima = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTerimaDari(e.target.value);
    };

    const handleKeterangan = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeterangan(e.target.value);
    };

    const handleCreate = async () => {
        const result = await generateNU(kode_entitas, '', '17', moment().format('YYYYMM'));
        if (result) {
            mSetNoBM(result);
        } else {
            console.error('undefined');
        }
    };

    const handleEdit = async () => {
         const response = await axios.get(`${apiUrl}/erp/master_detail_jurnal_debet_pemasukkan_lain_bm?entitas=${kode_entitas}&param1=${kode_bm}&param2=${selectedRowStatus}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const { master, tum } = response.data.data;

        if (master.length > 0) {
            const dataMaster = master[0];
            mSetNoBM(dataMaster.no_dokumen);
            setTerimaDari(dataMaster.subledger);
            setDate2(moment(dataMaster.tgl_dokumen, 'YYYY-MM-DD'));
            setKeterangan(dataMaster.catatan);
            setKursHeader(parseInt(dataMaster.kurs));        
            const formattedJumlah_mu = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
            }).format(dataMaster.jumlah_mu);

            setInputValueJumlah_mu(formattedJumlah_mu);
        }

        if (tum.length > 0) {
            const mappedTUM = tum.map((item: any) => ({
                no_item: item.no_item,
                diskripsi: item.diskripsi,
                satuan: item.satuan,
                qty: item.qty,
                harga_mu: item.harga_mu,
                diskon: item.diskon,
                potongan_mu: item.potongan_mu,
                jumlah_mu: item.jumlah_mu
            }));
            gridDaftarPesanananBarang.dataSource = mappedTUM;
            const totalBayarMu = mappedTUM.reduce((total:any, item:any) => total + item.jumlah_mu, 0);
            setTotalJumlahPesanan(totalBayarMu);
        }
    };

    const fetchData = async () => {
        try {
            if (statusPage === 'CREATE') {
                handleCreate();
            } else if (statusPage === 'EDIT') {
                handleEdit();
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat memuat data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusPage, kode_entitas, kode_user, kode_bm]);

    // ***// END DETAIL BM //***//
    const [date2, setDate2] = useState<any>(moment());

    const dialogClose = () => {
        gridDaftarPesanananBarang.dataSource.splice(0, gridDaftarPesanananBarang.dataSource.length);
        setDate2(moment());
        onClose();
    };

    // handle jumlah mu
    const [inputValueJumlah_mu, setInputValueJumlah_mu] = useState<any>('');
    const [outputWordsJumlah_mu, setOutputWordsJumlah_mu] = useState('');

    function terbilang(a: any) {
        var bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
        var kalimat = '';

        // 1 - 11
        if (a < 12) {
            kalimat = bilangan[a];
        }
        // 12 - 19
        else if (a < 20) {
            kalimat = bilangan[a - 10] + ' Belas';
        }
        // 20 - 99
        else if (a < 100) {
            var utama = a / 10;
            var depan = parseInt(String(utama).substr(0, 1));
            var belakang = a % 10;
            kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang];
        }
        // 100 - 199
        else if (a < 200) {
            kalimat = 'Seratus ' + terbilang(a - 100);
        }
        // 200 - 999
        else if (a < 1000) {
            var utama = a / 100;
            var depan = parseInt(String(utama).substr(0, 1));
            var belakang = a % 100;
            kalimat = bilangan[depan] + ' Ratus ' + terbilang(belakang);
        }
        // 1,000 - 1,999
        else if (a < 2000) {
            kalimat = 'Seribu ' + terbilang(a - 1000);
        }
        // 2,000 - 9,999
        else if (a < 10000) {
            var utama = a / 1000;
            var depan = parseInt(String(utama).substr(0, 1));
            var belakang = a % 1000;
            kalimat = bilangan[depan] + ' Ribu ' + terbilang(belakang);
        }
        // 10,000 - 99,999
        else if (a < 100000) {
            var utama = a / 100;
            var depan = parseInt(String(utama).substr(0, 2));
            var belakang = a % 1000;
            kalimat = terbilang(depan) + ' Ribu ' + terbilang(belakang);
        }
        // 100,000 - 999,999
        else if (a < 1000000) {
            var utama = a / 1000;
            var depan = parseInt(String(utama).substr(0, 3));
            var belakang = a % 1000;
            kalimat = terbilang(depan) + ' Ribu ' + terbilang(belakang);
        }
        // 1,000,000 - 99,999,999
        else if (a < 100000000) {
            var utama = a / 1000000;
            var depan = parseInt(String(utama).substr(0, 4));
            var belakang = a % 1000000;
            kalimat = terbilang(depan) + ' Juta ' + terbilang(belakang);
        } else if (a < 1000000000) {
            var utama = a / 1000000;
            var depan = parseInt(String(utama).substr(0, 4));
            var belakang = a % 1000000;
            kalimat = terbilang(depan) + ' Juta ' + terbilang(belakang);
        } else if (a < 10000000000) {
            var utama = a / 1000000000;
            var depan = parseInt(String(utama).substr(0, 1));
            var belakang = a % 1000000000;
            kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
        } else if (a < 100000000000) {
            var utama = a / 1000000000;
            var depan = parseInt(String(utama).substr(0, 2));
            var belakang = a % 1000000000;
            kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
        } else if (a < 1000000000000) {
            var utama = a / 1000000000;
            var depan = parseInt(String(utama).substr(0, 3));
            var belakang = a % 1000000000;
            kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
        } else if (a < 10000000000000) {
            var utama = a / 10000000000;
            var depan = parseInt(String(utama).substr(0, 1));
            var belakang = a % 10000000000;
            kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
        } else if (a < 100000000000000) {
            var utama = a / 1000000000000;
            var depan = parseInt(String(utama).substr(0, 2));
            var belakang = a % 1000000000000;
            kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
        } else if (a < 1000000000000000) {
            var utama = a / 1000000000000;
            var depan = parseInt(String(utama).substr(0, 3));
            var belakang = a % 1000000000000;
            kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
        } else if (a < 10000000000000000) {
            var utama = a / 1000000000000000;
            var depan = parseInt(String(utama).substr(0, 1));
            var belakang = a % 1000000000000000;
            kalimat = terbilang(depan) + ' Kuadriliun ' + terbilang(belakang);
        }

        var pisah = kalimat.split(' ');
        var full = [];
        for (var i = 0; i < pisah.length; i++) {
            if (pisah[i] != '') {
                full.push(pisah[i]);
            }
        }
        return full.join(' ');
    }

    useEffect(() => {
        if (statusPage === 'EDIT') {
            if (inputValueJumlah_mu) {
                const number = parseInt(formatNumber(inputValueJumlah_mu), 10);
                const words = terbilang(number);
                setOutputWordsJumlah_mu(`** ${words} **`);
            } else {
                setOutputWordsJumlah_mu('Masukkan angka yang valid');
            }
        }
    }, [inputValueJumlah_mu]);

    // kalkulasi barang
    const [totalJumlahPesanan, setTotalJumlahPesanan] = useState<any>(0);

    const formatNumber = (numString: string) => {
        return numString.replace(/,/g, '').split('.')[0];
    };

    return (
        <DialogComponent
            id="dialogTUMList"
            isModal={true}
            width="68%"
            height="69%"
            visible={isOpen}
            close={() => {
                dialogClose();
            }}
            header={`Terima Uang Muka (Detail) : ${kode_bm}`}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
        >
            <div style={{ minWidth: '70%', overflow: 'auto' }}>
                <div>
                    <div>
                        {/* ===============  Master Header Data ========================   */}
                        <div className="mb-1">
                            {/* 'KODE BM' : {kode_bm} */}
                            <div className="panel-tabel" style={{ width: '100%' }}>
                                <div className="mt-1 flex">
                                    <div style={{ width: '400px' }}>
                                        <div className="mt-1 flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '22%', textAlign: 'right', marginRight: 6 }}>Tanggal </label>
                                            <div className="form-input flex justify-between" style={{ borderRadius: 2, width: '140px', height: '35px' }}>
                                                <DatePickerComponent
                                                    locale="id"
                                                    readOnly
                                                    cssClass="e-custom-style"
                                                    placeholder="Tgl. PP"
                                                    showClearButton={false}
                                                    format="dd-MM-yyyy"
                                                    value={date2.toDate()}
                                                    change={(args: ChangeEventArgsCalendar) => {
                                                        if (args.value) {
                                                            const selectedDate = moment(args.value);
                                                            selectedDate.set({
                                                                hour: moment().hour(),
                                                                minute: moment().minute(),
                                                                second: moment().second(),
                                                            });
                                                            setDate2(selectedDate);
                                                        } else {
                                                            setDate2(moment());
                                                        }
                                                    }}
                                                >
                                                    <Inject services={[MaskedDateTime]} />
                                                </DatePickerComponent>
                                            </div>
                                        </div>

                                        {/* No. Bukti */}
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '22%', textAlign: 'right', marginRight: 6, marginTop: 8 }}>No. Bukti</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ width: '140px', background: '#eeeeee', fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                disabled={true}
                                                value={mNoBM}
                                                readOnly
                                            ></input>
                                        </div>

                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '119px', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Terima Dari</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                value={terimaDari}
                                                readOnly
                                                onChange={handleTerima}
                                            ></input>
                                        </div>
                                        <div className="mb-3 flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '119px', textAlign: 'right', marginRight: 6, marginTop: 8 }}>Keterangan</label>
                                            <input
                                                className={`container form-input`}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', borderRadius: 2 }}
                                                value={keterangan}
                                                readOnly
                                                onChange={handleKeterangan}
                                            ></input>
                                        </div>
                                        <div style={{ marginLeft: 10, color: 'darkgreen', fontWeight: 'bold' }}>{outputWordsJumlah_mu}</div>
                                    </div>

                                    {/* ///////// */}
                                    {/* SALDO KAS */}
                                    {/* ///////// */}

                                    <div style={{ width: '200px', marginTop: 100, marginLeft: 30, marginRight: 30 }}>
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '73px', textAlign: 'right', marginRight: 6 }}>Kurs</label>
                                            <div>
                                                <input
                                                    className={`container form-input`}
                                                    style={{
                                                        background: '#eeeeee',
                                                        fontSize: 11,
                                                        marginTop: 4,
                                                        marginLeft: 0,
                                                        borderColor: '#bfc9d4',
                                                        width: '80%',
                                                        borderRadius: 2,
                                                        textAlign: 'right',
                                                    }}
                                                    disabled={true}
                                                    value={kursHeader}
                                                    readOnly
                                                ></input>
                                                <span style={{ fontSize: 11, fontWeight: 'bold', marginLeft: 4 }}>IDR</span>
                                            </div>
                                        </div>
                                        <div className="flex" style={{ alignItems: 'center' }}>
                                            <label style={{ width: '65px', textAlign: 'right', marginRight: 6 }}>Jumlah (MU)</label>
                                            <input
                                                readOnly
                                                className={`container form-input`}
                                                value={inputValueJumlah_mu}
                                                style={{ fontSize: 11, marginTop: 4, marginLeft: 0, borderColor: '#bfc9d4', width: '80%', borderRadius: 2, textAlign: 'right' }}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ===============  Detail Data ========================   */}
                        <div
                            className="panel-tab"
                            style={{
                                background: '#f0f0f0',
                                width: '100%',
                                marginTop: 10,
                                borderRadius: 10,
                            }}
                        >
                            <TabComponent selectedItem={0} animation={{ previous: { effect: 'None' }, next: { effect: 'None' } }}>
                                <div className="e-tab-header" style={{ display: 'flex' }}>
                                    <div tabIndex={0} style={{ marginTop: 1, fontSize: '12px', fontWeight: 'bold', padding: '10px 10px', cursor: 'pointer', borderBottom: '3px solid transparent' }}>
                                        Data Pesanan Barang
                                    </div>
                                </div>

                                {/*===================== Content menampilkan alokasi dana =======================*/}
                                <div className="e-content">
                                    {/* //Daftar Pesanan Barang */}
                                    <div tabIndex={0} style={{ width: '100%', height: '320px', marginTop: '5px', padding: 10 }}>
                                        <TooltipComponent openDelay={1000} target=".e-headertext">
                                            <GridComponent
                                                id="gridDaftarPesanananBarang"
                                                name="gridDaftarPesanananBarang"
                                                className="gridDaftarPesanananBarang"
                                                locale="id"
                                                ref={(g) => (gridDaftarPesanananBarang = g)}
                                                selectionSettings={{ mode: 'Row', type: 'Single' }}
                                                allowResizing={true}
                                                autoFit={true}
                                                rowHeight={22}
                                                height={205}
                                                gridLines={'Both'}
                                                created={() => {}}
                                                allowKeyboard={false}
                                            >
                                                <ColumnsDirective>
                                                    <ColumnDirective
                                                        field="no_item"
                                                        headerText="No. Barang"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="diskripsi"
                                                        headerText="Nama Barang"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="220"
                                                        clipMode="EllipsisWithTooltip"
                                                    />
                                                    <ColumnDirective
                                                        field="satuan"
                                                        headerText="Satuan"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="65"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                    />
                                                    <ColumnDirective
                                                        field="qty"
                                                        headerText="Kuantitas"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="65"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                    />
                                                    <ColumnDirective
                                                        field="harga_mu"
                                                        headerText="Harga"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        template={(props: any) => {
                                                            return <span>{props.harga_mu ? parseFloat(props.harga_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                        }}
                                                    />
                                                    <ColumnDirective
                                                        field="diskon"
                                                        headerText="diskon"
                                                        headerTextAlign="Center"
                                                        textAlign="Center"
                                                        width="60"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                    />
                                                    <ColumnDirective
                                                        field="potongan_mu"
                                                        headerText="potongan"
                                                        headerTextAlign="Center"
                                                        textAlign="Right"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        template={(props: any) => {
                                                            return <span>{props.potongan_mu ? parseFloat(props.potongan_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                        }}
                                                    />
                                                    <ColumnDirective
                                                        field="jumlah_mu"
                                                        headerText="jumlah"
                                                        headerTextAlign="Center"
                                                        textAlign="Left"
                                                        width="150"
                                                        clipMode="EllipsisWithTooltip"
                                                        allowEditing={false}
                                                        template={(props: any) => {
                                                            return <span>{props.jumlah_mu ? parseFloat(props.jumlah_mu).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}</span>;
                                                        }}
                                                    />
                                                </ColumnsDirective>

                                                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                                            </GridComponent>
                                        </TooltipComponent>
                                        <div style={{ paddingTop: 8 }}>
                                            <TooltipComponent content="Baru" opensOn="Hover" openDelay={1000} target="#buAdd1">
                                                <TooltipComponent content="Edit" opensOn="Hover" openDelay={1000} target="#buEdit1">
                                                    <TooltipComponent content="Hapus" opensOn="Hover" openDelay={1000} target="#buDelete1">
                                                        <TooltipComponent content="Bersihkan" opensOn="Hover" openDelay={1000} target="#buDeleteAll1">
                                                            <TooltipComponent content="Simpan" opensOn="Hover" openDelay={1000} target="#buPost1">
                                                                <TooltipComponent content="Batal" opensOn="Hover" openDelay={1000} target="#buCancel1">
                                                                    <div className="mt-1 flex">
                                                                        {/* <ButtonComponent
                                                                            id="buAdd1"
                                                                            type="button"
                                                                            cssClass="e-primary e-small"
                                                                            iconCss="e-icons e-small e-plus"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em', backgroundColor: '#3b3f5c' }}
                                                                           
                                                                        />
                                                                        <ButtonComponent
                                                                            id="buDelete1"
                                                                            type="button"
                                                                            cssClass="e-warning e-small"
                                                                            iconCss="e-icons e-small e-trash"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                                            onClick={() => {
                                                                            
                                                                            }}
                                                                        />
                                                                        <ButtonComponent
                                                                            id="buDeleteAll1"
                                                                            type="button"
                                                                            cssClass="e-danger e-small"
                                                                            iconCss="e-icons e-small e-erase"
                                                                            style={{ marginTop: 0 + 'em', marginRight: 1.5 + 'em' }}
                                                                            onClick={() => {
                                                                                
                                                                            }}
                                                                        /> */}
                                                                    </div>
                                                                    <div style={{ float: 'right', marginTop: -5 }}>
                                                                        <div style={{ marginBottom: '10px' }}>
                                                                            <div style={{ display: 'inline-block', marginRight: '10px', fontSize: '11px' }}>
                                                                                <b>Total Pesananan :</b>
                                                                            </div>
                                                                            <div style={{ display: 'inline-block', fontSize: '11px', marginRight: '10px' }}>
                                                                                <b>{frmNumber(totalJumlahPesanan)}</b>
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
                                </div>
                            </TabComponent>
                        </div>
                    </div>
                </div>

                {/* TOMBOL ACTION DOKUMEN */}
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
                        style={{ float: 'right', width: '90px', marginTop: 1 + 'em', marginRight: 1 + 'em', backgroundColor: '#3b3f5c' }}
                        onClick={dialogClose}
                    />
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogTUMList;
