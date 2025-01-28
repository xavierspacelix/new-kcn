import * as React from 'react';
import { useRouter } from 'next/router';
import styles from './mk.module.css';
import stylesTtb from '../mklist.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlay, faSave, faBackward, faCancel, faFileArchive, faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Dialog, DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-react-popups';
import { Tab, TabComponent } from '@syncfusion/ej2-react-navigations';
import { Tooltip, TooltipComponent, TooltipEventArgs } from '@syncfusion/ej2-react-popups';
import { FocusInEventArgs, ChangeEventArgs as ChangeEventArgsInput, TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DropDownListComponent, ChangeEventArgs as ChangeEventArgsDropDown } from '@syncfusion/ej2-react-dropdowns';
import { DatePickerComponent, MaskedDateTime, ChangeEventArgs as ChangeEventArgsCalendar, RenderDayCellEventArgs } from '@syncfusion/ej2-react-calendars';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid, GridComponent, ColumnDirective, ColumnsDirective, CommandColumn, Inject, Page, Edit, Toolbar, Resize, Selection } from '@syncfusion/ej2-react-grids';
import { table } from '@syncfusion/ej2/grids';

import { Internationalization, loadCldr, L10n, enableRipple, getValue } from '@syncfusion/ej2-base';
import * as gregorian from 'cldr-data/main/id/ca-gregorian.json';
import * as numbers from 'cldr-data/main/id/numbers.json';
import * as timeZoneNames from 'cldr-data/main/id/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json'; // To load the culture based first day of week

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

import idIDLocalization from '@/public/syncfusion/locale.json';
import Swal from 'sweetalert2';
import { myAlertGlobal } from '@/utils/routines';
L10n.load(idIDLocalization);

interface FrmDlgAkunJurnalProps {
    kode_entitas: any;
    isOpen: boolean;
    onClose: any;
    onBatal: any;
    selectedData: any;
    target: any;
    vRefreshData: any;
}

let dgCustomerDlg: Grid | any;
const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

