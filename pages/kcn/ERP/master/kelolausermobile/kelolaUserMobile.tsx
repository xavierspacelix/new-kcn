import { useEffect, useState } from 'react';
import 'flatpickr/dist/flatpickr.css';
import 'tippy.js/dist/tippy.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import CreateDataUser from './modal/CreateDataUser';
import EditDataUserSales from './modal/EditDataUser/EditDataUserSales';
import EditDataUserOM from './modal/EditDataUser/EditDataUserOM';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSession } from '@/pages/api/sessionContext';
import { Dialog, Transition } from '@headlessui/react';

const kelolaUserMobile = () => {
    const { sessionData, isLoading } = useSession();
    const router = useRouter();
    const nama_user = sessionData?.nama_user ?? '';

    if (isLoading) {
        return;
    }

    const { userPermissions } = router.query;
    const [createDisabled, setCreateDisabled] = useState(false);
    const [editDisabled, setEditDisabled] = useState(false);
    const [deleteDisabled, setDeleteDisabled] = useState(false);

    useEffect(() => {
        if (typeof userPermissions === 'string') {
            const permissionsObj = JSON.parse(userPermissions);
            setEditDisabled(!permissionsObj.edit);
            setCreateDisabled(!permissionsObj.create);
            setDeleteDisabled(!permissionsObj.delete);
        }
    }, [userPermissions]);

    type KelolaUserItem = {
        id: any;
        entitas: any;
        nip: any;
        name: any;
        role: any;
        aktif: any;
    };

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [12, 50, 100, 500];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'entitas',
        direction: 'asc',
    });

    const [totalRecords, setTotalRecords] = useState(0);
    const [allRecords, setAllRecords] = useState<KelolaUserItem[]>([]);

    // Fetch and process data
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    const [recordsData, setRecordsData] = useState<KelolaUserItem[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const fetchDataUseEffect = async () => {
            try {
                const response = await axios.get(`${apiUrl}/erp/list_user?`, {
                    params: {
                        entitas: '',
                        is_active: 'Y',
                    },
                });
                const responseData = response.data.data;
                // console.log('responseData :', responseData);
                const transformedData: KelolaUserItem[] = responseData.map((item: any) => ({
                    id: item.id,
                    entitas: item.entitas,
                    nip: item.nip,
                    name: item.name,
                    role: item.role,
                    aktif: item.aktif,
                }));
                setAllRecords(transformedData);
                setTotalRecords(transformedData.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataUseEffect();
    }, []);

    const [filterEntitas, setFilterEntitas] = useState('');
    const [filterAktifUser, setAktifUser] = useState('Y');

    const fetchData = async (entitas: any, statusUser: any) => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_user?`, {
                params: {
                    entitas: entitas,
                    is_active: statusUser,
                },
            });
            const responseData = response.data.data;
            const transformedData: KelolaUserItem[] = responseData.map((item: any) => ({
                id: item.id,
                entitas: item.entitas,
                nip: item.nip,
                name: item.name,
                role: item.role,
                aktif: item.aktif,
            }));
            // console.log('transformedData :', transformedData);
            setAllRecords(transformedData);
            setTotalRecords(transformedData.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setPage(1);
    };

    // useEffect(() => {
    //     setPage(1);
    // }, [pageSize]);

    useEffect(() => {
        setPage(1);
    }, [searchKeyword, pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = Math.min(from + pageSize, totalRecords);

        const sortedData = [...allRecords].sort((a, b) => {
            const columnAccessor = sortStatus.columnAccessor as keyof KelolaUserItem;
            const direction = sortStatus.direction === 'asc' ? 1 : -1;

            if (a[columnAccessor] < b[columnAccessor]) return -direction;
            if (a[columnAccessor] > b[columnAccessor]) return direction;
            return 0;
        });

        // filter berdasarkan kata kunci pencarian
        const filteredData = sortedData.filter((record: any) => {
            const searchableColumns = ['entitas', 'nip', 'name', 'role'];
            return searchableColumns.some((column) => record[column].toLowerCase().includes(searchKeyword.toLowerCase()));
        });

        setTotalRecords(filteredData.length);

        const dataToDisplay = filteredData.slice(from, to);
        setRecordsData(dataToDisplay);
    }, [page, pageSize, sortStatus, allRecords, totalRecords, searchKeyword]);

    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    // console.log(selectedRow?.id);
    // console.log(selectedRow?.role);
    // console.log(selectedRow?.name);
    // console.log(selectedRow?.nip);
    // console.log(selectedRow?.entitas);
    // console.log(nama_user);

    const [editUserModalSales, setEditUserModalSales] = useState<boolean>(false);
    const [editUserModalOM, setEditUserModalOM] = useState<boolean>(false);

    const handleRowClick = (record: any, index: number) => {
        if (selectedRowIndex === index) {
        } else {
            setSelectedRow(record);
            setSelectedRowIndex(index);
        }
    };

    const [createDataUser, setCreateDataUser] = useState<boolean>(false);

    const [isActivating, setIsActivating] = useState(false);
    const patchUserStatus = async (entitas: any, id: any, nip: any, name: any, isActive: any) => {
        try {
            const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
            const url = `${apiUrl}/erp/hapus_user`;
            const requestData = {
                entitas: entitas,
                id: id,
                nip: nip,
                name: name,
                is_active: isActive, // 'Y'/'N'
                updated_at: created_at,
                updated_by: nama_user,
            };

            const response = await axios.patch(url, requestData);

            if (response.data.status === true) {
                console.log('Berhasil update data user:', response.data.data);
                fetchData(filterEntitas, filterAktifUser);
            } else {
                console.error('Gagal update data user:', response.data.message);
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat update user:', error);
        }
    };

    const [patchUserModal, setPatchUserModal] = useState(false);

    return (
        <div>
            <div className="mb-4 flex flex-col justify-between md:flex-row">
                <div className="flex flex-col md:flex-row">
                    <button
                        disabled={createDisabled}
                        type="submit"
                        className="btn btn-primary mb-2 md:mb-0 md:mr-2"
                        onClick={() => {
                            setCreateDataUser(true);
                        }}
                    >
                        Baru
                    </button>
                    <CreateDataUser isOpen={createDataUser} onRefresh={() => fetchData('', 'Y')} nama_user={nama_user} onClose={() => setCreateDataUser(false)} />
                    <button
                        disabled={editDisabled}
                        type="submit"
                        className="btn btn-warning mb-2 md:mb-0 md:mr-2"
                        onClick={() => {
                            if (selectedRow?.role == 'Salesman' || selectedRow?.role == 'Sales Supervisor') {
                                setEditUserModalSales(true);
                            } else if (selectedRow?.role == 'OM' || selectedRow?.role == 'RM' || selectedRow?.role == 'Manager' || selectedRow?.role == 'Admin / User') {
                                setEditUserModalOM(true);
                            } else {
                                alert('Pilih data user terlebih dahulu');
                            }
                        }}
                    >
                        Ubah Data
                    </button>
                    <EditDataUserSales
                        onRefresh={() => fetchData('', 'Y')}
                        selectedRow={selectedRow}
                        fetchData={fetchData}
                        isOpen={editUserModalSales}
                        nama_user={nama_user}
                        onClose={() => setEditUserModalSales(false)}
                        idUser={selectedRow?.id}
                    />
                    <EditDataUserOM
                        onRefresh={() => fetchData('', 'Y')}
                        selectedRow={selectedRow}
                        fetchData={fetchData}
                        isOpen={editUserModalOM}
                        nama_user={nama_user}
                        onClose={() => setEditUserModalOM(false)}
                        idUser={selectedRow?.id}
                    />

                    <button
                        disabled={deleteDisabled}
                        type="button"
                        className="btn btn-danger mb-2 md:mb-0 md:mr-2"
                        onClick={() => {
                            if (selectedRow) {
                                setIsActivating(false);
                                setPatchUserModal(true);
                            } else {
                                alert('Pilih data user terlebih dahulu');
                            }
                        }}
                    >
                        Nonaktif User
                    </button>

                    <button
                        disabled={deleteDisabled}
                        type="button"
                        className="btn btn-success mb-2 md:mb-0 md:mr-2"
                        onClick={() => {
                            if (selectedRow) {
                                setIsActivating(true); // Set to activate
                                setPatchUserModal(true);
                            } else {
                                alert('Pilih data user terlebih dahulu');
                            }
                        }}
                    >
                        Aktifkan User
                    </button>

                    <Transition appear show={patchUserModal}>
                        <Dialog as="div" open={patchUserModal} onClose={() => setPatchUserModal(false)}>
                            <Transition.Child enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                                        <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                            <div className="p-5">
                                                <p>
                                                    Apakah anda yakin ingin {isActivating ? 'aktifkan' : 'non-aktifkan'} status user {selectedRow?.name}?
                                                </p>
                                                <div className="mt-8 flex items-center justify-end">
                                                    <button
                                                        onClick={() => {
                                                            if (selectedRow) {
                                                                patchUserStatus(selectedRow.entitas, selectedRow.id, selectedRow.nip, selectedRow.name, isActivating ? 'Y' : 'N');
                                                                setSelectedRow(null);
                                                                setPatchUserModal(false);
                                                            } else {
                                                                alert('Pilih Data User terlebih dahulu');
                                                            }
                                                        }}
                                                        className="btn btn-danger mb-2 md:mb-0 md:mr-2"
                                                    >
                                                        OK
                                                    </button>
                                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setPatchUserModal(false)}>
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    <button
                        className="btn btn-info"
                        onClick={() => {
                            fetchData(filterEntitas, filterAktifUser);
                        }}
                    >
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Form Grid Layouts */}
            <div className="panel">
                {/* <div className="justify-between gap-5 sm:flex"> */}
                <div>
                    <div className="mb-2 flex flex-col gap-5 md:flex-row md:items-center">
                        <h5 className="text-lg font-semibold dark:text-white-light">
                            <div className="flex">
                                <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center mr-5">
                                    <h5 className="text-lg font-semibold dark:text-white-light">Entitas:</h5>
                                    <select className="form-select w-[19vh]" value={filterEntitas} onChange={(e) => setFilterEntitas(e.target.value)}>
                                        <option value="">Semua Entitas</option>
                                        <option value="100">100</option>
                                        <option value="102">102</option>
                                        <option value="103">103</option>
                                        <option value="104">104</option>
                                        <option value="105">105</option>
                                        <option value="106">106</option>
                                        <option value="107">107</option>
                                        <option value="109">109</option>
                                        <option value="110">110</option>
                                        <option value="111">111</option>
                                        <option value="112">112</option>
                                        <option value="113">113</option>
                                        <option value="114">114</option>
                                        <option value="116">116</option>
                                        <option value="121">121</option>
                                        <option value="122">122</option>
                                        <option value="300">300</option>
                                        <option value="898">898</option>
                                        <option value="999">999 (Training)</option>
                                    </select>
                                </div>
                                <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
                                    <h5 className="text-lg font-semibold dark:text-white-light">Status User:</h5>
                                    <select className="form-select w-[19vh]" value={filterAktifUser} onChange={(e) => setAktifUser(e.target.value)}>
                                        <option value="Y">Aktif</option>
                                        <option value="N">Non Aktif</option>
                                    </select>
                                </div>
                            </div>
                        </h5>
                        <div className="ltr:ml-auto rtl:mr-auto">
                            <input type="text" className="form-input w-auto" placeholder="Search..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
                        <DataTable
                            withColumnBorders={true}
                            highlightOnHover
                            className={`sticky-table whitespace-nowrap`}
                            records={recordsData}
                            onRowClick={( record, index ) => {
                                handleRowClick(record, index);
                            }}
                            rowStyle={(record, rowIndex) => ({
                                cursor: 'pointer',
                                background: selectedRowIndex === rowIndex ? '#f6f8fa' : 'transparent',
                            })}
                            columns={[
                                {
                                    accessor: 'entitas',
                                    title: 'Entitas',
                                    sortable: true,
                                },
                                {
                                    accessor: 'nip',
                                    title: 'Nip',
                                    sortable: true,
                                },
                                {
                                    accessor: 'name',
                                    title: 'Name',
                                    sortable: true,
                                },
                                {
                                    accessor: 'role',
                                    title: 'Role',
                                    sortable: true,
                                },
                                {
                                    accessor: 'aktif',
                                    title: 'Status',
                                    sortable: true,
                                },
                            ]}
                            totalRecords={totalRecords}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            height={'62vh'}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default kelolaUserMobile;
