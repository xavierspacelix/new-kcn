'use client';
import React, { useEffect, useState } from 'react';
import { Inject, Page, Edit, Resize, Selection, CommandColumn, Toolbar, Grid, GridComponent, ColumnDirective, ColumnsDirective } from '@syncfusion/ej2-react-grids';
import { TextBoxComponent, FocusInEventArgs } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import axios from 'axios';
// export const dynamic = "force-dynamic";

const DialogNoNamaBarang = ({
    dialogNamaNoBarang,
    setDialogNamaNoBarang,
    listDaftarBarang,
    gridPsList,
    rowSelectingbarangPs,
    kode_entitas,
    apiUrl,
    selectedKodeGudang,
    penyesuaianNilai,
    manualPembebanan,
    searchNoItem,
    setSearchNamaItem,
    searchNamaItem,
    setSearchNoItem,
}: {
    dialogNamaNoBarang: any;
    setDialogNamaNoBarang: any;
    listDaftarBarang: any;
    gridPsList: any;
    rowSelectingbarangPs: any;
    kode_entitas: any;
    apiUrl: any;
    selectedKodeGudang: any;
    penyesuaianNilai: any;
    manualPembebanan: any;
    searchNoItem: any;
    setSearchNamaItem: any;
    searchNamaItem: any;
    setSearchNoItem: any;
}) => {
    return (
        <DialogComponent
            id="dialogDaftarCustomer"
            target="#targetModal"
            style={{ position: 'fixed' }}
            header={'Daftar Gudang Utama'}
            visible={dialogNamaNoBarang}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="40%"
            height="60%"
            enableResize={true}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                setDialogNamaNoBarang(false);
            }}
            closeOnEscape={true}
        >
            <div className="h-full w-full">
                <div className="flex">
                    <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
                        <TextBoxComponent
                            id="searchNoItem1"
                            name="searchNoItem1"
                            className="searchNoItem1"
                            placeholder="<No. Akun>"
                            showClearButton={true}
                            value={searchNoItem}
                            input={(args: FocusInEventArgs) => {
                                (document.getElementsByName('searchNamaItem1')[0] as HTMLFormElement).value = '';
                                setSearchNamaItem('');
                                const value: any = args.value;
                                setSearchNoItem(value);
                            }}
                        />
                    </div>
                    <div className="form-input mb-1 mr-1">
                        <TextBoxComponent
                            id="searchNamaItem1"
                            name="searchNamaItem1"
                            className="searchNamaItem1"
                            placeholder="<Nama Akun>"
                            showClearButton={true}
                            value={searchNamaItem}
                            input={(args: FocusInEventArgs) => {
                                (document.getElementsByName('searchNoItem1')[0] as HTMLFormElement).value = '';
                                setSearchNoItem('');
                                const value: any = args.value;
                                setSearchNamaItem(value);
                            }}
                        />
                    </div>
                </div>
                <GridComponent
                    id="gridHasilTimbang"
                    name="gridHasilTimbang"
                    className="gridHasilTimbang"
                    locale="id"
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    allowResizing={true}
                    autoFit={true}
                    rowHeight={22}
                    height={300}
                    dataSource={listDaftarBarang}
                    recordDoubleClick={async (evnet: any) => {
                        const manualValue = manualPembebanan ? 'Manual pembebanan' : null;

                        const [response, stockResponse] = await Promise.all([
                            axios.get(`${apiUrl}/erp/hpp_ps`, {
                                params: {
                                    entitas: kode_entitas,
                                    param1: evnet.rowData.kode_item,
                                    param2: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    param3: selectedKodeGudang,
                                },
                            }),
                            axios.get(`${apiUrl}/erp/qty_stock_all`, {
                                params: {
                                    entitas: kode_entitas,
                                    param1: evnet.rowData.kode_item,
                                    param2: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    param3: selectedKodeGudang,
                                    param4: '',
                                    param5: 'ps',
                                },
                            }),
                        ]);
                        const result = response.data.data;
                        const harga_hpp = result[0]?.hpp || 0;
                        const stockResult = stockResponse.data.data;
                        const kualitasStandarStok = stockResult[0]?.stok || 0;

                        if (gridPsList.current.dataSource && Array.isArray(gridPsList.current.dataSource)) {
                            gridPsList.current.dataSource[rowSelectingbarangPs] = {
                                ...gridPsList.current.dataSource[rowSelectingbarangPs],
                                kode_item: evnet.rowData.kode_item,
                                satuan: evnet.rowData.satuan,
                                qty: null,
                                sat_std: evnet.rowData.satuan,
                                qty_std: null,
                                harga_rp: penyesuaianNilai ? 0 : parseFloat(harga_hpp),
                                jumlah_rp: penyesuaianNilai ? null : null,
                                kode_dept: null,
                                kode_kerja: null,
                                hpp: penyesuaianNilai ? 0 : parseFloat(harga_hpp),
                                no_kontrak: null,
                                no_mbref: null,
                                kode_sumber: null,
                                kode_rps: null,
                                beban: null,
                                catatan: manualValue,
                                no_barang: evnet.rowData.no_item,
                                nama_barang: evnet.rowData.nama_item,
                                kualitas_standar_stok: kualitasStandarStok,
                            };
                            // gridFBMDetail.dataSource[0].gd_utama = "hengdasss";
                            gridPsList.current.refresh();
                            setDialogNamaNoBarang(false);
                        }
                    }}
                    // width={'60%'}
                    gridLines={'Both'}
                >
                    <ColumnsDirective>
                        <ColumnDirective
                            field="no_item"
                            headerText="No Barang"
                            headerTextAlign="Center"
                            textAlign="Left"
                            clipMode="EllipsisWithTooltip"
                            // editTemplate={editTemplateMasterItem_No_Akun}
                        />
                        <ColumnDirective
                            field="nama_item"
                            headerText="Nama Barang"
                            headerTextAlign="Center"
                            textAlign="Left"
                            clipMode="EllipsisWithTooltip"
                            // editTemplate={editTemplateMasterItem_No_Akun}
                        />
                    </ColumnsDirective>

                    <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                </GridComponent>
            </div>
        </DialogComponent>
    );
};

