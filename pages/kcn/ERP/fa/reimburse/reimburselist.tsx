import { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import 'tippy.js/dist/tippy.css';
import styles from './reimburselist.module.css';
import { useRouter } from 'next/router';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
import FilePendukung from './modal/filePendukung';

import { Dialog, Transition } from '@headlessui/react';
import swal from 'sweetalert2';

import { useSession } from '@/pages/api/sessionContext';

// interface Props {
//     userid: any;
//     kode_entitas: any;
// }

export default function reimburseList() {
    const { sessionData, isLoading } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';

    if (isLoading) {
        return;
    }

    type ReimbursementItem = {
        id: any;
        kode_dokumen: any;
        approved_date: any;
        entitas: string;
        request_no: string;
        nip: string;
        nama_karyawan: string;
        jenis_klaim: string;
        jumlah_rp: any;
        catatan: string;
        link_gambar: string;
        nama_bank: string;
        nama_pemilik_rek: string;
        proses: any;
        cair: any;
        tgl_cair: any;
        userid_cair: any;
        id_dokumen: any;
        currentProses: any;
        tgl_proses: any;
        no_rekening: any;
        export_id: any;

        //tambahan dari data hris
        kode_jabatan: any;
        note_approval: any;
        requestedby: any;
        reim_receiptdate: any;
        reqcancel_no: any;
        modified_by: any;
        created_by: any;
        requestdate: any;
        approval_status: any;
        refdoc: any;
        reim_startdate: any;
        nama_rekening: any;
        reimbalance_id: any;
        paid_date: any;
        reimcost: any;
        approvedcost: any;
        remark: any;
        company_code: any;
        reimrequest_id: any;
        cancelsts: any;
        reim_code: any;
        nama_jabatan: any;
        paid_status: any;
        costcenter_code: any;
        tipe_klaim: any;
        reim_enddate: Date;
        reim_source: any;
        no_urut: any;
        requestfor: any;
        email: any;
        created_date: any;
        email_karyawan: any;

        //loan
        loan_id: any;
        loan_code: any;
        tipe_loan: any;
        loan_receiptdate: any;
        loan_startdate: any;
        loan_enddate: any;
        loancost: any;
        jenis_loan: any;

        //onduty
        onduty_id: any;
        onduty_code: any;
        tipe_onduty: any;
        onduty_receiptdate: any;
        onduty_startdate: any;
        onduty_enddate: any;
        ondutycost: any;
        jenis_onduty: any;
        diff_cost: any;
    };

    type CheckboxItem = {
        id: any;
        label: string;
        checked?: boolean;
    };

    const [selectedLinkGambar, setSelectedLinkGambar] = useState<any>('');
    const [filePendukungModal, setFilePendukungModal] = useState(false);

    const router = useRouter();

    // Visible panel sidebar
    const [panelVisible, setPanelVisible] = useState(true);

    const handleTogglePanel = () => {
        setPanelVisible(!panelVisible);
    };
    const handleFilterClick = () => {
        setPanelVisible(true);
    };

    // Fetch and process data
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [recordsDataTab1, setRecordsDataTab1] = useState<ReimbursementItem[]>([]);
    const [recordsDataTab2, setRecordsDataTab2] = useState<ReimbursementItem[]>([]);
    const [recordsDataTab3, setRecordsDataTab3] = useState<ReimbursementItem[]>([]);

    //Data Reimburse :
    const [responseDataReimburseHRISGlobal, setResponseDataReimburseHRISGlobal] = useState<ReimbursementItem[]>([]);
    const filteredReimburseHRISGlobal = responseDataReimburseHRISGlobal.filter((item) => item.jenis_klaim !== 'Premi BPJS Kes (Hanya 1 Tipe Request Saja)'); // reimburse kecuali bpjs

    //Start date and end date
    const currentDate = new Date();
    const endDateNow = new Date(currentDate);
    endDateNow.setDate(currentDate.getDate() + 1);
    const endDate = endDateNow.toISOString().split('T')[0];

    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 2);
    const resultStartDate = startDate.toISOString().split('T')[0];

    const [startDateKlaimHRIS, setStartDateKlaimHRIS] = useState(resultStartDate);
    const [endDateKlaimHRIS, setEndDateKlaimHRIS] = useState(endDate);

    // console.log('startDateKlaimHRIS :', startDateKlaimHRIS);
    // console.log('endDateKlaimHRIS :', endDateKlaimHRIS);

    //Data Reimburse
    const updateKlaimReimburse = async () => {
        try {
            const reimburseListHRIS = await axios.get(`${apiUrl}/erp/reimburs?start_date=${startDateKlaimHRIS}&end_date=${endDateKlaimHRIS}`);
            return reimburseListHRIS.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    //Data Loan :
    const [responseDataLoanHRISGlobal, setResponseDataLoanHRISGlobal] = useState<ReimbursementItem[]>([]);

    const updateklaimLoan = async () => {
        try {
            const loanListHRIS = await axios.get(`${apiUrl}/erp/loan_duty?start_date=${startDateKlaimHRIS}&end_date=${endDateKlaimHRIS}&endpoint=kencanagroup_FULL_SFLoanData`);
            return loanListHRIS.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    //Data onDuty Request :
    const [responseDataOnDutyReqHRISGlobal, setResponseDataOnDutyReqHRISGlobal] = useState<ReimbursementItem[]>([]);

    const updateklaimOnDutyReq = async () => {
        try {
            const onDutyReqListHRIS = await axios.get(`${apiUrl}/erp/loan_duty?start_date=${startDateKlaimHRIS}&end_date=${endDateKlaimHRIS}&endpoint=kencanagroup_FULL_SFOnDutyRequestData`);
            return onDutyReqListHRIS.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    //Data onDuty Declaration :
    const [responseDataOnDutyDecHRISGlobal, setResponseDataOnDutyDecHRISGlobal] = useState<ReimbursementItem[]>([]);

    const updateklaimOnDutyDec = async () => {
        try {
            const onDutyDecListHRIS = await axios.get(`${apiUrl}/erp/loan_duty?start_date=${startDateKlaimHRIS}&end_date=${endDateKlaimHRIS}&endpoint=kencanagroup_FULL_SFOnDutyDeclarationData`);
            return onDutyDecListHRIS.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchDataReimburseHRIS = async () => {
            const responseDataHRIS = await updateKlaimReimburse();
            setResponseDataReimburseHRISGlobal(responseDataHRIS);
        };

        const fetchDataLoanHRIS = async () => {
            const responseDataHRIS = await updateklaimLoan();
            setResponseDataLoanHRISGlobal(responseDataHRIS);
        };

        const fetchDataOnDutyReqHRIS = async () => {
            const responseDataHRIS = await updateklaimOnDutyReq();
            setResponseDataOnDutyReqHRISGlobal(responseDataHRIS);
        };

        const fetchDataOnDutyDecHRIS = async () => {
            const responseDataHRIS = await updateklaimOnDutyDec();
            setResponseDataOnDutyDecHRISGlobal(responseDataHRIS);
        };
        fetchDataReimburseHRIS();
        fetchDataLoanHRIS();
        fetchDataOnDutyReqHRIS();
        fetchDataOnDutyDecHRIS();
    }, []);

    console.log(
        'filteredReimburseHRISGlobal: ',
        filteredReimburseHRISGlobal,
        'responseDataLoanHRISGlobal:',
        responseDataLoanHRISGlobal,
        'responseDataOnDutyReqHRISGlobal:',
        responseDataOnDutyReqHRISGlobal,
        'responseDataOnDutyDecHRISGlobal:',
        responseDataOnDutyDecHRISGlobal,
    );

    const [totalRecordsData, setTotalRecordsData] = useState(0);
    //const [entitasUsed, setEntitasUsed] = useState('99999');
    const [entitasUsed, setEntitasUsed] = useState('898');

    useEffect(() => {
        const fetchDataUseEffect = async () => {
            try {
                const currentDate = new Date();

                //param
                const startDateParam = currentDate.toISOString().split('T')[0];
                const endDateConvert = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                1;
                endDateConvert.setDate(endDateConvert.getDate() + 1);
                const endDateParam = endDateConvert.toISOString().split('T')[0];

                const reimburseList = await axios.post(`${apiUrl}/erp/detail_reimbursement`, {
                    entitas: kode_entitas,
                    //entitas: entitasUsed,
                    //param: '',
                    param: `where approved_date BETWEEN '${startDateParam}' AND '${endDateParam}'`,
                });
                const responseData = reimburseList.data.data;

                const transformedData: ReimbursementItem[] = responseData.map((item: any, index: number) => ({
                    id: item.reimrequest_id,
                    kode_dokumen: item.kode_dokumen,
                    approved_date: moment(item.approved_date).format('DD-MM-YYYY'),
                    entitas: item.entitas,
                    request_no: item.request_no,
                    nip: item.nip,
                    nama_karyawan: item.nama_karyawan,
                    jenis_klaim: item.jenis_klaim,
                    jumlah_rp: new Intl.NumberFormat('id-ID').format(item.jumlah_rp),
                    catatan: item.catatan,
                    link_gambar: item.link_gambar,
                    nama_bank: item.nama_bank,
                    nama_pemilik_rek: item.nama_pemilik_rek,
                    proses: item.proses,
                    cair: item.cair,
                    tgl_cair: item.tgl_cair ? moment(item.tgl_cair).format('DD-MM-YYYY') : null,
                    id_dokumen: item.id_dokumen,
                    no_rekening: item.no_rekening,
                    export_id: item.export_id,
                    tgl_proses: item.tgl_proses ? moment(item.tgl_proses).format('DD-MM-YYYY') : null,
                    reimrequest_id: item.reimrequest_id,
                    userid_proses: item.userid_proses,
                    reim_receiptdate: item.reim_receiptdate ? moment(item.reim_receiptdate).format('DD-MM-YYYY') : null,
                    requestdate: item.requestdate ? moment(item.requestdate).format('DD-MM-YYYY') : null,
                    email_karyawan: item.email_karyawan,
                    nama_dokumen: item.nama_dokumen,

                    //loan
                    loan_id: item.loan_id,
                    loan_code: item.loan_code,
                    tipe_loan: item.tipe_loan,
                    loan_receiptdate: item.loan_receiptdate,
                    loan_startdate: item.loan_startdate,
                    loan_enddate: item.loan_enddate,
                    loancost: new Intl.NumberFormat('id-ID').format(item.loancost),
                    jenis_loan: item.jenis_loan,
                    company_code: item.company_code,

                    diff_cost: new Intl.NumberFormat('id-ID').format(item.diff_cost),
                }));

                const filteredRecordsTab1 = transformedData.filter((record) => record.proses === 'N' && record.cair === 'N');
                const filteredRecordsTab2 = transformedData.filter((record) => record.proses === 'Y' && record.cair === 'N');
                const filteredRecordsTab3 = transformedData.filter((record) => record.proses === 'Y' && record.cair === 'Y');
                setTotalRecordsTab1(filteredRecordsTab1.length);
                setTotalRecordsTab2(filteredRecordsTab2.length);
                setTotalRecordsTab3(filteredRecordsTab3.length);
                setAllRecordsTab1(filteredRecordsTab1);
                setAllRecordsTab2(filteredRecordsTab2);
                setAllRecordsTab3(filteredRecordsTab3);

                setAllRecords(transformedData);
                setTotalRecordsData(transformedData.length);
                setShowTabPanel(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataUseEffect();
    }, []);

    const fetchData = async () => {
        try {
            const currentDate = new Date();

            const startDatesConvert = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            startDatesConvert.setDate(startDatesConvert.getDate() + 1);
            const startDate = startDatesConvert.toISOString().split('T')[0];

            const endDateConvert = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            endDateConvert.setDate(endDateConvert.getDate() + 1);
            const endDate = endDateConvert.toISOString().split('T')[0];

            const reimburseList = await axios.post(`${apiUrl}/erp/detail_reimbursement`, {
                entitas: kode_entitas,
                //entitas: entitasUsed,
                // param: `where approved_date BETWEEN '2023-08-01' AND '${endDate}'`,
                param: ``,
            });

            const responseData = reimburseList.data.data;
            const transformedData: ReimbursementItem[] = responseData.map((item: any, index: number) => ({
                id: item.reimrequest_id,
                kode_dokumen: item.kode_dokumen,
                approved_date: moment(item.approved_date).format('DD-MM-YYYY'),
                entitas: item.entitas,
                request_no: item.request_no,
                nip: item.nip,
                nama_karyawan: item.nama_karyawan,
                jenis_klaim: item.jenis_klaim,
                jumlah_rp: new Intl.NumberFormat('id-ID').format(item.jumlah_rp),
                catatan: item.catatan,
                link_gambar: item.link_gambar,
                nama_bank: item.nama_bank,
                nama_pemilik_rek: item.nama_pemilik_rek,
                proses: item.proses,
                cair: item.cair,
                tgl_cair: item.tgl_cair ? moment(item.tgl_cair).format('DD-MM-YYYY') : null,
                userid_cair: item.userid_cair,
                id_dokumen: item.id_dokumen,
                no_rekening: item.no_rekening,
                export_id: item.export_id,
                tgl_proses: item.tgl_proses ? moment(item.tgl_proses).format('DD-MM-YYYY') : null,
                reimrequest_id: item.reimrequest_id,
                userid_proses: item.userid_proses,
                reim_receiptdate: item.reim_receiptdate ? moment(item.reim_receiptdate).format('DD-MM-YYYY') : null,
                email_karyawan: item.email_karyawan,
                requestdate: item.requestdate ? moment(item.requestdate).format('DD-MM-YYYY') : null,
                nama_dokumen: item.nama_dokumen,

                //loan
                loan_id: item.loan_id,
                loan_code: item.loan_code,
                tipe_loan: item.tipe_loan,
                loan_receiptdate: item.loan_receiptdate,
                loan_startdate: item.loan_startdate,
                loan_enddate: item.loan_enddate,
                loancost: item.loancost,
                jenis_loan: item.jenis_loan,
                company_code: item.company_code,

                diff_cost: new Intl.NumberFormat('id-ID').format(item.diff_cost),
            }));
            const filteredRecordsTab1 = transformedData.filter((record) => record.proses === 'N' && record.cair === 'N');
            const filteredRecordsTab2 = transformedData.filter((record) => record.proses === 'Y' && record.cair === 'N');
            const filteredRecordsTab3 = transformedData.filter((record) => record.proses === 'Y' && record.cair === 'Y');
            const totalFilteredTab1 = filteredRecordsTab1.length;
            const totalFilteredTab2 = filteredRecordsTab2.length;
            const totalFilteredTab3 = filteredRecordsTab3.length;
            setAllRecordsTab1(filteredRecordsTab1);
            setAllRecordsTab2(filteredRecordsTab2);
            setAllRecordsTab3(filteredRecordsTab3);
            setTotalRecordsTab1(totalFilteredTab1);
            setTotalRecordsTab2(totalFilteredTab2);
            setTotalRecordsTab3(totalFilteredTab3);
            if (totalFilteredTab1 === 0) {
                setRecordsDataTab1([]);
            }
            if (totalFilteredTab2 === 0) {
                setRecordsDataTab2([]);
            }
            if (totalFilteredTab3 === 0) {
                setRecordsDataTab3([]);
            }
            setAllRecords(transformedData);
            setTotalRecordsData(transformedData.length);
            setShowTabPanel(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // const [executeRefresh, setExecuteRefresh] = useState(false);
    // useEffect(() => {
    //     if (executeRefresh) {
    //         fetchData();
    //         setExecuteRefresh(false);
    //     }
    // }, [executeRefresh, executeRefresh]);

    const [searchKeyword, setSearchKeyword] = useState('');

    // pagination
    const [pageTab, setPageTab] = useState(1);
    const [pageTab1, setPageTab1] = useState(1);
    const [pageTab2, setPageTab2] = useState(1);
    const [pageTab3, setPageTab3] = useState(1);
    const PAGE_SIZES = [40, 500, 1000];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [allRecords, setAllRecords] = useState<ReimbursementItem[]>([]);
    const [totalRecordsTab1, setTotalRecordsTab1] = useState(0);
    const [totalRecordsTab2, setTotalRecordsTab2] = useState(0);
    const [totalRecordsTab3, setTotalRecordsTab3] = useState(0);
    const [allRecordsTab1, setAllRecordsTab1] = useState<ReimbursementItem[]>([]);
    const [allRecordsTab2, setAllRecordsTab2] = useState<ReimbursementItem[]>([]);
    const [allRecordsTab3, setAllRecordsTab3] = useState<ReimbursementItem[]>([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'kode_dokumen',
        direction: 'desc',
    });

    useEffect(() => {
        setPageTab(1);
        setPageTab1(1);
        setPageTab2(1);
        setPageTab3(1);
    }, [pageSize, searchKeyword]);

    useEffect(() => {
        const Pagination = (records: any, page: any, totalRecords: any, recordsDataSetter: any) => {
            if (totalRecords) {
                const from = (page - 1) * pageSize;
                const to = Math.min(from + pageSize, totalRecords);

                const sortedData = [...records].sort((a, b) => {
                    const columnAccessor = sortStatus.columnAccessor as keyof ReimbursementItem;
                    const direction = sortStatus.direction === 'asc' ? 1 : -1;

                    if (a[columnAccessor] < b[columnAccessor]) return -direction;
                    if (a[columnAccessor] > b[columnAccessor]) return direction;
                    return 0;
                });

                // filter berdasarkan kata kunci pencarian
                const filteredData = sortedData.filter((record: any) => {
                    const searchableColumns = ['catatan'];
                    return searchableColumns.some((column) => record[column].toLowerCase().includes(searchKeyword.toLowerCase()));
                });

                // const dataToDisplay = sortedData.slice(from, to);
                const dataToDisplay = filteredData.slice(from, to);
                recordsDataSetter(dataToDisplay);
            }
        };
        Pagination(allRecords, pageTab, totalRecordsData, setAllRecords);
        Pagination(allRecordsTab1, pageTab1, totalRecordsTab1, setRecordsDataTab1);
        Pagination(allRecordsTab2, pageTab2, totalRecordsTab2, setRecordsDataTab2);
        Pagination(allRecordsTab3, pageTab3, totalRecordsTab3, setRecordsDataTab3);
    }, [pageTab, pageTab1, pageTab2, pageTab3, pageSize, sortStatus, allRecordsTab1, allRecordsTab2, allRecordsTab3, totalRecordsTab1, totalRecordsTab2, totalRecordsTab3, searchKeyword]);

    const [showTabPanel, setShowTabPanel] = useState(false);

    //checkbox entitas
    const [checkboxItems, setCheckboxItems] = useState<CheckboxItem[]>([
        { id: 100, label: '100', checked: false },
        { id: 102, label: '102', checked: false },
        { id: 103, label: '103', checked: false },
        { id: 104, label: '104', checked: false },
        { id: 105, label: '105', checked: false },
        { id: 106, label: '106', checked: false },
        { id: 107, label: '107', checked: false },
        { id: 109, label: '109', checked: false },
        { id: 110, label: '110', checked: false },
        { id: 111, label: '111', checked: false },
        { id: 112, label: '112', checked: false },
        { id: 113, label: '113', checked: false },
        { id: 114, label: '114', checked: false },
        { id: 116, label: '116', checked: false },
        { id: 121, label: '121', checked: false },
        { id: 122, label: '122', checked: false },
        { id: 300, label: '300', checked: false },
        { id: 898, label: '898', checked: false },
    ]);

    // checkbox entitas
    const handleCheckboxChange = (id: string) => {
        setCheckboxItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    const handleSelectAll = () => {
        const allChecked = checkboxItems.every((item) => item.checked);
        setCheckboxItems((prevItems) =>
            prevItems.map((item) => ({
                ...item,
                checked: !allChecked,
            })),
        );
    };

    //checkbox no_pengajuan, nama_karyawan dan jenis_klaim
    const [noPengajuanValue, setNoPengajuanValue] = useState<string>('');
    const [isNoPengajuanChecked, setIsNoPengajuanChecked] = useState<boolean>(false);

    const [namaKaryawanValue, setNamaKaryawanValue] = useState<string>('');
    const [isNamaKaryawanChecked, setIsNamaKaryawanChecked] = useState<boolean>(false);

    const [jenisKlaimValue, setJenisKlaimValue] = useState<string>('');
    const [isJenisKlaimChecked, setIsJenisKlaimChecked] = useState<boolean>(false);

    const [catatanValue, setCatatanValue] = useState<string>('');
    const [isCatatanKlaimChecked, setIsCatatanKlaimChecked] = useState<boolean>(false);

    const handleNoPengajuanInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setNoPengajuanValue(newValue);
        setIsNoPengajuanChecked(newValue.length > 0);
    };

    const handleNamaKaryawanInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setNamaKaryawanValue(newValue);
        setIsNamaKaryawanChecked(newValue.length > 0);
    };

    const handleJenisKlaimInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setJenisKlaimValue(newValue);
        setIsJenisKlaimChecked(newValue.length > 0);
    };

    const handleCatatanInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setCatatanValue(newValue);
        setIsCatatanKlaimChecked(newValue.length > 0);
    };

    // Flatpickr Approved Date
    const [date1, setDate1] = useState<moment.Moment>(moment());
    const [date2, setDate2] = useState<moment.Moment>(moment().endOf('month'));

    const [isDateRangeChecked, setIsDateRangeChecked] = useState<boolean>(true);

    async function showLoading() {
        let timerInterval;

        swal.fire({
            title: '<strong>Loading...</strong>',
            padding: '3em',
            text: 'Mohon menunggu',
            imageUrl: '/assets/images/loader-1.gif',
            imageWidth: 170,
            imageHeight: 170,
            imageAlt: 'Custom image',
            background: 'rgba(0,0,0,.0)',
            backdrop: 'rgba(0,0,0,0.0)',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
        });
    }

    const refreshData = async () => {
        showLoading();
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                const selectedEntities = checkboxItems.filter((item) => item.checked).map((item) => item.label);
                const paramArray = [];

                if (isNoPengajuanChecked) paramArray.push(`request_no LIKE '%${noPengajuanValue}%'`);
                if (isNamaKaryawanChecked) paramArray.push(`nama_karyawan LIKE '%${namaKaryawanValue}%'`);
                if (isJenisKlaimChecked) paramArray.push(`jenis_klaim LIKE '%${jenisKlaimValue}%'`);
                if (isCatatanKlaimChecked) paramArray.push(`catatan LIKE '%${catatanValue}%'`);
                if (selectedEntities.length > 0) paramArray.push(`entitas IN ('${selectedEntities.join("', '")}')`);
                if (isDateRangeChecked) {
                    const formattedDate1 = date1.format('YYYY-MM-DD');
                    const formattedDate2 = date2.format('YYYY-MM-DD');
                    paramArray.push(`approved_date BETWEEN '${formattedDate1}' AND '${formattedDate2}'`);
                }

                const param = paramArray.join(' AND ');

                const response = await axios.post(`${apiUrl}/erp/detail_reimbursement`, {
                    entitas: kode_entitas,
                    //entitas: entitasUsed,
                    param: param ? `WHERE ${param}` : '',
                });

                const responseData = response.data.data;
                const transformedData: ReimbursementItem[] = responseData.map((item: any, index: any) => ({
                    id: item.reimrequest_id,
                    kode_dokumen: item.kode_dokumen,
                    approved_date: moment(item.approved_date).format('DD-MM-YYYY'),
                    entitas: item.entitas,
                    request_no: item.request_no,
                    nip: item.nip,
                    nama_karyawan: item.nama_karyawan,
                    jenis_klaim: item.jenis_klaim,
                    jumlah_rp: new Intl.NumberFormat('id-ID').format(item.jumlah_rp),
                    catatan: item.catatan,
                    link_gambar: item.link_gambar,
                    nama_bank: item.nama_bank,
                    nama_pemilik_rek: item.nama_pemilik_rek,
                    proses: item.proses,
                    cair: item.cair,
                    tgl_cair: item.tgl_cair ? moment(item.tgl_cair).format('DD-MM-YYYY') : null,
                    userid_cair: item.userid_cair,
                    id_dokumen: item.id_dokumen,
                    no_rekening: item.no_rekening,
                    export_id: item.export_id,
                    tgl_proses: item.tgl_proses ? moment(item.tgl_proses).format('DD-MM-YYYY') : null,
                    reimrequest_id: item.reimrequest_id,
                    userid_proses: item.userid_proses,
                    reim_receiptdate: item.reim_receiptdate ? moment(item.reim_receiptdate).format('DD-MM-YYYY') : null,
                    email_karyawan: item.email_karyawan,
                    requestdate: item.requestdate ? moment(item.requestdate).format('DD-MM-YYYY') : null,
                    nama_dokumen: item.nama_dokumen,

                    //loan
                    loan_id: item.loan_id,
                    loan_code: item.loan_code,
                    tipe_loan: item.tipe_loan,
                    loan_receiptdate: item.loan_receiptdate,
                    loan_startdate: item.loan_startdate,
                    loan_enddate: item.loan_enddate,
                    loancost: item.loancost,
                    jenis_loan: item.jenis_loan,
                    company_code: item.company_code,

                    diff_cost: new Intl.NumberFormat('id-ID').format(item.diff_cost),
                }));
                const filteredRecordsTab1 = transformedData.filter((record) => record.proses === 'N' && record.cair === 'N');
                const filteredRecordsTab2 = transformedData.filter((record) => record.proses === 'Y' && record.cair === 'N');
                const filteredRecordsTab3 = transformedData.filter((record) => record.proses === 'Y' && record.cair === 'Y');
                const totalFilteredTab1 = filteredRecordsTab1.length;
                const totalFilteredTab2 = filteredRecordsTab2.length;
                const totalFilteredTab3 = filteredRecordsTab3.length;
                setAllRecordsTab1(filteredRecordsTab1);
                setAllRecordsTab2(filteredRecordsTab2);
                setAllRecordsTab3(filteredRecordsTab3);
                setTotalRecordsTab1(totalFilteredTab1);
                setTotalRecordsTab2(totalFilteredTab2);
                setTotalRecordsTab3(totalFilteredTab3);
                if (totalFilteredTab1 === 0) {
                    setRecordsDataTab1([]);
                }
                if (totalFilteredTab2 === 0) {
                    setRecordsDataTab2([]);
                }
                if (totalFilteredTab3 === 0) {
                    setRecordsDataTab3([]);
                }
                setAllRecords(transformedData);
                setTotalRecordsData(transformedData.length);
                setShowTabPanel(true);
            } catch (error) {
                console.error(error);
            }
        }
        if (kode_entitas == null || kode_entitas == '') {
            alert('Silahkan Login Kembali, Session Habis');
            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        }
        swal.close();
    };

    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const handleRowClick = (record: any, index: number) => {
        if (selectedRowIndex === index) {
        } else {
            setSelectedRow(record);
            setSelectedRowIndex(index);
        }
    };

    const [iconStatesProses, setIconStatesProses] = useState({});
    const [iconStatesCair, setIconStatesCair] = useState({});

    const [confirmProsesModal, setConfirmProsesModal] = useState(false);
    const [confirmMultiProsesModal, setConfirmMultiProsesModal] = useState(false);

    const [prosesDataModal, setProsesDataModal] = useState<any>({
        nama_karyawan: '',
        kode_dokumen: '',
        id_dokumen: '',
        userid: '',
        diff_cost: '',
        reimrequest_id: '',
    });

    const handleClickProses = async (kode_dokumen: any, id_dokumen: any, userid: any, diff_cost: any, reimrequest_id: any) => {
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                const response = await axios.post(`${apiUrl}/erp/detail_reimbursement`, {
                    entitas: entitasUsed,
                    param: `WHERE kode_dokumen = '${kode_dokumen}' AND id_dokumen = '${id_dokumen}'`,
                });

                const data = response.data.data[0];
                const updatedCurrentProses = data.proses;
                const newProses = updatedCurrentProses === 'Y' ? 'N' : 'Y';

                let patchData;
                let patchProses;
                let patchCair;

                if (reimrequest_id?.startsWith('DCLR') && diff_cost?.charAt(0) !== '-') {
                    patchData = {
                        entitas: entitasUsed,
                        kode_dokumen,
                        proses: 'Y',
                        tgl_proses: moment().format('YYYY-MM-DD'),
                        id_dokumen,
                        userid_proses: userid,
                    };

                    patchProses = await axios.patch(`${apiUrl}/erp/update_detail_reimbursement`, [patchData]);

                    const cairPatchData = [
                        {
                            entitas: entitasUsed,
                            kode_dokumen,
                            id_dokumen,
                            cair: 'Y',
                            userid_cair: userid,
                            tgl_cair: moment().format('YYYY-MM-DD'),
                        },
                    ];
                    patchCair = await axios.patch(`${apiUrl}/erp/update_tglcair_reimbursement`, cairPatchData);
                } else {
                    patchData = {
                        entitas: entitasUsed,
                        kode_dokumen,
                        proses: newProses,
                        id_dokumen,
                        userid_proses: newProses === 'Y' ? userid : null,
                        tgl_proses: newProses === 'Y' ? moment().format('YYYY-MM-DD') : '',
                    };

                    patchProses = await axios.patch(`${apiUrl}/erp/update_detail_reimbursement`, [patchData]);
                }

                if (patchProses.data.status || patchCair?.data.status) {
                    fetchData();
                    console.log('Permintaan PATCH Proses berhasil.');
                } else {
                    console.log('Permintaan PATCH Proses gagal.');
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        } else {
            alert('Silahkan Login Kembali, Session Habis');
            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        }
    };

    const handleClickCair = async (kode_dokumen: any, id_dokumen: any, userid: any) => {
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                const response = await axios.post(`${apiUrl}/erp/detail_reimbursement`, {
                    entitas: entitasUsed,
                    param: `WHERE kode_dokumen = '${kode_dokumen}' AND id_dokumen = '${id_dokumen}'`,
                });

                const data = response.data.data[0];
                const updatedCurrentCair = data.cair;
                const newCair = updatedCurrentCair === 'Y' ? 'N' : 'Y';

                const patchData = [
                    {
                        entitas: entitasUsed,
                        kode_dokumen,
                        id_dokumen,
                        cair: newCair,
                        userid_cair: newCair === 'Y' ? userid : null,
                        tgl_cair: moment().format('YYYY-MM-DD'),
                    },
                ];

                const patchResponse = await axios.patch(`${apiUrl}/erp/update_tglcair_reimbursement`, patchData);

                if (patchResponse.data.status) {
                    fetchData();
                    console.log('Permintaan PATCH Cair berhasil.');
                } else {
                    console.log('Permintaan PATCH Cair gagal.');
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
        if (kode_entitas == null || kode_entitas == '') {
            alert('Silahkan Login Kembali, Session Habis');
            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        }
    };

    const [selectedDates, setSelectedDates] = useState([]);

    const handleClickTanggalCair = async (kode_dokumen: any, id_dokumen: any, userid: any, cair: any, selectedDate: any) => {
        if (kode_entitas !== null || kode_entitas !== '') {
            try {
                const patchData = [
                    {
                        entitas: entitasUsed,
                        kode_dokumen,
                        id_dokumen,
                        cair: 'Y',
                        userid_cair: userid,
                        tgl_cair: moment(selectedDate).format('YYYY-MM-DD'),
                    },
                ];

                const patchResponse = await axios.patch(`${apiUrl}/erp/update_tglcair_reimbursement`, patchData);

                if (patchResponse.data.status) {
                    fetchData();
                    console.log('Permintaan PATCH Cair berhasil.');
                } else {
                    console.log('Permintaan PATCH Cair gagal.');
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
        if (kode_entitas == null || kode_entitas == '') {
            alert('Silahkan Login Kembali, Session Habis');
            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        }
    };

    const exportToExcel = async () => {
        const moment = require('moment');
        const currentDate = moment().format('YYMMDD');
        const exportId = `${currentDate}`;

        const filteredData = recordsDataTab2.filter((record) => record.proses === 'Y' && record.cair === 'N' && record.export_id == exportId);
        const filteredData2 = recordsDataTab2.filter((record) => record.proses === 'Y' && record.cair === 'N' && record.export_id == null);

        const dataToExport = filteredData.map((record, index) => {
            const baseNumber = 201;
            const noTransactionID = `${currentDate}${(index + baseNumber).toString().padStart(3, '0')}`;
            return {
                'No.': (index + 1).toString().padStart(3, '0'),
                'Transaction ID': noTransactionID,
                'Transfer Type': 'BCA',
                'Debited Acc.': '1763693698',
                'Beneficiary ID': '',
                'Credited Acc.': record.no_rekening,
                //Amount: record.jumlah_rp.replace(/\./g, ''),
                Amount: record.diff_cost.charAt(0) !== '-' ? record.jumlah_rp.replace(/\./g, '') : record.diff_cost.substring(1).replace(/\./g, ''),
                'Eff. Date': '',
                'Transaction Purpose': null,
                Currency: 'IDR',
                'Charges Type': 'BEN',
                'Charges Acc.': '1763693698',
                'Remark 1': `${record.entitas}-${record.request_no.slice(-3).padStart(3, '0')}`.substring(0, 17),
                'Remark 2': record.jenis_klaim.substring(0, 17),
                'Receiver Bank Cd': '',
                'Receiver Bank Name': 'BCA_Default',
                'Receiver Name': record.nama_karyawan,
                'Receiver Cust. Type': '1',
                'Receiver Cust. Residen': '1',
                'Transaction Cd': '88',
                'Beneficiary Email': record.email_karyawan,
            };
        });

        const XLSX = require('xlsx');
        const wb = XLSX.utils.book_new();

        // Patch data
        if (filteredData2.length > 0) {
            for (let index = 0; index < filteredData2.length; index++) {
                const record = filteredData2[index];

                try {
                    await axios.patch(`${apiUrl}/erp/update_exportid_reimbursement`, {
                        entitas: entitasUsed,
                        kode_dokumen: record.kode_dokumen,
                        id_dokumen: record.id_dokumen,
                        export_id: exportId,
                    });
                    fetchData();
                } catch (error) {
                    console.error(error);
                }
            }
        }

        const updatedDataToExport = [
            ...dataToExport,
            ...filteredData2.map((record, index) => {
                const baseNumber = 201 + filteredData.length;
                const noTransactionID = `${currentDate}${(index + baseNumber).toString().padStart(3, '0')}`;
                return {
                    'No.': (filteredData.length + index + 1).toString().padStart(3, '0'),
                    'Transaction ID': noTransactionID,
                    'Transfer Type': 'BCA',
                    'Debited Acc.': '1763693698',
                    'Beneficiary ID': '',
                    'Credited Acc.': record.no_rekening,
                    Amount: record.diff_cost.charAt(0) !== '-' ? record.jumlah_rp.replace(/\./g, '') : record.diff_cost.substring(1).replace(/\./g, ''),
                    'Eff. Date': '',
                    'Transaction Purpose': null,
                    Currency: 'IDR',
                    'Charges Type': 'BEN',
                    'Charges Acc.': '1763693698',
                    'Remark 1': `${record.entitas}-${record.request_no.slice(-3).padStart(3, '0')}`.substring(0, 17),
                    'Remark 2': record.jenis_klaim.substring(0, 17),
                    'Receiver Bank Cd': '',
                    'Receiver Bank Name': 'BCA_Default',
                    'Receiver Name': record.nama_karyawan,
                    'Receiver Cust. Type': '1',
                    'Receiver Cust. Residen': '1',
                    'Transaction Cd': '88',
                    'Beneficiary Email': record.email_karyawan,
                };
            }),
        ];

        const ws = XLSX.utils.json_to_sheet(updatedDataToExport);

        if (filteredData2.length > 0) {
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, `reimbursement_${currentDate}.xlsx`);
        } else {
            alert('Tidak Ada Data Baru, Silahkan Export Ulang Data Sebelumnya.');
        }
    };

    // Export ulang Excel
    const exportUlangToExcel = async (export_id: any) => {
        const filteredData = recordsDataTab2.filter((record) => record.proses === 'Y' && record.cair === 'N' && record.export_id === export_id);
        const currentDate = moment().format('YYMMDD');
        const dataToExport = filteredData.map((record, index) => {
            const baseNumber = 201;
            const noTransactionID = `${currentDate}${(index + baseNumber).toString().padStart(3, '0')}`;

            return {
                'No.': (index + 1).toString().padStart(3, '0'),
                'Transaction ID': noTransactionID,
                'Transfer Type': 'BCA',
                'Debited Acc.': '1763693698',
                'Beneficiary ID': '',
                'Credited Acc.': record.no_rekening,
                // Amount: record.jumlah_rp.replace(/\./g, ''),
                Amount: record.diff_cost.charAt(0) !== '-' ? record.jumlah_rp.replace(/\./g, '') : record.diff_cost.substring(1).replace(/\./g, ''),
                'Eff. Date': '',
                'Transaction Purpose': null,
                Currency: 'IDR',
                'Charges Type': 'BEN',
                'Charges Acc.': '1763693698',
                'Remark 1': `${record.entitas}-${record.request_no.slice(-3).padStart(3, '0')}`.substring(0, 17),
                'Remark 2': record.jenis_klaim.substring(0, 17),
                'Receiver Bank Cd': '',
                'Receiver Bank Name': 'BCA_Default',
                'Receiver Name': record.nama_karyawan,
                'Receiver Cust. Type': '1',
                'Receiver Cust. Residen': '1',
                'Transaction Cd': '88',
                'Beneficiary Email': record.email_karyawan,
            };
        });

        //alert jika no.rek kosong
        const noRekeningIsNull = filteredData.some((record) => (record.no_rekening === null || record.no_rekening === '') && record.proses === 'Y' && record.cair === 'N');

        if (noRekeningIsNull) {
            const employeesWithNullOrEmptyNoRekening = filteredData
                .filter((record) => record.no_rekening === null || record.no_rekening === '')
                .map((record) => record.nama_karyawan)
                .join(', ');

            alert(`Ada Karyawan dengan no_rekening Kosong: ${employeesWithNullOrEmptyNoRekening}`);
        }
        const XLSX = require('xlsx');

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        XLSX.writeFile(wb, `reimbursement_${currentDate}.xlsx`);
    };

    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalFailed, setModalFailed] = useState(false);

    const handleCloseModals = () => {
        setModalSuccess(false);
        setModalFailed(false);
        setConfirmProsesModal(false);
        setConfirmMultiProsesModal(false);
    };

    const checkExistingData = async (id: any) => {
        const url = 'http://202.138.230.123:4001/erp/detail_reimbursement';
        try {
            const response = await axios.post(url, {
                entitas: kode_entitas,
                //entitas: entitasUsed,
                param: `where approved_date between '${startDateKlaimHRIS}' AND '${endDateKlaimHRIS}'`,
            });
            const existingData = response.data.data;
            return existingData.some((item: any) => item.reimrequest_id === id || item.loan_id === id || item.onduty_id === id);
        } catch (error) {
            console.error('Terjadi kesalahan dalam memeriksa data yang sudah ada:', error);
            return false;
        }
    };

    const postdataHRISCombine = async () => {
        // showLoading();
        if (kode_entitas !== null || kode_entitas !== '') {
            // const url = `http://202.138.230.123:4001/erp/simpan_reimbursement_loan`;
            const url = `http://202.138.230.123:4001/erp/simpan_reimbursement_loan_duty`;
            const moment = require('moment');

            const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
            const currentTime = moment().format('YYMMDDHHmmss');
            const kodeDokumen = `RM_${currentTime}_898`;
            let currentIndex = 0;

            const mergedDetail = [];

            for (const data of filteredReimburseHRISGlobal) {
                //lakukan pengecekan, apakah reimrequest_id exist
                const exists = await checkExistingData(data.reimrequest_id);
                if (exists) {
                    continue;
                }

                const index = currentIndex;
                currentIndex++;

                mergedDetail.push({
                    entitas: data.costcenter_code,
                    kode_dokumen: kodeDokumen,
                    id_dokumen: `${index + 1}`,
                    dokumen: 'JU',
                    tgl_dokumen: created_at,
                    kode_akun: '1-11101',
                    kode_subledger: '',
                    kurs: '1.0000',
                    // debet_rp: data.reimcost, //approvedcost
                    debet_rp: data.approvedcost, //approvedcost
                    kredit_rp: 0.0,
                    // jumlah_rp: data.reimcost,
                    // jumlah_mu: data.reimcost,
                    jumlah_rp: data.approvedcost,
                    jumlah_mu: data.approvedcost,
                    catatan: (data.remark.length > 160 ? data.remark.substring(0, 160) : data.remark).replace(/'/g, ''),
                    no_warkat: '',
                    tgl_valuta: created_at,
                    persen: '0.00',
                    kode_dept: '',
                    kode_kerja: '',
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: created_at,
                    userid: data.created_by,
                    tgl_update: created_at,
                    audit: '',
                    kode_kry: data.requestedby,
                    kode_jual: 'KA',
                    proses: 'N',
                    nama_dokumen: 'KLAIMHRIS_Manual',
                    tipe_dokumen: 'HARIAN',
                    userid_proses: '',
                    tgl_proses: created_at,
                    nama_bank: data.nama_bank,
                    no_rekening: data.no_rekening,
                    nama_pemilik_rek: data.nama_rekening,
                    nip: data.nip,
                    nama_karyawan: data.nama_karyawan,
                    jenis_klaim: data.jenis_klaim,
                    link_gambar: data.refdoc,
                    tipe_klaim: data.tipe_klaim,
                    kode_jabatan: data.kode_jabatan,
                    nama_jabatan: data.nama_jabatan,
                    pilih: 'N',
                    note_approval: data.note_approval,
                    reim_receiptdate: moment(data.reim_receiptdate).format('YYYY-MM-DD HH:mm:ss'),
                    reqcancel_no: data.reqcancel_no,
                    requestdate: moment(data.requestdate).format('YYYY-MM-DD HH:mm:ss'),
                    approval_status: data.approval_status,
                    approved_date: moment(data.approved_date).format('YYYY-MM-DD HH:mm:ss'),
                    reim_startdate: moment(data.reim_startdate).format('YYYY-MM-DD HH:mm:ss'),
                    reimbalance_id: data.reimbalance_id,
                    paid_date: data.paid_date.substring(0, 25),
                    request_no: data.request_no,
                    reimrequest_id: data.reimrequest_id,
                    cancelsts: data.cancelsts,
                    reim_code: data.reim_code,
                    paid_status: data.paid_status,
                    reim_enddate: moment(data.reim_enddate).format('YYYY-MM-DD HH:mm:ss'),
                    reim_source: data.reim_source,
                    no_urut: data.no_urut,
                    requestfor: data.requestfor,
                    email_karyawan: data.email,
                    created_date: created_at,

                    //loan :
                    loan_id: '',
                    loan_code: '',
                    tipe_loan: '',
                    loan_receiptdate: '',
                    loan_startdate: '',
                    loan_enddate: '',
                    loancost: '',
                    jenis_loan: '',
                    company_code: '',

                    // onduty :
                    onduty_id: '',
                    onduty_code: '',
                    tipe_onduty: '',
                    onduty_receiptdate: '',
                    onduty_startdate: '',
                    onduty_enddate: '',
                    ondutycost: '',
                    jenis_onduty: '',
                    diff_cost: '',
                });
            }

            for (const data of responseDataLoanHRISGlobal) {
                //lakukan pengecekan, apakah loan_id exist
                const exists = await checkExistingData(data.loan_id);
                if (exists) {
                    continue;
                }

                const index = currentIndex;
                currentIndex++;

                mergedDetail.push({
                    entitas: data.costcenter_code,
                    kode_dokumen: kodeDokumen,
                    id_dokumen: `${index + 1}`,
                    dokumen: 'JU',
                    tgl_dokumen: created_at,
                    kode_akun: '1-11101',
                    kode_subledger: '',
                    kurs: '1.0000',
                    debet_rp: data.approvedcost,
                    kredit_rp: 0.0,
                    jumlah_rp: data.approvedcost,
                    jumlah_mu: data.approvedcost,
                    catatan: data.remark.replace(/'/g, ''),
                    no_warkat: '',
                    tgl_valuta: created_at,
                    persen: '0.00',
                    kode_dept: '',
                    kode_kerja: '',
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: created_at,
                    userid: data.created_by,
                    tgl_update: created_at,
                    audit: '',
                    kode_kry: data.requestedby,
                    kode_jual: 'KA',
                    proses: 'N',
                    nama_dokumen: 'KLAIMHRIS_Manual',
                    tipe_dokumen: 'HARIAN',
                    userid_proses: '',
                    tgl_proses: created_at,
                    nama_bank: data.nama_bank,
                    no_rekening: data.no_rekening,
                    nama_pemilik_rek: data.nama_rekening,
                    nip: data.nip,
                    nama_karyawan: data.nama_karyawan,
                    jenis_klaim: data.jenis_loan,
                    link_gambar: data.refdoc,
                    tipe_klaim: '',
                    kode_jabatan: data.kode_jabatan,
                    nama_jabatan: data.nama_jabatan,
                    pilih: 'N',
                    note_approval: data.note_approval,
                    reim_receiptdate: data.loan_receiptdate,
                    reqcancel_no: data.reqcancel_no,
                    requestdate: moment(data.requestdate).format('YYYY-MM-DD HH:mm:ss'),
                    approval_status: data.approval_status,
                    approved_date: moment(data.approved_date).format('YYYY-MM-DD HH:mm:ss'),
                    reim_startdate: '',
                    reimbalance_id: '',
                    paid_date: data.paid_date.substring(0, 25),
                    request_no: data.request_no,
                    reimrequest_id: '',
                    cancelsts: data.cancelsts,
                    reim_code: '',
                    paid_status: data.paid_status,
                    reim_enddate: '',
                    reim_source: '',
                    no_urut: data.no_urut,
                    requestfor: data.requestfor,
                    created_date: created_at,
                    email_karyawan: data.email,

                    //loan :
                    loan_id: data.loan_id,
                    loan_code: data.loan_code,
                    tipe_loan: data.tipe_loan,
                    loan_receiptdate: data.loan_receiptdate,
                    loan_startdate: data.loan_startdate,
                    loan_enddate: data.loan_enddate,
                    loancost: data.loancost,
                    jenis_loan: data.jenis_loan,
                    company_code: data.company_code,

                    //onduty :
                    onduty_id: '',
                    onduty_code: '',
                    tipe_onduty: '',
                    onduty_receiptdate: '',
                    onduty_startdate: '',
                    onduty_enddate: '',
                    ondutycost: '',
                    jenis_onduty: '',
                    diff_cost: '',
                });
            }

            for (const data of responseDataOnDutyReqHRISGlobal) {
                //lakukan pengecekan, apakah onduty_id exist
                const exists = await checkExistingData(data.onduty_id);
                if (exists) {
                    continue;
                }

                const index = currentIndex;
                currentIndex++;

                //console.log('Inserting data at index:', currentIndex);

                mergedDetail.push({
                    entitas: data.costcenter_code,
                    kode_dokumen: kodeDokumen,
                    id_dokumen: `${index + 1}`,
                    dokumen: 'JU',
                    tgl_dokumen: created_at,
                    kode_akun: '1-11101',
                    kode_subledger: '',
                    kurs: '1.0000',
                    debet_rp: data.approvedcost,
                    kredit_rp: 0.0,
                    jumlah_rp: data.approvedcost,
                    jumlah_mu: data.approvedcost,
                    catatan: data.remark.replace(/'/g, ''),
                    no_warkat: '',
                    tgl_valuta: created_at,
                    persen: 0.0,
                    kode_dept: '',
                    kode_kerja: '',
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: created_at,
                    userid: data.created_by,
                    tgl_update: created_at,
                    audit: '',
                    kode_kry: data.requestedby,
                    kode_jual: 'KA',
                    proses: 'N',
                    nama_dokumen: 'KLAIMHRIS_Manual',
                    tipe_dokumen: 'HARIAN',
                    userid_proses: '',
                    tgl_proses: created_at,
                    nama_bank: data.nama_bank,
                    no_rekening: data.no_rekening,
                    nama_pemilik_rek: data.nama_rekening,
                    nip: data.nip,
                    nama_karyawan: data.nama_karyawan,
                    jenis_klaim: data.jenis_onduty,
                    link_gambar: data.refdoc,
                    tipe_klaim: '',
                    kode_jabatan: data.kode_jabatan,
                    nama_jabatan: data.nama_jabatan,
                    pilih: 'N',
                    note_approval: data.note_approval,
                    reim_receiptdate: '',
                    reqcancel_no: '',
                    requestdate: moment(data.requestdate).format('YYYY-MM-DD HH:mm:ss'),
                    approval_status: data.approval_status,
                    approved_date: moment(data.approved_date).format('YYYY-MM-DD HH:mm:ss'),
                    reim_startdate: '',
                    reimbalance_id: '',
                    paid_date: '',
                    request_no: data.request_no,
                    reimrequest_id: '',
                    cancelsts: '',
                    reim_code: '',
                    paid_status: '',
                    reim_enddate: '',
                    reim_source: '',
                    no_urut: data.no_urut,
                    requestfor: data.requestfor,
                    created_date: created_at,
                    email_karyawan: data.email,

                    //loan :
                    loan_id: '',
                    loan_code: '',
                    tipe_loan: '',
                    loan_receiptdate: '',
                    loan_startdate: '',
                    loan_enddate: '',
                    loancost: '',
                    jenis_loan: '',
                    company_code: 'kencanagroup',

                    //onduty :
                    onduty_id: data.onduty_id,
                    onduty_code: data.onduty_code,
                    tipe_onduty: data.tipe_onduty,
                    onduty_receiptdate: '',
                    onduty_startdate: moment(data.onduty_startdate).format('YYYY-MM-DD HH:mm:ss'),
                    onduty_enddate: moment(data.onduty_enddate).format('YYYY-MM-DD HH:mm:ss'),
                    ondutycost: data.ondutycost,
                    jenis_onduty: data.jenis_onduty,
                    diff_cost: '',
                });
            }

            for (const data of responseDataOnDutyDecHRISGlobal) {
                //lakukan pengecekan, apakah onduty_id exist
                const exists = await checkExistingData(data.onduty_id);
                if (exists) {
                    continue;
                }

                const index = currentIndex;
                currentIndex++;

                //console.log('Inserting data at index:', currentIndex);

                mergedDetail.push({
                    entitas: data.costcenter_code,
                    kode_dokumen: kodeDokumen,
                    id_dokumen: `${index + 1}`,
                    dokumen: 'JU',
                    tgl_dokumen: created_at,
                    kode_akun: '1-11101',
                    kode_subledger: '',
                    kurs: '1.0000',
                    debet_rp: data.approvedcost,
                    kredit_rp: 0.0,
                    jumlah_rp: data.approvedcost,
                    jumlah_mu: data.approvedcost,
                    catatan: data.remark.replace(/'/g, ''),
                    no_warkat: '',
                    tgl_valuta: created_at,
                    persen: 0.0,
                    kode_dept: '',
                    kode_kerja: '',
                    approval: 'N',
                    posting: 'N',
                    rekonsiliasi: 'N',
                    tgl_rekonsil: created_at,
                    userid: data.created_by,
                    tgl_update: created_at,
                    audit: '',
                    kode_kry: data.requestedby,
                    kode_jual: 'KA',
                    proses: 'N',
                    nama_dokumen: 'KLAIMHRIS_Manual',
                    tipe_dokumen: 'HARIAN',
                    userid_proses: '',
                    tgl_proses: created_at,
                    nama_bank: data.nama_bank,
                    no_rekening: data.no_rekening,
                    nama_pemilik_rek: data.nama_rekening,
                    nip: data.nip,
                    nama_karyawan: data.nama_karyawan,
                    jenis_klaim: data.jenis_onduty,
                    link_gambar: data.refdoc,
                    tipe_klaim: '',
                    kode_jabatan: data.kode_jabatan,
                    nama_jabatan: data.nama_jabatan,
                    pilih: 'N',
                    note_approval: data.note_approval,
                    reim_receiptdate: '',
                    reqcancel_no: '',
                    requestdate: moment(data.requestdate).format('YYYY-MM-DD HH:mm:ss'),
                    approval_status: data.approval_status,
                    approved_date: moment(data.approved_date).format('YYYY-MM-DD HH:mm:ss'),
                    reim_startdate: '',
                    reimbalance_id: '',
                    paid_date: '',
                    request_no: data.request_no,
                    reimrequest_id: '',
                    cancelsts: '',
                    reim_code: '',
                    paid_status: '',
                    reim_enddate: '',
                    reim_source: '',
                    no_urut: data.no_urut,
                    requestfor: data.requestfor,
                    created_date: created_at,
                    email_karyawan: data.email,

                    //loan :
                    loan_id: '',
                    loan_code: '',
                    tipe_loan: '',
                    loan_receiptdate: '',
                    loan_startdate: '',
                    loan_enddate: '',
                    loancost: '',
                    jenis_loan: '',
                    company_code: 'kencanagroup',

                    //onduty :
                    onduty_id: data.onduty_id,
                    onduty_code: data.onduty_code,
                    tipe_onduty: data.tipe_onduty,
                    onduty_receiptdate: '',
                    onduty_startdate: moment(data.onduty_startdate).format('YYYY-MM-DD HH:mm:ss'),
                    onduty_enddate: moment(data.onduty_enddate).format('YYYY-MM-DD HH:mm:ss'),
                    ondutycost: data.ondutycost,
                    jenis_onduty: data.jenis_onduty,
                    diff_cost: data.diff_cost,
                });
            }

            if (mergedDetail.length === 0) {
                alert('data telah update.');
                return;
            }

            const totalJumlahRp = mergedDetail.reduce((acc, curr) => {
                if (curr) {
                    return acc + curr.jumlah_rp;
                }
                return acc;
            }, 0);

            const requestBody = {
                entitas: entitasUsed,
                kode_dokumen: kodeDokumen,
                dokumen: 'JU',
                nama_dokumen: 'KLAIMHRIS_Manual',
                tipe_dokumen: 'HARIAN',
                tgl_dokumen: created_at,
                tgl_valuta: created_at,
                kurs: '1.0000',
                debet_rp: totalJumlahRp,
                kredit_rp: totalJumlahRp,
                jumlah_rp: totalJumlahRp,
                jumlah_mu: totalJumlahRp,
                catatan: '',
                userid: '',
                tgl_update: created_at,
                approval: 'N',
                user_app: 'user_app_loan',
                tgl_app: created_at,
                nodok_app: 'nodok_app_loan',
                tipedok_app: 'tipedok_app_loan',
                detail: mergedDetail.filter((data) => data && (data.debet_rp !== 0.0 || data.jumlah_rp !== 0.0)),
            };

            console.log('requestBody:', requestBody);
            axios
                .post(url, requestBody)
                .then((response) => {
                    console.log('Respon API:', response.data);
                    setModalSuccess(true);
                })
                .catch((error) => {
                    console.error('Terjadi kesalahan:', error);
                    setModalFailed(true);
                });
        } else {
            alert('Silahkan Login Kembali, Session Habis');
            setTimeout(() => {
                router.push({ pathname: '/' });
            }, 1000);
        }
        //  swal.close();
    };

    // function isImage(link: any) {
    //     const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    //     const fileExtension = link.substr(link.lastIndexOf('.'));
    //     return imageExtensions.includes(fileExtension);
    // }

    function isImage(link: any) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.JPG', '.JPEG', '.PNG', '.GIF'];
        const documentExtensions = ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.DOC', '.DOCX', '.PDF', '.XLS', '.XLSX'];
        const fileExtension = link.substr(link.lastIndexOf('.'));
        return imageExtensions.includes(fileExtension) ? 'image' : documentExtensions.includes(fileExtension) ? 'document' : 'unknown';
    }

    const [selectedRecordsTab1, setSelectedRecordsTab1] = useState<any>([]);
    const [selectedRecordsTab2, setSelectedRecordsTab2] = useState<any>([]);

    //console.log(selectedRecordsTab1, 'selectedRecordsTab1')

    // console.log(
    //     selectedRecordsTab1.map((record: any) => ({
    //         reimrequest_id: record.reimrequest_id,
    //         diff_cost: record.diff_cost,
    //         shouldLog: record.reimrequest_id.startsWith('DCLR') && record.diff_cost.charAt(0) !== '-',
    //     }))
    // );

    const filteredDataOndutyDeclaration = selectedRecordsTab1.filter((record: { reimrequest_id: string; diff_cost: string }) => {
        return record.reimrequest_id && record.reimrequest_id.startsWith('DCLR') && record.diff_cost && record.diff_cost.charAt(0) !== '-';
    });

    //console.log('filter data', filteredDataOndutyDeclaration);
    // console.log(
    //     filteredDataOndutyDeclaration.map((record: any) => ({
    //         reimrequest_id: record.reimrequest_id,
    //         diff_cost: record.diff_cost,
    //     }))
    // );

    const handleClickProsesMultiple = async () => {
        const updateDetailUrl = `${apiUrl}/erp/update_detail_reimbursement`;
        const updateCairUrl = `${apiUrl}/erp/update_tglcair_reimbursement`;

        try {
            if (selectedRecordsTab1.length == 0) {
                alert('Tidak ada data pada Tab ke-1');
                return;
            }

            const SelectedDataLength = selectedRecordsTab1.length;
            const dataToUpdateDetail = [];
            const dataToUpdateCair = [];

            for (let i = 0; i < selectedRecordsTab1.length; i += SelectedDataLength) {
                const dataTab1 = selectedRecordsTab1.slice(i, i + SelectedDataLength);

                for (const record of dataTab1) {
                    let patchData;
                    if (record.reimrequest_id?.startsWith('DCLR') && record.diff_cost?.charAt(0) !== '-') {
                        patchData = {
                            entitas: entitasUsed,
                            kode_dokumen: record.kode_dokumen,
                            id_dokumen: record.id_dokumen,
                            proses: 'Y',
                            userid_proses: userid,
                            tgl_proses: moment().format('YYYY-MM-DD'),
                        };
                        dataToUpdateDetail.push(patchData);

                        const cairPatchData = {
                            entitas: entitasUsed,
                            kode_dokumen: record.kode_dokumen,
                            id_dokumen: record.id_dokumen,
                            cair: 'Y',
                            userid_cair: userid,
                            tgl_cair: moment().format('YYYY-MM-DD'),
                        };
                        dataToUpdateCair.push(cairPatchData);
                    } else {
                        patchData = {
                            entitas: entitasUsed,
                            kode_dokumen: record.kode_dokumen,
                            id_dokumen: record.id_dokumen,
                            proses: 'Y',
                            userid_proses: userid,
                            tgl_proses: moment().format('YYYY-MM-DD'),
                        };
                        dataToUpdateDetail.push(patchData);
                    }
                }
            }

            const detailResponse = await axios.patch(updateDetailUrl, dataToUpdateDetail);

            if (detailResponse.data.status) {
                fetchData();
                setSelectedRecordsTab1([]);
            }

            for (let i = 0; i < selectedRecordsTab2.length; i += SelectedDataLength) {
                const dataTab2 = selectedRecordsTab2.slice(i, i + SelectedDataLength);

                for (const record of dataTab2) {
                    const cairPatchData = {
                        entitas: entitasUsed,
                        kode_dokumen: record.kode_dokumen,
                        id_dokumen: record.id_dokumen,
                        cair: 'Y',
                        userid_cair: userid,
                        tgl_cair: moment().format('YYYY-MM-DD'),
                    };
                    dataToUpdateCair.push(cairPatchData);
                }
            }

            const cairResponse = await axios.patch(updateCairUrl, dataToUpdateCair);

            if (cairResponse.data.status) {
                fetchData();
                setSelectedRecordsTab2([]);
            }
        } catch (error) {
            console.error('Error updating reimbursement details:', error);
        }
    };

    const handleClickCairMultiple = async () => {
        const url = `${apiUrl}/erp/update_tglcair_reimbursement`;

        try {
            if (selectedRecordsTab2.length == 0) {
                alert('Tidak ada data pada Tab ke-2');
                return;
            }

            const SelectedDataLength = selectedRecordsTab2.length;
            const dataToUpdate = [];

            for (let i = 0; i < selectedRecordsTab2.length; i += SelectedDataLength) {
                const dataTab2 = selectedRecordsTab2.slice(i, i + SelectedDataLength);

                dataToUpdate.push(
                    ...dataTab2.map((record: any) => ({
                        entitas: entitasUsed,
                        kode_dokumen: record.kode_dokumen,
                        id_dokumen: record.id_dokumen,
                        cair: 'Y',
                        userid_cair: userid,
                        tgl_cair: moment().format('YYYY-MM-DD'),
                    })),
                );
            }

            const response = await axios.patch(url, dataToUpdate);
            if (response.data.status) {
                fetchData();
                setSelectedRecordsTab2([]);
            }
        } catch (error) {
            console.error('Error updating reimbursement details:', error);
        }
    };

    return (
        <div style={{ overflow: 'auto' }}>
            <div className=" mb-5 flex justify-between">
                <div className="flex">
                    <button type="submit" className={`btn btn-success mb-2 md:mb-0 md:mr-2 ${panelVisible ? 'pointer-events-none opacity-50' : ''}`} onClick={handleFilterClick}>
                        Filter
                    </button>

                    <button type="submit" className={`btn btn-secondary mb-2 md:mb-0 md:mr-2`} onClick={postdataHRISCombine}>
                        Update Data klaim HRIS
                    </button>

                    <Transition appear show={modalSuccess || modalFailed}>
                        <Dialog as="div" open={modalSuccess || modalFailed} onClose={handleCloseModals}>
                            <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                <div className="flex min-h-screen items-center justify-center px-4">
                                    <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                        <div className="mb-4 mt-4 flex flex-col items-center justify-center">
                                            <div className="text-lg font-bold">{modalSuccess ? 'Update Data Berhasil...' : 'Gagal memperbarui data, Silakan coba lagi.'}</div>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    <button type="submit" className={`btn btn-success mb-2 md:mb-0 md:mr-2`} onClick={exportToExcel}>
                        Export Data Baru
                    </button>

                    <button
                        type="submit"
                        className={`btn btn-success mb-2 md:mb-0 md:mr-2`}
                        onClick={() => {
                            if (selectedRow) {
                                exportUlangToExcel(selectedRow.export_id);
                                setSelectedRow(null);
                            } else {
                                alert('Silahkan Pilih Data Terlebih Dahulu.');
                            }
                        }}
                    >
                        Export Ulang Data
                    </button>

                    <button
                        type="submit"
                        className={`btn btn-secondary mb-2 md:mb-0 md:mr-2`}
                        onClick={() => {
                            if (filteredDataOndutyDeclaration.length > 0) {
                                setConfirmMultiProsesModal(true);
                            } else {
                                handleClickProsesMultiple();
                            }
                        }}
                    >
                        Proses Data
                    </button>

                    <button type="submit" className={`btn btn-secondary mb-2 md:mb-0 md:mr-2`} onClick={handleClickCairMultiple}>
                        Pencairan Data
                    </button>
                </div>

                <div className="flex">
                    <span className="mt-1" style={{ fontSize: '20px', fontFamily: 'Times New Roman' }}>
                        Reimbursement Data
                    </span>
                </div>
            </div>

            <div className={styles['flex-container']}>
                {panelVisible && (
                    <div className="panel" style={{ background: '#dedede' }}>
                        <button className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900" onClick={handleTogglePanel}>
                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                        </button>
                        <form>
                            <label className="flex cursor-pointer items-center">
                                <span>Entitas</span>
                            </label>
                            <div
                                className="overflowY: auto mt-2 flex flex-col rounded-md border border-white-light dark:border-[#1b2e4b]"
                                style={{ overflowY: 'scroll', height: '40vh', background: 'white' }}
                            >
                                <div className="py-q flex space-x-4 px-4 py-1 hover:bg-[#eee] dark:hover:bg-[#eee]/10 rtl:space-x-reverse">
                                    <input id="tack_checkboxSemua" type="checkbox" className="form-checkbox" checked={checkboxItems.every((item) => item.checked)} onChange={handleSelectAll} />
                                    <label htmlFor="tack_checkboxSemua" className="mb-0 cursor-pointer">
                                        Semua
                                    </label>
                                </div>
                                {checkboxItems.map((item) => (
                                    <div key={item.id} className="flex space-x-4 px-4 py-1 hover:bg-[#eee] dark:hover:bg-[#eee]/10 rtl:space-x-reverse">
                                        <input id={`tack_checkbox${item.id}`} type="checkbox" className="form-checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item.id)} />
                                        <label htmlFor={`tack_checkbox${item.id}`} className="mb-0 cursor-pointer">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <label className="mt-3 flex cursor-pointer items-center">
                                <input type="checkbox" className="form-checkbox" checked={isNoPengajuanChecked} onChange={() => setIsNoPengajuanChecked(!isNoPengajuanChecked)} />
                                <span>No. Pengajuan</span>
                            </label>
                            <input type="text" placeholder="" className="form-input" value={noPengajuanValue} onChange={handleNoPengajuanInputChange} />

                            <label className="mt-3 flex cursor-pointer items-center">
                                <input type="checkbox" className="form-checkbox" checked={isDateRangeChecked} onChange={() => setIsDateRangeChecked(!isDateRangeChecked)} />
                                <span>Tanggal Approved</span>
                            </label>
                            <div className={`grid grid-cols-1 justify-between gap-1 sm:flex ${isDateRangeChecked ? '' : 'hidden'}`}>
                                <Flatpickr
                                    value={date1.format('DD-MM-YYYY')}
                                    options={{
                                        dateFormat: 'd-m-Y',
                                    }}
                                    className="form-input"
                                    style={{ fontSize: '1.8vh', width: '15vh' }}
                                    onChange={(date) => setDate1(moment(date[0]))}
                                />{' '}
                                <p className="mt-1">S/D</p>
                                <Flatpickr
                                    value={date2.format('DD-MM-YYYY')}
                                    options={{
                                        dateFormat: 'd-m-Y',
                                    }}
                                    className="form-input"
                                    style={{ fontSize: '1.8vh', width: '15vh' }}
                                    onChange={(date) => setDate2(moment(date[0]))}
                                />
                            </div>

                            <label className="mt-3 flex cursor-pointer items-center">
                                <input type="checkbox" className="form-checkbox" checked={isNamaKaryawanChecked} onChange={() => setIsNamaKaryawanChecked(!isNamaKaryawanChecked)} />
                                <span>Nama Karyawan</span>
                            </label>
                            <input type="text" placeholder="" className="form-input" value={namaKaryawanValue} onChange={handleNamaKaryawanInputChange} />
                            <label className="mt-3 flex cursor-pointer items-center">
                                <input type="checkbox" className="form-checkbox" checked={isJenisKlaimChecked} onChange={() => setIsJenisKlaimChecked(!isJenisKlaimChecked)} />
                                <span>Jenis Klaim</span>
                            </label>
                            <input type="text" placeholder="" className="form-input" value={jenisKlaimValue} onChange={handleJenisKlaimInputChange} />
                            <label className="mt-3 flex cursor-pointer items-center">
                                <input type="checkbox" className="form-checkbox" checked={isCatatanKlaimChecked} onChange={() => setIsCatatanKlaimChecked(!isCatatanKlaimChecked)} />
                                <span>Catatan</span>
                            </label>
                            <input type="text" placeholder="" className="form-input" value={catatanValue} onChange={handleCatatanInputChange} />
                            <div className="flex justify-center">
                                <button type="button" onClick={() => refreshData()} className="btn btn-primary mt-4">
                                    <FontAwesomeIcon icon={faArrowsRotate} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    Refresh Data
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Form Grid Layouts */}
                <div className="panel" style={{ background: '#dedede' }}>
                    <div className="mb-2 flex flex-col gap-5 md:flex-row md:items-center">
                        <h5></h5>
                        <div className="ltr:ml-auto rtl:mr-auto">
                            <input type="text" className="form-input h-[4vh] w-auto" placeholder="Search by Catatan..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                        </div>
                    </div>
                    <Tabs>
                        <TabList>
                            <Tab id="tab1">Reimbursement List Belum Proses</Tab>
                            <Tab id="tab2">Reimbursement List Sudah Proses</Tab>
                            <Tab id="tab3">Reimbursement List Sudah Cair</Tab>
                        </TabList>
                        <TabPanel id="tabpanel1">
                            <div className="ltr:ml-auto rtl:mr-auto"></div>
                            <div className="justify-between gap-5 sm:flex">
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                                    {showTabPanel && (
                                        <DataTable
                                            withColumnBorders={true}
                                            highlightOnHover
                                            striped
                                            // borderColor={'green'}
                                            style={{ background: '#e8e8e8' }}
                                            className={`sticky-table table-hover whitespace-nowrap`}
                                            records={recordsDataTab1}
                                            columns={[
                                                // { accessor: 'nama_dokumen', title: 'Nama Dokumen', sortable: true },
                                                { accessor: 'approved_date', title: 'Tgl. Approve', sortable: true },
                                                { accessor: 'entitas', title: 'Entitas', sortable: true },
                                                { accessor: 'request_no', title: 'No. Pengajuan', sortable: true },
                                                { accessor: 'nip', title: 'NIP', sortable: true },
                                                { accessor: 'nama_karyawan', title: 'Nama', sortable: true },
                                                {
                                                    accessor: 'reim_receiptdate',
                                                    title: 'Tanggal Transaksi',
                                                    sortable: true,
                                                    render: ({ reim_receiptdate, requestdate }: any) => (
                                                        <div className="flex cursor-pointer items-center justify-center">
                                                            {reim_receiptdate == '' ? <div> {reim_receiptdate} </div> : <div> {requestdate} </div>}
                                                        </div>
                                                    ),
                                                },
                                                { accessor: 'jenis_klaim', title: 'Jenis Klaim', sortable: true },
                                                {
                                                    accessor: 'jumlah_rp',
                                                    title: 'Nominal',
                                                    sortable: true,
                                                    render: ({ jumlah_rp }: any) => (
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div>{jumlah_rp}</div>
                                                        </div>
                                                    ),
                                                },
                                                { accessor: 'catatan', title: 'Catatan', sortable: true },
                                                {
                                                    accessor: 'link_gambar',
                                                    title: 'File Pendukung',
                                                    sortable: true,
                                                    render: ({ link_gambar }: any) => {
                                                        const fileType = isImage(link_gambar);
                                                        return (
                                                            <div>
                                                                {fileType === 'image' ? (
                                                                    <a
                                                                        className={styles['link-style']}
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setSelectedLinkGambar(link_gambar);
                                                                            setFilePendukungModal(true);
                                                                        }}
                                                                    >
                                                                        Link File...
                                                                    </a>
                                                                ) : fileType === 'document' ? (
                                                                    <a className={styles['link-style']} href={link_gambar} target="_blank" rel="noopener noreferrer">
                                                                        Buka di Tab Baru
                                                                    </a>
                                                                ) : (
                                                                    <span>Tidak Ada File Attachment</span>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                },
                                                { accessor: 'nama_bank', title: 'Bank', sortable: true },
                                                { accessor: 'nama_pemilik_rek', title: 'Nama Pemilik Rekening', sortable: true },
                                                {
                                                    accessor: 'proses',
                                                    title: 'Proses',
                                                    sortable: true,
                                                    render: ({ proses, kode_dokumen, id_dokumen, reimrequest_id, nama_karyawan, diff_cost }: any) => (
                                                        <div
                                                            className="flex cursor-pointer items-center justify-center"
                                                            onClick={() => {
                                                                if (reimrequest_id?.startsWith('DCLR') && diff_cost?.charAt(0) !== '-') {
                                                                    setProsesDataModal({ kode_dokumen, id_dokumen, userid, diff_cost, reimrequest_id, nama_karyawan });
                                                                    setConfirmProsesModal(true);
                                                                } else {
                                                                    handleClickProses(kode_dokumen, id_dokumen, userid, diff_cost, reimrequest_id);
                                                                }
                                                            }}
                                                        >
                                                            {proses === 'Y' ? (
                                                                <FontAwesomeIcon icon={iconStatesProses === faCheck ? faTimes : faCheck} width="18" height="18" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={iconStatesProses === faTimes ? faCheck : faTimes} width="18" height="18" />
                                                            )}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'diff_cost',
                                                    title: 'Selisih Klaim',
                                                    sortable: true,
                                                    render: ({ diff_cost, reimrequest_id }: any) => {
                                                        if (reimrequest_id.startsWith('DCLR')) {
                                                            return <div className="flex cursor-pointer items-center justify-center">{diff_cost}</div>;
                                                        } else {
                                                            return null;
                                                        }
                                                    },
                                                },
                                                {
                                                    accessor: 'tgl_proses',
                                                    title: 'Tgl. Proses',
                                                    sortable: true,
                                                    render: ({ tgl_proses }) => <div className="flex w-max">{/* <div>{tgl_proses === null ? <div></div> : <div>{tgl_proses}</div>}</div> */}</div>,
                                                },
                                                { accessor: 'akun', title: 'Akun', sortable: true },
                                                { accessor: 'sub_ledger', title: 'Sub Ledger', sortable: true },
                                                {
                                                    accessor: 'diff_cost',
                                                    title: 'Keterangan',
                                                    sortable: true,
                                                    render: ({ diff_cost, reimrequest_id }: any) => {
                                                        if (reimrequest_id.startsWith('DCLR')) {
                                                            return (
                                                                <div className="flex cursor-pointer items-center justify-center">
                                                                    <div className="flex cursor-pointer items-center justify-center">
                                                                        {diff_cost.charAt(0) === '0' && <div>Tidak ada selisih</div>}
                                                                        {diff_cost.charAt(0) === '-' && <div>Kurang bayar</div>}
                                                                        {diff_cost.charAt(0) !== '-' && diff_cost.charAt(0) !== '0' && <div>Lebih bayar</div>}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    },
                                                },
                                            ]}
                                            totalRecords={totalRecordsTab1}
                                            recordsPerPage={pageSize}
                                            page={pageTab1}
                                            onPageChange={(p) => setPageTab1(p)}
                                            recordsPerPageOptions={PAGE_SIZES}
                                            onRecordsPerPageChange={setPageSize}
                                            sortStatus={sortStatus}
                                            onSortStatusChange={setSortStatus}
                                            height={600}
                                            selectedRecords={selectedRecordsTab1}
                                            onSelectedRecordsChange={setSelectedRecordsTab1}
                                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecordsData} entries`}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* modal file pendukung */}
                            <FilePendukung link_gambar={selectedLinkGambar} isOpen={filePendukungModal} onClose={() => setFilePendukungModal(false)} />

                            <Transition appear show={confirmProsesModal || confirmMultiProsesModal}>
                                <Dialog as="div" open={confirmProsesModal || confirmMultiProsesModal} onClose={handleCloseModals}>
                                    <Transition.Child
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="fixed inset-0" />
                                    </Transition.Child>
                                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                        <div className="flex min-h-screen items-center justify-center px-4">
                                            <Transition.Child
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 scale-95"
                                                enterTo="opacity-100 scale-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 scale-100"
                                                leaveTo="opacity-0 scale-95"
                                            >
                                                <Dialog.Panel
                                                    as="div"
                                                    className={`panel my-8 w-full max-w-${confirmProsesModal ? 'lg' : '4xl'} overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark`}
                                                >
                                                    <div className="p-5">
                                                        {confirmProsesModal ? (
                                                            /* Konten dari modal pertama */
                                                            <p>
                                                                Karyawan {prosesDataModal.nama_karyawan} harus mengembalikan dana sebesar {prosesDataModal.diff_cost}, apakah data akan diproses?
                                                            </p>
                                                        ) : (
                                                            /* Konten dari modal kedua */
                                                            <div>
                                                                <p className="mb-1.5">Karyawan berikut harus mengembalikan dana (onduty declaration) lebih bayar:</p>
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No</th>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Entitas</th>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Karyawan</th>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No Pengajuan</th>
                                                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Selisih Klaim</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                                        {filteredDataOndutyDeclaration.map((record: any, index: number) => (
                                                                            <tr key={index}>
                                                                                <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                                                                                <td className="whitespace-nowrap px-6 py-4">{record.entitas}</td>
                                                                                <td className="whitespace-nowrap px-6 py-4">{record.nama_karyawan}</td>
                                                                                <td className="whitespace-nowrap px-6 py-4">{record.request_no}</td>
                                                                                <td className="whitespace-nowrap px-6 py-4">{record.diff_cost}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <p className="mt-1">Apakah data akan diproses?</p>
                                                            </div>
                                                        )}
                                                        <div className="mt-5 flex items-center justify-end">
                                                            {confirmProsesModal ? (
                                                                <button
                                                                    onClick={() => {
                                                                        handleClickProses(
                                                                            prosesDataModal.kode_dokumen,
                                                                            prosesDataModal.id_dokumen,
                                                                            userid,
                                                                            prosesDataModal.diff_cost,
                                                                            prosesDataModal.reimrequest_id,
                                                                        );
                                                                        setConfirmProsesModal(false);
                                                                    }}
                                                                    className="btn btn-danger mb-2 md:mb-0 md:mr-2"
                                                                >
                                                                    YES
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        handleClickProsesMultiple();
                                                                        setConfirmMultiProsesModal(false);
                                                                    }}
                                                                    className="btn btn-danger mb-2 md:mb-0 md:mr-2"
                                                                >
                                                                    YES
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                                onClick={() => {
                                                                    setConfirmProsesModal(false);
                                                                    setConfirmMultiProsesModal(false);
                                                                }}
                                                            >
                                                                NO
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Dialog.Panel>
                                            </Transition.Child>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>
                        </TabPanel>

                        <TabPanel id="tabpanel2">
                            <div className="justify-between gap-5 sm:flex">
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                                    {showTabPanel && (
                                        <DataTable
                                            withColumnBorders={true}
                                            style={{ background: '#e8e8e8' }}
                                            highlightOnHover
                                            className={`sticky-table whitespace-nowrap`}
                                            records={recordsDataTab2}
                                            onRowClick={({ record, index }) => {
                                                handleRowClick(record, index);
                                            }}
                                            rowStyle={(record, rowIndex) => ({
                                                // cursor: 'pointer',
                                                background: selectedRowIndex === rowIndex ? '#f6f8fa' : 'transparent',
                                            })}
                                            columns={[
                                                { accessor: 'approved_date', title: 'Tgl. Approve', sortable: true },
                                                { accessor: 'entitas', title: 'Entitas', sortable: true },
                                                { accessor: 'request_no', title: 'No. Pengajuan', sortable: true },
                                                { accessor: 'nip', title: 'NIP', sortable: true },
                                                { accessor: 'nama_karyawan', title: 'Nama', sortable: true },
                                                {
                                                    accessor: 'reim_receiptdate',
                                                    title: 'Tanggal Transaksi',
                                                    sortable: true,
                                                    render: ({ reim_receiptdate, requestdate }: any) => (
                                                        <div className="flex items-center justify-center">{reim_receiptdate == '' ? <div> {reim_receiptdate} </div> : <div> {requestdate} </div>}</div>
                                                    ),
                                                },
                                                { accessor: 'jenis_klaim', title: 'Jenis Klaim', sortable: true },
                                                {
                                                    accessor: 'jumlah_rp',
                                                    title: 'Nominal',
                                                    sortable: true,
                                                    render: ({ jumlah_rp }: any) => (
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div>{jumlah_rp}</div>
                                                        </div>
                                                    ),
                                                },
                                                { accessor: 'catatan', title: 'Catatan', sortable: true },
                                                {
                                                    accessor: 'link_gambar',
                                                    title: 'File Pendukung',
                                                    sortable: true,
                                                    render: ({ link_gambar }: any) => {
                                                        const fileType = isImage(link_gambar);
                                                        return (
                                                            <div>
                                                                {fileType === 'image' ? (
                                                                    <a
                                                                        className={styles['link-style']}
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setSelectedLinkGambar(link_gambar);
                                                                            setFilePendukungModal(true);
                                                                        }}
                                                                    >
                                                                        Link File...
                                                                    </a>
                                                                ) : fileType === 'document' ? (
                                                                    <a className={styles['link-style']} href={link_gambar} target="_blank" rel="noopener noreferrer">
                                                                        Buka di Tab Baru
                                                                    </a>
                                                                ) : (
                                                                    <span>Tidak Ada File Attachment</span>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                },
                                                { accessor: 'nama_bank', title: 'Bank', sortable: true },
                                                { accessor: 'nama_pemilik_rek', title: 'Nama Pemilik Rekening', sortable: true },
                                                {
                                                    accessor: 'proses',
                                                    title: 'Proses',
                                                    sortable: true,
                                                    render: ({ proses, kode_dokumen, id_dokumen, export_id, diff_cost, reimrequest_id }) => (
                                                        <div className="w-[85px]">
                                                            {export_id === '' || export_id === null ? (
                                                                <div
                                                                    className="flex  cursor-pointer items-center justify-center"
                                                                    onClick={() => handleClickProses(kode_dokumen, id_dokumen, userid, diff_cost, reimrequest_id)}
                                                                >
                                                                    {proses === 'Y' ? (
                                                                        <FontAwesomeIcon icon={iconStatesProses === faCheck ? faTimes : faCheck} width="18" height="18" />
                                                                    ) : (
                                                                        <FontAwesomeIcon icon={iconStatesProses === faTimes ? faCheck : faTimes} width="18" height="18" />
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center">
                                                                    {proses === 'Y' ? (
                                                                        <FontAwesomeIcon icon={iconStatesProses === faCheck ? faTimes : faCheck} width="18" height="18" />
                                                                    ) : (
                                                                        <FontAwesomeIcon icon={iconStatesProses === faTimes ? faCheck : faTimes} width="18" height="18" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'tgl_proses',
                                                    title: 'Tgl. Proses',
                                                    sortable: true,
                                                    render: ({ tgl_proses }: any) => (
                                                        <div className="flex w-max">
                                                            <div>{tgl_proses === null ? <div></div> : <div>{tgl_proses}</div>}</div>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'cair',
                                                    title: 'Pencairan',
                                                    sortable: true,
                                                    render: ({ cair, kode_dokumen, id_dokumen }) => (
                                                        <div className="flex items-center justify-center" onClick={() => handleClickCair(kode_dokumen, id_dokumen, userid)}>
                                                            {cair === 'Y' ? (
                                                                <FontAwesomeIcon icon={iconStatesCair === faCheck ? faTimes : faCheck} width="18" height="18" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={iconStatesCair === faTimes ? faCheck : faTimes} width="18" height="18" />
                                                            )}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'tgl_cair',
                                                    title: 'Tgl. Pencairan',
                                                    sortable: true,
                                                    render: ({ tgl_cair }: any) => (
                                                        <div className="flex w-max">
                                                            <div>{tgl_cair === null ? <div></div> : <div>{tgl_cair}</div>}</div>
                                                        </div>
                                                    ),
                                                },
                                                { accessor: 'export_id', title: 'ID Export', sortable: true },
                                                {
                                                    accessor: 'diff_cost',
                                                    title: 'Selisih Klaim',
                                                    sortable: true,
                                                    render: ({ diff_cost, reimrequest_id }: any) => {
                                                        if (reimrequest_id.startsWith('DCLR')) {
                                                            return (
                                                                <div className="flex items-center justify-center">
                                                                    <div className="flex items-center justify-center">{diff_cost}</div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    },
                                                },
                                                { accessor: '', title: 'Penjurnalan', sortable: true },
                                                { accessor: 'akun', title: 'Akun', sortable: true },
                                                { accessor: 'sub_ledger', title: 'Sub Ledger', sortable: true },
                                                {
                                                    accessor: 'diff_cost',
                                                    title: 'Keterangan',
                                                    sortable: true,
                                                    render: ({ diff_cost, reimrequest_id }: any) => {
                                                        if (reimrequest_id.startsWith('DCLR')) {
                                                            return (
                                                                <div className="flex items-center justify-center">
                                                                    <div className="flex items-center justify-center">
                                                                        {diff_cost.charAt(0) === '0' && <div>Tidak ada selisih</div>}
                                                                        {diff_cost.charAt(0) === '-' && <div>Kurang bayar</div>}
                                                                        {diff_cost.charAt(0) !== '-' && diff_cost.charAt(0) !== '0' && <div>Lebih bayar</div>}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    },
                                                },
                                            ]}
                                            totalRecords={totalRecordsTab2}
                                            recordsPerPage={pageSize}
                                            page={pageTab2}
                                            onPageChange={(p) => setPageTab2(p)}
                                            recordsPerPageOptions={PAGE_SIZES}
                                            onRecordsPerPageChange={setPageSize}
                                            sortStatus={sortStatus}
                                            selectedRecords={selectedRecordsTab2}
                                            onSelectedRecordsChange={setSelectedRecordsTab2}
                                            onSortStatusChange={setSortStatus}
                                            height={600}
                                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecordsData} entries`}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* modal file pendukung */}
                            <FilePendukung link_gambar={selectedLinkGambar} isOpen={filePendukungModal} onClose={() => setFilePendukungModal(false)} />
                        </TabPanel>
                        <TabPanel id="tabpanel3">
                            <div className="justify-between gap-5 sm:flex">
                                <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                                    {showTabPanel && (
                                        <DataTable
                                            withColumnBorders={true}
                                            highlightOnHover
                                            striped
                                            className={`sticky-table table-hover whitespace-nowrap`}
                                            style={{ background: '#e8e8e8' }}
                                            records={recordsDataTab3}
                                            columns={[
                                                { accessor: 'approved_date', title: 'Tgl. Approve', sortable: true },
                                                { accessor: 'entitas', title: 'Entitas', sortable: true },
                                                { accessor: 'request_no', title: 'No. Pengajuan', sortable: true },
                                                { accessor: 'nip', title: 'NIP', sortable: true },
                                                { accessor: 'nama_karyawan', title: 'Nama', sortable: true },
                                                {
                                                    accessor: 'reim_receiptdate',
                                                    title: 'Tanggal Transaksi',
                                                    sortable: true,
                                                    render: ({ reim_receiptdate, requestdate }: any) => (
                                                        <div className="flex cursor-pointer items-center justify-center">
                                                            {reim_receiptdate == '' ? <div> {reim_receiptdate} </div> : <div> {requestdate} </div>}
                                                        </div>
                                                    ),
                                                },
                                                { accessor: 'jenis_klaim', title: 'Jenis Klaim', sortable: true },
                                                {
                                                    accessor: 'jumlah_rp',
                                                    title: 'Nominal',
                                                    sortable: true,
                                                    render: ({ jumlah_rp }: any) => (
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div>{jumlah_rp}</div>
                                                        </div>
                                                    ),
                                                },
                                                { accessor: 'catatan', title: 'Catatan', sortable: true },
                                                {
                                                    accessor: 'link_gambar',
                                                    title: 'File Pendukung',
                                                    sortable: true,
                                                    render: ({ link_gambar }: any) => {
                                                        const fileType = isImage(link_gambar);
                                                        return (
                                                            <div>
                                                                {fileType === 'image' ? (
                                                                    <a
                                                                        className={styles['link-style']}
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setSelectedLinkGambar(link_gambar);
                                                                            setFilePendukungModal(true);
                                                                        }}
                                                                    >
                                                                        Link File...
                                                                    </a>
                                                                ) : fileType === 'document' ? (
                                                                    <a className={styles['link-style']} href={link_gambar} target="_blank" rel="noopener noreferrer">
                                                                        Buka di Tab Baru
                                                                    </a>
                                                                ) : (
                                                                    <span>Tidak Ada File Attachment</span>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                },
                                                { accessor: 'nama_bank', title: 'Bank', sortable: true },
                                                { accessor: 'nama_pemilik_rek', title: 'Nama Pemilik Rekening', sortable: true },
                                                {
                                                    accessor: 'proses',
                                                    title: 'Proses',
                                                    sortable: true,
                                                    render: ({ proses }) => (
                                                        <div className="flex w-[85px] items-center justify-center">
                                                            {proses === 'Y' ? (
                                                                <FontAwesomeIcon icon={iconStatesProses === faCheck ? faTimes : faCheck} width="18" height="18" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={iconStatesProses === faTimes ? faCheck : faTimes} width="18" height="18" />
                                                            )}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'tgl_proses',
                                                    title: 'Tgl. Proses',
                                                    sortable: true,
                                                    render: ({ tgl_proses }: any) => (
                                                        <div className="flex w-max">
                                                            <div>{tgl_proses === null ? <div></div> : <div>{tgl_proses}</div>}</div>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'cair',
                                                    title: 'Pencairan',
                                                    sortable: true,
                                                    render: ({ cair }) => (
                                                        <div className="flex items-center justify-center">
                                                            {cair === 'Y' ? (
                                                                <FontAwesomeIcon icon={iconStatesCair === faCheck ? faTimes : faCheck} width="18" height="18" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={iconStatesCair === faTimes ? faCheck : faTimes} width="18" height="18" />
                                                            )}
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'tgl_cair',
                                                    title: 'Tgl. Pencairan',
                                                    sortable: true,
                                                    render: ({ tgl_cair, kode_dokumen, id_dokumen, cair }: any) => (
                                                        <div className="flex w-max">
                                                            <Flatpickr
                                                                value={tgl_cair || ''}
                                                                options={{
                                                                    dateFormat: 'd-m-Y',
                                                                }}
                                                                className="form-input"
                                                                style={{ fontSize: '1.8vh', width: '14vh', height: '2.5vh' }}
                                                                onChange={(selectedDates: any) => {
                                                                    const selectedDate = selectedDates[0] || null;
                                                                    setSelectedDates(selectedDate);

                                                                    if (selectedDate) {
                                                                        handleClickTanggalCair(kode_dokumen, id_dokumen, userid, cair, selectedDate);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    accessor: 'diff_cost',
                                                    title: 'Selisih Klaim',
                                                    sortable: true,
                                                    render: ({ diff_cost, reimrequest_id }: any) => {
                                                        if (reimrequest_id.startsWith('DCLR')) {
                                                            return <div className="flex cursor-pointer items-center justify-center">{diff_cost}</div>;
                                                        } else {
                                                            return null;
                                                        }
                                                    },
                                                },
                                                {
                                                    accessor: '',
                                                    title: 'Penjurnalan',
                                                    sortable: true,
                                                },
                                                { accessor: 'akun', title: 'Akun', sortable: true },
                                                { accessor: 'sub_ledger', title: 'Sub Ledger', sortable: true },
                                                {
                                                    accessor: 'diff_cost',
                                                    title: 'Keterangan',
                                                    sortable: true,
                                                    render: ({ diff_cost, reimrequest_id }: any) => {
                                                        if (reimrequest_id.startsWith('DCLR')) {
                                                            return (
                                                                <div className="flex cursor-pointer items-center justify-center">
                                                                    <div className="flex cursor-pointer items-center justify-center">
                                                                        {diff_cost.charAt(0) === '0' && <div>Tidak ada selisih</div>}
                                                                        {diff_cost.charAt(0) === '-' && <div>Kurang bayar</div>}
                                                                        {diff_cost.charAt(0) !== '-' && diff_cost.charAt(0) !== '0' && <div>Lebih bayar</div>}
                                                                    </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    },
                                                },
                                            ]}
                                            totalRecords={totalRecordsTab3}
                                            recordsPerPage={pageSize}
                                            page={pageTab3}
                                            onPageChange={(p) => setPageTab3(p)}
                                            recordsPerPageOptions={PAGE_SIZES}
                                            onRecordsPerPageChange={setPageSize}
                                            sortStatus={sortStatus}
                                            onSortStatusChange={setSortStatus}
                                            height={600}
                                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecordsData} entries`}
                                        />
                                    )}
                                </div>
                            </div>
                            {/* modal file pendukung */}
                            <FilePendukung link_gambar={selectedLinkGambar} isOpen={filePendukungModal} onClose={() => setFilePendukungModal(false)} />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>

            {/* <div className="my-5 flex justify-between">
                <div className="flex"></div>

                <div className="flex">
                    <button type="submit" className="btn btn-secondary mr-1">
                        <FontAwesomeIcon icon={faPlay} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                        Update File Pendukung
                    </button>
                    <button type="submit" className="btn btn-secondary mr-1">
                        <FontAwesomeIcon icon={faPlay} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                        Approval Dokumen
                    </button>
                    <button type="submit" className="btn btn-secondary mr-1">
                        <FontAwesomeIcon icon={faPlay} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                        Detail dan Pembatalan
                    </button>
                </div>
            </div> */}
        </div>
    );
}
