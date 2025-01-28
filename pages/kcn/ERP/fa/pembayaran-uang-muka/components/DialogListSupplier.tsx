import React, { useRef } from 'react';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-react-popups';

interface DialogListSupplierProps {
  isOpen: boolean;
  onClose: () => void;
  handlePilihSupplier: () => void;
  pencarianSupplier: (e: any, a: any) => void;
  setSelectedSupplier: any;
  dataSource: any;
}

const DialogListSupplier: React.FC<DialogListSupplierProps> = ({ isOpen, onClose, handlePilihSupplier, pencarianSupplier, setSelectedSupplier, dataSource }) => {
  const gridSupplierList = useRef<GridComponent>(null);

  let buttonDaftarAkunKasDetail: ButtonPropsModel[];

  // Tambahan ini untuk button
  buttonDaftarAkunKasDetail = [
    {
      buttonModel: {
        content: 'Pilih',
        //iconCss: 'e-icons e-save',
        cssClass: 'e-primary e-small',
      },
      isFlat: false,
      click: handlePilihSupplier,
    },
    {
      buttonModel: {
        content: 'Batal',
        //iconCss: 'e-icons e-close',
        cssClass: 'e-primary e-small',
        // isPrimary: true,
      },
      isFlat: false,
      click: onClose,
    },
  ];
  return (
    <DialogComponent
      target="#dialogFrmDp"
      style={{ position: 'fixed' }}
      header={'Daftar Supplier'}
      buttons={buttonDaftarAkunKasDetail}
      visible={isOpen}
      isModal={true}
      animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
      allowDragging={true}
      showCloseIcon={true}
      width="415"
      height="440"
      close={onClose}
      closeOnEscape={true}
    >
      <div className="flex">
        <div className="form-input mb-1 mr-1" style={{ width: '40%' }}>
          <TextBoxComponent
            id="cariNoAkunDetail"
            className="searchtext"
            placeholder="Cari Nomor Supplier"
            showClearButton={true}
            input={(args: ChangeEventArgsInput) => {
              const value: any = args.value;
              pencarianSupplier(value, 'no_supp');
            }}
            floatLabelType="Never"
          />
        </div>
        <div className="form-input mb-1 mr-1">
          <TextBoxComponent
            id="cariNamaAkunDetail"
            className="searchtext"
            placeholder="Cari Nama Supplier"
            showClearButton={true}
            input={(args: ChangeEventArgsInput) => {
              const value: any = args.value;
              pencarianSupplier(value, 'nama_relasi');
            }}
            floatLabelType="Never"
          />
        </div>
      </div>
      <GridComponent
        id="dialogSupplierList"
        ref={gridSupplierList}
        locale="id"
        style={{ width: '100%', height: '75%' }}
        dataSource={dataSource}
        selectionSettings={{ mode: 'Row', type: 'Single' }}
        rowHeight={22}
        width={'100%'}
        height={'285'}
        rowSelecting={(args: any) => {
          setSelectedSupplier(args.data);
        }}
        recordDoubleClick={(args: any) => {
          handlePilihSupplier();
        }}
        allowPaging={false}
        allowSorting={true}
        pageSettings={{
          pageSize: 10,
          // pageCount: 10,
          // pageSizes: ['10', '50', '100', 'All']
        }}
      >
        <ColumnsDirective>
          <ColumnDirective field="no_supp" headerText="No. Supplier" headerTextAlign="Center" textAlign="Left" width="75" clipMode="EllipsisWithTooltip" />
          <ColumnDirective field="kode_mu" headerText="MU" headerTextAlign="Center" textAlign="Center" width="50" clipMode="EllipsisWithTooltip" />
          <ColumnDirective field="nama_relasi" headerText="Nama" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
        </ColumnsDirective>
        <Inject services={[Selection]} />
      </GridComponent>
    </DialogComponent>
  );
};

export default DialogListSupplier;
