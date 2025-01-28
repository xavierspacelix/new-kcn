// sessionContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { deleteSession, getSession, saveSession, SessionData } from '@/lib/indexedDB';

interface SessionContextProps {
    sessionData: SessionData | null;
    isLoading: boolean;
    saveSessionData: (sessionId: string, data: SessionData) => Promise<void>;
    deleteSessionData: (sessionId: string) => Promise<void>;
    logout: () => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const swalDialog = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-primary btn-sm',
            cancelButton: 'btn btn-dark btn-sm ltr:mr-3 rtl:ml-3',
            popup: 'sweet-alerts',
        },
        buttonsStyling: false,
        showClass: {
            popup: `
              animate__animated
              animate__zoomIn
              animate__faster
            `,
        },
        hideClass: {
            popup: `
              animate__animated
              animate__zoomOut
              animate__faster
            `,
        },
    });
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const saveSessionData = async (sessionId: string, data: SessionData) => {
        await saveSession(sessionId, data);
        setSessionData(data);
    };

    const deleteSessionData = async (sessionId: string) => {
        await deleteSession(sessionId);
        setSessionData(null);
    };

    const logout = async () => {
        const tabId = sessionStorage.getItem('tabId');
        if (tabId) {
            router.push('/');
            await deleteSession(tabId);
            sessionStorage.removeItem('tabId');
            setSessionData(null);
        }
    };
    const verifyToken = async (token: any) => {
        const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API;

        try {
            const response = await fetch(`${apiUrl}/erp/verify-token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
        } catch (error) {
            // Tangani kesalahan dengan menampilkan pesan kesalahan atau logout
            console.error('There was a problem with the fetch operation:', error);
            // Menampilkan pesan kesalahan dengan swal
            withReactContent(swalDialog).fire({
                title: `<p style="font-size:12px">Sesi login telah habis, silahkan login kembali.</p>`,
                icon: 'error',
                width: '360px',
                heightAuto: true,
            });
            // Logout setelah beberapa waktu tertentu
            setTimeout(async () => {
                await logout();
            }, 1000); // Ubah waktu tunggu sesuai kebutuhan Anda
        }
    };

    useEffect(() => {
        const fetchSessionData = async () => {
            // handle looping di page login
            if (router.pathname === '/') {
                setIsLoading(false);
                return;
            }

            let tabId = sessionStorage.getItem('tabId');
            if (!tabId) {
                tabId = router.query.tabId as string;
                if (tabId) {
                    sessionStorage.setItem('tabId', tabId);
                } else {
                    router.push('/'); // Redirect ke login jika tidak ada tabId di session
                    return;
                }
            }

            const data = await getSession(tabId);

            setSessionData(data);
            setIsLoading(false);
            verifyToken(data?.token);
        };

        if (router.isReady) {
            fetchSessionData();
        }
    }, [router.isReady, router.query.tabId, router]);
    return <SessionContext.Provider value={{ sessionData, isLoading, saveSessionData, deleteSessionData, logout }}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
