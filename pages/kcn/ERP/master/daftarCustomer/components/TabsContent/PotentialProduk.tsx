import React from 'react';
import { PotensiaProdukProps } from '../../functions/definition';
import { ColumnDirective, ColumnsDirective, Edit, Grid, GridComponent, Inject, Sort } from '@syncfusion/ej2-react-grids';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
interface DaftarKontakProps {
    dataSource: PotensiaProdukProps[];
    params: {
        userid: string;
        kode_cust: string;
        token: string;
        entitas: string;
    };
    dsProdukKategori: any[];
    dsProdukKelompok: any[];
    setFormPotensialProdukField: React.Dispatch<React.SetStateAction<PotensiaProdukProps[]>>;
}
let gridPotensialProdukType: GridComponent;
const PotentialProduk = ({ dataSource, params, setFormPotensialProdukField, dsProdukKategori, dsProdukKelompok }: DaftarKontakProps) => {
    const editKategoriProduk = (args: any) => {
        return (
            <DropDownListComponent
                id="kategori"
                name="kategori"
                dataSource={dsProdukKategori}
                fields={{ value: 'grp', text: 'grp' }}
                floatLabelType="Never"
                placeholder={args.kategori}
                onChange={(e: any) => {
                    if (gridPotensialProdukType.dataSource && Array.isArray(gridPotensialProdukType.dataSource)) {
                        gridPotensialProdukType.dataSource[args.index] = {
                            ...gridPotensialProdukType.dataSource[args.index],
                            kategori: e.value,
                        };
                    }
                }}
                value={args.kategori}
            />
        );
    };
    const editKelompokProduk = (args: any) => {
        return (
            <DropDownListComponent
                id="kelompok"
                name="kelompok"
                dataSource={dsProdukKelompok}
                fields={{ value: 'kel', text: 'kel' }}
                floatLabelType="Never"
                placeholder={args.kelompok}
                onChange={(e: any) => {
                    if (gridPotensialProdukType.dataSource && Array.isArray(gridPotensialProdukType.dataSource)) {
                        gridPotensialProdukType.dataSource[args.index] = {
                            ...gridPotensialProdukType.dataSource[args.index],
                            kelompok: e.value,
                        };
                    }
                }}
                value={args.kelompok}
            />
        );
    };
    const editCatatan = (args: any) => {
        return (
            <TextBoxComponent
                id="catatan"
                name="catatan"
                floatLabelType="Never"
                placeholder={args.catatan}
                onChange={(e: any) => {
                    if (gridPotensialProdukType.dataSource && Array.isArray(gridPotensialProdukType.dataSource)) {
                        gridPotensialProdukType.dataSource[args.index] = {
                            ...gridPotensialProdukType.dataSource[args.index],
                            catatan: e.value,
                        };
                    }
                }}
                value={args.catatan}
            />
        );
    };
    const commandClick = (proses: string) => {
        const newData = {
            kode_cust: params.kode_cust,
            kategori: '',
            kelompok: '',
            catatan: '',
        };
        if (proses === 'new') {
            const totalLine = (gridPotensialProdukType.dataSource as PotensiaProdukProps[]).length;
            gridPotensialProdukType.addRecord(newData, totalLine);
            setTimeout(() => {
                gridPotensialProdukType.startEdit();
            }, 200);
        } else if (proses === 'edit') {
            gridPotensialProdukType.startEdit();
        } else if (proses === 'delete') {
            const selectedRecord = gridPotensialProdukType.getSelectedRowIndexes()[0];
            dataSource.splice(selectedRecord, 1);
            gridPotensialProdukType.refresh();
        }
    };

    return (
        <>
            <GridComponent
                id="gridPotensial"
                locale="id"
                dataSource={dataSource}
                allowExcelExport={true}
                ref={(gridDK: GridComponent) => (gridPotensialProdukType = gridDK as GridComponent)}
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
                        validationRules={{ required: [true, 'Kategori Harus Diisi!'] }}
                        width={450}
                        editTemplate={editKategoriProduk}
                        field="kategori"
                        headerText="Kategori"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                    />
                    <ColumnDirective
                        validationRules={{ required: [true, 'Kelompok Harus Diisi!'] }}
                        width={450}
                        editTemplate={editKelompokProduk}
                        field="kelompok"
                        headerText="Kelompok"
                        headerTextAlign="Center"
                        textAlign="Left"
                        clipMode="EllipsisWithTooltip"
                    />
                    <ColumnDirective width={550} editTemplate={editCatatan} field="catatan" headerText="Catatan" headerTextAlign="Center" textAlign="Left" clipMode="EllipsisWithTooltip" />
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

export default PotentialProduk;
