import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import {
    Grid,
    GridComponent,
    ColumnDirective,
    ColumnsDirective,
    CommandColumn,
    Inject,
    Page,
    Edit,
    Filter,
    Toolbar,
    Resize,
    Selection,
    PageSettingsModel,
    FilterSettingsModel,
} from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { HandleSearchNamaAkun, HandleSearchNoAkun } from '../function/function';

export default function AkunKas({
    apiUrl,
    kode_entitas,
    visible,
    onClose,
    token,
    setHeaderDialogState,
    setBodyState,
    tanggal,
}: {
    apiUrl: string;
    kode_entitas: string;
    visible: boolean;
    onClose: Function;
    token: string;
    setHeaderDialogState: any;
    setBodyState: any;
    tanggal: string;
}) {
    const header = 'List Akun';
    const pageSettings: PageSettingsModel = { pageSize: 9 };
    const filterSettings: FilterSettingsModel = { type: 'FilterBar', mode: 'Immediate' };
    const [originalDataSource, setOriginalDataSource] = useState([]);
    const gridKendaraan = useRef<any>(null);
    const [dialogListKendaraan, setDialogListAkun] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [searchNoAkun, setSearchNoAkun] = useState('');
    const [searchNamaAkun, setSearchNamaAkun] = useState('');

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    const handleRowDataBound = (args: any) => {
        const rowData = args.data as any; // Cast data sebagai any atau tipe yang tepat

        // Contoh kondisi: jika nilai kolom "status" adalah "Pending"
        if (rowData.header === 'Y') {
            // console.log('style', args.row.style);
            args.row.style.fontWeight = 'bold'; // Warna merah muda
        } else {
            args.row.style.textIndent = '5px';
        }
    };

    const refreshData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_akun_global?`, {
                params: {
                    entitas: kode_entitas,
                    param1: 'SqlAkunPreferensi',
                    param2: 'Kas',
                    param3: 'Y',
                    param4: 'Kas',
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },

                // entitas=999&param1=SqlAkunPreferensi&param2=Kas&param3=Y&param4=Kas
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // const modfiedData = response.data.data.filter((item: any) => item.header !== 'Y' && item.nama_akun.toLowerCase().startsWith('kas'))
            setDialogListAkun(response.data.data);
            setOriginalDataSource(response.data.data);
            setSelectedRow(response.data.data[0]);
        } catch (error) {}
    };
    useEffect(() => {
        refreshData();
    }, []);
    function formatString(input: string) {
        // Split berdasarkan underscore (_)
        const words = input.split('_');

        // Kapitalisasi huruf pertama setiap kata
        const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        // Gabungkan kembali dengan spasi
        return formattedWords.join(' ');
    }
    const handleSelect = (args: any) => {
        setSelectedRow(args.data);
    };
    const hanldeRecordDoubleClick = async (args: any) => {
        if (selectedRow.header === 'Y') {
            return alert('Silahkan pilih akun selain akun header');
        }

        try {
            const response = await axios.get(`${apiUrl}/erp/udf_saldobalanceglmu?`, {
                params: {
                    entitas: kode_entitas,
                    param1: selectedRow.kode_akun,
                    param2: tanggal,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },

                // entitas=999&param1=SqlAkunPreferensi&param2=Kas&param3=Y&param4=Kas
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("get akun balance",response.data.data);

            setHeaderDialogState((oldData: any) => ({
                ...oldData,
                no_akun: selectedRow.no_akun,
                nama_akun: selectedRow.nama_akun,
                kode_akun: selectedRow.kode_akun,
            }));
            setBodyState((oldData: any) => ({
                ...oldData,
                saldo_akhir_sistem: String(SpreadNumber(response.data.data.balance)),
                selisih: String(parseFloat(oldData.saldo_akhir_fisik.replace(/,/g, '')) - SpreadNumber(response.data.data.balance)),
                saldo_belum_approved: String(SpreadNumber(response.data.data.napp)),
            }));
            // // document.getElementById('km_sebelumnya')!.focus();
            // // document.getElementById('km_sebelumnya')!.value = String(SpreadNumber(selectedRow.kmawal));
            // // document.getElementById('km_sebelumnya')!.blur();
            onClose();
        } catch (error) {}
    };
    return (
        <DialogComponent
            id="dialogListKendaraan"
            isModal={true}
            width="50%"
            height={350}
            visible={visible}
            close={() => onClose()}
            header={header}
            showCloseIcon={true}
            target="#forDialogAndSwall"
            closeOnEscape={false}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            position={{ X: 'center', Y: 'center' }} // Dialog berada di tengah
            style={{ position: 'fixed' }}
        >
            <div className="flex h-full w-full flex-col">
                <div className="flex gap-2">
                    <div className="mb-1 flex w-[110px] flex-col items-start">
                        <input
                            type="text"
                            id="no_akun"
                            className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder={formatString('no_akun')}
                            name="no_akun"
                            value={searchNoAkun}
                            onChange={(e) => HandleSearchNoAkun(e.target.value, setSearchNoAkun, setDialogListAkun, originalDataSource)}
                            // style={{ height: '4vh' }}
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-1 flex w-full flex-col items-start">
                        <input
                            type="text"
                            id="nama_akun"
                            className="w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder={formatString('nama_akun')}
                            name="nama_akun"
                            value={searchNamaAkun}
                            onChange={(e) => HandleSearchNamaAkun(e.target.value, setSearchNamaAkun, setDialogListAkun, originalDataSource)}
                            // style={{ height: '4vh' }}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <GridComponent
                    id="gridAkun"
                    name="gridAkun"
                    className="gridAkun"
                    locale="id"
                    dataSource={dialogListKendaraan}
                    rowSelecting={handleSelect}
                    recordDoubleClick={hanldeRecordDoubleClick}
                    ref={gridKendaraan}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    gridLines={'Both'}
                    rowDataBound={handleRowDataBound}
                    height={'180'} // Tinggi grid dalam piksel /
                >
                    <ColumnsDirective>
                        <ColumnDirective field="no_akun" headerText="No Akun" headerTextAlign="Center" textAlign="Center" width={80} />
                        <ColumnDirective
                            field="nama_akun"
                            headerText="Nama Akun"
                            headerTextAlign="Center"
                            textAlign="Left"
                            clipMode="EllipsisWithTooltip"
                            width={'auto'}
                            // allowEditing={false}
                            // editTemplate={editTemplateNoAkun}
                        />
                    </ColumnsDirective>

                    <Inject services={[Selection, CommandColumn, Toolbar, Resize]} />
                </GridComponent>
                <div className="flex h-[15%] w-full justify-end gap-3 py-2">
                    <button
                        onClick={hanldeRecordDoubleClick}
                        className={` flex cursor-pointer items-center rounded-md bg-[#3a3f5c]
                        p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#787a87] `}
                    >
                        OK
                    </button>

                    <button
                        onClick={() => onClose()}
                        className={`flex cursor-pointer items-center rounded-md bg-[#3a3f5c]
                        p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#787a87] `}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </DialogComponent>
    );
}
