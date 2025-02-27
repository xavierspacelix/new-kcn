import React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { BaseFormField, CheckboxCustomerCustom, contentLoader, dKTabInterface, JamOpsField, MapFields } from '../Template';
import stylesHeader from './customerHeader.module.css';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    AlamatKirimProps,
    convertJamOpsToObject,
    customerTab,
    fetchAkun,
    fetchBank,
    fetchDaftarRelasi,
    fetchInitialValue,
    fetchKategoriKelompok,
    fetchWilayah,
    FieldProps,
    generateNoCust,
    getDataMasterCustomer,
    HisPlafondProps,
    JamOpsProps,
    onRenderDayCell,
    PotensiaProdukProps,
    prepareNewData,
    RekeningBankkProps,
    RelasiProps,
    vtFileProps,
    vtFileTemplate,
} from '../../functions/definition';
import { faBarcode, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react';
import InfoPerusahaan from '../TabsContent/InfoPerusahaan';
import { Grid, GridComponent } from '@syncfusion/ej2-react-grids';
import { FillFromSQL, myAlertGlobal } from '@/utils/routines';
import DaftarKontak from '../TabsContent/DaftarKontak';
import InfoPemilik from '../TabsContent/InfoPemilik';
import SelectRelasiDialog from './SelectRelasiDialog';
import PotentialProduk from '../TabsContent/PotentialProduk';
import RekeningBank from '../TabsContent/RekeningBank';
import LainLain from '../TabsContent/LainLain';
import Penjualan from '../TabsContent/Penjualan';
import moment from 'moment';
import Catatan from '../TabsContent/Catatan';
import FilePendukung from '../TabsContent/FilePendukung';

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
}
let gridJamOPSType: GridComponent;
const NewEditDialog = ({ isOpen, onClose, params, state, setParams }: NewEditProps) => {
    const [status, setStatus] = React.useState(false);
    const [title, setTitle] = React.useState('Customer Baru');
    const [showLoader, setShowLoader] = React.useState(false);
    const [formBaseStateField, setFormBaseStateField] = React.useState<FieldProps[]>(BaseFormField);
    const [formJamOpsField, setFormJamOpsField] = React.useState<JamOpsProps[]>(JamOpsField);
    const [formDKField, setFormDKField] = React.useState<dKTabInterface[]>([]);
    const [formPotensialProdukField, setFormPotensialProdukField] = React.useState<PotensiaProdukProps[]>([]);
    const [formRekeningBankField, setFormRekeningBankField] = React.useState<RekeningBankkProps[]>([]);
    const [formAlamatKirimField, setFormAlamatKirimField] = React.useState<AlamatKirimProps[]>([]);
    const [formFasMapField, setFormFasMapField] = React.useState<any[]>(MapFields);
    const [formHisPlafond, setFormHisPlafond] = React.useState<HisPlafondProps[]>([]);
    const [formVtFile, setFormVtFile] = React.useState<vtFileProps[]>([]);
    const [dsProdukKategori, setDsProdukKategori] = React.useState<any[]>([]);
    const [dsProdukKelompok, setDsProdukKelompok] = React.useState<any[]>([]);
    const [dsAkunPiutang, setDsAkunPiutang] = React.useState<any[]>([]);
    const [dsMataUang, setDsMataUang] = React.useState<any[]>([]);
    const [dsTermin, setDsTermin] = React.useState<any[]>([]);
    const [dsWilayah, setDsWilayah] = React.useState<any[]>([]);
    const [dsSalesman, setDsSalesman] = React.useState<any[]>([]);
    const [dsPajak, setDsPajak] = React.useState<any[]>([]);
    const [selectRelasiDialog, setSelectRelasiDialog] = React.useState(false);
    const [relasiSource, setRelasiSource] = React.useState<RelasiProps[]>([]);

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
                        onClick={() => {
                            console.log(params);
                        }}
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
                            saveDoc();
                        }}
                    >
                        Simpan
                    </div>
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            setFormBaseStateField(BaseFormField);
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
            const newData = formBaseStateField
                .filter((itemF) => itemF.group === grup)
                .map((item) => {
                    if (item.FieldName === name) {
                        if (item.Type === 'checkbox') {
                            return {
                                ...item,
                                Items: item.Items?.map((itemC) => {
                                    if (itemC.FieldName === itemName) {
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
                if (item.Hari === itemName) {
                    if (value === false) {
                        return {
                            ...item,
                            JamBuka: '',
                            JamTutup: '',
                            Buka: value,
                        };
                    } else {
                        return {
                            ...item,
                            [name]: value,
                        };
                    }
                }
                return item;
            });
            setFormJamOpsField(newJamOps);
        } else if (grup === 'masterRight') {
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
        }
    };
    const dialogClose = () => {
        onClose();
        setFormBaseStateField(BaseFormField);
        setFormJamOpsField(formJamOpsField);
    };
    const fetchDetailCustomer = async () => {
        let newData: FieldProps[] = [];
        try {
            setShowLoader(true);
            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'master').then((res) => {
                const tempData = formBaseStateField
                    .filter((item) => item.group.startsWith('master'))
                    .map((itemField) => {
                        return {
                            ...itemField,
                            Value: res[0][itemField.FieldName] ?? '',
                        };
                    });
                newData.push(...tempData);
                setTitle(`Customer : ${res[0].no_cust} - ${res[0].nama_relasi}`);
                setParams({
                    ...params,
                    nama_relasi: res[0]?.nama_relasi,
                });
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'detail').then((res) => {
                if (res.length > 0) {
                    const tempData = formBaseStateField
                        .filter((item) => item.group.startsWith('detail'))
                        .map((itemField) => {
                            if (itemField.Type === 'checkbox') {
                                return {
                                    ...itemField,
                                    Items: itemField.Items?.map((itemC) => {
                                        return {
                                            ...itemC,
                                            Value: Boolean(res[0][itemC.FieldName]),
                                        };
                                    }),
                                };
                            } else {
                                return {
                                    ...itemField,
                                    Value: res[0][itemField.FieldName] ?? '',
                                };
                            }
                        });
                    newData.push(...tempData);
                } else {
                    const tempData = formBaseStateField.filter((item) => item.group.startsWith('detail'));
                    newData.push(...tempData);
                }
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'jam_ops').then((result) => {
                if (result.length > 0) {
                    const operasional: any[] = result
                        .sort((a: any, b: any) => b.id - a.id)
                        .slice(0, 1)
                        .map((item: any) => {
                            return [
                                { id: 1, Hari: 'Senin', JamBuka: item['jam_buka_1'], JamTutup: item['jam_tutup_1'], Buka: item['buka_1'] },
                                { id: 2, Hari: 'Selasa', JamBuka: item['jam_buka_2'], JamTutup: item['jam_tutup_2'], Buka: item['buka_2'] },
                                { id: 3, Hari: 'Rabu', JamBuka: item['jam_buka_3'], JamTutup: item['jam_tutup_3'], Buka: item['buka_3'] },
                                { id: 4, Hari: 'Kamis', JamBuka: item['jam_buka_4'], JamTutup: item['jam_tutup_4'], Buka: item['buka_4'] },
                                { id: 5, Hari: 'Jum`at', JamBuka: item['jam_buka_5'], JamTutup: item['jam_tutup_5'], Buka: item['buka_5'] },
                                { id: 6, Hari: 'Sabtu', JamBuka: item['jam_buka_6'], JamTutup: item['jam_tutup_6'], Buka: item['buka_6'] },
                                { id: 7, Hari: 'Minggu', JamBuka: item['jam_buka_7'], JamTutup: item['jam_tutup_7'], Buka: item['buka_7'] },
                            ];
                        });
                    setFormJamOpsField(operasional[0]);
                    // gridJamOPSType.refresh();
                }
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_relasi ?? '', params?.token, 'person').then((result) => {
                setFormDKField(result);
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_relasi ?? '', params?.token, 'produk_potensial').then((result) => {
                setFormPotensialProdukField(result);
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'fasmap').then((result) => {
                setFormFasMapField((prev: any[]) => {
                    return prev.map((item) => {
                        if (result[0].hasOwnProperty(item.FieldName)) {
                            return {
                                ...item,
                                Value: result[0][item.FieldName] ?? '',
                            };
                        }
                        return item;
                    });
                });
            });

            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'kirim').then((result) => {
                setFormAlamatKirimField(result);
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'hisplafond').then((result) => {
                setFormHisPlafond(result);
            });
            await getDataMasterCustomer(params?.entitas, params?.kode_cust ?? '', params?.token, 'sfc').then((result) => {
                console.log('result', result);
                const newVtFile: vtFileProps[] = [];
                result.map((item: any, index: number) => {
                    const newindex = index + 1;
                    newVtFile.push({
                        ...vtFileTemplate,
                        id: newindex,
                        keterangan: item.description,
                        mandatory: item.fileStatus === 'Y' ? true : false,
                    });
                });
                setFormVtFile(newVtFile);
            });

            await fetchKategoriKelompok(params?.entitas, params?.token).then((result) => {
                setDsProdukKategori(result['kategori']);
                setDsProdukKelompok(result['kelompok']);
            });
            await fetchBank(params?.entitas, params?.token, params?.kode_cust ?? '').then((result) => {
                setFormRekeningBankField(result);
            });

            setFormBaseStateField(newData.sort((a, b) => a.id - b.id));
            setFormFasMapField((prevMapField: any[]) => prevMapField.map((field) => (field.FieldName === 'kode_cust' ? { ...field, Value: params?.kode_cust } : field)));
        } catch (error) {
            console.error(error);
            setShowLoader(false);
            myAlertGlobal(`Terjadi Kesalahan Server! ${error}`, 'dialogCustomer', 'warning');
        } finally {
            setShowLoader(false);
        }
    };
    const fetchInitialData = async () => {
        try {
            setShowLoader(true);
            await fetchAkun(params?.entitas, params?.token).then((result) => {
                setDsAkunPiutang(result);
            });
            await FillFromSQL(params.entitas, 'mu', null, params.token)
                .then((result) => {
                    const newData = result.map((mu: { kode_mu: string }) => {
                        return {
                            label: mu.kode_mu,
                            value: mu.kode_mu,
                        };
                    });
                    setDsMataUang(newData);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await FillFromSQL(params.entitas, 'termin', null, params.token)
                .then((result) => {
                    const newData = result.map((res: { kode_termin: string; nama_termin: string }) => {
                        return {
                            label: res.nama_termin,
                            value: res.kode_termin,
                        };
                    });
                    setDsTermin(newData);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await FillFromSQL(params.entitas, 'salesman', null, params.token)
                .then((result) => {
                    setDsSalesman(result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await FillFromSQL(params.entitas, 'pajak', null, params.token)
                .then((result) => {
                    const newData = result.map((res: { catatan: string; kode_pajak: string }) => {
                        return {
                            label: res.catatan,
                            value: res.kode_pajak,
                        };
                    });
                    setDsPajak(newData);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await fetchWilayah(params?.entitas, params?.token).then((result) => {
                setDsWilayah(result);
            });
        } catch (error) {
            setShowLoader(false);
            myAlertGlobal(`Terjadi Kesalahan Server! ${error}`, 'dialogCustomer', 'warning');
        } finally {
            setShowLoader(false);
        }
    };
    const fetchListRelasi = async () => {
        try {
            await fetchDaftarRelasi(params?.entitas, params?.token).then((result) => {
                setRelasiSource(result);
            });
        } catch (error) {
            myAlertGlobal(`Terjadi Kesalahan Server! ${error}`, 'dialogCustomer', 'warning');
        }
    };
    const actionsHandler = async (actionName: string) => {
        if (actionName === 'nama_relasi') {
            setSelectRelasiDialog(true);
        } else if (actionName === 'no_cust') {
            await generateNoCust(params?.entitas, params?.token).then((result) => {
                setFormBaseStateField((prev) => {
                    return prev.map((item) => {
                        if (item.FieldName === 'no_cust') {
                            return {
                                ...item,
                                Value: result,
                            };
                        }
                        return item;
                    });
                });
            });
        }
    };
    const onSelect = async (args: any) => {
        setParams({
            ...params,
            kode_relasi: args[0]?.kode_relasi,
            nama_relasi: args[0]?.nama_relasi,
        });
        const newDataValue = {
            kode_relasi: args[0]?.kode_relasi,
            nama_relasi: args[0]?.nama_relasi,
            alamat: args[0]?.alamat,
            alamat2: args[0]?.alamat2,
            kodepos: args[0]?.kodepos,
            kelurahan: args[0]?.kelurahan,
            kecamatan: args[0]?.kecamatan,
            kota: args[0]?.kota,
            propinsi: args[0]?.propinsi,
            negara: args[0]?.negara,
            npwp: args[0]?.npwp,
            siup: args[0]?.siup,
            personal: args[0]?.personal,
            ktp: args[0]?.ktp,
            sim: args[0]?.sim,
            telp: args[0]?.telp,
            telp2: args[0]?.telp2,
            hp: args[0]?.hp,
            hp2: args[0]?.hp2,
            fax: args[0]?.fax,
            email: args[0]?.email,
            website: args[0]?.website,
            alamat_kirim1: args[0]?.alamat,
            alamat_kirim2: args[0]?.alamat2,
            kota_kirim: args[0]?.kota,
            propinsi_kirim: args[0]?.propinsi,
            negara_kirim: args[0]?.negara,
        };
        setFormBaseStateField((prev: FieldProps[]) => {
            return prev.map((item) => {
                if (newDataValue.hasOwnProperty(item.FieldName)) {
                    return {
                        ...item,
                        Value: args[0][item.FieldName] ?? '',
                    };
                }
                return item;
            });
        });

        await getDataMasterCustomer(params?.entitas, newDataValue?.kode_relasi ?? '', params?.token, 'person').then((result) => {
            setFormDKField(result);
        });
    };
    const beforeSaveDoc = async () => {
        // Create Object Master
        const master = formBaseStateField
            .filter((item) => item.group.startsWith('master') && item.Type !== 'space')
            .reduce((acc: { [key: string]: any }, curr) => {
                acc[curr.FieldName] = curr.Value;
                return acc;
            }, {});
        const detail = formBaseStateField
            .filter((item) => item.group.startsWith('detail') && item.Type !== 'space')
            .reduce((acc: { [key: string]: any }, curr) => {
                if (curr.FieldName === 'jenis_bayar' || curr.FieldName === 'jenis_order') {
                    if (curr.Items) {
                        curr.Items.forEach((item, index) => {
                            acc[item.FieldName] = item.Value;
                        });
                    }
                } else {
                    acc[curr.FieldName] = curr.Value;
                }
                return acc;
            }, {});

        const jamOps = convertJamOpsToObject(formJamOpsField, master.kode_cust, params?.userid);
        const fasMap = formFasMapField
            .filter((item) => item.Type !== 'space')
            .reduce((acc: { [key: string]: any }, curr) => {
                acc[curr.FieldName] = curr.Value;
                return acc;
            }, {});

        console.log(formAlamatKirimField);
    };
    const saveDoc = async () => {
        try {
            console.log(formBaseStateField);
            await beforeSaveDoc();
        } catch (error) {}
    };

    const quCustNewRecord = async () => {
        await prepareNewData(params?.entitas, params?.token, params?.userid).then((result: { [key: string]: any }) => {
            // MASTER
            setFormBaseStateField((prev: FieldProps[]) => {
                return prev.map((item) => {
                    if (result.hasOwnProperty(item.FieldName)) {
                        return {
                            ...item,
                            Value: result[item.FieldName] ?? '',
                        };
                    }
                    if (item.FieldName === 'jenis_order' || item.FieldName === 'jenis_bayar') {
                        return {
                            ...item,
                            Items: item?.Items?.map((itemC) => {
                                if (result.hasOwnProperty(itemC.FieldName)) {
                                    return {
                                        ...itemC,
                                        Value: result[itemC.FieldName] ?? '',
                                    };
                                }
                                console.log('itemC ', itemC);
                                return itemC;
                            }),
                        };
                    }
                    return item;
                });
            });
        });
    };
    React.useEffect(() => {
        if ((isOpen && state === 'edit') || status) {
            fetchDetailCustomer();
        } else if (isOpen && state === 'new') {
            quCustNewRecord();
        }
        fetchListRelasi();
        fetchInitialData();
    }, [isOpen, status]);
    return (
        <>
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
                <div>
                    {showLoader && contentLoader()}
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
                                                                        actionsHandler(item.FieldName);
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
                        <Tab.Group defaultIndex={1}>
                            <Tab.List className="mt-3 flex max-h-20 w-full flex-wrap border-b border-white-light dark:border-[#191e3a]">
                                {customerTab.map((item: { id: number; name: string }) => (
                                    <Tab key={item.id} as={React.Fragment}>
                                        {({ selected }) => (
                                            <button
                                                className={`${selected ? '!border-white-light !border-b-white font-bold text-gray-900 dark:!border-[#191e3a] dark:!border-b-black' : 'text-gray-400'}
                                                        -mb-[1px] flex items-center border border-transparent p-3.5 py-2 !outline-none transition duration-300 hover:text-danger`}
                                                id={`tab-${item.id}`}
                                            >
                                                {item.id + '. ' + item.name}
                                            </button>
                                        )}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels className={`w-full flex-1 border border-t-0 border-white-light text-sm dark:border-[#191e3a]`}>
                                {customerTab.map((item: { id: number; name: string }) => (
                                    <Tab.Panel key={item.id} className={`h-[450px] overflow-auto  p-2 ${item.id == 8 ? '!bg-white' : 'bg-[#f8f7ff]'}`}>
                                        {item.id == 1 ? (
                                            <InfoPerusahaan
                                                Field={formBaseStateField.filter((item: FieldProps) => item.TabId == 1)}
                                                handleChange={handleChange}
                                                onRenderDayCell={onRenderDayCell}
                                                gridRef={(gridJamOps: GridComponent) => (gridJamOPSType = gridJamOps as GridComponent)}
                                                OpsField={formJamOpsField}
                                            />
                                        ) : item.id == 2 ? (
                                            <InfoPemilik
                                                setStatus={setStatus}
                                                Field={formBaseStateField.filter((item: FieldProps) => item.TabId == 2)}
                                                handleChange={handleChange}
                                                params={params}
                                                state={state}
                                            />
                                        ) : item.id == 3 ? (
                                            <DaftarKontak dataSource={formDKField} params={params} setFormDKField={setFormDKField} />
                                        ) : item.id == 4 ? (
                                            <Penjualan
                                                Field={formBaseStateField.filter((item: FieldProps) => item.TabId == 4)}
                                                handleChange={handleChange}
                                                dataSourceAkun={dsAkunPiutang}
                                                dataSourceMataUang={dsMataUang}
                                                dataSourceTermin={dsTermin}
                                                dataSourceWilayah={dsWilayah}
                                                dataSourceSales={dsSalesman}
                                                dataSourcePajak={dsPajak}
                                                params={{
                                                    entitas: params.entitas,
                                                    token: params.token,
                                                }}
                                                state={state}
                                            />
                                        ) : item.id == 5 ? (
                                            <PotentialProduk
                                                dataSource={formPotensialProdukField}
                                                params={{
                                                    userid: params?.userid,
                                                    kode_cust: params?.kode_cust,
                                                    token: params?.token,
                                                    entitas: params?.entitas,
                                                }}
                                                setFormPotensialProdukField={setFormPotensialProdukField}
                                                dsProdukKategori={dsProdukKategori}
                                                dsProdukKelompok={dsProdukKelompok}
                                            />
                                        ) : item.id == 6 ? (
                                            <LainLain
                                                Field={formBaseStateField.filter((item: FieldProps) => item.TabId == 6)}
                                                handleChange={handleChange}
                                                params={params}
                                                state={state}
                                                MapField={formFasMapField}
                                                setMapField={setFormFasMapField}
                                                dsAlamatKirim={formAlamatKirimField}
                                                setFormAlamatKirimField={setFormAlamatKirimField}
                                            />
                                        ) : item.id == 7 ? (
                                            <Catatan Field={formBaseStateField.filter((item: FieldProps) => item.TabId == 7)} handleChange={handleChange} dataSource={formHisPlafond} />
                                        ) : item.id == 8 ? (
                                            <FilePendukung vtFile={formVtFile} state={state}/>
                                        ) : item.id == 9 ? (
                                            <RekeningBank
                                                dataSource={formRekeningBankField}
                                                params={{
                                                    userid: params?.userid,
                                                    kode_cust: params?.kode_cust,
                                                    token: params?.token,
                                                    entitas: params?.entitas,
                                                }}
                                                setFormRekeningBankField={setFormRekeningBankField}
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
            {selectRelasiDialog && (
                <SelectRelasiDialog
                    isOpen={selectRelasiDialog}
                    onClose={(args): void => {
                        setSelectRelasiDialog(false);
                        onSelect(args);
                    }}
                    params={params}
                    relasiSource={relasiSource}
                    state={state}
                />
            )}
        </>
    );
};

export default NewEditDialog;
