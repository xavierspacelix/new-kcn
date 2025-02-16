import { DialogComponent, TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { baseFormDKField, CheckboxCustomerCustom, headertext, hubArray, jabatanArray } from '../Template';

import stylesHeader from './customerHeader.module.css';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Tab } from '@headlessui/react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { myAlertGlobal } from '@/utils/routines';
interface NewEditProps {
    isOpen: boolean;
    onClose: (data?: any) => void;
    params: {
        kode_relasi?: string;
        nama_relasi?: string;
        dataKontak: dKTabInterface[];
    };
    state: string;
    kontak?: any[];
}

interface dKTabInterface {
    kode_relasi: string;
    id_relasi: number;
    nama_lengkap: string;
    nama_person: string;
    jab: string;
    hubungan: string;
    bisnis: string;
    bisnis2: string;
    telp: string;
    hp: string;
    hp2: string;
    fax: string;
    email: string;
    catatan: string;
    file_kuasa: string;
    file_ktp: string;
    file_ttd: string;
    aktif_kontak: boolean;
    [key: string]: any; // Add this line
}
const DialogDaftarKontak = ({ isOpen, onClose, params, state }: NewEditProps) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const title = state === 'beginEdit' ? `${params?.dataKontak[0].nama_lengkap} atas ${params?.nama_relasi}` : 'Kontak baru atas ' + params?.nama_relasi;
    const [args, SetArgs] = React.useState<dKTabInterface>({
        kode_relasi: '',
        id_relasi: 0,
        nama_lengkap: '',
        nama_person: '',
        jab: '',
        hubungan: '',
        bisnis: '',
        bisnis2: '',
        telp: '',
        hp: '',
        hp2: '',
        fax: '',
        email: '',
        catatan: '',
        file_kuasa: '',
        file_ktp: '',
        file_ttd: '',
        aktif_kontak: true,
    });
    const tabContent1 = () => {
        return (
            <div className={'mt-3 overflow-auto'}>
                <div className="active">
                    <div className="grid grid-cols-1 gap-2 px-3 md:grid-cols-12">
                        <div className="md:col-span-12">
                            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                {baseFormDKField
                                    .filter((itemTBID) => itemTBID.TabId == 1)
                                    .map((itemField, index) =>
                                        itemField.Type === 'select' ? (
                                            <div className="col-span-2" key={itemField.FieldName + index}>
                                                {itemField.Label && <span className="e-label font-bold">{itemField.Label}</span>}
                                                <div className="container form-input">
                                                    <ComboBoxComponent
                                                        id={itemField.FieldName}
                                                        name={itemField.FieldName}
                                                        fields={{ text: 'label', value: 'value' }}
                                                        value={args[itemField.FieldName]}
                                                        dataSource={itemField.FieldName === 'jab' ? jabatanArray : hubArray}
                                                        readOnly={itemField.ReadOnly}
                                                        disabled={itemField.ReadOnly}
                                                        onChange={(e: any) => onChangeHandle(e)}
                                                    />
                                                </div>
                                            </div>
                                        ) : itemField.Type === 'number' ? (
                                            <div key={itemField.FieldName + index}>
                                                <span className="e-label font-bold">{itemField.Label}</span>
                                                <div className="container form-input">
                                                    <span className="e-input-group e-control-wrapper">
                                                        <input
                                                            id={itemField.FieldName}
                                                            name={itemField.FieldName}
                                                            type="text"
                                                            className="e-control e-textbox e-lib e-input"
                                                            value={args[itemField.FieldName]}
                                                            readOnly={itemField.ReadOnly}
                                                            onKeyDown={(event) => {
                                                                const char = (event as React.KeyboardEvent<HTMLInputElement>).key;
                                                                const isValidChar = /[0-9.\s]/.test(char) || char === 'Backspace';
                                                                if (!isValidChar) {
                                                                    event.preventDefault();
                                                                }

                                                                const inputValue = (event.target as HTMLInputElement).value;
                                                                if (char === '.' && inputValue.includes('.')) {
                                                                    event.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e: any) => onChangeHandle(e)}
                                                        />
                                                    </span>
                                                </div>
                                            </div>
                                        ) : itemField.Type === 'string' ? (
                                            <div key={itemField.FieldName + index}>
                                                <span className="e-label font-bold">{itemField.Label}</span>
                                                <div className="container form-input">
                                                    <TextBoxComponent
                                                        id={itemField.FieldName}
                                                        name={itemField.FieldName}
                                                        value={args[itemField.FieldName]}
                                                        onChange={(e: any) => onChangeHandle(e)}
                                                        readOnly={itemField.ReadOnly}
                                                    />
                                                </div>
                                            </div>
                                        ) : itemField.Type === 'space' ? (
                                            <div></div>
                                        ) : itemField.Type === 'longString' ? (
                                            <div className="col-span-2" key={itemField.FieldName + index}>
                                                {itemField.Label && <span className="e-label font-bold">{itemField.Label}</span>}
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="form-input">
                                                        <TextBoxComponent
                                                            name={itemField.FieldName}
                                                            id={itemField.FieldName}
                                                            value={args[itemField.FieldName]}
                                                            readOnly={itemField.ReadOnly}
                                                            onChange={(e: any) => onChangeHandle(e)}
                                                        />
                                                    </div>
                                                    {itemField.IsAction && (
                                                        <TooltipComponent content={itemField.FieldName === 'website' ? 'Kunjungi Website' : 'Kirimkan Email'} position="TopCenter">
                                                            <ButtonComponent
                                                                // onClick={() => isActionHandle(itemField.FieldName, String(itemField.Value))}
                                                                id={itemField.FieldName}
                                                                cssClass="e-primary e-small"
                                                                style={{
                                                                    width: 'auto',
                                                                    backgroundColor: '#e6e6e6',
                                                                    color: 'black',
                                                                }}
                                                            >
                                                                {itemField.FieldName === 'website' ? (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        className="lucide lucide-link h-4 w-4"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                                                    </svg>
                                                                ) : (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="24"
                                                                        height="24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        className="lucide lucide-send h-4 w-4"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11zM21.854 2.147l-10.94 10.939"></path>
                                                                    </svg>
                                                                )}
                                                            </ButtonComponent>
                                                        </TooltipComponent>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <></>
                                        )
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const tabContent2 = () => {
        return (
            <div className="mt-3 px-3 md:col-span-5">
                <div className="flex flex-col">
                    <div>
                        {baseFormDKField
                            .filter((itemTBID) => itemTBID.TabId == 2)
                            .map((itemField) => (
                                <textarea
                                    id="ctnTextarea"
                                    rows={10}
                                    className="form-textarea"
                                    ref={textareaRef}
                                    value={args[itemField.FieldName]}
                                    readOnly={itemField.ReadOnly}
                                    onChange={(e: any) => onChangeHandle(e)}
                                />
                            ))}
                    </div>
                </div>
            </div>
        );
    };

    const dialogClose = () => {
        onClose(args);
    };
    const footerTemplateDlg = () => {
        return (
            <div className="mx-auto flex items-end justify-end">
                <div className="flex">
                    {/* TODO: onClick */}
                    <div className="e-btn e-danger e-small" onClick={() => {}}>
                        Batal
                    </div>
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            if (args.nama_lengkap === '') {
                                myAlertGlobal('Nama Lengkap Belum Diisi.', 'dialogKontak', 'warning');
                            } else if (args.nama_person === '') {
                                myAlertGlobal('Panggilan belum diisi.', 'dialogKontak', 'warning');
                            } else if (args.jabatan === '') {
                                myAlertGlobal('Jabatan belum diisi.', 'dialogKontak', 'warning');
                            } else if (args.hubungan === '') {
                                myAlertGlobal('Hubungan Kepemilikan belum diisi.', 'dialogKontak', 'warning');
                            } else {
                                onClose(args);
                            }
                        }}
                    >
                        Simpan
                    </div>
                </div>
            </div>
        );
    };
    React.useEffect(() => {
        if (params?.dataKontak.length > 0) {
            SetArgs(params?.dataKontak[0]);
        }
        const textarea = textareaRef.current;
        if (textarea) {
            const textarea = textareaRef.current;
            if (textarea) {
                const adjustHeight = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 20 * 24)}px`; // 20 rows max height
                };

                textarea.addEventListener('input', adjustHeight);
                adjustHeight();

                return () => {
                    textarea.removeEventListener('input', adjustHeight);
                };
            }
        }
    }, []);
    console.log('params?.dataKontak :', params?.dataKontak);
    console.log('args :', args);
    const onChangeHandle = (e: any) => {
        const { name, value } = e.target;
        SetArgs((prevArgs) => ({
            ...prevArgs,
            [name]: value,
        }));
    };
    return (
        <DialogComponent
            id="dialogKontak"
            isModal={true}
            width="600px"
            target={'#dialogCustomer'}
            height="auto"
            visible={isOpen}
            close={dialogClose}
            header={title}
            showCloseIcon={true}
            closeOnEscape={false}
            footerTemplate={footerTemplateDlg}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            // enableResize={true}
        >
            <div>
                <div className="grid grid-cols-12 gap-2">
                    <div className={`panel-tabel col-span-full`}>
                        <table className={stylesHeader.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '50%' }}>Nama</th>
                                    <th style={{ width: '50%' }}>Panggilan</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {baseFormDKField
                                        .filter((item) => item.TabId == 0)
                                        .map(
                                            (itemField) =>
                                                itemField.Type === 'string' && (
                                                    <td key={itemField.id}>
                                                        <div className="container form-input" style={{ border: 'none' }}>
                                                            <TextBoxComponent
                                                                name={itemField.FieldName}
                                                                id={itemField.FieldName}
                                                                className={`${stylesHeader.inputTableBasic}`}
                                                                style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                value={String(args[itemField.FieldName])}
                                                                readOnly={itemField.ReadOnly}
                                                                onChange={(e: any) => onChangeHandle(e)}
                                                            />
                                                        </div>
                                                    </td>
                                                )
                                        )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="ml-2 mt-2 flex items-start justify-start gap-12">
                    {baseFormDKField
                        .filter((item) => item.TabId == 0)
                        .map(
                            (item) =>
                                item.Type === 'checkbox' && (
                                    <td key={item.id}>
                                        <CheckboxCustomerCustom
                                            isRed={true}
                                            name={item.FieldName}
                                            key={item.FieldName}
                                            id={item.FieldName}
                                            label={item.Label}
                                            checked={!Boolean(args[item.FieldName])}
                                            change={(e: any) => {
                                                onChangeHandle(e);
                                            }}
                                        />
                                    </td>
                                )
                        )}
                </div>
                <div>
                    <Tab.Group>
                        <Tab.List className="mt-3 flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            {headertext.map((item: { id: number; text: string }, index: number) => (
                                <Tab key={item.id} as={React.Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                console.log('tab', item.id);
                                            }}
                                            className={`${selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'}
                                                        -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                            id={`tab-${item.id}`}
                                        >
                                            {item.text}
                                        </button>
                                    )}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="w-full flex-1 border border-t-0 border-white-light bg-[#f8f7ff]  p-2 text-sm dark:border-[#191e3a]">
                            {headertext.map((item: { text: string }, index: number) => (
                                <Tab.Panel key={index} className={'h-[420px] overflow-auto'}>
                                    {item.text === '1. Informasi' ? tabContent1 : item.text === '2. Catatan' ? tabContent2 : <></>}
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogDaftarKontak;
