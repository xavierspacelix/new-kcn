import React from 'react';
import { DatePickerComponent, TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ColumnDirective, ColumnsDirective, Edit, GridComponent, Selection, Sort, Inject } from '@syncfusion/ej2-react-grids';
import { CheckboxCustomerCustom, statusTokoArray } from '../Template';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { FieldProps, ItemProps } from '../../functions/definition';
interface InfoPerusahaanType {
    Field: any[];
    OpsField: any[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
    onRenderDayCell: (args: any) => void;
    gridRef: any;
}

const InfoPerusahaan = ({ Field, OpsField, handleChange, onRenderDayCell, gridRef }: InfoPerusahaanType) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const timePickerTemplate = (props: any) => {
        return (
            <TimePickerComponent
                change={(event) => {
                    handleChange(props.column.field, event.text, 'JamOps', props.Hari);
                }}
                locale="id"
                readOnly={!props.Buka}
                name={props.column.field + props.id}
                key={props.column.field + props.id}
                id={props.column.field + props.id}
                value={props}
            />
        );
    };
    const checkBoxTemplate = (props: any) => {
        return (
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={props.Buka}
                    name={props.column.field + props.id}
                    key={props.column.field + props.id}
                    id={props.column.field + props.id}
                    onChange={(event) => {
                        if (event.target.checked) {
                            handleChange(props.column.field, event.target.checked, 'JamOps', props.Hari);
                        } else {
                            handleChange(props.column.field, event.target.checked, 'JamOps', props.Hari);
                            handleChange('JamBuka', event.target.checked, 'JamOps', props.Hari);
                            handleChange('JamTutup', event.target.checked, 'JamOps', props.Hari);
                        }
                    }}
                />
                <span className="e-label">{props.Buka ? 'Buka' : 'Tutup'}</span>
            </div>
        );
    };
    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const textarea = textareaRef.current;
            if (textarea) {
                const adjustHeight = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 20 * 24)}px`; // 20 rows max height
                };

                textarea.addEventListener('input', adjustHeight);
                adjustHeight();

                return () => {
                    textarea.removeEventListener('input', adjustHeight);
                };
            }
        }
    }, [Field]);

    return (
        <div className="active">
            <div className="grid grid-cols-1 gap-2 px-3 md:grid-cols-12">
                <div className="md:col-span-6">
                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                        {Field?.map((item: FieldProps, index: number) =>
                            item.Type === 'date' ? (
                                <div key={item.FieldName + index}>
                                    <span className="e-label font-bold"> {item.Label}</span>
                                    <div className="flex flex-col gap-2">
                                        <div className="container form-input">
                                            <DatePickerComponent
                                                id={item.FieldName + index}
                                                value={item.Value instanceof Date ? item.Value : undefined}
                                                name={item.FieldName}
                                                format="dd-MM-yyyy"
                                                renderDayCell={onRenderDayCell}
                                                readOnly={item.ReadOnly}
                                            />
                                        </div>
                                        {item.FieldName === 'tgl_register' ? (
                                            <span className="text-xs text-[#5EA7FF]">*ditetapkan otomatis pada saat pengisian data customer</span>
                                        ) : item.FieldName === 'tgl_cust' ? (
                                            <span className="text-xs text-[#5EA7FF]">*ditetapkan otomatis pada saat pengisian plafond pertama kalinya</span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            ) : item.Type === 'longString' ? (
                                <div className="col-span-2" key={item.FieldName + index}>
                                    {item.Label && <span className="e-label font-bold">{item.Label}</span>}
                                    <div className="container form-input">
                                        <TextBoxComponent
                                            id={item.FieldName + index}
                                            value={String(item.Value)}
                                            onChange={(event: any) => {
                                                if (!item.ReadOnly) {
                                                    handleChange(item.FieldName, event.target.value, item.group);
                                                }
                                            }}
                                            readOnly={item.ReadOnly}
                                        />
                                    </div>
                                </div>
                            ) : item.Type === 'number' ? (
                                <div key={item.FieldName + index}>
                                    <span className="e-label font-bold">{item.Label}</span>
                                    <div className="container form-input">
                                        <span className="e-input-group e-control-wrapper">
                                            <input
                                                id={item.FieldName + index}
                                                name={item.FieldName}
                                                type="text"
                                                className="e-control e-textbox e-lib e-input"
                                                value={typeof item.Value === 'string' || typeof item.Value === 'number' ? item.Value : ''}
                                                readOnly={item.ReadOnly}
                                                onKeyDown={(event) => {
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
                                                    if (!item.ReadOnly) {
                                                        if (!item.ReadOnly) {
                                                            handleChange(item.FieldName, event.target.value, item.group);
                                                        }
                                                    }
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            ) : item.Type === 'select' ? (
                                <div key={item.FieldName + index}>
                                    <span className="e-label font-bold">{item.Label}</span>
                                    <div className="container form-input">
                                        <ComboBoxComponent
                                            id={item.FieldName}
                                            fields={{ text: 'label', value: 'value' }}
                                            value={typeof item.Value === 'string' ? item.Value : ''}
                                            dataSource={item.FieldName === 'status_toko' ? statusTokoArray : []}
                                            readOnly={item.ReadOnly}
                                            disabled={item.ReadOnly}
                                            onChange={(event: { target: { value: string } }) => {
                                                if (!item.ReadOnly) {
                                                    handleChange(item.FieldName, event.target.value ?? '', item.group);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : item.Type === 'string' ? (
                                <div key={item.FieldName + index}>
                                    <span className="e-label font-bold">{item.Label}</span>
                                    <div className="container form-input">
                                        <TextBoxComponent
                                            id={item.FieldName + index}
                                            name={item.FieldName}
                                            value={String(item.Value)}
                                            onBlur={(event: any) => {
                                                if (!item.ReadOnly) {
                                                    handleChange(item.FieldName, event.target.value, item.group);
                                                }
                                            }}
                                            readOnly={item.ReadOnly}
                                        />
                                    </div>
                                </div>
                            ) : item.Type === 'checkbox' ? (
                                <div className="col-span-2" key={item.FieldName + index}>
                                    {item.Label && <span className="e-label font-bold">{item.Label}</span>}
                                    <div className="grid grid-cols-3 gap-12">
                                        {item?.Items?.map((checkItem: ItemProps, index: number) => (
                                            <CheckboxCustomerCustom
                                                isRed={true}
                                                name={(checkItem.FieldName ?? '') + index}
                                                key={checkItem.FieldName ?? '' + index}
                                                id={checkItem.FieldName ?? '' + index}
                                                label={checkItem.Label ?? ''}
                                                checked={checkItem.Value ?? false}
                                                change={(event: any) => {
                                                    if (!item.ReadOnly) {
                                                        handleChange(item.FieldName, event.target.checked, item.group, checkItem.FieldName);
                                                    }
                                                }}
                                            />
                                        ))}
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
                <div className="md:col-span-6">
                    <div className="flex flex-col">
                        <div>
                            <span className="e-label font-bold">Hari / Jam Operasional</span>
                            <GridComponent
                                selectionSettings={{
                                    mode: 'Row',
                                    type: 'Single',
                                }}
                                id="gridJamOPS"
                                editSettings={{ allowDeleting: true }}
                                allowSorting={true}
                                locale="id"
                                loadingIndicator={{ indicatorType: 'Spinner' }}
                                gridLines={'Both'}
                                dataSource={OpsField}
                                autoFit={true}
                                ref={gridRef}
                                rowHeight={22}
                            >
                                <ColumnsDirective>
                                    <ColumnDirective field="Hari" headerText="Hari" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                    <ColumnDirective field="JamBuka" headerText="Jam Buka" headerTextAlign="Center" template={(props: any) => timePickerTemplate(props)} />
                                    <ColumnDirective
                                        field="JamTutup"
                                        headerText="Jam Tutup"
                                        headerTextAlign="Center"
                                        template={(props: any) => timePickerTemplate(props)}
                                    />
                                    <ColumnDirective
                                        field="Buka"
                                        headerText="Buka / Tutup"
                                        width={100}
                                        headerTextAlign="Center"
                                        // type="checkbox"
                                        template={(props: any) => checkBoxTemplate(props)}
                                    />
                                </ColumnsDirective>
                                <Inject services={[Selection, Sort]} />
                            </GridComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPerusahaan;
