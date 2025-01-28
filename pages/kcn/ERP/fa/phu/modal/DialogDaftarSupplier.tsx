import React from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { DetailNoFakturPhu } from '../model/apiPhu';

interface DialogDaftarSupplierProps {
    visible: boolean;
    stateDataHeader: any;
    setStateDataHeader: any;
    filteredDataSupplier: any;
    dataDaftarSupplier: any;
    HandleSearchNoSupplier: any;
    HandleSearchNamaSupplier: any;
    swalToast: any;
    setFilteredDataSupplier: Function;
    stateDataDetail: any;
    setDataDetailNoFakturPhu: Function;
    kode_entitas: any;
    setDataBarang: Function;
    setStateDataFooter: Function;
    setStateDataDetail: Function;
    setDataJurnal: Function;
    dataBarang: any;
    editDataBarang: any;
    masterDataState: any;
    gridJurnalListRef: any;
}

const DialogDaftarSupplier: React.FC<DialogDaftarSupplierProps> = ({
    visible,
    stateDataHeader,
    setStateDataHeader,
    filteredDataSupplier,
    dataDaftarSupplier,
    HandleSearchNoSupplier,
    HandleSearchNamaSupplier,
    swalToast,
    setFilteredDataSupplier,
    stateDataDetail,
    setDataDetailNoFakturPhu,
    kode_entitas,
    setDataBarang,
    setStateDataFooter,
    setStateDataDetail,
    setDataJurnal,
    dataBarang,
    editDataBarang,
    masterDataState,
    gridJurnalListRef,
}) => {
    let dialogDaftarSupplier: Dialog | any;
    let buttonDaftarSupplier: ButtonPropsModel[];
    let currentDaftarSupplier: any[] = [];
    let gridDaftarSupplier: Grid | any;
    buttonDaftarSupplier = [
        {
            buttonModel: {
                content: 'Pilih',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarSupplier = gridDaftarSupplier.getSelectedRecords();
                if (currentDaftarSupplier.length > 0) {
                    if (stateDataHeader?.tipeSupplierDialogVisible === 'header') {
                        handleClickDaftarSupplier(currentDaftarSupplier);
                    } else if (stateDataHeader?.tipeSupplierDialogVisible === 'akunSubledger') {
                        handleClickDaftarSupplierJurnal(currentDaftarSupplier);
                    }
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        dialogDaftarSupplierVisible: false,
                        pilihAkunKredit: true,
                    }));
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data supplier</p>',
                        width: '100%',
                        target: '#dialogDaftarSupplier',
                    });
                }
            },
        },
        {
            buttonModel: {
                content: 'Batal',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                handleHapusRow();
            },
        },
    ];

    const handleClickDaftarSupplier = async (data: any) => {
        let vPjk, vKodeDokumen, vMu;
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
        const resultDetailNoFakturPhu: any[] = await DetailNoFakturPhu(kode_entitas, data[0].kode_supp, vKodeDokumen, vPjk, vMu);
        await setDataDetailNoFakturPhu(resultDetailNoFakturPhu);

        let totHutang: any;
        let sisaHutang: any;
        let totPembayaran: any;

        Promise.all(
            resultDetailNoFakturPhu.map((item: any) => {
                return {
                    id: stateDataDetail.idDokumen + 1,
                    kode_dokumen: item.kode_dokumen,
                    id_dokumen: item.id_dokumen,
                    kode_fb: item.kode_fb,
                    bayar_mu: item.bayar_mu,
                    pajak: item.pajak,
                    pay: item.pay,
                    bayar: item.bayar,
                    byr: item.byr,
                    no_fb: item.no_fb,
                    tgl_fb: item.tgl_fb,
                    total_hutang: item.total_hutang,
                    sisa_hutang: item.sisa_hutang,
                    owing: item.owing,
                    faktur: item.faktur,
                    lunas_mu: item.lunas_mu,
                    tot_pajak: item.tot_pajak,
                    lunas_pajak: item.lunas_pajak,
                    tgl_jt: item.tgl_jt,
                    hari: item.hari,
                    no_sj: item.no_sj,
                    no_vch: item.no_vch,
                    no_inv: item.no_inv,
                    sisa: item.sisa_hutang,
                    jumlah_pembayaran: 0,
                };
            })
        ).then((newData) => {
            setDataBarang((state: any) => {
                let combineData: any;
                const filterDataBarang = editDataBarang.nodes.filter((data: any) => parseFloat(data.jumlah_pembayaran) !== 0);
                // const existingNodes = state.nodes.filter((node: any) => node.no_sj === dataItem[0].no_dok);
                const filteredNewData = newData.filter((data: any) => data !== null); // Filter newData yang tidak memiliki no_barang yang sudah ada di state.nodes
                if (masterDataState === 'BARU') {
                    combineData = [...filteredNewData.filter((data: any) => data !== null)];
                    totHutang = dataBarang.nodes.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.sisa_hutang);
                    }, 0);
                    sisaHutang = dataBarang.nodes.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.sisa);
                    }, 0);
                    totPembayaran = filterDataBarang.reduce((acc: number, node: any) => {
                        return acc + parseFloat(node.jumlah_pembayaran);
                    }, 0);
                    return { ...state, nodes: combineData }; // Memperbarui nodes dengan data yang diperbarui
                } else {
                    combineData = [...filteredNewData.filter((data: any) => data !== null), ...filterDataBarang];
                    // Hilangkan duplikasi berdasarkan no_fb dan pilih item dengan jumlah_pembayaran tidak nol jika ada duplikasi
                    const uniqueNodes = combineData.reduce((acc: any, current: any) => {
                        const existingItemIndex = acc.findIndex((item: any) => item.no_fb === current.no_fb); // Temukan item yang sudah ada di accumulator dengan no_fb yang sama
                        if (existingItemIndex === -1) {
                            return acc.concat([current]); // Jika item belum ada di accumulator, tambahkan item tersebut
                        } else {
                            const existingItem = acc[existingItemIndex]; // Jika item sudah ada, pilih item yang jumlah_pembayaran-nya tidak nol
                            if (parseFloat(current.jumlah_pembayaran) !== 0) {
                                acc[existingItemIndex] = current; // Update item di accumulator jika current item memiliki jumlah_pembayaran tidak nol
                            }
                            return acc; // Jika existingItem sudah memiliki jumlah_pembayaran tidak nol, jangan ganti
                        }
                    }, []);
                    return { ...state, nodes: uniqueNodes }; // Memperbarui nodes dengan data yang diperbarui
                }
            });
        });

        await setStateDataHeader((prevState: any) => ({
            ...prevState,
            noSupplierValue: data[0].no_supp,
            namaSupplierValue: data[0].nama_relasi,
            kursValue: data[0].kurs,
            kodeSupplierValue: data[0].kode_supp,
            pelunasanPajak: true,
            kodeAkunHutang: data[0].kode_akun_hutang,
            noHutang: data[0].no_hutang,
            namaHutang: data[0].nama_hutang,
            tipeHutang: data[0].tipe_hutang,
        }));

        await setStateDataDetail((prevState: any) => ({
            ...prevState,
            jumlahFaktur: resultDetailNoFakturPhu.length,
        }));

        if (masterDataState === 'BARU') {
            await setStateDataFooter((prevState: any) => ({
                ...prevState,
                totalPembayaran: 0, // totPembayaran
                totalHutang: 0, // totHutang
                sisaHutang: 0, //sisaHutang
                selisihAlokasiDana: stateDataHeader?.jumlahBayar - totPembayaran,
            }));
        }

        await setDataJurnal((prevState: any) => ({
            ...prevState,
            nodes: [],
        }));
    };

    const handleClickDaftarSupplierJurnal = (data: any) => {
        if (gridJurnalListRef && Array.isArray(gridJurnalListRef?.dataSource)) {
            // Salin array untuk menghindari mutasi langsung pada dataSource
            const dataSource = [...gridJurnalListRef?.dataSource];

            // Flag untuk menentukan apakah baris ditemukan
            let isRowUpdated = false;

            // Modifikasi dataSource atau tambahkan baris baru
            const updatedDataSource = dataSource.map((item: any) => {
                if (item.id === stateDataDetail?.rowsIdJurnal) {
                    // Periksa apakah baris dengan id yang dimaksud ada
                    isRowUpdated = true;
                    return {
                        ...item,
                        subledger: data[0].subledger,
                        kode_subledger: data[0].kode_subledger,
                        no_subledger: data[0].no_subledger,
                        nama_subledger: data[0].nama_subledger,
                    };
                } else {
                    return item; // Kembalikan item yang tidak berubah
                }
            });

            // Perbarui dataSource pada grid
            gridJurnalListRef.dataSource = updatedDataSource;

            // Refresh grid jika diperlukan (tergantung library/grid yang digunakan)
            if (gridJurnalListRef?.refresh) {
                gridJurnalListRef?.refresh();
            }
        }

        // setDataJurnal((state: any) => {
        //     const newNodes = state.nodes.map((node: any) => {
        //         if (node.id === stateDataDetail.rowsIdJurnal) {
        //             return {
        //                 ...node,
        //                 subledger: data[0].subledger,
        //                 kode_subledger: data[0].kode_supp,
        //             };
        //         } else {
        //             return node;
        //         }
        //     });
        //     return {
        //         nodes: newNodes,
        //     };
        // });
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
            dialogDaftarSupplierVisible: false,
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
            dialogDaftarSupplierVisible: false,
            searchNoSupplier: '',
            searchNamaSupplier: '',
            searchKeywordNamaSupplier: '',
            searchKeywordNoSupplier: '',
        }));
    };

    return (
        <DialogComponent
            id="dialogDaftarSupplier"
            target="#dialogPhuList"
            style={{ position: 'fixed' }}
            header={() => {
                return (
                    <div>
                        <div className="header-title" style={{ width: '93%' }}>
                            Daftar Supplier
                        </div>
                    </div>
                );
            }}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="40%"
            height="65%"
            buttons={buttonDaftarSupplier}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                gridDaftarSupplier.clearSelection();
                handleHapusRowCloseGrid();
                const searchNoSupplier = document.getElementById('searchNoSupplier') as HTMLInputElement;
                if (searchNoSupplier) {
                    searchNoSupplier.value = '';
                }
                const searchNamaSupplier = document.getElementById('searchNamaSupplier') as HTMLInputElement;
                if (searchNamaSupplier) {
                    searchNamaSupplier.value = '';
                }
                if (stateDataHeader?.searchNoSupplier != '' || stateDataHeader?.searchNamaSupplier != '') {
                    gridDaftarSupplier.dataSource = [];
                }
            }}
            closeOnEscape={true}
            open={(args: any) => {
                if (stateDataHeader?.tipeFilterOpen === 'Input') {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoSupplier: stateDataHeader?.searchNoSupplier,
                        searchNamaSupplier: stateDataHeader?.searchNamaSupplier,
                    }));
                } else {
                    setStateDataHeader((prevState: any) => ({
                        ...prevState,
                        searchNoSupplier: '',
                        searchNamaSupplier: '',
                    }));
                    const searchNoSupplier = document.getElementById('searchNoSupplier') as HTMLInputElement;
                    if (searchNoSupplier) {
                        searchNoSupplier.value = '';
                    }
                    const searchNamaSupplier = document.getElementById('searchNamaSupplier') as HTMLInputElement;
                    if (searchNamaSupplier) {
                        searchNamaSupplier.value = '';
                    }
                }

                if (stateDataHeader?.tipeFocusOpen === 'noSupplier') {
                    setTimeout(function () {
                        document.getElementById('searchNoSupplier')?.focus();
                    }, 100);
                } else {
                    setTimeout(function () {
                        document.getElementById('searchNamaSupplier')?.focus();
                    }, 100);
                }
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoSupplier"
                    name="searchNoSupplier"
                    className="searchNoSupplier"
                    placeholder="<No. Supplier>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNoSupplier}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNoSupplier(value, setStateDataHeader, setFilteredDataSupplier, dataDaftarSupplier);
                    }}
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaSupplier"
                    name="searchNamaSupplier"
                    className="searchNamaSupplier"
                    placeholder="<Nama Supplier>"
                    showClearButton={true}
                    value={stateDataHeader?.searchNamaSupplier}
                    input={(args: any) => {
                        const value: any = args.value;
                        HandleSearchNamaSupplier(value, setStateDataHeader, setFilteredDataSupplier, dataDaftarSupplier);
                    }}
                />
            </div>
            <GridComponent
                id="gridDaftarSupplier"
                locale="id"
                ref={(g) => (gridDaftarSupplier = g)}
                dataSource={stateDataHeader?.searchKeywordNoSupplier !== '' || stateDataHeader?.searchKeywordNamaSupplier !== '' ? filteredDataSupplier : dataDaftarSupplier}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'286'}
                gridLines={'Both'}
                // loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarSupplier) {
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarSupplier.selectRow(rowIndex);
                        const currentDaftarSupplier = gridDaftarSupplier.getSelectedRecords();
                        if (currentDaftarSupplier.length > 0) {
                            if (stateDataHeader?.tipeSupplierDialogVisible === 'header') {
                                handleClickDaftarSupplier(currentDaftarSupplier);
                                setStateDataHeader((prevState: any) => ({
                                    ...prevState,
                                    dialogDaftarSupplierVisible: false,
                                    pilihAkunKredit: true,
                                }));
                            } else if (stateDataHeader?.tipeSupplierDialogVisible === 'akunSubledger') {
                                handleClickDaftarSupplierJurnal(currentDaftarSupplier);
                                setStateDataHeader((prevState: any) => ({
                                    ...prevState,
                                    dialogDaftarSupplierVisible: false,
                                    pilihAkunKredit: true,
                                }));
                            }
                        } else {
                            swalToast().fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data supplier</p>',
                                width: '100%',
                                target: '#dialogDaftarSupplier',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="no_supp" headerText="No. Supplier" headerTextAlign="Center" textAlign="Left" width="50" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" width="20" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="130" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarSupplier;
