import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import axios from 'axios';
import { HandleSearchJenisServis } from '../function/function';

export default function DialogListServis({ apiUrl, kode_entitas, visible, onClose, token,setHeaderDialogState }: { apiUrl: string; kode_entitas: string; visible: boolean; onClose: Function, token: string, setHeaderDialogState: any }) {
    const header = 'List Servis';
    const gridServis = useRef<any>(null)
    const [dialogListServis, setDialogListServis] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [servisCari, setServisCari] = useState('');
    const [originalDataSource, setOriginalDataSource] = useState([]);


    const refreshData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_jenis_servis_bok?`, {
                params: {
                    entitas: kode_entitas,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDialogListServis(response.data.data);
            setOriginalDataSource(response.data.data);
            setSelectedRow(response.data.data[0])
        } catch (error) {}
    };
    useEffect(() => {
        refreshData();
    },[])
    function formatString(input: string) {
        // Split berdasarkan underscore (_)
        const words = input.split('_');

        // Kapitalisasi huruf pertama setiap kata
        const formattedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        // Gabungkan kembali dengan spasi
        return formattedWords.join(' ');
    }
    const handleSelect = (args: any) => {
        setSelectedRow(args.data)
    }
    const hanldeRecordDoubleClick = (args: any) => {
        setHeaderDialogState((oldData: any) => ({
            ...oldData,
            jenis_perbaikan: selectedRow.jenis_servis
        }))
        onClose();
    }
    return (
        <DialogComponent
            id="dialogListServis"
            isModal={true}
            width="30%"
            height={410}
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
                <div className="flex h-[70%] w-full flex-col justify-items-start">
                <input
                        type="text"
                        id="number-input"
                        className={`w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 `}
                        placeholder={formatString('jenis_Servis')}
                        name="jenis_perbaikan"
                        value={servisCari} // Format hanya saat blur
                        onChange={(e) => {
                            HandleSearchJenisServis(e.target.value,setServisCari,setDialogListServis,originalDataSource)
                        }}
                        autoComplete='off'
                    />
                </div>
                <GridComponent
                         id="gridAkun"
                         name="gridAkun"
                         className="gridAkun"
                         locale="id"
                         dataSource={dialogListServis}
                         rowSelecting={handleSelect}
                         recordDoubleClick={hanldeRecordDoubleClick}
                         ref={gridServis}
                         selectionSettings={{ mode: 'Row', type: 'Single' }}
                         rowHeight={22}
                         gridLines={'Both'}
                         height={'250'} // Tinggi grid dalam piksel /
                    >
                        <ColumnsDirective>
                            <ColumnDirective  field="jenis_servis" headerText="Jenis Servis" headerTextAlign="Center" textAlign="Left" width={80} />
                        </ColumnsDirective>

                        <Inject services={[ Selection, CommandColumn, Toolbar, Resize]} />
                    </GridComponent>
                <div className="h-[30%] w-full flex justify-end gap-3 py-2">
                <button
                        onClick={hanldeRecordDoubleClick}
                        className={` flex cursor-pointer items-center rounded-md bg-[#3a3f5c]
                        p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#787a87] `}
                    >
                        OK
                    </button>

                    <button
                        onClick={() => onClose()}
                        className={`} flex cursor-pointer items-center rounded-md bg-[#3a3f5c]
                        p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#787a87] `}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </DialogComponent>
    );
}
