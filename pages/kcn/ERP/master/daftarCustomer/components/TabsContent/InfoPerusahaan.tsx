import React from 'react';
import { DatePickerComponent, TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ColumnDirective, ColumnsDirective, Edit, GridComponent, Selection, Sort, Inject } from '@syncfusion/ej2-react-grids';
import { CheckboxCustomerCustom } from '../Template';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
interface InfoPerusahaanType {
    iUTab: any[];
    handleChange: (name: string, type: string, value: any, tab: string, hari?: string, itemKey?: string, valueItem?: string) => void;
    onRenderDayCell: (args: any) => void;
    gridRef: any;
}

const InfoPerusahaan = ({ iUTab, handleChange, onRenderDayCell, gridRef }: InfoPerusahaanType) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
    }, [iUTab]);

    const checkBoxTemplate = (props: any, name: string, id: string) => {
        return (
            <CheckboxCustomerCustom
                name={id}
                key={id}
                id={id}
                label={props.buka ? 'Buka' : 'Tutup'}
                checked={props.buka}
                isRed={props.buka}
                change={(event) => {
                    if (event.target.checked) {
                        handleChange(name, 'items', event.target.checked, 'iUTab', props.hari, 'buka');
                    } else {
                        handleChange(name, 'items', event.target.checked, 'iUTab', props.hari, 'buka');
                        handleChange(name, 'items', '', 'iUTab', props.hari, 'jam_buka');
                        handleChange(name, 'items', '', 'iUTab', props.hari, 'jam_tutup');
                    }
                }}
            />
        );
    };
    const timePickerTemplate = (props: any, name: string, id: string, time: string) => {
        return (
            <TimePickerComponent
                change={(event) => {
                    handleChange(name, 'items', event.text, 'iUTab', props.hari, time);
                }}
                locale="id"
                readOnly={!props.buka}
                name={id}
                key={id}
                id={id}
                value={props[time]}
            />
        );
    };
    return (
        <div className="active">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                <div className="md:col-span-6">
                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                        {iUTab
                            .filter((item) => item.group === 'left')
                            .map((field, index) =>
                                field.type === 'date' ? (
                                    <div key={field.name + index}>
                                        <span className="e-label font-bold">{field.label}</span>
                                        <div className="flex flex-col gap-2">
                                            <div className="container form-input">
                                                <DatePickerComponent
                                                    id={field.name + index}
                                                    value={field.value instanceof Date ? field.value : new Date(field.value)}
                                                    name={field.name}
                                                    format="dd-MM-yyyy"
                                                    renderDayCell={onRenderDayCell}
                                                    readOnly={true}
                                                    onChange={(event: any) => {
                                                        handleChange(field.name, 'DateValue', event.value, 'iUTab');
                                                    }}
                                                />
                                            </div>
                                            {field.hint}
                                        </div>
                                    </div>
                                ) : field.type === 'stringAlamat' ? (
                                    <div className="col-span-2" key={field.name + index}>
                                        {field.label && <span className="e-label font-bold">{field.label}</span>}
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                id={field.name + index}
                                                value={typeof field.value === 'string' ? field.value : new Date(field.value).toISOString()}
                                                onChange={(event: any) => {
                                                    handleChange(field.name, 'value', event.target.value, 'iUTab');
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : field.type === 'number' ? (
                                    <div key={field.name + index}>
                                        <span className="e-label font-bold">{field.label}</span>
                                        <div className="container form-input">
                                            <span className="e-input-group e-control-wrapper">
                                                <input
                                                    id={field.name + index}
                                                    name={field.name}
                                                            type="text"
                                                            
                                                    className="e-control e-textbox e-lib e-input"
                                                    value={typeof field.value === 'string' ? field.value : field.value}
                                                    readOnly={field.readonly}
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
                                                        handleChange(field.name, 'value', event.target.value, 'iUTab');
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                ) : field.type === 'string' ? (
                                    <div key={field.name + index}>
                                        <span className="e-label font-bold">{field.label}</span>
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                id={field.name + index}
                                                name={field.name}
                                                value={typeof field.value === 'string' ? field.value : field.value.toISOString()}
                                                onBlur={(event: any) => {
                                                    handleChange(field.name, 'value', event.target.value, 'iUTab');
                                                }}
                                                readOnly={field.readonly}
                                            />
                                        </div>
                                    </div>
                                ) : field.type === 'select' ? (
                                    <div key={field.name + index}>
                                        <span className="e-label font-bold">{field.label}</span>
                                        <div className="container form-input">
                                            <ComboBoxComponent
                                                id={field.name}
                                                fields={{ text: 'label', value: 'value' }}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                                dataSource={field.selection}
                                                onChange={(event: { target: { value: string } }) => {
                                                    handleChange(field.name, 'value', event.target.value, 'iUTab');
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : field.type === 'space' ? (
                                    <div key={field.name + index}></div>
                                ) : field.type === 'stringJenisUsaha' ? (
                                    <div className="col-span-2" key={field.name + index}>
                                        {field.label && <span className="e-label font-bold">{field.label}</span>}
                                        <div className="container form-input">
                                            <TextBoxComponent
                                                id={field.name + index}
                                                value={typeof field.value === 'string' ? field.value : new Date(field.value).toISOString()}
                                                onChange={(event: any) => {
                                                    handleChange(field.name, 'value', event.target.value, 'iUTab');
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : field.type === 'radio' ? (
                                    <div className="col-span-2" key={field.name + index}>
                                        {field.label && <span className="e-label font-bold">{field.label}</span>}
                                        <div className="grid grid-cols-3 gap-12">
                                            {field.selection?.map((selection: any, index: any) => (
                                                <CheckboxCustomerCustom
                                                    isRed={true}
                                                    name={selection.name ?? '' + index}
                                                    key={selection.name ?? '' + index}
                                                    id={selection.name ?? '' + index}
                                                    label={selection.label ?? ''}
                                                    checked={selection.value}
                                                    change={(event: any) => {
                                                        handleChange(field.name, 'selection', event.target.checked, 'iUTab', selection.name ?? '');
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                    </div>
                </div>
                <div className="md:col-span-6">
                    <div className="flex flex-col">
                        {iUTab
                            .filter((item) => item.group === 'right')
                            .map((field, index) =>
                                field.type === 'table' ? (
                                    <div>
                                        <span className="e-label font-bold">Hari / Jam Operasional</span>
                                        <GridComponent
                                            selectionSettings={{
                                                mode: 'Row',
                                                type: 'Single',
                                            }}
                                            key={field.name + index}
                                            id="gridJamOPS"
                                            editSettings={{ allowDeleting: true }}
                                            allowSorting={true}
                                            locale="id"
                                            loadingIndicator={{ indicatorType: 'Spinner' }}
                                            gridLines={'Both'}
                                            dataSource={field.items}
                                            autoFit={true}
                                            ref={gridRef}
                                            rowHeight={22}
                                        >
                                            <ColumnsDirective>
                                                <ColumnDirective field="hari" headerText="Hari" headerTextAlign="Center" clipMode="EllipsisWithTooltip" />
                                                <ColumnDirective
                                                    field="jam_buka"
                                                    headerText="Jam Buka"
                                                    headerTextAlign="Center"
                                                    
                                                    template={(props: any) => timePickerTemplate(props, field.name, index + props.hari + '_jam_buka_' + props.id, 'jam_buka')}
                                                />
                                                <ColumnDirective
                                                    field="jam_tutup"
                                                    headerText="Jam Tutup"
                                                    headerTextAlign="Center"
                                                    
                                                    template={(props: any) => timePickerTemplate(props, field.name, index + props.hari + '_jam_tutup_' + props.id, 'jam_tutup')}
                                                />
                                                <ColumnDirective
                                                    field="buka"
                                                    headerText="Buka / Tutup"
                                                    headerTextAlign="Center"
                                                    
                                                    template={(props: any) => checkBoxTemplate(props, field.name, index + props.hari + '_buka_' + props.id)}
                                                />
                                            </ColumnsDirective>
                                            <Inject services={[Selection, Sort]} />
                                        </GridComponent>
                                    </div>
                                ) : field.type === 'textarea' ? (
                                    <>
                                        <div className="mt-6" key={field.name + index}>
                                            <span className="e-label font-bold">Alasan Blacklist / Open Blacklist / NOO Batal / Tidak Digarap</span>
                                            <textarea id="ctnTextarea" rows={3} className="form-textarea" ref={textareaRef} value={field.value} readOnly={field.disabled} />
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPerusahaan;
