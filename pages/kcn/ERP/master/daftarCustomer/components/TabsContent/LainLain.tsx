import React from 'react';
import { FieldProps } from '../../functions/definition';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
interface PenjualanType {
    Field: FieldProps[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
}
const Penjualan = ({ Field, handleChange }: PenjualanType) => {
    const tipe2Array = [
        {
            label: 'Lokal',
            value: 'Lokal',
        },
        {
            label: 'Grup',
            value: 'Grup',
        },
    ];

    return (
        <div className="active">
            <div className="grid grid-cols-1 gap-2 px-3 md:grid-cols-12">
                {/* LEFT */}
                <div className="md:col-span-5">
                    <div className="flex flex-col">
                        <div>
                            <span className="e-label font-bold !text-black">Akun, Mata Uang, Termin Pembayaran, DLL</span>
                            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                {Field.map((item: FieldProps, index: number) =>
                                    item.Type === 'select' ? (
                                        <div key={item.FieldName + index}>
                                            {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                            <div className={`container form-input ${item.Visible ? '' : 'hidden'}`}>
                                                <ComboBoxComponent
                                                    id={item.FieldName}
                                                    fields={{ text: 'label', value: 'value' }}
                                                    value={String(item.Value)}
                                                    key={item.FieldName}
                                                    dataSource={tipe2Array}
                                                    onChange={(event: any) => {
                                                        // handleChange(item.FieldName, 'value', event.target.value, 'iPTab');
                                                    }}
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
                </div>
                {/* RIGHT */}
            </div>
        </div>
    );
};

export default Penjualan;
