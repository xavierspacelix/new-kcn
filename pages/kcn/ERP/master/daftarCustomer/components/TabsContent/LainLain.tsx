import React from 'react';
import { Column, ColumnDirective, ColumnsDirective, commandClick, DialogEditEventArgs, Edit, GridComponent, Inject, Sort, Toolbar } from '@syncfusion/ej2-react-grids';
import { AlamatKirimProps, FieldProps, getMaxId } from '../../functions/definition';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DialogComponent, TooltipComponent } from '@syncfusion/ej2-react-popups';
import { myAlertGlobal } from '@/utils/routines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { initialAlamat } from '../Template';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import moment from 'moment';
type ParamsType = {
    userid: string;
    kode_cust: string;
    kode_relasi?: string;
    entitas: string;
    token: string;
    nama_relasi?: string;
    provinsiArray: { label: string; value: string }[];
    kotaArray: { label: string; value: string }[];
    kecamatanArray: { label: string; value: string }[];
    kelurahanArray: { label: string; value: string }[];
    negaraArray: { label: string; value: string }[];
};
interface LainLainType {
    Field: FieldProps[];
    MapField: any[];
    dsAlamatKirim: any[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
    params: ParamsType;
    state: string;
    setMapField: Function;
    setFormAlamatKirimField: Function;
}
interface AlamatKirimType {
    isOpen: boolean;
    onClose: (args: any) => void;
    initalData: FieldProps[];
    params: ParamsType;
    // setFormAlamatKirimField: Function;
}
let gridFasMap: GridComponent;
const LainLain = ({ Field, handleChange, params, state, dsAlamatKirim, MapField, setMapField, setFormAlamatKirimField }: LainLainType) => {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [templateAlamat, setTemplateAlamat] = React.useState<FieldProps[]>(initialAlamat);
    const onChangeMap = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setMapField((prevMapField: any[]) => prevMapField.map((field) => (field.FieldName === name ? { ...field, Value: value } : field)));
    };
    const openMap = (latitude: any, longitude: any, search?: boolean) => {
        if ((latitude === null && longitude === null && !search) || (latitude === '' && longitude === '' && !search)) {
            myAlertGlobal(`Data Map Tidak Tersedia!`, 'dialogCustomer', 'warning');
        } else if (search) {
            window.open(`https://maps.google.com/maps`, '_blank', '_noreferrer');
        } else {
            window.open(`https://maps.google.com/maps?q=` + latitude + ',' + longitude, '_blank', '_noreferrer');
        }
    };

    const handlePasteLocationClick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const isAlphaInStr = (str: string) => {
                return /[a-zA-Z]/.test(str);
            };
            if (!isAlphaInStr(text)) {
                const position = text.indexOf(',');
                if (position > 0) {
                    const lat = text.substring(0, position).trim();
                    const lon = text.substring(position + 1).trim();
                    const newLatLong = { latitude: lat, longitude: lon };
                    setMapField((prev: any[]) => {
                        return prev.map((item) => {
                            if (newLatLong.hasOwnProperty(item.FieldName)) {
                                return {
                                    ...item,
                                    Value: newLatLong[item.FieldName as keyof typeof newLatLong] ?? '',
                                };
                            }
                            return item;
                        });
                    });
                }
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };

