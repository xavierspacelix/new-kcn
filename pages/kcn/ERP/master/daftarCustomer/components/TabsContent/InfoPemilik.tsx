import React from 'react';
import { FieldProps, onRenderDayCell } from '../../functions/definition';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { diHubunginArray, jenisKelaminArray, statusPerkawinanArray, statusRumah } from '../Template';
import { myAlertGlobal } from '@/utils/routines';
import DialogRelasi from '../../../daftarRelasi/component/DialogRelasi';

type ParamsType = {
    userid: string;
    kode_cust: string;
    kode_relasi?: string;
    entitas: string;
    token: string;
    provinsiArray: { label: string; value: string }[];
    kotaArray: { label: string; value: string }[];
    kecamatanArray: { label: string; value: string }[];
    kelurahanArray: { label: string; value: string }[];
    negaraArray: { label: string; value: string }[];
};
interface InfoPemilikProps {
    Field: FieldProps[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
    params: ParamsType;
    state: string;
    setStatus: any;
}
const InfoPemilik = ({ Field, handleChange, params, state, setStatus }: InfoPemilikProps) => {
    const [isEdit, setIsEdit] = React.useState(false);
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
                        }}
                        content="Update"
                        disabled={params?.kode_relasi === ''}
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
                                        <div className={`form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                            <TextBoxComponent
                                                id={item.FieldName + index}
                                                value={String(item.Value)}
                                                onChange={(event: any) => {
                                                    handleChange(item.FieldName, event.target.value, item.group);
                                                }}
                                                readOnly={item.ReadOnly}
                                            />
                                        </div>
                                        {item.IsAction && (
                                            <TooltipComponent
                                                opensOn="Hover"
                                                openDelay={5}
                                                target={'#' + item.FieldName + index}
                                                content={item.FieldName === 'website' ? 'Kunjungi Website' : 'Kirimkan Email'}
                                                position="TopCenter"
                                            >
                                                <ButtonComponent
                                                    onClick={() => isActionHandle(item.FieldName, String(item.Value))}
                                                    id={item.FieldName + index}
                                                    cssClass="e-primary e-small"
                                                    style={{
                                                        width: 'auto',
                                                        backgroundColor: '#e6e6e6',
                                                        color: 'black',
                                                    }}
                                                >
                                                    {item.FieldName === 'website' ? (
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
                            ) : item.Type === 'select' ? (
                                <div key={item.FieldName + index}>
                                    {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                    <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                        <ComboBoxComponent
                                            id={item.FieldName}
                                            fields={{ text: 'label', value: 'value' }}
                                            value={String(item.Value)}
                                            key={item.FieldName}
                                            dataSource={
                                                item.FieldName === 'propinsi_pemilik'
                                                    ? params?.provinsiArray
                                                    : item.FieldName === 'kota_pemilik'
                                                    ? params?.kotaArray
                                                    : item.FieldName === 'kecamatan_pemilik'
                                                    ? params?.kecamatanArray
                                                    : item.FieldName === 'kelurahan_pemilik'
                                                    ? params?.kelurahanArray
                                                    : item.FieldName === 'negara_pemilik'
                                                    ? params?.negaraArray
                                                    : item.FieldName === 'status_rumah'
                                                    ? statusRumah
                                                    : item.FieldName === 'jenis_kelamin'
                                                    ? jenisKelaminArray
                                                    : item.FieldName === 'dikontak'
                                                    ? diHubunginArray
                                                    : item.FieldName === 'status_perkawinan'
                                                    ? statusPerkawinanArray
                                                    : []
                                            }
                                            onChange={(event: any) => {
                                                handleChange(item.FieldName, event.target.value, item.group);
                                            }}
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
                                        />
                                    </div>
                                </div>
                            ) : item.Type === 'date' ? (
                                <div key={item.FieldName + index}>
                                    {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                    <div className="flex flex-col gap-2">
                                        <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                            <DatePickerComponent
                                                id={item.FieldName + index}
                                                value={new Date(String(item.Value))}
                                                name={item.FieldName}
                                                format="dd-MM-yyyy"
                                                renderDayCell={onRenderDayCell}
                                                locale="id"
                                                readOnly={item.ReadOnly}
                                                onChange={(event: any) => {
                                                    handleChange(item.FieldName, event.target.value, item.group);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : item.Type === 'space' ? (
                                <div></div>
                            ) : (
                                <></>
                            )
                        )}
                    </div>
                </div>
            </div>
            {isEdit && (
                <DialogRelasi
                    token={params?.token}
                    userid={params?.userid}
                    kode_entitas={params?.entitas}
                    masterKodeRelasi={params?.kode_relasi ?? ''}
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
