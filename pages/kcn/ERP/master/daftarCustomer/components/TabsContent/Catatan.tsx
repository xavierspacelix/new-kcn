import React from 'react';
import { FieldProps } from '../../functions/definition';
import { ColumnDirective, ColumnsDirective, Edit, GridComponent, Inject } from '@syncfusion/ej2-react-grids';
import { myAlertGlobal } from '@/utils/routines';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
interface CatatanType {
    dataSource: any[];
    Field: any[];
    handleChange: (name: string, value: string | Date | boolean, grup: string, itemName?: string) => void;
}
let grisHistoryPlafond: GridComponent;
const Catatan = ({ Field, handleChange, dataSource }: CatatanType) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const nilaiPlafondColumns: any = [
        {
            field: 'plafond_baru',
            headerText: 'PLAFOND BARU',
            headerTextAlign: 'Center',
            textAlign: 'Left',
            width: 100,
            clipMode: 'EllipsisWithTooltip',
            format: ',0.##;(,0.##);0',
        },
        {
            field: 'plafond_lama',
            headerText: 'PLAFOND LAMA',
            headerTextAlign: 'Center',
            textAlign: 'Left',
            width: 100,
            clipMode: 'EllipsisWithTooltip',
            format: ',0.##;(,0.##);0',
        },
    ];
    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const textarea = textareaRef.current;
            if (textarea) {
                const adjustHeight = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 20 * 20)}px`; // 20 rows max height
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
        <div className="grid grid-cols-1 gap-2 px-3 md:grid-cols-12">
            <div className="md:col-span-7">
                <GridComponent
                    id="gridListData"
                    locale="id"
                    dataSource={dataSource}
                    allowExcelExport={true}
                    ref={(gridHisPlafond: GridComponent) => (grisHistoryPlafond = gridHisPlafond as GridComponent)}
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
                >
                    <ColumnsDirective>
                        <ColumnDirective width={50} field="tgl_update" headerText="TGL. UPDATE" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective width={200} headerText="NILAI PLAFOND" headerTextAlign="Center" textAlign="Center" clipMode="EllipsisWithTooltip" columns={nilaiPlafondColumns} />
                        <ColumnDirective width={50} field="userid" headerText="USER" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                        <ColumnDirective width={200} field="catatan" headerText="CATATAN" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
                    </ColumnsDirective>
                    <Inject services={[Edit]} />
                </GridComponent>
            </div>
            <div className="md:col-span-5">
                {Field?.filter((item: FieldProps) => item.Type === 'textarea')?.map((item: FieldProps, index: number) => (
                    <div key={item.FieldName + index}>
                        <span className="e-label font-bold">{item.Label}</span>
                        <textarea
                            id="ctnTextarea"
                            rows={3}
                            className="form-textarea"
                            ref={textareaRef}
                            value={item.Value ? item.Value.toString() : ''}
                            readOnly={item.ReadOnly}
                            onChange={(e) => handleChange(item.FieldName, e.target.value, item.group)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catatan;
