import React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { BaseFormField, CheckboxCustomerCustom, contentLoader, JamOpsField } from '../Template';
import stylesHeader from './customerHeader.module.css';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { customerTab, FieldProps, JamOpsProps, onRenderDayCell } from '../../functions/definition';
import { faBarcode, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react';
import InfoPerusahaan from '../TabsContent/InfoPerusahaan';
import { Grid, GridComponent } from '@syncfusion/ej2-react-grids';

interface NewEditProps {
    isOpen: boolean;
    onClose: () => void;
    params: {
        userid: string;
        kode_cust: string;
        kode_relasi?: string;
        entitas: string;
        token: string;
        kotaArray: any[];
        kecamatanArray: any[];
        kelurahanArray: any[];
        provinsiArray: any[];
        negaraArray: any[];
    };
    state: string;
}
let gridJamOPSType: Grid;
const NewEditDialog = ({ isOpen, onClose, params, state }: NewEditProps) => {
    const [title, setTitle] = React.useState('Customer Baru');
    const [showLoader, setShowLoader] = React.useState(false);
    const [formBaseStateField, setFormBaseStateField] = React.useState<FieldProps[]>(BaseFormField);
    const [formJamOpsField, setFormJamOpsField] = React.useState<JamOpsProps[]>(JamOpsField);
    const footerTemplateDlg = () => {
        return (
            <div className="mx-auto flex items-center justify-between">
                <div className="flex items-center justify-between ">
                    <ButtonComponent
                        id="btnHisKunjungan"
                        cssClass="e-primary e-small"
                        style={{
                            width: 'auto',
                            backgroundColor: '#e6e6e6',
                            color: 'black',
                        }}
                        //  {/*  TODO: onClick */}
                        onClick={() => {}}
                        content="History Kunjungan Sales"
                        iconCss="e-icons e-medium e-chevron-right"
                    ></ButtonComponent>
                </div>

                <div className="flex">
                    {/*  TODO: onClick */}
                    <div className="e-btn e-danger e-small" onClick={() => {}}>
                        Berikut
                    </div>
                    {/* TODO: onClick */}
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            console.log('formBaseStateField ', formBaseStateField);
                        }}
                    >
                        Simpan
                    </div>
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            setFormBaseStateField(BaseFormField);
                            gridJamOPSType.refresh();
                        }}
                    >
                        Batal
                    </div>
                </div>
            </div>
        );
    };
    const handleChange = (name: string, value: string | Date | boolean, grup: string, itemName?: string) => {
        if (grup === 'masterTop') {
            const newData = formBaseStateField
                .filter((itemF) => itemF.group === grup)
                .map((item) => {
                    if (item.FieldName === name) {
                        return {
                            ...item,
                            Value: value,
                        };
                    }
                    return item;
                });
            const pushedData = [...newData, ...formBaseStateField.filter((item) => item.group !== grup)];
            setFormBaseStateField(pushedData.sort((a, b) => a.id - b.id));
        } else if (grup === 'masterLeft') {
            const newData = formBaseStateField
                .filter((itemF) => itemF.group === grup)
                .map((item) => {
                    if (item.FieldName === name) {
                        return {
                            ...item,
                            Value: value,
                        };
                    }
                    return item;
                });
            const pushedData = [...newData, ...formBaseStateField.filter((item) => item.group !== grup)];
            setFormBaseStateField(pushedData.sort((a, b) => a.id - b.id));
        } else if (grup === 'detail') {
            console.log('detail', name, value, grup);
            const newData = formBaseStateField
                .filter((itemF) => itemF.group === grup)
                .map((item) => {
                    if (item.FieldName === name) {
                        if (item.Type === 'checkbox') {
                            return {
                                ...item,
                                Items: item.Items?.map((itemC) => {
                                    if (itemC.FieldName === itemName) {
                                        console.log(itemC);
                                        return {
                                            ...itemC,
                                            Value: Boolean(value),
                                        };
                                    }
                                    return itemC;
                                }),
                            };
                        } else {
                            return {
                                ...item,
                                Value: value,
                            };
                        }
                    }
                    return item;
                });
            const pushedData = [...newData, ...formBaseStateField.filter((item) => item.group !== grup)];
            setFormBaseStateField(pushedData.sort((a, b) => a.id - b.id));
        } else if (grup === 'JamOps') {
            const newJamOps = formJamOpsField.map((item) => {
                if (item.hasOwnProperty(name) && item.Hari === itemName) {
                    return {
                        ...item,
                        [name]: value,
                    };
                }
                return item;
            });
            setFormJamOpsField(newJamOps);
        }
    };
    const dialogClose = () => {
        onClose();
    };
    return (
        <DialogComponent
            id="dialogCustomer"
            isModal={true}
            width="95%"
            height="100%"
            visible={isOpen}
            close={dialogClose}
            header={title.toString()}
            showCloseIcon={true}
            target="#main-target"
            closeOnEscape={false}
            footerTemplate={footerTemplateDlg}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            enableResize={true}
        >
            {showLoader && contentLoader()}
            <div>
                <div className="grid grid-cols-12 gap-2">
                    <div className={`panel-tabel ${state === 'new' && formBaseStateField[8].Value === false ? 'col-span-10' : 'col-span-full'}`} style={{ width: '100%' }}>
                        <table className={stylesHeader.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '20%' }}>No. Register</th>
                                    <th style={{ width: '50%' }}>Nama</th>
                                    <th style={{ width: '30%' }}>No. Customer</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {formBaseStateField
                                        .filter((item) => item.Visible && item.Type !== 'checkbox' && item.TabId == 0)
                                        .map((item: FieldProps, index) => (
                                            <td key={index}>
                                                {item.IsAction ? (
                                                    <div className="flex">
                                                        <div className="container form-input" style={{ border: 'none' }}>
                                                            <TextBoxComponent
                                                                id={item.FieldName}
                                                                className={`${stylesHeader.inputTableBasic}`}
                                                                style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                value={item.Value?.toString()}
                                                                readOnly={item.ReadOnly}
                                                                onBlur={(event: any) => {}}
                                                            />
                                                        </div>
                                                        <div>
                                                            <button
                                                                className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                onClick={() => {
                                                                    // actionsHandler(item.name);
                                                                }}
                                                                style={{
                                                                    height: 28,
                                                                    background: 'white',
                                                                    borderColor: 'white',
                                                                }}
                                                            >
                                                                {item.IsAction && (
                                                                    <FontAwesomeIcon
                                                                        icon={item.FieldName === 'nama_relasi' ? faMagnifyingGlass : faBarcode}
                                                                        className="ml-2"
                                                                        width="15"
                                                                        height="15"
                                                                        style={{ margin: '7px 2px 0px 6px' }}
                                                                    />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="container form-input" style={{ border: 'none' }}>
                                                        <TextBoxComponent
                                                            id={item.FieldName}
                                                            className={`${stylesHeader.inputTableBasic}`}
                                                            style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                            value={item.Value?.toString()}
                                                            readOnly={item.ReadOnly}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {state === 'new' && formBaseStateField[8].Value === false && (
                        <div className="col-span-2 flex items-center justify-center rounded-lg bg-[#80FFFF]">
                            <div className="text-sm font-bold text-[#000000]">
                                <p>NEW OPEN OUTLET</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="ml-2 mt-2 flex items-start justify-start gap-12">
                    {formBaseStateField
                        .filter((item: FieldProps) => item.Type === 'checkbox' && item.TabId == 0)
                        .map((item, index) => (
                            <CheckboxCustomerCustom
                                isRed={true}
                                name={item.FieldName + index}
                                key={item.FieldName + index}
                                id={item.FieldName + index}
                                label={item.Label}
                                checked={Boolean(item.Value)}
                                change={(event: any) => {
                                    handleChange(item.FieldName, event.target.checked, item.group);
                                }}
                            />
                        ))}
                </div>
                <div>
                    <Tab.Group defaultIndex={0}>
                        <Tab.List className="mt-3 flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                            {customerTab.map((item: { id: number; name: string }) => (
                                <Tab key={item.id} as={React.Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={`${selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'}
                                                        -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                            id={`tab-${item.id}`}
                                        >
                                            {item.name}
                                        </button>
                                    )}
                                </Tab>
                            ))}
                        </Tab.List>
                        <Tab.Panels className="w-full flex-1 border border-t-0 border-white-light bg-[#f8f7ff]  p-2 text-sm dark:border-[#191e3a]">
                            {customerTab.map((item: { id: number; name: string }) => (
                                <Tab.Panel key={item.id} className={'h-[450px] overflow-auto'}>
                                    {item.id == 1 ? (
                                        <InfoPerusahaan
                                            Field={formBaseStateField.filter((item: FieldProps) => item.TabId == 1)}
                                            handleChange={handleChange}
                                            onRenderDayCell={onRenderDayCell}
                                            gridRef={(gridJamOps: GridComponent) => (gridJamOPSType = gridJamOps as GridComponent)}
                                            OpsField={formJamOpsField}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </DialogComponent>
    );
};

export default NewEditDialog;
