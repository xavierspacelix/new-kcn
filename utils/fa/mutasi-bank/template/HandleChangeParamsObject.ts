export interface HandleChangeParamsObject {
    tipe: string;
    valueObject: any;
    kode_entitas: string;
    token: string;
    userid: string;
    entitas: string;
    vRefreshData: any;
    setListStateData: React.Dispatch<React.SetStateAction<any>>;
    setFilterData: React.Dispatch<React.SetStateAction<any>>;
    setCheckboxFilter: React.Dispatch<React.SetStateAction<any>>;
    setStateDataArray: React.Dispatch<React.SetStateAction<any>>;
    prevDataSelectedRef: any;

    // Fungsi Click Tab Header List
    setActiveTab: React.Dispatch<React.SetStateAction<any>>;
    setTabIndex: React.Dispatch<React.SetStateAction<any>>;
    setRecordsData: React.Dispatch<React.SetStateAction<any>>;
    recordsDataRef: any;

    // Fungsi showNewRecord
    setParamObjectDaftarPenerimaan: React.Dispatch<React.SetStateAction<any>>;
    setParamObjectDaftarPenerimaanPhu: React.Dispatch<React.SetStateAction<any>>;
    selectedModalJenisTransaksi: any;

    additionalData: any;
    handleRefreshData: () => void;
    setTabs: React.Dispatch<React.SetStateAction<any>>;

    // State Untuk Transkasi BM
    setModalHandleDataBMPOS: React.Dispatch<React.SetStateAction<any>>;
    setStatusPagePOS: React.Dispatch<React.SetStateAction<any>>;
    setModalHandleDataBM: React.Dispatch<React.SetStateAction<any>>;
    setStatusPage: React.Dispatch<React.SetStateAction<any>>;
    setBaru: React.Dispatch<React.SetStateAction<any>>;

    // State Untuk Transaksi BK
    setMasterDataState: React.Dispatch<React.SetStateAction<any>>;
    setMasterKodeDokumen: React.Dispatch<React.SetStateAction<any>>;
    setJenisUpdateBKK: React.Dispatch<React.SetStateAction<any>>;
    setCON_BKK: React.Dispatch<React.SetStateAction<any>>;
    setIsFilePendukungBk: React.Dispatch<React.SetStateAction<any>>;
}
