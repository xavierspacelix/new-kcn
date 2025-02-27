import React from 'react';
import { RekeningBankkProps } from '../../functions/definition';
import { ColumnDirective, ColumnsDirective, Edit, GridComponent, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import moment from 'moment';

interface RekeningBankProps {
    dataSource: RekeningBankkProps[];
    params: {
        userid: string;
        kode_cust: string;
        token: string;
        entitas: string;
    };
    setFormRekeningBankField: React.Dispatch<React.SetStateAction<RekeningBankkProps[]>>;
}
let gridRekeningBankType: GridComponent;
const RekeningBank = ({ dataSource, params, setFormRekeningBankField }: RekeningBankProps) => {
    const editTemplateNamaAkunBank = (args: any) => {
        return (
            <div>
                <TextBoxComponent
                    id="nama_bank"
                    name="nama_bank"
                    className="nama_bank"
                    onChange={(e: any) => {
                        if (gridRekeningBankType.dataSource && Array.isArray(gridRekeningBankType.dataSource)) {
                            gridRekeningBankType.dataSource[args.index] = {
                                ...gridRekeningBankType.dataSource[args.index],
                                nama_bank: e.value,
                            };
                        }
                    }}
                    value={args.nama_bank}
                />
            </div>
        );
    };
    const editTemplateNoRekeningBank = (args: any) => {
        return (
            <div>
                <TextBoxComponent
                    id="no_rekening"
                    name="no_rekening"
                    type="text"
                    className="no_rekening"
                    onChange={(e: any) => {
                        if (gridRekeningBankType.dataSource && Array.isArray(gridRekeningBankType.dataSource)) {
                            gridRekeningBankType.dataSource[args.index] = {
                                ...gridRekeningBankType.dataSource[args.index],
                                no_rekening: e.value,
                            };
                        }
                    }}
                    value={args.no_rekening}
                />
            </div>
        );
    };
    const editTemplateNamaRekeningBank = (args: any) => {
        return (
            <div>
                <TextBoxComponent
                    id="nama_rekening"
                    name="nama_rekening"
                    className="nama_rekening"
                    onChange={(e: any) => {
                        if (gridRekeningBankType.dataSource && Array.isArray(gridRekeningBankType.dataSource)) {
                            gridRekeningBankType.dataSource[args.index] = {
                                ...gridRekeningBankType.dataSource[args.index],
                                nama_rekening: e.value,
                            };
                        }
                    }}
                    value={args.nama_rekening}
                />
            </div>
        );
    };
    const editTemplateAktifRekening = (args: any) => {
        return (
            <DropDownListComponent
                id="aktif"
                name="aktif"
                dataSource={[
                    {
                        aktif: 'Y',
                    },
                    {
                        aktif: 'N',
                    },
                ]}
                fields={{ value: 'aktif', text: 'aktif' }}
                floatLabelType="Never"
                placeholder={args.aktif}
                onChange={(e: any) => {
                    if (gridRekeningBankType?.dataSource && Array.isArray(gridRekeningBankType.dataSource)) {
                        gridRekeningBankType.dataSource[args.index] = {
                            ...gridRekeningBankType.dataSource[args.index],
                            aktif: e.value,
                        };
                    }
                }}
                value={args.aktif}
            />
        );
    };
    const commandClick = (proses: string) => {
        const newData = {
            kode_cust: params?.kode_cust,
            nama_bank: '',
            no_rekening: '',
            nama_rekening: '',
            aktif: 'Y',
            tgl_update: moment().format('YYYY-MM-DD HH:mm:ss'),
            userid: params?.userid.toUpperCase(),
        };
        if (proses === 'new') {
            const totalLine = (gridRekeningBankType.dataSource as RekeningBankProps[]).length;
            gridRekeningBankType.addRecord(newData, totalLine);
            setTimeout(() => {
                gridRekeningBankType.startEdit();
            }, 200);
        } else if (proses === 'edit') {
            gridRekeningBankType.startEdit();
        } else if (proses === 'delete') {
            const selectedRecord = gridRekeningBankType.getSelectedRowIndexes()[0];
            dataSource.splice(selectedRecord, 1);
            gridRekeningBankType.refresh();
        }
    };
    return (
        <>
            <GridComponent
                id="gridPotensial"
                locale="id"
                dataSource={dataSource}
                allowExcelExport={true}
                ref={(gridDK: GridComponent) => (gridRekeningBankType = gridDK as GridComponent)}
                editSettings={{ allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Normal', newRowPosition: 'Bottom' }}
                selectionSettings={{
                    type: 'Single',
                }}
                allowSorting={true}
                rowHeight={22}
                height={'40vh'}
                gridLines={'Both'}
                loadingIndicator={{ indicatorType: 'Spinner' }}
                // recordDoubleClick={() => commandClick('edit')}
                autoFit={true}
            >
                <ColumnsDirective>
                    <ColumnDirective
                        width={350}
                        editTemplate={editTemplateNamaAkunBank}
                        field="nama_bank"
                        headerText="Nama Bank"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                    />
                    <ColumnDirective
                        width={350}
                        editTemplate={editTemplateNoRekeningBank}
                        field="no_rekening"
                        headerText="No. Rekening"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                    />
                    <ColumnDirective
                        width={350}
                        editTemplate={editTemplateNamaRekeningBank}
                        field="nama_rekening"
                        headerText="Nama Pemilik"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                    />
                    <ColumnDirective width={350} editTemplate={editTemplateAktifRekening} field="aktif" headerText="Aktif" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />{' '}
                </ColumnsDirective>
                <Inject services={[Edit, Sort]} />
            </GridComponent>
            <div className="panel-pager mt-3">
                <TooltipComponent content="Baru" opensOn="Hover" openDelay={5} target="#btnNew">
                    <TooltipComponent content="Ubah" opensOn="Hover" openDelay={5} target="#btnEdit">
                        <TooltipComponent content="Hapus" opensOn="Hover" openDelay={5} target="#btnDelete">
                            <TooltipComponent content="Info Detail Customer" opensOn="Hover" openDelay={5} target="#btnInfoDetail">
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
                                            id="btnDelete"
                                            type="button"
                                            cssClass="e-danger e-small"
                                            iconCss="e-icons e-small e-trash"
                                            style={{ marginTop: 0 + 'em', marginRight: 0.3 + 'em' }}
                                            onClick={() => {
                                                gridRekeningBankType.refresh();
                                                console.log('dataSource', dataSource);
                                            }}
                                        />
                                    </div>
                                </div>
                            </TooltipComponent>
                        </TooltipComponent>
                    </TooltipComponent>
                </TooltipComponent>
            </div>
        </>
    );
};

export default RekeningBank;
