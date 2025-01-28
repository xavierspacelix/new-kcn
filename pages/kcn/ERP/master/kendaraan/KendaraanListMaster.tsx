import React, { useEffect, useRef, useState } from 'react';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, Inject, Page, Edit, Sort, Filter, Group, Resize, Reorder, Selection, ExcelExport, PdfExport } from '@syncfusion/ej2-react-grids';
import DialogBaruEditKendaraanMaster from './modal/DialogBaruEditKendaraanMaster';
import { useRouter } from 'next/router';
import { useSession } from '@/pages/api/sessionContext';
import axios from 'axios';
import GridKendaraanList from './GridKendaraanList';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';

const KendaraanListMaster = () => {
    const { sessionData, isLoading } = useSession();
    const dispatch = useDispatch();

    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const router = useRouter();
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const [activeTab, setActiveTab] = useState('rekapitulasi');
    const gridKendaraan = useRef<Grid | any>(null);
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [showDialogBaruEdit, setShowDialogBaruEdit] = useState(false);
    const [masterState, setMasterState] = useState('');
    const [masterData, setMasterData] = useState({});
    const [list_kendaraan, setList_kendaraan] = useState([]);

    const refreshData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_kendaraan?`, {
                params: {
                    entitas: kode_entitas,
                    // Belum Sesuai Jumlah Data yang Muncul = [Semua, A-F]
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // setList_kendaraan(response.data.data);
            gridKendaraan.current.setProperties({ dataSource: response.data.data });
            gridKendaraan.current!.refresh();
            // setList_kendaraan(response.data.data);
        } catch (error) {}
    };

    useEffect(() => {
        if (kode_entitas) {
            dispatch(setPageTitle(kode_entitas + ' | Master Kendaan List'));
            refreshData();
        }
    }, [kode_entitas]);

    const nonAktifTemplate = (args: any) => {
        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={`aktif`}
                    className="mx-auto"
                    checked={args.aktif !== 'Y'}
                    readOnly
                    // onChange={() => {
                    //     gridKendaraan.current!.dataSource[args.index] = {
                    //         ...gridKendaraan.current!.dataSource[args.index],
                    //         aktif: args.aktif === 'Y' ? 'N' : 'Y',
                    //     };
                    //     gridKendaraan.current!.refresh();
                    // }}
                />
            </div>
        );
    };

    const armadaKirimTemplate = (args: any) => {
        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={`armada_kirim`}
                    className="mx-auto"
                    checked={args.armada_kirim === 'Y'}
                    readOnly
                    // onChange={() => {
                    //     gridKendaraan.current!.dataSource[args.index] = {
                    //         ...gridKendaraan.current!.dataSource[args.index],
                    //         armada_kirim: args.armada_kirim === 'Y' ? 'N' : 'Y',
                    //     };
                    //     gridKendaraan.current!.refresh();
                    // }}
                />
            </div>
        );
    };

    const hitungKPI = (args: any) => {
        return (
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={`hitung_kpi`}
                    className="mx-auto"
                    checked={args.hitungkpi === 'Y'}
                    readOnly
                    // onChange={() => {
                    //     gridKendaraan.current!.dataSource[args.index] = {
                    //         ...gridKendaraan.current!.dataSource[args.index],
                    //         hitungkpi: args.hitungkpi === 'Y' ? 'N' : 'Y',
                    //     };
                    //     gridKendaraan.current!.refresh();
                    // }}
                />
            </div>
        );
    };

    const rowselectHandle = (args: any) => {
        setMasterData(args.data);
    };
    const recordDoubleClickHandle = (args: any) => {
        setMasterData(args.rowData);
        setShowDialogBaruEdit(true);
        setMasterState('EDIT');
    };

    return (
        <div className="Main overflow-visible" id="forDialogAndSwall">
            {showDialogBaruEdit === true ? (
                <DialogBaruEditKendaraanMaster
                    bokflag={false}
                    refreshData={refreshData}
                    visible={showDialogBaruEdit}
                    onClose={() => {
                        setTimeout(() => setShowDialogBaruEdit(false), 300);
                    }}
                    masterState={masterState}
                    masterData={masterData}
                />
            ) : null}
            <div className="-mt-3 flex items-center gap-3 space-x-2 p-1">
                <button
                    className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]"
                    onClick={() => {
                        setShowDialogBaruEdit(true);
                        setMasterState('BARU');
                    }}
                >
                    Baru
                </button>
                <button
                    className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]"
                    onClick={() => {
                        setShowDialogBaruEdit(true);
                        setMasterState('EDIT');
                    }}
                >
                    Ubah
                </button>
                {/* <button className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]">Hapus</button> */}
                <button className="rounded-md bg-[#3a3f5c] px-4 py-1.5 text-xs font-semibold text-white  transition-colors duration-200 hover:bg-[#2f3451]" onClick={refreshData}>
                    Refresh
                </button>
                <div className="w-full justify-end">
                    <h2 className="bold text-md text-right">List Kendaraan</h2>
                </div>
            </div>
            <div className={`h-full flex-1`}>
                <GridKendaraanList
                    list_kendaraan={list_kendaraan}
                    rowselectHandle={rowselectHandle}
                    recordDoubleClickHandle={recordDoubleClickHandle}
                    nonAktifTemplate={nonAktifTemplate}
                    armadaKirimTemplate={armadaKirimTemplate}
                    hitungKPI={hitungKPI}
                    gridKendaraan={gridKendaraan}
                />
            </div>
        </div>
    );
};

export default KendaraanListMaster;
