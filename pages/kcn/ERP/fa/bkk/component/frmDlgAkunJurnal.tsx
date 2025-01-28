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

import { myAlertGlobal } from '@/utils/routines';
import { Console } from 'console';
L10n.load(idIDLocalization);

interface FrmDlgAkunJurnalProps {
    kode_entitas: any;
    isOpen: boolean;
    onClose: any;
    onBatal: any;
    selectedData: any;
    target: any;
    stateDokumen: any;
    kodeAkun: any;
    listAkunJurnalObjek: any;
    vRefreshDataAkun: any;
    openFrom: any;
}

let dgDlgAkunJurnal: Grid | any;

// const FrmDlgAkunJurnal = ({ kode_entitas, isOpen, onClose, onBatal, selectedData, target, stateDokumen, kodeAkun, stateDialogAja, listAkunJurnalObjek }: FrmDlgAkunJurnalProps) => {
const FrmDlgAkunJurnal = ({ kode_entitas, isOpen, onClose, onBatal, selectedData, target, stateDokumen, kodeAkun, listAkunJurnalObjek, vRefreshDataAkun, openFrom }: FrmDlgAkunJurnalProps) => {
    // console.log('listAkunJurnalObjek', listAkunJurnalObjek);
    // console.log('eeeeeeee');
    const apiUrl = process.env.NEXT_PUBLIC_LOGIN_API || '';

    const [searchNoAkun, setSearchNoAkun] = useState('');
    const [searchNamaAkun, setSearchNamaAkun] = useState('');
    const [filteredDataAkun, setFilteredDataAkun] = useState('');
    // const [listAkunJurnal, setListAkunJurnal] = useState([]);
    const [selectedAkunJurnal, setSelectedAkunJurnal] = useState<any>('');

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
        return withReactContent(swalToast).fire({
            icon: 'warning',
            title: `<p style="font-size:12px">${text}</p>`,
            width: '100%',
            target: '#FrmPraBkk',
        });
    };

    const handleRowDataBound = (args: any) => {
        const rowData = args.data as any; // Cast data sebagai any atau tipe yang tepat

        // Contoh kondisi: jika nilai kolom "status" adalah "Pending"
        if (rowData.header === 'Y') {
            // console.log('style', args.row.style);
            args.row.style.fontWeight = 'bold'; // Warna merah muda
        } else {
            args.row.style.textIndent = '5px';
        }
    };

    const onPilih = async () => {
        // dgDlgAkunJurnal.refresh();

        const cek = await cekKodeAkun(selectedAkunJurnal.kode_akun);

        // console.log('cek', cek);

        if (selectedAkunJurnal.header === 'Y') {
            // setModalAkunJurnal(false);
            onClose();
            myAlert(`No. Akun ${selectedAkunJurnal.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi.`);
        } else if (cek) {
            onClose();
            myAlertGlobal(`No. Akun ${selectedAkunJurnal.no_akun} adalah akun - ${selectedAkunJurnal.nama_akun}. Anda  tidak berhak menggunakan akun ini untuk transaksi.`, 'FrmPraBkk');
        } else {
            if (selectedAkunJurnal) {
                selectedData(selectedAkunJurnal);
                onClose();
            } else {
                myAlertGlobal('Silahkan pilih akun terlebih dulu.', 'frmDlgAkunJurnal');
            }
        }
    };

    const PencarianNoAkun = async (event: string, setSearchNoakunJurnal: Function, setFilteredData: Function, listDaftarSubledgerIsLedgerY: any[]) => {
        const searchValue = event;
        setSearchNoakunJurnal(searchValue);
        const filteredData = SearchDataNoAkun(searchValue, listDaftarSubledgerIsLedgerY);
        setFilteredData(filteredData);

        const cariNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
        if (cariNamaAkun) {
            cariNamaAkun.value = '';
        }
    };

    const SearchDataNoAkun = (keyword: any, listAkunJurnal: any[]) => {
        if (keyword === '') {
            return listAkunJurnal;
        } else {
            const filteredData = listAkunJurnal.filter((item) => item.no_akun.toLowerCase().startsWith(keyword.toLowerCase()));
            return filteredData;
        }
    };

    const PencarianNamaAkun = async (event: string, setSearchNamaAkunJurnal: Function, setFilteredData: Function, listAkunJurnal: any[]) => {
        const searchValue = event;
        setSearchNamaAkunJurnal(searchValue);
        const filteredData = SearchDataNamaAkun(searchValue, listAkunJurnal);
        setFilteredData(filteredData);

        const cariNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
        if (cariNoAkun) {
            cariNoAkun.value = '';
        }
    };

    const SearchDataNamaAkun = (keyword: any, listAkunJurnal: any[]) => {
        if (keyword === '') {
            return listAkunJurnal;
        } else {
            const filteredData = listAkunJurnal.filter((item) => item.nama_akun.toLowerCase().includes(keyword.toLowerCase()));
            return filteredData;
        }
    };

    let resultAkunJabatan: any;
    let resultAkun: any;
    // const refreshDaftarAkun = async () => {
    //     try {
    //         let paramHeader: any;
    //         let paramDetail: any;
    //         paramHeader = `where x.kode_user="${stateDokumen[0].kode_user}"`;
    //         paramDetail = `where x.kode_user="${stateDokumen[0].kode_user}" and x.kode_akun ="${kodeAkun}"`;
    //         const responseAkunJabatan = await axios.get(`${apiUrl}/erp/list_akun_global`, {
    //             params: {
    //                 entitas: stateDokumen[0].kode_entitas,
    //                 param1: 'SQLAkunMBkkJabatan',
    //                 param2: stateDialogAja === 'header' ? paramHeader : paramDetail,
    //                 // param1: 'SQLAkunMBkkJabatan',
    //             },
    //             headers: { Authorization: `Bearer ${stateDokumen[0].token}` },
    //         });
    //         resultAkunJabatan = responseAkunJabatan.data;
    //     } catch (error: any) {
    //         console.error('Error fetching data:', error);
    //     }
    //     try {
    //         const response = await axios.get(`${apiUrl}/erp/list_akun_global`, {
    //             params: {
    //                 entitas: stateDokumen[0].kode_entitas,
    //                 param1: stateDialogAja === 'header' ? 'SQLAkunKas' : 'SQLAkunTransaksiBkk',
    //                 // param1: 'SQLAkunMBkkJabatan',
    //             },
    //             headers: { Authorization: `Bearer ${stateDokumen[0].token}` },
    //         });
    //         resultAkun = response.data;
    //     } catch (error: any) {
    //         console.error('Error fetching data:', error);
    //     }
    //     if (resultAkunJabatan.length < 0) {
    //         setListAkunJurnal(resultAkunJabatan.data);
    //     } else {
    //         setListAkunJurnal(resultAkun.data);
    //     }
    // };

    // useEffect(() => {
    //     // refreshDaftarAkun();
    //     console.log('qqqqqqqqqqqqqqqqq');
    //     setTimeout(() => {
    //         setListAkunJurnal(listAkunJurnalObjek);
    //     }, 500);
    //     // }, [listAkunJurnalObjek]); //, searchNamaAkun, searchNoAkun]);
    // }, [isOpen, listAkunJurnalObjek, searchNamaAkun, searchNoAkun]); //, searchNamaAkun, searchNoAkun]);

    useEffect(() => {
        const async = async () => {
            const resultDaftarAkunKredit: any[] = listAkunJurnalObjek;
            dgDlgAkunJurnal?.setProperties({ dataSource: resultDaftarAkunKredit });
            // dgDlgAkunJurnal?.refresh();
            // setListAkunJurnal(listAkunJurnalObjek);
        };
        async();
    }, [listAkunJurnalObjek, vRefreshDataAkun]);

    // const keyDialogAkun = `${moment().format('HHmmss')}-${JSON.stringify(listAkunJurnal)}`;
    const cekKodeAkun = async (vkodeAkun: any) => {
        const responsecekKodeAkun = await axios.get(`${apiUrl}/erp/cek_kode_akun`, {
            params: {
                entitas: stateDokumen.kode_entitas,
                param1: stateDokumen.kode_user,
                param2: vkodeAkun,
                // entitas: stateDokumen[0].kode_entitas,
                // param1: stateDokumen[0].kode_user,
                // param2: vkodeAkun,
            },
            headers: { Authorization: `Bearer ${stateDokumen.token}` },

            // headers: { Authorization: `Bearer ${stateDokumen[0].token}` },
        });
        const resultKodeAkun = responsecekKodeAkun.data.data;
        if (resultKodeAkun.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    const doubleClickGrid = async (args: any) => {
        await onPilih();
        // const cek = await cekKodeAkun(args.rowData.kode_akun);

        // if (args.rowData.header === 'Y') {
        //     // setModalAkunJurnal(false);
        //     onClose();
        //     myAlert(`No. Akun ${args.rowData.no_akun} adalah akun induk tidak bisa digunakan untuk transaksi.`);
        // } else if (cek) {
        //     onClose();
        //     myAlertGlobal(`No. Akun ${args.rowData.no_akun} adalah akun - ${args.rowData.nama_akun}. Anda  tidak berhak menggunakan akun ini untuk transaksi.`, 'FrmPraBkk');
        // } else {
        //     onPilih();
        //     // if (dgDlgAkunJurnal) {
        //     //     const rowIndex: number = args.row.rowIndex;
        //     //     const selectedItems = args.rowData;
        //     //     dgDlgAkunJurnal.selectRow(rowIndex);
        //     //     setSelectedAkunJurnal(selectedItems);
        //     //     selectedData(selectedItems);

        //     //     onClose();
        //     // }
        // }
    };

    // const templateNamaAkun = (args: any) => {
    //     return <div style={{ fontWeight: args.header === 'Y' ? 'bold' : 'normal' }}>{args.nama_akun}</div>;
    // };

    const gridIndukHeaderJurnal = (props: any) => {
        return <div style={{ background: 'blue', fontWeight: props.header === 'Y' ? 'bold' : 'normal', marginLeft: props.header === 'N' ? '0.5rem' : '0' }}>{props[props.column.field]}</div>;
    };

    return (
        <DialogComponent
            // ref={(g: any) => (dgDlgAkunJurnal = g)}

            id="frmDlgAkunJurnal"
            name="frmDlgAkunJurnal"
            className="frmDlgAkunJurnal"
            target={`#${target}`}
            style={{ position: 'fixed' }}
            header={'Daftar Akun'}
            visible={isOpen}
            isModal={true}
            animationSettings={{ effect: 'FadeZoom', duration: 400, delay: 0 }}
            allowDragging={true}
            // showCloseIcon={true}
            width="425"
            height="525"
            // buttons={buttonDlgTtbMk}
            position={{ X: 'center', Y: 'center' }}
            closeOnEscape={true}
            close={() => {
                setSearchNoAkun('');
                setSearchNamaAkun('');
                const cariNoAkun = document.getElementById('searchNoAkun') as HTMLInputElement;
                if (cariNoAkun) {
                    cariNoAkun.value = '';
                }

                const cariNamaAkun = document.getElementById('searchNamaAkun') as HTMLInputElement;
                if (cariNamaAkun) {
                    cariNamaAkun.value = '';
                }

                onClose();
                // onBatal();
            }}
        >
            <div className="form-input mb-1 mr-1" style={{ width: '150px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNoAkun"
                    // name="searchNoAkun"
                    className="searchtext"
                    placeholder="<No. Akun>"
                    showClearButton={true}
                    value={searchNoAkun}
                    input={(args: ChangeEventArgsInput) => {
                        const value: any = args.value;
                        PencarianNoAkun(value, setSearchNoAkun, setFilteredDataAkun, listAkunJurnalObjek);
                    }}
                    floatLabelType="Never"
                />
            </div>
            <div className="form-input mb-1" style={{ width: '250px', display: 'inline-block' }}>
                <TextBoxComponent
                    id="searchNamaAkun"
                    // name="searchNamaAkun"
                    className="searchtext"
                    placeholder="<Nama Akun>"
                    showClearButton={true}
                    value={searchNamaAkun}
                    input={(args: ChangeEventArgsInput) => {
                        const value: any = args.value;
                        PencarianNamaAkun(value, setSearchNamaAkun, setFilteredDataAkun, listAkunJurnalObjek);
                    }}
                    floatLabelType="Never"
                />
            </div>
            <GridComponent
                id="dgDlgAkunJurnal"
                locale="id"
                ref={(g: any) => (dgDlgAkunJurnal = g)}
                dataSource={searchNoAkun !== '' || searchNamaAkun !== '' ? filteredDataAkun : listAkunJurnalObjek}
                selectionSettings={{ mode: 'Row', type: 'Single' }}
                rowHeight={22}
                width={'100%'}
                height={'275'}
                gridLines={'Both'}
                rowSelecting={(args: any) => {
                    setSelectedAkunJurnal(args.data);
                }}
                recordDoubleClick={(args: any) => doubleClickGrid(args)}
                rowDataBound={handleRowDataBound}

                // allowPaging={true}
                // allowSorting={true}
                // pageSettings={{
                //      pageSize: 10,
                //      pageCount: 10,
                //     pageSizes: ['10', '50', '100', 'All'],
                // }}
            >
                <ColumnsDirective>
                    <ColumnDirective
                        // template={(args: any) => TemplateNoAkun(args)}
                        field="no_akun"
                        headerText="No. Akun"
                        headerTextAlign="Center"
                        textAlign="Left"
                        width="30"
                        clipMode="EllipsisWithTooltip"
                        // template={gridIndukHeaderJurnal}
                        allowEditing={false}
                    />
                    <ColumnDirective
                        // template={(args: any) => TemplateNamaAkun(args)}
                        field="nama_akun"
                        headerText="Keterangan"
                        headerTextAlign="Center"
                        textAlign="Left"
                        width="60"
                        clipMode="EllipsisWithTooltip"
                        // template={gridIndukHeaderJurnal}
                        allowEditing={false}
                    />
                </ColumnsDirective>
                <Inject services={[Selection]} />
            </GridComponent>
            <ButtonComponent
                id="buBatalDokumen1"
                content="Batal"
                cssClass="e-primary e-small"
                // iconCss="e-icons e-small e-close"
                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                onClick={() => {
                    onBatal();
                }}
            />
            <ButtonComponent
                id="buSimpanDokumen1"
                content="Pilih"
                cssClass="e-primary e-small"
                // iconCss="e-icons e-small e-save"
                style={{ float: 'right', width: '90px', marginTop: 20, marginRight: 10, backgroundColor: '#3b3f5c' }}
                onClick={onPilih}
                // onClick={refreshDaftarAkun}
            />
        </DialogComponent>
    );
};

export default FrmDlgAkunJurnal;
