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
import { FillFromSQL, myAlertGlobal } from '@/utils/routines';
L10n.load(idIDLocalization);

interface FrmDlgAkunJurnalProps {
    stateDokumen: any;
    isOpen: boolean;
    onClose: any;
    onBatal: any;
    selectedData: any;
    target: any;
    kodeAkun: any;
    vRefreshData: any;
}

let dgDepartement: Grid | any;

// const FrmDlgAkunJurnal: React.FC<FrmMkProps> = ({}: FrmMkProps) => {
const FrmDlgDepartement = ({ stateDokumen, isOpen, onClose, onBatal, selectedData, target, kodeAkun, vRefreshData }: FrmDlgAkunJurnalProps) => {
    const [searchNamaDepartment, setSearchNamaDepartment] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<any>('');
    const [filteredDataDepartment, setFilteredDataDepartment] = useState('');
    const [listDepartment, setlistDepartment] = useState([]);
    const [modalListDepartment, setModalListDepartment] = useState(false);

    const PencarianNamaDepartment = async (event: string, setSearchNamaDepartment: Function, setFilteredDataDepartment: Function, listDepartment: any[]) => {
        const searchValue = event;
        setSearchNamaDepartment(searchValue);
        const filteredData = SearchDataNamaDepartment(searchValue, listDepartment);
        setFilteredDataDepartment(filteredData);
    };

    const SearchDataNamaDepartment = (keyword: any, listDepartemen: any[]) => {
        if (keyword === '') {
            return listDepartemen;
        } else {
            const filteredData = listDepartemen.filter((item) => item.nama_dept.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const divisiDepartment = async () => {
        await FillFromSQL(stateDokumen?.kode_entitas, 'departemen')
            .then((result: any) => {
                const modifiedData = result.map((item: any) => ({
                    ...item,
                    dept_ku: item.no_dept_dept + '-' + item.nama_dept,
                    dept_ku2: item.kode_dept + '*' + item.no_dept_dept + '-' + item.nama_dept,
                }));
                setlistDepartment(modifiedData);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // useEffect(() => {
    //     setTimeout(() => {
    //         divisiDepartment();
    //     }, 500);
    // }, [isOpen, stateDokumen?.kode_entitas]);
    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit = divisiDepartment();
            dgDepartement?.setProperties({ dataSource: resultDaftarAkunKredit });
            dgDepartement?.refresh();
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [vRefreshData]);

    return (
        <div>
            <DialogComponent
                // ref={(d) => (dgDepartement = d)}
                id="frmDlgDepartement"
                name="frmDlgDepartement"
                className="frmDlgDepartement"
                target={`#${target}`}
                style={{ position: 'fixed' }}
                header={'Daftar Departmen'}
                visible={isOpen}
                isModal={true}
                animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
                enableResize={true}
                allowDragging={true}
                showCloseIcon={true}
                width="300"
                height="400"
                position={{ X: 'center', Y: 'center' }}
                zIndex={997}
                close={() => {
                    // setModalListDepartment(false);
                    setSearchNamaDepartment('');

                    const cariNamaDepartment = document.getElementById('cariNamaDepartment') as HTMLInputElement;
                    if (cariNamaDepartment) {
                        cariNamaDepartment.value = '';
                    }
                    onClose();
                }}
                closeOnEscape={true}
            >
                <div className="flex">
                    <div className="form-input mb-1 mr-1" style={{ display: 'inline-block' }}>
                        <TextBoxComponent
                            id="cariNamaDepartment"
                            className="searchtext"
                            placeholder="Cari Nama Departmen"
                            showClearButton={true}
                            input={(args: ChangeEventArgsInput) => {
                                const value: any = args.value;
                                PencarianNamaDepartment(value, setSearchNamaDepartment, setFilteredDataDepartment, listDepartment);
                            }}
                            floatLabelType="Never"
                        />
                    </div>
                </div>
                <GridComponent
                    id="dgDepartement"
                    locale="idIsDepartmen"
                    style={{ width: '100%', height: '75%' }}
                    ref={(g: any) => (dgDepartement = g)}
                    dataSource={searchNamaDepartment !== '' ? filteredDataDepartment : listDepartment}
                    selectionSettings={{ mode: 'Row', type: 'Single' }}
                    rowHeight={22}
                    gridLines={'Both'}
                    width={'100%'}
                    height={'220'}
                    rowSelecting={(args: any) => {
                        setSelectedDepartment(args.data);
                        // selectedData(args.data);
                    }}
                    recordDoubleClick={(args: any) => {
                        if (dgDepartement) {
                            const rowIndex: number = args.row.rowIndex;
                            const selectedItems = args.rowData;
                            dgDepartement.selectRow(rowIndex);
                            setSelectedDepartment(selectedItems);
                            selectedData(selectedItems);
                            // getFromModalAkunJurnal();
                            onClose();
                        }
                    }}
                >
                    <ColumnsDirective>
                        <ColumnDirective allowEditing={false} field="nama_dept" headerText="" headerTextAlign="Center" textAlign="Left" width="100" clipMode="EllipsisWithTooltip" />
                    </ColumnsDirective>
                    <Inject services={[Selection]} />
                </GridComponent>
                <ButtonComponent
                    id="buBatalDokumen1"
                    content="Batal"
                    cssClass="e-primary e-small"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    // onClick={() => setModalListDepartment(false)}
                    onClick={() => onBatal()}
                />
                <ButtonComponent
                    id="buSimpanDokumen1"
                    content="Pilih"
                    cssClass="e-primary e-small"
                    style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                    // onClick={() => handlePilihDepartment()}
                    onClick={() => {
                        if (selectedDepartment) {
                            selectedData(selectedDepartment);
                            onClose();
                        } else {
                            myAlertGlobal(`Silahkan pilih akun terlebih dulu.`, target);
                        }
                    }}
                />
            </DialogComponent>
            ;
        </div>
    );
};

export default FrmDlgDepartement;
