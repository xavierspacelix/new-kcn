import React, { useEffect, useRef } from 'react';
import {
    Grid,
    GridComponent,
    ColumnDirective,
    ColumnsDirective,
    Inject,
    Page,
    Edit,
    Sort,
    Filter,
    Group,
    Resize,
    Reorder,
    Selection,
    ExcelExport,
    PdfExport,
    rowSelected,
} from '@syncfusion/ej2-react-grids';
import { AggregateColumnsDirective, AggregateDirective, AggregatesDirective, AggregateColumnDirective } from '@syncfusion/ej2-react-grids';
import { Aggregate, EditEventArgs, ToolbarItems, Toolbar } from '@syncfusion/ej2-react-grids';
import { ChangeEventArgs } from '@syncfusion/ej2-react-inputs';
import { ItemType } from '@syncfusion/ej2-react-navigations';

const GridPecahan = ({ setBodyState, gridPecahan, masterState }: { setBodyState: Function; gridPecahan: Grid | any; masterState: string }) => {
    const pecahanData = [
        { pecahan: 100000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 75000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 50000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 20000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 10000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 5000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 2000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 1000, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 500, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 200, kertas: 0, koin: 0, jumlah: 0 },
        { pecahan: 100, kertas: 0, koin: 0, jumlah: 0 },
    ];

    const headerNewLine = (value1: any, value2: any) => (
        <div style={{ textAlign: 'center', lineHeight: '1.5em' }}>
            {value1}
            <div>{value2}</div>
        </div>
    );

    const SpreadNumber = (number: any | number | string) => {
        const temp = parseFloat(parseFloat(number).toFixed(2));
        return temp;
    };

    useEffect(() => {
        if (gridPecahan.current) {
            gridPecahan.current.setProperties({ dataSource: pecahanData });
        }
    }, []);

    const load = (): void => {
        let instance = (document.getElementById('gridListData') as any).ej2_instances[0];
        if (instance) {
            instance.element.addEventListener('mouseup', function (e: any) {
                if ((e.target as HTMLElement).classList.contains('e-rowcell')) {
                    if (instance.isEdit) instance.endEdit();
                    const test = (e.target as any).getAttribute('data-colindex');
                    let index: number = parseInt((e.target as any).getAttribute('Index'));
                    instance.selectRow(index);
                    instance.startEdit();
                    if (test == 2) {
                        document.getElementById('gridListDatakoin')?.focus();
                    }
                }
            });
        }
    };

   

    const calculateTotalCost = (args: any) => {
        const formEle = (gridPecahan.current as any).element.querySelector('form').ej2_instances[0];
        formEle.getInputElement('jumlah').value =
            (parseFloat(formEle.getInputElement('kertas').value) + parseFloat(formEle.getInputElement('koin').value)) * parseFloat(formEle.getInputElement('pecahan').value);
    };

    const kertasParams = { params: { change: calculateTotalCost, showSpinButton: false, min: 0, format: 'N', validatedecimalontype: true, } };
    const koinParams = { params: { change: calculateTotalCost, showSpinButton: false, min: 0,format: 'N',  validatedecimalontype: true, } };

    const handleActionComplete = (args: any) => {
        if (args.requestType === 'save') {
            const totalJumlah: any = gridPecahan.current!.dataSource;
            totalJumlah[args.rowIndex] = args.data;
            const temp = totalJumlah.reduce((total: any, item: any) => {
                return total + parseInt(item.jumlah);
            }, 0);
            setBodyState((oldData: any) => ({
                ...oldData,
                saldo_akhir_fisik: String(temp),
                selisih: String(temp - parseFloat(oldData.saldo_akhir_sistem.replace(/,/g, ''))),
            }));
        }
    };

    const onBlurGridHandle = () => {
        gridPecahan.current!.endEdit();
    };

    const freightRules = { required: true, min: 0,regex: /^[0-9]*$/ };

    const numericParams = {
        params: {
            decimals: 0,
            format: 'N2',
            showClearButton: true,
            showSpinButton: false,
        },
    };

    return (
        <GridComponent
            id="gridListData"
            locale="id"
            // dataSource={pecahanData}
            height={'260'}
            editSettings={{
                allowEditing: masterState === 'BARU' || masterState === 'EDIT',
            }}
            load={load}
            width={'100%'}
            // onBlur={onBlurGridHandle}
            // rowSelected={handleSelect}
            // recordDoubleClick={handleRecordDoubleClick}
            gridLines="Both"
            allowResizing={true}
            actionComplete={handleActionComplete}
            // rowDataBound={rowDataBound}
            ref={gridPecahan}
            rowHeight={22}
        >
            <ColumnsDirective>
                <ColumnDirective
                    field="pecahan"
                    editType="numericedit"
                    edit={numericParams}
                    format="N2"
                    autoFit={true}
                    allowEditing={false}
                    headerText="Pecahan"
                    headerTextAlign="Center"
                    textAlign="Center"
                    width="130"
                    clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective
                    field="kertas"
                    editType="numericedit"
                    width="110"
                    edit={kertasParams}
                    headerTemplate={() => headerNewLine('Kertas', '(qty)')}
                    validationRules={freightRules}
                    format={'N'}
                    headerText="No. Akun"
                    headerTextAlign="Center"
                    textAlign="Right"
                    clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective
                    field="koin"
                    editType="numericedit"
                    width="130"
                    format={'N'}
                    edit={koinParams}
                    headerTemplate={() => headerNewLine('Koin', '(qty)')}
                    headerText="Nama Akun Kas"
                    headerTextAlign="Center"
                    validationRules={freightRules}
                    textAlign="Right"
                    clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective field="jumlah" format="N2" allowEditing={false} headerText="Jumlah" headerTextAlign="Center" textAlign="Right" width="110" clipMode="EllipsisWithTooltip" />
            </ColumnsDirective>
            <Inject services={[Edit, Aggregate]} />
        </GridComponent>
    );
};

export default GridPecahan;
