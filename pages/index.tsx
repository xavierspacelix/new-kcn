import Image from 'next/image';
import Link from 'next/link';
import { Fragment, ReactElement, useState } from 'react';
import { useSession } from './api/sessionContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import BlankLayout from '@/components/Layouts/BlankLayout';

const Index = () => {
    const router = useRouter();
    const [tipe, setTipe] = useState('ERP');
    const [entitas, setEntitas] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [modalTipeSystem, setModalTipeSystem] = useState(false);
    const [modalFailed, setModalFailed] = useState(false);
    const { saveSessionData } = useSession();

    const generateTabId = () => {
        return 'tab_' + Math.random().toString(36).substr(2, 9);
    };

    const handleLogin = async () => {
        console.log(password);

        try {
            if (entitas === 'Wa') {
                const apiUrlCs = process.env.NEXT_PUBLIC_LOGIN_API_108 || '';
                const response = await axios.get(apiUrlCs + '/kms/login_crm_hrd', {
                    params: {
                        entitas,
                        user,
                        pwd: password,
                    },
                });

                const userData = response.data.data[0];


                const sessionData = {
                    nama_user: userData.nama_user,
                    userid: user,
                    nip: '00000000',
                    kode_entitas: '000',
                    kode_user: userData.kode_user,
                    kode_kry: userData.kode_kry,
                    kode_jabatan: userData.kode_jabatan,
                    nama_jabatan: userData.nama_jabatan,
                    tipe,
                    token: userData.token,
                    entitas: userData.kode_entitas,
                };

                const tabId = sessionStorage.getItem('tabId') || generateTabId();
                sessionStorage.setItem('tabId', tabId);
                await saveSessionData(tabId, sessionData);

                if (tipe === 'CRM') {
                    if (response.status === 200) {
                        setModalSuccess(true);
                        setTimeout(() => {
                            router.push('/kcn/CRM/main');
                        }, 1000);
                    } else {
                        setModalFailed(true);
                        throw new Error("Can't login");
                    }
                }
            } else {
                const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
                const response = await axios.get(apiUrl + '/erp/login', {
                    params: {
                        entitas,
                        user,
                        pwd: password,
                    },
                });

                if (response.data.data.length > 0) {
                    const userData = response.data.data[0];
                    const sessionData = {
                        nama_user: userData.nama_user,
                        userid: user,
                        nip: userData.nip,
                        kode_entitas: entitas,
                        kode_user: userData.kode_user,
                        kode_kry: userData.kode_kry,
                        kode_jabatan: userData.kode_jabatan,
                        nama_jabatan: userData.nama_jabatan,
                        tipe,
                        token: userData.token,
                        entitas: userData.kode_entitas,
                    };

                    const tabId = sessionStorage.getItem('tabId') || generateTabId();
                    sessionStorage.setItem('tabId', tabId);
                    await saveSessionData(tabId, sessionData);

                    if (tipe === 'ERP') {
                        if (response.data.data.length === 1) {
                            setModalSuccess(true);
                            setTimeout(() => {
                                router.push('/kcn/ERP/main');
                            }, 1000);
                        } else if (response.data.data.length === 0) {
                            console.log('user tidak ditemukan');
                            setModalFailed(true);
                            throw new Error("Can't login");
                        } 
                    }
                } else {
                    setModalFailed(true);
                    throw new Error("Can't login");
                }
            }
        } catch (err) {
            console.error(err);
            setModalFailed(true);
        }
    };

    const handleCloseModals = () => {
        setModalTipeSystem(false);
        setModalFailed(false);
    };
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[458px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent xl:w-16 ltr:-right-10 ltr:bg-gradient-to-r ltr:xl:-right-20 rtl:-left-10 rtl:bg-gradient-to-l rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link href="/" className="ms-10 mt-10  block w-48 lg:w-72">
                                <Image src="/assets/images/auth/logo-white.png" alt="image" width={400} height={300} />
                            </Link>
                            <div className="mt-10 hidden w-full max-w-[430px] lg:block">
                                <Image src="/assets/images/auth/login.png" alt="Cover Image" width={400} height={300} />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-20 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link href="/" className="block w-8 lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                        </div>
                        <div className="w-full max-w-[380px]">
                            <div className="mb-5">
                                <h1 className="md:text-1xl text-3xl font-extrabold uppercase !leading-snug text-primary">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Masukan user and password untuk login aplikasi</p>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleLogin();
                                }}
                            >
                                <div>
                                    <label htmlFor="Tipe">Tipe</label>
                                    <div className="relative text-white-dark">
                                        <select
                                            style={{ height: '4.2vh', fontSize: '1.8vh', paddingTop: '0.6vh' }}
                                            className="form-select text-white-dark"
                                            value={tipe}
                                            onChange={(e) => setTipe(e.target.value)}
                                        >
                                            <option value="ERP">ERP System</option>
                                            <option value="CRM">CRM System</option>
                                            <option value="HRD">HRD System</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Entitas">Entitas</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            style={{ height: '4.2vh' }}
                                            type="text"
                                            placeholder="Masukan Entitas"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={entitas}
                                            onChange={(e) => setEntitas(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path
                                                    opacity="0.5"
                                                    d="M10.65 2.25H7.35C4.23873 2.25 2.6831 2.25 1.71655 3.23851C0.75 4.22703 0.75 5.81802 0.75 9C0.75 12.182 0.75 13.773 1.71655 14.7615C2.6831 15.75 4.23873 15.75 7.35 15.75H10.65C13.7613 15.75 15.3169 15.75 16.2835 14.7615C17.25 13.773 17.25 12.182 17.25 9C17.25 5.81802 17.25 4.22703 16.2835 3.23851C15.3169 2.25 13.7613 2.25 10.65 2.25Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M14.3465 6.02574C14.609 5.80698 14.6445 5.41681 14.4257 5.15429C14.207 4.89177 13.8168 4.8563 13.5543 5.07507L11.7732 6.55931C11.0035 7.20072 10.4691 7.6446 10.018 7.93476C9.58125 8.21564 9.28509 8.30993 9.00041 8.30993C8.71572 8.30993 8.41956 8.21564 7.98284 7.93476C7.53168 7.6446 6.9973 7.20072 6.22761 6.55931L4.44652 5.07507C4.184 4.8563 3.79384 4.89177 3.57507 5.15429C3.3563 5.41681 3.39177 5.80698 3.65429 6.02574L5.4664 7.53583C6.19764 8.14522 6.79033 8.63914 7.31343 8.97558C7.85834 9.32604 8.38902 9.54743 9.00041 9.54743C9.6118 9.54743 10.1425 9.32604 10.6874 8.97558C11.2105 8.63914 11.8032 8.14522 12.5344 7.53582L14.3465 6.02574Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="User">User</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            style={{ height: '4.2vh' }}
                                            type="text"
                                            placeholder="Masukan User"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={user}
                                            onChange={(e) => setUser(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <circle cx="9" cy="4.5" r="3" fill="#888EA8" />
                                                <path
                                                    opacity="0.5"
                                                    d="M15 13.125C15 14.989 15 16.5 9 16.5C3 16.5 3 14.989 3 13.125C3 11.261 5.68629 9.75 9 9.75C12.3137 9.75 15 11.261 15 13.125Z"
                                                    fill="#888EA8"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            style={{ height: '4.2vh' }}
                                            type="password"
                                            placeholder="Masukan Password"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path
                                                    opacity="0.5"
                                                    d="M1.5 12C1.5 9.87868 1.5 8.81802 2.15901 8.15901C2.81802 7.5 3.87868 7.5 6 7.5H12C14.1213 7.5 15.182 7.5 15.841 8.15901C16.5 8.81802 16.5 9.87868 16.5 12C16.5 14.1213 16.5 15.182 15.841 15.841C15.182 16.5 14.1213 16.5 12 16.5H6C3.87868 16.5 2.81802 16.5 2.15901 15.841C1.5 15.182 1.5 14.1213 1.5 12Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M6 12.75C6.41421 12.75 6.75 12.4142 6.75 12C6.75 11.5858 6.41421 11.25 6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 12.75Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M9 12.75C9.41421 12.75 9.75 12.4142 9.75 12C9.75 11.5858 9.41421 11.25 9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M12.75 12C12.75 12.4142 12.4142 12.75 12 12.75C11.5858 12.75 11.25 12.4142 11.25 12C11.25 11.5858 11.5858 11.25 12 11.25C12.4142 11.25 12.75 11.5858 12.75 12Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M5.0625 6C5.0625 3.82538 6.82538 2.0625 9 2.0625C11.1746 2.0625 12.9375 3.82538 12.9375 6V7.50268C13.363 7.50665 13.7351 7.51651 14.0625 7.54096V6C14.0625 3.20406 11.7959 0.9375 9 0.9375C6.20406 0.9375 3.9375 3.20406 3.9375 6V7.54096C4.26488 7.51651 4.63698 7.50665 5.0625 7.50268V6Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Log in
                                </button>
                                {/* <Transition appear show={modalSuccess || modalFailed || modalTipeSystem} as={Fragment}> */}
                                <Dialog as="div" open={modalSuccess || modalFailed || modalTipeSystem} onClose={handleCloseModals}>
                                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                                        <div className="flex min-h-screen items-center justify-center px-4">
                                            <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                                <div className="mt-7 flex flex-col items-center justify-center">
                                                    <div className="text-lg font-bold">
                                                        {modalSuccess
                                                            ? 'Login Telah Berhasil, Silahkan Tunggu...'
                                                            : modalFailed
                                                              ? 'Login Gagal! Data User Tidak Ditemukan!'
                                                              : modalTipeSystem
                                                                ? 'Login Gagal! Tipe System Belum Tersedia!'
                                                                : ''}
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <div className="mt-1 flex items-center justify-end">
                                                        {modalTipeSystem || modalFailed ? (
                                                            <button type="button" className="btn btn-outline-danger" onClick={handleCloseModals}>
                                                                Close
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </Dialog.Panel>
                                        </div>
                                    </div>
                                </Dialog>
                                {/* </Transition> */}
                            </form>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">
                            KCN Next - All Rights Reserved.
                            <br />
                            IT-Departement © {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

Index.getLayout = (page: ReactElement) => <BlankLayout>{page}</BlankLayout>;
export default Index;
