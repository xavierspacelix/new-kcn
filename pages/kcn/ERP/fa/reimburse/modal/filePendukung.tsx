import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface FilePendukungProps {
    isOpen: boolean;
    onClose: () => void;
    link_gambar: any;
}

const FilePendukung: React.FC<FilePendukungProps> = ({ isOpen, onClose, link_gambar }) => {
    const [gambarLoaded, setGambarLoaded] = useState(false);

    useEffect(() => {
        setGambarLoaded(false);
    }, [isOpen]);

    const handleGambarLoad = () => {
        setGambarLoaded(true);
    };

    return (
        <Transition appear show={isOpen ? true : false} as={React.Fragment}>
            <Dialog as="div" open={isOpen ? true : false} onClose={onClose}>
                {/* ... Modal Overlay ... */}
                <div className="fixed inset-0 z-[999] bg-[black]/60">
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
                            <Dialog.Panel className="panel my-8 rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="panel">
                                    {link_gambar &&
                                        (link_gambar.startsWith('http://') || link_gambar.startsWith('https://') ? (
                                            <img src={link_gambar} style={{ maxHeight: '80vh' }} alt="Gambar" onLoad={handleGambarLoad} />
                                        ) : (
                                            <p>{link_gambar}</p>
                                        ))}
                                </div>
                                <div className="flex justify-end space-x-4">
                                    {gambarLoaded && (
                                        <button type="button" className="btn btn-primary mb-3 mr-3 mt-3" onClick={onClose} style={{ width: '8vh', height: '4vh' }}>
                                            Close
                                        </button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default FilePendukung;
