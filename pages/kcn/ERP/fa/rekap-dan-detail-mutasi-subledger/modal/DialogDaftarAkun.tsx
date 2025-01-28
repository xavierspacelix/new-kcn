import React, { useEffect, useRef, useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';

import { TemplateNamaAkun, TemplateNoAkun } from '../../buku-besar/interface/template';
import { DaftarAkunKredit } from '../../buku-subledger/model/api';
import { HandleSearchNamaAkun, HandleSearchNoAkun } from '../function/fungsiForm';
import Swal from 'sweetalert2';
import { RiFileExcel2Line } from 'react-icons/ri';

const DialogDaftarAkun = ({
    visible,
    setVisibel,
    headerState,
    handleChange,
    kode_entitas,
    userid,
    token,
    setHeaderState,
    refreshListData,
    RekapDataSource
}: {
    visible: any;
    setVisibel: any;
    headerState: any;
    handleChange: any;
    kode_entitas: any;
    userid: any;
    token: any;
    setHeaderState: any;
    refreshListData: any;
    RekapDataSource: any
}) => {
    const gridAkun = useRef<Grid | any>(null);

    const [stateDataArray, setStateDataArray] = useState<any[]>([]);
    const [originalDataSource, setOriginalDataSource] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const [tempHeader, setTempHeader] = useState<any>({...headerState});

    const paramobject = {
        kode_entitas: kode_entitas,
        tipeDialog: 'SQLAkunSubledger',
        token: token,
    };

    useEffect(() => {
        if(RekapDataSource.length !== 0) {
            setHeaderState((oldData: any) => ({
                ...oldData,
                no_akun: '',
                nama_akun: '',
            }))
        }
    },[])

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit: any[] = await DaftarAkunKredit(paramobject);
            setStateDataArray(resultDaftarAkunKredit);
            setOriginalDataSource(resultDaftarAkunKredit);
            gridAkun.current?.setProperties({ dataSource: resultDaftarAkunKredit });
            gridAkun.current?.refresh();
        };
        async();
    }, [visible]);

    const hanldeRecordDoubleClick = async () => {
        if(handleSelect.length === 0) {
            return;
        }
        if (selectedRow?.header === 'Y') {
            return await Swal.fire({
                title: 'Silahkan pilih akun yang benar!',
                icon: 'warning',
                target: '#targetForSwalDialog',
            });
        }

        setHeaderState((oldData: any) => ({
            ...oldData,
            nama_akun: selectedRow?.nama_akun,
            no_akun: selectedRow?.no_akun,
            kode_akun: selectedRow?.kode_akun,
        }));

        await refreshListData(selectedRow?.kode_akun);
    };

    const handleSelect = async (args: any) => {
        console.log('Persiapan api', args);
        setHeaderState((oldData: any) => ({
            ...oldData,
            kode_akun: args.data.kode_akun,
        }));
        setSelectedRow(args.data);
    };

    return (
        <DialogComponent
            id="dialogDaftarAkunKredit"
            target="#main-target"
            style={{ position: 'fixed' }}
            header={() => (
                <div>
                    <div className="header-title" style={{ width: '93%' }}>
                        Daftar Akun
                    </div>
                </div>
            )}
            visible={visible}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            showCloseIcon={true}
            width="28%"
            height="65%"
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                if(RekapDataSource.length !== 0){
                    setHeaderState({...tempHeader})
                }
                setVisibel(false);
            }}
            closeOnEscape={true}
            open={(args: any) => {}}
        >
            <div className="h-full w-full" id="targetForSwalDialog">
                <div className="mb-2 flex gap-2">
                    <input
                        type="text"
                        id="no_akun_dialog"
                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="no akun"
                        name="no_akun"
                        value={headerState?.no_akun}
                        style={{ height: '4vh' }}
                        onChange={(e: any) => {
                            HandleSearchNoAkun(e.target.value, setHeaderState, setStateDataArray, originalDataSource);
                        }}
                        onFocus={(e: any) => {
                            HandleSearchNoAkun(e.target.value, setHeaderState, setStateDataArray, originalDataSource);
                        }}
                        autoComplete="off"
                    />

                    <input
                        type="text"
                        id="nama_akun_dialog"
                        className="w-full rounded-sm border border-gray-400 bg-gray-50 p-2 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="keterangan akun"
                        name="nama_akun"
                        value={headerState?.nama_akun}
                        style={{ height: '4vh' }}
                        onChange={(e) => {
                            HandleSearchNamaAkun(e.target.value, setHeaderState, setStateDataArray, originalDataSource);
                        }}
                        onFocus={(e: any) => {
                            HandleSearchNamaAkun(e.target.value, setHeaderState, setStateDataArray, originalDataSource);
                        }}
                        autoComplete="off"
                    />
                </div>

                <TooltipComponent openDelay={1000} target=".e-headertext">
                    <GridComponent
                         id="gridAkun"
                         name="gridAkun"
                         className="gridAkun"
                         locale="id"
                         dataSource={stateDataArray}
                         rowSelecting={handleSelect}
                         recordDoubleClick={hanldeRecordDoubleClick}
                         ref={gridAkun}
                         selectionSettings={{ mode: 'Row', type: 'Single' }}
                         rowHeight={22}
                         gridLines={'Both'}
                         height={225} // Tinggi grid dalam piksel /
                         allowPaging={true} // Nonaktifkan pagination /
                         frozenRows={0} // Tidak ada header atau baris tetap /
                    >
                        <ColumnsDirective>
                            <ColumnDirective template={TemplateNoAkun} field="no_akun" headerText="No. Akun" headerTextAlign="Center" textAlign="Center" width={80} />
                            <ColumnDirective
                                field="nama_akun"
                                headerText="Nama Akun"
                                headerTextAlign="Center"
                                template={TemplateNamaAkun}
                                textAlign="Left"
                                clipMode="EllipsisWithTooltip"
                                width={'auto'}
                                // allowEditing={false}
                                // editTemplate={editTemplateNoAkun}
                            />
                        </ColumnsDirective>

                        <Inject services={[Page, Selection, Edit, CommandColumn, Toolbar, Resize]} />
                    </GridComponent>
                </TooltipComponent>
                <div className="flex h-[40px] w-full items-center justify-end gap-2 ">
                    <button
                        onClick={hanldeRecordDoubleClick}
                        className={`} flex cursor-pointer items-center rounded-md bg-[#3a3f5c]
                        p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#787a87] `}
                    >
                        OK
                    </button>

                    <button
                        onClick={() => {
                            if(RekapDataSource.length !== 0){
                                setHeaderState({...tempHeader})
                            }
                            setVisibel(false)}}
                        className={`} flex cursor-pointer items-center rounded-md bg-[#3a3f5c]
                        p-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#787a87] `}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogDaftarAkun;
