import React from 'react';
import { vtFileProps } from '../../functions/definition';
import { Tab } from '@headlessui/react';
import { UploaderComponent } from '@syncfusion/ej2-react-inputs';

import { TabFilePendukung } from '../Template';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import Image from 'next/image';
import moment from 'moment';
import { myAlertGlobal } from '@/utils/routines';
interface FilePendukungProps {
    vtFile: vtFileProps[];
    vtPDF: vtFileProps[];
    state: string;
    params: {
        kelas: string;
    };
    setVTFile: Function;
    setVTFilePDF: Function;
}

const FilePendukung = ({ vtFile, state, params, setVTFile, vtPDF, setVTFilePDF }: FilePendukungProps) => {
    let uploaderRefs = Array.from({ length: 20 }, () => React.useRef<UploaderComponent>(null));
    let uploaderPDFRefs = Array.from({ length: 2 }, () => React.useRef<UploaderComponent>(null));
    const [isDragging, setIsDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [zoomScale, setZoomScale] = React.useState(0.5);
    const [rotationAngle, setRotationAngle] = React.useState(0);
    const [isPreview, setIsPreview] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState(1);
    const handleMouseDown = (event: any) => {
        setIsDragging(true);
        setOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleMouseMove = (event: any) => {
        if (isDragging) {
            setPosition({
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const HandleZoomIn = (setZoomScale: Function) => {
        setZoomScale((prevScale: any) => Math.min(prevScale + 0.1, 3)); // Maksimal zoom 3x
    };

    const HandleZoomOut = (setZoomScale: Function) => {
        setZoomScale((prevScale: any) => Math.max(prevScale - 0.1, 0.5)); // Minimal zoom 0.5x
    };

    const handleRotateLeft = () => setRotationAngle(rotationAngle - 90);
    const handleRotateRight = () => setRotationAngle(rotationAngle + 90);
    const handleFileSelect = (e: any, id: number, isPDF: boolean) => {
        if (isPDF) {
            const newFile = e.filesData[0]?.rawFile;
            const reader = new FileReader();
            const fileExtension = newFile?.name?.split('.').pop();
            reader.onload = (event) => {
                setVTFilePDF((prevVTPDFFile: vtFileProps[]) => {
                    const updatedVTFile = prevVTPDFFile.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                state: 'EDITED',
                                original_name: newFile.name,
                                nama_file: 'CS' + moment().format('YYMMDDHHmmss' + '.' + fileExtension),
                                file: newFile,
                                exist: true,
                            };
                        }
                        return item;
                    });
                    return updatedVTFile;
                });
            };
            reader.readAsDataURL(newFile);
        } else {
            const newFile = e.filesData[0]?.rawFile;
            const reader = new FileReader();
            const fileExtension = newFile?.name?.split('.').pop();
            reader.onload = (event) => {
                setVTFile((prevVTFile: vtFileProps[]) => {
                    const updatedVTFile = prevVTFile.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                state: 'EDITED',
                                original_name: newFile.name,
                                nama_file: 'CS' + moment().format('YYMMDDHHmmss' + '.' + fileExtension),
                                file: newFile,
                                exist: true,
                            };
                        }
                        return item;
                    });
                    return updatedVTFile;
                });
            };
            reader.readAsDataURL(newFile);
        }
    };
    const handleRemove = (id: number, isPDF: boolean) => {
        if (isPDF) {
            setVTFilePDF((prevVTFile: vtFileProps[]) => {
                const updatedVTFile = prevVTFile.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            file: null,
                            original_name: '',
                            nama_file: '',
                            state: 'DELETED',
                            exist: false,
                        };
                    }
                    return item;
                });
                return updatedVTFile;
            });
        } else {
            setVTFile((prevVTFile: vtFileProps[]) => {
                const updatedVTFile = prevVTFile.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            file: null,
                            original_name: '',
                            nama_file: '',
                            state: 'DELETED',
                            exist: false,
                        };
                    }
                    return item;
                });
                return updatedVTFile;
            });
        }
    };
    const handleRemoveAll = (isPDF: boolean) => {
        if (isPDF) {
            setVTFilePDF((prevVTFile: vtFileProps[]) => {
                const updatedVTFile = prevVTFile.map((item) => {
                    return {
                        ...item,
                        file: null,
                        original_name: '',
                        nama_file: '',
                        state: 'DELETED',
                        exist: false,
                    };
                });
                return updatedVTFile;
            });
        } else {
            setVTFile((prevVTFile: vtFileProps[]) => {
                const updatedVTFile = prevVTFile.map((item) => {
                    return {
                        ...item,
                        file: null,
                        original_name: '',
                        nama_file: '',
                        state: 'DELETED',
                        exist: false,
                    };
                });
                return updatedVTFile;
            });
        }
    };
    const handleDownload = (id: number, isPDF: boolean) => {
        if (isPDF) {
            const targetFile = vtPDF.find((item) => item.id === id);
            console.log(targetFile);
            if (!targetFile || !targetFile.file) {
                return myAlertGlobal('File tidak ditemukan', 'dialogCustomer', 'error');
            } else {
                const url = URL.createObjectURL(targetFile.file);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', targetFile.file.name);
                link.click();
                URL.revokeObjectURL(url);
            }
        } else {
            const targetFile = vtFile.find((item) => item.id === id);

            if (!targetFile || !targetFile.file) {
                return myAlertGlobal('File tidak ditemukan', 'dialogCustomer', 'error');
            } else {
                const url = URL.createObjectURL(targetFile.file);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', targetFile.file.name);
                link.click();
                URL.revokeObjectURL(url);
            }
        }
    };
    const handlePreview = (id: number, isPDF: boolean) => {
        if (isPDF) {
            const targetFile = vtPDF.find((item) => item.id === id);
            if (!targetFile || !targetFile.file) {
                return myAlertGlobal('File tidak ditemukan', 'dialogCustomer', 'error');
            } else {
                const url = URL.createObjectURL(targetFile.file);
                window.open(url, '_blank');
            }
        } else {
            setIsPreview(true);
        }
    };
    return (
        <>
            <Tab.Group>
                <Tab.List className="flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    {TabFilePendukung.map((item: any) => (
                        <Tab key={item.id} as={React.Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'}
                                                            -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                    id={`tab-${item.id}`}
                                >
                                    {item.label}
                                </button>
                            )}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className={`w-full flex-1 border border-t-0 border-white-light text-sm dark:border-[#191e3a]`}>
                    {TabFilePendukung.map((item: any, index: number) => (
                        <Tab.Panel key={index} className={`h-[420px] overflow-auto p-2 `}>
                            {item.id == 1 ? (
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-12 ">
                                    <div className="col-span-9">
                                        <Tab.Group>
                                            <Tab.List className="flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                                {vtFile.map((item: any) => (
                                                    <Tab key={item.id} as={React.Fragment}>
                                                        {({ selected }) => (
                                                            <button
                                                                onClick={() => setSelectedFiles(item.id)}
                                                                className={`${
                                                                    selected
                                                                        ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black'
                                                                        : 'text-gray-400'
                                                                }
                                                                    -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                                                id={`tab-${item.id}`}
                                                            >
                                                                {item.id}
                                                            </button>
                                                        )}
                                                    </Tab>
                                                ))}
                                            </Tab.List>
                                            <Tab.Panels className={`w-full flex-1 border border-t-0 border-white-light text-sm dark:border-[#191e3a]`}>
                                                {vtFile.map((item: vtFileProps, index: number) => (
                                                    <Tab.Panel key={index} className={`h-[320px] overflow-auto p-2`}>
                                                        <div style={{ width: '100%', height: '100%' }}>
                                                            <div style={{ display: 'flex' }}>
                                                                <div style={{ width: 400 }}>
                                                                    <UploaderComponent
                                                                        id="previewfileupload"
                                                                        type="file"
                                                                        ref={uploaderRefs[index]}
                                                                        multiple={false}
                                                                        selected={(e) => handleFileSelect(e, item.id, false)}
                                                                        removing={() => handleRemove(item.id, false)}
                                                                    />
                                                                    {item.nama_file && <span className="e-label font-bold">{item.nama_file}</span>}
                                                                </div>
                                                                {item.file && (
                                                                    <div style={{ marginTop: 0, marginLeft: 20, border: '3px solid #dedede', borderRadius: 5 }} className="preview">
                                                                        <Image
                                                                            src={URL.createObjectURL(item.file)}
                                                                            alt={item.nama_file}
                                                                            width={200}
                                                                            height={200}
                                                                            style={{ width: '100%', height: '300px' }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Tab.Panel>
                                                ))}
                                            </Tab.Panels>
                                        </Tab.Group>
                                        <div className="panel-pager">
                                            <TooltipComponent content="Hapus Gambar" opensOn="Hover" openDelay={5} target="#btnHapus">
                                                <TooltipComponent content="Hapus Semua Gambar" opensOn="Hover" openDelay={5} target="#btnHapusAll">
                                                    <TooltipComponent content="Simpan Gambar" opensOn="Hover" openDelay={5} target="#btnDownload">
                                                        <TooltipComponent content="Preview Gambar" opensOn="Hover" openDelay={5} target="#btnPreview">
                                                            <div className="flex items-center justify-start">
                                                                <ButtonComponent
                                                                    id="btnHapus"
                                                                    type="button"
                                                                    iconCss="e-icons e-small e-trash"
                                                                    cssClass="e-danger e-small"
                                                                    style={{
                                                                        width: 'auto',
                                                                        marginBottom: '0.5em',
                                                                        marginTop: 0.5 + 'em',
                                                                        marginRight: 0.8 + 'em',
                                                                        backgroundColor: '#e6e6e6',
                                                                        color: 'black',
                                                                    }}
                                                                    onClick={() => {
                                                                        handleRemove(selectedFiles, false);
                                                                    }}
                                                                    content="Bersihkan Gambar"
                                                                />
                                                                <ButtonComponent
                                                                    id="btnHapusAll"
                                                                    type="button"
                                                                    iconCss="e-icons e-small e-erase"
                                                                    cssClass="e-danger e-small"
                                                                    style={{
                                                                        width: 'auto',
                                                                        marginBottom: '0.5em',
                                                                        marginTop: 0.5 + 'em',
                                                                        marginRight: 0.8 + 'em',
                                                                        backgroundColor: '#e6e6e6',
                                                                        color: 'black',
                                                                    }}
                                                                    onClick={() => {
                                                                        handleRemoveAll(false);
                                                                    }}
                                                                    content="Bersihkan Semua Gambar"
                                                                />
                                                                <ButtonComponent
                                                                    id="btnDownload"
                                                                    type="button"
                                                                    iconCss="e-icons e-small e-download"
                                                                    cssClass="e-danger e-small"
                                                                    style={{
                                                                        width: 'auto',
                                                                        marginBottom: '0.5em',
                                                                        marginTop: 0.5 + 'em',
                                                                        marginRight: 0.8 + 'em',
                                                                        backgroundColor: '#e6e6e6',
                                                                        color: 'black',
                                                                    }}
                                                                    onClick={() => {
                                                                        handleDownload(selectedFiles, false);
                                                                    }}
                                                                    content="Simpan Ke File"
                                                                />
                                                                <ButtonComponent
                                                                    id="btnPreview"
                                                                    type="button"
                                                                    iconCss="e-icons e-small e-image"
                                                                    cssClass="e-danger e-small"
                                                                    style={{
                                                                        width: 'auto',
                                                                        marginBottom: '0.5em',
                                                                        marginTop: 0.5 + 'em',
                                                                        marginRight: 0.8 + 'em',
                                                                        backgroundColor: '#e6e6e6',
                                                                        color: 'black',
                                                                    }}
                                                                    onClick={() => {
                                                                        handlePreview(selectedFiles, false);
                                                                    }}
                                                                    content="Preview"
                                                                />
                                                            </div>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </TooltipComponent>
                                            </TooltipComponent>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <span className="e-label font-bold">Keterangan</span>
                                        <div className="flex-col">
                                            {vtFile.map((item, index) => (
                                                <h5
                                                    className={`
                                        ${params.kelas >= 'A' && params.kelas <= 'F' ? (item.mandatory ? 'bg-[#FFDFDF] font-bold' : '') : item.exist ? 'bg-[#BBFFBB]' : ''} 
                                        text-[12px] text-black
                                    `}
                                                    key={index}
                                                >
                                                    {item.keterangan}
                                                </h5>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center justify-between gap-6">
                                                <div className="flex items-center justify-center  gap-2">
                                                    <div className="h-3 w-3 border border-gray-950 bg-[#FFDFDF]"></div>
                                                    <div className="mt-1">File Mandatori</div>
                                                </div>
                                                <div className="flex items-center justify-center  gap-2">
                                                    <div className="h-3 w-3 border border-gray-950 bg-[#BBFFBB]"></div>
                                                    <div className="mt-1">File Sudah di Masukan</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : item.id == 2 ? (
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-12 ">
                                    <div className="col-span-12">
                                        {vtPDF.map((item: vtFileProps, index: number) => (
                                            <div>
                                                <span className="e-label font-bold">Portable Document File (PDF) {index + 1} :</span>

                                                <UploaderComponent
                                                    id="previewfileupload"
                                                    type="file"
                                                    ref={uploaderPDFRefs[index]}
                                                    multiple={false}
                                                    selected={(e) => handleFileSelect(e, item.id, true)}
                                                    removing={() => handleRemove(item.id, true)}
                                                />
                                                {item.nama_file && <span className="e-label font-bold">{item.nama_file}</span>}
                                                <div className="panel-pager">
                                                    <TooltipComponent content="Hapus File" opensOn="Hover" openDelay={5} target="#btnHapus">
                                                        <TooltipComponent content="Hapus Semua File" opensOn="Hover" openDelay={5} target="#btnHapusAll">
                                                            <TooltipComponent content="Simpan File" opensOn="Hover" openDelay={5} target="#btnDownload">
                                                                <TooltipComponent content="Preview File" opensOn="Hover" openDelay={5} target="#btnPreview">
                                                                    <div className="flex items-center justify-start">
                                                                        <ButtonComponent
                                                                            id="btnHapus"
                                                                            type="button"
                                                                            iconCss="e-icons e-small e-trash"
                                                                            cssClass="e-danger e-small"
                                                                            style={{
                                                                                width: 'auto',
                                                                                marginBottom: '0.5em',
                                                                                marginTop: 0.5 + 'em',
                                                                                marginRight: 0.8 + 'em',
                                                                                backgroundColor: '#e6e6e6',
                                                                                color: 'black',
                                                                            }}
                                                                            onClick={() => {
                                                                                handleRemove(item.id, true);
                                                                            }}
                                                                            content="Bersihkan File"
                                                                        />
                                                                        <ButtonComponent
                                                                            id="btnHapusAll"
                                                                            type="button"
                                                                            iconCss="e-icons e-small e-erase"
                                                                            cssClass="e-danger e-small"
                                                                            style={{
                                                                                width: 'auto',
                                                                                marginBottom: '0.5em',
                                                                                marginTop: 0.5 + 'em',
                                                                                marginRight: 0.8 + 'em',
                                                                                backgroundColor: '#e6e6e6',
                                                                                color: 'black',
                                                                            }}
                                                                            onClick={() => {
                                                                                handleRemoveAll(true);
                                                                            }}
                                                                            content="Bersihkan Semua File"
                                                                        />
                                                                        <ButtonComponent
                                                                            id="btnDownload"
                                                                            type="button"
                                                                            iconCss="e-icons e-small e-download"
                                                                            cssClass="e-danger e-small"
                                                                            style={{
                                                                                width: 'auto',
                                                                                marginBottom: '0.5em',
                                                                                marginTop: 0.5 + 'em',
                                                                                marginRight: 0.8 + 'em',
                                                                                backgroundColor: '#e6e6e6',
                                                                                color: 'black',
                                                                            }}
                                                                            onClick={() => {
                                                                                handleDownload(item.id, true);
                                                                            }}
                                                                            content="Simpan Ke File"
                                                                        />
                                                                        <ButtonComponent
                                                                            id="btnPreview"
                                                                            type="button"
                                                                            iconCss="e-icons e-small e-image"
                                                                            cssClass="e-danger e-small"
                                                                            style={{
                                                                                width: 'auto',
                                                                                marginBottom: '0.5em',
                                                                                marginTop: 0.5 + 'em',
                                                                                marginRight: 0.8 + 'em',
                                                                                backgroundColor: '#e6e6e6',
                                                                                color: 'black',
                                                                            }}
                                                                            onClick={() => {
                                                                                handlePreview(item.id, true);
                                                                            }}
                                                                            content="Preview"
                                                                        />
                                                                    </div>
                                                                </TooltipComponent>
                                                            </TooltipComponent>
                                                        </TooltipComponent>
                                                    </TooltipComponent>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
            {isPreview && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '1000',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            textAlign: 'center',
                            zIndex: '1001',
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                    >
                        <img
                            src={vtFile.find((item) => item.id === selectedFiles)?.file ? URL.createObjectURL(vtFile.find((item) => item.id === selectedFiles)?.file as Blob) : ''}
                            alt="previewImg"
                            style={{
                                transform: `scale(${zoomScale}) translate(${position.x}px, ${position.y}px) rotate(${rotationAngle}deg)`,
                                transition: 'transform 0.1s ease',
                                cursor: 'pointer',
                                maxWidth: '100vw',
                                maxHeight: '100vh',
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                        />
                    </div>
                    <div
                        style={{
                            position: 'fixed',
                            top: '10px',
                            right: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            zIndex: '1001',
                        }}
                    >
                        <ButtonComponent
                            id="zoomIn"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-zoom-in" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => HandleZoomIn(setZoomScale)}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            id="zoomOut"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-zoom-out" style={{ fontSize: '32px', fontWeight: 'bold' }} onClick={() => HandleZoomOut(setZoomScale)}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            cssClass="e-primary e-small"
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                marginTop: '-10px',
                            }}
                        >
                            <span className="e-icons e-undo" style={{ fontSize: '32px' }} onClick={handleRotateLeft}></span>
                        </ButtonComponent>
                        <ButtonComponent
                            cssClass="e-primary e-small"
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                marginTop: '-20px',
                            }}
                        >
                            <span className="e-icons e-redo" style={{ fontSize: '32px' }} onClick={handleRotateRight}></span>
                        </ButtonComponent>

                        <ButtonComponent
                            id="close"
                            cssClass="e-primary e-small"
                            iconCss=""
                            style={{
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '24px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                padding: 0,
                            }}
                        >
                            <span className="e-icons e-close" style={{ fontSize: '20px', fontWeight: 'bold' }} onClick={() => setIsPreview(false)}></span>
                        </ButtonComponent>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilePendukung;
