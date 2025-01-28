import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';

interface CreateDataUserProps {
    isOpen: boolean;
    onClose: () => void;
    nama_user: any;
    onRefresh: any;
}

export default function CreateDataUser({ isOpen, onClose, nama_user, onRefresh }: CreateDataUserProps) {
    //START Sales&SPVSales
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
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [gender, setGender] = useState('');
    const [userIdUsed, setUserIdUsed] = useState('');

    useEffect(() => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        setCreatedAt(currentDateTime);
        setUpdatedAt(currentDateTime);
    }, []);

    const [entitasOptions, setEntitasOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [salesmanOptions, setSalesmanOptions] = useState<any[]>([]);
    const [supervisorOptions, setSupervisorOptions] = useState<any[]>([]);

    //menu (Dropdown)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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
    // const handleSave = async () => {
    //     console.log('entitas:', selectedEntitas.split(' ')[0]);
    //     console.log('role_id:', selectedRoleId);
    //     console.log('name:', nama);
    //     console.log('Supervisor:', selectedSupervisor);
    //     console.log('nip:', nip);
    //     console.log('kode sales:', kodeSales);
    //     console.log('kode sales spv:', kodeSalesSPV);
    //     console.log('no sales:', noSales);
    //     console.log('menu:', selectedOptions);
    //     console.log('gender:', gender);
    //     console.log('Password :', retypePassword);
    //     console.log('created_at :', createdAt);
    //     console.log('updated_at :', updatedAt);
    //     console.log('created_by :', 1);
    //     console.log('updated_by :', 1);
    //     console.log('user id :', userIdUsed);
    // };

    const handleSave = async () => {
        try {
            if ((parseInt(selectedRoleId) === 6 && kodeSalesSPV) || (parseInt(selectedRoleId) === 5 && !kodeSalesSPV)) {
                const url = `${apiUrl}/erp/simpan_register`;
                const requestBody = {
                    nip: nip,
                    kode_sales: kodeSales,
                    no_sales: noSales,
                    name: nama,
                    password: password,
                    role_id: selectedRoleId,
                    kode_sales_spv: kodeSalesSPV,
                    created_at: createdAt,
                    updated_at: updatedAt,
                    created_by: nama_user,
                    updated_by: 1,
                    userid: userIdUsed,
                    menu: selectedOptions,
                    gender: gender,
                    entitas: selectedEntitas.split(' ')[0],
                };

                const response = await axios.post(url, requestBody);
                // console.log(requestBody, 'requestBody');
                // console.log('Response from server:', response.data);

                if (response.data.status == true) {
                    onClose();
                    onRefresh();
                    // window.location.reload();
                    withReactContent(swal).fire({
                        title: ``,
                        html: '<p style="font-size:15px">Data Telah Berhasil Disimpan!.</p>',
                        icon: 'success',
                        width: '350px',
                        heightAuto: true,
                        showConfirmButton: false,
                        timer: 2000,
                    });
                } else if (response.data.status == false) {
                    withReactContent(swal).fire({
                        title: ``,
                        html: '<p style="font-size:15px">Data Gagal Disimpan!.</p>',
                        icon: 'error',
                        width: '350px',
                        heightAuto: true,
                        showConfirmButton: false,
                        // timer: 2000,
                    });
                }
            } else {
                withReactContent(swal).fire({
                    title: ``,
                    html: '<p style="font-size:14px; text-align: center;">Silahkan isi data Sales Supervisor!!</p>',
                    icon: 'error',
                    width: '350px',
                    heightAuto: true,
                    showConfirmButton: false,
                    // timer: 2000,
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //END Sales&SPVSales

    //START OM,RM dan User

    //entitas om
    const [selectedEntitasOM, setSelectedEntitasOM] = useState<string[]>([]);
    const [entitasOptionsOM, setEntitasOptionsOM] = useState([]);

    useEffect(() => {
        const fetchDataEntitasOM = async () => {
            try {
                const response = await axios.get(`${apiUrl}/erp/entitas`);
                const data = response.data.entitas;
                if (data && data.length > 0) {
                    setEntitasOptionsOM(data);
                    const options: { [key: string]: string } = {};
                    data.forEach((entitas: any) => {
                        options[entitas.kodecabang] = entitas.cabang;
                    });
                }
            } catch (error) {
                console.error('Error fetching entitas data:', error);
            }
        };
        fetchDataEntitasOM();
    }, []);

    //menu Om
    const [selectedOptionsMenuOM, setSelectedOptionsMenuOM] = useState<string[]>([]);

    const menuOptionsOM: Record<string, string> = {
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

    //gender om
    const [genderOM, setGenderOM] = useState('');

    // role om
    const [selectedRoleIdOM, setSelectedRoleIdOM] = useState('');
    const [selectedRoleNamaOM, setSelectedRoleNamaOM] = useState('');
    const [entitasUser, setEntitasUser] = useState('');
    const [roleOptionsOM, setRoleOptionsOM] = useState([]);

    useEffect(() => {
        const fetchDataRoleOM = async () => {
            try {
                const [roleResponseOM] = await Promise.all([axios.get(`${apiUrl}/erp/role_om`)]);

                const roleDataOM = roleResponseOM.data;

                if (roleDataOM.status && roleDataOM.entitas.length > 0) {
                    setRoleOptionsOM(roleDataOM.entitas);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataRoleOM();
    }, [selectedRoleNamaOM]);

    const [selectedNamaOM, setSelectedNamaOM] = useState('');
    const [namaUserOptions, setNamaUserOptions] = useState<any[]>([]);
    const [nipOM, setNipOM] = useState('');
    const [namaOM, setNamaOM] = useState('');
    const [userIdUsedOM, setUserIdUsedOM] = useState('');

    useEffect(() => {
        const fetchDataUserIdOM = async () => {
            try {
                if (entitasUser && nipOM && namaOM) {
                    const url = `${apiUrl}/erp/userid?entitas=${entitasUser}&nip=${nipOM}&nama_user=${namaOM}`;

                    const getuseridOM = await axios.get(url);
                    const useridDataOM = getuseridOM.data.entitas[0]?.userid;

                    if (useridDataOM && useridDataOM.length > 0) {
                        setUserIdUsedOM(useridDataOM);
                    }
                } else {
                    //console.log('Satu atau lebih parameter tidak ada atau null');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataUserIdOM();
    }, [entitasUser, nipOM, namaOM]);

    //handle password
    const [passwordOM, setPasswordOM] = useState('');
    const [retypePasswordOM, setRetypePasswordOM] = useState('');
    const [isSaveEnabledOM, setIsSaveEnabledOM] = useState(false);
    const [isPasswordVisibleOM, setIsPasswordVisibleOM] = useState(false);
    const [isRetypePasswordVisibleOM, setIsRetypePasswordVisibleOM] = useState(false);

    const handlePasswordChangeOM = (event: any) => {
        setPasswordOM(event.target.value);
    };

    const handleRetypePasswordChangeOM = (event: any) => {
        setRetypePasswordOM(event.target.value);
    };

    useEffect(() => {
        const validatePasswordsOM = () => {
            if (passwordOM === retypePasswordOM) {
                setIsSaveEnabledOM(true);
            } else {
                setIsSaveEnabledOM(false);
            }
        };
        const timeout = setTimeout(validatePasswordsOM, 1000);
        return () => clearTimeout(timeout);
    }, [passwordOM, retypePasswordOM]);

    const togglePasswordVisibilityOM = () => {
        setIsPasswordVisibleOM(!isPasswordVisibleOM);
    };

    const toggleRetypePasswordVisibilityOM = () => {
        setIsRetypePasswordVisibleOM(!isRetypePasswordVisibleOM);
    };

    const selectedEntitasOMAngka = selectedEntitasOM.map((entitas) => {
        const parts = entitas.split(' - ');
        const angka = parts[0];
        return angka;
    });

    // const handleSaveOM = () => {
    //     console.log('entitas:', selectedEntitasOMAngka);
    //     console.log('menu: ', selectedOptionsMenuOM);
    //     console.log('gender: ', genderOM);
    //     console.log('role name : ', selectedRoleNamaOM);
    //     console.log('role id : ', selectedRoleIdOM);
    //     console.log('nama : ', namaOM);
    //     console.log('nip : ', nipOM);
    //     console.log('pass: ', passwordOM);
    //     console.log('retype pass: ', retypePasswordOM);
    //     console.log('kode_sales: ', nipOM);
    //     console.log('kode_sales_spv: ', selectedRoleIdOM);
    //     console.log('no_sales: ', selectedRoleNamaOM);
    //     console.log('userid : ', userIdUsedOM);
    // };

    const handleSaveOM = async () => {
        try {
            const url = `${apiUrl}/erp/simpan_register`;

            let adjustedRoleName = selectedRoleNamaOM;
            if (selectedRoleNamaOM === 'OM') {
                adjustedRoleName = '[OM] Operasional Manajer';
            } else if (selectedRoleNamaOM === 'Manager') {
                adjustedRoleName = 'Manajer';
            } else if (selectedRoleNamaOM === 'RM') {
                adjustedRoleName = '[RM] Regional Manajer';
            } else if (selectedRoleNamaOM === 'Admin / User') {
                adjustedRoleName = 'Staff';
            }

            const requestBody = {
                nip: nipOM,
                name: namaOM,
                password: retypePasswordOM,
                role_name: adjustedRoleName,
                role_id: selectedRoleIdOM,
                created_at: createdAt,
                updated_at: updatedAt,
                created_by: nama_user,
                updated_by: 1,
                menu: selectedOptionsMenuOM,
                kode_sales: nipOM,
                kode_sales_spv: selectedRoleIdOM,
                no_sales: selectedRoleNamaOM,
                gender: genderOM,
                entitas: selectedEntitasOMAngka,
                userid: userIdUsedOM,
            };
            const response = await axios.post(url, requestBody);
            console.log('Response from server:', response.data);

            if (response.data.status == true) {
                onClose();
                window.location.reload();
            }
            if (response.data.status == false) {
                alert('Gagal Simpan Data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //END OM,RM dan User

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
                                    <div className="text-lg font-bold">Pendaftaran Akun</div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={onClose}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>

                                <Tabs className="px-5 py-3">
                                    <TabList>
                                        <Tab>Daftar Akun Sales/SPV</Tab>
                                        <Tab>Daftar Akun OM, RM, dan User</Tab>
                                    </TabList>

                                    <TabPanel id="tabpanel1">
                                        <div className="grid grid-cols-2 gap-3">
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
                                                            setSelectedRoleId('');
                                                            setSelectedRoleNama('');
                                                            setNip('');
                                                            setNama('');
                                                            setNoSales('');
                                                            setKodeSales('');
                                                            setKodeSalesSPV('');
                                                            setSelectedSalesman('');
                                                            setSelectedSupervisor('');
                                                            setPassword('');
                                                            setRetypePassword('');
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
                                                                setNip('');
                                                                setNama('');
                                                                setNoSales('');
                                                                setKodeSales('');
                                                                setKodeSalesSPV('');
                                                                setSelectedSalesman('');
                                                                setSelectedSupervisor('');
                                                                setPassword('');
                                                                setRetypePassword('');
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
                                                                        setKodeSalesSPV('');
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
                                                <input
                                                    type="text"
                                                    id="nipuser"
                                                    className="form-input"
                                                    placeholder="NIP"
                                                    value={nip}
                                                    // onChange={(e) => setNip(e.target.value)}
                                                    disabled
                                                    style={{ height: '5vh' }}
                                                />
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
                                                        value={selectedOptions.map((option) => ({ value: option, label: menuOptions[option] }))}
                                                        options={Object.keys(menuOptions).map((key) => ({
                                                            value: key,
                                                            label: `${key}. ${menuOptions[key]}`,
                                                        }))}
                                                        onChange={(selectedOptions) => {
                                                            if (selectedOptions) {
                                                                setSelectedOptions(selectedOptions.map((option) => option.value));
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

                                        <div className="mt-4 flex justify-end space-x-4">
                                            <button type="button" className="btn btn-primary mb-4" style={{ width: '9vh', height: '4.5vh' }} onClick={handleSave} disabled={!isSaveEnabled}>
                                                Simpan
                                            </button>

                                            <button type="button" className="btn btn-outline-danger mb-4" onClick={onClose} style={{ width: '9vh', height: '4.5vh' }}>
                                                Batal
                                            </button>
                                        </div>
                                    </TabPanel>

                                    <TabPanel id="tabpanel2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <div>
                                                    <label className="block font-semibold">Pilih Entitas</label>
                                                    <Select
                                                        isSearchable={true}
                                                        isMulti={true}
                                                        value={selectedEntitasOM.map((option) => ({ value: option, label: option }))}
                                                        options={entitasOptionsOM.map((entitas: any) => ({
                                                            value: `${entitas.kodecabang} - ${entitas.cabang}`,
                                                            label: `${entitas.kodecabang} - ${entitas.cabang}`,
                                                        }))}
                                                        onChange={(selectedOptions) => {
                                                            if (selectedOptions) {
                                                                setSelectedEntitasOM(selectedOptions.map((option) => option.value));
                                                                setSelectedRoleIdOM('');
                                                                setSelectedRoleNamaOM('');
                                                                setNipOM('');
                                                                setNamaOM('');
                                                                setSelectedOptionsMenuOM([]);
                                                                setGenderOM('');
                                                                setSelectedNamaOM('');
                                                                setPasswordOM('');
                                                                setRetypePasswordOM('');
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label className="block font-semibold">Pilih Menu</label>
                                                    <Select
                                                        isMulti={true}
                                                        isDisabled={!selectedEntitasOM || (Array.isArray(selectedEntitasOM) && selectedEntitasOM.length === 0)}
                                                        value={selectedOptionsMenuOM.map((option) => ({ value: option, label: menuOptionsOM[option] }))}
                                                        options={Object.keys(menuOptionsOM).map((key) => ({
                                                            value: key,
                                                            label: `${key}. ${menuOptionsOM[key]}`,
                                                        }))}
                                                        onChange={(selectedOptionsMenuOM) => {
                                                            if (selectedOptionsMenuOM) {
                                                                setSelectedOptionsMenuOM(selectedOptionsMenuOM.map((option) => option.value));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <label className="block font-semibold">Jenis Kelamin</label>
                                                    <Select
                                                        isSearchable={true}
                                                        isDisabled={!selectedOptionsMenuOM || (Array.isArray(selectedOptionsMenuOM) && selectedOptionsMenuOM.length === 0)}
                                                        value={genderOM ? { value: genderOM, label: genderOM === 'L' ? 'Laki-Laki' : 'Perempuan' } : null}
                                                        onChange={(selectedOption) => {
                                                            if (selectedOption) {
                                                                setGenderOM(selectedOption.value);
                                                            } else {
                                                                setGenderOM('');
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
                                            <div>
                                                <label className="block font-semibold">Role/Hak Akses</label>
                                                <Select
                                                    value={selectedRoleIdOM && selectedRoleNamaOM ? { value: `${selectedRoleIdOM}-${selectedRoleNamaOM}`, label: selectedRoleNamaOM } : null}
                                                    isDisabled={!genderOM}
                                                    options={roleOptionsOM
                                                        .filter(
                                                            (entitas: any) =>
                                                                entitas.role_name === 'RM' || entitas.role_name === 'Manager' || entitas.role_name === 'OM' || entitas.role_name === 'Admin / User',
                                                        )
                                                        .map((entitas: any) => ({
                                                            value: `${entitas.role_id}-${entitas.role_name}`,
                                                            label: entitas.role_name,
                                                        }))}
                                                    onChange={async (selectedOption) => {
                                                        if (selectedOption) {
                                                            const [role_id, role_name] = selectedOption.value.split('-');
                                                            setSelectedRoleIdOM(role_id);
                                                            setSelectedRoleNamaOM(role_name);

                                                            let adjustedRoleName = role_name;
                                                            if (role_name === 'Manager') {
                                                                adjustedRoleName = 'Manajer';
                                                            } else if (role_name === 'Admin / User') {
                                                                adjustedRoleName = 'Staff';
                                                            } else if (role_name === 'OM') {
                                                                adjustedRoleName = '[OM] Operasional Manajer';
                                                            } else if (role_name === 'RM') {
                                                                adjustedRoleName = '[RM] Regional Manajer';
                                                            }

                                                            setSelectedNamaOM('');
                                                            setNipOM('');
                                                            setNamaOM('');
                                                            setUserIdUsedOM('');

                                                            try {
                                                                const response = await axios.get(`${apiUrl}/erp/nip_hris?role=${adjustedRoleName}`);
                                                                const data = response.data.entitas;
                                                                if (data && data.length > 0) {
                                                                    setNamaUserOptions(data);
                                                                }
                                                            } catch (error) {
                                                                console.error('Error fetching nama user data:', error);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-semibold">Select Nama</label>
                                                <Select
                                                    value={selectedNamaOM ? { value: selectedNamaOM, label: selectedNamaOM } : null}
                                                    isDisabled={!selectedRoleIdOM}
                                                    options={namaUserOptions.map((data) => ({
                                                        value: data.Full_Name,
                                                        label: data.Full_Name,
                                                    }))}
                                                    onChange={(selectedOption) => {
                                                        if (selectedOption) {
                                                            const selectedNama = selectedOption.value;
                                                            setSelectedNamaOM(selectedNama);
                                                            const selectedUser = namaUserOptions.find((user) => user.Full_Name === selectedNama);
                                                            if (selectedUser) {
                                                                setNipOM(selectedUser.emp_no || '');
                                                                setNamaOM(selectedUser.Full_Name || '');
                                                                setEntitasUser(selectedUser.dept_code || '');
                                                            } else {
                                                                setNipOM('');
                                                                setNamaOM('');
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-semibold">NIP</label>
                                                <input type="text" className="form-input" placeholder="NIP" value={nipOM} disabled style={{ height: '5vh' }} />
                                            </div>
                                            <div>
                                                <label className="block font-semibold">Nama</label>
                                                <input type="text" id="namaUserMobile" className="form-input" value={namaOM} placeholder="Nama Akun" disabled style={{ height: '5vh' }} />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block font-semibold">Password</label>
                                                <div className="relative">
                                                    <input
                                                        id="PasswordUserOM"
                                                        type={isPasswordVisibleOM ? 'text' : 'password'}
                                                        className="form-input mb-2"
                                                        placeholder="Password"
                                                        value={passwordOM}
                                                        autoComplete="new-password"
                                                        style={{ height: '5vh' }}
                                                        disabled={!nipOM}
                                                        onChange={handlePasswordChangeOM}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={isPasswordVisibleOM ? faEyeSlash : faEye}
                                                        className="absolute right-2 top-2 cursor-pointer"
                                                        width="18"
                                                        height="18"
                                                        onClick={togglePasswordVisibilityOM}
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="block font-semibold">Retype Password</label>
                                                    <div className="relative">
                                                        <input
                                                            id="RePasswordUserOM"
                                                            type={isRetypePasswordVisibleOM ? 'text' : 'password'}
                                                            className="form-input mb-2.5"
                                                            placeholder="Retype Password"
                                                            value={retypePasswordOM}
                                                            style={{ height: '5vh' }}
                                                            disabled={!passwordOM}
                                                            onChange={handleRetypePasswordChangeOM}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={isRetypePasswordVisibleOM ? faEyeSlash : faEye}
                                                            className="absolute right-2 top-2 cursor-pointer"
                                                            width="18"
                                                            height="18"
                                                            onClick={toggleRetypePasswordVisibilityOM}
                                                        />
                                                    </div>
                                                    {!isSaveEnabledOM && <span className="text-red-500">Password yang Anda masukkan tidak sama</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-end space-x-4">
                                            <button type="button" className="btn btn-primary mb-4" style={{ width: '9vh', height: '4.5vh' }} onClick={handleSaveOM} disabled={!isSaveEnabledOM}>
                                                Simpan
                                            </button>
                                            <button type="button" className="btn btn-outline-danger mb-4" onClick={onClose} style={{ width: '9vh', height: '4.5vh' }}>
                                                Batal
                                            </button>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
