import React, { useEffect, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GridComponent, ColumnsDirective, ColumnDirective, Selection, Inject } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import withReactContent from 'sweetalert2-react-content';
import { Dialog, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Grid } from '@syncfusion/ej2-react-grids';
import { swalToast } from '../interface/template';
import { GetDaftarMutasi } from '../model/api';

interface DialogDaftarMutasiProps {
    setListStateData: Function;
    listStateData: any;
    refreshData: any;
    token: any;
    clickDaftarDetailMutasi: any;
}

const DialogDaftarMutasi: React.FC<DialogDaftarMutasiProps> = ({ setListStateData, listStateData, refreshData, token, clickDaftarDetailMutasi }) => {
    let dialogDaftarMutasi: Dialog | any;
    let gridDaftarMutasi: Grid | any;
    let currentDaftarBarang: any[] = [];

    let buttonDaftarMutasi: ButtonPropsModel[];
    const formatDate: Object = { type: 'date', format: 'dd-MM-yyyy' };

    const paramObject = {
        token: token,
        nilai_transfer: listStateData?.nilaiTransfer,
        no_rek: listStateData?.noRek,
        tgl_awal: listStateData?.tglAwal,
        tgl_akhir: listStateData?.tglAkhir,
        // nilai_transfer: 6500000,
        // no_rek: '1768017777',
        // tgl_awal: '2024-10-23',
        // tgl_akhir: '2024-10-23',
    };

    const [daftarMutasi, setDaftarMutasi] = useState<any[]>([]);
    const [listHeader, setListHeader] = useState({
        bank: '',
        noRek: '',
        namaPemilik: '',
    });
    useEffect(() => {
        const async = async () => {
            if (paramObject.no_rek !== '') {
                const respDaftarMutasi: any = await GetDaftarMutasi(paramObject);
                const respDaftarMutasiFix = respDaftarMutasi.map((item: any) => ({
                    ...item,
                    jumlah: parseFloat(item.jumlah),
                    amount: parseFloat(item.amount),
                }));
                setDaftarMutasi(respDaftarMutasiFix);
                if (respDaftarMutasiFix.length > 0) {
                    setListHeader((prevState: any) => ({
                        ...prevState,
                        bank: respDaftarMutasiFix[0].bank_name,
                        noRek: respDaftarMutasiFix[0].account_number,
                        namaPemilik: respDaftarMutasiFix[0].account_name,
                    }));
                }
            }
            // console.log('paramnObject = ', paramObject);
        };
        async();
    }, [refreshData]);
    buttonDaftarMutasi = [
        {
            buttonModel: {
                content: 'Pilih',
                //iconCss: 'e-icons e-save',
                cssClass: 'e-primary e-small',
            },
            isFlat: false,
            click: () => {
                currentDaftarBarang = gridDaftarMutasi.getSelectedRecords();
                if (currentDaftarBarang.length > 0) {
                    clickDaftarDetailMutasi(currentDaftarBarang);
                    handleCloseDialog();
                } else {
                    withReactContent(swalToast).fire({
                        icon: 'warning',
                        title: '<p style="font-size:12px">Silahkan pilih data faktur</p>',
                        width: '100%',
                        target: '#dialogDaftarSjItem',
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
                handleCloseDialog();
            },
        },
    ];

    // // const handleHapusRow = async () => {
    // //     await setDataBarang((state: any) => {
    // //         const currentDataSource = gridTtbListRef?.dataSource as any[];
    // //         const filteredDataSource = currentDataSource.filter((item) => item.id != null);
    // //         gridTtbListRef?.setProperties({ dataSource: filteredDataSource });
    // //         return {
    // //             ...state,
    // //         };
    // //     });
    // //     await setDialogDaftarSjItemVisible(false);
    // // };

    const handleCloseDialog = () => {
        setListStateData((prevState: any) => ({
            ...prevState,
            clickDaftarMutasi: false,
        }));
    };

    return (
        <DialogComponent
            ref={(d: any) => (dialogDaftarMutasi = d)}
            id="dialogDaftarMutasi"
            target="#main-target"
            style={{ position: 'fixed' }}
            header={`Daftar Mutasi Bank Via API`}
            visible={listStateData?.clickDaftarMutasi}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="50%"
            height="65%"
            buttons={buttonDaftarMutasi}
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                handleCloseDialog();
            }}
        >
            <div style={{ width: '100%', marginLeft: '0px', marginTop: '4px', marginBottom: '5px' }}>
                <div className="border p-3" style={{ borderRadius: 1, height: 100, borderColor: '#d4d0c8', background: '#d4d0c8', color: 'black' }}>
                    {/* <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Bank : </label>
                    <label style={{ fontWeight: 'bold', fontSize: '13px' }}>No. Rekening : </label>
                    <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Nama Pemilik : </label> */}
                    <div className="flex">
                        <div style={{ width: '100px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Bank </label>
                        </div>
                        <div style={{ width: '200px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>: {listHeader.bank}</label>
                        </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: '100px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>No. Rekening </label>
                        </div>
                        <div style={{ width: '200px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>: {listHeader.noRek}</label>
                        </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: '100px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Nama Pemilik </label>
                        </div>
                        <div style={{ width: '200px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '13px' }}>: {listHeader.namaPemilik}</label>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ background: '#646360', marginTop: '-5px', height: '20px', display: 'flex', alignItems: 'center' }}>
                <label style={{ color: 'white', marginLeft: '12px', padding: '3px 0px 0px 0px' }}>
                    Filter data sesuai diskripsi (untuk filter sesuai nilai mutasi urutkan kolom Jumlah CR terlebih dahulu)
                </label>
            </div>
            {/* <div className="form-input mb-1 mr-1" style={{ width: '100px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoItem1"
                    name="searchNoItem1"
                    className="searchNoItem1"
                    placeholder="<No. Barang>"
                    showClearButton={true}
                    // value={searchNoItem}
                    // input={(args: FocusInEventArgs) => {
                    //     const value: any = args.value;
                    //     HandleSearchNoBarang(value, setSearchKeywordNoBarang, setFilteredDataSjItem, dataDetailSjItem);
                    // }}
                />
            </div> */}
            <input
                className={` container form-input`}
                style={{
                    fontSize: 11,
                    width: '100%',
                    borderRadius: 2,
                    textAlign: 'left',
                    borderColor: '#bfc9d4',
                }}
                // value={
                //     listStateData?.plagJmlFaktur === 'detail'
                //         ? frmNumber(listStateData?.jmlFaktur)
                //         : dataMasterList.jml_faktur === '0.0000'
                //         ? ''
                //         : frmNumber(dataMasterList.jml_faktur)
                // }
            />
            <GridComponent
                id="dialogDaftarMutasi"
                locale="id"
                //style={{ width: '100%', height: '100%' }}
                ref={(g: any) => (gridDaftarMutasi = g)}
                dataSource={daftarMutasi}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'373'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Shimmer' }}
                recordDoubleClick={(args: any) => {
                    if (gridDaftarMutasi) {
                        //Selecting row first
                        const rowIndex: number = args.row.rowIndex;
                        gridDaftarMutasi.selectRow(rowIndex);
                        currentDaftarBarang = gridDaftarMutasi.getSelectedRecords();
                        if (currentDaftarBarang.length > 0) {
                            clickDaftarDetailMutasi(currentDaftarBarang);
                            handleCloseDialog();
                        } else {
                            withReactContent(swalToast).fire({
                                icon: 'warning',
                                title: '<p style="font-size:12px">Silahkan pilih data faktur</p>',
                                width: '100%',
                                // target: '#dialogDaftarFaktur',
                            });
                        }
                    }
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective field="valuta" headerText="Tanggal" headerTextAlign="Center" textAlign="Center" width="60" format={formatDate} type="date" />
                    <ColumnDirective field="description" headerText="Diskripsi" headerTextAlign="Center" textAlign="Left" width="300" />
                    <ColumnDirective field="jumlah" format="N2" headerText="Jumlah CR" headerTextAlign="Center" textAlign="Right" width="80" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
        </DialogComponent>
    );
};

export default DialogDaftarMutasi;
