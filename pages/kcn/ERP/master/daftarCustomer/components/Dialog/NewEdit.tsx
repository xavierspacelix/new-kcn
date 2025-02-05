import { DialogComponent } from '@syncfusion/ej2-react-popups';
import React from 'react';
import { customerTab, getDataMasterCustomer, onRenderDayCell } from '../../functions/definition';
import { Tab } from '@headlessui/react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import stylesHeader from './customerHeader.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CheckboxCustomerCustom, contentLoader, defaultValueIuTab, headerFieldValue } from '../Template';
import { Grid, GridComponent } from '@syncfusion/ej2-react-grids';
import { loadCldr, L10n, enableRipple } from '@syncfusion/ej2-base';
import idIDLocalization from 'public/syncfusion/locale.json';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import InfoPerusahaan from '../TabsContent/InfoPerusahaan';
import { myAlertGlobal } from '@/utils/routines';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
enableRipple(true);
interface NewEditProps {
    isOpen: boolean;
    onClose: () => void;
    params: {
        kode_cust: string;
        entitas: string;
        token: string;
    };
    state: string;
}
type TabItem = {
    id: number;
    type: string;
    format: string;
    name: string;
    label: string;
    value: Date | string;
    hint: React.ReactNode | null;
    placeholder: string;
    group: string;
    team: string;
    items?: ItemsData[];
    selection?: SelectionItem[];
    readonly?: boolean;
};
type SelectionItem = {
    name?: string;
    label: string;
    value: string | boolean;
};

