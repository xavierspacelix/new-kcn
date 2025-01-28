import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IRootState } from '../../store';
import { toggleLocale, toggleTheme, toggleSidebar, toggleRTL, setPageTitle } from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
    faUserLock,
    faKey,
    faBuilding,
    faCog,
    faUserCog,
    faInbox,
    faUser,
    faDiagramProject,
    faTableList,
    faUserTie,
    faCircleCheck,
    faClipboardCheck,
    faCommentSms,
    faRepeat,
    faArrowRightFromBracket,
    faFileLines,
    faCartShopping,
    faWarehouse,
    faScaleBalanced,
    faDiceD6,
    faTableCellsLarge,
    faHome,
} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
// import PilihPraModal from '../../pages/kcn/ERP/inventory/pb/modal/pilihprapb';
import { useSession } from '@/pages/api/sessionContext';

const Header: any = () => {
    const router = useRouter();
    const { sessionData, isLoading, logout } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const nama_user = sessionData?.nama_user ?? '';
    const tipe = sessionData?.tipe ?? '';
    const nip = sessionData?.nip ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const userid = sessionData?.userid ?? '';

    const tabId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('tabId') || '' : '';

    if (isLoading) {
        return;
    }

    useEffect(() => {
        dispatch(setPageTitle(kode_entitas));
    });

    type Permission = {
        kode_menu: any;
        create: boolean;
        edit: boolean;
        delete: boolean;
        cetak: boolean;
    };

    type UserAccess = {
        user: any;
        permissions: Permission[];
    }[];

    const [userAccess, setUserAccess] = useState<UserAccess>([]);

    //console.log(userAccess, 'userAccess');
    //console.log(kode_user, 'kode_user');

    // //Pakai API Local
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:4001/ERP/menu_user?entitas=999');
    //             const processedData = response.data.data.reduce((acc: any, item: any) => {
    //                 const existingUser = acc.find((data: any) => data.user === item.kode_user);
    //                 const permission = {
    //                     kode_menu: item.kode_menu,
    //                     create: item.baru === 'Y',
    //                     edit: item.edit === 'Y',
    //                     delete: item.hapus === 'Y',
    //                     cetak: item.cetak === 'Y',
    //                 };
    //                 if (existingUser) {
    //                     existingUser.permissions.push(permission);
    //                 } else {
    //                     acc.push({
    //                         user: item.kode_user,
    //                         permissions: [permission],
    //                     });
    //                 }
    //                 return acc;
    //             }, []);
    //             setUserAccess(processedData);
    //         } catch (error) {
    //             console.error('Error fetching data', error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    //Pakai API Server
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';
    useEffect(() => {
        const fetchData = async () => {
            if (kode_entitas) {
                try {
                    const response = await axios.get(`${apiUrl}/ERP/user_menu?entitas=${kode_entitas}&kode=${kode_user}`);
                    const processedData = response.data.data.reduce((acc: any, item: any) => {
                        const existingUser = acc.find((data: any) => data.user === item.kode_user);
                        const permission = {
                            kode_menu: item.kode_menu,
                            create: item.baru === 'Y',
                            edit: item.edit === 'Y',
                            delete: item.hapus === 'Y',
                            cetak: item.cetak === 'Y',
                        };
                        if (existingUser) {
                            existingUser.permissions.push(permission);
                        } else {
                            acc.push({
                                user: item.kode_user,
                                permissions: [permission],
                            });
                        }
                        return acc;
                    }, []);
                    setUserAccess(processedData);
                } catch (error) {
                    console.error('Error fetching data', error);
                }
            }
        };
        fetchData();
    }, [kode_user, kode_entitas, kode_entitas]);

    const navigateToLink = (kode_menu: string, kode_user: string) => {
        const user = userAccess.find((user) => user.user === kode_user);
        if (user) {
            const userPermissions = user.permissions.find((permission: Permission) => permission.kode_menu === kode_menu);
            if (userPermissions && userPermissions.kode_menu === '21401') {
                router.push({
                    pathname: '/kcn/ERP/master/gudang/listGudang',
                    query: { userPermissions: JSON.stringify(userPermissions) },
                });
            }
        }
    };

    // const [data, setData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:4001/ERP/menu_user?entitas=999');
    //             setData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching data', error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    // console.log(data, 'data');

    //Pakai Data Dummy
    // const userAccess: UserAccess = [
    //     {
    //         user: 'ADMIN',
    //         permissions: [
    //             { kode_menu: '21401', create: false, edit: false, delete: true, cetak: true },
    //             { kode_menu: '21402', create: false, edit: false, delete: true, cetak: true },
    //         ],
    //     },
    // ];

    // const navigateToLink = (kode_menu: any, kode_user: any) => {
    //     const user = userAccess.find((user) => user.user === kode_user);
    //     if (user) {
    //         const userPermissions = user.permissions.find((permission: Permission) => permission.kode_menu === kode_menu);
    //         if (userPermissions && userPermissions.kode_menu === '21401') {
    //             router.push({
    //                 pathname: '/ERP/gudang/listGudang',
    //                 query: { userPermissions: JSON.stringify(userPermissions) },
    //             });
    //         } else if (userPermissions && userPermissions.kode_menu === '21402') {
    //             router.push({
    //                 pathname: '/ERP/sales/kelolaUserMobile',
    //                 query: { userPermissions: JSON.stringify(userPermissions) },
    //             });
    //         }
    //     }
    // };

    const [baru, setBaru] = useState(false);
    const [baruSelected, setbaruSelected] = useState();

    const handleSelectedData = (selectedData: any) => {
        setbaruSelected(selectedData);
    };

    useEffect(() => {
        const selector = document.querySelector('ul.horizontal-menu a[href="' + window.location.pathname + '"]');
        if (selector) {
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }

            let allLinks = document.querySelectorAll('ul.horizontal-menu a.active');
            for (let i = 0; i < allLinks.length; i++) {
                const element = allLinks[i];
                element?.classList.remove('active');
            }
            selector?.classList.add('active');

            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [router.pathname]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState('');
    useEffect(() => {
        setLocale(localStorage.getItem('i18nextLng') || themeConfig.locale);
    }, []);
    const dispatch = useDispatch();

    function createMarkup(messages: any) {
        return { __html: messages };
    }
    const [messages, setMessages] = useState([
        {
            id: 1,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>',
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>',
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>',
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: '<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>',
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ]);

    const removeMessage = (value: number) => {
        setMessages(messages.filter((user) => user.id !== value));
    };

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value: number) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const [search, setSearch] = useState(false);

    const { t, i18n } = useTranslation();

    return (
        <header className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}>
            <div className="shadow-sm">
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between lg:hidden ltr:mr-2 rtl:ml-2">
                        <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/logo.png" alt="logo" />
                        <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 dark:text-white-light md:inline ltr:ml-1.5 rtl:mr-1.5">NEXT</span>
                        {/* <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="inline w-8 ltr:-ml-1 rtl:-mr-1" src="/assets/images/logo.png" alt="logo" />
                            <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">NEXT</span>
                        </Link> */}
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden ltr:ml-2 rtl:mr-2"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="hidden sm:block ltr:mr-2 rtl:ml-2">
                        <ul className="flex items-center space-x-2 dark:text-[#d0d2d6] rtl:space-x-reverse">
                            {/* <li>
                                <Link href="/apps/calendar" className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link href="/apps/todolist" className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            opacity="0.5"
                                            d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path
                                            opacity="0.5"
                                            d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                </Link>
                            </li> */}
                            {/* <li>
                                <Link href="/apps/chat" className="block rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle r="3" transform="matrix(-1 0 0 1 19 5)" stroke="currentColor" strokeWidth="1.5" />
                                        <path
                                            opacity="0.5"
                                            d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                    <div className="flex items-center space-x-1.5 dark:text-[#d0d2d6] sm:flex-1 lg:space-x-2 ltr:ml-auto ltr:sm:ml-0 rtl:mr-auto rtl:space-x-reverse sm:rtl:mr-0">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">
                            <form
                                className={`${search && '!block'} absolute inset-x-0 top-1/2 z-10 mx-4 hidden -translate-y-1/2 sm:relative sm:top-0 sm:mx-0 sm:block sm:translate-y-0`}
                                onSubmit={() => setSearch(false)}
                            >
                                {/* <div className="relative">
                                    <input
                                        type="text"
                                        className="peer form-input bg-gray-100 placeholder:tracking-widest ltr:pl-9 ltr:pr-9 rtl:pl-9 rtl:pr-9 sm:bg-transparent ltr:sm:pr-4 rtl:sm:pl-4"
                                        placeholder="Search..."
                                    />
                                    <button type="button" className="absolute inset-0 h-9 w-9 appearance-none peer-focus:text-primary ltr:right-auto rtl:left-auto">
                                        <svg className="mx-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                            <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <button type="button" className="absolute top-1/2 block -translate-y-1/2 hover:opacity-80 ltr:right-2 rtl:left-2 sm:hidden" onClick={() => setSearch(false)}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div> */}
                            </form>
                            <button
                                type="button"
                                onClick={() => setSearch(!search)}
                                className="search_btn rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60 sm:hidden"
                            >
                                <svg className="mx-auto h-4.5 w-4.5 dark:text-[#d0d2d6]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.5" cy="11.5" r="9.5" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                                    <path d="M18.5 18.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        {/* <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('dark'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('system'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => dispatch(toggleTheme('light'))}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15C17.8284 3 19.2426 3 20.1213 3.87868C21 4.75736 21 6.17157 21 9V14C21 15.8856 21 16.8284 20.4142 17.4142C19.8284 18 18.8856 18 17 18H7C5.11438 18 4.17157 18 3.58579 17.4142C3 16.8284 3 15.8856 3 14V9Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        />
                                        <path opacity="0.5" d="M22 21H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M15 15H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div> */}
                        {/* <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={flag && <img className="h-5 w-5 rounded-full object-cover" src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="flag" />}
                            >
                                <ul className="grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    {themeConfig.languageList.map((item: any) => {
                                        return (
                                            <li key={item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-primary ${i18n.language === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                    onClick={() => {
                                                        dispatch(toggleLocale(item.code));
                                                        i18n.changeLanguage(item.code);
                                                        setLocale(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div> */}
                        {/* <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22 10C22.0185 10.7271 22 11.0542 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H13"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M6 8L8.1589 9.79908C9.99553 11.3296 10.9139 12.0949 12 12.0949C13.0861 12.0949 14.0045 11.3296 15.8411 9.79908"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                        <circle cx="19" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }
                            >
                                <ul className="w-[300px] !py-0 text-xs text-dark dark:text-white-dark sm:w-[375px]">
                                    <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                                        <div className="relative !h-[68px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
                                            <div className="bg- absolute inset-0 h-full w-full bg-[url(/assets/images/menu-heade.jpg)] bg-cover bg-center bg-no-repeat"></div>
                                            <h4 className="relative z-10 text-lg font-semibold">Messages</h4>
                                        </div>
                                    </li>
                                    {messages.length > 0 ? (
                                        <>
                                            <li onClick={(e) => e.stopPropagation()}>
                                                {messages.map((message) => {
                                                    return (
                                                        <div key={message.id} className="flex items-center px-5 py-3">
                                                            <div dangerouslySetInnerHTML={createMarkup(message.image)}></div>
                                                            <span className="px-3 dark:text-gray-500">
                                                                <div className="text-sm font-semibold dark:text-white-light/90">{message.title}</div>
                                                                <div>{message.message}</div>
                                                            </span>
                                                            <span className="whitespace-pre rounded bg-white-dark/20 px-1 font-semibold text-dark/60 ltr:ml-auto ltr:mr-2 rtl:ml-2 rtl:mr-auto dark:text-white-dark">
                                                                {message.time}
                                                            </span>
                                                            <button type="button" className="text-neutral-300 hover:text-danger" onClick={() => removeMessage(message.id)}>
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                    <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </li>
                                            <li className="mt-5 border-t border-white-light text-center dark:border-white/10">
                                                <button type="button" className="group !h-[48px] justify-center !py-4 font-semibold text-primary dark:text-gray-400">
                                                    <span className="group-hover:underline ltr:mr-1 rtl:ml-1">VIEW ALL ACTIVITIES</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 transition duration-300 group-hover:translate-x-1 ltr:ml-1 rtl:mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                    </svg>
                                                </button>
                                            </li>
                                        </>
                                    ) : (
                                        <li className="mb-5" onClick={(e) => e.stopPropagation()}>
                                            <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full text-white ring-4 ring-primary/30">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 24 24"
                                                        fill="#a9abb6"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-info rounded-full bg-primary"
                                                    >
                                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                    </svg>
                                                </div>
                                                No data available.
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div> */}
                        {/* <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <span>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                            <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                            <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                            <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                        </span>
                                    </span>
                                }
                            >
                                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                                    <li onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold">
                                            <h4 className="text-lg">Notification</h4>
                                            {notifications.length ? <span className="badge bg-primary/80">{notifications.length}New</span> : ''}
                                        </div>
                                    </li>
                                    {notifications.length > 0 ? (
                                        <>
                                            {notifications.map((notification) => {
                                                return (
                                                    <li key={notification.id} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
                                                        <div className="group flex items-center px-4 py-2">
                                                            <div className="grid place-content-center rounded">
                                                                <div className="relative h-12 w-12">
                                                                    <img className="h-12 w-12 rounded-full object-cover" alt="profile" src={`/assets/images/${notification.profile}`} />
                                                                    <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                                                <div className="ltr:pr-3 rtl:pl-3">
                                                                    <h6
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: notification.message,
                                                                        }}
                                                                    ></h6>
                                                                    <span className="block text-xs font-normal dark:text-gray-500">{notification.time}</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                                                                    onClick={() => removeNotification(notification.id)}
                                                                >
                                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                        <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                            <li>
                                                <div className="p-4">
                                                    <button className="btn btn-primary btn-small block w-full">Read All Notifications</button>
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <li onClick={(e) => e.stopPropagation()}>
                                            <button type="button" className="!grid min-h-[200px] place-content-center text-lg hover:!bg-transparent">
                                                <div className="mx-auto mb-4 rounded-full ring-4 ring-primary/30">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="40"
                                                        height="40"
                                                        viewBox="0 0 24 24"
                                                        fill="#a9abb6"
                                                        stroke="#ffffff"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-info rounded-full bg-primary"
                                                    >
                                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                    </svg>
                                                </div>
                                                No data available.
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </Dropdown>
                        </div> */}
                        <div className="flex font-semibold text-dark">
                            {tipe === 'CRM' && (
                                <Link href="/kcn/CRM/chat/notif">
                                    <FontAwesomeIcon icon={faBell} style={{ marginRight: '0.5rem' }} width="18" height="18" />
                                </Link>
                            )}
                            {userid.toLocaleUpperCase()} - {kode_entitas}
                        </div>
                        <div className="dropdownProfil flex shrink-0">
                            <Dropdown
                                offset={[0, 2]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                // button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />}
                                button={<img className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/userImageProfil.png" alt="userProfile" />}
                            >
                                <ul className="w-[220px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            {/* <img className="h-10 w-10 rounded-md object-cover" src="/assets/images/user-profile.jpeg" alt="userProfile" /> */}
                                            <img className="h-10 w-10 rounded-md object-cover" src="/assets/images/userImageProfil.png" alt="logo" />
                                            <div className="truncate ltr:pl-3 rtl:pr-3">
                                                <h4 className="text-base">
                                                    {nama_user}
                                                    {/* <span className="rounded bg-success-light px-1 text-xs text-success ltr:ml-2 rtl:ml-2">Pro</span> */}
                                                </h4>
                                                {/* <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"> */}
                                                <h4 className="text-base">
                                                    {/* User@gmail.com */}
                                                    {nip}
                                                </h4>
                                            </div>
                                        </div>
                                    </li>
                                    {/* <li>
                                        <Link href="/users/profile" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faUser} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Profile
                                        </Link>
                                    </li> */}
                                    {/* <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faInbox} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Inbox
                                        </Link>
                                    </li> */}
                                    {/* <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faUserLock} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Lock Screen
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faKey} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Ganti Password
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faBuilding} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Informasi Perusahaan
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faCog} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Setting Aplikasi
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faUserCog} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Administrasi Pengguna Aplikasi
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faUserTie} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Template User Jabatan
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faCircleCheck} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Online Approval
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faClipboardCheck} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Audit Trial
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faCommentSms} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Log SMS
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faWhatsapp} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            WhatsApp Blast
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faRepeat} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Restart Aplikasi
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link href={`/kcn/ERP/main/main?tabId=${tabId}`} className="dark:hover:text-white">
                                            <FontAwesomeIcon icon={faHome} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Home
                                        </Link>
                                    </li>
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        {/* <Link href="/" className="!py-2 text-danger"> 
                                         <FontAwesomeIcon icon={faArrowRightFromBracket} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                        Sign Out 
                                        </Link> */}

                                        <button className="!py-2 text-danger" type="button" onClick={logout}>
                                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* horizontal menu */}
                {tipe === 'ERP' && (
                    <ul
                        className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-5 py-1.5 font-semibold text-black dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-0.5 xl:space-x-0.5 rtl:space-x-reverse"
                        style={{ background: '#cbcbcb' }}
                    >
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Pemeliharaan')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li>
                                    {/* <Link href="/kcn/ERP/master/administrasiPengguna/administrasiPengguna">{t('Administrasi Pengguna Aplikasi')}</Link> */}
                                    <Link href="/kcn/ERP/master/administrasiPengguna/administrasiPengguna">{t('Administrasi Pengguna Aplikasi')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/master/daftarRelasi/daftarRelasi?tabId=${tabId}`}>{t('Daftar Relasi')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Customer')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/master/daftarCustomer?tabId=${tabId}`}>{t('Daftar Customer')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Histori Peralihan Customer')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Histori Membership Customer')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Pengajuan Aktivasi dan Open Blacklist')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/master/supplier/supplier/?tabId=${tabId}`}>{t('Supplier')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Salesman')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Produk dan Insentif')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Batas Bayar dan Pembelian Produk')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Pendapan Insentif')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Target Distribusi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Target Penagihan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Model Insentif')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Denda dan Potongan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Setting Minimal Target Penjualan')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Akun')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/master/kelolausermobile/kelolaUserMobile">{t('Kelola User Mobile')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/kms/kelolaUserKms">{t('Kelola User KMS')}</Link>
                                </li>
                                {/* {userAccess.find((user) => user.user === kode_user)?.permissions.some((permission) => permission.kode_menu === '21402') && (
                                <button onClick={() => navigateToLink('21402', kode_user)}>{t('Kelola User Mobile')}</button>
                            )} */}
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Anggaran Akun')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Akun Pembantu (Subledger)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Departmen')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Aktiva Tetap (Asset)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/master/daftarPersediaan/daftarPersediaan?tabId=${tabId}`}>{t('Daftar Persediaan')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Daftar Harga')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Harga Pembelian Per Item')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Harga Pembelian Per Supplier')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Harga Penjualan Per Item')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Harga Penjualan Per Customer')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Harga Ekspedisi')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Daftar Lainnya')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul
                                        className="absolute top-[-400px] z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]"
                                        style={{ maxHeight: '80vh', overflow: 'auto' }}
                                    >
                                        <li>
                                            <Link href="/kcn/ERP/master/gudang/listGudang">{t('Gudang')}</Link>
                                        </li>
                                        {/* {userAccess.find((user) => user.user === kode_user)?.permissions.some((permission) => permission.kode_menu === '21401') && (
                                            <button onClick={() => navigateToLink('21401', kode_user)}>{t('List Gudang')}</button>
                                        )} */}
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Kurs Mata Uang')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Pajak')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Termin Pembayaran')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Rayon (Wilayah Penjualan)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/master/kendaraan/KendaraanListMaster?tabId=${tabId}`}>{t('Kendaraan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Pengemudi (Sopir)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Via Pengiriman (Ekspedisi)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Diskon Tonase')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Kategori')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Kelompok Produk')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Merek Produk')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Hari Libur')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Alasan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Propinsi dan Kota')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Kecamatan dan Kelurahan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Data Legalitas Ekspedisi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Klasifikasi Plafond Maksimal')}</Link>
                                        </li>
                                        +
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Karyawan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Divisi Penjualan')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Bank Semua Entitas')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Proses Periodik')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Proses Kalkulasi Biaya Persediaan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Proses Tutup Buku Akhir Periode')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Perubahan Periode Akuntansi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Proses Tutup Tahun')}</Link>
                                        </li>
                                    </ul>
                                </li>

                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Proses Tutup penjualan Tunai (POS)')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faDiceD6} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Pengadaan')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li>
                                    <Link href={`/kcn/ERP/purchase/pp/spplist?tabId=${tabId}`}>{t('Permintaan Pembelian (PP)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/purchase/po/polist?tabId=${tabId}`}>{t('Order Pembelian (PO)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/purchase/fb/fblist?tabId=${tabId}`}>{t('Faktur Pembelian (FB)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/antarCabang/fpb/fpbList?tabId=${tabId}`}>{t('Form Pengadaan Barang (FPB)')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Form Pembelian Antar Cabang (FPAC)')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/antarCabang/fpacKontrak/fpacList?tabId=${tabId}`}>{t('FPAC (Kontrak)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/antarCabang/fpacNonKontrak/fpacList?tabId=${tabId}`}>{t('FPAC (Non Kontrak)')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/inventory/prapp/frmPraPp?tabId=${tabId}`}>{t('Pra Permintaan Pembelian (Pra PP)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/logistik/fdo/fdoList?tabId=${tabId}`}>{t('Form Delivery Order (FDO)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Form Pengajuan Mutasi Barang (FPMB)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/purchase/fbm/fbmlist?tabId=${tabId}`}>{t('Form Barang Masuk (FBM)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Berita Acara (RBA)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/inventory/rpe/rpelist?tabId=${tabId}`}>{t('Realisasi Pembayaran Ekspedisi (RPE)')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Pembelian')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Informasi Detail Supplier')}</Link>
                                </li>
                                {/* <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Surat Pengambilan Barang (SPB)')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Target Pembelian ')}</Link>
                                </li> */}

                                {/* <li className="relative">
                                    <button type="button">
                                        {t('Administrasi Pengadaan Barang')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Barang')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Kantor')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Pabrik')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Memo Permintaan Cabang (MPC)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Order Pembelian Terbuka (POT)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Permintaan Cabang (RPC)')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Laporan Administrasi Pengadaan')}</Link>
                                </li> */}
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faWarehouse} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Persediaan')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                {/* <li>
                                    <Link
                                        href={`/kcn/ERP/inventory/pb/pblist?tabId=${tabId}`}
                                        // onClick={() => setBaru(true)}
                                    >
                                        {t('Penerimaaan Barang (PB)')}
                                    </Link>
                                    <PilihPraModal isOpen={baru} onClose={() => setBaru(false)} onSelectData={(selectedData: any) => handleSelectedData(selectedData)} />
                                </li> */}
                                <li>
                                    <Link href={`/kcn/ERP/inventory/mpb/mpblist?tabId=${tabId}`}>{t('Memo Pengembalian Barang (MPB)')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href={`/kcn/ERP/inventory/mb/mblist?tabId=${tabId}`}>{t('Mutasi Barang (MB)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/inventory/ps/pslist?tabId=${tabId}`}>{t('Penyesuaian dan Rebuild Stok (PS)')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href={`/kcn/ERP/inventory/sj/sjlist?tabId=${tabId}`}>{t('Surat Jalan (SJ)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/inventory/ttb/ttblist?tabId=${tabId}`}>{t('Tanda Terima Barang (TTB)')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Informasi stok aktual')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Mutasi persediaan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Aktifitas Pengiriman')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Stok Opname')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Dasboard Stok Opname')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Jadwal dan Hasil Stok Opname')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Kartu Stok Gudang')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Lokasi Barang')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Mutasi Barang')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Mutasi Barang')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Stok dan Harga Jual Aktual')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Data Besi Kompetitor')}</Link>
                                </li>

                                {/* <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Kerusakan Barang (KB)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Perubahan Status Barang (PSB)')}</Link>
                                </li>
                              */}
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCartShopping} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Penjualan')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li>
                                    <Link href={`/kcn/ERP/sales/so/solist?tabId=${tabId}`}>{t('Order Penjualan (SO)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/sales/spm/spmlist?tabId=${tabId}`}>{t('Surat Perintah Muat (SPM) - (DO)')}</Link>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href={`/kcn/ERP/sales/fj/fjlist?tabId=${tabId}`}>{t('Faktur Penjualan Kredit (FPK)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Faktur Penjualan Tunai (FPT) -(POS)')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/sales/mk/mkList?tabId=${tabId}`}>{t('Memo Kredit (MK) - (Retur Penjualan Tunai)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Memo Potongan Penjualan (MPP)')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Target Penjualan')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Target Global Penjual')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Target Detail Penjualan')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Target Penjualan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Target VS Realisasi (Per Bulan)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Target VS Realisasi (Per Kuartal)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Target Data View')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Performa Salesman')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Rencana Kunjungan Salesman (RKS)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Hasil Kunjungan Salesman (HKS)')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Informasi Detail Salesman')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Monitoring RKS dan HKS')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Tanda Terima dan Opname Faktur')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Approval Insentif Bonus Salesman')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Approval Insentif Bonus Salesman (Konsolidasi)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Approval Uang Saku')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Monitoring Uang Saku')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="border-t border-white-light dark:border-white-light/10">
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Informasi Detail Customer')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Penjualan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Channel Healthiness')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Aktifitas Transaksi Penjualan')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faScaleBalanced} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Finance Accounting')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li className="relative">
                                    <button type="button">
                                        {t('Penjurnalan')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/fa/ju/julist?tabId=${tabId}`}>{t('Jurnal Umum (JU)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/bkk/frmPraBkkList?tabId=${tabId}}`}>{t('Pengeluaran Lain (BK)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/bm/bmlist?tabId=${tabId}`}>{t('Pemasukan Lain (BM)')}</Link>
                                        </li>
                                        {/* <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Jurnal HRIS Via API')}</Link>
                                        </li> */}
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Pembayaran dan Penerimaan')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/fa/phu/phulist?tabId=${tabId}`}>{t('Pembayaran Hutang (PHU)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/ppi/ppilist?tabId=${tabId}`}>{t('Penerimaan Piutang (PPI)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/phe/pheList?tabId=${tabId}`}>{t('Pembayaran Hutang Ekspedisi (PHE)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/reimburse/reimburselist?tabId=${tabId}`}>{t('Reimbursement HRIS')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Form Pengajuan Pembayaran (FPP)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar Bukti Tanda Terima Pembayaran (TTP)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/posting-ttp?tabId=${tabId}`}>{t('Proses Posting TTP')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href={`/kcn/ERP/fa/pembayaran-uang-muka?tabId=${tabId}`}>{t('Pembayaran Uang Muka')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Konsolidasi PHE')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Pembukuan')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/fa/buku-besar?tabId=${tabId}`}>{t('Buku Besar')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/buku-subledger?tabId=${tabId}`}>{t('Buku Subledger')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/rekap-dan-detail-mutasi-subledger?tabId=${tabId}`}>{t('Rekap dan Detail Mutasi Subledger')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Buku Mutasi Kas dan Bank')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Buku Mutasi Hutang (AP)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Buku Mutasi Piutang (AR)')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Analisa')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Hutang (AP)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Pembayaran Hutang')}</Link>
                                        </li>
                                        <li>
                                        <Link href={`/kcn/ERP/fa/analisa-piutang?tabId=${tabId}`}>{t('Analisa Piutang (AR)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Piutang Overdue')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Penerimaan Piutang (Hasil Penagihan)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Beban Perusahaan')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Bank')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/fa/mutasi-bank?tabId=${tabId}`}>{t('Mutasi Bank Via API')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Komparasi Saldi Akhir Sistem dan API Bank')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Rekonsiliasi Bank')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Buku Bank')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Transaksi Bank')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Lainnya')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:left-[95%] rtl:right-[95%]">
                                        <li>
                                            <Link href={`/kcn/ERP/fa/cash-count/CashCountList?tabId=${tabId}`}>{t('Kas Opname (Cash Count)')}</Link>
                                        </li>
                                        <li>
                                            <Link href={`/kcn/ERP/fa/history-jurnal-transaksi?tabId=${tabId}`}>{t('Histori Jurnal Transaksi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Informasi Keuangan')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Pembebanan Selisih Barang')}</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faFileLines} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Laporan')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Pembelian')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Hutang Usaha dan Supplier')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Penjualan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Piutang Usaha dan Customer')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/report?tipe=70500&tabId=${tabId}`}>{t('Buku Besar')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Laporan Keuangan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Persediaan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Performa Salesman')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Laporan Lainnya')}</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTableList} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Dashboard')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Pengadaan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Penjualan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Logistik')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Stok')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Hutang Dagang (AP)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Piutang Dagang (AR)')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Reporting')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Followup Penanganan Piutang (AR)')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Check Data Penerimaan Piutang')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Check Data Faktur Lunas')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Buku Lunas')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/dashboard/biaya-operasional-kendaraan/BokList?tipe=70500&tabId=${tabId}`}>{t('Biaya Operasional Kendaraan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Aktifitas Operasional kendaraan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Surat Izin Jalan (Karyawan dan Kendaraan)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Monitor PB dan Dokumen Asli)')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('KPI Operasional Manager')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Dashboard KPI OM')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Penjualan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Stok Overdue')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('AR Overdue')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Penggunaan Kendaraan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Team Bawahan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Laba Rugi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Beban Operasional')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('KPI Supervisor')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('KPI Salesman')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/kpi/sales/kpiDashSupervisor">{t('Dashboard KPI Supervisor')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/kpi/sales/kpiDashSalesman">{t('Dashboard KPI Salesman')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/kpi/sales/kpiJual">{t('Realisasi Penjualan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/kpi/sales/kpiKunjung">{t('Realisasi Kunjungan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/kpi/sales/kpiCall">{t('Realisasi Effektif Call')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/kpi/sales/kpiPiutangOD">{t('AR Overdue')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('KPI Gudang')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Dashboard KPI Gudang')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Hitung dan Rencek')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Gudang Transit')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Ketepatan Kirim Laporan Opname')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Kesesuaian Stok Opname')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Penggunaan Kendaraan')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Klaim Barang Kurang (DPP) - BA)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Komparasi Budget Tahunan')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Stok Overdue')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Dashboard Stok Overdue')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Rekapitulasi Stok Overdue')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Pre Order Cabang')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Standar Harga Jual')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul
                                        className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]"
                                        style={{ maxHeight: '12vh', overflow: 'auto' }}
                                    >
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Perhitungan Dasar Harga Jual Minimal')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Simulator HArga Minimal Standar')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Price List Item')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('List Sket dan Berat Item')}</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faDiagramProject} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Konsolidasi')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <ul className="sub-menu">
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Keuangan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Pembelian')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Logistik')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Info Gudang Konsolidasi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Pengiriman Barang Pabrik dan Tonase')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Konsolidasi Hitung dan Rencek')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('PO Outstanding')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Daftar PO Outstanding')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Breakdown PO Outstanding')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Target dan Realisasi Penjualan')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Per Bulan')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Per Kuartal')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Stok')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Stok Konsolidasi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Analisa Stok Konsolidasi')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Rekapitulasi Harian Mutasi Barang')}</Link>
                                        </li>
                                        <li className="border-t border-white-light dark:border-white-light/10">
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('Jadwal dan Hasil Stok Opname')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Re-Order Point')}</Link>
                                </li>
                                <li className="relative">
                                    <button type="button">
                                        {t('Rangking KPI')}
                                        <div className="ltr:ml-auto rtl:mr-auto rtl:rotate-180">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>
                                    <ul className="absolute top-0 z-[10] hidden min-w-[320px] rounded bg-white p-0 py-2 text-dark shadow dark:bg-[#1b2e4b] dark:text-white-dark ltr:right-[100%] rtl:left-[95%]">
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('KPI Operasional Manager')}</Link>
                                        </li>
                                        <li>
                                            <Link href="/kcn/ERP/blankPage/blankPage">{t('KPI Salesman')}</Link>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Klaim Barang Kurang (DPP) - BA')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Laporan Keuangan')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Pembayaran Ekspedisi (RPE)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Realisasi Berita Acara (RBA)')}</Link>
                                </li>
                                <li>
                                    <Link href="/kcn/ERP/blankPage/blankPage">{t('Data Besi Kompetitor')}</Link>
                                </li>
                                <li>
                                    <Link href={`/kcn/ERP/konsolidasi/informasi-daftar-customer?tabId=${tabId}`}>{t('Informasi Daftar Customer')}</Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                )}
                {tipe === 'CRM' && (
                    <ul
                        className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-5 py-1.5 font-semibold text-black dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-0.5 xl:space-x-0.5 rtl:space-x-reverse"
                        style={{ background: '#cbcbcb' }}
                    >
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faDiceD6} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Dashboard')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    {/* <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" /> */}
                                    <FontAwesomeIcon icon={faDiceD6} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Sales')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    {/* <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" /> */}
                                    <FontAwesomeIcon icon={faFileLines} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Report')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    {/* <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" /> */}
                                    <FontAwesomeIcon icon={faTableList} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Master')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>

                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faEnvelope} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    {/* <span className="px-1">{t('Message')}</span> */}
                                    <li>
                                        <Link href="/kcn/CRM/messages">{t('Message')}</Link>
                                    </li>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>

                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    {/* <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" /> */}
                                    <FontAwesomeIcon icon={faDiagramProject} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Help')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                    </ul>
                )}

                {tipe === 'HRD' && (
                    <ul
                        className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-5 py-1.5 font-semibold text-black dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-0.5 xl:space-x-0.5 rtl:space-x-reverse"
                        style={{ background: '#cbcbcb' }}
                    >
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Dashboard')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Master')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    {/* <span className="px-1">{t('Message')}</span> */}
                                    <li>
                                        <Link href="/kcn/CRM/chat">{t('Message')}</Link>
                                    </li>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                        <li className="menu nav-item relative">
                            <button type="button" className="nav-link">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTableCellsLarge} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                    <span className="px-1">{t('Help')}</span>
                                </div>
                                <div className="right_arrow">
                                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    );
};

export default Header;
