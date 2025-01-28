import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { DetailNoFakturPpi } from '../model/apiPpi';
import { UpdateStatusCustomerNonAktif } from '@/utils/routines';
import stylesPpi from '../ppilist.module.css';
import { loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import { GetNonAktifCust, GetSetting } from '../../posting-ttp/model/api';
import { swalDialog } from '../../posting-ttp/interface/template';
import { UpdateCustBl, UpdateCustBl60 } from '../../posting-ttp/functional/fungsiForm';

interface DialogDaftarCustProps {
    visible: boolean;
    stateDataHeader: any;
    // buttonDaftarSupplier: any;
    // gridDaftarCust: any;
    setStateDataHeader: any;
    filteredDataCust: any;
    dataDaftarCust: any;
    HandleSearchNoCustomer: any;
    HandleSearchNamaCustomer: any;
    // handleClickDaftarSupplier: any;
    // handleClickDaftarSupplierJurnal: any;
    swalToast: any;
    setFilteredDataCust: Function;
    stateDataDetail: any;
    setDataDetailNoFakturPpi: Function;
    kode_entitas: any;
    setDataBarang: Function;
    setStateDataFooter: Function;
    setStateDataDetail: Function;
    setDataJurnal: Function;
    vToken: any;
    gridPpiListRef: any;
}

const DialogDaftarCust: React.FC<DialogDaftarCustProps> = ({
    visible,
    stateDataHeader,
    // buttonDaftarCust,
    // gridDaftarCust,
    setStateDataHeader,
    filteredDataCust,
    dataDaftarCust,
    HandleSearchNoCustomer,
    HandleSearchNamaCustomer,
    // handleClickDaftarSupplier,
    // handleClickDaftarSupplierJurnal,
    swalToast,
    setFilteredDataCust,
    stateDataDetail,
    setDataDetailNoFakturPpi,
    kode_entitas,
    setDataBarang,
    setStateDataFooter,
    setStateDataDetail,
    setDataJurnal,
    vToken,
    gridPpiListRef,
}) => {
    let dialogDaftarCust: Dialog | any;
    let buttonDaftarCust: ButtonPropsModel[];
    let currentDaftarCust: any[] = [];
    let gridDaftarCust: Grid | any;
    buttonDaftarCust = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarCust = gridDaftarCust.getSelectedRecords();
                if (currentDaftarCust.length > 0) {
                    if (stateDataHeader?.tipeCustDialogVisible === 'header') {
                        handleClickDaftarCustomer(currentDaftarCust[0]);
                    } else if (stateDataHeader?.tipeCustDialogVisible === 'akunSubledger') {
                        handleClickDaftarCustomerJurnal(currentDaftarCust[0]);
                    }
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        dialogDaftarCustVisible: false,
                        pilihAkunKredit: true,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data customer</p>',
                        width: '100%',
                        target: '#dialogDaftarCust',
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                //iconCss: 'e-icons e-close',
                cssClass: 'e-primary e-small',
                // isPrimary: true,
            },
            isFlat: false,
            click: () => {
                handleHapusRow();
            },
        },
    ];

    const handleClickDaftarCustomer = async (data: any) => {
        let vPjk, vKodeDokumen, vMu;
        console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq = ', data);
        const paramObject = {
            kode_entitas: kode_entitas,
            // no_ttp: listStateData.noTtp,
            token: vToken,
            kode_cust: data.kode_cust,
            // kode_sales: listStateData.kodeSales,
            // kode_dokumen: listStateData.kodeDokumen,
        };

        // Cek Umur Faktur dan Warkat
        const respSetting = await GetSetting(paramObject);
        const respNonAktifCust = await GetNonAktifCust(paramObject);
        const paramObjectBl = {
            hari_blacklist: respSetting[0].hari_blacklist,
            kode_termin: respNonAktifCust[0].kode_termin,
            kode_cust: data.kode_cust,
            entitas: kode_entitas,
            hari_nonaktif: respSetting[0].hari_nonaktif,
        };

        if (respSetting[0].hari_blacklist > 0 && (respNonAktifCust[0].od_faktur > respSetting[0].hari_blacklist || respNonAktifCust[0].od_warkat > respSetting[0].hari_blacklist)) {
            const style = document.createElement('style');
            style.innerHTML = `
                .swal2-popup .btn {
                    margin-left: 10px;
                    }
    
                .swal2-confirm, .swal2-cancel {
                    width: 70px;  /* Atur ukuran lebar yang sama */
                    height: 33px;  /* Atur ukuran tinggi yang sama */
                    font-size: 14px;  /* Sesuaikan ukuran font */
                }
                `;
            document.head.appendChild(style);

            await withReactContent(swalDialog)
                .fire({
                    title: `
            <div style="text-align: left; font-size:12px;margin-top: -35px;margin-bottom: -23px;">
                <span>Terdapat faktur atau warkat tagihan melebihi ${respSetting[0].hari_blacklist} hari dari tgl. terima.</span><br>
                <span>Kebijakan perusahaan customer diklasifikasikan "G" (Blacklist).</span>
            </div>
        `,
                    width: '22%',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                    showCancelButton: false, // Menampilkan tombol cancel
                    target: '#dialogPhuList',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const respUpdateCustBl = await UpdateCustBl(paramObjectBl, vToken);
                    }
                });
        } else if (respSetting[0].hari_nonaktif > 0 && (respNonAktifCust[0].od > respSetting[0].hari_nonaktif || respNonAktifCust[0].od_warkat > respSetting[0].hari_nonaktif)) {
            const style = document.createElement('style');
            style.innerHTML = `
                .swal2-popup .btn {
                    margin-left: 10px;
                    }
    
                .swal2-confirm, .swal2-cancel {
                    width: 70px;  /* Atur ukuran lebar yang sama */
                    height: 33px;  /* Atur ukuran tinggi yang sama */
                    font-size: 14px;  /* Sesuaikan ukuran font */
                }
                `;
            document.head.appendChild(style);

            await withReactContent(swalDialog)
                .fire({
                    title: `
            <div style="text-align: left; font-size:12px;margin-top: -35px;margin-bottom: -23px;">
                <span>Terdapat faktur tagihan melebihi ${respSetting[0].hari_nonaktif} hari.</span><br>
                <span>Kebijakan perusahaan sementara customer akan dinon aktifkan.</span>
            </div>
        `,
                    width: '22%',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel', // Menambahkan teks tombol cancel
                    showCancelButton: false, // Menampilkan tombol cancel
                    target: '#dialogPhuList',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const respUpdateCustBl60 = await UpdateCustBl60(paramObjectBl, vToken);
                    }
                });
        }

        if (stateDataDetail.isChecboxPelunasanPajak === false) {
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                vPjk: 'N',
                vKodeDokumen: 'BARU',
                vMu: 'IDR',
            }));
            (vPjk = 'N'), (vKodeDokumen = 'Baru'), (vMu = 'IDR');
        } else {
            await setStateDataHeader((prevState: any) => ({
                ...prevState,
                vPjk: 'Y',
                vKodeDokumen: 'all',
                vMu: '',
            }));
            (vPjk = 'Y'), (vKodeDokumen = 'all'), (vMu = '');
        }
        const resultDetailNoFakturPpi: any[] = await DetailNoFakturPpi(vToken, kode_entitas, data.kode_cust);
        await setDataDetailNoFakturPpi(resultDetailNoFakturPpi);

        let totPiutang: any;
        let sisaPiutang: any;
        let totPenerimaan: any;
        // // Menghitung total hutang dari field faktur
        // resultDetailNoFakturPhu.forEach((item: any) => {
        //     totHutang += parseFloat(item.faktur);
        // });

        const custNonAktif: any = await UpdateStatusCustomerNonAktif(kode_entitas, data.kode_cust);
        // if (custNonAktif === 'false') {
        Promise.all(
            resultDetailNoFakturPpi.map((item: any) => {
                return {
                    id: stateDataDetail.idDokumen + 1,
                    kode_dokumen: item.kode_dokumen,
                    id_dokumen: item.id_dokumen,
                    kode_fj: item.kode_fj,
                    no_fj: item.no_fj,
                    tgl_fj: item.tgl_fj,
                    JT: item.JT,
                    hari2: item.hari2,
                    netto_mu: parseFloat(item.netto_mu),
                    kode_mu: item.kode_mu,
                    total_pajak_rp: parseFloat(item.total_pajak_rp),
                    lunas_pajak: item.lunas_pajak,
                    lunas_mu: item.lunas_mu,
                    owing: parseFloat(item.owing),
                    pajak: item.pajak,
                    cetak_tunai: item.cetak_tunai,
                    bayar_mu: 0,
                    sisa_faktur2: parseFloat(item.owing) - 0,

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
            const filteredNewData = newData.filter((data: any) => data !== null); // Filter newData yang tidak memiliki no_barang yang sudah ada di state.nodes
            const newNodes = [...filteredNewData.filter((data: any) => data !== null)];
            setDataBarang((state: any) => {
                // const existingNodes = state.nodes.filter((node: any) => node.no_sj === dataItem[0].no_dok);
                const filteredNewData = newData.filter((data: any) => data !== null); // Filter newData yang tidak memiliki no_barang yang sudah ada di state.nodes
                const newNodes = [...filteredNewData.filter((data: any) => data !== null)];
                totPiutang = newData.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.owing);
                }, 0);
                sisaPiutang = newData.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.sisa_faktur2);
                }, 0);
                totPenerimaan = newData.reduce((acc: number, node: any) => {
                    return acc + parseFloat(node.bayar_mu);
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
            totalPiutang: 0,
            sisaPiutang: 0,
            totalPenerimaan: 0,
            selisihAlokasiDana: 0,
        }));

        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            noCustomerValue: data.no_cust,
            namaCustomerValue: data.nama_relasi,
            alamatValue: data.alamat,
            kursValue: data.kurs,
            kodeCustomerValue: data.kode_cust,
            catatanValue: data.catatan,
            pelunasanPajak: false,
            kodeAkunHutang: data.kode_akun_piutang,
            noHutang: data.no_akun_piutang,
            namaHutang: data.nama_akun_piutang,
            tipeHutang: data.tipe,

            no_salesValue: data.no_sales,
            nama_salesValue: data.nama_sales,
            kode_salesValue: data.kode_sales,
        }));

        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            jumlahFaktur: resultDetailNoFakturPpi.length,
        }));

        await setStateDataFooter((prevState: any) => ({
            ...prevState,
            totalPiutang: totPiutang,
            sisaPiutang: sisaPiutang,
            totalPenerimaan: totPenerimaan,
            // selisihAlokasiDana: 0 - totPenerimaan,
            selisihAlokasiDana: stateDataHeader?.jumlahBayar === '' ? 0 - totPenerimaan : stateDataHeader?.jumlahBayar - totPenerimaan,
        }));
        // }
    };

    const handleClickDaftarCustomerJurnal = (data: any) => {
        console.log('data = ', data);

        setDataJurnal((state: any) => {
            const newNodes = state.nodes.map((node: any) => {
                if (node.id === stateDataDetail.rowsIdJurnal) {
                    return {
                        ...node,
                        subledger: data.subledger,
                        kode_subledger: data.kode_cust,
                        no_subledger: data.no_cust,
                        nama_subledger: data.nama_relasi,
                    };
                } else {
                    return node;
                }
            });
            return {
                nodes: newNodes,
            };
        });
    };

    const handleHapusRow = async () => {
        await setDataJurnal((state: any) => {
            const updatedNodes = state.nodes.filter((node: any) => node.no_akun !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarCustVisible: false,
        }));
    };

    const handleHapusRowCloseGrid = async () => {
        await setDataJurnal((state: any) => {
            const updatedNodes = state.nodes.filter((node: any) => node.no_akun !== '');
            return {
                ...state,
                nodes: updatedNodes,
            };
        });
        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            dialogDaftarCustVisible: false,
            searchNoCust: '',
            searchNamaCust: '',
            searchKeywordNamaCust: '',
            searchKeywordNoCust: '',
        }));
    };

    const rowDataBoundListData = (args: any) => {
        if (args.row) {
            console.log('args = ', getValue('status_warna', args.data));
            if (getValue('status_warna', args.data) == 'BlackList-G') {
                args.row.style.background = 'red';
            } else if (getValue('status_warna', args.data) == 'Tidak Digarap') {
                args.row.style.background = '#f5800a';
            } else if (getValue('status_warna', args.data) == 'Non Aktif') {
                args.row.style.background = '#c0c0c0';
            } else if (getValue('status_warna', args.data) == 'NOO') {
                args.row.style.background = '#00ff80';
            } else if (getValue('status_warna', args.data) == 'Batal NOO') {
                args.row.style.background = '#ff8080';
            } else {
                args.row.style.background = 'white';
            }
        }
    };

    return (
        <DialogComponent
            id="dialogDaftarCust"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={() => {
                return (
                    <div>
                        <div className="header-title" style={{ width: '93%' }}>
                            Daftar Customer
                        </div>
                    </div>
                );
            }}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="84%"
            height="68%"
            buttons={buttonDaftarCust}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarCust.clearSelection();
                handleHapusRowCloseGrid();
                const searchNoCust = document.getElementById('searchNoCust') as HTMLInputElement;
                if (searchNoCust) {
                    searchNoCust.value = '';
                }
                const searchNamaCust = document.getElementById('searchNamaCust') as HTMLInputElement;
                if (searchNamaCust) {
                    searchNamaCust.value = '';
                }
                if (stateDataHeader?.searchNoCust != '' || stateDataHeader?.searchNamaCust != '') {
                    gridDaftarCust.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFilterOpen === 'Input') {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoCust: stateDataHeader?.searchNoCust,
                        searchNamaCust: stateDataHeader?.searchNamaCust,
                    }));
                } else {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoCust: '',
                        searchNamaCust: '',
                    }));
                    const searchNoCust = document.getElementById('searchNoCust') as HTMLInputElement;
                    if (searchNoCust) {
                        searchNoCust.value = '';
                    }
                    const searchNamaCust = document.getElementById('searchNamaCust') as HTMLInputElement;
                    if (searchNamaCust) {
                        searchNamaCust.value = '';
                    }
                }

                if (stateDataHeader?.tipeFocusOpen === 'noCust') {
                    setTimeout(function () {
                        document.getElementById('searchNoCust')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaCust')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoCust"
                    name="searchNoCust"
                    className="searchNoCust"
                    placeholder="<No. Customer>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoCust}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoCustomer(value, setStateDataHeader, setFilteredDataCust, dataDaftarCust);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaCust"
                    name="searchNamaCust"
                    className="searchNamaCust"
                    placeholder="<Nama Customer>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNamaCust}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaCustomer(value, setStateDataHeader, setFilteredDataCust, dataDaftarCust);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarCustomer"
                locale="id"
                ref={(g) => (gridDaftarCust = g)}
                dataSource={stateDataHeader?.searchKeywordNoCust !== '' || stateDataHeader?.searchKeywordNamaCust !== '' ? filteredDataCust : dataDaftarCust}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarCust) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarCust.selectRow(rowIndex);
                        // const currentDaftarCust = gridDaftarCust.getSelectedRecords();
                        const currentDaftarCust = args.rowData;
                        if (currentDaftarCust) {
                            if (stateDataHeader?.tipeCustDialogVisible === 'header') {
                                handleClickDaftarCustomer(currentDaftarCust);
                                setStateDataHeader((prevState: any) => ({
                                    ...prevState,
                                    dialogDaftarCustVisible: false,
                                    pilihAkunKredit: true,
                                }));
                            } else if (stateDataHeader?.tipeCustDialogVisible === 'subledger') {
                                handleClickDaftarCustomerJurnal(currentDaftarCust);
                                setStateDataHeader((prevState: any) => ({
                                    ...prevState,
                                    dialogDaftarCustVisible: false,
                                    pilihAkunKredit: true,
                                }));
                            }
                        } else {
                            swalToast().fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data Customer</p>',
                                width: '100%',
                                target: '#dialogDaftarCust',
                            });
                        }
                    }
                }}
                rowDataBound={rowDataBoundListData}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_cust" headerText="No. Customer" headerTextAlign="Center" textAlign="Left" width="10" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="25" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="alamat" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="40" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_sales" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="15" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="status_warna" headerText="Info Detail" headerTextAlign="Center" textAlign="Left" width="10" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
            <div className="mt-4 flex items-center justify-between">
                <div className={stylesPpi['custom-box-wrapper']}>
                    <div className={stylesPpi['custom-box-aktif']}></div>
                    <div className={stylesPpi['box-text']}>Aktif</div>
                    <div className={stylesPpi['custom-box-non-aktif']}></div>
                    <div className={stylesPpi['box-text']}>Non Aktif</div>
                    <div className={stylesPpi['custom-box-bl']}></div>
                    <div className={stylesPpi['box-text']}>BlackList-G</div>
                    <div className={stylesPpi['custom-box-noo']}></div>
                    <div className={stylesPpi['box-text']}>New Open Outlet</div>
                    <div className={stylesPpi['custom-box-batal-noo']}></div>
                    <div className={stylesPpi['box-text']}>Batal NOO</div>
                    <div className={stylesPpi['custom-box-tidak-digarap']}></div>
                    <div className={stylesPpi['box-text']}>Tidak Digarap</div>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogDaftarCust;
