//indexedDB.tsx :
export interface SessionData {
    nama_user: string;
    userid: string;
    nip: string;
    kode_entitas: string;
    kode_user: string;
    kode_kry: string;
    kode_jabatan: string;
    nama_jabatan: string;
    menuData?: any;
    tipe?: string;
    token?: string;
    entitas?: string;
}

const DB_NAME = 'sessionDB';
const STORE_NAME = 'sessions';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = () => {
            reject('Failed to open DB');
        };
    });
};

export const saveSession = (sessionId: string, session: SessionData): Promise<void> => {
    return openDB().then((db) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put({ id: sessionId, session });
    });
};

export const getSession = (sessionId: string): Promise<SessionData | null> => {
    return new Promise((resolve, reject) => {
        openDB().then((db) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(sessionId);

            request.onsuccess = (event) => {
                resolve((event.target as IDBRequest).result ? (event.target as IDBRequest).result.session : null);
            };

            request.onerror = () => {
                reject('Failed to get session');
            };
        });
    });
};

export const deleteSession = (sessionId: string): Promise<void> => {
    return openDB().then((db) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.delete(sessionId);
    });
};
