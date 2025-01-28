import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import axios from 'axios';

export default function DialogServisCrud({
    apiUrl,
    kode_entitas,
    visible,
    onClose,
    token,
    setHeaderDialogState,
    userid,
}: {
    apiUrl: string;
    kode_entitas: string;
    visible: boolean;
    onClose: Function;
    token: string;
    setHeaderDialogState: any;
    userid: string;
}) {
    const header = 'List Servis';
    const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
    const toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    const gridServis = useRef<any>(null);
    const [dialogListServis, setDialogListServis] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any>({});

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
    const hanldeRecordDoubleClick = (args: any) => {
        onClose();
    };
    const jenis_perbaikan_rule = { required: true, minLength: 3 };

    const actionCompleteHandle = async (args: any) => {
        console.log('ARGS complete', args);
        if (args.action === 'edit') {
            console.log('ARGS complete edit', args);
            const jsonEdit = {
                entitas: kode_entitas,
                proses: 'UPDATE',
                jenis_servis: args.previousData.jenis_servis,
                new_jenis_servis: args.data.jenis_servis,
                userid: userid.toUpperCase(),
            };

            const response: any = await axios.post(`${apiUrl}/erp/simpan_jenis_servis_bok?`, jsonEdit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else if (args.action === 'add') {
            console.log('ARGS complete add', args);
            const jsonSimpan = {
                entitas: kode_entitas,
                proses: 'CREATE',
                jenis_servis: args.data.jenis_servis,
                userid: userid.toUpperCase(),
            };

            const response: any = await axios.post(`${apiUrl}/erp/simpan_jenis_servis_bok?`, jsonSimpan, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else if (args.action === 'delete') {
            console.log('ARGS complete delete', args);
        }

        //         ```json
        // // ADD NEW SERVIS

        // // UPDATE SERVIS

        // // DELETE SERVIS
        // {
        // "entitas": "100",
        // "proses": "DELETE",
        // "jenis_servis": "Juan Update"
        // }
        // ```
    };
    return (
        <DialogComponent
            id="dialogListServis"
            isModal={true}
            width="30%"
            height={420}
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
            <div className="flex h-full w-full flex-col justify-between">
                <div className="flex h-[70%] w-full flex-col justify-items-start">
                    <GridComponent actionComplete={actionCompleteHandle} ref={gridServis} dataSource={dialogListServis} editSettings={editOptions} toolbar={toolbarOptions} height={240}>
                        <ColumnsDirective>
                            <ColumnDirective field="jenis_servis" headerText="Order ID" validationRules={jenis_perbaikan_rule} width="100" textAlign="Left" />
                        </ColumnsDirective>
                        <Inject services={[Edit, Toolbar]} />
                    </GridComponent>
                </div>
                <div className="flex h-[13%] w-full justify-end gap-3 py-2">
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
