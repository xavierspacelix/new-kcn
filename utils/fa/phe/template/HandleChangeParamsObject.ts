export interface HandleChangeParamsObject {
    tipe: string;
    valueObject: any;
    kode_entitas: string;
    token: string;
    userid: string;
    entitas: string;
    vRefreshData: any;
    setStateDataHeaderList: React.Dispatch<React.SetStateAction<any>>;
    setRecordsData: React.Dispatch<React.SetStateAction<any>>;
    setRecordsDataApprove: React.Dispatch<React.SetStateAction<any>>;
    setRecordsDataBayar: React.Dispatch<React.SetStateAction<any>>;
    setFilteredData: React.Dispatch<React.SetStateAction<any>>;
    setFilteredDataApproval: React.Dispatch<React.SetStateAction<any>>;
    setFilteredDataBaru: React.Dispatch<React.SetStateAction<any>>;

    setMasterDataState: React.Dispatch<React.SetStateAction<any>>;
    setMasterKodeDokumen: React.Dispatch<React.SetStateAction<any>>;
    setDialogInputDataVisible: React.Dispatch<React.SetStateAction<any>>;
    setRefreshKey: React.Dispatch<React.SetStateAction<any>>;
    setStateDataParams: React.Dispatch<React.SetStateAction<any>>;

    recordsData: any;
    recordsDataApprove: any;
    recordsDataBayar: any;

    masterDataState: any;
    masterKodeDokumen: any;
    dialogInputDataVisible: any;
    refreshKey: any;
    stateDataParams: any;

    // handleRefreshData: () => void;
}