    function commandClick(proses: string) {
        if (params.nama_relasi === '') {
            myAlertGlobal(`Nama Customer Belum diisi.`, 'dialogCustomer', 'warning');
        } else if (proses === 'new') {
            gridFasMap.clearSelection();
            setTemplateAlamat((prev: FieldProps[]) => prev.map((item) => (item.FieldName === 'kode_cust' ? { ...item, Value: params.kode_cust } : item)));
            setOpenDialog(true);
        } else if (proses === 'edit') {
            const data = gridFasMap.getSelectedRecords()[0];
            if (data) {
                setTemplateAlamat((prev: FieldProps[]) => {
                    return prev.map((item) => {
                        if (data.hasOwnProperty(item.FieldName)) {
                            return {
                                ...item,
                                Value: (data as Record<string, any>)[item.FieldName] ?? '',
                            };
                        }
                        return item;
                    });
                });

                setOpenDialog(true);
            } else {
                myAlertGlobal(`Silahkan Memilih Data Yang Akan di Ubah.`, 'dialogCustomer', 'warning');
            }
        } else if (proses === 'delete') {
            const idx = gridFasMap.getSelectedRowIndexes();

            if (idx.length > 0) {
                gridFasMap.deleteRecord();
            } else {
                myAlertGlobal(`Silahkan Memilih Data Yang Akan di Hapus.`, 'dialogCustomer', 'warning');
            }
        } else if (proses === 'primary') {
            const idx = gridFasMap.getSelectedRecords();
            if (idx.length > 0) {
                const newDataSource = dsAlamatKirim.map((address) => ({
                    ...address,
                    utama: (address as any).id_cust === (idx[0] as any).id_cust,
                }));
                setFormAlamatKirimField(newDataSource);
                gridFasMap.refresh();
            } else {
                myAlertGlobal(`Silahkan Memilih Data Yang Akan di Jadikan Alamat Utama.`, 'dialogCustomer', 'warning');
            }
        }
    }
    const saveNewAlamat = (data: AlamatKirimProps) => {
        const isEdit = gridFasMap.getSelectedRowIndexes();
        let s = data?.alamat_kirim1;
        if (data?.alamat_kirim1.trim() !== '') s += '\n';
        s += data?.alamat_kirim2;
        if (data?.alamat_kirim2.trim() !== '') s += '\n';
        if (data?.kecamatan_kirim.trim() !== '') s += 'KEC. ' + data?.kecamatan_kirim.trim();
        if (data?.kelurahan_kirim.trim() !== '') {
            if (data?.kecamatan_kirim.trim() !== '') s += ' ';
            s += 'KEL. ' + data?.kelurahan_kirim.trim();
        }
        if (data?.kecamatan_kirim.trim() !== '' || data?.kelurahan_kirim.trim() !== '') s += '\n';
        if (data?.kota_kirim.trim() !== '') s += data?.kota_kirim.trim();
        if (data?.propinsi_kirim.trim() !== '') {
            if (data?.kota_kirim.trim() !== '') s += ', ';
            s += data?.propinsi_kirim.trim();
        }
        if (data?.negara_kirim.trim() !== '') {
            if (data?.kota_kirim.trim() !== '' || data?.propinsi_kirim.trim() !== '') s += ', ';
            s += data?.negara_kirim.trim();
        }
        if (data?.kodepos_kirim.trim() !== '' && data?.kodepos_kirim.trim() !== '-') {
            if (data?.kota_kirim.trim() !== '' || data?.propinsi_kirim.trim() !== '' || data?.negara_kirim.trim() !== '') s += '\n';
            s += 'KODEPOS ' + data?.kodepos_kirim.trim();
        }
        if (isEdit.length > 0) {
            const newObject = {
                ...data,
                utama: (gridFasMap.dataSource as any[]).length > 0 ? false : true,
                userid: params.userid,
                tgl_update: moment().format('YYYY-MM-DD'),
                alamat_lengkap: s,
            };
            dsAlamatKirim[isEdit[0]] = newObject;
            gridFasMap.refresh();
        } else {
            const newID = getMaxId(dsAlamatKirim);
            const newObject = {
                ...data,
                id_cust: (newID ?? 0) + 1,
                utama: dsAlamatKirim.length > 0 ? false : true,
                userid: params.userid,
                tgl_update: moment().format('YYYY-MM-DD'),
                alamat_lengkap: s,
            };
            dsAlamatKirim.push(newObject);
            gridFasMap.refresh();
        }
    };
    return (
        <div className="active">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                <div className="md:col-span-7">
                    <div className="flex flex-col">
                        <div>
                            <span className="e-label font-bold !text-black">Alamat Pengiriman Utama</span>
                            <div className="mt-3 grid grid-cols-12 gap-3">
                                <div className="col-span-1">
                                    <ButtonComponent
                                        id="btnAlamatPengirimanUtama"
                                        cssClass="e-primary e-small"
                                        style={{
                                            width: 'auto',
                                            backgroundColor: '#e6e6e6',
                                            color: 'black',
                                        }}
                                        onClick={() => {}}
                                        iconCss="e-icons e-medium e-description"
                                    />
                                </div>
                                <div className="col-span-11">
                                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                        {Field?.map((item: FieldProps, index: number) =>
                                            item.Type === 'longString' ? (
                                                <div className="col-span-2" key={item.FieldName + index}>
                                                    {item.Label && <span className="e-label font-bold">{item.Label}</span>}
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                            <TextBoxComponent
                                                                id={item.FieldName + index}
                                                                value={String(item.Value)}
                                                                onChange={(event: any) => {
                                                                    handleChange(item.FieldName, event.target.value, item.group);
                                                                }}
                                                                readOnly={item.ReadOnly}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : item.Type === 'string' ? (
                                                <div key={item.FieldName + index}>
                                                    <span className="e-label font-bold">{item.Label}</span>
                                                    <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                        <TextBoxComponent
                                                            id={item.FieldName + index}
                                                            name={item.FieldName}
                                                            value={String(item.Value)}
                                                            onBlur={(event: any) => {
                                                                handleChange(item.FieldName, event.target.value, item.group);
                                                            }}
                                                            readOnly={item.ReadOnly}
                                                            disabled={item.ReadOnly}
                                                        />
                                                    </div>
                                                </div>
                                            ) : item.Type === 'number' ? (
                                                <div key={item.FieldName + index}>
                                                    <span className="e-label font-bold">{item.Label}</span>
                                                    <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                        <span className="e-input-group e-control-wrapper">
                                                            <input
                                                                id={item.FieldName + index}
                                                                name={item.FieldName}
                                                                type="text"
                                                                className="e-control e-textbox e-lib e-input"
                                                                value={String(item.Value)}
                                                                readOnly={item.ReadOnly}
                                                                onKeyDown={(event: any) => {
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
                                                                onChange={(event: any) => {
                                                                    handleChange(item.FieldName, event.target.value, item.group);
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <></>
                                            )
                                        )}
                                    </div>
                                    <div className="mt-3 ">
                                        <span className="e-label font-bold !text-black">Letak geografis alamat pengiriman :</span>
                                        <div className="flex items-start justify-start gap-2">
                                            {Field?.filter((item) => item.Type === 'GeoLat').map((item: FieldProps, index: number) => (
                                                <div className="w-[450px]" key={item.FieldName + index}>
                                                    <span className="e-label font-bold">{item.Label}</span>
                                                    <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                        <TextBoxComponent
                                                            id={item.FieldName + index}
                                                            name={item.FieldName}
                                                            value={String(item.Value)}
                                                            onBlur={(event: any) => {
                                                                handleChange(item.FieldName, event.target.value, item.group);
                                                            }}
                                                            readOnly={item.ReadOnly}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="col-span-2 mt-1 flex flex-col justify-start">
                                                <span className="e-label font-bold text-[#f8f7ff]">&</span>
                                                <TooltipComponent opensOn="Hover" openDelay={5} content={'Tampilkan peta lokasi'} target="#btnGeoLat" position="TopCenter">
                                                    <ButtonComponent
                                                        id="btnGeoLat"
                                                        cssClass="e-primary e-small"
                                                        style={{
                                                            width: 'auto',
                                                            backgroundColor: '#e6e6e6',
                                                            color: 'black',
                                                        }}
                                                        onClick={() => {
                                                            openMap(Field.find((i) => i.FieldName === 'lat_kirim')?.Value, Field.find((i) => i.FieldName === 'long_kirim')?.Value, false);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            className="lucide lucide-earth"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54M7 3.34V5a3 3 0 0 0 3 3 2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path>
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                        </svg>
                                                    </ButtonComponent>
                                                </TooltipComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="e-label font-bold !text-black">Letak Geografis Perusahaan</span>
                            <div className="col-span-12">
                                <div className="mt-3 ">
                                    <div className="flex items-start justify-start gap-2">
                                        {MapField?.filter((item) => item.Visible)?.map((item: any, index: number) => (
                                            <div className="w-[380px]" key={index}>
                                                <span className="e-label font-bold">{item.Label}</span>
                                                <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                    <TextBoxComponent
                                                        id={`${index}`}
                                                        name={item.FieldName}
                                                        value={item.Value}
                                                        onBlur={(event: any) => {
                                                            handleChange(item, event.target.value, item.group);
                                                        }}
                                                        readOnly={item.ReadOnly}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeMap(event)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-span-2 mt-1 flex flex-col justify-start">
                                            <span className="e-label font-bold text-[#f8f7ff]">&</span>
                                            <div className="flex items-center gap-3">
                                                <TooltipComponent opensOn="Hover" openDelay={5} content={'Cari Koordinat'} target="#btnSearchMap" position="TopCenter">
                                                    <ButtonComponent
                                                        id="btnSearchMap"
                                                        cssClass="e-primary e-small"
                                                        style={{
                                                            width: 'auto',
                                                            backgroundColor: '#e6e6e6',
                                                            color: 'black',
                                                        }}
                                                        onClick={() => openMap(null, null, true)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            className="lucide lucide-square-arrow-out-up-right"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6M21 3l-9 9M15 3h6v6"></path>
                                                        </svg>
                                                    </ButtonComponent>
                                                </TooltipComponent>
                                                <TooltipComponent opensOn="Hover" openDelay={5} content={'Paste Koordinat'} target="#btnPasteMap" position="TopCenter">
                                                    <ButtonComponent
                                                        id="btnPasteMap"
                                                        cssClass="e-primary e-small"
                                                        style={{
                                                            width: 'auto',
                                                            backgroundColor: '#e6e6e6',
                                                            color: 'black',
                                                        }}
                                                        onClick={handlePasteLocationClick}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            className="lucide lucide-clipboard-paste"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1"></path>
                                                            <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2m-9 6h10"></path>
                                                            <path d="m17 10 4 4-4 4"></path>
                                                        </svg>
                                                    </ButtonComponent>
                                                </TooltipComponent>
                                                <TooltipComponent opensOn="Hover" openDelay={5} content={'Tampilkan peta lokasi'} target="#btnOpenMap" position="TopCenter">
                                                    <ButtonComponent
                                                        id="btnOpenMap"
                                                        cssClass="e-primary e-small"
                                                        style={{
                                                            width: 'auto',
                                                            backgroundColor: '#e6e6e6',
                                                            color: 'black',
                                                        }}
                                                        onClick={() => {
                                                            openMap(MapField.find((i) => i.FieldName === 'latitude')?.Value, MapField.find((i) => i.FieldName === 'longitude')?.Value, false);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            className="lucide lucide-earth"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54M7 3.34V5a3 3 0 0 0 3 3 2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path>
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                        </svg>
                                                    </ButtonComponent>
                                                </TooltipComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5">
                    <GridComponent
                        id="gridListData"
                        locale="id"
                        dataSource={dsAlamatKirim}
                        allowExcelExport={true}
                        ref={(gridMap: GridComponent) => (gridFasMap = gridMap as GridComponent)}
                        allowPdfExport={true}
                        editSettings={{ allowEditing: false, allowDeleting: true }}
                        selectionSettings={{
                            mode: 'Row',
                            type: 'Single',
                        }}
                        allowSorting={false}
                        allowResizing={false}
                        allowReordering={true}
                        pageSettings={{
                            pageSize: 25,
                            pageCount: 5,
                            pageSizes: ['25', '50', '100', 'All'],
                        }}
                        rowHeight={22}
                        height={'40vh'}
                        gridLines={'Both'}
                        rowSelected={(args) => {
                            // setEditValue(args.data);
                        }}
                        loadingIndicator={{ indicatorType: 'Spinner' }}
                        recordDoubleClick={() => {
                            myAlertGlobal('Untuk Mengedit Data Gunakan Tombol Dibawah Tabel.', 'dialogCustomer', 'warning');
                            gridFasMap.editModule.closeEdit();
                        }}
                    >
                        <ColumnsDirective>
                            <ColumnDirective
                                width={200}
                                field="alamat_lengkap"
                                headerText="Alamat Pengiriman yang Terdaftar"
                                headerTextAlign="Center"
                                textAlign="Left"
                                clipMode="EllipsisWithTooltip"
                            />
                            <ColumnDirective
                                width={50}
                                field="utama"
                                template={(rowData: any) => {
                                    return (
                                        rowData.utama && (
                                            <div className="flex items-center justify-center">
                                                <FontAwesomeIcon icon={faCheck} className="shrink-0 text-green-700 ltr:mr-2 rtl:ml-2" width="16" height="16" />
                                            </div>
                                        )
                                    );
                                }}
                                headerText="Alamat Utama"
                                headerTextAlign="Center"
                                textAlign="Left"
                                clipMode="EllipsisWithTooltip"
                            />
                        </ColumnsDirective>
                        <Inject services={[Edit]} />
                    </GridComponent>
                    <div className="panel-pager mt-3">
                        <TooltipComponent content="Baru" opensOn="Hover" openDelay={5} target="#btnNew">
                            <TooltipComponent content="Ubah" opensOn="Hover" openDelay={5} target="#btnEdit">
                                <TooltipComponent content="Hapus" opensOn="Hover" openDelay={5} target="#btnDelete">
                                    <TooltipComponent content="Jadikan Alamat Utama" opensOn="Hover" openDelay={5} target="#btnUtama">
                                        <div className="flex items-center justify-start gap-3">
                                            <div className="flex">
                                                <ButtonComponent
                                                    id="btnNew"
                                                    type="button"
                                                    cssClass="e-primary e-small"
                                                    iconCss="e-icons e-small e-plus"
                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                    onClick={() => commandClick('new')}
                                                />
                                                <ButtonComponent
                                                    id="btnEdit"
                                                    type="button"
                                                    cssClass="e-warning e-small"
                                                    iconCss="e-icons e-small e-edit"
                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                    onClick={() => commandClick('edit')}
                                                />
                                                <ButtonComponent
                                                    id="btnDelete"
                                                    type="button"
                                                    cssClass="e-danger e-small"
                                                    iconCss="e-icons e-small e-trash"
                                                    style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                    onClick={() => commandClick('delete')}
                                                />
                                                <ButtonComponent
                                                    id="btnUtama"
                                                    type="button"
                                                    cssClass="e-info e-small"
                                                    content="Jadikan Alamat Utama"
                                                    // style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                                    onClick={() => commandClick('primary')}
                                                />
                                            </div>
                                        </div>
                                    </TooltipComponent>
                                </TooltipComponent>
                            </TooltipComponent>
                        </TooltipComponent>
                    </div>
                </div>
            </div>
            {openDialog && params.nama_relasi !== '' && (
                <DialogAddAlamat
                    isOpen={openDialog}
                    onClose={(args) => {
                        setOpenDialog(false);
                        if (args) {
                            console.log('args', args);
                            saveNewAlamat(args);
                            setTemplateAlamat(initialAlamat);
                        }
                    }}
                    initalData={templateAlamat}
                    params={params}
                />
            )}
        </div>
    );
};
const DialogAddAlamat = ({ isOpen, onClose, initalData, params }: AlamatKirimType) => {
    const title = 'Alamat kirim atas ' + params.nama_relasi;
    const onChangeAlamat = (event: any, value: string) => {
        const { name } = event.target;
        initalData.map((item: FieldProps) => {
            if (item.FieldName === name) {
                item.Value = value ?? event.value;
            }
        });
    };
    const handlePasteLocationClick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const isAlphaInStr = (str: string) => {
                return /[a-zA-Z]/.test(str);
            };
            if (!isAlphaInStr(text)) {
                const position = text.indexOf(',');
                if (position > 0) {
                    const lat = text.substring(0, position).trim();
                    const lon = text.substring(position + 1).trim();
                    const fieldLat = initalData.find((i) => i.FieldName === 'lat_kirim');
                    if (fieldLat) {
                        fieldLat.Value = lat;
                    }
                    const fieldLon = initalData.find((i) => i.FieldName === 'long_kirim');
                    if (fieldLon) {
                        fieldLon.Value = lon;
                    }
                }
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };
    const openMap = (latitude: any, longitude: any, search?: boolean) => {
        if ((latitude === null && longitude === null && !search) || (latitude === '' && longitude === '' && !search)) {
            myAlertGlobal(`Data Map Tidak Tersedia!`, 'dialogCustomer', 'warning');
        } else if (search) {
            window.open(`https://maps.google.com/maps`, '_blank', '_noreferrer');
        } else {
            window.open(`https://maps.google.com/maps?q=` + latitude + ',' + longitude, '_blank', '_noreferrer');
        }
    };
    const footerTemplateDlg = () => {
        return (
            <div className="mx-auto flex items-end justify-end">
                <div className="flex">
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            const alamat = initalData
                                .filter((item) => item.Type !== 'space')
                                .reduce((acc: { [key: string]: any }, curr) => {
                                    acc[curr.FieldName] = curr.Value;
                                    return acc;
                                }, {});
                            initalData.map((item: FieldProps) => {
                                item.Value = '';
                            });
                            onClose(alamat);
                        }}
                    >
                        Simpan
                    </div>
                    <div
                        className="e-btn e-danger e-small"
                        onClick={() => {
                            onClose(null);
                        }}
                    >
                        Batal
                    </div>
                </div>
            </div>
        );
    };
    return (
        <DialogComponent
            id="dialogCustomer"
            isModal={true}
            visible={isOpen}
            width={'50%'}
            close={() => {
                onClose(null);
            }}
            header={title.toString()}
            showCloseIcon={true}
            target="#dialogCustomer"
            closeOnEscape={false}
            footerTemplate={footerTemplateDlg}
            allowDragging={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            enableResize={true}
        >
            <div className="grid  grid-cols-12 gap-3 px-3">
                <div className="col-span-1">
                    <ButtonComponent
                        id="btnAlamatPengirimanUtama"
                        cssClass="e-primary e-small"
                        style={{
                            width: 'auto',
                            backgroundColor: '#e6e6e6',
                            color: 'black',
                        }}
                        onClick={() => {}}
                        iconCss="e-icons e-medium e-description"
                    />
                </div>
                <div className="col-span-11">
                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2 ">
                        {initalData
                            ?.filter((item) => item.Visible)
                            .map((item: FieldProps, index: number) =>
                                item.Type === 'longString' ? (
                                    <div className="col-span-2" key={item.FieldName + index}>
                                        {item.Label && <span className="e-label font-bold">{item.Label}</span>}
                                        <div className="flex items-center justify-between gap-3">
                                            <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                <TextBoxComponent
                                                    name={item.FieldName}
                                                    id={item.FieldName + index}
                                                    value={String(item.Value)}
                                                    onChange={(event: any) => {
                                                        onChangeAlamat(event, event.target.value);
                                                    }}
                                                    readOnly={item.ReadOnly}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : item.Type === 'select' ? (
                                    <div key={item.FieldName + index}>
                                        {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                        <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                            <ComboBoxComponent
                                                key={item.FieldName}
                                                name={item.FieldName}
                                                id={item.FieldName}
                                                fields={{ text: 'label', value: 'value' }}
                                                value={String(item.Value)}
                                                dataSource={
                                                    item.FieldName === 'propinsi_kirim'
                                                        ? params?.provinsiArray
                                                        : item.FieldName === 'kota_kirim'
                                                        ? params?.kotaArray
                                                        : item.FieldName === 'kecamatan_kirim'
                                                        ? params?.kecamatanArray
                                                        : item.FieldName === 'kelurahan_kirim'
                                                        ? params?.kelurahanArray
                                                        : item.FieldName === 'negara_kirim'
                                                        ? params?.negaraArray
                                                        : []
                                                }
                                                onChange={(event: any) => {
                                                    onChangeAlamat(event, event.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : item.Type === 'number' ? (
                                    <div key={item.FieldName + index}>
                                        <span className="e-label font-bold">{item.Label}</span>
                                        <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`} key={item.FieldName}>
                                            <span className="e-input-group e-control-wrapper">
                                                <input
                                                    id={item.FieldName + index}
                                                    name={item.FieldName}
                                                    type="text"
                                                    className="e-control e-textbox e-lib e-input"
                                                    value={String(item.Value)}
                                                    readOnly={item.ReadOnly}
                                                    onKeyDown={(event: any) => {
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
                                                    onChange={(event: any) => {
                                                        onChangeAlamat(event, event.target.value);
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
                                )
                            )}
                    </div>
                    <div className="mt-3 ">
                        <span className="e-label font-bold !text-black">Letak geografis alamat pengiriman :</span>
                        <div className="flex items-start justify-start gap-2">
                            {initalData
                                ?.filter((item) => item.Type === 'GeoLat')
                                .map((item: FieldProps, index: number) => (
                                    <div className="w-[450px]" key={item.FieldName + index}>
                                        <span className="e-label font-bold">{item.Label}</span>
                                        <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                            <TextBoxComponent
                                                id={item.FieldName + index}
                                                name={item.FieldName}
                                                value={String(item.Value)}
                                                onBlur={(event: any) => {
                                                    onChangeAlamat(event, event.target.value);
                                                }}
                                                readOnly={item.ReadOnly}
                                            />
                                        </div>
                                    </div>
                                ))}
                            <div className="col-span-2 mt-1 flex flex-col justify-start">
                                <span className="e-label font-bold text-[#f8f7ff]">&</span>
                                <div className="flex items-center gap-3">
                                    <TooltipComponent opensOn="Hover" openDelay={5} content={'Cari Koordinat'} target="#btnSearchMap" position="TopCenter">
                                        <ButtonComponent
                                            id="btnSearchMap"
                                            cssClass="e-primary e-small"
                                            style={{
                                                width: 'auto',
                                                backgroundColor: '#e6e6e6',
                                                color: 'black',
                                            }}
                                            onClick={() => openMap(null, null, true)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="lucide lucide-square-arrow-out-up-right"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6M21 3l-9 9M15 3h6v6"></path>
                                            </svg>
                                        </ButtonComponent>
                                    </TooltipComponent>
                                    <TooltipComponent opensOn="Hover" openDelay={5} content={'Paste Koordinat'} target="#btnPasteMap" position="TopCenter">
                                        <ButtonComponent
                                            id="btnPasteMap"
                                            cssClass="e-primary e-small"
                                            style={{
                                                width: 'auto',
                                                backgroundColor: '#e6e6e6',
                                                color: 'black',
                                            }}
                                            onClick={handlePasteLocationClick}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="lucide lucide-clipboard-paste"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1"></path>
                                                <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2m-9 6h10"></path>
                                                <path d="m17 10 4 4-4 4"></path>
                                            </svg>
                                        </ButtonComponent>
                                    </TooltipComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogComponent>
    );
};
export default LainLain;
