import React from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { classNames, onRenderDayCell } from '../../functions/definition';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { myAlertGlobal } from '@/utils/routines';
import DialogRelasi from '../../../daftarRelasi/component/DialogRelasi';
type ParamsType = {
    userid: string;
    kode_cust: string;
    kode_relasi: string;
    entitas: string;
    token: string;
    provinsiArray: { label: string; value: string }[];
    kotaArray: { label: string; value: string }[];
    kecamatanArray: { label: string; value: string }[];
    kelurahanArray: { label: string; value: string }[];
    negaraArray: { label: string; value: string }[];
};

type iPParams = {
    iPTab: any[];
    handleChange: (name: string, type: string, value: any, tab: string, hari?: string, itemKey?: string, valueItem?: string) => void;
    params: ParamsType;
    setStatus: any;
    state: string;
};
const InfoPemilik = ({ iPTab, handleChange, params, state, setStatus }: iPParams) => {
    const isActionHandle = (name: string, url: string) => {
        if (name === 'email') {
            if (url && typeof url === 'string' && url.includes('@')) {
                window.location.href = 'mailto:' + url;
            } else {
                myAlertGlobal('Email tidak valid', 'dialogCustomer', 'error');
            }
        } else {
            if (url && typeof url === 'string') {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    console.warn("URL tidak valid. Menambahkan 'https://'.");
                    url = 'https://' + url;
                }
                window.open(url, '_blank');
            } else {
                myAlertGlobal('Email tidak valid', 'dialogCustomer', 'error');
            }
        }
    };
    const [isEdit, setIsEdit] = React.useState(false);
    return (
        <>
            <div className="grid grid-cols-12 px-3">
                <div className="col-span-1">
                    <ButtonComponent
                        id="btnUpdateDataRelasi"
                        cssClass="e-primary e-small"
                        style={{
                            width: 'auto',
                            backgroundColor: '#e6e6e6',
                            color: 'black',
                        }}
                        onClick={() => {
                            setIsEdit(true);
                            console.log('params', params);
                        }}
                        content="Update"
                        disabled={params.kode_relasi === ''}
                        iconCss="e-icons e-medium e-description"
                    ></ButtonComponent>
                </div>
                <div className="col-span-11">
                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                        {iPTab.map((item, index) =>
                            item.type === 'string' ? (
                                item.name.startsWith('alamat_pemilik') ? (
                                    <div className="col-span-2" key={item.name + index}>
                                        {item.label && <span className="e-label font-bold">{item.label}</span>}
                                        <div className="form-input">
                                            <TextBoxComponent
                                                id={item.name + index}
                                                value={item.value}
                                                onChange={(event: any) => {
                                                    handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div key={item.name + index}>
                                        <span className="e-label font-bold">{item.label}</span>
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                id={item.name + index}
                                                name={item.name}
                                                value={item.value}
                                                onBlur={(event: any) => {
                                                    handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                }}
                                                readOnly={item.readonly}
                                            />
                                        </div>
                                    </div>
                                )
                            ) : item.type === 'select' ? (
                                <div key={item.name + index}>
                                    <span className="e-label font-bold">{item.label}</span>
                                    <div className="container form-input">
                                        <ComboBoxComponent
                                            id={item.name}
                                            fields={{ text: 'label', value: 'value' }}
                                            value={item.value}
                                            key={item.name}
                                            dataSource={
                                                item.name === 'propinsi_pemilik'
                                                    ? params.provinsiArray
                                                    : item.name === 'kota_pemilik'
                                                    ? params.kotaArray
                                                    : item.name === 'kecamatan_pemilik'
                                                    ? params.kecamatanArray
                                                    : item.name === 'kelurahan_pemilik'
                                                    ? params.kelurahanArray
                                                    : item.name === 'negara_pemilik'
                                                    ? params.negaraArray
                                                    : item.selection
                                            }
                                            onChange={(event: { target: { value: string } }) => {
                                                handleChange(item.name, 'value', event.target.value, 'iPTab');
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : item.type === 'number' ? (
                                <div key={item.name + index}>
                                    <span className="e-label font-bold">{item.label}</span>
                                    <div className="container form-input">
                                        <span className="e-input-group e-control-wrapper">
                                            <input
                                                id={item.name + index}
                                                name={item.name}
                                                type="text"
                                                className="e-control e-textbox e-lib e-input"
                                                value={item.value}
                                                readOnly={item.readonly}
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
                                                    handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            ) : item.type.startsWith('ttl') ? (
                                item.name === 'tempat_lahir' ? (
                                    <div key={item.name + index}>
                                        <span className="e-label font-bold">{item.label}</span>
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                id={item.name + index}
                                                name={item.name}
                                                value={item.value}
                                                onBlur={(event: any) => {
                                                    handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                }}
                                                readOnly={item.readonly}
                                            />
                                        </div>
                                    </div>
                                ) : item.name === 'tanggal_lahir' ? (
                                    <div key={item.name + index}>
                                        <span className="e-label font-bold">{item.label}</span>
                                        <div className="flex flex-col gap-2">
                                            <div className="container form-input">
                                                <DatePickerComponent
                                                    id={item.name + index}
                                                    value={new Date(item.value) ?? null}
                                                    name={item.name}
                                                    format="dd-MM-yyyy"
                                                    renderDayCell={onRenderDayCell}
                                                    locale="id"
                                                    readOnly={item.readonly}
                                                    onChange={(event: any) => {
                                                        handleChange(item.name, 'DateValue', event.value, 'iPTab');
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            ) : item.type === 'action' ? (
                                <div key={item.name + index} className="col-span-2 ">
                                    <span className="e-label font-bold">{item.label}</span>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="form-input">
                                            <TextBoxComponent
                                                id={item.name + index}
                                                type={item.name === 'email' ? 'email' : item.name === 'url' ? 'url' : 'text'}
                                                name={item.name}
                                                value={item.value}
                                                onBlur={(event: any) => {
                                                    handleChange(item.name, 'value', event.target.value, 'iPTab');
                                                }}
                                                readOnly={item.readonly}
                                            />
                                        </div>
                                        <TooltipComponent content={item.hint} position="TopCenter">
                                            <ButtonComponent
                                                onClick={() => isActionHandle(item.name, item.value)}
                                                id={item.name + index}
                                                cssClass="e-primary e-small"
                                                style={{
                                                    width: 'auto',
                                                    backgroundColor: '#e6e6e6',
                                                    color: 'black',
                                                }}
                                            >
                                                {item.icon && item.icon({ className: 'w-4 h-4' })}
                                            </ButtonComponent>
                                        </TooltipComponent>
                                    </div>
                                </div>
                            ) : item.type === 'space' ? (
                                <div key={item.name + index}></div>
                            ) : item.type === 'personalString' ? (
                                <div key={item.name + index} className="col-span-2">
                                    <span className="e-label font-bold">{item.label}</span>
                                    <div className="form-input">
                                        <TextBoxComponent
                                            id={item.name + index}
                                            name={item.name}
                                            value={item.value}
                                            onBlur={(event: any) => {
                                                handleChange(item.name, 'value', event.target.value, 'iPTab');
                                            }}
                                            readOnly={item.readonly}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )
                        )}
                    </div>
                </div>
            </div>
            {isEdit && (
                <DialogRelasi
                    token={params.token}
                    userid={params.userid}
                    kode_entitas={params.entitas}
                    masterKodeRelasi={params.kode_relasi}
                    masterDataState={state.toUpperCase()}
                    isOpen={isEdit}
                    target="#dialogCustomer"
                    onClose={() => {
                        setIsEdit(false);
                        setStatus(true);
                    }}
                    onRefresh={undefined}
                />
            )}
        </>
    );
};

export default InfoPemilik;