const FrmCustomerDlg = ({ kode_entitas, isOpen, onClose, onBatal, selectedData, target, vRefreshData }: FrmDlgAkunJurnalProps) => {
    const swalToast = swal.mixin({
        toast: true,
        position: 'center',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 3500,
        showClass: {
            popup: `
              animate__animated
              animate__zoomIn
              animate__faster
            `,
        },
        hideClass: {
            popup: `
              animate__animated
              animate__zoomOut
              animate__faster
            `,
        },
    });

    const myAlert = (text: any) => {
        withReactContent(swalToast).fire({
            icon: 'warning',
            title: `<p style="font-size:12px">${text}</p>`,
            width: '100%',
            target: '#frmCustomerDlg',
        });
    };

    const [searchNoSubledgerCustomer, setSearchNoSublegerCustomer] = useState('');
    const [searchNamaSubledgerCustomer, setSearchNamaSublegerCustomer] = useState('');
    const [searchSalesmanSubledgerCustomer, setSearchSalesmanSublegerCustomer] = useState('');
    const [listDaftarSubledgerCustomer, setDaftarSubledgerCustomer] = useState([]);
    const [selectedSubledgerCustomer, setSelectedSubledgerCustomer] = useState<any>('');

    const refreshDaftaSubledgerCustomer = async () => {
        try {
            const response = await axios.get(`${apiUrl}/erp/list_cust_so`, {
                params: {
                    entitas: kode_entitas,
                    param1: searchNamaSubledgerCustomer,
                    param2: searchNoSubledgerCustomer,
                    param3: searchSalesmanSubledgerCustomer,
                },
            });
            const result = response.data;
            if (result.status) {
                setDaftarSubledgerCustomer(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // useEffect(() => {
    //     setTimeout(() => {
    //         refreshDaftaSubledgerCustomer();
    //     }, 500);
    // }, [isOpen, searchNamaSubledgerCustomer, searchNoSubledgerCustomer, searchSalesmanSubledgerCustomer, kode_entitas]);
    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit = refreshDaftaSubledgerCustomer();
            dgCustomerDlg?.setProperties({ dataSource: resultDaftarAkunKredit });
            dgCustomerDlg?.refresh();
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [vRefreshData]);

    return (
        <DialogComponent
            // ref={(d) => (dgCustomerDlg = d)}
            id="frmCustomerDlg"
            name="frmCustomerDlg"
            className="frmCustomerDlg"
            target="#FrmPraBkk"
            style={{ position: 'fixed' }}
            header={'Daftar Subledger Customer'}
            visible={isOpen}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            // enableResize={true}
            allowDragging={true}
            showCloseIcon={true}
            width="950"
            height="400"
            position={{ X: 'center', Y: 'center' }}
            close={() => {
                // setModalDaftarSubledgerCustomer(false);
                setSearchNoSublegerCustomer('');
                setSearchNamaSublegerCustomer('');
                setSearchSalesmanSublegerCustomer('');
                (document.getElementsByName('searchNoSubledgerCustomer')[0] as HTMLFormElement).value = '';
                (document.getElementsByName('searchNamaSubledgerCustomer')[0] as HTMLFormElement).value = '';
                (document.getElementsByName('searchSalesmanSubledgerCustomer')[0] as HTMLFormElement).value = '';
                onClose();
            }}
            closeOnEscape={true}
            // close={() => {
            //     onClose();
            //     // onBatal();
            // }}
        >
            <div className="flex">
                <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="searchNoSubledgerCustomer"
                        name="searchNoSubledgerCustomer"
                        className="searchNoSubledgerCustomer"
                        placeholder="<No. Customer>"
                        showClearButton={true}
                        value={searchNoSubledgerCustomer}
                        input={(args: FocusInEventArgs) => {
                            (document.getElementsByName('searchNamaSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            (document.getElementsByName('searchSalesmanSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            setSearchNamaSublegerCustomer('');
                            setSearchSalesmanSublegerCustomer('');
                            const value: any = args.value;
                            setSearchNoSublegerCustomer(value);
                        }}
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="searchNamaSubledgerCustomer"
                        name="searchNamaSubledgerCustomer"
                        className="searchNamaSubledgerCustomer"
                        placeholder="<Nama Customer>"
                        showClearButton={true}
                        value={searchNamaSubledgerCustomer}
                        input={(args: FocusInEventArgs) => {
                            (document.getElementsByName('searchNoSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            (document.getElementsByName('searchSalesmanSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            setSearchNoSublegerCustomer('');
                            setSearchSalesmanSublegerCustomer('');
                            const value: any = args.value;
                            setSearchNamaSublegerCustomer(value);
                        }}
                    />
                </div>
                <div className="form-input mb-1 mr-1" style={{ width: '100%', display: 'inline-block' }}>
                    <TextBoxComponent
                        id="searchSalesmanSubledgerCustomer"
                        name="searchSalesmanSubledgerCustomer"
                        className="searchSalesmanSubledgerCustomer"
                        placeholder="<Nama Salesman>"
                        showClearButton={true}
                        value={searchSalesmanSubledgerCustomer}
                        input={(args: FocusInEventArgs) => {
                            (document.getElementsByName('searchNoSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            (document.getElementsByName('searchNamaSubledgerCustomer')[0] as HTMLFormElement).value = '';
                            setSearchNoSublegerCustomer('');
                            setSearchNamaSublegerCustomer('');
                            const value: any = args.value;
                            setSearchSalesmanSublegerCustomer(value);
                        }}
                    />
                </div>
            </div>
            <GridComponent
                locale="id"
                ref={(g: any) => (dgCustomerDlg = g)}
                style={{ width: '100%', height: '75%' }}
                dataSource={listDaftarSubledgerCustomer}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'220'}
                rowSelecting={(args: any) => {
                    setSelectedSubledgerCustomer(args.data);
                    // selectedData(args.data);
                }}
                recordDoubleClick={(args: any) => {
                    if (dgCustomerDlg) {
                        const rowIndex: number = args.row.rowIndex;
                        const selectedItems = args.rowData;
                        dgCustomerDlg.selectRow(rowIndex);
                        setSelectedSubledgerCustomer(selectedItems);
                        selectedData(selectedItems);
                        // getFromModalAkunJurnal();
                        onClose();
                    }
                    // handlePilihSubledger_Customer();s
                    // selectedData(args.data);
                    // onClose();
                }}
            >
                <ColumnsDirective>
                    <ColumnDirective allowEditing={false} field="no_cust" headerText="No. Cust" headerTextAlign="Center" textAlign="Center" width="65" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective allowEditing={false} field="nama_relasi" headerText="Nama Akun" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective allowEditing={false} field="alamat_kirim1" headerText="Alamat" headerTextAlign="Center" textAlign="Left" width="200" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective allowEditing={false} field="nama_salesman" headerText="Salesman" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                    <ColumnDirective allowEditing={false} field="status_warna" headerText="Info Detail" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                onClick={() => onBatal()}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                // onClick={() => handlePilihSubledger_Customer()}
                onClick={() => {
                    if (selectedSubledgerCustomer) {
                        selectedData(selectedSubledgerCustomer);
                        onClose();
                    } else {
                        myAlertGlobal(`Silahkan pilih akun terlebih dulu.`, target);
                    }
                }}
            />
        </DialogComponent>
    );
};

export default FrmCustomerDlg;