const DialogMutasiBarang = ({
    modalDaftarRefrensiMutasiBarang,
    selectedNamaGudang,
    gridPsList,
    rowSelectingbarangPs,
    setModalDaftarRefrensiMutasiBarang,
    listDaftarRefrensiMutasiBarang,
    gridDaftarRefrensiMutasiBarang,
    itemIndex,
}: {
    listDaftarRefrensiMutasiBarang: any;
    gridDaftarRefrensiMutasiBarang: any;
    modalDaftarRefrensiMutasiBarang: any;
    setModalDaftarRefrensiMutasiBarang: any;
    selectedNamaGudang: any;
    gridPsList: any;
    rowSelectingbarangPs: any;
    itemIndex: any;
}) => {
    return (
        <DialogComponent
            ref={(d) => (gridDaftarRefrensiMutasiBarang = d)}
            target="#targetModal"
            style={{ position: 'fixed' }}
            header={`Daftar MB(IN): ${selectedNamaGudang}`}
            visible={modalDaftarRefrensiMutasiBarang}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="800"
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                setModalDaftarRefrensiMutasiBarang(false);
            }}
            closeOnEscape={true}
        >
            <div className="flex">
                <div className="form-input mb-1 mr-1" style={{ width: '40%' }}></div>
            </div>
            <GridComponent
                locale="daftarMutasiBarang"
                style={{ width: '100%', height: '95%' }}
                dataSource={listDaftarRefrensiMutasiBarang}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                height={'300'}
                recordDoubleClick={(args: any) => {
                    // console.log(args);

                    const updateRefrensiMutasiBarang = {
                        kustom2: args.rowData.kustom2,
                    };
                    if (gridPsList.current.dataSource && Array.isArray(gridPsList.current.dataSource)) {
                        gridPsList.current.dataSource[itemIndex] = {
                            ...gridPsList.current.dataSource[itemIndex],
                            ...updateRefrensiMutasiBarang,
                        };
                        // console.log('aku data: ', gridPsList.current.dataSource);

                        gridPsList.current!.refresh();
                    } else {
                        console.error('Invalid selectedRowIndex:', rowSelectingbarangPs);
                    }
                    setModalDaftarRefrensiMutasiBarang(false);
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="kustom2" headerText="No MB" headerTextAlign="Center" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="kustom3" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="70" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="diskon" headerText="No Kendaraan" headerTextAlign="Left" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="no_item" headerText="No Barang" headerTextAlign="Left" textAlign="Left" width="70" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="nama_item" headerText="Nama Barang" headerTextAlign="Left" textAlign="Left" width="150" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective field="min_qty" headerText="OTD" headerTextAlign="Left" textAlign="Left" width="40" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default function GridBarang({
    barangState,
    gridPsList,
    onEditItem,
    listDaftarBarang,
    penyesuaianNilai,
    kode_entitas,
    selectedKodeGudang,
    manualPembebanan,
    listDaftarRefrensiMutasiBarang,
    selectedNamaGudang,
    gridDaftarRefrensiMutasiBarang,
    setTotalNilaiPersediaan,
    totalNilaiPersediaan,
    searchNoItem,
    setSearchNamaItem,
    searchNamaItem,
    setSearchNoItem,
    kodeItemSelected,
    setKodeItemSelected,
}: {
    barangState: any;
    userId: any;
    gridPsList: any;
    dsJenisVendor: any;
    onEditItem: boolean;
    listDaftarBarang: any;
    penyesuaianNilai: any;
    kode_entitas: any;
    selectedKodeGudang: any;
    manualPembebanan: any;
    listDaftarRefrensiMutasiBarang: any;
    selectedNamaGudang: any;
    gridDaftarRefrensiMutasiBarang: any;
    setTotalNilaiPersediaan: any;
    totalNilaiPersediaan: any;
    searchNoItem: any;
    setSearchNamaItem: any;
    searchNamaItem: any;
    setSearchNoItem: any;
    kodeItemSelected: any;
    setKodeItemSelected: any;
}) {
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [selectedRowIndexRekeningbarang, setSelectedRowIndexRekeningbarang] = useState(0);
    const [dialogNamaNoBarang, setDialogNamaNoBarang] = useState(false);
    const [modalDaftarRefrensiMutasiBarang, setModalDaftarRefrensiMutasiBarang] = useState(false);
    const [currentData, setCurrentData] = useState<any>(null);
    const [dataUpdate, setDataUpdate] = useState<any>({
        dataSekarang: null,
        gridPsList: null,
        selectedRowIndexRekeningbarang: null,
    });
    const [dsBarang, setDsBarang] = useState([
        {
            id_ps: 1,
            kode_item: '',
            satuan: '',
            qty: 1,
            sat_std: '',
            qty_std: null,
            harga_rp: 0,
            jumlah_rp: 0,
            kode_dept: null,
            kode_kerja: null,
            hpp: 0,
            no_kontrak: null,
            no_mbref: null,
            kode_sumber: null,
            kode_rps: null,
            beban: null,
            catatan: '',
            no_barang: '',
            nama_barang: '',
            kualitas_standar_stok: 0,
        },
    ]);
    const [itemIndex, setItemIndex] = useState(0);

    const formatCurrency = (value: string | number) => {
        if (!value) return ''; // Jika nilai tidak ada, kembalikan string kosong
        const valueReturn = new Intl.NumberFormat().format(Number(value.toString()));
        let retIfNol = valueReturn === '0' ? '' : valueReturn;
        return valueReturn === 'NaN' ? '' : valueReturn;
    };
    const swalToast = Swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 2000,
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
    const rowSelectingbarangPs = (args: any) => {
        setSelectedRowIndexRekeningbarang(args.rowIndex);
        setCurrentData(args);
        setKodeItemSelected(args.data.kode_item);
    };

    const onDoubleClick = (args: any) => {
        // console.log('double click : ', args.rowData.kode_item);

        setKodeItemSelected(args.rowData.kode_item);
    };

    useEffect(() => {
        console.log('MASUK SINI barangState');
        if (onEditItem) {
            console.log('MASUK SINI barangState : ..', barangState);

            gridPsList.current!.dataSource = [...barangState];
        }
    }, [onEditItem, barangState]);

    const EditTemplateNamaBarang = (args: any) => {
        // console.log('NAMA BARANG args : ', args);

        return (
            <>
                <div style={{ position: 'relative' }}>
                    <TextBoxComponent style={{ fontSize: '12px' }} value={args.nama_barang} readonly />
                    <button style={{ position: 'absolute', top: '15px', right: '5px', background: 'none', border: 'none' }} type="button">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="ml-2"
                            width="15"
                            height="15"
                            onClick={() => {
                                setDialogNamaNoBarang(true);
                            }}
                        />
                    </button>
                </div>
            </>
        );
    };

    const handleActionComplete = (args: any) => {
        if (args.requestType === 'save') {
            // Only run when editing is done
            console.log('masuk sini', args.rowIndex);

            //   const editedRow = args.data;
            //   const qty = editedRow.qty;
            //   const harga_rp = editedRow.harga_rp;

            //   // Perform the calculation
            //   const jumlah_rp = qty * harga_rp;
            //   const data = { ...editedRow, jumlah_rp :jumlah_rp  };

            //   // Update the field with the calculated value
            //   const updatedDataSource = gridPsList.current.dataSource.map((row: any) => {
            //     if (row.id_ps === editedRow.id_ps) {
            //       return { ...row, jumlah_rp }; // Update only the specific row
            //     }
            //     return row;
            //   });

            //   // Apply changes to grid using setProperties
            //   gridPsList.current.setProperties({ dataSource: updatedDataSource });

            const totalhpp = gridPsList.current.dataSource.reduce((total: any, row: any) => total + (row.jumlah_rp || 0), 0);

            // Set nilai total hasil kalkulasi
            setTotalNilaiPersediaan(totalhpp);

            console.log(`masuk sini after: `, gridPsList.current.dataSource);
        }
    };

    const EditTemplateNoBarang = (args: any) => {
        // console.log('NAMA BARANG args : ', args);

        return (
            <>
                <div style={{ position: 'relative' }}>
                    <TextBoxComponent style={{ fontSize: '12px' }} value={args.no_barang} readonly />
                    <button style={{ position: 'absolute', top: '15px', right: '5px', background: 'none', border: 'none' }} type="button">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="ml-2"
                            width="15"
                            height="15"
                            onClick={() => {
                                setDialogNamaNoBarang(true);
                            }}
                        />
                    </button>
                </div>
            </>
        );
    };

    const handleRekening_EndEdit = async () => {
        gridPsList.current!.endEdit();
    };

    //     const qtyKalkulasi = (e: any, args: any) => {

    //         if(typeof e === "undefined" || e === null || e === undefined) {

    //             console.log("qtyKalkulasi e undifined", e);

    //         try {

    //         } catch (error) {

    //         }
    //         } else {
    //             console.log("qtyKalkulasi normal", e);
    //         const harga = args.harga_rp * e;
    //         gridPsList.current!.dataSource[args.index] = {
    //             ...gridPsList.current!.dataSource[args.index],
    //             qty: e,
    //             jumlah_rp: harga
    //         };
    //         try {

    //             gridPsList.current!.refresh();
    //         } catch (error) {

    //         }

    //         const totalhpp = gridPsList.current!.dataSource.reduce((total: any, row: any) => total + (row.jumlah_rp || 0), 0);
    //         setTotalNilaiPersediaan(totalhpp);
    //         }

    // }
    const addRekeningCustomer = async (jenis: any) => {
        await handleRekening_EndEdit();
        const sourceLength = gridPsList.current.dataSource?.length;
        const isNotEmptyQty = gridPsList.current.dataSource.every((item: any) => item.qty !== null);

        const isNotEmptyNamabarang = gridPsList.current.dataSource.every((item: any) => item.id_ps !== '');
        const isNotEmptyNoRekening = gridPsList.current.dataSource.every((item: any) => item.nama_barang !== '');
        if (jenis !== 'selected') {
            if ((sourceLength === 0 && jenis === 'new') || (jenis === 'new' && isNotEmptyNamabarang && isNotEmptyNoRekening && isNotEmptyQty)) {
                const newObject = {
                    id_ps: gridPsList.current!.dataSource.length + 1,
                    kode_item: '',
                    satuan: '',
                    qty: null,
                    sat_std: '',
                    qty_std: null,
                    harga_rp: 0,
                    jumlah_rp: 0,
                    kode_dept: null,
                    kode_kerja: null,
                    hpp: 0,
                    no_kontrak: null,
                    no_mbref: null,
                    kode_sumber: null,
                    kode_rps: null,
                    beban: null,
                    catatan: '',
                    no_barang: '',
                    nama_barang: '',
                    kualitas_standar_stok: 0,
                };
                gridPsList.current!.addRecord(newObject, sourceLength);
            } else {
                document.getElementById('gridPsList')?.focus();
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: `<p style="font-size:12px">Lengkapi terlebih dahulu data barang.</p>`,
                    width: '100%',
                    target: '#targetModal',
                });
                return;
            }
        }
    };

    const deleteRekeningbarang = async () => {
        const selectedListData: any = gridPsList.current!.getSelectedRecords();
        if (selectedListData.length > 0) {
            withReactContent(Swal)
                .fire({
                    icon: 'question',
                    title: `<p style="font-size:12px">Yakin Ingin Menghapus Produk ${selectedRowIndexRekeningbarang + 1}</p>`,
                    target: '#targetModal',
                    showCancelButton: true,
                    confirmButtonText: 'Ya',
                    cancelButtonText: 'Tidak',
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        console.log('confirm selectedListData', selectedListData);

                        const data = gridPsList.current?.dataSource;
                        let updatedData = data.filter((item: any) => item.id_ps !== selectedListData[0].id_ps); // Filter data yang ingin dihapus
                        updatedData = updatedData.map((item: any) => {
                            if (item.id_ps > selectedListData[0].id_ps) {
                                return { ...item, id_ps: item.id_ps - 1 }; // Kurangi id dengan 1 untuk item setelah id yang dihapus
                            }
                            return item;
                        });
                        gridPsList.current!.dataSource = updatedData;
                        gridPsList.current?.refresh();
                        // setDsBarang((prevData) => prevData.filter((_, i) => i !== selectedRowIndexRekeningbarang));
                        setTimeout(() => {
                            gridPsList.current!.refresh();
                        }, 200);
                    }
                });
        } else {
            withReactContent(swalToast).fire({
                icon: 'error',
                title: `<p style="font-size:12px">Pilih Data Rekening Terlebih Dulu</p>`,
                target: '#targetModal',
            });
        }
    };
    const deleteAllRekeningbarang = () => {
        if (Array.isArray(gridPsList.current!.dataSource)) {
            if ((gridPsList.current!.dataSource as any[]).length > 0) {
                withReactContent(Swal)
                    .fire({
                        html: 'Hapus semua data?',
                        width: '15%',
                        target: '#targetModal',
                        showCancelButton: true,
                        confirmButtonText: '<p style="font-size:10px">Ya</p>',
                        cancelButtonText: '<p style="font-size:10px">Tidak</p>',
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            (gridPsList.current!.dataSource as any[]).splice(0, (gridPsList.current!.dataSource as any[]).length);

                            gridPsList.current!.refresh();
                        } else {
                            console.log('cancel');
                        }
                    });
            }
        }
    };

    useEffect(() => {
        if (dataUpdate.dataSekarang !== null) {
            console.log('INDEX BERES EDIT ', dataUpdate.selectedRowIndexRekeningbarang);

            // gridPsList.current!.endEdit();
            gridPsList.current!.dataSource[dataUpdate.selectedRowIndexRekeningbarang] = {
                ...dataUpdate.dataSekarang,
            };
            gridPsList.current!.refresh();

            const totalhpp = gridPsList.current!.dataSource.reduce((total: any, row: any) => total + (row.jumlah_rp || 0), 0);
            setTotalNilaiPersediaan(totalhpp);

            setDataUpdate({
                dataSekarang: null,
                gridPsList: null,
                selectedRowIndexRekeningbarang: null,
            });
        }
    }, [dataUpdate.dataSekarang, dataUpdate.gridPsList, dataUpdate.selectedRowIndexRekeningbarang]);

    const editTemplateQty = (args: any) => {
        return (
            <input
                type="number"
                name="qty"
                autoComplete="off"
                className="h-full w-full bg-transparent"
                id="qty" // Prevent values below 0
                // Format to show 2 decimal places
                step={1} // Step for increasing/decreasing the value
                onBlur={(e: any) => {
                    console.log('BLUR', e.target.value);
                    const dataSekarang: any = { ...gridPsList.current!.dataSource[args.index] };
                    if (e.target.value == 0 || e.target.value === '0') {
                        dataSekarang.qty = e.target.value;
                        dataSekarang.jumlah_rp = e.target.value;
                    } else {
                        if (penyesuaianNilai == false) {
                            dataSekarang.qty = e.target.value;
                            dataSekarang.jumlah_rp = e.target.value * parseFloat(parseFloat(dataSekarang.harga_rp).toFixed(2));
                        } else if (penyesuaianNilai == true) {
                            dataSekarang.qty = e.target.value;
                            dataSekarang.harga_rp = parseFloat(parseFloat(dataSekarang.jumlah_rp).toFixed(2)) / parseFloat(parseFloat(e.target.value).toFixed(2));
                            dataSekarang.hpp = parseFloat(parseFloat(dataSekarang.jumlah_rp).toFixed(2)) / parseFloat(parseFloat(e.target.value).toFixed(2));
                            // dataSekarang.jumlah_rp = e.target.value * parseFloat(parseFloat(dataSekarang.harga_rp).toFixed(2));
                        }
                    }

                    console.log('DATA SEKARANG EDIT :', dataSekarang);
                    gridPsList.current!.refresh();

                    setDataUpdate({
                        dataSekarang,
                        gridPsList,
                        selectedRowIndexRekeningbarang: args.index,
                    });
                }}
                defaultValue={args.qty}
            />
        );
    };

    const editTemplateJumlahRp = (args: any) => {
        return (
            <input
                type="number"
                name="jumlah_rp"
                autoComplete="off"
                className="h-full w-full bg-transparent"
                id="jumlah_rp"
                step={0.01} // Untuk nilai desimal
                onBlur={(e: any) => {
                    console.log('BLUR', e.target.value);
                    const dataSekarang: any = { ...gridPsList.current!.dataSource[args.index] };

                    if (e.target.value == 0 || e.target.value === '0') {
                        dataSekarang.jumlah_rp = e.target.value;
                    } else {
                        if (penyesuaianNilai == true) {
                            // Update jumlah_rp saja tanpa mengubah qty
                            dataSekarang.jumlah_rp = parseFloat(parseFloat(e.target.value).toFixed(2));
                            // dataSekarang.harga_rp = parseFloat((dataSekarang.jumlah_rp / dataSekarang.qty).toFixed(2));
                        }
                    }

                    console.log('DATA SEKARANG EDIT :', dataSekarang);

                    // Refresh grid setelah update
                    if (gridPsList.current) {
                        gridPsList.current.refresh();
                    }

                    setDataUpdate({
                        dataSekarang,
                        gridPsList,
                        selectedRowIndexRekeningbarang: args.index,
                    });
                }}
                defaultValue={args.jumlah_rp}
            />
        );
    };

    const editTemplateRefrensiMutasiBarang = (args: any) => {
        return (
            <div style={{ position: 'relative' }}>
                <TextBoxComponent style={{ fontSize: '12px' }} value={args.kustom2} readonly />
                <button
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '5px',
                        background: 'none',
                        border: 'none',
                    }}
                    type="button"
                    onClick={() => {
                        if (kodeItemSelected) {
                            // Only open modal if item is selected
                            setItemIndex(args.index);
                            setModalDaftarRefrensiMutasiBarang(true);
                        } else {
                            // Optionally show an alert or message
                            alert('Silakan pilih item terlebih dahulu');
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="ml-2" width="15" height="15" />
                </button>
            </div>
        );
    };

    return (
        <>
            <GridComponent
                id="gridPsList"
                name="gridPsList"
                className="gridPsList"
                locale="id"
                selectionSettings={{
                    mode: 'Row',
                    type: 'Single',
                }}
                allowResizing={true}
                autoFit={true}
                ref={gridPsList}
                height={230} //170 barang jadi 150 barang produksi
                // gridLines={'Both'}
                rowHeight={23}
                loadingIndicator={{
                    indicatorType: 'Shimmer',
                }}
                editSettings={{
                    allowAdding: true,
                    allowEditing: true,
                    // allowDeleting: status_edit == true ? false : true,
                    newRowPosition: 'Bottom',
                }}
                allowKeyboard={false}
                rowSelecting={rowSelectingbarangPs}
                recordDoubleClick={onDoubleClick}
                // actionComplete={handleActionComplete}
                // cellEdit={handleCellEdit}
            >
                <ColumnsDirective>
                    <ColumnDirective field="id_ps" isPrimaryKey={true} headerText="No" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" allowEditing={false} width={40} />
                    <ColumnDirective width={150} field="kode_item" headerText="kode_item" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />

                    <ColumnDirective
                        width={150}
                        field="no_barang"
                        headerText="No. barang"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                        editTemplate={EditTemplateNoBarang}
                    />

                    <ColumnDirective
                        width={150}
                        field="nama_barang"
                        headerText="Nama Barang"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                        editTemplate={EditTemplateNamaBarang}
                    />

                    <ColumnDirective field="satuan" headerText="Satuan" headerTextAlign="Center" textAlign="Left" width="80" clipMode="EllipsisWithTooltip" allowEditing={false} />
                    {/* <ColumnDirective width={150} field="sat_std" headerText="sat_std" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="qty_std" headerText="qty_std" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="harga_rp" headerText="harga_rp" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="kode_dept" headerText="kode_dept" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="kode_kerja" headerText="kode_kerja" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="hpp" headerText="hpp" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="no_mbref" headerText="no_mbref" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="kode_sumber" headerText="kode_sumber" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="kode_rps" headerText="kode_rps" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="beban" headerText="beban" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective width={150} field="catatan" headerText="catatan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" visible={false} />
                    <ColumnDirective
                        width={150}
                        field="kualitas_standar_stok"
                        headerText="kualitas_standar_stok"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                        visible={false}
                    /> */}
                    <ColumnDirective field="qty" headerText="Kuantitas" headerTextAlign="Center" textAlign="Right" width="80" clipMode="EllipsisWithTooltip" editTemplate={editTemplateQty} />
                    <ColumnDirective
                        field="jumlah_rp"
                        format={'N2'}
                        headerText="Nilai Persediaan"
                        headerTextAlign="Center"
                        textAlign="Right"
                        width="150"
                        clipMode="EllipsisWithTooltip"
                        allowEditing={penyesuaianNilai == true ? true : false}
                        editTemplate={editTemplateJumlahRp}
                    />
                    <ColumnDirective field="no_kontrak" headerText="No Kontrak" headerTextAlign="Center" textAlign="Center" width="100" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective
                        field="kustom2"
                        headerText="Referensi Mutasi Barang (IN)"
                        headerTextAlign="Center"
                        textAlign="Left"
                        width="220"
                        clipMode="EllipsisWithTooltip"
                        editTemplate={editTemplateRefrensiMutasiBarang}
                    />
                </ColumnsDirective>

                <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
            </GridComponent>
            <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex justify-start gap-2">
                    <ButtonComponent
                        id="buAddRekening"
                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                        cssClass="e-primary e-small"
                        iconCss="e-icons e-small e-plus"
                        onClick={() => addRekeningCustomer('new')}
                    />
                    <ButtonComponent
                        id="buSingleDeleteRekening"
                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                        cssClass="e-warning e-small"
                        iconCss="e-icons e-small e-trash"
                        onClick={() => deleteRekeningbarang()}
                    />
                    <ButtonComponent
                        id="buDeleteAllRekening"
                        type="button" //Solusi tdk refresh halaman saat selesai onClick
                        cssClass="e-danger e-small"
                        iconCss="e-icons e-small e-erase"
                        onClick={() => deleteAllRekeningbarang()}
                    />
                </div>

                <p className="text-right">Total Penyesuaian: {formatCurrency(totalNilaiPersediaan)}</p>
            </div>
            {dialogNamaNoBarang && (
                <DialogNoNamaBarang
                    dialogNamaNoBarang={dialogNamaNoBarang}
                    gridPsList={gridPsList}
                    rowSelectingbarangPs={selectedRowIndexRekeningbarang}
                    setDialogNamaNoBarang={setDialogNamaNoBarang}
                    listDaftarBarang={listDaftarBarang}
                    kode_entitas={kode_entitas}
                    apiUrl={apiUrl}
                    selectedKodeGudang={selectedKodeGudang}
                    penyesuaianNilai={penyesuaianNilai}
                    manualPembebanan={manualPembebanan}
                    searchNoItem={searchNoItem}
                    setSearchNamaItem={setSearchNamaItem}
                    searchNamaItem={searchNamaItem}
                    setSearchNoItem={setSearchNoItem}
                />
            )}
            {modalDaftarRefrensiMutasiBarang && (
                <DialogMutasiBarang
                    modalDaftarRefrensiMutasiBarang={modalDaftarRefrensiMutasiBarang}
                    selectedNamaGudang={selectedNamaGudang}
                    setModalDaftarRefrensiMutasiBarang={setModalDaftarRefrensiMutasiBarang}
                    listDaftarRefrensiMutasiBarang={listDaftarRefrensiMutasiBarang}
                    gridDaftarRefrensiMutasiBarang={gridDaftarRefrensiMutasiBarang}
                    gridPsList={gridPsList}
                    rowSelectingbarangPs={rowSelectingbarangPs}
                    itemIndex={itemIndex}
                />
            )}
        </>
    );
}
