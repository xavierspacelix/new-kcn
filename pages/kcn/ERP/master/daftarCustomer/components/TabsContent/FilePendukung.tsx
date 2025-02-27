import React from 'react';
import { vtFileProps } from '../../functions/definition';
import { Tab } from '@headlessui/react';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { TabFilePendukung } from '../Template';
interface FilePendukungProps {
    vtFile: vtFileProps[];
    state: string;
}
const FilePendukung = ({ vtFile, state }: FilePendukungProps) => {
    return (
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
                <Tab.Panel className={`h-[450px] overflow-auto  p-2 `}>
                    {/* {vtFile.map((item: vtFileProps, index: number) => ( */}
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                        <div className="col-span-9">
                            <Tab.Group>
                                <Tab.List className="flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                    {vtFile.map((item: any) => (
                                        <Tab key={item.id} as={React.Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={`${
                                                        selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'
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
                            </Tab.Group>
                        </div>
                        <div className="col-span-3">
                            <div className="mb-2 flex-col gap-x-1">
                                {vtFile.map((item, index) => (
                                    <h5
                                        className={`${state === 'new' && item.mandatory ? 'bg-[#FFDFDF] font-bold' : state === 'edit' && item.file ? 'bg-[#BBFFBB]' : ''} text-[12px] text-black`}
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
                    {/* ))} */}
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
};

export default FilePendukung;
