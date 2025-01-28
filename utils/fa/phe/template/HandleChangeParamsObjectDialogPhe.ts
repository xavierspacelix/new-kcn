export interface HandleChangeParamsObjectDialogPhe {
    tipe: string;
    valueObject: any;
    kode_entitas: string;
    token: string;
    userid: string;
    entitas: string;
    vRefreshData: any;
    setStateDataHeader: React.Dispatch<React.SetStateAction<any>>;
    setStateDataFooter: React.Dispatch<React.SetStateAction<any>>;
    setDataAlokasiPembayaran: React.Dispatch<React.SetStateAction<any>>;
    stateDataHeader: any;
    stateDataFooter: any;
    dataAlokasiPembayaran: any;
    gridPheListRef: any;
    gridPheJurnalListRef: any;
    masterDataState: any;
    idAlokasiDana: any;

    setPlagButtonbayarInvoice: React.Dispatch<React.SetStateAction<any>>;
    setTipeSelectedBersihkangambar: React.Dispatch<React.SetStateAction<any>>;
    setLoadFilePendukung: React.Dispatch<React.SetStateAction<any>>;
    setSelectedBersihkangambar: React.Dispatch<React.SetStateAction<any>>;
    setImages: React.Dispatch<React.SetStateAction<any>>;
    setSelectedFiles: React.Dispatch<React.SetStateAction<any>>;
    tabs: any;
    loadFilePendukung: any;
    selectedFile: any;
    formattedName: any;
    setNamaFiles: React.Dispatch<React.SetStateAction<any>>;
    setFileGambar: React.Dispatch<React.SetStateAction<any>>;
    fileGambar: any;
    masterKodeDokumen: any;
    setSelectedFile: React.Dispatch<React.SetStateAction<any>>;
    setZoomScale: React.Dispatch<React.SetStateAction<any>>;
    setIsDragging: React.Dispatch<React.SetStateAction<any>>;
    setOffset: React.Dispatch<React.SetStateAction<any>>;
    position: any;

    isDragging: any;
    setPosition: React.Dispatch<React.SetStateAction<any>>;
    offset: any;
    // handleRefreshData: () => void;
}
