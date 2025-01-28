import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import swal from 'sweetalert2';

interface EditDataUserProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRow: any;
    fetchData: any;
    idUser: any;
    nama_user: any;
    onRefresh: any;
}

export default function EditDataUserOM({ isOpen, onClose, selectedRow, fetchData, idUser, nama_user, onRefresh }: EditDataUserProps) {
    useEffect(() => {
        if (isOpen) {
            const getIdData = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/erp/list_user_byid?id=${idUser}`);
                    console.log('userData edit modal:', response);
                    const userData = response.data.entitas[0];
                    setSelectedEntitasOM(userData.entitas);
                    setSelectedRoleIdOM(userData.role_id);
                    if (userData.role_id == 3) {
                        setSelectedRoleNamaOM('OM');
                    } else if (userData.role_id == 7) {
                        setSelectedRoleNamaOM('RM');
                    } else if (userData.role_id == 8) {
                        setSelectedRoleNamaOM('Admin / User');
                    } else if (userData.role_id == 4) {
                        setSelectedRoleNamaOM('Manager');
                    }
                    setSelectedNamaOM(userData.name);
                    setNipOM(userData.nip);
                    setNamaOM(userData.name);
                    setGenderOM(userData.gender);
                    setUserIdUsedOM(userData.userid);
                    setSelectedOptionsMenuOM(userData.menu);
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

    //entitas om
    //const [selectedEntitasOM, setSelectedEntitasOM] = useState<string[]>([]);
    const [selectedEntitasOM, setSelectedEntitasOM] = useState<string>('');
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
    //const [selectedOptionsMenuOM, setSelectedOptionsMenuOM] = useState<string[]>([]);
    const [selectedOptionsMenuOM, setSelectedOptionsMenuOM] = useState<string>('');
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

    const [updatedAt, setUpdatedAt] = useState('');

    useEffect(() => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        setUpdatedAt(currentDateTime);
    }, []);

    //handle password
    const [passwordOM, setPasswordOM] = useState('');
    const [retypePasswordOM, setRetypePasswordOM] = useState('');
    const [isSaveEnabledOM, setIsSaveEnabledOM] = useState(false);
    const [isPasswordVisibleOM, setIsPasswordVisibleOM] = useState(false);
    const [isRetypePasswordVisibleOM, setIsRetypePasswordVisibleOM] = useState(false);
    const [passwordfromdb, setPasswordfromdb] = useState('');

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

    const selectedEntitasOMAngka = selectedEntitasOM.split(',').map((entitas) => {
        const parts = entitas.split(' - ');
        const angka = parts[0];
        return angka;
    });

    // const handleEditOM = () => {
    //     console.log('nip : ', nipOM);
    //     console.log('kode_sales: ', nipOM);
    //     console.log('no_sales: ', selectedRoleNamaOM);
    //     console.log('userid : ', userIdUsedOM);
    //     console.log('nama : ', namaOM);
    //     console.log('pass: ', passwordOM !== null ? passwordOM : passwordfromdb);
    //     console.log('role id : ', selectedRoleIdOM);
    //     console.log('kode_sales_spv: ', selectedRoleIdOM);
    //     console.log('updated_at :', updatedAt);
    //     console.log('updated_by :', 1);
    //     console.log('entitas:', selectedEntitasOMAngka);
    //     console.log('menu: ', selectedOptionsMenuOM);
    //     console.log('gender: ', genderOM);
    // };

    const handleEditOM = async () => {
        try {
            const userDataToUpdate = {
                id: idUser,
                nip: nipOM,
                kode_sales: nipOM,
                no_sales: selectedRoleNamaOM,
                userid: userIdUsedOM ? userIdUsedOM : '',
                name: namaOM,
                // Password yang akan dikirimkan sesuai dengan kondisi
                // Jika password tidak berubah, mengirimkan `passwordfromdb` //dari be pass tidak di hash
                // Jika password berubah, mengirimkan `password` //dari be pass di hash
                password: passwordOM !== null ? passwordOM : passwordfromdb,
                role_id: selectedRoleIdOM,
                kode_sales_spv: selectedRoleIdOM ? selectedRoleIdOM : '',
                updated_at: updatedAt,
                updated_by: nama_user,
                entitas: selectedEntitasOMAngka,
                menu: selectedOptionsMenuOM,
                gender: genderOM,
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
                                    <div className="col-span-2">
                                        <div>
                                            <label className="block font-semibold">Pilih Entitas</label>
                                            <Select
                                                isSearchable={true}
                                                isMulti={true}
                                                //value={selectedEntitasOM.map((option) => ({ value: option, label: option }))}
                                                value={selectedEntitasOM.split(',').map((option) => ({
                                                    value: option,
                                                    label: option,
                                                }))}
                                                options={entitasOptionsOM.map((entitas: any) => ({
                                                    value: `${entitas.kodecabang} - ${entitas.cabang}`,
                                                    label: `${entitas.kodecabang} - ${entitas.cabang}`,
                                                }))}
                                                onChange={(selectedOptions) => {
                                                    if (selectedOptions) {
                                                        //setSelectedEntitasOM(selectedOptions.map((option) => option.value));
                                                        setSelectedEntitasOM(selectedOptions.map((option) => option.value).join(','));
                                                        // setSelectedRoleIdOM('');
                                                        // setSelectedRoleNamaOM('');
                                                        // setNipOM('');
                                                        // setNamaOM('');
                                                        // setSelectedOptionsMenuOM('');
                                                        // setGenderOM('');
                                                        // setSelectedNamaOM('');
                                                        // setPasswordOM('');
                                                        // setRetypePasswordOM('');
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label className="block font-semibold">Pilih Menu</label>
                                            <Select
                                                isMulti={true}
                                                isDisabled={!selectedEntitasOM || (Array.isArray(selectedEntitasOM) && selectedEntitasOM.length === 0)}
                                                //value={selectedOptionsMenuOM.map((option) => ({ value: option, label: menuOptionsOM[option] }))}
                                                value={selectedOptionsMenuOM.split(',').map((option) => ({
                                                    value: option,
                                                    label: menuOptionsOM[option],
                                                }))}
                                                options={Object.keys(menuOptionsOM).map((key) => ({
                                                    value: key,
                                                    label: `${key}. ${menuOptionsOM[key]}`,
                                                }))}
                                                onChange={(selectedOptionsMenuOM) => {
                                                    if (selectedOptionsMenuOM) {
                                                        //setSelectedOptionsMenuOM(selectedOptionsMenuOM.map((option) => option.value));
                                                        setSelectedOptionsMenuOM(selectedOptionsMenuOM.map((option) => option.value).join(','));
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
                                <div className="flex justify-end space-x-4 px-5">
                                    <button type="button" className="btn btn-primary mb-4" style={{ width: '9vh', height: '4.5vh' }} onClick={handleEditOM} disabled={!isSaveEnabledOM}>
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
