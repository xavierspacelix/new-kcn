import React from 'react';
import { FieldProps } from '../../functions/definition';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
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
interface LainLainType {
    Field: FieldProps[];
    MapField: any[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
    params: ParamsType;
    state: string;
    setMapField: Function;
}
const LainLain = ({ Field, handleChange, params, state, MapField, setMapField }: LainLainType) => {
    console.log(MapField);
    return (
        <div className="active">
            <div className="grid grid-cols-1 gap-2 gap-y-6 px-3 md:grid-cols-12">
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
                                <div className="col-span-10">
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
                                        <div className="flex items-start justify-center gap-2">
                                            {Field?.filter((item) => item.Type === 'GeoLat').map((item: FieldProps, index: number) => (
                                                <div className="w-[400px]" key={item.FieldName + index}>
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
                                                        onClick={() => {}}
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
                            <div className="col-span-10">
                                <div className="mt-3 ">
                                    <div className="flex items-start justify-center gap-2">
                                        {MapField?.filter((item) => item.Visible)?.map((item: any, index: number) => (
                                            <div className="w-[350px]" key={index}>
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
                                                        onClick={() => {}}
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
                                                        onClick={() => {}}
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
                                                        onClick={() => {}}
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
                <div className="col-lg-5"></div>
            </div>
        </div>
    );
};

export default LainLain;
