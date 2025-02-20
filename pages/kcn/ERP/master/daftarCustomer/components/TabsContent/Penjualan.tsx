import React from 'react';
import { FieldProps, setPlafondFromKelas, swalToast } from '../../functions/definition';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { NumericTextBoxComponent, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { frmNumber, swalDialog } from '@/utils/routines';
import withReactContent from 'sweetalert2-react-content';
import { CheckboxCustomerCustom } from '../Template';
interface PenjualanType {
    Field: FieldProps[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
    dataSourceAkun: any[];
    dataSourceMataUang: any[];
    dataSourceTermin: any[];
    dataSourceWilayah: any[];
    dataSourceSales: any[];
    dataSourcePajak: any[];
    params: {
        entitas: string;
        token: string;
    };
    state: string;
}
const Penjualan = ({ Field, handleChange, dataSourceAkun, dataSourceMataUang, dataSourceTermin, dataSourceWilayah, dataSourceSales, dataSourcePajak, params, state }: PenjualanType) => {
    const [isAmountFocused, setIsAmountFocused] = React.useState('all');
    const hargaDefArray = [
        {
            label: '1. Tunai (Ritel)',
            value: '1',
        },
        {
            label: '2. Kredit (Distributor)',
            value: '2',
        },
        {
            label: '3. Khusus',
            value: '3',
        },
    ];
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
    const setPlafond = async (kelas: string) => {
        await setPlafondFromKelas(params.entitas, kelas, params.token).then((res) => {
            if (res.data) {
                handleChange('plafond_atas', res[0], 'master');
            } else {
                withReactContent(swalToast).fire({
                    icon: 'error',
                    title: '<p style="font-size:12px">Nilai Plafond Tidak Tersedia</p>',
                    width: '100%',
                    target: '#dialogCustomer',
                });
            }
        });
    };
    const onChangeBlockingan = (jenis: string, newValue?: string) => {
        if (jenis === 'rgKelas') {
            const kelasField = Field.find((i) => i.FieldName === 'kelas');
            if (String(kelasField?.Value) !== 'M' && newValue === 'M') {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px">Perubahan klasifikasi customer Batal NOO hanya bisa dilakukan melalui tombol Klasifikasi => Batal NOO di daftar customer</p>',
                    width: '30%',
                    target: '#dialogCustomer',
                    showConfirmButton: true,
                });
                if (state === 'new') {
                    if (kelasField) {
                        kelasField.Value = 'A';
                    }
                }
                return false;
            } else if ((String(kelasField?.Value) !== 'G' && newValue === 'G') || (String(kelasField?.Value) === 'G' && newValue !== 'G')) {
                withReactContent(swalToast).fire({
                    icon: 'warning',
                    title: '<p style="font-size:12px"> Perubahan klasifikasi customer "G" atau Blacklist hanya bisa dilakukan melalui tombol Klasifikasi => Blacklist Customer di daftar customer </p > ',
                    width: '30%',
                    target: '#dialogCustomer',
                    showConfirmButton: true,
                });
                if (state === 'new') {
                    if (kelasField) {
                        kelasField.Value = 'A';
                    }
                }
                return false;
            }
            return true;
        }
    };
    React.useEffect(() => {
        const newArea = dataSourceWilayah.find((rayon: any) => rayon.kode_area === String(Field.find((i) => i.FieldName === 'kode_area')?.Value));
        const inputElement = document.getElementById('KODEAREA');
        if (inputElement) {
            (inputElement as HTMLInputElement).value = newArea?.area ?? '';
        }
    }, []);

    return (
        <div className="active">
            <div className="grid grid-cols-1 gap-2 gap-y-6 px-3 md:grid-cols-12">
                {/* LEFT */}
                <div className="md:col-span-6">
                    <div className="flex flex-col">
                        <div>
                            <span className="e-label font-bold !text-black">Akun, Mata Uang, Termin Pembayaran, DLL</span>
                            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                {Field.filter((itemF: FieldProps) => itemF.group === 'masterLeft').map((item: FieldProps, index: number) =>
                                    item.Type === 'select' ? (
                                        <div key={item.FieldName + index}>
                                            {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                            <div className={`container form-input ${item.Visible ? '' : 'hidden'}`}>
                                                {(item.FieldName === 'kode_termin' || item.FieldName === 'kode_termin2') && state === 'new' ? (
                                                    <TextBoxComponent
                                                        id={item.FieldName + index}
                                                        value={String(item.Value)}
                                                        // onChange={(event: any) => {}}
                                                        readOnly={item.ReadOnly}
                                                    />
                                                ) : (
                                                    <ComboBoxComponent
                                                        id={item.FieldName}
                                                        fields={{ text: 'label', value: 'value' }}
                                                        value={String(item.Value)}
                                                        key={item.FieldName}
                                                        dataSource={
                                                            item.FieldName === 'tipe2' || item.FieldName === 'tipe'
                                                                ? tipe2Array
                                                                : item.FieldName === 'kode_mu'
                                                                ? dataSourceMataUang
                                                                : item.FieldName === 'kode_termin' || item.FieldName === 'kode_termin2'
                                                                ? dataSourceTermin
                                                                : []
                                                        }
                                                        onChange={(event: any) => {
                                                            handleChange(item.FieldName, event.target.value ?? '', item.group);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : item.Type === 'selectKodeAKun' ? (
                                        <div key={item.FieldName + index} className={`col-span-2  ${item.Visible ? '' : 'hidden'}`}>
                                            {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}

                                            <div className="flex items-center justify-center gap-1">
                                                <div className="form-input w-24">
                                                    <TextBoxComponent
                                                        id={item.FieldName + index}
                                                        value={String(Field.find((i) => i.FieldName === 'no_piutang')?.Value)}
                                                        // onChange={(event: any) => {}}
                                                        readOnly={item.ReadOnly}
                                                    />
                                                </div>
                                                <div className={`container form-input ${item.Visible ? '' : 'hidden'}`}>
                                                    <ComboBoxComponent
                                                        id={item.FieldName}
                                                        fields={{
                                                            text: 'nama_akun',
                                                            value: 'kode_akun',
                                                        }}
                                                        value={String(item.Value)}
                                                        key={item.FieldName}
                                                        dataSource={dataSourceAkun}
                                                        onChange={async (event: any) => {
                                                            const newAkun = dataSourceAkun.find((akun: any) => akun.kode_akun === event.target.value);
                                                            handleChange(item.FieldName, event.target.value, item.group);
                                                            const noPiutangField = Field.find((i) => i.FieldName === 'no_piutang');
                                                            if (noPiutangField) {
                                                                noPiutangField.Value = newAkun?.no_akun ?? '';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : item.Type === 'number' ? (
                                        <div key={item.FieldName + index} className={`col-span-2  ${item.Visible ? '' : 'hidden'}`}>
                                            <span className="e-label font-bold">{item.Label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                    <span className="e-input-group e-control-wrapper">
                                                        <input
                                                            id={item.FieldName + index}
                                                            name={item.FieldName}
                                                            className="e-control e-textbox e-lib e-input text-right"
                                                            value={isAmountFocused === item.FieldName ? item.Value.toString() : frmNumber(item.Value)}
                                                            onChange={(e) => handleChange(item.FieldName, e.target.value, item.group)}
                                                            onFocus={() => setIsAmountFocused(item.FieldName)}
                                                            onBlur={() => {
                                                                setIsAmountFocused('all');
                                                                // reCalc(gridDpList, masterData, updateMasterState);
                                                            }}
                                                            onKeyPress={(e) => {
                                                                if (!/^[0-9.]$/.test(e.key) || (e.key === '.' && e.currentTarget.value.includes('.'))) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        />
                                                    </span>
                                                </div>

                                                {item.IsAction && (
                                                    <>
                                                        <p className="text-[#BB6C74]">{'=====>'}</p>
                                                        <div className="flex items-center justify-between ">
                                                            <ButtonComponent
                                                                id="btnHisKunjungan"
                                                                cssClass="e-primary e-small"
                                                                style={{
                                                                    width: 'auto',
                                                                    backgroundColor: '#e6e6e6',
                                                                    color: 'black',
                                                                }}
                                                                onClick={() => setPlafond(String(Field.find((i) => i.FieldName === 'kelas')?.Value))}
                                                                content="Isi Sesuai Klasifikasi"
                                                            ></ButtonComponent>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ) : item.Type === 'checkbox' ? (
                                        <div className="col-span-2" key={item.FieldName + index}>
                                            {item.Label && <span className="e-label font-bold">{item.Label}</span>}
                                            <div className="grid grid-cols-3 gap-12">
                                                <CheckboxCustomerCustom
                                                    isRed={true}
                                                    name={item.FieldName}
                                                    id={item.FieldName ?? '' + index}
                                                    label={'Ya'}
                                                    checked={Boolean(item.Value)}
                                                    change={(event: any) => {
                                                        if (!item.ReadOnly) {
                                                            handleChange(item.FieldName, event.target.checked, item.group);
                                                        }
                                                    }}
                                                />
                                                <CheckboxCustomerCustom
                                                    isRed={true}
                                                    name={item.FieldName}
                                                    id={item.FieldName ?? '' + index}
                                                    label={'Tidak'}
                                                    checked={!Boolean(item.Value)}
                                                    change={(event: any) => {
                                                        if (!item.ReadOnly) {
                                                            handleChange(item.FieldName, !event.target.checked, item.group);
                                                        }
                                                    }}
                                                />
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
                </div>
                {String(Field.find((i) => i.FieldName === 'tipe')?.Value) === 'Grup' && (
                    <div className="md:col-span-6">
                        <div className="flex flex-col">
                            <div>
                                <span className="e-label font-bold !text-black">Transaksi Antar Cabang</span>
                                <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                    {Field.filter((itemF: FieldProps) => itemF.group === 'masterRight').map((item: FieldProps, index: number) =>
                                        item.Type === 'pnACAkun' && item.Visible ? (
                                            <div key={item.FieldName + index} className={`col-span-2  ${item.Visible ? '' : 'hidden'}`}>
                                                {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}

                                                <div className="flex items-center justify-center gap-1">
                                                    <div className="form-input w-24">
                                                        <TextBoxComponent id={item.FieldName + index} value={String(Field.find((i) => i.FieldName === 'no_beban')?.Value)} readOnly={item.ReadOnly} />
                                                    </div>
                                                    <div className={`container form-input ${item.Visible ? '' : 'hidden'}`}>
                                                        <ComboBoxComponent
                                                            id={item.FieldName}
                                                            fields={{
                                                                text: 'nama_akun',
                                                                value: 'kode_akun',
                                                            }}
                                                            value={String(item.Value)}
                                                            key={item.FieldName}
                                                            dataSource={dataSourceAkun}
                                                            onChange={async (event: any) => {
                                                                const newAkun = dataSourceAkun.find((akun: any) => akun.kode_akun === event.target.value);
                                                                handleChange(item.FieldName, event.target.value, item.group);
                                                                const noPiutangField = Field.find((i) => i.FieldName === 'no_piutang');
                                                                if (noPiutangField) {
                                                                    noPiutangField.Value = newAkun.no_akun ?? '';
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : item.Type === 'pnACText' ? (
                                            <div key={item.FieldName + index} className={`col-span-2  ${item.Visible ? '' : 'hidden'}`}>
                                                <span className="e-label font-bold">{item.Label}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`container form-input ${item.ReadOnly && 'bg-[#eee]'}`}>
                                                        <span className="e-input-group e-control-wrapper">
                                                            <input
                                                                id={item.FieldName + index}
                                                                name={item.FieldName}
                                                                className="e-control e-textbox e-lib e-input text-right"
                                                                value={isAmountFocused === item.FieldName ? item.Value.toString() : frmNumber(item.Value)}
                                                                onChange={(e) => handleChange(item.FieldName, e.target.value, item.group)}
                                                                onFocus={() => setIsAmountFocused(item.FieldName)}
                                                                onBlur={() => {
                                                                    setIsAmountFocused('all');
                                                                    // reCalc(gridDpList, masterData, updateMasterState);
                                                                }}
                                                                onKeyPress={(e) => {
                                                                    if (!/^[0-9.]$/.test(e.key) || (e.key === '.' && e.currentTarget.value.includes('.'))) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            />
                                                        </span>
                                                    </div>

                                                    <p className="e-label font-bold">{'%'}</p>
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
                )}

                {/* RIGHT */}
                <div className="md:col-span-6">
                    <div className="flex flex-col">
                        <div>
                            <span className="e-label font-bold !text-black">Penjualan</span>
                            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                {Field.filter((itemF: FieldProps) => itemF.group === 'masterRight').map((item: FieldProps, index: number) =>
                                    item.Type === 'select' ? (
                                        item.FieldName === 'kode_area' ? (
                                            <div key={item.FieldName + index} className="col-span-2">
                                                {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                                <div className={`container form-input flex ${item.Visible ? '' : 'hidden'}`}>
                                                    <div className="w-24">
                                                        <TextBoxComponent id={'KODEAREA'} readOnly={true} value="" />
                                                    </div>
                                                    <ComboBoxComponent
                                                        id={item.FieldName}
                                                        fields={{ text: 'lokasi', value: 'kode_area' }}
                                                        value={dataSourceWilayah.find((rayon: any) => rayon.kode_area === String(item.Value)) ? String(item.Value) : ''}
                                                        key={item.FieldName}
                                                        dataSource={dataSourceWilayah}
                                                        onChange={(event: any) => {
                                                            const newArea = dataSourceWilayah.find((rayon: any) => rayon.kode_area === event.target.value);
                                                            const inputElement = document.getElementById('KODEAREA');
                                                            if (inputElement) {
                                                                (inputElement as HTMLInputElement).value = newArea?.area ?? '';
                                                            }
                                                            handleChange(item.FieldName, event.target.value, item.group);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={item.FieldName + index} className="col-span-2">
                                                {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                                <div className={`container form-input ${item.Visible ? '' : 'hidden'}`}>
                                                    {item.FieldName === 'kode_sales' ? (
                                                        state === 'edit' ? (
                                                            <TextBoxComponent
                                                                id={item.FieldName + index}
                                                                name={item.FieldName}
                                                                value={dataSourceSales.find((sales: any) => sales.kode_sales === String(item.Value))?.nama_sales || ''}
                                                                onBlur={(event: any) => {
                                                                    if (!item.ReadOnly) {
                                                                        handleChange(item.FieldName, event.target.value, item.group);
                                                                    }
                                                                }}
                                                                disabled={true}
                                                                readOnly={true}
                                                            />
                                                        ) : (
                                                            <ComboBoxComponent
                                                                id={item.FieldName}
                                                                fields={{ text: 'nama_sales', value: 'kode_sales' }}
                                                                value={String(item.Value)}
                                                                key={item.FieldName}
                                                                dataSource={dataSourceSales}
                                                                popupHeight="200px"
                                                                popupWidth="300px"
                                                            />
                                                        )
                                                    ) : (
                                                        <ComboBoxComponent
                                                            id={item.FieldName}
                                                            fields={{ text: 'label', value: 'value' }}
                                                            value={String(item.Value)}
                                                            key={item.FieldName}
                                                            readOnly={true}
                                                            disabled={true}
                                                            dataSource={item.FieldName === 'kode_pajak' ? dataSourcePajak : item.FieldName === 'harga_def' ? hargaDefArray : []}
                                                            onChange={(event: any) => {
                                                                handleChange(item.FieldName, event.target.value, item.group);
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    ) : item.Type === 'radioButton' ? (
                                        <div key={item.FieldName + index} className="col-span-2">
                                            {item.Label ? <span className="e-label font-bold">{item.Label}</span> : <span className="e-label font-bold text-[#f8f7ff]">&</span>}
                                            <div className="grid grid-cols-6 gap-2">
                                                {item?.Items?.map((itemI) => (
                                                    <CheckboxCustomerCustom
                                                        isRed={true}
                                                        name={item.FieldName}
                                                        id={itemI.Label}
                                                        label={itemI.Label}
                                                        value={String(itemI.FieldName)}
                                                        checked={itemI.FieldName === item.Value}
                                                        change={(event: any) => {
                                                            const pass = onChangeBlockingan('rgKelas', itemI.FieldName);
                                                            if (pass) {
                                                                handleChange(item.FieldName, event.target.value, item.group);
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : item.Type === 'checkbox' ? (
                                        <div className="col-span-2" key={item.FieldName + index}>
                                            {item.Label && <span className="e-label font-bold">{item.Label}</span>}
                                            <div className="grid grid-cols-3 gap-12">
                                                <CheckboxCustomerCustom
                                                    isRed={true}
                                                    name={item.FieldName}
                                                    id={item.FieldName ?? '' + index}
                                                    label={'Ya'}
                                                    checked={Boolean(item.Value)}
                                                    change={(event: any) => {
                                                        if (!item.ReadOnly) {
                                                            handleChange(item.FieldName, event.target.checked, item.group);
                                                        }
                                                    }}
                                                />
                                                <CheckboxCustomerCustom
                                                    isRed={true}
                                                    name={item.FieldName}
                                                    id={item.FieldName ?? '' + index}
                                                    label={'Tidak'}
                                                    checked={!Boolean(item.Value)}
                                                    change={(event: any) => {
                                                        if (!item.ReadOnly) {
                                                            handleChange(item.FieldName, !event.target.checked, item.group);
                                                        }
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
            </div>
        </div>
    );
};

export default Penjualan;
