import * as React from 'react';
import { useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import {
    classNames,
    fetchDataCustomer,
    getDataKategori,
    getDataKelompok,
    getDataRegionIndonesia,
    getDataSalesman,
    getDataWilayah,
    onRenderDayCell,
    styleButton,
    tabKlasifikasiArray,
} from './functions/definition';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import './style/sidebar.module.css';
import GridDaftarCustomer from './components/GridDaftarCustomer';
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react';
import { useSession } from '@/pages/api/sessionContext';
import { myAlertGlobal } from '@/utils/routines';
import { loadCldr, L10n, enableRipple } from '@syncfusion/ej2-base';
import idIDLocalization from 'public/syncfusion/locale.json';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';
import { CheckboxCustomerCustom, contentLoader } from './components/Template';
import NewEditDialog from './components/Dialog/NewEdit';
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
L10n.load(idIDLocalization);
enableRipple(true);
const DaftarCustomer = () => {
    // State
    const [showLoader, setShowLoader] = React.useState(false);
    const [isFilterVisible, setIsFilterVisible] = React.useState(true);
    const [customer, setCustomer] = React.useState<any[]>([]);
    const [openDialog, setOpenDialog] = React.useState({
        new: false,
        edit: false,
        detail: false,
    });
    const [dialogParams, setDialogParams] = React.useState({
        kode_cust: '',
        entitas: '',
        token: '',
    });
    const [filter, setFilter] = React.useState([
        {
            name: 'paramNoCustomer',
            placeholder: 'No. Customer',
            value: 'all',
            type: 'text',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramNamaCustomer',
            placeholder: 'Nama Customer',
            value: 'all',
            type: 'text',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramPersonal',
            placeholder: 'Personal',
            value: 'all',
            type: 'text',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramKodeArea',
            placeholder: 'Rayon (Wilayah Penjualan)',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramNamaSales',
            placeholder: 'Sales Man',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramTipe',
            placeholder: 'Tipe',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [
                {
                    label: 'Lokal',
                    value: 'Lokal',
                },
                {
                    label: 'Group',
                    value: 'Group',
                },
            ],
        },
        {
            name: 'paramKategori',
            placeholder: 'Kategori',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramKelompok',
            placeholder: 'Kelompok',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramRks',
            placeholder: 'Rencana Kunjungan',
            value: 'all',
            type: 'radio',
            options: [
                {
                    label: 'YA',
                    value: 'Y',
                },
                {
                    label: 'Tidak',
                    value: 'N',
                },
                {
                    label: 'Semua',
                    value: 'all',
                },
            ],
            visible: true,
            checked: false,
        },
        {
            name: 'paramAktif',
            placeholder: 'Customer Non Aktif',
            value: 'N',
            type: 'radio',
            options: [
                {
                    label: 'YA',
                    value: 'Y',
                },
                {
                    label: 'Tidak',
                    value: 'N',
                },
                {
                    label: 'Semua',
                    value: 'all',
                },
            ],
            visible: true,
            checked: false,
        },
        {
            name: 'paramTglNOO',
            placeholder: 'Tanggal NOO',
            value: '',
            awalValue: new Date(),
            akhirValue: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            type: 'dateRange',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },

        {
            name: 'paramPlafond',
            placeholder: 'Plafon Kredit Sudah Aktif',
            value: 'all',
            type: 'radio',
            options: [
                {
                    label: 'YA',
                    value: 'Y',
                },
                {
                    label: 'Tidak',
                    value: 'N',
                },
                {
                    label: 'Semua',
                    value: 'all',
                },
            ],
            visible: true,
            checked: false,
        },
        {
            name: 'paramBayarTunai',
            placeholder: 'Customer Tunai',
            value: 'all',
            type: 'radio',
            options: [
                {
                    label: 'YA',
                    value: 'Y',
                },
                {
                    label: 'Tidak',
                    value: 'N',
                },
                {
                    label: 'Semua',
                    value: 'all',
                },
            ],
            visible: true,
            checked: false,
        },
        {
            name: 'paramTerimaDokumen',
            placeholder: 'Terima Dokumen Asli (Kantor Pusat)',
            value: 'all',
            type: 'radio',
            options: [
                {
                    label: 'YA',
                    value: 'Y',
                },
                {
                    label: 'Tidak',
                    value: 'N',
                },
                {
                    label: 'Semua',
                    value: 'all',
                },
            ],
            visible: true,
            checked: false,
        },
        {
            name: 'paramPropinsi',
            placeholder: 'Propinsi',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramKota',
            placeholder: 'Kota',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramKecamatan',
            placeholder: 'Kecamatan',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramKelurahan',
            placeholder: 'Kelurahan',
            value: 'all',
            type: 'select',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramNoRekening',
            placeholder: 'No. Rekening',
            value: 'all',
            type: 'text',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramNamaRekening',
            placeholder: 'Nama Rekening',
            value: 'all',
            type: 'text',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramNoWhatsapp',
            placeholder: 'No. Whatsapp',
            value: 'all',
            type: 'text',
            visible: true,
            checked: false,
            options: null,
            selection: [],
        },
        {
            name: 'paramPernahTransaksi',
            placeholder: 'Sudah Pernah Ada Transaksi',
            value: 'all',
            type: 'radio',
            options: [
                {
                    label: 'YA',
                    value: 'Y',
                },
                {
                    label: 'Tidak',
                    value: 'N',
                },
                {
                    label: 'Semua',
                    value: 'all',
                },
            ],
            visible: true,
            checked: false,
        },
    ]);
    // Definition
    let sidebarObj = React.useRef<SidebarComponent>(null);
    let gridCust: GridComponent;
    let btnObj: ButtonComponent;
    const width: string = '290px';
    const mediaQuery: string = '(min-width: 600px)';
    const { sessionData } = useSession();
    const kode_entitas = sessionData?.kode_entitas ?? '';
    const userid = sessionData?.userid ?? '';
    const kode_user = sessionData?.kode_user ?? '';
    const token = sessionData?.token ?? '';
    const fields = { text: 'label', value: 'value' };

    // Function
    const updateFilterOptions = (name: string, options: any, label: string, value: string) => {
        setFilter((prevFilter) =>
            prevFilter.map((item) =>
                item.name === name
                    ? {
                          ...item,
                          selection: options.map((option: any) => {
                              return {
                                  label: option[label],
                                  value: option[value],
                              };
                          }),
                      }
                    : item
            )
        );
    };
    function btnClick(): void {
        if (!isFilterVisible) {
            setIsFilterVisible(true);
            sidebarObj.current!.show();
        } else {
            setIsFilterVisible(false);
            sidebarObj.current!.hide();
        }
    }
    function onCreate(): void {
        sidebarObj.current!.element.style.visibility = '';
        sidebarObj.current!.show();
    }
    function closeClick(): void {
        sidebarObj.current!.hide();
        setIsFilterVisible(false);
    }
    const handleFilterChange = (name: string, key: string, value: any): void => {
        setFilter((prevFilter) =>
            prevFilter.map((filterItem) =>
                filterItem.name === name
                    ? {
                          ...filterItem,
                          [key]: value,
                      }
                    : filterItem
            )
        );
    };
    const fecthInitialDataFilter = async () => {
        try {
            setShowLoader(true);
            handleFilterChange('paramEntitas', 'value', kode_entitas);
            await getDataWilayah(kode_entitas).then((res) => updateFilterOptions('paramKodeArea', res, 'lokasi', 'kode_area'));
            await getDataSalesman(kode_entitas).then((res) => updateFilterOptions('paramNamaSales', res, 'nama_sales', 'kode_sales'));
            await getDataKategori(kode_entitas).then((res) => updateFilterOptions('paramKategori', res, 'grp', 'grp'));
            await getDataKelompok(kode_entitas).then((res) => updateFilterOptions('paramKelompok', res, 'kel', 'kel'));
            await getDataRegionIndonesia(kode_entitas, 'provinsi').then((res) => updateFilterOptions('paramPropinsi', res, 'nama_propinsi', 'nama_propinsi'));
            await getDataRegionIndonesia(kode_entitas, 'kota').then((res) => updateFilterOptions('paramKota', res, 'nama_kota', 'nama_kota'));
            await getDataRegionIndonesia(kode_entitas, 'kecamatan').then((res) => updateFilterOptions('paramKecamatan', res, 'nama_kecamatan', 'nama_kecamatan'));
            await getDataRegionIndonesia(kode_entitas, 'kelurahan').then((res) => updateFilterOptions('paramKelurahan', res, 'nama_kelurahan', 'nama_kelurahan'));
        } catch (error) {
            setShowLoader(false);
            myAlertGlobal('Terjadi Kesalahan Server!', 'main-content', 'warning');
        } finally {
            setShowLoader(false);
        }
    };
    function recordDoubleClickHandle(args: any): void {
        setOpenDialog({ ...openDialog, edit: true });
        setDialogParams({
            ...dialogParams,
            kode_cust: args.rowData?.kode_cust ?? dialogParams?.kode_cust,
        });
    }

    useEffect(() => {
        if (kode_entitas && token) {
            fecthInitialDataFilter();

            fetchDataCustomer(filter, token, kode_entitas, 'all').then((res) => {
                setTimeout(() => {
                    setCustomer(res);
                    setDialogParams({
                        ...dialogParams,
                        entitas: kode_entitas,
                        kode_cust: '',
                        token: token,
                    });
                }, 500);
            });
        }
    }, [kode_entitas, token]);

    return (
        <>
            <div className="main" id="main-target">
                {showLoader && contentLoader()}
                <div id="header" className="mb-2 items-center sm:flex">
                    <TooltipComponent content="Tampilkan filter data" opensOn="Hover" openDelay={1000} target="#btnFilter">
                        <TooltipComponent content="Tambah Data Customer" opensOn="Hover" openDelay={1000} target="#btnBaru">
                            <TooltipComponent content="Edit Data Customer" opensOn="Hover" openDelay={1000} target="#btnEdit">
                                <TooltipComponent content="Hapus Data Customer" opensOn="Hover" openDelay={1000} target="#btnHapus">
                                    <div className="gap-2 sm:flex">
                                        <div className="flex sm:flex-col sm:border-r md:flex-row">
                                            <ButtonComponent
                                                id="btnBaru"
                                                type="submit"
                                                style={styleButton}
                                                className="e-primary e-small"
                                                onClick={() => {
                                                    setOpenDialog({ ...openDialog, new: true });
                                                }}
                                            >
                                                Baru
                                            </ButtonComponent>
                                            <ButtonComponent id="btnEdit" onClick={recordDoubleClickHandle} type="submit" style={styleButton} className="e-primary e-small">
                                                Ubah
                                            </ButtonComponent>
                                            <ButtonComponent id="btnHapus" type="submit" cssClass="e-primary e-small" style={styleButton}>
                                                Hapus
                                            </ButtonComponent>
                                            <ButtonComponent
                                                id="btnFilter"
                                                type="submit"
                                                cssClass="e-primary e-small"
                                                ref={(scope) => {
                                                    btnObj = scope as ButtonComponent;
                                                }}
                                                style={
                                                    isFilterVisible
                                                        ? {
                                                              width: '57px',
                                                              height: '28px',
                                                              marginBottom: '0.5em',
                                                              marginTop: '0.5em',
                                                              marginRight: '0.8em',
                                                          }
                                                        : { ...styleButton, color: 'white' }
                                                }
                                                isToggle={true}
                                                onClick={btnClick}
                                                disabled={isFilterVisible}
                                            >
                                                Filter
                                            </ButtonComponent>
                                        </div>
                                    </div>
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </TooltipComponent>
                    <div className="hidden w-full justify-end sm:flex">
                        <h2 className="bold text-md text-right font-bold">Daftar Customer</h2>
                    </div>
                </div>
                <div id="main-content">
                    <SidebarComponent
                        style={{
                            background: 'rgb(222 222 222 / var(--tw-bg-opacity))',
                            boxShadow: 'none',
                            visibility: 'hidden',
                            padding: '0.5rem',
                        }}
                        id="default-sidebar"
                        className="rounded-none rounded-bl-lg rounded-tl-lg bg-[#dedede]"
                        ref={sidebarObj}
                        width={width}
                        target={'#main-content'}
                        mediaQuery={mediaQuery}
                        created={onCreate}
                        isOpen={true}
                        open={() => setIsFilterVisible(true)}
                        close={() => setIsFilterVisible(false)}
                    >
                        <div className="panel flex h-[71.5vh] flex-col gap-2">
                            <div className="flex h-full flex-col overflow-auto">
                                <div className="pb-2">
                                    <div className="flex items-center text-center">
                                        <button className="absolute right-0 top-0 p-2 text-gray-600 hover:text-gray-900" onClick={closeClick}>
                                            <FontAwesomeIcon icon={faTimes} width="18" height="18" />
                                        </button>
                                        <div className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                {/* prettier-ignore */}
                                                <path
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        d="M22 5.814v.69c0 1.038 0 1.557-.26 1.987-.26.43-.733.697-1.682 1.231l-2.913 1.64c-.636.358-.955.538-1.182.735a2.68 2.68 0 00-.9 1.49c-.063.285-.063.619-.063 1.286v2.67c0 1.909 0 2.863-.668 3.281-.668.418-1.607.05-3.486-.684-.895-.35-1.342-.524-1.594-.879C9 18.907 9 18.451 9 17.542v-2.67c0-.666 0-1-.064-1.285a2.68 2.68 0 00-.898-1.49c-.228-.197-.547-.377-1.183-.735l-2.913-1.64c-.949-.534-1.423-.8-1.682-1.23C2 8.06 2 7.541 2 6.503v-.69"
                                    ></path>
                                                <path
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    d="M22 5.815c0-1.327 0-1.99-.44-2.403C21.122 3 20.415 3 19 3H5c-1.414 0-2.121 0-2.56.412C2 3.824 2 4.488 2 5.815"
                                                    opacity="0.5"
                                                ></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Filtering Data</h3>
                                    </div>
                                </div>
                                <div className="mb-5 h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                                <PerfectScrollbar className="growltr:-mr3.5 ltr:pr3.5 relative mb-5 h-full rtl:-ml-3.5 rtl:pl-3.5">
                                    <div className="flex h-full flex-col gap-6 overflow-auto">
                                        <div className="flex flex-col gap-5 px-2">
                                            {filter
                                                .filter((param) => param.visible)
                                                .map((item, index) =>
                                                    item.type === 'dateRange' ? (
                                                        <div key={index} className="flex flex-col gap-2">
                                                            <CheckboxCustomerCustom
                                                                id={item.name + index}
                                                                label={item.placeholder}
                                                                checked={item.checked}
                                                                isRed={true}
                                                                change={(event: any) => {
                                                                    handleFilterChange(item.name, 'checked', event.target.checked);
                                                                }}
                                                                name={item.name + index}
                                                            />
                                                            <div className="container form-input">
                                                                <DateRangePickerComponent
                                                                    id={item.name}
                                                                    placeholder={item.placeholder}
                                                                    startDate={item.awalValue}
                                                                    format={'dd-MM-yyyy'}
                                                                    endDate={item.akhirValue}
                                                                    showClearButton={false}
                                                                    renderDayCell={onRenderDayCell}
                                                                    onChange={(event: any) => {
                                                                        const [startDate, endDate] = event.target.value;
                                                                        handleFilterChange(item.name, 'awalValue', new Date(startDate));
                                                                        handleFilterChange(item.name, 'akhirValue', new Date(endDate));
                                                                        handleFilterChange(item.name, 'checked', true);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : item.type === 'select' ? (
                                                        <div key={index} className="flex flex-col gap-2">
                                                            <CheckboxCustomerCustom
                                                                isRed={true}
                                                                id={item.name + index}
                                                                label={item.placeholder}
                                                                checked={item.checked}
                                                                change={(event: any) => {
                                                                    handleFilterChange(item.name, 'checked', event.target.checked);
                                                                }}
                                                                name={item.name + index}
                                                            />
                                                            <div className="container form-input">
                                                                <ComboBoxComponent
                                                                    id={item.name}
                                                                    fields={fields}
                                                                    value={item.value === 'all' ? '' : item.value}
                                                                    dataSource={item.selection}
                                                                    placeholder={item.placeholder}
                                                                    onChange={(event: { target: { value: string } }) => {
                                                                        handleFilterChange(item.name, 'value', event.target.value);
                                                                        handleFilterChange(item.name, 'checked', true);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : item.type === 'radio' ? (
                                                        <div key={index} className="flex flex-col gap-2">
                                                            <p className="e-label">{item.placeholder}</p>
                                                            <div className="flex items-center justify-around gap-2">
                                                                {item?.options?.map((option, index) => (
                                                                    <RadioButtonComponent
                                                                        id={item.name + index}
                                                                        key={index}
                                                                        label={option.label}
                                                                        name={item.name}
                                                                        value={option.value}
                                                                        checked={item.value === option.value}
                                                                        onChange={(event: { target: { value: string } }) => {
                                                                            handleFilterChange(item.name, 'value', event.target.value);
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div key={index} className="flex flex-col gap-2">
                                                            <CheckboxCustomerCustom
                                                                id={item.name + index}
                                                                isRed={true}
                                                                label={item.placeholder}
                                                                checked={item.checked}
                                                                change={(event: any) => {
                                                                    handleFilterChange(item.name, 'checked', event.target.checked);
                                                                }}
                                                                name={item.name + index}
                                                            />
                                                            <div className="container form-input">
                                                                <TextBoxComponent
                                                                    id={item.name}
                                                                    placeholder={item.placeholder}
                                                                    value={item.value === 'all' ? '' : item.value}
                                                                    onBlur={(event: any) => {
                                                                        handleFilterChange(item.name, 'value', event.target.value);
                                                                    }}
                                                                    onChange={(event: any) => {
                                                                        if (event.target.value === '') {
                                                                            handleFilterChange(item.name, 'checked', false);
                                                                        } else {
                                                                            handleFilterChange(item.name, 'checked', true);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </PerfectScrollbar>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => fetchDataCustomer(filter, token, kode_entitas, 'all').then((res) => setCustomer(res))}
                                        className="btn mt-2 w-full bg-[#4361EE] text-white"
                                    >
                                        <FontAwesomeIcon icon={faArrowsRotate} className="shrink-0 ltr:mr-2 rtl:ml-2" width="18" height="18" />
                                        Refresh Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SidebarComponent>
                    <div className={`h-[74vh] bg-[#dedede] p-2 ${isFilterVisible ? 'rounded-none rounded-br-lg rounded-tr-lg' : 'rounded-lg'}`}>
                        <div className="panel">
                            <Tab.Group>
                                <Tab.List className="flex space-x-1 overflow-x-auto rounded-xl  p-1">
                                    {tabKlasifikasiArray.map((item) => (
                                        <Tab key={item.kelas} as={React.Fragment}>
                                            {({ selected }) => (
                                                <button
                                                    className={classNames(
                                                        'w-auto whitespace-nowrap px-2 py-1 text-xs font-medium focus:outline-none',
                                                        selected ? 'rounded-t-md border-b-2 border-[#4361EE] bg-blue-200/50 text-blue-600' : 'text-gray-900 hover:border-b-2 hover:border-blue-400'
                                                    )}
                                                    id={item.kelas}
                                                    onClick={async () => {
                                                        const klasifikasiValue = item.kelas === 'Semua' ? 'all' : item.kelas;

                                                        fetchDataCustomer(filter, token, kode_entitas, klasifikasiValue).then((res) => setCustomer(res));
                                                    }}
                                                >
                                                    {item.Klasifikasi}
                                                </button>
                                            )}
                                        </Tab>
                                    ))}
                                </Tab.List>
                                <Tab.Panels>
                                    <GridDaftarCustomer
                                        gridRef={(gridCustomer: GridComponent) => (gridCust = gridCustomer as GridComponent)}
                                        customerData={customer}
                                        recordDoubleClickHandle={recordDoubleClickHandle}
                                        rowSelectedHandle={(args) => setDialogParams({ ...dialogParams, kode_cust: args.data.kode_cust })}
                                    />
                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </div>
                </div>
            </div>
            <NewEditDialog
                isOpen={openDialog.edit || openDialog.new}
                onClose={() => {
                    setOpenDialog({ ...openDialog, edit: false, new: false });
                    setDialogParams({
                        ...dialogParams,
                        kode_cust: '',
                    });
                }}
                params={dialogParams}
                state={openDialog.new ? 'new' : openDialog.edit ? 'edit' : openDialog.detail ? 'detail' : ''}
            />
        </>
    );
};

export default DaftarCustomer;