type ItemsData = {
    id: number;
    hari: string;
    jam_buka: string;
    jam_tutup: string;
    buka: boolean;
};
let gridJamOPSType: Grid;
const NewEditDialog = ({ isOpen, onClose, params, state }: NewEditProps) => {
    const [title, setTitle] = React.useState('<Customer Baru>');
    const [headerField, setHeaderField] = React.useState(headerFieldValue);
    const [iUTab, setIUTab] = React.useState<TabItem[]>(defaultValueIuTab);
    const [showLoader, setShowLoader] = React.useState(false);

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
                            gridJamOPSType?.refresh();
                        }}
                    >
                        Simpan
                    </div>
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            setHeaderField(headerFieldValue);
                            setIUTab(defaultValueIuTab);
                            dialogClose();
                        }}
                    >
                        Batal
                    </div>
                </div>
            </div>
        );
    };
    function handleChange(name: string, key: string, value: string | boolean, stateName: string, selectionName?: string, itemKey?: string) {
        if (stateName === 'headerField') {
            setHeaderField((prevHeaderField) =>
                prevHeaderField.map((headerItem) =>
                    headerItem.name === name
                        ? {
                              ...headerItem,
                              [key]: value,
                          }
                        : headerItem
                )
            );
        } else if (stateName === 'iUTab') {
            if (key === 'selection') {
                setIUTab((prevIUTab) =>
                    prevIUTab.map((iUTabItem) =>
                        iUTabItem.name === name
                            ? {
                                  ...iUTabItem,
                                  selection: iUTabItem.selection?.map((selItem) =>
                                      selItem.name === selectionName
                                          ? {
                                                ...selItem,
                                                value: value,
                                            }
                                          : selItem
                                  ),
                              }
                            : iUTabItem
                    )
                );
            } else if (key === 'items') {
                setIUTab((prevIUTab) =>
                    prevIUTab.map((iUTabItem) =>
                        iUTabItem.name === name
                            ? {
                                  ...iUTabItem,
                                  items: iUTabItem.items?.map((item) =>
                                      item.hari === selectionName
                                          ? {
                                                ...item,
                                                [itemKey as string]: value,
                                            }
                                          : item
                                  ),
                              }
                            : iUTabItem
                    )
                );
            } else {
                setIUTab((prevIUTab) =>
                    prevIUTab.map((iUTabItem) =>
                        iUTabItem.name === name
                            ? {
                                  ...iUTabItem,
                                  [key]: value,
                              }
                            : iUTabItem
                    )
                );
            }
        }
    }
    const fecthInitialDataCustomer = async () => {
        let MasterDetail: any = [];
        try {
            setShowLoader(true);
            await getDataMasterCustomer(params.entitas, params.kode_cust, params.token, 'master').then((result) => {
                const mappedHeader = headerField
                    .filter((team: any) => team.team === 'master')
                    .map((item: any) => {
                        if (result[0].hasOwnProperty(item.name)) {
                            if (item.type === 'checkbox') {
                                return {
                                    ...item,
                                    checked: result[0][item.name],
                                };
                            } else {
                                return {
                                    ...item,
                                    value: result[0][item.name],
                                };
                            }
                        }
                        return item;
                    });
                setHeaderField(mappedHeader);
                const masterField = iUTab
                    .filter((team: any) => team.team === 'master')
                    .map((item: any) => {
                        if (result[0].hasOwnProperty(item.name)) {
                            return {
                                ...item,
                                value: result[0][item.name] ?? '',
                            };
                        }
                        return item;
                    });
                setTitle(`Customer : ${result[0].no_cust} - ${result[0].nama_relasi}`);
                MasterDetail.push(...masterField);
            });

            await getDataMasterCustomer(params.entitas, params.kode_cust, params.token, 'detail').then((result) => {
                if (result.length > 0) {
                    const mappedDetail = iUTab
                        .filter((team: any) => team.team === 'detail')
                        .map((item: any) => {
                            if (result[0].hasOwnProperty(item.name)) {
                                return {
                                    ...item,
                                    value: result[0][item.name] ?? '',
                                };
                            } else {
                                if (item.type === 'radio') {
                                    item.selection = item.selection.map((itemSel: any) => {
                                        if (result[0].hasOwnProperty(itemSel.name)) {
                                            return {
                                                ...itemSel,
                                                value: result[0][itemSel.name],
                                            };
                                        }
                                        return itemSel;
                                    });

                                    return item;
                                }
                            }
                            return item;
                        });
                    MasterDetail.push(...mappedDetail);
                } else {
                    MasterDetail.push(...defaultValueIuTab.filter((item: any) => item.team === 'detail'));
                }
            });
            await getDataMasterCustomer(params.entitas, params.kode_cust, params.token, 'jam_ops').then((result) => {
                if (result.length > 0) {
                    const operasional: any[] = result.map((item: any) => {
                        return [
                            { id: 1, hari: 'Senin', jam_buka: item['jam_buka_1'], jam_tutup: item['jam_tutup_1'], buka: item['buka_1'] },
                            { id: 2, hari: 'Selasa', jam_buka: item['jam_buka_2'], jam_tutup: item['jam_tutup_2'], buka: item['buka_2'] },
                            { id: 3, hari: 'Rabu', jam_buka: item['jam_buka_3'], jam_tutup: item['jam_tutup_3'], buka: item['buka_3'] },
                            { id: 4, hari: 'Kamis', jam_buka: item['jam_buka_4'], jam_tutup: item['jam_tutup_4'], buka: item['buka_4'] },
                            { id: 5, hari: 'Jum`at', jam_buka: item['jam_buka_5'], jam_tutup: item['jam_tutup_5'], buka: item['buka_5'] },
                            { id: 6, hari: 'Sabtu', jam_buka: item['jam_buka_6'], jam_tutup: item['jam_tutup_6'], buka: item['buka_6'] },
                            { id: 7, hari: 'Minggu', jam_buka: item['jam_buka_7'], jam_tutup: item['jam_tutup_7'], buka: item['buka_7'] },
                        ];
                    });

                    const mappedJamOps = iUTab
                        .filter((item: any) => item.team === 'jam_ops')
                        .map((item: any) => {
                            if (Array.isArray(item.items)) {
                                item.items = operasional[0];
                            }
                            return item;
                        });
                    MasterDetail.push(...mappedJamOps);
                } else {
                    const operasional = [
                        { id: 1, hari: 'Senin', jam_buka: '', jam_tutup: '', buka: false },
                        { id: 2, hari: 'Selasa', jam_buka: '', jam_tutup: '', buka: false },
                        { id: 3, hari: 'Rabu', jam_buka: '', jam_tutup: '', buka: false },
                        { id: 4, hari: 'Kamis', jam_buka: '', jam_tutup: '', buka: false },
                        { id: 5, hari: 'Jum`at', jam_buka: '', jam_tutup: '', buka: false },
                        { id: 6, hari: 'Sabtu', jam_buka: '', jam_tutup: '', buka: false },
                        { id: 7, hari: 'Minggu', jam_buka: '', jam_tutup: '', buka: false },
                    ];
                    const mappedJamOps = iUTab
                        .filter((item: any) => item.team === 'jam_ops')
                        .map((item: any) => {
                            if (Array.isArray(item.items)) {
                                item.items = operasional;
                            }
                            return item;
                        });
                    MasterDetail.push(...mappedJamOps);
                }
            });

            setIUTab(MasterDetail.sort((a: any, b: any) => a.id - b.id));
        } catch (error) {
            setShowLoader(false);
            myAlertGlobal(`Terjadi Kesalahan Server! ${error}`, 'dialogCustomer', 'warning');
        } finally {
            setShowLoader(false);
        }
    };
    const dialogClose = () => {
        onClose();
    };
    React.useEffect(() => {
        if (isOpen) {
            if (state === 'edit') {
                fecthInitialDataCustomer();
            }
        }
    }, [isOpen]);
    return (
        <>
            <DialogComponent
                id="dialogCustomer"
                isModal={true}
                width="95%"
                height="100%"
                visible={isOpen}
                close={dialogClose}
                header={title}
                showCloseIcon={true}
                target="#main-target"
                closeOnEscape={false}
                footerTemplate={footerTemplateDlg}
                allowDragging={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
            >
                <div>
                    {showLoader && contentLoader()}
                    <div className="grid grid-cols-12 gap-2">
                        <div className={`panel-tabel ${state === 'new' && headerField[7].checked === false ? 'col-span-10' : 'col-span-full'}`} style={{ width: '100%' }}>
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
                                        {headerField
                                            .filter((item) => item.type !== 'checkbox')
                                            .map((item: any) => (
                                                <td>
                                                    {item.action.isAction ? (
                                                        <div className="flex">
                                                            <div className="container form-input" style={{ border: 'none' }}>
                                                                <TextBoxComponent
                                                                    id={item.name}
                                                                    className={`${stylesHeader.inputTableBasic}`}
                                                                    style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                    value={item.value?.toString()}
                                                                    readOnly={item.disabled}
                                                                    onBlur={(event: any) => {}}
                                                                />
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className="flex items-center justify-center border border-white-light bg-[#eee] pr-1 font-semibold dark:border-[#17263c] dark:bg-[#1b2e4b] ltr:rounded-r-md ltr:border-l-0 rtl:rounded-l-md rtl:border-r-0"
                                                                    onClick={() => {
                                                                        // setDialogListRelasi(true);
                                                                    }}
                                                                    style={{
                                                                        height: 28,
                                                                        background: 'white',
                                                                        borderColor: 'white',
                                                                    }}
                                                                >
                                                                    {item.action.icon && (
                                                                        <FontAwesomeIcon icon={item.action.icon} className="ml-2" width="15" height="15" style={{ margin: '7px 2px 0px 6px' }} />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="container form-input" style={{ border: 'none' }}>
                                                            <TextBoxComponent
                                                                id={item.name}
                                                                className={`${stylesHeader.inputTableBasic}`}
                                                                style={{ backgroundColor: 'white', borderRadius: '5px' }}
                                                                value={item.value?.toString()}
                                                                readOnly={item.disabled}
                                                            />
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {state === 'new' && headerField[7].checked === false && (
                            <div className="col-span-2 flex items-center justify-center rounded-lg bg-[#80FFFF]">
                                <div className="text-sm font-bold text-[#000000]">
                                    <p>NEW OPEN OUTLET</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="ml-2 mt-2 flex items-start justify-start gap-12">
                        {headerField
                            .filter((item) => item.type === 'checkbox')
                            .map((item, index) => (
                                <CheckboxCustomerCustom
                                    isRed={true}
                                    name={item.name + index}
                                    key={item.name + index}
                                    id={item.name + index}
                                    label={item.placeholder}
                                    checked={item.checked}
                                    change={(event: any) => {
                                        handleChange(item.name, 'checked', event.target.checked, 'headerField');
                                    }}
                                />
                            ))}
                    </div>
                    <div>
                        <Tab.Group defaultIndex={0}>
                            <Tab.List className="mt-3 flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                {customerTab.map((item) => (
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
                            <Tab.Panels className="w-full flex-1 border border-t-0 border-white-light p-2  text-sm dark:border-[#191e3a]">
                                {customerTab.map((item) => (
                                    <Tab.Panel key={item.id} className={'h-[450px] overflow-auto'}>
                                        {item.name === 'Info Perusahaan' ? (
                                            <InfoPerusahaan
                                                iUTab={iUTab}
                                                handleChange={handleChange}
                                                onRenderDayCell={onRenderDayCell}
                                                gridRef={(gridJamOps: GridComponent) => (gridJamOPSType = gridJamOps as GridComponent)}
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
        </>
    );
};

export default NewEditDialog;
