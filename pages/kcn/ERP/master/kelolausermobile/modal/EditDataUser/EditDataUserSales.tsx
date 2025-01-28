import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Select from 'react-select';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface EditDataUserProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRow: any;
    fetchData: any;
    idUser: any;
    nama_user: any;
    onRefresh?: any;
}

export default function EditDataUserSales({ isOpen, onClose, selectedRow, idUser, nama_user, onRefresh }: EditDataUserProps) {
    // console.log(idUser, 'idUser')

    useEffect(() => {
        if (isOpen) {
            const getIdData = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/erp/list_user_byid?id=${idUser}`);
                    console.log('userData edit modal:', response);
                    const userData = response.data.entitas[0];

                    setSelectedEntitas(userData.entitas);
                    setSelectedRoleId(userData.role_id);

                    if (userData.role_id === 5) {
                        setSelectedRoleNama('Sales Supervisor');
                    } else if (userData.role_id === 6) {
                        setSelectedRoleNama('Salesman');
                    }
                    setSelectedSalesman(userData.name);

                    /////////////////////////////////////////////////////////////////////////////////////////////

                    // setSelectedSupervisor(userData.nama_spv); ==> diganti karena nama_spv null dari respon BE

                    const spvResponse = await axios.get(`${apiUrl}/erp/sales_spv?entitas=${userData.entitas}`);
                    const spvList = spvResponse.data.entitas;

                    //  matching supervisor
                    const matchingSpv = spvList.find((spv: any) => spv.kode_sales === userData.kode_sales_spv);

                    if (matchingSpv) {
                        setSelectedSupervisor(matchingSpv.nama_sales);
                    } else {
                        setSelectedSupervisor('');
                    }

                    ///////////////////////////////////////////////////////////////////////////////////////////////
                    setNip(userData.nip);
                    setNama(userData.name);
                    setKodeSales(userData.kode_sales);
                    setKodeSalesSPV(userData.kode_sales_spv);
                    setNoSales(userData.no_sales);
                    setGender(userData.gender);
                    if (userData.userid == undefined) {
                        setUserIdUsed('');
                    } else {
                        setUserIdUsed(userData.userid);
                    }
                    setSelectedOptions(userData.menu);
                    setPasswordfromdb(userData.password);
                } catch (error) {
                    console.error('Error Id record:', error);
                }
            };
            getIdData();
        }
        //console.log(idUser, 'idUser modal edit');
    }, [isOpen, selectedRow?.id]);

    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const [selectedEntitas, setSelectedEntitas] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [selectedRoleNama, setSelectedRoleNama] = useState('');
    const [selectedSalesman, setSelectedSalesman] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [nip, setNip] = useState('');
    const [nama, setNama] = useState('');
    const [kodeSales, setKodeSales] = useState('');
    const [kodeSalesSPV, setKodeSalesSPV] = useState('');
    const [noSales, setNoSales] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [password, setPassword] = useState('');
    const [passwordfromdb, setPasswordfromdb] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [gender, setGender] = useState('');
    const [userIdUsed, setUserIdUsed] = useState('');
    //console.log(userIdUsed, 'userIdUsed');

    useEffect(() => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        setUpdatedAt(currentDateTime);
    }, []);

    const [entitasOptions, setEntitasOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [supervisorOptions, setSupervisorOptions] = useState<any[]>([]);

    //menu (Dropdown)
    //const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<string>('');

    const menuOptions: Record<string, string> = {
        '1': 'Standar Harga Jual Simulator',
        '2': 'Standar Harga Jual Pricelist',
        '3': 'Besi Kompetitor',
        '4': 'Kunjungan',
        '5': 'Pembayaran [PPI]',
        '6': 'Sales Orders [50]',
        '7': 'Approval HKS',
        '8': 'Approval So',
        '9': 'Approval Aktivasi dan Open BL',
        '10': 'Bukti Pesanan Barang [BPB]',
        '11': 'Approval Besi Kompetitor',
        '12': 'Opname Asset',
    };

    //fetch API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [entitasResponse, roleResponse] = await Promise.all([axios.get(`${apiUrl}/erp/entitas`), axios.get(`${apiUrl}/erp/role`)]);

                const entitasData = entitasResponse.data;
                const roleData = roleResponse.data;

                if (entitasData.status && entitasData.entitas.length > 0) {
                    setEntitasOptions(entitasData.entitas);
                }

                if (roleData.status && roleData.entitas.length > 0) {
                    setRoleOptions(roleData.entitas);
                }

                if (selectedEntitas && selectedRoleNama) {
                    const [salesmanResponse, supervisorResponse] = await Promise.all([
                        axios.get(`${apiUrl}/erp/sales?entitas=${selectedEntitas.split(' ')[0]}&role=${selectedRoleNama}`),
                        axios.get(`${apiUrl}/erp/sales?entitas=${selectedEntitas.split(' ')[0]}&role=sales supervisor`),
                    ]);

                    const salesmanData = salesmanResponse.data.entitas;
                    const supervisorData = supervisorResponse.data.entitas;
                    if (salesmanData && salesmanData.length > 0) {
                        setSalesmanOptions(salesmanData);
                    }

                    if (supervisorData && supervisorData.length > 0) {
                        setSupervisorOptions(supervisorData);
                        setKodeSalesSPV(supervisorResponse.data.entitas.kode_sales);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            if (selectedRoleNama === 'Sales Supervisor') {
                setSupervisorOptions([]);
            }
        };

        fetchData();
    }, [selectedEntitas, selectedRoleNama]);

    useEffect(() => {
        const fetchDataUserId = async () => {
            try {
                if (selectedEntitas && nip && selectedSalesman) {
                    const url = `${apiUrl}/erp/userid?entitas=${selectedEntitas.split(' ')[0]}&nip=${nip}&nama_user=${selectedSalesman}`;

                    const getuserid = await axios.get(url);
                    const useridData = getuserid.data.entitas[0]?.userid;

                    if (useridData && useridData.length > 0) {
                        setUserIdUsed(useridData);
                    }
                } else {
                    //console.log('Satu atau lebih parameter tidak ada atau null');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataUserId();
    }, [selectedEntitas, nip, selectedSalesman]);

    //handle Password
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRetypePasswordVisible, setIsRetypePasswordVisible] = useState(false);

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const handleRetypePasswordChange = (event: any) => {
        setRetypePassword(event.target.value);
    };

    useEffect(() => {
        const validatePasswords = () => {
            if (password === retypePassword) {
                setIsSaveEnabled(true);
            } else {
                setIsSaveEnabled(false);
            }
        };

        const timeout = setTimeout(validatePasswords, 1000);
        return () => clearTimeout(timeout);
    }, [password, retypePassword]);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleRetypePasswordVisibility = () => {
        setIsRetypePasswordVisible(!isRetypePasswordVisible);
    };

    //Submit
    // const handleEdit = async () => {
    //     console.log('id:', idUser);
    //     console.log('nip:', nip);
    //     console.log('kode sales:', kodeSales);
    //     console.log('no sales:', noSales);
    //     console.log('user id :', userIdUsed);
    //     console.log('name:', nama);
    //     console.log('Password enkripsi :', passwordEncrypt);
    //     console.log('Password :', passwordfromdb);
    //     console.log('role_id:', selectedRoleId);
    //     console.log('kode sales spv:', kodeSalesSPV);
    //     console.log('updated_at :', updatedAt);
    //     console.log('updated_by :', 1);
    //     console.log('entitas:', selectedEntitas.split(' ')[0]);
    //     console.log('menu:', selectedOptions);
    //     console.log('gender:', gender);
    // };

    const handleEdit = async () => {
        try {
            const userDataToUpdate = {
                id: idUser,
                nip: nip,
                kode_sales: kodeSales,
                no_sales: noSales,
                userid: userIdUsed ? userIdUsed : '',
                name: nama,
                // Password yang akan dikirimkan sesuai dengan kondisi
                // Jika password tidak berubah, mengirimkan `passwordfromdb` //dari be pass tidak di hash
                // Jika password berubah, mengirimkan `password` //dari be pass di hash
                password: password !== null ? password : passwordfromdb,
                role_id: selectedRoleId,
                kode_sales_spv: kodeSalesSPV ? kodeSalesSPV : '',
                updated_at: updatedAt,
                updated_by: nama_user,
                entitas: selectedEntitas.split(' ')[0],
                menu: selectedOptions,
                gender: gender,
            };

            // Kirim permintaan PATCH ke endpoint
            const response = await axios.patch(`${apiUrl}/erp/edit_user`, userDataToUpdate);

            // Cek jika permintaan berhasil
            if (response.status === 200) {
                console.log('Berhasil memperbarui data pengguna:', response.data);
                onClose();
                onRefresh();
                // window.location.reload();
                withReactContent(swal).fire({
                    title: ``,
                    html: '<p style="font-size:15px">Data Telah Berhasil Diedit!.</p>',
                    icon: 'success',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    timer: 2000,
                });
            } else {
                withReactContent(swal).fire({
                    title: ``,
                    html: '<p style="font-size:15px">Data Gagal Diedit!.</p>',
                    icon: 'error',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    // timer: 2000,
                });
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    };

    return (
        <Transition appear show={isOpen ? true : false} as={React.Fragment}>
            <Dialog as="div" open={isOpen ? true : false} onClose={onClose}>
                {/* ... Modal Overlay ... */}
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
                            {/* ... Modal Content ... */}
                            <Dialog.Panel className="panel my-8 w-full max-w-[70vh] rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="text-lg font-bold">Ubah Data User</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 px-5 py-3">
                                    <div>
                                        <label className="block font-semibold">Entitas</label>
                                        <Select
                                            isSearchable={true}
                                            value={selectedEntitas ? { value: selectedEntitas, label: selectedEntitas } : null}
                                            options={entitasOptions.map((entitas: any) => ({
                                                value: `${entitas.kodecabang} - ${entitas.cabang}`,
                                                label: `${entitas.kodecabang} - ${entitas.cabang}`,
                                            }))}
                                            onChange={(selectedOption) => {
                                                if (selectedOption) {
                                                    setSelectedEntitas(selectedOption.value);
                                                    // setSelectedRoleId('');
                                                    // setSelectedRoleNama('');
                                                    // setNip('');
                                                    // setNama('');
                                                    // setNoSales('');
                                                    // setKodeSales('');
                                                    // setKodeSalesSPV('');
                                                    // setSelectedSalesman('');
                                                    // setSelectedSupervisor('');
                                                    // setPassword('');
                                                    // setRetypePassword('');
                                                }
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div>
                                            <label className="block font-semibold">Role/Hak Akses</label>
                                            <Select
                                                isSearchable={true}
                                                isDisabled={!selectedEntitas}
                                                value={selectedRoleId && selectedRoleNama ? { value: `${selectedRoleId}-${selectedRoleNama}`, label: selectedRoleNama } : null}
                                                options={roleOptions.map((entitas: any) => ({
                                                    value: `${entitas.role_id}-${entitas.role_name}`,
                                                    label: entitas.role_name,
                                                }))}
                                                onChange={(selectedOption) => {
                                                    if (selectedOption) {
                                                        const [roleId, roleNama] = selectedOption.value.split('-');
                                                        setSelectedRoleId(roleId);
                                                        setSelectedRoleNama(roleNama);
                                                        // setNip('');
                                                        // setNama('');
                                                        // setNoSales('');
                                                        // setKodeSales('');
                                                        setKodeSalesSPV('');
                                                        // setSelectedSalesman('');
                                                        setSelectedSupervisor('');
                                                        // setPassword('');
                                                        // setRetypePassword('');
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Salesman</label>
                                        <div>
                                            <Select
                                                isSearchable={true}
                                                value={selectedSalesman ? { value: selectedSalesman, label: selectedSalesman } : null}
                                                options={salesmanOptions.map((salesman: any) => ({
                                                    value: salesman.nama_sales,
                                                    label: salesman.nama_sales,
                                                }))}
                                                onChange={(selectedOption) => {
                                                    if (selectedOption) {
                                                        const selectedSalesmanName = selectedOption.value;
                                                        setSelectedSalesman(selectedSalesmanName);

                                                        if (salesmanOptions && salesmanOptions.length > 0) {
                                                            const selectedSalesman = salesmanOptions.find((salesman) => salesman.nama_sales === selectedSalesmanName);

                                                            if (selectedSalesman) {
                                                                let modifiedNip = selectedSalesman.nip || '';

                                                                if (selectedRoleId === '5' && selectedSalesman.nama_sales === 'VACANT') {
                                                                    modifiedNip += 'spv';
                                                                } else if (selectedRoleId === '6' && selectedSalesman.nama_sales === 'VACANT') {
                                                                    modifiedNip += 'sls';
                                                                }
                                                                setNip(modifiedNip || '');
                                                                setNama(selectedSalesman.nama_sales);
                                                                setNoSales(selectedSalesman.no_sales);
                                                                setKodeSales(selectedSalesman.kode_sales || '');
                                                            } else {
                                                                setNip('');
                                                                setNama('');
                                                                setNoSales('');
                                                                setKodeSales('');
                                                                setPassword('');
                                                                setRetypePassword('');
                                                            }
                                                        }
                                                    }
                                                }}
                                                isDisabled={!selectedRoleNama}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Sales Supervisor</label>
                                        <Select
                                            isSearchable={true}
                                            value={selectedSupervisor ? { value: selectedSupervisor, label: selectedSupervisor } : null}
                                            options={supervisorOptions.map((supervisor: any) => ({
                                                value: supervisor.nama_sales,
                                                label: supervisor.nama_sales,
                                            }))}
                                            onChange={(selectedOption) => {
                                                if (selectedOption) {
                                                    const selectedSupervisorName = selectedOption.value;
                                                    setSelectedSupervisor(selectedSupervisorName);
                                                    if (supervisorOptions && supervisorOptions.length > 0) {
                                                        const selectedSupervisor = supervisorOptions.find((supervisor) => supervisor.nama_sales === selectedSupervisorName);
                                                        if (selectedSupervisor) {
                                                            setKodeSalesSPV(selectedSupervisor.kode_sales);
                                                        }
                                                    }
                                                }
                                            }}
                                            isDisabled={!selectedRoleNama || selectedRoleNama === 'Sales Supervisor'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">NIP</label>
                                        <input type="text" className="form-input" placeholder="NIP" value={nip} disabled style={{ height: '5vh' }} />
                                    </div>
                                    <div>
                                        <label className="block font-semibold">Nama</label>
                                        <input type="text" id="namaUserMobile" className="form-input" value={nama} placeholder="Nama Akun" disabled style={{ height: '5vh' }} />
                                    </div>
                                    <div className="col-span-2">
                                        <div>
                                            <label className="block font-semibold">Pilih Menu:</label>
                                            <Select
                                                isMulti={true}
                                                isDisabled={!nip}
                                                value={selectedOptions.split(',').map((option) => ({
                                                    value: option.trim(),
                                                    label: menuOptions[option.trim()],
                                                }))}
                                                options={Object.keys(menuOptions).map((key) => ({
                                                    value: key,
                                                    label: `${key}. ${menuOptions[key]}`,
                                                }))}
                                                onChange={(selectedOptions) => {
                                                    if (selectedOptions) {
                                                        setSelectedOptions(selectedOptions.map((option) => option.value).join(','));
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="mb-2">
                                            <div className="mb-2">
                                                <label className="block font-semibold">Jenis Kelamin</label>
                                                <Select
                                                    isSearchable={true}
                                                    isDisabled={!selectedOptions || (Array.isArray(selectedOptions) && selectedOptions.length === 0)}
                                                    value={gender ? { value: gender, label: gender === 'L' ? 'Laki-Laki' : 'Perempuan' } : null}
                                                    onChange={(selectedOption) => {
                                                        if (selectedOption) {
                                                            setGender(selectedOption.value);
                                                        } else {
                                                            setGender('');
                                                        }
                                                    }}
                                                    options={[
                                                        { value: '', label: 'Pilih Jenis Kelamin' },
                                                        { value: 'L', label: 'Laki-Laki' },
                                                        { value: 'P', label: 'Perempuan' },
                                                    ]}
                                                />
                                            </div>
                                        </div>

                                        <label className="block font-semibold">Password</label>
                                        <div className="relative mb-2">
                                            <input
                                                id="PasswordUserMobile"
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                className="form-input"
                                                placeholder="Password"
                                                value={password}
                                                onChange={handlePasswordChange}
                                                style={{ height: '5vh' }}
                                                disabled={!nip}
                                                autoComplete="new-password"
                                            />
                                            <FontAwesomeIcon
                                                icon={isPasswordVisible ? faEyeSlash : faEye}
                                                className="absolute right-2 top-2 cursor-pointer"
                                                width="18"
                                                height="18"
                                                onClick={togglePasswordVisibility}
                                            />
                                        </div>
                                        <label className="block font-semibold">Retype Password</label>
                                        <div className="relative">
                                            <input
                                                type={isRetypePasswordVisible ? 'text' : 'password'}
                                                className="form-input"
                                                placeholder="Retype Password"
                                                value={retypePassword}
                                                style={{ height: '5vh' }}
                                                disabled={!password}
                                                onChange={handleRetypePasswordChange}
                                            />
                                            <FontAwesomeIcon
                                                icon={isRetypePasswordVisible ? faEyeSlash : faEye}
                                                className="absolute right-2 top-2 cursor-pointer"
                                                width="18"
                                                height="18"
                                                onClick={toggleRetypePasswordVisibility}
                                            />
                                        </div>
                                        {!isSaveEnabled && <span className="text-red-500">Password yang Anda masukkan tidak sama</span>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 px-5 py-3">
                                    <button type="button" className="btn btn-primary mb-4" style={{ width: '9vh', height: '4.5vh' }} onClick={handleEdit} disabled={!isSaveEnabled}>
                                        Simpan
                                    </button>

                                    <button type="button" className="btn btn-outline-danger mb-4" onClick={onClose} style={{ width: '9vh', height: '4.5vh' }}>
                                        Batal
                                    </button>
                                </div>

                                {/* userId: {userid}, Entitas: {kode_entitas} */}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
