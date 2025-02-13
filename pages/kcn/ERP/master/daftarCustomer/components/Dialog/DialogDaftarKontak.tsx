import { DialogComponent, TooltipComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { baseFormDKField, CheckboxCustomerCustom, dKTabInterface } from '../Template';
import stylesHeader from './customerHeader.module.css';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Tab } from '@headlessui/react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
interface NewEditProps {
    isOpen: boolean;
    onClose: () => void;
    params: {
        userid: string;
        kode_cust: string;
        kode_relasi?: string;
        nama_relasi?: string;
        entitas: string;
        token: string;
        kotaArray: any[];
        kecamatanArray: any[];
        kelurahanArray: any[];
        provinsiArray: any[];
        negaraArray: any[];
    };
    state: string;
    setParams: any;
    args: any;
    requestType: string;
}
const DialogDaftarKontak = ({ isOpen, onClose, params, state, setParams, args, requestType }: NewEditProps) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    let headertext: any;
    // Mapping Tab items Header property
    headertext = [{ text: '1. Informasi' }, { text: '2. Catatan' }];

    const tabContent1 = () => {
        return (
            <div className={'h-[255px] overflow-auto mt-3'}>
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
                                                        onBlur={(event: any) => {
                                                            if (!itemField.ReadOnly) {
                                                                // handleChange(itemField.FieldName, event.target.value, itemField.group);
                                                            }
                                                        }}
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
                                                        <TextBoxComponent name={itemField.FieldName} id={itemField.FieldName} value={args[itemField.FieldName]} readOnly={itemField.ReadOnly} />
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
            <div className={'h-[255px] overflow-auto'}>
                Facebook is an online social networking service headquartered in Menlo Park, California. Its website was launched on February 4, 2004, by Mark Zuckerberg with his Harvard College
                roommates and fellow students Eduardo Saverin, Andrew McCollum, Dustin Moskovitz and Chris Hughes. The founders had initially limited the website's membership to Harvard students, but
                later expanded it to colleges in the Boston area, the Ivy League, and Stanford University. It gradually added support for students at various other universities and later to
                high-school students.
            </div>
        );
    };
    const tabContent3 = () => {
        return (
            <div>
                WhatsApp Messenger is a proprietary cross-platform instant messaging client for smartphones that operates under a subscription business model. It uses the Internet to send text
                messages, images, video, user location and audio media messages to other users using standard cellular mobile numbers. As of February 2016, WhatsApp had a user base of up to one
                billion, making it the most globally popular messaging application. WhatsApp Inc., based in Mountain View, California, was acquired by Facebook Inc. on February 19, 2014, for
                approximately US$19.3 billion.
            </div>
        );
    };
    const tabKontak = ['1. Informasi', '2. Catatan'];
    const jabatanArray = [
        { label: 'Anggota keluarga pemilik', value: 'Anggota keluarga pemilik' },
        { label: 'Manager keuangan', value: 'Manager keuangan' },
        { label: 'Manager pembelian', value: 'Manager pembelian' },
        { label: 'Admin keuangan', value: 'Admin keuangan' },
        { label: 'Admin pembelian', value: 'Admin pembelian' },
        { label: 'Karyawan toko', value: 'Karyawan toko' },
        { label: 'Lainnya', value: 'Lainnya' },
    ];

    const hubArray = [
        { label: 'Pemilik', value: 'Pemilik' },
        { label: 'Suami / istri pemilik', value: 'Suami / istri pemilik' },
        { label: 'Anak pemilik', value: 'Anak pemilik' },
        { label: 'Orang tua pemilik', value: 'Orang tua pemilik' },
        { label: 'Saudara lain', value: 'Saudara lain' },
        { label: 'Orang lain (tidak memiliki hub dengan pemilik)', value: 'Orang lain (tidak memiliki hub dengan pemilik)' },
        { label: 'Lainnya', value: 'Lainnya' },
    ];
    const title = requestType === 'beginEdit' ? `${args.nama_lengkap} atas ${params.nama_relasi}` : 'Kontak baru atas ' + params.nama_relasi;
    const dialogClose = () => {
        onClose();
    };
    const footerTemplateDlg = () => {
        return (
            <div className="mx-auto flex items-end justify-end">
                <div className="flex">
                    {/* TODO: onClick */}
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            console.log(args);
                        }}
                    >
                        Batal
                    </div>
                    <div className="e-btn e-danger e-small" onClick={() => {}}>
                        Simpan
                    </div>
                </div>
            </div>
        );
    };
    React.useEffect(() => {
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

    return (
        <DialogComponent
            id="dialogKontak"
            isModal={true}
            target={'#dialogCustomer'}
            width="600px"
            height="auto"
            visible={isOpen}
            close={dialogClose}
            header={title}
            showCloseIcon={true}
            closeOnEscape={false}
            footerTemplate={footerTemplateDlg}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            enableResize={true}
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
                                            checked={Boolean(args[item.FieldName])}
                                            change={(event: any) => {
                                                // handleChange(item.FieldName, event.target.checked, item.group);
                                            }}
                                        />
                                    </td>
                                )
                        )}
                </div>
                <div>
                    {/* <Tab.Group>
                        <Tab.List className="mt-3 flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            {tabKontak.map((item: string, index: number) => (
                                <Tab key={index} as={React.Fragment}>
                                    {({ selected }) => (
                                        <button
                                            onClick={() => {
                                                console.log('HALLo');
                                            }}
                                            className={`${selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'}
                                                                                -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                            id={`tab-${index}`}
                                        >
                                            {item}
                                        </button>
                                    )}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="w-full flex-1 border border-t-0 border-white-light bg-[#f8f7ff]  p-2 text-sm dark:border-[#191e3a]">
                            {tabKontak.map((item: string, index: number) => (
                                <Tab.Panel key={index} className={'h-[255px] overflow-auto'}>
                                    {item === '1. Informasi' ? (
                                        <div className="active">
                                            <div className="grid grid-cols-1 gap-2 px-3 md:grid-cols-12">
                                                <div className="md:col-span-12">
                                                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                                        {baseFormDKField
                                                            .filter((itemTBID) => itemTBID.TabId == 1)
                                                            .map((itemField) =>
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
                                                                                onBlur={(event: any) => {
                                                                                    if (!itemField.ReadOnly) {
                                                                                        // handleChange(itemField.FieldName, event.target.value, itemField.group);
                                                                                    }
                                                                                }}
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
                                                                                />
                                                                            </div>
                                                                            {itemField.IsAction && (
                                                                                <TooltipComponent
                                                                                    content={itemField.FieldName === 'website' ? 'Kunjungi Website' : 'Kirimkan Email'}
                                                                                    position="TopCenter"
                                                                                >
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
                                    ) : item === '2. Catatan' ? (
                                        <div className="md:col-span-5">
                                            <div className="flex flex-col">
                                                <div key={item + index}>
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
                                                                onChange={(e) => {}}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group> */}
                    <TabComponent id="defaultTab">
                        <TabItemsDirective>
                            <TabItemDirective header={headertext[0]} content={tabContent1} />
                            <TabItemDirective header={headertext[1]} content={tabContent2} />
                        </TabItemsDirective>
                    </TabComponent>
                </div>
            </div>
        </DialogComponent>
    );
};

export default DialogDaftarKontak;
